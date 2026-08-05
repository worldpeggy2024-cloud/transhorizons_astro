# Targeted Pass A extension — MOFCOM primary instruments (China rare-earth countermeasures)

**Purpose:** land the PRIMARY-INSTRUMENT sources for the China economic-countermeasures situation thread (see `situation-candidate-events.from-review.md`). During the USA review this was the one item that could not be sourced cleanly — every account found was a law-firm client alert or trade-press summary, never the issuing ministry's own text. Under the AI-fabricated-stat guard (Manus/Perplexity have both invented chokepoint figures), it enters neither situation nor the peer body until a primary instrument is fetched and confirmed.

**Two-step, per the refined tool split (CLAUDE.md):** this is DISCOVERY only. Perplexity casts wide for candidate primary URLs; the candidates then go through Peggy's approval gate and a **fetch-based verification** (Claude Code opens each and confirms it is the real MOFCOM announcement, openable) before anything is registered. A search-only tool must NOT decide a URL is primary — it only surfaces candidates.

## The three instruments to find (issuer: 中华人民共和国商务部 — Ministry of Commerce, PRC / MOFCOM; export-control announcements are 公告)
1. **October 2025 rare-earth export controls** — the MOFCOM (and, where applicable, joint GACC/export-control) announcement(s) imposing rare-earth / rare-earth-technology export licensing.
2. **Suspension to 10 November 2026** — the MOFCOM announcement suspending or deferring those controls to that date.
3. **June 2026 entity listings** — the MOFCOM listing(s) (Unreliable Entity List / export-control control list) naming entities in June 2026.

## DISCOVERY task (Perplexity — cast wide, do not verify)
For each of the three, surface candidate **primary** URLs — the issuing ministry's own announcement page on `mofcom.gov.cn` (or the official gazette / State Council bulletin that reproduces it), Chinese-language original preferred. For each candidate return:
- the **official announcement number** (公告号, e.g. "2025年第XX号") and issuing body,
- the **URL** to the announcement text itself (not a summary),
- the **date**,
- one line: what it does.

You MAY use law-firm alerts or trade-press to *find* the announcement number — but the deliverable is the **ministry's own text URL**, never the alert. Return several candidates per instrument if unsure; over-return, don't pre-filter. No source objects yet — just the candidate list.

## Then (NOT Perplexity)
- **Approval gate:** Peggy keeps/rejects candidates.
- **Verification (Claude Code):** fetch each kept URL — confirm it opens and is the actual MOFCOM announcement (matching announcement number), not a redirect/404/summary. Only then build the source object.

## Source-object shape once verified (single-language Chinese source rule)
`name` = the official Chinese title **verbatim** (Chinese script); `nameFr` = the same Chinese title (do NOT translate); put an English/French translation **plus pinyin transliteration** in `desc`/`descFr`. Plus `url`, `publicationDate`, `accessDate`, `confidence`, `citationType: Fact`, `volatility` (likely High). These register, then the situation pass composes the "China economic countermeasures" thread citing them.

**Placement reminder:** the STANDING exposure (US critical-mineral concentration/dependency) is already in `economy.externalVulnerability` via USGS and stays there. These instruments are the discrete COUNTERMEASURE EVENTS → situation thread only.
