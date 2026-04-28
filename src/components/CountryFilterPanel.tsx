/*
 * TransHorizons — Country Filter Panel
 * Design: Dark sidebar with toggle filters for region, risk category, and topics
 * Used in World Analysis page to filter the 26 country analyses
 */

import { ChevronDown, ChevronUp, X, Info } from 'lucide-react';
import { useState, useRef } from 'react';
import { REGIONS, RISK_CATEGORIES, TOPICS } from '@/lib/countryMetadata';

export interface FilterState {
  regions: Set<string>;
  riskCategories: Set<string>;
  topics: Set<string>;
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
  const [expandedSections, setExpandedSections] = useState({
    regions: true,
    risks: true,
    topics: true,
  });
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleFilter = (type: 'regions' | 'riskCategories' | 'topics', value: string) => {
    const newFilters = {
      regions: new Set(filters.regions),
      riskCategories: new Set(filters.riskCategories),
      topics: new Set(filters.topics),
    };
    const set = newFilters[type];
    
    if (set.has(value)) {
      set.delete(value);
    } else {
      set.add(value);
    }
    
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      regions: new Set(),
      riskCategories: new Set(),
      topics: new Set(),
    });
  };

  const hasActiveFilters = 
    filters.regions.size > 0 || 
    filters.riskCategories.size > 0 || 
    filters.topics.size > 0;

  return (
    <div className="bg-[#0F0F15] border-r border-white/10 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2 relative">
          <h3 className="text-white font-body text-sm font-medium tracking-wide uppercase">
            Filters
          </h3>
          {/* Info icon with tooltip */}
          <div
            className="relative"
            ref={tooltipRef}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <button
              type="button"
              className="text-white/30 hover:text-white/70 transition-colors focus:outline-none"
              aria-label="Filter explanation"
            >
              <Info size={13} />
            </button>

            {showTooltip && (
              <div
                className="absolute left-0 bottom-full mb-2 z-50 w-80 bg-[#0D0D18] border border-white/15 shadow-2xl text-white/80 font-body text-xs leading-relaxed"
                style={{ pointerEvents: 'none' }}
              >
                <div className="p-4 space-y-3">
                  {/* Title */}
                  <p className="text-white font-medium text-[11px] tracking-wider uppercase border-b border-white/10 pb-2">
                    Country Filter
                  </p>

                  {/* Risk Level */}
                  <div className="space-y-1.5">
                    <p className="text-white/90 text-[11px]">
                      This categorizes each country based on geopolitical, economic, and systemic stability.
                    </p>
                    <ul className="space-y-1 pl-1">
                      <li className="flex gap-1.5">
                        <span className="text-red-400 shrink-0">•</span>
                        <span><span className="text-white/90">High risk:</span> Countries with active conflicts, political instability, or major resource/technology vulnerabilities (e.g., Ukraine, Iran, Venezuela)</span>
                      </li>
                      <li className="flex gap-1.5">
                        <span className="text-amber-400 shrink-0">•</span>
                        <span><span className="text-white/90">Medium risk:</span> Countries with emerging tensions or moderate structural challenges (e.g., Turkey, Pakistan, Brazil)</span>
                      </li>
                      <li className="flex gap-1.5">
                        <span className="text-emerald-400 shrink-0">•</span>
                        <span><span className="text-white/90">Low risk:</span> Stable democracies with predictable governance and lower geopolitical exposure (e.g., Canada, Germany, Japan)</span>
                      </li>
                    </ul>
                    <p className="text-white/50 text-[10px] italic">
                      The risk level is a summary assessment you assign to each country based on your analytical judgment.
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-white/10 pt-2 space-y-1.5">
                    <p className="text-white/90 text-[11px] font-medium">
                      "Filter by analysis focus" (Geopolitics / Resources / Technology):
                    </p>
                    <p className="text-white/70 text-[11px]">
                      This reflects the primary lens through which you analyze each country.
                    </p>
                    <ul className="space-y-1 pl-1">
                      <li className="flex gap-1.5">
                        <span className="text-blue-400 shrink-0">•</span>
                        <span><span className="text-white/90">Geopolitics:</span> Military power, alliances, territorial disputes, diplomatic influence (e.g., Russia, China, India)</span>
                      </li>
                      <li className="flex gap-1.5">
                        <span className="text-yellow-400 shrink-0">•</span>
                        <span><span className="text-white/90">Resources:</span> Energy reserves, mineral wealth, supply chain control, commodity dependencies (e.g., Saudi Arabia, Congo, Australia)</span>
                      </li>
                      <li className="flex gap-1.5">
                        <span className="text-purple-400 shrink-0">•</span>
                        <span><span className="text-white/90">Technology:</span> Tech innovation, semiconductor production, AI development, digital infrastructure (e.g., South Korea, Taiwan, Israel)</span>
                      </li>
                    </ul>
                    <p className="text-white/50 text-[10px] italic">
                      A country can have multiple focus areas — e.g., China can be tagged as both "Geopolitics" AND "Technology".
                    </p>
                  </div>

                  {/* Example */}
                  <div className="border-t border-white/10 pt-2">
                    <p className="text-white/40 text-[10px] font-mono">
                      CHN: &#123; region: 'Asia-Pacific', riskLevel: 'High', topics: ['Geopolitics', 'Technology', 'Resources'] &#125;
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
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
            onClick={() => toggleSection('regions')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <span className="text-white/70 font-body text-xs font-medium tracking-wide uppercase">
              Region
            </span>
            {expandedSections.regions ? (
              <ChevronUp size={14} className="text-white/40" />
            ) : (
              <ChevronDown size={14} className="text-white/40" />
            )}
          </button>
          {expandedSections.regions && (
            <div className="px-4 py-2 space-y-2 bg-white/2">
              {REGIONS.map(region => (
                <label key={region} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.regions.has(region)}
                    onChange={() => toggleFilter('regions', region)}
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

        {/* Risk Categories */}
        <div className="border-b border-white/5">
          <button
            onClick={() => toggleSection('risks')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <span className="text-white/70 font-body text-xs font-medium tracking-wide uppercase">
              Risk Level
            </span>
            {expandedSections.risks ? (
              <ChevronUp size={14} className="text-white/40" />
            ) : (
              <ChevronDown size={14} className="text-white/40" />
            )}
          </button>
          {expandedSections.risks && (
            <div className="px-4 py-2 space-y-2 bg-white/2">
              {RISK_CATEGORIES.map(category => (
                <label key={category} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.riskCategories.has(category)}
                    onChange={() => toggleFilter('riskCategories', category)}
                    className="w-4 h-4 accent-[#7D1A2E] cursor-pointer"
                  />
                  <span className="text-white/60 font-body text-xs group-hover:text-white transition-colors">
                    {category}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Topics */}
        <div className="border-b border-white/5">
          <button
            onClick={() => toggleSection('topics')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <span className="text-white/70 font-body text-xs font-medium tracking-wide uppercase">
              Topic
            </span>
            {expandedSections.topics ? (
              <ChevronUp size={14} className="text-white/40" />
            ) : (
              <ChevronDown size={14} className="text-white/40" />
            )}
          </button>
          {expandedSections.topics && (
            <div className="px-4 py-2 space-y-2 bg-white/2">
              {TOPICS.map(topic => (
                <label key={topic} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.topics.has(topic)}
                    onChange={() => toggleFilter('topics', topic)}
                    className="w-4 h-4 accent-[#7D1A2E] cursor-pointer"
                  />
                  <span className="text-white/60 font-body text-xs group-hover:text-white transition-colors">
                    {topic}
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
