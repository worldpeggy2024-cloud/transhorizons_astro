/*
 * Situator-opener signature checks (heuristic) — shared by
 * deepsearch-country-workflow.cjs (apply gate, HARD ERRORS) and
 * validate-country-citations.cjs (audit, warnings). ONE implementation.
 *
 * The "OPENER (required)" disciplines are prompt-only and silently erode: Pass B
 * skipped every opener on the USA run because nothing validated them. Each check
 * looks for the discipline's signature vocabulary at the START of the field (for
 * realEconomy: BEFORE the first digit — the character must be named before any
 * number). Heuristics, not semantics — tuned to catch a skipped opener, not to
 * grade a written one.
 *
 * NINE enforced openers (rework spec §3/§9): territory.geography,
 * territory.climate, society.demographics, economy.realEconomy,
 * economy.politicalEconomy, political.powerStructure,
 * political.constitutionalSubstrate, capacity.inheritedTerrain,
 * security.posture — situation has NO opener (it is a list of events).
 * The gate is POINTED AT THE NEW FIELD NAMES; legacy fields
 * (economy_macroReality_* etc.) are simply absent under these names and skip.
 */

'use strict';

const OPENER_RULES = {
  substrate: {
    re: /constitution|founding|sovereign|federal|unitary|parliamentar|president|confederat|basic law|fundamental law|charter|souverain|fédéra|unitaire|parlementa|présidentiel|charte/i,
    window: 300,
    hint: 'must open by naming the constitutional form (founding instrument(s); how sovereignty is allocated)',
  },
  realEconomy: {
    beforeFirstDigit: true,
    re: /service|manufactur|industri|agricult|agrari|commodit|resourc|extractiv|hydrocarbon|\boil\b|\bgas\b|mining|export-led|diversified|concentrated|post-industrial|knowledge|mixed econom|advanced econom|emerging|tertiar|primaire|secondaire|tertiaire|industriel|agricole|matières premières|ressourc|pétrol|gazier|minier|diversifié|concentré|avancée|émergent|mixte/i,
    window: 300,
    hint: 'must name the dominant economic character BEFORE any numbers (shape of production; what the economy lives on; diversified or concentrated)',
  },
  geography: {
    re: /landlocked|coastal|island|archipelag|continent|peninsul|mountain|\bflat\b|plain|lowland|highland|isolated|embedded|neighbou?r|borders|enclavé|côtier|insulaire|archipel|péninsul|montagn|\bplat\b|plaine|isolé|voisin|frontali/i,
    window: 300,
    hint: 'the territory peer must open (first sentence of territory.geography) with the country-as-a-whole situator (landlocked/coastal/island/…; terrain; neighbours)',
  },
  climate: {
    re: /\bcold\b|\bhot\b|temperate|tropical|arid|continental|maritime|mediterranean|polar|subarctic|boreal|equatorial|monsoon|desert|humid|altitude|uniform|dramatically regional|froid|chaud|tempéré|aride|méditerranéen|polaire|subarctique|boréal|équatorial|mousson|désert|humide/i,
    window: 300,
    hint: 'must open by establishing the baseline climate type before any warming/exposure/hazard content (warming is a change; a change needs a baseline)',
  },
  demographics: {
    re: /indigenous|settler|immigrant|immigration|colonial|coloni[sz]|\bmixed\b|\bclosed\b|founded|peopled|autochtone|\bcolon|immigr|fermé|métiss|peuplé|fondé/i,
    window: 250,
    hint: 'must open with the one-line historical framing (indigenous-continuous / settler-immigrant-built / mixed from the onset / historically closed)',
  },
  powerStructure: {
    re: /republic|monarch|democra|parliamentar|presidential|semi-presidential|federation|authoritarian|autocra|one-party|single-party|military rule|junta|theocra|hybrid regime|électoral|electoral autocra|républi|monarchi|démocrat|parlementair|présidentiel|autoritai|autocrat|parti unique|junte|théocrat|hybride/i,
    window: 300,
    hint: 'must open with the regime type and how power is won and held',
  },
  politicalEconomy: {
    re: /state-directed|state-led|market-led|market-driven|market econom|mixed econom|liberal market|coordinated market|state-owned|crown corporation|sovereign wealth|sovereign fund|state capitalis|dirigist|dirigé|axée? sur le march|économie mixte|économie de march|sociétés? d'État|société d'État|fonds souverain|capitalisme d'État|étatis/i,
    window: 300,
    hint: 'must open with the state–market configuration before any distributional detail (state-directed / mixed / market-led; Crown corporations / state-owned enterprises / sovereign funds; where the boundary is contested)',
  },
  inheritedTerrain: {
    re: /inherit|hérit|terrain|colonial|coloni[sz]|legacy|\blegs\b|endow|dotation|scale|échelle|conflict histor|extractiv|post-?colonial|settler|structural|structurel|geography|géographi/i,
    window: 300,
    hint: 'must open with the structural terrain the state works against, before any performance claim (scale; resource base; colonial/extractive legacy; conflict history; inherited education/health base)',
  },
  posture: {
    re: /defensive|expeditionary|neutral|alliance|non-?aligned|hedg|aligned|défensi|expéditionnair|neutre|alliance|non-?align|alignement|équilibr/i,
    window: 300,
    hint: 'must open with the overall security posture (defensive / expeditionary / neutral / alliance-dependent) and diplomatic orientation (aligned / non-aligned / hedging)',
  },
};

// [dot-path, rule kind] — nine enforced openers, NEW field names.
const OPENER_FIELDS = [
  ['territory.geography', 'geography'],
  ['territory.climate', 'climate'],
  ['society.demographics', 'demographics'],
  ['economy.realEconomy', 'realEconomy'],
  ['economy.politicalEconomy', 'politicalEconomy'],
  ['political.powerStructure', 'powerStructure'],
  ['political.constitutionalSubstrate', 'substrate'],
  ['capacity.inheritedTerrain', 'inheritedTerrain'],
  ['security.posture', 'posture'],
];

function openerProblem(kind, text) {
  const rule = OPENER_RULES[kind];
  const t = String(text ?? '').trim();
  if (!t) return null; // emptiness is reported by the citation check, not here
  let head;
  if (rule.beforeFirstDigit) {
    const i = t.search(/\d/);
    head = i === -1 ? t.slice(0, rule.window) : t.slice(0, i);
  } else {
    head = t.slice(0, rule.window);
  }
  return rule.re.test(head) ? null : rule.hint;
}

module.exports = { OPENER_RULES, OPENER_FIELDS, openerProblem };
