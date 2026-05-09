/**
 * articleTexts — Central registry of full article text for TTS playback.
 * Imports all article YAMLs at build time and exposes getArticleText(slug, lang).
 */

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import geopoliticsRaw from '../../content/articles/2026-03_Canada-Multipolar_Essay.yaml';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import resourcesRaw from '../../content/articles/2026-02_Critical-Minerals_Essay.yaml';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import forestCarbonRaw from '../../content/articles/2026-04_Canada-Forest-Carbon_Essay.yaml';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import resourceCivilizationRaw from '../../content/articles/2026-04_Resource-Civilization_Essay.yaml';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import technologyRaw from '../../content/articles/2026-01_AI-Governance_Essay.yaml';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import forestSystemRaw from '../../content/articles/2026-04_Canada-Forest-System_Essay.yaml';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ArticleData = Record<string, any>;

function cleanForTTS(text: string): string {
  return text
    .replace(/•/g, ',')
    .replace(/\n\n+/g, '. ')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function buildArticleText(data: ArticleData, lang: 'en' | 'fr'): string {
  const parts: string[] = [];
  if (data[`title_${lang}`]) parts.push(cleanForTTS(data[`title_${lang}`]));
  if (data[`subtitle_${lang}`]) parts.push(cleanForTTS(data[`subtitle_${lang}`]));
  if (data[`introduction_${lang}`]?.trim()) parts.push(cleanForTTS(data[`introduction_${lang}`]));
  for (const s of (data.sections ?? [])) {
    if (s[`title_${lang}`]) parts.push(cleanForTTS(s[`title_${lang}`]));
    if (s[`content_${lang}`]) parts.push(cleanForTTS(s[`content_${lang}`]));
  }
  for (const k of (data.keyTakeaways ?? [])) {
    if (k[`title_${lang}`]) parts.push(cleanForTTS(k[`title_${lang}`]));
    if (k[`description_${lang}`]) parts.push(cleanForTTS(k[`description_${lang}`]));
  }
  return parts.join('. ');
}

/** Build TTS text from already-resolved props (used by ProjectDetailLayout). */
export function buildArticleTextFromProps(
  title: string,
  subtitle: string,
  introduction: string,
  sections: Array<{ title: string; content: string }>,
  keyTakeaways: Array<{ title: string; description: string }>,
): string {
  const parts: string[] = [];
  if (title) parts.push(cleanForTTS(title));
  if (subtitle) parts.push(cleanForTTS(subtitle));
  if (introduction?.trim()) parts.push(cleanForTTS(introduction));
  for (const s of sections) {
    if (s.title) parts.push(cleanForTTS(s.title));
    if (s.content) parts.push(cleanForTTS(s.content));
  }
  for (const k of keyTakeaways) {
    if (k.title) parts.push(cleanForTTS(k.title));
    if (k.description) parts.push(cleanForTTS(k.description));
  }
  return parts.join('. ');
}

const REGISTRY: Record<string, ArticleData> = {
  'geopolitics': geopoliticsRaw,
  'resources': resourcesRaw,
  'canada-forest-carbon': forestCarbonRaw,
  'resource-civilization': resourceCivilizationRaw,
  'technology': technologyRaw,
  'canada-forest-system-climate-industrial-pressure': forestSystemRaw,
};

/** Returns the full TTS text for a given article slug and language, or '' if not found. */
export function getArticleText(slug: string, lang: 'en' | 'fr'): string {
  const data = REGISTRY[slug];
  if (!data) return '';
  return buildArticleText(data, lang);
}

/**
 * Returns the publication date for a given slug/lang.
 * Handles bilingual entries like "Avril / April 2026" → EN "April 2026", FR "Avril 2026".
 */
export function getArticleDate(slug: string, lang: 'en' | 'fr'): string {
  const data = REGISTRY[slug];
  if (!data || !data.date) return '';
  const raw: string = String(data.date);
  if (!raw.includes(' / ')) return raw;
  const [frPart, enPart] = raw.split(' / ').map(s => s.trim());
  if (lang === 'en') return enPart;
  // Append year to FR part if missing
  const yearMatch = enPart.match(/\d{4}/);
  if (yearMatch && !frPart.includes(yearMatch[0])) return `${frPart} ${yearMatch[0]}`;
  return frPart;
}
