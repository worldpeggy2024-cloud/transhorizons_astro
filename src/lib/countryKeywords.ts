/*
 * TransHorizons — Country keyword index
 *
 * The replacement for the removed Manus-era risk-level and topics facets
 * (author decision 2026-07-19): search matches REAL report content instead of
 * hand-assigned labels. Keywords are derived at build time from the two-phase
 * analysis.yaml files — actor names and positions, situation threads and events,
 * the gap register, and every prose section (both languages) —
 * so the index grows exactly as countries are regenerated, and a country can
 * be found by what its report actually says (e.g. "NATO", "Iran",
 * "Lockheed", "tariff").
 *
 * Only two-phase countries are indexed; legacy single-phase content is not
 * trustworthy enough to search against. Add a country's import here when its
 * regeneration lands (same moment it becomes SEO-ready).
 */

// Vite YAML imports — same mechanism as src/data/<country> modules.
import canRaw from '../../content/countries/CAN/analysis.yaml';
import usaRaw from '../../content/countries/USA/analysis.yaml';

type Raw = Record<string, unknown>;

/** Defensive JSON-in-text parse — a malformed block yields [], never a crash. */
function parseArray(v: unknown): Array<Record<string, unknown>> {
  if (typeof v !== 'string' || !v.trim().startsWith('[')) return [];
  try {
    const parsed = JSON.parse(v);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function keywordsFor(raw: Raw): string[] {
  const out = new Set<string>();
  const add = (s: unknown) => {
    if (typeof s === 'string' && s.trim().length >= 3) out.add(s.trim());
  };
  const strip = (s: unknown) => String(s).replace(/\[[^\]]*\]/g, ' ').replace(/\s+/g, ' ').trim();

  // Actors — name, kind, current position, interests (both languages)
  for (const key of ['actors_domestic_en', 'actors_domestic_fr', 'actors_external_en', 'actors_external_fr']) {
    for (const a of parseArray(raw[key])) { add(a.name); add(a.kind); add(strip(a.currentPosition)); add(strip(a.interests)); }
  }
  // Situation — thread names + event text (EN + FR)
  for (const key of ['situation_en', 'situation_fr']) {
    for (const th of parseArray(raw[key])) {
      add(th.thread);
      const events = Array.isArray(th.events) ? (th.events as Array<Record<string, unknown>>) : [];
      for (const e of events) { add(strip(e.what)); add(strip(e.changed)); }
    }
  }
  // Gap register — the documented shortfalls (EN + FR)
  for (const key of ['capacity_knownAndUnbuilt_en', 'capacity_knownAndUnbuilt_fr']) {
    const v = raw[key];
    if (typeof v === 'string' && v.trim().startsWith('{')) {
      try {
        const g = JSON.parse(v) as { items?: Array<Record<string, unknown>> };
        for (const it of g.items ?? []) add(strip(it.gap));
      } catch { /* malformed → skip */ }
    }
  }
  // Every prose section field — territory · society · economy · political · capacity ·
  // security · baseline, both languages — so search reaches the whole report, not just
  // the actor and situation layers. (JSON-in-text fields are handled above and skipped.)
  for (const [k, v] of Object.entries(raw)) {
    if (typeof v !== 'string' || !/_(en|fr)$/.test(k)) continue;
    if (/^(actors_|situation_|scorecard_|capacity_knownAndUnbuilt_)/.test(k)) continue;
    add(strip(v));
  }

  return [...out];
}

/** cca3 → searchable phrases from the country's own report. */
export const COUNTRY_KEYWORDS: Record<string, string[]> = {
  CAN: keywordsFor(canRaw as Raw),
  USA: keywordsFor(usaRaw as Raw),
};

/**
 * True when the query matches one of the country's report-derived keywords.
 * Callers should keep their existing name/code matching; this adds content
 * matching for queries of 3+ characters.
 */
export function matchesKeywords(cca3: string, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (q.length < 3) return false;
  const keywords = COUNTRY_KEYWORDS[cca3];
  if (!keywords) return false;
  return keywords.some((k) => k.toLowerCase().includes(q));
}
