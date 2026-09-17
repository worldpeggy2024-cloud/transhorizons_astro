#!/usr/bin/env node
/*
 * One-off: add claims from the cost-of-living report (s37) as exact spans of its fetched text.
 * Usage: node rof-add-s37.cjs            (road-access section)
 *        node rof-add-s37.cjs <extra.json>  (more [question, fact, start, end] rows)
 * A span not found aborts the run; a fact already present is skipped.
 */
'use strict';
const fs = require('fs');
const JOB = 'C:/Users/peggy/DevTest/transhorizons_astro/content/docs/article-jobs/ring-of-fire';
const LP = `${JOB}/ledger.json`;
const L = JSON.parse(fs.readFileSync(LP, 'utf8'));
const T = fs.readFileSync(`${JOB}/cache/s37.txt`, 'utf8').replace(/\s+/g, ' ');

const ROWS = [
  ['q13', 'All-season road access exists for a third of the fifteen communities; two-thirds rely on expensive air service', 'All-season road access only exists for a third of the 15 communities', 'most of the year.'],
  ['q13', 'Roads cut both ways: cheaper freight and travel, but access for unwanted influences and pressures', 'Improving road access to First Nations communities is one example where both positive and negative effects can be foreseen', 'some community members are deeply concerned.'],
  ['q2', 'Winter roads are typically open six to ten weeks a year, some for less', 'Generally, winter roads are typically open for only six to ten weeks per year', 'shorter periods of time.'],
  ['q2', 'Peawanuck’s road to Manitoba: about a two-week window (a community member)', 'According to a community member, the road connecting Peawanuck', 'runs into complications.'],
  ['q2', 'Winter roads carry fuel, food, building materials and people', 'These seasonal roads serve as lifelines', 'building materials, and people.'],
  ['q2', 'Driving south to stock up is not affordable for everyone', 'Winter roads provide an opportunity to drive south and stock up', 'but not everyone can afford such trips'],
  ['q2', 'Projection (Manitoba as proxy): by the 2050s roads open five days later and the season is ten days shorter', 'Projections for Manitoba winter roads', 'the season will be ten days shorter'],
  ['q2', 'Worse winter roads mean higher costs: maintenance and more air freight', 'Worsening winter road conditions leads to higher costs', 'growing need to rely on air freight.'],
  ['q2', 'Road-building grants: about $11 million a year federal, about $13 million provincial (the report’s figures)', 'The costs of building and maintaining these roads are supported by grants', '(approximately $13 million per year).'],
  ['q13', 'Tuktoyaktuk (NWT): food prices rose after the all-season road opened, mainly from the loss of Nutrition North freight subsidies', 'However, a recent study found that food prices in Tuktoyaktuk had actually increased', 'loss of NNC freight subsidies.'],
  ['q13', 'The Inuvik–Tuktoyaktuk Highway: 137 km, 2017, about $299 million, replacing a winter-only ice road', 'the Inuvik-to-Tuktoyaktuk Highway, a 137 km', 'replaced a winter-only ice road'],
  ['q13', 'The same highway saves about $560,000 a year in winter-road costs', 'The NWT did note that the highway is estimated to save', 'construction and maintenance costs.'],
];

const extra = process.argv[2] ? JSON.parse(fs.readFileSync(process.argv[2], 'utf8')) : [];
let next = Math.max(...L.claims.map((c) => Number(c.id.slice(1)))) + 1;
let added = 0;
for (const [question, fact, start, end] of [...ROWS, ...extra]) {
  if (L.claims.some((c) => c.fact === fact)) continue;
  const i = T.indexOf(start);
  if (i < 0) throw new Error(`s37: start not found: ${start}`);
  const j = T.indexOf(end, i);
  if (j < 0 || j - i > 1500) throw new Error(`s37: end not found near start: ${end}`);
  L.claims.push({ id: `c${String(next++).padStart(3, '0')}`, question, section: 'gathered 2026-09-15', fact, source: 's37', quote: T.slice(i, j + end.length) });
  added++;
}
fs.writeFileSync(LP, JSON.stringify(L, null, 2) + '\n');
console.log(`added ${added} claims from s37; total claims ${L.claims.length}`);
