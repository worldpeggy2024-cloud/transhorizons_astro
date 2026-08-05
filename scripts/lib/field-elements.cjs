/*
 * Field element registry — the single machine-readable SOURCE OF TRUTH for
 * "what each field must cover". The template's SECTIONS REQUIRED prose
 * (content/docs/country-report-present-state-template.md) and the review checklist
 * (content/docs/country-report-review-checklist.md) are human MIRRORS of this file:
 * change the element set HERE first, then reflect it in those two. Used by:
 *   - the generator (deepsearch-country-workflow.cjs): injects the per-field
 *     element list into Pass A (harvest a source per element) and Pass B (cover
 *     each element + emit a coverage map), and gates the coverage map at apply;
 *   - the audit validator (validate-country-citations.cjs): keyword-coverage
 *     warnings on the enumerable elements (scripts/lib/coverage.cjs reads the
 *     keyword patterns from here).
 *
 * Per field: { key, gate, elements: [{ id, label, keyword? }] }
 *   gate    — false for anchored-synthesis fields (inheritedTerrain, posture):
 *             they introduce NO new sourced facts, so a source-backed coverage
 *             map does not apply; they are still injected as Pass B guidance.
 *   keyword — EN|FR regex; present only on ENUMERABLE elements, where an omitted
 *             element is keyword-detectable. Absent = injected + coverage-mapped,
 *             but not keyword-checked (descriptive elements don't reduce to words).
 *
 * Openers are NOT listed as elements — they are gated separately by openers.cjs.
 * The five dedicated-pass fields (knownAndUnbuilt, situation, actors, scorecard,
 * baseline) are emitted empty by Pass B and carry no coverage map.
 */

'use strict';

const FIELDS = [
  // ── TERRITORY ──────────────────────────────────────────────────────────────
  { key: 'territory.geography', elements: [
    { id: 'form', label: 'land/coast form (landlocked/coastal/island/archipelago/continent/peninsula) and terrain' },
    { id: 'neighbours', label: 'who the neighbours are' },
    { id: 'distances', label: 'land area and internal distances; habitable vs empty land' },
    { id: 'portsPeriphery', label: 'coastlines and ports; the periphery' },
  ] },
  { key: 'territory.biosphere', elements: [
    { id: 'forests', label: 'forest stock and trend' },
    { id: 'freshwater', label: 'freshwater as STOCK' },
    { id: 'arableLand', label: 'arable land stock and trend' },
    { id: 'fisheries', label: 'fisheries stock and condition' },
  ] },
  { key: 'territory.minerals', elements: [
    { id: 'endowment', label: 'reserves and resources (year + estimating body named; disputed counts flagged)' },
    { id: 'undeveloped', label: 'undeveloped or stranded deposits' },
  ] },
  { key: 'territory.climate', elements: [
    { id: 'hazards', label: 'principal hazards located geographically' },
    { id: 'projections', label: 'projections, each with scenario AND horizon' },
    { id: 'exposureCapacity', label: 'each exposure paired with adaptive capacity; who is exposed vs who can afford the defence' },
  ] },
  { key: 'territory.metabolism', elements: [
    { id: 'energy', label: 'energy flows; self-sufficiency vs dependence' },
    { id: 'foodWater', label: 'food and water flows' },
    { id: 'movement', label: 'movement of goods and people within the country' },
    { id: 'comms', label: 'physical communications backbone' },
  ] },
  { key: 'territory.transition', elements: [
    { id: 'energyMix', label: 'energy mix' },
    { id: 'emissionsPath', label: 'emissions profile and DELIVERED path' },
    { id: 'pledgeVsPolicy', label: 'pledged targets measured against delivered policy; the gap named' },
  ] },
  // ── SOCIETY ────────────────────────────────────────────────────────────────
  { key: 'society.demographics', elements: [
    { id: 'population', label: 'total population (with year)' },
    { id: 'ageStructure', label: 'age structure (median age, ageing/youth reality)', keyword: /median age|age structure|ageing|aging|youth|dependency|65 and over|over 65|âge médian|vieilliss|structure (par âge|d'âge)|jeunesse|65 ans/i },
    { id: 'urbanForm', label: 'urban/rural split AND the form of urbanisation' },
    { id: 'migration', label: 'internal + cross-border migration; fertility/dependency where relevant' },
  ] },
  { key: 'society.composition', elements: [
    { id: 'ethnicShares', label: 'ethnic composition (rounded shares, year, source)' },
    { id: 'cleavageGeometry', label: 'cleavage geometry named: cross-cutting or reinforcing' },
  ] },
  { key: 'society.language', elements: [
    { id: 'linguisticShares', label: 'linguistic composition (rounded shares, year, source)' },
    { id: 'livedTexture', label: 'lived texture (diglossia, vernacular vs official, lingua franca, instruction vs home language)' },
    { id: 'salience', label: 'political salience (official-language regime, language law, linguistic nationalism)' },
  ] },
  { key: 'society.religion', elements: [
    { id: 'composition', label: 'composition rounded + the fault line if any (source + bias named)' },
    { id: 'texture', label: 'lived/syncretic texture the official label hides' },
    { id: 'salience', label: 'political salience' },
  ] },
  { key: 'society.wellbeing', elements: [
    { id: 'lifeExpectancy', label: 'life expectancy (and healthy-life where available)', keyword: /life expectancy|espérance de vie/i },
    { id: 'mortality', label: 'principal mortality/morbidity drivers; child/maternal where relevant', keyword: /mortalit|death rate|infant|morbidit|taux de (décès|mortalité)|nourrisson/i },
    { id: 'education', label: 'educational attainment / literacy / skills, each with its access gradient', keyword: /educational attainment|literacy|schooling|bachelor|degree|attainment|scolaris|alphabétis|diplôme|niveau d'instruction|baccalauréat/i },
  ] },
  { key: 'society.cohesion', elements: [
    { id: 'socialTrust', label: 'social trust (interpersonal AND institutional) from the citizen barometer as PRIMARY instrument' },
    { id: 'selfConception', label: 'national identity / self-conception' },
  ] },
  // ── ECONOMY ────────────────────────────────────────────────────────────────
  { key: 'economy.realEconomy', elements: [
    { id: 'sectoralShape', label: 'sectors and what people do for a living', keyword: /service|manufactur|industri|agricult|sector|primary|tertiary|secteur|industriel|agricole|tertiaire/i },
    { id: 'growth', label: 'growth and sector performance', keyword: /\bgrowth\b|\bgdp\b|grew|expand|contract|croissance|\bpib\b|croiss/i },
  ] },
  { key: 'economy.publicFinances', elements: [
    { id: 'budgetBalance', label: 'budget balance (deficit/surplus, % of GDP)', keyword: /deficit|surplus|budget balance|fiscal balance|solde budg|déficit|excédent/i },
    { id: 'publicDebt', label: 'public debt as a share of the economy', keyword: /public debt|government debt|federal debt|national debt|sovereign debt|debt[- ]to[- ]gdp|debt held|debt[^.]{0,40}(% of gdp|of gdp)|dette (publique|fédérale|nationale|souveraine)|dette[^.]{0,40}(du pib|% du pib)/i },
    { id: 'monetaryStance', label: 'central-bank / monetary-policy stance', keyword: /central bank|monetary policy|monetary stance|interest rate|policy rate|banque centrale|politique monétaire|taux directeur|taux d'intérêt/i },
    { id: 'inflation', label: 'inflation', keyword: /inflation|consumer price|\bcpi\b|prix à la consommation|\bipc\b/i },
    { id: 'creditRating', label: 'credit rating', keyword: /credit rating|sovereign rating|rated |rating agenc|moody|fitch|standard & poor|\bs&p\b|notation (financière|souveraine|de crédit)|note de crédit|agence de notation/i },
  ] },
  { key: 'economy.externalVulnerability', elements: [
    { id: 'tradeProfile', label: 'export/import profile by value and commodity', keyword: /export|import|trade (balance|deficit|surplus)|balance commerciale|exportation|importation/i },
    { id: 'partnerConcentration', label: 'partner concentration', keyword: /partner|trading partner|counterpart|concentrat|partenaire|principaux? (clients|fournisseurs|partenaires)/i },
    { id: 'debtHolders', label: 'who holds the sovereign debt', keyword: /hold(er|ing|ings|s)?[^.]{0,25}(debt|treasur|bond|sovereign)|foreign[^.]{0,20}(holding|debt|investor)|déten(teur|ir|nent)|dette souveraine|bons du trésor/i },
    { id: 'imfProgram', label: 'IMF program status (state "none" if N/A)', keyword: /\bimf\b|international monetary fund|\bfmi\b|fonds monétaire international/i },
    { id: 'sanctions', label: 'sanctions exposure (state "none" if N/A)', keyword: /sanction|embargo/i },
  ] },
  { key: 'economy.politicalEconomy', elements: [
    { id: 'beneficiaries', label: 'who benefits and who loses under the current model' },
    { id: 'businessElite', label: 'business-elite structure with load-bearing entities NAMED and cited' },
    { id: 'reforms', label: 'reforms technically necessary vs politically possible' },
  ] },
  // ── POLITICAL ORDER ──────────────────────────────────────────────────────────
  { key: 'political.powerStructure', elements: [
    { id: 'executive', label: 'who holds the executive and how it was won' },
    { id: 'legislative', label: "each chamber's composition, cited to its live standings page, verified on run date" },
    { id: 'unifiedDivided', label: 'unified or divided government stated plainly' },
    { id: 'powerLocus', label: 'where actual power sits if outside the formal organ' },
  ] },
  { key: 'political.rightsAndChecks', elements: [
    { id: 'judicial', label: 'judicial independence + appointment mechanism' },
    { id: 'media', label: 'media independence / press freedom' },
    { id: 'civilLiberties', label: 'civil-liberties / human-rights record (scorer bias named where used)' },
  ] },
  { key: 'political.stabilityDrivers', elements: [
    { id: 'legitimacy', label: 'what legitimises the regime' },
    { id: 'forceLoyalty', label: 'security-force loyalty AND who controls them' },
    { id: 'eliteCohesion', label: 'elite cohesion (distinct from social cohesion)' },
  ] },
  { key: 'political.shockAbsorbers', elements: [
    { id: 'buffers', label: 'what buffers absorb shocks' },
    { id: 'accelerants', label: 'what accelerants convert a shock into instability' },
  ] },
  { key: 'political.constitutionalSubstrate', elements: [
    { id: 'sovereigntyAllocation', label: 'allocation of sovereignty between levels; founding/re-founding instruments' },
    { id: 'predatingSovereignty', label: 'peoples/nations/territories whose sovereignty predates, sits outside, or is diminished — held SEPARATELY' },
    { id: 'stableOrInMotion', label: 'STABLE or IN MOTION stated explicitly; apex-court reallocation cited to rulings' },
  ] },
  { key: 'political.stateStructure', elements: [
    { id: 'unitaryFederal', label: 'unitary or federal; administrative divisions in the country\'s own term' },
    { id: 'powerLevels', label: 'which powers sit at which level; asymmetries between units' },
  ] },
  // ── CAPACITY TO DELIVER ──────────────────────────────────────────────────────
  { key: 'capacity.inheritedTerrain', gate: false, elements: [
    { id: 'scale', label: 'geographic and demographic scale' },
    { id: 'resourceBase', label: 'resource base' },
    { id: 'legacy', label: 'colonial/extractive legacy and terms of trade; damage from armed conflict fought on its own soil (war destruction, wartime displacement, munitions contamination), or plainly none' },
    { id: 'inheritedBase', label: 'inherited education and health base' },
  ] },
  { key: 'capacity.steering', elements: [
    { id: 'prioritise', label: 'can it prioritise among competing demands' },
    { id: 'implement', label: 'announced priorities vs implemented ones' },
    { id: 'responseRecord', label: 'RESPONSE RECORD across the shortfall domains — announced/attempted/budgeted response cited, or "sources record none"' },
  ] },
  { key: 'capacity.approvals', elements: [
    { id: 'timelines', label: 'approval/permitting timelines for major projects (or the actual binding constraint if no regime)' },
    { id: 'predictability', label: 'regulatory predictability' },
    { id: 'proposedVsBuilt', label: 'record of projects proposed vs consented vs built' },
  ] },
  { key: 'capacity.delivery', elements: [
    { id: 'infraDeficit', label: 'infrastructure deficit' },
    { id: 'costSchedule', label: 'cost and schedule performance; capital-project execution ability' },
  ] },
  { key: 'capacity.publicServices', elements: [
    { id: 'healthSystem', label: 'health system (staffing, coverage, access, waiting times, quality)' },
    { id: 'educationSystem', label: 'education system (staffing, coverage, access, quality)' },
  ] },
  { key: 'capacity.productivity', elements: [
    { id: 'level', label: 'productivity level and trend' },
    { id: 'internalBarriers', label: 'internal barriers to movement of goods/labour/capital between units' },
    { id: 'valueAddInnovation', label: 'value-add processing domestic vs raw export; innovation/research capacity' },
  ] },
  // ── SECURITY & DIPLOMACY ─────────────────────────────────────────────────────
  { key: 'security.internal', elements: [
    { id: 'armedGroupsCrime', label: 'armed groups; organised crime, trafficking, illicit finance; communal violence; terrorism level' },
    { id: 'securityForceCorruption', label: "corruption in security forces — name the auditing body and its independence from the forces; where the only sources are the forces' own, say so" },
    { id: 'monopolyForce', label: 'monopoly on force + territorial control across the WHOLE territory' },
    { id: 'border', label: 'border situation' },
  ] },
  { key: 'security.military', elements: [
    { id: 'forceSize', label: 'force size and structure', keyword: /force size|troops|personnel|active[- ](duty|force)|standing (army|force)|effectifs?|taille[^.]{0,60}forces?|militaires d'active|armée (permanente|de métier)/i },
    { id: 'defenceSpending', label: 'defence spending (money AND % of economy)', keyword: /defen[cs]e (spending|budget|expenditure|outlay)|military (spending|expenditure|budget)|% of gdp|dépenses (militaires|de défense)|budget (de (la )?défense|militaire)/i },
    { id: 'domains', label: 'domains — land, sea, air, cyber, space', keyword: /\bnaval\b|air force|\bcyber|\bspace\b|land[, ].{0,8}(sea|air)|maritime|aérienne?|spatial|terre[, ].{0,8}(mer|air)/i },
    { id: 'conscription', label: 'conscription vs volunteer', keyword: /conscript|volunteer force|all-volunteer|\bdraft\b|conscription|volontaire|professionnelle|service militaire/i },
    { id: 'nuclear', label: 'nuclear status (state "none" if N/A); projection vs defence', keyword: /nuclear|warhead|deterrent|nucléaire|arme atomique|dissuasion/i },
  ] },
  { key: 'security.transnationalExposure', elements: [
    { id: 'flows', label: 'cross-border flows: trafficking, illicit finance, cross-border crime' },
    { id: 'interference', label: 'foreign interference and disinformation' },
    { id: 'migrationResource', label: 'migration pressure; shared-resource frictions' },
  ] },
  { key: 'security.diplomacy', elements: [
    { id: 'alliances', label: 'treaty alliances + multilateral memberships + transactional partners, NAMED and cited' },
    { id: 'disputes', label: 'territorial disputes; regional flashpoints' },
    { id: 'bilateralTexture', label: 'per-relationship texture for key bilaterals, anchored to hard citable facts' },
  ] },
  { key: 'security.posture', gate: false, elements: [
    { id: 'postureOrientation', label: 'overall posture + diplomatic orientation (anchored synthesis of the other four)' },
  ] },
];

// key -> field entry
const FIELD_BY_KEY = new Map(FIELDS.map((f) => [f.key, f]));

// coverage.cjs consumes this: flat { base_key: [[label, keyword], …] } for
// enumerable elements only.
const KEYWORD_ELEMENTS = {};
for (const f of FIELDS) {
  const kw = f.elements.filter((e) => e.keyword).map((e) => [e.label, e.keyword]);
  if (kw.length) KEYWORD_ELEMENTS[f.key.replace('.', '_')] = kw;
}

module.exports = { FIELDS, FIELD_BY_KEY, KEYWORD_ELEMENTS };
