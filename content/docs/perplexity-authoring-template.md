# Perplexity Deep Research — Authoring Template

Use this to produce a new country YAML file from scratch, or to update an existing one. The prompt below is designed for Perplexity Deep Research (not standard Perplexity chat).

---

## Standard Operating Procedure

1. Open https://www.perplexity.ai and select **Deep Research** mode
2. Paste the prompt below, replacing `[COUNTRY]` and `[ISO3]` with the target country
3. Wait for the full research report (typically 3–8 minutes)
4. Copy the output into the relevant sections of `content/countries/[ISO3]/[code].en.yaml`
5. For each claim, verify the cited source URL is live and replace Perplexity's inline citations with the correct `[source-id]` from your `*.sources.yaml`
6. Run `node scripts/generate-country-data.cjs [ISO3]` and confirm no errors
7. Open the website and review the rendered page visually

### When a section returns insufficient citations

If Perplexity cannot find a primary or high-quality secondary source for a specific claim:

- **Do not write the claim with weaker sourcing or vague attribution.** Omit the claim entirely.
- Re-run the prompt with a narrowed scope for that section (e.g. ask specifically about fiscal data for that year).
- If a source URL is broken, search for an archive copy (archive.org, perma.cc) and add it as `archiveUrl`.
- If no credible source exists after a second attempt, mark the section `# TODO: needs source` and do not publish that content until it is sourced.

A claim without a primary or high-quality secondary source is not a claim — it is noise.

---

## Source Priority

Use sources in this order. Do not substitute a lower-tier source when a higher-tier source exists.

| Domain | Priority sources |
|---|---|
| Macro / Finance | Statistics [Country] · IMF · World Bank · BIS · OECD |
| Governance / Rule of law | V-Dem · Freedom House · World Justice Project (WJP) |
| Corruption | Transparency International |
| Conflict / Security | ACLED · SIPRI · International Crisis Group (ICG) |
| Treaty / Legal | Original treaty text · Official government gazette |
| Trade | WTO · UN Comtrade |
| Recent events of fact | National news outlets — **only** for events verified as fact in the last 90 days |

**National news outlets are not acceptable primary sources for statistics, governance scores, or economic data**, regardless of how recent the article is. Always trace a news-reported figure back to its originating dataset.

---

## Fact vs. Interpretation

Every source entry must be assigned `citationType: Fact` or `citationType: Interpretation`. Apply this rule without exception:

- **Fact** — the cited source is the *primary author* of the data or event record (e.g., Statistics Canada published the GDP figure; the UN published the treaty text; ACLED recorded the incident).
- **Interpretation** — the cited source is analyzing, summarizing, forecasting, or drawing conclusions from data it did not originate (e.g., a think-tank report on political stability; a business survey on economic sentiment; a news editorial on government policy).

Aim for **≥ 70% Fact sources per section**. If a section cannot reach that threshold, the underlying claims may be too speculative for publication.

The website renders Interpretation citations with a dotted underline to flag them to readers. Getting the classification right matters.

---

## Source Schema — All Eight Fields Required

Every source entry in `*.sources.yaml` must include all eight fields. There are no "where available" escape hatches.

```yaml
- id: short-slug          # lowercase, alphanumeric, hyphens only; e.g. imf-art4-2025
  name: "Full Publication Name"
  url: "https://exact-url-to-the-specific-page-or-document"
  desc: "One sentence: what this source is and what specific data it provides for this country."
  publicationDate: "YYYY-MM-DD"   # e.g. 2025-04-01; use first of month if only month known; use YYYY-01-01 if only year known
  accessDate: "YYYY-MM-DD"        # date you opened and verified the URL; e.g. 2026-04-27
  confidence: High | Med | Low
  citationType: Fact | Interpretation
```

**Format rules:**
- `id`: no spaces, no uppercase, no underscores — e.g. `stats-can`, `imf-weo-2025`, `wjp-2024`
- `url`: the specific document URL, not the homepage — `https://www.imf.org/en/Publications/WEO/Issues/2025/04/...` not `https://www.imf.org`
- `publicationDate`: always `YYYY-MM-DD`. If the source specifies only a year, use `YYYY-01-01` and explain in `desc`. If only a month is known, use `YYYY-MM-01`.
- `accessDate`: always `YYYY-MM-DD` — the calendar date you opened and verified the URL, not the publication date.
- `desc`: must name the specific data point — `"Canada GDP growth rate 2024 (2.1%), fiscal deficit, and inflation figures."` not `"IMF economic data"`
- `confidence`: `High`, `Med`, or `Low` — no other values
- `citationType`: `Fact` or `Interpretation` — no other values

---

## Time-Binding Numerics

Every numeric claim in the YAML content must be tied to a specific time period. No exceptions.

- **Correct:** `"GDP grew 2.1% in 2024 [imf-weo-2025]."`
- **Wrong:** `"GDP grew 2.1% [imf-weo-2025]."`
- **Wrong:** `"GDP growth is approximately 2% [imf-weo-2025]."`

If Perplexity reports a figure without a year, do not include it. Re-query with an explicit request for the time period.

---

## Output Structure

Request that Perplexity structure its output one block per YAML section, in this order:

1. `executiveSnapshot` — 10 bullet points with inline `[source-id]` citations
2. `political.powerStructure` — paragraph with inline citations
3. `political.stabilityDrivers` — paragraph
4. `political.shockAbsorbers` — paragraph
5. `economy.macroReality` — paragraph, all figures time-bound
6. `economy.externalVulnerability` — paragraph
7. `economy.politicalEconomy` — paragraph
8. `security.internal` — paragraph
9. `security.diplomacy` — paragraph
10. `actors.domestic` — one block per actor: name / interests / resources / constraints / likelyMoves / dealability
11. `actors.external` — one block per actor
12. `risks` — one block per risk: title / trigger / probability / impact / timeHorizon / leadingIndicators / mitigants
13. `sources` — complete YAML block, all 8 fields for every source cited above

The sources block must appear once, at the end, and must include every source cited anywhere above. No orphan citations; no orphan sources.

---

## Perplexity Deep Research Prompt

```
You are a geopolitical analyst writing a structured country situation report on [COUNTRY] for an audience of senior decision-makers and investors. The date is [TODAY'S DATE].

Write a detailed research report covering ALL of the following sections. For every factual claim, include an inline citation to a primary or high-quality secondary source (government publication, central bank, IMF, World Bank, academic institution, or major international organization).

SOURCING RULES:
- Do not cite Wikipedia. Do not cite aggregator sites or blogs. If you cannot find a primary or high-quality secondary source for a claim, omit the claim entirely — do not write it with weaker sourcing or vague attribution.
- Every numeric figure must be tied to a specific year or date range.
- For each source, provide the full URL to the specific document (not the homepage), the publication name, the publication date in YYYY-MM-DD format (use the first of the month if only the month is known, e.g. 2025-04-01; use the first of the year if only the year is known, e.g. 2025-01-01), and the date you accessed the URL also in YYYY-MM-DD format. State whether the source is the primary author of the data (Fact) or is analyzing/interpreting data from elsewhere (Interpretation).

SOURCE PRIORITY: Prefer Statistics [Country], IMF, World Bank, BIS, OECD for macro/finance. Use V-Dem, Freedom House, WJP for governance. Use ACLED, SIPRI, ICG for security and conflict. Use Transparency International for corruption. Use original treaty text for legal matters. Use WTO or UN Comtrade for trade data. Use national news only for events of fact in the last 90 days.

SECTIONS REQUIRED:

1. EXECUTIVE SNAPSHOT (10 bullet points)
   - Regime type and how power is won/held
   - Current political equilibrium (coalition, opposition, legitimacy)
   - Economic model overview (dominant sectors, trade profile)
   - Top 3 risks in the next 6–18 months
   - Top 3 watch items in the next 4–12 weeks
   - External dependencies (trade, energy, debt)
   - Security posture (internal stability, border situation)
   - Diplomatic orientation (alliances, key bilateral relationships)
   - Data confidence statement (which sections are high/medium/low confidence)
   - Baseline outlook (1 sentence)

2. POLITICAL ANALYSIS
   - Power structure: who holds executive, legislative, judicial power; who controls security forces; media independence
   - Stability drivers: what legitimizes the regime; armed forces loyalty; coalition composition; business elite alignment
   - Shock absorbers AND accelerants: what cushions shocks vs. what could accelerate instability

3. ECONOMIC ANALYSIS
   - Macro reality: GDP growth, sector performance, fiscal position (deficit %, debt/GDP), monetary policy, inflation, credit rating — include specific figures and years
   - External vulnerability: export/import profile by value and commodity; trade partner concentration; sovereign debt holders; IMF program status; sanctions exposure
   - Political economy: who benefits from current model; business elite structure; what reforms are technically necessary vs. politically possible

4. SECURITY ANALYSIS
   - Internal: insurgency/armed groups; organized crime; communal violence; terrorism threat level; military strength and loyalty; corruption in security forces; border situation
   - Diplomacy: treaty alliances; transactional partners; key bilateral relationships; regional flashpoints and disputes; multilateral memberships

5. KEY ACTORS (domestic and external)
   For each actor provide: name, interests, resources/capabilities, constraints, likely moves in next 6–18 months, and dealability (High/Medium/Low)
   - Domestic actors: 5–10 (government, opposition, military, business elite, civil society, regional powers if applicable)
   - External actors: 3–5 (major powers, regional neighbors, international institutions)

6. RISK REGISTER (5–10 risks)
   For each risk: title, trigger event, probability (High/Med/Low), impact (High/Med/Low), time horizon, leading indicators to watch, and mitigants

FORMAT YOUR OUTPUT one block per section using ## section-name headers matching the YAML field names above, in this order: executiveSnapshot, political.powerStructure, political.stabilityDrivers, political.shockAbsorbers, economy.macroReality, economy.externalVulnerability, economy.politicalEconomy, security.internal, security.diplomacy, actors.domestic, actors.external, risks. End with a complete ## sources block in YAML format with all 8 fields per source: id, name, url, desc, publicationDate (YYYY-MM-DD), accessDate (YYYY-MM-DD), confidence, citationType.
```

---

## After research: mapping to YAML

| Perplexity section | YAML field |
|---|---|
| Executive snapshot bullets | `executiveSnapshot[]` |
| Power structure | `political.powerStructure` |
| Stability drivers | `political.stabilityDrivers` |
| Shock absorbers | `political.shockAbsorbers` |
| Macro reality | `economy.macroReality` |
| External vulnerability | `economy.externalVulnerability` |
| Political economy | `economy.politicalEconomy` |
| Internal security | `security.internal` |
| Diplomacy | `security.diplomacy` |
| Domestic actors | `actors.domestic[]` |
| External actors | `actors.external[]` |
| Risk register | `risks[]` |

Replace every Perplexity inline citation reference with the matching `[source-id]` from your `*.sources.yaml`. If the source isn't in your sources file yet, add it first.
