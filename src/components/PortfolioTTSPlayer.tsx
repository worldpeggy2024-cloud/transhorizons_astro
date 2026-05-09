/*
 * PortfolioTTSPlayer — Full-article audio player for portfolio cards
 * Uses Web Speech API via useSpeech hook.
 * Shows a compact "Listen" button when idle, expanding to a progress player when active.
 */

import { useEffect, useRef, useState } from 'react';
import { Volume2, Square, RotateCcw, ChevronDown } from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';

interface Props {
  id: string;
  text: string;
  lang: string;
  /** Use on dark backgrounds (e.g. article hero) */
  dark?: boolean;
}

// Estimated TTS rate for progress/time approximation (chars per second)
const CHARS_PER_SEC = 14;

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function PortfolioTTSPlayer({ id, text, lang, dark = false }: Props) {
  const isFr = lang.startsWith('fr');
  const { voices, selectedVoiceName, selectVoice, speak, speakingId, stop, restart, charIndex, textLength } =
    useSpeech();
  const [voiceOpen, setVoiceOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const isPlaying = speakingId === id;

  // Use textLength from hook when available (set after first play), else estimate from text prop
  const totalChars = textLength > 0 && speakingId === id ? textLength : text.length;
  const totalDuration = totalChars / CHARS_PER_SEC;
  const currentChar = isPlaying ? charIndex : 0;
  const elapsed = currentChar / CHARS_PER_SEC;
  const progress = totalChars > 0 ? Math.min(currentChar / totalChars, 1) : 0;

  // Close voice popover on outside click
  useEffect(() => {
    if (!voiceOpen) return;
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setVoiceOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [voiceOpen]);

  if (!isSupported) return null;

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    speak(id, text, lang);
  };

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    stop();
  };

  const handleRestart = (e: React.MouseEvent) => {
    e.stopPropagation();
    restart(id, text, lang);
  };

  const handleVoicePicker = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVoiceOpen((v) => !v);
  };

  const handleVoiceSelect = (e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    selectVoice(name);
    setVoiceOpen(false);
    if (isPlaying) restart(id, text, lang);
  };

  // ── Active player (playing or stopped after interaction) ───────────────────
  return (
    <div
      className="pt-3 w-full"
      ref={popoverRef}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-2">

        {/* Play / Stop toggle */}
        {isPlaying ? (
          <button
            onClick={handleStop}
            className={`p-1 flex-shrink-0 transition-colors ${
              dark ? 'text-white hover:text-white/70' : 'text-[#7D1A2E] hover:text-[#5C1220]'
            }`}
            title="Stop"
            aria-label="Stop playback"
          >
            <Square size={12} fill="currentColor" />
          </button>
        ) : (
          <button
            onClick={handleRestart}
            className={`p-1 flex-shrink-0 transition-colors ${
              dark ? 'text-white hover:text-white/70' : 'text-[#7D1A2E] hover:text-[#5C1220]'
            }`}
            title="Play from beginning"
            aria-label="Restart playback"
          >
            <Volume2 size={12} />
          </button>
        )}

        {/* Progress bar */}
        <div
          className={`flex-1 h-[3px] rounded-full overflow-hidden ${
            dark ? 'bg-white/20' : 'bg-[#E0E0E0]'
          }`}
          title={`${formatTime(elapsed)} of ${formatTime(totalDuration)}`}
        >
          <div
            className={`h-full rounded-full transition-[width] duration-300 ${
              dark ? 'bg-white' : 'bg-[#7D1A2E]'
            }`}
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        {/* Time display */}
        <span className={`text-[9px] font-mono flex-shrink-0 tabular-nums leading-none ${
          dark ? 'text-white/60' : 'text-[#999]'
        }`}>
          {formatTime(elapsed)}<span className={dark ? 'text-white/30 mx-0.5' : 'text-[#CCC] mx-0.5'}>/</span>{formatTime(totalDuration)}
        </span>

        {/* Restart button (shown while playing) */}
        {isPlaying && (
          <button
            onClick={handleRestart}
            className={`p-1 flex-shrink-0 transition-colors ${
              dark ? 'text-white/40 hover:text-white' : 'text-[#CCC] hover:text-[#7D1A2E]'
            }`}
            title="Restart from beginning"
            aria-label="Restart from beginning"
          >
            <RotateCcw size={11} />
          </button>
        )}

        {/* Voice picker */}
        {voices.length > 0 && (
          <div className="relative flex-shrink-0">
            <button
              onClick={handleVoicePicker}
              className={`p-0.5 transition-colors ${
                dark ? 'text-white/40 hover:text-white' : 'text-[#CCC] hover:text-[#7D1A2E]'
              }`}
              title="Choose voice"
              aria-label="Choose voice"
            >
              <ChevronDown
                size={10}
                className={`transition-transform duration-200 ${voiceOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {voiceOpen && (
              <div
                className="absolute bottom-full right-0 mb-2 w-56 bg-white border border-[#D4CDC5] shadow-lg z-50 rounded"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-3 py-2 border-b border-[#EFEFEF] text-[9px] tracking-[0.2em] uppercase text-[#999] font-body">
                  Voice
                </div>
                <ul className="max-h-48 overflow-y-auto">
                  {voices.map((v) => (
                    <li key={v.name}>
                      <button
                        onClick={(e) => handleVoiceSelect(e, v.name)}
                        className={`w-full text-left px-3 py-2 font-body text-[11px] leading-snug transition-colors ${
                          selectedVoiceName === v.name
                            ? 'bg-[#7D1A2E]/10 text-[#5C1220] font-medium'
                            : 'text-[#333] hover:bg-[#F5F5F5]'
                        }`}
                      >
                        <span className="block truncate">{v.name}</span>
                        <span className="block text-[9px] text-[#AAA]">{v.lang}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      {voices.length > 0 && (
        <p className={`mt-1.5 flex items-center gap-1 text-[8px] font-body leading-none ${
          dark ? 'text-white/25' : 'text-[#C0C0C0]'
        }`}>
          {isFr ? 'Voix et langue sélectionnables au bout de la ligne :' : 'Voice & language selectable at the end of the line:'}
          <ChevronDown size={9} strokeWidth={2} />
        </p>
      )}
    </div>
  );
}
