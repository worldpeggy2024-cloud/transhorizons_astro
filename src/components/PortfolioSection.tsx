/*
 * TransHorizons — Portfolio Section
 * Design: Light ivory background, editorial grid, gold accents
 * Title: "Geopolitics. Resources. Technology."
 */

import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowRight, Globe, Mountain, Flame } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

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
  const { t } = useLanguage();

  // Slugs are always English for routing; display labels come from translations
  const portfolioItems = [
    {
      id: '01',
      slug: 'geopolitics',
      category: t('portfolio.geopolitics.category'),
      icon: Globe,
      title: t('portfolio.geopolitics.title'),
      description: t('portfolio.geopolitics.desc'),
      tags: t('portfolio.geopolitics.tags').split('|'),
      image: '/images/portfolio_geopolitics_hero-UFdGm3fFHZsq5moH7gCbog.webp',
    },
    {
      id: '02',
      slug: 'resources',
      category: t('portfolio.resources.category'),
      icon: Mountain,
      title: t('portfolio.resources.title'),
      description: t('portfolio.resources.desc'),
      tags: t('portfolio.resources.tags').split('|'),
      image: 'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=600&q=80',
    },
    {
      id: '03',
      slug: 'canada-forest-carbon',
      category: t('portfolio.forestCarbon.category'),
      icon: Flame,
      title: t('portfolio.forestCarbon.title'),
      description: t('portfolio.forestCarbon.desc'),
      tags: t('portfolio.forestCarbon.tags').split('|'),
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663495655297/RcKra6cpkH699NPak8ueHQ/canada-forest-hero-Vv9WznN4NH8b9CsdMBdh8H.webp',
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
          {portfolioItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <article
                key={item.id}
                onClick={() => handlePortfolioClick(item.slug)}
                className={`group bg-white border border-[#C8C8C8] overflow-hidden transition-all duration-700 hover:shadow-xl hover:-translate-y-1 cursor-pointer ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                {/* Image */}
                <div className="img-zoom h-52 bg-[#C8C8C8] overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Category overlay */}
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3 py-1.5">
                      <Icon size={11} className="text-[#7D1A2E]" />
                      <span className="text-[#1A1A1A] text-[9px] tracking-[0.2em] uppercase font-medium font-body">
                        {item.category.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-display text-xl font-medium text-[#1A1A1A] mb-3 leading-snug group-hover:text-[#7D1A2E] transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-[#777] text-sm leading-relaxed font-body mb-5">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] tracking-wider uppercase font-medium text-[#999] border border-[#C8C8C8] px-2 py-1 font-body"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom bar */}
                <div className="px-6 pb-5">
                  <div className="flex items-center justify-between pt-4 border-t border-[#C8C8C8]">
                    <span className="text-[#7D1A2E] text-xs font-mono font-light">{item.id}</span>
                    <div className="flex items-center gap-1.5 text-[#1A1A1A] group-hover:text-[#7D1A2E] transition-colors text-[10px] tracking-widest uppercase font-body font-medium">
                      {t('portfolio.readBrief')}
                      <ArrowRight size={12} />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
