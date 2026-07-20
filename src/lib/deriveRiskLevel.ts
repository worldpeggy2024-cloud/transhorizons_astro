/**
 * deriveRiskLevel.ts
 * Single source of truth for a country's overall globe riskLevel.
 *
 * DECIDED (strict, locked) rule — derived from the country's OWN sourced risk
 * register, never assigned by hand or AI fiat:
 *   High   = >= 1 risk that is High on BOTH probability and impact
 *   Medium = no High-on-both, but >= 1 risk touching High on either axis
 *   Low    = all risks Med/Low on both axes
 *
 * The strict reading keeps "High" rare and therefore meaningful (red marks
 * countries where something serious is also *likely*). Changing the thresholds
 * later is a one-line change here, not a migration.
 *
 * - Output uses 'High' | 'Medium' | 'Low' to match CountryMetadata.riskCategory.
 * - Input probability/impact use the register's 'High' | 'Med' | 'Low' (note 'Med').
 *
 * Call this in the two places that need the verdict — never re-implement the
 * rule inline:
 *   1. the globe/filter meta (countryMetadata) to stamp riskCategory, and
 *   2. CountryPage, for the self-justifying on-page label ("High — driven by …").
 *
 * STATUS 2026-07-19 (author decision): the globe risk-level FACET is removed —
 * consumer (1) is gone; riskCategory in countryMetadata is legacy-unused. The
 * on-page chip (2) remains for registers that carry rated entries (CAN). The
 * aggregate-level notion, the Layer-2 probability/impact framing, and the
 * correlation cascades are ALL under study; the risks pass is being reworked
 * to a Layer-1 cited stress index (risks-pass-template v2.0 draft), which
 * carries no ratings — an unrated or empty register derives NO level (null),
 * never a default 'Low'.
 */

export type RiskLevel = 'High' | 'Medium' | 'Low';

export interface DerivedRiskLevel {
  level: RiskLevel;
  /** Title of the High×High risk that drives a 'High' verdict; null otherwise. */
  drivenBy: string | null;
}

interface RiskLike {
  title?: string;
  probability?: string;
  impact?: string;
}

const isHigh = (v: unknown): boolean => String(v ?? '').trim().toLowerCase() === 'high';

export function deriveRiskLevel(
  risks: readonly RiskLike[] | undefined | null,
): DerivedRiskLevel | null {
  const list = Array.isArray(risks) ? risks : [];

  // No register, or a register with no rated entries (the Layer-1 stress
  // index carries none): no level. 'Low' must mean "assessed low", never
  // "nothing to assess".
  const rated = list.filter((r) => String(r.probability ?? '').trim() || String(r.impact ?? '').trim());
  if (rated.length === 0) return null;

  const highOnBoth = list.filter((r) => isHigh(r.probability) && isHigh(r.impact));
  if (highOnBoth.length > 0) {
    return { level: 'High', drivenBy: highOnBoth[0].title?.trim() || null };
  }

  if (list.some((r) => isHigh(r.probability) || isHigh(r.impact))) {
    return { level: 'Medium', drivenBy: null };
  }

  return { level: 'Low', drivenBy: null };
}
