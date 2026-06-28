# Pass A Prompt (CAN)

Country: Canada (Canada)
Date: 2026-06-28

You are a geopolitical analyst preparing to write a structured country situation report on Canada for an audience of senior decision-makers and investors. Before writing any prose, your task in this pass is to assemble a high-quality source list only.

Return ONLY a JSON array of sources. No prose, no analysis, no section headers — just sources.

Each source must match this schema (7 fields required; publicationDate optional):
[
  {
    "id": "short-slug",
    "name": "Full Publication Name",
    "url": "https://exact-url-to-specific-document-not-homepage",
    "desc": "One sentence: what this source is and what specific data it provides for Canada.",
    "publicationDate": "YYYY-MM-DD or omit if the page shows no reliable date",
    "accessDate": "2026-06-28",
    "confidence": "High | Med | Low",
    "citationType": "Fact | Interpretation"
  }
]

publicationDate rule: include it ONLY if the source genuinely shows a publication
or last-updated date. If a legitimate primary source (e.g. a government landing
page) has no reliable date, OMIT the field entirely — do NOT guess, approximate,
or copy accessDate into it. An honest undated source is preferred over a faked date
or a worse source chosen only because it shows a date. accessDate is always required.

Source priority rules:
- Macro/Finance: national statistics office, IMF, World Bank, BIS, OECD
- Governance/Rule of law: V-Dem, Freedom House, World Justice Project (WJP)
- Government composition (who governs now): the national legislature's official seat-standings page, national electoral authority — must reflect the current distribution (last 90 days); majority/minority/coalition status derived from it
- Corruption: Transparency International
- Conflict/Security: ACLED, SIPRI, International Crisis Group (ICG)
- Trade: WTO, UN Comtrade
- Society / demography: UN DESA World Population Prospects, national census, national statistics office
- Society / composition (ethnic·linguistic·religious): national census, Pew–Templeton Global Religious Futures, ARDA (Association of Religion Data Archives)
- Society / cohesion & social capital: the region's own citizen self-report barometer as the PRIMARY instrument — Afrobarometer, Arab Barometer, Latinobarómetro, Asian Barometer, Eurobarometer, World Values Survey, or Pew (PRIMARY here, not triangulation)
- Recent events of fact: national news outlets ONLY for events verified as fact in the last 90 days
- Do NOT cite Wikipedia, homepages, aggregators, or blogs
- Deep links only — the specific document or data page, not a site homepage

The sources you collect must be sufficient to support ALL of the following content sections in Pass B:

1. executiveSnapshot — 11 bullet points covering: regime type, political equilibrium, economic model, social structure, top risks, top watch items, external dependencies, security posture, diplomatic orientation, data confidence, baseline present-state characterisation
2. political.powerStructure — who holds executive/legislative/judicial power, incl. the current governing party/coalition with its seat count and majority/minority status from the legislature's official standings (within 90 days); security forces; media independence
3. political.stabilityDrivers — legitimacy sources, armed forces loyalty, coalition, business elite alignment
4. political.shockAbsorbers — what cushions shocks vs. what accelerates instability
5. economy.macroReality — GDP growth, sector performance, fiscal position (deficit %, debt/GDP), monetary policy, inflation, credit rating — all with specific figures and years
6. economy.externalVulnerability — export/import profile; trade partner concentration; sovereign debt holders; IMF program status; sanctions exposure
7. economy.politicalEconomy — who benefits from current model; business elite structure; technically necessary vs. politically possible reforms
8. society.demographics — total population and age structure (median age, youth-bulge or ageing reality); urban/rural split; internal and cross-border migration patterns; fertility/dependency where relevant. All figures tied to a year.
9. society.composition — ethnic, linguistic, and religious composition (rounded shares with year and source). State where the principal fault lines run, and EXPLICITLY whether the cleavages are CROSS-CUTTING (membership on one cleavage does not predict membership on another — tends to defuse) or REINFORCING (cleavages stack along the same line — tends to inflame). Name the geometry; do not just list groups.
10. society.religion — (a) composition rounded, and the fault line if there is one; (b) lived/syncretic texture — indigenous, folk, and syncretic practice the official label hides; (c) political salience — how far religion structures authority, allegiance, and daily life (e.g. parallel religious authority such as Sufi brotherhoods; prosperity-gospel political mobilisation; or high adherence with low salience). For every religious-composition figure, NAME the source and its known bias, and flag where the count itself is contested or politically suppressed. Round, do not over-precise.
11. society.cohesion — population-wide social trust (interpersonal AND institutional), social capital, and how the society sees itself. Use citizen self-report survey data (the region's own barometer / WVS / Pew) as the PRIMARY instrument here — not as a triangulation check.
12. security.internal — insurgency/armed groups; organized crime; terrorism threat; military strength and loyalty; border situation
13. security.diplomacy — treaty alliances; key bilateral relationships; regional flashpoints; multilateral memberships
14. actors.domestic — 5–10 actors (government, opposition, military, business elite, civil society)
15. actors.external — 3–5 actors (major powers, regional neighbors, international institutions)
16. risks — 5–10 risks, each requiring: trigger, probability, impact, time horizon, leading indicators, mitigants

Aim for 20–35 sources total. Ensure ≥ 70% of sources per section are citationType: Fact (primary authors of the data), not Interpretation.
