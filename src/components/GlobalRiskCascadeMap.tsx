import React, { useState, useMemo } from 'react';
import { ChevronDown, MapPin, TrendingUp, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface RiskCard {
  id: string;
  title: string;
  titleFr: string;
  category: 'environmental' | 'political' | 'cybersecurity' | 'social' | 'technological';
  icon: React.ReactNode;
  sourceCountry: string;
  targetCountry: string;
  correlation: 'Strong' | 'Moderate' | 'Weak';
  correlationFr: 'Fort' | 'Modéré' | 'Faible';
  confidence: number;
  timeframe: string;
  timeframeFr: string;
  x: number;
  y: number;
  expanded?: boolean;
}

interface RiskCategory {
  id: string;
  name: string;
  nameFr: string;
  color: string;
  bgColor: string;
}

const RISK_CATEGORIES: RiskCategory[] = [
  { id: 'environmental', name: 'Environmental', nameFr: 'Environnemental', color: '#A0522D', bgColor: '#8B4513' },
  { id: 'political', name: 'Political/Economic', nameFr: 'Politique/Économique', color: '#FFD700', bgColor: '#DAA520' },
  { id: 'cybersecurity', name: 'Cybersecurity', nameFr: 'Cybersécurité', color: '#DC143C', bgColor: '#8B0000' },
  { id: 'social', name: 'Social', nameFr: 'Social', color: '#FF8C00', bgColor: '#FF6347' },
  { id: 'technological', name: 'Technological', nameFr: 'Technologique', color: '#9932CC', bgColor: '#4B0082' },
];

const RISK_CARDS: RiskCard[] = [
  {
    id: 'amazon-wildfires',
    title: 'Amazon Wildfires - Supply Chain Disruption',
    titleFr: 'Incendies en Amazonie - Perturbation de la chaîne d\'approvisionnement',
    category: 'environmental',
    icon: '🔥',
    sourceCountry: 'Brazil',
    targetCountry: 'Global',
    correlation: 'Strong',
    correlationFr: 'Fort',
    confidence: 92,
    timeframe: 'Q3 2024 - Q2 2025',
    timeframeFr: 'Q3 2024 - Q2 2025',
    x: 25,
    y: 35,
  },
  {
    id: 'eu-market-volatility',
    title: 'European Union - Market Volatility',
    titleFr: 'Union Européenne - Volatilité du marché',
    category: 'political',
    icon: '🏛️',
    sourceCountry: 'EU',
    targetCountry: 'Global',
    correlation: 'Strong',
    correlationFr: 'Fort',
    confidence: 88,
    timeframe: 'Ongoing',
    timeframeFr: 'En cours',
    x: 65,
    y: 15,
  },
  {
    id: 'china-resource-shortage',
    title: 'China - Resource Shortage',
    titleFr: 'Chine - Pénurie de ressources',
    category: 'political',
    icon: '🏭',
    sourceCountry: 'China',
    targetCountry: 'Global',
    correlation: 'Strong',
    correlationFr: 'Fort',
    confidence: 85,
    timeframe: 'Q1 2024 - Q2 2025',
    timeframeFr: 'Q1 2024 - Q2 2025',
    x: 75,
    y: 30,
  },
  {
    id: 'us-trade-impact',
    title: 'United States - Trade Impact',
    titleFr: 'États-Unis - Impact commercial',
    category: 'political',
    icon: '🇺🇸',
    sourceCountry: 'USA',
    targetCountry: 'Global',
    correlation: 'Strong',
    correlationFr: 'Fort',
    confidence: 90,
    timeframe: 'Q2 2024 - Q4 2025',
    timeframeFr: 'Q2 2024 - Q4 2025',
    x: 45,
    y: 25,
  },
  {
    id: 'cybersecurity-breach',
    title: 'Cybersecurity Breach - Infrastructure Failure',
    titleFr: 'Violation de cybersécurité - Défaillance des infrastructures',
    category: 'cybersecurity',
    icon: '🔐',
    sourceCountry: 'Global',
    targetCountry: 'Americas',
    correlation: 'Weak',
    correlationFr: 'Faible',
    confidence: 65,
    timeframe: 'Immediate - Short-term',
    timeframeFr: 'Immédiat - Court terme',
    x: 30,
    y: 55,
  },
  {
    id: 'political-instability',
    title: 'Political Instability - Economic Downturn',
    titleFr: 'Instabilité politique - Récession économique',
    category: 'political',
    icon: '🏛️',
    sourceCountry: 'Multiple',
    targetCountry: 'Americas',
    correlation: 'Moderate',
    correlationFr: 'Modéré',
    confidence: 72,
    timeframe: 'Ongoing - Long-term',
    timeframeFr: 'En cours - Long terme',
    x: 50,
    y: 45,
  },
  {
    id: 'argentina-energy',
    title: 'Argentina - Energy Sector Risk',
    titleFr: 'Argentine - Risque du secteur énergétique',
    category: 'political',
    icon: '⚡',
    sourceCountry: 'Argentina',
    targetCountry: 'South America',
    correlation: 'Moderate',
    correlationFr: 'Modéré',
    confidence: 78,
    timeframe: 'Q3 2024 - Q1 2026',
    timeframeFr: 'Q3 2024 - Q1 2026',
    x: 35,
    y: 70,
  },
  {
    id: 'brazil-financial',
    title: 'Brazil - Financial Systems Halt',
    titleFr: 'Brésil - Arrêt des systèmes financiers',
    category: 'political',
    icon: '💰',
    sourceCountry: 'Brazil',
    targetCountry: 'South America',
    correlation: 'Moderate',
    correlationFr: 'Modéré',
    confidence: 68,
    timeframe: 'Q4 2024 - Q2 2026',
    timeframeFr: 'Q4 2024 - Q2 2026',
    x: 28,
    y: 65,
  },
];

export const GlobalRiskCascadeMap: React.FC = () => {
  const { language } = useLanguage();
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [year, setYear] = useState(2024);

  const allRisks = useMemo(() => {
    return RISK_CARDS.map(risk => ({
      ...risk,
      title: language === 'fr' ? risk.titleFr : risk.title,
      correlation: language === 'fr' ? risk.correlationFr : risk.correlation,
      timeframe: language === 'fr' ? risk.timeframeFr : risk.timeframe,
    }));
  }, [language]);

  const filteredRisks = selectedRisk ? allRisks.filter(r => r.id === selectedRisk) : allRisks;

  const getCategoryColor = (category: string) => {
    const cat = RISK_CATEGORIES.find(c => c.id === category);
    return cat?.color || '#999';
  };

  const getCategoryName = (category: string) => {
    const cat = RISK_CATEGORIES.find(c => c.id === category);
    return language === 'fr' ? cat?.nameFr : cat?.name;
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Map */}
      <div className="absolute inset-0 opacity-40">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
              <path d="M 5 0 L 0 0 0 5" fill="none" stroke="#1e293b" strokeWidth="0.1" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
          {/* Simplified world map outline */}
          <path d="M 10 20 L 50 15 L 60 25 L 55 40 L 50 50 L 45 45 L 40 50 L 35 45 L 30 50 L 25 45 L 20 50 L 15 40 Z" 
                fill="none" stroke="#64748b" strokeWidth="0.3" opacity="0.5" />
        </svg>
      </div>

      {/* Header Controls */}
      <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-serif text-amber-50 mb-1">
            {language === 'fr' ? 'Visualisation interactive des cascades de risques' : 'Interactive Risk Cascade Visualization'}
          </h1>
          <p className="text-sm text-slate-400">
            {language === 'fr' ? 'Concept 2: Carte superposée' : 'Concept 2: Layered Overlay Map'}
          </p>
        </div>

        {/* Active Risks Dropdown */}
        <div className="relative">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-600 rounded hover:bg-slate-700 transition text-amber-50">
            <span className="text-sm font-medium">
              {language === 'fr' ? 'Risques actifs' : 'Active Risks'}
            </span>
            <ChevronDown size={16} />
          </button>
          <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded shadow-lg p-3 space-y-2">
            <button 
              onClick={() => setSelectedRisk(null)}
              className="w-full text-left px-3 py-2 hover:bg-slate-800 rounded text-sm text-slate-300"
            >
              {language === 'fr' ? 'Tous les risques' : 'All Risks'}
            </button>
            {allRisks.map(risk => (
              <button
                key={risk.id}
                onClick={() => setSelectedRisk(risk.id)}
                className="w-full text-left px-3 py-2 hover:bg-slate-800 rounded text-sm text-slate-300 flex items-center gap-2"
              >
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: getCategoryColor(risk.category) }}
                />
                {risk.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Category Legend */}
      <div className="absolute bottom-6 left-6 z-20 bg-slate-900 border border-slate-700 rounded p-4 w-64">
        <h3 className="text-sm font-semibold text-amber-50 mb-3">
          {language === 'fr' ? 'Catégories de risques' : 'Risk Category Legend'}
        </h3>
        <div className="space-y-2">
          {RISK_CATEGORIES.map(cat => (
            <div key={cat.id} className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full border border-slate-500" 
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-xs text-slate-400">
                {language === 'fr' ? cat.nameFr : cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Time Slider */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-4">
        <span className="text-sm font-medium text-amber-50">{year}</span>
        <input
          type="range"
          min="1990"
          max="2025"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className="h-48 w-6 appearance-none bg-transparent cursor-pointer"
          style={{
            writingMode: 'vertical-rl' as any,
            WebkitAppearance: 'slider-vertical',
          }}
        />
        <span className="text-xs text-slate-500">1990</span>
      </div>

      {/* Risk Cards Container */}
      <div className="absolute inset-0 pointer-events-none">
        {filteredRisks.map((risk, idx) => (
          <div
            key={risk.id}
            className="absolute pointer-events-auto"
            style={{
              left: `${risk.x}%`,
              top: `${risk.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Arrow from source to target */}
            <svg className="absolute -top-12 -left-8 w-16 h-16 pointer-events-none" viewBox="0 0 100 100">
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" fill="#FFD700" />
                </marker>
              </defs>
              <path
                d={`M 50 50 Q ${50 + (Math.random() - 0.5) * 40} ${50 - 30} 50 0`}
                stroke="#FFD700"
                strokeWidth="2"
                fill="none"
                markerEnd="url(#arrowhead)"
              />
            </svg>

            {/* Risk Card */}
            <button
              onClick={() => setExpandedCard(expandedCard === risk.id ? null : risk.id)}
              className="relative w-48 p-3 rounded border-2 transition-all hover:shadow-lg"
              style={{
                backgroundColor: '#1e1b2e',
                borderColor: getCategoryColor(risk.category),
                boxShadow: `0 0 12px ${getCategoryColor(risk.category)}40`,
              }}
            >
              <div className="flex items-start gap-2">
                <span className="text-xl">{risk.icon}</span>
                <div className="flex-1 text-left">
                  <h4 className="text-xs font-semibold text-amber-50 leading-tight">
                    {risk.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    {getCategoryName(risk.category)}
                  </p>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedCard === risk.id && (
                <div className="mt-3 pt-3 border-t border-slate-700 space-y-2 text-left">
                  <div className="text-xs">
                    <span className="text-slate-400">
                      {language === 'fr' ? 'Corrélation:' : 'Correlation:'}
                    </span>
                    <span 
                      className="ml-2 font-semibold"
                      style={{ color: getCategoryColor(risk.category) }}
                    >
                      {risk.correlation}
                    </span>
                  </div>
                  <div className="text-xs">
                    <span className="text-slate-400">
                      {language === 'fr' ? 'Confiance:' : 'Confidence:'}
                    </span>
                    <span className="ml-2 font-semibold text-amber-50">
                      {risk.confidence}%
                    </span>
                  </div>
                  <div className="text-xs">
                    <span className="text-slate-400">
                      {language === 'fr' ? 'Délai:' : 'Timeframe:'}
                    </span>
                    <span className="ml-2 font-semibold text-amber-50">
                      {risk.timeframe}
                    </span>
                  </div>
                </div>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
