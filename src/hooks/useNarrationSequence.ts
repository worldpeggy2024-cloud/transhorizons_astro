import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SPEEDS } from './useReportSpeech';
import type { NarrationAudio } from './useNarrationAudio';
import type { NarrationSection } from '../lib/narrationAudio';

/*
 * useNarrationSequence — one country report, many files, one timeline.
 *
 * The sibling of useNarrationAudio. An article is a single recording; a country
 * report is one recording per section, because sections are generated, approved
 * and re-generated independently — a fix to Territory must not invalidate
 * Capacity. That is a production decision, and this hook is what stops it
 * leaking into the listening experience: to the listener it is one two-and-a-
 * half-hour recording that scrubs end to end.
 *
 * It exposes exactly the NarrationAudio surface, so the existing player drives
 * it without knowing which engine it holds. Positions are GLOBAL seconds across
 * the whole report; the current file and its offset are an internal detail.
 *
 * Durations come from the manifest (measured with ffprobe at staging time), so
 * the total is known before a single byte is fetched — the progress bar is
 * right on first paint instead of growing as files load.
 */

const DEFAULT_RATE = 1;

function storedRate(): number {
  if (typeof localStorage === 'undefined') return DEFAULT_RATE;
  const stored = Number(localStorage.getItem('tts-rate'));
  return SPEEDS.includes(stored as typeof SPEEDS[number]) ? stored : DEFAULT_RATE;
}

export interface NarrationSequence extends NarrationAudio {
  /** Index of the section now playing, or -1 before playback starts. */
  sectionIndex: number;
  sections: NarrationSection[];
  /** id of the section now sounding, or null when idle. */
  activeSectionId: string | null;
  /** Start (or pause/resume) one section by id. Mirrors the Web Speech
   *  per-section button, so the two engines behave identically. */
  playSection: (id: string) => void;
  /** Whether a recording exists for this section id. */
  hasSection: (id: string) => boolean;
}

export function useNarrationSequence(sections: NarrationSection[] | undefined): NarrationSequence {
  const list = useMemo(() => sections ?? [], [sections]);

  // Cumulative start time of each section, with the total as the final entry.
  const offsets = useMemo(() => {
    const out: number[] = [];
    let acc = 0;
    for (const s of list) { out.push(acc); acc += s.seconds; }
    out.push(acc);
    return out;
  }, [list]);
  const total = offsets[offsets.length - 1] ?? 0;

  const ref = useRef<HTMLAudioElement | null>(null);
  const [index, setIndex] = useState(0);
  const [withinTrack, setWithinTrack] = useState(0);
  const [status, setStatus] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [rate, setRateState] = useState(storedRate);
  const [failed, setFailed] = useState(false);

  /* Set when a seek lands in a section that is not loaded yet: the position is
   * applied once that file reports its metadata. Without it, a cross-section
   * seek would start the new section from zero. */
  const pending = useRef<number | null>(null);
  /* Whether to resume after the next load — a seek made while playing, or a
   * section ending, must not stop the report. */
  const resume = useRef(false);

  useEffect(() => {
    if (typeof Audio === 'undefined' || !list.length) return;
    const audio = new Audio();
    audio.preload = 'none';
    ref.current = audio;
    setFailed(false);
    return () => { audio.pause(); ref.current = null; };
  }, [list.length]);

  // Load whichever section is current. Kept separate from element creation so
  // advancing a section does not tear down and rebuild the element.
  useEffect(() => {
    const audio = ref.current;
    const section = list[index];
    if (!audio || !section) return;

    audio.src = section.src;
    audio.playbackRate = rate;

    const onMeta = () => {
      if (pending.current != null) {
        audio.currentTime = Math.min(pending.current, audio.duration || section.seconds);
        setWithinTrack(audio.currentTime);
        pending.current = null;
      }
      if (resume.current) {
        resume.current = false;
        void audio.play().then(() => setStatus('playing')).catch(() => setStatus('paused'));
      }
    };
    const onTime = () => setWithinTrack(audio.currentTime);
    const onEnd = () => {
      if (index < list.length - 1) {
        resume.current = true;          // roll straight into the next section
        pending.current = 0;
        setIndex(index + 1);
      } else {
        setStatus('idle');
        setIndex(0);
        setWithinTrack(0);
        pending.current = 0;
      }
    };
    const onError = () => { setFailed(true); setStatus('idle'); };

    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended', onEnd);
    audio.addEventListener('error', onError);
    return () => {
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('ended', onEnd);
      audio.removeEventListener('error', onError);
    };
    // rate is applied directly in setRate; re-running here would reload the file
    // and lose the position.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, list]);

  const elapsed = (offsets[index] ?? 0) + withinTrack;

  const setRate = useCallback((next: number) => {
    setRateState(next);
    if (typeof localStorage !== 'undefined') localStorage.setItem('tts-rate', String(next));
    if (ref.current) ref.current.playbackRate = next;
  }, []);

  const play = useCallback(() => {
    const audio = ref.current;
    if (!audio) return;
    audio.playbackRate = rate;
    void audio.play().then(() => setStatus('playing')).catch(() => setStatus('idle'));
  }, [rate]);

  const pause = useCallback(() => {
    ref.current?.pause();
    setStatus('paused');
  }, []);

  const toggle = useCallback(() => {
    if (status === 'playing') pause(); else play();
  }, [status, play, pause]);

  const stop = useCallback(() => {
    const audio = ref.current;
    if (audio) { audio.pause(); audio.currentTime = 0; }
    resume.current = false;
    pending.current = 0;
    setIndex(0);
    setWithinTrack(0);
    setStatus('idle');
  }, []);

  /* Seek by GLOBAL position. Finding the section is a linear scan over nine
   * entries — not worth a binary search, and this way the loop reads as what it
   * is: the last section whose start is at or before the target. */
  const seekSeconds = useCallback((target: number) => {
    if (!list.length) return;
    const t = Math.max(0, Math.min(total, target));
    let next = 0;
    while (next < list.length - 1 && t >= offsets[next + 1]) next += 1;
    const within = t - offsets[next];
    const audio = ref.current;
    if (next === index && audio) {
      audio.currentTime = within;
      setWithinTrack(within);
      return;
    }
    pending.current = within;
    resume.current = status === 'playing';
    setWithinTrack(within);
    setIndex(next);
  }, [list, offsets, total, index, status]);

  const seek = useCallback((fraction: number) => {
    seekSeconds(Math.max(0, Math.min(1, fraction)) * total);
  }, [seekSeconds, total]);

  const nudge = useCallback((seconds: number) => {
    seekSeconds(elapsed + seconds);
  }, [seekSeconds, elapsed]);

  /* Per-section control. The report is ONE timeline, so starting a section is a
   * seek to its offset rather than a separate player — which is why pressing
   * play on Territory and letting it run carries on into Society, exactly as
   * the continuous read does. Pressing the section that is already sounding
   * toggles it, matching the Web Speech button it sits beside. */
  const playSection = useCallback((id: string) => {
    const next = list.findIndex((s) => s.id === id);
    if (next < 0) return;
    const audio = ref.current;
    if (next === index && status === 'playing') { pause(); return; }
    if (next === index && status === 'paused') { play(); return; }
    if (next === index && audio) {
      audio.currentTime = 0;
      setWithinTrack(0);
      play();
      return;
    }
    pending.current = 0;
    resume.current = true;
    setWithinTrack(0);
    setIndex(next);
  }, [list, index, status, play, pause]);

  const hasSection = useCallback(
    (id: string) => list.some((s) => s.id === id), [list]);

  return {
    available: list.length > 0 && !failed,
    status,
    progress: total ? Math.min(elapsed / total, 1) : 0,
    duration: total,
    elapsed,
    rate,
    setRate,
    play, pause, toggle, stop, seek, nudge,
    sectionIndex: status === 'idle' && elapsed === 0 ? -1 : index,
    sections: list,
    activeSectionId: status === 'idle' ? null : (list[index]?.id ?? null),
    playSection,
    hasSection,
  };
}
