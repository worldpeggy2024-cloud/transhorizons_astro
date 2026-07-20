# Work order — replace the Risk Register with the Gap Register

**Read `CLAUDE.md` in the repo root before touching anything.** Do not modify `[...slug].astro`. Do not edit any French content.

Locate targets by reading the repo — file paths below are described by role, not asserted.

---

## Step 1 — Template text only

In `country-report-present-state-template.md`, §12 (time-binding), add after the existing numeric rule:

> **Every asserted gap is tied to a duration.** Where a field asserts a standing shortfall — a backlog, a deficit against need, an absent capability, an unmet requirement, a barrier not removed — state how long it has stood, or when it was first officially identified, cited, in that sentence or the next.
>
> Date from an official or primary identification (audit body, statutory review, government evaluation, national statistics series), not from the earliest advocacy publication naming the problem. Where only advocacy dating exists, say so and flag the source's orientation inline.
>
> Where the approved sources carry no duration, write the gap without one and name the sourcing gap in the same sentence. An undated gap is a Pass A finding, not a silent omission.
>
> **Openers are exempt** — the opener contract requires orientation, not history. The binding applies to the detail beneath.

No code. No report changes. The United States report was measured against this rule and already complies (27 gap-asserting sentences, 20 dated; the 7 undated are openers or a declared sourcing gap).

---

## Step 2 — Declare `capacity.knownAndUnbuilt`

Seventh capacity subsection. Order: `inheritedTerrain → steering → approvals → delivery → publicServices → productivity → knownAndUnbuilt`.

Declare in this order, all six before any content is written (Keystatic silently strips undeclared fields):

1. Report schema — the six-peer definition
2. Keystatic field config — `capacity_knownAndUnbuilt_en` and `_fr`
3. Validator — add to `warningFieldPrefixes`
4. Adapter
5. Renderer — new section in the capacity peer
6. Enforced-opener list — goes from nine entries to ten
7. `CLAUDE.md` — record the field and its composition point

Field carries: an opener declaring the documentation base, a list of items (`gap`, `anchor`, `since`, `class`), and a denominator sentence. Anchors are `[dot.path]` and `[source-id]`; ghost anchors are hard errors under existing machinery.

---

## Step 3 — Composition step

Add composition of `capacity_knownAndUnbuilt_*` to the **derivatives pass**, alongside scorecard and baseline — after the situation pass installs and its peer corrections are approved. Pass B emits the field empty.

Prompt: `known-and-unbuilt-pass.md`, Part 2.

---

## Step 4 — Remove the Risk Register

Now unblocked — the globe filter is already gone.

Remove:
- `risks_en` / `risks_fr` from schema, Keystatic config, validator, adapter, renderer
- the derived `riskLevel` and its derivation rule wherever it is computed or stored
- the Risk Register page component and any route or nav entry pointing at it
- the risks pass from the pass sequence and from `CLAUDE.md`

Only two country files exist: Canada and the United States. The United States file already has `risks_en: []` — nothing to clear. Canada carries a populated register (seven entries, plus a derived overall level). Clear Canada's, report what was in it before clearing, and do not silently delete.

Leave the correlation page alone — separate decision, not in scope. Note for the author: it renders cascades for Brazil, Australia and Ireland, which have no country files behind them. Report where that data lives; do not act on it.

---

## Done when

- Template §12 carries the persistence clause with the opener exemption
- `capacity.knownAndUnbuilt` declared in all seven places and rendering empty without validator errors
- Derivatives pass composes it
- No `risks_*` or `riskLevel` remains in schema, config, validator, adapter, renderer, routes, or any country file
- `CLAUDE.md` reflects the new field, the new composition step, and the removed pass

Report anything that could not be located or that required a judgment call. Do not resolve schema ambiguity silently.
