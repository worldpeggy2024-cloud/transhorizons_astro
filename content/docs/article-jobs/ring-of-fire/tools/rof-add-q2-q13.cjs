#!/usr/bin/env node
/*
 * One-off: tag every claim with its question (Peggy's selection, 2026-09-15), add the
 * cost-of-living report as a source, and add winter-road / cost-of-living claims taken as
 * exact spans from fetched text. A span that is not found aborts the whole run.
 */
'use strict';
const fs = require('fs');
const JOB = 'C:/Users/peggy/DevTest/transhorizons_astro/content/docs/article-jobs/ring-of-fire';
const LP = `${JOB}/ledger.json`;
const L = JSON.parse(fs.readFileSync(LP, 'utf8'));
const flat = (id) => fs.readFileSync(`${JOB}/cache/${id}.txt`, 'utf8').replace(/\u0000/g, 'ff').replace(/\s+/g, ' ');
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => `c${String(a + i).padStart(3, '0')}`);

// ── 1. question tags for the existing claims (same assignment as boundary.json) ──
const MAP = {
  q2: range(5, 6), q13: range(150, 152), q4: range(10, 15), q3: [...range(7, 9), ...range(144, 147)],
  q11: [...range(99, 108), ...range(118, 135)], q7: ['c029', 'c030', ...range(33, 49)],
  q8: [...range(50, 54), ...range(62, 64), ...range(81, 87)], q9: [...range(55, 61), ...range(65, 80)],
  q1: range(1, 4), q10: ['c031', 'c032', ...range(88, 98)], q5: [...range(18, 28), ...range(109, 117)],
  q12: [...range(136, 143), 'c148', 'c149', ...range(153, 155)], q6: ['c016', 'c017', ...range(156, 159)],
};
for (const [q, ids] of Object.entries(MAP)) ids.forEach((id) => { const c = L.claims.find((x) => x.id === id); if (c) c.question = q; });

// ── 2. the cost-of-living report as a source ──
if (!L.sources.some((s) => s.id === 's37')) {
  L.sources.push({
    id: 's37',
    name: 'Joseph, C., D. Waugh and D. O’Gorman (Swift Creek Consulting), Cost-of-living in First Nations Communities in the Ring of Fire Region of Northern Ontario, report for the Regional Assessment Working Group, 2026 (registry 80468, reference 263)',
    url: 'https://registrydocumentsprd.blob.core.windows.net/commentsblob/project-80468/comment-66955/P090_SCC_RoF%20Cost%20of%20Living_FINAL_minor%20corrections.pdf',
  });
}

// ── 3. new claims, as exact spans ──
function span(id, start, end) {
  const t = flat(id);
  const i = t.indexOf(start);
  if (i < 0) throw new Error(`${id}: start not found: ${start}`);
  const j = t.indexOf(end, i);
  if (j < 0) throw new Error(`${id}: end not found: ${end}`);
  return t.slice(i, j + end.length);
}
const NEW = [
  // q2 — what the winter road provides, and how it is changing
  ['q2', 'Federal funding: over $7 million a year for 32 remote First Nations and about 3,200 km of winter roads', 's32', ['Indigenous Services Canada (ISC) provides over $7 million annually', 'kilometres of winter roads.']],
  ['q2', 'Federal top-up: $20 million over four years, to $11 million a year', 's32', ['With today’s announcement of an additional $20 million over four years', 'increase to $11 million annually.']],
  ['q2', 'The federal minister on the shortened season: shortages of food, fuel and medical supplies, more air transport', 's32', ['Climate change has significantly shortened the window for winter roads', 'increasing reliance in air transport.']],
  ['q2', 'The federal minister: a shorter season poses supply problems for many remote First Nations', 's33', ['The shortening of the winter road seasons poses important supply problems', 'critical to their quality of life.']],
  ['q2', 'Winter roads are built over land, frozen rivers and lakes by the communities themselves', 's34', ['Winter roads are built over land, frozen rivers and lakes', 'First Nation members.']],
  ['q2', 'Season from around mid-January until spring thaw (Ontario)', 's34', ['From around mid-January until spring thaw', 'bring in supplies.']],
  ['q2', 'Ontario: winter roads lower the cost of transporting goods, fuel and materials', 's34', ['lower the cost of transporting consumer goods, fuel and construction materials', 'remote']],
  ['q2', 'More than 30 remote First Nations with no year-round access (NAN)', 's36', ['More than 30 First Nation communities in Ontario are remote', 'essential goods and services are obtained.']],
  ['q2', 'How warming shortens the season: fewer freezing days to build, earlier breakup (NAN)', 's36', ['The warming climate has shortened the periods of consecutive freezing degree days', 'earlier breakup of winter roads.']],
  ['q2', 'Season down from an average of 77 days to as few as 28 (NAN’s own figure, no method given)', 's36', ['The impacts of climate change have significantly shortened the winter road season', 'or even less in some regions.']],
  ['q2', 'Chiefs declared a state of emergency after a warm winter (NAN)', 's36', ['Last winter our Chiefs were forced to declare a state of emergency', 'threatened the viabi']],
  ['q2', 'Ten of the fifteen regional-assessment First Nations have no all-season road; winter roads and airports carry food and goods', 's5', ['Ten out of the 15 First Nation Partners are not connected by all-season roads', 'food, goods and materials.']],
  ['q2', 'Webequie: accessible only by air or winter road; food, fuel and supplies flown in', 's27', ['Webequie is currently accessible only by air or winter roads', 'must be flown in.']],
  ['q2', 'Air transport is costly and limited; the winter road is insufficient for the community', 's8', ['Air transportation is high in cost and limited in what can be transported.', 'meet the needs of the community.']],
  ['q2', 'The trail to McFaulds Lake is passable end to end only in the coldest months', 's29', ['can only be travelled for the entire distance during the coldest winter months', 'winter months']],
  // q13 — cost of living (the report's own findings are added after it is read)
  ['q13', 'Cost of living is an urgent priority for the regional assessment working group', 's5', ['Cost of living is an urgent priority for the RAWG.', 'RAWG.']],
  ['q13', 'The high cost of fuel in remote communities shapes whether people harvest', 's8', ['given the high cost of fuel in remote communities', 'engaging in land-based activities.']],
];
let next = Math.max(...L.claims.map((c) => Number(c.id.slice(1)))) + 1;
let added = 0;
for (const [question, fact, source, [start, end]] of NEW) {
  if (L.claims.some((c) => c.fact === fact)) continue;
  const quote = span(source, start, end);
  L.claims.push({ id: `c${String(next++).padStart(3, '0')}`, question, section: 'gathered 2026-09-15', fact, source, quote });
  added++;
}
fs.writeFileSync(LP, JSON.stringify(L, null, 2) + '\n');
const untagged = L.claims.filter((c) => !c.question).map((c) => c.id);
console.log(`tagged ${L.claims.length - untagged.length} claims with a question${untagged.length ? ` (untagged: ${untagged.join(', ')})` : ''}; added ${added} claims; sources: ${L.sources.length}`);
