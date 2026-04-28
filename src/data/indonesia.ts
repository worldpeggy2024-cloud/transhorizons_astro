/*
 * TransHorizons — Indonesia Country Analysis Data
 * Full bilingual content following the Country Situation Report framework
 * Focus: ASEAN leadership, critical minerals, Strait of Malacca chokepoint, China-US competition, regional stability, Islamic democracy
 * Last updated: April 2026
 * Sources: Bank Indonesia, Statistics Indonesia, IMF, World Bank, SIPRI, ACLED, Freedom House, ISEAS-Yusof Ishak Institute
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

export const indonesiaAnalysis: AnalysisContent = {
  lastUpdated: '2026-04-15',
  scorecard: {
    eliteCohesion: 'Med',
    securityLoyalty: 'High',
    economicPressure: 'Med',
    protestCapacity: 'High',
    institutionalResilience: 'Med',
  },
  en: {
    executiveSnapshot: [
      'Regime type: Presidential democracy (Islamic democracy). Prabowo Subianto elected president in October 2024, taking office in October 2024. Direct presidential elections. Decentralized governance with significant provincial autonomy. Military retains political influence despite democratic transition. Islam is central to national identity and governance.',
      'Political equilibrium: Prabowo leads a broad coalition government with multiple parties. The legislature (DPR) is fractious with no single party holding majority. Regional autonomy creates multiple power centers. The military (TNI) remains influential in security and some governance areas. Civil society is vibrant but faces occasional pressure. Islamic organizations have significant social influence. Political competition is intense but generally peaceful.',
      'Economic model: Lower-middle-income economy ($1.1 trillion GDP). Largest economy in Southeast Asia. Heavily dependent on commodity exports (coal, palm oil, tin, nickel). Manufacturing sector growing but faces labor cost pressures. Financial services and tourism are significant. Domestic consumption drives growth. Inequality is high and growing. Informal economy is large.',
      'Top 3 risks (6–18 months): (1) Commodity price collapse affecting fiscal revenue and currency stability; (2) South China Sea tensions or China-Taiwan conflict disrupting regional trade; (3) Domestic political fragmentation or military intervention in governance.',
      'Top 3 watch items (4–12 weeks): (1) Commodity prices (coal, palm oil, nickel) — critical for fiscal revenue; (2) South China Sea developments and Chinese assertiveness; (3) Prabowo government policy implementation and coalition stability.',
      'External dependencies: Commodity exports account for ~40% of export revenue. China is largest trading partner (~20% of trade). ASEAN membership is central to foreign policy. Strait of Malacca transit is critical for global trade (25% of global maritime trade). Foreign direct investment concentrated in resource extraction and manufacturing. Remittances from diaspora (~$13 billion annually) are significant.',
      'Security posture: Regional military power with significant capabilities. No standing external military threats but faces internal terrorism (Jemaah Islamiyah, ISIS-affiliated groups). Piracy and maritime security concerns in Strait of Malacca. Territorial disputes with China in South China Sea. Military modernization ongoing but constrained by budget. Border security concerns with Papua New Guinea.',
      'Diplomatic orientation: ASEAN leader and non-aligned movement participant. Pragmatic engagement with both China and US. Strategic partnership with Australia. Expanding ties with India and Japan. South China Sea disputes with China but maintains economic engagement. Balancing act between regional stability and great power competition.',
      'Data confidence: Medium — Indonesia publishes macroeconomic data but political/security data is less transparent. Institutional capacity is improving but remains uneven. Media freedom is good but faces occasional pressure.',
      'Baseline outlook: Stable but vulnerable to external shocks. Prabowo government will consolidate power but faces coalition management challenges. Economic growth will moderate but remain positive (4-5%). Regional tensions will persist but major conflict is unlikely. The key challenge is managing commodity dependency and great power competition while maintaining democratic institutions.',
    ],
    political: {
      powerStructure: 'President holds executive power but is constrained by a fractious legislature (DPR with 575 seats). The legislature is dominated by multiple parties with no single majority — Prabowo\'s coalition includes Gerindra, PKB, PPP, and others. The judiciary is independent but faces capacity constraints. The military (TNI) retains significant political influence despite democratic transition. Regional governors have substantial autonomy under decentralization framework. The civil service is large but faces corruption and capacity issues. The police (Polri) are separate from military and report to president.',
      stabilityDrivers: 'Legitimacy rests on democratic elections, Islamic identity, and economic growth. Indonesia has successfully transitioned to democracy and held multiple peaceful elections. The military accepts civilian control (mostly). Regional autonomy provides stability valve for local grievances. Islam is central to national identity and provides social cohesion. Economic growth has lifted millions from poverty. However, political competition is intense and can be destabilizing. Corruption remains endemic. Inequality is high and growing.',
      shockAbsorbers: 'Absorbers: Large domestic market and consumption-driven growth. Diversified economy (commodities, manufacturing, services). Foreign exchange reserves (~$140 billion) provide macroeconomic buffer. ASEAN membership and regional influence. Military capability and internal security apparatus. Accelerants: Commodity price collapse below $50/barrel for coal would force fiscal consolidation. China-Taiwan conflict or major South China Sea escalation would disrupt trade and investment. Domestic political crisis or military intervention would undermine investor confidence. Terrorism escalation would disrupt security and tourism.',
    },
    economy: {
      macroReality: 'GDP growth forecast 4.5-5% for 2025-2026 (IMF) — solid but below pre-pandemic rates. Inflation is projected at ~3.5% (within Bank Indonesia\'s target band). The fiscal deficit is projected at ~2.5% of GDP for 2025 (within sustainable levels). Public debt stands at ~36% of GDP (manageable). The rupiah has depreciated ~3% against the US dollar since late 2024 due to capital outflows and interest rate differentials. Unemployment is ~4% (low by regional standards). However, underemployment and informal employment are high. Poverty remains at ~9% of population.',
      externalVulnerability: 'Indonesia is highly dependent on commodity exports — coal, palm oil, tin, nickel account for ~40% of export revenue. China is the largest trading partner (~20% of trade) and largest buyer of commodities. Global commodity prices are volatile and vulnerable to demand shocks. The Strait of Malacca is critical for energy imports and trade — any disruption would devastate the economy. Foreign direct investment is concentrated in resource extraction and manufacturing — vulnerable to commodity cycles and geopolitical shifts. Remittances from diaspora (~$13 billion annually) are significant but not critical. Sovereign debt is investment-grade (Moody\'s Baa1) but under pressure from fiscal deficits and currency depreciation.',
      politicalEconomy: 'Prabowo government\'s economic agenda prioritizes infrastructure investment, manufacturing development, and commodity value-added processing. However, fiscal constraints limit spending flexibility. The government is pursuing free trade agreements to diversify markets away from China dependency. The mining sector faces pressure from environmental regulations and sustainability concerns. The palm oil sector faces international pressure on deforestation. Manufacturing sector is growing but faces labor cost pressures and competition from Vietnam. The financial sector is developing but remains concentrated. Corruption in procurement and resource management is endemic.',
    },
    security: {
      internal: 'Internal terrorism threat is moderate. Jemaah Islamiyah (JI) and ISIS-affiliated groups remain active but degraded by security operations. Lone-wolf attacks and small-cell operations are the primary threat. Communal violence between religious groups occurs occasionally but is generally contained. Gang violence in urban areas is a concern. The military and police conduct counterterrorism operations but face capacity constraints. Human rights concerns regarding detention and interrogation practices. Cybersecurity and critical infrastructure protection are growing concerns.',
      diplomacy: 'Indonesia is ASEAN leader and non-aligned movement participant. Pragmatic engagement with both China and US — seeks to avoid choosing sides in great power competition. Strategic partnership with Australia but tensions over maritime boundaries and refugee issues. Expanding ties with India and Japan as counterweights to China. South China Sea disputes with China (overlapping claims) but maintains economic engagement. Balancing act between regional stability and great power competition. Hosts ASEAN secretariat and plays mediating role in regional disputes.',
    },
    actors: {
      domestic: [
        {
          name: 'Prabowo Subianto (President) & Gerindra Party',
          interests: 'Consolidate power, implement infrastructure/manufacturing agenda, manage coalition, maintain military influence, counter corruption narrative',
          resources: 'Executive authority, military background, coalition control, business interests, regional support',
          constraints: 'Fractious coalition, legislative opposition, corruption allegations, military reform pressure, commodity dependency',
          likelyMoves: 'Pursue infrastructure investment, strengthen military ties, manage coalition partners, implement selective anti-corruption, maintain pragmatic China engagement',
          dealability: 'Medium — Prabowo is pragmatic but will prioritize military/business interests and coalition management.',
        },
        {
          name: 'Coalition Partners (PKB, PPP, others)',
          interests: 'Secure government positions, protect regional interests, maintain coalition stability, advance party agendas',
          resources: 'Legislative seats, regional political machines, patronage networks',
          constraints: 'Limited independent power, dependence on coalition partners, electoral vulnerability',
          likelyMoves: 'Demand ministerial positions and budget allocations, threaten coalition withdrawal if demands unmet, advance regional interests',
          dealability: 'Medium — coalition partners are transactional and will negotiate but threaten instability.',
        },
        {
          name: 'Opposition Parties (PDI-P, Golkar, others)',
          interests: 'Regain political power, challenge government policies, appeal to reform constituencies, build alternative coalition',
          resources: 'Legislative seats, regional bases, civil society networks, media platforms',
          constraints: 'Loss of presidency and coalition control, limited legislative power, internal divisions',
          likelyMoves: 'Mobilize against government policies, challenge budget allocations, appeal to reform/anti-corruption constituencies, build coalition for 2029 elections',
          dealability: 'Low-Medium — opposition is weakened but will challenge government through legislative and public pressure.',
        },
        {
          name: 'Military (TNI) & Security Forces',
          interests: 'Maintain political influence, protect institutional interests, counter terrorism, manage internal security, modernize capabilities',
          resources: 'Military capability, internal security networks, defense budget, political connections, territorial control',
          constraints: 'Democratic civilian control pressure, budget constraints, reform pressure, international scrutiny',
          likelyMoves: 'Maintain political influence through Prabowo connection, expand counterterrorism operations, resist military reform, seek defense budget increases',
          dealability: 'Medium — military is loyal to Prabowo but will protect institutional interests and resist civilian oversight.',
        },
        {
          name: 'Business & Mining Sector',
          interests: 'Maintain commodity exports, attract foreign investment, protect business interests, influence policy on regulations',
          resources: 'Capital, employment, international connections, commodity wealth, political influence',
          constraints: 'Commodity price volatility, environmental pressure, labor costs, corruption scrutiny',
          likelyMoves: 'Lobby for deregulation, seek infrastructure investment, protect commodity exports, influence environmental policy',
          dealability: 'High — business is pragmatic and aligned with Prabowo on economic growth and infrastructure.',
        },
        {
          name: 'Civil Society & Reform Movement',
          interests: 'Anti-corruption, democratic strengthening, environmental protection, labor rights, social justice',
          resources: 'Grassroots mobilization, international NGO networks, media attention, moral authority, student movements',
          constraints: 'Limited institutional power, occasional government pressure, resource constraints',
          likelyMoves: 'Mobilize on anti-corruption and environmental issues, document government actions, appeal to international bodies, organize protests',
          dealability: 'Low-Medium — civil society is active but faces government pressure and has limited leverage.',
        },
        {
          name: 'Islamic Organizations & Religious Leaders',
          interests: 'Protect Islamic interests, influence policy on religious matters, maintain social influence, counter secularism',
          resources: 'Social networks, religious authority, grassroots mobilization, media platforms, educational institutions',
          constraints: 'Limited formal political power, internal divisions, international pressure on extremism',
          likelyMoves: 'Influence policy on religious/moral issues, mobilize on religious matters, counter secular policies, maintain social influence',
          dealability: 'Medium — religious organizations are influential but diverse and sometimes conflicting.',
        },
      ],
      external: [
        {
          name: 'China',
          interests: 'Secure commodity supplies, expand economic influence, counter US dominance, maintain regional stability, protect South China Sea claims',
          resources: 'Capital investment, market access, Belt and Road partnerships, military capability, energy demand',
          constraints: 'South China Sea disputes, ASEAN unity pressure, US security partnerships, environmental concerns',
          likelyMoves: 'Expand investment in infrastructure/mining, maintain commodity purchases, pressure on South China Sea, expand military presence',
          dealability: 'Medium — Indonesia will maintain pragmatic economic engagement with China while managing disputes.',
        },
        {
          name: 'United States',
          interests: 'Maintain Indonesia as strategic partner, counter China influence, ensure Strait of Malacca security, support democracy',
          resources: 'Military support, intelligence, diplomatic leverage, technology, development aid',
          constraints: 'Indonesia\'s pragmatic China engagement, military ties concerns, non-aligned preference',
          likelyMoves: 'Strengthen military cooperation, pressure on South China Sea, expand trade/investment, support democratic institutions',
          dealability: 'Medium — Indonesia will balance US partnership with China engagement and non-aligned preference.',
        },
        {
          name: 'ASEAN',
          interests: 'Regional stability, consensus decision-making, counter great power dominance, maintain ASEAN centrality',
          resources: 'Regional influence, diplomatic forums, collective action capacity',
          constraints: 'Internal divisions, consensus requirement, great power pressure',
          likelyMoves: 'Lead ASEAN consensus-building, mediate regional disputes, resist great power dominance, maintain ASEAN unity',
          dealability: 'High — Indonesia is ASEAN leader and will prioritize regional consensus.',
        },
        {
          name: 'Australia',
          interests: 'Regional stability, counter China influence, maintain strategic partnership, manage maritime boundaries',
          resources: 'Military capability, regional influence, trade partnership, development aid',
          constraints: 'Maritime boundary disputes, refugee issues, different China engagement approaches',
          likelyMoves: 'Strengthen defense cooperation, coordinate on South China Sea, manage maritime issues, expand trade',
          dealability: 'Medium-High — Australia and Indonesia are strategic partners with aligned interests on regional security.',
        },
        {
          name: 'India & Japan',
          interests: 'Counter China influence, expand economic partnerships, maintain regional stability, secure supply chains',
          resources: 'Capital investment, technology, military capability, trade partnerships',
          constraints: 'Limited regional presence compared to China, competing interests',
          likelyMoves: 'Expand investment and trade, strengthen defense cooperation, coordinate on China policy, support ASEAN unity',
          dealability: 'High — India and Japan are seeking to expand influence and will align with Indonesia on regional issues.',
        },
      ],
    },
    risks: [
      {
        title: 'Commodity Price Collapse & Fiscal Crisis',
        trigger: 'Global coal/palm oil/nickel prices collapse due to energy transition, recession, or supply surge',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '6-18 months',
        leadingIndicators: 'Commodity prices, energy transition progress, global demand, currency volatility',
        mitigants: 'Foreign exchange reserves (~$140 billion), diversified economy, fiscal adjustment capacity, commodity value-added processing',
        lastAssessed: 'April 2026',
      },
      {
        title: 'South China Sea Escalation or China-Taiwan Conflict',
        trigger: 'Military confrontation in South China Sea or China-Taiwan conflict disrupting regional trade',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '6-24 months',
        leadingIndicators: 'China military movements, Taiwan tensions, US-China rhetoric, maritime incidents',
        mitigants: 'ASEAN consensus, US security partnership, diplomatic engagement, regional de-escalation efforts',
        lastAssessed: 'April 2026',
      },
      {
        title: 'Political Fragmentation or Military Intervention',
        trigger: 'Coalition government collapse, major political crisis, or military intervention in governance',
        probability: 'Low',
        impact: 'High',
        timeHorizon: '6-18 months',
        leadingIndicators: 'Coalition partner statements, political tensions, military rhetoric, electoral polling',
        mitigants: 'Democratic institutions, civil society pressure, international scrutiny, military professionalization',
        lastAssessed: 'April 2026',
      },
      {
        title: 'Terrorism Escalation & Security Crisis',
        trigger: 'Major terrorist attack, ISIS-affiliated group resurgence, or security operation failure',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '6-18 months',
        leadingIndicators: 'Terrorist activity, security incidents, extremist recruitment, international terrorism alerts',
        mitigants: 'Counterterrorism operations, military capability, intelligence networks, community engagement',
        lastAssessed: 'April 2026',
      },
      {
        title: 'Currency Crisis & Capital Flight',
        trigger: 'Rapid rupiah depreciation, capital outflows, or foreign exchange reserve depletion',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '6-18 months',
        leadingIndicators: 'Currency movements, capital flows, interest rate differentials, commodity prices',
        mitigants: 'Foreign exchange reserves, monetary policy adjustment, capital controls, IMF support',
        lastAssessed: 'April 2026',
      },
      {
        title: 'Environmental Crisis & Climate Impact',
        trigger: 'Severe flooding, drought, or forest fires affecting agriculture and infrastructure',
        probability: 'Med',
        impact: 'Med',
        timeHorizon: '6-18 months',
        leadingIndicators: 'Weather patterns, climate forecasts, environmental indicators, agricultural production',
        mitigants: 'Climate adaptation programs, disaster management capacity, agricultural diversification, international support',
        lastAssessed: 'April 2026',
      },
    ],
    sources: [
      {
        name: 'Bank Indonesia (BI)',
        url: 'https://www.bi.go.id',
        desc: 'Official central bank data on monetary policy, inflation, exchange rates, financial stability',
      },
      {
        name: 'Statistics Indonesia (BPS)',
        url: 'https://www.bps.go.id',
        desc: 'National statistics — GDP, employment, poverty, inflation, trade data',
      },
      {
        name: 'IMF Indonesia Article IV Consultation',
        url: 'https://www.imf.org',
        desc: 'IMF macroeconomic assessment and policy recommendations',
      },
      {
        name: 'ISEAS-Yusof Ishak Institute',
        url: 'https://www.iseas.edu.sg',
        desc: 'Leading Southeast Asia think tank with research on Indonesia, regional politics, and geopolitics',
      },
      {
        name: 'SIPRI Military Expenditure Database',
        url: 'https://www.sipri.org',
        desc: 'Military spending and arms transfer data',
      },
      {
        name: 'ACLED (Armed Conflict Location & Event Data)',
        url: 'https://acleddata.com',
        desc: 'Real-time conflict and violence data tracking terrorism and security incidents',
      },
      {
        name: 'Freedom House Indonesia Report',
        url: 'https://freedomhouse.org',
        desc: 'Assessment of political rights, civil liberties, press freedom in Indonesia',
      },
      {
        name: 'Indonesian Media (Kompas, Jakarta Post, Tempo)',
        url: 'https://www.thejakartapost.com',
        desc: 'Independent media coverage of Indonesian politics, economics, and security',
      },
    ],
  },
  fr: {
    executiveSnapshot: [
      'Type de régime : Démocratie présidentielle (démocratie islamique). Prabowo Subianto élu président en octobre 2024, prenant ses fonctions en octobre 2024. Élections présidentielles directes. Gouvernance décentralisée avec autonomie provinciale significative. L\'armée conserve une influence politique malgré la transition démocratique. L\'islam est central à l\'identité et à la gouvernance nationales.',
      'Équilibre politique : Prabowo dirige un gouvernement de coalition large avec plusieurs partis. La législature (DPR) est fractionnée sans aucun parti détenant la majorité. L\'autonomie régionale crée plusieurs centres de pouvoir. L\'armée (TNI) reste influente dans la sécurité et certains domaines de gouvernance. La société civile est dynamique mais fait face à une pression occasionnelle. Les organisations islamiques ont une influence sociale significative. La concurrence politique est intense mais généralement pacifique.',
      'Modèle économique : Économie à revenu intermédiaire inférieur (PIB de 1,1 billion de dollars). Plus grande économie d\'Asie du Sud-Est. Fortement dépendante des exportations de produits de base (charbon, huile de palme, étain, nickel). Le secteur manufacturier se développe mais fait face à des pressions sur les coûts de main-d\'œuvre. Les services financiers et le tourisme sont importants. La consommation intérieure stimule la croissance. L\'inégalité est élevée et croissante. L\'économie informelle est importante.',
      'Top 3 risques (6–18 mois) : (1) Effondrement des prix des produits de base affectant les revenus budgétaires et la stabilité des devises ; (2) Tensions en Mer de Chine méridionale ou conflit Chine-Taïwan perturbant le commerce régional ; (3) Fragmentation politique intérieure ou intervention militaire dans la gouvernance.',
      'Top 3 éléments de surveillance (4–12 semaines) : (1) Prix des produits de base (charbon, huile de palme, nickel) — critiques pour les revenus budgétaires ; (2) Développements en Mer de Chine méridionale et affirmation chinoise ; (3) Mise en œuvre de la politique gouvernementale de Prabowo et stabilité de la coalition.',
      'Dépendances externes : Les exportations de produits de base représentent ~40% des revenus d\'exportation. La Chine est le plus grand partenaire commercial (~20% du commerce). L\'adhésion à l\'ASEAN est centrale à la politique étrangère. Le transit du détroit de Malacca est critique pour le commerce mondial (25% du commerce maritime mondial). L\'investissement direct étranger concentré dans l\'extraction de ressources et la fabrication. Les transferts de fonds de la diaspora (~13 milliards de dollars annuellement) sont importants.',
      'Posture de sécurité : Puissance militaire régionale avec des capacités significatives. Aucune menace militaire externe permanente mais fait face au terrorisme intérieur (Jemaah Islamiyah, groupes affiliés à l\'ISIS). Préoccupations concernant la piraterie et la sécurité maritime au détroit de Malacca. Différends territoriaux avec la Chine en Mer de Chine méridionale. Modernisation militaire en cours mais limitée par le budget. Préoccupations concernant la sécurité des frontières avec la Papouasie-Nouvelle-Guinée.',
      'Orientation diplomatique : Leader de l\'ASEAN et participant au mouvement des non-alignés. Engagement pragmatique avec la Chine et les États-Unis. Partenariat stratégique avec l\'Australie. Expansion des liens avec l\'Inde et le Japon. Différends en Mer de Chine méridionale avec la Chine mais maintient l\'engagement économique. Équilibre entre la stabilité régionale et la concurrence des grandes puissances.',
      'Confiance des données : Moyen — l\'Indonésie publie des données macroéconomiques mais les données politiques/sécurité sont moins transparentes. La capacité institutionnelle s\'améliore mais reste inégale. La liberté de la presse est bonne mais fait face à une pression occasionnelle.',
      'Perspective de base : Stable mais vulnérable aux chocs externes. Le gouvernement de Prabowo consolidera le pouvoir mais fait face à des défis de gestion de coalition. La croissance économique se modérera mais restera positive (4-5%). Les tensions régionales persisteront mais un conflit majeur est peu probable. Le défi clé est de gérer la dépendance aux produits de base et la concurrence des grandes puissances tout en maintenant les institutions démocratiques.',
    ],
    political: {
      powerStructure: 'Le président détient le pouvoir exécutif mais est limité par une législature fractionnée (DPR avec 575 sièges). La législature est dominée par plusieurs partis sans majorité unique — la coalition de Prabowo comprend Gerindra, PKB, PPP et d\'autres. La magistrature est indépendante mais fait face à des contraintes de capacité. L\'armée (TNI) conserve une influence politique significative malgré la transition démocratique. Les gouverneurs régionaux ont une autonomie substantielle en vertu du cadre de décentralisation. La fonction publique est importante mais fait face à la corruption et aux problèmes de capacité. La police (Polri) est séparée de l\'armée et rend compte au président.',
      stabilityDrivers: 'La légitimité repose sur les élections démocratiques, l\'identité islamique et la croissance économique. L\'Indonésie a avec succès transitionné vers la démocratie et tenu plusieurs élections pacifiques. L\'armée accepte le contrôle civil (en grande partie). L\'autonomie régionale fournit une soupape de sécurité pour les griefs locaux. L\'islam est central à l\'identité nationale et fournit la cohésion sociale. La croissance économique a sorti des millions de la pauvreté. Cependant, la concurrence politique est intense et peut être déstabilisante. La corruption reste endémique. L\'inégalité est élevée et croissante.',
      shockAbsorbers: 'Amortisseurs : Grand marché intérieur et croissance tirée par la consommation. Économie diversifiée (produits de base, fabrication, services). Réserves de change (~140 milliards de dollars) fournissent un tampon macroéconomique. Adhésion à l\'ASEAN et influence régionale. Capacité militaire et appareil de sécurité intérieure. Accélérateurs : Effondrement des prix des produits de base en dessous de 50 dollars le baril pour le charbon forcerait la consolidation budgétaire. Conflit Chine-Taïwan ou escalade majeure en Mer de Chine méridionale perturberait le commerce et l\'investissement. Crise politique intérieure ou intervention militaire minerait la confiance des investisseurs. Escalade du terrorisme perturberait la sécurité et le tourisme.',
    },
    economy: {
      macroReality: 'La croissance du PIB est prévue à 4,5-5% pour 2025-2026 (FMI) — solide mais en dessous des taux d\'avant la pandémie. L\'inflation est projetée à ~3,5% (dans la bande cible de la Banque d\'Indonésie). Le déficit budgétaire est projeté à ~2,5% du PIB pour 2025 (dans les niveaux durables). La dette publique s\'élève à ~36% du PIB (gérable). La roupie s\'est dépréciée ~3% par rapport au dollar américain depuis fin 2024 en raison des sorties de capitaux et des différentiels de taux d\'intérêt. Le chômage est ~4% (faible selon les normes régionales). Cependant, le sous-emploi et l\'emploi informel sont élevés. La pauvreté reste à ~9% de la population.',
      externalVulnerability: 'L\'Indonésie dépend fortement des exportations de produits de base — le charbon, l\'huile de palme, l\'étain, le nickel représentent ~40% des revenus d\'exportation. La Chine est le plus grand partenaire commercial (~20% du commerce) et le plus grand acheteur de produits de base. Les prix mondiaux des produits de base sont volatiles et vulnérables aux chocs de la demande. Le détroit de Malacca est critique pour les importations d\'énergie et le commerce — toute perturbation dévasterait l\'économie. L\'investissement direct étranger est concentré dans l\'extraction de ressources et la fabrication — vulnérable aux cycles des produits de base et aux changements géopolitiques. Les transferts de fonds de la diaspora (~13 milliards de dollars annuellement) sont importants mais non critiques. La dette souveraine est de qualité investissement (Moody\'s Baa1) mais sous pression en raison des déficits budgétaires et de la dépréciation des devises.',
      politicalEconomy: 'L\'agenda économique du gouvernement de Prabowo privilégie l\'investissement dans les infrastructures, le développement manufacturier et le traitement à valeur ajoutée des produits de base. Cependant, les contraintes budgétaires limitent la flexibilité des dépenses. Le gouvernement poursuit les accords de libre-échange pour diversifier les marchés loin de la dépendance chinoise. Le secteur minier fait face à la pression des réglementations environnementales et des préoccupations de durabilité. Le secteur de l\'huile de palme fait face à la pression internationale sur la déforestation. Le secteur manufacturier se développe mais fait face à des pressions sur les coûts de main-d\'œuvre et à la concurrence du Vietnam. Le secteur financier se développe mais reste concentré. La corruption dans l\'approvisionnement et la gestion des ressources est endémique.',
    },
    security: {
      internal: 'La menace du terrorisme intérieur est modérée. Jemaah Islamiyah (JI) et les groupes affiliés à l\'ISIS restent actifs mais affaiblis par les opérations de sécurité. Les attaques de loups solitaires et les opérations de petites cellules sont la menace principale. La violence communautaire entre groupes religieux se produit occasionnellement mais est généralement contenue. La violence des gangs dans les zones urbaines est une préoccupation. L\'armée et la police mènent des opérations de lutte contre le terrorisme mais font face à des contraintes de capacité. Préoccupations concernant les droits de l\'homme concernant la détention et les pratiques d\'interrogatoire. La cybersécurité et la protection des infrastructures critiques sont des préoccupations croissantes.',
      diplomacy: 'L\'Indonésie est leader de l\'ASEAN et participant au mouvement des non-alignés. Engagement pragmatique avec la Chine et les États-Unis — cherche à éviter de choisir un camp dans la concurrence des grandes puissances. Partenariat stratégique avec l\'Australie mais tensions sur les limites maritimes et les questions de réfugiés. Expansion des liens avec l\'Inde et le Japon comme contrepoids à la Chine. Différends en Mer de Chine méridionale avec la Chine (réclamations chevauchantes) mais maintient l\'engagement économique. Équilibre entre la stabilité régionale et la concurrence des grandes puissances. Accueille le secrétariat de l\'ASEAN et joue un rôle de médiation dans les différends régionaux.',
    },
    actors: {
      domestic: [
        {
          name: 'Prabowo Subianto (Président) et Parti Gerindra',
          interests: 'Consolider le pouvoir, mettre en œuvre l\'agenda d\'infrastructure/fabrication, gérer la coalition, maintenir l\'influence militaire, contrer la narration de corruption',
          resources: 'Autorité exécutive, antécédents militaires, contrôle de coalition, intérêts commerciaux, soutien régional',
          constraints: 'Coalition fractionnée, opposition législative, allégations de corruption, pression de réforme militaire, dépendance aux produits de base',
          likelyMoves: 'Poursuivre l\'investissement dans les infrastructures, renforcer les liens militaires, gérer les partenaires de coalition, mettre en œuvre une lutte sélective contre la corruption, maintenir l\'engagement pragmatique avec la Chine',
          dealability: 'Moyen — Prabowo est pragmatique mais privilégiera les intérêts militaires/commerciaux et la gestion de coalition.',
        },
        {
          name: 'Partenaires de coalition (PKB, PPP, autres)',
          interests: 'Sécuriser les postes gouvernementaux, protéger les intérêts régionaux, maintenir la stabilité de la coalition, faire avancer les agendas des partis',
          resources: 'Sièges législatifs, machines politiques régionales, réseaux de patronage',
          constraints: 'Pouvoir indépendant limité, dépendance aux partenaires de coalition, vulnérabilité électorale',
          likelyMoves: 'Exiger des postes ministériels et des allocations budgétaires, menacer de retrait de la coalition si les demandes ne sont pas satisfaites, faire avancer les intérêts régionaux',
          dealability: 'Moyen — les partenaires de coalition sont transactionnels et négocieront mais menacent l\'instabilité.',
        },
        {
          name: 'Partis d\'opposition (PDI-P, Golkar, autres)',
          interests: 'Reprendre le pouvoir politique, contester les politiques gouvernementales, attirer les constituencies de réforme, construire une coalition alternative',
          resources: 'Sièges législatifs, bases régionales, réseaux de la société civile, plateformes médiatiques',
          constraints: 'Perte de la présidence et du contrôle de coalition, pouvoir législatif limité, divisions internes',
          likelyMoves: 'Mobiliser contre les politiques gouvernementales, contester les allocations budgétaires, attirer les constituencies de réforme/anti-corruption, construire une coalition pour les élections 2029',
          dealability: 'Faible-Moyen — l\'opposition est affaiblie mais contestera le gouvernement par la pression législative et publique.',
        },
        {
          name: 'Armée (TNI) et forces de sécurité',
          interests: 'Maintenir l\'influence politique, protéger les intérêts institutionnels, contrer le terrorisme, gérer la sécurité intérieure, moderniser les capacités',
          resources: 'Capacité militaire, réseaux de sécurité intérieure, budget de défense, connexions politiques, contrôle territorial',
          constraints: 'Pression de contrôle civil démocratique, contraintes budgétaires, pression de réforme, examen international',
          likelyMoves: 'Maintenir l\'influence politique par la connexion de Prabowo, élargir les opérations de lutte contre le terrorisme, résister à la réforme militaire, chercher les augmentations du budget de défense',
          dealability: 'Moyen — l\'armée est loyale à Prabowo mais protégera les intérêts institutionnels et résistera à la surveillance civile.',
        },
        {
          name: 'Secteur des affaires et des mines',
          interests: 'Maintenir les exportations de produits de base, attirer l\'investissement étranger, protéger les intérêts commerciaux, influencer la politique sur les réglementations',
          resources: 'Capital, emploi, connexions internationales, richesse en produits de base, influence politique',
          constraints: 'Volatilité des prix des produits de base, pression environnementale, coûts de main-d\'œuvre, examen de la corruption',
          likelyMoves: 'Faire du lobbying pour la déréglementation, chercher l\'investissement dans les infrastructures, protéger les exportations de produits de base, influencer la politique environnementale',
          dealability: 'Élevé — les entreprises sont pragmatiques et alignées avec Prabowo sur la croissance économique et les infrastructures.',
        },
        {
          name: 'Société civile et mouvement de réforme',
          interests: 'Lutte contre la corruption, renforcement démocratique, protection de l\'environnement, droits du travail, justice sociale',
          resources: 'Mobilisation de base, réseaux d\'ONG internationales, attention médiatique, autorité morale, mouvements étudiants',
          constraints: 'Pouvoir institutionnel limité, pression gouvernementale occasionnelle, contraintes de ressources',
          likelyMoves: 'Mobiliser sur les questions de lutte contre la corruption et d\'environnement, documenter les actions gouvernementales, faire appel aux organismes internationaux, organiser des protestations',
          dealability: 'Faible-Moyen — la société civile est active mais fait face à la pression gouvernementale et a un levier limité.',
        },
        {
          name: 'Organisations islamiques et chefs religieux',
          interests: 'Protéger les intérêts islamiques, influencer la politique sur les questions religieuses, maintenir l\'influence sociale, contrer le sécularisme',
          resources: 'Réseaux sociaux, autorité religieuse, mobilisation de base, plateformes médiatiques, institutions éducatives',
          constraints: 'Pouvoir politique formel limité, divisions internes, pression internationale sur l\'extrémisme',
          likelyMoves: 'Influencer la politique sur les questions religieuses/morales, mobiliser sur les questions religieuses, contrer les politiques laïques, maintenir l\'influence sociale',
          dealability: 'Moyen — les organisations religieuses sont influentes mais diverses et parfois conflictuelles.',
        },
      ],
      external: [
        {
          name: 'Chine',
          interests: 'Sécuriser les approvisionnements en produits de base, élargir l\'influence économique, contrer la dominance américaine, maintenir la stabilité régionale, protéger les réclamations en Mer de Chine méridionale',
          resources: 'Investissement en capital, accès au marché, partenariats de la Ceinture et de la Route, capacité militaire, demande d\'énergie',
          constraints: 'Différends en Mer de Chine méridionale, pression de l\'unité de l\'ASEAN, partenariats de sécurité américains, préoccupations environnementales',
          likelyMoves: 'Élargir l\'investissement dans l\'infrastructure/mines, maintenir les achats de produits de base, faire pression sur la Mer de Chine méridionale, élargir la présence militaire',
          dealability: 'Moyen — l\'Indonésie maintiendra l\'engagement économique pragmatique avec la Chine tout en gérant les différends.',
        },
        {
          name: 'États-Unis',
          interests: 'Maintenir l\'Indonésie comme partenaire stratégique, contrer l\'influence chinoise, assurer la sécurité du détroit de Malacca, soutenir la démocratie',
          resources: 'Soutien militaire, renseignement, levier diplomatique, technologie, aide au développement',
          constraints: 'Engagement pragmatique de l\'Indonésie avec la Chine, préoccupations concernant les liens militaires, préférence non-alignée',
          likelyMoves: 'Renforcer la coopération militaire, faire pression sur la Mer de Chine méridionale, élargir le commerce/investissement, soutenir les institutions démocratiques',
          dealability: 'Moyen — l\'Indonésie équilibrera le partenariat américain avec l\'engagement chinois et la préférence non-alignée.',
        },
        {
          name: 'ASEAN',
          interests: 'Stabilité régionale, prise de décision par consensus, contrer la dominance des grandes puissances, maintenir la centralité de l\'ASEAN',
          resources: 'Influence régionale, forums diplomatiques, capacité d\'action collective',
          constraints: 'Divisions internes, exigence de consensus, pression des grandes puissances',
          likelyMoves: 'Diriger la construction du consensus de l\'ASEAN, médier les différends régionaux, résister à la dominance des grandes puissances, maintenir l\'unité de l\'ASEAN',
          dealability: 'Élevé — l\'Indonésie est leader de l\'ASEAN et privilégiera le consensus régional.',
        },
        {
          name: 'Australie',
          interests: 'Stabilité régionale, contrer l\'influence chinoise, maintenir le partenariat stratégique, gérer les limites maritimes',
          resources: 'Capacité militaire, influence régionale, partenariat commercial, aide au développement',
          constraints: 'Différends sur les limites maritimes, problèmes de réfugiés, approches différentes de l\'engagement avec la Chine',
          likelyMoves: 'Renforcer la coopération de défense, coordonner sur la Mer de Chine méridionale, gérer les questions maritimes, élargir le commerce',
          dealability: 'Moyen-Élevé — l\'Australie et l\'Indonésie sont des partenaires stratégiques avec des intérêts alignés sur la sécurité régionale.',
        },
        {
          name: 'Inde et Japon',
          interests: 'Contrer l\'influence chinoise, élargir les partenariats économiques, maintenir la stabilité régionale, sécuriser les chaînes d\'approvisionnement',
          resources: 'Investissement en capital, technologie, capacité militaire, partenariats commerciaux',
          constraints: 'Présence régionale limitée par rapport à la Chine, intérêts concurrents',
          likelyMoves: 'Élargir l\'investissement et le commerce, renforcer la coopération de défense, coordonner sur la politique chinoise, soutenir l\'unité de l\'ASEAN',
          dealability: 'Élevé — l\'Inde et le Japon cherchent à élargir l\'influence et s\'aligneront avec l\'Indonésie sur les questions régionales.',
        },
      ],
    },
    risks: [
      {
        title: 'Effondrement des prix des produits de base et crise budgétaire',
        trigger: 'Les prix mondiaux du charbon/huile de palme/nickel s\'effondrent en raison de la transition énergétique, d\'une récession ou d\'une augmentation de l\'approvisionnement',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '6-18 mois',
        leadingIndicators: 'Prix des produits de base, progrès de la transition énergétique, demande mondiale, volatilité des devises',
        mitigants: 'Réserves de change (~140 milliards de dollars), économie diversifiée, capacité d\'ajustement budgétaire, traitement à valeur ajoutée des produits de base',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Escalade en Mer de Chine méridionale ou conflit Chine-Taïwan',
        trigger: 'Confrontation militaire en Mer de Chine méridionale ou conflit Chine-Taïwan perturbant le commerce régional',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '6-24 mois',
        leadingIndicators: 'Mouvements militaires chinois, tensions taïwanaises, rhétorique États-Unis-Chine, incidents maritimes',
        mitigants: 'Consensus de l\'ASEAN, partenariat de sécurité américain, engagement diplomatique, efforts de désescalade régionale',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Fragmentation politique ou intervention militaire',
        trigger: 'Effondrement du gouvernement de coalition, crise politique majeure ou intervention militaire dans la gouvernance',
        probability: 'Low',
        impact: 'High',
        timeHorizon: '6-18 mois',
        leadingIndicators: 'Déclarations des partenaires de coalition, tensions politiques, rhétorique militaire, sondage électoral',
        mitigants: 'Institutions démocratiques, pression de la société civile, examen international, professionnalisation militaire',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Escalade du terrorisme et crise de sécurité',
        trigger: 'Attaque terroriste majeure, résurgence du groupe affilié à l\'ISIS ou échec de l\'opération de sécurité',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '6-18 mois',
        leadingIndicators: 'Activité terroriste, incidents de sécurité, recrutement extrémiste, alertes du terrorisme international',
        mitigants: 'Opérations de lutte contre le terrorisme, capacité militaire, réseaux de renseignement, engagement communautaire',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Crise des devises et fuite de capitaux',
        trigger: 'Dépréciation rapide de la roupie, sorties de capitaux ou épuisement des réserves de change',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '6-18 mois',
        leadingIndicators: 'Mouvements des devises, flux de capitaux, différentiels de taux d\'intérêt, prix des produits de base',
        mitigants: 'Réserves de change, ajustement de la politique monétaire, contrôles de capitaux, soutien du FMI',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Crise environnementale et impact climatique',
        trigger: 'Inondations graves, sécheresse ou feux de forêt affectant l\'agriculture et les infrastructures',
        probability: 'Med',
        impact: 'Med',
        timeHorizon: '6-18 mois',
        leadingIndicators: 'Modèles météorologiques, prévisions climatiques, indicateurs environnementaux, production agricole',
        mitigants: 'Programmes d\'adaptation climatique, capacité de gestion des catastrophes, diversification agricole, soutien international',
        lastAssessed: 'Avril 2026',
      },
    ],
    sources: [
      {
        name: 'Banque d\'Indonésie (BI)',
        url: 'https://www.bi.go.id',
        desc: 'Données officielles de la banque centrale sur la politique monétaire, l\'inflation, les taux de change, la stabilité financière',
      },
      {
        name: 'Statistiques d\'Indonésie (BPS)',
        url: 'https://www.bps.go.id',
        desc: 'Statistiques nationales — PIB, emploi, pauvreté, inflation, données commerciales',
      },
      {
        name: 'Consultation de l\'article IV du FMI sur l\'Indonésie',
        url: 'https://www.imf.org',
        desc: 'Évaluation macroéconomique du FMI et recommandations politiques',
      },
      {
        name: 'Institut ISEAS-Yusof Ishak',
        url: 'https://www.iseas.edu.sg',
        desc: 'Principal think tank d\'Asie du Sud-Est avec recherche sur l\'Indonésie, la politique régionale et la géopolitique',
      },
      {
        name: 'Base de données des dépenses militaires du SIPRI',
        url: 'https://www.sipri.org',
        desc: 'Données sur les dépenses militaires et les transferts d\'armes',
      },
      {
        name: 'ACLED (Armed Conflict Location & Event Data)',
        url: 'https://acleddata.com',
        desc: 'Données en temps réel sur les conflits et la violence suivant le terrorisme et les incidents de sécurité',
      },
      {
        name: 'Rapport Indonésie de Freedom House',
        url: 'https://freedomhouse.org',
        desc: 'Évaluation des droits politiques, des libertés civiles, de la liberté de la presse en Indonésie',
      },
      {
        name: 'Médias indonésiens (Kompas, Jakarta Post, Tempo)',
        url: 'https://www.thejakartapost.com',
        desc: 'Couverture médiatique indépendante de la politique, de l\'économie et de la sécurité indonésiennes',
      },
    ],
  },
};
