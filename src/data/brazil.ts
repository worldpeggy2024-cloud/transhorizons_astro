/**
 * TransHorizons — Brazil Country Analysis Data
 * Full bilingual content following the Country Situation Report framework
 * Last updated: April 2026
 * Sources: BBVA Research, AS/COA, BTI Index, Brazilian Central Bank, Ministry of Foreign Affairs, Reuters, Folha de S.Paulo, O Globo
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
}

export interface SourceEntry {
  name: string;
  url: string;
  desc: string;
}

export const brazilAnalysis: AnalysisContent = {
  lastUpdated: '2026-04-11',
  scorecard: {
    eliteCohesion: 'Low',
    securityLoyalty: 'Med',
    economicPressure: 'High',
    protestCapacity: 'High',
    institutionalResilience: 'Med',
  },
  en: {
    executiveSnapshot: [
      'Regime type: Presidential republic (bicameral Congress: Senate 81 seats, Chamber 513 seats). Executive power held by President and Cabinet. Luiz Inácio Lula da Silva (Workers\' Party/PT) is president since 2023, seeking 4th term in October 2026 elections.',
      'Political equilibrium: Highly polarized. Lula\'s approval ~44%, disapproval ~51% (March 2026). Opposition led by Flávio Bolsonaro (endorsed by father Jair Bolsonaro) polling tied with Lula in second-round scenarios. Coalition fragile; Lula forced cabinet reshuffle (March 2026) to strengthen unity. Congress fragmented across 30+ parties; no single party dominates. Institutional democracy resilient but polarization acute.',
      'Economic model: Large middle-income economy (nominal GDP ~$2.1 trillion). Dual structure: (1) Commodity exports (agriculture, minerals, oil); (2) Services and manufacturing. Inflation pressures mounting; fiscal deficit forecast 8.1% of GDP (2026)—Latin America\'s largest. Public debt rising. Selic rate at 14.75% (March 2026). Growth forecast 1.7% (2026), below potential. Currency instability; Real depreciating.',
      'Top 3 risks (6–18 months): (1) Electoral polarization and institutional stress if Bolsonaro faction contests results or escalates confrontation; (2) Fiscal crisis from unsustainable deficit and rising debt, forcing austerity or default risk; (3) Criminal violence escalation as PCC and CV diversify operations and US designates them as terrorist organizations.',
      'Top 3 watch items (4–12 weeks): (1) October 4, 2026 election results and immediate aftermath—risk of institutional breakdown if close result disputed; (2) Central Bank monetary policy and currency stability—Real weakness could trigger capital flight; (3) Gang violence escalation and police operations—risk of destabilization if major operations backfire.',
      'External dependencies: Oil and commodity exports vulnerable to global price shocks. Trade dependence on China (largest trading partner); US security cooperation; BRICS alignment. Amazon deforestation tied to organized crime; environmental security threat. Geopolitical hedging between US-China rivalry.',
      'Security posture: High internal violence (murder rates above global averages). Criminal organizations (PCC, CV) operating as transnational enterprises; infiltrating fuel supply chain, fintech, real estate. Police operations increasingly militarized; October 2025 Rio raid killed 120+ (deadliest law enforcement operation in history). Gang control of favelas affects ~4 million people. US considering terrorist designations for PCC/CV.',
      'Diplomatic orientation: BRICS member; South-South cooperation emphasis. Hedging between US and China; economic dependence on Beijing, security ties with Washington. Amazon protection tied to international climate commitments. Regional leader in South America; mediator role in regional disputes.',
      'Data confidence: Medium-High. Brazil has strong institutional data (Central Bank, IBGE statistics). Free press (Folha, O Globo, Estadão). However, gang violence data incomplete; security operations lack transparency. Electoral polling subject to uncertainty.',
      'Baseline outlook: High volatility through October 2026 election. Three critical junctures: (1) Election campaign (April–October 2026)—polarization likely to intensify; (2) October 4 election day and immediate aftermath—institutional stress if disputed; (3) Post-election transition (November–December 2026)—risk of confrontation if Bolsonaro faction rejects results. Fiscal crisis is slow-burn risk; criminal violence is acute risk. Winner will face constrained fiscal space and security challenges.',
    ],
    political: {
      powerStructure: 'Brazil\'s president holds significant executive authority but depends on congressional support for legislation. Lula leads a fragmented coalition across 30+ parties; no single party controls Congress. The Chamber of Deputies (513 seats) is highly fractious; the Senate (81 seats) provides some stability. The judiciary is independent but increasingly politicized; Supreme Court (STF) has become a battleground between left and right. The military is institutionally loyal to the constitution but has historical memory of dictatorship and intervenes rhetorically in politics. The security forces (Federal Police, state Military Police) are fragmented and often corrupt; gang violence outpaces police capacity in many regions.',
      stabilityDrivers: 'Legitimacy rests on democratic elections and economic performance. The 2022 election (Lula\'s narrow victory over Bolsonaro) was contested but accepted. Congress is diverse; no single faction can impose authoritarian rule. The judiciary, despite politicization, has defended democratic norms. Civil society is active; media is pluralistic. However, polarization is acute—Bolsonaro\'s base (especially evangelical churches and agribusiness) views Lula as illegitimate; Lula\'s base views Bolsonaro as a threat to democracy. This mutual delegitimization is the core stability risk.',
      shockAbsorbers: 'Absorbers: Diversified economy (agriculture, manufacturing, services, mining). Large domestic market. Commodity export base provides revenue. Institutional experience with democratic transitions. Absorbers: Central Bank independence (though under political pressure). Accelerants: Fiscal deficit unsustainable; if bond markets lose confidence, forced austerity could trigger social unrest. Criminal violence spreading to previously safe areas (Chile, Uruguay); if gangs destabilize major cities, institutional capacity could collapse. Electoral dispute could trigger institutional breakdown; if Bolsonaro faction contests results, military could be drawn into politics.',
    },
    economy: {
      macroReality: 'Brazil\'s economy is large but growth is sluggish. GDP growth was 2.3% in 2025, forecast 1.7% in 2026 and 2.2% in 2027—below potential (~2.3%). Inflation is moderating but remains elevated; forecast ~4% for 2026, near the upper bound of the 1.5–4.5% target range. The Central Bank cut the Selic rate to 14.75% in March 2026 (from higher levels) but remains restrictive. Unemployment is moderate (~4.2%) but underemployment is high. The fiscal situation is dire: the general government deficit is forecast at 8.1% of GDP in 2026—the largest in Latin America. Public debt is rising and approaching 90% of GDP. Tax receipts are volatile; spending is rigid (pensions, public sector wages). The government has limited fiscal space for stimulus or investment.',
      externalVulnerability: 'Brazil runs a current account surplus (trade balance positive) but faces external vulnerabilities. Exports are commodity-dependent: agriculture (soybeans, beef, sugar), minerals (iron ore, lithium), oil. Import dependency is acute for capital goods and technology. The currency (Real) is depreciating; external volatility (US interest rates, China growth, global commodity prices) drives capital flows. Public debt is held by international investors (~60% non-resident); sensitive to bond market sentiment. Exposure to China is asymmetric: Brazil exports commodities; China exports manufactured goods. If Chinese growth slows, Brazilian commodity prices fall. Geopolitical risk: US-China rivalry creates pressure on Brazil to choose sides; hedging strategy is under strain.',
      politicalEconomy: 'The economic model benefits commodity exporters (agribusiness, mining companies), financial services, and multinational corporations. Domestic workers, urban poor, and small businesses bear the cost of high interest rates, inflation, and unemployment. This divide maps onto political geography: agribusiness and finance support Bolsonaro; urban workers and public sector employees support Lula. The social contract rests on employment, rising wages, and public services—all under pressure. Inequality is acute; poverty is persistent. Any attempt to raise taxes (to address fiscal deficit) risks alienating business; any attempt to cut spending (pensions, public sector) risks alienating workers. This is a genuine policy dilemma with no easy solution. The 2026 election will be fought over who bears the cost of adjustment.',
    },
    security: {
      internal: 'Brazil faces endemic violence from organized crime. Murder rates are above global averages; Brazil accounts for ~10% of global homicides despite having ~2.7% of world population. Two major criminal organizations dominate: the PCC (First Capital Command) and CV (Comando Vermelho/Red Command). Both have evolved from prison-based drug trafficking organizations into transnational criminal enterprises. The PCC operates across multiple sectors: drug trafficking, money laundering, fuel smuggling, fintech fraud, real estate. The "Hidden Carbon" investigation (August 2025) revealed the PCC had infiltrated the fuel supply chain and operated 1,000+ petrol stations in São Paulo state alone. The CV controls large swaths of Rio de Janeiro and has expanded into other states. Gang violence is concentrated in favelas and peripheral urban areas; gang control affects ~4 million people (roughly one-third of Rio\'s metropolitan population). Police operations are increasingly militarized; the October 2025 raid in Rio killed 120+ people—the deadliest law enforcement operation in Brazilian history. However, police effectiveness is limited; corruption is endemic; many operations backfire and escalate violence. The US is considering designating PCC and CV as foreign terrorist organizations (March 2026), which could trigger escalation.',
      diplomacy: 'Brazil is a BRICS member and emphasizes South-South cooperation. It hedges between the US and China: economic dependence on China (largest trading partner), but security ties with the US. The Amazon is central to Brazil\'s international positioning; environmental commitments are tied to climate agreements and international pressure. Brazil mediates regional disputes in South America; it is a key actor in MERCOSUR (South American trade bloc). NATO is not an option; Brazil maintains strategic autonomy. The Lula government has strengthened ties with China and other Global South partners; it is skeptical of US unilateralism. However, the US still has leverage through security cooperation and investment. Brazil\'s geopolitical position is increasingly contested; the 2026 election could shift alignment if Bolsonaro faction returns to power.',
    },
    actors: {
      domestic: [
        {
          name: 'Luiz Inácio Lula da Silva (PT)',
          interests: 'Re-election; consolidate left-wing coalition; address inequality; environmental protection; BRICS alignment',
          resources: 'Incumbent president; control of federal apparatus; support from urban workers, public sector, progressive movements',
          constraints: 'Low approval (~44%); fiscal crisis limits policy options; congressional fragmentation; polarization',
          likelyMoves: 'Campaign on economic recovery and social programs; attempt to mobilize base against Bolsonaro; may make concessions to centrist coalition partners',
          dealability: 'Medium—willing to negotiate with Congress but ideologically committed to left-wing agenda',
        },
        {
          name: 'Flávio Bolsonaro (Liberal Party)',
          interests: 'Presidency; protect father Jair from prosecution; reverse Lula\'s policies; agribusiness alignment; security hardline',
          resources: 'Bolsonaro family brand; support from evangelical churches, agribusiness, security forces; polling tied with Lula',
          constraints: 'Lack of executive experience; father\'s controversial legacy; institutional constraints; potential legal vulnerabilities',
          likelyMoves: 'Campaign on security and economic liberalization; attack Lula\'s fiscal record; mobilize Bolsonaro base; may contest election results if close',
          dealability: 'Low—ideologically opposed to Lula; family dynamics create unpredictability',
        },
        {
          name: 'Geraldo Alckmin (Vice President, PSB)',
          interests: 'Coalition stability; centrist positioning; potential presidential ambitions (2030)',
          resources: 'Vice presidency; centrist party support; business community ties; São Paulo political machine',
          constraints: 'Subordinate role to Lula; limited independent power base; coalition fragility',
          likelyMoves: 'Mediate between Lula and centrist Congress members; position as moderate alternative; prepare for post-Lula succession',
          dealability: 'High—pragmatic centrist willing to negotiate',
        },
        {
          name: 'PCC (First Capital Command)',
          interests: 'Drug trafficking; money laundering; territorial control; expansion into new sectors (fuel, fintech, real estate)',
          resources: 'Transnational criminal network; infiltration of fuel supply chain; financial resources; prison control; violence capacity',
          constraints: 'Police operations; US terrorist designation pressure; internal conflicts; territorial disputes with CV',
          likelyMoves: 'Expand into new illicit sectors; consolidate fuel supply chain control; respond to police operations with violence; adapt to terrorist designation',
          dealability: 'Very Low—criminal organization; no institutional negotiation possible',
        },
        {
          name: 'CV (Comando Vermelho/Red Command)',
          interests: 'Drug trafficking; territorial control in Rio and expanding states; prison control; violence capacity',
          resources: 'Gang membership; territorial control of favelas; violence capacity; prison networks; drug trafficking routes',
          constraints: 'Police operations; competition with PCC; territorial losses; US terrorist designation pressure',
          likelyMoves: 'Defend territorial control; respond to police operations with violence; expand into other states; adapt to terrorist designation',
          dealability: 'Very Low—criminal organization; no institutional negotiation possible',
        },
      ],
      external: [
        {
          name: 'United States',
          interests: 'Regional stability; counternarcotics cooperation; contain China influence; security alignment; trade access',
          resources: 'Military aid; security cooperation; investment; diplomatic influence; potential terrorist designations for gangs',
          constraints: 'Limited leverage; Brazil\'s hedging strategy; domestic US political constraints; competing priorities',
          likelyMoves: 'Designate PCC/CV as terrorist organizations; pressure Brazil on gang violence; compete with China for influence; support centrist candidates',
          dealability: 'Medium—Brazil willing to cooperate on security but resists alignment pressure',
        },
        {
          name: 'China',
          interests: 'Commodity access (soybeans, iron ore, lithium); market access; BRICS alignment; counterweight to US',
          resources: 'Investment; trade; technology; diplomatic support; BRICS coordination',
          constraints: 'Commodity price volatility; competition with US; Brazil\'s hedging strategy; environmental concerns',
          likelyMoves: 'Increase investment in commodities and infrastructure; support BRICS initiatives; expand trade; coordinate on geopolitical issues',
          dealability: 'High—Brazil actively seeks Chinese investment and partnership',
        },
        {
          name: 'BRICS (Russia, India, South Africa)',
          interests: 'Counterweight to Western dominance; South-South cooperation; alternative financial systems; commodity coordination',
          resources: 'Collective economic weight; alternative institutions (New Development Bank); diplomatic coordination',
          constraints: 'Internal divisions (Russia-Ukraine, India-Pakistan); limited enforcement capacity; Brazil\'s hedging',
          likelyMoves: 'Coordinate on commodity prices; support alternative financial institutions; align on geopolitical issues; expand BRICS membership',
          dealability: 'Medium-High—Brazil committed to BRICS but maintains autonomy',
        },
        {
          name: 'International Financial Markets',
          interests: 'Fiscal sustainability; currency stability; investment returns; risk management',
          resources: 'Capital flows; bond market pricing; credit ratings; investment decisions',
          constraints: 'Limited direct influence; subject to global factors; Brazil\'s policy choices',
          likelyMoves: 'Price in fiscal risk; demand higher yields; potentially trigger capital flight if confidence erodes; reward fiscal consolidation',
          dealability: 'Low—impersonal market forces; no negotiation possible',
        },
      ],
    },
    risks: [
      {
        title: 'Electoral Polarization & Institutional Breakdown',
        trigger: 'Close election result (within 2-3 percentage points); Bolsonaro faction contests results; military makes ambiguous statements; institutional tensions escalate',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '4–6 months (October–December 2026)',
        leadingIndicators: 'Polling tightens; Bolsonaro rhetoric escalates; military statements become political; Congress becomes more polarized; street protests intensify',
        mitigants: 'Electoral Commission transparency; Supreme Court readiness to defend results; international observation; civil society mobilization; military restraint',
      },
      {
        title: 'Fiscal Crisis & Debt Spiral',
        trigger: 'Bond market loses confidence in fiscal sustainability; yields spike; Central Bank forced to raise rates; capital flight accelerates; currency crashes',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '6–18 months (2026–2027)',
        leadingIndicators: 'Fiscal deficit widens; debt-to-GDP ratio rises above 90%; bond yields spike; credit rating downgrade; currency depreciation accelerates',
        mitigants: 'Fiscal consolidation measures (spending cuts, tax increases); Central Bank credibility; international support (IMF); market confidence in post-election government',
      },
      {
        title: 'Criminal Violence Escalation & Gang Territorial Expansion',
        trigger: 'US designates PCC/CV as terrorist organizations; police operations intensify; gangs respond with violence; territorial control expands to new cities; major police operation backfires',
        probability: 'Med',
        impact: 'Med',
        timeHorizon: '3–12 months (2026–2027)',
        leadingIndicators: 'Police operations increase; gang violence spikes; territorial control expands; US terrorist designations announced; gang retaliation against police/civilians',
        mitigants: 'Evidence-based security policies; community policing; gang violence prevention programs; international cooperation; institutional reform of security forces',
      },
      {
        title: 'Currency Crisis & Capital Flight',
        trigger: 'External shock (US rate hike, China slowdown, commodity price collapse); Real depreciates sharply; capital flight accelerates; Central Bank reserves deplete; emergency measures required',
        probability: 'Med',
        impact: 'Med',
        timeHorizon: '6–18 months (2026–2027)',
        leadingIndicators: 'Real weakens past 6.5 per USD; capital outflows accelerate; Central Bank reserves fall; international spreads widen; credit default swap spreads spike',
        mitigants: 'Central Bank intervention; capital controls (if necessary); fiscal consolidation; external support (IMF, multilateral); commodity price recovery',
      },
      {
        title: 'Amazon Deforestation & Environmental Collapse',
        trigger: 'Organized crime expands illegal logging and mining; deforestation accelerates; international pressure increases; environmental tipping point approaches; indigenous territories threatened',
        probability: 'Med',
        impact: 'Med',
        timeHorizon: '12–24 months (2026–2027)',
        leadingIndicators: 'Deforestation rates rise; illegal mining expands; gang control of Amazon increases; international pressure mounts; climate commitments at risk',
        mitigants: 'Environmental enforcement; indigenous land protection; international climate finance; sustainable development alternatives; gang disruption',
      },
      {
        title: 'Coalition Collapse & Government Paralysis',
        trigger: 'Major coalition partner defects; Congress becomes ungovernable; key legislation fails; president\'s authority erodes; gridlock deepens',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '6–12 months (2026–2027)',
        leadingIndicators: 'Coalition tensions rise; key votes fail; party defections; presidential approval falls further; Congress becomes more oppositional',
        mitigants: 'Coalition management; legislative negotiation; concessions to key partners; presidential authority; institutional resilience',
      },
    ],
    sources: [
      {
        name: 'BBVA Research',
        url: 'https://www.bbvaresearch.com/en/publicaciones/brazil-economic-outlook-march-2026/',
        desc: 'Brazil Economic Outlook (March 2026) - Comprehensive macroeconomic analysis covering GDP growth, inflation, fiscal deficit, monetary policy, and currency outlook.',
      },
      {
        name: 'AS/COA (Americas Society/Council of the Americas)',
        url: 'https://www.as-coa.org/articles/latam-focus-whats-table-brazils-security-issues-ahead-2026-elections',
        desc: 'LatAm in Focus: Brazil\'s Security Issues ahead of 2026 Elections - Analysis of criminal organizations (PCC, CV), gang violence, and security challenges.',
      },
      {
        name: 'BTI Transformation Index',
        url: 'https://bti-project.org/en/reports/country-report/BRA',
        desc: 'Brazil Country Report 2026 - Assessment of democratic governance, institutional resilience, and political stability.',
      },
      {
        name: 'Brazilian Central Bank (BCB)',
        url: 'https://www.bcb.gov.br/en/statistics/fiscalstatistics',
        desc: 'Fiscal Statistics and Monetary Policy Reports - Official data on interest rates, inflation, fiscal deficit, and public debt.',
      },
      {
        name: 'Reuters',
        url: 'https://www.reuters.com/world/americas/',
        desc: 'Reuters Americas Coverage - Breaking news on Brazil\'s elections, economy, and security situation.',
      },
      {
        name: 'The Dialogue (Inter-American Dialogue)',
        url: 'https://thedialogue.org/analysis/what-will-shape-brazils-2026-elections-brazil-program-launches-ground-truth-elections-2026',
        desc: 'Ground Truth: Elections 2026 - Year-long project analyzing Brazil\'s 2026 electoral dynamics and implications.',
      },
      {
        name: 'Folha de S.Paulo',
        url: 'https://www1.folha.uol.com.br/',
        desc: 'Leading Brazilian newspaper - Daily coverage of politics, economy, and security.',
      },
    ],
  },
  fr: {
    executiveSnapshot: [
      'Type de régime : République présidentielle (Congrès bicaméral : Sénat 81 sièges, Chambre 513 sièges). Le pouvoir exécutif est détenu par le Président et le Cabinet. Luiz Inácio Lula da Silva (Parti des travailleurs/PT) est président depuis 2023, en quête d\'un 4e mandat aux élections d\'octobre 2026.',
      'Équilibre politique : Hautement polarisé. L\'approbation de Lula ~44%, désapprobation ~51% (mars 2026). Opposition menée par Flávio Bolsonaro (soutenu par son père Jair Bolsonaro) en égalité avec Lula dans les scénarios de second tour. Coalition fragile ; Lula a forcé un remaniement ministériel (mars 2026) pour renforcer l\'unité. Le Congrès est fragmenté entre 30+ partis ; aucun parti n\'est dominant. La démocratie institutionnelle est résiliente mais la polarisation est aiguë.',
      'Modèle économique : Grande économie de revenu intermédiaire (PIB nominal ~2,1 billions de dollars). Structure duelle : (1) Exportations de matières premières (agriculture, minéraux, pétrole) ; (2) Services et fabrication. Les pressions inflationnistes augmentent ; le déficit budgétaire prévu est de 8,1 % du PIB (2026)—le plus grand d\'Amérique latine. La dette publique augmente. Le taux Selic est à 14,75 % (mars 2026). Croissance prévue 1,7 % (2026), en dessous du potentiel. Instabilité monétaire ; le Real se déprécie.',
      'Top 3 risques (6–18 mois) : (1) Polarisation électorale et stress institutionnel si la faction Bolsonaro conteste les résultats ou intensifie la confrontation ; (2) Crise budgétaire due à un déficit insoutenable et à une dette croissante, forçant l\'austérité ou risquant le défaut ; (3) Escalade de la violence criminelle alors que le PCC et le CV diversifient les opérations et que les États-Unis les désignent comme organisations terroristes.',
      'Top 3 éléments à surveiller (4–12 semaines) : (1) Résultats des élections du 4 octobre 2026 et conséquences immédiates—risque de rupture institutionnelle si le résultat serré est contesté ; (2) Politique monétaire de la Banque centrale et stabilité monétaire—la faiblesse du Real pourrait déclencher des fuites de capitaux ; (3) Escalade de la violence des gangs et opérations policières—risque de déstabilisation si les opérations majeures échouent.',
      'Dépendances externes : Les exportations de pétrole et de matières premières sont vulnérables aux chocs des prix mondiaux. Dépendance commerciale envers la Chine (plus grand partenaire commercial) ; coopération en sécurité avec les États-Unis ; alignement BRICS. La déforestation amazonienne est liée à la criminalité organisée ; menace de sécurité environnementale. Couverture géopolitique entre la rivalité États-Unis-Chine.',
      'Posture de sécurité : Violence interne élevée (taux de meurtres au-dessus des moyennes mondiales). Les organisations criminelles (PCC, CV) opèrent comme des entreprises transnationales ; infiltration de la chaîne d\'approvisionnement du carburant, de la fintech, de l\'immobilier. Les opérations policières sont de plus en plus militarisées ; le raid de Rio d\'octobre 2025 a tué 120+ personnes (l\'opération la plus meurtrière de l\'application de la loi dans l\'histoire du pays). Le contrôle des gangs des favelas affecte ~4 millions de personnes. Les États-Unis envisagent de désigner le PCC/CV comme organisations terroristes.',
      'Orientation diplomatique : Membre des BRICS ; accent sur la coopération Sud-Sud. Couverture entre les États-Unis et la Chine ; dépendance économique de Pékin, liens de sécurité avec Washington. La protection de l\'Amazonie est centrale au positionnement international du Brésil ; les engagements environnementaux sont liés aux accords climatiques et à la pression internationale. Le Brésil médiatise les différends régionaux en Amérique du Sud ; acteur clé du MERCOSUR (bloc commercial sud-américain).',
      'Confiance dans les données : Moyen-Élevé. Le Brésil dispose de données institutionnelles solides (Banque centrale, statistiques IBGE). Presse libre (Folha, O Globo, Estadão). Cependant, les données sur la violence des gangs sont incomplètes ; les opérations de sécurité manquent de transparence. Les sondages électoraux sont soumis à l\'incertitude.',
      'Perspective de base : Volatilité élevée jusqu\'aux élections d\'octobre 2026. Trois points critiques : (1) Campagne électorale (avril–octobre 2026)—la polarisation est susceptible de s\'intensifier ; (2) Jour des élections du 4 octobre et conséquences immédiates—stress institutionnel si contesté ; (3) Transition post-électorale (novembre–décembre 2026)—risque de confrontation si la faction Bolsonaro rejette les résultats. La crise budgétaire est un risque à long terme ; la violence criminelle est un risque aigu. Le gagnant fera face à un espace budgétaire limité et à des défis de sécurité.',
    ],
    political: {
      powerStructure: 'Le président brésilien détient une autorité exécutive importante mais dépend du soutien du Congrès pour la législation. Lula dirige une coalition fragmentée entre 30+ partis ; aucun parti ne contrôle le Congrès. La Chambre des députés (513 sièges) est très fractionnée ; le Sénat (81 sièges) offre une certaine stabilité. La magistrature est indépendante mais de plus en plus politisée ; la Cour suprême (STF) est devenue un champ de bataille entre la gauche et la droite. L\'armée est institutionnellement fidèle à la constitution mais a une mémoire historique de la dictature et intervient rhétoriquement dans la politique. Les forces de sécurité (Police fédérale, Police militaire d\'État) sont fragmentées et souvent corrompues ; la violence des gangs dépasse la capacité policière dans de nombreuses régions.',
      stabilityDrivers: 'La légitimité repose sur les élections démocratiques et la performance économique. L\'élection de 2022 (victoire étroite de Lula sur Bolsonaro) a été contestée mais acceptée. Le Congrès est diversifié ; aucune faction unique ne peut imposer un régime autoritaire. La magistrature, malgré la politisation, a défendu les normes démocratiques. La société civile est active ; les médias sont pluralistes. Cependant, la polarisation est aiguë—la base de Bolsonaro (en particulier les églises évangéliques et l\'agro-industrie) considère Lula comme illégitime ; la base de Lula considère Bolsonaro comme une menace pour la démocratie. Cette délégitimation mutuelle est le risque de stabilité fondamental.',
      shockAbsorbers: 'Amortisseurs : Économie diversifiée (agriculture, fabrication, services, exploitation minière). Grand marché intérieur. Base d\'exportation de matières premières offrant des revenus. Expérience institutionnelle des transitions démocratiques. Accélérateurs : Le déficit budgétaire est insoutenable ; si les marchés obligataires perdent confiance, l\'austérité forcée pourrait déclencher des troubles sociaux. La violence criminelle s\'étend à des zones auparavant sûres (Chili, Uruguay) ; si les gangs déstabilisent les grandes villes, la capacité institutionnelle pourrait s\'effondrer. Une dispute électorale pourrait déclencher une rupture institutionnelle ; si la faction Bolsonaro conteste les résultats, l\'armée pourrait être impliquée dans la politique.',
    },
    economy: {
      macroReality: 'L\'économie brésilienne est grande mais la croissance est lente. La croissance du PIB était de 2,3 % en 2025, prévue à 1,7 % en 2026 et 2,2 % en 2027—en dessous du potentiel (~2,3 %). L\'inflation se modère mais reste élevée ; prévue ~4 % pour 2026, près de la limite supérieure de la fourchette cible de 1,5–4,5 %. La Banque centrale a réduit le taux Selic à 14,75 % en mars 2026 (à partir de niveaux plus élevés) mais reste restrictive. Le chômage est modéré (~4,2 %) mais le sous-emploi est élevé. La situation budgétaire est grave : le déficit du gouvernement général est prévu à 8,1 % du PIB en 2026—le plus grand d\'Amérique latine. La dette publique augmente et approche 90 % du PIB. Les recettes fiscales sont volatiles ; les dépenses sont rigides (pensions, salaires du secteur public). Le gouvernement a un espace budgétaire limité pour les stimuli ou les investissements.',
      externalVulnerability: 'Le Brésil enregistre un excédent du compte courant (balance commerciale positive) mais fait face à des vulnérabilités externes. Les exportations dépendent des matières premières : agriculture (soja, bœuf, sucre), minéraux (minerai de fer, lithium), pétrole. La dépendance aux importations est aiguë pour les biens d\'équipement et la technologie. La monnaie (Real) se déprécie ; la volatilité externe (taux d\'intérêt américains, croissance chinoise, prix des matières premières mondiales) détermine les flux de capitaux. La dette publique est détenue par des investisseurs internationaux (~60 % non-résidents) ; sensible au sentiment du marché obligataire. L\'exposition à la Chine est asymétrique : le Brésil exporte des matières premières ; la Chine exporte des biens manufacturés. Si la croissance chinoise ralentit, les prix des matières premières brésiliennes baissent. Risque géopolitique : la rivalité États-Unis-Chine crée une pression sur le Brésil pour qu\'il choisisse un camp ; la stratégie de couverture est sous tension.',
      politicalEconomy: 'Le modèle économique profite aux exportateurs de matières premières (agro-industrie, sociétés minières), aux services financiers et aux sociétés multinationales. Les travailleurs nationaux, les pauvres urbains et les petites entreprises supportent le coût des taux d\'intérêt élevés, de l\'inflation et du chômage. Cette division correspond à la géographie politique : l\'agro-industrie et la finance soutiennent Bolsonaro ; les travailleurs urbains et les employés du secteur public soutiennent Lula. Le contrat social repose sur l\'emploi, la hausse des salaires et les services publics—tous sous pression. L\'inégalité est aiguë ; la pauvreté est persistante. Toute tentative d\'augmenter les impôts (pour résoudre le déficit budgétaire) risque d\'aliéner les entreprises ; toute tentative de réduire les dépenses (pensions, secteur public) risque d\'aliéner les travailleurs. C\'est un véritable dilemme politique sans solution facile. L\'élection de 2026 sera menée sur la question de savoir qui supportera le coût de l\'ajustement.',
    },
    security: {
      internal: 'Le Brésil fait face à la violence endémique de la criminalité organisée. Les taux de meurtres sont au-dessus des moyennes mondiales ; le Brésil représente ~10 % des homicides mondiaux malgré ~2,7 % de la population mondiale. Deux organisations criminelles majeures dominent : le PCC (Primeiro Comando da Capital) et le CV (Comando Vermelho). Les deux ont évolué d\'organisations de trafic de drogue basées en prison à des entreprises criminelles transnationales. Le PCC opère dans plusieurs secteurs : trafic de drogue, blanchiment d\'argent, contrebande de carburant, fraude fintech, immobilier. L\'enquête « Hidden Carbon » (août 2025) a révélé que le PCC avait infiltré la chaîne d\'approvisionnement du carburant et exploitait 1 000+ stations-service dans l\'État de São Paulo seul. Le CV contrôle de vastes zones de Rio de Janeiro et s\'est étendu à d\'autres États. La violence des gangs est concentrée dans les favelas et les zones urbaines périphériques ; le contrôle des gangs affecte ~4 millions de personnes (environ un tiers de la population métropolitaine de Rio). Les opérations policières sont de plus en plus militarisées ; le raid de Rio d\'octobre 2025 a tué 120+ personnes—l\'opération la plus meurtrière de l\'application de la loi de l\'histoire brésilienne. Cependant, l\'efficacité policière est limitée ; la corruption est endémique ; de nombreuses opérations échouent et escaladent la violence. Les États-Unis envisagent de désigner le PCC et le CV comme organisations terroristes étrangères (mars 2026), ce qui pourrait déclencher une escalade.',
      diplomacy: 'Le Brésil est membre des BRICS et met l\'accent sur la coopération Sud-Sud. Il se couvre entre les États-Unis et la Chine : dépendance économique de la Chine (plus grand partenaire commercial), mais liens de sécurité avec les États-Unis. L\'Amazonie est centrale au positionnement international du Brésil ; les engagements environnementaux sont liés aux accords climatiques et à la pression internationale. Le Brésil médiatise les différends régionaux en Amérique du Sud ; c\'est un acteur clé du MERCOSUR (bloc commercial sud-américain). L\'OTAN n\'est pas une option ; le Brésil maintient l\'autonomie stratégique. Le gouvernement Lula a renforcé les liens avec la Chine et d\'autres partenaires du Sud global ; il est sceptique face à l\'unilatéralisme américain. Cependant, les États-Unis ont toujours un effet de levier grâce à la coopération en sécurité et aux investissements. La position géopolitique du Brésil est de plus en plus contestée ; l\'élection de 2026 pourrait changer l\'alignement si la faction Bolsonaro revient au pouvoir.',
    },
    actors: {
      domestic: [
        {
          name: 'Luiz Inácio Lula da Silva (PT)',
          interests: 'Réélection ; consolider la coalition de gauche ; réduire les inégalités ; protection de l\'environnement ; alignement BRICS',
          resources: 'Président sortant ; contrôle de l\'appareil fédéral ; soutien des travailleurs urbains, du secteur public, des mouvements progressistes',
          constraints: 'Approbation faible (~44 %) ; la crise budgétaire limite les options politiques ; fragmentation du Congrès ; polarisation',
          likelyMoves: 'Campagne sur la reprise économique et les programmes sociaux ; tentative de mobiliser la base contre Bolsonaro ; peut faire des concessions aux partenaires de coalition centristes',
          dealability: 'Moyen—disposé à négocier avec le Congrès mais engagé idéologiquement dans l\'agenda de gauche',
        },
        {
          name: 'Flávio Bolsonaro (Parti libéral)',
          interests: 'Présidence ; protéger le père Jair des poursuites ; inverser les politiques de Lula ; alignement agro-industrie ; ligne dure en sécurité',
          resources: 'Marque de la famille Bolsonaro ; soutien des églises évangéliques, de l\'agro-industrie, des forces de sécurité ; sondages en égalité avec Lula',
          constraints: 'Manque d\'expérience exécutive ; héritage controversé du père ; contraintes institutionnelles ; vulnérabilités juridiques potentielles',
          likelyMoves: 'Campagne sur la sécurité et la libéralisation économique ; attaquer le bilan budgétaire de Lula ; mobiliser la base Bolsonaro ; peut contester les résultats électoraux si serré',
          dealability: 'Faible—idéologiquement opposé à Lula ; la dynamique familiale crée l\'imprévisibilité',
        },
        {
          name: 'Geraldo Alckmin (Vice-Président, PSB)',
          interests: 'Stabilité de la coalition ; positionnement centriste ; ambitions présidentielles potentielles (2030)',
          resources: 'Vice-présidence ; soutien du parti centriste ; liens avec la communauté des affaires ; machine politique de São Paulo',
          constraints: 'Rôle subordonné à Lula ; base de pouvoir indépendante limitée ; fragilité de la coalition',
          likelyMoves: 'Médiatiser entre Lula et les membres du Congrès centristes ; se positionner comme alternative modérée ; préparer la succession post-Lula',
          dealability: 'Élevé—centriste pragmatique disposé à négocier',
        },
        {
          name: 'PCC (Primeiro Comando da Capital)',
          interests: 'Trafic de drogue ; blanchiment d\'argent ; contrôle territorial ; expansion dans de nouveaux secteurs (carburant, fintech, immobilier)',
          resources: 'Réseau criminel transnational ; infiltration de la chaîne d\'approvisionnement du carburant ; ressources financières ; contrôle des prisons ; capacité de violence',
          constraints: 'Opérations policières ; pression de désignation terroriste américaine ; conflits internes ; différends territoriaux avec le CV',
          likelyMoves: 'Expansion dans de nouveaux secteurs illicites ; consolider le contrôle de la chaîne d\'approvisionnement du carburant ; répondre aux opérations policières par la violence ; adapter à la désignation terroriste',
          dealability: 'Très faible—organisation criminelle ; aucune négociation institutionnelle possible',
        },
        {
          name: 'CV (Comando Vermelho)',
          interests: 'Trafic de drogue ; contrôle territorial à Rio et États en expansion ; contrôle des prisons ; capacité de violence',
          resources: 'Membres de gangs ; contrôle territorial des favelas ; capacité de violence ; réseaux pénitentiaires ; routes de trafic de drogue',
          constraints: 'Opérations policières ; concurrence avec le PCC ; pertes territoriales ; pression de désignation terroriste américaine',
          likelyMoves: 'Défendre le contrôle territorial ; répondre aux opérations policières par la violence ; s\'étendre à d\'autres États ; adapter à la désignation terroriste',
          dealability: 'Très faible—organisation criminelle ; aucune négociation institutionnelle possible',
        },
      ],
      external: [
        {
          name: 'États-Unis',
          interests: 'Stabilité régionale ; coopération contre la drogue ; contenir l\'influence chinoise ; alignement en sécurité ; accès commercial',
          resources: 'Aide militaire ; coopération en sécurité ; investissement ; influence diplomatique ; désignations terroristes potentielles pour les gangs',
          constraints: 'Effet de levier limité ; stratégie de couverture du Brésil ; contraintes politiques américaines nationales ; priorités concurrentes',
          likelyMoves: 'Désigner le PCC/CV comme organisations terroristes ; faire pression sur le Brésil sur la violence des gangs ; concurrencer la Chine pour l\'influence ; soutenir les candidats centristes',
          dealability: 'Moyen—le Brésil disposé à coopérer en sécurité mais résiste à la pression d\'alignement',
        },
        {
          name: 'Chine',
          interests: 'Accès aux matières premières (soja, minerai de fer, lithium) ; accès au marché ; alignement BRICS ; contrepoids aux États-Unis',
          resources: 'Investissement ; commerce ; technologie ; soutien diplomatique ; coordination BRICS',
          constraints: 'Volatilité des prix des matières premières ; concurrence avec les États-Unis ; stratégie de couverture du Brésil ; préoccupations environnementales',
          likelyMoves: 'Augmenter l\'investissement dans les matières premières et l\'infrastructure ; soutenir les initiatives BRICS ; élargir le commerce ; coordonner sur les questions géopolitiques',
          dealability: 'Élevé—le Brésil cherche activement l\'investissement et le partenariat chinois',
        },
        {
          name: 'BRICS (Russie, Inde, Afrique du Sud)',
          interests: 'Contrepoids à la domination occidentale ; coopération Sud-Sud ; systèmes financiers alternatifs ; coordination des matières premières',
          resources: 'Poids économique collectif ; institutions alternatives (Banque de développement nouvelle) ; coordination diplomatique',
          constraints: 'Divisions internes (Russie-Ukraine, Inde-Pakistan) ; capacité d\'application limitée ; couverture du Brésil',
          likelyMoves: 'Coordonner sur les prix des matières premières ; soutenir les institutions financières alternatives ; s\'aligner sur les questions géopolitiques ; élargir l\'adhésion aux BRICS',
          dealability: 'Moyen-Élevé—le Brésil engagé envers les BRICS mais maintient l\'autonomie',
        },
        {
          name: 'Marchés financiers internationaux',
          interests: 'Durabilité budgétaire ; stabilité monétaire ; rendements des investissements ; gestion des risques',
          resources: 'Flux de capitaux ; tarification du marché obligataire ; notations de crédit ; décisions d\'investissement',
          constraints: 'Influence directe limitée ; soumis à des facteurs mondiaux ; choix politiques du Brésil',
          likelyMoves: 'Tarifier le risque budgétaire ; exiger des rendements plus élevés ; potentiellement déclencher des fuites de capitaux si la confiance s\'érode ; récompenser la consolidation budgétaire',
          dealability: 'Faible—forces de marché impersonnelles ; aucune négociation possible',
        },
      ],
    },
    risks: [
      {
        title: 'Polarisation électorale et rupture institutionnelle',
        trigger: 'Résultat électoral serré (dans les 2-3 points de pourcentage) ; la faction Bolsonaro conteste les résultats ; l\'armée fait des déclarations ambiguës ; les tensions institutionnelles s\'aggravent',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '4–6 mois (octobre–décembre 2026)',
        leadingIndicators: 'Les sondages se resserrent ; la rhétorique de Bolsonaro s\'intensifie ; les déclarations militaires deviennent politiques ; le Congrès devient plus polarisé ; les manifestations de rue s\'intensifient',
        mitigants: 'Transparence de la Commission électorale ; préparation de la Cour suprême à défendre les résultats ; observation internationale ; mobilisation de la société civile ; retenue militaire',
      },
      {
        title: 'Crise budgétaire et spirale d\'endettement',
        trigger: 'Le marché obligataire perd confiance dans la durabilité budgétaire ; les rendements montent en flèche ; la Banque centrale est forcée de relever les taux ; les fuites de capitaux s\'accélèrent ; la monnaie s\'effondre',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '6–18 mois (2026–2027)',
        leadingIndicators: 'Le déficit budgétaire s\'élargit ; le ratio dette/PIB dépasse 90 % ; les rendements obligataires montent en flèche ; dégradation de la notation de crédit ; la dépréci ation monétaire s\'accélère',
        mitigants: 'Mesures de consolidation budgétaire (réductions de dépenses, augmentations d\'impôts) ; crédibilité de la Banque centrale ; soutien international (FMI) ; confiance du marché dans le gouvernement post-élection',
      },
      {
        title: 'Escalade de la violence criminelle et expansion territoriale des gangs',
        trigger: 'Les États-Unis désignent le PCC/CV comme organisations terroristes ; les opérations policières s\'intensifient ; les gangs répondent par la violence ; le contrôle territorial s\'étend à de nouvelles villes ; une opération policière majeure échoue',
        probability: 'Med',
        impact: 'Med',
        timeHorizon: '3–12 mois (2026–2027)',
        leadingIndicators: 'Les opérations policières augmentent ; la violence des gangs monte en flèche ; le contrôle territorial s\'étend ; les désignations terroristes américaines sont annoncées ; les représailles des gangs contre la police/civils',
        mitigants: 'Politiques de sécurité fondées sur des preuves ; police communautaire ; programmes de prévention de la violence des gangs ; coopération internationale ; réforme institutionnelle des forces de sécurité',
      },
      {
        title: 'Crise monétaire et fuite de capitaux',
        trigger: 'Choc externe (hausse des taux américains, ralentissement chinois, effondrement des prix des matières premières) ; le Real se déprécie fortement ; les fuites de capitaux s\'accélèrent ; les réserves de la Banque centrale s\'épuisent ; des mesures d\'urgence sont nécessaires',
        probability: 'Med',
        impact: 'Med',
        timeHorizon: '6–18 mois (2026–2027)',
        leadingIndicators: 'Le Real s\'affaiblit au-delà de 6,5 par USD ; les sorties de capitaux s\'accélèrent ; les réserves de la Banque centrale baissent ; les écarts internationaux s\'élargissent ; les écarts de swap de défaut de crédit montent en flèche',
        mitigants: 'Intervention de la Banque centrale ; contrôles des capitaux (si nécessaire) ; consolidation budgétaire ; soutien externe (FMI, multilatéraux) ; reprise des prix des matières premières',
      },
      {
        title: 'Déforestation amazonienne et effondrement environnemental',
        trigger: 'La criminalité organisée étend l\'exploitation forestière et l\'exploitation minière illégales ; la déforestation s\'accélère ; la pression internationale augmente ; le point de basculement environnemental approche ; les territoires autochtones sont menacés',
        probability: 'Med',
        impact: 'Med',
        timeHorizon: '12–24 mois (2026–2027)',
        leadingIndicators: 'Les taux de déforestation augmentent ; l\'exploitation minière illégale s\'étend ; le contrôle des gangs de l\'Amazonie augmente ; la pression internationale monte ; les engagements climatiques sont en danger',
        mitigants: 'Application environnementale ; protection des terres autochtones ; financement climatique international ; alternatives de développement durable ; perturbation des gangs',
      },
      {
        title: 'Effondrement de la coalition et paralysie gouvernementale',
        trigger: 'Un partenaire majeur de la coalition se retire ; le Congrès devient ingouvernable ; la législation clé échoue ; l\'autorité du président s\'érode ; l\'impasse s\'approfondit',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '6–12 mois (2026–2027)',
        leadingIndicators: 'Les tensions de coalition augmentent ; les votes clés échouent ; les défections de partis ; l\'approbation présidentielle baisse davantage ; le Congrès devient plus oppositionnelle',
        mitigants: 'Gestion de la coalition ; négociation législative ; concessions aux partenaires clés ; autorité présidentielle ; résilience institutionnelle',
      },
    ],
    sources: [
      {
        name: 'BBVA Research',
        url: 'https://www.bbvaresearch.com/en/publicaciones/brazil-economic-outlook-march-2026/',
        desc: 'Perspective économique du Brésil (mars 2026) - Analyse macroéconomique complète couvrant la croissance du PIB, l\'inflation, le déficit budgétaire, la politique monétaire et les perspectives de change.',
      },
      {
        name: 'AS/COA (Americas Society/Council of the Americas)',
        url: 'https://www.as-coa.org/articles/latam-focus-whats-table-brazils-security-issues-ahead-2026-elections',
        desc: 'LatAm in Focus : Les enjeux de sécurité du Brésil avant les élections de 2026 - Analyse des organisations criminelles (PCC, CV), de la violence des gangs et des défis de sécurité.',
      },
      {
        name: 'BTI Transformation Index',
        url: 'https://bti-project.org/en/reports/country-report/BRA',
        desc: 'Rapport sur le Brésil 2026 - Évaluation de la gouvernance démocratique, de la résilience institutionnelle et de la stabilité politique.',
      },
      {
        name: 'Banque centrale du Brésil (BCB)',
        url: 'https://www.bcb.gov.br/en/statistics/fiscalstatistics',
        desc: 'Statistiques budgétaires et rapports de politique monétaire - Données officielles sur les taux d\'intérêt, l\'inflation, le déficit budgétaire et la dette publique.',
      },
      {
        name: 'Reuters',
        url: 'https://www.reuters.com/world/americas/',
        desc: 'Couverture Reuters Amériques - Nouvelles de dernière minute sur les élections, l\'économie et la situation de sécurité du Brésil.',
      },
      {
        name: 'The Dialogue (Inter-American Dialogue)',
        url: 'https://thedialogue.org/analysis/what-will-shape-brazils-2026-elections-brazil-program-launches-ground-truth-elections-2026',
        desc: 'Ground Truth : Élections 2026 - Projet d\'un an analysant la dynamique électorale du Brésil en 2026 et ses implications.',
      },
      {
        name: 'Folha de S.Paulo',
        url: 'https://www1.folha.uol.com.br/',
        desc: 'Principal journal brésilien - Couverture quotidienne de la politique, l\'économie et la sécurité.',
      },
    ],
  },
};
