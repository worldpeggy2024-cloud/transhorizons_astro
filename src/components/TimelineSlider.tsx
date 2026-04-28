import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getGranularityForYear, getTimelineLabel } from '@/lib/historicalTimelineTypes';
import { Button } from '@/components/ui/button';

interface TimelineSliderProps {
  startYear: number; // 2006
  endYear: number; // 2031
  currentYear: number;
  currentQuarter?: number;
  onYearChange: (year: number, quarter?: number) => void;
  historicalEndYear?: number; // 2024, marks where historical ends and projection begins
}

export function TimelineSlider({
  startYear,
  endYear,
  currentYear,
  currentQuarter,
  onYearChange,
  historicalEndYear = 2024,
}: TimelineSliderProps) {
  const { language } = useLanguage();

  // Determine granularity based on current year
  const currentGranularity = getGranularityForYear(currentYear);

  // Generate timeline points based on granularity
  const timelinePoints = useMemo(() => {
    const points: Array<{ year: number; quarter?: number; label: string; isHistorical: boolean }> = [];

    // 2006-2018: 5-year intervals
    for (let year = startYear; year <= 2018; year += 5) {
      points.push({
        year,
        label: year.toString(),
        isHistorical: year <= historicalEndYear,
      });
    }

    // 2019-2024: Yearly
    for (let year = 2019; year <= historicalEndYear; year++) {
      points.push({
        year,
        label: year.toString(),
        isHistorical: true,
      });
    }

    // 2025-2031: Quarterly
    for (let year = 2025; year <= endYear; year++) {
      for (let quarter = 1; quarter <= 4; quarter++) {
        points.push({
          year,
          quarter,
          label: `Q${quarter} ${year}`,
          isHistorical: false,
        });
      }
    }

    return points;
  }, [startYear, endYear, historicalEndYear]);

  // Find current position in timeline
  const currentIndex = useMemo(() => {
    return timelinePoints.findIndex(
      (p) =>
        p.year === currentYear &&
        (currentGranularity === 'quarterly' ? p.quarter === currentQuarter : !p.quarter)
    );
  }, [currentYear, currentQuarter, currentGranularity, timelinePoints]);

  // Get visible range of points (show ~15 points at a time)
  const visibleRange = useMemo(() => {
    const windowSize = 15;
    const start = Math.max(0, currentIndex - Math.floor(windowSize / 2));
    const end = Math.min(timelinePoints.length, start + windowSize);
    return { start: Math.max(0, end - windowSize), end };
  }, [currentIndex, timelinePoints.length]);

  const visiblePoints = timelinePoints.slice(visibleRange.start, visibleRange.end);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prev = timelinePoints[currentIndex - 1];
      onYearChange(prev.year, prev.quarter);
    }
  };

  const handleNext = () => {
    if (currentIndex < timelinePoints.length - 1) {
      const next = timelinePoints[currentIndex + 1];
      onYearChange(next.year, next.quarter);
    }
  };

  const handlePointClick = (point: (typeof timelinePoints)[0]) => {
    onYearChange(point.year, point.quarter);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const index = parseInt(e.target.value);
    const point = timelinePoints[index];
    onYearChange(point.year, point.quarter);
  };

  const isHistorical = currentYear <= historicalEndYear;

  return (
    <div className="space-y-4">
      {/* Timeline Info */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-gray-400">
            {isHistorical
              ? language === 'en'
                ? 'Historical Data'
                : 'Données historiques'
              : language === 'en'
                ? 'Projected Scenario'
                : 'Scénario projeté'}
          </span>
        </div>
        <span className="font-semibold text-foreground">
          {getTimelineLabel({ year: currentYear, quarter: currentQuarter, timestamp: '' })}
        </span>
      </div>

      {/* Main Slider */}
      <div className="space-y-3">
        {/* Range Input Slider */}
        <input
          type="range"
          min="0"
          max={timelinePoints.length - 1}
          value={currentIndex}
          onChange={handleSliderChange}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-burgundy-700"
          style={{
            background: `linear-gradient(to right, 
              rgb(30, 41, 59) 0%, 
              rgb(30, 41, 59) ${(currentIndex / (timelinePoints.length - 1)) * 100}%, 
              rgb(125, 26, 46) ${(currentIndex / (timelinePoints.length - 1)) * 100}%, 
              rgb(125, 26, 46) 100%)`,
          }}
        />

        {/* Timeline Markers */}
        <div className="flex justify-between items-end gap-1 px-1">
          {visiblePoints.map((point, idx) => {
            const isActive = point.year === currentYear && point.quarter === currentQuarter;
            const globalIndex = visibleRange.start + idx;

            return (
              <button
                key={`${point.year}-${point.quarter || 'full'}`}
                onClick={() => handlePointClick(point)}
                className="flex flex-col items-center gap-1 flex-1 group"
              >
                {/* Marker Line */}
                <div
                  className={`w-0.5 transition-all ${
                    isActive
                      ? 'h-6 bg-burgundy-700'
                      : point.isHistorical
                        ? 'h-4 bg-slate-600 group-hover:bg-slate-500'
                        : 'h-3 bg-slate-700 group-hover:bg-slate-600'
                  }`}
                />

                {/* Label */}
                <span
                  className={`text-xs font-medium transition-colors ${
                    isActive
                      ? 'text-burgundy-700'
                      : point.isHistorical
                        ? 'text-gray-400 group-hover:text-gray-300'
                        : 'text-gray-500 group-hover:text-gray-400'
                  }`}
                >
                  {point.label}
                </span>

                {/* Historical/Projection Indicator */}
                {globalIndex === visibleRange.start || globalIndex === visibleRange.end - 1 ? (
                  <div
                    className={`text-xs font-semibold px-1 py-0.5 rounded ${
                      point.isHistorical
                        ? 'bg-blue-900/40 text-blue-300'
                        : 'bg-amber-900/40 text-amber-300'
                    }`}
                  >
                    {point.isHistorical ? 'Hist' : 'Proj'}
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          {language === 'en' ? 'Previous' : 'Précédent'}
        </Button>

        {/* Progress Indicator */}
        <div className="flex-1 text-center text-xs text-gray-400">
          {currentIndex + 1} / {timelinePoints.length}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={currentIndex === timelinePoints.length - 1}
          className="gap-1"
        >
          {language === 'en' ? 'Next' : 'Suivant'}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Timeline Legend */}
      <div className="flex gap-4 text-xs text-gray-400 pt-2 border-t border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span>{language === 'en' ? 'Historical (2006-2024)' : 'Historique (2006-2024)'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span>{language === 'en' ? 'Projected (2025-2031)' : 'Projeté (2025-2031)'}</span>
        </div>
      </div>
    </div>
  );
}
