/**
 * apply-mineral-delta.cjs
 *
 * Reads a delta table from an Excel (.xlsx) file produced by Step 2 of the
 * critical-minerals refresh playbook, and rewrites
 * src/data/criticalMineralsMapData.ts with the updated share figures.
 *
 * Expected columns (case-insensitive, order flexible):
 *   mineral_id | mode | country_iso3 | old_share | new_share | source_table
 *
 * Usage:
 *   node scripts/apply-mineral-delta.cjs <path-to-delta.xlsx>
 *   node scripts/apply-mineral-delta.cjs            (looks for delta.xlsx in project root)
 *
 * Rows where new_share is "NO CHANGE", blank, or omitted are skipped.
 * A new_share of 0 removes the country from that mineral/mode.
 * New countries (not currently in the data) are appended and sorted by share desc.
 * Existing notes are preserved unless overwritten by a note column in the delta.
 */

"use strict";

const XLSX  = require("xlsx");
const fs    = require("fs");
const path  = require("path");
const vm    = require("vm");

// ─── Paths ────────────────────────────────────────────────────────────────────

const ROOT      = path.join(__dirname, "..");
const DATA_FILE = path.join(ROOT, "src", "data", "criticalMineralsMapData.ts");
const deltaPath = process.argv[2] || path.join(ROOT, "delta.xlsx");

if (!fs.existsSync(deltaPath)) {
  console.error(`ERROR: Delta file not found: ${deltaPath}`);
  console.error("Usage: node scripts/apply-mineral-delta.cjs <path-to-delta.xlsx>");
  process.exit(1);
}

// ─── 1. Read delta table ──────────────────────────────────────────────────────

const workbook = XLSX.readFile(deltaPath);
const sheet    = workbook.Sheets[workbook.SheetNames[0]];
const raw      = XLSX.utils.sheet_to_json(sheet, { defval: "" });

if (raw.length === 0) {
  console.error("ERROR: Delta spreadsheet appears to be empty.");
  process.exit(1);
}

// Normalise column names: lowercase, trim, collapse spaces/underscores
function normaliseKey(k) {
  return String(k).toLowerCase().trim().replace(/[\s_]+/g, "_");
}

// Find the real column name for a normalised key
function findCol(headers, normTarget) {
  return headers.find(h => normaliseKey(h) === normTarget);
}

const headers = Object.keys(raw[0]);
const COL = {
  mineralId:   findCol(headers, "mineral_id"),
  mode:        findCol(headers, "mode"),
  countryIso3: findCol(headers, "country_iso3"),
  oldShare:    findCol(headers, "old_share"),
  newShare:    findCol(headers, "new_share"),
  sourceTable: findCol(headers, "source_table"),
  note:        findCol(headers, "note"),
};

const missing = Object.entries(COL)
  .filter(([k, v]) => !v && k !== "sourceTable" && k !== "note")
  .map(([k]) => k);

if (missing.length > 0) {
  console.error("ERROR: Could not find required columns:", missing.join(", "));
  console.error("Columns found in sheet:", headers.join(", "));
  process.exit(1);
}

// ─── 2. Parse delta rows ──────────────────────────────────────────────────────

const deltas = [];

for (const row of raw) {
  const mineralId   = String(row[COL.mineralId]   || "").trim().toLowerCase();
  const mode        = String(row[COL.mode]         || "").trim().toLowerCase();
  const countryIso3 = String(row[COL.countryIso3]  || "").trim().toUpperCase();
  const newShareRaw = String(row[COL.newShare]      || "").trim();
  const noteVal     = COL.note ? String(row[COL.note] || "").trim() : "";

  // Skip header-repeat rows or empty rows
  if (!mineralId || mineralId === "mineral_id") continue;

  // Skip NO CHANGE rows
  if (!newShareRaw || /^no[\s_]?change$/i.test(newShareRaw)) continue;

  if (mode !== "production" && mode !== "reserves") {
    console.warn(`WARN: Unrecognised mode "${mode}" for ${mineralId}/${countryIso3} — skipping`);
    continue;
  }

  if (!/^[A-Z]{3}$/.test(countryIso3)) {
    console.warn(`WARN: "${countryIso3}" does not look like an ISO-3 code — skipping`);
    continue;
  }

  // Handle both "50.5" (EN) and "50,5" (FR locale) decimal formats
  const newShareNum = parseFloat(newShareRaw.replace(",", "."));
  const newShare = Math.round(newShareNum);
  if (isNaN(newShare) || newShare < 0 || newShare > 100) {
    console.warn(`WARN: Invalid new_share "${newShareRaw}" for ${mineralId}/${mode}/${countryIso3} — skipping`);
    continue;
  }

  deltas.push({ mineralId, mode, countryIso3, newShare, note: noteVal });
}

if (deltas.length === 0) {
  console.log("No actionable delta rows found. Nothing to update.");
  process.exit(0);
}

console.log(`Parsed ${deltas.length} actionable delta row(s).`);

// ─── 3. Load current MINERAL_DATA via vm ─────────────────────────────────────

const tsSource = fs.readFileSync(DATA_FILE, "utf8");

// Strip TypeScript-only syntax so vm can evaluate it as plain JS
const jsSource = tsSource
  .replace(/^export type [^\n]+(\n\s+[^\n]+)*\n\};?/gm, "")  // multi-line type blocks
  .replace(/^export type [^;]+;$/gm, "")                       // single-line type aliases
  .replace(/: MineralViewMode|: MineralShareEntry|: MineralCountryShares|: MineralSeries|: MineralDataMap/g, "")
  .replace(/^export const /gm, "var ");

const sandbox = Object.create(null);
try {
  vm.runInNewContext(jsSource, sandbox);
} catch (e) {
  console.error("ERROR: Could not evaluate data file as JS:", e.message);
  process.exit(1);
}

const mineralData = sandbox.MINERAL_DATA;
if (!mineralData || typeof mineralData !== "object") {
  console.error("ERROR: MINERAL_DATA not found after evaluating data file.");
  process.exit(1);
}

// ─── 4. Apply deltas ──────────────────────────────────────────────────────────

const log = { updated: [], added: [], removed: [], skipped: [] };

for (const { mineralId, mode, countryIso3, newShare, note } of deltas) {
  if (!mineralData[mineralId]) {
    log.skipped.push(`${mineralId} — not a known mineral ID`);
    continue;
  }
  if (!mineralData[mineralId][mode]) {
    log.skipped.push(`${mineralId}/${mode} — mode object missing`);
    continue;
  }

  const series = mineralData[mineralId][mode];

  if (newShare === 0) {
    if (series[countryIso3]) {
      delete series[countryIso3];
      log.removed.push(`${mineralId}/${mode}/${countryIso3}`);
    }
  } else if (series[countryIso3]) {
    const old = series[countryIso3].share;
    series[countryIso3].share = newShare;
    if (note) series[countryIso3].note = note;
    log.updated.push(`${mineralId}/${mode}/${countryIso3}: ${old} → ${newShare}`);
  } else {
    series[countryIso3] = note ? { share: newShare, note } : { share: newShare };
    log.added.push(`${mineralId}/${mode}/${countryIso3}: ${newShare} (new)`);
  }
}

// ─── 5. Sort each series by share descending ──────────────────────────────────

for (const mineral of Object.keys(mineralData)) {
  for (const mode of ["production", "reserves"]) {
    if (!mineralData[mineral][mode]) continue;
    const entries = Object.entries(mineralData[mineral][mode]);
    entries.sort(([, a], [, b]) => b.share - a.share);
    mineralData[mineral][mode] = Object.fromEntries(entries);
  }
}

// ─── 6. Regenerate criticalMineralsMapData.ts ─────────────────────────────────

function formatEntry([iso3, entry]) {
  if (entry.note) {
    return `${iso3}: { share: ${entry.share}, note: ${JSON.stringify(entry.note)} }`;
  }
  return `${iso3}: { share: ${entry.share} }`;
}

function formatSeries(series) {
  return Object.entries(series).map(formatEntry).join(", ");
}

const lines = [
  `export type MineralViewMode = "production" | "reserves";`,
  ``,
  `export type MineralShareEntry = {`,
  `  share: number;`,
  `  note?: string;`,
  `};`,
  ``,
  `export type MineralCountryShares = Record<string, MineralShareEntry>;`,
  ``,
  `export type MineralSeries = Record<MineralViewMode, MineralCountryShares>;`,
  ``,
  `export type MineralDataMap = Record<string, MineralSeries>;`,
  ``,
  `// USGS MCS 2026 (2025 figures), curated for map rendering.`,
  `export const MINERAL_DATA: MineralDataMap = {`,
];

for (const [mineral, data] of Object.entries(mineralData)) {
  lines.push(`  ${mineral}: {`);
  lines.push(`    production: { ${formatSeries(data.production)} },`);
  lines.push(`    reserves: { ${formatSeries(data.reserves)} },`);
  lines.push(`  },`);
}

lines.push(`};`);
lines.push(``);

const output = lines.join("\n");
fs.writeFileSync(DATA_FILE, output, "utf8");

// ─── 7. Summary ───────────────────────────────────────────────────────────────

console.log("\n=== Apply Mineral Delta — Summary ===");
if (log.updated.length)  console.log(`\nUpdated (${log.updated.length}):\n  ` + log.updated.join("\n  "));
if (log.added.length)    console.log(`\nAdded   (${log.added.length}):\n  `   + log.added.join("\n  "));
if (log.removed.length)  console.log(`\nRemoved (${log.removed.length}):\n  ` + log.removed.join("\n  "));
if (log.skipped.length)  console.log(`\nSkipped (${log.skipped.length}):\n  ` + log.skipped.join("\n  "));

console.log(`\nData file written: src/data/criticalMineralsMapData.ts`);
console.log(`Next step: npm run validate:critical-minerals`);
