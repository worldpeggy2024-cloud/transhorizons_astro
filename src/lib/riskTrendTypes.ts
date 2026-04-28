/**
 * TransHorizons — Risk Trend Analysis Types
 * Enables quarterly tracking of risk evolution, probability/impact changes, and mitigant effectiveness
 */

/**
 * Severity level for probability and impact ratings
 */
export type SeverityLevel = 'Low' | 'Med' | 'High';

/**
 * Quarterly snapshot of a single risk assessment
 * Captures how a risk's characteristics change over time
 */
export interface RiskQuarterlySnapshot {
  quarter: string; // Format: "Q1 2026", "Q2 2026", etc.
  date: string; // ISO date: "2026-03-31"
  probability: SeverityLevel;
  impact: SeverityLevel;
  trend: 'Increasing' | 'Stable' | 'Decreasing'; // How the risk is evolving
  activeIndicators: string[]; // Which leading indicators are currently present
  effectiveMitigants: string[]; // Which mitigants are proving effective
  notes: string; // Qualitative assessment of the quarter
}

/**
 * Historical trend data for a single risk
 * Allows tracking how risks evolve across multiple quarters
 */
export interface RiskTrendData {
  riskId: string; // Unique identifier for this risk
  title: string; // Risk title (must match current risk title)
  snapshots: RiskQuarterlySnapshot[]; // Historical snapshots, oldest first
  lastAssessment: string; // ISO date of most recent assessment
  assessmentFrequency: 'Quarterly' | 'Biannual' | 'Annual'; // How often assessed
}

/**
 * Enhanced risk entry with trend history
 * Extends the base RiskEntry with historical tracking
 */
export interface RiskEntryWithTrend {
  // Current risk data (from base RiskEntry)
  title: string;
  trigger: string;
  probability: SeverityLevel;
  impact: SeverityLevel;
  timeHorizon: string;
  leadingIndicators: string;
  mitigants: string;

  // Trend history (new)
  trendData?: RiskTrendData;
}

/**
 * Risk assessment metadata for a country
 * Tracks when assessments were conducted and by whom
 */
export interface RiskAssessmentMetadata {
  countryCode: string;
  assessmentDate: string; // ISO date
  assessmentPeriod: string; // e.g., "Q1 2026"
  assessor: string; // Name or identifier of person/team conducting assessment
  methodology: string; // Brief description of assessment methodology
  dataConfidence: 'High' | 'Med' | 'Low'; // Overall confidence in risk data
  nextAssessmentDate: string; // When next assessment is scheduled
}

/**
 * Severity level to numeric conversion for charting
 * Allows visualization of probability/impact trends
 */
export const severityToNumber = (level: SeverityLevel): number => {
  const map: Record<SeverityLevel, number> = {
    'Low': 1,
    'Med': 2,
    'High': 3,
  };
  return map[level];
};

/**
 * Numeric conversion to severity level
 */
export const numberToSeverity = (num: number): SeverityLevel => {
  if (num <= 1) return 'Low';
  if (num <= 2) return 'Med';
  return 'High';
};

/**
 * Calculate trend direction based on probability/impact changes
 */
export const calculateTrendDirection = (
  previousSnapshot: RiskQuarterlySnapshot | null,
  currentSnapshot: RiskQuarterlySnapshot
): 'Increasing' | 'Stable' | 'Decreasing' => {
  if (!previousSnapshot) return 'Stable';

  const prevScore = severityToNumber(previousSnapshot.probability) + severityToNumber(previousSnapshot.impact);
  const currScore = severityToNumber(currentSnapshot.probability) + severityToNumber(currentSnapshot.impact);

  if (currScore > prevScore) return 'Increasing';
  if (currScore < prevScore) return 'Decreasing';
  return 'Stable';
};

/**
 * Format quarter string for display
 * Input: "Q1 2026" → Output: "Q1 2026 (Jan-Mar)"
 */
export const formatQuarterDisplay = (quarter: string): string => {
  const quarterMonths: Record<string, string> = {
    'Q1': 'Jan-Mar',
    'Q2': 'Apr-Jun',
    'Q3': 'Jul-Sep',
    'Q4': 'Oct-Dec',
  };

  const [q, year] = quarter.split(' ');
  const months = quarterMonths[q] || '';
  return months ? `${quarter} (${months})` : quarter;
};

/**
 * Get color for trend visualization based on severity
 */
export const getSeverityColor = (level: SeverityLevel): string => {
  const colors: Record<SeverityLevel, string> = {
    'Low': '#22c55e', // green
    'Med': '#f59e0b', // amber
    'High': '#ef4444', // red
  };
  return colors[level];
};

/**
 * Get trend direction color for visualization
 */
export const getTrendColor = (trend: 'Increasing' | 'Stable' | 'Decreasing'): string => {
  const colors: Record<string, string> = {
    'Increasing': '#ef4444', // red
    'Stable': '#f59e0b', // amber
    'Decreasing': '#22c55e', // green
  };
  return colors[trend];
};
