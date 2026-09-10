# TransHorizons — site film pipeline

Produces the site film as an MP4, in English and French, from one command. Playwright
drives the live site and captures frames; ffmpeg assembles, mixes narration and burns
captions. No video-editing application is involved. If a shot lands wrong, a number
changes in `shots.mjs` and the pipeline re-runs.

Everything runs against `https://transhorizons.net` by default (`--base` to change).
Nothing under `src/` is touched.

## The four commands

Run from the repository root (they delegate to `capture/`), or from `capture/` without
the `npm run … --` prefix.

| Command | What it does |
|---|---|
| `npm run capture -- --dry` | Walks the whole sequence, asserts every selector resolves, writes `capture/out/manifest.dry.json`, records nothing. ~1 minute. |
| `npm run capture` | Full frame capture: `capture/out/frames/<shot>/` + `capture/out/manifest.json`. ~5 minutes, ~2–3 GB of PNG. |
| `npm run capture -- --shot 25a` | Re-captures one shot (from the page state it needs) and splices it into the existing manifest. |
| `npm run build:film -- --lang fr` | Assembles, mixes, burns captions, exports `capture/out/transhorizons-film-full-fr.mp4`. Add `--cut short` for the 90-second version. |

Helpers: `npm run film:narration` prints the 44 narration files expected (also written to
`capture/narration/NARRATION-LIST.md`); `cd capture && npm run audio:units` lists where the
two report voices switch in each section recording.

Options: `--base <url>` (e.g. `http://localhost:4321` for a local build), `--headed`
(watch the browser), `--format jpeg` (smaller frames), `--from <id> --to <id>` (a range),
`--narration-dir <dir>`, and on the build side `--crf <n>`, `--no-captions`, `--plan`
(print the timeline and stop).

## What you need to do

1. **Generate the narration in Fish Audio** — 22 lines per language, 44 files, one file per
   shot, saved under `capture/narration/` with exactly the names in
   `capture/narration/NARRATION-LIST.md` (`shot01_en.wav`, `shot25a_fr.wav`, …; MP3 also
   accepted). The pipeline never generates voice and fails loudly if a file is missing.
2. **Run `npm run capture`.** If the narration files already exist, each shot is held at
   least as long as its line; otherwise the assembler freeze-extends the shot's last frame
   to fit the line (visible as a pause, never a cut-off sentence).
3. **Run `npm run build:film -- --lang en` and `-- --lang fr`**, then the same with
   `--cut short`. Four MP4s land in `capture/out/`.
4. Watch them. To change a duration, a keyword, an entry point or a line: edit
   `shots.mjs`, re-capture the affected shot with `--shot <id>`, rebuild.

To preview the picture before the narration exists: `capture/out/test-narration/` holds
44 short placeholder tones with the right names; build with
`--narration-dir out/test-narration` (from `capture/`). The films in `capture/out/`
named `PREVIEW-tones-*` were made that way.

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
the site's own **Listen to the report** button, seeks to `reportAudio.entrySeconds` on the
very element the page plays, and records the exact millisecond of the `playing` event; the
assembler mixes the site's MP3 (from `public/audio`) from that offset, at that time, fading
out when the narrator resumes, and pauses the page player at the same moment.

Default entry: Baseline at 30.5 s — Adam Stone finishes his first paragraph at ~32.9 s and
Ogechi takes over at 33.8 s, 3.3 s into the shot (measured: the Baseline switches at 33.8 s,
82.3 s and 128.9 s; the French duet's Baseline switches at 31.8 s, 79.9 s and 129.1 s, so the
same entry also works if the French film mixes the French recording). Nothing is done to
the voices.

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

- **"Listen to this section" does not start the studio recording** for any section other
  than the one already loaded (bug in `src/hooks/useNarrationSequence.ts`: the new
  section's `src` is set on an `Audio` created with `preload="none"`, so `loadedmetadata`
  never fires and the deferred `play()` never runs; it silently falls back to nothing).
  Shot 21 therefore starts from the Baseline bar with a seek. Once the hook calls
  `audio.load()` (or plays directly) after switching `src`, set `reportAudio.mode:
  'section'`, `section: 'situation'`, `entrySeconds: 0`: the Situation title and first
  thread name are Adam Stone, and Ogechi takes the first event at ~5.7 s — a switch inside
  the shot with no seek at all.
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
