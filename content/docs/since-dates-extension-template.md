# First-identification dates — targeted source harvest ({{NAME_EN}})

**Country:** {{NAME_EN}} ({{NAME_FR}}) · **Run date:** {{TODAY}}

**What this is.** A targeted source harvest. Below is a list of shortfalls a country has documented about itself. For each one, find a source that establishes **when it was first officially identified as a shortfall** — a year, a date, or a stated duration — so its age can be stated. No prior context is assumed: everything you need is in this prompt. **Search is ON for this task.**

**What this is not.** You are not writing analysis, not assessing the shortfalls, not recommending anything. You produce source entries and the dates they establish.

---

## The distinction that governs everything here

**A first-identification date** is when an official or authoritative body first named this shortfall as a shortfall.

- YES — "Designated a high-risk area in 2003"
- YES — "Has appeared on the list every cycle since 2015"
- YES — "First identified as a material weakness in the 1997 audit"
- YES — a stated duration: "unresolved for two decades", "outstanding since the 2011 review"

**A measurement or publication date is not.** This is what the report already has, and what you must not return as an answer:

- NO — "The 2023 report found X" (when someone counted)
- NO — "The February 2025 edition lists X" (an edition)
- NO — "2024 data show X" (a data vintage)
- NO — the document's own publication date

*Test: does the source say when the problem was first named, or when it was most recently measured? Only the first counts.*

**Dating discipline.** Date from an official or primary identification — an audit institution, a statutory review body, a government evaluation unit, a legislature's own oversight record, or the international instrument the country adopted (a ratified convention, an NDC). Do **not** date from the earliest advocacy or press publication to name the problem. Where only advocacy dating exists, return it, say so, and name the organisation's orientation.

---

## Input — the shortfalls needing dates

Each line is one documented shortfall, in the form `[topic] shortfall text`. The `[topic]` tag is only a category label — you do not need to interpret it. Find a first-identification date for each:

{{GAPS}}

---

## Where to look, in order of likely yield

1. **The country's supreme audit / oversight institution** (auditor general, government accountability office): it commonly publishes the year each area was first designated a concern — precisely a first-identification date — and one document often dates several gaps at once. Start here.
2. **Recurring reports on the same problem across years**: the earliest report in the series is the identification.
3. **Inspectorate / evaluation-unit reports** for the originating department.
4. **The originating agency's own record** — a body acknowledging a longstanding deficiency, with the date it was first recorded.
5. **Legislative oversight records** — hearings or committee reports naming the problem; and, for commitments the country adopted, the date it ratified the treaty or set the target.

If a gap resists all five, it is undatable from the official record. Say so; do not substitute a measurement date.

---

## Output — return ONE JSON object

```json
{
  "dated": [
    {
      "gap": "the gap as listed in the input",
      "field": "e.g. capacity.delivery",
      "sinceValue": "a year, a date, or a stated duration",
      "establishedBy": "source-id",
      "evidence": "the sentence that establishes it — short, closely paraphrased",
      "datingBasis": "official | advocacy",
      "orientationNote": "only where advocacy — name the organisation's orientation"
    }
  ],
  "newSources": [
    {
      "id": "lowercase-alphanumeric-hyphens, no dots",
      "name": "official title as published, in the source's own language — never translated",
      "nameFr": "…",
      "url": "deep link to the specific document, or the bilingual landing page where the file is language-locked",
      "desc": "20–30 words: what the source IS, opening with its role; what claim domain it authoritatively covers; any bias or reservation. Never the numbers drawn from it.",
      "descFr": "…",
      "publicationDate": "omit if undated",
      "accessDate": "{{TODAY}}",
      "confidence": "High | Med | Low",
      "citationType": "Fact | Interpretation",
      "volatility": "High | Med | Low"
    }
  ],
  "stillUndated": [
    { "gap": "…", "field": "…", "searched": "which of the five classes you checked", "note": "why the official record carries no first identification" }
  ]
}
```

One source may date several gaps — list it once in `newSources`, reference its id from each `dated` entry.

---

## Rules

- **`desc` states what the source IS, never the numbers drawn from it.** If a fact in a `desc` could be edited to a new value while the text citing it stayed unchanged, it does not belong there.
- **`name` is the official title as published.** Never translate it. For a bilingual source, prefer the landing page URL over a single-language deep link.
- **Primary and official sources only** for dates. A news article saying a problem is "decades old" is not a first identification.
- **Never infer or estimate a date.** If the source does not state it, the gap goes in `stillUndated`. An honest gap is a finding; an invented date is a false claim in the field whose whole point is duration.
- **`volatility`** is how fast the backed fact changes, orthogonal to `confidence`. A first-identification date does not change — these are almost all `Low`.
- **Every acronym** spelled out in full at first mention.
- **Do not reuse an id already in use.** These ids already exist — pick new, distinct ids:

{{IDS}}

---

## Self-check before returning

- Every `sinceValue` is a first identification or stated duration — no publication dates, no editions, no data vintages
- Every `dated` entry names the sentence that establishes it
- Every `establishedBy` id exists in `newSources`
- No id contains a dot; no id duplicates one already in the report's registry
- Every advocacy-based date is flagged with its orientation named
- Undatable gaps are in `stillUndated`, with what was searched

---

## After the JSON

- Counts: gaps dated, gaps still undated, new sources added
- Any source that dated more than one gap
- **Any gap where the official record shows the shortfall is materially older than the report currently implies**

---

---

> **↓ Operator note — NOT part of the prompt.** If you are the search assistant, ignore everything below; it is a reminder to the human running the harvest, not an instruction to you.

**After the harvest returns:** verify every `sinceValue` against the vintage test and every URL/id against the schema; append the verified `newSources` to the source registry (dropping any that end up uncited); rewrite `since` on the dated items of `capacity_knownAndUnbuilt_en/fr` citing the establishing ids (advocacy flags inline); leave anything `stillUndated` as `report-silent` and record it in `undatedGaps`. Then FR typography, validators, build — a SOURCES + single-field edit, nothing else.

By design the establishing `[source-id]` may be one that ends up referenced **only** from the `since` value and nowhere else in the report's prose — that is the intended, legitimate form. The register's paraphrase-only/anchored rule binds the gap *claim* (which must already be asserted, cited, in a peer field), not the `since` dating; and the since's `[source-id]` counts as a citation, so those sources are not orphans.
