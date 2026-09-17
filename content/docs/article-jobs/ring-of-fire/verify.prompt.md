# Claim verification — ring-of-fire

> Operator note — NOT part of the prompt: paste everything below the line into a NEW chat with memory OFF, outside any project. Attach nothing else. Save the JSON reply to a file and run `npm run article:evidence -- verdicts <slug> <file>`.

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

## Sentence 1

Sentence: The final environmental assessment report and impact statement had been submitted on 30 January 2026.

Quotes offered for this sentence:
- c001 — Webequie Supply Road Project page, Government of Ontario: "Submission date: January 30, 2026 […] Webequie First Nation submitted its environmental assessment for the Webequie Supply Road to the Ministry of the Environment, Conservation and Parks for review on January 30, 2026"

## Sentence 2

Sentence: Neskantaga First Nation, about 100 km southwest of the Eagle's Nest deposit, has been under a drinking water advisory since 1995, the longest-running in Canada.

Quotes offered for this sentence:
- c004 — Interim Report, Regional Assessment in the Ring of Fire Area, 23 Feb 2026 (document 165314 / 164647E.pdf): "Neskantaga First Nation has the longest-running drinking water advisory in Canada, in place since 1995."
- c034 (already verified — context only, no verdict needed) — Analysis Report, Eagle's Nest designation request (document 165296 / p90033/165049E.pdf): "Neskantaga approximately 100 kilometres southwest of the project"

## Sentence 3

Sentence: The federal draft impact assessment report gives the Webequie winter road as open from around January to mid-March.

Quotes offered for this sentence:
- c005 — Draft Impact Assessment Report, Webequie Supply Road, April 2026 (166134E.pdf, 147 pp.), p. 19: "Alternatives to carrying out the project considered by the proponent included air transportation and the existing winter access road, dependent on ice thickness, open from around January to mid-March."

## Sentence 4

Sentence: The Far North Science Advisory Panel estimated in 2010 that the region's wetlands hold as much water as Lake Erie; the interim report repeats the figure.

Quotes offered for this sentence:
- c007 — Interim Report, Regional Assessment in the Ring of Fire Area, 23 Feb 2026 (document 165314 / 164647E.pdf), quoting the Far North Science Advisory Panel (2010): "The Hudson Bay Lowland is the globe's third largest wetland, and the largest in North America. Along the Hudson and James Bay coasts and farther inland, the Far North's wetlands and peatlands contain as much water as Lake Erie. […] Far North Science Advisory Panel (2010)"

## Sentence 5

Sentence: The regional assessment lists the potential effect of development on mercury levels and other contaminants as a study priority.

Quotes offered for this sentence:
- c008 — Interim Report, Regional Assessment in the Ring of Fire Area, 23 Feb 2026 (document 165314 / 164647E.pdf): "examining priorities for studies and workshops related to: fish and wildlife, including species at risk, with Lake Sturgeon and caribou as species of particular importance; and potential impact from development on mercury levels and other potential contaminants in water and fish, including learnings from nearby mines."

## Sentence 6

Sentence: A working group member from a partner First Nation, quoted in the interim report, recalled stories of people trying to make a living in the muskeg and said: "we lost all these skills when we moved into the reserve." Traditional foods are generally healthier than what remote community stores sell.

Quotes offered for this sentence:
- c011 — Interim Report, Regional Assessment in the Ring of Fire Area, 23 Feb 2026 (document 165314 / 164647E.pdf): "There are a lot of stories about people trying to make a living in the muskeg – fish farms, harvesting, livestock – but we lost all these skills when we moved into the reserve. […] RAWG member from partnered First Nation"
- c203 (already verified — context only, no verdict needed) — Joseph, C., D. Waugh and D. O’Gorman (Swift Creek Consulting), Cost-of-living in First Nations Communities in the Ring of Fire Region of Northern Ontario, report for the Regional Assessment Working Group, 2026 (registry 80468, reference 263): "Traditional foods are generally healthier than what can be found in stores in remote communities"

## Sentence 7

Sentence: The regional assessment's interim report records that some communities are exploring greenhouse projects and food distribution systems, and lists community-led studies on lake sturgeon.

Quotes offered for this sentence:
- c013 — Interim Report, Regional Assessment in the Ring of Fire Area, 23 Feb 2026 (document 165314 / 164647E.pdf): "As part of their revitalization efforts, some communities are exploring innovative solutions, such as greenhouse projects and food distribution systems, to restore access to groceries, traditional foods and strengthen food security."
- c014 — Interim Report, Regional Assessment in the Ring of Fire Area, 23 Feb 2026 (document 165314 / 164647E.pdf): "Community-led studies on Lake Sturgeon"

## Sentence 8

Sentence: Eagle's Nest is planned as an underground mine producing about 3,000 tonnes of ore a day on a surface footprint of about 100 hectares.

Quotes offered for this sentence:
- c016 — Registry 90033, Eagle's Nest Mine Project page: "construct, operate, decommission and abandon a multi-metal underground mine […] The project will produce approximately 3,000 tonnes of ore per day"
- c017 (already verified — context only, no verdict needed) — Registry 90033, Eagle's Nest Mine Project page: "surface footprint of approximately 100 hectares"

## Sentence 9

Sentence: Ontario lists the all-season road projects it is helping advance as including the Webequie Supply Road, the Marten Falls Community Access Road, the Northern Road Link and the Anaconda and Painter Lake roads, along with upgrades to Highways 584 and 643.

Quotes offered for this sentence:
- c019 — Ontario's Ring of Fire page, Government of Ontario: "In partnership with Indigenous communities, we’re helping advance all-season road projects, including: Webequie Supply Road Project Marten Falls Community Access Road Project Northern Road Link Project Anaconda and Painter Lake Roads upgrades to Highways 584/643 at the gateway to the Ring of Fire region (completed November 2024)"

## Sentence 10

Sentence: The provincial assessment rests on a voluntary agreement: Ontario's Environmental Assessment Act allows a proponent to enter a written agreement with the Minister to have the Act apply, and Webequie First Nation agreed to subject the road to a comprehensive assessment under it.

Quotes offered for this sentence:
- c021 — Webequie Supply Road Project page, Government of Ontario, s. 3.0.1 text: "Whereas section 3.0.1 of the Environmental Assessment Act states: A person, other than a person referred to in clause 3(a), who carries out, proposes to carry out or is the owner or person having charge, management or control of an enterprise or activity or a proposal, plan or program in respect of an enterprise or activity may enter into a written agreement with the Minister to have this Act apply to the enterprise, activity, proposal, plan or program."
- c247 — Draft Impact Assessment Report, Webequie Supply Road, April 2026 (166134E.pdf, 147 pp.), p. 19: "In addition to being subject to an impact assessment under the IAA, the proponent entered into a voluntary agreement with the Ontario Ministry of the Environment, Conservation and Parks (MECP) to subject the project to a comprehensive environmental assessment under Ontario’s Environmental Assessment Act."

## Sentence 11

Sentence: Chief Cornelius Wabasse of Webequie First Nation signed such an agreement on 3 May 2018.

Quotes offered for this sentence:
- c022 (already verified — context only, no verdict needed) — Webequie Supply Road Project page, Government of Ontario: "Cornelius Wabasse Chief Webequie First Nation Date: May 3, 2018"
- c023 — Webequie Supply Road Project page, Government of Ontario: "Whereas the Proponent has requested that the Environmental Assessment Act apply to the Undertaking, and Whereas this agreement is administrative in nature. The Minister and the Proponent therefore agree that the Environmental Assessment Act applies to the Undertaking."

## Sentence 12

Sentence: Neskantaga First Nation asked the federal government to designate the mine for assessment.

Quotes offered for this sentence:
- c031 — Analysis Report, Eagle's Nest designation request (document 165296 / p90033/165049E.pdf): "On October 29, 2025, the Minister of Environment, Climate Change and Nature (the Minister) received a request to designate the project from Neskantaga First Nation (the requester)."

## Sentence 13

Sentence: On 20 February 2026 the President of the Agency, exercising powers the Minister delegated on 5 December 2024, decided the project does not warrant designation.

Quotes offered for this sentence:
- c032 — Registry 90033, Eagle's Nest Mine Project page: "February 20, 2026 — The President … does not warrant designation"
- c094 — Analysis Report, Eagle's Nest designation request (document 165296 / p90033/165049E.pdf), fn 1: "On December 5, 2024, the Minister of Environment delegated the powers under section 9 of the Impact Assessment Act related to designation requests to the President of IAAC."

## Sentence 14

Sentence: In its request that the Eagle's Nest mine be designated for federal assessment, Neskantaga First Nation raised adverse effects on the Muketei River and ultimately the Attawapiskat River through changes in water quality; the Agency places the mine in the Muketei River watershed.

Quotes offered for this sentence:
- c033 — Analysis Report, Eagle's Nest designation request (document 165296 / p90033/165049E.pdf): "a request to designate the project from Neskantaga First Nation (the requester) […] The requester expressed concerns that the project will result in adverse effects to fish and fish habitat, including: […] adverse effects to the Muketei River and ultimately the Attawaspiskat River, through changes in water quality including release of waste, effluents and sediments; […] Given the project’s location in the […] Muketei River watershed, which is highly sensitive to water level fluctuations"

## Sentence 15

Sentence: Nibinamik First Nation, in a letter of 22 May 2026, continues to support Webequie's desire to build an all-season road, has serious concerns with how Ontario and Canada have run the process, and is unable to give its free, prior and informed consent to the projects.

Quotes offered for this sentence:
- c035 (already verified — context only, no verdict needed) — Nibinamik First Nation, letter to Ontario and the Agency, 22 May 2026: "Nibinamik continues to support Webequie First Nation's … desire to build an all-season road"
- c036 — Nibinamik First Nation, letter to Ontario and the Agency, 22 May 2026: "Nibinamik has serious concerns with Ontario’s and Canada’s […] efforts to expedite the assessment and construction of the WSR, as well as the Marten Falls First Nation Community Access Road (“MFCAR”) and the Northern Road Link (“NRL”, or together the “Roads”); the inadequacy of the assessment of the Roads’ potential impacts on the environment and on our Aboriginal and treaty rights and interests;"
- c037 (already verified — context only, no verdict needed) — Nibinamik First Nation, letter to Ontario and the Agency, 22 May 2026: "unable to provide our free, prior, and informed consent to these projects"
- c233 (already verified — context only, no verdict needed) — Nibinamik First Nation, letter to Ontario and the Agency, 22 May 2026, p. 1: "May 22, 2026 VIA EMAIL"

## Sentence 16

Sentence: Constance Lake First Nation remains broadly supportive of Webequie's wish to develop the road, and states that its review of the draft conditions identified concerns the proponent has not addressed.

Quotes offered for this sentence:
- c042 — Constance Lake First Nation, comments on draft conditions, 22 May 2026: "Constance Lake First Nation (CLFN) […] CLFN remains broadly supportive of WFN’s desire to develop the WSR as a means of providing year-round access to their reserve community. However, through our review of the draft IA conditions we have identified a number of issues where we raised concerns that have not been addressed by the Proponent."

## Sentence 17

Sentence: Fort Albany First Nation endorsed and adopted Attawapiskat's comments.

Quotes offered for this sentence:
- c044 — Fort Albany First Nation, submission, May 2026: "We have received the comments submitted by Attawapiskat First Nation on May 21, 2026. We share their serious concerns about the deficiencies in the process and substance of this environmental assessment and the Ministry’s review, and we endorse and adopt their comments in supplement to those in this letter."

## Sentence 18

Sentence: It said it was unable to properly review all the materials, including more than 700 pages of additional addenda, that the comment period overlapped with its spring goose hunt, and that most of its members were evacuated at the time.

Quotes offered for this sentence:
- c045 (already verified — context only, no verdict needed) — Fort Albany First Nation, submission, May 2026: "unable to properly review all of the materials, including all of the 700+ pages in additional addenda"
- c046 — Fort Albany First Nation, submission, May 2026: "The short comment period overlapped with our spring goose hunt."
- c047 (already verified — context only, no verdict needed) — Fort Albany First Nation, submission, May 2026: "Most of our members are currently evacuated"

## Sentence 19

Sentence: Nine First Nations and one council commented on the final provincial assessment: Aroland, Attawapiskat, Constance Lake, Eabametoong, Fort Albany, Kashechewan, Marten Falls, Nibinamik and Weenusk First Nations, and Mushkegowuk Council.

Quotes offered for this sentence:
- c048 — Ministry Review of the Webequie Supply Road Environmental Assessment, 17 Apr 2026 (updated 20 Apr): "Nine Indigenous communities and a Indigenous Council submitted comments on the final EA : Aroland First Nation, Attawapiskat First Nation, Constance Lake First Nation, Eabametoong First Nation, Fort Albany First Nation, Kashechewan First Nation, Marten Falls First Nation, Nibinamik First Nation, Weenusk First Nation, and Mushkegowuk Council."

## Sentence 20

Sentence: Ontario's ministry review lists 22 Indigenous communities that Webequie First Nation consulted: 16 on a rights basis, Webequie itself among them, and six on an interest basis.

Quotes offered for this sentence:
- c049 — Ministry Review of the Webequie Supply Road Environmental Assessment, 17 Apr 2026 (updated 20 Apr): "WFN consulted with the following Indigenous communities on a rights basis: Aroland First Nation Attawapiskat First Nation Constance Lake First Nation Fort Albany First Nation Kasabonika Lake First Nation Kashechewan First Nation Kingfisher Lake First Nation Kitchenuhmaykoosib Inninuwug (KI) Marten Falls First Nation Neskantaga First Nation Nibinamik First Nation Wapekeka First Nation Wawakapewin First Nation Weenusk First Nation WFN Wunnumin Lake First Nation Also consistent with the MOU , WFN consulted with the following Indigenous communities on an interest basis: Eabametoong First Nation Ginoogaming First Nation Long Lake #58 First Nation Métis Nation of Ontario Region 2 Mishkeegogamang First Nation North Caribou Lake First Nation"

## Sentence 21

Sentence: Two of those amendments require the proponent to consider other cumulative-effects assessments and the regional assessment.

Quotes offered for this sentence:
- c051 — Webequie Supply Road Project page, Government of Ontario: "1.2 Consideration of other cumulative effects assessments As part of the development of its EA , WFN will consider, where appropriate, any publicly available information that may be generated through the following which WFN considers relevant: any cumulative effects assessment developed as part of any EA in respect of the proposed Marten Falls Community Access Road; and any cumulative effects assessment developed as part of any EA in respect of the proposed Northern Road Link."
- c052 — Webequie Supply Road Project page, Government of Ontario: "1.3 Consideration of Regional Assessment If there is an ongoing or completed Regional Assessment for the Ring of Fire area, as part of the development of its EA WFN will consider, where appropriate, any publicly available information that may be generated through that process which WFN considers relevant."

## Sentence 22

Sentence: Each ends with the statement that this will not delay submission of the final environmental assessment, and the proponent determines how to use the information.

Quotes offered for this sentence:
- c053 — Webequie Supply Road Project page, Government of Ontario: "If information described in this section is not available at the time WFN is prepared to submit its final EA to the Ministry of the Environment, Conservation and Parks ( MECP ), this will not delay the submission of the final EA . 1.3 Consideration of Regional Assessment […] If information described in this section is not available at the time WFN is prepared to submit its final EA to MECP , this will not delay the submission of the final EA . 1.4 Cumulative effects consultation report"
- c054 (already verified — context only, no verdict needed) — Webequie Supply Road Project page, Government of Ontario: "WFN will determine how to use any information described in this section"

## Sentence 23

Sentence: In January 2023, fifteen First Nations and the Impact Assessment Agency agreed to co-lead a regional assessment in the Ring of Fire area, the first co-led with First Nations under the Impact Assessment Act.

Quotes offered for this sentence:
- c055 — Interim Report, Regional Assessment in the Ring of Fire Area, 23 Feb 2026 (document 165314 / 164647E.pdf): "In January 2023, leaders and members from 15 Footnote 1 First Nations from Matawa and Mushkegowuk territories and Weenusk First Nation met with the federal Minister of the Environment and Climate Change along with representatives of the Impact Assessment Agency of Canada (IAAC). They agreed to establish a Working Group (the Regional Assessment Working Group or "RAWG") and to begin a co-led process for a regional assessment in the area commonly referred to as the Ring of Fire."
- c056 (already verified — context only, no verdict needed) — Interim Report, Regional Assessment in the Ring of Fire Area, 23 Feb 2026 (document 165314 / 164647E.pdf): "first ever regional assessment co-led with First Nations under the Impact Assessment Act"

## Sentence 24

Sentence: The terms of reference were finalised in January 2025; they provide that any other jurisdiction may ask in writing to become a party, and they list the province of Ontario as "TBD".

Quotes offered for this sentence:
- c059 — Interim Report, Regional Assessment in the Ring of Fire Area, 23 Feb 2026 (document 165314 / 164647E.pdf): "Guided by the Terms of Reference (finalized in January 2025), the Regional Assessment process will serve to achieve several objectives"
- c060 (already verified — context only, no verdict needed) — Terms of Reference, Regional Assessment (document 161197), incl. Annex 1 timeline and Minister's letter 15 Feb 2023: "Any request by another jurisdiction to be party to these Terms of Reference will be a written request"
- c061 (already verified — context only, no verdict needed) — Terms of Reference, Regional Assessment (document 161197), incl. Annex 1 timeline and Minister's letter 15 Feb 2023: "the province of Ontario (TBD)"

## Sentence 25

Sentence: Ontario stated that it would not delay its decision on the road until the regional assessment is complete, and the Agency confirmed that the regional assessment creates no obligation on Ontario and does not affect project timelines.

Quotes offered for this sentence:
- c062 (already verified — context only, no verdict needed) — Ministry Review of the Webequie Supply Road Environmental Assessment, 17 Apr 2026 (updated 20 Apr): "Ontario will not be delaying decision-making on the proposed WSR until the regional assessment is complete."
- c063 — Ministry Review of the Webequie Supply Road Environmental Assessment, 17 Apr 2026 (updated 20 Apr): "The Impact Assessment Agency of Canada has confirmed with Ontario that the ongoing federal regional assessment will not impact timelines for individual project assessments nor create any obligations on Ontario."

## Sentence 26

Sentence: Ontario's review noted that the final assessment had been submitted while the regional assessment information was not available.

Quotes offered for this sentence:
- c064 — Ministry Review of the Webequie Supply Road Environmental Assessment, 17 Apr 2026 (updated 20 Apr): "However, the notice of approval also stated that if the information is not available when WFN submits its final EA to the ministry, a delay of the submission of the final EA is not required. […] The final EA for the WSR was submitted and the regional assessment information is not currently available."

## Sentence 27

Sentence: It states that funding and capacity gaps in healthcare, especially mental health, need to be addressed urgently, before any additional development can be considered, and that comprehensive baseline monitoring must start immediately and before any development occurs.

Quotes offered for this sentence:
- c065 — Interim Report, Regional Assessment in the Ring of Fire Area, 23 Feb 2026 (document 165314 / 164647E.pdf): "Funding and capacity gaps in healthcare (especially mental health) need to be addressed urgently, before any additional development can be considered."
- c066 — Interim Report, Regional Assessment in the Ring of Fire Area, 23 Feb 2026 (document 165314 / 164647E.pdf): "Comprehensive baseline monitoring must be community-driven and started immediately, and before any development occurs, as climate change is already creating extreme shifts in conditions."

## Sentence 28

Sentence: The Ontario Rivers Alliance described it as having no binding authority over project approvals, and argued that the refusal to designate Eagle's Nest sets a precedent that undermines the regional assessment before it is complete.

Quotes offered for this sentence:
- c069 (already verified — context only, no verdict needed) — Ontario Rivers Alliance, submission, 14 Apr 2026: "it has no binding authority over project approvals"
- c070 — Ontario Rivers Alliance, submission, 14 Apr 2026: "The recent federal decision to decline to designate the Eagle’s Nest Mine […] By determining that the project’s impacts could be addressed through “other means,” the federal government has effectively deferred oversight to provinc ial processes that are widely recognized as missing in action (“Priority Project” status) , particularly with respect to cumulative effects, climate risk, and Indigenous rights. This decision establishes a precedent that undermines the Regional Assessment before it is complete, signal ling that project approvals may proceed irrespective of regional findings."

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
