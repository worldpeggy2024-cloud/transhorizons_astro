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
    // Layer 1 (extraction) — rework §8.1; optional until the actors pass runs.
    kind: a.kind ? String(a.kind) : undefined,
    liveActorStatus: a.liveActorStatus ? String(a.liveActorStatus) : undefined,
    currentPosition: a.currentPosition ? String(a.currentPosition) : undefined,
    fieldsCitedIn: Array.isArray(a.fieldsCitedIn) ? (a.fieldsCitedIn as unknown[]).map(String) : undefined,
    // Layer 2 (analytical draft — AI-drafted/unverified).
    interests: String(a.interests ?? ''),
    resources: String(a.resources ?? ''),
    constraints: String(a.constraints ?? ''),
    likelyMoves: String(a.likelyMoves ?? ''),
    engagementMode: a.engagementMode ? String(a.engagementMode) : undefined,
    dealability: String(a.dealability ?? ''),
  }));
}

// scorecard_anchors (rework §1/§4): JSON-in-text — swallow parse failures like
// the other JSON blocks (the scorecard then renders without the reveal).
function parseScorecardAnchors(v: unknown): AnalysisContent['scorecardAnchors'] {
  if (typeof v !== 'string' || !v.trim()) return undefined;
  try {
    const parsed = JSON.parse(v);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as AnalysisContent['scorecardAnchors'])
      : undefined;
  } catch {
    return undefined;
  }
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
    // Exec snapshot is display-REMOVED (rework §5) but still adapted so the
    // legacy data shape stays satisfied; nothing renders it.
    executiveSnapshot: splitSnapshot(d[`executiveSnapshot${s}`]),
    // Baseline (rework §5): the always-visible derivative paragraph; empty
    // until the country is regenerated (renderer shows nothing).
    baseline: String(d[`baseline${s}`] ?? ''),
    political: {
      powerStructure: String(d[`political_powerStructure${s}`] ?? ''),
      rightsAndChecks: String(d[`political_rightsAndChecks${s}`] ?? ''),
      stabilityDrivers: String(d[`political_stabilityDrivers${s}`] ?? ''),
      shockAbsorbers: String(d[`political_shockAbsorbers${s}`] ?? ''),
      constitutionalSubstrate: String(d[`political_constitutionalSubstrate${s}`] ?? ''),
      stateStructure: String(d[`political_stateStructure${s}`] ?? ''),
    },
    situation: String(d[`situation${s}`] ?? ''),
    economy: {
      // New name first; LEGACY key kept readable for not-yet-regenerated countries.
      realEconomy: String(d[`economy_realEconomy${s}`] ?? ''),
      macroReality: String(d[`economy_macroReality${s}`] ?? ''),
      publicFinances: String(d[`economy_publicFinances${s}`] ?? ''),
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
      inheritedTerrain: String(d[`capacity_inheritedTerrain${s}`] ?? ''),
      steering: String(d[`capacity_steering${s}`] ?? ''),
      approvals: String(d[`capacity_approvals${s}`] ?? ''),
      permitting: String(d[`capacity_permitting${s}`] ?? ''),
      delivery: String(d[`capacity_delivery${s}`] ?? ''),
      publicServices: String(d[`capacity_publicServices${s}`] ?? ''),
      productivity: String(d[`capacity_productivity${s}`] ?? ''),
    },
    society: {
      demographics: String(d[`society_demographics${s}`] ?? ''),
      composition: String(d[`society_composition${s}`] ?? ''),
      language: String(d[`society_language${s}`] ?? ''),
      religion: String(d[`society_religion${s}`] ?? ''),
      wellbeing: String(d[`society_wellbeing${s}`] ?? ''),
      cohesion: String(d[`society_cohesion${s}`] ?? ''),
    },
    security: {
      posture: String(d[`security_posture${s}`] ?? ''),
      internal: String(d[`security_internal${s}`] ?? ''),
      military: String(d[`security_military${s}`] ?? ''),
      transnationalExposure: String(d[`security_transnationalExposure${s}`] ?? ''),
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
    scorecardAnchors: parseScorecardAnchors(d.scorecard_anchors),
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
