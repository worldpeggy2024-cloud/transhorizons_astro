/*
 * TransHorizons — Ukraine Country Analysis Data
 * Full bilingual content following the Country Situation Report framework
 * Last updated: April 2026
 * Sources: National Bank of Ukraine, State Statistics Service, ACLED, Human Rights Watch, International Crisis Group, SIPRI
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

export const ukraineAnalysis: AnalysisContent = {
  lastUpdated: '2026-04-15',
  scorecard: {
    eliteCohesion: 'High',
    securityLoyalty: 'High',
    economicPressure: 'High',
    protestCapacity: 'Med',
    institutionalResilience: 'Med',
  },
  en: {
    executiveSnapshot: [
      'Regime type: Presidential republic under martial law. President Volodymyr Zelensky (in office since 2019) leads government with strong executive authority. Parliament (Verkhovna Rada) suspended normal operations; governance by decree during wartime.',
      'Political equilibrium: National unity government with all major parties supporting war effort. Zelensky maintains high approval ratings (70-80%) due to wartime leadership. No domestic political opposition to NATO/Western alignment. Military leadership (General Zaluzhny) holds significant influence.',
      'Economic model: War economy — GDP collapsed ~35% (2022-2023), now stabilizing. Agriculture and energy exports critical for survival. Massive reconstruction needs (~$500B+). Dependent on Western military and financial aid ($100B+ annually).',
      'Top 3 risks (6–18 months): (1) Military stalemate or Russian breakthrough leading to territorial loss; (2) Western aid fatigue or reduction; (3) Humanitarian catastrophe from infrastructure destruction.',
      'Top 3 watch items (4–12 weeks): (1) Russian offensive operations (Pokrovsk direction); (2) Western military aid delivery (F-16s, air defense); (3) Humanitarian situation (winter heating, displacement).',
      'External dependencies: 100% dependent on Western military aid (US, EU, UK, Poland). Financial aid critical for government operations and reconstruction. NATO security guarantees sought but not yet formalized. Energy imports from EU.',
      'Security posture: Active warfare — defending against Russian invasion. Military mobilization ongoing. Territorial losses (Crimea, parts of Donetsk/Luhansk/Zaporizhzhia/Kherson). Defensive posture with limited offensive capacity.',
      'Diplomatic orientation: Fully aligned with West (NATO, EU, G7). Seeking NATO membership and EU accession. Zelensky pursuing "Victory Plan" for territorial restoration. No negotiations with Russia under current conditions.',
      'Data confidence: Medium — Wartime conditions limit data availability. ACLED provides conflict data; international organizations provide humanitarian assessments.',
      'Baseline outlook: Protracted conflict through 2026-2027. Military stalemate likely unless major aid increase or Russian collapse. Reconstruction planning underway but dependent on war outcome. NATO membership increasingly likely post-war.',
    ],
    political: {
      powerStructure: 'President Zelensky exercises broad executive authority under martial law. Parliament (Verkhovna Rada) meets but with limited legislative function — most governance by presidential decree. Military leadership (General Zaluzhny, General Syrsky) holds significant influence over war strategy. Security services (SBU) report to president. Local governments maintain some autonomy but subordinate to wartime priorities. No independent judiciary functioning during martial law.',
      stabilityDrivers: 'National unity around war effort and Western alignment. Zelensky\'s personal leadership and popularity. Military effectiveness and soldier morale. International support (military, financial, diplomatic). Resistance to Russian occupation in liberated territories.',
      shockAbsorbers: 'Western military aid and financial support. NATO/EU institutional support. Diaspora networks and remittances. International humanitarian assistance. Territorial defense capabilities.',
    },
    economy: {
      macroReality: 'War economy — GDP contracted ~35% (2022-2023), now stabilizing at ~-2% to +2% range (2024-2025). Inflation high (15-20%). Unemployment low (conscription/emigration). Agriculture exports critical (~$40B pre-war, now ~$10B). Energy sector destroyed in many regions. Reconstruction needs estimated $500B+.',
      externalVulnerability: '100% dependent on Western military aid ($100B+ annually). Financial aid critical for government operations (~$40B annually from IMF/World Bank/bilateral). Energy imports from EU (gas, electricity). Food security dependent on agricultural exports. No domestic investment capacity during war.',
      politicalEconomy: 'Wartime fiscal priorities — defense spending ~50% of budget. Reconstruction planning underway but dependent on war outcome. EU/IMF conditions for post-war recovery. Land reform and privatization deferred. Currency (hryvnia) supported by central bank with Western backing.',
    },
    security: {
      internal: 'Active warfare across multiple fronts. Territorial occupation in Donetsk, Luhansk, Zaporizhzhia, Kherson. Civilian casualties and displacement (10M+ internally displaced). Infrastructure destruction (energy, water, transport). Mines and unexploded ordnance widespread. Humanitarian crisis in occupied territories.',
      diplomacy: 'Fully aligned with NATO and EU. Seeking NATO membership (Article 5 equivalent during war). EU accession process ongoing. Zelensky pursuing "Victory Plan" for territorial restoration. No negotiations with Russia under current conditions. Strong partnerships with Poland, UK, US, Canada.',
    },
    actors: {
      domestic: [
        {
          name: 'Volodymyr Zelensky / Presidential Administration',
          interests: 'Victory over Russia, territorial restoration, NATO/EU membership, post-war reconstruction',
          resources: 'Presidential authority, military command, international support, popular legitimacy',
          constraints: 'Military limitations, Western aid dependency, reconstruction costs, war fatigue risk',
          likelyMoves: 'Pursue military operations, seek increased Western aid, plan reconstruction',
          dealability: 'Very High with West; Zero with Russia',
        },
        {
          name: 'Military Leadership (Zaluzhny, Syrsky)',
          interests: 'Military victory, territorial defense, force modernization, NATO partnership',
          resources: 'Armed forces (1M+ personnel), combat experience, Western military support',
          constraints: 'Manpower shortages, equipment losses, Russian numerical advantage',
          likelyMoves: 'Conduct defensive operations, request advanced weapons, coordinate with NATO',
          dealability: 'Very High with West; Zero with Russia',
        },
        {
          name: 'Parliament / Political Parties',
          interests: 'National unity, war support, post-war governance, NATO/EU integration',
          resources: 'Legislative authority (limited during martial law), political legitimacy',
          constraints: 'Subordinate to executive during wartime, limited legislative function',
          likelyMoves: 'Support war effort, plan post-war governance, coordinate with EU/NATO',
          dealability: 'High with West; Zero with Russia',
        },
        {
          name: 'Civil Society / Humanitarian Organizations',
          interests: 'Civilian protection, humanitarian aid, post-war reconstruction, justice',
          resources: 'International networks, humanitarian expertise, public mobilization',
          constraints: 'Limited resources, security constraints, displacement challenges',
          likelyMoves: 'Provide humanitarian assistance, document war crimes, plan reconstruction',
          dealability: 'High with West; Low in occupied territories',
        },
        {
          name: 'Business / Private Sector',
          interests: 'Survival, post-war reconstruction, EU/NATO integration',
          resources: 'Economic expertise, reconstruction capacity, international connections',
          constraints: 'Asset destruction, capital flight, operational limitations',
          likelyMoves: 'Plan reconstruction projects, seek international investment, integrate with EU',
          dealability: 'High with West; Zero with Russia',
        },
      ],
      external: [
        {
          name: 'United States',
          interests: 'Ukraine victory, Russia containment, NATO strengthening, European stability',
          resources: 'Military aid ($100B+), financial support, diplomatic influence, NATO command',
          constraints: 'Domestic political debate, fiscal constraints, war fatigue risk',
          likelyMoves: 'Provide military aid, coordinate NATO response, support reconstruction planning',
          dealability: 'Very High',
        },
        {
          name: 'European Union',
          interests: 'Ukraine victory, EU accession, reconstruction, energy security',
          resources: 'Financial aid ($40B+), EU accession framework, market access',
          constraints: 'Internal divisions, fiscal pressures, energy security concerns',
          likelyMoves: 'Provide financial support, advance EU accession, coordinate reconstruction',
          dealability: 'Very High',
        },
        {
          name: 'NATO',
          interests: 'Ukraine victory, NATO expansion, Russia containment, European security',
          resources: 'Military coordination, intelligence sharing, Article 5 framework',
          constraints: 'Nuclear-armed Russia, escalation risks, member state divisions',
          likelyMoves: 'Coordinate military support, plan NATO membership, strengthen deterrence',
          dealability: 'Very High',
        },
        {
          name: 'Poland',
          interests: 'Ukraine victory, refugee hosting, NATO strengthening, regional stability',
          resources: 'Military aid, refugee hosting (1M+), NATO coordination, border security',
          constraints: 'Refugee burden, energy security, fiscal pressures',
          likelyMoves: 'Continue military aid, host refugees, coordinate NATO response',
          dealability: 'Very High',
        },
        {
          name: 'Russia',
          interests: 'Territorial conquest, NATO containment, sphere of influence restoration',
          resources: 'Military power, nuclear weapons, energy leverage (reduced), disinformation',
          constraints: 'War costs, sanctions, military losses, NATO deterrence',
          likelyMoves: 'Continue military operations, seek negotiated settlement, pursue disinformation',
          dealability: 'Very Low',
        },
      ],
    },
    risks: [
      {
        title: 'Military Stalemate or Russian Breakthrough',
        trigger: 'Russian offensive success, Ukrainian defensive collapse, territorial loss',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '6-18 months',
        leadingIndicators: 'Front line movements, casualty rates, equipment losses, morale indicators',
        mitigants: 'Western military aid, NATO coordination, Ukrainian military effectiveness, Russian constraints',
      },
      {
        title: 'Western Aid Fatigue or Reduction',
        trigger: 'US political change, EU fiscal constraints, war fatigue, competing priorities',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '6-24 months',
        leadingIndicators: 'US political rhetoric, EU budget discussions, media coverage, public opinion',
        mitigants: 'Ukraine diplomatic efforts, NATO commitment, European security concerns',
      },
      {
        title: 'Humanitarian Catastrophe',
        trigger: 'Infrastructure destruction, winter heating crisis, displacement surge, disease outbreak',
        probability: 'High',
        impact: 'High',
        timeHorizon: '4-12 months',
        leadingIndicators: 'Infrastructure damage, displacement figures, humanitarian needs assessments',
        mitigants: 'International humanitarian aid, EU support, reconstruction planning',
      },
      {
        title: 'Escalation to NATO Involvement',
        trigger: 'NATO air operations, direct NATO military involvement, nuclear escalation',
        probability: 'Low',
        impact: 'High',
        timeHorizon: '12-36 months',
        leadingIndicators: 'NATO military movements, Russian threats, escalation rhetoric',
        mitigants: 'Diplomatic channels, nuclear deterrence, NATO restraint',
      },
      {
        title: 'Economic Collapse',
        trigger: 'Currency collapse, hyperinflation, banking system failure, fiscal crisis',
        probability: 'Low',
        impact: 'High',
        timeHorizon: '12-24 months',
        leadingIndicators: 'Inflation rates, currency movements, fiscal deficit, IMF assessments',
        mitigants: 'Western financial support, IMF programs, central bank management',
      },
      {
        title: 'Post-War Reconstruction Failure',
        trigger: 'Insufficient international funding, governance challenges, corruption, political instability',
        probability: 'Med',
        impact: 'Med',
        timeHorizon: '24-36 months',
        leadingIndicators: 'Reconstruction planning, international pledges, governance assessments',
        mitigants: 'EU/NATO oversight, international coordination, civil society monitoring',
      },
    ],
    sources: [
      {
        name: 'National Bank of Ukraine',
        url: 'https://bank.gov.ua',
        desc: 'Monetary policy, inflation, currency, financial stability',
      },
      {
        name: 'State Statistics Service of Ukraine',
        url: 'https://ukrstat.gov.ua',
        desc: 'Economic and demographic statistics',
      },
      {
        name: 'ACLED Conflict Data',
        url: 'https://acleddata.com',
        desc: 'Battle deaths, territorial control, conflict events',
      },
      {
        name: 'Human Rights Watch',
        url: 'https://hrw.org',
        desc: 'War crimes, humanitarian violations, civilian impact',
      },
      {
        name: 'International Crisis Group',
        url: 'https://crisisgroup.org',
        desc: 'Conflict analysis and peace prospects',
      },
      {
        name: 'SIPRI Military Expenditure Database',
        url: 'https://www.sipri.org',
        desc: 'Military spending and weapons transfers',
      },
      {
        name: 'UN Office for the Coordination of Humanitarian Affairs (OCHA)',
        url: 'https://www.unocha.org',
        desc: 'Humanitarian needs and displacement',
      },
      {
        name: 'Reuters / Associated Press',
        url: 'https://reuters.com',
        desc: 'Current events and breaking news',
      },
    ],
  },
  fr: {
    executiveSnapshot: [
      'Type de régime : République présidentielle sous loi martiale. Le président Volodymyr Zelensky (en fonction depuis 2019) dirige le gouvernement avec une autorité exécutive forte. Le Parlement (Verkhovna Rada) a suspendu les opérations normales ; gouvernance par décret en temps de guerre.',
      'Équilibre politique : Gouvernement d\'unité nationale avec tous les principaux partis soutenant l\'effort de guerre. Zelensky maintient des taux d\'approbation élevés (70-80%) en raison du leadership en temps de guerre. Pas d\'opposition politique intérieure à l\'alignement OTAN/Occidental. Le leadership militaire (Général Zaluzhny) exerce une influence significative.',
      'Modèle économique : Économie de guerre — le PIB s\'est effondré ~35% (2022-2023), se stabilisant maintenant. L\'agriculture et les exportations énergétiques sont critiques pour la survie. Besoins massifs de reconstruction (~500 milliards d\'euros+). Dépendant de l\'aide militaire et financière occidentale (100 milliards d\'euros+ annuels).',
      'Top 3 risques (6-18 mois) : (1) Impasse militaire ou percée russe menant à une perte territoriale ; (2) Fatigue de l\'aide occidentale ou réduction ; (3) Catastrophe humanitaire due à la destruction des infrastructures.',
      'Top 3 points de surveillance (4-12 semaines) : (1) Opérations offensives russes (direction Pokrovsk) ; (2) Livraison d\'aide militaire occidentale (F-16, défense aérienne) ; (3) Situation humanitaire (chauffage hivernal, déplacement).',
      'Dépendances externes : 100% dépendant de l\'aide militaire occidentale (États-Unis, UE, Royaume-Uni, Pologne). L\'aide financière est critique pour les opérations gouvernementales et la reconstruction. Les garanties de sécurité de l\'OTAN sont recherchées mais pas encore formalisées. Importations énergétiques de l\'UE.',
      'Posture de sécurité : Guerre active — défense contre l\'invasion russe. Mobilisation militaire en cours. Pertes territoriales (Crimée, parties de Donetsk/Luhansk/Zaporizhzhia/Kherson). Posture défensive avec capacité offensive limitée.',
      'Orientation diplomatique : Entièrement alignée avec l\'Occident (OTAN, UE, G7). Cherchant l\'adhésion à l\'OTAN et l\'accession à l\'UE. Zelensky poursuivant un \"Plan de victoire\" pour la restauration territoriale. Pas de négociations avec la Russie dans les conditions actuelles.',
      'Confiance dans les données : Moyenne — Les conditions de guerre limitent la disponibilité des données. ACLED fournit des données de conflit ; les organisations internationales fournissent des évaluations humanitaires.',
      'Perspective de base : Conflit prolongé jusqu\'en 2026-2027. L\'impasse militaire est probable à moins qu\'une augmentation majeure de l\'aide ou un effondrement russe. La planification de la reconstruction est en cours mais dépend du résultat de la guerre. L\'adhésion à l\'OTAN est de plus en plus probable après la guerre.',
    ],
    political: {
      powerStructure: 'Le président Zelensky exerce une large autorité exécutive sous la loi martiale. Le Parlement (Verkhovna Rada) se réunit mais avec une fonction législative limitée — la plupart de la gouvernance par décret présidentiel. Le leadership militaire (Général Zaluzhny, Général Syrsky) exerce une influence significative sur la stratégie de guerre. Les services de sécurité (SBU) rapportent au président. Les gouvernements locaux maintiennent une certaine autonomie mais sont subordonnés aux priorités de guerre. Pas de système judiciaire indépendant fonctionnant pendant la loi martiale.',
      stabilityDrivers: 'Unité nationale autour de l\'effort de guerre et de l\'alignement occidental. Leadership personnel et popularité de Zelensky. Efficacité militaire et moral des soldats. Soutien international (militaire, financier, diplomatique). Résistance à l\'occupation russe dans les territoires libérés.',
      shockAbsorbers: 'Aide militaire et soutien financier occidentaux. Soutien institutionnel OTAN/UE. Réseaux de diaspora et envois de fonds. Assistance humanitaire internationale. Capacités de défense territoriale.',
    },
    economy: {
      macroReality: 'Économie de guerre — le PIB s\'est contracté ~35% (2022-2023), se stabilisant maintenant à ~-2% à +2% (2024-2025). Inflation élevée (15-20%). Chômage faible (conscription/émigration). Les exportations agricoles sont critiques (~40 milliards d\'euros avant-guerre, maintenant ~10 milliards d\'euros). Le secteur énergétique est détruit dans de nombreuses régions. Les besoins de reconstruction sont estimés à 500 milliards d\'euros+.',
      externalVulnerability: '100% dépendant de l\'aide militaire occidentale (100 milliards d\'euros+ annuels). L\'aide financière est critique pour les opérations gouvernementales (~40 milliards d\'euros annuels du FMI/Banque mondiale/bilatéral). Importations énergétiques de l\'UE (gaz, électricité). La sécurité alimentaire dépend des exportations agricoles. Pas de capacité d\'investissement intérieur pendant la guerre.',
      politicalEconomy: 'Priorités budgétaires en temps de guerre — dépenses de défense ~50% du budget. Planification de la reconstruction en cours mais dépend du résultat de la guerre. Conditions UE/FMI pour la récupération après-guerre. Réforme foncière et privatisation reportées. Devise (hryvnia) soutenue par la banque centrale avec soutien occidental.',
    },
    security: {
      internal: 'Guerre active sur plusieurs fronts. Occupation territoriale à Donetsk, Luhansk, Zaporizhzhia, Kherson. Pertes civiles et déplacement (10M+ déplacés internes). Destruction des infrastructures (énergie, eau, transport). Mines et munitions non explosées généralisées. Crise humanitaire dans les territoires occupés.',
      diplomacy: 'Entièrement alignée avec l\'OTAN et l\'UE. Cherchant l\'adhésion à l\'OTAN (équivalent de l\'article 5 pendant la guerre). Le processus d\'accession à l\'UE est en cours. Zelensky poursuivant un \"Plan de victoire\" pour la restauration territoriale. Pas de négociations avec la Russie dans les conditions actuelles. Partenariats forts avec la Pologne, le Royaume-Uni, les États-Unis, le Canada.',
    },
    actors: {
      domestic: [
        {
          name: 'Volodymyr Zelensky / Administration présidentielle',
          interests: 'Victoire sur la Russie, restauration territoriale, adhésion OTAN/UE, reconstruction après-guerre',
          resources: 'Autorité présidentielle, commandement militaire, soutien international, légitimité populaire',
          constraints: 'Limitations militaires, dépendance à l\'aide occidentale, coûts de reconstruction, risque de fatigue de guerre',
          likelyMoves: 'Poursuivre les opérations militaires, chercher une aide occidentale accrue, planifier la reconstruction',
          dealability: 'Très élevée avec l\'Occident ; Zéro avec la Russie',
        },
        {
          name: 'Leadership militaire (Zaluzhny, Syrsky)',
          interests: 'Victoire militaire, défense territoriale, modernisation des forces, partenariat OTAN',
          resources: 'Forces armées (1M+ personnel), expérience au combat, soutien militaire occidental',
          constraints: 'Pénuries de main-d\'œuvre, pertes d\'équipement, avantage numérique russe',
          likelyMoves: 'Mener des opérations défensives, demander des armes avancées, coordonner avec l\'OTAN',
          dealability: 'Très élevée avec l\'Occident ; Zéro avec la Russie',
        },
        {
          name: 'Parlement / Partis politiques',
          interests: 'Unité nationale, soutien à la guerre, gouvernance après-guerre, intégration OTAN/UE',
          resources: 'Autorité législative (limitée pendant la loi martiale), légitimité politique',
          constraints: 'Subordonné à l\'exécutif en temps de guerre, fonction législative limitée',
          likelyMoves: 'Soutenir l\'effort de guerre, planifier la gouvernance après-guerre, coordonner avec l\'UE/OTAN',
          dealability: 'Élevée avec l\'Occident ; Zéro avec la Russie',
        },
        {
          name: 'Société civile / Organisations humanitaires',
          interests: 'Protection civile, aide humanitaire, reconstruction après-guerre, justice',
          resources: 'Réseaux internationaux, expertise humanitaire, mobilisation publique',
          constraints: 'Ressources limitées, contraintes de sécurité, défis de déplacement',
          likelyMoves: 'Fournir une assistance humanitaire, documenter les crimes de guerre, planifier la reconstruction',
          dealability: 'Élevée avec l\'Occident ; Faible dans les territoires occupés',
        },
        {
          name: 'Secteur commercial / Secteur privé',
          interests: 'Survie, reconstruction après-guerre, intégration OTAN/UE',
          resources: 'Expertise économique, capacité de reconstruction, connexions internationales',
          constraints: 'Destruction d\'actifs, fuite de capitaux, limitations opérationnelles',
          likelyMoves: 'Planifier les projets de reconstruction, chercher l\'investissement international, s\'intégrer à l\'UE',
          dealability: 'Élevée avec l\'Occident ; Zéro avec la Russie',
        },
      ],
      external: [
        {
          name: 'États-Unis',
          interests: 'Victoire de l\'Ukraine, confinement de la Russie, renforcement de l\'OTAN, stabilité européenne',
          resources: 'Aide militaire (100 milliards d\'euros+), soutien financier, influence diplomatique, commandement OTAN',
          constraints: 'Débat politique intérieur, contraintes budgétaires, risque de fatigue de guerre',
          likelyMoves: 'Fournir une aide militaire, coordonner la réponse de l\'OTAN, soutenir la planification de la reconstruction',
          dealability: 'Très élevée',
        },
        {
          name: 'Union européenne',
          interests: 'Victoire de l\'Ukraine, accession à l\'UE, reconstruction, sécurité énergétique',
          resources: 'Aide financière (40 milliards d\'euros+), cadre d\'accession à l\'UE, accès au marché',
          constraints: 'Divisions internes, pressions budgétaires, préoccupations concernant la sécurité énergétique',
          likelyMoves: 'Fournir un soutien financier, avancer l\'accession à l\'UE, coordonner la reconstruction',
          dealability: 'Très élevée',
        },
        {
          name: 'OTAN',
          interests: 'Victoire de l\'Ukraine, expansion de l\'OTAN, confinement de la Russie, sécurité européenne',
          resources: 'Coordination militaire, partage du renseignement, cadre de l\'article 5',
          constraints: 'Russie armée nucléairement, risques d\'escalade, divisions entre États membres',
          likelyMoves: 'Coordonner le soutien militaire, planifier l\'adhésion à l\'OTAN, renforcer la dissuasion',
          dealability: 'Très élevée',
        },
        {
          name: 'Pologne',
          interests: 'Victoire de l\'Ukraine, accueil des réfugiés, renforcement de l\'OTAN, stabilité régionale',
          resources: 'Aide militaire, accueil des réfugiés (1M+), coordination de l\'OTAN, sécurité des frontières',
          constraints: 'Charge des réfugiés, sécurité énergétique, pressions budgétaires',
          likelyMoves: 'Continuer l\'aide militaire, accueillir les réfugiés, coordonner la réponse de l\'OTAN',
          dealability: 'Très élevée',
        },
        {
          name: 'Russie',
          interests: 'Conquête territoriale, confinement de l\'OTAN, restauration de la sphère d\'influence',
          resources: 'Puissance militaire, armes nucléaires, effet de levier énergétique (réduit), désinformation',
          constraints: 'Coûts de la guerre, sanctions, pertes militaires, dissuasion de l\'OTAN',
          likelyMoves: 'Continuer les opérations militaires, chercher un règlement négocié, poursuivre la désinformation',
          dealability: 'Très faible',
        },
      ],
    },
    risks: [
      {
        title: 'Impasse militaire ou percée russe',
        trigger: 'Succès offensif russe, effondrement défensif ukrainien, perte territoriale',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '6-18 mois',
        leadingIndicators: 'Mouvements de la ligne de front, taux de pertes, pertes d\'équipement, indicateurs de moral',
        mitigants: 'Aide militaire occidentale, coordination OTAN, efficacité militaire ukrainienne, contraintes russes',
      },
      {
        title: 'Fatigue de l\'aide occidentale ou réduction',
        trigger: 'Changement politique américain, contraintes budgétaires de l\'UE, fatigue de guerre, priorités concurrentes',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '6-24 mois',
        leadingIndicators: 'Rhétorique politique américaine, discussions budgétaires de l\'UE, couverture médiatique, opinion publique',
        mitigants: 'Efforts diplomatiques de l\'Ukraine, engagement de l\'OTAN, préoccupations concernant la sécurité européenne',
      },
      {
        title: 'Catastrophe humanitaire',
        trigger: 'Destruction des infrastructures, crise du chauffage hivernal, augmentation du déplacement, épidémie',
        probability: 'High',
        impact: 'High',
        timeHorizon: '4-12 mois',
        leadingIndicators: 'Dégâts aux infrastructures, chiffres de déplacement, évaluations des besoins humanitaires',
        mitigants: 'Aide humanitaire internationale, soutien de l\'UE, planification de la reconstruction',
      },
      {
        title: 'Escalade vers l\'implication de l\'OTAN',
        trigger: 'Opérations aériennes de l\'OTAN, implication militaire directe de l\'OTAN, escalade nucléaire',
        probability: 'Low',
        impact: 'High',
        timeHorizon: '12-36 mois',
        leadingIndicators: 'Mouvements militaires de l\'OTAN, menaces russes, rhétorique d\'escalade',
        mitigants: 'Canaux diplomatiques, dissuasion nucléaire, retenue de l\'OTAN',
      },
      {
        title: 'Effondrement économique',
        trigger: 'Effondrement de la devise, hyperinflation, défaillance du système bancaire, crise budgétaire',
        probability: 'Low',
        impact: 'High',
        timeHorizon: '12-24 mois',
        leadingIndicators: 'Taux d\'inflation, mouvements de devises, déficit budgétaire, évaluations du FMI',
        mitigants: 'Soutien financier occidental, programmes du FMI, gestion de la banque centrale',
      },
      {
        title: 'Échec de la reconstruction après-guerre',
        trigger: 'Financement international insuffisant, défis de gouvernance, corruption, instabilité politique',
        probability: 'Med',
        impact: 'Med',
        timeHorizon: '24-36 mois',
        leadingIndicators: 'Planification de la reconstruction, promesses internationales, évaluations de gouvernance',
        mitigants: 'Surveillance OTAN/UE, coordination internationale, surveillance de la société civile',
      },
    ],
    sources: [
      {
        name: 'Banque nationale d\'Ukraine',
        url: 'https://bank.gov.ua',
        desc: 'Politique monétaire, inflation, devise, stabilité financière',
      },
      {
        name: 'Service de statistique de l\'État d\'Ukraine',
        url: 'https://ukrstat.gov.ua',
        desc: 'Statistiques économiques et démographiques',
      },
      {
        name: 'Données de conflit ACLED',
        url: 'https://acleddata.com',
        desc: 'Morts au combat, contrôle territorial, événements de conflit',
      },
      {
        name: 'Human Rights Watch',
        url: 'https://hrw.org',
        desc: 'Crimes de guerre, violations humanitaires, impact civil',
      },
      {
        name: 'International Crisis Group',
        url: 'https://crisisgroup.org',
        desc: 'Analyse de conflit et perspectives de paix',
      },
      {
        name: 'Base de données des dépenses militaires du SIPRI',
        url: 'https://www.sipri.org',
        desc: 'Dépenses militaires et transferts d\'armes',
      },
      {
        name: 'Bureau de la coordination des affaires humanitaires des Nations unies (OCHA)',
        url: 'https://www.unocha.org',
        desc: 'Besoins humanitaires et déplacement',
      },
      {
        name: 'Reuters / Associated Press',
        url: 'https://reuters.com',
        desc: 'Événements actuels et nouvelles de dernière minute',
      },
    ],
  },
};
