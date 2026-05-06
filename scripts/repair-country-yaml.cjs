const fs = require('fs');
const path = require('path');

const countriesRoot = path.join(process.cwd(), 'content', 'countries');

const jsonBlockKeys = [
  'actors_domestic_en',
  'actors_domestic_fr',
  'actors_external_en',
  'actors_external_fr',
  'risks_en',
  'risks_fr',
  'sources',
];

function parseArgs(argv) {
  const args = {
    write: false,
    files: [],
  };

  for (const a of argv) {
    if (a === '--write') {
      args.write = true;
      continue;
    }
    args.files.push(path.resolve(process.cwd(), a));
  }

  return args;
}

function listCountryFiles(root) {
  if (!fs.existsSync(root)) return [];
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => path.join(root, d.name, 'analysis.yaml'))
    .filter((p) => fs.existsSync(p));
}

function badCharScore(text) {
  const patterns = [
    /Ã./g,
    /Â/g,
    /â[\u0080-\u00BF]/g,
    /\uFFFD/g,
    /�/g,
  ];

  return patterns.reduce((acc, re) => acc + (text.match(re)?.length || 0), 0);
}

function maybeRepairMojibake(raw) {
  const converted = Buffer.from(raw, 'latin1').toString('utf8');
  const scoreRaw = badCharScore(raw);
  const scoreConverted = badCharScore(converted);
  return scoreConverted < scoreRaw ? converted : raw;
}

function findBlockRange(raw, key) {
  const headerRe = new RegExp(`^${key}:\\s*\\|-\\s*$`, 'm');
  const m = headerRe.exec(raw);
  if (!m) return null;

  const headerStart = m.index;
  const contentStart = m.index + m[0].length + 1;

  const rest = raw.slice(contentStart);
  const nextHeaderRe = /^([a-zA-Z0-9_]+):\s*\|-/m;
  const next = nextHeaderRe.exec(rest);
  const contentEnd = next ? contentStart + next.index : raw.length;

  return {
    key,
    headerStart,
    contentStart,
    contentEnd,
  };
}

function findMatchingBracketArraySlice(text) {
  const start = text.indexOf('[');
  if (start < 0) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < text.length; i += 1) {
    const ch = text[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (ch === '\\') {
      escaped = true;
      continue;
    }

    if (ch === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (ch === '[') depth += 1;
    if (ch === ']') {
      depth -= 1;
      if (depth === 0) {
        return text.slice(start, i + 1);
      }
    }
  }

  return null;
}

function tryParseArrayBlock(content) {
  const trimmed = content.trim();

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return { ok: true, parsed, normalized: trimmed, recovered: false };
    }
  } catch {
    // Ignore and try recovery path.
  }

  const candidate = findMatchingBracketArraySlice(trimmed);
  if (!candidate) {
    return { ok: false, parsed: null, normalized: null, recovered: false };
  }

  try {
    const parsed = JSON.parse(candidate);
    if (Array.isArray(parsed)) {
      return { ok: true, parsed, normalized: candidate, recovered: true };
    }
  } catch {
    return { ok: false, parsed: null, normalized: null, recovered: false };
  }

  return { ok: false, parsed: null, normalized: null, recovered: false };
}

function indentBlock(jsonText) {
  return `${jsonText}\n`
    .split('\n')
    .map((line) => (line.length ? `  ${line}` : line))
    .join('\n');
}

function hasRequiredRiskShape(arr) {
  return arr.every((r) => r && typeof r === 'object' && typeof r.title === 'string' && typeof r.trigger === 'string');
}

function hasRequiredActorShape(arr) {
  return arr.every((a) => a && typeof a === 'object' && typeof a.name === 'string' && typeof a.likelyMoves === 'string');
}

function repairFile(filePath, write) {
  let raw = fs.readFileSync(filePath, 'utf8');
  const original = raw;
  const notes = [];
  const errors = [];

  const repairedEncoding = maybeRepairMojibake(raw);
  if (repairedEncoding !== raw) {
    raw = repairedEncoding;
    notes.push('Applied latin1->utf8 mojibake repair pass');
  }

  for (const key of jsonBlockKeys) {
    const range = findBlockRange(raw, key);
    if (!range) continue;

    const current = raw.slice(range.contentStart, range.contentEnd);
    const result = tryParseArrayBlock(current);

    if (!result.ok) {
      errors.push(`${key}: JSON array block is invalid/unrecoverable`);
      continue;
    }

    if (key.startsWith('risks_') && !hasRequiredRiskShape(result.parsed)) {
      errors.push(`${key}: parsed but risk shape is invalid`);
    }

    if (key.startsWith('actors_') && !hasRequiredActorShape(result.parsed)) {
      errors.push(`${key}: parsed but actor shape is invalid`);
    }

    const normalizedIndented = indentBlock(result.normalized);
    if (result.recovered && normalizedIndented !== current) {
      raw = `${raw.slice(0, range.contentStart)}${normalizedIndented}${raw.slice(range.contentEnd)}`;
      notes.push(`${key}: recovered valid JSON and trimmed trailing corruption`);
    }
  }

  for (const mustHave of ['risks_en', 'risks_fr']) {
    const range = findBlockRange(raw, mustHave);
    if (!range) {
      errors.push(`${mustHave}: missing required block`);
      continue;
    }
    const result = tryParseArrayBlock(raw.slice(range.contentStart, range.contentEnd));
    if (!result.ok || !Array.isArray(result.parsed) || result.parsed.length === 0) {
      errors.push(`${mustHave}: missing/empty/invalid array`);
    }
  }

  const replacementCount = (raw.match(/�/g) || []).length;
  if (replacementCount > 0) {
    errors.push(`Contains ${replacementCount} replacement character(s) '�' after repair`);
  }

  const changed = raw !== original;
  if (write && changed && errors.length === 0) {
    fs.writeFileSync(filePath, raw, 'utf8');
  }

  return {
    changed,
    notes,
    errors,
  };
}

function main() {
  const { write, files } = parseArgs(process.argv.slice(2));
  const targets = files.length > 0 ? files : listCountryFiles(countriesRoot);

  if (targets.length === 0) {
    console.error('No analysis.yaml files found.');
    process.exit(1);
  }

  let failCount = 0;
  let changedCount = 0;

  for (const file of targets) {
    const rel = path.relative(process.cwd(), file);

    if (!fs.existsSync(file)) {
      console.log(`MISS ${rel}`);
      failCount += 1;
      continue;
    }

    const result = repairFile(file, write);

    if (result.errors.length > 0) {
      console.log(`FAIL ${rel}`);
      result.errors.forEach((e) => console.log(`  - ERROR: ${e}`));
      result.notes.forEach((n) => console.log(`  - NOTE: ${n}`));
      failCount += 1;
      continue;
    }

    if (result.changed) {
      changedCount += 1;
      console.log(`${write ? 'FIXD' : 'DRYF'} ${rel}`);
      result.notes.forEach((n) => console.log(`  - NOTE: ${n}`));
      if (!write) {
        console.log('  - NOTE: Re-run with --write to apply changes');
      }
    } else {
      console.log(`OK   ${rel}`);
    }
  }

  console.log(`\nSummary: ${targets.length} file(s), ${changedCount} changed, ${failCount} failed.`);
  if (failCount > 0) {
    process.exit(2);
  }
}

main();