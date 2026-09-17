#!/usr/bin/env node
/*
 * Draft-3 verdicts triage, lists C and D (+ the quotes list A/E wording needs): extend short quotes to the
 * full sentence in the fetched document, so the quote carries the subject of the fact.
 *   node rof-extend-quotes.cjs          dry run: prints every new quote
 *   node rof-extend-quotes.cjs --write  writes ledger.json (old quote kept as `prevQuote`)
 * Segments are cut from the cached text (never retyped): [start, end] span, a literal, or sent(literal)
 * = the whole sentence containing it. Segments are joined with " […] " (findQuote checks each one; " … " after a full stop fuses into "...." and breaks the split).
 * A segment may not cross a PDF page marker: split it into two segments instead.
 */
'use strict';
const fs = require('fs');
const JOB = 'C:/Users/peggy/DevTest/transhorizons_astro/content/docs/article-jobs/ring-of-fire';
const LP = `${JOB}/ledger.json`;
const WRITE = process.argv.includes('--write');
const L = JSON.parse(fs.readFileSync(LP, 'utf8'));
const today = new Date().toISOString().slice(0, 10);

const cache = new Map();
function text(id) {
  if (!cache.has(id)) {
    const t = fs.readFileSync(`${JOB}/cache/${id}.txt`, 'utf8')
      .split('\u0000').join('ff')
      .replace(/[\uFB00-\uFB06]/g, (c) => c.normalize('NFKC'))
      .replace(/\s+/g, ' ');
    // search copy: same length, curly quotes straightened
    cache.set(id, { t, s: t.replace(/[‘’]/g, "'").replace(/[“”]/g, '"') });
  }
  return cache.get(id);
}
const key = (x) => x.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');
function at(id, lit, from = 0) {
  const i = text(id).s.indexOf(key(lit), from);
  if (i < 0) throw new Error(`${id}: not found: ${lit}`);
  return i;
}
const span = (start, end, endAfter) => ({ kind: 'span', start, end, endAfter });
const lit = (s) => ({ kind: 'lit', s });
const sent = (s) => ({ kind: 'sent', s });

function cut(id, seg) {
  const { t } = text(id);
  let out;
  if (typeof seg === 'string' || seg.kind === 'lit') {
    const s = typeof seg === 'string' ? seg : seg.s;
    const i = at(id, s);
    out = t.slice(i, i + s.length);
  } else if (seg.kind === 'span') {
    const i = at(id, seg.start);
    const from = seg.endAfter ? at(id, seg.endAfter, i) : i + seg.start.length - Math.min(seg.start.length, seg.end.length);
    const j = at(id, seg.end, from);
    out = t.slice(i, j + seg.end.length);
  } else {
    const i = at(id, seg.s);
    const END = /[.?!](?:["”’)])?(?= [A-Z0-9•“"(\[]|$)/g;
    let b = 0;
    const back = t.slice(Math.max(0, i - 3000), i);
    let m;
    const re = new RegExp(END.source, 'g');
    while ((m = re.exec(back)) !== null) b = m.index + m[0].length;
    const start = Math.max(0, i - 3000) + b;
    re.lastIndex = i + seg.s.length;
    const fwd = re.exec(t);
    out = t.slice(start, fwd ? fwd.index + fwd[0].length : t.length);
    out = out.replace(/^\s*(?:[•⚫]\s*)?/, '');
  }
  out = out.trim();
  if (/\[\[page/.test(out)) throw new Error(`${id}: segment crosses a page marker: ${out.slice(0, 120)}…`);
  return out;
}

// id → { source?, segs, why }
const X = {
  c001: { segs: [lit('Submission date: January 30, 2026'), span('Webequie First Nation submitted its environmental assessment for the Webequie Supply Road', 'January 30, 2026')], why: 'name what was submitted' },
  c004: { segs: [sent('longest-running drinking water advisory in Canada')], why: 'name Neskantaga' },
  c005: { segs: [span('Alternatives to carrying out the project considered by the proponent included', 'open from around January to mid-March.')], why: 'name the winter road' },
  c007: { segs: [span('The Hudson Bay Lowland is the globe', 'contain as much water as Lake Erie.'), lit('Far North Science Advisory Panel (2010)')], why: 'name the wetlands and the panel' },
  c008: { segs: [span('examining priorities for studies and workshops related to:', 'in water and fish, including learnings from nearby mines.')], why: 'show it is a study priority' },
  c011: { segs: [span('There are a lot of stories about people trying to make a living in the muskeg', 'when we moved into the reserve.'), lit('RAWG member from partnered First Nation')], why: 'triage A: quote the participant directly' },
  c013: { segs: [sent('greenhouse projects and food distribution systems')], why: 'show who is doing it (and that they are exploring)' },
  c016: { segs: [lit('construct, operate, decommission and abandon a multi-metal underground mine'), lit('The project will produce approximately 3,000 tonnes of ore per day')], why: 'triage E: "underground" is on the registry page' },
  c019: { segs: [span('In partnership with Indigenous communities, we', '(completed November 2024)')], why: 'show the whole list' },
  c021: { segs: [span('Whereas section 3.0.1 of the Environmental Assessment Act states:', 'to the enterprise, activity, proposal, plan or program.')], why: 'full provision' },
  c023: { segs: [span('Whereas the Proponent has requested that the Environmental Assessment Act apply to the Undertaking', 'applies to the Undertaking.')], why: 'show the agreement itself' },
  c031: { segs: [span('On October 29, 2025, the Minister', '(the requester).')], why: 'show what was received' },
  c033: { segs: [lit('a request to designate the project from Neskantaga First Nation (the requester)'), lit('The requester expressed concerns that the project will result in adverse effects to fish and fish habitat, including:'), span('adverse effects to the Muketei River and ultimately the Attawaspiskat River', 'effluents and sediments;'), lit('Given the project’s location in the'), lit('Muketei River watershed, which is highly sensitive to water level fluctuations')], why: 'show whose concern and the watershed (draft wording "drains to" was not in the source)' },
  c036: { segs: [lit('Nibinamik has serious concerns with Ontario’s and Canada’s'), span('efforts to expedite the assessment and construction of the WSR', 'Aboriginal and treaty rights and interests;')], why: 'finish the phrase across the page break' },
  c042: { segs: [lit('Constance Lake First Nation (CLFN)'), span('CLFN remains broadly supportive of WFN’s desire to develop the WSR', 'have not been addressed by the Proponent.')], why: 'triage E: quote the disagreement with the draft conditions' },
  c044: { segs: [span('We have received the comments submitted by Attawapiskat First Nation', 'in supplement to those in this letter.')], why: 'name Attawapiskat' },
  c046: { segs: [lit('The short comment period overlapped with our spring goose hunt.')], why: 'name the comment period' },
  c048: { segs: [span('Nine Indigenous communities and a Indigenous Council submitted comments on the final EA', 'and Mushkegowuk Council.')], why: 'show they commented on the final EA' },
  c049: { segs: [span('WFN consulted with the following Indigenous communities on a rights basis:', 'North Caribou Lake First Nation')], why: 'triage E: show the verifier both lists' },
  c051: { segs: [span('1.2 Consideration of other cumulative effects assessments', 'in respect of the proposed Northern Road Link.')], why: 'heading + requirement' },
  c052: { segs: [span('1.3 Consideration of Regional Assessment', 'which WFN considers relevant.')], why: 'heading + requirement' },
  c053: { segs: [span('If information described in this section is not available at the time WFN is prepared to submit its final EA to the Ministry', '1.3 Consideration of Regional Assessment'), span('If information described in this section is not available at the time WFN is prepared to submit its final EA to MECP', '1.4 Cumulative effects consultation report')], why: 'both instances, with the section that follows each' },
  c055: { segs: [span('In January 2023, leaders and members from 15', '.', 'to begin a co-led process')], why: 'the agreement to co-lead' },
  c059: { segs: [lit('Guided by the Terms of Reference (finalized in January 2025), the Regional Assessment process will serve to achieve several objectives')], why: 'name the terms of reference' },
  c063: { segs: [span('The Impact Assessment Agency of Canada has confirmed with Ontario', 'nor create any obligations on Ontario.')], why: 'show the Agency confirming' },
  c064: { segs: [lit('However, the notice of approval also stated that if the information is not available when WFN submits its final EA to the ministry, a delay of the submission of the final EA is not required.'), lit('The final EA for the WSR was submitted and the regional assessment information is not currently available.')], why: 'triage A: the review\'s own context' },
  c065: { segs: [sent('need to be addressed urgently, before any additional development can be considered')], why: 'name the gaps (healthcare, especially mental health)' },
  c066: { segs: [sent('started immediately, and before any development occurs')], why: 'name baseline monitoring' },
  c070: { segs: [lit('The recent federal decision to decline to designate the Eagle’s Nest Mine'), sent('This decision establishes a precedent that undermines the Regional Assessment before it is complete')], why: 'show which decision' },
  c071: { source: 's11', segs: [sent('The Working Group will complete its mandate and submit its final Report')], why: 'the 30 months end with the final report (terms of reference, not the interim report)' },
  c074: { segs: [span('For clarity, the impact assessments of the proposed road projects', 'separately from the regional assessment timeline.')], why: 'name the project assessments' },
  c085: { segs: [span('one primary concern is the treatment of the WSR', 'as a single infrastructure corridor.')], why: 'name the three roads' },
  c088: { segs: [sent('entered into a voluntary agreement in September 2011')], why: 'name Noront and the provincial EA' },
  c090: { segs: [lit('the provincial requirements for a comprehensive environmental assessment for the project were removed with the Royal Assent of the Protect Ontario by Unleashing our Economy Act, 2025'), lit('The voluntary agreement has been terminated and the Terms of Reference approval revoked.')], why: 'name the legislation' },
  c091: { segs: [sent('effective June 5, 2025')], why: 'say what took effect' },
  c095: { segs: [lit('On June 20, 2024, the amended IAA came into'), span('force to respond to the SCC decision by focusing decision-making', 'on areas of clear federal jurisdiction.')], why: 'name the amendments and the SCC decision' },
  c096: { segs: [span('On October 13, 2023, the Supreme Court of Canada', 'unconstitutional in part.')], why: 'show it was a decision' },
  c098: { segs: [span('The Impact Assessment Agency of Canada (IAAC) prepared this report for consideration by the President', 'pursuant to section 9 of the Impact Assessment Act (the IAA).'), span('IAAC considered the factors in subsection 9(2) of the IAA and is of the view that there are means other than a federal impact assessment', 'that may be caused by the carrying out of the project')], why: 'triage A: full sentence; the ground is IAAC\'s view in the report prepared for the President' },
  c100: { segs: [span('The eastern half of the WSR is approximately 56 km in length', 'based on existing land survey data.')], why: 'name the eastern half and its terrain' },
  c102: { segs: [sent('is typically 1.2 m in height')], why: 'name what is 1.2 m high' },
  c104: { segs: [span('Preliminary estimates suggest that the use of geosynthetics', 'without a geosynthetic layer.')], why: 'attach the conditions to the figures' },
  c106: { segs: [lit('The proposed design will also support continuous movement of groundwater which will ensure that the hydrology'), span('characteristics of the peatlands continues to function through the use of a permeable layer of rock', 'permit groundwater flow to continue.')], why: 'name the permeable layer (split at the page break)' },
  c110: { segs: [span('the volume of aggregate and bedrock aggregate expected to be feasible to extract at ARA-2', '1,276,375 m3.'), sent('the total surface area proposed for development at ARA-2')], why: 'show it is an aggregate area' },
  c111: { segs: [lit('Aggregate Source Area – ARA-4'), sent('the total surface area proposed for development at ARA-4')], why: 'show it is an aggregate area' },
  c112: { segs: [span('The Proponent outlines estimated sources and needs for aggregate material', 'through the life of the Project.')], why: 'show it is aggregate' },
  c114: { segs: [lit('The construction phase is anticipated to take approximately 5 to 6 years to complete.')], why: 'the construction-phase sentence itself' },
  c115: { segs: [span('All equipment and materials will be transported to the construction site', 'to the airport in Webequie.')], why: 'equipment and materials' },
  c117: { segs: [sent('no more than 500 vehicles using the road per day')], why: 'triage A: shows the draft report attributing it to the proponent' },
  c120: { segs: [span('The Draft IA Report indicates that infrastructure integrity', 'no site-specific validation of these methods was undertaken.')], why: 'name "these methods"' },
  c121: { segs: [span('Included in WFN’s initial comments was the lack of a hydrology study', 'flow patterns and water contamination.')], why: 'show Weenusk raised it' },
  c125: { segs: [span('Access road construction over peatlands disrupts surface and subsurface water', 'on the downstream side of the road.')], why: 'triage A: the general mechanism, with its subject' },
  c128: { segs: [span('In Table 7-5 of Appendix I, the Proponent notes', 'road" design.')], why: 'show the proponent assigned it' },
  c129: { segs: [span('There is additional uncertainty regarding the long-term viability', 'over time.')], why: 'show what the traffic bears on' },
  c130: { segs: [span('could cause groundwater impoundment or periodic surface flooding.', 'into groundwater or surface water.')], why: 'link the anoxic conditions to the flooding' },
  c131: { segs: [sent('could cause groundwater impoundment or periodic surface flooding')], why: 'give the subject' },
  c132: { segs: [sent('demonstrates the project is unlikely to generate or transport methylmercury')], why: 'show what continues until then (the recommendation)' },
  c135: { segs: [span('Given the global importance of the peatlands in the Hudson Bay Lowland', 'have they been tested in peatlands?')], why: 'name floating roads and culverts' },
  c139: { segs: [lit('The preliminary estimated capital cost for construction of the WSR is approximately $700 million dollars (+/- 40%)')], why: 'give the subject' },
  c144: { segs: [sent('estimated at 745 based on winter distribution surveys')], why: 'name the Missisa population (a minimum)' },
  c146: { segs: [sent('deemed to be in excess of 100 years by some First Nation Elders')], why: 'name habitat recovery' },
  c148: { segs: [sent('the EA was focused to exclude a detailed assessment of')], why: 'name the approved ToR' },
  c151: { segs: [span('The RAWG has commissioned a study', 'Kahwanna Bay Yak.')], why: 'the study it commissioned' },
  c152: { source: 's37', segs: [span('This report and related materials were prepared for the RAWG', 'analysis and recommendations.')], why: 'the report says it was prepared for the RAWG (the registry title did not show that)' },
  c174: { segs: [sent('can only be travelled for the entire distance during the coldest winter months')], why: 'name the trail' },
  c170: { segs: [sent('Last winter our Chiefs were forced to declare a state of emergency')], why: 'triage A: the quote was cut mid-word' },
  c187: { segs: [span('the Inuvik-to-Tuktoyaktuk Highway, a 137 km', 'replaced a winter-only ice road'), lit('The NWT did note that the highway is estimated to save $560,000 per year in winter road construction and maintenance costs.')], why: 'place the highway in the NWT' },
  c190: { segs: [lit('A Northern Policy Institute study found gasoline to be about 148% of the price in 2022 in Moosonee compared to Toronto.'), span('Table 13. Road access for First Nations communities in the Ring of Fire region', 'Weenusk / Peawanuck No N/a')], why: 'triage E: the list of the 15 communities (Moose Cree / Moose Factory, not Moosonee)' },
  c193: { segs: [span('Table 18. Revised Northern Food Basket (RNFB) for remote communities', '% change RNFB 2022-2025'), lit('Webequie $545 $552 $556 $564 $592 $619 $694 +27.3%')], why: 'table title and headers' },
  c196: { segs: [span('Cost of Airfare One- way1 Nibinamik / Summer Beaver', 'Average: 1.9 hours $607'), span('Note: 1. Airfare costs found online February 2026', 'may not always be available.')], why: 'one-way header, rows and note' },
  c206: { segs: [lit('The Musselwhite Mine in northwestern Ontario, in production since 2007'), lit('The mine is road-accessible by an all-season road to and from Pickle Lake'), lit('a number of cost-of-living factors remain challenging since Musselwhite opened.'), lit('Analysts have concluded that food costs and housing have continued to be affected by air freight dependency, short winter road seasons, retailer monopolies; NNC food subsidies have not been found to be effective.')], why: 'name Musselwhite and its road' },
  c207: { segs: [lit('The cost of store-bought food in remote NWT communities became high during the diamond mining period'), lit('However, the more consequential effect on food costs is the disruption to the traditional food economy, which forces greater household dependence on expensive imported food.')], why: 'name the NWT diamond mines' },
  c216: { segs: [lit('Ministry of Natural Resources (MNR) MNR: Regional Operations Division - Northwest Region'), span('MNR 28. Topic: Peatland Impacts, Mitigation and Monitoring', 'not fully supported by the information provided.')], why: 'name the ministry' },
  c221: { segs: [span('To ensure MNR’s interests are incorporated at the detailed design stage', 'Groundwater movement in peat under a floating road')], why: 'triage A: the detailed design stage' },
  c222: { segs: [lit('MECP: Environmental Assessment Branch 4. Topic: Consideration of cumulative effects assessment in the MFCAR draft EA'), span('the Project Team has considered the analysis and findings', 'dated February 2025.”'), lit('However, it is not clear from the rest of the cumulative effects assessment chapter (section 21) how this was done.')], why: 'name the branch and the Marten Falls reference' },
  c226: { segs: [lit('Aroland First Nation 2. Not addressed.'), lit('AFN’s position remains that no approvals should be granted for resource roads until, at minimum, the Ring of Fire Regional Assessment is completed.')], why: 'the Aroland row header' },
  c227: { segs: [lit('Aroland First Nation 2. Not addressed.'), span('We have completed a cumulative effects assessment on the socio-economic environment', 'will be used to inform the Project effects assessment.')], why: 'triage C: the p. 89 reply to Aroland, not the p. 70 one' },
  c229: { segs: [span('The Friends submit that this approach does not sufficiently consider', 'legacy environmental contamination.'), lit('Recommendation No. 15: The Impact Statement must be updated to require a study of mercury on human health and the environment, which takes into account the proposed project and legacy contamination.')], why: 'name the submitter' },
  c232: { segs: [sent('it is not economically viable nor environmentally desirable to excavate the peat'), lit('By maintaining the surface layer of vegetation, and fact that no excavation is planned')], why: 'place it in the peatland' },
  c243: { segs: [span('Webequie First Nation has been given approval under the Environmental Assessment Act', 'future mineral development projects.'), lit('This approval is for the portion of the 107-kilometre long Webequie Supply Road that is not located on the reserve of Webequie First Nation.')], why: 'name the EA Act approval' },
  c244: { segs: [lit('ECCC Response to Targeted Questions for Federal Analysis'), lit('To support IAAC’s review of the draft Impact Statements and preparation of the draft Impact Assessment Report, please provide responses to the targeted questions in the table.'), lit('When responding to these questions, please consider not only Marten Falls Community Access Road Project (the Project), but also Northern Road Link Project and Webequie Supply Road Project.'), lit('The Marten Falls Community Access Road Project (MFCAR) draft Impact Statement (dIS)')], why: 'show the questions were on the Marten Falls draft IS' },
};

// New claim: the provincial assessment was voluntary (replaces the unsourced "not required to be assessed").
const NEW = [
  { id: 'c247', question: 'q5', section: 'gathered 2026-09-16', fact: 'The proponent entered a voluntary agreement to subject the road to a comprehensive EA under Ontario\'s Environmental Assessment Act', source: 's8', locator: 'p. 19', segs: [sent('the proponent entered into a voluntary agreement with the Ontario Ministry of the Environment')] },
];

let n = 0;
let errs = 0;
for (const [id, spec] of Object.entries(X)) {
  const c = L.claims.find((x) => x.id === id);
  if (!c) throw new Error(`no claim ${id}`);
  const source = spec.source || c.source;
  let quote;
  try { quote = spec.segs.map((s) => cut(source, s)).join(' […] '); } catch (e) { console.log(`
!! ${id}: ${e.message}`); errs++; continue; }
  console.log(`\n${id} [${source}${source !== c.source ? ` ← ${c.source}` : ''}] ${spec.why}\n  OLD: ${c.quote}\n  NEW: ${quote}`);
  if (WRITE) {
    if (c.quote !== quote) {
      if (!(c.quoteFix || '').startsWith(today)) c.prevQuote = c.quote;
      c.quote = quote;
      c.source = source;
      c.quoteFix = `${today}: extended to the full sentence (draft-3 verdicts triage) — ${spec.why}`;
      delete c.quoteCheck;
      delete c.quoteReview;
    }
  }
  n++;
}
for (const s of NEW) {
  const quote = s.segs.map((g) => cut(s.source, g)).join(' […] ');
  console.log(`\nNEW ${s.id} [${s.source}]\n  ${quote}`);
  if (WRITE && !L.claims.some((c) => c.id === s.id)) {
    const { segs, ...rest } = s;
    L.claims.push({ ...rest, candidates: [s.source], quote });
  }
}
if (errs) { console.log(`
${errs} errors — nothing written`); process.exit(1); }
if (WRITE) fs.writeFileSync(LP, JSON.stringify(L, null, 2) + '\n');
console.log(`\n${n} quotes ${WRITE ? 'written' : '(dry run)'}; ${NEW.length} new claim(s)`);
