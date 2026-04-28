import React, { useState, useMemo } from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type {
  CountryHistoricalProfile,
  TimelineState,
  ScenarioType,
} from '@/lib/historicalTimelineTypes';
import { getTimelineLabel } from '@/lib/historicalTimelineTypes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TimelineSlider } from '@/components/TimelineSlider';

interface HistoricalRiskMapProps {
  countryProfile: CountryHistoricalProfile;
  onYearChange?: (year: number, quarter?: number) => void;
}

export function HistoricalRiskMap({
  countryProfile,
  onYearChange,
}: HistoricalRiskMapProps) {
  const { t, language } = useLanguage();
  const [timelineState, setTimelineState] = useState<TimelineState>({
    selectedYear: 2024,
    selectedScenario: 'base',
    granularity: 'yearly',
    showUncertaintyBands: true,
    showAllScenarios: false,
  });

  const [expandedCorrelation, setExpandedCorrelation] = useState<string | null>(
    null
  );

  // Get correlations for current timeline state
  const currentCorrelations = useMemo(() => {
    return countryProfile.correlations
      .map((corr) => {
        // Find data point closest to selected year
        const historicalPoint = corr.historical.find(
          (h) => h.date.year === timelineState.selectedYear
        );

        const scenarioData = corr.scenarios[timelineState.selectedScenario];
        const projectionPoint = scenarioData.find(
          (s) => s.date.year === timelineState.selectedYear
        );

        const dataPoint = historicalPoint || projectionPoint;

        return {
          ...corr,
          historicalData: historicalPoint,
          projectionData: projectionPoint,
          currentData: dataPoint,
          isHistorical: !!historicalPoint,
          isProjection: !!projectionPoint,
        };
      })
      .filter((c) => c.currentData);
  }, [countryProfile, timelineState.selectedYear, timelineState.selectedScenario]);

  const handleYearChange = (year: number, quarter?: number) => {
    setTimelineState((prev) => ({
      ...prev,
      selectedYear: year,
      selectedQuarter: quarter,
    }));
    onYearChange?.(year, quarter);
  };

  const handleScenarioChange = (scenario: ScenarioType) => {
    setTimelineState((prev) => ({
      ...prev,
      selectedScenario: scenario,
    }));
  };

  const toggleUncertaintyBands = () => {
    setTimelineState((prev) => ({
      ...prev,
      showUncertaintyBands: !prev.showUncertaintyBands,
    }));
  };

  const getStrengthColor = (
    strength: string
  ): string => {
    switch (strength) {
      case 'high':
        return 'from-red-600 to-red-800';
      case 'medium':
        return 'from-amber-600 to-amber-800';
      case 'low':
        return 'from-green-600 to-green-800';
      default:
        return 'from-gray-600 to-gray-800';
    }
  };

  const getRiskTypeIcon = (riskType: string) => {
    if (riskType.includes('commodity')) return '📦';
    if (riskType.includes('capital')) return '💰';
    if (riskType.includes('trade')) return '🚢';
    if (riskType.includes('geopolitical')) return '🛡️';
    return '⚠️';
  };

  const scenarioLabels: Record<ScenarioType, string> = {
    base: language === 'en' ? 'Base Case' : 'Scénario de base',
    optimistic:
      language === 'en' ? 'Optimistic' : 'Optimiste',
    pessimistic:
      language === 'en' ? 'Pessimistic' : 'Pessimiste',
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-foreground">
            {language === 'en'
              ? `${countryProfile.countryName} Risk Timeline (2006-2031)`
              : `Chronologie des risques - ${countryProfile.countryName} (2006-2031)`}
          </h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleUncertaintyBands}
              className={
                timelineState.showUncertaintyBands
                  ? 'bg-burgundy-50 border-burgundy-300'
                  : ''
              }
            >
              <AlertCircle className="w-4 h-4 mr-1" />
              {language === 'en' ? 'Uncertainty' : 'Incertitude'}
            </Button>
          </div>
        </div>

        {/* Scenario Selector */}
        <div className="flex gap-2 flex-wrap">
          {(
            ['base', 'optimistic', 'pessimistic'] as ScenarioType[]
          ).map((scenario) => (
            <Button
              key={scenario}
              variant={
                timelineState.selectedScenario === scenario
                  ? 'default'
                  : 'outline'
              }
              size="sm"
              onClick={() => handleScenarioChange(scenario)}
              className={
                timelineState.selectedScenario === scenario
                  ? 'bg-burgundy-700 text-white'
                  : ''
              }
            >
              {scenarioLabels[scenario]}
            </Button>
          ))}
        </div>

        {/* Timeline Info */}
        <div className="text-sm text-muted-foreground">
          {timelineState.selectedYear <= 2024
            ? language === 'en'
              ? 'Historical data'
              : 'Données historiques'
            : language === 'en'
              ? 'Projected scenario'
              : 'Scénario projeté'}
          {' • '}
          {getTimelineLabel({
            year: timelineState.selectedYear,
            quarter: timelineState.selectedQuarter,
            timestamp: '',
          })}
        </div>
      </div>

      {/* Night Map Background with Risk Overlays */}
      <div className="relative rounded-lg overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 min-h-[600px]">
        {/* Subtle map background pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg
            className="w-full h-full"
            viewBox="0 0 1000 600"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <pattern
                id="grid"
                width="50"
                height="50"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 50 0 L 0 0 0 50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="1000" height="600" fill="url(#grid)" />
          </svg>
        </div>

        {/* Risk Cards Overlay */}
        <div className="relative p-6 space-y-3 max-h-[500px] overflow-y-auto">
          {currentCorrelations.length > 0 ? (
            currentCorrelations.map((corr, idx) => (
              <div
                key={`${corr.sourceCountry}-${corr.destinationCountry}-${idx}`}
                className="group"
              >
                <button
                  onClick={() =>
                    setExpandedCorrelation(
                      expandedCorrelation ===
                        `${corr.sourceCountry}-${corr.destinationCountry}`
                        ? null
                        : `${corr.sourceCountry}-${corr.destinationCountry}`
                    )
                  }
                  className="w-full text-left"
                >
                  <Card
                    className={`p-4 backdrop-blur-sm border transition-all cursor-pointer ${
                      ((corr.historicalData?.probability ?? 0) ||
                        (corr.projectionData?.probability.probability ?? 0)) > 70
                        ? 'bg-red-950/40 border-red-700/50 hover:bg-red-900/50'
                        : ((corr.historicalData?.probability ?? 0) ||
                            (corr.projectionData?.probability.probability ?? 0)) > 40
                          ? 'bg-amber-950/40 border-amber-700/50 hover:bg-amber-900/50'
                          : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">
                            {getRiskTypeIcon(corr.riskType)}
                          </span>
                          <div>
                            <p className="font-semibold text-white text-sm">
                              {corr.sourceCountry} → {corr.destinationCountry}
                            </p>
                            <p className="text-xs text-gray-300">
                              {corr.riskType.replace(/-/g, ' ')}
                            </p>
                          </div>
                        </div>

                        {/* Risk Metrics */}
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="text-xs">
                            <span className="text-gray-400">Probability:</span>
                            <div className="flex items-center gap-1 mt-1">
                              <div className="flex-1 bg-slate-700 rounded h-1.5">
                                <div
                                  className="bg-red-500 h-full rounded transition-all"
                                  style={{
                                    width: `${
                                      corr.historicalData
                                        ? corr.historicalData.probability
                                        : corr.projectionData?.probability.probability
                                    }%`,
                                  }}
                                />
                              </div>
                              <span className="text-white font-semibold w-8">
                                {corr.historicalData
                                  ? corr.historicalData.probability
                                  : corr.projectionData?.probability.probability}
                                %
                              </span>
                            </div>
                          </div>
                          <div className="text-xs">
                            <span className="text-gray-400">Impact:</span>
                            <div className="flex items-center gap-1 mt-1">
                              <div className="flex-1 bg-slate-700 rounded h-1.5">
                                <div
                                  className="bg-orange-500 h-full rounded transition-all"
                                  style={{
                                    width: `${
                                      corr.historicalData
                                        ? corr.historicalData.impact
                                        : corr.projectionData?.impact.impact
                                    }%`,
                                  }}
                                />
                              </div>
                              <span className="text-white font-semibold w-8">
                                {corr.historicalData
                                  ? corr.historicalData.impact
                                  : corr.projectionData?.impact.impact}
                                %
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <ChevronDown
                        className={`w-4 h-4 text-gray-400 transition-transform ${
                          expandedCorrelation ===
                          `${corr.sourceCountry}-${corr.destinationCountry}`
                            ? 'rotate-180'
                            : ''
                        }`}
                      />
                    </div>
                  </Card>
                </button>

                {/* Expanded Details */}
                {expandedCorrelation ===
                  `${corr.sourceCountry}-${corr.destinationCountry}` && (
                  <Card className="mt-2 p-4 bg-slate-800/60 border-slate-700/50 text-sm space-y-3">
                    <div>
                      <p className="text-gray-300 font-semibold mb-1">
                        {language === 'en'
                          ? 'Transmission Mechanism'
                          : 'Mécanisme de transmission'}
                      </p>
                      <p className="text-gray-400">
                        {corr.historicalData?.mechanism ||
                          corr.projectionData?.mechanism}
                      </p>
                    </div>

                    {corr.isProjection && corr.projectionData && (
                      <div>
                        <p className="text-gray-300 font-semibold mb-1">
                          {language === 'en'
                            ? 'Key Assumptions'
                            : 'Hypothèses clés'}
                        </p>
                        <ul className="text-gray-400 space-y-1">
                          {corr.projectionData.assumptions?.map(
                            (assumption, i) => (
                              <li key={i} className="flex gap-2">
                                <span>•</span>
                                <span>{assumption}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                    {timelineState.showUncertaintyBands &&
                      corr.isProjection &&
                      corr.projectionData && (
                        <div>
                          <p className="text-gray-300 font-semibold mb-1">
                            {language === 'en'
                              ? 'Confidence Level'
                              : 'Niveau de confiance'}
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-700 rounded h-2">
                              <div
                                className="bg-blue-500 h-full rounded transition-all"
                                style={{
                                  width: `${corr.projectionData.probability.confidence}%`,
                                }}
                              />
                            </div>
                            <span className="text-white font-semibold text-xs w-10">
                              {corr.projectionData.probability.confidence}%
                            </span>
                          </div>
                        </div>
                      )}
                  </Card>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-8">
              {language === 'en'
                ? 'No risk data available for this period'
                : 'Aucune donnée de risque disponible pour cette période'}
            </div>
          )}
        </div>
      </div>

      {/* Timeline Slider */}
      <TimelineSlider
        startYear={2006}
        endYear={2031}
        currentYear={timelineState.selectedYear}
        currentQuarter={timelineState.selectedQuarter}
        onYearChange={handleYearChange}
        historicalEndYear={2024}
      />
    </div>
  );
}
