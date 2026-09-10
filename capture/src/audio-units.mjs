/*
 * Where do the two report voices switch?
 *
 * The country recordings are spliced per block with a measured silence
 * (700 ms between paragraphs, 1100 ms before a heading, 400 ms after one —
 * scripts/fish_tts.py), and the duet alternates per UNIT: in sections with
 * "## " headings a unit is a heading plus everything under it; in Baseline and
 * Situation (no headings) every block is its own unit; a "# " section title is
 * read by the first voice and does not advance the alternation.
 *
 * This detects the splice silences in each section MP3, pairs them with the
 * text blocks in tts-text/, replays the alternation rule, and prints per block
 * the start time and the voice — with the voice SWITCHES marked — so the
 * shot-21 entry point in shots.mjs is chosen from data.
 *
 *   npm run audio:units            # CAN/en (what the capture plays)
 *   npm run audio:units -- fr      # CAN/fr duet
 *
 * Caveat: a section regenerated with --flip-from (fish_tts.py) swaps the
 * voices from a named heading onward; that flag is not recorded anywhere, so
 * for headed sections confirm by ear. Baseline and Situation are exact.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { config } from '../shots.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const lang = process.argv[2] === 'fr' ? 'fr' : 'en';
const manifest = JSON.parse(fs.readFileSync(path.resolve(here, '..', '..', 'src', 'data', 'narrationManifest.json'), 'utf8'));
const country = manifest[`countries/CAN/${lang}`];
if (!country) { console.error(`No CAN/${lang} recording in narrationManifest.json`); process.exit(1); }
const audioRoot = path.resolve(here, '..', config.reportAudio.localAudioRoot);
const textDir = path.resolve(here, '..', '..', 'tts-text', 'countries', 'CAN', lang);
const [voiceA, voiceB] = country.voice.includes('-') ? country.voice.split(/-(?=[a-z]+$)/) : [country.voice, country.voice];

const MIN_GAP = 0.72; // s — a 700 ms splice + fades; the engine's own pauses are shorter

function silences(file) {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', file, '-af', 'silencedetect=noise=-45dB:d=0.5', '-f', 'null', '-'], { encoding: 'utf8' });
  const res = [];
  let start = null;
  for (const line of String(r.stderr).split('\n')) {
    const s = /silence_start: ([\d.]+)/.exec(line);
    const e = /silence_end: ([\d.]+)/.exec(line);
    if (s) start = parseFloat(s[1]);
    if (e && start != null) { res.push({ start, end: parseFloat(e[1]), dur: parseFloat(e[1]) - start }); start = null; }
  }
  return res.filter((g) => g.dur >= MIN_GAP);
}

/** Replays fish_tts.py render(): which of the two voices reads each block. */
function voices(blocks) {
  const sectioned = blocks.some((b) => b.startsWith('## '));
  let unit = -1;
  return blocks.map((b) => {
    const heading = b.startsWith('## ');
    const title = b.startsWith('# ') && !heading;
    const alt = b.startsWith('~ ');
    if (!title && (heading || alt || !sectioned || unit < 0)) unit += 1;
    return title ? 0 : unit % 2;
  });
}

const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
console.log(`CAN/${lang} — ${country.voice}: voice A = ${voiceA}, voice B = ${voiceB}\n`);
for (const s of country.sections) {
  const file = path.join(audioRoot, s.src.replace(/^\/audio\//, ''));
  if (!fs.existsSync(file)) { console.log(`${s.id}: MISSING ${file}`); continue; }
  const txt = path.join(textDir, s.src.split('/').pop().replace('.mp3', '.txt'));
  const blocks = fs.existsSync(txt) ? fs.readFileSync(txt, 'utf8').split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean) : null;
  const gaps = silences(file);
  console.log(`── ${s.id} (${fmt(s.seconds)})${blocks ? ` — ${blocks.length} blocks, ${gaps.length} splice silences` : ' — no text file'}`);
  if (!blocks || gaps.length !== blocks.length - 1) {
    console.log(`   cannot pair blocks with silences 1:1; next unit/paragraph starts at: ${gaps.map((g) => g.end.toFixed(1) + 's').join(', ') || '(none)'}`);
    continue;
  }
  const v = voices(blocks);
  const starts = [0, ...gaps.map((g) => g.end)];
  const switches = [];
  blocks.forEach((b, i) => {
    const sw = i > 0 && v[i] !== v[i - 1];
    if (sw) switches.push(starts[i]);
    const label = b.replace(/^(##? |~ )/, '').replace(/\s+/g, ' ').slice(0, 64);
    console.log(`   ${sw ? '⇄' : ' '} ${starts[i].toFixed(1).padStart(7)}s  ${v[i] === 0 ? 'A' : 'B'}  ${label}${b.length > 64 ? '…' : ''}`);
  });
  const early = switches.filter((t) => t <= 6);
  console.log(`   voice switches at: ${switches.map((t) => t.toFixed(1) + 's').join(', ') || '(none — one unit)'}${early.length ? `  ✓ inside the first 6 s: ${early.map((t) => t.toFixed(1)).join(', ')}s (no seek needed)` : ''}`);
  console.log('');
}
console.log('Pick section + entrySeconds in shots.mjs → reportAudio so a ⇄ lands 2–4 s into shot 21 (mode bar seeks within the Baseline; mode section needs the hook fix — see README).');
