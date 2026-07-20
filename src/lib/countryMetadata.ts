/**
 * TransHorizons — Country Metadata
 * Metadata for filtering: region, risk category, and analysis topics
 * Used for search/filter on World Analysis page
 */

export interface CountryMetadata {
  cca3: string;
  region: 'North America' | 'South America' | 'Europe' | 'Africa' | 'Middle East' | 'Asia-Pacific';
  /**
   * LEGACY-UNUSED since 2026-07-19 (author decision): the risk-level filter
   * facet was removed — the tri-level label was a Manus-era recycling of the
   * correlation-matrix labels and no UI reads this field any more. Values are
   * hand-set Manus-era assignments EXCEPT where a comment says derived
   * (CAN, BRA). Retained while the risk-notion study (aggregate level,
   * Layer-2 framing, correlations) is open; delete or repopulate when it
   * concludes.
   */
  riskCategory: 'High' | 'Medium' | 'Low';
  topics: ('Geopolitics' | 'Resources' | 'Technology')[];
}

export const COUNTRY_METADATA: Record<string, CountryMetadata> = {
  // ── North America ──
  CAN: {
    cca3: 'CAN',
    region: 'North America',
    // Derived by rule (not hand-assigned) via deriveRiskLevel() from CAN's own
    // two-phase risk register: "Permanent US Tariff Lock-In and CUSMA Erosion"
    // is High probability × High impact → High. (Was hand-set 'Low' pre-rebuild.)
    riskCategory: 'High',
    topics: ['Geopolitics', 'Resources', 'Technology'],
  },
  USA: {
    cca3: 'USA',
    region: 'North America',
    riskCategory: 'Medium',
    topics: ['Geopolitics', 'Technology'],
  },
  MEX: {
    cca3: 'MEX',
    region: 'North America',
    riskCategory: 'High',
    topics: ['Geopolitics', 'Resources'],
  },

  // ── South America ──
  BRA: {
    cca3: 'BRA',
    region: 'South America',
    // Derived by rule (not hand-assigned) via deriveRiskLevel() from BRA's own
    // risk register: "Electoral polarization and post-election institutional
    // stress" is High probability × High impact → High. (Programmatic stamping
    // across all countries is part of the regeneration wave.)
    riskCategory: 'High',
    topics: ['Geopolitics', 'Resources'],
  },
  CHL: {
    cca3: 'CHL',
    region: 'South America',
    riskCategory: 'Low',
    topics: ['Resources', 'Technology'],
  },
  HTI: {
    cca3: 'HTI',
    region: 'South America',
    riskCategory: 'High',
    topics: ['Geopolitics'],
  },

  // ── Europe ──
  FRA: {
    cca3: 'FRA',
    region: 'Europe',
    riskCategory: 'Low',
    topics: ['Geopolitics', 'Technology'],
  },
  DEU: {
    cca3: 'DEU',
    region: 'Europe',
    riskCategory: 'Low',
    topics: ['Geopolitics', 'Technology', 'Resources'],
  },
  GBR: {
    cca3: 'GBR',
    region: 'Europe',
    riskCategory: 'Low',
    topics: ['Geopolitics', 'Technology'],
  },
  IRL: {
    cca3: 'IRL',
    region: 'Europe',
    riskCategory: 'Low',
    topics: ['Technology'],
  },
  POL: {
    cca3: 'POL',
    region: 'Europe',
    riskCategory: 'Medium',
    topics: ['Geopolitics', 'Resources'],
  },
  UKR: {
    cca3: 'UKR',
    region: 'Europe',
    riskCategory: 'High',
    topics: ['Geopolitics', 'Resources'],
  },
  TUR: {
    cca3: 'TUR',
    region: 'Europe',
    riskCategory: 'Medium',
    topics: ['Geopolitics', 'Resources'],
  },

  // ── Africa ──
  ZAF: {
    cca3: 'ZAF',
    region: 'Africa',
    riskCategory: 'Medium',
    topics: ['Geopolitics', 'Resources', 'Technology'],
  },
  COD: {
    cca3: 'COD',
    region: 'Africa',
    riskCategory: 'High',
    topics: ['Resources', 'Geopolitics'],
  },

  // ── Middle East ──
  SAU: {
    cca3: 'SAU',
    region: 'Middle East',
    riskCategory: 'Medium',
    topics: ['Geopolitics', 'Resources'],
  },

  // ── Asia-Pacific ──
  CHN: {
    cca3: 'CHN',
    region: 'Asia-Pacific',
    riskCategory: 'High',
    topics: ['Geopolitics', 'Technology', 'Resources'],
  },
  RUS: {
    cca3: 'RUS',
    region: 'Asia-Pacific',
    riskCategory: 'High',
    topics: ['Geopolitics', 'Resources'],
  },
  JPN: {
    cca3: 'JPN',
    region: 'Asia-Pacific',
    riskCategory: 'Low',
    topics: ['Technology', 'Geopolitics'],
  },
  KOR: {
    cca3: 'KOR',
    region: 'Asia-Pacific',
    riskCategory: 'Low',
    topics: ['Technology', 'Geopolitics'],
  },
  IND: {
    cca3: 'IND',
    region: 'Asia-Pacific',
    riskCategory: 'Medium',
    topics: ['Geopolitics', 'Resources', 'Technology'],
  },
  AUS: {
    cca3: 'AUS',
    region: 'Asia-Pacific',
    riskCategory: 'Low',
    topics: ['Geopolitics', 'Resources'],
  },
  NZL: {
    cca3: 'NZL',
    region: 'Asia-Pacific',
    riskCategory: 'Low',
    topics: ['Geopolitics'],
  },
  IDN: {
    cca3: 'IDN',
    region: 'Asia-Pacific',
    riskCategory: 'Medium',
    topics: ['Geopolitics', 'Resources'],
  },
  SGP: {
    cca3: 'SGP',
    region: 'Asia-Pacific',
    riskCategory: 'Low',
    topics: ['Technology', 'Geopolitics'],
  },
  VNM: {
    cca3: 'VNM',
    region: 'Asia-Pacific',
    riskCategory: 'Medium',
    topics: ['Geopolitics', 'Technology', 'Resources'],
  },
};

export const REGIONS = [
  'North America',
  'South America',
  'Europe',
  'Africa',
  'Middle East',
  'Asia-Pacific',
] as const;

// RISK_CATEGORIES export removed 2026-07-19 with the filter facet (no consumers).

export const TOPICS = ['Geopolitics', 'Resources', 'Technology'] as const;
