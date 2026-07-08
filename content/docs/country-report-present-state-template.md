# Country Report — Present-State Authoring Template

*Tool-agnostic. Replaces `perplexity-authoring-template.md`.*
*Produces the sourced, verifiable present-state country report (one of two layers).*

> **LAYER: Present-state.** This template produces the sourced, verifiable layer of a country report:
> `political · economy · territory · capacity · society · security · actors · risks · sources`.
>
> **Governed by:** `research-quality-bar.md` (present-state layer). Its rejection criteria override any
> ambiguous behaviour here.
>
> **Companion:** `country-report-trajectory-template.md` is a **separate** template with its **own**
> contract. Nothing forward-looking belongs in *this* file's output. If a claim is about what *could*
> happen, it is not present-state — it goes in the trajectory layer. That separation is the wall between
> the two registers; do not blur it.

---

## 0. What changed, and why (orientation — read once)

1. **Six peers, not four.** `territory`, `capacity`, and `society` now stand as top-level peers alongside
   `political`, `economy`, and `security` — same rank, same sourcing rigor, each its own collapsible card.
   Order: `political · economy · territory · capacity · society · security`. All three were previously
   demoted: the physical body of the country surfaced only as "border situation" or "energy dependency"
   (now `territory`); the state's ability to build, permit, and deliver had no field, though "knowledge
   isn't the constraint, capacity is" is the project's spine (now `capacity`); society appeared only where
   it was a "problem" — a *risk factor*, never a *component of the country in itself* (now `society`). A
   deep-time **`political.constitutionalSubstrate`** sub-field was also added (treaty lineage / title
   bedrock, held distinct from current politics).
2. **The template is tool-agnostic.** It was Perplexity-shaped. The durable machinery (two-pass, validator
   gates, Fact/Interpretation, the source schema, time-binding) must survive a tool swap. Perplexity is now
   **one option, for sourcing only**.

---

## 1. The peers, and the on-its-own-terms principle

A country is described as six peers, each on its own terms:

`political` · `economy` · **`territory`** · **`capacity`** · **`society`** · `security`

**Each peer is described *before* and *independent of* any stability implication.** A society, a territory, a
capacity to build — each exists whether or not it threatens or serves anything. The register this template
replaces demotes three of them: the physical body of the country surfaces only as "border situation" or
"energy dependency" — a risk to assets or an input to trade, never the material fact the country IS
(`territory` fixes this); the state's ability to build, permit, and deliver has no field at all, though
"knowledge isn't the constraint, capacity is" is the whole project's spine (`capacity` fixes this); and
society appears only where it is a "problem" (`society` fixes this).

**The anti-pattern this fixes (load-bearing):** when society only appears where it's a "problem," religion
and ethnicity surface in some regions' reports only as threats and vanish from others entirely. That
reproduces the war/corruption template the project rejects. Therefore:

- **Religion appears in every report**, including where its political salience is low.
- **The absence of a fault line is itself a finding**, stated as one — not an omission.
- Describe the society neutrally and fully first; let `security` and `risks` reference it afterward, not the
  other way around.

---

## 2. Tool stance (tool-agnostic)

The schema leads; the tool serves. **Durable structure that must survive any tool swap:**

- two-pass workflow (sources → prose),
- validator gates (blocking),
- `Fact` / `Interpretation` tagging,
- the 8-field source schema,
- time-binding of every numeric.

Any deep-research-capable assistant can run the passes. **Perplexity Deep Research remains one option, and
only for Pass A (sourcing).** Never let a single tool's default output dictate the schema or section order.

---

## 3. File targets

```
content/countries/[CODE]/
  [code].en.yaml        ← EN content (all sections incl. society)
  [code].fr.yaml        ← FR content (Peggy proofs FR; EN/FR citation parity required)
  [code].sources.yaml   ← every source, 8 fields each
  [code].meta.yaml      ← lastUpdated, confidence, etc.
```

`[CODE]` = ISO3 (e.g. `BRA`, `SEN`, `CAN`). *(This standardises the old single-`analysis.yaml` reference,
which could not satisfy the EN/FR parity rule the validator enforces.)*

---

## 4. Standard Operating Procedure

0. Read `research-quality-bar.md` (present-state layer) first.
1. **Pass A — sources only.** Harvest candidate sources covering macro, governance, trade, security,
   **territory** (geography, minerals, biosphere, climate, metabolism, transition), **capacity** (permitting,
   delivery, productivity), **and society** (demography, composition, religion, cohesion). Sourcing tool of
   your choice.
2. Paste into `[code].sources.yaml`; run the validator on the sources block. If it fails, **do not write
   prose.**
3. **Pass B — prose from approved source IDs only.** Now covering the territory, capacity, and society sections.
4. For each claim, confirm the cited URL is live and replace any temporary inline reference with the correct
   `[source-id]`.
5. Run `npm run validate:country -- content/countries/[CODE]/` and fix **all** errors before publishing.
6. Open the rendered page and review visually — **including the new territory, capacity, and society cards**
   (citations resolve, FR toggle works).

---

## 5. Two-pass workflow (full rebuild)

Use this for any country whose legacy citations are weak, generic, or not traceable enough to publish.

### Pass A — sources only

Ask the research assistant for a **sources-only output**. No narrative prose in this pass.

Required: one candidate source list covering **macro, governance, trade, security, territory, capacity, and
society** — territory across its six sub-domains (geography, minerals, biosphere, climate, metabolism,
transition), capacity across its three (permitting, delivery, productivity), society across its four
(demography, composition, religion, cohesion); full deep links only, never homepages; all 8 schema fields per
source; provisional `id` values; `citationType` set for every source.

**Acceptance rule:** if the source list does not pass the validator after being pasted into the `sources`
block, do not proceed to prose.

### Pass B — prose from approved source IDs only

Cite **only** the approved IDs from Pass A. Any claim that cannot be tied to an approved ID is omitted. If a
section (society included) cannot be written cleanly from approved sources, leave it incomplete rather than
weakening sourcing.

### When a section returns insufficient citations

Do **not** write the claim with weaker sourcing or vague attribution — omit it. Re-run with narrowed scope
for that section. If a URL is broken, find an archive copy and add `archiveUrl`. If no credible source exists
after a second attempt, mark `# TODO: needs source` and don't publish that content. *A claim without a
primary or high-quality secondary source is not a claim — it is noise.*

### Hard gates (blocking)

- **Validator:** `npm run validate:country -- content/countries/[CODE]/` (single) /
  `npm run validate:countries` (all). Fails on orphan citations, orphan sources, homepage URLs, denied
  low-reliability domains, missing fields, **and EN/FR citation-parity gaps (now spanning society IDs).**
- **Research quality bar:** validation is necessary, not sufficient. If the validator passes but the content
  fails `research-quality-bar.md` (present-state layer), the content is still rejected.

---

## 6. Source priority (by domain)

Use the highest available tier. Do not substitute a lower tier when a higher one exists.

| Domain | Priority sources |
|---|---|
| Macro / Finance | Statistics [Country] · IMF · World Bank · BIS · OECD |
| Governance / Rule of law | V-Dem · Freedom House · World Justice Project |
| **Government composition** (who governs now) | **the national legislature's official seat-standings page · national electoral authority — must reflect the current distribution (last 90 days); majority/minority/coalition status derived from it** |
| Corruption | Transparency International |
| Conflict / Security | ACLED · SIPRI · International Crisis Group |
| Treaty / Legal | Original treaty text · official government gazette |
| Trade | WTO · UN Comtrade |
| **Society / demography** | **UN DESA World Population Prospects · national census · national statistics office** |
| **Society / composition** (ethnic·linguistic·religious) | **national census\* · Pew–Templeton Global Religious Futures · ARDA (Association of Religion Data Archives)** |
| **Society / religion** (texture + salience) | **as composition, plus the region's own area-studies primary work; bias documented (§8)** |
| **Society / cohesion** & social capital | **Afrobarometer · Arab Barometer · Latinobarómetro · Asian Barometer · Eurobarometer · World Values Survey · Pew — PRIMARY here, not triangulation** |
| **Territory / climate** (physical) | **Intergovernmental Panel on Climate Change · national climate assessment · World Bank Climate Change Knowledge Portal · national meteorological service · Copernicus** |
| **Territory / minerals** (subsurface endowment) | **United States Geological Survey mineral commodity summaries · national geological survey · International Energy Agency (critical minerals)** |
| **Territory / biosphere** (forests·water·land·fisheries) | **Food and Agriculture Organization · national resource agencies** |
| **Territory / metabolism & transition** | **International Energy Agency · Energy Institute statistical review · Ember (electricity) · national inventories (UN climate convention) · Global Carbon Project · Climate Action Tracker — PRIMARY for pledge-vs-policy** |
| **Territory / adaptive capacity** | **Notre Dame Global Adaptation Initiative index · World Bank · national adaptation plans** |
| **Capacity to execute** (permitting·delivery·productivity) | **national statistics office · OECD · national infrastructure & regulatory bodies · sector permitting authorities** |
| **Constitutional substrate** (deep-time legal) | **original treaty text · court rulings (title/constitutional) · official gazette — never news** |
| Recent events of fact | National news — **only** for events verified as fact in the last 90 days |

\* Census of ethnicity/religion is a political act in many states — see §8.

**National news is not an acceptable primary source for statistics, governance scores, or economic data**,
however recent. Always trace a news-reported figure to its originating dataset.

**In-culture note (cohesion):** for `society.cohesion` the right instrument is citizen self-report from the
region's *own* barometer. This deliberately raises the in-culture sourcing share in the one section where it
should dominate — consistent with the Africa & Asia source-library principle (prefer the source where the
region writes about itself; Western think tanks for triangulation only).

---

## 7. The two cohesions — do **NOT** conflate

These are different objects. Keeping them apart is part of the fix.

- **Elite cohesion** (intra-power-bloc unity — does the coalition hold?) → **stays in
  `political.stabilityDrivers`**, where it already lives.
- **Social cohesion** (population-wide interpersonal & institutional trust, social capital) → **new:
  `society.cohesion`.**

Conflating them is part of what currently hides the social layer behind the political one.

---

## 8. Religion-source discipline (named, documented bias)

Religious-demographic counts are the **most politically weaponised numbers** in a country file. Census of
religion is itself a political act — e.g. Lebanon (no official national census since 1932), Nigeria (religion
omitted from recent censuses), and contested or instrumentalised counts in Sudan, Côte d'Ivoire, and
elsewhere. So in `society.religion`:

- **Name each source AND its known bias** (in `desc` and, where it matters, inline). This is the project's
  "named, chosen bias over invisible statistical bias" rule, applied where it bites hardest.
- **Where the count is contested or suppressed, say so** and present contested figures **as contested** (a
  range, not a point).
- **Round shares** — no false precision on numbers that are themselves political.
- **Distinguish nominal adherence from lived/syncretic practice.** The official label of a place and its
  living religious texture are never the same (folk, indigenous, and syncretic practice under a single census
  label).
- **Record political salience** — how far religion structures authority, allegiance, and daily life (parallel
  religious authority such as Sufi brotherhoods; prosperity-gospel political mobilisation; *or* high adherence
  with low political salience). Low salience is a finding, not an absence.

---

## 9. Cross-cutting vs reinforcing cleavages (`society.composition` discipline)

List the groups, then **name the geometry** — this is the analytical core of the section:

- **Cross-cutting** — memberships don't predict each other (people split one way on religion, another on
  language or class). Tends to **defuse** conflict.
- **Reinforcing** — cleavages stack along one line (region = ethnicity = religion = wealth). Tends to
  **inflame**.

Sourcing rule: the **composition figures are Fact** (census / survey). The **cross-cutting / reinforcing
judgment is Interpretation** — tag it as `Interpretation` or cite an analyst who makes it. Do not present the
geometry as raw fact.

---

## 9b. Political anchors — current-composition discipline

A small, fixed set of facts must reflect the present, not the source-average: head of state; head of government; government type (majority / minority / coalition); legislature size and current seat composition; date of last election and next expected; any leadership or government change in the last 12 months. Each is sourced to a current standings/electoral source (last 90 days), never inferred from older macro or governance reports. These are the facts most likely to be stale and most damaging when wrong — they get a recency gate, not a judgement call.

---

## 9c. Territory disciplines (physical-base blocks)

Four disciplines govern the `territory` peer — they are what stop the block becoming a doom-catalogue or a
resource-inventory:

- **Exposure–capacity pairing.** Never state a physical exposure without the capacity to act on it. The
  project's spine — *knowledge isn't the constraint, capacity is* — becomes local here: report the hazard
  AND the fiscal/infrastructural/institutional capacity to meet it, and name the gap.
- **Distributional lens.** Not "the country is exposed" but WHO inside the country is exposed vs who can
  afford the defence, or who is served vs who is stranded — the cleavage-geometry move (§9) applied to
  physical risk and throughput.
- **Scenario-and-horizon binding.** Stricter than §12 year-binding: a climate projection without BOTH its
  emissions scenario AND its time horizon is void. "+4°C" alone is noise.
- **Demonstrated over declared.** For `territory.transition` (and metabolism), a pledged target is not an
  outcome — report the delivered emissions path against the pledge and name the gap. Climate Action Tracker
  is the PRIMARY instrument.

**Overlap rule — do NOT conflate (as §7 for the two cohesions):**
- *Endowment, not industry:* what is physically in the territory (incl. undeveloped/stranded) is
  `territory`; what is extracted, valued, traded is `economy`.
- *Physical hazard, not strategic contest:* the warming and the thaw are `territory`; the Arctic (or any
  frontier) as a military/sovereignty theatre stays in `security`.
- *Metabolism, not export-vulnerability:* the country's own physical energy/food/water throughput is
  `territory.metabolism`; energy-as-someone's-balance-sheet-risk is `economy`.
- *Capacity as a lens, not a ledger:* `territory` names the exposure-capacity gap and USES fiscal facts to
  weigh it; it does not restate the deficit numbers that belong to `economy`.

---

## 9d. Capacity discipline (can the state DO)

`capacity` describes whether the state can build, permit, deliver, process — present-state and sourceable,
the register's spine-level blind spot. NOT what the country has (`economy`) or who benefits (`society`) — it
is whether intent becomes built fact. Keep it present-state: permitting timelines, delivery record,
productivity, internal barriers, value-add processing built vs raw exported are all current, measurable
facts. Forward-looking "will it build X" belongs to the trajectory layer, not here.

---

## 10. Fact vs. Interpretation

Every source entry is `citationType: Fact` or `citationType: Interpretation`, no exception.

- **Fact** — the cited source is the *primary author* of the data/event (Statistics [Country] published the
  GDP figure; the UN published the treaty text; ACLED recorded the incident).
- **Interpretation** — the source analyses, summarises, or forecasts data it did not originate (a think-tank
  stability report; a business-sentiment survey; a news editorial).

**Society note:** a barometer cited for **its own survey result** ("32% reported trusting most people,
Afrobarometer Round 9 (2024)") is **Fact** — the barometer is the primary author of that datum. The *same*
barometer used to characterise a *trend* is Interpretation. **Cleavage geometry and salience judgments are
Interpretation.**

Target **≥ 70% Fact per section**. The website renders Interpretation with a dotted underline; getting the
classification right matters.

---

## 11. Source schema — all eight fields required

No "where available" escape hatches.

```yaml
- id: short-slug          # lowercase, alphanumeric, hyphens only; e.g. afrobarometer-r9
  name: "Full Publication Name"
  url: "https://exact-url-to-the-specific-page-or-document"
  desc: "One sentence: what this source is and the specific data point it provides for this country."
  publicationDate: "YYYY-MM-DD"   # first of month if only month known; YYYY-01-01 if only year known
  accessDate: "YYYY-MM-DD"        # date you opened and verified the URL
  confidence: High | Med | Low
  citationType: Fact | Interpretation
```

`desc` must name the specific datum — `"Senegal interpersonal-trust share, Afrobarometer Round 9 (2024)"`,
not `"Afrobarometer data"`.

---

## 12. Time-binding numerics

Every numeric is tied to a specific period. **No exceptions — and this applies to society figures.**

- Correct: `"median age 18.1 in 2024 [un-wpp-2024]"`; `"32% interpersonal trust, Afrobarometer R9 (2024) [afrobarometer-r9]"`
- Wrong: `"median age 18.1 [un-wpp-2024]"`; `"trust is low [afrobarometer-r9]"`

A barometer round (R9 / 2024) counts as its time-binding. If a figure arrives without a year, re-query for
the period; don't include it.

---

## 13. Output structure (peers: political · economy · territory · capacity · society · security)

1. `executiveSnapshot` — bullets with inline `[source-id]`, **including society, territory & capacity lines** (see §14)
2. `political.powerStructure`
3. `political.stabilityDrivers` — *(elite cohesion lives here)*
4. `political.shockAbsorbers`
5. **`political.constitutionalSubstrate`** — deep-time legal bedrock (treaty lineage / title); distinct substrates held separately. Treaty text + court rulings only.
6. `economy.macroReality`
7. `economy.externalVulnerability`
8. `economy.politicalEconomy`
9. **`territory.geography`** — spatial form: distances, habitable-vs-empty, ports, internal connectivity, the north/periphery.
10. **`territory.minerals`** — critical-mineral & subsurface endowment; reserves with year + estimating body; contested counts flagged.
11. **`territory.biosphere`** — forests, freshwater, arable land, fisheries as physical stock + trend.
12. **`territory.climate`** — observed + projected exposure, located geographically; scenario+horizon bound; exposure paired with capacity (§9c).
13. **`territory.metabolism`** — how the country powers/feeds/waters itself as a system; self-sufficiency vs dependence.
14. **`territory.transition`** — decarbonization: emissions trajectory vs pledge; demonstrated over declared; Climate Action Tracker primary.
15. **`capacity.permitting`** — approval timelines; regulatory predictability; proposed-vs-consented-vs-built record.
16. **`capacity.delivery`** — infrastructure delivery record & deficit; cost/schedule performance; administrative & fiscal execution.
17. **`capacity.productivity`** — productivity level & trend; internal/interprovincial barriers; value-add processing built vs raw exported.
18. **`society.demographics`** — population structure; median age / youth-bulge or ageing reality; urban/rural split; migration patterns. Time-bound.
19. **`society.composition`** — ethnic, linguistic, religious composition; where fault lines run; **cross-cutting vs reinforcing** geometry (§9).
20. **`society.religion`** — composition + fault line; lived/syncretic texture; political salience; bias documented (§8).
21. **`society.cohesion`** — interpersonal & institutional trust, social capital, lived self-image. Barometer/WVS/Pew as **primary** source.
22. `security.internal`
23. `security.diplomacy`
24. `actors.domestic`
25. `actors.external`
26. `risks`
27. `sources` — appears once, at the end; every cited source, all 8 fields; no orphans either way.

---

## 14. Research-pass prompt (tool-agnostic)

Address it to "the research assistant" — usable with any deep-research-capable tool. Use it for Pass A
(sourcing) and Pass B (prose-from-approved-IDs), per §5.

```
You are a geopolitical analyst writing a structured country situation report on [COUNTRY] for an audience
of senior decision-makers and analysts. The date is [TODAY'S DATE].

Write a detailed report covering ALL sections below. For every factual claim, include an inline citation to
a primary or high-quality secondary source (government publication, central bank, IMF, World Bank, UN body,
academic institution, recognised survey instrument, or major international organisation).

SOURCING RULES:
- Do not cite Wikipedia, aggregators, or blogs. If you cannot find a primary or high-quality secondary
  source for a claim, OMIT the claim — do not write it with weaker sourcing or vague attribution.
- Every numeric figure must be tied to a specific year or date range.
- For each source give: the full URL to the specific document (not the homepage); the publication name; the
  publication date (YYYY-MM-DD; first of month if only month known; first of year if only year known); the
  access date (YYYY-MM-DD); and whether the source is the primary author of the data (Fact) or is
  analysing/interpreting data from elsewhere (Interpretation).

SOURCE PRIORITY: Statistics [Country], IMF, World Bank, BIS, OECD for macro/finance. V-Dem, Freedom House,
WJP for governance. ACLED, SIPRI, ICG for security/conflict. Transparency International for corruption.
Original treaty text for legal matters. WTO / UN Comtrade for trade. UN DESA World Population Prospects and
the national census/statistics office for demography. National census, Pew–Templeton Global Religious
Futures, and ARDA for ethnic/linguistic/religious composition. For social trust and social capital, use
the region's own citizen self-report barometer as the PRIMARY instrument: Afrobarometer, Arab Barometer,
Latinobarómetro, Asian Barometer, Eurobarometer, World Values Survey, or Pew. National news only for events
of fact in the last 90 days. For current government composition — seat standings, majority/minority/coalition status — use the national legislature's official party-standings page or the national electoral authority, reflecting the distribution within the last 90 days; never infer current composition from an older economic or governance report.

SECTIONS REQUIRED:

1. EXECUTIVE SNAPSHOT (13 bullets)
   - Regime type and how power is won/held
   - Current political equilibrium: current seat composition and majority/minority/coalition status — cite the legislature's official standings, current within 90 days; opposition; legitimacy
   - Economic model overview (dominant sectors, trade profile)
   - PHYSICAL BASE: the defining geographic fact; the headline resource endowment; the principal climate
     exposure and whether the country can afford to meet it
   - EXECUTION CAPACITY: whether the state can build/permit/deliver — often the single most binding
     constraint on acting
   - SOCIAL STRUCTURE: demographic reality (youth bulge or ageing); the principal social cleavage and its
     geometry (cross-cutting or reinforcing); the population-wide social-trust level
   - Top 3 risks in the next 6-18 months
   - Top 3 watch items in the next 4-12 weeks
   - External dependencies (trade, energy, debt)
   - Security posture (internal stability, border situation)
   - Diplomatic orientation (alliances, key bilateral relationships)
   - Data confidence statement (which sections are high/medium/low confidence)
   - Baseline present-state characterisation (1 sentence — NOT a forecast)

2. POLITICAL ANALYSIS
   - Power structure: who holds executive, legislative, judicial power — state the current governing party/coalition, its seat count and majority/minority status as of now, cited to the legislature's official standings (within 90 days); who controls security forces; media
     independence.
   - Stability drivers: what legitimises the regime; armed-forces loyalty; coalition composition; business
     elite alignment; ELITE COHESION (intra-power-bloc unity — note: this is distinct from social cohesion,
     which belongs in SOCIETY below).
   - Shock absorbers and accelerants.
   - Constitutional substrate: the deep-time legal foundation beneath current politics — for settler states,
     Indigenous title and the treaty lineage. Treaty text and court rulings only, never news. Hold distinct
     legal substrates SEPARATELY (historic-treaty / modern-agreement lineage vs unceded, title-litigated
     territory); do not collapse them or project a single model of consent onto plural Indigenous
     governance. Present-state bedrock, distinct from the current political contest above.

3. ECONOMIC ANALYSIS
   - Macro reality: GDP growth, sector performance, fiscal position (deficit %, debt/GDP), monetary policy,
     inflation, credit rating — specific figures and years.
   - External vulnerability: export/import profile by value and commodity; partner concentration; sovereign
     debt holders; IMF program status; sanctions exposure.
   - Political economy: who benefits from the current model; business-elite structure; reforms technically
     necessary vs politically possible.

4. TERRITORY (describe the physical body of the country ON ITS OWN TERMS, not merely a risk to assets or an
   input to trade. Throughout: PAIR every exposure with the capacity to act on it and name the gap; LOCATE
   effects geographically — who inside the country is exposed or served; BIND every projection to its
   emissions scenario AND horizon; report DEMONSTRATED over DECLARED. Neither doom-catalogue nor techno-triumph.)
   - Geography: the physical arrangement the country must overcome to function as one country — land area
     and internal distances; habitable vs empty land; coastlines and ports; internal connectivity (road,
     rail, grid, broadband); the north / periphery. For large or fragmented states this is often the central
     fact, not backdrop. Distinct from the border-security question (SECURITY).
   - Minerals: the critical-mineral and subsurface endowment — what is physically present (reserves and
     resources, each with year and estimating body named; reserve figures are political — flag disputed or
     state-controlled counts), including undeveloped and stranded deposits. What the ground HOLDS, distinct
     from the mining sector's output and exports (ECONOMY).
   - Biosphere: the biological and renewable base — forests, freshwater, arable land, fisheries — as
     physical stock and its condition/trend (depletion, degradation, resilience), with year and source.
     Distinct from agricultural/forestry GDP (ECONOMY).
   - Climate: observed and projected physical climate — zones, warming already recorded, and principal
     hazards (flood, wildfire, drought, heat, sea-level rise, permafrost thaw) LOCATED geographically. Every
     projection carries its emissions scenario AND horizon. Physical science only. PAIR each exposure with
     the adaptive capacity to meet it; name who inside the country is exposed vs who can afford the defence.
   - Metabolism: how the country physically powers, feeds, and waters itself AS A SYSTEM — energy, food, and
     water flows; self-sufficiency vs dependence in each; the internal networks that distribute them. The
     country's own throughput, NOT energy-as-export-vulnerability (ECONOMY).
   - Transition: the country's position in decarbonization — energy mix, emissions profile and TRAJECTORY,
     pledged targets measured against DELIVERED policy. A target is not an outcome; report the actual path
     against the pledge and name the gap. Climate Action Tracker as the PRIMARY pledge-vs-policy instrument.

5. CAPACITY TO EXECUTE (whether the state can DO: build, permit, deliver, process — present-state and
   sourceable. NOT what the country has (ECONOMY) or who benefits (SOCIETY), but whether intent becomes
   built fact. Where "knowledge isn't the constraint, capacity is" becomes a measured field.)
   - Permitting: approval and permitting timelines for major projects; regulatory predictability; the record
     of projects proposed vs consented vs built.
   - Delivery: infrastructure delivery record and deficit; cost and schedule performance; the state's
     administrative and fiscal ability to execute at scale.
   - Productivity: productivity level and trend; internal / interprovincial barriers to movement of goods,
     labour, capital; value-add processing built domestically vs raw material exported for others to process.

6. SOCIETY (describe the society ON ITS OWN TERMS, before and independent of any stability implication; a
   society is a component of the country in itself, not a risk factor)
   - Demographics: total population and age structure (median age, youth-bulge or ageing reality);
     urban/rural split; internal and cross-border migration patterns; fertility/dependency where relevant.
     All figures tied to a year.
   - Composition: ethnic, linguistic, and religious composition (rounded shares with year and source). State
     where the principal fault lines run, and EXPLICITLY whether the cleavages are CROSS-CUTTING (membership
     on one cleavage does not predict membership on another — tends to defuse) or REINFORCING (cleavages
     stack along the same line — tends to inflame). Name the geometry; do not just list groups.
   - Religion: (a) composition rounded, and the fault line if there is one; (b) lived/syncretic texture —
     indigenous, folk, and syncretic practice the official label hides; (c) political salience — how far
     religion structures authority, allegiance, and daily life (e.g. parallel religious authority such as
     Sufi brotherhoods; prosperity-gospel political mobilisation; or high adherence with low salience). For
     every religious-composition figure, NAME the source and its known bias, and flag where the count itself
     is contested or politically suppressed. Round, do not over-precise.
   - Cohesion: population-wide social trust (interpersonal AND institutional), social capital, and how the
     society sees itself. Use citizen self-report survey data (the region's own barometer / WVS / Pew) as the
     PRIMARY instrument here — not as a triangulation check.

7. SECURITY ANALYSIS
   - Internal: armed groups; organised crime; communal violence; terrorism threat level; military strength
     and loyalty; corruption in security forces; border situation. (May reference the SOCIETY section, but
     does not replace it.)
   - Diplomacy: treaty alliances; transactional partners; key bilateral relationships; regional flashpoints;
     multilateral memberships.

8. KEY ACTORS (domestic and external)
   For each: name, interests, resources/capabilities, constraints, likely moves in the next 6-18 months,
   dealability (High/Medium/Low). Domestic: 5-10. External: 3-5.

9. RISK REGISTER (5-10 risks)
   For each: title, trigger, probability (High/Med/Low), impact (High/Med/Low), time horizon, leading
   indicators, mitigants.

FORMAT one block per section using ## headers matching these YAML field names, in THIS order:
executiveSnapshot, political.powerStructure, political.stabilityDrivers, political.shockAbsorbers,
political.constitutionalSubstrate, economy.macroReality, economy.externalVulnerability,
economy.politicalEconomy, territory.geography, territory.minerals, territory.biosphere, territory.climate,
territory.metabolism, territory.transition, capacity.permitting, capacity.delivery, capacity.productivity,
society.demographics, society.composition, society.religion, society.cohesion, security.internal,
security.diplomacy, actors.domestic, actors.external, risks. End with a complete ## sources block in YAML, all 8 fields per
source: id, name, url, desc, publicationDate, accessDate, confidence, citationType.

DO NOT include any forward-looking extrapolation, scenario, or "where this is heading" content. This report
is the PRESENT-STATE layer only. Forward-looking reasoning belongs in a separate trajectory layer with its
own contract.
```

---

## 15. Mapping to YAML

| Report section | YAML field |
|---|---|
| Executive snapshot bullets | `executiveSnapshot[]` |
| Power structure | `political.powerStructure` |
| Stability drivers (incl. elite cohesion) | `political.stabilityDrivers` |
| Shock absorbers | `political.shockAbsorbers` |
| Constitutional substrate | `political.constitutionalSubstrate` |
| Macro reality | `economy.macroReality` |
| External vulnerability | `economy.externalVulnerability` |
| Political economy | `economy.politicalEconomy` |
| **Geography** | **`territory.geography`** |
| **Minerals** | **`territory.minerals`** |
| **Biosphere** | **`territory.biosphere`** |
| **Climate** | **`territory.climate`** |
| **Metabolism** | **`territory.metabolism`** |
| **Transition** | **`territory.transition`** |
| **Permitting** | **`capacity.permitting`** |
| **Delivery** | **`capacity.delivery`** |
| **Productivity** | **`capacity.productivity`** |
| **Demographics** | **`society.demographics`** |
| **Composition** | **`society.composition`** |
| **Religion** | **`society.religion`** |
| **Cohesion (social trust)** | **`society.cohesion`** |
| Internal security | `security.internal` |
| Diplomacy | `security.diplomacy` |
| Domestic actors | `actors.domestic[]` |
| External actors | `actors.external[]` |
| Risk register | `risks[]` |

Replace every inline citation reference with the matching `[source-id]` from `[code].sources.yaml`. If a
source isn't in the sources file yet, add it first.

---

*End of present-state authoring template. The forward-looking layer is governed separately by
`country-report-trajectory-template.md`.*
