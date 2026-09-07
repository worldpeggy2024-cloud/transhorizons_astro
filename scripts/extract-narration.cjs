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

/*
 * Blocks beginning with this marker are HEADINGS. fish_tts.py strips the marker
 * and speaks the block more slowly, with a longer pause around it, so a heading
 * sounds like a heading instead of another sentence of prose. The marker never
 * reaches the engine and never appears in the page.
 */
const HEADING = '## ';
/** A section title — outranks HEADING, and never joins the voice alternation. */
const SECTION_HEADING = '# ';

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
    ['capacity_knownAndUnbuilt',  'Known and unbuilt', 'Connu et non bâti'],
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
  /^peerCorrections/,
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
    // Markdown emphasis. The page renders "**bold**" as bold; the engine read
    // the asterisks ALOUD — "asterix asterix intellectual curiosity" (heard by
    // Peggy in career-evolution EN, 2026-09-06). Pairs first, then any stray
    // that is left, so an unbalanced marker cannot survive either.
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\*/g, '')
    // French typography (narrow NBSP before « : » etc., inserted by
    // fix-fr-typography.cjs) is a VISUAL convention. Fold it to ordinary
    // spaces: the engine has no use for it, and leaving it in would make every
    // typography pass change the text hash and force a pointless regeneration.
    .replace(/[   ]/g, ' ')
    .replace(/[ \t]+/g, ' ')
    // Keep blank lines: they are the paragraph breaks, and the engine reads
    // them as a longer pause. Collapsing all whitespace (the old behaviour)
    // handed Fish one undifferentiated blob with nothing to breathe at.
    // A bullet becomes a PARAGRAPH BREAK, not a comma. Replacing "•" with ","
    // (what the page's own TTS does) left every list opening on a bare comma —
    // the engine renders that as a stray noise — and produced ";," wherever an
    // item already ended in a semicolon. As separate blocks the items also get
    // the 700ms pause, so a list is heard as a list.
    .replace(/\n[ \t]*[•·▪‣][ \t]*/g, '\n\n')
    .replace(/^[ \t]*[•·▪‣][ \t]*/, '')
    .replace(/ ?\n[ \t]*\n[\s]*/g, '\n\n')
    .replace(/([^\n])\n(?!\n)/g, '$1 ')
    .replace(/ +([.,])/g, '$1')
    .replace(/([(«]) | ([)»])/g, '$1$2')
    .split('\n\n')
    .map((p) => p.trim()
      .replace(/^[,;:]+\s*/, '')            // never open a block on punctuation
      .replace(/([;,])\s*[;,]+/g, '$1')     // ";," -> ";"
      .trim())
    .filter(Boolean)
    .join('\n\n');
}

/*
 * situation_<lang> is a JSON array of threads, read as
 * "thread, status. <date>: what changed. … currentState".
 *
 * DATES ARE SPOKEN, which is a deliberate DIVERGENCE from CountryPage.tsx's
 * `situationNarration`. The page can omit them because a reader sees each event
 * dated on screen; a listener has no such column, and without the date the
 * events lose their sequence and stop making sense (confirmed by ear
 * 2026-08-12). The same argument applies to the page's own Web Speech
 * narration — worth fixing there too.
 */
// Spoken label for an event's consequence. On the page the "changed" field is
// set off visually; in speech it ran straight on from "what" with only a space,
// so a listener could not tell the event from its effect. Peggy: the section is
// "hard to understand as is".
const RESULT_LABEL = { en: 'Result:', fr: 'Résultat :' };

function situationText(raw, lang = 'en') {
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
        .map((e) => {
          const label = RESULT_LABEL[lang] ?? RESULT_LABEL.en;
          const body = [e?.what, e?.changed ? `${label} ${e.changed}` : null]
            .filter(Boolean).join(' ');
          // "4 February – 4 March 2025: The United States imposed …"
          return e?.date ? `${e.date}: ${body}` : body;
        })
        .join('\n\n');
      return [head, evs, th?.currentState].filter(Boolean).join('\n\n');
    }).join('\n\n')          // one thread per block — the biggest pause here
  );
}

/*
 * Quick scorecard — six rated dimensions, each with a rationale.
 *
 * Rendered on the page between the baseline and the report sections, and until
 * now absent from the audio entirely. Ratings are spoken in FULL WORDS: the
 * page abbreviates them to fit a chip ("Med-High", "Moy.-élev.") and an
 * abbreviation read aloud is noise.
 */
const SCORECARD_LABEL = { en: 'Quick scorecard', fr: 'Tableau de bord rapide' };

const SCORECARD_ROWS = [
  ['eliteCohesion',          'Elite cohesion',           'Cohésion des élites'],
  ['socialCohesion',         'Social cohesion',          'Cohésion sociale'],
  ['securityLoyalty',        'Security loyalty',         'Loyauté des forces'],
  ['economicPressure',       'Economic pressure',        'Pression économique'],
  ['protestCapacity',        'Mobilization capacity',    'Capacité de mobilisation'],
  ['institutionalResilience', 'Institutional resilience', 'Résilience institutionnelle'],
];

const RATING_SPOKEN = {
  en: { High: 'High', 'Med-High': 'Medium to high', Med: 'Medium', 'Med-Low': 'Low to medium', Low: 'Low' },
  fr: { High: 'Élevée', 'Med-High': 'Moyenne à élevée', Med: 'Moyenne', 'Med-Low': 'Faible à moyenne', Low: 'Faible' },
};

function scorecardBlocks(data, lang) {
  let anchors = {};
  try {
    const raw = data.scorecard_anchors;
    if (typeof raw === 'string' && raw.trim().startsWith('{')) anchors = JSON.parse(raw);
  } catch { /* rationales are optional; ratings still read */ }

  const parts = [];
  for (const [key, en, fr] of SCORECARD_ROWS) {
    const value = data[`scorecard_${key}`];
    if (!value) continue;
    const spoken = RATING_SPOKEN[lang]?.[value] ?? value;
    parts.push(HEADING + (lang === 'fr' ? fr : en));
    const rationale = stripMarkers(anchors[key]?.[`rationale_${lang}`] ?? '');
    parts.push(stripMarkers(`${spoken}.${rationale ? ' ' + rationale : ''}`));
  }
  if (!parts.length) return '';
  return [SECTION_HEADING + (SCORECARD_LABEL[lang] ?? SCORECARD_LABEL.en), ...parts].join('\n\n');
}

/*
 * Gap register (capacity.knownAndUnbuilt) — JSON-in-text, like `situation`.
 *
 * {opener, items[{gap, anchor, since, class}], denominator}
 *
 * It was on NOT_NARRATED because it is JSON rather than prose, which meant the
 * whole section was silently absent from the audio (caught by ear, 2026-09-03).
 * A reader sees the class as a coloured tag beside each entry; a listener needs
 * it said, otherwise twenty-four gaps arrive as one undifferentiated list with
 * no sense of which were never attempted and which are merely unfinished.
 *
 * The denominator closes the section because it is the moral guard: the
 * capacity to close any of this is inherited, never earned.
 */
const GAP_CLASS = {
  en: {
    'no-attempt-documented':     'No attempt documented.',
    'announced-not-implemented': 'Announced but not implemented.',
    'attempted-and-failed':      'Attempted, and failed.',
    'in-progress-unclosed':      'In progress, not yet closed.',
  },
  fr: {
    'no-attempt-documented':     'Aucune tentative documentée.',
    'announced-not-implemented': 'Annoncé, mais non mis en œuvre.',
    'attempted-and-failed':      'Tenté, sans succès.',
    'in-progress-unclosed':      'En cours, non résolu.',
  },
};

function gapRegisterText(raw, lang = 'en') {
  const value = String(raw || '').trim();
  if (!value) return '';                 // emitted empty by Pass B: not an error
  if (!value.startsWith('{')) return stripMarkers(value);
  let reg;
  try { reg = JSON.parse(value); } catch { return stripMarkers(value); }
  const classes = GAP_CLASS[lang] ?? GAP_CLASS.en;
  const items = (Array.isArray(reg?.items) ? reg.items : []).map((it) => {
    // "since 2021 — the Act received royal assent …" reads as a sentence of its
    // own once capitalised; run into the gap it sounded like a subordinate
    // clause and the date stopped registering.
    const since = String(it?.since || '').trim();
    const sinceSentence = since ? since.charAt(0).toUpperCase() + since.slice(1) : '';
    return [it?.gap, classes[it?.class], sinceSentence].filter(Boolean).join(' ');
  });
  return stripMarkers(
    [reg?.opener, ...items, reg?.denominator].filter(Boolean).join('\n\n')
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
      const text = stem === 'situation'        ? situationText(raw, lang)
                 : stem === 'capacity_knownAndUnbuilt' ? gapRegisterText(raw, lang)
                 : stripMarkers(raw);
      if (!text) continue;
      const label = lang === 'fr' ? labelFr : labelEn;
      // A subsection label becomes its own block, marked as a heading, so the
      // generator can give it weight and a longer pause. Run into the body as
      // "Geography. <text>" it read exactly like prose and told the listener
      // nothing.
      if (section.bare || !label) parts.push(text);
      else { parts.push(HEADING + label); parts.push(text); }
    }
    // Blank line between subsections too — "Geography …" and "Biosphere …" are
    // separate blocks, and ran together without a breath before this.
    const label = lang === 'fr' ? section.fr : section.en;
    /*
     * The SECTION title, one level above a subsection heading. Spoken by the
     * first voice always and excluded from the alternation count, so every
     * section opens the same way and adding it does not shift which voice reads
     * which subsection. Without it the report announced "Geography" and
     * "Biosphere" but never "Territory" — no spoken marker for the largest
     * division of the text. The baseline is the page's opener rather than a
     * titled division, so it stays bare.
     */
    const body = parts.join('\n\n');
    const text = !body.trim() ? ''
      : (section.id === 'baseline' ? body : [SECTION_HEADING + label, body].join('\n\n'));
    if (text.trim()) {
      out.push({ id: section.id, label, text });
    }
    // The page shows the scorecard between the baseline and the report
    // sections; the audio follows the page.
    if (section.id === 'baseline') {
      const card = scorecardBlocks(data, lang);
      if (card.trim()) {
        out.push({
          id: 'scorecard',
          label: SCORECARD_LABEL[lang] ?? SCORECARD_LABEL.en,
          text: card,
        });
      }
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

/*
 * Mirrors src/lib/articleTexts.ts cleanForTTS, with one DIVERGENCE: that one
 * turns a paragraph break into ". ", which reads as a full stop and gives the
 * splicer nothing to work with. Here blank lines survive, so an article gets
 * the same 700ms breathing room between paragraphs as a report section.
 */
function cleanForTTS(text) {
  return String(text || '')
    .replace(/[   ]/g, ' ')     // narrow NBSP / NBSP / thin space -> plain space
    .replace(/[ \t]+/g, ' ')
    // Each bullet becomes its own paragraph. This MUST happen before single
    // newlines collapse to spaces below, or there is no line start left to
    // recognise. NOT "• -> ," as articleTexts.ts does: that opened every list
    // on a bare comma, which the engine spoke as a stray noise.
    .replace(/\n[ \t]*[•·▪‣][ \t]*/g, '\n\n')
    .replace(/^[ \t]*[•·▪‣][ \t]*/, '')
    .replace(/ ?\n[ \t]*\n[\s]*/g, '\n\n')
    .replace(/([^\n])\n(?!\n)/g, '$1 ')
    .trim();
}

/** Mirrors src/lib/articleTexts.ts buildArticleText — same order, same joiner. */
// ProjectDetailLayout.tsx renders this above the takeaways block.
const TAKEAWAYS_LABEL = { en: 'Key Takeaways', fr: 'Points clés' };

/*
 * Order MIRRORS THE PAGE (ProjectDetailLayout.tsx): title, subtitle, then the
 * Key Takeaways block — which the layout deliberately shows FIRST, "for quick
 * orientation" — then the introduction under its own heading, then the
 * sections.
 *
 * This DIVERGES from articleTexts.ts buildArticleText, which appends takeaways
 * at the end and never speaks introductionTitle. Heard aloud that put the
 * summary after the argument it was meant to preface, unannounced. The page's
 * own Web Speech narration still has this defect — same fix, separate change.
 */
function buildArticleText(data, lang, isNote = false) {
  const parts = [];
  const heading = (v) => parts.push(HEADING + cleanForTTS(v));
  if (data[`title_${lang}`]) heading(data[`title_${lang}`]);
  if (data[`subtitle_${lang}`]) parts.push(cleanForTTS(data[`subtitle_${lang}`]));

  const takeaways = data.keyTakeaways ?? [];

  if (isNote) {
    /*
     * NOTES render this block differently from essays, and the audio must
     * follow the page rather than the YAML.
     *
     * The Note page (see pages-react/*_Note.tsx) shows the list under the
     * piece's own `introductionTitle` — "Key observations" / "Observations
     * clés" — and renders ONLY each item's description. The per-item
     * `title_*` fields exist in Keystatic but are never displayed.
     *
     * Reading them aloud therefore announced headings no reader can see, and
     * speaking a hard-coded "Key Takeaways" put the wrong name on the section
     * while its real name arrived later, before the introduction — which is
     * why it sounded like the label was repeated at the end of the block.
     */
    if (takeaways.length) {
      if (data[`introductionTitle_${lang}`]) heading(data[`introductionTitle_${lang}`]);
      for (const k of takeaways) {
        if (k[`description_${lang}`]) parts.push(cleanForTTS(k[`description_${lang}`]));
      }
    }
    if (String(data[`introduction_${lang}`] || '').trim()) parts.push(cleanForTTS(data[`introduction_${lang}`]));
  } else {
    // Essays: ProjectDetailLayout shows a "Key Takeaways" block with a title
    // and description per item, then the introduction under its own heading.
    if (takeaways.length) {
      heading(TAKEAWAYS_LABEL[lang] ?? TAKEAWAYS_LABEL.en);
      for (const k of takeaways) {
        if (k[`title_${lang}`]) heading(k[`title_${lang}`]);
        if (k[`description_${lang}`]) parts.push(cleanForTTS(k[`description_${lang}`]));
      }
    }
    if (data[`introductionTitle_${lang}`]) heading(data[`introductionTitle_${lang}`]);
    if (String(data[`introduction_${lang}`] || '').trim()) parts.push(cleanForTTS(data[`introduction_${lang}`]));
  }

  for (const s of data.sections ?? []) {
    if (s[`title_${lang}`]) heading(s[`title_${lang}`]);
    if (s[`content_${lang}`]) parts.push(cleanForTTS(s[`content_${lang}`]));
  }
  // Blank line between blocks: title, subtitle, introduction, each section
  // heading and body, each key takeaway. Each becomes a paced pause.
  return stripMarkers(parts.join('\n\n'));
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
  // Notes and essays use different layouts, and therefore a different spoken
  // order. The filename carries the distinction the content files already made.
  const isNote = /_Note\.ya?ml$/i.test(filename);
  for (const lang of langs) {
    const text = buildArticleText(data, lang, isNote);
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

    /*
     * Remove text files the manifest no longer lists. Sections are numbered by
     * position, so inserting one (the scorecard) renumbers everything after it
     * and leaves the old files behind — 05-political.txt beside 06-political.txt,
     * both looking current. Generation reads the manifest and was unaffected,
     * but anything reading the directory saw every section twice.
     */
    const keep = new Set(manifest.map((m) => m.text));
    for (const f of fs.readdirSync(outDir)) {
      if (f.endsWith('.txt') && !keep.has(f)) {
        fs.unlinkSync(path.join(outDir, f));
        console.log(`   removed stale ${f}`);
      }
    }

    const mins = Math.round(totalChars / 900);
    console.log(`${code}/${lang}: ${sections.length} sections, ${totalChars.toLocaleString()} chars, ~${mins} min -> ${outDir}`);
    for (const m of manifest) {
      console.log(`   ${String(m.order).padStart(2)}. ${m.id.padEnd(10)} ${m.chars.toLocaleString().padStart(8)} ch`);
    }
  }
}

main();
