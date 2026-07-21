# Pass A extension — first-identification dates

**Country:** United States (États-Unis) · **Run date:** 2026-07-21

A targeted source harvest. No project context is assumed — everything you need is in this prompt.

**What this is.** A country report carries a register of documented shortfalls the country has
not closed. Each entry should state **how long the shortfall has stood**. For the gaps listed
below, the sources already gathered give only *measurement* dates — when someone last counted —
not *identification* dates. Find sources that establish when each shortfall was **first
officially identified**.

**What this is not.** You are not writing report text, not assessing the gaps, not
recommending anything. You produce source entries and the dates they establish.

**Search is ON for this task.**

---

## The distinction that governs everything here

**A first-identification date** is when an official or authoritative body first named this
shortfall as a shortfall.

- YES — "Designated a high-risk area in 2003"
- YES — "Has appeared on the list every cycle since 2015"
- YES — "First identified as a material weakness in the 1997 audit"
- YES — a stated duration: "unresolved for two decades", "outstanding since the 2011 review"

**A measurement or publication date is not.** This is what the report already has, and what you
must not return as an answer:

- NO — "The 2023 report found X" (when someone counted)
- NO — "The February 2025 edition lists X" (an edition)
- NO — "2024 data show X" (a data vintage)
- NO — the document's own publication date

*Test: does the source say when the problem was first named, or when it was most recently
measured? Only the first counts.*

**Dating discipline.** Date from an official or primary identification — an audit institution,
a statutory review body, a government evaluation unit, a legislature's own oversight record. Do
**not** date from the earliest advocacy or press publication to name the problem. Where only
advocacy dating exists, return it, say so, and name the organisation's orientation.

---

## Input — the gaps needing dates

- [capacity.delivery] Reaching a state of good repair across the eighteen infrastructure categories graded in 2025 requires $9.1 trillion, against $5.4 trillion of forecast public and private investment over 2024–2033, leaving a $3.7 trillion shortfall; the grading body is a professional engineering society with a known advocacy orientation toward higher infrastructure spending.
- [capacity.delivery] The federal government has great difficulty controlling costs across a procurement portfolio of more than $750 billion, with major acquisitions at the Departments of Defense, Energy and Veterans Affairs and at the National Aeronautics and Space Administration experiencing cost growth, schedule delays or both, and with weapon-systems acquisition and information-technology acquisition and management both regressing between the 2023 and 2025 high-risk assessments.
- [capacity.delivery] The Department of Veterans Affairs electronic health record modernisation, estimated in 2022 at $49.8 billion in life-cycle costs — $32.7 billion for thirteen years of implementation and $17.1 billion for fifteen years of sustainment — had been deployed to six locations as of December 2024, with more than 160 remaining.
- [capacity.delivery] A 2023 operational risk assessment found 51 of the Federal Aviation Administration's 138 air traffic control systems (37%) unsustainable and a further 54 (39%) potentially unsustainable.
- [capacity.publicServices] The February 2025 high-risk list contains thirty-eight areas, a substantial block of which covers continuously delivered public services: Veterans Affairs health care, Medicare and improper payments, Medicaid programme integrity, oversight of medical products, leadership and coordination of public health emergencies, and federal programmes serving tribes and their members.
- [capacity.publicServices] Twenty of the thirty-eight high-risk areas are on the list in part because of skills gaps or inadequate staffing.
- [capacity.publicServices] The Food and Drug Administration conducted an average of 917 foreign food safety inspections a year over fiscal years 2018–2023, about 5% of its own annual target of 19,200.
- [capacity.publicServices] Fifty-three per cent of public schools reported being understaffed entering the 2022–23 school year, among them 65% in special education and 45% in general elementary teaching; the share of public schools hiring for at least one open teaching position rose from 66% in 2011–12 to 80% in 2020–21 with difficulty rising across all twelve reported subject fields, completions of teacher preparation programmes fell 20% from 189,200 in 2012–13 to 151,100 in 2019–20, and the difficulty is concentrated in higher-poverty, rural and town schools.
- [capacity.approvals] Environmental impact statements run well past the Council on Environmental Quality's own recommended limits of 150 pages, or 300 for proposals of unusual scope or complexity: across 761 actions with a final statement published between 2013 and 2018, draft statements averaged 575 pages, with appendices averaging a further 584 pages at draft stage and 1,042 at final.
- [territory.biosphere] Fisheries management is limited by assessment coverage as much as by harvest: of the 506 federally managed stocks and stock complexes covered by the 2023 report to Congress, only 364 had a known overfishing status and only 263 a known overfished status.
- [territory.climate] The country ranks among the high-readiness economies on adaptive capacity at national scale, but that capacity is not distributed to the exposed populations: low-income neighbourhoods, including those historically affected by redlining, can be as much as 12°F hotter during heatwaves than wealthier neighbourhoods in the same city and face substantially higher flood risk, and Americans over 65 are several times more likely than younger people to die of heat-related cardiovascular disease.
- [political.rightsAndChecks] Access to civil justice stands at 112th of 143 countries in the 2025 Rule of Law Index, against 27th of 143 for the country overall.
- [society.wellbeing] Race and ethnicity are misclassified on death certificates to a degree the state measures but has not repaired: uncorrected age-adjusted death rates understate deaths by 34% for the non-Hispanic American Indian and Alaska Native population and by 3% for the Hispanic and non-Hispanic Asian populations, so uncorrected series systematically flatter the mortality gradient.

---

## Where to look, in order of likely yield

1. **The Government Accountability Office High-Risk List.** It publishes the year each area was
   designated — precisely a first-identification date — and one document likely dates several
   of these gaps at once. Start here.
2. **Government Accountability Office recurring reports** on the same problem across years: the
   earliest report in the series is the identification.
3. **Inspector General reports** for the originating department.
4. **The originating agency's own record** — a department acknowledging a longstanding
   deficiency, with the date it was first recorded.
5. **Congressional oversight records** — hearings or committee reports naming the problem.

If a gap resists all five, it is undatable from the official record. Say so; do not substitute
a measurement date.

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
      "url": "deep link to the specific document, not a landing page",
      "desc": "20–30 words: what the source IS, opening with its role; what claim domain it authoritatively covers; any bias or reservation. Never the numbers drawn from it.",
      "descFr": "…",
      "publicationDate": "omit if undated",
      "accessDate": "2026-07-21",
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

One source may date several gaps — list it once in `newSources`, reference its id from each
`dated` entry.

---

## Rules

- **`desc` states what the source IS, never the numbers drawn from it.** If a fact in a `desc`
  could be edited to a new value while the text citing it stayed unchanged, it does not belong
  there.
- **`name` is the official title as published.** Never translate it.
- **Primary and official sources only** for dates. A news article saying a problem is "decades
  old" is not a first identification.
- **Never infer or estimate a date.** If the source does not state it, the gap goes in
  `stillUndated`. An honest gap is a finding; an invented date is a false claim in the field
  whose whole point is duration.
- **Deep-link the `url`** to the specific document.
- **`volatility`** is how fast the backed fact changes, orthogonal to `confidence`. A
  first-identification date does not change — these are almost all `Low`.
- **Every acronym** spelled out in full at first mention.
- **Do not reuse an id already in the report's registry.** The existing ids are:

obbba-hr1, crs-r48832-shutdowns, maduro-capture-wardept, iran-ops-transcript, ndstrategy-2026, hr7148-appropriations, senate-partydiv, house-partybreakdown, iiss-military-balance-2026, sipri-milex-2025, usgs-mcs-2026, eia-aeo-2026, cbo-budget-outlook-2026, cbo-demographic-outlook-2026, census-popclock, census-poprelease-2026, freedomhouse-usa-2026, transparency-cpi-2025, vdem-democracy-report-2026, wjp-rule-of-law-2025, climateactiontracker-usa, ndgain-country-index, eia-power-outlook-2026, un-comtrade, census-foreign-trade, congress-gov-portal, federal-register, constitution-usa-1787, scotus-opinions-portal, usc-title25, senate-dailypress, crfb-cbo-outlook-2026, eia-emissions-outlook, fao-forest-water-usa, census-acs-language, pewresearch-religious-landscape, pew-trust-in-government, gallup-confidence-institutions, acled-usa, dhs-cbp-border-stats, treasury-tic-debt-holders, census-acs-dp05, nchs-mortality-2024, nces-condition-of-education, asce-infrastructure-report-card-2025, gao-high-risk-list, gao-high-risk-cost-schedule-2025, nca5-fifth-national-climate-assessment, nchs-mortality-2023-databrief, nces-condition-of-education-2024-report, ceq-eis-timeline-factsheet-2020, permits-performance-gov-data-portal, gao-nepa-review-2014, usgs-water-use-united-states, usda-ers-major-land-uses, noaa-status-of-stocks, permits-performance-gov-dashboard, ceq-eis-timelines-2010-2024, reconstruction-amendments, marbury-v-madison-1803, marshall-trilogy, insular-cases-1901, shelby-county-2013, mcgirt-v-oklahoma-2020, oklahoma-v-castro-huerta-2022, wv-v-epa-2022, haaland-v-brackeen-2023, loper-bright-2024, trump-v-usa-2024, trump-v-casa-2025, trump-v-slaughter-2026, trump-v-cook-2026, trump-v-barbara-2026, watson-v-rnc-2026, crs-congress-gov, calibration-executive-source, whitehouse-epic-fury-ceasefire, cnbc-iran-ceasefire-over, cnn-iran-war-july18, cbs-pretti-cbp-report, house-approps-dhs-76day, scotus-learning-resources, crs-lsb11398-tariffs, crs-maduro-capture, nato-member-countries, state-collective-defense-arrangements, state-major-non-nato-ally-status, crs-overseas-basing-r48123, crs-aukus-indo-pacific, crs-aukus-pillar2-r47599, fortune-500-2026, goldman-hyperscaler-capex-2026, crs-dod-contractors-primer, dod-top100-contractors-list, bls-union-members-2025, epi-unionization-increase-2025

---

## Self-check before returning

- Every `sinceValue` is a first identification or stated duration — no publication dates, no
  editions, no data vintages
- Every `dated` entry names the sentence that establishes it
- Every `establishedBy` id exists in `newSources`
- No id contains a dot; no id duplicates one already in the report's registry
- Every advocacy-based date is flagged with its orientation named
- Undatable gaps are in `stillUndated`, with what was searched

---

## After the JSON

- Counts: gaps dated, gaps still undated, new sources added
- Any source that dated more than one gap
- **Any gap where the official record shows the shortfall is materially older than the report
  currently implies**
