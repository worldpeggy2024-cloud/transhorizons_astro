/**
 * TransHorizons — Risk Correlation Matrix Types
 * Defines structures for tracking how risks interact and cascade across countries
 * Enables visualization of interconnected geopolitical and economic risks
 */

/**
 * Correlation strength between two risks
 */
export type CorrelationStrength = 'Strong' | 'Moderate' | 'Weak' | 'None';

/**
 * Direction of risk cascade
 */
export type CascadeDirection = 'Bidirectional' | 'Unidirectional' | 'Feedback';

/**
 * Mechanism by which risks correlate
 */
export type CorrelationMechanism = 
  | 'Trade' 
  | 'Commodity Prices' 
  | 'Capital Flows' 
  | 'Geopolitical' 
  | 'Supply Chain' 
  | 'Currency' 
  | 'Contagion' 
  | 'Policy Spillover';

/**
 * Single risk correlation between two countries
 */
export interface RiskCorrelation {
  sourceCountry: string; // CCA3 code (e.g., 'BRA')
  sourceRisk: string; // Risk title from source country
  targetCountry: string; // CCA3 code (e.g., 'AUS')
  targetRisk: string; // Risk title in target country
  strength: CorrelationStrength; // How strong is the correlation
  direction: CascadeDirection; // How does the risk flow
  mechanism: CorrelationMechanism; // What's the transmission channel
  description: string; // Human-readable explanation of the correlation
  timeframe: string; // e.g., "3-6 months", "Immediate", "12+ months"
  mitigationOptions: string[]; // Possible ways to break the correlation
}

/**
 * Correlation matrix for a specific country
 * Shows how risks in this country affect others
 */
export interface CountryRiskCorrelationMatrix {
  countryCode: string;
  countryName: string;
  correlations: RiskCorrelation[];
  lastUpdated: string; // ISO date
}

/**
 * Global risk correlation network
 * Shows all correlations across all analyzed countries
 */
export interface GlobalRiskCorrelationNetwork {
  countries: string[]; // List of CCA3 codes
  correlations: RiskCorrelation[];
  clusteringAnalysis?: {
    clusters: string[][]; // Groups of countries with highly correlated risks
    clusterName: string;
    description: string;
  }[];
  criticalPathways: {
    name: string;
    description: string;
    risks: string[]; // Sequence of risks that could cascade
    probability: 'Low' | 'Med' | 'High';
  }[];
  lastUpdated: string; // ISO date
}

/**
 * Severity level for correlation visualization
 */
export const getCorrelationColor = (strength: CorrelationStrength): string => {
  const colors: Record<CorrelationStrength, string> = {
    'Strong': '#ef4444', // red
    'Moderate': '#f59e0b', // amber
    'Weak': '#fbbf24', // light amber
    'None': '#d1d5db', // gray
  };
  return colors[strength];
};

/**
 * Get direction indicator for visualization
 */
export const getDirectionArrow = (direction: CascadeDirection): string => {
  const arrows: Record<CascadeDirection, string> = {
    'Unidirectional': '→',
    'Bidirectional': '↔',
    'Feedback': '⟲',
  };
  return arrows[direction];
};

/**
 * Get mechanism icon/label for visualization
 */
export const getMechanismLabel = (mechanism: CorrelationMechanism): string => {
  const labels: Record<CorrelationMechanism, string> = {
    'Trade': '📦 Trade',
    'Commodity Prices': '📈 Commodities',
    'Capital Flows': '💰 Capital',
    'Geopolitical': '🌍 Geopolitical',
    'Supply Chain': '🔗 Supply Chain',
    'Currency': '💱 Currency',
    'Contagion': '🦠 Contagion',
    'Policy Spillover': '📋 Policy',
  };
  return labels[mechanism];
};
