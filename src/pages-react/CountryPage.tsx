/*
 * TransHorizons — Country Analysis Page
 * Design: Editorial Horizon — clean ivory background, gold accents, structured framework
 * Framework: Country Situation Report (Executive Snapshot → Political → Economy → Security → Actors → Risks → Sources)
 * Bilingual: EN/FR toggle
 * France analysis: fully populated from /data/france.ts
 */

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useParams, Link } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { RiskTrendVisualization } from '@/components/RiskTrendVisualization';
import { FlagIcon } from '@/components/FlagIcon';
import { irelandRiskTrends } from '@/data/irelandRiskTrends';
import type { RiskTrendData } from '@/lib/riskTrendTypes';
import {
  ArrowLeft, Globe, Users, MapPin, BarChart2, Shield, TrendingUp,
  AlertTriangle, BookOpen, Clock, ChevronDown, ChevronUp, ExternalLink
} from 'lucide-react';
import { franceAnalysis, type AnalysisContent, type ActorEntry, type RiskEntry, type SourceEntry } from '@/data/france';
import { canadaAnalysis } from '@/data/canada';
import { usaAnalysis } from '@/data/usa';
import { chinaAnalysis } from '@/data/china';
import { russiaAnalysis } from '@/data/russia';
import { japanAnalysis } from '@/data/japan';
import { southKoreaAnalysis } from '@/data/southkorea';
import { irelandAnalysis } from '@/data/ireland';
import { australiaAnalysis } from '@/data/australia';
import { brazilAnalysis } from '@/data/brazil';
import { germanyAnalysis } from '@/data/germany';
import { unitedKingdomAnalysis } from '@/data/united-kingdom';
import { mexicoAnalysis } from '@/data/mexico';
import { indiaAnalysis } from '@/data/india';
import { saudiArabiaAnalysis } from '@/data/saudi-arabia';
import { newZealandAnalysis } from '@/data/new-zealand';
import { indonesiaAnalysis } from '@/data/indonesia';
import { singaporeAnalysis } from '@/data/singapore';
import { vietnamAnalysis } from '@/data/vietnam';
import { chileAnalysis } from '@/data/chile';
import { haitiAnalysis } from '@/data/haiti';
import { turkeyAnalysis } from '@/data/turkey';
import { southAfricaAnalysis } from '@/data/south-africa';
import { congoKinshasaAnalysis } from '@/data/congo-kinshasa';
import { polandAnalysis } from '@/data/poland';
import { ukraineAnalysis } from '@/data/ukraine';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CountryData {
  cca3: string;
  cca2: string;
  ccn3: string;
  nameEn: string;
  nameFr: string;
  capital: string;
  population: number;
  flag: string;
  region: string;
  subregion: string;
  area: number;
  latlng: [number, number];
  independent: boolean;
  unMember: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPopulation(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + ' billion';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + ' million';
  if (n >= 1_000) return (n / 1_000).toFixed(0) + ',000';
  return n.toLocaleString();
}

function formatPopulationFr(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + ' milliard';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + ' million';
  if (n >= 1_000) return (n / 1_000).toFixed(0) + ' 000';
  return n.toLocaleString('fr-FR');
}

// ─── Citation System ──────────────────────────────────────────────────────────

interface FrameworkSectionHandle {
  open: () => void;
}

// Store reference to sources section for opening on citation click
let sourcesFrameworkRef: React.RefObject<FrameworkSectionHandle | null> | null = null;

// Store state for tracking which section the reader was in
let lastClickedSectionName: string = '';
let setLastClickedSectionName: ((name: string) => void) | null = null;

/**
 * Parse inline citations [1], [2], etc. and convert to clickable superscript links
 */
function parseCitations(text: string, sources?: SourceEntry[]): (string | React.ReactNode)[] {
  const parts: (string | React.ReactNode)[] = [];
  const sourceMap = new Map((sources ?? []).map((s) => [s.id, s]));
  const citationRegex = /\[([a-z0-9-]+)\]/g;
  let lastIndex = 0;
  let match;

  while ((match = citationRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const citationNum = match[1];
    parts.push(
      <a
        key={`citation-${match.index}`}
        href={`#source-${citationNum}`}
        className="text-[#7D1A2E] hover:text-[#5A0F1F] transition-colors font-medium"
        style={{
          fontSize: '0.75em',
          verticalAlign: 'super',
          textDecoration: 'none',
          borderBottom: sourceMap.get(citationNum)?.citationType === 'Interpretation'
            ? '1px dotted #7D1A2E'
            : '1px solid #7D1A2E',
        }}
        onClick={(e) => {
          e.preventDefault();
          const element = (e.target as HTMLElement).closest('[data-section]');
          const sectionName = element?.getAttribute('data-section') || 'Report';
          if (setLastClickedSectionName) {
            setLastClickedSectionName(sectionName);
          }
          if (sourcesFrameworkRef?.current) {
            sourcesFrameworkRef.current.open();
          }
          setTimeout(() => {
            const sourceElement = document.getElementById(`source-${citationNum}`);
            if (sourceElement) {
              sourceElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
              sourceElement.classList.add('ring-2', 'ring-[#7D1A2E]', 'ring-offset-2');
              setTimeout(() => {
                sourceElement.classList.remove('ring-2', 'ring-[#7D1A2E]', 'ring-offset-2');
              }, 2000);
            }
          }, 50);
        }}
      >
        {citationNum}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}

// Map of country codes to their analysis data
const analysisMap: Record<string, AnalysisContent> = {
  FRA: franceAnalysis,
  CAN: canadaAnalysis,
  USA: usaAnalysis,
  CHN: chinaAnalysis,
  RUS: russiaAnalysis,
  JPN: japanAnalysis,
  KOR: southKoreaAnalysis,
  IRL: irelandAnalysis,
  AUS: australiaAnalysis,
  BRA: brazilAnalysis,
  DEU: germanyAnalysis,
  GBR: unitedKingdomAnalysis,
  MEX: mexicoAnalysis,
  IND: indiaAnalysis,
  SAU: saudiArabiaAnalysis,
  NZL: newZealandAnalysis,
  IDN: indonesiaAnalysis,
  SGP: singaporeAnalysis,
  VNM: vietnamAnalysis,
  CHL: chileAnalysis,
  HTI: haitiAnalysis,
  TUR: turkeyAnalysis,
  ZAF: southAfricaAnalysis,
  COD: congoKinshasaAnalysis,
  POL: polandAnalysis,
  UKR: ukraineAnalysis,
};

// ─── Collapsible Section ──────────────────────────────────────────────────────

const FrameworkSection = React.forwardRef<FrameworkSectionHandle, {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}>(({ icon: Icon, title, children, defaultOpen = false }, ref) => {
  const [open, setOpen] = useState(defaultOpen);

  React.useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
  }));

  return (
    <div className="border border-[#E8E4DC] mb-4">
      <button
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[#F5F2EC] transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center gap-3">
          <Icon size={15} className="text-[#7D1A2E]" />
          <span className="font-display text-base font-medium text-[#1A1A1A]">{title}</span>
        </div>
        {open ? <ChevronUp size={14} className="text-[#8A8A8A]" /> : <ChevronDown size={14} className="text-[#8A8A8A]" />}
      </button>
      {open && (
        <div className="px-6 pb-6 pt-2 border-t border-[#E8E4DC] bg-white">
          {children}
        </div>
      )}
    </div>
  );
});
FrameworkSection.displayName = 'FrameworkSection';

// ─── Coming Soon placeholder ──────────────────────────────────────────────────

function ComingSoonBlock({ language }: { language: string }) {
  return (
    <div className="py-8 text-center">
      <div className="w-8 h-px bg-[#7D1A2E] mx-auto mb-4" />
      <p className="text-[#8A8A8A] font-body text-sm italic">
        {language === 'fr'
          ? 'Analyse en cours de rédaction — à venir'
          : 'Analysis in progress — coming soon'}
      </p>
      <div className="w-8 h-px bg-[#7D1A2E] mx-auto mt-4" />
    </div>
  );
}

// ─── Scorecard row ────────────────────────────────────────────────────────────

function ScoreRow({ label, value }: { label: string; value: 'High' | 'Med' | 'Low' | null }) {
  const colors: Record<string, string> = {
    High: 'bg-red-100 text-red-700 border-red-200',
    Med: 'bg-amber-100 text-amber-700 border-amber-200',
    Low: 'bg-green-100 text-green-700 border-green-200',
  };
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#F0EDE8] last:border-0">
      <span className="font-body text-sm text-[#4A4A4A]">{label}</span>
      {value ? (
        <span className={`font-body text-xs px-2 py-0.5 border rounded ${colors[value]}`}>{value}</span>
      ) : (
        <span className="font-body text-xs text-[#C0B8AD] italic">—</span>
      )}
    </div>
  );
}

// ─── Actor Card ──────────────────────────────────────────────────────────────

function ActorCard({ actor, language, sources }: { actor: ActorEntry; language: string; sources?: SourceEntry[] }) {
  const [expanded, setExpanded] = useState(false);
  const labels = language === 'fr'
    ? { interests: 'Intérêts', resources: 'Ressources', constraints: 'Contraintes', moves: 'Mouvements probables', deal: 'Négociabilité' }
    : { interests: 'Interests', resources: 'Resources', constraints: 'Constraints', moves: 'Likely moves', deal: 'Dealability' };

  return (
    <div className="border border-[#E8E4DC] bg-[#EFEFEF]">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#F5F2EC] transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        <span className="font-body text-sm font-medium text-[#1A1A1A]">{actor.name}</span>
        {expanded ? <ChevronUp size={12} className="text-[#8A8A8A]" /> : <ChevronDown size={12} className="text-[#8A8A8A]" />}
      </button>
      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-[#E8E4DC] space-y-2">
          {([
            [labels.interests, actor.interests],
            [labels.resources, actor.resources],
            [labels.constraints, actor.constraints],
            [labels.moves, actor.likelyMoves],
            [labels.deal, actor.dealability],
          ] as [string, string][]).map(([label, value]) => (
            <div key={label}>
              <span className="font-body text-[10px] uppercase tracking-widest text-[#7D1A2E]">{label}</span>
              <p className="font-body text-xs text-[#4A4A4A] leading-relaxed mt-0.5">{parseCitations(value, sources)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Risk Row ────────────────────────────────────────────────────────────────

function RiskCard({ risk, language, sources }: { risk: RiskEntry; language: string; sources?: SourceEntry[] }) {
  const [expanded, setExpanded] = useState(false);
  const probColors: Record<string, string> = {
    High: 'bg-red-100 text-red-700 border-red-200',
    Med: 'bg-amber-100 text-amber-700 border-amber-200',
    Low: 'bg-green-100 text-green-700 border-green-200',
  };
  const impactColors = probColors;
  const labels = language === 'fr'
    ? { trigger: 'Déclencheur', prob: 'Probabilité', impact: 'Impact', horizon: 'Horizon', indicators: 'Indicateurs avancés', mitigants: 'Atténuants', lastAssessed: 'Dernière évaluation' }
    : { trigger: 'Trigger', prob: 'Probability', impact: 'Impact', horizon: 'Time horizon', indicators: 'Leading indicators', mitigants: 'Mitigants', lastAssessed: 'Last assessed' };

  return (
    <div className="border border-[#E8E4DC] bg-[#EFEFEF]">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#F5F2EC] transition-colors gap-3"
        onClick={() => setExpanded(e => !e)}
      >
        <span className="font-body text-sm font-medium text-[#1A1A1A] flex-1">{risk.title}</span>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`font-body text-[10px] px-1.5 py-0.5 border rounded ${probColors[risk.probability]}`}>
            {risk.probability}
          </span>
          <span className={`font-body text-[10px] px-1.5 py-0.5 border rounded ${impactColors[risk.impact]}`}>
            {risk.impact}
          </span>
          {expanded ? <ChevronUp size={12} className="text-[#8A8A8A]" /> : <ChevronDown size={12} className="text-[#8A8A8A]" />}
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-[#E8E4DC] space-y-2">
          {([
            [labels.trigger, risk.trigger],
            [labels.horizon, risk.timeHorizon],
            [labels.indicators, risk.leadingIndicators],
            [labels.mitigants, risk.mitigants],
            ...(risk.lastAssessed ? [[labels.lastAssessed, risk.lastAssessed]] : []),
          ] as [string, string][]).map(([label, value]) => (
            <div key={label}>
              <span className="font-body text-[10px] uppercase tracking-widest text-[#7D1A2E]">{label}</span>
              <p className="font-body text-xs text-[#4A4A4A] leading-relaxed mt-0.5">{parseCitations(value, sources)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CountryPage() {
  const { cca3 } = useParams<{ cca3: string }>();
  const { language, setLanguage } = useLanguage();
  const [country, setCountry] = useState<CountryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [clickedSection, setClickedSection] = useState<string>('');
  const sourcesRef = useRef<FrameworkSectionHandle>(null);

  // Update module-level refs for citation handler
  useEffect(() => {
    sourcesFrameworkRef = sourcesRef;
    setLastClickedSectionName = setClickedSection;
  }, []);

  useEffect(() => {
    fetch('/countries-data.json')
      .then(r => r.json())
      .then((data: CountryData[]) => {
        const found = data.find(c => c.cca3.toLowerCase() === cca3?.toLowerCase());
        setCountry(found || null);
        setLoading(false);
      });
  }, [cca3]);

  // Get analysis data if available
  const analysis = useMemo(() => {
    if (!cca3) return null;
    return analysisMap[cca3.toUpperCase()] || null;
  }, [cca3]);

  const lang = useMemo(() => {
    if (!analysis) return null;
    return language === 'fr' ? analysis.fr : analysis.en;
  }, [analysis, language]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EFEFEF] flex items-center justify-center">
        <div className="w-8 h-8 border border-[#7D1A2E]/30 border-t-[#7D1A2E] rounded-full animate-spin" />
      </div>
    );
  }

  if (!country) {
    return (
      <div className="min-h-screen bg-[#EFEFEF] flex flex-col items-center justify-center gap-4">
        <p className="font-body text-[#4A4A4A]">
          {language === 'fr' ? 'Pays introuvable.' : 'Country not found.'}
        </p>
        <Link href="/world-analysis" className="text-[#7D1A2E] font-body text-sm hover:underline">
          ← {language === 'fr' ? 'Retour' : 'Back'}
        </Link>
      </div>
    );
  }

  const name = language === 'fr' ? country.nameFr : country.nameEn;
  const pop = language === 'fr' ? formatPopulationFr(country.population) : formatPopulation(country.population);

  const regionFrMap: Record<string, string> = {
    'Africa': 'Afrique',
    'Americas': 'Amériques',
    'Asia': 'Asie',
    'Europe': 'Europe',
    'Oceania': 'Océanie',
    'Antarctic': 'Antarctique',
    // subregions
    'Northern Africa': 'Afrique du Nord',
    'Sub-Saharan Africa': 'Afrique subsaharienne',
    'Eastern Africa': 'Afrique de l\'Est',
    'Western Africa': 'Afrique de l\'Ouest',
    'Middle Africa': 'Afrique centrale',
    'Southern Africa': 'Afrique australe',
    'Northern America': 'Amérique du Nord',
    'South America': 'Amérique du Sud',
    'Central America': 'Amérique centrale',
    'Caribbean': 'Caraïbes',
    'Northern Europe': 'Europe du Nord',
    'Southern Europe': 'Europe du Sud',
    'Western Europe': 'Europe de l\'Ouest',
    'Eastern Europe': 'Europe de l\'Est',
    'Central Europe': 'Europe centrale',
    'Central Asia': 'Asie centrale',
    'Eastern Asia': 'Asie de l\'Est',
    'South-Eastern Asia': 'Asie du Sud-Est',
    'Southern Asia': 'Asie du Sud',
    'Western Asia': 'Asie de l\'Ouest',
    'Middle East': 'Moyen-Orient',
    'Australia and New Zealand': 'Australie et Nouvelle-Zélande',
    'Melanesia': 'Mélanésie',
    'Micronesia': 'Micronésie',
    'Polynesia': 'Polynésie',
    'Asia-Pacific': 'Asie-Pacifique',
    'North America': 'Amérique du Nord',
  };
  const translateRegion = (val: string) =>
    language === 'fr' ? (regionFrMap[val] ?? val) : val;

  const t = {
    back: language === 'fr' ? 'Retour au globe' : 'Back to globe',
    lastUpdated: language === 'fr' ? 'Dernière mise à jour' : 'Last updated',
    never: language === 'fr' ? 'Jamais' : 'Never',
    population: language === 'fr' ? 'Population' : 'Population',
    capital: language === 'fr' ? 'Capitale' : 'Capital',
    region: language === 'fr' ? 'Région' : 'Region',
    area: language === 'fr' ? 'Superficie' : 'Area',
    exec: language === 'fr' ? 'Synthèse exécutive' : 'Executive Snapshot',
    political: language === 'fr' ? 'Stabilité politique' : 'Political Stability',
    economy: language === 'fr' ? 'Économie' : 'Economy',
    security: language === 'fr' ? 'Sécurité & Diplomatie' : 'Security & Diplomacy',
    actors: language === 'fr' ? 'Carte des acteurs' : 'Actors Map',
    risks: language === 'fr' ? 'Registre des risques' : 'Risk Register',
    sources: language === 'fr' ? 'Sources recommandées' : 'Recommended Sources',
    eliteCohesion: language === 'fr' ? 'Cohésion des élites' : 'Elite cohesion',
    securityLoyalty: language === 'fr' ? 'Loyauté des forces' : 'Security loyalty',
    economicPressure: language === 'fr' ? 'Pression économique' : 'Economic pressure',
    protestCapacity: language === 'fr' ? 'Capacité de mobilisation' : 'Protest/mobilization capacity',
    institutionalResilience: language === 'fr' ? 'Résilience institutionnelle' : 'Institutional resilience',
    powerStructure: language === 'fr' ? 'Structure du pouvoir' : 'Power structure',
    stabilityDrivers: language === 'fr' ? 'Facteurs de stabilité' : 'Stability drivers',
    shockAbsorbers: language === 'fr' ? 'Amortisseurs & accélérateurs' : 'Shock absorbers & accelerants',
    macroReality: language === 'fr' ? 'Réalité macroéconomique' : 'Macro reality',
    externalVuln: language === 'fr' ? 'Vulnérabilité externe' : 'External vulnerability',
    politicalEconomy: language === 'fr' ? 'Économie politique' : 'Political economy',
    internalSecurity: language === 'fr' ? 'Sécurité intérieure' : 'Internal security',
    diplomacy: language === 'fr' ? 'Diplomatie & posture extérieure' : 'Diplomacy & external posture',
    domesticActors: language === 'fr' ? 'Acteurs nationaux' : 'Domestic actors',
    externalActors: language === 'fr' ? 'Acteurs extérieurs' : 'External actors',
  };

  const hasAnalysis = !!analysis && !!lang;
  const activeSources = analysis?.sources ?? lang?.sources ?? [];

  return (
    <div className="min-h-screen bg-[#EFEFEF]">

      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-[#EFEFEF]/95 backdrop-blur-sm border-b border-[#E8E4DC]">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-[#4A4A4A] hover:text-[#7D1A2E] transition-colors font-body text-sm"
            >
              <ArrowLeft size={14} />
              {language === 'fr' ? 'Accueil' : 'Home'}
            </Link>
            <span className="text-[#C0B8AD]">·</span>
            <Link
              href="/world-analysis"
              className="flex items-center gap-2 text-[#4A4A4A] hover:text-[#7D1A2E] transition-colors font-body text-sm"
            >
              <ArrowLeft size={14} />
              {t.back}
            </Link>
          </div>
          <div className="flex items-center gap-1 text-xs font-body">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 transition-colors ${language === 'en' ? 'text-[#7D1A2E] font-medium' : 'text-[#8A8A8A] hover:text-[#4A4A4A]'}`}
            >
              EN
            </button>
            <span className="text-[#C0B8AD]">|</span>
            <button
              onClick={() => setLanguage('fr')}
              className={`px-2 py-1 transition-colors ${language === 'fr' ? 'text-[#7D1A2E] font-medium' : 'text-[#8A8A8A] hover:text-[#4A4A4A]'}`}
            >
              FR
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Country header */}
        <div className="mb-12">
          <div className="flex items-start gap-6 mb-6">
            <FlagIcon
            cca2={country.cca2}
            emoji={country.flag}
            label={name}
            size="4.5rem"
            className="leading-none"
          />
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-light text-[#1A1A1A] leading-tight">
                  {name}
                </h1>
                <FlagIcon
                  cca2={country.cca2}
                  emoji={country.flag}
                  label={name}
                  size="4.5rem"
                  className="leading-none"
                />
              </div>
              <p className="text-[#7D1A2E] font-body text-xs tracking-[0.3em] uppercase mt-1">
                {country.cca3} · {translateRegion(country.region)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { icon: MapPin, label: t.capital, value: country.capital || '—' },
              { icon: Users, label: t.population, value: pop },
              { icon: Globe, label: t.region, value: translateRegion(country.subregion || country.region) },
              { icon: BarChart2, label: t.area, value: country.area > 0 ? country.area.toLocaleString() + ' km²' : '—' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-white border border-[#E8E4DC] px-4 py-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon size={11} className="text-[#7D1A2E]" />
                  <span className="font-body text-[10px] tracking-widest uppercase text-[#8A8A8A]">{label}</span>
                </div>
                <p className="font-body text-sm text-[#1A1A1A] font-medium">{value}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[#8A8A8A]">
            <Clock size={11} />
            <span className="font-body text-xs">
              {t.lastUpdated}: {hasAnalysis ? analysis!.lastUpdated : t.never}
            </span>
          </div>
        </div>

        {/* ── Framework sections ── */}

        {/* 1. Executive Snapshot */}
        <div data-section="Executive Snapshot">
        <FrameworkSection icon={TrendingUp} title={t.exec} defaultOpen={true}>
          {hasAnalysis ? (
            <div className="space-y-3">
              {lang!.executiveSnapshot.map((bullet, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-[#7D1A2E] font-body text-sm mt-0.5 shrink-0">·</span>
                  <p className="font-body text-sm text-[#4A4A4A] leading-relaxed">{parseCitations(bullet, activeSources)}</p>
                </div>
              ))}
            </div>
          ) : (
            <ComingSoonBlock language={language} />
          )}
        </FrameworkSection>
        </div>

        {/* 2. Political Stability */}
        <div data-section="Political Stability">
        <FrameworkSection icon={Shield} title={t.political}>
          {hasAnalysis ? (
            <div className="space-y-6">
              {/* Scorecard */}
              <div>
                <p className="font-body text-xs text-[#8A8A8A] uppercase tracking-widest mb-3">
                  {language === 'fr' ? 'Tableau de bord rapide' : 'Quick scorecard'}
                </p>
                <ScoreRow label={t.eliteCohesion} value={analysis!.scorecard.eliteCohesion} />
                <ScoreRow label={t.securityLoyalty} value={analysis!.scorecard.securityLoyalty} />
                <ScoreRow label={t.economicPressure} value={analysis!.scorecard.economicPressure} />
                <ScoreRow label={t.protestCapacity} value={analysis!.scorecard.protestCapacity} />
                <ScoreRow label={t.institutionalResilience} value={analysis!.scorecard.institutionalResilience} />
              </div>
              {/* Subsections */}
              {([
                [t.powerStructure, lang!.political.powerStructure],
                [t.stabilityDrivers, lang!.political.stabilityDrivers],
                [t.shockAbsorbers, lang!.political.shockAbsorbers],
              ] as [string, string][]).map(([title, text]) => (
                <div key={title}>
                  <h4 className="font-body text-xs text-[#7D1A2E] uppercase tracking-widest mb-2">{title}</h4>
                  <p className="font-body text-sm text-[#4A4A4A] leading-relaxed">{parseCitations(text, activeSources)}</p>
                </div>
              ))}
            </div>
          ) : (
            <>
              <ComingSoonBlock language={language} />
              <div className="mt-6">
                <p className="font-body text-xs text-[#8A8A8A] uppercase tracking-widest mb-3">
                  {language === 'fr' ? 'Tableau de bord rapide' : 'Quick scorecard'}
                </p>
                <ScoreRow label={t.eliteCohesion} value={null} />
                <ScoreRow label={t.securityLoyalty} value={null} />
                <ScoreRow label={t.economicPressure} value={null} />
                <ScoreRow label={t.protestCapacity} value={null} />
                <ScoreRow label={t.institutionalResilience} value={null} />
              </div>
            </>
          )}
        </FrameworkSection>
        </div>

        {/* 3. Economy */}
        <div data-section="Economy">
        <FrameworkSection icon={BarChart2} title={t.economy}>
          {hasAnalysis ? (
            <div className="space-y-6">
              {([
                [t.macroReality, lang!.economy.macroReality],
                [t.externalVuln, lang!.economy.externalVulnerability],
                [t.politicalEconomy, lang!.economy.politicalEconomy],
              ] as [string, string][]).map(([title, text]) => (
                <div key={title}>
                  <h4 className="font-body text-xs text-[#7D1A2E] uppercase tracking-widest mb-2">{title}</h4>
                  <p className="font-body text-sm text-[#4A4A4A] leading-relaxed">{parseCitations(text, activeSources)}</p>
                </div>
              ))}
            </div>
          ) : (
            <ComingSoonBlock language={language} />
          )}
        </FrameworkSection>
        </div>

        {/* 4. Security & Diplomacy */}
        <div data-section="Security & Diplomacy">
        <FrameworkSection icon={Globe} title={t.security}>
          {hasAnalysis ? (
            <div className="space-y-6">
              {([
                [t.internalSecurity, lang!.security.internal],
                [t.diplomacy, lang!.security.diplomacy],
              ] as [string, string][]).map(([title, text]) => (
                <div key={title}>
                  <h4 className="font-body text-xs text-[#7D1A2E] uppercase tracking-widest mb-2">{title}</h4>
                  <p className="font-body text-sm text-[#4A4A4A] leading-relaxed">{parseCitations(text, activeSources)}</p>
                </div>
              ))}
            </div>
          ) : (
            <ComingSoonBlock language={language} />
          )}
        </FrameworkSection>
        </div>

        {/* 5. Actors Map */}
        <div data-section="Actors">
        <FrameworkSection icon={Users} title={t.actors}>
          {hasAnalysis ? (
            <div className="space-y-6">
              <div>
                <h4 className="font-body text-xs text-[#7D1A2E] uppercase tracking-widest mb-3">{t.domesticActors}</h4>
                <div className="space-y-2">
                  {lang!.actors.domestic.map((actor) => (
                    <ActorCard key={actor.name} actor={actor} language={language} sources={activeSources} />
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-body text-xs text-[#7D1A2E] uppercase tracking-widest mb-3">{t.externalActors}</h4>
                <div className="space-y-2">
                  {lang!.actors.external.map((actor) => (
                    <ActorCard key={actor.name} actor={actor} language={language} sources={activeSources} />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              <ComingSoonBlock language={language} />
              <div className="mt-4 text-[#8A8A8A] font-body text-xs leading-relaxed">
                <p className="font-medium text-[#4A4A4A] mb-2">
                  {language === 'fr' ? 'Pour chaque acteur : Intérêts · Ressources · Contraintes · Mouvements probables · Négociabilité' : 'For each actor: Interests · Resources · Constraints · Likely moves · Dealability'}
                </p>
              </div>
            </>
          )}
        </FrameworkSection>
        </div>

        {/* 6. Risk Register */}
        <div data-section="Risk Register">
        <FrameworkSection icon={AlertTriangle} title={t.risks} defaultOpen={true}>
          {hasAnalysis ? (
            <div className="space-y-2">
              {/* Legend */}
              <div className="flex items-center gap-4 mb-3 text-[10px] font-body text-[#8A8A8A]">
                <span>{language === 'fr' ? 'Badges :' : 'Badges:'}</span>
                <span className="px-1.5 py-0.5 border rounded bg-red-100 text-red-700 border-red-200">
                  {language === 'fr' ? 'Élevé' : 'High'}
                </span>
                <span className="px-1.5 py-0.5 border rounded bg-amber-100 text-amber-700 border-amber-200">
                  {language === 'fr' ? 'Moyen' : 'Med'}
                </span>
                <span className="px-1.5 py-0.5 border rounded bg-green-100 text-green-700 border-green-200">
                  {language === 'fr' ? 'Faible' : 'Low'}
                </span>
                <span className="ml-2 italic">{language === 'fr' ? '(Probabilité · Impact)' : '(Probability · Impact)'}</span>
              </div>
              {lang!.risks.map((risk) => {
                // Check if this risk has trend data (Ireland only for now)
                const riskKey = risk.title.toLowerCase().split(' ').join('-');
                const trendData = cca3?.toUpperCase() === 'IRL' 
                  ? irelandRiskTrends[riskKey]
                  : null;
                
                return (
                  <div key={risk.title}>
                    <RiskCard risk={risk} language={language} sources={activeSources} />
                    {trendData && <RiskTrendVisualization trendData={trendData} language={language} />}
                  </div>
                );
              })}
            </div>
          ) : (
            <>
              <ComingSoonBlock language={language} />
              <div className="mt-4 text-[#8A8A8A] font-body text-xs leading-relaxed">
                <p className="font-medium text-[#4A4A4A] mb-2">
                  {language === 'fr'
                    ? 'Chaque risque : Déclencheur · Probabilité · Impact · Horizon · Indicateurs avancés · Atténuants'
                    : 'Each risk: Trigger · Probability · Impact · Time horizon · Leading indicators · Mitigants'}
                </p>
              </div>
            </>
          )}
        </FrameworkSection>
        </div>

        {/* 7. Sources */}
        <FrameworkSection ref={sourcesRef} icon={BookOpen} title={t.sources}>
          <div className="space-y-2 mt-2">
            {(hasAnalysis ? (analysis!.sources ?? lang!.sources ?? []) : [
              { name: 'IMF', url: 'https://www.imf.org', desc: language === 'fr' ? 'Macro & dette' : 'Macro & debt' },
              { name: 'World Bank', url: 'https://data.worldbank.org', desc: language === 'fr' ? 'Données de développement' : 'Development data' },
              { name: 'V-Dem Institute', url: 'https://v-dem.net', desc: language === 'fr' ? 'Gouvernance & démocratie' : 'Governance & democracy' },
              { name: 'Freedom House', url: 'https://freedomhouse.org', desc: language === 'fr' ? 'Libertés civiles' : 'Civil liberties' },
              { name: 'Transparency International', url: 'https://www.transparency.org', desc: language === 'fr' ? 'Corruption' : 'Corruption' },
              { name: 'ACLED', url: 'https://acleddata.com', desc: language === 'fr' ? 'Données conflits & événements' : 'Conflict & event data' },
              { name: 'SIPRI', url: 'https://www.sipri.org', desc: language === 'fr' ? 'Armements & sécurité' : 'Arms & security' },
              { name: 'World Justice Project', url: 'https://worldjusticeproject.org', desc: language === 'fr' ? 'État de droit' : 'Rule of law' },
            ] as SourceEntry[]).map(({ id: sourceId, name, url, desc, publicationDate, accessDate, confidence, citationType }, idx) => {
              const confidenceColor = confidence === 'High' ? 'bg-green-50 border-green-200' : confidence === 'Med' ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200';
              const confidenceLabel = confidence === 'High' ? '✓ High' : confidence === 'Med' ? '◐ Medium' : '✗ Low';
              const confidenceTextColor = confidence === 'High' ? 'text-green-700' : confidence === 'Med' ? 'text-yellow-700' : 'text-red-700';
              const citationNum = sourceId ?? (idx + 1);
              return (
                <a
                  key={name + idx}
                  id={`source-${citationNum}`}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-start justify-between px-4 py-3 border transition-colors group focus:ring-2 focus:ring-[#7D1A2E] focus:ring-offset-2 ${
                    confidence ? confidenceColor : 'border-[#E8E4DC] hover:border-[#7D1A2E] hover:bg-[#FDF9F3]'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-body text-sm font-medium text-[#1A1A1A] group-hover:text-[#7D1A2E] transition-colors">{name}</p>
                      {citationType && <span className="text-[10px] font-medium px-1.5 py-0.5 bg-[#E8E4DC] text-[#7D1A2E] rounded">{citationType}</span>}
                    </div>
                    <p className="font-body text-xs text-[#8A8A8A] mb-2">{desc}</p>
                    <div className="flex flex-wrap gap-2 items-center text-[10px]">
                      {publicationDate && <span className="text-[#8A8A8A]">Pub: {publicationDate}</span>}
                      {accessDate && <span className="text-[#8A8A8A]">Accessed: {accessDate}</span>}
                      {confidence && <span className={`font-medium ${confidenceTextColor}`}>{confidenceLabel}</span>}
                    </div>
                  </div>
                  <ExternalLink size={12} className="text-[#7D1A2E] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1 ml-2" />
                </a>
              );
            })}
          </div>
          {/* Floating Back Button */}
          {clickedSection && (
            <div className="fixed bottom-6 right-6 p-3 bg-[#FDF9F3] border border-[#7D1A2E] rounded shadow-lg flex items-center gap-3 z-40 max-w-xs">
              <span className="font-body text-xs text-[#4A4A4A] hidden sm:inline">
                {language === 'fr' ? 'Vous lisiez : ' : 'You were reading: '}
                <span className="font-medium text-[#7D1A2E]">{clickedSection}</span>
              </span>
              <button
                onClick={() => {
                  const sectionElement = document.querySelector(`[data-section="${clickedSection}"]`);
                  if (sectionElement) {
                    sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="px-3 py-1.5 bg-[#7D1A2E] text-white text-xs font-medium rounded hover:bg-[#5A0F1F] transition-colors whitespace-nowrap shrink-0"
              >
                {language === 'fr' ? 'Retour' : 'Back'}
              </button>
            </div>
          )}
        </FrameworkSection>

      </div>
    </div>
  );
}
