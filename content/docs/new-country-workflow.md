# New Country Workflow — the two-phase pipeline (current)

Runbook for regenerating a country report from scratch. **This supersedes the old single-phase two-pass flow** (which referenced `risks` and produced EN-only content — both gone in the 2026-07 rework). If you are a fresh session picking this up, read this file, then `CLAUDE.md` (§ Country reports) — together they are the handoff.

---

## 0. Orientation

- **Two layers, separate contracts.** This pipeline produces the **present-state layer** (sourced, verifiable): `content/countries/<ISO3>/analysis.yaml`. The forward-looking **trajectory layer** is governed separately by `country-report-trajectory-template.md`; nothing forward-looking goes in the present-state file.
- **34 fields, six peers**, display order `territory · society · economy · political order · capacity to deliver · security & diplomacy`, then the dynamic tail `situation · actors`, then derivatives (`scorecard`, `baseline`) and `sources`. The Risk Register was removed 2026-07-20 and replaced by the gap register `capacity.knownAndUnbuilt`.
- **Migration is REGENERATION, not preservation.** Countries not yet two-phase are re-made from scratch; no single-phase content is kept.
- **Current state (2026-07-27):** **Canada and the USA are complete.** The other 11 countries are disposable single-phase content awaiting regeneration. The next country should be **maximally different** from CAN/USA (candidates: Senegal, Chile, Indonesia) to stress-test the template on branches two wealthy Western settler-federations never exercised. **France is not next but must keep rendering off its legacy fields** until it is redone; the legacy-scaffolding teardown rides along with France's regeneration.

## 1. Canonical documents (the sources of truth)

| Doc | What it governs |
|---|---|
| `country-report-present-state-template.md` | The 34-field spec, the ten enforced openers, the source schema (§11), Fact/Interpretation, time-binding (§12), and the full Pass A/B research prompt (§14). |
| `research-quality-bar.md` | The rejection criteria; overrides ambiguous behaviour in the template. |
| `actors-pass-template.md` | The actors extraction+draft prompt (**v1.10**; flat output schema). Stamped into the job folder by `init`. |
| `known-and-unbuilt-pass-template.md` | The gap-register contract (six-test gate). The register is composed by the **derivatives** pass, which cites this contract. |
| `since-dates-extension-template.md` | The targeted Pass A extension that dates gap-register items ({{GAPS}}/{{IDS}} placeholders). Run after derivatives. |
| `country-report-trajectory-template.md` | The separate forward-looking layer. |
| `CLAUDE.md` (§ Country reports) | The standing rules, decisions, and file conventions — loaded every session. |

## 2. The pass pipeline

Order (each derived pass reads the *finished* report before it):

```
Pass Zero (calibration lookup)          → pass-zero.calibration.json
Pass Zero-B (event scan, last 12 mo.)   → pass-zero-b.events.json
Pass A (sources only)                   → pass-a.sources.json
Pass B (prose from approved ids)        → pass-b.content.json   → apply → analysis.yaml
situation pass (verified event layer)   → install situation_en/fr (+ approved peerCorrections)
derivatives pass (scorecard+baseline+gap register) → install those three
actors pass (two-layer, closed-book)    → install actors_domestic/external_en/fr
since-dates extension (dates the gaps)  → sources + rewrite since values
```

**Standing tool split (decided 2026-07-19):** **Perplexity** runs the search-ON passes — Pass Zero, Zero-B, Pass A, and any targeted Pass A top-up / since-dates harvest. **Claude, in a VIRGIN branch with search OFF (closed-book),** runs Pass B and every derived pass (situation, derivatives, actors). "Virgin branch" is not optional: a branch that has discussed the country carries knowledge that isn't in the report, and the derived passes forbid importing anything outside the attached text. The pipeline stays tool-agnostic by design; this is the working default.

> **Closed-book now means MEMORY-OFF, not just search-off** (learned 2026-07-27, on the CAN baseline/scorecard recompose). Cross-conversation memory and project notes did not exist when "virgin branch" was written; they defeat it through a side door a clean attachment cannot block. On claude.ai, running a derived pass inside a project (or with memory on) makes it **recall prior-run notes** — old scorecard values, a previous baseline — and re-anchor to them, exactly the stale framing the empty input fields exist to strip. **Run every derived pass in a memory-off / temporary (incognito) session, outside any project that stores notes on the country.** If the transcript shows "Recalled N memories" or reads a project note, STOP and restart clean — the run is contaminated and cannot be audited for what leaked. When a recompose must beat anchoring, also hand it an input file with the fields being recomposed BLANKED (as Pass B emits them), not the populated finished file.

**Pass Zero is required for a genuinely new country.** (It was skipped for Canada only because Canada's calibration facts were trivially known.) For a dissimilar country the executive type, chamber structure, substrate instruments, cohesion barometer, religion-count reliability and territorial-control status are NOT known in advance, and the later passes must not infer them.

## 3. How to get each prompt

`init` is **calibration-aware**. Flow: `init → run Pass Zero → init again (now resolves the calibration branches with real values) → Pass A → Pass B → apply`.

```powershell
node scripts/deepsearch-country-workflow.cjs init <ISO3> <NameEN> <NameFR>
```

Writes to `content/docs/deepsearch-jobs/<ISO3>/`: `pass-zero.prompt.md`, `pass-zero-b.prompt.md`, `pass-a.prompt.md`, `pass-b.prompt.md`, `situation-pass.prompt.md`, `derivatives-pass.prompt.md`, `actors-pass.prompt.md` (stamped from `actors-pass-template.md`), plus the `*.template.json` schema references. The `since-dates` prompt is stamped by hand from `since-dates-extension-template.md` once the gap register exists.

## 4. Running it, step by step

1. **`init`**, then run **Pass Zero** (Perplexity, search on) → save `pass-zero.calibration.json`. Re-run `init` so the prompts resolve.
2. **Pass Zero-B** (Perplexity) → `pass-zero-b.events.json`.
3. **Pass A** (Perplexity) → `pass-a.sources.json`. Do NOT proceed to prose until the sources block validates.
4. **Pass B** (Claude, virgin branch, closed-book) → `pass-b.content.json`.
5. **Apply** (validates + writes the YAML; hard gate):
   ```powershell
   node scripts/deepsearch-country-workflow.cjs apply <ISO3> --sources <…pass-a.sources.json> --content <…pass-b.content.json> --date <YYYY-MM-DD>
   ```
   Pass B emits `situation`, `actors_*`, `capacity_knownAndUnbuilt_*`, `scorecard*` and `baseline_*` EMPTY — their dedicated passes fill them.
6. **situation pass** (Claude, virgin, closed-book; consumes `pass-zero-b.events.json`) → install `situation_en/fr` as JSON-in-text threads, set `situation_lastUpdated`, apply any approved peerCorrections.
7. **derivatives pass** (Claude, virgin, closed-book) → install `scorecard_*` values, `scorecard_anchors`, `baseline_en/fr`, and the gap register `capacity_knownAndUnbuilt_en/fr`.
8. **actors pass** (Claude, virgin, closed-book) → install `actors_domestic/external_en/fr` (flat schema).
9. **since-dates extension** (Perplexity) → date the `report-silent` gap items.
10. **Wire the page** (once, if new): `src/data/<name>-yaml.ts` + the import in `CountryPage.tsx`. **Expose it** by adding the ISO3 to `SEO_READY_COUNTRIES` in `src/lib/analysedCountries.ts` only after Peggy proofs it. Add the country's YAML import to `src/lib/countryKeywords.ts` when it lands.

## 5. Claude Code's role & operating rules

Peggy composes/curates prose with a Chat-Claude branch off the templates; **Claude Code's job is the SOURCES side + mechanical work + installing pass outputs**: apply source batches, install the situation/derivatives/actors JSON, run the validators, FR typography, and build; restore mojibake in pasted FR; resolve ledger conditionals against the live file; report count/orphan/parity findings. Do **not** offer to generate prompts or draft prose unless asked.

- **Never edit Keystatic prose while writing to the sources block** — lock conflict. After any YAML write, remind Peggy to **F5 the Keystatic item before her next save** (a stale-session save silently reverts script-added content — this has bitten repeatedly).
- **`analysis.yaml` is one flat file**; keys are `<section>_<subsection>_<en|fr>`. `actors`/`sources`/`situation`/`capacity_knownAndUnbuilt`/`scorecard_anchors` are JSON-in-text blocks — keep them so.
- **Keystatic silently strips undeclared YAML keys, and drops empty declared fields on save.** Declare a field in `keystatic.config.ts` before writing it; a field that must persist must be non-empty.
- **Checks after every change:** `node scripts/validate-country-citations.cjs` (0 errors on the country), `node scripts/fix-fr-typography.cjs <file> --write`, `npm run build`. `tsc --noEmit` for renderer edits (`astro check` hangs). Write helper scripts to files — bash-quoted `node -e` regexes mangle backslashes.
- **Deploy target** is `transhorizons-astro.fly.dev`; `.net` is on hold. Name the Fly app after deploying. Never touch `[...slug].astro` or switch `AppShell` off `client:only`.

## 6. Rules that bite (learnings baked into the templates — do not relearn them the hard way)

- **Source `desc` = what the source IS (20–30 words), never its data.** Diagnostic: if a fact in the desc could be silently edited while the citing prose stayed put, it's a claim and belongs in prose. (§11.) This recurs whenever a composer reads the section specs but not §11.
- **Time-bind every numeric; bind every asserted gap to a duration** (§12). Gaps whose duration the sources don't carry are `report-silent` and go to `undatedGaps` — then the since-dates extension.
- **Gap register — six-test gate**, and Test 6: it carries shortfalls against **requirements the country set for itself** (domestic law/targets/strategies/audits, ratified treaties/conventions/NDCs, constitutional/statutory guarantees) — **never external comparisons** (an OECD/G7 average, a better-performing peer). This is what makes it work for low-accountability states (they still have treaties and a constitution); where even that is thin, the documentation-base opener says so and the thinness is the finding.
- **Actors: flat output schema** (v1.10) — `name, kind, liveActorStatus, currentPosition, fieldsCitedIn, interests, resources, constraints, likelyMoves, engagementMode, anchors` at one level (v1.9's nested `layer2Draft` shape does not render). A `[source-id]` in a field is **not** a prose mention (filter g). Trade agreements are instruments, standing organisations/commands are actors (filter f). Right-size the list — aggregate hard.
- **Anchors** use `[dot.path]` (field) or `[source-id]`; the bare `situation` is the one dotless field anchor. Ghost anchors (empty/missing target) are hard errors. Derived layers may not anchor to other derived layers (actors, scorecard, baseline, inheritedTerrain, posture) or to legacy fields.
- **Bilingual sources: prefer the landing-page URL** over a single-language deep-link PDF so the reader reaches their language; mark `landingPage: true`. Don't swap a landing-page source for a PDF.
- **FR literal tokens:** in French outputs keep the scorecard values (High/Med/Low), the register `class` values, and the `report-silent` sentinel in English — validators match them literally.
- **EN/FR parity** (paragraph counts, citation ids, anchor sets) is partly validator-checked and partly manual; a save that drops an FR paragraph is caught by the PARITY warning.
- **Pass Zero calibration** is authoritative; passes cite only real instrument ids, never a literal `[calibration]` marker.
- **Search-facing prompts must be SELF-CONTAINED** (Perplexity: Pass Zero, Zero-B, A, and the since-dates extension). Describe the task and the required output only — never the downstream pipeline (which pass consumes the result, how it is installed, or internal field/register names like "the gap register" or `capacity.knownAndUnbuilt` that the search tool has never seen). "No project context is assumed; everything you need is in this prompt." Any operator-only note living in the same file must be clearly fenced (`> Operator note — NOT part of the prompt…`) so the search tool is told to ignore it. (The since-dates template leaked pipeline framing once — caught 2026-07-27 — and is the worked example of the fix.)

## 7. Validators & gates

- **Standalone audit:** `scripts/validate-country-citations.cjs` — FAILS on orphan citations, homepage URLs, missing source fields, duplicate ids, unparseable JSON-in-text; WARNS on orphan sources, missing openers, undated/untranslated/time-unbound entries, desc > 50 words, EN/FR paragraph parity.
- **Apply gate** (inside `apply`) — additionally HARD-ERRORS on a missing enforced opener, a narrative field with no citation, ghost anchors, and malformed actors/scorecard. Regeneration at the gate is cheap; a missed opener reaching the YAML costs a manual retrofit.
- **Research quality bar** — validation is necessary, not sufficient; content passing the validators can still be rejected against `research-quality-bar.md`.

## 8. Open follow-ups (as of 2026-07-27)

- Canada: since-dates harvest owed (21/24 gap items `report-silent`); `publicationDate` backlog (~15 sources); FR review pile (baseline_fr, gap-register FR items, scorecard rationale_fr, source descFr, actors FR); add CAN to `SEO_READY_COUNTRIES` after proofing.
- Post-migration teardown (when France is done): un-declare `capacity_permitting_*` and `economy_macroReality_*`, strip the legacy keys from the disposable files, drop the legacy-fallback reads (all tagged `TODO(post-migration)`).
