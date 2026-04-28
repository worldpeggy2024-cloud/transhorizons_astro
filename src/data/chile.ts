/*
 * TransHorizons — Chile Country Analysis Data
 * Full bilingual content following the Country Situation Report framework
 * Focus: Latin American economic leader, lithium exporter, social tensions, political fragmentation, commodity dependence
 * Last updated: April 2026
 * Sources: Central Bank of Chile, National Statistics Institute, IMF, World Bank, SIPRI, ACLED, Freedom House, ECLAC
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

export const chileAnalysis: AnalysisContent = {
  lastUpdated: '2026-04-15',
  scorecard: {
    eliteCohesion: 'Med',
    securityLoyalty: 'High',
    economicPressure: 'High',
    protestCapacity: 'High',
    institutionalResilience: 'Med',
  },
  en: {
    executiveSnapshot: [
      'Regime type: Presidential democracy with strong executive. President Gabriel Boric leads government (since 2022). Congress is bicameral (Chamber of Deputies and Senate). Democratic norms are strong but institutions are under strain. Civil society is active and mobilized. Military is subordinate to civilian government. Elections are competitive.',
      'Political equilibrium: Political landscape is highly fragmented with multiple parties and coalitions. Left-wing coalition (Boric) faces opposition from center-right and right-wing parties. Congress is divided and gridlocked. Constitutional reform process is contentious — multiple failed attempts to rewrite constitution. Social movements are powerful and mobilized. Political instability is moderate but manageable.',
      'Economic model: High-income economy ($300 billion GDP). Commodity-dependent — copper exports account for ~50% of export revenues. Lithium exports are growing rapidly due to energy transition. Services sector is significant. Tourism is important. Inequality is high (Gini coefficient ~0.45). Social spending is increasing but fiscal pressures are rising.',
      'Top 3 risks (6–18 months): (1) Lithium price collapse or commodity price decline affecting fiscal revenues; (2) Social unrest or protests over inequality, pensions, healthcare; (3) Constitutional gridlock or political fragmentation preventing policy implementation.',
      'Top 3 watch items (4–12 weeks): (1) Lithium and copper prices; (2) Social protest activity and labor unrest; (3) Congressional negotiations on constitutional reform and fiscal policy.',
      'External dependencies: Copper exports account for ~50% of export revenues. Lithium exports are growing rapidly. China is largest export market (~30% of exports). US is significant trade partner and investor. MERCOSUR membership but maintains separate trade policies. Remittances are minimal. Foreign direct investment is concentrated in mining.',
      'Security posture: No standing military threats. Democratic civilian control of military is strong. Internal security challenges include organized crime, drug trafficking, and border security. Terrorism threat is low. Police (Carabineros) has faced criticism for excessive force during protests. Military is professional and loyal to civilian government.',
      'Diplomatic orientation: Pragmatic engagement with regional and global partners. Strong ties with US and Western democracies. Balanced engagement with China (major trade partner). MERCOSUR member but maintains independent trade policies. Active in international institutions and human rights advocacy.',
      'Data confidence: High — Chile has strong institutional capacity and data transparency. One of the most data-rich countries in Latin America.',
      'Baseline outlook: Stable but under pressure from social demands and commodity dependence. Political gridlock will likely persist. Economic growth will moderate (1-2%). Social tensions will remain elevated. The key challenge is balancing fiscal sustainability with social demands while managing commodity price volatility.',
    ],
    political: {
      powerStructure: 'President Gabriel Boric holds executive power as head of government and state. Congress is bicameral (Chamber of Deputies with 155 seats, Senate with 50 seats). The judiciary is independent. The military is subordinate to civilian government. Local governments have significant autonomy. The civil service is professional. Constitutional reform process is ongoing and contentious.',
      stabilityDrivers: 'Legitimacy rests on democratic institutions, rule of law, and economic development. Chile has strong democratic traditions and institutions. However, social inequality and unmet demands are creating pressure. The military is loyal to civilian government. The civil service is professional. However, political fragmentation and gridlock are limiting policy implementation.',
      shockAbsorbers: 'Absorbers: Strong democratic institutions and rule of law. Diversified economy with services and tourism. Professional military and civil service. Active civil society and social movements provide pressure valve. Accelerants: Commodity price collapse would devastate fiscal revenues and trigger social unrest. Major social unrest or labor strikes would disrupt economy. Constitutional gridlock would prevent policy implementation and trigger political crisis. External economic shock would reduce demand for exports.',
    },
    economy: {
      macroReality: 'GDP growth forecast 1-2% for 2025-2026 (IMF) — below historical averages and below regional average. Inflation is projected at ~3.5% (within Central Bank target band). The fiscal deficit is projected at ~3% of GDP for 2025 (above sustainable levels). Public debt stands at ~30% of GDP (manageable but rising). The Chilean peso has depreciated ~5% against the US dollar since late 2024 due to capital outflows and commodity price pressures. Unemployment is ~8% (elevated). Poverty remains at ~11% of population.',
      externalVulnerability: 'Chile is highly dependent on commodity exports — copper accounts for ~50% of export revenues, lithium is growing rapidly. China is largest export market (~30% of exports). US is significant trade partner and investor. Commodity price volatility creates macroeconomic instability. Fiscal revenues are highly sensitive to copper prices. Foreign direct investment concentrated in mining — vulnerable to commodity price fluctuations. Sovereign debt is investment-grade (Moody\'s A1) but under pressure from fiscal deficits and commodity dependence.',
      politicalEconomy: 'Government\'s economic agenda prioritizes fiscal sustainability, social spending, and energy transition. However, there is political gridlock over fiscal policy and constitutional reform. Social demands for increased spending on pensions, healthcare, and education are creating fiscal pressures. The government is pursuing lithium development to capitalize on energy transition. However, environmental concerns and indigenous opposition are creating constraints. Labor market reforms are limited due to strong unions and social movements.',
    },
    security: {
      internal: 'Internal security challenges include organized crime, drug trafficking, and border security (particularly in the north). Terrorism threat is low. Police (Carabineros) has faced criticism for excessive force during protests and human rights violations. However, civilian oversight and accountability mechanisms are in place. Violent crime is moderate. Gang violence is present but not widespread. The military is professional and loyal to civilian government.',
      diplomacy: 'Chile maintains pragmatic engagement with regional and global partners. Strong ties with US and Western democracies. Balanced engagement with China (major trade partner). MERCOSUR member but maintains independent trade policies. Active in international institutions and human rights advocacy. Participates in regional forums like CELAC and PROSUR.',
    },
    actors: {
      domestic: [
        {
          name: 'President Gabriel Boric & Left-Wing Coalition',
          interests: 'Implement social reforms, increase social spending, address inequality, manage fiscal pressures, pass constitutional reform',
          resources: 'Executive authority, congressional coalition (though fragmented), social movement support, international credibility',
          constraints: 'Congressional gridlock, fiscal pressures, commodity price volatility, opposition from center-right and right-wing parties',
          likelyMoves: 'Pursue social spending increases, negotiate constitutional reform, manage fiscal deficits, balance social demands with fiscal sustainability',
          dealability: 'Medium — Boric is ideologically committed to social reform but faces fiscal and political constraints.',
        },
        {
          name: 'Center-Right & Right-Wing Opposition',
          interests: 'Limit social spending, protect business interests, prevent constitutional reform, maintain fiscal discipline',
          resources: 'Congressional seats, business support, media influence, institutional power',
          constraints: 'Minority position in Congress, social movement pressure, electoral vulnerability',
          likelyMoves: 'Block social spending increases, oppose constitutional reform, push for fiscal discipline, mobilize business interests',
          dealability: 'Medium — opposition is pragmatic but ideologically opposed to Boric\'s agenda.',
        },
        {
          name: 'Social Movements & Labor Unions',
          interests: 'Increase social spending, improve pensions and healthcare, address inequality, protect workers\' rights',
          resources: 'Mobilization capacity, protest power, media attention, political influence',
          constraints: 'Limited institutional power, government resistance, economic constraints',
          likelyMoves: 'Organize protests and strikes, demand increased spending, pressure government on social issues, mobilize voters',
          dealability: 'Medium — social movements are powerful but constrained by economic realities.',
        },
        {
          name: 'Business & Mining Sector',
          interests: 'Maintain business-friendly policies, protect mining interests, limit taxation, ensure profitability',
          resources: 'Capital, employment, investment, political influence, media access',
          constraints: 'Social movement pressure, government regulation, commodity price volatility, environmental concerns',
          likelyMoves: 'Lobby for business-friendly policies, resist increased taxation, invest in lithium development, manage environmental concerns',
          dealability: 'Medium-High — business is pragmatic and will adapt to government policies.',
        },
        {
          name: 'Indigenous Communities & Environmental Movement',
          interests: 'Protect indigenous rights, prevent environmental degradation, oppose mining expansion, address historical injustices',
          resources: 'Grassroots mobilization, international advocacy, moral authority, legal challenges',
          constraints: 'Limited institutional power, economic pressures, government resistance',
          likelyMoves: 'Organize protests against mining, pursue legal challenges, demand indigenous rights recognition, mobilize international support',
          dealability: 'Low-Medium — indigenous communities are mobilized but face powerful mining interests.',
        },
      ],
      external: [
        {
          name: 'United States',
          interests: 'Maintain Chile as strategic partner, counter China influence, secure lithium supply, support democracy',
          resources: 'Trade access, investment, military cooperation, diplomatic leverage, development aid',
          constraints: 'China\'s trade dominance, Chile\'s independent foreign policy, commodity price volatility',
          likelyMoves: 'Expand trade and investment, secure lithium supply, strengthen military cooperation, support democracy and human rights',
          dealability: 'High — Chile and US are aligned on democratic values and regional interests.',
        },
        {
          name: 'China',
          interests: 'Secure lithium and copper supply, expand economic influence, maintain trade relationship, counter US influence',
          resources: 'Market access, capital investment, technology, trade partnerships',
          constraints: 'US competition, environmental concerns, indigenous opposition to mining',
          likelyMoves: 'Expand investment in mining, secure lithium and copper supply, expand trade, maintain economic engagement',
          dealability: 'High — China will maintain pragmatic economic engagement with Chile.',
        },
        {
          name: 'Regional Partners (MERCOSUR, CELAC)',
          interests: 'Regional integration, trade cooperation, political coordination, counter external influence',
          resources: 'Regional influence, trade partnerships, diplomatic forums',
          constraints: 'Internal divisions, competing interests, external pressure',
          likelyMoves: 'Participate in regional forums, coordinate on trade and political issues, maintain regional engagement',
          dealability: 'High — Chile is active regional partner and will maintain engagement.',
        },
        {
          name: 'International Financial Institutions (IMF, World Bank)',
          interests: 'Fiscal sustainability, economic stability, policy reform, debt management',
          resources: 'Technical expertise, financial support, policy guidance, credibility',
          constraints: 'Limited leverage, government independence, social pressures',
          likelyMoves: 'Provide policy guidance, monitor fiscal sustainability, support economic reforms, provide technical assistance',
          dealability: 'High — Chile cooperates with IFIs and implements recommendations.',
        },
        {
          name: 'European Union & Western Democracies',
          interests: 'Support democracy and human rights, expand trade and investment, maintain strategic partnership',
          resources: 'Trade access, investment, diplomatic leverage, development aid',
          constraints: 'Limited economic weight compared to US and China, competing interests',
          likelyMoves: 'Support democracy and human rights, expand trade and investment, coordinate on regional issues',
          dealability: 'High — Chile is aligned with Western democracies on values and interests.',
        },
      ],
    },
    risks: [
      {
        title: 'Copper & Lithium Price Collapse',
        trigger: 'Significant decline in copper or lithium prices reducing export revenues and fiscal income',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '6-18 months',
        leadingIndicators: 'Commodity prices, global demand, supply trends, mining investment',
        mitigants: 'Fiscal reserves, diversified economy, economic reforms, alternative revenue sources',
        lastAssessed: 'April 2026',
      },
      {
        title: 'Social Unrest & Labor Strikes',
        trigger: 'Major social protests or labor strikes over inequality, pensions, healthcare, or wages',
        probability: 'Med',
        impact: 'Med',
        timeHorizon: '6-12 months',
        leadingIndicators: 'Social movement activity, labor union statements, protest frequency, economic conditions',
        mitigants: 'Social spending increases, dialogue with social movements, economic growth, government responsiveness',
        lastAssessed: 'April 2026',
      },
      {
        title: 'Constitutional Gridlock & Political Crisis',
        trigger: 'Failure to pass constitutional reform or major political disagreement triggering institutional crisis',
        probability: 'Med',
        impact: 'Med',
        timeHorizon: '6-18 months',
        leadingIndicators: 'Constitutional reform negotiations, congressional gridlock, political tensions, electoral dynamics',
        mitigants: 'Political dialogue, compromise on constitutional issues, institutional mechanisms, electoral pressure',
        lastAssessed: 'April 2026',
      },
      {
        title: 'Fiscal Sustainability Crisis',
        trigger: 'Fiscal deficits become unsustainable due to commodity price decline and social spending pressures',
        probability: 'Low',
        impact: 'High',
        timeHorizon: '12-24 months',
        leadingIndicators: 'Fiscal deficits, debt levels, commodity prices, credit ratings',
        mitigants: 'Fiscal reforms, revenue increases, spending discipline, IMF support',
        lastAssessed: 'April 2026',
      },
      {
        title: 'Organized Crime & Drug Trafficking Escalation',
        trigger: 'Escalation of organized crime or drug trafficking affecting security and governance',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '6-18 months',
        leadingIndicators: 'Crime statistics, drug seizures, gang violence, border security incidents',
        mitigants: 'Police and military operations, international cooperation, border security, judicial action',
        lastAssessed: 'April 2026',
      },
      {
        title: 'Environmental Crisis & Mining Opposition',
        trigger: 'Environmental disaster or major indigenous opposition to mining projects disrupting operations',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '6-18 months',
        leadingIndicators: 'Environmental incidents, indigenous protests, mining project delays, international pressure',
        mitigants: 'Environmental regulations, indigenous consultation, mining company adaptation, international standards',
        lastAssessed: 'April 2026',
      },
    ],
    sources: [
      {
        name: 'Central Bank of Chile',
        url: 'https://www.bcentral.cl',
        desc: 'Official central bank data on monetary policy, inflation, exchange rates, financial stability',
      },
      {
        name: 'National Statistics Institute (INE)',
        url: 'https://www.ine.gob.cl',
        desc: 'National statistics — GDP, employment, trade, inflation, population data',
      },
      {
        name: 'IMF Chile Article IV Consultation',
        url: 'https://www.imf.org',
        desc: 'IMF macroeconomic assessment and policy recommendations',
      },
      {
        name: 'ECLAC (Economic Commission for Latin America)',
        url: 'https://www.cepal.org',
        desc: 'Regional economic analysis and policy recommendations for Latin America',
      },
      {
        name: 'SIPRI Military Expenditure Database',
        url: 'https://www.sipri.org',
        desc: 'Military spending and arms transfer data',
      },
      {
        name: 'ACLED (Armed Conflict Location & Event Data)',
        url: 'https://acleddata.com',
        desc: 'Real-time conflict and violence data tracking internal security',
      },
      {
        name: 'Freedom House Chile Report',
        url: 'https://freedomhouse.org',
        desc: 'Assessment of political rights, civil liberties, press freedom in Chile',
      },
      {
        name: 'Chilean Media & International Coverage',
        url: 'https://www.latercera.com',
        desc: 'Media coverage of Chile politics, economics, and social issues',
      },
    ],
  },
  fr: {
    executiveSnapshot: [
      'Type de régime : Démocratie présidentielle avec exécutif fort. Le président Gabriel Boric dirige le gouvernement (depuis 2022). Le Congrès est bicaméral (Chambre des députés et Sénat). Les normes démocratiques sont fortes mais les institutions sont sous tension. La société civile est active et mobilisée. L\'armée est subordonnée au gouvernement civil. Les élections sont compétitives.',
      'Équilibre politique : Le paysage politique est hautement fragmenté avec plusieurs partis et coalitions. La coalition de gauche (Boric) fait face à l\'opposition des partis du centre-droit et de droite. Le Congrès est divisé et bloqué. Le processus de réforme constitutionnelle est contentieux — plusieurs tentatives échouées de réécrire la constitution. Les mouvements sociaux sont puissants et mobilisés. L\'instabilité politique est modérée mais gérable.',
      'Modèle économique : Économie à revenu élevé (PIB de 300 milliards de dollars). Dépendante des produits de base — les exportations de cuivre représentent ~50% des revenus d\'exportation. Les exportations de lithium se développent rapidement en raison de la transition énergétique. Le secteur des services est important. Le tourisme est important. L\'inégalité est élevée (coefficient de Gini ~0,45). Les dépenses sociales augmentent mais les pressions budgétaires augmentent.',
      'Top 3 risques (6–18 mois) : (1) Effondrement des prix du lithium ou baisse des prix des produits de base affectant les revenus fiscaux ; (2) Agitation sociale ou protestations sur l\'inégalité, les pensions, la santé ; (3) Blocage constitutionnel ou fragmentation politique empêchant la mise en œuvre des politiques.',
      'Top 3 éléments de surveillance (4–12 semaines) : (1) Prix du lithium et du cuivre ; (2) Activité de protestation sociale et agitation du travail ; (3) Négociations du Congrès sur la réforme constitutionnelle et la politique budgétaire.',
      'Dépendances externes : Les exportations de cuivre représentent ~50% des revenus d\'exportation. Les exportations de lithium se développent rapidement. La Chine est le plus grand marché d\'exportation (~30% des exportations). Les États-Unis sont un partenaire commercial important et un investisseur. L\'adhésion au MERCOSUR mais maintient des politiques commerciales séparées. Les transferts de fonds sont minimes. L\'investissement direct étranger est concentré dans l\'exploitation minière.',
      'Posture de sécurité : Aucune menace militaire permanente. Le contrôle civil démocratique de l\'armée est fort. Les défis de sécurité intérieure incluent la criminalité organisée, le trafic de drogue et la sécurité des frontières. La menace du terrorisme est faible. La police (Carabineros) a fait face à des critiques pour usage excessif de la force lors de protestations. L\'armée est professionnelle et loyale au gouvernement civil.',
      'Orientation diplomatique : Engagement pragmatique avec les partenaires régionaux et mondiaux. Liens forts avec les États-Unis et les démocraties occidentales. Engagement équilibré avec la Chine (principal partenaire commercial). Membre du MERCOSUR mais maintient des politiques commerciales indépendantes. Actif dans les institutions internationales et l\'plaidoyer en faveur des droits de l\'homme.',
      'Confiance des données : Élevé — le Chili dispose d\'une capacité institutionnelle forte et d\'une transparence des données. L\'un des pays les plus riches en données d\'Amérique latine.',
      'Perspective de base : Stable mais sous pression des demandes sociales et de la dépendance aux produits de base. Le blocage politique persistera probablement. La croissance économique se modérera (1-2%). Les tensions sociales resteront élevées. Le défi clé est d\'équilibrer la durabilité budgétaire avec les demandes sociales tout en gérant la volatilité des prix des produits de base.',
    ],
    political: {
      powerStructure: 'Le président Gabriel Boric détient le pouvoir exécutif en tant que chef du gouvernement et de l\'État. Le Congrès est bicaméral (Chambre des députés avec 155 sièges, Sénat avec 50 sièges). La magistrature est indépendante. L\'armée est subordonnée au gouvernement civil. Les gouvernements locaux ont une autonomie importante. La fonction publique est professionnelle. Le processus de réforme constitutionnelle est en cours et contentieux.',
      stabilityDrivers: 'La légitimité repose sur les institutions démocratiques, l\'état de droit et le développement économique. Le Chili a de fortes traditions et institutions démocratiques. Cependant, l\'inégalité sociale et les demandes non satisfaites créent une pression. L\'armée est loyale au gouvernement civil. La fonction publique est professionnelle. Cependant, la fragmentation politique et le blocage limitent la mise en œuvre des politiques.',
      shockAbsorbers: 'Amortisseurs : Institutions démocratiques fortes et état de droit. Économie diversifiée avec services et tourisme. Armée professionnelle et fonction publique. Société civile active et mouvements sociaux fournissent une soupape de sécurité. Accélérateurs : L\'effondrement des prix des produits de base dévasterait les revenus fiscaux et déclencherait l\'agitation sociale. L\'agitation sociale majeure ou les grèves du travail perturberaient l\'économie. Le blocage constitutionnel empêcherait la mise en œuvre des politiques et déclencherait une crise politique. Un choc économique externe réduirait la demande d\'exportations.',
    },
    economy: {
      macroReality: 'La croissance du PIB est prévue à 1-2% pour 2025-2026 (FMI) — en dessous des moyennes historiques et en dessous de la moyenne régionale. L\'inflation est projetée à ~3,5% (dans la bande cible de la Banque centrale). Le déficit budgétaire est projeté à ~3% du PIB pour 2025 (au-dessus des niveaux durables). La dette publique s\'élève à ~30% du PIB (gérable mais en hausse). Le peso chilien s\'est déprécié ~5% par rapport au dollar américain depuis fin 2024 en raison des sorties de capitaux et des pressions sur les prix des produits de base. Le chômage est ~8% (élevé). La pauvreté reste à ~11% de la population.',
      externalVulnerability: 'Le Chili dépend fortement des exportations de produits de base — le cuivre représente ~50% des revenus d\'exportation, le lithium se développe rapidement. La Chine est le plus grand marché d\'exportation (~30% des exportations). Les États-Unis sont un partenaire commercial important et un investisseur. La volatilité des prix des produits de base crée une instabilité macroéconomique. Les revenus fiscaux sont très sensibles aux prix du cuivre. L\'investissement direct étranger concentré dans l\'exploitation minière — vulnérable aux fluctuations des prix des produits de base. La dette souveraine est de qualité investissement (Moody\'s A1) mais sous pression en raison des déficits budgétaires et de la dépendance aux produits de base.',
      politicalEconomy: 'L\'agenda économique du gouvernement privilégie la durabilité budgétaire, les dépenses sociales et la transition énergétique. Cependant, il y a un blocage politique sur la politique budgétaire et la réforme constitutionnelle. Les demandes sociales d\'augmentation des dépenses pour les pensions, la santé et l\'éducation créent des pressions budgétaires. Le gouvernement poursuit le développement du lithium pour capitaliser sur la transition énergétique. Cependant, les préoccupations environnementales et l\'opposition autochtone créent des contraintes. Les réformes du marché du travail sont limitées en raison des syndicats forts et des mouvements sociaux.',
    },
    security: {
      internal: 'Les défis de sécurité intérieure incluent la criminalité organisée, le trafic de drogue et la sécurité des frontières (en particulier dans le nord). La menace du terrorisme est faible. La police (Carabineros) a fait face à des critiques pour usage excessif de la force lors de protestations et violations des droits de l\'homme. Cependant, la surveillance civile et les mécanismes de responsabilité sont en place. La criminalité violente est modérée. La violence des gangs est présente mais pas généralisée. L\'armée est professionnelle et loyale au gouvernement civil.',
      diplomacy: 'Le Chili maintient un engagement pragmatique avec les partenaires régionaux et mondiaux. Liens forts avec les États-Unis et les démocraties occidentales. Engagement équilibré avec la Chine (principal partenaire commercial). Membre du MERCOSUR mais maintient des politiques commerciales indépendantes. Actif dans les institutions internationales et l\'plaidoyer en faveur des droits de l\'homme. Participe aux forums régionaux comme la CELAC et PROSUR.',
    },
    actors: {
      domestic: [
        {
          name: 'Président Gabriel Boric et coalition de gauche',
          interests: 'Mettre en œuvre des réformes sociales, augmenter les dépenses sociales, réduire l\'inégalité, gérer les pressions budgétaires, adopter la réforme constitutionnelle',
          resources: 'Autorité exécutive, coalition parlementaire (bien que fragmentée), soutien des mouvements sociaux, crédibilité internationale',
          constraints: 'Blocage du Congrès, pressions budgétaires, volatilité des prix des produits de base, opposition des partis du centre-droit et de droite',
          likelyMoves: 'Poursuivre les augmentations de dépenses sociales, négocier la réforme constitutionnelle, gérer les déficits budgétaires, équilibrer les demandes sociales avec la durabilité budgétaire',
          dealability: 'Moyen — Boric est idéologiquement engagé dans la réforme sociale mais fait face à des contraintes budgétaires et politiques.',
        },
        {
          name: 'Opposition du centre-droit et de droite',
          interests: 'Limiter les dépenses sociales, protéger les intérêts commerciaux, empêcher la réforme constitutionnelle, maintenir la discipline budgétaire',
          resources: 'Sièges au Congrès, soutien des entreprises, influence médiatique, pouvoir institutionnel',
          constraints: 'Position minoritaire au Congrès, pression des mouvements sociaux, vulnérabilité électorale',
          likelyMoves: 'Bloquer les augmentations de dépenses sociales, s\'opposer à la réforme constitutionnelle, pousser la discipline budgétaire, mobiliser les intérêts commerciaux',
          dealability: 'Moyen — l\'opposition est pragmatique mais idéologiquement opposée à l\'agenda de Boric.',
        },
        {
          name: 'Mouvements sociaux et syndicats du travail',
          interests: 'Augmenter les dépenses sociales, améliorer les pensions et la santé, réduire l\'inégalité, protéger les droits des travailleurs',
          resources: 'Capacité de mobilisation, pouvoir de protestation, attention médiatique, influence politique',
          constraints: 'Pouvoir institutionnel limité, résistance du gouvernement, contraintes économiques',
          likelyMoves: 'Organiser des protestations et des grèves, exiger des augmentations de dépenses, faire pression sur le gouvernement sur les questions sociales, mobiliser les électeurs',
          dealability: 'Moyen — les mouvements sociaux sont puissants mais limités par les réalités économiques.',
        },
        {
          name: 'Secteur des affaires et exploitation minière',
          interests: 'Maintenir les politiques favorables aux entreprises, protéger les intérêts miniers, limiter la fiscalité, assurer la rentabilité',
          resources: 'Capital, emploi, investissement, influence politique, accès médiatique',
          constraints: 'Pression des mouvements sociaux, réglementation gouvernementale, volatilité des prix des produits de base, préoccupations environnementales',
          likelyMoves: 'Faire du lobbying pour les politiques favorables aux entreprises, résister à l\'augmentation de la fiscalité, investir dans le développement du lithium, gérer les préoccupations environnementales',
          dealability: 'Moyen-Élevé — les entreprises sont pragmatiques et s\'adapteront aux politiques gouvernementales.',
        },
        {
          name: 'Communautés autochtones et mouvement environnemental',
          interests: 'Protéger les droits autochtones, empêcher la dégradation environnementale, s\'opposer à l\'expansion minière, répondre aux injustices historiques',
          resources: 'Mobilisation de base, plaidoyer international, autorité morale, défis juridiques',
          constraints: 'Pouvoir institutionnel limité, pressions économiques, résistance du gouvernement',
          likelyMoves: 'Organiser des protestations contre l\'exploitation minière, poursuivre les défis juridiques, exiger la reconnaissance des droits autochtones, mobiliser le soutien international',
          dealability: 'Faible-Moyen — les communautés autochtones sont mobilisées mais font face à de puissants intérêts miniers.',
        },
      ],
      external: [
        {
          name: 'États-Unis',
          interests: 'Maintenir le Chili comme partenaire stratégique, contrer l\'influence chinoise, sécuriser l\'approvisionnement en lithium, soutenir la démocratie',
          resources: 'Accès commercial, investissement, coopération militaire, levier diplomatique, aide au développement',
          constraints: 'Dominance commerciale de la Chine, politique étrangère indépendante du Chili, volatilité des prix des produits de base',
          likelyMoves: 'Élargir le commerce et l\'investissement, sécuriser l\'approvisionnement en lithium, renforcer la coopération militaire, soutenir la démocratie et les droits de l\'homme',
          dealability: 'Élevé — le Chili et les États-Unis s\'alignent sur les valeurs démocratiques et les intérêts régionaux.',
        },
        {
          name: 'Chine',
          interests: 'Sécuriser l\'approvisionnement en lithium et cuivre, élargir l\'influence économique, maintenir la relation commerciale, contrer l\'influence américaine',
          resources: 'Accès au marché, investissement en capital, technologie, partenariats commerciaux',
          constraints: 'Concurrence américaine, préoccupations environnementales, opposition autochtone à l\'exploitation minière',
          likelyMoves: 'Élargir l\'investissement dans l\'exploitation minière, sécuriser l\'approvisionnement en lithium et cuivre, élargir le commerce, maintenir l\'engagement économique',
          dealability: 'Élevé — la Chine maintiendra l\'engagement économique pragmatique avec le Chili.',
        },
        {
          name: 'Partenaires régionaux (MERCOSUR, CELAC)',
          interests: 'Intégration régionale, coopération commerciale, coordination politique, contrer l\'influence externe',
          resources: 'Influence régionale, partenariats commerciaux, forums diplomatiques',
          constraints: 'Divisions internes, intérêts concurrents, pression externe',
          likelyMoves: 'Participer aux forums régionaux, coordonner sur les questions commerciales et politiques, maintenir l\'engagement régional',
          dealability: 'Élevé — le Chili est un partenaire régional actif et maintiendra l\'engagement.',
        },
        {
          name: 'Institutions financières internationales (FMI, Banque mondiale)',
          interests: 'Durabilité budgétaire, stabilité économique, réforme politique, gestion de la dette',
          resources: 'Expertise technique, soutien financier, orientation politique, crédibilité',
          constraints: 'Levier limité, indépendance gouvernementale, pressions sociales',
          likelyMoves: 'Fournir des conseils politiques, surveiller la durabilité budgétaire, soutenir les réformes économiques, fournir une assistance technique',
          dealability: 'Élevé — le Chili coopère avec les IFI et met en œuvre les recommandations.',
        },
        {
          name: 'Union européenne et démocraties occidentales',
          interests: 'Soutenir la démocratie et les droits de l\'homme, élargir le commerce et l\'investissement, maintenir le partenariat stratégique',
          resources: 'Accès commercial, investissement, levier diplomatique, aide au développement',
          constraints: 'Poids économique limité par rapport aux États-Unis et à la Chine, intérêts concurrents',
          likelyMoves: 'Soutenir la démocratie et les droits de l\'homme, élargir le commerce et l\'investissement, coordonner sur les questions régionales',
          dealability: 'Élevé — le Chili s\'aligne avec les démocraties occidentales sur les valeurs et les intérêts.',
        },
      ],
    },
    risks: [
      {
        title: 'Effondrement des prix du cuivre et du lithium',
        trigger: 'Baisse significative des prix du cuivre ou du lithium réduisant les revenus d\'exportation et les revenus fiscaux',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '6-18 mois',
        leadingIndicators: 'Prix des produits de base, demande mondiale, tendances de l\'approvisionnement, investissement minier',
        mitigants: 'Réserves budgétaires, économie diversifiée, réformes économiques, sources de revenus alternatives',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Agitation sociale et grèves du travail',
        trigger: 'Protestations sociales majeures ou grèves du travail sur l\'inégalité, les pensions, la santé ou les salaires',
        probability: 'Med',
        impact: 'Med',
        timeHorizon: '6-12 mois',
        leadingIndicators: 'Activité des mouvements sociaux, déclarations des syndicats, fréquence des protestations, conditions économiques',
        mitigants: 'Augmentations de dépenses sociales, dialogue avec les mouvements sociaux, croissance économique, réactivité gouvernementale',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Blocage constitutionnel et crise politique',
        trigger: 'Échec de l\'adoption de la réforme constitutionnelle ou désaccord politique majeur déclenchant une crise institutionnelle',
        probability: 'Med',
        impact: 'Med',
        timeHorizon: '6-18 mois',
        leadingIndicators: 'Négociations de réforme constitutionnelle, blocage du Congrès, tensions politiques, dynamique électorale',
        mitigants: 'Dialogue politique, compromis sur les questions constitutionnelles, mécanismes institutionnels, pression électorale',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Crise de durabilité budgétaire',
        trigger: 'Les déficits budgétaires deviennent insoutenables en raison de la baisse des prix des produits de base et des pressions de dépenses sociales',
        probability: 'Low',
        impact: 'High',
        timeHorizon: '12-24 mois',
        leadingIndicators: 'Déficits budgétaires, niveaux de dette, prix des produits de base, notations de crédit',
        mitigants: 'Réformes budgétaires, augmentations de revenus, discipline de dépenses, soutien du FMI',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Escalade de la criminalité organisée et du trafic de drogue',
        trigger: 'Escalade de la criminalité organisée ou du trafic de drogue affectant la sécurité et la gouvernance',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '6-18 mois',
        leadingIndicators: 'Statistiques de criminalité, saisies de drogue, violence des gangs, incidents de sécurité des frontières',
        mitigants: 'Opérations de police et militaires, coopération internationale, sécurité des frontières, action judiciaire',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Crise environnementale et opposition à l\'exploitation minière',
        trigger: 'Catastrophe environnementale ou opposition autochtone majeure aux projets miniers perturbant les opérations',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '6-18 mois',
        leadingIndicators: 'Incidents environnementaux, protestations autochtones, retards de projets miniers, pression internationale',
        mitigants: 'Réglementations environnementales, consultation autochtone, adaptation des entreprises minières, normes internationales',
        lastAssessed: 'Avril 2026',
      },
    ],
    sources: [
      {
        name: 'Banque centrale du Chili',
        url: 'https://www.bcentral.cl',
        desc: 'Données officielles de la banque centrale sur la politique monétaire, l\'inflation, les taux de change, la stabilité financière',
      },
      {
        name: 'Institut national des statistiques (INE)',
        url: 'https://www.ine.gob.cl',
        desc: 'Statistiques nationales — PIB, emploi, commerce, inflation, données démographiques',
      },
      {
        name: 'Consultation de l\'article IV du FMI sur le Chili',
        url: 'https://www.imf.org',
        desc: 'Évaluation macroéconomique du FMI et recommandations politiques',
      },
      {
        name: 'CEPAL (Commission économique pour l\'Amérique latine)',
        url: 'https://www.cepal.org',
        desc: 'Analyse économique régionale et recommandations politiques pour l\'Amérique latine',
      },
      {
        name: 'Base de données des dépenses militaires du SIPRI',
        url: 'https://www.sipri.org',
        desc: 'Données sur les dépenses militaires et les transferts d\'armes',
      },
      {
        name: 'ACLED (Armed Conflict Location & Event Data)',
        url: 'https://acleddata.com',
        desc: 'Données en temps réel sur les conflits et la violence suivant la sécurité intérieure',
      },
      {
        name: 'Rapport Chili de Freedom House',
        url: 'https://freedomhouse.org',
        desc: 'Évaluation des droits politiques, des libertés civiles, de la liberté de la presse au Chili',
      },
      {
        name: 'Médias chiliens et couverture internationale',
        url: 'https://www.latercera.com',
        desc: 'Couverture médiatique de la politique, de l\'économie et des questions sociales du Chili',
      },
    ],
  },
};
