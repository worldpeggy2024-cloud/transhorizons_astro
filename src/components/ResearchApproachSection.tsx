/*
 * TransHorizons — Research Approach Section
 * Design: Editorial Horizon — positioned below Portfolio section
 * Features: Subtitle, description, and "Explore Research Approach" button
 */

import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowRight } from 'lucide-react';

export default function ResearchApproachSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="research-approach"
      ref={sectionRef}
      className="bg-[#EFEFEF] py-8 md:py-12"
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div
          className={`transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Section header */}
          <div className="mb-8 md:mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#7D1A2E]" />
              <h2 className="text-[#7D1A2E] text-xs md:text-sm tracking-[0.2em] uppercase font-body font-bold">
                {t('researchApproach.title')}
              </h2>
            </div>
            <h3 className="font-display font-light text-[#1A1A1A] text-3xl md:text-4xl leading-tight">
              {t('researchApproach.subtitle')}
            </h3>
          </div>

          {/* Description */}
          <div className="mb-8 space-y-4">
            <p className="text-[#1A1A1A]/70 font-body text-base md:text-lg leading-relaxed">
              {t('researchApproach.description')}
            </p>
            <p className="text-[#1A1A1A]/70 font-body text-base md:text-lg leading-relaxed">
              {t('researchApproach.description2')}
            </p>
          </div>

          {/* CTA Button */}
          <Link href="/research-approach" className="inline-flex items-center gap-3 border border-[#1A1A1A] text-[#1A1A1A] px-6 py-3 font-body text-sm tracking-widest uppercase font-bold hover:bg-[#1A1A1A] hover:text-[#EFEFEF] transition-all duration-300">
            <span>{t('researchApproach.button')}</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
