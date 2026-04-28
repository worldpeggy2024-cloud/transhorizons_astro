/**
 * TransHorizons — Ireland Risk Trend Data
 * Quarterly historical tracking of risk evolution Q4 2025 → Q1 2026
 * Demonstrates how risks have evolved and which mitigants are proving effective
 */

import type { RiskTrendData } from '@/lib/riskTrendTypes';

export const irelandRiskTrends: Record<string, RiskTrendData> = {
  'energy-crisis-&-grid-collapse': {
    riskId: 'energy-crisis',
    title: 'Energy Crisis from Data Center Demand',
    snapshots: [
      {
        quarter: 'Q4 2025',
        date: '2025-12-31',
        probability: 'High',
        impact: 'High',
        trend: 'Increasing',
        activeIndicators: [
          'Data center connections at 80% capacity',
          'CRU renewable energy requirement (80%) not met by supply',
          'Grid operator warnings of winter constraints',
        ],
        effectiveMitigants: [
          'Government data center connection pause announced',
          'Renewable energy acceleration plan launched',
        ],
        notes: 'Winter 2025-2026 exposed grid vulnerabilities. Demand exceeded forecasts by 12%. Government intervention slowed new connections.',
      },
      {
        quarter: 'Q1 2026',
        date: '2026-03-31',
        probability: 'High',
        impact: 'High',
        trend: 'Stable',
        activeIndicators: [
          'Data center demand remains elevated',
          'Renewable energy supply still below 80% target',
          'Grid operator capacity warnings continue',
          'Business sector lobbying for connection exemptions',
        ],
        effectiveMitigants: [
          'Connection pause holding firm',
          'Wind farm projects accelerating (3 new projects Q1)',
          'Battery storage procurement initiated',
          'Demand management protocols developed',
        ],
        notes: 'Spring 2026 showed stabilization but not improvement. New renewable projects coming online Q2-Q3 2026. Business pressure mounting on government to relax pause.',
      },
    ],
    lastAssessment: '2026-03-31',
    assessmentFrequency: 'Quarterly',
  },

  'coalition-collapse': {
    riskId: 'coalition-fragility',
    title: 'Coalition Collapse Risk',
    snapshots: [
      {
        quarter: 'Q4 2025',
        date: '2025-12-31',
        probability: 'Med',
        impact: 'High',
        trend: 'Stable',
        activeIndicators: [
          'By-election scheduled (Galway West, Dublin Central)',
          'Government backbench tensions over energy policy',
          'Independent TD defection rumors',
        ],
        effectiveMitigants: [
          'Rotation agreement (Martin → Harris) reduces succession tensions',
          'Coalition partners fear Sinn Féin alternative',
          'Budget 2026 passed with support',
        ],
        notes: 'Coalition stable but fragile. By-elections in Q1 2026 will be critical test. Government maintaining discipline on key votes.',
      },
      {
        quarter: 'Q1 2026',
        date: '2026-03-31',
        probability: 'Med',
        impact: 'High',
        trend: 'Decreasing',
        activeIndicators: [
          'By-elections held (results mixed)',
          'Opposition gains in Dublin Central',
          'Government holds majority in Galway West',
        ],
        effectiveMitigants: [
          'Coalition holds majority after by-elections',
          'Independent TDs reaffirm support',
          'Leadership transition (Martin → Harris) proceeding on schedule',
          'Business sector confidence remains high',
        ],
        notes: 'By-elections showed mixed results but did not trigger coalition collapse. Opposition gains limited. Government operating space preserved through 2026.',
      },
    ],
    lastAssessment: '2026-03-31',
    assessmentFrequency: 'Quarterly',
  },

  'housing-crisis-triggers-social-unrest': {
    riskId: 'housing-crisis',
    title: 'Housing Crisis Triggers Social Unrest',
    snapshots: [
      {
        quarter: 'Q4 2025',
        date: '2025-12-31',
        probability: 'Med',
        impact: 'Med',
        trend: 'Increasing',
        activeIndicators: [
          'Housing prices rose 8% Q3-Q4 2025',
          'Homelessness statistics worsened (up 15% YoY)',
          'Protest frequency increased (3 major housing protests Q4)',
          'Youth emigration accelerating (up 22% vs Q4 2024)',
        ],
        effectiveMitigants: [
          'Government housing investment plan (€5B announced)',
          'Planning reform initiatives underway',
          'Private sector development projects announced',
        ],
        notes: 'Housing crisis intensified during Q4 2025. Media focus on homelessness increased. Government housing plan announced but implementation delayed.',
      },
      {
        quarter: 'Q1 2026',
        date: '2026-03-31',
        probability: 'High',
        impact: 'Med',
        trend: 'Increasing',
        activeIndicators: [
          'Housing starts stagnated (down 3% Q4-Q1)',
          'Homelessness statistics worsened further (up 8% Q1)',
          'Protest frequency remained elevated (2 major protests Q1)',
          'Youth emigration continuing (up 18% Q1 vs Q1 2025)',
          'Media focus on housing crisis intensified',
        ],
        effectiveMitigants: [
          'Planning reform passed (accelerates approvals)',
          'First housing projects under investment plan broke ground',
          'Rent control debate gaining political traction',
          'Private sector development accelerating',
        ],
        notes: 'Housing crisis worsened in Q1 2026 despite government action. Planning reform showing early impact. Pressure mounting for more aggressive intervention (rent controls).',
      },
    ],
    lastAssessment: '2026-03-31',
    assessmentFrequency: 'Quarterly',
  },

  'us-eu-digital-regulation-conflict': {
    riskId: 'digital-regulation',
    title: 'US-EU Digital Regulation Conflict',
    snapshots: [
      {
        quarter: 'Q4 2025',
        date: '2025-12-31',
        probability: 'Med',
        impact: 'Med',
        trend: 'Stable',
        activeIndicators: [
          'EU AI Act implementation ongoing',
          'US tech company compliance costs rising',
          'US administration rhetoric on EU regulation intensifying',
        ],
        effectiveMitigants: [
          'Ireland\'s EU Presidency (July–December 2026) provides mediation platform',
          'Tech sector on-site compliance investment',
          'Regulatory harmonization efforts underway',
        ],
        notes: 'Regulatory tensions stable but underlying pressure building. US tech companies investing in compliance. Ireland positioning itself as mediator.',
      },
      {
        quarter: 'Q1 2026',
        date: '2026-03-31',
        probability: 'Med',
        impact: 'Med',
        trend: 'Stable',
        activeIndicators: [
          'EU AI Act enforcement beginning',
          'US tech company lobbying intensifying',
          'Trade pressure on Ireland rumors (unconfirmed)',
          'Tech sector relocation discussions (limited)',
        ],
        effectiveMitigants: [
          'Ireland\'s EU Presidency momentum building',
          'Tech sector compliance investment continuing',
          'Regulatory harmonization talks progressing',
          'US-EU trade dialogue ongoing',
        ],
        notes: 'Regulatory conflict remains manageable. Ireland\'s EU Presidency positioning it as mediator. Tech sector adapting to compliance requirements.',
      },
    ],
    lastAssessment: '2026-03-31',
    assessmentFrequency: 'Quarterly',
  },

  'sinn-féin-electoral-breakthrough': {
    riskId: 'sinn-fein-breakthrough',
    title: 'Sinn Féin Electoral Breakthrough',
    snapshots: [
      {
        quarter: 'Q4 2025',
        date: '2025-12-31',
        probability: 'Low',
        impact: 'High',
        trend: 'Stable',
        activeIndicators: [
          'Sinn Féin polling at 28% (highest in 20 years)',
          'Working-class mobilization continuing',
          'Youth support strong (35% of under-35s)',
        ],
        effectiveMitigants: [
          'Fine Gael and Fianna Fáil likely to coordinate against Sinn Féin',
          'Business sector opposition to radical policies',
          'Institutional resistance to major policy shifts',
        ],
        notes: 'Sinn Féin surge continued but stabilized. By-elections in Q1 2026 will test electoral viability. Coalition parties preparing coordination strategy.',
      },
      {
        quarter: 'Q1 2026',
        date: '2026-03-31',
        probability: 'Low',
        impact: 'High',
        trend: 'Decreasing',
        activeIndicators: [
          'Sinn Féin polling declined to 25% (post-by-election)',
          'By-election results showed limited Sinn Féin gains',
          'Left-wing party coordination weak',
        ],
        effectiveMitigants: [
          'Coalition parties coordinating against Sinn Féin',
          'Business sector opposition visible',
          'Institutional resistance to radical policies',
          'By-election results reduced Sinn Féin momentum',
        ],
        notes: 'Sinn Féin momentum slowed after by-elections. Coalition coordination strategy working. Electoral breakthrough risk reduced for 2026 but remains threat for 2027 general election.',
      },
    ],
    lastAssessment: '2026-03-31',
    assessmentFrequency: 'Quarterly',
  },

  'nato-membership-pressure': {
    riskId: 'nato-membership',
    title: 'NATO Membership Pressure',
    snapshots: [
      {
        quarter: 'Q4 2025',
        date: '2025-12-31',
        probability: 'Low',
        impact: 'Med',
        trend: 'Stable',
        activeIndicators: [
          'EU defense integration deepening',
          'NATO membership debate emerging in media',
          'Government defense spending increases announced',
        ],
        effectiveMitigants: [
          'Strong Irish attachment to neutrality policy',
          'Constitutional constraints (neutrality enshrined)',
          'Political consensus against NATO membership',
        ],
        notes: 'NATO membership debate remained fringe. Neutrality policy strong. Government increasing defense spending without NATO membership.',
      },
      {
        quarter: 'Q1 2026',
        date: '2026-03-31',
        probability: 'Low',
        impact: 'Med',
        trend: 'Stable',
        activeIndicators: [
          'EU defense integration continuing',
          'NATO membership debate limited to academic circles',
          'Government defense spending rising (€1.7B plan)',
          'Public opinion polling on NATO (not yet conducted)',
        ],
        effectiveMitigants: [
          'Irish attachment to neutrality remains strong',
          'Constitutional constraints remain in place',
          'Political consensus against NATO membership holds',
          'EU defense integration allowing security cooperation without NATO',
        ],
        notes: 'NATO membership pressure minimal. Ireland pursuing security cooperation through EU and NATO partnerships without membership. Neutrality policy stable.',
      },
    ],
    lastAssessment: '2026-03-31',
    assessmentFrequency: 'Quarterly',
  },
};
