/*
 * TransHorizons — New Zealand Country Analysis Data
 * Full bilingual content following the Country Situation Report framework
 * Focus: Pacific regional power, AUKUS partner, China-US competition, trade vulnerability, institutional stability
 * Last updated: April 2026
 * Sources: Reserve Bank of NZ, Stats NZ, IMF, World Bank, SIPRI, ACLED, Freedom House, Lowy Institute
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

export const newZealandAnalysis: AnalysisContent = {
  lastUpdated: '2026-04-15',
  scorecard: {
    eliteCohesion: 'High',
    securityLoyalty: 'High',
    economicPressure: 'Med',
    protestCapacity: 'Med',
    institutionalResilience: 'High',
  },
  en: {
    executiveSnapshot: [
      'Regime type: Parliamentary democracy (Westminster model). Christopher Luxon (National Party) became Prime Minister in November 2023 after Labour lost power. Coalition government with ACT and New Zealand First. Institutional checks are robust and democratic norms are strong.',
      'Political equilibrium: The National-ACT-NZ First coalition controls Parliament with 61 of 120 seats. Labour is in opposition but remains a credible alternative government. The Greens and Māori Party hold smaller blocs. Political competition is healthy and power transitions are orderly. Māori representation and indigenous rights remain contentious political issues.',
      'Economic model: High-income developed economy ($300 billion GDP). Heavily dependent on agriculture (dairy, meat, wine), tourism, and forestry exports. Immigration-driven population growth. Financial services and tech sectors growing. Significant trade dependency on China, Australia, and other partners. Cost of living crisis has become a major political issue.',
      'Top 3 risks (6–18 months): (1) Economic slowdown from global trade disruption or China demand collapse affecting agriculture/tourism; (2) China-Taiwan conflict disrupting Indo-Pacific stability and trade; (3) Domestic political polarization over immigration, cost of living, and Māori rights.',
      'Top 3 watch items (4–12 weeks): (1) Coalition government stability — ACT and NZ First are volatile partners; (2) Cost of living pressures and inflation trajectory; (3) China-NZ trade tensions — agricultural export market vulnerability.',
      'External dependencies: 80% of exports go to five major partners (China, Australia, EU, US, Japan). Agriculture is vulnerable to climate shocks and trade disruption. Tourism sector dependent on international travel. Immigration provides labor supply and population growth but is politically contentious. Defense dependent on US alliance (ANZUS) and Five Eyes intelligence partnership.',
      'Security posture: No standing military threats. Small but capable military (primarily focused on regional peacekeeping and disaster relief). Nuclear-free policy (no nuclear weapons or nuclear-powered ships). Close intelligence partnership with US, UK, Canada, Australia (Five Eyes). Cybersecurity and critical infrastructure protection are growing concerns.',
      'Diplomatic orientation: Core Western ally but maintaining pragmatic engagement with China. AUKUS partner (trilateral security arrangement with Australia and US). ANZUS ally. Pacific regional leader. Non-aligned on some issues (e.g., refused to explicitly condemn Russia on Ukraine initially). Balancing act between US security partnership and China economic dependence.',
      'Data confidence: High — New Zealand has excellent institutional data (Stats NZ, Reserve Bank) and a free press. Transparency and institutional quality are high.',
      'Baseline outlook: Stable and prosperous but vulnerable to external shocks. The coalition government will likely hold through 2026-2027 elections. Economic growth will moderate but remain positive. Political polarization will increase but democratic institutions will hold. The key challenge is managing China-US competition while maintaining economic ties with China.',
    ],
    political: {
      powerStructure: 'Prime Minister holds executive power but is constrained by coalition partners and Parliament. The Parliament is unicameral (120 seats) with proportional representation. The Governor-General is ceremonial. The judiciary is independent and has shown willingness to challenge executive actions. The civil service is professional and politically neutral. Local government is separate and has significant autonomy. The Māori representation system (separate electoral roll) ensures indigenous voice but remains contentious. The coalition government requires consensus among three parties (National, ACT, NZ First), which constrains executive power.',
      stabilityDrivers: 'Legitimacy rests on democratic elections, rule of law, and economic prosperity. New Zealand ranks highly on transparency and institutional quality indices. Power transitions are orderly and accepted. The judiciary is independent and respected. Civil society is vibrant and mobilizes around issues (climate, indigenous rights, cost of living). The armed forces are loyal to the democratic constitution. However, political polarization is increasing — immigration, cost of living, and indigenous rights are becoming more contentious. The coalition government\'s stability depends on managing partner demands.',
      shockAbsorbers: 'Absorbers: Developed economy with strong institutions and rule of law. Diversified economy (agriculture, tourism, finance, tech). Foreign exchange reserves and manageable debt levels. Flexible labor market and immigration policy. Strong civil society and media. Accelerants: Global trade disruption affecting agriculture/tourism exports. China demand collapse or trade war escalation. China-Taiwan conflict disrupting regional stability. Domestic political polarization preventing consensus on major issues. Climate-related agricultural shocks.',
    },
    economy: {
      macroReality: 'GDP growth forecast 1.5-2% for 2025-2026 (IMF) — moderate but below historical averages. Inflation has moderated to ~3.5% (within Reserve Bank\'s target band of 1-3%) but remains sticky. The fiscal deficit is projected at ~2% of GDP for 2025 (improved from pandemic levels). Public debt stands at ~34% of GDP (manageable). The New Zealand dollar has depreciated ~5% against the US dollar since late 2024 due to interest rate differentials and capital outflows. Unemployment is ~4.5% (relatively low). Cost of living crisis remains a major political issue — housing costs, energy prices, and food inflation have squeezed household budgets.',
      externalVulnerability: 'New Zealand is highly dependent on exports — 80% of exports go to five major partners (China 22%, Australia 16%, EU 10%, US 8%, Japan 7%). Agriculture is the largest export sector and is vulnerable to climate shocks, trade disruption, and Chinese demand fluctuations. Tourism sector is dependent on international travel and is vulnerable to global economic slowdown or geopolitical shocks. Immigration provides labor supply and population growth but is politically contentious and vulnerable to policy changes. The current account deficit is projected at ~3% of GDP (manageable but widening). Sovereign debt is investment-grade (Moody\'s Aa2) but under pressure from fiscal deficits and economic slowdown.',
      politicalEconomy: 'The coalition government\'s economic agenda prioritizes tax cuts (ACT demand), infrastructure investment, and cost of living relief. However, fiscal constraints limit spending flexibility. The government is pursuing free trade agreements (India, EU) to diversify export markets away from China dependency. Agricultural sector faces pressure from climate change and sustainability regulations. The tech sector is growing but remains small. Housing affordability is a major political issue but solutions are contentious. Immigration policy is central to coalition politics — ACT and NZ First have different views. Labor market reforms are ongoing but face union resistance. The government is investing in infrastructure but faces project delays and cost overruns.',
    },
    security: {
      internal: 'Internal security threats are minimal. There is no terrorism threat or insurgency. Violent crime is low by international standards. However, gang violence in urban areas has increased and is a political concern. Cybersecurity and critical infrastructure protection are growing concerns. The government has strengthened cybersecurity frameworks. Domestic dissent is rare and is managed through democratic institutions. The police are professional and politically neutral. The armed forces are small but capable and loyal to the democratic constitution.',
      diplomacy: 'New Zealand is a core Western ally but maintains pragmatic engagement with China. The AUKUS partnership (with Australia and US) is central to regional security strategy. The ANZUS alliance (with Australia and US) remains foundational. New Zealand is a Pacific regional leader and maintains close ties with Pacific island nations. Relations with China are complex — China is the largest export market but there are concerns about Chinese influence and security. New Zealand refused to explicitly condemn Russia on Ukraine initially, reflecting a desire to maintain independent foreign policy. The government is balancing US security partnership with China economic dependence.',
    },
    actors: {
      domestic: [
        {
          name: 'Christopher Luxon (Prime Minister) & National Party',
          interests: 'Maintain coalition stability, implement tax cuts and economic growth agenda, manage cost of living crisis, strengthen security partnerships',
          resources: 'Executive authority, coalition control, party machinery, business support, media relationships',
          constraints: 'Coalition partner demands (ACT, NZ First), opposition pressure, fiscal constraints, economic slowdown',
          likelyMoves: 'Pursue tax cuts, infrastructure investment, free trade agreements, strengthen AUKUS partnership, manage China relations pragmatically',
          dealability: 'High — Luxon is pragmatic and will negotiate with coalition partners on policy priorities.',
        },
        {
          name: 'Coalition Partners (ACT, NZ First)',
          interests: 'Secure policy concessions, maintain coalition stability, protect regional/ideological interests',
          resources: 'Coalition leverage, regional political machines, media platforms',
          constraints: 'Limited independent power, dependence on coalition partners, electoral vulnerability',
          likelyMoves: 'Demand tax cuts (ACT), immigration restrictions (NZ First), regional investment, threaten coalition withdrawal if demands unmet',
          dealability: 'Medium — coalition partners are transactional and will negotiate but threaten instability.',
        },
        {
          name: 'Labour Party (Opposition)',
          interests: 'Regain political power, challenge coalition policies, appeal to cost-of-living concerns, strengthen Māori support',
          resources: 'Opposition control of some local governments, union support, environmental/social movements, electoral bases',
          constraints: 'Loss of parliamentary majority, internal divisions, limited legislative power',
          likelyMoves: 'Mobilize against cost of living, challenge tax cuts, appeal to Māori and environmental constituencies, build coalition for 2026-27 elections',
          dealability: 'Low-Medium — opposition is weakened but will challenge coalition policies through parliamentary and public pressure.',
        },
        {
          name: 'Business & Financial Sector',
          interests: 'Maintain economic growth, reduce regulatory burden, attract investment, manage cost of living pressures',
          resources: 'Capital, employment, international connections, media influence',
          constraints: 'Dependence on government policy, export market vulnerability, labor shortages',
          likelyMoves: 'Lobby for tax cuts, deregulation, immigration flexibility, free trade agreements, infrastructure investment',
          dealability: 'High — business is pragmatic and aligned with National Party on economic growth.',
        },
        {
          name: 'Māori Communities & Indigenous Rights Movement',
          interests: 'Protect Māori rights, increase representation, address historical grievances, improve socioeconomic outcomes',
          resources: 'Electoral representation (Māori seats), civil society networks, international advocacy, media attention',
          constraints: 'Limited political power, institutional barriers, coalition government skepticism',
          likelyMoves: 'Mobilize against policies perceived as anti-Māori, appeal to international bodies, build coalition with Labour and Greens',
          dealability: 'Medium — Māori communities have institutional representation but face coalition government resistance on some issues.',
        },
        {
          name: 'Civil Society & Environmental Movement',
          interests: 'Climate action, environmental protection, cost of living relief, social justice',
          resources: 'Grassroots mobilization, international NGO networks, media attention, moral authority',
          constraints: 'Limited institutional power, coalition government skepticism on climate action, fiscal constraints',
          likelyMoves: 'Mobilize on climate and environmental issues, appeal to Labour and Greens, document government inaction, seek international support',
          dealability: 'Low-Medium — civil society is active but faces coalition government resistance on climate/environmental priorities.',
        },
      ],
      external: [
        {
          name: 'United States',
          interests: 'Maintain New Zealand as Western ally, counter China influence, strengthen AUKUS partnership, maintain regional stability',
          resources: 'Military support, intelligence (Five Eyes), diplomatic leverage, technology',
          constraints: 'New Zealand\'s pragmatic China engagement, desire for independent foreign policy, distance from US',
          likelyMoves: 'Strengthen AUKUS activities, pressure on China policy, expand defense cooperation, technology partnerships',
          dealability: 'High — New Zealand and US are aligned on regional security and AUKUS partnership.',
        },
        {
          name: 'China',
          interests: 'Maintain New Zealand as largest export market, expand economic influence, counter Western security partnerships, secure resources',
          resources: 'Market access, capital investment, economic leverage, diplomatic engagement',
          constraints: 'AUKUS partnership, Five Eyes intelligence sharing, Western security alignment, New Zealand\'s independent foreign policy',
          likelyMoves: 'Maintain trade relationships, expand investment in agriculture/infrastructure, pressure on AUKUS participation, expand cultural exchanges',
          dealability: 'Medium — New Zealand will maintain pragmatic economic engagement with China while balancing Western security partnerships.',
        },
        {
          name: 'Australia',
          interests: 'Regional stability, counter China influence, maintain ANZUS alliance, coordinate on Pacific issues',
          resources: 'Military capability, regional influence, trade partnership, shared security interests',
          constraints: 'New Zealand\'s independent foreign policy, different China engagement approaches',
          likelyMoves: 'Coordinate on AUKUS, regional security, Pacific island relations, trade cooperation',
          dealability: 'High — New Zealand and Australia are close allies with aligned interests on regional security.',
        },
        {
          name: 'Pacific Island Nations',
          interests: 'Regional stability, climate action, economic development, maintain New Zealand support',
          resources: 'Regional influence, voting blocs in international forums, strategic location',
          constraints: 'Economic vulnerability, dependence on aid, climate change threats',
          likelyMoves: 'Seek New Zealand support on climate/development, maintain regional alignment, appeal for aid/investment',
          dealability: 'High — New Zealand is a regional leader and will maintain support for Pacific island nations.',
        },
      ],
    },
    risks: [
      {
        title: 'Global Trade Disruption & Export Collapse',
        trigger: 'US-China trade war escalation, global recession, or Chinese demand collapse affecting agricultural/tourism exports',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '6-18 months',
        leadingIndicators: 'Global trade tensions, China economic growth, agricultural commodity prices, tourism demand',
        mitigants: 'Free trade agreements (India, EU), export diversification, foreign exchange reserves, flexible exchange rate',
        lastAssessed: 'April 2026',
      },
      {
        title: 'China-Taiwan Conflict & Regional Instability',
        trigger: 'Military conflict between China and Taiwan, or escalation of tensions affecting Indo-Pacific stability',
        probability: 'Low',
        impact: 'High',
        timeHorizon: '6-24 months',
        leadingIndicators: 'China military movements, Taiwan political developments, US-China tensions, regional military exercises',
        mitigants: 'AUKUS partnership, US security commitment, diplomatic engagement, regional de-escalation efforts',
        lastAssessed: 'April 2026',
      },
      {
        title: 'Coalition Government Instability',
        trigger: 'Policy disagreement between coalition partners, ACT or NZ First withdrawal, or major political crisis',
        probability: 'Med',
        impact: 'Low',
        timeHorizon: '6-18 months',
        leadingIndicators: 'Coalition partner statements, policy disagreements, political realignment, electoral polling',
        mitigants: 'Shared coalition interests, electoral calculation, compromise on policy priorities',
        lastAssessed: 'April 2026',
      },
      {
        title: 'Cost of Living Crisis & Political Backlash',
        trigger: 'Persistent inflation, housing cost escalation, or energy price spike triggering political pressure',
        probability: 'Med',
        impact: 'Med',
        timeHorizon: '6-12 months',
        leadingIndicators: 'Inflation trends, housing prices, energy prices, public sentiment surveys, political polling',
        mitigants: 'Tax cuts, government spending, monetary policy adjustment, wage growth',
        lastAssessed: 'April 2026',
      },
      {
        title: 'Agricultural Crisis & Climate Shock',
        trigger: 'Severe drought, flooding, or disease outbreak affecting agricultural production',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '6-18 months',
        leadingIndicators: 'Weather forecasts, agricultural production data, commodity prices, climate indicators',
        mitigants: 'Irrigation infrastructure, crop insurance, government support programs, agricultural adaptation',
        lastAssessed: 'April 2026',
      },
      {
        title: 'Political Polarization & Democratic Stress',
        trigger: 'Escalation of polarization over immigration, Māori rights, or cost of living triggering social unrest',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '12-24 months',
        leadingIndicators: 'Political polarization indicators, protest activity, media polarization, public sentiment',
        mitigants: 'Democratic institutions, civil society engagement, media pluralism, political compromise',
        lastAssessed: 'April 2026',
      },
    ],
    sources: [
      {
        name: 'Reserve Bank of New Zealand (RBNZ)',
        url: 'https://www.rbnz.govt.nz',
        desc: 'Official central bank data on monetary policy, inflation, exchange rates, financial stability',
      },
      {
        name: 'Stats NZ (Statistics New Zealand)',
        url: 'https://www.stats.govt.nz',
        desc: 'National statistics — GDP, employment, poverty, inflation, trade data',
      },
      {
        name: 'IMF New Zealand Article IV Consultation',
        url: 'https://www.imf.org',
        desc: 'IMF macroeconomic assessment and policy recommendations',
      },
      {
        name: 'Lowy Institute',
        url: 'https://www.lowyinstitute.org',
        desc: 'Australian think tank with research on New Zealand, Asia-Pacific geopolitics, and regional security',
      },
      {
        name: 'SIPRI Military Expenditure Database',
        url: 'https://www.sipri.org',
        desc: 'Military spending and arms transfer data',
      },
      {
        name: 'Freedom House New Zealand Report',
        url: 'https://freedomhouse.org',
        desc: 'Assessment of political rights, civil liberties, press freedom in New Zealand',
      },
      {
        name: 'New Zealand Foreign Affairs & Defence (MFAT)',
        url: 'https://www.mfat.govt.nz',
        desc: 'Official government foreign policy and defense strategy documents',
      },
      {
        name: 'NZ Media (RNZ, Stuff, NZ Herald)',
        url: 'https://www.rnz.co.nz',
        desc: 'Independent media coverage of New Zealand politics and economics',
      },
    ],
  },
  fr: {
    executiveSnapshot: [
      'Type de régime : Démocratie parlementaire (modèle Westminster). Christopher Luxon (Parti national) est devenu Premier ministre en novembre 2023 après que le Parti travailliste ait perdu le pouvoir. Gouvernement de coalition avec l\'ACT et le Parti de la Nouvelle-Zélande d\'abord. Les contrôles institutionnels sont robustes et les normes démocratiques sont fortes.',
      'Équilibre politique : La coalition nationale-ACT-NZ First contrôle le Parlement avec 61 des 120 sièges. Le Parti travailliste est dans l\'opposition mais reste un gouvernement alternatif crédible. Les Verts et le Parti Māori détiennent des blocs plus petits. La concurrence politique est saine et les transitions de pouvoir sont ordonnées. La représentation Māori et les droits des autochtones restent des questions politiques contentieuses.',
      'Modèle économique : Économie développée à revenu élevé (PIB de 300 milliards de dollars). Fortement dépendante des exportations agricoles (produits laitiers, viande, vin), du tourisme et de la foresterie. Croissance démographique tirée par l\'immigration. Les secteurs des services financiers et de la technologie se développent. Dépendance commerciale importante envers la Chine, l\'Australie et d\'autres partenaires. La crise du coût de la vie est devenue une question politique majeure.',
      'Top 3 risques (6–18 mois) : (1) Ralentissement économique dû à la perturbation du commerce mondial ou à l\'effondrement de la demande chinoise affectant l\'agriculture/tourisme ; (2) Conflit Chine-Taïwan perturbant la stabilité de l\'Indo-Pacifique et le commerce ; (3) Polarisation politique intérieure sur l\'immigration, le coût de la vie et les droits Māori.',
      'Top 3 éléments de surveillance (4–12 semaines) : (1) Stabilité du gouvernement de coalition — l\'ACT et la Nouvelle-Zélande d\'abord sont des partenaires volatiles ; (2) Pressions du coût de la vie et trajectoire d\'inflation ; (3) Tensions commerciales Chine-Nouvelle-Zélande — vulnérabilité du marché d\'exportation agricole.',
      'Dépendances externes : 80% des exportations vont à cinq partenaires majeurs (Chine, Australie, UE, États-Unis, Japon). L\'agriculture est vulnérable aux chocs climatiques et à la perturbation du commerce. Le secteur du tourisme dépend des voyages internationaux. L\'immigration fournit une main-d\'œuvre et une croissance démographique mais est politiquement contentieuse. La défense dépend de l\'alliance américaine (ANZUS) et du partenariat de renseignement Five Eyes.',
      'Posture de sécurité : Aucune menace militaire permanente. Petite armée mais capable (principalement axée sur les opérations de maintien de la paix régionales et l\'aide aux catastrophes). Politique sans armes nucléaires (pas d\'armes nucléaires ou de navires propulsés par l\'énergie nucléaire). Partenariat de renseignement étroit avec les États-Unis, le Royaume-Uni, le Canada, l\'Australie (Five Eyes). La cybersécurité et la protection des infrastructures critiques sont des préoccupations croissantes.',
      'Orientation diplomatique : Allié occidental clé mais maintenant un engagement pragmatique avec la Chine. Partenaire AUKUS (arrangement de sécurité trilatéral avec l\'Australie et les États-Unis). Allié ANZUS. Leader régional du Pacifique. Non-aligné sur certaines questions (par exemple, a refusé de condamner explicitement la Russie sur l\'Ukraine initialement). Équilibre entre le partenariat de sécurité américain et la dépendance économique chinoise.',
      'Confiance des données : Élevé — la Nouvelle-Zélande dispose d\'excellentes données institutionnelles (Stats NZ, Banque de réserve) et d\'une presse libre. La transparence et la qualité institutionnelle sont élevées.',
      'Perspective de base : Stable et prospère mais vulnérable aux chocs externes. Le gouvernement de coalition tiendra probablement jusqu\'aux élections de 2026-2027. La croissance économique se modérera mais restera positive. La polarisation politique augmentera mais les institutions démocratiques tiendront. Le défi clé est de gérer la concurrence Chine-États-Unis tout en maintenant les liens économiques avec la Chine.',
    ],
    political: {
      powerStructure: 'Le Premier ministre détient le pouvoir exécutif mais est limité par les partenaires de coalition et le Parlement. Le Parlement est monocaméral (120 sièges) avec représentation proportionnelle. Le gouverneur général est cérémoniel. La magistrature est indépendante et a montré sa volonté de contester les actions exécutives. La fonction publique est professionnelle et politiquement neutre. Le gouvernement local est séparé et a une autonomie significative. Le système de représentation Māori (rôle électoral séparé) assure la voix autochtone mais reste contentieux. Le gouvernement de coalition exige le consensus entre trois partis (National, ACT, NZ First), ce qui limite le pouvoir exécutif.',
      stabilityDrivers: 'La légitimité repose sur les élections démocratiques, l\'état de droit et la prospérité économique. La Nouvelle-Zélande se classe bien sur les indices de transparence et de qualité institutionnelle. Les transitions de pouvoir sont ordonnées et acceptées. La magistrature est indépendante et respectée. La société civile est dynamique et se mobilise autour de questions (climat, droits des autochtones, coût de la vie). Les forces armées sont loyales à la constitution démocratique. Cependant, la polarisation politique augmente — l\'immigration, le coût de la vie et les droits des autochtones deviennent plus contentieux. La stabilité du gouvernement de coalition dépend de la gestion des demandes des partenaires.',
      shockAbsorbers: 'Amortisseurs : Économie développée avec des institutions fortes et l\'état de droit. Économie diversifiée (agriculture, tourisme, finance, technologie). Réserves de change et niveaux de dette gérables. Marché du travail flexible et politique d\'immigration. Société civile forte et médias. Accélérateurs : Perturbation du commerce mondial affectant les exportations agricoles/tourisme. Effondrement de la demande chinoise ou escalade de la guerre commerciale. Conflit Chine-Taïwan perturbant la stabilité régionale. Polarisation politique intérieure empêchant le consensus sur les questions majeures. Chocs agricoles liés au climat.',
    },
    economy: {
      macroReality: 'La croissance du PIB est prévue à 1,5-2% pour 2025-2026 (FMI) — modérée mais en dessous des moyennes historiques. L\'inflation s\'est modérée à ~3,5% (dans la bande cible de la Banque de réserve de 1-3%) mais reste collante. Le déficit budgétaire est projeté à ~2% du PIB pour 2025 (amélioré par rapport aux niveaux de pandémie). La dette publique s\'élève à ~34% du PIB (gérable). Le dollar néo-zélandais s\'est déprécié ~5% par rapport au dollar américain depuis fin 2024 en raison des différentiels de taux d\'intérêt et des sorties de capitaux. Le chômage est ~4,5% (relativement faible). La crise du coût de la vie reste une question politique majeure — les coûts du logement, les prix de l\'énergie et l\'inflation alimentaire ont comprimé les budgets des ménages.',
      externalVulnerability: 'La Nouvelle-Zélande dépend fortement des exportations — 80% des exportations vont à cinq partenaires majeurs (Chine 22%, Australie 16%, UE 10%, États-Unis 8%, Japon 7%). L\'agriculture est le plus grand secteur d\'exportation et est vulnérable aux chocs climatiques, à la perturbation du commerce et aux fluctuations de la demande chinoise. Le secteur du tourisme dépend des voyages internationaux et est vulnérable au ralentissement économique mondial ou aux chocs géopolitiques. L\'immigration fournit une main-d\'œuvre et une croissance démographique mais est politiquement contentieuse et vulnérable aux changements politiques. Le déficit du compte courant est projeté à ~3% du PIB (gérable mais s\'élargissant). La dette souveraine est de qualité investissement (Moody\'s Aa2) mais sous pression en raison des déficits budgétaires et du ralentissement économique.',
      politicalEconomy: 'L\'agenda économique du gouvernement de coalition privilégie les réductions d\'impôts (demande de l\'ACT), l\'investissement dans les infrastructures et l\'allègement du coût de la vie. Cependant, les contraintes budgétaires limitent la flexibilité des dépenses. Le gouvernement poursuit les accords de libre-échange (Inde, UE) pour diversifier les marchés d\'exportation loin de la dépendance chinoise. Le secteur agricole fait face à la pression du changement climatique et des réglementations de durabilité. Le secteur technologique se développe mais reste petit. L\'accessibilité au logement est une question politique majeure mais les solutions sont contentieuses. La politique d\'immigration est centrale à la politique de coalition — l\'ACT et la Nouvelle-Zélande d\'abord ont des points de vue différents. Les réformes du marché du travail sont en cours mais font face à la résistance des syndicats. Le gouvernement investit dans les infrastructures mais fait face à des retards de projets et à des dépassements de coûts.',
    },
    security: {
      internal: 'Les menaces de sécurité intérieure sont minimes. Il n\'y a pas de menace terroriste ou d\'insurrection. La criminalité violente est faible selon les normes internationales. Cependant, la violence des gangs dans les zones urbaines a augmenté et est une préoccupation politique. La cybersécurité et la protection des infrastructures critiques sont des préoccupations croissantes. Le gouvernement a renforcé les cadres de cybersécurité. La dissidence intérieure est rare et est gérée par les institutions démocratiques. La police est professionnelle et politiquement neutre. Les forces armées sont petites mais capables et loyales à la constitution démocratique.',
      diplomacy: 'La Nouvelle-Zélande est un allié occidental clé mais maintient un engagement pragmatique avec la Chine. Le partenariat AUKUS (avec l\'Australie et les États-Unis) est central à la stratégie de sécurité régionale. L\'alliance ANZUS (avec l\'Australie et les États-Unis) reste fondamentale. La Nouvelle-Zélande est un leader régional du Pacifique et maintient des liens étroits avec les nations insulaires du Pacifique. Les relations avec la Chine sont complexes — la Chine est le plus grand marché d\'exportation mais il y a des préoccupations concernant l\'influence chinoise et la sécurité. La Nouvelle-Zélande a refusé de condamner explicitement la Russie sur l\'Ukraine initialement, reflétant un désir de maintenir une politique étrangère indépendante. Le gouvernement équilibre le partenariat de sécurité américain avec la dépendance économique chinoise.',
    },
    actors: {
      domestic: [
        {
          name: 'Christopher Luxon (Premier ministre) et Parti national',
          interests: 'Maintenir la stabilité de la coalition, mettre en œuvre des réductions d\'impôts et l\'agenda de croissance économique, gérer la crise du coût de la vie, renforcer les partenariats de sécurité',
          resources: 'Autorité exécutive, contrôle de coalition, machine du parti, soutien des entreprises, relations médiatiques',
          constraints: 'Demandes des partenaires de coalition (ACT, NZ First), pression de l\'opposition, contraintes budgétaires, ralentissement économique',
          likelyMoves: 'Poursuivre les réductions d\'impôts, l\'investissement dans les infrastructures, les accords de libre-échange, renforcer le partenariat AUKUS, gérer les relations avec la Chine de manière pragmatique',
          dealability: 'Élevé — Luxon est pragmatique et négociera avec les partenaires de coalition sur les priorités politiques.',
        },
        {
          name: 'Partenaires de coalition (ACT, NZ First)',
          interests: 'Sécuriser les concessions politiques, maintenir la stabilité de la coalition, protéger les intérêts régionaux/idéologiques',
          resources: 'Levier de coalition, machines politiques régionales, plateformes médiatiques',
          constraints: 'Pouvoir indépendant limité, dépendance aux partenaires de coalition, vulnérabilité électorale',
          likelyMoves: 'Exiger des réductions d\'impôts (ACT), des restrictions d\'immigration (NZ First), l\'investissement régional, menacer de retrait de la coalition si les demandes ne sont pas satisfaites',
          dealability: 'Moyen — les partenaires de coalition sont transactionnels et négocieront mais menacent l\'instabilité.',
        },
        {
          name: 'Parti travailliste (Opposition)',
          interests: 'Reprendre le pouvoir politique, contester les politiques de coalition, attirer les préoccupations du coût de la vie, renforcer le soutien Māori',
          resources: 'Contrôle de l\'opposition de certains gouvernements locaux, soutien syndical, mouvements environnementaux/sociaux, bases électorales',
          constraints: 'Perte de majorité parlementaire, divisions internes, pouvoir législatif limité',
          likelyMoves: 'Mobiliser contre le coût de la vie, contester les réductions d\'impôts, attirer les électeurs Māori et environnementaux, construire une coalition pour les élections 2026-27',
          dealability: 'Faible-Moyen — l\'opposition est affaiblie mais contestera les politiques de coalition par la pression parlementaire et publique.',
        },
        {
          name: 'Secteur des affaires et financier',
          interests: 'Maintenir la croissance économique, réduire le fardeau réglementaire, attirer l\'investissement, gérer les pressions du coût de la vie',
          resources: 'Capital, emploi, connexions internationales, influence médiatique',
          constraints: 'Dépendance à la politique gouvernementale, vulnérabilité du marché d\'exportation, pénuries de main-d\'œuvre',
          likelyMoves: 'Faire du lobbying pour les réductions d\'impôts, la déréglementation, la flexibilité de l\'immigration, les accords de libre-échange, l\'investissement dans les infrastructures',
          dealability: 'Élevé — les entreprises sont pragmatiques et alignées avec le Parti national sur la croissance économique.',
        },
        {
          name: 'Communautés Māori et mouvement des droits des autochtones',
          interests: 'Protéger les droits Māori, augmenter la représentation, aborder les griefs historiques, améliorer les résultats socio-économiques',
          resources: 'Représentation électorale (sièges Māori), réseaux de la société civile, plaidoyer international, attention médiatique',
          constraints: 'Pouvoir politique limité, barrières institutionnelles, scepticisme du gouvernement de coalition',
          likelyMoves: 'Mobiliser contre les politiques perçues comme anti-Māori, faire appel aux organismes internationaux, construire une coalition avec le Parti travailliste et les Verts',
          dealability: 'Moyen — les communautés Māori ont une représentation institutionnelle mais font face à la résistance du gouvernement de coalition sur certaines questions.',
        },
        {
          name: 'Société civile et mouvement environnemental',
          interests: 'Action climatique, protection de l\'environnement, allègement du coût de la vie, justice sociale',
          resources: 'Mobilisation de base, réseaux d\'ONG internationales, attention médiatique, autorité morale',
          constraints: 'Pouvoir institutionnel limité, scepticisme du gouvernement de coalition sur l\'action climatique, contraintes budgétaires',
          likelyMoves: 'Mobiliser sur les questions climatiques et environnementales, faire appel au Parti travailliste et aux Verts, documenter l\'inaction gouvernementale, chercher le soutien international',
          dealability: 'Faible-Moyen — la société civile est active mais fait face à la résistance du gouvernement de coalition sur les priorités climatiques/environnementales.',
        },
      ],
      external: [
        {
          name: 'États-Unis',
          interests: 'Maintenir la Nouvelle-Zélande comme allié occidental, contrer l\'influence chinoise, renforcer le partenariat AUKUS, maintenir la stabilité régionale',
          resources: 'Soutien militaire, renseignement (Five Eyes), levier diplomatique, technologie',
          constraints: 'Engagement pragmatique de la Nouvelle-Zélande avec la Chine, désir d\'une politique étrangère indépendante, distance des États-Unis',
          likelyMoves: 'Renforcer les activités AUKUS, faire pression sur la politique chinoise, élargir la coopération de défense, partenariats technologiques',
          dealability: 'Élevé — la Nouvelle-Zélande et les États-Unis s\'alignent sur la sécurité régionale et le partenariat AUKUS.',
        },
        {
          name: 'Chine',
          interests: 'Maintenir la Nouvelle-Zélande comme plus grand marché d\'exportation, élargir l\'influence économique, contrer les partenariats de sécurité occidentaux, sécuriser les ressources',
          resources: 'Accès au marché, investissement en capital, levier économique, engagement diplomatique',
          constraints: 'Partenariat AUKUS, partage de renseignement Five Eyes, alignement de sécurité occidental, politique étrangère indépendante de la Nouvelle-Zélande',
          likelyMoves: 'Maintenir les relations commerciales, élargir l\'investissement dans l\'agriculture/infrastructure, faire pression sur la participation à l\'AUKUS, élargir les échanges culturels',
          dealability: 'Moyen — la Nouvelle-Zélande maintiendra un engagement économique pragmatique avec la Chine tout en équilibrant les partenariats de sécurité occidentaux.',
        },
        {
          name: 'Australie',
          interests: 'Stabilité régionale, contrer l\'influence chinoise, maintenir l\'alliance ANZUS, coordonner sur les questions du Pacifique',
          resources: 'Capacité militaire, influence régionale, partenariat commercial, intérêts de sécurité partagés',
          constraints: 'Politique étrangère indépendante de la Nouvelle-Zélande, approches différentes de l\'engagement avec la Chine',
          likelyMoves: 'Coordonner sur AUKUS, sécurité régionale, relations avec les nations insulaires du Pacifique, coopération commerciale',
          dealability: 'Élevé — la Nouvelle-Zélande et l\'Australie sont des alliés proches avec des intérêts alignés sur la sécurité régionale.',
        },
        {
          name: 'Nations insulaires du Pacifique',
          interests: 'Stabilité régionale, action climatique, développement économique, maintenir le soutien de la Nouvelle-Zélande',
          resources: 'Influence régionale, blocs de vote dans les forums internationaux, localisation stratégique',
          constraints: 'Vulnérabilité économique, dépendance à l\'aide, menaces du changement climatique',
          likelyMoves: 'Chercher le soutien de la Nouvelle-Zélande sur le climat/développement, maintenir l\'alignement régional, faire appel à l\'aide/investissement',
          dealability: 'Élevé — la Nouvelle-Zélande est un leader régional et maintiendra le soutien aux nations insulaires du Pacifique.',
        },
      ],
    },
    risks: [
      {
        title: 'Perturbation du commerce mondial et effondrement des exportations',
        trigger: 'Escalade de la guerre commerciale États-Unis-Chine, récession mondiale ou effondrement de la demande chinoise affectant les exportations agricoles/tourisme',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '6-18 mois',
        leadingIndicators: 'Tensions commerciales mondiales, croissance économique chinoise, prix des produits agricoles, demande de tourisme',
        mitigants: 'Accords de libre-échange (Inde, UE), diversification des exportations, réserves de change, taux de change flexible',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Conflit Chine-Taïwan et instabilité régionale',
        trigger: 'Conflit militaire entre la Chine et Taïwan ou escalade des tensions affectant la stabilité de l\'Indo-Pacifique',
        probability: 'Low',
        impact: 'High',
        timeHorizon: '6-24 mois',
        leadingIndicators: 'Mouvements militaires chinois, développements politiques taïwanais, tensions États-Unis-Chine, exercices militaires régionaux',
        mitigants: 'Partenariat AUKUS, engagement de sécurité américain, engagement diplomatique, efforts de désescalade régionale',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Instabilité du gouvernement de coalition',
        trigger: 'Désaccord politique entre les partenaires de coalition, retrait de l\'ACT ou de la Nouvelle-Zélande d\'abord ou crise politique majeure',
        probability: 'Med',
        impact: 'Low',
        timeHorizon: '6-18 mois',
        leadingIndicators: 'Déclarations des partenaires de coalition, désaccords politiques, réalignement politique, sondage électoral',
        mitigants: 'Intérêts de coalition partagés, calcul électoral, compromis sur les priorités politiques',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Crise du coût de la vie et réaction politique',
        trigger: 'Inflation persistante, escalade des coûts du logement ou pic des prix de l\'énergie déclenchant une pression politique',
        probability: 'Med',
        impact: 'Med',
        timeHorizon: '6-12 mois',
        leadingIndicators: 'Tendances d\'inflation, prix du logement, prix de l\'énergie, enquêtes de sentiment public, sondage politique',
        mitigants: 'Réductions d\'impôts, dépenses gouvernementales, ajustement de la politique monétaire, croissance des salaires',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Crise agricole et choc climatique',
        trigger: 'Sécheresse grave, inondations ou épidémie affectant la production agricole',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '6-18 mois',
        leadingIndicators: 'Prévisions météorologiques, données de production agricole, prix des produits agricoles, indicateurs climatiques',
        mitigants: 'Infrastructure d\'irrigation, assurance récolte, programmes de soutien gouvernemental, adaptation agricole',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Polarisation politique et stress démocratique',
        trigger: 'Escalade de la polarisation sur l\'immigration, les droits Māori ou le coût de la vie déclenchant des troubles sociaux',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '12-24 mois',
        leadingIndicators: 'Indicateurs de polarisation politique, activité de protestation, polarisation médiatique, sentiment public',
        mitigants: 'Institutions démocratiques, engagement de la société civile, pluralisme médiatique, compromis politique',
        lastAssessed: 'Avril 2026',
      },
    ],
    sources: [
      {
        name: 'Banque de réserve de Nouvelle-Zélande (RBNZ)',
        url: 'https://www.rbnz.govt.nz',
        desc: 'Données officielles de la banque centrale sur la politique monétaire, l\'inflation, les taux de change, la stabilité financière',
      },
      {
        name: 'Stats NZ (Statistiques Nouvelle-Zélande)',
        url: 'https://www.stats.govt.nz',
        desc: 'Statistiques nationales — PIB, emploi, pauvreté, inflation, données commerciales',
      },
      {
        name: 'Consultation de l\'article IV du FMI sur la Nouvelle-Zélande',
        url: 'https://www.imf.org',
        desc: 'Évaluation macroéconomique du FMI et recommandations politiques',
      },
      {
        name: 'Institut Lowy',
        url: 'https://www.lowyinstitute.org',
        desc: 'Think tank australien avec recherche sur la Nouvelle-Zélande, la géopolitique Asie-Pacifique et la sécurité régionale',
      },
      {
        name: 'Base de données des dépenses militaires du SIPRI',
        url: 'https://www.sipri.org',
        desc: 'Données sur les dépenses militaires et les transferts d\'armes',
      },
      {
        name: 'Rapport Nouvelle-Zélande de Freedom House',
        url: 'https://freedomhouse.org',
        desc: 'Évaluation des droits politiques, des libertés civiles, de la liberté de la presse en Nouvelle-Zélande',
      },
      {
        name: 'Affaires étrangères et défense de la Nouvelle-Zélande (MFAT)',
        url: 'https://www.mfat.govt.nz',
        desc: 'Documents officiels de politique étrangère et de stratégie de défense du gouvernement',
      },
      {
        name: 'Médias de Nouvelle-Zélande (RNZ, Stuff, NZ Herald)',
        url: 'https://www.rnz.co.nz',
        desc: 'Couverture médiatique indépendante de la politique et de l\'économie néo-zélandaises',
      },
    ],
  },
};
