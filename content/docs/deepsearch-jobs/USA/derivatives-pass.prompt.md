# Derivatives Pass (USA) — scorecard + baseline

Country: United States (États-Unis)
Date: 2026-07-19

## Input — the finished report (attached)

You are given ONE attachment: the finished country report as a YAML file (content/countries/USA/analysis.yaml). No other project context is assumed; everything you need is in this prompt and that file.

- The report's keys are flat: <section>_<subsection>_<language>, e.g. political_powerStructure_en. Its SIX PEER SECTIONS are the territory_*, society_*, economy_*, political_*, capacity_*, and security_* field families (each field in _en and _fr), and situation_en/_fr hold the verified event layer as JSON threads. Work from the _en fields as primary; the _fr fields carry the same content in French.
- The report's SOURCE REGISTRY is the `sources` key: a JSON array of source objects, each with an `id`. Every [source-id] marker in the report resolves there.
- The scorecard_* keys and baseline_en/fr in the file are EMPTY — this pass is what writes them.
- The actors_* and risks_* keys are NOT input, even where populated: actors Layer 2 is unverified AI-drafted interpretation and risks await their own pass. Compose from the peer fields, the situation threads, and the registry ONLY — a derivative may not summarise another derivative.

**This pass is CLOSED-BOOK.** Run it with research/web search off; if search cannot be disabled, do not use it. Both outputs are DERIVATIVES: they summarise the attached report and may introduce NO fact that does not already appear, cited, in it.

SEQUENCING GUARD: this pass runs AFTER the situation pass has installed and its peer corrections are applied — the report you are reading is the final fact state. If situation_en is empty, STOP and say so instead of composing: the sequencing is wrong.

## Scorecard

Six axes, each rated High, Med, or Low — citationType: Interpretation, derivative:

- eliteCohesion — intra-power-bloc unity (start from political.stabilityDrivers, political.powerStructure)
- socialCohesion — society-wide trust and polarisation, distinct from elite cohesion (society.cohesion)
- securityLoyalty — armed-forces and security-force loyalty AND who controls them (political.stabilityDrivers, security.internal)
- economicPressure — the pressure the economy currently puts on the political order (economy.*, situation)
- protestCapacity — the population's demonstrated capacity to mobilise (society.cohesion, situation)
- institutionalResilience — the institutions' demonstrated capacity to absorb shocks (political.shockAbsorbers, political.rightsAndChecks, capacity.*, situation)

The field pointers are starting points, not limits — rate each axis from the WHOLE report, including the situation threads: the fast-moving event layer is exactly what the ratings must reflect.

## Scorecard anchors

For EACH of the six axes: the anchors the rating summarises and a one-line rationale in both languages.

"scorecardAnchors": {
  "eliteCohesion": { "anchors": ["source-id", "political.stabilityDrivers"], "rationale_en": "one line — why those facts produce this value", "rationale_fr": "une ligne" },
  ... (all six axes)
}

Each axis needs >= 1 anchor. Anchors are [source-id]s from the registry or dot field paths (e.g. political.shockAbsorbers, situation); an anchor to an empty field or an id not in the registry is a GHOST and is rejected by the validators.

## Baseline

A short paragraph (not one line, not long) in BOTH languages — the page's only always-visible prose, enough for a reader to decide whether to open this country. Present-state characterisation, never a forecast. It introduces no fact not already cited in the report and carries NO new sources; any citation markers must be ids already used in this report. It carries no [dot.path] anchors. It is named Baseline, never "Outlook." Where the situation field holds material events (a war, a rupture, a regime change), the baseline reflects them — it must not read as if the standing conditions were the whole story.

DISCIPLINES: acronyms spelled out at first mention, no exceptions; EN and FR carry the same substance and the same citation ids.

**Self-check before returning:** every anchor resolves to a non-empty field of the attached report or an id present in its registry; the baseline cites no id outside the registry; all six axes carry a value, at least one anchor, and both rationales. Fix failures before returning; do not ship them.

Return ONLY a JSON object:
{
  "scorecard": { "eliteCohesion": "High|Med|Low", "socialCohesion": "…", "securityLoyalty": "…", "economicPressure": "…", "protestCapacity": "…", "institutionalResilience": "…" },
  "scorecardAnchors": { all six axes as specified above },
  "baseline": { "en": "…", "fr": "…" }
}
