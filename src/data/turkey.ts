/*
 * TransHorizons — Turkey Country Analysis Data
 * Full bilingual content following the Country Situation Report framework
 * Focus: NATO member, Middle East/Europe bridge, authoritarian drift, Syria/Ukraine influence, energy corridor, geopolitical pivot
 * Last updated: April 2026
 * Sources: Central Bank of Turkey, Turkish Statistics Institute, IMF, World Bank, SIPRI, ACLED, Freedom House, OSCE
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

export const turkeyAnalysis: AnalysisContent = {
  lastUpdated: '2026-04-15',
  scorecard: {
    eliteCohesion: 'Med',
    securityLoyalty: 'High',
    economicPressure: 'High',
    protestCapacity: 'Med',
    institutionalResilience: 'Med',
  },
  en: {
    executiveSnapshot: [
      'Regime type: Presidential system with authoritarian drift. President Recep Tayyip Erdoğan holds concentrated executive power (since 2003 as PM, 2014 as President). Parliament exists but is dominated by Erdoğan\'s Justice and Development Party (AKP). Democratic norms are weakening — press freedom is limited, opposition is suppressed. Civil society is constrained. The military is subordinate to civilian government but retains institutional power.',
      'Political equilibrium: Erdoğan maintains strong political control through AKP dominance and personalist leadership. Opposition parties are fragmented and weakened. The military has been subordinated to civilian control but retains institutional influence. Civil society is constrained by government pressure. Political stability is moderate but dependent on Erdoğan\'s continued dominance. Succession planning is opaque.',
      'Economic model: Upper-middle-income economy ($1.1 trillion GDP). Diversified economy with manufacturing, services, tourism, and agriculture. However, inflation is high and currency is under pressure. External vulnerabilities include current account deficits and foreign debt. Inequality is moderate. Social spending is significant but fiscal pressures are rising.',
      'Top 3 risks (6–18 months): (1) Currency crisis or capital flight due to economic pressures; (2) Syria instability or refugee crisis escalation; (3) NATO tensions or Ukraine policy shifts affecting security relationships.',
      'Top 3 watch items (4–12 weeks): (1) Currency and inflation trends; (2) Syria developments and refugee flows; (3) NATO relations and Ukraine policy.',
      'External dependencies: Tourism accounts for ~4% of GDP but is critical for foreign exchange. Remittances are significant (~$10 billion annually). Energy imports are critical — dependent on Russian gas (though diversifying). Exports are diversified but vulnerable to global demand. Foreign direct investment is important for growth.',
      'Security posture: NATO member with significant military capability. Faces internal security challenges from PKK terrorism and Kurdish separatism. Active military operations in Syria and Iraq. Border security concerns with Syria and Iraq. Terrorism threat is moderate. The military is professional and loyal to civilian government. Defense spending is ~2.5% of GDP.',
      'Diplomatic orientation: NATO member but maintains pragmatic engagement with Russia and Middle East. Strategic bridge between Europe and Middle East. Active in Syria and Iraq. Balances Western ties with Russian engagement. Seeks regional influence and energy security. Increasingly assertive in Eastern Mediterranean and Aegean disputes.',
      'Data confidence: Medium-High — Turkey publishes macroeconomic data but political/security data is less transparent. Media freedom is limited. Institutional capacity is moderate.',
      'Baseline outlook: Stable but under economic and political pressure. Erdoğan will likely maintain control but faces economic challenges. Regional tensions will persist. NATO relationship will remain important but strained. The key challenge is managing economic pressures while maintaining political control and regional influence.',
    ],
    political: {
      powerStructure: 'President Recep Tayyip Erdoğan holds concentrated executive power. Parliament (Grand National Assembly) has 600 seats dominated by AKP. The judiciary is subordinate to executive power — independence is compromised. The military is subordinate to civilian government but retains institutional influence. Local governments have some autonomy but are often controlled by AKP. The civil service is politicized.',
      stabilityDrivers: 'Legitimacy rests on Erdoğan\'s personalist leadership, AKP dominance, and economic performance (though now declining). The military is loyal to civilian government. The civil service implements government directives. However, opposition is fragmented and weakened. Civil society is constrained. Democratic norms are weakening.',
      shockAbsorbers: 'Absorbers: Strong military and security apparatus. Diversified economy with manufacturing and services. Tourism and remittances provide foreign exchange. NATO membership provides security guarantee. Accelerants: Currency crisis or capital flight would trigger economic crisis. Major Syria instability or refugee crisis would overwhelm capacity. NATO tensions or Ukraine policy shift would create security crisis. Domestic political crisis or succession struggle would destabilize government.',
    },
    economy: {
      macroReality: 'GDP growth forecast 2-3% for 2025-2026 (IMF) — moderate but below historical averages. Inflation is projected at ~15% (high and above target). The fiscal deficit is projected at ~2% of GDP (manageable but rising). Public debt stands at ~35% of GDP (manageable). The Turkish lira has depreciated ~15% against the US dollar since late 2024 due to capital outflows and inflation pressures. Unemployment is ~9% (elevated). Poverty remains at ~15% of population.',
      externalVulnerability: 'Turkey faces significant external vulnerabilities. Current account deficit is projected at ~5% of GDP (structural weakness). Foreign debt is ~50% of GDP (manageable but rising). Tourism accounts for ~4% of GDP but is critical for foreign exchange. Remittances are significant (~$10 billion annually). Energy imports are critical — dependent on Russian gas (though diversifying). Exports are diversified but vulnerable to global demand. Capital flight is a concern due to currency pressures.',
      politicalEconomy: 'Government\'s economic agenda prioritizes growth, employment, and infrastructure investment. However, inflation and currency pressures are constraining policy space. The government is pursuing energy diversification away from Russian gas. Tourism development is a priority. However, political uncertainty and currency pressures are deterring foreign investment. Labor market reforms are limited due to union pressure. State enterprises remain dominant in key sectors.',
    },
    security: {
      internal: 'Internal security challenges include PKK terrorism and Kurdish separatism. Terrorism threat is moderate — PKK conducts periodic attacks. The government conducts military operations against PKK in Turkey, Syria, and Iraq. Border security is a priority. Gang violence and organized crime are present but not widespread. The police and military are professional and loyal to government. Civil liberties are constrained — press freedom is limited, opposition is suppressed.',
      diplomacy: 'Turkey is NATO member but maintains pragmatic engagement with Russia and Middle East. Active in Syria and Iraq with military operations. Balances Western ties with Russian engagement (energy dependence). Seeks regional influence in Eastern Mediterranean and Aegean. Disputes with Greece over maritime boundaries and Cyprus. Increasingly assertive in regional affairs. Relations with US are strained but remain important.',
    },
    actors: {
      domestic: [
        {
          name: 'President Recep Tayyip Erdoğan & AKP',
          interests: 'Maintain political control, ensure economic growth, manage succession, consolidate power, maintain regional influence',
          resources: 'Presidential authority, AKP dominance, government machinery, military loyalty, media control',
          constraints: 'Economic pressures, opposition fragmentation, NATO constraints, regional tensions, succession uncertainty',
          likelyMoves: 'Maintain economic growth focus, manage succession planning, balance NATO relations with regional engagement, control opposition',
          dealability: 'Medium — Erdoğan is pragmatic on economic issues but inflexible on political control.',
        },
        {
          name: 'Opposition Parties & Civil Society',
          interests: 'Challenge AKP dominance, restore democratic norms, address economic grievances, protect civil liberties',
          resources: 'Electoral support, grassroots networks, international advocacy, media platforms',
          constraints: 'AKP dominance, government pressure, fragmentation, limited institutional power',
          likelyMoves: 'Challenge government policies through electoral and parliamentary channels, advocate for civil liberties, organize protests',
          dealability: 'Low-Medium — opposition is fragmented and faces government pressure.',
        },
        {
          name: 'Military & Security Forces',
          interests: 'Maintain institutional power, protect national security, manage PKK threat, maintain NATO partnership',
          resources: 'Military capability, security apparatus, professional expertise, NATO partnership',
          constraints: 'Civilian government control, budget constraints, PKK threat, NATO constraints',
          likelyMoves: 'Conduct security operations against PKK, maintain NATO partnership, manage border security, protect institutional interests',
          dealability: 'Medium-High — military is professional and will cooperate on security issues.',
        },
        {
          name: 'Business & Private Sector',
          interests: 'Maintain business-friendly policies, ensure economic growth, protect business interests, attract investment',
          resources: 'Capital, employment, investment, political influence, international connections',
          constraints: 'Economic pressures, currency volatility, government regulation, labor costs',
          likelyMoves: 'Lobby for business-friendly policies, seek government support, invest in growth sectors, manage currency risks',
          dealability: 'High — business is pragmatic and aligned with growth agenda.',
        },
        {
          name: 'Kurdish Communities & PKK',
          interests: 'Protect Kurdish rights, achieve autonomy or independence, resist government repression, maintain PKK operations',
          resources: 'Grassroots mobilization, PKK military capability, international advocacy, diaspora support',
          constraints: 'Government repression, military operations, limited institutional power, international isolation of PKK',
          likelyMoves: 'Organize political movements, conduct PKK operations, advocate for Kurdish rights, resist government policies',
          dealability: 'Low — Kurdish communities face repression and PKK is designated terrorist organization.',
        },
      ],
      external: [
        {
          name: 'United States & NATO',
          interests: 'Maintain Turkey as NATO ally, counter Russian influence, ensure regional stability, support democracy',
          resources: 'Military alliance, security guarantees, military support, diplomatic leverage, development aid',
          constraints: 'Turkey\'s pragmatic Russia engagement, authoritarian drift, regional tensions, NATO constraints',
          likelyMoves: 'Maintain military partnership, pressure on democracy and human rights, support against PKK, coordinate on NATO issues',
          dealability: 'Medium-High — Turkey values NATO partnership but maintains independent foreign policy.',
        },
        {
          name: 'Russia',
          interests: 'Maintain Turkey as pragmatic partner, expand economic influence, counter NATO influence, secure energy markets',
          resources: 'Energy supply, capital investment, military cooperation, diplomatic leverage',
          constraints: 'NATO membership, US pressure, regional tensions, energy diversification',
          likelyMoves: 'Maintain energy supply, expand economic engagement, coordinate on Syria and Middle East, counter NATO influence',
          dealability: 'Medium — Turkey will maintain pragmatic engagement with Russia while balancing NATO.',
        },
        {
          name: 'European Union',
          interests: 'Maintain Turkey as strategic partner, support democracy and human rights, manage migration, ensure regional stability',
          resources: 'Trade access, investment, diplomatic leverage, development aid',
          constraints: 'Turkey\'s authoritarian drift, Cyprus dispute, migration issues, limited economic weight',
          likelyMoves: 'Maintain trade and investment, pressure on democracy and human rights, manage migration, coordinate on regional issues',
          dealability: 'Medium — EU seeks partnership but faces tensions over democracy and human rights.',
        },
        {
          name: 'Middle East Partners (Syria, Iraq, Gulf States)',
          interests: 'Manage Turkey\'s regional influence, counter PKK, manage refugee flows, ensure regional stability',
          resources: 'Regional influence, military capability, energy partnerships, diplomatic forums',
          constraints: 'Turkey\'s military operations, PKK issue, competing interests, regional tensions',
          likelyMoves: 'Engage on Syria and Iraq issues, manage refugee flows, coordinate on security, balance Turkish influence',
          dealability: 'Medium — Middle East partners will engage on regional issues but face tensions.',
        },
        {
          name: 'Greece & Cyprus',
          interests: 'Resolve maritime disputes, manage Cyprus issue, ensure regional stability, counter Turkish assertiveness',
          resources: 'EU membership, NATO partnership, international law, diplomatic forums',
          constraints: 'Turkey\'s military capability, NATO membership, historical disputes',
          likelyMoves: 'Pursue maritime dispute resolution, advocate for Cyprus reunification, coordinate with EU and NATO',
          dealability: 'Low-Medium — historical disputes and competing interests limit cooperation.',
        },
      ],
    },
    risks: [
      {
        title: 'Currency Crisis & Capital Flight',
        trigger: 'Rapid lira depreciation or capital outflows due to economic pressures and political uncertainty',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '6-18 months',
        leadingIndicators: 'Currency movements, capital flows, inflation trends, interest rate differentials, foreign exchange reserves',
        mitigants: 'Central bank intervention, monetary policy tightening, capital controls, IMF support',
        lastAssessed: 'April 2026',
      },
      {
        title: 'Syria Instability or Refugee Crisis Escalation',
        trigger: 'Major Syria instability or refugee crisis escalation overwhelming Turkey\'s capacity',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '6-18 months',
        leadingIndicators: 'Syria developments, refugee flows, humanitarian indicators, military operations',
        mitigants: 'International humanitarian assistance, border security, military operations, diplomatic engagement',
        lastAssessed: 'April 2026',
      },
      {
        title: 'NATO Tensions or Ukraine Policy Shift',
        trigger: 'NATO tensions or major shift in Ukraine policy affecting Turkey\'s security relationships',
        probability: 'Low',
        impact: 'High',
        timeHorizon: '6-18 months',
        leadingIndicators: 'NATO relations, Ukraine developments, US-Turkey relations, Russian engagement',
        mitigants: 'Diplomatic engagement, NATO coordination, balanced foreign policy, US partnership',
        lastAssessed: 'April 2026',
      },
      {
        title: 'Political Succession Crisis',
        trigger: 'Succession crisis or political instability following Erdoğan or major policy shift',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '12-24 months',
        leadingIndicators: 'Erdoğan health, succession planning, AKP internal dynamics, opposition activity',
        mitigants: 'Constitutional mechanisms, AKP discipline, military loyalty, international support',
        lastAssessed: 'April 2026',
      },
      {
        title: 'PKK Terrorism Escalation',
        trigger: 'Major PKK terrorist attack or escalation of PKK operations',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '6-12 months',
        leadingIndicators: 'PKK activity, terrorist attacks, military operations, border security incidents',
        mitigants: 'Military and police operations, border security, international cooperation, intelligence',
        lastAssessed: 'April 2026',
      },
      {
        title: 'Eastern Mediterranean Conflict',
        trigger: 'Military confrontation in Eastern Mediterranean over maritime disputes or energy resources',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '6-18 months',
        leadingIndicators: 'Maritime incidents, energy exploration activities, diplomatic tensions, military movements',
        mitigants: 'Diplomatic engagement, NATO coordination, international law, conflict resolution mechanisms',
        lastAssessed: 'April 2026',
      },
    ],
    sources: [
      {
        name: 'Central Bank of Turkey (CBRT)',
        url: 'https://www.tcmb.gov.tr',
        desc: 'Official central bank data on monetary policy, inflation, exchange rates, financial stability',
      },
      {
        name: 'Turkish Statistics Institute (TURKSTAT)',
        url: 'https://www.turkstat.gov.tr',
        desc: 'National statistics — GDP, employment, trade, inflation, population data',
      },
      {
        name: 'IMF Turkey Article IV Consultation',
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
        desc: 'Real-time conflict and violence data tracking PKK activity and security incidents',
      },
      {
        name: 'Freedom House Turkey Report',
        url: 'https://freedomhouse.org',
        desc: 'Assessment of political rights, civil liberties, press freedom in Turkey',
      },
      {
        name: 'OSCE (Organization for Security and Co-operation in Europe)',
        url: 'https://www.osce.org',
        desc: 'Regional security monitoring and analysis',
      },
      {
        name: 'Turkish Media & International Coverage',
        url: 'https://www.hurriyet.com.tr',
        desc: 'Media coverage of Turkey politics, economics, and regional affairs',
      },
    ],
  },
  fr: {
    executiveSnapshot: [
      'Type de régime : Système présidentiel avec dérive autoritaire. Le président Recep Tayyip Erdoğan détient le pouvoir exécutif concentré (depuis 2003 en tant que PM, 2014 en tant que président). Le Parlement existe mais est dominé par le Parti de la justice et du développement (AKP) d\'Erdoğan. Les normes démocratiques s\'affaiblissent — la liberté de la presse est limitée, l\'opposition est supprimée. La société civile est limitée. L\'armée est subordonnée au gouvernement civil mais conserve le pouvoir institutionnel.',
      'Équilibre politique : Erdoğan maintient un contrôle politique fort par la dominance de l\'AKP et le leadership personnaliste. Les partis d\'opposition sont fragmentés et affaiblis. L\'armée a été subordonnée au contrôle civil mais conserve l\'influence institutionnelle. La société civile est limitée par la pression gouvernementale. La stabilité politique est modérée mais dépend de la dominance continue d\'Erdoğan. La planification de la succession est opaque.',
      'Modèle économique : Économie à revenu intermédiaire supérieur (PIB de 1,1 billion de dollars). Économie diversifiée avec fabrication, services, tourisme et agriculture. Cependant, l\'inflation est élevée et la devise est sous pression. Les vulnérabilités externes incluent les déficits du compte courant et la dette étrangère. L\'inégalité est modérée. Les dépenses sociales sont importantes mais les pressions budgétaires augmentent.',
      'Top 3 risques (6–18 mois) : (1) Crise des devises ou fuite des capitaux en raison des pressions économiques ; (2) Instabilité en Syrie ou escalade de la crise des réfugiés ; (3) Tensions de l\'OTAN ou changements de politique sur l\'Ukraine affectant les relations de sécurité.',
      'Top 3 éléments de surveillance (4–12 semaines) : (1) Tendances des devises et de l\'inflation ; (2) Développements en Syrie et flux de réfugiés ; (3) Relations de l\'OTAN et politique sur l\'Ukraine.',
      'Dépendances externes : Le tourisme représente ~4% du PIB mais est critique pour les devises étrangères. Les transferts de fonds sont importants (~10 milliards de dollars annuellement). Les importations d\'énergie sont critiques — dépendantes du gaz russe (bien que diversifiées). Les exportations sont diversifiées mais vulnérables à la demande mondiale. L\'investissement direct étranger est important pour la croissance.',
      'Posture de sécurité : Membre de l\'OTAN avec une capacité militaire importante. Fait face à des défis de sécurité intérieure du terrorisme du PKK et du séparatisme kurde. Opérations militaires actives en Syrie et en Irak. Préoccupations concernant la sécurité des frontières avec la Syrie et l\'Irak. La menace du terrorisme est modérée. L\'armée est professionnelle et loyale au gouvernement civil. Les dépenses de défense sont ~2,5% du PIB.',
      'Orientation diplomatique : Membre de l\'OTAN mais maintient un engagement pragmatique avec la Russie et le Moyen-Orient. Pont stratégique entre l\'Europe et le Moyen-Orient. Actif en Syrie et en Irak. Équilibre les liens occidentaux avec l\'engagement russe. Cherche l\'influence régionale et la sécurité énergétique. De plus en plus affirmé dans les différends de la Méditerranée orientale et de la mer Égée.',
      'Confiance des données : Moyen-Élevé — la Turquie publie des données macroéconomiques mais les données politiques/sécurité sont moins transparentes. La liberté de la presse est limitée. La capacité institutionnelle est modérée.',
      'Perspective de base : Stable mais sous pression économique et politique. Erdoğan maintiendra probablement le contrôle mais fait face à des défis économiques. Les tensions régionales persisteront. La relation de l\'OTAN restera importante mais tendue. Le défi clé est de gérer les pressions économiques tout en maintenant le contrôle politique et l\'influence régionale.',
    ],
    political: {
      powerStructure: 'Le président Recep Tayyip Erdoğan détient le pouvoir exécutif concentré. Le Parlement (Assemblée nationale du Grand) a 600 sièges dominés par l\'AKP. La magistrature est subordonnée au pouvoir exécutif — l\'indépendance est compromise. L\'armée est subordonnée au gouvernement civil mais conserve l\'influence institutionnelle. Les gouvernements locaux ont une certaine autonomie mais sont souvent contrôlés par l\'AKP. La fonction publique est politisée.',
      stabilityDrivers: 'La légitimité repose sur le leadership personnaliste d\'Erdoğan, la dominance de l\'AKP et la performance économique (bien que maintenant en déclin). L\'armée est loyale au gouvernement civil. La fonction publique met en œuvre les directives gouvernementales. Cependant, l\'opposition est fragmentée et affaiblie. La société civile est limitée. Les normes démocratiques s\'affaiblissent.',
      shockAbsorbers: 'Amortisseurs : Appareil militaire et de sécurité fort. Économie diversifiée avec fabrication et services. Le tourisme et les transferts de fonds fournissent des devises étrangères. L\'adhésion à l\'OTAN fournit une garantie de sécurité. Accélérateurs : La crise des devises ou la fuite des capitaux déclencheraient une crise économique. L\'instabilité majeure en Syrie ou la crise des réfugiés dépasseraient la capacité. Les tensions de l\'OTAN ou le changement de politique sur l\'Ukraine créeraient une crise de sécurité. La crise politique intérieure ou la lutte de succession déstabiliseraient le gouvernement.',
    },
    economy: {
      macroReality: 'La croissance du PIB est prévue à 2-3% pour 2025-2026 (FMI) — modérée mais en dessous des moyennes historiques. L\'inflation est projetée à ~15% (élevée et au-dessus de la cible). Le déficit budgétaire est projeté à ~2% du PIB (gérable mais en hausse). La dette publique s\'élève à ~35% du PIB (gérable). La livre turque s\'est dépréciée ~15% par rapport au dollar américain depuis fin 2024 en raison des sorties de capitaux et des pressions d\'inflation. Le chômage est ~9% (élevé). La pauvreté reste à ~15% de la population.',
      externalVulnerability: 'La Turquie fait face à des vulnérabilités externes importantes. Le déficit du compte courant est projeté à ~5% du PIB (faiblesse structurelle). La dette étrangère est ~50% du PIB (gérable mais en hausse). Le tourisme représente ~4% du PIB mais est critique pour les devises étrangères. Les transferts de fonds sont importants (~10 milliards de dollars annuellement). Les importations d\'énergie sont critiques — dépendantes du gaz russe (bien que diversifiées). Les exportations sont diversifiées mais vulnérables à la demande mondiale. La fuite des capitaux est une préoccupation en raison des pressions sur les devises.',
      politicalEconomy: 'L\'agenda économique du gouvernement privilégie la croissance, l\'emploi et l\'investissement dans les infrastructures. Cependant, l\'inflation et les pressions sur les devises limitent l\'espace politique. Le gouvernement poursuit la diversification énergétique loin du gaz russe. Le développement du tourisme est une priorité. Cependant, l\'incertitude politique et les pressions sur les devises découragent l\'investissement étranger. Les réformes du marché du travail sont limitées en raison de la pression des syndicats. Les entreprises d\'État restent dominantes dans les secteurs clés.',
    },
    security: {
      internal: 'Les défis de sécurité intérieure incluent le terrorisme du PKK et le séparatisme kurde. La menace du terrorisme est modérée — le PKK mène des attaques périodiques. Le gouvernement mène des opérations militaires contre le PKK en Turquie, en Syrie et en Irak. La sécurité des frontières est une priorité. La violence des gangs et la criminalité organisée sont présentes mais pas généralisées. La police et l\'armée sont professionnelles et loyales au gouvernement. Les libertés civiles sont limitées — la liberté de la presse est limitée, l\'opposition est supprimée.',
      diplomacy: 'La Turquie est membre de l\'OTAN mais maintient un engagement pragmatique avec la Russie et le Moyen-Orient. Active en Syrie et en Irak avec des opérations militaires. Équilibre les liens occidentaux avec l\'engagement russe (dépendance énergétique). Cherche l\'influence régionale dans la Méditerranée orientale et la mer Égée. Différends avec la Grèce sur les frontières maritimes et Chypre. De plus en plus affirmée dans les affaires régionales. Les relations avec les États-Unis sont tendues mais restent importantes.',
    },
    actors: {
      domestic: [
        {
          name: 'Président Recep Tayyip Erdoğan et AKP',
          interests: 'Maintenir le contrôle politique, assurer la croissance économique, gérer la succession, consolider le pouvoir, maintenir l\'influence régionale',
          resources: 'Autorité présidentielle, dominance de l\'AKP, machine gouvernementale, loyauté militaire, contrôle des médias',
          constraints: 'Pressions économiques, fragmentation de l\'opposition, contraintes de l\'OTAN, tensions régionales, incertitude de succession',
          likelyMoves: 'Maintenir l\'accent sur la croissance économique, gérer la planification de la succession, équilibrer les relations de l\'OTAN avec l\'engagement régional, contrôler l\'opposition',
          dealability: 'Moyen — Erdoğan est pragmatique sur les questions économiques mais inflexible sur le contrôle politique.',
        },
        {
          name: 'Partis d\'opposition et société civile',
          interests: 'Contester la dominance de l\'AKP, restaurer les normes démocratiques, répondre aux griefs économiques, protéger les libertés civiles',
          resources: 'Soutien électoral, réseaux de base, plaidoyer international, plateformes médiatiques',
          constraints: 'Dominance de l\'AKP, pression gouvernementale, fragmentation, pouvoir institutionnel limité',
          likelyMoves: 'Contester les politiques gouvernementales par les canaux électoraux et parlementaires, plaider pour les libertés civiles, organiser les protestations',
          dealability: 'Faible-Moyen — l\'opposition est fragmentée et fait face à la pression gouvernementale.',
        },
        {
          name: 'Armée et forces de sécurité',
          interests: 'Maintenir le pouvoir institutionnel, protéger la sécurité nationale, gérer la menace du PKK, maintenir le partenariat de l\'OTAN',
          resources: 'Capacité militaire, appareil de sécurité, expertise professionnelle, partenariat de l\'OTAN',
          constraints: 'Contrôle du gouvernement civil, contraintes budgétaires, menace du PKK, contraintes de l\'OTAN',
          likelyMoves: 'Mener les opérations de sécurité contre le PKK, maintenir le partenariat de l\'OTAN, gérer la sécurité des frontières, protéger les intérêts institutionnels',
          dealability: 'Moyen-Élevé — l\'armée est professionnelle et coopérera sur les questions de sécurité.',
        },
        {
          name: 'Secteur des affaires et secteur privé',
          interests: 'Maintenir les politiques favorables aux entreprises, assurer la croissance économique, protéger les intérêts commerciaux, attirer l\'investissement',
          resources: 'Capital, emploi, investissement, influence politique, connexions internationales',
          constraints: 'Pressions économiques, volatilité des devises, réglementation gouvernementale, coûts de main-d\'œuvre',
          likelyMoves: 'Faire du lobbying pour les politiques favorables aux entreprises, chercher le soutien gouvernemental, investir dans les secteurs de croissance, gérer les risques de devises',
          dealability: 'Élevé — les entreprises sont pragmatiques et alignées avec l\'agenda de croissance.',
        },
        {
          name: 'Communautés kurdes et PKK',
          interests: 'Protéger les droits kurdes, réaliser l\'autonomie ou l\'indépendance, résister à la répression gouvernementale, maintenir les opérations du PKK',
          resources: 'Mobilisation de base, capacité militaire du PKK, plaidoyer international, soutien de la diaspora',
          constraints: 'Répression gouvernementale, opérations militaires, pouvoir institutionnel limité, isolement international du PKK',
          likelyMoves: 'Organiser les mouvements politiques, mener les opérations du PKK, plaider pour les droits kurdes, résister aux politiques gouvernementales',
          dealability: 'Faible — les communautés kurdes font face à la répression et le PKK est désigné comme organisation terroriste.',
        },
      ],
      external: [
        {
          name: 'États-Unis et OTAN',
          interests: 'Maintenir la Turquie comme allié de l\'OTAN, contrer l\'influence russe, assurer la stabilité régionale, soutenir la démocratie',
          resources: 'Alliance militaire, garanties de sécurité, soutien militaire, levier diplomatique, aide au développement',
          constraints: 'Engagement pragmatique de la Turquie avec la Russie, dérive autoritaire, tensions régionales, contraintes de l\'OTAN',
          likelyMoves: 'Maintenir le partenariat militaire, faire pression sur la démocratie et les droits de l\'homme, soutenir contre le PKK, coordonner sur les questions de l\'OTAN',
          dealability: 'Moyen-Élevé — la Turquie valorise le partenariat de l\'OTAN mais maintient une politique étrangère indépendante.',
        },
        {
          name: 'Russie',
          interests: 'Maintenir la Turquie comme partenaire pragmatique, élargir l\'influence économique, contrer l\'influence de l\'OTAN, sécuriser les marchés énergétiques',
          resources: 'Approvisionnement énergétique, investissement en capital, coopération militaire, levier diplomatique',
          constraints: 'Adhésion à l\'OTAN, pression des États-Unis, tensions régionales, diversification énergétique',
          likelyMoves: 'Maintenir l\'approvisionnement énergétique, élargir l\'engagement économique, coordonner sur la Syrie et le Moyen-Orient, contrer l\'influence de l\'OTAN',
          dealability: 'Moyen — la Turquie maintiendra l\'engagement pragmatique avec la Russie tout en équilibrant l\'OTAN.',
        },
        {
          name: 'Union européenne',
          interests: 'Maintenir la Turquie comme partenaire stratégique, soutenir la démocratie et les droits de l\'homme, gérer la migration, assurer la stabilité régionale',
          resources: 'Accès commercial, investissement, levier diplomatique, aide au développement',
          constraints: 'Dérive autoritaire de la Turquie, différend de Chypre, questions de migration, poids économique limité',
          likelyMoves: 'Maintenir le commerce et l\'investissement, faire pression sur la démocratie et les droits de l\'homme, gérer la migration, coordonner sur les questions régionales',
          dealability: 'Moyen — l\'UE cherche le partenariat mais fait face à des tensions sur la démocratie et les droits de l\'homme.',
        },
        {
          name: 'Partenaires du Moyen-Orient (Syrie, Irak, États du Golfe)',
          interests: 'Gérer l\'influence régionale de la Turquie, contrer le PKK, gérer les flux de réfugiés, assurer la stabilité régionale',
          resources: 'Influence régionale, capacité militaire, partenariats énergétiques, forums diplomatiques',
          constraints: 'Opérations militaires de la Turquie, question du PKK, intérêts concurrents, tensions régionales',
          likelyMoves: 'S\'engager sur les questions de la Syrie et de l\'Irak, gérer les flux de réfugiés, coordonner sur la sécurité, équilibrer l\'influence turque',
          dealability: 'Moyen — les partenaires du Moyen-Orient s\'engageront sur les questions régionales mais font face à des tensions.',
        },
        {
          name: 'Grèce et Chypre',
          interests: 'Résoudre les différends maritimes, gérer la question de Chypre, assurer la stabilité régionale, contrer l\'affirmation turque',
          resources: 'Adhésion à l\'UE, partenariat de l\'OTAN, droit international, forums diplomatiques',
          constraints: 'Capacité militaire de la Turquie, adhésion à l\'OTAN, différends historiques',
          likelyMoves: 'Poursuivre la résolution des différends maritimes, plaider pour la réunification de Chypre, coordonner avec l\'UE et l\'OTAN',
          dealability: 'Faible-Moyen — les différends historiques et les intérêts concurrents limitent la coopération.',
        },
      ],
    },
    risks: [
      {
        title: 'Crise des devises et fuite des capitaux',
        trigger: 'Dépréciation rapide de la livre ou sorties de capitaux dues aux pressions économiques et à l\'incertitude politique',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '6-18 mois',
        leadingIndicators: 'Mouvements des devises, flux de capitaux, tendances d\'inflation, différentiels de taux d\'intérêt, réserves de change',
        mitigants: 'Intervention de la banque centrale, resserrement de la politique monétaire, contrôles de capitaux, soutien du FMI',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Instabilité en Syrie ou escalade de la crise des réfugiés',
        trigger: 'Instabilité majeure en Syrie ou escalade de la crise des réfugiés dépassant la capacité de la Turquie',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '6-18 mois',
        leadingIndicators: 'Développements en Syrie, flux de réfugiés, indicateurs humanitaires, opérations militaires',
        mitigants: 'Assistance humanitaire internationale, sécurité des frontières, opérations militaires, engagement diplomatique',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Tensions de l\'OTAN ou changement de politique sur l\'Ukraine',
        trigger: 'Tensions de l\'OTAN ou changement majeur de politique sur l\'Ukraine affectant les relations de sécurité de la Turquie',
        probability: 'Low',
        impact: 'High',
        timeHorizon: '6-18 mois',
        leadingIndicators: 'Relations de l\'OTAN, développements en Ukraine, relations États-Unis-Turquie, engagement russe',
        mitigants: 'Engagement diplomatique, coordination de l\'OTAN, politique étrangère équilibrée, partenariat américain',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Crise de succession politique',
        trigger: 'Crise de succession ou instabilité politique suite à Erdoğan ou changement majeur de politique',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '12-24 mois',
        leadingIndicators: 'Santé d\'Erdoğan, planification de succession, dynamique interne de l\'AKP, activité de l\'opposition',
        mitigants: 'Mécanismes constitutionnels, discipline de l\'AKP, loyauté militaire, soutien international',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Escalade du terrorisme du PKK',
        trigger: 'Attaque terroriste majeure du PKK ou escalade des opérations du PKK',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '6-12 mois',
        leadingIndicators: 'Activité du PKK, attaques terroristes, opérations militaires, incidents de sécurité des frontières',
        mitigants: 'Opérations militaires et policières, sécurité des frontières, coopération internationale, renseignement',
        lastAssessed: 'Avril 2026',
      },
      {
        title: 'Conflit en Méditerranée orientale',
        trigger: 'Confrontation militaire en Méditerranée orientale sur les différends maritimes ou les ressources énergétiques',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '6-18 mois',
        leadingIndicators: 'Incidents maritimes, activités d\'exploration énergétique, tensions diplomatiques, mouvements militaires',
        mitigants: 'Engagement diplomatique, coordination de l\'OTAN, droit international, mécanismes de résolution des conflits',
        lastAssessed: 'Avril 2026',
      },
    ],
    sources: [
      {
        name: 'Banque centrale de Turquie (CBRT)',
        url: 'https://www.tcmb.gov.tr',
        desc: 'Données officielles de la banque centrale sur la politique monétaire, l\'inflation, les taux de change, la stabilité financière',
      },
      {
        name: 'Institut turc de statistique (TURKSTAT)',
        url: 'https://www.turkstat.gov.tr',
        desc: 'Statistiques nationales — PIB, emploi, commerce, inflation, données démographiques',
      },
      {
        name: 'Consultation de l\'article IV du FMI sur la Turquie',
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
        desc: 'Données en temps réel sur les conflits et la violence suivant l\'activité du PKK et les incidents de sécurité',
      },
      {
        name: 'Rapport Turquie de Freedom House',
        url: 'https://freedomhouse.org',
        desc: 'Évaluation des droits politiques, des libertés civiles, de la liberté de la presse en Turquie',
      },
      {
        name: 'OSCE (Organisation pour la sécurité et la coopération en Europe)',
        url: 'https://www.osce.org',
        desc: 'Surveillance et analyse de la sécurité régionale',
      },
      {
        name: 'Médias turcs et couverture internationale',
        url: 'https://www.hurriyet.com.tr',
        desc: 'Couverture médiatique de la politique, de l\'économie et des affaires régionales de la Turquie',
      },
    ],
  },
};
