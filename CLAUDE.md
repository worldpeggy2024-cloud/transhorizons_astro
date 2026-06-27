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
- Authoring: TWO-PHASE deep research only (Pass A = sources; Pass B = prose citing only approved IDs), via
  scripts/deepsearch-country-workflow.cjs. Single-phase output is NOT trustworthy and is being regenerated;
  do not treat existing single-phase country content as ground truth. Only DEU and BRA are two-phase so far.
  Tool-agnostic: Perplexity is one sourcing option, not hard-wired.
- Sections, in order: executiveSnapshot, political.*, economy.*, society.*, security.*, actors.*, risks,
  sources. SOCIETY is a top-level peer: society_demographics/composition/religion/cohesion (_en/_fr each),
  plus scorecard_socialCohesion (distinct from scorecard_eliteCohesion). Declare any new society field in the
  `countries` collection schema BEFORE writing content (strip rule).
- riskLevel (globe filter): DERIVED by rule from the country's own risk register, never assigned by hand or
  AI fiat. Strict rule: High = >=1 risk that is High on BOTH probability and impact; Medium = none High-both
  but >=1 risk touching High on either axis; Low = otherwise. region = static table; topics =
  pipeline-proposed, human-confirmed. The "report available" marker must track two-phase-regenerated status,
  not mere file existence.
- Two layers: present-state (sourced, validated = analysis.yaml) and a SEPARATE, openly-speculative
  trajectory/extrapolation layer (own contract: plural, anchored to present-state facts, never sourced, never
  a single forecast). Never mix trajectory content into the sourced body. The Manus-era risk-cascade
  visualizations belong to the trajectory layer and are PARKED until per-country risk registers are
  trustworthy.
- SSR: country pages currently have NO .astro SEO layer (React-only) — they are being brought into the
  dual-renderer pattern. Build the country .astro by COPYING the existing article SSR pattern (hidden SEO div
  + AppShell client:only="react"; do NOT switch to client:load). A country route that shadows
  [...slug].astro counts as affecting the catch-all — flag before adding. Expose a country page only once its
  content is two-phase-regenerated and proofed; .net stays on hold (see Deployment).
- Validation: scripts/validate-country-citations.cjs. Required source fields: name, url, desc, accessDate,
  confidence, citationType (+ id); publicationDate optional (warning only). Add 'society_' to
  warningFieldPrefixes so society numerics get time-binding warnings. Does NOT enforce EN/FR parity — treat
  parity as a manual check (or wire one).
- Migration is REGENERATION, not preservation: countries not yet on analysis.yaml are re-made through the
  two-phase pipeline (use scripts/migrate-country-ts-to-keystatic.cjs where an old hardcoded .ts exists). No
  single-phase content is preserved. Discarding single-phase country content is the author's explicit
  decision, not a unilateral removal.