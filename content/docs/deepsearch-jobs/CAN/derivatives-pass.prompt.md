# Derivatives Pass (CAN) — scorecard + baseline + gap register

Country: Canada (Canada)
Date: 2026-07-28

## Input — the finished report (attached)

You are given ONE attachment: the finished country report as a YAML file (content/countries/CAN/analysis.yaml). No other project context is assumed; everything you need is in this prompt and that file.

- The report's keys are flat: <section>_<subsection>_<language>, e.g. political_powerStructure_en. Its SIX PEER SECTIONS are the territory_*, society_*, economy_*, political_*, capacity_*, and security_* field families (each field in _en and _fr), and situation_en/_fr hold the verified event layer as JSON threads. Work from the _en fields as primary; the _fr fields carry the same content in French.
- The report's SOURCE REGISTRY is the `sources` key: a JSON array of source objects, each with an `id`. Every [source-id] marker in the report resolves there.
- The scorecard_* keys, baseline_en/fr, and capacity_knownAndUnbuilt_en/fr in the file are EMPTY — this pass is what writes them.
- The actors_* keys are NOT input, even where populated: actors Layer 2 is unverified AI-drafted interpretation. Compose from the peer fields, the situation threads, and the registry ONLY — a derivative may not summarise another derivative. For the GAP REGISTER specifically, capacity_inheritedTerrain_* and security_posture_* are also not sources of gaps (each is assembled from other fields); capacity_inheritedTerrain_* is read for orientation and as the denominator the guard requires — trace anything it reflects back to the underlying peer field and anchor there. NEVER read or anchor to the LEGACY fields capacity_permitting_* (renamed capacity_approvals_*) or economy_macroReality_* (renamed economy_realEconomy_*): a two-phase report carries only the new names, and any content under a legacy key is superseded and may be stale — a non-empty leftover still resolves as an anchor and silently points at outdated content.

**This pass is CLOSED-BOOK.** Run it with research/web search off; if search cannot be disabled, do not use it. It must ALSO run with no memory recall: run it in a memory-off or temporary/incognito session, outside any project that stores notes on this country. Recalled memories, saved project notes, and prior-run records are OUT-OF-REPORT KNOWLEDGE — the single most likely way a stale earlier value (an old scorecard rating, a previous baseline) re-enters and re-anchors this composition, which is exactly what the empty input fields exist to prevent. If the session shows it recalled any memory or project note, STOP and restart in a clean memory-off session. Both outputs are DERIVATIVES: they summarise the attached report and may introduce NO fact — and no framing — that does not already appear, cited, in it. The attached file is the ONLY input; if something is not in it, it does not exist for this pass.

SEQUENCING GUARD: this pass runs AFTER the situation pass has installed and its peer corrections are applied — the report you are reading is the final fact state. If situation_en is empty, STOP and say so instead of composing: the sequencing is wrong.

LANGUAGE: translate the PROSE into real French — rationale_fr (scorecard), baseline_fr, and each FR register item's gap and since text. Two things are NOT translated: they are canonical tokens the RENDERER keys on, so keep them identical in the EN and FR items. (1) The register class value (no-attempt-documented | announced-not-implemented | attempted-and-failed | in-progress-unclosed) — a controlled status the renderer maps to a localised display label. (2) The report-silent sentinel, wherever since has no date — the renderer detects it to omit the date line entirely; a translated sentinel would render as a literal false date. The FR register items carry the same order and the same anchors/ids as the EN. (The scorecard axis value High|Med|Low and scorecard_anchors are single language-neutral fields — there is no separate French scorecard to translate; rationale_en and rationale_fr both live inside scorecard_anchors.)

LEGACY / POPULATED FIELDS: a properly two-phase report emits scorecard_*, baseline_* and capacity_knownAndUnbuilt_* EMPTY — you compose them. If you nonetheless find any of them already populated (a partially-migrated file carrying pre-rework values), IGNORE the existing values, compose fresh from the report, and note the divergence — never read the old value as an input. (Same reason the actors and legacy fields are excluded above: a derivative may not seed itself from stale content.)

## Scorecard

Six axes, each rated High, Med, or Low — citationType: Interpretation, derivative.

REFERENCE FRAME (read this first). The rating is GLOBAL-ABSOLUTE: High / Med / Low place this country against the range of ALL countries in the world, so one country's card is comparable to another's on the globe — NOT against the country's own historical norm, NOT against an ideal. You work from one country's report and cannot see the world's distribution, so each axis carries an explicit yardstick with concrete reference points below; place the country on that yardstick. A country between two bands is stated as such, with which way and why.

The six axes, each with its band anchors (the field pointers are starting points, not limits):

- eliteCohesion — unity of the power bloc (start: political.stabilityDrivers, political.powerStructure, political.shockAbsorbers). HIGH = a broadly united elite, leadership transitions routine, no significant faction contesting the system's legitimacy (most consolidated democracies and settled autocracies). LOW = an elite fractured into blocs contesting the state itself — rival power centres, coup or purge dynamics, a governing class at war with itself. MED = real factional strain inside a system nobody is trying to break.
- socialCohesion — society-wide trust and polarisation, distinct from elite cohesion (society.cohesion). HIGH = a high-trust society, low political violence, cleavages managed through normal politics (the Nordics, Canada, Japan, most of Western Europe). LOW = deep communal, sectarian or partisan division with a real risk or record of civil violence. MED = rising polarisation or an eroding consensus in a society still fundamentally at peace with itself.
- securityLoyalty — armed-forces and security-force loyalty AND who controls them (political.stabilityDrivers, security.internal). HIGH = unambiguous statutory civilian control, no history of intervention, no systemic security-sector corruption. LOW = security forces that are a political actor in their own right, coup history, or divided loyalty. MED = civilian control that holds but is politicised, strained, or resting on personal rather than institutional ties.
- economicPressure — the pressure the economy currently puts on the political order (economy.*, situation). PRESENT-TENSE by design. HIGH = acute economic distress bearing on stability now — crisis, default risk, runaway inflation, a shock the state cannot cushion. LOW = a sound economy putting little political pressure on the order. MED = real strain — a shock, a slowdown, a squeeze — landing on a state with the means to absorb it.
- protestCapacity — the population's demonstrated capacity to mobilise (society.cohesion, situation). DESCRIPTIVE, not good-or-bad, PRESENT-TENSE. HIGH = a recent record of large-scale mobilisation (mass demonstrations, general strikes). LOW = little or no mobilisation on the record, contestation channelled through courts and institutions. Rate the DEMONSTRATED record; where the report carries no mobilisation event, that is Low by absence, and the rationale says so.
- institutionalResilience — the institutions' demonstrated capacity to absorb shocks (political.shockAbsorbers, political.rightsAndChecks, capacity.*). HIGH = shocks absorbed on the record through durable, often automatic buffers and settled legal doctrine. LOW = institutions that have failed, been captured, or buckled under recent shocks. MED = institutions that hold but show strain, discretionary rather than automatic buffers, or untested resilience.

STRUCTURAL vs PRESENT-TENSE — do not let the event layer capture the structural axes. eliteCohesion, socialCohesion, securityLoyalty and institutionalResilience rate the STANDING STRUCTURE; the situation threads MODIFY the reading but never drive it — a durable high-trust society does not drop to Med over one contested election or one external shock. Only economicPressure and protestCapacity are present-tense axes that legitimately track the current moment. (This replaces the earlier blanket rule that made the fast-moving event layer the thing the ratings must reflect — that rule darkened the structural axes.)

PROPORTION — the value must match the weight of its own rationale. If the rationale describes a cohesive, well-governed society, the axis rates HIGH; reaching for the strain the rationale then qualifies away is the same darkening error the baseline guards against. A stable, comfortable country must score like one; a country in genuine crisis must score like one. The rating follows the global yardstick and the evidence, never a house tone. Diagnostic: if a rich, peaceful, well-governed country comes out mid-scale across the structural axes, the frame has slipped — re-place it on the global yardstick.

## Scorecard anchors

For EACH of the six axes: the anchors the rating summarises and a one-line rationale in both languages.

"scorecardAnchors": {
  "eliteCohesion": { "anchors": ["source-id", "political.stabilityDrivers"], "rationale_en": "one line — why those facts produce this value", "rationale_fr": "une ligne" },
  ... (all six axes)
}

Each axis needs >= 1 anchor. Anchors are [source-id]s from the registry or dot field paths (e.g. political.shockAbsorbers, situation); an anchor to an empty field or an id not in the registry is a GHOST and is rejected by the validators.

## Baseline

A short paragraph (not one line, not long) in BOTH languages — the page's only always-visible prose, enough for a reader to decide whether to open this country. Present-state characterisation, never a forecast. It introduces no fact not already cited in the report and carries NO new sources; any citation markers must be ids already used in this report. It carries no [dot.path] anchors. It is named Baseline, never "Outlook."

LEAD FROM THE STRUCTURE. The baseline portrays what the country durably IS, synthesised from the six structural peers — territory, society, economy, political order, capacity to deliver, security. A reader who knows the country should recognise it: the land, the people and the economy on their own terms come first, before any current strain. Do NOT let the situation layer become the spine.

DURABILITY TEST. Every clause must still read true six to twelve months after the run date. A standing structural fact belongs — asymmetric dependence on a single neighbour, a resource-export base, a federal fracture line are durable; the specific live EPISODE expressing such a fact right now (this quarter's tariff schedule, a dated referendum, a statute section invoked last month, event-by-event dates and annexes) is SITUATION-LAYER and does not structure the baseline. Where the situation field holds a genuinely material event — a war, a rupture, a regime change — the baseline may carry it, but as ONE subordinated clause, never as the organising frame and never in dated blow-by-blow detail (that is the situation field's job, and the scorecard already scores it).

PROPORTION — read this against the country you are actually describing. The baseline is a portrait in proportion to how the country lives, not a risk brief. A stable, high-income, peaceful country must read as one; a country in genuine crisis must read as one; the register follows the evidence, not a house tone. Strain, deficits and gaps are LOCATED, not made the organising lens — the scorecard and the gap register already carry the country's problems; the baseline carries the COUNTRY. Reaching for crisis vocabulary the report does not warrant is exactly as much a distortion as burying strain the report documents. Diagnostic: if a comfortable, well-governed country comes out sounding embattled, the lens is wrong — rebuild from the structural peers.

## Gap register — capacity.knownAndUnbuilt (canonical contract: known-and-unbuilt-pass-template.md)

ANCHORED SYNTHESIS — introduces NO new sourced fact. Every item is a close paraphrase of a claim already cited in this report, anchored to the field(s) asserting it. Never invent a marker of either kind. A real, well-known gap this country plainly has that the report does not assert is a VIOLATION — record its absence in notCarried instead.

SCAN every peer field and every situation thread for claims the report asserts with a resolvable [source-id] that describe a shortfall between what the state can do and what it requires — a backlog, an unmet standard, an absent capability, an unremoved barrier, a capacity named alongside a requirement it does not meet, a project class proposed but not built. Recall over precision; the gate decides.

GATE — an item qualifies only if all six hold:
1. ASSERTED. The report already states it, with a resolvable [source-id], in a peer field or a situation thread.
2. A GAP, NOT A CONDITION. A shortfall between capability and requirement — not a fact, a trend, a trade-off, or an exposure. Population ageing is a trend; a commodity exposure is a structural position; neither is a gap.
3. INTERNAL. Closing it lies within the country's own authority. Where the report asserts an external dependency, the register names the UNBUILT DOMESTIC RESPONSE, not the exposure.
4. OPEN. The report does not state it closed. Where the situation layer shows it closing, it leaves the register; where it shows a commitment to close it, it stays, classed accordingly.
5. MISSING, NOT UNDONE. The report states this as a capability or provision that is absent or insufficient — not as a commitment, target, project or programme that existed and was withdrawn, cancelled, or reversed by decision. A reversal is a choice; choices are carried by the fields that describe policy, not by this register.
6. AGAINST A SELF-SET STANDARD. The requirement the shortfall falls short of is one the country set for ITSELF — a domestic law, target, strategy or audit finding; a commitment it chose to adopt (a ratified treaty, convention, UN framework, or Nationally Determined Contribution); or a constitutional or statutory guarantee. A shortfall stated only against an external comparison or peer benchmark the country never committed to (a foreign average, an OECD/G7 mean, a better-performing country) is NOT a register item — record it in notCarried. The peer fields carry such comparisons; the register carries broken commitments. This is what lets the register work across accountability regimes: a state with no audit office still has treaties it ratified and a constitution it wrote. Where even those are thin, the opener declares the thin base — the thinness is the finding, never a licence to import an outside standard of what the country "should" provide (which would also trip the inherited-capacity guard).
Record every rejection in notCarried with the test it failed.

AGGREGATE where several assertions across fields are one gap, naming every contributing anchor. KEEP ATOMIC where the gaps would be closed by different actions. Never generalise beyond citation.

OPENER (required, one to three sentences): the standard three jobs — state what kind of case this country is on documented-but-unclosed gaps, signal how central and which way it is moving, declare depth — PLUS one job specific to this field: DECLARE THE DOCUMENTATION BASE the register rests on (the national audit institution, independent fiscal or budget office, statutory review bodies, government evaluation units, or their absence). A country that publishes little self-assessment produces a short register because it documents less, not because it has closed more; where the base is thin, say so — the thinness is the finding. The opener carries NO [dot.path] anchors and states no new facts.

PER ITEM: gap (one sentence, close paraphrase — the report speaking, not the composer, with inline markers); anchor ([dot.path] field(s) and [source-id](s), at least one, all resolving; the bare situation is a valid field anchor — a gap asserted only in a situation thread anchors situation plus the event's source id); since (when first officially identified, or a duration the report STATES, cited; a publication, edition or measurement date is NOT a since — a vintage rendered as a duration is a false claim; where that is all the report carries, use 'report-silent' and record the item in undatedGaps — never fabricate); class (no-attempt-documented | announced-not-implemented | attempted-and-failed | in-progress-unclosed — Interpretation, assigned only from the observable record: announced-not-implemented needs a stated announcement in the report; no-attempt-documented needs the report's silence on any attempt PLUS a source that would have recorded one — the class states what the report documents, never what the country did. A rating that worsened across assessments is not by itself evidence of an attempt: assign attempted-and-failed only where the report STATES an attempt was made and did not close the gap; assign in-progress-unclosed only where the report STATES work is under way).

GUARD (mandatory): this register is read against capacity.inheritedTerrain as its denominator. Capacity is inherited and distributed — by history, colonialism, resource geography, luck — never earned or deserved. Where the report supports it, close with a denominator sentence naming WHY the capacity to close gaps is where it is. A gap is never rendered as a merit gap; the register's length is never a verdict on the country.

NOT IN SCOPE: no trigger, no probability, no impact, no mitigants, no forecast, no ranking, no count presented as a score. Length is evidence-bound; a short honest register beats a padded one.

DISCIPLINES: acronyms spelled out at first mention, no exceptions; EN and FR carry the same substance, the same items in the same order, and the same citation ids.

**Self-check before returning:** every anchor resolves to a non-empty field of the attached report or an id present in its registry; the baseline cites no id outside the registry; all six axes carry a value, at least one anchor, and both rationales; every register item passes all six gate tests; no register item rests on actors, scorecard, baseline, inheritedTerrain or posture content (each is itself assembled from other fields — a summary may not rest on a summary); the register opener declares the documentation base; the denominator sentence is present where the report supports it; no trigger/probability/impact/mitigant/forecast anywhere; nothing in the register comes from your own knowledge of the country. Fix failures before returning; do not ship them.

Return ONLY a JSON object:
{
  "scorecard": { "eliteCohesion": "High|Med|Low", "socialCohesion": "…", "securityLoyalty": "…", "economicPressure": "…", "protestCapacity": "…", "institutionalResilience": "…" },
  "scorecardAnchors": { all six axes as specified above },
  "baseline": { "en": "…", "fr": "…" },
  "knownAndUnbuilt": {
    "en": { "opener": "…", "items": [ { "gap": "…", "anchor": ["capacity.approvals", "source-id"], "since": "…", "class": "no-attempt-documented" } ], "denominator": "…" },
    "fr": { the same, in French, same order, same anchors }
  },
  "notCarried": [ { "candidate": "…", "test": "which of the six gate tests it failed" } ],
  "undatedGaps": [ { "field": "capacity.productivity", "gap": "…", "note": "no duration in the approved sources — Pass A extension needed" } ]
}

undatedGaps is the §12 persistence-clause punch list: gaps the report carries but cannot date. It feeds the next Pass A, not this field.
