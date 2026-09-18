# Article workflow — questions, documents, quoted facts

How an article goes from "a topic I don't know yet" to published text where every checkable sentence
traces to a document someone opened. Adopted 2026-09-14, after the Canada-Multipolar essay was found to
carry an invented "first since 2021", a cargo list from a 2013 source placed in 2025, a ratio built on a
figure read off a screenshot and a denominator from nowhere, and a Chat that twice filled a gap while
*correcting* an earlier fill-in.

The country-report pipeline controls this with fixed questions (the template). An article starts from a
loose question, so the control here is different: **we do not try to control what an AI generates; we
control what is allowed to cross from one stage to the next.**

## Starting a new article — the short version

Everything gathered on one question lives in one folder, `content/docs/article-jobs/<name>/`, and every
command has the form `npm run article:evidence -- <command> <name>`, run at the project root. Type them
yourself, or ask Claude Code ("start a job on the Ring of Fire roads") and it runs them. Seven moves, tagged
with the numbered steps they belong to:

1. **Explore, in any chat** (step 1). A question you want researched is not yet an article. Read around the
   topic as freely as you like — nothing is created while you do, and a question that dies here leaves
   nothing behind. Then *you* decide the questions — a few, not fifteen — and ask that chat for the
   boundary JSON with the prompt in step 1.
2. **Start the job** (step 1). `npm run article:evidence -- init <name>`, named after the question, not
   after an article that may never exist. It creates the folder; paste the JSON into its `boundary.json`,
   run `boundary <name>` to check it, and leave that chat behind. Nothing else travels out of it: no
   findings, no figures, no prose.
3. **Gather** (step 2). `fetch <name>` downloads the documents into `cache/`; you download by hand only
   what it reports as blocked. Claude Code reads them and records each fact in `ledger.json` as a verbatim
   quote, and `quotes <name>` matches every quote back against its document.
4. **Read what was gathered** (step 2b). A chat that answers only from the ledger and drafts nothing. You
   ask what the quotes actually support, and you decide the order: the sections in sequence, each with its
   question and a word budget. That order is the only thing that goes to the writer — no conclusion.
5. **Write** (step 3). A fresh chat, memory off, outside any project, receives the section order, the
   questions, the gaps and the quotes (`id`, `source`, `locator`, `scope`, `quote`). Never a previous
   draft, never a style sample.
6. **Check — before you read** (steps 4 and 5). Claude Code runs `check <name>` for the form (does every
   figure rest on a quote?), then has independent readers read each fact sentence against the document
   *around* its quote, and applies their corrections. You get the corrected draft and the list of what
   changed.
7. **Read and publish** (step 6). You read it once, as a reader. When you are happy:
   `npm run article:ready <slug>`, then `npm run deploy`.

**If and when the question becomes an article**, `npm run article:evidence -- link <name> <article-slug>`
binds the job to the article's YAML and renames the folder to that slug. Until then the job is unbound and
nothing needs it — only the step-4 check asks, and the build gate skips a job with no article. A question
that never becomes one is a folder you keep or delete; it breaks nothing.

Moves 1, 4, 5 and 7 above are yours; the rest is Claude Code's. The rules below say why each hand-over is so
narrow, and the steps after them give each one in full.

## The four rules

1. **Sentences do not travel.** Exploration may write as much prose as it likes. Only three things leave
   it: **questions**, **document links**, and **gaps** (a question nothing answered). No findings, no
   figures, no summaries — in any wording. `boundary.json` has no field that can hold one.
2. **No fact enters the article without a verbatim quote from a document that was actually opened**, and
   every sentence carrying a fact is read **once**, before Peggy reads the draft, against the document
   *around* its quote, by a reader that took no part in the writing.
3. **Peggy never re-checks sentences.** The check happens before she reads. When she is happy with the
   draft, it is finished.
4. **Verified means shown in the same message.** Any chat in this process may call a statement verified
   only if that message contains either a document it has just fetched, with the words copied from it, or a
   ledger quote pasted in full. Its own earlier reading does not count: long chats lose the documents they
   opened, and a summary pasted by anyone is a pointer, not evidence.

## The steps

| # | Step | Who | Produces |
|---|---|---|---|
| 1 | Explore | any AI, free prose; Peggy decides | `boundary.json`: questions, document links, gaps |
| 2 | Gather | Claude Code | `cache/` (disposable text), `ledger.json` claims with quotes |
| 2b | Read what was gathered | Peggy, with a chat that answers only from the ledger | the section order: sections in sequence, each with its question and a word budget |
| 3 | Write | a fresh chat, memory off | article prose using only ledger facts; gaps named as gaps |
| 4 | Check the form | Claude Code, automatic | missing quotes and markers, fixed before step 5 |
| 5 | Check the facts, once | Claude Code (independent readers), **before Peggy reads** | a corrected draft + the list of what was corrected |
| 6 | Read and publish | Peggy | her reading of the corrected draft; nothing re-checked |

All commands take the form `npm run article:evidence -- <command> <name>`, where `<name>` is the job's
folder name, run from the project root. The `--` is npm's separator: everything after it goes to the script
instead of to npm. Peggy can type them in a terminal, or ask Claude Code ("start a job on the Ring of Fire
roads", "fetch the sources") and it runs them.

### 1. Explore

**Explore first; the job comes second.** A question you want researched is not yet an article, and nothing
here asks you to decide that it is. Read around the topic in any chat, as freely as you like: nothing is
created while you do, and a question that dies in exploration leaves nothing behind.

When the shape of the topic is clear, **decide the questions yourself**, then ask the chat to hand over the
boundary with this prompt, and leave that chat behind — never draft in it:

> Produce ONLY a JSON object with three lists and nothing else.
> `questions`: `{"id": "q1", "text": "…?"}` — one question per entry, ending in "?", no figures in it.
> `documents`: `{"id": "short-name", "url": "https://…", "answers": ["q1"]}` — the specific report, dataset,
> ruling or official page that would answer the question. A link you actually retrieved, never one
> constructed to look right. No description, no summary of what it says.
> `gaps`: `{"id": "g1", "question": "…?", "searched": []}` — questions nothing you found answers. List
> these deliberately: what nobody measures is often the most important finding.
> Do not state any fact anywhere in the object.

**Starting a job** means creating the one folder that will hold everything gathered on those questions. It
is not a chat: one command, named after the question.

```
npm run article:evidence -- init <name>
```

- `<name>` is lowercase with hyphens — the question's working name (`ring-of-fire-roads`). Every later
  command takes it; after `link` it is the article's slug.
- **No article is required.** The job carries `"article": null` until it becomes one. Nothing before step 4
  reads it, and the build gate skips an unbound job.
- `--article content/articles/<file>.yaml` binds it straight away if you already know, and a `<name>` that
  matches a row in `src/lib/articleRegistry.ts` binds itself. The YAML file need not exist yet.

It creates `content/docs/article-jobs/<name>/` with two empty files and prints the next commands.
`ledger.json` fills in step 2, and step 2's fetched sources land beside it in `cache/` (gitignored):
everything for this question stays in that one folder.

Save the boundary JSON in that folder as `boundary.json`, then `npm run article:evidence -- boundary <name>`.
It rejects any extra field, any non-question, any figure inside a question, and warns about a question with
neither a document nor a gap (so it is not silently dropped).

**If and when it becomes an article**, bind it — after the gathering, at the draft, whenever you know:

```
npm run article:evidence -- link <name> <article-slug>
```

That writes the article's YAML path into `ledger.json` and renames the folder to the article's slug, because
the build gate matches a job to its registry row **by folder name**: a job left under its working name is
never enforced, however finalised the article is. If the article has no registry row yet, name the file
instead: `link <name> content/articles/<file>.yaml --slug <article-slug>`.


**Scale at the boundary, not after drafting.** An article carries a small number of questions, and a
question that would need its own section of documents belongs to a companion article. The split is made in
`boundary.json`, before anything is gathered, not after a draft exists. (Ring of Fire, 2026-09-15: fifteen
questions and 229 gathered facts were aimed at one article of about 3,000 words.)

A **gap** crosses as a marked absence so the draft can say what nobody measures. Before the draft may
*assert* an absence ("no official source publishes…"), the gap's `searched` list must record where it was
looked for and when: `{"where": "https://… or the name of the place", "date": "YYYY-MM-DD"}`.

Each entry in `searched` names **one place and one date**. A blanket description of the corpus — "all
documents gathered for this article" — is not a search, and a gap without a conforming entry may not be used
to assert an absence. (Two absences in Ring of Fire draft 4, "no study validates…" and "no assessment
compared…", crossed on exactly that blanket wording and were stated in the draft; no document supports
either.) *Not implemented:* `boundary` does not yet reject a `searched` entry missing `where` or `date`.

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

`npm run article:evidence -- fetch <name>` downloads every document into `cache/` as text (PDFs
included) and lists the few it cannot reach (bot-blocked, login walls, JavaScript-only pages). **Only
those** need a manual download, saved as `manual/<id>.pdf` (or `.docx`/`.html`/`.txt`); fetch again. A
source with no public link at all (a submission someone sent you) goes in `ledger.json` `sources` with no
`url` and its file in `manual/`. `cache/` and `manual/` are gitignored and never deployed — the internet is
the archive, not a local folder.

`npm run article:evidence -- quotes <name>` then matches every quote against its document **before any
prose exists**, and records the result on each claim. At this stage a claim carries a short `fact` label
instead of a `sentence`; the checker ignores it until the article is written and the claim is attached to
a sentence. Anything short of an exact match is looked at by eye: page breaks with running headers, a
label and its value on separate lines, footnote markers — or a quote that is simply not in the document.

**A quote is whole.** It runs from the start of its sentence to the end of it, qualifiers included, and a
claim resting on more than one sentence carries them contiguously. A quote reassembled from table cells or
columns is marked as reassembled, with the reassembly recorded in `locator`, because it does not read as
continuous prose. (Ring of Fire quotes began mid-sentence or stopped before "unless", "preliminary", "where
appropriate", "within federal jurisdiction", "for vegetation and wetlands", and the writer used them as they
were given.) *Not implemented:* `quotes` checks only that a quote exists in the document; it should also
flag a quote that starts lowercase or mid-sentence, one that ends without terminal punctuation, and one
whose text is not contiguous in the cached file.

Claude Code then reads the cached text and records each usable fact in `ledger.json`:

```json
{ "id": "c1", "lang": "en", "sentence": "<exact words of the article sentence>",
  "source": "<document id>", "quote": "<verbatim, copied from the cached text>",
  "locator": "p. 14 / Table 3", "scope": "2023, federal only" }
```

`sentence` is filled in once the article text exists (step 3). A **ratio or computed figure** is a derived
claim with at least two quoted inputs:
`{ "id": "c9", "lang": "en", "sentence": "…", "derived": { "expr": "a / b * 100", "vars": { "a": { "value": 840, "from": "c7" }, "b": { "value": 768000, "from": "c8" } } } }`.

**The `fact` label is internal.** Only `id`, `source`, `locator`, `scope` and `quote` may leave the ledger.
Whatever is given to a writer or a reviewer carries those five fields and nothing else: no labels, no
summaries, no sentences from an earlier draft. (Thirteen of the fourteen errors in Ring of Fire draft 4 were
already in what had been handed over — in a short `fact` label, in a quote cut before its qualifier, or in a
silences section. The writer followed them faithfully.)

**`scope` is required** whenever the quote's document, project, road or community is not the article's
subject, and it is filled when the claim is recorded, not later. Where practical, the quote itself should
include the project name. (Remarks from Environment and Climate Change Canada on the Marten Falls road were
used as remarks on the Webequie road. Step 5 caught it, but only after a whole draft had been written on
it.)

### 2b. Read what was gathered

The chat answers from the ledger's quotes, or from a document it opens in that same message. It drafts
nothing and writes no prose for the article. Peggy questions what the quotes actually support, and decides
the order the reader needs. What crosses to step 3 is that order: the sections in sequence, each with its
question and a word budget. No conclusion crosses; a thesis given to a writer bends its use of the quotes.

Without this step an article has no order. (Ring of Fire: the writer received fifteen questions in four
weight tiers and 229 quotes, with no order and no instruction to leave anything out. It used 217 of the 229
facts, one fact per sentence, with six reasoning sentences in about 4,500 words — accurate in most places
and unreadable throughout. The order of an article comes from reading what was gathered, which no step
provided for.)

### 3. Write

In a **new chat with memory off, outside any project**, give the writer the section order from step 2b, the
questions, the gaps, the ledger's quotes in the form step 2 fixes (`id`, `source`, `locator`, `scope` and
`quote`, and nothing else) and the register spec (`content/docs/informative-register-spec.md`) — not the
exploration chat, not prior drafts, and **no style sample**: informative articles have no style, and an
imitated voice is what makes AI prose recognisable (Peggy's decision, 2026-09-15). The spec is self-reported by the
writer, so treat it like any other self-report: when the draft arrives, `npm run article:evidence --
register <draft.md>` counts the forbidden forms a pattern can see (em-dashes per thousand words, reframes,
"not just… but", rhetorical questions and question headings, intensifiers, stock openers, "in other
words", sentences opening with And/But, one-sentence paragraphs, colon punches) and lists three-item series
and a closing paragraph with no fact marker as candidates for a reader.

**The brief is built section by section, in the step 2b order.** Each section carries its question, its word
budget and its candidate quotes, followed by: "Use only the few facts that answer this section's question.
Most listed facts will stay unused; that is expected." From the second section on, the writer opens each
section with one sentence saying what it adds to the section before, marked as reasoning.

> Write the article from these quoted facts only. Every figure, count, date, first/only/record, "according
> to", and every statement that something does not exist must come from a quote below. If a sentence needs a
> fact that is not here, write [NEEDS SOURCE] in its place — never fill it in. Name each gap as an open
> question or as "not found in X and Y (searched <date>)" only when a search is recorded. Your own reasoning
> is welcome; keep it recognisable as reasoning.

French follows the site rule: Peggy reviews and finalises it; AI drafts are marked `FR-PLACEHOLDER`.
Claims are per language (`"lang": "fr"`, with the French sentence) because the French text is checked too.

### 4. Check the form

Claude Code attaches the draft's markers to the ledger, then `npm run article:evidence -- check <slug>`
compares the article with the ledger. This is mechanical and costs Peggy nothing:

| Tier | Sentence forms flagged | What satisfies it |
|---|---|---|
| **Blocks publication** | figures; counts (also in words: "eleven", "onze"); ratios and comparisons; direct quotations | a quoted claim whose quote carries every figure; a derived claim with ≥ 2 quoted inputs |
| **Must be acknowledged** | first / only / record / virtually / since YEAR; attributions ("according to", "X notes", "(Author, 2025)") | a quoted claim, or a note `{ "lang", "sentence", "kind": "reasoning" }` |
| | negative existence ("no official source…", "none", "never", "aucun…") | a quoted claim, or a note `{ "kind": "gap", "gap": "g1" }` whose gap records a search — **reasoning is not enough to show absence** |
| **Warning** | trend asserted ("increasingly", "growing", "de plus en plus") | read as a question: is the direction *shown* (two data points) or only asserted? |
| | temporal state ("still", "remains", "no longer", "demeure") | a note `{ "kind": "as-of", "asOf": "YYYY-MM-DD" }`; warns again after 30 days |

The check also fails on a quote not found in the fetched text. `check` online re-matches every quote and
records the result; `check --offline` uses the recorded matches. Its "no blocking issues" means the form is
right, **not** that the facts are true to their documents: that is step 5.

Calibration (Canada-Multipolar, 2026-09-14): a prototype flagged 24 of 91 English sentences and found, from
form alone, all four problems found by hand that day.

### 5. Check the facts — once, before Peggy reads

**Why it changed (Ring of Fire, 2026-09-16).** The earlier verifier was a fresh chat that saw only the
sentence and a short quote. Four rounds of it never converged: lengthening a quote voided its verdict, so
every fix created more checking. And it could not see context. After all those rounds, one reading of each
sentence against the document *around* its quote still found 14 errors in about 127 sentences, every quote
genuine and every one misread: remarks about the Marten Falls road's documents presented as about the
Webequie road; a conclusion about the communities near a mine placed "at" the mine; a total of aggregate,
fill and rock called an aggregate volume; an agreement with the Minister credited to the Agency; "may",
"preliminary", "unless" and "where appropriate" dropped; two "no study exists" statements that no cited
document makes. The chat-verifier commands (`verify-prompt`, `verdicts`) were removed from the script.

**How.** When the draft has passed step 4, Claude Code splits the sentences carrying fact markers into
batches of about 20 (sentence, its quotes, the source id and the path of the cached text) and gives each
batch to an independent reader (a subagent with no part in the writing), all batches in parallel. Nothing
is pasted by Peggy. Each reader gets this instruction:

> Your only job is to find FALSE or INVENTED information: things the article states that its source
> document does not say, says differently, or contradicts. You are not editing style, length or wording.
> For every sentence, read the quote, then open the source text and read the passage around it (about 30
> lines), so that you see who is speaking, which document and which project, road or community, the dates
> and the qualifiers. OK: a fair paraphrase. PROBLEM: an element not in the source; the wrong body, person,
> document, road or community; a number or date that differs; a hedged or conditional statement made certain
> ("may", "preliminary", "proposed", "unless", "where appropriate"); a scope made wider or narrower; a
> statement that something does not exist which the source does not make; a geographic error; a quote not
> found. Do not invent problems, and do not flag missing detail, style or length. Report only the problems,
> each with what is wrong, the source's own words (with page) and a minimal corrected sentence.

Claude Code applies the corrections to make the reading draft, and gives Peggy that draft plus the short
list of what was corrected and why (the source's words beside each). A correction that changes the
article's meaning, or where the reader's corrected sentence is itself doubtful, is listed as a question
for Peggy instead of applied.

**Once.** The corrected sentences are the readers' own minimal rewrites from the source's words; they are
not sent back for another round. Nothing else is re-checked.

### 6. Read and publish

Peggy reads the corrected draft like any reader. Edits she makes herself are hers and are not checked. If
she asks an AI to rewrite or add a sentence *carrying a fact*, that new sentence alone goes through step 5
(an invented "first since 2021" was written while fixing an invented "nine days"). When she is happy:
`npm run article:ready <slug>` and `npm run deploy` as usual.

**The build gate:** `prebuild` runs `article-evidence gate` (offline). It fails the build only for an
article that is `finalised` in the registry **and** has a ledger in `enforced` mode with blocking issues.
Articles without a ledger — everything published before this workflow — are untouched. A ledger can be set
to `"mode": "audit"` to report without gating.

## What this does not catch

- A fluent sentence with no figure and no flagged form ("repair capacity in the region is limited"). The
  boundary is what keeps such sentences from arriving; step 5 reads it only if it carries a fact marker.
- Causation, by pattern. Step 5's readers see it only where a sentence cites a quote.
- Whether the questions were the right ones. That stays Peggy's judgement.

## Files

- `scripts/article-evidence.cjs` — the commands; `scripts/lib/evidence.cjs` — quote matching, number
  parsing (EN/FR), sentence tiers.
- `content/docs/article-jobs/<name>/` — `boundary.json`, `ledger.json` (committed); `cache/`, `manual/`
  (gitignored, not deployed).

## To do — what this document requires and no script enforces

These rules hold by hand until the code catches up. The first two are marked *Not implemented* where they
appear above; keep both places in step.

- **A quote is whole** (step 2). `quotes` checks only that the quote exists in the document. To do: flag a
  quote that starts lowercase or mid-sentence, one that ends without terminal punctuation, and one whose
  text is not contiguous in the cached file — with `reassembled: true` on the claim as the opt-out for a
  quote rebuilt from table cells.
- **A search is a place and a date** (step 1). `boundary` accepts any `searched` entry, including a bare
  string. To do: reject an entry that is not an object with a `where` and a dated `date`. Boundary files
  carrying blanket wording will start failing — that is the point; fix them in the same change.
- **Only the five fields leave the ledger** (step 2), and **`scope` is filled at recording time** (step 2).
  No script can see what was pasted into a writer's brief, or know which project the article is about. To
  do, if this keeps slipping: a `brief` command that builds the handover from `ledger.json` — `id`,
  `source`, `locator`, `scope`, `quote` and nothing else — so the label cannot travel by accident.
