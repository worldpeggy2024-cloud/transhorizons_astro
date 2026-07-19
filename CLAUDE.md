# TransHorizons — Claude Code Instructions

## Architecture (do not violate)
- Dual-renderer: React .tsx in pages-react/ = visual layer; .astro in pages/ = SEO layer. Both must stay in sync.
- [...slug].astro is the catch-all route AND contains the /keystatic carve-out. Never modify without explaining why.
- AppShell client:only="react" is intentional. Do not change to client:load.
- Keystatic silently strips undeclared YAML fields — extend the schema before adding fields.

## Known recurring failures
- Past sessions have confused .astro and .tsx files and broken pages. Always verify which file type you are editing.
- After any build change: npm run build must pass, then fly deploy, then verify on transhorizons-astro.fly.dev.
- Local build success ≠ deployed. Always remind to deploy.

## Conventions
- French content: Peggy reviews and finalizes all French. AI MAY draft French *placeholders* to speed her review — mark each with a greppable `FR-PLACEHOLDER` comment so she can find them — but never alter French Peggy has already finalized, and never publish French without her review.
- Site purpose: professional portfolio for career pivot. Geographic accuracy is non-negotiable.

## Schema extensions (in keystatic.config.ts)
- `sectionFields` now includes: `imageLayout` (single / side-by-side / dual-toggle), `images` array of `{src, label_en, label_fr}`, `embedUrl`, `embedHeight`, plus `Full width` and `Side by side` options on `imagePosition`.
- Any new section field MUST be added to `sectionFields` or it will be silently stripped on the next Keystatic save (see the strip rule above).

## Editorial decisions
- Never unilaterally crop, remove, or restructure article content. When matching pre-existing framing or making layout tradeoffs, show two options and ask before deciding.
- AI-generated statistics require source verification before publication. Manus and Perplexity have both produced fabricated chokepoint percentages.

## Deployment
- Working/verification target: transhorizons-astro.fly.dev (deploy here, verify here).
- Eventual public domain: transhorizons.net — NOT yet receiving the latest work. Full deployment to .net is on hold until the AI-generated maps and country pages are corrected. Do not push to production .net without explicit go-ahead.
- After deploying, always state which Fly app received the deployment.

## Country reports (World Views) — process & schema
- Storage: ONE flat file per country, content/countries/<ISO3>/analysis.yaml. NOT split (can.en.yaml etc. is
  the dead convention) and NOT in `sectionFields` (that is the Articles collection). Country fields live in
  the `countries` Keystatic collection (path content/countries/*/analysis, slugField code). Keys are flat
  underscores: <section>_<subsection>_<lang>, e.g. political_powerStructure_en. actors/risks/sources are
  JSON-in-text blocks in the same file — KEEP them JSON-in-text (decided; do not convert to structured
  fields).
- Authoring: TWO-PHASE deep research only (Pass A = sources; Pass B = prose citing only approved IDs), via scripts/deepsearch-country-workflow.cjs. Single-phase output is NOT trustworthy and is being regenerated;
  do not treat existing single-phase country content as ground truth.
  STANDING TOOL SPLIT (decided 2026-07-19 after the USA head-to-head): Perplexity runs Pass A (source
  harvesting, Pass Zero-B event scans, targeted Pass A top-ups — its search strength); Claude runs Pass B
  prose and the derived passes (situation, actors) — Perplexity's Pass B left 17 fields empty, Claude's
  filled all 33 with run-date verification. The pipeline stays tool-agnostic by design; this is the
  working default, not a hard-wiring.
- Structure (rework 2026-07, per content/docs/country-report-rework-IMPLEMENTATION.md — DECIDED, do not
  redesign): 33 fields, SIX peers, display order territory · society · economy · political order ·
  capacity to deliver · security & diplomacy; dynamic tail situation · actors · risks; then sources.
  - TERRITORY: geography / biosphere / minerals / climate / metabolism / transition. Metabolism absorbs
    connectivity+transport+comms; freshwater STOCK is biosphere. Disciplines: exposure paired with capacity,
    located geographically, scenario+horizon binding, demonstrated-over-declared.
  - SOCIETY: demographics / composition / language (new) / religion / wellbeing (new — OUTCOMES only) /
    cohesion (+ scorecard_socialCohesion, distinct from eliteCohesion). Describe on its own terms first.
  - ECONOMY: realEconomy (RENAMES macroReality) / publicFinances (new — debt SIZE) / externalVulnerability
    (debt HOLDERS) / politicalEconomy.
  - POLITICAL ORDER (renamed from Political Stability): powerStructure / rightsAndChecks (new) /
    stabilityDrivers (force loyalty AND control) / shockAbsorbers / constitutionalSubstrate /
    stateStructure (new — admin divisions, NEVER in substrate).
  - CAPACITY TO DELIVER (renamed from State Capacity): inheritedTerrain (new, anchored synthesis, merit-gap
    guard) / steering (new) / approvals (RENAMES permitting) / delivery / publicServices (new) / productivity.
  - SECURITY & DIPLOMACY: posture (new, anchored synthesis, displays first, composed LAST) / internal /
    military (new) / transnationalExposure (new) / diplomacy.
  - NO executive snapshot (removed; content lives in the section openers). baseline_en/fr is the compose-last
    derivative and the page's only always-visible prose — render nothing when empty, never back-fill.
  - NINE enforced openers (heuristic-gated, scripts/lib/openers.cjs — hard errors at apply, warnings at
    audit): territory.geography, territory.climate, society.demographics, economy.realEconomy,
    economy.politicalEconomy, political.powerStructure, political.constitutionalSubstrate,
    capacity.inheritedTerrain, security.posture. situation has NO opener.
  - ANCHORS (scripts/lib/anchors.cjs, shared by both validators): derived claims carry [dot.path] markers
    (inheritedTerrain, steering, posture, scorecard_anchors, actors Layer 2, risk ratings). Ghost anchor
    (empty/missing target) = hard error; compose-order + allowed-set rules; baseline carries no anchors;
    anchor parity EN/FR is manual like citation parity.
  - Pass B emits situation, actors.*, and risks EMPTY — each is populated by its own dedicated pass working
    from the finished report (situation pass §4d; two-layer actors/risks passes per rework §8). Actors Layer 2
    renders collapsed and labelled AI-drafted; engagementMode replaces dealability (legacy accepted).
  - LEGACY fields (economy_macroReality_*, capacity_permitting_*) stay DECLARED in Keystatic so saves
    don't strip not-yet-regenerated countries; renderer/adapter read new-name-first with legacy fallback;
    new generation never writes them. (executiveSnapshot_* is fully REMOVED — declarations AND YAML keys;
    Keystatic HARD-FAILS opening an item with undeclared keys, so schema removals must strip YAML keys in
    the same change.) TODO(post-migration): all migration scaffolding is tagged `TODO(post-migration)` —
    grep for it once CAN + USA are migrated and the volatility backfill is complete; the legacy
    declarations, the §11 warn-first parenthetical, and the validators' volatility warnings come out
    together then.
  - Declare EVERY new field in the `countries` collection schema BEFORE writing content — the strip rule
    eats undeclared fields silently.
- riskLevel (globe filter): DERIVED by rule from the country's own risk register, never assigned by hand or
  AI fiat. Strict rule: High = >=1 risk that is High on BOTH probability and impact; Medium = none High-both
  but >=1 risk touching High on either axis; Low = otherwise. region = static table; topics =
  pipeline-proposed, human-confirmed. The "report available" marker must track two-phase-regenerated status,
  not mere file existence.
- Two layers: present-state (sourced, validated = analysis.yaml) and a SEPARATE, openly-speculative
  trajectory/extrapolation layer (own contract: plural, anchored to present-state facts, never sourced, never
  a single forecast). Trajectories branch PRIMARILY on capacity.* (knowledge isn't the constraint, capacity
  is) and lead from both substrates — society.* (human) and territory.* (physical); settler-state
  resource/land branches anchor to political_constitutionalSubstrate. Moral guard: a capacity gap is
  inherited/unjustly-distributed, never merit or desert. Never mix trajectory content into the sourced body.
  The Manus-era risk-cascade visualizations belong to the trajectory layer and are PARKED until per-country
  risk registers are trustworthy.
- SSR: country pages have a dual-renderer SEO layer at src/pages/country/[cca3].astro (hidden SEO div +
  LegacyReveal reading view + AppShell client:only="react"; do NOT switch to client:load). It deliberately
  SHADOWS [...slug].astro for /country/* — treat any change there as affecting the catch-all. Crawlability is
  GATED by SEO_READY_COUNTRIES in src/lib/analysedCountries.ts (drives SEO div, sitemap, globe marker, teaser
  count). Expose a country only once its content is two-phase-regenerated and proofed; .net stays on hold
  (see Deployment). The SEO div mirrors the React section order and reads new-name fields with legacy
  fallback — keep the two renderers in sync.
- Validation: scripts/validate-country-citations.cjs (audit) + the workflow apply gate (hard). Required
  source fields: name, url, desc, accessDate, confidence, citationType (+ id); publicationDate optional
  (warning); volatility High|Med|Low warn-on-missing (freshness axis, orthogonal to confidence — drives the
  quarterly refresh worklist; never overload confidence for age); desc ~20-30 words, what the source IS,
  never its data (soft warning > 50). Does NOT enforce EN/FR parity (citations OR anchors) — manual check.
  Acronyms: first mention spells the term in full, no carve-outs (ISO3 codes as data identifiers exempt).
- Migration is REGENERATION, not preservation: countries not yet on analysis.yaml are re-made through the
  two-phase pipeline (use scripts/migrate-country-ts-to-keystatic.cjs where an old hardcoded .ts exists). No
  single-phase content is preserved. Discarding single-phase country content is the author's explicit
  decision, not a unilateral removal.