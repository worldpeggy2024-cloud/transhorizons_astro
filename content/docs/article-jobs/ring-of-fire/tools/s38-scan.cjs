'use strict';
// Scan the government review team section of Appendix B (s38, pp. 2-60) for the article's topics.
const fs = require('fs');
const NUL = new RegExp(String.fromCharCode(0), 'g');
const t = fs.readFileSync('C:/Users/peggy/DevTest/transhorizons_astro/content/docs/article-jobs/ring-of-fire/cache/s38.txt', 'utf8').replace(NUL, 'ff');
const parts = t.split(/\[\[page (\d+)\]\]/);
const pages = [];
for (let i = 1; i < parts.length; i += 2) pages.push({ n: +parts[i], text: parts[i + 1].replace(/\s+/g, ' ') });
const from = +(process.argv[2] || 2);
const to = +(process.argv[3] || 60);
const scope = pages.filter((p) => p.n >= from && p.n <= to);

const topics = [
  ['floating road / culverts / hydrology', /floating road|equali[sz]ation culvert|sheet flow|hydrolog\w* (?:connectivity|regime|model|study|monitor)/i],
  ['validation / evidence / uncertainty', /validat|not fully supported|uncertain|insufficient (?:information|evidence)|no evidence|not demonstrated/i],
  ['caribou', /caribou/i],
  ['cumulative / other roads', /cumulative|Marten Falls|Northern Road Link|MFCAR|\bNRL\b/i],
  ['regional assessment', /regional assessment/i],
  ['alternatives / rail / corridor', /alternatives? (?:to|method)|\brail\b|corridor/i],
  ['mercury', /mercury/i],
  ['peat carbon / GHG', /carbon|greenhouse|GHG|methane/i],
  ['winter road / cost of living', /winter road|cost of living|food (?:price|cost|security)/i],
];
for (const [label, re] of topics) {
  const hits = scope.filter((p) => re.test(p.text));
  console.log(`\n=== ${label}: pages ${hits.map((p) => p.n).join(', ') || 'none'}`);
  hits.slice(0, 3).forEach((p) => {
    const m = re.exec(p.text);
    console.log(`  p.${p.n} …${p.text.slice(Math.max(0, m.index - 260), m.index + 380)}…`);
  });
}
