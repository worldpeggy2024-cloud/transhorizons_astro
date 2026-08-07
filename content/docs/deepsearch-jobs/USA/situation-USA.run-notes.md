# Situation pass — USA — run notes (run date 2026-08-06)

Deliverable is `situation-USA.json`. These notes hold what does not belong in the JSON: observations about the input file, the candidate scan, and the prompt itself.

## Input file state

`situation-pass_input_virgin.yaml` — 88 keys, 174 sources, 33 peer fields populated in both languages.

- `situation_en` / `situation_fr` / `situation_lastUpdated` — empty. Sequencing guard cleared.
- `scorecard_*`, `scorecard_anchors`, `baseline_en/fr`, `capacity_knownAndUnbuilt_en/fr`, `actors_*` — all **present and empty**. The Keystatic declaration fix has held on the United States side; nothing this pass produces can be stripped at save.
- No legacy scaffolding fields (`macroReality`, `permitting`, `executiveSnapshot`) remain.
- `situation_lastUpdated` is empty and is manual: set it to **2026-08-06** at apply.
- 20 of the 174 registry ids are cited nowhere in the file. Four of them are event sources this pass now puts to work: `scotus-learning-resources`, `crs-lsb11398-tariffs`, `crs-maduro-capture`, `cnn-iran-war-july18` (the last still uncited after this pass).

## Result

8 events across 4 threads, at the cap. 46 verdicts recorded: 7 kept, 25 folded, 14 dropped — 7 kept ids against 8 events, because one event has no candidate id (below).

Thread order, by most recent activity: Iran war → tariffs → Western Hemisphere → city policing.

## The candidate scan was stale

The scan ran 2026-08-04. The single largest tariff change of the year happened **2026-07-24** — the Section 122 surcharge lapsed at its statutory limit and a Section 301 regime took effect the same moment — and no candidate carries it. The scan proposed `section-122-import-surcharge` as a standing February fact, which by the run date was five months out of date.

This is not a curation problem, it is a scan-coverage problem, and it is the one failure mode this pass cannot absorb: everything else on the list could be verified, corrected or dropped, but an event that is not on the list at all only enters if the run happens to look. Worth checking what the scan's window and source set actually cover before the next country.

Two smaller staleness findings, both corrected in the JSON: the scan dated the Iran ceasefire 7 April (it was 8 April) and the resumption 7 July (the declaration was 8 July).

## Better primaries than the scan proposed

- Hemispheric strikes: the scan offered a White House War Powers report. The **Lead Inspector General quarterly report to Congress on Operation Southern Spear**, published 31 July 2026, is a statutory oversight document carrying strike counts, casualties, assets and obligations by quarter. It is a better source in every respect and it is a recurring series, so it re-dates cleanly each quarter.
- Section 122: the proclamation as published states **10 percent**. Several secondary trackers report a rise to 15 percent on 22 February 2026; no amending proclamation was found. The published figure is what entered the field.

## Prompt observations

1. **The eight-event cap and the peerCorrections list are in tension, and the cap should win — but the prompt does not say so.** With 46 candidates and 8 slots, most of the work of this run went into peerCorrections (14 entries), not into the field. That is the right outcome, but the prompt frames peerCorrections as a side-effect ("where an event supersedes or contradicts a claim"), when in practice it is where a folded candidate lands. Consider saying explicitly that a folded event routes to peerCorrections by default.

2. **peerCorrections has no source contract.** A correction that says "the field must now state X" is an addition, and the rework's own review method requires every addition to declare its sourcing route. Four corrections here rest on primaries located on the run date; four rest on candidates not verified today and say so. Nothing in the prompt requires that distinction, and without it a future run will emit unmarked corrections that look equally solid.

3. **Uncited newSources.** The prompt defines `newSources` as sources cited in the situation field. The primaries found for New START, S.Res. 526, Public Law 119-98 and the Bavi declaration support *corrections*, not events, so emitting them would create four uncited registry ids — the exact defect flagged on the Canada run. They are given as URLs inside the corrections instead. If that is wrong, the prompt should say where correction-sources go.

4. **`situation` still has no dot** and so still collides with the source-id parser wherever something anchors to it. Nothing in this pass depends on it, but the fix agreed earlier (test membership in the set of valid field paths first, fall back to source-id lookup) is still outstanding.

5. **Structural finding, security.diplomacy.** That field currently carries a five-sentence dated chronology of the Iran war — war, ceasefire, memorandum, collapse, blockade figures. That is event material sitting in a standing-conditions field, and after this pass it is duplicated. The peer field should keep what only it can carry (the mediation channels, the venues, the effect on allied relationships) and hand the sequence to `situation`. Filed as a correction, but it is really a symptom: before this field existed, events had nowhere to go and diplomacy absorbed them. Worth checking the other five peers for the same residue before the next country.

## Largest single gap found in the peer body

**The economy section contains no tariff content at all.** `economy_externalVulnerability` gives 2025 trade balances and partner concentration; `economy_realEconomy` attributes 2026 growth to reconciliation and the shutdown rebound. Neither mentions that a flat surcharge applied to most imports for five months of 2026, that the authority behind the previous wall was struck down, or that a Section 301 regime covering 60 economies now applies. A reader of the economy section would not know the country had a tariff policy.

This is the same class of defect as the `security.diplomacy` naming gap found on the actors run: not a template hole, but a field under-answering its own question.
