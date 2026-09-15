/*
 * Evidence checks (deterministic) — shared by scripts/article-evidence.cjs.
 * Process: content/docs/article-workflow.md.
 *
 * Why this exists: a model will say it opened a source and then write from a
 * search snippet or from memory, and a correction is where a fresh fill-in is
 * most likely (it happened twice in one essay, 2026). Asking "did you read it?"
 * does not negotiate. These checks ask for things only an OPENED document can
 * supply, and flag the sentence FORMS that assert more than one document shows:
 *   findQuote        — does the claimed verbatim quote occur in the source text?
 *   parseNumbers     — every figure in a sentence, EN or FR formatting, with the
 *                      rounding precision the writer implied ("2,700" = ±50)
 *   numberSupported  — is a prose figure backed by a figure in the cited quote(s)?
 *   classifySentence — the claim tiers (figure/count/ratio/quotation;
 *                      first/absence/attribution; trend/state)
 *
 * Heuristic limits, stated so nobody over-trusts a pass:
 *   - a quote match proves the words are in the document, not that the prose
 *     reads them at the right strength — the reader verdict owns that;
 *   - CAUSAL links are NOT pattern-matched: in this site's register they are
 *     carried by colons and juxtaposition, not "because", so a regex tier would
 *     be blind while looking like coverage. The verifier prompt asks for them;
 *   - a fluent sentence with no figure and no flagged form ("repair capacity is
 *     limited") passes every pattern. The boundary rule — only questions,
 *     document links and gaps cross from exploration to writing — is what keeps
 *     such sentences from arriving in the first place.
 */

'use strict';

const { spawnSync } = require('child_process');

// ── Text extraction ────────────────────────────────────────────────────────────

const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: '’', lsquo: '‘',
  rdquo: '”', ldquo: '“', ndash: '–', mdash: '—', hellip: '…', laquo: '«', raquo: '»',
  eacute: 'é', egrave: 'è', ecirc: 'ê', agrave: 'à', acirc: 'â', ccedil: 'ç', ocirc: 'ô',
  icirc: 'î', iuml: 'ï', ucirc: 'û', ugrave: 'ù', deg: '°', euro: '€', shy: '',
};

function decodeEntities(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') {
      const cp = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(cp) ? String.fromCodePoint(cp) : m;
    }
    return ENTITIES[e.toLowerCase()] ?? m;
  });
}

function htmlToText(html) {
  return decodeEntities(
    String(html)
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<(script|style|noscript|svg|head|template)\b[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(p|div|li|h[1-6]|tr|td|th|section|article|blockquote|figcaption|caption)>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
  )
    .replace(/[ \t\f\v ]+/g, ' ')
    .replace(/\n\s*\n+/g, '\n\n')
    .trim();
}

// PDF → text with [[page N]] markers, so a quote's page can be reported/checked.
function pdfToText(file, python) {
  const code = [
    'import sys',
    'from pypdf import PdfReader',
    'r = PdfReader(sys.argv[1])',
    'for i, p in enumerate(r.pages, 1):',
    '    sys.stdout.write("\\n\\n[[page %d]]\\n" % i)',
    '    try:',
    '        sys.stdout.write(p.extract_text() or "")',
    '    except Exception as e:',
    '        sys.stdout.write("[extraction failed: %s]" % e)',
  ].join('\n');
  const res = spawnSync(python, ['-c', code, file], {
    encoding: 'utf8',
    maxBuffer: 512 * 1024 * 1024,
    env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
  });
  if (res.status !== 0) throw new Error(`pypdf failed on ${file}: ${res.stderr || res.error}`);
  return res.stdout;
}

// ── Quote matching ─────────────────────────────────────────────────────────────

function normalize(s) {
  return String(s ?? '')
    .normalize('NFKC') // NBSP / narrow NBSP → space, ligatures split
    .replace(/­/g, '')
    .replace(/(\p{L})-[ \t]*\n\s*(\p{L})/gu, '$1$2') // PDF line-break hyphenation
    .replace(/[‘’‚′`´]/g, "'")
    .replace(/[“”„″"«»]/g, '') // quote marks carry no meaning here
    .replace(/[‐-―−]/g, '-')
    .replace(/…/g, '...')
    .replace(/\s+/g, ' ')
    .replace(/ ([,.;:!?)\]])/g, '$1') // tag-stripping leaves "2025 ," — FR spacing too
    .toLowerCase()
    .trim();
}

function splitPages(docText) {
  const parts = String(docText).split(/\[\[page (\d+)\]\]/);
  if (parts.length === 1) return [{ page: null, text: normalize(parts[0]) }];
  const out = [];
  if (parts[0].trim()) out.push({ page: null, text: normalize(parts[0]) });
  for (let i = 1; i < parts.length; i += 2) out.push({ page: Number(parts[i]), text: normalize(parts[i + 1] || '') });
  return out;
}

function words(s) {
  return s.split(/[^\p{L}\p{N}%.,']+/u).map((w) => w.replace(/^[.,']+|[.,']+$/g, '')).filter(Boolean);
}

/**
 * @returns {{status:'exact'|'near'|'missing'|'empty', page?:number|null, coverage?:number}}
 * exact  — every segment (split on "..." elisions) occurs verbatim after normalisation
 * near   — ≥80% of the quote's word trigrams occur: probably a transcription slip,
 *          possibly a paraphrase dressed as a quote — a human looks
 * missing— the words are not in this document
 */
function findQuote(quote, docText) {
  const segments = normalize(quote).split(/\s*(?:\[\.\.\.\]|\.\.\.)\s*/).filter((x) => x.length >= 3);
  if (!segments.length) return { status: 'empty' };
  const pages = splitPages(docText);
  const full = pages.map((p) => p.text).join(' ');
  if (segments.every((seg) => full.includes(seg))) {
    const hit = pages.find((p) => p.text.includes(segments[0]));
    return { status: 'exact', page: hit ? hit.page : null, coverage: 1 };
  }
  const q = words(segments.join(' '));
  if (q.length < 3) return { status: 'missing', coverage: 0 };
  const d = words(full);
  const grams = new Set();
  for (let i = 0; i + 2 < d.length; i++) grams.add(`${d[i]} ${d[i + 1]} ${d[i + 2]}`);
  let hit = 0;
  let tot = 0;
  for (let i = 0; i + 2 < q.length; i++) {
    tot++;
    if (grams.has(`${q[i]} ${q[i + 1]} ${q[i + 2]}`)) hit++;
  }
  const coverage = Math.round((hit / tot) * 100) / 100;
  return { status: coverage >= 0.8 ? 'near' : 'missing', coverage };
}

// ── Numbers ────────────────────────────────────────────────────────────────────

const SCALE = {
  thousand: 1e3, thousands: 1e3, mille: 1e3,
  million: 1e6, millions: 1e6, mln: 1e6,
  billion: 1e9, billions: 1e9, milliard: 1e9, milliards: 1e9, bn: 1e9,
  trillion: 1e12, trillions: 1e12,
};

// Grouped thousands ("2,700" / FR "2 700") win over decimals only when the group
// is exactly three digits; otherwise the comma is a decimal ("3,2 millions").
const NUM_RE =
  /(?<![\p{L}\p{N}.,])([$€£]\s?)?(\d{1,3}(?:[,    ]\d{3})+(?!\d)|\d+)(?:([.,])(\d+))?(\s?(?:%|per\s?cent|pour\s?cent))?(?:\s?(thousands?|mille|millions?|mln|billions?|milliards?|bn|trillions?)(?![\p{L}]))?/giu;

function parseNumbers(text) {
  const t = String(text ?? '').replace(/\[[a-z0-9.-]+\]/gi, ' '); // drop [citation] markers
  const re = new RegExp(NUM_RE.source, NUM_RE.flags);
  const out = [];
  let m;
  while ((m = re.exec(t)) !== null) {
    const [raw, cur, intPart, , frac, pct, scaleWord] = m;
    const intDigits = intPart.replace(/\D/g, '');
    const mantissa = Number(intDigits + (frac ? `.${frac}` : ''));
    const scale = scaleWord ? SCALE[scaleWord.toLowerCase()] : 1;
    const isYear = !frac && !pct && !scaleWord && !cur && /^\d{4}$/.test(intPart) && mantissa >= 1800 && mantissa <= 2100;
    // Implied precision: "3.2" → 0.1; "2,700" → 100; "103" → 1; years exact.
    let unit = 1;
    if (frac) unit = 10 ** -frac.length;
    else if (!isYear) {
      const tz = intDigits.match(/0+$/);
      if (tz && intDigits.length > tz[0].length) unit = 10 ** tz[0].length;
    }
    out.push({ raw: raw.trim(), value: mantissa * scale, mantissa, unit, scale, pct: !!pct, currency: cur ? cur.trim() : null, isYear });
  }
  return out;
}

/** Is prose figure n backed by any figure in pool (parsed from the cited quotes)? */
function numberSupported(n, pool) {
  return pool.some((s) => {
    if (n.pct && !s.pct) return false;
    if (Math.abs(n.value - s.value) <= (n.unit * n.scale) / 2 + 1e-9) return true;
    // a table quoted in its own units: prose "$840 million" vs cell "840" (millions)
    if (n.scale !== 1 && s.scale === 1 && Math.abs(n.mantissa - s.value) <= n.unit / 2 + 1e-9) return true;
    return false;
  });
}

// ── Sentences ──────────────────────────────────────────────────────────────────

function sentences(text) {
  return String(text ?? '')
    .split(/\n+|(?<=[.!?])(?<!\b(?:St|Mr|Mrs|Dr|No|vol|pp?|U\.S|e\.g|i\.e|approx|ca)\.)\s+(?=[\p{Lu}"“«(\d])/u)
    .map((s) => s.replace(/^\s*[•\-–]\s*/, '').trim())
    .filter(Boolean);
}

// ── Claim tiers ────────────────────────────────────────────────────────────────
//
// HARD  (no quote → not publishable): figure, count, ratio, direct quotation
// ACK   (quote, or an explicit note in the ledger): first/superlative,
//        attribution; negative existence needs a quote or a SEARCHED gap record
// WARN  trend (direction asserted — needs two data points), state (needs a date)
//
// Word boundaries are Unicode-aware (\b is ASCII-only in JS and breaks on "é").

const W = (alts) => new RegExp(`(?<![\\p{L}\\p{N}])(?:${alts})(?![\\p{L}\\p{N}])`, 'iu');

const PATTERNS = {
  en: {
    stop: /(?<![\p{L}])(?:not only)(?![\p{L}])/giu,
    count: W('two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|a dozen|dozens|hundreds|thousands|twice|triple|quadruple'),
    ratio: [W('times|twice|per ?cent of|share of|ratio|compared (?:with|to)|versus|less than|more than|fewer than|faster than|slower than|higher than|lower than|fewer|faster|slower'), /%\s*of(?![\p{L}])/iu],
    first: W('first|only|sole|largest|biggest|smallest|highest|lowest|longest|fastest|record|unprecedented|virtually|practically|each of|every year|since \\d{4}'),
    absence: W('none|nothing|never|non-existent|nonexistent|nobody|no one|no (?:official |public |reliable )?(?:data|source|sources|record|records|evidence|study|studies|statistics|agency|body|mechanism|application|registry)|do(?:es)? not (?:yet )?exist|not (?:publicly )?(?:available|published|accessible|measured|tracked|recorded)|appears? to publish'),
    // "states that", not "states": the bare word is the noun in "United States", "member states".
    attribution: W('according to|notes|noted|argues|argued|finds|found that|reports|reported|says|said|states that|stated that|estimates|warns|concludes'),
    trend: W('increasingly|growing|rising|declining|decreasing|accelerating|expanding|intensifying|shrinking|widening|narrowing|more and more|on the rise|in decline'),
    state: W('still|remains?|remained|currently|as of|no longer|now|today|already|underway|at present|so far|to date'),
  },
  fr: {
    // Removed before matching: word senses that are not claims ("matières premières" = raw
    // materials, "ses seules capacités" = its mere capacity, "n'a rien d'accessoire",
    // "les deux" = both).
    stop: /(?<![\p{L}])(?:(?:non seulement|un seul|une seule|d['’]un seul|d['’]une seule|matières premières|premiers? ministres?|première ministre|rien de|les deux|ces deux|des deux|aux deux)(?![\p{L}])|rien d['’])/giu,
    count: W('deux|trois|quatre|cinq|six|sept|huit|neuf|dix|onze|douze|treize|quatorze|quinze|seize|vingt|trente|quarante|cinquante|une douzaine|des dizaines|des centaines|des milliers|triple|quadruple'),
    ratio: [W('fois|pour ?cent de|part de|ratio|par rapport (?:à|au|aux)|comparé|contre|moins de|plus de|de moins|de plus'), /%\s*de(?![\p{L}])/iu],
    first: W('premier|première|premiers|premières|le seul|la seule|les seuls|les seules|seule? à|seules? à|seuls à|record|sans précédent|pratiquement|quasi|quasiment|le plus|la plus|les plus|chacun des|chacune des|chaque année|depuis \\d{4}'),
    absence: W("aucun|aucune|rien|jamais|inexistant|inexistante|inexistants|personne ne|nul ne|n['’]existe(?:nt)? pas|ne semblent? (?:pas )?publier|pas (?:publiquement )?(?:disponibles?|publiée?s?|accessibles?|mesurée?s?)"),
    attribution: W("d['’]après|souligne|soulignent|affirme|affirment|constate|constatent|estime|estiment|rapporte|indique|avance|conclut|note que"),
    // "selon" is attribution only before a name ("selon Lasserre", "selon la Banque du
    // Canada"), not in "divergent selon les champs". Case-sensitive on purpose (no i flag).
    attributionNamed: /(?<![\p{L}])[Ss]elon\s+(?:(?:le|la|les|l['’]|un|une|des|leur|leurs)\s*)?\p{Lu}/u,
    trend: W("de plus en plus|croissante?s?|en hausse|en baisse|s['’]intensifie|s['’]accélère|se creuse|se creusent|se multiplient|augmente|augmentent|diminue|diminuent|recule|progresse"),
    state: W("encore|toujours|demeure|demeurent|actuellement|désormais|n['’]est plus|ne sont plus|déjà|en cours|à ce jour|jusqu['’]à présent|aujourd['’]hui"),
  },
};

const AUTHOR_YEAR = /\([\p{Lu}][\p{L}'’-]+(?:\s+[\p{Lu}][\p{L}'’-]+)*(?:\s+(?:et al\.|&|and|et)\s*[\p{L}'’-]*)?,\s*\d{4}\)|[\p{Lu}][\p{L}'’-]+\s+\(\d{4}\)/u;
const QUOTATION = /[“«"]\s*([^”»"]{12,}?)\s*[”»"]/gu;

const TIER_OF = {
  figure: 'hard', count: 'hard', ratio: 'hard', 'direct-quote': 'hard',
  'first-superlative': 'ack', 'negative-existence': 'ack', attribution: 'ack',
  trend: 'warn', state: 'warn',
};

/** @returns {Array<{tier:'hard'|'ack'|'warn', kind:string, match:string}>} */
function classifySentence(text, lang = 'en') {
  const P = PATTERNS[lang] || PATTERNS.en;
  const t = String(text ?? '').replace(P.stop, ' ');
  const out = [];
  const add = (kind, match) => out.push({ tier: TIER_OF[kind], kind, match });
  const hit = (re) => {
    const m = t.match(re);
    return m ? m[0] : null;
  };

  const figures = parseNumbers(t).filter((n) => !n.isYear);
  if (figures.length) add('figure', figures.map((n) => n.raw).join(' · '));
  const count = hit(P.count);
  if (count) add('count', count);
  const ratio = P.ratio.map(hit).find(Boolean);
  if (ratio && (figures.length || count)) add('ratio', ratio);
  for (const q of t.matchAll(QUOTATION)) if (q[1].trim().split(/\s+/).length >= 3) add('direct-quote', q[1].trim());

  const first = hit(P.first);
  if (first) add('first-superlative', first);
  const absence = hit(P.absence);
  if (absence) add('negative-existence', absence);
  const attribution = hit(P.attribution) || (P.attributionNamed && hit(P.attributionNamed)) || hit(AUTHOR_YEAR);
  if (attribution) add('attribution', attribution);

  const trend = hit(P.trend);
  if (trend) add('trend', trend);
  const state = hit(P.state);
  if (state) add('state', state);
  return out;
}

module.exports = {
  htmlToText, pdfToText, normalize, findQuote, parseNumbers, numberSupported, sentences, classifySentence, TIER_OF,
};
