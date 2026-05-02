/*
 * TransHorizons — Featured Analysis Section
 * Design: Warm ivory background, editorial card layout
 * Layout: 3 equal vertical cards side by side
 */

import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowRight, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import ArticleTTSButton from './ArticleTTSButton';

function useInView(threshold = 0.1) {
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

export default function FeaturedAnalysisSection() {
  const { ref, inView } = useInView();
  const [, navigate] = useLocation();
  const { t, language } = useLanguage();

  const articles = [
    {
      slug: 'resource-civilization',
      category: t('portfolio.resourceCivilization.category'),
      readTime: '14 min',
      title: t('portfolio.resourceCivilization.title'),
      excerpt: t('portfolio.resourceCivilization.desc'),
      image: '/images/canada_resource_civilization_map.png',
    },
    {
      slug: 'geopolitics',
      category: t('portfolio.geopolitics.category'),
      readTime: '12 min',
      title: t('portfolio.geopolitics.title'),
      excerpt: t('portfolio.geopolitics.desc'),
      image: '/images/portfolio_geopolitics_hero-UFdGm3fFHZsq5moH7gCbog.webp',
    },
    {
      slug: 'resources',
      category: t('portfolio.resources.category'),
      readTime: '10 min',
      title: t('portfolio.resources.title'),
      excerpt: t('portfolio.resources.desc'),
      image: 'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=800&q=80',
    },
  ];

  return (
    <section id="featured-analysis" className="bg-[#F0EBE3] py-12 lg:py-16" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">

        {/* Header */}
        <div
          className={`mb-8 transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-6 h-px bg-[#7D1A2E]" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-light text-[#1A1A1A] leading-tight mb-3">
            {t('featuredAnalysis.title')}
          </h2>
          <p className="text-[#1A1A1A]/60 font-body text-sm md:text-base leading-relaxed max-w-2xl">
            {t('featuredAnalysis.subtitle')}
          </p>
        </div>

        {/* 3-column equal grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <article
              key={article.slug}
              onClick={() => navigate(`/portfolio/${article.slug}`)}
              className={`group bg-white border border-[#D4CDC5] overflow-hidden flex flex-col cursor-pointer transition-all duration-700 hover:shadow-xl hover:-translate-y-0.5 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="img-zoom h-52 overflow-hidden shrink-0">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="bg-[#7D1A2E]/15 text-[#5C1220] text-[10px] tracking-[0.2em] uppercase font-medium font-body px-2.5 py-1">
                    {article.category}
                  </span>
                  <span className="text-[#AAA] text-[11px] font-body flex items-center gap-1">
                    <Clock size={10} />
                    {article.readTime} {t('featuredAnalysis.read')}
                  </span>
                </div>
                <h3 className="font-display text-xl font-medium text-[#1A1A1A] leading-snug mb-3 group-hover:text-[#7D1A2E] transition-colors duration-300 flex-1">
                  {article.title}
                </h3>
                <p className="text-[#666] font-body text-sm leading-relaxed mb-6 line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between border-t border-[#E5DDD5] pt-4 w-full mt-auto">
                  <div className="flex items-center gap-2 text-[#1A1A1A] group-hover:text-[#7D1A2E] transition-colors font-body text-[11px] tracking-widest uppercase font-medium">
                    {t('featuredAnalysis.readMore')}
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

      </div>
    </section>
  );
}
