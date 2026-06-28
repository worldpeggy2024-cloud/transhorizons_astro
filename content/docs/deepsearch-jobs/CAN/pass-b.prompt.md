# Pass B Prompt (CAN)

Country: Canada (Canada)
Date: 2026-06-28

You are a geopolitical analyst writing a structured country situation report on Canada for an audience of senior decision-makers and investors. The approved source list from Pass A is provided below.

Return ONLY a JSON object that matches the schema below exactly. Include inline [source-id] citations in every narrative field.

Hard rules:
- Cite ONLY source IDs that appear in the approved Pass A sources list. No new sources.
- Every numeric figure must be tied to a specific year or date range (e.g., "GDP grew 1.4% in 2025 [source-id]").
- Omit any claim that cannot be tied to an approved source — do not write it with weaker sourcing or vague attribution.
- EN and FR fields must be synchronized in substance (same facts, same depth). FR may adapt phrasing naturally.
- Risks: 5–10 entries; each must have title, trigger, probability (High/Med/Low), impact (High/Med/Low), timeHorizon, leadingIndicators, and mitigants.
- dealability in actors must be exactly: High, Medium, or Low.

Section-by-section instructions:

executiveSnapshot (en and fr — 11 bullet strings each):
  1. Regime type and how power is won/held
  2. Current political equilibrium: current seat composition and majority/minority/coalition status — cite the legislature's official standings, current within 90 days; opposition; legitimacy
  3. Economic model overview (dominant sectors, trade profile)
  4. SOCIAL STRUCTURE: demographic reality (youth bulge or ageing); the principal social cleavage and its geometry (cross-cutting or reinforcing); the population-wide social-trust level
  5. Top 3 risks in the next 6–18 months
  6. Top 3 watch items in the next 4–12 weeks
  7. External dependencies (trade, energy, debt)
  8. Security posture (internal stability, border situation)
  9. Diplomatic orientation (alliances, key bilateral relationships)
  10. Data confidence statement (which sections are high/medium/low confidence)
  11. Baseline present-state characterisation (1 sentence — NOT a forecast)

political.powerStructure: Who holds executive, legislative, judicial power — state the current governing party/coalition, its seat count and majority/minority status as of now, cited to the legislature's official standings (within 90 days); who controls security forces; media independence.

political.stabilityDrivers: What legitimizes the regime; armed forces loyalty; coalition composition; business elite alignment.

political.shockAbsorbers: What cushions shocks vs. what could accelerate instability — both dimensions in a single paragraph.

economy.macroReality: GDP growth, sector performance, fiscal position (deficit %, debt/GDP), monetary policy, inflation, credit rating — all with specific figures and years.

economy.externalVulnerability: Export/import profile by value and commodity; trade partner concentration; sovereign debt holders; IMF program status; sanctions exposure.

economy.politicalEconomy: Who benefits from current model; business elite structure; what reforms are technically necessary vs. politically possible.

SOCIETY — describe the society ON ITS OWN TERMS, before and independent of any stability implication; a society is a component of the country in itself, not a risk factor:

society.demographics: total population and age structure (median age, youth-bulge or ageing reality); urban/rural split; internal and cross-border migration patterns; fertility/dependency where relevant. All figures tied to a year.

society.composition: ethnic, linguistic, and religious composition (rounded shares with year and source). State where the principal fault lines run, and EXPLICITLY whether the cleavages are CROSS-CUTTING (membership on one cleavage does not predict membership on another — tends to defuse) or REINFORCING (cleavages stack along the same line — tends to inflame). Name the geometry; do not just list groups.

society.religion: (a) composition rounded, and the fault line if there is one; (b) lived/syncretic texture — indigenous, folk, and syncretic practice the official label hides; (c) political salience — how far religion structures authority, allegiance, and daily life (e.g. parallel religious authority such as Sufi brotherhoods; prosperity-gospel political mobilisation; or high adherence with low salience). For every religious-composition figure, NAME the source and its known bias, and flag where the count itself is contested or politically suppressed. Round, do not over-precise.

society.cohesion: population-wide social trust (interpersonal AND institutional), social capital, and how the society sees itself. Use citizen self-report survey data (the region's own barometer / WVS / Pew) as the PRIMARY instrument here — not as a triangulation check.

security.internal: Insurgency/armed groups; organized crime; communal violence; terrorism threat level; military strength and loyalty; border situation.

security.diplomacy: Treaty alliances; transactional partners; key bilateral relationships; regional flashpoints; multilateral memberships.

actors.domestic and actors.external MUST use this exact bilingual structure:
"domestic": {
  "en": [ { "name": "", "interests": "", "resources": "", "constraints": "", "likelyMoves": "", "dealability": "High|Medium|Low" }, ... ],
  "fr": [ { "name": "", "interests": "", "resources": "", "constraints": "", "likelyMoves": "", "dealability": "High|Medium|Low" }, ... ]
}
Do NOT return a flat array. Both "en" and "fr" keys are required. 5–10 domestic actors, 3–5 external actors.

risks MUST use this exact bilingual structure:
"risks": {
  "en": [ { "title": "", "trigger": "", "probability": "High|Med|Low", "impact": "High|Med|Low", "timeHorizon": "", "leadingIndicators": "", "mitigants": "" }, ... ],
  "fr": [ { "title": "", "trigger": "", "probability": "High|Med|Low", "impact": "High|Med|Low", "timeHorizon": "", "leadingIndicators": "", "mitigants": "" }, ... ]
}
Do NOT return a flat array. Both "en" and "fr" keys are required. Minimum 5 entries in each.

scorecard fields (eliteCohesion, socialCohesion, securityLoyalty, economicPressure, protestCapacity, institutionalResilience): Set each to High, Med, or Low based on your analysis. socialCohesion is the second of the two-cohesions split — society-wide trust/polarisation, distinct from elite cohesion.

Approved source IDs from Pass A:
[PASTE THE SOURCE IDs FROM pass-a.sources.json HERE BEFORE SUBMITTING]
