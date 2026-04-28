/*
 * TransHorizons — Hero Section
 * Design: Full-bleed dark photo, white text, burgundy accents
 * Layout: Bottom-anchored text, full viewport height
 * Tagline: White, bold, always visible above hero content
 * Byline: Bottom-right corner, non-caps, subtle
 */

import { useEffect, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const HERO_IMAGE = '/images/PICT3627_0d99f8d2.webp';

export default function HeroSection() {
  const [visible, setVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const parallaxOffset = scrollY * 0.3;

  return (
    <section
      id="hero"
      className="relative h-screen min-h-[600px] flex flex-col"
    >
      {/* Background clipping wrapper — overflow-hidden here only, NOT on the section */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Background image with parallax */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
          style={{
            backgroundImage: `url(${HERO_IMAGE})`,
            transform: `translateY(${parallaxOffset}px)`,
            top: '-10%',
            bottom: '-10%',
          }}
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#0D0D0D]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#7D1A2E]/15 via-transparent to-transparent" />
      </div>

      {/* Content — fills full height, padded top to clear fixed navbar, content pushed to bottom */}
      <div className="relative z-10 flex flex-col justify-end w-full h-full max-w-[1280px] mx-auto px-6 lg:px-10 pb-16 md:pb-24"
           style={{ paddingTop: '90px' }}>
        <div className="max-w-3xl">

          {/* Location tag — white text so it's always visible on dark hero */}
          <div
            className={`transition-all duration-700 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: '0ms' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-6 h-px bg-[#7D1A2E] flex-shrink-0" />
              <p className="text-white text-[11px] tracking-[0.28em] uppercase font-bold font-body"
                 style={{ textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}>
                Montréal · Canada · Global
              </p>
              <div className="w-6 h-px bg-[#7D1A2E] flex-shrink-0" />
            </div>
          </div>

          {/* Headline */}
          <div className="mb-8 pb-2">
            <h1
              className={`font-display font-light text-white leading-[1.1] transition-all duration-900 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)', transitionDelay: '100ms' }}
            >
              {t('hero.title')}
            </h1>
          </div>

          {/* Divider + Subheading */}
          <div
            className={`transition-all duration-700 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            <div className="w-12 h-px bg-[#7D1A2E] mb-5" />
            <p className="text-white/70 text-sm md:text-base font-light leading-relaxed max-w-2xl font-body mb-8">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* CTA Buttons */}
          <div
            className={`flex flex-wrap gap-4 transition-all duration-700 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: '650ms' }}
          >
            <button onClick={() => scrollTo('portfolio')} className="btn-outline">
              {t('hero.button1')}
            </button>
            <button onClick={() => scrollTo('story')} className="btn-outline">
              {t('hero.button2')}
            </button>
          </div>
        </div>
      </div>

      {/* Byline — bottom-right corner, non-caps, subtle */}
      <div
        className={`absolute bottom-8 right-6 lg:right-10 z-10 transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{ transitionDelay: '500ms' }}
      >
        <p className="text-white/40 text-xs font-body tracking-wide text-right">
          {t('hero.byline')}
        </p>
      </div>

      {/* Scroll indicator — right side */}
      <div
        className={`absolute bottom-8 right-8 lg:right-12 z-10 hidden md:flex flex-col items-center gap-3 transition-all duration-700 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDelay: '900ms' }}
      >
        <div
          className="text-white/30 text-[10px] tracking-[0.25em] uppercase font-body"
          style={{ writingMode: 'vertical-rl', letterSpacing: '0.2em' }}
        >
          {t('hero.scroll')}
        </div>
        <div className="w-px h-12 bg-white/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full bg-[#7D1A2E] animate-pulse" style={{ height: '40%' }} />
        </div>
        <button
          onClick={() => scrollTo('portfolio')}
          className="text-white/30 hover:text-[#7D1A2E] transition-colors"
          aria-label="Scroll down"
        >
          <ArrowDown size={14} />
        </button>
      </div>

      {/* Section counter */}
      <div className="absolute bottom-8 left-6 lg:left-10 z-10 hidden md:block">
        <span className="text-white/20 font-body text-[10px] tracking-[0.2em] uppercase">01 / 06</span>
      </div>
    </section>
  );
}
