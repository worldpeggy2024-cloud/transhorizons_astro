# Risks pass — v2.0 (draft for author review; do not run until approved)

**Country:** {{NAME_EN}} / {{NAME_FR}} ({{CODE}}) · **Run date:** {{TODAY}}

> v2.0 (2026-07-19, author decision): this pass now produces the **Layer 1 stress index ONLY** —
> a structured, cited index of every dependency, fragility, capacity gap, and adverse trend the
> report asserts. The former Layer 2 (trigger, horizon, probability × impact, mitigants — the
> judgment layer) is PARKED pending study, together with the aggregate risk level and the
> correlation cascades. Do not produce any of it.

## Input — the finished report (attached)

You are given ONE attachment: the finished country report as a YAML file (`content/countries/{{CODE}}/analysis.yaml`). No other project context is assumed; everything you need is in this prompt and that file.

- The report's keys are flat: `<section>_<subsection>_<language>`, e.g. `political_powerStructure_en`. Its SIX PEER SECTIONS are the `territory_*`, `society_*`, `economy_*`, `political_*`, `capacity_*`, and `security_*` field families (each field in `_en` and `_fr`), and `situation_en/_fr` hold the verified event layer as JSON threads. Work from the `_en` fields as primary; the `_fr` fields carry the same content in French.
- The report's SOURCE REGISTRY is the `sources` key: a JSON array of source objects, each with an `id`. Every `[source-id]` marker in the report resolves there.
- The `risks_en` and `risks_fr` keys in the file are EMPTY (`[]`) — this pass is what writes them.
- The `actors_*` keys, the `scorecard_*` keys and `baseline_en/fr` are NOT input, even where populated: they are themselves derivatives. Index from the peer fields, the situation threads, and the registry ONLY — a derivative may not rest on another derivative.

**This pass is CLOSED-BOOK.** Run it with research/web search off; if search cannot be disabled, do not use it. This is gathering, not judgment: every entry restates stress the report already asserts, cited. No fact may enter the index that does not already appear, cited, in the attached report.

## Purpose — the stress index

The six peers describe standing conditions and the situation field holds verified events. Scattered through both, the report ASSERTS stress: dependencies, fragilities, capacity gaps, adverse trends — each already carrying a `[source-id]`. This pass collects them into one structured, cited index so the report's own stress claims become legible in one place. It does NOT rate them, forecast them, or frame them as risks — that judgment layer is parked.

## Entry discipline

- **One stress point, one entry**, at its sharpest formulation. Where the report asserts the same stress in two fields, one entry lists both loci. Where two stress points compound (a fiscal gap AND a recurring funding-lapse pattern), the compounding is itself an entry only if the REPORT asserts the connection — never connect them yourself.
- **Four kinds** (pick the closest): `dependency` (reliance on an external or single source the report documents), `fragility` (a documented weakness or erosion), `capacity-gap` (a documented gap between task and demonstrated capacity), `adverse-trend` (a documented direction of change for the worse, including situation threads trending badly).
- **Statement** = one or two sentences restating the stress AS THE REPORT ASSERTS IT, with the report's own figures and years, carrying the `[source-id]` / `[dot.path]` markers of the claims it rests on. The bare `situation` is a valid field anchor.
- **deadline** (optional): a DOCUMENTED date the report ties to this stress (a statutory expiry, a scheduled decision) — a cited fact, never an estimate.
- No horizon-scanning, no genre risks, no imported knowledge, no severity language beyond what the report itself uses. If the report does not assert the stress, it does not exist for this index — at most it is a named gap for the next Pass A.
- Completeness over selection: EVERY asserted dependency, fragility, capacity gap and adverse trend enters the index — this is an index, not a shortlist. Thinness is a finding; padded significance is a defect.
- Order: situation-derived entries first (the fast-moving stress), then by peer display order (territory · society · economy · political · capacity · security).

DISCIPLINES (as the main passes): acronyms spelled out at first mention, no exceptions; EN and FR carry the same entries, the same substance and the same citation ids; no source titles translated.

## Output — return ONLY a JSON object

{
  "risks": {
    "en": [
      {
        "title": "short noun phrase naming the stress ('Critical-mineral import reliance on a single supplier'), not the topic",
        "kind": "dependency | fragility | capacity-gap | adverse-trend",
        "statement": "one or two sentences restating the stress as the report asserts it, with its figures and years [source-id][dot.path]",
        "loci": ["dot.path", "situation"],
        "anchors": ["source-id", "dot.path"],
        "deadline": "OPTIONAL — a documented date the report ties to this stress",
        "lastAssessed": "{{TODAY}}"
      }
    ],
    "fr": [ the same entries, in French, same order, same ids ]
  },
  "passNotes": {
    "runDate": "{{TODAY}}",
    "considered": [ { "stress": "candidate considered but NOT carried", "verdict": "dropped | folded", "test": "the rule it failed or the entry it folded into, one sentence" } ],
    "notes": "anything the NEXT run must see: borderline calls, stress the report under-documents (Pass A gaps), documented deadlines that will pass before the next assessment"
  }
}

**Self-check before returning:** every anchor and locus resolves to a non-empty field of the attached report or an id present in its registry; every statement's figures appear in the report; no entry carries probability, impact, trigger, horizon or mitigant content (parked); EN and FR arrays are the same length with identical citation-id sets. Fix failures before returning; do not ship them.
