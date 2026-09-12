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
  '/images/CanadaPositionEn.png': '/images/CanadaPositionFR.png',
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
