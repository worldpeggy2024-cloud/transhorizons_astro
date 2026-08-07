# Situation pass — MERGED candidate events (single input)

**46 candidates = 43 blind-scan events (`pass-zero-b.events.json`, run 2026-08-04, every URL fetch-verified to a primary) + 3 report-supplement events the scan missed.** `situation-pass.prompt.md` points here for its candidate list.

**How to use this:** the situation field caps at **≤8 events across all threads**. This is a POOL to curate, not content — verify each on the run date, thread it, and record a `passNotes` verdict (kept / folded / dropped) for **every** id. Provenance and registry-overlap are noted so you cite an existing `[registry-id]` where the report already holds the right primary, and emit `newSources` only for genuinely new ones. `SRC:` = the scan's fetched primary; `REG:` = an existing registry source that already covers it.

---

## Candidate threads (suggested groupings — you decide the final ≤8)

### A. Domestic use of the military — federalized Guard & city interventions *(major new thread; report had only the Illinois piece)*
- 2025-08-11 `dc-crime-emergency-guard` — EO 14333 placed DC police under federal command + Guard on the streets; template later reused. SRC: federalregister.gov EO 14333.
- 2025-09-15 `memphis-guard-task-force` — Memphis Safe Task Force; DC model extended to a state city. SRC: whitehouse.gov memo.
- 2025-10-04 `illinois-guard-federalization` — 10 U.S.C. 12406 federalized ≥300 IL Guard over the Governor's objection. SRC: whitehouse.gov memo. REG: `scotus-trump-v-illinois-2025`, `northcom-federal-protection-mission`, `crs-r42659-posse-comitatus`.
- 2025-11-26 `dc-national-guard-ambush` — Guardsman Sarah Beckstrom killed near Farragut West. SRC: justice.gov USAO-DC.

### B. Western Hemisphere military action
- 2025-09-01 `counter-narcotics-lethal-strike-campaign` — standing lethal strikes in the Caribbean/E. Pacific outside any AUMF (date is "Since September 2025", not a first-strike date). SRC: whitehouse.gov §1549(a) report.
- 2026-01-03 `venezuela-maduro-capture` — Maduro taken into US custody by military operation in Caracas. SRC: state.gov INL. REG: `maduro-capture-wardept`, `crs-maduro-capture`.

### C. Iran war
- 2026-02-28 `iran-war-operation-epic-fury` — full interstate war under claimed Article II. REG: `iran-ops-transcript`, `whitehouse-epic-fury-ceasefire`.
- 2026-04-07 `iran-ceasefire-april-2026` — ceasefire after ~5½ weeks. REG: `whitehouse-epic-fury-ceasefire`, `cnbc-iran-ceasefire-over`.
- 2026-06-17 `iran-memorandum-of-understanding` — **new**: MOU on Strait of Hormuz navigation. SRC: whitehouse.gov SAP H.Con.Res.89.
- 2026-07-07 `iran-hostilities-resumed` — **new**: war restarted; report's current-state source is `cnn-iran-war-august2026`. SRC: whitehouse.gov SAP H.Con.Res.89.

### D. Shutdown cluster & appropriations
- 2025-10-01 `shutdown-2025-forty-three-days` — 43-day full-govt shutdown (1 Oct→12 Nov). SRC: govinfo PL 119-37. REG: `cbo-shutdown-61823`, `crs-r48832-shutdowns`. **⚠ R48832 supports the duration but NOT "longest full-govt shutdown on record" — that superlative needs its own source or comes out.**
- 2026-01-31 `shutdown-january-2026` — 2nd shutdown; resolved all but a 2-week DHS extension. SRC: whitehouse OMB M-26-06. REG: `hr7148-appropriations`.
- 2026-02-14 `dhs-shutdown-2026` — 75-day DHS-only shutdown. SRC: whitehouse OMB M-26-08. REG: `house-approps-dhs-76day`.
- 2026-06-10 `secure-america-act-reconciliation` — PL 119-98 locked multi-year immigration-enforcement funding via reconciliation. SRC: govinfo PL 119-98.

### E. Multilateral / treaty retreat
- 2026-01-07 `international-organizations-withdrawal` — memo withdrawing from a defined set of IOs/treaties. SRC: whitehouse.gov memo. REG: `potus-memo-withdrawals-2026`, `state-withdrawal-66-2026`.
- 2026-01-22 `who-withdrawal-completed` — **new**: WHO membership terminated (Rubio/Kennedy joint statement). SRC: state.gov.
- 2026-02-05 `new-start-expiry` — **new**: last US-Russia strategic-arms treaty lapsed, no successor limits. SRC: state.gov.
- *(Paris Agreement withdrawal already in report: REG `crs-r48504-paris`.)*

### F. Immigration enforcement
- 2025-09-19 `h1b-entry-restriction-payment` — $100k per-petition charge on H-1B entry. SRC: federalregister.gov proclamation.
- 2025-12-16 `entry-restriction-expansion-december-2025` — widened country-based entry bars. SRC: federalregister.gov proclamation.
- 2026-01-07 `minneapolis-immigration-enforcement-killings` — two US citizens (Good, Pretti) killed by federal agents during an enforcement surge. SRC: House Oversight minority-staff report *(caveat: leans on news; a primary for the killings is thin)*. REG: `cbs-pretti-cbp-report` (Pretti only).

### G. Tariffs
- 2026-02-20 `scotus-ieepa-tariffs-struck-down` — *Learning Resources v. Trump*: IEEPA doesn't authorize tariffs; most of the tariff wall invalidated. SRC: supremecourt.gov slip op. REG: `crs-lsb11398-tariffs`.
- 2026-02-20 `section-122-import-surcharge` — same-day §122 surcharge substituted for the struck-down tariffs. SRC: federalregister.gov proclamation.

---

## Likely FOLD to peer sections (structural/standing — NOT situation unless the discrete event itself is judged a rupture)
- **SCOTUS rulings → `political.constitutionalSubstrate` / `political.rightsAndChecks`:** `scotus-slaughter-humphreys-overruled` (REG `trump-v-slaughter-2026`, `crs-lsb11448-slaughter`), `scotus-cook-federal-reserve` (REG `trump-v-cook-2026`, `crs-lsb11449-cook`), `scotus-barbara-birthright-citizenship` (REG `trump-v-barbara-2026`), `scotus-callais-voting-rights-act` (new), `scotus-mullin-tps-terminations` (new).
- **Standing-policy EOs / laws → their peer field:** `department-of-war-restored` (security.military naming), `ndaa-2026-iraq-aumf-repeal` (security.military), `pardons-2020-election-offenses` (rightsAndChecks), `muslim-brotherhood-fto-designation` (security.internal/transnational), `federal-elections-citizenship-verification-eo` (rightsAndChecks/stateStructure), `schedule-policy-career-eo` (capacity.publicServices/steering), `epa-endangerment-finding-rescission` (territory.climate/transition), `aca-enhanced-subsidies-lapse` (capacity.publicServices), `california-proposition-50-redistricting` (political.stateStructure), `epstein-files-transparency-act` + `epstein-files-published` (transparency — likely drop unless judged material).
- **Political-violence / disaster events (judgement calls):** `charlie-kirk-assassination` (society.cohesion vs situation), `january-2026-ice-storm` (disaster — situation vs territory.climate).

## UNRESOLVED — need a primary before entry (keep flagged; do not fabricate)
- `no-kings-mass-protests-october-2025` (2025-10-18) — mass mobilisation, only news/advocacy sources.
- `immigration-enforcement-general-strike` (2026-01-30) — mass mobilisation, no primary.
- `super-typhoon-bavi-marianas` (2026-07-06) — FEMA records exist but 403/unopenable; no FR declaration yet.
- `senate-pay-withholding-resolution` (2026-05-14, **report-supplement**) — needs the Senate S.Res. number + vote (senate.gov / Congressional Record); July run-note #1 flagged this.

## Report-supplement (3 the scan missed)
- `national-defense-strategy-2026` (2026-01-22) — REG `ndstrategy-2026`. **Likely FOLD** to the security peer (standing strategy, not a discrete rupture).
- `senate-pay-withholding-resolution` (2026-05-14) — UNRESOLVED (above).
- `obbba-signed` (2025-07-04) — REG `obbba-hr1`. **Outside the 12-month window** but load-bearing shutdown-cluster context (July run-note #3): keep as the cluster's opening event or drop — state which.

## Run notes
- Verify every event on the run date; a June/July slip-opinion or SAP may have been revised.
- Prefer the scan's fetched primary; cite the existing `REG` id when it's the same or better instrument, else `newSources` (all schema fields incl. volatility).
- Structural facts (seat counts, standing policy, budget measures) belong in peer sections — this field holds only events with no home there.
