#!/usr/bin/env node
/*
 * check-article-registry — fails the build when article readiness drifts.
 *
 * src/lib/articleRegistry.ts declares, per article, whether it has a
 * server-rendered .astro page (governs LINKING) and whether it is finalised
 * (governs INDEXING and the draft notice). Everything else derives from that:
 * the Draft badge, the SSR draft notice, the crawlable link gates, the sitemap.
 *
 * Derivation stops the three lists drifting from EACH OTHER. It cannot stop the
 * registry drifting from the FILESYSTEM — a row can claim a page that was never
 * written, or an .astro page can be added and the flag forgotten, and the site
 * would quietly go on linking crawlers into empty shells. That is the failure
 * this checks for, at the one moment it is cheap to fix.
 *
 * Runs as `prebuild`, so `npm run build` cannot succeed in a drifted state.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const REGISTRY = path.join(ROOT, 'src/lib/articleRegistry.ts');
const errors = [];
const warnings = [];

// Parse the registry rows without loading TypeScript.
const src = fs.readFileSync(REGISTRY, 'utf8');
/*
 * Parsing without running TypeScript. This script is plain JS so `prebuild` needs
 * no extra tooling, which means it cannot import ARTICLES — it reads the file as
 * text.
 *
 * A row this cannot parse must FAIL, never be skipped: silently dropping a row
 * would let the check pass while the very article just edited goes unchecked.
 * So rather than matching one rigid row shape, isolate the array, split it into
 * objects by brace depth, and pull each field out by NAME. That tolerates field
 * order, quote style, extra fields, trailing commas and line wrapping — every
 * row is either understood or reported.
 */
const arrayStart = src.indexOf('export const ARTICLES');
// Take the '[' after the '=', not the one in the type annotation `ArticleEntry[]`.
const eq = src.indexOf('=', arrayStart);
const open = src.indexOf('[', eq);
let depth = 0, close = -1;
for (let i = open; i < src.length; i++) {
  if (src[i] === '[') depth++;
  else if (src[i] === ']' && --depth === 0) { close = i; break; }
}
if (arrayStart === -1 || close === -1) {
  console.error('check-article-registry: could not locate the ARTICLES array in articleRegistry.ts.');
  process.exit(1);
}
const body = src.slice(open + 1, close).replace(/\/\/[^\n]*/g, '');

// Split into top-level { … } chunks.
const chunks = [];
let d = 0, start = -1;
for (let i = 0; i < body.length; i++) {
  if (body[i] === '{') { if (d++ === 0) start = i; }
  else if (body[i] === '}') { if (--d === 0) chunks.push(body.slice(start, i + 1)); }
}

const str = (chunk, field) => {
  const mm = chunk.match(new RegExp('\\b' + field + '\\s*:\\s*[\'"]([^\'"]+)[\'"]'));
  return mm ? mm[1] : null;
};
const bool = (chunk, field) => {
  const mm = chunk.match(new RegExp('\\b' + field + '\\s*:\\s*(true|false)\\b'));
  return mm ? mm[1] === 'true' : null;
};

const rows = [];
chunks.forEach((chunk, i) => {
  const row = {
    slug: str(chunk, 'slug'),
    yamlFile: str(chunk, 'yamlFile'),
    section: str(chunk, 'section'),
    hasStaticPage: bool(chunk, 'hasStaticPage'),
    finalised: bool(chunk, 'finalised'),
  };
  const missing = Object.entries(row).filter(([, v]) => v === null).map(([k]) => k);
  if (missing.length) {
    errors.push(`articleRegistry.ts row ${i + 1}${row.slug ? ` (${row.slug})` : ''}: could not read ${missing.join(', ')} — the row would go unchecked.`);
    return;
  }
  rows.push(row);
});
if (chunks.length === 0) {
  console.error('check-article-registry: parsed 0 article rows — the registry format changed. Update the parser.');
  process.exit(1);
}
const dupes = rows.map((r) => r.slug).filter((s, i, a) => a.indexOf(s) !== i);
if (dupes.length) errors.push(`articleRegistry.ts: duplicate slug(s): ${[...new Set(dupes)].join(', ')}`);

const bySlug = new Map(rows.map((r) => [r.slug, r]));

for (const r of rows) {
  // 1. The YAML the article is written from must exist.
  if (!fs.existsSync(path.join(ROOT, 'content/articles', r.yamlFile + '.yaml'))) {
    errors.push(`${r.slug}: yamlFile "${r.yamlFile}.yaml" not found in content/articles/`);
  }

  // 2. hasStaticPage must match reality, in BOTH directions.
  const astro = path.join(ROOT, 'src/pages', r.section, r.slug + '.astro');
  const exists = fs.existsSync(astro);
  if (r.hasStaticPage && !exists) {
    errors.push(`${r.slug}: hasStaticPage is true but src/pages/${r.section}/${r.slug}.astro does not exist — pages will link crawlers into an empty shell.`);
  }
  if (!r.hasStaticPage && exists) {
    errors.push(`${r.slug}: src/pages/${r.section}/${r.slug}.astro exists but hasStaticPage is false — the page is crawlable yet nothing links to it. Set hasStaticPage: true.`);
  }

  // 3. Finalised means indexed, which requires a page to index.
  if (r.finalised && !r.hasStaticPage) {
    errors.push(`${r.slug}: finalised without a static page — it cannot be indexed. Give it an .astro page first.`);
  }

  // 4. A finalised article must carry the review notice component, so that
  //    un-finalising it later actually shows the notice again.
  if (exists) {
    const page = fs.readFileSync(astro, 'utf8');
    if (!page.includes('<ReviewNotice')) {
      warnings.push(`${r.slug}: src/pages/${r.section}/${r.slug}.astro has no <ReviewNotice> — a draft here would show no notice to crawlers.`);
    }
  }
}

// 5. No server-rendered page may LINK to a slug without a static page.
const pagesDir = path.join(ROOT, 'src/pages');
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name);
  return e.isDirectory() ? walk(p) : p.endsWith('.astro') ? [p] : [];
});
const linkRe = /href="\/(portfolio|notes)\/([a-z0-9-]+)"/g;
for (const file of walk(pagesDir)) {
  const text = fs.readFileSync(file, 'utf8');
  let lm;
  while ((lm = linkRe.exec(text)) !== null) {
    const [, section, slug] = lm;
    if (section === 'notes' && !bySlug.has(slug)) continue; // /notes index links etc.
    const row = bySlug.get(slug);
    if (!row) continue;
    if (!row.hasStaticPage) {
      const line = text.slice(0, lm.index).split('\n').length;
      errors.push(`${path.relative(ROOT, file)}:${line} links to /${section}/${slug}, which has no static page — a crawler following it gets an empty shell. Render it as plain text.`);
    }
  }
}

for (const w of warnings) console.warn('  warning: ' + w);
if (errors.length) {
  console.error('\ncheck-article-registry FAILED:\n');
  for (const e of errors) console.error('  - ' + e);
  console.error('\nFix src/lib/articleRegistry.ts (or the page) and rebuild.\n');
  process.exit(1);
}
console.log(`check-article-registry: ${rows.length} articles OK (${rows.filter((r) => r.finalised).length} finalised, ${rows.filter((r) => r.hasStaticPage).length} server-rendered)`);
