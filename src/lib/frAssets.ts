/**
 * French-localized asset variants.
 *
 * WHY THIS LIVES IN CODE (not in the YAML / Keystatic schema):
 * Article content (content/articles/*.yaml) is language-agnostic for images —
 * `image`, `embedUrl`, and `images[].src` hold ONE path shared by both languages.
 * Per CLAUDE.md, Keystatic silently strips any YAML field its schema doesn't
 * declare, and that strip already wiped image fields and broke this page once.
 * Keeping the EN→FR image swap here, in the render layer, means a Keystatic
 * text-save can never strip or break it — there is no extra content field to drop.
 *
 * To add a future French map: add one line below. No schema/YAML change needed.
 * The keys are the exact English paths as they appear in the YAML.
 */
export const FR_ASSETS: Record<string, string> = {
  '/images/ArcticMultipolarLegend.jpg': '/images/ArcticMultipolarLegendFR.jpg',
  '/visualizations/canada-sphere-of-influence.html': '/visualizations/canada-sphere-of-influence-fr.html',
  // Maritime maps (raster, FR versions supplied by Peggy). The FR files have a
  // literal space before "FR" in their names — encode it as %20 so the browser
  // requests the right path; the static server decodes %20 back to the space.
  '/images/maritime_chokepoints_canadian_geopolitical_simplified.png': '/images/maritime_chokepoints_canadian_geopolitical_simplified%20FR.png',
  '/images/canadian_maritime_trade_corrected.png': '/images/canadian_maritime_trade_corrected%20FR.png',
};

/**
 * Resolve an asset path for the active language. Returns the French variant only
 * when (a) the language is French AND (b) a variant exists; otherwise returns the
 * original unchanged. Safe to call on undefined.
 */
export function frAsset(src: string | undefined, lang: string): string | undefined {
  if (!src || lang !== 'fr') return src;
  return FR_ASSETS[src] ?? src;
}
