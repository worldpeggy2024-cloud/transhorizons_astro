import { useLanguage } from '@/contexts/LanguageContext';
import { FileText, Award, ArrowLeft, X } from 'lucide-react';
import { useLocation } from 'wouter';
import { useEffect, useState } from 'react';
import rawData from '../../content/pages/publications.yaml';

const PRIZE_PDF = '/images/PrixComportementOrganisationnel2007_c6b3e3fa.pdf';
const PRIZE_PAGE_1 = '/images/prize_page_1_43efd579.png';
const PRIZE_PAGE_2 = '/images/prize_page_2_34568161.png';

// Book cover images, in the same order as the books[] array in
// content/pages/publications.yaml (the single source of truth for the text).
const BOOK_COVERS = [
  '/images/ComportementOrganisationnel_9d498a55.jpg',
  '/images/EconomieContemporaine_950c5512.jpg',
  '/images/fondements_des_math_matiques_10_f641fe04.jpg',
  '/images/InvestigationS&T_bac7a21f.jpg',
  '/images/DeveloppementHumain_9200963e.jpg',
];

const d = rawData as Record<string, any>;
const content = { en: d.en, fr: d.fr };

export default function Publications() {
  const { language } = useLanguage();
  const [, setLocation] = useLocation();
  const [showFullPage, setShowFullPage] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const c = language === 'fr' ? content.fr : content.en;
  const introParagraphs: string[] = (c.intro ?? '').split(/\n\n+/).map((p: string) => p.trim()).filter(Boolean);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Back Button */}
      <div className="pt-6 px-6 lg:px-10 max-w-5xl mx-auto">
        <button
          onClick={() => setLocation('/#story')}
          className="inline-flex items-center gap-2 text-burgundy hover:text-burgundy/80 transition-colors font-semibold text-sm mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {language === 'en' ? 'Back to About Page' : 'Retour à À propos'}
        </button>
      </div>

      {/* Header */}
      <div className="pb-16 px-6 lg:px-10 max-w-5xl mx-auto">
        <h1 className="font-playfair text-5xl font-bold text-charcoal mb-6">
          {c.title}
        </h1>
        {introParagraphs.map((p, i) => (
          <p key={i} className="text-lg text-charcoal/70 leading-relaxed mb-4">
            {p}
          </p>
        ))}
      </div>

      {/* Prize Section */}
      <div className="bg-ivory border-t border-b border-sand/30 py-16 px-6 lg:px-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start gap-6 mb-8">
            <Award className="w-12 h-12 text-burgundy flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-playfair text-3xl font-bold text-charcoal mb-3">
                {c.prize.name}
              </h2>
              <p className="text-charcoal/70">
                {c.prize.desc}
              </p>
            </div>
          </div>

          {/* Prize pages side-by-side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Page 1 - Cover */}
            <div className="bg-white rounded shadow-md overflow-hidden">
              <img
                src={PRIZE_PAGE_1}
                alt="Prize Certificate - Cover"
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Page 2 - Details (clickable) */}
            <div
              onClick={() => setShowFullPage(true)}
              className="bg-white rounded shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow relative group"
            >
              <img
                src={PRIZE_PAGE_2}
                alt="Prize Certificate - Details"
                className="w-full h-auto object-cover group-hover:opacity-90 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors rounded" />
            </div>
          </div>

          {/* Download link */}
          <div className="text-center">
            <a
              href={PRIZE_PDF}
              download
              className="inline-flex items-center justify-center gap-2 px-8 py-3 border-2 border-burgundy text-burgundy hover:bg-burgundy hover:text-white transition-colors font-semibold"
            >
              <FileText className="w-4 h-4" />
              {language === 'en' ? 'Download PDF' : 'Télécharger le PDF'}
            </a>
          </div>
        </div>
      </div>

      {/* Publications List */}
      <div className="py-16 px-6 lg:px-10 max-w-5xl mx-auto">
        <div className="space-y-16">
          {c.books.map((book: any, i: number) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {/* Book Cover */}
              <div className="md:col-span-1">
                <div className="bg-white rounded shadow-lg overflow-hidden">
                  <img
                    src={BOOK_COVERS[i]}
                    alt={book.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>

              {/* Publication Details */}
              <div className="md:col-span-2 border-l-4 border-burgundy pl-6">
                <h3 className="font-playfair text-2xl font-bold text-charcoal mb-2">
                  {book.title}
                </h3>
                <p className="text-sm text-charcoal/60 font-semibold mb-2">
                  {book.publisher}{book.year ? ` · ${book.year}` : ''}
                </p>
                <p className="text-xs text-charcoal/50 mb-4">
                  {book.isbn}
                </p>
                <p className="text-charcoal/70 leading-relaxed">
                  {book.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Page Modal */}
      {showFullPage && (
        <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="relative max-w-3xl w-full my-auto">
            <button
              onClick={() => setShowFullPage(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-2"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={PRIZE_PAGE_2}
              alt="Prize Certificate - Full Page"
              className="w-full h-auto rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
}
