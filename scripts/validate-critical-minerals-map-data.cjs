const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { pathToFileURL } = require("node:url");

function isIsoDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
}

function daysBetween(dateA, dateB) {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((dateA.getTime() - dateB.getTime()) / msPerDay);
}

async function loadMetadata(rootDir) {
  const modulePath = path.resolve(rootDir, "src/data/criticalMineralsMapMetadata.js");
  if (!fs.existsSync(modulePath)) {
    throw new Error(`Missing metadata module: ${modulePath}`);
  }

  const moduleUrl = pathToFileURL(modulePath).href;
  const mod = await import(moduleUrl);
  return mod.CRITICAL_MINERALS_MAP_METADATA;
}

function loadMineralData(rootDir) {
  const datasetPath = path.resolve(rootDir, "src/data/criticalMineralsMapData.ts");
  if (!fs.existsSync(datasetPath)) {
    throw new Error(`Missing dataset module: ${datasetPath}`);
  }

  const tsSource = fs.readFileSync(datasetPath, "utf8");

  const constStart = tsSource.indexOf("export const MINERAL_DATA");
  if (constStart === -1) {
    throw new Error("Unable to find export const MINERAL_DATA in criticalMineralsMapData.ts");
  }

  // Evaluate only the data constant to avoid TypeScript-only declarations.
  let jsSource = tsSource.slice(constStart);
  jsSource = jsSource.replace(
    /export\s+const\s+MINERAL_DATA\s*:\s*MineralDataMap\s*=/,
    "const MINERAL_DATA ="
  );

  const wrapped = `${jsSource}\nmodule.exports = { MINERAL_DATA };`;
  const sandbox = { module: { exports: {} }, exports: {} };
  vm.runInNewContext(wrapped, sandbox, { filename: datasetPath });

  return sandbox.module.exports.MINERAL_DATA;
}

function loadMineralIdsFromComponent(rootDir) {
  const componentPath = path.resolve(rootDir, "src/pages-react/CriticalMineralsMap.tsx");
  if (!fs.existsSync(componentPath)) {
    throw new Error(`Missing map component: ${componentPath}`);
  }

  const source = fs.readFileSync(componentPath, "utf8");
  const start = source.indexOf("const MINERALS = [");
  if (start === -1) {
    throw new Error("Unable to find const MINERALS block in CriticalMineralsMap.tsx");
  }

  const end = source.indexOf("];", start);
  if (end === -1) {
    throw new Error("Unable to parse MINERALS block end in CriticalMineralsMap.tsx");
  }

  const block = source.slice(start, end);
  const ids = new Set();
  const idRegex = /id:\s*"([^"]+)"/g;
  let match;
  while ((match = idRegex.exec(block)) !== null) {
    ids.add(match[1]);
  }

  return ids;
}

function getKeyCheckMode() {
  const mode = process.env.STRICT_MINERAL_KEY_CHECK;
  if (mode === "off") return "off";
  if (mode === "warn") return "warn";
  if (mode === "error") return "error";
  return process.env.CI ? "error" : "warn";
}

function validateMineralKeyConsistency(componentIds, dataset, errors, warnings) {
  const mode = getKeyCheckMode();
  if (mode === "off") {
    return;
  }

  const datasetIds = new Set(Object.keys(dataset || {}));
  const missingInDataset = [...componentIds].filter((id) => !datasetIds.has(id)).sort();
  const extraInDataset = [...datasetIds].filter((id) => !componentIds.has(id)).sort();

  if (missingInDataset.length === 0 && extraInDataset.length === 0) {
    return;
  }

  const message = [
    "Mineral key mismatch between component selector and dataset.",
    missingInDataset.length > 0 ? `Missing in dataset: ${missingInDataset.join(", ")}` : null,
    extraInDataset.length > 0 ? `Extra in dataset: ${extraInDataset.join(", ")}` : null,
    `Mode=${mode} (set STRICT_MINERAL_KEY_CHECK=off|warn|error to override).`,
  ].filter(Boolean).join(" ");

  if (mode === "error") {
    errors.push(message);
  } else {
    warnings.push(message);
  }
}

function validateMineralData(dataset, errors, warnings) {
  if (!dataset || typeof dataset !== "object" || Array.isArray(dataset)) {
    errors.push("MINERAL_DATA must be an object.");
    return;
  }

  const mineralEntries = Object.entries(dataset);
  if (mineralEntries.length < 30) {
    errors.push(`MINERAL_DATA looks incomplete: found ${mineralEntries.length} minerals.`);
  }

  for (const [mineralId, series] of mineralEntries) {
    if (!series || typeof series !== "object" || Array.isArray(series)) {
      errors.push(`Mineral ${mineralId} must map to an object.`);
      continue;
    }

    const hasProduction = Object.prototype.hasOwnProperty.call(series, "production");
    const hasReserves = Object.prototype.hasOwnProperty.call(series, "reserves");
    if (!hasProduction || !hasReserves) {
      errors.push(`Mineral ${mineralId} must include both production and reserves.`);
      continue;
    }

    for (const mode of ["production", "reserves"]) {
      const countryData = series[mode];
      if (!countryData || typeof countryData !== "object" || Array.isArray(countryData)) {
        errors.push(`Mineral ${mineralId}.${mode} must be an object.`);
        continue;
      }

      const countries = Object.entries(countryData);
      if (countries.length === 0) {
        errors.push(`Mineral ${mineralId}.${mode} must not be empty.`);
        continue;
      }

      let shareSum = 0;
      for (const [countryCode, entry] of countries) {
        if (!/^[A-Z]{3}$/.test(countryCode)) {
          errors.push(`Mineral ${mineralId}.${mode} has invalid country code: ${countryCode}`);
        }

        if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
          errors.push(`Mineral ${mineralId}.${mode}.${countryCode} must be an object.`);
          continue;
        }

        if (!Number.isFinite(entry.share)) {
          errors.push(`Mineral ${mineralId}.${mode}.${countryCode}.share must be a number.`);
          continue;
        }

        if (entry.share < 0 || entry.share > 100) {
          errors.push(`Mineral ${mineralId}.${mode}.${countryCode}.share must be between 0 and 100.`);
        }

        if (Object.prototype.hasOwnProperty.call(entry, "note") && typeof entry.note !== "string") {
          errors.push(`Mineral ${mineralId}.${mode}.${countryCode}.note must be a string when present.`);
        }

        shareSum += entry.share;
      }

      if (shareSum > 120) {
        errors.push(`Mineral ${mineralId}.${mode} share sum is suspiciously high: ${shareSum.toFixed(2)}.`);
      } else if (shareSum > 100) {
        warnings.push(`Mineral ${mineralId}.${mode} share sum is above 100 (${shareSum.toFixed(2)}), likely due to rounding or overlapping estimates.`);
      }
    }
  }
}

async function main() {
  const rootDir = process.cwd();
  const errors = [];
  const warnings = [];

  const metadata = await loadMetadata(rootDir);
  const dataset = loadMineralData(rootDir);
  const componentMineralIds = loadMineralIdsFromComponent(rootDir);

  if (!metadata || typeof metadata !== "object") {
    errors.push("CRITICAL_MINERALS_MAP_METADATA must export an object.");
  }

  if (!metadata.datasetVersion || typeof metadata.datasetVersion !== "string") {
    errors.push("datasetVersion is required and must be a string.");
  }

  if (!Number.isInteger(metadata.dataYear) || metadata.dataYear < 2000) {
    errors.push("dataYear must be an integer >= 2000.");
  }

  if (!isIsoDate(metadata.lastUpdated)) {
    errors.push("lastUpdated must be an ISO date (YYYY-MM-DD).");
  }

  if (!isIsoDate(metadata.sourceLastVerified)) {
    errors.push("sourceLastVerified must be an ISO date (YYYY-MM-DD).");
  }

  if (!Number.isInteger(metadata.staleAfterDays) || metadata.staleAfterDays <= 0) {
    errors.push("staleAfterDays must be a positive integer.");
  }

  if (!metadata.geometryPath || typeof metadata.geometryPath !== "string" || !metadata.geometryPath.startsWith("/")) {
    errors.push("geometryPath must be a root-relative path, for example /countries-110m.json.");
  } else {
    const localGeometryPath = path.resolve(rootDir, "public", metadata.geometryPath.replace(/^\//, ""));
    if (!fs.existsSync(localGeometryPath)) {
      errors.push(`geometryPath does not exist in public/: ${metadata.geometryPath}`);
    }
  }

  if (!Array.isArray(metadata.sources) || metadata.sources.length < 3) {
    errors.push("sources must contain at least 3 source entries.");
  } else {
    const seenIds = new Set();
    for (const source of metadata.sources) {
      if (!source.id || typeof source.id !== "string") {
        errors.push("Each source requires a string id.");
        continue;
      }

      if (seenIds.has(source.id)) {
        errors.push(`Duplicate source id: ${source.id}`);
      }
      seenIds.add(source.id);

      if (!source.label || typeof source.label !== "string") {
        errors.push(`Source ${source.id} is missing label.`);
      }

      if (!source.url || typeof source.url !== "string" || !source.url.startsWith("https://")) {
        errors.push(`Source ${source.id} must use an https URL.`);
      }

      if (!source.cadence || typeof source.cadence !== "string") {
        warnings.push(`Source ${source.id} has no cadence.`);
      }
    }
  }

  if (isIsoDate(metadata.sourceLastVerified) && Number.isInteger(metadata.staleAfterDays) && metadata.staleAfterDays > 0) {
    const today = new Date();
    const verified = new Date(`${metadata.sourceLastVerified}T00:00:00Z`);
    const ageDays = daysBetween(today, verified);

    if (ageDays > metadata.staleAfterDays) {
      errors.push(
        `Source verification is stale: ${ageDays} days old, exceeds staleAfterDays=${metadata.staleAfterDays}.`
      );
    } else if (ageDays > Math.floor(metadata.staleAfterDays * 0.8)) {
      warnings.push(
        `Source verification is approaching stale threshold: ${ageDays}/${metadata.staleAfterDays} days.`
      );
    }
  }

  validateMineralData(dataset, errors, warnings);
  validateMineralKeyConsistency(componentMineralIds, dataset, errors, warnings);

  if (warnings.length > 0) {
    console.warn("[critical-minerals] warnings:");
    for (const warning of warnings) {
      console.warn(`  - ${warning}`);
    }
  }

  if (errors.length > 0) {
    console.error("[critical-minerals] validation failed:");
    for (const error of errors) {
      console.error(`  - ${error}`);
    }
    process.exit(1);
  }

  console.log("[critical-minerals] validation passed");
}

main().catch((error) => {
  console.error("[critical-minerals] unexpected failure:", error);
  process.exit(1);
});
