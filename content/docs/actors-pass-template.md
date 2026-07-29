# Actors extraction prompt — v1.10

**Country:** {{NAME_EN}} / {{NAME_FR}} ({{CODE}}) · **Run date:** {{TODAY}}

For a rendered country report, produce a structured actors index by extracting entities the report itself named. Two epistemic layers are produced per actor:

- **Layer 1 (extraction):** name, kind, live-actor status, fields cited in, one-sentence current position — all directly derived from the report text. High reliability.
- **Layer 2 (analytical draft):** interests, resources, constraints, likely moves, engagement mode — inferred from the report text and the pattern of how the actor operates in the country's current situation. Lower reliability; will be marked as AI-drafted and rendered collapsed by default.

You may not add actors not named in the report. Layer 2 fields may reason about actors but must stay anchored to what the report says; they may not import knowledge about the country from outside the text.

**This pass is CLOSED-BOOK.** Run it with research/web search off; if search cannot be disabled, do not use it. Do not search, browse, or look anything up — every statement in the output must be traceable to the attached report text. Layer 1 is pure extraction and Layer 2 is anchored inference; neither requires nor permits outside sources.

---

## Input

The full text of a country report as a YAML file (`content/countries/{{CODE}}/analysis.yaml`) containing the following field families:

- `territory_geography_en` / `_fr`, `territory_biosphere_en` / `_fr`, `territory_minerals_en` / `_fr`, `territory_climate_en` / `_fr`, `territory_metabolism_en` / `_fr`, `territory_transition_en` / `_fr`
- `society_demographics_en` / `_fr`, `society_composition_en` / `_fr`, `society_language_en` / `_fr`, `society_religion_en` / `_fr`, `society_wellbeing_en` / `_fr`, `society_cohesion_en` / `_fr`
- `economy_realEconomy_en` / `_fr`, `economy_publicFinances_en` / `_fr`, `economy_externalVulnerability_en` / `_fr`, `economy_politicalEconomy_en` / `_fr`
- `political_powerStructure_en` / `_fr`, `political_rightsAndChecks_en` / `_fr`, `political_stabilityDrivers_en` / `_fr`, `political_shockAbsorbers_en` / `_fr`, `political_constitutionalSubstrate_en` / `_fr`, `political_stateStructure_en` / `_fr`
- `capacity_inheritedTerrain_en` / `_fr`, `capacity_steering_en` / `_fr`, `capacity_approvals_en` / `_fr`, `capacity_delivery_en` / `_fr`, `capacity_publicServices_en` / `_fr`, `capacity_productivity_en` / `_fr`
- `security_posture_en` / `_fr`, `security_internal_en` / `_fr`, `security_military_en` / `_fr`, `security_transnationalExposure_en` / `_fr`, `security_diplomacy_en` / `_fr`
- `situation_en` / `_fr` (threaded JSON: threads with events carrying `date`, `what`, `changed`)

Work from the English fields (`_en`) as the primary text. The French fields (`_fr`) are the same content and may be consulted for disambiguation, but should not be scanned separately.

**The current `actors_domestic_en/fr` and `actors_external_en/fr` fields are NOT input to this extraction.** They represent the prior structured actors field that this extraction pass is intended to replace. Ignore them entirely; they must not influence which actors you extract, aggregate, or characterise. The extraction is anchored exclusively to the six-peer substantive content plus the `situation` field. Reading them would let old-schema thinking leak into the new extraction and would let claims that are not grounded in the report's substantive analysis contaminate the output.

(The former `risks_en/fr` field was removed 2026-07-20; the gap register `capacity_knownAndUnbuilt_*` is likewise NOT input — it is a derivative.)

---

## Layer 1: extraction

### Scan (recall over precision)

Scan every field for named entities. Include:

- Named individuals with a role (Prime Minister X, President Y, party leader Z)
- Named political parties
- Named institutions of the state (central bank, supreme court, ministries, parliamentary offices, national statistics offices, election commissions, budget offices)
- Named subnational governments and their heads
- Named indigenous nations, political territorial organisations, treaty bodies, and named leaders
- Named international bodies (NATO, EU, UN, G7, treaty organisations)
- Named foreign states and their governments
- Named private-sector actors named for policy weight (specific corporations, industry sector groups, major producers)
- Named labour organisations, unions
- Named civil-society, advocacy, or investigative bodies
- Named regulatory or independent bodies (auditor general, parliamentary budget officer, election commission)
- Named commissions of inquiry
- Named military and security services

Include an entity if it is named at least once with a specifiable role. If in doubt, include and let filter step decide.

### Filter (precision)

Exclude entities that fall into these categories:

**(a) Historical-scaffolding-only mentions.** An entity is scaffolding-only if it appears exclusively in a historical clause explaining how the current situation came to be, without any indication it is a current live actor. Example: "the 1866 Civil Code of Lower Canada" is scaffolding, not a live actor. However: the *current* body continuing a historical lineage IS a live actor if named as such. For instance, the "Grand Council of the Crees" as signatory in 1975 is scaffolding, but the "Cree Nation Government" continuing that lineage today is a live actor.

**(b) Illustrative-example mentions.** An entity named as illustration or comparison but not as a fact about this country. Example: "unlike Switzerland's model" in a paragraph about Canada — Switzerland is not a Canadian actor.

**(c) Generic collective mentions without institutional form.** "Voters," "the public," "immigrants," "the elderly" are populations, not actors. Actors have institutional form or named individual identity with a role.

**(d) Bare geographic mentions.** "Ontario" as a place-name is not an actor; "the Government of Ontario" or "Ontario's provincial government" or "Ontario, in its response to Bill C-5" is an actor.

**(e) Sources named for measurement only.** Two related cases fall under this filter:

- **Media citations:** "CBC News reports…" — CBC as citation source is not itself an actor unless named for its policy role (e.g. state broadcaster funding decisions or editorial-independence contests).

- **Measurement and assessment bodies:** organisations named because they measure, rank, or assess the country are NOT actors. Examples: Freedom House, V-Dem, World Justice Project, Transparency International, SIPRI, U.S. Geological Survey, Climate Action Tracker, Canadian Climate Institute, credit rating agencies, ratings and index producers. They produce facts about the country; they do not act in the country's situation.

  **Distinct from membership bodies where the country is a participant.** These ARE actors: IMF (issues Article IV policy advice; country is a member), OECD (peer review and policy positioning; country is a member), NATO, EU, G7, UN. The test is whether the country acts *with* the body (member, participant, counterpart) or is acted *upon* by the body (measured, rated, ranked). Membership bodies stay in as actors; measurement bodies filter out.

  **National statistics offices and audit institutions ARE actors** (state institutions that both act and constrain what their own data can support: a statistics office, an auditor general, a budget office). A body that measures the *country as its subject* is not (a health-data agency reporting on the health system, a ratings agency). Test: is it part of the state apparatus, or an external observer of it? (v1.10, after Statistics Canada resolved IN and the health-data agency OUT.)

**(f) Statutes and legal instruments — including trade AGREEMENTS.** Bill C-5, CUSMA, CPTPP, CETA, section 129 of the Constitution Act — a named legal text or trade agreement is an *instrument* the country wields or operates under, not an actor, even when the country is a party to it. The distinguishing test (v1.10): a standing ORGANISATION or COMMAND with a membership, secretariat or mandate is an actor (NATO, the EU, the G7, the IMF, the OECD, **NORAD** — a binational command); a document, statute or agreement is an instrument (CUSMA, CPTPP, CETA, Bill C-5). NORAD was wrongly listed here as an instrument in v1.9 and is the single most consequential mis-exclusion a country report can make where continental/collective defence runs through such a command — a binational or multilateral command IS an actor.

**(g) A source id is not a prose mention.** A field carrying `[nrcan-critical-minerals-list]` does NOT name Natural Resources Canada as an actor; a bracketed `[source-id]` is a citation, not a mention. An entity qualifies for extraction only where the *prose* names it. `fieldsCitedIn` lists the fields whose prose names the actor — never a field that merely cites a source the actor happens to publish. (v1.10 — otherwise every measurement body cited anywhere becomes a spurious actor.)

### Aggregate

**Aggregate into a category actor when:** several named entities operate in the same institutional register on the same class of issue, and the report references them interchangeably or collectively at some point.

Aggregated categories to consider:
- Multiple First Nations bodies + named individual First Nations → "Indigenous political territorial organisations and named First Nations"
- Multiple named producers in a resource sector → "[sector] sector" (e.g. "oil-and-gas sector")

**Keep atomic when:** the entity carries a distinctive position, or is named individually with different actions attached across fields, or is named as leadership of a category (the Assembly of First Nations as apex is atomic even if a "First Nations bodies" category also exists).

Aggregation is asymmetric: within an aggregated category, always name the specific entities the report actually cited. Never generalise beyond citation.

Do NOT aggregate provinces into a "provinces" bloc; provinces carry distinct positions and stay atomic.

**Do NOT aggregate multilateral bodies into a "multilaterals" or "treaty-bodies" category.** NATO, the G7, the OECD, the EU, Five Eyes, and the IMF each have distinct memberships, mandates, and instruments. Keep them atomic. (Trade agreements such as CETA and CPTPP are instruments, not actors — see filter (f).) Cross-domain presence is surfaced through `fieldsCitedIn`, not by merging distinct bodies.

**Individual policy figures within a state:** if a foreign minister, ambassador, or head of a specific agency is named individually while the state itself is also named as an actor, treat the individual as part of the state actor unless they carry a distinctive position or role that the report highlights separately. Example: Trump as US President is not a separate actor from the "United States (Trump administration)" — merge. But a named cabinet minister with a specific policy position that the report characterises as distinct from the administration line would be a distinct actor.

### Layer 1 output structure per actor

```yaml
name: [name or category]
kind: [federal executive | governing party | opposition party | legislature | subnational government | indigenous body | private-sector | state-owned enterprise | labour | civil-society | independent institution | judicial | regulatory | commission of inquiry | security or intelligence service | military | international body | foreign state | other]
liveActorStatus: [current | recently-live | historical-only-excluded]
fieldsCitedIn: [comma-separated field names whose PROSE names the actor, e.g. political.powerStructure, political.stabilityDrivers, economy.realEconomy, situation — never a field that merely cites a source (filter (g))]
currentPosition: >
  One sentence, close paraphrase of what the report says the actor is doing
  or its position. May include a citation or [dot.path] anchor.
```

`governing party` and `state-owned enterprise` were added in v1.10: the party of government is distinct from the executive, and a Crown corporation / sovereign fund is neither private-sector nor a department.

---

## Layer 2: analytical draft

For every actor produced in Layer 1, produce a Layer 2 draft.

**Layer 2 must remain anchored to the report text.** You may reason about the actor's interests, resources, constraints, likely moves, and engagement mode based on how the report describes the actor's actions, position, and constraints — but you may not import knowledge of the country from outside the text. If the report is silent on a Layer 2 dimension, mark that field as `report-silent`.

**Layer 2 requirements (implementation spec §8.1):**

- Layer 2 is `citationType: Interpretation`.
- Layer 2 ANCHORS per §1 of the spec: each draft carries the `[source-id]`s or `[dot.path]` field anchors it reasons from (e.g. `[political.stabilityDrivers]`, an already-cited source id) — inline in the field text and/or in the `anchors` list of the output structure. An anchor must point at a non-empty report field or a source id present in this report's registry; ghost anchors are rejected by the validators. The bare `situation` is a valid FIELD anchor (the event layer has no peer prefix — it is the one dotless field path, reserved; v1.9).
- Layer 2 renders COLLAPSED by default and visibly labelled AI-drafted / unverified on the site.

### Layer 2 fields

**interests:** one or two sentences describing what the actor is trying to achieve, based on stated positions or observable behaviour in the report. If interests are not derivable from the text, mark as `report-silent`.

**resources:** the actor's capabilities to pursue its interests, as evidenced or implied in the report. Concrete: statutory authority, seats, capital, personnel, standing, jurisdiction, alliances, brand.

**constraints:** what limits the actor's ability to act, as stated or implied in the report. Concrete: political dependencies, structural limitations, oppositions, thin margins, jurisdictional gates.

**likelyMoves:** what the actor is expected to do next in the current situation. Anchored to explicit report signals or clear pattern — not free speculation.

**engagementMode:** describes how the state (or other actors) can relate to this actor. Categories are illustrative, not exhaustive:

- `negotiable / dealable`: standard bargaining counterpart (parties, foreign states, private sector)
- `statutorily-independent`: operates by mandate, not deals (central banks, election commissions in healthy state)
- `judicial-deference`: expected to be respected structurally (constitutional courts)
- `hijack-exposed`: nominally independent but with observable risk of political capture — flag when the report describes such risk or when historical parallel makes it live (e.g. central bank facing political interference threats)
- `veto-holder`: consent or non-obstruction required (indigenous nations with constitutional standing on some decisions, second chambers)
- `executive-subordinate`: an administrative or executive body that executes government policy and holds no independent bargaining position of its own (line departments, delivery and coordinating agencies) — added v1.10, used widely
- `commitment-bound`: not a counterpart the country negotiates with but a standard it is measured against — benchmarks agreed collectively at summit level, then met or missed, not bargained (defence-spending alliances) — added v1.10
- `structurally-bound`: a joint or binational command the country operates *inside* rather than negotiates *with* — the function is conducted through it and the report describes no alternative (binational defence commands such as NORAD) — added v1.10
- `blocked / not-engageable`: hostile or non-recognising counterpart (sanctioned states, insurgent groups)
- `report-silent`: not derivable from the text

The categories are illustrative — forge a new one where none fits, but say so inline ("… — a forged category") and prefer an existing one over a synonym.

**English output** keeps the English token. **French output** renders the label in FRENCH per this table (and translates the justification; translate a forged label into French too) — **nothing in the French actor fields stays in English** (added v1.11, after English tokens were found displaying in the French Canada card; the actor section is a lot of work for something rarely read, so it must not create French clean-up):

| English token | French label |
|---|---|
| `current` (liveActorStatus) | En vigueur |
| `recently-live` (liveActorStatus) | Récemment en vigueur |
| `historical-only-excluded` (liveActorStatus) | Historique (exclu) |
| `report-silent` (any field) | Sans mention dans le rapport |
| `negotiable / dealable` | Négociation / conclusion d'ententes |
| `statutorily-independent` | Indépendance de par la loi |
| `judicial-deference` | Déférence judiciaire |
| `hijack-exposed` | Exposition au détournement |
| `veto-holder` | Pouvoir de veto |
| `executive-subordinate` | Subordination à l'exécutif |
| `commitment-bound` | Lien par engagement |
| `structurally-bound` | Lien structurel |
| `blocked / not-engageable` | Blocage / non-négociable |

Choose the most accurate mode for this actor in the current situation the report describes. If the report describes a *change* in engagement mode (independence contested, capture risk emerging, standing newly asserted), note it. Do not force actors into modes that misrepresent them.

### Output structure per actor — ONE FLAT OBJECT (v1.10)

Emit each actor as a SINGLE flat object: Layer 1 and Layer 2 fields at the same
level, in this key order. Do NOT nest Layer 2 under a `layer2Draft` object and do
NOT rename `currentPosition` — v1.9 emitted a nested `layer2Draft` /
`currentPositionFromReport` shape the site renderer cannot read, and every field
had to be flattened by hand at install. The renderer applies the "AI-drafted,
collapsed, Interpretation" treatment to the Layer 2 fields itself; do not emit
`status` or `citationType` keys per actor.

```yaml
- name: …
  kind: …
  liveActorStatus: …
  currentPosition: >
    One sentence, close paraphrase of the report.
  fieldsCitedIn: [field names whose prose names the actor]
  interests: >
    …
  resources: >
    …
  constraints: >
    …
  likelyMoves: >
    …
  engagementMode: >
    [mode label]. [one sentence justifying the mode from the report text, or
    noting a shift the report describes.] [anchors]
  anchors: [source-ids or dot.path field anchors the draft reasons from]
```

---

## Cross-domain visibility

The purpose of the extraction is to make cross-domain actor presence legible. An entity appearing in one field is a narrow actor; an entity appearing in four fields is a load-bearing actor with cross-cutting weight. Layer 1's `fieldsCitedIn` field carries this. In the output summary at the end, note actors appearing in three or more fields as *cross-cutting*.

---

## Domestic vs external

**Domestic:** actors whose institutional locus is inside the country being reported on. This includes subnational governments, indigenous nations, provincial or state bodies, private-sector actors headquartered in the country, and named individuals in national or subnational roles.

**External:** actors whose institutional locus is outside the country. Includes foreign states, international bodies, foreign-headquartered corporations named as pressure points, and treaty-based multilateral bodies.

A foreign state (e.g. the United States for a Canada report) is external even if it appears in most fields. Its cross-domain presence is itself analytical: an external actor showing up everywhere is a fact about the country's dependency.

---

## Constraints

- Extract only from the text provided. Do not add actors from your knowledge of the country.
- If an actor's role in the country changed recently and both old and new roles appear in the text, cite both. Do not resolve.
- If the report's characterisation of an actor is contested (e.g. "some critics call X illegitimate"), preserve the contested framing; do not simplify.
- If uncertain whether to include an entity as an actor, include in Layer 1 and mark for human review.
- Never fabricate a Layer 2 field. If unstatable from the text, mark `report-silent`.

---

## Output

Return a YAML block with two top-level arrays: `domestic` and `external`. Each entry is ONE FLAT object (Layer 1 + Layer 2 fields at the same level, key order per the structure above — no nested `layer2Draft`, no `currentPositionFromReport`).

**Language.** This pass emits ENGLISH only (`actors_*_en`). The French fields (`actors_*_fr`) are produced as a separate downstream translation step — same structure, same order, anchors and `fieldsCitedIn` copied verbatim, and the engagement-mode label, `liveActorStatus` and `report-silent` **rendered in French per the label table (§engagementMode)** — nothing left in English in the French fields. Do not attempt the French here.

**Self-check before returning:** every Layer 1 actor names in `fieldsCitedIn` the field(s) it was found in, verified against the attached text. Any actor whose `fieldsCitedIn` cannot be filled from the attached text is DROPPED rather than kept — an actor you cannot place in a field is an actor the report did not name.

After the YAML block, produce a summary noting:

- Cross-cutting actors (present in 3+ fields), grouped by kind
- Actors marked for human review, with reason
- Notable aggregations applied
- Any engagement modes flagged as `hijack-exposed` or otherwise non-standard, with brief justification
- Total counts: domestic actors extracted, external actors extracted, actors with `report-silent` on 2 or more Layer 2 fields

---

## Do NOT

- Do not rank actors by importance.
- Do not add risks or forecasts.
- Do not fill fields the report did not populate. If society did not name any labour body, do not add one from general knowledge.
- Do not translate names. Actors keep their name as the report renders them.
- Do not resolve contested characterisations. Preserve them.
- Do not confuse instruments (Bill C-5, CUSMA) with actors (Parliament, the US Trade Representative).
- Do not use the previous `actors_domestic_en/fr` or `actors_external_en/fr` or `risks_en/fr` field content as source material. Extract only from the six-peer substantive fields and `situation`.
