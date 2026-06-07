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
- French content is proofread by Peggy only — never machine-modify French text.
- Site purpose: professional portfolio for career pivot. Geographic accuracy is non-negotiable.
