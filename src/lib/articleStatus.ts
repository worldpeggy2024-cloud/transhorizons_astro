/*
 * articleStatus — which pieces are finalised, and which are still being worked on.
 *
 * The site publishes everything; this marks honestly what has not yet been
 * through a full review pass, so a reader (or a prospective employer) is not
 * left to assume every piece is equally settled. Removing a slug from FINALISED
 * is what shows the badge; adding it back is what removes it.
 *
 * Slugs are the site slugs used in URLs and on the cards — the same keys as in
 * articleTexts.ts and content/narration-approved.json.
 */

const FINALISED = new Set<string>([
  // Portfolio / Analyses
  'resource-civilization',
  'canada-multipolar',
  // Notes
  'career-evolution',
  'travel-observation',
]);

/** True when the piece has NOT been through a full review pass. */
export function isInReview(slug?: string): boolean {
  if (!slug) return false;
  return !FINALISED.has(slug);
}

/*
 * Badge wording. One string per language — change it here and it changes
 * everywhere. "Draft" is deliberately plainer than "In review": it says the
 * piece is readable but unfinished, without implying a formal process.
 */
export function reviewLabel(lang: string): string {
  return lang.toLowerCase().startsWith('fr') ? 'Brouillon' : 'Draft';
}

/** Longer form, for the article page itself where there is room to explain. */
export function reviewNote(lang: string): string {
  return lang.toLowerCase().startsWith('fr')
    ? 'Cet article est en cours de révision et n’a pas encore été finalisé.'
    : 'This article is under review and has not yet been finalised.';
}

/* ── Country reports ────────────────────────────────────────────────────────
 * A different situation from an unfinished article, and it deserves different
 * words. These reports were written before the current two-phase research
 * pipeline; they are being regenerated, and until that happens their content is
 * not held to the standard the finished ones are.
 *
 * The test is SEO_READY_COUNTRIES in analysedCountries.ts — the same gate that
 * decides whether a report is crawlable. Keeping one source of truth means a
 * report cannot be marked "current" for search engines and "not updated" for
 * readers, or the reverse.
 * ─────────────────────────────────────────────────────────────────────────── */

export function isCountryInReview(cca3: string | undefined, seoReady: string[]): boolean {
  if (!cca3) return false;
  return !seoReady.includes(cca3.toUpperCase());
}

export function countryReviewLabel(lang: string): string {
  return lang.toLowerCase().startsWith('fr') ? 'Non mis à jour' : 'Not updated';
}

export function countryReviewNote(lang: string): string {
  return lang.toLowerCase().startsWith('fr')
    ? 'Ce rapport précède la méthode de recherche actuelle et n’a pas encore été régénéré. Son contenu est conservé à titre indicatif.'
    : 'This report predates the current research method and has not yet been regenerated. Its content is kept for reference only.';
}
