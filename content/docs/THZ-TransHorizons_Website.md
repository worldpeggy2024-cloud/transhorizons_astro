# TRANSHORIZONS — TECHNICAL STATUS

*Companion document to Flatline Master
Upload to chat when doing website/technical work
Update this document after each technical session*

*Last updated: August, 20th 2026*

This document is authoritative but not finished. Where an instance finds a contradiction, flag it — do not silently resolve it. The canon is corrected by Peggy, not by inference

## PORTFOLIO PURPOSE

TransHorizons is built as a research and analysis portfolio: a working demonstration of analytical capability aimed at government, think tanks, and policy organizations. Demonstrated expertise, not declared. Every article, map, and country report is intended to stand on its own as work that someone in the target audience could read and trust.
Two-stage strategic logic:

**Near-term** — the door. Build a body of trustworthy, useful, professionally credible content. Diversify away from full-time post-editing translation work and create a legible analyst portfolio while income from Statistics Canada and other contracts continues. The portfolio is the doorway, the work that makes the pivot visible to people who don't know Peggy yet.
**Longer-term** — the room behind the door. Dedicate primary professional time to geopolitical research and to Virtual Light / Lou, the climate-and-collapse fiction the analytical layer was always pointing toward. The two halves of the same project: articles establish what is real and what can be done; Lou carries it into lived terrain.

**Operational principle** — trustworthiness is the asset. The portfolio is only worth what its weakest claim is worth. One geographic error, one uncited assertion, one wobbly source on a contested topic, and the whole site gets reread with suspicion. This is why citation honesty is non-negotiable, why French is proofread by Peggy alone, why AI-generated maps don't get published without verification, and why source libraries are built before articles, not after. The constraint is structural, not stylistic.

**What it is not:** not a blog, not opinion writing, not commentary on the day's news, not a personal brand exercise. The voice is analytical, the sources documented, the positions arguable from the evidence rather than from feeling, even when the underlying motivation is climate grief.

## THE REAL INTENT (why all of this exists)

The origin interest was the *social and physical consequences* of climate and ecological disruption, and what can actually be done about them ( Covid - Collapsology theories; Servigne, Tainter, the Meadows *Limits to Growth*, the planetary-boundaries literature — the old reference list is the proof: it is overwhelmingly climate, collapse, and adaptation before it is anything else). climate-adaptation solutions were always the goal; geopolitics/minerals is the credible vehicle that gets the work read. Climate Leviathan (Wainwright/Mann, read cover-to-cover 2023)

The provocation that lit it: Servigne's observation that *only science-fiction writers* seriously study the deep social consequences of what already exists — that the real extrapolations are not covered by official science, reports, or studies. As a fan of Gibson, this resonated, but no capacity at the time and the book medium already felt wrong — until the AI collaboration made a different medium possible.

The layers stack with purpose. Geopolitics, critical minerals, trade, and resource analysis the *vehicle* of the climate interest: credible geopolitical-analysis articles potentially read by institutions (governments, think tanks, funders) that may hold the levers on adaptation. The professional doorway into the room always wanted. 
Virtual Light / Lou is the other half of the same intent — the science-fiction extrapolation, the visual and felt social consequence rendered in a body. The articles establish what is real and what can be done; Lou carries it into lived terrain. **The whole structure = analysis + deep social extrapolation of climate and ecological disruption, aimed at what can be done today.**
The articles establish what is foreseeable and what adaptation costs; Lou's world shows what happens. Not the better branch: **documenting fragments that already exist** (the stranded structures, the winter she loves, the Lufa network, the Mohawk lineage, the named makers, the grandmother's honest farm) and asking what they become if **they win — defended, grown, allowed to cohere**. 
Rigorous kind of hope pointing at real examples to amplify and multiply.

---

## INFRASTRUCTURE

**Live site:** transhorizons.net (live)
**Staging:** transhorizons-astro.fly.dev (staging/dev)
**Stack:** Astro + React, VS Code, GitHub, deployed on Fly.io
**CMS:** Keystatic (bilingual YAML content)

**Bilingual content:** French must be perfect — Peggy proofreads all French herself.
**Email:** Microsoft 365 Business Basic (trial converting to paid \~mid-June 2026)
**Domain:** transhorizons.net (paid \~25 years, finally deployed)

**Purpose:** Research portfolio to support career pivot from translator to geopolitical analyst. Target audience: government, think tanks, policy organizations.

**Content structure:**

* Analyses (long-form geopolitical articles)
* World Views (interactive maps + country reports)
* Notes \& Reflections (shorter personal-professional pieces)
* About / Research Approach



## Approach \& patterns

Peggy works simultaneously across multiple AI instances (project chat for strategy/content, VS Code for implementation); she has noted quality differences between models and switches when needed.

She corrects AI errors directly and expects acknowledgment, not deflection.

Maps are built independently in QGIS after AI tools proved unreliable.

Research is pre-sourced and structured before writing; source libraries are maintained by topic domain (see Tools \& Resources).

Lou's narrative and TransHorizons articles are developed in parallel and cross-pollinate: Canada's structural failures in the 2020s–30s become Lou's world's backstory; analytical work on trade, minerals, and resilience feeds narrative plausibility.

\---

## ARTICLE STATUS

|Article|URL slug|Status|Notes|
|-|-|-|-|
|Canada as a Resource Civilization|resource-civilization|✅ Done|Maps done incl. Global Systems map|
|From Translation Toward Research|(Notes)|✅ Done||
|Travel, Observation...|(Notes)|✅ Done||
|Net Carbon Effect of Forests|canada-forest-carbon|🔄 Review||
|Canada in the Multipolar World|canada-multipolar|🔄 Review|Arctic map (QGIS), Sphere of Influence (HTML done), Chokepoints (done)|
|Critical Minerals \& Energy Transition|critical-minerals|🔄 Review|Unsplash placeholders to replace|
|AI Governance \& Digital Sovereignty|ai-governance|🔄 Routing|Works on fly.dev, routing issue on transhorizons.net|
|Canada's Forest System|canada-forest-system-climate-industrial-pressure|🔄 SSR|Migration issue to diagnose|
|Canada's Resource Wealth in a Fractured World|canada-resources|🔄 SSR|Migration issue to diagnose|
|Critical Minerals: Resource Nexus|(Notes)|🔄|May need moving to Analysis section or removing if duplicate|

AI-generated maps are factually unreliable for serious analytical work; Peggy builds her own in QGIS. Geographic errors at publication would undermine analytical credibility.

The productivity/permitting trap is the structural root of most Canadian policy failures — visible in the 2020s–30s and unfixed. Every TransHorizons article touches it without naming it as a standalone topic.

The critical minerals paradox: the energy transition structurally requires more extraction, not less.

## MAPS STATUS

**Canada Sphere of Influence:**

* File: `canada-sphere-of-influence.html` (v6, HTML/SVG)
* Status: Complete except Canada flag — replace SVG flag bands with:
`<image href="https://flagcdn.com/ca.svg" x="368" y="250" width="124" height="82" clip-path="url(#canada-clip)" preserveAspectRatio="xMidYMid slice"/>`
* flagcdn.com already used by FlagIcon.tsx — works on live site

**Arctic Multipolar Dominance:**

* Base: QGIS, EPSG:3995 (Arctic Polar Stereographic)
* NWP: red, NSR: magenta/fuschia (painted in Paint 3D)
* Resources: CSV point layer (Yamal LNG, Pechora, Gydan, Prudhoe Bay, Kvanefjeld, Norilsk, Baffin Is.)
* Legend: black panel, left side
* Turkish Straits: still needs adding manually in Paint 3D
* Status: Nearly complete, being finalized in separate chat

**Maritime Chokepoints (4 PNGs from Manus):**

* Canadian geopolitical vulnerabilities ✅
* Canadian trade volumes/chokepoint dependencies ✅
* Global geopolitical tensions ✅
* Global trade volumes ✅
* All considered publication-ready

**Global Systems Map:** ✅ Done (in Resource Civilization article)

**Pending maps:**

* Human migration globe (planned — Manus for visual, then data replacement)
* Arctic route map (full version for Maps section)
* Sphere of influence full version for Maps section

\---

COUNTRY REPORTS (World Views)
Two-layer system — authoritative spec in three files, not duplicated here (edit there): country-report-present-state-template.md (present-state: political · economy · society · security · actors · risks · sources; governed by research-quality-bar.md), country-report-trajectory-template.md (plural anchored extrapolation; the hinge to Virtual Light), research-quality-bar.md (rejection criteria, overrides on conflict).

Pipeline: present-state fact → plural anchored trajectory → one committed Lou scene. A seed must clear the trajectory layer's anchoring before it becomes a scene (skip it = untethered preference = preaching).

Technical: content/countries/[CODE]/ — .en.yaml, .fr.yaml, .sources.yaml, .meta.yaml. Validator (blocking): npm run validate:country -- content/countries/[CODE]/. EN/FR citation parity enforced. Two-pass sourcing (Pass A sources → Pass B prose-from-approved-IDs). Never cite Facebook or Wikipedia.

Bottleneck: generation is seconds; human reading/verification (~several hours reviewing French which allows to spot issues in English too) is the real cost. Accept it.

Status
- Legacy count needs re-audit: the "26 done" were generated under the old single-layer, pre-society-peer process. Recount as present-state drafts owing a society check + a trajectory layer, not as finished.
- Canada (CAN): present-state 🔄 correction pass (report order); trajectory ⬜ blocked until present-state clean. Brazil (BRA): present-state ✅ pilot. Russia (RUS) / China (CHN): ⚠️ stale — redo. United States (USA): ⬜ next after Canada.

Country-report schema — resolved July 2026
The present-state template went from four peers to six. The three gaps surfaced in review are closed in country-report-present-state-template.md:

- territory — the physical body of the country as its own peer (geography · minerals · biosphere · climate · metabolism · transition), no longer buried in risks. This is where environmental extrapolation now has an anchor for the trajectory layer.
- capacity — the state's ability to build, permit, deliver (permitting · delivery · productivity). "Knowledge isn't the constraint, capacity is" is now a measured field, resolving the contradiction with the article pipeline that already calls capacity foundational.
- political.constitutionalSubstrate — deep-time legal bedrock (treaty lineage / title); distinct substrates held separate. Home for the James Bay/Paix des Braves vs unceded British Columbia/Tŝilhqot'in distinction.

Peer order: political · economy · territory · capacity · society · security. Spec lives in the template; not duplicated here.


\---

## VISUAL WORKFLOW

**Manus** to generate beautiful visual output **→ Claude/Claude Code pipeline:**

1. Ask Manus for HTML/JS/D3/Three.js editable code (never image renders)
2. Extract the code
3. Replace Manus data with verified sources in Claude/Claude Code
4. Deploy via Claude Code

**Key lesson:** Never ask Manus to regenerate — cannot reproduce consistent output. Add corrections manually to exported files.

**Character visuals:** ChatGPT only. Never Claude. (See Exhibit A in CharacterBibles.md)

\---

## QGIS STABILITY RULES

* Always use EPSG:3995 for Arctic layers
* WMS layers (Arctic Portal) unreliable — save project immediately when WMS loads
* Create new layers as GeoPackage with explicit CRS, not default
* Digitizing toolbar: enable manually (View → Toolbars)

\---

## PENDING TECHNICAL TASKS (priority order)

0\. CV on About page is pre-pivot — restructure for analyst positioning (EN/FR), then replace PDF

1. Diagnose Forest System + Canada Resources showing as React shells despite SSR migration done
2. Fix AI Governance routing issue on transhorizons.net (works on fly.dev)
3. Integrate Sphere of Influence HTML into canada-multipolar article
4. Finish Arctic map and integrate into canada-multipolar
5. Review Critical Minerals article content + replace Unsplash placeholders
6. Review remaining 4 articles
7. Canada 2026 budget report (budget.canada.ca/update-miseajour/2026) as anchor for future article series
8. Start Virtual Light footer link (small, unlabeled, hidden in plain sight)

\---

## KEY SOURCE DOCUMENTS

* Spring Economic Update 2026: budget.canada.ca/update-miseajour/2026
* Budget 2025: budget.canada.ca/2025
* PM Carney National Electricity Strategy: pm.gc.ca (May 14 2026)
* NRCan Nuclear Strategy: canada.ca/en/natural-resources-canada/news/2026/04/
* Defence: "Our North, Strong and Free" (2024 DND) + canada.ca/en/services/defence.html
* Arctic: arcticportal.org, chnl.no 2025 results, Arctic Foreign Policy 2024
* Trade: asiapacific.ca (Van Assche APF Feb 2026), ised-isde.canada.ca/trade-data-online

\---

## ARTICLE PIPELINE

**Tier 1 (ready to publish):** Hydrogen, Critical Minerals, Clean Fuels + CCS, Forests, Electrification, Data Centers

**Tier 2 (needs framing):** Immigration, Transport + Indigenous, Eavor EGS, Arctic, Indigenous Relations, Batteries

**Tier 3 (original/structural):** Trade Balance, Plural Societies (may split)

**Workflow pieces (not articles):** Announcement cadence, AI methodology note

**IMPORTANT — Productivity/Regulation:** NOT a standalone article. It is the invisible structural failure underlying ALL other articles (permitting, infrastructure deficit, no value-add processing, interprovincial barriers). Foundational for Lou's cyberpunk world. Informs everything without being named.

\---

## NOTES \& REFLECTIONS — CONCEPTUAL SPINE

personal-intellectual content in a distinct register

Topics: ELT telescope, Pompeii/Herculaneum papyri scrolls, space servers/orbital data infrastructure, human health + longevity.

**Potential unifying concept:** AI-augmented human abilities

* AI reads astronomical data (ELT)
* Machine vision reads unreadable ancient text (Herculaneum)
* Computation beyond Earth constraints (space servers)
* Biological substrate for augmentation (longevity)

**Core question:** What does human capability look like when AI extends senses, memory, and reach?

Also feeds Lou's narrative directly.

\---

## PENDING TECHNICAL ISSUES

**AppShell.tsx route mismatch:** Old AppShell route names (resources, geopolitics, technology) don't match new Astro filenames (critical-minerals, canada-multipolar, ai-governance). Still requires AppShell.tsx route updates.

**SSR architecture:** Core problem was React SPA inside Astro using `client:only="react"` — invisible to crawlers. Resolved on staging via individual .astro page files serving static HTML to crawlers while loading React for visual experience. Ten pages confirmed crawlable via PowerShell testing.

\---

## RESEARCH REFERENCES

**Geopolitics (Perplexity, Apr 2026):**
US exports 71.7% (was 75.9%); GDP -1.6% Q2 2025; PIIE -2.3% peak under tariffs. Three schools: Managed Interdependence, Hard Sovereignty, Realist Accommodation. Horizons: stabilize 2026–28, build 2028–32, diversify 2032+. Constraint: execution/permitting. Open Qs: infra timeline, China minerals, CUSMA 2026, supply chains, middle-power coalition. Sources: GAC, BoC, CFR, Brookings, PIIE, CIGI, MLI, C.D. Howe, Chatham House, APF.

**Canada 2050 Trade (Perplexity, Apr 2026):**
Oil 5.4M bpd; TMX 890k bpd (2/3 to Asia); LNG Canada Phase 1 June 2025 14mtpa (Carney vision: 100mtpa); potash 31% world reserves; uranium 2nd globally 24%; agri-food $100.3B 2024; US share 70–76%, target sub-25% by 2050. 7 pillars: energy, minerals, agri-food, SMR/nuclear, hydrogen, digital infra, finance. Key obstacles: permitting, interprovincial barriers, Arctic underfunding, US structural lock-in, Indigenous rights, demographics, China refining dependency (85–90% REE refining). Ideal partners: China, Japan, EU/Germany, India, S.Korea, UK, SE Asia, Africa, Middle East, LatAm.

**Low-Consumption Economic Model (May 2026):**
Economies structurally growth-dependent but reformable. Japan = best low-growth analogue. Three scenarios: managed sufficiency (low probability), gradual adaptation (most likely), fragmented contraction (non-trivial risk). Country resilience: India high; China/Canada/Japan moderate; US/Germany low.

\---

## SOURCE LIBRARY

**Fiscal/policy:**

* Spring Economic Update 2026: budget.canada.ca/update-miseajour/2026 (operationally current — supersedes Budget 2025)
* Budget 2025: budget.canada.ca/2025 (foundational — not linked back from 2026 page, cross-reference manually)
* Key 2026 Update items: critical minerals $18.5B, trade diversification, defence $180B by 2035, CCS, LNG, internal trade, productivity (s.1.7)

**Defence:** "Our North, Strong and Free" (2024, DND) — uploaded PDF; pre-Carney. Fetch canada.ca/en/services/defence.html for current.

**Electricity:** PM Carney National Electricity Strategy (May 14 2026, pm.gc.ca) + "Powering Canada Strong" (NRCan May 2026). Key: 80% clean grid; demand doubles by 2050; E-W-N grid; grids explicitly "fragmented."

**Nuclear:** NRCan Nuclear Energy Strategy (Apr 29 2026). 4 pillars: new builds, global exporter, uranium expansion, innovation (incl. fusion). Nuclear = 13% Canada electricity; uranium 2nd globally.

**Forests:**

* NRCan hubs: natural-resources.canada.ca/forests-forestry + /climate-change/forest-carbon subpages : forests hub, boreal research, SoF reports, forest industry overview, forest carbon hub, Carbon Budget Model, Generic CBM
* Maps/data: ca.nfis.org/map/atlas.html | cwfis.cfs.nrcan.gc.ca/en/fire-history
* Science: 2023 Blueprint for Forest Carbon Science (NRCan bitstream 2d5ac1e5) | Boreal monograph (bitstream c53e9c7c)
* Policy: canadianforesttaskforce.ca | Task Force final report due Apr 18 2026 — **Peggy translated it but CANNOT cite until officially released**
NRCan transformation measures page (ressources-naturelles.canada.ca/forets-foresterie/industrie-commerce-forestiere/mesures-visant-transformer), PM Carney Nov 26 2025 press release + backgrounder (pm.gc.ca), canadianforesttaskforce.ca

**Trade — Arctic:**
arcticportal.org | arcticyearbook.com/2025 | Canada Arctic Foreign Policy 2024 (international.canada.ca) | chnl.no 2025 NSR results | changingclimate.ca ch.9 (NWP) | millerthomson NWP trade corridor | pame.is pame.is ASSR_1_2024_update.pdf

**Trade — infrastructure/data:**
submarinecablemap.com | submarinenetworks.com FAR North Fiber | datacentermap.com | clearseas.org/research/vessel-traffic-forecast-pacific | open.canada.ca vessel traffic datasets  e-navigation.canada.ca/topics/traffic/index-en

**Trade — strategy:**
asiapacific.ca (Van Assche APF Feb 2026 "Adapting Canada's Trade Diversification Strategy" 5-P framework + APF Feb 2025 "Trump's Chokepoint Playbook") | ised-isde.canada.ca/site/trade-data-online/en | exportpotential.intracen.org | trademap.org


\---

## SOURCE LIBRARY — AFRICA \& ASIA (in-culture priority)

*Compiled June 2026. Principle: prefer sources where the region writes about itself. Western think tanks (Brookings, Chatham House, CFR) useful for triangulation only — already overrepresented in AI training data. Claude reads CN/KR/JP/RU natively — feed primary documents by URL rather than asking Claude to "research" those language-webs (Western search indexes Baidu/Naver/Yandex poorly).*

**Africa — pan-continental:**

* **Afrobarometer** (afrobarometer.org) — pan-African survey network, HQ Ghana, 41 national partners, \~75% continent population per round, free data, publishes in FR. THE source for African public opinion. Verified active 2026.
* **UNECA** (uneca.org) + African Minerals Development Centre — continental frameworks: African Mining Vision, African Green Minerals Strategy. "No repeat of the scramble for Africa" framing = how Canadian minerals diplomacy will be read.
* **AfDB** (afdb.org) — African Economic Outlook, annual.

**Africa — minerals/geopolitics:**

* **APRI – Africa Policy Research Institute** (afripoli.org) — African-led. Key reports: "Mapping Africa's Green Mineral Partnerships" (Mar 2026, incl. 19 China-Africa mineral agreements) + South Africa critical minerals strategy analysis (Mar 2026). Verified active 2026. Counterpart perspective to Canadian critical-minerals work.
* **UNCTAD critical minerals value-addition project** (Madagascar/Namibia/Zambia, Japan-funded) — Africa's reserves: 48.1% cobalt, 47.7% manganese, 21.6% graphite. unctad.org, Nov 2025.

**Africa — DRC (Virtual Light tributes — NEVER conflate Haiti / Congo-Kinshasa / Congo-Brazzaville):**

* **Ebuteli** (ebuteli.org) — Congolese research institute, Kinshasa. Politics/governance/violence. Partner of Congo Research Group (NYU CIC). Publishes EN+FR. Kivu Security Barometer = monthly incident data. Verified active 2026.
* **ISS Africa** (issafrica.org) — Pretoria, African-led security analysis, publishes in FR.

**Asia — Southeast:**

* **ISEAS–Yusof Ishak Institute** (iseas.edu.sg) — State of Southeast Asia survey, annual since 2019. 2026 edition (Apr 7, 2026): 2,008 opinion-makers, all ASEAN states + Timor-Leste first time. PDF: iseas.edu.sg/wp-content/uploads/2026/03/The-State-of-Southeast-Asia-2026-Survey-Final-Single.pdf. Empirical check on how ASEAN actually perceives US-China rivalry. Verified active 2026.
* **ERIA** (eria.org) — Jakarta, ASEAN economic integration. \[not re-verified June 2026]

**Asia — Northeast:**

* **Caixin Global** (caixinglobal.com) — closest to independent Chinese financial journalism. Operates under censorship — read for what's said AND what's structurally unsayable.
* **NDRC/MOFCOM Chinese-language policy docs** — richer than EN summaries. Provide URL for Claude native reading.
* **KIEP** (kiep.go.kr) + **KDI** — Korean trade/economic policy, EN available. MOTIE for battery/minerals supply chain. \[not re-verified June 2026]
* **JIIA** (jiia.or.jp) — Japan. \[not re-verified June 2026]

**Asia — South:**

* **ORF – Observer Research Foundation** (orfonline.org) — Delhi. India's view of multipolarity. In-culture check on India "high resilience" rating in Low-Consumption Model. \[not re-verified June 2026]

**Russia (inside view extinguished — émigré sources only):**

* **Meduza** (meduza.io)
* **Mediazona** (en.zona.media) — definitive censorship-apparatus tracking
* **The Moscow Times** (exile)
* **OSW Warsaw** (osw.waw.pl) — best outside analysis of elite dynamics
* Russian official statistics increasingly suppressed/unreliable — the opacity is itself a finding.
* **NEVER** use in-country personal contacts as sources (foreign agent / confidential cooperation laws).

**Known biases (chosen, not invisible):** Afrobarometer funding heavily Western donors. ORF has Indian corporate backing. Caixin censorship-constrained. Émigré Russian media has exile perspective. Quality-over-quantity = named bias you correct for.

\---

*End of Technical Status. Update after each technical session.*

