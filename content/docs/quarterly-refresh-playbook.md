# Quarterly Refresh Playbook

Run this process every three months (January, April, July, October) to keep country analyses current.

---

## Overview

Each country analysis has a `lastUpdated` date in `*.meta.yaml`. The target is no country goes more than 6 months without a refresh. High-priority countries (active crises, upcoming elections) should be refreshed monthly.

---

## Step 1 — Triage (Day 1, ~30 min)

Open `src/lib/analysedCountries.ts` and note which countries have `lastUpdated` older than 3 months.

For each stale country, decide:
- **Full refresh** — major developments since last update; redo all sections
- **Spot update** — one or two sections changed; update only those
- **Skip** — situation unchanged; bump `lastUpdated` and note "no significant change"

---

## Step 2 — Research (Per country, 1–3 hrs)

For each country requiring a full refresh:

1. Open Perplexity Deep Research and run the standard prompt from `content/docs/perplexity-authoring-template.md`
2. Read the output critically — verify surprising claims against primary sources
3. Note which sources are new (add to `*.sources.yaml`) and which are unchanged (keep existing IDs)

For spot updates:
1. Go directly to the primary sources for that section (e.g. IMF for economy, parliament site for political)
2. Update only the affected YAML fields

---

## Step 3 — Edit YAML files

For each country being updated:

```
content/countries/[CODE]/[code].en.yaml   ← update EN content
content/countries/[CODE]/[code].sources.yaml  ← add/update sources
content/countries/[CODE]/[code].meta.yaml     ← bump lastUpdated
```

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

Or trigger the `Source Health Check` workflow in the GitHub Actions tab. Review `.source-health.json` for any 404s or timeouts and fix broken URLs before the next quarterly cycle.

---

## Priority tiers

| Tier | Countries | Refresh cadence |
|---|---|---|
| 1 — Active crisis | Any country with active armed conflict or acute political crisis | Monthly |
| 2 — High volatility | Countries with elections in next 6 months or active IMF program | Every 2 months |
| 3 — Standard | All others | Quarterly |
