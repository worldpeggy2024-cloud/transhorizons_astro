/*
 * narrationAudio — does a published recording exist for this piece?
 *
 * src/data/narrationManifest.json is written by scripts/stage-audio.cjs and
 * lists only what has been staged into public/audio, which in turn is only what
 * has been approved. An absent entry is the normal case, not an error: the
 * player then falls back to Web Speech, which always reads the current text.
 *
 * That fallback is the point. A recording is a snapshot; the page is live. When
 * there is no recording — not yet made, not approved, deliberately withheld —
 * the listener still hears the piece, just synthesised in the browser.
 */
import manifest from '../data/narrationManifest.json';

export interface Narration {
  src: string;
  voice: string;
  seconds: number;
}

/*
 * A COUNTRY REPORT is one recording per section, played as a single timeline.
 * The split is not cosmetic: sections are generated, approved and re-generated
 * independently, so a fix to one section must not invalidate the rest.
 */
export interface NarrationSection {
  id: string;
  label: string;
  src: string;
  seconds: number;
}

export interface CountryNarration {
  voice: string;
  seconds: number;              // the whole report
  sections: NarrationSection[]; // in report order (01-, 02-, …)
}

const REGISTRY = manifest as Record<string, Narration | CountryNarration>;

const isCountry = (v: unknown): v is CountryNarration =>
  !!v && Array.isArray((v as CountryNarration).sections);

/** Site slug as it appears in the URL, e.g. "resource-civilization". */
export function getArticleNarration(slug: string, lang: string): Narration | undefined {
  if (!slug) return undefined;
  const l = lang.toLowerCase().startsWith('fr') ? 'fr' : 'en';
  const found = REGISTRY[`articles/${slug}/${l}`];
  return found && !isCountry(found) ? found : undefined;
}

/** ISO3 country code as used in the URL, e.g. "CAN" from /country/CAN. */
export function getCountryNarration(cca3: string, lang: string): CountryNarration | undefined {
  if (!cca3) return undefined;
  const l = lang.toLowerCase().startsWith('fr') ? 'fr' : 'en';
  const found = REGISTRY[`countries/${cca3.toUpperCase()}/${l}`];
  return isCountry(found) ? found : undefined;
}

/** Derive the slug from a detail-page pathname such as /portfolio/<slug>. */
export function slugFromPath(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  return parts.length ? parts[parts.length - 1] : '';
}
