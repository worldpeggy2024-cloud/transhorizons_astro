/*
 * DraftWatermark — a real watermark across an unfinished article.
 *
 * A corner chip is easy to miss once someone has started reading; a watermark
 * travels with the text and cannot be mistaken for decoration. It is drawn as a
 * tiled SVG background rather than repeated DOM nodes: one element, no layout
 * cost, and it scrolls with the content it describes.
 *
 * Deliberately faint. It must be legible enough to answer "is this finished?"
 * and light enough not to fight the prose — this marks a draft that is meant to
 * be read, not a document withheld.
 *
 * pointer-events-none throughout, so it never intercepts a click, a selection,
 * or a link. aria-hidden because the banner above the article says the same
 * thing in words, and a screen reader should hear it once.
 */

import { isInReview, reviewLabel, reviewNote } from '../lib/articleStatus';

export default function DraftWatermark({ slug, lang, label: labelOverride, active }: {
  slug?: string;
  lang: string;
  /** Override the wording — country reports say "Not updated", not "Draft". */
  label?: string;
  /** Force on/off instead of deriving it from the article slug. */
  active?: boolean;
}) {
  const on = active ?? isInReview(slug);
  if (!on) return null;

  const label = (labelOverride ?? reviewLabel(lang)).toUpperCase();

  // One tile: the word drawn twice on a diagonal, offset so the repeat reads as
  // a continuous field rather than obvious rows.
  /*
   * ONE word per tile, centred, with the tile sized from the word itself.
   *
   * Two words at fixed offsets in a fixed-size tile clipped the second one at
   * the tile edge, so every repeat showed a truncated word ("BROUIL", "NOT UP").
   * Deriving the tile from the label's rotated bounding box means it always
   * contains the word whole, whatever the wording or its length.
   *
   * Opacity is the dial if this ever fights the prose: readable at a glance,
   * ignorable while actually reading.
   */
  const FONT = 44;
  const TRACK = 7;          // letter-spacing
  const ANGLE = 24;         // degrees, anticlockwise
  const GAP = 90;           // clear space between repeats

  const rad = (ANGLE * Math.PI) / 180;
  // Georgia's caps average ~0.62em wide; close enough to size a background tile.
  const textW = label.length * (FONT * 0.62 + TRACK);
  const boxW = textW * Math.cos(rad) + FONT * Math.sin(rad);
  const boxH = textW * Math.sin(rad) + FONT * Math.cos(rad);
  const w = Math.ceil(boxW + GAP);
  const h = Math.ceil(boxH + GAP);

  const tile = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
       <text x="${w / 2}" y="${h / 2}" transform="rotate(-${ANGLE} ${w / 2} ${h / 2})"
             text-anchor="middle" dominant-baseline="central"
             fill="#8A6D0B" fill-opacity="0.16"
             font-family="Georgia, 'Times New Roman', serif"
             font-size="${FONT}" font-weight="700" letter-spacing="${TRACK}">${label}</text>
     </svg>`.replace(/\s+/g, ' ')
  );

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 select-none"
      style={{
        backgroundImage: `url("data:image/svg+xml,${tile}")`,
        backgroundRepeat: 'repeat',
      }}
    />
  );
}

/** The same status in words, for the top of the article or report. */
export function DraftBanner({ slug, lang, label, note, active }: {
  slug?: string;
  lang: string;
  label?: string;
  note?: string;
  active?: boolean;
}) {
  const on = active ?? isInReview(slug);
  if (!on) return null;

  return (
    <div className="mb-10 border-l-2 border-[#C9A227] bg-[#C9A227]/10 px-5 py-3">
      <p className="font-body text-[13px] leading-relaxed text-[#6B5408]">
        <span className="tracking-[0.18em] uppercase text-[11px] font-medium mr-2">
          {label ?? reviewLabel(lang)}
        </span>
        {note ?? reviewNote(lang)}
      </p>
    </div>
  );
}
