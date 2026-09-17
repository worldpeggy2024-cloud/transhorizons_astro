'use strict';
// Verify Nibinamik's quotation of MNR against the original Appendix B tables (s38), with page numbers.
const fs = require('fs');
const E = require('C:/Users/peggy/DevTest/transhorizons_astro/scripts/lib/evidence.cjs');
const NUL = new RegExp(String.fromCharCode(0), 'g');
const t = fs.readFileSync('C:/Users/peggy/DevTest/transhorizons_astro/content/docs/article-jobs/ring-of-fire/cache/s38.txt', 'utf8').replace(NUL, 'ff');
const parts = t.split(/\[\[page (\d+)\]\]/);
const pages = [];
for (let i = 1; i < parts.length; i += 2) pages.push({ n: +parts[i], text: parts[i + 1].replace(/\s+/g, ' ') });

const quotes = [
  'The Final EA includes several conclusions related to peatland impacts and greenhouse gas',
  'are not fully supported by the information provided',
  'Even moderate disturbances',
  'it is reasonable to expect that peatland impacts will occur, even with',
];
for (const q of quotes) {
  const hit = pages.find((p) => E.normalize(p.text).includes(E.normalize(q)));
  console.log(`${hit ? `FOUND p.${hit.n}` : 'NOT FOUND'} — ${q}`);
}
const p = pages.find((x) => /reasonable to expect that peatland impacts will occur/i.test(x.text));
if (p) {
  const prev = pages.find((x) => x.n === p.n - 1);
  console.log(`\n=== context: end of p.${p.n - 1}\n${prev ? prev.text.slice(-2200) : ''}`);
  console.log(`\n=== p.${p.n}\n${p.text.slice(0, 4500)}`);
}
