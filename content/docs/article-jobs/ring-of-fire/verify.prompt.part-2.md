# Claim verification — ring-of-fire — part 2 of 3 (41 quotes in 29 sentences)

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

## Sentence 29

Sentence: The 30-month conduct phase is scheduled to end with a final report to the Chiefs and the Minister on 20 July 2027; First Nation delegates on the working group have recommended requesting an extension.

Quotes offered for this sentence:
- c071 — Terms of Reference, Regional Assessment (document 161197), incl. Annex 1 timeline and Minister's letter 15 Feb 2023, s. 11.1;: "11.1. The Working Group will complete its mandate and submit its final Report to the Chiefs of the First Nation Partners and the Minister within 30 months from the establishment of these Terms of Reference."
- c073 (already verified — context only, no verdict needed) — Interim Report, Regional Assessment in the Ring of Fire Area, 23 Feb 2026 (document 165314 / 164647E.pdf), p. 73: "First Nations delegates in the RAWG recommend an extension be requested to the timelines"
- c072-2 (already verified — context only, no verdict needed) — Interim Report, Regional Assessment in the Ring of Fire Area, 23 Feb 2026 (document 165314 / 164647E.pdf), s. 11.1;: "The Terms of Reference schedule a final report to Chiefs and the Minister on July 20, 2027."

## Sentence 30

Sentence: The Minister's letter of 15 February 2023 set the arrangement under which the project assessments proceed according to their legislative time limits and separately from the regional assessment timeline.

Quotes offered for this sentence:
- c074 — Terms of Reference, Regional Assessment (document 161197), incl. Annex 1 timeline and Minister's letter 15 Feb 2023, Minister's letter 15 Feb 2023: "For clarity, the impact assessments of the proposed road projects, and those of other future projects, will proceed in accordance with their legislative time limits, and separately from the regional assessment timeline."
- c234 (already verified — context only, no verdict needed) — Terms of Reference, Regional Assessment (document 161197), incl. Annex 1 timeline and Minister's letter 15 Feb 2023: "Ottawa, Canada K1A 0H3 February 15, 2023"

## Sentence 31

Sentence: An interim report was submitted to the Chiefs and the Minister on 23 February 2026.

Quotes offered for this sentence:
- c077 — Registry 80468, project page (Regional Assessment): "to the Chiefs of Partner First Nations and to the Minister"
- c235 (already verified — context only, no verdict needed) — Registry 80468, project page (Regional Assessment): "February 23, 2026 — The Regional Assessment Working Group submitted the interim report for the regional assessment to the Chiefs of Partner First Nations and to the Minister"

## Sentence 32

Sentence: Wildlife Conservation Society Canada described the three roads as functionally interconnected as a single infrastructure corridor.

Quotes offered for this sentence:
- c085 — WCS Canada comment on draft EAR/IS, 6 Oct 2025: "one primary concern is the treatment of the WSR, Marten Falls Community Access Road, and Northern Road Link as separate undertakings, despite their functional interconnection as a single infrastructure corridor."

## Sentence 33

Sentence: Noront entered a voluntary agreement for a provincial assessment of the Eagle's Nest mine in September 2011, and the terms of reference were approved in 2015.

Quotes offered for this sentence:
- c088 — Analysis Report, Eagle's Nest designation request (document 165296 / p90033/165049E.pdf): "The proponent of the project at the time, Noront Resources Ltd., entered into a voluntary agreement in September 2011 with the province of Ontario to undertake a comprehensive EA and later submitted the Terms of References (ToR) for the assessment in October 2012."
- c089 (already verified — context only, no verdict needed) — Analysis Report, Eagle's Nest designation request (document 165296 / p90033/165049E.pdf): "Terms of Reference was approved in 2015"

## Sentence 34

Sentence: Legislation effective 5 June 2025 terminated the voluntary agreement and revoked the terms-of-reference approval, and on 4 July 2025 the project was exempted under Schedule 3.

Quotes offered for this sentence:
- c090 — Analysis Report, Eagle's Nest designation request (document 165296 / p90033/165049E.pdf): "the provincial requirements for a comprehensive environmental assessment for the project were removed with the Royal Assent of the Protect Ontario by Unleashing our Economy Act, 2025 […] The voluntary agreement has been terminated and the Terms of Reference approval revoked."
- c091 — Final EAR/IS Section 3, Evaluation of Project Alternatives, 30 Jan 2026: "The voluntary agreement has been terminated and the Terms of Reference approval revoked by the Protect Ontario by Unleashing our Economy Act, 2025, effective June 5, 2025."
- c092 (already verified — context only, no verdict needed) — Analysis Report, Eagle's Nest designation request (document 165296 / p90033/165049E.pdf): "On July 4, 2025, the project was exempted under Schedule 3"

## Sentence 35

Sentence: The analysis report places that decision within the amendments to the Act in force since 20 June 2024, which followed the Supreme Court of Canada's ruling of 13 October 2023 and which focus federal decision-making, including the authority to designate, on areas of clear federal jurisdiction.

Quotes offered for this sentence:
- c095 — Analysis Report, Eagle's Nest designation request (document 165296 / p90033/165049E.pdf): "On June 20, 2024, the amended IAA came into […] force to respond to the SCC decision by focusing decision-making, including the authority to designate, on areas of clear federal jurisdiction."
- c096 — Analysis Report, Eagle's Nest designation request (document 165296 / p90033/165049E.pdf): "On October 13, 2023, the Supreme Court of Canada (SCC) issued its decision on the constitutionality of the IAA, finding that the IAA was unconstitutional in part."
- c097 (already verified — context only, no verdict needed) — Analysis Report, Eagle's Nest designation request (document 165296 / p90033/165049E.pdf): "On June 20, 2024, the amended IAA came into force"

## Sentence 36

Sentence: The Agency's analysis report prepared for that decision is of the view that there are means other than a federal impact assessment, such as existing federal and provincial mechanisms, that provide a framework to address the potential adverse effects.

Quotes offered for this sentence:
- c098 — Analysis Report, Eagle's Nest designation request (document 165296 / p90033/165049E.pdf): "The Impact Assessment Agency of Canada (IAAC) prepared this report for consideration by the President of IAAC1 in his response to the request to designate the Eagle’s Nest Mine Project (the physical activities referred to as the project) proposed by Wyloo Ring of Fire Ltd. (the proponent) pursuant to section 9 of the Impact Assessment Act (the IAA). […] IAAC considered the factors in subsection 9(2) of the IAA and is of the view that there are means other than a federal impact assessment such as existing federal and provincial mechanisms, including the Fisheries Act, Metal and Diamond Mining Effluent Regulations, Migratory Birds Convention Act, 1994, Species at Risk Act, Mining Act, Environmental Protection Act, Ontario Water Resources Act, Endangered Species Act or Species Conservation Act, 2025 (once proclaimed), Ontario Heritage Act and the Public Lands Act that provide a framework to address the potential adverse effects within federal jurisdiction and direct or incidental adverse effects that may be caused by the carrying out of the project"

## Sentence 37

Sentence: The eastern 56 km of the Webequie road runs across peatland, and the peat along that half is 2 m to 4 m thick.

Quotes offered for this sentence:
- c100 — Final EAR/IS Section 4, Project Description, 30 Jan 2026, p. 17;: "The eastern half of the WSR is approximately 56 km in length and runs in a west to east direction that terminates in the McFaulds Lake area. This section of the WSR is located in wetland/muskeg terrain that requires development of a road profile that is generally flat based on existing land survey data."
- c101 (already verified — context only, no verdict needed) — Final EAR/IS Section 4, Project Description, 30 Jan 2026, p. 4-11: "The thickness of the peat along the east half of the WSR ranges from 2 m to 4 m in depth"

## Sentence 38

Sentence: Geotextile or geogrid materials are placed on the surface of the peat and the embankment, typically 1.2 m high, is built on top.

Quotes offered for this sentence:
- c099 (already verified — context only, no verdict needed) — Draft Impact Assessment Report, Webequie Supply Road, April 2026 (166134E.pdf, 147 pp.), p. 17: "geotextile or geogrid materials placed on the surface of the peat"
- c102 — Final EAR/IS Section 4, Project Description, 30 Jan 2026: "The east half of the WSR (56 km in length) is typically 1.2 m in height and is to be constructed over the peatland."

## Sentence 39

Sentence: The proponent expects the peat to compress by about 40% of its thickness with the geosynthetics, against 50% or more, with greater instability, without them.

Quotes offered for this sentence:
- c104 — Final EAR/IS Section 4, Project Description, 30 Jan 2026: "Preliminary estimates suggest that the use of geosynthetics in the road design may result in 40%+/- of the peat thickness compressing and having to place fill to achieve the final required grade, as compared to 50% plus settlement and greater instability for a road without a geosynthetic layer."

## Sentence 40

Sentence: The proponent says a permeable rock layer will support continuous movement of groundwater so that the hydrology of the peatlands continues to function.

Quotes offered for this sentence:
- c106 — Final EAR/IS Section 4, Project Description, 30 Jan 2026: "The proposed design will also support continuous movement of groundwater which will ensure that the hydrology […] characteristics of the peatlands continues to function through the use of a permeable layer of rock or select coarse aggregate that permit groundwater flow to continue."

## Sentence 41

Sentence: Two aggregate areas cover about 45.41 ha and 84.24 ha; the proponent gives an aggregate volume of 4,854,500 m³.

Quotes offered for this sentence:
- c110 — Final EAR/IS Section 4, Project Description, 30 Jan 2026: "the volume of aggregate and bedrock aggregate expected to be feasible to extract at ARA-2 is estimated to be approximately between 893,463 m3 to 1,276,375 m3. […] Based on this assumption the total surface area proposed for development at ARA-2 is approximately 45.41 hectares (ha)."
- c111 — Final EAR/IS Section 4, Project Description, 30 Jan 2026: "Aggregate Source Area – ARA-4 […] Based on this assumption the total surface area proposed for development at ARA-4 is approximately 84.24 ha."
- c112 — Appendix P2.M comment-response tables (164888E.pdf): "The Proponent outlines estimated sources and needs for aggregate material for the construction and ongoing maintenance of the road. Overall, as noted in Table 4-5 a volume of 4,854,500 m3 of material is assumed to be necessary through the life of the Project."

## Sentence 42

Sentence: Construction is planned over five to six years, with equipment brought in on the winter road that begins off Highway 808 about 100 km northeast of Pickle Lake.

Quotes offered for this sentence:
- c114 — Final EAR/IS Section 4, Project Description, 30 Jan 2026: "The construction phase is anticipated to take approximately 5 to 6 years to complete."
- c115 — Final EAR/IS Section 4, Project Description, 30 Jan 2026: "All equipment and materials will be transported to the construction site via the winter road that begins off Highway 808 (NORT Road) approximately 100 km northeast of the Town of Pickle Lake to the community of Webequie, and/or delivered by air transport to the airport in Webequie."

## Sentence 43

Sentence: The proponent states that traffic will not include ore or mine product, and the federal draft report records that it anticipates no more than 500 vehicles a day on the road.

Quotes offered for this sentence:
- c116 — Final EAR/IS Section 4, Project Description, 30 Jan 2026, p. 82;: "traffic operations will not include mineral ore or mine product hauling/transport"
- c117 — Draft Impact Assessment Report, Webequie Supply Road, April 2026 (166134E.pdf, 147 pp.), p. 82;: "The proponent anticipates no more than 500 vehicles using the road per day and committed to comply with the Ontario Ministry of Transportation’s Roadside Design Manual and to include adequate roadside safety elements, as well as post speed limits."

## Sentence 44

Sentence: In its review of the draft report, Weenusk pointed to the section reporting uncertainty on whether the floating road design will maintain peatland hydrological conditions, and stated that no site-specific validation of the design methods was undertaken.

Quotes offered for this sentence:
- c119 (already verified — context only, no verdict needed) — Weenusk First Nation, Review of Draft Impact Assessment Report, 21 May 2026: "Section 4.3.3.1 which reports uncertainty on whether the floating road design will maintain peatland hydrological conditions"
- c120 — Weenusk First Nation, Review of Draft Impact Assessment Report, 21 May 2026: "The Draft IA Report indicates that infrastructure integrity (e.g., the “floating road” and potential future surface treatments) will be maintained based on the future project owner’s adherence to design standards. However, no site-specific validation of these methods was undertaken."

## Sentence 45

Sentence: Weenusk First Nation raised the lack of a hydrology study during the assessment and was not satisfied with the proponent's response.

Quotes offered for this sentence:
- c121 — Appendix P2.M comment-response tables (164888E.pdf): "Included in WFN’s initial comments was the lack of a hydrology study as a part of the EAR/IS process. Weenusk Nation members raised concerns regarding potential downstream effects as a result of the Project, including flow patterns and water contamination."
- c122 (already verified — context only, no verdict needed) — Appendix P2.M comment-response tables (164888E.pdf): "Weenusk is not satisfied with the response"

## Sentence 46

Sentence: It said road construction across peatland disrupts surface and subsurface water flows, which commonly creates flooded conditions upstream of a road and dry conditions downstream.

Quotes offered for this sentence:
- c125 — ECCC, Response to Targeted Questions for Federal Analysis, 23 June 2025, p. 16: "Access road construction over peatlands disrupts surface and subsurface water flows due to vegetation removal, peat compression, and the addition of mineral and/or geotextile layers. This commonly creates flooded conditions in upstream areas and dry conditions on the downstream side of the road."

## Sentence 47

Sentence: It noted that the proponent's own assessment assigns high uncertainty to residual effects on hydrology.

Quotes offered for this sentence:
- c128 — ECCC, Response to Targeted Questions for Federal Analysis, 23 June 2025: "In Table 7-5 of Appendix I, the Proponent notes ‘non-significant’ residual effects to hydrology during all project phases and a level of ‘high uncertainty’ when characterizing residual effects to hydrology, based upon the application of a “floating road” design."

## Sentence 48

Sentence: It also noted that an appendix anticipates peak traffic of 100 to 700 vehicles in 2046, a load that bears on how the road performs.

Quotes offered for this sentence:
- c129 — ECCC, Response to Targeted Questions for Federal Analysis, 23 June 2025: "There is additional uncertainty regarding the long-term viability when using a floating road as a mitigation measure, given the potential for high vehicle traffic and heavy payloads. Appendix F anticipates peak traffic levels of 100 to 700 vehicles in 2046, which may compromise the effectiveness of a floating road over time."

## Sentence 49

Sentence: The federal draft report sets out the mechanism: on the floating section, changes to hydrology during construction or operation, especially after extreme rainfall, could cause groundwater impoundment or periodic surface flooding, and the resulting anoxic conditions could enhance methylmercury generation and increase its release into groundwater or surface water.

Quotes offered for this sentence:
- c130 — Draft Impact Assessment Report, Webequie Supply Road, April 2026 (166134E.pdf, 147 pp.), p. 83: "could cause groundwater impoundment or periodic surface flooding. These anoxic conditions could enhance methylmercury generation and increase its release into groundwater or surface water."
- c131 — Draft Impact Assessment Report, Webequie Supply Road, April 2026 (166134E.pdf, 147 pp.), p. 83: "The eastern half of the road, which is about 56 kilometres, would be constructed as a floating road over peatland, where changes to hydrology during construction or operation — especially following extreme rainfall — could cause groundwater impoundment or periodic surface flooding."

## Sentence 50

Sentence: The federal draft report's answer is monitoring: the Agency recommends that long-term water quality monitoring where country foods are harvested include methylmercury until a three-year trend analysis demonstrates that the project is unlikely to generate or transport methylmercury.

Quotes offered for this sentence:
- c132 — Draft Impact Assessment Report, Webequie Supply Road, April 2026 (166134E.pdf, 147 pp.), p. 84: "As such, IAAC recommends that long-term water quality monitoring in areas where country foods are harvested include methylmercury until a three‑year trend analysis demonstrates the project is unlikely to generate or transport methylmercury, in consideration of the views from Indigenous communities on monitoring design and analysis."

## Sentence 51

Sentence: A public comment on the registry asked whether floating roads and equalisation culverts have been tested in peatlands.

Quotes offered for this sentence:
- c135 — Registry 80183, public comments list: "Given the global importance of the peatlands in the Hudson Bay Lowland more detail on the efficacy of floating roads and equalization culverts should be provided to avoid impoacts to the roads. For instance, have they been tested in peatlands?"

## Sentence 52

Sentence: Within the Webequie road's own analysis, three other modes were evaluated, a hoverbarge, a heavy-lift airship and a new rail corridor, and route 2C was preferred on cost, with the lowest preliminary cost, $91.45 million for 107 km; a separate preliminary estimate puts the capital cost of construction at about $700 million, plus or minus 40%.

Quotes offered for this sentence:
- c137 — Final EAR/IS Section 3, Evaluation of Project Alternatives, 30 Jan 2026: "Alternative 2C is 107 km in length … $91.45 million"
- c138 — Final EAR/IS Section 3, Evaluation of Project Alternatives, 30 Jan 2026: "Alternative 2C is preferred for this factor, as it has the lowest preliminary cost"
- c139 — Appendix P2.M comment-response tables (164888E.pdf): "The preliminary estimated capital cost for construction of the WSR is approximately $700 million dollars (+/- 40%)"
- c140 — Final EAR/IS Section 3, Evaluation of Project Alternatives, 30 Jan 2026: "hoverbarge (hovercraft), heavy lift airship (dirigible), and a new rail corridor"

## Sentence 53

Sentence: The minimum Missisa caribou population was estimated at 745 from winter distribution surveys completed between 2009 and 2013, and was on a declining trend.

Quotes offered for this sentence:
- c144 — Final EAR/IS Section 3, Evaluation of Project Alternatives, 30 Jan 2026: "The minimum Caribou population in the Missisa Range was estimated at 745 based on winter distribution surveys completed from 2009 through 2013."
- c145 — Final EAR/IS Section 3, Evaluation of Project Alternatives, 30 Jan 2026: "the population was on a declining trend"

## Sentence 54

Sentence: Some First Nation Elders put habitat recovery after disturbance at more than 100 years.

Quotes offered for this sentence:
- c146 — Final EAR/IS Section 3, Evaluation of Project Alternatives, 30 Jan 2026: "Caribou habitat disturbance has become a systemic problem across Canada, which is a significant issue given the amount of time it takes for habitat recovery (deemed to be in excess of 100 years by some First Nation Elders)."

## Sentence 55

Sentence: The provincial terms of reference focused the assessment to exclude a detailed assessment of alternatives to the project.

Quotes offered for this sentence:
- c148 — Ministry Review of the Webequie Supply Road Environmental Assessment, 17 Apr 2026 (updated 20 Apr): "2.1 Preferred alternative In accordance with the approved ToR , the EA was focused to exclude a detailed assessment of ‘alternatives to’ the project."

## Sentence 56

Sentence: The regional assessment working group calls cost of living an urgent priority and commissioned the report.

Quotes offered for this sentence:
- c151 — Interim Report, Regional Assessment in the Ring of Fire Area, 23 Feb 2026 (document 165314 / 164647E.pdf): "The RAWG has commissioned a study to better understand the many factors that explain the cost of living across the Kawana ‘Bi 'Kag/ Biiwaapiko'kaning" /Kahwanna Bay Yak."
- c152 — Joseph, C., D. Waugh and D. O’Gorman (Swift Creek Consulting), Cost-of-living in First Nations Communities in the Ring of Fire Region of Northern Ontario, report for the Regional Assessment Working Group, 2026 (registry 80468, reference 263): "This report and related materials were prepared for the RAWG, and to the extent possible has included RAWG guidance, but does in no way imply consent or agreement from the RAWG in the analysis and recommendations."
- c175 (already verified — context only, no verdict needed) — Interim Report, Regional Assessment in the Ring of Fire Area, 23 Feb 2026 (document 165314 / 164647E.pdf): "Cost of living is an urgent priority for the RAWG."

## Sentence 57

Sentence: Nishnawbe Aski Nation states that the season has fallen from an average of 77 days to as few as 28.

Quotes offered for this sentence:
- c169 — Nishnawbe Aski Nation, Federal commitment will help improve vital winter road network to remote communities: "The impacts of climate change have significantly shortened the winter road season, reducing it from an average of 77 days to as few as 28 days – or even less in some regions."
