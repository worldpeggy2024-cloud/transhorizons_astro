#!/usr/bin/env node
// Apply the draft-2 review edits as exact replacements; every "old" must occur exactly once.
'use strict';
const fs = require('fs');
const DIR = 'C:/Users/peggy/DevWebSiteFiles/TransHorizons Website/Articles/Ring of Fire';
let t = fs.readFileSync(`${DIR}/ring-of-fire-draft-2.md`, 'utf8');

const EDITS = [
  // 1. factual error: Ontario approved only the off-reserve portion; opening no longer one sentence
  ['review §1 opening',
    'Ontario and Canada approved a 107 km all-season road across Far North peatland in June 2026, more than a year before the regional assessment of the Ring of Fire area is scheduled to report. {c020} {c002} {c003} {c072}',
    'In June 2026 Ontario approved the portion of the 107 km Webequie Supply Road, an all-season road, that lies off Webequie First Nation reserve land. {c020} {c243} {c002} A week later the Government of Canada issued its impact assessment decision statement, more than a year before the regional assessment of the Ring of Fire area is scheduled to report. {c003} {c072}'],
  ['review §1 the project',
    'On 18 June 2026 Ontario approved the environmental assessment of the Webequie Supply Road. {c002}',
    'On 18 June 2026 Ontario approved the environmental assessment for the portion of the Webequie Supply Road not located on Webequie First Nation reserve land. {c002} {c243}'],
  // 2. blocking lines
  ['review §2 five months', ' The road moved from final submission to provincial approval in under five months. {reasoning}', ''],
  ['review §2 ECCC date + superlative; §4 ECCC scope',
    "Environment and Climate Change Canada's response to the Agency, dated 23 June 2025, is the most detailed federal statement on the question. {reasoning} The department said",
    "Environment and Climate Change Canada answered the Agency's questions on the Marten Falls road's draft impact statement, having been asked to consider the Webequie road and the Northern Road Link as well. {c244} The department said"],
  ['review §2 Weenusk date', 'In its review of the draft report, dated 21 May 2026, Weenusk pointed', 'In its review of the draft report, Weenusk pointed'],
  ['review §2 submitters argued', 'Submitters argued that the road cannot be assessed on its own. Aroland stated', 'Aroland stated'],
  ['review §2 key conclusion',
    "while no assessment decided the corridor as a whole. {reasoning}",
    "while no assessment decided the corridor as a whole. {c213} {g-corridor-modes} {reasoning}"],
  // 3. unmarked sentences
  ['review §3 season', 'The season is getting shorter. The draft report records', 'The draft report records'],
  ['review §3 grants', 'The winter road is paid for by grants. As of November 2024', 'As of November 2024'],
  ['review §3 subsidies picture', 'Federal food subsidies are part of the picture. Numerous community members', 'Numerous community members'],
  ['review §3 cuts both ways', 'The comparison the report offers cuts both ways. The report says better road access', 'The Swift Creek report says better road access'],
  ['review §3 looks at mines',
    'The report also looks at mines. At Musselwhite, a mine served by an all-season road, analysts concluded that food and housing costs',
    'The Swift Creek report cites analysts who concluded that at Musselwhite, a mine served by an all-season road, food and housing costs'],
  ['review §3 conclusions conditional', "The report's conclusions are conditional. Costs similar to those in the south are not likely", 'The report concludes that costs similar to those in the south are not likely'],
  ['review §3 without excavation', 'Across the peatland the road is to be built without excavation. Geotextile', 'Across the peatland the road is to be built without excavation. {c232} Geotextile'],
  ['review §3 submitters went further', 'Submitters went further. Wildlife Conservation Society Canada wrote', 'Wildlife Conservation Society Canada wrote'],
  ['review §3 ministries similar', "Ontario's own ministries recorded similar questions. The Ministry of Natural Resources stated", "Ontario's Ministry of Natural Resources stated"],
  ['review §3 did consider', 'The federal draft report did consider the road together with the others for some effects. It states the Agency', 'The federal draft report states the Agency'],
  ['review §3 incomplete', "The final submission was also incomplete on Ontario's account. The assessment submitted on 30 January 2026", "According to Ontario's ministry review, the assessment submitted on 30 January 2026"],
  // 4. reader notes
  ['review §4 costs rise twice',
    'When the road deteriorates, costs rise twice, through maintenance and through a growing need for air freight. {c184}',
    'When winter road conditions worsen, costs rise in two ways, through maintenance of the road and through a growing need for air freight. {c184}'],
  ['review §4 mercury superlative', 'Mercury is the contaminant the record returns to most often. {reasoning} ', ''],
  ['review §4 caribou superlative', 'Caribou are the other measured concern. {reasoning} ', ''],
  ['review §4 closest precedent',
    'The Inuvik–Tuktoyaktuk Highway in the Northwest Territories is the closest precedent in the record. {reasoning} It is a 137 km two-lane gravel road completed in 2017 at about $299 million, replacing a winter-only ice road. {c187}',
    'The Swift Creek report cites the Inuvik–Tuktoyaktuk Highway in the Northwest Territories, a 137 km two-lane gravel road completed in 2017 at about $299 million that replaced a winter-only ice road. {c187}'],
  ['review §4 two cases',
    "The regional assessment's interim report records a case in which a road resulted in community members losing subsidies and the overall cost of food increasing. {c150}",
    "The regional assessment's interim report records an experience shared by a member of its working group, in which a road improved access and lowered the price of food but community members lost subsidies, and overall the cost of food increased. {c245}"],
  ['review §4 Health Canada attribution',
    "Health Canada, in its analysis of the Eagle's Nest designation request, describes the generation of methylmercury in peatland environments as an existing concern in the Ring of Fire region. {c009}",
    "The Agency's analysis of the Eagle's Nest designation request describes the generation of methylmercury in peatland environments as an existing concern in the Ring of Fire region, a concern shared by Health Canada and Indigenous Services Canada. {c009} {c246}"],
];

for (const [label, oldS, newS] of EDITS) {
  const n = t.split(oldS).length - 1;
  if (n !== 1) throw new Error(`${label}: expected exactly one match, found ${n}`);
  t = t.replace(oldS, () => newS);
  console.log(`  ✓ ${label}`);
}
fs.writeFileSync(`${DIR}/ring-of-fire-draft-3.md`, t);
console.log(`\nWrote ring-of-fire-draft-3.md (${EDITS.length} edits; ${t.split(/\s+/).length} tokens incl. markers)`);
