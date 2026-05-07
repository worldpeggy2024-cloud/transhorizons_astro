/**
 * BlogDetailLayout.tsx
 * Composant réutilisable pour les pages blog détaillées
 * Design éditorial : Playfair Display pour titres, Inter pour corps
 * Palette : Ivoire/Charbon/Or avec images de couverture plein-écran
 */

import { ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import { useEffect } from 'react';
import { smoothScrollTo } from '../lib/smoothScroll';

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
}: BlogDetailLayoutProps) {
  const [, navigate] = useLocation();

  const handleBack = () => {
    navigate('/');
    setTimeout(() => {
      if (backSection === 'portfolio') {
        document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
      } else {
        smoothScrollTo('notes');
      }
    }, 100);
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
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm font-medium text-charcoal hover:text-sand transition-colors"
          >
            <ArrowLeft size={16} />
            {backSection === 'portfolio' ? 'Back to Portfolio' : 'Back to Notes'}
          </button>
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
              More from <span className="text-sand">Stories</span>
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

      {/* CTA Section */}
      <section className="bg-charcoal text-white py-20">
        <div className="container max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-playfair text-3xl font-bold mb-4">
            Interested in these perspectives?
          </h2>
          <p className="text-white/70 mb-8">
            Let's discuss how these insights apply to your strategic questions or projects.
          </p>
          <button
            onClick={() => navigate('/#contact')}
            className="inline-block px-8 py-3 bg-sand text-charcoal font-medium hover:bg-sand/90 transition-colors"
          >
            Get in Touch
          </button>
        </div>
      </section>

      {/* Footer Navigation */}
      <footer className="bg-white border-t border-sand/20 py-12">
        <div className="container max-w-4xl mx-auto px-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm font-medium text-charcoal hover:text-sand transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
          <div className="grid md:grid-cols-3 gap-8 pt-8 border-t border-sand/20">
            <div>
              <h4 className="font-playfair text-lg font-bold text-charcoal mb-4">Navigation</h4>
              <ul className="space-y-2 text-sm text-charcoal/70">
                <li>
                  <button
                    onClick={() => navigate('/')}
                    className="hover:text-sand transition-colors"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/#portfolio')}
                    className="hover:text-sand transition-colors"
                  >
                    Portfolio
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { navigate('/'); setTimeout(() => smoothScrollTo('notes'), 100); }}
                    className="hover:text-sand transition-colors"
                  >
                    Notes
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-playfair text-lg font-bold text-charcoal mb-4">Contact</h4>
              <a
                href="mailto:contact@transhorizons.net"
                className="text-sm text-charcoal/70 hover:text-sand transition-colors"
              >
                contact@transhorizons.net
              </a>
            </div>
            <div>
              <h4 className="font-playfair text-lg font-bold text-charcoal mb-4">Follow</h4>
              <div className="flex gap-4 text-sm">
                <a
                  href="#"
                  className="text-charcoal/70 hover:text-sand transition-colors"
                >
                  LinkedIn
                </a>
                <a
                  href="#"
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
