/*
 * TransHorizons — World Analysis Page
 * Design: Editorial Horizon — dark page, choropleth globe using react-globe.gl
 *
 * Layout (scrollable):
 *   1. Top bar (52px)
 *   2. Country Reports row — globe (left) + scrollable country list (right), fixed height = 100vh - top bar
 *   3. World Views section — editorial header + tool cards (Critical Minerals Map, …)
 */

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import GlobeGL from 'react-globe.gl';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link, useLocation } from 'wouter';
import { FlagIcon } from '@/components/FlagIcon';
import {
  ArrowLeft, ArrowRight, Globe, Search, Map as MapIcon, ChevronRight, Network, Filter, Info,
} from 'lucide-react';
import { ANALYSED_COUNTRIES } from '@/lib/analysedCountries';
import { COUNTRY_METADATA } from '@/lib/countryMetadata';
import CountryFilterPanel, { type FilterState } from '@/components/CountryFilterPanel';

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

interface GeoFeature {
  type: string;
  properties: Record<string, any>;
  geometry: any;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const GLOBE_IMG = 'https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg';
const BG_IMG    = 'https://cdn.jsdelivr.net/npm/three-globe/example/img/night-sky.png';

const MAP_COLORS: Record<number, string> = {
  1: '#2D6A9F',
  2: '#2E8B6E',
  3: '#8B5E2E',
  4: '#7B3F8B',
  5: '#8B2E2E',
  6: '#4A7A3A',
  7: '#2E5C8B',
  8: '#8B7A2E',
  9: '#5E3A6E',
};

const HOVER_COLOR    = '#A0243A';
const CANADA_COLOR   = '#B22222';
const MEXICO_COLOR   = '#0B5D1E';
const PORTUGAL_COLOR = '#D4AF37';
const ANALYSED_SET   = new Set(ANALYSED_COUNTRIES);
const TOP_BAR_H      = 52;

// ─── World Views tool cards ───────────────────────────────────────────────────

interface ToolCard {
  href: string;
  titleEn: string;
  titleFr: string;
  descEn: string;
  descFr: string;
  tagEn: string;
  tagFr: string;
  icon: React.ReactNode;
  accent: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPop(n: number, fr: boolean): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + (fr ? ' Md' : 'B');
  if (n >= 1_000_000)     return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)         return (n / 1_000).toFixed(0) + 'K';
  return n.toString();
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function WorldAnalysis() {
  const globeRef           = useRef<any>(null);
  const globeContainerRef  = useRef<HTMLDivElement>(null);
  const [geoFeatures, setGeoFeatures] = useState<GeoFeature[]>([]);
  const [countries, setCountries]     = useState<CountryData[]>([]);
  const [hoverD, setHoverD]           = useState<GeoFeature | null>(null);
  const [search, setSearch]           = useState('');
  const [loaded, setLoaded]           = useState(false);
  const [, navigate] = useLocation();
  const [globeSize, setGlobeSize]     = useState({ w: 800, h: 600 });
  const { language, setLanguage }     = useLanguage();
  const [showFilters, setShowFilters] = useState(false);
  const [showFilterInfo, setShowFilterInfo] = useState(false);
  const [showCountryDisclaimer, setShowCountryDisclaimer] = useState(false);
  const [filters, setFilters]         = useState<FilterState>({
    regions: new Set(),
    riskCategories: new Set(),
    topics: new Set(),
  });

  const fr = language === 'fr';

  const mouseDownPos = useRef<{ x: number; y: number } | null>(null);

  // ── Resize observer for globe container ───────────────────────────────────
  useEffect(() => {
    const el = globeContainerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setGlobeSize({ w: Math.floor(width), h: Math.floor(height) });
        }
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── Load data ──────────────────────────────────────────────────────────────
  useEffect(() => {
    Promise.all([
      fetch('/ne_110m_countries.geojson').then(r => r.json()),
      fetch('/countries-data.json').then(r => r.json()),
    ]).then(([geo, countriesData]: [any, CountryData[]]) => {
      const features = geo.features.filter(
        (f: GeoFeature) => f.properties.ISO_A2 !== 'AQ'
      );
      setGeoFeatures(features);
      setCountries(countriesData);
      setLoaded(true);
    });
  }, []);

  // ── Configure globe after mount ────────────────────────────────────────────
  useEffect(() => {
    if (!globeRef.current || !loaded) return;
    const globe = globeRef.current;

    globe.pointOfView({ lat: 30, lng: 0, altitude: 2.2 }, 0);

    const scene = globe.scene();
    if (scene) {
      scene.rotation.z = 23.5 * (Math.PI / 180);
    }

    const controls = globe.controls();
    if (controls) {
      controls.autoRotate = false;
      controls.enableZoom = true;
      controls.minDistance = 120;
      controls.maxDistance = 600;
    }

    const canvas = globe.renderer().domElement;
    const onDown = (e: MouseEvent) => {
      mouseDownPos.current = { x: e.clientX, y: e.clientY };
    };
    canvas.addEventListener('mousedown', onDown);
    return () => canvas.removeEventListener('mousedown', onDown);
  }, [loaded]);

  // ── Build lookup: ISO_A3 → CountryData ─────────────────────────────────────
  const countryLookup = useMemo(() => {
    const map = new Map<string, CountryData>();
    countries.forEach(c => {
      map.set(c.cca3, c);
      map.set(c.cca2, c);
    });
    return map;
  }, [countries]);

  // ── Polygon accessors ───────────────────────────────────────────────
  const getColor = useCallback((d: any) => {
    if (d === hoverD) return HOVER_COLOR;

    const props = d.properties || {};
    const codes = [
      props.ISO_A3, props.ISO_A3_EH, props.ADM0_A3,
      props.WB_A3, props.ADM0_A3_US, props.ADM0_A3_IS,
      props.GU_A3, props.SU_A3, props.BRK_A3, props.ISO_A2,
    ];
    if (codes.includes('CAN')) return CANADA_COLOR;
    if (codes.includes('MEX')) return MEXICO_COLOR;
    if (codes.includes('PRT')) return PORTUGAL_COLOR;

    const mc = d.properties?.MAPCOLOR9 || 1;
    return MAP_COLORS[mc] || MAP_COLORS[1];
  }, [hoverD]);

  const getAltitude = useCallback((d: any) => {
    return d === hoverD ? 0.04 : 0.01;
  }, [hoverD]);

  const resolveCountry = useCallback((props: Record<string, any>): CountryData | undefined => {
    const candidates = [
      props.ISO_A3, props.ISO_A3_EH, props.ADM0_A3,
      props.WB_A3, props.ADM0_A3_US, props.ADM0_A3_IS,
      props.GU_A3, props.SU_A3, props.BRK_A3,
    ];
    for (const code of candidates) {
      if (code && code !== '-99' && code !== '-1') {
        const found = countryLookup.get(code);
        if (found) return found;
      }
    }
    if (props.ISO_A2 && props.ISO_A2 !== '-99') {
      return countryLookup.get(props.ISO_A2);
    }
    return undefined;
  }, [countryLookup]);

  const getLabel = useCallback((d: any) => {
    const props = d.properties;
    const cd = resolveCountry(props);
    const name = cd
      ? (fr ? cd.nameFr : cd.nameEn)
      : props.ADMIN || props.NAME || '';
    const pop = cd ? cd.population : props.POP_EST || 0;
    const codes = [
      props.ISO_A3, props.ISO_A3_EH, props.ADM0_A3,
      props.WB_A3, props.ADM0_A3_US, props.ADM0_A3_IS,
      props.GU_A3, props.SU_A3, props.BRK_A3,
    ];
    const hasReport = codes.some(c => c && c !== '-99' && c !== '-1' && ANALYSED_SET.has(c));
    const bg      = hasReport ? 'rgba(125,26,46,0.97)' : 'rgba(13,13,13,0.95)';
    const border  = hasReport ? 'rgba(160,36,58,0.6)'  : 'rgba(125,26,46,0.4)';
    const subColor = hasReport ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.5)';
    const ctaColor = hasReport ? 'rgba(255,255,255,0.85)' : 'rgba(160,36,58,0.9)';
    const reportBadge = hasReport
      ? `<div style="display:inline-block;background:rgba(255,255,255,0.15);color:#fff;font-size:9px;letter-spacing:0.12em;text-transform:uppercase;padding:2px 6px;margin-bottom:5px;">${fr ? 'Rapport disponible' : 'Report available'}</div>`
      : '';
    return `
      <div style="background:${bg};border:1px solid ${border};padding:8px 12px;font-family:system-ui;min-width:140px;">
        ${reportBadge}
        <div style="color:#fff;font-size:13px;font-weight:500;margin-bottom:4px;display:flex;align-items:center;gap:6px;">
          ${cd?.cca2 ? `<img src="https://flagcdn.com/${cd.cca2.toLowerCase()}.svg" alt="" style="width:20px;height:14px;object-fit:cover;border-radius:1px;">` : ''} ${name}
        </div>
        <div style="color:${subColor};font-size:11px;">${cd?.capital ? cd.capital : '—'}</div>
        <div style="color:${subColor};font-size:11px;">Population: ${formatPop(pop, fr)}</div>
        <div style="color:${ctaColor};font-size:10px;margin-top:4px;">
          ${fr ? 'Cliquer pour ouvrir' : 'Click to open'}
        </div>
      </div>
    `;
  }, [resolveCountry, fr]);

  const goToCountry = useCallback((cca3: string) => {
    window.location.href = `/country/${cca3.toLowerCase()}`;
  }, []);

  const onPolygonClick = useCallback((d: any, event: any) => {
    if (!d) return;
    if (mouseDownPos.current && event) {
      const dx = Math.abs(event.clientX - mouseDownPos.current.x);
      const dy = Math.abs(event.clientY - mouseDownPos.current.y);
      if (dx + dy > 6) return;
    }
    const props = d.properties;
    const cd = resolveCountry(props);
    if (cd) goToCountry(cd.cca3);
  }, [resolveCountry, goToCountry]);

    // ── Sidebar data ──────────────────────────────────────────────────────
  const filteredCountries = useMemo(() => {
    const sorted = [...countries].sort((a, b) => {
      const na = fr ? a.nameFr : a.nameEn;
      const nb = fr ? b.nameFr : b.nameEn;
      return na.localeCompare(nb);
    });
    
    // Apply text search
    let result = sorted;
    if (search.trim()) {
    const q = search.toLowerCase();
      result = result.filter(c =>
      c.nameEn.toLowerCase().includes(q) ||
      c.nameFr.toLowerCase().includes(q) ||
      c.cca3.toLowerCase().includes(q)
    );
    }
    
    // Apply metadata filters
    const hasActiveFilters = 
      filters.regions.size > 0 || 
      filters.riskCategories.size > 0 || 
      filters.topics.size > 0;
    
    if (hasActiveFilters) {
      result = result.filter(c => {
        const meta = COUNTRY_METADATA[c.cca3];
        if (!meta) return false; // Exclude if no metadata when filters are active
        
        // Check region filter
        if (filters.regions.size > 0 && !filters.regions.has(meta.region)) {
          return false;
        }
        
        // Check risk category filter
        if (filters.riskCategories.size > 0 && !filters.riskCategories.has(meta.riskCategory)) {
          return false;
        }
        
        // Check topics filter (must have at least one matching topic)
        if (filters.topics.size > 0) {
          const hasMatchingTopic = meta.topics.some(topic => filters.topics.has(topic));
          if (!hasMatchingTopic) return false;
        }
        
        return true;
      });
    }
    
    return result;
  }, [countries, search, fr, filters]);

  const groupedCountries = useMemo(() => {
    const groups: Record<string, CountryData[]> = {};
    filteredCountries.forEach(c => {
      const name = fr ? c.nameFr : c.nameEn;
      const letter = name.charAt(0).toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(c);
    });
    return groups;
  }, [filteredCountries, fr]);

  const hintText = fr
    ? `Outil conservé comme prototype expérimental conceptuellement prometteur, soulignant les limites actuelles de la recherche assistée par IA. Malgré un cadre rigoureux élaboré avec Manus, des instructions structurées et des contraintes de sources définies vérifiées avec Perplexity Pro, ainsi qu'une infrastructure de schéma/Git/validation conçue avec Claude Opus 4.7 et Claude Sonnet 4.6, les résultats produits n'ont jamais respecté les contraintes de sources imposées. L'exercice demeure un cas d'apprentissage précieux sur les limites pratiques de la synthèse automatisée et des IA, même dans des conditions strictement contrôlées.`
    : '(This tool is kept as a conceptually promising experimental prototype highlighting however current limitations in AI-assisted research workflows. Despite a rigorous framework created with Manus, structured prompts and defined source constraints checked with Perplexity Pro, and a schema/Git/validation infrastructure created with Claude Opus 4.7 and Claude Sonnet 4.6, outputs never respected the source constraints. The exercise remains valuable as a learning case on the practical limits of automated synthesis and AIs even under strictly controlled conditions.)';

  // ── World Views tool cards ────────────────────────────────────────────────
  const toolCards: ToolCard[] = [
    {
      href: '/tools/critical-minerals-map',
      titleEn: 'Critical Minerals World Map',
      titleFr: 'Carte mondiale des minéraux critiques',
      descEn: 'Interactive choropleth covering all 34 minerals on Canada\'s NRCan 2024 list — mine production, known reserves, top producers, and Canada\'s strategic role for each mineral.',
      descFr: 'Carte choroplèthe interactive couvrant les 34 minéraux de la liste NRCan 2024 du Canada — production minière, réserves connues, principaux producteurs et rôle stratégique du Canada.',
      tagEn: 'Resources · Geopolitics',
      tagFr: 'Ressources · Géopolitique',
      icon: <MapIcon size={18} />,
      accent: '#C8860A',
    },
    {
      href: '#',
      titleEn: 'Technology Supply Chains',
      titleFr: 'Chaînes d\'approvisionnement technologiques',
      descEn: 'Mapping the global dependencies behind semiconductors, batteries, and AI hardware — from raw material extraction to finished product, and the chokepoints in between.',
      descFr: 'Cartographie des dépendances mondiales derrière les semi-conducteurs, les batteries et le matériel IA — de l\'extraction des matières premières au produit fini, et les points de blocage.',
      tagEn: 'Technology · Trade',
      tagFr: 'Technologie · Commerce',
      icon: <Network size={18} />,
      accent: '#2E8B6E',
    },
  ];

  // ── Render ────────────────────────────────────────────────────────────────
  // Row height = viewport minus top bar; both globe and country list are capped to this
  const rowH = `calc(100vh - ${TOP_BAR_H}px)`;

  return (
    <div className="bg-[#080810] min-h-screen flex flex-col">

      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <div
        className="shrink-0 bg-[#080810]/90 backdrop-blur-sm border-b border-white/10 sticky top-0 z-30"
        style={{ height: TOP_BAR_H }}
      >
        <div className="max-w-[1600px] mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-[#7D1A2E] transition-colors font-body text-sm no-underline">
            <ArrowLeft size={14} />
            {fr ? 'Retour' : 'Back'}
          </Link>
          <div className="flex items-center gap-2">
            <Globe size={12} className="text-[#7D1A2E]" />
            <span className="text-[#7D1A2E] font-body text-xs tracking-[0.3em] uppercase">
              {fr ? 'Vues du monde' : 'World Views'}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs font-body">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 transition-colors ${language === 'en' ? 'text-[#7D1A2E] font-medium' : 'text-white/40 hover:text-white'}`}
            >EN</button>
            <span className="text-white/20">|</span>
            <button
              onClick={() => setLanguage('fr')}
              className={`px-2 py-1 transition-colors ${language === 'fr' ? 'text-[#7D1A2E] font-medium' : 'text-white/40 hover:text-white'}`}
            >FR</button>
          </div>
        </div>
      </div>

      {/* ── World Views Header ───────────────────────────────────────────────── */}
      <div className="max-w-[1600px] mx-auto w-full px-6 pt-4 pb-3">
        <h1 className="font-display font-light text-white leading-tight text-4xl md:text-5xl lg:text-6xl">
          {fr ? <>Vues <span className="italic">du monde</span></> : <>World <span className="italic">Views</span></>}
        </h1>
        <p className="text-white/60 font-body text-sm mt-2 leading-relaxed">
          {fr
            ? 'Cartes interactives et outils de visualisation pour explorer les dynamiques mondiales des ressources, de la géopolitique et de la technologie.'
            : 'Interactive maps and visualisation tools to explore global dynamics in resources, geopolitics, and technology.'}
        </p>
      </div>

      {/* ── Country Reports Header ───────────────────────────────────────────── */}
      <div className="max-w-[1600px] mx-auto w-full px-6 pt-2 pb-3">
        <h2 className="font-display font-light text-white leading-tight text-3xl md:text-4xl lg:text-5xl">
          {fr ? <>Rapports <span className="italic">par pays</span></> : <>Country <span className="italic">Reports</span></>}
        </h2>
        <p className="text-white/50 font-body text-[13px] mt-1.5 leading-relaxed">
          {fr
            ? <>
                Survolez un pays pour afficher de brèves données (drapeau, nom, population; en rouge si le rapport est prêt), cliquez pour ouvrir son analyse.<br />
                Chaque rapport de pays présente une analyse structurée : situation politique et économique, risques géopolitiques, acteurs clés, et sources.<br />
                <span className="relative inline-block">
                  <span
                    className="text-white/55 underline decoration-dotted underline-offset-2 cursor-help"
                    onMouseEnter={() => setShowCountryDisclaimer(true)}
                    onMouseLeave={() => setShowCountryDisclaimer(false)}
                  >
                    (Avertissement sur les informations pays.)
                  </span>
                  {showCountryDisclaimer && (
                    <span className="absolute left-0 top-full mt-2 z-20 w-[min(560px,calc(100vw-3rem))] bg-[#0D0D18] border border-white/15 text-white/80 text-[11px] leading-relaxed p-3 shadow-2xl">
                      {hintText}
                    </span>
                  )}
                </span>
              </>
            : <>
                Hover a country for quick info (flag, name, capital, population; display in red if the report is ready); click to open its analysis.<br />
                Each country report provides structured analysis: political &amp; economic snapshot, geopolitical risks, key actors, and sources.<br />
                <span className="relative inline-block">
                  <span
                    className="text-white/55 underline decoration-dotted underline-offset-2 cursor-help"
                    onMouseEnter={() => setShowCountryDisclaimer(true)}
                    onMouseLeave={() => setShowCountryDisclaimer(false)}
                  >
                    (Disclaimer about the country info.)
                  </span>
                  {showCountryDisclaimer && (
                    <span className="absolute left-0 top-full mt-2 z-20 w-[min(560px,calc(100vw-3rem))] bg-[#0D0D18] border border-white/15 text-white/80 text-[11px] leading-relaxed p-3 shadow-2xl">
                      {hintText}
                    </span>
                  )}
                </span>
              </>}
        </p>
      </div>

      {/* ── Country Reports Section ──────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:shrink-0 reports-row border-b border-white/10">

        {/* Globe — fills left column on desktop, fixed height on mobile */}
        <div
          className="relative overflow-hidden globe-col"
          ref={globeContainerRef}
        >

          {/* Loading */}
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <div className="text-center">
                <div className="w-8 h-8 border border-[#7D1A2E]/30 border-t-[#7D1A2E] rounded-full animate-spin mx-auto mb-3" />
                <p className="text-white/30 font-body text-xs tracking-widest">
                  {fr ? 'Chargement…' : 'Loading…'}
                </p>
              </div>
            </div>
          )}

          {/* Globe */}
          {loaded && globeSize.w > 0 && (
            <GlobeGL
              ref={globeRef}
              width={globeSize.w}
              height={globeSize.h}
              globeImageUrl={GLOBE_IMG}
              backgroundImageUrl={BG_IMG}
              lineHoverPrecision={0}
              polygonsData={geoFeatures}
              polygonCapColor={getColor}
              polygonSideColor={() => 'rgba(0, 0, 0, 0.25)'}
              polygonStrokeColor={() => 'rgba(0, 0, 0, 0.45)'}
              polygonAltitude={getAltitude}
              polygonLabel={getLabel}
              onPolygonClick={onPolygonClick}
              onPolygonHover={(d: any) => setHoverD(d as GeoFeature | null)}
              polygonsTransitionDuration={300}
            />
          )}

          {/* Hints */}
          <div className="absolute bottom-4 left-6 right-6 pointer-events-none flex flex-col gap-1">
            <p className="text-white/20 font-body text-[10px] tracking-wider">
              {fr ? 'Inclinaison axiale : 23,5°' : 'Axial : 23.5°'}
            </p>
          </div>
        </div>

        {/* Scroll-passthrough gap — pointer-events-none so mouse scroll passes to the page */}
        <div
          className="hidden lg:flex shrink-0 w-8 items-end justify-center pb-4 pointer-events-none"
        >
          <div className="flex flex-col items-center gap-1 opacity-20">
            <div className="w-px h-8 bg-white/40" />
            <div className="w-1 h-1 rounded-full bg-white/40" />
          </div>
        </div>

        {/* Country list sidebar — same height as globe on desktop, capped on mobile */}
        <div
          className="w-full lg:w-80 xl:w-96 lg:shrink-0 bg-[#0A0A12] border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col sidebar-col"
        >
          {/* Search & Filter header */}
          <div className="shrink-0 px-4 py-3 border-b border-white/10 space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={fr ? 'Rechercher un pays…' : 'Search countries…'}
                className="w-full bg-white/5 border border-white/10 text-white font-body text-sm pl-9 pr-3 py-2 placeholder:text-white/30 focus:outline-none focus:border-[#7D1A2E]/40 transition-colors"
              />
            </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`shrink-0 p-2 border transition-colors ${
                  showFilters || (filters.regions.size > 0 || filters.riskCategories.size > 0 || filters.topics.size > 0)
                    ? 'border-[#7D1A2E] bg-[#7D1A2E]/10 text-[#7D1A2E]'
                    : 'border-white/10 text-white/40 hover:text-white/60'
                }`}
                title={fr ? 'Filtres' : 'Filters'}
              >
                <Filter size={14} />
              </button>
            </div>
            <p className="text-white/30 font-body text-[10px] tracking-wider">
              {filteredCountries.length} {fr ? 'pays' : 'countries'}
            </p>
            <div className="flex items-start gap-1.5">
              <p className="text-white/40 font-body text-[10px] leading-relaxed flex-1">
                {fr
                  ? 'Filtrez par région géographique, niveau de risque (faible/moyen/élevé) et domaines d\'analyse (géopolitique, ressources, technologie).'
                  : 'Filter by geographic region, risk level (low/medium/high), and analysis focus (geopolitics, resources, technology).'}
              </p>
              {/* Info tooltip */}
              <div
                className="relative shrink-0 mt-0.5"
                onMouseEnter={() => setShowFilterInfo(true)}
                onMouseLeave={() => setShowFilterInfo(false)}
              >
                <button
                  type="button"
                  className="text-white/30 hover:text-white/70 transition-colors focus:outline-none"
                  aria-label="Filter explanation"
                >
                  <Info size={18} />
                </button>

                {showFilterInfo && (
                  <div
                    className="absolute right-0 top-full mt-2 z-50 w-[480px] bg-[#0D0D18] border border-white/15 shadow-2xl text-white/80 font-body text-xs leading-relaxed"
                    style={{ pointerEvents: 'none', right: '-16px' }}
                  >
                    <div className="p-4 space-y-3">
                      <p className="text-white font-medium text-[11px] tracking-wider uppercase border-b border-white/10 pb-2">
                        {fr ? 'Filtre par pays' : 'Country Filter'}
                      </p>

                      <div className="space-y-1.5">
                        <p className="text-white/90 text-[11px]">
                          {fr
                            ? 'Stabilité géopolitique, économique et systémique.'
                            : 'Geopolitical, economic, and systemic stability.'}
                        </p>
                        <ul className="space-y-1 pl-1">
                          <li className="flex gap-1.5">
                            <span className="text-red-400 shrink-0">•</span>
                            <span><span className="text-white/90">{fr ? 'Risque élevé :' : 'High risk:'}</span> {fr ? 'conflits actifs, instabilité politique ou vulnérabilités majeures en ressources/technologie' : 'active conflicts, political instability, or major resource/technology vulnerabilities'}</span>
                          </li>
                          <li className="flex gap-1.5">
                            <span className="text-amber-400 shrink-0">•</span>
                            <span><span className="text-white/90">{fr ? 'Risque moyen :' : 'Medium risk:'}</span> {fr ? 'tensions émergentes ou défis structurels modérés' : 'emerging tensions or moderate structural challenges'}</span>
                          </li>
                          <li className="flex gap-1.5">
                            <span className="text-emerald-400 shrink-0">•</span>
                            <span><span className="text-white/90">{fr ? 'Risque faible :' : 'Low risk:'}</span> {fr ? 'démocraties stables à gouvernance prévisible et faible exposition géopolitique' : 'stable democracies with predictable governance and lower geopolitical exposure'}</span>
                          </li>
                        </ul>
                        <p className="text-white/50 text-[10px] italic">
                          {fr
                            ? 'Évaluation sommaire par jugement analytique.'
                            : 'Summary assessment assigned based on analytical judgment.'}
                        </p>
                      </div>

                      <div className="border-t border-white/10 pt-2 space-y-1.5">
                        <p className="text-white/90 text-[11px] font-medium">
                          {fr
                            ? '"Axe d\'analyse" (Géopolitique / Ressources / Technologie) :'
                            : '"Analysis focus" (Geopolitics / Resources / Technology):'}
                        </p>
                        <p className="text-white/70 text-[11px]">
                          {fr
                            ? 'Principale grille de lecture.'
                            : 'Primary lens of analysis.'}
                        </p>
                        <ul className="space-y-1 pl-1">
                          <li className="flex gap-1.5">
                            <span className="text-blue-400 shrink-0">•</span>
                            <span><span className="text-white/90">{fr ? 'Géopolitique :' : 'Geopolitics:'}</span> {fr ? 'puissance militaire, alliances, conflits territoriaux, influence diplomatique' : 'Military power, alliances, territorial disputes, diplomatic influence'}</span>
                          </li>
                          <li className="flex gap-1.5">
                            <span className="text-yellow-400 shrink-0">•</span>
                            <span><span className="text-white/90">{fr ? 'Ressources :' : 'Resources:'}</span> {fr ? 'réserves énergétiques, richesses minières, contrôle des chaînes d\'approvisionnement, dépendances aux matières premières' : 'Energy reserves, mineral wealth, supply chain control, commodity dependencies'}</span>
                          </li>
                          <li className="flex gap-1.5">
                            <span className="text-purple-400 shrink-0">•</span>
                            <span><span className="text-white/90">{fr ? 'Technologie :' : 'Technology:'}</span> {fr ? 'innovation technologique, production de semi-conducteurs, développement de l\'IA, infrastructure numérique' : 'Tech innovation, semiconductor production, AI development, digital infrastructure'}</span>
                          </li>
                        </ul>
                        <p className="text-white/50 text-[10px] italic">
                          {fr
                            ? 'Un pays peut avoir plusieurs axes.'
                            : 'A country can have multiple focus areas.'}
                        </p>
                      </div>

                      <div className="border-t border-white/10 pt-2">
                        <p className="text-white/40 text-[10px] font-mono">
                          {fr
                            ? 'Dans le fichier de métadonnées, chaque pays est catégorisé; p.ex. :'
                            : 'In the meta file, each country has assignments like:'} CHN: region: 'Asia-Pacific', riskLevel: 'High', topics: ['Geopolitics', 'Technology', 'Resources'] &#125;
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="shrink-0 px-4 py-2 border-b border-white/10 flex items-center gap-2">
            <span className="text-[#7D1A2E] text-[11px]">&#9679;</span>
            <span className="text-white/40 font-body text-[10px] tracking-wide">
              {fr ? 'Rapport disponible — fond bordeaux au survol' : 'Full report available — burgundy tooltip on hover'}
            </span>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <>
              {/* Desktop: inline */}
              <div className="hidden lg:flex shrink-0 border-b border-white/10 max-h-80 overflow-y-auto">
                <CountryFilterPanel
                  filters={filters}
                  onFiltersChange={setFilters}
                  onClose={() => setShowFilters(false)}
                />
              </div>
              {/* Mobile: fixed overlay */}
              <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setShowFilters(false)}>
                <div className="absolute bottom-0 left-0 right-0 bg-[#0A0A12] border-t border-white/10 rounded-t-lg max-h-[70vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                  <CountryFilterPanel
                    filters={filters}
                    onFiltersChange={setFilters}
                    onClose={() => setShowFilters(false)}
                  />
                </div>
              </div>
            </>
          )}

          {/* Scrollable country list — fills remaining height */}
          <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
            {Object.entries(groupedCountries).map(([letter, group]) => (
              <div key={letter}>
                <div className="sticky top-0 bg-[#0A0A12]/95 backdrop-blur-sm px-4 py-1.5 border-b border-white/5">
                  <span className="text-[#7D1A2E] font-display text-sm font-medium">{letter}</span>
                </div>
                {group.map(c => {
                  const cName = fr ? c.nameFr : c.nameEn;
                  const hasReport = ANALYSED_SET.has(c.cca3);
                  return (
                    <Link
                      key={c.cca3}
                      href={`/country/${c.cca3.toLowerCase()}`}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors text-left group no-underline"
                    >
                                  <FlagIcon
                      cca2={c.cca2}
                      emoji={c.flag}
                      label={fr ? c.nameFr : c.nameEn}
                      size="1.25rem"
                      className="leading-none shrink-0"
                    />
                      <span className="font-body text-xs text-white/70 group-hover:text-white transition-colors truncate flex-1">
                        {cName}
                      </span>
                      {hasReport && (
                        <span
                          className="shrink-0 w-1.5 h-1.5 rounded-full bg-[#7D1A2E]"
                          title={fr ? 'Rapport disponible' : 'Report available'}
                        />
                      )}
                      <ArrowRight size={10} className="text-white/20 group-hover:text-[#7D1A2E] transition-colors shrink-0 opacity-0 group-hover:opacity-100" />
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── World Views section ──────────────────────────────────────────────── */}
      <div className="border-t border-white/10">

      {/* ── Analytical Tools Cards (Thematic Maps) Section ──────────────────── */}
      <div className="max-w-[1600px] mx-auto w-full px-6 py-16 border-b border-white/10">
        <h2 className="font-display font-light text-white leading-tight text-3xl md:text-4xl lg:text-5xl mb-8">
          {fr ? 'Cartes thématiques' : 'Thematic Maps'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {toolCards.map(card => {
            const isPlaceholder = card.href === '#';
            return (
              <div
                key={card.titleEn}
                onClick={isPlaceholder ? undefined : () => navigate(card.href)}
                className={`group relative bg-[#0A0A12] border transition-all duration-300 no-underline block ${
                  isPlaceholder
                    ? 'border-white/5 border-dashed cursor-default opacity-70'
                    : 'border-white/10 hover:border-white/25 hover:-translate-y-0.5 cursor-pointer'
                }`}
              >
                {/* Accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity"
                  style={{ background: card.accent }}
                />

                <div className="p-6">
                  {/* Icon + tag row */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-9 h-9 flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-colors"
                      style={{ color: card.accent }}
                    >
                      {card.icon}
                    </div>
                    <span className="font-body text-[9px] tracking-[0.2em] uppercase text-white/30 group-hover:text-white/50 transition-colors text-right leading-relaxed">
                      {fr ? card.tagFr : card.tagEn}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-light text-white leading-tight text-xl md:text-2xl mb-2 group-hover:text-white transition-colors">
                    {fr ? card.titleFr : card.titleEn}
                  </h3>

                  {/* Description */}
                  <p className="font-body text-[12px] text-white/45 leading-relaxed group-hover:text-white/60 transition-colors">
                    {fr ? card.descFr : card.descEn}
                  </p>

                  {/* CTA */}
                  {isPlaceholder ? (
                    <div className="mt-5">
                      <span className="font-body text-[9px] tracking-[0.25em] uppercase px-2 py-0.5 border border-white/10 text-white/25">
                        {fr ? 'En préparation' : 'In preparation'}
                      </span>
                    </div>
                  ) : (
                    <div className="mt-5 flex items-center gap-1.5" style={{ color: card.accent }}>
                      <span className="font-body text-[10px] tracking-[0.2em] uppercase opacity-70 group-hover:opacity-100 transition-opacity">
                        {fr ? 'Explorer' : 'Explore'}
                      </span>
                      <ChevronRight size={11} className="opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Global Risk Correlations Section ────────────────────────────────── */}
      <div className="max-w-[1600px] mx-auto w-full px-6 py-8">
        <div className="flex items-start justify-between gap-8">
          <div className="flex-1">
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-3">
              <span className="block w-6 h-px bg-[#7D1A2E]" />
              <span className="text-[#7D1A2E] font-body text-[10px] tracking-[0.35em] uppercase">
                {fr ? 'Outils analytiques' : 'Analytical Tools'}
              </span>
            </div>
            <h2 className="font-display font-light text-white leading-tight text-3xl md:text-4xl lg:text-5xl">
              {fr ? <>Corrélations de <span className="italic">risques mondiaux</span></> : <>Global <span className="italic">Risk Correlations</span></>}
            </h2>
            <p className="text-white/40 font-body text-sm mt-3 max-w-lg leading-relaxed">
              {fr
                ? 'Visualisez comment les risques géopolitiques et économiques se propagent entre les pays analysés.'
                : 'Visualize how geopolitical and economic risks cascade across analyzed countries.'}
            </p>
          </div>
           <button
            onClick={() => navigate('/risk-correlations')}
            className="shrink-0 mt-1 inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 hover:border-white/25 hover:bg-white/10 transition-all duration-300 rounded text-white font-body text-sm group"
          >
            {fr ? 'Voir la matrice complète' : 'View full matrix'}
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(125,26,46,0.4); border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(125,26,46,0.6); }

        /* Mobile: globe has a fixed height, sidebar is capped */
        .globe-col   { height: clamp(260px, 55vw, 380px); }
        .sidebar-col { height: clamp(320px, 45vh, 480px); }

        /* Desktop (lg+): the row is fixed-height = viewport minus top bar;
           globe fills all remaining flex space; sidebar is fixed-width and same height */
        @media (min-width: 1024px) {
          .reports-row { height: calc(100vh - 52px); }
          .globe-col   { flex: 1 1 0%; height: 100%; }
          .sidebar-col { height: 100%; }
        }

        /* Keep side-by-side layout longer on medium screens */
        @media (min-width: 768px) and (max-width: 1023px) {
          .reports-row { display: flex; height: calc(100vh - 52px); }
          .globe-col   { flex: 1 1 50%; height: 100%; }
          .sidebar-col { flex: 1 1 50%; height: 100%; }
        }
     `}</style>
    </div>
  );
}
