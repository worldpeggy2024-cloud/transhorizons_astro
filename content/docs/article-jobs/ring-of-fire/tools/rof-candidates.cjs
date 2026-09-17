#!/usr/bin/env node
/*
 * Task C of ring-of-fire-restart-handoff.md — candidate claims per section.
 *
 * Reads ring-of-fire-draft-1-reordered.md, extracts the distinctive items of every
 * paragraph (figures in digits AND in words, years, dates, amounts, units, proper names),
 * and lists every claim whose full quote shares at least one of them.
 *
 * Candidates are POINTERS, not verdicts. Nothing here says whether a quote supports a
 * paragraph, and no quote is described or summarised.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const JOB = path.resolve(__dirname, '..');
const DRAFT = 'C:/Users/peggy/DevWebSiteFiles/TransHorizons Website/Articles/Ring of Fire/ring-of-fire-draft-1-reordered.md';
const OUT = path.join(JOB, 'candidates');
const L = JSON.parse(fs.readFileSync(path.join(JOB, 'ledger.json'), 'utf8'));
const src = Object.fromEntries(L.sources.map((s) => [s.id, s]));
const today = new Date().toISOString().slice(0, 10);

// Nothing is ever truncated — a dropped row could be the one that matters. A list longer
// than this moves to an appendix at the end of the file, complete and still ranked.
const INLINE_ROWS = 30;

// ── Numbers ────────────────────────────────────────────────────────────────────

const UNITS = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
  seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50,
  sixty: 60, seventy: 70, eighty: 80, ninety: 90,
};
const SCALES = { hundred: 100, thousand: 1e3, million: 1e6, billion: 1e9, trillion: 1e12 };
const NUMWORD = new Set([...Object.keys(UNITS), ...Object.keys(SCALES), 'and']);

const UNIT_MAP = new Map(Object.entries({
  km: 'km', kilometre: 'km', kilometres: 'km', kilometer: 'km', kilometers: 'km',
  m: 'm', metre: 'm', metres: 'm', meter: 'm', meters: 'm',
  cm: 'cm', centimetre: 'cm', centimetres: 'cm', centimeter: 'cm', centimeters: 'cm',
  ha: 'ha', hectare: 'ha', hectares: 'ha',
  tonne: 't', tonnes: 't', ton: 't', tons: 't',
  day: 'd', days: 'd', month: 'mo', months: 'mo', year: 'y', years: 'y',
  '%': 'pct', percent: 'pct', 'per cent': 'pct',
  dollar: 'cad', dollars: 'cad', $: 'cad',
  m3: 'm3', 'm³': 'm3',
  people: 'people', residents: 'people', households: 'households',
  vehicles: 'vehicles', communities: 'communities',
  'square kilometres': 'km2', 'square kilometers': 'km2', km2: 'km2', 'km²': 'km2',
}));

/**
 * Fold a run of number words into one value: "thirty-one" 31, "seven thousand" 7000.
 * A run of scale words alone is not a number — a stray "billion" must not become 1e9.
 */
function foldWords(ws) {
  let total = 0;
  let cur = 0;
  let counted = false;
  for (const w of ws) {
    if (w === 'and') continue;
    if (w in UNITS) { cur += UNITS[w]; counted = true; } else if (w === 'hundred') { cur = (cur || 1) * 100; } else if (w in SCALES) { total += (cur || 1) * SCALES[w]; cur = 0; }
  }
  return counted ? total + cur : null;
}
const allNumWords = (s) => s.toLowerCase().split(/[\s-]+/).filter(Boolean).every((p) => NUMWORD.has(p));

const canon = (v) => (Number.isInteger(v) ? String(v) : String(Number(v.toFixed(4))));

/**
 * Every number in `text`, in digits or in words, as {value, unit, surface}.
 * A scale word after a number multiplies it, and both forms are kept: "30 billion"
 * yields 30 and 30000000000, so a paragraph's words can meet a document's digits.
 */
function numbers(text) {
  const out = [];
  const t = text.replace(/[\u00a0\u202f]/g, ' ');
  const toks = t.split(/([^\p{L}\p{N}$%.,'’-]+)/u);
  // Digit-led numbers, with an optional currency mark, scale word and unit.
  const re = /(\$\s?)?(\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?)\s*(hundred|thousand|million|billion|trillion)?\s*(square kilometres|square kilometers|per cent|percent|%|km2|km²|km|kilometres|kilometre|kilometers|kilometer|centimetres|centimetre|centimeters|centimeter|cm|metres|metre|meters|meter|hectares|hectare|ha|tonnes|tonne|tons|ton|m3|m³|days|day|months|month|years|year|dollars|dollar|people|residents|households|vehicles|communities|m)?\b/giu;
  let m;
  while ((m = re.exec(t)) !== null) {
    const [surface, cur, digits, scale, unit] = m;
    const base = Number(digits.replace(/,/g, ''));
    if (!Number.isFinite(base)) continue;
    const u = unit ? UNIT_MAP.get(unit.toLowerCase()) : (cur ? 'cad' : null);
    out.push({ value: base, unit: u, surface: surface.trim() });
    if (scale) out.push({ value: base * SCALES[scale.toLowerCase()], unit: u, surface: surface.trim() });
  }
  // Number words, folded across hyphens and spaces.
  const words = toks.filter((_, i) => i % 2 === 0);
  const seps = toks.filter((_, i) => i % 2 === 1);
  for (let i = 0; i < words.length; i++) {
    let parts = words[i].toLowerCase().split('-');
    // "thirty-metre", "ninety-billion-dollar": a unit welded onto the number by a hyphen.
    let glued = null;
    while (parts.length > 1 && !NUMWORD.has(parts[parts.length - 1])) {
      const tail = parts[parts.length - 1].replace(/s$/, '');
      if (!glued && UNIT_MAP.has(tail)) glued = UNIT_MAP.get(tail);
      parts = parts.slice(0, -1);
    }
    if (!parts.every((p) => NUMWORD.has(p)) || !parts.some((p) => p !== 'and')) continue;
    const run = [...parts];
    const surfaceParts = [words[i]];
    let j = i;
    while (j + 1 < words.length && /^ $/.test(seps[j] || '')) {
      const nxt = words[j + 1].toLowerCase().split('-');
      if (!nxt.every((p) => NUMWORD.has(p))) break;
      run.push(...nxt);
      surfaceParts.push(words[j + 1]);
      j++;
    }
    const v = foldWords(run);
    i = j;
    if (v == null) continue;
    let unit = glued;
    const after = (words[j + 1] || '').toLowerCase();
    const after2 = `${after} ${(words[j + 2] || '').toLowerCase()}`.trim();
    if (UNIT_MAP.has(after2)) unit = UNIT_MAP.get(after2);
    else if (UNIT_MAP.has(after)) unit = UNIT_MAP.get(after);
    out.push({ value: v, unit, surface: surfaceParts.join(' ') });
    // "thirty million dollars" should also meet a bare "30" somewhere.
    if (v >= 1000 && run.some((p) => p in SCALES)) {
      const head = foldWords(run.filter((p) => !(p in SCALES)));
      if (head) out.push({ value: head, unit: null, surface: surfaceParts.join(' ') });
    }
  }
  return out;
}

// ── Proper names ───────────────────────────────────────────────────────────────

const STOP_NAMES = ['ring of fire', 'first nations', 'first nation', 'ontario', 'canada', 'webequie', 'agency'];
const CONNECTORS = new Set(['of', 'the', 'and', 'for', 'in', 'on', 'de', 'du', 'des', 'a']);
const COMMON_CAPS = new Set(`the this that these those there then they their them it its a an and but or so as at by for from in into of on to with without within about above after before below between during over under up down out off again further once here when where why how all any both each few more most other some such no nor not only own same than too very can will just should now beneath work people water road roads land lands one two three four five six seven eight nine ten first second third next what which who whom whose if because while although though since until unless whether either neither every another either both drinking building found nineteen thirty eight`.split(/\s+/));

const normName = (s) => s.toLowerCase().replace(/[’']s\b/g, '').replace(/[^\p{L}\p{N} .\-]/gu, '')
  .replace(/\s+/g, ' ').trim()
  .replace(/^(?:the|a|an)\s+/, ''); // "The Marten Falls …" and "Marten Falls …" are one name

/** True when nothing discriminating survives after the handoff's stoplist. */
function tooCommon(name) {
  let rest = ` ${name} `;
  for (const s of STOP_NAMES) rest = rest.split(` ${s} `).join(' ');
  rest = rest.split(' ').filter((w) => w && !CONNECTORS.has(w)).join(' ');
  return rest.replace(/[^\p{L}\p{N}]/gu, '').length < 3;
}

/**
 * Acronym → the name its own source document resolves it to, from "Full Name (ACRO)".
 * An acronym a document expands two different ways is dropped, not guessed.
 */
function acronymMap(docText) {
  const found = new Map();
  const RE = /(\p{Lu}[\p{L}'’-]*(?:\s+(?:of|the|and|for)\s+\p{Lu}[\p{L}'’-]*|\s+\p{Lu}[\p{L}'’-]*){0,6})\s*\(\s*[“"']?([A-Z]{3,})[”"']?\s*[,)]/gu;
  for (const m of String(docText).matchAll(RE)) {
    const full = normName(m[1]);
    if (!full || full.split(' ').length < 2) continue;
    const acro = m[2];
    if (!found.has(acro)) found.set(acro, new Set());
    found.get(acro).add(full);
  }
  const out = new Map();
  const ambiguous = [];
  for (const [acro, set] of found) {
    if (set.size === 1) out.set(acro, [...set][0]);
    else ambiguous.push({ acro, expansions: [...set] });
  }
  return { map: out, ambiguous };
}

let acronyms = null; // set per source before items() is called on its quotes
const acroCache = new Map();
const docCache = new Map();
function docText(id) {
  if (!docCache.has(id)) {
    const p = path.join(JOB, 'cache', `${id}.txt`);
    docCache.set(id, fs.existsSync(p) ? fs.readFileSync(p, 'utf8').replace(/ /g, 'ff').replace(/\s+/g, ' ') : '');
  }
  return docCache.get(id);
}

function names(text) {
  const out = [];
  const CAP = /\b\p{Lu}[\p{L}'’.-]*(?:\s+(?:of|the|and|for|in|on|de|du|des)\s+\p{Lu}[\p{L}'’.-]*|\s+\p{Lu}[\p{L}'’.-]*|\s+\d[\w.-]*)*/gu;
  // A name may not run across a sentence boundary: "First Nations. Treaty 9" is two things.
  for (const sentence of text.split(/(?<=[.!?;])\s+(?=\p{Lu})/u)) {
  let m;
  while ((m = CAP.exec(sentence)) !== null) {
    let s = m[0].replace(/[.,;:]+$/, '').trim();
    if (s.length < 3) continue;
    const words = s.split(/\s+/);
    // A one-word match that is just a sentence-opening common word discriminates nothing.
    if (words.length === 1 && COMMON_CAPS.has(s.toLowerCase())) continue;
    // "Thirty-one" opening a sentence is a number, not a name.
    if (allNumWords(s)) continue;
    const n = normName(s);
    if (!n || tooCommon(n)) continue;
    out.push({ key: `name:${n}`, surface: s });
    // A run joined by "and"/"of" is often several names ("Webequie and Marten Falls"), and
    // a long one contains a shorter one ("Marten Falls Community Access Road" → "Marten
    // Falls"). Emit those too: a missed candidate costs more here than a spurious one.
    // Show the sub-name as the paragraph spells it, not as the normalised key.
    const cased = (sub) => {
      const m2 = s.match(new RegExp(sub.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&').replace(/\s+/g, '\\s+'), 'i'));
      return m2 ? m2[0] : sub;
    };
    const segs = n.split(/\s+(?:and|of|for|in|on|the|de|du|des)\s+/).filter(Boolean);
    for (const seg of segs) {
      if (segs.length > 1 && !tooCommon(seg)) out.push({ key: `name:${seg}`, surface: cased(seg) });
      const w = seg.split(' ');
      if (w.length >= 3) {
        const head = w.slice(0, 2).join(' ');
        if (!tooCommon(head)) out.push({ key: `name:${head}`, surface: cased(head) });
      }
      // A document writes "Aroland First Nation" where the draft writes "Aroland".
      // Without this the two never meet, and the nation's own submission goes missing
      // from the paragraph about its position.
      // Everything BEFORE the entity type, not only when it ends the name: comment tables
      // write "Aroland First Nation 2." as a heading, and an anchored strip misses it.
      const bare = seg.replace(/\s+first nations?\b.*$/, '').replace(/\s+(?:tribal\s+)?council\b.*$/, '')
        .replace(/[\s\d.,#-]+$/, '');
      if (bare !== seg && bare.length >= 4 && !tooCommon(bare)) out.push({ key: `name:${bare}`, surface: cased(bare) });
    }
  }
  }
  // Identifiers carrying a digit or hyphen (ARA-2, RCU100, Table 4-5) mean one thing.
  // BARE ALPHABETIC ACRONYMS DO NOT: "WFN" is Webequie First Nation in one document and
  // Weenusk First Nation in another, and MFCAR / NRL / RAWG carry the same risk. An
  // acronym matched as a name is known error 1 in a new costume — right quote, wrong
  // nation. So a bare acronym is indexed only under the name its own source resolves it
  // to, and never when the source resolves it two ways.
  for (const m2 of text.matchAll(/\b[A-Z]{2,}[0-9-][\w-]*\b/g)) {
    const s = m2[0];
    if (tooCommon(normName(s))) continue;
    out.push({ key: `name:${normName(s)}`, surface: s });
  }
  for (const m2 of text.matchAll(/\b[A-Z]{3,}\b/g)) {
    const resolved = acronyms && acronyms.get(m2[0]);
    if (!resolved || tooCommon(resolved)) continue;
    out.push({ key: `name:${resolved}`, surface: `${m2[0]} (${resolved})` });
  }
  for (const m3 of text.matchAll(/\b(?:Table|Appendix|Figure|Section|Bill|Schedule|Recommendation)\s+[A-Z0-9][\w.-]*/g)) {
    out.push({ key: `name:${normName(m3[0])}`, surface: m3[0] });
  }
  return out;
}

// ── One text's distinctive items ───────────────────────────────────────────────

function items(text) {
  const map = new Map(); // key -> surface form, first seen
  for (const n of numbers(text)) {
    if (n.unit) map.set(`q:${canon(n.value)}:${n.unit}`, n.surface);
    if (n.value >= 10) map.set(`n:${canon(n.value)}`, n.surface);
  }
  for (const n of names(text)) if (!map.has(n.key)) map.set(n.key, n.surface);
  return map;
}

// ── Content words, for the weaker second pass ──────────────────────────────────

const STOPWORDS = new Set(`a about above after again against all also am an and any are as at be because been before
being below between both but by can cannot could did do does doing down during each few for from further had has have
having he her here hers herself him himself his how i if in into is it its itself just me more most my myself no nor
not now of off on once only or other ought our ours ourselves out over own same she should so some such than that the
their theirs them themselves then there these they this those through to too under until up very was we were what when
where which while who whom why will with would you your yours yourself yourselves may might must shall upon within
without per via etc eg ie including include included includes such use used using other others another each every
any some many much more less least well also however therefore thus hence within across along among around before
after during since until while whether though although unless because if then than that which who whom whose what
when where why how there here this these those it its
project projects proposed propose road roads area areas assessment assessments would will may could should
information report reports section sensitive potential effects effect impact impacts first nation nations
ontario canada canadian federal provincial government ministry agency webequie ring fire
one two three four five six seven eight nine ten
new also part parts based given make made take taken provide provided provides consider considered considers
required require requires need needs needed date dates page pages table tables note notes`.split(/\s+/).filter(Boolean));

/** Light stemmer: enough to make "subsidies"/"subsidy" and "costs"/"cost" the same term. */
function stem(w) {
  if (w.length > 4 && w.endsWith('ies')) return `${w.slice(0, -3)}y`;
  if (w.length > 4 && w.endsWith('sses')) return w.slice(0, -2);
  if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss') && !w.endsWith('us')) return w.slice(0, -1);
  return w;
}

function contentWords(text) {
  const map = new Map(); // stem -> surface, first seen
  for (const raw of text.toLowerCase().match(/\p{L}[\p{L}'’-]*/gu) || []) {
    const w = raw.replace(/[’']/g, '');
    if (w.length < 4 || STOPWORDS.has(w)) continue;
    const s = stem(w);
    if (s.length < 4 || STOPWORDS.has(s)) continue;
    if (!map.has(s)) map.set(s, raw);
  }
  return map;
}

// `node rof-candidates.cjs --items "some text"` — what the extractor sees. Checking only.
if (process.argv[2] === '--items') {
  for (const [k, v] of items(process.argv.slice(3).join(' '))) console.log(`  ${k}  «${v}»`);
  process.exit(0);
}

// ── Draft ──────────────────────────────────────────────────────────────────────

const raw = fs.readFileSync(DRAFT, 'utf8');
const lines = raw.split(/\r?\n/);
const sections = [];
let cur = null;
let pending = null;
let buf = [];

const flush = () => {
  if (cur && pending && buf.length) {
    cur.paras.push({ p: pending.p, from: pending.from, text: buf.join(' ').trim() });
  }
  buf = [];
};

for (const line of lines) {
  const h = line.match(/^##\s+(.*)$/);
  if (h) {
    flush();
    pending = null;
    const title = h[1].trim();
    if (/^HOLDING |^Before publication|^Sources and verification/i.test(title)) { cur = null; continue; }
    cur = { title, paras: [] };
    sections.push(cur);
    continue;
  }
  if (!cur) continue;
  const mk = line.match(/^<!--\s*(P\d+)\s*·\s*(.*?)\s*-->\s*$/);
  if (mk) { flush(); pending = { p: mk[1], from: mk[2] }; continue; }
  if (!line.trim()) { flush(); continue; }
  if (pending) buf.push(line.trim());
}
flush();

// ── Claim items, with a document-frequency guard on top of the handoff's stoplist ──

const claims = L.claims.filter((c) => !/-\d+$/.test(c.id) || !L.claims.some((x) => x.id === c.id.replace(/-\d+$/, '') && x.quote === c.quote));

/**
 * An enumerated list of place names with distances is context in any quote, not the claim
 * being made. It is excluded from MATCHING ONLY — ledger-export.md still shows the whole
 * quote — because indexing it makes one claim a candidate for every paragraph that happens
 * to name one of those places.
 */
const DIST = /\b\d+(?:\.\d+)?\s?(?:km|kilometres?|kilometers?|metres?|meters?|miles?)\b/gi;
function autoExclusions(quote) {
  const out = [];
  for (const sentence of quote.split(/(?<=[.;])\s+/)) {
    const d = (sentence.match(DIST) || []).length;
    if (d < 3) continue;
    const caps = new Set((sentence.match(/\b\p{Lu}[\p{L}'’-]{2,}/gu) || []).map((s) => s.toLowerCase()));
    if (caps.size < 3) continue;
    out.push({ text: sentence, reason: `Enumerated list: ${d} distances and ${caps.size} capitalised names in one sentence. Context, not the claim.`, auto: true });
  }
  return out;
}

const excluded = [];
const acronymReport = [];
const claimItems = claims.map((c) => {
  const ex = [...(c.matchExclude || []), ...autoExclusions(c.quote)];
  const seen = new Set();
  let matchText = c.quote;
  for (const e of ex) {
    if (seen.has(e.text) || !matchText.includes(e.text)) continue;
    seen.add(e.text);
    matchText = matchText.split(e.text).join(' ');
    excluded.push({ id: c.id, ...e });
  }
  const doc = docText(c.source);
  if (!acroCache.has(c.source)) {
    const a = acronymMap(doc);
    acroCache.set(c.source, a.map);
    for (const x of a.ambiguous) acronymReport.push({ source: c.source, ...x });
  }
  acronyms = acroCache.get(c.source);
  const r = { c, m: items(matchText), w: contentWords(matchText) };
  acronyms = null;
  return r;
});
const df = new Map();
for (const { m } of claimItems) for (const k of m.keys()) df.set(k, (df.get(k) || 0) + 1);
const TOO_FREQUENT = Math.ceil(claimItems.length * 0.4);
const dropped = [...df.entries()].filter(([, n]) => n > TOO_FREQUENT);
const droppedKeys = new Set(dropped.map(([k]) => k));

// Same guard for the topic pass, tighter: a word in a quarter of the quotes says nothing.
const wdf = new Map();
for (const { w } of claimItems) for (const k of w.keys()) wdf.set(k, (wdf.get(k) || 0) + 1);
const WORD_TOO_FREQUENT = Math.ceil(claimItems.length * 0.25);
const wDropped = [...wdf.entries()].filter(([, n]) => n > WORD_TOO_FREQUENT);
const wDroppedKeys = new Set(wDropped.map(([k]) => k));
const MIN_SHARED_WORDS = 2; // one shared word is a coincidence, not a pointer

// ── Match ──────────────────────────────────────────────────────────────────────

fs.mkdirSync(OUT, { recursive: true });
const cell = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\s*\n\s*/g, ' ').trim();
const summary = [];
let fileNo = 0;

for (const sec of sections) {
  fileNo++;
  const name = `section-${String(fileNo).padStart(2, '0')}.md`;
  const o = [];
  o.push(`# ${sec.title}`);
  o.push('');
  o.push(`Candidate claims for each paragraph, generated ${today} from \`ledger.json\` and \`ring-of-fire-draft-1-reordered.md\`.`);
  o.push('');
  o.push('Each paragraph gets up to **two lists, which must not be read as one**:');
  o.push('');
  o.push('1. **Candidates** — the quote shares a distinctive item with the paragraph: a figure, year, date,');
  o.push('   amount, unit or proper name. Ranked by how many items are shared.');
  o.push('2. **Topic candidates — weaker than a shared figure or name.** The quote shares no figure and no name,');
  o.push(`   only ${MIN_SHARED_WORDS}+ content words once stopwords and words common to a quarter of the ledger are removed.`);
  o.push('   This pass reaches material a paraphrase would otherwise hide, and it is much noisier. Ranked by shared terms.');
  o.push('');
  o.push('**Both lists are pointers, not verdicts.** Nothing here says a quote supports a paragraph; only that the');
  o.push('two mention something in common. Open the quote. Nothing is truncated — a list too long to sit under its');
  o.push('paragraph moves, complete and still ranked, to "Long lists" at the end of this file.');
  o.push('');
  o.push('Full quotes, scopes and locators are also in `../ledger-export.md`.');
  o.push('');
  o.push('---');
  o.push('');

  let withCands = 0;
  const appendix = [];
  const warnAt = o.length; // the scope warning is spliced in here once the section is known
  const scoped = new Map();
  for (const para of sec.paras) {
    const isFig = /^>?\s*\*\*\[FIGURE/.test(para.text);
    const first8 = para.text.replace(/^[>*\s]+/, '').split(/\s+/).slice(0, 8).join(' ');
    const pm = items(para.text);
    const pw = contentWords(para.text);
    const rows = [];
    const topic = [];
    for (const { c, m, w } of claimItems) {
      const shared = [];
      for (const [k, surf] of pm) {
        if (droppedKeys.has(k)) continue;
        // Rarity, not count: a name shared with two claims must outrank a bare "twenty"
        // shared with forty. Counting them equally buried Constance Lake's own submission
        // below three number coincidences.
        if (m.has(k)) shared.push({ surf, weight: Math.log(claimItems.length / (df.get(k) || 1)) + 0.01 });
      }
      if (shared.length) { rows.push({ c, shared: [...new Set(shared.map((x) => x.surf))], score: shared.reduce((a, x) => a + x.weight, 0) }); continue; }
      const words = [];
      let score = 0;
      for (const [k, surf] of pw) {
        if (wDroppedKeys.has(k)) continue;
        if (w.has(k)) { words.push(surf); score += Math.log(claimItems.length / (wdf.get(k) || 1)) + 0.01; }
      }
      const uniq = [...new Set(words)];
      if (uniq.length >= MIN_SHARED_WORDS) topic.push({ c, shared: uniq, score });
    }
    const byScore = (a, b) => b.score - a.score || b.shared.length - a.shared.length || a.c.id.localeCompare(b.c.id);
    rows.sort(byScore);
    topic.sort(byScore);
    for (const [list, kind] of [[rows, 'candidate'], [topic, 'topic']]) {
      for (const r of list) {
        if (!r.c.scope) continue;
        if (!scoped.has(r.c.id)) scoped.set(r.c.id, { c: r.c, candidate: [], topic: [] });
        scoped.get(r.c.id)[kind].push(para.p);
      }
    }

    const anchor = `${para.p.toLowerCase()}-long`;
    const table = (list, head) => {
      const t = [`| claim | ${head} | source | locator | scope | full quote |`, '| --- | --- | --- | --- | --- | --- |'];
      for (const r of list) {
        const s = src[r.c.source] || {};
        t.push(`| ${r.c.id} | ${cell(r.shared.join('; '))} | ${cell(s.name || r.c.source)} | ${cell(r.c.locator) || '—'} | ${cell(r.c.scope) || '—'} | ${cell(r.c.quote)} |`);
      }
      return t;
    };
    /** Long lists go to the appendix entire; nothing is dropped. */
    const emit = (list, head, label) => {
      if (list.length <= INLINE_ROWS) { o.push(...table(list, head)); return; }
      o.push(`${list.length} ${label} — the full ranked list is under **${para.p}** in "Long lists" at the end of this file (nothing is cut).`);
      appendix.push(`### ${para.p} — ${label} (${list.length}, ranked)`, '', ...table(list, head), '');
    };

    o.push(`## ${para.p}${isFig ? ' · figure note' : ''} — "${first8}…"`);
    o.push('');
    o.push(`*Draft 1 section: ${para.from}*`);
    o.push('');
    if (!rows.length && !topic.length) {
      o.push('No candidates in the ledger — a document must be opened.');
    } else {
      if (rows.length) withCands++;
      if (rows.length) {
        o.push(`**Candidates** (${rows.length}) — shared figure, date, amount or name. Ranked by rarity of the shared item, not by how many.`);
        o.push('');
        emit(rows, 'shared items', 'candidates');
      } else {
        o.push('No candidate shares a figure, date, amount or name — a document must be opened.');
      }
      if (topic.length) {
        o.push('');
        o.push(`**Topic candidates — weaker than a shared figure or name** (${topic.length}). Shared content words only.`);
        o.push('');
        emit(topic, 'shared terms', 'topic candidates');
      }
    }
    o.push('');
    o.push('---');
    o.push('');
  }
  if (appendix.length) o.push('## Long lists', '', 'Moved here only for length. Complete and ranked as above.', '', ...appendix);
  // Generated, not hand-written: any section whose candidates include a claim scoped to a
  // different project gets the warning, naming the claims and their scope.
  if (scoped.size) {
    const warn = ['> ## ⚠ Claims in this section are scoped to a different project', '>'];
    warn.push('> The following appear below as candidates, but their quotes are **not about the Webequie Supply');
    warn.push('> Road**. Read the scope before using any of them.', '>');
    const rank = (v) => v.candidate.length * 100 + v.topic.length;
    for (const v of [...scoped.values()].sort((a, b) => rank(b) - rank(a) || a.c.id.localeCompare(b.c.id))) {
      const where = [
        v.candidate.length ? `**as a candidate** under ${v.candidate.join(', ')}` : null,
        v.topic.length ? `as a topic candidate under ${v.topic.join(', ')}` : null,
      ].filter(Boolean).join('; ');
      warn.push(`> - **${v.c.id}** — ${v.c.scope}`);
      warn.push(`>   Appears ${where}.`);
      if (v.c.scopeWarning) warn.push(`>   *${v.c.scopeWarning}*`);
    }
    warn.push('>', '> A candidate list cannot tell which project a quote is about. The scope field and the quote can.', '');
    o.splice(warnAt, 0, ...warn);
  }
  fs.writeFileSync(path.join(OUT, name), o.join('\n'));
  summary.push({ file: name, title: sec.title, paras: sec.paras.length, withCands, scoped: [...scoped.keys()] });
}

// ── Summary ────────────────────────────────────────────────────────────────────

// ── Name coverage ──────────────────────────────────────────────────────────────
// Aroland was invisible until a spot check happened to land on it. A name with zero
// matches is either genuinely absent from the ledger or another stripped-suffix bug, and
// only this report says which.

const WATCHLIST = ['Attawapiskat', 'Kashechewan', 'Fort Albany', 'Moose Cree', 'Eabametoong',
  'Long Lake #58', 'Missanabie Cree', 'Weenusk', 'Nibinamik', 'Ginoogaming', 'Constance Lake',
  'Mushkegowuk Council', 'Nishnawbe Aski Nation', 'Wildlands League', 'Matawa', 'Kimesskanemenow',
  'Aroland', 'Marten Falls', 'Neskantaga'];

const draftNames = new Map(); // key -> {surface, paras:Set}
for (const sec of sections) {
  for (const para of sec.paras) {
    for (const [k, surf] of items(para.text)) {
      if (!k.startsWith('name:')) continue;
      if (!draftNames.has(k)) draftNames.set(k, { surface: surf, paras: new Set() });
      draftNames.get(k).paras.add(para.p);
    }
  }
}
const nameHits = new Map();
for (const k of draftNames.keys()) nameHits.set(k, claimItems.filter(({ m }) => m.has(k)).map(({ c }) => c.id));

const n = ['# Name coverage — every name in draft 1, and how many claims carry it', ''];
n.push(`Generated ${today}. A name with **0 claims** is either genuinely absent from the ledger — in which case`);
n.push('a document must be opened — or a bug in how the name is extracted. Only opening the ledger says which.');
n.push('');
n.push('"Not in the reviewed sections" means the name does not appear in sections 1–10, "Closing: Neskantaga" or');
n.push('"FOOTNOTES". It may still appear in the HOLDING sections, which this task does not cover, and it may still');
n.push('be carried by claims — the claims column is counted over the whole ledger either way.');
n.push('');
n.push('## Watchlist');
n.push('');
n.push('| name | extracted from draft 1? | claims | claim ids |');
n.push('| --- | --- | --- | --- |');
for (const w of WATCHLIST) {
  // "Long Lake #58" is indexed as "long lake": the "#" is not part of a name token. Try the
  // relaxed key too, or the watchlist reports a bug where there is none.
  const keys = [...new Set([`name:${normName(w)}`, `name:${normName(w).replace(/[\s\d#.,-]+$/, '')}`])];
  const key = keys.find((k) => draftNames.has(k)) || keys.find((k) => (nameHits.get(k) || claimItems.filter(({ m }) => m.has(k))).length) || keys[0];
  const inDraft = draftNames.has(key);
  const hits = nameHits.get(key) || claimItems.filter(({ m }) => m.has(key)).map(({ c }) => c.id);
  const as = key !== `name:${normName(w)}` ? ` *(as "${key.slice(5)}")*` : '';
  n.push(`| ${w}${as} | ${inDraft ? `yes (${[...draftNames.get(key).paras].join(', ')})` : '**not in the reviewed sections**'} | ${hits.length || '**0**'} | ${hits.slice(0, 14).join(', ') || '—'}${hits.length > 14 ? ' …' : ''} |`);
}
n.push('');
n.push(`## Every name extracted from draft 1 (${draftNames.size}), fewest matches first`);
n.push('');
n.push('| name | paragraphs | claims | claim ids |');
n.push('| --- | --- | --- | --- |');
for (const [k, v] of [...draftNames.entries()].sort((a, b) => (nameHits.get(a[0]).length - nameHits.get(b[0]).length) || a[0].localeCompare(b[0]))) {
  const hits = nameHits.get(k);
  n.push(`| ${cell(v.surface)} | ${[...v.paras].slice(0, 8).join(', ')}${v.paras.size > 8 ? ` +${v.paras.size - 8}` : ''} | ${hits.length || '**0**'} | ${hits.slice(0, 10).join(', ') || '—'}${hits.length > 10 ? ' …' : ''} |`);
}
n.push('');
fs.writeFileSync(path.join(OUT, 'name-coverage.md'), n.join('\n'));

const s = [];
s.push('# Task C — candidates by section');
s.push('');
s.push(`Generated ${today}. One file per section; open a file to see each paragraph's candidates.`);
s.push('');
s.push('| file | section | paragraphs | paragraphs with at least one candidate |');
s.push('| --- | --- | --- | --- |');
for (const r of summary) s.push(`| \`${r.file}\` | ${r.title} | ${r.paras} | ${r.withCands} |`);
const tp = summary.reduce((a, r) => a + r.paras, 0);
const tw = summary.reduce((a, r) => a + r.withCands, 0);
s.push(`| | **total** | **${tp}** | **${tw}** |`);
s.push('');
s.push('## Items ignored as too common');
s.push('');
s.push('The handoff names six: Ontario, Canada, First Nation(s), Ring of Fire, Webequie, Agency.');
s.push(`On top of those, an item appearing in more than 40% of the ${claimItems.length} claims discriminates nothing,`);
s.push('so it was not counted as shared:');
s.push('');
if (dropped.length) for (const [k, cnt] of dropped.sort((a, b) => b[1] - a[1])) s.push(`- \`${k}\` — in ${cnt} claims`);
else s.push('- none: no item reached that frequency.');
s.push('');
s.push('## Quote ranges excluded from matching');
s.push('');
s.push('These ranges stay in the quote everywhere a reader sees it — `ledger-export.md` shows each quote whole.');
s.push('They are skipped when building candidates, because an enumerated list of places and distances is context');
s.push('in any quote, not the claim being made, and indexing it makes one claim a candidate for every paragraph');
s.push('that happens to name one of those places.');
s.push('');
if (excluded.length) {
  s.push('| claim | how | reason | excluded text |');
  s.push('| --- | --- | --- | --- |');
  for (const e of excluded) s.push(`| ${e.id} | ${e.auto ? 'detected' : 'recorded in the ledger'} | ${cell(e.reason)} | ${cell(e.text)} |`);
} else s.push('- none.');
s.push('');
s.push('## Acronyms');
s.push('');
s.push('A bare alphabetic acronym is indexed only under the name its **own source document** resolves it to');
s.push('("Full Name (ACRO)"), and never when that document resolves it two ways — "WFN" is Webequie First Nation');
s.push('in one place in this record and Weenusk First Nation in another. Identifiers carrying a digit or hyphen');
s.push('(ARA-2, RCU100, Table 4-5) are unambiguous and are indexed as they stand.');
s.push('');
if (acronymReport.length) {
  s.push('Acronyms left unindexed because their own source resolves them more than one way:');
  s.push('');
  s.push('| source | acronym | resolves to |');
  s.push('| --- | --- | --- |');
  for (const a of acronymReport) s.push(`| ${a.source} | ${a.acro} | ${a.expansions.join(' · ')} |`);
} else s.push('- no source resolved an acronym two ways.');
s.push('');
s.push('See `name-coverage.md` for every name in draft 1 and how many claims carry it.');
s.push('');
fs.writeFileSync(path.join(OUT, 'summary.md'), s.join('\n'));

console.log(`Wrote ${summary.length} section files + summary.md to ${OUT}`);
console.log(`  ${tp} paragraphs · ${tw} with at least one candidate · ${tp - tw} with none`);
console.log(`  ${claimItems.length} claims indexed · ${dropped.length} item(s) dropped as too frequent`);
for (const r of summary) console.log(`  ${r.file}  ${r.withCands}/${r.paras}  ${r.title}`);
