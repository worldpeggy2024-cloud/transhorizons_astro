/*
 * TransHorizons — Analyses Index Page
 * Full listing of all analytical articles, with category filter
 */

import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowRight, Clock, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Footer from '../components/Footer';
import ArticleTTSButton from '../components/ArticleTTSButton';

type FilterKey = 'all' | 'analysis' | 'geopolitics' | 'resources' | 'technology';

export default function AnalysesIndex() {
  const [, navigate] = useLocation();
  const { t, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const filterLabels: Record<FilterKey, string> = language === 'fr'
    ? { all: 'Tout', analysis: 'Analyse', geopolitics: 'Géopolitique', resources: 'Ressources', technology: 'Technologie' }
    : { all: 'All', analysis: 'Analysis', geopolitics: 'Geopolitics', resources: 'Resources', technology: 'Technology' };

  const articles: {
    slug: string;
    filterKey: FilterKey;
    category: string;
    readTime: string;
    title: string;
    excerpt: string;
    image: string;
    date: string;
  }[] = [
    {
      slug: 'canada-forest-system-climate-industrial-pressure',
      filterKey: 'analysis',
      category: language === 'fr' ? 'Analyse' : 'Analysis',
      readTime: '16 min',
      title: language === 'fr'
        ? 'Canada\'s Forest System Under Climate and Industrial Pressure'
        : 'Canada\'s Forest System Under Climate and Industrial Pressure',
      excerpt: language === 'fr'
        ? 'Examines how climate-driven disturbances, industrial structure, and geopolitical integration are reshaping Canada\'s forest system and its role within global resource and trade networks.'
        : 'Examines how climate-driven disturbances, industrial structure, and geopolitical integration are reshaping Canada\'s forest system and its role within global resource and trade networks.',
      image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80',
      date: 'April 2026',
    },
    {
      slug: 'canada-forest-carbon',
      filterKey: 'resources',
      category: t('portfolio.forestCarbon.category'),
      readTime: '18 min',
      title: t('portfolio.forestCarbon.title'),
      excerpt: t('portfolio.forestCarbon.desc'),
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663495655297/RcKra6cpkH699NPak8ueHQ/canada-forest-hero-Vv9WznN4NH8b9CsdMBdh8H.webp',
      date: 'April 2026',
    },
    {
      slug: 'resource-civilization',
      filterKey: 'analysis',
      category: t('portfolio.resourceCivilization.category'),
      readTime: '14 min',
      title: t('portfolio.resourceCivilization.title'),
      excerpt: t('portfolio.resourceCivilization.desc'),
      image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80',
      date: 'March 2026',
    },
    {
      slug: 'canada-resources',
      filterKey: 'analysis',
      category: t('portfolio.canadaResources.category'),
      readTime: '16 min',
      title: t('portfolio.canadaResources.title'),
      excerpt: t('portfolio.canadaResources.desc'),
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      date: 'February 2026',
    },
    {
      slug: 'technology',
      filterKey: 'technology',
      category: t('portfolio.technology.category'),
      readTime: '13 min',
      title: t('portfolio.technology.title'),
      excerpt: t('portfolio.technology.desc'),
      image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
      date: 'February 2026',
    },
    {
      slug: 'resources',
      filterKey: 'resources',
      category: t('portfolio.resources.category'),
      readTime: '10 min',
      title: t('portfolio.resources.title'),
      excerpt: t('portfolio.resources.desc'),
      image: 'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=800&q=80',
      date: 'January 2026',
    },
    {
      slug: 'geopolitics',
      filterKey: 'geopolitics',
      category: t('portfolio.geopolitics.category'),
      readTime: '12 min',
      title: t('portfolio.geopolitics.title'),
      excerpt: t('portfolio.geopolitics.desc'),
      image: '/images/portfolio_geopolitics_hero-UFdGm3fFHZsq5moH7gCbog.webp',
      date: 'January 2026',
    },
  ];

  const filtered = activeFilter === 'all' ? articles : articles.filter(a => a.filterKey === activeFilter);

  const filters: FilterKey[] = ['all', 'analysis', 'resources', 'geopolitics', 'technology'];

  return (
    <div className="min-h-screen bg-[#EFEFEF]">

      {/* Page header — padded for fixed navbar */}
      <div className="bg-[#1A1A1A] pt-[90px] pb-14">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/40 hover:text-white/80 font-body text-[11px] tracking-widest uppercase mb-10 transition-colors"
          >
            <ArrowLeft size={12} />
            {language === 'fr' ? 'Accueil' : 'Home'}
          </button>

          <div className="w-6 h-px bg-[#7D1A2E] mb-6" />
          <h1 className="font-display text-4xl md:text-5xl lg:text-[3.25rem] font-light text-white leading-tight mb-4">
            {t('analyses.pageTitle')}
          </h1>
          <p className="text-white/50 font-body text-sm md:text-base leading-relaxed max-w-2xl">
            {t('analyses.pageSubtitle')}
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white border-b border-[#C8C8C8] sticky top-[80px] md:top-[90px] z-30">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
            {filters.map(key => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`flex-shrink-0 font-body text-[10px] tracking-[0.18em] uppercase px-4 py-2 transition-all duration-200 ${
                  activeFilter === key
                    ? 'bg-[#1A1A1A] text-white'
                    : 'text-[#666] hover:text-[#1A1A1A] hover:bg-[#F0F0F0]'
                }`}
              >
                {filterLabels[key]}
              </button>
            ))}
            <span className="ml-auto flex-shrink-0 text-[#999] font-body text-[10px] tracking-widest pl-4 whitespace-nowrap">
              {filtered.length} {language === 'fr' ? 'article' : 'article'}{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Articles grid */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((article) => (
            <article
              key={article.slug}
              onClick={() => navigate(`/portfolio/${article.slug}`)}
              className="group bg-white border border-[#C8C8C8] overflow-hidden flex flex-col cursor-pointer hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="h-52 overflow-hidden shrink-0">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="bg-[#7D1A2E]/10 text-[#5C1220] text-[10px] tracking-[0.2em] uppercase font-medium font-body px-2.5 py-1">
                    {article.category}
                  </span>
                  <span className="text-[#AAA] text-[11px] font-body flex items-center gap-1">
                    <Clock size={10} />
                    {article.readTime} {language === 'fr' ? 'de lecture' : 'read'}
                  </span>
                  <span className="text-[#BBB] text-[10px] font-body ml-auto">
                    {article.date}
                  </span>
                </div>
                <h2 className="font-display text-xl font-medium text-[#1A1A1A] leading-snug mb-3 group-hover:text-[#7D1A2E] transition-colors duration-300 flex-1">
                  {article.title}
                </h2>
                <p className="text-[#666] font-body text-sm leading-relaxed mb-6 line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between border-t border-[#E8E8E8] pt-4 w-full">
                  <div className="flex items-center gap-2 text-[#1A1A1A] group-hover:text-[#7D1A2E] transition-colors font-body text-[11px] tracking-widest uppercase font-medium">
                    {language === 'fr' ? 'Lire' : 'Read'}
                    <ArrowRight size={12} />
                  </div>
                  <ArticleTTSButton
                    id={article.slug}
                    title={article.title}
                    excerpt={article.excerpt}
                    lang={language === 'fr' ? 'fr-FR' : 'en-US'}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-[#999] font-body py-20">
            {language === 'fr' ? 'Aucun article dans cette catégorie.' : 'No articles in this category.'}
          </p>
        )}
      </div>

      <Footer />
    </div>
  );
}
