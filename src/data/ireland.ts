/*
 * TransHorizons — Ireland Country Analysis Data
 * Full bilingual content following the Country Situation Report framework
 * Last updated: April 2026
 * Sources: Irish Government, Central Bank of Ireland, CSO, OECD, EU Commission, Reuters, RTE, Irish Times
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

export const irelandAnalysis: AnalysisContent = {
  lastUpdated: '2026-04-10',
  scorecard: {
    eliteCohesion: 'Med',
    securityLoyalty: 'High',
    economicPressure: 'Med',
    protestCapacity: 'Med',
    institutionalResilience: 'High',
  },
  en: {
    executiveSnapshot: [
      'Regime type: Parliamentary republic (unicameral Dáil Éireann). Executive power held by Taoiseach (Prime Minister) and Cabinet. Micheál Martin (Fianna Fáil) is Taoiseach until November 2027, when Simon Harris (Fine Gael) assumes office under a rotating leadership agreement.',
      'Political equilibrium: Coalition government formed January 2025 between Fianna Fáil and Fine Gael with support from independent TDs. No single party has majority; government depends on 10 independent deputies and Green Party abstention. Fragile but functional. Two by-elections (Galway West, Dublin Central) scheduled for early 2026 will test coalition stability.',
      'Economic model: Advanced services economy with dual engines: (1) Multinational tech/pharma sector (Apple, Google, Meta, Microsoft data centers; Pfizer, Merck pharma); (2) Traditional sectors (agriculture, tourism, financial services). Nominal GDP ~€550 billion. FDI-dependent with 12.5% → 15% corporation tax under OECD Pillar Two. Data centers consume 21% of national electricity (projected 32% by 2026), creating grid stress.',
      'Top 3 risks (6–18 months): (1) Energy crisis from data center demand exceeding grid capacity — rolling blackouts possible; (2) Coalition collapse if by-elections weaken government or internal tensions escalate; (3) Housing/cost-of-living crisis deepening, triggering social unrest and constraining government reform agenda.',
      'Top 3 watch items (4–12 weeks): (1) By-election results and opposition coordination — will determine government operating space; (2) Data center connection policy implementation (CRU December 2025 ruling on 80% renewable energy requirement); (3) Budget 2027 preparation — last meaningful policy budget before 2027 general election.',
      'External dependencies: Energy imports (oil, gas — Ireland generates ~30% from renewables, rest from imports and fossil fuels). EU single market for trade (exports €16.2B January 2026). UK trade post-Brexit (Northern Ireland protocol creates friction). NATO cooperation without membership (military neutrality policy, but increasing NATO interoperability).',
      'Security posture: No active insurgency. Low terrorism threat. Minimal military capability (0.2% of GDP defense spending, ~7,500 active personnel). Increasing NATO cooperation and EU defense integration. Deploying first defense attachés to US, UK, France (March 2026). €1.7 billion defense investment plan announced (radar, sonar, helicopters). Neutrality policy under strain from Ukraine conflict.',
      'Diplomatic orientation: Core EU member (holds EU Presidency July–December 2026). UN Security Council non-permanent member (2028–2029). NATO partner but not member. Historically neutral, but increasingly aligned with Western security architecture. Balancing act: maintaining military neutrality while deepening NATO/EU defense ties.',
      'Data confidence: High — Ireland has strong institutional data (CSO, Central Bank, Government Statistics). Free press. Transparent governance. However, some data on tech sector concentration and tax arrangements is contested.',
      'Baseline outlook: Managed stability through 2026 with three critical junctures: (1) By-elections (early 2026) — if opposition gains ground, government becomes more cautious; (2) EU Presidency (July–December 2026) — international visibility but domestic delivery risk; (3) Budget 2027 (autumn 2026) — last chance for structural reform before 2027 election. Energy crisis is the wild card — grid constraints could force hard choices on data center growth vs. climate commitments vs. economic competitiveness.',
    ],
    political: {
      powerStructure: 'The Taoiseach holds executive authority but depends on parliamentary confidence. Micheál Martin (Fianna Fáil) leads until November 2027, when Simon Harris (Fine Gael) takes over under a pre-agreed rotation. This arrangement creates a lame-duck dynamic — Martin\'s authority is already eroding as his successor waits in the wings. The Dáil has 160 seats; the coalition controls 88 (Fianna Fáil 48, Fine Gael 38, Greens 2) plus 10 independent TDs. This is a bare majority with no buffer. Sinn Féin (37 seats) is the largest opposition party but fractured left (Labour, Social Democrats, People Before Profit) prevents a credible alternative government. The judiciary is independent and strong. The civil service is professional and loyal to the constitutional order. Media is pluralistic (RTE, Irish Times, Independent, Examiner) with reasonable editorial independence.',
      stabilityDrivers: 'Legitimacy rests on democratic elections and economic performance — Ireland\'s "Celtic Tiger" legacy creates high expectations for prosperity. The security forces (An Garda Síochána, Defence Forces) are loyal to the constitutional order. Elite consensus around EU membership and NATO cooperation is strong, though contested on neutrality. The coalition is held together by fear of Sinn Féin (left-wing, nationalist) and the absence of viable alternatives. Fianna Fáil and Fine Gael are ideologically similar center-right parties with a history of alternating power. The rotation agreement (Martin → Harris) was designed to prevent leadership contests destabilizing the coalition, but it also signals that both leaders are already looking beyond 2026. The 2024 election showed remarkable continuity — the same three blocs (center-right, left, nationalist) with minimal change in vote share, suggesting institutional resilience.',
      shockAbsorbers: 'Absorbers: Strong capital markets and AAA-adjacent sovereign credit (rated AA+ by S&P). European Central Bank backstop as part of the Eurozone. Diversified export base (tech, pharma, agriculture, finance). Flexible labor market. Absorbers: Deep institutional capacity and civil service continuity. Accelerants: Energy crisis from data center demand could trigger rolling blackouts, undermining competitiveness and investor confidence. Housing shortage and cost-of-living crisis eroding purchasing power and social cohesion. Coalition fragility means limited room for difficult policy choices. By-election losses could trigger leadership challenges or defections. Sinn Féin\'s rise (now largest opposition party) creates pressure for left-wing policies (wealth tax, rent controls) that would be economically disruptive if implemented.',
    },
    economy: {
      macroReality: 'GDP growth is volatile due to multinational activity. Nominal GDP grew 10.7% in 2025 (largely statistical — reflects tech sector repatriation of profits). Modified Domestic Demand (MDD) — a better measure of actual economic activity — is forecast at 2.1% for 2026, rising to 2.8% in 2027. Inflation is moderate (2.4% February 2026) but rising due to base effects (end of energy credits, third-level fees). Unemployment is low (~4.2%). However, the labor market is tight and wage pressures are building. Public finances are sound (deficit ~1.5% of GDP, debt ~82% of GDP). Tax receipts are volatile — corporate tax receipts depend on multinational profit flows, which are sensitive to global economic conditions and tax policy changes. The government is constrained by EU fiscal rules and domestic prudence, limiting scope for large fiscal stimulus.',
      externalVulnerability: 'Ireland runs a persistent current account surplus (trade balance €4.83B January 2026), but this masks structural vulnerabilities. Exports are heavily concentrated in tech (data centers, software), pharma, and agriculture. Import dependency is acute for energy — Ireland imports ~90% of oil and gas. The energy crisis from data center demand is the acute vulnerability: if grid constraints force data center relocations, GDP growth could slow sharply. Public debt is held largely by international investors (~60% non-resident), making Ireland sensitive to bond market sentiment and ECB policy. Exposure to global shipping disruptions (Suez, Strait of Hormuz) affects energy import costs. Brexit has created trade friction with Northern Ireland, complicating agricultural exports and supply chains. Dependence on US tech multinationals creates geopolitical risk — if US-EU tensions escalate (on digital taxation, AI regulation, data privacy), Irish tax base could be threatened.',
      politicalEconomy: 'The economic model benefits multinational corporations (tech, pharma), financial services, and large exporters. Domestic SMEs and workers in non-export sectors bear the cost of high energy prices, housing shortages, and labor scarcity. This geographic and sectoral divide maps onto political divisions: Sinn Féin strength is in working-class urban areas and rural towns hurt by deindustrialization; Fine Gael and Fianna Fáil dominate among business owners, professionals, and suburban voters. The social contract rests on full employment, rising wages, and affordable housing — all under pressure. Housing shortage is acute: demand far exceeds supply, prices have risen 66% since 2015 while incomes rose 27%, creating a crisis that threatens social stability. Any attempt to constrain data center growth (to solve energy crisis) risks alienating the tech sector and threatening tax revenue. Conversely, unchecked data center expansion threatens grid stability and climate commitments. This is a genuine policy dilemma with no easy solution.',
    },
    security: {
      internal: 'No active insurgency or terrorism threat. Violent crime is low by international standards. However, organized crime (drug trafficking, money laundering) is a persistent challenge, particularly in Dublin. Social cohesion is strained by housing crisis and cost-of-living pressures — protests have been sporadic but not sustained. Immigration has become politically contentious; far-right groups have staged demonstrations against asylum centers, but these remain fringe. The police (An Garda Síochána) are professional and loyal. The Defence Forces are small (~7,500 active personnel) but well-trained. No internal security threat to the state.',
      diplomacy: 'Ireland is militarily neutral (not in NATO, no military alliances) but increasingly aligned with Western security architecture. This creates tension: the government supports Ukraine politically and has voted for EU sanctions on Russia, but maintains military neutrality and refuses NATO membership. The 2026 EU Presidency provides an opportunity to shape EU defense policy and digital sovereignty initiatives. Ireland is pushing for European strategic autonomy and independent EU defense capabilities. However, this is complicated by Ireland\'s dependence on US tech multinationals and NATO protection (implicitly, via UK and EU allies). The government is deploying defense attachés to US, UK, and France (March 2026) — a symbolic step toward closer military ties without formal alliance. Ireland is also engaged in EU-NATO cooperation initiatives and has increased defense spending (€1.7 billion plan announced). The neutrality policy is under strain and will likely evolve over the next 5–10 years as geopolitical pressures mount.',
    },
    actors: {
      domestic: [
        {
          name: 'Micheál Martin (Fianna Fáil, Taoiseach)',
          interests: 'Maintain coalition stability until November 2027 handover. Preserve Fianna Fáil\'s political capital for 2027 general election. Deliver on EU Presidency priorities (digital regulation, competitiveness). Manage energy crisis without alienating tech sector.',
          resources: 'Control of executive. 48 Dáil seats. Support of 10 independent TDs. Institutional machinery of government. Civil service loyalty.',
          constraints: 'Lame-duck status as handover date approaches. Coalition fragility (any defection or by-election loss could trigger crisis). Internal party pressure (Fianna Fáil MPs unhappy with coalition constraints). Limited room for difficult policy choices.',
          likelyMoves: 'Defer contentious decisions until after EU Presidency. Focus on incremental reforms and consensus-building. Use EU Presidency to boost international profile and domestic legitimacy. Avoid confrontation with tech sector on data centers.',
          dealability: 'High with Fine Gael (coalition partner). Medium with Sinn Féin (opposition but pragmatic on some issues). Low with far-left (People Before Profit, Greens on climate).',
        },
        {
          name: 'Simon Harris (Fine Gael, Minister for Finance, future Taoiseach)',
          interests: 'Strengthen position as finance minister and party leader. Prepare for takeover as Taoiseach (November 2027). Position Fine Gael for 2027 election. Manage fiscal constraints and reform agenda.',
          resources: 'Control of finance ministry. 38 Dáil seats. Influence over budget and tax policy. International credibility (young, pro-EU, pro-business).',
          constraints: 'Heightened political risk as finance minister (must say "no" to spending demands). Coalition fragility. Tension with Fianna Fáil over policy direction. Limited time to establish himself before election.',
          likelyMoves: 'Pursue targeted tax cuts and business-friendly policies in Budget 2027. Avoid major structural reforms (too risky in fragile coalition). Build international profile on digital regulation and competitiveness. Position Fine Gael as the "growth" party.',
          dealability: 'High with Fianna Fáil (coalition partner). Medium with business and tech sector. Low with left-wing opposition.',
        },
        {
          name: 'Mary Lou McDonald (Sinn Féin, Opposition Leader)',
          interests: 'Position Sinn Féin as alternative government. Capitalize on housing crisis and cost-of-living anger. Increase vote share for 2027 election. Push for Irish reunification agenda.',
          resources: 'Largest opposition party (37 seats). Strong support in working-class urban areas. Populist messaging on housing and welfare. Youth appeal.',
          constraints: 'Sinn Féin\'s radical left-wing policies (wealth tax, rent controls) alienate business and middle-class voters. Lack of government experience. Internal party discipline issues. Difficulty forming viable coalition with fragmented left.',
          likelyMoves: 'Exploit housing crisis and cost-of-living anger. Demand radical wealth redistribution and housing intervention. Push for Irish reunification discussions. Attempt to coordinate with Labour and Social Democrats for 2027.',
          dealability: 'Low with Fine Gael and Fianna Fáil (ideological opposition). Medium with Labour and Social Democrats (but coordination is difficult). High with working-class and youth voters.',
        },
        {
          name: 'Tech Sector & Multinationals (Apple, Google, Meta, Microsoft)',
          interests: 'Maintain favorable tax regime (15% corporation tax, R&D incentives). Expand data center operations. Minimize regulatory constraints. Secure reliable energy supply.',
          resources: 'Massive economic footprint (18% of GVA, 106,000 jobs). Tax revenue (~€25 billion annually). Political influence via lobbying and media. Ability to relocate operations.',
          constraints: 'Energy crisis threatens expansion plans. EU digital regulation (AI Act, Digital Services Act) creates compliance costs. Public pressure on data center environmental impact. Potential US-EU tensions on digital taxation.',
          likelyMoves: 'Lobby government to prioritize grid expansion and renewable energy. Invest in on-site renewable generation and storage. Accelerate AI and cloud services expansion. Resist EU digital regulation.',
          dealability: 'Very high with government (both parties dependent on tech tax revenue and jobs). Low with environmental and left-wing groups.',
        },
        {
          name: 'Trade Unions & Labor Movement',
          interests: 'Secure wage increases to match cost-of-living. Expand public sector employment and services. Resist austerity. Improve housing and social conditions.',
          resources: 'Ability to organize strikes and industrial action. Political influence via Labour party. Public sympathy on cost-of-living issues. Media platform.',
          constraints: 'Fragmented (multiple unions with competing interests). Limited strike capacity in tech sector (non-unionized). Coalition government\'s fiscal constraints limit wage settlement room.',
          likelyMoves: 'Demand significant public sector wage increases in 2026 pay round. Threaten strikes if demands not met. Push for housing intervention and social spending.',
          dealability: 'Medium with government (fiscal constraints limit room for negotiation). High with Sinn Féin and Labour (opposition parties).',
        },
      ],
      external: [
        {
          name: 'European Union',
          interests: 'Ireland as stable EU member and EU Presidency holder (July–December 2026). Digital regulation and AI governance. Competitiveness agenda. Defense integration.',
          resources: 'EU funds and structural support. Regulatory framework. Diplomatic backing. Economic leverage.',
          constraints: 'Limited ability to force Irish policy changes (Ireland has veto on key decisions). Tension between EU digital regulation and Ireland\'s tech-friendly tax regime.',
          likelyMoves: 'Support Ireland\'s EU Presidency. Pressure Ireland on digital taxation and AI regulation. Coordinate on defense and NATO cooperation.',
          dealability: 'High (Ireland is loyal EU member).',
        },
        {
          name: 'United States',
          interests: 'Maintain favorable investment climate for US tech multinationals. Preserve Ireland as European tech hub. Secure NATO cooperation and defense alignment. Prevent EU digital regulation from constraining US tech companies.',
          resources: 'Economic leverage (US multinationals account for ~40% of Irish corporate tax revenue). Diplomatic influence. Military presence in region (NATO bases in UK, Germany).',
          constraints: 'Limited ability to override EU regulation. US-EU tensions on digital taxation and AI governance. Ireland\'s military neutrality limits direct military cooperation.',
          likelyMoves: 'Lobby Irish government to resist EU digital taxation and regulation. Support Ireland\'s defense spending increases. Coordinate on NATO interoperability.',
          dealability: 'High (Ireland dependent on US tech investment and security umbrella).',
        },
        {
          name: 'United Kingdom',
          interests: 'Stable Ireland and Northern Ireland. Smooth trade post-Brexit. Cooperation on security and defense (NATO member). Minimize Irish reunification pressure.',
          resources: 'NATO membership and military capability. Economic ties (trade, investment). Diplomatic influence. Northern Ireland leverage.',
          constraints: 'Brexit has created trade friction. Northern Ireland protocol creates political tension. Limited ability to influence Irish domestic policy.',
          likelyMoves: 'Deepen NATO cooperation with Ireland. Coordinate on defense and security. Manage Northern Ireland tensions.',
          dealability: 'Medium (shared interests but Brexit tensions).',
        },
        {
          name: 'Russia',
          interests: 'Weaken EU and NATO unity. Exploit Irish neutrality to create divisions. Disrupt energy markets (oil prices).',
          resources: 'Energy leverage (oil/gas exports). Disinformation campaigns. Diplomatic pressure.',
          constraints: 'Limited direct leverage on Ireland (small economy, EU member). Irish public and government strongly support Ukraine.',
          likelyMoves: 'Exploit energy price volatility to create economic pressure. Amplify neutrality debate in Irish media. Attempt diplomatic outreach.',
          dealability: 'Very low (Ireland strongly aligned with EU/US on Ukraine).',
        },
      ],
    },
    risks: [
      {
        title: 'Energy Crisis & Grid Collapse',
        trigger: 'Data center electricity demand exceeds grid capacity; rolling blackouts occur; major tech company relocates operations.',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '6–12 months',
        leadingIndicators: 'EirGrid system alerts increase; data center connection requests exceed capacity; renewable energy deployment lags targets; winter 2026/27 demand management measures required.',
        mitigants: 'CRU connection policy (80% renewable requirement for new data centers). Government investment in grid reinforcement and renewable generation. Tech sector on-site renewable investment. Potential data center connection moratorium.',
      },
      {
        title: 'Coalition Collapse',
        trigger: 'By-election losses weaken government; internal party tensions escalate; defection of independent TDs; leadership challenge.',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '3–9 months',
        leadingIndicators: 'By-election results (Galway West, Dublin Central); internal party dissent; media reports of coalition tensions; defection rumors.',
        mitigants: 'Rotation agreement (Martin → Harris) reduces succession tensions. Coalition partners\' fear of Sinn Féin alternative. Institutional incentives for stability.',
      },
      {
        title: 'Housing Crisis Triggers Social Unrest',
        trigger: 'Housing prices continue to rise; homelessness increases; protests escalate; government unable to deliver housing supply.',
        probability: 'Med',
        impact: 'Med',
        timeHorizon: '6–18 months',
        leadingIndicators: 'Housing starts stagnate; homelessness statistics worsen; protest frequency increases; media focus on housing crisis; youth emigration accelerates.',
        mitigants: 'Government housing investment plan. Planning reform initiatives. Private sector development. Potential rent controls (though economically counterproductive).',
      },
      {
        title: 'US-EU Digital Regulation Conflict',
        trigger: 'EU AI Act or Digital Services Act creates compliance costs for US tech companies; US threatens retaliation or withdrawal; Ireland caught in middle.',
        probability: 'Med',
        impact: 'Med',
        timeHorizon: '12–24 months',
        leadingIndicators: 'EU regulatory escalation; US tech company lobbying intensifies; threat of relocation or reduced investment; US trade pressure on Ireland.',
        mitigants: 'Ireland\'s EU Presidency (July–December 2026) provides platform to mediate. Tech sector on-site compliance investment. Regulatory harmonization efforts.',
      },
      {
        title: 'Sinn Féin Electoral Breakthrough',
        trigger: 'By-election gains; 2027 general election produces Sinn Féin plurality; left-wing coalition becomes viable.',
        probability: 'Low',
        impact: 'High',
        timeHorizon: '12–18 months',
        leadingIndicators: 'By-election results; opinion polls showing Sinn Féin surge; left-wing party coordination; youth and working-class mobilization.',
        mitigants: 'Fine Gael and Fianna Fáil likely to coordinate against Sinn Féin in 2027. Business sector opposition to radical policies. Institutional resistance to major policy shifts.',
      },
      {
        title: 'NATO Membership Pressure',
        trigger: 'Geopolitical escalation (Russia-NATO conflict); EU defense integration accelerates; public opinion shifts; neutrality policy becomes untenable.',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '18–36 months',
        leadingIndicators: 'EU defense integration deepens; NATO membership debate in media; government defense spending increases; public opinion polling on NATO.',
        mitigants: 'Strong Irish attachment to neutrality policy. Constitutional constraints (neutrality enshrined in law). Political consensus against NATO membership.',
      },
    ],
    sources: [
      {
        name: 'Central Bank of Ireland — Quarterly Bulletin Q1 2026',
        url: 'https://www.centralbank.ie/publication/quarterly-bulletins/quarterly-bulletin-q1-2026',
        desc: 'Official monetary policy and economic forecasts for Ireland.',
      },
      {
        name: 'Irish Institute of European Affairs — Data Centres in Ireland: The State of Play',
        url: 'https://www.iiea.com/blog/data-centres-in-ireland-the-state-of-play',
        desc: 'Comprehensive analysis of Ireland\'s data center sector, energy challenges, and policy responses.',
      },
      {
        name: 'Institute of Directors Ireland — Key Political Moments to Watch in 2026',
        url: 'https://www.iodireland.ie/resources-media/media-hub/blog/key-political-moments-watch-2026',
        desc: 'Business perspective on Irish political fragility, coalition dynamics, and 2026 challenges.',
      },
      {
        name: 'Irish Government — Department of Foreign Affairs',
        url: 'https://www.ireland.ie/en/dfa/role-policies/international-priorities/peace-and-security/international-security-policy/',
        desc: 'Official statement on Ireland\'s military neutrality and international security policy.',
      },
      {
        name: 'PwC Ireland — Quarterly Economic Digest Q1 2026',
        url: 'https://www.pwc.ie/issues/the-leadership-exchange/insights/quarterly-economic-digest-q1-2026.html',
        desc: 'Professional services analysis of Irish economic trends, inflation, and growth forecasts.',
      },
      {
        name: 'Irish Times — Housing Crisis Coverage',
        url: 'https://www.irishtimes.com',
        desc: 'Leading Irish newspaper with extensive coverage of housing, politics, and economy.',
      },
      {
        name: 'Reuters — Ireland Defense Cooperation',
        url: 'https://www.reuters.com',
        desc: 'International news coverage of Ireland\'s defense spending and NATO cooperation.',
      },
    ],
  },
  fr: {
    executiveSnapshot: [
      'Régime : République parlementaire (Dáil Éireann unicaméral). Le pouvoir exécutif est détenu par le Taoiseach (Premier ministre) et le Cabinet. Micheál Martin (Fianna Fáil) est Taoiseach jusqu\'en novembre 2027, date à laquelle Simon Harris (Fine Gael) prendra la relève selon un accord de rotation du leadership.',
      'Équilibre politique : Gouvernement de coalition formé en janvier 2025 entre Fianna Fáil et Fine Gael avec le soutien de députés indépendants. Aucun parti n\'a la majorité ; le gouvernement dépend de 10 députés indépendants et de l\'abstention du Parti vert. Fragile mais fonctionnel. Deux élections partielles (Galway West, Dublin Central) prévues pour le début 2026 testeront la stabilité de la coalition.',
      'Modèle économique : Économie de services avancés avec deux moteurs : (1) Secteur multinational tech/pharma (Apple, Google, Meta, Microsoft data centers ; Pfizer, Merck pharma) ; (2) Secteurs traditionnels (agriculture, tourisme, services financiers). PIB nominal ~550 milliards d\'euros. Dépendant des IDE avec impôt sur les sociétés 12,5 % → 15 % selon le Pilier Deux de l\'OCDE. Les data centers consomment 21 % de l\'électricité nationale (projection 32 % d\'ici 2026), créant une tension sur le réseau.',
      'Top 3 risques (6–18 mois) : (1) Crise énergétique due à la demande des data centers dépassant la capacité du réseau — des coupures de courant possibles ; (2) Effondrement de la coalition si les élections partielles affaiblissent le gouvernement ou si les tensions internes s\'aggravent ; (3) Crise du logement/coût de la vie s\'aggravant, déclenchant des troubles sociaux et limitant l\'agenda de réforme du gouvernement.',
      'Top 3 éléments à surveiller (4–12 semaines) : (1) Résultats des élections partielles et coordination de l\'opposition — détermineront l\'espace de manœuvre du gouvernement ; (2) Mise en œuvre de la politique de connexion des data centers (décision de la CRU décembre 2025 sur l\'exigence de 80 % d\'énergie renouvelable) ; (3) Préparation du Budget 2027 — dernier budget politique significatif avant l\'élection générale de 2027.',
      'Dépendances externes : Importations d\'énergie (pétrole, gaz — l\'Irlande génère ~30 % à partir d\'énergies renouvelables, le reste provient d\'importations et de combustibles fossiles). Marché unique de l\'UE pour le commerce (exportations 16,2 milliards d\'euros janvier 2026). Commerce avec le Royaume-Uni post-Brexit (le protocole d\'Irlande du Nord crée des frictions). Coopération avec l\'OTAN sans adhésion (politique de neutralité militaire, mais interopérabilité croissante avec l\'OTAN).',
      'Posture de sécurité : Aucune insurrection active ou menace terroriste. Menace terroriste faible. Capacité militaire minimale (0,2 % du PIB en dépenses de défense, ~7 500 personnels actifs). Coopération croissante avec l\'OTAN et intégration de la défense européenne. Déploiement des premiers attachés de défense aux États-Unis, au Royaume-Uni et en France (mars 2026). Plan d\'investissement dans la défense de 1,7 milliard d\'euros annoncé (radar, sonar, hélicoptères). La politique de neutralité est sous tension du fait du conflit en Ukraine.',
      'Orientation diplomatique : Membre clé de l\'UE (détient la présidence de l\'UE juillet–décembre 2026). Membre non permanent du Conseil de sécurité de l\'ONU (2028–2029). Partenaire de l\'OTAN mais pas membre. Historiquement neutre, mais de plus en plus alignée sur l\'architecture de sécurité occidentale. Équilibre délicat : maintenir la neutralité militaire tout en approfondissant les liens de défense avec l\'OTAN/UE.',
      'Confiance dans les données : Élevée — l\'Irlande dispose de données institutionnelles solides (CSO, Banque centrale, statistiques gouvernementales). Presse libre. Gouvernance transparente. Cependant, certaines données sur la concentration du secteur technologique et les arrangements fiscaux sont contestées.',
      'Perspective de base : Stabilité gérée jusqu\'en 2026 avec trois points critiques : (1) Élections partielles (début 2026) — si l\'opposition gagne du terrain, le gouvernement devient plus prudent ; (2) Présidence de l\'UE (juillet–décembre 2026) — visibilité internationale mais risque de livraison nationale ; (3) Budget 2027 (automne 2026) — dernière chance de réforme structurelle avant l\'élection de 2027. La crise énergétique est le facteur imprévisible — les contraintes du réseau pourraient forcer des choix difficiles entre la croissance des data centers, les engagements climatiques et la compétitivité économique.',
    ],
    political: {
      powerStructure: 'Le Taoiseach détient l\'autorité exécutive mais dépend de la confiance parlementaire. Micheál Martin (Fianna Fáil) dirige jusqu\'en novembre 2027, date à laquelle Simon Harris (Fine Gael) prend la relève selon une rotation pré-convenue. Cet arrangement crée une dynamique de canard boiteux — l\'autorité de Martin s\'érode déjà alors que son successeur attend en coulisse. Le Dáil compte 160 sièges ; la coalition en contrôle 88 (Fianna Fáil 48, Fine Gael 38, Verts 2) plus 10 députés indépendants. C\'est une majorité minimale sans marge de manœuvre. Sinn Féin (37 sièges) est le plus grand parti d\'opposition mais la gauche fragmentée (Travaillistes, Démocrates sociaux, Peuple avant profit) empêche un gouvernement alternatif crédible. La magistrature est indépendante et forte. La fonction publique est professionnelle et loyale à l\'ordre constitutionnel. Les médias sont pluralistes (RTE, Irish Times, Independent, Examiner) avec une indépendance éditoriale raisonnable.',
      stabilityDrivers: 'La légitimité repose sur les élections démocratiques et les performances économiques — l\'héritage du « Tigre celtique » de l\'Irlande crée des attentes élevées de prospérité. Les forces de sécurité (An Garda Síochána, Forces de défense) sont loyales à l\'ordre constitutionnel. Le consensus d\'élite autour de l\'adhésion à l\'UE et de la coopération avec l\'OTAN est fort, bien que contesté sur la neutralité. La coalition est maintenue ensemble par la peur de Sinn Féin (gauche, nationaliste) et l\'absence d\'alternatives viables. Fianna Fáil et Fine Gael sont des partis idéologiquement similaires de centre-droit avec un historique d\'alternance au pouvoir. L\'accord de rotation (Martin → Harris) a été conçu pour éviter que les luttes de leadership ne déstabilisent la coalition, mais il signale aussi que les deux leaders regardent déjà au-delà de 2026. L\'élection de 2024 a montré une continuité remarquable — les mêmes trois blocs (centre-droit, gauche, nationaliste) avec un changement minimal de parts de vote, suggérant une résilience institutionnelle.',
      shockAbsorbers: 'Amortisseurs : Marchés de capitaux solides et crédit souverain proche de AAA (noté AA+ par S&P). Soutien de la Banque centrale européenne en tant que partie de la zone euro. Base d\'exportation diversifiée (tech, pharma, agriculture, finance). Marché du travail flexible. Capacité institutionnelle profonde et continuité de la fonction publique. Accélérateurs : La crise énergétique due à la demande des data centers pourrait déclencher des coupures de courant, minant la compétitivité et la confiance des investisseurs. La pénurie de logements et la crise du coût de la vie érodent le pouvoir d\'achat et la cohésion sociale. La fragilité de la coalition signifie une marge limitée pour les choix politiques difficiles. Les pertes aux élections partielles pourraient déclencher des défis de leadership ou des défections. La montée de Sinn Féin (maintenant plus grand parti d\'opposition) crée une pression pour des politiques de gauche (impôt sur la richesse, contrôle des loyers) qui seraient économiquement perturbantes si mises en œuvre.',
    },
    economy: {
      macroReality: 'La croissance du PIB est volatile en raison de l\'activité multinationale. Le PIB nominal a augmenté de 10,7 % en 2025 (largement statistique — reflète la rapatriation des bénéfices du secteur technologique). La Demande intérieure modifiée (DIM) — une meilleure mesure de l\'activité économique réelle — est prévue à 2,1 % pour 2026, passant à 2,8 % en 2027. L\'inflation est modérée (2,4 % février 2026) mais augmente en raison d\'effets de base (fin des crédits énergétiques, frais de troisième cycle). Le chômage est faible (~4,2 %). Cependant, le marché du travail est tendu et les pressions salariales augmentent. Les finances publiques sont saines (déficit ~1,5 % du PIB, dette ~82 % du PIB). Les recettes fiscales sont volatiles — les recettes d\'impôt sur les sociétés dépendent des flux de bénéfices des multinationales, qui sont sensibles aux conditions économiques mondiales et aux changements de politique fiscale. Le gouvernement est limité par les règles fiscales de l\'UE et la prudence nationale, limitant la marge pour un grand stimulus fiscal.',
      externalVulnerability: 'L\'Irlande enregistre un excédent courant persistant (solde commercial 4,83 milliards d\'euros janvier 2026), mais cela masque des vulnérabilités structurelles. Les exportations sont fortement concentrées dans la tech (data centers, logiciels), la pharma et l\'agriculture. La dépendance aux importations d\'énergie est aiguë — l\'Irlande importe ~90 % du pétrole et du gaz. La crise énergétique due à la demande des data centers est la vulnérabilité aiguë : si les contraintes du réseau forcent les relocalisations de data centers, la croissance du PIB pourrait ralentir fortement. La dette publique est détenue largement par des investisseurs internationaux (~60 % non-résidents), rendant l\'Irlande sensible aux sentiments du marché obligataire et à la politique de la BCE. L\'exposition aux perturbations du transport maritime mondial (Suez, détroit d\'Ormuz) affecte les coûts d\'importation d\'énergie. Le Brexit a créé des frictions commerciales avec l\'Irlande du Nord, compliquant les exportations agricoles et les chaînes d\'approvisionnement. La dépendance aux multinationales technologiques américaines crée un risque géopolitique — si les tensions UE-États-Unis s\'aggravent (sur la fiscalité numérique, la régulation de l\'IA, la confidentialité des données), la base fiscale irlandaise pourrait être menacée.',
      politicalEconomy: 'Le modèle économique profite aux sociétés multinationales (tech, pharma), aux services financiers et aux grands exportateurs. Les PME nationales et les travailleurs des secteurs non-exportateurs supportent le coût des prix énergétiques élevés, des pénuries de logements et de la rareté de la main-d\'œuvre. Cette division géographique et sectorielle correspond aux divisions politiques : la force de Sinn Féin est dans les zones urbaines de la classe ouvrière et les petites villes touchées par la désindustrialisation ; Fine Gael et Fianna Fáil dominent parmi les propriétaires d\'entreprises, les professionnels et les électeurs de banlieue. Le contrat social repose sur le plein emploi, la hausse des salaires et l\'accessibilité du logement — tous sous pression. La pénurie de logements est aiguë : la demande dépasse largement l\'offre, les prix ont augmenté de 66 % depuis 2015 tandis que les revenus ont augmenté de 27 %, créant une crise qui menace la stabilité sociale. Toute tentative de limiter la croissance des data centers (pour résoudre la crise énergétique) risque d\'aliéner le secteur technologique et de menacer les recettes fiscales. Inversement, l\'expansion incontrôlée des data centers menace la stabilité du réseau et les engagements climatiques. C\'est un véritable dilemme politique sans solution facile.',
    },
    security: {
      internal: 'Aucune insurrection active ou menace terroriste. La criminalité violente est faible selon les normes internationales. Cependant, la criminalité organisée (trafic de drogue, blanchiment d\'argent) est un défi persistant, particulièrement à Dublin. La cohésion sociale est tendue par la crise du logement et les pressions du coût de la vie — les protestations ont été sporadiques mais pas soutenues. L\'immigration est devenue politiquement controversée ; les groupes d\'extrême droite ont organisé des manifestations contre les centres d\'asile, mais celles-ci restent marginales. La police (An Garda Síochána) est professionnelle et loyale. Les Forces de défense sont petites (~7 500 personnels actifs) mais bien entraînées. Aucune menace de sécurité interne à l\'État.',
      diplomacy: 'L\'Irlande est militairement neutre (pas membre de l\'OTAN, aucune alliance militaire) mais de plus en plus alignée sur l\'architecture de sécurité occidentale. Cela crée une tension : le gouvernement soutient politiquement l\'Ukraine et a voté pour les sanctions de l\'UE contre la Russie, mais maintient la neutralité militaire et refuse l\'adhésion à l\'OTAN. La présidence de l\'UE 2026 offre une opportunité de façonner la politique de défense de l\'UE et les initiatives de souveraineté numérique. L\'Irlande pousse pour l\'autonomie stratégique européenne et les capacités de défense indépendantes de l\'UE. Cependant, cela est compliqué par la dépendance de l\'Irlande aux multinationales technologiques américaines et à la protection de l\'OTAN (implicitement, via les alliés du Royaume-Uni et de l\'UE). Le gouvernement déploie des attachés de défense aux États-Unis, au Royaume-Uni et en France (mars 2026) — une étape symbolique vers des liens militaires plus étroits sans alliance formelle. L\'Irlande est également engagée dans des initiatives de coopération UE-OTAN et a augmenté les dépenses de défense (plan de 1,7 milliard d\'euros annoncé). La politique de neutralité est sous tension et évoluera probablement au cours des 5–10 prochaines années à mesure que les pressions géopolitiques augmentent.',
    },
    actors: {
      domestic: [
        {
          name: 'Micheál Martin (Fianna Fáil, Taoiseach)',
          interests: 'Maintenir la stabilité de la coalition jusqu\'au transfert de novembre 2027. Préserver le capital politique de Fianna Fáil pour l\'élection générale de 2027. Livrer les priorités de la présidence de l\'UE (régulation numérique, compétitivité). Gérer la crise énergétique sans aliéner le secteur technologique.',
          resources: 'Contrôle de l\'exécutif. 48 sièges au Dáil. Soutien de 10 députés indépendants. Appareil institutionnel du gouvernement. Loyauté de la fonction publique.',
          constraints: 'Statut de canard boiteux à l\'approche de la date de transfert. Fragilité de la coalition (toute défection ou perte aux élections partielles pourrait déclencher une crise). Pression interne du parti (les députés de Fianna Fáil mécontents des contraintes de la coalition). Marge limitée pour les choix politiques difficiles.',
          likelyMoves: 'Reporter les décisions controversées jusqu\'après la présidence de l\'UE. Se concentrer sur les réformes progressives et la construction de consensus. Utiliser la présidence de l\'UE pour renforcer le profil international et la légitimité nationale. Éviter la confrontation avec le secteur technologique sur les data centers.',
          dealability: 'Élevée avec Fine Gael (partenaire de coalition). Moyenne avec Sinn Féin (opposition mais pragmatique sur certains problèmes). Faible avec la gauche radicale (Peuple avant profit, Verts sur le climat).',
        },
        {
          name: 'Simon Harris (Fine Gael, Ministre des Finances, futur Taoiseach)',
          interests: 'Renforcer sa position en tant que ministre des finances et leader du parti. Se préparer à prendre la relève en tant que Taoiseach (novembre 2027). Positionner Fine Gael pour l\'élection de 2027. Gérer les contraintes fiscales et l\'agenda de réforme.',
          resources: 'Contrôle du ministère des finances. 38 sièges au Dáil. Influence sur le budget et la politique fiscale. Crédibilité internationale (jeune, pro-UE, pro-affaires).',
          constraints: 'Risque politique accru en tant que ministre des finances (doit dire « non » aux demandes de dépenses). Fragilité de la coalition. Tension avec Fianna Fáil sur l\'orientation politique. Temps limité pour s\'établir avant l\'élection.',
          likelyMoves: 'Poursuivre les réductions d\'impôts ciblées et les politiques favorables aux affaires dans le Budget 2027. Éviter les réformes structurelles majeures (trop risqué dans une coalition fragile). Construire un profil international sur la régulation numérique et la compétitivité. Positionner Fine Gael comme le parti de la « croissance ».',
          dealability: 'Élevée avec Fianna Fáil (partenaire de coalition). Moyenne avec le secteur des affaires et de la technologie. Faible avec l\'opposition de gauche.',
        },
        {
          name: 'Mary Lou McDonald (Sinn Féin, Leader de l\'opposition)',
          interests: 'Positionner Sinn Féin comme gouvernement alternatif. Capitaliser sur la crise du logement et la colère du coût de la vie. Augmenter la part de vote pour l\'élection de 2027. Pousser l\'agenda de réunification irlandaise.',
          resources: 'Plus grand parti d\'opposition (37 sièges). Soutien fort dans les zones urbaines de la classe ouvrière. Messagerie populiste sur le logement et l\'aide sociale. Attrait pour les jeunes.',
          constraints: 'Les politiques radicales de gauche de Sinn Féin (impôt sur la richesse, contrôle des loyers) aliènent les électeurs des affaires et de la classe moyenne. Manque d\'expérience gouvernementale. Problèmes de discipline interne du parti. Difficulté à former une coalition viable avec la gauche fragmentée.',
          likelyMoves: 'Exploiter la crise du logement et la colère du coût de la vie. Exiger une redistribution radicale de la richesse et une intervention du logement. Pousser les discussions sur la réunification irlandaise. Tenter de coordonner avec les Travaillistes et les Démocrates sociaux pour 2027.',
          dealability: 'Faible avec Fine Gael et Fianna Fáil (opposition idéologique). Moyenne avec les Travaillistes et les Démocrates sociaux (mais la coordination est difficile). Élevée avec les électeurs de la classe ouvrière et des jeunes.',
        },
        {
          name: 'Secteur technologique & Multinationales (Apple, Google, Meta, Microsoft)',
          interests: 'Maintenir le régime fiscal favorable (impôt sur les sociétés 15 %, incitations R&D). Élargir les opérations de data centers. Minimiser les contraintes réglementaires. Sécuriser un approvisionnement énergétique fiable.',
          resources: 'Empreinte économique massive (18 % de la GVA, 106 000 emplois). Recettes fiscales (~25 milliards d\'euros annuellement). Influence politique via le lobbying et les médias. Capacité à relocaliser les opérations.',
          constraints: 'La crise énergétique menace les plans d\'expansion. La régulation numérique de l\'UE (Loi sur l\'IA, Loi sur les services numériques) crée des coûts de conformité. Pression publique sur l\'impact environnemental des data centers. Tensions potentielles UE-États-Unis sur la fiscalité numérique.',
          likelyMoves: 'Faire pression sur le gouvernement pour prioriser l\'expansion du réseau et les énergies renouvelables. Investir dans la génération et le stockage d\'énergies renouvelables sur site. Accélérer l\'expansion de l\'IA et des services cloud. Résister à la régulation numérique de l\'UE.',
          dealability: 'Très élevée avec le gouvernement (les deux partis dépendent des recettes fiscales technologiques et des emplois). Faible avec les groupes environnementaux et de gauche.',
        },
        {
          name: 'Syndicats & Mouvement ouvrier',
          interests: 'Sécuriser les augmentations de salaires pour correspondre au coût de la vie. Élargir l\'emploi du secteur public et les services. Résister à l\'austérité. Améliorer les conditions de logement et sociales.',
          resources: 'Capacité à organiser les grèves et les actions industrielles. Influence politique via le parti Travailliste. Sympathie publique sur les problèmes du coût de la vie. Plateforme médiatique.',
          constraints: 'Fragmenté (plusieurs syndicats avec des intérêts concurrents). Capacité de grève limitée dans le secteur technologique (non-syndiqué). Les contraintes fiscales du gouvernement de coalition limitent la marge de négociation des augmentations de salaires.',
          likelyMoves: 'Exiger des augmentations de salaires significatives du secteur public dans la ronde de négociation 2026. Menacer des grèves si les demandes ne sont pas satisfaites. Pousser pour une intervention du logement et des dépenses sociales.',
          dealability: 'Moyenne avec le gouvernement (les contraintes fiscales limitent la marge de négociation). Élevée avec Sinn Féin et les Travaillistes (partis d\'opposition).',
        },
      ],
      external: [
        {
          name: 'Union européenne',
          interests: 'L\'Irlande en tant que membre stable de l\'UE et détenteur de la présidence de l\'UE (juillet–décembre 2026). Régulation numérique et gouvernance de l\'IA. Agenda de compétitivité. Intégration de la défense.',
          resources: 'Fonds et soutien structurel de l\'UE. Cadre réglementaire. Soutien diplomatique. Effet de levier économique.',
          constraints: 'Capacité limitée à forcer les changements de politique irlandaise (l\'Irlande a un droit de veto sur les décisions clés). Tension entre la régulation numérique de l\'UE et le régime fiscal favorable à la technologie de l\'Irlande.',
          likelyMoves: 'Soutenir la présidence irlandaise de l\'UE. Faire pression sur l\'Irlande concernant la fiscalité numérique et la régulation de l\'IA. Coordonner la défense et la coopération avec l\'OTAN.',
          dealability: 'Élevée (l\'Irlande est un membre loyal de l\'UE).',
        },
        {
          name: 'États-Unis',
          interests: 'Maintenir un climat d\'investissement favorable pour les multinationales technologiques américaines. Préserver l\'Irlande comme centre technologique européen. Sécuriser la coopération avec l\'OTAN et l\'alignement de la défense. Empêcher la régulation numérique de l\'UE de limiter les sociétés technologiques américaines.',
          resources: 'Effet de levier économique (les multinationales américaines représentent ~40 % des recettes d\'impôt sur les sociétés irlandaises). Influence diplomatique. Présence militaire dans la région (bases de l\'OTAN au Royaume-Uni, en Allemagne).',
          constraints: 'Capacité limitée à dépasser la régulation de l\'UE. Tensions UE-États-Unis sur la fiscalité numérique et la gouvernance de l\'IA. La neutralité militaire de l\'Irlande limite la coopération militaire directe.',
          likelyMoves: 'Faire pression sur le gouvernement irlandais pour résister à la fiscalité numérique de l\'UE et à la régulation. Soutenir les augmentations des dépenses de défense de l\'Irlande. Coordonner l\'interopérabilité avec l\'OTAN.',
          dealability: 'Élevée (l\'Irlande dépend de l\'investissement technologique américain et du parapluie de sécurité).',
        },
        {
          name: 'Royaume-Uni',
          interests: 'Irlande stable et Irlande du Nord. Commerce fluide post-Brexit. Coopération en matière de sécurité et de défense (membre de l\'OTAN). Minimiser la pression de réunification irlandaise.',
          resources: 'Adhésion à l\'OTAN et capacité militaire. Liens économiques (commerce, investissement). Influence diplomatique. Effet de levier de l\'Irlande du Nord.',
          constraints: 'Le Brexit a créé des frictions commerciales. Le protocole d\'Irlande du Nord crée une tension politique. Capacité limitée à influencer la politique intérieure irlandaise.',
          likelyMoves: 'Approfondir la coopération avec l\'OTAN avec l\'Irlande. Coordonner la défense et la sécurité. Gérer les tensions de l\'Irlande du Nord.',
          dealability: 'Moyenne (intérêts partagés mais tensions du Brexit).',
        },
        {
          name: 'Russie',
          interests: 'Affaiblir l\'unité de l\'UE et de l\'OTAN. Exploiter la neutralité irlandaise pour créer des divisions. Perturber les marchés de l\'énergie (prix du pétrole).',
          resources: 'Effet de levier énergétique (exportations de pétrole/gaz). Campagnes de désinformation. Pression diplomatique.',
          constraints: 'Effet de levier direct limité sur l\'Irlande (petite économie, membre de l\'UE). Le public irlandais et le gouvernement soutiennent fortement l\'Ukraine.',
          likelyMoves: 'Exploiter la volatilité des prix de l\'énergie pour créer une pression économique. Amplifier le débat sur la neutralité dans les médias irlandais. Tenter une approche diplomatique.',
          dealability: 'Très faible (l\'Irlande est fortement alignée avec l\'UE/États-Unis sur l\'Ukraine).',
        },
      ],
    },
    risks: [
      {
        title: 'Crise énergétique & Effondrement du réseau',
        trigger: 'La demande d\'électricité des data centers dépasse la capacité du réseau ; des coupures de courant se produisent ; une grande entreprise technologique relocalise ses opérations.',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '6–12 mois',
        leadingIndicators: 'Les alertes du système EirGrid augmentent ; les demandes de connexion des data centers dépassent la capacité ; le déploiement des énergies renouvelables prend du retard ; les mesures de gestion de la demande de l\'hiver 2026/27 sont nécessaires.',
        mitigants: 'Politique de connexion de la CRU (exigence de 80 % d\'énergie renouvelable pour les nouveaux data centers). Investissement gouvernemental dans le renforcement du réseau et la génération d\'énergies renouvelables. Investissement du secteur technologique en énergies renouvelables sur site. Moratoire potentiel sur la connexion des data centers.',
      },
      {
        title: 'Effondrement de la coalition',
        trigger: 'Les pertes aux élections partielles affaiblissent le gouvernement ; les tensions internes du parti s\'aggravent ; défection des députés indépendants ; défi du leadership.',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '3–9 mois',
        leadingIndicators: 'Résultats des élections partielles (Galway West, Dublin Central) ; dissidence interne du parti ; rapports médiatiques sur les tensions de la coalition ; rumeurs de défection.',
        mitigants: 'L\'accord de rotation (Martin → Harris) réduit les tensions de succession. La peur de Sinn Féin par les partenaires de la coalition. Les incitations institutionnelles à la stabilité.',
      },
      {
        title: 'La crise du logement déclenche des troubles sociaux',
        trigger: 'Les prix des logements continuent d\'augmenter ; l\'itinérance augmente ; les protestations s\'aggravent ; le gouvernement ne peut pas livrer l\'offre de logements.',
        probability: 'Med',
        impact: 'Med',
        timeHorizon: '6–18 mois',
        leadingIndicators: 'Les mises en chantier stagnent ; les statistiques d\'itinérance s\'aggravent ; la fréquence des protestations augmente ; la couverture médiatique de la crise du logement ; l\'émigration des jeunes s\'accélère.',
        mitigants: 'Plan d\'investissement du gouvernement dans le logement. Initiatives de réforme de la planification. Développement du secteur privé. Contrôle potentiel des loyers (bien qu\'économiquement contre-productif).',
      },
      {
        title: 'Conflit de régulation numérique UE-États-Unis',
        trigger: 'La Loi sur l\'IA ou la Loi sur les services numériques de l\'UE crée des coûts de conformité pour les sociétés technologiques américaines ; les États-Unis menacent des représailles ou le retrait ; l\'Irlande est prise entre les deux.',
        probability: 'Med',
        impact: 'Med',
        timeHorizon: '12–24 mois',
        leadingIndicators: 'Escalade réglementaire de l\'UE ; le lobbying des sociétés technologiques américaines s\'intensifie ; menace de relocalisation ou réduction d\'investissement ; pression commerciale américaine sur l\'Irlande.',
        mitigants: 'La présidence irlandaise de l\'UE (juillet–décembre 2026) offre une plateforme pour la médiation. Investissement de conformité du secteur technologique sur site. Efforts d\'harmonisation réglementaire.',
      },
      {
        title: 'Percée électorale de Sinn Féin',
        trigger: 'Gains aux élections partielles ; l\'élection générale de 2027 produit une pluralité de Sinn Féin ; une coalition de gauche devient viable.',
        probability: 'Low',
        impact: 'High',
        timeHorizon: '12–18 mois',
        leadingIndicators: 'Résultats des élections partielles ; sondages d\'opinion montrant une montée de Sinn Féin ; coordination des partis de gauche ; mobilisation de la jeunesse et de la classe ouvrière.',
        mitigants: 'Fine Gael et Fianna Fáil sont susceptibles de coordonner contre Sinn Féin en 2027. Opposition du secteur des affaires aux politiques radicales. Résistance institutionnelle aux changements majeurs de politique.',
      },
      {
        title: 'Pression pour l\'adhésion à l\'OTAN',
        trigger: 'Escalade géopolitique (conflit Russie-OTAN) ; l\'intégration de la défense de l\'UE s\'accélère ; l\'opinion publique change ; la politique de neutralité devient intenable.',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '18–36 mois',
        leadingIndicators: 'L\'intégration de la défense de l\'UE s\'approfondit ; débat sur l\'adhésion à l\'OTAN dans les médias ; les dépenses de défense du gouvernement augmentent ; sondages d\'opinion publique sur l\'OTAN.',
        mitigants: 'Attachement fort de l\'Irlande à la politique de neutralité. Contraintes constitutionnelles (neutralité inscrite dans la loi). Consensus politique contre l\'adhésion à l\'OTAN.',
      },
    ],
    sources: [
      {
        name: 'Banque centrale d\'Irlande — Bulletin trimestriel Q1 2026',
        url: 'https://www.centralbank.ie/publication/quarterly-bulletins/quarterly-bulletin-q1-2026',
        desc: 'Prévisions officielles de politique monétaire et économiques pour l\'Irlande.',
      },
      {
        name: 'Institut irlandais des affaires européennes — Data Centres en Irlande : L\'état des lieux',
        url: 'https://www.iiea.com/blog/data-centres-in-ireland-the-state-of-play',
        desc: 'Analyse complète du secteur des data centers en Irlande, des défis énergétiques et des réponses politiques.',
      },
      {
        name: 'Institut des directeurs d\'Irlande — Moments politiques clés à surveiller en 2026',
        url: 'https://www.iodireland.ie/resources-media/media-hub/blog/key-political-moments-watch-2026',
        desc: 'Perspective commerciale sur la fragilité politique irlandaise, la dynamique de la coalition et les défis de 2026.',
      },
      {
        name: 'Gouvernement irlandais — Département des affaires étrangères',
        url: 'https://www.ireland.ie/en/dfa/role-policies/international-priorities/peace-and-security/international-security-policy/',
        desc: 'Déclaration officielle sur la neutralité militaire de l\'Irlande et la politique de sécurité internationale.',
      },
      {
        name: 'PwC Irlande — Digest économique trimestriel Q1 2026',
        url: 'https://www.pwc.ie/issues/the-leadership-exchange/insights/quarterly-economic-digest-q1-2026.html',
        desc: 'Analyse des services professionnels des tendances économiques irlandaises, de l\'inflation et des prévisions de croissance.',
      },
      {
        name: 'Irish Times — Couverture de la crise du logement',
        url: 'https://www.irishtimes.com',
        desc: 'Principal journal irlandais avec une couverture extensive du logement, de la politique et de l\'économie.',
      },
      {
        name: 'Reuters — Coopération de défense de l\'Irlande',
        url: 'https://www.reuters.com',
        desc: 'Couverture des actualités internationales des dépenses de défense de l\'Irlande et de la coopération avec l\'OTAN.',
      },
    ],
  },
};
