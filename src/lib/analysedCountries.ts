/**
 * TransHorizons — Analysed Countries Registry
 * Single source of truth: add a CCA3 code here whenever a new country
 * analysis is published. The badge in GlobeTeaser reads this list.
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
 * Two-phase-verified countries whose /country/<cca3> SSR page is allowed to emit a
 * crawlable SEO prose block. This is the "verified / two-phase" mechanism the
 * decision sheet calls for — kept SEPARATE from ANALYSED_COUNTRIES (which still,
 * for now, drives the globe "report available" marker; that marker flip is
 * deliberately deferred to the regeneration wave).
 *
 * GATE — add a CCA3 here ONLY after the country has been (a) regenerated through the
 * two-phase pipeline INTO the society-aware schema and (b) hand-proofed by Peggy.
 * Empty for now: Brazil is the schema/render/SSR pilot, but its society content is
 * still a PLACEHOLDER pending real two-phase research + proofing, so nothing is
 * exposed to crawlers yet. Once Brazil's society is real and proofed, add 'BRA'.
 */
export const SEO_READY_COUNTRIES: string[] = [];
