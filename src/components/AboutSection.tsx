/*
 * TransHorizons — About Section
 * Design: Dark charcoal background, ivory text, gold accents
 * Split layout: text left, image right with gold frame
 * Bio structure: intro (italic + gold + left border), strengths (heading + bullets), research focus (heading + paragraph)
 */

import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '../contexts/LanguageContext';
import { Download } from 'lucide-react';

const CV_URL = '/images/TransHorizonsCV2026SiteWeb_9185ec0e.pdf';

const ABOUT_IMAGE = '/images/about_portrait-LYRozAghmFTyLmT3pDWY6n.webp';

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

export default function AboutSection() {
  const { ref, inView } = useInView();
  const { t } = useLanguage();

  return (
    <section id="story" className="bg-[#141414] py-12 lg:py-16" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        {/* Title and Subtitle Row */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-10">
          <div className={`transition-all duration-700 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-[#7D1A2E]" />
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-light text-white leading-tight">
              {t('story.title')}
            </h2>
          </div>
          
          <div className={`transition-all duration-700 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`} style={{ transitionDelay: '100ms' }}>
            <p className="text-white/60 font-body text-sm md:text-base leading-relaxed lg:text-right lg:max-w-xs">
              {t('story.positioning')}
            </p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Text */}
          <div className={`transition-all duration-700 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="w-12 h-px bg-[#7D1A2E] mb-8" />

            {/* Intro paragraph in italics with gold text and left border */}
            <p className="text-white/80 font-body text-[1.05rem] leading-[1.75] mb-8 border-l-2 border-[#7D1A2E]/50 pl-4 italic whitespace-pre-line">
              {t('story.intro')}
            </p>

            {/* Core Strengths section */}
            <div className="mb-10">
              <h3 className="text-white font-display text-lg font-medium mb-4">
                {t('story.strengths.title')}
              </h3>
              <ul className="space-y-3">
                {[
                  t('story.strengths.item1'),
                  t('story.strengths.item2'),
                  t('story.strengths.item3'),
                  t('story.strengths.item4'),
                  t('story.strengths.item5'),
                ].map((item, i) => (
                  <li key={i} className="text-white/70 font-body text-[0.9rem] leading-relaxed flex gap-3">
                    <span className="text-[#7D1A2E] font-bold flex-shrink-0 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Research Focus section */}
            <div className="mb-8">
              <h3 className="text-white font-display text-lg font-medium mb-3">
                {t('story.research.title')}
              </h3>
              <p className="text-white/70 font-body text-[0.9rem] leading-relaxed">
                {t('story.research.text')}
              </p>
            </div>
          </div>

          {/* Right Column - Image, Buttons, Stats */}
          <div className={`relative transition-all duration-700 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`} style={{ transitionDelay: '200ms' }}>
            <div className="relative">
              {/* Decorative gold border offset */}
              <div className="absolute -top-5 -right-5 w-full h-full border border-[#7D1A2E]/25 pointer-events-none z-0" />
              {/* Inner offset */}
              <div className="absolute -top-2.5 -right-2.5 w-full h-full border border-[#7D1A2E]/10 pointer-events-none z-0" />

              {/* Image */}
              <div className="relative z-10 img-zoom">
                <img
                  src={ABOUT_IMAGE}
                  alt="Languages, maps and global analysis — TransHorizons"
                  className="w-full h-[400px] md:h-[500px] object-cover"
                  loading="lazy"
                />
                {/* Subtle dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              {/* Caption */}
              <div className="mt-5 flex items-start gap-3">
                <div className="w-px h-10 bg-[#7D1A2E] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white/65 text-xs font-body leading-relaxed italic">
                    "{t('story.quote')}"
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons Section */}
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={CV_URL}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center gap-2 px-4 py-2 border border-[#7D1A2E] text-[#7D1A2E] hover:bg-[#7D1A2E] hover:text-white transition-all duration-300 font-body text-xs tracking-wide"
              >
                <Download size={12} />
                {t('story.downloadCV') || 'Download CV'}
              </a>
              <Link
                href="/publications"
                className="inline-flex items-center gap-2 px-4 py-2 border border-[#7D1A2E] text-[#7D1A2E] hover:bg-[#7D1A2E] hover:text-white transition-all duration-300 font-body text-xs tracking-wide"
              >
                {t('nav.publications') || 'Writing & Translation Archive'}
              </Link>
              <a
                href="#"
                className="inline-flex items-center gap-1 text-[#7D1A2E] hover:text-white transition-colors duration-300 font-body text-xs tracking-wide"
              >
                {t('story.journeysFieldNotes')}
              </a>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/8">
              {[
                { number: '25+', label: t('story.years') },
                { number: '15+', label: t('story.government') },
                { number: '3', label: t('story.domains') },
              ].map(({ number, label }) => (
                <div key={label} className="group">
                  <div className="font-display text-[2.2rem] text-[#7D1A2E] font-light leading-none mb-2">{number}</div>
                  <div className="text-white/30 text-[10px] tracking-wide uppercase font-body leading-tight">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
