# Research Quality Bar

One-page rejection criteria for country content. If any of these apply, the content must be revised before merging.

---

## What "fact-checked" means

A source is fact-checked when **all three** of the following are true:

1. **URL opened in the last 30 days** — the link resolves and the document is the one you intend to cite
2. **Specific claim verified** — the exact figure, event, or statement appears verbatim or in close paraphrase in the source; you are not relying on a summary or memory of what it said
3. **Source confirmed as primary author** — the source originated the data or recorded the event, not merely reported or analyzed it (see Fact vs. Interpretation below)

If any of these three conditions fails, the source is not fact-checked for that claim.

---

## Automatic rejects (fail validation)

These are caught by `npm run validate:countries` and will block the PR:

| Issue | What the validator checks |
|---|---|
| Uncited claim | Every narrative field must contain at least one `[source-id]` |
| Broken citation ID | Every `[id]` in text must match an entry in the sources JSON block of `analysis.yaml` |
| Ghost anchor | Every `[dot.path]` anchor must resolve to a non-empty field of this report (same class as a ghost citation) |
| ~~Orphan source~~ → **warning, not a reject** | An uncited source no longer blocks. It is a **warning, grouped by peer** in the apply/validate output — for both event sources (found, considered, excluded — a completed check) and non-event sources. An uncited non-event source signals thin PROSE (a section Pass B under-wrote), not a bad source; blocking it would stop the report being read in order to fix it. **Still hard errors:** ghost citations (a `[id]` with no matching source) and schema violations. |
| Invalid source ID | IDs must be `lowercase-alphanumeric-hyphens` only |
| Missing required fields | `name`, `url`, `desc` required on every source entry |

---

## Human review rejects

These require reviewer judgment — the validator cannot catch them:

### Source quality
- **Wikipedia as a citation** — Wikipedia is useful for locating the primary source via its reference list. Never cite Wikipedia itself. Follow the citation chain to the originating dataset or official document and cite that instead.
- **Interpretation tagged as Fact** — if the cited source is a think tank, business association, or news outlet analyzing data it did not originate, it must be `citationType: Interpretation`, not `Fact`. Example: a Canadian Chamber of Commerce survey on business sentiment is Interpretation; a Statistics Canada GDP release is Fact. On the website, Interpretation citations render with a dotted underline to flag them to readers — misclassifying Interpretation as Fact corrupts that signal and misleads reviewers.
- **News article as primary source for statistics** — use the original data publication (IMF, Statistics Canada, etc.)
- **Source older than 3 years** for fast-moving topics (politics, economics) — set `volatility: High` (freshness is the volatility axis's job; do NOT downgrade `confidence`, which measures source quality, not age)
- **Paywalled source** with no archive link — must add `archiveUrl` or replace
- **`desc` that states the data instead of the source** — `desc` gives the source's scope, role and authoritative status in ~20–30 words (what the source IS: a national inventory report, a live standings page, a court ruling), plus any bias or reservation. It never states the specific numbers or claims the prose draws from it. Test: if a fact in the `desc` could be edited to a new value while the prose still cites the id unchanged, it does not belong in the `desc`.
- **EN/FR citation (and anchor) parity gap** — EN and FR must cite the same IDs and carry the same anchors in each section. This is a MANUAL reviewer check; no validator enforces it.

### Content quality
- **Manus-generated text without re-research** — identifiable by vague, non-specific language, round numbers, or claims that don't survive a quick Google check
- **Forward-looking statements presented as facts** — "the government will" should be "the government is expected to"
- **Missing data year** — "GDP grew 2%" with no year specified is not acceptable
- **Passive voice hiding uncertainty** — "it is believed that" signals unverifiable claim; cite or remove

### Cross-cutting discipline — acronyms
- **Unglossed acronym at first mention** — the first mention of any acronym or initialism in a country
  report — no exceptions — spells the term in full, followed by the abbreviation in parentheses on that
  first mention only. All subsequent mentions in the same report may use the short form. This applies to
  every acronym without carve-outs: universal ones (GDP, UN, EU), sectoral ones (LULUCF, RCP, FPIC),
  organizational ones (IMF, OECD, NATO, WHO), country-specific ones (RCMP, NRCan, StatCan, PBO), and any
  others. The report is written for a reader who does not work in the sector, and the extra half-line per
  acronym on first mention is a discipline, not a compromise. ISO-3166 alpha-3 country codes used as
  internal identifiers (CAN, USA, DEU) are structural markers, not acronyms in prose, and are exempt when
  they appear as data-field identifiers; when such a code appears in the reader-facing prose itself, spell
  it: "Canada," not "CAN."

### Translation quality
- **Machine translation without review** — identifiable by unnatural word order, false cognates (e.g. "actuellement" ≠ "actually"), register inconsistency
- **English person name translated** — "Marc Carney" instead of "Mark Carney" is an error

---

## Confidence level guidelines

| Level | Use when |
|---|---|
| `High` | Primary source: official government data, central bank, international institution (IMF, World Bank, UN) |
| `Med` | Secondary source: reputable think tank, academic paper, major news organization with named sources |
| `Low` | Tertiary source: aggregator, blog, opinion piece |

Target: ≥ 80% of sources at `High`. The validator warns (does not fail) if > 20% are `Med` or `Low`.

## Volatility guidelines (orthogonal to confidence)

`volatility` is the expected rate of change of the fact(s) the source backs — it drives the refresh
worklist, never the quality judgment. A national-statistics figure is `High` confidence AND `High`
volatility. Never overload `confidence` to signal freshness.

| Level | Changes | Refresh | Typical |
|---|---|---|---|
| `High` | ≤ 1 year, or on events | annual / on-event | reserves-with-year, GDP and fiscal figures, seat composition, office-holders, sanctions, program status |
| `Med` | a few years | ~2–3 years | demographic structure, composition shares, productivity trend, memberships |
| `Low` | structural | on major event | constitution, geography, baseline climate type, legal tradition |

The validator warns on missing `volatility` (migration is warning-first; backfill `High` sources first).
