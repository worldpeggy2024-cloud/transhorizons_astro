# Pass A top-up 3 (USA) — named allies + named non-state actors

Run date: 2026-07-19 · Tool: Perplexity (standing split — Pass A/top-ups). Return ONLY a JSON array of source objects.

Two gaps surfaced by the actors extraction pass (2026-07-19); both are Pass A/B sourcing gaps, not extraction errors:

1. **The alliance network has no names.** `security.diplomacy` asserts the United States "anchors a global alliance network" but names no ally and no alliance; NATO appears in the whole report only as a summit venue. Harvest sources that let the field name and cite the network:
   - The North Atlantic Treaty and current NATO membership (nato.int primary; the treaty text and the current member list).
   - The bilateral mutual-defence treaty system: Japan, South Korea, the Philippines, Australia (ANZUS) — treaty texts or the State Department's collective defense arrangements page.
   - Major non-NATO ally designations (statute or State Department listing).
   - Basing/presence: an authoritative current source for United States overseas basing or troop presence by host country (Department of Defense, Congressional Research Service).
   - AUKUS and the Quad — primary or Congressional Research Service.

2. **The report names zero private-sector, labour, or civil-society actors.** Data centres, artificial intelligence, offshore wind, mining, and the defence industrial base all appear as sectors with no named producer; the press appears only as a generic collective. For a political economy the report itself calls market-led, harvest sources that name the load-bearing entities:
   - Market concentration / largest firms: an authoritative source naming the largest United States companies by market capitalisation or revenue (e.g. Fortune 500 current list, Securities and Exchange Commission filings aggregate, Federal Reserve flow-of-funds context).
   - The AI/data-centre buildout: a primary or authoritative source naming the principal investing firms and the scale (company capital-expenditure disclosures, Energy Information Administration data-centre electricity analysis, Congressional Research Service).
   - Defence industrial base: the principal prime contractors by Department of Defense obligations (a primary contracting source or Congressional Research Service).
   - Organised labour: union membership and the largest federations/unions (Bureau of Labor Statistics union members release; the federations named).
   - Civil society / press institutions IF a policy-weight source exists (e.g. litigation actors in the 2026 cases the report already cites — Learning Resources, Inc. itself is a named private litigant).

RULES (unchanged from Pass A): every url is a DEEP LINK that opens the named content directly — a homepage is disqualified unless flagged `landingPage: true` with the reason in desc; primary/official sources preferred, named scorers admissible with bias named; desc is 20–30 words on what the source IS, never its data; titles in the source's own language, never translated.

Schema per source (ALL fields): id (kebab-case), name, nameFr, url, desc, descFr, publicationDate (omit only if genuinely undated), accessDate, confidence (High|Med|Low), citationType (Fact|Interpretation), volatility (High|Med|Low).

Target: 8–14 sources total across the two gaps. These feed single-field rewrites of security.diplomacy and economy.politicalEconomy (possibly society.cohesion for labour/civil society) BEFORE the derivatives pass runs.
