# Country Report — Present-State Authoring Template

*Tool-agnostic. Replaces `perplexity-authoring-template.md`.*
*Produces the sourced, verifiable present-state country report (one of two layers).*

> **LAYER: Present-state.** This template produces the sourced, verifiable layer of a country report:
> `political · economy · territory · capacity · society · security · actors · risks · sources`.
>
> **Governed by:** `research-quality-bar.md` (present-state layer). Its rejection criteria override any ambiguous behaviour here.
>
> **Companion:** `country-report-trajectory-template.md` is a **separate** template with its **own**
> contract. Nothing forward-looking belongs in *this* file's output. If a claim is about what *could* happen, it is not present-state — it goes in the trajectory layer. That separation is the wall between the two registers; do not blur it.

---

## 0. What changed, and why (orientation — read once)

1. **Six peers, not four.** `territory`, `capacity`, and `society` now stand as top-level peers alongside `political`, `economy`, and `security` — same rank, same sourcing rigor, each its own collapsible card.
   Order: `political · economy · territory · capacity · society · security`. All three were previously demoted: the physical body of the country surfaced only as "border situation" or "energy dependency" (now `territory`); the state's ability to build, permit, and deliver had no field, though "knowledge isn't the constraint, capacity is" is the project's spine (now `capacity`); society appeared only where it was a "problem" — a *risk factor*, never a *component of the country in itself* (now `society`). A deep-time **`political.constitutionalSubstrate`** sub-field was also added (deep legal bedrock beneath current politics — the allocation of sovereignty and any predating or diminished sovereignties, held distinct).
2. **The template is tool-agnostic.** It was Perplexity-shaped. The durable machinery (two-pass, validator gates, Fact/Interpretation, the source schema, time-binding) must survive a tool swap. Perplexity is now **one option, for sourcing only**.

---

## 1. The peers, and the on-its-own-terms principle

A country is described as six peers, each on its own terms:

`political` · `economy` · **`territory`** · **`capacity`** · **`society`** · `security`

**Each peer is described *before* and *independent of* any stability implication.** A society, a territory, a capacity to build — each exists whether or not it threatens or serves anything. The register this template replaces demotes three of them: the physical body of the country surfaces only as "border situation" or "energy dependency" — a risk to assets or an input to trade, never the material fact the country IS (`territory` fixes this); the state's ability to build, permit, and deliver has no field at all, though "knowledge isn't the constraint, capacity is" is the whole project's spine (`capacity` fixes this); and society appears only where it is a "problem" (`society` fixes this).

**The anti-pattern this fixes (load-bearing):** when society only appears where it's a "problem," religion and ethnicity surface in some regions' reports only as threats and vanish from others entirely. That reproduces the war/corruption template the project rejects. Therefore:

- **Religion appears in every report**, including where its political salience is low.
- **The absence of a fault line is itself a finding**, stated as one — not an omission.
- Describe the society neutrally and fully first; let `security` and `risks` reference it afterward, not the other way around.

---

## 2. Tool stance (tool-agnostic)

The schema leads; the tool serves. **Durable structure that must survive any tool swap:**

- two-pass workflow (sources → prose),
- validator gates (blocking),
- `Fact` / `Interpretation` tagging,
- the 8-field source schema,
- time-binding of every numeric.

Any deep-research-capable assistant can run the passes. **Perplexity Deep Research remains one option, and only for Pass A (sourcing).** Never let a single tool's default output dictate the schema or section order.

---

## 3. File targets

```
content/countries/[CODE]/analysis.yaml   ← ONE flat file: all sections, both languages
                                            (<section>_<subsection>_<en|fr> keys);
                                            actors/risks/sources as JSON-in-text blocks
```

`[CODE]` = ISO3 (e.g. `BRA`, `SEN`, `CAN`). *(Replaces the earlier split `[code].en/fr/sources/meta.yaml`
proposal — both languages live side by side in one file, which is also what the EN/FR parity check reads.
Peggy proofs FR; EN/FR citation parity required.)*

---

## 4. Standard Operating Procedure

0. Read `research-quality-bar.md` (present-state layer) first.
1. **Pass A — sources only.** Harvest candidate sources covering macro, governance, trade, security,
   **territory** (geography, minerals, biosphere, climate, metabolism, transition), **capacity** (permitting,
   delivery, productivity), **and society** (demography, composition, religion, cohesion). Sourcing tool of
   your choice.
2. Paste into the sources JSON block of `analysis.yaml` (or apply via the workflow script); run the
   validator on the sources block. If it fails, **do not write prose.**
3. **Pass B — prose from approved source IDs only.** Now covering the territory, capacity, and society sections.
4. For each claim, confirm the cited URL is live and replace any temporary inline reference with the correct
   `[source-id]`.
5. Run `npm run validate:country -- content/countries/[CODE]/analysis.yaml` and fix **all** errors before publishing.
6. Open the rendered page and review visually — **including the new territory, capacity, and society cards**
   (citations resolve, FR toggle works).

---

## 4b. Pass Zero — calibration lookup (runs before Pass A)

Pass Zero is a calibration lookup that runs before Pass A. It identifies which verifiable primary instruments exist for the country — legislature chambers and their live standings pages, executive type, power locus, substrate instruments, legal orders, territorial control, execution regime, cohesion instrument, periphery, subnational term, and religion count reliability. Its output, `pass-zero.calibration.json`, is consumed by Pass A and Pass B. It may return `UNRESOLVED` for any field, which is a correct output, not a failure. Pass A and Pass B must not infer these values themselves.

---

## 4c. Pass Zero-B — event scan (runs after Pass Zero, before Pass A)

Pass Zero-B answers one question: what has materially HAPPENED in and to the country in the last 12 months that a well-informed reader would consider major — wars and military operations, coups and constitutional crises, disasters, currency or banking crises, assassinations and leadership deaths, mass mobilisations, major legislation. It exists because the six-peer schema asks what a country IS, never what is HAPPENING to it: a war casts a shadow into no standing-condition field, so Pass A — a list of institutions that publish periodic data — never harvests a war source. Same discipline as Pass Zero: LOOKUP not analysis, a date and an openable primary or authoritative source per event, `UNRESOLVED` a correct answer, JSON only. Its output, `pass-zero-b.events.json`, is consumed by Pass A (which harvests a source for each event) and by the **situation pass** (§4d) — NOT by Pass B, which emits the `situation` field empty.

---

## 4d. Situation pass — the verified event layer (runs after Pass B, its own pass)

The `situation` field is populated in its own pass, after the peer sections exist — **never by Pass B**. It is verification-heavy by nature: it holds recent, fast-moving, contested events — exactly the material most likely to be stale or wrong, and least likely to have a settled primary source. It is the one field where a generated draft is a **starting list to verify, never content**. Perplexity (or any research tool) can propose the events; it cannot be trusted to date them, bound them, or decide what they changed. Every event is fetched against a primary source before it enters the field.

**Purpose.** The six peer sections describe standing conditions. They have no place to hold discrete events that materially changed the country's position — a war, a tariff regime, a rupture. Without this field, such events vanish from the report entirely even when they dominate the country's situation. This field holds them.

**Structure — threads, not a flat list:**
- The field contains **threads**. Each thread is a named strand of related events (e.g. "Trade rupture with the United States", "Defence commitment").
- Threads are ordered by **recency of last activity** — the thread that moved most recently comes first.
- Within a thread, events run **chronologically forward** (oldest first). This is non-negotiable: a causal chain told in reverse is unreadable.
- Each thread may carry an optional **current-state line** at the end, summarising where the thread stands now.

**Each event:**
- **Date** (or date range) — bolded, leading.
- **What happened** — one sentence, factual, no characterisation.
- **What it materially changed** — the consequence. If you cannot state a material change without editorialising, the event does not belong in this field.

**Content rules:**
- Maximum **8 events total** across all threads (the United States report may carry more).
- Only events that **materially changed the country's position**. Not notable news.
- Exclude anything already covered structurally elsewhere — seat composition, budget measures, standing policy, demographic trends. Those belong to their peer sections. This field is for events with no natural home in a description of standing conditions.
- **No explanation by character or motive.** State what changed, not why anyone did it.
- **Every event carries a source citation**, same as any other field.

**Cross-referencing:** where an event supersedes or contradicts a claim in a peer section, the peer section must be **corrected** — the situation field does not exist to hold contradictions, it exists to surface them.

**Storage.** `situation_en` / `situation_fr` hold the threads as JSON-in-text (the same convention as actors/risks): an array of
`{ "thread": "…", "events": [{ "date": "…", "what": "… [source-id]", "changed": "… [source-id]" }], "currentState": "…" }`
(`currentState` optional). The renderer displays threads natively and falls back to plain prose for legacy content.

---

## 5. Two-pass workflow (full rebuild)

Use this for any country whose legacy citations are weak, generic, or not traceable enough to publish.

### Pass A — sources only

Ask the research assistant for a **sources-only output**. No narrative prose in this pass.

Required: one candidate source list covering **macro, governance, trade, security, territory, capacity, and society** — territory across its six sub-domains (geography, minerals, biosphere, climate, metabolism, transition), capacity across its three (permitting, delivery, productivity), society across its four (demography, composition, religion, cohesion); full deep links only, never homepages; all 8 schema fields per source; provisional `id` values; `citationType` set for every source; titles captured in the source's own official language(s) as published — both languages when bilingual, the original title verbatim (original script included, with translation-plus-transliteration in `desc`) when single-language — **never translated** (see §11).

**Acceptance rule:** if the source list does not pass the validator after being pasted into the `sources` block, do not proceed to prose.

### Pass B — prose from approved source IDs only

Cite **only** the approved IDs from Pass A. Any claim that cannot be tied to an approved ID is omitted. If a section (society included) cannot be written cleanly from approved sources, leave it incomplete rather than weakening sourcing.

### When a section returns insufficient citations

Do **not** write the claim with weaker sourcing or vague attribution — omit it. Re-run with narrowed scope for that section. If a URL is broken, find an archive copy and add `archiveUrl`. If no credible source exists after a second attempt, mark `# TODO: needs source` and don't publish that content. *A claim without a primary or high-quality secondary source is not a claim — it is noise.*

### Hard gates (blocking)

- **Validator:** `npm run validate:country -- content/countries/[CODE]/` (single) /
  `npm run validate:countries` (all). Fails on orphan citations, orphan sources, homepage URLs, denied low-reliability domains, missing fields, **and EN/FR citation-parity gaps (now spanning society IDs).**
- **Research quality bar:** validation is necessary, not sufficient. If the validator passes but the content fails `research-quality-bar.md` (present-state layer), the content is still rejected.

---

## 6. Source priority (by domain)

Use the highest available tier. Do not substitute a lower tier when a higher one exists.

| Domain | Priority sources |
|---|---|
| Macro / Finance | Statistics [Country] · IMF · World Bank · BIS · OECD |
| Governance / Rule of law | V-Dem · Freedom House · World Justice Project |
| **Government composition** (who governs now) | **the national legislature's official live seat-standings page · national electoral authority — the live source verified on the run date, NOT a document dated within N days; majority/minority/coalition status derived from it. (Legislature size and the fixed election calendar are slow structural facts — a loose date gate is fine for those.)** |
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
| **Constitutional substrate** (deep-time legal) | **founding constitutional text · apex-court rulings (constitutional and title) · statutory codification of the sovereignty relationship · the legislature's own non-partisan research service · treaty text where applicable · official gazette — never news** |
| Recent events of fact | National news — **only** for events verified as fact in the last 90 days |

\* Census of ethnicity/religion is a political act in many states — see §8.

**National news is not an acceptable primary source for statistics, governance scores, or economic data**, however recent. Always trace a news-reported figure to its originating dataset.

**In-culture note (cohesion):** for `society.cohesion` the right instrument is citizen self-report from the region's *own* barometer. This deliberately raises the in-culture sourcing share in the one section where it should dominate — consistent with the Africa & Asia source-library principle (prefer the source where the region writes about itself; Western think tanks for triangulation only).

---

## 7. The two cohesions — do **NOT** conflate

These are different objects. Keeping them apart is part of the fix.

- **Elite cohesion** (intra-power-bloc unity — does the coalition hold?) → **stays in `political.stabilityDrivers`**, where it already lives.
- **Social cohesion** (population-wide interpersonal & institutional trust, social capital) → **new: `society.cohesion`.**

Conflating them is part of what currently hides the social layer behind the political one.

---

## 8. Religion-source discipline (named, documented bias)

Religious-demographic counts are the **most politically weaponised numbers** in a country file. Census of religion is itself a political act — e.g. Lebanon (no official national census since 1932), Nigeria (religion omitted from recent censuses), and contested or instrumentalised counts in Sudan, Côte d'Ivoire, and elsewhere. So in `society.religion`:

- **Name each source AND its known bias** (in `desc` and, where it matters, inline). This is the project's "named, chosen bias over invisible statistical bias" rule, applied where it bites hardest.
- **Where the count is contested or suppressed, say so** and present contested figures **as contested** (a range, not a point).
- **Round shares** — no false precision on numbers that are themselves political.
- **Distinguish nominal adherence from lived/syncretic practice.** The official label of a place and its living religious texture are never the same (folk, indigenous, and syncretic practice under a single census label).
- **Record political salience** — how far religion structures authority, allegiance, and daily life (parallel religious authority such as Sufi brotherhoods; prosperity-gospel political mobilisation; *or* high adherence with low political salience). Low salience is a finding, not an absence.

---

## 9. Cross-cutting vs reinforcing cleavages (`society.composition` discipline)

List the groups, then **name the geometry** — this is the analytical core of the section:

- **Cross-cutting** — memberships don't predict each other (people split one way on religion, another on language or class). Tends to **defuse** conflict.
- **Reinforcing** — cleavages stack along one line (region = ethnicity = religion = wealth). Tends to **inflame**.

Sourcing rule: the **composition figures are Fact** (census / survey). The **cross-cutting / reinforcing judgment is Interpretation** — tag it as `Interpretation` or cite an analyst who makes it. Do not present the geometry as raw fact.

---

## 9b. Political anchors — current-composition discipline

A small, fixed set of facts must reflect the present, not the source-average — and they run on **two clocks**:

- **Event-driven anchors** — head of state; head of government; government type (majority / minority / coalition); current seat composition; any leadership or government change — gate on the authoritative **LIVE** standings/electoral page **verified on the run date**. A source is **disqualified if it predates the most recent composition-changing event**, however recent its publication date. (Worked example: Canada's 13 April 2026 by-election majority — any composition source predating that event is disqualified, no matter how recently it was published; only the live standings page verified on the run date reflects the current House.)
- **Structural anchors** — legislature size; the fixed election calendar (date of last election and next expected); constitutional basics — keep an ordinary loose recency gate.

Never infer either kind from older macro or governance reports. These are the facts most likely to be stale and most damaging when wrong — the event-driven ones get a live-source-on-run-date check, not a date window and not a judgement call.

---

## 9c. Territory disciplines (physical-base blocks)

Four disciplines govern the `territory` peer — they are what stop the block becoming a doom-catalogue or a resource-inventory:

- **Exposure–capacity pairing.** Never state a physical exposure without the capacity to act on it. The project's spine — *knowledge isn't the constraint, capacity is* — becomes local here: report the hazard AND the fiscal/infrastructural/institutional capacity to meet it, and name the gap.
- **Distributional lens.** Not "the country is exposed" but WHO inside the country is exposed vs who can afford the defence, or who is served vs who is stranded — the cleavage-geometry move (§9) applied to physical risk and throughput.
- **Scenario-and-horizon binding.** Stricter than §12 year-binding: a climate projection without BOTH its emissions scenario AND its time horizon is void. "+4°C" alone is noise.
- **Demonstrated over declared.** For `territory.transition` (and metabolism), a pledged target is not an outcome — report the delivered emissions path against the pledge and name the gap. Climate Action Tracker is the PRIMARY instrument.

**Overlap rule — do NOT conflate (as §7 for the two cohesions):**
- *Endowment, not industry:* what is physically in the territory (incl. undeveloped/stranded) is
  `territory`; what is extracted, valued, traded is `economy`.
- *Physical hazard, not strategic contest:* the warming and the thaw are `territory`; the Arctic (or any frontier) as a military/sovereignty theatre stays in `security`.
- *Metabolism, not export-vulnerability:* the country's own physical energy/food/water throughput is `territory.metabolism`; energy-as-someone's-balance-sheet-risk is `economy`.
- *Capacity as a lens, not a ledger:* `territory` names the exposure-capacity gap and USES fiscal facts to weigh it; it does not restate the deficit numbers that belong to `economy`.

---

## 9d. Capacity discipline (can the state DO)

`capacity` describes whether the state can build, permit, deliver, process — present-state and sourceable, the register's spine-level blind spot. NOT what the country has (`economy`) or who benefits (`society`) — it is whether intent becomes built fact. Keep it present-state: permitting timelines, delivery record, productivity, internal barriers, value-add processing built vs raw exported are all current, measurable facts. Forward-looking "will it build X" belongs to the trajectory layer, not here.

---

## 10. Fact vs. Interpretation

Every source entry is `citationType: Fact` or `citationType: Interpretation`, no exception.

- **Fact** — the cited source is the *primary author* of the data/event (Statistics [Country] published the GDP figure; the UN published the treaty text; ACLED recorded the incident).
- **Interpretation** — the source analyses, summarises, or forecasts data it did not originate (a think-tank stability report; a business-sentiment survey; a news editorial).

**Society note:** a barometer cited for **its own survey result** ("32% reported trusting most people,Afrobarometer Round 9 (2024)") is **Fact** — the barometer is the primary author of that datum. The *same* barometer used to characterise a *trend* is Interpretation. **Cleavage geometry and salience judgments are Interpretation.**

Target **≥ 70% Fact per section**. The website renders Interpretation with a dotted underline; getting the classification right matters.

---

## 11. Source schema — all eight fields required

No "where available" escape hatches.

```yaml
- id: short-slug          # lowercase, alphanumeric, hyphens only; e.g. afrobarometer-r9
  name: "Full Publication Name"   # in the source's own official language(s), as published — never translated (see title-language rule below)
  url: "https://exact-url-to-the-specific-page-or-document"
  desc: "Roughly 20–30 words: what the source IS — kind, coverage domain, authoritative status, any bias or reservation. NOT the specific numbers or claims."
  publicationDate: "YYYY-MM-DD"   # first of month if only month known; YYYY-01-01 if only year known
  accessDate: "YYYY-MM-DD"        # date you opened and verified the URL
  confidence: High | Med | Low
  citationType: Fact | Interpretation
```

**Source-description discipline.** `desc` states what the source *is* — its scope, role, authoritative status — in roughly 20 to 30 words. It names the kind of source (national inventory report, live standings page, court ruling, official assessment), its coverage domain, and any bias or reservation. It does **not** state the specific numbers or claims the prose will draw from it. Factual claims live in the prose, cited to the source ID. **Diagnostic test:** if a fact in the source `desc` could be silently edited to a new value while the prose still cites the ID unchanged, the fact does not belong in `desc` — it is a claim, and claims live in prose only. *(This supersedes the earlier "name the specific datum" rule.)*

**Source titles in the source's own language(s) — never translated.** A source's title is a proper name in its own language. It is cited in the source's own official language(s), as published — never translated by the report itself. The rule applies to sources in every language, not just English/French: French, English, Russian, Chinese, Korean, Arabic, Kiswahili, Spanish, and any other. The reason is practical: a reader wanting to find the source (in a search engine, a library catalogue, or an artificial-intelligence query) needs the actual title as published. A translated title breaks findability and, in artificial-intelligence-mediated search, risks returning something entirely different that merely looks plausible.

The rules by publication case:

- **Published bilingually or multilingually** (many Canadian federal sources, most international organizations, European Union institutions): each language version of the report cites the official title in its own language.
- **Published in only one language:** the report in any other language cites the original title verbatim, in its original language and script, and provides a translation of the title inside the source's `desc` field.
- **Non-Latin script:** cite the title in the original script; a transliteration may be added in the `desc` field alongside the translation for accessibility.
- **Never fabricate a title** in a language the source does not publish in. If the source does not have an official title in the reader's language, we do not invent one.

The `desc` translation-and-transliteration is descriptive metadata about the source's identity, not a claim drawn from the source (the source-description discipline above still applies to factual content).

**Bilingual landing-page exception (URLs).** Deep links remain the rule; but where the document itself is language-locked (separate English and French files, typically PDFs), the source URL may deliberately point to the official landing page that offers both languages instead of one file — the reader keeps the language choice. Mark such a source `landingPage: true` in the registry so the validator accepts the choice as deliberate rather than flagging a generic homepage.

---

## 12. Time-binding numerics

Every numeric is tied to a specific period. **No exceptions — and this applies to society figures.**

- Correct: `"median age 18.1 in 2024 [un-wpp-2024]"`; `"32% interpersonal trust, Afrobarometer R9 (2024) [afrobarometer-r9]"`
- Wrong: `"median age 18.1 [un-wpp-2024]"`; `"trust is low [afrobarometer-r9]"`

A barometer round (R9 / 2024) counts as its time-binding. If a figure arrives without a year, re-query for the period; don't include it.

---

## 13. Output structure (peers: political · economy · territory · capacity · society · security)

1. `executiveSnapshot` — bullets with inline `[source-id]`, **including society, territory & capacity lines** (see §14)
2. `political.powerStructure`
3. `political.stabilityDrivers` — *(elite cohesion lives here)*
4. `political.shockAbsorbers`
5. **`political.constitutionalSubstrate`** — deep legal bedrock: the allocation of sovereignty and the founding / re-founding instruments that fix it; predating, external, or diminished sovereignties held distinct; STABLE or IN MOTION where apex-court doctrine is reallocating power. Founding text, apex-court rulings, treaty text where applicable — never news.
5b. **`situation`** — the EVENT layer (after political, before economy): threads of verified events that materially changed the country's position, each event dated, sourced, and paired with what it changed. Populated by the dedicated situation pass (§4d), never by Pass B; scanned by Pass Zero-B (§4c); sources harvested in Pass A.
6. `economy.macroReality`
7. `economy.externalVulnerability`
8. `economy.politicalEconomy`
9. **`territory.geography`** — spatial form: distances, habitable-vs-empty, ports, internal connectivity, the periphery (whatever is far, thin, remote, offshore, or non-contiguous relative to the core).
10. **`territory.minerals`** — critical-mineral & subsurface endowment; reserves with year + estimating body; contested counts flagged.
11. **`territory.biosphere`** — forests, freshwater, arable land, fisheries as physical stock + trend.
12. **`territory.climate`** — observed + projected exposure, located geographically; scenario+horizon bound; exposure paired with capacity (§9c).
13. **`territory.metabolism`** — how the country powers/feeds/waters itself as a system; self-sufficiency vs dependence.
14. **`territory.transition`** — decarbonization: emissions trajectory vs pledge; demonstrated over declared; Climate Action Tracker primary.
15. **`capacity.permitting`** — approval timelines; regulatory predictability; proposed-vs-consented-vs-built record.
16. **`capacity.delivery`** — infrastructure delivery record & deficit; cost/schedule performance; administrative & fiscal execution.
17. **`capacity.productivity`** — productivity level & trend; internal barriers between subnational units; value-add processing built vs raw exported.
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

Address it to "the research assistant" — usable with any deep-research-capable tool. Use it for Pass A (sourcing) and Pass B (prose-from-approved-IDs), per §5.

```
You are a geopolitical analyst writing a structured country situation report on [COUNTRY] for an audience of senior decision-makers and analysts. The date is [TODAY'S DATE].

Write a detailed report covering ALL sections below. For every factual claim, include an inline citation to a primary or high-quality secondary source (government publication, central bank, IMF, World Bank, UN body, academic institution, recognised survey instrument, or major international organisation).

SOURCING RULES:
- Do not cite Wikipedia, aggregators, or blogs. If you cannot find a primary or high-quality secondary source for a claim, OMIT the claim — do not write it with weaker sourcing or vague attribution.
- Every numeric figure must be tied to a specific year or date range.
- For each source give: the full URL to the specific document (not the homepage); the publication name; the publication date (YYYY-MM-DD; first of month if only month known; first of year if only year known); the access date (YYYY-MM-DD); and whether the source is the primary author of the data (Fact) or is analysing/interpreting data from elsewhere (Interpretation).
- Source titles in the source's own language(s), never translated. A source's title is a proper name in its own language; cite it as published, in every language pairing (French, English, Russian, Chinese, Korean, Arabic, Kiswahili, Spanish, or any other). If the source is published bilingually or multilingually (many Canadian federal sources, most international organizations, European Union institutions), each language version of the report cites the official title in its own language. If it is published in only one language, cite the original title verbatim — original script included — and provide a translation of the title inside the source's desc field, plus a transliteration for non-Latin scripts. Never fabricate a title in a language the source does not publish in; if the source has no official title in the reader's language, do not invent one. A translated title breaks findability (search engines, library catalogues, artificial-intelligence queries) and, in artificial-intelligence-mediated search, risks returning something entirely different that merely looks plausible.
- Source descriptions describe the source, not the data. desc states what the source IS — its scope, role, and authoritative status — in roughly 20 to 30 words: the kind of source (national inventory report, live standings page, court ruling, official assessment), its coverage domain, and any bias or reservation. It does NOT state the specific numbers or claims the prose will draw from it; factual claims live in the prose, cited to the source ID. Diagnostic test: if a fact in the desc could be silently edited to a new value while the prose still cites the ID unchanged, the fact does not belong in desc — it is a claim, and claims live in prose only. (A title translation or transliteration in desc is descriptive metadata about the source's identity, not a claim.)

WRITING RULES:
- Situating sentences: Every peer opening and every field with a baseline meaning opens with a one-sentence situator before operational detail. The situator is orientation, not history — one short line. If it runs longer than a sentence, it has failed. The five REQUIRED openers are marked "OPENER (required)" in the sections below.
- Acronyms: the first mention of any acronym or initialism — no exceptions — spells the term in full, followed by the abbreviation in parentheses on that first mention only. All subsequent mentions in the same report may use the short form. This applies to every acronym without carve-outs: universal ones (GDP, UN, EU), sectoral ones (LULUCF, RCP, FPIC), organizational ones (IMF, OECD, NATO, WHO), country-specific ones (RCMP, NRCan, StatCan, PBO), and any others. The report is written for a reader who does not work in the sector, and the extra half-line per acronym on first mention is a discipline, not a compromise. ISO-3166 alpha-3 country codes used as internal identifiers (CAN, USA, DEU) are structural markers, not acronyms in prose, and are exempt from this rule when they appear as data-field identifiers; when such a code appears in the reader-facing prose itself, spell it: "Canada," not "CAN."

SOURCE PRIORITY: Statistics [Country], IMF, World Bank, BIS, OECD for macro/finance. V-Dem, Freedom House, WJP for governance. ACLED, SIPRI, ICG for security/conflict. Transparency International for corruption.
Founding constitutional text, apex-court rulings (constitutional and title), the statutory codification of the sovereignty relationship, the legislature's own non-partisan research service, treaty text where applicable, and the official gazette for constitutional and legal matters — never news. WTO / UN Comtrade for trade. UN DESA World Population Prospects and the national census/statistics office for demography. National census, Pew–Templeton Global Religious Futures, and ARDA for ethnic/linguistic/religious composition. For social trust and social capital, use the region's own citizen self-report barometer as the PRIMARY instrument: Afrobarometer, Arab Barometer, Latinobarómetro, Asian Barometer, Eurobarometer, World Values Survey, or Pew. National news only for events of fact in the last 90 days. For current government composition — seat standings, majority/minority/coalition status — use the national legislature's official LIVE seat-standings page (or the national electoral authority) and verify it ON THE RUN DATE; a source is disqualified if it predates the most recent composition-changing event (election, by-election, coalition change, floor-crossing), however recent its publication date; never infer current composition from an economic or governance report. Legislature size and the fixed election calendar may use an ordinary recency gate.

SECTIONS REQUIRED:

GENERATION ORDER — executiveSnapshot is composed LAST. Write every peer section first. The snapshot is derivative: it summarises sections already written and verified, and may introduce no fact that does not already appear, cited, in a section below. Emit executiveSnapshot as the final key in the returned JSON object; the schema is key-addressed and key order carries no meaning.

1. EXECUTIVE SNAPSHOT (13 bullets)
   - Regime type and how power is won/held
   - Current political equilibrium: current seat composition and majority/minority/coalition status — cite the legislature's official LIVE seat-standings page, verified on the run date; a source predating the most recent composition-changing event is disqualified regardless of publication date; opposition; legitimacy
   - Economic model overview (dominant sectors, trade profile)
   - PHYSICAL BASE: the defining geographic fact; the headline resource endowment; the principal climate exposure and whether the country can afford to meet it
   - EXECUTION CAPACITY: whether the state can build/permit/deliver — often the single most binding constraint on acting
   - SOCIAL STRUCTURE: demographic reality (youth bulge or ageing); the principal social cleavage and its geometry (cross-cutting or reinforcing); the population-wide social-trust level
   - Top 3 risks in the next 6-18 months
   - Top 3 watch items in the next 4-12 weeks
   - External dependencies (trade, energy, debt)
   - Security posture (internal stability, border situation)
   - Diplomatic orientation (alliances, key bilateral relationships)
   - Data confidence statement (which sections are high/medium/low confidence)
   - Baseline present-state characterisation (1 sentence — NOT a forecast)

2. POLITICAL ANALYSIS
   - Power structure: State who holds the executive and how it was won. State legislative control separately from executive control — in presidential and semi-presidential systems these diverge, and the report must say plainly whether government is unified or divided. Where the legislature is bicameral, give each chamber's composition separately, each cited to that chamber's own official live standings page verified on the run date (a standings source is disqualified if it predates the most recent composition-changing event, regardless of publication date). Use the country's own vocabulary — "governing coalition," "majority," "divided government" — do not force one system's term onto another's structure. Then: who controls security forces; judicial independence and appointment mechanism; media independence. Anchor to calibration. For each chamber in legislature.chambers, give that chamber's composition cited to its own liveStandingsUrl, verified on the run date; a standings source is disqualified if it predates the most recent composition-changing event, regardless of publication date. Where executive.unifiedDividedApplies is true, state plainly whether government is unified or divided. On powerLocus: where constitutionalOrganIsWherePowerSits is true, the constitutional allocation is the operative allocation and the field proceeds normally. Where it is false, the standings discipline still applies to the formal organ, but the field must locate actual power in powerLocus.actualLocus and say so explicitly — the formal organ is then described as formal, not operative. Where it is UNRESOLVED, state the constitutional allocation and also state plainly that whether operative power tracks it is contested; present the contest, do not resolve it.
   - Stability drivers: what legitimises the regime; armed-forces loyalty; coalition composition; business elite alignment; ELITE COHESION (intra-power-bloc unity — note: this is distinct from social cohesion, which belongs in SOCIETY below).
   - Shock absorbers and accelerants.
   - Constitutional substrate: OPENER (required, one sentence): name the constitutional form — the founding instrument(s) and how sovereignty is allocated (unitary or federal; parliamentary or presidential; one legal tradition or several). Then: the deep legal architecture beneath current politics — the allocation of sovereignty between levels of government; the founding and re-founding instruments that fix that allocation; and the status of any peoples, nations, or territories whose sovereignty predates the central state, sits outside it, or is held in a diminished or non-voting form relative to it. Identify the country's substrate on its own terms. Do not import another country's structure. Where distinct legal substrates coexist, hold them SEPARATELY — do not collapse them or project a single model of consent onto plural governance. State explicitly whether the substrate is STABLE or IN MOTION: where apex-court doctrine is actively reallocating power, that reallocation is present-state fact and belongs in this field, cited to rulings — not deferred to the trajectory layer and not treated as ordinary politics. Sources: the founding text, apex-court rulings, the statutory codification of the sovereignty relationship, treaty text where applicable, official gazette — never news, never advocacy; a legislature's non-partisan research service is admissible as citationType: Interpretation.
     Instances (examples, not the schema — use the ones the country actually has): settler states with treaty and title lineages, held distinct where historic-treaty/modern-agreement and unceded/title-litigated substrates coexist; federal states, where the vertical allocation and the doctrine currently governing it are the substrate; states with a legal re-founding, where later amendments or instruments reset the original terms; states holding unincorporated, overseas, or non-voting territories, where the legal status of those territories and their populations is substrate. Anchor to calibration. Cite ONLY the instruments listed in substrateInstruments, each by its id (with name and year in prose). Where legalOrders.structure is plural, hold each order SEPARATELY and name what each governs; do not treat the statutory order as the real one. Where it is UNRESOLVED, present the competing characterisations as contested.

2b. SITUATION (the EVENT layer — held in the schema, but NOT written in this pass)
   - Emit situation as empty strings for both languages. The situation field is verification-heavy by nature: it holds recent, fast-moving, contested events — exactly the material most likely to be stale or wrong, and least likely to have a settled primary source. A generated draft is a starting list to verify, never content. The field is populated afterward by the dedicated situation pass (§4d), event by event against primary sources, in the thread format defined there. Do not fold event content into the peer sections to compensate — peer sections describe standing conditions only.

3. ECONOMIC ANALYSIS
   - Macro reality: OPENER (required, one sentence): name the dominant economic character before any numbers — the shape of production (primary / manufacturing / services), what the economy lives on, whether it is diversified or concentrated on a few sectors. Then: GDP growth, sector performance, fiscal position (deficit %, debt/GDP), monetary policy, inflation, credit rating — specific figures and years.
   - External vulnerability: export/import profile by value and commodity; partner concentration; sovereign debt holders; IMF program status; sanctions exposure.
   - Political economy: who benefits from the current model; business-elite structure; reforms technically necessary vs politically possible.

4. TERRITORY (describe the physical body of the country ON ITS OWN TERMS, not merely a risk to assets or an input to trade. Throughout: PAIR every exposure with the capacity to act on it and name the gap; LOCATE effects geographically — who inside the country is exposed or served; BIND every projection to its emissions scenario AND horizon; report DEMONSTRATED over DECLARED. Neither doom-catalogue nor techno-triumph.)
   - OPENER (required): the territory peer opens — as the first sentence of territory.geography — with one
     sentence for the country as a whole: landlocked / coastal / island / archipelago / continent /
     peninsula; mountainous / flat / diversified; geographically isolated or embedded; who the neighbours
     are.
   - Geography: the physical arrangement the country must overcome to function as one country — land area and internal distances; habitable vs empty land; coastlines and ports; internal connectivity (road, rail, grid, broadband); the periphery, as identified in calibration (periphery.value). For large or fragmented states this is often the central fact, not backdrop. Distinct from the border-security question (SECURITY).
   - Minerals: the critical-mineral and subsurface endowment — what is physically present (reserves and resources, each with year and estimating body named; reserve figures are political — flag disputed or state-controlled counts), including undeveloped and stranded deposits. What the ground HOLDS, distinct from the mining sector's output and exports (ECONOMY).
   - Biosphere: the biological and renewable base — forests, freshwater, arable land, fisheries — as physical stock and its condition/trend (depletion, degradation, resilience), with year and source. Distinct from agricultural/forestry GDP (ECONOMY).
   - Climate: OPENER (required, one sentence): establish the baseline climate type (cold / hot / temperate /
     tropical / arid; high altitude; uniform or dramatically regional) before any warming, exposure, or
     hazard content. Warming is a change; a change needs a baseline. Then: observed and projected physical climate — zones, warming already recorded, and principal hazards (flood, wildfire, drought, heat, sea-level rise, permafrost thaw) LOCATED geographically. Every projection carries its emissions scenario AND horizon. Physical science only. PAIR each exposure with the adaptive capacity to meet it; name who inside the country is exposed vs who can afford the defence.
   - Metabolism: how the country physically powers, feeds, and waters itself AS A SYSTEM — energy, food, and water flows; self-sufficiency vs dependence in each; the internal networks that distribute them. The country's own throughput, NOT energy-as-export-vulnerability (ECONOMY).
   - Transition: the country's position in decarbonization — energy mix, emissions profile and TRAJECTORY, pledged targets measured against DELIVERED policy. A target is not an outcome; report the actual path against the pledge and name the gap. Climate Action Tracker as the PRIMARY pledge-vs-policy instrument.

5. CAPACITY TO EXECUTE (whether the state can DO: build, permit, deliver, process — present-state and sourceable. NOT what the country has (ECONOMY) or who benefits (SOCIETY), but whether intent becomes built fact. Where "knowledge isn't the constraint, capacity is" becomes a measured field.) Anchor to calibration. Where executionRegime.publishedApprovalsRegimeExists is true, capacity.permitting anchors to executionRegime.permittingAuthorityUrl. Where it is false, permitting timelines are NOT the instrument — name the actual binding constraint on execution and measure that instead. Where territorialControl.status is contested, state which territory the capacity measurement covers.
   - Permitting: approval and permitting timelines for major projects; regulatory predictability; the record of projects proposed vs consented vs built.
   - Delivery: infrastructure delivery record and deficit; cost and schedule performance; the state's administrative and fiscal ability to execute at scale.
   - Productivity: productivity level and trend; internal barriers to the movement of goods, labour and capital between subnational units — use the country's own term for barriers between subnational units, as given in subnationalTerm; value-add processing built domestically vs raw material exported for others to process.

6. SOCIETY (describe the society ON ITS OWN TERMS, before and independent of any stability implication; a society is a component of the country in itself, not a risk factor)
   - Demographics: OPENER (required, one very short historical framing sentence): indigenous-continuous / settler-immigrant-built / mixed from the onset / historically closed. Migration numbers depend on this baseline. Then: total population and age structure (median age, youth-bulge or ageing reality); urban/rural split; internal and cross-border migration patterns; fertility/dependency where relevant. All figures tied to a year.
   - Composition: ethnic, linguistic, and religious composition (rounded shares with year and source). State where the principal fault lines run, and EXPLICITLY whether the cleavages are CROSS-CUTTING (membership on one cleavage does not predict membership on another — tends to defuse) or REINFORCING (cleavages stack along the same line — tends to inflame). Name the geometry; do not just list groups.
   - Religion: (a) composition rounded, and the fault line if there is one; (b) lived/syncretic texture — indigenous, folk, and syncretic practice the official label hides; (c) political salience — how far religion structures authority, allegiance, and daily life (e.g. parallel religious authority such as Sufi brotherhoods; prosperity-gospel political mobilisation; or high adherence with low salience). For every religious-composition figure, NAME the source and its known bias, and flag where the count itself is contested or politically suppressed. Round, do not over-precise.
   - Cohesion: population-wide social trust (interpersonal AND institutional), social capital, and how the society sees itself. Use citizen self-report survey data (the region's own barometer / WVS / Pew) as the PRIMARY instrument here — not as a triangulation check. Anchor to calibration. The primary instrument is cohesionInstrument.primaryBarometer. Then, on selfReportReliabilityFlag:
     - unconstrained: report the figures directly.
     - partisan-sorted: respondents answer honestly, but responses track which party holds power rather than stable underlying trust. State this plainly, and report cohort or partisan breakdowns rather than the headline aggregate, which is a systematically distorted artefact.
     - constrained: respondents are not free to answer honestly (repression, preference falsification). Reported institutional trust does not measure trust. State this plainly and do not report the figure at face value.
     - UNRESOLVED: present the reliability question as contested and report the figures with that caveat attached.

7. SECURITY ANALYSIS
   - Internal: armed groups; organised crime; communal violence; terrorism threat level; military strength and loyalty; corruption in security forces; border situation. (May reference the SOCIETY section, but does not replace it.)
   - Diplomacy: treaty alliances; transactional partners; key bilateral relationships; regional flashpoints; multilateral memberships.

8. KEY ACTORS (domestic and external)
   For each: name, interests, resources/capabilities, constraints, likely moves in the next 6-18 months, dealability (High/Medium/Low). Domestic: 5-10. External: 3-5.

9. RISK REGISTER (5-10 risks)
   For each: title, trigger, probability (High/Med/Low), impact (High/Med/Low), time horizon, leading indicators, mitigants.

FORMAT one block per section using ## headers matching these YAML field names, in THIS order:
executiveSnapshot, political.powerStructure, political.stabilityDrivers, political.shockAbsorbers,
political.constitutionalSubstrate, situation, economy.macroReality, economy.externalVulnerability,
economy.politicalEconomy, territory.geography, territory.minerals, territory.biosphere, territory.climate,territory.metabolism, territory.transition, capacity.permitting, capacity.delivery, capacity.productivity, society.demographics, society.composition, society.religion, society.cohesion, security.internal, security.diplomacy, actors.domestic, actors.external, risks. End with a complete ## sources block in YAML, all 8 fields per source: id, name, url, desc, publicationDate, accessDate, confidence, citationType.

DO NOT include any forward-looking extrapolation, scenario, or "where this is heading" content. This report is the PRESENT-STATE layer only. Forward-looking reasoning belongs in a separate trajectory layer with its own contract.
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

Replace every inline citation reference with the matching `[source-id]` from the sources JSON block of
`analysis.yaml`. If a source isn't in the registry yet, add it first.

---

*End of present-state authoring template. The forward-looking layer is governed separately by
`country-report-trajectory-template.md`.*
