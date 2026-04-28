/*
 * TransHorizons — Democratic Republic of the Congo (Kinshasa) Country Analysis Data
 * Full bilingual content following the Country Situation Report framework
 * Focus: Resource wealth, state fragility, armed conflict, mineral dependency, regional instability, governance collapse
 * Last updated: April 2026
 * Sources: Central Bank of Congo, National Statistics Institute, IMF, World Bank, SIPRI, ACLED, Human Rights Watch, International Crisis Group
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

export const congoKinshasaAnalysis: AnalysisContent = {
  lastUpdated: '2026-04-15',
  scorecard: {
    eliteCohesion: 'Low',
    securityLoyalty: 'Low',
    economicPressure: 'High',
    protestCapacity: 'Med',
    institutionalResilience: 'Low',
  },
  en: {
    executiveSnapshot: [
      'Regime type: Presidential system with authoritarian characteristics. President Félix Tshisekedi holds executive power (since 2019). Parliament exists but has limited authority and is often non-functional. Democratic norms are weak. Civil society is constrained. The military (FARDC) is weak, poorly trained, and often complicit in abuses. State authority is limited outside Kinshasa.',
      'Political equilibrium: DRC is in political crisis with weak governance and limited state authority. President Tshisekedi faces internal opposition and contested legitimacy. Parliament is fragmented and often non-functional. The military is weak and infiltrated by armed groups. Civil society is constrained by government pressure. Political instability is high. Regional conflicts are ongoing.',
      'Economic model: Low-income economy ($80 billion GDP, ~$1,000 per capita). Heavily dependent on mineral exports — cobalt, copper, coltan, gold account for ~90% of exports. Agriculture is subsistence-level. Manufacturing is minimal. Informal economy dominates. Poverty is extreme (~70% of population). Inequality is very high. Infrastructure is minimal.',
      'Top 3 risks (6–18 months): (1) Armed conflict escalation or regional war; (2) State collapse or loss of government control in eastern provinces; (3) Humanitarian crisis deepening (displacement, disease, malnutrition).',
      'Top 3 watch items (4–12 weeks): (1) Armed group activity and territorial control; (2) Military operations and civilian casualties; (3) Humanitarian indicators and displacement trends.',
      'External dependencies: Mineral exports account for ~90% of exports (~$15 billion annually) — cobalt, copper, coltan, gold. China is largest buyer of minerals (~50% of exports). Foreign aid is significant (~$1 billion annually). Remittances are minimal. No significant foreign direct investment due to instability.',
      'Security posture: Security situation is dire. Armed conflict is endemic in eastern provinces — M23, ADF, FDLR, and other groups control territory. The military (FARDC) is weak and often complicit in abuses. Civilian casualties are high. Displacement is widespread — millions are internally displaced. Humanitarian crisis is severe. Terrorism threat is moderate from ADF.',
      'Diplomatic orientation: Heavily dependent on international support. Seeks security assistance and humanitarian aid. Limited independent foreign policy. Vulnerable to external pressure and intervention. Regional tensions with Rwanda, Uganda, and Burundi. Increasingly dependent on China for economic support.',
      'Data confidence: Low — DRC has very weak institutional capacity and limited data transparency. Data collection is unreliable. Security situation limits research access. International organizations provide estimates.',
      'Baseline outlook: Dire and deteriorating. Armed conflict is expanding and state capacity is collapsing. Humanitarian crisis is worsening. International intervention is limited and ineffective. The key challenge is preventing complete state collapse and humanitarian catastrophe. Without significant international intervention and regional cooperation, the situation will continue to deteriorate.',
    ],
    political: {
      powerStructure: 'President Félix Tshisekedi holds executive power but has limited effective authority outside Kinshasa. Parliament (National Assembly and Senate) exists but has limited authority and is often non-functional. The judiciary is weak and subordinate to executive power. The military (FARDC) is weak and subordinate to civilian government but often acts independently. Local governments have minimal authority. Armed groups control significant territory in eastern provinces.',
      stabilityDrivers: 'Legitimacy is severely undermined by weak governance and armed conflict. The government has limited control over territory. Political elites are divided and corrupt. Civil society is constrained. The military is weak and often complicit in abuses. The primary stabilizing factor is international presence and humanitarian assistance.',
      shockAbsorbers: 'Absorbers: International humanitarian assistance and security support. International presence (UN, NGOs). Regional diplomatic engagement. Accelerants: Armed conflict escalation would collapse remaining government authority. Major humanitarian crisis (famine, epidemic) would trigger mass displacement and state collapse. Mineral price collapse would devastate economy. Withdrawal of international support would accelerate collapse.',
    },
    economy: {
      macroReality: 'GDP growth forecast 2-3% for 2025-2026 (IMF) — modest due to mineral exports but constrained by conflict. Inflation is projected at ~15% (high). The fiscal deficit is projected at ~3% of GDP (manageable but rising). Public debt stands at ~25% of GDP (low but rising). The Congolese franc has depreciated ~20% against the US dollar since late 2024 due to capital flight and economic pressures. Unemployment is very high (~50%). Poverty is extreme (~70% of population).',
      externalVulnerability: 'DRC is extremely vulnerable to external shocks. Mineral exports account for ~90% of exports (~$15 billion annually) — cobalt, copper, coltan, gold. China is largest buyer (~50% of exports). Any disruption to mineral exports would devastate economy. Foreign aid is significant (~$1 billion annually). Remittances are minimal. No significant foreign direct investment due to instability. Currency depreciation is accelerating capital flight.',
      politicalEconomy: 'Government has minimal economic agenda due to state collapse and armed conflict. International donors and NGOs provide most services. Mineral exports are primary source of foreign exchange. Informal economy dominates. State enterprises are non-functional. Private sector is minimal due to insecurity. Agricultural sector is subsistence-level. Manufacturing is minimal. The government is dependent on international support and mineral revenues.',
    },
    security: {
      internal: 'Security situation is dire and deteriorating. Armed conflict is endemic in eastern provinces — M23, ADF, FDLR, and other groups control territory. The military (FARDC) is weak and often complicit in abuses. Civilian casualties are high. Sexual violence is widespread — used as weapon of war. Displacement is widespread — millions are internally displaced. Humanitarian crisis is severe. Disease outbreaks are common. Food insecurity is widespread. The state has lost monopoly on violence in eastern provinces.',
      diplomacy: 'DRC has limited independent foreign policy due to state weakness and international dependence. Heavily dependent on international support. Seeks security assistance and humanitarian aid. Regional tensions with Rwanda, Uganda, and Burundi. Increasingly dependent on China for economic support. Relations with Western countries are pragmatic but strained.',
    },
    actors: {
      domestic: [
        {
          name: 'President Félix Tshisekedi & Government',
          interests: 'Restore government authority, combat armed groups, provide basic services, secure international support, prevent state collapse',
          resources: 'Presidential authority, government machinery (weak), military (FARDC), international support, international legitimacy',
          constraints: 'Armed conflict, state collapse, limited resources, corruption, international dependence, limited territorial control',
          likelyMoves: 'Seek international security assistance, attempt military operations, negotiate with armed groups, provide humanitarian assistance',
          dealability: 'Low — government is weak and has limited capacity to implement policies.',
        },
        {
          name: 'Armed Groups (M23, ADF, FDLR, etc.)',
          interests: 'Expand territorial control, maintain resource extraction, resist government and international intervention, accumulate power',
          resources: 'Armed fighters, territorial control, resource extraction, external support (Rwanda, Uganda), violence capacity',
          constraints: 'International intervention, military operations, rival group competition, limited legitimacy',
          likelyMoves: 'Expand territorial control, increase resource extraction, resist military operations, consolidate power',
          dealability: 'Very Low — armed groups are motivated by territorial control and resources with no incentive to negotiate.',
        },
        {
          name: 'Military (FARDC) & Security Forces',
          interests: 'Restore security, combat armed groups, maintain institutional survival, secure resources and international support',
          resources: 'Military authority, security forces, international training and support, legitimacy',
          constraints: 'Armed group strength, limited resources, corruption, infiltration by armed groups, international dependence',
          likelyMoves: 'Conduct military operations, seek international support, attempt to restore authority, combat corruption',
          dealability: 'Low-Medium — military is motivated by institutional survival but faces significant constraints.',
        },
        {
          name: 'Civil Society & Humanitarian Organizations',
          interests: 'Provide humanitarian assistance, protect civilians, advocate for human rights, support governance reform',
          resources: 'Humanitarian networks, international connections, moral authority, grassroots mobilization',
          constraints: 'Armed conflict, limited resources, government weakness, security risks',
          likelyMoves: 'Provide humanitarian assistance, advocate for international intervention, document human rights violations, support governance reform',
          dealability: 'High — civil society is motivated by humanitarian concerns and will cooperate with international partners.',
        },
        {
          name: 'Political Elites & Business Class',
          interests: 'Maintain political power, protect business interests, secure personal safety, control mineral resources',
          resources: 'Political authority, capital, international connections, media influence, resource control',
          constraints: 'Armed conflict, state collapse, international pressure, limited legitimacy',
          likelyMoves: 'Seek international protection, maintain business interests, negotiate with armed groups, control mineral extraction',
          dealability: 'Low — elites are self-interested and resistant to reform.',
        },
      ],
      external: [
        {
          name: 'United Nations & International Community',
          interests: 'Prevent state collapse, provide humanitarian assistance, support governance reform, maintain international order',
          resources: 'Peacekeeping forces (MONUSCO), humanitarian assistance, technical expertise, diplomatic forums',
          constraints: 'Limited effectiveness, resource constraints, political divisions, armed conflict complexity',
          likelyMoves: 'Provide humanitarian assistance, support military operations, advocate for governance reform, coordinate international response',
          dealability: 'Medium — international community is committed but faces effectiveness challenges.',
        },
        {
          name: 'China',
          interests: 'Secure mineral access, expand economic influence, maintain resource extraction partnerships, counter Western influence',
          resources: 'Capital investment, trade access, mineral purchases, diplomatic leverage, development aid',
          constraints: 'Armed conflict, state instability, Western competition, limited geopolitical alignment',
          likelyMoves: 'Maintain mineral purchases, expand investment, provide development aid, counter Western influence',
          dealability: 'High — China is pragmatic and will maintain mineral access regardless of governance.',
        },
        {
          name: 'Regional Partners (Rwanda, Uganda, Burundi, Angola)',
          interests: 'Prevent mass migration, maintain regional stability, combat armed groups, limit humanitarian crisis spillover',
          resources: 'Regional influence, border control, security cooperation, humanitarian assistance',
          constraints: 'Limited capacity, resource constraints, competing interests, armed group presence',
          likelyMoves: 'Provide humanitarian assistance, support border security, participate in regional coordination, limit migration',
          dealability: 'Medium — regional partners are concerned but have limited capacity and competing interests.',
        },
        {
          name: 'United States & Western Countries',
          interests: 'Prevent state collapse, combat armed groups, support governance reform, ensure regional stability',
          resources: 'Military capability, security assistance, diplomatic leverage, development aid',
          constraints: 'Limited intervention capacity, domestic political constraints, effectiveness questions',
          likelyMoves: 'Provide security assistance, support international intervention, pressure government on reform, combat armed groups',
          dealability: 'Medium — Western countries are concerned but have limited intervention capacity.',
        },
        {
          name: 'International Donors & NGOs',
          interests: 'Provide humanitarian assistance, support governance reform, prevent humanitarian catastrophe, maintain international engagement',
          resources: 'Humanitarian assistance, development aid, technical expertise, international networks',
          constraints: 'Limited effectiveness, resource constraints, security risks, government weakness',
          likelyMoves: 'Provide humanitarian assistance, support governance reform, coordinate international response, advocate for intervention',
          dealability: 'High — donors and NGOs are committed to humanitarian assistance.',
        },
      ],
    },
    risks: [
      {
        title: 'Armed Conflict Escalation & Regional War',
        trigger: 'Major armed conflict escalation or regional war involving Rwanda, Uganda, or other regional actors',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '6-18 months',
        leadingIndicators: 'Armed group activity, military operations, regional tensions, cross-border incidents',
        mitigants: 'International military intervention, regional diplomatic engagement, armed group negotiations, international pressure',
        lastAssessed: 'April 2026',
      },
      {
        title: 'State Collapse & Loss of Government Control',
        trigger: 'Government loses control of eastern provinces or capital due to armed conflict or state failure',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '6-18 months',
        leadingIndicators: 'Armed group territorial expansion, government military failures, capital flight, institutional collapse',
        mitigants: 'International military intervention, government military operations, armed group negotiations, international support',
        lastAssessed: 'April 2026',
      },
      {
        title: 'Humanitarian Catastrophe & Mass Displacement',
        trigger: 'Worsening armed conflict, disease outbreak, or famine triggering humanitarian catastrophe and mass displacement',
        probability: 'High',
        impact: 'High',
        timeHorizon: '6-12 months',
        leadingIndicators: 'Armed conflict trends, humanitarian indicators, disease outbreaks, displacement numbers',
        mitigants: 'International humanitarian assistance, security operations, food aid, medical support',
        lastAssessed: 'April 2026',
      },
      {
        title: 'Mineral Price Collapse & Economic Freefall',
        trigger: 'Cobalt or copper price collapse due to global recession or supply shifts',
        probability: 'Low',
        impact: 'High',
        timeHorizon: '12-24 months',
        leadingIndicators: 'Commodity prices, global economic indicators, supply trends, export volumes',
        mitigants: 'Economic diversification, international aid increases, alternative revenue sources',
        lastAssessed: 'April 2026',
      },
      {
        title: 'Armed Group Consolidation & Territorial Expansion',
        trigger: 'Armed groups consolidate and expand territorial control in eastern provinces',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '6-18 months',
        leadingIndicators: 'Armed group consolidation, territorial control changes, military operations, violence patterns',
        mitigants: 'Military operations, international intervention, armed group negotiations, regional cooperation',
        lastAssessed: 'April 2026',
      },
      {
        title: 'Disease Outbreak & Epidemic',
        trigger: 'Major disease outbreak (Ebola, cholera, COVID-19) triggering epidemic in crowded, unsanitary conditions',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '6-12 months',
        leadingIndicators: 'Disease surveillance data, health system capacity, sanitation conditions, displacement levels',
        mitigants: 'International medical support, vaccination campaigns, health system strengthening, disease surveillance',
        lastAssessed: 'April 2026',
      },
    ],
    sources: [
      {
        name: 'Central Bank of Congo (BCC)',
        url: 'https://www.bcc.cd',
        desc: 'Official central bank data on monetary policy, inflation, exchange rates, financial stability',
      },
      {
        name: 'National Statistics Institute (INS)',
        url: 'https://www.ins-rdc.org',
        desc: 'National statistics — GDP, employment, trade, inflation, population data',
      },
      {
        name: 'IMF Congo Article IV Consultation',
        url: 'https://www.imf.org',
        desc: 'IMF macroeconomic assessment and policy recommendations',
      },
      {
        name: 'ACLED (Armed Conflict Location & Event Data)',
        url: 'https://acleddata.com',
        desc: 'Real-time conflict and violence data tracking armed group activity and military operations',
      },
      {
        name: 'Human Rights Watch DRC Reports',
        url: 'https://www.hrw.org',
        desc: 'Documentation of human rights violations and humanitarian crisis',
      },
      {
        name: 'International Crisis Group (ICG)',
        url: 'https://www.crisisgroup.org',
        desc: 'Analysis of political and security crises in DRC',
      },
      {
        name: 'UN MONUSCO Mission',
        url: 'https://monusco.unmissions.org',
        desc: 'UN peacekeeping mission information and security situation reports',
      },
      {
        name: 'Humanitarian Data Exchange & OCHA',
        url: 'https://data.humdata.org',
        desc: 'Humanitarian situation data, displacement, food security, health indicators',
      },
    ],
  },
  fr: {
    executiveSnapshot: [
      'Type de régime : Système présidentiel avec caractéristiques autoritaires. Le président Félix Tshisekedi détient le pouvoir exécutif (depuis 2019). Le Parlement existe mais a une autorité limitée et est souvent non fonctionnel. Les normes démocratiques sont faibles. La société civile est limitée. L\'armée (FARDC) est faible, mal entraînée et souvent complice d\'abus. L\'autorité de l\'État est limitée en dehors de Kinshasa.',
      'Équilibre politique : La RDC est en crise politique avec une gouvernance faible et une autorité d\'État limitée. Le président Tshisekedi fait face à l\'opposition interne et à une légitimité contestée. Le Parlement est fragmenté et souvent non fonctionnel. L\'armée est faible et infiltrée par des groupes armés. La société civile est limitée par la pression gouvernementale. L\'instabilité politique est élevée. Les conflits régionaux sont en cours.',
      'Modèle économique : Économie à faible revenu (PIB de 80 milliards de dollars, ~1 000 dollars par habitant). Fortement dépendante des exportations minérales — cobalt, cuivre, coltan, or représentent ~90% des exportations. L\'agriculture est au niveau de subsistance. La fabrication est minime. L\'économie informelle domine. La pauvreté est extrême (~70% de la population). L\'inégalité est très élevée. Les infrastructures sont minimes.',
      'Top 3 risques (6–18 mois) : (1) Escalade du conflit armé ou guerre régionale ; (2) Effondrement de l\'État ou perte du contrôle gouvernemental dans les provinces orientales ; (3) Crise humanitaire s\'aggravant (déplacement, maladie, malnutrition).',
      'Top 3 éléments de surveillance (4–12 semaines) : (1) Activité des groupes armés et contrôle territorial ; (2) Opérations militaires et pertes civiles ; (3) Indicateurs humanitaires et tendances de déplacement.',
      'Dépendances externes : Les exportations minérales représentent ~90% des exportations (~15 milliards de dollars annuellement) — cobalt, cuivre, coltan, or. La Chine est le plus grand acheteur de minéraux (~50% des exportations). L\'aide étrangère est importante (~1 milliard de dollars annuellement). Les transferts de fonds sont minimes. Aucun investissement direct étranger significatif en raison de l\'instabilité.',
      'Posture de sécurité : La situation de sécurité est dire. Le conflit armé est endémique dans les provinces orientales — M23, ADF, FDLR et d\'autres groupes contrôlent le territoire. L\'armée (FARDC) est faible et souvent complice d\'abus. Les pertes civiles sont élevées. Le déplacement est généralisé — des millions sont déplacés à l\'intérieur du pays. La crise humanitaire est grave. La menace du terrorisme est modérée de la part de l\'ADF.',
      'Orientation diplomatique : Fortement dépendante du soutien international. Cherche l\'assistance de sécurité et l\'aide humanitaire. Politique étrangère indépendante limitée. Vulnérable à la pression et l\'intervention externes. Tensions régionales avec le Rwanda, l\'Ouganda et le Burundi. De plus en plus dépendante de la Chine pour le soutien économique.',
      'Confiance des données : Faible — la RDC dispose d\'une capacité institutionnelle très faible et d\'une transparence des données limitée. La collecte de données est peu fiable. La situation de sécurité limite l\'accès à la recherche. Les organisations internationales fournissent des estimations.',
      'Perspective de base : Dire et se détériorant. Le conflit armé s\'élargit et la capacité de l\'État s\'effondre. La crise humanitaire s\'aggrave. L\'intervention internationale est limitée et inefficace. Le défi clé est de prévenir l\'effondrement complet de l\'État et la catastrophe humanitaire. Sans intervention internationale importante et coopération régionale, la situation continuera à se détériorer.',
    ],
    political: {
      powerStructure: 'Le président Félix Tshisekedi détient le pouvoir exécutif mais a une autorité effective limitée en dehors de Kinshasa. Le Parlement (Assemblée nationale et Sénat) existe mais a une autorité limitée et est souvent non fonctionnel. La magistrature est faible et subordonnée au pouvoir exécutif. L\'armée (FARDC) est faible et subordonnée au gouvernement civil mais agit souvent indépendamment. Les gouvernements locaux ont une autorité minimale. Les groupes armés contrôlent un territoire important dans les provinces orientales.',
      stabilityDrivers: 'La légitimité est gravement compromise par la gouvernance faible et le conflit armé. Le gouvernement a un contrôle limité sur le territoire. Les élites politiques sont divisées et corrompues. La société civile est limitée. L\'armée est faible et souvent complice d\'abus. Le facteur de stabilisation principal est la présence internationale et l\'assistance humanitaire.',
      shockAbsorbers: 'Amortisseurs : Assistance humanitaire internationale et soutien de sécurité. Présence internationale (ONU, ONG). Engagement diplomatique régional. Accélérateurs : L\'escalade du conflit armé effondrerait l\'autorité gouvernementale restante. Une crise humanitaire majeure (famine, épidémie) déclencherait un déplacement massif et l\'effondrement de l\'État. L\'effondrement des prix des minéraux dévasterait l\'économie. Le retrait du soutien international accélérerait l\'effondrement.',
    },
    economy: {
      macroReality: 'La croissance du PIB est prévue à 2-3% pour 2025-2026 (FMI) — modeste en raison des exportations minérales mais limitée par le conflit. L\'inflation est projetée à ~15% (élevée). Le déficit budgétaire est projeté à ~3% du PIB (gérable mais en hausse). La dette publique s\'élève à ~25% du PIB (faible mais en hausse). Le franc congolais s\'est déprécié ~20% par rapport au dollar américain depuis fin 2024 en raison de la fuite des capitaux et des pressions économiques. Le chômage est très élevé (~50%). La pauvreté est extrême (~70% de la population).',
      externalVulnerability: 'La RDC est extrêmement vulnérable aux chocs externes. Les exportations minérales représentent ~90% des exportations (~15 milliards de dollars annuellement) — cobalt, cuivre, coltan, or. La Chine est le plus grand acheteur (~50% des exportations). Toute perturbation des exportations minérales dévasterait l\'économie. L\'aide étrangère est importante (~1 milliard de dollars annuellement). Les transferts de fonds sont minimes. Aucun investissement direct étranger significatif en raison de l\'instabilité. La dépréciation des devises accélère la fuite des capitaux.',
      politicalEconomy: 'Le gouvernement a un agenda économique minimal en raison de l\'effondrement de l\'État et du conflit armé. Les donateurs internationaux et les ONG fournissent la plupart des services. Les exportations minérales sont la principale source de devises étrangères. L\'économie informelle domine. Les entreprises d\'État sont non fonctionnelles. Le secteur privé est minime en raison de l\'insécurité. Le secteur agricole est au niveau de subsistance. La fabrication est minime. Le gouvernement dépend du soutien international et des revenus minéraux.',
    },
    security: {
      internal: 'La situation de sécurité est dire et se détériorant. Le conflit armé est endémique dans les provinces orientales — M23, ADF, FDLR et d\'autres groupes contrôlent le territoire. L\'armée (FARDC) est faible et souvent complice d\'abus. Les pertes civiles sont élevées. La violence sexuelle est généralisée — utilisée comme arme de guerre. Le déplacement est généralisé — des millions sont déplacés à l\'intérieur du pays. La crise humanitaire est grave. Les foyers de maladie sont courants. L\'insécurité alimentaire est généralisée. L\'État a perdu le monopole de la violence dans les provinces orientales.',
      diplomacy: 'La RDC a une politique étrangère indépendante limitée en raison de la faiblesse de l\'État et de la dépendance internationale. Fortement dépendante du soutien international. Cherche l\'assistance de sécurité et l\'aide humanitaire. Tensions régionales avec le Rwanda, l\'Ouganda et le Burundi. De plus en plus dépendante de la Chine pour le soutien économique. Les relations avec les pays occidentaux sont pragmatiques mais tendues.',
    },
    actors: {
      domestic: [
        {
          name: 'Président Félix Tshisekedi et gouvernement',
          interests: 'Restaurer l\'autorité gouvernementale, combattre les groupes armés, fournir les services de base, sécuriser le soutien international, prévenir l\'effondrement de l\'État',
          resources: 'Autorité présidentielle, machine gouvernementale (faible), armée (FARDC), soutien international, légitimité internationale',
          constraints: 'Conflit armé, effondrement de l\'État, ressources limitées, corruption, dépendance internationale, contrôle territorial limité',
          likelyMoves: 'Chercher l\'assistance de sécurité internationale, tenter les opérations militaires, négocier avec les groupes armés, fournir l\'assistance humanitaire',
          dealability: 'Faible — le gouvernement est faible et a une capacité limitée à mettre en œuvre les politiques.',
        },
        {
          name: 'Groupes armés (M23, ADF, FDLR, etc.)',
          interests: 'Élargir le contrôle territorial, maintenir l\'extraction de ressources, résister à l\'intervention gouvernementale et internationale, accumuler le pouvoir',
          resources: 'Combattants armés, contrôle territorial, extraction de ressources, soutien externe (Rwanda, Ouganda), capacité de violence',
          constraints: 'Intervention internationale, opérations militaires, concurrence des groupes rivaux, légitimité limitée',
          likelyMoves: 'Élargir le contrôle territorial, augmenter l\'extraction de ressources, résister aux opérations militaires, consolider le pouvoir',
          dealability: 'Très faible — les groupes armés sont motivés par le contrôle territorial et les ressources sans incitation à négocier.',
        },
        {
          name: 'Armée (FARDC) et forces de sécurité',
          interests: 'Restaurer la sécurité, combattre les groupes armés, maintenir la survie institutionnelle, sécuriser les ressources et le soutien international',
          resources: 'Autorité militaire, forces de sécurité, formation et soutien internationaux, légitimité',
          constraints: 'Force des groupes armés, ressources limitées, corruption, infiltration par les groupes armés, dépendance internationale',
          likelyMoves: 'Mener les opérations militaires, chercher le soutien international, tenter de restaurer l\'autorité, combattre la corruption',
          dealability: 'Faible-Moyen — l\'armée est motivée par la survie institutionnelle mais fait face à des contraintes importantes.',
        },
        {
          name: 'Société civile et organisations humanitaires',
          interests: 'Fournir l\'assistance humanitaire, protéger les civils, plaider pour les droits de l\'homme, soutenir la réforme de la gouvernance',
          resources: 'Réseaux humanitaires, connexions internationales, autorité morale, mobilisation de base',
          constraints: 'Conflit armé, ressources limitées, faiblesse gouvernementale, risques de sécurité',
          likelyMoves: 'Fournir l\'assistance humanitaire, plaider pour l\'intervention internationale, documenter les violations des droits de l\'homme, soutenir la réforme de la gouvernance',
          dealability: 'Élevé — la société civile est motivée par les préoccupations humanitaires et coopérera avec les partenaires internationaux.',
        },
        {
          name: 'Élites politiques et classe des affaires',
          interests: 'Maintenir le pouvoir politique, protéger les intérêts commerciaux, sécuriser la sécurité personnelle, contrôler l\'extraction de ressources',
          resources: 'Autorité politique, capital, connexions internationales, influence médiatique, contrôle des ressources',
          constraints: 'Conflit armé, effondrement de l\'État, pression internationale, légitimité limitée',
          likelyMoves: 'Chercher la protection internationale, maintenir les intérêts commerciaux, négocier avec les groupes armés, contrôler l\'extraction minérale',
          dealability: 'Faible — les élites sont intéressées par elles-mêmes et résistent à la réforme.',
        },
      ],
      external: [
        {
          name: 'Nations Unies et communauté internationale',
          interests: 'Prévenir l\'effondrement de l\'État, fournir l\'assistance humanitaire, soutenir la réforme de la gouvernance, maintenir l\'ordre international',
          resources: 'Forces de maintien de la paix (MONUSCO), assistance humanitaire, expertise technique, forums diplomatiques',
          constraints: 'Efficacité limitée, contraintes de ressources, divisions politiques, complexité du conflit armé',
          likelyMoves: 'Fournir l\'assistance humanitaire, soutenir les opérations militaires, plaider pour la réforme de la gouvernance, coordonner la réponse internationale',
          dealability: 'Moyen — la communauté internationale est engagée mais fait face à des défis d\'efficacité.',
        },
        {
          name: 'Chine',
          interests: 'Sécuriser l\'accès aux minéraux, élargir l\'influence économique, maintenir les partenariats d\'extraction de ressources, contrer l\'influence occidentale',
          resources: 'Investissement en capital, accès commercial, achats de minéraux, levier diplomatique, aide au développement',
          constraints: 'Conflit armé, instabilité de l\'État, concurrence occidentale, alignement géopolitique limité',
          likelyMoves: 'Maintenir les achats de minéraux, élargir l\'investissement, fournir l\'aide au développement, contrer l\'influence occidentale',
          dealability: 'Élevé — la Chine est pragmatique et maintiendra l\'accès aux minéraux indépendamment de la gouvernance.',
        },
        {
          name: 'Partenaires régionaux (Rwanda, Ouganda, Burundi, Angola)',
          interests: 'Prévenir la migration de masse, maintenir la stabilité régionale, combattre les groupes armés, limiter le débordement de la crise humanitaire',
          resources: 'Influence régionale, contrôle des frontières, coopération de sécurité, assistance humanitaire',
          constraints: 'Capacité limitée, contraintes de ressources, intérêts concurrents, présence de groupes armés',
          likelyMoves: 'Fournir l\'assistance humanitaire, soutenir la sécurité des frontières, participer à la coordination régionale, limiter la migration',
          dealability: 'Moyen — les partenaires régionaux sont préoccupés mais ont une capacité limitée et des intérêts concurrents.',
        },
        {
          name: 'États-Unis et pays occidentaux',
          interests: 'Prévenir l\'effondrement de l\'État, combattre les groupes armés, soutenir la réforme de la gouvernance, assurer la stabilité régionale',
          resources: 'Capacité militaire, assistance de sécurité, levier diplomatique, aide au développement',
          constraints: 'Capacité d\'intervention limitée, contraintes politiques intérieures, questions d\'efficacité',
          likelyMoves: 'Fournir l\'assistance de sécurité, soutenir l\'intervention internationale, faire pression sur le gouvernement pour la réforme, combattre les groupes armés',
          dealability: 'Moyen — les pays occidentaux sont préoccupés mais ont une capacité d\'intervention limitée.',
        },
        {
          name: 'Donateurs internationaux et ONG',
          interests: 'Fournir l\'assistance humanitaire, soutenir la réforme de la gouvernance, prévenir la catastrophe humanitaire, maintenir l\'engagement international',
          resources: 'Assistance humanitaire, aide au développement, expertise technique, réseaux internationaux',
          constraints: 'Efficacité limitée, contraintes de ressources, risques de sécurité, faiblesse gouvernementale',
          likelyMoves: 'Fournir l\'assistance humanitaire, soutenir la réforme de la gouvernance, coordonner la réponse internationale, plaider pour l\'intervention',
          dealability: 'Élevé — les donateurs et les ONG sont engagés dans l\'assistance humanitaire.',
        },
      ],
    },
    risks: [
      {
        title: 'Escalade du conflit armé et guerre régionale',
        trigger: 'Escalade majeure du conflit armé ou guerre régionale impliquant le Rwanda, l\'Ouganda ou d\'autres acteurs régionaux',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '6-18 mois',
        leadingIndicators: 'Activité des groupes armés, opérations militaires, tensions régionales, incidents transfrontaliers',
        mitigants: 'Intervention militaire internationale, engagement diplomatique régional, négociations avec les groupes armés, pression internationale',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Effondrement de l\'État et perte du contrôle gouvernemental',
        trigger: 'Le gouvernement perd le contrôle des provinces orientales ou de la capitale en raison du conflit armé ou de l\'effondrement de l\'État',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '6-18 mois',
        leadingIndicators: 'Expansion territoriale des groupes armés, échecs militaires gouvernementaux, fuite des capitaux, effondrement institutionnel',
        mitigants: 'Intervention militaire internationale, opérations militaires gouvernementales, négociations avec les groupes armés, soutien international',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Catastrophe humanitaire et déplacement massif',
        trigger: 'Aggravation du conflit armé, épidémie de maladie ou famine déclenchant la catastrophe humanitaire et le déplacement massif',
        probability: 'High',
        impact: 'High',
        timeHorizon: '6-12 mois',
        leadingIndicators: 'Tendances du conflit armé, indicateurs humanitaires, foyers de maladie, nombres de déplacés',
        mitigants: 'Assistance humanitaire internationale, opérations de sécurité, aide alimentaire, soutien médical',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Effondrement des prix des minéraux et chute économique libre',
        trigger: 'Effondrement des prix du cobalt ou du cuivre en raison de la récession mondiale ou des changements d\'approvisionnement',
        probability: 'Low',
        impact: 'High',
        timeHorizon: '12-24 mois',
        leadingIndicators: 'Prix des matières premières, indicateurs économiques mondiaux, tendances d\'approvisionnement, volumes d\'exportation',
        mitigants: 'Diversification économique, augmentations de l\'aide internationale, sources de revenus alternatives',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Consolidation des groupes armés et expansion territoriale',
        trigger: 'Les groupes armés se consolident et élargissent le contrôle territorial dans les provinces orientales',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '6-18 mois',
        leadingIndicators: 'Consolidation des groupes armés, changements de contrôle territorial, opérations militaires, modèles de violence',
        mitigants: 'Opérations militaires, intervention internationale, négociations avec les groupes armés, coopération régionale',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Épidémie de maladie',
        trigger: 'Épidémie majeure de maladie (Ebola, choléra, COVID-19) déclenchant une épidémie dans les conditions surpeuplées et insalubres',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '6-12 mois',
        leadingIndicators: 'Données de surveillance des maladies, capacité du système de santé, conditions d\'assainissement, niveaux de déplacement',
        mitigants: 'Soutien médical international, campagnes de vaccination, renforcement du système de santé, surveillance des maladies',
        lastAssessed: 'Avril 2026',
      },
    ],
    sources: [
      {
        name: 'Banque centrale du Congo (BCC)',
        url: 'https://www.bcc.cd',
        desc: 'Données officielles de la banque centrale sur la politique monétaire, l\'inflation, les taux de change, la stabilité financière',
      },
      {
        name: 'Institut national de statistique (INS)',
        url: 'https://www.ins-rdc.org',
        desc: 'Statistiques nationales — PIB, emploi, commerce, inflation, données démographiques',
      },
      {
        name: 'Consultation de l\'article IV du FMI sur le Congo',
        url: 'https://www.imf.org',
        desc: 'Évaluation macroéconomique du FMI et recommandations politiques',
      },
      {
        name: 'ACLED (Armed Conflict Location & Event Data)',
        url: 'https://acleddata.com',
        desc: 'Données en temps réel sur les conflits et la violence suivant l\'activité des groupes armés et les opérations militaires',
      },
      {
        name: 'Rapports de Human Rights Watch sur la RDC',
        url: 'https://www.hrw.org',
        desc: 'Documentation des violations des droits de l\'homme et de la crise humanitaire',
      },
      {
        name: 'Groupe de crise international (ICG)',
        url: 'https://www.crisisgroup.org',
        desc: 'Analyse des crises politiques et de sécurité en RDC',
      },
      {
        name: 'Mission MONUSCO des Nations Unies',
        url: 'https://monusco.unmissions.org',
        desc: 'Informations sur la mission de maintien de la paix de l\'ONU et les rapports sur la situation de sécurité',
      },
      {
        name: 'Échange de données humanitaires et OCHA',
        url: 'https://data.humdata.org',
        desc: 'Données sur la situation humanitaire, déplacement, sécurité alimentaire, indicateurs de santé',
      },
    ],
  },
};
