# Pass A Prompt (DEU)

Country: Germany (Allemagne)
Date: 2026-05-14

You are a geopolitical analyst preparing to write a structured country situation report on Germany for an audience of senior decision-makers and investors. Before writing any prose, your task in this pass is to assemble a high-quality source list only.

Return ONLY a JSON array of sources. No prose, no analysis, no section headers — just sources.

Each source must match this exact schema (all 8 fields required, no omissions):
[
  {
    "id": "short-slug",
    "name": "Full Publication Name",
    "url": "https://exact-url-to-specific-document-not-homepage",
    "desc": "One sentence: what this source is and what specific data it provides for Germany.",
    "publicationDate": "YYYY-MM-DD",
    "accessDate": "2026-05-14",
    "confidence": "High | Med | Low",
    "citationType": "Fact | Interpretation"
  }
]

Source priority rules:
- Macro/Finance: Statistics Germany (Destatis), IMF, World Bank, BIS, OECD
- Governance/Rule of law: V-Dem, Freedom House, World Justice Project (WJP)
- Corruption: Transparency International
- Conflict/Security: ACLED, SIPRI, International Crisis Group (ICG)
- Trade: WTO, UN Comtrade
- Recent events of fact: national news outlets ONLY for events verified as fact in the last 90 days
- Do NOT cite Wikipedia, homepages, aggregators, or blogs
- Deep links only — the specific document or data page, not a site homepage

The sources you collect must be sufficient to support ALL of the following content sections in Pass B:

1. executiveSnapshot — 10 bullet points covering: regime type, political equilibrium, economic model, top risks, top watch items, external dependencies, security posture, diplomatic orientation, data confidence, baseline outlook
2. political.powerStructure — who holds executive/legislative/judicial power; security forces; media independence
3. political.stabilityDrivers — legitimacy sources, armed forces loyalty, coalition, business elite alignment
4. political.shockAbsorbers — what cushions shocks vs. what accelerates instability
5. economy.macroReality — GDP growth, sector performance, fiscal position (deficit %, debt/GDP), monetary policy, inflation, credit rating — all with specific figures and years
6. economy.externalVulnerability — export/import profile; trade partner concentration; sovereign debt holders; IMF program status; sanctions exposure
7. economy.politicalEconomy — who benefits from current model; business elite structure; technically necessary vs. politically possible reforms
8. security.internal — insurgency/armed groups; organized crime; terrorism threat; military strength and loyalty; border situation
9. security.diplomacy — treaty alliances; key bilateral relationships; regional flashpoints; multilateral memberships
10. actors.domestic — 5–10 actors (government, opposition, military, business elite, civil society)
11. actors.external — 3–5 actors (major powers, regional neighbors, international institutions)
12. risks — 5–10 risks, each requiring: trigger, probability, impact, time horizon, leading indicators, mitigants

Aim for 20–35 sources total. Ensure ≥ 70% of sources per section are citationType: Fact (primary authors of the data), not Interpretation.
