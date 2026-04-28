import type { CountryHistoricalProfile } from '@/lib/historicalTimelineTypes';

/**
 * Canada Historical Risk Timeline (2006-2031)
 * Includes 20 years of historical data (2006-2024) and 7-year projections (2025-2031)
 * with scenario-based analysis and uncertainty bands
 */

export const canadaHistoricalTimeline: CountryHistoricalProfile = {
  countryCode: 'CAN',
  countryName: 'Canada',

  correlations: [
    {
      sourceCountry: 'Brazil',
      destinationCountry: 'Canada',
      riskType: 'commodity-price',

      // Historical data: Brazil commodity price shocks affecting Canadian mining/exports
      historical: [
        {
          date: { year: 2006, timestamp: '2006-01-01' },
          strength: 'low',
          probability: 25,
          impact: 15,
          mechanism: 'Commodity prices stable; Brazil economic growth supports demand',
        },
        {
          date: { year: 2011, timestamp: '2011-01-01' },
          strength: 'medium',
          probability: 45,
          impact: 35,
          mechanism: 'China commodity boom; Brazil inflation rising; Canadian mining benefits',
        },
        {
          date: { year: 2016, timestamp: '2016-01-01' },
          strength: 'high',
          probability: 65,
          impact: 55,
          mechanism: 'Brazil fiscal crisis; commodity crash; Canadian iron ore/lithium exports collapse',
        },
        {
          date: { year: 2020, timestamp: '2020-01-01' },
          strength: 'high',
          probability: 70,
          impact: 60,
          mechanism: 'COVID-19 demand shock; Brazil economic contraction; Canadian mining sector stressed',
        },
        {
          date: { year: 2024, timestamp: '2024-01-01' },
          strength: 'medium',
          probability: 50,
          impact: 40,
          mechanism: 'Brazil fiscal stabilization; commodity recovery; Canadian exports improving',
        },
      ],

      // Scenario projections: 2025-2031
      scenarios: {
        base: [
          {
            date: { year: 2025, quarter: 1, timestamp: '2025-01-01' },
            probability: { probability: 55, impact: 42, confidence: 75 },
            impact: { probability: 55, impact: 42, confidence: 75 },
            mechanism: 'Brazil maintains fiscal discipline; commodity prices moderate; Canadian mining stable',
            assumptions: [
              'Brazil inflation controlled at 4-5% annually',
              'Iron ore prices $80-100/tonne',
              'Lithium demand grows 8% annually',
            ],
          },
          {
            date: { year: 2027, timestamp: '2027-01-01' },
            probability: { probability: 52, impact: 40, confidence: 70 },
            impact: { probability: 52, impact: 40, confidence: 70 },
            mechanism: 'Commodity cycle stabilizes; Brazil-Canada trade normalized',
            assumptions: [
              'Global EV adoption accelerates lithium demand',
              'Brazil political stability maintained',
              'Canadian mining investment increases',
            ],
          },
          {
            date: { year: 2029, timestamp: '2029-01-01' },
            probability: { probability: 48, impact: 38, confidence: 65 },
            impact: { probability: 48, impact: 38, confidence: 65 },
            mechanism: 'Long-term commodity equilibrium; Brazil-Canada partnership strengthens',
            assumptions: [
              'Critical mineral demand peaks',
              'Recycling reduces primary demand',
              'Brazil becomes strategic supplier',
            ],
          },
        ],

        optimistic: [
          {
            date: { year: 2025, quarter: 1, timestamp: '2025-01-01' },
            probability: { probability: 35, impact: 25, confidence: 80 },
            impact: { probability: 35, impact: 25, confidence: 80 },
            mechanism: 'Brazil fiscal reform succeeds; commodity super-cycle begins; Canadian exports boom',
            assumptions: [
              'Brazil inflation drops to 2-3%',
              'Iron ore prices $120+/tonne',
              'Lithium demand grows 15% annually',
              'Canadian mining investment doubles',
            ],
          },
          {
            date: { year: 2027, timestamp: '2027-01-01' },
            probability: { probability: 30, impact: 20, confidence: 75 },
            impact: { probability: 30, impact: 20, confidence: 75 },
            mechanism: 'Green energy transition accelerates; Canada becomes critical mineral hub',
            assumptions: [
              'EV adoption reaches 50% of new cars',
              'Lithium prices stabilize at premium levels',
              'Canada attracts $50B+ in mining investment',
            ],
          },
          {
            date: { year: 2029, timestamp: '2029-01-01' },
            probability: { probability: 28, impact: 18, confidence: 70 },
            impact: { probability: 28, impact: 18, confidence: 70 },
            mechanism: 'Canada-Brazil strategic partnership; secure supply chains established',
            assumptions: [
              'North American supply chain reshoring',
              'Brazil becomes preferred partner',
              'Long-term contracts signed',
            ],
          },
        ],

        pessimistic: [
          {
            date: { year: 2025, quarter: 1, timestamp: '2025-01-01' },
            probability: { probability: 75, impact: 65, confidence: 70 },
            impact: { probability: 75, impact: 65, confidence: 70 },
            mechanism: 'Brazil fiscal crisis returns; commodity crash; Canadian mining sector collapses',
            assumptions: [
              'Brazil inflation spikes to 8%+',
              'Currency devaluation 30%+',
              'Iron ore prices drop to $50/tonne',
              'Mining investment freezes',
            ],
          },
          {
            date: { year: 2027, timestamp: '2027-01-01' },
            probability: { probability: 70, impact: 60, confidence: 65 },
            impact: { probability: 70, impact: 60, confidence: 65 },
            mechanism: 'Prolonged Brazil recession; commodity oversupply; Canadian unemployment rises',
            assumptions: [
              'EV adoption stalls at 25%',
              'Lithium oversupply crashes prices',
              'Mining layoffs accelerate',
              'Regional unemployment 8%+',
            ],
          },
          {
            date: { year: 2029, timestamp: '2029-01-01' },
            probability: { probability: 65, impact: 55, confidence: 60 },
            impact: { probability: 65, impact: 55, confidence: 60 },
            mechanism: 'Structural commodity decline; Canada economic stagnation',
            assumptions: [
              'Commodity demand permanently lower',
              'Mining sector consolidation/closures',
              'Regional economic depression',
            ],
          },
        ],
      },

      uncertaintyBands: [
        {
          date: { year: 2025, timestamp: '2025-01-01' },
          probabilityMin: 35,
          probabilityMax: 75,
          impactMin: 25,
          impactMax: 65,
        },
        {
          date: { year: 2027, timestamp: '2027-01-01' },
          probabilityMin: 30,
          probabilityMax: 70,
          impactMin: 20,
          impactMax: 60,
        },
        {
          date: { year: 2029, timestamp: '2029-01-01' },
          probabilityMin: 28,
          probabilityMax: 65,
          impactMin: 18,
          impactMax: 55,
        },
      ],
    },

    // US Trade Dependency Risk
    {
      sourceCountry: 'USA',
      destinationCountry: 'Canada',
      riskType: 'trade',

      historical: [
        {
          date: { year: 2006, timestamp: '2006-01-01' },
          strength: 'high',
          probability: 60,
          impact: 70,
          mechanism: 'NAFTA stable; 75% of Canadian exports to US; integrated supply chains',
        },
        {
          date: { year: 2016, timestamp: '2016-01-01' },
          strength: 'high',
          probability: 65,
          impact: 72,
          mechanism: 'NAFTA renegotiation concerns; Trump protectionism; trade uncertainty rises',
        },
        {
          date: { year: 2020, timestamp: '2020-01-01' },
          strength: 'high',
          probability: 70,
          impact: 75,
          mechanism: 'COVID-19 supply chain disruptions; border closures; trade volatility',
        },
        {
          date: { year: 2024, timestamp: '2024-01-01' },
          strength: 'high',
          probability: 68,
          impact: 73,
          mechanism: 'USMCA stable but tariff threats; supply chain resilience improving',
        },
      ],

      scenarios: {
        base: [
          {
            date: { year: 2025, quarter: 1, timestamp: '2025-01-01' },
            probability: { probability: 65, impact: 70, confidence: 72 },
            impact: { probability: 65, impact: 70, confidence: 72 },
            mechanism: 'USMCA continues; moderate tariffs; supply chains adapt',
            assumptions: [
              'US tariffs 5-10% on select goods',
              'USMCA renegotiation delayed',
              'Supply chain diversification continues',
            ],
          },
          {
            date: { year: 2027, timestamp: '2027-01-01' },
            probability: { probability: 62, impact: 68, confidence: 68 },
            impact: { probability: 62, impact: 68, confidence: 68 },
            mechanism: 'Trade relationship stabilizes; supply chains optimized',
            assumptions: [
              'USMCA renewed with minor changes',
              'Tariffs stabilize at 5%',
              'Critical supply chains secured',
            ],
          },
        ],

        optimistic: [
          {
            date: { year: 2025, quarter: 1, timestamp: '2025-01-01' },
            probability: { probability: 40, impact: 45, confidence: 75 },
            impact: { probability: 40, impact: 45, confidence: 75 },
            mechanism: 'US-Canada trade deepens; tariffs eliminated; integration increases',
            assumptions: [
              'USMCA enhanced with green provisions',
              'Tariff-free trade on critical minerals',
              'Supply chain integration accelerates',
            ],
          },
        ],

        pessimistic: [
          {
            date: { year: 2025, quarter: 1, timestamp: '2025-01-01' },
            probability: { probability: 80, impact: 85, confidence: 65 },
            impact: { probability: 80, impact: 85, confidence: 65 },
            mechanism: 'Trade war escalates; USMCA collapses; tariffs spike 25%+',
            assumptions: [
              'US imposes 25% tariffs on autos/energy',
              'USMCA terminated',
              'Supply chains fragment',
              'Canadian GDP growth -2% annually',
            ],
          },
        ],
      },

      uncertaintyBands: [
        {
          date: { year: 2025, timestamp: '2025-01-01' },
          probabilityMin: 40,
          probabilityMax: 80,
          impactMin: 45,
          impactMax: 85,
        },
        {
          date: { year: 2027, timestamp: '2027-01-01' },
          probabilityMin: 38,
          probabilityMax: 75,
          impactMin: 42,
          impactMax: 80,
        },
      ],
    },

    // China Tech Competition Risk
    {
      sourceCountry: 'China',
      destinationCountry: 'Canada',
      riskType: 'geopolitical',

      historical: [
        {
          date: { year: 2006, timestamp: '2006-01-01' },
          strength: 'low',
          probability: 20,
          impact: 15,
          mechanism: 'China-Canada relations stable; limited tech competition',
        },
        {
          date: { year: 2016, timestamp: '2016-01-01' },
          strength: 'medium',
          probability: 40,
          impact: 30,
          mechanism: 'China tech rise; Canada concerned about IP theft; Huawei tensions begin',
        },
        {
          date: { year: 2020, timestamp: '2020-01-01' },
          strength: 'high',
          probability: 65,
          impact: 55,
          mechanism: 'Meng Wanzhou arrest; China retaliates; tech decoupling accelerates',
        },
        {
          date: { year: 2024, timestamp: '2024-01-01' },
          strength: 'high',
          probability: 70,
          impact: 60,
          mechanism: 'Huawei banned from 5G; tech supply chain realignment; tensions high',
        },
      ],

      scenarios: {
        base: [
          {
            date: { year: 2025, quarter: 1, timestamp: '2025-01-01' },
            probability: { probability: 68, impact: 58, confidence: 70 },
            impact: { probability: 68, impact: 58, confidence: 70 },
            mechanism: 'Tech decoupling continues; China-Canada relations cool but stable',
            assumptions: [
              'Huawei ban maintained',
              'Tech supply chains diversify',
              'Diplomatic tensions persist',
            ],
          },
        ],

        optimistic: [
          {
            date: { year: 2025, quarter: 1, timestamp: '2025-01-01' },
            probability: { probability: 35, impact: 30, confidence: 72 },
            impact: { probability: 35, impact: 30, confidence: 72 },
            mechanism: 'US-China tensions ease; tech cooperation resumes; relations normalize',
            assumptions: [
              'Trade deal reached',
              'Tech restrictions lifted',
              'Huawei allowed limited 5G role',
            ],
          },
        ],

        pessimistic: [
          {
            date: { year: 2025, quarter: 1, timestamp: '2025-01-01' },
            probability: { probability: 80, impact: 75, confidence: 65 },
            impact: { probability: 80, impact: 75, confidence: 65 },
            mechanism: 'Tech cold war intensifies; Canada caught in US-China conflict',
            assumptions: [
              'Tech sanctions expand',
              'Chinese investment banned',
              'Supply chain fragmentation',
              'Economic impact -1% GDP',
            ],
          },
        ],
      },

      uncertaintyBands: [
        {
          date: { year: 2025, timestamp: '2025-01-01' },
          probabilityMin: 35,
          probabilityMax: 80,
          impactMin: 30,
          impactMax: 75,
        },
      ],
    },

    // Energy Transition Risk
    {
      sourceCountry: 'Global',
      destinationCountry: 'Canada',
      riskType: 'commodity-price',

      historical: [
        {
          date: { year: 2006, timestamp: '2006-01-01' },
          strength: 'low',
          probability: 15,
          impact: 20,
          mechanism: 'Oil boom; Canadian energy sector thriving; $100+/barrel',
        },
        {
          date: { year: 2016, timestamp: '2016-01-01' },
          strength: 'high',
          probability: 70,
          impact: 65,
          mechanism: 'Oil crash to $30/barrel; Canadian energy sector crisis; Alberta recession',
        },
        {
          date: { year: 2020, timestamp: '2020-01-01' },
          strength: 'high',
          probability: 75,
          impact: 70,
          mechanism: 'COVID-19 demand collapse; oil negative pricing; energy sector devastated',
        },
        {
          date: { year: 2024, timestamp: '2024-01-01' },
          strength: 'high',
          probability: 65,
          impact: 60,
          mechanism: 'Energy transition accelerates; oil demand declining; Canadian pivot to renewables',
        },
      ],

      scenarios: {
        base: [
          {
            date: { year: 2025, quarter: 1, timestamp: '2025-01-01' },
            probability: { probability: 60, impact: 55, confidence: 68 },
            impact: { probability: 60, impact: 55, confidence: 68 },
            mechanism: 'Oil demand declines 2% annually; Canada diversifies to renewables/critical minerals',
            assumptions: [
              'Oil prices $70-90/barrel',
              'EV adoption 30% by 2030',
              'Renewable investment $20B annually',
            ],
          },
          {
            date: { year: 2027, timestamp: '2027-01-01' },
            probability: { probability: 55, impact: 50, confidence: 65 },
            impact: { probability: 55, impact: 50, confidence: 65 },
            mechanism: 'Energy transition mid-point; oil still important but declining',
            assumptions: [
              'Oil demand down 5% from 2024',
              'Renewable energy 40% of supply',
              'Critical mineral exports growing',
            ],
          },
        ],

        optimistic: [
          {
            date: { year: 2025, quarter: 1, timestamp: '2025-01-01' },
            probability: { probability: 30, impact: 35, confidence: 70 },
            impact: { probability: 30, impact: 35, confidence: 70 },
            mechanism: 'Green energy boom; Canada becomes renewable superpower; oil decline managed',
            assumptions: [
              'Renewable investment $40B annually',
              'Hydrogen economy develops',
              'Canada exports green energy to US',
            ],
          },
        ],

        pessimistic: [
          {
            date: { year: 2025, quarter: 1, timestamp: '2025-01-01' },
            probability: { probability: 75, impact: 70, confidence: 62 },
            impact: { probability: 75, impact: 70, confidence: 62 },
            mechanism: 'Abrupt energy transition; oil demand collapses; stranded assets',
            assumptions: [
              'Oil prices crash to $40/barrel',
              'Oil demand drops 15% by 2027',
              'Energy sector unemployment 20%+',
              'Regional GDP decline -3% annually',
            ],
          },
        ],
      },

      uncertaintyBands: [
        {
          date: { year: 2025, timestamp: '2025-01-01' },
          probabilityMin: 30,
          probabilityMax: 75,
          impactMin: 35,
          impactMax: 70,
        },
        {
          date: { year: 2027, timestamp: '2027-01-01' },
          probabilityMin: 28,
          probabilityMax: 70,
          impactMin: 32,
          impactMax: 65,
        },
      ],
    },
  ],

  timelineStart: 2006,
  timelineEnd: 2031,

  keyEvents: [
    {
      year: 2008,
      title: 'Global Financial Crisis',
      description: 'Commodity crash; Canadian mining and energy sectors devastated',
      affectedRisks: ['commodity-price', 'trade'],
    },
    {
      year: 2016,
      title: 'Oil Price Collapse & Trump Election',
      description: 'Oil drops to $30/barrel; trade uncertainty spikes',
      affectedRisks: ['commodity-price', 'trade', 'geopolitical'],
    },
    {
      year: 2018,
      title: 'USMCA Signed',
      description: 'NAFTA replacement provides trade stability',
      affectedRisks: ['trade'],
    },
    {
      year: 2020,
      title: 'COVID-19 Pandemic',
      description: 'Supply chain disruptions; energy demand collapse; border closures',
      affectedRisks: ['commodity-price', 'trade', 'geopolitical'],
    },
    {
      year: 2021,
      title: 'Huawei Ban & Tech Decoupling',
      description: 'Canada bans Huawei from 5G; tech competition with China intensifies',
      affectedRisks: ['geopolitical'],
    },
    {
      year: 2023,
      title: 'Critical Minerals Strategy',
      description: 'Canada positions as critical mineral supplier for green transition',
      affectedRisks: ['commodity-price'],
    },
  ],
};
