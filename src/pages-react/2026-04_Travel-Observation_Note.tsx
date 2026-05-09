/*
 * TransHorizons - Notes: Travel Observation
 * Content loaded from bilingual YAML - edit at /keystatic
 */

import { Fragment, ReactNode } from 'react';
import NotesDetailLayout from '../components/NotesDetailLayout';
import { useLanguage } from '../contexts/LanguageContext';
import data from '../../content/articles/2026-04_Travel-Observation_Note.yaml';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const d = data as Record<string, any>;

function cleanForTTS(text: string): string {
  return text
    .replace(/â€¢|•/g, ',')
    .replace(/\n\n+/g, '. ')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildNoteAudioText(language: 'en' | 'fr'): string {
  const parts: string[] = [];
  if (d[`title_${language}`]) parts.push(cleanForTTS(d[`title_${language}`]));
  if (d[`introductionTitle_${language}`]) parts.push(cleanForTTS(d[`introductionTitle_${language}`]));
  if (d[`introduction_${language}`]) parts.push(cleanForTTS(d[`introduction_${language}`]));

  for (const k of (d.keyTakeaways ?? [])) {
    if (k[`description_${language}`]) parts.push(cleanForTTS(k[`description_${language}`]));
  }

  for (const s of (d.sections ?? [])) {
    if (s[`title_${language}`]) parts.push(cleanForTTS(s[`title_${language}`]));
    if (s[`content_${language}`]) parts.push(cleanForTTS(s[`content_${language}`]));
  }

  return parts.join('. ');
}

function renderTextBlock(text: string, emphasizedFirstParagraph = false): ReactNode[] {
  const blocks = text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks.map((block, index) => {
    const lines = block.split('\n').map((line) => line.trim()).filter(Boolean);
    const bulletLines = lines.filter((line) => line.startsWith('â€¢'));

    if (bulletLines.length === lines.length) {
      return (
        <ul key={`list-${index}`} className="space-y-2 text-charcoal/80 ml-6 mb-6">
          {bulletLines.map((line, itemIndex) => (
            <li key={`item-${itemIndex}`} className="flex gap-3">
              <span className="text-sand font-bold">â€¢</span>
              <span>{line.replace(/^â€¢\s*/, '')}</span>
            </li>
          ))}
        </ul>
      );
    }

    return (
      <p
        key={`paragraph-${index}`}
        className={index === 0 && emphasizedFirstParagraph ? 'text-lg text-charcoal/80 leading-relaxed' : 'text-charcoal/80 leading-relaxed'}
      >
        {lines.join(' ')}
      </p>
    );
  });
}

function NotesContent({ language }: { language: 'en' | 'fr' }) {
  const title = d[`title_${language}`] ?? '';
  const introductionTitle = d[`introductionTitle_${language}`] ?? '';
  const introduction = d[`introduction_${language}`] ?? '';
  const reflections = (d.keyTakeaways ?? []).map((item: Record<string, string>) => item[`description_${language}`] ?? '').filter(Boolean);
  const sections = (d.sections ?? []).map((section: Record<string, string>) => ({
    title: section[`title_${language}`] ?? '',
    content: section[`content_${language}`] ?? '',
    image: section.image,
  }));

  return (
    <div className="space-y-8">
      <h1 className="font-playfair text-4xl font-bold text-charcoal mb-2">Notes</h1>
      <h2 className="font-playfair text-3xl font-semibold text-charcoal mb-8 text-charcoal/70">{title}</h2>

      {reflections.length > 0 && (
        <div className="bg-ivory p-6 rounded-lg mb-8 border-l-4 border-sand">
          <h3 className="font-playfair text-2xl font-bold text-charcoal mb-4">{introductionTitle}</h3>
          <ul className="space-y-3 text-charcoal/80">
            {reflections.map((reflection: string, index: number) => (
              <li key={index} className="flex gap-3">
                <span className="text-sand font-bold">â€¢</span>
                <span>{reflection}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {renderTextBlock(introduction, true)}

      {sections.map((section: { title: string; content: string; image?: string }, index: number) => (
        <Fragment key={`${section.title}-${index}`}>
          <hr className="my-8 border-sand/30" />
          {section.image && (
            <img src={section.image} alt={section.title} className="w-full rounded-lg my-8" />
          )}
          <h2 className="font-playfair text-3xl font-bold text-charcoal mt-12">{section.title}</h2>
          {renderTextBlock(section.content)}
        </Fragment>
      ))}
    </div>
  );
}

export default function NotesTravelObservation() {
  const { language } = useLanguage();
  const L = language === 'fr' ? 'fr' : 'en';

  return (
    <NotesDetailLayout
      title={d[`title_${L}`] ?? ''}
      category={d[`category_${L}`] ?? 'Observations'}
      readTime={L === 'fr' ? '10 min de lecture' : d.readTime ?? ''}
      date={d.date ?? ''}
      heroImage={d.heroImage ?? ''}
      content={<NotesContent language={L} />}
      language={L}
      audioId={`notes-${d.slug ?? 'travel-observation'}`}
      audioText={buildNoteAudioText(L)}
    />
  );
}

