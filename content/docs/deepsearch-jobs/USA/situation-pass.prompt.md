# Situation Pass (USA) — the verified event layer

Country: United States (États-Unis)
Date: 2026-07-19

## Input — the finished report (attached)

You are given ONE attachment: the finished country report as a YAML file (content/countries/USA/analysis.yaml). No other project context is assumed; everything you need is in this prompt and that file.

- The report's keys are flat: <section>_<subsection>_<language>, e.g. security_diplomacy_en. Its SIX "PEER SECTIONS" — the standing-condition body this pass extends — are the territory_*, society_*, economy_*, political_*, capacity_*, and security_* field families (each field in _en and _fr). Work from the _en fields as primary; the _fr fields carry the same content in French.
- The report's SOURCE REGISTRY is the `sources` key: a JSON array of source objects, each with an `id`. Every [source-id] citation marker in the report resolves to an entry there. Situation events cite ids from this registry wherever it already holds the right source; a source that is genuinely NOT in the registry goes in the newSources output, never inline-invented.
- The `situation_en` and `situation_fr` keys in the file are EMPTY — this pass is what writes them.
- In the peerCorrections output, `field` uses the dot form of a peer field: e.g. "economy.externalVulnerability" refers to the economy_externalVulnerability_en/_fr keys.
- "Pass Zero-B" is a prior automated lookup pass that scanned the last 12 months for major events; its PROPOSED events are listed near the end of this prompt.

This pass populates the situation field AFTER the peer sections exist. It is verification-heavy by design: it holds recent, fast-moving, contested events — exactly the material most likely to be stale or wrong, and least likely to have a settled primary source. The Pass Zero-B list below is a STARTING LIST TO VERIFY, never content. Research tools can propose events; they cannot be trusted to date them, bound them, or decide what they changed. EVERY event must be verified against an openable primary or authoritative source ON THE RUN DATE before it enters the field.

PURPOSE: The six peer sections describe standing conditions. They have no place to hold discrete events that materially changed the country's position — a war, a tariff regime, a rupture. Without this field, such events vanish from the report entirely even when they dominate the country's situation. This field holds them.

STRUCTURE — threads, not a flat list:
- The field contains THREADS. Each thread is a named strand of related events (e.g. "Trade rupture with the United States", "Defence commitment").
- Threads are ordered by RECENCY OF LAST ACTIVITY — the thread that moved most recently comes first.
- Within a thread, events run CHRONOLOGICALLY FORWARD (oldest first). Non-negotiable: a causal chain told in reverse is unreadable.
- Each thread may carry an optional current-state line at the end, summarising where the thread stands now.

EACH EVENT:
- date — the date (or date range) the event occurred, leading.
- what — what happened: one sentence, factual, no characterisation.
- changed — what it materially changed: the consequence. If you cannot state a material change without editorialising, the event does not belong in this field.

CONTENT RULES:
- Maximum 8 events total across all threads (the United States report may carry more).
- Only events that materially changed the country's position. Not notable news.
- Exclude anything already covered structurally elsewhere — seat composition, budget measures, standing policy, demographic trends. Those belong to their peer sections. This field is for events with no natural home in a description of standing conditions.
- No explanation by character or motive. State what changed, not why anyone did it.
- Every event carries a source citation [source-id], same as any other field.
- Where an event supersedes or contradicts a claim in a peer section, the PEER SECTION must be corrected — this field does not exist to hold contradictions, it exists to surface them. List any such corrections in "peerCorrections".

DISCIPLINES (same as the main passes): acronyms spelled out at first mention, no exceptions; source titles in the source's own language(s), never translated; source desc states what the source IS (roughly 20-30 words), never the specific numbers or claims; EN and FR carry the same facts and cite the same IDs.

## Events proposed by Pass Zero-B (a starting list to VERIFY — never content)

- [obbba-signed] 2025-07-04 — One Big Beautiful Bill Act signed into law: President Trump signed H.R.1, the One Big Beautiful Bill Act, a reconciliation bill making major changes to tax policy, federal spending, and the statutory debt limit. PROPOSED SOURCE: Congress.gov, H.R.1 - 119th Congress https://www.congress.gov/bill/119th-congress/house-bill/1
- [shutdown-2025-fy2026] 2025-10-01 — FY2026 federal government shutdown begins: A funding gap began on October 1, 2025, at the start of fiscal year 2026, shutting down large portions of the federal government amid an appropriations impasse. PROPOSED SOURCE: Congressional Research Service, R48832 https://www.congress.gov/crs-product/R48832
- [shutdown-2026-first] 2026-01-31 — First 2026 government shutdown: A four-day partial federal shutdown occurred from January 31 to February 3, 2026, after the Senate and House failed to pass a funding package on schedule, following the killing of Alex Pretti by CBP agents which caused Senate Democrats to withdraw support for the DHS funding bill. PROPOSED SOURCE: Congressional Research Service / Congress.gov shutdown tracking https://www.congress.gov/crs-product/R48832
- [shutdown-2026-second-dhs] 2026-02-14 — Second 2026 shutdown (DHS), longest in US history: A partial shutdown limited to the Department of Homeland Security began February 14, 2026 amid a stalemate over federal immigration enforcement reform proposals, lasting 76 days until April 30, 2026, becoming the longest shutdown in US history on March 29. PROPOSED SOURCE: Congressional Research Service, R48832 https://www.congress.gov/crs-product/R48832
- [venezuela-maduro-capture] 2026-01-03 — US military operation captures Venezuelan President Maduro: The US military conducted 'Operation Absolute Resolve,' a joint special-operations raid on Nicolás Maduro's fortified residence in Caracas, capturing Maduro and his wife Cilia Flores de Maduro and transporting them to the US to face narcoterrorism and drug-trafficking charges. PROPOSED SOURCE: US Department of War (war.gov) news release https://www.war.gov/News/News-Stories/Article/Article/4370431/trump-announces-us-militarys-capture-of-maduro/
- [iran-operation-epic-fury] 2026-02-28 — US launches military operations against Iran: President Trump announced the US military began major combat operations against Iran, targeting ballistic missile facilities, nuclear infrastructure, and naval assets, in coordination with Israel. PROPOSED SOURCE: The White House, Remarks by President Trump on Iran (via Miller Center archive of official transcript) https://millercenter.org/the-presidency/presidential-speeches/february-28-2026-remarks-us-military-operations-against-iran
- [iran-ceasefire-april2026] 2026-04-07 — US-Iran two-week ceasefire announced: President Trump announced he agreed to a two-week pause in bombing and military action against Iran, reportedly including reopening of the Strait of Hormuz, after issuing an ultimatum for a diplomatic deal. PROPOSED SOURCE: White House statement relayed via press secretary Karoline Leavitt (reported by Euronews, citing official statement) https://www.euronews.com/2026/04/07/only-the-president-knows-what-he-will-do-on-iran-white-house-says-in-statement
- [alex-pretti-killing] 2026-01-24 — Killing of Alex Pretti by CBP agents: US Customs and Border Protection (CBP) agents killed Alex Pretti, an event that directly triggered Senate Democrats to withdraw support for DHS appropriations and precipitated both 2026 shutdowns. PROPOSED SOURCE: Congressional Research Service shutdown background (R48832) citing timeline of events https://www.congress.gov/crs-product/R48832
- [national-defense-strategy-2026] 2026-01-22 — 2026 National Defense Strategy released: The US Department of Defense published its 2026 National Defense Strategy, emphasizing guaranteed US access to key terrain including the Panama Canal, Gulf of America (renamed Gulf of Mexico), and Greenland. PROPOSED SOURCE: US Department of Defense (media.defense.gov), 2026 National Defense Strategy https://media.defense.gov/2026/Jan/23/2003864773/-1/-1/0/2026-national-defense-strategy.pdf
- [fy2026-appropriations-act] 2026-02-03 — Consolidated Appropriations Act, 2026 signed: President Trump signed H.R. 7148, the Consolidated Appropriations Act, 2026, ending the first 2026 shutdown by funding federal agencies through fiscal year 2026. PROPOSED SOURCE: The White House, official bill-signing announcement https://www.whitehouse.gov/briefings-statements/2026/02/congressional-bill-h-r-7148-signed-into-law/
- [senate-pay-withholding-resolution] 2026-05-14 — Senate passes resolution withholding pay during shutdowns: Following the two 2026 shutdowns, the US Senate unanimously passed a resolution to withhold senators' pay during future government shutdowns. PROPOSED SOURCE: US Senate action reported via CRS/legislative tracking (primary Senate record pending direct citation) https://www.congress.gov/crs-product/R48832

Return ONLY a JSON object:
{
  "situation": {
    "en": [ { "thread": "…", "events": [ { "date": "…", "what": "… [source-id]", "changed": "… [source-id]" } ], "currentState": "… [source-id] (optional)" } ],
    "fr": [ the same threads, in French ]
  },
  "newSources": [ any sources cited above that are not already in the report's registry — all fields: id, name, nameFr, url, desc, descFr, publicationDate (omit if undated), accessDate, confidence, citationType ],
  "peerCorrections": [ { "field": "e.g. economy.externalVulnerability", "correction": "what the peer section must now say and why" } ]
}

## Run notes for THIS pass (USA, 2026-07-19) — resolve explicitly, do not skip

1. THREE EVENTS ARE STATUS UNRESOLVED and must be resolved or dropped, never carried as-is:
   - iran-ceasefire-april2026 — currently sourced to a Euronews article (a news outlet; fails the primary rule). Find the actual White House / press-secretary statement, or drop the event. See also note 2.
   - alex-pretti-killing — the CRS shutdown report documents the SHUTDOWNS, not the killing itself. A primary or authoritative source for the killing is required (e.g. CBP statement, DHS OIG, court record), or the event is folded into the shutdown thread as context without its own entry.
   - senate-pay-withholding-resolution — needs the Senate record itself: the S.Res. number and the vote, cited to senate.gov or the Congressional Record.
2. CONTRADICTION TO RECONCILE: the event scan says a two-week ceasefire was announced 7 April 2026; the report's security.diplomacy field, reading the SAME Euronews source, found active hostilities and an ultimatum with NO ceasefire in effect. Verify which is true on the run date. If the diplomacy field is right, the ceasefire event is corrected or dropped; if the event is right, security.diplomacy goes in peerCorrections.
3. WINDOW CALL: obbba-signed (2025-07-04) falls ~2 weeks OUTSIDE the 12-month window from the run date. It is load-bearing context for the shutdown thread (its ICE/CBP funding pool). KEEP it as the thread's opening event or DROP it — but say which, explicitly, in a note after the JSON.
4. SOURCE CONCENTRATION: five shutdown-cluster events currently hang on the single CRS report R48832. Where the thread's events can each cite their own primary (the appropriations acts, the TSA payroll executive order), prefer that; R48832 remains valid as the timeline backbone.
5. The report's registry already contains every event source plus the Pass A top-up (70 ids) — cite existing ids where they serve; put genuinely new sources in newSources with ALL schema fields including volatility.
