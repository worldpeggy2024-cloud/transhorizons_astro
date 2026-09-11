/*
 * How wide should the film's browser be?
 *
 * The article column is capped at 1000 px, so at a 1920-wide viewport it fills
 * about half the frame and the rest is margin. A narrower browser fills the
 * frame the way the site is designed to be read — but the capture path
 * constrains what can then be delivered:
 *
 *   The CDP screencast returns frames in CSS pixels, NOT device pixels
 *   (measured on this machine: a 960-CSS viewport at deviceScaleFactor 2
 *   yields 960x540 frames). So a natively-1080p film needs a 1920-CSS
 *   viewport. A 1280-CSS capture is natively 1280x720 and would have to be
 *   upscaled 1.5x to reach 1080p, which softens text — the thing this film is
 *   made of.
 *
 * This renders the same article at the same scroll position in both, reached
 * the way the FILM reaches it (clicking the card on the homepage, which is a
 * client-side route into the React layout — a direct URL would serve the
 * separate .astro page instead and compare the wrong thing).
 *
 *   node src/viewport-compare.mjs [--anchor "System overview"] [--card "Canada as a Resource Civilization"]
 *
 * Both images are written at 1920x1080 device pixels, so the comparison is
 * about LAYOUT, not sharpness.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { config } from '../shots.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(here, '..', 'out', 'viewport-compare');
const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 && argv[i + 1] ? argv[i + 1] : d; };
const anchor = opt('anchor', 'System overview');
const cardName = opt('card', 'Canada as a Resource Civilization');

const CASES = [
  { name: 'wide-1920', width: 1920, height: 1080, dsf: 1, note: 'what the film captures today — natively 1080p' },
  { name: 'narrow-1280', width: 1280, height: 720, dsf: 1.5, note: 'narrower layout — natively 720p, 1080p only by upscaling' },
];

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true, channel: 'chromium', args: ['--hide-scrollbars'] });
for (const c of CASES) {
  const context = await browser.newContext({ viewport: { width: c.width, height: c.height }, deviceScaleFactor: c.dsf, locale: 'en-CA', colorScheme: 'light' });
  const page = await context.newPage();
  await page.goto(config.baseUrl, { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { level: 1, name: 'Research & Maps' }).waitFor({ timeout: 30000 });
  await page.waitForLoadState('networkidle').catch(() => {});
  const card = page.locator('article').filter({ has: page.getByRole('heading', { name: cardName }) }).first();
  await card.scrollIntoViewIfNeeded();
  await card.click();
  await page.waitForURL((u) => u.pathname.startsWith('/portfolio/'), { timeout: 20000 });
  await page.locator('main').waitFor({ timeout: 20000 });
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.evaluate(() => document.fonts.ready);

  const shot = await page.evaluate((anchor) => {
    const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    const hit = [...document.querySelectorAll('main *')].find((e) => e.children.length === 0 && vis(e) && (e.textContent || '').includes(anchor));
    if (hit) window.scrollTo({ top: hit.getBoundingClientRect().top + window.scrollY - 90, behavior: 'instant' });
    const main = document.querySelector('main');
    const img = [...document.querySelectorAll('main img')].map((i) => Math.round(i.getBoundingClientRect().width)).sort((a, b) => b - a)[0] ?? null;
    return {
      found: !!hit,
      columnPct: main ? Math.round((main.getBoundingClientRect().width / window.innerWidth) * 100) : null,
      mapPct: img ? Math.round((img / window.innerWidth) * 100) : null,
      mapPx: img,
    };
  }, anchor);
  await page.waitForTimeout(900);

  const file = path.join(outDir, `${c.name}.png`);
  await page.screenshot({ path: file, scale: 'device' });
  const dim = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', file], { encoding: 'utf8' }).stdout.trim();
  console.log(`${c.name.padEnd(12)} ${String(c.width).padStart(4)} CSS px → ${dim} image · text column ${shot.columnPct}% of frame · widest map ${shot.mapPx}px = ${shot.mapPct}% of frame${shot.found ? '' : '  (anchor not found — top of page)'}`);
  console.log(`             ${c.note}`);
  await context.close();
}
await browser.close();

const stacked = path.join(outDir, 'comparison.png');
const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error',
  '-i', path.join(outDir, 'wide-1920.png'), '-i', path.join(outDir, 'narrow-1280.png'),
  // No drawtext: fontconfig has no default config on this machine and the
  // filter fails. Top = the 1920 capture, bottom = 1280.
  '-filter_complex', '[0:v]scale=1100:-1[a];[1:v]scale=1100:-1[b];[a][b]vstack=inputs=2',
  stacked]);
console.log(r.status === 0 ? `\nstacked (top = 1920, bottom = 1280): ${stacked}` : `\n(stacking failed: ${r.stderr})`);
