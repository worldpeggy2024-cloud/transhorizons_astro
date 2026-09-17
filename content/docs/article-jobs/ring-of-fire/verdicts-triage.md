# Ring of Fire — draft-3 verdicts, triage and next steps

## STATUS 2026-09-16 (later): steps 1–4 done, waiting on the draft-4 verdicts

- **Quotes (C, D + those A/E needed):** 80 quotes extended from the cached text, plus a new claim **c247** (s8 p. 19, the voluntary
  agreement). Script: tools/rof-extend-quotes.cjs (the old quote is kept as `prevQuote`). Multi-part quotes are joined with
  " […] " because " … " right after a full stop breaks the matcher's split. `quotes`: 260 exact, 2 near (c097 and c123, checked
  by eye earlier).
- **Draft-4** (ring-of-fire-draft-4.md in her folder; ledger.article → draft-4.yaml): 30 exact replacements in
  tools/draft4-edits.cjs, labelled A / B / E as in this file, plus **X = fixes found while extending the quotes (Peggy to
  confirm):**
  c013 communities are "exploring", not "building now" · c019 Ontario's list says "including" and covers the highway upgrades ·
  c021 "not required to be assessed" had no source → the assessment rests on a voluntary agreement (c247) · c033 "the deposit
  drains to the Muketei" was not in the source → Neskantaga's request raised effects on the Muketei and Attawapiskat rivers ·
  c065 "health and social services" → healthcare, especially mental health · c131 "disturbance" → changes to hydrology during
  construction or operation · c132 "conditions would apply" → the Agency recommends monitoring · c135 nothing calls the
  commenter a peatland scientist → "a public comment" · c144 the 745 is a *minimum* estimate · silence sentence: "submitters
  state that none was undertaken" → "Weenusk states that no site-specific validation…" ({c133} dropped with {c217}).
- **E decided:** c016 kept ("underground" is on the registry page) · c042 quotes Constance Lake's unaddressed concerns ·
  c049 quotes both lists; the rights-basis list includes WFN itself, so the sentence now says so · c190 kept, with the report's
  table of the 15 communities.
- **Re-attached** with tools/rof-reattach.cjs (keeps each verdict; the hash makes changed ones STALE): 223 claims + 12 extra uses;
  c075, c076, c100-2, c133-2 and c217-2 are no longer placed. F: `resolution` recorded on c213-2 and c061-2 (sentences
  unchanged). c120-2 and c140-2 wait for their new verdicts. Clones do not keep a `resolution` through a re-attach, so
  record it again after each one.
- **check:** 245 pass · 104 blockers = 101 stale verdicts + c247 with no verdict + the 2 resolved silences (these clear once
  the verdicts are merged).
- **Next:** paste ring-of-fire-draft4-verify-part-1..3.md (her folder) into three fresh memory-off chats with web search off →
  `npm run article:evidence -- verdicts ring-of-fire <file> --by "fresh-chat verifier (draft-4 part N)"` for each → `check`.
  Then the length (~4,500 words against ~3,000) and the French, both Peggy's decisions. The NEEDS SOURCE sentence on the regional
  assessment's mercury work is still open.

Verdicts recorded 2026-09-16 from three fresh memory-off chats (ring-of-fire-verdicts-part-1..3.json), 251 quoted
claims: **152 supported · 97 partial · 2 not-in-source · 0 contradicted.** Every verdict is stored in ledger.json with a
hash of its sentence and quote: rewording a sentence or extending a quote voids only that claim's verdict.

Most partials are not errors in the draft. The audit chat's quotes were kept under 15 words, so many of them do not
contain the subject of the fact ("open from around January to mid-March" without "the winter road"). Those need a
longer quote, not a different sentence.

## A. Wording that overreaches the source — edit the draft (draft-4)

| Claim | Draft says | Source says | Suggested wording |
|---|---|---|---|
| c170 | "After an unseasonably warm winter, its Chiefs declared a state of emergency…" | declared *as* unseasonably warm weather threatened the roads | "Its Chiefs declared a state of emergency during a winter when unseasonably warm weather threatened the viability of the roads." |
| c176 | fuel cost "affects whether people go out on the land at all, since harvesting success has to justify the outlay" | harvesting success is "an important factor" in whether people engage in land-based activities | "…notes that, given the high cost of fuel, harvesting success is an important factor in whether people take part in land-based activities." |
| c221, c221-2 | "at the commitments stage"; "were deferred to detailed design" | MNR asked for commitments giving it a later chance to review (p. 39 names the detailed design stage) | "…asked for a commitment giving it the opportunity to review, at the detailed design stage, …"; in the silence sentence: "…asked to review groundwater movement under a floating road at the detailed design stage" (extend quote c221 to include "detailed design stage") |
| c223 | "58 comments … remained unresolved" | the ministry made 58 comments; "comments remain unresolved" | "The environment ministry made 58 comments on the 70-page draft human health risk assessment and reported that comments remained unresolved in the final submission." |
| c214 | Fort Albany "disputes that scope" and "records the proponent's acknowledgement that cumulative effects on peatlands may be underestimated" | the proponent acknowledges *the concern* that they may be underestimated | "Fort Albany states that the cumulative effects assessment does not include the Marten Falls road, and records that the proponent acknowledges the concern that effects on peatlands may be underestimated at a project scale." |
| c113-2 | "The road is designed to operate for 75 years." | the assessment assumes a 75-year operations phase | "The assessment assumes a 75-year operations phase." |
| c138, c139 | 2C "preferred among the road corridors for having the lowest preliminary cost… against a current estimate of about $700 million" | preferred "for this factor"; $700 M is a preliminary estimate | "…route 2C was preferred on cost, with the lowest preliminary cost, $91.45 million for 107 km; a later preliminary estimate puts the capital cost at about $700 million, plus or minus 40%." |
| c125 | "the mechanism it expects" | roads "commonly" create these conditions | "It said roads across peatland commonly create flooded conditions upstream and dry conditions downstream." |
| c075, c076 | "An interim report, current to 20 January 2026, was submitted…" | 20 January applies to one section | drop "current to 20 January 2026" |
| c064 | "When the final assessment was submitted, the regional assessment information was not available." | stated in Ontario's April review, "not currently available" | "Ontario's review noted that the final assessment had been submitted while the regional assessment information was not available." |
| c172 | "…flown in for most of the year" | no duration given | drop "for most of the year" |
| c211-2 | "network-level impacts under-assessed" | network-level *hydrologic and predator-access* impacts | restore the full phrase |
| c169 | "it gives no method for the figure" | a claim about the whole page | drop the clause |
| c202 | "Five of the fifteen First Nations that are partners in the regional assessment" | "Five of the 15 communities" | "Five of the 15 communities covered by the Swift Creek report" |
| c117 | "The proponent states that … no more than 500 vehicles a day" | the 500 figure is in the federal draft report | attribute the 500 figure to the federal draft report |
| c011 | "described the result: the skills of living on the muskeg were lost…" | "we lost all these skills when we moved into the reserve" | quote the participant directly, without "the result" |
| c098 | "on the ground that there are means other than…" | check whether the analysis report makes it the ground | extend quote to the full sentence; reword if it does not |

## B. Wrong marker — remove it

- **c100-2**: "The western 51 km is on mineral soil." carries {c100} ("56 km in length"). Remove {c100}; c231 already supports the sentence.
- **c217-2**: the floating-road silence sentence carries {c217}, which is about expected impacts, not validation. Remove {c217}.

## C. Wrong locator — re-take the quote

- **c227** (the proponent's reply "relevant information from the regional assessment, if available, will be used"): the same boilerplate reply appears on p. 70 (Friends of the Attawapiskat River section) and p. 89 (Aroland section); the quote was taken from p. 70. Re-take it from p. 89 so "reply to Aroland" is right.

## D. Quote too short — extend it to the full sentence in the source, then re-verify (no draft change expected)

c001, c004, c005, c007, c008, c013, c019, c021, c023, c031, c033, c036, c044, c046, c048, c051, c052, c053, c055, c059,
c063 (show that the Agency is the one confirming), c065, c066, c070, c071, c074, c085, c088, c090, c091, c095, c096, c100,
c102, c104, c106, c110, c111, c112, c114, c115, c120, c121, c128, c129, c130, c131, c132, c135, c144, c146, c148, c151,
c152, c174, c187, c193 (include the table title "Revised Northern Food Basket"), c196 (include "One-way"), c206
(include "Musselwhite"), c207 (include "NWT diamond"), c216 (include "MNR 28"), c222 (include "MECP: Environmental
Assessment Branch" and the Marten Falls reference), c226 (include the "Aroland First Nation" section header), c229
(include the submitter), c232, c243-2, c244 (include the Marten Falls draft impact statement reference).

## E. No source yet — find one or cut the words

- **c016** "underground" (Eagle's Nest): not in the quote. Search the registry 90033 page / analysis report, or drop "underground".
- **c042** "and contests the draft conditions" (Constance Lake): not in any quote. Quote the submission's disagreement, or drop.
- **c049** 22 / 16 / 6: the figures come from counting the two lists in the ministry review (recorded on the claim as `counted`); show the verifier the lists.
- **c190** "Moosonee is not one of the fifteen communities": quote the report's list of the 15 communities (it includes Moose Cree / Moose Factory, not Moosonee), or drop the clause.

## F. Silence sentences — partial by design

c120-2, c133-2, c061-2, c140-2, c213-2 sit in sentences that state an absence ("No study in the record…", "No
document in the record shows…", "No assessment compared…"). A quote cannot show an absence; these rest on the recorded
searches in silences-search.json (gaps g-floating-validation, g-ontario-in-ra, g-corridor-modes). After the wording
fixes above, record a `resolution` on each: "absence rests on the recorded search, not on this quote".

## Order of work for the next session

1. Extend the quotes in D and C from the cached source text (sentence boundaries), run `npm run article:evidence -- quotes ring-of-fire`.
2. Make draft-4: apply A and B as exact replacements (pattern: tools/draft3-edits.cjs), decide E.
3. Re-attach draft-4 (tools/rof-attach.cjs, after clearing draft-3 placements as done for draft-2), run `check`.
4. `verify-prompt` regenerates only the claims whose verdict is missing or stale; verify in a fresh memory-off chat, web search off.
5. Then: length (4,333 words against ~3,000) and French — both Peggy's decisions.
