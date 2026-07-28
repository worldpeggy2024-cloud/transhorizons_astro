import { useCallback, useEffect, useRef, useState } from 'react';

/*
 * useReportSpeech — Web Speech narration for country reports, with a progress
 * model that supports pause / resume / seek.
 *
 * A report is read per SECTION and, optionally, continuously across all of them.
 * The text is flattened into a queue of sentence-sized chunks (short enough to
 * dodge Chrome's ~15s long-utterance stall), each tagged with its section id and
 * its cumulative character offset. Position = current chunk's offset + the word
 * boundary within it, so a single fraction covers the whole narration and a seek
 * maps a fraction back to the nearest chunk (a sentence boundary — the natural
 * place to resume, since the engine can't start mid-word).
 *
 * Robustness (Web Speech is finicky): a generation token invalidates callbacks
 * from a superseded utterance; benign 'canceled'/'interrupted' errors are ignored
 * (they fire from our own cancel(), and treating them as "done" is what made the
 * player flash and vanish); we only cancel when something is actually sounding, and
 * defer the next speak a tick after a cancel so Chrome doesn't drop it; and we keep
 * a reference to the live utterance so it isn't garbage-collected mid-sentence.
 *
 * Step 1: free, browser-native, always current. A later step can prefer a
 * pre-generated high-quality audio file per section when one exists.
 */

export interface SpeechSection {
  id: string;
  text: string;
}

type Chunk = { secId: string; text: string; start: number };
export type SpeechStatus = 'idle' | 'playing' | 'paused';

const MAX_CHUNK = 240;

function stripMarkers(text: string): string {
  return text.replace(/\[[^\]]*\]/g, '').replace(/\s+/g, ' ').trim();
}

/** Split into speakable chunks: sentences, and over-long sentences at clauses. */
function toChunks(text: string): string[] {
  const clean = stripMarkers(text);
  if (!clean) return [];
  const sentences = clean.match(/[^.!?]+[.!?]+(?:["'’)\]]+)?|\S[^.!?]*$/g) ?? [clean];
  const out: string[] = [];
  for (const raw of sentences) {
    const s = raw.trim();
    if (!s) continue;
    if (s.length <= MAX_CHUNK) { out.push(s); continue; }
    let buf = '';
    for (const part of s.split(/(?<=[,;:])\s+/)) {
      if (buf && (buf.length + 1 + part.length) > MAX_CHUNK) { out.push(buf.trim()); buf = part; }
      else buf = buf ? `${buf} ${part}` : part;
    }
    if (buf.trim()) out.push(buf.trim());
  }
  return out;
}

export function useReportSpeech() {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceEn, setVoiceEn] = useState<string>(() =>
    typeof localStorage !== 'undefined' ? localStorage.getItem('tts-voice-en') ?? '' : '');
  const [voiceFr, setVoiceFr] = useState<string>(() =>
    typeof localStorage !== 'undefined' ? localStorage.getItem('tts-voice-fr') ?? '' : '');

  const [status, setStatus] = useState<SpeechStatus>('idle');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mode, setMode] = useState<'single' | 'all' | null>(null);
  const [progress, setProgress] = useState(0);   // 0..1 across the loaded narration
  const [totalChars, setTotalChars] = useState(0); // length of loaded narration (time est.)

  // Playback session (refs so callbacks are immune to re-renders).
  const chunks = useRef<Chunk[]>([]);
  const total = useRef(0);
  const idx = useRef(0);
  const charInChunk = useRef(0);
  const langRef = useRef('en');
  const voiceRef = useRef<SpeechSynthesisVoice | undefined>(undefined);
  const gen = useRef(0);                                        // invalidates stale utterance callbacks
  const uRef = useRef<SpeechSynthesisUtterance | null>(null);   // keep-alive vs GC

  useEffect(() => {
    if (!supported) return;
    const load = () => { const v = window.speechSynthesis.getVoices(); if (v.length) setVoices(v); };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, [supported]);

  // Never leave the tab talking after the page unmounts.
  useEffect(() => () => { if (supported) { gen.current++; window.speechSynthesis.cancel(); } }, [supported]);

  const langOf = (lang: string) => (lang.toLowerCase().startsWith('fr') ? 'fr' : 'en');

  const voiceFor = useCallback((lang: string): SpeechSynthesisVoice | undefined => {
    const l = langOf(lang);
    const want = l === 'fr' ? voiceFr : voiceEn;
    return voices.find((v) => v.name === want) ?? voices.find((v) => v.lang.toLowerCase().startsWith(l));
  }, [voices, voiceEn, voiceFr]);

  const voicesForLang = useCallback((lang: string) => {
    const l = langOf(lang);
    return voices.filter((v) => v.lang.toLowerCase().startsWith(l));
  }, [voices]);

  const selectedVoiceName = useCallback((lang: string) => (langOf(lang) === 'fr' ? voiceFr : voiceEn), [voiceFr, voiceEn]);

  const selectVoice = useCallback((lang: string, name: string) => {
    if (langOf(lang) === 'fr') { setVoiceFr(name); localStorage.setItem('tts-voice-fr', name); }
    else { setVoiceEn(name); localStorage.setItem('tts-voice-en', name); }
  }, []);

  const syncProgress = () => {
    if (!total.current) { setProgress(0); return; }
    const pos = (chunks.current[idx.current]?.start ?? total.current) + charInChunk.current;
    setProgress(Math.min(pos / total.current, 1));
  };

  const finish = () => {
    setStatus('idle'); setActiveId(null); setMode(null); setProgress(0);
    idx.current = 0; charInChunk.current = 0; uRef.current = null;
  };

  // Speak chunk i under generation myGen; chain to i+1 on natural end.
  const speakChunk = (i: number, myGen: number) => {
    if (!supported || myGen !== gen.current) return;   // superseded
    if (i >= chunks.current.length) { finish(); return; }
    idx.current = i; charInChunk.current = 0;
    const c = chunks.current[i];
    setActiveId(c.secId);
    syncProgress();
    const u = new SpeechSynthesisUtterance(c.text);
    uRef.current = u;
    if (voiceRef.current) u.voice = voiceRef.current;
    else u.lang = langOf(langRef.current) === 'fr' ? 'fr-FR' : 'en-US';
    u.onboundary = (e) => { if (myGen === gen.current && e.name === 'word') { charInChunk.current = e.charIndex; syncProgress(); } };
    u.onend = () => { if (myGen === gen.current) speakChunk(i + 1, myGen); };
    u.onerror = (e) => {
      // Benign errors fire from our own cancel() — ignore them. Only a real fault ends playback.
      if (myGen === gen.current && e.error !== 'canceled' && e.error !== 'interrupted') finish();
    };
    window.speechSynthesis.speak(u);
  };

  // Start (or seek/restart) at chunk i. Cancels only if something is sounding, and
  // defers the speak a tick past the cancel so Chrome doesn't drop the new utterance.
  const speakFrom = (i: number, myGen: number) => {
    const go = () => speakChunk(i, myGen);
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
      setTimeout(go, 60);
    } else {
      go();
    }
  };

  const start = (sections: SpeechSection[], lang: string, m: 'single' | 'all') => {
    if (!supported) return;
    const myGen = ++gen.current;
    langRef.current = lang;
    voiceRef.current = voiceFor(lang);
    const list: Chunk[] = [];
    let off = 0;
    for (const s of sections) for (const t of toChunks(s.text)) { list.push({ secId: s.id, text: t, start: off }); off += t.length + 1; }
    chunks.current = list; total.current = off; idx.current = 0; charInChunk.current = 0;
    if (!list.length) return;
    setTotalChars(off); setProgress(0); setMode(m); setStatus('playing');
    speakFrom(0, myGen);
  };

  const pause = useCallback(() => {
    if (supported && status === 'playing') { window.speechSynthesis.pause(); setStatus('paused'); }
  }, [supported, status]);

  const resume = useCallback(() => {
    if (supported && status === 'paused') { window.speechSynthesis.resume(); setStatus('playing'); }
  }, [supported, status]);

  const stop = useCallback(() => {
    gen.current++;
    if (supported) window.speechSynthesis.cancel();
    finish();
  }, [supported]);

  const restart = () => {
    if (!chunks.current.length) return;
    const myGen = ++gen.current;
    setStatus('playing');
    speakFrom(0, myGen);
  };

  const seek = (fraction: number) => {
    if (!chunks.current.length) return;
    const target = Math.max(0, Math.min(1, fraction)) * total.current;
    let i = chunks.current.findIndex((c) => target < c.start + c.text.length + 1);
    if (i < 0) i = chunks.current.length - 1;
    const myGen = ++gen.current;
    setStatus('playing');
    speakFrom(i, myGen);
  };

  // Play one section; calling again on the active single section toggles pause/resume.
  const play = (section: SpeechSection, lang: string) => {
    if (mode === 'single' && activeId === section.id) {
      if (status === 'playing') return pause();
      if (status === 'paused') return resume();
    }
    start([section], lang, 'single');
  };

  // Play every section in order; calling again while in all-mode toggles pause/resume.
  const playAll = (sections: SpeechSection[], lang: string) => {
    if (mode === 'all') {
      if (status === 'playing') return pause();
      if (status === 'paused') return resume();
    }
    start(sections, lang, 'all');
  };

  return {
    supported,
    voicesForLang, selectedVoiceName, selectVoice,
    status, activeId, mode, progress, totalChars,
    play, playAll, pause, resume, stop, restart, seek,
  };
}

export type ReportSpeech = ReturnType<typeof useReportSpeech>;
