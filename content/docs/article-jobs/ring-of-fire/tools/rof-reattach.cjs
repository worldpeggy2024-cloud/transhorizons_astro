#!/usr/bin/env node
/*
 * Move the article from one draft to the next without losing verdicts that still apply.
 *   node rof-reattach.cjs <draft.md> <fromLabel> <toLabel>
 * 1. stash every verdict of a <fromLabel> placement (by claim id)
 * 2. clear <fromLabel>: drop its clones and notes, unplace its claims
 * 3. run rof-attach.cjs <draft.md> <toLabel>
 * 4. give each re-placed claim its stashed verdict back. The verdict carries hash(sentence, quote), so `check`
 *    treats it as STALE wherever the sentence or the quote changed, and verify-prompt re-asks only those.
 * Claims left unplaced lose their verdict. "*-support" placements (sentence fragments) are not touched.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const JOB = 'C:/Users/peggy/DevTest/transhorizons_astro/content/docs/article-jobs/ring-of-fire';
const LP = `${JOB}/ledger.json`;
const [MD, FROM, TO] = process.argv.slice(2);
if (!MD || !FROM || !TO) throw new Error('usage: rof-reattach.cjs <draft.md> <fromLabel> <toLabel>');

let L = JSON.parse(fs.readFileSync(LP, 'utf8'));
const stash = {};
for (const c of L.claims) if (c.placement === FROM && c.verdict) stash[c.id] = c.verdict;
const clones = L.claims.filter((c) => c.placement === FROM && c.placedFrom).length;
L.claims = L.claims.filter((c) => !(c.placement === FROM && c.placedFrom));
for (const c of L.claims) if (c.placement === FROM) { delete c.sentence; delete c.lang; delete c.placement; delete c.verdict; }
L.notes = (L.notes || []).filter((n) => n.placement !== FROM);
fs.writeFileSync(LP, JSON.stringify(L, null, 2) + '\n');
console.log(`cleared ${FROM}: ${Object.keys(stash).length} verdicts stashed, ${clones} clones dropped\n`);

process.stdout.write(execFileSync(process.execPath, [path.join(__dirname, 'rof-attach.cjs'), MD, TO], { encoding: 'utf8' }));

L = JSON.parse(fs.readFileSync(LP, 'utf8'));
let restored = 0;
for (const c of L.claims) if (c.placement === TO && stash[c.id]) { c.verdict = stash[c.id]; restored++; }
fs.writeFileSync(LP, JSON.stringify(L, null, 2) + '\n');
const dropped = Object.keys(stash).filter((id) => !L.claims.some((c) => c.id === id && c.placement === TO));
console.log(`\nverdicts carried over: ${restored} (check marks the changed ones STALE); no longer placed: ${dropped.join(', ') || 'none'}`);
