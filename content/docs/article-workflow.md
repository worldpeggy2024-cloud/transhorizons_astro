# Article workflow — questions, documents, quoted facts

How an article goes from "a topic I don't know yet" to published text where every checkable sentence
traces to a document someone opened. Adopted 2026-09-14, after the Canada-Multipolar essay was found to
carry an invented "first since 2021", a cargo list from a 2013 source placed in 2025, a ratio built on a
figure read off a screenshot and a denominator from nowhere, and a Chat that twice filled a gap while
*correcting* an earlier fill-in.

The country-report pipeline controls this with fixed questions (the template). An article starts from a
loose question, so the control here is different: **we do not try to control what an AI generates; we
control what is allowed to cross from one stage to the next.**

## The two rules

1. **Sentences do not travel.** Exploration may write as much prose as it likes. Only three things leave
   it: **questions**, **document links**, and **gaps** (a question nothing answered). No findings, no
   figures, no summaries — in any wording. `boundary.json` has no field that can hold one.
2. **No fact enters the article without a verbatim quote from a document that was actually opened**, and
   every quote gets a verdict from a reader who sees only the sentence and the quote. The checker runs on
   the article file as it is *now*: it cannot tell a first draft from a revision, so a "fix" is checked
   exactly like a draft.

## The steps

| # | Step | Who | Produces |
|---|---|---|---|
| 1 | Explore | any AI, free prose; Peggy decides | `boundary.json`: questions, document links, gaps |
| 2 | Gather | Claude Code | `cache/` (disposable text), `ledger.json` claims with quotes |
| 3 | Write | a fresh chat, memory off | article prose using only ledger facts; gaps named as gaps |
| 4 | Check | Claude Code, after **every** edit | the list of what is not yet publishable |
| 5 | Verify | a fresh chat, memory off | verdicts recorded in the ledger |
| 6 | Decide | Peggy | only the flagged items |

All commands: `npm run article:evidence -- <command> <slug>`.

### 1. Explore

Start a job: `npm run article:evidence -- init <slug>` (add `--article content/articles/<file>.yaml` if the
article is not in `src/lib/articleRegistry.ts` yet). This creates `content/docs/article-jobs/<slug>/`.

Explore freely in any chat. When the shape of the topic is clear, **decide the questions yourself**, then
ask the chat to hand over the boundary with this prompt, and leave that chat behind — never draft in it:

> Produce ONLY a JSON object with three lists and nothing else.
> `questions`: `{"id": "q1", "text": "…?"}` — one question per entry, ending in "?", no figures in it.
> `documents`: `{"id": "short-name", "url": "https://…", "answers": ["q1"]}` — the specific report, dataset,
> ruling or official page that would answer the question. A link you actually retrieved, never one
> constructed to look right. No description, no summary of what it says.
> `gaps`: `{"id": "g1", "question": "…?", "searched": []}` — questions nothing you found answers. List
> these deliberately: what nobody measures is often the most important finding.
> Do not state any fact anywhere in the object.

Save it as `boundary.json`, then `npm run article:evidence -- boundary <slug>`. It rejects any extra field,
any non-question, any figure inside a question, and warns about a question with neither a document nor a gap
(so it is not silently dropped).

A **gap** crosses as a marked absence so the draft can say what nobody measures. Before the draft may
*assert* an absence ("no official source publishes…"), the gap's `searched` list must record where it was
looked for and when: `{"where": "https://… or the name of the place", "date": "YYYY-MM-DD"}`.

**List gaps apart from the questions, as named silences, with their own counts.** A question the documents
are silent on is often the strongest thing an article can say; placed among the questions with confirmed
facts it looks like a question with zero facts and gets dropped for the wrong reason. But a silence is only
as strong as its search. Search the documents already gathered for each candidate and give it one of three
verdicts: **holds** (nothing in what was searched — say what that was), **holds only here** (the obvious place
was not searched yet), or **not a silence** (the record addresses it — the draft changes, and nothing crosses as
a gap). On Ring of Fire (2026-09-15) four of eight candidate silences turned out not to be silences: the
mercury analyses existed in an appendix, a cost-of-living final report had been posted, and the three roads'
cumulative effects had been assessed inside one project's report.

### 2. Gather

`npm run article:evidence -- fetch <slug>` downloads every document into `cache/` as text (PDFs
included) and lists the few it cannot reach (bot-blocked, login walls, JavaScript-only pages). **Only
those** need a manual download, saved as `manual/<id>.pdf` (or `.docx`/`.html`/`.txt`); fetch again. A
source with no public link at all (a submission someone sent you) goes in `ledger.json` `sources` with no
`url` and its file in `manual/`. `cache/` and `manual/` are gitignored and never deployed — the internet is
the archive, not a local folder.

`npm run article:evidence -- quotes <slug>` then matches every quote against its document **before any
prose exists**, and records the result on each claim. At this stage a claim carries a short `fact` label
instead of a `sentence`; the checker ignores it until the article is written and the claim is attached to
a sentence. Anything short of an exact match is looked at by eye: page breaks with running headers, a
label and its value on separate lines, footnote markers — or a quote that is simply not in the document.

Claude Code then reads the cached text and records each usable fact in `ledger.json`:

```json
{ "id": "c1", "lang": "en", "sentence": "<exact words of the article sentence>",
  "source": "<document id>", "quote": "<verbatim, copied from the cached text>",
  "locator": "p. 14 / Table 3", "scope": "2023, federal only" }
```

`sentence` is filled in once the article text exists (step 3). A **ratio or computed figure** is a derived
claim with at least two quoted inputs:
`{ "id": "c9", "lang": "en", "sentence": "…", "derived": { "expr": "a / b * 100", "vars": { "a": { "value": 840, "from": "c7" }, "b": { "value": 768000, "from": "c8" } } } }`.

### 3. Write

In a **new chat with memory off, outside any project**, give the writer the questions, the gaps, and the
ledger's quotes (not the exploration chat, not prior drafts):

> Write the article from these quoted facts only. Every figure, count, date, first/only/record, "according
> to", and every statement that something does not exist must come from a quote below. If a sentence needs a
> fact that is not here, write [NEEDS SOURCE] in its place — never fill it in. Name each gap as an open
> question or as "not found in X and Y (searched <date>)" only when a search is recorded. Your own reasoning
> is welcome; keep it recognisable as reasoning.

French follows the site rule: Peggy reviews and finalises it; AI drafts are marked `FR-PLACEHOLDER`.
Claims are per language (`"lang": "fr"`, with the French sentence) because the French text is checked too.

### 4. Check — after every edit, including "fixes"

`npm run article:evidence -- check <slug>` compares the article with the ledger:

| Tier | Sentence forms flagged | What satisfies it |
|---|---|---|
| **Blocks publication** | figures; counts (also in words: "eleven", "onze"); ratios and comparisons; direct quotations | a quoted claim whose quote carries every figure; a derived claim with ≥ 2 quoted inputs |
| **Must be acknowledged** | first / only / record / virtually / since YEAR; attributions ("according to", "X notes", "(Author, 2025)") | a quoted claim, or a note `{ "lang", "sentence", "kind": "reasoning" }` |
| | negative existence ("no official source…", "none", "never", "aucun…") | a quoted claim, or a note `{ "kind": "gap", "gap": "g1" }` whose gap records a search — **reasoning is not enough to show absence** |
| **Warning** | trend asserted ("increasingly", "growing", "de plus en plus") | read as a question: is the direction *shown* (two data points) or only asserted? |
| | temporal state ("still", "remains", "no longer", "demeure") | a note `{ "kind": "as-of", "asOf": "YYYY-MM-DD" }`; warns again after 30 days |

The check also fails on: a quote not found in the fetched text; a claim whose sentence was rewritten
(**STALE** — re-attach and re-verify); a verdict given before the sentence or quote changed; any claim
without a verdict. `check` online re-matches every quote and records the result; `check --offline` uses the
recorded matches.

Calibration (Canada-Multipolar, 2026-09-14): a prototype flagged 24 of 91 English sentences and found, from
form alone, all four problems found by hand that day.

### 5. Verify

`npm run article:evidence -- verify-prompt <slug>` writes `verify.prompt.md` for every quoted claim
without a current verdict. Paste it into a **new chat with memory off**; it sees only sentence + quote and
answers supported / partial / contradicted / not-in-source. Save the JSON reply and run
`npm run article:evidence -- verdicts <slug> <file>`.

This is the layer that catches what no pattern can: a claim stronger than its quote (a road that lowered
food prices while cutting some subsidies, written as "food is net dearer"), an estimate written as a
measurement, and **causal links** — which this site's prose carries with colons and juxtaposition, not
"because", so no regex tier exists for them. A **partial** verdict blocks until the prose is adjusted and a
`"resolution"` is written on the claim.

### 6. Decide and publish

Peggy reads only the flagged items. Then `npm run article:ready <slug>` and `npm run deploy` as usual.

**The build gate:** `prebuild` runs `article-evidence gate` (offline). It fails the build only for an
article that is `finalised` in the registry **and** has a ledger in `enforced` mode with blocking issues.
Articles without a ledger — everything published before this workflow — are untouched. A ledger can be set
to `"mode": "audit"` to report without gating.

## What this does not catch

- A fluent sentence with no figure and no flagged form ("repair capacity in the region is limited"). The
  boundary is what keeps such sentences from arriving; the verifier catches them only if they carry a quote.
- Causation, by pattern. It is a verifier question.
- Whether the questions were the right ones. That stays Peggy's judgement.

## Files

- `scripts/article-evidence.cjs` — the commands; `scripts/lib/evidence.cjs` — quote matching, number
  parsing (EN/FR), sentence tiers.
- `content/docs/article-jobs/<slug>/` — `boundary.json`, `ledger.json`, `verify.prompt.md`
  (committed); `cache/`, `manual/` (gitignored, not deployed).
