# Critical Minerals Map Refresh Playbook

Run this process monthly, and run an out-of-cycle update within 72 hours of major supply shocks, export controls, or sanctions changes.

---

## Scope

This playbook covers the world map at `/tools/critical-minerals-map` and the operational metadata in `src/data/criticalMineralsMapMetadata.js`.

---

## Cadence

- Monthly: source health and verification
- Quarterly: context and geopolitical notes review
- Annual: full numeric refresh anchored on new USGS MCS release
- Event-driven: urgent patch for major policy/geopolitical shifts

---

## Step 1 - Source triage (Day 1)

1. Open each URL listed in `src/data/criticalMineralsMapMetadata.js` under `sources`.
2. Confirm the source still resolves and still publishes the expected dataset/report.
3. Record any major revisions that affect map percentages or notes.

If any source URL has changed, update the URL in metadata immediately.

---

## Step 2 - Data update

1. Update mineral percentages and notes in `src/data/criticalMineralsMapData.ts`.
2. Keep values in percentage points and avoid changing IDs/country keys unless needed.
3. Update `datasetVersion`, `lastUpdated`, and `sourceLastVerified` in `src/data/criticalMineralsMapMetadata.js`.

Recommended version format: `YYYY.MM.DD`.

---

## Step 3 - Validate

Run:

```bash
npm run validate:critical-minerals
```

This check fails when:
- Metadata dates are invalid
- Source verification is stale beyond `staleAfterDays`
- Geometry path is missing in `public/`
- Source entries are malformed
- Dataset structure is invalid (missing production/reserves blocks)
- Country codes are invalid (must be ISO-3 style, e.g. CAN)
- Share values are out of bounds (must be between 0 and 100)

Mineral key consistency mode:
- Local default: warn if map selector keys and dataset keys diverge
- CI default: fail if keys diverge
- Override with `STRICT_MINERAL_KEY_CHECK=off|warn|error`

---

## Step 4 - Visual QA

Run:

```bash
pnpm dev
```

Open `/tools/critical-minerals-map` and verify:
- Header source badge and metadata timestamp line look correct
- Country geometry loads from local `public/countries-110m.json`
- Tooltips still display expected values and notes
- Top producers list still sorts correctly

---

## Step 5 - Ship

Commit only map-related files:

```bash
git add src/pages-react/CriticalMineralsMap.tsx
git add src/data/criticalMineralsMapData.ts
git add src/data/criticalMineralsMapMetadata.js
git add scripts/validate-critical-minerals-map-data.cjs
git add content/docs/critical-minerals-refresh-playbook.md
git add package.json
git commit -m "Refresh critical minerals map data YYYY-MM"
git push
```

---

## Fast rollback

If a bad update reaches production, revert the data commit and re-run:

```bash
npm run validate:critical-minerals
```

Then redeploy.
