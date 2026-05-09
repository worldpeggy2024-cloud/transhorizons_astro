/*
 * TransHorizons — Blog Preview Section "Latest Stories"
 * Design: Warm ivory/sand background, editorial card layout, gold accents
 * Layout: Featured large post left + 2 side posts right
 */

import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowRight, Clock, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import PortfolioTTSPlayer from './PortfolioTTSPlayer';
import { getNoteText } from '../lib/noteTexts';

// blogPosts are now built inside the component using translation keys

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

export default function NotesSection() {
  const { ref, inView } = useInView();
  const [, navigate] = useLocation();
  const { t, language } = useLanguage();
  const lang = language === 'fr' ? 'fr' : 'en';

  const blogPosts = [
    {
      id: 1,
      slug: 'career-evolution',
      category: t('blog.careerChange.category'),
      date: t('blog.careerChange.date'),
      readTime: t('blog.careerChange.readTime'),
      title: t('blog.careerChange.title'),
      excerpt: t('blog.careerChange.desc'),
      image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=900&q=80',
      featured: true,
    },
    {
      id: 2,
      slug: 'travel-observation',
      category: t('blog.travelStories.category'),
      date: t('blog.travelStories.date'),
      readTime: t('blog.travelStories.readTime'),
      title: t('blog.travelStories.title'),
      excerpt: t('blog.travelStories.desc'),
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=700&q=80',
      featured: false,
    },
    {
      id: 3,
      slug: 'canada-resources',
      category: t('blog.canadaResources.category'),
      date: t('blog.canadaResources.date'),
      readTime: t('blog.canadaResources.readTime'),
      title: t('blog.canadaResources.title'),
      excerpt: t('blog.canadaResources.desc'),
      image: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=700&q=80',
      featured: false,
    },
  ];

  const handleBlogClick = (slug: string) => {
    navigate(`/notes/${slug}`);
  };

  return (
    <section id="notes" className="bg-[#DEDEDE] py-10 lg:py-20" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div
          className={`mb-14 transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-6 h-px bg-[#7D1A2E]" />
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-light text-[#1A1A1A] leading-tight mb-3">
                {t('blog.title')}
              </h2>
              <p className="text-[#1A1A1A]/60 font-body text-sm md:text-base leading-relaxed max-w-2xl">
                {t('blog.subtitle')}
              </p>
            </div>
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'instant' });
                navigate('/notes');
              }}
              className="btn-outline-dark self-start md:self-auto whitespace-nowrap flex items-center gap-2"
            >
              {t('blog.allArticles')}
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Posts grid: featured (3/5) + side (2/5) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Featured post */}
          <article
            onClick={() => handleBlogClick(blogPosts[0].slug)}
            className={`lg:col-span-3 group bg-white border border-[#BEBEBE] overflow-hidden transition-all duration-700 hover:shadow-xl cursor-pointer ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="img-zoom h-[260px] overflow-hidden">
              <img
                src={blogPosts[0].image}
                alt={blogPosts[0].title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-7 md:p-8">
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="bg-[#7D1A2E]/15 text-[#5C1220] text-[10px] tracking-[0.2em] uppercase font-medium font-body px-2.5 py-1">
                  {blogPosts[0].category}
                </span>
                <span className="text-[#AAA] text-[11px] font-body flex items-center gap-1">
                  <Calendar size={10} />
                  {blogPosts[0].date}
                </span>
                <span className="text-[#AAA] text-[11px] font-body flex items-center gap-1">
                  <Clock size={10} />
                  {blogPosts[0].readTime}
                </span>
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-medium text-[#1A1A1A] leading-snug mb-4 group-hover:text-[#7D1A2E] transition-colors duration-300">
                {blogPosts[0].title}
              </h3>
              <p className="text-[#666] font-body text-sm leading-relaxed mb-7">
                {blogPosts[0].excerpt}
              </p>
              <div className="flex items-center justify-between border-t border-[#E8E8E8] pt-4 w-full">
                <div className="flex items-center gap-2 text-[#1A1A1A] hover:text-[#7D1A2E] transition-colors font-body text-[11px] tracking-widest uppercase font-medium">
                  {t('blog.readArticle')}
                  <ArrowRight size={13} />
                </div>
                <PortfolioTTSPlayer
                  id={`notes-home-${blogPosts[0].slug}`}
                  text={getNoteText(blogPosts[0].slug, lang) || `${blogPosts[0].title}. ${blogPosts[0].excerpt}`}
                  lang={language === 'fr' ? 'fr-FR' : 'en-CA'}
                />
              </div>
            </div>
          </article>

          {/* Side posts */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {blogPosts.slice(1).map((post, i) => (
              <article
                key={post.id}
                onClick={() => handleBlogClick(post.slug)}
                className={`group bg-white border border-[#BEBEBE] overflow-hidden flex flex-col transition-all duration-700 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${(i + 1) * 120}ms` }}
              >
                <div className="img-zoom h-44 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="bg-[#7D1A2E]/15 text-[#5C1220] text-[9px] tracking-[0.18em] uppercase font-medium font-body px-2 py-0.5">
                      {post.category}
                    </span>
                    <span className="text-[#BBB] text-[10px] font-body flex items-center gap-1">
                      <Clock size={9} />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-medium text-[#1A1A1A] leading-snug mb-2 group-hover:text-[#7D1A2E] transition-colors duration-300 flex-1">
                    {post.title}
                  </h3>
                  <p className="text-[#777] font-body text-xs leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between border-t border-[#E8E8E8] pt-3 w-full mt-auto">
                    <div className="flex items-center gap-1.5 text-[#1A1A1A] hover:text-[#7D1A2E] transition-colors font-body text-[10px] tracking-widest uppercase font-medium self-start">
                      {t('blog.readMore')}
                      <ArrowRight size={11} />
                    </div>
                    <PortfolioTTSPlayer
                      id={`notes-home-${post.slug}`}
                      text={getNoteText(post.slug, lang) || `${post.title}. ${post.excerpt}`}
                      lang={language === 'fr' ? 'fr-FR' : 'en-CA'}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
