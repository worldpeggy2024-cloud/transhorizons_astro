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

const REGISTRY = manifest as Record<string, Narration>;

/** Site slug as it appears in the URL, e.g. "resource-civilization". */
export function getArticleNarration(slug: string, lang: string): Narration | undefined {
  if (!slug) return undefined;
  const l = lang.toLowerCase().startsWith('fr') ? 'fr' : 'en';
  return REGISTRY[`articles/${slug}/${l}`];
}

/** Derive the slug from a detail-page pathname such as /portfolio/<slug>. */
export function slugFromPath(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  return parts.length ? parts[parts.length - 1] : '';
}
