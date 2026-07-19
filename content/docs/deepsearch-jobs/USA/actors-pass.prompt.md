# Actors extraction prompt — v1.8

**Country:** United States / États-Unis (USA) · **Run date:** 2026-07-19

For a rendered country report, produce a structured actors index by extracting entities the report itself named. Two epistemic layers are produced per actor:

- **Layer 1 (extraction):** name, kind, live-actor status, fields cited in, one-sentence current position — all directly derived from the report text. High reliability.
- **Layer 2 (analytical draft):** interests, resources, constraints, likely moves, engagement mode — inferred from the report text and the pattern of how the actor operates in the country's current situation. Lower reliability; will be marked as AI-drafted and rendered collapsed by default.

You may not add actors not named in the report. Layer 2 fields may reason about actors but must stay anchored to what the report says; they may not import knowledge about the country from outside the text.

**This pass is CLOSED-BOOK.** Run it with research/web search off; if search cannot be disabled, do not use it. Do not search, browse, or look anything up — every statement in the output must be traceable to the attached report text. Layer 1 is pure extraction and Layer 2 is anchored inference; neither requires nor permits outside sources.

---

## Input

The full text of a country report as a YAML file (`content/countries/USA/analysis.yaml`) containing the following field families:

- `territory_geography_en` / `_fr`, `territory_biosphere_en` / `_fr`, `territory_minerals_en` / `_fr`, `territory_climate_en` / `_fr`, `territory_metabolism_en` / `_fr`, `territory_transition_en` / `_fr`
- `society_demographics_en` / `_fr`, `society_composition_en` / `_fr`, `society_language_en` / `_fr`, `society_religion_en` / `_fr`, `society_wellbeing_en` / `_fr`, `society_cohesion_en` / `_fr`
- `economy_realEconomy_en` / `_fr`, `economy_publicFinances_en` / `_fr`, `economy_externalVulnerability_en` / `_fr`, `economy_politicalEconomy_en` / `_fr`
- `political_powerStructure_en` / `_fr`, `political_rightsAndChecks_en` / `_fr`, `political_stabilityDrivers_en` / `_fr`, `political_shockAbsorbers_en` / `_fr`, `political_constitutionalSubstrate_en` / `_fr`, `political_stateStructure_en` / `_fr`
- `capacity_inheritedTerrain_en` / `_fr`, `capacity_steering_en` / `_fr`, `capacity_approvals_en` / `_fr`, `capacity_delivery_en` / `_fr`, `capacity_publicServices_en` / `_fr`, `capacity_productivity_en` / `_fr`
- `security_posture_en` / `_fr`, `security_internal_en` / `_fr`, `security_military_en` / `_fr`, `security_transnationalExposure_en` / `_fr`, `security_diplomacy_en` / `_fr`
- `situation_en` / `_fr` (threaded JSON: threads with events carrying `date`, `what`, `changed`)

Work from the English fields (`_en`) as the primary text. The French fields (`_fr`) are the same content and may be consulted for disambiguation, but should not be scanned separately.

**The current `actors_domestic_en/fr` and `actors_external_en/fr` fields are NOT input to this extraction.** They represent the prior structured actors field that this extraction pass is intended to replace. Ignore them entirely; they must not influence which actors you extract, aggregate, or characterise. The extraction is anchored exclusively to the six-peer substantive content plus the `situation` field. Reading them would let old-schema thinking leak into the new extraction and would let claims that are not grounded in the report's substantive analysis contaminate the output.

Same rule for the existing `risks_en/fr` field: it is not input. Do not use it to identify actors.

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

  **Distinct from membership bodies where the country is a participant.** These ARE actors: IMF (issues Article IV policy advice; country is a member), OECD (peer review and policy positioning; country is a member), NATO, EU, G7, CPTPP, CETA, UN. The test is whether the country acts *with* the body (member, participant, counterpart) or is acted *upon* by the body (measured, rated, ranked). Membership bodies stay in as actors; measurement bodies filter out.

**(f) Statutes and legal instruments.** Bill C-5, CUSMA, NORAD, section 129 of the Constitution Act — these are instruments, not actors. Exception: named international bodies operating under a treaty ARE actors (NATO, the EU, the G7).

### Aggregate

**Aggregate into a category actor when:** several named entities operate in the same institutional register on the same class of issue, and the report references them interchangeably or collectively at some point.

Aggregated categories to consider:
- Multiple First Nations bodies + named individual First Nations → "Indigenous political territorial organisations and named First Nations"
- Multiple named producers in a resource sector → "[sector] sector" (e.g. "oil-and-gas sector")

**Keep atomic when:** the entity carries a distinctive position, or is named individually with different actions attached across fields, or is named as leadership of a category (the Assembly of First Nations as apex is atomic even if a "First Nations bodies" category also exists).

Aggregation is asymmetric: within an aggregated category, always name the specific entities the report actually cited. Never generalise beyond citation.

Do NOT aggregate provinces into a "provinces" bloc; provinces carry distinct positions and stay atomic.

**Do NOT aggregate multilateral bodies into a "multilaterals" or "treaty-bodies" category.** NATO, the G7, the OECD, the EU, CETA, CPTPP, Five Eyes, and the IMF each have distinct memberships, mandates, and instruments. Keep them atomic. Cross-domain presence is surfaced through `fieldsCitedIn`, not by merging distinct bodies.

**Individual policy figures within a state:** if a foreign minister, ambassador, or head of a specific agency is named individually while the state itself is also named as an actor, treat the individual as part of the state actor unless they carry a distinctive position or role that the report highlights separately. Example: Trump as US President is not a separate actor from the "United States (Trump administration)" — merge. But a named cabinet minister with a specific policy position that the report characterises as distinct from the administration line would be a distinct actor.

### Layer 1 output structure per actor

```yaml
name: [name or category]
kind: [federal executive | legislature | opposition party | subnational government | indigenous body | private-sector | labour | civil-society | independent institution | judicial | regulatory | commission of inquiry | security or intelligence service | military | international body | foreign state | other]
liveActorStatus: [current | recently-live | historical-only-excluded]
fieldsCitedIn: [comma-separated field names, e.g. political.powerStructure, political.stabilityDrivers, economy.realEconomy, situation]
currentPositionFromReport: >
  One sentence, close paraphrase of what the report says the actor is doing
  or its position. May include a citation.
```

---

## Layer 2: analytical draft

For every actor produced in Layer 1, produce a Layer 2 draft.

**Layer 2 must remain anchored to the report text.** You may reason about the actor's interests, resources, constraints, likely moves, and engagement mode based on how the report describes the actor's actions, position, and constraints — but you may not import knowledge of the country from outside the text. If the report is silent on a Layer 2 dimension, mark that field as `report-silent`.

**Layer 2 requirements (implementation spec §8.1):**

- Layer 2 is `citationType: Interpretation`.
- Layer 2 ANCHORS per §1 of the spec: each draft carries the `[source-id]`s or `[dot.path]` field anchors it reasons from (e.g. `[political.stabilityDrivers]`, an already-cited source id) — inline in the field text and/or in the `anchors` list of the output structure. An anchor must point at a non-empty report field or a source id present in this report's registry; ghost anchors are rejected by the validators.
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
- `blocked / not-engageable`: hostile or non-recognising counterpart (sanctioned states, insurgent groups)
- `report-silent`: not derivable from the text

Choose the most accurate mode for this actor in the current situation the report describes. If the report describes a *change* in engagement mode (independence contested, capture risk emerging, standing newly asserted), note it. Do not force actors into modes that misrepresent them.

### Layer 2 output structure per actor

```yaml
layer2Draft:
  status: AI-drafted, unverified — collapsed by default
  citationType: Interpretation
  anchors: [source-ids or dot.path field anchors the draft reasons from]
  interests: >
    …
  resources: >
    …
  constraints: >
    …
  likelyMoves: >
    …
  engagementMode: >
    [mode name]. [one sentence justifying the mode from the report text, or
    noting a shift the report describes.]
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

Return a YAML block with two top-level arrays: `domestic` and `external`. Each entry contains Layer 1 fields plus a nested `layer2Draft` object.

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
