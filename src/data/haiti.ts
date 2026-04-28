/*
 * TransHorizons — Haiti Country Analysis Data
 * Full bilingual content following the Country Situation Report framework
 * Focus: State fragility, gang violence, humanitarian crisis, political instability, security collapse, international intervention
 * Last updated: April 2026
 * Sources: Bank of the Republic of Haiti, National Institute of Statistics, IMF, World Bank, SIPRI, ACLED, Freedom House, UN MINUSTAH/BINUH
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

export const haitiAnalysis: AnalysisContent = {
  lastUpdated: '2026-04-15',
  scorecard: {
    eliteCohesion: 'Low',
    securityLoyalty: 'Med',
    economicPressure: 'High',
    protestCapacity: 'High',
    institutionalResilience: 'Low',
  },
  en: {
    executiveSnapshot: [
      'Regime type: Nominal presidential democracy but effectively a failed state. President Garry Conille leads government (since 2024). Congress exists but has limited authority. Democratic norms are weak. Civil society is fragmented. The military was dissolved in 1995 but is being reconstituted. The state has lost monopoly on violence to gangs.',
      'Political equilibrium: Haiti is in political crisis with weak governance and institutional collapse. The government has limited control over territory — gangs control significant portions of the capital Port-au-Prince and other areas. Political elites are divided and corrupt. Civil society is mobilized but fragmented. International presence (UN, OAS, US) is significant but limited in effectiveness. Political instability is very high.',
      'Economic model: Low-income economy ($35 billion GDP, ~$3,000 per capita). Heavily dependent on remittances (~35% of GDP). Agriculture is significant but subsistence-level. Manufacturing is minimal. Tourism is disrupted by insecurity. Informal economy dominates. Poverty is extreme (~60% of population). Inequality is very high.',
      'Top 3 risks (6–18 months): (1) Continued gang violence and territorial expansion; (2) Humanitarian crisis deepening (malnutrition, disease, displacement); (3) State collapse or complete loss of government control in Port-au-Prince.',
      'Top 3 watch items (4–12 weeks): (1) Gang violence trends and territorial control; (2) Humanitarian indicators (food security, disease, displacement); (3) Government security operations and international intervention.',
      'External dependencies: Remittances account for ~35% of GDP (~$4 billion annually) — primarily from diaspora in US. Imports are ~90% of consumption — heavily dependent on external supply. Food imports are critical. Foreign aid is significant (~$500 million annually). Debt service is high relative to revenues. No significant natural resources or exports.',
      'Security posture: State security forces are weak and often complicit in gang violence. Gang violence is endemic and expanding. Kidnapping, extortion, and murder are widespread. The police (PNH) are under-resourced and infiltrated by gangs. The military is being reconstituted but remains weak. Humanitarian crisis is severe. Displacement is widespread.',
      'Diplomatic orientation: Heavily dependent on international support (US, UN, OAS, international donors). Seeks security assistance and humanitarian aid. Limited independent foreign policy. Vulnerable to external pressure and intervention. Regional isolation due to instability.',
      'Data confidence: Low — Haiti has very weak institutional capacity and limited data transparency. Data collection is unreliable. Security situation limits research access.',
      'Baseline outlook: Dire and deteriorating. Gang violence is expanding and state capacity is collapsing. Humanitarian crisis is worsening. International intervention is limited and ineffective. The key challenge is preventing complete state collapse and humanitarian catastrophe. Without significant international intervention and domestic reform, the situation will continue to deteriorate.',
    ],
    political: {
      powerStructure: 'President Garry Conille holds executive power but has limited effective authority. The government controls only portions of Port-au-Prince and other urban areas — gangs control significant territory. Congress exists (Chamber of Deputies and Senate) but has limited authority and is often non-functional. The judiciary is weak and often corrupt. The police (PNH) are under-resourced and infiltrated by gangs. The military is being reconstituted but remains weak. Local governments have minimal authority.',
      stabilityDrivers: 'Legitimacy is severely undermined by state failure and gang violence. The government has lost monopoly on violence. Political elites are divided and corrupt. Civil society is fragmented and mobilized. The international community provides some legitimacy and support but is limited in effectiveness. The primary stabilizing factor is international presence and humanitarian assistance.',
      shockAbsorbers: 'Absorbers: International humanitarian assistance and security support. Remittances provide economic lifeline. International presence (UN, OAS, US) provides some stability. Accelerants: Gang violence expansion would collapse remaining government authority. Major humanitarian crisis (famine, epidemic) would trigger mass displacement and state collapse. Withdrawal of international support would accelerate collapse. Natural disaster would overwhelm weak state capacity.',
    },
    economy: {
      macroReality: 'GDP growth forecast -1% to 0% for 2025-2026 (IMF) — economic contraction due to insecurity and gang violence. Inflation is projected at ~20% (very high and driven by currency depreciation). The fiscal deficit is projected at ~5% of GDP (unsustainable). Public debt stands at ~60% of GDP (high and unsustainable). The Haitian gourde has depreciated ~30% against the US dollar since late 2024 due to capital flight and currency pressures. Unemployment is ~40% (very high). Poverty is ~60% of population.',
      externalVulnerability: 'Haiti is extremely vulnerable to external shocks. Remittances account for ~35% of GDP (~$4 billion annually) — primarily from diaspora in US. Any disruption to remittances would devastate economy. Imports are ~90% of consumption — heavily dependent on external supply. Food imports are critical for food security. Foreign aid is significant (~$500 million annually). Debt service is high relative to revenues. No significant natural resources or exports. Currency depreciation is accelerating capital flight.',
      politicalEconomy: 'Government has minimal economic agenda due to state collapse. International donors and NGOs provide most services. Remittances are primary source of foreign exchange. Informal economy dominates. State enterprises are non-functional. Private sector is minimal due to insecurity. Agricultural sector is subsistence-level. Manufacturing is minimal. Tourism is disrupted by insecurity. The government is dependent on international support for basic functions.',
    },
    security: {
      internal: 'Security situation is dire and deteriorating. Gang violence is endemic and expanding. Kidnapping, extortion, and murder are widespread. The police (PNH) are under-resourced and infiltrated by gangs. Gangs control significant portions of Port-au-Prince and other urban areas. Displacement is widespread — hundreds of thousands are internally displaced. Humanitarian crisis is severe. Disease outbreaks are common. Food insecurity is widespread. The state has lost monopoly on violence.',
      diplomacy: 'Haiti has limited independent foreign policy due to state weakness and international dependence. Heavily dependent on US for security and economic support. Seeks international humanitarian assistance and security support. Regional isolation due to instability. Vulnerable to external pressure and intervention. International presence (UN, OAS, US) is significant but limited in effectiveness.',
    },
    actors: {
      domestic: [
        {
          name: 'President Garry Conille & Government',
          interests: 'Restore government authority, combat gang violence, provide basic services, secure international support, prevent state collapse',
          resources: 'Presidential authority, government machinery (weak), police (PNH), international support, international legitimacy',
          constraints: 'Gang violence, state collapse, limited resources, corruption, international dependence, limited territorial control',
          likelyMoves: 'Seek international security assistance, attempt security operations, negotiate with international partners, provide humanitarian assistance',
          dealability: 'Low — government is weak and has limited capacity to implement policies.',
        },
        {
          name: 'Gang Leaders & Criminal Organizations',
          interests: 'Expand territorial control, maintain extortion and trafficking operations, resist government and international intervention, accumulate power and wealth',
          resources: 'Armed fighters, territorial control, extortion networks, drug trafficking, kidnapping operations, violence capacity',
          constraints: 'International intervention, government security operations, rival gang competition, limited legitimacy',
          likelyMoves: 'Expand territorial control, increase extortion and kidnapping, resist security operations, consolidate power',
          dealability: 'Very Low — gangs are motivated by profit and power with no incentive to negotiate.',
        },
        {
          name: 'Police (PNH) & Security Forces',
          interests: 'Restore security, combat gang violence, maintain institutional survival, secure resources and international support',
          resources: 'Police authority, security forces, international training and support, legitimacy',
          constraints: 'Gang infiltration, limited resources, corruption, gang violence, international dependence',
          likelyMoves: 'Conduct security operations, seek international support, attempt to restore authority, combat corruption',
          dealability: 'Medium — police are motivated by institutional survival but face significant constraints.',
        },
        {
          name: 'Civil Society & Humanitarian Organizations',
          interests: 'Provide humanitarian assistance, protect civilians, advocate for human rights, support governance reform',
          resources: 'Humanitarian networks, international connections, moral authority, grassroots mobilization',
          constraints: 'Gang violence, limited resources, government weakness, security risks',
          likelyMoves: 'Provide humanitarian assistance, advocate for international intervention, document human rights violations, support governance reform',
          dealability: 'High — civil society is motivated by humanitarian concerns and will cooperate with international partners.',
        },
        {
          name: 'Political Elites & Business Class',
          interests: 'Maintain political power, protect business interests, secure personal safety, resist reform',
          resources: 'Political authority, capital, international connections, media influence',
          constraints: 'Gang violence, state collapse, international pressure, limited legitimacy',
          likelyMoves: 'Seek international protection, resist reform, maintain business interests, negotiate with gangs',
          dealability: 'Low — elites are self-interested and resistant to reform.',
        },
      ],
      external: [
        {
          name: 'United States',
          interests: 'Prevent state collapse, combat gang violence and drug trafficking, prevent mass migration, maintain regional stability',
          resources: 'Military capability, security assistance, economic support, diplomatic leverage, military bases in region',
          constraints: 'Limited intervention capacity, domestic political constraints, effectiveness questions',
          likelyMoves: 'Provide security assistance, support international intervention, pressure government on reform, combat drug trafficking',
          dealability: 'High — US is committed to regional stability and will provide support.',
        },
        {
          name: 'United Nations & International Community',
          interests: 'Prevent state collapse, provide humanitarian assistance, support governance reform, maintain international order',
          resources: 'Peacekeeping forces, humanitarian assistance, technical expertise, diplomatic forums',
          constraints: 'Limited effectiveness, resource constraints, political divisions, gang violence',
          likelyMoves: 'Provide humanitarian assistance, support security operations, advocate for governance reform, coordinate international response',
          dealability: 'Medium — international community is committed but faces effectiveness challenges.',
        },
        {
          name: 'Regional Partners (Dominican Republic, Caribbean)',
          interests: 'Prevent mass migration, maintain regional stability, combat drug trafficking, limit humanitarian crisis spillover',
          resources: 'Regional influence, border control, security cooperation, humanitarian assistance',
          constraints: 'Limited capacity, resource constraints, competing interests',
          likelyMoves: 'Provide humanitarian assistance, support border security, participate in regional coordination, limit migration',
          dealability: 'Medium — regional partners are concerned but have limited capacity.',
        },
        {
          name: 'International Donors & NGOs',
          interests: 'Provide humanitarian assistance, support governance reform, prevent humanitarian catastrophe, maintain international engagement',
          resources: 'Humanitarian assistance, development aid, technical expertise, international networks',
          constraints: 'Limited effectiveness, resource constraints, security risks, government weakness',
          likelyMoves: 'Provide humanitarian assistance, support governance reform, coordinate international response, advocate for intervention',
          dealability: 'High — donors and NGOs are committed to humanitarian assistance.',
        },
        {
          name: 'Drug Trafficking Organizations',
          interests: 'Maintain trafficking routes through Haiti, expand operations, resist law enforcement, maintain gang partnerships',
          resources: 'Capital, trafficking networks, violence capacity, gang partnerships',
          constraints: 'International law enforcement, US pressure, gang competition',
          likelyMoves: 'Expand trafficking operations, maintain gang partnerships, resist law enforcement, adapt to security operations',
          dealability: 'Very Low — trafficking organizations are profit-motivated with no incentive to cooperate.',
        },
      ],
    },
    risks: [
      {
        title: 'Complete State Collapse & Loss of Government Control',
        trigger: 'Gang violence expands to point where government loses control of capital and major cities',
        probability: 'High',
        impact: 'High',
        timeHorizon: '6-12 months',
        leadingIndicators: 'Gang territorial expansion, government security operations failure, police defections, capital flight',
        mitigants: 'International military intervention, government security operations, gang negotiations, international support',
        lastAssessed: 'April 2026',
      },
      {
        title: 'Humanitarian Catastrophe & Mass Displacement',
        trigger: 'Worsening gang violence, food insecurity, disease outbreak triggering mass displacement and humanitarian crisis',
        probability: 'High',
        impact: 'High',
        timeHorizon: '6-12 months',
        leadingIndicators: 'Gang violence trends, food security indicators, disease outbreaks, displacement numbers',
        mitigants: 'International humanitarian assistance, security operations, food aid, medical support',
        lastAssessed: 'April 2026',
      },
      {
        title: 'Mass Migration to US & Regional Spillover',
        trigger: 'Humanitarian crisis or state collapse triggering mass migration to US and regional countries',
        probability: 'High',
        impact: 'High',
        timeHorizon: '6-18 months',
        leadingIndicators: 'Migration flows, humanitarian indicators, gang violence, economic conditions',
        mitigants: 'US border security, international humanitarian assistance, regional cooperation, security operations',
        lastAssessed: 'April 2026',
      },
      {
        title: 'Remittance Collapse & Economic Freefall',
        trigger: 'US recession or diaspora economic hardship reducing remittances and triggering economic collapse',
        probability: 'Low',
        impact: 'High',
        timeHorizon: '12-24 months',
        leadingIndicators: 'US economic indicators, remittance flows, diaspora employment, currency movements',
        mitigants: 'International aid increases, economic reforms, alternative revenue sources',
        lastAssessed: 'April 2026',
      },
      {
        title: 'Gang Consolidation & Cartel Formation',
        trigger: 'Gang consolidation into larger cartels with greater territorial control and trafficking capacity',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '6-18 months',
        leadingIndicators: 'Gang consolidation activity, territorial control changes, trafficking trends, violence patterns',
        mitigants: 'Law enforcement operations, international intervention, gang negotiations, gang member defections',
        lastAssessed: 'April 2026',
      },
      {
        title: 'Disease Outbreak & Epidemic',
        trigger: 'Major disease outbreak (cholera, dengue, COVID-19) triggering epidemic in crowded, unsanitary conditions',
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
        name: 'Bank of the Republic of Haiti (BRH)',
        url: 'https://www.brh.ht',
        desc: 'Official central bank data on monetary policy, inflation, exchange rates, financial stability',
      },
      {
        name: 'National Institute of Statistics (IHSI)',
        url: 'https://www.ihsi.ht',
        desc: 'National statistics — GDP, employment, trade, inflation, population data',
      },
      {
        name: 'IMF Haiti Article IV Consultation',
        url: 'https://www.imf.org',
        desc: 'IMF macroeconomic assessment and policy recommendations',
      },
      {
        name: 'UN Integrated Office in Haiti (BINUH)',
        url: 'https://haiti.un.org',
        desc: 'UN presence in Haiti with information on political situation, security, humanitarian needs',
      },
      {
        name: 'ACLED (Armed Conflict Location & Event Data)',
        url: 'https://acleddata.com',
        desc: 'Real-time conflict and violence data tracking gang violence and security situation',
      },
      {
        name: 'Freedom House Haiti Report',
        url: 'https://freedomhouse.org',
        desc: 'Assessment of political rights, civil liberties, press freedom in Haiti',
      },
      {
        name: 'International Crisis Group (ICG)',
        url: 'https://www.crisisgroup.org',
        desc: 'Analysis of political and security crises in Haiti',
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
      'Type de régime : Démocratie présidentielle nominale mais effectivement un État défaillant. Le président Garry Conille dirige le gouvernement (depuis 2024). Le Congrès existe mais a une autorité limitée. Les normes démocratiques sont faibles. La société civile est fragmentée. L\'armée a été dissoute en 1995 mais est en cours de reconstitution. L\'État a perdu le monopole de la violence aux gangs.',
      'Équilibre politique : Haïti est en crise politique avec une gouvernance faible et un effondrement institutionnel. Le gouvernement a un contrôle limité sur le territoire — les gangs contrôlent des portions importantes de la capitale Port-au-Prince et d\'autres zones. Les élites politiques sont divisées et corrompues. La société civile est mobilisée mais fragmentée. La présence internationale (ONU, OEA, États-Unis) est importante mais limitée en efficacité. L\'instabilité politique est très élevée.',
      'Modèle économique : Économie à faible revenu (PIB de 35 milliards de dollars, ~3 000 dollars par habitant). Fortement dépendante des transferts de fonds (~35% du PIB). L\'agriculture est importante mais au niveau de subsistance. La fabrication est minime. Le tourisme est perturbé par l\'insécurité. L\'économie informelle domine. La pauvreté est extrême (~60% de la population). L\'inégalité est très élevée.',
      'Top 3 risques (6–18 mois) : (1) Violence des gangs continue et expansion territoriale ; (2) Crise humanitaire s\'aggravant (malnutrition, maladie, déplacement) ; (3) Effondrement de l\'État ou perte complète du contrôle gouvernemental à Port-au-Prince.',
      'Top 3 éléments de surveillance (4–12 semaines) : (1) Tendances de la violence des gangs et contrôle territorial ; (2) Indicateurs humanitaires (sécurité alimentaire, maladie, déplacement) ; (3) Opérations de sécurité gouvernementales et intervention internationale.',
      'Dépendances externes : Les transferts de fonds représentent ~35% du PIB (~4 milliards de dollars annuellement) — principalement de la diaspora aux États-Unis. Les importations représentent ~90% de la consommation — fortement dépendantes de l\'approvisionnement externe. Les importations alimentaires sont critiques. L\'aide étrangère est importante (~500 millions de dollars annuellement). Le service de la dette est élevé par rapport aux revenus. Aucune ressource naturelle ou exportation significative.',
      'Posture de sécurité : Les forces de sécurité de l\'État sont faibles et souvent complices de la violence des gangs. La violence des gangs est endémique et en expansion. L\'enlèvement, l\'extorsion et le meurtre sont généralisés. La police (PNH) est sous-dotée en ressources et infiltrée par les gangs. L\'armée est en cours de reconstitution mais reste faible. La crise humanitaire est grave. Le déplacement est généralisé.',
      'Orientation diplomatique : Fortement dépendante du soutien international (États-Unis, ONU, OEA, donateurs internationaux). Cherche l\'assistance de sécurité et l\'aide humanitaire. Politique étrangère indépendante limitée. Vulnérable à la pression et l\'intervention externes. Isolement régional en raison de l\'instabilité.',
      'Confiance des données : Faible — Haïti dispose d\'une capacité institutionnelle très faible et d\'une transparence des données limitée. La collecte de données est peu fiable. La situation de sécurité limite l\'accès à la recherche.',
      'Perspective de base : Dire et se détériorant. La violence des gangs s\'élargit et la capacité de l\'État s\'effondre. La crise humanitaire s\'aggrave. L\'intervention internationale est limitée et inefficace. Le défi clé est de prévenir l\'effondrement complet de l\'État et la catastrophe humanitaire. Sans intervention internationale importante et réforme intérieure, la situation continuera à se détériorer.',
    ],
    political: {
      powerStructure: 'Le président Garry Conille détient le pouvoir exécutif mais a une autorité effective limitée. Le gouvernement contrôle seulement des portions de Port-au-Prince et d\'autres zones urbaines — les gangs contrôlent un territoire important. Le Congrès existe (Chambre des députés et Sénat) mais a une autorité limitée et est souvent non fonctionnel. La magistrature est faible et souvent corrompue. La police (PNH) est sous-dotée en ressources et infiltrée par les gangs. L\'armée est en cours de reconstitution mais reste faible. Les gouvernements locaux ont une autorité minimale.',
      stabilityDrivers: 'La légitimité est gravement compromise par l\'effondrement de l\'État et la violence des gangs. Le gouvernement a perdu le monopole de la violence. Les élites politiques sont divisées et corrompues. La société civile est fragmentée et mobilisée. La communauté internationale fournit une certaine légitimité et un soutien mais est limitée en efficacité. Le facteur de stabilisation principal est la présence internationale et l\'assistance humanitaire.',
      shockAbsorbers: 'Amortisseurs : Assistance humanitaire internationale et soutien de sécurité. Les transferts de fonds fournissent une bouée de sauvetage économique. La présence internationale (ONU, OEA, États-Unis) fournit une certaine stabilité. Accélérateurs : L\'expansion de la violence des gangs effondrerait l\'autorité gouvernementale restante. Une crise humanitaire majeure (famine, épidémie) déclencherait un déplacement massif et l\'effondrement de l\'État. Le retrait du soutien international accélérerait l\'effondrement. Une catastrophe naturelle dépasserait la capacité faible de l\'État.',
    },
    economy: {
      macroReality: 'La croissance du PIB est prévue à -1% à 0% pour 2025-2026 (FMI) — contraction économique en raison de l\'insécurité et de la violence des gangs. L\'inflation est projetée à ~20% (très élevée et entraînée par la dépréciation des devises). Le déficit budgétaire est projeté à ~5% du PIB (insoutenable). La dette publique s\'élève à ~60% du PIB (élevée et insoutenable). La gourde haïtienne s\'est dépréciée ~30% par rapport au dollar américain depuis fin 2024 en raison de la fuite des capitaux et des pressions sur les devises. Le chômage est ~40% (très élevé). La pauvreté est ~60% de la population.',
      externalVulnerability: 'Haïti est extrêmement vulnérable aux chocs externes. Les transferts de fonds représentent ~35% du PIB (~4 milliards de dollars annuellement) — principalement de la diaspora aux États-Unis. Toute perturbation des transferts de fonds dévasterait l\'économie. Les importations représentent ~90% de la consommation — fortement dépendantes de l\'approvisionnement externe. Les importations alimentaires sont critiques pour la sécurité alimentaire. L\'aide étrangère est importante (~500 millions de dollars annuellement). Le service de la dette est élevé par rapport aux revenus. Aucune ressource naturelle ou exportation significative. La dépréciation des devises accélère la fuite des capitaux.',
      politicalEconomy: 'Le gouvernement a un agenda économique minimal en raison de l\'effondrement de l\'État. Les donateurs internationaux et les ONG fournissent la plupart des services. Les transferts de fonds sont la principale source de devises étrangères. L\'économie informelle domine. Les entreprises d\'État sont non fonctionnelles. Le secteur privé est minime en raison de l\'insécurité. Le secteur agricole est au niveau de subsistance. La fabrication est minime. Le tourisme est perturbé par l\'insécurité. Le gouvernement dépend du soutien international pour les fonctions de base.',
    },
    security: {
      internal: 'La situation de sécurité est dire et se détériorant. La violence des gangs est endémique et en expansion. L\'enlèvement, l\'extorsion et le meurtre sont généralisés. La police (PNH) est sous-dotée en ressources et infiltrée par les gangs. Les gangs contrôlent des portions importantes de Port-au-Prince et d\'autres zones urbaines. Le déplacement est généralisé — des centaines de milliers sont déplacés à l\'intérieur du pays. La crise humanitaire est grave. Les foyers de maladie sont courants. L\'insécurité alimentaire est généralisée. L\'État a perdu le monopole de la violence.',
      diplomacy: 'Haïti a une politique étrangère indépendante limitée en raison de la faiblesse de l\'État et de la dépendance internationale. Fortement dépendante des États-Unis pour le soutien de sécurité et économique. Cherche l\'assistance humanitaire et le soutien de sécurité internationaux. Isolement régional en raison de l\'instabilité. Vulnérable à la pression et l\'intervention externes. La présence internationale (ONU, OEA, États-Unis) est importante mais limitée en efficacité.',
    },
    actors: {
      domestic: [
        {
          name: 'Président Garry Conille et gouvernement',
          interests: 'Restaurer l\'autorité gouvernementale, combattre la violence des gangs, fournir les services de base, sécuriser le soutien international, prévenir l\'effondrement de l\'État',
          resources: 'Autorité présidentielle, machine gouvernementale (faible), police (PNH), soutien international, légitimité internationale',
          constraints: 'Violence des gangs, effondrement de l\'État, ressources limitées, corruption, dépendance internationale, contrôle territorial limité',
          likelyMoves: 'Chercher l\'assistance de sécurité internationale, tenter les opérations de sécurité, négocier avec les partenaires internationaux, fournir l\'assistance humanitaire',
          dealability: 'Faible — le gouvernement est faible et a une capacité limitée à mettre en œuvre les politiques.',
        },
        {
          name: 'Chefs de gangs et organisations criminelles',
          interests: 'Élargir le contrôle territorial, maintenir les opérations d\'extorsion et de trafic, résister à l\'intervention gouvernementale et internationale, accumuler le pouvoir et la richesse',
          resources: 'Combattants armés, contrôle territorial, réseaux d\'extorsion, trafic de drogue, opérations d\'enlèvement, capacité de violence',
          constraints: 'Intervention internationale, opérations de sécurité gouvernementales, concurrence des gangs rivaux, légitimité limitée',
          likelyMoves: 'Élargir le contrôle territorial, augmenter l\'enlèvement et l\'extorsion, résister aux opérations de sécurité, consolider le pouvoir',
          dealability: 'Très faible — les gangs sont motivés par le profit et le pouvoir sans incitation à négocier.',
        },
        {
          name: 'Police (PNH) et forces de sécurité',
          interests: 'Restaurer la sécurité, combattre la violence des gangs, maintenir la survie institutionnelle, sécuriser les ressources et le soutien international',
          resources: 'Autorité policière, forces de sécurité, formation et soutien internationaux, légitimité',
          constraints: 'Infiltration des gangs, ressources limitées, corruption, violence des gangs, dépendance internationale',
          likelyMoves: 'Mener les opérations de sécurité, chercher le soutien international, tenter de restaurer l\'autorité, combattre la corruption',
          dealability: 'Moyen — la police est motivée par la survie institutionnelle mais fait face à des contraintes importantes.',
        },
        {
          name: 'Société civile et organisations humanitaires',
          interests: 'Fournir l\'assistance humanitaire, protéger les civils, plaider pour les droits de l\'homme, soutenir la réforme de la gouvernance',
          resources: 'Réseaux humanitaires, connexions internationales, autorité morale, mobilisation de base',
          constraints: 'Violence des gangs, ressources limitées, faiblesse gouvernementale, risques de sécurité',
          likelyMoves: 'Fournir l\'assistance humanitaire, plaider pour l\'intervention internationale, documenter les violations des droits de l\'homme, soutenir la réforme de la gouvernance',
          dealability: 'Élevé — la société civile est motivée par les préoccupations humanitaires et coopérera avec les partenaires internationaux.',
        },
        {
          name: 'Élites politiques et classe des affaires',
          interests: 'Maintenir le pouvoir politique, protéger les intérêts commerciaux, sécuriser la sécurité personnelle, résister à la réforme',
          resources: 'Autorité politique, capital, connexions internationales, influence médiatique',
          constraints: 'Violence des gangs, effondrement de l\'État, pression internationale, légitimité limitée',
          likelyMoves: 'Chercher la protection internationale, résister à la réforme, maintenir les intérêts commerciaux, négocier avec les gangs',
          dealability: 'Faible — les élites sont intéressées par elles-mêmes et résistent à la réforme.',
        },
      ],
      external: [
        {
          name: 'États-Unis',
          interests: 'Prévenir l\'effondrement de l\'État, combattre la violence des gangs et le trafic de drogue, prévenir la migration de masse, maintenir la stabilité régionale',
          resources: 'Capacité militaire, assistance de sécurité, soutien économique, levier diplomatique, bases militaires dans la région',
          constraints: 'Capacité d\'intervention limitée, contraintes politiques intérieures, questions d\'efficacité',
          likelyMoves: 'Fournir l\'assistance de sécurité, soutenir l\'intervention internationale, faire pression sur le gouvernement pour la réforme, combattre le trafic de drogue',
          dealability: 'Élevé — les États-Unis sont engagés dans la stabilité régionale et fournissent le soutien.',
        },
        {
          name: 'Nations Unies et communauté internationale',
          interests: 'Prévenir l\'effondrement de l\'État, fournir l\'assistance humanitaire, soutenir la réforme de la gouvernance, maintenir l\'ordre international',
          resources: 'Forces de maintien de la paix, assistance humanitaire, expertise technique, forums diplomatiques',
          constraints: 'Efficacité limitée, contraintes de ressources, divisions politiques, violence des gangs',
          likelyMoves: 'Fournir l\'assistance humanitaire, soutenir les opérations de sécurité, plaider pour la réforme de la gouvernance, coordonner la réponse internationale',
          dealability: 'Moyen — la communauté internationale est engagée mais fait face à des défis d\'efficacité.',
        },
        {
          name: 'Partenaires régionaux (République dominicaine, Caraïbes)',
          interests: 'Prévenir la migration de masse, maintenir la stabilité régionale, combattre le trafic de drogue, limiter le débordement de la crise humanitaire',
          resources: 'Influence régionale, contrôle des frontières, coopération de sécurité, assistance humanitaire',
          constraints: 'Capacité limitée, contraintes de ressources, intérêts concurrents',
          likelyMoves: 'Fournir l\'assistance humanitaire, soutenir la sécurité des frontières, participer à la coordination régionale, limiter la migration',
          dealability: 'Moyen — les partenaires régionaux sont préoccupés mais ont une capacité limitée.',
        },
        {
          name: 'Donateurs internationaux et ONG',
          interests: 'Fournir l\'assistance humanitaire, soutenir la réforme de la gouvernance, prévenir la catastrophe humanitaire, maintenir l\'engagement international',
          resources: 'Assistance humanitaire, aide au développement, expertise technique, réseaux internationaux',
          constraints: 'Efficacité limitée, contraintes de ressources, risques de sécurité, faiblesse gouvernementale',
          likelyMoves: 'Fournir l\'assistance humanitaire, soutenir la réforme de la gouvernance, coordonner la réponse internationale, plaider pour l\'intervention',
          dealability: 'Élevé — les donateurs et les ONG sont engagés dans l\'assistance humanitaire.',
        },
        {
          name: 'Organisations de trafic de drogue',
          interests: 'Maintenir les voies de trafic à travers Haïti, élargir les opérations, résister à l\'application de la loi, maintenir les partenariats avec les gangs',
          resources: 'Capital, réseaux de trafic, capacité de violence, partenariats avec les gangs',
          constraints: 'Application de la loi internationale, pression des États-Unis, concurrence des gangs',
          likelyMoves: 'Élargir les opérations de trafic, maintenir les partenariats avec les gangs, résister à l\'application de la loi, s\'adapter aux opérations de sécurité',
          dealability: 'Très faible — les organisations de trafic sont motivées par le profit sans incitation à coopérer.',
        },
      ],
    },
    risks: [
      {
        title: 'Effondrement complet de l\'État et perte du contrôle gouvernemental',
        trigger: 'La violence des gangs s\'élargit au point où le gouvernement perd le contrôle de la capitale et des grandes villes',
        probability: 'High',
        impact: 'High',
        timeHorizon: '6-12 mois',
        leadingIndicators: 'Expansion territoriale des gangs, échec des opérations de sécurité gouvernementales, défections policières, fuite des capitaux',
        mitigants: 'Intervention militaire internationale, opérations de sécurité gouvernementales, négociations avec les gangs, soutien international',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Catastrophe humanitaire et déplacement massif',
        trigger: 'Aggravation de la violence des gangs, insécurité alimentaire, épidémie de maladie déclenchant le déplacement massif et la crise humanitaire',
        probability: 'High',
        impact: 'High',
        timeHorizon: '6-12 mois',
        leadingIndicators: 'Tendances de la violence des gangs, indicateurs de sécurité alimentaire, foyers de maladie, nombres de déplacés',
        mitigants: 'Assistance humanitaire internationale, opérations de sécurité, aide alimentaire, soutien médical',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Migration de masse vers les États-Unis et débordement régional',
        trigger: 'Crise humanitaire ou effondrement de l\'État déclenchant la migration de masse vers les États-Unis et les pays régionaux',
        probability: 'High',
        impact: 'High',
        timeHorizon: '6-18 mois',
        leadingIndicators: 'Flux de migration, indicateurs humanitaires, violence des gangs, conditions économiques',
        mitigants: 'Sécurité des frontières américaines, assistance humanitaire internationale, coopération régionale, opérations de sécurité',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Effondrement des transferts de fonds et chute économique libre',
        trigger: 'Récession américaine ou difficultés économiques de la diaspora réduisant les transferts de fonds et déclenchant l\'effondrement économique',
        probability: 'Low',
        impact: 'High',
        timeHorizon: '12-24 mois',
        leadingIndicators: 'Indicateurs économiques américains, flux de transferts de fonds, emploi de la diaspora, mouvements des devises',
        mitigants: 'Augmentations de l\'aide internationale, réformes économiques, sources de revenus alternatives',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Consolidation des gangs et formation de cartel',
        trigger: 'Consolidation des gangs en cartels plus importants avec un contrôle territorial plus important et une capacité de trafic',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '6-18 mois',
        leadingIndicators: 'Activité de consolidation des gangs, changements de contrôle territorial, tendances de trafic, modèles de violence',
        mitigants: 'Opérations d\'application de la loi, intervention internationale, négociations avec les gangs, défections de membres de gangs',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Épidémie de maladie',
        trigger: 'Épidémie majeure de maladie (choléra, dengue, COVID-19) déclenchant une épidémie dans les conditions surpeuplées et insalubres',
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
        name: 'Banque de la République d\'Haïti (BRH)',
        url: 'https://www.brh.ht',
        desc: 'Données officielles de la banque centrale sur la politique monétaire, l\'inflation, les taux de change, la stabilité financière',
      },
      {
        name: 'Institut haïtien de statistique et d\'informatique (IHSI)',
        url: 'https://www.ihsi.ht',
        desc: 'Statistiques nationales — PIB, emploi, commerce, inflation, données démographiques',
      },
      {
        name: 'Consultation de l\'article IV du FMI sur Haïti',
        url: 'https://www.imf.org',
        desc: 'Évaluation macroéconomique du FMI et recommandations politiques',
      },
      {
        name: 'Bureau intégré des Nations Unies en Haïti (BINUH)',
        url: 'https://haiti.un.org',
        desc: 'Présence de l\'ONU en Haïti avec des informations sur la situation politique, la sécurité, les besoins humanitaires',
      },
      {
        name: 'ACLED (Armed Conflict Location & Event Data)',
        url: 'https://acleddata.com',
        desc: 'Données en temps réel sur les conflits et la violence suivant la violence des gangs et la situation de sécurité',
      },
      {
        name: 'Rapport Haïti de Freedom House',
        url: 'https://freedomhouse.org',
        desc: 'Évaluation des droits politiques, des libertés civiles, de la liberté de la presse en Haïti',
      },
      {
        name: 'Groupe de crise international (ICG)',
        url: 'https://www.crisisgroup.org',
        desc: 'Analyse des crises politiques et de sécurité en Haïti',
      },
      {
        name: 'Échange de données humanitaires et OCHA',
        url: 'https://data.humdata.org',
        desc: 'Données sur la situation humanitaire, déplacement, sécurité alimentaire, indicateurs de santé',
      },
    ],
  },
};
