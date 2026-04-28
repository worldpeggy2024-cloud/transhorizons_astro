/**
 * TransHorizons — Risk Correlation Matrix Visualization
 * Displays how risks cascade and interact across countries
 * Shows transmission channels, strength, and mitigation options
 */

import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, TrendingDown } from 'lucide-react';
import type { RiskCorrelation } from '@/lib/riskCorrelationTypes';
import { getCorrelationColor, getDirectionArrow, getMechanismLabel } from '@/lib/riskCorrelationTypes';

interface RiskCorrelationMatrixProps {
  correlations: RiskCorrelation[];
  language: string;
}

export function RiskCorrelationMatrix({ correlations, language }: RiskCorrelationMatrixProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [filterStrength, setFilterStrength] = useState<'All' | 'Strong' | 'Moderate'>('All');

  const labels = language === 'fr'
    ? {
        title: 'Matrice de corrélation des risques',
        subtitle: 'Comment les risques se propagent entre les pays',
        strength: 'Force',
        mechanism: 'Mécanisme',
        timeframe: 'Délai',
        mitigation: 'Options d\'atténuation',
        cascade: 'Cascade de risques',
        bidirectional: 'Bidirectionnel',
        unidirectional: 'Unidirectionnel',
        feedback: 'Boucle de rétroaction',
        filterAll: 'Tous',
        filterStrong: 'Forts',
        filterModerate: 'Modérés',
      }
    : {
        title: 'Risk Correlation Matrix',
        subtitle: 'How risks cascade across countries',
        strength: 'Strength',
        mechanism: 'Mechanism',
        timeframe: 'Timeframe',
        mitigation: 'Mitigation Options',
        cascade: 'Risk Cascade',
        bidirectional: 'Bidirectional',
        unidirectional: 'Unidirectional',
        feedback: 'Feedback Loop',
        filterAll: 'All',
        filterStrong: 'Strong',
        filterModerate: 'Moderate',
      };

  const filtered = useMemo(() => {
    if (filterStrength === 'All') return correlations;
    if (filterStrength === 'Strong') return correlations.filter(c => c.strength === 'Strong');
    return correlations.filter(c => c.strength === 'Moderate' || c.strength === 'Strong');
  }, [correlations, filterStrength]);

  // Group correlations by source country
  const grouped = useMemo(() => {
    const groups: Record<string, RiskCorrelation[]> = {};
    filtered.forEach(corr => {
      if (!groups[corr.sourceCountry]) {
        groups[corr.sourceCountry] = [];
      }
      groups[corr.sourceCountry].push(corr);
    });
    return groups;
  }, [filtered]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#E8E4DC] pb-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold text-[#1A1A1A]">{labels.title}</h3>
            <p className="font-body text-sm text-[#8A8A8A] mt-1">{labels.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex gap-2">
        {(['All', 'Strong', 'Moderate'] as const).map(filter => (
          <button
            key={filter}
            onClick={() => setFilterStrength(filter)}
            className={`px-3 py-1.5 text-xs font-body rounded border transition-colors ${
              filterStrength === filter
                ? 'bg-[#7D1A2E] text-white border-[#7D1A2E]'
                : 'bg-white text-[#7D1A2E] border-[#E8E4DC] hover:border-[#7D1A2E]'
            }`}
          >
            {filter === 'All' ? labels.filterAll : filter === 'Strong' ? labels.filterStrong : labels.filterModerate}
          </button>
        ))}
      </div>

      {/* Correlation cards grouped by source country */}
      <div className="space-y-4">
        {Object.entries(grouped).map(([sourceCountry, countryCorrelations]) => (
          <div key={sourceCountry} className="border border-[#E8E4DC] rounded">
            {/* Country header */}
            <div className="bg-[#F5F2EC] px-4 py-3 border-b border-[#E8E4DC]">
              <h4 className="font-display text-sm font-semibold text-[#1A1A1A]">
                {sourceCountry} Risk Cascades
              </h4>
              <p className="font-body text-xs text-[#8A8A8A] mt-1">
                {countryCorrelations.length} {countryCorrelations.length === 1 ? 'correlation' : 'correlations'}
              </p>
            </div>

            {/* Correlation items */}
            <div className="divide-y divide-[#E8E4DC]">
              {countryCorrelations.map((corr, idx) => {
                const globalIdx = correlations.indexOf(corr);
                const isExpanded = expandedIndex === globalIdx;
                const color = getCorrelationColor(corr.strength);
                const arrow = getDirectionArrow(corr.direction);

                return (
                  <div key={`${sourceCountry}-${idx}`}>
                    {/* Correlation header */}
                    <button
                      onClick={() => setExpandedIndex(isExpanded ? null : globalIdx)}
                      className="w-full px-4 py-3 text-left hover:bg-[#EFEFEF] transition-colors flex items-start justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-body text-xs font-semibold text-[#1A1A1A]">
                            {corr.sourceRisk}
                          </span>
                          <span style={{ color }} className="font-body text-xs font-bold">
                            {arrow}
                          </span>
                          <span className="font-body text-xs font-semibold text-[#1A1A1A]">
                            {corr.targetRisk}
                          </span>
                          <span className="text-xs">({corr.targetCountry})</span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            style={{ backgroundColor: color, color: 'white' }}
                            className="px-2 py-0.5 text-[10px] font-body rounded"
                          >
                            {corr.strength}
                          </span>
                          <span className="text-[10px] font-body text-[#8A8A8A]">
                            {getMechanismLabel(corr.mechanism)}
                          </span>
                          <span className="text-[10px] font-body text-[#8A8A8A]">
                            {corr.timeframe}
                          </span>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp size={14} className="text-[#8A8A8A] shrink-0 mt-1" />
                      ) : (
                        <ChevronDown size={14} className="text-[#8A8A8A] shrink-0 mt-1" />
                      )}
                    </button>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="px-4 py-3 bg-white border-t border-[#E8E4DC] space-y-3">
                        {/* Description */}
                        <div>
                          <span className="font-body text-[10px] uppercase tracking-widest text-[#7D1A2E]">
                            {labels.cascade}
                          </span>
                          <p className="font-body text-xs text-[#4A4A4A] leading-relaxed mt-1">
                            {corr.description}
                          </p>
                        </div>

                        {/* Mitigation options */}
                        {corr.mitigationOptions.length > 0 && (
                          <div>
                            <span className="font-body text-[10px] uppercase tracking-widest text-[#7D1A2E]">
                              {labels.mitigation}
                            </span>
                            <ul className="font-body text-xs text-[#4A4A4A] leading-relaxed mt-1 space-y-1">
                              {corr.mitigationOptions.map((option, optIdx) => (
                                <li key={optIdx} className="flex gap-2">
                                  <span className="text-[#7D1A2E] shrink-0">•</span>
                                  <span>{option}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="py-8 text-center">
          <div className="w-8 h-px bg-[#7D1A2E] mx-auto mb-4" />
          <p className="text-[#8A8A8A] font-body text-sm italic">
            {language === 'fr'
              ? 'Aucune corrélation de risque trouvée pour les filtres sélectionnés'
              : 'No risk correlations found for selected filters'}
          </p>
          <div className="w-8 h-px bg-[#7D1A2E] mx-auto mt-4" />
        </div>
      )}
    </div>
  );
}
