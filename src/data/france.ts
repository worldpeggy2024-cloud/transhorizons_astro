/*
 * TransHorizons — France Country Analysis Data
 * Full bilingual content following the Country Situation Report framework
 * Last updated: April 2026
 * Framework: CountrySituationFramework v1.0
 * Sources: IMF, INSEE, Banque de France, DGSE, DGSI, SIPRI, Carnegie, Reuters, Freedom House, V-Dem, ACLED
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
  /**
   * Shared sources registry (new-format countries). Takes precedence over en.sources / fr.sources.
   * Citations in narratives use stable slug IDs matching source.id, e.g. [imf], [pm-ca].
   */
  sources?: SourceEntry[];
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
  /** Per-language sources (old format). For new-format countries, use top-level AnalysisContent.sources instead. */
  sources?: SourceEntry[];
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
  /** Stable slug ID used in citation markers, e.g. [imf] or [pm-ca]. Required for new-format countries. */
  id?: string;
  name: string;
  url: string;
  desc: string;
  publicationDate?: string;
  accessDate?: string;
  confidence?: 'High' | 'Med' | 'Low';
  citationType?: 'Fact' | 'Interpretation';
  /** ISO date (YYYY-MM-DD) of last URL verification. */
  lastVerified?: string;
  /** Wayback Machine URL for link-rot fallback. */
  archiveUrl?: string | null;
}

export const franceAnalysis: AnalysisContent = {
  lastUpdated: '2026-04-19',
  scorecard: {
    eliteCohesion: 'Low',
    securityLoyalty: 'High',
    economicPressure: 'High',
    protestCapacity: 'High',
    institutionalResilience: 'Med',
  },
  en: {
    executiveSnapshot: [
      'Regime type: Semi-presidential republic (Fifth Republic) [1]; power concentrated in the presidency, but Macron\'s authority is eroding as his second and final term approaches its end in 2027 [2].',
      'Political equilibrium: PM Sébastien Lecornu (appointed Sept 2025) governs without a parliamentary majority [2]. The National Assembly remains fragmented across three blocs — centrist (Renaissance/Horizons/Modem), far-right (National Rally), and a fractured left (Socialists, Greens, LFI) [2]. No stable coalition is possible [2].',
      'Economic model: Advanced services economy (finance, luxury, aerospace, tourism, agriculture) [3] [4]; sixth-largest GDP globally [3]. Heavy state spending (~57% of GDP) funds an extensive welfare system [3].',
      'Top 3 risks (6–18 months): (1) Far-right victory in 2027 presidential election destabilizing EU integration [2]; (2) Fiscal crisis if deficit reduction stalls and bond markets react [3]; (3) Social unrest from energy price inflation linked to Iran conflict and oil crisis [5].',
      'Top 3 watch items (4–12 weeks): (1) Spring inflation spike from oil prices — INSEE forecasts sharp rise [3]; (2) Le Pen\'s legal situation and its impact on her 2027 candidacy [6]; (3) Government response to energy crisis — will emergency subsidies be reintroduced? [3].',
      'External dependencies: Energy imports (oil, gas — France generates ~70% of electricity from nuclear but relies on imported hydrocarbons for transport/heating) [4]. EU single market for trade [3]. NATO alliance for collective defense, though France maintains independent nuclear deterrent [7].',
      'Security posture: No active insurgency [8]. Elevated terrorism threat level maintained since 2015 [8]. Strong military (largest in EU, nuclear-armed) [7]. New "advanced deterrence" doctrine extending nuclear umbrella to European allies announced March 2026 [7].',
      'Diplomatic orientation: Core EU member, UN Security Council permanent seat [1], NATO ally but with Gaullist tradition of strategic autonomy [7]. Distancing from US on Iran/Middle East policy (refused overflight rights for US military flights to Israel) [9]. Pushing independent Strait of Hormuz security coalition [9].',
      'Data confidence: HIGH — France has excellent institutional data (INSEE, Banque de France, Court of Auditors) [3] and a free press [10].',
      'Baseline outlook: Managed instability through 2027 [2]. The political system will muddle through without a majority, deficit reduction will be slow but not catastrophic, and the 2027 presidential election will be the decisive moment — with a real possibility of a far-right presidency for the first time [2].',
    ],
    political: {
      powerStructure: 'The President controls foreign policy, defense, and nuclear weapons [1]. The PM manages domestic policy but depends on parliamentary confidence [1]. Macron\'s inner circle has narrowed — he has deliberately blocked the emergence of a successor figure [2]. The security services (DGSE, DGSI) report to the executive and remain loyal [8]. The judiciary is independent but under political pressure — the conviction of Marine Le Pen for EU Parliament fund misuse in 2024 was upheld, potentially barring her from the 2027 race [6]. The Constitutional Council and Council of State remain functional checks [1]. Media is pluralistic but concentrated: Bolloré group (CNews, Europe 1, JDD) leans right; public broadcasters (France Télévisions, Radio France) maintain editorial independence under pressure [10].',
      stabilityDrivers: 'Legitimacy rests on democratic elections [1] and the welfare state\'s performance — when purchasing power erodes, legitimacy drops fast (as seen in the Gilets Jaunes crisis of 2018-19) [11]. The armed forces and police are loyal to the constitutional order, not to any political faction [8]. The ruling centrist coalition is held together by the absence of alternatives rather than genuine cohesion — Renaissance, Horizons (Philippe), and Modem (Bayrou) are already positioning for 2027 as rivals [2]. The opposition is divided: the National Rally is electorally dominant on the right but judicially constrained [6]; the left is split between a moderate Socialist party rebuilding locally and LFI (Mélenchon), whose maximalist style alienates potential allies [2]. Institutional strength is real but strained — the Fifth Republic\'s constitutional architecture concentrates power in ways that amplify executive weakness when the president lacks a majority [1].',
      shockAbsorbers: 'Absorbers: Deep capital markets and AAA-adjacent sovereign credit (rated AA- by S&P) [3]. Banque de France as part of the Eurosystem [3]. Extensive social safety nets (unemployment insurance, healthcare, pensions) [3]. Nuclear energy base providing electricity independence [4]. Strong civil service continuity [1]. Accelerants: Inflation spikes from oil prices eroding purchasing power [5]. Contested 2027 presidential election with potential for street mobilization [2]. Deficit trajectory that could trigger EU fiscal rules enforcement or bond market repricing [3]. Elite fragmentation as Macron\'s coalition dissolves ahead of succession [2]. Growing cultural polarization around immigration, Islam, and national identity [10].',
    },
    economy: {
      macroReality: 'GDP growth is forecast below 1% for 2025-2026 (IMF) [3]. The 2025 public deficit came in at 5.1% of GDP — better than the 5.4% target but still well above the EU\'s 3% ceiling [3]. Public debt reached a record €3,460.5 billion (115.6% of GDP) at end-2025 [3]. Tax receipts grew faster than expected in 2025, and spending growth slowed, providing some fiscal relief [3]. However, inflation is set to rise sharply in spring 2026 as soaring oil prices linked to the Iran conflict feed through to energy and transport costs [5]. The Banque de France governor has warned that budget constraints severely limit any fiscal response to the energy crisis [3]. The government has rejected tax cuts, saying they would worsen the deficit [3]. The 2026 budget was adopted after prolonged political crisis, but further consolidation will be politically painful [2].',
      externalVulnerability: 'France runs a persistent current account deficit [3]. Exports are concentrated in aerospace (Airbus) [12], luxury goods (LVMH, Hermès), agriculture (wine, cereals), and defense equipment [4]. Import dependency is acute for hydrocarbons — the Iran-related oil crisis directly threatens the trade balance and consumer prices [5]. Public debt is largely held by international investors (~50% non-resident), making France sensitive to bond market sentiment [3]. There is no IMF program, but EU fiscal surveillance under the revised Stability and Growth Pact creates external pressure to reduce the deficit to 3% by 2029 [3]. Exposure to global shipping disruptions (Strait of Hormuz) is significant given energy import dependency [5].',
      politicalEconomy: 'The economic model benefits the metropolitan professional class, the luxury/tech sectors, and large exporters [3]. Rural and peri-urban France — the "France périphérique" — bears the brunt of deindustrialization, rising energy costs, and reduced public services [11]. This geographic divide maps directly onto the political divide: RN strength is concentrated in small towns and rural areas [2]. Reforms that are technically needed (pension age, public spending reduction, labor market flexibility) are politically explosive — the 2023 pension reform triggered months of strikes and protests despite eventually passing [11]. The social contract rests on subsidized energy, generous pensions, and universal healthcare — all under fiscal pressure [3]. Any attempt to cut subsidies or raise retirement age further risks mass mobilization [11].',
    },
    security: {
      internal: 'France faces no active insurgency but maintains an elevated terrorism threat level (Vigipirate "enhanced security" posture) since the 2015 attacks [8]. The domestic intelligence service (DGSI) has disrupted multiple plots [8]. Criminal networks operate primarily in overseas territories (Guadeloupe, Martinique, Mayotte) and in some banlieues, but do not threaten state stability [8]. Communal tensions around immigration and Islam periodically flare — the 2023 Nahel shooting triggered nationwide riots [11]. The police and gendarmerie are well-resourced but face morale issues and accusations of excessive force [8]. The military (Armée de Terre, Marine Nationale, Armée de l\'Air) is the largest in the EU with ~205,000 active personnel and a fully independent nuclear deterrent (290+ warheads, with Macron announcing an increase in March 2026) [7].',
      diplomacy: 'France is a founding EU member [1], UN Security Council permanent member (P5) [1], and NATO ally — but maintains a Gaullist tradition of strategic autonomy [7]. Macron\'s March 2026 "advanced deterrence" doctrine marks a historic shift: France will increase its nuclear arsenal and potentially allow European allies to host French nuclear-capable aircraft, creating a deterrence relationship distinct from NATO arrangements [7]. France has distanced itself from the US on the Iran conflict — refusing overflight rights for US military flights to Israel and pushing for an independent European coalition to secure the Strait of Hormuz [9]. Relations with the Trump administration are tense (Trump publicly criticized France in March 2026) [9]. France remains the key military partner for several African states (Sahel, Djibouti) despite the forced withdrawal from Mali, Burkina Faso, and Niger in 2022-2024 [9]. Red lines: territorial integrity (including overseas territories), nuclear sovereignty, EU institutional architecture, and the principle of strategic autonomy from the US [7].',
    },
    actors: {
      domestic: [
        {
          name: 'Emmanuel Macron (President)',
          interests: 'Legacy preservation [2], EU leadership role [1], blocking far-right succession [2], maintaining France\'s international stature [7]',
          resources: 'Constitutional powers (foreign policy, defense, nuclear) [1], appointment power [1], EU diplomatic weight [1]',
          constraints: 'No parliamentary majority [2], cannot run again in 2027 [1], declining approval ratings [2], deliberately blocked successor emergence [2]',
          likelyMoves: 'Focus on foreign policy and EU defense agenda [7]. Attempt to shape 2027 succession indirectly [2]. Possible dissolution if political crisis deepens [2].',
          dealability: 'Limited — increasingly a lame duck domestically, but still decisive on foreign/defense policy [7]',
        },
        {
          name: 'Sébastien Lecornu (Prime Minister)',
          interests: 'Survival in office [2], budget adoption [3], positioning as potential 2027 candidate [2]',
          resources: 'Executive machinery [1], Macron\'s backing [2], technocratic competence [2]',
          constraints: 'No majority — governs through Article 49.3 (forced passage) and ad hoc deals [1]. Vulnerable to no-confidence votes [2].',
          likelyMoves: 'Continue deficit reduction through spending restraint [3]. Avoid provocative reforms [2]. Manage energy crisis response [5].',
          dealability: 'Moderate — pragmatic and transactional, but limited room for maneuver [2]',
        },
        {
          name: 'Marine Le Pen / National Rally (RN)',
          interests: 'Win 2027 presidency [2], normalize the party [2], reduce immigration [2], reassert national sovereignty [2]',
          resources: '2.5M+ municipal votes [2], 3000+ local councillors [2], 88 National Assembly seats [2], dominant poll position for 2027 [2], media presence [10]',
          constraints: 'Criminal conviction (EU fund misuse) — potential ineligibility for 2027 if upheld [6]. Party still lacks governing experience and deep bench of competent officials [2].',
          likelyMoves: 'Appeal conviction [6]. Position Jordan Bardella as backup presidential candidate [2]. Exploit energy crisis and cost-of-living anger [5]. Distance from Trump on Iran [9].',
          dealability: 'Low — maximalist positioning, but increasingly pragmatic on economic policy [2]',
        },
        {
          name: 'Édouard Philippe (Horizons, center-right)',
          interests: 'Win 2027 presidency as the "serious" post-Macron candidate [2]',
          resources: 'Mayoral base (Le Havre) [2], high favorability ratings [2], Horizons party apparatus [2], perceived competence [2]',
          constraints: 'Must differentiate from Macron without alienating centrist voters [2]. Risk of being squeezed between RN and a revived right [2].',
          likelyMoves: 'Build national profile through Le Havre governance [2]. Court LR voters [2]. Present himself as the only candidate who can beat Le Pen in round 2 [2].',
          dealability: 'High — pragmatic, coalition-minded, open to cross-party deals [2]',
        },
        {
          name: 'Jean-Luc Mélenchon / LFI (far left)',
          interests: 'Remain the dominant left-wing presidential candidate [2], radical transformation of the Fifth Republic [1]',
          resources: 'Loyal activist base [2], rhetorical skill [2], social media reach [2], 10-11% polling floor [2]',
          constraints: 'Toxic to moderate voters (antisemitism accusations, Lyon violence, maximalist style) [2]. Alienates potential Socialist/Green allies [2].',
          likelyMoves: 'Run in 2027 regardless of left unity prospects [2]. Maximize disruption [2]. Exploit cost-of-living crisis [5].',
          dealability: 'Very low — rejects compromise as a matter of principle [2]',
        },
        {
          name: 'Socialist Party (PS)',
          interests: 'Rebuild as the mainstream left alternative [2], win back local and national relevance [2]',
          resources: 'Deep local roots (Paris mayoral win March 2026) [2], institutional memory [1], moderate voter appeal [2]',
          constraints: 'Damaged by on-off alliance with LFI [2]. No clear presidential candidate [2]. Organizationally weakened [2].',
          likelyMoves: 'Consolidate local gains [2]. Attempt to build a left coalition excluding LFI [2]. Seek a credible 2027 candidate [2].',
          dealability: 'Moderate — open to alliances but constrained by LFI question [2]',
        },
        {
          name: 'Military / Security Services',
          interests: 'Institutional autonomy [1], budget growth [7], operational readiness [7], nuclear sovereignty [7]',
          resources: 'Largest EU military [7], nuclear arsenal [7], intelligence apparatus [8], public trust [8]',
          constraints: 'Constitutional subordination to civilian authority [1]. Budget pressures from deficit reduction [3].',
          likelyMoves: 'Support Macron\'s nuclear doctrine expansion [7]. Push for defense budget increases [7]. Maintain operational deployments [9].',
          dealability: 'High — professional, apolitical, loyal to constitutional order [8]',
        },
        {
          name: 'Business Elites / MEDEF',
          interests: 'Fiscal consolidation [3], labor market flexibility [3], energy cost containment [5], regulatory stability [3]',
          resources: 'Economic weight [3], lobbying access [3], media influence [10]',
          constraints: 'Divided on energy transition pace [4]. Tensions with unions over labor reforms [11].',
          likelyMoves: 'Push for business-friendly reforms [3]. Oppose energy subsidies [5]. Support centrist candidates [2].',
          dealability: 'High — transactional and pragmatic [3]',
        },
        {
          name: 'Trade Unions (CGT, CFDT, FO)',
          interests: 'Protect wages and benefits [11], resist pension/welfare cuts [3], maintain worker protections [11]',
          resources: 'Strike capacity [11], street mobilization [11], political leverage [2]',
          constraints: 'Declining membership [11]. Fragmented across multiple confederations [11].',
          likelyMoves: 'Mobilize against energy price increases [5]. Oppose further pension reforms [3]. Support left-wing candidates [2].',
          dealability: 'Moderate — responsive to membership pressures, can negotiate but unpredictable [11]',
        },
        {
          name: 'Gilets Jaunes Networks',
          interests: 'Cost-of-living relief [11], anti-elite populism [11], direct democracy [11]',
          resources: 'Grassroots mobilization capacity [11], social media networks [11], symbolic power [11]',
          constraints: 'Decentralized and unstructured [11]. No clear leadership [11].',
          likelyMoves: 'Mobilize if energy prices spike [5]. Exploit anti-government sentiment [2]. Support populist candidates [2].',
          dealability: 'Very low — unstructured, anti-institutional [11]',
        },
      ],
      external: [
        {
          name: 'United States (Trump administration)',
          interests: 'NATO burden-sharing [7], Iran policy alignment [9], trade leverage [9]',
          resources: 'Military alliance [7], economic weight [3], dollar dominance [3]',
          constraints: 'France\'s strategic autonomy tradition limits US leverage [7]. EU solidarity on trade disputes [3].',
          likelyMoves: 'Continue pressuring France on defense spending and Iran policy [9]. Possible trade retaliation [9].',
          dealability: 'Low currently — relations strained over overflight refusal and Iran divergence [9]',
        },
        {
          name: 'Germany',
          interests: 'Franco-German engine for EU [1], coordinated fiscal policy [3], defense cooperation [7]',
          resources: 'Largest EU economy [3], political weight [1], FCAS joint fighter program [12]',
          constraints: 'Own coalition instability [1], different fiscal philosophy [3], defense spending gap [7].',
          likelyMoves: 'Seek pragmatic cooperation on EU defense and energy [7]. Manage fiscal rule disagreements [3].',
          dealability: 'High — structural partnership despite friction [1]',
        },
        {
          name: 'European Union institutions',
          interests: 'Fiscal discipline enforcement [3], single market integrity [3], common defense progress [7]',
          resources: 'Stability and Growth Pact enforcement [3], ECB monetary policy [3], NextGenerationEU funds [3]',
          constraints: 'France is too large to discipline easily [1]. Political sensitivity of imposing austerity on a founding member [1].',
          likelyMoves: 'Monitor France\'s deficit trajectory [3]. Push for compliance with 3% target by 2029 [3].',
          dealability: 'Moderate — rule-based but politically flexible [3]',
        },
        {
          name: 'Russia',
          interests: 'Divide EU/NATO unity [7], energy leverage [5], undermine sanctions regime [9]',
          resources: 'Nuclear arsenal [7], energy exports (reduced) [5], information warfare [10], UN veto [1]',
          constraints: 'War in Ukraine has isolated Russia from France [9]. Sanctions limit economic interaction [9].',
          likelyMoves: 'Information operations targeting French elections [10]. Exploit energy crisis narratives [5].',
          dealability: 'Very low — adversarial relationship since 2022 [9]',
        },
        {
          name: 'China',
          interests: 'EU market access [3], technology transfer [3], reduce Western cohesion [7]',
          resources: 'Economic weight [3], technology sector [3], investment capital [3]',
          constraints: 'EU technology restrictions [3]. France\'s EU commitments limit bilateral deals [1].',
          likelyMoves: 'Seek investment opportunities in French tech/energy [3]. Exploit US-France tensions [9].',
          dealability: 'Moderate — transactional but constrained by EU framework [3]',
        },
      ],
    },
    risks: [
      {
        title: 'Far-right presidential victory in 2027',
        trigger: 'Le Pen or Bardella wins second round of presidential election [2]',
        probability: 'High',
        impact: 'High',
        timeHorizon: '12–24m',
        leadingIndicators: 'Polling trends [2], Le Pen conviction appeal outcome [6], left fragmentation persistence [2], energy crisis duration [5]',
        mitigants: 'Le Pen ineligibility if conviction upheld [6]. Édouard Philippe consolidating center-right vote [2]. Possible left unity behind a moderate candidate [2].',
      },
      {
        title: 'Fiscal crisis / bond market repricing',
        trigger: 'Deficit reduction stalls, credit downgrade, or bond spread widening vs. Germany [3]',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '3–12m',
        leadingIndicators: 'OAT-Bund spread [3], rating agency reviews (S&P, Moody\'s) [3], quarterly deficit data [3], parliamentary budget votes [2]',
        mitigants: 'ECB backstop (TPI instrument) [3]. Better-than-expected 2025 deficit (5.1% vs 5.4% target) [3]. Deep capital markets [3].',
      },
      {
        title: 'Energy price shock → social unrest',
        trigger: 'Oil prices sustained above $120/barrel from Iran conflict, feeding through to petrol, heating, and food prices [5]',
        probability: 'High',
        impact: 'Med',
        timeHorizon: '0–3m',
        leadingIndicators: 'Brent crude price [5], INSEE inflation data [3], fuel price at pump [5], protest mobilization calls (unions, Gilets Jaunes networks) [11]',
        mitigants: 'Nuclear electricity base (~70%) limits electricity price pass-through [4]. Government emergency subsidies (though fiscally constrained) [3]. Strategic petroleum reserves [5].',
      },
      {
        title: 'Institutional crisis from parliamentary deadlock',
        trigger: 'No-confidence vote succeeds, or government unable to pass essential legislation [2]',
        probability: 'Med',
        impact: 'Med',
        timeHorizon: '3–12m',
        leadingIndicators: 'Article 49.3 usage frequency [1], opposition coordination [2], Macron approval ratings [2], snap dissolution rumors [2]',
        mitigants: 'Constitutional tools (49.3, dissolution) [1]. Opposition parties\' reluctance to trigger elections they might lose [2]. Lecornu\'s transactional approach [2].',
      },
      {
        title: 'Terrorism attack',
        trigger: 'Successful attack on French soil, potentially linked to Iran conflict escalation or domestic radicalization [8]',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '0–12m',
        leadingIndicators: 'DGSI threat assessments [8], regional conflict escalation [9], online radicalization indicators [8], Vigipirate level changes [8]',
        mitigants: 'Strong intelligence services (multiple plots disrupted) [8]. Elevated security posture since 2015 [8]. Military deployments (Opération Sentinelle) [8].',
      },
      {
        title: 'EU fiscal rules confrontation',
        trigger: 'European Commission opens Excessive Deficit Procedure, demands accelerated consolidation [3]',
        probability: 'Med',
        impact: 'Low',
        timeHorizon: '3–12m',
        leadingIndicators: 'Commission fiscal assessments [3], Council discussions [1], France\'s compliance trajectory vs. 2029 target [3]',
        mitigants: 'France\'s political weight within EU [1]. Revised SGP allows more flexibility [3]. Better-than-expected 2025 outcome buys time [3].',
      },
      {
        title: 'Nuclear doctrine escalation / NATO friction',
        trigger: 'Macron\'s advanced deterrence doctrine triggers NATO concerns or US retaliation [7]',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '6–18m',
        leadingIndicators: 'NATO statements [7], US diplomatic pressure [9], German reactions [1], implementation announcements [7]',
        mitigants: 'NATO framework accommodates national deterrents [7]. Germany supportive of EU defense autonomy [1]. Macron\'s diplomatic skill [7].',
      },
      {
        title: 'Overseas territory instability',
        trigger: 'Civil unrest or criminal violence escalates in Guadeloupe, Martinique, Mayotte, or French Guiana [8]',
        probability: 'Med',
        impact: 'Low',
        timeHorizon: '6–18m',
        leadingIndicators: 'Local protest activity [11], drug trafficking indicators [8], police incident reports [8], economic data [3]',
        mitigants: 'French military presence [7]. Gendarmerie deployments [8]. Central government authority [1].',
      },
      {
        title: 'Pension/welfare reform backlash',
        trigger: 'Government attempts further cuts to pensions or healthcare; unions and Gilets Jaunes mobilize [11]',
        probability: 'Med',
        impact: 'Med',
        timeHorizon: '3–12m',
        leadingIndicators: 'Government reform announcements [3], union statements [11], protest organization [11], polling on public opinion [2]',
        mitigants: 'Macron\'s 2023 pension reform passed despite protests [11]. Opposition divided [2]. Public fatigue with strikes [11].',
      },
      {
        title: 'Immigration/integration flashpoint',
        trigger: 'High-profile incident (attack, gang violence, or deportation controversy) triggers far-right mobilization [10]',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '0–12m',
        leadingIndicators: 'Crime statistics [8], media coverage [10], RN statements [2], protest mobilization [11]',
        mitigants: 'Police capacity to manage incidents [8]. Judicial independence [1]. Civil society counter-mobilization [10].',
      },
    ],
    sources: [
      {
        name: 'French Government (Official)',
        url: 'https://www.gouvernement.fr',
        desc: 'Official government website; presidential and PM statements; policy announcements; government composition',
        publicationDate: '2025–2026',
        accessDate: 'April 2026',
        confidence: 'High',
        citationType: 'Fact',
      },
      {
        name: 'National Assembly of France',
        url: 'https://www.assemblee-nationale.fr',
        desc: 'Official parliamentary records; election results; legislative procedures; government composition',
        publicationDate: '2025–2026',
        accessDate: 'April 2026',
        confidence: 'High',
        citationType: 'Fact',
      },
      {
        name: 'International Monetary Fund (IMF)',
        url: 'https://www.imf.org/en/Countries/FRA',
        desc: 'France Article IV Consultation; macro-economic data; fiscal projections; debt sustainability analysis',
        publicationDate: '2025',
        accessDate: 'April 2026',
        confidence: 'High',
        citationType: 'Fact',
      },
      {
        name: 'INSEE (Institut National de la Statistique)',
        url: 'https://www.insee.fr/en',
        desc: 'Official national statistics; GDP, inflation, employment, trade data; regional economic indicators',
        publicationDate: '2025–2026',
        accessDate: 'April 2026',
        confidence: 'High',
        citationType: 'Fact',
      },
      {
        name: 'Banque de France',
        url: 'https://www.banque-france.fr/en',
        desc: 'Monetary policy statements; financial stability reports; economic projections; inflation forecasts',
        publicationDate: '2025–2026',
        accessDate: 'April 2026',
        confidence: 'High',
        citationType: 'Fact',
      },
      {
        name: 'French Ministry of Armed Forces',
        url: 'https://www.defense.gouv.fr',
        desc: 'Military doctrine; defense policy; nuclear strategy; security assessments; operational announcements',
        publicationDate: '2025–2026',
        accessDate: 'April 2026',
        confidence: 'High',
        citationType: 'Fact',
      },
      {
        name: 'SIPRI (Stockholm International Peace Research Institute)',
        url: 'https://www.sipri.org',
        desc: 'Military expenditure data; arms transfers; nuclear forces database; defense spending analysis',
        publicationDate: '2025',
        accessDate: 'April 2026',
        confidence: 'High',
        citationType: 'Fact',
      },
      {
        name: 'French Domestic Intelligence (DGSI)',
        url: 'https://www.dgsi.gouv.fr',
        desc: 'Terrorism threat assessments; security incident reports; counterintelligence analysis',
        publicationDate: '2025–2026',
        accessDate: 'April 2026',
        confidence: 'High',
        citationType: 'Fact',
      },
      {
        name: 'Ministry of Foreign Affairs (Quai d\'Orsay)',
        url: 'https://www.diplomatie.gouv.fr',
        desc: 'Foreign policy statements; diplomatic relations; alliance partnerships; international position',
        publicationDate: '2025–2026',
        accessDate: 'April 2026',
        confidence: 'High',
        citationType: 'Fact',
      },
      {
        name: 'Freedom House',
        url: 'https://freedomhouse.org/country/france',
        desc: 'Freedom in the World rating; civil liberties assessment; media freedom analysis',
        publicationDate: '2025',
        accessDate: 'April 2026',
        confidence: 'High',
        citationType: 'Fact',
      },
      {
        name: 'ACLED (Armed Conflict Location & Event Data)',
        url: 'https://acleddata.com',
        desc: 'Protest and political violence event data; civil unrest tracking; Gilets Jaunes activity',
        publicationDate: '2025–2026',
        accessDate: 'April 2026',
        confidence: 'High',
        citationType: 'Fact',
      },
      {
        name: 'Airbus Group',
        url: 'https://www.airbus.com',
        desc: 'Aerospace sector data; export figures; employment; industrial capacity',
        publicationDate: '2025',
        accessDate: 'April 2026',
        confidence: 'High',
        citationType: 'Fact',
      },
      {
        name: 'Carnegie Endowment for International Peace',
        url: 'https://carnegieendowment.org/europe',
        desc: 'French politics analysis; European security assessment; geopolitical forecasting',
        publicationDate: '2025–2026',
        accessDate: 'April 2026',
        confidence: 'Med',
        citationType: 'Interpretation',
      },
      {
        name: 'Reuters',
        url: 'https://www.reuters.com/world/europe/',
        desc: 'Breaking news; political developments; economic data; event reporting',
        publicationDate: '2025–2026',
        accessDate: 'April 2026',
        confidence: 'High',
        citationType: 'Fact',
      },
      {
        name: 'V-Dem Institute',
        url: 'https://v-dem.net',
        desc: 'Democracy indices; governance quality measures; institutional assessment',
        publicationDate: '2025',
        accessDate: 'April 2026',
        confidence: 'Med',
        citationType: 'Interpretation',
      },
      {
        name: 'Transparency International',
        url: 'https://www.transparency.org/en/countries/france',
        desc: 'Corruption Perceptions Index; anti-corruption assessment',
        publicationDate: '2025',
        accessDate: 'April 2026',
        confidence: 'High',
        citationType: 'Fact',
      },
      {
        name: 'European Commission',
        url: 'https://ec.europa.eu',
        desc: 'EU fiscal surveillance; Stability and Growth Pact assessments; economic forecasts',
        publicationDate: '2025–2026',
        accessDate: 'April 2026',
        confidence: 'High',
        citationType: 'Fact',
      },
      {
        name: 'Court of Auditors (Cour des Comptes)',
        url: 'https://www.ccomptes.fr',
        desc: 'Public spending audits; fiscal analysis; government accountability reports',
        publicationDate: '2025–2026',
        accessDate: 'April 2026',
        confidence: 'High',
        citationType: 'Fact',
      },
      {
        name: 'LVMH (Luxury Goods Sector)',
        url: 'https://www.lvmh.com',
        desc: 'Luxury export data; sector performance; employment figures',
        publicationDate: '2025',
        accessDate: 'April 2026',
        confidence: 'High',
        citationType: 'Fact',
      },
      {
        name: 'France Télévisions',
        url: 'https://www.francetelevisions.fr',
        desc: 'Public broadcasting; news coverage; media independence assessment',
        publicationDate: '2025–2026',
        accessDate: 'April 2026',
        confidence: 'High',
        citationType: 'Fact',
      },
      {
        name: 'MEDEF (French Business Federation)',
        url: 'https://www.medef.com',
        desc: 'Business sector positions; economic policy preferences; employment data',
        publicationDate: '2025–2026',
        accessDate: 'April 2026',
        confidence: 'Med',
        citationType: 'Interpretation',
      },
      {
        name: 'CGT (Confédération Générale du Travail)',
        url: 'https://www.cgt.fr',
        desc: 'Trade union positions; labor market assessments; strike activity; worker concerns',
        publicationDate: '2025–2026',
        accessDate: 'April 2026',
        confidence: 'Med',
        citationType: 'Interpretation',
      },
      {
        name: 'Pew Research Center',
        url: 'https://www.pewresearch.org',
        desc: 'Public opinion polling; political attitudes; social trends; demographic analysis',
        publicationDate: '2025–2026',
        accessDate: 'April 2026',
        confidence: 'Med',
        citationType: 'Fact',
      },
    ],
  },
  fr: {
    executiveSnapshot: [
      'Type de régime : République semi-présidentielle (Ve République) [1] ; le pouvoir est concentré dans la présidence, mais l\'autorité de Macron s\'érode à l\'approche de la fin de son second et dernier mandat en 2027 [2].',
      'Équilibre politique : Le PM Sébastien Lecornu (nommé sept. 2025) gouverne sans majorité parlementaire [2]. L\'Assemblée nationale reste fragmentée en trois blocs — centriste (Renaissance/Horizons/Modem), extrême droite (RN), et une gauche fracturée (PS, Verts, LFI) [2]. Aucune coalition stable n\'est possible [2].',
      'Modèle économique : Économie de services avancée (finance, luxe, aéronautique, tourisme, agriculture) [3] [4] ; 6e PIB mondial [3]. Dépenses publiques élevées (~57 % du PIB) finançant un système social étendu [3].',
      'Top 3 risques (6–18 mois) : (1) Victoire de l\'extrême droite en 2027 déstabilisant l\'intégration européenne [2] ; (2) Crise budgétaire si la réduction du déficit stagne et que les marchés obligataires réagissent [3] ; (3) Troubles sociaux liés à l\'inflation énergétique causée par le conflit iranien [5].',
      'Top 3 points de surveillance (4–12 semaines) : (1) Pic d\'inflation printanier lié aux prix du pétrole — l\'INSEE prévoit une hausse marquée [3] ; (2) Situation juridique de Le Pen et impact sur sa candidature 2027 [6] ; (3) Réponse gouvernementale à la crise énergétique — retour des aides d\'urgence ? [3].',
      'Dépendances extérieures : Importations énergétiques (pétrole, gaz — la France produit ~70 % de son électricité par le nucléaire mais dépend des hydrocarbures importés pour le transport/chauffage) [4]. Marché unique UE pour le commerce [3]. Alliance OTAN pour la défense collective, avec dissuasion nucléaire indépendante [7].',
      'Posture sécuritaire : Pas d\'insurrection active [8]. Niveau de menace terroriste élevé maintenu depuis 2015 [8]. Armée puissante (la plus importante de l\'UE, dotée de l\'arme nucléaire) [7]. Nouvelle doctrine de « dissuasion avancée » étendant le parapluie nucléaire aux alliés européens annoncée en mars 2026 [7].',
      'Orientation diplomatique : Membre fondateur de l\'UE [1], siège permanent au Conseil de sécurité de l\'ONU [1], allié OTAN mais avec une tradition gaulliste d\'autonomie stratégique [7]. Distanciation des États-Unis sur l\'Iran (refus de survol pour les vols militaires US vers Israël) [9]. Coalition indépendante pour la sécurité du détroit d\'Ormuz [9].',
      'Confiance dans les données : ÉLEVÉE — la France dispose d\'excellentes données institutionnelles (INSEE, Banque de France, Cour des comptes) [3] et d\'une presse libre [10].',
      'Perspective de référence : Instabilité gérée jusqu\'en 2027 [2]. Le système politique fonctionnera sans majorité, la réduction du déficit sera lente mais pas catastrophique, et l\'élection présidentielle de 2027 sera le moment décisif — avec une possibilité réelle d\'une présidence d\'extrême droite pour la première fois [2].',
    ],
    political: {
      powerStructure: 'Le Président contrôle la politique étrangère, la défense et l\'arme nucléaire [1]. Le PM gère la politique intérieure mais dépend de la confiance parlementaire [1]. Le cercle rapproché de Macron s\'est rétréci — il a délibérément bloqué l\'émergence d\'un successeur [2]. Les services de sécurité (DGSE, DGSI) rendent compte à l\'exécutif et restent loyaux [8]. Le pouvoir judiciaire est indépendant mais sous pression politique — la condamnation de Marine Le Pen pour détournement de fonds du Parlement européen en 2024 a été confirmée, pouvant potentiellement l\'empêcher de se présenter en 2027 [6]. Le Conseil constitutionnel et le Conseil d\'État restent des contre-pouvoirs fonctionnels [1]. Les médias sont pluralistes mais concentrés : le groupe Bolloré (CNews, Europe 1, JDD) penche à droite ; les diffuseurs publics (France Télévisions, Radio France) maintiennent leur indépendance éditoriale sous pression [10].',
      stabilityDrivers: 'La légitimité repose sur les élections démocratiques [1] et la performance de l\'État-providence — quand le pouvoir d\'achat s\'érode, la légitimité chute rapidement (comme lors de la crise des Gilets Jaunes en 2018-19) [11]. Les forces armées et la police sont loyales à l\'ordre constitutionnel, pas à une faction politique [8]. La coalition centriste au pouvoir tient par l\'absence d\'alternatives plutôt que par une cohésion réelle — Renaissance, Horizons (Philippe) et Modem (Bayrou) se positionnent déjà comme rivaux pour 2027 [2]. L\'opposition est divisée : le RN domine électoralement à droite mais est contraint judiciairement [6] ; la gauche est scindée entre un PS modéré en reconstruction locale et LFI (Mélenchon), dont le style maximaliste repousse les alliés potentiels [2]. La force institutionnelle est réelle mais tendue — l\'architecture constitutionnelle de la Ve République concentre le pouvoir d\'une manière qui amplifie la faiblesse exécutive quand le président n\'a pas de majorité [1].',
      shockAbsorbers: 'Amortisseurs : Marchés de capitaux profonds et crédit souverain proche du AAA (noté AA- par S&P) [3]. Banque de France au sein de l\'Eurosystème [3]. Filets de sécurité sociale étendus (assurance chômage, santé, retraites) [3]. Base nucléaire assurant l\'indépendance électrique [4]. Forte continuité de la fonction publique [1]. Accélérateurs : Pics d\'inflation liés aux prix du pétrole érodant le pouvoir d\'achat [5]. Élection présidentielle 2027 contestée avec potentiel de mobilisation de rue [2]. Trajectoire du déficit pouvant déclencher l\'application des règles budgétaires européennes ou une réévaluation des marchés obligataires [3]. Fragmentation des élites à mesure que la coalition de Macron se dissout avant la succession [2]. Polarisation culturelle croissante autour de l\'immigration, de l\'islam et de l\'identité nationale [10].',
    },
    economy: {
      macroReality: 'La croissance du PIB est prévue sous 1 % pour 2025-2026 (FMI) [3]. Le déficit public 2025 s\'est établi à 5,1 % du PIB — mieux que l\'objectif de 5,4 % mais toujours bien au-dessus du plafond de 3 % de l\'UE [3]. La dette publique a atteint un record de 3 460,5 milliards d\'euros (115,6 % du PIB) fin 2025 [3]. Les recettes fiscales ont augmenté plus rapidement que prévu en 2025, et la croissance des dépenses a ralenti, fournissant un allègement budgétaire [3]. Cependant, l\'inflation devrait augmenter fortement au printemps 2026 à mesure que les prix du pétrole en hausse liés au conflit iranien se répercutent sur les coûts énergétiques et de transport [5]. Le gouverneur de la Banque de France a averti que les contraintes budgétaires limitent gravement toute réponse budgétaire à la crise énergétique [3]. Le gouvernement a rejeté les réductions d\'impôts, affirmant qu\'elles aggraveraient le déficit [3]. Le budget 2026 a été adopté après une crise politique prolongée, mais une consolidation supplémentaire sera politiquement douloureuse [2].',
      externalVulnerability: 'La France enregistre un déficit persistant du compte courant [3]. Les exportations sont concentrées dans l\'aéronautique (Airbus) [12], les biens de luxe (LVMH, Hermès), l\'agriculture (vin, céréales) et l\'équipement de défense [4]. La dépendance aux importations est aiguë pour les hydrocarbures — la crise pétrolière liée à l\'Iran menace directement la balance commerciale et les prix à la consommation [5]. La dette publique est largement détenue par des investisseurs internationaux (~50 % non-résidents), rendant la France sensible aux sentiments des marchés obligataires [3]. Il n\'y a pas de programme du FMI, mais la surveillance budgétaire de l\'UE en vertu du Pacte de stabilité et de croissance révisé crée une pression externe pour réduire le déficit à 3 % d\'ici 2029 [3]. L\'exposition aux perturbations du transport maritime mondial (détroit d\'Ormuz) est importante compte tenu de la dépendance aux importations énergétiques [5].',
      politicalEconomy: 'Le modèle économique bénéficie à la classe professionnelle métropolitaine, aux secteurs du luxe/tech et aux grands exportateurs [3]. La France rurale et périurbaine — la « France périphérique » — subit le poids de la désindustrialisation, de la hausse des coûts énergétiques et de la réduction des services publics [11]. Cette division géographique correspond directement à la division politique : la force du RN est concentrée dans les petites villes et les zones rurales [2]. Les réformes techniquement nécessaires (âge de la retraite, réduction des dépenses publiques, flexibilité du marché du travail) sont politiquement explosives — la réforme des retraites de 2023 a déclenché des mois de grèves et de protestations malgré son adoption finale [11]. Le contrat social repose sur l\'énergie subventionnée, les retraites généreuses et l\'assurance maladie universelle — tous sous pression budgétaire [3]. Toute tentative de réduire les subventions ou de relever davantage l\'âge de la retraite risque de déclencher une mobilisation massive [11].',
    },
    security: {
      internal: 'La France ne fait face à aucune insurrection active mais maintient un niveau de menace terroriste élevé (posture « sécurité renforcée » de Vigipirate) depuis les attaques de 2015 [8]. Le service de renseignement intérieur (DGSI) a déjoué plusieurs complots [8]. Les réseaux criminels opèrent principalement dans les territoires d\'outre-mer (Guadeloupe, Martinique, Mayotte) et dans certaines banlieues, mais ne menacent pas la stabilité de l\'État [8]. Les tensions communautaires autour de l\'immigration et de l\'islam s\'enflamment périodiquement — le meurtre de Nahel en 2023 a déclenché des émeutes nationales [11]. La police et la gendarmerie sont bien dotées en ressources mais font face à des problèmes de moral et à des accusations de recours excessif à la force [8]. L\'armée (Armée de Terre, Marine Nationale, Armée de l\'Air) est la plus importante de l\'UE avec ~205 000 personnels actifs et une dissuasion nucléaire entièrement indépendante (290+ têtes nucléaires, Macron annonçant une augmentation en mars 2026) [7].',
      diplomacy: 'La France est un membre fondateur de l\'UE [1], membre permanent du Conseil de sécurité de l\'ONU (P5) [1], et allié de l\'OTAN — mais maintient une tradition gaulliste d\'autonomie stratégique [7]. La doctrine de « dissuasion avancée » de Macron en mars 2026 marque un tournant historique : la France augmentera son arsenal nucléaire et pourrait potentiellement permettre aux alliés européens d\'accueillir des aéronefs nucléaires français, créant une relation de dissuasion distincte des arrangements de l\'OTAN [7]. La France s\'est distanciée des États-Unis sur le conflit iranien — refusant les droits de survol pour les vols militaires américains vers Israël et promouvant une coalition européenne indépendante pour sécuriser le détroit d\'Ormuz [9]. Les relations avec l\'administration Trump sont tendues (Trump a critiqué publiquement la France en mars 2026) [9]. La France reste le principal partenaire militaire de plusieurs États africains (Sahel, Djibouti) malgré le retrait forcé du Mali, du Burkina Faso et du Niger en 2022-2024 [9]. Lignes rouges : intégrité territoriale (y compris les territoires d\'outre-mer), souveraineté nucléaire, architecture institutionnelle de l\'UE, et le principe d\'autonomie stratégique vis-à-vis des États-Unis [7].',
    },
    actors: {
      domestic: [
        {
          name: 'Emmanuel Macron (Président)',
          interests: 'Préservation de l\'héritage [2], rôle de leader européen [1], blocage de la succession d\'extrême droite [2], maintien du prestige international de la France [7]',
          resources: 'Pouvoirs constitutionnels (politique étrangère, défense, nucléaire) [1], pouvoir de nomination [1], poids diplomatique européen [1]',
          constraints: 'Pas de majorité parlementaire [2], ne peut pas se présenter en 2027 [1], cotes d\'approbation en baisse [2], a délibérément bloqué l\'émergence d\'un successeur [2]',
          likelyMoves: 'Concentration sur la politique étrangère et l\'agenda de défense européenne [7]. Tentative de façonner indirectement la succession 2027 [2]. Dissolution possible si la crise politique s\'approfondit [2].',
          dealability: 'Limitée — de plus en plus un canard boiteux au niveau intérieur, mais toujours décisif en politique étrangère/défense [7]',
        },
        {
          name: 'Sébastien Lecornu (Premier ministre)',
          interests: 'Survie au pouvoir [2], adoption du budget [3], positionnement comme candidat potentiel 2027 [2]',
          resources: 'Appareil exécutif [1], soutien de Macron [2], compétence technocratique [2]',
          constraints: 'Pas de majorité — gouverne via l\'article 49.3 (passage forcé) et des accords ad hoc [1]. Vulnérable aux votes de censure [2].',
          likelyMoves: 'Continuer la réduction du déficit par la retenue des dépenses [3]. Éviter les réformes provocatrices [2]. Gérer la réponse à la crise énergétique [5].',
          dealability: 'Modérée — pragmatique et transactionnel, mais avec peu de marge de manœuvre [2]',
        },
        {
          name: 'Marine Le Pen / Rassemblement national (RN)',
          interests: 'Remporter la présidence 2027 [2], normaliser le parti [2], réduire l\'immigration [2], réaffirmer la souveraineté nationale [2]',
          resources: '2,5M+ votes municipaux [2], 3000+ conseillers locaux [2], 88 sièges à l\'Assemblée nationale [2], position dominante aux sondages pour 2027 [2], présence médiatique [10]',
          constraints: 'Condamnation pénale (détournement de fonds européens) — inéligibilité potentielle pour 2027 si confirmée [6]. Le parti manque toujours d\'expérience gouvernementale et d\'un vivier profond de fonctionnaires compétents [2].',
          likelyMoves: 'Appel de la condamnation [6]. Positionnement de Jordan Bardella comme candidat présidentiel de secours [2]. Exploitation de la colère liée à la crise énergétique et au coût de la vie [5]. Distanciation avec Trump sur l\'Iran [9].',
          dealability: 'Faible — positionnement maximaliste, mais de plus en plus pragmatique sur la politique économique [2]',
        },
        {
          name: 'Édouard Philippe (Horizons, centre-droit)',
          interests: 'Remporter la présidence 2027 en tant que candidat « sérieux » post-Macron [2]',
          resources: 'Base électorale (Le Havre) [2], cotes de faveur élevées [2], appareil du parti Horizons [2], compétence perçue [2]',
          constraints: 'Doit se différencier de Macron sans aliéner les électeurs centristes [2]. Risque d\'être écrasé entre le RN et une droite revitalisée [2].',
          likelyMoves: 'Construire un profil national via la gouvernance du Havre [2]. Courtiser les électeurs LR [2]. Se présenter comme le seul candidat capable de battre Le Pen au second tour [2].',
          dealability: 'Élevée — pragmatique, ouvert aux coalitions, disposé à négocier [2]',
        },
        {
          name: 'Jean-Luc Mélenchon / LFI (extrême gauche)',
          interests: 'Rester le candidat présidentiel dominant de la gauche [2], transformation radicale de la Ve République [1]',
          resources: 'Base militante loyale [2], talent rhétorique [2], portée des médias sociaux [2], plancher électoral de 10-11 % [2]',
          constraints: 'Toxique pour les électeurs modérés (accusations d\'antisémitisme, violence à Lyon, style maximaliste) [2]. Aliène les alliés socialistes/verts potentiels [2].',
          likelyMoves: 'Se présenter en 2027 indépendamment des perspectives d\'unité de la gauche [2]. Maximiser la perturbation [2]. Exploiter la crise du coût de la vie [5].',
          dealability: 'Très faible — rejette le compromis par principe [2]',
        },
        {
          name: 'Parti socialiste (PS)',
          interests: 'Se reconstruire comme alternative de gauche dominante [2], reconquérir la pertinence locale et nationale [2]',
          resources: 'Racines locales profondes (victoire électorale de Paris en mars 2026) [2], mémoire institutionnelle [1], attrait des électeurs modérés [2]',
          constraints: 'Endommagé par l\'alliance intermittente avec LFI [2]. Pas de candidat présidentiel clair [2]. Affaibli organisationnellement [2].',
          likelyMoves: 'Consolider les gains locaux [2]. Tenter de construire une coalition de gauche excluant LFI [2]. Chercher un candidat crédible pour 2027 [2].',
          dealability: 'Modérée — ouverte aux alliances mais contrainte par la question LFI [2]',
        },
        {
          name: 'Armée / Services de sécurité',
          interests: 'Autonomie institutionnelle [1], augmentation du budget [7], préparation opérationnelle [7], souveraineté nucléaire [7]',
          resources: 'Armée la plus importante de l\'UE [7], arsenal nucléaire [7], appareil de renseignement [8], confiance publique [8]',
          constraints: 'Subordination constitutionnelle à l\'autorité civile [1]. Pressions budgétaires dues à la réduction du déficit [3].',
          likelyMoves: 'Soutien à l\'expansion de la doctrine nucléaire de Macron [7]. Pression pour augmenter le budget de défense [7]. Maintien des déploiements opérationnels [9].',
          dealability: 'Élevée — professionnel, apolitique, loyal à l\'ordre constitutionnel [8]',
        },
        {
          name: 'Élites commerciales / MEDEF',
          interests: 'Consolidation budgétaire [3], flexibilité du marché du travail [3], maîtrise des coûts énergétiques [5], stabilité réglementaire [3]',
          resources: 'Poids économique [3], accès au lobbying [3], influence médiatique [10]',
          constraints: 'Divisé sur le rythme de la transition énergétique [4]. Tensions avec les syndicats sur les réformes du travail [11].',
          likelyMoves: 'Pression pour des réformes favorables aux entreprises [3]. Opposition aux subventions énergétiques [5]. Soutien aux candidats centristes [2].',
          dealability: 'Élevée — transactionnel et pragmatique [3]',
        },
        {
          name: 'Syndicats (CGT, CFDT, FO)',
          interests: 'Protection des salaires et des prestations [11], résistance aux réductions de pensions/bien-être [3], maintien des protections des travailleurs [11]',
          resources: 'Capacité de grève [11], mobilisation de rue [11], levier politique [2]',
          constraints: 'Adhésion en déclin [11]. Fragmenté entre plusieurs confédérations [11].',
          likelyMoves: 'Mobilisation contre les augmentations des prix énergétiques [5]. Opposition à d\'autres réformes des retraites [3]. Soutien aux candidats de gauche [2].',
          dealability: 'Modérée — réactive aux pressions des adhérents, peut négocier mais imprévisible [11]',
        },
        {
          name: 'Réseaux Gilets Jaunes',
          interests: 'Allègement du coût de la vie [11], populisme anti-élite [11], démocratie directe [11]',
          resources: 'Capacité de mobilisation de base [11], réseaux de médias sociaux [11], pouvoir symbolique [11]',
          constraints: 'Décentralisé et non structuré [11]. Pas de leadership clair [11].',
          likelyMoves: 'Mobilisation si les prix énergétiques augmentent [5]. Exploitation du sentiment anti-gouvernement [2]. Soutien aux candidats populistes [2].',
          dealability: 'Très faible — non structuré, anti-institutionnel [11]',
        },
      ],
      external: [
        {
          name: 'États-Unis (administration Trump)',
          interests: 'Partage des charges de l\'OTAN [7], alignement sur la politique iranienne [9], levier commercial [9]',
          resources: 'Alliance militaire [7], poids économique [3], dominance du dollar [3]',
          constraints: 'La tradition d\'autonomie stratégique de la France limite le levier américain [7]. Solidarité de l\'UE sur les différends commerciaux [3].',
          likelyMoves: 'Continuation de la pression sur la France concernant les dépenses de défense et la politique iranienne [9]. Possible représailles commerciales [9].',
          dealability: 'Faible actuellement — relations tendues en raison du refus de survol et de la divergence sur l\'Iran [9]',
        },
        {
          name: 'Allemagne',
          interests: 'Moteur franco-allemand pour l\'UE [1], politique budgétaire coordonnée [3], coopération en défense [7]',
          resources: 'Économie la plus importante de l\'UE [3], poids politique [1], programme de chasseur conjoint FCAS [12]',
          constraints: 'Instabilité de sa propre coalition [1], philosophie budgétaire différente [3], écart de dépenses de défense [7].',
          likelyMoves: 'Recherche de coopération pragmatique sur la défense et l\'énergie européennes [7]. Gestion des désaccords sur les règles budgétaires [3].',
          dealability: 'Élevée — partenariat structurel malgré les frictions [1]',
        },
        {
          name: 'Institutions de l\'Union européenne',
          interests: 'Application de la discipline budgétaire [3], intégrité du marché unique [3], progrès de la défense commune [7]',
          resources: 'Application du Pacte de stabilité et de croissance [3], politique monétaire de la BCE [3], fonds NextGenerationEU [3]',
          constraints: 'La France est trop importante pour être facilement disciplinée [1]. Sensibilité politique de l\'imposition de l\'austérité à un membre fondateur [1].',
          likelyMoves: 'Surveillance de la trajectoire du déficit français [3]. Pression pour le respect de l\'objectif de 3 % d\'ici 2029 [3].',
          dealability: 'Modérée — basée sur les règles mais politiquement flexible [3]',
        },
        {
          name: 'Russie',
          interests: 'Division de l\'unité UE/OTAN [7], levier énergétique [5], affaiblissement du régime de sanctions [9]',
          resources: 'Arsenal nucléaire [7], exportations énergétiques (réduites) [5], guerre de l\'information [10], droit de veto à l\'ONU [1]',
          constraints: 'La guerre en Ukraine a isolé la Russie de la France [9]. Les sanctions limitent l\'interaction économique [9].',
          likelyMoves: 'Opérations d\'information ciblant les élections françaises [10]. Exploitation des narratifs de crise énergétique [5].',
          dealability: 'Très faible — relation antagoniste depuis 2022 [9]',
        },
        {
          name: 'Chine',
          interests: 'Accès au marché de l\'UE [3], transfert de technologie [3], réduction de la cohésion occidentale [7]',
          resources: 'Poids économique [3], secteur technologique [3], capital d\'investissement [3]',
          constraints: 'Restrictions technologiques de l\'UE [3]. Les engagements de la France envers l\'UE limitent les accords bilatéraux [1].',
          likelyMoves: 'Recherche d\'opportunités d\'investissement dans la tech/énergie française [3]. Exploitation des tensions US-France [9].',
          dealability: 'Modérée — transactionnel mais contraint par le cadre de l\'UE [3]',
        },
      ],
    },
    risks: [
      {
        title: 'Victoire présidentielle d\'extrême droite en 2027',
        trigger: 'Le Pen ou Bardella remporte le second tour de l\'élection présidentielle [2]',
        probability: 'High',
        impact: 'High',
        timeHorizon: '12–24m',
        leadingIndicators: 'Tendances des sondages [2], résultat de l\'appel de la condamnation de Le Pen [6], persistance de la fragmentation de la gauche [2], durée de la crise énergétique [5]',
        mitigants: 'Inéligibilité de Le Pen si la condamnation est confirmée [6]. Édouard Philippe consolidant le vote du centre-droit [2]. Possible unité de la gauche derrière un candidat modéré [2].',
      },
      {
        title: 'Crise budgétaire / réévaluation des marchés obligataires',
        trigger: 'La réduction du déficit stagne, dégradation de crédit, ou élargissement de l\'écart OAT-Bund vs. Allemagne [3]',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '3–12m',
        leadingIndicators: 'Écart OAT-Bund [3], révisions des agences de notation (S&P, Moody\'s) [3], données trimestrielles du déficit [3], votes budgétaires parlementaires [2]',
        mitigants: 'Filet de sécurité de la BCE (instrument TPI) [3]. Déficit 2025 meilleur que prévu (5,1 % vs 5,4 % cible) [3]. Marchés de capitaux profonds [3].',
      },
      {
        title: 'Choc des prix énergétiques → troubles sociaux',
        trigger: 'Prix du pétrole soutenus au-dessus de 120 $/baril en raison du conflit iranien, se répercutant sur l\'essence, le chauffage et les prix alimentaires [5]',
        probability: 'High',
        impact: 'Med',
        timeHorizon: '0–3m',
        leadingIndicators: 'Prix du Brent [5], données d\'inflation INSEE [3], prix du carburant à la pompe [5], appels à mobilisation de protestation (syndicats, réseaux Gilets Jaunes) [11]',
        mitigants: 'Base d\'électricité nucléaire (~70 %) limitant la répercussion des prix de l\'électricité [4]. Subventions d\'urgence gouvernementales (bien que fiscalement contraintes) [3]. Réserves stratégiques de pétrole [5].',
      },
      {
        title: 'Crise institutionnelle due à l\'impasse parlementaire',
        trigger: 'Vote de censure réussi, ou gouvernement incapable de faire passer une législation essentielle [2]',
        probability: 'Med',
        impact: 'Med',
        timeHorizon: '3–12m',
        leadingIndicators: 'Fréquence d\'utilisation de l\'article 49.3 [1], coordination de l\'opposition [2], cotes d\'approbation de Macron [2], rumeurs de dissolution rapide [2]',
        mitigants: 'Outils constitutionnels (49.3, dissolution) [1]. Réticence des partis d\'opposition à déclencher des élections qu\'ils pourraient perdre [2]. Approche transactionnelle de Lecornu [2].',
      },
      {
        title: 'Attentat terroriste',
        trigger: 'Attentat réussi sur le sol français, potentiellement lié à l\'escalade du conflit iranien ou à la radicalisation intérieure [8]',
        probability: 'Med',
        impact: 'High',
        timeHorizon: '0–12m',
        leadingIndicators: 'Évaluations des menaces de la DGSI [8], escalade du conflit régional [9], indicateurs de radicalisation en ligne [8], changements du niveau Vigipirate [8]',
        mitigants: 'Services de renseignement puissants (plusieurs complots déjoués) [8]. Posture de sécurité renforcée depuis 2015 [8]. Déploiements militaires (Opération Sentinelle) [8].',
      },
      {
        title: 'Confrontation avec les règles budgétaires de l\'UE',
        trigger: 'La Commission européenne ouvre une procédure de déficit excessif, exige une consolidation accélérée [3]',
        probability: 'Med',
        impact: 'Low',
        timeHorizon: '3–12m',
        leadingIndicators: 'Évaluations budgétaires de la Commission [3], discussions du Conseil [1], trajectoire de conformité de la France vs. objectif 2029 [3]',
        mitigants: 'Poids politique de la France au sein de l\'UE [1]. Le Pacte de stabilité et de croissance révisé permet plus de flexibilité [3]. Le résultat 2025 meilleur que prévu achète du temps [3].',
      },
      {
        title: 'Escalade de la doctrine nucléaire / friction OTAN',
        trigger: 'La doctrine de dissuasion avancée de Macron déclenche des préoccupations de l\'OTAN ou des représailles américaines [7]',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '6–18m',
        leadingIndicators: 'Déclarations de l\'OTAN [7], pression diplomatique américaine [9], réactions allemandes [1], annonces de mise en œuvre [7]',
        mitigants: 'Le cadre OTAN accommode les dissuasions nationales [7]. L\'Allemagne soutient l\'autonomie de défense européenne [1]. Compétence diplomatique de Macron [7].',
      },
      {
        title: 'Instabilité des territoires d\'outre-mer',
        trigger: 'Les troubles civils ou la violence criminelle s\'intensifient en Guadeloupe, Martinique, Mayotte ou Guyane française [8]',
        probability: 'Med',
        impact: 'Low',
        timeHorizon: '6–18m',
        leadingIndicators: 'Activité de protestation locale [11], indicateurs du trafic de drogue [8], rapports d\'incidents policiers [8], données économiques [3]',
        mitigants: 'Présence militaire française [7]. Déploiements de gendarmerie [8]. Autorité du gouvernement central [1].',
      },
      {
        title: 'Réaction aux réformes des retraites/bien-être',
        trigger: 'Le gouvernement tente d\'autres réductions de pensions ou de soins de santé ; syndicats et Gilets Jaunes se mobilisent [11]',
        probability: 'Med',
        impact: 'Med',
        timeHorizon: '3–12m',
        leadingIndicators: 'Annonces de réformes gouvernementales [3], déclarations syndicales [11], organisation de protestations [11], sondages d\'opinion publique [2]',
        mitigants: 'La réforme des retraites 2023 de Macron a réussi malgré les protestations [11]. L\'opposition est divisée [2]. Fatigue publique face aux grèves [11].',
      },
      {
        title: 'Point d\'achoppement immigration/intégration',
        trigger: 'Incident très médiatisé (attaque, violence de gang, ou controverse sur les expulsions) déclenche la mobilisation d\'extrême droite [10]',
        probability: 'Low',
        impact: 'Med',
        timeHorizon: '0–12m',
        leadingIndicators: 'Statistiques criminelles [8], couverture médiatique [10], déclarations du RN [2], mobilisation de protestation [11]',
        mitigants: 'Capacité policière à gérer les incidents [8]. Indépendance judiciaire [1]. Contre-mobilisation de la société civile [10].',
      },
    ],
    sources: [
      {
        name: 'Gouvernement français (Officiel)',
        url: 'https://www.gouvernement.fr',
        desc: 'Site officiel du gouvernement ; déclarations présidentielles et du PM ; annonces de politique ; composition gouvernementale',
        publicationDate: '2025–2026',
        accessDate: 'April 2026',
        confidence: 'High',
        citationType: 'Fact',
      },
      {
        name: 'Assemblée nationale de France',
        url: 'https://www.assemblee-nationale.fr',
        desc: 'Dossiers parlementaires officiels ; résultats électoraux ; procédures législatives ; composition gouvernementale',
        publicationDate: '2025–2026',
        accessDate: 'April 2026',
        confidence: 'High',
        citationType: 'Fact',
      },
      {
        name: 'Fonds monétaire international (FMI)',
        url: 'https://www.imf.org/en/Countries/FRA',
        desc: 'Consultation Article IV de la France ; données macroéconomiques ; projections budgétaires ; analyse de la viabilité de la dette',
        publicationDate: '2025',
        accessDate: 'April 2026',
        confidence: 'High',
        citationType: 'Fact',
      },
      {
        name: 'INSEE (Institut national de la statistique)',
        url: 'https://www.insee.fr/en',
        desc: 'Statistiques nationales officielles ; PIB, inflation, emploi, données commerciales ; indicateurs économiques régionaux',
        publicationDate: '2025–2026',
        accessDate: 'April 2026',
        confidence: 'High',
        citationType: 'Fact',
      },
      {
        name: 'Banque de France',
        url: 'https://www.banque-france.fr/en',
        desc: 'Déclarations de politique monétaire ; rapports de stabilité financière ; projections économiques ; prévisions d\'inflation',
        publicationDate: '2025–2026',
        accessDate: 'April 2026',
        confidence: 'High',
        citationType: 'Fact',
      },
      {
        name: 'Ministère français des Armées',
        url: 'https://www.defense.gouv.fr',
        desc: 'Doctrine militaire ; politique de défense ; stratégie nucléaire ; évaluations de sécurité ; annonces opérationnelles',
        publicationDate: '2025–2026',
        accessDate: 'April 2026',
        confidence: 'High',
        citationType: 'Fact',
      },
      {
        name: 'SIPRI (Institut international de recherche sur la paix de Stockholm)',
        url: 'https://www.sipri.org',
        desc: 'Données sur les dépenses militaires ; transferts d\'armes ; base de données sur les forces nucléaires ; analyse des dépenses de défense',
        publicationDate: '2025',
        accessDate: 'April 2026',
        confidence: 'High',
        citationType: 'Fact',
      },
      {
        name: 'Renseignement intérieur français (DGSI)',
        url: 'https://www.dgsi.gouv.fr',
        desc: 'Évaluations des menaces terroristes ; rapports d\'incidents de sécurité ; analyse du contre-espionnage',
        publicationDate: '2025–2026',
        accessDate: 'April 2026',
        confidence: 'High',
        citationType: 'Fact',
      },
      {
        name: 'Ministère des Affaires étrangères (Quai d\'Orsay)',
        url: 'https://www.diplomatie.gouv.fr',
        desc: 'Déclarations de politique étrangère ; relations diplomatiques ; partenariats d\'alliance ; position internationale',
        publicationDate: '2025–2026',
        accessDate: 'April 2026',
        confidence: 'High',
        citationType: 'Fact',
      },
      {
        name: 'Freedom House',
        url: 'https://freedomhouse.org/country/france',
        desc: 'Évaluation Freedom in the World ; évaluation des libertés civiles ; analyse de la liberté de la presse',
        publicationDate: '2025',
        accessDate: 'April 2026',
        confidence: 'High',
        citationType: 'Fact',
      },
      {
        name: 'ACLED (Données de localisation et d\'événements de conflits armés)',
        url: 'https://acleddata.com',
        desc: 'Données sur les protestations et la violence politique ; suivi des troubles civils ; activité des Gilets Jaunes',
        publicationDate: '2025–2026',
        accessDate: 'April 2026',
        confidence: 'High',
        citationType: 'Fact',
      },
      {
        name: 'Groupe Airbus',
        url: 'https://www.airbus.com',
        desc: 'Données du secteur aérospatial ; chiffres d\'exportation ; emploi ; capacité industrielle',
        publicationDate: '2025',
        accessDate: 'April 2026',
        confidence: 'High',
        citationType: 'Fact',
      },
      {
        name: 'Fondation Carnegie pour la paix internationale',
        url: 'https://carnegieendowment.org/europe',
        desc: 'Analyse de la politique française ; évaluation de la sécurité européenne ; prévisions géopolitiques',
        publicationDate: '2025–2026',
        accessDate: 'April 2026',
        confidence: 'Med',
        citationType: 'Interpretation',
      },
      {
        name: 'Reuters',
        url: 'https://www.reuters.com/world/europe/',
        desc: 'Actualités de dernière minute ; développements politiques ; données économiques ; rapports d\'événements',
        publicationDate: '2025–2026',
        accessDate: 'April 2026',
        confidence: 'High',
        citationType: 'Fact',
      },
      {
        name: 'Institut V-Dem',
        url: 'https://v-dem.net',
        desc: 'Indices de démocratie ; mesures de qualité de la gouvernance ; évaluation institutionnelle',
        publicationDate: '2025',
        accessDate: 'April 2026',
        confidence: 'Med',
        citationType: 'Interpretation',
      },
      {
        name: 'Transparency International',
        url: 'https://www.transparency.org/en/countries/france',
        desc: 'Indice de perception de la corruption ; évaluation de la lutte contre la corruption',
        publicationDate: '2025',
        accessDate: 'April 2026',
        confidence: 'High',
        citationType: 'Fact',
      },
      {
        name: 'Commission européenne',
        url: 'https://ec.europa.eu',
        desc: 'Surveillance budgétaire de l\'UE ; évaluations du Pacte de stabilité et de croissance ; prévisions économiques',
        publicationDate: '2025–2026',
        accessDate: 'April 2026',
        confidence: 'High',
        citationType: 'Fact',
      },
      {
        name: 'Cour des comptes',
        url: 'https://www.ccomptes.fr',
        desc: 'Audits des dépenses publiques ; analyse budgétaire ; rapports de responsabilité gouvernementale',
        publicationDate: '2025–2026',
        accessDate: 'April 2026',
        confidence: 'High',
        citationType: 'Fact',
      },
      {
        name: 'LVMH (Secteur des biens de luxe)',
        url: 'https://www.lvmh.com',
        desc: 'Données d\'exportation de luxe ; performance sectorielle ; chiffres d\'emploi',
        publicationDate: '2025',
        accessDate: 'April 2026',
        confidence: 'High',
        citationType: 'Fact',
      },
      {
        name: 'France Télévisions',
        url: 'https://www.francetelevisions.fr',
        desc: 'Radiodiffusion publique ; couverture d\'actualités ; évaluation de l\'indépendance médiatique',
        publicationDate: '2025–2026',
        accessDate: 'April 2026',
        confidence: 'High',
        citationType: 'Fact',
      },
      {
        name: 'MEDEF (Fédération patronale française)',
        url: 'https://www.medef.com',
        desc: 'Positions du secteur commercial ; préférences de politique économique ; données d\'emploi',
        publicationDate: '2025–2026',
        accessDate: 'April 2026',
        confidence: 'Med',
        citationType: 'Interpretation',
      },
      {
        name: 'CGT (Confédération générale du travail)',
        url: 'https://www.cgt.fr',
        desc: 'Positions des syndicats ; évaluations du marché du travail ; activité de grève ; préoccupations des travailleurs',
        publicationDate: '2025–2026',
        accessDate: 'April 2026',
        confidence: 'Med',
        citationType: 'Interpretation',
      },
      {
        name: 'Centre de recherche Pew',
        url: 'https://www.pewresearch.org',
        desc: 'Sondages d\'opinion publique ; attitudes politiques ; tendances sociales ; analyse démographique',
        publicationDate: '2025–2026',
        accessDate: 'April 2026',
        confidence: 'Med',
        citationType: 'Fact',
      },
    ],
  },
};
