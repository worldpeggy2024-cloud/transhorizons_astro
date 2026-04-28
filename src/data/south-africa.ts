/*
 * TransHorizons — South Africa Country Analysis Data
 * Full bilingual content following the Country Situation Report framework
 * Focus: African leadership, BRICS member, resource wealth, geopolitical pivot, inequality, governance challenges
 * Last updated: April 2026
 * Sources: South African Reserve Bank, Statistics South Africa, IMF, World Bank, SIPRI, ACLED, Freedom House, Brookings Africa
 */

export interface AnalysisContent {
  lastUpdated: string;
  scorecard: {
    eliteCohesion: 'High' | 'Med' | 'Low';
    securityLoyalty: 'High' | 'Med' | 'Low';
    economicPressure: 'High' | 'Med' | 'Low';
    protestCapacity: 'High' | 'Med' | 'Low';
    institutionalResilience: 'High' | 'Med' | 'Low';
  };
  en: LangContent;
  fr: LangContent;
}

export interface LangContent {
  executiveSnapshot: string[];
  political: {
    powerStructure: string;
    stabilityDrivers: string;
    shockAbsorbers: string;
  };
  economy: {
    macroReality: string;
    externalVulnerability: string;
    politicalEconomy: string;
  };
  security: {
    internal: string;
    diplomacy: string;
  };
  actors: {
    domestic: ActorEntry[];
    external: ActorEntry[];
  };
  risks: RiskEntry[];
  sources: SourceEntry[];
}

export interface ActorEntry {
  name: string;
  interests: string;
  resources: string;
  constraints: string;
  likelyMoves: string;
  dealability: string;
}

export interface RiskEntry {
  title: string;
  trigger: string;
  probability: 'Low' | 'Med' | 'High';
  impact: 'Low' | 'Med' | 'High';
  timeHorizon: string;
  leadingIndicators: string;
  mitigants: string;
  lastAssessed?: string;
}

export interface SourceEntry {
  name: string;
  url: string;
  desc: string;
}

export const southAfricaAnalysis: AnalysisContent = {
  lastUpdated: '2026-04-15',
  scorecard: {
    eliteCohesion: 'Med',
    securityLoyalty: 'Med',
    economicPressure: 'High',
    protestCapacity: 'High',
    institutionalResilience: 'Med',
  },
  en: {
    executiveSnapshot: [
      'Regime type: Parliamentary democracy with presidential system. President Cyril Ramaphosa leads government (since 2018). Parliament has two chambers (National Assembly and National Council of Provinces). Democratic institutions exist but are under strain. Civil society is active. The military is professional and subordinate to civilian government. The ANC (African National Congress) has dominated politics since 1994 but is declining in electoral support.',
      'Political equilibrium: South Africa is in political transition. The ANC\'s electoral dominance is eroding — it fell below 50% for the first time in 2024 elections. Coalition governments are now necessary. Ramaphosa faces internal ANC opposition and corruption allegations. The opposition is fragmented. Civil society is active but divided. Political stability is moderate but declining. Succession planning within ANC is contested.',
      'Economic model: Upper-middle-income economy ($470 billion GDP, ~$8,000 per capita). Diversified economy with mining, manufacturing, services, and agriculture. However, unemployment is very high (~30%), inequality is extreme (Gini ~0.63), and poverty is widespread (~30%). Energy crisis is acute — electricity supply is constrained. Infrastructure is aging. Fiscal pressures are rising.',
      'Top 3 risks (6–18 months): (1) Energy crisis deepening or power cuts worsening; (2) Political instability from coalition government fragmentation; (3) Unemployment crisis or social unrest escalation.',
      'Top 3 watch items (4–12 weeks): (1) Electricity supply and load shedding trends; (2) Coalition government stability and ANC internal dynamics; (3) Unemployment and social unrest indicators.',
      'External dependencies: Exports are diversified (minerals, agriculture, manufactured goods) but vulnerable to commodity prices. Remittances are modest (~$2 billion annually). Foreign direct investment is important but declining due to instability. Debt service is manageable (~15% of revenues). Tourism is significant but disrupted by crime and instability.',
      'Security posture: Internal security challenges are significant — crime rates are very high, gang violence is endemic in urban areas, xenophobic violence occurs periodically. The police force is under-resourced and faces corruption allegations. The military is professional but faces resource constraints. Terrorism threat is low. Border security is challenged by migration and smuggling.',
      'Diplomatic orientation: Regional leader in Africa. BRICS member with pragmatic engagement with China and Russia. Balances Western ties with BRICS membership. Active in African Union and SADC. Seeks to maintain regional influence and African leadership. Increasingly assertive on geopolitical issues.',
      'Data confidence: Medium-High — South Africa publishes macroeconomic data and has institutional capacity. However, political/security data is less transparent. Crime statistics are contested.',
      'Baseline outlook: Challenging and deteriorating. Energy crisis is acute and worsening. Political transition to coalition government is destabilizing. Unemployment and inequality remain severe. The key challenge is managing energy crisis while stabilizing coalition government and addressing unemployment. Without significant reform, the situation will continue to deteriorate.',
    ],
    political: {
      powerStructure: 'President Cyril Ramaphosa holds executive power but faces internal ANC opposition and declining party support. Parliament (National Assembly and National Council of Provinces) is now more fragmented — coalition government is necessary. The judiciary is independent but faces political pressure. The police and military are subordinate to civilian government. Local governments have significant autonomy but are often dysfunctional. The civil service is large but faces capacity constraints.',
      stabilityDrivers: 'Legitimacy rests on democratic institutions and ANC\'s historical role in liberation struggle. However, this is eroding due to corruption, service delivery failures, and economic decline. The military is loyal to civilian government. The civil service implements government directives. However, opposition is fragmented and coalition government is unstable. Civil society is active but divided.',
      shockAbsorbers: 'Absorbers: Democratic institutions and constitutional framework. Professional military and security forces. Active civil society. Regional economic integration. Accelerants: Energy crisis deepening would trigger economic crisis. Coalition government collapse would create political crisis. Major unemployment surge or social unrest would destabilize government. Natural disaster or pandemic would overwhelm weak capacity.',
    },
    economy: {
      macroReality: 'GDP growth forecast 1-2% for 2025-2026 (IMF) — weak and below potential. Inflation is projected at ~5% (moderate). The fiscal deficit is projected at ~4% of GDP (rising). Public debt stands at ~75% of GDP (high and rising). The South African rand has depreciated ~10% against the US dollar since late 2024 due to capital outflows and economic concerns. Unemployment is ~30% (very high). Poverty is ~30% of population. Inequality is extreme (Gini ~0.63).',
      externalVulnerability: 'South Africa faces significant external vulnerabilities. Current account deficit is projected at ~2% of GDP (manageable). Foreign debt is ~40% of GDP (manageable but rising). Exports are diversified but vulnerable to commodity prices — minerals account for ~50% of exports. Foreign direct investment is declining due to instability. Capital flight is a concern. Energy crisis is constraining economic growth.',
      politicalEconomy: 'Government\'s economic agenda prioritizes growth, employment, and energy security. However, energy crisis is constraining growth and investment. Infrastructure investment is a priority but faces fiscal constraints. State enterprises are inefficient and drain fiscal resources. Labor market is rigid due to union power. Skills shortage is severe. However, political instability and corruption are deterring investment.',
    },
    security: {
      internal: 'Internal security challenges are significant. Crime rates are very high — murder rate is ~35 per 100,000 (very high), robbery and assault are endemic. Gang violence is endemic in urban areas, particularly in Western Cape. Xenophobic violence occurs periodically. The police force (SAPS) is under-resourced and faces corruption allegations. The military is professional but faces resource constraints. Terrorism threat is low. Border security is challenged by migration and smuggling. Civil liberties are generally respected but police brutality is a concern.',
      diplomacy: 'South Africa is regional leader in Africa. BRICS member with pragmatic engagement with China and Russia. Balances Western ties with BRICS membership. Active in African Union and SADC. Seeks to maintain regional influence and African leadership. Relations with Western countries are pragmatic but increasingly strained over geopolitical issues. Increasingly assertive on international issues.',
    },
    actors: {
      domestic: [
        {
          name: 'President Cyril Ramaphosa & ANC',
          interests: 'Maintain political control, manage coalition government, address energy crisis, restore economic growth, manage corruption',
          resources: 'Presidential authority, ANC party machinery (declining), government apparatus, international support',
          constraints: 'Declining ANC support, coalition government instability, energy crisis, corruption allegations, internal party opposition',
          likelyMoves: 'Manage coalition government, address energy crisis, pursue anti-corruption agenda, seek international support',
          dealability: 'Medium — Ramaphosa is pragmatic on economic issues but faces internal party constraints.',
        },
        {
          name: 'Opposition Parties & Civil Society',
          interests: 'Challenge ANC dominance, improve service delivery, address unemployment and inequality, restore institutional integrity',
          resources: 'Electoral support, grassroots networks, international advocacy, media platforms, institutional positions',
          constraints: 'Fragmentation, limited resources, ANC dominance, institutional constraints',
          likelyMoves: 'Challenge government policies through parliament, advocate for reform, organize protests, build electoral support',
          dealability: 'Medium — opposition is fragmented but increasingly influential in coalition government.',
        },
        {
          name: 'Military & Police (SANDF & SAPS)',
          interests: 'Maintain institutional power, address crime and security challenges, manage resources, maintain professional standards',
          resources: 'Military capability, police authority, security apparatus, professional expertise',
          constraints: 'Resource constraints, corruption allegations, political pressure, crime challenges',
          likelyMoves: 'Conduct security operations, manage crime, maintain institutional integrity, seek resources',
          dealability: 'Medium — military and police are professional but face significant constraints.',
        },
        {
          name: 'Business & Private Sector',
          interests: 'Maintain business-friendly policies, ensure economic growth, address energy crisis, attract investment',
          resources: 'Capital, employment, investment, political influence, international connections',
          constraints: 'Energy crisis, economic slowdown, political instability, crime, labor costs',
          likelyMoves: 'Lobby for business-friendly policies, seek government support, invest in energy solutions, manage risks',
          dealability: 'High — business is pragmatic and aligned with growth agenda.',
        },
        {
          name: 'Labor Unions & Workers',
          interests: 'Protect worker rights, improve wages and conditions, address unemployment, maintain union power',
          resources: 'Strike power, grassroots mobilization, political influence, international connections',
          constraints: 'High unemployment, economic pressures, government constraints, political divisions',
          likelyMoves: 'Organize strikes and protests, negotiate with government, advocate for worker protection, resist privatization',
          dealability: 'Low-Medium — unions are powerful but face economic constraints.',
        },
      ],
      external: [
        {
          name: 'United States & Western Countries',
          interests: 'Maintain South Africa as partner, counter Chinese influence, support democracy and human rights, ensure regional stability',
          resources: 'Trade access, investment, diplomatic leverage, development aid, military cooperation',
          constraints: 'South Africa\'s BRICS membership, pragmatic China engagement, limited economic weight',
          likelyMoves: 'Maintain trade and investment, pressure on democracy and human rights, coordinate on regional issues, counter China',
          dealability: 'Medium — South Africa values Western partnership but maintains BRICS engagement.',
        },
        {
          name: 'China & Russia',
          interests: 'Expand economic influence, counter Western influence, secure resource access, expand geopolitical partnership',
          resources: 'Capital investment, trade access, military cooperation, diplomatic leverage, energy partnerships',
          constraints: 'Western competition, South Africa\'s democratic institutions, limited geopolitical alignment',
          likelyMoves: 'Expand investment and trade, provide military cooperation, coordinate on geopolitical issues, counter Western influence',
          dealability: 'Medium-High — South Africa values BRICS partnership and pragmatic engagement.',
        },
        {
          name: 'African Union & Regional Partners (SADC)',
          interests: 'Maintain South Africa as regional leader, ensure regional stability, coordinate on African issues',
          resources: 'Regional influence, institutional forums, diplomatic leverage, development cooperation',
          constraints: 'South Africa\'s internal challenges, limited economic resources, competing regional interests',
          likelyMoves: 'Coordinate on regional issues, provide development assistance, support African initiatives, maintain leadership',
          dealability: 'High — South Africa is committed to regional leadership and African integration.',
        },
        {
          name: 'International Donors & Development Partners',
          interests: 'Support economic development, address unemployment and inequality, strengthen institutions, ensure stability',
          resources: 'Development aid, technical expertise, capacity building, international networks',
          constraints: 'Limited effectiveness, resource constraints, political constraints, governance challenges',
          likelyMoves: 'Provide development assistance, support institutional reform, coordinate on development issues, advocate for reform',
          dealability: 'Medium — donors are committed but face governance challenges.',
        },
        {
          name: 'European Union',
          interests: 'Maintain South Africa as strategic partner, support democracy and human rights, ensure regional stability',
          resources: 'Trade access, investment, diplomatic leverage, development aid, technical expertise',
          constraints: 'South Africa\'s BRICS membership, pragmatic China engagement, limited economic weight',
          likelyMoves: 'Maintain trade and investment, pressure on democracy and human rights, coordinate on regional issues',
          dealability: 'Medium — EU seeks partnership but faces tensions over geopolitical issues.',
        },
      ],
    },
    risks: [
      {
        title: 'Energy Crisis Deepening & Economic Collapse',
        trigger: 'Energy crisis worsening with extended power cuts triggering economic contraction and investment collapse',
        probability: 'High',
        impact: 'High',
        timeHorizon: '6-12 months',
        leadingIndicators: 'Electricity supply trends, load shedding patterns, power generation capacity, investment flows',
        mitigants: 'Energy infrastructure investment, renewable energy expansion, demand management, international support',
        lastAssessed: 'April 2026',
      },
      {
        title: 'Coalition Government Fragmentation & Political Crisis',
        trigger: 'Coalition government collapse or major fragmentation due to policy disagreements or internal conflicts',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '6-18 months',
        leadingIndicators: 'Coalition dynamics, ANC internal politics, opposition party positioning, parliamentary votes',
        mitigants: 'Coalition management, policy consensus, institutional mechanisms, electoral stability',
        lastAssessed: 'April 2026',
      },
      {
        title: 'Unemployment Crisis & Social Unrest Escalation',
        trigger: 'Unemployment surge or major social unrest escalation due to economic pressures and service delivery failures',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '6-18 months',
        leadingIndicators: 'Unemployment trends, protest activity, social unrest indicators, service delivery metrics',
        mitigants: 'Job creation programs, social spending, service delivery improvements, police operations',
        lastAssessed: 'April 2026',
      },
      {
        title: 'Rand Depreciation & Capital Flight',
        trigger: 'Rapid rand depreciation or capital flight due to economic concerns and political instability',
        probability: 'Med',
        impact: 'Med',
        timeHorizon: '6-18 months',
        leadingIndicators: 'Currency movements, capital flows, inflation trends, interest rate differentials',
        mitigants: 'Central bank intervention, monetary policy tightening, capital controls, IMF support',
        lastAssessed: 'April 2026',
      },
      {
        title: 'Crime Wave & Security Deterioration',
        trigger: 'Major crime escalation or security deterioration affecting business confidence and investment',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '6-18 months',
        leadingIndicators: 'Crime statistics, security incidents, business confidence, investment flows',
        mitigants: 'Police operations, security improvements, business initiatives, international cooperation',
        lastAssessed: 'April 2026',
      },
      {
        title: 'Corruption Scandal & Institutional Crisis',
        trigger: 'Major corruption scandal or institutional crisis affecting government credibility and stability',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '6-18 months',
        leadingIndicators: 'Corruption investigations, institutional crises, media coverage, public confidence',
        mitigants: 'Anti-corruption efforts, institutional reform, transparency, accountability mechanisms',
        lastAssessed: 'April 2026',
      },
    ],
    sources: [
      {
        name: 'South African Reserve Bank (SARB)',
        url: 'https://www.resbank.co.za',
        desc: 'Official central bank data on monetary policy, inflation, exchange rates, financial stability',
      },
      {
        name: 'Statistics South Africa (StatsSA)',
        url: 'https://www.statssa.gov.za',
        desc: 'National statistics — GDP, employment, trade, inflation, population data',
      },
      {
        name: 'IMF South Africa Article IV Consultation',
        url: 'https://www.imf.org',
        desc: 'IMF macroeconomic assessment and policy recommendations',
      },
      {
        name: 'SIPRI Military Expenditure Database',
        url: 'https://www.sipri.org',
        desc: 'Military spending and arms transfer data',
      },
      {
        name: 'ACLED (Armed Conflict Location & Event Data)',
        url: 'https://acleddata.com',
        desc: 'Real-time conflict and violence data tracking crime and security incidents',
      },
      {
        name: 'Freedom House South Africa Report',
        url: 'https://freedomhouse.org',
        desc: 'Assessment of political rights, civil liberties, press freedom in South Africa',
      },
      {
        name: 'Brookings Institution Africa Program',
        url: 'https://www.brookings.edu',
        desc: 'Analysis of South African politics, economics, and regional affairs',
      },
      {
        name: 'South African Media & International Coverage',
        url: 'https://www.news24.com',
        desc: 'Media coverage of South African politics, economics, and social issues',
      },
    ],
  },
  fr: {
    executiveSnapshot: [
      'Type de régime : Démocratie parlementaire avec système présidentiel. Le président Cyril Ramaphosa dirige le gouvernement (depuis 2018). Le Parlement a deux chambres (Assemblée nationale et Conseil national des provinces). Les institutions démocratiques existent mais sont sous tension. La société civile est active. L\'armée est professionnelle et subordonnée au gouvernement civil. L\'ANC (Congrès national africain) a dominé la politique depuis 1994 mais est en déclin en termes de soutien électoral.',
      'Équilibre politique : L\'Afrique du Sud est en transition politique. La dominance électorale de l\'ANC s\'érode — elle est tombée en dessous de 50% pour la première fois aux élections de 2024. Les gouvernements de coalition sont maintenant nécessaires. Ramaphosa fait face à l\'opposition interne de l\'ANC et aux accusations de corruption. L\'opposition est fragmentée. La société civile est active mais divisée. La stabilité politique est modérée mais en déclin. La planification de la succession au sein de l\'ANC est contestée.',
      'Modèle économique : Économie à revenu intermédiaire supérieur (PIB de 470 milliards de dollars, ~8 000 dollars par habitant). Économie diversifiée avec exploitation minière, fabrication, services et agriculture. Cependant, le chômage est très élevé (~30%), l\'inégalité est extrême (Gini ~0,63) et la pauvreté est généralisée (~30%). La crise énergétique est aiguë — l\'approvisionnement en électricité est limité. Les infrastructures sont vieillissantes. Les pressions budgétaires augmentent.',
      'Top 3 risques (6–18 mois) : (1) Crise énergétique s\'aggravant ou délestages s\'aggravant ; (2) Instabilité politique due à la fragmentation du gouvernement de coalition ; (3) Crise du chômage ou escalade des troubles sociaux.',
      'Top 3 éléments de surveillance (4–12 semaines) : (1) Tendances de l\'approvisionnement en électricité et délestages ; (2) Stabilité du gouvernement de coalition et dynamique interne de l\'ANC ; (3) Indicateurs du chômage et des troubles sociaux.',
      'Dépendances externes : Les exportations sont diversifiées (minéraux, agriculture, produits manufacturés) mais vulnérables aux prix des matières premières. Les transferts de fonds sont modestes (~2 milliards de dollars annuellement). L\'investissement direct étranger est important mais en déclin en raison de l\'instabilité. Le service de la dette est gérable (~15% des revenus). Le tourisme est important mais perturbé par la criminalité et l\'instabilité.',
      'Posture de sécurité : Les défis de sécurité intérieure sont importants — les taux de criminalité sont très élevés, la violence des gangs est endémique dans les zones urbaines, la violence xénophobe se produit périodiquement. La police est sous-dotée en ressources et fait face aux accusations de corruption. L\'armée est professionnelle mais fait face aux contraintes de ressources. La menace du terrorisme est faible. La sécurité des frontières est mise au défi par la migration et la contrebande.',
      'Orientation diplomatique : Leader régional en Afrique. Membre des BRICS avec engagement pragmatique avec la Chine et la Russie. Équilibre les liens occidentaux avec l\'adhésion aux BRICS. Actif à l\'Union africaine et à la SADC. Cherche à maintenir l\'influence régionale et le leadership africain. De plus en plus affirmé sur les questions géopolitiques.',
      'Confiance des données : Moyen-Élevé — l\'Afrique du Sud publie des données macroéconomiques et dispose de capacité institutionnelle. Cependant, les données politiques/sécurité sont moins transparentes. Les statistiques criminelles sont contestées.',
      'Perspective de base : Difficile et se détériorant. La crise énergétique est aiguë et s\'aggrave. La transition politique vers un gouvernement de coalition est déstabilisante. Le chômage et l\'inégalité restent graves. Le défi clé est de gérer la crise énergétique tout en stabilisant le gouvernement de coalition et en répondant au chômage. Sans réforme importante, la situation continuera à se détériorer.',
    ],
    political: {
      powerStructure: 'Le président Cyril Ramaphosa détient le pouvoir exécutif mais fait face à l\'opposition interne de l\'ANC et au déclin du soutien du parti. Le Parlement (Assemblée nationale et Conseil national des provinces) est maintenant plus fragmenté — le gouvernement de coalition est nécessaire. La magistrature est indépendante mais fait face à la pression politique. La police et l\'armée sont subordonnées au gouvernement civil. Les gouvernements locaux ont une autonomie importante mais sont souvent dysfonctionnels. La fonction publique est importante mais fait face aux contraintes de capacité.',
      stabilityDrivers: 'La légitimité repose sur les institutions démocratiques et le rôle historique de l\'ANC dans la lutte de libération. Cependant, cela s\'érode en raison de la corruption, des échecs de la prestation de services et du déclin économique. L\'armée est loyale au gouvernement civil. La fonction publique met en œuvre les directives gouvernementales. Cependant, l\'opposition est fragmentée et le gouvernement de coalition est instable. La société civile est active mais divisée.',
      shockAbsorbers: 'Amortisseurs : Institutions démocratiques et cadre constitutionnel. Armée et forces de sécurité professionnelles. Société civile active. Intégration économique régionale. Accélérateurs : L\'approfondissement de la crise énergétique déclencherait une crise économique. L\'effondrement du gouvernement de coalition créerait une crise politique. Une augmentation majeure du chômage ou des troubles sociaux déstabiliseraient le gouvernement. Une catastrophe naturelle ou une pandémie dépasseraient la capacité faible.',
    },
    economy: {
      macroReality: 'La croissance du PIB est prévue à 1-2% pour 2025-2026 (FMI) — faible et en dessous du potentiel. L\'inflation est projetée à ~5% (modérée). Le déficit budgétaire est projeté à ~4% du PIB (en hausse). La dette publique s\'élève à ~75% du PIB (élevée et en hausse). Le rand sud-africain s\'est déprécié ~10% par rapport au dollar américain depuis fin 2024 en raison des sorties de capitaux et des préoccupations économiques. Le chômage est ~30% (très élevé). La pauvreté est ~30% de la population. L\'inégalité est extrême (Gini ~0,63).',
      externalVulnerability: 'L\'Afrique du Sud fait face à des vulnérabilités externes importantes. Le déficit du compte courant est projeté à ~2% du PIB (gérable). La dette étrangère est ~40% du PIB (gérable mais en hausse). Les exportations sont diversifiées mais vulnérables aux prix des matières premières — les minéraux représentent ~50% des exportations. L\'investissement direct étranger est en déclin en raison de l\'instabilité. La fuite des capitaux est une préoccupation. La crise énergétique limite la croissance économique.',
      politicalEconomy: 'L\'agenda économique du gouvernement privilégie la croissance, l\'emploi et la sécurité énergétique. Cependant, la crise énergétique limite la croissance et l\'investissement. L\'investissement dans les infrastructures est une priorité mais fait face aux contraintes budgétaires. Les entreprises d\'État sont inefficaces et drainent les ressources budgétaires. Le marché du travail est rigide en raison du pouvoir des syndicats. La pénurie de compétences est grave. Cependant, l\'instabilité politique et la corruption découragent l\'investissement.',
    },
    security: {
      internal: 'Les défis de sécurité intérieure sont importants. Les taux de criminalité sont très élevés — le taux de meurtre est ~35 pour 100 000 (très élevé), le vol et l\'agression sont endémiques. La violence des gangs est endémique dans les zones urbaines, particulièrement au Cap-Occidental. La violence xénophobe se produit périodiquement. La police (SAPS) est sous-dotée en ressources et fait face aux accusations de corruption. L\'armée est professionnelle mais fait face aux contraintes de ressources. La menace du terrorisme est faible. La sécurité des frontières est mise au défi par la migration et la contrebande. Les libertés civiles sont généralement respectées mais la brutalité policière est une préoccupation.',
      diplomacy: 'L\'Afrique du Sud est leader régional en Afrique. Membre des BRICS avec engagement pragmatique avec la Chine et la Russie. Équilibre les liens occidentaux avec l\'adhésion aux BRICS. Actif à l\'Union africaine et à la SADC. Cherche à maintenir l\'influence régionale et le leadership africain. Les relations avec les pays occidentaux sont pragmatiques mais de plus en plus tendues sur les questions géopolitiques. De plus en plus affirmé sur les questions internationales.',
    },
    actors: {
      domestic: [
        {
          name: 'Président Cyril Ramaphosa et ANC',
          interests: 'Maintenir le contrôle politique, gérer le gouvernement de coalition, répondre à la crise énergétique, restaurer la croissance économique, gérer la corruption',
          resources: 'Autorité présidentielle, machine du parti ANC (en déclin), appareil gouvernemental, soutien international',
          constraints: 'Soutien de l\'ANC en déclin, instabilité du gouvernement de coalition, crise énergétique, accusations de corruption, opposition interne du parti',
          likelyMoves: 'Gérer le gouvernement de coalition, répondre à la crise énergétique, poursuivre l\'agenda anti-corruption, chercher le soutien international',
          dealability: 'Moyen — Ramaphosa est pragmatique sur les questions économiques mais fait face aux contraintes internes du parti.',
        },
        {
          name: 'Partis d\'opposition et société civile',
          interests: 'Contester la dominance de l\'ANC, améliorer la prestation de services, répondre au chômage et à l\'inégalité, restaurer l\'intégrité institutionnelle',
          resources: 'Soutien électoral, réseaux de base, plaidoyer international, plateformes médiatiques, positions institutionnelles',
          constraints: 'Fragmentation, ressources limitées, dominance de l\'ANC, contraintes institutionnelles',
          likelyMoves: 'Contester les politiques gouvernementales par le parlement, plaider pour la réforme, organiser les protestations, construire le soutien électoral',
          dealability: 'Moyen — l\'opposition est fragmentée mais de plus en plus influente dans le gouvernement de coalition.',
        },
        {
          name: 'Armée et police (SANDF et SAPS)',
          interests: 'Maintenir le pouvoir institutionnel, répondre aux défis de criminalité et de sécurité, gérer les ressources, maintenir les normes professionnelles',
          resources: 'Capacité militaire, autorité policière, appareil de sécurité, expertise professionnelle',
          constraints: 'Contraintes de ressources, accusations de corruption, pression politique, défis criminels',
          likelyMoves: 'Mener les opérations de sécurité, gérer la criminalité, maintenir l\'intégrité institutionnelle, chercher les ressources',
          dealability: 'Moyen — l\'armée et la police sont professionnelles mais font face à des contraintes importantes.',
        },
        {
          name: 'Secteur des affaires et secteur privé',
          interests: 'Maintenir les politiques favorables aux entreprises, assurer la croissance économique, répondre à la crise énergétique, attirer l\'investissement',
          resources: 'Capital, emploi, investissement, influence politique, connexions internationales',
          constraints: 'Crise énergétique, ralentissement économique, instabilité politique, criminalité, coûts de main-d\'œuvre',
          likelyMoves: 'Faire du lobbying pour les politiques favorables aux entreprises, chercher le soutien gouvernemental, investir dans les solutions énergétiques, gérer les risques',
          dealability: 'Élevé — les entreprises sont pragmatiques et alignées avec l\'agenda de croissance.',
        },
        {
          name: 'Syndicats et travailleurs',
          interests: 'Protéger les droits des travailleurs, améliorer les salaires et les conditions, répondre au chômage, maintenir le pouvoir des syndicats',
          resources: 'Pouvoir de grève, mobilisation de base, influence politique, connexions internationales',
          constraints: 'Chômage élevé, pressions économiques, contraintes gouvernementales, divisions politiques',
          likelyMoves: 'Organiser les grèves et les protestations, négocier avec le gouvernement, plaider pour la protection des travailleurs, résister à la privatisation',
          dealability: 'Faible-Moyen — les syndicats sont puissants mais font face aux contraintes économiques.',
        },
      ],
      external: [
        {
          name: 'États-Unis et pays occidentaux',
          interests: 'Maintenir l\'Afrique du Sud comme partenaire, contrer l\'influence chinoise, soutenir la démocratie et les droits de l\'homme, assurer la stabilité régionale',
          resources: 'Accès commercial, investissement, levier diplomatique, aide au développement, coopération militaire',
          constraints: 'Adhésion aux BRICS de l\'Afrique du Sud, engagement pragmatique avec la Chine, poids économique limité',
          likelyMoves: 'Maintenir le commerce et l\'investissement, faire pression sur la démocratie et les droits de l\'homme, coordonner sur les questions régionales, contrer la Chine',
          dealability: 'Moyen — l\'Afrique du Sud valorise le partenariat occidental mais maintient l\'engagement aux BRICS.',
        },
        {
          name: 'Chine et Russie',
          interests: 'Élargir l\'influence économique, contrer l\'influence occidentale, sécuriser l\'accès aux ressources, élargir le partenariat géopolitique',
          resources: 'Investissement en capital, accès commercial, coopération militaire, levier diplomatique, partenariats énergétiques',
          constraints: 'Concurrence occidentale, institutions démocratiques de l\'Afrique du Sud, alignement géopolitique limité',
          likelyMoves: 'Élargir l\'investissement et le commerce, fournir la coopération militaire, coordonner sur les questions géopolitiques, contrer l\'influence occidentale',
          dealability: 'Moyen-Élevé — l\'Afrique du Sud valorise le partenariat aux BRICS et l\'engagement pragmatique.',
        },
        {
          name: 'Union africaine et partenaires régionaux (SADC)',
          interests: 'Maintenir l\'Afrique du Sud comme leader régional, assurer la stabilité régionale, coordonner sur les questions africaines',
          resources: 'Influence régionale, forums institutionnels, levier diplomatique, coopération au développement',
          constraints: 'Défis internes de l\'Afrique du Sud, ressources économiques limitées, intérêts régionaux concurrents',
          likelyMoves: 'Coordonner sur les questions régionales, fournir l\'assistance au développement, soutenir les initiatives africaines, maintenir le leadership',
          dealability: 'Élevé — l\'Afrique du Sud est engagée dans le leadership régional et l\'intégration africaine.',
        },
        {
          name: 'Donateurs internationaux et partenaires de développement',
          interests: 'Soutenir le développement économique, répondre au chômage et à l\'inégalité, renforcer les institutions, assurer la stabilité',
          resources: 'Aide au développement, expertise technique, renforcement des capacités, réseaux internationaux',
          constraints: 'Efficacité limitée, contraintes de ressources, contraintes politiques, défis de gouvernance',
          likelyMoves: 'Fournir l\'assistance au développement, soutenir la réforme institutionnelle, coordonner sur les questions de développement, plaider pour la réforme',
          dealability: 'Moyen — les donateurs sont engagés mais font face aux défis de gouvernance.',
        },
        {
          name: 'Union européenne',
          interests: 'Maintenir l\'Afrique du Sud comme partenaire stratégique, soutenir la démocratie et les droits de l\'homme, assurer la stabilité régionale',
          resources: 'Accès commercial, investissement, levier diplomatique, aide au développement, expertise technique',
          constraints: 'Adhésion aux BRICS de l\'Afrique du Sud, engagement pragmatique avec la Chine, poids économique limité',
          likelyMoves: 'Maintenir le commerce et l\'investissement, faire pression sur la démocratie et les droits de l\'homme, coordonner sur les questions régionales',
          dealability: 'Moyen — l\'UE cherche le partenariat mais fait face aux tensions sur les questions géopolitiques.',
        },
      ],
    },
    risks: [
      {
        title: 'Crise énergétique s\'aggravant et effondrement économique',
        trigger: 'Crise énergétique s\'aggravant avec délestages prolongés déclenchant la contraction économique et l\'effondrement de l\'investissement',
        probability: 'High',
        impact: 'High',
        timeHorizon: '6-12 mois',
        leadingIndicators: 'Tendances de l\'approvisionnement en électricité, modèles de délestage, capacité de génération d\'électricité, flux d\'investissement',
        mitigants: 'Investissement dans les infrastructures énergétiques, expansion des énergies renouvelables, gestion de la demande, soutien international',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Fragmentation du gouvernement de coalition et crise politique',
        trigger: 'Effondrement du gouvernement de coalition ou fragmentation majeure due aux désaccords politiques ou aux conflits internes',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '6-18 mois',
        leadingIndicators: 'Dynamique de coalition, politique interne de l\'ANC, positionnement du parti d\'opposition, votes parlementaires',
        mitigants: 'Gestion de la coalition, consensus politique, mécanismes institutionnels, stabilité électorale',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Crise du chômage et escalade des troubles sociaux',
        trigger: 'Augmentation du chômage ou escalade majeure des troubles sociaux en raison des pressions économiques et des échecs de prestation de services',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '6-18 mois',
        leadingIndicators: 'Tendances du chômage, activité de protestation, indicateurs de troubles sociaux, métriques de prestation de services',
        mitigants: 'Programmes de création d\'emplois, dépenses sociales, améliorations de la prestation de services, opérations policières',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Dépréciation du rand et fuite des capitaux',
        trigger: 'Dépréciation rapide du rand ou fuite des capitaux en raison des préoccupations économiques et de l\'instabilité politique',
        probability: 'Med',
        impact: 'Med',
        timeHorizon: '6-18 mois',
        leadingIndicators: 'Mouvements des devises, flux de capitaux, tendances d\'inflation, différentiels de taux d\'intérêt',
        mitigants: 'Intervention de la banque centrale, resserrement de la politique monétaire, contrôles de capitaux, soutien du FMI',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Vague de criminalité et détérioration de la sécurité',
        trigger: 'Escalade majeure de la criminalité ou détérioration de la sécurité affectant la confiance commerciale et l\'investissement',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '6-18 mois',
        leadingIndicators: 'Statistiques criminelles, incidents de sécurité, confiance commerciale, flux d\'investissement',
        mitigants: 'Opérations policières, améliorations de la sécurité, initiatives commerciales, coopération internationale',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Scandale de corruption et crise institutionnelle',
        trigger: 'Scandale majeur de corruption ou crise institutionnelle affectant la crédibilité gouvernementale et la stabilité',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '6-18 mois',
        leadingIndicators: 'Enquêtes sur la corruption, crises institutionnelles, couverture médiatique, confiance publique',
        mitigants: 'Efforts anti-corruption, réforme institutionnelle, transparence, mécanismes de responsabilité',
        lastAssessed: 'Avril 2026',
      },
    ],
    sources: [
      {
        name: 'Banque de réserve sud-africaine (SARB)',
        url: 'https://www.resbank.co.za',
        desc: 'Données officielles de la banque centrale sur la politique monétaire, l\'inflation, les taux de change, la stabilité financière',
      },
      {
        name: 'Statistiques Afrique du Sud (StatsSA)',
        url: 'https://www.statssa.gov.za',
        desc: 'Statistiques nationales — PIB, emploi, commerce, inflation, données démographiques',
      },
      {
        name: 'Consultation de l\'article IV du FMI sur l\'Afrique du Sud',
        url: 'https://www.imf.org',
        desc: 'Évaluation macroéconomique du FMI et recommandations politiques',
      },
      {
        name: 'Base de données des dépenses militaires du SIPRI',
        url: 'https://www.sipri.org',
        desc: 'Données sur les dépenses militaires et les transferts d\'armes',
      },
      {
        name: 'ACLED (Armed Conflict Location & Event Data)',
        url: 'https://acleddata.com',
        desc: 'Données en temps réel sur les conflits et la violence suivant la criminalité et les incidents de sécurité',
      },
      {
        name: 'Rapport Afrique du Sud de Freedom House',
        url: 'https://freedomhouse.org',
        desc: 'Évaluation des droits politiques, des libertés civiles, de la liberté de la presse en Afrique du Sud',
      },
      {
        name: 'Programme Afrique de l\'institution Brookings',
        url: 'https://www.brookings.edu',
        desc: 'Analyse de la politique, de l\'économie et des affaires régionales de l\'Afrique du Sud',
      },
      {
        name: 'Médias sud-africains et couverture internationale',
        url: 'https://www.news24.com',
        desc: 'Couverture médiatique de la politique, de l\'économie et des questions sociales de l\'Afrique du Sud',
      },
    ],
  },
};
