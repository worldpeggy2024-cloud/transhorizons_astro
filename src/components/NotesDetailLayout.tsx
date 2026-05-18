/**
 * BlogDetailLayout.tsx
 * Composant réutilisable pour les pages blog détaillées
 * Design éditorial : Playfair Display pour titres, Inter pour corps
 * Palette : Ivoire/Charbon/Or avec images de couverture plein-écran
 */

import { ArrowLeft } from 'lucide-react';
import { isValidElement } from 'react';
import { useLocation } from 'wouter';
import { useEffect } from 'react';
import { smoothScrollTo } from '../lib/smoothScroll';
import PortfolioTTSPlayer from './PortfolioTTSPlayer';

interface KeyTakeaway {
  point: string;
}

interface BlogDetailLayoutProps {
  title: string;
  category: string;
  date: string;
  readTime: string;
  heroImage: string;
  content: React.ReactNode;
  keyTakeaways?: KeyTakeaway[];
  relatedArticles?: Array<{
    title: string;
    category: string;
    slug: string;
  }>;
  backSection?: 'notes' | 'portfolio';
  language?: 'en' | 'fr';
  audioId?: string;
  audioText?: string;
}

function cleanForTTS(text: string): string {
  return text
    .replace(/â€¢|•/g, ',')
    .replace(/\n\n+/g, '. ')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function textFromNode(node: React.ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textFromNode).join(' ');
  if (isValidElement(node)) {
    return textFromNode((node.props as { children?: React.ReactNode }).children);
  }
  return '';
}

export default function NotesDetailLayout({
  title,
  category,
  date,
  readTime,
  heroImage,
  content,
  keyTakeaways = [],
  relatedArticles = [],
  backSection = 'notes',
  language = 'en',
  audioId,
  audioText,
}: BlogDetailLayoutProps) {
  const [, navigate] = useLocation();
  const backToHomeLabel = language === 'fr' ? 'Retour a l\'accueil' : 'Back to Home';
  const backToNotesLabel = language === 'fr' ? 'Retour aux notes' : 'Back to Notes';
  const backToAnalysesLabel = language === 'fr' ? 'Retour aux analyses' : 'Back to Portfolio';
  const navigationLabel = language === 'fr' ? 'Navigation' : 'Navigation';
  const homeLabel = language === 'fr' ? 'Accueil' : 'Home';
  const portfolioLabel = language === 'fr' ? 'Portfolio' : 'Portfolio';
  const notesLabel = language === 'fr' ? 'Notes' : 'Notes';
  const contactLabel = language === 'fr' ? 'Contact' : 'Contact';
  const followLabel = language === 'fr' ? 'Suivre' : 'Follow';
  const otherArticlesLabel = language === 'fr' ? 'Autres articles' : 'Other articles';

  const derivedAudioText = [
    title,
    category,
    date,
    ...keyTakeaways.map((k) => k.point),
    textFromNode(content),
  ]
    .map((part) => cleanForTTS(part ?? ''))
    .filter(Boolean)
    .join('. ');

  const ttsText = (audioText && cleanForTTS(audioText)) || derivedAudioText;
  const ttsId = audioId ?? `notes-${title}`;

  const goHomeTop = () => {
    navigate('/');
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 50);
  };

  // Scroll to top on mount (covers Related Articles navigation)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen bg-white text-charcoal">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-sand/20">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={goHomeTop}
              className="flex items-center gap-2 text-sm font-medium text-charcoal hover:text-sand transition-colors"
            >
              <ArrowLeft size={16} />
              {homeLabel}
            </button>
            <span className="text-sand/40">·</span>
            <button
              onClick={() => navigate(backSection === 'portfolio' ? '/analyses' : '/notes')}
              className="flex items-center gap-2 text-sm font-medium text-charcoal hover:text-sand transition-colors"
            >
              <ArrowLeft size={16} />
              {backSection === 'portfolio' ? backToAnalysesLabel : backToNotesLabel}
            </button>
          </div>
          <div className="text-xs text-sand uppercase tracking-wide">{category}</div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen pt-20 flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 container max-w-4xl mx-auto px-6 text-white">
          <div className="mb-6">
            <span className="text-xs uppercase tracking-widest text-sand/80 block mb-4">
              {category} · {date}
            </span>
          </div>
          <h1 className="font-playfair text-5xl md:text-6xl font-bold leading-tight mb-6">
            {title}
          </h1>
          <div className="flex items-center gap-6 text-sm">
            <span className="text-sand">{readTime}</span>
            <div className="w-8 h-px bg-sand/40" />
            <span className="text-sand/80">Featured Article</span>
          </div>
          {ttsText && (
            <div className="mt-4" onClick={(e) => e.stopPropagation()}>
              <PortfolioTTSPlayer
                id={ttsId}
                text={ttsText}
                lang={language === 'fr' ? 'fr-FR' : 'en-CA'}
                dark
              />
            </div>
          )}
        </div>
      </section>

      {/* Key Takeaways — shown first for quick orientation */}
      {keyTakeaways.length > 0 && (
        <section className="bg-[#F5F3F0] border-b border-[#C8C8C8] py-12">
          <div className="container max-w-3xl mx-auto px-6">
            <h3 className="font-playfair text-2xl font-bold text-charcoal mb-8">
              Key Takeaways
            </h3>
            <ul className="space-y-4">
              {keyTakeaways.map((item, idx) => (
                <li key={idx} className="flex gap-3 items-start">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-[#7D1A2E] flex-shrink-0" />
                  <span className="text-charcoal/80 font-body leading-relaxed">{item.point}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Content Section */}
      <section className="bg-white py-20">
        <article className="container max-w-3xl mx-auto px-6">
          <div className="prose prose-lg max-w-none prose-headings:font-playfair prose-headings:text-charcoal prose-p:text-charcoal/80 prose-p:leading-relaxed prose-a:text-sand hover:prose-a:text-charcoal prose-strong:text-charcoal prose-em:text-charcoal/70">
            {content}
          </div>
        </article>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="bg-ivory py-20 border-t border-sand/20">
          <div className="container max-w-4xl mx-auto px-6">
            <h2 className="font-playfair text-3xl font-bold text-charcoal mb-12">
              {otherArticlesLabel}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {relatedArticles.map((article) => (
                <button
                  key={article.slug}
                  onClick={() => { window.scrollTo({ top: 0, behavior: 'instant' }); navigate(`/notes/${article.slug}`); }}
                  className="group text-left p-6 bg-white rounded-lg border border-sand/20 hover:border-sand hover:shadow-lg transition-all"
                >
                  <span className="text-xs uppercase tracking-widest text-sand block mb-3">
                    {article.category}
                  </span>
                  <h3 className="font-playfair text-xl font-bold text-charcoal group-hover:text-sand transition-colors">
                    {article.title}
                  </h3>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

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
    </div>
  );
}
