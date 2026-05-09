/**
 * noteTexts - Registry of full note text for card-level TTS playback.
 */

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import careerRaw from '../../content/articles/2026-03_Career-Evolution_Note.yaml';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import travelRaw from '../../content/articles/2026-04_Travel-Observation_Note.yaml';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NoteData = Record<string, any>;

function cleanForTTS(text: string): string {
  return text
    .replace(/â€¢|•/g, ',')
    .replace(/\n\n+/g, '. ')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildNoteText(data: NoteData, lang: 'en' | 'fr'): string {
  const parts: string[] = [];
  if (data[`title_${lang}`]) parts.push(cleanForTTS(data[`title_${lang}`]));
  if (data[`subtitle_${lang}`]) parts.push(cleanForTTS(data[`subtitle_${lang}`]));
  if (data[`introductionTitle_${lang}`]) parts.push(cleanForTTS(data[`introductionTitle_${lang}`]));
  if (data[`introduction_${lang}`]) parts.push(cleanForTTS(data[`introduction_${lang}`]));

  for (const s of (data.sections ?? [])) {
    if (s[`title_${lang}`]) parts.push(cleanForTTS(s[`title_${lang}`]));
    if (s[`content_${lang}`]) parts.push(cleanForTTS(s[`content_${lang}`]));
  }

  for (const k of (data.keyTakeaways ?? [])) {
    if (k[`description_${lang}`]) parts.push(cleanForTTS(k[`description_${lang}`]));
  }

  return parts.join('. ');
}

const REGISTRY: Record<string, NoteData> = {
  'career-evolution': careerRaw,
  'travel-observation': travelRaw,
};

export function getNoteText(slug: string, lang: 'en' | 'fr'): string {
  const data = REGISTRY[slug];
  if (!data) return '';
  return buildNoteText(data, lang);
}
