# Known and Unbuilt — composition pass

**Country:** {{NAME_EN}} / {{NAME_FR}} ({{CODE}}) · **Run date:** {{TODAY}}

Compose one field of a finished country report: `capacity_knownAndUnbuilt_en` and `capacity_knownAndUnbuilt_fr`. No project context is assumed — everything you need is in this prompt and the attached file.

**What this field is.** A register of shortfalls the country has documented about itself and has not closed: things known, internal to fix, and still open. It is the last subsection of the report's capacity section.

**What makes it unusual.** It introduces **no new facts**. Every item is a close paraphrase of something the report already states and already cites. Your job is to find those statements, test them, and assemble them — not to research, and not to add.

---

## Input

ONE attachment: the finished country report as a YAML file (`content/countries/{{CODE}}/analysis.yaml`).

Keys are flat: `<section>_<subsection>_<language>`, e.g. `capacity_delivery_en`. Work from the `_en` fields as primary; the `_fr` fields carry the same content in French.

**Read as source material — the six section families and the event layer:**

- `territory_*` — the physical body of the country
- `society_*` — the population
- `economy_*` — production, public finances, external exposure, who benefits
- `political_*` — power, rights, constitutional ground, administrative structure
- `capacity_*` — what the state can actually do (except the two fields excluded below)
- `security_*` — internal order, military, cross-border exposure, diplomacy
- `situation_en` — the event layer: threaded JSON, each thread a named strand of related events, each event carrying `date`, `what` (what happened) and `changed` (what it materially changed)

**The source registry** is the `sources` key: a JSON array of source objects, each with an `id`. Every `[source-id]` marker in the report resolves to an entry there.

**Two kinds of marker appear in the report and in your output:**

- `[source-id]` — no dots, lowercase letters, digits and hyphens. Resolves to an entry in the `sources` registry.
- `[dot.path]` — contains a dot, e.g. `capacity.delivery`. Names a field of this report. Resolves to `<section>_<subsection>_en` / `_fr`. **One dotless exception: the bare `situation` is a valid FIELD marker** — the event layer has no section prefix; it resolves to `situation_en` / `_fr`, and no source ever uses the id `situation`. A gap asserted only in a situation thread anchors `situation` plus the event's source id.

A marker that resolves to neither is an error. Never invent either kind.

**Do NOT read as sources of gaps:**

- `capacity_knownAndUnbuilt_*` — the field you are composing; it is empty.
- `actors_*`, `risks_*`, `scorecard*`, `baseline_*`, `capacity_inheritedTerrain_*`, `security_posture_*` — these fields introduce no facts of their own; each is assembled from other fields. Building this register on one of them would rest a summary on a summary. Where one of them reflects a gap, find the field it came from and use that.

`capacity_inheritedTerrain_*` has a second role: **read it for the denominator** (see the guard below). It describes the structural ground the state works against — scale, resource base, colonial and extractive legacy, conflict history, inherited education and health base.

---

## CLOSED-BOOK — run with search off

Every item must trace to the attached report. **A real, well-known unbuilt gap this country plainly has, which the report does not state, is a violation.** It will look correct, be verifiable, and still be wrong here — and it is the hardest error to detect afterwards.

If the report is silent on something you know about the country, the gap does not exist for this pass. Record its absence in `notCarried` and move on.

---

## Method

### 1. Scan

Read every field in the six families and every thread in `situation_en`. Collect any claim the report asserts, **carrying a resolvable `[source-id]`**, that describes a shortfall between what the state can do and what it requires:

- a backlog or deferred work
- an unmet standard or requirement
- an absent capability
- a barrier named and not removed
- a capacity named alongside a requirement it does not meet
- a class of project proposed but not built

Recall over precision here — collect generously; the gate decides.

### 2. Gate — four tests, all four must hold

**Test 1 — ASSERTED.** The report already states it, with a resolvable `[source-id]`, in one of the six section families or in a `situation` thread. Not implied, not inferable: stated.

**Test 2 — A GAP, NOT A CONDITION.** A gap is a shortfall between capability and requirement. These are not gaps:
- a fact ("the population is 18 million")
- a trend ("the population is ageing")
- a trade-off or structural position ("the economy depends on commodity exports")
- an exposure ("vulnerable to a shift in a partner's trade policy")

*Ageing is a trend. Commodity dependence is a structural position. Neither belongs here.*

**Test 3 — INTERNAL.** Closing it lies within the country's own authority. Where the report asserts an external dependency, do not carry the dependency — carry the **unbuilt domestic response** to it, if the report asserts one. Refining capacity that was never built is a gap; reliance on a foreign supplier is not. The register is about what was in the country's own hands.

**Test 4 — OPEN.** The report does not state it closed. Where a `situation` thread shows it closing, it leaves the register. Where a thread shows a commitment to close it that has not landed, it stays, classed accordingly.

**Record every rejection** in `notCarried`, naming which test it failed. A candidate dropped silently is invisible; a candidate recorded is a finding about the report.

### 3. Aggregate

**Aggregate** where several assertions across different fields are one gap — name every contributing anchor.

**Keep atomic** where the gaps would be closed by different actions, even if they look alike.

**Never generalise beyond citation.** Within an aggregated item, name what the report actually asserts.

### 4. Compose

Write the opener, then the items, then the denominator sentence.

---

## The opener (required — one to three sentences)

The opener does three jobs, in order:

1. **State** — what kind of case this country is on documented-but-unclosed gaps.
2. **Signal** — how central this is here, and which way it is moving.
3. **Declare depth** — either that detail follows, or an honest one-line close if the register is genuinely short.

**Plus one job specific to this field — DECLARE THE DOCUMENTATION BASE.** Name what the register rests on: the national audit institution, an independent fiscal or budget office, statutory review bodies, government evaluation units — or their absence.

This matters because **a country that publishes little self-assessment produces a short register because it documents less, not because it has closed more.** Without this sentence the register silently rewards opacity. Where the documentation base is thin, say so plainly — the thinness is itself the finding.

The opener carries no `[dot.path]` anchors and states no new facts.

---

## Each item

| key | content |
|---|---|
| `gap` | One sentence, close paraphrase of what the report asserts. The report speaking, not you. |
| `anchor` | The `[dot.path]` field(s) and `[source-id]`(s) it rests on — at least one, all resolving. |
| `since` | When it was first officially identified, or the span the report gives, cited. Use `report-silent` where the report does not carry it. **Never invent a date.** |
| `class` | One of the four below. |

### The four classes — assign by decision table, keyed to what the report STATES

Work down the rows and take the FIRST that matches. Every row keys to a statement in the report — never to an inference from a rating movement alone.

1. The report **states remediation work is under way** on this gap, and does not state that it failed or regressed → **`in-progress-unclosed`**.
2. The report **states an announcement, commitment, plan or target** addressing this gap, and states no implementation or states it did not land → **`announced-not-implemented`**.
3. The report **states an attempt, program or remediation effort AND states the gap persisted, failed or regressed after it** — including a named standing remediation record (a high-risk list, a remediation program) where the report states the area worsened between assessments → **`attempted-and-failed`**.
4. The report **states no attempt of any kind**, and carries a source that would have recorded one had it happened → **`never-attempted`**.

Tie-breakers:

- A worsening rating with **no named attempt or remediation program behind it** is `never-attempted`, not `attempted-and-failed` — a measurement is not an attempt.
- A **named standing remediation record** with a stated regression IS an attempt record — `attempted-and-failed`.
- Where the report states both an ongoing effort and no closure, row 1 wins **unless the report itself states failure or regression**.
- Where no row is satisfiable from stated text, assign the class requiring the least inference and flag the item in the summary.

`class` is the register's one judgment; the rest of each item is the report's own statement.

---

## The guard — mandatory, non-negotiable

**A register of things a country did not build reads as an indictment unless the ground it was working on is stated.**

Capacity is inherited and distributed — by history, colonialism, resource geography, and luck. It is never earned or deserved. Where the report supports it, write a closing **denominator** sentence naming *why* the capacity to close these gaps is where it is, drawing on what `capacity_inheritedTerrain_*` describes.

- A gap is never rendered as a merit gap.
- The length of this register is never rendered as a verdict on the country.
- Where the report does not support a denominator sentence, omit it rather than invent one.

---

## Not in scope

No trigger, no probability, no impact, no mitigation, no forecast, no ranking, no count presented as a score, no recommendation.

Anything about what a gap *could produce* belongs to a different layer of this project. Anything about what *should* be built belongs to no layer of it.

---

## Output

Return ONE JSON object and nothing else before it:

```json
{
  "knownAndUnbuilt": {
    "en": {
      "opener": "…",
      "items": [
        { "gap": "…", "anchor": ["capacity.approvals", "some-source-id"], "since": "…", "class": "never-attempted" }
      ],
      "denominator": "…"
    },
    "fr": { "the same, in French — same items, same order, same anchors" }
  },
  "notCarried": [ { "candidate": "…", "test": "which of the four tests it failed" } ],
  "undatedGaps": [ { "field": "capacity.productivity", "gap": "…", "note": "the report carries no duration for this gap" } ]
}
```

`undatedGaps` lists gaps the report carries but cannot date. It does not go in the field — it is a list of things to look for the next time sources are gathered.

---

## Disciplines

- **English and French carry the same items, in the same order, citing the same identifiers.** Parity is checked.
- **Acronyms** spelled out in full at first mention in each language, no exceptions. The report is read by people who do not work in the sector.
- **Do not translate source names.**
- **Do not resolve contested characterisations** — where the report preserves a dispute, preserve it.
- **Never fabricate a `since`.** `report-silent` is a correct answer.
- **Length is evidence-bound, not target-bound.** A short honest register beats a padded one. Thinness is a finding and belongs in the opener.

---

## Self-check before returning

- Every anchor resolves to a non-empty field of this report or to an identifier in the registry
- Every item passes all four gate tests
- No item rests on `actors_*`, `risks_*`, `scorecard*`, `baseline_*`, `capacity_inheritedTerrain_*` or `security_posture_*`
- The opener declares the documentation base
- The denominator sentence is present where the report supports it
- English and French arrays are the same length with identical anchors
- No trigger, probability, impact, mitigation, forecast or ranking anywhere in the output
- Nothing in the register comes from your own knowledge of this country

---

## Summary after the JSON

- Items by class, with counts
- Items with `report-silent` on `since`, and what that says about the documentation base
- Notable aggregations applied
- Counts: items carried, candidates not carried, undated gaps
