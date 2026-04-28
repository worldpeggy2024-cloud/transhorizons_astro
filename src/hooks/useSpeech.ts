import { useState, useEffect, useCallback } from 'react';

export function useSpeech() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>(() => {
    return localStorage.getItem('tts-voice') ?? '';
  });
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const load = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length) setVoices(v);
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const selectVoice = useCallback((name: string) => {
    setSelectedVoiceName(name);
    localStorage.setItem('tts-voice', name);
  }, []);

  const speak = useCallback(
    (id: string, text: string, lang: string) => {
      if (!('speechSynthesis' in window)) return;
      if (speakingId === id) {
        window.speechSynthesis.cancel();
        setSpeakingId(null);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = voices.find((v) => v.name === selectedVoiceName);
      if (voice) utterance.voice = voice;
      else utterance.lang = lang;
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      setSpeakingId(id);
      window.speechSynthesis.speak(utterance);
    },
    [speakingId, voices, selectedVoiceName]
  );

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setSpeakingId(null);
  }, []);

  return { voices, selectedVoiceName, selectVoice, speak, speakingId, stop };
}
