/*
 * TransHorizons — Poland Country Analysis Data
 * Full bilingual content following the Country Situation Report framework
 * Last updated: April 2026
 * Sources: Central Statistical Office (GUS), National Bank of Poland, Brookings, SIPRI, ACLED, Freedom House, PISM
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

export const polandAnalysis: AnalysisContent = {
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
      'Regime type: Parliamentary democracy with strong presidency. Member of EU and NATO since 2004 and 1999 respectively. Civic Coalition government under PM Donald Tusk (since December 2023) with coalition partners PSL and Third Way.',
      'Political equilibrium: Tusk government has solid parliamentary majority (248/460 seats). Opposition dominated by Law & Justice (PiS), which governed 2015-2023 but faces judicial reform pressures and corruption investigations. Anti-Russian consensus strong across all major parties.',
      'Economic model: Upper-middle income ($17,000 GDP per capita). Manufacturing-export driven economy with strong EU supply chain integration. Heavy reliance on EU structural funds (~€100B over 2021-2027). Energy transition and defense spending now competing for fiscal resources.',
      'Top 3 risks (6–18 months): (1) Ukraine war spillover — direct military escalation, refugee surge, or NATO involvement; (2) Energy security crisis from gas supply disruption or LNG price volatility; (3) EU rule-of-law tensions over judicial reform affecting fund access.',
      'Top 3 watch items (4–12 weeks): (1) Ukraine military situation — any major Russian breakthrough could trigger refugee exodus; (2) Energy prices — winter heating demand and LNG market volatility; (3) EU Commission decisions on rule-of-law conditionality.',
      'External dependencies: Energy imports (diversified from Russia post-2022, now LNG, Norwegian gas, EU sources). 80% of exports go to EU market. NATO security guarantee from US. 1M+ Ukrainian refugees creating social/fiscal burden.',
      'Security posture: NATO frontline state with active deterrence posture. US military presence increased (Fort Liberty rotational deployments). Strong military modernization program (€100B+ planned). No active insurgency. Border security concerns with Belarus/Russia.',
      'Diplomatic orientation: Pro-NATO, pro-EU, strong US ally. Active Ukraine supporter (military aid, humanitarian support, refugee hosting). EU leadership on Eastern European security. Pragmatic Russia containment strategy.',
      'Data confidence: High — Poland has strong institutional data (GUS, NBP) and independent media. Transparency International ranks Poland 34th globally on corruption.',
      'Baseline outlook: Stable through 2026-2027 with manageable risks. Tusk government likely to consolidate power through 2025 elections. Ukraine war remains the dominant external threat. EU integration and NATO membership provide institutional anchors.',
    ],
    political: {
      powerStructure: 'PM Donald Tusk (Civic Coalition) leads government with coalition partners PSL and Third Way, holding 248/460 parliamentary seats. President Andrzej Duda (Law & Justice) has limited executive power but symbolic importance. Sejm (lower house) and Senate (upper house) both controlled by coalition. Constitutional Court and Supreme Court have been reformed by previous PiS government, now under EU scrutiny. Local governments remain strong, with significant autonomy. Civil society and independent media remain robust despite PiS-era pressures.',
      stabilityDrivers: 'NATO and EU membership provide institutional anchors and security guarantees. Strong anti-Russian consensus across political spectrum creates unified foreign policy. Democratic institutions have proven resilient through multiple government transitions. Civil society and independent media remain strong. Economic growth (3-4%) provides legitimacy. Younger demographic profile compared to Western Europe.',
      shockAbsorbers: 'EU structural funds and cohesion funds provide fiscal buffer (~€15B annually). NATO collective defense guarantee backed by US. Strong diaspora networks (especially in US and UK). Civil society resilience demonstrated during PiS era. Diversified energy sources reduce Russian leverage. Manufacturing base provides economic flexibility.',
    },
    economy: {
      macroReality: 'GDP growth 3-4% (2024-2025), inflation 3-4%, unemployment ~3%. Manufacturing sector strong (automotive, electronics, chemicals). EU structural funds critical for infrastructure investment. Defense spending increasing toward NATO 2.5%+ target (currently ~2.4%). Fiscal position manageable (deficit ~5% of GDP, debt ~55% of GDP).',
      externalVulnerability: 'Energy import dependent despite diversification efforts — pre-2022 relied on Russian gas (60%), now diversified to LNG, Norwegian, and EU sources. Trade heavily concentrated in EU market (80% of exports). Refugee burden from Ukraine (1M+ people) creating fiscal and social pressures. Supply chain integration with EU creates vulnerability to EU recession. Current account deficit ~2% of GDP.',
      politicalEconomy: 'EU funds critical for infrastructure modernization and green transition. Defense spending pressures rising due to Ukraine threat and NATO commitments. Fiscal consolidation needed to meet EU deficit targets. Energy transition requires €200B+ investment. Reconstruction aid to Ukraine becoming political priority. Wage pressures from tight labor market and refugee integration.',
    },
    security: {
      internal: 'Low terrorism threat (occasional far-right incidents). Strong police and military institutions. Border security concerns with Belarus (hybrid threats, migrant pressure) and Russia (military buildup). Minimal ethnic tensions. Gang violence present but localized. Cybersecurity threats increasing from Russian actors.',
      diplomacy: 'NATO frontline state with active deterrence posture — US military presence increased, NATO Eastern Command exercises regular. Strong US partnership (security guarantees, military aid). EU leadership on Ukraine and Eastern European security. Pragmatic Russia containment strategy. Active in AUKUS discussions. Baltics and Visegrad Group coordination.',
    },
    actors: {
      domestic: [
        {
          name: 'Donald Tusk / Civic Coalition',
          interests: 'EU integration, NATO strengthening, Ukraine support, rule-of-law reforms, economic modernization',
          resources: 'Parliamentary majority, EU support, international credibility, civil service loyalty',
          constraints: 'Coalition management, fiscal pressures, EU rule-of-law tensions, PiS institutional legacy',
          likelyMoves: 'Continue EU/NATO alignment, judicial reforms, defense spending increases, Ukraine aid',
          dealability: 'High with EU/US; Low with Russia',
        },
        {
          name: 'Law & Justice (PiS) / Opposition',
          interests: 'Conservative governance, sovereignty preservation, security hardline, judicial independence',
          resources: 'Electoral base (35-40%), local government presence, media allies, institutional knowledge',
          constraints: 'Judicial investigations, EU pressure, electoral minority, international isolation',
          likelyMoves: 'Obstruct judicial reforms, appeal to security concerns, build 2025 election coalition',
          dealability: 'Medium on security; Low on rule-of-law',
        },
        {
          name: 'Military / NATO Command',
          interests: 'Deterrence credibility, force modernization, NATO integration, Ukraine support',
          resources: 'Armed forces (250K personnel), NATO infrastructure, US partnership, defense budget',
          constraints: 'Budget limitations, equipment delays, personnel recruitment challenges',
          likelyMoves: 'Increase exercises, modernize equipment, strengthen NATO Eastern Command',
          dealability: 'High with government; Medium with opposition',
        },
        {
          name: 'Business / Manufacturing Sector',
          interests: 'EU supply chain integration, energy security, labor availability, investment climate',
          resources: 'Export capacity, employment (3M+ in manufacturing), EU market access, FDI flows',
          constraints: 'Energy costs, labor shortages, Ukrainian refugee integration, supply chain disruption',
          likelyMoves: 'Lobby for energy support, labor market reforms, green transition funding',
          dealability: 'High with government; Medium with opposition',
        },
        {
          name: 'Civil Society / Independent Media',
          interests: 'Democratic institutions, rule-of-law, press freedom, civil liberties',
          resources: 'Public mobilization capacity, international networks, media platforms, NGO infrastructure',
          constraints: 'Funding pressures, political polarization, Russian disinformation campaigns',
          likelyMoves: 'Monitor judicial reforms, counter disinformation, support Ukraine solidarity',
          dealability: 'High with government; Low with PiS',
        },
      ],
      external: [
        {
          name: 'United States',
          interests: 'NATO strengthening, Russia containment, Ukraine support, European stability',
          resources: 'Military power, security guarantees, economic leverage, diplomatic influence',
          constraints: 'Domestic political uncertainty, burden-sharing pressures, fiscal constraints',
          likelyMoves: 'Maintain military presence, increase defense aid, strengthen NATO commitment',
          dealability: 'Very High',
        },
        {
          name: 'European Union',
          interests: 'Rule-of-law compliance, fiscal discipline, Ukraine support, energy security',
          resources: 'Structural funds, regulatory power, trade leverage, institutional framework',
          constraints: 'Internal divisions, fiscal pressures, rule-of-law enforcement challenges',
          likelyMoves: 'Monitor judicial reforms, condition fund disbursement, coordinate Ukraine policy',
          dealability: 'High',
        },
        {
          name: 'Ukraine',
          interests: 'Military support, refugee hosting, reconstruction aid, NATO membership support',
          resources: 'Refugee population, historical ties, strategic location, Western alignment',
          constraints: 'Ongoing war, economic collapse, demographic crisis, reconstruction needs',
          likelyMoves: 'Request increased military aid, seek reconstruction support, coordinate NATO policy',
          dealability: 'Very High',
        },
        {
          name: 'Russia',
          interests: 'NATO containment, sphere of influence restoration, destabilization',
          resources: 'Military power, energy leverage (reduced), disinformation capabilities, Belarus proxy',
          constraints: 'Ukraine war drain, sanctions, NATO deterrence, Polish resilience',
          likelyMoves: 'Military exercises, hybrid threats, disinformation campaigns, energy pressure',
          dealability: 'Very Low',
        },
        {
          name: 'Germany',
          interests: 'EU stability, energy security, manufacturing integration, Russia policy coordination',
          resources: 'Economic power, EU leadership, manufacturing base, energy influence',
          constraints: 'Energy dependence, manufacturing competition, political divisions',
          likelyMoves: 'Coordinate EU policy, manage energy transition, support Ukraine',
          dealability: 'High',
        },
      ],
    },
    risks: [
      {
        title: 'Ukraine War Spillover',
        trigger: 'Major Russian military breakthrough, NATO involvement escalation, refugee surge beyond 2M',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '6-18 months',
        leadingIndicators: 'Russian offensive intensity, NATO military movements, refugee flow rates, missile strikes near border',
        mitigants: 'NATO collective defense, US military presence, Ukrainian military effectiveness, diplomatic channels',
      },
      {
        title: 'Energy Security Crisis',
        trigger: 'LNG supply disruption, price spike above $30/MMBtu, winter heating demand surge',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '4-12 months',
        leadingIndicators: 'LNG market prices, supply disruptions, winter weather forecasts, EU gas storage levels',
        mitigants: 'Diversified energy sources, LNG infrastructure, EU coordination, strategic reserves',
      },
      {
        title: 'EU Rule-of-Law Tensions',
        trigger: 'EU Commission withholds funds over judicial reform disputes, political backlash',
        probability: 'Med',
        impact: 'Med',
        timeHorizon: '6-12 months',
        leadingIndicators: 'Commission decisions on rule-of-law, judicial reform progress, fund disbursement schedules',
        mitigants: 'Tusk government commitment to reforms, EU dialogue mechanisms, international pressure on PiS legacy',
      },
      {
        title: 'NATO Burden Sharing Tensions',
        trigger: 'US pressure for higher defense spending, NATO burden-sharing disputes, commitment uncertainty',
        probability: 'Med',
        impact: 'Med',
        timeHorizon: '12-24 months',
        leadingIndicators: 'NATO defense spending discussions, US political rhetoric, NATO summit outcomes',
        mitigants: 'Poland already committed to 2.5%+ spending, NATO framework, EU defense initiatives',
      },
      {
        title: 'Economic Slowdown',
        trigger: 'EU recession, manufacturing decline, unemployment rise, fiscal pressures',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '12-24 months',
        leadingIndicators: 'EU growth forecasts, manufacturing PMI, unemployment rates, fiscal deficit trends',
        mitigants: 'Diversified economy, EU structural funds, defense spending stimulus, labor market flexibility',
      },
      {
        title: 'Democratic Erosion',
        trigger: 'Judicial independence concerns, media freedom pressures, civil liberties restrictions',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '12-36 months',
        leadingIndicators: 'Judicial reform implementation, media freedom indices, civil society pressures, international criticism',
        mitigants: 'Tusk government commitment to rule-of-law, EU oversight, civil society resilience, independent media',
      },
    ],
    sources: [
      {
        name: 'Central Statistical Office of Poland (GUS)',
        url: 'https://stat.gov.pl',
        desc: 'Official economic and demographic statistics',
      },
      {
        name: 'National Bank of Poland',
        url: 'https://www.nbp.pl',
        desc: 'Monetary policy, inflation, exchange rates',
      },
      {
        name: 'Brookings Institution Poland Analysis',
        url: 'https://www.brookings.edu',
        desc: 'Geopolitical and policy analysis',
      },
      {
        name: 'SIPRI Military Expenditure Database',
        url: 'https://www.sipri.org',
        desc: 'Defense spending and military trends',
      },
      {
        name: 'ACLED Conflict Data',
        url: 'https://acleddata.com',
        desc: 'Border incidents and security events',
      },
      {
        name: 'Freedom House Poland Report',
        url: 'https://freedomhouse.org',
        desc: 'Democratic institutions and civil liberties',
      },
      {
        name: 'Polish Institute of International Affairs (PISM)',
        url: 'https://pism.pl',
        desc: 'Polish foreign policy and security analysis',
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
      'Type de régime : Démocratie parlementaire avec présidence forte. Membre de l\'UE et de l\'OTAN depuis 2004 et 1999 respectivement. Gouvernement de la Coalition civique sous le PM Donald Tusk (depuis décembre 2023) avec partenaires de coalition PSL et Troisième Voie.',
      'Équilibre politique : Le gouvernement Tusk dispose d\'une majorité parlementaire solide (248/460 sièges). Opposition dominée par Droit et Justice (PiS), qui a gouverné 2015-2023 mais fait face à des pressions de réforme judiciaire et des enquêtes pour corruption. Consensus anti-russe fort dans tous les principaux partis.',
      'Modèle économique : Revenu intermédiaire supérieur (17 000 USD PIB par habitant). Économie d\'exportation manufacturière avec forte intégration dans la chaîne d\'approvisionnement de l\'UE. Dépendance importante aux fonds structurels de l\'UE (~100 milliards d\'euros sur 2021-2027). La transition énergétique et les dépenses de défense concurrencent désormais les ressources budgétaires.',
      'Top 3 risques (6-18 mois) : (1) Débordement de la guerre en Ukraine — escalade militaire directe, afflux de réfugiés ou implication de l\'OTAN ; (2) Crise de la sécurité énergétique due à une perturbation de l\'approvisionnement en gaz ou à la volatilité des prix du GNL ; (3) Tensions UE sur l\'état de droit concernant la réforme judiciaire affectant l\'accès aux fonds.',
      'Top 3 points de surveillance (4-12 semaines) : (1) Situation militaire en Ukraine — toute percée russe majeure pourrait déclencher un exode de réfugiés ; (2) Prix de l\'énergie — demande de chauffage hivernal et volatilité du marché du GNL ; (3) Décisions de la Commission européenne sur la conditionnalité de l\'état de droit.',
      'Dépendances externes : Importations énergétiques (diversifiées de la Russie après 2022, maintenant GNL, gaz norvégien, sources de l\'UE). 80% des exportations vont au marché de l\'UE. Garantie de sécurité de l\'OTAN des États-Unis. 1M+ réfugiés ukrainiens créant une charge sociale/budgétaire.',
      'Posture de sécurité : État en première ligne de l\'OTAN avec posture de dissuasion active. Présence militaire américaine augmentée (déploiements rotatifs de Fort Liberty). Programme de modernisation militaire fort (100 milliards d\'euros+ prévus). Pas d\'insurrection active. Préoccupations concernant la sécurité des frontières avec la Biélorussie/Russie.',
      'Orientation diplomatique : Pro-OTAN, pro-UE, allié fort des États-Unis. Soutien actif à l\'Ukraine (aide militaire, soutien humanitaire, accueil de réfugiés). Leadership de l\'UE sur la sécurité de l\'Europe de l\'Est. Stratégie pragmatique de confinement de la Russie.',
      'Confiance dans les données : Élevée — La Pologne dispose de données institutionnelles fortes (GUS, NBP) et de médias indépendants. Transparency International classe la Pologne 34e mondialement sur la corruption.',
      'Perspective de base : Stable jusqu\'en 2026-2027 avec des risques gérables. Le gouvernement Tusk est susceptible de consolider le pouvoir par les élections de 2025. La guerre en Ukraine reste la menace externe dominante. L\'intégration à l\'UE et l\'adhésion à l\'OTAN fournissent des ancres institutionnelles.',
    ],
    political: {
      powerStructure: 'Le PM Donald Tusk (Coalition civique) dirige le gouvernement avec les partenaires de coalition PSL et Troisième Voie, détenant 248/460 sièges parlementaires. Le président Andrzej Duda (Droit et Justice) a un pouvoir exécutif limité mais une importance symbolique. Le Sejm (chambre basse) et le Sénat (chambre haute) sont tous deux contrôlés par la coalition. La Cour constitutionnelle et la Cour suprême ont été réformées par le gouvernement PiS précédent, maintenant sous surveillance de l\'UE. Les gouvernements locaux restent forts, avec une autonomie significative. La société civile et les médias indépendants restent robustes malgré les pressions de l\'ère PiS.',
      stabilityDrivers: 'L\'adhésion à l\'OTAN et à l\'UE fournit des ancres institutionnelles et des garanties de sécurité. Consensus anti-russe fort dans tout le spectre politique crée une politique étrangère unifiée. Les institutions démocratiques ont prouvé leur résilience à travers plusieurs transitions gouvernementales. La société civile et les médias indépendants restent forts. La croissance économique (3-4%) fournit la légitimité. Profil démographique plus jeune comparé à l\'Europe occidentale.',
      shockAbsorbers: 'Les fonds structurels et de cohésion de l\'UE fournissent un amortisseur budgétaire (~15 milliards d\'euros annuels). Garantie de défense collective de l\'OTAN soutenue par les États-Unis. Réseaux de diaspora forts (surtout aux États-Unis et au Royaume-Uni). Résilience de la société civile démontrée pendant l\'ère PiS. Sources énergétiques diversifiées réduisent l\'effet de levier russe. Base manufacturière fournit une flexibilité économique.',
    },
    economy: {
      macroReality: 'Croissance du PIB 3-4% (2024-2025), inflation 3-4%, chômage ~3%. Secteur manufacturier fort (automobile, électronique, chimie). Les fonds structurels de l\'UE sont critiques pour l\'investissement en infrastructure. Les dépenses de défense augmentent vers la cible OTAN 2,5%+ (actuellement ~2,4%). Position budgétaire gérable (déficit ~5% du PIB, dette ~55% du PIB).',
      externalVulnerability: 'Dépendant des importations énergétiques malgré les efforts de diversification — avant 2022 dépendait du gaz russe (60%), maintenant diversifié vers GNL, norvégien et sources de l\'UE. Commerce fortement concentré sur le marché de l\'UE (80% des exportations). Charge des réfugiés en provenance d\'Ukraine (1M+ personnes) créant des pressions fiscales et sociales. Intégration de la chaîne d\'approvisionnement avec l\'UE crée une vulnérabilité à la récession de l\'UE. Déficit du compte courant ~2% du PIB.',
      politicalEconomy: 'Les fonds de l\'UE sont critiques pour la modernisation des infrastructures et la transition verte. Les pressions sur les dépenses de défense augmentent en raison de la menace ukrainienne et des engagements de l\'OTAN. La consolidation budgétaire est nécessaire pour respecter les cibles de déficit de l\'UE. La transition énergétique nécessite un investissement de 200 milliards d\'euros+. L\'aide à la reconstruction de l\'Ukraine devient une priorité politique. Les pressions salariales proviennent du marché du travail tendu et de l\'intégration des réfugiés.',
    },
    security: {
      internal: 'Faible menace terroriste (incidents occasionnels d\'extrême droite). Institutions policières et militaires fortes. Préoccupations concernant la sécurité des frontières avec la Biélorussie (menaces hybrides, pression migratoire) et la Russie (renforcement militaire). Tensions ethniques minimales. Violence de gangs présente mais localisée. Menaces de cybersécurité augmentant des acteurs russes.',
      diplomacy: 'État en première ligne de l\'OTAN avec posture de dissuasion active — présence militaire américaine augmentée, exercices du Commandement OTAN en Europe de l\'Est réguliers. Partenariat fort avec les États-Unis (garanties de sécurité, aide militaire). Leadership de l\'UE sur l\'Ukraine et la sécurité de l\'Europe de l\'Est. Stratégie pragmatique de confinement de la Russie. Actif dans les discussions AUKUS. Coordination des Pays baltes et du groupe de Visegrad.',
    },
    actors: {
      domestic: [
        {
          name: 'Donald Tusk / Coalition civique',
          interests: 'Intégration à l\'UE, renforcement de l\'OTAN, soutien à l\'Ukraine, réformes de l\'état de droit, modernisation économique',
          resources: 'Majorité parlementaire, soutien de l\'UE, crédibilité internationale, loyauté de la fonction publique',
          constraints: 'Gestion de la coalition, pressions budgétaires, tensions UE sur l\'état de droit, héritage institutionnel du PiS',
          likelyMoves: 'Continuer l\'alignement UE/OTAN, réformes judiciaires, augmentations des dépenses de défense, aide à l\'Ukraine',
          dealability: 'Élevée avec l\'UE/États-Unis ; Faible avec la Russie',
        },
        {
          name: 'Droit et Justice (PiS) / Opposition',
          interests: 'Gouvernance conservatrice, préservation de la souveraineté, ligne dure sur la sécurité, indépendance judiciaire',
          resources: 'Base électorale (35-40%), présence gouvernementale locale, alliés médiatiques, connaissance institutionnelle',
          constraints: 'Enquêtes judiciaires, pression de l\'UE, minorité électorale, isolement international',
          likelyMoves: 'Entraver les réformes judiciaires, faire appel aux préoccupations de sécurité, construire une coalition électorale 2025',
          dealability: 'Moyenne sur la sécurité ; Faible sur l\'état de droit',
        },
        {
          name: 'Armée / Commandement OTAN',
          interests: 'Crédibilité de la dissuasion, modernisation des forces, intégration OTAN, soutien à l\'Ukraine',
          resources: 'Forces armées (250K personnel), infrastructure OTAN, partenariat américain, budget de défense',
          constraints: 'Limitations budgétaires, retards d\'équipement, défis de recrutement du personnel',
          likelyMoves: 'Augmenter les exercices, moderniser l\'équipement, renforcer le Commandement OTAN en Europe de l\'Est',
          dealability: 'Élevée avec le gouvernement ; Moyenne avec l\'opposition',
        },
        {
          name: 'Secteur commercial / Manufactures',
          interests: 'Intégration de la chaîne d\'approvisionnement de l\'UE, sécurité énergétique, disponibilité de main-d\'œuvre, climat d\'investissement',
          resources: 'Capacité d\'exportation, emploi (3M+ dans la manufacture), accès au marché de l\'UE, flux d\'IDE',
          constraints: 'Coûts énergétiques, pénuries de main-d\'œuvre, intégration des réfugiés ukrainiens, perturbation de la chaîne d\'approvisionnement',
          likelyMoves: 'Plaider pour le soutien énergétique, réformes du marché du travail, financement de la transition verte',
          dealability: 'Élevée avec le gouvernement ; Moyenne avec l\'opposition',
        },
        {
          name: 'Société civile / Médias indépendants',
          interests: 'Institutions démocratiques, état de droit, liberté de la presse, libertés civiles',
          resources: 'Capacité de mobilisation publique, réseaux internationaux, plateformes médiatiques, infrastructure ONG',
          constraints: 'Pressions de financement, polarisation politique, campagnes de désinformation russes',
          likelyMoves: 'Surveiller les réformes judiciaires, contrer la désinformation, soutenir la solidarité avec l\'Ukraine',
          dealability: 'Élevée avec le gouvernement ; Faible avec le PiS',
        },
      ],
      external: [
        {
          name: 'États-Unis',
          interests: 'Renforcement de l\'OTAN, confinement de la Russie, soutien à l\'Ukraine, stabilité européenne',
          resources: 'Puissance militaire, garanties de sécurité, effet de levier économique, influence diplomatique',
          constraints: 'Incertitude politique intérieure, pressions de partage du fardeau, contraintes budgétaires',
          likelyMoves: 'Maintenir la présence militaire, augmenter l\'aide à la défense, renforcer l\'engagement de l\'OTAN',
          dealability: 'Très élevée',
        },
        {
          name: 'Union européenne',
          interests: 'Conformité de l\'état de droit, discipline budgétaire, soutien à l\'Ukraine, sécurité énergétique',
          resources: 'Fonds structurels, pouvoir réglementaire, effet de levier commercial, cadre institutionnel',
          constraints: 'Divisions internes, pressions budgétaires, défis d\'application de l\'état de droit',
          likelyMoves: 'Surveiller les réformes judiciaires, conditionner la décaissement des fonds, coordonner la politique ukrainienne',
          dealability: 'Élevée',
        },
        {
          name: 'Ukraine',
          interests: 'Soutien militaire, accueil des réfugiés, aide à la reconstruction, soutien à l\'adhésion à l\'OTAN',
          resources: 'Population de réfugiés, liens historiques, localisation stratégique, alignement occidental',
          constraints: 'Guerre en cours, effondrement économique, crise démographique, besoins de reconstruction',
          likelyMoves: 'Demander une augmentation de l\'aide militaire, chercher un soutien à la reconstruction, coordonner la politique de l\'OTAN',
          dealability: 'Très élevée',
        },
        {
          name: 'Russie',
          interests: 'Confinement de l\'OTAN, restauration de la sphère d\'influence, déstabilisation',
          resources: 'Puissance militaire, effet de levier énergétique (réduit), capacités de désinformation, proxy biélorusse',
          constraints: 'Drain de la guerre en Ukraine, sanctions, dissuasion de l\'OTAN, résilience polonaise',
          likelyMoves: 'Exercices militaires, menaces hybrides, campagnes de désinformation, pression énergétique',
          dealability: 'Très faible',
        },
        {
          name: 'Allemagne',
          interests: 'Stabilité de l\'UE, sécurité énergétique, intégration manufacturière, coordination de la politique russe',
          resources: 'Puissance économique, leadership de l\'UE, base manufacturière, influence énergétique',
          constraints: 'Dépendance énergétique, concurrence manufacturière, divisions politiques',
          likelyMoves: 'Coordonner la politique de l\'UE, gérer la transition énergétique, soutenir l\'Ukraine',
          dealability: 'Élevée',
        },
      ],
    },
    risks: [
      {
        title: 'Débordement de la guerre en Ukraine',
        trigger: 'Percée militaire russe majeure, escalade de l\'implication de l\'OTAN, afflux de réfugiés au-delà de 2M',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '6-18 mois',
        leadingIndicators: 'Intensité de l\'offensive russe, mouvements militaires de l\'OTAN, taux de flux de réfugiés, frappes de missiles près de la frontière',
        mitigants: 'Défense collective de l\'OTAN, présence militaire américaine, efficacité militaire ukrainienne, canaux diplomatiques',
      },
      {
        title: 'Crise de la sécurité énergétique',
        trigger: 'Perturbation de l\'approvisionnement en GNL, pic de prix au-dessus de 30 $/MMBtu, pic de demande de chauffage hivernal',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '4-12 mois',
        leadingIndicators: 'Prix du marché du GNL, perturbations d\'approvisionnement, prévisions météorologiques hivernales, niveaux de stockage de gaz de l\'UE',
        mitigants: 'Sources énergétiques diversifiées, infrastructure de GNL, coordination de l\'UE, réserves stratégiques',
      },
      {
        title: 'Tensions UE sur l\'état de droit',
        trigger: 'La Commission européenne retient les fonds en raison de différends sur la réforme judiciaire, réaction politique',
        probability: 'Med',
        impact: 'Med',
        timeHorizon: '6-12 mois',
        leadingIndicators: 'Décisions de la Commission, progrès de la réforme judiciaire, calendriers de décaissement des fonds',
        mitigants: 'Engagement du gouvernement Tusk pour les réformes, mécanismes de dialogue de l\'UE, pression internationale sur l\'héritage du PiS',
      },
      {
        title: 'Tensions de partage du fardeau de l\'OTAN',
        trigger: 'Pression américaine pour des dépenses de défense plus élevées, différends de partage du fardeau de l\'OTAN, incertitude de l\'engagement',
        probability: 'Med',
        impact: 'Med',
        timeHorizon: '12-24 mois',
        leadingIndicators: 'Discussions sur les dépenses de défense de l\'OTAN, rhétorique politique américaine, résultats du sommet de l\'OTAN',
        mitigants: 'La Pologne s\'est déjà engagée à dépenser 2,5%+, cadre de l\'OTAN, initiatives de défense de l\'UE',
      },
      {
        title: 'Ralentissement économique',
        trigger: 'Récession de l\'UE, déclin manufacturier, augmentation du chômage, pressions budgétaires',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '12-24 mois',
        leadingIndicators: 'Prévisions de croissance de l\'UE, PMI manufacturier, taux de chômage, tendances du déficit budgétaire',
        mitigants: 'Économie diversifiée, fonds structurels de l\'UE, stimulus des dépenses de défense, flexibilité du marché du travail',
      },
      {
        title: 'Érosion démocratique',
        trigger: 'Préoccupations concernant l\'indépendance judiciaire, pressions sur la liberté de la presse, restrictions des libertés civiles',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '12-36 mois',
        leadingIndicators: 'Mise en œuvre de la réforme judiciaire, indices de liberté de la presse, pressions de la société civile, critiques internationales',
        mitigants: 'Engagement du gouvernement Tusk pour l\'état de droit, surveillance de l\'UE, résilience de la société civile, médias indépendants',
      },
    ],
    sources: [
      {
        name: 'Office central de statistique de Pologne (GUS)',
        url: 'https://stat.gov.pl',
        desc: 'Statistiques économiques et démographiques officielles',
      },
      {
        name: 'Banque nationale de Pologne',
        url: 'https://www.nbp.pl',
        desc: 'Politique monétaire, inflation, taux de change',
      },
      {
        name: 'Analyse Brookings sur la Pologne',
        url: 'https://www.brookings.edu',
        desc: 'Analyse géopolitique et politique',
      },
      {
        name: 'Base de données des dépenses militaires du SIPRI',
        url: 'https://www.sipri.org',
        desc: 'Dépenses de défense et tendances militaires',
      },
      {
        name: 'Données de conflit ACLED',
        url: 'https://acleddata.com',
        desc: 'Incidents frontaliers et événements de sécurité',
      },
      {
        name: 'Rapport Freedom House sur la Pologne',
        url: 'https://freedomhouse.org',
        desc: 'Institutions démocratiques et libertés civiles',
      },
      {
        name: 'Institut polonais des affaires internationales (PISM)',
        url: 'https://pism.pl',
        desc: 'Analyse de la politique étrangère et de la sécurité polonaise',
      },
      {
        name: 'Reuters / Associated Press',
        url: 'https://reuters.com',
        desc: 'Événements actuels et nouvelles de dernière minute',
      },
    ],
  },
};
