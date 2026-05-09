/*
 * TransHorizons — Analyses Index Page
 * Full listing of all analytical articles, with multi-category filter + tag search
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowRight, Clock, ArrowLeft, Calendar, Search, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Footer from '../components/Footer';
import ArticleTTSButton from '../components/ArticleTTSButton';
import PortfolioTTSPlayer from '../components/PortfolioTTSPlayer';
import { getArticleText, getArticleDate } from '../lib/articleTexts';

type FilterKey = 'all' | 'systems' | 'geopolitics' | 'resources' | 'technology';

interface Article {
  slug: string;
  /** Primary badge shown on the card */
  primaryCategory: string;
  /** All filter categories this article belongs to — drives category filter */
  filterKeys: FilterKey[];
  /** Free-form tags for keyword search */
  tags: string[];
  readTime: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
}

export default function AnalysesIndex() {
  const [, navigate] = useLocation();
  const { t, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [tagQuery, setTagQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const filterLabels: Record<FilterKey, string> = language === 'fr'
    ? { all: 'Tout', systems: 'Systèmes', geopolitics: 'Géopolitique', resources: 'Ressources', technology: 'Technologie' }
    : { all: 'All', systems: 'Systems', geopolitics: 'Geopolitics', resources: 'Resources', technology: 'Technology' };

  const lang = language === 'fr' ? 'fr' : 'en';

  const articles: Article[] = [
    {
      slug: 'resource-civilization',
      primaryCategory: t('portfolio.resourceCivilization.category'),
      filterKeys: ['systems', 'resources', 'geopolitics'],
      tags: ['civilization', 'Canada', 'resources', 'energy transition', 'supply chains', 'geopolitics', 'critical minerals'],
      readTime: '14 min',
      title: t('portfolio.resourceCivilization.title'),
      excerpt: t('portfolio.resourceCivilization.desc'),
      image: '/images/canada_resource_civilization_map.png',
      date: getArticleDate('resource-civilization', lang),
    },
    {
      slug: 'geopolitics',
      primaryCategory: t('portfolio.geopolitics.category'),
      filterKeys: ['geopolitics', 'systems'],
      tags: ['Canada', 'multipolar', 'foreign policy', 'alliances', 'US-Canada', 'trade', 'sovereignty'],
      readTime: '12 min',
      title: t('portfolio.geopolitics.title'),
      excerpt: t('portfolio.geopolitics.desc'),
      image: '/images/portfolio_geopolitics_hero-UFdGm3fFHZsq5moH7gCbog.webp',
      date: getArticleDate('geopolitics', lang),
    },
    {
      slug: 'resources',
      primaryCategory: t('portfolio.resources.category'),
      filterKeys: ['resources', 'geopolitics'],
      tags: ['critical minerals', 'mining', 'Canada', 'supply chains', 'energy', 'battery metals', 'lithium', 'cobalt', 'nickel'],
      readTime: '10 min',
      title: t('portfolio.resources.title'),
      excerpt: t('portfolio.resources.desc'),
      image: 'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=800&q=80',
      date: getArticleDate('resources', lang),
    },
    {
      slug: 'technology',
      primaryCategory: t('portfolio.technology.category'),
      filterKeys: ['technology', 'geopolitics'],
      tags: ['AI', 'governance', 'digital policy', 'regulation', 'algorithms', 'global standards', 'technology policy'],
      readTime: '13 min',
      title: t('portfolio.technology.title'),
      excerpt: t('portfolio.technology.desc'),
      image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
      date: getArticleDate('technology', lang),
    },
    {
      slug: 'canada-forest-system-climate-industrial-pressure',
      primaryCategory: language === 'fr' ? 'Systèmes' : 'Systems',
      filterKeys: ['systems', 'resources', 'geopolitics'],
      tags: ['forestry', 'Canada', 'climate change', 'wildfire', 'carbon', 'trade', 'industrial policy', 'environment'],
      readTime: '16 min',
      title: language === 'fr'
        ? "Le système forestier canadien sous pression climatique et industrielle"
        : "Canada's Forest System Under Climate and Industrial Pressure",
      excerpt: language === 'fr'
        ? "Examine comment les perturbations climatiques, la structure industrielle et l'intégration géopolitique reconfigurent le système forestier canadien."
        : "Examines how climate-driven disturbances, industrial structure, and geopolitical integration are reshaping Canada's forest system and its role within global resource and trade networks.",
      image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80',
      date: getArticleDate('canada-forest-system-climate-industrial-pressure', lang),
    },
    {
      slug: 'canada-forest-carbon',
      primaryCategory: t('portfolio.forestCarbon.category'),
      filterKeys: ['resources', 'systems'],
      tags: ['carbon markets', 'forestry', 'Canada', 'climate policy', 'net zero', 'offsets', 'environment'],
      readTime: '18 min',
      title: t('portfolio.forestCarbon.title'),
      excerpt: t('portfolio.forestCarbon.desc'),
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663495655297/RcKra6cpkH699NPak8ueHQ/canada-forest-hero-Vv9WznN4NH8b9CsdMBdh8H.webp',
      date: getArticleDate('canada-forest-carbon', lang),
    },
    {
      slug: 'canada-resources',
      primaryCategory: t('portfolio.canadaResources.category'),
      filterKeys: ['resources', 'geopolitics'],
      tags: ['critical minerals', 'Canada', 'lithium', 'cobalt', 'uranium', 'rare earths', 'supply chains', 'US-Canada', 'Indigenous partnerships'],
      readTime: '16 min',
      title: t('portfolio.canadaResources.title'),
      excerpt: t('portfolio.canadaResources.desc'),
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      date: 'February 2026',
    },
  ];

  // Derive all unique tags sorted alphabetically for the tag cloud
  const allTags = useMemo(() => {
    const set = new Set<string>();
    articles.forEach(a => a.tags.forEach(tag => set.add(tag)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [language]);

  // Active tag chips from search box (comma/space-split)
  const activeTagTokens = useMemo(() =>
    tagQuery
      .toLowerCase()
      .split(/[\s,]+/)
      .map(s => s.trim())
      .filter(Boolean),
    [tagQuery]
  );

  const filtered = useMemo(() => {
    return articles.filter(article => {
      // Layer 1: category filter
      const categoryMatch = activeFilter === 'all' || article.filterKeys.includes(activeFilter);
      if (!categoryMatch) return false;

      // Layer 2: tag/keyword search (all tokens must match at least one tag, title, or excerpt)
      if (activeTagTokens.length === 0) return true;
      const searchable = [
        ...article.tags.map(t => t.toLowerCase()),
        article.title.toLowerCase(),
        article.excerpt.toLowerCase(),
      ].join(' ');
      return activeTagTokens.every(token => searchable.includes(token));
    });
  }, [activeFilter, activeTagTokens, language]);

  const filters: FilterKey[] = ['all', 'resources', 'geopolitics', 'systems', 'technology'];

  const isFr = language === 'fr';
  const searchPlaceholder = isFr ? 'Filtrer par mot-clé…' : 'Filter by keyword…';
  const clearLabel = isFr ? 'Effacer' : 'Clear';

  return (
    <div className="min-h-screen bg-[#EFEFEF]">

      {/* Page header — padded for fixed navbar */}
      <div className="relative pt-[20px] pb-10 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(/images/portfolio_hero_geopolitical-mediumdark.webp)',
          }}
        />
        <div className="absolute inset-0 bg-[#1A1A1A]/72" />

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
            {t('analyses.pageTitle')}
          </h1>
          <p className="text-white/50 font-body text-sm md:text-base leading-relaxed max-w-2xl">
            {t('analyses.pageSubtitle')}
          </p>
        </div>
      </div>

      {/* Category filter bar + tag search — sticky below hero */}
      <div className="bg-white border-b border-[#C8C8C8]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          {/* Row 1: category chips */}
          <div className="flex items-center gap-1 overflow-x-auto pt-3 pb-2 scrollbar-hide">
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
              {filtered.length} {isFr ? 'article' : 'article'}{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Row 2: keyword search */}
          <div className="flex items-center gap-3 pb-3">
            <div className="relative flex-1 max-w-xs">
              <Search size={11} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#BBB] pointer-events-none" />
              <input
                ref={searchRef}
                type="text"
                value={tagQuery}
                onChange={e => setTagQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-8 pr-8 py-1.5 font-body text-[11px] bg-[#F6F6F6] border border-[#E0E0E0] text-[#333] placeholder-[#BBB] focus:outline-none focus:border-[#7D1A2E]/50 transition-colors"
              />
              {tagQuery && (
                <button
                  onClick={() => setTagQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#BBB] hover:text-[#7D1A2E] transition-colors"
                  aria-label={clearLabel}
                >
                  <X size={11} />
                </button>
              )}
            </div>

            {/* Active tag chips */}
            {activeTagTokens.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {activeTagTokens.map(token => (
                  <span
                    key={token}
                    className="inline-flex items-center gap-1 bg-[#7D1A2E]/10 text-[#5C1220] font-body text-[9px] tracking-[0.15em] uppercase px-2 py-0.5"
                  >
                    {token}
                  </span>
                ))}
              </div>
            )}
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
                {/* Primary category badge + secondary keys */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="bg-[#7D1A2E]/10 text-[#5C1220] text-[10px] tracking-[0.2em] uppercase font-medium font-body px-2.5 py-1">
                    {article.primaryCategory}
                  </span>
                  {article.filterKeys
                    .filter(k => k !== activeFilter && filterLabels[k] !== article.primaryCategory)
                    .slice(0, 1)
                    .map(k => (
                      <span key={k} className="text-[#AAA] font-body text-[9px] tracking-[0.15em] uppercase">
                        + {filterLabels[k]}
                      </span>
                    ))}
                  <span className="text-[#AAA] text-[11px] font-body flex items-center gap-1">
                    <Clock size={10} />
                    {article.readTime} {isFr ? 'de lecture' : 'read'}
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
                <p className="text-[#666] font-body text-sm leading-relaxed mb-4 line-clamp-3">
                  {article.excerpt}
                </p>

                {/* Tag pills — highlighted if matched by search */}
                {article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {article.tags.slice(0, 5).map(tag => {
                      const hit = activeTagTokens.some(token => tag.toLowerCase().includes(token));
                      return (
                        <button
                          key={tag}
                          onClick={e => { e.stopPropagation(); setTagQuery(tag); }}
                          className={`font-body text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 border transition-colors ${
                            hit
                              ? 'border-[#7D1A2E]/50 bg-[#7D1A2E]/8 text-[#5C1220]'
                              : 'border-[#E0E0E0] text-[#AAA] hover:border-[#7D1A2E]/30 hover:text-[#5C1220]'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                    {article.tags.length > 5 && (
                      <span className="font-body text-[9px] text-[#CCC] self-center">+{article.tags.length - 5}</span>
                    )}
                  </div>
                )}

                <div className="flex-1" />
                <div className="flex items-center justify-between border-t border-[#E8E8E8] pt-4 w-full">
                  <div className="flex items-center gap-2 text-[#1A1A1A] group-hover:text-[#7D1A2E] transition-colors font-body text-[11px] tracking-widest uppercase font-medium">
                    {isFr ? 'Lire' : 'Read'}
                    <ArrowRight size={12} />
                  </div>
                  {getArticleText(article.slug, lang) ? (
                    <PortfolioTTSPlayer
                      id={`analyses-${article.slug}`}
                      text={getArticleText(article.slug, lang)}
                      lang={isFr ? 'fr-FR' : 'en-CA'}
                    />
                  ) : (
                    <ArticleTTSButton
                      id={article.slug}
                      title={article.title}
                      excerpt={article.excerpt}
                      lang={isFr ? 'fr-FR' : 'en-US'}
                    />
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-[#999] font-body py-20">
            {isFr ? 'Aucun article trouvé.' : 'No articles found.'}
          </p>
        )}
      </div>

      <Footer />
    </div>
  );
}
