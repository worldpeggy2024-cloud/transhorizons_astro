# Quarterly Refresh Playbook

Run this process every three months (January, April, July, October) to keep country analyses current.

---

## Overview

Each country analysis has a `lastUpdated` date in `*.meta.yaml`. The target is no country goes more than 6 months without a refresh. High-priority countries (active crises, upcoming elections) should be refreshed monthly.

---

## Step 1 — Triage (Day 1, ~30 min)

Build the worklist **by query on the volatility axis** (rework §6.2): sources where `volatility: High`
and `accessDate` is older than the tier cadence (High = annual/on-event; Med = ~2–3 years). Each hit
points back to its claim via `[source-id]`. Also note countries whose `lastUpdated` (in
`analysis.yaml`) is older than 3 months.

For each stale country, decide:
- **Full refresh** — major developments since last update; regenerate through the two-phase pipeline
- **Spot update** — only the worklist ids' claims changed; update those facts only
- **Skip** — situation unchanged; bump `lastUpdated` and note "no significant change"

---

## Step 2 — Research (Per country, 1–3 hrs)

For each country requiring a full refresh: rerun the two-phase pipeline
(`content/docs/country-report-present-state-template.md` + `scripts/deepsearch-country-workflow.cjs`).

For spot updates — **touch only the worklist ids from Step 1**:
1. Go directly to that source (or its replacement) and verify the current value of the claim
2. Update that fact in the prose, bump the source's `accessDate`, leave surrounding prose untouched
3. New sources are added to the sources JSON block of `analysis.yaml`; never change a cited `source-id`

---

## Step 3 — Edit YAML files

For each country being updated: everything lives in ONE flat file,
`content/countries/[CODE]/analysis.yaml` (`<section>_<subsection>_<en|fr>` keys; sources as a
JSON-in-text block; bump `lastUpdated` there).

Rules:
- Never change a `source-id` that is already cited in text (breaks citation links)
- Add new sources at the bottom of `*.sources.yaml`
- If a source URL has changed, update `url` and set `lastVerified` to today

---

## Step 4 — French translation

After EN is updated, open `[code].fr.yaml` and update the corresponding sections. Or create a translation PR (see `content/docs/translation-workflow.md`) if a French speaker will handle it separately.

---

## Step 5 — Validate

```bash
node scripts/generate-country-data.cjs [CODE]
npm run validate:countries
```

Fix any errors before proceeding.

---

## Step 6 — Visual review

```bash
pnpm dev
```

Open the country page in the browser. Check:
- [ ] `lastUpdated` date shows correctly
- [ ] All citation markers are clickable and scroll to the right source
- [ ] Scorecard values look right
- [ ] FR toggle works

---

## Step 7 — Commit and push

```bash
git add content/countries/[CODE]/
git add src/data/countries/[CODE]/
git commit -m "Quarterly refresh: [COUNTRY] [YYYY-MM]"
git push
```

---

## Step 8 — Source health check (monthly)

Run manually:
```bash
node scripts/validate-sources.cjs
```

Or trigger the `Source Health Check` workflow in the GitHub Actions tab. Review `.source-health.json` for any 404s or timeouts and fix broken URLs before the next quarterly cycle. The health check also flags **stale `volatility: High` sources** (accessDate older than the annual/on-event cadence) — treat those as next cycle's worklist even when the URL still resolves.

---

## Priority tiers

| Tier | Countries | Refresh cadence |
|---|---|---|
| 1 — Active crisis | Any country with active armed conflict or acute political crisis | Monthly |
| 2 — High volatility | Countries with elections in next 6 months or active IMF program | Every 2 months |
| 3 — Standard | All others | Quarterly |
