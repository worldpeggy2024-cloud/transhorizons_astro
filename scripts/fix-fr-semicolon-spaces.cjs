#!/usr/bin/env node
/**
 * fix-fr-semicolon-spaces.cjs
 * ---------------------------------------------------------------------------
 * Removes the space before ';' — a France-French typographic habit that is NOT
 * used in Canadian French. Targets ';' ONLY (never ':', '?', '!', '«/»', '%',
 * which follow different rules in Canadian French).
 *
 * Safe by design:
 *   1. It only removes a space that sits BETWEEN a non-space character and ';'
 *      (`mot ;` -> `mot;`), so it can never eat a line's leading indentation.
 *   2. It handles the folded-scalar (`>-`) line-wrap case: when a wrapped line
 *      *begins* with ';', the "space" before it is actually the folded newline.
 *      There it moves the ';' up to the end of the previous prose line instead
 *      of dedenting (dedenting is what broke the CAN file the first time).
 *   3. It never writes YAML that fails to parse — each file is re-parsed after
 *      the edit and skipped (with an error) if it would break.
 *   4. Dry-run by default. Pass --write to apply.
 *
 * English text is unaffected in practice: English never puts a space before ';'.
 *
 * Usage:
 *   node scripts/fix-fr-semicolon-spaces.cjs <file...>          # dry run
 *   node scripts/fix-fr-semicolon-spaces.cjs --all              # every content/countries/<ISO3>/analysis.yaml (dry run)
 *   node scripts/fix-fr-semicolon-spaces.cjs --all --write      # apply
 *   node scripts/fix-fr-semicolon-spaces.cjs content/pages/x.yaml --write
 * ---------------------------------------------------------------------------
 */
const fs = require('fs');
const path = require('path');

// Space variants treated as "a space before ;": regular, NBSP, narrow NBSP, thin.
const SP = ' \\u00A0\\u202F\\u2009';
const MIDLINE = new RegExp(`(\\S)[${SP}]+;`, 'g');          // "mot ;"  -> "mot;"
const LEADING_SEMI = new RegExp(`^[${SP}]*;[${SP}]*(.*)$`); // line whose first non-space char is ';'

// Prefer the 'yaml' package (what Astro/Keystatic use); fall back to js-yaml.
let YAML = null;
try { YAML = require('yaml'); } catch { try { YAML = require('js-yaml'); } catch { /* none */ } }

function yamlParses(text) {
  if (!YAML) return { ok: true, skipped: true };
  try { (YAML.parse ? YAML.parse : YAML.load)(text); return { ok: true }; }
  catch (e) { return { ok: false, error: e.message.split('\n')[0] }; }
}

// True when a line ends in prose we can safely append ';' to (not a key or a
// block-scalar opener like `foo_fr: >-`).
function isProseLineEnd(line) {
  const t = line.replace(/\s+$/, '');
  if (!t) return false;
  if (/[>|][+-]?$/.test(t)) return false; // block scalar indicator
  if (/:\s*$/.test(t)) return false;      // "key:"
  return true;
}

function fix(text) {
  const eol = /\r\n/.test(text) ? '\r\n' : '\n';
  const lines = text.split(/\r?\n/);
  const stats = { midline: 0, merged: [], flagged: [] };

  // Pass 1 — mid-line spaces before ';' (never touches leading indentation).
  for (let i = 0; i < lines.length; i++) {
    lines[i] = lines[i].replace(MIDLINE, (_m, before) => { stats.midline++; return before + ';'; });
  }

  // Pass 2 — folded-scalar wrap: a line that starts with ';'.
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(LEADING_SEMI);
    if (!m) continue;
    const rest = m[1];
    if (!rest) { stats.flagged.push({ line: i + 1, text: lines[i], why: 'lone ";" line' }); continue; }
    let j = i - 1;
    while (j >= 0 && lines[j].trim() === '') j--;
    if (j < 0 || !isProseLineEnd(lines[j])) {
      stats.flagged.push({ line: i + 1, text: lines[i], why: 'no prose line above to merge onto' });
      continue;
    }
    const prevIndent = (lines[j].match(/^[ \t]*/) || [''])[0]; // scalar indentation
    lines[j] = lines[j].replace(/\s+$/, '') + ';';
    lines[i] = prevIndent + rest;
    stats.merged.push({ line: i + 1, ontoLine: j + 1 });
  }

  return { text: lines.join(eol), stats };
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
    console.log('Usage: node scripts/fix-fr-semicolon-spaces.cjs <file...> [--all] [--write]');
    console.log('  --all    target every content/countries/<ISO3>/analysis.yaml');
    console.log('  --write  apply changes (omit for a dry run)');
    process.exit(1);
  }

  let totalChanged = 0, hadError = false, totalFlagged = 0;
  for (const file of files) {
    if (!fs.existsSync(file)) { console.log(`SKIP (not found): ${file}`); continue; }
    const original = fs.readFileSync(file, 'utf8');
    const { text, stats } = fix(original);
    const changed = text !== original;
    const isYaml = /\.ya?ml$/i.test(file);

    console.log(`\n${file}`);
    console.log(`  before-';' spaces removed (mid-line): ${stats.midline}`);
    console.log(`  wrapped ';' merged up: ${stats.merged.length}` +
      (stats.merged.length ? '  [' + stats.merged.map((m) => `L${m.line}->L${m.ontoLine}`).join(', ') + ']' : ''));
    if (stats.flagged.length) {
      totalFlagged += stats.flagged.length;
      console.log(`  ⚠ flagged for manual review: ${stats.flagged.length}`);
      stats.flagged.forEach((f) => console.log(`      L${f.line} (${f.why}): ${f.text.trim().slice(0, 70)}`));
    }

    if (!changed) { console.log('  no change'); continue; }

    if (isYaml) {
      const p = yamlParses(text);
      if (p.skipped) console.log('  YAML parse check: skipped (no yaml lib)');
      else if (!p.ok) {
        console.log(`  ✗ YAML would NOT parse after change — SKIPPING file: ${p.error}`);
        hadError = true;
        continue;
      } else console.log('  YAML parse check: OK');
    }

    if (write) { fs.writeFileSync(file, text, 'utf8'); console.log('  ✓ written'); }
    else console.log('  (dry run — re-run with --write to apply)');
    totalChanged++;
  }

  console.log(`\nSummary: ${totalChanged} file(s) ${write ? 'changed' : 'would change'}, ` +
    `${totalFlagged} line(s) flagged, ${hadError ? 'SOME FILES SKIPPED (parse errors)' : 'no errors'}.`);
  process.exit(hadError ? 1 : 0);
}

main();
