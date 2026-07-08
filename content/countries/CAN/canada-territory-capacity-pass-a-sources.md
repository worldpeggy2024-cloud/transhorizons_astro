# Canada — Targeted Pass A: Territory / Capacity / Constitutional Substrate
**18 new sources for approval** (to append to `pass-a.sources.json`) + 4 already-approved sources reused (no new entries needed).
All URLs verified via search July 8, 2026. Dateless entries omit publicationDate per schema rule.

## Reused from the approved 35 (cite in new fields, no addition needed)
- `imf-can-2025-art4` → capacity.productivity (productivity as the central medium-term challenge; interprovincial reform)
- `budget-2025-canada-strong` → capacity.delivery (productivity super-deduction; infrastructure agenda)
- `statcan-pop-quarterly` / `statcan-2021-indigenous-profile` → geography + constitutional context

## New sources (JSON, ready to append)

```json
[
  {
    "id": "usgs-mcs-2026",
    "name": "U.S. Geological Survey – Mineral Commodity Summaries 2026",
    "url": "https://pubs.usgs.gov/publication/mcs2026",
    "desc": "Annual USGS compendium of world production, reserves, and resources for 90+ mineral commodities (2025 data), the standard estimating body for reserve figures including Canada's.",
    "publicationDate": "2026-02-06",
    "accessDate": "2026-07-08",
    "confidence": "High",
    "citationType": "Fact"
  },
  {
    "id": "nrcan-critical-minerals-list",
    "name": "Government of Canada – Critical Minerals: An Opportunity for Canada",
    "url": "https://www.canada.ca/en/campaign/critical-minerals-in-canada/critical-minerals-an-opportunity-for-canada.html",
    "desc": "Official page for Canada's Critical Minerals List: 34 minerals, first released 2021, updated 2024 (adding high-purity iron ore, phosphorus, silicon metal); value-chain framing and project locations in every province/territory except PEI.",
    "accessDate": "2026-07-08",
    "confidence": "High",
    "citationType": "Fact"
  },
  {
    "id": "nrcan-cm-strategy-annual-2024",
    "name": "Natural Resources Canada – Canadian Critical Minerals Strategy Annual Report 2024",
    "url": "https://www.canada.ca/en/campaign/critical-minerals-in-canada/canadas-critical-minerals-strategy/canadian-critical-minerals-strategy-annual-report-2024.html",
    "desc": "Official annual report: Canada ranks among top 5 producers of 10 critical minerals (potash, niobium, uranium, palladium, tellurium, indium, aluminum, platinum, titanium, nickel); $1.9B critical-mineral exploration spending in 2023; permitting-improvement initiatives.",
    "publicationDate": "2024-12-01",
    "accessDate": "2026-07-08",
    "confidence": "High",
    "citationType": "Fact"
  },
  {
    "id": "cccr-2019-headline",
    "name": "Canada's Changing Climate Report – Headline Statements (Government of Canada national assessment)",
    "url": "https://changingclimate.ca/CCCR2019/chapter/headline-statements/",
    "desc": "The national climate-science assessment's headline findings: Canada warms on average about double the global rate and northern Canada more than double; mean temperature rose ~1.7°C over 1948–2016; warming is effectively irreversible and scale depends on emissions pathway.",
    "publicationDate": "2019-04-02",
    "accessDate": "2026-07-08",
    "confidence": "High",
    "citationType": "Fact"
  },
  {
    "id": "eccc-temperature-indicator",
    "name": "Environment and Climate Change Canada – Temperature Change in Canada (CESI indicator)",
    "url": "https://www.canada.ca/en/environment-climate-change/services/environmental-indicators/temperature-change.html",
    "desc": "Live official indicator: 2024 tied 2010 as Canada's warmest year on record at 3.1°C above the 1961–1990 reference; 7 of the 10 warmest years in the last 20; Canadian warming roughly twice the global average rate.",
    "accessDate": "2026-07-08",
    "confidence": "High",
    "citationType": "Fact"
  },
  {
    "id": "eccc-nir-2026-summary",
    "name": "Environment and Climate Change Canada – Greenhouse Gas Sources and Sinks in Canada: Executive Summary 2026 (National Inventory Report 1990–2024)",
    "url": "https://www.canada.ca/en/environment-climate-change/services/climate-change/greenhouse-gas-emissions/sources-sinks-executive-summary-2026.html",
    "desc": "Official UNFCCC inventory: 2024 emissions 685 Mt CO2e excl. LULUCF, −10% from 2005 and −0.3% from 2023; oil and gas 208 Mt (peaked 2014 at 230 Mt); electricity −57% since 2005; methane at lowest recorded level; 2035 NDC of 45–50% below 2005.",
    "publicationDate": "2026-04-14",
    "accessDate": "2026-07-08",
    "confidence": "High",
    "citationType": "Fact"
  },
  {
    "id": "eccc-ghg-2024-overview",
    "name": "Environment and Climate Change Canada – Where Canada's Greenhouse Gas Emissions Come From: 2024 National Inventory",
    "url": "https://www.canada.ca/en/environment-climate-change/news/2024/05/where-canadas-greenhouse-gas-emissions-come-from-2024-national-greenhouse-gas-inventory.html",
    "desc": "Official explainer of the 2024 inventory revisions: with updated historical harvest data, the managed forest / land sector's net balance is a net SOURCE of emissions in all years of the time series (LULUCF net source of 51 Mt in 2022); per-capita emissions fell from 24 t (2005) to 18 t.",
    "publicationDate": "2024-05-02",
    "accessDate": "2026-07-08",
    "confidence": "High",
    "citationType": "Fact"
  },
  {
    "id": "cat-canada-2026",
    "name": "Climate Action Tracker – Canada country assessment",
    "url": "https://climateactiontracker.org/countries/canada/",
    "desc": "Independent pledge-vs-policy rating (PRIMARY instrument per template §6): Canada's policies and action rated 'Highly Insufficient'; 2030 emissions projected 645–647 Mt (≈15% below 2005) vs the 426–484 Mt target; Clean Electricity Regulations finalized but weakened (net-zero grid moved 2035→2050); 2026 zero-emission-vehicle target paused.",
    "accessDate": "2026-07-08",
    "confidence": "High",
    "citationType": "Interpretation"
  },
  {
    "id": "nrcan-sof-2025",
    "name": "Natural Resources Canada – The State of Canada's Forests: Annual Report 2025",
    "url": "https://natural-resources.canada.ca/forests-forestry/state-canada-forests",
    "desc": "Official annual forest report: 369 million ha of forest (~9% of world total; 225 Mha managed); under 0.5% deforested over 34 years; 2023 insect disturbance 11.6 Mha; Canadian Climate Institute climate-damage estimates of $25B/yr (2025) rising to $78B (low-emissions path) – $101B (high-emissions path) per year by 2050.",
    "publicationDate": "2025-07-01",
    "accessDate": "2026-07-08",
    "confidence": "High",
    "citationType": "Fact"
  },
  {
    "id": "energy-factbook-spring-2026",
    "name": "Natural Resources Canada / CCEI – Energy Fact Book, Spring 2026 Edition: Clean Power and Low Carbon Fuels",
    "url": "https://energy-information.canada.ca/en/energy-facts/clean-power-low-carbon-fuels",
    "desc": "Official energy statistics: 623 TWh of electricity produced in 2024, 65% renewable and 78% non-GHG-emitting; Canada is the world's third-largest hydroelectricity producer; rivers discharge close to 7% of the world's renewable water; fourth-largest proven oil reserves and third-largest uranium reserves.",
    "publicationDate": "2026-04-01",
    "accessDate": "2026-07-08",
    "confidence": "High",
    "citationType": "Fact"
  },
  {
    "id": "cer-canada-energy-profile",
    "name": "Canada Energy Regulator – Provincial and Territorial Energy Profiles: Canada",
    "url": "https://www.cer-rec.gc.ca/en/data-analysis/energy-markets/province-territory-energy-profiles/canada.html",
    "desc": "Official national energy-system profile: crude production 5.1 MMb/d (2023, fourth-largest producer, +41% since 2013, growth almost entirely oil sands); natural gas 17.9 Bcf/d; crude exports 4.0 MMb/d nearly all to the US; provincial generation mixes (BC/MB/QC/NL over 85% hydro; AB/SK/NS/NU mostly fossil).",
    "accessDate": "2026-07-08",
    "confidence": "High",
    "citationType": "Fact"
  },
  {
    "id": "statcan-2016-census-geography",
    "name": "Statistics Canada – The Daily: Population Size and Growth, 2016 Census",
    "url": "https://www150.statcan.gc.ca/n1/daily-quotidien/170208/dq170208a-eng.htm",
    "desc": "Census release documenting Canada's spatial structure: two of three people (66%) live within 100 km of the Canada–US border, an area of about 4% of the territory; density 3.9/km² vs 35.3 in the US; land area close to 10 million km².",
    "publicationDate": "2017-02-08",
    "accessDate": "2026-07-08",
    "confidence": "High",
    "citationType": "Fact"
  },
  {
    "id": "pco-bill-c5-implementation",
    "name": "Government of Canada – Implementation of Bill C-5: One Canadian Economy (backgrounder)",
    "url": "https://www.canada.ca/en/intergovernmental-affairs/news/2025/06/implementation-of-bill-c-5-one-canadian-economy.html",
    "desc": "Official backgrounder on the Building Canada Act (Royal Assent June 26, 2025): federal review of designated national-interest projects to complete within 2 years; 'one project, one review'; Major Projects Office with an Indigenous Advisory Council; Indigenous Loan Guarantee Program doubled $5B→$10B; 5-year designation window.",
    "publicationDate": "2025-06-26",
    "accessDate": "2026-07-08",
    "confidence": "High",
    "citationType": "Fact"
  },
  {
    "id": "dwpv-bill-c5-analysis",
    "name": "Davies Ward Phillips & Vineberg – Bill C-5: Canada's Approach to Accelerating Major Projects",
    "url": "https://www.dwpv.com/insights/2025/bill-c-5-accelerating-projects",
    "desc": "Legal analysis of the Building Canada Act: objective is to reduce federal decision timelines on national-interest projects to two years FROM FIVE; identifies the impact-assessment phase (not permitting) as the key gating step for major projects in Canada.",
    "publicationDate": "2025-07-02",
    "accessDate": "2026-07-08",
    "confidence": "Med",
    "citationType": "Interpretation"
  },
  {
    "id": "statcan-productivity-us-2026",
    "name": "Statistics Canada – Labour Productivity in Industries Dependent on United States Demand (Economic and Social Reports)",
    "url": "https://www150.statcan.gc.ca/n1/pub/36-28-0001/2026005/article/00001-eng.htm",
    "desc": "StatCan analytical article (May 2026) on Canada's labour-productivity trends and the exposure of the most productive, US-export-dependent industries to tariffs; references Bank of Canada's 'Canada's weak productivity: reversing course' framing.",
    "publicationDate": "2026-05-27",
    "accessDate": "2026-07-08",
    "confidence": "High",
    "citationType": "Fact"
  },
  {
    "id": "cbc-imf-internal-trade-2026",
    "name": "CBC News – Canada could gain nearly 7% in real GDP by removing internal trade barriers, says IMF",
    "url": "https://www.cbc.ca/news/business/canadian-economy-report-imf-interprovincial-trade-9.7062567",
    "desc": "Reports the January 2026 IMF study (Diez & Yang, with Trevor Tombe): interprovincial regulatory barriers equal roughly a 9% internal tariff nationally — over 40% in health and education services — and full internal liberalization could raise real GDP ~7% (~$210B); the December 2025 interprovincial agreement largely exempted services.",
    "publicationDate": "2026-01-27",
    "accessDate": "2026-07-08",
    "confidence": "Med",
    "citationType": "Interpretation"
  },
  {
    "id": "canlii-tsilhqotin-2014",
    "name": "Supreme Court of Canada – Tsilhqot'in Nation v. British Columbia, 2014 SCC 44 (CanLII)",
    "url": "https://www.canlii.org/en/ca/scc/doc/2014/2014scc44/2014scc44.html",
    "desc": "Full text of the ruling: first declaration of Aboriginal title in Canadian history (1,750 km²); title grounded in sufficient, continuous, exclusive occupation including territorial (not merely site-specific) use; government incursions on title land require consent or must meet the s.35 justification framework; BC found in breach of its duty to consult.",
    "publicationDate": "2014-06-26",
    "accessDate": "2026-07-08",
    "confidence": "High",
    "citationType": "Fact"
  },
  {
    "id": "tsilhqotin-ng-rights-title",
    "name": "Tŝilhqot'in National Government – Rights & Title",
    "url": "https://tsilhqotin.ca/governance/tsilhqotin-rights-title/",
    "desc": "The Nation's own account of the title litigation (1989–2014) and the June 26, 2014 declaration — the in-culture primary voice on what the title declaration means for the title-holding Nation.",
    "accessDate": "2026-07-08",
    "confidence": "High",
    "citationType": "Fact"
  },
  {
    "id": "cngov-agreements",
    "name": "Cree Nation Government – Agreements (James Bay and Northern Quebec Agreement 1975; Paix des Braves 2002; subsequent governance agreements)",
    "url": "https://www.cngov.ca/governance-structure/legislation/agreements/",
    "desc": "The Cree Nation Government's canonical page for the treaty lineage: the 1975 JBNQA as a living document amended by 24 complementary agreements; the 2002 Paix des Braves nation-to-nation agreement (adapted forestry regime, Cree consent to EM-1/Eastmain-Rupert, standing liaison committee); the 2008 Federal New Relationship Agreement and the 2017 Cree Constitution.",
    "accessDate": "2026-07-08",
    "confidence": "High",
    "citationType": "Fact"
  }
  {
  "id": "imf-country-focus-internal-trade-2026",
  "name": "IMF Country Focus – Canada Can Grow Faster by Unlocking Its Own Market (Díez & Yang, with Tombe)",
  "url": "https://www.imf.org/en/news/articles/2026/01/27/cf-canada-can-grow-faster-by-unlocking-its-own-market",
  "desc": "The study authors' own IMF publication: non-geographic, policy-related internal barriers average the equivalent of about a 9% tariff nationally; fully eliminating them could raise real GDP nearly 7% (~$210B) over the long run, with services liberalization the dominant share of gains.",
  "publicationDate": "2026-01-27",
  "accessDate": "2026-07-08",
  "confidence": "High",
  "citationType": "Fact"
}
]
```
