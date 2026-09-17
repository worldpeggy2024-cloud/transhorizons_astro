#!/usr/bin/env node
/*
 * One-off: build questions-proposal.md for the Ring of Fire rebuild from ledger.json and
 * silences-search.json. Counts are computed; question wording, "draft also says" notes and
 * silence verdicts are proposals for Peggy, each verdict resting on the recorded search.
 */
'use strict';
const fs = require('fs');
const JOB = 'C:/Users/peggy/DevTest/transhorizons_astro/content/docs/article-jobs/ring-of-fire';
const L = JSON.parse(fs.readFileSync(`${JOB}/ledger.json`, 'utf8'));
const SEARCH = JSON.parse(fs.readFileSync(`${JOB}/silences-search.json`, 'utf8'));
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => `c${String(a + i).padStart(3, '0')}`);

const Q = [
  { id: 'q1', text: 'How long has Neskantaga waited for safe drinking water, and how fast did the Webequie road move to approval?',
    claims: range(1, 4),
    draftOnly: ['374 people / 76 households; ~$30 million spent on the plant since 2017', 'the 2019 and 2020 evacuations; the mineral-oil sheen', '"eight years from terms of reference to groundbreaking"; Premier and three ministers on site'] },
  { id: 'q2', text: 'What does the winter road provide the fly-in communities, and how is it changing?',
    claims: range(5, 6),
    draftOnly: ['ice thickness for half and full loads (66 / 94 cm); crews flooding the ice', 'the Kimesskanemenow partnership running the James Bay Winter Road', 'energy costs 5–8 times Toronto; the Wataynikaneyap line (1,800 km, 22 substations, December 2024)', 'the 2012 wind-chill warnings'] },
  { id: 'q3', text: 'What is the ground the corridor crosses, and what happens to its water, mercury and wildlife when it is disturbed?',
    claims: [...range(7, 9), ...range(144, 147)],
    draftOnly: ['Li et al. 2025: mean peat depth 184 cm, 30 billion tonnes of carbon; the century-of-emissions comparison', 'Manitoba reservoirs: fish mercury for three decades', 'Prairie water (South Saskatchewan −84%), Peyto Glacier', 'Ireland / Bord na Móna rewetting; Alberta oil sands reclamation (895 km², Gateway Hill, Rooney et al. 2012, $51.9 billion liability)', 'Grassy Narrows and the English-Wabigoon mercury', 'wolves and bears on linear features; caribou avoiding a fifth to a half of habitat; road orientation and methane', '"the study has not been done" (mercury) — see the silences below: the record contradicts it as written'] },
  { id: 'q4', text: 'How have the region\'s First Nations lived on this land, and what are they building on it now?',
    claims: range(10, 15),
    draftOnly: ['the three names of the assessment area in three languages; "the breathing lands"'] },
  { id: 'q5', text: 'What exactly is being built, by whom, to what design, and under which assessments?',
    claims: [...range(18, 28), ...range(109, 117)],
    draftOnly: ['Marten Falls road 190–230 km; the Northern Road Link "has no community of its own"', 'the province\'s "514-kilometre Ring of Fire road network"', 'maintenance aggregate 2 million m³ vs 1.3 million to build', 'Premier at the Marten Falls groundbreaking, August 2026: standing up to President Trump', '"the file had sat for eighteen years"'] },
  { id: 'q6', text: 'What is at the end of the road: the deposit, the mine, and its value?',
    claims: ['c016', 'c017', ...range(156, 159)],
    draftOnly: ['found in 2007; "nineteen years on, nothing has been mined"', 'concentrate to Sudbury smelters; mine life 11–20 years; Wyloo acquisition 2022 and a 2030 start', 'the ninety-billion-dollar chromite headlines; no ferrochrome smelter (the notes add the Sault Ste. Marie siting, unsourced)', 'the draft said Cliffs "wrote off" its position; the source says it sold its claims'] },
  { id: 'q7', text: 'Which First Nations are affected, and what have they said about the road and about how it was assessed?',
    claims: ['c029', 'c030', ...range(33, 49)],
    draftOnly: ['Neskantaga\'s June 2026 statement (quoted in the draft)', 'the river encampment since summer 2025; the Charter challenge by fourteen First Nations', '"Eleven First Nations filed" (the record shows nine and a council on the final assessment)', 'Chief Gary Quisess: "fix the community first" (quoted in the draft)', 'distances and locations: Nibinamik 80 km, Aroland 20 km from Nakina, Kashechewan 400 km; Ontario\'s 2017 pledge'] },
  { id: 'q8', text: 'How were the road assessments scoped, so that no one assessment covered the corridor?',
    claims: [...range(50, 54), ...range(62, 64), ...range(81, 87)],
    draftOnly: ['the 1985 royal commission; the 2009–2010 Far North advisory council and science panel; the Environmental Commissioner in 2012', 'the 2021 Far North Act amendments removing the 225,000 km² objective', '"no assessment ever had to consider the whole" — see the silences below: cumulative effects of the three roads were considered inside one project\'s assessment'] },
  { id: 'q9', text: 'What is the regional assessment, what has it found so far, and what power does it have?',
    claims: [...range(55, 61), ...range(65, 80)],
    draftOnly: ['the science review delivered 27 March 2026', '"Ontario did not participate" (the record shows the terms leave Ontario\'s role "TBD")'] },
  { id: 'q10', text: 'Why will the mine itself have no federal assessment?',
    claims: ['c031', 'c032', ...range(88, 98)],
    draftOnly: ['special economic zones (Premier, June 2025; the Toronto airport designation; the constitutional challenge)', 'the Building Canada Act listing (four projects)', 'the December 2025 cooperation agreement', 'De Beers Victor mine dewatering: ~350 km², water tables down up to 1 m, 4–15 cm subsidence, 2007–2019'] },
  { id: 'q11', text: 'Can a floating road cross this peat without draining it, and what does the record say about that?',
    claims: [...range(99, 108), ...range(118, 135)],
    draftOnly: ['the embankment as an "eighteen-metre wall" across sheet flow'] },
  { id: 'q12', text: 'Were alternatives to this road, other routes and other modes, compared, and on what terms?',
    claims: [...range(136, 143), 'c148', 'c149', ...range(153, 155)],
    draftOnly: ['Hudson Bay Railway washout 2017; a slurry pipeline; the 96-km Swedish ropeway 1943–1987; the Everglades causeway; hardening the winter road; a transmission line instead of diesel', 'Chiefs Bruce Achneepineskum and Lorraine Whitehead on the road (quoted in the draft)'] },
  { id: 'q13', text: 'Does an all-season road lower the cost of living in a remote community?',
    claims: range(150, 152),
    draftOnly: ['"which way the ledger runs is not currently established" — see the silences below: a final report now exists and has not been read'] },
];

// Verdicts rest on silences-search.json (the recorded search); quotes are from that text and
// enter the ledger only if the article uses them.
const SILENCES = [
  { id: 'g-corridor-modes', verdict: 'holds',
    result: [
      'The only comparison of modes (hoverbarge, heavy-lift airship, rail) is in the Webequie road\'s own alternatives section (S29), screened against that road\'s objective.',
      'The regional assessment\'s science review names the gap: "Corridor proposals still largely proponent-driven. Network-level hydrologic and predator access impacts under-assessed." (S24, p. 54).',
      'Rail for the corridor appears only in a public submission (S25).',
    ],
    notSearched: 'the Marten Falls and Northern Road Link assessment files' },
  { id: 'g-floating-validation', verdict: 'holds',
    result: [
      'No validation study appears. Two submissions state the absence: Weenusk, "no site-specific validation of these methods was undertaken" (S14); WCS Canada, "only one outdated reference to support that the \'floating roads\' are logistically feasible" (S22).',
      'A reviewer asks the proponent to "validate hydrologic models using local field data" (S9).',
    ],
    notSearched: 'engineering literature outside the assessment record' },
  { id: 'g-ontario-in-ra', verdict: 'holds',
    result: [
      'No document searched records Ontario as a participant. The terms of reference list "the province of Ontario (TBD)" (S11); Ontario said it "will not be delaying decision-making" for the regional assessment (S31).',
      'The draft\'s bold "Ontario did not participate" goes further than this: what the record shows is a role left "TBD" and a province that would not wait.',
    ],
    notSearched: 'Ontario\'s own correspondence with the Agency' },
  { id: 'g-nrl-timeline', verdict: 'holds only here',
    result: [
      'The Northern Road Link is mentioned in seven documents; none gives a schedule or decision date.',
      'Its own record was not searched, and the draft notes give a spring 2028 start without a source. Search the Northern Road Link\'s Ontario project page and federal registry file before saying no timeline exists.',
    ],
    notSearched: 'the Northern Road Link\'s own project page and registry file' },
  { id: 'g-mercury-study', verdict: 'not a silence',
    result: [
      'A reviewer\'s comment in the comment-response tables: "the results of mercury and methylmercury analyses are not presented in the main body of the Draft EA/IS and are instead buried within an appendix" (S9). The Webequie assessment contains mercury analyses, so the draft\'s "the study has not been done" is contradicted as written.',
      'Still open: whether the regional assessment\'s own mercury work has been carried out. These documents do not establish it either way.',
    ] },
  { id: 'g-cost-of-living', verdict: 'not a silence',
    result: [
      'A final report exists: Joseph, Waugh and O\'Gorman (Swift Creek Consulting), Cost-of-living in First Nations Communities in the Ring of Fire Region of Northern Ontario, 2026, posted on the regional assessment registry. Read on 2026-09-15 and added as S37, with its findings now under q13 and q2.',
      'It does not answer "does a road lower the cost of living" with a single number. It says roads can lower freight and travel costs but also bring unwanted pressures; that the "food got dearer after a road" case is Tuktoyaktuk in the Northwest Territories (lost freight subsidies), not a Ring of Fire community; and that some cost drivers "are not realistically overcome".',
    ] },
  { id: 'g-cumulative-three-roads', verdict: 'not a silence',
    result: [
      'The federal draft report assessed the road "in combination with the proposed Marten Falls Community Access Road, Northern Road Link, and Eagle\'s Nest projects" for caribou and harvesting (S8).',
      'Fort Albany disputes the scope: "The cumulative effects assessment does not include the Marten Falls Community Access Road" (S20).',
      'So the article cannot say the three roads were never considered together. It can say they were considered only as cumulative effects inside one project\'s assessment, and that this is contested.',
    ] },
  { id: 'g-processing', verdict: 'not a silence',
    result: [
      'Aroland asked that the cumulative-effects analysis cover the route to "possible receiving locations (e.g., Ferrochrome facility in Sault Ste. Marie, Sudbury Smelter, other reasonably foreseeable end points for ore or mine concentrate)"; the response: "Item will be addressed in the Final EAR/IS submission." (S9).',
      'Whether the final assessment did so has not been checked.',
    ] },
];

const UNSOURCED_QUESTIONS = [
  'Has any nearby First Nation completed its own assessment before a mine was authorised (Cat Lake and Lac Seul)? (§IX)',
  'Why did Nishnawbe Aski Nation object to the 2010 Far North Act protections? (end of §VII)',
];

// Every claim now carries its own `question` tag; that tag is the assignment.
for (const q of Q) q.claims = L.claims.filter((c) => c.question === q.id).map((c) => c.id);

// ── integrity ────────────────────────────────────────────────────────────────
const assigned = Q.flatMap((q) => q.claims);
const dupes = assigned.filter((x, i) => assigned.indexOf(x) !== i);
const missing = L.claims.map((c) => c.id).filter((id) => !assigned.includes(id));
const searchIds = new Set(SEARCH.map((s) => s.id));
const unknownSilence = SILENCES.filter((s) => !searchIds.has(s.id)).map((s) => s.id);
if (dupes.length || missing.length || unknownSilence.length) {
  console.error(`integrity error — duplicate claims: ${dupes.join(', ') || 'none'}; unassigned: ${missing.join(', ') || 'none'}; silences without a recorded search: ${unknownSilence.join(', ') || 'none'}`);
  process.exit(1);
}

const byId = Object.fromEntries(L.claims.map((c) => [c.id, c]));
const src = Object.fromEntries(L.sources.map((s) => [s.id, s]));
const status = (c) => (c.quoteCheck && c.quoteCheck.status) || 'unchecked';
const searchOf = Object.fromEntries(SEARCH.map((s) => [s.id, s]));
const VERDICT = { holds: 'Holds — nothing in what was searched', 'holds only here': 'Holds only in what was searched — the obvious place was not searched', 'not a silence': 'Not a silence — the record addresses it' };

const out = [];
out.push('# Ring of Fire — which questions should the rebuilt article answer?', '');
out.push(`Built ${new Date().toISOString().slice(0, 10)} from \`ledger.json\` (${L.claims.length} quotes from the audit, each matched against its document: ${L.claims.filter((c) => status(c) === 'exact').length} exact, the rest checked by eye where page layout splits the text) and \`silences-search.json\` (${SEARCH.length} candidate silences searched across ${SEARCH[0].searched} documents).`, '');
out.push('**How to use this.** Pick the questions the article answers, perhaps five to eight, and the silences it names. The facts under each question are already confirmed. The "draft also says" lines have no confirmed source: choosing a question does not bring them back. Each one you want becomes a document to find, for that question only. Anything you do not pick stays on file for a later piece.', '');

out.push('## 1. Questions with confirmed facts', '');
out.push('| # | Question | Confirmed facts (quotes) | Draft material without a source |', '|---|---|---|---|');
for (const q of Q) out.push(`| ${q.id} | ${q.text} | **${new Set(q.claims.map((id) => byId[id].fact)).size}** (${q.claims.length}) | ${q.draftOnly.length} |`);

const count = (v) => SILENCES.filter((s) => s.verdict === v).length;
out.push('', '## 2. Named silences — what the documents do not say, and what was searched', '');
out.push(`A silence is often the strongest thing an article can say, so these are listed apart from the questions instead of looking like questions with zero facts. But a silence is only as strong as its search, so each was searched for in all ${SEARCH[0].searched} documents gathered for this article: **${count('holds')} hold, ${count('holds only here')} holds only in what was searched, ${count('not a silence')} turned out not to be silences.**`, '');
out.push('| Silence | Verdict | Documents mentioning the terms |', '|---|---|---|');
for (const s of SILENCES) out.push(`| ${searchOf[s.id].q} | ${s.verdict} | ${searchOf[s.id].hits.length} of ${searchOf[s.id].searched} |`);
for (const v of ['holds', 'holds only here', 'not a silence']) {
  const list = SILENCES.filter((s) => s.verdict === v);
  if (!list.length) continue;
  out.push('', `### ${VERDICT[v]}`, '');
  for (const s of list) {
    const r = searchOf[s.id];
    out.push(`**${r.q}**`, '');
    s.result.forEach((line) => out.push(`- ${line}`));
    out.push(`- *Searched:* all ${r.searched} documents gathered for this article, ${r.date}; mentioned in ${r.hits.map((h) => h.id.toUpperCase()).join(', ') || 'none'}. Terms: ${r.terms.map((t) => `\`${t}\``).join(' · ')}.`);
    if (s.notSearched) out.push(`- *Not searched:* ${s.notSearched}.`);
    out.push('');
  }
}

out.push('## 3. Questions the draft raises with no confirmed facts (unsourced, not searched)', '');
UNSOURCED_QUESTIONS.forEach((t) => out.push(`- ${t}`));
out.push('', '---', '');

for (const q of Q) {
  out.push(`## ${q.id} — ${q.text}`, '');
  const seen = new Map();
  for (const id of q.claims) {
    const c = byId[id];
    if (!seen.has(c.fact)) seen.set(c.fact, []);
    seen.get(c.fact).push(c);
  }
  out.push('**Confirmed**', '');
  for (const [fact, cs] of seen) {
    const s = [...new Set(cs.map((c) => c.source))].map((id) => `${id.toUpperCase()} (${src[id] ? src[id].name : id})`).join('; ');
    const flag = cs.some((c) => status(c) !== 'exact') ? ' — matched by eye (page layout)' : '';
    out.push(`- ${fact} — ${cs.map((c) => c.id).join(', ')} · ${s}${flag}`);
  }
  if (q.draftOnly.length) {
    out.push('', '**The draft also says (no confirmed source)**', '');
    q.draftOnly.forEach((t) => out.push(`- ${t}`));
  }
  out.push('');
}
fs.writeFileSync(`${JOB}/questions-proposal.md`, out.join('\n'));
console.log(`Wrote ${JOB}/questions-proposal.md`);
console.log(`questions: ${Q.length} · silences: ${count('holds')} hold, ${count('holds only here')} holds only here, ${count('not a silence')} not silences`);
