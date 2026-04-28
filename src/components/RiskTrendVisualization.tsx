/**
 * TransHorizons — Risk Trend Visualization Component
 * Design: Editorial Horizon — clean, structured, burgundy accents
 * Displays quarterly risk evolution with probability/impact trends and mitigant effectiveness
 */

import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { RiskTrendData } from '@/lib/riskTrendTypes';
import {
  severityToNumber,
  formatQuarterDisplay,
  getSeverityColor,
  getTrendColor,
} from '@/lib/riskTrendTypes';

interface RiskTrendVisualizationProps {
  trendData: RiskTrendData;
  language: string;
}

export function RiskTrendVisualization({ trendData, language }: RiskTrendVisualizationProps) {
  const [expanded, setExpanded] = useState(false);
  const fr = language === 'fr';

  const labels = {
    trend: fr ? 'Tendance' : 'Trend',
    probability: fr ? 'Probabilité' : 'Probability',
    impact: fr ? 'Impact' : 'Impact',
    indicators: fr ? 'Indicateurs actifs' : 'Active Indicators',
    mitigants: fr ? 'Mesures d\'atténuation efficaces' : 'Effective Mitigants',
    notes: fr ? 'Notes' : 'Notes',
    increasing: fr ? 'Augmentation' : 'Increasing',
    stable: fr ? 'Stable' : 'Stable',
    decreasing: fr ? 'Diminution' : 'Decreasing',
    noData: fr ? 'Aucune donnée de tendance disponible' : 'No trend data available',
  };

  // Sort snapshots chronologically (oldest first)
  const sortedSnapshots = useMemo(
    () => [...trendData.snapshots].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [trendData.snapshots]
  );

  if (sortedSnapshots.length === 0) {
    return (
      <div className="py-4 text-center">
        <p className="text-[#8A8A8A] font-body text-sm italic">{labels.noData}</p>
      </div>
    );
  }

  // Calculate min/max for scaling
  const allProbabilities = sortedSnapshots.map(s => severityToNumber(s.probability));
  const allImpacts = sortedSnapshots.map(s => severityToNumber(s.impact));
  const minProb = Math.min(...allProbabilities);
  const maxProb = Math.max(...allProbabilities);
  const minImp = Math.min(...allImpacts);
  const maxImp = Math.max(...allImpacts);

  return (
    <div className="border border-[#E8E4DC] bg-white">
      {/* Header */}
      <button
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[#F5F2EC] transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <TrendingUp size={15} className="text-[#7D1A2E]" />
          <span className="font-display text-base font-medium text-[#1A1A1A]">
            {fr ? 'Évolution trimestrielle' : 'Quarterly Trend'}
          </span>
          <span className="text-xs text-[#8A8A8A] font-body">
            ({sortedSnapshots.length} {fr ? 'trimestres' : 'quarters'})
          </span>
        </div>
        {expanded ? <ChevronUp size={14} className="text-[#8A8A8A]" /> : <ChevronDown size={14} className="text-[#8A8A8A]" />}
      </button>

      {expanded && (
        <div className="px-6 pb-6 pt-2 border-t border-[#E8E4DC] bg-white">
          {/* Trend Chart */}
          <div className="mb-6">
            <h4 className="font-display text-sm font-medium text-[#1A1A1A] mb-4">
              {fr ? 'Probabilité et impact dans le temps' : 'Probability & Impact Over Time'}
            </h4>

            {/* Chart Container */}
            <div className="overflow-x-auto">
              <div className="flex gap-4 pb-4 min-w-max">
                {sortedSnapshots.map((snapshot, idx) => {
                  const probColor = getSeverityColor(snapshot.probability);
                  const impColor = getSeverityColor(snapshot.impact);
                  const probHeight = ((severityToNumber(snapshot.probability) - minProb) / Math.max(maxProb - minProb, 1)) * 100 + 20;
                  const impHeight = ((severityToNumber(snapshot.impact) - minImp) / Math.max(maxImp - minImp, 1)) * 100 + 20;

                  return (
                    <div key={idx} className="flex flex-col items-center gap-2">
                      {/* Bar chart */}
                      <div className="flex items-end gap-1 h-24">
                        {/* Probability bar */}
                        <div
                          className="w-3 transition-all hover:opacity-80"
                          style={{
                            height: `${probHeight}px`,
                            backgroundColor: probColor,
                          }}
                          title={`${labels.probability}: ${snapshot.probability}`}
                        />
                        {/* Impact bar */}
                        <div
                          className="w-3 transition-all hover:opacity-80"
                          style={{
                            height: `${impHeight}px`,
                            backgroundColor: impColor,
                          }}
                          title={`${labels.impact}: ${snapshot.impact}`}
                        />
                      </div>

                      {/* Trend indicator */}
                      <div className="flex items-center justify-center w-6 h-6">
                        {snapshot.trend === 'Increasing' && (
                          <TrendingUp size={14} className="text-red-600" />
                        )}
                        {snapshot.trend === 'Stable' && (
                          <Minus size={14} className="text-amber-600" />
                        )}
                        {snapshot.trend === 'Decreasing' && (
                          <TrendingDown size={14} className="text-green-600" />
                        )}
                      </div>

                      {/* Quarter label */}
                      <span className="text-xs text-[#8A8A8A] font-body text-center whitespace-nowrap">
                        {formatQuarterDisplay(snapshot.quarter)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex gap-6 text-xs font-body text-[#4A4A4A] mt-4 pt-4 border-t border-[#E8E4DC]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3" style={{ backgroundColor: getSeverityColor('High') }} />
                <span>{labels.probability}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3" style={{ backgroundColor: getSeverityColor('Med') }} />
                <span>{labels.impact}</span>
              </div>
            </div>
          </div>

          {/* Quarterly Details */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-medium text-[#1A1A1A]">
              {fr ? 'Détails trimestriels' : 'Quarterly Details'}
            </h4>

            {sortedSnapshots.map((snapshot, idx) => (
              <div key={idx} className="border border-[#E8E4DC] p-4 bg-[#EFEFEF]">
                {/* Quarter header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-display text-sm font-medium text-[#1A1A1A]">
                    {formatQuarterDisplay(snapshot.quarter)}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded border" style={{ borderColor: getSeverityColor(snapshot.probability), color: getSeverityColor(snapshot.probability) }}>
                      {labels.probability}: {snapshot.probability}
                    </span>
                    <span className="text-xs px-2 py-1 rounded border" style={{ borderColor: getSeverityColor(snapshot.impact), color: getSeverityColor(snapshot.impact) }}>
                      {labels.impact}: {snapshot.impact}
                    </span>
                  </div>
                </div>

                {/* Trend */}
                <div className="flex items-center gap-2 mb-3 text-xs">
                  <span className="font-body text-[#4A4A4A]">{labels.trend}:</span>
                  <span className="flex items-center gap-1" style={{ color: getTrendColor(snapshot.trend) }}>
                    {snapshot.trend === 'Increasing' && <TrendingUp size={12} />}
                    {snapshot.trend === 'Stable' && <Minus size={12} />}
                    {snapshot.trend === 'Decreasing' && <TrendingDown size={12} />}
                    <span className="font-body">{snapshot.trend}</span>
                  </span>
                </div>

                {/* Active Indicators */}
                {snapshot.activeIndicators.length > 0 && (
                  <div className="mb-3">
                    <span className="text-xs font-body font-medium text-[#4A4A4A] block mb-1">{labels.indicators}:</span>
                    <div className="flex flex-wrap gap-1">
                      {snapshot.activeIndicators.map((indicator, i) => (
                        <span key={i} className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded border border-amber-200">
                          {indicator}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Effective Mitigants */}
                {snapshot.effectiveMitigants.length > 0 && (
                  <div className="mb-3">
                    <span className="text-xs font-body font-medium text-[#4A4A4A] block mb-1">{labels.mitigants}:</span>
                    <div className="flex flex-wrap gap-1">
                      {snapshot.effectiveMitigants.map((mitigant, i) => (
                        <span key={i} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded border border-green-200">
                          {mitigant}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {snapshot.notes && (
                  <div className="text-xs font-body text-[#4A4A4A] italic border-t border-[#E8E4DC] pt-3 mt-3">
                    <span className="font-medium">{labels.notes}:</span> {snapshot.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
