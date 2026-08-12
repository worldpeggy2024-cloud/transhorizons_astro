import type { APIRoute } from 'astro';
import { SEO_READY_COUNTRIES } from '../lib/analysedCountries';

// Static sitemap of the pages that are READY to be indexed. Deliberately excludes:
//  - /publications and the unproofread articles (ai-governance, critical-minerals,
//    canada-forest-carbon) — not yet ready in EN/FR (still reachable, just not submitted);
//  - the empty client-only shells (world-analysis, tools/critical-minerals-map,
//    canada-resources, canada-forest-system…) until they get an SSR .astro twin (P2);
//  - country pages NOT yet in SEO_READY_COUNTRIES (exposed per country once
//    two-phase-regenerated and proofed; the /country/<cca3> SEO div embeds BOTH
//    languages at one URL, so each is listed once with no alternates).
// Add entries here as content is finalized.
//
// `fr: true` => the page has a distinct French version at ?lang=fr (SSR), so we emit
// hreflang alternates. The index/about pages embed BOTH languages at one URL, so they
// are listed once with no alternates.
export const prerender = true;

const pages: { path: string; fr?: boolean }[] = [
  { path: '/' },
  { path: '/about' },
  { path: '/analyses' },
  { path: '/notes' },
  { path: '/research-approach' },
  { path: '/portfolio/canada-multipolar', fr: true },
  { path: '/portfolio/resource-civilization', fr: true },
  { path: '/notes/career-evolution', fr: true },
  { path: '/notes/travel-observation', fr: true },
  // Country situation reports — gated by SEO_READY_COUNTRIES (currently: CAN, USA).
  ...SEO_READY_COUNTRIES.map((c) => ({ path: `/country/${c}` })),
];

export const GET: APIRoute = (context) => {
  // Origin from astro.config `site` (single source of truth); strip trailing slash.
  const SITE = context.site ? context.site.href.replace(/\/$/, '') : 'https://transhorizons.net';
  const body = pages
    .map(({ path, fr }) => {
      const loc = `${SITE}${path}`;
      if (!fr) return `  <url><loc>${loc}</loc></url>`;
      const en = loc;
      const frUrl = `${loc}?lang=fr`;
      return [
        '  <url>',
        `    <loc>${en}</loc>`,
        `    <xhtml:link rel="alternate" hreflang="en" href="${en}" />`,
        `    <xhtml:link rel="alternate" hreflang="fr" href="${frUrl}" />`,
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${en}" />`,
        '  </url>',
      ].join('\n');
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${body}
</urlset>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
