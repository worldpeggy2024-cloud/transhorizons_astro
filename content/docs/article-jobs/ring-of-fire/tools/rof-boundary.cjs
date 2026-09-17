#!/usr/bin/env node
/*
 * One-off: write ring-of-fire/boundary.json from Peggy's ordering and tiers (2026-09-15),
 * the claim→question assignment used in questions-proposal.md, and the silences that held.
 */
'use strict';
const fs = require('fs');
const JOB = 'C:/Users/peggy/DevTest/transhorizons_astro/content/docs/article-jobs/ring-of-fire';
const L = JSON.parse(fs.readFileSync(`${JOB}/ledger.json`, 'utf8'));
const SEARCH = JSON.parse(fs.readFileSync(`${JOB}/silences-search.json`, 'utf8'));
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => `c${String(a + i).padStart(3, '0')}`);

// Peggy's order and tiers. main = most of the room; important = a paragraph or two;
// brief = a few sentences; pointer = mention for logic, detail in another article.
const QUESTIONS = [
  ['q2', 'main', 'What does the winter road provide the fly-in communities, and how is it changing?', range(5, 6)],
  ['q13', 'main', 'Does an all-season road lower the cost of living in a remote community?', range(150, 152)],
  ['q4', 'main', 'How have the region\'s First Nations lived on this land, and what are they building on it now?', range(10, 15)],
  ['q3', 'main', 'What is the ground the corridor crosses, and what happens to its water, mercury and wildlife when it is disturbed?', [...range(7, 9), ...range(144, 147)]],
  ['q11', 'main', 'Can a floating road cross this peat without draining it, and what does the record say about that?', [...range(99, 108), ...range(118, 135)]],
  ['q7', 'important', 'Which First Nations are affected, and what have they said about the road and about how it was assessed?', ['c029', 'c030', ...range(33, 49)]],
  ['q8', 'important', 'How were the road assessments scoped, so that no one assessment covered the corridor?', [...range(50, 54), ...range(62, 64), ...range(81, 87)]],
  ['q9', 'important', 'What is the regional assessment, what has it found so far, and what power does it have?', [...range(55, 61), ...range(65, 80)]],
  ['q1', 'brief', 'How long has Neskantaga waited for safe drinking water, and how fast did the Webequie road move to approval?', range(1, 4)],
  ['q10', 'brief', 'Why will the mine itself have no federal assessment?', ['c031', 'c032', ...range(88, 98)]],
  ['q5', 'brief', 'What exactly is being built, by whom, to what design, and under which assessments?', [...range(18, 28), ...range(109, 117)]],
  ['q12', 'pointer', 'Were alternatives to this road, other routes and other modes, compared, and on what terms?', [...range(136, 143), 'c148', 'c149', ...range(153, 155)]],
  ['q6', 'pointer', 'What is at the end of the road: the deposit, the mine, and its value?', ['c016', 'c017', ...range(156, 159)]],
];

// The three silences that held, attached to the question they belong to (for the writer brief).
const GAPS = ['g-floating-validation', 'g-ontario-in-ra', 'g-corridor-modes'];

// Every claim now carries its own `question` tag (added when gathered); fall back to the ranges.
const claimToQ = {};
for (const [id, , , claims] of QUESTIONS) claims.forEach((c) => { claimToQ[c] = id; });
for (const c of L.claims) if (c.question) claimToQ[c.id] = c.question;
const unassigned = L.claims.map((c) => c.id).filter((c) => !claimToQ[c]);
if (unassigned.length) { console.error(`unassigned claims: ${unassigned.join(', ')}`); process.exit(1); }

const answers = {};
for (const c of L.claims) (answers[c.source] ||= new Set()).add(claimToQ[c.id]);
const order = QUESTIONS.map(([id]) => id);
const documents = L.sources
  .filter((s) => s.url && answers[s.id])
  .map((s) => ({ id: s.id, url: s.url, answers: order.filter((q) => answers[s.id].has(q)) }));

const gaps = GAPS.map((gid) => {
  const r = SEARCH.find((s) => s.id === gid);
  return { id: gid, question: r.q, searched: [{ where: 'all documents gathered for this article (the ledger sources)', date: r.date }] };
});

const boundary = {
  topic: 'Ring of Fire corridor',
  questions: QUESTIONS.map(([id, weight, text]) => ({ id, text, weight })),
  documents,
  gaps,
};
fs.writeFileSync(`${JOB}/boundary.json`, JSON.stringify(boundary, null, 2) + '\n');
console.log(`Wrote boundary.json — ${boundary.questions.length} questions, ${documents.length} linked documents (${L.sources.length - documents.length} sources have no public link and stay in the ledger only), ${gaps.length} gaps`);
for (const [id, weight] of QUESTIONS) console.log(`  ${weight.padEnd(9)} ${id}`);
