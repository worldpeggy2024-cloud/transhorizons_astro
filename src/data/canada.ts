/*
 * TransHorizons — Canada Country Analysis Data
 * Content source: content/countries/CAN/analysis.yaml (Keystatic-managed)
 * The YAML flat schema is adapted here to the AnalysisContent interface so that
 * CountryPage.tsx requires no changes.
 */

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore – @rollup/plugin-yaml resolves YAML at build time; no .d.ts needed
import raw from '../../content/countries/CAN/analysis.yaml';

import type {
  AnalysisContent,
  LangContent,
  ActorEntry,
  RiskEntry,
  SourceEntry,
} from './france';

// The YAML file stores fields with _en / _fr suffixes and a flat key structure.
// This function re-nests them into the AnalysisContent shape.
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
    url: String(s.url ?? ''),
    desc: String(s.desc ?? ''),
    publicationDate: s.publicationDate ? String(s.publicationDate) : undefined,
    accessDate: s.accessDate ? String(s.accessDate) : undefined,
    confidence: (s.confidence as SourceEntry['confidence']) ?? undefined,
    citationType: (s.citationType as SourceEntry['citationType']) ?? undefined,
    lastVerified: s.lastVerified ? String(s.lastVerified) : undefined,
    archiveUrl: s.archiveUrl ? String(s.archiveUrl) : null,
  }));
}

function buildLang(d: YamlRecord, lang: 'en' | 'fr'): LangContent {
  const s = `_${lang}`;
  return {
    executiveSnapshot: typeof d[`executiveSnapshot${s}`] === 'string'
      ? (d[`executiveSnapshot${s}`] as string).trim().split('\n').filter(l => l.trim() !== '')
      : Array.isArray(d[`executiveSnapshot${s}`])
        ? (d[`executiveSnapshot${s}`] as string[])
        : [],
    political: {
      powerStructure: String(d[`political_powerStructure${s}`] ?? ''),
      stabilityDrivers: String(d[`political_stabilityDrivers${s}`] ?? ''),
      shockAbsorbers: String(d[`political_shockAbsorbers${s}`] ?? ''),
    },
    economy: {
      macroReality: String(d[`economy_macroReality${s}`] ?? ''),
      externalVulnerability: String(d[`economy_externalVulnerability${s}`] ?? ''),
      politicalEconomy: String(d[`economy_politicalEconomy${s}`] ?? ''),
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

const d = raw as YamlRecord;

export const canadaAnalysis: AnalysisContent = {
  lastUpdated: String(d.lastUpdated ?? ''),
  scorecard: {
    eliteCohesion: (d.scorecard_eliteCohesion as AnalysisContent['scorecard']['eliteCohesion']) ?? 'Med',
    securityLoyalty: (d.scorecard_securityLoyalty as AnalysisContent['scorecard']['securityLoyalty']) ?? 'Med',
    economicPressure: (d.scorecard_economicPressure as AnalysisContent['scorecard']['economicPressure']) ?? 'Med',
    protestCapacity: (d.scorecard_protestCapacity as AnalysisContent['scorecard']['protestCapacity']) ?? 'Med',
    institutionalResilience: (d.scorecard_institutionalResilience as AnalysisContent['scorecard']['institutionalResilience']) ?? 'Med',
  },
  en: buildLang(d, 'en'),
  fr: buildLang(d, 'fr'),
  sources: adaptSources(d.sources),
};
