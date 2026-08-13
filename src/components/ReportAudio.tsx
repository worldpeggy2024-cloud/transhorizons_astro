/*
 * ReportAudio — country-report narration controls (Web Speech, step 1).
 *  - SectionAudioButton: play/pause toggle in a section header.
 *  - ReportAudioBar: the Baseline-area trigger — "Listen to the report" (start) /
 *    "Reading…" (stop) plus a per-language voice picker. Stays a simple button.
 *  - FloatingReportPlayer: a fixed pill that appears while anything is sounding —
 *    play/pause, a seekable progress bar, elapsed/total time, restart, stop — so the
 *    transport is reachable from any section, not just the top.
 * All three drive the shared useReportSpeech queue.
 */

import { useEffect, useRef, useState } from 'react';
import { Volume2, Play, Pause, Square, Rewind, FastForward, Headphones, ChevronDown } from 'lucide-react';
import { SPEEDS } from '../hooks/useReportSpeech';
import type { ReportSpeech, SpeechSection } from '../hooks/useReportSpeech';

const CHARS_PER_SEC = 14; // rough spoken rate for the time estimate
const fmt = (s: number) => {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60);
  return `${m}:${ss.toString().padStart(2, '0')}`;
};

export function SectionAudioButton({ speech, section, lang }: {
  speech: ReportSpeech;
  section: SpeechSection;
  lang: string;
}) {
  if (!speech.supported || !section.text.trim()) return null;
  const active = speech.activeId === section.id;
  const playing = active && speech.status === 'playing';
  const paused = active && speech.status === 'paused';
  const fr = lang.toLowerCase().startsWith('fr');
  const label = playing
    ? (fr ? 'Mettre en pause' : 'Pause')
    : paused
      ? (fr ? 'Reprendre' : 'Resume')
      : (fr ? 'Écouter cette section' : 'Listen to this section');
  return (
    <button
      onClick={(e) => { e.stopPropagation(); speech.play(section, lang); }}
      className={`p-1 rounded transition-colors ${active ? 'text-[var(--cr-accent)]' : 'text-[var(--cr-faint)] hover:text-[var(--cr-accent)]'}`}
      title={label}
      aria-label={label}
    >
      {playing ? <Pause size={14} /> : paused ? <Play size={14} /> : <Volume2 size={14} />}
    </button>
  );
}

export function ReportAudioBar({ speech, sections, lang }: {
  speech: ReportSpeech;
  sections: SpeechSection[];
  lang: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  if (!speech.supported) return null;
  const fr = lang.toLowerCase().startsWith('fr');
  const voices = speech.voicesForLang(lang);
  const selected = speech.selectedVoiceName(lang);
  // "Reading" whenever the continuous (all-section) read is what's active.
  const readingAll = speech.mode === 'all' && speech.status !== 'idle';

  return (
    <div className="relative flex items-center gap-1" ref={ref}>
      <button
        onClick={() => (readingAll ? speech.stop() : speech.playAll(sections, lang))}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border font-body text-xs transition-colors ${
          readingAll
            ? 'border-[var(--cr-accent)] text-[var(--cr-accent)]'
            : 'border-[var(--cr-border)] text-[var(--cr-muted)] hover:text-[var(--cr-accent)] hover:border-[var(--cr-accent)]'
        }`}
        title={readingAll ? (fr ? 'Arrêter la lecture' : 'Stop reading') : (fr ? 'Écouter tout le rapport' : 'Listen to the whole report')}
      >
        {readingAll ? <Square size={12} /> : <Headphones size={12} />}
        <span className="whitespace-nowrap">
          {readingAll ? (fr ? 'Lecture en cours' : 'Reading…') : (fr ? 'Écouter le rapport' : 'Listen to the report')}
        </span>
      </button>

      {voices.length > 0 && (
        <button
          onClick={() => setOpen((v) => !v)}
          className="p-1 text-[var(--cr-faint)] hover:text-[var(--cr-accent)] transition-colors"
          title={fr ? 'Choisir la voix' : 'Choose voice'}
          aria-label={fr ? 'Choisir la voix' : 'Choose voice'}
        >
          <ChevronDown size={12} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>
      )}

      {open && voices.length > 0 && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-[var(--cr-bg)] border border-[var(--cr-border)] shadow-lg z-50 rounded" onClick={(e) => e.stopPropagation()}>
          <div className="px-3 py-2 border-b border-[var(--cr-divider)] text-[9px] tracking-[0.2em] uppercase text-[var(--cr-muted)] font-body">
            {fr ? 'Voix · français' : 'Voice · English'}
          </div>
          <ul className="max-h-52 overflow-y-auto">
            {voices.map((v) => (
              <li key={v.name}>
                <button
                  onClick={() => { speech.selectVoice(lang, v.name); setOpen(false); }}
                  className={`w-full text-left px-3 py-2 font-body text-[11px] leading-snug transition-colors ${
                    selected === v.name ? 'text-[var(--cr-accent)] font-medium' : 'text-[var(--cr-body)] hover:bg-[var(--cr-hover)]'
                  }`}
                >
                  <span className="block truncate">{v.name}</span>
                  <span className="block text-[9px] text-[var(--cr-faint)]">{v.lang}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/** Fixed transport pill — visible only while something is sounding, reachable from
 * any section. Drives the same queue as the section buttons and the baseline bar. */
export function FloatingReportPlayer({ speech, lang, sectionName }: {
  speech: ReportSpeech;
  lang: string;
  /** Human label of the section currently sounding, if any. */
  sectionName?: string;
}) {
  if (!speech.supported || speech.status === 'idle') return null;
  const fr = lang.toLowerCase().startsWith('fr');
  // Speed shortens the clock: at 1.5x the same text takes two thirds the time.
  const totalDur = speech.totalChars / (CHARS_PER_SEC * speech.rate);
  const elapsed = speech.progress * totalDur;
  // 10 seconds as a fraction of the whole narration, for the skip buttons.
  const step = (10 * CHARS_PER_SEC * speech.rate) / (speech.totalChars || 1);

  const nextSpeed = () => {
    const i = SPEEDS.indexOf(speech.rate as typeof SPEEDS[number]);
    speech.setRate(SPEEDS[(i + 1) % SPEEDS.length] ?? 1);
  };
  // "1x" reads better than "1×" at 10px; drop the trailing .0 on whole speeds.
  const speedLabel = `${speech.rate}`.replace(/\.0$/, '') + '×';

  const onSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    speech.seek((e.clientX - rect.left) / rect.width);
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[min(94vw,560px)] flex items-center gap-3 px-4 py-2.5 rounded-full border border-[var(--cr-border)] bg-[var(--cr-bg)] shadow-lg">
      <button
        onClick={() => (speech.status === 'playing' ? speech.pause() : speech.resume())}
        className="p-1 flex-shrink-0 text-[var(--cr-accent)] hover:opacity-80 transition-opacity"
        title={speech.status === 'playing' ? 'Pause' : (fr ? 'Reprendre' : 'Resume')}
        aria-label={speech.status === 'playing' ? 'Pause' : 'Resume'}
      >
        {speech.status === 'playing' ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
      </button>

      {sectionName && (
        <span className="hidden sm:block flex-shrink-0 max-w-[110px] truncate font-body text-[11px] text-[var(--cr-muted)]" title={sectionName}>
          {sectionName}
        </span>
      )}

      <div
        className="flex-1 py-2 cursor-pointer"
        onClick={onSeek}
        role="slider"
        aria-label={fr ? 'Position de lecture' : 'Playback position'}
        aria-valuenow={Math.round(speech.progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        title={`${fmt(elapsed)} / ${fmt(totalDur)}`}
      >
        <div className="h-[4px] rounded-full bg-[var(--cr-border)] overflow-hidden">
          <div className="h-full rounded-full bg-[var(--cr-accent)] transition-[width] duration-150" style={{ width: `${speech.progress * 100}%` }} />
        </div>
      </div>

      <span className="flex-shrink-0 text-[10px] font-mono tabular-nums text-[var(--cr-muted)] leading-none">
        {fmt(elapsed)}<span className="text-[var(--cr-faint)] mx-0.5">/</span>{fmt(totalDur)}
      </span>

      <button
        onClick={nextSpeed}
        className={`px-1 flex-shrink-0 font-mono text-[10px] tabular-nums leading-none transition-colors ${
          speech.rate === 1 ? 'text-[var(--cr-faint)] hover:text-[var(--cr-accent)]' : 'text-[var(--cr-accent)]'
        }`}
        title={fr ? 'Vitesse de lecture' : 'Reading speed'}
        aria-label={fr ? `Vitesse de lecture, actuellement ${speedLabel}` : `Reading speed, currently ${speedLabel}`}
      >
        {speedLabel}
      </button>

      <button onClick={() => speech.seek(speech.progress - step)} className="p-1 flex-shrink-0 text-[var(--cr-faint)] hover:text-[var(--cr-accent)] transition-colors" title={fr ? 'Reculer de 10 s' : 'Back 10 seconds'} aria-label={fr ? 'Reculer de 10 secondes' : 'Back 10 seconds'}>
        <Rewind size={14} />
      </button>
      <button onClick={() => speech.seek(speech.progress + step)} className="p-1 flex-shrink-0 text-[var(--cr-faint)] hover:text-[var(--cr-accent)] transition-colors" title={fr ? 'Avancer de 10 s' : 'Forward 10 seconds'} aria-label={fr ? 'Avancer de 10 secondes' : 'Forward 10 seconds'}>
        <FastForward size={14} />
      </button>
      <button onClick={() => speech.stop()} className="p-1 flex-shrink-0 text-[var(--cr-faint)] hover:text-[var(--cr-accent)] transition-colors" title={fr ? 'Arrêter' : 'Stop'} aria-label={fr ? 'Arrêter' : 'Stop'}>
        <Square size={13} />
      </button>
    </div>
  );
}
