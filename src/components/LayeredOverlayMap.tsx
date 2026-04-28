import React, { useState, useMemo } from 'react';
import { ChevronDown, Info } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface RiskCard {
  sourceCountry: string;
  sourceCountryCode: string;
  riskName: string;
  riskCategory: 'environmental' | 'political' | 'cybersecurity' | 'social' | 'technological';
  correlation: 'strong' | 'moderate' | 'weak';
  confidence: number; // 0-100
  timeframe: string;
  position: { x: number; y: number }; // Percentage-based positioning on map
}

interface LayeredOverlayMapProps {
  risks: RiskCard[];
  title?: string;
  year?: number;
  scenario?: 'base' | 'optimistic' | 'pessimistic';
}

const categoryColors: Record<RiskCard['riskCategory'], { bg: string; border: string; icon: string }> = {
  environmental: { bg: 'bg-red-900/80', border: 'border-red-500', icon: '🔥' },
  political: { bg: 'bg-yellow-900/80', border: 'border-yellow-500', icon: '🏛️' },
  cybersecurity: { bg: 'bg-red-950/80', border: 'border-red-600', icon: '🔐' },
  social: { bg: 'bg-orange-900/80', border: 'border-orange-500', icon: '👥' },
  technological: { bg: 'bg-purple-900/80', border: 'border-purple-500', icon: '⚙️' },
};

const correlationColors: Record<RiskCard['correlation'], string> = {
  strong: 'text-yellow-400 font-bold',
  moderate: 'text-yellow-300',
  weak: 'text-yellow-200',
};

export function LayeredOverlayMap({
  risks,
  title = 'Risk Cascade Visualization',
  year = 2024,
  scenario = 'base',
}: LayeredOverlayMapProps) {
  const { t, language } = useLanguage();
  const [expandedRisk, setExpandedRisk] = useState<number | null>(null);

  const correlationLabel = {
    strong: language === 'en' ? 'Strong (High Confidence)' : 'Fort (Haute confiance)',
    moderate: language === 'en' ? 'Moderate (Medium Confidence)' : 'Modéré (Confiance moyenne)',
    weak: language === 'en' ? 'Weak (Low Confidence)' : 'Faible (Faible confiance)',
  };

  return (
    <div className="w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        <p className="text-slate-400 text-sm">
          {language === 'en' 
            ? `Showing ${risks.length} risk correlations affecting Canada (${year})`
            : `Affichage de ${risks.length} corrélations de risques affectant le Canada (${year})`
          }
        </p>
      </div>

      {/* Main Container */}
      <div className="relative w-full aspect-video bg-gradient-to-b from-slate-900 via-blue-950 to-slate-950 overflow-hidden">
        {/* Canada Map Background - Simplified SVG */}
        <svg
          viewBox="0 0 1000 600"
          className="absolute inset-0 w-full h-full opacity-40"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e40af" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          
          {/* Simplified Canada outline */}
          <path
            d="M 200 150 L 800 150 L 800 450 L 200 450 Z"
            fill="url(#mapGradient)"
            stroke="#94a3b8"
            strokeWidth="2"
          />
          
          {/* Grid pattern */}
          <g stroke="#475569" strokeWidth="1" opacity="0.2">
            {Array.from({ length: 7 }).map((_, i) => (
              <line key={`v${i}`} x1={200 + (i * 100)} y1="150" x2={200 + (i * 100)} y2="450" />
            ))}
            {Array.from({ length: 4 }).map((_, i) => (
              <line key={`h${i}`} x1="200" y1={150 + (i * 100)} x2="800" y2={150 + (i * 100)} />
            ))}
          </g>
          
          {/* Canada label */}
          <text x="500" y="300" fontSize="48" fill="#64748b" opacity="0.3" textAnchor="middle" fontWeight="bold">
            CANADA
          </text>
        </svg>

        {/* Risk Cards Overlay */}
        <div className="absolute inset-0">
          {risks.map((risk, idx) => {
            const color = categoryColors[risk.riskCategory];
            const isExpanded = expandedRisk === idx;
            
            return (
              <div
                key={idx}
                className="absolute group"
                style={{
                  left: `${risk.position.x}%`,
                  top: `${risk.position.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* Arrow from source to Canada */}
                <svg
                  className="absolute w-32 h-32 -left-16 -top-16 pointer-events-none"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <marker
                      id={`arrowhead-${idx}`}
                      markerWidth="10"
                      markerHeight="10"
                      refX="9"
                      refY="3"
                      orient="auto"
                    >
                      <polygon points="0 0, 10 3, 0 6" fill="#fbbf24" />
                    </marker>
                  </defs>
                  <path
                    d="M 0 0 Q 50 50 100 100"
                    stroke="#fbbf24"
                    strokeWidth="2"
                    fill="none"
                    markerEnd={`url(#arrowhead-${idx})`}
                    opacity="0.7"
                  />
                </svg>

                {/* Risk Card */}
                <button
                  onClick={() => setExpandedRisk(isExpanded ? null : idx)}
                  className={`${color.bg} ${color.border} border rounded-lg p-3 w-56 text-left transition-all hover:shadow-lg hover:shadow-yellow-500/50 cursor-pointer`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-2 flex-1">
                      <span className="text-xl">{color.icon}</span>
                      <div className="flex-1">
                        <p className="font-bold text-white text-sm">{risk.sourceCountry}</p>
                        <p className="text-xs text-slate-300">{risk.riskName}</p>
                      </div>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </div>

                  {/* Correlation Badge */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-semibold ${correlationColors[risk.correlation]}`}>
                      {correlationLabel[risk.correlation]}
                    </span>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-500/50 space-y-2">
                      <div className="text-xs text-slate-300">
                        <p><span className="text-slate-400">Confidence:</span> {risk.confidence}%</p>
                        <p><span className="text-slate-400">Timeframe:</span> {risk.timeframe}</p>
                        <p><span className="text-slate-400">Category:</span> {risk.riskCategory}</p>
                      </div>
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-slate-700 rounded-lg p-4 backdrop-blur">
          <h3 className="text-xs font-bold text-slate-300 mb-3 uppercase">
            {language === 'en' ? 'Risk Categories' : 'Catégories de risques'}
          </h3>
          <div className="space-y-2">
            {Object.entries(categoryColors).map(([category, { icon }]) => (
              <div key={category} className="flex items-center gap-2 text-xs text-slate-300">
                <span>{icon}</span>
                <span className="capitalize">{category}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scenario Badge */}
        <div className="absolute top-4 right-4 bg-slate-900/90 border border-slate-700 rounded-lg px-3 py-2 backdrop-blur">
          <p className="text-xs text-slate-400">
            {language === 'en' ? 'Scenario:' : 'Scénario:'} <span className="text-yellow-400 font-semibold capitalize">{scenario}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
