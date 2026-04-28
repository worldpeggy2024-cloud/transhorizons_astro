/*
 * TransHorizons — Vietnam Country Analysis Data
 * Full bilingual content following the Country Situation Report framework
 * Focus: US-China competition arena, supply chain hub, communist one-party state, South China Sea tensions, manufacturing growth
 * Last updated: April 2026
 * Sources: State Bank of Vietnam, General Statistics Office, IMF, World Bank, SIPRI, ACLED, Freedom House, ISEAS-Yusof Ishak Institute
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

export const vietnamAnalysis: AnalysisContent = {
  lastUpdated: '2026-04-15',
  scorecard: {
    eliteCohesion: 'Med',
    securityLoyalty: 'High',
    economicPressure: 'Med',
    protestCapacity: 'Med',
    institutionalResilience: 'Med',
  },
  en: {
    executiveSnapshot: [
      'Regime type: One-party communist state. Communist Party of Vietnam (CPV) holds monopoly on political power. General Secretary Tô Lâm leads party (since 2023). Prime Minister Phạm Minh Chính heads government. No democratic elections or political competition. Centralized decision-making within party. Military (VPA) is subordinate to party.',
      'Political equilibrium: Power is concentrated in CPV leadership, particularly the Politburo and Standing Committee. The government is subordinate to party. The National Assembly is rubber-stamp legislature with no independent power. Civil society is co-opted or suppressed. Dissent is controlled through surveillance and occasional repression. Succession planning within CPV is opaque but appears orderly. Political stability is high due to party monopoly.',
      'Economic model: Lower-middle-income economy ($430 billion GDP). Manufacturing hub and supply chain alternative to China. Heavily dependent on exports (textiles, electronics, agricultural products). Foreign direct investment concentrated in manufacturing. Tourism is significant. Domestic consumption growing. Inequality is high but poverty has declined significantly. Informal economy is large.',
      'Top 3 risks (6–18 months): (1) South China Sea conflict or China-Vietnam military escalation; (2) US-China trade war disrupting supply chains and manufacturing; (3) Economic slowdown from global recession or manufacturing relocation.',
      'Top 3 watch items (4–12 weeks): (1) South China Sea developments and Chinese assertiveness; (2) US-China trade tensions and manufacturing impact; (3) CPV leadership dynamics and economic policy direction.',
      'External dependencies: Exports account for ~100% of GDP (extremely high). China is largest trading partner (~15% of trade) and source of raw materials. US is major export market (~15% of exports). ASEAN membership is important but Vietnam is not ASEAN leader. Foreign direct investment concentrated in manufacturing. Remittances from diaspora (~20 billion annually) are significant.',
      'Security posture: Regional military power with significant capabilities. South China Sea disputes with China (overlapping claims). Military modernization ongoing but constrained by budget. No standing external military threats but tensions with China. Terrorism threat is low. Border security concerns with Cambodia and Laos. Military is subordinate to CPV and loyal to party.',
      'Diplomatic orientation: Pragmatic engagement with both US and China — seeks to avoid choosing sides. Strategic partnership with US is expanding (defense cooperation, trade). Balancing act between US security partnership and China economic dependence. ASEAN member but maintains separate strategic interests. Non-aligned movement participant.',
      'Data confidence: Medium — Vietnam publishes macroeconomic data but political/security data is less transparent. Institutional capacity is improving but remains uneven. Media freedom is limited.',
      'Baseline outlook: Stable but vulnerable to external shocks. CPV will maintain political control. Economic growth will moderate but remain positive (5-6%). Regional tensions will persist but major conflict is unlikely. The key challenge is managing US-China competition while maintaining economic growth and political stability.',
    ],
    political: {
      powerStructure: 'General Secretary of CPV holds supreme power but operates through collective leadership within Politburo. The government is subordinate to party — Prime Minister reports to party leadership. The National Assembly (500 seats) is rubber-stamp legislature with no independent power. All candidates are CPV-approved. The judiciary is subordinate to party and government. The military (VPA) is subordinate to party through party committees within military. The civil service is party-controlled. Local governments are party-controlled but have some autonomy.',
      stabilityDrivers: 'Legitimacy rests on economic growth, nationalist credentials (resistance to China), and party monopoly. Vietnam has achieved rapid economic growth and poverty reduction. The party maintains legitimacy through economic performance and nationalist narrative. The military is loyal to the party. The civil service is professional and implements party directives. However, corruption is endemic and growing inequality creates social tensions. Public dissent is rare due to party control and surveillance.',
      shockAbsorbers: 'Absorbers: Growing economy with diversified manufacturing base. Foreign exchange reserves (~$100 billion) provide macroeconomic buffer. ASEAN membership and regional influence. Military capability and internal security apparatus. Accelerants: South China Sea conflict or China-Vietnam military escalation would disrupt economy and security. US-China trade war or manufacturing relocation would disrupt exports and growth. Global recession would reduce demand for exports. Political crisis or CPV fragmentation would undermine stability.',
    },
    economy: {
      macroReality: 'GDP growth forecast 5-6% for 2025-2026 (IMF) — solid and above regional average. Inflation is projected at ~3.5% (within State Bank target band). The fiscal deficit is projected at ~4% of GDP for 2025 (above sustainable levels but manageable). Public debt stands at ~43% of GDP (manageable). The Vietnamese dong has depreciated ~2% against the US dollar since late 2024 due to capital outflows and interest rate differentials. Unemployment is ~2% (very low). However, underemployment and informal employment are high. Poverty remains at ~5% of population.',
      externalVulnerability: 'Vietnam is highly dependent on exports — exports account for ~100% of GDP (extremely high). China is largest trading partner (~15% of trade) and source of raw materials. US is major export market (~15% of exports). Global supply chain disruptions would devastate economy. Foreign direct investment concentrated in manufacturing — vulnerable to relocation and trade wars. Remittances from diaspora (~20 billion annually) are significant but not critical. Sovereign debt is investment-grade (Moody\'s Ba1) but under pressure from fiscal deficits and currency depreciation.',
      politicalEconomy: 'CPV government\'s economic agenda prioritizes manufacturing development, infrastructure investment, and export growth. However, state enterprises remain dominant and inefficient. The government is pursuing free trade agreements to diversify markets. The manufacturing sector is growing but faces labor cost pressures and competition from other countries. The tech sector is developing but remains small. Infrastructure investment is ongoing but faces corruption and project delays. Labor market reforms are limited due to party control of unions.',
    },
    security: {
      internal: 'Internal security threats are minimal. There is no terrorism threat or insurgency. Violent crime is low. The Public Security Ministry maintains extensive surveillance and control. Dissent is suppressed through surveillance, detention, and occasional violence. Human rights organizations document arbitrary detention and torture. Cybersecurity and critical infrastructure protection are growing concerns. The military and police are professional and loyal to the party.',
      diplomacy: 'Vietnam maintains pragmatic engagement with both US and China — seeks to avoid choosing sides in great power competition. Strategic partnership with US is expanding (defense cooperation, trade, technology). However, maintains economic engagement with China despite South China Sea disputes. ASEAN member but maintains separate strategic interests. Non-aligned movement participant. Balancing act between US security partnership and China economic dependence.',
    },
    actors: {
      domestic: [
        {
          name: 'Communist Party of Vietnam (CPV) & General Secretary Tô Lâm',
          interests: 'Maintain party monopoly, ensure economic growth, manage succession, control dissent, maintain security',
          resources: 'Executive authority, party machinery, military loyalty, state enterprises, surveillance apparatus',
          constraints: 'Economic slowdown pressures, generational change, corruption scandals, external geopolitical pressures',
          likelyMoves: 'Maintain economic growth focus, manage succession planning, control dissent, balance US-China engagement',
          dealability: 'Medium — CPV is pragmatic on economic issues but inflexible on political control.',
        },
        {
          name: 'Government & Prime Minister Phạm Minh Chính',
          interests: 'Implement economic policies, manage government, implement party directives, maintain stability',
          resources: 'Executive authority, government machinery, state enterprises, administrative capacity',
          constraints: 'Party direction, budget constraints, implementation challenges, corruption',
          likelyMoves: 'Implement government policies, pursue economic growth, manage state enterprises, implement party directives',
          dealability: 'Medium — government is professional but subordinate to party.',
        },
        {
          name: 'Military (VPA) & Security Forces',
          interests: 'Maintain party control, protect national security, manage South China Sea, modernize capabilities',
          resources: 'Military capability, internal security networks, defense budget, party loyalty',
          constraints: 'Budget constraints, modernization challenges, South China Sea tensions, party control',
          likelyMoves: 'Maintain party loyalty, manage South China Sea tensions, pursue modernization, control dissent',
          dealability: 'Medium — military is loyal to party but will protect institutional interests.',
        },
        {
          name: 'State Enterprises & Business Sector',
          interests: 'Maintain government contracts, expand private sector opportunities, attract foreign investment, pursue growth',
          resources: 'Capital, employment, government connections, international partnerships',
          constraints: 'Government control, inefficiency, corruption, labor costs, competition',
          likelyMoves: 'Seek privatization, attract foreign investment, expand exports, lobby for deregulation',
          dealability: 'Medium — business is pragmatic but constrained by party control.',
        },
        {
          name: 'Civil Society & Dissidents',
          interests: 'Expand civil liberties, challenge party monopoly, document human rights violations, build alternative vision',
          resources: 'Grassroots networks, international advocacy, diaspora support, moral authority',
          constraints: 'Party repression, surveillance, limited institutional power, legal restrictions',
          likelyMoves: 'Advocate for civil liberties through international channels, document violations, organize within constraints',
          dealability: 'Low — civil society is suppressed and has limited leverage.',
        },
      ],
      external: [
        {
          name: 'United States',
          interests: 'Maintain Vietnam as strategic partner, counter China influence, expand trade/investment, support democracy',
          resources: 'Military support, technology, trade access, diplomatic leverage, development aid',
          constraints: 'Vietnam\'s pragmatic China engagement, communist party system, limited military capacity',
          likelyMoves: 'Strengthen defense cooperation, expand trade/investment, pressure on South China Sea, support tech partnerships',
          dealability: 'Medium-High — Vietnam will expand US partnership while maintaining China engagement.',
        },
        {
          name: 'China',
          interests: 'Maintain Vietnam as pragmatic partner, expand economic influence, manage South China Sea, contain US influence',
          resources: 'Market access, capital investment, economic leverage, military capability, raw materials supply',
          constraints: 'South China Sea disputes, Vietnam\'s US partnership expansion, ASEAN unity pressure',
          likelyMoves: 'Maintain economic engagement, manage South China Sea tensions, pressure on US partnership, expand investment',
          dealability: 'Medium — Vietnam will maintain pragmatic economic engagement with China while managing disputes.',
        },
        {
          name: 'ASEAN',
          interests: 'Regional stability, consensus decision-making, counter great power dominance, maintain ASEAN centrality',
          resources: 'Regional influence, diplomatic forums, collective action capacity',
          constraints: 'Internal divisions, consensus requirement, great power pressure',
          likelyMoves: 'Participate in ASEAN consensus-building, maintain regional engagement, balance great power competition',
          dealability: 'High — Vietnam is ASEAN member and will maintain regional engagement.',
        },
        {
          name: 'Japan & South Korea',
          interests: 'Counter China influence, expand economic partnerships, maintain regional stability, secure supply chains',
          resources: 'Capital investment, technology, trade partnerships, diplomatic influence',
          constraints: 'Limited regional presence compared to China, competing interests',
          likelyMoves: 'Expand investment and trade, strengthen economic partnerships, coordinate on China policy',
          dealability: 'High — Japan and South Korea are seeking to expand influence and will align with Vietnam on economic issues.',
        },
        {
          name: 'India',
          interests: 'Counter China influence, expand economic partnerships, maintain regional stability, secure supply chains',
          resources: 'Capital investment, technology, military capability, trade partnerships',
          constraints: 'Limited regional presence, competing interests, distance from region',
          likelyMoves: 'Expand investment and trade, strengthen defense cooperation, coordinate on China policy',
          dealability: 'Medium-High — India is seeking to expand influence and will align with Vietnam on regional issues.',
        },
      ],
    },
    risks: [
      {
        title: 'South China Sea Conflict or China-Vietnam Military Escalation',
        trigger: 'Military confrontation in South China Sea or China-Vietnam military escalation',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '6-18 months',
        leadingIndicators: 'China military movements, maritime incidents, diplomatic tensions, military exercises',
        mitigants: 'US security partnership, ASEAN consensus, diplomatic engagement, regional de-escalation efforts',
        lastAssessed: 'April 2026',
      },
      {
        title: 'US-China Trade War & Supply Chain Disruption',
        trigger: 'US-China trade war escalation or manufacturing relocation disrupting Vietnam\'s exports',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '6-18 months',
        leadingIndicators: 'US-China trade tensions, tariff announcements, manufacturing trends, export data',
        mitigants: 'Supply chain diversification, free trade agreements, manufacturing competitiveness, labor cost advantages',
        lastAssessed: 'April 2026',
      },
      {
        title: 'Global Recession & Export Collapse',
        trigger: 'Global recession or demand collapse affecting Vietnam\'s export-dependent economy',
        probability: 'Low',
        impact: 'High',
        timeHorizon: '6-18 months',
        leadingIndicators: 'Global economic indicators, trade volumes, export demand, commodity prices',
        mitigants: 'Foreign exchange reserves, diversified economy, domestic consumption growth, government spending',
        lastAssessed: 'April 2026',
      },
      {
        title: 'CPV Leadership Crisis or Political Instability',
        trigger: 'CPV succession crisis, internal fragmentation, or political instability',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '12-24 months',
        leadingIndicators: 'CPV internal dynamics, leadership statements, generational change, policy disagreements',
        mitigants: 'Succession planning mechanisms, institutional continuity, military loyalty, party discipline',
        lastAssessed: 'April 2026',
      },
      {
        title: 'Currency Crisis & Capital Flight',
        trigger: 'Rapid dong depreciation, capital outflows, or foreign exchange reserve depletion',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '6-18 months',
        leadingIndicators: 'Currency movements, capital flows, interest rate differentials, trade balances',
        mitigants: 'Foreign exchange reserves, monetary policy adjustment, capital controls, IMF support',
        lastAssessed: 'April 2026',
      },
      {
        title: 'Labor Unrest & Social Tensions',
        trigger: 'Labor strikes, social protests, or rising inequality triggering unrest',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '6-18 months',
        leadingIndicators: 'Labor activity, wage trends, inequality indicators, social sentiment',
        mitigants: 'Government spending, wage growth, labor market reforms, social programs',
        lastAssessed: 'April 2026',
      },
    ],
    sources: [
      {
        name: 'State Bank of Vietnam (SBV)',
        url: 'https://www.sbv.gov.vn',
        desc: 'Official central bank data on monetary policy, inflation, exchange rates, financial stability',
      },
      {
        name: 'General Statistics Office of Vietnam (GSO)',
        url: 'https://www.gso.gov.vn',
        desc: 'National statistics — GDP, employment, trade, inflation, population data',
      },
      {
        name: 'IMF Vietnam Article IV Consultation',
        url: 'https://www.imf.org',
        desc: 'IMF macroeconomic assessment and policy recommendations',
      },
      {
        name: 'ISEAS-Yusof Ishak Institute',
        url: 'https://www.iseas.edu.sg',
        desc: 'Leading Southeast Asia think tank with research on Vietnam, regional politics, and geopolitics',
      },
      {
        name: 'SIPRI Military Expenditure Database',
        url: 'https://www.sipri.org',
        desc: 'Military spending and arms transfer data',
      },
      {
        name: 'ACLED (Armed Conflict Location & Event Data)',
        url: 'https://acleddata.com',
        desc: 'Real-time conflict and violence data tracking regional tensions',
      },
      {
        name: 'Freedom House Vietnam Report',
        url: 'https://freedomhouse.org',
        desc: 'Assessment of political rights, civil liberties, press freedom in Vietnam',
      },
      {
        name: 'Vietnamese Media & International Coverage',
        url: 'https://www.vietnamnews.vn',
        desc: 'Media coverage of Vietnam politics, economics, and regional affairs',
      },
    ],
  },
  fr: {
    executiveSnapshot: [
      'Type de régime : État communiste à parti unique. Le Parti communiste du Vietnam (PCV) détient le monopole du pouvoir politique. Le secrétaire général Tô Lâm dirige le parti (depuis 2023). Le Premier ministre Phạm Minh Chính dirige le gouvernement. Pas d\'élections démocratiques ou de concurrence politique. Prise de décision centralisée au sein du parti. L\'armée (VPA) est subordonnée au parti.',
      'Équilibre politique : Le pouvoir est concentré dans la direction du PCV, en particulier le Politburo et le Comité permanent. Le gouvernement est subordonné au parti. L\'Assemblée nationale est une législature de caoutchouc sans pouvoir indépendant. La société civile est cooptée ou supprimée. La dissidence est contrôlée par la surveillance et la répression occasionnelle. La planification de la succession au sein du PCV est opaque mais semble ordonnée. La stabilité politique est élevée en raison du monopole du parti.',
      'Modèle économique : Économie à revenu intermédiaire inférieur (PIB de 430 milliards de dollars). Plaque tournante manufacturière et alternative de chaîne d\'approvisionnement à la Chine. Fortement dépendante des exportations (textiles, électronique, produits agricoles). L\'investissement direct étranger concentré dans la fabrication. Le tourisme est important. La consommation intérieure se développe. L\'inégalité est élevée mais la pauvreté a considérablement diminué. L\'économie informelle est importante.',
      'Top 3 risques (6–18 mois) : (1) Conflit en Mer de Chine méridionale ou escalade militaire Chine-Vietnam ; (2) Guerre commerciale États-Unis-Chine perturbant les chaînes d\'approvisionnement et la fabrication ; (3) Ralentissement économique dû à une récession mondiale ou à une relocalisation manufacturière.',
      'Top 3 éléments de surveillance (4–12 semaines) : (1) Développements en Mer de Chine méridionale et affirmation chinoise ; (2) Tensions commerciales États-Unis-Chine et impact manufacturier ; (3) Dynamique de la direction du PCV et orientation de la politique économique.',
      'Dépendances externes : Les exportations représentent ~100% du PIB (extrêmement élevé). La Chine est le plus grand partenaire commercial (~15% du commerce) et source de matières premières. Les États-Unis sont un grand marché d\'exportation (~15% des exportations). L\'adhésion à l\'ASEAN est importante mais le Vietnam n\'est pas leader de l\'ASEAN. L\'investissement direct étranger concentré dans la fabrication. Les transferts de fonds de la diaspora (~20 milliards annuellement) sont importants.',
      'Posture de sécurité : Puissance militaire régionale avec des capacités significatives. Différends en Mer de Chine méridionale avec la Chine (réclamations chevauchantes). Modernisation militaire en cours mais limitée par le budget. Aucune menace militaire externe permanente mais tensions avec la Chine. La menace du terrorisme est faible. Préoccupations concernant la sécurité des frontières avec le Cambodge et le Laos. L\'armée est subordonnée au PCV et loyale au parti.',
      'Orientation diplomatique : Engagement pragmatique avec les États-Unis et la Chine — cherche à éviter de choisir un camp. Le partenariat stratégique avec les États-Unis s\'élargit (coopération de défense, commerce). Équilibre entre le partenariat de sécurité américain et la dépendance économique chinoise. Membre de l\'ASEAN mais maintient des intérêts stratégiques séparés. Participant au mouvement des non-alignés.',
      'Confiance des données : Moyen — le Vietnam publie des données macroéconomiques mais les données politiques/sécurité sont moins transparentes. La capacité institutionnelle s\'améliore mais reste inégale. La liberté de la presse est limitée.',
      'Perspective de base : Stable mais vulnérable aux chocs externes. Le PCV maintiendra le contrôle politique. La croissance économique se modérera mais restera positive (5-6%). Les tensions régionales persisteront mais un conflit majeur est peu probable. Le défi clé est de gérer la concurrence États-Unis-Chine tout en maintenant la croissance économique et la stabilité politique.',
    ],
    political: {
      powerStructure: 'Le secrétaire général du PCV détient le pouvoir suprême mais fonctionne par le biais d\'une direction collective au sein du Politburo. Le gouvernement est subordonné au parti — le Premier ministre rend compte à la direction du parti. L\'Assemblée nationale (500 sièges) est une législature de caoutchouc sans pouvoir indépendant. Tous les candidats sont approuvés par le PCV. La magistrature est subordonnée au parti et au gouvernement. L\'armée (VPA) est subordonnée au parti par les comités du parti au sein de l\'armée. La fonction publique est contrôlée par le parti. Les gouvernements locaux sont contrôlés par le parti mais ont une certaine autonomie.',
      stabilityDrivers: 'La légitimité repose sur la croissance économique, les références nationalistes (résistance à la Chine) et le monopole du parti. Le Vietnam a réalisé une croissance économique rapide et une réduction de la pauvreté. Le parti maintient la légitimité par la performance économique et la narration nationaliste. L\'armée est loyale au parti. La fonction publique est professionnelle et met en œuvre les directives du parti. Cependant, la corruption est endémique et l\'inégalité croissante crée des tensions sociales. La dissidence publique est rare en raison du contrôle du parti et de la surveillance.',
      shockAbsorbers: 'Amortisseurs : Économie en croissance avec une base manufacturière diversifiée. Réserves de change (~100 milliards de dollars) fournissent un tampon macroéconomique. Adhésion à l\'ASEAN et influence régionale. Capacité militaire et appareil de sécurité intérieure. Accélérateurs : Conflit en Mer de Chine méridionale ou escalade militaire Chine-Vietnam perturberait l\'économie et la sécurité. Guerre commerciale États-Unis-Chine ou relocalisation manufacturière perturberait les exportations et la croissance. Récession mondiale réduirait la demande d\'exportations. Crise politique ou fragmentation du PCV minerait la stabilité.',
    },
    economy: {
      macroReality: 'La croissance du PIB est prévue à 5-6% pour 2025-2026 (FMI) — solide et au-dessus de la moyenne régionale. L\'inflation est projetée à ~3,5% (dans la bande cible de la Banque d\'État). Le déficit budgétaire est projeté à ~4% du PIB pour 2025 (au-dessus des niveaux durables mais gérable). La dette publique s\'élève à ~43% du PIB (gérable). Le dong vietnamien s\'est déprécié ~2% par rapport au dollar américain depuis fin 2024 en raison des sorties de capitaux et des différentiels de taux d\'intérêt. Le chômage est ~2% (très faible). Cependant, le sous-emploi et l\'emploi informel sont élevés. La pauvreté reste à ~5% de la population.',
      externalVulnerability: 'Le Vietnam dépend fortement des exportations — les exportations représentent ~100% du PIB (extrêmement élevé). La Chine est le plus grand partenaire commercial (~15% du commerce) et source de matières premières. Les États-Unis sont un grand marché d\'exportation (~15% des exportations). Les perturbations de la chaîne d\'approvisionnement mondiale dévasteraient l\'économie. L\'investissement direct étranger concentré dans la fabrication — vulnérable à la relocalisation et aux guerres commerciales. Les transferts de fonds de la diaspora (~20 milliards annuellement) sont importants mais non critiques. La dette souveraine est de qualité investissement (Moody\'s Ba1) mais sous pression en raison des déficits budgétaires et de la dépréciation des devises.',
      politicalEconomy: 'L\'agenda économique du gouvernement du PCV privilégie le développement manufacturier, l\'investissement dans les infrastructures et la croissance des exportations. Cependant, les entreprises d\'État restent dominantes et inefficaces. Le gouvernement poursuit les accords de libre-échange pour diversifier les marchés. Le secteur manufacturier se développe mais fait face à des pressions sur les coûts de main-d\'œuvre et à la concurrence d\'autres pays. Le secteur technologique se développe mais reste petit. L\'investissement dans les infrastructures est en cours mais fait face à la corruption et aux retards de projets. Les réformes du marché du travail sont limitées en raison du contrôle du parti sur les syndicats.',
    },
    security: {
      internal: 'Les menaces de sécurité intérieure sont minimes. Il n\'y a pas de menace terroriste ou d\'insurrection. La criminalité violente est faible. Le ministère de la Sécurité publique maintient une surveillance et un contrôle extensifs. La dissidence est supprimée par la surveillance, la détention et la violence occasionnelle. Les organisations de défense des droits de l\'homme documentent la détention arbitraire et la torture. La cybersécurité et la protection des infrastructures critiques sont des préoccupations croissantes. L\'armée et la police sont professionnelles et loyales au parti.',
      diplomacy: 'Le Vietnam maintient un engagement pragmatique avec les États-Unis et la Chine — cherche à éviter de choisir un camp dans la concurrence des grandes puissances. Le partenariat stratégique avec les États-Unis s\'élargit (coopération de défense, commerce, technologie). Cependant, maintient l\'engagement économique avec la Chine malgré les différends en Mer de Chine méridionale. Membre de l\'ASEAN mais maintient des intérêts stratégiques séparés. Participant au mouvement des non-alignés. Équilibre entre le partenariat de sécurité américain et la dépendance économique chinoise.',
    },
    actors: {
      domestic: [
        {
          name: 'Parti communiste du Vietnam (PCV) et secrétaire général Tô Lâm',
          interests: 'Maintenir le monopole du parti, assurer la croissance économique, gérer la succession, contrôler la dissidence, maintenir la sécurité',
          resources: 'Autorité exécutive, machine du parti, loyauté militaire, entreprises d\'État, appareil de surveillance',
          constraints: 'Pressions du ralentissement économique, changement générationnel, scandales de corruption, pressions géopolitiques externes',
          likelyMoves: 'Maintenir l\'accent sur la croissance économique, gérer la planification de la succession, contrôler la dissidence, équilibrer l\'engagement États-Unis-Chine',
          dealability: 'Moyen — le PCV est pragmatique sur les questions économiques mais inflexible sur le contrôle politique.',
        },
        {
          name: 'Gouvernement et Premier ministre Phạm Minh Chính',
          interests: 'Mettre en œuvre les politiques économiques, gérer le gouvernement, mettre en œuvre les directives du parti, maintenir la stabilité',
          resources: 'Autorité exécutive, machine gouvernementale, entreprises d\'État, capacité administrative',
          constraints: 'Direction du parti, contraintes budgétaires, défis de mise en œuvre, corruption',
          likelyMoves: 'Mettre en œuvre les politiques gouvernementales, poursuivre la croissance économique, gérer les entreprises d\'État, mettre en œuvre les directives du parti',
          dealability: 'Moyen — le gouvernement est professionnel mais subordonné au parti.',
        },
        {
          name: 'Armée (VPA) et forces de sécurité',
          interests: 'Maintenir le contrôle du parti, protéger la sécurité nationale, gérer la Mer de Chine méridionale, moderniser les capacités',
          resources: 'Capacité militaire, réseaux de sécurité intérieure, budget de défense, loyauté du parti',
          constraints: 'Contraintes budgétaires, défis de modernisation, tensions en Mer de Chine méridionale, contrôle du parti',
          likelyMoves: 'Maintenir la loyauté du parti, gérer les tensions en Mer de Chine méridionale, poursuivre la modernisation, contrôler la dissidence',
          dealability: 'Moyen — l\'armée est loyale au parti mais protégera les intérêts institutionnels.',
        },
        {
          name: 'Entreprises d\'État et secteur des affaires',
          interests: 'Maintenir les contrats gouvernementaux, élargir les opportunités du secteur privé, attirer l\'investissement étranger, poursuivre la croissance',
          resources: 'Capital, emploi, connexions gouvernementales, partenariats internationaux',
          constraints: 'Contrôle gouvernemental, inefficacité, corruption, coûts de main-d\'œuvre, concurrence',
          likelyMoves: 'Chercher la privatisation, attirer l\'investissement étranger, élargir les exportations, faire du lobbying pour la déréglementation',
          dealability: 'Moyen — les entreprises sont pragmatiques mais limitées par le contrôle du parti.',
        },
        {
          name: 'Société civile et dissidents',
          interests: 'Élargir les libertés civiles, contester le monopole du parti, documenter les violations des droits de l\'homme, construire une vision alternative',
          resources: 'Réseaux de base, plaidoyer international, soutien de la diaspora, autorité morale',
          constraints: 'Répression du parti, surveillance, pouvoir institutionnel limité, restrictions juridiques',
          likelyMoves: 'Plaider pour les libertés civiles par les canaux internationaux, documenter les violations, s\'organiser dans les contraintes',
          dealability: 'Faible — la société civile est supprimée et a un levier limité.',
        },
      ],
      external: [
        {
          name: 'États-Unis',
          interests: 'Maintenir le Vietnam comme partenaire stratégique, contrer l\'influence chinoise, élargir le commerce/investissement, soutenir la démocratie',
          resources: 'Soutien militaire, technologie, accès commercial, levier diplomatique, aide au développement',
          constraints: 'Engagement pragmatique du Vietnam avec la Chine, système de parti communiste, capacité militaire limitée',
          likelyMoves: 'Renforcer la coopération de défense, élargir le commerce/investissement, faire pression sur la Mer de Chine méridionale, soutenir les partenariats technologiques',
          dealability: 'Moyen-Élevé — le Vietnam élargira le partenariat américain tout en maintenant l\'engagement chinois.',
        },
        {
          name: 'Chine',
          interests: 'Maintenir le Vietnam comme partenaire pragmatique, élargir l\'influence économique, gérer la Mer de Chine méridionale, contenir l\'influence américaine',
          resources: 'Accès au marché, investissement en capital, levier économique, capacité militaire, approvisionnement en matières premières',
          constraints: 'Différends en Mer de Chine méridionale, expansion du partenariat américain du Vietnam, pression de l\'unité de l\'ASEAN',
          likelyMoves: 'Maintenir l\'engagement économique, gérer les tensions en Mer de Chine méridionale, faire pression sur le partenariat américain, élargir l\'investissement',
          dealability: 'Moyen — le Vietnam maintiendra l\'engagement économique pragmatique avec la Chine tout en gérant les différends.',
        },
        {
          name: 'ASEAN',
          interests: 'Stabilité régionale, prise de décision par consensus, contrer la dominance des grandes puissances, maintenir la centralité de l\'ASEAN',
          resources: 'Influence régionale, forums diplomatiques, capacité d\'action collective',
          constraints: 'Divisions internes, exigence de consensus, pression des grandes puissances',
          likelyMoves: 'Participer à la construction du consensus de l\'ASEAN, maintenir l\'engagement régional, équilibrer la concurrence des grandes puissances',
          dealability: 'Élevé — le Vietnam est membre de l\'ASEAN et maintiendra l\'engagement régional.',
        },
        {
          name: 'Japon et Corée du Sud',
          interests: 'Contrer l\'influence chinoise, élargir les partenariats économiques, maintenir la stabilité régionale, sécuriser les chaînes d\'approvisionnement',
          resources: 'Investissement en capital, technologie, partenariats commerciaux, influence diplomatique',
          constraints: 'Présence régionale limitée par rapport à la Chine, intérêts concurrents',
          likelyMoves: 'Élargir l\'investissement et le commerce, renforcer les partenariats économiques, coordonner la politique chinoise',
          dealability: 'Élevé — le Japon et la Corée du Sud cherchent à élargir l\'influence et s\'aligneront avec le Vietnam sur les questions économiques.',
        },
        {
          name: 'Inde',
          interests: 'Contrer l\'influence chinoise, élargir les partenariats économiques, maintenir la stabilité régionale, sécuriser les chaînes d\'approvisionnement',
          resources: 'Investissement en capital, technologie, capacité militaire, partenariats commerciaux',
          constraints: 'Présence régionale limitée, intérêts concurrents, distance de la région',
          likelyMoves: 'Élargir l\'investissement et le commerce, renforcer la coopération de défense, coordonner la politique chinoise',
          dealability: 'Moyen-Élevé — l\'Inde cherche à élargir l\'influence et s\'alignera avec le Vietnam sur les questions régionales.',
        },
      ],
    },
    risks: [
      {
        title: 'Conflit en Mer de Chine méridionale ou escalade militaire Chine-Vietnam',
        trigger: 'Confrontation militaire en Mer de Chine méridionale ou escalade militaire Chine-Vietnam',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '6-18 mois',
        leadingIndicators: 'Mouvements militaires chinois, incidents maritimes, tensions diplomatiques, exercices militaires',
        mitigants: 'Partenariat de sécurité américain, consensus de l\'ASEAN, engagement diplomatique, efforts de désescalade régionale',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Guerre commerciale États-Unis-Chine et perturbation de la chaîne d\'approvisionnement',
        trigger: 'Escalade de la guerre commerciale États-Unis-Chine ou relocalisation manufacturière perturbant les exportations du Vietnam',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '6-18 mois',
        leadingIndicators: 'Tensions commerciales États-Unis-Chine, annonces de tarifs, tendances manufacturières, données d\'exportation',
        mitigants: 'Diversification de la chaîne d\'approvisionnement, accords de libre-échange, compétitivité manufacturière, avantages de coûts de main-d\'œuvre',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Récession mondiale et effondrement des exportations',
        trigger: 'Récession mondiale ou effondrement de la demande affectant l\'économie dépendante des exportations du Vietnam',
        probability: 'Low',
        impact: 'High',
        timeHorizon: '6-18 mois',
        leadingIndicators: 'Indicateurs économiques mondiaux, volumes commerciaux, demande d\'exportation, prix des produits de base',
        mitigants: 'Réserves de change, économie diversifiée, croissance de la consommation intérieure, dépenses gouvernementales',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Crise de leadership du PCV ou instabilité politique',
        trigger: 'Crise de succession du PCV, fragmentation interne ou instabilité politique',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '12-24 mois',
        leadingIndicators: 'Dynamique interne du PCV, déclarations de leadership, changement générationnel, désaccords politiques',
        mitigants: 'Mécanismes de planification de la succession, continuité institutionnelle, loyauté militaire, discipline du parti',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Crise des devises et fuite de capitaux',
        trigger: 'Dépréciation rapide du dong, sorties de capitaux ou épuisement des réserves de change',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '6-18 mois',
        leadingIndicators: 'Mouvements des devises, flux de capitaux, différentiels de taux d\'intérêt, soldes commerciaux',
        mitigants: 'Réserves de change, ajustement de la politique monétaire, contrôles de capitaux, soutien du FMI',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Agitation du travail et tensions sociales',
        trigger: 'Grèves du travail, protestations sociales ou inégalité croissante déclenchant des troubles',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '6-18 mois',
        leadingIndicators: 'Activité du travail, tendances des salaires, indicateurs d\'inégalité, sentiment social',
        mitigants: 'Dépenses gouvernementales, croissance des salaires, réformes du marché du travail, programmes sociaux',
        lastAssessed: 'Avril 2026',
      },
    ],
    sources: [
      {
        name: 'Banque d\'État du Vietnam (SBV)',
        url: 'https://www.sbv.gov.vn',
        desc: 'Données officielles de la banque centrale sur la politique monétaire, l\'inflation, les taux de change, la stabilité financière',
      },
      {
        name: 'Office général des statistiques du Vietnam (GSO)',
        url: 'https://www.gso.gov.vn',
        desc: 'Statistiques nationales — PIB, emploi, commerce, inflation, données démographiques',
      },
      {
        name: 'Consultation de l\'article IV du FMI sur le Vietnam',
        url: 'https://www.imf.org',
        desc: 'Évaluation macroéconomique du FMI et recommandations politiques',
      },
      {
        name: 'Institut ISEAS-Yusof Ishak',
        url: 'https://www.iseas.edu.sg',
        desc: 'Principal think tank d\'Asie du Sud-Est avec recherche sur le Vietnam, la politique régionale et la géopolitique',
      },
      {
        name: 'Base de données des dépenses militaires du SIPRI',
        url: 'https://www.sipri.org',
        desc: 'Données sur les dépenses militaires et les transferts d\'armes',
      },
      {
        name: 'ACLED (Armed Conflict Location & Event Data)',
        url: 'https://acleddata.com',
        desc: 'Données en temps réel sur les conflits et la violence suivant les tensions régionales',
      },
      {
        name: 'Rapport Vietnam de Freedom House',
        url: 'https://freedomhouse.org',
        desc: 'Évaluation des droits politiques, des libertés civiles, de la liberté de la presse au Vietnam',
      },
      {
        name: 'Médias vietnamiens et couverture internationale',
        url: 'https://www.vietnamnews.vn',
        desc: 'Couverture médiatique de la politique, de l\'économie et des affaires régionales du Vietnam',
      },
    ],
  },
};
