/*
 * TransHorizons — Project Detail Layout
 * Design: Editorial layout with hero, content sections, key takeaways, related projects
 */

import { ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

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
    imagePosition?: 'left' | 'right';
  }>;
  keyTakeaways: KeyTakeaway[];
  relatedProjects?: Array<{
    id: string;
    title: string;
    category: string;
  }>;
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
  beforeSectionsContent,
  sectionExtras,
}: ProjectDetailLayoutProps) {
  const [, navigate] = useLocation();

  // Scroll to top whenever this component mounts (covers Related Projects navigation)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen bg-[#EFEFEF]">
      {/* Header with back button */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-[#C8C8C8]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[#666] hover:text-[#1A1A1A] transition-colors duration-300"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-body">Back to Portfolio</span>
          </button>
          <div className="text-xs text-[#999] font-body tracking-wide uppercase">{category}</div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <img
          src={heroImage}
          alt={title}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
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
            <p className="text-white/60 text-sm font-body">{readTime} read</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-[1000px] mx-auto px-6 lg:px-10 py-20">
        {/* Key Takeaways — shown first for quick orientation */}
        <section className="bg-[#F5F3F0] rounded-lg p-10 md:p-12 mb-20 border border-[#C8C8C8]">
          <h3 className="font-display text-2xl md:text-3xl font-light text-[#1A1A1A] mb-10">
            Key Takeaways
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
            <h2 className="font-display text-3xl md:text-4xl font-light text-[#1A1A1A] mb-8 leading-tight">
              {section.title}
            </h2>

            {section.image ? (
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
              Related Projects
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

      {/* CTA Section */}
      <section className="bg-[#1A1A1A] text-white py-16 md:py-20">
        <div className="max-w-[1000px] mx-auto px-6 lg:px-10 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-light mb-6">
            Interested in this analysis?
          </h2>
          <p className="text-white/70 font-body text-lg mb-8 max-w-2xl mx-auto">
            Let's discuss how these insights apply to your strategic questions or projects.
          </p>
          <Button
            onClick={() => {
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              navigate('/');
            }}
            className="bg-[#7D1A2E] text-[#1A1A1A] hover:bg-[#B89860] font-body font-medium px-8 py-3"
          >
            Get in Touch
          </Button>
        </div>
      </section>
    </div>
  );
}
