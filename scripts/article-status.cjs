#!/usr/bin/env node
/*
 * article-status — see, and change, whether an article is published.
 *
 * Readiness is a JUDGEMENT: has the French been reviewed, is the piece finished.
 * No script can detect that, so this does not try. It just makes recording your
 * decision a command instead of a hand-edit of TypeScript, and prints what the
 * decision will change.
 *
 *   npm run article:status              list every article and its state
 *   npm run article:ready <slug>        mark finished  → notice off, into sitemap
 *   npm run article:draft <slug>        mark unfinished → notice on, out of sitemap
 *
 * Writes one flag in src/lib/articleRegistry.ts. Everything else derives from it.
 * Run `npm run build` afterwards for the change to reach the site.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const REGISTRY = path.join(ROOT, 'src/lib/articleRegistry.ts');

const [, , cmd, slugArg] = process.argv;
const src = fs.readFileSync(REGISTRY, 'utf8');

// Reuse the same tolerant row-splitting as the checker: isolate the array, then
// take top-level { … } chunks, so field order and spacing don't matter.
const eq = src.indexOf('=', src.indexOf('export const ARTICLES'));
const open = src.indexOf('[', eq);
let depth = 0, close = -1;
for (let i = open; i < src.length; i++) {
  if (src[i] === '[') depth++;
  else if (src[i] === ']' && --depth === 0) { close = i; break; }
}
const body = src.slice(open + 1, close);
const rows = [];
let d = 0, start = -1;
for (let i = 0; i < body.length; i++) {
  if (body[i] === '{') { if (d++ === 0) start = i; }
  else if (body[i] === '}') {
    if (--d === 0) {
      const text = body.slice(start, i + 1);
      const g = (f, re) => { const m = text.match(new RegExp('\\b' + f + '\\s*:\\s*' + re)); return m ? m[1] : null; };
      rows.push({
        text,
        slug: g('slug', "['\"]([^'\"]+)['\"]"),
        section: g('section', "['\"]([^'\"]+)['\"]"),
        hasStaticPage: g('hasStaticPage', '(true|false)') === 'true',
        finalised: g('finalised', '(true|false)') === 'true',
      });
    }
  }
}

const list = () => {
  const w = Math.max(...rows.map((r) => r.slug.length));
  console.log('\n  ' + 'ARTICLE'.padEnd(w) + '  STATE      CRAWLABLE PAGE   IN SITEMAP');
  for (const r of rows) {
    console.log(
      '  ' + r.slug.padEnd(w) +
      '  ' + (r.finalised ? 'published' : 'DRAFT    ') +
      '  ' + (r.hasStaticPage ? 'yes' : 'no — React only').padEnd(15) +
      '  ' + (r.finalised && r.hasStaticPage ? 'yes' : 'no')
    );
  }
  console.log('\n  DRAFT shows the "under review" notice to readers and search engines.');
  console.log('  Change with:  npm run article:ready <name>   /   npm run article:draft <name>\n');
};

if (!cmd || cmd === 'status') { list(); process.exit(0); }

if (cmd !== 'ready' && cmd !== 'draft') {
  console.error(`\nUnknown command "${cmd}". Use: status | ready <slug> | draft <slug>\n`);
  process.exit(1);
}
if (!slugArg) { console.error(`\nWhich article? e.g. npm run article:${cmd} ai-governance\n`); list(); process.exit(1); }

const row = rows.find((r) => r.slug === slugArg);
if (!row) {
  console.error(`\nNo article called "${slugArg}".\n`);
  list();
  process.exit(1);
}

const want = cmd === 'ready';
if (row.finalised === want) {
  console.log(`\n  "${row.slug}" is already ${want ? 'published' : 'a draft'} — nothing to change.\n`);
  process.exit(0);
}
if (want && !row.hasStaticPage) {
  console.error(
    `\n  Cannot publish "${row.slug}": it has no server-rendered page, so search engines\n` +
    `  would receive an empty shell. Create src/pages/${row.section}/${row.slug}.astro and set\n` +
    `  hasStaticPage: true first.\n`
  );
  process.exit(1);
}

/*
 * Keep the file's column alignment: the value is padded to a fixed width so
 * "true" and "false" occupy the same space. Without this a round trip
 * (ready → draft) leaves stray spaces and the rows stop lining up.
 */
const updated = row.text.replace(
  /\bfinalised\s*:\s*(true|false)[ \t]*(?=[,}])/,
  'finalised: ' + String(want).padEnd(6)
);
fs.writeFileSync(REGISTRY, src.replace(row.text, updated));

console.log(`\n  "${row.slug}" → ${want ? 'PUBLISHED' : 'DRAFT'}`);
console.log(want
  ? '    · "under review" notice removed (page and search results)\n    · added to sitemap.xml\n    · Draft badge removed from the cards'
  : '    · "under review" notice shown again\n    · removed from sitemap.xml\n    · Draft badge back on the cards');

try {
  execFileSync('node', [path.join(__dirname, 'check-article-registry.cjs')], { stdio: 'inherit' });
} catch {
  console.error('\n  Consistency check failed — see above.\n');
  process.exit(1);
}
/*
 * `npm run deploy` runs `fly deploy`, which uploads the working directory and
 * rebuilds inside Docker (`pnpm run build`, which does run the prebuild check).
 * So a local `npm run build` is for checking, not a prerequisite for deploying —
 * and this flag change ships whether or not it has been committed.
 */
console.log('\n  This is recorded locally. To see it:  pnpm run dev');
console.log('  To publish it to transhorizons.net:   npm run deploy\n');
