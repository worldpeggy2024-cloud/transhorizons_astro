# Claim verification — ring-of-fire — part 1 of 3 (33 quotes in 28 sentences)

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
