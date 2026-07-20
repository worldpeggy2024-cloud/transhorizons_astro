# Country Report Rework — Implementation Spec

Directive spec for applying the reworked country-report structure. Everything here is decided; nothing is a proposal. Apply in the order below.

**Files touched:** `country-report-present-state-template.md` · `research-quality-bar.md` · `deepsearch-country-workflow.cjs` · `CLAUDE.md` · validator · renderer/nav · actors extraction prompt.

---

## Apply order

1. **Anchoring capability** (§1) — build first; four later items depend on it.
2. **Template content edits** (§2–§4) — one pass over `country-report-present-state-template.md` §14/§15 + opener gate.
3. **Display changes** (§5) — renderer/nav only.
4. **Run validators; visual review.**
5. **Source-schema changes** (§6) — one edit, migrate warning-first.
6. **Mirror into pipeline and `CLAUDE.md`** (§7) — non-optional; template edits do not reach generation without it.
7. **Re-point the derived passes** (§8).

---

## §1 — Anchoring capability (build once)

A claim that is **derived** rather than **observed** cannot carry a `[source-id]` of its own. It must name the already-cited material it stands on. That pointer is an **anchor**.

Two anchor target types — support both in one implementation:

| Target | Used by |
|---|---|
| **source ids** | scorecard axes; risk probability/impact ratings |
| **field paths** (`territory.climate`) | `capacity.inheritedTerrain`; actors Layer 2; trajectory layer |

Deliver as one shared capability: schema support + validator resolution + display reveal. Then wire the five consumers to it. Do not implement per-consumer.

---

## §2 — Cross-cutting authoring rules (add to §14 front matter)

### 2.1 The opener contract

Every enforced opener does three jobs, in order:

1. **State** — the country's shape on this dimension, in one sentence. Orientation, not history.
2. **Signal** — salience *and* direction: how central this dimension is to this country, which way it is moving.
3. **Declare depth** — either "detail follows," or an honest one-line close where the country has little here.

Thinness is a finding. A country with negligible critical-mineral endowment produces a one-line `territory.minerals` opener saying so — never an empty field, never a padded paragraph.

### 2.2 Anti-padding

No per-section word caps. Never pad a thin section to match a rich one. Every sentence after an opener carries a `[source-id]` or is cut: no restatement, no meta-commentary, no connective throat-clearing.

### 2.3 Acronyms

First mention of any acronym spells the term in full with the abbreviation in parentheses; later mentions may use the short form. No carve-outs. ISO-3166 alpha-3 codes used as data-field identifiers are exempt; spelled out in reader-facing prose.

---

## §3 — Section structure (§14 SECTIONS REQUIRED, §15 mapping)

**33 fields across six peers. Nine enforced openers.** Openers marked **[OPENER]** are validator-gated.

### Territory

Section disciplines: pair every physical exposure with the capacity to act on it and name the gap; locate effects geographically; bind every projection to its emissions scenario **and** horizon; report demonstrated over declared.

Order: `geography` → `biosphere` → `minerals` → `climate` → `metabolism` → `transition`

- **geography [OPENER]** — Opener: landlocked / coastal / island / archipelago / continent / peninsula; mountainous / flat / diversified; isolated or embedded; neighbours. Then: the physical arrangement the country must overcome to function as one country — land area and internal distances, habitable vs empty land, coastlines and ports, the periphery.
  **Edit:** remove internal connectivity (road, rail, grid, broadband) → moves to `metabolism`.
- **biosphere** — The biological and renewable base (forests, freshwater, arable land, fisheries) as physical stock and its condition/trend, with year and source. Freshwater as stock here; distribution is `metabolism`. Distinct from agricultural/forestry output (economy).
- **minerals** — The critical-mineral and subsurface endowment: what is physically present (reserves and resources, each with year and estimating body; flag disputed or state-controlled counts), including undeveloped and stranded deposits. What the ground holds — distinct from the mining sector's output and exports (economy).
- **climate [OPENER]** — Opener: baseline climate type before any warming or hazard content. Then: observed and projected physical climate — zones, warming recorded, hazards located geographically; every projection carries emissions scenario and horizon; physical science only; pair each exposure with adaptive capacity and name who is exposed vs who can afford the defence.
- **metabolism** — First line signals scope (energy, food, water, movement, information). Then: how the country physically runs and circulates as a system — energy, food and water flows; movement of goods and people within the country; the physical communications backbone; self-sufficiency vs dependence in each, and the networks that carry them.
  **Edit:** absorbs energy + transport + communications, plus the connectivity networks removed from `geography`.
  Boundaries: circulation within the country, not export logistics (ports-as-competitiveness → economy); physical comms infrastructure, not the media ecosystem (→ society); throughput, not balance-sheet.
- **transition** — Position in decarbonisation: energy mix, emissions profile and delivered path, pledged targets measured against delivered policy; name the gap. Climate Action Tracker as primary pledge-vs-policy instrument. "Trajectory" here means delivered emissions path against pledge — present-state fact, not forward extrapolation.

### Society

Section principle: describe the society on its own terms, before and independent of any stability implication. Religion and language appear in every report; low salience is a finding. Describe neutrally first; security/risks reference it after, never the reverse.

Order: `demographics` → `composition` → `language` → `religion` → `wellbeing` → `cohesion`

- **demographics [OPENER]** — Opener: one short historical framing — indigenous-continuous / settler-immigrant-built / mixed from onset / historically closed. Then: population and age structure; urban/rural split; internal and cross-border migration; fertility/dependency — all tied to a year.
- **composition** — Ethnic composition (rounded shares, year, source) and the cleavage geometry: whether cleavages across ethnicity, language and religion are cross-cutting (defuse) or reinforcing (inflame). Name the geometry, don't just list groups. Shares = Fact; geometry judgment = Interpretation.
  **Edit:** language content moves out to its own field.
- **language** *(new)* — Linguistic composition (rounded shares, year, source; flag contested or suppressed counts); lived texture the census label hides (diglossia, vernacular vs official, lingua franca, language of instruction vs home language); political salience — how far language structures authority, allegiance and access (official-language regime, language law, linguistic nationalism). Name each source and its known bias.
- **religion** — Composition rounded plus the fault line if any; lived/syncretic texture; political salience; named-bias sourcing; contested or suppressed counts flagged.
- **wellbeing** *(new)* — Health and educational **outcomes** as a component of the country in itself: life expectancy, healthy-life expectancy, principal mortality/morbidity drivers, child/maternal mortality where relevant; educational attainment, literacy, skills — each with the access gradient. Outcomes only; the systems go to `capacity.publicServices`.
- **cohesion** — Population-wide social trust (interpersonal and institutional), social capital, and how the society sees itself, including national identity and self-conception. Primary instrument: the region's own citizen self-report barometer; handle the reliability flag (unconstrained / partisan-sorted / constrained / unresolved) explicitly rather than reporting a distorted headline.

### Economy

Order: `realEconomy` → `publicFinances` → `externalVulnerability` → `politicalEconomy`

- **realEconomy [OPENER]** *(renamed from `macroReality`)* — Opener: the dominant economic character before any numbers — shape of production (primary / manufacturing / services), what the economy lives on, diversified or concentrated. Then: sectors and what people do for a living; growth; sector performance. Technology as a business sector lives here.
  **Edit:** fiscal / monetary / debt content moves to `publicFinances`. **Repoint the opener gate from `economy.macroReality` to `economy.realEconomy`.**
- **publicFinances** *(new)* — The state's money: budget balance (deficit/surplus, % of GDP), public debt as a share of the economy, central-bank / monetary-policy stance, inflation, credit rating — figures with years.
- **externalVulnerability** — Export/import profile by value and commodity; partner concentration; who holds the sovereign debt; International Monetary Fund program status; sanctions exposure.
- **politicalEconomy [OPENER]** — Opener: the state–market configuration before any distributional detail — state-directed / mixed / market-led; the role of Crown corporations, state-owned enterprises or sovereign funds where they exist; where the boundary is currently contested. Then: who benefits and who loses under the current model; business-elite structure; reforms technically necessary vs politically possible.

Debt appears in two fields by design: **size** in `publicFinances`, **who holds it** in `externalVulnerability`.

### Political Order *(section renamed from "Political Stability")*

Order: `powerStructure` → `rightsAndChecks` → `stabilityDrivers` → `shockAbsorbers` → `constitutionalSubstrate` → `stateStructure`

- **powerStructure [OPENER]** — Opener: regime type and how power is won and held. Then: who holds the executive and how it was won; legislative control stated separately from executive (unified vs divided); each chamber's composition cited to its own live standings page verified on the run date; majority / minority / coalition; opposition strength and legitimacy. Where actual power sits outside the formal organ, locate it explicitly. **Most volatile field in the report** — dated to run date; `volatility: High`.
  **Edit:** judicial and media independence move to `rightsAndChecks`; "who controls the security forces" merges into `stabilityDrivers`.
- **rightsAndChecks** *(new)* — Judicial independence and appointment mechanism; media independence and press freedom; civil-liberties and human-rights record. **Sourcing:** prefer regional instruments where they exist (same logic as the regional citizen barometer in `society.cohesion`); court rulings, national human-rights institutions and regional human-rights bodies are primary. Freedom House / Bertelsmann usable with the scorer and its bias named explicitly.
- **stabilityDrivers** — What legitimises the regime; armed-forces and security-force loyalty **and who controls them**; coalition composition; business-elite alignment; elite cohesion (intra-power-bloc unity, distinct from social cohesion).
- **shockAbsorbers** — What buffers absorb shocks, and what accelerants could convert a shock into instability.
- **constitutionalSubstrate [OPENER]** — Opener: the constitutional form (founding instrument(s), how sovereignty is allocated, one legal tradition or several). Then: founding / re-founding instruments; legal tradition(s); allocation of sovereignty in principle; whether the substrate is STABLE or IN MOTION (apex-court reallocation is present-state fact, cited to rulings); the status of any peoples / nations / territories whose sovereignty predates, sits outside, or is diminished relative to the central state — substrates held distinct. Sources: founding text, apex-court rulings, statutory codification, treaty text, gazette — never news.
  **Edit:** administrative machinery moves to `stateStructure`.
- **stateStructure** *(new)* — Unitary or federal; the administrative divisions named using the country's own term (provinces and territories, Länder, wilayas, oblasts…); which powers sit at which level; asymmetries between units.
  **Placement rule:** administrative divisions belong in this field, never alongside Indigenous or predating sovereignty in `constitutionalSubstrate`.

### Capacity to Deliver *(section renamed from "State Capacity")*

Order: `inheritedTerrain` → `steering` → `approvals` → `delivery` → `publicServices` → `productivity`

- **inheritedTerrain [OPENER]** *(new)* — Opener: the structural terrain the state works against, before any performance claim. Then: geographic and demographic scale; resource base; colonial / extractive legacy and terms of trade; conflict history; the inherited education and health base. **Anchored synthesis** — points at facts already cited in `territory.*`, `society.*`, `economy.*`; introduces no new sourced facts. It is the denominator for every performance claim in this section.
  **Guard (mandatory):** capacity is inherited and distributed — by history, colonialism, resource geography, luck — never earned or deserved. A capacity gap is never rendered as a merit gap.
- **steering** *(new)* — Governance-as-process, distinct from execution: can the government prioritise among competing demands, implement what it announces, build consensus with strategic actors, and learn from policy. `citationType: Interpretation`, **anchored** to the observable record — announced priorities vs implemented ones, auditor-general and evaluation reports, delivered-vs-declared. One to two paragraphs.
- **approvals** *(renamed from `permitting`)* — Can the state say yes or no to a major project, and how long does that take? Approval and permitting timelines for major projects; regulatory predictability; the record of projects proposed vs consented vs built. Where no published approvals regime exists, name and measure the actual binding constraint instead.
- **delivery** — The state's realised record of executing **infrastructure at scale**, distinct from stated intent: infrastructure deficit, cost and schedule performance, the administrative and fiscal ability to execute capital projects.
- **publicServices** *(new)* — The state's realised record of running **continuous public-service systems**: health and education systems (staffing, coverage, access, waiting times, quality of provision), and other universal services where relevant. Receives the systems half of `society.wellbeing`.
- **productivity** — Productivity level and trend; internal barriers to the movement of goods, labour and capital between subnational units (country's own term); value-add processing built domestically vs raw material exported; innovation and research capacity.

### Security & Diplomacy

Order: `posture` → `internal` → `military` → `transnationalExposure` → `diplomacy`

- **posture [OPENER]** *(new)* — Opener: overall security posture (defensive / expeditionary / neutral / alliance-dependent) and diplomatic orientation (aligned / non-aligned / hedging). **Anchored synthesis**; introduces no facts of its own. `volatility: High`.
- **internal** — Armed groups; organised crime, trafficking, illicit finance; communal violence; terrorism threat level; corruption in security forces; border situation; the state's monopoly on force and territorial control across the whole territory.
  **Edit:** the military-strength clause moves to `military`.
- **military** *(new)* — Force size and structure; defence spending in money and as a share of the economy; domains — land, sea, air, cyber, space; conscription vs volunteer; foreign bases hosted or held; nuclear status; whether the force can project or only defend. Reference instrument: International Institute for Strategic Studies, *Military Balance*.
  **Boundary:** capability here; loyalty and control remain in `political.stabilityDrivers`.
- **transnationalExposure** *(new)* — Cross-border flows and non-state entanglements: trafficking, illicit finance, cross-border crime, foreign interference and disinformation, migration pressure, shared-resource frictions.
  **Dividing rule:** relationships with named states → `diplomacy`; flows and non-state entanglements → `transnationalExposure`. Territorial disputes stay in `diplomacy`.
- **diplomacy** — Treaty alliances; multilateral memberships; transactional partners; territorial disputes; regional flashpoints; and **per-relationship texture** for key bilateral relationships, built on hard citable facts (treaty texts, trade volumes by partner, basing agreements and troop presence, United Nations voting alignment, energy dependence, state visits). The character of a relationship is Interpretation **anchored** to those facts.

### situation *(unchanged)*

Emitted empty in Pass B; populated by the dedicated Situation pass. Named threads ordered by recency of last activity; events chronologically forward within a thread; each event = date + what happened (one factual sentence) + what it materially changed. Max ~8 events; every event cited to a primary source; own manual `situation_lastUpdated` date. No opener.

---

## §4 — Scorecard authoring spec

Six axes: elite cohesion, social cohesion, security loyalty, economic pressure, protest capacity, institutional resilience.

Each axis carries:
- `value`: High | Med | Low
- `anchors`: the `[source-id]`s of already-cited claims in the report that the rating summarises (≥ 1; must resolve in `*.sources.yaml`)
- `rationale`: one line — why those facts produce this value

Rules:
- All six are `citationType: Interpretation`.
- Derivative: introduces **no fact not already cited in a section below**. Composed last.
- All six are `volatility: High`.
- Cross-peer by design — renders at page level / in the lateral rail, not inside a section.

**Validator:** extend the apply-gate scorecard check from "values present" to "values present **and** each has ≥ 1 resolvable anchor + a rationale." Migrate warning-first.

---

## §5 — Display

- **Executive Snapshot is removed.** Its content lives in section openers.
- **Page-top order:** stat cards → **Baseline** → content.
- **Baseline** — a short paragraph (not one line, not long), extracted from the researched report, introducing no fact not cited below. It is the page's only always-visible prose; sections render collapsed, so a reader needs enough to decide whether to open this country. Name it **Baseline**, never "Outlook."
- **Section order** — standing body: Territory · Society · Economy · Political Order · Capacity to Deliver · Security & Diplomacy. Dynamic tail: Situation · Actors · Risks. Then Recommended Sources.
- **Lateral nav** — persistent section list mirroring the section order, opening at Territory. Per-section anchored deep-links (`#society.cohesion`).
- **Scorecard** — in the sidebar, as a **visually distinct block** from the nav list (assessment vs navigation). Each axis reveals its rationale and anchor sources on hover/expand. On mobile the rail collapses; the scorecard renders inline, immediately after the Baseline.
- **Per-section data confidence** — shown in each section header, aggregated from that section's source `confidence` fields, alongside the section date. No global confidence indicator.
- **Section renames** — "Political Stability" → **Political Order**; "State Capacity" → **Capacity to Deliver**.

---

## §6 — Source schema (one edit, after §2–§5 land)

### 6.1 `desc` discipline

`desc` states the source's **scope, role and authoritative status** in ~20–30 words: what the source *is* (a national inventory report, a live standings page, a court ruling, an official assessment), what claim domain it authoritatively covers, and any bias or reservation. It does **not** state the specific numbers or claims the prose draws from it.

**Test:** if a fact in the `desc` could be edited to a new value while the prose still cites the id unchanged, it does not belong in the `desc`.

Apply to: template §11 source schema · `research-quality-bar.md` · Pass A harvest instructions. Optional soft validator warning for `desc` > 50 words.

### 6.2 `volatility` axis

```yaml
volatility: High | Med | Low   # expected rate of change of the fact(s) this source backs — orthogonal to confidence
```

| Level | Changes | Refresh | Typical |
|---|---|---|---|
| `High` | ≤ 1 year, or on events | annual / on-event | reserves-with-year, GDP and fiscal figures, seat composition, office-holders, sanctions, program status |
| `Med` | a few years | ~2–3 years | demographic structure, composition shares, productivity trend, memberships |
| `Low` | structural | on major event | constitution, geography, baseline climate type, legal tradition |

Orthogonal to `confidence` — a national-statistics figure is `High` confidence **and** `High` volatility. Never overload `confidence` to signal freshness.

Defaults by field: **High** = `territory.minerals`, `economy.*` figures, `political.powerStructure`, `security.posture`, `situation`. **Med** = `society.demographics`, `society.composition`, `capacity.productivity`, `security.diplomacy`. **Low** = `political.constitutionalSubstrate`, `territory.geography`, `territory.climate` baseline.

**Refresh query this enables:** sources where `volatility: High` and `accessDate` older than the tier cadence → the worklist. Each hit points back to its claim via `[source-id]`; update that fact, bump `accessDate`, leave surrounding prose untouched.

**Validator:** add `volatility` to required source fields, **warn-on-missing not fail**; backfill `High` sources first; then promote to hard requirement.

**Also update:** `research-quality-bar.md` — add a Volatility table beside Confidence, and redirect the existing rule "source older than 3 years on a fast-moving topic → `confidence: Low`" to set `volatility: High` instead. `quarterly-refresh-playbook.md` — Step 1 triage builds the worklist by query; Step 2 spot-update touches only worklist ids; Step 8 health check also flags stale `High` sources.

---

## §7 — Pipeline mirror (do not skip)

Template edits do not reach generation on their own. Mirror into:

- **`deepsearch-country-workflow.cjs`**
  - Pass A front matter: source `desc` discipline (§6.1), acronym rule (§2.3).
  - Pass B section instructions: the full field set (§3), the opener contract (§2.1), the anti-padding rule (§2.2), the anchoring requirement for `inheritedTerrain`, `steering`, `posture` (§1).
- **`CLAUDE.md`** — country-reports section: acronym rule, sourcing discipline.

**Verify** by generating a prompt and confirming the new disciplines appear in it before running a country.

---

## §8 — Derived passes

### 8.1 Actors

Two layers. **Layer 1** (extraction): named entities, `kind`, `liveActorStatus`, `fieldsCitedIn`, current position from the report — high reliability. **Layer 2** (analytical draft): interests, resources, constraints, likely moves, `engagementMode`.

Requirements:
- Layer 2 renders **collapsed by default and visibly labelled AI-drafted / unverified**. This rendering is part of the change, not a follow-up.
- Layer 2 **anchors** — carries the `[source-id]`s or field paths it reasons from (§1).
- Layer 2 is `citationType: Interpretation`.
- `engagementMode` replaces `dealability`: structural categories (`negotiable`, `statutorily-independent`, `judicial-deference`, `hijack-exposed`, `veto-holder`, `blocked / not-engageable`, `report-silent`) each with a one-line justification from the text.

**Update the prompt's input field list** to the new set: remove `executiveSnapshot_en`; rename `economy_macroReality` → `economy_realEconomy`, `capacity_permitting` → `capacity_approvals`; add `economy_publicFinances`, `society_language`, `society_wellbeing`, `political_rightsAndChecks`, `political_stateStructure`, `capacity_inheritedTerrain`, `capacity_steering`, `capacity_publicServices`, `security_posture`, `security_military`, `security_transnationalExposure`.

### 8.2 Risks

Same two-layer pattern, three differences:

- **Layer 1 is not extraction** — risks are not named in the report. Layer 1 is the **stated stress points**: a vulnerability, dependency, fragility or capacity gap the report already asserts with a `[source-id]`, plus situation threads trending badly. Layer 2 is the risk framing: trigger, horizon, leading indicators, mitigants.
- **Probability and impact** are `citationType: Interpretation`, **qualitative only** (High/Med/Low, never numeric), each **anchored** to the `[source-id]`s of the stress facts it rests on.
- **Watch items** (4–12 weeks) derive from `situation`; risks (6–18 months) derive from the six peers.

---

## §9 — Verification checklist

- [ ] All 33 fields present in §14; §15 mapping updated for renames and new fields.
- [ ] Nine enforced openers gated: `territory.geography`, `territory.climate`, `society.demographics`, `economy.realEconomy`, `economy.politicalEconomy`, `political.powerStructure`, `political.constitutionalSubstrate`, `capacity.inheritedTerrain`, `security.posture`.
- [ ] Opener gate repointed from `economy.macroReality` to `economy.realEconomy`.
- [ ] Field renames propagated everywhere: `macroReality` → `realEconomy`; `permitting` → `approvals`.
- [ ] Anchoring resolves both target types; scorecard, `inheritedTerrain`, `steering`, `posture`, actors Layer 2, risk ratings all wired to it.
- [ ] Scorecard validator checks anchors + rationale (warning-first).
- [ ] Source `volatility` and `desc` rules in template §11, `research-quality-bar.md`, Pass A.
- [ ] Pipeline and `CLAUDE.md` mirrored; a generated prompt shows the new disciplines.
- [ ] Actors prompt input list updated; Layer 2 renders collapsed and labelled.
- [ ] Section renames applied in template labels and renderer.
- [ ] Validators pass on an existing country before regenerating any report.

---

## Amendment 2026-07-19 — derivatives compose after the situation pass (decided)

Supersedes the §14 GENERATION ORDER rule that Pass B composes the scorecard and baseline last
*within Pass B*. Decided after the USA run 2 situation pass corrected two peer fields and rewrote
the Iran status in `security.diplomacy` — derivatives composed before that pass can rest on facts
the verification layer then changes, and a baseline blind to an active war is not a faithful
summary of the report it fronts.

- Pass B emits `scorecard` (all six axes), `scorecardAnchors`, and `baseline` EMPTY, exactly as it
  already does for situation/actors/risks. Partial fills are apply-gate errors; all-empty is a
  warning ("awaits the derivatives pass").
- A dedicated DERIVATIVES pass (closed-book, `derivatives-pass.prompt.md`, generated at init)
  composes both from the finished report — including the installed situation threads — after the
  situation pass's peer corrections are approved: the last point at which the report's facts can
  change. Sequencing guard: the pass stops if `situation_en` is empty.
- Pass order: Pass B → situation pass (+ approved peerCorrections) → derivatives pass →
  actors / risks passes.
- The page hides the Quick scorecard block while the scorecard is empty (the baseline already
  rendered nothing when empty, by the §4 ruling — never back-fill).
- Contracts unchanged: six axes High|Med|Low, Interpretation, ≥1 resolvable anchor + bilingual
  rationale per axis, ghost anchors hard-error; baseline short, present-state, no new facts, no
  anchors, never "Outlook".

---

## Amendment 2026-07-19b — risk notion reworked (decided; study open)

Partially supersedes §8.2. Decided after the author traced the "globe risk" notion to its
Manus-era origin: correlation-matrix labels recycled into a filter facet, never derived from
anything and never driving the globe.

- The globe **risk-level filter facet is removed** (region + topics remain; keyword search over
  report content is the studied replacement).
- The **risks pass is Layer 1 only**: a structured, cited **stress index** — every dependency,
  fragility, capacity gap, and adverse trend the report itself asserts (risks-pass-template.md
  v2.0, draft pending author approval). The former **Layer 2** (trigger, horizon, probability ×
  impact, mitigants — the judgment layer), the **aggregate riskLevel**, and the **correlation
  cascades** are PARKED pending study.
- `deriveRiskLevel` keeps the strict rule but returns null for empty or unrated registers —
  'Low' means assessed-low, never nothing-to-assess. The on-page chip renders only from rated
  legacy registers (CAN). `countryMetadata.riskCategory` is legacy-unused.
- `/risk-correlations` stays visible as a prototype by author decision while the correlation
  mechanism is re-derived some other way; its displayed data is Manus-era illustrative.
- Installing a stress index requires a renderer for the new entry shape (title, kind, statement,
  loci, anchors, deadline?) — built with the first install, not before the design is approved.
