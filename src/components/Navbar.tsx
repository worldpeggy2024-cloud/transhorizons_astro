/*
 * TransHorizons — Navbar Component
 * Design: Editorial Horizon — Transparent on hero, solid ivory on scroll
 * Features: Smooth scroll, mobile menu, active state
 * Logo: 220px wide, contained within the 80px header height (desktop) / 64px (mobile)
 * Mobile panel: uses dark-bg logo; main header logo is hidden when panel is open
 */

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'wouter';
import { smoothScrollTo } from '../lib/smoothScroll';

// Nav labels are now derived from translation keys at render time

// CDN URLs
const LOGO_TRANSPARENT = '/images/TransHorizon_LogoTWebSiteHeader_faa16766.png';
const LOGO_DARK = '/images/TransHorizon_LogoB_31961bea.png';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const { language, setLanguage, t } = useLanguage();

  const navLinks = [
    { label: t('nav.analysis'), id: 'portfolio' },
  ];

  const navLinksAfterWorldAnalysis = [
    { label: t('nav.researchApproach'), id: 'research-approach' },
    { label: t('nav.notesReflections'), id: 'notes' },
    { label: t('nav.about'), id: 'story' },
  ];

  const mobileLinks = [
    { label: t('nav.analysis'), id: 'portfolio' },
    { label: t('nav.researchApproach'), id: 'research-approach' },
    { label: t('nav.notesReflections'), id: 'notes' },
    { label: t('nav.about'), id: 'story' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
      const sections = ['hero', 'portfolio', 'research-approach', 'story', 'notes', 'contact'];
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    smoothScrollTo(id);
    setMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#EFEFEF]/95 backdrop-blur-md border-b border-[#C8C8C8]'
            : 'bg-transparent'
        }`}
      >
        {/* Single row: logo left, nav right — height sized to contain the logo */}
        <div className="max-w-[1280px] mx-auto px-4 lg:px-10 flex items-center justify-between h-[80px] md:h-[90px]">

          {/* Logo — constrained to header height with padding */}
          <button
            onClick={() => scrollTo('hero')}
            className="flex-shrink-0 flex items-center"
            aria-label="Go to top"
          >
            <img
              src={LOGO_TRANSPARENT}
              alt="TransHorizons"
              style={{ height: '78px', width: 'auto', maxWidth: '260px', objectFit: 'contain' }}
            />
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-9">
            {/* Language Selector */}
            <div className="flex items-center gap-2 border-l border-r border-white/20 px-4 py-1">
              <button
                onClick={() => setLanguage('en')}
                className={`font-body text-[0.7rem] font-medium tracking-[0.12em] uppercase transition-colors duration-300 ${
                  language === 'en'
                    ? scrolled ? 'text-[#7D1A2E]' : 'text-white'
                    : scrolled ? 'text-[#1A1A1A]/50 hover:text-[#1A1A1A]' : 'text-white/50 hover:text-white'
                }`}
              >
                EN
              </button>
              <span className={`text-[0.6rem] ${scrolled ? 'text-[#1A1A1A]/30' : 'text-white/30'}`}>|</span>
              <button
                onClick={() => setLanguage('fr')}
                className={`font-body text-[0.7rem] font-medium tracking-[0.12em] uppercase transition-colors duration-300 ${
                  language === 'fr'
                    ? scrolled ? 'text-[#7D1A2E]' : 'text-white'
                    : scrolled ? 'text-[#1A1A1A]/50 hover:text-[#1A1A1A]' : 'text-white/50 hover:text-white'
                }`}
              >
                FR
              </button>
            </div>

            {navLinks.map(({ label, id }) => (
              <Link
                key={id}
                href="/analyses"
                className={`relative font-body text-[0.75rem] font-medium tracking-[0.14em] uppercase transition-all duration-300 group hover:-translate-y-px ${
                  scrolled ? 'text-[#1A1A1A] hover:text-[#7D1A2E]' : 'text-white/90 hover:text-white'
                }`}
              >
                {label}
                <span className="absolute -bottom-1 left-0 h-px bg-[#7D1A2E] transition-all duration-300 ease-out origin-left w-0 group-hover:w-full" />
              </Link>
            ))}

            {/* Maps */}
            <Link
              href="/world-analysis"
              className={`relative font-body text-[0.75rem] font-medium tracking-[0.14em] uppercase transition-all duration-300 group hover:-translate-y-px ${
                scrolled ? 'text-[#1A1A1A] hover:text-[#7D1A2E]' : 'text-white/90 hover:text-white'
              }`}
            >
              {t('nav.maps')}
              <span className="absolute -bottom-1 left-0 h-px bg-[#7D1A2E] transition-all duration-300 ease-out origin-left w-0 group-hover:w-full" />
            </Link>

            {navLinksAfterWorldAnalysis.map(({ label, id }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`relative font-body text-[0.75rem] font-medium tracking-[0.14em] uppercase transition-all duration-300 group hover:-translate-y-px ${
                  scrolled ? 'text-[#1A1A1A] hover:text-[#7D1A2E]' : 'text-white/90 hover:text-white'
                } ${activeSection === id ? 'text-[#7D1A2E]' : ''}`}
              >
                {label}
                <span className={`absolute -bottom-1 left-0 h-px bg-[#7D1A2E] transition-all duration-300 ease-out origin-left ${
                  activeSection === id ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </button>
            ))}

            {/* Contact CTA */}
            <button
              onClick={() => scrollTo('contact')}
              className={`font-body text-[0.72rem] font-medium tracking-[0.15em] uppercase px-5 py-2.5 border transition-all duration-300 hover:-translate-y-px hover:shadow-sm ${
                scrolled
                  ? 'border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#EFEFEF]'
                  : 'border-white/50 text-white hover:bg-white/10 hover:border-white'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Mobile hamburger — only show when menu is closed */}
          {!menuOpen && (
            <button
              className={`md:hidden p-2 transition-colors duration-300 ${
                scrolled ? 'text-[#1A1A1A]' : 'text-white'
              }`}
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          )}
          {/* Invisible spacer when menu is open so layout doesn't shift */}
          {menuOpen && <div className="md:hidden w-[38px]" />}
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[60] md:hidden transition-all duration-400 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60"
          onClick={() => setMenuOpen(false)}
        />

        {/* Slide-in panel — starts from top-0 so it covers the header area cleanly */}
        <div
          className={`absolute top-0 right-0 h-full w-[280px] bg-[#111111] flex flex-col transition-transform duration-400 ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Panel header: logo + close button */}
          <div className="flex items-center justify-between px-5 h-[80px] border-b border-white/10 flex-shrink-0">
            <img
              src={LOGO_DARK}
              alt="TransHorizons"
              style={{ height: '56px', width: 'auto', maxWidth: '160px', objectFit: 'contain' }}
            />
            <button
              onClick={() => setMenuOpen(false)}
              className="text-white/60 hover:text-white p-1"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 flex-shrink-0">
            <span className="text-white/40 text-xs tracking-widest uppercase">Language</span>
            <button
              onClick={() => setLanguage('en')}
              className={`font-body text-[0.7rem] font-medium tracking-[0.12em] uppercase transition-colors duration-300 ${
                language === 'en' ? 'text-[#7D1A2E]' : 'text-white/50 hover:text-white'
              }`}
            >
              EN
            </button>
            <span className="text-white/30 text-xs">|</span>
            <button
              onClick={() => setLanguage('fr')}
              className={`font-body text-[0.7rem] font-medium tracking-[0.12em] uppercase transition-colors duration-300 ${
                language === 'fr' ? 'text-[#7D1A2E]' : 'text-white/50 hover:text-white'
              }`}
            >
              FR
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col py-4 px-5 gap-0 overflow-y-auto flex-1">
            {/* Home, Portfolio, About */}
            <Link
              href="/analyses"
              onClick={() => setMenuOpen(false)}
              className="text-left text-white/60 hover:text-[#7D1A2E] font-body text-sm tracking-widest uppercase py-3.5 border-b border-white/8 transition-colors flex items-center justify-between group"
            >
              <span>{t('nav.analysis')}</span>
              <span className="text-[#7D1A2E] opacity-0 group-hover:opacity-100 transition-opacity text-xs">→</span>
            </Link>
            {mobileLinks.filter(l => l.id !== 'portfolio').map(({ label, id }, i) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-left text-white/60 hover:text-[#7D1A2E] font-body text-sm tracking-widest uppercase py-3.5 border-b border-white/8 transition-colors flex items-center justify-between group"
                style={{ transitionDelay: menuOpen ? `${i * 40}ms` : '0ms' }}
              >
                <span>{label}</span>
                <span className="text-[#7D1A2E] opacity-0 group-hover:opacity-100 transition-opacity text-xs">→</span>
              </button>
            ))}
            <Link
              href="/world-analysis"
              onClick={() => setMenuOpen(false)}
              className="text-left text-white/60 hover:text-[#7D1A2E] font-body text-sm tracking-widest uppercase py-3.5 border-b border-white/8 transition-colors flex items-center justify-between group"
            >
              <span>{t('nav.maps')}</span>
              <span className="text-[#7D1A2E] opacity-0 group-hover:opacity-100 transition-opacity text-xs">→</span>
            </Link>
            {/* Contact */}
            {[{ label: t('nav.contact'), id: 'contact' }].map(({ label, id }, i) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-left text-white/60 hover:text-[#7D1A2E] font-body text-sm tracking-widest uppercase py-3.5 border-b border-white/8 transition-colors flex items-center justify-between group"
                style={{ transitionDelay: menuOpen ? `${(mobileLinks.length + 1 + i) * 40}ms` : '0ms' }}
              >
                <span>{label}</span>
                <span className="text-[#7D1A2E] opacity-0 group-hover:opacity-100 transition-opacity text-xs">→</span>
              </button>
            ))}
          </nav>

          {/* Footer of panel */}
          <div className="px-5 py-5 border-t border-white/10 flex-shrink-0">
            <a
              href="mailto:hello@transhorizons.space"
              className="text-white/30 font-body text-xs"
            >
              hello@transhorizons.space
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
