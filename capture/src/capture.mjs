/*
 * Capture runner.
 *
 *   node src/capture.mjs --dry            walk the sequence, assert every selector, write out/manifest.dry.json, record nothing
 *   node src/capture.mjs                  full frame capture → out/frames/<shot>/ + out/manifest.json
 *   node src/capture.mjs --shot 25a       re-capture one shot (with its `prepare`), splice into the existing manifest
 *   options: --base <url>  --headed  --format png|jpeg  --from <id> --to <id>  --narration-dir <dir>  --keep-open
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import { config as baseConfig } from '../shots.mjs';
import { actions, prepare } from './actions.mjs';
import { Recorder } from './screencast.mjs';
import { sleep } from './helpers.mjs';
import { findNarrationFile, narrationFileBase, probeSeconds } from './lib.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const outDir = path.join(root, 'out');
const framesDir = path.join(outDir, 'frames');
const narrationDir = path.resolve(root, (() => { const i = process.argv.indexOf('--narration-dir'); return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : 'narration'; })());

// ─── args ────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const flag = (name) => argv.includes(`--${name}`);
const opt = (name, def) => { const i = argv.indexOf(`--${name}`); return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : def; };
const dry = flag('dry');
const onlyShot = opt('shot', null);
const fromId = opt('from', null);
const toId = opt('to', null);
const headed = flag('headed');
// A partial run touches only some shots and must SPLICE into the manifest.
const partial = !!(onlyShot || fromId || toId);
const config = { ...baseConfig, baseUrl: opt('base', baseConfig.baseUrl), frameFormat: opt('format', baseConfig.frameFormat) };

const log = (...a) => console.log(new Date().toISOString().slice(11, 23), ...a);

// ─── Audio instrumentation (injected before any page script) ─────────────────
// Wraps window.Audio so the elements the site creates (they are never attached
// to the DOM) can be observed: exact play/pause/seek timestamps for the frame
// lock in shot 21, and the element to seek when an entry point is configured.
const AUDIO_HOOK = `(() => {
  const Native = window.Audio; const list = []; const events = [];
  window.__thAudios = list; window.__thAudioEvents = events;
  const hook = (a) => { list.push(a); for (const ev of ['play','playing','pause','seeked','ended']) a.addEventListener(ev, () => events.push({ ev, t: Date.now(), ct: a.currentTime, src: a.currentSrc || a.src })); };
  function Wrapped(...args) { const a = new Native(...args); hook(a); return a; }
  Wrapped.prototype = Native.prototype; window.Audio = Wrapped;
})();`;

// ─── manifest helpers ────────────────────────────────────────────────────────
const manifestPath = path.join(outDir, dry ? 'manifest.dry.json' : 'manifest.json');
function loadManifest() {
  if (!fs.existsSync(manifestPath)) return null;
  try { return JSON.parse(fs.readFileSync(manifestPath, 'utf8')); } catch { return null; }
}
function timeline(shots) {
  let t = 0;
  for (const s of shots) { s.startMs = t; s.endMs = t + s.durationMs; t = s.endMs; }
  return t;
}
function narrationMinMs(shot) {
  if (!shot.narration) return 0;
  let max = 0;
  for (const lang of ['en', 'fr']) {
    if (!shot.narration[lang]) continue;
    const f = findNarrationFile(narrationDir, narrationFileBase(shot.id, lang));
    if (!f) continue;
    const s = probeSeconds(f);
    if (s) max = Math.max(max, Math.round(s * 1000) + 400);
  }
  return max;
}

// ─── main ────────────────────────────────────────────────────────────────────
async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const existing = partial ? loadManifest() : null;
  if (partial && !existing && !dry) throw new Error(`a partial run needs an existing ${path.basename(manifestPath)} to splice into — run a full capture first.`);

  const all = config.shots;
  let seq = all;
  if (onlyShot) {
    seq = all.filter((s) => s.id === onlyShot);
    if (!seq.length) throw new Error(`unknown shot id "${onlyShot}"`);
  } else if (fromId || toId) {
    const a = fromId ? all.findIndex((s) => s.id === fromId) : 0;
    const b = toId ? all.findIndex((s) => s.id === toId) : all.length - 1;
    if (a < 0 || b < 0) throw new Error('--from/--to: unknown shot id');
    seq = all.slice(a, b + 1);
  }

  log(`${dry ? 'DRY RUN' : 'CAPTURE'} · ${config.baseUrl} · ${seq.length} shot(s) · ${config.viewport.width}x${config.viewport.height}@${config.viewport.deviceScaleFactor} · ${config.fps} fps · ${config.frameFormat}`);

  // channel 'chromium' = NEW headless mode: the full browser with real GPU
  // WebGL. Playwright's default headless shell renders the globes through
  // SwiftShader at ~3 frames per second, which is unusable for capture.
  const browser = await chromium.launch({
    headless: !headed,
    channel: 'chromium',
    args: ['--autoplay-policy=no-user-gesture-required', '--hide-scrollbars', '--disable-backgrounding-occluded-windows', '--disable-renderer-backgrounding'],
  });
  // A plain desktop user-agent: new headless advertises "HeadlessChrome",
  // which some source sites answer with a bot-check page instead of content.
  const major = (browser.version().split('.')[0]) || '140';
  const userAgent = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${major}.0.0.0 Safari/537.36`;
  const context = await browser.newContext({
    viewport: { width: config.viewport.width, height: config.viewport.height },
    deviceScaleFactor: config.viewport.deviceScaleFactor,
    locale: 'en-CA', colorScheme: 'light', reducedMotion: 'no-preference', userAgent,
  });
  await context.addInitScript(AUDIO_HOOK);
  const page = await context.newPage();
  page.on('pageerror', (e) => log(`  [page error] ${e.message}`));
  {
    await page.goto('about:blank');
    const gpu = await page.evaluate(() => { const gl = document.createElement('canvas').getContext('webgl'); const d = gl && gl.getExtension('WEBGL_debug_renderer_info'); return d ? String(gl.getParameter(d.UNMASKED_RENDERER_WEBGL)) : 'no webgl'; });
    log(`webgl: ${gpu.slice(0, 80)}`);
    if (/swiftshader/i.test(gpu)) log('  WARNING: software WebGL — the globes will crawl. Use --headed or check the GPU.');
  }

  const recorder = dry ? null : new Recorder({ outDir: framesDir, format: config.frameFormat, quality: config.jpegQuality, maxWidth: config.viewport.width, maxHeight: config.viewport.height, log });
  if (recorder) await recorder.attach(page, { focus: true });

  const results = [];
  const state = {};
  let failed = null;

  for (const shot of seq) {
    const action = actions[shot.action];
    if (!action) throw new Error(`shot ${shot.id}: unknown action "${shot.action}"`);
    const ctx = {
      page, context, browser, config, shot, dry, log, state,
      url: (p) => new URL(p, config.baseUrl).toString(),
      t0: 0, events: [], crop: null, visualStartMs: 0,
      event(name, data = {}) { this.events.push({ name, tMs: Date.now() - this.t0, ...data }); },
      markStart() { this.visualStartMs = Date.now() - this.t0; },
      setCrop(c) { this.crop = c; },
      // The scripted duration counts from the VISUAL start (markStart), so a
      // shot that begins with a page switch still holds its full length.
      remainingMs() { return Math.max(0, this.t0 + this.visualStartMs + this.minMs - Date.now()); },
      async holdUntilEnd() { if (!dry) await sleep(this.remainingMs()); },
      async attachPage(p, opts) { if (recorder) await recorder.attach(p, opts); },
      async detachPage(p) { if (recorder) await recorder.detach(p); },
      async snapshot(p) { if (recorder) await recorder.snapshot(p || this.page); },
    };

    // Standalone (--shot) or a --from range: the first shot must reach the
    // page state the previous shots would have produced.
    if (shot === seq[0] && shot !== all[0] && prepare[shot.id]) {
      log(`shot ${shot.id}: prepare (standalone state)`);
      await prepare[shot.id](ctx);
      // Prepare is not part of the shot: it reuses the shot actions (some of
      // which call markStart/event), so discard anything they recorded. Without
      // this the shot inherits a visual start stamped before the clock existed.
      ctx.visualStartMs = 0;
      ctx.events = [];
    }

    const narrMin = narrationMinMs(shot);
    ctx.minMs = Math.max(shot.seconds * 1000, narrMin);
    ctx.t0 = Date.now();
    if (recorder) await recorder.beginShot(shot.id, page, ctx.t0);
    log(`shot ${shot.id} · ${shot.action} · scripted ${shot.seconds}s${narrMin > shot.seconds * 1000 ? ` (narration needs ${(narrMin / 1000).toFixed(1)}s)` : ''}`);
    try {
      await action(ctx, shot.params || {});
      if (!dry) await sleep(ctx.remainingMs());
    } catch (e) {
      failed = { id: shot.id, error: e };
      try { await ctx.page.screenshot({ path: path.join(outDir, `failed-${shot.id}.png`) }); } catch { /* page gone */ }
      log(`  ✗ shot ${shot.id} FAILED: ${e.message}`);
      if (recorder) await recorder.endShot();
      break;
    }
    let frames = recorder ? await recorder.endShot() : [];
    let durationMs = Date.now() - ctx.t0;
    // A shot that switched pages discards frames from before its visual start.
    if (ctx.visualStartMs > 0) {
      const cut = ctx.visualStartMs;
      const kept = frames.filter((f) => f.tMs >= cut);
      const before = frames.filter((f) => f.tMs < cut);
      const last = before.pop();
      // The frame showing at the visual start is kept (re-timed to 0); the
      // rest of the pre-start frames are deleted from disk.
      for (const f of before) fs.rmSync(path.join(framesDir, shot.id, f.file), { force: true });
      if (last && kept.length && kept[0].tMs === cut) fs.rmSync(path.join(framesDir, shot.id, last.file), { force: true });
      frames = (last && (!kept.length || kept[0].tMs > cut) ? [{ ...last, tMs: cut }] : []).concat(kept).map((f) => ({ ...f, tMs: f.tMs - cut }));
      for (const ev of ctx.events) ev.tMs -= cut;
      durationMs -= cut;
    }
    const rec = {
      id: shot.id, action: shot.action, scriptedSeconds: shot.seconds, durationMs, frameCount: frames.length,
      narration: !!shot.narration, reportAudio: !!shot.reportAudio, crop: ctx.crop, events: ctx.events, frames,
      wallStartEpochMs: ctx.t0 + ctx.visualStartMs,
    };
    results.push(rec);
    log(`  ✓ ${(durationMs / 1000).toFixed(2)}s · ${frames.length} frames${ctx.events.length ? ' · ' + ctx.events.map((e) => e.name).join(', ') : ''}`);
  }

  // Closing card frames (both languages) — only on full (non-dry) runs or --shot closing.
  if (!dry && !failed && (!partial || onlyShot === 'closing')) {
    const dir = path.join(framesDir, 'closing');
    fs.mkdirSync(dir, { recursive: true });
    for (const lang of ['en', 'fr']) {
      await page.goto(pathToFileURL(path.join(here, 'closing-card.html')).toString());
      await page.evaluate((t) => { document.getElementById('text').textContent = t; }, config.closing.text[lang]);
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: path.join(dir, `${lang}.png`), type: 'png' });
    }
    log('closing card rendered (en, fr)');
  }

  if (!flag('keep-open')) await browser.close();

  // Merge into the manifest.
  let manifest = existing || { version: 1, baseUrl: config.baseUrl, viewport: config.viewport, fps: config.fps, frameFormat: config.frameFormat, dry, createdAt: new Date().toISOString(), shots: [] };
  // Any PARTIAL run (--shot, or a --from/--to range) splices into the existing
  // manifest; only a full run replaces it. Getting this wrong silently drops
  // every shot outside the range from the film while its frames sit on disk.
  if (partial) {
    for (const r of results) {
      const i = manifest.shots.findIndex((s) => s.id === r.id);
      if (i >= 0) manifest.shots[i] = r; else manifest.shots.push(r);
    }
    // keep config order
    const order = new Map(all.map((s, i) => [s.id, i]));
    manifest.shots.sort((a, b) => (order.get(a.id) ?? 999) - (order.get(b.id) ?? 999));
  } else {
    manifest.shots = results;
    manifest.baseUrl = config.baseUrl; manifest.fps = config.fps; manifest.viewport = config.viewport; manifest.frameFormat = config.frameFormat; manifest.dry = dry;
  }
  manifest.updatedAt = new Date().toISOString();
  manifest.totalMs = timeline(manifest.shots);
  manifest.closing = { seconds: config.closing.seconds, frames: { en: 'closing/en.png', fr: 'closing/fr.png' } };
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  // Summary
  console.log('\n id    scripted   actual   frames  events');
  for (const s of manifest.shots) console.log(` ${s.id.padEnd(5)} ${String(s.scriptedSeconds + 's').padStart(8)} ${(s.durationMs / 1000).toFixed(2).padStart(8)}s ${String(s.frameCount).padStart(7)}  ${s.events.map((e) => e.name).join(', ')}`);
  console.log(` total ${(manifest.totalMs / 1000).toFixed(1)}s (+ ${config.closing.seconds}s closing card)`);
  console.log(`\nmanifest: ${manifestPath}`);
  if (failed) { console.error(`\nFAILED at shot ${failed.id}: ${failed.error.stack || failed.error.message}`); process.exit(1); }
}

main().catch((e) => { console.error(e.stack || e.message); process.exit(1); });
