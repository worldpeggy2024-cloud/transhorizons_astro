/*
 * Per-shot navigation actions. Each is `async (ctx, params)`; `ctx` carries
 * the Playwright page, the config, the current shot, dry-run flag, event
 * logging, and helpers to switch the recorded page.
 *
 * Selectors were derived by reading src/components and src/pages-react —
 * accessible roles and visible text wherever possible. When something here
 * stops resolving, the site changed; read the component again rather than
 * guessing.
 *
 * `prepare[id]` reaches the page state a shot needs when it is re-captured on
 * its own (`--shot 25a`); in a full run the state carries over from the
 * previous shot and prepare is skipped.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sleep, hold, settle, scrollSettled, smoothScrollTo, typeSlowly, drag, box, expectVisible, waitForTop } from './helpers.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));

// ─── small local helpers ─────────────────────────────────────────────────────

/** The desktop header nav (never the hero CTA or the mobile panel). */
const headerNav = (page) => page.locator('header nav').first();

/** Framework section header (role=button, aria-expanded) inside #<sectionId>. */
const sectionHeader = (page, sectionId) => page.locator(`#${CSS_escape(sectionId)} [role="button"][aria-expanded]`).first();

function CSS_escape(s) { return s.replace(/([^\w-])/g, '\\$1'); }

async function openSectionIfCollapsed(ctx, sectionId) {
  const header = sectionHeader(ctx.page, sectionId);
  await expectVisible(header, `section header #${sectionId}`);
  if ((await header.getAttribute('aria-expanded')) !== 'true') {
    await header.click();
    await ctx.page.waitForFunction((id) => document.querySelector(`#${CSS.escape(id)} [role="button"][aria-expanded]`)?.getAttribute('aria-expanded') === 'true', sectionId, { timeout: 5000 });
  }
}

/** Poll the injected Audio hook for an event matching `match`, newer than `afterEpochMs`. */
async function waitAudioEvent(ctx, { ev, srcIncludes, afterEpochMs = 0, timeout = 15000 }) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const found = await ctx.page.evaluate(({ ev, srcIncludes, afterEpochMs }) => {
      const list = (window.__thAudioEvents || []);
      for (let i = list.length - 1; i >= 0; i--) {
        const e = list[i];
        if (e.ev === ev && e.t >= afterEpochMs && (!srcIncludes || (e.src || '').includes(srcIncludes))) return e;
      }
      return null;
    }, { ev, srcIncludes, afterEpochMs });
    if (found) return found;
    await sleep(40);
  }
  throw new Error(`audio event "${ev}"${srcIncludes ? ` for ${srcIncludes}` : ''} not observed within ${timeout} ms — is the recording reachable on this host?`);
}

/*
 * Did the press actually start playback?
 *
 * `paused` flips to false SYNCHRONOUSLY inside play(), before a single byte is
 * fetched, so this answers within a frame or two and never waits on the
 * network. That precision is what makes the retry in shot 21 safe: a press
 * that worked is detected long before the retry window closes, so a second
 * press is never sent to a report that is already playing (which would pause
 * it).
 */
async function waitPlayCalled(ctx, timeout = 700) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const on = await ctx.page.evaluate(() => (window.__thAudios || []).some((a) => !a.paused && !a.ended));
    if (on) return true;
    await sleep(50);
  }
  return false;
}

/*
 * THE FRAME LOCK. Returns the wall-clock millisecond at which the report was
 * audibly at a given playhead position, sampled together so the pair is
 * self-consistent: { t, ct }. MEASURED, not inferred from which media event
 * happens to fire — 'playing' does not fire again after a seek on an element
 * that never stopped, which is exactly this case.
 *
 * Date.now() is read INSIDE the page, on the same machine clock the recorder
 * stamps frames with, so no round-trip skew enters the pair.
 */
async function waitPlayhead(ctx, { minTime = 0, timeout = 15000 } = {}) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const s = await ctx.page.evaluate((minTime) => {
      const a = (window.__thAudios || []).find((x) => !x.paused && !x.ended && x.readyState >= 3 && x.currentTime >= minTime);
      return a ? { t: Date.now(), ct: a.currentTime, src: a.currentSrc || a.src } : null;
    }, minTime);
    if (s) return s;
    await sleep(20);
  }
  throw new Error(`the report never played past ${minTime.toFixed(2)}s within ${timeout} ms — is the recording reachable on this host?`);
}

async function waitReactCountryPage(page, h1) {
  await expectVisible(page.getByRole('heading', { level: 1, name: h1, exact: true }), `country h1 "${h1}"`, 30000);
  // React island mounted: the report's audio bar exists only once hydrated.
  await expectVisible(page.getByRole('button', { name: /Listen to the report/ }), 'report audio bar', 30000);
  await expectVisible(page.locator('svg[role="img"]').first(), 'locator globe', 30000);
}

// ─── actions ─────────────────────────────────────────────────────────────────

export const actions = {

  // 1 — Homepage hero, English, still.
  async homeHero(ctx) {
    const { page } = ctx;
    await page.goto(ctx.url('/'), { waitUntil: 'domcontentloaded' });
    await expectVisible(page.getByRole('heading', { level: 1, name: 'Research & Maps' }), 'hero headline', 30000);
    await settle(page);
    // The film opens on the finished hero, not on the page loading.
    ctx.markStart();
    await ctx.snapshot();
    await hold(ctx, 1700); // hero entrance transitions (last one starts at 900 ms, runs 700 ms)
  },

  // 2 / 3 — Language toggle in the header.
  async switchLanguage(ctx, { to, expectHeadline }) {
    const { page } = ctx;
    await headerNav(page).getByRole('button', { name: to, exact: true }).click();
    await expectVisible(page.getByRole('heading', { level: 1, name: expectHeadline }), `headline "${expectHeadline}"`);
    await hold(ctx, 400);
  },

  // 4 / 8 / 9 — Header nav button that smooth-scrolls to a home section.
  async navScrollTo(ctx, { nav, sectionId, expectVisible: expectText }) {
    const { page } = ctx;
    const btn = headerNav(page).getByRole('button', { name: nav, exact: true });
    await expectVisible(btn, `nav "${nav}"`);
    let top = NaN;
    for (let attempt = 1; attempt <= 2; attempt++) {
      await btn.click();
      top = await waitForTop(page, `#${sectionId}`, { timeout: 4000 }); // site scroll runs 800 ms
      if (top >= -40 && top <= 200) break;
      ctx.event('note', { text: `nav "${nav}" click did not scroll on attempt ${attempt} (top=${Math.round(top)}); retried` });
    }
    if (!(top >= -40 && top <= 200)) throw new Error(`#${sectionId} not at the top after nav click (top=${Math.round(top)})`);
    await scrollSettled(page);
    if (expectText) await expectVisible(page.getByText(expectText, { exact: true }), `"${expectText}"`);
  },

  // 5 — Slow scroll to a link.
  async scrollToLink(ctx, { text, block = 'center' }) {
    const link = ctx.page.getByRole('link', { name: text, exact: true });
    await expectVisible(link, `link "${text}"`);
    await smoothScrollTo(ctx, { locator: link, block });
  },

  // 6 — Publications page: prize + curriculum titles.
  async openPublications(ctx, { holdPrizeMs }) {
    const { page } = ctx;
    ctx.state.homeScrollY = await page.evaluate(() => window.scrollY);
    await page.getByRole('link', { name: 'Writing & Translation Archive', exact: true }).click();
    await page.waitForURL(/\/publications$/, { timeout: 15000 });
    await expectVisible(page.getByRole('heading', { level: 1, name: /Translation and publication Archive/i }), 'publications h1');
    await settle(page);
    const prize = page.getByRole('heading', { name: /Prix de la ministre/ }).first();
    await expectVisible(prize, 'prize heading');
    await smoothScrollTo(ctx, { locator: prize, block: 'start', offset: 80, pxPerFrame: 24 });
    await hold(ctx, holdPrizeMs);
    const firstBook = page.getByRole('heading', { level: 3, name: /Comportement organisationnel/ }).first();
    await expectVisible(firstBook, 'first book title');
    await smoothScrollTo(ctx, { locator: firstBook, block: 'start', offset: 160, pxPerFrame: 24 });
  },

  // 7 — Browser back; the doc expects the top of the homepage.
  async browserBackToHomeTop(ctx) {
    const { page } = ctx;
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await expectVisible(page.getByRole('heading', { level: 1, name: 'Research & Maps' }), 'hero headline');
    await settle(page);
    const y = await page.evaluate(() => window.scrollY);
    ctx.event('browserBack', { scrollYAfterBack: y, note: y > 40 ? 'browser restored the About scroll position; scrolled to top by the pipeline' : 'landed at top' });
    if (y > 40) await smoothScrollTo(ctx, { y: 0, pxPerFrame: 60 });
  },

  // 10 — Hover state.
  async hoverButton(ctx, { name }) {
    const btn = ctx.page.getByRole('button', { name, exact: true });
    await expectVisible(btn, `button "${name}"`);
    await btn.hover();
  },

  // 11 — Open an analysis card from the home grid.
  async openArticleCard(ctx, { heading, url }) {
    const { page } = ctx;
    const card = page.locator('article').filter({ has: page.getByRole('heading', { name: heading }) }).first();
    await expectVisible(card, `card "${heading}"`);
    await card.hover();
    await hold(ctx, 250);
    await card.click();
    await page.waitForURL((u) => u.pathname === url, { timeout: 15000 });
    await expectVisible(page.locator('h1').first(), 'article title');
    await settle(page);
  },

  // 12 — Article audio: voice picker open, then playback starts.
  async articleAudio(ctx, { holdPickerMs, voiceLabel }) {
    const { page } = ctx;
    const picker = page.getByRole('button', { name: 'Choose voice' }).first();
    await expectVisible(picker, 'article voice picker');
    await picker.click();
    const studio = page.getByRole('button', { name: new RegExp(voiceLabel) }).first();
    await expectVisible(studio, `voice "${voiceLabel}" in the menu`);
    await hold(ctx, holdPickerMs);
    await studio.click();
    const t = Date.now();
    await page.getByRole('button', { name: 'Play', exact: true }).first().click();
    const ev = await waitAudioEvent(ctx, { ev: 'playing', afterEpochMs: t - 5 });
    ctx.event('articleAudio.playing', { epochMs: ev.t, currentTime: ev.ct, src: ev.src });
    await expectVisible(page.getByRole('slider', { name: 'Playback position' }).last(), 'floating transport');
  },

  // 13 — Scroll through the system maps.
  async scrollThroughMaps(ctx, { endAlt, pxPerFrame }) {
    const img = ctx.page.getByRole('img', { name: endAlt });
    await expectVisible(img, `map image "${endAlt}"`);
    await smoothScrollTo(ctx, { locator: img, block: 'end', offset: 60, pxPerFrame });
  },

  // 14 — Back to the home grid, open the multipolar essay.
  async backAndOpenArticle(ctx, { heading, url }) {
    const { page } = ctx;
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await expectVisible(page.getByRole('heading', { level: 1, name: 'Research & Maps' }), 'hero headline');
    await settle(page);
    const card = page.locator('article').filter({ has: page.getByRole('heading', { name: heading }) }).first();
    await expectVisible(card, `card "${heading}"`);
    const inView = await card.evaluate((el) => { const r = el.getBoundingClientRect(); return r.top >= 0 && r.bottom <= window.innerHeight; });
    if (!inView) await smoothScrollTo(ctx, { locator: card, block: 'center', pxPerFrame: 40 });
    await card.hover();
    await card.click();
    await page.waitForURL((u) => u.pathname === url, { timeout: 15000 });
    await expectVisible(page.locator('h1').first(), 'article title');
    await settle(page);
  },

  // 15 — Sphere of influence embed, then the chokepoint map toggle.
  async sphereAndChokepoints(ctx, { sphereHeading, holdSphereMs, toggleHeading, toggleLabels, toggleHoldMs }) {
    const { page } = ctx;
    const frame = page.locator(`iframe[title="${sphereHeading}"]`);
    await expectVisible(frame, `sphere-of-influence iframe`);
    await smoothScrollTo(ctx, { locator: frame, block: 'center', pxPerFrame: 30 });
    ctx.event('note', { text: 'The Sphere of Influence embed is a static SVG page (no interaction exists); held instead.' });
    await hold(ctx, holdSphereMs);
    const h2 = page.getByRole('heading', { level: 2, name: toggleHeading });
    await expectVisible(h2, `heading "${toggleHeading}"`);
    await smoothScrollTo(ctx, { locator: h2, block: 'start', offset: 40, pxPerFrame: 30 });
    for (const label of toggleLabels) {
      const b = page.getByRole('button', { name: label, exact: true });
      await expectVisible(b, `toggle "${label}"`);
      await b.click();
      await hold(ctx, toggleHoldMs);
    }
  },

  // 16 — Home, scroll to the Global Situation banner (rotating globe).
  async homeGlobeBanner(ctx) {
    const { page } = ctx;
    await page.locator('header').getByRole('button', { name: 'Home', exact: true }).click();
    await page.waitForURL((u) => u.pathname === '/', { timeout: 15000 });
    await expectVisible(page.getByRole('heading', { level: 1, name: 'Research & Maps' }), 'hero headline');
    await settle(page);
    await smoothScrollTo(ctx, { locator: page.locator('#globe-teaser'), block: 'center', pxPerFrame: 14 });
    await expectVisible(page.locator('#globe-teaser canvas'), 'teaser globe canvas');
  },

  // 17 — World Views.
  async openWorldViews(ctx) {
    const { page } = ctx;
    await page.locator('#globe-teaser').getByRole('link').first().click();
    await page.waitForURL((u) => u.pathname === '/world-analysis', { timeout: 15000 });
    await expectVisible(page.getByRole('heading', { level: 1, name: 'World Views' }), 'World Views h1');
    await expectVisible(page.locator('.globe-col canvas'), 'globe canvas', 45000);
    await page.locator('.globe-col').getByText('Loading…').waitFor({ state: 'hidden', timeout: 45000 }).catch(() => {});
    await settle(page);
    await hold(ctx, 1200); // textures fade in
  },

  // 18 — Country filter: a keyword, typed character by character.
  async typeKeyword(ctx, { keyword, expectCountries, expectCount }) {
    const { page } = ctx;
    const input = page.getByPlaceholder('Search countries or keywords…');
    await expectVisible(input, 'country search input');
    await typeSlowly(ctx, input, keyword);
    await sleep(300);
    // Only the VISIBLE list entries (the SSR mirror and hidden layouts also carry country links).
    const names = await page.locator('a[href^="/country/"]:visible').evaluateAll((as) => as.map((a) => a.textContent.trim()));
    ctx.event('filterResult', { keyword, countries: names });
    for (const want of expectCountries || []) {
      if (!names.some((n) => n.includes(want))) throw new Error(`keyword "${keyword}" did not surface "${want}" (got: ${names.join(', ') || 'nothing'})`);
    }
    if (expectCount && names.length !== expectCount) throw new Error(`keyword "${keyword}" surfaced ${names.length} countries (${names.join(', ')}), expected ${expectCount} — a country NAME matches it too`);
  },

  // 19 — Open Canada from the filtered list.
  async openCountryFromList(ctx, { name, cca3 }) {
    const { page } = ctx;
    const link = page.locator(`a[href="/country/${cca3}"]`).first();
    await expectVisible(link, `list entry for ${name}`);
    await link.hover();
    await hold(ctx, 250);
    await link.click();
    await page.waitForURL(new RegExp(`/country/${cca3}$`, 'i'), { timeout: 30000 });
    await waitReactCountryPage(page, name);
    await settle(page);
  },

  // 20 — Voice picker on the report's audio bar.
  async reportVoicePicker(ctx, { holdPickerMs }) {
    const { page } = ctx;
    const picker = page.getByRole('button', { name: 'Choose voice' }).first();
    await expectVisible(picker, 'report voice picker');
    await smoothScrollTo(ctx, { locator: picker, block: 'start', offset: 120, pxPerFrame: 20 });
    await picker.click();
    const studio = page.getByRole('button', { name: /Studio recording/ }).first();
    await expectVisible(studio, '"Studio recording" in the voice menu');
    await hold(ctx, holdPickerMs);
    await studio.click();
    await studio.waitFor({ state: 'hidden', timeout: 5000 });
  },

  // 21 — The report reads itself: frame-locked playback of the site's own recording.
  async reportReadsAloud(ctx, { pxPerFrame, pauseAfter, scrollPx = 900 }) {
    const { page, config } = ctx;
    const { mode = 'bar', section, entrySeconds } = config.reportAudio;
    let t = Date.now();
    if (mode === 'section') {
      const header = sectionHeader(page, section);
      await expectVisible(header, `section "${section}" header`);
      await smoothScrollTo(ctx, { locator: header, block: 'start', offset: 64, pxPerFrame: 20 });
      await openSectionIfCollapsed(ctx, section);
      // exact: the section HEADER is itself a role=button whose accessible name
      // contains this label, so a substring match would click the header and
      // merely collapse the section.
      const listen = page.locator(`#${CSS_escape(section)}`).getByRole('button', { name: 'Listen to this section', exact: true });
      await expectVisible(listen, `"Listen to this section" on ${section}`);
      /*
       * TWO PRESSES, on the site as deployed. With the studio recording chosen,
       * the first press only switches which section the player holds: the hook
       * sets the new src on an <audio preload="none">, so `loadedmetadata`
       * never fires and its deferred play() never runs. The second press takes
       * the "same section" branch and calls play() directly, which forces the
       * load. Browser voices need one press — they have no file to fetch.
       *
       * So: press, check whether play() was actually called, press again only
       * if it was not. Written to survive the fix — once one press suffices the
       * check passes immediately and no second press is sent.
       */
      for (let attempt = 1; attempt <= 3; attempt++) {
        t = Date.now();
        await listen.click();
        if (await waitPlayCalled(ctx, attempt === 1 ? 700 : 2500)) {
          if (attempt > 1) ctx.event('note', { text: `section playback needed ${attempt} presses (the site's two-press section-audio behaviour)` });
          break;
        }
        if (attempt === 3) throw new Error(`"Listen to this section" on ${section} started nothing after 3 presses — is the recording reachable on this host?`);
      }
    } else {
      const bar = page.getByRole('button', { name: /Listen to the report/ }).first();
      await expectVisible(bar, '"Listen to the report" bar');
      await smoothScrollTo(ctx, { locator: bar, block: 'start', offset: 120, pxPerFrame: 20 });
      t = Date.now();
      await bar.click();
    }
    let lock = await waitPlayhead(ctx, { minTime: 0 });
    if (entrySeconds > 0) {
      // Seek the element that is actually sounding; React's timeupdate keeps
      // the transport in step, so the pill shows the new position at once.
      await page.evaluate((entry) => {
        const a = (window.__thAudios || []).find((x) => !x.paused && !x.ended);
        if (!a) throw new Error('no playing audio element to seek');
        a.currentTime = entry;
      }, entrySeconds);
      lock = await waitPlayhead(ctx, { minTime: entrySeconds });
    }
    const file = lock.src.split('/').pop();
    ctx.event('reportAudio.playing', { epochMs: lock.t, currentTime: lock.ct, src: lock.src, file, section, entrySeconds, mode });
    await expectVisible(page.getByRole('slider', { name: 'Playback position' }).last(), 'floating transport');
    // Move slowly down through the section headers while the recording plays;
    // the transport pill tracks the audio.
    const y = await page.evaluate(() => window.scrollY);
    await smoothScrollTo(ctx, { y: y + scrollPx, pxPerFrame });
    await ctx.holdUntilEnd();
    if (pauseAfter) {
      const t3 = Date.now();
      await page.getByRole('button', { name: 'Pause', exact: true }).last().click();
      const pev = await waitAudioEvent(ctx, { ev: 'pause', afterEpochMs: t3 - 5, timeout: 5000 });
      ctx.event('reportAudio.paused', { epochMs: pev.t, currentTime: pev.ct });
    }
  },

  // 22 — Sections collapse: open one, then collapse it to reveal the ones beneath.
  async collapseSection(ctx, { sectionId, holdOpenMs }) {
    const { page } = ctx;
    const header = sectionHeader(page, sectionId);
    await expectVisible(header, `section header #${sectionId}`);
    await smoothScrollTo(ctx, { locator: header, block: 'start', offset: 64, pxPerFrame: 20 });
    if ((await header.getAttribute('aria-expanded')) !== 'true') {
      await openSectionIfCollapsed(ctx, sectionId);
      await hold(ctx, holdOpenMs);
    }
    await header.click();
    await page.waitForFunction((id) => document.querySelector(`#${CSS.escape(id)} [role="button"][aria-expanded]`)?.getAttribute('aria-expanded') === 'false', sectionId, { timeout: 5000 });
    await scrollSettled(page);
  },

  // 23 — Dark and light reading modes.
  async toggleTheme(ctx, { holdDarkMs, returnToLight }) {
    const { page } = ctx;
    await page.getByRole('button', { name: 'Dark mode', exact: true }).click();
    await expectVisible(page.locator('div.dark').first(), 'dark wrapper');
    await hold(ctx, holdDarkMs);
    if (returnToLight) {
      await page.getByRole('button', { name: 'Light mode', exact: true }).click();
      await page.locator('div.dark').first().waitFor({ state: 'detached', timeout: 5000 });
    }
  },

  // 24 — Internal cross-reference ([§] anchor) inside Capacity to Deliver.
  async crossReference(ctx, { sectionId }) {
    const { page } = ctx;
    const header = sectionHeader(page, sectionId);
    await expectVisible(header, `#${sectionId} header`);
    await smoothScrollTo(ctx, { locator: header, block: 'start', offset: 64, pxPerFrame: 24 });
    await openSectionIfCollapsed(ctx, sectionId);
    const anchor = page.locator(`#${CSS_escape(sectionId)} a[title*="."]`).filter({ hasText: '[§]' }).first();
    await expectVisible(anchor, `a [§] cross-reference inside #${sectionId}`);
    const target = await anchor.getAttribute('title');
    await smoothScrollTo(ctx, { locator: anchor, block: 'center', pxPerFrame: 18 });
    await hold(ctx, 500);
    await anchor.click();
    await sleep(ctx.dry ? 100 : 900);
    await scrollSettled(page);
    ctx.event('crossReference', { target });
  },

  // 25a — Rotate the header locator globe, click the United States.
  async rotateGlobeClickCountry(ctx, { dragDx, dragDy, dragMs, target, cca3 }) {
    const { page } = ctx;
    await smoothScrollTo(ctx, { y: 0, pxPerFrame: 36 });
    const svg = page.locator('svg[role="img"][aria-label*="Locator globe"]').first();
    await expectVisible(svg, 'locator globe');
    const b = await box(svg, 'locator globe');
    const c = { x: b.x + b.width / 2, y: b.y + b.height / 2 };
    await drag(ctx, c, { x: c.x + dragDx, y: c.y + dragDy }, dragMs, 48);
    await hold(ctx, 350);
    // A point inside the target country's path, verified with elementFromPoint.
    const pt = await svg.evaluate((el, target) => {
      const paths = [...el.querySelectorAll('path')].filter((p) => p.querySelector('title')?.textContent === target);
      if (!paths.length) return { error: `no path titled "${target}" on the globe` };
      const p = paths[0];
      const r = p.getBoundingClientRect();
      if (!r.width || !r.height) return { error: `"${target}" is not on the visible hemisphere after the drag` };
      // Sample a grid over the path's box and keep the points that actually
      // hit it (Alaska stretches the USA box, so its centre is not on land);
      // prefer the hit nearest the globe's centre, i.e. the most face-on.
      const sr = el.getBoundingClientRect();
      const gx = sr.x + sr.width / 2, gy = sr.y + sr.height / 2;
      const F = [0.5, 0.45, 0.55, 0.4, 0.6, 0.35, 0.65, 0.3, 0.7, 0.25, 0.75, 0.2, 0.8, 0.15, 0.85, 0.1, 0.9];
      const cands = [];
      for (const fy of F) for (const fx of F) {
        const x = r.x + r.width * fx, y = r.y + r.height * fy;
        const hit = document.elementFromPoint(x, y);
        if (hit === p) cands.push({ x, y, d: Math.hypot(x - gx, y - gy) });
      }
      if (!cands.length) return { error: `no hit-testable point found inside "${target}" (box ${Math.round(r.width)}x${Math.round(r.height)})` };
      cands.sort((a, b) => a.d - b.d);
      return { x: cands[0].x, y: cands[0].y, bbox: { x: r.x, y: r.y, w: r.width, h: r.height } };
    }, target);
    if (pt.error) throw new Error(`globe click: ${pt.error}`);
    ctx.event('globeClick', { target, at: { x: Math.round(pt.x), y: Math.round(pt.y) }, bbox: pt.bbox });
    await page.mouse.move(pt.x, pt.y, { steps: 12 });
    await hold(ctx, 250);
    await page.mouse.click(pt.x, pt.y);
    await page.waitForURL(new RegExp(`/country/${cca3}$`, 'i'), { timeout: 30000 });
  },

  // 25b — New report loads; scroll to its section headers.
  async scrollToSectionHeaders(ctx, { expectH1, pxPerFrame }) {
    const { page } = ctx;
    await waitReactCountryPage(page, expectH1);
    await settle(page);
    const territory = sectionHeader(page, 'territory');
    await expectVisible(territory, 'Territory header');
    await smoothScrollTo(ctx, { locator: territory, block: 'start', offset: 72, pxPerFrame });
  },

  // 26 — Citation → source, then the site's Back toast restores the reading position.
  async citationAndBack(ctx, { sectionId, holdSourceMs }) {
    const { page } = ctx;
    const header = sectionHeader(page, sectionId);
    await smoothScrollTo(ctx, { locator: header, block: 'start', offset: 64, pxPerFrame: 24 });
    await openSectionIfCollapsed(ctx, sectionId);
    const cite = page.locator(`#${CSS_escape(sectionId)} a[href^="#source-"]`).first();
    await expectVisible(cite, `a citation marker inside #${sectionId}`);
    await smoothScrollTo(ctx, { locator: cite, block: 'center', pxPerFrame: 18 });
    await hold(ctx, 400);
    const before = await page.evaluate(() => window.scrollY);
    await cite.click();
    await expectVisible(page.getByText('You were reading:'), 'Back toast');
    await sleep(ctx.dry ? 100 : 900);
    await scrollSettled(page);
    await hold(ctx, holdSourceMs);
    await page.getByRole('button', { name: 'Back', exact: true }).click();
    await sleep(ctx.dry ? 100 : 900);
    await scrollSettled(page);
    const after = await page.evaluate(() => window.scrollY);
    const restored = Math.abs(after - before) <= 8;
    ctx.event('readingPositionRestored', { before, after, restored });
    if (!restored) throw new Error(`reading position NOT restored (before ${before}, after ${after}) — the shot-26 narration depends on it`);
  },

  // 27 — Open a source in a new tab, show it, close it.
  async openSourceLink(ctx, { hostPattern, preferHosts = [], skipPattern = '\.pdf($|[?#])', externalHoldMs, maxTries = 4 }) {
    const { page } = ctx;
    const re = new RegExp(hostPattern, 'i');
    const hrefs = await page.locator('a[id^="source-"]').evaluateAll((as) => as.map((a) => a.href));
    const rank = (h) => { const i = preferHosts.findIndex((p) => new URL(h).hostname.endsWith(p)); return i < 0 ? 99 : i; };
    const skip = skipPattern ? new RegExp(skipPattern, 'i') : null;
    // PDFs are skipped: headless Chromium has no PDF viewer, so the tab would be blank.
    const cands = hrefs.filter((h) => re.test(h) && !(skip && skip.test(h))).sort((a, b) => rank(a) - rank(b));
    if (!cands.length) throw new Error(`no source link matches /${hostPattern}/ among ${hrefs.length} sources`);
    const CHALLENGE = /security verification|verifying you are|just a moment|checking your browser|access denied|attention required|enable javascript and cookies/i;
    let shown = null;
    for (const href of cands.slice(0, maxTries)) {
      const link = page.locator(`a[id^="source-"][href="${href}"]`).first();
      await smoothScrollTo(ctx, { locator: link, block: 'center', pxPerFrame: 44 });
      await link.hover();
      await hold(ctx, 400);
      const [popup] = await Promise.all([page.context().waitForEvent('page', { timeout: 15000 }), link.click()]);
      await popup.waitForLoadState('domcontentloaded', { timeout: 8000 }).catch(() => {});
      // Give the external page a moment to paint, but never wait for every
      // third-party asset: two seconds on someone else's page makes the point.
      await popup.waitForLoadState('load', { timeout: 2500 }).catch(() => {});
      const probe = await popup.evaluate(() => ({
        text: (document.title + ' ' + (document.body?.innerText || '')).slice(0, 4000),
        modals: [...document.querySelectorAll('[role="dialog"], [aria-modal="true"]')].filter((el) => { const r = el.getBoundingClientRect(); return r.width > 200 && r.height > 100; }).length,
      })).catch(() => ({ text: '', modals: 0 }));
      if (CHALLENGE.test(probe.text) || probe.modals > 0) {
        ctx.event('note', { text: `source ${new URL(href).hostname} opened with ${probe.modals ? 'a modal dialog' : 'a bot-check interstitial'}; skipped` });
        await popup.close();
        continue;
      }
      await ctx.attachPage(popup, { screencast: true, focus: true });
      await ctx.snapshot(popup);
      ctx.event('externalSource', { url: href });
      await hold(ctx, externalHoldMs);
      await ctx.detachPage(popup);
      await popup.close();
      await ctx.snapshot();
      await hold(ctx, 300);
      shown = href;
      break;
    }
    if (!shown) throw new Error(`every candidate source (${cands.slice(0, maxTries).map((h) => new URL(h).hostname).join(', ')}) opened with an interstitial or modal — add a clean host to preferHosts or widen hostPattern`);
  },

  // 28 — Thematic Maps, framed on the Critical Minerals card alone.
  async thematicMapsCard(ctx, { cardTitle, viewport, background, hoverAtEnd }) {
    const context2 = await ctx.browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, deviceScaleFactor: viewport.deviceScaleFactor, locale: 'en-CA', colorScheme: 'light' });
    const page2 = await context2.newPage();
    // No screencast here: at deviceScaleFactor 2 the screencast delivers
    // CSS-pixel (960x540) frames; explicit screenshots come out 1920x1080.
    await ctx.attachPage(page2, { screencast: false, focus: true });
    await page2.goto(ctx.url('/world-analysis'), { waitUntil: 'domcontentloaded' });
    await expectVisible(page2.getByRole('heading', { level: 2, name: 'Thematic Maps' }), 'Thematic Maps heading', 45000);
    const card = page2.locator('div.group').filter({ has: page2.getByRole('heading', { name: cardTitle }) }).first();
    await expectVisible(card, `card "${cardTitle}"`);
    await page2.locator('.globe-col').getByText('Loading…').waitFor({ state: 'hidden', timeout: 45000 }).catch(() => {});
    const saved = ctx.page;
    ctx.page = page2;
    await smoothScrollTo(ctx, { locator: card, block: 'center', pxPerFrame: 40 });
    await settle(page2);
    await page2.locator(`img[src*="thumb-critical-minerals"]`).first().evaluate((img) => img.decode?.().catch(() => {})).catch(() => {});
    ctx.markStart();
    await ctx.snapshot(page2);
    const b = await box(card, 'card');
    const s = viewport.deviceScaleFactor;
    ctx.setCrop({ x: Math.round(b.x * s), y: Math.round(b.y * s), w: Math.round(b.width * s), h: Math.round(b.height * s), background, deviceScaleFactor: s, cssViewport: { width: viewport.width, height: viewport.height } });
    await hold(ctx, 1200);
    if (hoverAtEnd) { await card.hover(); await sleep(350); await ctx.snapshot(page2); }
    await ctx.holdUntilEnd();
    ctx.page = saved;
    await ctx.detachPage(page2);
    await context2.close();
  },

  // 29 — The minerals map, one filter interaction.
  async mineralsMap(ctx, { url, viewMode, mineral, holdBetweenMs }) {
    const { page } = ctx;
    await page.goto(ctx.url(url), { waitUntil: 'domcontentloaded' });
    await expectVisible(page.getByRole('heading', { level: 1, name: 'Critical Minerals World Map' }), 'minerals map h1', 30000);
    await page.waitForFunction(() => document.querySelectorAll('svg path').length > 100, null, { timeout: 30000 });
    await settle(page);
    ctx.markStart();
    await hold(ctx, 900);
    await page.getByRole('button', { name: viewMode, exact: true }).click();
    await hold(ctx, holdBetweenMs);
    const chip = page.getByRole('button', { name: new RegExp(`\\b${mineral}\\b`) }).first();
    await expectVisible(chip, `mineral chip "${mineral}"`);
    await chip.hover();
    await hold(ctx, 250);
    await chip.click();
  },

  // 30 — Footer, contact address.
  async homeFooter(ctx) {
    const { page } = ctx;
    await page.goto(ctx.url('/'), { waitUntil: 'domcontentloaded' });
    await expectVisible(page.getByRole('heading', { level: 1, name: 'Research & Maps' }), 'hero headline', 30000);
    await settle(page);
    const footer = page.locator('footer').last();
    const footerTop = await footer.evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
    await page.evaluate((y) => window.scrollTo({ top: Math.max(0, y - 700), behavior: 'instant' }), footerTop);
    await sleep(ctx.dry ? 50 : 400);
    ctx.markStart();
    await smoothScrollTo(ctx, { locator: footer, block: 'end', offset: 0, pxPerFrame: 12 });
    await expectVisible(page.locator('footer').getByText('contact@transhorizons.net'), 'footer contact address');
    await expectVisible(page.locator('footer').getByText('Montreal, Quebec, Canada'), 'footer city line');
  },
};

// ─── standalone preparation (for `--shot <id>`) ──────────────────────────────

const gotoHome = async (ctx) => actions.homeHero(ctx);
const gotoHomeSection = (id) => async (ctx) => { await gotoHome(ctx); await ctx.page.evaluate((id) => document.getElementById(id)?.scrollIntoView({ block: 'start' }), id); await settle(ctx.page); };
const gotoArticle = (url) => async (ctx) => { await ctx.page.goto(ctx.url(url), { waitUntil: 'domcontentloaded' }); await expectVisible(ctx.page.locator('h1').first(), 'article title', 30000); await settle(ctx.page); };
const gotoWorldViews = async (ctx) => { await ctx.page.goto(ctx.url('/world-analysis'), { waitUntil: 'domcontentloaded' }); await expectVisible(ctx.page.locator('.globe-col canvas'), 'globe canvas', 45000); await settle(ctx.page); };
const gotoCountry = (cca3, name) => async (ctx) => { await ctx.page.goto(ctx.url(`/country/${cca3}`), { waitUntil: 'domcontentloaded' }); await waitReactCountryPage(ctx.page, name); await settle(ctx.page); };
const gotoCountrySources = (cca3, name, sectionId) => async (ctx) => {
  await gotoCountry(cca3, name)(ctx);
  await openSectionIfCollapsed(ctx, sectionId);
  const cite = ctx.page.locator(`#${CSS_escape(sectionId)} a[href^="#source-"]`).first();
  await cite.click();
  await sleep(1000);
  await ctx.page.getByRole('button', { name: 'Back', exact: true }).click().catch(() => {});
  await sleep(1000);
};

export const prepare = {
  '2': gotoHome, '3': gotoHome, '4': gotoHome,
  '5': gotoHomeSection('story'),
  '6': gotoHomeSection('story'),
  '7': async (ctx) => { await gotoHomeSection('story')(ctx); await ctx.page.getByRole('link', { name: 'Writing & Translation Archive', exact: true }).click(); await ctx.page.waitForURL(/\/publications$/); await settle(ctx.page); },
  '8': gotoHome, '9': gotoHome,
  '10': gotoHomeSection('portfolio'), '11': gotoHomeSection('portfolio'),
  '12': gotoArticle('/portfolio/resource-civilization'),
  '13': gotoArticle('/portfolio/resource-civilization'),
  '14': async (ctx) => { await gotoHomeSection('portfolio')(ctx); await ctx.page.locator('article').filter({ has: ctx.page.getByRole('heading', { name: 'Canada as a Resource Civilization' }) }).first().click(); await ctx.page.waitForURL(/resource-civilization/); await settle(ctx.page); },
  '15': gotoArticle('/portfolio/canada-multipolar'),
  '16': gotoArticle('/portfolio/canada-multipolar'),
  '17': gotoHomeSection('globe-teaser'),
  '18': gotoWorldViews,
  '19': async (ctx) => { await gotoWorldViews(ctx); },
  '20': gotoCountry('can', 'Canada'),
  '21': gotoCountry('can', 'Canada'),
  '22': gotoCountry('can', 'Canada'),
  '23': gotoCountry('can', 'Canada'),
  '24': gotoCountry('can', 'Canada'),
  '25a': gotoCountry('can', 'Canada'),
  '25b': async (ctx) => { await ctx.page.goto(ctx.url('/country/usa'), { waitUntil: 'domcontentloaded' }); },
  '26': gotoCountry('usa', 'United States'),
  '27': gotoCountrySources('usa', 'United States', 'economy'),
  '28': gotoCountry('usa', 'United States'),
  '29': gotoWorldViews,
  '30': gotoWorldViews,
};

export { here as actionsDir };
