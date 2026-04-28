import React, { useState } from 'react';
import { LayeredOverlayMap } from '@/components/LayeredOverlayMap';
import { getCanadaRisksForScenario } from '@/data/canadaLayeredMapData';
import { useLanguage } from '@/contexts/LanguageContext';

export function LayeredMapDemo() {
  const { t, language } = useLanguage();
  const [year, setYear] = useState(2024);
  const [scenario, setScenario] = useState<'base' | 'optimistic' | 'pessimistic'>('base');

  const risks = getCanadaRisksForScenario(year, scenario);

  const years = [2024, 2025, 2026];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {language === 'en' ? 'Layered Overlay Map - Canada' : 'Carte superposée - Canada'}
          </h1>
          <p className="text-slate-400">
            {language === 'en'
              ? 'Interactive risk cascade visualization with geographic positioning'
              : 'Visualisation interactive des cascades de risques avec positionnement géographique'}
          </p>
        </div>

        {/* Controls */}
        <div className="mb-8 flex gap-6 flex-wrap">
          {/* Year Selector */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              {language === 'en' ? 'Year' : 'Année'}
            </label>
            <div className="flex gap-2">
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => setYear(y)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    year === y
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>

          {/* Scenario Selector */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              {language === 'en' ? 'Scenario' : 'Scénario'}
            </label>
            <div className="flex gap-2">
              {(['base', 'optimistic', 'pessimistic'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setScenario(s)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all capitalize ${
                    scenario === s
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {language === 'en'
                    ? s.charAt(0).toUpperCase() + s.slice(1)
                    : s === 'base'
                      ? 'Base'
                      : s === 'optimistic'
                        ? 'Optimiste'
                        : 'Pessimiste'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Map Visualization */}
        <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
          <LayeredOverlayMap
            risks={risks}
            title={language === 'en' ? 'Canada Risk Cascade' : 'Cascade de risques - Canada'}
            year={year}
            scenario={scenario}
          />
        </div>

        {/* Info Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-3">
              {language === 'en' ? 'How to Use' : 'Comment utiliser'}
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>• {language === 'en' ? 'Select a year to view risk data' : 'Sélectionnez une année pour voir les données de risque'}</li>
              <li>• {language === 'en' ? 'Choose a scenario to see different projections' : 'Choisissez un scénario pour voir différentes projections'}</li>
              <li>• {language === 'en' ? 'Click risk cards to see details' : 'Cliquez sur les cartes de risque pour voir les détails'}</li>
              <li>• {language === 'en' ? 'Arrows show transmission from source to Canada' : 'Les flèches montrent la transmission de la source au Canada'}</li>
            </ul>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-3">
              {language === 'en' ? 'Risk Categories' : 'Catégories de risques'}
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>🔥 {language === 'en' ? 'Environmental' : 'Environnemental'}</li>
              <li>🏛️ {language === 'en' ? 'Political/Economic' : 'Politique/Économique'}</li>
              <li>🔐 {language === 'en' ? 'Cybersecurity' : 'Cybersécurité'}</li>
              <li>👥 {language === 'en' ? 'Social' : 'Social'}</li>
              <li>⚙️ {language === 'en' ? 'Technological' : 'Technologique'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
