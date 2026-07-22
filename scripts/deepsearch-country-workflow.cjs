const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const anchorsLib = require('./lib/anchors.cjs');

function usage() {
  console.log(`
Deepsearch Country Workflow

Commands:
  init <ISO3> <NameEN> <NameFR>
      Create job prompts/templates for Pass A and Pass B.

  apply <ISO3> --sources <file> --content <file> --date <YYYY-MM-DD> [--nameEn <...>] [--nameFr <...>]
      Validate and apply Pass A (sources) + Pass B (content) into content/countries/<ISO3>/analysis.yaml.

  check <ISO3>
      Run repair dry-run and citation validation for one country file.

JSON schema expectations:
  Sources file (Pass A):
    [
      {
        "id": "imf-weo-2026",
        "name": "...",
        "url": "https://...",
        "desc": "...",
        "publicationDate": "YYYY-MM-DD",
        "accessDate": "YYYY-MM-DD",
        "confidence": "High|Med|Low",
        "citationType": "Fact|Interpretation"
      }
    ]

  Content file (Pass B):
    {
      "scorecard": {
        "eliteCohesion": "High|Med|Low",
        "securityLoyalty": "High|Med|Low",
        "economicPressure": "High|Med|Low",
        "protestCapacity": "High|Med|Low",
        "institutionalResilience": "High|Med|Low"
      },
      "scorecardAnchors": { "eliteCohesion": { "anchors": ["id-or-dot.path"], "rationale_en": "", "rationale_fr": "" }, ... },
      "baseline": { "en": "... [id]", "fr": "... [id]" },
      "territory":  { "geography|biosphere|minerals|climate|metabolism|transition": { "en": "... [id]", "fr": "... [id]" } },
      "society":    { "demographics|composition|language|religion|wellbeing|cohesion": { "en": "... [id]", "fr": "... [id]" } },
      "economy":    { "realEconomy|publicFinances|externalVulnerability|politicalEconomy": { "en": "... [id]", "fr": "... [id]" } },
      "political":  { "powerStructure|rightsAndChecks|stabilityDrivers|shockAbsorbers|constitutionalSubstrate|stateStructure": { "en": "... [id]", "fr": "... [id]" } },
      "capacity":   { "inheritedTerrain|steering|approvals|delivery|publicServices|productivity": { "en": "... [id]", "fr": "... [id]" } },
      "security":   { "posture|internal|military|transnationalExposure|diplomacy": { "en": "... [id]", "fr": "... [id]" } },
      "situation": { "en": "", "fr": "" },
      "actors": { "domestic": { "en": [], "fr": [] }, "external": { "en": [], "fr": [] } }
    }
    (situation/actors/capacity.knownAndUnbuilt are emitted EMPTY — populated by their dedicated passes; the Risk Register was REMOVED 2026-07-20, gap register replaces it)
`);
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function isIsoDate(s) {
  return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s);
}

function collectCitationIds(value, out) {
  if (typeof value === 'string') {
    const regex = /\[([a-z0-9-]+)\]/g;
    let m;
    while ((m = regex.exec(value)) !== null) out.add(m[1]);
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((v) => collectCitationIds(v, out));
    return;
  }

  if (value && typeof value === 'object') {
    Object.values(value).forEach((v) => collectCitationIds(v, out));
  }
}

function parseJsonFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function toJsonBlock(value) {
  return JSON.stringify(value, null, 2);
}

function yamlBlock(label, blockText) {
  const body = String(blockText)
    .split('\n')
    .map((line) => `  ${line}`)
    .join('\n');
  return `${label}: |-\n${body}`;
}

function yamlText(label, value) {
  const safe = String(value ?? '').replace(/'/g, "''");
  return `${label}: '${safe}'`;
}

function nonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

function isGenericHomepage(urlString) {
  try {
    const u = new URL(urlString);
    return (u.pathname || '/') === '/' && !u.search && !u.hash;
  } catch {
    return true;
  }
}

function validateSources(sources) {
  const errors = [];
  const warnings = [];

  if (!Array.isArray(sources) || sources.length === 0) {
    errors.push('Pass A sources must be a non-empty array.');
    return { errors, warnings, ids: new Set() };
  }

  const ids = new Set();
  for (const [idx, s] of sources.entries()) {
    const key = `sources[${idx}]`;
    const required = ['id', 'name', 'url', 'desc', 'accessDate', 'confidence', 'citationType'];

    for (const r of required) {
      if (!nonEmptyString(s?.[r])) errors.push(`${key}.${r} is required`);
    }

    // publicationDate is optional: many primary sources (e.g. government
    // landing pages) expose no reliable publish date. accessDate is the
    // freshness anchor. If absent, allow it but surface a warning rather
    // than forcing a faked or dropped source.
    if (!nonEmptyString(s?.publicationDate)) {
      warnings.push(`${key}.publicationDate absent (source undated; relying on accessDate)`);
    }

    // Bilingual sources: nameFr/descFr power the French page (fall back to EN when
    // absent). Warn rather than fail so partially-translated registries still apply.
    if (!nonEmptyString(s?.nameFr)) {
      warnings.push(`${key}.nameFr absent (French page will fall back to the English name)`);
    }
    if (!nonEmptyString(s?.descFr)) {
      warnings.push(`${key}.descFr absent (French page will fall back to the English desc)`);
    }

    // Volatility axis (rework §6.2): WARN-on-missing during migration, then
    // promote to required. Orthogonal to confidence — never overload confidence
    // to signal freshness.
    // TODO(post-migration): promote to a HARD requirement once CAN + USA are on
    // the new field set and the volatility backfill is complete (comes out
    // together with the LEGACY Keystatic declarations and the §11 parenthetical).
    if (!['High', 'Med', 'Low'].includes(s?.volatility)) {
      warnings.push(`${key}.volatility absent (High|Med|Low — expected rate of change of the fact(s) this source backs)`);
    }

    // desc discipline (rework §6.1): soft length warning.
    if (nonEmptyString(s?.desc) && s.desc.trim().split(/\s+/).length > 50) {
      warnings.push(`${key}.desc is ${s.desc.trim().split(/\s+/).length} words (target 20-30; state what the source IS, not its data)`);
    }

    if (nonEmptyString(s?.id) && !/^[a-z0-9-]+$/.test(s.id)) {
      errors.push(`${key}.id must be lowercase slug (a-z0-9-)`);
    }

    if (nonEmptyString(s?.id)) {
      if (ids.has(s.id)) errors.push(`${key}.id '${s.id}' is duplicated`);
      // Field-set-first marker grammar: a source id equal to a field name
      // could never be cited (rec 2026-07-20; two passes hit the ambiguity).
      if (anchorsLib.isReservedSourceId(s.id)) errors.push(`${key}.id '${s.id}' equals a report field name — reserved, pick another id`);
      ids.add(s.id);
    }

    if (nonEmptyString(s?.publicationDate) && !isIsoDate(s.publicationDate)) {
      errors.push(`${key}.publicationDate must be YYYY-MM-DD`);
    }
    if (nonEmptyString(s?.accessDate) && !isIsoDate(s.accessDate)) {
      errors.push(`${key}.accessDate must be YYYY-MM-DD`);
    }

    if (nonEmptyString(s?.confidence) && !['High', 'Med', 'Low'].includes(s.confidence)) {
      errors.push(`${key}.confidence must be High|Med|Low`);
    }
    if (nonEmptyString(s?.citationType) && !['Fact', 'Interpretation'].includes(s.citationType)) {
      errors.push(`${key}.citationType must be Fact|Interpretation`);
    }

    if (nonEmptyString(s?.url) && isGenericHomepage(s.url)) {
      if (s?.landingPage === true) {
        warnings.push(`${key}: landing-page URL accepted (landingPage: true — bilingual access by design)`);
      } else {
        errors.push(`${key}.url must be a deep link, not homepage (or set "landingPage": true for a deliberate bilingual landing page)`);
      }
    }
  }

  return { errors, warnings, ids };
}

function mustHaveCitation(text, field, errors) {
  if (!nonEmptyString(text)) {
    errors.push(`${field} is empty`);
    return;
  }
  if (!/\[[a-z0-9-]+\]/.test(text)) {
    errors.push(`${field} has no [source-id] citation`);
  }
}

const PEER_ORDER = ['political', 'situation', 'economy', 'territory', 'capacity', 'society', 'security', 'other'];

// Best-effort classification of a source id into the peer whose section it belongs to, so
// uncited (orphan) sources can be grouped by peer in the warning output. Heuristic on id
// keywords; capacity is matched before territory (permitting / clean-energy sources overlap).
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

// ── Situator-opener signature checks (heuristic) ─────────────────────────────
// NINE enforced openers (rework spec §3/§9), pointed at the NEW field names.
// ONE shared implementation: scripts/lib/openers.cjs (also used by
// validate-country-citations.cjs). Legacy fields (economy.macroReality etc.)
// are absent under the new names and skip — existing countries stay valid.
const { OPENER_FIELDS, openerProblem } = require('./lib/openers.cjs');

// Situation threads (template §4d): shape checks for the verified event layer.
// ARRAY ORDER IS SEMANTIC (threads by recency of last activity, events
// chronologically forward) — validation must never sort or reorder.
// KEEP IN SYNC with validate-country-citations.cjs.
function validateSituationThreads(str, label, errors, warnings, isUSA) {
  let threads;
  try { threads = JSON.parse(str); } catch (e) {
    errors.push(`${label}: must be EMPTY (situation pass pending) or a JSON threads array — parse failed: ${e.message.split('\n')[0]}`);
    return;
  }
  if (!Array.isArray(threads)) {
    errors.push(`${label}: situation JSON must be an ARRAY of threads`);
    return;
  }
  let eventCount = 0;
  threads.forEach((t, i) => {
    if (!t || typeof t.thread !== 'string' || !t.thread.trim()) errors.push(`${label}[${i}].thread (name) is required`);
    if (!Array.isArray(t?.events) || t.events.length === 0) {
      errors.push(`${label}[${i}].events must be a non-empty array`);
      return;
    }
    t.events.forEach((e, j) => {
      eventCount += 1;
      for (const k of ['date', 'what', 'changed']) {
        if (!e || typeof e[k] !== 'string' || !e[k].trim()) errors.push(`${label}[${i}].events[${j}].${k} is required`);
      }
      if (!/\[[a-z0-9-]+\]/.test(`${e?.what ?? ''} ${e?.changed ?? ''}`)) {
        errors.push(`${label}[${i}].events[${j}]: every event carries a source citation — none found`);
      }
    });
  });
  if (eventCount > 8 && !isUSA) {
    warnings.push(`${label}: ${eventCount} events across threads — the cap is 8 (only the United States report may carry more); trim to the materially position-changing ones`);
  }
}

function validateContent(content, sourceIds, acceptedExtraIds, eventIds, isUSA, passNotesEventIds = null) {
  const errors = [];
  const warnings = [];

  // Scorecard + baseline are DERIVATIVES composed by the dedicated derivatives
  // pass AFTER the situation pass installs (amendment 2026-07-19). At apply
  // they are legal in exactly two states: ALL-EMPTY (pending the pass) or
  // fully composed. Partial fills are errors, never a valid intermediate.
  const score = content?.scorecard ?? {};
  const scoreKeys = ['eliteCohesion', 'socialCohesion', 'securityLoyalty', 'economicPressure', 'protestCapacity', 'institutionalResilience'];
  const filledScores = scoreKeys.filter((k) => nonEmptyString(score[k]));
  if (filledScores.length === 0) {
    warnings.push('scorecard is empty — awaits the derivatives pass (run after the situation pass installs)');
  } else if (filledScores.length < scoreKeys.length) {
    errors.push(`scorecard partially filled (${filledScores.length}/6) — all six axes or none`);
  } else {
    for (const k of scoreKeys) {
      if (!['High', 'Med', 'Low'].includes(score[k])) {
        errors.push(`scorecard.${k} must be High|Med|Low`);
      }
    }
  }

  // There is NO executive snapshot (rework §5) — its content lives in the
  // section openers. BASELINE replaces it as the derivative always-visible
  // prose: composed by the derivatives pass; both languages or neither.
  const baselineFilled = ['en', 'fr'].filter((lg) => nonEmptyString(content?.baseline?.[lg]));
  if (baselineFilled.length === 0) {
    warnings.push('baseline is empty — awaits the derivatives pass (the page renders nothing there by design; never back-fill)');
  } else if (baselineFilled.length === 1) {
    errors.push(`baseline present in ${baselineFilled[0]} only — both languages or neither`);
  }

  // The 33 fields (rework §3), new names. The anchored-synthesis trio
  // (inheritedTerrain, steering, posture) may satisfy accountability with
  // [dot.path] anchors instead of [source-id] citations.
  // situation and capacity.knownAndUnbuilt are dedicated-pass fields — emitted
  // empty by Pass B, so exempt from the required-non-empty sweep.
  const FIELD_SET = anchorsLib.FIELD_COMPOSE_ORDER.filter((p) => p !== 'situation' && p !== 'capacity.knownAndUnbuilt');
  const ANCHOR_OK = new Set(['capacity.inheritedTerrain', 'capacity.steering', 'security.posture']);
  for (const fieldPath of FIELD_SET) {
    const [peer, fieldName] = fieldPath.split('.');
    for (const lg of ['en', 'fr']) {
      const val = content?.[peer]?.[fieldName]?.[lg];
      const label = `${fieldPath}.${lg}`;
      if (ANCHOR_OK.has(fieldPath)) {
        if (!nonEmptyString(val)) { errors.push(`${label} is required`); continue; }
        const hasMarker = anchorsLib.extractMarkers(val).length > 0;
        if (!hasMarker) errors.push(`${label} must carry at least one [source-id] citation or [dot.path] anchor`);
      } else {
        mustHaveCitation(val, label, errors);
      }
    }
  }

  // Anchors (rework spec §1): [dot.path] markers must resolve to non-empty
  // fields of THIS report (ghost anchor = hard error), respect compose order /
  // allowed sets, never appear in baseline. Shared impl: scripts/lib/anchors.cjs.
  const resolveNested = (p, lang) => {
    if (p === 'situation') return typeof content?.situation?.[lang] === 'string' && content.situation[lang].trim().length > 0;
    const [peer, field] = p.split('.');
    const v = content?.[peer]?.[field]?.[lang];
    return typeof v === 'string' && v.trim().length > 0;
  };
  for (const peer of ['territory', 'society', 'economy', 'political', 'capacity', 'security']) {
    const sec = content?.[peer];
    if (!sec || typeof sec !== 'object') continue;
    for (const [field, byLang] of Object.entries(sec)) {
      for (const lang of ['en', 'fr']) {
        const text = byLang?.[lang];
        if (typeof text !== 'string' || !text.trim()) continue;
        anchorsLib.validateFieldAnchors(`${peer}.${field}`, `${peer}.${field}.${lang}`, text, (p) => resolveNested(p, lang), errors);
      }
    }
  }
  for (const lang of ['en', 'fr']) {
    const text = content?.baseline?.[lang];
    if (typeof text === 'string' && text.trim()) {
      anchorsLib.validateFieldAnchors('baseline', `baseline.${lang}`, text, (p) => resolveNested(p, lang), errors);
    }
  }
  // Anchors inside the JSON layers (actors Layer 2, risk ratings — rework §8):
  // ghost-check any [dot.path] markers in the serialized arrays.
  for (const [label, arr, lg] of [
    ['actors.domestic.en', content?.actors?.domestic?.en, 'en'],
    ['actors.domestic.fr', content?.actors?.domestic?.fr, 'fr'],
    ['actors.external.en', content?.actors?.external?.en, 'en'],
    ['actors.external.fr', content?.actors?.external?.fr, 'fr'],
  ]) {
    if (!Array.isArray(arr) || arr.length === 0) continue;
    for (const mk of anchorsLib.extractMarkers(JSON.stringify(arr)).filter((x) => x.type === 'field')) {
      if (!anchorsLib.FIELD_INDEX.has(mk.raw)) errors.push(`${label}: unknown anchor target [${mk.raw}]`);
      else if (!resolveNested(mk.raw, lg)) errors.push(`${label}: GHOST ANCHOR [${mk.raw}] — target field empty or missing`);
    }
  }
  // Scorecard anchors gate (spec §4): when the scorecard is composed, each axis
  // carries >=1 resolvable anchor + rationale — WARNING-FIRST migration; ghost
  // anchors hard-error. Skipped entirely while the scorecard is empty-pending;
  // anchors without values is the inverse partial fill and is an error.
  const anchorsPresent = content?.scorecardAnchors && Object.keys(content.scorecardAnchors).length > 0;
  if (filledScores.length > 0 || anchorsPresent) {
    if (filledScores.length === 0 && anchorsPresent) {
      errors.push('scorecardAnchors present but scorecard values empty — compose both in the derivatives pass or neither');
    }
    anchorsLib.validateScorecardAnchors(
      anchorsPresent ? JSON.stringify(content.scorecardAnchors) : '',
      {
        sourceIds: new Set([...(sourceIds ?? []), ...(acceptedExtraIds ?? [])]),
        resolveField: (p) => resolveNested(p, 'en') || resolveNested(p, 'fr'),
        errors,
        warnings,
      }
    );
  }

  // Situator openers — HARD ERRORS at the apply gate (regeneration is cheap here;
  // a missed opener that reaches the YAML costs a manual retrofit instead).
  for (const [fieldPath, kind] of OPENER_FIELDS) {
    const [peer, fieldName] = fieldPath.split('.');
    const node = content?.[peer]?.[fieldName];
    for (const lang of ['en', 'fr']) {
      const problem = openerProblem(kind, node?.[lang]);
      if (problem) {
        errors.push(`${fieldPath}.${lang}: missing OPENER (required) — ${problem}`);
      }
    }
  }

  // Situation: held in the schema, populated by the DEDICATED situation pass —
  // never by Pass B (template §4d). At apply it must be EMPTY (pass pending) or
  // already-verified thread JSON; prose is rejected (a generated draft is a
  // starting list to verify, never content).
  for (const lang of ['en', 'fr']) {
    const t = String(content?.situation?.[lang] ?? '').trim();
    if (!t) {
      if (eventIds && eventIds.size > 0) {
        warnings.push(`situation.${lang} is empty — ${eventIds.size} scanned event(s) await the situation pass (situation-pass.prompt.md)`);
      }
      continue;
    }
    if (!t.startsWith('[')) {
      errors.push(`situation.${lang}: prose is not accepted — emit empty (the situation pass populates it) or supply the verified JSON threads array (template §4d)`);
      continue;
    }
    validateSituationThreads(t, `situation.${lang}`, errors, warnings, isUSA);
    // Populated threads should engage the event scan. A passNotes record
    // (situation-pass.output.json) supersedes this citation heuristic — scan
    // ids never match registry ids, so citations cannot prove engagement.
    if (eventIds && eventIds.size > 0 && !passNotesEventIds) {
      const cited = new Set();
      const citeRe = /\[([a-z0-9-]+)\]/g;
      let cm;
      while ((cm = citeRe.exec(t)) !== null) cited.add(cm[1]);
      if (![...cited].some((id) => eventIds.has(id))) {
        warnings.push(`situation.${lang}: cites none of the ${eventIds.size} scanned event source(s) — verify every Pass Zero-B event is accounted for or explicitly stated as not material`);
      }
    }
  }

  // Actors are EMITTED EMPTY by Pass B (rework §8.1 — populated by the
  // dedicated two-layer actors pass from the finished report). Empty arrays
  // are the expected state at apply; when content IS present, shape-check it.
  // Actors accept engagementMode (rework §8.1) or legacy dealability.
  // (Risk Register REMOVED 2026-07-20 — the gap register replaces it.)
  // TODO(post-migration): drop the legacy-dealability acceptance once every
  // displayed country's actors have been regenerated through the actors pass
  // (engagementMode becomes the only accepted key).
  const actorReq = ['name', 'interests', 'resources', 'constraints', 'likelyMoves'];
  const actorPaths = [
    ['actors.domestic.en', content?.actors?.domestic?.en],
    ['actors.domestic.fr', content?.actors?.domestic?.fr],
    ['actors.external.en', content?.actors?.external?.en],
    ['actors.external.fr', content?.actors?.external?.fr],
  ];
  for (const [label, arr] of actorPaths) {
    if (!Array.isArray(arr)) {
      errors.push(`${label} must be an array (empty until the actors pass runs)`);
      continue;
    }
    if (arr.length === 0) {
      warnings.push(`${label} is empty — awaits the dedicated actors pass (rework §8.1)`);
      continue;
    }
    arr.forEach((a, i) => {
      actorReq.forEach((k) => {
        if (!nonEmptyString(a?.[k])) errors.push(`${label}[${i}].${k} is required`);
      });
      if (!nonEmptyString(a?.engagementMode) && !nonEmptyString(a?.dealability)) {
        errors.push(`${label}[${i}]: engagementMode (or legacy dealability) is required`);
      }
    });
  }


  collectCitationIds(content, usedIds);
  // Accepted-to-cite = Pass A sources PLUS calibration-promoted instruments.
  const accepted = new Set([...sourceIds, ...(acceptedExtraIds instanceof Set ? acceptedExtraIds : [])]);
  for (const id of usedIds) {
    if (!accepted.has(id)) {
      errors.push(`Citation [${id}] appears in content but not in Pass A sources or calibration instruments`);
    }
  }
  // Orphan check applies ONLY to sourceIds (Pass A sources must be cited). Calibration
  // instruments are a reference pool — acceptable to cite, not required. Event sources
  // (Pass Zero-B) are ACCEPTED-but-not-REQUIRED too: an uncited event source means the
  // event was found, considered, and excluded — a completed check, not an orphan. Warn,
  // do not fail, and list which events Pass B dropped.
  const events = eventIds instanceof Set ? eventIds : new Set();
  const uncitedEvents = [];
  const orphansByPeer = {};
  for (const id of sourceIds) {
    if (usedIds.has(id)) continue;
    if (events.has(id)) {
      uncitedEvents.push(id);
    } else {
      // Non-event orphan: DOWNGRADED to a warning. An uncited source is a signal about the
      // PROSE (a thin section), not a bad source; blocking here would stop the report being
      // read in order to fix it. Grouped by peer so the thin sections are easy to find.
      const peer = peerOfSource(id);
      (orphansByPeer[peer] = orphansByPeer[peer] || []).push(id);
    }
  }
  if (uncitedEvents.length) {
    warnings.push(`Event sources not cited by Pass B — found, considered, excluded (not orphans): ${uncitedEvents.join(', ')}`);
  }
  const orphanTotal = Object.values(orphansByPeer).reduce((n, a) => n + a.length, 0);
  if (orphanTotal) {
    warnings.push(`Uncited non-event sources (${orphanTotal}) — sections Pass B under-wrote; thicken against these:`);
    for (const peer of PEER_ORDER) {
      const list = orphansByPeer[peer];
      if (list && list.length) warnings.push(`  ${peer} (${list.length}): ${list.join(', ')}`);
    }
  }

  return { errors, warnings };
}

function buildYaml(payload) {
  const c = payload.content;
  const sources = payload.sources;
  const lines = [
    `code: ${payload.code}`,
    `nameEn: ${payload.nameEn}`,
    `nameFr: ${payload.nameFr}`,
    yamlText('lastUpdated', payload.lastUpdated),
    // Empty scorecard values are legal at apply — pending the derivatives pass.
    yamlText('scorecard_eliteCohesion', c.scorecard?.eliteCohesion),
    yamlText('scorecard_socialCohesion', c.scorecard?.socialCohesion),
    yamlText('scorecard_securityLoyalty', c.scorecard?.securityLoyalty),
    yamlText('scorecard_economicPressure', c.scorecard?.economicPressure),
    yamlText('scorecard_protestCapacity', c.scorecard?.protestCapacity),
    yamlText('scorecard_institutionalResilience', c.scorecard?.institutionalResilience),
    ...(c.scorecardAnchors && Object.keys(c.scorecardAnchors).length
      ? [yamlBlock('scorecard_anchors', JSON.stringify(c.scorecardAnchors, null, 2))]
      : []),
    // No executiveSnapshot (rework §5) — baseline is the compose-last derivative.
    // TODO(post-migration): the ?? macroReality / ?? permitting fallbacks below
    // exist only for old-shape content JSON; remove once CAN + USA are on the
    // new field set (new-shape content never carries the legacy names).
    yamlText('baseline_en', c.baseline?.en),
    yamlText('baseline_fr', c.baseline?.fr),
    yamlText('territory_geography_en', c.territory?.geography?.en),
    yamlText('territory_geography_fr', c.territory?.geography?.fr),
    yamlText('territory_biosphere_en', c.territory?.biosphere?.en),
    yamlText('territory_biosphere_fr', c.territory?.biosphere?.fr),
    yamlText('territory_minerals_en', c.territory?.minerals?.en),
    yamlText('territory_minerals_fr', c.territory?.minerals?.fr),
    yamlText('territory_climate_en', c.territory?.climate?.en),
    yamlText('territory_climate_fr', c.territory?.climate?.fr),
    yamlText('territory_metabolism_en', c.territory?.metabolism?.en),
    yamlText('territory_metabolism_fr', c.territory?.metabolism?.fr),
    yamlText('territory_transition_en', c.territory?.transition?.en),
    yamlText('territory_transition_fr', c.territory?.transition?.fr),
    yamlText('society_demographics_en', c.society?.demographics?.en),
    yamlText('society_demographics_fr', c.society?.demographics?.fr),
    yamlText('society_composition_en', c.society?.composition?.en),
    yamlText('society_composition_fr', c.society?.composition?.fr),
    yamlText('society_language_en', c.society?.language?.en),
    yamlText('society_language_fr', c.society?.language?.fr),
    yamlText('society_religion_en', c.society?.religion?.en),
    yamlText('society_religion_fr', c.society?.religion?.fr),
    yamlText('society_wellbeing_en', c.society?.wellbeing?.en),
    yamlText('society_wellbeing_fr', c.society?.wellbeing?.fr),
    yamlText('society_cohesion_en', c.society?.cohesion?.en),
    yamlText('society_cohesion_fr', c.society?.cohesion?.fr),
    yamlText('economy_realEconomy_en', c.economy?.realEconomy?.en ?? c.economy?.macroReality?.en),
    yamlText('economy_realEconomy_fr', c.economy?.realEconomy?.fr ?? c.economy?.macroReality?.fr),
    yamlText('economy_publicFinances_en', c.economy?.publicFinances?.en),
    yamlText('economy_publicFinances_fr', c.economy?.publicFinances?.fr),
    yamlText('economy_externalVulnerability_en', c.economy.externalVulnerability.en),
    yamlText('economy_externalVulnerability_fr', c.economy.externalVulnerability.fr),
    yamlText('economy_politicalEconomy_en', c.economy.politicalEconomy.en),
    yamlText('economy_politicalEconomy_fr', c.economy.politicalEconomy.fr),
    yamlText('political_powerStructure_en', c.political.powerStructure.en),
    yamlText('political_powerStructure_fr', c.political.powerStructure.fr),
    yamlText('political_rightsAndChecks_en', c.political?.rightsAndChecks?.en),
    yamlText('political_rightsAndChecks_fr', c.political?.rightsAndChecks?.fr),
    yamlText('political_stabilityDrivers_en', c.political.stabilityDrivers.en),
    yamlText('political_stabilityDrivers_fr', c.political.stabilityDrivers.fr),
    yamlText('political_shockAbsorbers_en', c.political.shockAbsorbers.en),
    yamlText('political_shockAbsorbers_fr', c.political.shockAbsorbers.fr),
    yamlText('political_constitutionalSubstrate_en', c.political?.constitutionalSubstrate?.en),
    yamlText('political_constitutionalSubstrate_fr', c.political?.constitutionalSubstrate?.fr),
    yamlText('political_stateStructure_en', c.political?.stateStructure?.en),
    yamlText('political_stateStructure_fr', c.political?.stateStructure?.fr),
    yamlText('capacity_inheritedTerrain_en', c.capacity?.inheritedTerrain?.en),
    yamlText('capacity_inheritedTerrain_fr', c.capacity?.inheritedTerrain?.fr),
    yamlText('capacity_steering_en', c.capacity?.steering?.en),
    yamlText('capacity_steering_fr', c.capacity?.steering?.fr),
    yamlText('capacity_approvals_en', c.capacity?.approvals?.en ?? c.capacity?.permitting?.en),
    yamlText('capacity_approvals_fr', c.capacity?.approvals?.fr ?? c.capacity?.permitting?.fr),
    yamlText('capacity_delivery_en', c.capacity?.delivery?.en),
    yamlText('capacity_delivery_fr', c.capacity?.delivery?.fr),
    yamlText('capacity_publicServices_en', c.capacity?.publicServices?.en),
    yamlText('capacity_publicServices_fr', c.capacity?.publicServices?.fr),
    yamlText('capacity_productivity_en', c.capacity?.productivity?.en),
    yamlText('capacity_productivity_fr', c.capacity?.productivity?.fr),
    // Gap register — emitted EMPTY by Pass B; composed by the derivatives pass.
    yamlText('capacity_knownAndUnbuilt_en', c.capacity?.knownAndUnbuilt?.en),
    yamlText('capacity_knownAndUnbuilt_fr', c.capacity?.knownAndUnbuilt?.fr),
    yamlText('security_posture_en', c.security?.posture?.en),
    yamlText('security_posture_fr', c.security?.posture?.fr),
    yamlText('security_internal_en', c.security.internal.en),
    yamlText('security_internal_fr', c.security.internal.fr),
    yamlText('security_military_en', c.security?.military?.en),
    yamlText('security_military_fr', c.security?.military?.fr),
    yamlText('security_transnationalExposure_en', c.security?.transnationalExposure?.en),
    yamlText('security_transnationalExposure_fr', c.security?.transnationalExposure?.fr),
    yamlText('security_diplomacy_en', c.security.diplomacy.en),
    yamlText('security_diplomacy_fr', c.security.diplomacy.fr),
    yamlText('situation_en', c.situation?.en),
    yamlText('situation_fr', c.situation?.fr),
    yamlBlock('actors_domestic_en', toJsonBlock(c.actors.domestic.en)),
    yamlBlock('actors_domestic_fr', toJsonBlock(c.actors.domestic.fr)),
    yamlBlock('actors_external_en', toJsonBlock(c.actors.external.en)),
    yamlBlock('actors_external_fr', toJsonBlock(c.actors.external.fr)),
    yamlBlock('sources', toJsonBlock(sources)),
    '',
  ];

  return lines.join('\n');
}

function parseOptions(args) {
  const opts = {};
  for (let i = 0; i < args.length; i += 1) {
    const a = args[i];
    if (!a.startsWith('--')) continue;
    const key = a.slice(2);
    const val = args[i + 1] && !args[i + 1].startsWith('--') ? args[++i] : true;
    opts[key] = val;
  }
  return opts;
}

const CAL_ANCHOR_PARA = 'The calibration above fixes the instruments this report anchors to. Anchor to THESE instruments. Where a calibration field reads UNRESOLVED, the corresponding report field must be treated as CONTESTED — present the competing accounts and their primary sources; do not resolve the ambiguity by choosing one.';

function calFlag(v) {
  return String(v == null ? '' : v).trim().toLowerCase();
}

// --- Calibration-driven prompt resolvers -------------------------------------------------
// Each resolver returns the FULL four-branch bootstrap text when no calibration exists yet
// (init before Pass Zero), or a SINGLE resolved instruction with the actual value inlined
// when the calibration is present. The full branch logic stays in the human-facing template
// (§14); the generated PROMPT is machine-facing and carries only what applies. Resolving at
// generation time removes the interpretation the model would otherwise do at run time — the
// same discipline as the rest of the pipeline, one layer further in.

function calibrationBlock(cal) {
  if (cal) return '';
  return `## Calibration (from Pass Zero)\n\n[PASTE pass-zero.calibration.json HERE]\n\n${CAL_ANCHOR_PARA}`;
}

function powerStructureAnchor(cal) {
  if (!cal) {
    return 'Anchored to the Pass Zero calibration (cite ONLY real instrument ids — never a literal [calibration] marker). For each chamber in legislature.chambers, give that chamber\'s composition cited to its own liveStandingsUrl, verified on the run date; a standings source is disqualified if it predates the most recent composition-changing event, regardless of publication date. Where executive.unifiedDividedApplies is true, state plainly whether government is unified or divided. On powerLocus: where constitutionalOrganIsWherePowerSits is true, the constitutional allocation is the operative allocation and the field proceeds normally. Where it is false, the standings discipline still applies to the formal organ, but the field must locate actual power in powerLocus.actualLocus and say so explicitly — the formal organ is then described as formal, not operative. Where it is UNRESOLVED, state the constitutional allocation and also state plainly that whether operative power tracks it is contested; present the contest, do not resolve it.';
  }
  const chambers = Array.isArray(cal.legislature && cal.legislature.chambers) ? cal.legislature.chambers : [];
  const chamberText = chambers.length
    ? `Give each chamber's current composition, verified on the run date and cited to its own live standings page (disqualified if it predates the most recent composition-changing event, regardless of publication date): ${chambers.map((c) => `${c.name} (${c.seats} seats) — ${c.liveStandingsUrl}`).join('; ')}.`
    : 'Give the legislature\'s current composition, cited to its official live standings page, verified on the run date.';
  const ud = calFlag(cal.executive && cal.executive.unifiedDividedApplies);
  const udText = ud === 'true'
    ? ' Unified vs divided government applies: state plainly whether government is unified or divided.'
    : ud === 'false'
      ? ' Unified vs divided government does not apply in this system; do not force that frame.'
      : ' Whether unified vs divided government applies is unresolved; note it.';
  const pl = calFlag(cal.powerLocus && cal.powerLocus.constitutionalOrganIsWherePowerSits);
  const plText = pl === 'true'
    ? ' The constitutional allocation is the operative allocation; proceed normally.'
    : pl === 'false'
      ? ` The formal organ is not where power sits: apply the standings discipline to the formal organ, but locate actual power in ${(cal.powerLocus && cal.powerLocus.actualLocus) || 'the actual locus named in Pass Zero'} and say so explicitly — describe the formal organ as formal, not operative.`
      : ' Whether operative power tracks the constitutional allocation is CONTESTED: state the constitutional allocation and state plainly that the operative locus is contested — present the contest, do not resolve it.';
  const execCite = (cal.executive && nonEmptyString(cal.executive.sourceUrl)) ? ' Cite the executive-type determination to calibration-executive-source.' : '';
  return `Anchored to the Pass Zero calibration (cite ONLY real instrument ids — never a literal [calibration] marker). ${chamberText}${udText}${plText}${execCite}`;
}

function substrateAnchor(cal) {
  if (!cal) {
    return 'Anchored to the Pass Zero calibration (cite ONLY real instrument ids — never a literal [calibration] marker). Cite ONLY the instruments listed in substrateInstruments, each by its id. Where legalOrders.structure is plural, hold each order SEPARATELY and name what each governs; do not treat the statutory order as the real one. Where it is UNRESOLVED, present the competing characterisations as contested.';
  }
  const instruments = Array.isArray(cal.substrateInstruments) ? cal.substrateInstruments : [];
  const list = instruments.map((i) => `${nonEmptyString(i.id) ? i.id : slugifyId(i.name)} (${i.name})`).join('; ');
  const instrText = list ? `Cite ONLY these instruments, each by its id: ${list}.` : 'Cite ONLY the instruments identified in Pass Zero, each by its id.';
  const s = calFlag(cal.legalOrders && cal.legalOrders.structure);
  const orders = Array.isArray(cal.legalOrders && cal.legalOrders.orders) ? cal.legalOrders.orders : [];
  const ordersText = s === 'plural'
    ? ` The legal order is plural — hold each order SEPARATELY and name what each governs${orders.length ? `: ${orders.map((o) => `${o.kind} (${o.governs})`).join('; ')}` : ''}. Do not treat the statutory order as the real one.`
    : s === 'single statutory'
      ? ' The legal order is a single statutory order.'
      : ' The legal-order structure is contested — present the competing characterisations as contested.';
  return `Anchored to the Pass Zero calibration (cite ONLY real instrument ids — never a literal [calibration] marker). ${instrText}${ordersText}`;
}

function capacityAnchor(cal) {
  if (!cal) {
    return 'Anchored to the Pass Zero calibration (cite ONLY real instrument ids — never a literal [calibration] marker). Where executionRegime.publishedApprovalsRegimeExists is true, capacity.approvals anchors to executionRegime.permittingAuthorityUrl. Where it is false, permitting timelines are NOT the instrument — name the actual binding constraint on execution and measure that instead. Where territorialControl.status is contested, state which territory the capacity measurement covers.';
  }
  const e = calFlag(cal.executionRegime && cal.executionRegime.publishedApprovalsRegimeExists);
  const eText = e === 'true'
    ? ` A published approvals regime exists: capacity.approvals anchors to ${(cal.executionRegime && cal.executionRegime.permittingAuthorityUrl) || 'the permitting authority named in Pass Zero'} — cite the Pass A source harvested for that regime where one exists; only where Pass A has none, cite it as [permitting-authority] (the promoted fallback id).`
    : e === 'false'
      ? ' No published approvals regime exists: permitting timelines are NOT the instrument — name the actual binding constraint on execution and measure that instead.'
      : ' Whether a published approvals regime exists is unresolved; name the actual binding constraint on execution and measure that.';
  const t = calFlag(cal.territorialControl && cal.territorialControl.status);
  const tText = t === 'contested' ? ' Territorial control is contested — state which territory the capacity measurement covers.' : '';
  return `Anchor to calibration.${eText}${tText}`;
}

function productivityTermClause(cal) {
  if (!cal) return 'use the country\'s own term for barriers between subnational units, as given in subnationalTerm';
  const term = (cal.subnationalTerm && nonEmptyString(cal.subnationalTerm.en)) ? cal.subnationalTerm.en : '';
  return term ? `use ${term} — the country's own term for barriers between subnational units` : 'use the country\'s own term for barriers between subnational units';
}

function geographyPeripheryClause(cal) {
  if (!cal) return 'the periphery, as identified in calibration (periphery.value)';
  const v = (cal.periphery && nonEmptyString(cal.periphery.value)) ? cal.periphery.value : '';
  return v ? `the periphery: ${v}` : 'the periphery, as identified in Pass Zero';
}

function cohesionAnchor(cal) {
  if (!cal) {
    return 'Anchored to the Pass Zero calibration (cite ONLY real instrument ids — never a literal [calibration] marker). The primary instrument is cohesionInstrument.primaryBarometer. Then, on selfReportReliabilityFlag:\n- unconstrained: report the figures directly.\n- partisan-sorted: respondents answer honestly, but responses track which party holds power rather than stable underlying trust. State this plainly, and report cohort or partisan breakdowns rather than the headline aggregate, which is a systematically distorted artefact.\n- constrained: respondents are not free to answer honestly (repression, preference falsification). Reported institutional trust does not measure trust. State this plainly and do not report the figure at face value.\n- UNRESOLVED: present the reliability question as contested and report the figures with that caveat attached.';
  }
  const barometer = (cal.cohesionInstrument && nonEmptyString(cal.cohesionInstrument.primaryBarometer)) ? cal.cohesionInstrument.primaryBarometer : 'the citizen self-report barometer identified in Pass Zero';
  const f = calFlag(cal.cohesionInstrument && cal.cohesionInstrument.selfReportReliabilityFlag);
  const branch = f === 'unconstrained'
    ? 'Report the figures directly.'
    : f === 'partisan-sorted'
      ? 'Respondents answer honestly, but responses track which party holds power rather than stable underlying trust. State this plainly, and report cohort or partisan breakdowns rather than the headline aggregate, which is a systematically distorted artefact.'
      : f === 'constrained'
        ? 'Respondents are not free to answer honestly (repression, preference falsification). Reported institutional trust does not measure trust. State this plainly and do not report the figure at face value.'
        : 'The reliability question is contested — present it as contested and report the figures with that caveat attached.';
  const flagLabel = (cal.cohesionInstrument && nonEmptyString(cal.cohesionInstrument.selfReportReliabilityFlag)) ? cal.cohesionInstrument.selfReportReliabilityFlag : 'UNRESOLVED';
  return `Anchored to the Pass Zero calibration (cite ONLY real instrument ids — never a literal [calibration] marker). The primary instrument is ${barometer}. selfReportReliabilityFlag is ${flagLabel}: ${branch}`;
}

// --- Event-layer resolvers (Pass Zero-B) -------------------------------------------------
// The six-peer schema asks what a country IS; it never asks what is HAPPENING to it. A war
// casts a shadow into no standing-condition field, so Pass A (a list of institutions that
// publish periodic data) never harvests a war source. These resolvers carry the Pass Zero-B
// event scan into Pass A (harvest a source per event) and Pass B (the situation field).

function eventsHarvestBlock(events) {
  if (!events) {
    return '## Events (from Pass Zero-B)\n\n[PASTE pass-zero-b.events.json HERE]\n\nIn ADDITION to the institutional source-priority list above, consume the events above and harvest a primary or authoritative source for EACH event (its own sourceUrl, or a better primary source — government statement, legislature research service, court ruling, official gazette; never a news aggregator). A war, coup, disaster, currency or banking crisis, assassination, mass mobilisation, or major law is the EVENT layer — no institution publishes it as periodic data, so it appears in no source-priority row above and must be sourced here. Where the scan returned UNRESOLVED for an event, note it.';
  }
  if (!events.length) {
    return '## Events (from Pass Zero-B)\n\nThe Pass Zero-B event scan returned NO material events in the last 12 months. Harvest no event sources; the situation field will state that the standing conditions held.';
  }
  const list = events.map((e) => `- ${e && e.id ? `[${e.id}] ` : ''}${(e && e.date) || 'date UNRESOLVED'} — ${(e && e.title) || ''} (${(e && e.status) || 'status UNRESOLVED'}): ${(e && e.whatHappened) || ''} SOURCE: ${(e && e.sourceName) || ''} ${(e && e.sourceUrl) || 'UNRESOLVED'}`).join('\n');
  return `## Events (from Pass Zero-B)\n\nIn ADDITION to the institutional source-priority list further below, harvest a primary or authoritative source for EACH of these events (its own source as listed here, or a better primary source — government statement, court ruling, official gazette; never a news aggregator):\n${list}`;
}

function situationField() {
  // Pass B stands down on situation (Peggy's ruling, template §4d): the field is
  // verification-heavy — recent, fast-moving, contested events, the material most
  // likely to be stale or wrong. A generated draft is a starting list to verify,
  // never content. The dedicated situation pass populates it afterward.
  return 'situation: Emit EMPTY strings for both languages ("en": "", "fr": ""). The situation field is verification-heavy by nature — it holds recent, fast-moving, contested events, exactly the material most likely to be stale or wrong and least likely to have a settled primary source. A generated draft is a starting list to verify, never content, so this pass does NOT write it: it is populated afterward by the dedicated situation pass (situation-pass.prompt.md), event by event against primary sources, in thread format. Do not fold event content into the peer sections to compensate — peer sections describe standing conditions only.';
}

function situationPassPrompt(code, nameEn, nameFr, events, today) {
  const eventsBlock = !events
    ? '## Events proposed by Pass Zero-B (a starting list to VERIFY — never content)\n\n[PASTE pass-zero-b.events.json HERE]'
    : (events.length
      ? '## Events proposed by Pass Zero-B (a starting list to VERIFY — never content)\n\n' + events.map((e) => `- ${(e && e.id) ? `[${e.id}] ` : ''}${(e && e.date) || 'date UNRESOLVED'} — ${(e && e.title) || ''}: ${(e && e.whatHappened) || ''} PROPOSED SOURCE: ${(e && e.sourceName) || ''} ${(e && e.sourceUrl) || 'UNRESOLVED'}`).join('\n')
      : '## Events proposed by Pass Zero-B\n\nThe scan returned NO material events in the last 12 months. Verify that null result; if it holds, the situation field stays empty and the report stands on its peer sections.');
  return `# Situation Pass (${code}) — the verified event layer

Country: ${nameEn} (${nameFr})
Date: ${today}

## Input — the finished report (attached)

You are given ONE attachment: the finished country report as a YAML file (content/countries/${code}/analysis.yaml). No other project context is assumed; everything you need is in this prompt and that file.

- The report's keys are flat: <section>_<subsection>_<language>, e.g. security_diplomacy_en. Its SIX "PEER SECTIONS" — the standing-condition body this pass extends — are the territory_*, society_*, economy_*, political_*, capacity_*, and security_* field families (each field in _en and _fr). Work from the _en fields as primary; the _fr fields carry the same content in French.
- The report's SOURCE REGISTRY is the \`sources\` key: a JSON array of source objects, each with an \`id\`. Every [source-id] citation marker in the report resolves to an entry there. Situation events cite ids from this registry wherever it already holds the right source; a source that is genuinely NOT in the registry goes in the newSources output, never inline-invented.
- The \`situation_en\` and \`situation_fr\` keys in the file are EMPTY — this pass is what writes them.
- In the peerCorrections output, \`field\` uses the dot form of a peer field: e.g. "economy.externalVulnerability" refers to the economy_externalVulnerability_en/_fr keys.
- "Pass Zero-B" is a prior automated lookup pass that scanned the last 12 months for major events; its PROPOSED events are listed near the end of this prompt.

This pass populates the situation field AFTER the peer sections exist. It is verification-heavy by design: it holds recent, fast-moving, contested events — exactly the material most likely to be stale or wrong, and least likely to have a settled primary source. The Pass Zero-B list below is a STARTING LIST TO VERIFY, never content. Research tools can propose events; they cannot be trusted to date them, bound them, or decide what they changed. EVERY event must be verified against an openable primary or authoritative source ON THE RUN DATE before it enters the field.

PURPOSE: The six peer sections describe standing conditions. They have no place to hold discrete events that materially changed the country's position — a war, a tariff regime, a rupture. Without this field, such events vanish from the report entirely even when they dominate the country's situation. This field holds them.

STRUCTURE — threads, not a flat list:
- The field contains THREADS. Each thread is a named strand of related events (e.g. "Trade rupture with the United States", "Defence commitment").
- Threads are ordered by RECENCY OF LAST ACTIVITY — the thread that moved most recently comes first.
- Within a thread, events run CHRONOLOGICALLY FORWARD (oldest first). Non-negotiable: a causal chain told in reverse is unreadable.
- Each thread may carry an optional current-state line at the end, summarising where the thread stands now.

EACH EVENT:
- date — the date (or date range) the event occurred, leading.
- what — what happened: one sentence, factual, no characterisation.
- changed — what it materially changed: the consequence. If you cannot state a material change without editorialising, the event does not belong in this field.

CONTENT RULES:
- Maximum 8 events total across all threads${code === 'USA' ? ' (the United States report may carry more)' : ' (only the United States report may carry more)'}.
- Only events that materially changed the country's position. Not notable news.
- Exclude anything already covered structurally elsewhere — seat composition, budget measures, standing policy, demographic trends. Those belong to their peer sections. This field is for events with no natural home in a description of standing conditions.
- No explanation by character or motive. State what changed, not why anyone did it.
- Every event carries a source citation [source-id], same as any other field.
- Where an event supersedes or contradicts a claim in a peer section, the PEER SECTION must be corrected — this field does not exist to hold contradictions, it exists to surface them. List any such corrections in "peerCorrections".
- EVERY event proposed by Pass Zero-B gets a recorded verdict in "passNotes": kept, folded (carried as context inside another event or thread, not as its own entry), or dropped — with the test a non-kept event failed and the decisive evidence. The scan is automated and has no memory: a decision recorded only in a chat transcript is a decision the next run re-litigates from zero.

DISCIPLINES (same as the main passes): acronyms spelled out at first mention, no exceptions; source titles in the source's own language(s), never translated; source desc states what the source IS (roughly 20-30 words), never the specific numbers or claims; EN and FR carry the same facts and cite the same IDs.

${eventsBlock}

Return ONLY a JSON object:
{
  "situation": {
    "en": [ { "thread": "…", "events": [ { "date": "…", "what": "… [source-id]", "changed": "… [source-id]" } ], "currentState": "… [source-id] (optional)" } ],
    "fr": [ the same threads, in French ]
  },
  "newSources": [ any sources cited above that are not already in the report's registry — all fields: id, name, nameFr, url, desc, descFr, publicationDate (omit if undated), accessDate, confidence, citationType ],
  "peerCorrections": [ { "field": "e.g. economy.externalVulnerability", "correction": "what the peer section must now say and why" } ],
  "passNotes": {
    "runDate": "the run date (YYYY-MM-DD)",
    "events": [ ONE entry per Pass Zero-B event id, no omissions: { "id": "the scanned event id", "verdict": "kept | folded | dropped", "test": "for folded/dropped: the rule it failed and the decisive evidence, one or two sentences" } ],
    "notes": "run-note resolutions and anything the NEXT run must see: window calls, sources to retire or rename, could-not-verify items"
  }
}
`;
}

// Derivatives pass (amendment 2026-07-19 to the rework's compose-last rule):
// the scorecard and baseline are composed by THIS dedicated pass, after the
// situation pass has installed and its peer corrections are approved — the
// last point at which the report's facts can change. Pass B emits both empty.
function derivativesPassPrompt(code, nameEn, nameFr, today) {
  return `# Derivatives Pass (${code}) — scorecard + baseline + gap register

Country: ${nameEn} (${nameFr})
Date: ${today}

## Input — the finished report (attached)

You are given ONE attachment: the finished country report as a YAML file (content/countries/${code}/analysis.yaml). No other project context is assumed; everything you need is in this prompt and that file.

- The report's keys are flat: <section>_<subsection>_<language>, e.g. political_powerStructure_en. Its SIX PEER SECTIONS are the territory_*, society_*, economy_*, political_*, capacity_*, and security_* field families (each field in _en and _fr), and situation_en/_fr hold the verified event layer as JSON threads. Work from the _en fields as primary; the _fr fields carry the same content in French.
- The report's SOURCE REGISTRY is the \`sources\` key: a JSON array of source objects, each with an \`id\`. Every [source-id] marker in the report resolves there.
- The scorecard_* keys, baseline_en/fr, and capacity_knownAndUnbuilt_en/fr in the file are EMPTY — this pass is what writes them.
- The actors_* keys are NOT input, even where populated: actors Layer 2 is unverified AI-drafted interpretation. Compose from the peer fields, the situation threads, and the registry ONLY — a derivative may not summarise another derivative. For the GAP REGISTER specifically, capacity_inheritedTerrain_* and security_posture_* are also not sources of gaps (each is assembled from other fields); capacity_inheritedTerrain_* is read for orientation and as the denominator the guard requires — trace anything it reflects back to the underlying peer field and anchor there.

**This pass is CLOSED-BOOK.** Run it with research/web search off; if search cannot be disabled, do not use it. Both outputs are DERIVATIVES: they summarise the attached report and may introduce NO fact that does not already appear, cited, in it.

SEQUENCING GUARD: this pass runs AFTER the situation pass has installed and its peer corrections are applied — the report you are reading is the final fact state. If situation_en is empty, STOP and say so instead of composing: the sequencing is wrong.

## Scorecard

Six axes, each rated High, Med, or Low — citationType: Interpretation, derivative:

- eliteCohesion — intra-power-bloc unity (start from political.stabilityDrivers, political.powerStructure)
- socialCohesion — society-wide trust and polarisation, distinct from elite cohesion (society.cohesion)
- securityLoyalty — armed-forces and security-force loyalty AND who controls them (political.stabilityDrivers, security.internal)
- economicPressure — the pressure the economy currently puts on the political order (economy.*, situation)
- protestCapacity — the population's demonstrated capacity to mobilise (society.cohesion, situation)
- institutionalResilience — the institutions' demonstrated capacity to absorb shocks (political.shockAbsorbers, political.rightsAndChecks, capacity.*, situation)

The field pointers are starting points, not limits — rate each axis from the WHOLE report, including the situation threads: the fast-moving event layer is exactly what the ratings must reflect.

## Scorecard anchors

For EACH of the six axes: the anchors the rating summarises and a one-line rationale in both languages.

"scorecardAnchors": {
  "eliteCohesion": { "anchors": ["source-id", "political.stabilityDrivers"], "rationale_en": "one line — why those facts produce this value", "rationale_fr": "une ligne" },
  ... (all six axes)
}

Each axis needs >= 1 anchor. Anchors are [source-id]s from the registry or dot field paths (e.g. political.shockAbsorbers, situation); an anchor to an empty field or an id not in the registry is a GHOST and is rejected by the validators.

## Baseline

A short paragraph (not one line, not long) in BOTH languages — the page's only always-visible prose, enough for a reader to decide whether to open this country. Present-state characterisation, never a forecast. It introduces no fact not already cited in the report and carries NO new sources; any citation markers must be ids already used in this report. It carries no [dot.path] anchors. It is named Baseline, never "Outlook." Where the situation field holds material events (a war, a rupture, a regime change), the baseline reflects them — it must not read as if the standing conditions were the whole story.

## Gap register — capacity.knownAndUnbuilt (canonical contract: known-and-unbuilt-pass-template.md)

ANCHORED SYNTHESIS — introduces NO new sourced fact. Every item is a close paraphrase of a claim already cited in this report, anchored to the field(s) asserting it. Never invent a marker of either kind. A real, well-known gap this country plainly has that the report does not assert is a VIOLATION — record its absence in notCarried instead.

SCAN every peer field and every situation thread for claims the report asserts with a resolvable [source-id] that describe a shortfall between what the state can do and what it requires — a backlog, an unmet standard, an absent capability, an unremoved barrier, a capacity named alongside a requirement it does not meet, a project class proposed but not built. Recall over precision; the gate decides.

GATE — an item qualifies only if all five hold:
1. ASSERTED. The report already states it, with a resolvable [source-id], in a peer field or a situation thread.
2. A GAP, NOT A CONDITION. A shortfall between capability and requirement — not a fact, a trend, a trade-off, or an exposure. Population ageing is a trend; a commodity exposure is a structural position; neither is a gap.
3. INTERNAL. Closing it lies within the country's own authority. Where the report asserts an external dependency, the register names the UNBUILT DOMESTIC RESPONSE, not the exposure.
4. OPEN. The report does not state it closed. Where the situation layer shows it closing, it leaves the register; where it shows a commitment to close it, it stays, classed accordingly.
5. MISSING, NOT UNDONE. The report states this as a capability or provision that is absent or insufficient — not as a commitment, target, project or programme that existed and was withdrawn, cancelled, or reversed by decision. A reversal is a choice; choices are carried by the fields that describe policy, not by this register.
Record every rejection in notCarried with the test it failed.

AGGREGATE where several assertions across fields are one gap, naming every contributing anchor. KEEP ATOMIC where the gaps would be closed by different actions. Never generalise beyond citation.

OPENER (required, one to three sentences): the standard three jobs — state what kind of case this country is on documented-but-unclosed gaps, signal how central and which way it is moving, declare depth — PLUS one job specific to this field: DECLARE THE DOCUMENTATION BASE the register rests on (the national audit institution, independent fiscal or budget office, statutory review bodies, government evaluation units, or their absence). A country that publishes little self-assessment produces a short register because it documents less, not because it has closed more; where the base is thin, say so — the thinness is the finding. The opener carries NO [dot.path] anchors and states no new facts.

PER ITEM: gap (one sentence, close paraphrase — the report speaking, not the composer, with inline markers); anchor ([dot.path] field(s) and [source-id](s), at least one, all resolving; the bare situation is a valid field anchor — a gap asserted only in a situation thread anchors situation plus the event's source id); since (when first officially identified, or a duration the report STATES, cited; a publication, edition or measurement date is NOT a since — a vintage rendered as a duration is a false claim; where that is all the report carries, use 'report-silent' and record the item in undatedGaps — never fabricate); class (no-attempt-documented | announced-not-implemented | attempted-and-failed | in-progress-unclosed — Interpretation, assigned only from the observable record: announced-not-implemented needs a stated announcement in the report; no-attempt-documented needs the report's silence on any attempt PLUS a source that would have recorded one — the class states what the report documents, never what the country did. A rating that worsened across assessments is not by itself evidence of an attempt: assign attempted-and-failed only where the report STATES an attempt was made and did not close the gap; assign in-progress-unclosed only where the report STATES work is under way).

GUARD (mandatory): this register is read against capacity.inheritedTerrain as its denominator. Capacity is inherited and distributed — by history, colonialism, resource geography, luck — never earned or deserved. Where the report supports it, close with a denominator sentence naming WHY the capacity to close gaps is where it is. A gap is never rendered as a merit gap; the register's length is never a verdict on the country.

NOT IN SCOPE: no trigger, no probability, no impact, no mitigants, no forecast, no ranking, no count presented as a score. Length is evidence-bound; a short honest register beats a padded one.

DISCIPLINES: acronyms spelled out at first mention, no exceptions; EN and FR carry the same substance, the same items in the same order, and the same citation ids.

**Self-check before returning:** every anchor resolves to a non-empty field of the attached report or an id present in its registry; the baseline cites no id outside the registry; all six axes carry a value, at least one anchor, and both rationales; every register item passes all five gate tests; no register item rests on actors, scorecard, baseline, inheritedTerrain or posture content (each is itself assembled from other fields — a summary may not rest on a summary); the register opener declares the documentation base; the denominator sentence is present where the report supports it; no trigger/probability/impact/mitigant/forecast anywhere; nothing in the register comes from your own knowledge of the country. Fix failures before returning; do not ship them.

Return ONLY a JSON object:
{
  "scorecard": { "eliteCohesion": "High|Med|Low", "socialCohesion": "…", "securityLoyalty": "…", "economicPressure": "…", "protestCapacity": "…", "institutionalResilience": "…" },
  "scorecardAnchors": { all six axes as specified above },
  "baseline": { "en": "…", "fr": "…" },
  "knownAndUnbuilt": {
    "en": { "opener": "…", "items": [ { "gap": "…", "anchor": ["capacity.approvals", "source-id"], "since": "…", "class": "never-attempted" } ], "denominator": "…" },
    "fr": { the same, in French, same order, same anchors }
  },
  "notCarried": [ { "candidate": "…", "test": "which of the four gate tests it failed" } ],
  "undatedGaps": [ { "field": "capacity.productivity", "gap": "…", "note": "no duration in the approved sources — Pass A extension needed" } ]
}

undatedGaps is the §12 persistence-clause punch list: gaps the report carries but cannot date. It feeds the next Pass A, not this field.
`;
}

function initCommand(iso3, nameEn, nameFr) {
  const code = String(iso3).toUpperCase();
  const jobDir = path.join(process.cwd(), 'content', 'docs', 'deepsearch-jobs', code);
  ensureDir(jobDir);

  const passAPath = path.join(jobDir, 'pass-a.prompt.md');
  const passBPath = path.join(jobDir, 'pass-b.prompt.md');
  const srcTemplatePath = path.join(jobDir, 'pass-a.sources.template.json');
  const contentTemplatePath = path.join(jobDir, 'pass-b.content.template.json');
  const passZeroPath = path.join(jobDir, 'pass-zero.prompt.md');
  const calibrationTemplatePath = path.join(jobDir, 'pass-zero.calibration.template.json');
  const passZeroBPath = path.join(jobDir, 'pass-zero-b.prompt.md');
  const eventsTemplatePath = path.join(jobDir, 'pass-zero-b.events.template.json');

  const today = new Date().toISOString().slice(0, 10);

  // Calibration-aware generation: if Pass Zero has run and pass-zero.calibration.json exists,
  // resolve the field branches to the single applicable instruction with inlined values;
  // otherwise emit the bootstrap prompt (paste block + full branches). Flow for a new country:
  // init -> Pass Zero -> init again (now resolved) -> Pass A -> Pass B -> apply.
  const calPath = path.join(jobDir, 'pass-zero.calibration.json');
  let calibration = null;
  try {
    if (fs.statSync(calPath).isFile()) {
      const rawCal = JSON.parse(fs.readFileSync(calPath, 'utf8'));
      calibration = Array.isArray(rawCal) ? rawCal[0] : rawCal;
    }
  } catch (err) {
    calibration = null;
  }
  const calBlockText = calibrationBlock(calibration);
  const powerAnchorText = powerStructureAnchor(calibration);
  const substrateAnchorText = substrateAnchor(calibration);
  const capacityAnchorText = capacityAnchor(calibration);
  const productivityTermText = productivityTermClause(calibration);
  const geographyPeripheryText = geographyPeripheryClause(calibration);
  const cohesionAnchorText = cohesionAnchor(calibration);

  // Event-aware generation: Pass Zero-B (the event scan) runs after Pass Zero, before Pass A.
  // If pass-zero-b.events.json exists, inline the events into Pass A's harvest directive and
  // Pass B's situation field; otherwise emit the bootstrap paste block.
  const eventsPath = path.join(jobDir, 'pass-zero-b.events.json');
  let events = null;
  try {
    if (fs.statSync(eventsPath).isFile()) {
      const rawEvents = JSON.parse(fs.readFileSync(eventsPath, 'utf8'));
      events = Array.isArray(rawEvents) ? rawEvents : (rawEvents && Array.isArray(rawEvents.events) ? rawEvents.events : []);
    }
  } catch (err) {
    events = null;
  }
  const eventsBlockText = eventsHarvestBlock(events);
  const situationFieldText = situationField();
  const situationPassPath = path.join(jobDir, 'situation-pass.prompt.md');
  const situationPassText = situationPassPrompt(code, nameEn, nameFr, events, today);

  // Society/territory/capacity/constitutional-substrate sourcing + section wording
  // below is taken VERBATIM from content/docs/country-report-present-state-template.md
  // (§6 source priority, §9b political anchors, §9c/§9d disciplines, §14 research-pass
  // prompt — six-peer revision). Keep it in sync with that template.
  const passA = `# Pass A Prompt (${code})

Country: ${nameEn} (${nameFr})
Date: ${today}

You are a geopolitical analyst preparing to write a structured country situation report on ${nameEn} for an audience of senior decision-makers and investors. Before writing any prose, your task in this pass is to assemble a high-quality source list only.

${calBlockText}

${eventsBlockText}

Return ONLY a JSON array of sources. No prose, no analysis, no section headers — just sources.

Each source must match this schema (7 English fields required, plus nameFr/descFr for the French page; publicationDate optional):
[
  {
    "id": "short-slug",
    "name": "Official published title — the source's English title if it publishes one; otherwise the original-language title verbatim (never translated)",
    "nameFr": "Titre officiel en français si la source en publie un; sinon le titre original tel quel — jamais traduit",
    "url": "https://exact-url-to-specific-document-not-homepage",
    "desc": "Roughly 20-30 words (English): what the source IS — kind (national inventory report, live standings page, court ruling, official assessment), coverage domain, authoritative status, any bias or reservation. NOT the specific numbers or claims. For single-language sources, add a translation of the title here (plus a transliteration for non-Latin scripts).",
    "descFr": "La même description, en français — jamais les chiffres ni les affirmations que la prose citera.",
    "publicationDate": "YYYY-MM-DD or omit if the page shows no reliable date",
    "accessDate": "${today}",
    "confidence": "High | Med | Low",
    "citationType": "Fact | Interpretation"
  }
]

publicationDate rule: include it ONLY if the source genuinely shows a publication
or last-updated date. If a legitimate primary source (e.g. a government landing
page) has no reliable date, OMIT the field entirely — do NOT guess, approximate,
or copy accessDate into it. An honest undated source is preferred over a faked date
or a worse source chosen only because it shows a date. accessDate is always required.

Sourcing disciplines (no exceptions):
- Source titles in the source's own language(s), never translated. A source's title is a proper name in its own language; harvest the ACTUAL published title, whatever the language (French, English, Russian, Chinese, Korean, Arabic, Kiswahili, Spanish, or any other). Published bilingually or multilingually (many Canadian federal sources, most international organizations, European Union institutions): capture each official language version — name = the official English title, nameFr = the official French title. Published in only one language: use the original title verbatim — original script included — for BOTH name and nameFr, and put a translation of the title (plus a transliteration for non-Latin scripts) in desc/descFr. Never fabricate a title in a language the source does not publish in; if the source has no official title in a report language, do not invent one. A translated title breaks findability (search engines, library catalogues, artificial-intelligence queries) and, in artificial-intelligence-mediated search, risks returning something entirely different that merely looks plausible.
- Source descriptions describe the source, not the data. desc states what the source IS — its scope, role, and authoritative status — in roughly 20 to 30 words: the kind of source (national inventory report, live standings page, court ruling, official assessment), its coverage domain, and any bias or reservation. It does NOT state the specific numbers or claims the prose will draw from it; factual claims live in the prose, cited to the source ID. Diagnostic test: if a fact in the desc could be silently edited to a new value while the prose still cites the ID unchanged, the fact does not belong in desc — it is a claim, and claims live in prose only. (A title translation or transliteration in desc is descriptive metadata about the source's identity, not a claim.)
- Acronyms: the first mention of any acronym or initialism — no exceptions — spells the term in full, followed by the abbreviation in parentheses on that first mention only; all subsequent mentions in the same report may use the short form. This applies to every acronym without carve-outs: universal ones (GDP, UN, EU), sectoral ones (LULUCF, RCP, FPIC), organizational ones (IMF, OECD, NATO, WHO), country-specific ones (RCMP, NRCan, StatCan, PBO), and any others. ISO-3166 alpha-3 country codes used as internal identifiers (CAN, USA, DEU) are structural markers, not acronyms in prose, and are exempt when they appear as data-field identifiers; when such a code appears in reader-facing prose, spell it: "Canada," not "CAN."

Source priority rules:
- Macro/Finance: national statistics office, IMF, World Bank, BIS, OECD
- Governance/Rule of law: V-Dem, Freedom House, World Justice Project (WJP)
- Government composition (who governs now): the national legislature's official LIVE seat-standings page, verified on the run date — a standings source is DISQUALIFIED if it predates the most recent composition-changing event (regardless of its publication date); majority/minority/coalition status derived from it. Legislature size and the election calendar keep an ordinary recency gate.
- Corruption: Transparency International
- Conflict/Security: ACLED, SIPRI, International Crisis Group (ICG)
- Society / protest & mobilisation (added 2026-07-19 — the scorecard's protestCapacity axis has NO numerator without it): ACLED protest/riot event counts and trends as REPORTABLE FIGURES for this country (a deep link to the data, not a citation of the tracker), mass-mobilisation datasets, strike/labour-action statistics where the country publishes them
- Trade: WTO, UN Comtrade
- Society / demography: UN DESA World Population Prospects, national census, national statistics office
- Society / composition (ethnic·linguistic·religious): national census, Pew–Templeton Global Religious Futures, ARDA (Association of Religion Data Archives)
- Society / cohesion & social capital: the region's own citizen self-report barometer as the PRIMARY instrument — Afrobarometer, Arab Barometer, Latinobarómetro, Asian Barometer, Eurobarometer, World Values Survey, or Pew (PRIMARY here, not triangulation)
- Territory / climate (physical): Intergovernmental Panel on Climate Change, national climate assessment, World Bank Climate Change Knowledge Portal, national meteorological service, Copernicus
- Territory / minerals (subsurface endowment): United States Geological Survey mineral commodity summaries, national geological survey, International Energy Agency (critical minerals)
- Territory / biosphere (forests·water·land·fisheries): Food and Agriculture Organization, national resource agencies
- Territory / metabolism & transition: International Energy Agency, Energy Institute statistical review, Ember (electricity), national inventories (UN climate convention), Global Carbon Project, Climate Action Tracker — PRIMARY for pledge-vs-policy
- Territory / adaptive capacity: Notre Dame Global Adaptation Initiative index, World Bank, national adaptation plans
- Capacity to deliver (inherited terrain·steering·approvals·delivery·public services·productivity): national statistics office, OECD, auditor-general and evaluation reports, national infrastructure & regulatory bodies, sector permitting authorities, health/education system statistics
- Political rights & checks: court rulings, national human-rights institutions, regional human-rights bodies (primary); Freedom House / Bertelsmann with the scorer's bias named
- Military: International Institute for Strategic Studies (IISS) Military Balance, SIPRI, national defence budgets
- Society / language & wellbeing: national census, UNESCO Institute for Statistics, WHO / Global Burden of Disease, national health and education statistics
- Constitutional substrate (deep-time legal): founding constitutional text; apex-court rulings (constitutional and title); the statutory codification of the sovereignty relationship; the legislature's own non-partisan research service; treaty text where applicable; official gazette — never news
- NAMED ACTORS (networks have members, sectors have producers, elites have names — added 2026-07-19 after
  the USA actors pass exposed a report with an unnamed "alliance network" and zero named firms, unions or
  civil-society bodies): for security.diplomacy, harvest the membership itself — treaty texts, the
  alliance's own member list, foreign-ministry collective-defence pages, basing/presence data; for
  economy.politicalEconomy, sources NAMING the largest firms and principal producers of the leading
  sectors and the main labour federations (official filings and statistics; recognised rankings with the
  ranker's bias named); for society.cohesion, the main civil-society or labour bodies where they carry
  policy weight. Aggregate measurements alone cannot support these fields.
- Recent events of fact: national news outlets ONLY for events verified as fact in the last 90 days
- Do NOT cite Wikipedia, homepages, aggregators, or blogs
- Deep links only — the specific document or data page, not a site homepage

The sources you collect must be sufficient to support ALL of the following content fields in Pass B
(33 fields, six peers — there is NO executive snapshot; the BASELINE and the scorecard are composed by
the separate DERIVATIVES pass from already-cited material and need no sources of their own):

TERRITORY (geography → biosphere → minerals → climate → metabolism → transition)
1. territory.geography — the physical arrangement the country must overcome to function as one country — land area and internal distances; habitable vs empty land; coastlines and ports; ${geographyPeripheryText}. Internal connectivity (road, rail, grid, broadband) belongs to metabolism. Distinct from the border-security question (SECURITY).
2. territory.biosphere — forests, freshwater (as STOCK; distribution is metabolism), arable land, fisheries as physical stock and condition/trend, with year and source. Distinct from agricultural/forestry output (ECONOMY).
3. territory.minerals — the critical-mineral and subsurface endowment (reserves and resources, each with year and estimating body named; flag disputed or state-controlled counts), including undeveloped and stranded deposits. What the ground HOLDS, distinct from mining output/exports (ECONOMY).
4. territory.climate — observed and projected physical climate — zones, warming recorded, hazards LOCATED geographically; every projection with emissions scenario AND horizon; physical science only; each exposure PAIRED with adaptive capacity.
5. territory.metabolism — how the country physically runs and circulates AS A SYSTEM (energy, food, water, movement of goods and people, the physical communications backbone); self-sufficiency vs dependence in each; absorbs the connectivity networks from geography.
6. territory.transition — decarbonisation position — energy mix, emissions profile and DELIVERED path vs pledge; Climate Action Tracker as the PRIMARY pledge-vs-policy instrument.

SOCIETY (demographics → composition → language → religion → wellbeing → cohesion)
7. society.demographics — population and age structure; urban/rural split; internal and cross-border migration; fertility/dependency. All figures tied to a year.
8. society.composition — ethnic composition (rounded shares, year, source) and the CLEAVAGE GEOMETRY (cross-cutting vs reinforcing). Language content lives in its own field.
9. society.language — linguistic composition (rounded shares, year, source; flag contested or suppressed counts); lived texture (diglossia, vernacular vs official, lingua franca, language of instruction vs home language); political salience (official-language regime, language law, linguistic nationalism). Name each source and its known bias.
10. society.religion — composition rounded + fault line; lived/syncretic texture; political salience; named-bias sourcing; contested or suppressed counts flagged.
11. society.wellbeing — health and educational OUTCOMES (life expectancy, healthy-life expectancy, mortality/morbidity drivers, child/maternal mortality where relevant; attainment, literacy, skills), each with the access gradient. Outcomes only — the systems go to capacity.publicServices.
12. society.cohesion — population-wide social trust (interpersonal AND institutional), social capital, national identity and self-conception. The region's own citizen barometer is PRIMARY. Where organised labour or civil-society bodies carry policy weight, include a source that NAMES them. ${cohesionAnchorText}

ECONOMY (realEconomy → publicFinances → externalVulnerability → politicalEconomy)
13. economy.realEconomy — sectors and what people do for a living; growth; sector performance; technology as a business sector. Fiscal/monetary/debt content belongs to publicFinances.
14. economy.publicFinances — the state's money: budget balance (deficit/surplus, % of GDP), public debt as a share of the economy, central-bank / monetary-policy stance, inflation, credit rating — figures with years.
15. economy.externalVulnerability — export/import profile by value and commodity; partner concentration; WHO HOLDS the sovereign debt; IMF program status; sanctions exposure.
16. economy.politicalEconomy — the state–market configuration; who benefits and who loses under the current model; business-elite structure; reforms technically necessary vs politically possible. MUST include at least one source NAMING the load-bearing entities — largest firms / principal producers of the leading sectors, main labour federations; "business-elite structure" with no named entity is an unsupported field.

POLITICAL ORDER (powerStructure → rightsAndChecks → stabilityDrivers → shockAbsorbers → constitutionalSubstrate → stateStructure)
17. political.powerStructure — who holds the executive and how it was won; legislative control stated SEPARATELY from executive control (unified vs divided); where bicameral, each chamber's composition cited to its own official live standings page verified on the run date (a standings source is disqualified if it predates the most recent composition-changing event, regardless of publication date); majority/minority/coalition; opposition strength and legitimacy; where actual power sits outside the formal organ, locate it explicitly. ${powerAnchorText}
18. political.rightsAndChecks — judicial independence and appointment mechanism; media independence and press freedom; civil-liberties and human-rights record. Prefer regional instruments where they exist; court rulings, national human-rights institutions and regional human-rights bodies are primary; Freedom House / Bertelsmann usable with the scorer and its bias named explicitly.
19. political.stabilityDrivers — what legitimises the regime; armed-forces and security-force loyalty AND who controls them; coalition composition; business-elite alignment; elite cohesion (distinct from social cohesion).
20. political.shockAbsorbers — what buffers absorb shocks, and what accelerants could convert a shock into instability.
21. political.constitutionalSubstrate — the deep legal architecture: sovereignty allocation; founding/re-founding instruments; predating, external, or diminished sovereignties held distinct; STABLE or IN MOTION cited to rulings. Sources: founding text, apex-court rulings, statutory codification, treaty text where applicable, official gazette — never news. ${substrateAnchorText}
22. political.stateStructure — unitary or federal; the administrative divisions named using the country's own term; which powers sit at which level; asymmetries between units.

CAPACITY TO DELIVER (inheritedTerrain → steering → approvals → delivery → publicServices → productivity)
23. capacity.inheritedTerrain — anchored synthesis of facts already cited in territory/society/economy (introduces NO new sourced facts — needs no sources of its own).
24. capacity.steering — governance-as-process: announced priorities vs implemented ones, auditor-general and evaluation reports, delivered-vs-declared.
25. capacity.approvals — approval and permitting timelines for major projects; regulatory predictability; the record of projects proposed vs consented vs built. Where no published approvals regime exists, the actual binding constraint.
26. capacity.delivery — the state's realised record executing infrastructure at scale; infrastructure deficit; cost and schedule performance.
27. capacity.publicServices — the state's realised record running continuous public-service systems: health and education (staffing, coverage, access, waiting times, quality of provision), other universal services where relevant.
28. capacity.productivity — productivity level and trend; internal barriers between subnational units — ${productivityTermText}; value-add processing built domestically vs raw exported; innovation and research capacity.

SECURITY & DIPLOMACY (posture composed last; internal → military → transnationalExposure → diplomacy)
29. security.internal — armed groups; organised crime, trafficking, illicit finance; communal violence; terrorism threat level; corruption in security forces; border situation; the state's monopoly on force and territorial control. Military strength belongs to military.
30. security.military — force size and structure; defence spending in money and as a share of the economy; domains (land, sea, air, cyber, space); conscription vs volunteer; foreign bases hosted or held; nuclear status; whether the force can project or only defend. Reference instrument: International Institute for Strategic Studies, Military Balance.
31. security.transnationalExposure — cross-border flows and non-state entanglements: trafficking, illicit finance, cross-border crime, foreign interference and disinformation, migration pressure, shared-resource frictions.
32. security.diplomacy — treaty alliances; multilateral memberships; territorial disputes; regional flashpoints; per-relationship texture for key bilaterals built on hard citable facts (treaty texts, trade volumes by partner, basing agreements and troop presence, United Nations voting alignment, energy dependence). MUST include the sources that NAME the alliance system — the treaty text, the member list, the basing/presence record; a nameless "alliance network" is an unsupported claim.
33. security.posture — anchored synthesis of the other four security fields (introduces no facts of its own — needs no sources of its own).

situation (the event layer) — populated by its own dedicated pass; its sources come from the Pass Zero-B event scan (the Events block above), NOT the institutional source-priority list: a primary or authoritative source for EACH event. actors are ALSO populated by a dedicated pass AFTER the report exists — do not harvest for them separately; they cite the report's own registry.

Aim for 30–45 sources total. Ensure ≥ 70% of sources per section are citationType: Fact (primary authors of the data), not Interpretation. Give every source a volatility rating (High | Med | Low — the expected rate of change of the fact it backs, orthogonal to confidence).
`;

  const passB = `# Pass B Prompt (${code})

Country: ${nameEn} (${nameFr})
Date: ${today}

You are a geopolitical analyst writing a structured country situation report on ${nameEn} for an audience of senior decision-makers and investors. The approved source list from Pass A is provided below.

${calBlockText}

Return ONLY a JSON object that matches the schema below exactly. Include inline [source-id] citations in every narrative field.

Hard rules:
- Cite ONLY source IDs that appear in the approved Pass A sources list PLUS the calibration instrument ids named in the section instructions below (the substrate instruments, calibration-executive-source, permitting-authority) — those are promoted into the registry at apply and are equally citable. No other new sources.
- Every numeric figure must be tied to a specific year or date range (e.g., "GDP grew 1.4% in 2025 [source-id]").
- Omit any claim that cannot be tied to an approved source — do not write it with weaker sourcing or vague attribution.
- EN and FR fields must be synchronized in substance (same facts, same depth). FR may adapt phrasing naturally.
- COMPLETENESS: every one of the 33 narrative fields is REQUIRED and NON-EMPTY, in BOTH languages — the apply gate rejects an empty field outright, and an incomplete JSON is sent back whole. Thin means SHORT (an honest one-line field), never EMPTY. Do not leave a field blank because the figures were not already at hand: Pass A harvested sources for every field family — consult the approved list below and write each field from it. If, after consulting the sources, a field genuinely cannot be supported, still write its honest one-line finding and name the sourcing gap in a note AFTER the JSON (outside it) so Pass A can be extended. KNOW THE LOOP: a field whose one-liner carries NO citation at all will still fail the apply gate's required-citation check — that failure is the designed trigger for a targeted Pass A extension, after which only that field is rewritten citing the new sources. Never fabricate a citation to pass the gate.
- situation, actors.domestic, actors.external, capacity.knownAndUnbuilt (the gap register), the scorecard (values AND anchors), and baseline are the ONLY empty emissions (empty strings / arrays / objects, both languages) — each is populated afterward by its own dedicated pass working from this finished report (situation pass; actors pass; derivatives pass for scorecard + baseline + gap register). Do not fold their content into the peer sections to compensate.
- ANTI-PADDING: no per-section word caps; never pad a thin section to match a rich one. Every sentence after an opener carries a [source-id] or is cut — no restatement, no meta-commentary, no connective throat-clearing. Thinness is a finding: a country with negligible endowment on a dimension gets an honest one-line field, never an empty field, never a padded paragraph.
- NAMED-ACTOR RULE: a claim about a network, sector, or elite NAMES its principal members, cited — alliances have member states, sectors have producers, elites have firms, organised labour has federations. A nameless collective ("a global alliance network", "the business elite") is an under-sourced claim: enter the loop (targeted Pass A top-up, then a single-field rewrite) — never publish the abstraction.
- POINTERS ARE NOT CONTENT: citing a tracker, dataset, or dashboard without reporting a figure from it (with its year) is a gap wearing a citation — "unrest is tracked by X [x]" covers nothing and starves the derivative layers downstream. Report the figure, or enter the loop.
- ANCHORS: capacity.inheritedTerrain and security.posture are ANCHORED SYNTHESES — they introduce no new sourced facts and point at the fields they stand on with [dot.path] markers (e.g. [territory.climate], [security.military]); capacity.steering is Interpretation anchored to the observable record and may combine [source-id] citations with [dot.path] anchors. An anchor must target a NON-EMPTY field composed before it (inheritedTerrain → territory./society./economy. only; posture → the other four security fields only); an anchor to an empty field is rejected at the apply gate, same class as a ghost citation. baseline carries NO anchors.
- Acronyms: the first mention of any acronym or initialism — no exceptions — spells the term in full, followed by the abbreviation in parentheses on that first mention only; all subsequent mentions in the same report may use the short form. This applies to every acronym without carve-outs: universal ones (GDP, UN, EU), sectoral ones (LULUCF, RCP, FPIC), organizational ones (IMF, OECD, NATO, WHO), country-specific ones (RCMP, NRCan, StatCan, PBO), and any others. The report is written for a reader who does not work in the sector, and the extra half-line per acronym on first mention is a discipline, not a compromise. ISO-3166 alpha-3 country codes used as internal identifiers (CAN, USA, DEU) are structural markers, not acronyms in prose, and are exempt when they appear as data-field identifiers; when such a code appears in reader-facing prose, spell it: "Canada," not "CAN."
- Source titles: cite every source exactly as the approved Pass A list titles it — never retitle a source into the reader's language. A source's title is a proper name in its own official language(s) as published; where Pass A supplies an original-language title with a translation in the source's desc, keep the original title and do NOT substitute the translation.
- OPENERS (hard requirement — a field whose opener is missing is REJECTED at the apply gate and sent back for regeneration; the standalone validator flags it too). NINE fields MUST begin with a situator that does three jobs IN ORDER: (1) STATE the country's shape on this dimension in one sentence — orientation, not history; (2) SIGNAL salience AND direction — how central this dimension is to this country and which way it is moving; (3) DECLARE DEPTH — either "detail follows" or an honest one-line close where the country has little here. Job 3 is written ONLY when the answer is "little here": where the dimension carries depth, job 3 is discharged by the body itself — the detail follows, so the opener does not announce that it does, and a literal "detail follows" is meta-commentary and is cut. Job 3 produces visible words only in the thin case, where it is the honest one-line close and the field ends there. Length: one to three sentences. Where the dimension is thin, all three jobs collapse into a single sentence — the normal case for a thin field, not a failure. Where the dimension is central to the country, two or three. Never a paragraph: the opener orients, the body carries the load. Write the situator FIRST; do not lead with detail and append it later. The nine, and what each opener establishes first:
    - territory.geography — the country as a whole (landlocked / coastal / island / archipelago / continent / peninsula; terrain; who the neighbours are); this is the territory peer's opener.
    - territory.climate — the baseline climate type (cold / hot / temperate / tropical / arid; altitude; uniform or regional) BEFORE any warming, exposure, or hazard.
    - society.demographics — the very short historical framing (indigenous-continuous / settler-immigrant-built / mixed from the onset / historically closed).
    - economy.realEconomy — the dominant economic character, named BEFORE the first number (shape of production; what the economy lives on; diversified or concentrated).
    - economy.politicalEconomy — the state–market configuration BEFORE any distributional detail (state-directed / mixed / market-led; Crown corporations / state-owned enterprises / sovereign funds where they exist; where the boundary is contested).
    - political.powerStructure — the regime type and how power is won and held.
    - political.constitutionalSubstrate — the constitutional form: the founding instrument(s) and how sovereignty is allocated (unitary or federal; parliamentary or presidential).
    - capacity.inheritedTerrain — the structural terrain the state works against, BEFORE any performance claim.
    - security.posture — the overall security posture (defensive / expeditionary / neutral / alliance-dependent) and diplomatic orientation (aligned / non-aligned / hedging).
  situation has NO opener (it is a list of events). Treat this as strictly as the acronym rule: no field-by-field exceptions, no burying it mid-paragraph.

Section-by-section instructions:

GENERATION ORDER — there is NO executive snapshot (its former content lives in the section openers). The DERIVATIVE items — the SCORECARD (values + anchors + rationales) and the BASELINE — are NOT composed by this pass: emit them EMPTY (see the empty-emissions block below). They are composed by the dedicated DERIVATIVES pass, which runs after the situation pass has installed and its peer corrections are approved — the last point at which the report's facts can change (amendment 2026-07-19 to the rework's compose-last rule). Within SECURITY, compose posture LAST (it anchors to the other four security fields). The schema is key-addressed and key order carries no meaning.

baseline (en and fr): EMITTED EMPTY ("" in both languages) — composed by the derivatives pass. Do not draft it; the page deliberately renders nothing where the baseline is empty.

political.powerStructure: OPENER (required): the regime type and how power is won and held. Then: who holds the executive and how it was won. State legislative control separately from executive control — in presidential and semi-presidential systems these diverge, and the report must say plainly whether government is unified or divided. Where the legislature is bicameral, give each chamber's composition separately, each cited to that chamber's own official live standings page verified on the run date (a standings source is disqualified if it predates the most recent composition-changing event, regardless of publication date). Use the country's own vocabulary — "governing coalition," "majority," "divided government" — do not force one system's term onto another's structure. Majority/minority/coalition; opposition strength and legitimacy. Where actual power sits outside the formal organ, locate it explicitly. Judicial and media independence belong to rightsAndChecks; who controls the security forces belongs to stabilityDrivers. This is the MOST VOLATILE field in the report — dated to run date. ${powerAnchorText}

political.rightsAndChecks: judicial independence and appointment mechanism; media independence and press freedom; civil-liberties and human-rights record. Sourcing: prefer regional instruments where they exist; court rulings, national human-rights institutions and regional human-rights bodies are primary; Freedom House / Bertelsmann usable with the scorer and its bias named explicitly.

political.stabilityDrivers: What legitimizes the regime; armed-forces and security-force loyalty AND who controls them; coalition composition; business elite alignment; elite cohesion (intra-power-bloc unity — distinct from social cohesion, which belongs in SOCIETY).

political.shockAbsorbers: What cushions shocks vs. what could accelerate instability — both dimensions in a single paragraph.

political.stateStructure: unitary or federal; the administrative divisions named using the country's own term (provinces and territories, Länder, wilayas, oblasts…); which powers sit at which level; asymmetries between units. Placement rule: administrative divisions belong here, never alongside Indigenous or predating sovereignty in constitutionalSubstrate.

political.constitutionalSubstrate: OPENER (required): name the constitutional form — the founding instrument(s) and how sovereignty is allocated (unitary or federal; parliamentary or presidential; one legal tradition or several). Then: the deep legal architecture beneath current politics — the allocation of sovereignty between levels of government; the founding and re-founding instruments that fix that allocation; and the status of any peoples, nations, or territories whose sovereignty predates the central state, sits outside it, or is held in a diminished or non-voting form relative to it. Identify the country's substrate on its own terms. Do not import another country's structure. Where distinct legal substrates coexist, hold them SEPARATELY — do not collapse them or project a single model of consent onto plural governance. State explicitly whether the substrate is STABLE or IN MOTION: where apex-court doctrine is actively reallocating power, that reallocation is present-state fact and belongs in this field, cited to rulings — not deferred to the trajectory layer and not treated as ordinary politics. Sources: the founding text, apex-court rulings, the statutory codification of the sovereignty relationship, treaty text where applicable, official gazette — never news, never advocacy; a legislature's non-partisan research service is admissible as citationType: Interpretation. Instances (examples, not the schema — use the ones the country actually has): settler states with treaty and title lineages, held distinct where historic-treaty/modern-agreement and unceded/title-litigated substrates coexist; federal states, where the vertical allocation and the doctrine currently governing it are the substrate; states with a legal re-founding, where later amendments or instruments reset the original terms; states holding unincorporated, overseas, or non-voting territories, where the legal status of those territories and their populations is substrate. ${substrateAnchorText}

${situationFieldText}

economy.realEconomy: OPENER (required): name the dominant economic character before any numbers — the shape of production (primary / manufacturing / services), what the economy lives on, whether it is diversified or concentrated on a few sectors. Then: sectors and what people do for a living; growth; sector performance — specific figures and years. Technology as a business sector lives here. Fiscal / monetary / debt content belongs to publicFinances, NOT here.

economy.publicFinances: the state's money — budget balance (deficit/surplus, % of GDP), public debt as a share of the economy, central-bank / monetary-policy stance, inflation, credit rating — figures with years. (Debt SIZE here; WHO HOLDS it in externalVulnerability.)

economy.externalVulnerability: Export/import profile by value and commodity; trade partner concentration; sovereign debt holders; IMF program status; sanctions exposure.

economy.politicalEconomy: OPENER (required): the state–market configuration before any distributional detail — state-directed / mixed / market-led; the role of Crown corporations, state-owned enterprises or sovereign funds where they exist; where the boundary is currently contested. Then: who benefits and who loses under the current model; business elite structure — NAMING the load-bearing entities (largest firms, principal producers of the leading sectors, main labour federations), each cited; what reforms are technically necessary vs. politically possible. NAMED-ACTOR RULE applies: a nameless "business elite" or producer-less sector is an under-sourced claim.

TERRITORY — describe the physical body of the country ON ITS OWN TERMS, not merely a risk to assets or an input to trade. Throughout: PAIR every exposure with the capacity to act on it and name the gap; LOCATE effects geographically — who inside the country is exposed or served; BIND every projection to its emissions scenario AND horizon; report DEMONSTRATED over DECLARED. Neither doom-catalogue nor techno-triumph:

OPENER (required): the territory peer opens — at the start of territory.geography — for the country as a whole: landlocked / coastal / island / archipelago / continent / peninsula; mountainous / flat / diversified; geographically isolated or embedded; who the neighbours are.

territory.geography: the physical arrangement the country must overcome to function as one country — land area and internal distances; habitable vs empty land; coastlines and ports; ${geographyPeripheryText}. Internal connectivity (road, rail, grid, broadband) belongs to metabolism, NOT here. For large or fragmented states this is often the central fact, not backdrop. Distinct from the border-security question (SECURITY).

territory.minerals: the critical-mineral and subsurface endowment — what is physically present (reserves and resources, each with year and estimating body named; reserve figures are political — flag disputed or state-controlled counts), including undeveloped and stranded deposits. What the ground HOLDS, distinct from the mining sector's output and exports (ECONOMY).

territory.biosphere: the biological and renewable base — forests, freshwater, arable land, fisheries — as physical stock and its condition/trend (depletion, degradation, resilience), with year and source. Distinct from agricultural/forestry GDP (ECONOMY).

territory.climate: OPENER (required): establish the baseline climate type (cold / hot / temperate / tropical / arid; high altitude; uniform or dramatically regional) before any warming, exposure, or hazard content. Warming is a change; a change needs a baseline. Then: observed and projected physical climate — zones, warming already recorded, and principal hazards (flood, wildfire, drought, heat, sea-level rise, permafrost thaw) LOCATED geographically. Every projection carries its emissions scenario AND horizon. Physical science only. PAIR each exposure with the adaptive capacity to meet it; name who inside the country is exposed vs who can afford the defence.

territory.metabolism: first line signals scope (energy, food, water, movement, information). Then: how the country physically runs and circulates AS A SYSTEM — energy, food and water flows; movement of goods and people within the country; the physical communications backbone; self-sufficiency vs dependence in each, and the networks that carry them (absorbs energy + transport + communications, plus the connectivity networks removed from geography). Boundaries: circulation WITHIN the country, not export logistics (ECONOMY); physical comms infrastructure, not the media ecosystem (SOCIETY); throughput, not balance-sheet.

territory.transition: the country's position in decarbonization — energy mix, emissions profile and TRAJECTORY, pledged targets measured against DELIVERED policy. A target is not an outcome; report the actual path against the pledge and name the gap. Climate Action Tracker as the PRIMARY pledge-vs-policy instrument.

CAPACITY TO DELIVER — whether the state can DO: build, permit, deliver, run — present-state and sourceable. NOT what the country has (ECONOMY) or who benefits (SOCIETY), but whether intent becomes built fact. Where "knowledge isn't the constraint, capacity is" becomes a measured field: ${capacityAnchorText}

capacity.inheritedTerrain: OPENER (required): the structural terrain the state works against, before any performance claim. Then: geographic and demographic scale; resource base; colonial / extractive legacy and terms of trade; conflict history; the inherited education and health base. ANCHORED SYNTHESIS — point at facts already cited in territory.*, society.*, economy.* with [dot.path] anchors; introduce NO new sourced facts. It is the denominator for every performance claim in this section. GUARD (mandatory): capacity is inherited and distributed — by history, colonialism, resource geography, luck — never earned or deserved. A capacity gap is never rendered as a merit gap.

capacity.steering: governance-as-process, distinct from execution — can the government prioritise among competing demands, implement what it announces, build consensus with strategic actors, and learn from policy. citationType: Interpretation, ANCHORED to the observable record (announced priorities vs implemented ones, auditor-general and evaluation reports, delivered-vs-declared). One to two paragraphs. RESPONSE RECORD (added 2026-07-20 — the first USA gap register came back with 12 of 20 items classed never-attempted, a finding about the REPORT, not the country): the announced-versus-implemented record must span the DOMAINS where the report documents shortfalls (delivery, public services, staffing, approvals — never fiscal policy alone). For each such domain, state what response was announced, attempted, or budgeted, cited — or state plainly that the approved sources record none (that absence is itself a finding). The gap register's class assignment reads its attempt record from THIS field.

capacity.approvals: can the state say yes or no to a major project, and how long does that take? Approval and permitting timelines for major projects; regulatory predictability; the record of projects proposed vs consented vs built. Where no published approvals regime exists, name and measure the actual binding constraint instead.

capacity.delivery: the state's realised record of executing INFRASTRUCTURE AT SCALE, distinct from stated intent — infrastructure deficit; cost and schedule performance; the administrative and fiscal ability to execute capital projects.

capacity.publicServices: the state's realised record of running CONTINUOUS public-service systems — health and education systems (staffing, coverage, access, waiting times, quality of provision), and other universal services where relevant. Receives the systems half of society.wellbeing (outcomes stay there).

capacity.productivity: productivity level and trend; internal barriers to the movement of goods, labour and capital between subnational units — ${productivityTermText}; value-add processing built domestically vs raw material exported for others to process; innovation and research capacity.

capacity.knownAndUnbuilt: EMITTED EMPTY ("" both languages) — the GAP REGISTER, composed by the derivatives pass after the situation pass installs (it indexes gaps the finished report asserts; a register composed before the event layer can be falsified by it).

SOCIETY — describe the society ON ITS OWN TERMS, before and independent of any stability implication; a society is a component of the country in itself, not a risk factor:

society.demographics: OPENER (required, kept very short): indigenous-continuous / settler-immigrant-built / mixed from the onset / historically closed. Migration numbers depend on this baseline. Then: total population and age structure (median age, youth-bulge or ageing reality); urban/rural split; internal and cross-border migration patterns; fertility/dependency where relevant. All figures tied to a year.

society.composition: ethnic composition (rounded shares with year and source) and the cleavage geometry across ethnicity, language and religion. State where the principal fault lines run, and EXPLICITLY whether the cleavages are CROSS-CUTTING (membership on one cleavage does not predict membership on another — tends to defuse) or REINFORCING (cleavages stack along the same line — tends to inflame). Name the geometry; do not just list groups. Shares = Fact; geometry judgment = Interpretation. Language content lives in its own field below, NOT here.

society.language: linguistic composition (rounded shares, year, source; flag contested or suppressed counts); the lived texture the census label hides (diglossia, vernacular vs official, lingua franca, language of instruction vs home language); political salience — how far language structures authority, allegiance and access (official-language regime, language law, linguistic nationalism). Name each source and its known bias.

society.religion: (a) composition rounded, and the fault line if there is one; (b) lived/syncretic texture — indigenous, folk, and syncretic practice the official label hides; (c) political salience — how far religion structures authority, allegiance, and daily life (e.g. parallel religious authority such as Sufi brotherhoods; prosperity-gospel political mobilisation; or high adherence with low salience). For every religious-composition figure, NAME the source and its known bias, and flag where the count itself is contested or politically suppressed. Round, do not over-precise.

society.wellbeing: health and educational OUTCOMES as a component of the country in itself — life expectancy, healthy-life expectancy, principal mortality/morbidity drivers, child/maternal mortality where relevant; educational attainment, literacy, skills — each with the access gradient. Outcomes only; the systems that produce them go to capacity.publicServices.

society.cohesion: population-wide social trust (interpersonal AND institutional), social capital, and how the society sees itself, including national identity and self-conception. Use citizen self-report survey data (the region's own barometer / WVS / Pew) as the PRIMARY instrument here — not as a triangulation check. ${cohesionAnchorText}

SECURITY & DIPLOMACY — display order posture → internal → military → transnationalExposure → diplomacy; COMPOSE posture LAST (it is an anchored synthesis of the other four):

security.posture: OPENER (required): the overall security posture (defensive / expeditionary / neutral / alliance-dependent) and diplomatic orientation (aligned / non-aligned / hedging). ANCHORED SYNTHESIS via [dot.path] anchors to security.internal / security.military / security.transnationalExposure / security.diplomacy; introduces no facts of its own.

security.internal: armed groups; organised crime, trafficking, illicit finance; communal violence; terrorism threat level; corruption in security forces; border situation; the state's monopoly on force and territorial control across the whole territory. Military strength belongs to military, NOT here. (May reference the SOCIETY section, but does not replace it.)

security.military: force size and structure; defence spending in money and as a share of the economy; domains — land, sea, air, cyber, space; conscription vs volunteer; foreign bases hosted or held; nuclear status; whether the force can project or only defend. Reference instrument: International Institute for Strategic Studies, Military Balance. Boundary: capability here; loyalty and control remain in political.stabilityDrivers.

security.transnationalExposure: cross-border flows and non-state entanglements — trafficking, illicit finance, cross-border crime, foreign interference and disinformation, migration pressure, shared-resource frictions. Dividing rule: relationships with named states → diplomacy; flows and non-state entanglements → here. Territorial disputes stay in diplomacy.

security.diplomacy: treaty alliances; multilateral memberships; transactional partners; territorial disputes; regional flashpoints; and PER-RELATIONSHIP TEXTURE for key bilateral relationships, built on hard citable facts (treaty texts, trade volumes by partner, basing agreements and troop presence, United Nations voting alignment, energy dependence, state visits). The character of a relationship is Interpretation ANCHORED to those facts. NAMED-ACTOR RULE applies: an alliance system is its members — name the alliances and the key allies, each cited to treaty text or membership record; a nameless "alliance network" is an under-sourced claim.

actors.domestic, actors.external, the gap register capacity.knownAndUnbuilt, the scorecard, scorecardAnchors, and baseline are EMITTED EMPTY — actors are populated afterward by the dedicated two-layer actors pass (implementation spec §8.1); the gap register, scorecard and baseline by the DERIVATIVES pass after the situation pass installs. Emit exactly:
"actors": { "domestic": { "en": [], "fr": [] }, "external": { "en": [], "fr": [] } }
"capacity": { ..., "knownAndUnbuilt": { "en": "", "fr": "" } }
"scorecard": { "eliteCohesion": "", "socialCohesion": "", "securityLoyalty": "", "economicPressure": "", "protestCapacity": "", "institutionalResilience": "" }
"scorecardAnchors": {}
"baseline": { "en": "", "fr": "" }

Approved source IDs from Pass A:
[PASTE THE SOURCE IDs FROM pass-a.sources.json HERE BEFORE SUBMITTING]
`;

  const sourceTemplate = [
    {
      id: 'source-id-example',
      name: 'Full source title',
      nameFr: 'Titre de la source en français',
      url: 'https://example.com/deep-link',
      desc: 'What this source provides for this country.',
      descFr: 'Ce que fournit cette source (en français).',
      publicationDate: '2026-01-01',
      accessDate: '2026-05-05',
      confidence: 'High',
      citationType: 'Fact',
      volatility: 'High',
    },
  ];

  const contentTemplate = {
    // scorecard + scorecardAnchors + baseline are EMITTED EMPTY by Pass B —
    // composed by the derivatives pass after the situation pass installs
    // (amendment 2026-07-19; empty scorecard values are pending, not invalid).
    scorecard: {
      eliteCohesion: '',
      socialCohesion: '',
      securityLoyalty: '',
      economicPressure: '',
      protestCapacity: '',
      institutionalResilience: '',
    },
    scorecardAnchors: {},
    baseline: { en: '', fr: '' },
    territory: {
      geography: { en: '', fr: '' },
      biosphere: { en: '', fr: '' },
      minerals: { en: '', fr: '' },
      climate: { en: '', fr: '' },
      metabolism: { en: '', fr: '' },
      transition: { en: '', fr: '' },
    },
    society: {
      demographics: { en: '', fr: '' },
      composition: { en: '', fr: '' },
      language: { en: '', fr: '' },
      religion: { en: '', fr: '' },
      wellbeing: { en: '', fr: '' },
      cohesion: { en: '', fr: '' },
    },
    economy: {
      realEconomy: { en: '', fr: '' },
      publicFinances: { en: '', fr: '' },
      externalVulnerability: { en: '', fr: '' },
      politicalEconomy: { en: '', fr: '' },
    },
    political: {
      powerStructure: { en: '', fr: '' },
      rightsAndChecks: { en: '', fr: '' },
      stabilityDrivers: { en: '', fr: '' },
      shockAbsorbers: { en: '', fr: '' },
      constitutionalSubstrate: { en: '', fr: '' },
      stateStructure: { en: '', fr: '' },
    },
    capacity: {
      inheritedTerrain: { en: '', fr: '' },
      steering: { en: '', fr: '' },
      approvals: { en: '', fr: '' },
      delivery: { en: '', fr: '' },
      publicServices: { en: '', fr: '' },
      productivity: { en: '', fr: '' },
      // Gap register — EMITTED EMPTY (derivatives pass composes it).
      knownAndUnbuilt: { en: '', fr: '' },
    },
    security: {
      posture: { en: '', fr: '' },
      internal: { en: '', fr: '' },
      military: { en: '', fr: '' },
      transnationalExposure: { en: '', fr: '' },
      diplomacy: { en: '', fr: '' },
    },
    // Emitted EMPTY by Pass B — populated by the dedicated situation/actors/
    // passes (rework §8; situation per template §4d) from the finished report.
    situation: { en: '', fr: '' },
    actors: {
      domestic: { en: [], fr: [] },
      external: { en: [], fr: [] },
    },
  };

  const passZero = `# Pass Zero Prompt (calibration) — ${nameEn}

This is a LOOKUP PASS, NOT AN ANALYSIS PASS. You are not writing a report and not
reasoning about the country. You are identifying which verifiable primary instruments
exist for ${nameEn}, so a later pass can be anchored to them.

Return ONLY the JSON object below. No prose, no commentary, no explanation.

HARD RULES
- Every value must be backed by an artefact that can be opened: a URL to the actual
  page, document, or ruling. Not a description of one. Not a homepage. Not a search
  result. If you cannot supply an openable URL, the value is UNRESOLVED.
- Every URL must be a primary, official source: the institution's own site, the
  court's own publication, the statute's own text. Not an encyclopedia, not a news
  article, not an aggregator, not a think tank. If only a secondary source can be
  found for a value, the value is UNRESOLVED.
- You are PERMITTED AND REQUIRED to answer "UNRESOLVED". If the structure does not
  exist, is contested, or cannot be established from a primary source, return
  "UNRESOLVED" and state why in the note field. An honest gap is a CORRECT output.
  A fabricated clean structure is a FAILURE. Do not force ${nameEn} into a structure
  it does not have.
- Do not translate institution, statute, or ruling names. Capture them as published,
  in the source's own language(s).
- Acronyms: spell in full on first mention, abbreviation in parentheses, short form
  thereafter. No exceptions.
- note fields describe what the instrument IS. They must NEVER contain current figures: no
  seat counts, no party breakdowns, no vacancy counts, no poll percentages, no composition
  data. The live standings URL is read by a later pass on its own run date; do not pre-answer
  it here.
- Court rulings must resolve to the court's own published opinion or the national law
  library's official reports scan. Not an annotated commentary essay, not a commercial
  aggregator.
- powerLocus: if the note says the question is contested or recommends human verification, the
  value is UNRESOLVED, not true. A value and a note that contradict each other is a failure.

SCHEMA
{
  "legislature": {
    "structure": "unicameral | bicameral | none | UNRESOLVED",
    "chambers": [
      { "name": "", "nameFr": "", "seats": 0, "liveStandingsUrl": "",
        "electionCycle": "", "note": "" }
    ],
    "note": ""
  },
  "executive": {
    "type": "parliamentary | presidential | semi-presidential | party-state | monarchy | military | other | UNRESOLVED",
    "drawnFromLegislature": "true | false | UNRESOLVED",
    "unifiedDividedApplies": "true | false | UNRESOLVED",
    "sourceUrl": "", "note": ""
  },
  "powerLocus": {
    "constitutionalOrganIsWherePowerSits": "true | false | UNRESOLVED",
    "actualLocus": "",
    "sourceUrl": "",
    "note": "JUDGMENT FIELD — not a lookup. Flag clearly; the human verifies this one by hand."
  },
  "substrateInstruments": [
    { "id": "short-slug (lowercase-hyphens; Pass B cites the instrument by this id)", "kind": "founding text | apex-court ruling | statutory codification of the sovereignty relationship | treaty | constitutional amendment | legislature's non-partisan research service | official gazette",
      "name": "", "url": "", "note": "" }
  ],
  "legalOrders": {
    "structure": "single statutory | plural | UNRESOLVED",
    "orders": [ { "kind": "statutory | customary | religious | other", "governs": "", "sourceUrl": "" } ],
    "note": ""
  },
  "territorialControl": { "status": "full | contested | UNRESOLVED", "sourceUrl": "", "note": "" },
  "executionRegime": {
    "publishedApprovalsRegimeExists": "true | false | UNRESOLVED",
    "permittingAuthorityUrl": "",
    "note": "If no published approvals regime exists, say so — permitting timelines are then not the instrument."
  },
  "cohesionInstrument": {
    "primaryBarometer": "", "url": "",
    "selfReportReliabilityFlag": "unconstrained | partisan-sorted | constrained | UNRESOLVED",
    "note": "Flag where self-report may measure preference falsification rather than trust. constrained means respondents are not free to answer honestly (repression, preference falsification). partisan-sorted means respondents answer honestly but responses track which party holds power rather than stable underlying trust. Do not use constrained for a free society with high polarisation."
  },
  "periphery": { "value": "", "sourceUrl": "", "note": "" },
  "subnationalTerm": { "en": "", "fr": "", "note": "" },
  "religionCountReliability": { "flag": "", "sourceUrl": "", "note": "" }
}

substrateInstruments — completeness (the STABLE vs IN MOTION finding depends on this list being complete):
- The list must include the rulings that show whether the substrate is STABLE or IN MOTION. Required: every apex-court ruling of the last five years that reallocates power between levels of government, alters the constitutional status of the executive, changes the reach of the country's founding or re-founding instruments, or affects the jurisdiction of any distinct legal order. A list containing only historic foundational rulings is incomplete by construction — it can only produce a finding of "stable."
- Where a country has a legal re-founding (later amendments or instruments that reset the original terms), it is a separate instrument, not folded into the founding text.
- Where a country holds territories under a distinct constitutional regime, that regime's founding rulings are instruments.

legalOrders — classification:
- 'customary' means unwritten traditional law running parallel to statute. Peoples with written constitutions, statutory codes and courts of record are NOT customary — use 'other' and describe the basis of the sovereignty.
- Territories held under a distinct constitutional regime are their own legal order.
`;

  const calibrationTemplate = {
    legislature: {
      structure: '',
      chambers: [
        { name: '', nameFr: '', seats: 0, liveStandingsUrl: '', electionCycle: '', note: '' },
      ],
      note: '',
    },
    executive: {
      type: '',
      drawnFromLegislature: false,
      unifiedDividedApplies: false,
      sourceUrl: '',
      note: '',
    },
    powerLocus: {
      constitutionalOrganIsWherePowerSits: false,
      actualLocus: '',
      sourceUrl: '',
      note: '',
    },
    substrateInstruments: [
      { id: '', kind: '', name: '', url: '', note: '' },
    ],
    legalOrders: {
      structure: '',
      orders: [
        { kind: '', governs: '', sourceUrl: '' },
      ],
      note: '',
    },
    territorialControl: { status: '', sourceUrl: '', note: '' },
    executionRegime: {
      publishedApprovalsRegimeExists: false,
      permittingAuthorityUrl: '',
      note: '',
    },
    cohesionInstrument: {
      primaryBarometer: '',
      url: '',
      selfReportReliabilityFlag: '',
      note: '',
    },
    periphery: { value: '', sourceUrl: '', note: '' },
    subnationalTerm: { en: '', fr: '', note: '' },
    religionCountReliability: { flag: '', sourceUrl: '', note: '' },
  };

  const passZeroB = `# Pass Zero-B Prompt (event scan) — ${nameEn}

This is a LOOKUP PASS, NOT AN ANALYSIS PASS. You are not writing a report and not
reasoning about the country. You are answering one question so a later pass can source
what you find.

ONE QUESTION: what has materially happened in and to ${nameEn} in the last 12 months that a
well-informed reader would consider major? Consider — wars and military operations; coups and
constitutional crises; disasters (natural or industrial); currency or banking crises;
assassinations and leadership deaths; mass mobilisations; major legislation.

Return ONLY a JSON array of events. No prose, no commentary, no explanation.

HARD RULES
- LOOKUP, not analysis. Report what happened; do not interpret, weigh, or forecast.
- Every event needs a DATE and an openable PRIMARY or authoritative source: a government
  statement, the legislature's own research service or parliamentary library, a court ruling,
  or an official gazette. NOT a news aggregator, not a blog, not an encyclopedia.
- You are PERMITTED AND REQUIRED to answer UNRESOLVED. If nothing material happened, return an
  empty array: []. If an event is real but you cannot establish it from a primary source, set
  its status to "UNRESOLVED" and say why in whatHappened. An honest gap is a CORRECT output.
- Do not translate institution, statute, or operation names; capture them as published.
- Acronyms: spell in full on first mention, abbreviation in parentheses, short form thereafter.

SCHEMA (one object per event)
[
  {
    "id": "short-slug (lowercase-hyphens; Pass A harvests its source and Pass B cites it by this id)",
    "date": "YYYY-MM-DD",
    "title": "",
    "whatHappened": "",
    "whatItChanged": "",
    "sourceName": "",
    "sourceUrl": "",
    "status": "ongoing | concluded | UNRESOLVED"
  }
]
`;

  const eventsTemplate = [
    { id: '', date: '', title: '', whatHappened: '', whatItChanged: '', sourceName: '', sourceUrl: '', status: '' },
  ];

  fs.writeFileSync(passZeroPath, passZero, 'utf8');
  fs.writeFileSync(passZeroBPath, passZeroB, 'utf8');
  fs.writeFileSync(eventsTemplatePath, JSON.stringify(eventsTemplate, null, 2), 'utf8');
  fs.writeFileSync(calibrationTemplatePath, JSON.stringify(calibrationTemplate, null, 2), 'utf8');
  fs.writeFileSync(passAPath, passA, 'utf8');
  fs.writeFileSync(passBPath, passB, 'utf8');
  fs.writeFileSync(srcTemplatePath, JSON.stringify(sourceTemplate, null, 2), 'utf8');
  fs.writeFileSync(contentTemplatePath, JSON.stringify(contentTemplate, null, 2), 'utf8');
  fs.writeFileSync(situationPassPath, situationPassText, 'utf8');

  // Derivatives pass (amendment 2026-07-19): scorecard + baseline compose LAST,
  // after the situation pass installs — the prompt is generated here, run then.
  fs.writeFileSync(path.join(jobDir, 'derivatives-pass.prompt.md'), derivativesPassPrompt(code, nameEn, nameFr, today), 'utf8');

  // Actors pass (rework §8.1): actors-pass.prompt.md is generated from the
  // repo's source template — the versioned actors extraction prompt, currently
  // v1.8 (extraction tradecraft must NOT be re-derived from the spec). Until
  // that file is pasted in, init notes the gap instead of generating.
  // Placeholders substituted: {{CODE}}, {{NAME_EN}}, {{NAME_FR}}, {{TODAY}}.
  const actorsTemplatePath = path.join(process.cwd(), 'content', 'docs', 'actors-pass-template.md');
  if (fs.existsSync(actorsTemplatePath)) {
    const actorsPass = fs.readFileSync(actorsTemplatePath, 'utf8')
      .replace(/\{\{CODE\}\}/g, code)
      .replace(/\{\{NAME_EN\}\}/g, nameEn)
      .replace(/\{\{NAME_FR\}\}/g, nameFr)
      .replace(/\{\{TODAY\}\}/g, today);
    fs.writeFileSync(path.join(jobDir, 'actors-pass.prompt.md'), actorsPass, 'utf8');
  } else {
    console.log('NOTE: content/docs/actors-pass-template.md missing — actors-pass.prompt.md NOT generated (restore the versioned actors extraction prompt template and re-run init; rework §8.1).');
  }

  // Risks pass REMOVED 2026-07-20 (workorder-gap-register.md step 4): the gap
  // register (capacity.knownAndUnbuilt) composes inside the derivatives pass.

  console.log(`Created Deepsearch job assets in ${path.relative(process.cwd(), jobDir)}`);
}

function slugifyId(s) {
  return String(s == null ? '' : s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/, '');
}

// Block 2 points Pass B at the calibration's substrateInstruments (and the executive-type
// source) as citation targets. Those live in pass-zero.calibration.json, NOT in the Pass A
// sources file, so without this they fail validateContent as unknown citation IDs and never
// reach analysis.yaml. Promote them to real source objects here — one place, every country,
// no per-country hand-maintenance. Prefer an explicit `id` on the instrument (so Pass B can
// cite it deterministically); fall back to a slug of the name. The caller treats these as
// ACCEPTED citation targets (not required-to-be-cited) and writes only the ones Pass B cited,
// so uncited reference instruments never become orphans.
function calibrationSources(calibration, accessDate) {
  const out = [];
  const add = (id, name, url, desc) => {
    if (!nonEmptyString(id) || !nonEmptyString(name) || !nonEmptyString(url)) return;
    out.push({ id, name, url, desc: nonEmptyString(desc) ? desc : name, accessDate, confidence: 'High', citationType: 'Fact' });
  };
  const instruments = Array.isArray(calibration && calibration.substrateInstruments) ? calibration.substrateInstruments : [];
  for (const inst of instruments) {
    if (!inst) continue;
    add(nonEmptyString(inst.id) ? inst.id : slugifyId(inst.name), inst.name, inst.url, inst.note);
  }
  const exec = (calibration && calibration.executive) || {};
  if (nonEmptyString(exec.sourceUrl)) {
    add('calibration-executive-source', 'Executive-type determination — constitutional/primary source', exec.sourceUrl, exec.note);
  }
  // The approvals regime the prompt tells capacity.approvals to anchor to must
  // itself be citable — promote it under a deterministic id. The regime portal
  // is BY DESIGN a landing page (the instrument is the published regime itself),
  // so it carries landingPage: true; desc is fixed, never the calibration note
  // (notes run long and read as claims).
  const regime = (calibration && calibration.executionRegime) || {};
  if (nonEmptyString(regime.permittingAuthorityUrl)) {
    out.push({
      id: 'permitting-authority',
      name: 'Published approvals/permitting regime — authority named in Pass Zero calibration',
      url: regime.permittingAuthorityUrl,
      desc: 'The published federal approvals/permitting performance regime identified in Pass Zero; the portal capacity.approvals anchors to.',
      accessDate,
      confidence: 'High',
      citationType: 'Fact',
      landingPage: true,
    });
  }
  return out;
}

function requireCalibration(code) {
  const calibrationPath = path.join(process.cwd(), 'content', 'docs', 'deepsearch-jobs', code, 'pass-zero.calibration.json');
  if (!fs.existsSync(calibrationPath)) {
    throw new Error(
      `Pass Zero calibration missing: ${path.relative(process.cwd(), calibrationPath)}. `
      + 'Pass A cannot run without it — run Pass Zero first (pass-zero.prompt.md) and save the result '
      + 'as pass-zero.calibration.json. Calibration is the anchor and must come from a separate pass; '
      + 'it is never inferred or defaulted inside Pass A.'
    );
  }
  return calibrationPath;
}

function applyCommand(iso3, opts) {
  const code = String(iso3).toUpperCase();
  const calibrationPath = requireCalibration(code);
  const sourcesPath = opts.sources;
  const contentPath = opts.content;
  const lastUpdated = opts.date;

  if (!sourcesPath || !contentPath || !lastUpdated) {
    throw new Error('apply requires --sources, --content, and --date');
  }
  if (!isIsoDate(lastUpdated)) {
    throw new Error('--date must be YYYY-MM-DD');
  }

  const analysisPath = path.join(process.cwd(), 'content', 'countries', code, 'analysis.yaml');
  const passASources = parseJsonFile(path.resolve(process.cwd(), sourcesPath));
  const content = parseJsonFile(path.resolve(process.cwd(), contentPath));
  const calRaw = parseJsonFile(calibrationPath);
  const calibration = Array.isArray(calRaw) ? calRaw[0] : calRaw;

  // Auto-promote calibration substrateInstruments + executive source. Accepted as citation
  // targets everywhere; only the ones Pass B actually cited (and not already harvested in
  // Pass A, matched by id or url) are written into the sources block — so uncited reference
  // instruments never orphan, and hand-harvested duplicates are never doubled.
  const promoted = calibrationSources(calibration, lastUpdated);
  const promotedIds = new Set(promoted.map((s) => s.id));
  const usedIds = new Set();
  collectCitationIds(content, usedIds);
  const passAIds = new Set(passASources.map((s) => s && s.id).filter(Boolean));
  const passAUrls = new Set(passASources.map((s) => s && s.url).filter(Boolean));
  const citedPromoted = promoted.filter((s) => usedIds.has(s.id) && !passAIds.has(s.id) && !passAUrls.has(s.url));
  const sources = [...passASources, ...citedPromoted];
  if (citedPromoted.length) {
    console.log(`Promoted ${citedPromoted.length} calibration instrument(s) into sources: ${citedPromoted.map((s) => s.id).join(', ')}`);
  }

  const sourcesCheck = validateSources(sources);
  // Event ids (Pass Zero-B): their sources are accepted-but-not-required (found & considered).
  let eventIds = new Set();
  try {
    const eventsFile = path.join(process.cwd(), 'content', 'docs', 'deepsearch-jobs', code, 'pass-zero-b.events.json');
    if (fs.existsSync(eventsFile)) {
      const rawEv = JSON.parse(fs.readFileSync(eventsFile, 'utf8'));
      const arr = Array.isArray(rawEv) ? rawEv : (rawEv && Array.isArray(rawEv.events) ? rawEv.events : []);
      eventIds = new Set(arr.map((e) => e && e.id).filter(Boolean));
    }
  } catch (err) { /* no events file → all sources required */ }

  // passNotes: the situation pass's per-event verdict record (kept/folded/dropped),
  // committed as situation-pass.output.json. When present it is the engagement
  // record for the event scan; the citation heuristic in validateContent is the
  // legacy fallback.
  let passNotesEventIds = null;
  try {
    const outFile = path.join(process.cwd(), 'content', 'docs', 'deepsearch-jobs', code, 'situation-pass.output.json');
    if (fs.existsSync(outFile)) {
      const pn = JSON.parse(fs.readFileSync(outFile, 'utf8')).passNotes;
      if (pn && Array.isArray(pn.events)) {
        passNotesEventIds = new Set(pn.events.map((e) => e && e.id).filter(Boolean));
      }
    }
  } catch (err) { /* unreadable output file → citation heuristic applies */ }

  const contentCheck = validateContent(content, sourcesCheck.ids, promotedIds, eventIds, code === 'USA', passNotesEventIds);
  if (passNotesEventIds && eventIds.size > 0) {
    const missing = [...eventIds].filter((id) => !passNotesEventIds.has(id));
    if (missing.length) {
      contentCheck.warnings.push(`situation passNotes: no verdict for scanned event(s) ${missing.join(', ')} — every Pass Zero-B event gets kept/folded/dropped`);
    }
  }
  const errors = [...sourcesCheck.errors, ...contentCheck.errors];
  const warnings = [...(sourcesCheck.warnings || []), ...(contentCheck.warnings || [])];
  if (warnings.length) {
    console.warn('Validation warnings (non-blocking):');
    warnings.forEach((w) => console.warn(`- ${w}`));
  }
  if (errors.length) {
    console.error('Validation failed:');
    errors.forEach((e) => console.error(`- ${e}`));
    process.exit(2);
  }

  const payload = {
    code,
    nameEn: opts.nameEn || code,
    nameFr: opts.nameFr || code,
    lastUpdated,
    sources,
    content,
  };

  ensureDir(path.dirname(analysisPath));
  fs.writeFileSync(analysisPath, buildYaml(payload), 'utf8');
  console.log(`Wrote ${path.relative(process.cwd(), analysisPath)}`);

  const repair = spawnSync('node', ['scripts/repair-country-yaml.cjs', '--write', analysisPath], {
    cwd: process.cwd(),
    stdio: 'inherit',
  });
  if (repair.status !== 0) process.exit(repair.status || 1);

  const validate = spawnSync('node', ['scripts/validate-country-citations.cjs', analysisPath], {
    cwd: process.cwd(),
    stdio: 'inherit',
  });
  if (validate.status !== 0) process.exit(validate.status || 1);
}

function checkCommand(iso3) {
  const code = String(iso3).toUpperCase();
  const analysisPath = path.join(process.cwd(), 'content', 'countries', code, 'analysis.yaml');
  if (!fs.existsSync(analysisPath)) {
    throw new Error(`File not found: ${analysisPath}`);
  }

  const dry = spawnSync('node', ['scripts/repair-country-yaml.cjs', analysisPath], {
    cwd: process.cwd(),
    stdio: 'inherit',
  });
  if (dry.status !== 0) process.exit(dry.status || 1);

  const validate = spawnSync('node', ['scripts/validate-country-citations.cjs', analysisPath], {
    cwd: process.cwd(),
    stdio: 'inherit',
  });
  if (validate.status !== 0) process.exit(validate.status || 1);
}

function main() {
  const [, , cmd, ...rest] = process.argv;
  if (!cmd || ['-h', '--help', 'help'].includes(cmd)) {
    usage();
    return;
  }

  if (cmd === 'init') {
    const [iso3, nameEn, nameFr] = rest;
    if (!iso3 || !nameEn || !nameFr) {
      throw new Error('init requires: <ISO3> <NameEN> <NameFR>');
    }
    initCommand(iso3, nameEn, nameFr);
    return;
  }

  if (cmd === 'apply') {
    const [iso3, ...tail] = rest;
    if (!iso3) throw new Error('apply requires <ISO3>');
    const opts = parseOptions(tail);
    applyCommand(iso3, opts);
    return;
  }

  if (cmd === 'check') {
    const [iso3] = rest;
    if (!iso3) throw new Error('check requires <ISO3>');
    checkCommand(iso3);
    return;
  }

  throw new Error(`Unknown command: ${cmd}`);
}

try {
  main();
} catch (err) {
  console.error(err.message || err);
  process.exit(1);
}
