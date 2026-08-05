# Situation candidate events — derived from the REVIEWED report (2026-08-04)

**Why this file:** the Pass Zero-B list embedded in `situation-pass.prompt.md` is the July 2026 Perplexity scan — the same harvester that under-delivered Pass A (79 of the report's 174 sources were added during the manual review). This list is derived instead from the **finished report's own event-bearing sources**, which are more complete and better-sourced than that scan. Use this as the situation pass's "starting list to VERIFY" in place of / alongside the stale July list.

**Scope reminder (prompt CONTENT RULES):** max 8 events across all threads; only events that **materially changed the US position** (not notable news); **exclude standing-condition facts** (they belong in peer sections); every event cites a registry `[source-id]`; where an event overrides a peer claim, put it in `peerCorrections`, don't duplicate. All dates/sources below must still be verified against a primary source ON THE RUN DATE.

Threads ordered by recency of last activity (most recent first). Every `[id]` below is already in the registry — no `newSources` expected unless verification turns up a gap.

## Thread: Iran war
- 2026-02-28 — US launches major combat operations against Iran (missile/nuclear/naval targets). `[iran-ops-transcript]`
- 2026-04 — "Operation Epic Fury" / ceasefire announced. `[whitehouse-epic-fury-ceasefire]`
- 2026-07-08 — ceasefire collapses; hostilities resume. `[cnbc-iran-ceasefire-over]`
- 2026-08-04 — active war; CENTCOM blockade-interdiction figures. `[cnn-iran-war-august2026]`  *(supersedes the retired `cnn-iran-war-july18`, still cited in baseline/actors — repoint when those recompose)*
- **Note:** July run-note #2 flagged a contradiction between an April "ceasefire" and security.diplomacy showing active hostilities — the review resolved it toward continued war (ceasefire collapsed). Confirm on run date.

## Thread: Venezuela — capture of Maduro
- 2026-01-03 — US military raid captures President Maduro, transported to US on narcotrafficking charges. `[maduro-capture-wardept]` `[crs-maduro-capture]`
- **Cross-ref:** already carried in security.diplomacy + actors; keep the *event* here, the standing posture in the peer body.

## Thread: Multilateral retreat *(NOT in the July Pass Zero-B scan — review-added)*
- 2026-01-07 — State Dept announces withdrawal from 66 international organizations. `[state-withdrawal-66-2026]`
- 2026-01-16 — Presidential memorandum (91 FR 2281) names each body for withdrawal. `[potus-memo-withdrawals-2026]`
- Paris Agreement withdrawal (EO 14162 process). `[crs-r48504-paris]`

## Thread: Domestic military deployment / federalized Guard *(NOT in the July scan — review-added)*
- 2025-07-01 — Task Force 51 releases 150 California National Guard members (drawdown of LA federal-protection mission). `[northcom-tf51-release-2025]` `[northcom-federal-protection-mission]`
- 2025-12-23 — *Trump v. Illinois* (25A443): SCOTUS emergency-docket action on Guard federalization. `[scotus-trump-v-illinois-2025]` `[crs-r42659-posse-comitatus]`

## Thread: Shutdown cluster
- 2025-07-04 — OBBBA (H.R.1) signed *(window-edge; July run-note #3 flagged keep-or-drop — it's the funding-pool context for the cluster)*. `[obbba-hr1]`
- 2025-10-29 — CBO scenario analysis of the FY2026 shutdown. `[cbo-shutdown-61823]` `[crs-r48832-shutdowns]`
- 2026-01-24/27 — killing of Alex Pretti by CBP agents → Senate Democrats withdraw DHS-bill support *(July run-note #1: needed a primary; the review supplied one)*. `[cbs-pretti-cbp-report]`
- 2026-02-03 — Consolidated Appropriations Act 2026 (H.R.7148) ends the first shutdown. `[hr7148-appropriations]`
- 76-day DHS shutdown (longest on record). `[house-approps-dhs-76day]`

## PENDING — event-shaped, but BLOCKED on a targeted Pass A extension (not sourceable closed-book)
Items flagged during review as belonging in situation, but with no primary source in the registry. The situation pass is closed-book and cannot harvest — run a **targeted Pass A extension (Perplexity)** against the PRIMARY instrument texts to land the sources first, then add the thread.

- **China economic countermeasures** *(candidate thread)* — China's October 2025 rare-earth export controls; their suspension to 10 November 2026; June 2026 entity listings. Bears on US external vulnerability (critical-mineral supply). The STANDING exposure (US mineral concentration/dependency) is already in `economy.externalVulnerability` via USGS; these are the discrete COUNTERMEASURE EVENTS. **Blocker:** only law-firm client alerts / trade-press found — needs **primary MOFCOM announcement texts**. Until sourced, it enters neither situation nor the peer body (AI-fabricated-stat guard). Chat Claude met the `sanctions exposure` element by inverting it (US as issuer), so this is enrichment, not a required-element gap.

## Situation-pass judgement calls (fold / drop candidates — not auto-events)
- `[ndstrategy-2026]` 2026-01-22 NDS release — likely **standing policy** → security peer section, not a situation event (unless the release itself is the rupture).
- `[dhs-border-releases-2026]` 2026-07-16 "14 months zero releases" — likely a **standing enforcement statistic** → security.internal/transnationalExposure, not an event.
- The June-2026 SCOTUS merits rulings (`trump-v-slaughter/cook/barbara`, `watson-v-rnc`) — **structural** (constitutional order) → already in political.constitutionalSubstrate; fold, don't list as events.
- July run-note #4 (source concentration on R48832) and #3 (OBBBA window call) still apply — resolve explicitly in `passNotes`.
