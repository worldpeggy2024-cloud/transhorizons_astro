/**
 * Splits a "Sources & Notes" line into text and URL parts so the list can render
 * clickable links. Shared by ProjectDetailLayout.tsx (React visual layer) and
 * ArticleSeoFallback.astro (crawlable + old-browser view) so both renderers link
 * a line the same way.
 *
 * Source lines stay plain strings (Keystatic `sources.en` / `sources.fr` are text
 * arrays) — a URL is simply written into the line, so there is no schema field to
 * extend and nothing for a Keystatic save to strip.
 */
export interface SourcePart {
  text: string;
  href?: string;
}

const URL_RE = /https?:\/\/[^\s<>"]+/g;

export function splitSourceLine(line: string): SourcePart[] {
  const parts: SourcePart[] = [];
  let last = 0;
  for (const m of line.matchAll(URL_RE)) {
    const start = m.index ?? 0;
    // A full stop or closing bracket after a URL belongs to the sentence, not the link.
    const href = m[0].replace(/[.,;:)\]]+$/, '');
    if (start > last) parts.push({ text: line.slice(last, start) });
    parts.push({ text: href, href });
    last = start + href.length;
  }
  if (last < line.length) parts.push({ text: line.slice(last) });
  return parts;
}
