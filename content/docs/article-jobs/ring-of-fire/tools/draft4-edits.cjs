#!/usr/bin/env node
// Draft-3 verdicts triage (verdicts-triage.md) → draft-4, as exact replacements; every "old" must occur exactly once.
// A = wording that overreached, B = wrong marker, E = no source yet; X = found while extending the quotes (list D).
'use strict';
const fs = require('fs');
const DIR = 'C:/Users/peggy/DevWebSiteFiles/TransHorizons Website/Articles/Ring of Fire';
let t = fs.readFileSync(`${DIR}/ring-of-fire-draft-3.md`, 'utf8');

const EDITS = [
  // ── A. wording that overreaches the source
  ['A c170 declared during the winter',
    'After an unseasonably warm winter, its Chiefs declared a state of emergency over the viability of the roads. {c170}',
    'Its Chiefs declared a state of emergency during a winter when unseasonably warm weather threatened the viability of the roads. {c170}'],
  ['A c176 harvesting success a factor',
    'The federal draft report notes that the high cost of fuel in remote communities affects whether people go out on the land at all, since harvesting success has to justify the outlay. {c176}',
    'The federal draft report notes that, given the high cost of fuel in remote communities, harvesting success is an important factor in whether people take part in land-based activities. {c176}'],
  ['A c221 detailed design stage',
    'It asked to review, at the commitments stage, groundwater movement in peat under a floating road,',
    'It asked for a commitment giving it the opportunity to review, at the detailed design stage, groundwater movement in peat under a floating road,'],
  ['A c221-2 + B c217-2 (+ X c120-2/c133-2: one submitter, not "submitters") silence sentence',
    "submitters state that none was undertaken, and the natural resources ministry's questions on groundwater movement under a floating road were deferred to detailed design. {g-floating-validation} {c120} {c133} {c221} {c217}",
    "Weenusk states that no site-specific validation of the design methods was undertaken, and the natural resources ministry asked to review groundwater movement in peat under a floating road at the detailed design stage. {g-floating-validation} {c120} {c221}"],
  ['A c223 58 comments made, comments unresolved',
    "The environment ministry's 58 comments on the 70-page draft human health risk assessment remained unresolved in the final submission. {c223}",
    'The environment ministry made 58 comments on the 70-page draft human health risk assessment and reported that comments remained unresolved in the final submission. {c223}'],
  ['A c214 acknowledges the concern',
    "Fort Albany disputes that scope, stating that the cumulative effects assessment does not include the Marten Falls road, and records the proponent's acknowledgement that cumulative effects on peatlands may be underestimated at a project scale. {c214}",
    'Fort Albany states that the cumulative effects assessment does not include the Marten Falls road, and records that the proponent acknowledges the concern that effects on peatlands may be underestimated at a project scale. {c214}'],
  ['A c113-2 assumed operations phase',
    'The road is designed to operate for 75 years. {c113}',
    'The assessment assumes a 75-year operations phase. {c113}'],
  ['A c138/c139 preferred on cost; separate preliminary estimate',
    'and route 2C was preferred among the road corridors for having the lowest preliminary cost, $91.45 million for 107 km, against a current estimate of about $700 million, plus or minus 40%.',
    'and route 2C was preferred on cost, with the lowest preliminary cost, $91.45 million for 107 km; a separate preliminary estimate puts the capital cost of construction at about $700 million, plus or minus 40%.'],
  ['A c125 commonly',
    'It described the mechanism it expects: flooded conditions upstream of a road and dry conditions downstream. {c125}',
    'It said road construction across peatland disrupts surface and subsurface water flows, which commonly creates flooded conditions upstream of a road and dry conditions downstream. {c125}'],
  ['A c075/c076 drop "current to 20 January 2026"',
    'An interim report, current to 20 January 2026, was submitted to the Chiefs and the Minister on 23 February 2026. {c075} {c076} {c077}',
    'An interim report was submitted to the Chiefs and the Minister on 23 February 2026. {c077}'],
  ['A c064 as noted in the April review',
    'When the final assessment was submitted, the regional assessment information was not available. {c064}',
    "Ontario's review noted that the final assessment had been submitted while the regional assessment information was not available. {c064}"],
  ['A c172 drop "for most of the year"',
    'so food, fuel and construction supplies are flown in for most of the year. {c172}',
    'so food, fuel and construction supplies must be flown in. {c172}'],
  ['A c211-2 full phrase',
    'and the science review calls network-level impacts under-assessed. {g-corridor-modes} {c211} {c140}',
    'and the science review calls network-level hydrologic and predator-access impacts under-assessed. {g-corridor-modes} {c211} {c140}'],
  ['A c169 drop the method clause',
    'to as few as 28; it gives no method for the figure. {c169}',
    'to as few as 28. {c169}'],
  ['A c202 the 15 communities of the report',
    'Five of the fifteen First Nations that are partners in the regional assessment have boil-water advisories, four of them for more than ten years. {c202}',
    "Five of the 15 communities covered by the regional assessment's cost-of-living report have boil-water advisories, four of them for more than ten years. {c202}"],
  ['A c117 the 500 figure is the draft report\'s account',
    'The proponent states that traffic will not include ore or mine product and that no more than 500 vehicles a day will use the road. {c116} {c117}',
    'The proponent states that traffic will not include ore or mine product, and the federal draft report records that it anticipates no more than 500 vehicles a day on the road. {c116} {c117}'],
  ['A c011 quote the participant directly',
    'A participant in the regional assessment described the result: the skills of living on the muskeg were lost when people moved into the reserve. {c011}',
    'A working group member from a partner First Nation, quoted in the interim report, recalled stories of people trying to make a living in the muskeg and said: "we lost all these skills when we moved into the reserve." {c011}'],
  ['A c098 the ground is the analysis report\'s view',
    'decided the project does not warrant designation, on the ground that there are means other than a federal impact assessment to address the concerns raised. {c032} {c094} {c098}',
    "decided the project does not warrant designation. {c032} {c094} The Agency's analysis report prepared for that decision is of the view that there are means other than a federal impact assessment, such as existing federal and provincial mechanisms, that provide a framework to address the potential adverse effects. {c098}"],

  // ── B. wrong marker
  ['B c100-2', 'The western 51 km is on mineral soil. {c100}', 'The western 51 km is on mineral soil.'],

  // ── E. no source yet
  ['E c042 quote the disagreement',
    "Constance Lake First Nation remains broadly supportive of Webequie's wish to develop the road and contests the draft conditions. {c042}",
    "Constance Lake First Nation remains broadly supportive of Webequie's wish to develop the road, and states that its review of the draft conditions identified concerns the proponent has not addressed. {c042}"],
  ['E c049 the ministry review\'s lists',
    'Webequie First Nation consulted 22 Indigenous communities, 16 on a rights basis and six on an interest basis. {c049}',
    "Ontario's ministry review lists 22 Indigenous communities that Webequie First Nation consulted: 16 on a rights basis, Webequie itself among them, and six on an interest basis. {c049}"],

  // ── X. found while extending the quotes
  ['X c013 exploring, not building',
    "The regional assessment's interim report lists what communities are building now: greenhouse projects and food distribution systems, and community-led studies on lake sturgeon. {c013} {c014}",
    "The regional assessment's interim report records that some communities are exploring greenhouse projects and food distribution systems, and lists community-led studies on lake sturgeon. {c013} {c014}"],
  ['X c019 Ontario\'s list is "including", with the highway upgrades',
    "Ontario's Ring of Fire road plan consists of three new segments plus the Anaconda and Painter Lake roads. {c019}",
    'Ontario lists the all-season road projects it is helping advance as including the Webequie Supply Road, the Marten Falls Community Access Road, the Northern Road Link and the Anaconda and Painter Lake roads, along with upgrades to Highways 584 and 643. {c019}'],
  ['X c021 + c247 "not required" had no source; the assessment rests on a voluntary agreement',
    "A road of this kind is not required to be assessed under Ontario's Environmental Assessment Act; a proponent may enter a written agreement with the Minister to have the Act apply. {c021}",
    "The provincial assessment rests on a voluntary agreement: Ontario's Environmental Assessment Act allows a proponent to enter a written agreement with the Minister to have the Act apply, and Webequie First Nation agreed to subject the road to a comprehensive assessment under it. {c021} {c247}"],
  ['X c033 "drains to" was not in the source',
    "The Eagle's Nest deposit drains to the Muketei River and ultimately to the Attawapiskat River. {c033}",
    "In its request that the Eagle's Nest mine be designated for federal assessment, Neskantaga First Nation raised adverse effects on the Muketei River and ultimately the Attawapiskat River through changes in water quality; the Agency places the mine in the Muketei River watershed. {c033}"],
  ['X c065/c066 healthcare gaps; monitoring must start',
    'It states that gaps in health and social services need to be addressed urgently, before any additional development can be considered, and that baseline monitoring should start immediately and before any development occurs. {c065} {c066}',
    'It states that funding and capacity gaps in healthcare, especially mental health, need to be addressed urgently, before any additional development can be considered, and that comprehensive baseline monitoring must start immediately and before any development occurs. {c065} {c066}'],
  ['X c131 the cause is changes to hydrology, not "disturbance"',
    'The federal draft report sets out the mechanism: disturbance can cause groundwater impoundment or periodic surface flooding,',
    'The federal draft report sets out the mechanism: on the floating section, changes to hydrology during construction or operation, especially after extreme rainfall, could cause groundwater impoundment or periodic surface flooding,'],
  ['X c132 a recommendation on monitoring, not "conditions would apply"',
    "The federal draft report's answer is monitoring: conditions would apply until a three-year trend analysis demonstrates that the project is unlikely to generate or transport methylmercury. {c132}",
    "The federal draft report's answer is monitoring: the Agency recommends that long-term water quality monitoring where country foods are harvested include methylmercury until a three-year trend analysis demonstrates that the project is unlikely to generate or transport methylmercury. {c132}"],
  ['X c135 nothing identifies the commenter as a peatland scientist',
    'A peatland scientist asked on the registry whether floating roads have been tested in peatlands. {c135}',
    'A public comment on the registry asked whether floating roads and equalisation culverts have been tested in peatlands. {c135}'],
  ['X c144 a minimum estimate',
    'The Missisa caribou population was estimated at 745',
    'The minimum Missisa caribou population was estimated at 745'],
];

for (const [label, oldS, newS] of EDITS) {
  const n = t.split(oldS).length - 1;
  if (n !== 1) throw new Error(`${label}: expected exactly one match, found ${n}`);
  t = t.replace(oldS, () => newS);
  console.log(`  ✓ ${label}`);
}
fs.writeFileSync(`${DIR}/ring-of-fire-draft-4.md`, t);
const words = t.replace(/\{[^}]+\}/g, '').replace(/^#.*$/gm, '').split(/\s+/).filter(Boolean).length;
console.log(`\nWrote ring-of-fire-draft-4.md (${EDITS.length} edits; ~${words} words without markers and headings)`);
