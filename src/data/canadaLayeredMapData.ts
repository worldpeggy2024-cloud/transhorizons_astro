

export interface RiskCard {
  sourceCountry: string;
  sourceCountryCode: string;
  riskName: string;
  riskCategory: 'environmental' | 'political' | 'cybersecurity' | 'social' | 'technological';
  correlation: 'strong' | 'moderate' | 'weak';
  confidence: number;
  timeframe: string;
  position: { x: number; y: number };
}

// Geographic positions on map (percentage-based)
// Left side = source countries, Center = Canada
const CANADA_CENTER = { x: 65, y: 50 };
const BRAZIL_POS = { x: 25, y: 65 };
const USA_POS = { x: 40, y: 35 };
const CHINA_POS = { x: 85, y: 30 };
const GLOBAL_POS = { x: 50, y: 15 };

export const canadaRisksData: Record<string, RiskCard[]> = {
  '2024': [
    {
      sourceCountry: 'Brazil',
      sourceCountryCode: 'BRA',
      riskName: 'Commodity Price Volatility',
      riskCategory: 'environmental',
      correlation: 'strong',
      confidence: 85,
      timeframe: 'Q3 2024 - Q2 2025',
      position: BRAZIL_POS,
    },
    {
      sourceCountry: 'USA',
      sourceCountryCode: 'USA',
      riskName: 'Trade Policy Shifts',
      riskCategory: 'political',
      correlation: 'strong',
      confidence: 90,
      timeframe: 'Ongoing - Long-term',
      position: USA_POS,
    },
    {
      sourceCountry: 'China',
      sourceCountryCode: 'CHN',
      riskName: 'Geopolitical Tensions',
      riskCategory: 'political',
      correlation: 'moderate',
      confidence: 75,
      timeframe: 'Q1 2024 - Q4 2025',
      position: CHINA_POS,
    },
    {
      sourceCountry: 'Global',
      sourceCountryCode: 'GLB',
      riskName: 'Supply Chain Disruption',
      riskCategory: 'technological',
      correlation: 'moderate',
      confidence: 70,
      timeframe: 'Immediate - Medium-term',
      position: GLOBAL_POS,
    },
  ],
  '2025': [
    {
      sourceCountry: 'Brazil',
      sourceCountryCode: 'BRA',
      riskName: 'Fiscal Crisis Impact',
      riskCategory: 'political',
      correlation: 'strong',
      confidence: 80,
      timeframe: 'Q1 2025 - Q3 2026',
      position: BRAZIL_POS,
    },
    {
      sourceCountry: 'USA',
      sourceCountryCode: 'USA',
      riskName: 'Trade War Escalation',
      riskCategory: 'political',
      correlation: 'strong',
      confidence: 85,
      timeframe: 'Q2 2025 - Q1 2026',
      position: USA_POS,
    },
    {
      sourceCountry: 'China',
      sourceCountryCode: 'CHN',
      riskName: 'Tech Sector Restrictions',
      riskCategory: 'cybersecurity',
      correlation: 'moderate',
      confidence: 72,
      timeframe: 'Q1 2025 - Q4 2026',
      position: CHINA_POS,
    },
    {
      sourceCountry: 'Global',
      sourceCountryCode: 'GLB',
      riskName: 'Climate-Related Supply Shocks',
      riskCategory: 'environmental',
      correlation: 'weak',
      confidence: 65,
      timeframe: 'Seasonal - Ongoing',
      position: GLOBAL_POS,
    },
  ],
  '2026': [
    {
      sourceCountry: 'Brazil',
      sourceCountryCode: 'BRA',
      riskName: 'Mining Sector Contraction',
      riskCategory: 'political',
      correlation: 'moderate',
      confidence: 70,
      timeframe: 'Q1 2026 - Q2 2027',
      position: BRAZIL_POS,
    },
    {
      sourceCountry: 'USA',
      sourceCountryCode: 'USA',
      riskName: 'Energy Market Volatility',
      riskCategory: 'environmental',
      correlation: 'strong',
      confidence: 82,
      timeframe: 'Q1 2026 - Q4 2026',
      position: USA_POS,
    },
    {
      sourceCountry: 'China',
      sourceCountryCode: 'CHN',
      riskName: 'Critical Minerals Competition',
      riskCategory: 'political',
      correlation: 'strong',
      confidence: 88,
      timeframe: 'Q2 2026 - Q1 2027',
      position: CHINA_POS,
    },
    {
      sourceCountry: 'Global',
      sourceCountryCode: 'GLB',
      riskName: 'Cybersecurity Incidents',
      riskCategory: 'cybersecurity',
      correlation: 'moderate',
      confidence: 68,
      timeframe: 'Ongoing - Unpredictable',
      position: GLOBAL_POS,
    },
  ],
};

export function getCanadaRisksForYear(year: number): RiskCard[] {
  return canadaRisksData[year.toString()] || canadaRisksData['2024'];
}

export function getCanadaRisksForScenario(
  year: number,
  scenario: 'base' | 'optimistic' | 'pessimistic'
): RiskCard[] {
  const baseRisks = getCanadaRisksForYear(year);

  if (scenario === 'optimistic') {
    return baseRisks.map((risk) => ({
      ...risk,
      correlation: risk.correlation === 'strong' ? 'moderate' : risk.correlation === 'moderate' ? 'weak' : 'weak',
      confidence: Math.max(risk.confidence - 15, 30),
    }));
  }

  if (scenario === 'pessimistic') {
    return baseRisks.map((risk) => ({
      ...risk,
      correlation: risk.correlation === 'weak' ? 'moderate' : risk.correlation === 'moderate' ? 'strong' : 'strong',
      confidence: Math.min(risk.confidence + 15, 95),
    }));
  }

  return baseRisks;
}
