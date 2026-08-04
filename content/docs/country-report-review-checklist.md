# Country report — field review checklist

**Run this BEFORE reading the prose.** For each field, tick the required elements first — two minutes per field front-loads discovery instead of surfacing a missing element mid-rewrite. This is the checklist form of the same contract.

> **Source of truth:** the machine-enforced element list is [`scripts/lib/field-elements.cjs`](../../scripts/lib/field-elements.cjs) — the apply-gate coverage check obeys it. This checklist and the template's SECTIONS REQUIRED prose are human MIRRORS of it. All three must stay consistent; if they diverge, `field-elements.cjs` wins, and any intended change is made THERE first, then reflected here and in the template.

**Legend:**
- ⚙ — an **element-coverage validator flag** exists for this field (`scripts/lib/coverage.cjs`): run `node scripts/validate-country-citations.cjs <file>` and it will warn if a keyword-detectable element is absent. The validator catches the *whole-element omission*; you still confirm the element is real, not just keyword-present.
- 🔗 — source URLs are covered by `--check-urls` (`node scripts/validate-country-citations.cjs <file> --check-urls`): every link fetched, dead/constructed ones flagged SUSPECT. Run once per report.
- ✋ — **human-only**, no gate possible.

**Three universal checks close every field (the last is the one with no gate — do not skip it):**
- ☐ 🔗 Every source URL cited here resolves (covered by `--check-urls`, run once for the whole report).
- ☐ ✋ **No pointers** — no "documented / tracked / compiled / measured **by** X [id]" sentence that names a data-holder but reports no figure (the validator flags these too, `pointers.cjs`).
- ☐ ✋ **Clause-to-source read-back** — for **each** source cited in this field, name **which clause came from that document**. Not "are the numbers right" — "which clause is this source the authority for". This is the irreducible step: open the source, find the clause. It has no automated gate, which is exactly why it is last and mandatory.

**Also everywhere:** every figure carries a year · projections carry scenario AND horizon · exposure paired with capacity, located geographically · demonstrated over declared · acronyms spelled on first use.

---

## TERRITORY

**territory.geography** — [OPENER] land/coast form; neighbours
- ☐ OPENER: landlocked / coastal / island / archipelago / continent / peninsula; terrain; isolated or embedded; who the neighbours are
- ☐ Land area and internal distances; habitable vs empty land; coastlines and ports; the periphery (from calibration)
- ☐ Connectivity (road/rail/grid/broadband) is NOT here — it belongs to metabolism

**territory.biosphere** — renewable base as stock + trend
- ☐ Forests · freshwater (as STOCK) · arable land · fisheries — each as physical stock and condition/trend, with year and source

**territory.minerals** — subsurface endowment
- ☐ Reserves and resources, each with year and estimating body named; disputed/state-controlled counts flagged; undeveloped/stranded deposits. What the ground HOLDS (not sector output)

**territory.climate** — [OPENER] baseline type before hazards
- ☐ OPENER: baseline climate type (cold/hot/temperate/tropical/arid; altitude; uniform or regional) BEFORE any warming
- ☐ Observed + projected physical climate; hazards LOCATED geographically; every projection carries scenario AND horizon
- ☐ Each exposure paired with adaptive capacity; who is exposed vs who can afford the defence

**territory.metabolism** — how it runs as a system
- ☐ Energy, food, water flows; movement of goods/people within the country; comms backbone; self-sufficiency vs dependence in each (each such claim CITED, never bare)
- ☐ Opens on substance — NO "Scope: …" label

**territory.transition** — decarbonisation, delivered vs pledged
- ☐ Energy mix; emissions profile and DELIVERED path; pledged targets measured against delivered policy; name the gap (Climate Action Tracker primary)

## SOCIETY

**society.demographics** — [OPENER] population history + structure
- ☐ OPENER (short): indigenous-continuous / settler-immigrant-built / mixed / historically closed
- ☐ Total population AND age structure (median age, ageing/youth reality)
- ☐ Urban/rural split AND the *form* of urbanisation (where growth is, planned/self-built/informal)
- ☐ Internal + cross-border migration; fertility/dependency where relevant — all figures with a year

**society.composition** — ethnic shares + cleavage geometry
- ☐ Ethnic composition (rounded shares, year, source)
- ☐ CLEAVAGE GEOMETRY named: cross-cutting or reinforcing (not just a list of groups)

**society.language** — linguistic composition + salience
- ☐ Linguistic composition (rounded shares, year, source; contested/suppressed counts flagged)
- ☐ Lived texture (diglossia, vernacular vs official, lingua franca, instruction vs home language)
- ☐ Political salience (official-language regime, language law, linguistic nationalism)

**society.religion** — composition + texture + salience
- ☐ Composition rounded + the fault line if any (source and bias named; contested/suppressed counts flagged)
- ☐ Lived/syncretic texture the official label hides
- ☐ Political salience

**society.wellbeing** ⚙ — health + education OUTCOMES only
- ☐ Life expectancy (and healthy-life where available)
- ☐ Principal mortality/morbidity drivers; child/maternal where relevant
- ☐ Educational attainment / literacy / skills — each with its access gradient
- ☐ OUTCOMES only — the systems producing them go to capacity.publicServices

**society.cohesion** — trust + self-conception
- ☐ Population-wide social trust (interpersonal AND institutional), from the citizen self-report barometer as PRIMARY instrument
- ☐ Self-report reliability handled per flag (unconstrained / partisan-sorted / constrained / unresolved)
- ☐ National identity / self-conception

## ECONOMY

**economy.realEconomy** ⚙ — [OPENER] character before numbers
- ☐ OPENER: dominant economic character named BEFORE any number (primary/manufacturing/services; diversified or concentrated)
- ☐ Sectors and what people do for a living; growth; sector performance (fiscal/monetary/debt is NOT here)

**economy.publicFinances** ⚙ — the state's money (all with years)
- ☐ Budget balance (deficit/surplus, % of GDP)
- ☐ Public debt as a share of the economy
- ☐ Central-bank / monetary-policy stance
- ☐ Inflation
- ☐ Credit rating

**economy.externalVulnerability** ⚙ — external exposure
- ☐ Export/import profile by value and commodity
- ☐ Partner concentration
- ☐ Who holds the sovereign debt
- ☐ IMF program status (state "none" explicitly if N/A)
- ☐ Sanctions exposure (state "none" explicitly if N/A)

**economy.politicalEconomy** — [OPENER] state–market configuration
- ☐ OPENER: state-directed / mixed / market-led; Crown corps / SOEs / sovereign funds where they exist; where the boundary is contested
- ☐ Who benefits/loses; business-elite structure with load-bearing entities NAMED and cited (no nameless "business elite")
- ☐ Reforms technically necessary vs politically possible

## POLITICAL ORDER

**political.powerStructure** — [OPENER] regime + who holds power (MOST VOLATILE — dated to run date)
- ☐ OPENER: regime type; how power is won and held
- ☐ Who holds the executive and how won; legislative control stated SEPARATELY; unified or divided stated plainly
- ☐ Each chamber's composition cited to its own live standings page, verified on the run date
- ☐ Where actual power sits outside the formal organ, located explicitly

**political.rightsAndChecks** — checks on power
- ☐ Judicial independence + appointment mechanism
- ☐ Media independence / press freedom
- ☐ Civil-liberties / human-rights record (scorer bias named where used)

**political.stabilityDrivers** — what holds the regime up
- ☐ What legitimises the regime; security-force loyalty AND who controls them
- ☐ Coalition composition; business-elite alignment; ELITE cohesion (distinct from social cohesion)

**political.shockAbsorbers** — buffers + accelerants
- ☐ What buffers absorb shocks; what accelerants convert a shock into instability

**political.constitutionalSubstrate** — [OPENER] the deep legal architecture
- ☐ OPENER: constitutional form — founding instrument(s); sovereignty allocation (unitary/federal; parliamentary/presidential; one legal tradition or several)
- ☐ Predating/outside/diminished sovereignties held SEPARATELY (not collapsed)
- ☐ STABLE or IN MOTION stated explicitly; apex-court reallocation is present-state fact, cited to rulings
- ☐ Admin machinery is NOT here (→ stateStructure)

**political.stateStructure** — administrative machinery
- ☐ Unitary or federal; administrative divisions in the country's own term; which powers at which level; asymmetries between units

## CAPACITY TO DELIVER

**capacity.inheritedTerrain** — [OPENER] the denominator
- ☐ OPENER: structural terrain the state works against, BEFORE any performance claim
- ☐ Scale; resource base; colonial/extractive legacy; damage from armed conflict on its own soil, or plainly none; inherited education/health base
- ☐ ANCHORED SYNTHESIS ([dot.path], no new facts); merit-gap GUARD present (capacity inherited, never earned)

**capacity.steering** — governance as process
- ☐ Can it prioritise, implement what it announces, build consensus, learn? (Interpretation, anchored to record)
- ☐ RESPONSE RECORD spans the domains where the report documents shortfalls — for each, announced/attempted/budgeted response cited, OR "sources record none"

**capacity.approvals** — can it say yes/no, how fast
- ☐ Approval/permitting timelines for major projects; predictability; proposed vs consented vs built
- ☐ Where no published regime exists, the ACTUAL binding constraint named and measured instead

**capacity.delivery** — realised infrastructure execution
- ☐ Infrastructure deficit; cost and schedule performance; capital-project execution ability

**capacity.publicServices** — realised continuous-service delivery
- ☐ Health + education SYSTEMS (staffing, coverage, access, waiting times, quality) — the systems half of wellbeing (outcomes stay in society.wellbeing)

**capacity.productivity** — productivity + internal barriers
- ☐ Productivity level and trend; internal barriers to movement of goods/labour/capital between units; value-add processing domestic vs raw export; innovation/research capacity

## SECURITY & DIPLOMACY

**security.internal** — monopoly on force
- ☐ Armed groups; organised crime/trafficking/illicit finance; communal violence; terrorism level; corruption in forces; border situation; monopoly on force + territorial control across the WHOLE territory (military strength is NOT here)

**security.military** ⚙ — capability
- ☐ Force size and structure
- ☐ Defence spending (money AND % of economy)
- ☐ Domains — land, sea, air, cyber, space
- ☐ Conscription vs volunteer
- ☐ Nuclear status (state "none" explicitly if N/A); bases hosted/held; can it project or only defend
- ☐ Loyalty/control is NOT here (→ political.stabilityDrivers)

**security.transnationalExposure** — cross-border flows / non-state
- ☐ Trafficking, illicit finance, cross-border crime, foreign interference/disinformation, migration pressure, shared-resource frictions (named STATES → diplomacy; flows → here)

**security.diplomacy** — relationships with states
- ☐ Treaty alliances + multilateral memberships + transactional partners, NAMED and cited (no nameless "alliance network")
- ☐ Territorial disputes; regional flashpoints
- ☐ Per-relationship texture for key bilaterals, anchored to hard citable facts

**security.posture** — [OPENER, composed LAST] anchored synthesis
- ☐ OPENER: overall posture (defensive/expeditionary/neutral/alliance-dependent) + diplomatic orientation (aligned/non-aligned/hedging)
- ☐ ANCHORED SYNTHESIS via [dot.path] to the other four security fields — introduces NO new facts

---

## Derived / dedicated-pass fields — NOT reviewed as prose here

These are composed by their own passes from the finished report; review them against their own templates, not this checklist:
- **capacity.knownAndUnbuilt** (gap register) — derivatives pass; `known-and-unbuilt-pass-template.md`
- **situation** — situation pass §4d
- **actors.domestic / actors.external** — actors pass §8.1
- **scorecard + scorecardAnchors** — derivatives pass
- **baseline** — derivatives pass
