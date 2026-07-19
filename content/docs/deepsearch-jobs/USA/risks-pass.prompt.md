# Risks pass — v1.0 (draft for author review; do not run until approved)

**Country:** United States / États-Unis (USA) · **Run date:** 2026-07-19

## Input — the finished report (attached)

You are given ONE attachment: the finished country report as a YAML file (`content/countries/USA/analysis.yaml`). No other project context is assumed; everything you need is in this prompt and that file.

- The report's keys are flat: `<section>_<subsection>_<language>`, e.g. `political_powerStructure_en`. Its SIX PEER SECTIONS are the `territory_*`, `society_*`, `economy_*`, `political_*`, `capacity_*`, and `security_*` field families (each field in `_en` and `_fr`), and `situation_en/_fr` hold the verified event layer as JSON threads. Work from the `_en` fields as primary; the `_fr` fields carry the same content in French.
- The report's SOURCE REGISTRY is the `sources` key: a JSON array of source objects, each with an `id`. Every `[source-id]` marker in the report resolves there.
- The `risks_en` and `risks_fr` keys in the file are EMPTY (`[]`) — this pass is what writes them.
- The `actors_*` keys, the `scorecard_*` keys and `baseline_en/fr` are NOT input, even where populated: actors Layer 2, the scorecard and the baseline are themselves derivatives (the scorecard and baseline carry unverified interpretation; actors Layer 2 is AI-drafted). Reason from the peer fields, the situation threads, and the registry ONLY — a derivative may not rest on another derivative.

**This pass is CLOSED-BOOK.** Run it with research/web search off; if search cannot be disabled, do not use it. Layer 1 gathers only what the report already asserts; Layer 2 is anchored inference. Neither requires nor permits outside sources, and no fact may enter the register that does not already appear, cited, in the attached report.

## Purpose — the two-layer risk register (implementation spec §8.2)

The six peers describe standing conditions and the situation field holds verified events. Neither says what could BREAK next. The risk register holds that: discrete, nameable adverse developments, each standing on stress the report already documents. Two epistemic layers per entry:

- **Layer 1 (gathering — high reliability):** the STATED STRESS POINT. This is NOT extraction of named risks — the report names none. It is the identification of a vulnerability, dependency, fragility, or capacity gap the report already asserts with a `[source-id]`, or a situation thread trending badly. Every stress point carries the markers of the report claims it rests on.
- **Layer 2 (framing — AI-drafted, unverified, renders collapsed and labelled):** the risk built on that stress point — trigger, time horizon, leading indicators, mitigants, and a qualitative probability × impact rating. All Layer 2 content is `citationType: Interpretation`.

## Two horizons, one register

- **Watch items (4–12 weeks):** derive from the `situation` threads — fast-moving, event-driven, with a near-term decision point or expiry the threads already document. Their `timeHorizon` states the window explicitly (e.g. "4–12 weeks — statutory expiry 24 July 2026").
- **Risks (6–18 months):** derive from the six peers — structural stress that could produce a discrete adverse development inside the planning horizon. `timeHorizon` states the window (e.g. "6–18 months").

Both go in the same array, watch items first, then risks — each class internally ordered by probability (High before Med before Low).

## Rating discipline

- `probability` and `impact` are each **High | Med | Low — qualitative ONLY, never numeric**, `citationType: Interpretation`, and each rating is ANCHORED to the `[source-id]`s and `[dot.path]` field anchors of the stress facts it rests on. An anchor to an empty field or an id not in the registry is a GHOST and is rejected by the validators. The bare `situation` is a valid field anchor (the one dotless field path).
- A rating that cannot name the cited stress it rests on is not a rating — drop the entry or lower the claim.
- **The register is load-bearing:** the country's site-wide risk level is DERIVED from it by a fixed rule (High = at least one risk High on BOTH probability and impact; Med = none High-both but at least one touching High on either axis; Low = otherwise). Rate each entry on its merits and let the level fall out — never tune ratings to produce a level.

## Register discipline

- Every entry stands on DOCUMENTED stress. No horizon-scanning, no genre risks ("cyber attacks could occur"), no imported knowledge of the country. If the report does not document the stress, the risk does not exist for this register — at most it is a named gap for the next Pass A.
- Size is evidence-bound, not target-bound: typically 5–10 risks and 2–5 watch items for a stressed country, fewer for a placid one. A register padded to look complete is worse than a short honest one; thinness is a finding.
- No duplicates by another name: one stress point, one entry, at its sharpest formulation. Where two stress points compound (a fiscal gap AND a funding-lapse pattern), the compounding is itself the entry, anchored to both.
- Titles are short noun phrases naming the adverse development, not the topic ("Tariff-authority vacuum after statutory expiry", not "Trade policy").
- Do not restate the situation threads as watch items wholesale — a watch item exists only where a thread has a NEXT decision point, expiry, or reversal the register should watch.

DISCIPLINES (as the main passes): acronyms spelled out at first mention, no exceptions; EN and FR carry the same entries, the same substance, the same ratings and the same citation ids; no source titles translated.

## Output — return ONLY a JSON object

{
  "risks": {
    "en": [
      {
        "title": "…",
        "trigger": "what would convert the stress into the event — one or two sentences, anchored [source-id] [dot.path]",
        "probability": "High|Med|Low",
        "impact": "High|Med|Low",
        "timeHorizon": "4–12 weeks — … | 6–18 months",
        "leadingIndicators": "the observable signals that the trigger is approaching, anchored",
        "mitigants": "what the report documents that cushions or could cushion this — anchored; 'report-silent' where the report documents none",
        "anchors": ["source-id", "dot.path", "situation"],
        "lastAssessed": "2026-07-19"
      }
    ],
    "fr": [ the same entries, in French, same order, same ratings, same ids ]
  },
  "passNotes": {
    "runDate": "2026-07-19",
    "considered": [ { "stress": "stress point considered but NOT carried", "verdict": "dropped | folded", "test": "the rule it failed or the entry it folded into, one sentence" } ],
    "notes": "anything the NEXT run must see: rating calls that were close, stress the report under-documents (Pass A gaps), threads expected to expire before the next assessment"
  }
}

**Self-check before returning:** every anchor resolves to a non-empty field of the attached report or an id present in its registry; every probability and impact is High/Med/Low with at least one anchor behind it; EN and FR arrays are the same length with identical ratings and citation-id sets; watch items precede risks; no entry rests on actors, scorecard, or baseline content. Fix failures before returning; do not ship them.
