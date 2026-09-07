/*
 * PortfolioTTSPlayer — full-article audio player (hero / cards).
 * Uses the shared useReportSpeech engine (an article = one "section"), so it has
 * the same pause/resume, seekable progress bar, and ±10s skip as the country
 * reports, plus per-language voice selection persisted across the whole site.
 */

import { useEffect, useRef, useState } from 'react';
import { Volume2, Play, Pause, Rewind, FastForward, ChevronDown } from 'lucide-react';
import { useReportSpeech } from '../hooks/useReportSpeech';
import { useNarrationAudio } from '../hooks/useNarrationAudio';
import { getArticleNarration, narrationTakes, slugFromPath } from '../lib/narrationAudio';
import { FloatingReportPlayer } from './ReportAudio';

interface Props {
  id: string;
  text: string;
  lang: string;
  /** Use on dark backgrounds (e.g. article hero) */
  dark?: boolean;
  /** Detail pages: also show the fixed floating transport, reachable while
   * scrolling through maps/visuals. Leave off on list/index cards. */
  floating?: boolean;
  /** Label shown in the floating pill (e.g. the article title). */
  title?: string;
  /** Article slug used to look up a published recording. Defaults to the last
   * path segment, which is the slug on every detail page. */
  slug?: string;
}

// Estimated TTS rate for the progress/time approximation (chars per second)
const CHARS_PER_SEC = 14;

/*
 * Reader-facing names. Deliberately NOT the Fish library titles: those are
 * uploader-chosen, frequently duplicated ("adam stone" matches dozens of
 * unrelated voices) and meaningless to a listener. What a reader wants to know
 * is accent and register, so that is what the menu says.
 * The slug still maps back to the exact model — see the URLs in fish_tts.py.
 */
const VOICE_LABELS: Record<string, string> = {
  // English
  'adam-stone': 'British narrator',
  'deep-voice': 'British narrator, deeper',
  ogechi: 'British narrator, female',
  'war-arsenal': 'American narrator',
  laura: 'American narrator, female',
  florence: 'American narrator, female, lighter',
  'old-woman': 'American narrator, female, softer',
  // French
  angelokyly: 'Narrateur, voix grave',
  'le-narrateur': 'Narrateur, plus expressif',
  'lucas-dupont': 'Narrateur',
  'annonce-calme': 'Narratrice, voix posée',
  ora: 'Narratrice, articulée',
  reflechie: 'Narratrice, voix réfléchie',
  'irish-3': 'Irish narrator',
  // Peggy's own clone — named as herself, since that is the point of using it.
  // "peggy" here is the FRENCH clone; peggy-thoughtful is the English one.
  peggy: 'Peggy',
  'peggy-thoughtful': "Peggy — the author's voice",
};

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) seconds = 0;
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function PortfolioTTSPlayer({ id, text, lang, dark = false, floating = false, title, slug }: Props) {
  const isFr = lang.startsWith('fr');
  const speech = useReportSpeech();
  const [voiceOpen, setVoiceOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  /* A published recording, if this piece has one. Absent is the normal case and
   * simply leaves the Web Speech path in charge. */
  const resolvedSlug = slug ?? (typeof window !== 'undefined' ? slugFromPath(window.location.pathname) : '');
  const narration = getArticleNarration(resolvedSlug, lang);
  /* A piece may be published in more than one voice. The reader picks; the
   * first approved take is the default. */
  const takes = narrationTakes(narration);
  const [takeIndex, setTakeIndex] = useState(0);
  const take = takes[takeIndex] ?? takes[0];
  const audio = useNarrationAudio(take?.src, take?.seconds);
  // The listener can drop back to a browser voice from the same dropdown; the
  // recording is simply the default when one exists.
  const [useSpeech, setUseSpeech] = useState(false);
  const premium = audio.available && !useSpeech;

  const speechActive = speech.activeId === id;
  const speechChars = speechActive ? speech.totalChars : text.length;

  /* One surface, either engine. The recording gives an exact duration and true
   * time-seeking; Web Speech can only estimate from character count. */
  const active = premium ? audio.status !== 'idle' : speechActive;
  const playing = premium ? audio.status === 'playing' : (speechActive && speech.status === 'playing');
  const totalDuration = premium ? audio.duration : speechChars / CHARS_PER_SEC;
  const progress = premium ? audio.progress : (speechActive ? speech.progress : 0);
  const elapsed = premium ? audio.elapsed : progress * totalDuration;
  const step = premium ? 0 : (10 * CHARS_PER_SEC) / (speechChars || 1);

  const onPlayToggle = () => (premium ? audio.toggle() : speech.play({ id, text }, lang));
  const seekTo = (fraction: number) => (premium ? audio.seek(fraction) : speech.seek(fraction));
  const skip = (seconds: number) =>
    premium ? audio.nudge(seconds) : speech.skip(seconds * CHARS_PER_SEC);

  const voices = speech.voicesForLang(lang);
  const selected = speech.selectedVoiceName(lang);

  useEffect(() => {
    if (!voiceOpen) return;
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) setVoiceOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [voiceOpen]);

  // A recording plays even where speechSynthesis is unavailable — which is the
  // point of having one: old Safari gets audio instead of silence.
  if (!speech.supported && !premium) return null;

  const accent = dark ? 'text-white hover:text-white/70' : 'text-[#7D1A2E] hover:text-[#5C1220]';
  const dim = dark ? 'text-white/40 hover:text-white' : 'text-[#CCC] hover:text-[#7D1A2E]';

  const onSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    // Web Speech can only seek within a loaded narration; a recording can be
    // scrubbed before it has ever been played.
    if (!premium && !active) return;
    const rect = e.currentTarget.getBoundingClientRect();
    seekTo((e.clientX - rect.left) / rect.width);
  };

  return (
    <>
    <div className="pt-3 w-full" ref={popoverRef} onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center gap-2">

        {/* Play / Pause / Resume */}
        <button
          onClick={(e) => { e.stopPropagation(); onPlayToggle(); }}
          className={`p-1 flex-shrink-0 transition-colors ${accent}`}
          title={playing ? 'Pause' : (active ? (isFr ? 'Reprendre' : 'Resume') : (isFr ? 'Écouter' : 'Listen'))}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? <Pause size={13} fill="currentColor" /> : active ? <Play size={13} fill="currentColor" /> : <Volume2 size={13} />}
        </button>

        {/* Back 10s (only while this article is loaded) */}
        {active && (
          <button onClick={(e) => { e.stopPropagation(); skip(-10); }} className={`p-1 flex-shrink-0 transition-colors ${dim}`} title={isFr ? 'Reculer de 10 s' : 'Back 10 seconds'} aria-label={isFr ? 'Reculer de 10 secondes' : 'Back 10 seconds'}>
            <Rewind size={12} />
          </button>
        )}

        {/* Seekable progress bar */}
        <div
          className={`flex-1 py-2 ${active ? 'cursor-pointer' : ''}`}
          onClick={onSeek}
          role="slider"
          aria-label={isFr ? 'Position de lecture' : 'Playback position'}
          aria-valuenow={Math.round(progress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          title={`${formatTime(elapsed)} / ${formatTime(totalDuration)}`}
        >
          <div className={`h-[3px] rounded-full overflow-hidden ${dark ? 'bg-white/20' : 'bg-[#E0E0E0]'}`}>
            <div className={`h-full rounded-full transition-[width] duration-150 ${dark ? 'bg-white' : 'bg-[#7D1A2E]'}`} style={{ width: `${progress * 100}%` }} />
          </div>
        </div>

        {/* Forward 10s */}
        {active && (
          <button onClick={(e) => { e.stopPropagation(); skip(10); }} className={`p-1 flex-shrink-0 transition-colors ${dim}`} title={isFr ? 'Avancer de 10 s' : 'Forward 10 seconds'} aria-label={isFr ? 'Avancer de 10 secondes' : 'Forward 10 seconds'}>
            <FastForward size={12} />
          </button>
        )}

        {/* Time */}
        <span className={`text-[9px] font-mono flex-shrink-0 tabular-nums leading-none ${dark ? 'text-white/60' : 'text-[#999]'}`}>
          {formatTime(elapsed)}<span className={dark ? 'text-white/30 mx-0.5' : 'text-[#CCC] mx-0.5'}>/</span>{formatTime(totalDuration)}
        </span>

        {/* Voice picker. Shown when there is anything to choose between — which
          * includes a studio recording on its own: a browser with no speech
          * voices installed would otherwise hide the menu entirely and give the
          * listener no way to see, or leave, the recording. */}
        {(voices.length > 0 || narration) && (
          <div className="relative flex-shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); setVoiceOpen((v) => !v); }}
              className={`p-0.5 transition-colors ${dim}`}
              title={isFr ? 'Choisir la voix' : 'Choose voice'}
              aria-label={isFr ? 'Choisir la voix' : 'Choose voice'}
            >
              <ChevronDown size={10} className={`transition-transform duration-200 ${voiceOpen ? 'rotate-180' : ''}`} />
            </button>

            {voiceOpen && (
              <div className="absolute bottom-full right-0 mb-2 w-56 bg-white border border-[#D4CDC5] shadow-lg z-50 rounded" onClick={(e) => e.stopPropagation()}>
                <div className="px-3 py-2 border-b border-[#EFEFEF] text-[9px] tracking-[0.2em] uppercase text-[#999] font-body">
                  {isFr ? 'Voix · français' : 'Voice · English'}
                </div>
                <ul className="max-h-48 overflow-y-auto">
                  {/* The published recording, when there is one. Choosing a
                    * voice IS choosing an engine: this entry plays the studio
                    * file, everything below synthesises in the browser. */}
                  {takes.length > 0 && (
                    <>
                      {takes.map((t, i) => (
                        <li key={t.voice}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); speech.stop();
                              if (i !== takeIndex) audio.stop();
                              setTakeIndex(i); setUseSpeech(false); setVoiceOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 font-body text-[11px] leading-snug transition-colors ${
                              premium && i === takeIndex ? 'bg-[#7D1A2E]/10 text-[#5C1220] font-medium' : 'text-[#333] hover:bg-[#F5F5F5]'
                            }`}
                          >
                            <span className="block truncate">
                              {VOICE_LABELS[t.voice] ?? t.voice}
                            </span>
                            <span className="block text-[9px] text-[#AAA]">
                              {isFr ? 'enregistrement · voix de studio' : 'recording · studio voice'}
                            </span>
                          </button>
                        </li>
                      ))}
                      <li className="px-3 py-1 border-y border-[#EFEFEF] text-[8px] tracking-[0.15em] uppercase text-[#BBB] font-body">
                        {isFr ? 'ou voix du navigateur' : 'or browser voices'}
                      </li>
                    </>
                  )}
                  {voices.map((v) => (
                    <li key={v.name}>
                      <button
                        onClick={(e) => { e.stopPropagation(); audio.stop(); setUseSpeech(true); speech.selectVoice(lang, v.name); setVoiceOpen(false); }}
                        className={`w-full text-left px-3 py-2 font-body text-[11px] leading-snug transition-colors ${
                          !premium && selected === v.name ? 'bg-[#7D1A2E]/10 text-[#5C1220] font-medium' : 'text-[#333] hover:bg-[#F5F5F5]'
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
        <p className={`mt-1.5 flex items-center gap-1 text-[8px] font-body leading-none ${dark ? 'text-white/25' : 'text-[#C0C0C0]'}`}>
          {isFr ? 'Voix et langue sélectionnables au bout de la ligne :' : 'Voice & language selectable at the end of the line:'}
          <ChevronDown size={9} strokeWidth={2} />
        </p>
      )}
    </div>
    {floating && <FloatingReportPlayer speech={speech} lang={lang} sectionName={title} audio={premium ? audio : undefined} />}
    </>
  );
}
