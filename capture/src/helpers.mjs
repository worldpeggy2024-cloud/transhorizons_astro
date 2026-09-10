/*
 * Shared helpers for the shot actions: waits, smooth scrolling, typing.
 * All scrolling is an injected requestAnimationFrame loop — never mouse.wheel.
 */

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const DEBUG = !!process.env.FILM_DEBUG;
const dbg = (...a) => { if (DEBUG) console.log('   [debug]', ...a); };

/** Hold the current frame; skipped in dry runs. */
export async function hold(ctx, ms) {
  if (ctx.dry || ms <= 0) return;
  await sleep(ms);
}

/** Wait until the page is quiet: network idle, fonts ready, scroll stable. */
export async function settle(page, { networkIdle = true, timeout = 20000 } = {}) {
  const t0 = Date.now();
  if (networkIdle) {
    try { await page.waitForLoadState('networkidle', { timeout }); } catch { dbg('settle: networkidle timed out'); }
  }
  const t1 = Date.now();
  try { await page.evaluate(() => document.fonts && document.fonts.ready); } catch { /* navigating */ }
  await scrollSettled(page);
  dbg(`settle: networkidle ${t1 - t0} ms, fonts+scroll ${Date.now() - t1} ms`);
}

/** Resolve once window.scrollY has not changed for ~4 animation frames. */
export async function scrollSettled(page, timeout = 5000) {
  try {
    await page.evaluate((timeout) => new Promise((resolve) => {
      let last = window.scrollY, stable = 0;
      const started = performance.now();
      const step = () => {
        const y = window.scrollY;
        stable = y === last ? stable + 1 : 0;
        last = y;
        if (stable >= 4 || performance.now() - started > timeout) return resolve();
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }), timeout);
  } catch { /* page navigated meanwhile */ }
}

/**
 * Smooth scroll to an absolute Y (or to a locator with an offset) using an
 * injected rAF loop at a constant pixels-per-frame, easing over the final
 * stretch so the stop is not abrupt.
 */
export async function smoothScrollTo(ctx, { y, locator, block = 'start', offset = 100, pxPerFrame } = {}) {
  const page = ctx.page;
  const speed = pxPerFrame ?? ctx.config.scroll.pxPerFrame;
  let targetY = y;
  if (locator) {
    const handle = await locator.first().elementHandle({ timeout: 10000 });
    if (!handle) throw new Error('smoothScrollTo: locator resolved to nothing');
    targetY = await handle.evaluate((el, { block, offset }) => {
      const r = el.getBoundingClientRect();
      const top = r.top + window.scrollY;
      if (block === 'center') return top + r.height / 2 - window.innerHeight / 2;
      if (block === 'end') return top + r.height - window.innerHeight + offset;
      return top - offset;
    }, { block, offset });
  }
  if (typeof targetY !== 'number' || Number.isNaN(targetY)) throw new Error('smoothScrollTo: no target');
  const speedUsed = ctx.dry ? speed * 6 : speed;
  const t0 = Date.now();
  const stats = await page.evaluate(({ targetY, speed }) => new Promise((resolve) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const goal = Math.max(0, Math.min(max, Math.round(targetY)));
    const startY = window.scrollY;
    let frames = 0;
    const step = () => {
      frames++;
      const y = window.scrollY;
      const d = goal - y;
      if (Math.abs(d) < 1) { window.scrollTo({ top: goal, behavior: 'instant' }); return resolve({ startY, goal, frames }); }
      // Constant speed, easing out over the last 240px.
      const ease = Math.min(1, Math.abs(d) / 240);
      const dy = Math.sign(d) * Math.max(1, Math.min(Math.abs(d), speed * (0.25 + 0.75 * ease)));
      // behavior 'instant' overrides the site's CSS scroll-behavior: smooth,
      // which otherwise turns every per-frame step into a fresh 2px animation.
      window.scrollTo({ top: y + dy, behavior: 'instant' });
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }), { targetY, speed: speedUsed });
  const t1 = Date.now();
  await scrollSettled(page);
  dbg(`scroll ${stats.startY}→${stats.goal} in ${stats.frames} frames / ${t1 - t0} ms (${(stats.frames / ((t1 - t0) / 1000)).toFixed(0)} fps), settle ${Date.now() - t1} ms`);
}

/** Type character by character with a realistic delay (dry runs go faster). */
export async function typeSlowly(ctx, locator, text) {
  const delay = ctx.dry ? 20 : ctx.config.typing.delayMs;
  await locator.click();
  await locator.pressSequentially(text, { delay });
}

/** Human-looking drag with page.mouse, in `steps` moves over `ms`. */
export async function drag(ctx, from, to, ms = 1500, steps = 40) {
  const { page } = ctx;
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  const per = ctx.dry ? 0 : ms / steps;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; // ease in-out
    await page.mouse.move(from.x + (to.x - from.x) * e, from.y + (to.y - from.y) * e);
    if (per) await sleep(per);
  }
  await page.mouse.up();
}

/** Bounding box in CSS px of the first match, or throw. */
export async function box(locator, what = 'element') {
  const b = await locator.first().boundingBox();
  if (!b) throw new Error(`${what}: not visible / no bounding box`);
  return b;
}

/** Expect a locator to be visible within `timeout`; throws with a clear message. */
export async function expectVisible(locator, what, timeout = 15000) {
  try {
    await locator.first().waitFor({ state: 'visible', timeout });
  } catch {
    throw new Error(`${what}: not visible after ${timeout} ms`);
  }
}

/** Poll until the element's top edge is within [min, max] px of the viewport top. */
export async function waitForTop(page, selector, { min = -40, max = 200, timeout = 5000 } = {}) {
  const deadline = Date.now() + timeout;
  let top = NaN;
  while (Date.now() < deadline) {
    top = await page.locator(selector).first().evaluate((el) => el.getBoundingClientRect().top).catch(() => NaN);
    if (top >= min && top <= max) return top;
    await sleep(100);
  }
  return top;
}
