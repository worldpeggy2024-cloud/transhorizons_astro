/*
 * ArticleTTSButton — Mic button with voice picker popover
 * Uses the Web Speech API via the useSpeech hook.
 * Voice choice is persisted to localStorage.
 */

import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, ChevronDown } from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';

interface Props {
  id: string;
  title: string;
  excerpt: string;
  lang: string;
}

export default function ArticleTTSButton({ id, title, excerpt, lang }: Props) {
  const { voices, selectedVoiceName, selectVoice, speak, speakingId } = useSpeech();
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const isSpeaking = speakingId === id;

  // Close popover on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  if (!isSupported) return null;

  const handleMic = (e: React.MouseEvent) => {
    e.stopPropagation();
    speak(id, `${title}. ${excerpt}`, lang);
  };

  const handleChevron = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen((v) => !v);
  };

  const handleVoiceSelect = (e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    selectVoice(name);
    setOpen(false);
  };

  return (
    <div className="relative flex items-center gap-0.5" ref={popoverRef}>
      {/* Mic button */}
      <button
        onClick={handleMic}
        className={`p-1.5 rounded transition-colors ${
          isSpeaking ? 'text-[#7D1A2E]' : 'text-[#AAA] hover:text-[#7D1A2E]'
        }`}
        title={isSpeaking ? 'Stop reading' : 'Listen to this article'}
        aria-label={isSpeaking ? 'Stop audio' : 'Read article aloud'}
      >
        {isSpeaking ? <MicOff size={14} /> : <Mic size={14} />}
      </button>

      {/* Voice picker toggle */}
      {voices.length > 0 && (
        <button
          onClick={handleChevron}
          className="p-0.5 text-[#CCC] hover:text-[#7D1A2E] transition-colors"
          title="Choose voice"
          aria-label="Choose voice"
        >
          <ChevronDown size={10} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>
      )}

      {/* Voice picker popover */}
      {open && voices.length > 0 && (
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
  );
}
