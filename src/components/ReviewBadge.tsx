/*
 * ReviewBadge — marks a piece that is published but not yet finalised.
 *
 * Visually a sibling of the "Coming Soon" badge (same corner, same typography),
 * because it says a related thing about status. But deliberately WEAKER: no
 * grayscale on the image, no disabled click, lighter ground. "Coming Soon"
 * means there is nothing to read; this means there is, and it is a draft.
 * Stopping the reader would be the wrong trade — the point is honesty about
 * state, not gatekeeping.
 */

import { isInReview, reviewLabel } from '../lib/articleStatus';

export default function ReviewBadge({ slug, lang, variant = 'overlay' }: {
  slug?: string;
  lang: string;
  /** 'overlay' sits on a card image; 'inline' sits in a row of chips. */
  variant?: 'overlay' | 'inline';
}) {
  if (!isInReview(slug)) return null;

  const label = reviewLabel(lang);

  if (variant === 'inline') {
    return (
      <span className="inline-block border border-[#C9A227] text-[#8A6D0B] text-[9px] tracking-[0.18em] uppercase font-medium font-body px-2 py-0.5">
        {label}
      </span>
    );
  }

  /*
   * z-10 is load-bearing: .img-zoom:hover scales the <img>, and a transform
   * creates a stacking context, so without an explicit z-index the growing
   * image paints straight over the badge and it vanishes exactly when the
   * reader is paying attention to the card.
   *
   * Hover strengthens it rather than hiding it — the status matters most at
   * the moment someone is deciding whether to click through.
   */
  return (
    <span className="absolute top-3 left-3 z-10 origin-top-left bg-white/85 text-[#8A6D0B] border border-[#C9A227]/60 text-[9px] tracking-[0.18em] uppercase font-medium font-body px-2.5 py-1 backdrop-blur-[2px] transition-all duration-300 group-hover:scale-110 group-hover:bg-white group-hover:border-[#C9A227] group-hover:shadow-sm">
      {label}
    </span>
  );
}
