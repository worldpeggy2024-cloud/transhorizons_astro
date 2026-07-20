/*
 * TransHorizons — Country Filter Panel
 * Design: Dark sidebar with a region toggle filter, used in the World Analysis
 * page. The Manus-era risk-level AND topics facets were REMOVED 2026-07-19
 * (author decision): both were hand-assigned labels that filtered nothing real.
 * Keyword search over actual report content (see countryKeywords.ts) replaces
 * them; region remains as the one factual facet.
 */

import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { useState } from 'react';
import { REGIONS } from '@/lib/countryMetadata';

export interface FilterState {
  regions: Set<string>;
}

interface CountryFilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClose?: () => void;
}

export default function CountryFilterPanel({
  filters,
  onFiltersChange,
  onClose,
}: CountryFilterPanelProps) {
  const [regionsExpanded, setRegionsExpanded] = useState(true);

  const toggleRegion = (value: string) => {
    const regions = new Set(filters.regions);
    if (regions.has(value)) {
      regions.delete(value);
    } else {
      regions.add(value);
    }
    onFiltersChange({ regions });
  };

  const clearAllFilters = () => {
    onFiltersChange({ regions: new Set() });
  };

  const hasActiveFilters = filters.regions.size > 0;

  return (
    <div className="bg-[#0F0F15] border-r border-white/10 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h3 className="text-white font-body text-sm font-medium tracking-wide uppercase">
          Filters
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filter sections */}
      <div className="flex-1 overflow-y-auto">
        {/* Regions */}
        <div className="border-b border-white/5">
          <button
            onClick={() => setRegionsExpanded((v) => !v)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <span className="text-white/70 font-body text-xs font-medium tracking-wide uppercase">
              Region
            </span>
            {regionsExpanded ? (
              <ChevronUp size={14} className="text-white/40" />
            ) : (
              <ChevronDown size={14} className="text-white/40" />
            )}
          </button>
          {regionsExpanded && (
            <div className="px-4 py-2 space-y-2 bg-white/2">
              {REGIONS.map(region => (
                <label key={region} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.regions.has(region)}
                    onChange={() => toggleRegion(region)}
                    className="w-4 h-4 accent-[#7D1A2E] cursor-pointer"
                  />
                  <span className="text-white/60 font-body text-xs group-hover:text-white transition-colors">
                    {region}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Clear filters button */}
      {hasActiveFilters && (
        <div className="p-4 border-t border-white/10">
          <button
            onClick={clearAllFilters}
            className="w-full px-3 py-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-body text-xs font-medium tracking-wide uppercase transition-colors"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}
