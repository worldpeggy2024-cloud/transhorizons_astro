#!/usr/bin/env node
/*
 * One-off: search every fetched Ring of Fire document for each candidate silence, so a
 * "nothing addresses X" line rests on a recorded search rather than on an impression.
 * Prints, per candidate, which documents mention the terms and a short snippet of each hit.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const JOB = 'C:/Users/peggy/DevTest/transhorizons_astro/content/docs/article-jobs/ring-of-fire';
const L = JSON.parse(fs.readFileSync(`${JOB}/ledger.json`, 'utf8'));
const docs = L.sources.map((s) => ({ id: s.id, name: s.name, text: fs.readFileSync(`${JOB}/cache/${s.id}.txt`, 'utf8').replace(/\u0000/g, 'ff').replace(/\s+/g, ' ') }));

const CANDIDATES = [
  { id: 'g-corridor-modes', q: 'Did any assessment compare transport modes or routes for the whole corridor, rather than for one segment?',
    terms: [/alternative[s]? (?:to|for) the (?:corridor|network|road network)/i, /corridor[- ]level|network[- ]level|whole corridor|entire corridor|all three roads/i, /(?:rail|railway).{0,80}(?:Marten Falls|Northern Road Link|corridor)/i] },
  { id: 'g-nrl-timeline', q: 'Is there a published schedule or decision date for the Northern Road Link?',
    terms: [/Northern Road Link.{0,160}(?:20[23]\d|schedule|construction|approv|timeline)/i, /(?:20[23]\d|schedule|construction|approv|timeline).{0,160}Northern Road Link/i] },
  { id: 'g-processing', q: 'Does any assessment document address where the ore would be processed (smelter, ferrochrome)?',
    terms: [/ferrochrom/i, /smelt/i, /refiner/i, /processing facilit/i] },
  { id: 'g-mercury-study', q: 'Has the mercury or methylmercury study the regional assessment lists been carried out?',
    terms: [/methylmercury/i, /mercury (?:study|studies|baseline|sampling|monitoring)/i] },
  { id: 'g-floating-validation', q: 'Has a floating road with equalisation culverts been validated in peatland like this?',
    terms: [/validat/i, /field (?:trial|test)|tested in peat|pilot (?:section|study)/i, /floating road.{0,120}(?:monitor|study|evidence|literature|reference)/i] },
  { id: 'g-cost-of-living', q: 'Is there a finding on how an all-season road changes the cost of living in a remote community?',
    terms: [/cost of living/i, /food (?:price|cost)s?/i, /Nutrition North|food subsid/i] },
  { id: 'g-ontario-in-ra', q: 'Did Ontario take part in the regional assessment?',
    terms: [/Ontario.{0,80}(?:declin|not participat|has not|did not|TBD|invit)/i, /(?:province of Ontario|Government of Ontario).{0,60}(?:collaborat|participat|party)/i] },
  { id: 'g-cumulative-three-roads', q: 'Did any approved assessment assess the cumulative effects of the three roads together?',
    terms: [/cumulative effects.{0,200}(?:Marten Falls|Northern Road Link)/i, /(?:Marten Falls|Northern Road Link).{0,200}cumulative effects/i] },
];

const date = new Date().toISOString().slice(0, 10);
const results = [];
for (const c of CANDIDATES) {
  const hits = [];
  for (const d of docs) {
    const snippets = [];
    let count = 0;
    for (const re of c.terms) {
      const g = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
      let m;
      while ((m = g.exec(d.text)) !== null) {
        count++;
        if (snippets.length < 2) snippets.push(d.text.slice(Math.max(0, m.index - 90), m.index + m[0].length + 90));
        if (count > 200) break;
      }
    }
    if (count) hits.push({ id: d.id, name: d.name, count, snippets });
  }
  results.push({ ...c, terms: c.terms.map(String), searched: docs.length, date, hits });
  console.log(`\n=== ${c.id} — ${c.q}`);
  console.log(`    searched ${docs.length} documents; mentioned in ${hits.length}`);
  for (const h of hits) {
    console.log(`  ${h.id} (${h.count}) ${h.name.slice(0, 70)}`);
    h.snippets.forEach((s) => console.log(`      …${s}…`));
  }
}
fs.writeFileSync(`${JOB}/silences-search.json`, JSON.stringify(results, null, 2) + '\n');
console.log(`\nWrote ${JOB}/silences-search.json`);
