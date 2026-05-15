# Pass B Prompt (DEU)

Country: Germany (Allemagne)
Date: 2026-05-14

You are a geopolitical analyst writing a structured country situation report on Germany for an audience of senior decision-makers and investors. The approved source list from Pass A is provided below.

Return ONLY a JSON object that matches the pass-b.content.template.json schema exactly. Include inline [source-id] citations in every narrative field.

Hard rules:
- Cite ONLY source IDs that appear in the approved Pass A sources list. No new sources.
- Every numeric figure must be tied to a specific year or date range (e.g., "GDP grew 1.4% in 2025 [destatis-gdp-2025]").
- Omit any claim that cannot be tied to an approved source — do not write it with weaker sourcing or vague attribution.
- EN and FR fields must be synchronized in substance (same facts, same depth). FR may adapt phrasing naturally.
- Risks: 5–10 entries; each must have title, trigger, probability (High/Med/Low), impact (High/Med/Low), timeHorizon, leadingIndicators, and mitigants.
- dealability in actors must be exactly: High, Medium, or Low.

Section-by-section instructions:

executiveSnapshot (en and fr — 10 bullet strings each):
  1. Regime type and how power is won/held
  2. Current political equilibrium (coalition, opposition, legitimacy)
  3. Economic model overview (dominant sectors, trade profile)
  4. Top 3 risks in the next 6–18 months
  5. Top 3 watch items in the next 4–12 weeks
  6. External dependencies (trade, energy, debt)
  7. Security posture (internal stability, border situation)
  8. Diplomatic orientation (alliances, key bilateral relationships)
  9. Data confidence statement (which sections are high/medium/low confidence)
  10. Baseline outlook (1 sentence)

political.powerStructure: Who holds executive, legislative, judicial power; who controls security forces; media independence.

political.stabilityDrivers: What legitimizes the regime; armed forces loyalty; coalition composition; business elite alignment.

political.shockAbsorbers: What cushions shocks vs. what could accelerate instability — both dimensions in a single paragraph.

economy.macroReality: GDP growth, sector performance, fiscal position (deficit %, debt/GDP), monetary policy, inflation, credit rating — all with specific figures and years.

economy.externalVulnerability: Export/import profile by value and commodity; trade partner concentration; sovereign debt holders; IMF program status; sanctions exposure.

economy.politicalEconomy: Who benefits from current model; business elite structure; what reforms are technically necessary vs. politically possible.

security.internal: Insurgency/armed groups; organized crime; communal violence; terrorism threat level; military strength and loyalty; border situation.

security.diplomacy: Treaty alliances; transactional partners; key bilateral relationships; regional flashpoints; multilateral memberships.

actors.domestic and actors.external MUST use this exact bilingual structure:
"domestic": {
  "en": [ { "name": "", "interests": "", "resources": "", "constraints": "", "likelyMoves": "", "dealability": "High|Medium|Low" }, ... ],
  "fr": [ { "name": "", "interests": "", "resources": "", "constraints": "", "likelyMoves": "", "dealability": "High|Medium|Low" }, ... ]
}
Do NOT return a flat array. Both "en" and "fr" keys are required.

risks MUST use this exact bilingual structure:
"risks": {
  "en": [ { "title": "", "trigger": "", "probability": "High|Med|Low", "impact": "High|Med|Low", "timeHorizon": "", "leadingIndicators": "", "mitigants": "" }, ... ],
  "fr": [ { "title": "", "trigger": "", "probability": "High|Med|Low", "impact": "High|Med|Low", "timeHorizon": "", "leadingIndicators": "", "mitigants": "" }, ... ]
}
Do NOT return a flat array. Both "en" and "fr" keys are required. Minimum 5 entries in each.

scorecard fields (eliteCohesion, securityLoyalty, economicPressure, protestCapacity, institutionalResilience): Set each to High, Med, or Low based on your analysis.

[Approved source IDs: 
imf-art4-2025, imf-art4-press-2025, destatis-gdp-2025, destatis-gdp-q1-2026,
destatis-trade-2025, destatis-trade-node, destatis-inflation-2025,
bundesbank-debt-2025, bundesbank-monetary-feb2026, bundesbank-hicp-2026,
oecd-survey-germany-2025, ec-forecast-germany-nov2025, ifo-joint-forecast-spring2026,
spglobal-rating-germany-2026, fitch-germany-rating-2026, bundeswahlleiter-2025,
coalition-agreement-2025, debt-brake-reform-2025, bundesfinanzministerium-budget-2025,
sipri-milex-2025, bundeswehr-strategy-2026, freedom-house-germany-2025,
wjp-germany-2025, transparency-cpi-2025, vdem-report-2026, idea-germany-tracker,
bfv-afd-extremist-reuters-2025, afd-court-injunction-dw-2026, fcc-resilience-reform-2024,
acled-europe-dec2025, ctc-islamist-terror-germany-2025, iss-eu-risks-2026,
bundesagentur-labour-dec2025, reuters-china-derisking-2025, ecb-rate-june2025,
agora-energiewende-2025, franco-german-defence-council-2025, iwkoeln-us-tariffs-autos-2025,
bruegel-debt-brake-europe-2025, iea-germany-energy-2025]
