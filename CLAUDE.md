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
- transhorizons.net and transhorizons-astro.fly.dev are the SAME Fly app (`transhorizons-astro`) — .net is a custom domain on it (confirmed 2026-08-12: same anycast IP, byte-identical responses, no redirect). ONE `fly deploy` updates BOTH domains at once; there is no separate .net deployment.
- Canonical origin is transhorizons.net (single source of truth = astro.config `site`, read via Astro.site). Base.astro's `<link rel="canonical">`, sitemap.xml.ts, and robots.txt all resolve to .net, so search signals consolidate there even though fly.dev serves the same pages.
- The ".net hold" is a CONTENT/POLICY decision, NOT infrastructure: because .net = the same app, whatever is on fly.dev is ALREADY public on .net (including any not-yet-corrected maps/country pages). "Hold" means do NOT promote/announce .net or submit it for indexing until the AI-generated maps and country pages are corrected — it does NOT shield the public domain from current content.
- Remaining launch step, DEFERRED until explicit go-ahead: a 301 redirect from the fly.dev host to .net. Not done, because it would make fly.dev redirect away and destroy the verification target. Do not add it without go-ahead.
- Working/verification host is still transhorizons-astro.fly.dev. After deploying, always state which Fly app received the deployment.

## Country reports (World Views) — process & schema
- Storage: ONE flat file per country, content/countries/<ISO3>/analysis.yaml. NOT split (can.en.yaml etc. is
  the dead convention) and NOT in `sectionFields` (that is the Articles collection). Country fields live in
  the `countries` Keystatic collection (path content/countries/*/analysis, slugField code). Keys are flat
  underscores: <section>_<subsection>_<lang>, e.g. political_powerStructure_en. actors/sources (and the
  gap register capacity_knownAndUnbuilt_*) are
  JSON-in-text blocks in the same file — KEEP them JSON-in-text (decided; do not convert to structured
  fields).
- Authoring: TWO-PHASE deep research only (Pass A = sources; Pass B = prose citing only approved IDs), via scripts/deepsearch-country-workflow.cjs. Single-phase output is NOT trustworthy and is being regenerated;
  do not treat existing single-phase country content as ground truth.
  STANDING TOOL SPLIT (decided 2026-07-19, REFINED 2026-08-04 after the USA review): the two-phase
  approved-list ARCHITECTURE is the load-bearing part and is engine-agnostic — the approve-then-cite gate
  matters far more than which retrieval tool feeds it. Perplexity is NO LONGER the default for the lookup
  passes (Pass A harvest, Pass Zero-B event scans, targeted Pass A top-ups): the USA review added 79 of
  174 final sources and fixed many dead / non-primary links, and those were VERIFICATION failures (dead
  URLs, opinion-PDFs that 404, law-firm client alerts / trade-press standing in for the primary
  instrument) that Perplexity cannot self-check. Run the lookup passes where URLs can be watched and
  rejected in real time — an interactive frontier model with web fetch, Claude Code, or by hand. Perplexity
  is retained ONLY for the DISCOVERY moment in Pass A: casting wide to surface candidate primary
  instruments on a country whose source landscape you don't already know (Senegal's francophone
  institutional sources especially). Pass A is therefore TWO steps — Perplexity discovery (where the
  landscape is unfamiliar) → human approval gate → fetch-based verification that each candidate is truly
  primary AND openable, before it enters the approved list. Claude runs Pass B prose and the derived passes
  (situation, actors) — Perplexity's Pass B left 17 fields empty, Claude's filled all 33 with run-date
  verification. Tool-agnostic by design; this is the working default, not a hard-wiring.
- Structure (rework 2026-07, per content/docs/country-report-rework-IMPLEMENTATION.md — DECIDED, do not
  redesign): 33 fields, SIX peers, display order territory · society · economy · political order ·
  capacity to deliver · security & diplomacy; dynamic tail situation · actors; then sources. (The Risk
  Register was REMOVED 2026-07-20 per workorder-gap-register.md — risks_* fields no longer exist; the gap
  register capacity.knownAndUnbuilt replaces it. Report is 34 fields.)
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
    guard) / steering (new) / approvals (RENAMES permitting) / delivery / publicServices (new) / productivity /
    knownAndUnbuilt (GAP REGISTER, added 2026-07-20 per workorder-gap-register.md: JSON-in-text
    {opener, items[{gap,anchor,since,class}], denominator}; anchored synthesis, no new facts; emitted EMPTY
    by Pass B, composed by the derivatives pass; opener declares the DOCUMENTATION BASE; five-test gate
    asserted/gap-not-condition/internal/open/missing-not-undone; classes no-attempt-documented | announced-not-implemented |
    attempted-and-failed | in-progress-unclosed; carries the inherited-capacity denominator guard).
  - SECURITY & DIPLOMACY: posture (new, anchored synthesis, displays first, composed LAST) / internal /
    military (new) / transnationalExposure (new) / diplomacy.
  - NO executive snapshot (removed; content lives in the section openers). baseline_en/fr is a derivative and
    the page's only always-visible prose — render nothing when empty, never back-fill. Since 2026-07-19 the
    baseline AND the scorecard (values + scorecard_anchors) are composed by the dedicated DERIVATIVES pass
    (derivatives-pass.prompt.md, generated at init), run AFTER the situation pass installs and its peer
    corrections are approved — Pass B emits both EMPTY; the page hides the Quick scorecard while empty.
  - TEN enforced openers (heuristic-gated, scripts/lib/openers.cjs — hard errors at apply, warnings at
    audit): territory.geography, territory.climate, society.demographics, economy.realEconomy,
    economy.politicalEconomy, political.powerStructure, political.constitutionalSubstrate,
    capacity.inheritedTerrain, security.posture + capacity.knownAndUnbuilt (documentation-base opener,
    gated only once composed — empty is pending, not a violation). situation has NO opener.
  - ANCHORS (scripts/lib/anchors.cjs, shared by both validators): derived claims carry [dot.path] markers
    (inheritedTerrain, steering, posture, scorecard_anchors, actors Layer 2, risk ratings). Ghost anchor
    (empty/missing target) = hard error; compose-order + allowed-set rules; baseline carries no anchors;
    anchor parity EN/FR is manual like citation parity.
  - Pass B emits situation, actors.*, capacity.knownAndUnbuilt, scorecard, and baseline EMPTY — each is
    populated by its own dedicated pass working from the finished report (situation pass §4d; two-layer
    actors pass per rework §8.1; derivatives pass for scorecard + baseline + gap register). Pass
    order: B → situation (+ approved
    peerCorrections) → derivatives → actors. The situation pass also emits passNotes (per-event
    kept/folded/dropped verdicts) — the validators treat it as the event-scan engagement record. Actors
    Layer 2 renders collapsed and labelled AI-drafted; engagementMode replaces dealability (legacy accepted).
  - ACTORS — STANDING DECISIONS (2026-08-13, apply to EVERY country from here on):
    - LAYER 2 IS PUBLISHED, LABELLED BY KIND. Layer 2 (interests/resources/constraints/likelyMoves/
      engagementMode) renders on the public page, collapsed, in a red caution panel, under a section-level
      "About this section" notice. The label states the KIND of content (model-generated analytical
      inference, offered as a reasoning aid, not a finding to cite) — NOT a confidence grade. The governing
      rule is "never publish the unverified AS IF verified", not "never publish the unverified". Do not
      weaken the notice; do not restore confidence-gradient wording ("AI-drafted — unverified").
    - SEO LAYER 1 ONLY — HARD RULE. The crawlable SEO div in src/pages/country/[cca3].astro emits
      `name: currentPosition` ONLY. NEVER emit interests/resources/constraints/likelyMoves/engagementMode
      there. Rationale: on the crawl surface a framing label detaches from its content (search snippets),
      so only the sourced layer qualifies. Generic code — carries to every country automatically.
    - GROUPING IS RENDER-LEVEL, NEVER A DATA MERGE. Each actor carries a language-neutral `group` slug
      (actors-pass-template v1.12 emits it; copied verbatim into the French step, never translated);
      display labels live in src/lib/actorGroups.ts so NO French enters the YAML. Actors stay INDIVIDUAL
      entries — per-actor fieldsCitedIn granularity is the substrate for cross-domain/correlation work.
      Countries with no slugs fall back to flat lists. USA 101→17 groups, CAN 50→14 (tagged 2026-08-13).
      Do NOT re-merge at data level (the 2026-07-27 CAN merge is the dead convention): raw pre-merge pass
      output survives per country under content/docs/deepsearch-jobs/<ISO3>/, but it is ENGLISH-ONLY and
      the French postdates the merge, so un-merging costs NEW French — it does not save review.
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
- Risk notion (REWORKED 2026-07-19/20, study open): the globe risk-level FILTER FACET and the TOPICS
  FACET are both REMOVED — hand-assigned Manus-era labels (the risk labels recycled from the
  correlation matrix). KEYWORD SEARCH replaces them (src/lib/countryKeywords.ts, shipped 2026-07-20):
  the World Analysis search matches real report content — actor names, situation thread names — for
  TWO-PHASE countries only; add a country's YAML import there when its regeneration lands.
  region = static table, the one factual facet remaining. The RISK REGISTER ITSELF WAS REMOVED
  2026-07-20 (workorder-gap-register.md step 4): risks_*/riskLevel/deriveRiskLevel/RiskCard are gone
  from schema, Keystatic, validators, adapter, renderer; YAML keys stripped from all 13 country files
  (CAN's 7-entry two-phase register cleared — contents preserved in git history at commit a7bb7fe4 and
  earlier; the 11 legacy single-phase registers were regeneration-discard material). The GAP REGISTER
  capacity.knownAndUnbuilt replaces it. The former Layer-2 framing (trigger, horizon, probability x
  impact, mitigants), the aggregate riskLevel, and the correlation cascades stay PARKED pending study.
  countryMetadata.riskCategory AND .topics are legacy-unused. The "report available" marker must track
  two-phase-regenerated status, not mere file existence.
- Two layers: present-state (sourced, validated = analysis.yaml) and a SEPARATE, openly-speculative
  trajectory/extrapolation layer (own contract: plural, anchored to present-state facts, never sourced, never
  a single forecast). Trajectories branch PRIMARILY on capacity.* (knowledge isn't the constraint, capacity
  is) and lead from both substrates — society.* (human) and territory.* (physical); settler-state
  resource/land branches anchor to political_constitutionalSubstrate. Moral guard: a capacity gap is
  inherited/unjustly-distributed, never merit or desert. Never mix trajectory content into the sourced body.
  The Manus-era risk-cascade visualizations (/risk-correlations, hardcoded riskCorrelations.ts data) stay
  VISIBLE as a prototype by author decision (2026-07-19) while the correlation mechanism is re-derived some
  other way — the displayed cascades are Manus-era illustrative data, not register-derived; do not extend
  them.
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