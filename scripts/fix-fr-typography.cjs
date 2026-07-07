#!/usr/bin/env node
/**
 * fix-fr-typography.cjs
 * ---------------------------------------------------------------------------
 * Canadian-French typography normalizer for country analysis YAML files.
 * Inserts the correct narrow no-break space (U+202F, "espace fine insécable")
 * in French text only, per Canadian French conventions:
 *
 *   • narrow NBSP before  :         (RÉGIME : ...  ->  RÉGIME<U+202F>: ...)
 *   • narrow NBSP inside  « »       (« texte »     ->  «<U+202F>texte<U+202F>»)
 *   • narrow NBSP before  —  (em dash, incise)     (mot — mot -> mot<U+202F>— mot)
 *   • narrow NBSP in number groups  (65 000        ->  65<U+202F>000)
 *   • narrow NBSP before  %, units, currencies     (3,2 % / 997 G$ / 5 km)
 *   • explicitly NOTHING before  ; ? !             (Canadian French)
 *
 * SAFE BY DESIGN:
 *   1. FRENCH ONLY. Only value lines of keys ending in `_fr` are touched
 *      (folded `>-` prose + the actors_*_fr / risks_fr JSON blocks). English
 *      `_en` blocks and the shared, English `sources:` block are left alone.
 *   2. STRUCTURAL SAFE. The colon rule only converts *an existing space* before
 *      `:` — YAML/JSON structural colons (`key:`, `"key":`) have no space before
 *      them, so they're never matched. Nothing inserts a space that isn't there
 *      (except inside « »). Key lines themselves are never transformed.
 *   3. INDENTATION SAFE. Every rule requires a non-space (or a digit) immediately
 *      before, so it can never eat a line's leading indentation. A line that
 *      STARTS with :/—/» (folded wrap) is merged up onto the previous prose line.
 *   4. VALIDATED. After editing, the file is re-parsed as YAML AND every JSON-in-
 *      text block is JSON.parsed. If either would break, the file is skipped.
 *   5. Dry-run by default; pass --write to apply. Idempotent (safe to re-run).
 *
 * Usage:
 *   node scripts/fix-fr-typography.cjs <file...>        # dry run
 *   node scripts/fix-fr-typography.cjs --all            # every country report (dry run)
 *   node scripts/fix-fr-typography.cjs --all --write    # apply
 * ---------------------------------------------------------------------------
 */
const fs = require('fs');
const path = require('path');

const NNBSP = ' ';                        // narrow no-break space (the target)
const S = '[ \\u00A0\\u2009\\u202F]';          // convertible spaces: regular, NBSP, thin, NNBSP

// Units to bind to a preceding number. Curated + conservative (bare m/g/l/t are
// intentionally excluded to avoid matching French words). Longest-first matters.
const UNITS = 'km/h|km²|km|m²|cm|mm|kg|°C|°F|°|Mt|Gt|kt|TWh|GWh|MWh|kWh|Wh|GW|MW|kW|TW|ha|hab';
// Currencies (Canadian French puts the symbol AFTER the number). Longest-first.
const CURRENCIES = 'G\\$|M\\$|k\\$|\\$|€|£|¥|¢';

const RULES = [
  // key,       regexp,                                                          replace
  ['number',    new RegExp(`(?<=\\d)${S}(?=\\d{3}(?:\\D|$))`, 'gu'),             () => NNBSP],
  ['currency',  new RegExp(`(?<=\\d)${S}*(${CURRENCIES})`, 'gu'),                (_m, u) => NNBSP + u],
  ['percent',   new RegExp(`(?<=\\d)${S}*%`, 'gu'),                              () => NNBSP + '%'],
  ['unit',      new RegExp(`(?<=\\d)${S}*(${UNITS})(?![A-Za-zÀ-ÿ])`, 'gu'), (_m, u) => NNBSP + u],
  ['colon',     new RegExp(`(?<=\\S)${S}+:`, 'gu'),                              () => NNBSP + ':'],
  ['emdash',    new RegExp(`(?<=\\S)${S}+—`, 'gu'),                         () => NNBSP + '—'],
  ['guillemet', new RegExp(`«${S}*(?=\\S)`, 'gu'),                          () => '«' + NNBSP],
  ['guillemet', new RegExp(`(?<=\\S)${S}*»`, 'gu'),                         () => NNBSP + '»'],
];

let YAML = null;
try { YAML = require('yaml'); } catch { try { YAML = require('js-yaml'); } catch { /* none */ } }

function loadYaml(text) { return YAML.parse ? YAML.parse(text) : YAML.load(text); }

// Re-parse as YAML, then JSON.parse every JSON-in-text block (actors/risks/sources).
function validate(text) {
  if (!YAML) return { ok: true, skipped: true };
  let doc;
  try { doc = loadYaml(text); } catch (e) { return { ok: false, error: 'YAML: ' + e.message.split('\n')[0] }; }
  for (const [k, v] of Object.entries(doc || {})) {
    if (typeof v !== 'string') continue;
    const t = v.trim();
    if (t.startsWith('[') || t.startsWith('{')) {
      try { JSON.parse(v); } catch (e) { return { ok: false, error: `JSON in ${k}: ${e.message.split('\n')[0]}` }; }
    }
  }
  return { ok: true };
}

function applyRules(line, counts) {
  for (const [key, re, fn] of RULES) {
    line = line.replace(re, (...args) => {
      const rep = fn(...args);
      if (rep !== args[0]) counts[key] = (counts[key] || 0) + 1; // count real changes only (idempotent)
      return rep;
    });
  }
  return line;
}

// True when a line ends in prose we can safely append punctuation to (not a key
// or a block-scalar opener like `foo_fr: >-`).
function isProseLineEnd(line) {
  const t = line.replace(/\s+$/, '');
  if (!t) return false;
  if (/[>|][+-]?$/.test(t)) return false;
  if (/:\s*$/.test(t)) return false;
  return true;
}

function fix(text) {
  const eol = /\r\n/.test(text) ? '\r\n' : '\n';
  const lines = text.split(/\r?\n/);
  const counts = {};
  const keyRe = /^([A-Za-z][\w]*)\s*:/;                                  // a top-level key line (col 0)
  const wrapRe = new RegExp(`^([ \\t]*)([:—»])${S}*(.*)$`, 'u'); // line that STARTS with :/—/»
  const candidates = [];
  let isFrench = false;

  for (let i = 0; i < lines.length; i++) {
    const km = lines[i].match(keyRe);
    if (km) { isFrench = km[1].endsWith('_fr'); continue; } // key line: set scope, never transform
    if (!isFrench) continue;                                // English / sources / etc.
    if (wrapRe.test(lines[i])) candidates.push(i);          // folded-wrap: handle after
    lines[i] = applyRules(lines[i], counts);
  }

  // Folded-wrap fix: a French prose line that STARTS with :/—/» means the space
  // before it is the folded newline. Move the punctuation up to the end of the
  // previous prose line (with the narrow NBSP) instead of dedenting it.
  const merged = [], flagged = [];
  for (const i of candidates) {
    const m = lines[i].match(wrapRe);
    const indent = m[1], punct = m[2], rest = m[3];
    let j = i - 1;
    while (j >= 0 && lines[j].trim() === '') j--;
    if (!rest || j < 0 || !isProseLineEnd(lines[j])) {
      flagged.push({ line: i + 1, text: lines[i].trim().slice(0, 72) });
      continue;
    }
    lines[j] = lines[j].replace(/\s+$/, '') + NNBSP + punct;
    lines[i] = indent + rest;
    merged.push({ line: i + 1, ontoLine: j + 1, punct });
  }

  return { text: lines.join(eol), counts, merged, flagged };
}

function countryFiles() {
  const root = path.join(process.cwd(), 'content', 'countries');
  if (!fs.existsSync(root)) return [];
  return fs.readdirSync(root)
    .map((d) => path.join(root, d, 'analysis.yaml'))
    .filter((p) => fs.existsSync(p))
    .map((p) => path.relative(process.cwd(), p));
}

function main() {
  const args = process.argv.slice(2);
  const write = args.includes('--write');
  const all = args.includes('--all');
  let files = args.filter((a) => !a.startsWith('--'));
  if (all) files = [...new Set([...files, ...countryFiles()])];

  if (files.length === 0) {
    console.log('Usage: node scripts/fix-fr-typography.cjs <file...> [--all] [--write]');
    process.exit(1);
  }

  let changed = 0, hadError = false, totalFlagged = 0;
  for (const file of files) {
    if (!fs.existsSync(file)) { console.log(`SKIP (not found): ${file}`); continue; }
    const original = fs.readFileSync(file, 'utf8');
    const res = fix(original);
    const out = res.text, c = res.counts;
    const total = Object.values(c).reduce((a, b) => a + b, 0);

    console.log(`\n${file}`);
    console.log('  narrow NBSP inserted: ' + total +
      (total ? '  {' + Object.entries(c).map(([k, v]) => `${k}:${v}`).join(', ') + '}' : ''));
    if (res.merged.length) {
      console.log(`  folded-wrap merged up: ${res.merged.length}  [` +
        res.merged.map((m) => `L${m.line}${m.punct}->L${m.ontoLine}`).join(', ') + ']');
    }
    if (res.flagged.length) {
      totalFlagged += res.flagged.length;
      console.log(`  ⚠ flagged (could not merge — review by hand): ${res.flagged.length}`);
      res.flagged.forEach((f) => console.log(`      L${f.line}: ${f.text}`));
    }

    if (out === original) { console.log('  no change'); continue; }

    const v = validate(out);
    if (v.skipped) console.log('  validation: skipped (no yaml lib)');
    else if (!v.ok) { console.log(`  ✗ would break — SKIPPING: ${v.error}`); hadError = true; continue; }
    else console.log('  validation: YAML + JSON blocks OK');

    if (write) { fs.writeFileSync(file, out, 'utf8'); console.log('  ✓ written'); }
    else console.log('  (dry run — re-run with --write to apply)');
    changed++;
  }

  console.log(`\nSummary: ${changed} file(s) ${write ? 'changed' : 'would change'}, ` +
    `${totalFlagged} line(s) flagged, ${hadError ? 'SOME FILES SKIPPED (would break)' : 'no errors'}.`);
  process.exit(hadError ? 1 : 0);
}

main();
