/*
 * TransHorizons — Notes & Reflections Index Page
 * Full listing of all notes, with category filter
 */

import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowRight, Clock, ArrowLeft, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Footer from '../components/Footer';
import PortfolioTTSPlayer from '../components/PortfolioTTSPlayer';
import { getNoteText } from '../lib/noteTexts';

type FilterKey = 'all' | 'notes' | 'observations' | 'systems-signals';

export default function NotesIndex() {
  const [, navigate] = useLocation();
  const { t, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const lang = language === 'fr' ? 'fr' : 'en';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const filterLabels: Record<FilterKey, string> = language === 'fr'
    ? {
      all: 'Tout',
      notes: 'Notes',
      observations: 'Observations',
      'systems-signals': 'Systèmes et signaux',
    }
    : {
      all: 'All',
      notes: 'Notes',
      observations: 'Observations',
      'systems-signals': 'Systems & Signals',
    };

  const articles: {
    slug: string;
    filterKey: FilterKey;
    category: string;
    date: string;
    readTime: string;
    title: string;
    excerpt: string;
    image: string;
  }[] = [
      {
        slug: 'career-evolution',
        filterKey: 'notes',
        category: t('blog.careerChange.category'),
        date: t('blog.careerChange.date'),
        readTime: t('blog.careerChange.readTime'),
        title: t('blog.careerChange.title'),
        excerpt: t('blog.careerChange.desc'),
        image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=900&q=80',
      },
      {
        slug: 'travel-observation',
        filterKey: 'observations',
        category: t('blog.travelStories.category'),
        date: t('blog.travelStories.date'),
        readTime: t('blog.travelStories.readTime'),
        title: t('blog.travelStories.title'),
        excerpt: t('blog.travelStories.desc'),
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=700&q=80',
      },
      {
        slug: 'canada-resources',
        filterKey: 'systems-signals',
        category: t('blog.canadaResources.category'),
        date: t('blog.canadaResources.date'),
        readTime: t('blog.canadaResources.readTime'),
        title: t('blog.canadaResources.title'),
        excerpt: t('blog.canadaResources.desc'),
        image: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=700&q=80',
      },
    ];

  const filtered = activeFilter === 'all' ? articles : articles.filter((a) => a.filterKey === activeFilter);
  const filters: FilterKey[] = ['all', 'notes', 'observations', 'systems-signals'];

  return (
    <div className="min-h-screen bg-[#EFEFEF]">
      <div className="relative pt-[20px] pb-10 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/images/portfolio_hero_geopolitical-bright.webp)',
            backgroundPosition: 'center 34%',
            filter: 'brightness(1.18)',
          }}
        />
        <div className="absolute inset-0 bg-[#1A1A1A]/56" />

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-10">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/40 hover:text-white/80 font-body text-[11px] tracking-widest uppercase mb-10 transition-colors"
          >
            <ArrowLeft size={12} />
            {language === 'fr' ? 'Accueil' : 'Home'}
          </button>

          <div className="w-6 h-px bg-[#7D1A2E] mb-6" />
          <h1 className="font-display text-4xl md:text-5xl lg:text-[3.25rem] font-light text-white leading-tight mb-4">
            {t('blog.title')}
          </h1>
          <p className="text-white/50 font-body text-sm md:text-base leading-relaxed max-w-2xl">
            {t('blog.subtitle')}
          </p>
        </div>
      </div>

      <div className="bg-white border-b border-[#C8C8C8]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
            {filters.map((key) => (
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

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((article) => (
            <article
              key={article.slug}
              onClick={() => navigate(`/notes/${article.slug}`)}
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
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="bg-[#7D1A2E]/10 text-[#5C1220] text-[10px] tracking-[0.2em] uppercase font-medium font-body px-2.5 py-1">
                    {article.category}
                  </span>
                  <span className="text-[#AAA] text-[11px] font-body flex items-center gap-1">
                    <Clock size={10} />
                    {article.readTime}
                  </span>
                </div>
                {article.date && (
                  <span className="text-[#AAA] text-[11px] font-body flex items-center gap-1 mb-3">
                    <Calendar size={10} />
                    {article.date}
                  </span>
                )}
                <h2 className="font-display text-xl font-medium text-[#1A1A1A] leading-snug mb-3 group-hover:text-[#7D1A2E] transition-colors duration-300">
                  {article.title}
                </h2>
                <p className="text-[#666] font-body text-sm leading-relaxed mb-6 line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="flex-1" />
                <div className="flex items-center justify-between border-t border-[#E8E8E8] pt-4 w-full">
                  <div className="flex items-center gap-2 text-[#1A1A1A] group-hover:text-[#7D1A2E] transition-colors font-body text-[11px] tracking-widest uppercase font-medium">
                    {language === 'fr' ? 'Lire' : 'Read'}
                    <ArrowRight size={12} />
                  </div>
                  <PortfolioTTSPlayer
                    id={`notes-index-${article.slug}`}
                    text={getNoteText(article.slug, lang) || `${article.title}. ${article.excerpt}`}
                    lang={language === 'fr' ? 'fr-FR' : 'en-CA'}
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
