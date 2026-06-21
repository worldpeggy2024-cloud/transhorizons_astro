/*
 * TransHorizons — About Section
 * Design: Dark charcoal background, ivory text, gold accents
 * Split layout: text left, image right with gold frame
 * Left column: bio prose rendered per-language (EN/FR). Right column: image, then a
 * working-languages + earlier-book-translations aside, CV note, journeys link, stats.
 */

import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '../contexts/LanguageContext';
import { Mail } from 'lucide-react';

const CONTACT_EMAIL = 'contact@transhorizons.net';

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
  const { t, language } = useLanguage();

  // Shared paragraph styles so the EN and FR About bodies render identically.
  const leadClass = 'text-white/80 font-body text-[1.05rem] leading-[1.75] mb-6 border-l-2 border-[#7D1A2E]/50 pl-4';
  const credentialClass = 'text-white/70 font-body text-[0.95rem] leading-relaxed mb-6 italic';
  const bodyClass = 'text-white/80 font-body text-[1.05rem] leading-[1.75] mb-6';
  const bodyLastClass = 'text-white/80 font-body text-[1.05rem] leading-[1.75] mb-8';
  const inlineLinkClass = 'text-[#7D1A2E] hover:text-white transition-colors underline underline-offset-2';

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

            {/* About body — rendered directly (not via t()) so italics + the inline
                link render as real markup. EN is Peggy's English; FR is Peggy's French
                (provided 2026-06-19). Old story.intro / story.strengths.* / story.research.*
                keys remain in LanguageContext for reference but are no longer rendered. */}
            {language === 'fr' ? (
              <>
                <p className={leadClass}>
                  Je suis traductrice professionnelle bilingue (EN/ES → FR), basée à Montréal, avec vingt-quatre années de pratique à titre de traductrice autonome, précédées de trois ans à l'interne chez Microsoft Dublin. Depuis 2010, mes projets touchent très majoritairement le secteur fédéral canadien : traduction, révision et postédition pour des clients finaux comme Statistique Canada, Ressources naturelles Canada et Environnement et Changement climatique Canada. Le contenu fédéral représente plus de 90 % de mon volume de projets depuis 2017.
                </p>

                <p className={credentialClass}>
                  Agréée OTTIAQ · Cote de sécurité du gouvernement du Canada.
                </p>

                <p className={bodyClass}>
                  TransHorizons est le prolongement de ce travail vers la recherche indépendante. Des décennies passées dans la production institutionnelle canadienne (statistique, environnementale, économique, réglementaire) finissent par accumuler un certain type de regard sur la façon dont le pays se raconte, ce qu'il mesure ou ne mesure pas, et là où se trouvent les questions structurelles. Les articles publiés ici mettent par écrit une partie de ce regard, sur les questions qui me semblent valoir la peine d'être travaillées : les minéraux critiques et la transition énergétique, la place du Canada dans un système multipolaire, le carbone forestier, la gouvernance de l'IA, les infrastructures du commerce.
                </p>

                <p className={bodyLastClass}>
                  La recherche s'appuie sur une formation en traduction et en interprétation (UCO/IPLV, Angers), une année d'échange en sciences à l'Université Concordia (sciences physiques, astronomie, écologie, histoire des sciences et des technologies) et trois ans à la localisation de logiciels chez Microsoft Dublin à la fin des années 1990, ainsi que sur de longs voyages en Asie, dans les Amériques, en Europe et en Océanie, souvent pendant plusieurs mois d'affilée.
                </p>
              </>
            ) : (
              <>
                <p className={leadClass}>
                  Senior EN/ES → FR  translator based in Montréal, with 24 years of freelance practice preceded by three years in-house at Microsoft Dublin. Since 2010, my work has focused overwhelmingly on Canadian federal content (and almost exclusively since 2017): translation, revision, and post-editing for end-clients including Statistics Canada, Natural Resources Canada, and Environment and Climate Change Canada.
                </p>

                <p className={credentialClass}>
                  OTTIAQ-certified · Government of Canada security clearance.
                </p>

                <p className={bodyClass}>
                  TransHorizons is the independent research extension of that work. More than a decade of sustained exposure to Canadian institutional output — statistical, environmental, economic, regulatory — leaves you with a particular angle on how the country talks about itself, what it does and doesn't measure, and where the structural questions sit. The articles here take up some of the questions that strike me as worth working on: critical minerals and the energy transition, Canada's place in a multipolar system, forest carbon, AI governance, trade infrastructure.
                </p>

                <p className={bodyLastClass}>
                  The research draws on a scientific track through high school before a pivot to languages, training in translation and interpretation (UCO/IPLV, Angers), an exchange year in sciences at Concordia (physics, astronomy, ecology, history of science and technology), and three years on software localization at Microsoft Dublin during the late-1990s, combined with extended travel across Asia, the Americas, Europe, and Oceania, often for months at a time.
                </p>
              </>
            )}
          </div>

          {/* Right Column - Image, Buttons, Stats */}
          {/* On mobile (below lg) this becomes a flex column and the children are
              reordered so all the text sits above the image; stats stay last.
              On lg it reverts to a normal block (natural order: image first). */}
          <div className={`relative flex flex-col lg:block transition-all duration-700 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`} style={{ transitionDelay: '200ms' }}>
            <div className="relative order-4 lg:order-none mt-8 lg:mt-0">
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

            </div>

            {/* Earlier book translations + working languages — moved here from the left
                column to rebalance the section. EN is Peggy's; the FR "earlier book"
                line is an AI draft (FR-PLACEHOLDER — review wording). */}
            <div className="mt-8 order-1 lg:order-none">
              {language === 'fr' ? (
                <>
                  <p className="text-white/55 font-body text-sm italic leading-relaxed">
                    Traductions de livres et travaux crédités antérieurs :{' '}
                    <Link href="/publications" className={inlineLinkClass}>Traductions et publications</Link>
                  </p>
                  <p className="mt-3 text-white/70 font-body text-sm leading-relaxed">
                    Langues de travail : français (langue maternelle), anglais (bilingue), espagnol (avancé). Connaissances complémentaires acquises par l'étude et les voyages : russe, mandarin, japonais et coréen.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-white/55 font-body text-sm italic leading-relaxed">
                    Earlier book translations and credited work:{' '}
                    <Link href="/publications" className={inlineLinkClass}>Writing &amp; Translation Archive</Link>
                  </p>
                  <p className="mt-3 text-white/70 font-body text-sm leading-relaxed">
                    Working languages: French (native), English (bilingual), Spanish (advanced). Additional study- and travel-based knowledge in Russian, Mandarin, Japanese, and Korean.
                  </p>
                </>
              )}
            </div>

            {/* CV availability note (CV provided on request, not direct download) */}
            <p className="mt-8 flex items-start gap-2 font-body text-sm text-white/55 leading-relaxed tracking-wide order-2 lg:order-none">
              <Mail size={13} className="text-[#7D1A2E] flex-shrink-0 mt-0.5" />
              <span>
                {t('story.cvOnRequest')}{' '}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-[#7D1A2E] hover:text-white transition-colors underline underline-offset-2"
                >
                  {CONTACT_EMAIL}
                </a>
              </span>
            </p>

            {/* Buttons Section */}
            <div className="mt-4 flex flex-wrap gap-3 order-3 lg:order-none">
              <a
                href="#"
                className="inline-flex items-center gap-1 text-[#7D1A2E] hover:text-white transition-colors duration-300 font-body text-xs tracking-wide"
              >
                {t('story.journeysFieldNotes')}
              </a>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/8 order-5 lg:order-none">
              {[
                { number: '25+', label: t('story.years') },
                { number: '15+', label: t('story.government') },
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
