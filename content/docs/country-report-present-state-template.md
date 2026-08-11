# Country Report — Present-State Authoring Template

*Tool-agnostic. Replaces `perplexity-authoring-template.md`.*
*Produces the sourced, verifiable present-state country report (one of two layers).*

> **LAYER: Present-state.** This template produces the sourced, verifiable layer of a country report:
> `territory · society · economy · political order · capacity to deliver · security & diplomacy`, then
> `situation · actors · sources` (the Risk Register was removed 2026-07-20; the gap register capacity.knownAndUnbuilt replaces it).
>
> **Governed by:** `research-quality-bar.md` (present-state layer). Its rejection criteria override any ambiguous behaviour here.
>
> **Companion:** `country-report-trajectory-template.md` is a **separate** template with its **own**
> contract. Nothing forward-looking belongs in *this* file's output. If a claim is about what *could* happen, it is not present-state — it goes in the trajectory layer. That separation is the wall between the two registers; do not blur it.

---

## 0. What changed, and why (orientation — read once)

1. **The 2026-07 rework** (per `country-report-rework-IMPLEMENTATION.md` — decided against external
   country-report reference standards; do not redesign). The report is **34 fields across six peers** (33
   from the rework + `capacity.knownAndUnbuilt`, the gap register, added 2026-07-20 per
   `workorder-gap-register.md`), in
   the locked display order `territory · society · economy · political order · capacity to deliver ·
   security & diplomacy`, followed by the dynamic tail `situation · actors`. Key moves: **TEN
   enforced openers** (heuristic-gated at the apply gate and audit validator), each doing three jobs —
   state, signal, declare depth (§2.1 of the spec; WRITING RULES in §14); an **anchoring capability** for
   derived claims (`[dot.path]` markers naming the already-cited fields a synthesis stands on — ghost
   anchors are hard errors); the **executive snapshot is REMOVED**, replaced by a short derivative
   **Baseline** (the page's only always-visible prose); `situation`, `actors`, the gap register `capacity.knownAndUnbuilt`, the **scorecard**,
   and the **baseline** are **emitted empty by Pass B** and populated by their own dedicated passes from
   the finished report — situation pass, actors pass, and (amendment 2026-07-19) the
   **derivatives pass**, which composes scorecard + baseline AFTER the situation pass installs and its
   peer corrections are approved, the last point at which the report's facts can change; sources carry a
   **`volatility`** axis (freshness, orthogonal to confidence) driving the quarterly refresh worklist.
2. **Six peers on their own terms** (the earlier expansion this rework builds on): `territory`, `capacity`,
   and `society` stand at the same rank and sourcing rigor as the rest — the physical body of the country,
   the state's ability to deliver, and the society as a component of the country in itself, not a risk
   factor. The deep-time `political.constitutionalSubstrate` field holds the legal bedrock beneath current
   politics, distinct substrates held separate.
3. **The template is tool-agnostic.** It was Perplexity-shaped. The durable machinery (two-pass, validator gates, Fact/Interpretation, the source schema, time-binding) must survive a tool swap. Perplexity is now **one option, for sourcing only**.

---

## 1. The peers, and the on-its-own-terms principle

A country is described as six peers, each on its own terms, in the locked display order:

**`territory`** · **`society`** · `economy` · `political order` · **`capacity to deliver`** · `security & diplomacy` — then the dynamic tail `situation` · `actors` (Risk Register removed 2026-07-20)

**Each peer is described *before* and *independent of* any stability implication.** A society, a territory, a capacity to build — each exists whether or not it threatens or serves anything. The register this template replaces demotes three of them: the physical body of the country surfaces only as "border situation" or "energy dependency" — a risk to assets or an input to trade, never the material fact the country IS (`territory` fixes this); the state's ability to build, permit, and deliver has no field at all, though "knowledge isn't the constraint, capacity is" is the whole project's spine (`capacity` fixes this); and society appears only where it is a "problem" (`society` fixes this).

**The anti-pattern this fixes (load-bearing):** when society only appears where it's a "problem," religion and ethnicity surface in some regions' reports only as threats and vanish from others entirely. That reproduces the war/corruption template the project rejects. Therefore:

- **Religion appears in every report**, including where its political salience is low.
- **The absence of a fault line is itself a finding**, stated as one — not an omission.
- Describe the society neutrally and fully first; let `security` and the gap register reference it afterward, not the other way around.

---

## 2. Tool stance (tool-agnostic)

The schema leads; the tool serves. **Durable structure that must survive any tool swap:**

- two-pass workflow (sources → prose),
- validator gates (blocking),
- `Fact` / `Interpretation` tagging,
- the 9-field source schema (incl. `volatility`),
- time-binding of every numeric.

Any deep-research-capable assistant can run the passes. **Perplexity Deep Research remains one option, and only for Pass A (sourcing).** Never let a single tool's default output dictate the schema or section order.

---

## 3. File targets

```
content/countries/[CODE]/analysis.yaml   ← ONE flat file: all sections, both languages
                                            (<section>_<subsection>_<en|fr> keys);
                                            actors/sources as JSON-in-text blocks
```

`[CODE]` = ISO3 (e.g. `BRA`, `SEN`, `CAN`). *(Replaces the earlier split `[code].en/fr/sources/meta.yaml`
proposal — both languages live side by side in one file, which is also what the EN/FR parity check reads.
Peggy proofs FR; EN/FR citation parity required.)*

---

## 4. Standard Operating Procedure

0. Read `research-quality-bar.md` (present-state layer) first.
1. **Pass A — sources only.** Harvest candidate sources covering macro, governance, trade, security,
   **territory** (geography, biosphere, minerals, climate, metabolism, transition), **capacity to deliver**
   (inherited terrain, steering, approvals, delivery, public services, productivity), **and society**
   (demography, composition, language, religion, wellbeing, cohesion). Sourcing tool of your choice.
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

**Storage.** `situation_en` / `situation_fr` hold the threads as JSON-in-text (the same convention as actors): an array of
`{ "thread": "…", "status": "…", "events": [{ "date": "…", "what": "… [source-id]", "changed": "… [source-id]" }], "currentState": "…" }`
(`status` and `currentState` optional — `status` is a short activity label shown beside the thread title, e.g. "ongoing" / "June 2025").
Each language field carries its OWN complete array (monolingual keys — no `_en`/`_fr` suffixes inside the JSON); both languages hold the
same threads in the same order citing the same ids. `date` is the display label, bolded by the renderer. Every event needs at least one
inline `[source-id]` in `what` or `changed` (validators reject uncited events). **Array order is semantic** — threads by recency of last
activity, events chronologically forward; renderers and validators never re-sort. The renderer displays threads natively and falls back
to plain prose for legacy content. A sibling field `situation_lastUpdated` (YYYY-MM-DD) records when the events were last verified —
maintained MANUALLY in Keystatic (the situation layer is the most time-sensitive part of the report) and shown in the section's header
band; the situation pass does not set it.

---

## 5. Two-pass workflow (full rebuild)

Use this for any country whose legacy citations are weak, generic, or not traceable enough to publish.

### Pass A — sources only

Ask the research assistant for a **sources-only output**. No narrative prose in this pass.

Required: one candidate source list covering **macro, governance, trade, security, territory, capacity, and society** — territory across its six sub-domains (geography, biosphere, minerals, climate, metabolism, transition), capacity across its six (inherited terrain, steering, approvals, delivery, public services, productivity), society across its six (demography, composition, language, religion, wellbeing, cohesion); full deep links only, never homepages; all schema fields per source; provisional `id` values; `citationType` set for every source; titles captured in the source's own official language(s) as published — both languages when bilingual, the original title verbatim (original script included, with translation-plus-transliteration in `desc`) when single-language — **never translated** (see §11).

**Harvest is per-element, not per-field.** The elements each field must cover are enumerated in SECTIONS REQUIRED below, and machine-enforced from `scripts/lib/field-elements.cjs` (the source of truth). Every element needs at least one source — a field naming five elements is not covered by one source. An element you cannot source is a HOLE: Pass B can cite only what you harvested, so an unharvested element forces Pass B to declare it unmet and the apply gate bounces the field back for a targeted top-up (slower than harvesting it now). Where an element is genuinely inapplicable to this country (no sovereign external debt, no nuclear force, no IMF program), name it in a gaps note so Pass B can mark it N/A rather than hunt for a nonexistent source. The two anchored-synthesis fields (`capacity.inheritedTerrain`, `security.posture`) need no sources of their own.

**Acceptance rule:** if the source list does not pass the validator after being pasted into the `sources` block, do not proceed to prose.

### Pass B — prose from approved source IDs only

Cite **only** the approved IDs from Pass A, plus the calibration instrument ids named in the prompt (substrate instruments, `calibration-executive-source`, `permitting-authority` — promoted into the registry at apply, equally citable). Any claim that cannot be tied to an approved ID is omitted. If a field cannot be written cleanly from approved sources, write its honest one-line finding and NAME the sourcing gap — never an empty field, never weaker sourcing. An uncitable one-liner then fails the apply gate's citation check by design: that failure triggers a **targeted Pass A extension**, after which only that field is rewritten citing the new sources. The loop is the mechanism; fabricating a citation to pass the gate is the only forbidden exit.

**Coverage map (emit alongside the content as a top-level `coverage` object — validated at the apply gate, then discarded, never written into the report).** For every field except the two anchored syntheses (`capacity.inheritedTerrain`, `security.posture`), map each of that field's elements — the ids in `scripts/lib/field-elements.cjs` — to ONE of: `{"source": "<a source-id you actually cite in THAT field's prose>"}`, meaning the element is discharged by a cited sentence there; OR `{"na": "<one-line reason the element is genuinely inapplicable to this country>"}`. An element left unmapped, or mapped to a source not cited in that field, FAILS the gate and bounces the field back for a targeted Pass A top-up. This is the mechanism that turns a missing element — a credit rating, a monetary stance — into a minute-one gate failure instead of a week-three discovery, and it is why an element Pass A could not source must be declared N/A, never silently dropped. (Escape for a pre-contract re-apply of old content: `apply --skip-coverage`.)

### When a section returns insufficient citations

Do **not** write the claim with weaker sourcing or vague attribution — omit it. Re-run with narrowed scope for that section. If a URL is broken, find an archive copy and add `archiveUrl`. If no credible source exists after a second attempt, mark `# TODO: needs source` and don't publish that content. *A claim without a primary or high-quality secondary source is not a claim — it is noise.*

### Hard gates (blocking)

- **Validator (`npm run validate:country -- content/countries/[CODE]/` single / `npm run validate:countries` all):** FAILS on orphan citations (a `[id]` with no source), homepage URLs, denied low-reliability domains, missing source fields, duplicate source ids, and unparseable JSON-in-text blocks. WARNS (does not fail) on an **orphan source** — a source never cited, reported peer-grouped; event sources are accepted-but-not-required — a **missing situator OPENER**, and undated / untranslated / time-unbound entries.
- **Apply gate (`apply`, before the YAML is written):** additionally HARD-ERRORS on a **missing situator OPENER** on any of the TEN enforced fields, via a heuristic signature check on the field's opening vocabulary. The check is a signature check on state-and-signal vocabulary, not a count of three clauses — a compliant rich-field opener has no visible depth declaration. It equally HARD-ERRORS on any narrative field lacking a citation, on ghost anchors (a `[dot.path]` targeting an empty or missing field — same class as a ghost citation), and on malformed actors / scorecard. Regeneration is cheap at the gate; a missed opener reaching the YAML costs a manual retrofit. EN/FR citation parity — and anchor parity — is a **manual** check, enforced by neither.
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
| **Capacity to deliver** (inherited terrain·steering·approvals·delivery·public services·productivity) | **national statistics office · OECD · auditor-general and evaluation reports · national infrastructure & regulatory bodies · sector permitting authorities · health/education system statistics** |
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

`capacity` describes whether the state can build, permit, deliver, run — present-state and sourceable, the register's spine-level blind spot. NOT what the country has (`economy`) or who benefits (`society`) — it is whether intent becomes built fact. Keep it present-state: approval timelines, delivery record, public-service performance, productivity, internal barriers, value-add processing built vs raw exported are all current, measurable facts. The section is read against `capacity.inheritedTerrain` — the structural denominator — under the mandatory guard: capacity is inherited and distributed, never earned or deserved; a capacity gap is never rendered as a merit gap. Forward-looking "will it build X" belongs to the trajectory layer, not here.

---

## 10. Fact vs. Interpretation

Every source entry is `citationType: Fact` or `citationType: Interpretation`, no exception.

- **Fact** — the cited source is the *primary author* of the data/event (Statistics [Country] published the GDP figure; the UN published the treaty text; ACLED recorded the incident).
- **Interpretation** — the source analyses, summarises, or forecasts data it did not originate (a think-tank stability report; a business-sentiment survey; a news editorial).

**Society note:** a barometer cited for **its own survey result** ("32% reported trusting most people,Afrobarometer Round 9 (2024)") is **Fact** — the barometer is the primary author of that datum. The *same* barometer used to characterise a *trend* is Interpretation. **Cleavage geometry and salience judgments are Interpretation.**

Target **≥ 70% Fact per section**. The website renders Interpretation with a dotted underline; getting the classification right matters.

---

## 11. Source schema — all nine fields required (volatility warn-first during migration)

*TODO(post-migration): once Canada and the US are migrated to the new field set and the volatility
backfill is complete, remove the parenthetical above and promote `volatility` from warning to hard
requirement (both validators + the apply gate) — together with the LEGACY Keystatic declarations.*

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
  volatility: High | Med | Low    # expected rate of change of the fact(s) this source backs — orthogonal to confidence
```

**Volatility axis** (rework §6.2 — warn-on-missing during migration, then required):

| Level | Changes | Refresh | Typical |
|---|---|---|---|
| `High` | ≤ 1 year, or on events | annual / on-event | reserves-with-year, GDP and fiscal figures, seat composition, office-holders, sanctions, program status |
| `Med` | a few years | ~2–3 years | demographic structure, composition shares, productivity trend, memberships |
| `Low` | structural | on major event | constitution, geography, baseline climate type, legal tradition |

Orthogonal to `confidence` — a national-statistics figure is `High` confidence **and** `High` volatility. Never overload `confidence` to signal freshness. Defaults by field: **High** = `territory.minerals`, `economy.*` figures, `political.powerStructure`, `security.posture`, `situation`. **Med** = `society.demographics`, `society.composition`, `capacity.productivity`, `security.diplomacy`. **Low** = `political.constitutionalSubstrate`, `territory.geography`, `territory.climate` baseline.

**Refresh query this enables:** sources where `volatility: High` and `accessDate` older than the tier cadence — the worklist. Each hit points back to its claim via `[source-id]`; update that fact, bump `accessDate`, leave surrounding prose untouched (see `quarterly-refresh-playbook.md`).

**Source-description discipline.** `desc` states what the source *is* — its scope, role, authoritative status — in roughly 20 to 30 words. It names the kind of source (national inventory report, live standings page, court ruling, official assessment), its coverage domain, and any bias or reservation. It does **not** state the specific numbers or claims the prose will draw from it. Factual claims live in the prose, cited to the source ID. **Diagnostic test:** if a fact in the source `desc` could be silently edited to a new value while the prose still cites the ID unchanged, the fact does not belong in `desc` — it is a claim, and claims live in prose only. *(This supersedes the earlier "name the specific datum" rule.)*

**Source titles in the source's own language(s) — never translated.** A source's title is a proper name in its own language. It is cited in the source's own official language(s), as published — never translated by the report itself. The rule applies to sources in every language, not just English/French: French, English, Russian, Chinese, Korean, Arabic, Kiswahili, Spanish, and any other. The reason is practical: a reader wanting to find the source (in a search engine, a library catalogue, or an artificial-intelligence query) needs the actual title as published. A translated title breaks findability and, in artificial-intelligence-mediated search, risks returning something entirely different that merely looks plausible.

The rules by publication case:

- **Published bilingually or multilingually** (many Canadian federal sources, most international organizations, European Union institutions): each language version of the report cites the official title in its own language.
- **Published in only one language:** the report in any other language cites the original title verbatim, in its original language and script, and provides a translation of the title inside the source's `desc` field.
- **Non-Latin script:** cite the title in the original script; a transliteration may be added in the `desc` field alongside the translation for accessibility.
- **Never fabricate a title** in a language the source does not publish in. If the source does not have an official title in the reader's language, we do not invent one.

The `desc` translation-and-transliteration is descriptive metadata about the source's identity, not a claim drawn from the source (the source-description discipline above still applies to factual content).

**Bilingual/multilingual sources — PREFER the landing page (URLs).** Deep links remain the rule for single-language sources. But for a source published in more than one language (many Canadian federal reports, European Union and international bodies), PREFER the official landing page that offers the language choice over a deep link to one language's file. A deep link to a `…eng.pdf` strands the reader on one language; the landing page lets them reach the version in theirs. This is a positive preference, not merely a tolerated exception: the report is bilingual and readers switch languages, so a source URL that cannot follow them is a worse citation than a slightly-less-deep landing page. Mark such a source `landingPage: true` so the validator accepts the choice as deliberate rather than flagging a generic homepage — and do NOT swap an existing `landingPage: true` source for a deep-link PDF. The same flag also covers a **single-purpose data-portal root** — an interactive tool (a wait-times site, a dashboard, a statistical-series portal) whose data lives at the domain root with no stable deep link to a specific figure. Mark it `landingPage: true` for the same reason: the shallow URL is the deliberate, correct citation, not a lazy homepage.

---

## 12. Time-binding numerics

Every numeric is tied to a specific period. **No exceptions — and this applies to society figures.**

- Correct: `"median age 18.1 in 2024 [un-wpp-2024]"`; `"32% interpersonal trust, Afrobarometer R9 (2024) [afrobarometer-r9]"`
- Wrong: `"median age 18.1 [un-wpp-2024]"`; `"trust is low [afrobarometer-r9]"`

A barometer round (R9 / 2024) counts as its time-binding. If a figure arrives without a year, re-query for the period; don't include it.

**Every asserted gap is tied to a duration** (persistence clause, 2026-07-20). Where a field asserts a standing shortfall — a backlog, a deficit against need, an absent capability, an unmet requirement, a barrier not removed — state how long it has stood, or when it was first officially identified, cited, in that sentence or the next.

- Correct: `"deferred maintenance rose from $170 billion in 2017 to $370 billion in 2024 [id]"`; `"identified as a growth constraint in the 2016 review and unresolved at the most recent assessment [id][id]"`
- Wrong: `"a substantial maintenance backlog [id]"`; `"long-standing internal barriers [id]"`

Date from an official or primary identification (audit body, statutory review, government evaluation, national statistics series), not from the earliest advocacy publication naming the problem. Where only advocacy dating exists, say so and flag the source's orientation inline, as the bias rule already requires.

Where the approved sources carry no duration, write the gap without one and name the sourcing gap in the same sentence. An undated gap is a Pass A finding, not a silent omission — Pass A's SOURCING RULES (§14) now require the ORIGIN / first-identification source of every shortfall to be harvested alongside its latest measurement, so a durationless gap means that source was not found and a targeted dating harvest (the since-dates extension) is owed. Prevent it upstream; do not rely on the after-the-fact pass.

**Openers are exempt** — the opener contract requires orientation, not history. An opener that asserts a shortfall states it plainly and undated; the duration binding applies to the detail beneath.

---

## 13. Output structure (34 fields, six peers — display order: territory · society · economy · political order · capacity to deliver · security & diplomacy; dynamic tail: situation · actors)

**Territory** (order: geography → biosphere → minerals → climate → metabolism → transition)
1. **`territory.geography`** [OPENER] — spatial form: distances, habitable-vs-empty, ports, the periphery. Connectivity networks moved to metabolism.
2. **`territory.biosphere`** — forests, freshwater (as stock), arable land, fisheries as physical stock + trend.
3. **`territory.minerals`** — critical-mineral & subsurface endowment; reserves with year + estimating body; contested counts flagged.
4. **`territory.climate`** [OPENER] — baseline type first; observed + projected exposure, located geographically; scenario+horizon bound; exposure paired with capacity (§9c).
5. **`territory.metabolism`** — how the country runs and circulates as a system (energy, food, water, movement, information); absorbs connectivity from geography.
6. **`territory.transition`** — decarbonization: delivered emissions path vs pledge; demonstrated over declared; Climate Action Tracker primary.

**Society** (order: demographics → composition → language → religion → wellbeing → cohesion)
7. **`society.demographics`** [OPENER] — historical framing; population structure; urban/rural; migration. Time-bound.
8. **`society.composition`** — ethnic composition + **cross-cutting vs reinforcing** geometry (§9). Language moved to its own field.
9. **`society.language`** — linguistic composition; lived texture (diglossia, lingua franca, instruction vs home); political salience; named-bias sourcing.
10. **`society.religion`** — composition + fault line; lived/syncretic texture; political salience; bias documented (§8).
11. **`society.wellbeing`** — health & educational OUTCOMES with access gradients (the systems live in capacity.publicServices).
12. **`society.cohesion`** — interpersonal & institutional trust, social capital, national self-conception. Regional barometer as **primary**; reliability flag handled explicitly.

**Economy** (order: realEconomy → publicFinances → externalVulnerability → politicalEconomy)
13. **`economy.realEconomy`** [OPENER] — sectors and what people do for a living; growth; technology-as-sector. (Renamed from macroReality; fiscal/monetary moved out.)
14. **`economy.publicFinances`** — the state's money: balance, debt share, monetary stance, inflation, rating (SIZE of debt here).
15. **`economy.externalVulnerability`** — trade profile; partner concentration; WHO HOLDS the debt; IMF status; sanctions exposure.
16. **`economy.politicalEconomy`** [OPENER] — state–market configuration; who benefits/loses; elite structure; necessary-vs-possible reforms.

**Political Order** (order: powerStructure → rightsAndChecks → stabilityDrivers → shockAbsorbers → constitutionalSubstrate → stateStructure)
17. **`political.powerStructure`** [OPENER] — regime type; executive/legislative control stated separately; live standings on run date; power located where it actually sits. Most volatile field.
18. **`political.rightsAndChecks`** — judicial + media independence; civil liberties; regional instruments preferred, scorer bias named.
19. **`political.stabilityDrivers`** — legitimation; security-force loyalty AND control; coalition; elite cohesion (distinct from social).
20. **`political.shockAbsorbers`** — buffers and accelerants.
21. **`political.constitutionalSubstrate`** [OPENER] — deep legal bedrock; sovereignty allocation; substrates held distinct; STABLE or IN MOTION cited to rulings — never news.
22. **`political.stateStructure`** — unitary/federal; divisions in the country's own term; powers by level; asymmetries.

**Capacity to Deliver** (order: inheritedTerrain → steering → approvals → delivery → publicServices → productivity → knownAndUnbuilt; the seventh is the GAP REGISTER — emitted empty by Pass B, composed by the derivatives pass per known-and-unbuilt-pass-template.md)
23. **`capacity.inheritedTerrain`** [OPENER] — the structural terrain the state works against; ANCHORED synthesis (territory./society./economy.); the denominator for every performance claim; merit-gap guard mandatory.
24. **`capacity.steering`** — governance-as-process; Interpretation, anchored to the observable record.
25. **`capacity.approvals`** — approval/permitting timelines; predictability; proposed-vs-consented-vs-built. (Renamed from permitting.)
26. **`capacity.delivery`** — realised record on infrastructure at scale; cost/schedule performance.
27. **`capacity.publicServices`** — realised record running continuous service systems (health, education, universal services).
28. **`capacity.productivity`** — level & trend; internal barriers; value-add built vs raw exported; innovation capacity.

**Security & Diplomacy** (display order: posture → internal → military → transnationalExposure → diplomacy; posture composed last)
29. **`security.posture`** [OPENER] — overall posture + diplomatic orientation; ANCHORED synthesis of the other four security fields.
30. **`security.internal`** — armed groups; organised crime; communal violence; terrorism; monopoly on force. Military strength moved out.
31. **`security.military`** — force size/structure; spending; domains; bases; nuclear status; project-or-defend. IISS Military Balance reference.
32. **`security.transnationalExposure`** — cross-border flows and non-state entanglements; named-state relations stay in diplomacy.
33. **`security.diplomacy`** — alliances; memberships; disputes; per-relationship texture anchored to hard citable facts.

**Dynamic tail + derivatives**
- **`situation`** — the EVENT layer: threads of verified events, populated by the dedicated situation pass (§4d), never by Pass B; scanned by Pass Zero-B (§4c); sources harvested in Pass A; own manual `situation_lastUpdated`.
- **`actors.domestic` / `actors.external`** — populated by the dedicated two-layer actors pass (implementation spec §8.1), never by Pass B.
- The Risk Register was REMOVED 2026-07-20 (workorder-gap-register.md): the gap register `capacity.knownAndUnbuilt` replaces it, composed by the derivatives pass.
- **`scorecard` + `scorecard_anchors`** — six axes, each value + anchors + rationale (§14 item 10); composed last; Interpretation; volatility High.
- **`baseline`** — the page's only always-visible prose; composed last; derivative; no new facts, no anchors (§14 item 11).
- `sources` — appears once, at the end; every cited source, all schema fields; ghost citations are errors, orphan sources are peer-grouped warnings.

---

## 14. Research-pass prompt (tool-agnostic)

Address it to "the research assistant" — usable with any deep-research-capable tool. Use it for Pass A (sourcing) and Pass B (prose-from-approved-IDs), per §5.

```
You are a geopolitical analyst writing a structured country situation report on [COUNTRY] for an audience of senior decision-makers and analysts. The date is [TODAY'S DATE].

Write a detailed report covering ALL sections below. For every factual claim, include an inline citation to a primary or high-quality secondary source (government publication, central bank, IMF, World Bank, UN body, academic institution, recognised survey instrument, or major international organisation).

SOURCING RULES:
- Do not cite Wikipedia, aggregators, or blogs. If you cannot find a primary or high-quality secondary source for a claim, OMIT the claim — do not write it with weaker sourcing or vague attribution.
- Every numeric figure must be tied to a specific year or date range.
- **Date the ORIGIN of every shortfall, not just its latest measurement.** For each standing shortfall you source — a backlog, a deficit against need, an unmet standard, an absent capability, a barrier not removed, a designated high-risk area — also capture the source that FIRST officially identified it (the originating audit, statutory review, evaluation or designation), not only the most recent report that counts it. The persistence clause (§12) requires the prose to state how long each shortfall has stood; the prose can only cite a duration if the identification source was harvested here. Prefer official/primary identification (audit body, statutory review, government evaluation, national statistics series) over the earliest advocacy publication, and flag advocacy dating inline where that is all that exists. Sourcing only the latest measurement is what forces the gap register into `report-silent` and triggers a separate after-the-fact dating harvest.
- For each source give: the full URL to the specific document (not the homepage); the publication name; the publication date (YYYY-MM-DD; first of month if only month known; first of year if only year known); the access date (YYYY-MM-DD); and whether the source is the primary author of the data (Fact) or is analysing/interpreting data from elsewhere (Interpretation).
- **The URL is a separate verification object from the fact** (fetch-before-cite, applied to citations as it already is to situation events). A verified fact does not verify its link: being confident in a figure — even from several independent pages — is not being confident in the specific URL. Split by who can do what: *the sourcing pass* (e.g. Perplexity) must never construct, complete, or guess a URL to fit a known fact — it cites only a link it actually retrieved, and where it cannot retrieve or confirm a page it flags that source rather than emitting a plausible-looking link (a search-only tool that cannot open an arbitrary URL should say so, not fabricate one). *The acceptance step* — a human, or a fetch-capable tool (Claude Code / WebFetch) — then opens every link to confirm it resolves to the exact document cited before it enters the sources block. The constructed link that merely looks right, *including one taken from a search-result snippet*, is the failure mode. *(Added 2026-07-31 after a constructed BLS link passed on the strength of verified CPI figures — the numbers were right, the URL was never opened.)*
- Source titles in the source's own language(s), never translated. A source's title is a proper name in its own language; cite it as published, in every language pairing (French, English, Russian, Chinese, Korean, Arabic, Kiswahili, Spanish, or any other). If the source is published bilingually or multilingually (many Canadian federal sources, most international organizations, European Union institutions), each language version of the report cites the official title in its own language. If it is published in only one language, cite the original title verbatim — original script included — and provide a translation of the title inside the source's desc field, plus a transliteration for non-Latin scripts. Never fabricate a title in a language the source does not publish in; if the source has no official title in the reader's language, do not invent one. A translated title breaks findability (search engines, library catalogues, artificial-intelligence queries) and, in artificial-intelligence-mediated search, risks returning something entirely different that merely looks plausible. Copy each title VERBATIM from the page you actually opened — never from memory or a search snippet; a title reconstructed instead of copied is how even English titles come out wrong. DEFAULT: `nameFr` = `name`. A different `nameFr` is correct ONLY for a source that genuinely publishes an official French title (bilingual government bodies, NATO, some UN/EU institutions) whose French page you fetched. The audit validator flags a French-looking `nameFr` that differs from an English `name`, so a slipped fabrication surfaces without a hand-sweep.
- Source descriptions describe the source, not the data. desc states what the source IS — its scope, role, and authoritative status — in roughly 20 to 30 words: the kind of source (national inventory report, live standings page, court ruling, official assessment), its coverage domain, and any bias or reservation. It does NOT state the specific numbers or claims the prose will draw from it; factual claims live in the prose, cited to the source ID. Diagnostic test: if a fact in the desc could be silently edited to a new value while the prose still cites the ID unchanged, the fact does not belong in desc — it is a claim, and claims live in prose only. (A title translation or transliteration in desc is descriptive metadata about the source's identity, not a claim.)

WRITING RULES:
- The opener contract: every enforced opener does three jobs, IN ORDER. (1) STATE — the country's shape on this dimension, in one sentence; orientation, not history. (2) SIGNAL — salience AND direction: how central this dimension is to this country, and which way it is moving. (3) DECLARE DEPTH — where the country has little on this dimension, close it honestly in one line and end the field there; where the dimension carries depth, job 3 is discharged by the body itself and produces NO visible words. NEVER write a transition that announces more is coming — no "detail follows", no "detail below", no "as follows", no dash-then-promise of elaboration. Any such phrase is meta-commentary and is always cut. Job 3 produces visible words ONLY in the thin case, where it is the honest one-line close and the field ends there. Thinness is a finding: a country with negligible critical-mineral endowment produces a one-line territory.minerals opener saying so — never an empty field, never a padded paragraph. Length: one to three sentences. Where the dimension is thin, all three jobs collapse into a single sentence — the normal case for a thin field, not a failure. Where the dimension is central to the country, two or three. Never a paragraph: the opener orients, the body carries the load. The TEN enforced openers are marked "OPENER" in the sections below, and they are ENFORCED, not merely requested: the apply gate rejects a field whose opener is missing (a hard error) and the standalone validator flags it (a warning), via a heuristic signature check on the field's opening vocabulary. The first nine are territory.geography (the territory-peer opener), territory.climate, society.demographics, economy.realEconomy, economy.politicalEconomy, political.powerStructure, political.constitutionalSubstrate, capacity.inheritedTerrain, and security.posture — situation has no opener (it is a list of events, not a field with a baseline meaning). The tenth is capacity.knownAndUnbuilt (gap register, 2026-07-20): its opener DECLARES THE DOCUMENTATION BASE the register rests on, and the gate applies only once the derivatives pass composes it (empty = pending, not a violation).
- Anti-padding: no per-section word caps. Never pad a thin section to match a rich one. Every sentence after an opener carries a [source-id] or is cut: no restatement, no meta-commentary, no connective throat-clearing. Thin means SHORT, never EMPTY: all 33 researched fields are required non-empty in both languages (the apply gate rejects empties; only situation/actors, the gap register capacity.knownAndUnbuilt, the scorecard and the baseline are emitted empty, for their dedicated passes). A field the approved sources cannot support gets its honest one-line finding plus a named Pass A gap — not a blank.
- Pointers are not content (added 2026-07-19 — the USA derivatives pass found the protestCapacity axis had no numerator because unrest was "tracked by ACLED" with no figure reported; broadened 2026-07-31 after an "ageing population documented by the CBO" pointer answered demographics' required age-structure element with no number): citing ANY source — tracker, dataset, dashboard, official report, statistical series, or projection — for merely HOLDING or PRODUCING data, without reporting a figure from it, with its year, is a gap wearing a citation. The tell is a pointer verb with no number: "documented / tracked / compiled / reported / maintained / published / assessed / estimated by X [x]". This is not limited to trackers and dashboards; an authoritative report cited without the figure it contains is the same violation. Where a REQUIRED element (e.g. demographics' age structure) is discharged by such a pointer, the element is UNMET. Report the figure with its year, or enter the loop (targeted Pass A top-up + single-field rewrite) — never close a field on a "documented by X" sentence.
- Acronyms: the first mention of any acronym or initialism — no exceptions — spells the term in full, followed by the abbreviation in parentheses on that first mention only. All subsequent mentions in the same report may use the short form. This applies to every acronym without carve-outs: universal ones (GDP, UN, EU), sectoral ones (LULUCF, RCP, FPIC), organizational ones (IMF, OECD, NATO, WHO), country-specific ones (RCMP, NRCan, StatCan, PBO), and any others. The report is written for a reader who does not work in the sector, and the extra half-line per acronym on first mention is a discipline, not a compromise. ISO-3166 alpha-3 country codes used as internal identifiers (CAN, USA, DEU) are structural markers, not acronyms in prose, and are exempt from this rule when they appear as data-field identifiers; when such a code appears in the reader-facing prose itself, spell it: "Canada," not "CAN."

SOURCE PRIORITY: Statistics [Country], IMF, World Bank, BIS, OECD for macro/finance. V-Dem, Freedom House, WJP for governance. ACLED, SIPRI, ICG for security/conflict — and for protest/mobilisation, ACLED event counts and trends harvested as REPORTABLE FIGURES (a deep link to the data, not a citation of the tracker; the scorecard's protestCapacity axis has no numerator without them). Transparency International for corruption.
Founding constitutional text, apex-court rulings (constitutional and title), the statutory codification of the sovereignty relationship, the legislature's own non-partisan research service, treaty text where applicable, and the official gazette for constitutional and legal matters — never news. WTO / UN Comtrade for trade. UN DESA World Population Prospects and the national census/statistics office for demography. National census, Pew–Templeton Global Religious Futures, and ARDA for ethnic/linguistic/religious composition. For social trust and social capital, use the region's own citizen self-report barometer as the PRIMARY instrument: Afrobarometer, Arab Barometer, Latinobarómetro, Asian Barometer, Eurobarometer, World Values Survey, or Pew. National news only for events of fact in the last 90 days. For current government composition — seat standings, majority/minority/coalition status — use the national legislature's official LIVE seat-standings page (or the national electoral authority) and verify it ON THE RUN DATE; a source is disqualified if it predates the most recent composition-changing event (election, by-election, coalition change, floor-crossing), however recent its publication date; never infer current composition from an economic or governance report. Legislature size and the fixed election calendar may use an ordinary recency gate.

SECTIONS REQUIRED:

(The per-field element lists below are the human-readable form of `scripts/lib/field-elements.cjs`, which is the MACHINE source of truth the apply-gate coverage check obeys. Keep the two consistent; make any intended change to the element set in `field-elements.cjs` first, then reflect it here and in country-report-review-checklist.md.)

GENERATION ORDER — the DERIVATIVE items — the SCORECARD (values + anchors + rationales) and the BASELINE — are NOT composed by Pass B: it emits them EMPTY, and the dedicated DERIVATIVES pass composes them after the situation pass has installed and its peer corrections are approved — the last point at which the report's facts can change (amendment 2026-07-19; the original compose-last-within-Pass-B rule left them blind to the verified event layer). Both remain derivative: they summarise the finished report and may introduce no fact that does not already appear, cited, in it. There is NO executive snapshot — its former content lives in the section openers. Within SECURITY, compose posture LAST (it anchors to the other four security fields); within CAPACITY, inheritedTerrain anchors only to territory.*, society.*, economy.* (fields composed before it). The schema is key-addressed and key order carries no meaning.

FORMAT — each field below is a bulleted CHECKLIST. EVERY plain "- " bullet is a REQUIRED element: cover it in that field's prose, or declare it {"na": "<reason>"} in the coverage map (an element covered nowhere and not declared na fails the apply gate). No bullet is optional and none outranks another. Bullets that lead with a CAPS tag — OPENER, BOUNDARY, PLACEMENT, VOCABULARY, VOLATILITY, DISCIPLINE, SOURCING, CITATION, FALLBACK, RESPONSE RECORD, INSTANCES, NAMED-ACTOR RULE, GUARD, ANCHOR, ANCHORED SYNTHESIS, NOTE — are rules on HOW to write the field, WHERE a topic belongs, or WHAT to cite; obey them, but do not treat them as coverage-map elements.

1. TERRITORY (describe the physical body of the country ON ITS OWN TERMS. Order: geography → biosphere → minerals → climate → metabolism → transition. Disciplines throughout the peer: PAIR every exposure with the capacity to act on it and name the gap; LOCATE effects geographically — who inside the country is exposed or served; BIND every projection to its emissions scenario AND horizon; report DEMONSTRATED over DECLARED.)
   - Geography:
     - OPENER (for the country as a whole): landlocked / coastal / island / archipelago / continent / peninsula; mountainous / flat / diversified; geographically isolated or embedded; who the neighbours are.
     - the physical arrangement the country must overcome to function as one country — land area and internal distances
     - habitable vs empty land
     - coastlines and ports
     - the periphery, as identified in calibration (periphery.value)
     - BOUNDARY: internal connectivity (road, rail, grid, broadband) belongs to metabolism, NOT here; distinct from the border-security question (SECURITY).
   - Biosphere:
     - the biological and renewable base — forests, freshwater, arable land, fisheries — as physical stock, with year and source
     - its condition / trend (depletion, degradation, resilience)
     - BOUNDARY: freshwater as STOCK here, its distribution is metabolism; distinct from agricultural / forestry output (ECONOMY).
   - Minerals:
     - the critical-mineral and subsurface endowment — what is physically present (reserves and resources, each with year and estimating body named), including undeveloped and stranded deposits
     - reserve figures are political — flag disputed or state-controlled counts
     - BOUNDARY: what the ground HOLDS, distinct from the mining sector's output and exports (ECONOMY).
   - Climate:
     - OPENER: the baseline climate type (cold / hot / temperate / tropical / arid; high altitude; uniform or dramatically regional), before any warming, exposure, or hazard content — warming is a change, and a change needs a baseline.
     - observed and projected physical climate — zones, warming already recorded, and principal hazards (flood, wildfire, drought, heat, sea-level rise, permafrost thaw) LOCATED geographically
     - every projection carries its emissions scenario AND horizon
     - PAIR each exposure with the adaptive capacity to meet it; name who inside the country is exposed vs who can afford the defence
     - DISCIPLINE: physical science only.
   - Metabolism:
     - how the country physically runs and circulates AS A SYSTEM — energy, food and water flows
     - movement of goods and people within the country
     - the physical communications backbone
     - self-sufficiency vs dependence in each (each such claim cited, never asserted bare), and the networks that carry them (absorbs energy + transport + communications, plus the connectivity networks removed from geography)
     - DISCIPLINE: open directly on the substance — do NOT prefix the field with a scope label ("Scope: …") or a list of the topics to come; that is meta-commentary and is cut.
     - BOUNDARY: circulation WITHIN the country, not export logistics (ports-as-competitiveness → ECONOMY); physical comms infrastructure, not the media ecosystem (→ SOCIETY); throughput, not balance-sheet.
   - Transition:
     - the country's position in decarbonisation — energy mix, emissions profile and DELIVERED path
     - pledged targets measured against delivered policy; name the gap
     - SOURCING: Climate Action Tracker as the PRIMARY pledge-vs-policy instrument.
     - NOTE: "Trajectory" here means delivered emissions path against pledge — present-state fact, not forward extrapolation.

2. SOCIETY (describe the society ON ITS OWN TERMS, before and independent of any stability implication. Religion and language appear in EVERY report; low salience is a finding. Describe neutrally first; security and the gap register reference it after, never the reverse. Order: demographics → composition → language → religion → wellbeing → cohesion.)
   - Demographics:
     - OPENER (kept very short): indigenous-continuous / settler-immigrant-built / mixed from the onset / historically closed — migration numbers depend on this baseline.
     - total population and age structure (median age, youth-bulge or ageing reality)
     - urban / rural split, AND the form of the urbanisation the split conceals — where growth is actually happening (core, periphery, secondary cities), whether built area is outpacing population, and whether it is planned, self-built, or informal by default. The rate is what every source reports; the form is what almost none do. Thin means one line: where urbanisation is slow, formal, or already complete, say so and move on.
     - internal and cross-border migration patterns
     - fertility / dependency where relevant
     - DISCIPLINE: all figures tied to a year.
   - Composition:
     - ethnic composition (rounded shares with year and source)
     - the CLEAVAGE GEOMETRY: whether cleavages across ethnicity, language and religion are CROSS-CUTTING (membership on one cleavage does not predict membership on another — tends to defuse) or REINFORCING (cleavages stack along the same line — tends to inflame)
     - DISCIPLINE: name the geometry, don't just list groups. Shares = Fact; geometry judgment = Interpretation.
     - BOUNDARY: language content lives in its own field below, NOT here.
   - Language:
     - linguistic composition (rounded shares, year, source; flag contested or suppressed counts)
     - the lived texture the census label hides (diglossia, vernacular vs official, lingua franca, language of instruction vs home language)
     - political salience — how far language structures authority, allegiance and access (official-language regime, language law, linguistic nationalism)
     - SOURCING: name each source and its known bias.
   - Religion:
     - composition rounded, and the fault line if there is one
     - lived / syncretic texture — indigenous, folk, and syncretic practice the official label hides
     - political salience — how far religion structures authority, allegiance, and daily life
     - SOURCING: for every religious-composition figure, NAME the source and its known bias, and flag where the count itself is contested or politically suppressed. Round, do not over-precise.
   - Wellbeing:
     - health OUTCOMES — life expectancy, healthy-life expectancy, principal mortality / morbidity drivers, child / maternal mortality where relevant
     - educational OUTCOMES — educational attainment, literacy, skills
     - each with the access gradient
     - BOUNDARY: outcomes only; the systems that produce them go to capacity.publicServices.
   - Cohesion:
     - population-wide social trust (interpersonal AND institutional)
     - social capital
     - how the society sees itself, including national identity and self-conception
     - SOURCING: use citizen self-report survey data (the region's own barometer / WVS / Pew) as the PRIMARY instrument here — not as a triangulation check.
     - ANCHOR: anchored to the Pass Zero calibration (cite ONLY real instrument ids — never a literal [calibration] marker; calibration instruments are promoted into the registry at apply and are citable). The primary instrument is cohesionInstrument.primaryBarometer. Then, on selfReportReliabilityFlag:
       - unconstrained: report the figures directly.
       - partisan-sorted: respondents answer honestly, but responses track which party holds power rather than stable underlying trust. State this plainly, and report cohort or partisan breakdowns rather than the headline aggregate, which is a systematically distorted artefact.
       - constrained: respondents are not free to answer honestly (repression, preference falsification). Reported institutional trust does not measure trust. State this plainly and do not report the figure at face value.
       - UNRESOLVED: present the reliability question as contested and report the figures with that caveat attached.

3. ECONOMIC ANALYSIS (order: realEconomy → publicFinances → externalVulnerability → politicalEconomy. Debt appears in TWO fields by design: SIZE in publicFinances, WHO HOLDS IT in externalVulnerability.)
   - Real economy:
     - OPENER: the dominant economic character, named BEFORE any numbers — the shape of production (primary / manufacturing / services), what the economy lives on, whether it is diversified or concentrated.
     - sectors and what people do for a living
     - growth
     - sector performance
     - technology as a business sector lives here
     - BOUNDARY: fiscal / monetary / debt content belongs to publicFinances, NOT here.
   - Public finances:
     - budget balance (deficit / surplus, % of GDP) — figures with years
     - public debt as a share of the economy — figures with years
     - central-bank / monetary-policy stance
     - inflation — figures with years
     - credit rating
   - External vulnerability:
     - export / import profile by value and commodity
     - partner concentration
     - who holds the sovereign debt
     - International Monetary Fund program status
     - sanctions exposure
   - Political economy:
     - OPENER: the state–market configuration BEFORE any distributional detail — state-directed / mixed / market-led; the role of Crown corporations, state-owned enterprises or sovereign funds where they exist; where the boundary is currently contested.
     - who benefits and who loses under the current model
     - business-elite structure — NAMING the load-bearing entities (largest firms, principal producers of the leading sectors, main labour federations), each cited
     - reforms technically necessary vs politically possible
     - NAMED-ACTOR RULE (added 2026-07-19 after the USA actors pass surfaced a market-led political economy with zero named firms): a nameless "business elite" or producer-less sector is an under-sourced claim — targeted Pass A top-up + single-field rewrite, never the abstraction.

4. POLITICAL ORDER (order: powerStructure → rightsAndChecks → stabilityDrivers → shockAbsorbers → constitutionalSubstrate → stateStructure)
   - Power structure:
     - OPENER: regime type and how power is won and held.
     - who holds the executive and how it was won
     - legislative control, stated SEPARATELY from executive control — in presidential and semi-presidential systems these diverge; say plainly whether government is unified or divided
     - where the legislature is bicameral, each chamber's composition separately, each cited to that chamber's own official live standings page verified on the run date (a standings source is disqualified if it predates the most recent composition-changing event, regardless of publication date)
     - majority / minority / coalition; opposition strength and legitimacy
     - where actual power sits outside the formal organ, locate it explicitly
     - VOCABULARY: use the country's own terms — "governing coalition," "majority," "divided government" — do not force one system's term onto another's structure.
     - BOUNDARY: judicial and media independence belong to rightsAndChecks, NOT here; who controls the security forces belongs to stabilityDrivers.
     - VOLATILITY: the MOST VOLATILE field in the report — dated to run date.
     - ANCHOR: anchored to the Pass Zero calibration (cite ONLY real instrument ids — never a literal [calibration] marker; calibration instruments are promoted into the registry at apply and are citable). For each chamber in legislature.chambers, give that chamber's composition cited to its own liveStandingsUrl, verified on the run date. Where executive.unifiedDividedApplies is true, state plainly whether government is unified or divided. On powerLocus: where constitutionalOrganIsWherePowerSits is true, the constitutional allocation is the operative allocation and the field proceeds normally. Where it is false, the standings discipline still applies to the formal organ, but the field must locate actual power in powerLocus.actualLocus and say so explicitly — the formal organ is then described as formal, not operative. Where it is UNRESOLVED, state the constitutional allocation and also state plainly that whether operative power tracks it is contested; present the contest, do not resolve it.
   - Rights and checks:
     - judicial independence and appointment mechanism
     - media independence and press freedom
     - civil-liberties and human-rights record
     - SOURCING: prefer regional instruments where they exist (same logic as the regional citizen barometer in society.cohesion); court rulings, national human-rights institutions and regional human-rights bodies are primary. Freedom House / Bertelsmann usable with the scorer and its bias named explicitly.
   - Stability drivers:
     - what legitimises the regime
     - armed-forces and security-force loyalty AND WHO CONTROLS THEM
     - coalition composition
     - business elite alignment
     - ELITE COHESION (intra-power-bloc unity)
     - BOUNDARY: elite cohesion is distinct from social cohesion, which belongs in SOCIETY.
   - Shock absorbers:
     - what buffers absorb shocks
     - what accelerants could convert a shock into instability
   - Constitutional substrate:
     - OPENER: name the constitutional form — the founding instrument(s) and how sovereignty is allocated (unitary or federal; parliamentary or presidential; one legal tradition or several).
     - the deep legal architecture beneath current politics — the allocation of sovereignty between levels of government
     - the founding and re-founding instruments that fix that allocation
     - the status of any peoples, nations, or territories whose sovereignty predates the central state, sits outside it, or is held in a diminished or non-voting form relative to it
     - STATE whether the substrate is STABLE or IN MOTION — where apex-court doctrine is actively reallocating power, that reallocation is present-state fact and belongs in this field, cited to rulings; not deferred to the trajectory layer, not treated as ordinary politics
     - DISCIPLINE: identify the country's substrate on its own terms; do not import another country's structure. Where distinct legal substrates coexist, hold them SEPARATELY — do not collapse them or project a single model of consent onto plural governance.
     - SOURCING: the founding text, apex-court rulings, the statutory codification of the sovereignty relationship, treaty text where applicable, official gazette — never news, never advocacy; a legislature's non-partisan research service is admissible as citationType: Interpretation.
     - INSTANCES (examples, not the schema — use the ones the country actually has): settler states with treaty and title lineages, held distinct where historic-treaty/modern-agreement and unceded/title-litigated substrates coexist; federal states, where the vertical allocation and the doctrine currently governing it are the substrate; states with a legal re-founding, where later amendments or instruments reset the original terms; states holding unincorporated, overseas, or non-voting territories, where the legal status of those territories and their populations is substrate.
     - ANCHOR: anchored to the Pass Zero calibration (cite ONLY real instrument ids — never a literal [calibration] marker; calibration instruments are promoted into the registry at apply and are citable). Cite ONLY the instruments listed in substrateInstruments, each by its id (with name and year in prose). Where legalOrders.structure is plural, hold each order SEPARATELY and name what each governs; do not treat the statutory order as the real one. Where it is UNRESOLVED, present the competing characterisations as contested.
     - PLACEMENT: administrative machinery belongs to stateStructure, NOT here.
   - State structure:
     - unitary or federal
     - the administrative divisions named using the country's own term (provinces and territories, Länder, wilayas, oblasts…)
     - which powers sit at which level
     - asymmetries between units
     - PLACEMENT: administrative divisions belong in this field, never alongside Indigenous or predating sovereignty in constitutionalSubstrate.

5. CAPACITY TO DELIVER (whether the state can DO: build, permit, deliver, run — present-state and sourceable. NOT what the country has (ECONOMY) or who benefits (SOCIETY), but whether intent becomes built fact. Order: inheritedTerrain → steering → approvals → delivery → publicServices → productivity.) Anchored to the Pass Zero calibration (cite ONLY real instrument ids — never a literal [calibration] marker; calibration instruments are promoted into the registry at apply and are citable). Where executionRegime.publishedApprovalsRegimeExists is true, capacity.approvals anchors to executionRegime.permittingAuthorityUrl. Where it is false, approval timelines are NOT the instrument — name the actual binding constraint on execution and measure that instead. Where territorialControl.status is contested, state which territory the capacity measurement covers.
   - Inherited terrain:
     - OPENER: the structural terrain the state works against, before any performance claim.
     - geographic and demographic scale
     - resource base
     - colonial / extractive legacy and terms of trade
     - damage from armed conflict fought on its own soil (war destruction, wartime displacement, munitions contamination) — stated plainly even where there is none
     - the inherited education and health base
     - ANCHORED SYNTHESIS: points at facts already cited in territory.*, society.*, economy.* via [dot.path] anchors; introduces NO new sourced facts. It is the denominator for every performance claim in this section.
     - GUARD: capacity is inherited and distributed — by history, colonialism, resource geography, luck — never earned or deserved; a capacity gap is never rendered as a merit gap.
     - GUARD: in a settler or colonised state, colonial dispossession, slavery and forced removal are part of the inherited terrain — they belong to the colonial / extractive legacy element above and are NEVER rendered as absent. The armed-conflict null covers war damage on the territory only, never these.
   - Steering:
     - governance-as-process, distinct from execution — can the government prioritise among competing demands, implement what it announces, build consensus with strategic actors, and learn from policy
     - RESPONSE RECORD (added 2026-07-20 — the first USA gap register came back 12/20 never-attempted, a finding about the report, not the country): the announced-versus-implemented record must span the domains where the report documents shortfalls (delivery, public services, staffing, approvals — never fiscal policy alone); for each, state what response was announced, attempted or budgeted, cited — or state plainly that the approved sources record none. The gap register's class assignment reads its attempt record from this field.
     - CITATION: citationType Interpretation, ANCHORED to the observable record — announced priorities vs implemented ones, auditor-general and evaluation reports, delivered-vs-declared. One to two paragraphs.
   - Approvals:
     - can the state say yes or no to a major project, and how long does that take?
     - approval and permitting timelines for major projects
     - regulatory predictability
     - the record of projects proposed vs consented vs built
     - FALLBACK: where no published approvals regime exists, name and measure the actual binding constraint instead.
   - Delivery:
     - the state's realised record of executing INFRASTRUCTURE AT SCALE, distinct from stated intent
     - infrastructure deficit
     - cost and schedule performance
     - the administrative and fiscal ability to execute capital projects
   - Public services:
     - the state's realised record of running CONTINUOUS public-service systems — health and education systems (staffing, coverage, access, waiting times, quality of provision), and other universal services where relevant
     - BOUNDARY: receives the systems half of society.wellbeing (outcomes stay there).
   - Productivity:
     - productivity level and trend
     - internal barriers to the movement of goods, labour and capital between subnational units — use the country's own term, as given in subnationalTerm
     - value-add processing built domestically vs raw material exported
     - innovation and research capacity
   - Known and unbuilt (GAP REGISTER — held in the schema, but NOT written in this pass): emit capacity.knownAndUnbuilt as empty strings for both languages. Composed by the derivatives pass after the situation pass installs (known-and-unbuilt-pass-template.md): an anchored synthesis of every gap the report itself asserts — asserted / a gap not a condition / internal / open — with opener declaring the documentation base, per-item {gap, anchor, since, class}, and the inherited-capacity denominator guard. Introduces no new sourced fact.

6. SECURITY & DIPLOMACY (display order: posture → internal → military → transnationalExposure → diplomacy; COMPOSE posture LAST — it is an anchored synthesis of the other four.)
   - Posture:
     - OPENER: overall security posture (defensive / expeditionary / neutral / alliance-dependent) and diplomatic orientation (aligned / non-aligned / hedging).
     - ANCHORED SYNTHESIS: via [dot.path] anchors to security.internal / security.military / security.transnationalExposure / security.diplomacy; introduces no facts of its own. Composed LAST.
   - Internal:
     - armed groups
     - organised crime, trafficking, illicit finance
     - communal violence
     - terrorism threat level
     - corruption in security forces — name the auditing body and whether it is independent of the forces; where the only sources are the forces' own, say so
     - border situation
     - the state's monopoly on force and territorial control across the whole territory
     - BOUNDARY: military strength belongs to military, NOT here. (May reference the SOCIETY section, but does not replace it.)
   - Military:
     - force size and structure
     - defence spending in money and as a share of the economy
     - domains — land, sea, air, cyber, space
     - conscription vs volunteer
     - foreign bases hosted or held
     - nuclear status
     - whether the force can project or only defend
     - SOURCING: reference instrument — International Institute for Strategic Studies, Military Balance.
     - BOUNDARY: capability here; loyalty and control remain in political.stabilityDrivers.
   - Transnational exposure:
     - cross-border flows and non-state entanglements — trafficking, illicit finance, cross-border crime, foreign interference and disinformation, migration pressure, shared-resource frictions
     - BOUNDARY: relationships with named states → diplomacy; flows and non-state entanglements → here; territorial disputes stay in diplomacy.
   - Diplomacy:
     - treaty alliances
     - multilateral memberships
     - transactional partners
     - territorial disputes
     - regional flashpoints
     - PER-RELATIONSHIP TEXTURE for key bilateral relationships, built on hard citable facts (treaty texts, trade volumes by partner, basing agreements and troop presence, United Nations voting alignment, energy dependence, state visits) — the character of a relationship is Interpretation ANCHORED to those facts
     - NAMED-ACTOR RULE (added 2026-07-19 after the USA actors pass surfaced an "alliance network" with no named ally): an alliance system is its members — name the alliances and key allies, each cited to treaty text or membership record; a nameless network is an under-sourced claim — targeted Pass A top-up + single-field rewrite, never the abstraction.

7. SITUATION (the EVENT layer — held in the schema, but NOT written in this pass)
   - Emit situation as empty strings for both languages. The situation field is verification-heavy by nature: it holds recent, fast-moving, contested events — exactly the material most likely to be stale or wrong, and least likely to have a settled primary source. A generated draft is a starting list to verify, never content. The field is populated afterward by the dedicated situation pass (§4d), event by event against primary sources, in the thread format defined there. Do not fold event content into the peer sections to compensate — peer sections describe standing conditions only.

8. KEY ACTORS (held in the schema, but NOT written in this pass)
   - Emit actors.domestic and actors.external as empty arrays for both languages. Actors are populated afterward by the dedicated two-layer actors pass (implementation spec §8.1), which EXTRACTS Layer 1 from this finished report and drafts Layer 2 analytically, anchored to the report's fields and sources.

9. RISK REGISTER — REMOVED (2026-07-20, workorder-gap-register.md)
   The risks field no longer exists in the schema. Its replacement is the GAP REGISTER, capacity.knownAndUnbuilt (see the Capacity section above): a cited index of gaps the report itself asserts, composed by the derivatives pass. The former Layer-2 framing (trigger, horizon, probability × impact, mitigants) and the aggregate risk level remain parked with the correlation study.

10. SCORECARD (held in the schema, but NOT written in this pass — amendment 2026-07-19)
   Emit all six axis values as empty strings and scorecardAnchors as an empty object. The scorecard is composed by the dedicated DERIVATIVES pass after the situation pass installs. Its contract (enforced there and at install): six axes — eliteCohesion, socialCohesion, securityLoyalty, economicPressure, protestCapacity, institutionalResilience; each carries a value (High | Med | Low); anchors — the [source-id]s (or dot field paths) of already-cited claims the rating summarises (>= 1; must resolve in the report's sources registry / fields); rationale_en + rationale_fr — one line: why those facts produce this value. All six are citationType: Interpretation, volatility: High, and DERIVATIVE — they introduce no fact not already cited in the report, and they read the WHOLE report including the situation threads. Cross-peer by design — rendered at page level, not inside a section; the page hides the block while the scorecard is empty.

11. BASELINE (held in the schema, but NOT written in this pass — amendment 2026-07-19)
   Emit baseline as empty strings for both languages; the page renders nothing there by design (never back-fill). The baseline is composed by the dedicated DERIVATIVES pass after the situation pass installs. Its contract (enforced there and at install): a short paragraph (not one line, not long), in both languages: the page's only always-visible prose — enough for a reader to decide whether to open this country. Present-state characterisation, never a forecast. It introduces no fact not already cited in the report and carries NO new sources; any citation markers must be ids already present in the report. It carries no [dot.path] anchors. Where the situation field holds material events, the baseline reflects them. Name it Baseline, never "Outlook."

FORMAT one block per section using ## headers matching these YAML field names, in THIS order:
territory.geography, territory.biosphere, territory.minerals, territory.climate, territory.metabolism, territory.transition, society.demographics, society.composition, society.language, society.religion, society.wellbeing, society.cohesion, economy.realEconomy, economy.publicFinances, economy.externalVulnerability, economy.politicalEconomy, political.powerStructure, political.rightsAndChecks, political.stabilityDrivers, political.shockAbsorbers, political.constitutionalSubstrate, political.stateStructure, capacity.inheritedTerrain, capacity.steering, capacity.approvals, capacity.delivery, capacity.publicServices, capacity.productivity, capacity.knownAndUnbuilt (empty), security.internal, security.military, security.transnationalExposure, security.diplomacy, security.posture, situation (empty), actors.domestic (empty), actors.external (empty), scorecard (empty), scorecardAnchors (empty), baseline (empty). End with a complete ## sources block in YAML, all fields per source: id, name, url, desc, publicationDate, accessDate, confidence, citationType (see §11; volatility joins the schema per implementation spec §6).

DO NOT include any forward-looking extrapolation, scenario, or "where this is heading" content. This report is the PRESENT-STATE layer only. Forward-looking reasoning belongs in a separate trajectory layer with its own contract.
```

---

## 15. Mapping to YAML

| Report section | YAML field |
|---|---|
| Geography | `territory.geography` |
| Biosphere | `territory.biosphere` |
| Minerals | `territory.minerals` |
| Climate | `territory.climate` |
| Metabolism | `territory.metabolism` |
| Transition | `territory.transition` |
| Demographics | `society.demographics` |
| Composition | `society.composition` |
| **Language** | **`society.language`** *(new)* |
| Religion | `society.religion` |
| **Wellbeing** | **`society.wellbeing`** *(new)* |
| Cohesion (social trust) | `society.cohesion` |
| Real economy | `economy.realEconomy` *(renamed from `economy.macroReality`)* |
| **Public finances** | **`economy.publicFinances`** *(new)* |
| External vulnerability | `economy.externalVulnerability` |
| Political economy | `economy.politicalEconomy` |
| Power structure | `political.powerStructure` |
| **Rights and checks** | **`political.rightsAndChecks`** *(new)* |
| Stability drivers (incl. elite cohesion) | `political.stabilityDrivers` |
| Shock absorbers | `political.shockAbsorbers` |
| Constitutional substrate | `political.constitutionalSubstrate` |
| **State structure** | **`political.stateStructure`** *(new)* |
| **Inherited terrain** | **`capacity.inheritedTerrain`** *(new)* |
| **Steering** | **`capacity.steering`** *(new)* |
| Approvals | `capacity.approvals` *(renamed from `capacity.permitting`)* |
| Delivery | `capacity.delivery` |
| **Public services** | **`capacity.publicServices`** *(new)* |
| Productivity | `capacity.productivity` |
| Known and unbuilt (gap register) | `capacity.knownAndUnbuilt` |
| **Posture** | **`security.posture`** *(new)* |
| Internal security | `security.internal` |
| **Military** | **`security.military`** *(new)* |
| **Transnational exposure** | **`security.transnationalExposure`** *(new)* |
| Diplomacy | `security.diplomacy` |
| Situation (dedicated pass) | `situation` |
| Domestic actors (dedicated pass) | `actors.domestic[]` |
| External actors (dedicated pass) | `actors.external[]` |

| Scorecard anchors | `scorecard_anchors` |
| Baseline | `baseline` |

YAML keys are flat underscores per storage convention: `territory_geography_en`, `economy_realEconomy_fr`, `capacity_inheritedTerrain_en`, `baseline_en`, etc. Legacy keys (`economy_macroReality_*`, `capacity_permitting_*`, `executiveSnapshot_*`) remain readable on countries not yet regenerated; new generation never writes them.

Replace every inline citation reference with the matching `[source-id]` from the sources JSON block of
`analysis.yaml`. If a source isn't in the registry yet, add it first.

---

*End of present-state authoring template. The forward-looking layer is governed separately by
`country-report-trajectory-template.md`.*
