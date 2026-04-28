import { useLanguage } from '@/contexts/LanguageContext';
import { FileText, Award, ArrowLeft, X } from 'lucide-react';
import { useLocation } from 'wouter';
import { useEffect, useState } from 'react';

const PRIZE_PDF = '/images/PrixComportementOrganisationnel2007_c6b3e3fa.pdf';
const PRIZE_PAGE_1 = '/images/prize_page_1_43efd579.png';
const PRIZE_PAGE_2 = '/images/prize_page_2_34568161.png';

const BOOK_COVERS = {
  pub2: '/images/ComportementOrganisationnel_9d498a55.jpg',
  pub3: '/images/EconomieContemporaine_950c5512.jpg',
  pub4: '/images/fondements_des_math_matiques_10_f641fe04.jpg',
  pub5: '/images/InvestigationS&T_bac7a21f.jpg',
  pub6: '/images/DeveloppementHumain_9200963e.jpg',
};

const publications = [
  { key: 'pub2' },
  { key: 'pub3' },
  { key: 'pub4' },
  { key: 'pub5' },
  { key: 'pub6' },
];

export default function Publications() {
  const { language, t } = useLanguage();
  const [, setLocation] = useLocation();
  const [showFullPage, setShowFullPage] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

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
          {t('publications.title')}
        </h1>
        <p className="text-lg text-charcoal/70 leading-relaxed">
          {t('publications.intro')}
        </p>
      </div>

      {/* Prize Section */}
      <div className="bg-ivory border-t border-b border-sand/30 py-16 px-6 lg:px-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start gap-6 mb-8">
            <Award className="w-12 h-12 text-burgundy flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-playfair text-3xl font-bold text-charcoal mb-3">
                {t('publications.prize')}
              </h2>
              <p className="text-charcoal/70">
                {t('publications.prizeDesc')}
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
          {publications.map(({ key }) => (
            <div key={key} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {/* Book Cover */}
              <div className="md:col-span-1">
                <div className="bg-white rounded shadow-lg overflow-hidden">
                  <img
                    src={BOOK_COVERS[key as keyof typeof BOOK_COVERS]}
                    alt={t(`publications.${key}.title`)}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>

              {/* Publication Details */}
              <div className="md:col-span-2 border-l-4 border-burgundy pl-6">
                <h3 className="font-playfair text-2xl font-bold text-charcoal mb-2">
                  {t(`publications.${key}.title`)}
                </h3>
                <p className="text-sm text-charcoal/60 font-semibold mb-2">
                  {t(`publications.${key}.publisher`)}
                </p>
                <p className="text-xs text-charcoal/50 mb-4">
                  {t(`publications.${key}.isbn`)}
                </p>
                <p className="text-charcoal/70 leading-relaxed">
                  {t(`publications.${key}.desc`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-charcoal text-white py-16 px-6 lg:px-10">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-lg mb-6">
            {language === 'en'
              ? 'Interested in translation, analysis, or institutional writing?'
              : 'Intéressé par la traduction, l\'analyse ou la rédaction institutionnelle ?'}
          </p>
          <a
            href="/#contact"
            className="inline-block px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-charcoal transition-colors"
          >
            {language === 'en' ? 'Get in Touch' : 'Prenez contact'}
          </a>
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
