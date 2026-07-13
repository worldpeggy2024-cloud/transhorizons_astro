const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

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
      "executiveSnapshot": { "en": ["... [id]"], "fr": ["... [id]"] },
      "political": {
        "powerStructure": { "en": "... [id]", "fr": "... [id]" },
        "stabilityDrivers": { "en": "... [id]", "fr": "... [id]" },
        "shockAbsorbers": { "en": "... [id]", "fr": "... [id]" }
      },
      "economy": {
        "macroReality": { "en": "... [id]", "fr": "... [id]" },
        "externalVulnerability": { "en": "... [id]", "fr": "... [id]" },
        "politicalEconomy": { "en": "... [id]", "fr": "... [id]" }
      },
      "security": {
        "internal": { "en": "... [id]", "fr": "... [id]" },
        "diplomacy": { "en": "... [id]", "fr": "... [id]" }
      },
      "actors": {
        "domestic": { "en": [{...}], "fr": [{...}] },
        "external": { "en": [{...}], "fr": [{...}] }
      },
      "risks": { "en": [{...}], "fr": [{...}] }
    }
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

    if (nonEmptyString(s?.id) && !/^[a-z0-9-]+$/.test(s.id)) {
      errors.push(`${key}.id must be lowercase slug (a-z0-9-)`);
    }

    if (nonEmptyString(s?.id)) {
      if (ids.has(s.id)) errors.push(`${key}.id '${s.id}' is duplicated`);
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
// The "OPENER (required)" disciplines are prompt-only and silently erode: Pass B
// skipped every opener on the USA run because nothing validated them. Each check
// looks for the discipline's signature vocabulary at the START of the field (for
// macroReality: BEFORE the first digit — the character must be named before any
// number). Heuristics, not semantics — tuned to catch a skipped opener, not to
// grade a written one. The FIVE openers per Peggy's ruling: substrate, macro,
// geography (territory-peer), climate, demographics — situation has NO opener
// (it is a list of events). KEEP IN SYNC with validate-country-citations.cjs.
const OPENER_RULES = {
  substrate: {
    re: /constitution|founding|sovereign|federal|unitary|parliamentar|president|confederat|basic law|fundamental law|charter|souverain|fédéra|unitaire|parlementa|présidentiel|charte/i,
    window: 300,
    hint: 'must open by naming the constitutional form (founding instrument(s); how sovereignty is allocated)',
  },
  macro: {
    beforeFirstDigit: true,
    re: /service|manufactur|industri|agricult|agrari|commodit|resourc|extractiv|hydrocarbon|\boil\b|\bgas\b|mining|export-led|diversified|concentrated|post-industrial|knowledge|mixed econom|advanced econom|emerging|tertiar|primaire|secondaire|tertiaire|industriel|agricole|matières premières|ressourc|pétrol|gazier|minier|diversifié|concentré|avancée|émergent|mixte/i,
    window: 300,
    hint: 'must name the dominant economic character BEFORE any numbers (shape of production; what the economy lives on; diversified or concentrated)',
  },
  geography: {
    re: /landlocked|coastal|island|archipelag|continent|peninsul|mountain|\bflat\b|plain|lowland|highland|isolated|embedded|neighbou?r|borders|enclavé|côtier|insulaire|archipel|péninsul|montagn|\bplat\b|plaine|isolé|voisin|frontali/i,
    window: 300,
    hint: 'the territory peer must open (first sentence of territory.geography) with the country-as-a-whole situator (landlocked/coastal/island/…; terrain; neighbours)',
  },
  climate: {
    re: /\bcold\b|\bhot\b|temperate|tropical|arid|continental|maritime|mediterranean|polar|subarctic|boreal|equatorial|monsoon|desert|humid|altitude|uniform|dramatically regional|froid|chaud|tempéré|aride|méditerranéen|polaire|subarctique|boréal|équatorial|mousson|désert|humide/i,
    window: 300,
    hint: 'must open by establishing the baseline climate type before any warming/exposure/hazard content (warming is a change; a change needs a baseline)',
  },
  demographics: {
    re: /indigenous|settler|immigrant|immigration|colonial|coloni[sz]|\bmixed\b|\bclosed\b|founded|peopled|autochtone|\bcolon|immigr|fermé|métiss|peuplé|fondé/i,
    window: 250,
    hint: 'must open with the one-line historical framing (indigenous-continuous / settler-immigrant-built / mixed from the onset / historically closed)',
  },
};

function openerProblem(kind, text) {
  const rule = OPENER_RULES[kind];
  const t = String(text ?? '').trim();
  if (!t) return null; // emptiness is reported by the citation check, not here
  let head;
  if (rule.beforeFirstDigit) {
    const i = t.search(/\d/);
    head = i === -1 ? t.slice(0, rule.window) : t.slice(0, i);
  } else {
    head = t.slice(0, rule.window);
  }
  return rule.re.test(head) ? null : rule.hint;
}

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

function validateContent(content, sourceIds, acceptedExtraIds, eventIds, isUSA) {
  const errors = [];
  const warnings = [];

  const score = content?.scorecard ?? {};
  const scoreKeys = ['eliteCohesion', 'socialCohesion', 'securityLoyalty', 'economicPressure', 'protestCapacity', 'institutionalResilience'];
  for (const k of scoreKeys) {
    if (!['High', 'Med', 'Low'].includes(score[k])) {
      errors.push(`scorecard.${k} must be High|Med|Low`);
    }
  }

  const execEn = content?.executiveSnapshot?.en;
  const execFr = content?.executiveSnapshot?.fr;
  if (!Array.isArray(execEn) || execEn.length < 6) errors.push('executiveSnapshot.en must be an array with >= 6 bullets');
  if (!Array.isArray(execFr) || execFr.length < 6) errors.push('executiveSnapshot.fr must be an array with >= 6 bullets');

  const textFields = [
    ['political.powerStructure.en', content?.political?.powerStructure?.en],
    ['political.powerStructure.fr', content?.political?.powerStructure?.fr],
    ['political.stabilityDrivers.en', content?.political?.stabilityDrivers?.en],
    ['political.stabilityDrivers.fr', content?.political?.stabilityDrivers?.fr],
    ['political.shockAbsorbers.en', content?.political?.shockAbsorbers?.en],
    ['political.shockAbsorbers.fr', content?.political?.shockAbsorbers?.fr],
    ['political.constitutionalSubstrate.en', content?.political?.constitutionalSubstrate?.en],
    ['political.constitutionalSubstrate.fr', content?.political?.constitutionalSubstrate?.fr],
    ['economy.macroReality.en', content?.economy?.macroReality?.en],
    ['economy.macroReality.fr', content?.economy?.macroReality?.fr],
    ['economy.externalVulnerability.en', content?.economy?.externalVulnerability?.en],
    ['economy.externalVulnerability.fr', content?.economy?.externalVulnerability?.fr],
    ['economy.politicalEconomy.en', content?.economy?.politicalEconomy?.en],
    ['economy.politicalEconomy.fr', content?.economy?.politicalEconomy?.fr],
    ['territory.geography.en', content?.territory?.geography?.en],
    ['territory.geography.fr', content?.territory?.geography?.fr],
    ['territory.minerals.en', content?.territory?.minerals?.en],
    ['territory.minerals.fr', content?.territory?.minerals?.fr],
    ['territory.biosphere.en', content?.territory?.biosphere?.en],
    ['territory.biosphere.fr', content?.territory?.biosphere?.fr],
    ['territory.climate.en', content?.territory?.climate?.en],
    ['territory.climate.fr', content?.territory?.climate?.fr],
    ['territory.metabolism.en', content?.territory?.metabolism?.en],
    ['territory.metabolism.fr', content?.territory?.metabolism?.fr],
    ['territory.transition.en', content?.territory?.transition?.en],
    ['territory.transition.fr', content?.territory?.transition?.fr],
    ['capacity.permitting.en', content?.capacity?.permitting?.en],
    ['capacity.permitting.fr', content?.capacity?.permitting?.fr],
    ['capacity.delivery.en', content?.capacity?.delivery?.en],
    ['capacity.delivery.fr', content?.capacity?.delivery?.fr],
    ['capacity.productivity.en', content?.capacity?.productivity?.en],
    ['capacity.productivity.fr', content?.capacity?.productivity?.fr],
    ['society.demographics.en', content?.society?.demographics?.en],
    ['society.demographics.fr', content?.society?.demographics?.fr],
    ['society.composition.en', content?.society?.composition?.en],
    ['society.composition.fr', content?.society?.composition?.fr],
    ['society.religion.en', content?.society?.religion?.en],
    ['society.religion.fr', content?.society?.religion?.fr],
    ['society.cohesion.en', content?.society?.cohesion?.en],
    ['society.cohesion.fr', content?.society?.cohesion?.fr],
    ['security.internal.en', content?.security?.internal?.en],
    ['security.internal.fr', content?.security?.internal?.fr],
    ['security.diplomacy.en', content?.security?.diplomacy?.en],
    ['security.diplomacy.fr', content?.security?.diplomacy?.fr],
  ];
  textFields.forEach(([field, val]) => mustHaveCitation(val, field, errors));

  // Situator openers — HARD ERRORS at the apply gate (regeneration is cheap here;
  // a missed opener that reaches the YAML costs a manual retrofit instead).
  const openerFields = [
    ['political.constitutionalSubstrate', 'substrate', content?.political?.constitutionalSubstrate],
    ['economy.macroReality', 'macro', content?.economy?.macroReality],
    ['territory.geography', 'geography', content?.territory?.geography],
    ['territory.climate', 'climate', content?.territory?.climate],
    ['society.demographics', 'demographics', content?.society?.demographics],
  ];
  for (const [field, kind, node] of openerFields) {
    for (const lang of ['en', 'fr']) {
      const problem = openerProblem(kind, node?.[lang]);
      if (problem) {
        errors.push(`${field}.${lang}: missing OPENER (required) — ${problem}`);
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
    // Populated threads should engage the event scan.
    if (eventIds && eventIds.size > 0) {
      const cited = new Set();
      const citeRe = /\[([a-z0-9-]+)\]/g;
      let cm;
      while ((cm = citeRe.exec(t)) !== null) cited.add(cm[1]);
      if (![...cited].some((id) => eventIds.has(id))) {
        warnings.push(`situation.${lang}: cites none of the ${eventIds.size} scanned event source(s) — verify every Pass Zero-B event is accounted for or explicitly stated as not material`);
      }
    }
  }

  const actorReq = ['name', 'interests', 'resources', 'constraints', 'likelyMoves', 'dealability'];
  const actorPaths = [
    ['actors.domestic.en', content?.actors?.domestic?.en],
    ['actors.domestic.fr', content?.actors?.domestic?.fr],
    ['actors.external.en', content?.actors?.external?.en],
    ['actors.external.fr', content?.actors?.external?.fr],
  ];
  for (const [label, arr] of actorPaths) {
    if (!Array.isArray(arr) || arr.length === 0) {
      errors.push(`${label} must be a non-empty array`);
      continue;
    }
    arr.forEach((a, i) => {
      actorReq.forEach((k) => {
        if (!nonEmptyString(a?.[k])) errors.push(`${label}[${i}].${k} is required`);
      });
    });
  }

  const riskReq = ['title', 'trigger', 'probability', 'impact', 'timeHorizon', 'leadingIndicators', 'mitigants'];
  const riskPaths = [
    ['risks.en', content?.risks?.en],
    ['risks.fr', content?.risks?.fr],
  ];
  for (const [label, arr] of riskPaths) {
    if (!Array.isArray(arr) || arr.length < 5) {
      errors.push(`${label} must be an array with >= 5 risks`);
      continue;
    }
    arr.forEach((r, i) => {
      riskReq.forEach((k) => {
        if (!nonEmptyString(r?.[k])) errors.push(`${label}[${i}].${k} is required`);
      });
      if (r && !['High', 'Med', 'Low'].includes(r.probability)) {
        errors.push(`${label}[${i}].probability must be High|Med|Low`);
      }
      if (r && !['High', 'Med', 'Low'].includes(r.impact)) {
        errors.push(`${label}[${i}].impact must be High|Med|Low`);
      }
    });
  }

  const usedIds = new Set();
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
    `scorecard_eliteCohesion: ${c.scorecard.eliteCohesion}`,
    `scorecard_socialCohesion: ${c.scorecard.socialCohesion}`,
    `scorecard_securityLoyalty: ${c.scorecard.securityLoyalty}`,
    `scorecard_economicPressure: ${c.scorecard.economicPressure}`,
    `scorecard_protestCapacity: ${c.scorecard.protestCapacity}`,
    `scorecard_institutionalResilience: ${c.scorecard.institutionalResilience}`,
    yamlBlock('executiveSnapshot_en', c.executiveSnapshot.en.join('\n')),
    yamlBlock('executiveSnapshot_fr', c.executiveSnapshot.fr.join('\n')),
    yamlText('political_powerStructure_en', c.political.powerStructure.en),
    yamlText('political_powerStructure_fr', c.political.powerStructure.fr),
    yamlText('political_stabilityDrivers_en', c.political.stabilityDrivers.en),
    yamlText('political_stabilityDrivers_fr', c.political.stabilityDrivers.fr),
    yamlText('political_shockAbsorbers_en', c.political.shockAbsorbers.en),
    yamlText('political_shockAbsorbers_fr', c.political.shockAbsorbers.fr),
    yamlText('political_constitutionalSubstrate_en', c.political?.constitutionalSubstrate?.en),
    yamlText('political_constitutionalSubstrate_fr', c.political?.constitutionalSubstrate?.fr),
    yamlText('situation_en', c.situation?.en),
    yamlText('situation_fr', c.situation?.fr),
    yamlText('economy_macroReality_en', c.economy.macroReality.en),
    yamlText('economy_macroReality_fr', c.economy.macroReality.fr),
    yamlText('economy_externalVulnerability_en', c.economy.externalVulnerability.en),
    yamlText('economy_externalVulnerability_fr', c.economy.externalVulnerability.fr),
    yamlText('economy_politicalEconomy_en', c.economy.politicalEconomy.en),
    yamlText('economy_politicalEconomy_fr', c.economy.politicalEconomy.fr),
    yamlText('territory_geography_en', c.territory?.geography?.en),
    yamlText('territory_geography_fr', c.territory?.geography?.fr),
    yamlText('territory_minerals_en', c.territory?.minerals?.en),
    yamlText('territory_minerals_fr', c.territory?.minerals?.fr),
    yamlText('territory_biosphere_en', c.territory?.biosphere?.en),
    yamlText('territory_biosphere_fr', c.territory?.biosphere?.fr),
    yamlText('territory_climate_en', c.territory?.climate?.en),
    yamlText('territory_climate_fr', c.territory?.climate?.fr),
    yamlText('territory_metabolism_en', c.territory?.metabolism?.en),
    yamlText('territory_metabolism_fr', c.territory?.metabolism?.fr),
    yamlText('territory_transition_en', c.territory?.transition?.en),
    yamlText('territory_transition_fr', c.territory?.transition?.fr),
    yamlText('capacity_permitting_en', c.capacity?.permitting?.en),
    yamlText('capacity_permitting_fr', c.capacity?.permitting?.fr),
    yamlText('capacity_delivery_en', c.capacity?.delivery?.en),
    yamlText('capacity_delivery_fr', c.capacity?.delivery?.fr),
    yamlText('capacity_productivity_en', c.capacity?.productivity?.en),
    yamlText('capacity_productivity_fr', c.capacity?.productivity?.fr),
    yamlText('society_demographics_en', c.society?.demographics?.en),
    yamlText('society_demographics_fr', c.society?.demographics?.fr),
    yamlText('society_composition_en', c.society?.composition?.en),
    yamlText('society_composition_fr', c.society?.composition?.fr),
    yamlText('society_religion_en', c.society?.religion?.en),
    yamlText('society_religion_fr', c.society?.religion?.fr),
    yamlText('society_cohesion_en', c.society?.cohesion?.en),
    yamlText('society_cohesion_fr', c.society?.cohesion?.fr),
    yamlText('security_internal_en', c.security.internal.en),
    yamlText('security_internal_fr', c.security.internal.fr),
    yamlText('security_diplomacy_en', c.security.diplomacy.en),
    yamlText('security_diplomacy_fr', c.security.diplomacy.fr),
    yamlBlock('actors_domestic_en', toJsonBlock(c.actors.domestic.en)),
    yamlBlock('actors_domestic_fr', toJsonBlock(c.actors.domestic.fr)),
    yamlBlock('actors_external_en', toJsonBlock(c.actors.external.en)),
    yamlBlock('actors_external_fr', toJsonBlock(c.actors.external.fr)),
    yamlBlock('risks_en', toJsonBlock(c.risks.en)),
    yamlBlock('risks_fr', toJsonBlock(c.risks.fr)),
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
    return 'Anchor to calibration. For each chamber in legislature.chambers, give that chamber\'s composition cited to its own liveStandingsUrl, verified on the run date; a standings source is disqualified if it predates the most recent composition-changing event, regardless of publication date. Where executive.unifiedDividedApplies is true, state plainly whether government is unified or divided. On powerLocus: where constitutionalOrganIsWherePowerSits is true, the constitutional allocation is the operative allocation and the field proceeds normally. Where it is false, the standings discipline still applies to the formal organ, but the field must locate actual power in powerLocus.actualLocus and say so explicitly — the formal organ is then described as formal, not operative. Where it is UNRESOLVED, state the constitutional allocation and also state plainly that whether operative power tracks it is contested; present the contest, do not resolve it.';
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
  return `Anchor to calibration. ${chamberText}${udText}${plText}${execCite}`;
}

function substrateAnchor(cal) {
  if (!cal) {
    return 'Anchor to calibration. Cite ONLY the instruments listed in substrateInstruments, each by its id. Where legalOrders.structure is plural, hold each order SEPARATELY and name what each governs; do not treat the statutory order as the real one. Where it is UNRESOLVED, present the competing characterisations as contested.';
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
  return `Anchor to calibration. ${instrText}${ordersText}`;
}

function capacityAnchor(cal) {
  if (!cal) {
    return 'Anchor to calibration. Where executionRegime.publishedApprovalsRegimeExists is true, capacity.permitting anchors to executionRegime.permittingAuthorityUrl. Where it is false, permitting timelines are NOT the instrument — name the actual binding constraint on execution and measure that instead. Where territorialControl.status is contested, state which territory the capacity measurement covers.';
  }
  const e = calFlag(cal.executionRegime && cal.executionRegime.publishedApprovalsRegimeExists);
  const eText = e === 'true'
    ? ` A published approvals regime exists: capacity.permitting anchors to ${(cal.executionRegime && cal.executionRegime.permittingAuthorityUrl) || 'the permitting authority named in Pass Zero'}.`
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
    return 'Anchor to calibration. The primary instrument is cohesionInstrument.primaryBarometer. Then, on selfReportReliabilityFlag:\n- unconstrained: report the figures directly.\n- partisan-sorted: respondents answer honestly, but responses track which party holds power rather than stable underlying trust. State this plainly, and report cohort or partisan breakdowns rather than the headline aggregate, which is a systematically distorted artefact.\n- constrained: respondents are not free to answer honestly (repression, preference falsification). Reported institutional trust does not measure trust. State this plainly and do not report the figure at face value.\n- UNRESOLVED: present the reliability question as contested and report the figures with that caveat attached.';
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
  return `Anchor to calibration. The primary instrument is ${barometer}. selfReportReliabilityFlag is ${flagLabel}: ${branch}`;
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
  return `## Events (from Pass Zero-B)\n\nIn ADDITION to the institutional source-priority list above, harvest a primary or authoritative source for EACH of these events (its own source below, or a better primary source — government statement, court ruling, official gazette; never a news aggregator):\n${list}`;
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

DISCIPLINES (same as the main passes): acronyms spelled out at first mention, no exceptions; source titles in the source's own language(s), never translated; source desc states what the source IS (roughly 20-30 words), never the specific numbers or claims; EN and FR carry the same facts and cite the same IDs.

${eventsBlock}

Return ONLY a JSON object:
{
  "situation": {
    "en": [ { "thread": "…", "events": [ { "date": "…", "what": "… [source-id]", "changed": "… [source-id]" } ], "currentState": "… [source-id] (optional)" } ],
    "fr": [ the same threads, in French ]
  },
  "newSources": [ any sources cited above that are not already in the report's registry — all fields: id, name, nameFr, url, desc, descFr, publicationDate (omit if undated), accessDate, confidence, citationType ],
  "peerCorrections": [ { "field": "e.g. economy.externalVulnerability", "correction": "what the peer section must now say and why" } ]
}
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
- Trade: WTO, UN Comtrade
- Society / demography: UN DESA World Population Prospects, national census, national statistics office
- Society / composition (ethnic·linguistic·religious): national census, Pew–Templeton Global Religious Futures, ARDA (Association of Religion Data Archives)
- Society / cohesion & social capital: the region's own citizen self-report barometer as the PRIMARY instrument — Afrobarometer, Arab Barometer, Latinobarómetro, Asian Barometer, Eurobarometer, World Values Survey, or Pew (PRIMARY here, not triangulation)
- Territory / climate (physical): Intergovernmental Panel on Climate Change, national climate assessment, World Bank Climate Change Knowledge Portal, national meteorological service, Copernicus
- Territory / minerals (subsurface endowment): United States Geological Survey mineral commodity summaries, national geological survey, International Energy Agency (critical minerals)
- Territory / biosphere (forests·water·land·fisheries): Food and Agriculture Organization, national resource agencies
- Territory / metabolism & transition: International Energy Agency, Energy Institute statistical review, Ember (electricity), national inventories (UN climate convention), Global Carbon Project, Climate Action Tracker — PRIMARY for pledge-vs-policy
- Territory / adaptive capacity: Notre Dame Global Adaptation Initiative index, World Bank, national adaptation plans
- Capacity to execute (permitting·delivery·productivity): national statistics office, OECD, national infrastructure & regulatory bodies, sector permitting authorities
- Constitutional substrate (deep-time legal): founding constitutional text; apex-court rulings (constitutional and title); the statutory codification of the sovereignty relationship; the legislature's own non-partisan research service; treaty text where applicable; official gazette — never news
- Recent events of fact: national news outlets ONLY for events verified as fact in the last 90 days
- Do NOT cite Wikipedia, homepages, aggregators, or blogs
- Deep links only — the specific document or data page, not a site homepage

The sources you collect must be sufficient to support ALL of the following content sections in Pass B:

1. executiveSnapshot — 13 bullet points covering: regime type, political equilibrium, economic model, physical base, execution capacity, social structure, top risks, top watch items, external dependencies, security posture, diplomatic orientation, data confidence, baseline present-state characterisation
2. political.powerStructure — who holds the executive and how it was won; legislative control stated SEPARATELY from executive control (in presidential and semi-presidential systems these diverge — say plainly whether government is unified or divided); where the legislature is bicameral, each chamber's composition separately, each cited to that chamber's own official live standings page verified on the run date (a standings source is disqualified if it predates the most recent composition-changing event, regardless of publication date); use the country's own vocabulary ("governing coalition," "majority," "divided government"), not one system's term forced onto another's structure; who controls security forces; judicial independence and appointment mechanism; media independence. ${powerAnchorText}
3. political.stabilityDrivers — legitimacy sources, armed forces loyalty, coalition, business elite alignment
4. political.shockAbsorbers — what cushions shocks vs. what accelerates instability
5. political.constitutionalSubstrate — OPENER (required, one sentence): name the constitutional form — the founding instrument(s) and how sovereignty is allocated (unitary or federal; parliamentary or presidential; one legal tradition or several). Then: the deep legal architecture beneath current politics — the allocation of sovereignty between levels of government; the founding and re-founding instruments that fix that allocation; and the status of any peoples, nations, or territories whose sovereignty predates the central state, sits outside it, or is held in a diminished or non-voting form relative to it. Identify the country's substrate on its own terms. Do not import another country's structure. Where distinct legal substrates coexist, hold them SEPARATELY — do not collapse them or project a single model of consent onto plural governance. State explicitly whether the substrate is STABLE or IN MOTION: where apex-court doctrine is actively reallocating power, that reallocation is present-state fact and belongs in this field, cited to rulings — not deferred to the trajectory layer and not treated as ordinary politics. Sources: the founding text, apex-court rulings, the statutory codification of the sovereignty relationship, treaty text where applicable, official gazette — never news, never advocacy; a legislature's non-partisan research service is admissible as citationType: Interpretation. Instances (examples, not the schema — use the ones the country actually has): settler states with treaty and title lineages, held distinct where historic-treaty/modern-agreement and unceded/title-litigated substrates coexist; federal states, where the vertical allocation and the doctrine currently governing it are the substrate; states with a legal re-founding, where later amendments or instruments reset the original terms; states holding unincorporated, overseas, or non-voting territories, where the legal status of those territories and their populations is substrate. ${substrateAnchorText}
5b. situation (the event layer, placed after political, before economy) — what has materially happened in and to the country in the last 12 months and what it changed. Its sources come from the Pass Zero-B event scan (the Events block above), NOT the institutional source-priority list: a primary or authoritative source for EACH event. A war, coup, disaster, or crisis is not published as a periodic dataset.
6. economy.macroReality — GDP growth, sector performance, fiscal position (deficit %, debt/GDP), monetary policy, inflation, credit rating — all with specific figures and years
7. economy.externalVulnerability — export/import profile; trade partner concentration; sovereign debt holders; IMF program status; sanctions exposure
8. economy.politicalEconomy — who benefits from current model; business elite structure; technically necessary vs. politically possible reforms
9. territory.geography — the physical arrangement the country must overcome to function as one country — land area and internal distances; habitable vs empty land; coastlines and ports; internal connectivity (road, rail, grid, broadband); ${geographyPeripheryText}. For large or fragmented states this is often the central fact, not backdrop. Distinct from the border-security question (SECURITY).
10. territory.minerals — the critical-mineral and subsurface endowment — what is physically present (reserves and resources, each with year and estimating body named; reserve figures are political — flag disputed or state-controlled counts), including undeveloped and stranded deposits. What the ground HOLDS, distinct from the mining sector's output and exports (ECONOMY).
11. territory.biosphere — the biological and renewable base — forests, freshwater, arable land, fisheries — as physical stock and its condition/trend (depletion, degradation, resilience), with year and source. Distinct from agricultural/forestry GDP (ECONOMY).
12. territory.climate — observed and projected physical climate — zones, warming already recorded, and principal hazards (flood, wildfire, drought, heat, sea-level rise, permafrost thaw) LOCATED geographically. Every projection carries its emissions scenario AND horizon. Physical science only. PAIR each exposure with the adaptive capacity to meet it; name who inside the country is exposed vs who can afford the defence.
13. territory.metabolism — how the country physically powers, feeds, and waters itself AS A SYSTEM — energy, food, and water flows; self-sufficiency vs dependence in each; the internal networks that distribute them. The country's own throughput, NOT energy-as-export-vulnerability (ECONOMY).
14. territory.transition — the country's position in decarbonization — energy mix, emissions profile and TRAJECTORY, pledged targets measured against DELIVERED policy. A target is not an outcome; report the actual path against the pledge and name the gap. Climate Action Tracker as the PRIMARY pledge-vs-policy instrument.
15. capacity.permitting — approval and permitting timelines for major projects; regulatory predictability; the record of projects proposed vs consented vs built.
16. capacity.delivery — infrastructure delivery record and deficit; cost and schedule performance; the state's administrative and fiscal ability to execute at scale.
17. capacity.productivity — productivity level and trend; internal barriers to the movement of goods, labour and capital between subnational units — ${productivityTermText}; value-add processing built domestically vs raw material exported for others to process.
18. society.demographics — total population and age structure (median age, youth-bulge or ageing reality); urban/rural split; internal and cross-border migration patterns; fertility/dependency where relevant. All figures tied to a year.
19. society.composition — ethnic, linguistic, and religious composition (rounded shares with year and source). State where the principal fault lines run, and EXPLICITLY whether the cleavages are CROSS-CUTTING (membership on one cleavage does not predict membership on another — tends to defuse) or REINFORCING (cleavages stack along the same line — tends to inflame). Name the geometry; do not just list groups.
20. society.religion — (a) composition rounded, and the fault line if there is one; (b) lived/syncretic texture — indigenous, folk, and syncretic practice the official label hides; (c) political salience — how far religion structures authority, allegiance, and daily life (e.g. parallel religious authority such as Sufi brotherhoods; prosperity-gospel political mobilisation; or high adherence with low salience). For every religious-composition figure, NAME the source and its known bias, and flag where the count itself is contested or politically suppressed. Round, do not over-precise.
21. society.cohesion — population-wide social trust (interpersonal AND institutional), social capital, and how the society sees itself. Use citizen self-report survey data (the region's own barometer / WVS / Pew) as the PRIMARY instrument here — not as a triangulation check. ${cohesionAnchorText}
22. security.internal — insurgency/armed groups; organized crime; terrorism threat; military strength and loyalty; border situation
23. security.diplomacy — treaty alliances; key bilateral relationships; regional flashpoints; multilateral memberships
24. actors.domestic — 5–10 actors (government, opposition, military, business elite, civil society)
25. actors.external — 3–5 actors (major powers, regional neighbors, international institutions)
26. risks — 5–10 risks, each requiring: trigger, probability, impact, time horizon, leading indicators, mitigants

Aim for 30–45 sources total. Ensure \u2265 70% of sources per section are citationType: Fact (primary authors of the data), not Interpretation.
`;

  const passB = `# Pass B Prompt (${code})

Country: ${nameEn} (${nameFr})
Date: ${today}

You are a geopolitical analyst writing a structured country situation report on ${nameEn} for an audience of senior decision-makers and investors. The approved source list from Pass A is provided below.

${calBlockText}

Return ONLY a JSON object that matches the schema below exactly. Include inline [source-id] citations in every narrative field.

Hard rules:
- Cite ONLY source IDs that appear in the approved Pass A sources list. No new sources.
- Every numeric figure must be tied to a specific year or date range (e.g., "GDP grew 1.4% in 2025 [source-id]").
- Omit any claim that cannot be tied to an approved source — do not write it with weaker sourcing or vague attribution.
- EN and FR fields must be synchronized in substance (same facts, same depth). FR may adapt phrasing naturally.
- Risks: 5–10 entries; each must have title, trigger, probability (High/Med/Low), impact (High/Med/Low), timeHorizon, leadingIndicators, and mitigants.
- dealability in actors must be exactly: High, Medium, or Low.
- Acronyms: the first mention of any acronym or initialism — no exceptions — spells the term in full, followed by the abbreviation in parentheses on that first mention only; all subsequent mentions in the same report may use the short form. This applies to every acronym without carve-outs: universal ones (GDP, UN, EU), sectoral ones (LULUCF, RCP, FPIC), organizational ones (IMF, OECD, NATO, WHO), country-specific ones (RCMP, NRCan, StatCan, PBO), and any others. The report is written for a reader who does not work in the sector, and the extra half-line per acronym on first mention is a discipline, not a compromise. ISO-3166 alpha-3 country codes used as internal identifiers (CAN, USA, DEU) are structural markers, not acronyms in prose, and are exempt when they appear as data-field identifiers; when such a code appears in reader-facing prose, spell it: "Canada," not "CAN."
- Source titles: cite every source exactly as the approved Pass A list titles it — never retitle a source into the reader's language. A source's title is a proper name in its own official language(s) as published; where Pass A supplies an original-language title with a translation in the source's desc, keep the original title and do NOT substitute the translation.
- Situating sentences: Every peer opening and every field with a baseline meaning opens with a one-sentence situator before operational detail. The situator is orientation, not history — one short line. If it runs longer than a sentence, it has failed. The five REQUIRED openers are marked "OPENER (required)" in the section instructions below.

Section-by-section instructions:

executiveSnapshot (en and fr — 13 bullet strings each):
  GENERATION ORDER — executiveSnapshot is composed LAST. Write every peer section first. The snapshot is derivative: it summarises sections already written and verified, and may introduce no fact that does not already appear, cited, in a section below. Emit executiveSnapshot as the final key in the returned JSON object; the schema is key-addressed and key order carries no meaning.
  1. Regime type and how power is won/held
  2. Current political equilibrium: current seat composition and majority/minority/coalition status — cite the legislature's official LIVE seat-standings page, verified on the run date; a source predating the most recent composition-changing event is disqualified regardless of publication date; opposition; legitimacy
  3. Economic model overview (dominant sectors, trade profile)
  4. PHYSICAL BASE: the defining geographic fact; the headline resource endowment; the principal climate exposure and whether the country can afford to meet it
  5. EXECUTION CAPACITY: whether the state can build/permit/deliver — often the single most binding constraint on acting
  6. SOCIAL STRUCTURE: demographic reality (youth bulge or ageing); the principal social cleavage and its geometry (cross-cutting or reinforcing); the population-wide social-trust level
  7. Top 3 risks in the next 6–18 months
  8. Top 3 watch items in the next 4–12 weeks
  9. External dependencies (trade, energy, debt)
  10. Security posture (internal stability, border situation)
  11. Diplomatic orientation (alliances, key bilateral relationships)
  12. Data confidence statement (which sections are high/medium/low confidence)
  13. Baseline present-state characterisation (1 sentence — NOT a forecast)

political.powerStructure: State who holds the executive and how it was won. State legislative control separately from executive control — in presidential and semi-presidential systems these diverge, and the report must say plainly whether government is unified or divided. Where the legislature is bicameral, give each chamber's composition separately, each cited to that chamber's own official live standings page verified on the run date (a standings source is disqualified if it predates the most recent composition-changing event, regardless of publication date). Use the country's own vocabulary — "governing coalition," "majority," "divided government" — do not force one system's term onto another's structure. Then: who controls security forces; judicial independence and appointment mechanism; media independence. ${powerAnchorText}

political.stabilityDrivers: What legitimizes the regime; armed forces loyalty; coalition composition; business elite alignment.

political.shockAbsorbers: What cushions shocks vs. what could accelerate instability — both dimensions in a single paragraph.

political.constitutionalSubstrate: OPENER (required, one sentence): name the constitutional form — the founding instrument(s) and how sovereignty is allocated (unitary or federal; parliamentary or presidential; one legal tradition or several). Then: the deep legal architecture beneath current politics — the allocation of sovereignty between levels of government; the founding and re-founding instruments that fix that allocation; and the status of any peoples, nations, or territories whose sovereignty predates the central state, sits outside it, or is held in a diminished or non-voting form relative to it. Identify the country's substrate on its own terms. Do not import another country's structure. Where distinct legal substrates coexist, hold them SEPARATELY — do not collapse them or project a single model of consent onto plural governance. State explicitly whether the substrate is STABLE or IN MOTION: where apex-court doctrine is actively reallocating power, that reallocation is present-state fact and belongs in this field, cited to rulings — not deferred to the trajectory layer and not treated as ordinary politics. Sources: the founding text, apex-court rulings, the statutory codification of the sovereignty relationship, treaty text where applicable, official gazette — never news, never advocacy; a legislature's non-partisan research service is admissible as citationType: Interpretation. Instances (examples, not the schema — use the ones the country actually has): settler states with treaty and title lineages, held distinct where historic-treaty/modern-agreement and unceded/title-litigated substrates coexist; federal states, where the vertical allocation and the doctrine currently governing it are the substrate; states with a legal re-founding, where later amendments or instruments reset the original terms; states holding unincorporated, overseas, or non-voting territories, where the legal status of those territories and their populations is substrate. ${substrateAnchorText}

${situationFieldText}

economy.macroReality: OPENER (required, one sentence): name the dominant economic character before any numbers — the shape of production (primary / manufacturing / services), what the economy lives on, whether it is diversified or concentrated on a few sectors. Then: GDP growth, sector performance, fiscal position (deficit %, debt/GDP), monetary policy, inflation, credit rating — all with specific figures and years.

economy.externalVulnerability: Export/import profile by value and commodity; trade partner concentration; sovereign debt holders; IMF program status; sanctions exposure.

economy.politicalEconomy: Who benefits from current model; business elite structure; what reforms are technically necessary vs. politically possible.

TERRITORY — describe the physical body of the country ON ITS OWN TERMS, not merely a risk to assets or an input to trade. Throughout: PAIR every exposure with the capacity to act on it and name the gap; LOCATE effects geographically — who inside the country is exposed or served; BIND every projection to its emissions scenario AND horizon; report DEMONSTRATED over DECLARED. Neither doom-catalogue nor techno-triumph:

OPENER (required): the territory peer opens — as the first sentence of territory.geography — with one sentence for the country as a whole: landlocked / coastal / island / archipelago / continent / peninsula; mountainous / flat / diversified; geographically isolated or embedded; who the neighbours are.

territory.geography: the physical arrangement the country must overcome to function as one country — land area and internal distances; habitable vs empty land; coastlines and ports; internal connectivity (road, rail, grid, broadband); ${geographyPeripheryText}. For large or fragmented states this is often the central fact, not backdrop. Distinct from the border-security question (SECURITY).

territory.minerals: the critical-mineral and subsurface endowment — what is physically present (reserves and resources, each with year and estimating body named; reserve figures are political — flag disputed or state-controlled counts), including undeveloped and stranded deposits. What the ground HOLDS, distinct from the mining sector's output and exports (ECONOMY).

territory.biosphere: the biological and renewable base — forests, freshwater, arable land, fisheries — as physical stock and its condition/trend (depletion, degradation, resilience), with year and source. Distinct from agricultural/forestry GDP (ECONOMY).

territory.climate: OPENER (required, one sentence): establish the baseline climate type (cold / hot / temperate / tropical / arid; high altitude; uniform or dramatically regional) before any warming, exposure, or hazard content. Warming is a change; a change needs a baseline. Then: observed and projected physical climate — zones, warming already recorded, and principal hazards (flood, wildfire, drought, heat, sea-level rise, permafrost thaw) LOCATED geographically. Every projection carries its emissions scenario AND horizon. Physical science only. PAIR each exposure with the adaptive capacity to meet it; name who inside the country is exposed vs who can afford the defence.

territory.metabolism: how the country physically powers, feeds, and waters itself AS A SYSTEM — energy, food, and water flows; self-sufficiency vs dependence in each; the internal networks that distribute them. The country's own throughput, NOT energy-as-export-vulnerability (ECONOMY).

territory.transition: the country's position in decarbonization — energy mix, emissions profile and TRAJECTORY, pledged targets measured against DELIVERED policy. A target is not an outcome; report the actual path against the pledge and name the gap. Climate Action Tracker as the PRIMARY pledge-vs-policy instrument.

CAPACITY TO EXECUTE — whether the state can DO: build, permit, deliver, process — present-state and sourceable. NOT what the country has (ECONOMY) or who benefits (SOCIETY), but whether intent becomes built fact. Where "knowledge isn't the constraint, capacity is" becomes a measured field: ${capacityAnchorText}

capacity.permitting: approval and permitting timelines for major projects; regulatory predictability; the record of projects proposed vs consented vs built.

capacity.delivery: infrastructure delivery record and deficit; cost and schedule performance; the state's administrative and fiscal ability to execute at scale.

capacity.productivity: productivity level and trend; internal barriers to the movement of goods, labour and capital between subnational units — ${productivityTermText}; value-add processing built domestically vs raw material exported for others to process.

SOCIETY — describe the society ON ITS OWN TERMS, before and independent of any stability implication; a society is a component of the country in itself, not a risk factor:

society.demographics: OPENER (required, one very short historical framing sentence): indigenous-continuous / settler-immigrant-built / mixed from the onset / historically closed. Migration numbers depend on this baseline. Then: total population and age structure (median age, youth-bulge or ageing reality); urban/rural split; internal and cross-border migration patterns; fertility/dependency where relevant. All figures tied to a year.

society.composition: ethnic, linguistic, and religious composition (rounded shares with year and source). State where the principal fault lines run, and EXPLICITLY whether the cleavages are CROSS-CUTTING (membership on one cleavage does not predict membership on another — tends to defuse) or REINFORCING (cleavages stack along the same line — tends to inflame). Name the geometry; do not just list groups.

society.religion: (a) composition rounded, and the fault line if there is one; (b) lived/syncretic texture — indigenous, folk, and syncretic practice the official label hides; (c) political salience — how far religion structures authority, allegiance, and daily life (e.g. parallel religious authority such as Sufi brotherhoods; prosperity-gospel political mobilisation; or high adherence with low salience). For every religious-composition figure, NAME the source and its known bias, and flag where the count itself is contested or politically suppressed. Round, do not over-precise.

society.cohesion: population-wide social trust (interpersonal AND institutional), social capital, and how the society sees itself. Use citizen self-report survey data (the region's own barometer / WVS / Pew) as the PRIMARY instrument here — not as a triangulation check. ${cohesionAnchorText}

security.internal: Insurgency/armed groups; organized crime; communal violence; terrorism threat level; military strength and loyalty; border situation.

security.diplomacy: Treaty alliances; transactional partners; key bilateral relationships; regional flashpoints; multilateral memberships.

actors.domestic and actors.external MUST use this exact bilingual structure:
"domestic": {
  "en": [ { "name": "", "interests": "", "resources": "", "constraints": "", "likelyMoves": "", "dealability": "High|Medium|Low" }, ... ],
  "fr": [ { "name": "", "interests": "", "resources": "", "constraints": "", "likelyMoves": "", "dealability": "High|Medium|Low" }, ... ]
}
Do NOT return a flat array. Both "en" and "fr" keys are required. 5–10 domestic actors, 3–5 external actors.

risks MUST use this exact bilingual structure:
"risks": {
  "en": [ { "title": "", "trigger": "", "probability": "High|Med|Low", "impact": "High|Med|Low", "timeHorizon": "", "leadingIndicators": "", "mitigants": "" }, ... ],
  "fr": [ { "title": "", "trigger": "", "probability": "High|Med|Low", "impact": "High|Med|Low", "timeHorizon": "", "leadingIndicators": "", "mitigants": "" }, ... ]
}
Do NOT return a flat array. Both "en" and "fr" keys are required. Minimum 5 entries in each.

scorecard fields (eliteCohesion, socialCohesion, securityLoyalty, economicPressure, protestCapacity, institutionalResilience): Set each to High, Med, or Low based on your analysis. socialCohesion is the second of the two-cohesions split — society-wide trust/polarisation, distinct from elite cohesion.

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
    },
  ];

  const contentTemplate = {
    scorecard: {
      eliteCohesion: 'Med',
      socialCohesion: 'Med',
      securityLoyalty: 'Med',
      economicPressure: 'Med',
      protestCapacity: 'Med',
      institutionalResilience: 'Med',
    },
    political: {
      powerStructure: { en: '', fr: '' },
      stabilityDrivers: { en: '', fr: '' },
      shockAbsorbers: { en: '', fr: '' },
      constitutionalSubstrate: { en: '', fr: '' },
    },
    situation: { en: '', fr: '' },
    economy: {
      macroReality: { en: '', fr: '' },
      externalVulnerability: { en: '', fr: '' },
      politicalEconomy: { en: '', fr: '' },
    },
    territory: {
      geography: { en: '', fr: '' },
      minerals: { en: '', fr: '' },
      biosphere: { en: '', fr: '' },
      climate: { en: '', fr: '' },
      metabolism: { en: '', fr: '' },
      transition: { en: '', fr: '' },
    },
    capacity: {
      permitting: { en: '', fr: '' },
      delivery: { en: '', fr: '' },
      productivity: { en: '', fr: '' },
    },
    society: {
      demographics: { en: '', fr: '' },
      composition: { en: '', fr: '' },
      religion: { en: '', fr: '' },
      cohesion: { en: '', fr: '' },
    },
    security: {
      internal: { en: '', fr: '' },
      diplomacy: { en: '', fr: '' },
    },
    actors: {
      domestic: { en: [{ name: '', interests: '', resources: '', constraints: '', likelyMoves: '', dealability: '' }], fr: [{ name: '', interests: '', resources: '', constraints: '', likelyMoves: '', dealability: '' }] },
      external: { en: [{ name: '', interests: '', resources: '', constraints: '', likelyMoves: '', dealability: '' }], fr: [{ name: '', interests: '', resources: '', constraints: '', likelyMoves: '', dealability: '' }] },
    },
    risks: {
      en: [{ title: '', trigger: '', probability: 'Med', impact: 'Med', timeHorizon: '', leadingIndicators: '', mitigants: '' }],
      fr: [{ title: '', trigger: '', probability: 'Med', impact: 'Med', timeHorizon: '', leadingIndicators: '', mitigants: '' }],
    },
    executiveSnapshot: { en: [''], fr: [''] },
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

  const contentCheck = validateContent(content, sourcesCheck.ids, promotedIds, eventIds, code === 'USA');
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
