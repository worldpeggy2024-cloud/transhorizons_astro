#!/usr/bin/env node
/*
 * stage-audio.cjs — copy generated narration into public/audio/ and write the
 * index the /listen page renders from.
 *
 *   node scripts/stage-audio.cjs
 *
 * WHY THIS EXISTS: the MP3s must not enter git (hundreds of MB, regenerated
 * often), but they must reach the Fly image. The Dockerfile does `COPY . .`
 * from the LOCAL directory rather than from git, and .dockerignore does not
 * exclude public/audio — so files that are gitignored still ship. That is the
 * whole trick. It also means a deploy from a machine without these files will
 * silently ship without them; this is evaluation material, not production
 * hosting, and the real answer for production is a volume or object storage.
 */

const fs = require('fs');
const path = require('path');

const SRC = 'tts-out';
const DEST = path.join('public', 'audio');
const INDEX = path.join('src', 'data', 'audioIndex.json');

const TITLES = {
  'resource-civilization': { en: 'Resource Civilization', fr: 'Civilisation des ressources' },
  'canada-multipolar':     { en: 'Canada in a Multipolar World', fr: 'Le Canada dans un monde multipolaire' },
  'career-evolution':      { en: 'From Translation Toward Research', fr: 'De la traduction vers la recherche' },
  'travel-observation':    { en: 'Travel and Observation', fr: 'Voyage et observation' },
};
const SECTION_LABELS = {
  baseline:  { en: 'Baseline',            fr: 'État des lieux' },
  territory: { en: 'Territory',           fr: 'Territoire' },
  society:   { en: 'Society',             fr: 'Société' },
  economy:   { en: 'Economy',             fr: 'Économie' },
  political: { en: 'Political Order',     fr: 'Ordre politique' },
  capacity:  { en: 'Capacity to Deliver', fr: 'Capacité de mise en œuvre' },
  security:  { en: 'Security & Diplomacy', fr: 'Sécurité et diplomatie' },
  situation: { en: 'Situation',           fr: 'Situation' },
};

/** 128 kbps CBR => 16000 bytes per second. Good enough to label a player. */
const secondsOf = (bytes) => Math.round(bytes / 16000);

function copy(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

function collect() {
  const groups = [];

  for (const lang of ['en', 'fr']) {
    const dir = path.join(SRC, 'countries', 'CAN', lang);
    if (!fs.existsSync(dir)) continue;
    const tracks = fs.readdirSync(dir).filter((f) => f.endsWith('.mp3')).sort()
      .map((file) => {
        const id = file.replace(/^\d+-/, '').replace(/\.mp3$/, '');
        const src = path.join(dir, file);
        const rel = `countries/CAN/${lang}/${file}`;
        copy(src, path.join(DEST, rel));
        return {
          id: `can-${lang}-${id}`,
          label: SECTION_LABELS[id]?.[lang] ?? id,
          src: `/audio/${rel}`,
          seconds: secondsOf(fs.statSync(src).size),
        };
      });
    if (tracks.length) {
      groups.push({ title: lang === 'fr' ? 'Canada — rapport complet' : 'Canada — full report', lang, tracks });
    }
  }

  for (const lang of ['en', 'fr']) {
    const tracks = [];
    for (const slug of Object.keys(TITLES)) {
      const dir = path.join(SRC, 'articles', slug, lang);
      if (!fs.existsSync(dir)) continue;
      for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.mp3')).sort()) {
        const src = path.join(dir, file);
        const rel = `articles/${slug}/${lang}/${file}`;
        copy(src, path.join(DEST, rel));
        tracks.push({
          id: `art-${lang}-${slug}`,
          label: TITLES[slug][lang],
          src: `/audio/${rel}`,
          seconds: secondsOf(fs.statSync(src).size),
        });
      }
    }
    if (tracks.length) {
      groups.push({ title: lang === 'fr' ? 'Articles' : 'Articles', lang, tracks });
    }
  }

  return groups;
}

const groups = collect();
fs.mkdirSync(path.dirname(INDEX), { recursive: true });
fs.writeFileSync(INDEX, JSON.stringify({ groups }, null, 2) + '\n', 'utf8');

let bytes = 0, count = 0;
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else { bytes += fs.statSync(full).size; count++; }
  }
};
if (fs.existsSync(DEST)) walk(DEST);

const total = groups.flatMap((g) => g.tracks).reduce((a, t) => a + t.seconds, 0);
console.log(`Staged ${count} file(s), ${(bytes / 1024 / 1024).toFixed(0)} MB, `
  + `${Math.floor(total / 3600)}h${String(Math.round((total % 3600) / 60)).padStart(2, '0')} of audio`);
for (const g of groups) console.log(`  ${g.title} [${g.lang}] — ${g.tracks.length} track(s)`);
console.log(`\nIndex -> ${INDEX}`);
console.log('Files are gitignored but WILL ship in the Fly image (Dockerfile copies the local dir).');
