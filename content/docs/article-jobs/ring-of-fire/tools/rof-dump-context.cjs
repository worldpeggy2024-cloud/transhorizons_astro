#!/usr/bin/env node
// Print, for each claim id given, its quote, sentence, verdict note and ~W chars of source text around the quote.
'use strict';
const fs = require('fs');
const JOB = 'C:/Users/peggy/DevTest/transhorizons_astro/content/docs/article-jobs/ring-of-fire';
const L = JSON.parse(fs.readFileSync(`${JOB}/ledger.json`, 'utf8'));
const W = Number(process.env.W || 400);
for (const id of process.argv.slice(2)) {
  const c = L.claims.find((x) => x.id === id);
  if (!c) { console.log(`## ${id}: NOT FOUND`); continue; }
  console.log(`\n## ${id} [${c.source}] verdict=${c.verdict && c.verdict.value} page=${c.quoteCheck && c.quoteCheck.page}`);
  console.log(`SENTENCE: ${c.sentence}`);
  console.log(`QUOTE: ${c.quote}`);
  if (c.verdict && c.verdict.note) console.log(`NOTE: ${c.verdict.note}`);
  const raw = fs.readFileSync(`${JOB}/cache/${c.source}.txt`, 'utf8').replace(/\u0000/g, 'ff');
  const flat = raw.replace(/\s+/g, ' ');
  const seg = c.quote.split(/\s*(?:\[\.\.\.\]|\.\.\.|…)\s*/).filter((x) => x.length >= 3)[0].replace(/\s+/g, ' ');
  let i = flat.indexOf(seg);
  if (i < 0) i = flat.toLowerCase().indexOf(seg.toLowerCase().slice(0, 25));
  if (i < 0) { console.log('CONTEXT: (first segment not found literally)'); continue; }
  console.log(`CONTEXT: …${flat.slice(Math.max(0, i - W), i)}⟦${flat.slice(i, i + seg.length)}⟧${flat.slice(i + seg.length, i + seg.length + W)}…`);
}
