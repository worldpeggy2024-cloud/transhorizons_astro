/**
 * Historical Timeline & Scenario Projection Types
 * Supports 20-year historical data (2006-2024) + 5-year extrapolation (2025-2031)
 * with scenario-based projections and uncertainty bands
 */

export type TimeGranularity = '5year' | 'yearly' | 'quarterly';
export type ScenarioType = 'base' | 'optimistic' | 'pessimistic';

export interface TimelineDataPoint {
  year: number;
  quarter?: number; // 1-4, only for quarterly granularity
  timestamp: string; // ISO format for sorting
}

export interface RiskScenarioValue {
  probability: number; // 0-100
  impact: number; // 0-100
  confidence: number; // 0-100, how certain we are of this projection
}

export interface CorrelationSnapshot {
  sourceCountry: string;
  destinationCountry: string;
  riskType: string; // e.g., "commodity-price", "capital-flow", "trade"
  
  // Historical data (2006-2024)
  historical: {
    date: TimelineDataPoint;
    strength: 'low' | 'medium' | 'high'; // Correlation strength at this point
    probability: number;
    impact: number;
    mechanism: string; // How the risk transmits
  }[];
  
  // Scenario projections (2025-2031)
  scenarios: {
    [key in ScenarioType]: {
      date: TimelineDataPoint;
      probability: RiskScenarioValue;
      impact: RiskScenarioValue;
      mechanism: string;
      assumptions: string[]; // What drives this scenario
    }[];
  };
  
  // Uncertainty bands (min/max across scenarios)
  uncertaintyBands: {
    date: TimelineDataPoint;
    probabilityMin: number;
    probabilityMax: number;
    impactMin: number;
    impactMax: number;
  }[];
}

export interface CountryHistoricalProfile {
  countryCode: string;
  countryName: string;
  
  // All correlations involving this country (as source or destination)
  correlations: CorrelationSnapshot[];
  
  // Timeline metadata
  timelineStart: number; // 2006
  timelineEnd: number; // 2031 (2024 historical + 7 years projection)
  
  // Key events that shaped risk landscape
  keyEvents: {
    year: number;
    title: string;
    description: string;
    affectedRisks: string[];
  }[];
}

export interface TimelineState {
  selectedYear: number;
  selectedQuarter?: number;
  selectedScenario: ScenarioType;
  granularity: TimeGranularity;
  showUncertaintyBands: boolean;
  showAllScenarios: boolean;
}

/**
 * Helper function to determine appropriate granularity based on year range
 */
export function getGranularityForYear(year: number): TimeGranularity {
  if (year < 2019) return '5year';
  if (year < 2025) return 'yearly';
  return 'quarterly';
}

/**
 * Helper to get display label for a data point
 */
export function getTimelineLabel(point: TimelineDataPoint): string {
  if (point.quarter) {
    return `Q${point.quarter} ${point.year}`;
  }
  return point.year.toString();
}

/**
 * Helper to calculate uncertainty range for display
 */
export function getUncertaintyRange(
  baseValue: number,
  confidence: number
): { min: number; max: number } {
  const uncertainty = (100 - confidence) * 0.5; // Wider bands for lower confidence
  return {
    min: Math.max(0, baseValue - uncertainty),
    max: Math.min(100, baseValue + uncertainty),
  };
}
