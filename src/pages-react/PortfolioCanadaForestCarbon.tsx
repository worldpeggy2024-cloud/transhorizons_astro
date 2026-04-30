/*
 * TransHorizons â€” Portfolio: Net Carbon Effect of Canadian Forest Ecosystems
 * Content loaded from bilingual YAML - edit at /keystatic
 */

import ProjectDetailLayout from '@/components/ProjectDetailLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import data from '../../content/articles/canada-forest-carbon.yaml';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const d = data as Record<string, any>;

export default function PortfolioCanadaForestCarbon() {
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

  const sourcesLabel = L === 'fr' ? 'Sources institutionnelles' : 'Institutional Sources';
  const sourcesContent: string[] = d.sources?.[L] ?? d[`sources_${L}`] ?? d.sources_en ?? [];
  const sourcesDisclaimer = d.sources?.[`disclaimer_${L}`] ?? d[`sourcesDisclaimer_${L}`] ?? '';

  return (
    <>
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
      {/* Sources Section */}
      <div className="bg-[#F5F3F0] py-12 px-6 border-t border-[#C8C8C8]">
        <div className="max-w-[1000px] mx-auto">
          <h3 className="font-display text-2xl font-light text-[#1A1A1A] mb-8">{sourcesLabel}</h3>
          <div className="space-y-3">
            {sourcesContent.map((source, idx) => (
              <p key={idx} className="text-[#555] font-body text-sm leading-relaxed pl-4 border-l-2 border-[#7D1A2E]/30">
                {source}
              </p>
            ))}
          </div>
          <p className="mt-8 text-[#999] font-body text-xs italic">
            {sourcesDisclaimer}
          </p>
        </div>
      </div>
    </>
  );
}
