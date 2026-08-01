/*
 * Element-coverage heuristic (warning-level) — the keyword slice of the element
 * registry. Used by validate-country-citations.cjs.
 *
 * The required elements and their keyword signatures now live in ONE place,
 * scripts/lib/field-elements.cjs (KEYWORD_ELEMENTS, the enumerable subset). A
 * field whose prose matches NONE of an element's keywords is flagged as possibly
 * missing that element. Keyword coverage, NOT semantics: it catches a whole
 * element OMITTED (publicFinances that never names a credit rating), not a thin
 * one. Descriptive elements have no keyword and are checked only by the
 * coverage-MAP gate at apply, not here.
 *
 * A flag is a prompt to LOOK, never a verdict: a country with no nuclear force
 * SHOULD still say so, so "military names no nuclear status" is worth a glance
 * even when the honest answer is "none".
 */

'use strict';

const { KEYWORD_ELEMENTS } = require('./field-elements.cjs');

/**
 * Elements possibly missing from a field's prose.
 * @param {string} baseKey e.g. 'economy_publicFinances' (peer_field, no _en/_fr)
 * @param {string} text field prose (one language)
 * @returns {string[]} element labels with no keyword match; [] if field not tracked or all present.
 */
function coverageProblems(baseKey, text) {
  const elements = KEYWORD_ELEMENTS[baseKey];
  if (!elements) return [];
  const t = String(text ?? '');
  if (!t.trim()) return [];
  return elements.filter(([, re]) => !re.test(t)).map(([label]) => label);
}

module.exports = { coverageProblems, KEYWORD_ELEMENTS };
