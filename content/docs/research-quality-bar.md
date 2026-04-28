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
| Broken citation ID | Every `[id]` in text must match an entry in `*.sources.yaml` |
| Citation parity gap | EN and FR must cite exactly the same IDs in each section |
| Orphan source | A source defined in `*.sources.yaml` but never cited in EN text |
| Invalid source ID | IDs must be `lowercase-alphanumeric-hyphens` only |
| Missing required fields | `name`, `url`, `desc` required on every source entry |

---

## Human review rejects

These require reviewer judgment — the validator cannot catch them:

### Source quality
- **Wikipedia as a citation** — Wikipedia is useful for locating the primary source via its reference list. Never cite Wikipedia itself. Follow the citation chain to the originating dataset or official document and cite that instead.
- **Interpretation tagged as Fact** — if the cited source is a think tank, business association, or news outlet analyzing data it did not originate, it must be `citationType: Interpretation`, not `Fact`. Example: a Canadian Chamber of Commerce survey on business sentiment is Interpretation; a Statistics Canada GDP release is Fact. On the website, Interpretation citations render with a dotted underline to flag them to readers — misclassifying Interpretation as Fact corrupts that signal and misleads reviewers.
- **News article as primary source for statistics** — use the original data publication (IMF, Statistics Canada, etc.)
- **Source older than 3 years** for fast-moving topics (politics, economics) — flag with `confidence: Low`
- **Paywalled source** with no archive link — must add `archiveUrl` or replace

### Content quality
- **Manus-generated text without re-research** — identifiable by vague, non-specific language, round numbers, or claims that don't survive a quick Google check
- **Forward-looking statements presented as facts** — "the government will" should be "the government is expected to"
- **Missing data year** — "GDP grew 2%" with no year specified is not acceptable
- **Passive voice hiding uncertainty** — "it is believed that" signals unverifiable claim; cite or remove

### Translation quality
- **Machine translation without review** — identifiable by unnatural word order, false cognates (e.g. "actuellement" ≠ "actually"), register inconsistency
- **English person name translated** — "Marc Carney" instead of "Mark Carney" is an error

---

## Confidence level guidelines

| Level | Use when |
|---|---|
| `High` | Primary source: official government data, central bank, international institution (IMF, World Bank, UN) |
| `Med` | Secondary source: reputable think tank, academic paper, major news organization with named sources |
| `Low` | Tertiary source: aggregator, blog, opinion piece; or data older than 3 years on fast-moving topic |

Target: ≥ 80% of sources at `High`. The validator warns (does not fail) if > 20% are `Med` or `Low`.
