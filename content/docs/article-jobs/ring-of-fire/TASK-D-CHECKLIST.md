# Ring of Fire — what to ask for at Task D

You do not need to remember any of this. Paste the relevant line at Claude Code and it will do it.

## What Task D is

The final fact check, after the review chat has approved every section. One pass, before you read the
result. You hand over: the approved text of each section, and the review chat's claim tables.

## The five things to ask for

1. **"Fetch anything the review chat opened that isn't in `cache/`."**

2. **"Run step 5 of `article-workflow.md`."** Independent readers compare every fact sentence against the
   passage *around* its quote, and report only problems, each with the source's words and a minimal fix.

3. **"Apply the corrections, and list separately any that change meaning."** Those are yours to decide.

4. **"Re-check any fact sentence an AI rewrote or added."** That is where new errors come from — the
   Multipolar "first since 2021" was invented while fixing something else.

5. **"Confirm all 14 known errors are corrected."** See `ring-of-fire-draft-4-known-errors.md`.
   No sentence inherited from draft 4 is guaranteed; only about 127 of 171 were ever checked.

## What to refuse

**More verification rounds.** One in-context pass, then you read it. If anyone — including me — offers
another round, the answer is no. The chat-verifier rounds never converged and missed all 14 context errors.
You never re-check sentences yourself.

## Traps already found — say "watch these"

- **c128, c129** — Environment and Climate Change Canada's remarks are about the **Marten Falls** road, not
  Webequie. This is known error 1. It will tempt again in section 7.
- **c187, c188** Inuvik–Tuktoyaktuk Highway · **c206** Musselwhite mine · **c209** NWT diamond mines.
  Analogues from the cost-of-living report. None of them is a Ring of Fire road or mine.
- **c214** is reassembled from separate columns of a table. It reads as continuous prose. It is not.
- **4,854,500 m³** is aggregate *and* fill *and* rock together. Aggregate alone is 3,297,000 m³ (see c248).
- The **Marten Falls road** had a decision statement dated 2026-08-31. Any sentence calling it merely
  proposed needs an as-of date.

## Three names with no evidence behind them

Draft 1 leans on these and **no claim in the ledger carries them**:

- **Nishnawbe Aski Nation** — the 77→28 day winter road season, and the route-by-route status reports
- **Kimesskanemenow** — the community-run James Bay Winter Road
- **Wildlands League** — the aerial photographs (figure note)

Either a document gets opened for each, or those sentences come out. Nothing else will catch this, because
a missing source is invisible in a draft — the sentence still reads fine.

Full picture: `candidates/name-coverage.md`.
