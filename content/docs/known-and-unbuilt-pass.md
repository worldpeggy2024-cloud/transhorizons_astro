# Known and Unbuilt — template amendment + composition pass (v0.1 draft)

*Two parts. Part 1 amends `country-report-present-state-template.md`. Part 2 is the composition prompt for the new field, which runs inside the existing derivatives pass.*

> **The design constraint this answers:** anything requiring human verification must ride inside the report, because the report is what gets read in French. A side artifact needing its own review cycle will not get one.

---

# PART 1 — Template amendment

## 1a. §12 amendment — persistence binding (the irreversible part)

§12 currently reads: *every numeric is tied to a specific period.* Extend it:

> **Every asserted gap is tied to a duration.**
>
> Where a field asserts a standing shortfall — a backlog, a deficit against need, an absent capability, an unmet requirement, a barrier that has not been removed — state **how long it has stood**, or **when it was first officially identified**, cited, in the same sentence or the one following.
>
> - Correct: `"deferred maintenance rose from $170 billion in 2017 to $370 billion in 2024 [id]"`; `"identified as a growth constraint in the 2016 review and unresolved at the most recent assessment [id][id]"`
> - Wrong: `"a substantial maintenance backlog [id]"`; `"long-standing internal barriers [id]"`
>
> **Dating discipline.** Date from an **official or primary identification** — audit body, statutory review, government evaluation, national statistics series — not from the earliest advocacy publication to name the problem. Where only advocacy dating exists, say so and tag the source's orientation inline, as the bias rule already requires.
>
> **Where the approved sources do not carry a duration**, write the gap without one and name the sourcing gap in the same sentence. An undated gap is a Pass A finding, not a silent omission.
>
> **Openers are exempt.** The opener contract requires orientation, not history — an opener that asserts a shortfall states it plainly and undated ("the federal government runs large structural deficits and rising debt"), and the duration binding applies to the detail that follows. Forcing dates into openers breaks the contract and is not what this rule asks for.

**Why this is the part that cannot wait.** Everything else here is a re-reading of prose already written. Duration is a re-reading of *sources*, one gap at a time — the expensive half of the pipeline. A report written without this rule cannot be upgraded without going back to primaries.

**Fields most affected:** `capacity.approvals`, `capacity.delivery`, `capacity.publicServices`, `capacity.productivity`, `economy.politicalEconomy`, `territory.metabolism`, `territory.transition`, `political.stateStructure`.

## 1b. New field — `capacity.knownAndUnbuilt` (the reversible part)

Field 34. Capacity peer becomes seven subsections. Order: `inheritedTerrain → steering → approvals → delivery → publicServices → productivity → knownAndUnbuilt`.

**Composed by the derivatives pass, not Pass B.** Pass B emits it empty. It composes alongside scorecard and baseline, after the situation pass installs and its peer corrections are approved — the last point at which the report's facts can change. Rationale: the claim the field makes is *still unclosed as of now*, and the situation layer is the only thing that can falsify it. A gap composed by Pass B and closed by an event three fields later is a false claim in the most quotable part of the report. *(Overrule if you would rather it read as ordinary section prose; the cost is that it goes stale against its own event layer.)*

**Epistemic status.** ANCHORED SYNTHESIS — introduces **no new sourced fact**. Every item is a close paraphrase of a claim already cited elsewhere in this report, carrying a `[dot.path]` anchor to the field asserting it. Ghost anchors are hard errors, per existing machinery. The `gap` and `since` values inherit the citation type of the field they came from; `class` is `Interpretation`, anchored to the observable record.

**OPENER (required)** — one sentence doing the three jobs, plus one addition specific to this field:

> **Declare the documentation base.** The opener names what the register rests on — the national audit institution, the independent fiscal or budget office, statutory review bodies, or their absence. A country that publishes little self-assessment produces a short register because it documents less, not because it has closed more. Where the documentation base is thin, the opener says so, and the thinness is the finding.

**Gate — what belongs in the register.** An item qualifies only if all four hold:

1. **Asserted.** The report already states it, with a resolvable `[source-id]`, in a peer field or a situation thread.
2. **A gap, not a condition.** A shortfall between capability and requirement — not a fact, a trend, a trade-off, or an exposure. Population ageing is a trend. A commodity exposure is a structural position. Neither is a gap.
3. **Internal.** Closing it lies within the country's own authority. Where the report asserts an external dependency, the register names **the unbuilt domestic response**, not the exposure — refining capacity not built, not reliance on a foreign supplier. The register is about what was in the country's own hands.
4. **Open.** The report does not state it closed. Where the situation layer shows it closing, it leaves the register; where the situation layer shows a commitment to close it, it stays, classed accordingly.

**Per item:**

| key | content |
|---|---|
| `gap` | One sentence, close paraphrase of what the report asserts. The report speaking, not the composer. |
| `anchor` | `[dot.path]` field(s) and `[source-id]`(s) it rests on — at least one, all resolving. |
| `since` | When first officially identified, or the span the report gives, cited. `report-silent` where the sources do not carry it. |
| `class` | `never-attempted` · `announced-not-implemented` · `attempted-and-failed` · `in-progress-unclosed`. `Interpretation`. |

**On `class`.** This is the distinction the six peers do not currently hold. `capacity.delivery` covers attempted-and-failed; `capacity.steering` covers announced-not-implemented; nothing covers a gap that is documented, internal, and simply never got onto an agenda. That third case is where the project's argument actually lives, so it is named rather than folded into incapacity. Assign it only from the observable record — announced-not-implemented needs a stated announcement in the report; never-attempted needs the report's silence on any attempt *plus* a source that would have recorded one.

**GUARD (mandatory, non-negotiable).** This field is read against `capacity.inheritedTerrain` as its denominator, and carries the same guard in its own prose: capacity is inherited and distributed — by history, colonialism, resource geography, luck — never earned or deserved. **A register of things a country did not build reads as an indictment unless the denominator is stated.** Where the report supports it, name *why* the capacity to close a gap is where it is. A gap is never rendered as a merit gap, and the length of this register is never rendered as a verdict on the country.

**Not in scope.** No trigger, no probability, no impact, no mitigants, no forecast, no ranking, no count presented as a score. Anything about what a gap *could produce* is the trajectory layer's, and anything about what *should* be built is nobody's.

## 1c. Downstream declarations required before use

Keystatic silently strips undeclared fields — declare before writing. Also: validator `warningFieldPrefixes`, the apply gate's opener list (the enforced openers go from nine to ten), adapter, renderer, `CLAUDE.md`, and the French field.

## 1d. Canada

Canada can ship without the field. It introduces no new facts, so retrofitting it later is composition from material already in the report — the cheapest possible retrofit. The §12 clause is the one that matters for Canada now: where a Canada section asserts a standing gap, bind it in time during the correction pass rather than discovering later that the primaries have to be revisited.

---

# PART 2 — Composition pass

**Country:** {{NAME_EN}} / {{NAME_FR}} ({{CODE}}) · **Run date:** {{TODAY}}

Compose `capacity_knownAndUnbuilt_en` / `_fr` from the finished report. Runs inside the derivatives pass, after the situation pass has installed and its peer corrections are approved.

## Input

ONE attachment: `content/countries/{{CODE}}/analysis.yaml`. Keys are flat, `<section>_<subsection>_<language>`. Work from `_en` as primary. The `sources` key is the registry; every `[source-id]` resolves there.

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
