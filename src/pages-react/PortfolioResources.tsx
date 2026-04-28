/*
 * TransHorizons - Portfolio: Critical Minerals & the Energy Transition
 * Content loaded from bilingual YAML - edit at /keystatic
 */

import { Link } from 'wouter';
import ProjectDetailLayout from '@/components/ProjectDetailLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import data from '../../content/articles/critical-minerals-energy-transition.yaml';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const d = data as Record<string, any>;

export default function PortfolioResources() {
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

  const mapLabel = L === 'fr'
    ? 'Voir la carte interactive des min\u00E9raux critiques \u2192'
    : 'Explore the Interactive Critical Minerals World Map \u2192';
  const mapSub = L === 'fr'
    ? 'Production et r\u00E9serves par pays \u00B7 11 min\u00E9raux \u00B7 Sources\u00A0: USGS MCS 2025, Our World in Data 2026'
    : 'Production & reserves by country \u00B7 11 minerals \u00B7 Sources: USGS MCS 2025, Our World in Data 2026';

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
      {/* Map CTA */}
      <div className="bg-slate-900 py-10 px-6 text-center">
        <Link
          href="/tools/critical-minerals-map"
          className="inline-block bg-emerald-700 hover:bg-emerald-600 text-white font-semibold px-8 py-4 rounded-lg transition-colors text-base shadow-lg"
        >
          {mapLabel}
        </Link>
        <p className="mt-3 text-slate-500 text-xs">{mapSub}</p>
      </div>
    </>
  );
}