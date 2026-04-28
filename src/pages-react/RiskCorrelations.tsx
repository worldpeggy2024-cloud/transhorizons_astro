/**
 * TransHorizons — Global Risk Correlations Page
 * Design: Editorial Horizon — dark page showing how geopolitical and economic risks cascade across countries
 *
 * Layout:
 *   1. Top bar with navigation
 *   2. Hero section with title and description
 *   3. Risk Correlation Matrix visualization
 *   4. Footer
 */

import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import { RiskCorrelationMatrix } from '@/components/RiskCorrelationMatrix';
import { globalRiskCorrelations } from '@/data/riskCorrelations';

export default function RiskCorrelations() {
  const { language } = useLanguage();
  const fr = language === 'fr';
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-[#0A0A12] text-white">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-40 bg-[#0A0A12]/80 backdrop-blur border-b border-white/10 h-[52px] flex items-center px-6">
        <button
          onClick={() => navigate('/world-analysis')}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">
            {fr ? 'Retour à Analyse mondiale' : 'Back to World Analysis'}
          </span>
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="mb-16">
          <div className="w-8 h-px bg-[#7D1A2E] mb-6" />
          <h1 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-light text-white leading-tight mb-6">
            {fr ? (
              <>Corrélations de <span className="italic">risques mondiaux</span></>
            ) : (
              <>Global <span className="italic">Risk Correlations</span></>
            )}
          </h1>
          <p className="text-white/60 font-body text-base max-w-2xl leading-relaxed">
            {fr
              ? 'Visualisez comment les risques géopolitiques et économiques se propagent entre les pays analysés. Cette matrice de corrélation montre les interconnexions critiques qui façonnent la dynamique mondiale.'
              : 'Visualize how geopolitical and economic risks cascade across analyzed countries. This correlation matrix reveals critical interconnections shaping global dynamics.'}
          </p>
        </div>

        {/* Risk Correlation Matrix */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-8">
          <RiskCorrelationMatrix correlations={globalRiskCorrelations} language={language} />
        </div>

        {/* Explanation Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="font-display text-lg text-white mb-3">
              {fr ? 'Comment lire cette matrice' : 'How to read this matrix'}
            </h3>
            <ul className="space-y-2 text-white/60 text-sm font-body">
              <li>
                {fr
                  ? '• Les cellules colorées indiquent une corrélation entre deux risques'
                  : '• Colored cells indicate correlation between two risks'}
              </li>
              <li>
                {fr
                  ? '• Les teintes plus intenses signifient une corrélation plus forte'
                  : '• Darker shades indicate stronger correlations'}
              </li>
              <li>
                {fr
                  ? '• Survolez une cellule pour voir les détails de la corrélation'
                  : '• Hover over a cell to see correlation details'}
              </li>
            </ul>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="font-display text-lg text-white mb-3">
              {fr ? 'Implications stratégiques' : 'Strategic implications'}
            </h3>
            <p className="text-white/60 text-sm font-body leading-relaxed">
              {fr
                ? 'Comprendre ces corrélations aide à anticiper les chocs systémiques et à identifier les points de contagion potentiels dans le système géopolitique mondial.'
                : 'Understanding these correlations helps anticipate systemic shocks and identify potential contagion points in the global geopolitical system.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
