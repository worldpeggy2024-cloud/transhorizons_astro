/*
 * TransHorizons — Saudi Arabia Country Analysis Data
 * Full bilingual content following the Country Situation Report framework
 * Focus: Oil geopolitics, energy security, Vision 2030 reforms, regional power, US-Saudi relationship, Iran rivalry
 * Last updated: April 2026
 * Sources: Saudi Central Bank, General Authority for Statistics, IMF, World Bank, SIPRI, ACLED, Freedom House, Brookings Doha Center
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

export const saudiArabiaAnalysis: AnalysisContent = {
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
      'Regime type: Absolute monarchy. King Salman bin Abdulaziz Al Saud (since 2015) with Crown Prince Mohammed bin Salman (MBS) as de facto leader. Centralized power with no parliament or elections. Succession appears secure with MBS as clear heir.',
      'Political equilibrium: Power is consolidated in the royal family, specifically the Al Saud inner circle around MBS. Institutional checks are minimal — the Consultative Council (Majlis al-Shura) is advisory only. Opposition is suppressed through security apparatus. Dissent is rare and quickly contained. The regime maintains legitimacy through oil wealth distribution and Islamic authority.',
      'Economic model: Oil-dependent economy (9.8 million barrels/day production, ~$1.7 trillion GDP). Vision 2030 agenda aims to diversify away from oil through tourism, entertainment, manufacturing, and finance. Oil revenues fund extensive welfare state and military spending. Unemployment remains high despite diversification efforts (~11% officially, higher unofficially).',
      'Top 3 risks (6–18 months): (1) Oil price collapse or geopolitical shock disrupting energy markets (Iran conflict, Houthi attacks on shipping); (2) Vision 2030 reform backlash if unemployment persists and welfare cuts deepen; (3) Regional escalation with Iran or proxy conflicts affecting security and investment climate.',
      'Top 3 watch items (4–12 weeks): (1) Oil prices and OPEC+ production decisions — critical for fiscal revenue; (2) Houthi drone/missile attacks on oil infrastructure — direct threat to production; (3) US-Saudi relationship under Trump 2.0 — potential shifts in defense commitments or oil pricing.',
      'External dependencies: Oil exports account for ~90% of government revenue and ~40% of GDP. Energy security is paramount — Strait of Hormuz transit is critical (20% of global oil passes through). Foreign direct investment concentrated in tourism and finance. Remittances to migrant workers (~$35 billion annually) are significant but not critical. Defense dependent on US military support and intelligence.',
      'Security posture: Regional military power with advanced weapons systems (US-supplied). Nuclear ambitions remain unclear but suspected. Faces proxy threats from Iran-backed Houthis (Yemen), Hezbollah (Lebanon), and other militias. Domestic terrorism threat is low due to security apparatus effectiveness. Military modernization ongoing (Vision 2030 includes domestic defense manufacturing).',
      'Diplomatic orientation: Core US ally in Middle East. Pivot toward China and Russia on energy/trade while maintaining US security partnership. Recent normalization with Iran (2023 China-brokered deal) signals pragmatism but underlying rivalry persists. Regional hegemon competing with Iran for influence. Expanding ties with India, Europe, and others.',
      'Data confidence: Medium-High — Saudi Arabia publishes macroeconomic data but political/security data is opaque. International media access is restricted. Institutional capacity is strong but politicized.',
      'Baseline outlook: Stable but vulnerable. Oil wealth provides cushion but energy transition threatens long-term revenue. Vision 2030 reforms are progressing but face headwinds (unemployment, welfare pressures). Regional tensions with Iran will persist. The regime will maintain control through security apparatus and wealth distribution, but economic pressures could force difficult choices.',
    ],
    political: {
      powerStructure: 'King Salman holds supreme authority but Crown Prince Mohammed bin Salman (MBS) exercises de facto control over domestic and foreign policy. Power is highly centralized within the royal family — the Council of Ministers is appointed and serves at the king\'s pleasure. The Consultative Council (Majlis al-Shura) is advisory only with no legislative power. The judiciary applies Islamic law (Sharia) and is subordinate to executive authority. The security apparatus (General Intelligence Directorate, Ministry of Interior) is powerful and reports directly to the crown prince. There are no independent institutions or checks on executive power. Succession appears secure with MBS as clear heir, though internal royal family dynamics remain opaque.',
      stabilityDrivers: 'Legitimacy rests on three pillars: (1) Oil wealth distribution — the regime funds an extensive welfare state and provides employment through state enterprises; (2) Islamic authority — the regime positions itself as guardian of Islam\'s holiest sites and enforces Islamic law; (3) Security apparatus — dissent is suppressed through surveillance and detention. The armed forces are loyal to the royal family. The business elite is dependent on government contracts and patronage. Civil society is co-opted or suppressed. The regime has successfully weathered regional conflicts and oil price shocks through its financial reserves and US security partnership.',
      shockAbsorbers: 'Absorbers: Massive foreign exchange reserves (~$600 billion) provide macroeconomic buffer. Diversified revenue streams (oil, tourism, finance, manufacturing). US security partnership and military capability. Saudi Arabia\'s role as OPEC+ leader gives it leverage over global oil markets. Accelerants: Oil price collapse below $50/barrel would force fiscal consolidation and welfare cuts. Major terrorist attack or successful Houthi strike on oil infrastructure would disrupt production and investor confidence. Regional escalation with Iran or Israel would trigger military conflict and economic disruption. Vision 2030 reform failure would undermine regime legitimacy and create pressure for political change.',
    },
    economy: {
      macroReality: 'GDP growth forecast 2.5-3% for 2025-2026 (IMF) — moderate but dependent on oil prices and Vision 2030 progress. Inflation is projected at ~2.5% (within target). The fiscal deficit is projected at ~1.5% of GDP for 2025 (improved from 2023 but still above pre-pandemic levels). Public debt stands at ~24% of GDP (low by international standards). The Saudi riyal is pegged to the US dollar, providing currency stability. Oil revenues remain the dominant fiscal revenue source (~90% of government revenue), making the budget highly vulnerable to price shocks. Unemployment is officially ~11% but likely higher, particularly among young people. The private sector is growing but remains small relative to state enterprises.',
      externalVulnerability: 'Saudi Arabia is highly dependent on oil exports — 90% of government revenue and 40% of GDP come from oil. Global energy transition threatens long-term demand and prices. The Strait of Hormuz is critical for energy exports — any disruption (Iran conflict, Houthi attacks) would devastate the economy. Foreign direct investment is concentrated in tourism and finance — vulnerable to regional instability or geopolitical shifts. Remittances to migrant workers (~$35 billion annually) are significant but not critical to the budget. Sovereign debt is low but fiscal sustainability depends on oil prices remaining above $60/barrel. Saudi Arabia\'s economic diversification (Vision 2030) is progressing but remains incomplete.',
      politicalEconomy: 'Vision 2030 is the government\'s primary economic agenda — aimed at reducing oil dependency through tourism, entertainment, manufacturing, and finance. Major projects include NEOM (futuristic city), Saudi Aramco IPO (completed 2019), and Public Investment Fund (PIF) expansion. However, implementation faces challenges: unemployment remains high despite job creation efforts, welfare cuts are politically sensitive, and private sector growth is hampered by state enterprise dominance. The government is investing heavily in defense manufacturing and renewable energy. Labor market reforms are progressing but face resistance from both workers and employers. The tourism sector is growing rapidly but faces competition from regional destinations. The financial sector is modernizing but remains subject to Islamic banking principles.',
    },
    security: {
      internal: 'Internal terrorism threat is low due to effective security apparatus. The regime has successfully suppressed ISIS-affiliated groups and Al-Qaeda cells. Domestic dissent is rare and quickly contained through surveillance and detention. However, human rights organizations document widespread torture and extrajudicial killings. The regime maintains tight control over media and civil society. Women\'s rights have improved under Vision 2030 (driving, employment, sports) but remain restricted. Religious minorities face discrimination. The security apparatus is extensive and well-funded, allowing the regime to maintain control despite economic pressures.',
      diplomacy: 'Saudi Arabia is a core US ally in the Middle East, with deep defense and intelligence partnerships. However, the relationship has become more transactional under Trump 2.0 — the US is demanding higher oil production to keep prices low and is pushing for military support against Iran. Saudi Arabia is hedging by expanding ties with China and Russia on energy and trade while maintaining the US security partnership. The 2023 China-brokered normalization with Iran signals pragmatism, but underlying rivalry persists — Saudi Arabia and Iran compete for regional influence through proxy conflicts (Yemen, Syria, Lebanon, Iraq). Saudi Arabia is expanding ties with India, Europe, and others. The Abraham Accords (normalization with Israel) reflect Saudi Arabia\'s pivot toward countering Iran and building a regional alliance.',
    },
    actors: {
      domestic: [
        {
          name: 'King Salman & Crown Prince Mohammed bin Salman (MBS)',
          interests: 'Consolidate power, implement Vision 2030, maintain regime stability, counter Iran, modernize military, attract foreign investment',
          resources: 'Oil wealth, security apparatus, military capability, royal family authority, state enterprises',
          constraints: 'Oil price vulnerability, Vision 2030 implementation challenges, regional tensions, international pressure on human rights',
          likelyMoves: 'Continue Vision 2030 implementation, expand PIF investments, modernize military, manage oil production (OPEC+), contain Iran influence',
          dealability: 'High — MBS is pragmatic and will negotiate on economic/security issues but maintains absolute control over political decisions.',
        },
        {
          name: 'Royal Family & Inner Circle',
          interests: 'Maintain power, protect wealth, ensure succession, manage internal rivalries',
          resources: 'Oil wealth, state apparatus, business interests, international connections',
          constraints: 'Potential internal divisions, succession uncertainties, external pressure',
          likelyMoves: 'Support MBS consolidation, manage succession planning, protect family business interests',
          dealability: 'Low — royal family dynamics are opaque and internal rivalries are managed privately.',
        },
        {
          name: 'Business Elite & State Enterprises',
          interests: 'Maintain government contracts, expand private sector opportunities, attract foreign investment, benefit from Vision 2030',
          resources: 'Capital, employment, international connections, expertise',
          constraints: 'Dependence on government patronage, state enterprise dominance, regulatory uncertainty',
          likelyMoves: 'Lobby for privatization, seek foreign partnerships, expand into tourism/finance, support Vision 2030 implementation',
          dealability: 'High — business elite is pragmatic and aligned with government on economic growth.',
        },
        {
          name: 'Security Apparatus & Military',
          interests: 'Maintain internal security, counter external threats (Iran, terrorism), modernize military, protect regime',
          resources: 'Military capability, security networks, defense budget, US support',
          constraints: 'Budget pressures, regional threats, human rights scrutiny',
          likelyMoves: 'Expand military modernization, counter Houthi threats, prepare for Iran escalation, maintain internal control',
          dealability: 'High — security forces are loyal to the regime and will execute directives.',
        },
        {
          name: 'Civil Society & Labor',
          interests: 'Improve labor rights, reduce unemployment, expand political participation, protect human rights',
          resources: 'Labor organizations, civil society networks, international advocacy, media attention',
          constraints: 'Regime suppression, limited institutional power, dependence on state employment',
          likelyMoves: 'Advocate for labor reforms, document human rights violations, appeal to international bodies, seek diaspora support',
          dealability: 'Low — civil society is suppressed and has limited leverage. Will continue advocacy but face regime pressure.',
        },
      ],
      external: [
        {
          name: 'United States',
          interests: 'Maintain Saudi Arabia as key Middle East ally, secure oil supply, counter Iran, maintain military bases, prevent Chinese influence',
          resources: 'Military support, intelligence, diplomatic leverage, defense technology',
          constraints: 'Saudi Arabia\'s hedging toward China/Russia, human rights concerns, domestic political pressure on Saudi ties',
          likelyMoves: 'Expand defense cooperation, pressure on oil production, counter Iran, maintain military presence',
          dealability: 'High — Saudi Arabia and US are aligned on regional security but relationship is increasingly transactional.',
        },
        {
          name: 'Iran',
          interests: 'Counter Saudi regional influence, expand proxy networks, maintain nuclear program, resist US pressure',
          resources: 'Military capability, proxy networks, regional influence, energy leverage',
          constraints: 'US sanctions, Saudi military superiority, international isolation, economic pressure',
          likelyMoves: 'Support Houthi attacks, expand proxy networks, resist normalization, maintain nuclear ambitions',
          dealability: 'Low — Saudi-Iran rivalry is structural and unlikely to resolve. Proxy conflicts will persist.',
        },
        {
          name: 'China',
          interests: 'Secure energy supplies, expand economic influence, counter US dominance, build Belt and Road partnerships',
          resources: 'Capital, technology, market access, energy demand',
          constraints: 'US pressure on Saudi Arabia, limited military capability in region, energy transition pressures',
          likelyMoves: 'Expand energy partnerships, invest in Vision 2030 projects, mediate regional conflicts, expand trade',
          dealability: 'High — Saudi Arabia is pragmatically engaging China on energy and economic issues.',
        },
        {
          name: 'Russia',
          interests: 'Maintain energy market cooperation (OPEC+), counter US dominance, expand military sales, maintain influence',
          resources: 'Energy cooperation, military technology, OPEC+ partnership, regional influence',
          constraints: 'US pressure, limited military presence in region, energy transition pressures',
          likelyMoves: 'Maintain OPEC+ coordination, expand military cooperation, resist Western pressure',
          dealability: 'Medium — Saudi Arabia cooperates with Russia on OPEC+ but maintains US security partnership.',
        },
        {
          name: 'Israel',
          interests: 'Normalize relations, counter Iran, expand trade/investment, regional stability',
          resources: 'Military capability, technology, regional influence, US support',
          constraints: 'Palestinian issue, Arab public opinion, Iran rivalry, regional instability',
          likelyMoves: 'Expand normalization (Abraham Accords), coordinate on Iran policy, expand trade',
          dealability: 'Medium — Saudi Arabia is pragmatically normalizing with Israel but faces Arab public opinion pressure.',
        },
      ],
    },
    risks: [
      {
        title: 'Oil Price Collapse & Fiscal Crisis',
        trigger: 'Global oil price falls below $50/barrel due to energy transition, recession, or supply surge',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '6-18 months',
        leadingIndicators: 'Global oil prices, energy transition progress, recession indicators, OPEC+ production decisions',
        mitigants: 'Foreign exchange reserves (~$600 billion), Vision 2030 diversification, OPEC+ production management, government spending cuts',
        lastAssessed: 'April 2026',
      },
      {
        title: 'Houthi/Iranian Attack on Oil Infrastructure',
        trigger: 'Successful Houthi drone/missile strike on oil facilities or tanker attacks disrupting Strait of Hormuz',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '3-12 months',
        leadingIndicators: 'Houthi military capability, drone/missile attacks, regional tensions, Iran rhetoric',
        mitigants: 'Air defense systems, US military support, redundant oil infrastructure, strategic reserves',
        lastAssessed: 'April 2026',
      },
      {
        title: 'Vision 2030 Implementation Failure & Reform Backlash',
        trigger: 'Unemployment persists, welfare cuts deepen, or major Vision 2030 projects fail to deliver',
        probability: 'Med',
        impact: 'Med',
        timeHorizon: '12-24 months',
        leadingIndicators: 'Unemployment trends, welfare spending, Vision 2030 project progress, public sentiment',
        mitigants: 'Government spending flexibility, employment programs, foreign investment attraction, project acceleration',
        lastAssessed: 'April 2026',
      },
      {
        title: 'Regional Escalation with Iran or Israel',
        trigger: 'Iran military action, Israeli military operation, or proxy conflict escalation affecting Saudi territory',
        probability: 'Low',
        impact: 'High',
        timeHorizon: '6-18 months',
        leadingIndicators: 'Iran military movements, Israeli military operations, proxy activity, regional rhetoric',
        mitigants: 'US military support, air defense systems, diplomatic channels, regional de-escalation efforts',
        lastAssessed: 'April 2026',
      },
      {
        title: 'US-Saudi Relationship Deterioration',
        trigger: 'Trump administration demands unmet (oil production, military support), human rights pressure, or strategic shift',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '6-18 months',
        leadingIndicators: 'US-Saudi diplomatic statements, defense cooperation changes, oil production decisions, human rights pressure',
        mitigants: 'Shared strategic interests, defense interdependency, economic ties, OPEC+ cooperation',
        lastAssessed: 'April 2026',
      },
      {
        title: 'Terrorist Attack or Internal Security Crisis',
        trigger: 'Major terrorist attack, security apparatus failure, or internal dissent escalation',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '6-18 months',
        leadingIndicators: 'Terrorist activity, security incidents, dissent indicators, international terrorism alerts',
        mitigants: 'Effective security apparatus, counterterrorism operations, intelligence networks, military capability',
        lastAssessed: 'April 2026',
      },
    ],
    sources: [
      {
        name: 'Saudi Central Bank (SAMA)',
        url: 'https://www.sama.gov.sa',
        desc: 'Official central bank data on monetary policy, inflation, exchange rates, foreign reserves',
      },
      {
        name: 'General Authority for Statistics (GASTAT)',
        url: 'https://www.stats.gov.sa',
        desc: 'National statistics — GDP, employment, poverty, inflation data',
      },
      {
        name: 'IMF Saudi Arabia Article IV Consultation',
        url: 'https://www.imf.org',
        desc: 'IMF macroeconomic assessment and policy recommendations',
      },
      {
        name: 'Brookings Doha Center',
        url: 'https://www.brookings.edu/center/doha-center/',
        desc: 'Policy research on Middle East politics, economy, security, geopolitics',
      },
      {
        name: 'SIPRI Military Expenditure Database',
        url: 'https://www.sipri.org',
        desc: 'Military spending and arms transfer data',
      },
      {
        name: 'ACLED (Armed Conflict Location & Event Data)',
        url: 'https://acleddata.com',
        desc: 'Real-time conflict and violence data tracking regional threats',
      },
      {
        name: 'Freedom House Saudi Arabia Report',
        url: 'https://freedomhouse.org',
        desc: 'Assessment of political rights, civil liberties, press freedom in Saudi Arabia',
      },
      {
        name: 'Human Rights Watch Saudi Arabia Reports',
        url: 'https://www.hrw.org',
        desc: 'Documentation of human rights violations and security concerns',
      },
    ],
  },
  fr: {
    executiveSnapshot: [
      'Type de régime : Monarchie absolue. Le roi Salman bin Abdulaziz Al Saoud (depuis 2015) avec le prince héritier Mohammed bin Salman (MBS) comme leader de facto. Pouvoir centralisé sans parlement ni élections. La succession semble sûre avec MBS comme héritier clair.',
      'Équilibre politique : Le pouvoir est consolidé dans la famille royale, en particulier le cercle intérieur d\'Al Saoud autour de MBS. Les contrôles institutionnels sont minimes — le Conseil consultatif (Majlis al-Shura) est consultatif uniquement. L\'opposition est supprimée par l\'appareil de sécurité. La dissidence est rare et rapidement contenue. Le régime maintient la légitimité par la distribution de la richesse pétrolière et l\'autorité islamique.',
      'Modèle économique : Économie dépendante du pétrole (9,8 millions de barils/jour de production, ~1,7 billion de dollars de PIB). L\'agenda Vision 2030 vise à se diversifier loin du pétrole par le tourisme, le divertissement, la fabrication et la finance. Les revenus pétroliers financent un État-providence extensif et les dépenses militaires. Le chômage reste élevé malgré les efforts de diversification (~11% officiellement, plus élevé officieusement).',
      'Top 3 risques (6–18 mois) : (1) Effondrement des prix du pétrole ou choc géopolitique perturbant les marchés énergétiques (conflit iranien, attaques houthis sur le transport maritime) ; (2) Réaction aux réformes Vision 2030 si le chômage persiste et les coupes dans les allocations s\'approfondissent ; (3) Escalade régionale avec l\'Iran ou conflits par procuration affectant la sécurité et le climat d\'investissement.',
      'Top 3 éléments de surveillance (4–12 semaines) : (1) Prix du pétrole et décisions de production de l\'OPEP+ — critiques pour les revenus budgétaires ; (2) Attaques de drones/missiles houthis sur les infrastructures pétrolières — menace directe à la production ; (3) Relation États-Unis-Arabie saoudite sous Trump 2.0 — changements potentiels dans les engagements de défense ou la tarification du pétrole.',
      'Dépendances externes : Les exportations de pétrole représentent ~90% des revenus gouvernementaux et ~40% du PIB. La sécurité énergétique est primordiale — le transit du détroit d\'Ormuz est critique (20% du pétrole mondial passe par là). L\'investissement direct étranger concentré dans le tourisme et la finance. Les transferts de fonds aux travailleurs migrants (~35 milliards de dollars annuellement) sont importants mais non critiques. La défense dépend du soutien militaire américain et du renseignement.',
      'Posture de sécurité : Puissance militaire régionale avec des systèmes d\'armes avancés (fournis par les États-Unis). Les ambitions nucléaires restent peu claires mais suspectées. Fait face à des menaces par procuration des Houthis soutenus par l\'Iran (Yémen), du Hezbollah (Liban) et d\'autres milices. La menace du terrorisme intérieur est faible en raison de l\'efficacité de l\'appareil de sécurité. La modernisation militaire est en cours (Vision 2030 comprend la fabrication de défense domestique).',
      'Orientation diplomatique : Allié clé des États-Unis au Moyen-Orient. Pivot vers la Chine et la Russie sur l\'énergie/commerce tout en maintenant le partenariat de sécurité américain. La normalisation récente avec l\'Iran (accord brokérisé par la Chine en 2023) signale le pragmatisme mais la rivalité sous-jacente persiste. Puissance régionale en concurrence avec l\'Iran pour l\'influence. Expansion des liens avec l\'Inde, l\'Europe et d\'autres.',
      'Confiance des données : Moyen-Élevé — l\'Arabie saoudite publie des données macroéconomiques mais les données politiques/sécurité sont opaques. L\'accès des médias internationaux est restreint. La capacité institutionnelle est forte mais politisée.',
      'Perspective de base : Stable mais vulnérable. La richesse pétrolière fournit un coussin mais la transition énergétique menace les revenus à long terme. Les réformes Vision 2030 progressent mais font face à des obstacles (chômage, pressions sur les allocations). Les tensions régionales avec l\'Iran persisteront. Le régime maintiendra le contrôle par l\'appareil de sécurité et la distribution de la richesse, mais les pressions économiques pourraient forcer des choix difficiles.',
    ],
    political: {
      powerStructure: 'Le roi Salman détient l\'autorité suprême mais le prince héritier Mohammed bin Salman (MBS) exerce un contrôle de facto sur la politique intérieure et étrangère. Le pouvoir est hautement centralisé au sein de la famille royale — le Conseil des ministres est nommé et sert à la discrétion du roi. Le Conseil consultatif (Majlis al-Shura) est consultatif uniquement sans pouvoir législatif. La magistrature applique la loi islamique (Charia) et est subordonnée à l\'autorité exécutive. L\'appareil de sécurité (Direction du renseignement général, ministère de l\'Intérieur) est puissant et rend compte directement au prince héritier. Il n\'y a pas d\'institutions indépendantes ou de contrôles sur le pouvoir exécutif. La succession semble sûre avec MBS comme héritier clair, bien que la dynamique interne de la famille royale reste opaque.',
      stabilityDrivers: 'La légitimité repose sur trois piliers : (1) Distribution de la richesse pétrolière — le régime finance un État-providence extensif et fournit l\'emploi par les entreprises d\'État ; (2) Autorité islamique — le régime se positionne comme gardien des sites les plus saints de l\'Islam et applique la loi islamique ; (3) Appareil de sécurité — la dissidence est supprimée par la surveillance et la détention. Les forces armées sont loyales à la famille royale. L\'élite des affaires dépend des contrats gouvernementaux et du patronage. La société civile est cooptée ou supprimée. Le régime a avec succès surmonté les conflits régionaux et les chocs des prix du pétrole par ses réserves financières et son partenariat de sécurité américain.',
      shockAbsorbers: 'Amortisseurs : Réserves de change massives (~600 milliards de dollars) fournissent un tampon macroéconomique. Flux de revenus diversifiés (pétrole, tourisme, finance, fabrication). Partenariat de sécurité américain et capacité militaire. Le rôle de l\'Arabie saoudite en tant que leader de l\'OPEP+ lui donne un levier sur les marchés pétroliers mondiaux. Accélérateurs : Effondrement des prix du pétrole en dessous de 50 dollars le baril forcerait la consolidation budgétaire et les coupes dans les allocations. Une attaque terroriste majeure ou une grève réussie des Houthis sur les infrastructures pétrolières perturberait la production et la confiance des investisseurs. L\'escalade régionale avec l\'Iran ou Israël déclencherait un conflit militaire et une perturbation économique. L\'échec de la réforme Vision 2030 minerait la légitimité du régime et créerait une pression pour le changement politique.',
    },
    economy: {
      macroReality: 'La croissance du PIB est prévue à 2,5-3% pour 2025-2026 (FMI) — modérée mais dépendante des prix du pétrole et de la progression de Vision 2030. L\'inflation est projetée à ~2,5% (dans la cible). Le déficit budgétaire est projeté à ~1,5% du PIB pour 2025 (amélioré par rapport à 2023 mais toujours au-dessus des niveaux d\'avant la pandémie). La dette publique s\'élève à ~24% du PIB (faible selon les normes internationales). Le riyal saoudien est indexé au dollar américain, fournissant la stabilité des devises. Les revenus pétroliers restent la source dominante des revenus budgétaires (~90% des revenus gouvernementaux), rendant le budget hautement vulnérable aux chocs de prix. Le chômage est officiellement ~11% mais probablement plus élevé, en particulier chez les jeunes. Le secteur privé se développe mais reste petit par rapport aux entreprises d\'État.',
      externalVulnerability: 'L\'Arabie saoudite dépend fortement des exportations de pétrole — 90% des revenus gouvernementaux et 40% du PIB proviennent du pétrole. La transition énergétique mondiale menace la demande et les prix à long terme. Le détroit d\'Ormuz est critique pour les exportations énergétiques — toute perturbation (conflit iranien, attaques houthis) dévasterait l\'économie. L\'investissement direct étranger est concentré dans le tourisme et la finance — vulnérable à l\'instabilité régionale ou aux changements géopolitiques. Les transferts de fonds aux travailleurs migrants (~35 milliards de dollars annuellement) sont importants mais non critiques au budget. La dette souveraine est faible mais la soutenabilité budgétaire dépend des prix du pétrole restant au-dessus de 60 dollars le baril. La diversification économique de l\'Arabie saoudite (Vision 2030) progresse mais reste incomplète.',
      politicalEconomy: 'Vision 2030 est l\'agenda économique principal du gouvernement — visant à réduire la dépendance au pétrole par le tourisme, le divertissement, la fabrication et la finance. Les projets majeurs incluent NEOM (ville futuriste), l\'introduction en bourse de Saudi Aramco (complétée 2019) et l\'expansion du Fonds d\'investissement public (PIF). Cependant, la mise en œuvre fait face à des défis : le chômage reste élevé malgré les efforts de création d\'emplois, les coupes dans les allocations sont politiquement sensibles et la croissance du secteur privé est entravée par la dominance des entreprises d\'État. Le gouvernement investit massivement dans la fabrication de défense et les énergies renouvelables. Les réformes du marché du travail progressent mais font face à la résistance des travailleurs et des employeurs. Le secteur du tourisme se développe rapidement mais fait face à la concurrence des destinations régionales. Le secteur financier se modernise mais reste soumis aux principes de la banque islamique.',
    },
    security: {
      internal: 'La menace du terrorisme intérieur est faible en raison de l\'appareil de sécurité efficace. Le régime a avec succès supprimé les groupes affiliés à l\'ISIS et les cellules d\'Al-Qaïda. La dissidence intérieure est rare et rapidement contenue par la surveillance et la détention. Cependant, les organisations de défense des droits de l\'homme documentent la torture généralisée et les exécutions extrajudiciaires. Le régime maintient un contrôle strict sur les médias et la société civile. Les droits des femmes se sont améliorés sous Vision 2030 (conduite, emploi, sports) mais restent restreints. Les minorités religieuses font face à la discrimination. L\'appareil de sécurité est extensif et bien financé, permettant au régime de maintenir le contrôle malgré les pressions économiques.',
      diplomacy: 'L\'Arabie saoudite est un allié clé des États-Unis au Moyen-Orient, avec des partenariats profonds en défense et renseignement. Cependant, la relation est devenue plus transactionnelle sous Trump 2.0 — les États-Unis exigent une production pétrolière plus élevée pour maintenir les prix bas et poussent le soutien militaire contre l\'Iran. L\'Arabie saoudite se couvre en élargissant les liens avec la Chine et la Russie sur l\'énergie et le commerce tout en maintenant le partenariat de sécurité américain. La normalisation brokérisée par la Chine avec l\'Iran en 2023 signale le pragmatisme, mais la rivalité sous-jacente persiste — l\'Arabie saoudite et l\'Iran concourent pour l\'influence régionale par les conflits par procuration (Yémen, Syrie, Liban, Irak). L\'Arabie saoudite élargit les liens avec l\'Inde, l\'Europe et d\'autres. Les Accords Abraham (normalisation avec Israël) reflètent le pivot de l\'Arabie saoudite vers le comptage de l\'Iran et la construction d\'une alliance régionale.',
    },
    actors: {
      domestic: [
        {
          name: 'Roi Salman et prince héritier Mohammed bin Salman (MBS)',
          interests: 'Consolider le pouvoir, mettre en œuvre Vision 2030, maintenir la stabilité du régime, contrer l\'Iran, moderniser l\'armée, attirer l\'investissement étranger',
          resources: 'Richesse pétrolière, appareil de sécurité, capacité militaire, autorité de la famille royale, entreprises d\'État',
          constraints: 'Vulnérabilité aux prix du pétrole, défis de mise en œuvre de Vision 2030, tensions régionales, pression internationale sur les droits de l\'homme',
          likelyMoves: 'Continuer la mise en œuvre de Vision 2030, élargir les investissements du PIF, moderniser l\'armée, gérer la production de pétrole (OPEP+), contenir l\'influence de l\'Iran',
          dealability: 'Élevé — MBS est pragmatique et négociera sur les questions économiques/sécurité mais maintient le contrôle absolu sur les décisions politiques.',
        },
        {
          name: 'Famille royale et cercle intérieur',
          interests: 'Maintenir le pouvoir, protéger la richesse, assurer la succession, gérer les rivalités internes',
          resources: 'Richesse pétrolière, appareil d\'État, intérêts commerciaux, connexions internationales',
          constraints: 'Divisions internes potentielles, incertitudes de succession, pression externe',
          likelyMoves: 'Soutenir la consolidation de MBS, gérer la planification de la succession, protéger les intérêts commerciaux de la famille',
          dealability: 'Faible — la dynamique de la famille royale est opaque et les rivalités internes sont gérées en privé.',
        },
        {
          name: 'Élite des affaires et entreprises d\'État',
          interests: 'Maintenir les contrats gouvernementaux, élargir les opportunités du secteur privé, attirer l\'investissement étranger, bénéficier de Vision 2030',
          resources: 'Capital, emploi, connexions internationales, expertise',
          constraints: 'Dépendance au patronage gouvernemental, dominance des entreprises d\'État, incertitude réglementaire',
          likelyMoves: 'Faire du lobbying pour la privatisation, chercher les partenariats étrangers, élargir dans le tourisme/finance, soutenir la mise en œuvre de Vision 2030',
          dealability: 'Élevé — l\'élite des affaires est pragmatique et alignée avec le gouvernement sur la croissance économique.',
        },
        {
          name: 'Appareil de sécurité et armée',
          interests: 'Maintenir la sécurité intérieure, contrer les menaces externes (Iran, terrorisme), moderniser l\'armée, protéger le régime',
          resources: 'Capacité militaire, réseaux de sécurité, budget de défense, soutien américain',
          constraints: 'Pressions budgétaires, menaces régionales, examen des droits de l\'homme',
          likelyMoves: 'Élargir la modernisation militaire, contrer les menaces houthis, se préparer à l\'escalade de l\'Iran, maintenir le contrôle intérieur',
          dealability: 'Élevé — les forces de sécurité sont loyales au régime et exécuteront les directives.',
        },
        {
          name: 'Société civile et travail',
          interests: 'Améliorer les droits du travail, réduire le chômage, élargir la participation politique, protéger les droits de l\'homme',
          resources: 'Organisations de travail, réseaux de la société civile, plaidoyer international, attention médiatique',
          constraints: 'Suppression du régime, pouvoir institutionnel limité, dépendance à l\'emploi d\'État',
          likelyMoves: 'Plaider pour les réformes du travail, documenter les violations des droits de l\'homme, faire appel aux organismes internationaux, chercher le soutien de la diaspora',
          dealability: 'Faible — la société civile est supprimée et a un levier limité. Continuera le plaidoyer mais fera face à la pression du régime.',
        },
      ],
      external: [
        {
          name: 'États-Unis',
          interests: 'Maintenir l\'Arabie saoudite comme allié clé du Moyen-Orient, sécuriser l\'approvisionnement en pétrole, contrer l\'Iran, maintenir les bases militaires, empêcher l\'influence chinoise',
          resources: 'Soutien militaire, renseignement, levier diplomatique, technologie de défense',
          constraints: 'Couverture de l\'Arabie saoudite vers la Chine/Russie, préoccupations concernant les droits de l\'homme, pression politique intérieure sur les liens saoudiens',
          likelyMoves: 'Élargir la coopération de défense, faire pression sur la production de pétrole, contrer l\'Iran, maintenir la présence militaire',
          dealability: 'Élevé — l\'Arabie saoudite et les États-Unis s\'alignent sur la sécurité régionale mais la relation devient de plus en plus transactionnelle.',
        },
        {
          name: 'Iran',
          interests: 'Contrer l\'influence régionale saoudienne, élargir les réseaux par procuration, maintenir le programme nucléaire, résister à la pression américaine',
          resources: 'Capacité militaire, réseaux par procuration, influence régionale, levier énergétique',
          constraints: 'Sanctions américaines, supériorité militaire saoudienne, isolement international, pression économique',
          likelyMoves: 'Soutenir les attaques houthis, élargir les réseaux par procuration, résister à la normalisation, maintenir les ambitions nucléaires',
          dealability: 'Faible — la rivalité saoudienne-iranienne est structurelle et peu susceptible de se résoudre. Les conflits par procuration persisteront.',
        },
        {
          name: 'Chine',
          interests: 'Sécuriser les approvisionnements énergétiques, élargir l\'influence économique, contrer la dominance américaine, construire des partenariats de la Ceinture et de la Route',
          resources: 'Capital, technologie, accès au marché, demande énergétique',
          constraints: 'Pression des États-Unis sur l\'Arabie saoudite, capacité militaire limitée dans la région, pressions de la transition énergétique',
          likelyMoves: 'Élargir les partenariats énergétiques, investir dans les projets Vision 2030, médier les conflits régionaux, élargir le commerce',
          dealability: 'Élevé — l\'Arabie saoudite s\'engage pragmatiquement avec la Chine sur l\'énergie et les questions économiques.',
        },
        {
          name: 'Russie',
          interests: 'Maintenir la coopération du marché énergétique (OPEP+), contrer la dominance américaine, élargir les ventes militaires, maintenir l\'influence',
          resources: 'Coopération énergétique, technologie militaire, partenariat OPEP+, influence régionale',
          constraints: 'Pression des États-Unis, présence militaire limitée dans la région, pressions de la transition énergétique',
          likelyMoves: 'Maintenir la coordination OPEP+, élargir la coopération militaire, résister à la pression occidentale',
          dealability: 'Moyen — l\'Arabie saoudite coopère avec la Russie sur l\'OPEP+ mais maintient le partenariat de sécurité américain.',
        },
        {
          name: 'Israël',
          interests: 'Normaliser les relations, contrer l\'Iran, élargir le commerce/investissement, stabilité régionale',
          resources: 'Capacité militaire, technologie, influence régionale, soutien américain',
          constraints: 'Question palestinienne, opinion publique arabe, rivalité iranienne, instabilité régionale',
          likelyMoves: 'Élargir la normalisation (Accords Abraham), coordonner la politique sur l\'Iran, élargir le commerce',
          dealability: 'Moyen — l\'Arabie saoudite se normalise pragmatiquement avec Israël mais fait face à la pression de l\'opinion publique arabe.',
        },
      ],
    },
    risks: [
      {
        title: 'Effondrement des prix du pétrole et crise budgétaire',
        trigger: 'Le prix mondial du pétrole tombe en dessous de 50 dollars le baril en raison de la transition énergétique, d\'une récession ou d\'une augmentation de l\'approvisionnement',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '6-18 mois',
        leadingIndicators: 'Prix mondiaux du pétrole, progrès de la transition énergétique, indicateurs de récession, décisions de production de l\'OPEP+',
        mitigants: 'Réserves de change (~600 milliards de dollars), diversification Vision 2030, gestion de la production OPEP+, coupes dans les dépenses gouvernementales',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Attaque houthis/iranienne sur les infrastructures pétrolières',
        trigger: 'Grève réussie de drone/missile houthi sur les installations pétrolières ou attaques de pétroliers perturbant le détroit d\'Ormuz',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '3-12 mois',
        leadingIndicators: 'Capacité militaire houthis, attaques de drones/missiles, tensions régionales, rhétorique iranienne',
        mitigants: 'Systèmes de défense aérienne, soutien militaire américain, infrastructure pétrolière redondante, réserves stratégiques',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Échec de la mise en œuvre de Vision 2030 et réaction aux réformes',
        trigger: 'Le chômage persiste, les coupes dans les allocations s\'approfondissent ou les projets majeurs de Vision 2030 échouent à livrer',
        probability: 'Med',
        impact: 'Med',
        timeHorizon: '12-24 mois',
        leadingIndicators: 'Tendances du chômage, dépenses d\'allocations, progrès des projets Vision 2030, sentiment public',
        mitigants: 'Flexibilité des dépenses gouvernementales, programmes d\'emploi, attraction d\'investissement étranger, accélération des projets',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Escalade régionale avec l\'Iran ou Israël',
        trigger: 'Action militaire iranienne, opération militaire israélienne ou escalade du conflit par procuration affectant le territoire saoudien',
        probability: 'Low',
        impact: 'High',
        timeHorizon: '6-18 mois',
        leadingIndicators: 'Mouvements militaires iraniens, opérations militaires israéliennes, activité par procuration, rhétorique régionale',
        mitigants: 'Soutien militaire américain, systèmes de défense aérienne, canaux diplomatiques, efforts de désescalade régionale',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Détérioration de la relation États-Unis-Arabie saoudite',
        trigger: 'Les demandes de l\'administration Trump ne sont pas satisfaites (production de pétrole, soutien militaire), pression sur les droits de l\'homme ou changement stratégique',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '6-18 mois',
        leadingIndicators: 'Déclarations diplomatiques États-Unis-Arabie saoudite, changements de coopération de défense, décisions de production de pétrole, pression sur les droits de l\'homme',
        mitigants: 'Intérêts stratégiques partagés, interdépendance de défense, liens économiques, coopération OPEP+',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Attaque terroriste ou crise de sécurité intérieure',
        trigger: 'Attaque terroriste majeure, échec de l\'appareil de sécurité ou escalade de la dissidence intérieure',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '6-18 mois',
        leadingIndicators: 'Activité terroriste, incidents de sécurité, indicateurs de dissidence, alertes du terrorisme international',
        mitigants: 'Appareil de sécurité efficace, opérations de lutte contre le terrorisme, réseaux de renseignement, capacité militaire',
        lastAssessed: 'Avril 2026',
      },
    ],
    sources: [
      {
        name: 'Banque centrale saoudienne (SAMA)',
        url: 'https://www.sama.gov.sa',
        desc: 'Données officielles de la banque centrale sur la politique monétaire, l\'inflation, les taux de change, les réserves de change',
      },
      {
        name: 'Direction générale des statistiques (GASTAT)',
        url: 'https://www.stats.gov.sa',
        desc: 'Statistiques nationales — PIB, emploi, pauvreté, données d\'inflation',
      },
      {
        name: 'Consultation de l\'article IV du FMI sur l\'Arabie saoudite',
        url: 'https://www.imf.org',
        desc: 'Évaluation macroéconomique du FMI et recommandations politiques',
      },
      {
        name: 'Centre Brookings Doha',
        url: 'https://www.brookings.edu/center/doha-center/',
        desc: 'Recherche politique sur la politique du Moyen-Orient, l\'économie, la sécurité, la géopolitique',
      },
      {
        name: 'Base de données des dépenses militaires du SIPRI',
        url: 'https://www.sipri.org',
        desc: 'Données sur les dépenses militaires et les transferts d\'armes',
      },
      {
        name: 'ACLED (Armed Conflict Location & Event Data)',
        url: 'https://acleddata.com',
        desc: 'Données en temps réel sur les conflits et la violence suivant les menaces régionales',
      },
      {
        name: 'Rapport Arabie saoudite de Freedom House',
        url: 'https://freedomhouse.org',
        desc: 'Évaluation des droits politiques, des libertés civiles, de la liberté de la presse en Arabie saoudite',
      },
      {
        name: 'Rapports Arabie saoudite de Human Rights Watch',
        url: 'https://www.hrw.org',
        desc: 'Documentation des violations des droits de l\'homme et des préoccupations de sécurité',
      },
    ],
  },
};
