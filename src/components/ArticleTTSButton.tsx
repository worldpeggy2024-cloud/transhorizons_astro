/*
 * ArticleTTSButton — compact mic + voice picker for article cards.
 * Uses the shared useReportSpeech engine so a click starts / pauses / resumes and
 * voice choice is shared with the full player and the country reports.
 */

import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, ChevronDown } from 'lucide-react';
import { useReportSpeech } from '../hooks/useReportSpeech';

interface Props {
  id: string;
  title: string;
  excerpt: string;
  lang: string;
}

export default function ArticleTTSButton({ id, title, excerpt, lang }: Props) {
  const isFr = lang.startsWith('fr');
  const speech = useReportSpeech();
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const active = speech.activeId === id;
  const voices = speech.voicesForLang(lang);
  const selected = speech.selectedVoiceName(lang);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  if (!speech.supported) return null;

  const section = { id, text: `${title}. ${excerpt}` };

  return (
    <div className="relative flex items-center gap-0.5" ref={popoverRef}>
      <button
        onClick={(e) => { e.stopPropagation(); speech.play(section, lang); }}
        className={`p-1.5 rounded transition-colors ${active ? 'text-[#7D1A2E]' : 'text-[#AAA] hover:text-[#7D1A2E]'}`}
        title={active ? (isFr ? 'Arrêter la lecture' : 'Stop reading') : (isFr ? 'Écouter l’article' : 'Listen to this article')}
        aria-label={active ? 'Stop audio' : 'Read article aloud'}
      >
        {active ? <MicOff size={14} /> : <Mic size={14} />}
      </button>

      {voices.length > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
          className="p-0.5 text-[#CCC] hover:text-[#7D1A2E] transition-colors"
          title={isFr ? 'Choisir la voix' : 'Choose voice'}
          aria-label={isFr ? 'Choisir la voix' : 'Choose voice'}
        >
          <ChevronDown size={10} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>
      )}

      {open && voices.length > 0 && (
        <div className="absolute bottom-full right-0 mb-2 w-56 bg-white border border-[#D4CDC5] shadow-lg z-50 rounded" onClick={(e) => e.stopPropagation()}>
          <div className="px-3 py-2 border-b border-[#EFEFEF] text-[9px] tracking-[0.2em] uppercase text-[#999] font-body">
            {isFr ? 'Voix · français' : 'Voice · English'}
          </div>
          <ul className="max-h-48 overflow-y-auto">
            {voices.map((v) => (
              <li key={v.name}>
                <button
                  onClick={(e) => { e.stopPropagation(); speech.selectVoice(lang, v.name); setOpen(false); }}
                  className={`w-full text-left px-3 py-2 font-body text-[11px] leading-snug transition-colors ${
                    selected === v.name ? 'bg-[#7D1A2E]/10 text-[#5C1220] font-medium' : 'text-[#333] hover:bg-[#F5F5F5]'
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
