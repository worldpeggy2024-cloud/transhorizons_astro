const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ts = require('typescript');

function usage() {
  console.error('Usage: node scripts/migrate-country-ts-to-keystatic.cjs <inputTs> <cca3> <nameEn> <nameFr> [outputYaml]');
  process.exit(1);
}

const [, , inputTsArg, cca3, nameEn, nameFr, outputYamlArg] = process.argv;
if (!inputTsArg || !cca3 || !nameEn || !nameFr) usage();

const rootDir = process.cwd();
const inputTs = path.resolve(rootDir, inputTsArg);
if (!fs.existsSync(inputTs)) {
  console.error(`Input file not found: ${inputTs}`);
  process.exit(1);
}

const outputYaml = outputYamlArg
  ? path.resolve(rootDir, outputYamlArg)
  : path.resolve(rootDir, 'content', 'countries', cca3, 'analysis.yaml');

function loadAnalysisObject(tsFilePath) {
  const sourceTs = fs.readFileSync(tsFilePath, 'utf8');
  const transpiled = ts.transpileModule(sourceTs, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
      importHelpers: false,
      isolatedModules: false,
    },
    fileName: tsFilePath,
  }).outputText;

  const module = { exports: {} };
  const sandbox = {
    module,
    exports: module.exports,
    require,
    __dirname: path.dirname(tsFilePath),
    __filename: tsFilePath,
    console,
    process,
  };
  vm.runInNewContext(transpiled, sandbox, { filename: tsFilePath });

  const exportsObj = module.exports;
  const candidates = Object.entries(exportsObj).filter(([k, v]) => {
    if (!k.toLowerCase().endsWith('analysis')) return false;
    if (!v || typeof v !== 'object') return false;
    return Boolean(v.en && v.fr && v.scorecard);
  });

  if (candidates.length === 0) {
    throw new Error(`No exported *Analysis object found in ${tsFilePath}`);
  }

  return candidates[0][1];
}

function toJsonBlock(value) {
  return JSON.stringify(Array.isArray(value) ? value : [], null, 2);
}

function yamlBlock(label, blockText) {
  const body = String(blockText)
    .split('\n')
    .map((line) => `  ${line}`)
    .join('\n');
  return `${label}: |-\n${body}`;
}

function yamlText(label, value) {
  const v = String(value ?? '').replace(/'/g, "''");
  return `${label}: '${v}'`;
}

function buildYaml(country, meta) {
  const sharedSources = country.sources ?? country.en?.sources ?? country.fr?.sources ?? [];
  const lines = [
    `code: ${meta.cca3}`,
    `nameEn: ${meta.nameEn}`,
    `nameFr: ${meta.nameFr}`,
    yamlText('lastUpdated', country.lastUpdated ?? ''),
    `scorecard_eliteCohesion: ${country.scorecard?.eliteCohesion ?? 'Med'}`,
    `scorecard_securityLoyalty: ${country.scorecard?.securityLoyalty ?? 'Med'}`,
    `scorecard_economicPressure: ${country.scorecard?.economicPressure ?? 'Med'}`,
    `scorecard_protestCapacity: ${country.scorecard?.protestCapacity ?? 'Med'}`,
    `scorecard_institutionalResilience: ${country.scorecard?.institutionalResilience ?? 'Med'}`,
    yamlBlock('executiveSnapshot_en', (country.en?.executiveSnapshot ?? []).join('\n')),
    yamlBlock('executiveSnapshot_fr', (country.fr?.executiveSnapshot ?? []).join('\n')),
    yamlText('political_powerStructure_en', country.en?.political?.powerStructure ?? ''),
    yamlText('political_powerStructure_fr', country.fr?.political?.powerStructure ?? ''),
    yamlText('political_stabilityDrivers_en', country.en?.political?.stabilityDrivers ?? ''),
    yamlText('political_stabilityDrivers_fr', country.fr?.political?.stabilityDrivers ?? ''),
    yamlText('political_shockAbsorbers_en', country.en?.political?.shockAbsorbers ?? ''),
    yamlText('political_shockAbsorbers_fr', country.fr?.political?.shockAbsorbers ?? ''),
    yamlText('economy_macroReality_en', country.en?.economy?.macroReality ?? ''),
    yamlText('economy_macroReality_fr', country.fr?.economy?.macroReality ?? ''),
    yamlText('economy_externalVulnerability_en', country.en?.economy?.externalVulnerability ?? ''),
    yamlText('economy_externalVulnerability_fr', country.fr?.economy?.externalVulnerability ?? ''),
    yamlText('economy_politicalEconomy_en', country.en?.economy?.politicalEconomy ?? ''),
    yamlText('economy_politicalEconomy_fr', country.fr?.economy?.politicalEconomy ?? ''),
    yamlText('security_internal_en', country.en?.security?.internal ?? ''),
    yamlText('security_internal_fr', country.fr?.security?.internal ?? ''),
    yamlText('security_diplomacy_en', country.en?.security?.diplomacy ?? ''),
    yamlText('security_diplomacy_fr', country.fr?.security?.diplomacy ?? ''),
    yamlBlock('actors_domestic_en', toJsonBlock(country.en?.actors?.domestic ?? [])),
    yamlBlock('actors_domestic_fr', toJsonBlock(country.fr?.actors?.domestic ?? [])),
    yamlBlock('actors_external_en', toJsonBlock(country.en?.actors?.external ?? [])),
    yamlBlock('actors_external_fr', toJsonBlock(country.fr?.actors?.external ?? [])),
    yamlBlock('risks_en', toJsonBlock(country.en?.risks ?? [])),
    yamlBlock('risks_fr', toJsonBlock(country.fr?.risks ?? [])),
    yamlBlock('sources', toJsonBlock(sharedSources)),
    '',
  ];

  return lines.join('\n');
}

try {
  const country = loadAnalysisObject(inputTs);
  const yamlOut = buildYaml(country, { cca3, nameEn, nameFr });
  fs.mkdirSync(path.dirname(outputYaml), { recursive: true });
  fs.writeFileSync(outputYaml, yamlOut, 'utf8');
  console.log(`Generated ${path.relative(rootDir, outputYaml)} from ${path.relative(rootDir, inputTs)}`);
} catch (err) {
  console.error(err.message || err);
  process.exit(1);
}
