/**
 * TransHorizons — Global Risk Correlation Network
 * Defines how risks cascade and interact across analyzed countries
 * Shows transmission channels and mitigation strategies
 */

import type { RiskCorrelation } from '@/lib/riskCorrelationTypes';

export const globalRiskCorrelations: RiskCorrelation[] = [
  // Brazil → Australia (Commodity Price Channel)
  {
    sourceCountry: 'BRA',
    sourceRisk: 'Fiscal Crisis & Debt Spiral',
    targetCountry: 'AUS',
    targetRisk: 'Commodity Price Volatility & Export Dependency',
    strength: 'Strong',
    direction: 'Unidirectional',
    mechanism: 'Commodity Prices',
    description: 'Brazil\'s fiscal crisis forces currency devaluation and austerity, reducing commodity demand and driving global commodity prices down. Australia\'s economy, heavily dependent on iron ore and agricultural exports, suffers revenue collapse and fiscal pressure.',
    timeframe: '3-6 months',
    mitigationOptions: [
      'Diversify export markets and commodity types',
      'Build sovereign wealth fund buffers',
      'Coordinate regional commodity price stabilization',
      'Invest in value-added processing to reduce price sensitivity',
    ],
  },

  // Brazil → Ireland (Tech Investment Channel)
  {
    sourceCountry: 'BRA',
    sourceRisk: 'Currency Crisis & Capital Flight',
    targetCountry: 'IRL',
    targetRisk: 'Tech Sector Volatility & Data Center Concentration',
    strength: 'Moderate',
    direction: 'Unidirectional',
    mechanism: 'Capital Flows',
    description: 'Brazilian capital flight and currency collapse trigger emerging market risk-off sentiment globally. Tech investors reduce exposure to all emerging markets and redirect capital away from growth-stage investments, affecting Ireland\'s tech sector growth prospects.',
    timeframe: '1-3 months',
    mitigationOptions: [
      'Strengthen Ireland\'s EU financial integration',
      'Diversify tech investor base beyond emerging market funds',
      'Maintain strong regulatory environment to attract stable capital',
      'Develop domestic venture capital ecosystem',
    ],
  },

  // Brazil → Canada (Commodity & Currency Channel)
  {
    sourceCountry: 'BRA',
    sourceRisk: 'Electoral Polarization & Institutional Breakdown',
    targetCountry: 'CAN',
    targetRisk: 'Commodity Price Volatility & Export Dependency',
    strength: 'Moderate',
    direction: 'Unidirectional',
    mechanism: 'Commodity Prices',
    description: 'Brazil\'s electoral crisis creates policy uncertainty, delaying commodity supply decisions and infrastructure investments. This uncertainty cascades to global commodity markets, affecting Canada\'s mining and energy export revenues.',
    timeframe: '6-12 months',
    mitigationOptions: [
      'Strengthen Canadian commodity market hedging strategies',
      'Diversify export destinations away from commodity-dependent regions',
      'Invest in renewable energy transition to reduce commodity dependency',
      'Build strategic commodity reserves',
    ],
  },

  // Australia → China (Trade & Geopolitical Channel)
  {
    sourceCountry: 'AUS',
    sourceRisk: 'US-China Strategic Competition & Trade Restrictions',
    targetCountry: 'CHN',
    targetRisk: 'Economic Slowdown & Export Pressure',
    strength: 'Strong',
    direction: 'Bidirectional',
    mechanism: 'Trade',
    description: 'Australia\'s strategic alignment with US and China tensions create trade retaliation cycles. China restricts Australian commodity imports; Australia faces revenue collapse. China\'s export markets shrink as US-China trade war intensifies, creating feedback loop.',
    timeframe: 'Immediate',
    mitigationOptions: [
      'Diversify commodity export markets beyond China',
      'Strengthen regional trade partnerships (ASEAN, Japan)',
      'Develop domestic processing capabilities',
      'Coordinate with allies on supply chain resilience',
    ],
  },

  // China → Canada (Supply Chain & Tech Channel)
  {
    sourceCountry: 'CHN',
    sourceRisk: 'Economic Slowdown & Export Pressure',
    targetCountry: 'CAN',
    targetRisk: 'Commodity Price Volatility & Export Dependency',
    strength: 'Strong',
    direction: 'Unidirectional',
    mechanism: 'Supply Chain',
    description: 'Chinese economic slowdown reduces demand for Canadian commodities (oil, minerals, agricultural products). Commodity prices collapse, triggering Canadian fiscal pressure and currency weakness.',
    timeframe: '3-6 months',
    mitigationOptions: [
      'Diversify commodity export destinations',
      'Accelerate energy transition to reduce oil export dependency',
      'Strengthen trade relationships with EU and India',
      'Develop critical minerals processing capacity',
    ],
  },

  // Ireland → EU (Financial & Policy Channel)
  {
    sourceCountry: 'IRL',
    sourceRisk: 'Data Center Energy Crisis & Grid Collapse',
    targetCountry: 'FRA',
    targetRisk: 'Energy Security & Nuclear Dependency',
    strength: 'Moderate',
    direction: 'Unidirectional',
    mechanism: 'Policy Spillover',
    description: 'Ireland\'s data center energy crisis triggers EU-wide energy regulation tightening. France faces increased pressure to expand nuclear capacity to support EU energy demand, accelerating policy changes that affect French energy sector.',
    timeframe: '6-12 months',
    mitigationOptions: [
      'Coordinate EU energy policy to balance growth and sustainability',
      'Invest in renewable energy infrastructure across EU',
      'Develop interconnected energy grids',
      'Create EU-wide energy reserve mechanisms',
    ],
  },

  // France → EU (Political Contagion Channel)
  {
    sourceCountry: 'FRA',
    sourceRisk: 'Far-Right Electoral Surge & EU Integration Crisis',
    targetCountry: 'IRL',
    targetRisk: 'EU Political Instability & Regulatory Uncertainty',
    strength: 'Moderate',
    direction: 'Unidirectional',
    mechanism: 'Geopolitical',
    description: 'Far-right electoral success in France creates EU political instability and threatens EU integration. Ireland, dependent on EU regulatory framework and single market access, faces regulatory uncertainty and potential policy reversals.',
    timeframe: '12+ months',
    mitigationOptions: [
      'Strengthen EU institutional resilience',
      'Diversify Ireland\'s trade relationships beyond EU',
      'Maintain strong Ireland-UK relationships as alternative',
      'Build cross-party EU political consensus on key policies',
    ],
  },

  // Canada → US (Geopolitical & Trade Channel)
  {
    sourceCountry: 'CAN',
    sourceRisk: 'US Trade Protectionism & USMCA Renegotiation',
    targetCountry: 'USA',
    targetRisk: 'Manufacturing Competitiveness & Supply Chain Disruption',
    strength: 'Strong',
    direction: 'Bidirectional',
    mechanism: 'Trade',
    description: 'Canadian trade vulnerabilities to US protectionism create supply chain disruptions for US manufacturers. US manufacturers face component shortages and cost increases, reducing competitiveness. Retaliatory measures escalate tensions.',
    timeframe: 'Immediate',
    mitigationOptions: [
      'Negotiate USMCA framework strengthening',
      'Develop North American supply chain resilience',
      'Diversify trade partnerships',
      'Invest in critical supply chain redundancy',
    ],
  },

  // Brazil → Global (Contagion Channel)
  {
    sourceCountry: 'BRA',
    sourceRisk: 'Criminal Violence Escalation & Gang Territorial Expansion',
    targetCountry: 'AUS',
    targetRisk: 'Transnational Organized Crime & Drug Trafficking',
    strength: 'Weak',
    direction: 'Unidirectional',
    mechanism: 'Contagion',
    description: 'Brazilian criminal organizations (PCC, CV) expand international operations and establish supply chains through Pacific routes. Australian law enforcement faces increased transnational crime pressure and drug trafficking.',
    timeframe: '12+ months',
    mitigationOptions: [
      'Strengthen international law enforcement cooperation',
      'Enhance border security and port monitoring',
      'Support Brazilian security sector reform',
      'Coordinate regional anti-trafficking strategies',
    ],
  },

  // Australia → Global (Environmental Channel)
  {
    sourceCountry: 'AUS',
    sourceRisk: 'Climate Extremes & Agricultural Collapse',
    targetCountry: 'CAN',
    targetRisk: 'Climate Adaptation & Agricultural Volatility',
    strength: 'Moderate',
    direction: 'Unidirectional',
    mechanism: 'Contagion',
    description: 'Australian climate extremes and agricultural collapse reduce global food supply, driving prices up. Canada faces increased agricultural volatility and pressure to increase exports, straining domestic food security.',
    timeframe: '6-12 months',
    mitigationOptions: [
      'Diversify agricultural production systems',
      'Invest in climate-resilient crop varieties',
      'Build strategic food reserves',
      'Strengthen global agricultural cooperation',
    ],
  },

  // China → Global (Geopolitical Channel)
  {
    sourceCountry: 'CHN',
    sourceRisk: 'Taiwan Strait Tensions & Regional Military Escalation',
    targetCountry: 'AUS',
    targetRisk: 'Geopolitical Alignment & Regional Security',
    strength: 'Strong',
    direction: 'Unidirectional',
    mechanism: 'Geopolitical',
    description: 'Chinese military escalation in Taiwan Strait forces Australia to strengthen US alliance and increase defense spending. Regional security tensions rise, affecting trade relationships and investment flows.',
    timeframe: '3-6 months',
    mitigationOptions: [
      'Strengthen regional security partnerships',
      'Maintain strategic ambiguity in geopolitical positioning',
      'Invest in defense capabilities',
      'Coordinate with allies on deterrence strategies',
    ],
  },

  // France → Global (EU Channel)
  {
    sourceCountry: 'FRA',
    sourceRisk: 'Energy Security Crisis & Nuclear Dependency',
    targetCountry: 'IRL',
    targetRisk: 'EU Energy Policy & Data Center Sustainability',
    strength: 'Moderate',
    direction: 'Unidirectional',
    mechanism: 'Policy Spillover',
    description: 'French energy crisis forces EU-wide energy rationing and policy changes. Ireland must adapt data center operations to EU energy constraints, affecting tech sector growth and competitiveness.',
    timeframe: '6-12 months',
    mitigationOptions: [
      'Invest in renewable energy for data centers',
      'Develop energy efficiency standards',
      'Diversify data center locations across EU',
      'Coordinate with EU on energy policy',
    ],
  },
];
