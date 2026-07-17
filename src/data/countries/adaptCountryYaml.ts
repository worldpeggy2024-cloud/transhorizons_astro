import type {
  AnalysisContent,
  LangContent,
  ActorEntry,
  RiskEntry,
  SourceEntry,
} from '../france';

type YamlRecord = Record<string, unknown>;

function parseArrayInput(input: unknown): YamlRecord[] {
  if (Array.isArray(input)) {
    return input as YamlRecord[];
  }

  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input);
      return Array.isArray(parsed) ? (parsed as YamlRecord[]) : [];
    } catch {
      return [];
    }
  }

  return [];
}

function adaptActors(arr: unknown): ActorEntry[] {
  return parseArrayInput(arr).map((a: YamlRecord) => ({
    name: String(a.name ?? ''),
    interests: String(a.interests ?? ''),
    resources: String(a.resources ?? ''),
    constraints: String(a.constraints ?? ''),
    likelyMoves: String(a.likelyMoves ?? ''),
    dealability: String(a.dealability ?? ''),
  }));
}

function adaptRisks(arr: unknown): RiskEntry[] {
  return parseArrayInput(arr).map((r: YamlRecord) => ({
    title: String(r.title ?? ''),
    trigger: String(r.trigger ?? ''),
    probability: (r.probability as RiskEntry['probability']) ?? 'Low',
    impact: (r.impact as RiskEntry['impact']) ?? 'Low',
    timeHorizon: String(r.timeHorizon ?? ''),
    leadingIndicators: String(r.leadingIndicators ?? ''),
    mitigants: String(r.mitigants ?? ''),
    lastAssessed: r.lastAssessed ? String(r.lastAssessed) : undefined,
  }));
}

function adaptSources(arr: unknown): SourceEntry[] {
  return parseArrayInput(arr).map((s: YamlRecord) => ({
    id: s.id ? String(s.id) : undefined,
    name: String(s.name ?? ''),
    nameFr: s.nameFr ? String(s.nameFr) : undefined,
    url: String(s.url ?? ''),
    desc: String(s.desc ?? ''),
    descFr: s.descFr ? String(s.descFr) : undefined,
    publicationDate: s.publicationDate ? String(s.publicationDate) : undefined,
    accessDate: s.accessDate ? String(s.accessDate) : undefined,
    confidence: (s.confidence as SourceEntry['confidence']) ?? undefined,
    citationType: (s.citationType as SourceEntry['citationType']) ?? undefined,
    lastVerified: s.lastVerified ? String(s.lastVerified) : undefined,
    archiveUrl: s.archiveUrl ? String(s.archiveUrl) : null,
  }));
}

function splitSnapshot(value: unknown): string[] {
  if (typeof value === 'string') {
    return value
      .trim()
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }

  if (Array.isArray(value)) {
    return value.map((v) => String(v));
  }

  return [];
}

function buildLang(d: YamlRecord, lang: 'en' | 'fr'): LangContent {
  const s = `_${lang}`;
  return {
    executiveSnapshot: splitSnapshot(d[`executiveSnapshot${s}`]),
    political: {
      powerStructure: String(d[`political_powerStructure${s}`] ?? ''),
      stabilityDrivers: String(d[`political_stabilityDrivers${s}`] ?? ''),
      shockAbsorbers: String(d[`political_shockAbsorbers${s}`] ?? ''),
      constitutionalSubstrate: String(d[`political_constitutionalSubstrate${s}`] ?? ''),
    },
    situation: String(d[`situation${s}`] ?? ''),
    economy: {
      macroReality: String(d[`economy_macroReality${s}`] ?? ''),
      externalVulnerability: String(d[`economy_externalVulnerability${s}`] ?? ''),
      politicalEconomy: String(d[`economy_politicalEconomy${s}`] ?? ''),
    },
    territory: {
      geography: String(d[`territory_geography${s}`] ?? ''),
      minerals: String(d[`territory_minerals${s}`] ?? ''),
      biosphere: String(d[`territory_biosphere${s}`] ?? ''),
      climate: String(d[`territory_climate${s}`] ?? ''),
      metabolism: String(d[`territory_metabolism${s}`] ?? ''),
      transition: String(d[`territory_transition${s}`] ?? ''),
    },
    capacity: {
      permitting: String(d[`capacity_permitting${s}`] ?? ''),
      delivery: String(d[`capacity_delivery${s}`] ?? ''),
      productivity: String(d[`capacity_productivity${s}`] ?? ''),
    },
    society: {
      demographics: String(d[`society_demographics${s}`] ?? ''),
      composition: String(d[`society_composition${s}`] ?? ''),
      religion: String(d[`society_religion${s}`] ?? ''),
      cohesion: String(d[`society_cohesion${s}`] ?? ''),
    },
    security: {
      internal: String(d[`security_internal${s}`] ?? ''),
      diplomacy: String(d[`security_diplomacy${s}`] ?? ''),
    },
    actors: {
      domestic: adaptActors(d[`actors_domestic${s}`]),
      external: adaptActors(d[`actors_external${s}`]),
    },
    risks: adaptRisks(d[`risks${s}`]),
  };
}

export function adaptCountryYaml(raw: unknown): AnalysisContent {
  const d = raw as YamlRecord;

  return {
    lastUpdated: String(d.lastUpdated ?? ''),
    // Manually maintained in Keystatic; only surfaces when set (no fabricated date).
    situationUpdated: String(d.situation_lastUpdated ?? '') || undefined,
    scorecard: {
      eliteCohesion: (d.scorecard_eliteCohesion as AnalysisContent['scorecard']['eliteCohesion']) ?? 'Med',
      // Only set when present in the YAML (no 'Med' default): an unresearched
      // social-cohesion rating should render as "—", not a fabricated Medium.
      socialCohesion: (d.scorecard_socialCohesion as AnalysisContent['scorecard']['socialCohesion']) || undefined,
      securityLoyalty: (d.scorecard_securityLoyalty as AnalysisContent['scorecard']['securityLoyalty']) ?? 'Med',
      economicPressure: (d.scorecard_economicPressure as AnalysisContent['scorecard']['economicPressure']) ?? 'Med',
      protestCapacity: (d.scorecard_protestCapacity as AnalysisContent['scorecard']['protestCapacity']) ?? 'Med',
      institutionalResilience: (d.scorecard_institutionalResilience as AnalysisContent['scorecard']['institutionalResilience']) ?? 'Med',
    },
    en: buildLang(d, 'en'),
    fr: buildLang(d, 'fr'),
    sources: adaptSources(d.sources),
  };
}
