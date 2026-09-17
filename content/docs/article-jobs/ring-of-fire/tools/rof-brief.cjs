#!/usr/bin/env node
/*
 * Ring of Fire writer brief.
 *   node rof-brief.cjs add     — add the claims that back the corrections and silences (exact spans)
 *   node rof-brief.cjs write   — generate writer-brief.md from boundary.json + ledger.json
 * Run `article-evidence quotes ring-of-fire` between the two.
 */
'use strict';
const fs = require('fs');
const JOB = 'C:/Users/peggy/DevTest/transhorizons_astro/content/docs/article-jobs/ring-of-fire';
const COPY = 'C:/Users/peggy/DevWebSiteFiles/TransHorizons Website/Articles/Ring of Fire/ring-of-fire-writer-brief.md';
const LP = `${JOB}/ledger.json`;
const L = JSON.parse(fs.readFileSync(LP, 'utf8'));
const B = JSON.parse(fs.readFileSync(`${JOB}/boundary.json`, 'utf8'));
const flat = (id) => fs.readFileSync(`${JOB}/cache/${id}.txt`, 'utf8').replace(/\u0000/g, 'ff').replace(/\s+/g, ' ');
const byFact = (needle) => {
  const c = L.claims.find((x) => x.fact.includes(needle) || (x.quote || '').includes(needle));
  if (!c) throw new Error(`no claim matching: ${needle}`);
  return c.id;
};

function add() {
  const ROWS = [
    ['q12', 's24', 'The regional assessment’s science review: corridor proposals still proponent-driven; network-level impacts under-assessed', 'Corridor proposals still largely proponent-driven.', 'predator access impacts under-assessed.'],
    ['q3', 's9', 'A reviewer: mercury and methylmercury results exist but sit in an appendix of the Webequie assessment', 'the results of mercury and methylmercury analyses are not presented in the main body', 'buried within an appendix.'],
    ['q8', 's8', 'The federal draft report assessed the road in combination with the other two roads and the mine (caribou, harvesting)', 'IAAC is of the view that the project, in combination with the proposed Marten Falls Community Access Road', 'alter movement patterns and range areas within the project RSA.'],
    ['q8', 's20', 'Fort Albany: the cumulative effects assessment does not include the Marten Falls road', 'The cumulative effects assessment does not include the Marten Falls Community Access Road', 'assessed at a project scale.'],
    ['q6', 's9', 'Aroland asked that cumulative effects cover the route to the smelters; the proponent said the final assessment would address it', 'a full and complete analysis of the contribution to cumulative effects of the WSR must include', 'Item will be addressed in the Final EAR/IS submission.'],
  ];
  let next = Math.max(...L.claims.map((c) => Number(c.id.slice(1)))) + 1;
  let added = 0;
  for (const [question, source, fact, start, end] of ROWS) {
    if (L.claims.some((c) => c.fact === fact)) continue;
    const t = flat(source);
    const i = t.indexOf(start);
    if (i < 0) throw new Error(`${source}: start not found: ${start}`);
    const j = t.indexOf(end, i);
    if (j < 0 || j - i > 1500) throw new Error(`${source}: end not found near start: ${end}`);
    L.claims.push({ id: `c${String(next++).padStart(3, '0')}`, question, section: 'gathered 2026-09-15', fact, source, quote: t.slice(i, j + end.length) });
    added++;
  }
  fs.writeFileSync(LP, JSON.stringify(L, null, 2) + '\n');
  console.log(`added ${added} claims; total ${L.claims.length}`);
}

function write() {
  const src = Object.fromEntries(L.sources.map((s) => [s.id, s]));
  const WEIGHT = {
    main: 'MAIN — most of the article',
    important: 'IMPORTANT — a paragraph or two each',
    brief: 'BRIEF — a few sentences each, only what the main questions need',
    pointer: 'MENTION — one to three sentences, then say it deserves its own article',
  };
  const NOTE = {
    q2: 'Use the winter road as the BASELINE for judging whether an all-season road is better: how long it is open, how that is changing, what it carries, and what people pay when it fails. Leave out operational detail (ice thickness, how crossings are built): that is another article.',
    q13: 'This source does not give a yes or no. Let the reader see both directions it documents.',
    q11: 'This is where the article\'s central physical question lives. Attribute each uncertainty to whoever stated it; do not present a party\'s characterisation as the regulator\'s finding.',
    q12: 'Mention only that the comparison was limited to one segment; the full comparison of routes and modes is a future article.',
    q6: 'Mention only what a reader needs to know is at the end of the road; mining is covered in other articles.',
  };
  const order = B.questions.map((q) => q.id);
  const out = [];
  const operator = (lines) => { out.push('> **Operator note — NOT part of the prompt.** ' + lines.join(' '), ''); };

  out.push('# Writer brief — Ring of Fire article (rebuild)', '');
  operator([
    `Generated ${new Date().toISOString().slice(0, 10)} from ledger.json (${L.claims.length} quotes, each matched against its document) and boundary.json (Peggy's questions and tiers).`,
    'HOW TO USE: open a NEW chat with memory OFF, outside any project. Paste everything below the line and attach NOTHING — no style sample (informative articles have no style; the register spec is included below), never draft-1 or any exploration chat.',
    'Save the reply as ring-of-fire-draft-2.md in the Ring of Fire folder and tell Claude Code; it attaches each {c…} marker to its sentence, runs the check, and prepares the verifier prompt.',
    'Length: about 3,000 words is an assumption (a 12-minute read like the other essays) — change it below if you want.',
  ]);
  out.push('---', '');

  out.push('You are writing an English-language informative article for TransHorizons, a site of geopolitical and resource analysis. It has no style: it carries information. Follow the REGISTER section at the end of this brief as strictly as the facts rule.', '');
  out.push('## The subject', '');
  out.push('Ontario is building all-season roads towards the Ring of Fire mineral region, across the peatlands of the Far North, where most First Nations communities have no year-round road. The article asks what such a road means for the people who live there and for the ground it crosses, and how the decision to build it was assessed.', '');

  out.push('## The one rule that matters', '');
  out.push('- Every factual statement — every figure, date, count, name of an organisation\'s position, "first", "only", "no", "none", every quotation — must come from the FACTS listed below, and must carry that fact\'s marker in curly braces right after the sentence, e.g. `…a sentence stating a listed fact. {cNNN}`, where cNNN is the marker of the fact you actually used. A sentence may carry several markers.');
  out.push('- If a sentence needs a fact that is not listed, write `[NEEDS SOURCE: what is missing]` in its place. Never fill it from what you know, however sure you are.');
  out.push('- Your own reasoning, connections and conclusions are welcome. Mark such a sentence `{reasoning}` so it is recognisable as analysis, not a finding.');
  out.push('- Quote a named person or organisation only with words that appear inside a quote below.');
  out.push('- Say what a source says at the strength it says it: an estimate stays an estimate, a projection keeps its horizon, a party\'s claim stays attributed to that party.');
  out.push('- Where the SILENCES section says the record is silent, you may say so, scoped exactly as written there, with its marker.', '');

  out.push('## Shape and length', '');
  out.push('About 3,000 words. Give room in proportion to the tiers below, in roughly this order. Section headings describe what the section contains; never use a question as a heading (the questions below are for you, not for the reader). A short title and a one-sentence subtitle, both descriptive. No footnotes, no reference list (sources are attached separately from the markers).', '');
  for (const w of ['main', 'important', 'brief', 'pointer']) {
    const qs = B.questions.filter((q) => q.weight === w);
    if (qs.length) out.push(`- **${WEIGHT[w]}:** ${qs.map((q) => q.text).join(' · ')}`);
  }
  out.push('');

  out.push('## Corrections — the record contradicts these common claims', '');
  const CORR = [
    [`A community whose food got dearer after a road opened is Tuktoyaktuk in the Northwest Territories, after it lost freight subsidies — not a Ring of Fire community. Do not present it as one.`, [byFact('Tuktoyaktuk (NWT)'), byFact('food subsidies after a road')]],
    ['Do not say mercury has not been studied: the Webequie assessment contains mercury and methylmercury analyses, criticised for sitting in an appendix. Whether the regional assessment\'s own mercury work is done is not established.', [byFact('mercury and methylmercury results exist')]],
    ['Do not say the three roads were never considered together: the federal draft report considered the road in combination with the other two and the mine, for some effects, inside one project\'s assessment — and Fort Albany disputes that scope. The point to make is that no assessment decided the corridor as a whole.', [byFact('in combination with the other two roads'), byFact('does not include the Marten Falls road')]],
    ['Ontario\'s place in the regional assessment is recorded as "TBD", and Ontario said it would not wait for it. Do not write that Ontario refused to participate.', [byFact('province of Ontario (TBD)'), byFact('Ontario would not wait')]],
    ['Nine First Nations and one council commented on Webequie\'s final assessment — not eleven.', [byFact('Nine First Nations and a council')]],
    ['Cliffs sold its chromite claims to Noront in 2015; it did not "write off" its position.', [byFact('Cliffs')]],
  ];
  CORR.forEach(([text, ids]) => out.push(`- ${text} {${ids.join('} {')}}`));
  out.push('');

  out.push('## Silences — what the record does not contain (each was searched)', '');
  const SIL = [
    ['No assessment compared routes or transport modes for the corridor as a whole; the only comparison of modes is within the Webequie road\'s own alternatives, and the regional assessment\'s science review calls network-level impacts under-assessed. Scope: the Webequie road\'s assessment files and the regional assessment documents.', 'g-corridor-modes', [byFact('network-level impacts under-assessed'), byFact('Three alternative modes evaluated')]],
    ['No study in the record validates a floating road with equalisation culverts in peatland like this; submitters state that none was undertaken, and Ontario\'s natural resources ministry deferred its questions on groundwater movement under a floating road to detailed design. Scope: the assessment record, including the ministry\'s comment-response tables.', 'g-floating-validation', [byFact('Design standards had no site-specific validation'), byFact('no evidence base for the design'), byFact('groundwater movement in peat under a floating road'), byFact('reasonable to expect even with floating road designs')]],
    ['No document in the record shows Ontario taking part in the regional assessment; its role is listed as "TBD". Scope: the assessment record.', 'g-ontario-in-ra', [byFact('province of Ontario (TBD)')]],
  ];
  SIL.forEach(([text, gid, ids]) => out.push(`- ${text} {${gid}} (supporting facts: {${ids.join('} {')}})`));
  out.push('');

  out.push('## Facts, by question', '');
  out.push('Each line: `{marker}` short label — "verbatim quote" (source). Use the quote to judge exactly what the source supports; you do not have to quote it.', '');
  for (const id of order) {
    const q = B.questions.find((x) => x.id === id);
    const claims = L.claims.filter((c) => c.question === id && c.quote);
    out.push(`### ${q.text}`, '', `*Tier: ${WEIGHT[q.weight]}.*${NOTE[id] ? ` ${NOTE[id]}` : ''}`, '');
    for (const c of claims) {
      const s = src[c.source] || { name: c.source };
      const loc = c.locator ? `, ${c.locator}` : '';
      const quote = c.quote.length > 600 ? `${c.quote.slice(0, 597)}…` : c.quote;
      out.push(`- {${c.id}} ${c.fact} — "${quote}" (${s.name}${loc})`);
    }
    out.push('');
  }

  // The informative-register spec, verbatim, as its own section (headings demoted one level).
  const SPEC = fs.readFileSync('C:/Users/peggy/DevTest/transhorizons_astro/content/docs/informative-register-spec.md', 'utf8')
    .split(/\r?\n/)
    .filter((line) => !/^# SPEC/.test(line) && !/^Attach to every article prompt/.test(line))
    .map((line) => line.replace(/^## /, '### '));
  out.push('## Register', '');
  out.push('The rules below govern how the article is written. Where they say a claim needs "a source", that means a {marker} from the facts above; "marked as unsourced" means [NEEDS SOURCE: …].', '');
  out.push(...SPEC, '');

  out.push('## Before you finish', '');
  out.push('- Every sentence with a fact has its marker; every analytical sentence says {reasoning}; every missing fact says [NEEDS SOURCE: …].');
  out.push('- Nothing in the article comes from outside this brief.');
  out.push('- Run the register PRE-DELIVERY CHECK, then check the three KNOWN LEAKS last.');
  out.push('- Return only the article.');

  fs.writeFileSync(`${JOB}/writer-brief.md`, out.join('\n'));
  fs.writeFileSync(COPY, out.join('\n'));
  const words = out.join(' ').split(/\s+/).length;
  console.log(`Wrote ${JOB}/writer-brief.md (${words} words) and a copy at ${COPY}`);
  console.log(`questions: ${order.length} · facts included: ${L.claims.filter((c) => c.quote && order.includes(c.question)).length}`);
}

const cmd = process.argv[2];
if (cmd === 'add') add();
else if (cmd === 'write') write();
else console.log('usage: add | write');
