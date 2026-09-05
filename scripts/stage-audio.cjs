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
  baseline:  { en: 'Baseline',             fr: 'État des lieux' },
  territory: { en: 'Territory',            fr: 'Territoire' },
  society:   { en: 'Society',              fr: 'Société' },
  economy:   { en: 'Economy',              fr: 'Économie' },
  political: { en: 'Political Order',      fr: 'Ordre politique' },
  capacity:  { en: 'Capacity to Deliver',  fr: 'Capacité de mise en œuvre' },
  security:  { en: 'Security & Diplomacy', fr: 'Sécurité et diplomatie' },
  situation: { en: 'Situation',            fr: 'Situation' },
};

// One male and one female voice per language, so the listener chooses.
const VOICE_LABELS = {
  // English — male
  'adam-stone': 'Adam Stone (British)',
  'deep-voice': 'Deep Voice (British)',
  ogechi: 'Ogechi (British)',
  'war-arsenal': 'War Arsenal (US)',
  // English — female
  laura: 'Laura (deep)',
  florence: 'Florence (lighter)',
  'old-woman': 'Old Woman (softer)',
  sarah: 'Sarah (rejected)',
  // French — male
  angelokyly: 'angelokyly (deep)',
  'le-narrateur': 'Le Narrateur (dramatic)',
  // French — female
  'annonce-calme': 'Annonce Calme',
  ora: 'Ora (articulate)',
  reflechie: 'Voix Reflechie',
  'stoic-2': 'Voix stoic 2',
};

// MPEG-1 Layer III bitrates (kbps) and sample rates, indexed as in the frame
// header. Reading the real bitrate keeps durations honest when 64 and 128 kbps
// files sit side by side — assuming either one mislabels every other track.
const MP3_BITRATES = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0];
const MP3_RATES = [44100, 48000, 32000, 0];

/*
 * ffprobe, if we can find it. Reading the first frame header is NOT reliable
 * on spliced files: ffmpeg writes a LAME/Xing info frame first, whose bitrate
 * field is not the stream's, so a 64 kbps file was being reported as 48 kbps
 * and its duration overstated by a third. ffprobe reads the real container.
 */
function findFfprobe() {
  const { execFileSync } = require('child_process');
  const candidates = ['ffprobe'];
  const base = path.join(process.env.LOCALAPPDATA || '', 'Microsoft', 'WinGet', 'Packages');
  if (fs.existsSync(base)) {
    for (const dir of fs.readdirSync(base).filter((d) => d.startsWith('Gyan.FFmpeg'))) {
      const guess = path.join(base, dir, 'ffmpeg-9.0-full_build', 'bin', 'ffprobe.exe');
      if (fs.existsSync(guess)) candidates.push(guess);
    }
  }
  for (const exe of candidates.reverse()) {
    try {
      execFileSync(exe, ['-version'], { stdio: 'ignore' });
      return exe;
    } catch { /* try the next */ }
  }
  return null;
}

const FFPROBE = findFfprobe();

/** Duration in seconds. Exact via ffprobe; otherwise estimated from the header. */
function secondsOf(file) {
  if (FFPROBE) {
    try {
      const { execFileSync } = require('child_process');
      const out = execFileSync(FFPROBE, ['-v', 'error', '-show_entries',
        'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', file],
        { encoding: 'utf8' });
      const seconds = parseFloat(out.trim());
      if (Number.isFinite(seconds) && seconds > 0) return Math.round(seconds);
    } catch { /* fall through to the estimate */ }
  }
  const size = fs.statSync(file).size;
  const fd = fs.openSync(file, 'r');
  const head = Buffer.alloc(4);
  fs.readSync(fd, head, 0, 4, 0);
  fs.closeSync(fd);
  if (head[0] === 0xff && (head[1] & 0xe0) === 0xe0) {
    const kbps = MP3_BITRATES[head[2] >> 4];
    const rate = MP3_RATES[(head[2] >> 2) & 0x03];
    if (kbps && rate) return Math.round((size * 8) / (kbps * 1000));
  }
  return Math.round(size / 16000);
}

/*
 * --index-only rebuilds src/data/audioIndex.json without copying anything.
 * Useful while reviewing locally: the committed index stays accurate without
 * keeping a second, gigabyte-scale copy of every MP3 on disk. Run without the
 * flag before a deploy, which is the only time public/audio needs to exist.
 */
const INDEX_ONLY = process.argv.includes('--index-only');

/*
 * --only <substr>[,<substr>] stages just the matching paths, so a review deploy
 * can carry the two files worth listening to rather than every superseded take.
 *   node scripts/stage-audio.cjs --only resource-civilization
 *   node scripts/stage-audio.cjs --only adam-stone,annonce-calme
 */
const ONLY = (() => {
  const i = process.argv.indexOf('--only');
  return i >= 0 && process.argv[i + 1]
    ? process.argv[i + 1].split(',').map((s) => s.trim()).filter(Boolean)
    : null;
})();

/*
 * With no --only, stage exactly the APPROVED recordings listed in
 * content/narration-approved.json. That file is the publication decision: what
 * is in it ships, what is not stays in tts-out for review.
 *
 * Defaulting to "everything in tts-out" was wrong — it meant a deploy could
 * quietly publish a superseded take, or 900 MB of evaluation material, simply
 * because someone forgot a flag. --all restores that behaviour deliberately.
 */
const APPROVED = (() => {
  if (ONLY || process.argv.includes('--all')) return null;
  const file = path.join('content', 'narration-approved.json');
  if (!fs.existsSync(file)) return null;
  const map = JSON.parse(fs.readFileSync(file, 'utf8')).approved || {};
  // "articles/<slug>/<lang>": "<voice>"  ->  "articles/<slug>/<lang>/<voice>/"
  return Object.entries(map).map(([key, voice]) => `${key}/${voice}/`);
})();

const wanted = (rel) => {
  const patterns = ONLY || APPROVED;
  return !patterns || patterns.some((s) => rel.includes(s));
};

function copy(from, to) {
  if (INDEX_ONLY) return;
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

const voicesIn = (dir) => (fs.existsSync(dir)
  ? fs.readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name)
  : []);

function collect() {
  const groups = [];

  for (const lang of ['en', 'fr']) {
    const langDir = path.join(SRC, 'countries', 'CAN', lang);
    const voices = voicesIn(langDir);
    const tracks = [];
    for (const voice of voices) {
      const dir = path.join(langDir, voice);
      for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.mp3')).sort()) {
        const id = file.replace(/^\d+-/, '').replace(/\.mp3$/, '');
        const src = path.join(dir, file);
        const rel = `countries/CAN/${lang}/${voice}/${file}`;
        if (!wanted(rel)) continue;
        copy(src, path.join(DEST, rel));
        tracks.push({
          id: `can-${lang}-${voice}-${id}`,
          label: SECTION_LABELS[id]?.[lang] ?? id,
          voice,
          src: `/audio/${rel}`,
          seconds: secondsOf(src),
        });
      }
    }
    if (tracks.length) {
      groups.push({
        title: lang === 'fr' ? 'Canada — rapport complet' : 'Canada — full report',
        lang,
        // Derived from what was actually staged, so --only never offers a voice
        // button whose tracks were filtered out.
        voices: [...new Set(tracks.map((t) => t.voice))]
          .map((v) => ({ id: v, label: VOICE_LABELS[v] ?? v })),
        tracks,
      });
    }
  }

  for (const lang of ['en', 'fr']) {
    const tracks = [];
    const seen = new Set();
    for (const slug of Object.keys(TITLES)) {
      const langDir = path.join(SRC, 'articles', slug, lang);
      for (const voice of voicesIn(langDir)) {
        seen.add(voice);
        const dir = path.join(langDir, voice);
        for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.mp3')).sort()) {
          const src = path.join(dir, file);
          const rel = `articles/${slug}/${lang}/${voice}/${file}`;
          if (!wanted(rel)) continue;
          copy(src, path.join(DEST, rel));
          tracks.push({
            id: `art-${lang}-${voice}-${slug}`,
            label: TITLES[slug][lang],
            voice,
            src: `/audio/${rel}`,
            seconds: secondsOf(src),
          });
        }
      }
    }
    if (tracks.length) {
      groups.push({
        title: 'Articles',
        lang,
        voices: [...new Set(tracks.map((t) => t.voice))]
          .map((v) => ({ id: v, label: VOICE_LABELS[v] ?? v })),
        tracks,
      });
    }
  }

  return groups;
}

const groups = collect();
fs.mkdirSync(path.dirname(INDEX), { recursive: true });
fs.writeFileSync(INDEX, JSON.stringify({ groups }, null, 2) + '\n', 'utf8');

/*
 * narrationManifest.json — what the SITE reads, as opposed to audioIndex.json
 * which only drives the private /listen page. Keyed "articles/<slug>/<lang>",
 * one entry per piece that has a published recording. Absent key = no premium
 * audio, and the player falls back to Web Speech.
 */
const NARRATION = path.join('src', 'data', 'narrationManifest.json');
const narration = {};
for (const g of groups) {
  for (const t of g.tracks) {
    const a = t.src.match(/^\/audio\/articles\/([^/]+)\/([^/]+)\/([^/]+)\//);
    if (a) {
      const [, slug, lang, voice] = a;
      // First voice staged for a slug+lang wins; staging is filtered with --only
      // to exactly the approved recordings, so there is normally just the one.
      const key = `articles/${slug}/${lang}`;
      if (!narration[key]) narration[key] = { src: t.src, voice, seconds: t.seconds };
      continue;
    }
    /* A COUNTRY REPORT is not one file. It is one file per section, and the
     * player walks them as a single timeline — so the entry carries the ordered
     * sections and the total, not a single src. The order is the order the
     * files were collected, which is the numeric filename order (01-, 02-, …),
     * which is the report's display order. Do not sort by label. */
    const c = t.src.match(/^\/audio\/countries\/([^/]+)\/([^/]+)\/([^/]+)\//);
    if (!c) continue;
    const [, cca3, lang, voice] = c;
    const key = `countries/${cca3}/${lang}`;
    if (!narration[key]) narration[key] = { voice, seconds: 0, sections: [] };
    if (narration[key].voice !== voice) continue;   // one voice per language
    narration[key].sections.push({
      id: t.id.replace(new RegExp(`^${cca3.toLowerCase()}-${lang}-${voice}-`), ''),
      label: t.label,
      src: t.src,
      seconds: t.seconds,
    });
    narration[key].seconds += t.seconds;
  }
}
fs.writeFileSync(NARRATION, JSON.stringify(narration, null, 2) + '\n', 'utf8');
console.log(`Narration manifest -> ${NARRATION}  (${Object.keys(narration).length} entry/entries)`);

let bytes = 0, count = 0;
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else { bytes += fs.statSync(full).size; count++; }
  }
};
if (fs.existsSync(DEST)) walk(DEST);

// One voice per language, since the sets are alternates rather than extra listening.
const primary = groups.flatMap((g) => g.tracks.filter((t) => t.voice === g.voices[0]?.id));
const total = primary.reduce((a, t) => a + t.seconds, 0);
console.log(`Staged ${count} file(s), ${(bytes / 1024 / 1024).toFixed(0)} MB, `
  + `${Math.floor(total / 3600)}h${String(Math.round((total % 3600) / 60)).padStart(2, '0')} per voice`);
for (const g of groups) {
  console.log(`  ${g.title} [${g.lang}] — ${g.tracks.length} track(s) across `
    + `${g.voices.map((v) => v.label).join(', ')}`);
}
console.log(`\nIndex -> ${INDEX}`);
if (INDEX_ONLY) {
  console.log('--index-only: nothing copied. Run without it before deploying.');
} else {
  console.log('Files are gitignored but WILL ship in the Fly image (Dockerfile copies the local dir).');
}
