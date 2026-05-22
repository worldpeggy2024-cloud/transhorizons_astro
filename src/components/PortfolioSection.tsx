/*
 * TransHorizons — Portfolio Section
 * Design: Light ivory background, editorial grid, gold accents
 * Title: "Geopolitics. Resources. Technology."
 */

import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowRight, Clock, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import PortfolioTTSPlayer from './PortfolioTTSPlayer';
import { getArticleText, getArticleDate } from '../lib/articleTexts';

// portfolioItems are now built inside the component using translation keys

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

export default function PortfolioSection() {
  const { ref, inView } = useInView();
  const [, navigate] = useLocation();
  const { t, language } = useLanguage();
  const lang = language === 'fr' ? 'fr' : 'en';

  // Slugs are always English for routing; display labels come from translations
  const portfolioItems = [
    {
      slug: 'resource-civilization',
      category: t('portfolio.resourceCivilization.category'),
      readTime: '14 min',
      title: t('portfolio.resourceCivilization.title'),
      description: t('portfolio.resourceCivilization.desc'),
      image: '/images/canada_resource_civilization_map.png',
      date: getArticleDate('resource-civilization', lang),
    },
    {
      slug: 'canada-multipolar',
      category: t('portfolio.geopolitics.category'),
      readTime: '12 min',
      title: t('portfolio.geopolitics.title'),
      description: t('portfolio.geopolitics.desc'),
      image: '/images/portfolio_geopolitics_hero-UFdGm3fFHZsq5moH7gCbog.webp',
      date: getArticleDate('canada-multipolar', lang),
    },
    {
      slug: 'critical-minerals',
      category: t('portfolio.resources.category'),
      readTime: '10 min',
      title: t('portfolio.resources.title'),
      description: t('portfolio.resources.desc'),
      image: 'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=600&q=80',
      date: getArticleDate('critical-minerals', lang),
    },
    {
      slug: 'ai-governance',
      category: t('portfolio.technology.category'),
      readTime: '13 min',
      title: t('portfolio.technology.title'),
      description: t('portfolio.technology.desc'),
      image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
      date: getArticleDate('ai-governance', lang),
    },
    {
      slug: 'canada-forest-system-climate-industrial-pressure',
      category: lang === 'fr' ? 'Systèmes' : 'Systems',
      readTime: '16 min',
      title: lang === 'fr'
        ? "Le système forestier du Canada sous pressions climatiques et industrielles"
        : "Canada's Forest System Under Climate and Industrial Pressure",
      description: lang === 'fr'
        ? "Examine comment les perturbations climatiques, l'organisation du secteur forestier et l'intégration géopolitique reconfigurent le système forestier du Canada."
        : "Examines how climate-driven disturbances, forest-sector organization, and geopolitical integration are reshaping Canada's forest system and its role within global resource and trade networks.",
      image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80',
      date: getArticleDate('canada-forest-system-climate-industrial-pressure', lang),
    },
  ];

  const otherArticles = [
    {
      slug: 'canada-forest-carbon',
      category: t('portfolio.forestCarbon.category'),
      title: t('portfolio.forestCarbon.title'),
      date: getArticleDate('canada-forest-carbon', lang),
    },
    {
      slug: 'canada-resources',
      category: t('portfolio.canadaResources.category'),
      title: t('portfolio.canadaResources.title'),
      date: 'February 2026',
    },
  ];

  const handlePortfolioClick = (slug: string) => {
    navigate(`/portfolio/${slug}`);
  };

  return (
    <section id="portfolio" className="bg-[#EFEFEF] py-12 lg:py-16" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div
          className={`mb-16 transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-6 h-px bg-[#7D1A2E]" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-[3.5rem] font-light text-[#1A1A1A] leading-tight mb-8">
            {t('portfolio.title')}
          </h2>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <p className="text-[#666] font-body text-base leading-relaxed max-w-xl">
              {t('portfolio.intro')}
            </p>
            <button
              onClick={() => navigate('/analyses')}
              className="btn-outline-dark self-start md:self-auto whitespace-nowrap flex items-center gap-2"
            >
              {t('portfolio.viewAll')}
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioItems.map((item, i) => (
              <article
                key={item.slug}
                onClick={() => handlePortfolioClick(item.slug)}
                className={`group bg-white border border-[#C8C8C8] overflow-hidden flex flex-col transition-all duration-700 hover:shadow-xl hover:-translate-y-1 cursor-pointer ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                {/* Image */}
                <div className="img-zoom h-48 bg-[#C8C8C8] overflow-hidden shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="bg-[#7D1A2E]/15 text-[#5C1220] text-[10px] tracking-[0.2em] uppercase font-medium font-body px-2.5 py-1">
                      {item.category}
                    </span>
                    <span className="text-[#AAA] text-[11px] font-body flex items-center gap-1">
                      <Clock size={10} />
                      {item.readTime} {t('featuredAnalysis.read')}
                    </span>
                  </div>
                  {item.date && (
                    <span className="text-[#AAA] text-[11px] font-body flex items-center gap-1 mb-3">
                      <Calendar size={10} />
                      {item.date}
                    </span>
                  )}
                  <h3 className="font-display text-xl font-medium text-[#1A1A1A] mb-3 leading-snug group-hover:text-[#7D1A2E] transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-[#777] text-sm leading-relaxed font-body mb-5">
                    {item.description}
                  </p>
                  <div className="flex-1" />
                </div>

                {/* Bottom bar */}
                <div className="px-6 pb-5">
                  <div className="flex items-center justify-end pt-4 border-t border-[#C8C8C8]">
                    <div className="flex items-center gap-1.5 text-[#1A1A1A] group-hover:text-[#7D1A2E] transition-colors text-[10px] tracking-widest uppercase font-body font-medium">
                      {t('portfolio.readBrief')}
                      <ArrowRight size={12} />
                    </div>
                  </div>
                  <PortfolioTTSPlayer
                    id={`portfolio-${item.slug}`}
                    text={getArticleText(item.slug, lang)}
                    lang={lang === 'fr' ? 'fr-FR' : 'en-CA'}
                  />
                </div>
              </article>
          ))}
        </div>

        {/* Other articles — compact list */}
        <div className="mt-8 border-t border-[#C8C8C8] pt-6">
          <p className="text-[#999] text-[10px] tracking-[0.2em] uppercase font-body mb-4">
            {lang === 'fr' ? 'Également dans ce portfolio' : 'Also in this portfolio'}
          </p>
          <div className="flex flex-col gap-0 divide-y divide-[#E8E8E8]">
            {otherArticles.map((article) => (
              <button
                key={article.slug}
                onClick={() => navigate(`/portfolio/${article.slug}`)}
                className="group flex items-center justify-between py-3 text-left hover:bg-[#F5F5F5] -mx-3 px-3 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="bg-[#7D1A2E]/10 text-[#5C1220] text-[9px] tracking-[0.15em] uppercase font-medium font-body px-2 py-0.5 shrink-0">
                    {article.category}
                  </span>
                  <span className="font-display text-sm text-[#1A1A1A] group-hover:text-[#7D1A2E] transition-colors truncate">
                    {article.title}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  {article.date && (
                    <span className="text-[#AAA] text-[11px] font-body hidden sm:block">{article.date}</span>
                  )}
                  <ArrowRight size={12} className="text-[#AAA] group-hover:text-[#7D1A2E] transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
