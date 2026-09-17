# Claim verification — ring-of-fire — part 3 of 3 (28 quotes in 26 sentences)

> Operator note — NOT part of the prompt: paste everything below the line into a NEW chat with memory OFF, outside any project, with web search OFF. Attach nothing else. Save the JSON reply to a file and run `npm run article:evidence -- verdicts <slug> <file>`.

---

You are checking whether each quoted passage supports the sentence written from it. Judge ONLY from the quote shown. Do not use what you know about the subject and do not search: a claim the quote does not carry is not supported, however true you believe it to be.

Claims are grouped by SENTENCE. A sentence often rests on several quotes, each covering part of it. Give ONE verdict per quote id, judging whether that quote supports the part of the sentence it addresses. Parts of a sentence that are the author's own framing (no figure, no attribution, no "first/only/no") are not claims. If a factual part of the sentence is carried by NONE of its quotes, give "partial" to the quote closest to it and name the unsupported words in its note.

Verdicts:
- supported — the quote says what the sentence says, at the same strength, scope, place and date.
- partial — the quote carries a weaker, narrower, older or differently-scoped version. Typical cases: a trend where the quote has a single data point; "all/every/first/only" where the quote says less; an estimate or projection written as a measurement; a different year, place or population; a LINK between two facts — "because", "so", or simply a colon or two facts set side by side so that one reads as the cause of the other — that the quote does not itself make.
- contradicted — the quote says something incompatible with the sentence.
- not-in-source — the quote does not address what the sentence claims.

In `note`, one sentence naming the exact word or phrase of the sentence that overreaches (empty for supported).

Return ONLY a JSON array, nothing before or after it:
[{"id": "c1", "verdict": "supported", "note": ""}]

## Sentence 58

Sentence: Its Chiefs declared a state of emergency during a winter when unseasonably warm weather threatened the viability of the roads.

Quotes offered for this sentence:
- c170 — Nishnawbe Aski Nation, Federal commitment will help improve vital winter road network to remote communities: "“Last winter our Chiefs were forced to declare a state of emergency as unseasonably warm weather threatened the viability of winter roads, and our leaders are concerned that the same will happen this year."

## Sentence 59

Sentence: Webequie is accessible only by air or by winter road, so food, fuel and construction supplies must be flown in.

Quotes offered for this sentence:
- c172 — Webequie Supply Road backgrounder, 9 June 2025: "Webequie is currently accessible only by air or winter roads, which means food, fuel and construction supplies must be flown in."

## Sentence 60

Sentence: The trail between Webequie and McFaulds Lake can be travelled over its whole length only in the coldest winter months.

Quotes offered for this sentence:
- c174 — Final EAR/IS Section 3, Evaluation of Project Alternatives, 30 Jan 2026: "3.1.2.2 Alternative 2: Upgrade Existing Trail System to Seasonal Winter Road The existing informal trail system between Webequie First Nation and the McFaulds Lake area can only be travelled for the entire distance during the coldest winter months."

## Sentence 61

Sentence: The federal draft report notes that, given the high cost of fuel in remote communities, harvesting success is an important factor in whether people take part in land-based activities.

Quotes offered for this sentence:
- c176 — Draft Impact Assessment Report, Webequie Supply Road, April 2026 (166134E.pdf, 147 pp.): "given the high cost of fuel in remote communities, harvesting success is an important factor that influences the likelihood of land-users engaging in land-based activities."

## Sentence 62

Sentence: The Swift Creek report cites the Inuvik–Tuktoyaktuk Highway in the Northwest Territories, a 137 km two-lane gravel road completed in 2017 at about $299 million that replaced a winter-only ice road.

Quotes offered for this sentence:
- c187 — Joseph, C., D. Waugh and D. O’Gorman (Swift Creek Consulting), Cost-of-living in First Nations Communities in the Ring of Fire Region of Northern Ontario, report for the Regional Assessment Working Group, 2026 (registry 80468, reference 263): "the Inuvik-to-Tuktoyaktuk Highway, a 137 km, two-lane gravel road completed in 2017 at a cost of approximately $299 million, replaced a winter-only ice road […] The NWT did note that the highway is estimated to save $560,000 per year in winter road construction and maintenance costs."

## Sentence 63

Sentence: A Northern Policy Institute study cited in the report found gasoline in Moosonee at about 148% of the Toronto price in 2022; Moosonee is not one of the fifteen communities.

Quotes offered for this sentence:
- c190 — Joseph, C., D. Waugh and D. O’Gorman (Swift Creek Consulting), Cost-of-living in First Nations Communities in the Ring of Fire Region of Northern Ontario, report for the Regional Assessment Working Group, 2026 (registry 80468, reference 263): "A Northern Policy Institute study found gasoline to be about 148% of the price in 2022 in Moosonee compared to Toronto. […] Table 13. Road access for First Nations communities in the Ring of Fire region First Nation / Community Year-round Road Access? Road Distance to Closest Centre Aroland Yes Hearst: 284km Attawapiskat No N/a Constance Lake Yes Hearst: 44km Eabametoong / Fort Hope No N/a Fort Albany No N/a Ginoogaming Yes Hearst: 215km Kashechewan No N/a Long Lake #58 Yes Hearst: 213km Marten Falls No N/a Missinabie Cree Yes N/a Moose Cree / Moose Factory No N/a Neskantaga / Lansdowne House No N/a Nibinamik / Summer Beaver No N/a Webequie No N/a Weenusk / Peawanuck No N/a"

## Sentence 64

Sentence: Webequie's northern food basket rose 27.3% between September 2022 and September 2025, from $545 to $694.

Quotes offered for this sentence:
- c193 — Joseph, C., D. Waugh and D. O’Gorman (Swift Creek Consulting), Cost-of-living in First Nations Communities in the Ring of Fire Region of Northern Ontario, report for the Regional Assessment Working Group, 2026 (registry 80468, reference 263): "Table 18. Revised Northern Food Basket (RNFB) for remote communities, and comparative National Nutritious Food Basket for non-remote communities1 First Nation / Community Sept 2022 March 2023 Sept 2023 March 2024 Sept 2024 March 2025 Sept 2025 % change RNFB 2022-2025 […] Webequie $545 $552 $556 $564 $592 $619 $694 +27.3%"
- c238 (already verified — context only, no verdict needed) — Joseph, C., D. Waugh and D. O’Gorman (Swift Creek Consulting), Cost-of-living in First Nations Communities in the Ring of Fire Region of Northern Ontario, report for the Regional Assessment Working Group, 2026 (registry 80468, reference 263), p. 48: "First Nation / Community Sept 2022 March 2023 Sept 2023 March 2024 Sept 2024 March 2025 Sept 2025"

## Sentence 65

Sentence: The average one-way airfare from the communities was $607 in February 2026, based on the least expensive online fares; from Nibinamik to Thunder Bay it was $1,290.

Quotes offered for this sentence:
- c196 — Joseph, C., D. Waugh and D. O’Gorman (Swift Creek Consulting), Cost-of-living in First Nations Communities in the Ring of Fire Region of Northern Ontario, report for the Regional Assessment Working Group, 2026 (registry 80468, reference 263): "Cost of Airfare One- way1 Nibinamik / Summer Beaver Yes Wasaya 2.4 to 3.3 hours to Thunder Bay $1,290 Webequie Yes Northstar 1.9 hours to Thunder Bay $442 Weenusk / Peawanuck Yes Air Creebec 2.8 hours to Timmins $862 Average: 1.9 hours $607 […] Note: 1. Airfare costs found online February 2026: costs shown were the least expensive fares for travel during the months of late winter/early spring 2026, but these fares may not always be available."
- c197 (already verified — context only, no verdict needed) — Joseph, C., D. Waugh and D. O’Gorman (Swift Creek Consulting), Cost-of-living in First Nations Communities in the Ring of Fire Region of Northern Ontario, report for the Regional Assessment Working Group, 2026 (registry 80468, reference 263): "Nibinamik / Summer Beaver Yes Wasaya 2.4 to 3.3 hours to Thunder Bay $1,290"
- c237 (already verified — context only, no verdict needed) — Joseph, C., D. Waugh and D. O’Gorman (Swift Creek Consulting), Cost-of-living in First Nations Communities in the Ring of Fire Region of Northern Ontario, report for the Regional Assessment Working Group, 2026 (registry 80468, reference 263), p. 43: "Airfare costs found online February 2026: costs shown were the least expensive fares for travel during the months of late winter/early spring 2026"

## Sentence 66

Sentence: Five of the 15 communities covered by the regional assessment's cost-of-living report have boil-water advisories, four of them for more than ten years.

Quotes offered for this sentence:
- c202 — Joseph, C., D. Waugh and D. O’Gorman (Swift Creek Consulting), Cost-of-living in First Nations Communities in the Ring of Fire Region of Northern Ontario, report for the Regional Assessment Working Group, 2026 (registry 80468, reference 263): "Five of the 15 communities have boil-water advisories in place; four for over ten years, and one (Neskantaga) for over 30 years!"

## Sentence 67

Sentence: The Swift Creek report cites analysts who concluded that at Musselwhite, a mine served by an all-season road, food and housing costs continued to be affected by air freight dependency, short winter road seasons and retailer monopolies, and that food subsidies had not been found effective.

Quotes offered for this sentence:
- c206 — Joseph, C., D. Waugh and D. O’Gorman (Swift Creek Consulting), Cost-of-living in First Nations Communities in the Ring of Fire Region of Northern Ontario, report for the Regional Assessment Working Group, 2026 (registry 80468, reference 263): "The Musselwhite Mine in northwestern Ontario, in production since 2007 […] The mine is road-accessible by an all-season road to and from Pickle Lake […] a number of cost-of-living factors remain challenging since Musselwhite opened. […] Analysts have concluded that food costs and housing have continued to be affected by air freight dependency, short winter road seasons, retailer monopolies; NNC food subsidies have not been found to be effective."

## Sentence 68

Sentence: For the northern diamond mines, the report says the more consequential effect on food costs was the disruption of the traditional food economy, which forced households to depend more on expensive imported food.

Quotes offered for this sentence:
- c207 — Joseph, C., D. Waugh and D. O’Gorman (Swift Creek Consulting), Cost-of-living in First Nations Communities in the Ring of Fire Region of Northern Ontario, report for the Regional Assessment Working Group, 2026 (registry 80468, reference 263): "The cost of store-bought food in remote NWT communities became high during the diamond mining period […] However, the more consequential effect on food costs is the disruption to the traditional food economy, which forces greater household dependence on expensive imported food."

## Sentence 69

Sentence: Fort Albany states that the cumulative effects assessment does not include the Marten Falls road, and records that the proponent acknowledges the concern that effects on peatlands may be underestimated at a project scale.

Quotes offered for this sentence:
- c214 — Fort Albany First Nation, submission, May 2026: "The cumulative effects assessment does not include the Marten Falls Community Access Road - The proponent acknowledges the concern that cumulative effects on peatland ecosystems may be underestimated when assessed at a project scale."

## Sentence 70

Sentence: Ontario's Ministry of Natural Resources stated that several of the final assessment's conclusions on peatland impacts and greenhouse gas emissions are not fully supported by the information provided.

Quotes offered for this sentence:
- c216 — Ontario Ministry of the Environment, Conservation and Parks, Ministry Review of the Webequie Supply Road EA — Appendix B, comment-response tables (released on request to Peggy, 2026), p. 34: "Ministry of Natural Resources (MNR) MNR: Regional Operations Division - Northwest Region […] MNR 28. Topic: Peatland Impacts, Mitigation and Monitoring The Final EA includes several conclusions related to peatland impacts and greenhouse gas (GHG) emissions are not fully supported by the information provided."

## Sentence 71

Sentence: It asked for a commitment giving it the opportunity to review, at the detailed design stage, groundwater movement in peat under a floating road, the assessment of peatland compression under loading, and hydrological modelling related to climate change.

Quotes offered for this sentence:
- c221 — Ontario Ministry of the Environment, Conservation and Parks, Ministry Review of the Webequie Supply Road EA — Appendix B, comment-response tables (released on request to Peggy, 2026), p. 39: "To ensure MNR’s interests are incorporated at the detailed design stage, please include a general EA commitment for the owner/operator to work with MNR on engineering designs (for both the main corridor and ancillary infrastructure) that are related to, or may impact, hydrology and/or peatlands. Specifically, with respect to MNR’s Draft EA comments # 44-48, and 50 (related to Appendix D-1, Preliminary Engineering Design Report), MNR requests that EA commitments provide MNR an opportunity to review/comment on: • How channel and ladder fens were incorporated into drainage design; • Assessment of peatland compression under roadway loading; • Hydrological modelling information related to climate change; • Groundwater movement in peat under a floating road"

## Sentence 72

Sentence: Ontario's environmental assessment branch wrote that it is not clear from the cumulative effects chapter how the Marten Falls findings were used.

Quotes offered for this sentence:
- c222 — Ontario Ministry of the Environment, Conservation and Parks, Ministry Review of the Webequie Supply Road EA — Appendix B, comment-response tables (released on request to Peggy, 2026), p. 3: "MECP: Environmental Assessment Branch 4. Topic: Consideration of cumulative effects assessment in the MFCAR draft EA […] the Project Team has considered the analysis and findings (e.g., species at risk – caribou) in the cumulative effects assessment for the Marten Falls Community Access Road Project as contained in Section 10 of the Draft Environmental Assessment / Impact Statement, dated February 2025.” […] However, it is not clear from the rest of the cumulative effects assessment chapter (section 21) how this was done."

## Sentence 73

Sentence: The environment ministry made 58 comments on the 70-page draft human health risk assessment and reported that comments remained unresolved in the final submission.

Quotes offered for this sentence:
- c223 — Ontario Ministry of the Environment, Conservation and Parks, Ministry Review of the Webequie Supply Road EA — Appendix B, comment-response tables (released on request to Peggy, 2026), p. 12: "The ministry’s comments on the HHRA submission were substantive, providing 58 comments across 28 pages for the proponent’s 70-page draft HHRA. Comments remain unresolved in the final HHRA submission dated January 30, 2026."

## Sentence 74

Sentence: Aroland's position is that no approvals should be granted for resource roads until, at minimum, the regional assessment is completed; it recommends that any later connection to the Northern Road Link or the Marten Falls road, or any enabling of the Eagle's Nest mine, be treated as a change requiring formal review and amendment of the decision.

Quotes offered for this sentence:
- c226 — Ontario Ministry of the Environment, Conservation and Parks, Ministry Review of the Webequie Supply Road EA — Appendix B, comment-response tables (released on request to Peggy, 2026), p. 89: "Aroland First Nation 2. Not addressed. […] AFN’s position remains that no approvals should be granted for resource roads until, at minimum, the Ring of Fire Regional Assessment is completed."
- c228 (already verified — context only, no verdict needed) — Ontario Ministry of the Environment, Conservation and Parks, Ministry Review of the Webequie Supply Road EA — Appendix B, comment-response tables (released on request to Peggy, 2026), p. 90: "AFN further recommends that if the WSR is subsequently connected to the NRL, MFCAR, or enables development such as the Eagle’s Nest Mine, such development must be treated as a change requiring formal review and amendment of any decision."

## Sentence 75

Sentence: The proponent's reply to Aroland was that relevant information from the regional assessment, if available, will be used to inform the project effects assessment.

Quotes offered for this sentence:
- c227 — Ontario Ministry of the Environment, Conservation and Parks, Ministry Review of the Webequie Supply Road EA — Appendix B, comment-response tables (released on request to Peggy, 2026), p. 70: "Aroland First Nation 2. Not addressed. […] We have completed a cumulative effects assessment on the socio-economic environment in accordance with federal TISG and EA Terms of Reference. We reiterate that as required by the TISG and ToR Notice of Approval requirement (amendment #1.3) for the WSR Project, and the IA Act, relevant information from the regional assessment, if available, will be used to inform the Project effects assessment."

## Sentence 76

Sentence: Friends of the Attawapiskat River asked that the impact statement be updated to require a study of mercury on human health and the environment that accounts for the project and for legacy contamination.

Quotes offered for this sentence:
- c229 — Ontario Ministry of the Environment, Conservation and Parks, Ministry Review of the Webequie Supply Road EA — Appendix B, comment-response tables (released on request to Peggy, 2026), p. 83: "The Friends submit that this approach does not sufficiently consider cumulative or long-term contamination pathways, including mercury movement within wetlands and interconnected hydrological systems, particularly in light of existing community health concerns and legacy environmental contamination. […] Recommendation No. 15: The Impact Statement must be updated to require a study of mercury on human health and the environment, which takes into account the proposed project and legacy contamination."

## Sentence 77

Sentence: Across the peatland the road is to be built without excavation.

Quotes offered for this sentence:
- c232 — Final EAR/IS Section 4, Project Description, 30 Jan 2026, p. 12: "As the entire east half of the WSR is situated within the James Bay Lowland, the construction of the road in peatland is unavoidable, and it is not economically viable nor environmentally desirable to excavate the peat and replace it with suitable fill material. […] By maintaining the surface layer of vegetation, and fact that no excavation is planned"

## Sentence 78

Sentence: In June 2026 Ontario approved the portion of the 107 km Webequie Supply Road, an all-season road, that lies off Webequie First Nation reserve land.

Quotes offered for this sentence:
- c002 (already verified — context only, no verdict needed) — Webequie Supply Road Project page, Government of Ontario: "Decision date: June 18, 2026"
- c020 (already verified — context only, no verdict needed) — Impact assessment registry, project 80183 (Webequie Supply Road): "107-kilometre all-season road connecting the Webequie Airport and the McFaulds Lake area"
- c243 — Webequie Supply Road Project page, Government of Ontario: "Webequie First Nation has been given approval under the Environmental Assessment Act to proceed with the construction, operation and maintenance of a new, 90 kilometre, all-season road which will connect to the Ring of Fire region near McFaulds Lake and serve as a vital link for future mineral development projects. […] This approval is for the portion of the 107-kilometre long Webequie Supply Road that is not located on the reserve of Webequie First Nation."

## Sentence 79

Sentence: Environment and Climate Change Canada answered the Agency's questions on the Marten Falls road's draft impact statement, having been asked to consider the Webequie road and the Northern Road Link as well.

Quotes offered for this sentence:
- c244 — ECCC, Response to Targeted Questions for Federal Analysis, 23 June 2025, p. 1: "ECCC Response to Targeted Questions for Federal Analysis […] To support IAAC’s review of the draft Impact Statements and preparation of the draft Impact Assessment Report, please provide responses to the targeted questions in the table. […] When responding to these questions, please consider not only Marten Falls Community Access Road Project (the Project), but also Northern Road Link Project and Webequie Supply Road Project. […] The Marten Falls Community Access Road Project (MFCAR) draft Impact Statement (dIS)"

## Sentence 80

Sentence: On 18 June 2026 Ontario approved the environmental assessment for the portion of the Webequie Supply Road not located on Webequie First Nation reserve land.

Quotes offered for this sentence:
- c002-2 (already verified — context only, no verdict needed) — Webequie Supply Road Project page, Government of Ontario: "Decision date: June 18, 2026"
- c243-2 — Webequie Supply Road Project page, Government of Ontario: "Webequie First Nation has been given approval under the Environmental Assessment Act to proceed with the construction, operation and maintenance of a new, 90 kilometre, all-season road which will connect to the Ring of Fire region near McFaulds Lake and serve as a vital link for future mineral development projects. […] This approval is for the portion of the 107-kilometre long Webequie Supply Road that is not located on the reserve of Webequie First Nation."

## Sentence 81

Sentence: No study in the record validates a floating road with equalisation culverts in peatland of this kind; Weenusk states that no site-specific validation of the design methods was undertaken, and the natural resources ministry asked to review groundwater movement in peat under a floating road at the detailed design stage.

Quotes offered for this sentence:
- c120-2 — Weenusk First Nation, Review of Draft Impact Assessment Report, 21 May 2026: "The Draft IA Report indicates that infrastructure integrity (e.g., the “floating road” and potential future surface treatments) will be maintained based on the future project owner’s adherence to design standards. However, no site-specific validation of these methods was undertaken."
- c221-2 — Ontario Ministry of the Environment, Conservation and Parks, Ministry Review of the Webequie Supply Road EA — Appendix B, comment-response tables (released on request to Peggy, 2026), p. 39: "To ensure MNR’s interests are incorporated at the detailed design stage, please include a general EA commitment for the owner/operator to work with MNR on engineering designs (for both the main corridor and ancillary infrastructure) that are related to, or may impact, hydrology and/or peatlands. Specifically, with respect to MNR’s Draft EA comments # 44-48, and 50 (related to Appendix D-1, Preliminary Engineering Design Report), MNR requests that EA commitments provide MNR an opportunity to review/comment on: • How channel and ladder fens were incorporated into drainage design; • Assessment of peatland compression under roadway loading; • Hydrological modelling information related to climate change; • Groundwater movement in peat under a floating road"

## Sentence 82

Sentence: The assessment assumes a 75-year operations phase.

Quotes offered for this sentence:
- c113-2 — Final EAR/IS Section 4, Project Description, 30 Jan 2026: "operations phase of the Project is considered to be 75-years"

## Sentence 83

Sentence: No assessment compared routes or transport modes for the corridor as a whole; the only comparison of modes is inside the Webequie road's own alternatives, and the science review calls network-level hydrologic and predator-access impacts under-assessed.

Quotes offered for this sentence:
- c211-2 — Wyndham Research, science review for the Regional Assessment, March 2026: "Corridor proposals still largely proponent-driven.  Network-level hydrologic and predator access impacts under-assessed."
- c140-2 — Final EAR/IS Section 3, Evaluation of Project Alternatives, 30 Jan 2026: "hoverbarge (hovercraft), heavy lift airship (dirigible), and a new rail corridor"
