# Pass Zero Prompt (calibration) — United States

This is a LOOKUP PASS, NOT AN ANALYSIS PASS. You are not writing a report and not
reasoning about the country. You are identifying which verifiable primary instruments
exist for United States, so a later pass can be anchored to them.

Return ONLY the JSON object below. No prose, no commentary, no explanation.

HARD RULES
- Every value must be backed by an artefact that can be opened: a URL to the actual
  page, document, or ruling. Not a description of one. Not a homepage. Not a search
  result. If you cannot supply an openable URL, the value is UNRESOLVED.
- Every URL must be a primary, official source: the institution's own site, the
  court's own publication, the statute's own text. Not an encyclopedia, not a news
  article, not an aggregator, not a think tank. If only a secondary source can be
  found for a value, the value is UNRESOLVED.
- You are PERMITTED AND REQUIRED to answer "UNRESOLVED". If the structure does not
  exist, is contested, or cannot be established from a primary source, return
  "UNRESOLVED" and state why in the note field. An honest gap is a CORRECT output.
  A fabricated clean structure is a FAILURE. Do not force United States into a structure
  it does not have.
- Do not translate institution, statute, or ruling names. Capture them as published,
  in the source's own language(s).
- Acronyms: spell in full on first mention, abbreviation in parentheses, short form
  thereafter. No exceptions.
- note fields describe what the instrument IS. They must NEVER contain current figures: no
  seat counts, no party breakdowns, no vacancy counts, no poll percentages, no composition
  data. The live standings URL is read by a later pass on its own run date; do not pre-answer
  it here.
- Court rulings must resolve to the court's own published opinion or the national law
  library's official reports scan. Not an annotated commentary essay, not a commercial
  aggregator.
- powerLocus: if the note says the question is contested or recommends human verification, the
  value is UNRESOLVED, not true. A value and a note that contradict each other is a failure.

SCHEMA
{
  "legislature": {
    "structure": "unicameral | bicameral | none | UNRESOLVED",
    "chambers": [
      { "name": "", "nameFr": "", "seats": 0, "liveStandingsUrl": "",
        "electionCycle": "", "note": "" }
    ],
    "note": ""
  },
  "executive": {
    "type": "parliamentary | presidential | semi-presidential | party-state | monarchy | military | other | UNRESOLVED",
    "drawnFromLegislature": "true | false | UNRESOLVED",
    "unifiedDividedApplies": "true | false | UNRESOLVED",
    "sourceUrl": "", "note": ""
  },
  "powerLocus": {
    "constitutionalOrganIsWherePowerSits": "true | false | UNRESOLVED",
    "actualLocus": "",
    "sourceUrl": "",
    "note": "JUDGMENT FIELD — not a lookup. Flag clearly; the human verifies this one by hand."
  },
  "substrateInstruments": [
    { "id": "short-slug (lowercase-hyphens; Pass B cites the instrument by this id)", "kind": "founding text | apex-court ruling | statutory codification of the sovereignty relationship | treaty | constitutional amendment | legislature's non-partisan research service | official gazette",
      "name": "", "url": "", "note": "" }
  ],
  "legalOrders": {
    "structure": "single statutory | plural | UNRESOLVED",
    "orders": [ { "kind": "statutory | customary | religious | other", "governs": "", "sourceUrl": "" } ],
    "note": ""
  },
  "territorialControl": { "status": "full | contested | UNRESOLVED", "sourceUrl": "", "note": "" },
  "executionRegime": {
    "publishedApprovalsRegimeExists": "true | false | UNRESOLVED",
    "permittingAuthorityUrl": "",
    "note": "If no published approvals regime exists, say so — permitting timelines are then not the instrument."
  },
  "cohesionInstrument": {
    "primaryBarometer": "", "url": "",
    "selfReportReliabilityFlag": "unconstrained | partisan-sorted | constrained | UNRESOLVED",
    "note": "Flag where self-report may measure preference falsification rather than trust. constrained means respondents are not free to answer honestly (repression, preference falsification). partisan-sorted means respondents answer honestly but responses track which party holds power rather than stable underlying trust. Do not use constrained for a free society with high polarisation."
  },
  "periphery": { "value": "", "sourceUrl": "", "note": "" },
  "subnationalTerm": { "en": "", "fr": "", "note": "" },
  "religionCountReliability": { "flag": "", "sourceUrl": "", "note": "" }
}

substrateInstruments — completeness (the STABLE vs IN MOTION finding depends on this list being complete):
- The list must include the rulings that show whether the substrate is STABLE or IN MOTION. Required: every apex-court ruling of the last five years that reallocates power between levels of government, alters the constitutional status of the executive, changes the reach of the country's founding or re-founding instruments, or affects the jurisdiction of any distinct legal order. A list containing only historic foundational rulings is incomplete by construction — it can only produce a finding of "stable."
- Where a country has a legal re-founding (later amendments or instruments that reset the original terms), it is a separate instrument, not folded into the founding text.
- Where a country holds territories under a distinct constitutional regime, that regime's founding rulings are instruments.

legalOrders — classification:
- 'customary' means unwritten traditional law running parallel to statute. Peoples with written constitutions, statutory codes and courts of record are NOT customary — use 'other' and describe the basis of the sovereignty.
- Territories held under a distinct constitutional regime are their own legal order.
