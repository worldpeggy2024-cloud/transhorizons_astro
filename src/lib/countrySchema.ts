/**
 * countrySchema.ts
 * Zod schemas for the YAML-based country content format.
 * Used by: scripts/generate-country-data.cjs, scripts/validate-countries.test.ts
 *
 * Rule: every narrative field must contain at least one [id] citation.
 * IDs must match an entry in the country's sources file.
 */

import { z } from 'zod';

// ─── Primitive helpers ────────────────────────────────────────────────────────

/** Citation pattern: [slug-id] where slug is lowercase alphanumeric + hyphens */
const CITATION_RE = /\[[a-z0-9-]+\]/;

/**
 * Narrative string field: must contain at least one [id] citation.
 * The validator script checks that IDs resolve to actual sources.
 */
function citedString(fieldName: string) {
  return z
    .string()
    .min(1, `${fieldName} must not be empty`)
    .refine(
      (v) => CITATION_RE.test(v),
      `${fieldName}: every narrative field must contain at least one [id] citation marker`,
    );
}

// ─── Source entry ─────────────────────────────────────────────────────────────

export const SourceEntrySchema = z.object({
  /** Stable slug ID used in citation markers, e.g. [imf] or [pm-ca]. Must be unique within a country. */
  id: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'Source id must be lowercase alphanumeric with hyphens only'),
  name: z.string().min(1, 'name is required'),
  url: z.string().url('url must be a valid https:// URL'),
  /** One or two sentences: what this source covers and why it is authoritative. */
  desc: z.string().min(10, 'desc must be at least 10 characters'),
  /**
   * Year or year range: "2025" or "2025-2026".
   * "n/a", "TBD", empty, or single-digit values are rejected.
   */
  publicationDate: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      'publicationDate must be YYYY-MM-DD',
    ),
  /** ISO date (YYYY-MM-DD) of when the URL was opened and verified. */
  accessDate: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      'accessDate must be YYYY-MM-DD',
    ),
  confidence: z.enum(['High', 'Med', 'Low']),
  citationType: z.enum(['Fact', 'Interpretation']),
  /** ISO date (YYYY-MM-DD) of last URL verification. Set when running validate:sources. */
  lastVerified: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'lastVerified must be YYYY-MM-DD')
    .optional(),
  /** Wayback Machine URL as fallback for link rot. null = not yet archived. */
  archiveUrl: z.string().url().nullable().optional(),
});

export type SourceEntry = z.infer<typeof SourceEntrySchema>;

/** Full sources file: array of source entries. */
export const SourcesFileSchema = z
  .array(SourceEntrySchema)
  .min(15, 'A country must have at least 15 sources')
  .refine(
    (sources) => {
      const ids = sources.map((s) => s.id);
      return ids.length === new Set(ids).size;
    },
    'Source IDs must be unique within a country',
  );

// ─── Actor entry ──────────────────────────────────────────────────────────────

export const ActorEntrySchema = z.object({
  name: z.string().min(1),
  interests: z.string().min(1),
  resources: z.string().min(1),
  constraints: z.string().min(1),
  likelyMoves: z.string().min(1),
  dealability: z.string().min(1),
});

export type ActorEntry = z.infer<typeof ActorEntrySchema>;

// ─── Risk entry ───────────────────────────────────────────────────────────────

export const RiskEntrySchema = z.object({
  title: z.string().min(1),
  trigger: citedString('risk.trigger'),
  probability: z.enum(['Low', 'Med', 'High']),
  impact: z.enum(['Low', 'Med', 'High']),
  timeHorizon: z.string().min(1),
  leadingIndicators: z.string().min(1),
  mitigants: z.string().min(1),
  lastAssessed: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'lastAssessed must be YYYY-MM-DD')
    .optional(),
});

export type RiskEntry = z.infer<typeof RiskEntrySchema>;

// ─── Language content ─────────────────────────────────────────────────────────

export const LangContentSchema = z.object({
  executiveSnapshot: z
    .array(citedString('executiveSnapshot bullet'))
    .min(5, 'executiveSnapshot must have at least 5 bullets'),
  political: z.object({
    powerStructure: citedString('political.powerStructure'),
    stabilityDrivers: citedString('political.stabilityDrivers'),
    shockAbsorbers: citedString('political.shockAbsorbers'),
  }),
  economy: z.object({
    macroReality: citedString('economy.macroReality'),
    externalVulnerability: citedString('economy.externalVulnerability'),
    politicalEconomy: citedString('economy.politicalEconomy'),
  }),
  security: z.object({
    internal: citedString('security.internal'),
    diplomacy: citedString('security.diplomacy'),
  }),
  actors: z.object({
    domestic: z.array(ActorEntrySchema).min(5, 'At least 5 domestic actors required'),
    external: z.array(ActorEntrySchema).min(3, 'At least 3 external actors required'),
  }),
  risks: z.array(RiskEntrySchema).min(5, 'At least 5 risks required'),
});

export type LangContent = z.infer<typeof LangContentSchema>;

// ─── Country meta ─────────────────────────────────────────────────────────────

export const CountryMetaSchema = z.object({
  code: z.string().length(3, 'code must be 3-letter ISO 3166-1 alpha-3'),
  nameEn: z.string().min(1),
  nameFr: z.string().min(1),
  lastUpdated: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'lastUpdated must be YYYY-MM-DD'),
  scorecard: z.object({
    eliteCohesion: z.enum(['High', 'Med', 'Low']),
    securityLoyalty: z.enum(['High', 'Med', 'Low']),
    economicPressure: z.enum(['High', 'Med', 'Low']),
    protestCapacity: z.enum(['High', 'Med', 'Low']),
    institutionalResilience: z.enum(['High', 'Med', 'Low']),
  }),
});

export type CountryMeta = z.infer<typeof CountryMetaSchema>;

// ─── Cross-file validation helpers ───────────────────────────────────────────

/** Extract all citation IDs used in a string, e.g. "[imf]" → "imf" */
export function extractCitationIds(text: string): string[] {
  const matches = text.matchAll(/\[([a-z0-9-]+)\]/g);
  return [...matches].map((m) => m[1]);
}

/** Extract all citation IDs from a full LangContent object */
export function extractAllCitationIds(lang: LangContent): Set<string> {
  const ids = new Set<string>();
  const collect = (text: string) => extractCitationIds(text).forEach((id) => ids.add(id));

  lang.executiveSnapshot.forEach(collect);
  collect(lang.political.powerStructure);
  collect(lang.political.stabilityDrivers);
  collect(lang.political.shockAbsorbers);
  collect(lang.economy.macroReality);
  collect(lang.economy.externalVulnerability);
  collect(lang.economy.politicalEconomy);
  collect(lang.security.internal);
  collect(lang.security.diplomacy);
  lang.actors.domestic.forEach((a) => {
    collect(a.interests);
    collect(a.resources);
    collect(a.constraints);
    collect(a.likelyMoves);
  });
  lang.actors.external.forEach((a) => {
    collect(a.interests);
    collect(a.resources);
    collect(a.constraints);
    collect(a.likelyMoves);
  });
  lang.risks.forEach((r) => {
    collect(r.trigger);
    collect(r.leadingIndicators);
    collect(r.mitigants);
  });
  return ids;
}
