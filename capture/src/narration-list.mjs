/*
 * Print (and write to narration/NARRATION-LIST.md) the narration files the
 * assembler expects — one per narrated shot per language, named by shot id —
 * with the line to read for each, so the whole set can be generated in one
 * Fish Audio session and saved under the exact names.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from '../shots.mjs';
import { narrationFileBase, narrationShots } from './lib.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const narrationDir = path.resolve(here, '..', 'narration');
fs.mkdirSync(narrationDir, { recursive: true });

const shots = narrationShots(config);
const lines = [];
lines.push('# Narration files expected by the site-film pipeline');
lines.push('');
lines.push(`${shots.length} lines per language, ${shots.length * 2} files. Save each as WAV (or MP3) under capture/narration/ with EXACTLY this name.`);
lines.push('One file per shot — never one file per movement. Build the pauses in the assembly, not in the model.');
lines.push('');
for (const lang of ['en', 'fr']) {
  lines.push(`## ${lang.toUpperCase()}`);
  lines.push('');
  lines.push('| File | Shot | Line |');
  lines.push('|---|---|---|');
  for (const s of shots) {
    lines.push(`| \`${narrationFileBase(s.id, lang)}.wav\` | ${s.id} | ${s.narration[lang]} |`);
  }
  lines.push('');
}
lines.push('## Rows to watch (from the production document)');
lines.push('');
lines.push('- Shot 8 — the longest sentence; if it flattens, split at the colon into `shot08a_<lang>` and `shot08b_<lang>` and list both in shots.mjs (`narrationFiles`).');
lines.push('- Shot 15 (French) — the enumeration needs a beat before *routes arctiques*; slow the list with heavier punctuation rather than commas.');
lines.push('');
lines.push('Existing files found in capture/narration/ at the time of writing this list:');
lines.push('');
const present = fs.existsSync(narrationDir) ? fs.readdirSync(narrationDir).filter((f) => /\.(wav|mp3)$/i.test(f)) : [];
lines.push(present.length ? present.map((f) => `- ${f}`).join('\n') : '- (none yet)');
lines.push('');

const md = lines.join('\n');
fs.writeFileSync(path.join(narrationDir, 'NARRATION-LIST.md'), md, 'utf8');
console.log(md);
console.log(`\nWritten to ${path.join(narrationDir, 'NARRATION-LIST.md')}`);
