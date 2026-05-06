const fs = require('fs');
const path = require('path');

function loadYamlModule() {
  const pnpmDir = path.join(process.cwd(), 'node_modules', '.pnpm');
  if (!fs.existsSync(pnpmDir)) {
    throw new Error('Cannot find node_modules/.pnpm; install dependencies first.');
  }

  const pkgDir = fs.readdirSync(pnpmDir).find((n) => n.startsWith('js-yaml@'));
  if (!pkgDir) {
    throw new Error('Cannot find js-yaml in pnpm store.');
  }

  // eslint-disable-next-line import/no-dynamic-require, global-require
  return require(path.join(process.cwd(), 'node_modules', '.pnpm', pkgDir, 'node_modules', 'js-yaml'));
}

const yaml = loadYamlModule();
const countriesRoot = path.join(process.cwd(), 'content', 'countries');

const denyDomains = [
  'wikipedia.org',
  'medium.com',
  'blogspot.com',
  'quora.com',
  'reddit.com',
  'x.com',
  'twitter.com',
  'facebook.com',
  'linkedin.com',
  'youtube.com',
  'tiktok.com',
];

function isDeniedDomain(hostname) {
  const host = hostname.toLowerCase();
  return denyDomains.some((d) => host === d || host.endsWith(`.${d}`));
}

function isLikelyGenericHomepage(urlString) {
  try {
    const u = new URL(urlString);
    const normalizedPath = (u.pathname || '/').trim();
    return normalizedPath === '/' && !u.search && !u.hash;
  } catch {
    return false;
  }
}

function parseSources(rawSources) {
  if (Array.isArray(rawSources)) return rawSources;
  if (typeof rawSources === 'string') {
    try {
      const parsed = JSON.parse(rawSources);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function collectCitations(value, out) {
  if (typeof value === 'string') {
    const regex = /\[([a-z0-9-]+)\]/g;
    let m;
    while ((m = regex.exec(value)) !== null) {
      out.add(m[1]);
    }
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) collectCitations(item, out);
    return;
  }

  if (value && typeof value === 'object') {
    for (const v of Object.values(value)) collectCitations(v, out);
  }
}

function sentenceTimeBindingWarnings(text, label, warnings) {
  const sentences = text.split(/(?<=[.!?])\s+/g);
  const citationRegex = /\[[a-z0-9-]+\]/i;
  const numericRegex = /\b\d+(?:[.,]\d+)?%?\b/;
  const timeRegex = /\b(19|20)\d{2}\b|\bQ[1-4]\b|\b(week|month|quarter|year|annual|annually|yoy|y\/y|m\/m)\b/i;

  sentences.forEach((s, i) => {
    if (!citationRegex.test(s)) return;
    const withoutCitations = s.replace(/\[[a-z0-9-]+\]/gi, ' ');
    if (!numericRegex.test(withoutCitations)) return;
    if (!timeRegex.test(withoutCitations)) {
      warnings.push(`${label} sentence ${i + 1}: numeric claim may be missing explicit time binding`);
    }
  });
}

function validateCountryFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const data = yaml.load(raw);
  const errors = [];
  const warnings = [];

  if (!data || typeof data !== 'object') {
    return { errors: ['Invalid YAML object'], warnings };
  }

  const sources = parseSources(data.sources);
  if (sources.length === 0) {
    errors.push('No sources found (sources block empty or unparsable)');
  }

  const sourceKeys = new Set();
  sources.forEach((s, idx) => {
    const key = s && typeof s.id === 'string' && s.id.trim() ? s.id.trim() : String(idx + 1);

    if (sourceKeys.has(key)) {
      errors.push(`Duplicate source key: ${key}`);
    }
    sourceKeys.add(key);

    const url = typeof s?.url === 'string' ? s.url.trim() : '';
    if (!url) {
      errors.push(`Source ${key}: missing url`);
    } else {
      try {
        const u = new URL(url);
        if (isDeniedDomain(u.hostname)) {
          errors.push(`Source ${key}: denied domain (${u.hostname})`);
        }
        if (isLikelyGenericHomepage(url)) {
          errors.push(`Source ${key}: generic homepage URL (needs deep link)`);
        }
      } catch {
        errors.push(`Source ${key}: invalid URL`);
      }
    }

    const required = ['name', 'url', 'desc', 'publicationDate', 'accessDate', 'confidence', 'citationType'];
    required.forEach((field) => {
      const val = s?.[field];
      if (typeof val !== 'string' || !val.trim()) {
        errors.push(`Source ${key}: missing required field '${field}'`);
      }
    });
  });

  const contentClone = { ...data };
  delete contentClone.sources;

  const citations = new Set();
  collectCitations(contentClone, citations);

  for (const c of citations) {
    if (!sourceKeys.has(c)) {
      errors.push(`Orphan citation: [${c}] has no matching source`);
    }
  }

  for (const s of sourceKeys) {
    if (!citations.has(s)) {
      errors.push(`Orphan source: '${s}' is never cited`);
    }
  }

  const warningFieldPrefixes = [
    'executiveSnapshot_',
    'political_',
    'economy_',
    'security_',
  ];

  for (const [k, v] of Object.entries(contentClone)) {
    if (typeof v === 'string' && warningFieldPrefixes.some((p) => k.startsWith(p))) {
      sentenceTimeBindingWarnings(v, k, warnings);
    }
  }

  return { errors, warnings };
}

function listCountryFiles(root) {
  if (!fs.existsSync(root)) return [];
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => path.join(root, d.name, 'analysis.yaml'))
    .filter((p) => fs.existsSync(p));
}

const files = process.argv.length > 2
  ? process.argv.slice(2).map((p) => path.resolve(process.cwd(), p))
  : listCountryFiles(countriesRoot);

if (files.length === 0) {
  console.error('No analysis.yaml files found to validate.');
  process.exit(1);
}

let errorCount = 0;
let warningCount = 0;

for (const file of files) {
  const rel = path.relative(process.cwd(), file);
  const result = validateCountryFile(file);

  if (result.errors.length === 0 && result.warnings.length === 0) {
    console.log(`OK   ${rel}`);
    continue;
  }

  if (result.errors.length > 0) {
    console.log(`FAIL ${rel}`);
    result.errors.forEach((e) => console.log(`  - ERROR: ${e}`));
    errorCount += result.errors.length;
  } else {
    console.log(`OK*  ${rel}`);
  }

  if (result.warnings.length > 0) {
    result.warnings.forEach((w) => console.log(`  - WARN: ${w}`));
    warningCount += result.warnings.length;
  }
}

console.log(`\nSummary: ${errorCount} error(s), ${warningCount} warning(s) across ${files.length} file(s).`);
if (errorCount > 0) {
  process.exit(2);
}
