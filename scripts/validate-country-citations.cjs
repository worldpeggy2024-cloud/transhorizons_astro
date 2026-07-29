const fs = require('fs');
const path = require('path');

function loadYamlModule() {
  const pnpmDir = path.join(process.cwd(), 'node_modules', '.pnpm');
  if (!fs.existsSync(pnpmDir)) {
    throw new Error('Cannot find node_modules/.pnpm; install dependencies first.');
  }

  const pkgDir = fs.readdirSync(pnpmDir).find((n) => n.startsWith('js-yaml@'));
  if (!pkgDir) {
    throw new Error('Cannot find js-yaml in pnpm store.');
  }

  // eslint-disable-next-line import/no-dynamic-require, global-require
  return require(path.join(process.cwd(), 'node_modules', '.pnpm', pkgDir, 'node_modules', 'js-yaml'));
}

const yaml = loadYamlModule();
const anchorsLib = require('./lib/anchors.cjs');
const countriesRoot = path.join(process.cwd(), 'content', 'countries');

const denyDomains = [
  'wikipedia.org',
  'medium.com',
  'blogspot.com',
  'quora.com',
  'reddit.com',
  'x.com',
  'twitter.com',
  'facebook.com',
  'linkedin.com',
  'youtube.com',
  'tiktok.com',
];

function isDeniedDomain(hostname) {
  const host = hostname.toLowerCase();
  return denyDomains.some((d) => host === d || host.endsWith(`.${d}`));
}

function isLikelyGenericHomepage(urlString) {
  try {
    const u = new URL(urlString);
    const normalizedPath = (u.pathname || '/').trim();
    return normalizedPath === '/' && !u.search && !u.hash;
  } catch {
    return false;
  }
}

function parseSources(rawSources) {
  if (Array.isArray(rawSources)) return rawSources;
  if (typeof rawSources === 'string') {
    try {
      const parsed = JSON.parse(rawSources);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

// A source id is a letter-bearing slug (lowercase alnum + hyphens). Requiring
// at least one [a-z] is what separates a real citation from a neutral legal
// citation, which is bracketed and purely numeric — "[1998] 2 S.C.R. 217",
// "[2026] 1 F.C.R." — and must NOT be read as a ghost citation (2026-07-25,
// after CAN constitutionalSubstrate cited the Quebec Secession Reference).
const CITATION_RE_G = /\[([a-z0-9-]*[a-z][a-z0-9-]*)\]/g;
const CITATION_RE = /\[[a-z0-9-]*[a-z][a-z0-9-]*\]/;

function collectCitations(value, out) {
  if (typeof value === 'string') {
    const regex = new RegExp(CITATION_RE_G.source, 'g');
    let m;
    while ((m = regex.exec(value)) !== null) {
      out.add(m[1]);
    }
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) collectCitations(item, out);
    return;
  }

  if (value && typeof value === 'object') {
    for (const v of Object.values(value)) collectCitations(v, out);
  }
}

function sentenceTimeBindingWarnings(text, label, warnings) {
  const sentences = text.split(/(?<=[.!?])\s+/g);
  const citationRegex = /\[[a-z0-9-]+\]/i;
  const numericRegex = /\b\d+(?:[.,]\d+)?%?\b/;
  const timeRegex = /\b(19|20)\d{2}\b|\bQ[1-4]\b|\b(week|month|quarter|year|annual|annually|yoy|y\/y|m\/m)\b/i;

  sentences.forEach((s, i) => {
    if (!citationRegex.test(s)) return;
    const withoutCitations = s.replace(/\[[a-z0-9-]+\]/gi, ' ');
    if (!numericRegex.test(withoutCitations)) return;
    if (!timeRegex.test(withoutCitations)) {
      warnings.push(`${label} sentence ${i + 1}: numeric claim may be missing explicit time binding`);
    }
  });
}

const PEER_ORDER = ['political', 'situation', 'economy', 'territory', 'capacity', 'society', 'security', 'other'];

// ── Situator-opener signature checks (heuristic) ─────────────────────────────
// NINE enforced openers (rework spec §3/§9), pointed at the NEW field names.
// WARNINGS here (existing-files audit); the apply gate in
// deepsearch-country-workflow.cjs fails hard. ONE shared implementation:
// scripts/lib/openers.cjs. Legacy fields (economy_macroReality_* etc.) are
// absent under the new names and skip — existing countries stay valid.
const { OPENER_FIELDS, openerProblem } = require('./lib/openers.cjs');

// Best-effort classification of a source id into the peer whose section it belongs to, so
// uncited (orphan) sources group by peer in the warning output (capacity before territory).
function peerOfSource(id, name) {
  const s = String((id || '') + ' ' + (name || '')).toLowerCase();
  const m = (re) => re.test(s);
  if (m(/nepa|permit|approval|delivery|iija|asce|\bgao\b|productivity|oecd[-_ ]?pmr|interprovincial|interstate|infrastructure|\binfra\b/)) return 'capacity';
  if (m(/\bnca\d?\b|noaa|climate|copernicus|meteorolog|ipcc|\bfao\b|\bfra\b|forest|freshwater|fisher|biosphere|arable|\beia\b|energy|\biea\b|ember|\bco2\b|carbon|emission|transition|mineral|usgs|geolog|nd[-_ ]?gain|adaptation/)) return 'territory';
  if (m(/\bimf\b|\bweo\b|world[-_ ]?bank|\bbis\b|budget|treasury|\bdebt\b|\bgdp\b|\bbea\b|fiscal|deficit|inflation|\bcpi\b|monetary|\bfed\b|moody|fitch|credit[-_ ]?rating|\btrade\b|comtrade|tariff|current[-_ ]?account|sanction/)) return 'economy';
  if (m(/census|demograph|age[-_ ]?sex|population|fertility|migrat|urban|\bkff\b|\brace\b|ethnic|linguistic|religio|\barda\b|templeton|barometer|world[-_ ]?values|social[-_ ]?trust|cohesion/)) return 'society';
  if (m(/acled|\bdhs\b|\bhta\b|\bicg\b|sipri|conflict|terror|insurgen|organized[-_ ]?crime|communal|militar|\bborder\b|threat/)) return 'security';
  if (m(/v[-_ ]?dem|freedom[-_ ]?house|\bwjp\b|rule[-_ ]?of[-_ ]?law|transparency|corruption|democr|electoral|election|standings|legislat|senate|\bhouse\b|congress|\bcrs\b|constitution|\bscotus\b|supreme[-_ ]?court|\bruling\b|amendment|gazette|federal[-_ ]?register/)) return 'political';
  return 'other';
}

function validateCountryFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const data = yaml.load(raw);
  const errors = [];
  const warnings = [];

  // Event sources (Pass Zero-B) are accepted-but-not-required: an uncited event source
  // means the event was found, considered, and excluded — a completed check, not an orphan.
  let eventIds = new Set();
  try {
    const code = path.basename(path.dirname(filePath));
    const eventsFile = path.join(process.cwd(), 'content', 'docs', 'deepsearch-jobs', code, 'pass-zero-b.events.json');
    if (fs.existsSync(eventsFile)) {
      const rawEv = JSON.parse(fs.readFileSync(eventsFile, 'utf8'));
      const arr = Array.isArray(rawEv) ? rawEv : (rawEv && Array.isArray(rawEv.events) ? rawEv.events : []);
      eventIds = new Set(arr.map((e) => e && e.id).filter(Boolean));
    }
  } catch { /* no events file → all sources required */ }

  if (!data || typeof data !== 'object') {
    return { errors: ['Invalid YAML object'], warnings };
  }

  const sources = parseSources(data.sources);
  if (sources.length === 0) {
    errors.push('No sources found (sources block empty or unparsable)');
  }

  const sourceKeys = new Set();
  sources.forEach((s, idx) => {
    const key = s && typeof s.id === 'string' && s.id.trim() ? s.id.trim() : String(idx + 1);

    if (sourceKeys.has(key)) {
      errors.push(`Duplicate source key: ${key}`);
    }
    // Field-set-first marker grammar: a source id equal to a field name could
    // never be cited (rec 2026-07-20; two passes hit the ambiguity).
    if (anchorsLib.isReservedSourceId(key)) {
      errors.push(`Source ${key}: id equals a report field name — reserved, pick another id`);
    }
    sourceKeys.add(key);

    const url = typeof s?.url === 'string' ? s.url.trim() : '';
    if (!url) {
      errors.push(`Source ${key}: missing url`);
    } else {
      try {
        const u = new URL(url);
        if (isDeniedDomain(u.hostname)) {
          errors.push(`Source ${key}: denied domain (${u.hostname})`);
        }
        if (isLikelyGenericHomepage(url)) {
          if (s?.landingPage === true) {
            // Deliberate curator choice: an official landing page that offers the
            // document in both languages beats a language-locked deep link (PDF).
            warnings.push(`Source ${key}: landing-page URL accepted (landingPage: true — bilingual access by design)`);
          } else {
            errors.push(`Source ${key}: generic homepage URL (needs deep link, or "landingPage": true for a deliberate bilingual landing page)`);
          }
        }
      } catch {
        errors.push(`Source ${key}: invalid URL`);
      }
    }

    const required = ['name', 'url', 'desc', 'accessDate', 'confidence', 'citationType'];
    required.forEach((field) => {
      const val = s?.[field];
      if (typeof val !== 'string' || !val.trim()) {
        errors.push(`Source ${key}: missing required field '${field}'`);
      }
    });

    // publicationDate is optional (undated primary sources are allowed),
    // but surface a warning so undated sources remain visible in the audit.
    const pubDate = s?.publicationDate;
    if (typeof pubDate !== 'string' || !pubDate.trim()) {
      warnings.push(`Source ${key}: undated (no publicationDate; relying on accessDate)`);
    }

    // Bilingual sources: nameFr/descFr power the French page (fall back to EN when
    // absent). Warn — don't fail — so untranslated sources surface in the audit.
    if (typeof s?.nameFr !== 'string' || !s.nameFr.trim()) {
      warnings.push(`Source ${key}: missing French name (nameFr; FR page falls back to English)`);
    }
    if (typeof s?.descFr !== 'string' || !s.descFr.trim()) {
      warnings.push(`Source ${key}: missing French description (descFr; FR page falls back to English)`);
    }
    // AI-drafted French awaiting Peggy's review — a placeholder flag on the source.
    // Surfaces here (and clears when she finalizes and removes the flag) so drafted
    // FR is never mistaken for reviewed FR just because nameFr/descFr are present.
    if (s?.frReview) {
      warnings.push(`Source ${key}: French is an AI draft awaiting review (frReview — verify + remove the flag)`);
    }

    // Volatility axis (rework §6.2): expected rate of change of the fact(s) the
    // source backs — drives the refresh worklist. WARN-on-missing during
    // migration (backfill High sources first); orthogonal to confidence.
    // TODO(post-migration): promote to a HARD requirement once CAN + USA are on
    // the new field set and the volatility backfill is complete (comes out
    // together with the LEGACY Keystatic declarations and the §11 parenthetical).
    if (!['High', 'Med', 'Low'].includes(s?.volatility)) {
      warnings.push(`Source ${key}: missing volatility (High|Med|Low — expected rate of change; drives the refresh worklist)`);
    }

    // desc discipline (rework §6.1): soft length warning — a desc past ~50 words
    // is usually carrying claims that belong in the prose.
    if (typeof s?.desc === 'string' && s.desc.trim().split(/\s+/).length > 50) {
      warnings.push(`Source ${key}: desc is ${s.desc.trim().split(/\s+/).length} words (target 20-30; state what the source IS, not its data)`);
    }
  });

  // JSON-in-text blocks must actually parse: a raw newline or unescaped quote
  // inside a string silently blanks the corresponding card on the site (the
  // adapter swallows parse failures), so fail loudly here instead.
  const jsonTextFields = [
    'actors_domestic_en', 'actors_domestic_fr',
    'actors_external_en', 'actors_external_fr',
    'capacity_knownAndUnbuilt_en', 'capacity_knownAndUnbuilt_fr',
  ];
  for (const k of jsonTextFields) {
    const v = data[k];
    if (typeof v !== 'string' || !v.trim()) continue;
    // Actors are JSON arrays; the gap register (capacity_knownAndUnbuilt_*) is
    // a JSON OBJECT {opener, items[], denominator}.
    const wantsObject = k.startsWith('capacity_knownAndUnbuilt');
    try {
      const parsed = JSON.parse(v);
      if (wantsObject) {
        if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') {
          errors.push(`${k}: JSON-in-text must be an object {opener, items, denominator}`);
        }
      } else if (!Array.isArray(parsed)) {
        errors.push(`${k}: JSON-in-text must be an array`);
      }
    } catch (err) {
      errors.push(`${k}: JSON-in-text does not parse (${err.message}) — this field renders EMPTY on the site`);
    }
  }

  // EN/FR paragraph parity (added 2026-07-21 after a Keystatic editing pass
  // lost two FR paragraphs and an EN section silently): substance review can't
  // see what isn't there, but a paragraph-count mismatch between the language
  // pair is mechanical. Counts on the loaded value — folded scalars (>-) turn
  // blank-line paragraph breaks into single \n. Narrative fields only; the
  // JSON-in-text pairs (actors, gap register, situation) are excluded — their
  // internal parity is the citation-parity manual check.
  const paragraphCount = (v) => v.trim().split(/\n+/).filter((p) => p.trim()).length;
  const parityExempt = new Set([...jsonTextFields, 'situation_en', 'situation_fr']);
  for (const [k, v] of Object.entries(data)) {
    if (!k.endsWith('_en') || parityExempt.has(k)) continue;
    const fk = k.slice(0, -3) + '_fr';
    const fv = data[fk];
    if (typeof v !== 'string' || typeof fv !== 'string' || !v.trim() || !fv.trim()) continue;
    const en = paragraphCount(v);
    const fr = paragraphCount(fv);
    if (en !== fr) {
      warnings.push(`PARITY ${k.slice(0, -3)}: EN has ${en} paragraph(s), FR has ${fr} — likely missing content on the ${en > fr ? 'FR' : 'EN'} side`);
    }
  }

  // EN/FR citation-id parity (added 2026-07-28 after a proofing pass found
  // society_language_fr citing two statutes its EN twin had dropped — the
  // paragraph counts matched, so the check above could not see it). Compares the
  // SET of citation ids per narrative field pair; a repetition-count difference
  // is legitimate (a differently-structured sentence may cite an id more or fewer
  // times), so sets, not multisets. Same exemptions as paragraph parity — the
  // JSON-in-text pairs carry their id parity per-item, checked at composition.
  const citeSet = (v) => new Set([...v.matchAll(new RegExp(CITATION_RE_G.source, 'g'))].map((m) => m[1]));
  for (const [k, v] of Object.entries(data)) {
    if (!k.endsWith('_en') || parityExempt.has(k)) continue;
    const fv = data[k.slice(0, -3) + '_fr'];
    if (typeof v !== 'string' || typeof fv !== 'string' || !v.trim() || !fv.trim()) continue;
    const en = citeSet(v);
    const fr = citeSet(fv);
    const enOnly = [...en].filter((x) => !fr.has(x));
    const frOnly = [...fr].filter((x) => !en.has(x));
    if (enOnly.length || frOnly.length) {
      const parts = [];
      if (enOnly.length) parts.push(`EN-only [${enOnly.join('][')}]`);
      if (frOnly.length) parts.push(`FR-only [${frOnly.join('][')}]`);
      warnings.push(`CITE-PARITY ${k.slice(0, -3)}: ${parts.join(', ')} — the language pair cites different sources`);
    }
  }

  const contentClone = { ...data };
  delete contentClone.sources;

  const citations = new Set();
  collectCitations(contentClone, citations);

  for (const c of citations) {
    if (sourceKeys.has(c)) continue;
    // A dotless field anchor — `[situation]`, the one field path without a dot —
    // is not a source citation. Dot-path anchors ([capacity.approvals]) never
    // reach here (the dot breaks the citation pattern); `situation` is the lone
    // dotless field path, and the derived layers (actors, scorecard, posture,
    // inheritedTerrain) legitimately anchor to it. Skip anything the shared
    // FIELD_INDEX recognises as a field (2026-07-27, first hit on CAN actors).
    if (anchorsLib.FIELD_INDEX.has(c)) continue;
    errors.push(`Orphan citation: [${c}] has no matching source`);
  }

  const uncitedEvents = [];
  const orphansByPeer = {};
  for (const s of sourceKeys) {
    if (citations.has(s)) continue;
    if (eventIds.has(s)) {
      uncitedEvents.push(s);
    } else {
      // Non-event orphan: WARNING, not error — a signal about thin prose, not a bad source.
      const peer = peerOfSource(s);
      (orphansByPeer[peer] = orphansByPeer[peer] || []).push(s);
    }
  }
  if (uncitedEvents.length) {
    warnings.push(`Event sources not cited — found, considered, excluded (not orphans): ${uncitedEvents.join(', ')}`);
  }
  const orphanTotal = Object.values(orphansByPeer).reduce((n, a) => n + a.length, 0);
  if (orphanTotal) {
    warnings.push(`Uncited non-event sources (${orphanTotal}) — sections under-written; thicken against these:`);
    for (const peer of PEER_ORDER) {
      const list = orphansByPeer[peer];
      if (list && list.length) warnings.push(`  ${peer} (${list.length}): ${list.join(', ')}`);
    }
  }

  const warningFieldPrefixes = [
    'executiveSnapshot_',
    'political_',
    'political_constitutionalSubstrate_',
    'situation_',
    'economy_',
    'territory_',
    'capacity_',
    'society_',
    'security_',
  ];

  for (const [k, v] of Object.entries(contentClone)) {
    if (typeof v === 'string' && warningFieldPrefixes.some((p) => k.startsWith(p))) {
      sentenceTimeBindingWarnings(v, k, warnings);
    }
  }

  // Situator openers — warning-level audit (the apply gate errors hard on these).
  // OPENER_FIELDS carries dot paths; flat YAML keys use underscores.
  for (const [base, kind] of OPENER_FIELDS) {
    const flatBase = base.replace(/\./g, '_');
    for (const lang of ['en', 'fr']) {
      const v = contentClone[`${flatBase}_${lang}`];
      if (typeof v !== 'string' || !v.trim()) continue;
      const problem = openerProblem(kind, v);
      if (problem) {
        warnings.push(`${flatBase}_${lang}: missing situator OPENER — ${problem}`);
      }
    }
  }

  // Anchors (rework spec §1): [dot.path] markers in narrative fields must
  // resolve to non-empty fields of THIS report (ghost anchor = hard error),
  // respect compose order / allowed sets, and never appear in baseline.
  // Shared implementation: scripts/lib/anchors.cjs.
  const resolveFlat = (p, lang) => {
    const key = `${p.replace(/\./g, '_')}_${lang}`;
    return typeof data[key] === 'string' && data[key].trim().length > 0;
  };
  for (const [k, v] of Object.entries(contentClone)) {
    if (typeof v !== 'string' || !v.trim()) continue;
    const m = k.match(/^([a-z]+)_([a-zA-Z]+)_(en|fr)$/);
    let fieldPath = null, lang = null;
    if (m && ['territory', 'society', 'economy', 'political', 'capacity', 'security'].includes(m[1])) {
      fieldPath = `${m[1]}.${m[2]}`; lang = m[3];
    } else if (/^baseline_(en|fr)$/.test(k)) {
      fieldPath = 'baseline'; lang = k.slice(-2);
    }
    if (!fieldPath) continue;
    anchorsLib.validateFieldAnchors(fieldPath, k, v, (p) => resolveFlat(p, lang), errors);
  }
  if (typeof data.scorecard_anchors === 'string' && data.scorecard_anchors.trim()) {
    anchorsLib.validateScorecardAnchors(data.scorecard_anchors, {
      sourceIds: sourceKeys,
      resolveField: (p) => resolveFlat(p, 'en') || resolveFlat(p, 'fr'),
      errors,
      warnings,
    });
  }
  // Derivatives pending (amendment 2026-07-19): Pass B emits scorecard + baseline
  // EMPTY; the dedicated derivatives pass composes them after the situation pass
  // installs. All-empty is a pending state, not a defect — surface it as one line.
  {
    const scoreAxisKeys = anchorsLib.SCORECARD_AXES.map((a) => `scorecard_${a}`);
    const scoreEmpty = scoreAxisKeys.every((k) => typeof data[k] !== 'string' || !data[k].trim());
    const baselineEmpty = ['baseline_en', 'baseline_fr'].every((k) => typeof data[k] !== 'string' || !data[k].trim());
    if (scoreEmpty && baselineEmpty) {
      warnings.push('scorecard + baseline empty — awaits the derivatives pass (run after the situation pass installs)');
    }
  }
  // Anchors inside the JSON-in-text layers (actors Layer 2, risk ratings —
  // rework §8): ghost-check any [dot.path] markers in the raw blocks.
  for (const k of ['actors_domestic_en', 'actors_domestic_fr', 'actors_external_en', 'actors_external_fr', 'capacity_knownAndUnbuilt_en', 'capacity_knownAndUnbuilt_fr']) {
    const v = data[k];
    if (typeof v !== 'string' || !v.trim()) continue;
    const lang = k.slice(-2);
    for (const mk of anchorsLib.extractMarkers(v).filter((x) => x.type === 'field')) {
      if (!anchorsLib.FIELD_INDEX.has(mk.raw)) errors.push(`${k}: unknown anchor target [${mk.raw}]`);
      else if (!resolveFlat(mk.raw, lang)) errors.push(`${k}: GHOST ANCHOR [${mk.raw}] — target field empty or missing`);
    }
  }

  // Situation — the verified event layer (template §4d), populated by the
  // DEDICATED situation pass as JSON-in-text threads. Legacy prose is accepted
  // at audit level (warning) so the USA report keeps validating until its
  // rework; the apply gate in the workflow rejects prose outright.
  // ARRAY ORDER IS SEMANTIC (threads by recency of last activity, events
  // chronologically forward) — never sort or reorder while validating.
  // KEEP the shape checks in sync with validateSituationThreads in
  // deepsearch-country-workflow.cjs.
  const countryCode = path.basename(path.dirname(filePath));
  // passNotes (the situation pass's per-event verdict record, committed in the
  // job folder as situation-pass.output.json) is the authoritative engagement
  // record when present: scan-event ids never match registry source ids, so
  // the citation heuristic below cannot prove the scan was engaged.
  let passNotesEventIds = null;
  if (eventIds.size > 0) {
    try {
      const outFile = path.join(process.cwd(), 'content', 'docs', 'deepsearch-jobs', countryCode, 'situation-pass.output.json');
      if (fs.existsSync(outFile)) {
        const pn = JSON.parse(fs.readFileSync(outFile, 'utf8')).passNotes;
        if (pn && Array.isArray(pn.events)) {
          passNotesEventIds = new Set(pn.events.map((e) => e && e.id).filter(Boolean));
        }
      }
    } catch { /* unreadable output file → fall back to the citation heuristic */ }
    if (passNotesEventIds) {
      const missing = [...eventIds].filter((id) => !passNotesEventIds.has(id));
      if (missing.length) {
        warnings.push(`situation passNotes: no verdict for scanned event(s) ${missing.join(', ')} — every Pass Zero-B event gets kept/folded/dropped`);
      }
    }
  }
  for (const lang of ['en', 'fr']) {
    const key = `situation_${lang}`;
    const v = contentClone[key];
    if (typeof v !== 'string' || !v.trim()) continue;
    const t = v.trim();
    if (t.startsWith('[')) {
      let threads;
      try { threads = JSON.parse(t); } catch (err) {
        errors.push(`${key}: threads JSON does not parse (${err.message}) — this field renders as RAW TEXT on the site`);
        continue;
      }
      if (!Array.isArray(threads)) {
        errors.push(`${key}: situation JSON must be an ARRAY of threads`);
        continue;
      }
      let eventCount = 0;
      threads.forEach((th, i) => {
        if (!th || typeof th.thread !== 'string' || !th.thread.trim()) warnings.push(`${key}[${i}]: thread name missing`);
        const evs = Array.isArray(th?.events) ? th.events : [];
        if (!evs.length) warnings.push(`${key}[${i}]: no events in thread`);
        evs.forEach((e, j) => {
          eventCount += 1;
          for (const f of ['date', 'what', 'changed']) {
            if (!e || typeof e[f] !== 'string' || !e[f].trim()) warnings.push(`${key}[${i}].events[${j}]: missing "${f}"`);
          }
          if (!CITATION_RE.test(`${e?.what ?? ''} ${e?.changed ?? ''}`)) {
            warnings.push(`${key}[${i}].events[${j}]: no source citation — every event carries one`);
          }
        });
      });
      if (eventCount > 8 && countryCode !== 'USA') {
        warnings.push(`${key}: ${eventCount} events across threads — the cap is 8 (only the United States report may carry more)`);
      }
    } else {
      warnings.push(`${key}: legacy prose format — rework into §4d threads JSON (named threads → dated events → what each materially changed)`);
    }
    // Engagement with the Pass Zero-B scan: a populated situation section can
    // still quietly ignore the event scan. The events may legitimately all be
    // "not material", but that must be said, not skipped. Skipped when a
    // passNotes record covers the scan (checked above) — the heuristic is a
    // legacy fallback and false-positives on id-scheme mismatch.
    if (eventIds.size > 0 && !passNotesEventIds) {
      const cited = new Set();
      collectCitations(v, cited);
      if (![...cited].some((id) => eventIds.has(id))) {
        warnings.push(`${key}: cites none of the ${eventIds.size} scanned event source(s) — verify every Pass Zero-B event is accounted for or explicitly stated as not material`);
      }
    }
  }

  return { errors, warnings };
}

function listCountryFiles(root) {
  if (!fs.existsSync(root)) return [];
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => path.join(root, d.name, 'analysis.yaml'))
    .filter((p) => fs.existsSync(p));
}

const files = process.argv.length > 2
  ? process.argv.slice(2).map((p) => path.resolve(process.cwd(), p))
  : listCountryFiles(countriesRoot);

if (files.length === 0) {
  console.error('No analysis.yaml files found to validate.');
  process.exit(1);
}

let errorCount = 0;
let warningCount = 0;

for (const file of files) {
  const rel = path.relative(process.cwd(), file);
  const result = validateCountryFile(file);

  if (result.errors.length === 0 && result.warnings.length === 0) {
    console.log(`OK   ${rel}`);
    continue;
  }

  if (result.errors.length > 0) {
    console.log(`FAIL ${rel}`);
    result.errors.forEach((e) => console.log(`  - ERROR: ${e}`));
    errorCount += result.errors.length;
  } else {
    console.log(`OK*  ${rel}`);
  }

  if (result.warnings.length > 0) {
    result.warnings.forEach((w) => console.log(`  - WARN: ${w}`));
    warningCount += result.warnings.length;
  }
}

console.log(`\nSummary: ${errorCount} error(s), ${warningCount} warning(s) across ${files.length} file(s).`);
if (errorCount > 0) {
  process.exit(2);
}
