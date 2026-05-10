/*
 * TransHorizons — Project Detail Layout
 * Design: Editorial layout with hero, content sections, key takeaways, related projects
 */

import { ArrowLeft, X, Maximize2 } from 'lucide-react';
import { useLocation } from 'wouter';
import { useEffect, useState } from 'react';
import PortfolioTTSPlayer from './PortfolioTTSPlayer';
import { buildArticleTextFromProps } from '../lib/articleTexts';
import { smoothScrollTo } from '../lib/smoothScroll';

/** Renders a content string that may contain multiple paragraphs (separated by
 *  blank lines) and bullet-point blocks (lines starting with •). */
function renderRichText(text: string) {
  const blocks = text.split(/\n{2,}/);
  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.split('\n').filter(l => l.trim() !== '');
        const isBullets = lines.length > 0 && lines.every(l => l.trimStart().startsWith('•'));
        if (isBullets) {
          return (
            <ul key={i} className="list-none space-y-1 mb-4 pl-2">
              {lines.map((line, j) => (
                <li key={j} className="flex items-start gap-2 text-[#555] font-body leading-relaxed text-lg">
                  <span className="text-[#B89860] mt-1 flex-shrink-0">•</span>
                  <span>{line.replace(/^[•\s]+/, '')}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="text-[#555] font-body leading-relaxed text-lg mb-4">
            {block}
          </p>
        );
      })}
    </>
  );
}

interface KeyTakeaway {
  title: string;
  description: string;
  icon?: string;
}

interface ProjectDetailLayoutProps {
  title: string;
  subtitle: string;
  heroImage: string;
  category: string;
  date: string;
  readTime: string;
  articleType?: string;
  introductionTitle?: string;
  introduction: string;
  sections: Array<{
    title: string;
    content: string;
    image?: string;
    imagePosition?: 'left' | 'right' | 'full' | 'side-by-side';
    imageWidthClass?: string;
    imageLinkHref?: string;
    imageLinkLabel?: string;
    image2?: string;
    image2LinkHref?: string;
    image2LinkLabel?: string;
  }>;
  keyTakeaways: KeyTakeaway[];
  relatedProjects?: Array<{
    id: string;
    title: string;
    category: string;
  }>;
  language?: 'en' | 'fr';
  beforeSectionsContent?: React.ReactNode;
  sectionExtras?: Record<number, React.ReactNode>;
}

export default function ProjectDetailLayout({
  title,
  subtitle,
  heroImage,
  category,
  date,
  readTime,
  articleType,
  introductionTitle,
  introduction,
  sections,
  keyTakeaways,
  relatedProjects,
  language = 'en',
  beforeSectionsContent,
  sectionExtras,
}: ProjectDetailLayoutProps) {
  const [, navigate] = useLocation();
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxScale, setLightboxScale] = useState(1);
  const backToPortfolioLabel = language === 'fr' ? 'Retour au Portfolio' : 'Back to Portfolio';
  const backToAnalysesLabel = language === 'fr' ? 'Retour aux analyses' : 'Back to Portfolio';
  const readLabel = language === 'fr' ? 'de lecture' : 'read';
  const keyTakeawaysLabel = language === 'fr' ? 'Points clés' : 'Key Takeaways';
  const relatedProjectsLabel = language === 'fr' ? 'Projets connexes' : 'Related Projects';
  const backToHomeLabel = language === 'fr' ? 'Retour a l\'accueil' : 'Back to Home';
  const navigationLabel = language === 'fr' ? 'Navigation' : 'Navigation';
  const homeLabel = language === 'fr' ? 'Accueil' : 'Home';
  const portfolioLabel = language === 'fr' ? 'Portfolio' : 'Portfolio';
  const notesLabel = language === 'fr' ? 'Notes' : 'Notes';
  const contactLabel = language === 'fr' ? 'Contact' : 'Contact';
  const followLabel = language === 'fr' ? 'Suivre' : 'Follow';

  const goHomeTop = () => {
    navigate('/');
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 50);
  };

  // Scroll to top whenever this component mounts (covers Related Projects navigation)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Dismiss lightbox on Escape + lock body scroll + reset zoom
  useEffect(() => {
    if (!lightboxSrc) {
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = 'hidden';
    setLightboxScale(1);
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightboxSrc(null); };
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [lightboxSrc]);

  return (
    <div className="min-h-screen bg-[#EFEFEF]">
      {/* Header with back button */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-[#C8C8C8]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={goHomeTop}
              className="flex items-center gap-2 text-[#4A4A4A] hover:text-[#7D1A2E] transition-colors font-body text-sm"
            >
              <ArrowLeft size={14} />
              <span>{homeLabel}</span>
            </button>
            <span className="text-[#C0B8AD]">·</span>
            <button
              onClick={() => navigate('/analyses')}
              className="flex items-center gap-2 text-[#4A4A4A] hover:text-[#7D1A2E] transition-colors font-body text-sm"
            >
              <ArrowLeft size={14} />
              <span>{backToAnalysesLabel}</span>
            </button>
          </div>
          <div className="text-xs text-[#999] font-body tracking-wide uppercase">{category}</div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <img
          src={heroImage}
          alt={title}
          className="w-full h-full object-cover brightness-[0.45] saturate-[0.7]"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-12">
          <div className="max-w-3xl">
            <p className="text-[#7D1A2E] text-xs tracking-[0.25em] uppercase font-body font-bold mb-4">
              {category} • {date}
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-white mb-4 leading-tight">
              {title}
            </h1>
            {articleType && (
              <p className="text-white/60 text-sm font-body tracking-wide uppercase mb-3">{articleType}</p>
            )}
            <p className="text-white/80 text-lg font-body max-w-2xl mb-6">{subtitle}</p>
            <p className="text-white/60 text-sm font-body">{readTime} {readLabel}</p>
            <div className="mt-4" onClick={(e) => e.stopPropagation()}>
              <PortfolioTTSPlayer
                id={`detail-${title}`}
                text={buildArticleTextFromProps(title, subtitle, introduction, sections, keyTakeaways)}
                lang={language === 'fr' ? 'fr-FR' : 'en-CA'}
                dark
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-[1000px] mx-auto px-6 lg:px-10 py-20">
        {/* Key Takeaways — shown first for quick orientation */}
        <section className="bg-[#F5F3F0] rounded-lg p-10 md:p-12 mb-20 border border-[#C8C8C8]">
          <h3 className="font-display text-2xl md:text-3xl font-light text-[#1A1A1A] mb-10">
            {keyTakeawaysLabel}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {keyTakeaways.map((takeaway, idx) => (
              <div key={idx} className="flex flex-col">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-2 h-2 rounded-full bg-[#7D1A2E] mt-2 flex-shrink-0" />
                  <h4 className="font-display text-lg font-medium text-[#1A1A1A]">
                    {takeaway.title}
                  </h4>
                </div>
                <p className="text-[#666] font-body text-sm leading-relaxed">
                  {takeaway.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Introduction */}
        <section className="mb-20">
          {introductionTitle && (
            <h2 className="font-display text-3xl md:text-4xl font-light text-[#1A1A1A] mb-8 leading-tight">
              {introductionTitle}
            </h2>
          )}
          <div className="text-lg md:text-xl font-body text-[#333] leading-relaxed">
            {renderRichText(introduction)}
          </div>
        </section>

        {/* Content before Sections (e.g. maps, diagrams) */}
        {beforeSectionsContent}

        {/* Content Sections */}
        {sections.map((section, idx) => (
          <section key={idx} className="mb-20">
            {/* Side-by-side images rendered before the section title */}
            {section.imagePosition === 'side-by-side' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                  { src: section.image, linkHref: section.imageLinkHref, linkLabel: section.imageLinkLabel },
                  { src: section.image2, linkHref: section.image2LinkHref, linkLabel: section.image2LinkLabel },
                ].map((img, i) => img.src ? (
                  <div key={i}>
                    <img
                      src={img.src}
                      alt={section.title}
                      className="w-full rounded-lg object-cover mb-2"
                    />
                    {img.linkHref && (
                      <div className="flex items-start gap-2 rounded border border-[#C8C8C8] bg-[#F5F3F0] px-3 py-2">
                        <Maximize2 size={13} className="mt-0.5 text-[#7D1A2E] flex-shrink-0" aria-hidden />
                        <div>
                          <button
                            onClick={() => setLightboxSrc(img.linkHref!)}
                            className="font-body text-sm font-medium text-[#7D1A2E] hover:text-[#5A1320] underline underline-offset-2 transition-colors text-left"
                          >
                            {img.linkLabel ?? img.linkHref}
                          </button>
                          <p className="mt-0.5 font-body text-xs text-[#888]">
                            {language === 'fr'
                              ? 'S\'affiche en plein écran — appuyez sur × ou Échap pour fermer.'
                              : 'Opens full-screen — press × or Esc to close.'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : null)}
              </div>
            )}

            {/* Full-width image rendered before the section title */}
            {section.image && section.imagePosition === 'full' && (
              <>
                <div className={section.imageWidthClass ?? 'w-full'}>
                  <img
                    src={section.image}
                    alt={section.title}
                    className="w-full rounded-lg object-cover mb-4"
                  />
                </div>
                {section.imageLinkHref && (
                  <div className="mb-8 flex items-start gap-3 rounded border border-[#C8C8C8] bg-[#F5F3F0] px-4 py-3">
                    <Maximize2 size={15} className="mt-0.5 text-[#7D1A2E] flex-shrink-0" aria-hidden />
                    <div>
                      <button
                        onClick={() => setLightboxSrc(section.imageLinkHref!)}
                        className="font-body text-sm font-medium text-[#7D1A2E] hover:text-[#5A1320] underline underline-offset-2 transition-colors text-left"
                      >
                        {section.imageLinkLabel ?? section.imageLinkHref}
                      </button>
                      <p className="mt-0.5 font-body text-xs text-[#888]">
                        {language === 'fr'
                          ? 'S\'affiche en plein écran — appuyez sur × ou Échap pour fermer.'
                          : 'Opens full-screen — press × or Esc to close.'}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}

            <h2 className="font-display text-3xl md:text-4xl font-light text-[#1A1A1A] mb-8 leading-tight">
              {section.title}
            </h2>

            {section.image && section.imagePosition !== 'full' && section.imagePosition !== 'side-by-side' ? (
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8`}>
                {section.imagePosition === 'right' ? (
                  <>
                    <div>
                      <div className="text-[#555] font-body leading-relaxed text-lg">
                        {renderRichText(section.content)}
                      </div>
                    </div>
                    <img
                      src={section.image}
                      alt={section.title}
                      className="rounded-lg object-cover h-[400px]"
                    />
                  </>
                ) : (
                  <>
                    <img
                      src={section.image}
                      alt={section.title}
                      className="rounded-lg object-cover h-[400px]"
                    />
                    <div>
                      <div className="text-[#555] font-body leading-relaxed text-lg">
                        {renderRichText(section.content)}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="text-[#555] font-body leading-relaxed text-lg mb-8">
                {renderRichText(section.content)}
              </div>
            )}
            {sectionExtras?.[idx]}
          </section>
        ))}

        {/* Related Projects */}
        {relatedProjects && relatedProjects.length > 0 && (
          <section>
            <h3 className="font-display text-2xl md:text-3xl font-light text-[#1A1A1A] mb-10">
              {relatedProjectsLabel}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedProjects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => { window.scrollTo({ top: 0, behavior: 'instant' }); navigate(`/portfolio/${project.id}`); }}
                  className="group text-left p-6 border border-[#C8C8C8] rounded-lg hover:border-[#7D1A2E] hover:bg-white transition-all duration-300"
                >
                  <p className="text-xs text-[#999] font-body tracking-wide uppercase mb-2">
                    {project.category}
                  </p>
                  <h4 className="font-display text-lg font-medium text-[#1A1A1A] group-hover:text-[#7D1A2E] transition-colors duration-300">
                    {project.title}
                  </h4>
                </button>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer Navigation */}
      <footer className="bg-white border-t border-sand/20 py-12">
        <div className="container max-w-4xl mx-auto px-6">
          <button
            onClick={goHomeTop}
            className="flex items-center gap-2 text-sm font-medium text-charcoal hover:text-sand transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            {backToHomeLabel}
          </button>
          <div className="grid md:grid-cols-3 gap-8 pt-8 border-t border-sand/20">
            <div>
              <h4 className="font-playfair text-lg font-bold text-charcoal mb-4">{navigationLabel}</h4>
              <ul className="space-y-2 text-sm text-charcoal/70">
                <li>
                  <button
                    onClick={goHomeTop}
                    className="hover:text-sand transition-colors"
                  >
                    {homeLabel}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/#portfolio')}
                    className="hover:text-sand transition-colors"
                  >
                    {portfolioLabel}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { navigate('/'); setTimeout(() => smoothScrollTo('notes'), 100); }}
                    className="hover:text-sand transition-colors"
                  >
                    {notesLabel}
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-playfair text-lg font-bold text-charcoal mb-4">{contactLabel}</h4>
              <a
                href="mailto:contact@transhorizons.net"
                className="text-sm text-charcoal/70 hover:text-sand transition-colors"
              >
                contact@transhorizons.net
              </a>
            </div>
            <div>
              <h4 className="font-playfair text-lg font-bold text-charcoal mb-4">{followLabel}</h4>
              <div className="flex gap-4 text-sm">
                <a
                  href="https://www.linkedin.com/in/peggy-brenier-6896b197/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-charcoal/70 hover:text-sand transition-colors"
                >
                  LinkedIn
                </a>
                <a
                  href="https://www.instagram.com/worldpeggy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-charcoal/70 hover:text-sand transition-colors"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Lightbox */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 overflow-auto"
          onClick={() => setLightboxSrc(null)}
          onKeyDown={(e) => e.key === 'Escape' && setLightboxSrc(null)}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={() => setLightboxSrc(null)}
            className="absolute top-4 right-4 z-10 flex items-center gap-1.5 rounded bg-white/10 px-3 py-2 text-white hover:bg-white/20 transition-colors font-body text-sm"
            aria-label="Close"
          >
            <X size={16} />
            <span>{language === 'fr' ? 'Fermer' : 'Close'}</span>
          </button>
          {lightboxScale > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxScale(1); }}
              className="absolute top-4 left-4 z-10 rounded bg-white/10 px-3 py-2 text-white hover:bg-white/20 transition-colors font-body text-sm"
            >
              {language === 'fr' ? 'Réinitialiser zoom' : 'Reset zoom'}
            </button>
          )}
          <img
            src={lightboxSrc}
            alt=""
            className="object-contain rounded shadow-2xl transition-transform duration-75"
            style={{ transform: `scale(${lightboxScale})`, cursor: lightboxScale > 1 ? 'grab' : 'zoom-in', maxWidth: '100%', maxHeight: '85vh' }}
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => {
              e.stopPropagation();
              setLightboxScale(s => Math.min(5, Math.max(1, s - e.deltaY * 0.001)));
            }}
          />
        </div>
      )}
    </div>
  );
}
