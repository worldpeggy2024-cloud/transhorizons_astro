#!/usr/bin/env node
/*
 * One-off: add claims from any fetched source as exact spans, with page locators.
 *   node rof-add-src.cjs <rows.json>
 * rows: [[question, source, fact, start, end], …]. The page is read from the [[page N]]
 * markers of the source text. A span not found aborts; a fact already present is skipped.
 */
'use strict';
const fs = require('fs');
const JOB = 'C:/Users/peggy/DevTest/transhorizons_astro/content/docs/article-jobs/ring-of-fire';
const LP = `${JOB}/ledger.json`;
const L = JSON.parse(fs.readFileSync(LP, 'utf8'));
const NUL = new RegExp(String.fromCharCode(0), 'g');
const cache = {};
const pagesOf = (id) => {
  if (!cache[id]) {
    const parts = fs.readFileSync(`${JOB}/cache/${id}.txt`, 'utf8').replace(NUL, 'ff').split(/\[\[page (\d+)\]\]/);
    const pages = [];
    if (parts.length === 1) pages.push({ n: null, text: parts[0].replace(/\s+/g, ' ') });
    for (let i = 1; i < parts.length; i += 2) pages.push({ n: +parts[i], text: parts[i + 1].replace(/\s+/g, ' ') });
    cache[id] = pages;
  }
  return cache[id];
};

const rows = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
// Only plain ids (c123) count: clones of a reused claim (c002-2) must not turn the maximum into NaN.
let next = Math.max(...L.claims.map((c) => /^c(\d+)$/.exec(c.id)).filter(Boolean).map((m) => Number(m[1]))) + 1;
let added = 0;
for (const [question, source, fact, start, end, sentence] of rows) {
  const existing = L.claims.find((c) => c.fact === fact);
  if (existing) {
    // Optional 6th field: attach (or re-attach) an existing supporting claim to a draft sentence.
    if (sentence && existing.sentence !== sentence) Object.assign(existing, { sentence, lang: 'en', placement: 'draft-2-support' });
    continue;
  }
  const page = pagesOf(source).find((p) => p.text.includes(start));
  if (!page) throw new Error(`${source}: start not found on any page: ${start}`);
  const i = page.text.indexOf(start);
  const j = page.text.indexOf(end, i);
  if (j < 0 || j - i > 1500) throw new Error(`${source} p.${page.n}: end not found near start: ${end}`);
  L.claims.push({
    id: `c${String(next++).padStart(3, '0')}`, question, section: 'gathered 2026-09-15', fact, source,
    ...(page.n ? { locator: `p. ${page.n}` } : {}),
    quote: page.text.slice(i, j + end.length),
    ...(sentence ? { sentence, lang: 'en', placement: 'draft-2-support' } : {}),
  });
  added++;
}
fs.writeFileSync(LP, JSON.stringify(L, null, 2) + '\n');
console.log(`added ${added} claims; total ${L.claims.length}`);
