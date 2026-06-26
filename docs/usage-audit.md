# TransHorizons — Usage Audit

**Date:** 2026-06-26
**Scope:** Read-only inventory. No files were deleted, modified, or refactored. `keystatic.config.ts` was read only, never edited. This document is the sole artifact produced.
**Purpose:** First step of a planned cleanup — a factual map of what is actually used vs. vestigial, plus a map of the Keystatic configuration that governs content.

> ⚠️ **This is inventory, not a removal plan.** "Candidate for removal" means *not reachable from a build entry point at the time of this audit*. Confirm against runtime behavior, git history, and Peggy's intent before deleting anything. Ambiguous cases are flagged explicitly rather than resolved.

---

## Method (how "live" was determined)

Two passes were run and cross-checked:

1. **Direct importer scan** — for every target file, which files reference it (`import` / `from` / `require` / YAML+CSS imports), across `src/`, `keystatic.config.ts`, `astro.config.mjs`, and `.astro/keystatic-imports.js`.
2. **Reachability closure** — a full import-graph BFS from the real build entry points, resolving the `@/ → /src` alias, relative paths, and extension/`index` resolution.

**Entry points (graph roots):** every file under `src/pages/` (all Astro routes incl. `[...slug].astro` and `api/health.ts`), plus `keystatic.config.ts` and the generated `.astro/keystatic-imports.js`. From there: `[...slug].astro → AppShell.tsx → pages-react/* → components/* → lib/*, hooks/*, data/*`, and the SSR `.astro` pages → `content/*.yaml`.

**Why two passes matter:** "imported by *some* file" ≠ "used by the build." Several files are imported only by *other unreferenced files* (dead clusters). Example: `ui/sidebar.tsx` is unreferenced, so its dependencies `ui/sheet.tsx` and `ui/skeleton.tsx` — imported *only* by `sidebar.tsx` — are also dead. This report uses **reachability** as the verdict and notes when a file's only importers are themselves dead.

**Known false-negative risks (checked, none triggered):** no `React.lazy(...)` or dynamic `import(...)` anywhere in `src/`; nothing in `scripts/` imports from `src/`. So the static graph is the whole story for the build.

---

# Part 1 — Code Usage Audit

## Summary counts

| Directory | Live (reachable) | Dead (removal candidates) | Total |
|---|---:|---:|---:|
| `src/pages-react/` | 22 | 0 | 22 |
| `src/data/` (incl. `countries/`) | 34 | 13 | 47 |
| `src/components/ui/` | 4 | 49 | 53 |
| `src/components/` (top level) | 23 | 6 | 29 |
| `src/hooks/` | 1 | 3 | 4 |
| `src/lib/` | 10 | 1 | 11 |
| **Total** | **94** | **72** | **166** |

The dead weight is concentrated: **`components/ui/` (49) + `data/` legacy (13) = 62 of the 72** unreferenced files.

---

## `src/pages-react/` — 22 live / 0 dead

All 22 are reachable. Every page component is registered as a Wouter route in `AppShell.tsx`; the article/note components are additionally pulled by `lib/articleTexts.ts` / `lib/noteTexts.ts` and (for 7 of them) a matching SSR `.astro` page.

| File | Importers |
|---|---|
| `2026-01_AI-Governance_Essay.tsx` | AppShell, lib/articleTexts, pages/portfolio/ai-governance.astro |
| `2026-02_Critical-Minerals_Essay.tsx` | AppShell, lib/articleTexts, pages/portfolio/critical-minerals.astro |
| `2026-03_Canada-Multipolar_Essay.tsx` | AppShell, lib/articleTexts, pages/portfolio/canada-multipolar.astro |
| `2026-03_Career-Evolution_Note.tsx` | AppShell, lib/noteTexts, pages/notes/career-evolution.astro |
| `2026-04_Canada-Forest-Carbon_Essay.tsx` | AppShell, lib/articleTexts, pages/portfolio/canada-forest-carbon.astro |
| `2026-04_Canada-Forest-System_Essay.tsx` | AppShell, lib/articleTexts — **no matching `.astro`** (see Flag F7) |
| `2026-04_Canada-Resource-Wealth_Essay.tsx` | AppShell, lib/articleTexts — **no matching `.astro`** (see Flag F7) |
| `2026-04_Resource-Civilization_Essay.tsx` | AppShell, lib/articleTexts, pages/portfolio/resource-civilization.astro |
| `2026-04_Travel-Observation_Note.tsx` | AppShell, lib/noteTexts, pages/notes/travel-observation.astro |
| `AnalysesIndex.tsx` | AppShell |
| `CountryPage.tsx` | AppShell |
| `CriticalMineralsMap.tsx` | AppShell, 2026-04_Canada-Resource-Wealth_Essay |
| `GlobalRiskCascadeDemo.tsx` | AppShell |
| `HistoricalRiskDemo.tsx` | AppShell |
| `Home.tsx` | AppShell |
| `LayeredMapDemo.tsx` | AppShell |
| `NotFound.tsx` | AppShell |
| `NotesIndex.tsx` | AppShell |
| `Publications.tsx` | AppShell |
| `ResearchApproach.tsx` | AppShell |
| `RiskCorrelations.tsx` | AppShell |
| `WorldAnalysis.tsx` | AppShell |

> Note: `HistoricalRiskDemo`, `LayeredMapDemo`, `GlobalRiskCascadeDemo`, `RiskCorrelations`, `CriticalMineralsMap` are wired as routes (`/historical-risk-demo`, `/layered-map-demo`, `/global-risk-cascade`, `/risk-correlations`, `/tools/critical-minerals-map`) but have **no dedicated SSR `.astro` page** — they exist only inside the client-only SPA via the `[...slug].astro` catch-all. Live, but demo/tool-tier (not crawlable). Not removal candidates.

---

## `src/data/` (incl. `src/data/countries/`) — 34 live / 13 dead

This directory carries the clearest migration scar: a **hardcoded-`.ts` → YAML-adapter (`-yaml.ts`)** transition. For 12 countries the old hardcoded file was superseded by a `-yaml.ts` file that reads `content/countries/<CODE>/analysis.yaml` through `adaptCountryYaml.ts`; the old `.ts` files were left orphaned.

### Live (34)

**Infrastructure / shared:**
- `countries/adaptCountryYaml.ts` — adapter that maps raw Keystatic YAML → `AnalysisContent`. 13 importers (every `-yaml.ts` + `canada.ts`).
- `france.ts` — **dual role: the TYPE source** (`AnalysisContent`, `LangContent`, `ActorEntry`, `RiskEntry`, `SourceEntry`) **and** the original hardcoded France data. `CountryPage` imports its *types* (`france.ts:9+`); France's *data* now comes from `france-yaml.ts`. 27 importers, but **15 live / 12 dead** (the 12 dead legacy country files still `import type` from it). See Flag F1.

**Keystatic-managed country data (`-yaml.ts`, each ← `CountryPage.tsx`):**
`france-yaml.ts`, `usa-yaml.ts`, `china-yaml.ts`, `russia-yaml.ts`, `japan-yaml.ts`, `southkorea-yaml.ts`, `australia-yaml.ts`, `brazil-yaml.ts`, `germany-yaml.ts`, `united-kingdom-yaml.ts`, `mexico-yaml.ts`, `india-yaml.ts` (12).

- `canada.ts` — hybrid: not named `-yaml` but reads `content/countries/CAN/analysis.yaml` via `adaptCountryYaml`. ← `CountryPage`.

**Legacy hardcoded country data still live (no YAML yet, each ← `CountryPage.tsx`):**
`ireland.ts`, `saudi-arabia.ts`, `new-zealand.ts`, `indonesia.ts`, `singapore.ts`, `vietnam.ts`, `chile.ts`, `haiti.ts`, `turkey.ts`, `south-africa.ts`, `congo-kinshasa.ts`, `poland.ts`, `ukraine.ts` (13).

**Feature datasets:**
- `irelandRiskTrends.ts` ← `CountryPage`
- `riskCorrelations.ts` ← `RiskCorrelations`
- `canadaHistoricalTimeline.ts` ← `HistoricalRiskDemo`
- `canadaLayeredMapData.ts` ← `LayeredMapDemo`
- `criticalMineralsMapData.ts` ← `CriticalMineralsMap`
- `criticalMineralsMapMetadata.js` ← `CriticalMineralsMap`

### Dead — candidates for removal (13)

| File | What it appears to be | Note |
|---|---|---|
| `australia.ts` | Old hardcoded Australia analysis | Superseded by `australia-yaml.ts` |
| `brazil.ts` | Old hardcoded Brazil analysis | Superseded by `brazil-yaml.ts` |
| `china.ts` | Old hardcoded China analysis | Superseded by `china-yaml.ts` |
| `germany.ts` | Old hardcoded Germany analysis | Superseded by `germany-yaml.ts` |
| `india.ts` | Old hardcoded India analysis | Superseded by `india-yaml.ts` |
| `japan.ts` | Old hardcoded Japan analysis | Superseded by `japan-yaml.ts` |
| `mexico.ts` | Old hardcoded Mexico analysis | Superseded by `mexico-yaml.ts` |
| `russia.ts` | Old hardcoded Russia analysis | Superseded by `russia-yaml.ts` |
| `southkorea.ts` | Old hardcoded South Korea analysis | Superseded by `southkorea-yaml.ts` |
| `united-kingdom.ts` | Old hardcoded UK analysis | Superseded by `united-kingdom-yaml.ts` |
| `usa.ts` | Old hardcoded USA analysis | Superseded by `usa-yaml.ts` |
| `brazilRiskTrends.ts` | Quarterly risk-trend dataset for Brazil | **Asymmetry** — `irelandRiskTrends.ts` *is* live (← CountryPage); Brazil's equivalent is not. See Flag F4. |
| `countries/CAN/can.generated.ts` | Auto-generated CAN data from split YAML | Header says *"Regenerate: npm run generate"* — **no `generate` script exists** in `package.json`. Orphaned codegen intermediate. See Flag F2. |

> These 11 country `.ts` files are the *only* dead importers of `france.ts`. Removing them is safe for `france.ts` (it stays live via `CountryPage` + the 12 `-yaml.ts`), but will drop its importer count.

---

## `src/components/ui/` — 4 live / 49 dead

This is a near-complete **shadcn/ui component library** (53 files) of which only **4 are reachable**. The rest form a large dead cluster — many import each other, but no live file enters the cluster.

### Live (4)

| File | Live importers (dead importers omitted) |
|---|---|
| `button.tsx` | HistoricalRiskMap, TimelineSlider, pages-react/NotFound |
| `card.tsx` | HistoricalRiskMap, pages-react/NotFound |
| `sonner.tsx` | AppShell |
| `tooltip.tsx` | AppShell |

### Dead — candidates for removal (49)

`accordion`, `alert-dialog`, `alert`, `aspect-ratio`, `avatar`, `badge`, `breadcrumb`, `button-group`, `calendar`, `carousel`, `chart`, `checkbox`, `collapsible`, `command`, `context-menu`, `dialog`, `drawer`, `dropdown-menu`, `empty`, `field`, `form`, `hover-card`, `input-group`, `input-otp`, `input`, `item`, `kbd`, `label`, `menubar`, `navigation-menu`, `pagination`, `popover`, `progress`, `radio-group`, `resizable`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `slider`, `spinner`, `switch`, `table`, `tabs`, `textarea`, `toggle-group`, `toggle`.

**Dead-cluster detail (these *look* used but aren't reachable):**
- `dialog` ← `ManusDialog`(dead), `command`(dead), `input`(dead), `textarea`(dead)
- `input` ← `input-group`(dead), `sidebar`(dead) · `textarea` ← `input-group`(dead)
- `label` ← `field`(dead), `form`(dead) · `separator` ← `button-group`/`field`/`item`/`sidebar` (all dead)
- `sheet`, `skeleton` ← `sidebar`(dead) only · `toggle` ← `toggle-group`(dead) only

See Flag F5 — recommend treating the dead `ui/` set as one batch decision, not 49 individual ones. Many shadcn components are kept intentionally as a kit; confirm intent.

---

## `src/components/` (top level) — 23 live / 6 dead

### Live (23)

`AboutSection` (← Home), `AppShell` (← 6 `.astro` pages), `ArticleTTSButton` (← AnalysesIndex; +dead FeaturedAnalysisSection), `ContactSection` (← Home), `CountryFilterPanel` (← WorldAnalysis), `ErrorBoundary` (← AppShell), `FlagIcon` (← CountryPage, WorldAnalysis; +dead GlobeSection), `Footer` (← AnalysesIndex, Home, NotesIndex), `GlobalRiskCascadeMap` (← GlobalRiskCascadeDemo), `GlobeTeaser` (← Home), `HeroSection` (← Home), `HistoricalRiskMap` (← HistoricalRiskDemo), `LayeredOverlayMap` (← LayeredMapDemo), `Navbar` (← Home), `NotesDetailLayout` (← 3 note/essay pages), `NotesSection` (← Home), `PortfolioSection` (← Home), `PortfolioTTSPlayer` (← 6 live components), `ProjectDetailLayout` (← 6 essay pages), `ResearchApproachSection` (← Home), `RiskCorrelationMatrix` (← RiskCorrelations), `RiskTrendVisualization` (← CountryPage), `TimelineSlider` (← HistoricalRiskMap).

### Dead — candidates for removal (6)

| File | What it appears to do | Note |
|---|---|---|
| `ActorNetworkVisualization.tsx` | Force-directed actor/influence graph | Imports `france.ts`; not mounted anywhere |
| `FeaturedAnalysisSection.tsx` | Editorial "featured analysis" card section | Imports articleTexts, ArticleTTSButton, PortfolioTTSPlayer — itself unmounted |
| `GlobeSection.tsx` | Interactive 3D earth globe section | Superseded by `GlobeTeaser.tsx` (live, on Home)? Confirm — see Flag F6 |
| `InteractiveMap.tsx` | SVG world map with gallery markers | Not mounted |
| `ManusDialog.tsx` | Dialog (Manus-era artifact) | Imports `ui/button`, `ui/dialog`; not mounted |
| `Map.tsx` | Google Maps integration component | Not mounted; sole live-graph reason `hooks/usePersistFn` existed |

---

## `src/hooks/` — 1 live / 3 dead

| File | Verdict | Importers |
|---|---|---|
| `useSpeech.ts` | **LIVE** | ArticleTTSButton, PortfolioTTSPlayer |
| `useComposition.ts` | **DEAD** | only `ui/input`(dead), `ui/textarea`(dead) |
| `useMobile.tsx` | **DEAD** | only `ui/sidebar`(dead) |
| `usePersistFn.ts` | **DEAD** | only `components/Map`(dead), `useComposition`(dead) |

The 3 dead hooks are pure transitive casualties of the dead `ui/` form components and `Map.tsx`.

---

## `src/lib/` — 10 live / 1 dead

### Live (10)

`analysedCountries.ts` (← GlobeTeaser, WorldAnalysis), `articleTexts.ts` (← PortfolioSection, ProjectDetailLayout, AnalysesIndex; +dead FeaturedAnalysisSection), `countryMetadata.ts` (← CountryFilterPanel, WorldAnalysis), `frAssets.ts` (← 2026-03_Canada-Multipolar_Essay, pages/portfolio/canada-multipolar.astro), `historicalTimelineTypes.ts` (← HistoricalRiskMap, TimelineSlider, data/canadaHistoricalTimeline), `noteTexts.ts` (← NotesSection, NotesIndex), `riskCorrelationTypes.ts` (← RiskCorrelationMatrix, data/riskCorrelations), `riskTrendTypes.ts` (← RiskTrendVisualization, irelandRiskTrends, CountryPage; +dead brazilRiskTrends), `smoothScroll.ts` (← Navbar, NotesDetailLayout, ProjectDetailLayout), `utils.ts` (← 52 importers; only 4 live — ErrorBoundary, ui/button, ui/card, ui/tooltip — the rest are the dead `ui/` cluster).

### Dead — candidate for removal (1)

| File | What it appears to do | Note |
|---|---|---|
| `countrySchema.ts` | Zod schemas for the YAML country format | Referenced **nowhere** — not in the build, not in `scripts/`. Looks like intended-but-unwired validation tooling. See Flag F3. |

---

## Part 1 — Flagged ambiguities

- **F1 — `data/france.ts` is misnamed, not vestigial.** It is the canonical **type module** for all country data (`AnalysisContent` et al.) *and* still holds the original hardcoded France dataset. The types are essential and live; the embedded France *data const* appears superseded by `france-yaml.ts` (CountryPage imports France data from the latter, types from the former). **Do not delete.** A possible (future) cleanup is to extract the interfaces into a neutrally-named module (e.g. `lib/countryTypes.ts`) so the 12 dead legacy files aren't what keep a "country data" file alive — but that is a refactor, out of scope here.
- **F2 — `countries/CAN/can.generated.ts` references a non-existent build step.** Its header says regenerate via `npm run generate`, but no such script exists. It is unreferenced. Likely an abandoned codegen path (the split `can.*.yaml` format). Confirm before removing.
- **F3 — `lib/countrySchema.ts` may be intended tooling, not dead weight.** Zod validation schema for the country YAML, wired into nothing (not even `scripts/validate-country-citations.cjs`). Could be (a) abandoned, or (b) meant to be wired into the repair/validate scripts and never finished. Ask before removing.
- **F4 — RiskTrends asymmetry.** `irelandRiskTrends.ts` is live (rendered for Ireland in `CountryPage`), but `brazilRiskTrends.ts` is dead. Either Brazil's risk-trend UI was removed, or it was authored and never wired. Confirm intent.
- **F5 — The 49 dead `ui/` files are a kit, decide as a batch.** This is a wholesale shadcn/ui install; only 4 components are used. Removing all 49 is low-risk for the *current* build, but teams often keep the kit for future UI work. Recommend one explicit decision (keep kit / prune to the 4 used + their real deps) rather than 49 separate calls.
- **F6 — `GlobeSection.tsx` vs `GlobeTeaser.tsx`.** Both are globe components; `GlobeTeaser` is live (Home), `GlobeSection` is dead. Likely `GlobeSection` is the superseded full-screen version. Confirm it isn't intended for a route before removing.
- **F7 — Dual-renderer sync gap (architecture, per CLAUDE.md).** Two article components have a React renderer + Keystatic YAML but **no matching SSR `.astro` SEO page**: `2026-04_Canada-Forest-System_Essay` (route `/portfolio/canada-forest-system-climate-industrial-pressure`) and `2026-04_Canada-Resource-Wealth_Essay` (routes `/notes/canada-resources`, `/portfolio/canada-resources`). They are served only by the client-only `[...slug].astro` catch-all, so they are **not crawlable with per-page SEO**. CLAUDE.md states the `.tsx` and `.astro` layers "must stay in sync." Flagging for Peggy — not a removal candidate and not fixed here.
- **F8 — Country reports have no SSR/SEO layer at all.** Unlike articles (dual-rendered), the per-country pages (`/country/:cca3`, `/world-analysis/:cca3`) are React-only via `CountryPage.tsx`; no `.astro` page reads `content/countries/*/analysis.yaml`. Consistent with the deployment hold on country pages, but worth recording as a structural fact.

---

# Part 2 — Keystatic Configuration Map

## 2.1 What `keystatic.config.ts` declares

`storage: { kind: 'local' }` (filesystem storage; edits write back to `content/`).

### Singleton: `researchApproach`
- **Path:** `content/pages/research-approach` · **Format:** YAML.
- **Schema:** two parallel language objects, `en` and `fr`, each built from `raLangFields()`:
  `pageTitle`, `backLabel`, and nested objects `method {heading,label,body}`, `scope {heading,intro,items[{title,desc}],closing}`, `sources {heading,intro,items,closing}`, `process {heading,intro,items[{bold,rest}],closing}`, `mapping {heading,body,items,closing}`, `traceability {heading,body,items,closing}`, `tools {heading,intro,usedItems,p3,howeverItems,outro}`, `principles {heading,intro,items[{title,desc}]}`, `limits {heading,body,items,closing}`, `referencing {heading, sources{heading,body}, citation{heading,intro,items,closing}}`, `position {heading,body}`.
- **Consumed by:** `pages-react/ResearchApproach.tsx` (imports the YAML directly). `pages/research-approach.astro` only mounts `AppShell` (no SSR field rendering) — so this singleton is **React-rendered only**.

### Collection: `articles`
- **Path:** `content/articles/*` · **Format:** YAML · **slugField:** `title_en`.
- **Top-level fields:** `heroImage`, `date`, `readTime`, `articleType_en`, `articleType_fr`, `category_en`, `category_fr`, `title_en` (slug), `subtitle_en`, `introductionTitle_en`, `introduction_en`, `title_fr`, `subtitle_fr`, `introductionTitle_fr`, `introduction_fr`, `sections[]`, `keyTakeaways[]`, `relatedProjects[]`, `sources{}`.
- **`sections[]` item fields (`sectionFields`):** `title_en`, `title_fr`, `content_en`, `content_fr`, `image`, `imagePosition` (left/right/full/side-by-side), `imageLayout` (single/side-by-side/dual-toggle), `images[]{src,label_en,label_fr}`, `embedUrl`, `embedHeight`.
- **`keyTakeaways[]` (`takeawayFields`):** `title_en`, `title_fr`, `description_en`, `description_fr`.
- **`relatedProjects[]` (`relatedProjectFields`):** `id`, `title_en`, `title_fr`, `category_en`, `category_fr`.
- **`sources{}`:** `en[]`, `fr[]`, `disclaimer_en`, `disclaimer_fr`.

### Collection: `countries`
- **Path:** `content/countries/*/analysis` · **Format:** YAML · **slugField:** `code`.
- **Fields:** `code` (slug, required), `nameEn`, `nameFr`, `lastUpdated` (required), five `scorecard_*` selects (`eliteCohesion`, `securityLoyalty`, `economicPressure`, `protestCapacity`, `institutionalResilience`; High/Med/Low), `executiveSnapshot_en/fr`, `political_powerStructure_en/fr`, `political_stabilityDrivers_en/fr`, `political_shockAbsorbers_en/fr`, `economy_macroReality_en/fr`, `economy_externalVulnerability_en/fr`, `economy_politicalEconomy_en/fr`, `security_internal_en/fr`, `security_diplomacy_en/fr`, `actors_domestic_en/fr` (JSON-in-text), `actors_external_en/fr` (JSON-in-text), `risks_en/fr` (JSON-in-text), `sources` (JSON-in-text registry).

## 2.2 Undeclared (silently-stripped) fields in YAML content

Every committed content YAML was parsed and its keys compared to the schema above.

**Result: no undeclared fields anywhere.** No article (top-level or `sections[]`) and no `analysis.yaml` contains a key absent from the schema. The "Keystatic strips undeclared fields" trap is **not currently realized** in committed content — the schema is a superset of what's on disk.

Two *benign* observations (the inverse — schema fields simply omitted, which is allowed):
- `2026-03_Canada-Multipolar_Essay.yaml` omits `introductionTitle_*` / `introduction_*` (sections-only article).
- `2026-04_Travel-Observation_Note.yaml` omits `introduction_en/fr` (has the title but no intro body).

**Rich `sections[]` fields are used by only two articles:** `imageLayout` / `images` / `embedUrl` / `embedHeight` appear in `2026-03_Canada-Multipolar_Essay.yaml`; `imageLayout` / `images` appear in `2026-04_Resource-Civilization_Essay.yaml`. All other articles use only `image` + `imagePosition`. (Relevant because per CLAUDE.md these rich fields must stay declared or they vanish on the next Keystatic save.)

### Schema-vs-content inconsistency: the `code` field
- **`DEU/analysis.yaml` includes a `code:` field; the other 12 `analysis.yaml` files do not.**
- For a Keystatic collection with `path: '…/*/analysis'` and `slugField: 'code'`, the slug value is carried by the **directory name** (`DEU`, `CAN`, …), not stored in the data file. So the 12 files that omit `code` are following the normal pattern; **DEU is the outlier** carrying a redundant body field. On a future Keystatic re-save of DEU this is the kind of field that can be normalized/moved. Flagging, not changing (Flag F9).

## 2.3 `.astro/` and root-level Keystatic files — autogenerated vs hand-edited

`.astro/` is the Astro build-cache directory (regenerated by `astro dev`/`build`; typically git-ignored).

| File / dir | Origin | Notes |
|---|---|---|
| `keystatic.config.ts` (repo root) | **HAND-EDITED** | The single source of truth for collections/singletons/schema. Do not edit casually (strip rule). |
| `.astro/keystatic-imports.js` | **Autogenerated** (`@keystatic/astro`) | 3 lines: `import "@keystatic/astro/ui"`, `.../api"`, `@keystatic/core/ui`. Wires the `/keystatic` admin. |
| `.astro/content.d.ts` | **Autogenerated** (Astro) | Generic `astro:content` type scaffold. **No Astro content-collections are actually defined** — content is consumed via Keystatic + direct YAML imports, not `astro:content`. |
| `.astro/types.d.ts` | **Autogenerated** (Astro) | One-line client type reference. |
| `.astro/settings.json` | **Autogenerated** (Astro) | Editor/cache settings. |
| `.astro/collections/` | **Autogenerated** (Astro) | **Empty directory** (no Astro collections in use). |

> The task brief anticipated a populated `.astro/collections/` and a richer `content.d.ts`; in this repo both are effectively empty because the project does **not** use Astro's native content collections — Keystatic governs content and the app reads YAML via `@rollup/plugin-yaml` imports and runtime `fs` reads.

## 2.4 Content files whose structure doesn't match the schema

The `countries` glob `content/countries/*/analysis` manages **only `analysis.yaml`** in each country dir. Several files sit alongside it that are **not** governed by the schema:

| File(s) | Status | Read by |
|---|---|---|
| `content/countries/CAN/can.en.yaml`, `can.fr.yaml`, `can.meta.yaml`, `can.sources.yaml` | **Split-format migration intermediate** (not in schema) | Only `scripts/migrate-country-ts-to-keystatic.cjs` |
| `content/countries/CAN/analysis.yaml.example` | Sample/reference file | Nothing |
| `content/countries/CAN/` also has `analysis.yaml` | Schema-matching, **live** | `data/canada.ts` |
| `content/countries/_template/country.en.yaml`, `country.fr.yaml`, `country.meta.yaml`, `country.sources.yaml` | Template scaffolding (split format) | Not matched by the glob (no `analysis.yaml`); migration script only |
| `src/data/countries/CAN/can.generated.ts` | Generated TS from the split CAN YAML | Nothing (orphaned — see Flag F2) |

So CAN uniquely carries **both** the old split-file format **and** the new single `analysis.yaml`. The split files + `_template` + `.example` + `can.generated.ts` are all **migration intermediates** from the Manus/`.ts` → Keystatic transition. They are not silently-stripped fields (they're separate files), but they are unmanaged content drift. Flag F10.

**Coverage mismatch:** Keystatic's `countries` collection governs the **13** countries that have `analysis.yaml` (AUS, BRA, CAN, CHN, DEU, FRA, GBR, IND, JPN, KOR, MEX, RUS, USA). But `CountryPage.tsx` renders **~33** countries — the other ~20 (ireland, poland, ukraine, vietnam, …) are **hardcoded `.ts` with no YAML and no Keystatic entry**. Editing those via the Keystatic admin is not possible today. Flag F11.

## 2.5 Astro pages that read `content/` directly, and the fields they expect

Seven SSR pages read `content/articles/*.yaml` **at request time** via `readFileSync` + `js-yaml` (not via import), then render their own HTML (these do **not** mount `AppShell` — they are the standalone SEO layer):

| `.astro` page | Reads | Fields rendered |
|---|---|---|
| `portfolio/ai-governance.astro` | `2026-01_AI-Governance_Essay.yaml` | `title_{L}`, `subtitle_{L}`, `introductionTitle_{L}`, `introduction_{L}`, `category_{L}`, `date`, `readTime`, `heroImage`, `keyTakeaways[{title_{L},description_{L}}]`, `sections[{title_{L},content_{L},image}]` |
| `portfolio/critical-minerals.astro` | `2026-02_Critical-Minerals_Essay.yaml` | same subset **+ `sources`** |
| `portfolio/canada-multipolar.astro` | `2026-03_Canada-Multipolar_Essay.yaml` | **full set** — same subset **+ `imageLayout`, `images`, `embedUrl`, `embedHeight`, `sources`**, and per-language asset swap via `lib/frAssets.ts` |
| `portfolio/canada-forest-carbon.astro` | `2026-04_Canada-Forest-Carbon_Essay.yaml` | same subset **+ `sources`** |
| `portfolio/resource-civilization.astro` | `2026-04_Resource-Civilization_Essay.yaml` | same subset **+ `images`, `sources`** (no embed) |
| `notes/career-evolution.astro` | `2026-03_Career-Evolution_Note.yaml` | base subset |
| `notes/travel-observation.astro` | `2026-04_Travel-Observation_Note.yaml` | base subset |

**Fields no SSR page renders:** `articleType_en/fr` and `relatedProjects[]` (relatedProjects exist in YAML and the schema, and are rendered in the React layer, but the `.astro` pages hardcode their own "related" list instead). `canada-multipolar.astro` is the only page exercising the full rich-media field set.

**Language:** `.astro` pages pick language from `?lang=fr` query param (default `en`). The React layer uses `LanguageContext`.

**Not read by any `.astro`:** `content/countries/*/analysis.yaml` (country reports are React-only, see Flag F8) and `content/pages/research-approach.yaml` (React-only via `ResearchApproach.tsx`).

`about.astro` is a special case: **fully hardcoded** bilingual SSR HTML (reads no YAML), with an `is:inline` `setLang()` script. It mirrors `AboutSection.tsx` rather than drawing from `content/`.

---

## Part 2 — Flagged ambiguities

- **F9 — `DEU/analysis.yaml` carries a redundant `code:` field** the other 12 omit (slug is path-derived). Harmless today; normalize on next edit. Don't hand-edit as part of this audit.
- **F10 — CAN migration intermediates.** `can.en/fr/meta/sources.yaml`, `analysis.yaml.example`, `_template/country.*.yaml`, and `src/data/countries/CAN/can.generated.ts` are leftovers of the split-file → single-`analysis.yaml` migration, read only by `migrate-country-ts-to-keystatic.cjs`. Candidates for removal *with* the migration script, but verify the migration is truly complete first.
- **F11 — Keystatic governs 13 of ~33 rendered countries.** The ~20 hardcoded-`.ts` countries cannot be edited via the Keystatic admin. This is a content-model gap, not dead code — recording it because it bears directly on "the Keystatic configuration that governs content."
- **General:** No silently-stripped fields exist *today*, but the schema is wider than the content (rich media + `relatedProjects` + `articleType`). Any cleanup that trims `sectionFields` must check the two articles using the rich fields and the React renderers, or it will strip live content on the next Keystatic save (the documented trap).

---

*End of audit. Read-only — no project files were changed in producing this report.*
