#!/usr/bin/env node
/*
 * Attach a marked draft to the ledger (idempotent: re-running replaces the previous placements).
 *   node rof-attach.cjs <draft.md> [placementLabel]
 * - writes <job>/<label>.yaml (title, introduction = text before the first ##, sections), markers stripped
 * - for each sentence followed by markers: {cNNN} → the claim gets `sentence` + lang en (a fact used in
 *   several sentences gets one clone per extra use, id cNNN-2, cNNN-3 …, because each use needs its own
 *   verdict); {reasoning} → a reasoning note; {g-…} → a gap note
 * - lists every sentence with no marker, and every [NEEDS SOURCE] sentence
 * - points ledger.article at the draft YAML
 */
'use strict';
const fs = require('fs');
const ROOT = 'C:/Users/peggy/DevTest/transhorizons_astro';
const yaml = require(`${ROOT}/node_modules/js-yaml`);
const E = require(`${ROOT}/scripts/lib/evidence.cjs`);
const JOB = `${ROOT}/content/docs/article-jobs/ring-of-fire`;
const LP = `${JOB}/ledger.json`;
const MD = process.argv[2];
const LABEL = process.argv[3] || 'draft-2';
if (!MD) throw new Error('usage: rof-attach.cjs <draft.md> [label]');

const L = JSON.parse(fs.readFileSync(LP, 'utf8'));
// undo a previous run of this label
L.claims = L.claims.filter((c) => c.placedFrom === undefined || c.placement !== LABEL);
for (const c of L.claims) if (c.placement === LABEL) { delete c.sentence; delete c.lang; delete c.placement; delete c.verdict; }
L.notes = (L.notes || []).filter((n) => n.placement !== LABEL);

const MARK = /\{([^}]+)\}/g;
const strip = (s) => s.replace(MARK, '').replace(/[ \t]+/g, ' ').replace(/ +([.,;:])/g, '$1').trim();

const md = fs.readFileSync(MD, 'utf8').replace(/\r\n/g, '\n');
const blocks = md.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
let title = null;
const intro = [];
const sections = [];
let cur = null;
const placements = [];
const unmarked = [];
const needs = [];

for (const b of blocks) {
  if (/^# /.test(b)) { title = b.replace(/^# /, '').trim(); continue; }
  if (/^## /.test(b)) { cur = { title_en: b.replace(/^## /, '').trim(), paras: [] }; sections.push(cur); continue; }
  (cur ? cur.paras : intro).push(strip(b));
  const where = cur ? cur.title_en : 'opening';
  const re = /((?:\s*\{[^}]+\})+)/g;
  let last = 0;
  let m;
  while ((m = re.exec(b)) !== null) {
    const text = b.slice(last, m.index);
    last = m.index + m[0].length;
    const ss = E.sentences(text);
    if (!ss.length) continue;
    ss.slice(0, -1).forEach((x) => unmarked.push({ where, sentence: strip(x) }));
    placements.push({ where, sentence: strip(ss[ss.length - 1]), ids: [...m[0].matchAll(MARK)].map((x) => x[1]) });
  }
  E.sentences(b.slice(last)).forEach((x) => { const t = strip(x); if (t) unmarked.push({ where, sentence: t }); });
}
for (let i = unmarked.length - 1; i >= 0; i--) if (/\[NEEDS SOURCE/.test(unmarked[i].sentence)) needs.push(unmarked.splice(i, 1)[0]);

const byId = Object.fromEntries(L.claims.map((c) => [c.id, c]));
const uses = {};
let placed = 0;
let clones = 0;
let reasoning = 0;
let gapNotes = 0;
for (const p of placements) {
  for (const id of p.ids) {
    if (id === 'reasoning') { L.notes.push({ lang: 'en', sentence: p.sentence, kind: 'reasoning', placement: LABEL }); reasoning++; continue; }
    if (id.startsWith('g-')) { L.notes.push({ lang: 'en', sentence: p.sentence, kind: 'gap', gap: id, placement: LABEL }); gapNotes++; continue; }
    const base = byId[id];
    if (!base) throw new Error(`marker {${id}} is not a claim in the ledger`);
    uses[id] = (uses[id] || 0) + 1;
    if (uses[id] === 1) {
      Object.assign(base, { sentence: p.sentence, lang: 'en', placement: LABEL });
      placed++;
    } else {
      const clone = { ...base, id: `${id}-${uses[id]}`, sentence: p.sentence, lang: 'en', placement: LABEL, placedFrom: id };
      delete clone.verdict;
      L.claims.push(clone);
      clones++;
    }
  }
}

const article = {
  title_en: title,
  ...(intro.length ? { introduction_en: intro.join('\n\n') } : {}),
  sections: sections.map((s) => ({ title_en: s.title_en, content_en: s.paras.join('\n\n') })),
};
const ay = `${JOB}/${LABEL}.yaml`;
fs.writeFileSync(ay, yaml.dump(article, { lineWidth: 110 }));
L.article = `content/docs/article-jobs/ring-of-fire/${LABEL}.yaml`;
fs.writeFileSync(LP, JSON.stringify(L, null, 2) + '\n');

console.log(`${LABEL}: ${placements.length} marked sentences → ${placed} claims placed, ${clones} extra uses cloned, ${reasoning} reasoning notes, ${gapNotes} gap notes`);
console.log(`article file: ${L.article}`);
console.log(`\nUNMARKED SENTENCES (${unmarked.length}) — no fact, reasoning or gap marker:`);
unmarked.forEach((u) => console.log(`  [${u.where}] ${u.sentence}`));
console.log(`\nNEEDS SOURCE (${needs.length}):`);
needs.forEach((u) => console.log(`  [${u.where}] ${u.sentence}`));
