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
