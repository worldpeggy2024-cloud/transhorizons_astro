/*
 * TransHorizons — Singapore Country Analysis Data
 * Full bilingual content following the Country Situation Report framework
 * Focus: Trade hub, South China Sea chokepoint, financial center, China-US competition, strategic autonomy, city-state stability
 * Last updated: April 2026
 * Sources: Monetary Authority of Singapore, Department of Statistics, IMF, World Bank, SIPRI, ACLED, Freedom House, ISEAS-Yusof Ishak Institute
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

export const singaporeAnalysis: AnalysisContent = {
  lastUpdated: '2026-04-15',
  scorecard: {
    eliteCohesion: 'High',
    securityLoyalty: 'High',
    economicPressure: 'Med',
    protestCapacity: 'Low',
    institutionalResilience: 'High',
  },
  en: {
    executiveSnapshot: [
      'Regime type: Parliamentary democracy with dominant-party system. People\'s Action Party (PAP) has governed continuously since independence (1965). Prime Minister Lawrence Wong leads government (since 2024). Elections are held but PAP maintains supermajority. Democratic norms exist but executive dominates. Media is regulated and civil liberties are constrained compared to Western democracies.',
      'Political equilibrium: PAP maintains overwhelming political control with supermajority in Parliament. Opposition parties are weak and fragmented. The civil service is professional and politically neutral. The judiciary is independent but operates within PAP-dominated system. Succession planning within PAP is orderly. Public dissent is rare due to combination of prosperity, surveillance, and legal constraints. Political stability is very high.',
      'Economic model: High-income developed economy ($600 billion GDP). Global financial center and trade hub. Highly dependent on international trade and finance. Refining, petrochemicals, and port operations are major sectors. Financial services, tech, and biomedical are growing. No natural resources — entirely dependent on imports. Extremely open economy with high trade/GDP ratio.',
      'Top 3 risks (6–18 months): (1) South China Sea conflict or China-Taiwan war disrupting critical sea lanes and trade; (2) Global financial crisis or recession affecting financial sector and trade hub role; (3) Geopolitical pressure to choose sides between US and China.',
      'Top 3 watch items (4–12 weeks): (1) South China Sea developments and Chinese assertiveness; (2) Global trade flows and financial market stability; (3) US-China tensions and pressure on Singapore\'s strategic autonomy.',
      'External dependencies: 100% dependent on imports for energy, food, and most raw materials. Trade represents ~350% of GDP (extremely high). China is largest trading partner (~15% of trade). US is major investor and security partner. Strait of Malacca is critical for energy imports. Port of Singapore handles ~30% of global maritime trade. Financial sector dependent on global capital flows. Remittances are minimal but foreign workers are critical to economy.',
      'Security posture: No standing military threats but faces existential vulnerability to regional conflict. Small but highly capable military (air force, navy). Nuclear-free policy. Close security partnership with US (military bases, intelligence). Defense spending is high relative to GDP (~3.5%). Cybersecurity is critical concern. Terrorism threat is low but monitored. Maritime security in Strait of Malacca is priority.',
      'Diplomatic orientation: Strategic autonomy — balances US security partnership with pragmatic China engagement. ASEAN member but maintains separate strategic interests. Non-aligned movement participant. Seeks to avoid choosing sides in great power competition. Maintains defense partnerships with US, Japan, Australia. Pragmatic economic engagement with China.',
      'Data confidence: Very High — Singapore has excellent institutional data, transparency, and institutional quality. One of the most data-rich countries in the world.',
      'Baseline outlook: Stable and prosperous but vulnerable to external shocks. Political stability will remain high. Economic growth will moderate but remain positive (2-3%). The key challenge is maintaining strategic autonomy while managing great power competition. Singapore\'s prosperity depends on regional stability and open global trade.',
    ],
    political: {
      powerStructure: 'Prime Minister holds executive power and is head of government. Parliament is unicameral (104 seats) with PAP holding supermajority (83 seats as of 2020). Opposition parties hold only 10-20 seats. The President is largely ceremonial. The judiciary is independent but operates within PAP-dominated system. The civil service is professional and politically neutral. Local government is minimal — Singapore is highly centralized. The PAP has internal mechanisms for succession planning and policy development.',
      stabilityDrivers: 'Legitimacy rests on economic prosperity, efficient governance, and political stability. Singapore has successfully transitioned from colonial trading post to developed economy. The PAP has delivered prosperity and stability. The civil service is professional and non-corrupt. The judiciary is respected. However, civil liberties are constrained compared to Western democracies — media is regulated, protests are restricted, and surveillance is extensive. Public dissent is rare due to prosperity and legal constraints. The PAP maintains legitimacy through economic performance and efficient governance rather than democratic participation.',
      shockAbsorbers: 'Absorbers: Highly developed economy with strong institutions and rule of law. Massive foreign exchange reserves (~$1 trillion) provide macroeconomic buffer. Diversified financial sector and trade hub role. Flexible labor market and immigration policy. Strong civil service and planning capacity. Accelerants: South China Sea conflict or China-Taiwan war would disrupt sea lanes and trade. Global financial crisis would affect financial sector and trade. Geopolitical pressure to choose sides between US and China would undermine strategic autonomy. Energy crisis or supply disruption would threaten economy.',
    },
    economy: {
      macroReality: 'GDP growth forecast 2-3% for 2025-2026 (IMF) — moderate but below historical averages. Inflation is projected at ~2.5% (within Monetary Authority\'s target band). The fiscal position is strong with budget surpluses. Public debt is minimal (~130% of GDP in reserves but negative net debt). The Singapore dollar has appreciated ~2% against the US dollar since late 2024 due to interest rate differentials and capital inflows. Unemployment is ~2% (very low). However, wage growth is moderate and cost of living is high.',
      externalVulnerability: 'Singapore is 100% dependent on imports for energy, food, and most raw materials. Trade represents ~350% of GDP (extremely high). China is largest trading partner (~15% of trade). US is major investor and security partner. The Strait of Malacca is critical for energy imports — any disruption would devastate the economy. The Port of Singapore handles ~30% of global maritime trade — any disruption would have global implications. Financial sector is dependent on global capital flows and is vulnerable to financial crises. Sovereign wealth funds (Temasek, GIC) have significant global investments and are exposed to geopolitical risks.',
      politicalEconomy: 'The government\'s economic agenda prioritizes financial sector development, tech innovation, and green energy transition. However, Singapore faces challenges from energy transition, labor shortages (reliance on foreign workers), and regional competition. The government is investing in renewable energy and carbon capture. The tech sector is growing but faces competition from regional hubs. The financial sector is adapting to regulatory changes and digital disruption. The government maintains tight control over key sectors (energy, utilities, telecommunications) through state-linked enterprises.',
    },
    security: {
      internal: 'Internal security threats are minimal. There is no terrorism threat or insurgency. Violent crime is very low. The Internal Security Act (ISA) allows detention without trial for security threats — used sparingly but controversial. Cybersecurity is a major concern given reliance on digital infrastructure. The government has strengthened cybersecurity frameworks. Civil liberties are constrained — media is regulated, protests are restricted, and surveillance is extensive. The police are professional and politically neutral. The armed forces are small but highly capable and loyal to the state.',
      diplomacy: 'Singapore maintains strategic autonomy by balancing US security partnership with pragmatic China engagement. Defense partnerships with US (military bases, intelligence), Japan, Australia, and India. ASEAN member but maintains separate strategic interests. Non-aligned movement participant. Seeks to avoid choosing sides in great power competition. Pragmatic economic engagement with China despite South China Sea disputes. Maintains defense partnerships with Western allies while engaging China economically.',
    },
    actors: {
      domestic: [
        {
          name: 'People\'s Action Party (PAP) & Prime Minister Lawrence Wong',
          interests: 'Maintain political control, ensure economic growth, manage succession, preserve strategic autonomy, maintain prosperity',
          resources: 'Executive authority, supermajority control, civil service, state enterprises, institutional machinery',
          constraints: 'Generational change, economic slowdown pressures, geopolitical constraints, civil liberties pressure',
          likelyMoves: 'Maintain economic growth focus, manage succession planning, pursue tech/financial innovation, balance great power competition',
          dealability: 'High — PAP is pragmatic and technocratic, focused on economic performance and stability.',
        },
        {
          name: 'Civil Service & Technocrats',
          interests: 'Maintain efficient governance, pursue economic growth, manage public services, implement policy',
          resources: 'Institutional expertise, planning capacity, administrative machinery, professional networks',
          constraints: 'Political direction from PAP, budget constraints, implementation challenges',
          likelyMoves: 'Implement government policies, pursue efficiency improvements, manage economic transitions, adapt to geopolitical changes',
          dealability: 'High — civil service is professional and focused on implementation.',
        },
        {
          name: 'Opposition Parties & Civil Society',
          interests: 'Increase political participation, expand civil liberties, challenge PAP policies, build alternative vision',
          resources: 'Grassroots networks, international advocacy, media platforms, civil society organizations',
          constraints: 'PAP dominance, legal restrictions on protests, media regulation, limited electoral prospects',
          likelyMoves: 'Challenge PAP policies through limited parliamentary channels, advocate for civil liberties, organize grassroots activities',
          dealability: 'Low-Medium — opposition is weak but will continue advocacy within legal constraints.',
        },
        {
          name: 'Business & Financial Sector',
          interests: 'Maintain economic growth, protect business interests, ensure financial stability, attract investment',
          resources: 'Capital, employment, international connections, expertise, political influence',
          constraints: 'Government regulation, geopolitical risks, regional competition, labor shortages',
          likelyMoves: 'Lobby for business-friendly policies, seek infrastructure investment, expand regional operations, adapt to geopolitical changes',
          dealability: 'High — business is aligned with PAP on economic growth and stability.',
        },
        {
          name: 'Foreign Workers & Migrant Communities',
          interests: 'Maintain employment, protect rights, access services, send remittances',
          resources: 'Labor supply, economic contribution, diaspora networks',
          constraints: 'Visa restrictions, legal limitations, discrimination, labor market vulnerability',
          likelyMoves: 'Seek better working conditions, maintain employment, support families abroad, organize within legal constraints',
          dealability: 'Low — foreign workers have limited political power and face legal constraints.',
        },
      ],
      external: [
        {
          name: 'United States',
          interests: 'Maintain Singapore as strategic partner, counter China influence, ensure Strait of Malacca security, maintain regional influence',
          resources: 'Military bases, intelligence partnership, diplomatic leverage, technology, investment',
          constraints: 'Singapore\'s pragmatic China engagement, desire for strategic autonomy, regional balance',
          likelyMoves: 'Maintain military presence, strengthen defense cooperation, pressure on China policy, expand tech partnerships',
          dealability: 'High — Singapore and US are aligned on regional security and strategic interests.',
        },
        {
          name: 'China',
          interests: 'Maintain Singapore as pragmatic partner, expand economic influence, counter US dominance, secure trade routes',
          resources: 'Market access, capital investment, economic leverage, diplomatic engagement',
          constraints: 'Singapore\'s US security partnership, ASEAN membership, desire for strategic autonomy',
          likelyMoves: 'Expand investment and trade, maintain economic engagement, pressure on South China Sea, seek diplomatic support',
          dealability: 'Medium — Singapore will maintain pragmatic economic engagement with China while balancing US partnership.',
        },
        {
          name: 'ASEAN',
          interests: 'Regional stability, consensus decision-making, counter great power dominance, maintain ASEAN centrality',
          resources: 'Regional influence, diplomatic forums, collective action capacity',
          constraints: 'Internal divisions, consensus requirement, great power pressure',
          likelyMoves: 'Participate in ASEAN consensus-building, maintain regional engagement, balance great power competition',
          dealability: 'High — Singapore is ASEAN member and will maintain regional engagement.',
        },
        {
          name: 'Japan & Australia',
          interests: 'Counter China influence, maintain regional stability, expand partnerships, secure supply chains',
          resources: 'Military capability, technology, investment, diplomatic influence',
          constraints: 'Limited regional presence compared to China, competing interests',
          likelyMoves: 'Strengthen defense cooperation, expand trade/investment, coordinate on China policy, support regional stability',
          dealability: 'High — Singapore is aligned with Japan and Australia on regional security.',
        },
        {
          name: 'India',
          interests: 'Counter China influence, expand economic partnerships, maintain regional stability, secure supply chains',
          resources: 'Capital investment, technology, military capability, trade partnerships',
          constraints: 'Limited regional presence, competing interests, distance from region',
          likelyMoves: 'Expand investment and trade, strengthen defense cooperation, coordinate on China policy',
          dealability: 'Medium-High — India is seeking to expand influence and will align with Singapore on regional issues.',
        },
      ],
    },
    risks: [
      {
        title: 'South China Sea Conflict or China-Taiwan War',
        trigger: 'Military confrontation in South China Sea or China-Taiwan conflict disrupting critical sea lanes',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '6-24 months',
        leadingIndicators: 'China military movements, Taiwan tensions, US-China rhetoric, maritime incidents, military exercises',
        mitigants: 'US security partnership, ASEAN consensus, diplomatic engagement, regional de-escalation efforts',
        lastAssessed: 'April 2026',
      },
      {
        title: 'Global Financial Crisis or Recession',
        trigger: 'Major financial crisis or global recession affecting financial sector and trade hub role',
        probability: 'Low',
        impact: 'High',
        timeHorizon: '6-18 months',
        leadingIndicators: 'Financial market volatility, credit spreads, trade volumes, economic growth forecasts',
        mitigants: 'Foreign exchange reserves, monetary policy flexibility, diversified economy, financial regulation',
        lastAssessed: 'April 2026',
      },
      {
        title: 'Geopolitical Pressure to Choose Sides',
        trigger: 'US or China pressure on Singapore to choose sides in great power competition',
        probability: 'Med',
        impact: 'Med',
        timeHorizon: '6-18 months',
        leadingIndicators: 'US-China rhetoric, diplomatic pressure, trade tensions, security demands',
        mitigants: 'Strategic autonomy commitment, ASEAN membership, balanced partnerships, diplomatic skill',
        lastAssessed: 'April 2026',
      },
      {
        title: 'Energy Crisis or Supply Disruption',
        trigger: 'Energy supply disruption or crisis affecting Singapore\'s energy imports',
        probability: 'Low',
        impact: 'High',
        timeHorizon: '6-18 months',
        leadingIndicators: 'Energy prices, supply chain disruptions, geopolitical tensions, weather events',
        mitigants: 'Diversified energy sources, strategic reserves, renewable energy transition, efficiency improvements',
        lastAssessed: 'April 2026',
      },
      {
        title: 'Cyber Attack on Critical Infrastructure',
        trigger: 'Major cyber attack on financial systems, port operations, or utilities',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '6-18 months',
        leadingIndicators: 'Cyber incidents, security alerts, threat assessments, geopolitical tensions',
        mitigants: 'Cybersecurity frameworks, redundant systems, international cooperation, incident response capacity',
        lastAssessed: 'April 2026',
      },
      {
        title: 'Political Succession Crisis or PAP Fragmentation',
        trigger: 'Succession crisis within PAP or internal fragmentation affecting political stability',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '12-24 months',
        leadingIndicators: 'PAP internal dynamics, leadership statements, generational change, policy disagreements',
        mitigants: 'Succession planning mechanisms, institutional continuity, civil service stability, electoral legitimacy',
        lastAssessed: 'April 2026',
      },
    ],
    sources: [
      {
        name: 'Monetary Authority of Singapore (MAS)',
        url: 'https://www.mas.gov.sg',
        desc: 'Official central bank data on monetary policy, inflation, exchange rates, financial stability',
      },
      {
        name: 'Department of Statistics Singapore',
        url: 'https://www.singstat.gov.sg',
        desc: 'National statistics — GDP, employment, trade, inflation, population data',
      },
      {
        name: 'IMF Singapore Article IV Consultation',
        url: 'https://www.imf.org',
        desc: 'IMF macroeconomic assessment and policy recommendations',
      },
      {
        name: 'ISEAS-Yusof Ishak Institute',
        url: 'https://www.iseas.edu.sg',
        desc: 'Leading Southeast Asia think tank with research on Singapore, regional politics, and geopolitics',
      },
      {
        name: 'SIPRI Military Expenditure Database',
        url: 'https://www.sipri.org',
        desc: 'Military spending and arms transfer data',
      },
      {
        name: 'Freedom House Singapore Report',
        url: 'https://freedomhouse.org',
        desc: 'Assessment of political rights, civil liberties, press freedom in Singapore',
      },
      {
        name: 'Singapore Government (gov.sg)',
        url: 'https://www.gov.sg',
        desc: 'Official government information, policies, and statistics',
      },
      {
        name: 'Singapore Media (Straits Times, CNA, Today)',
        url: 'https://www.straitstimes.com',
        desc: 'Media coverage of Singapore politics, economics, and regional affairs',
      },
    ],
  },
  fr: {
    executiveSnapshot: [
      'Type de régime : Démocratie parlementaire avec système de parti dominant. Le Parti d\'action populaire (PAP) gouverne en continu depuis l\'indépendance (1965). Le Premier ministre Lawrence Wong dirige le gouvernement (depuis 2024). Les élections sont tenues mais le PAP maintient une supermajorité. Les normes démocratiques existent mais l\'exécutif domine. Les médias sont réglementés et les libertés civiles sont limitées par rapport aux démocraties occidentales.',
      'Équilibre politique : Le PAP maintient un contrôle politique écrasant avec une supermajorité au Parlement. Les partis d\'opposition sont faibles et fragmentés. La fonction publique est professionnelle et politiquement neutre. La magistrature est indépendante mais fonctionne au sein du système dominé par le PAP. La planification de la succession au sein du PAP est ordonnée. La dissidence publique est rare en raison de la combinaison de prospérité, de surveillance et de contraintes juridiques. La stabilité politique est très élevée.',
      'Modèle économique : Économie développée à revenu élevé (PIB de 600 milliards de dollars). Centre financier mondial et plaque tournante commerciale. Hautement dépendante du commerce et de la finance internationaux. Le raffinage, les pétrochimiques et les opérations portuaires sont des secteurs majeurs. Les services financiers, la technologie et la biomédecine se développent. Aucune ressource naturelle — entièrement dépendante des importations. Économie extrêmement ouverte avec un ratio commerce/PIB élevé.',
      'Top 3 risques (6–18 mois) : (1) Conflit en Mer de Chine méridionale ou guerre Chine-Taïwan perturbant les voies maritimes critiques et le commerce ; (2) Crise financière mondiale ou récession affectant le secteur financier et le rôle de plaque tournante commerciale ; (3) Pression géopolitique pour choisir un camp entre les États-Unis et la Chine.',
      'Top 3 éléments de surveillance (4–12 semaines) : (1) Développements en Mer de Chine méridionale et affirmation chinoise ; (2) Flux commerciaux mondiaux et stabilité des marchés financiers ; (3) Tensions États-Unis-Chine et pression sur l\'autonomie stratégique de Singapour.',
      'Dépendances externes : 100% dépendante des importations pour l\'énergie, la nourriture et la plupart des matières premières. Le commerce représente ~350% du PIB (extrêmement élevé). La Chine est le plus grand partenaire commercial (~15% du commerce). Les États-Unis sont un investisseur majeur et un partenaire de sécurité. Le détroit de Malacca est critique pour les importations d\'énergie. Le port de Singapour traite ~30% du commerce maritime mondial. Le secteur financier dépend des flux de capitaux mondiaux. Les transferts de fonds sont minimes mais les travailleurs étrangers sont critiques pour l\'économie.',
      'Posture de sécurité : Aucune menace militaire permanente mais fait face à une vulnérabilité existentielle face à un conflit régional. Petite armée mais hautement capable (force aérienne, marine). Politique sans armes nucléaires. Partenariat de sécurité étroit avec les États-Unis (bases militaires, renseignement). Les dépenses de défense sont élevées par rapport au PIB (~3,5%). La cybersécurité est une préoccupation critique. La menace du terrorisme est faible mais surveillée. La sécurité maritime au détroit de Malacca est une priorité.',
      'Orientation diplomatique : Autonomie stratégique — équilibre le partenariat de sécurité américain avec un engagement pragmatique avec la Chine. Membre de l\'ASEAN mais maintient des intérêts stratégiques séparés. Participant au mouvement des non-alignés. Cherche à éviter de choisir un camp dans la concurrence des grandes puissances. Maintient des partenariats de défense avec les États-Unis, le Japon, l\'Australie. Engagement économique pragmatique avec la Chine.',
      'Confiance des données : Très élevé — Singapour dispose d\'excellentes données institutionnelles, de transparence et de qualité institutionnelle. L\'un des pays les plus riches en données du monde.',
      'Perspective de base : Stable et prospère mais vulnérable aux chocs externes. La stabilité politique restera élevée. La croissance économique se modérera mais restera positive (2-3%). Le défi clé est de maintenir l\'autonomie stratégique tout en gérant la concurrence des grandes puissances. La prospérité de Singapour dépend de la stabilité régionale et du commerce mondial ouvert.',
    ],
    political: {
      powerStructure: 'Le Premier ministre détient le pouvoir exécutif et est chef du gouvernement. Le Parlement est monocaméral (104 sièges) avec le PAP détenant une supermajorité (83 sièges en 2020). Les partis d\'opposition ne détiennent que 10-20 sièges. Le Président est largement cérémoniel. La magistrature est indépendante mais fonctionne au sein du système dominé par le PAP. La fonction publique est professionnelle et politiquement neutre. Le gouvernement local est minime — Singapour est hautement centralisée. Le PAP dispose de mécanismes internes pour la planification de la succession et le développement politique.',
      stabilityDrivers: 'La légitimité repose sur la prospérité économique, la gouvernance efficace et la stabilité politique. Singapour a avec succès transitionné d\'un comptoir commercial colonial à une économie développée. Le PAP a livré la prospérité et la stabilité. La fonction publique est professionnelle et non corrompue. La magistrature est respectée. Cependant, les libertés civiles sont limitées par rapport aux démocraties occidentales — les médias sont réglementés, les protestations sont restreintes et la surveillance est extensive. La dissidence publique est rare en raison de la prospérité et des contraintes juridiques. Le PAP maintient la légitimité par la performance économique et la gouvernance efficace plutôt que par la participation démocratique.',
      shockAbsorbers: 'Amortisseurs : Économie hautement développée avec des institutions fortes et l\'état de droit. Réserves de change massives (~1 billion de dollars) fournissent un tampon macroéconomique. Secteur financier diversifié et rôle de plaque tournante commerciale. Marché du travail flexible et politique d\'immigration. Fonction publique forte et capacité de planification. Accélérateurs : Conflit en Mer de Chine méridionale ou guerre Chine-Taïwan perturberait les voies maritimes et le commerce. Crise financière mondiale affecterait le secteur financier et le commerce. Pression géopolitique pour choisir un camp entre les États-Unis et la Chine minerait l\'autonomie stratégique. Crise énergétique ou perturbation de l\'approvisionnement menacerait l\'économie.',
    },
    economy: {
      macroReality: 'La croissance du PIB est prévue à 2-3% pour 2025-2026 (FMI) — modérée mais en dessous des moyennes historiques. L\'inflation est projetée à ~2,5% (dans la bande cible de l\'Autorité monétaire). La position budgétaire est forte avec des excédents budgétaires. La dette publique est minime (~130% du PIB en réserves mais dette nette négative). Le dollar de Singapour s\'est apprécié ~2% par rapport au dollar américain depuis fin 2024 en raison des différentiels de taux d\'intérêt et des entrées de capitaux. Le chômage est ~2% (très faible). Cependant, la croissance des salaires est modérée et le coût de la vie est élevé.',
      externalVulnerability: 'Singapour est 100% dépendante des importations pour l\'énergie, la nourriture et la plupart des matières premières. Le commerce représente ~350% du PIB (extrêmement élevé). La Chine est le plus grand partenaire commercial (~15% du commerce). Les États-Unis sont un investisseur majeur et un partenaire de sécurité. Le détroit de Malacca est critique pour les importations d\'énergie — toute perturbation dévasterait l\'économie. Le port de Singapour traite ~30% du commerce maritime mondial — toute perturbation aurait des implications mondiales. Le secteur financier dépend des flux de capitaux mondiaux et est vulnérable aux crises financières. Les fonds souverains (Temasek, GIC) ont des investissements mondiaux importants et sont exposés aux risques géopolitiques.',
      politicalEconomy: 'L\'agenda économique du gouvernement privilégie le développement du secteur financier, l\'innovation technologique et la transition vers l\'énergie verte. Cependant, Singapour fait face à des défis de la transition énergétique, des pénuries de main-d\'œuvre (dépendance aux travailleurs étrangers) et de la concurrence régionale. Le gouvernement investit dans les énergies renouvelables et la capture du carbone. Le secteur technologique se développe mais fait face à la concurrence des hubs régionaux. Le secteur financier s\'adapte aux changements réglementaires et à la perturbation numérique. Le gouvernement maintient un contrôle strict sur les secteurs clés (énergie, services publics, télécommunications) par les entreprises liées à l\'État.',
    },
    security: {
      internal: 'Les menaces de sécurité intérieure sont minimes. Il n\'y a pas de menace terroriste ou d\'insurrection. La criminalité violente est très faible. La Loi sur la sécurité interne (ISA) permet la détention sans procès pour les menaces de sécurité — utilisée rarement mais controversée. La cybersécurité est une préoccupation majeure compte tenu de la dépendance aux infrastructures numériques. Le gouvernement a renforcé les cadres de cybersécurité. Les libertés civiles sont limitées — les médias sont réglementés, les protestations sont restreintes et la surveillance est extensive. La police est professionnelle et politiquement neutre. Les forces armées sont petites mais hautement capables et loyales à l\'État.',
      diplomacy: 'Singapour maintient l\'autonomie stratégique en équilibrant le partenariat de sécurité américain avec un engagement pragmatique avec la Chine. Partenariats de défense avec les États-Unis (bases militaires, renseignement), le Japon, l\'Australie et l\'Inde. Membre de l\'ASEAN mais maintient des intérêts stratégiques séparés. Participant au mouvement des non-alignés. Cherche à éviter de choisir un camp dans la concurrence des grandes puissances. Engagement économique pragmatique avec la Chine malgré les différends en Mer de Chine méridionale. Maintient les partenariats de défense avec les alliés occidentaux tout en s\'engageant économiquement avec la Chine.',
    },
    actors: {
      domestic: [
        {
          name: 'Parti d\'action populaire (PAP) et Premier ministre Lawrence Wong',
          interests: 'Maintenir le contrôle politique, assurer la croissance économique, gérer la succession, préserver l\'autonomie stratégique, maintenir la prospérité',
          resources: 'Autorité exécutive, contrôle de supermajorité, fonction publique, entreprises d\'État, machine institutionnelle',
          constraints: 'Changement générationnel, pressions du ralentissement économique, contraintes géopolitiques, pression sur les libertés civiles',
          likelyMoves: 'Maintenir l\'accent sur la croissance économique, gérer la planification de la succession, poursuivre l\'innovation technologique/financière, équilibrer la concurrence des grandes puissances',
          dealability: 'Élevé — le PAP est pragmatique et technocratique, axé sur la performance économique et la stabilité.',
        },
        {
          name: 'Fonction publique et technocrates',
          interests: 'Maintenir une gouvernance efficace, poursuivre la croissance économique, gérer les services publics, mettre en œuvre la politique',
          resources: 'Expertise institutionnelle, capacité de planification, machine administrative, réseaux professionnels',
          constraints: 'Direction politique du PAP, contraintes budgétaires, défis de mise en œuvre',
          likelyMoves: 'Mettre en œuvre les politiques gouvernementales, poursuivre les améliorations d\'efficacité, gérer les transitions économiques, s\'adapter aux changements géopolitiques',
          dealability: 'Élevé — la fonction publique est professionnelle et axée sur la mise en œuvre.',
        },
        {
          name: 'Partis d\'opposition et société civile',
          interests: 'Augmenter la participation politique, élargir les libertés civiles, contester les politiques du PAP, construire une vision alternative',
          resources: 'Réseaux de base, plaidoyer international, plateformes médiatiques, organisations de la société civile',
          constraints: 'Dominance du PAP, restrictions juridiques sur les protestations, réglementation des médias, perspectives électorales limitées',
          likelyMoves: 'Contester les politiques du PAP par des canaux parlementaires limités, plaider pour les libertés civiles, organiser des activités de base',
          dealability: 'Faible-Moyen — l\'opposition est faible mais continuera le plaidoyer dans les contraintes juridiques.',
        },
        {
          name: 'Secteur des affaires et financier',
          interests: 'Maintenir la croissance économique, protéger les intérêts commerciaux, assurer la stabilité financière, attirer l\'investissement',
          resources: 'Capital, emploi, connexions internationales, expertise, influence politique',
          constraints: 'Réglementation gouvernementale, risques géopolitiques, concurrence régionale, pénuries de main-d\'œuvre',
          likelyMoves: 'Faire du lobbying pour les politiques favorables aux entreprises, chercher l\'investissement dans les infrastructures, élargir les opérations régionales, s\'adapter aux changements géopolitiques',
          dealability: 'Élevé — les entreprises s\'alignent avec le PAP sur la croissance économique et la stabilité.',
        },
        {
          name: 'Travailleurs étrangers et communautés de migrants',
          interests: 'Maintenir l\'emploi, protéger les droits, accéder aux services, envoyer des transferts de fonds',
          resources: 'Approvisionnement en main-d\'œuvre, contribution économique, réseaux de diaspora',
          constraints: 'Restrictions de visa, limitations juridiques, discrimination, vulnérabilité du marché du travail',
          likelyMoves: 'Chercher de meilleures conditions de travail, maintenir l\'emploi, soutenir les familles à l\'étranger, s\'organiser dans les contraintes juridiques',
          dealability: 'Faible — les travailleurs étrangers ont un pouvoir politique limité et font face à des contraintes juridiques.',
        },
      ],
      external: [
        {
          name: 'États-Unis',
          interests: 'Maintenir Singapour comme partenaire stratégique, contrer l\'influence chinoise, assurer la sécurité du détroit de Malacca, maintenir l\'influence régionale',
          resources: 'Bases militaires, partenariat de renseignement, levier diplomatique, technologie, investissement',
          constraints: 'Engagement pragmatique de Singapour avec la Chine, désir d\'autonomie stratégique, équilibre régional',
          likelyMoves: 'Maintenir la présence militaire, renforcer la coopération de défense, faire pression sur la politique chinoise, élargir les partenariats technologiques',
          dealability: 'Élevé — Singapour et les États-Unis s\'alignent sur la sécurité régionale et les intérêts stratégiques.',
        },
        {
          name: 'Chine',
          interests: 'Maintenir Singapour comme partenaire pragmatique, élargir l\'influence économique, contrer la dominance américaine, sécuriser les voies commerciales',
          resources: 'Accès au marché, investissement en capital, levier économique, engagement diplomatique',
          constraints: 'Partenariat de sécurité de Singapour avec les États-Unis, adhésion à l\'ASEAN, désir d\'autonomie stratégique',
          likelyMoves: 'Élargir l\'investissement et le commerce, maintenir l\'engagement économique, faire pression sur la Mer de Chine méridionale, chercher le soutien diplomatique',
          dealability: 'Moyen — Singapour maintiendra l\'engagement économique pragmatique avec la Chine tout en équilibrant le partenariat américain.',
        },
        {
          name: 'ASEAN',
          interests: 'Stabilité régionale, prise de décision par consensus, contrer la dominance des grandes puissances, maintenir la centralité de l\'ASEAN',
          resources: 'Influence régionale, forums diplomatiques, capacité d\'action collective',
          constraints: 'Divisions internes, exigence de consensus, pression des grandes puissances',
          likelyMoves: 'Participer à la construction du consensus de l\'ASEAN, maintenir l\'engagement régional, équilibrer la concurrence des grandes puissances',
          dealability: 'Élevé — Singapour est membre de l\'ASEAN et maintiendra l\'engagement régional.',
        },
        {
          name: 'Japon et Australie',
          interests: 'Contrer l\'influence chinoise, maintenir la stabilité régionale, élargir les partenariats, sécuriser les chaînes d\'approvisionnement',
          resources: 'Capacité militaire, technologie, investissement, influence diplomatique',
          constraints: 'Présence régionale limitée par rapport à la Chine, intérêts concurrents',
          likelyMoves: 'Renforcer la coopération de défense, élargir le commerce/investissement, coordonner sur la politique chinoise, soutenir la stabilité régionale',
          dealability: 'Élevé — Singapour s\'aligne avec le Japon et l\'Australie sur la sécurité régionale.',
        },
        {
          name: 'Inde',
          interests: 'Contrer l\'influence chinoise, élargir les partenariats économiques, maintenir la stabilité régionale, sécuriser les chaînes d\'approvisionnement',
          resources: 'Investissement en capital, technologie, capacité militaire, partenariats commerciaux',
          constraints: 'Présence régionale limitée, intérêts concurrents, distance de la région',
          likelyMoves: 'Élargir l\'investissement et le commerce, renforcer la coopération de défense, coordonner sur la politique chinoise',
          dealability: 'Moyen-Élevé — l\'Inde cherche à élargir l\'influence et s\'alignera avec Singapour sur les questions régionales.',
        }
      ],
    },
    risks: [
      {
        title: 'Conflit en Mer de Chine méridionale ou guerre Chine-Taïwan',
        trigger: 'Confrontation militaire en Mer de Chine méridionale ou conflit Chine-Taïwan perturbant les voies maritimes critiques',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '6-24 mois',
        leadingIndicators: 'Mouvements militaires chinois, tensions taïwanaises, rhétorique États-Unis-Chine, incidents maritimes, exercices militaires',
        mitigants: 'Partenariat de sécurité américain, consensus de l\'ASEAN, engagement diplomatique, efforts de désescalade régionale',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Crise financière mondiale ou récession',
        trigger: 'Crise financière majeure ou récession mondiale affectant le secteur financier et le rôle de plaque tournante commerciale',
        probability: 'Low',
        impact: 'High',
        timeHorizon: '6-18 mois',
        leadingIndicators: 'Volatilité des marchés financiers, écarts de crédit, volumes commerciaux, prévisions de croissance économique',
        mitigants: 'Réserves de change, flexibilité de la politique monétaire, économie diversifiée, réglementation financière',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Pression géopolitique pour choisir un camp',
        trigger: 'Pression des États-Unis ou de la Chine sur Singapour pour choisir un camp dans la concurrence des grandes puissances',
        probability: 'Med',
        impact: 'Med',
        timeHorizon: '6-18 mois',
        leadingIndicators: 'Rhétorique États-Unis-Chine, pression diplomatique, tensions commerciales, demandes de sécurité',
        mitigants: 'Engagement d\'autonomie stratégique, adhésion à l\'ASEAN, partenariats équilibrés, compétence diplomatique',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Crise énergétique ou perturbation de l\'approvisionnement',
        trigger: 'Perturbation de l\'approvisionnement énergétique ou crise énergétique affectant les importations énergétiques de Singapour',
        probability: 'Low',
        impact: 'High',
        timeHorizon: '6-18 mois',
        leadingIndicators: 'Prix de l\'énergie, perturbations de la chaîne d\'approvisionnement, tensions géopolitiques, événements météorologiques',
        mitigants: 'Sources d\'énergie diversifiées, réserves stratégiques, transition vers les énergies renouvelables, améliorations d\'efficacité',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Cyber-attaque sur les infrastructures critiques',
        trigger: 'Cyber-attaque majeure sur les systèmes financiers, les opérations portuaires ou les services publics',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '6-18 mois',
        leadingIndicators: 'Incidents de cybersécurité, alertes de sécurité, évaluations des menaces, tensions géopolitiques',
        mitigants: 'Cadres de cybersécurité, systèmes redondants, coopération internationale, capacité de réponse aux incidents',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Crise de succession politique ou fragmentation du PAP',
        trigger: 'Crise de succession au sein du PAP ou fragmentation interne affectant la stabilité politique',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '12-24 mois',
        leadingIndicators: 'Dynamique interne du PAP, déclarations de leadership, changement générationnel, désaccords politiques',
        mitigants: 'Mécanismes de planification de la succession, continuité institutionnelle, stabilité de la fonction publique, légitimité électorale',
        lastAssessed: 'Avril 2026',
      },
    ],
    sources: [
      {
        name: 'Autorité monétaire de Singapour (MAS)',
        url: 'https://www.mas.gov.sg',
        desc: 'Données officielles de la banque centrale sur la politique monétaire, l\'inflation, les taux de change, la stabilité financière',
      },
      {
        name: 'Département des statistiques de Singapour',
        url: 'https://www.singstat.gov.sg',
        desc: 'Statistiques nationales — PIB, emploi, commerce, inflation, données démographiques',
      },
      {
        name: 'Consultation de l\'article IV du FMI sur Singapour',
        url: 'https://www.imf.org',
        desc: 'Évaluation macroéconomique du FMI et recommandations politiques',
      },
      {
        name: 'Institut ISEAS-Yusof Ishak',
        url: 'https://www.iseas.edu.sg',
        desc: 'Principal think tank d\'Asie du Sud-Est avec recherche sur Singapour, la politique régionale et la géopolitique',
      },
      {
        name: 'Base de données des dépenses militaires du SIPRI',
        url: 'https://www.sipri.org',
        desc: 'Données sur les dépenses militaires et les transferts d\'armes',
      },
      {
        name: 'Rapport Singapour de Freedom House',
        url: 'https://freedomhouse.org',
        desc: 'Évaluation des droits politiques, des libertés civiles, de la liberté de la presse à Singapour',
      },
      {
        name: 'Gouvernement de Singapour (gov.sg)',
        url: 'https://www.gov.sg',
        desc: 'Informations officielles du gouvernement, politiques et statistiques',
      },
      {
        name: 'Médias de Singapour (Straits Times, CNA, Today)',
        url: 'https://www.straitstimes.com',
        desc: 'Couverture médiatique de la politique, de l\'économie et des affaires régionales de Singapour',
      },
    ],
  },
};
