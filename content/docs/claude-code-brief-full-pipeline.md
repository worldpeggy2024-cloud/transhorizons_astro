# Brief for Claude Code — TransHorizons site film, end to end

Paste this into Claude Code in the `transhorizons_astro` workspace, with the production document (`TransHorizons-site-film-production.md`) alongside it.

---

## What you are building

A build pipeline that produces the finished site film as an MP4, in English and French, from a single command. Playwright drives the site and captures frames; ffmpeg assembles, mixes narration and burns captions.

No video-editing application is involved. There is no timeline to open. If a shot lands wrong, a number changes in a config file and the pipeline re-runs.

## The constraint that shapes everything

The person running this does not have time to learn OBS, DaVinci Resolve, or any other production tool. Every step must be code or configuration. If you find yourself about to recommend a graphical application, find the scripted equivalent instead, or report that the step cannot be automated and say what it would cost to do without it.

The one exception is Fish Audio, which they already use, and which produces the narration files as an input to this pipeline. You do not generate narration.

## Pipeline

**1. Capture.** Playwright, Chromium, viewport 1920 × 1080, `deviceScaleFactor: 1`. Capture a PNG frame sequence via a CDP screencast session (`Page.startScreencast`) rather than Playwright's built-in video recording — the built-in recorder gives VP8 at unguaranteed frame rate, and this film needs a consistent 30 or 60 frames per second that ffmpeg can assemble deterministically. Write a timing manifest as you go: shot id, start milliseconds, end milliseconds, relative to run start.

**2. Assemble.** ffmpeg builds the video track from the frame sequence at fixed frame rate.

**3. Narration.** Read the manifest, place each Fish Audio segment at its shot's start time, pad with silence between. 22 segments per language, one file per shot, named by shot id (`shot01_en.wav`, `shot25a_fr.wav`). Fail loudly if a named segment is missing rather than silently producing a gap.

**4. Captions.** Generate an ASS or SRT subtitle file from the same manifest plus the caption text held as data, then burn it in. Caption text lives in the same config file as the shot durations — never hard-coded in the ffmpeg call.

**5. Export.** MP4, H.264, 1080p, one file per language. Also produce the 90-second cut listed in the production document, from the same captured frames — it is a different subset of shots, not a second capture.

## Shot 21 — the report reading aloud

The film's central beat: narration stops and the country report reads a section aloud while the tracker moves. The report audio is MP3 files already in this repository — the same files the site plays. Mix them into the timeline directly. Do not capture system audio.

Three requirements specific to this shot.

**Frame lock.** This is the only shot where sound and picture must align exactly, because the lateral tracker moves in step with the audio. The manifest must record the precise millisecond playback began during capture, not merely the shot's start time. Everywhere else narration floats over independent visuals and a hundred milliseconds of drift is invisible.

**Voice switch inside the shot.** Country reports alternate between two voices. The entry point must be chosen so a switch between them falls inside the shot's six seconds — otherwise only one voice plays and the design stays invisible. Determine where the alternation boundaries fall and expose the entry point as a configuration value.

**No voice collision.** The narration is Peggy's own voice; the report voices are different ones. Do not substitute, harmonise or normalise them toward each other. The contrast is the point.

## Shot 29 — cropping

Crop to the Critical Minerals World Map card alone, because the surrounding grid is full of placeholders. Do this at capture time by scrolling and sizing so only that card is in frame, or by an ffmpeg crop filter applied to that shot's frames. Do not modify the page to hide the other cards.

## Configuration

One file — `capture/shots.ts` or equivalent — holding, per shot: id, duration in seconds, the navigation action, caption text in both languages, entry position where relevant, and whether narration plays. Everything tunable lives here. The pipeline code reads it; nobody edits the pipeline to change a duration.

## Modes

- `npm run capture -- --dry` — walk the sequence, assert every selector resolves, write a manifest, record nothing
- `npm run capture` — full frame capture
- `npm run capture -- --shot 25a` — re-capture one shot and splice it into the existing sequence
- `npm run build:film -- --lang fr` — assemble, mix, burn, export

## Technical requirements

- Derive selectors by reading `src/pages/`, `src/pages-react/` and the components. Prefer `getByRole` and visible text over CSS paths. Do not guess — read the source.
- Wait on real conditions (network idle, element visible, animation settled). Fixed waits only for holding a finished frame for its scripted duration.
- Smooth scrolling via an injected `requestAnimationFrame` loop with configurable pixels per frame. Never `mouse.wheel`.
- Run against `https://transhorizons.net`, with the base address configurable so the local build can be used while developing.

## Do not

- Modify anything under `src/`
- Hide, remove or restyle draft badges or placeholder cards — framing handles those
- Generate narration, or substitute a synthetic voice for the Fish Audio files
- Recommend a graphical tool as a step in the pipeline

## The other hard shots

**25a — globe rotation and click.** You built the globe. If it exposes any programmatic way to set rotation, use that rather than a simulated drag; it will be steadier and exactly repeatable. The click must land on the United States first time.

**18 — country filter.** Type a keyword that matches on content rather than a country name, character by character with a realistic delay, so the content search is what gets demonstrated.

**26 — return to reading position.** Follow the outbound link, use browser back, and assert the scroll position is restored before the shot ends. If it is not restored, report it — the shot's narration line depends on that behaviour.

## Deliverables

1. `capture/` with the pipeline, the config file, and a README covering the four commands
2. A dry-run manifest
3. A list of the 44 narration filenames expected, so they can be generated in one Fish Audio session
4. A note on any shot that could not be automated reliably, with the reason and what it would take

## Working method

Build the sequence in order, verifying each shot resolves before moving on. Where a selector is ambiguous, ask. Report anything on the site that behaves differently from what the production document assumes — that document was written from screenshots and fetched markup, not from the running application, so treat it as intent rather than ground truth.
