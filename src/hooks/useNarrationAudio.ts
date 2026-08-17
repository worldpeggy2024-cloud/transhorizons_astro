import { useCallback, useEffect, useRef, useState } from 'react';
import { SPEEDS } from './useReportSpeech';

/*
 * useNarrationAudio — playback for a PRE-GENERATED narration file.
 *
 * The counterpart to useReportSpeech: same surface (status, progress, play,
 * pause, seek, rate) so a player component can drive either engine, but backed
 * by an <audio> element instead of the browser's speech synthesiser.
 *
 * Everything it does better is a consequence of the audio being real rather
 * than synthesised live: duration is exact instead of estimated from character
 * count, seeking is to a true timestamp instead of snapping to the nearest
 * sentence, and speed changes apply instantly without restarting anything.
 *
 * Speed is shared with the Web Speech engine through the same localStorage key,
 * so switching voice does not silently reset the listener's chosen pace.
 */

export interface NarrationAudio {
  available: boolean;
  status: 'idle' | 'playing' | 'paused';
  progress: number;          // 0..1
  duration: number;          // seconds, exact
  elapsed: number;           // seconds
  rate: number;
  setRate: (r: number) => void;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  stop: () => void;
  seek: (fraction: number) => void;
  nudge: (seconds: number) => void;
}

const DEFAULT_RATE = 1;

function storedRate(): number {
  if (typeof localStorage === 'undefined') return DEFAULT_RATE;
  const stored = Number(localStorage.getItem('tts-rate'));
  return SPEEDS.includes(stored as typeof SPEEDS[number]) ? stored : DEFAULT_RATE;
}

export function useNarrationAudio(src: string | undefined, fallbackSeconds = 0): NarrationAudio {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [status, setStatus] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [duration, setDuration] = useState(fallbackSeconds);
  const [elapsed, setElapsed] = useState(0);
  const [rate, setRateState] = useState(storedRate);
  /* The manifest says a recording exists; the server may disagree — most often
   * because the site was deployed WITHOUT public/audio (a plain `fly deploy`
   * rather than `npm run deploy:audio`). Treat that as "no recording" so the
   * player falls back to Web Speech instead of sitting silent. */
  const [failed, setFailed] = useState(false);

  // Created lazily and never rendered: preload="none" so opening a page costs
  // nothing until the listener actually presses play.
  useEffect(() => {
    if (!src || typeof Audio === 'undefined') return;
    const audio = new Audio();
    audio.preload = 'none';
    audio.src = src;
    audio.playbackRate = rate;
    ref.current = audio;

    const onMeta = () => { if (isFinite(audio.duration)) setDuration(audio.duration); };
    const onTime = () => setElapsed(audio.currentTime);
    const onEnd = () => { setStatus('idle'); setElapsed(0); audio.currentTime = 0; };
    const onError = () => { setFailed(true); setStatus('idle'); };

    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended', onEnd);
    audio.addEventListener('error', onError);
    setFailed(false);
    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('ended', onEnd);
      audio.removeEventListener('error', onError);
      ref.current = null;
    };
    // rate is applied separately; re-creating the element on a speed change
    // would drop playback position.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  const setRate = useCallback((next: number) => {
    setRateState(next);
    if (typeof localStorage !== 'undefined') localStorage.setItem('tts-rate', String(next));
    if (ref.current) ref.current.playbackRate = next;   // takes effect mid-sentence
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
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setElapsed(0);
    setStatus('idle');
  }, []);

  const seek = useCallback((fraction: number) => {
    const audio = ref.current;
    if (!audio || !isFinite(audio.duration)) return;
    audio.currentTime = Math.max(0, Math.min(1, fraction)) * audio.duration;
    setElapsed(audio.currentTime);
  }, []);

  const nudge = useCallback((seconds: number) => {
    const audio = ref.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + seconds));
    setElapsed(audio.currentTime);
  }, []);

  return {
    available: !!src && !failed,
    status,
    progress: duration ? Math.min(elapsed / duration, 1) : 0,
    duration,
    elapsed,
    rate,
    setRate,
    play, pause, toggle, stop, seek, nudge,
  };
}
