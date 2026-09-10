/*
 * Assemble the film from the captured frames + manifest.
 *
 *   node src/build-film.mjs --lang en            full film, English
 *   node src/build-film.mjs --lang fr --cut short 90-second cut, French
 *   options: --out <file.mp4>  --crf <n>  --no-captions  --narration-dir <dir>  --plan (print the timeline and stop)
 *
 * Steps: timeline from the manifest (+ freeze-extension where a narration
 * line outruns its shot) → constant-frame-rate image sequence (hard links) →
 * ASS captions from the config → narration segments placed at shot starts +
 * the report recording at the frame-locked timestamp → one ffmpeg pass to
 * H.264/AAC MP4. Nothing here is hand-timed: change shots.mjs or re-capture a
 * shot and rebuild.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { config } from '../shots.mjs';
import { findNarrationFile, narrationFileBase, probeSeconds, requireTool } from './lib.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const outDir = path.join(root, 'out');
const framesDir = path.join(outDir, 'frames');
const narrationDir = path.resolve(root, (() => { const i = process.argv.indexOf('--narration-dir'); return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : 'narration'; })());

const argv = process.argv.slice(2);
const flag = (n) => argv.includes(`--${n}`);
const opt = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : d; };
const lang = opt('lang', 'en') === 'fr' ? 'fr' : 'en';
const cut = opt('cut', 'full') === 'short' ? 'short' : 'full';
const crf = Number(opt('crf', config.video.crf));
const captionsOn = !flag('no-captions');
const planOnly = flag('plan');
const outFile = path.resolve(opt('out', path.join(outDir, `transhorizons-film-${cut}-${lang}.mp4`)));

const log = (...a) => console.log(...a);
const fmt = (ms) => `${Math.floor(ms / 60000)}:${String(Math.floor((ms % 60000) / 1000)).padStart(2, '0')}.${String(Math.round(ms % 1000)).padStart(3, '0')}`;

function main() {
  log(`ffmpeg: ${requireTool('ffmpeg')}`);
  requireTool('ffprobe');
  const manifestPath = path.join(outDir, 'manifest.json');
  if (!fs.existsSync(manifestPath)) throw new Error('out/manifest.json not found — run `npm run capture` first.');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (manifest.dry) throw new Error('manifest.json is from a dry run — nothing to assemble.');
  const fps = manifest.fps || config.fps;
  const byId = new Map(manifest.shots.map((s) => [s.id, s]));
  const cfgById = new Map(config.shots.map((s) => [s.id, s]));

  // ── which shots, in which order ────────────────────────────────────────
  const ids = cut === 'short' ? config.shortCut : [...manifest.shots.map((s) => s.id), 'closing'];
  for (const id of ids) if (id !== 'closing' && !byId.has(id)) throw new Error(`cut "${cut}" needs shot ${id}, which is not in the manifest (re-capture it: npm run capture -- --shot ${id})`);

  // ── narration files (fail loudly, all at once) ─────────────────────────
  const missing = [];
  const narr = new Map(); // id -> { file, seconds }
  for (const id of ids) {
    const c = cfgById.get(id);
    if (!c || !c.narration || !c.narration[lang]) continue;
    const base = narrationFileBase(id, lang);
    const file = findNarrationFile(narrationDir, base);
    if (!file) { missing.push(`${base}.wav`); continue; }
    const seconds = probeSeconds(file);
    if (!seconds) { missing.push(`${base} (unreadable)`); continue; }
    narr.set(id, { file, seconds });
  }
  if (missing.length && !planOnly) {
    throw new Error(`Missing narration for ${lang} (${missing.length}):\n  ${missing.join('\n  ')}\nGenerate them in Fish Audio and save under capture/narration/ — see narration/NARRATION-LIST.md (npm run narration:list).`);
  }

  // ── timeline ───────────────────────────────────────────────────────────
  const timeline = [];
  let t = 0;
  for (const id of ids) {
    if (id === 'closing') {
      timeline.push({ id, startMs: t, durMs: config.closing.seconds * 1000, extendMs: 0, closing: true });
      t += config.closing.seconds * 1000;
      continue;
    }
    const s = byId.get(id);
    let durMs = s.durationMs;
    let extendMs = 0;
    const n = narr.get(id);
    if (n) {
      const need = Math.round(n.seconds * 1000) + 300;
      if (need > durMs) { extendMs = need - durMs; durMs = need; }
    }
    timeline.push({ id, startMs: t, durMs, extendMs, shot: s, cfg: cfgById.get(id), narration: n });
    t += durMs;
  }
  const totalMs = t;

  log(`\n${cut} cut · ${lang} · ${fmt(totalMs)} · ${timeline.length} shots`);
  log(' id     start      dur    +hold  narration');
  for (const e of timeline) log(` ${e.id.padEnd(6)} ${fmt(e.startMs)}  ${(e.durMs / 1000).toFixed(2).padStart(6)}s ${e.extendMs ? `+${(e.extendMs / 1000).toFixed(2)}s` : '      '}  ${e.narration ? `${path.basename(e.narration.file)} (${e.narration.seconds.toFixed(2)}s)` : ''}`);
  if (planOnly) return;

  // ── build dir ──────────────────────────────────────────────────────────
  const buildDir = path.join(outDir, 'build', `${cut}-${lang}`);
  fs.rmSync(buildDir, { recursive: true, force: true });
  fs.mkdirSync(path.join(buildDir, 'seq'), { recursive: true });

  // ── crop pre-pass (shots captured in a different viewport) ─────────────
  const croppedDir = path.join(outDir, 'build', 'cropped');
  for (const e of timeline) {
    if (!e.shot || !e.shot.crop) continue;
    const c = e.shot.crop;
    const dir = path.join(croppedDir, e.id);
    fs.mkdirSync(dir, { recursive: true });
    const W = manifest.viewport.width, H = manifest.viewport.height;
    const vf = `crop=${c.w}:${c.h}:${c.x}:${c.y},scale=w=${W}:h=${H}:force_original_aspect_ratio=decrease:flags=lanczos,pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2:color=${c.background || 'black'}`;
    let done = 0;
    for (const f of e.shot.frames) {
      const src = path.join(framesDir, e.id, f.file);
      const dim = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', src], { encoding: 'utf8' }).stdout.trim().split(',').map(Number);
      if (dim[0] < c.x + c.w || dim[1] < c.y + c.h) throw new Error(`shot ${e.id}: frame ${f.file} is ${dim[0]}x${dim[1]} but the crop needs ${c.x + c.w}x${c.y + c.h} — the frame was not captured at deviceScaleFactor ${c.deviceScaleFactor}; re-capture: npm run capture -- --shot ${e.id}`);
      const dst = path.join(dir, f.file.replace(/\.jpg$/, '.png'));
      if (fs.existsSync(dst) && fs.statSync(dst).mtimeMs >= fs.statSync(src).mtimeMs) continue;
      const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', src, '-vf', vf, dst]);
      if (r.status !== 0) throw new Error(`crop failed for ${src}: ${r.stderr}`);
      done++;
    }
    log(`crop pre-pass shot ${e.id}: ${e.shot.frames.length} frames (${done} rendered)`);
    e.frameDir = dir; e.frameExt = '.png';
  }

  // ── constant-frame-rate sequence via hard links ───────────────────────
  const ext = manifest.frameFormat === 'jpeg' ? '.jpg' : '.png';
  const total = Math.round(totalMs / 1000 * fps);
  const seqDir = path.join(buildDir, 'seq');
  let linked = 0, copied = 0;
  let cursor = 0; // timeline index
  let lastFile = null;
  const seqExt = timeline.some((e) => e.frameDir) && ext !== '.png' ? null : ext; // mixed formats → use per-frame ext via symlink name? keep simple:
  for (let i = 0; i < total; i++) {
    const tMs = (i / fps) * 1000;
    while (cursor < timeline.length - 1 && tMs >= timeline[cursor + 1].startMs) cursor++;
    const e = timeline[cursor];
    let src;
    if (e.closing) {
      src = path.join(framesDir, 'closing', `${lang}.png`);
    } else {
      const rel = tMs - e.startMs;
      const frames = e.shot.frames;
      // last frame with tMs <= rel (binary search); before the first → first.
      let lo = 0, hi = frames.length - 1, k = 0;
      while (lo <= hi) { const mid = (lo + hi) >> 1; if (frames[mid].tMs <= rel) { k = mid; lo = mid + 1; } else hi = mid - 1; }
      const f = frames[k];
      src = e.frameDir ? path.join(e.frameDir, f.file.replace(/\.jpg$/, '.png')) : path.join(framesDir, e.id, f.file);
    }
    const dstExt = path.extname(src);
    const dst = path.join(seqDir, `${String(i).padStart(6, '0')}${dstExt}`);
    try { fs.linkSync(src, dst); linked++; } catch { fs.copyFileSync(src, dst); copied++; }
    lastFile = dst;
  }
  // ffmpeg's image demuxer needs ONE extension; if a mix slipped in, convert.
  const exts = new Set(fs.readdirSync(seqDir).map((f) => path.extname(f)));
  if (exts.size > 1) throw new Error(`mixed frame formats in the sequence (${[...exts].join(', ')}) — capture everything in one --format`);
  const seqExtFinal = [...exts][0];
  log(`sequence: ${total} frames at ${fps} fps (${linked} linked, ${copied} copied)`);

  // ── captions (ASS) ─────────────────────────────────────────────────────
  const assPath = path.join(buildDir, `captions-${lang}.ass`);
  if (captionsOn) {
    const cap = config.captions;
    const alpha = (cap.boxAlpha ?? 0x70).toString(16).padStart(2, '0').toUpperCase();
    const ass = [];
    ass.push('[Script Info]', 'ScriptType: v4.00+', 'PlayResX: 1920', 'PlayResY: 1080', 'WrapStyle: 0', 'ScaledBorderAndShadow: yes', '');
    ass.push('[V4+ Styles]');
    ass.push('Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding');
    ass.push(`Style: Cap,${cap.font},${cap.size},&H00FFFFFF,&H00FFFFFF,&H${alpha}000000,&H${alpha}000000,0,0,0,0,100,100,0,0,3,14,0,2,220,220,${cap.marginV},1`);
    ass.push('', '[Events]', 'Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text');
    const assTime = (ms) => { const cs = Math.round(ms / 10); const h = Math.floor(cs / 360000), m = Math.floor((cs % 360000) / 6000), s = Math.floor((cs % 6000) / 100), c = cs % 100; return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(c).padStart(2, '0')}`; };
    for (const e of timeline) {
      const text = e.closing ? null : (e.cfg?.caption?.[lang] ?? e.cfg?.narration?.[lang]);
      if (!text) continue;
      const end = Math.min(e.startMs + e.durMs, totalMs) - 40;
      ass.push(`Dialogue: 0,${assTime(e.startMs)},${assTime(end)},Cap,,0,0,0,,${text.replace(/\r?\n/g, '\\N')}`);
    }
    fs.writeFileSync(assPath, ass.join('\n') + '\n', 'utf8');
  }

  // ── audio graph ────────────────────────────────────────────────────────
  const inputs = ['-framerate', String(fps), '-i', `seq/%06d${seqExtFinal}`];
  const filters = [];
  const mixIn = [];
  const totalS = (totalMs / 1000).toFixed(3);
  filters.push(`anullsrc=r=48000:cl=stereo:d=${totalS}[base]`);
  mixIn.push('[base]');
  let n = 1;
  for (const e of timeline) {
    if (!e.narration) continue;
    inputs.push('-i', e.narration.file);
    const d = Math.round(e.startMs);
    filters.push(`[${n}:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,volume=${config.audio.narrationGain},adelay=${d}|${d}[n${n}]`);
    mixIn.push(`[n${n}]`);
    n++;
  }
  // Shot 21: the report's own recording, from the frame-locked timestamp.
  const s21 = timeline.find((e) => e.cfg?.reportAudio);
  if (s21) {
    const ev = (s21.shot.events || []).find((x) => x.name === 'reportAudio.playing');
    if (!ev) throw new Error('shot 21 has no reportAudio.playing event in the manifest — re-capture it: npm run capture -- --shot 21');
    let rel = ev.src.replace(/^https?:\/\/[^/]+/, '').replace(/^\/audio\//, '');
    if (lang === 'fr' && config.reportAudio.frenchFilm === 'french') {
      rel = `${config.reportAudio.frenchVoiceFolder}/${rel.split('/').pop()}`;
    }
    const file = path.resolve(root, config.reportAudio.localAudioRoot, rel);
    if (!fs.existsSync(file)) throw new Error(`report recording not found locally: ${file} (public/audio is staged by scripts/stage-audio.cjs)`);
    const lockMs = s21.startMs + ev.tMs;
    const endMs = s21.startMs + s21.durMs;
    const segS = Math.max(0.5, (endMs - lockMs) / 1000);
    const fade = Math.min(config.reportAudio.fadeOutSeconds, segS / 2);
    inputs.push('-ss', ev.currentTime.toFixed(3), '-t', segS.toFixed(3), '-i', file);
    filters.push(`[${n}:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,volume=${config.audio.reportGain},afade=t=out:st=${(segS - fade).toFixed(3)}:d=${fade.toFixed(3)},adelay=${Math.round(lockMs)}|${Math.round(lockMs)}[rep]`);
    mixIn.push('[rep]');
    log(`report audio: ${path.basename(file)} from ${ev.currentTime.toFixed(2)}s, placed at ${fmt(lockMs)} for ${segS.toFixed(2)}s (fade ${fade}s)${lang === 'fr' ? ` [frenchFilm=${config.reportAudio.frenchFilm}]` : ''}`);
    n++;
  }
  filters.push(`${mixIn.join('')}amix=inputs=${mixIn.length}:duration=first:normalize=0[a]`);
  filters.push(captionsOn ? `[0:v]format=yuv420p,ass=${path.basename(assPath)}[v]` : `[0:v]format=yuv420p[v]`);
  const scriptPath = path.join(buildDir, 'filters.txt');
  fs.writeFileSync(scriptPath, filters.join(';\n') + '\n');

  const args = ['-y', '-hide_banner', '-loglevel', 'warning', '-stats',
    ...inputs,
    // ffmpeg ≥ 7 reads an option's value from a file with the -/ prefix
    // (-filter_complex_script was removed in ffmpeg 8).
    `-/filter_complex`, path.basename(scriptPath),
    '-map', '[v]', '-map', '[a]',
    '-c:v', 'libx264', '-preset', config.video.preset, '-crf', String(crf), '-pix_fmt', 'yuv420p', '-r', String(fps),
    '-c:a', 'aac', '-b:a', config.audio.bitrate, '-ar', '48000',
    '-movflags', '+faststart', '-shortest', outFile];
  log(`\nffmpeg → ${outFile}`);
  const r = spawnSync('ffmpeg', args, { cwd: buildDir, stdio: 'inherit' });
  if (r.status !== 0) throw new Error(`ffmpeg exited with ${r.status}`);
  const mb = fs.statSync(outFile).size / 1e6;
  log(`\ndone: ${outFile} — ${mb.toFixed(1)} MB, ${fmt(totalMs)}${mb > config.video.targetMaxMB ? ` (over the ${config.video.targetMaxMB} MB target: rebuild with --crf ${crf + 2})` : ''}`);
}

try { main(); } catch (e) { console.error(`\n${e.message}`); process.exit(1); }
