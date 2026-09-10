/* Small shared utilities used by more than one entry point. */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

/** shot01_en, shot25a_fr … (numeric ids zero-padded to two digits). */
export function narrationFileBase(id, lang) {
  const m = /^(\d+)([a-z]?)$/.exec(id);
  const padded = m ? `${m[1].padStart(2, '0')}${m[2]}` : id;
  return `shot${padded}_${lang}`;
}

/** Shots that carry a narration line. */
export function narrationShots(config) {
  return config.shots.filter((s) => s.narration && (s.narration.en || s.narration.fr));
}

/** Find narration/<base>.(wav|mp3) — or null. */
export function findNarrationFile(narrationDir, base) {
  for (const ext of ['wav', 'mp3', 'WAV', 'MP3']) {
    const p = path.join(narrationDir, `${base}.${ext}`);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

/** Duration in seconds via ffprobe, or null. */
export function probeSeconds(file) {
  const r = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', file], { encoding: 'utf8' });
  if (r.status !== 0) return null;
  const v = parseFloat(String(r.stdout).trim());
  return Number.isFinite(v) ? v : null;
}

export function requireTool(name) {
  const r = spawnSync(name, ['-version'], { encoding: 'utf8' });
  if (r.error || r.status !== 0) throw new Error(`${name} is not on PATH (needed by the pipeline).`);
  return String(r.stdout).split('\n')[0];
}
