#!/usr/bin/env node
/*
 * One-off: convert the audit chat's "STANDS ledger" markdown into
 * content/docs/article-jobs/ring-of-fire/ledger.json, then (resolve) match every
 * quote against the fetched text of each source the row names.
 *
 *   node rof-convert.cjs build   <stands.md> <jobDir>
 *   node rof-convert.cjs resolve <jobDir>
 */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const E = require('C:/Users/peggy/DevTest/transhorizons_astro/scripts/lib/evidence.cjs');

const hash = (...parts) => crypto.createHash('sha256').update(parts.map((x) => E.normalize(x)).join('\u0000')).digest('hex').slice(0, 16);
const today = () => new Date().toISOString().slice(0, 10);
const cells = (line) => line.trim().replace(/^\|/, '').replace(/\|$/, '').split(/\s\|\s/).map((c) => c.trim());

function build(mdPath, jobDir) {
  const lines = fs.readFileSync(mdPath, 'utf8').split(/\r?\n/);
  const sources = [];
  const claims = [];
  let section = null;
  let inKey = false;
  let inClaims = false;
  let n = 0;
  for (const line of lines) {
    if (/^##\s/.test(line)) {
      const title = line.replace(/^##\s+/, '').trim();
      inKey = /^Source key/i.test(title);
      section = /^Notes carried/i.test(title) ? null : title;
      inClaims = false;
      continue;
    }
    if (!line.trim().startsWith('|')) continue;
    if (/^\s*\|[\s:|-]+\|\s*$/.test(line)) continue; // table separator |---|---|
    const c = cells(line);
    if (c.length < 3) continue;
    if (inKey) {
      if (c[0] === 'Key') continue;
      const url = (c[2].match(/https?:\/\/\S+/) || [])[0] || null;
      sources.push({ id: c[0].toLowerCase(), name: c[1], ...(url ? { url } : {}), where: url ? undefined : c[2] });
      continue;
    }
    if (!section) continue;
    if (c[0] === 'Claim' && c[1] === 'Source') { inClaims = true; continue; }
    if (!inClaims || c.length < 3) continue;
    const [fact, srcCell, quoteCell] = c;
    // Sources named in the quote cell count too ("S3 project page shows …").
    const candidates = [...new Set([...`${srcCell} ${quoteCell}`.matchAll(/\bS(\d+)\b/g)].map((m) => `s${m[1]}`))];
    const locator = srcCell.replace(/S\d+[,;]?\s*/g, '').trim();
    const quotes = [...quoteCell.matchAll(/"([^"]{3,})"/g)].map((m) => m[1]);
    const auditNote = quoteCell.replace(/"[^"]*"/g, '…').replace(/\s+/g, ' ').trim();
    if (!quotes.length) {
      n++;
      claims.push({ id: `c${String(n).padStart(3, '0')}`, section, fact, source: candidates[0] || null, candidates, locator, quote: null, auditNote: quoteCell });
      continue;
    }
    quotes.forEach((q) => {
      n++;
      claims.push({ id: `c${String(n).padStart(3, '0')}`, section, fact, source: candidates[0] || null, candidates, locator, quote: q, ...(auditNote && auditNote !== '…' ? { auditNote } : {}) });
    });
  }
  fs.mkdirSync(jobDir, { recursive: true });
  const ledger = {
    slug: 'ring-of-fire',
    article: 'content/articles/2026-09_Ring-of-Fire_Essay.yaml',
    mode: 'enforced',
    origin: 'Converted 2026-09-15 from the audit chat STANDS ledger (ring-of-fire-stands-ledger.md). Claims carry `fact` (the audit line) and no `sentence` until the rebuilt article is written.',
    sources: sources.map(({ where, ...s }) => s),
    claims,
    notes: [],
  };
  fs.writeFileSync(path.join(jobDir, 'ledger.json'), JSON.stringify(ledger, null, 2) + '\n');
  const bPath = path.join(jobDir, 'boundary.json');
  if (!fs.existsSync(bPath)) fs.writeFileSync(bPath, JSON.stringify({ topic: 'Ring of Fire corridor', questions: [], documents: [], gaps: [] }, null, 2) + '\n');
  console.log(`sources: ${sources.length} (${sources.filter((s) => s.url).length} with URL) · claims: ${claims.length} (${claims.filter((c) => !c.quote).length} without a verbatim quote)`);
  console.log(`sections: ${[...new Set(claims.map((c) => c.section))].join(' | ')}`);
}

function resolve(jobDir) {
  const lp = path.join(jobDir, 'ledger.json');
  const ledger = JSON.parse(fs.readFileSync(lp, 'utf8'));
  const texts = {};
  const text = (id) => {
    if (!(id in texts)) {
      const p = path.join(jobDir, 'cache', `${id}.txt`);
      texts[id] = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
    }
    return texts[id];
  };
  const rank = { exact: 3, near: 2, missing: 1, 'no-text': 0 };
  for (const c of ledger.claims) {
    if (!c.quote) { c.quoteCheck = { status: 'no-quote', date: today() }; continue; }
    let best = null;
    for (const id of c.candidates.length ? c.candidates : [c.source]) {
      const t = text(id);
      const r = t == null ? { status: 'no-text', coverage: 0 } : E.findQuote(c.quote, t);
      if (!best || rank[r.status] > rank[best.r.status] || (r.status === best.r.status && (r.coverage || 0) > (best.r.coverage || 0))) best = { id, r };
    }
    c.source = best.id;
    c.quoteCheck = { status: best.r.status, page: best.r.page ?? null, coverage: best.r.coverage ?? 0, date: today(), hash: hash(c.quote) };
  }
  fs.writeFileSync(lp, JSON.stringify(ledger, null, 2) + '\n');
  const by = (s) => ledger.claims.filter((c) => c.quoteCheck.status === s);
  console.log(`exact ${by('exact').length} · near ${by('near').length} · missing ${by('missing').length} · no text ${by('no-text').length} · no quote ${by('no-quote').length} (of ${ledger.claims.length} quote lines)`);
  for (const s of ['near', 'missing', 'no-text', 'no-quote']) {
    const list = by(s);
    if (!list.length) continue;
    console.log(`\n=== ${s.toUpperCase()} (${list.length})`);
    for (const c of list) console.log(`  ${c.id} [${c.section}] ${c.fact}\n      ${c.source}${c.locator ? ` ${c.locator}` : ''}${c.quoteCheck.coverage ? ` (${Math.round(c.quoteCheck.coverage * 100)}%)` : ''}: "${c.quote ?? c.auditNote}"`);
  }
}

const [cmd, a, b] = process.argv.slice(2);
if (cmd === 'build') build(a, b);
else if (cmd === 'resolve') resolve(a);
else console.log('usage: build <stands.md> <jobDir> | resolve <jobDir>');
