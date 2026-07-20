/*
 * Anchoring capability — shared by deepsearch-country-workflow.cjs (apply gate)
 * and validate-country-citations.cjs (audit). ONE implementation (rework spec §1).
 *
 * A claim that is DERIVED rather than observed cannot carry a [source-id] of its
 * own; it names the already-cited material it stands on. That pointer is an
 * anchor. Two target types:
 *   - source ids        [pbo-nato-5-percent-2026]   (lowercase-alphanumeric-hyphens)
 *   - field paths       [territory.climate]          (dot-separated camelCase)
 * The DOT is the discriminator: source ids may not contain dots or uppercase;
 * field paths always contain at least one dot — with ONE reserved exception:
 * the bare word `situation` is a field path (the event layer has no peer
 * prefix). No source may ever use the id `situation`.
 *
 * Rules (decided; see country-report-rework-IMPLEMENTATION.md §1 + rulings):
 *   - A field-path anchor must resolve to a field that exists and is non-empty
 *     in this country's report. An anchor to an empty/missing field is a GHOST
 *     ANCHOR: hard error, same class as a ghost citation.
 *   - Compose-order constraint: an anchored field may only anchor to fields
 *     composed BEFORE it (no circular or self-anchors). Explicit allowed sets:
 *     capacity.inheritedTerrain → territory.* / society.* / economy.* only;
 *     security.posture → the four other security fields only.
 *   - EN/FR anchor parity is a MANUAL check (same treatment as citation parity).
 *   - baseline carries NO field-path anchors (derivative prose, kept clean).
 */

'use strict';

// Canonical COMPOSE order (33 fields, new names) + situation as a target.
// Display order differs deliberately: posture displays first in Security but is
// composed last there; the scorecard and baseline are composed after everything.
const FIELD_COMPOSE_ORDER = [
  'territory.geography', 'territory.biosphere', 'territory.minerals',
  'territory.climate', 'territory.metabolism', 'territory.transition',
  'society.demographics', 'society.composition', 'society.language',
  'society.religion', 'society.wellbeing', 'society.cohesion',
  'economy.realEconomy', 'economy.publicFinances',
  'economy.externalVulnerability', 'economy.politicalEconomy',
  'political.powerStructure', 'political.rightsAndChecks',
  'political.stabilityDrivers', 'political.shockAbsorbers',
  'political.constitutionalSubstrate', 'political.stateStructure',
  'capacity.inheritedTerrain', 'capacity.steering', 'capacity.approvals',
  'capacity.delivery', 'capacity.publicServices', 'capacity.productivity',
  'security.internal', 'security.military', 'security.transnationalExposure',
  'security.diplomacy', 'security.posture',
  'situation',
  // Gap register (2026-07-20): composed by the derivatives pass AFTER the
  // situation layer, so it sits last and may anchor any field above it.
  'capacity.knownAndUnbuilt',
];

const FIELD_INDEX = new Map(FIELD_COMPOSE_ORDER.map((p, i) => [p, i]));

// Explicit allowed-target sets (override the generic composed-before rule).
const ALLOWED_TARGETS = {
  'capacity.inheritedTerrain': (t) =>
    t.startsWith('territory.') || t.startsWith('society.') || t.startsWith('economy.'),
  'security.posture': (t) =>
    ['security.internal', 'security.military', 'security.transnationalExposure', 'security.diplomacy'].includes(t),
};

// Fields that may not carry field-path anchors at all.
const NO_ANCHOR_FIELDS = new Set(['baseline']);

// One scan regex for BOTH marker kinds. Source ids: [a-z0-9-]+ (enforced
// strictly — no dots, no uppercase). Field paths: dot-separated camelCase.
const MARKER_RE = /\[([a-z0-9-]+|[a-z][a-zA-Z0-9]*(?:\.[a-z][a-zA-Z0-9]*)+)\]/g;

function extractMarkers(text) {
  const out = [];
  let m;
  MARKER_RE.lastIndex = 0;
  while ((m = MARKER_RE.exec(String(text ?? ''))) !== null) {
    // `situation` is the one dotless field path (reserved — never a source id).
    out.push({ raw: m[1], type: m[1].includes('.') || m[1] === 'situation' ? 'field' : 'source' });
  }
  return out;
}

/**
 * Validate the field-path anchors inside one narrative field.
 * @param fieldPath  dot path of the field being validated (e.g. 'capacity.inheritedTerrain');
 *                   pass the path WITHOUT language suffix. Use 'baseline' for the baseline.
 * @param label      label used in messages (may include language, e.g. 'capacity.inheritedTerrain.en')
 * @param text       the field's text
 * @param resolveField(path) → boolean  true when the target field exists AND is
 *                   non-empty in this country's report (same language side).
 * @param errors     array to push hard errors into
 */
function validateFieldAnchors(fieldPath, label, text, resolveField, errors) {
  const anchors = extractMarkers(text).filter((x) => x.type === 'field');
  if (!anchors.length) return;

  if (NO_ANCHOR_FIELDS.has(fieldPath)) {
    errors.push(`${label}: baseline carries no field-path anchors (derivative prose) — remove [${anchors[0].raw}]`);
    return;
  }

  const selfIdx = FIELD_INDEX.get(fieldPath);
  const allowed = ALLOWED_TARGETS[fieldPath];

  for (const { raw } of anchors) {
    if (!FIELD_INDEX.has(raw)) {
      errors.push(`${label}: unknown anchor target [${raw}] — not a report field`);
      continue;
    }
    if (raw === fieldPath) {
      errors.push(`${label}: self-anchor [${raw}] is not allowed`);
      continue;
    }
    if (allowed) {
      if (!allowed(raw)) {
        errors.push(`${label}: anchor [${raw}] outside this field's allowed target set`);
        continue;
      }
    } else if (selfIdx !== undefined && FIELD_INDEX.get(raw) >= selfIdx) {
      errors.push(`${label}: anchor [${raw}] targets a field composed after ${fieldPath} — anchors may only point at fields composed before`);
      continue;
    }
    if (!resolveField(raw)) {
      errors.push(`${label}: GHOST ANCHOR [${raw}] — target field is empty or missing in this report (same class as a ghost citation)`);
    }
  }
}

const SCORECARD_AXES = [
  'eliteCohesion', 'socialCohesion', 'securityLoyalty',
  'economicPressure', 'protestCapacity', 'institutionalResilience',
];

/**
 * Validate scorecard_anchors JSON-in-text: { axis: { anchors: [...], rationale_en, rationale_fr } }.
 * Migration is WARNING-FIRST (spec §4): a missing axis entry / missing anchors /
 * missing rationale warns; a present-but-unresolvable anchor is a HARD error
 * (ghost class). Source-id anchors resolve against sourceIds; field-path anchors
 * against resolveField.
 */
function validateScorecardAnchors(jsonText, { sourceIds, resolveField, errors, warnings }) {
  const t = String(jsonText ?? '').trim();
  if (!t) {
    warnings.push('scorecard_anchors missing — each axis should carry >=1 anchor + a rationale (warning-first migration)');
    return;
  }
  let obj;
  try { obj = JSON.parse(t); } catch (e) {
    errors.push(`scorecard_anchors: JSON does not parse (${e.message.split('\n')[0]})`);
    return;
  }
  for (const axis of SCORECARD_AXES) {
    const entry = obj?.[axis];
    if (!entry) { warnings.push(`scorecard_anchors.${axis}: missing (needs anchors + rationale)`); continue; }
    const anchors = Array.isArray(entry.anchors) ? entry.anchors : [];
    if (!anchors.length) warnings.push(`scorecard_anchors.${axis}: no anchors — the rating must name the cited facts it summarises`);
    for (const a of anchors) {
      const s = String(a ?? '');
      if (s.includes('.') || s === 'situation') {
        if (!FIELD_INDEX.has(s)) errors.push(`scorecard_anchors.${axis}: unknown anchor target [${s}]`);
        else if (!resolveField(s)) errors.push(`scorecard_anchors.${axis}: GHOST ANCHOR [${s}] — target field empty or missing`);
      } else if (!sourceIds.has(s)) {
        errors.push(`scorecard_anchors.${axis}: GHOST ANCHOR [${s}] — no such source id`);
      }
    }
    if (!String(entry.rationale_en ?? '').trim()) warnings.push(`scorecard_anchors.${axis}: rationale_en missing`);
    if (!String(entry.rationale_fr ?? '').trim()) warnings.push(`scorecard_anchors.${axis}: rationale_fr missing`);
  }
}

module.exports = {
  FIELD_COMPOSE_ORDER,
  FIELD_INDEX,
  SCORECARD_AXES,
  MARKER_RE,
  extractMarkers,
  validateFieldAnchors,
  validateScorecardAnchors,
};
