import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { HistoricalRiskMap } from '@/components/HistoricalRiskMap';
import { canadaHistoricalTimeline } from '@/data/canadaHistoricalTimeline';

export function HistoricalRiskDemo() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container py-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {language === 'en'
              ? 'Historical Risk Timeline Analysis'
              : 'Analyse chronologique des risques historiques'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'en'
              ? 'Explore 20 years of risk data with scenario-based projections'
              : 'Explorez 20 ans de données de risque avec des projections basées sur des scénarios'}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12">
        <HistoricalRiskMap countryProfile={canadaHistoricalTimeline} />
      </div>

      {/* Info Section */}
      <div className="border-t border-border bg-slate-900/30">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {language === 'en' ? 'How to Use' : 'Comment utiliser'}
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  {language === 'en'
                    ? '1. Use the timeline slider to navigate through 20 years of data'
                    : '1. Utilisez le curseur chronologique pour naviguer dans 20 ans de données'}
                </li>
                <li>
                  {language === 'en'
                    ? '2. Select a scenario (Base, Optimistic, Pessimistic) to see projections'
                    : '2. Sélectionnez un scénario (Base, Optimiste, Pessimiste) pour voir les projections'}
                </li>
                <li>
                  {language === 'en'
                    ? '3. Toggle uncertainty bands to see confidence ranges'
                    : '3. Activez les bandes d\'incertitude pour voir les plages de confiance'}
                </li>
                <li>
                  {language === 'en'
                    ? '4. Click on risk cards to expand and see transmission mechanisms'
                    : '4. Cliquez sur les cartes de risque pour développer et voir les mécanismes de transmission'}
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {language === 'en' ? 'Data Coverage' : 'Couverture des données'}
              </h2>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <p className="font-semibold text-foreground">
                    {language === 'en' ? 'Historical (2006-2024)' : 'Historique (2006-2024)'}
                  </p>
                  <p>
                    {language === 'en'
                      ? '5-year intervals 2006-2018, yearly 2019-2024'
                      : 'Intervalles de 5 ans 2006-2018, annuel 2019-2024'}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {language === 'en' ? 'Projected (2025-2031)' : 'Projeté (2025-2031)'}
                  </p>
                  <p>
                    {language === 'en'
                      ? 'Quarterly granularity with 3 scenarios and uncertainty bands'
                      : 'Granularité trimestrielle avec 3 scénarios et bandes d\'incertitude'}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {language === 'en' ? 'Risk Correlations' : 'Corrélations de risques'}
                  </p>
                  <p>
                    {language === 'en'
                      ? '4 major cross-country correlations affecting Canada'
                      : '4 corrélations majeures transfrontalières affectant le Canada'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
