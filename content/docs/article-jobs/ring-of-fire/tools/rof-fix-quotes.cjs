#!/usr/bin/env node
/*
 * One-off: replace the audit chat's approximate quotes with the exact span from the
 * fetched document (the chat's version is kept as `auditQuote`), fill the four lines the
 * audit gave without a quote, count the consultation lists, and record by-eye reviews
 * of matches split by a PDF page break.
 */
'use strict';
const fs = require('fs');
const JOB = 'C:/Users/peggy/DevTest/transhorizons_astro/content/docs/article-jobs/ring-of-fire';
const LP = `${JOB}/ledger.json`;
const L = JSON.parse(fs.readFileSync(LP, 'utf8'));
const raw = (id) => fs.readFileSync(`${JOB}/cache/${id}.txt`, 'utf8').replace(/\u0000/g, 'ff');
const flat = (id) => raw(id).replace(/\s+/g, ' ');
const today = new Date().toISOString().slice(0, 10);

function span(id, start, end) {
  const t = flat(id);
  const i = t.indexOf(start);
  if (i < 0) throw new Error(`${id}: start not found: ${start}`);
  const j = t.indexOf(end, i + start.length - Math.min(start.length, end.length));
  if (j < 0) throw new Error(`${id}: end not found after start: ${end}`);
  return t.slice(i, j + end.length).trim();
}

const byId = (id) => {
  const c = L.claims.find((x) => x.id === id);
  if (!c) throw new Error(`no claim ${id}`);
  return c;
};
function setQuote(id, source, quote, why) {
  const c = byId(id);
  if (c.quote && !c.auditQuote) c.auditQuote = c.quote;
  c.source = source;
  c.quote = quote;
  c.quoteFix = `${today}: ${why}`;
  delete c.quoteCheck;
  console.log(`  ${id} ← ${source}: "${quote.length > 150 ? `${quote.slice(0, 147)}…` : quote}"`);
}

console.log('Replaced with the exact text of the page:');
setQuote('c022', 's1', span('s1', 'Cornelius Wabasse', 'Date: May 3, 2018'), 'audit merged the signature block into one line with a comma and an ellipsis');
setQuote('c028', 's3', span('s3', 'Assessment type', 'Impact Assessment by the Agency'), 'label and value are separate lines on the page; audit added a colon');
setQuote('c156', 's11', span('s11', '2015 Industry March: Cliffs sells', 'to Noront'), 'Annex 1 timeline lists the year and the category above the entry; audit merged them');
setQuote('c158', 's2', span('s2', 'includes: chromite', 'titanium'), 'the page is a bulleted list; audit added commas');
setQuote('c082', 's15', span('s15', 'many impacts within the Impact Assessment Report', 'regional road and industrial network'), 'page uses curly double quotes around residual; audit used single quotes and an ellipsis');
setQuote('c141', 's29', span('s29', 'advantages of the rail options', 'movement of mine product'), 'audit added "the" that is not in the text');
setQuote('c055', 's5', span('s5', 'In January 2023, leaders and members from 15', 'First Nations from Matawa'), 'a footnote marker sits between "15" and "First Nations"');

console.log('\nLines the audit gave without a verbatim quote:');
setQuote('c048', 's31', span('s31', 'Aroland First Nation, Attawapiskat First Nation, Constance Lake First Nation, Eabametoong', 'and Mushkegowuk Council.'), 'audit listed the names without quoting');
setQuote('c057', 's5', span('s5', 'First Nation Partners who are signatory to these Terms of Reference include', '.'), 'audit said "signatory list names all four" without quoting');
setQuote('c094', 's12', span('s12', 'On December 5, 2024, the Minister of Environment delegated', 'to the President of IAAC.'), 'audit paraphrased the footnote');

// c049 — the counts are the claim, so count the lists rather than trust anyone's number.
{
  const t = raw('s31');
  const listAfter = (marker, stop) => {
    const i = t.indexOf(marker);
    if (i < 0) throw new Error(`s31: marker not found: ${marker}`);
    const rest = t.slice(i + marker.length);
    const j = rest.indexOf(stop);
    return rest.slice(0, j < 0 ? 2000 : j).split(/\n/).map((s) => s.trim()).filter((s) => s && !/^(Also|Under|Consistent)/.test(s));
  };
  const rights = listAfter('on a rights basis:', 'Also consistent');
  const interest = listAfter('on an interest basis:', 'Under the MOU');
  setQuote('c049', 's31', 'WFN consulted with the following Indigenous communities on a rights basis:', 'audit gave no quote; the figures are counts of the two lists that follow');
  const c = byId('c049');
  c.counted = { date: today, rightsBasis: rights.length, interestBasis: interest.length, total: rights.length + interest.length, rightsList: rights, interestList: interest };
  console.log(`  c049 counted: rights ${rights.length} · interest ${interest.length} · total ${rights.length + interest.length}`);
  console.log(`      rights: ${rights.join(' | ')}`);
  console.log(`      interest: ${interest.join(' | ')}`);
}

console.log('\nNear matches reviewed by eye (text is there, split by page layout):');
for (const [id, why] of [
  ['c097', 'sentence continues across a PDF page break with a running header'],
  ['c123', 'sentence continues across a PDF page break with a running header'],
  ['c106', 'sentence continues across a PDF page break with a running header'],
]) {
  byId(id).quoteReview = `${today}: verified by eye — ${why}`;
  console.log(`  ${id}: ${why}`);
}

fs.writeFileSync(LP, JSON.stringify(L, null, 2) + '\n');
console.log(`\nWrote ${LP}`);
