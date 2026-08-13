#!/usr/bin/env node
/*
 * extract-narration.cjs — turn a country report into per-section narration text.
 *
 *   node scripts/extract-narration.cjs --country CAN
 *   node scripts/extract-narration.cjs --country CAN --lang fr
 *
 * Writes tts-text/countries/<ISO3>/<lang>/NN-<section>.txt plus a manifest.json
 * carrying a sha256 of each section's text. The hash is the staleness guard:
 * regenerate audio only where the text actually changed, and (later) let the
 * player fall back to Web Speech when a recorded section no longer matches.
 *
 * MIRRORS the React reading view (CountryPage.tsx `narrationSections`), NOT the
 * SEO layer: same eight sections, same order, each peer's prose rendered as
 * "Label. text" rows so a listener knows which subsection they are in.
 * Sources, the actors map and the gap register are reference apparatus and are
 * NOT narrated — matching the page, which excludes them from the audio queue.
 *
 * If you add a field to a section, add it here too. The script hard-fails on any
 * *_en/_fr prose key it does not recognise, so a new field cannot go silently
 * unnarrated.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const yaml = require('js-yaml');

// ── Section definitions, mirroring CountryPage.tsx rows ──────────────────────
// [yaml key stem, EN label, FR label, optional legacy key stem]
const SECTIONS = [
  { id: 'baseline', en: 'Baseline', fr: 'État des lieux', bare: true, rows: [
    ['baseline', '', ''],
  ]},
  { id: 'territory', en: 'Territory', fr: 'Territoire', rows: [
    ['territory_geography',   'Geography',   'Géographie'],
    ['territory_biosphere',   'Biosphere',   'Biosphère'],
    ['territory_minerals',    'Minerals',    'Minéraux'],
    ['territory_climate',     'Climate',     'Climat'],
    ['territory_metabolism',  'Metabolism',  'Métabolisme'],
    ['territory_transition',  'Transition',  'Transition'],
  ]},
  { id: 'society', en: 'Society', fr: 'Société', rows: [
    ['society_demographics', 'Demographics',    'Démographie'],
    ['society_composition',  'Composition',     'Composition'],
    ['society_language',     'Language',        'Langue'],
    ['society_religion',     'Religion',        'Religion'],
    ['society_wellbeing',    'Wellbeing',       'Bien-être'],
    ['society_cohesion',     'Social cohesion', 'Cohésion sociale'],
  ]},
  { id: 'economy', en: 'Economy', fr: 'Économie', rows: [
    ['economy_realEconomy',           'Real economy',           'Économie réelle', 'economy_macroReality'],
    ['economy_publicFinances',        'Public finances',        'Finances publiques'],
    ['economy_externalVulnerability', 'External vulnerability', 'Vulnérabilité externe'],
    ['economy_politicalEconomy',      'Political economy',      'Économie politique'],
  ]},
  { id: 'political', en: 'Political Order', fr: 'Ordre politique', rows: [
    ['political_powerStructure',          'Power structure',              'Structure du pouvoir'],
    ['political_rightsAndChecks',         'Rights & checks',              'Droits et contre-pouvoirs'],
    ['political_stabilityDrivers',        'Stability drivers',            'Facteurs de stabilité'],
    ['political_shockAbsorbers',          'Shock absorbers & accelerants', "Facteurs d'atténuation et d'aggravation"],
    ['political_constitutionalSubstrate', 'Constitutional substrate',     'Substrat constitutionnel'],
    ['political_stateStructure',          'State structure',              "Structure de l'État"],
  ]},
  { id: 'capacity', en: 'Capacity to Deliver', fr: 'Capacité de mise en œuvre', rows: [
    ['capacity_inheritedTerrain', 'Inherited terrain', 'Terrain hérité'],
    ['capacity_steering',         'Steering',          'Gouverne'],
    ['capacity_approvals',        'Approvals',         'Autorisations', 'capacity_permitting'],
    ['capacity_delivery',         'Delivery',          'Réalisation'],
    ['capacity_publicServices',   'Public services',   'Services publics'],
    ['capacity_productivity',     'Productivity',      'Productivité'],
  ]},
  { id: 'security', en: 'Security & Diplomacy', fr: 'Sécurité et Diplomatie', rows: [
    ['security_posture',               'Posture',                'Posture'],
    ['security_internal',              'Internal security',      'Sécurité intérieure'],
    ['security_military',              'Military',               'Forces militaires'],
    ['security_transnationalExposure', 'Transnational exposure', 'Exposition transnationale'],
    ['security_diplomacy',             'Diplomacy & external posture', 'Diplomatie et posture extérieure'],
  ]},
  { id: 'situation', en: 'Situation', fr: 'Situation', bare: true, rows: [
    ['situation', '', ''],
  ]},
];

// Prose keys deliberately NOT narrated (reference apparatus / JSON-in-text).
const NOT_NARRATED = [
  /^sources$/, /^actors_/, /^scorecard/, /_anchors$/, /^passNotes/,
  /^peerCorrections/, /^capacity_knownAndUnbuilt_/,
];

/*
 * Same marker stripping as the useReportSpeech hook, plus one repair the hook
 * does not bother with: removing "[cite-id]" leaves an orphaned space before the
 * punctuation that followed it ("C$155 billion ."). Web Speech ignores that;
 * a neural engine can read it as a pause. Only the space before . and , is
 * closed up — French legitimately spaces ; : ! ? and that spacing is Peggy's.
 */
function stripMarkers(text) {
  return String(text || '')
    .replace(/\[[^\]]*\]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/ +([.,])/g, '$1')
    .replace(/([(«]) | ([)»])/g, '$1$2')
    .trim();
}

/*
 * situation_<lang> is a JSON array of threads. Mirrors CountryPage.tsx
 * `situationNarration` exactly: "thread, status. what changed … . currentState".
 * Event DATES are deliberately not spoken — the page omits them too, because a
 * date read before every event turns the thread into a list rather than a story.
 */
function situationText(raw) {
  const value = String(raw || '').trim();
  if (!value) return '';
  if (!value.startsWith('[')) return stripMarkers(value);
  let threads;
  try {
    threads = JSON.parse(value);
  } catch {
    return stripMarkers(value);   // malformed JSON: read it as prose
  }
  if (!Array.isArray(threads)) return stripMarkers(value);
  return stripMarkers(
    threads.map((th) => {
      const head = [th?.thread, th?.status].filter(Boolean).join(', ');
      const evs = (Array.isArray(th?.events) ? th.events : [])
        .map((e) => [e?.what, e?.changed].filter(Boolean).join(' '))
        .join(' ');
      return [head, evs, th?.currentState].filter(Boolean).join('. ');
    }).join(' ')
  );
}

function buildSections(data, lang) {
  const out = [];
  for (const section of SECTIONS) {
    const parts = [];
    for (const [stem, labelEn, labelFr, legacy] of section.rows) {
      let raw = data[`${stem}_${lang}`];
      if ((raw === undefined || String(raw).trim() === '') && legacy) {
        raw = data[`${legacy}_${lang}`];
      }
      const text = stem === 'situation' ? situationText(raw) : stripMarkers(raw);
      if (!text) continue;
      const label = lang === 'fr' ? labelFr : labelEn;
      parts.push(section.bare || !label ? text : `${label}. ${text}`);
    }
    const text = parts.join(' ');
    if (text.trim()) {
      out.push({ id: section.id, label: lang === 'fr' ? section.fr : section.en, text });
    }
  }
  return out;
}

/** Guard: every prose key in the file must be narrated or explicitly excluded. */
function auditCoverage(data, lang) {
  const known = new Set();
  for (const s of SECTIONS) for (const r of s.rows) { known.add(r[0]); if (r[3]) known.add(r[3]); }
  const missed = [];
  for (const key of Object.keys(data)) {
    if (typeof data[key] !== 'string') continue;
    if (!key.endsWith(`_${lang}`)) continue;
    const stem = key.slice(0, -3);
    if (known.has(stem)) continue;
    if (NOT_NARRATED.some((re) => re.test(key) || re.test(`${stem}_`))) continue;
    if (String(data[key]).trim().length < 3) continue;
    missed.push(key);
  }
  return missed;
}

// ── Articles ────────────────────────────────────────────────────────────────
// Site slug -> content file. The four Peggy confirmed ready, 2026-08-12.
const ARTICLES = {
  'resource-civilization': '2026-04_Resource-Civilization_Essay.yaml',
  'canada-multipolar':     '2026-03_Canada-Multipolar_Essay.yaml',
  'career-evolution':      '2026-03_Career-Evolution_Note.yaml',
  'travel-observation':    '2026-04_Travel-Observation_Note.yaml',
};

/** Mirrors src/lib/articleTexts.ts cleanForTTS. */
function cleanForTTS(text) {
  return String(text || '')
    .replace(/•/g, ',')
    .replace(/\n\n+/g, '. ')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Mirrors src/lib/articleTexts.ts buildArticleText — same order, same joiner. */
function buildArticleText(data, lang) {
  const parts = [];
  if (data[`title_${lang}`]) parts.push(cleanForTTS(data[`title_${lang}`]));
  if (data[`subtitle_${lang}`]) parts.push(cleanForTTS(data[`subtitle_${lang}`]));
  if (String(data[`introduction_${lang}`] || '').trim()) parts.push(cleanForTTS(data[`introduction_${lang}`]));
  for (const s of data.sections ?? []) {
    if (s[`title_${lang}`]) parts.push(cleanForTTS(s[`title_${lang}`]));
    if (s[`content_${lang}`]) parts.push(cleanForTTS(s[`content_${lang}`]));
  }
  for (const k of data.keyTakeaways ?? []) {
    if (k[`title_${lang}`]) parts.push(cleanForTTS(k[`title_${lang}`]));
    if (k[`description_${lang}`]) parts.push(cleanForTTS(k[`description_${lang}`]));
  }
  return stripMarkers(parts.join('. '));
}

function writeManifest(outDir, meta, sections) {
  fs.mkdirSync(outDir, { recursive: true });
  const manifest = [];
  let totalChars = 0;
  sections.forEach((section, i) => {
    const order = String(i + 1).padStart(2, '0');
    const file = `${order}-${section.id}.txt`;
    fs.writeFileSync(path.join(outDir, file), section.text + '\n', 'utf8');
    totalChars += section.text.length;
    manifest.push({
      id: section.id,
      label: section.label,
      order: i + 1,
      text: file,
      mp3: `${order}-${section.id}.mp3`,
      chars: section.text.length,
      bytes: Buffer.byteLength(section.text, 'utf8'),
      sha256: crypto.createHash('sha256').update(section.text, 'utf8').digest('hex'),
    });
  });
  fs.writeFileSync(
    path.join(outDir, 'manifest.json'),
    JSON.stringify({ ...meta, sections: manifest }, null, 2) + '\n',
    'utf8'
  );
  return { manifest, totalChars };
}

function runArticle(slug, langs) {
  const filename = ARTICLES[slug];
  if (!filename) {
    console.error(`Unknown article "${slug}". Known: ${Object.keys(ARTICLES).join(', ')}`);
    process.exit(1);
  }
  const src = path.join('content', 'articles', filename);
  const data = yaml.load(fs.readFileSync(src, 'utf8'));
  for (const lang of langs) {
    const text = buildArticleText(data, lang);
    if (!text) { console.error(`${slug}/${lang}: no text — skipped`); continue; }
    const outDir = path.join('tts-text', 'articles', slug, lang);
    const { totalChars } = writeManifest(
      outDir, { article: slug, lang, source: src },
      [{ id: 'article', label: data[`title_${lang}`] || slug, text }]
    );
    console.log(`${slug}/${lang}: ${totalChars.toLocaleString()} chars, `
      + `~${Math.round(totalChars / 900)} min -> ${outDir}`);
  }
}

function main() {
  const argv = process.argv.slice(2);
  const arg = (name) => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : undefined; };
  const langs = arg('--lang') ? [arg('--lang')] : ['en', 'fr'];

  if (argv.includes('--all-articles')) {
    for (const slug of Object.keys(ARTICLES)) runArticle(slug, langs);
    return;
  }
  if (arg('--article')) return runArticle(arg('--article'), langs);

  const code = (arg('--country') || '').toUpperCase();
  if (!code) {
    console.error('Usage:\n'
      + '  node scripts/extract-narration.cjs --country CAN [--lang en|fr]\n'
      + '  node scripts/extract-narration.cjs --article canada-multipolar\n'
      + '  node scripts/extract-narration.cjs --all-articles');
    process.exit(1);
  }
  const src = path.join('content', 'countries', code, 'analysis.yaml');
  if (!fs.existsSync(src)) { console.error(`No such report: ${src}`); process.exit(1); }
  const data = yaml.load(fs.readFileSync(src, 'utf8'));

  for (const lang of langs) {
    const missed = auditCoverage(data, lang);
    if (missed.length) {
      console.error(`\nERROR: ${code}/${lang} has prose fields this script does not know:`);
      for (const key of missed) console.error(`  ${key}`);
      console.error('Add them to SECTIONS, or to NOT_NARRATED if they are not read aloud.\n');
      process.exit(1);
    }

    const sections = buildSections(data, lang);
    const outDir = path.join('tts-text', 'countries', code, lang);
    fs.mkdirSync(outDir, { recursive: true });

    const manifest = [];
    let totalChars = 0;
    sections.forEach((section, i) => {
      const order = String(i + 1).padStart(2, '0');
      const file = `${order}-${section.id}.txt`;
      fs.writeFileSync(path.join(outDir, file), section.text + '\n', 'utf8');
      const bytes = Buffer.byteLength(section.text, 'utf8');
      totalChars += section.text.length;
      manifest.push({
        id: section.id,
        label: section.label,
        order: i + 1,
        text: file,
        mp3: `${order}-${section.id}.mp3`,
        chars: section.text.length,
        bytes,
        sha256: crypto.createHash('sha256').update(section.text, 'utf8').digest('hex'),
      });
    });

    fs.writeFileSync(
      path.join(outDir, 'manifest.json'),
      JSON.stringify({ country: code, lang, source: src, sections: manifest }, null, 2) + '\n',
      'utf8'
    );

    const mins = Math.round(totalChars / 900);
    console.log(`${code}/${lang}: ${sections.length} sections, ${totalChars.toLocaleString()} chars, ~${mins} min -> ${outDir}`);
    for (const m of manifest) {
      console.log(`   ${String(m.order).padStart(2)}. ${m.id.padEnd(10)} ${m.chars.toLocaleString().padStart(8)} ch`);
    }
  }
}

main();
