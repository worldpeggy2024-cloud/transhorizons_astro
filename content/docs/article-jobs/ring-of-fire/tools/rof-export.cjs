#!/usr/bin/env node
/*
 * Task B of ring-of-fire-restart-handoff.md — the label-free export.
 *
 * ledger-export.md carries, for every claim: id, source title, URL, locator, scope, full
 * quote, and — where the known-errors file names the claim — the source's own words as
 * that file gives them. Nothing else.
 *
 * Deliberately NOT exported, because they are what put the misreadings into draft 4:
 *   - `fact` (the audit label) and `sentence` (draft-4 prose)
 *   - verdicts, questions, notes
 *   - the withdrawn gaps, in any form
 */
'use strict';
const fs = require('fs');
const path = require('path');

const JOB = path.resolve(__dirname, '..');
const L = JSON.parse(fs.readFileSync(path.join(JOB, 'ledger.json'), 'utf8'));
const KE = JSON.parse(fs.readFileSync(path.join(__dirname, 'known-errors-words.json'), 'utf8'));
const today = new Date().toISOString().slice(0, 10);

const src = Object.fromEntries(L.sources.map((s) => [s.id, s]));

// Identical duplicates (c120 / c120-2) are one piece of evidence, not two.
const base = (id) => id.replace(/-\d+$/, '');
const aliases = new Map();
const kept = [];
for (const c of L.claims) {
  const b = base(c.id);
  if (b !== c.id) {
    const orig = L.claims.find((x) => x.id === b);
    if (orig && orig.source === c.source && orig.quote === c.quote) {
      aliases.set(b, [...(aliases.get(b) || []), c.id]);
      continue;
    }
  }
  kept.push(c);
}

const out = [];
out.push('# Ring of Fire — ledger export');
out.push('');
out.push(`Generated ${today} from \`ledger.json\`, for the section-by-section review.`);
out.push('');
out.push('Each entry is one claim: what document it comes from, where in it, and the document\'s own words.');
out.push('There are no labels, no draft sentences and no summaries here, by design — a label that ran ahead of');
out.push('its quote is how fourteen misreadings reached draft 4. Read the quote, not a description of it.');
out.push('');
out.push('**Conventions**');
out.push('');
out.push('- **Quote** is a slice of the fetched document text, verified verbatim against it. `[…]` marks an elision.');
out.push('- **Scope** appears when the quote is *not* about the Webequie Supply Road. Read it before using the quote.');
out.push('- **Reassembled** marks a quote rebuilt from separate columns or pages of a table. It reads as continuous');
out.push('  prose but is not one sentence in the document — check the locator before treating it as one.');
out.push('- **Also cited as** lists claim ids with an identical source and quote.');
out.push('- **Source\'s own words (known-errors file)** repeats the wording given in `ring-of-fire-draft-4-known-errors.md`');
out.push('  for that claim. It is a second rendering; where the two differ in extent, the quote above it governs.');
out.push('');
out.push(`${kept.length} claims · ${L.sources.length} sources`);
out.push('');
out.push('---');
out.push('');

let withScope = 0;
let withKE = 0;
for (const c of kept) {
  const s = src[c.source] || {};
  out.push(`## ${c.id}`);
  out.push('');
  out.push(`- **Source:** ${s.name || `(unknown source ${c.source})`} \`[${c.source}]\``);
  out.push(`- **URL:** ${s.url || '— (not fetched from a URL; see manual/ for the file)'}`);
  if (c.locator) out.push(`- **Locator:** ${c.locator}`);
  if (c.quoteCheck && c.quoteCheck.page != null) out.push(`- **Page (in fetched text):** ${c.quoteCheck.page}`);
  if (c.scope) { out.push(`- **Scope:** ${c.scope}`); withScope++; }
  if (c.reassembled) out.push('- **Reassembled:** yes — built from separate columns/pages; not one continuous sentence in the document.');
  const alias = aliases.get(c.id);
  if (alias) out.push(`- **Also cited as:** ${alias.join(', ')}`);
  out.push('');
  out.push('**Quote**');
  out.push('');
  out.push(`> ${c.quote}`);
  out.push('');
  const ke = KE[c.id];
  if (ke) {
    withKE++;
    out.push('**Source\'s own words (known-errors file)**');
    out.push('');
    for (const k of ke) {
      out.push(`> ${k.words}`);
      out.push('>');
      out.push(`> — *${k.from}*`);
      out.push('');
    }
  }
  out.push('---');
  out.push('');
}

const p = path.join(JOB, 'ledger-export.md');
fs.writeFileSync(p, out.join('\n'));
console.log(`Wrote ${p}`);
console.log(`  ${kept.length} entries (${L.claims.length - kept.length} identical duplicates folded in)`);
console.log(`  ${withScope} carry a scope · ${withKE} carry known-errors words`);

// Guard: nothing that was meant to stay out may have slipped in.
const text = fs.readFileSync(p, 'utf8');
const banned = [
  ['g-floating-validation', 'withdrawn gap'],
  ['g-corridor-modes', 'withdrawn gap'],
  ['g-ontario-in-ra', 'withdrawn gap'],
];
let leaked = 0;
for (const [needle, what] of banned) {
  if (text.includes(needle)) { console.error(`  LEAK: ${what} "${needle}" appears in the export`); leaked++; }
}
for (const c of L.claims) {
  if (c.fact && text.includes(c.fact) && c.fact.length > 25) { console.error(`  LEAK: label of ${c.id} appears in the export`); leaked++; }
  if (c.sentence && text.includes(c.sentence) && c.sentence.length > 25) { console.error(`  LEAK: draft sentence of ${c.id} appears in the export`); leaked++; }
}
if (leaked) process.exitCode = 1;
else console.log('  clean: no labels, no draft sentences, no withdrawn gaps');
