/**
 * TransHorizons — Analysed Countries Registry
 *
 * LEGACY INVENTORY: countries that have an analysis page at all (mostly
 * single-phase, pre-regeneration content). As of 2026-07-11 this list NO
 * LONGER drives the globe "report available" marker or the GlobeTeaser
 * count — those now read SEO_READY_COUNTRIES below, so the marker tells
 * the truth and grows one country at a time as reports are regenerated
 * and proofed.
 */
export const ANALYSED_COUNTRIES: string[] = [
  'FRA', // France
  'CAN', // Canada
  'USA', // United States
  'CHN', // China
  'RUS', // Russia
  'JPN', // Japan
  'KOR', // South Korea
  'IRL', // Ireland
  'AUS', // Australia
  'BRA', // Brazil
  'DEU', // Germany
  'GBR', // United Kingdom
  'MEX', // Mexico
  'IND', // India
  'SAU', // Saudi Arabia
  'NZL', // New Zealand
  'IDN', // Indonesia
  'SGP', // Singapore
  'VNM', // Vietnam
  'CHL', // Chile
  'HTI', // Haiti
  'TUR', // Turkey
  'ZAF', // South Africa
  'COD', // Democratic Republic of the Congo (Kinshasa)
  'POL', // Poland
  'UKR', // Ukraine
];

export const ANALYSED_COUNT = ANALYSED_COUNTRIES.length;

/**
 * Two-phase-verified countries. Drives THREE things: (a) the /country/<cca3>
 * SSR page's crawlable SEO prose block, (b) the sitemap's country entries, and
 * (c) — since 2026-07-11 — the globe "report available" marker and the
 * GlobeTeaser count (the truth-telling flip the decision sheet §3c called for).
 *
 * GATE — add a CCA3 here ONLY after the country has been (a) regenerated through the
 * two-phase pipeline INTO the six-peer schema and (b) hand-proofed by Peggy.
 *
 * CAN opened 2026-07-11: full six-peer rebuild (territory/capacity/substrate incl.),
 * proofed by Peggy, EN + FR. Brazil stays closed (society still PLACEHOLDER).
 */
export const SEO_READY_COUNTRIES: string[] = ['CAN'];
