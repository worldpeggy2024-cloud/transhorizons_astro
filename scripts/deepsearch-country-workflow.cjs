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

  if (!Array.isArray(sources) || sources.length === 0) {
    errors.push('Pass A sources must be a non-empty array.');
    return { errors, ids: new Set() };
  }

  const ids = new Set();
  for (const [idx, s] of sources.entries()) {
    const key = `sources[${idx}]`;
    const required = ['id', 'name', 'url', 'desc', 'publicationDate', 'accessDate', 'confidence', 'citationType'];

    for (const r of required) {
      if (!nonEmptyString(s?.[r])) errors.push(`${key}.${r} is required`);
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
      errors.push(`${key}.url must be a deep link, not homepage`);
    }
  }

  return { errors, ids };
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

function validateContent(content, sourceIds) {
  const errors = [];

  const score = content?.scorecard ?? {};
  const scoreKeys = ['eliteCohesion', 'securityLoyalty', 'economicPressure', 'protestCapacity', 'institutionalResilience'];
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
    ['economy.macroReality.en', content?.economy?.macroReality?.en],
    ['economy.macroReality.fr', content?.economy?.macroReality?.fr],
    ['economy.externalVulnerability.en', content?.economy?.externalVulnerability?.en],
    ['economy.externalVulnerability.fr', content?.economy?.externalVulnerability?.fr],
    ['economy.politicalEconomy.en', content?.economy?.politicalEconomy?.en],
    ['economy.politicalEconomy.fr', content?.economy?.politicalEconomy?.fr],
    ['security.internal.en', content?.security?.internal?.en],
    ['security.internal.fr', content?.security?.internal?.fr],
    ['security.diplomacy.en', content?.security?.diplomacy?.en],
    ['security.diplomacy.fr', content?.security?.diplomacy?.fr],
  ];
  textFields.forEach(([field, val]) => mustHaveCitation(val, field, errors));

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
  for (const id of usedIds) {
    if (!sourceIds.has(id)) {
      errors.push(`Citation [${id}] appears in content but not in Pass A sources`);
    }
  }
  for (const id of sourceIds) {
    if (!usedIds.has(id)) {
      errors.push(`Source '${id}' is never cited in Pass B content`);
    }
  }

  return { errors };
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
    yamlText('economy_macroReality_en', c.economy.macroReality.en),
    yamlText('economy_macroReality_fr', c.economy.macroReality.fr),
    yamlText('economy_externalVulnerability_en', c.economy.externalVulnerability.en),
    yamlText('economy_externalVulnerability_fr', c.economy.externalVulnerability.fr),
    yamlText('economy_politicalEconomy_en', c.economy.politicalEconomy.en),
    yamlText('economy_politicalEconomy_fr', c.economy.politicalEconomy.fr),
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

function initCommand(iso3, nameEn, nameFr) {
  const code = String(iso3).toUpperCase();
  const jobDir = path.join(process.cwd(), 'content', 'docs', 'deepsearch-jobs', code);
  ensureDir(jobDir);

  const passAPath = path.join(jobDir, 'pass-a.prompt.md');
  const passBPath = path.join(jobDir, 'pass-b.prompt.md');
  const srcTemplatePath = path.join(jobDir, 'pass-a.sources.template.json');
  const contentTemplatePath = path.join(jobDir, 'pass-b.content.template.json');

  const today = new Date().toISOString().slice(0, 10);

  const passA = `# Pass A Prompt (${code})

Country: ${nameEn} (${nameFr})
Date: ${today}

You are a geopolitical analyst preparing to write a structured country situation report on ${nameEn} for an audience of senior decision-makers and investors. Before writing any prose, your task in this pass is to assemble a high-quality source list only.

Return ONLY a JSON array of sources. No prose, no analysis, no section headers — just sources.

Each source must match this exact schema (all 8 fields required, no omissions):
[
  {
    "id": "short-slug",
    "name": "Full Publication Name",
    "url": "https://exact-url-to-specific-document-not-homepage",
    "desc": "One sentence: what this source is and what specific data it provides for ${nameEn}.",
    "publicationDate": "YYYY-MM-DD",
    "accessDate": "${today}",
    "confidence": "High | Med | Low",
    "citationType": "Fact | Interpretation"
  }
]

Source priority rules:
- Macro/Finance: national statistics office, IMF, World Bank, BIS, OECD
- Governance/Rule of law: V-Dem, Freedom House, World Justice Project (WJP)
- Corruption: Transparency International
- Conflict/Security: ACLED, SIPRI, International Crisis Group (ICG)
- Trade: WTO, UN Comtrade
- Recent events of fact: national news outlets ONLY for events verified as fact in the last 90 days
- Do NOT cite Wikipedia, homepages, aggregators, or blogs
- Deep links only — the specific document or data page, not a site homepage

The sources you collect must be sufficient to support ALL of the following content sections in Pass B:

1. executiveSnapshot — 10 bullet points covering: regime type, political equilibrium, economic model, top risks, top watch items, external dependencies, security posture, diplomatic orientation, data confidence, baseline outlook
2. political.powerStructure — who holds executive/legislative/judicial power; security forces; media independence
3. political.stabilityDrivers — legitimacy sources, armed forces loyalty, coalition, business elite alignment
4. political.shockAbsorbers — what cushions shocks vs. what accelerates instability
5. economy.macroReality — GDP growth, sector performance, fiscal position (deficit %, debt/GDP), monetary policy, inflation, credit rating — all with specific figures and years
6. economy.externalVulnerability — export/import profile; trade partner concentration; sovereign debt holders; IMF program status; sanctions exposure
7. economy.politicalEconomy — who benefits from current model; business elite structure; technically necessary vs. politically possible reforms
8. security.internal — insurgency/armed groups; organized crime; terrorism threat; military strength and loyalty; border situation
9. security.diplomacy — treaty alliances; key bilateral relationships; regional flashpoints; multilateral memberships
10. actors.domestic — 5–10 actors (government, opposition, military, business elite, civil society)
11. actors.external — 3–5 actors (major powers, regional neighbors, international institutions)
12. risks — 5–10 risks, each requiring: trigger, probability, impact, time horizon, leading indicators, mitigants

Aim for 20–35 sources total. Ensure \u2265 70% of sources per section are citationType: Fact (primary authors of the data), not Interpretation.
`;

  const passB = `# Pass B Prompt (${code})

Country: ${nameEn} (${nameFr})
Date: ${today}

You are a geopolitical analyst writing a structured country situation report on ${nameEn} for an audience of senior decision-makers and investors. The approved source list from Pass A is provided below.

Return ONLY a JSON object that matches the schema below exactly. Include inline [source-id] citations in every narrative field.

Hard rules:
- Cite ONLY source IDs that appear in the approved Pass A sources list. No new sources.
- Every numeric figure must be tied to a specific year or date range (e.g., "GDP grew 1.4% in 2025 [source-id]").
- Omit any claim that cannot be tied to an approved source — do not write it with weaker sourcing or vague attribution.
- EN and FR fields must be synchronized in substance (same facts, same depth). FR may adapt phrasing naturally.
- Risks: 5–10 entries; each must have title, trigger, probability (High/Med/Low), impact (High/Med/Low), timeHorizon, leadingIndicators, and mitigants.
- dealability in actors must be exactly: High, Medium, or Low.

Section-by-section instructions:

executiveSnapshot (en and fr — 10 bullet strings each):
  1. Regime type and how power is won/held
  2. Current political equilibrium (coalition, opposition, legitimacy)
  3. Economic model overview (dominant sectors, trade profile)
  4. Top 3 risks in the next 6–18 months
  5. Top 3 watch items in the next 4–12 weeks
  6. External dependencies (trade, energy, debt)
  7. Security posture (internal stability, border situation)
  8. Diplomatic orientation (alliances, key bilateral relationships)
  9. Data confidence statement (which sections are high/medium/low confidence)
  10. Baseline outlook (1 sentence)

political.powerStructure: Who holds executive, legislative, judicial power; who controls security forces; media independence.

political.stabilityDrivers: What legitimizes the regime; armed forces loyalty; coalition composition; business elite alignment.

political.shockAbsorbers: What cushions shocks vs. what could accelerate instability — both dimensions in a single paragraph.

economy.macroReality: GDP growth, sector performance, fiscal position (deficit %, debt/GDP), monetary policy, inflation, credit rating — all with specific figures and years.

economy.externalVulnerability: Export/import profile by value and commodity; trade partner concentration; sovereign debt holders; IMF program status; sanctions exposure.

economy.politicalEconomy: Who benefits from current model; business elite structure; what reforms are technically necessary vs. politically possible.

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

scorecard fields (eliteCohesion, securityLoyalty, economicPressure, protestCapacity, institutionalResilience): Set each to High, Med, or Low based on your analysis.

Approved source IDs from Pass A:
[PASTE THE SOURCE IDs FROM pass-a.sources.json HERE BEFORE SUBMITTING]
`;

  const sourceTemplate = [
    {
      id: 'source-id-example',
      name: 'Full source title',
      url: 'https://example.com/deep-link',
      desc: 'What this source provides for this country.',
      publicationDate: '2026-01-01',
      accessDate: '2026-05-05',
      confidence: 'High',
      citationType: 'Fact',
    },
  ];

  const contentTemplate = {
    scorecard: {
      eliteCohesion: 'Med',
      securityLoyalty: 'Med',
      economicPressure: 'Med',
      protestCapacity: 'Med',
      institutionalResilience: 'Med',
    },
    executiveSnapshot: { en: [''], fr: [''] },
    political: {
      powerStructure: { en: '', fr: '' },
      stabilityDrivers: { en: '', fr: '' },
      shockAbsorbers: { en: '', fr: '' },
    },
    economy: {
      macroReality: { en: '', fr: '' },
      externalVulnerability: { en: '', fr: '' },
      politicalEconomy: { en: '', fr: '' },
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
  };

  fs.writeFileSync(passAPath, passA, 'utf8');
  fs.writeFileSync(passBPath, passB, 'utf8');
  fs.writeFileSync(srcTemplatePath, JSON.stringify(sourceTemplate, null, 2), 'utf8');
  fs.writeFileSync(contentTemplatePath, JSON.stringify(contentTemplate, null, 2), 'utf8');

  console.log(`Created Deepsearch job assets in ${path.relative(process.cwd(), jobDir)}`);
}

function applyCommand(iso3, opts) {
  const code = String(iso3).toUpperCase();
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
  const sources = parseJsonFile(path.resolve(process.cwd(), sourcesPath));
  const content = parseJsonFile(path.resolve(process.cwd(), contentPath));

  const sourcesCheck = validateSources(sources);
  const contentCheck = validateContent(content, sourcesCheck.ids);
  const errors = [...sourcesCheck.errors, ...contentCheck.errors];
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
