# Pass Zero-B Prompt (event scan) — United States

This is a LOOKUP PASS, NOT AN ANALYSIS PASS. You are not writing a report and not
reasoning about the country. You are answering one question so a later pass can source
what you find.

ONE QUESTION: what has materially happened in and to United States in the last 12 months that a
well-informed reader would consider major? Consider — wars and military operations; coups and
constitutional crises; disasters (natural or industrial); currency or banking crises;
assassinations and leadership deaths; mass mobilisations; major legislation.

Return ONLY a JSON array of events. No prose, no commentary, no explanation.

HARD RULES
- LOOKUP, not analysis. Report what happened; do not interpret, weigh, or forecast.
- Every event needs a DATE and an openable PRIMARY or authoritative source: a government
  statement, the legislature's own research service or parliamentary library, a court ruling,
  or an official gazette. NOT a news aggregator, not a blog, not an encyclopedia.
- You are PERMITTED AND REQUIRED to answer UNRESOLVED. If nothing material happened, return an
  empty array: []. If an event is real but you cannot establish it from a primary source, set
  its status to "UNRESOLVED" and say why in whatHappened. An honest gap is a CORRECT output.
- Do not translate institution, statute, or operation names; capture them as published.
- Acronyms: spell in full on first mention, abbreviation in parentheses, short form thereafter.

SCHEMA (one object per event)
[
  {
    "id": "short-slug (lowercase-hyphens; Pass A harvests its source and Pass B cites it by this id)",
    "date": "YYYY-MM-DD",
    "title": "",
    "whatHappened": "",
    "whatItChanged": "",
    "sourceName": "",
    "sourceUrl": "",
    "status": "ongoing | concluded | UNRESOLVED"
  }
]
