/*
 * Pointer detection (heuristic) — shared by
 * deepsearch-country-workflow.cjs (apply gate, HARD ERRORS) and
 * validate-country-citations.cjs (audit, warnings). ONE implementation.
 *
 * "Pointers are not content" (template rule, 2026-07-19; broadened 2026-07-31):
 * a sentence that cites a source only to name WHO holds or produces the data —
 * "unrest is tracked by ACLED [x]", "an ageing population documented by the CBO
 * [x]" — reports no figure and starves the derivative layers. The strengthened
 * prompt tells Pass B not to write these; this gate catches the ones that slip.
 *
 * The signal, deterministic and precise:
 *   (1) a "<pointer-verb> by/par <authority>" construction (data-production
 *       verbs only — not "characterised by", "governed by"), in EN or FR;
 *   (2) NO figure in the sentence (no digit outside the [citation] markers); and
 *   (3) EVERY source the sentence cites is figure-ABSENT in its field — i.e. the
 *       id never appears in a digit-bearing sentence of the same field.
 * Condition (3) is what keeps precision: "reserve figures are compiled by the
 * USGS [usgs-mcs-2026]" is source-metadata, not a starving pointer, because
 * usgs-mcs-2026 carries figures elsewhere in territory.minerals — so it is NOT
 * flagged. A source cited ONLY in a no-figure pointer sentence (the CBO in
 * society.demographics) gives the report nothing and IS flagged.
 *
 * Heuristic, not semantics — tuned to catch a starving pointer, not to grade a
 * written sentence.
 */

'use strict';

const CITATION_RE = /\[([a-z0-9][a-z0-9-]*)\]/gi;

// Data-production verbs in EN + FR, as passive "…by/par <authority>". Stems, so
// inflections (documented/documenté, compiled/compilé) match; \p{L}* (with /u)
// spans accented endings. Deliberately EXCLUDES relational verbs like
// "characterised/dominated/governed/held by" that are not data pointers.
const POINTER_VERB_RE =
  /(?:^|[^\p{L}])(?:document|track|suiv|compil|report|maintain|tenu|publi|catalog|répertori|recens|record|estim|assess|évalu|measur|mesur|monitor|collect|tabulat)\p{L}*\s+(?:by|par)\b/iu;

const DIGIT_RE = /\d/;

function splitSentences(text) {
  return String(text).split(/(?<=[.!?])\s+/g);
}

function idsIn(sentence) {
  const ids = [];
  const re = new RegExp(CITATION_RE.source, 'gi');
  let m;
  while ((m = re.exec(sentence)) !== null) ids.push(m[1].toLowerCase());
  return ids;
}

/**
 * Starving-pointer sentences in ONE prose field.
 * @param {string} text field prose (a single language)
 * @returns {Array<{index:number, sentence:string, starvingIds:string[]}>}
 *          empty array = clean.
 */
function pointerProblems(text) {
  const t = String(text ?? '');
  if (!t.trim()) return [];
  const sentences = splitSentences(t);

  // Which cited ids appear in at least one digit-bearing sentence of this field?
  const figureBearing = new Set();
  for (const s of sentences) {
    const bare = s.replace(CITATION_RE, ' ');
    if (DIGIT_RE.test(bare)) for (const id of idsIn(s)) figureBearing.add(id);
  }

  const out = [];
  sentences.forEach((s, i) => {
    const bare = s.replace(CITATION_RE, ' ');
    if (DIGIT_RE.test(bare)) return;          // carries a figure — not a pointer
    if (!POINTER_VERB_RE.test(s)) return;     // no data-production "…by" construction
    const ids = idsIn(s);
    if (ids.length === 0) return;             // no citation — nothing pointed at
    const starving = ids.filter((id) => !figureBearing.has(id));
    if (starving.length === ids.length) {     // NONE of the cited ids is figure-bearing here
      out.push({ index: i + 1, sentence: s.trim(), starvingIds: starving });
    }
  });
  return out;
}

module.exports = { pointerProblems, POINTER_VERB_RE };
