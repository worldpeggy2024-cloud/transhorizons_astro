# TransHorizons — site film pipeline

Produces the site film as an MP4, in English and French, from one command. Playwright
drives the live site and captures frames; ffmpeg assembles, mixes narration and burns
captions. No video-editing application is involved. If a shot lands wrong, a number
changes in `shots.mjs` and the pipeline re-runs.

Everything runs against `https://transhorizons.net` by default (`--base` to change).
Nothing under `src/` is touched.

## The commands

Run from the repository root (they delegate to `capture/`), or from `capture/` without
the `npm run … --` prefix.

| Command | What it does |
|---|---|
| `npm run narration:make` | Generates the 44 narration lines in Peggy's own cloned voices (see below). `-- --dry` lists them and sends nothing. |
| `npm run capture -- --dry` | Walks the whole sequence, asserts every selector resolves, writes `capture/out/manifest.dry.json`, records nothing. ~1 minute. |
| `npm run capture` | Full frame capture: `capture/out/frames/<shot>/` + `capture/out/manifest.json`. ~5 minutes, ~1.5 GB of PNG. |
| `npm run capture -- --shot 25a` | Re-captures one shot (from the page state it needs) and splices it into the existing manifest. |
| `npm run build:film -- --lang fr` | Assembles, mixes, burns captions, exports `capture/out/transhorizons-film-full-fr.mp4`. Add `--cut short` for the 90-second version. |

Helpers: `npm run film:narration` writes `capture/narration/NARRATION-LIST.md` (every
expected filename and its line); `cd capture && npm run audio:units` lists where the two
report voices switch in each section recording; `npm run viewport:compare` renders the
same article at two browser widths, for the framing decision.

Options: `--base <url>` (e.g. `http://localhost:4321` for a local build), `--headed`
(watch the browser), `--format jpeg` (smaller frames), `--from <id> --to <id>` (a range),
`--narration-dir <dir>`, and on the build side `--crf <n>`, `--no-captions`, `--plan`
(print the timeline and stop).

## The narration

Peggy's two cloned voices, the same ones the site's own recordings use, driven through the
same `scripts/fish_tts.py`:

| Language | Voice slug | Fish model |
|---|---|---|
| English | `peggy-thoughtful` | `048a6cbae79345a8a907899dec94ade5` |
| French | `peggy` | `db27d5fb158a484c9629c9f1b06531b7` |

`npm run narration:make` writes one MP3 per shot per language into `capture/narration/`,
skipping any that already exist. One file per shot, never one per movement: a cloned voice
drifts over a long passage, and a line that lands wrong has to be re-generatable alone.
The text lives in `shots.mjs`, so editing a line there and re-running is the whole edit
loop. All 44 lines together are about 2,300 characters, which is pennies.

**Listen before building.** The engine is stochastic and nothing here can judge a reading.
Two rows the production document flags: `shot08_en` is the longest sentence and most
likely to flatten (split it at the colon into two shots if it does), and `shot15_fr` needs
a beat before *routes arctiques*. To redo one line:

```
npm run narration:make -- --shot 8 --lang en --force
```

`capture/out/test-narration/` also holds 44 placeholder tones with the right names, for
previewing the picture alone: build with `--narration-dir out/test-narration`.

## What you need to do

1. **`npm run narration:make`**, then listen to the 44 files and re-roll any you dislike.
2. **`npm run capture`.** With the narration in place each shot is held at least as long as
   its line; without it the assembler freeze-extends the shot's last frame to fit (a pause,
   never a cut-off sentence).
3. **`npm run build:film -- --lang en`** and `-- --lang fr`, then both again with
   `--cut short`. Four MP4s land in `capture/out/`.
4. Watch them. To change a duration, a keyword, an entry point or a line: edit
   `shots.mjs`, re-capture the affected shot with `--shot <id>`, rebuild.

## What is in the box

- `shots.mjs` — the only file to edit: base address, fps, per-shot duration, action +
  parameters, narration/caption text (EN/FR), the shot-21 entry point, the 90-second cut.
- `src/capture.mjs` — runner (dry / full / single-shot), timing manifest, closing card.
- `src/actions.mjs` — one routine per shot, selectors read from the components.
- `src/screencast.mjs` — CDP screencast recorder (every compositor frame, timestamped).
- `src/build-film.mjs` — timeline → constant-frame-rate sequence → ASS captions →
  narration + report audio mix → H.264 MP4.
- `src/audio-units.mjs`, `src/narration-list.mjs`, `src/closing-card.html`, `src/lib.mjs`.

## How it works

**Capture.** Chromium (Playwright, *new* headless mode with the real GPU — the default
headless shell renders the globes through software at 3 fps), 1920×1080, scale factor 1.
A CDP screencast delivers every compositor frame with its timestamp; each shot also opens
with an explicit screenshot so it has a frame at t = 0 even if nothing changed. Waits are
on real conditions (element visible, URL, scroll settled, audio `playing` event); fixed
waits only hold a finished frame for its scripted duration. Scrolling is an injected
`requestAnimationFrame` loop at a configurable pixels-per-frame.

**Manifest.** `out/manifest.json`: per shot the real duration, every frame with its offset,
and events (the frame-locked audio timestamps, the keyword filter result, the restored
scroll position…). Global `startMs/endMs` are recomputed from the per-shot durations, which
is what makes a single-shot re-capture splice cleanly.

**Assemble.** The assembler resamples the timestamped frames to 30 fps by holding the
latest frame (hard links, no copies), pre-crops shot 28, writes an ASS caption file from
the config, places each narration file at its shot's start, mixes the report recording at
the millisecond playback began, and encodes once (`libx264`, `preset slow`, AAC 160k,
faststart). The 90-second cut is the same frames, the subset of shots listed in `shortCut`.

**Size.** The full film is ~2:22 of 1080p with long scrolls of small text: `crf 22` →
39 MB, `crf 27` → 26 MB, the default `crf 30` → 19.7 MB (text detail on a still frame is
the same at 27 and 30; the difference shows, if at all, during the scrolls). `--crf`
overrides per build; the short cut is ~7 MB.

## Shot 21 — the report reading aloud

The Canada report is a two-voice recording (Adam Stone / Ogechi) spliced per paragraph.
`npm run audio:units` lists, per section file, where the voice changes. The capture presses
the **section header's own speaker button** — the "section-header playback" the production
document asks for — seeks to `reportAudio.entrySeconds` on the very element the page plays,
and measures the wall-clock millisecond at which the playhead was audibly at that position.
The assembler mixes the site's MP3 (from `public/audio`) from that offset, at that time,
fading out when the narrator resumes, and the page player is paused at the same moment so
picture and sound agree.

The lock is measured rather than inferred from a media event: `playing` does not fire again
after a seek on an element that never stopped, and the sample reads the clock inside the
page, on the same clock the recorder stamps frames with.

Default entry: **Situation at 1.45 s**. That section's recording runs 0.0 s Adam Stone
"Situation.", 1.5 s Adam Stone "Trade rupture with the United States, ongoing", 5.75 s
Ogechi takes the first event. Entering at 1.45 s opens the shot on the thread name and puts
the handover 4.3 s later — in the captured take, 7.3 s into the shot, with 3.8 s of the
second voice after it. Entry `0` also works and keeps the spoken section title, at the cost
of the change landing later. Nothing is done to the voices.

Shot 21 is 11 s, not the document's 6: it has to scroll to the section, open it and start
the recording before the two voices can trade, and everything before the audio starts is
the scroll the document asks for.

`npm run audio:units` pairs the splice silences of each section MP3 with its text blocks
and replays the duet's alternation rule, printing the voice per block with the switches
marked. It is exact for Baseline and Situation; in the six headed sections the engine's own
long pauses outnumber the blocks, so it falls back to listing the pause times — confirm by
ear there, and remember a section regenerated with `--flip-from` swaps the voices from that
heading on.

For the French film, `reportAudio.frenchFilm` decides whether to mix the English duet the
page actually played (`'captured'`, exact frame lock) or the CAN French duet at the same
position (`'french'`). Undecided — it is your call; the default is `'captured'`.

## Site behaviour that differs from the production document

The document was written from screenshots; these are the places the running site differs.

- **A section's speaker button needs two presses** to start the studio recording (browser
  voices need one). In `src/hooks/useNarrationSequence.ts`, `playSection` on a section that
  is not the one loaded takes the `setIndex(next)` path and leaves the start to
  `resume.current`, which only runs from the `loadedmetadata` handler — and the element is
  created with `preload="none"`, so setting a new `src` fetches nothing and
  `loadedmetadata` never fires. The second press then takes the `next === index` branch and
  calls `play()` directly, which forces the load. Shot 21 presses, checks whether `play()`
  was actually called (`paused` flips synchronously, so this is decided in well under a
  second), and presses again only if it was not — so the shot keeps working unchanged once
  this is fixed, and never sends a second press that would pause a playing report. The
  manifest records a note when a second press was needed.
  A fix would be to call `audio.load()` after assigning `src` (or to drop
  `preload="none"` on the sequence element).
- **Shot 26 "follow a link out to a note"** — a report links to nothing internal except
  its own sections and sources. The shot uses the site's real return-to-position feature:
  click a citation marker, the Sources section opens and the "You were reading: … Back"
  toast appears; Back restores the exact scroll position (asserted to ±8 px, recorded in
  the manifest). Browser back after a real navigation would NOT restore it: the report is
  a client-only page that remounts with all sections collapsed.
- **Shot 15 "Sphere of Influence, one interaction"** — the embed is a static SVG page
  (`public/visualizations/canada-sphere-of-influence.html`); there is nothing to interact
  with. It is held, then the scroll passes the Arctic legend on the way to the chokepoint
  map toggle, which is real (two buttons, both clicked).
- **Shot 22 "collapse a section header"** — every section starts collapsed. The shot opens
  Territory, holds, then collapses it to reveal the ones beneath.
- **Shot 7 "back button returns to top of homepage"** — Chromium restores the About
  scroll position on back; the pipeline scrolls to the top and notes it in the manifest.
- **Shot 9 "the grid shows three cards"** — five cards plus two list items; three carry a
  Draft badge. Tight framing on the heading as the document asks; the click goes straight
  into Resource Civilization.
- **Shot 27** — congress.gov answers a fresh browser with a Cloudflare bot check, bls.gov
  opens a survey modal, PDFs render blank headless. Sources are tried in `preferHosts`
  order (census, Federal Reserve, BEA, GAO, EIA, CBO tested clean) and the first that
  opens plainly is used.
- **Shot 25a** — the header globe exposes no programmatic rotation, so it is a real mouse
  drag (44 px up over 1.6 s, brings the lower 48 to centre); the click point is found by
  hit-testing inside the United States path and lands first time.
- No mouse cursor is rendered in screencast frames (hover states are).

## Things that could not be automated, and what they would cost

None outright. Two are conditional: the section-button entry for shot 21 waits on the hook
fix above; and shot 27 depends on a third-party page rendering cleanly on the day, which
the probe-and-skip logic handles but cannot guarantee (pin a known-good URL via
`preferHosts` if one misbehaves).

## Requirements

Node 24, ffmpeg ≥ 7 on PATH (ffmpeg 9 is installed), Playwright 1.63 with Chromium
(`cd capture && npm install && npx playwright install chromium`). Output lives in
`capture/out/` (git- and Docker-ignored, as are the narration takes).
