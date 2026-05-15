/*
 * TransHorizons — Footer Component
 * Design: Very dark background, marquee text, social links, copyright
 * Features: Animated marquee, navigation links, social icons, copyright
 * Bilingual: All visible text driven by useLanguage()
 */

import { Mail, BookOpen, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const brandLines = t('footer.brand')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const marqueeItems = [
    { text: t('footer.marquee1'), accent: false },
    { text: '—', accent: true },
    { text: t('footer.marquee2'), accent: false },
    { text: '—', accent: true },
    { text: t('footer.marquee3'), accent: false },
    { text: '—', accent: true },
    { text: t('footer.marquee4'), accent: false },
    { text: '—', accent: true },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const doubled = [...marqueeItems, ...marqueeItems];

  const navItems = [
    { labelKey: 'nav.analysis', id: 'portfolio' },
    { labelKey: 'nav.maps', id: 'globe' },
    { labelKey: 'nav.researchApproach', id: 'research-approach' },
    { labelKey: 'nav.notesReflections', id: 'notes' },
    { labelKey: 'nav.about', id: 'story' },
    { labelKey: 'nav.contact', id: 'contact' },
  ];

  return (
    <footer className="bg-[#000000]">
      {/* Marquee strip */}
      <div className="border-y border-white/8 py-4 overflow-hidden">
        <div
          className="flex whitespace-nowrap"
          style={{ animation: 'marquee 35s linear infinite' }}
        >
          {doubled.map((item, i) => (
            <span
              key={i}
              className={`font-body text-[11px] tracking-[0.18em] uppercase mx-5 flex-shrink-0 ${
                item.accent ? 'text-[#7D1A2E]' : 'text-white/25'
              }`}
            >
              {item.text}
            </span>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 pt-7 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-14">
          {/* Brand — 4 cols */}
          <div className="md:col-span-4">
            <button onClick={() => scrollTo('hero')} className="mb-0 block">
              <img
                src="/images/TransHorizon_LogoB_31961bea.png"
                alt="TransHorizons"
                className="w-[280px] h-auto object-contain"
              />
            </button>
            <div className="text-white/35 font-body text-sm leading-relaxed mb-7 max-w-xs">
              {brandLines[0] && <p>{brandLines[0]}</p>}
              <div className="w-32 h-px bg-[#7D1A2E] my-2" />
              {brandLines.slice(1).map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
            <a
              href="mailto:contact@transhorizons.net"
              className="inline-flex items-center gap-2 text-white/50 hover:text-[#7D1A2E] transition-colors font-body text-sm group"
            >
              <Mail size={13} />
              <span>contact@transhorizons.net</span>
              <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>

          {/* Navigation — 3 cols */}
          <div className="md:col-span-3 md:col-start-6">
            <p className="text-white/30 text-[10px] tracking-[0.25em] uppercase font-body mb-5">
              {t('footer.navigate')}
            </p>
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id!)}
                  className="text-left text-white/40 hover:text-white transition-colors font-body text-sm group flex items-center gap-1"
                >
                  <span className="w-0 group-hover:w-3 h-px bg-[#7D1A2E] transition-all duration-300 overflow-hidden" />
                  {t(item.labelKey!)}
                </button>
              ))}
            </nav>
          </div>

          {/* Connect — 3 cols */}
          <div className="md:col-span-3 md:col-start-10">
            <p className="text-white/30 text-[10px] tracking-[0.25em] uppercase font-body mb-5">
              {t('footer.connect')}
            </p>
            <div className="flex flex-col gap-5">
              {[
                { icon: BookOpen, label: 'LinkedIn', href: 'https://www.linkedin.com/in/peggy-brenier-6896b197/', descKey: 'footer.linkedinDesc' },
                { icon: BookOpen, label: 'Instagram', href: 'https://www.instagram.com/worldpeggy/', descKey: 'footer.instagramDesc' },
                { icon: BookOpen, labelKey: 'story.journeysFieldNotes', href: '#', descKey: 'footer.journeysDesc', accent: true },
              ].map(({ icon: Icon, label, labelKey, href, descKey, accent }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={`flex items-center gap-3 group ${accent ? 'mt-3' : ''}`}
                >
                  <div
                    className={`w-9 h-9 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      accent
                        ? 'border border-[#7D1A2E]/70 bg-[#7D1A2E]/10 group-hover:bg-[#7D1A2E]/20'
                        : 'border border-white/15 group-hover:border-[#7D1A2E]'
                    }`}
                  >
                    <Icon
                      size={14}
                      className={`${accent ? 'text-[#D88A9A]' : 'text-white/35 group-hover:text-[#7D1A2E]'} transition-colors`}
                    />
                  </div>
                  <div>
                    <p
                      className={`${
                        accent
                          ? 'text-[#7D1A2E] text-[15px] tracking-wide font-medium'
                          : 'text-white/60 text-sm'
                      } font-body group-hover:text-white transition-colors leading-tight`}
                    >
                      {labelKey ? t(labelKey) : label}
                    </p>
                    {descKey && (
                      <p className={`${accent ? 'text-[#CFA6B0]' : 'text-white/25'} text-[10px] font-body`}>
                        {t(descKey)}
                      </p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/8 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-white/20 font-body text-xs tracking-wide">
            {t('footer.copyright')}
          </p>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-[#7D1A2E]/60" />
            <p className="text-white/20 font-body text-xs">{t('contact.montreal')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
