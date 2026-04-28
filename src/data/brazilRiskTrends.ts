/**
 * TransHorizons — Brazil Risk Trend Data
 * Quarterly snapshots (Q4 2025 – Q1 2026) tracking risk evolution
 * Enables RiskTrendVisualization component to display historical trends
 */

import type { RiskTrendData } from '@/lib/riskTrendTypes';

export const brazilRiskTrends: Record<string, RiskTrendData> = {
  'Electoral Polarization & Institutional Breakdown': {
    riskId: 'bra-electoral-polarization',
    title: 'Electoral Polarization & Institutional Breakdown',
    lastAssessment: '2026-03-31',
    assessmentFrequency: 'Quarterly',
    snapshots: [
      {
        quarter: 'Q4 2025',
        date: '2025-12-31',
        probability: 'Low',
        impact: 'High',
        trend: 'Increasing',
        activeIndicators: [
          'Bolsonaro rhetoric intensifying',
          'Polling shows Lula-Flávio tie',
          'Congressional polarization rising',
        ],
        effectiveMitigants: [
          'Electoral Commission transparency measures',
          'Supreme Court preparedness statements',
        ],
        notes: 'Early campaign phase; polarization building but institutional safeguards in place.',
      },
      {
        quarter: 'Q1 2026',
        date: '2026-03-31',
        probability: 'Med',
        impact: 'High',
        trend: 'Increasing',
        activeIndicators: [
          'Campaign rhetoric escalates',
          'Military makes ambiguous statements',
          'Congress polarization increases',
          'Street protests intensify',
        ],
        effectiveMitigants: [
          'International observation commitments',
          'Civil society mobilization',
          'Military restraint signals',
        ],
        notes: 'Campaign intensifies; institutional stress rising as election approaches.',
      },
    ],
  },
  'Fiscal Crisis & Debt Spiral': {
    riskId: 'bra-fiscal-crisis',
    title: 'Fiscal Crisis & Debt Spiral',
    lastAssessment: '2026-03-31',
    assessmentFrequency: 'Quarterly',
    snapshots: [
      {
        quarter: 'Q4 2025',
        date: '2025-12-31',
        probability: 'Med',
        impact: 'High',
        trend: 'Stable',
        activeIndicators: [
          'Deficit forecast 8.1% of GDP',
          'Debt approaching 90%',
          'Bond yields rising',
          'Selic rate at 14.75%',
        ],
        effectiveMitigants: [
          'Central Bank credibility maintained',
          'International confidence stable',
          'Commodity prices stable',
        ],
        notes: 'Fiscal pressures mounting but market confidence holding.',
      },
      {
        quarter: 'Q1 2026',
        date: '2026-03-31',
        probability: 'Med',
        impact: 'High',
        trend: 'Stable',
        activeIndicators: [
          'Deficit widens further',
          'Debt-to-GDP exceeds 89%',
          'Credit rating downgrade pressure',
          'Capital outflows accelerating',
        ],
        effectiveMitigants: [
          'Fiscal consolidation discussions',
          'Central Bank independence reaffirmed',
          'IMF engagement signals',
        ],
        notes: 'Fiscal situation deteriorating; market confidence fragile.',
      },
    ],
  },
  'Criminal Violence Escalation & Gang Territorial Expansion': {
    riskId: 'bra-criminal-violence',
    title: 'Criminal Violence Escalation & Gang Territorial Expansion',
    lastAssessment: '2026-03-31',
    assessmentFrequency: 'Quarterly',
    snapshots: [
      {
        quarter: 'Q4 2025',
        date: '2025-12-31',
        probability: 'Med',
        impact: 'Med',
        trend: 'Increasing',
        activeIndicators: [
          'October 2025 Rio raid killed 120+',
          'Gang violence continues',
          'US terrorist designation discussions',
          'PCC fuel supply infiltration ongoing',
        ],
        effectiveMitigants: [
          'Police operations continue',
          'Gang disruption efforts',
          'International cooperation discussions',
        ],
        notes: 'Gang violence remains endemic; police operations intensifying.',
      },
      {
        quarter: 'Q1 2026',
        date: '2026-03-31',
        probability: 'Med',
        impact: 'Med',
        trend: 'Stable',
        activeIndicators: [
          'Gang territorial expansion to new cities',
          'PCC fuel supply chain infiltration ongoing',
          'US designation pressure mounting',
          'CV expanding from Rio to other states',
        ],
        effectiveMitigants: [
          'Evidence-based security policy discussions',
          'Community policing pilots',
          'International cooperation expanding',
        ],
        notes: 'Criminal organizations adapting; territorial control spreading.',
      },
    ],
  },
  'Currency Crisis & Capital Flight': {
    riskId: 'bra-currency-crisis',
    title: 'Currency Crisis & Capital Flight',
    lastAssessment: '2026-03-31',
    assessmentFrequency: 'Quarterly',
    snapshots: [
      {
        quarter: 'Q4 2025',
        date: '2025-12-31',
        probability: 'Med',
        impact: 'Med',
        trend: 'Increasing',
        activeIndicators: [
          'Real depreciating',
          'External volatility mounting',
          'Capital outflows accelerating',
          'CDS spreads widening',
        ],
        effectiveMitigants: [
          'Central Bank intervention',
          'Commodity price recovery',
          'External support discussions',
        ],
        notes: 'Currency under pressure; external vulnerabilities rising.',
      },
      {
        quarter: 'Q1 2026',
        date: '2026-03-31',
        probability: 'Med',
        impact: 'Med',
        trend: 'Stable',
        activeIndicators: [
          'Real weakens past 6.2 per USD',
          'Capital outflows continue',
          'Spreads widen further',
          'Reserve depletion concerns',
        ],
        effectiveMitigants: [
          'Central Bank credibility maintained',
          'Capital controls discussions',
          'External support commitments',
        ],
        notes: 'Currency weakness persistent; market confidence fragile.',
      },
    ],
  },
  'Amazon Deforestation & Environmental Collapse': {
    riskId: 'bra-amazon-deforestation',
    title: 'Amazon Deforestation & Environmental Collapse',
    lastAssessment: '2026-03-31',
    assessmentFrequency: 'Quarterly',
    snapshots: [
      {
        quarter: 'Q4 2025',
        date: '2025-12-31',
        probability: 'Med',
        impact: 'Med',
        trend: 'Increasing',
        activeIndicators: [
          'Deforestation rates rising',
          'Illegal mining expands',
          'Gang control of Amazon increases',
          'Environmental tipping point approaching',
        ],
        effectiveMitigants: [
          'Environmental enforcement operations',
          'Indigenous land protection initiatives',
          'International climate finance discussions',
        ],
        notes: 'Deforestation accelerating; criminal infiltration of Amazon expanding.',
      },
      {
        quarter: 'Q1 2026',
        date: '2026-03-31',
        probability: 'Med',
        impact: 'Med',
        trend: 'Stable',
        activeIndicators: [
          'Deforestation accelerates further',
          'International pressure mounts',
          'Climate commitment risks',
          'Indigenous territory threats',
        ],
        effectiveMitigants: [
          'Environmental enforcement expanding',
          'Indigenous territory protection',
          'International cooperation agreements',
        ],
        notes: 'Amazon security deteriorating; international concern rising.',
      },
    ],
  },
  'Coalition Collapse & Government Paralysis': {
    riskId: 'bra-coalition-collapse',
    title: 'Coalition Collapse & Government Paralysis',
    lastAssessment: '2026-03-31',
    assessmentFrequency: 'Quarterly',
    snapshots: [
      {
        quarter: 'Q4 2025',
        date: '2025-12-31',
        probability: 'Low',
        impact: 'Med',
        trend: 'Stable',
        activeIndicators: [
          'Coalition tensions manageable',
          'Key votes passing',
          'Party discipline holding',
        ],
        effectiveMitigants: [
          'Coalition management effective',
          'Legislative negotiation successful',
          'Presidential authority maintained',
        ],
        notes: 'Coalition holding together; legislative process functioning.',
      },
      {
        quarter: 'Q1 2026',
        date: '2026-03-31',
        probability: 'Low',
        impact: 'Med',
        trend: 'Increasing',
        activeIndicators: [
          'Coalition tensions increase slightly',
          'Some key votes fail',
          'Party discipline weakens',
          'Cabinet reshuffle required (March 2026)',
        ],
        effectiveMitigants: [
          'Coalition management continues',
          'Concessions to key partners',
          'Presidential authority reaffirmed',
        ],
        notes: 'Coalition fragility increasing as election approaches.',
      },
    ],
  },
};
