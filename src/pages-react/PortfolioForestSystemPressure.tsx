/*
 * TransHorizons - Portfolio: Canada's Forest System Under Climate and Industrial Pressure
 * Content loaded from bilingual YAML - edit at /keystatic
 */

import ProjectDetailLayout from '@/components/ProjectDetailLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import data from '../../content/articles/canada-forest-system-climate-industrial-pressure.yaml';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const d = data as Record<string, any>;

export default function PortfolioForestSystemPressure() {
  const { language } = useLanguage();
  const L = language === 'fr' ? 'fr' : 'en';

  const sections = (d.sections ?? []).map((s: Record<string, string>) => ({
    title: s[`title_${L}`] ?? s.title_en ?? '',
    content: s[`content_${L}`] ?? s.content_en ?? '',
    image: s.image,
    imagePosition: s.imagePosition,
  }));

  const keyTakeaways = (d.keyTakeaways ?? []).map((k: Record<string, string>) => ({
    title: k[`title_${L}`] ?? k.title_en ?? '',
    description: k[`description_${L}`] ?? k.description_en ?? '',
  }));

  const relatedProjects = (d.relatedProjects ?? []).map((r: Record<string, string>) => ({
    id: r.id,
    title: r[`title_${L}`] ?? r.title_en ?? '',
    category: r[`category_${L}`] ?? r.category_en ?? '',
  }));

  return (
    <ProjectDetailLayout
      title={d[`title_${L}`] ?? ''}
      subtitle={d[`subtitle_${L}`] ?? ''}
      heroImage={d.heroImage ?? ''}
      category={d[`category_${L}`] ?? ''}
      date={d.date ?? ''}
      readTime={d.readTime ?? ''}
      articleType={d[`articleType_${L}`]}
      introductionTitle={d[`introductionTitle_${L}`]}
      introduction={d[`introduction_${L}`] ?? ''}
      sections={sections}
      keyTakeaways={keyTakeaways}
      relatedProjects={relatedProjects}
    />
  );
}
