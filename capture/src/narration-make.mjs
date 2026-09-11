/*
 * Generate the film's narration in Peggy's own cloned voices, via the same
 * scripts/fish_tts.py that produced the article and country-report recordings.
 *
 *   npm run narration:make -- --dry     # cost and size, sends nothing
 *   npm run narration:make              # every missing line, both languages
 *   npm run narration:make -- --lang fr
 *   npm run narration:make -- --shot 8 --force     # redo one line
 *
 * One file per shot — never one per movement: cloned voices drift over long
 * passages, and a line that lands wrong has to be re-generatable alone. The
 * text comes from shots.mjs, so editing a line there and re-running is the
 * whole edit loop.
 *
 * Voices (the models Peggy recorded):
 *   en → peggy-thoughtful   048a6cbae79345a8a907899dec94ade5
 *   fr → peggy              db27d5fb158a484c9629c9f1b06531b7
 *
 * fish_tts.py applies its per-language spoken-text rules (number and date
 * expansion, French liaison fixes) and caches per paragraph, so a re-run that
 * changes nothing costs nothing.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { config } from '../shots.mjs';
import { narrationFileBase, narrationShots, findNarrationFile, probeSeconds } from './lib.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const repo = path.resolve(root, '..');
const narrationDir = path.join(root, 'narration');
const tmpDir = path.join(root, 'out', 'narration-text');

const argv = process.argv.slice(2);
const flag = (n) => argv.includes(`--${n}`);
const opt = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : d; };
const dry = flag('dry');
const force = flag('force');
const onlyLang = opt('lang', null);
const onlyShot = opt('shot', null);

const VOICE = { en: 'peggy-thoughtful', fr: 'peggy' };
// Rough spoken rate, used only to flag a take that came out implausibly short
// (a truncated request) or long. Not a quality judgement — that needs ears.
const WORDS_PER_SEC = { en: 2.6, fr: 2.4 };

fs.mkdirSync(narrationDir, { recursive: true });
fs.mkdirSync(tmpDir, { recursive: true });

if (!process.env.FISH_API_KEY && !dry) {
  console.error('FISH_API_KEY is not set. PowerShell:  setx FISH_API_KEY "your_key"  then open a new terminal.');
  process.exit(1);
}

const langs = onlyLang ? [onlyLang] : ['en', 'fr'];
const shots = narrationShots(config).filter((s) => !onlyShot || s.id === onlyShot);
if (!shots.length) { console.error(`no narrated shot matches --shot ${onlyShot}`); process.exit(1); }

const jobs = [];
for (const lang of langs) {
  for (const s of shots) {
    const text = s.narration[lang];
    if (!text) continue;
    const base = narrationFileBase(s.id, lang);
    const existing = findNarrationFile(narrationDir, base);
    jobs.push({ id: s.id, lang, text, base, out: path.join(narrationDir, `${base}.mp3`), existing });
  }
}

const todo = jobs.filter((j) => force || !j.existing);
const chars = todo.reduce((n, j) => n + j.text.length, 0);
console.log(`${jobs.length} lines (${langs.join(', ')}) · ${todo.length} to generate · ${chars} characters`);
if (jobs.length !== todo.length) console.log(`${jobs.length - todo.length} already present (use --force to redo)`);
if (dry || !todo.length) {
  for (const j of jobs) console.log(`  ${j.base.padEnd(14)} ${j.existing ? `have (${(probeSeconds(j.existing) ?? 0).toFixed(2)}s)` : 'MISSING'}  ${j.text}`);
  process.exit(0);
}

let made = 0, failed = 0;
for (const j of todo) {
  const txt = path.join(tmpDir, `${j.base}.txt`);
  fs.writeFileSync(txt, j.text.replace(/’/g, '’'), 'utf8');
  process.stdout.write(`${j.base.padEnd(14)} ${VOICE[j.lang].padEnd(16)} `);
  const r = spawnSync('python', ['scripts/fish_tts.py', path.relative(repo, txt), '-o', path.relative(repo, j.out), '--lang', j.lang, '--voice-name', VOICE[j.lang]],
    { cwd: repo, encoding: 'utf8' });
  if (r.status !== 0 || !fs.existsSync(j.out)) {
    failed++;
    console.log('FAILED');
    console.log((r.stderr || r.stdout || '').trim().split('\n').slice(-4).map((l) => `    ${l}`).join('\n'));
    continue;
  }
  const secs = probeSeconds(j.out) ?? 0;
  const words = j.text.split(/\s+/).length;
  const expected = words / WORDS_PER_SEC[j.lang];
  const odd = secs < expected * 0.55 || secs > expected * 2.2;
  console.log(`${secs.toFixed(2)}s${odd ? `  ⚠ expected ~${expected.toFixed(1)}s for ${words} words — listen to this one` : ''}`);
  made++;
}

console.log(`\n${made} generated, ${failed} failed → ${narrationDir}`);
if (failed) process.exit(1);
console.log('Rows the production document says to listen to closely:');
console.log('  shot08_en — the longest sentence; if it flattens, split it at the colon in shots.mjs.');
console.log('  shot15_fr — the enumeration needs a beat before "routes arctiques".');
console.log('Redo one with:  npm run narration:make -- --shot 8 --lang en --force');
