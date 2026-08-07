# Situation Pass (USA) — the verified event layer

Country: United States (États-Unis)
Date: 2026-08-06

## Input — the finished report (attached)

You are given ONE attachment: the finished country report as a YAML file (content/countries/USA/analysis.yaml). No other project context is assumed; everything you need is in this prompt and that file.

- The report's keys are flat: <section>_<subsection>_<language>, e.g. security_diplomacy_en. Its SIX "PEER SECTIONS" — the standing-condition body this pass extends — are the territory_*, society_*, economy_*, political_*, capacity_*, and security_* field families (each field in _en and _fr). Work from the _en fields as primary; the _fr fields carry the same content in French.
- The report's SOURCE REGISTRY is the `sources` key: a JSON array of source objects, each with an `id`. Every [source-id] citation marker in the report resolves to an entry there. Situation events cite ids from this registry wherever it already holds the right source; a source that is genuinely NOT in the registry goes in the newSources output, never inline-invented.
- The `situation_en` and `situation_fr` keys in the file are EMPTY — this pass is what writes them.
- In the peerCorrections output, `field` uses the dot form of a peer field: e.g. "economy.externalVulnerability" refers to the economy_externalVulnerability_en/_fr keys.
- "Pass Zero-B" is a prior automated lookup pass that scanned the last 12 months for major events; its verified events — merged with the report-supplement — are in the ATTACHED file `situation-pass.candidate-events.MERGED.md` (a starting list to VERIFY, never content).

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
- EVERY event proposed by Pass Zero-B gets a recorded verdict in "passNotes": kept, folded (carried as context inside another event or thread, not as its own entry), or dropped — with the test a non-kept event failed and the decisive evidence. The scan is automated and has no memory: a decision recorded only in a chat transcript is a decision the next run re-litigates from zero.

DISCIPLINES (same as the main passes): acronyms spelled out at first mention, no exceptions; source titles in the source's own language(s), never translated; source desc states what the source IS (roughly 20-30 words), never the specific numbers or claims; EN and FR carry the same facts and cite the same IDs.

## Candidate events — see the ATTACHED `situation-pass.candidate-events.MERGED.md`

The candidate events are NOT inlined here — they are in the attached `situation-pass.candidate-events.MERGED.md`: 46 candidates (43 fetch-verified events from the 2026-08-04 blind Pass Zero-B scan + 3 report-supplement events the scan missed), grouped into candidate threads with registry-overlap tags (`REG:`/`SRC:`), fold/drop guidance, and an UNRESOLVED list. Treat it exactly as the CONTENT RULES above require — a starting list to VERIFY on the run date, never content. Cite an existing registry id where an entry is marked `REG:`; emit `newSources` only for genuinely new ones; honour its fold/drop notes; and record a passNotes verdict for every candidate id.

Return ONLY a JSON object:
{
  "situation": {
    "en": [ { "thread": "…", "events": [ { "date": "…", "what": "… [source-id]", "changed": "… [source-id]" } ], "currentState": "… [source-id] (optional)" } ],
    "fr": [ the same threads, in French ]
  },
  "newSources": [ any sources cited above that are not already in the report's registry — all fields: id, name, nameFr, url, desc, descFr, publicationDate (omit if undated), accessDate, confidence, citationType ],
  "peerCorrections": [ { "field": "e.g. economy.externalVulnerability", "correction": "what the peer section must now say and why" } ],
  "passNotes": {
    "runDate": "the run date (YYYY-MM-DD)",
    "events": [ ONE entry per Pass Zero-B event id, no omissions: { "id": "the scanned event id", "verdict": "kept | folded | dropped", "test": "for folded/dropped: the rule it failed and the decisive evidence, one or two sentences" } ],
    "notes": "run-note resolutions and anything the NEXT run must see: window calls, sources to retire or rename, could-not-verify items"
  }
}

## Run notes for THIS pass (USA, 2026-08-06) — resolve explicitly, do not skip

1. UNRESOLVED items (flagged in the MERGED file) need a primary located on the run date or they stay OUT — never fabricate: no-kings-mass-protests-october-2025, immigration-enforcement-general-strike, super-typhoon-bavi-marianas, senate-pay-withholding-resolution.
2. WINDOW CALL: obbba-signed (2025-07-04) falls ~5 weeks OUTSIDE the 12-month window but is load-bearing shutdown-cluster context. KEEP it as the cluster's opening event or DROP it — say which, explicitly, in passNotes.
3. R48832 supports the shutdown DURATION (43 days, 1 Oct–12 Nov 2025) but NOT the "longest full-government shutdown on record" characterisation — that superlative needs its own source or it does not enter the field.
4. CURATE HARD: 46 candidates, MAX 8 events across all threads. Structural/standing items (the SCOTUS rulings, standing-policy executive orders, budget measures) belong in peer sections, not here — the MERGED file marks the likely folds. Every event that overrides a peer claim goes in peerCorrections; the peer body carried only ~15 of these, so expect a substantial peerCorrections list.
5. The report registry now holds ~174 sources; cite existing ids where the MERGED file marks REG:, and put genuinely new event sources in newSources with ALL schema fields including volatility.
