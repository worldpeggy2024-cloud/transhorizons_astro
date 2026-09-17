#!/usr/bin/env node
// node rof-find.cjs <sourceId> <literal, case-insensitive> [before=300] [after=300] — every occurrence, with page.
'use strict';
const fs = require('fs');
const JOB = 'C:/Users/peggy/DevTest/transhorizons_astro/content/docs/article-jobs/ring-of-fire';
const [id, needle, b = 300, a = 300] = process.argv.slice(2);
const flat = fs.readFileSync(`${JOB}/cache/${id}.txt`, 'utf8').replace(/\u0000/g, 'ff').replace(/\s+/g, ' ');
const low = flat.toLowerCase();
let i = -1;
let n = 0;
while ((i = low.indexOf(needle.toLowerCase(), i + 1)) >= 0) {
  const pm = [...flat.slice(0, i).matchAll(/\[\[page (\d+)\]\]/g)].pop();
  console.log(`\n-- ${id} p.${pm ? pm[1] : '?'} @${i}: …${flat.slice(Math.max(0, i - b), i)}⟦${flat.slice(i, i + needle.length)}⟧${flat.slice(i + needle.length, i + needle.length + Number(a))}…`);
  if (++n >= 12) break;
}
if (!n) console.log(`-- ${id}: not found: ${needle}`);
