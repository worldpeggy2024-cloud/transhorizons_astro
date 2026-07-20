# Known and Unbuilt — STANDALONE catch-up run (USA)

> The USA derivatives pass (scorecard + baseline) already ran on 2026-07-19, before this field existed;
> this is the gap-register composition alone, from known-and-unbuilt-pass.md Part 2. Future countries
> compose it inside the derivatives pass. Closed-book; virgin branch; ONE attachment (analysis.yaml).

# PART 2 — Composition pass

**Country:** United States / États-Unis (USA) · **Run date:** 2026-07-20

Compose `capacity_knownAndUnbuilt_en` / `_fr` from the finished report. Runs inside the derivatives pass, after the situation pass has installed and its peer corrections are approved.

## Input

ONE attachment: `content/countries/USA/analysis.yaml`. Keys are flat, `<section>_<subsection>_<language>`. Work from `_en` as primary. The `sources` key is the registry; every `[source-id]` resolves there.

**Read as source material:** the six peer families and `situation_en`.

**Do NOT read:** `actors_*`, `risks_*`, `scorecard*`, `baseline_*`, and `capacity_inheritedTerrain_*` **as sources of gaps**. The first four are derivatives and a derivative may not rest on another derivative. `inheritedTerrain` is read for orientation and as the denominator the guard requires — it introduces no facts of its own, so trace anything it reflects back to the underlying peer field and anchor there.

**CLOSED-BOOK.** Run with search off. Every item traces to this report. A real, well-known unbuilt gap this country plainly has, that the report does not assert, is a violation — it will look correct, be verifiable, and still be wrong here. If the report is silent, the gap does not exist for this pass, and its absence is a Pass A finding recorded in `notCarried`.

## Method

**Scan.** Every peer field and every situation thread, for claims the report asserts with a resolvable `[source-id]` that describe a shortfall between what the state can do and what it requires — a backlog, an unmet standard, an absent capability, an unremoved barrier, a capacity named alongside a requirement it does not meet, a project class proposed but not built.

Recall over precision here; the gate decides.

**Gate.** Apply the four tests in Part 1b — asserted, a gap not a condition, internal, open. Record every rejection in `notCarried` with the test it failed. A silently dropped candidate is invisible; a recorded one is a finding about the report.

**Aggregate** where several assertions across fields are one gap, naming every contributing anchor. **Keep atomic** where the gaps would be closed by different actions, even if they look alike. Never generalise beyond citation.

**Compose.** Opener first, per Part 1b, declaring the documentation base. Then the items. Then, where the report supports it, the denominator sentence the guard requires.

## Output

Return ONE JSON object:

```json
{
  "knownAndUnbuilt": {
    "en": { "opener": "…", "items": [ { "gap": "…", "anchor": ["capacity.approvals", "source-id"], "since": "…", "class": "never-attempted" } ], "denominator": "…" },
    "fr": { "the same, in French, same order, same anchors" }
  },
  "notCarried": [ { "candidate": "…", "test": "which of the four it failed" } ],
  "undatedGaps": [ { "field": "capacity.productivity", "gap": "…", "note": "no duration in the approved sources — Pass A extension needed" } ]
}
```

`undatedGaps` is the §12 punch list: the gaps the report carries but cannot date. It feeds the next Pass A, not this field.

## Disciplines

- English and French carry the same items, in the same order, citing the same identifiers. Parity is validated manually.
- Acronyms spelled out in full at first mention in each language, no exceptions.
- Do not translate source names.
- Do not resolve contested characterisations — preserve them.
- Never fabricate a `since`. `report-silent` is a correct answer.
- Length is evidence-bound, not target-bound. A short honest register beats a padded one; thinness is a finding and belongs in the opener.

## Self-check before returning

Every anchor resolves to a non-empty field or a registry identifier · every item passes all four gate tests · no item rests on actors, risks, scorecard, baseline or inheritedTerrain content · the opener declares the documentation base · the guard sentence is present where the report supports it · English and French arrays are the same length with identical anchors · no trigger, probability, impact, mitigant, forecast or ranking anywhere in the output.

---

## Summary after the JSON

- Items by class, with counts
- Items with `report-silent` on `since`, and what that says about the documentation base
- Notable aggregations applied
- Counts: items carried, candidates not carried, undated gaps
