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
import { CountryLocatorMap } from '@/components/CountryLocatorMap';
import { irelandRiskTrends } from '@/data/irelandRiskTrends';
import type { RiskTrendData } from '@/lib/riskTrendTypes';
import { deriveRiskLevel } from '@/lib/deriveRiskLevel';
import {
  ArrowLeft, Globe, Users, MapPin, BarChart2, Shield, TrendingUp,
  AlertTriangle, BookOpen, Clock, ChevronDown, ChevronUp, ExternalLink, Sun, Moon,
  Mountain, Hammer
} from 'lucide-react';
import { franceAnalysis } from '@/data/france-yaml';
import { type AnalysisContent, type ActorEntry, type RiskEntry, type SourceEntry } from '@/data/france';
import { canadaAnalysis } from '@/data/canada';
import { usaAnalysis } from '@/data/usa-yaml';
import { chinaAnalysis } from '@/data/china-yaml';
import { russiaAnalysis } from '@/data/russia-yaml';
import { japanAnalysis } from '@/data/japan-yaml';
import { southKoreaAnalysis } from '@/data/southkorea-yaml';
import { irelandAnalysis } from '@/data/ireland';
import { australiaAnalysis } from '@/data/australia-yaml';
import { brazilAnalysis } from '@/data/brazil-yaml';
import { germanyAnalysis } from '@/data/germany-yaml';
import { unitedKingdomAnalysis } from '@/data/united-kingdom-yaml';
import { mexicoAnalysis } from '@/data/mexico-yaml';
import { indiaAnalysis } from '@/data/india-yaml';
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
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + ' millions';
  if (n >= 1_000) return (n / 1_000).toFixed(0) + ',000';
  return n.toLocaleString();
}

function formatPopulationFr(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + ' milliard';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + ' millions';
  if (n >= 1_000) return (n / 1_000).toFixed(0) + ' 000';
  return n.toLocaleString('fr-FR');
}

/**
 * Display-layer translation of the canonical rating enums (High|Med|Low, plus
 * Medium in actor dealability). The DATA keeps the English enum values — the
 * validator and deriveRiskLevel depend on them — only the rendering localizes.
 * FR-PLACEHOLDER: French wording — Peggy to verify.
 */
function ratingLabel(v: string | null | undefined, language: string): string {
  if (!v) return '';
  if (language !== 'fr') return v;
  const map: Record<string, string> = { High: 'Élevé', Med: 'Moyen', Medium: 'Moyen', Low: 'Faible' };
  return map[v] ?? v;
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
 * Parse inline citations [source-id] and convert to clickable superscript links.
 * Render labels as compact numeric markers based on source order.
 */
function parseCitations(text: string, sources?: SourceEntry[]): (string | React.ReactNode)[] {
  const parts: (string | React.ReactNode)[] = [];
  const sourceMap = new Map((sources ?? []).map((s) => [s.id, s]));
  const sourceIndexMap = new Map((sources ?? []).map((s, i) => [s.id, i + 1]));
  // Two marker kinds (rework §1): [source-id] citations and [dot.path] anchors
  // (derived claims naming the report field they stand on). The dot is the
  // discriminator — source ids are lowercase-alphanumeric-hyphens only.
  const citationRegex = /\[([a-z0-9-]+|[a-z][a-zA-Z0-9]*(?:\.[a-z][a-zA-Z0-9]*)+)\]/g;
  let lastIndex = 0;
  let match;

  while ((match = citationRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      // Bind each citation marker to its preceding word with a non-breaking space
      // so a marker never wraps alone onto a new line (no orphan) — EN and FR.
      parts.push(text.substring(lastIndex, match.index).replace(/[ \t]+$/, '\u00A0'));
    }
    const citationId = match[1];
    if (citationId.includes('.')) {
      // Field-path anchor → in-page link to that section (deep-link ids live on
      // the section wrappers). Rendered as a superscript section mark.
      parts.push(
        <a
          key={`anchor-${match.index}`}
          href={`#${citationId}`}
          title={citationId}
          className="text-[var(--cr-accent)] hover:text-[var(--cr-accent-hover)] transition-colors font-medium"
          style={{ fontSize: '0.75em', verticalAlign: 'super', textDecoration: 'none', marginLeft: '0.08em' }}
          onClick={(e) => {
            e.preventDefault();
            // Field blocks inside a collapsed section aren't in the DOM —
            // fall back to the peer section wrapper (id = peer name).
            const el = document.getElementById(citationId) ?? document.getElementById(citationId.split('.')[0]);
            el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        >
          [§]
        </a>
      );
      lastIndex = match.index + match[0].length;
      continue;
    }
    const citationLabel = sourceIndexMap.get(citationId);
    parts.push(
      <a
        key={`citation-${match.index}`}
        href={`#source-${citationId}`}
        className="text-[var(--cr-accent)] hover:text-[var(--cr-accent-hover)] transition-colors font-medium"
        style={{
          fontSize: '0.75em',
          verticalAlign: 'super',
          textDecoration: 'none',
          marginLeft: '0.08em',
          borderBottom: sourceMap.get(citationId)?.citationType === 'Interpretation'
            ? '1px dotted var(--cr-accent)'
            : '1px solid var(--cr-accent)',
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
            const sourceElement = document.getElementById(`source-${citationId}`);
            if (sourceElement) {
              sourceElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
              sourceElement.classList.add('ring-2', 'ring-[var(--cr-accent)]', 'ring-offset-2');
              setTimeout(() => {
                sourceElement.classList.remove('ring-2', 'ring-[var(--cr-accent)]', 'ring-offset-2');
              }, 2000);
            }
          }, 50);
        }}
      >
        [{citationLabel ?? citationId}]
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
  /** Small muted note on the right of the header band (e.g. the situation verification date). */
  headerNote?: string;
}>(({ icon: Icon, title, children, defaultOpen = false, headerNote }, ref) => {
  const [open, setOpen] = useState(defaultOpen);
  const containerRef = useRef<HTMLDivElement>(null);

  React.useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
  }));

  // Header sticks below the top bar while its section is open, so a long
  // section can be collapsed without scrolling back up. Collapsing a section
  // whose top has scrolled away jumps back to it, putting the next section
  // right at hand.
  const NAV_OFFSET = 48; // sticky top-bar height (top-12)
  const toggle = () => {
    const el = containerRef.current;
    const wasStuck = open && el && el.getBoundingClientRect().top < NAV_OFFSET;
    setOpen(o => !o);
    if (wasStuck) {
      requestAnimationFrame(() => el!.scrollIntoView({ block: 'start' }));
    }
  };

  return (
    <div ref={containerRef} className="border border-[var(--cr-border)] mb-4" style={{ scrollMarginTop: `${NAV_OFFSET + 8}px` }}>
      <button
        className={`w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[var(--cr-hover)] transition-colors sticky top-12 z-10 bg-[var(--cr-bg)] ${open ? 'border-b border-[var(--cr-border)]' : ''}`}
        onClick={toggle}
      >
        <div className="flex items-center gap-3">
          <Icon size={15} className="text-[var(--cr-accent)]" />
          <span className="font-display text-base font-medium text-[var(--cr-ink)]">{title}</span>
        </div>
        <div className="flex items-center gap-3">
          {!!headerNote && (
            <span className="font-body text-xs text-[var(--cr-muted)] whitespace-nowrap">{headerNote}</span>
          )}
          {open ? <ChevronUp size={14} className="text-[var(--cr-muted)]" /> : <ChevronDown size={14} className="text-[var(--cr-muted)]" />}
        </div>
      </button>
      {open && (
        <div className="px-6 pb-6 pt-2 bg-[var(--cr-surface)]">
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
      <div className="w-8 h-px bg-[var(--cr-accent)] mx-auto mb-4" />
      <p className="text-[var(--cr-muted)] font-body text-sm italic">
        {language === 'fr'
          ? 'Analyse en cours de rédaction — à venir'
          : 'Analysis in progress — coming soon'}
      </p>
      <div className="w-8 h-px bg-[var(--cr-accent)] mx-auto mt-4" />
    </div>
  );
}

// ─── Prose paragraphs ─────────────────────────────────────────────────────────
// Narrative fields may contain blank-line paragraph breaks (\n\n) authored in
// Keystatic; render them as real paragraphs instead of letting HTML collapse
// the newlines into one wall of text. Single newlines stay within a paragraph.
function ProseParagraphs({ text, sources }: { text: string; sources?: SourceEntry[] }) {
  const paras = text.split(/\n{2,}/).map((s) => s.trim()).filter(Boolean);
  return (
    <div className="space-y-3">
      {paras.map((p, i) => (
        <p key={i} className="font-body text-sm text-[var(--cr-body)] leading-relaxed">{parseCitations(p, sources)}</p>
      ))}
    </div>
  );
}

// ─── Situation threads — the verified event layer ─────────────────────────────
// situation_en/_fr may hold JSON-in-text threads (same convention as actors/risks):
//   [{ "thread": "…", "status"?, "events": [{ "date", "what", "changed" }], "currentState"? }]
// Threads render natively; anything that isn't a parsable threads array falls
// back to plain prose (legacy content).
// ARRAY ORDER IS SEMANTIC — threads are authored by recency of last activity,
// events chronologically FORWARD within each thread. NEVER sort or reverse here.

type SituationEvent = { date?: string; what?: string; changed?: string };
type SituationThread = { thread?: string; status?: string; events?: SituationEvent[]; currentState?: string };

function parseSituationThreads(text: string): SituationThread[] | null {
  const t = text.trim();
  if (!t.startsWith('[')) return null;
  try {
    const parsed = JSON.parse(t);
    return Array.isArray(parsed) ? (parsed as SituationThread[]) : null;
  } catch {
    return null;
  }
}

function SituationSection({ text, sources }: { text: string; sources?: SourceEntry[] }) {
  const threads = parseSituationThreads(text);
  if (!threads) return <ProseParagraphs text={text} sources={sources} />;
  return (
    <div className="space-y-5">
      {threads.map((th, i) => (
        <div key={i}>
          {!!th.thread?.trim() && (
            <h4 className="font-body text-sm font-semibold text-[var(--cr-ink)] mb-2">
              {th.thread}
              {!!th.status?.trim() && (
                <span className="ml-2 font-normal text-xs text-[var(--cr-muted)]">({th.status})</span>
              )}
            </h4>
          )}
          {/* Events indented under the thread title so titles read as headers */}
          <div className="space-y-2 pl-4">
            {(th.events ?? []).map((e, j) => (
              <div key={j} className="font-body text-sm text-[var(--cr-body)] leading-relaxed">
                <p>
                  {!!e.date?.trim() && <strong className="text-[var(--cr-ink)]">{e.date}&nbsp;— </strong>}
                  {parseCitations(e.what ?? '', sources)}
                </p>
                {!!e.changed?.trim() && (
                  <p className="pl-5 text-[var(--cr-muted)]">↳ {parseCitations(e.changed, sources)}</p>
                )}
              </div>
            ))}
          </div>
          {!!th.currentState?.trim() && (
            <p className="font-body text-sm italic text-[var(--cr-muted)] mt-2 pl-4">{parseCitations(th.currentState, sources)}</p>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Scorecard row ────────────────────────────────────────────────────────────

function ScoreRow({ label, value, language, detail }: {
  label: string;
  value: 'High' | 'Med' | 'Low' | null;
  language: string;
  /** Anchoring reveal (rework §1/§4): rationale + the anchors the rating summarises. */
  detail?: { anchors?: string[]; rationale_en?: string; rationale_fr?: string };
}) {
  const [openDetail, setOpenDetail] = useState(false);
  const colors: Record<string, string> = {
    High: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-900',
    Med: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900',
    Low: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-900',
  };
  const rationale = language === 'fr' ? detail?.rationale_fr : detail?.rationale_en;
  const hasDetail = !!(detail && ((detail.anchors?.length ?? 0) > 0 || rationale?.trim()));
  return (
    <div className="border-b border-[var(--cr-divider)] last:border-0">
      <div
        className={`flex items-center justify-between py-2 ${hasDetail ? 'cursor-pointer hover:bg-[var(--cr-hover)]' : ''}`}
        onClick={hasDetail ? () => setOpenDetail((o) => !o) : undefined}
      >
        <span className="font-body text-sm text-[var(--cr-body)]">
          {label}
          {hasDetail && <span className="ml-1 text-[10px] text-[var(--cr-muted)]">{openDetail ? '▾' : '▸'}</span>}
        </span>
        {value ? (
          <span className={`font-body text-xs px-2 py-0.5 border rounded ${colors[value]}`}>{ratingLabel(value, language)}</span>
        ) : (
          <span className="font-body text-xs text-[var(--cr-faint)] italic">—</span>
        )}
      </div>
      {hasDetail && openDetail && (
        <div className="pb-2 pl-1">
          {!!rationale?.trim() && (
            <p className="font-body text-xs italic text-[var(--cr-muted)] mb-1">{rationale}</p>
          )}
          {(detail!.anchors?.length ?? 0) > 0 && (
            <div className="flex flex-wrap gap-1">
              {detail!.anchors!.map((a) => (
                <a
                  key={a}
                  href={a.includes('.') ? `#${a}` : `#source-${a}`}
                  className="font-body text-[10px] px-1.5 py-0.5 border border-[var(--cr-border)] rounded text-[var(--cr-accent)] hover:bg-[var(--cr-hover)]"
                  onClick={(e) => {
                    e.preventDefault();
                    // Collapsed-section fallback: peer wrapper, then source anchor.
                    const el = a.includes('.')
                      ? (document.getElementById(a) ?? document.getElementById(a.split('.')[0]))
                      : document.getElementById(`source-${a}`);
                    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                >
                  {a}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Actor Card ──────────────────────────────────────────────────────────────

function ActorCard({ actor, language, sources }: { actor: ActorEntry; language: string; sources?: SourceEntry[] }) {
  const [expanded, setExpanded] = useState(false);
  // FR-PLACEHOLDER: Layer-2 labels + AI-drafted notice French wording — Peggy to verify.
  const labels = language === 'fr'
    ? { interests: 'Intérêts', resources: 'Ressources', constraints: 'Contraintes', moves: 'Mouvements probables', deal: 'Négociabilité', engagement: "Mode d'engagement", position: 'Position actuelle', aiDrafted: 'Ébauche générée par IA — non vérifiée', citedIn: 'Cité dans' }
    : { interests: 'Interests', resources: 'Resources', constraints: 'Constraints', moves: 'Likely moves', deal: 'Dealability', engagement: 'Engagement mode', position: 'Current position', aiDrafted: 'AI-drafted — unverified', citedIn: 'Cited in' };

  // Layer 1 (extraction — high reliability) shows on the row and above the fold;
  // Layer 2 (analytical draft) renders collapsed by default and visibly labelled
  // AI-drafted/unverified (rework §8.1 — this rendering is part of the change).
  const layer2 = ([
    [labels.interests, actor.interests],
    [labels.resources, actor.resources],
    [labels.constraints, actor.constraints],
    [labels.moves, actor.likelyMoves],
    ...(actor.engagementMode
      ? [[labels.engagement, actor.engagementMode]]
      : (actor.dealability ? [[labels.deal, ratingLabel(actor.dealability, language)]] : [])),
  ] as [string, string][]).filter(([, v]) => v.trim().length > 0);

  return (
    <div className="border border-[var(--cr-border)] bg-[var(--cr-bg)]">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[var(--cr-hover)] transition-colors gap-3"
        onClick={() => setExpanded(e => !e)}
      >
        <span className="font-body text-sm font-medium text-[var(--cr-ink)] flex-1">
          {actor.name}
          {actor.kind && <span className="ml-2 font-normal text-[10px] uppercase tracking-widest text-[var(--cr-muted)]">{actor.kind}</span>}
          {actor.liveActorStatus && <span className="ml-2 font-normal text-[10px] text-[var(--cr-muted)]">· {actor.liveActorStatus}</span>}
        </span>
        {expanded ? <ChevronUp size={12} className="text-[var(--cr-muted)]" /> : <ChevronDown size={12} className="text-[var(--cr-muted)]" />}
      </button>
      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-[var(--cr-border)] space-y-2">
          {/* Layer 1 — extracted from the report */}
          {!!actor.currentPosition?.trim() && (
            <div>
              <span className="font-body text-[10px] uppercase tracking-widest text-[var(--cr-accent)]">{labels.position}</span>
              <p className="font-body text-xs text-[var(--cr-body)] leading-relaxed mt-0.5">{parseCitations(actor.currentPosition, sources)}</p>
            </div>
          )}
          {(actor.fieldsCitedIn?.length ?? 0) > 0 && (
            <p className="font-body text-[10px] text-[var(--cr-muted)]">{labels.citedIn}: {actor.fieldsCitedIn!.join(' · ')}</p>
          )}
          {/* Layer 2 — analytical draft, labelled */}
          {layer2.length > 0 && (
            <div className="border border-[var(--cr-border)] rounded px-3 py-2 space-y-2">
              <p className="font-body text-[10px] italic text-[var(--cr-muted)]">⚠ {labels.aiDrafted}</p>
              {layer2.map(([label, value]) => (
                <div key={label}>
                  <span className="font-body text-[10px] uppercase tracking-widest text-[var(--cr-accent)]">{label}</span>
                  <p className="font-body text-xs text-[var(--cr-body)] leading-relaxed mt-0.5">{parseCitations(value, sources)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Risk Row ────────────────────────────────────────────────────────────────

function RiskCard({ risk, language, sources }: { risk: RiskEntry; language: string; sources?: SourceEntry[] }) {
  const [expanded, setExpanded] = useState(false);
  const probColors: Record<string, string> = {
    High: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-900',
    Med: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900',
    Low: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-900',
  };
  const impactColors = probColors;
  const labels = language === 'fr'
    ? { trigger: 'Déclencheur', prob: 'Probabilité', impact: 'Impact', horizon: 'Horizon', indicators: 'Indicateurs avancés', mitigants: 'Atténuation', lastAssessed: 'Dernière évaluation' }
    : { trigger: 'Trigger', prob: 'Probability', impact: 'Impact', horizon: 'Time horizon', indicators: 'Leading indicators', mitigants: 'Mitigants', lastAssessed: 'Last assessed' };

  return (
    <div className="border border-[var(--cr-border)] bg-[var(--cr-bg)]">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[var(--cr-hover)] transition-colors gap-3"
        onClick={() => setExpanded(e => !e)}
      >
        <span className="font-body text-sm font-medium text-[var(--cr-ink)] flex-1">{risk.title}</span>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`font-body text-[10px] px-1.5 py-0.5 border rounded ${probColors[risk.probability]}`}>
            {ratingLabel(risk.probability, language)}
          </span>
          <span className={`font-body text-[10px] px-1.5 py-0.5 border rounded ${impactColors[risk.impact]}`}>
            {ratingLabel(risk.impact, language)}
          </span>
          {expanded ? <ChevronUp size={12} className="text-[var(--cr-muted)]" /> : <ChevronDown size={12} className="text-[var(--cr-muted)]" />}
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-[var(--cr-border)] space-y-2">
          {/* Layer 2 (rework §8.2): the risk FRAMING is an analytical draft —
              labelled like actors Layer 2. FR-PLACEHOLDER: French wording. */}
          <p className="font-body text-[10px] italic text-[var(--cr-muted)]">
            ⚠ {language === 'fr' ? 'Ébauche générée par IA — non vérifiée' : 'AI-drafted — unverified'}
          </p>
          {([
            [labels.trigger, risk.trigger],
            [labels.horizon, risk.timeHorizon],
            [labels.indicators, risk.leadingIndicators],
            [labels.mitigants, risk.mitigants],
            ...(risk.lastAssessed ? [[labels.lastAssessed, risk.lastAssessed]] : []),
          ] as [string, string][]).map(([label, value]) => (
            <div key={label}>
              <span className="font-body text-[10px] uppercase tracking-widest text-[var(--cr-accent)]">{label}</span>
              <p className="font-body text-xs text-[var(--cr-body)] leading-relaxed mt-0.5">{parseCitations(value, sources)}</p>
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

  // Scoped dark mode for country report pages only: the `.dark` class is applied
  // to THIS page's wrapper (not <html>), so it never affects the rest of the site.
  const [dark, setDark] = useState<boolean>(() => {
    try { return localStorage.getItem('country-theme') === 'dark'; } catch { return false; }
  });
  useEffect(() => {
    try { localStorage.setItem('country-theme', dark ? 'dark' : 'light'); } catch { /* storage blocked */ }
  }, [dark]);

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

  // Overall risk level: derived by rule from this country's own risk register
  // (never hand-assigned). Uses the active-language risks so drivenBy is localized.
  const derivedRisk = useMemo(
    () => (lang ? deriveRiskLevel(lang.risks) : null),
    [lang]
  );

  if (loading) {
    return (
      <div className={`min-h-screen bg-[var(--cr-bg)] flex items-center justify-center ${dark ? 'dark' : ''}`}>
        <div className="w-8 h-8 border border-[var(--cr-accent)]/30 border-t-[var(--cr-accent)] rounded-full animate-spin" />
      </div>
    );
  }

  if (!country) {
    return (
      <div className={`min-h-screen bg-[var(--cr-bg)] flex flex-col items-center justify-center gap-4 ${dark ? 'dark' : ''}`}>
        <p className="font-body text-[var(--cr-body)]">
          {language === 'fr' ? 'Pays introuvable.' : 'Country not found.'}
        </p>
        <Link href="/world-analysis" className="text-[var(--cr-accent)] font-body text-sm hover:underline">
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
    // Rework §5 renames: Political Stability → Political Order; State Capacity →
    // Capacity to Deliver. FR-PLACEHOLDER: new FR section labels — Peggy to verify.
    political: language === 'fr' ? 'Ordre politique' : 'Political Order',
    situation: language === 'fr' ? 'Situation' : 'Situation',
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
    // FR-PLACEHOLDER: new-field labels below — Peggy to verify French wording.
    realEconomy: language === 'fr' ? 'Économie réelle' : 'Real economy',
    publicFinances: language === 'fr' ? 'Finances publiques' : 'Public finances',
    externalVuln: language === 'fr' ? 'Vulnérabilité externe' : 'External vulnerability',
    politicalEconomy: language === 'fr' ? 'Économie politique' : 'Political economy',
    rightsAndChecks: language === 'fr' ? 'Droits et contre-pouvoirs' : 'Rights & checks',
    stateStructure: language === 'fr' ? 'Structure de l\'État' : 'State structure',
    inheritedTerrain: language === 'fr' ? 'Terrain hérité' : 'Inherited terrain',
    steering: language === 'fr' ? 'Pilotage' : 'Steering',
    approvals: language === 'fr' ? 'Autorisations' : 'Approvals',
    publicServices: language === 'fr' ? 'Services publics' : 'Public services',
    languageField: language === 'fr' ? 'Langue' : 'Language',
    wellbeing: language === 'fr' ? 'Bien-être' : 'Wellbeing',
    posture: language === 'fr' ? 'Posture' : 'Posture',
    military: language === 'fr' ? 'Forces militaires' : 'Military',
    transnationalExposure: language === 'fr' ? 'Exposition transnationale' : 'Transnational exposure',
    baseline: language === 'fr' ? 'État des lieux' : 'Baseline',
    internalSecurity: language === 'fr' ? 'Sécurité intérieure' : 'Internal security',
    diplomacy: language === 'fr' ? 'Diplomatie & posture extérieure' : 'Diplomacy & external posture',
    domesticActors: language === 'fr' ? 'Acteurs nationaux' : 'Domestic actors',
    externalActors: language === 'fr' ? 'Acteurs extérieurs' : 'External actors',
    // FR-PLACEHOLDER: society/territory/capacity/substrate + overall-risk UI labels — Peggy to verify French wording.
    constitutionalSubstrate: language === 'fr' ? 'Substrat constitutionnel' : 'Constitutional substrate',
    territory: language === 'fr' ? 'Territoire' : 'Territory',
    geography: language === 'fr' ? 'Géographie' : 'Geography',
    minerals: language === 'fr' ? 'Minéraux' : 'Minerals',
    biosphere: language === 'fr' ? 'Biosphère' : 'Biosphere',
    climate: language === 'fr' ? 'Climat' : 'Climate',
    metabolism: language === 'fr' ? 'Métabolisme' : 'Metabolism',
    transition: language === 'fr' ? 'Transition' : 'Transition',
    // FR-PLACEHOLDER: section renamed (was "Capacité de l'État", Peggy's final
    // label for the OLD name "State Capacity") — new FR wording to verify.
    capacity: language === 'fr' ? 'Capacité de mise en œuvre' : 'Capacity to Deliver',
    permitting: language === 'fr' ? 'Autorisations' : 'Permitting',
    delivery: language === 'fr' ? 'Réalisation' : 'Delivery',
    productivity: language === 'fr' ? 'Productivité' : 'Productivity',
    society: language === 'fr' ? 'Société' : 'Society',
    socialCohesion: language === 'fr' ? 'Cohésion sociale' : 'Social cohesion',
    demographics: language === 'fr' ? 'Démographie' : 'Demographics',
    composition: language === 'fr' ? 'Composition' : 'Composition',
    religion: language === 'fr' ? 'Religion' : 'Religion',
    socialCohesionSection: language === 'fr' ? 'Cohésion sociale' : 'Social cohesion',
    overallRisk: language === 'fr' ? 'Niveau de risque global' : 'Overall risk level',
    drivenBy: language === 'fr' ? 'déterminé par' : 'driven by',
    riskHigh: language === 'fr' ? 'Élevé' : 'High',
    riskMedium: language === 'fr' ? 'Moyen' : 'Medium',
    riskLow: language === 'fr' ? 'Faible' : 'Low',
  };

  const hasAnalysis = !!analysis && !!lang;
  const hasSociety = hasAnalysis && !!lang!.society &&
    Object.values(lang!.society).some((v) => typeof v === 'string' && v.trim().length > 0);
  // Territory/capacity render ONLY when content exists — no placeholder card for
  // countries not yet regenerated on the six-peer schema.
  const hasTerritory = hasAnalysis && !!lang!.territory &&
    Object.values(lang!.territory).some((v) => typeof v === 'string' && v.trim().length > 0);
  const hasCapacity = hasAnalysis && !!lang!.capacity &&
    Object.values(lang!.capacity).some((v) => typeof v === 'string' && v.trim().length > 0);
  const hasSubstrate = hasAnalysis && !!lang!.political.constitutionalSubstrate?.trim();
  const hasSituation = hasAnalysis && !!lang!.situation?.trim();
  const activeSources = analysis?.sources ?? lang?.sources ?? [];
  const hasBaseline = hasAnalysis && !!lang!.baseline?.trim();

  // Per-section data confidence + date (rework §5): aggregated from the
  // section's cited sources — dominant confidence (High when >=80% of cited
  // sources are High; Low when >20% are Low; else Med) + the latest accessDate.
  // Undefined when the section cites nothing (legacy or empty sections).
  const sectionMeta = (texts: (string | undefined)[]): string | undefined => {
    const ids = new Set<string>();
    const re = /\[([a-z0-9-]+)\]/g;
    for (const txt of texts) {
      if (!txt) continue;
      let m: RegExpExecArray | null;
      while ((m = re.exec(txt)) !== null) ids.add(m[1]);
    }
    const cited = activeSources.filter((s) => s.id && ids.has(s.id));
    if (!cited.length) return undefined;
    const withConf = cited.filter((s) => s.confidence);
    let label = '';
    if (withConf.length) {
      const high = withConf.filter((s) => s.confidence === 'High').length / withConf.length;
      const low = withConf.filter((s) => s.confidence === 'Low').length / withConf.length;
      label = ratingLabel(high >= 0.8 ? 'High' : low > 0.2 ? 'Low' : 'Med', language);
    }
    const latest = cited.map((s) => s.accessDate ?? '').filter(Boolean).sort().pop() ?? '';
    return [label, latest].filter(Boolean).join(' · ') || undefined;
  };

  // Scorecard rows — rendered twice (desktop rail + mobile inline), rework §5:
  // a visually distinct assessment block, out of the Political section.
  const scorecardTitle = language === 'fr' ? 'Tableau de bord rapide' : 'Quick scorecard';
  const scorecardRows = hasAnalysis ? (
    <>
      <ScoreRow label={t.eliteCohesion} value={analysis!.scorecard.eliteCohesion} language={language} detail={analysis!.scorecardAnchors?.eliteCohesion} />
      <ScoreRow label={t.socialCohesion} value={analysis!.scorecard.socialCohesion ?? null} language={language} detail={analysis!.scorecardAnchors?.socialCohesion} />
      <ScoreRow label={t.securityLoyalty} value={analysis!.scorecard.securityLoyalty} language={language} detail={analysis!.scorecardAnchors?.securityLoyalty} />
      <ScoreRow label={t.economicPressure} value={analysis!.scorecard.economicPressure} language={language} detail={analysis!.scorecardAnchors?.economicPressure} />
      <ScoreRow label={t.protestCapacity} value={analysis!.scorecard.protestCapacity} language={language} detail={analysis!.scorecardAnchors?.protestCapacity} />
      <ScoreRow label={t.institutionalResilience} value={analysis!.scorecard.institutionalResilience} language={language} detail={analysis!.scorecardAnchors?.institutionalResilience} />
    </>
  ) : (
    <>
      <ScoreRow label={t.eliteCohesion} value={null} language={language} />
      <ScoreRow label={t.socialCohesion} value={null} language={language} />
      <ScoreRow label={t.securityLoyalty} value={null} language={language} />
      <ScoreRow label={t.economicPressure} value={null} language={language} />
      <ScoreRow label={t.protestCapacity} value={null} language={language} />
      <ScoreRow label={t.institutionalResilience} value={null} language={language} />
    </>
  );

  // Lateral nav (rework §5): persistent section list mirroring section order,
  // opening at Territory. Sections render collapsed; the list is the map.
  const navItems: { id: string; label: string }[] = [
    ...(hasTerritory ? [{ id: 'territory', label: t.territory }] : []),
    ...(hasSociety ? [{ id: 'society', label: t.society }] : []),
    { id: 'economy', label: t.economy },
    { id: 'political', label: t.political },
    ...(hasCapacity ? [{ id: 'capacity', label: t.capacity }] : []),
    { id: 'security', label: t.security },
    ...(hasSituation ? [{ id: 'situation', label: t.situation }] : []),
    { id: 'actors', label: t.actors },
    { id: 'risks', label: t.risks },
    { id: 'sources', label: t.sources },
  ];

  return (
    <div className={`min-h-screen bg-[var(--cr-bg)] text-[var(--cr-body)] ${dark ? 'dark' : ''}`}>

      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-[var(--cr-bg)]/95 backdrop-blur-sm border-b border-[var(--cr-border)]">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-[var(--cr-body)] hover:text-[var(--cr-accent)] transition-colors font-body text-sm"
            >
              <ArrowLeft size={14} />
              {language === 'fr' ? 'Accueil' : 'Home'}
            </Link>
            <span className="text-[var(--cr-faint)]">·</span>
            <Link
              href="/world-analysis"
              className="flex items-center gap-2 text-[var(--cr-body)] hover:text-[var(--cr-accent)] transition-colors font-body text-sm"
            >
              <ArrowLeft size={14} />
              {t.back}
            </Link>
          </div>
          <div className="flex items-center gap-1 text-xs font-body">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 transition-colors ${language === 'en' ? 'text-[var(--cr-accent)] font-medium' : 'text-[var(--cr-muted)] hover:text-[var(--cr-body)]'}`}
            >
              EN
            </button>
            <span className="text-[var(--cr-faint)]">|</span>
            <button
              onClick={() => setLanguage('fr')}
              className={`px-2 py-1 transition-colors ${language === 'fr' ? 'text-[var(--cr-accent)] font-medium' : 'text-[var(--cr-muted)] hover:text-[var(--cr-body)]'}`}
            >
              FR
            </button>
            <span className="text-[var(--cr-faint)] ml-1">|</span>
            <button
              onClick={() => setDark((d) => !d)}
              aria-label={dark ? (language === 'fr' ? 'Mode clair' : 'Light mode') : (language === 'fr' ? 'Mode sombre' : 'Dark mode')}
              title={dark ? (language === 'fr' ? 'Mode clair' : 'Light mode') : (language === 'fr' ? 'Mode sombre' : 'Dark mode')}
              className="ml-1 p-1 text-[var(--cr-muted)] hover:text-[var(--cr-accent)] transition-colors"
            >
              {dark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl lg:max-w-6xl mx-auto px-6 py-12">

        {/* Country header */}
        <div className="mb-12">
          <div className="flex items-start justify-between gap-6 mb-6">
            <div className="flex items-start gap-6">
            <FlagIcon
            cca2={country.cca2}
            emoji={country.flag}
            label={name}
            size="4.5rem"
            className="leading-none"
          />
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-light text-[var(--cr-ink)] leading-tight">
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
              <p className="text-[var(--cr-accent)] font-body text-xs tracking-[0.3em] uppercase mt-1">
                {country.cca3} · {translateRegion(country.region)}
              </p>
            </div>
            </div>
            {/* Locator map: the country against its neighbours (Natural Earth data).
                FR-PLACEHOLDER: aria-label French wording — Peggy to verify. */}
            <div className="hidden sm:block shrink-0">
              <CountryLocatorMap
                cca3={country.cca3}
                width={300}
                height={160}
                label={language === 'fr'
                  ? `Carte de situation : ${name} et ses voisins`
                  : `Locator map: ${name} and its neighbours`}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-[var(--cr-muted)] mb-3">
            <Clock size={11} />
            <span className="font-body text-xs">
              {t.lastUpdated}: {hasAnalysis ? analysis!.lastUpdated : t.never}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { icon: MapPin, label: t.capital, value: country.capital || '—' },
              { icon: Users, label: t.population, value: pop },
              { icon: Globe, label: t.region, value: translateRegion(country.subregion || country.region) },
              { icon: BarChart2, label: t.area, value: country.area > 0 ? country.area.toLocaleString() + ' km²' : '—' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-[var(--cr-surface)] border border-[var(--cr-border)] px-4 py-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon size={11} className="text-[var(--cr-accent)]" />
                  <span className="font-body text-[10px] tracking-widest uppercase text-[var(--cr-muted)]">{label}</span>
                </div>
                <p className="font-body text-sm text-[var(--cr-ink)] font-medium">{value}</p>
              </div>
            ))}
          </div>

        </div>

        {/* ── Baseline (rework §5) — the page's only always-visible prose. ──
            Empty until the country is regenerated: render NOTHING then (no
            placeholder, no back-fill from the removed executive snapshot). */}
        {hasBaseline && (
          <div className="mb-8 border-l-2 border-[var(--cr-accent)] pl-4">
            <p className="font-body text-[10px] uppercase tracking-widest text-[var(--cr-muted)] mb-2">{t.baseline}</p>
            <ProseParagraphs text={lang!.baseline!} sources={activeSources} />
          </div>
        )}

        {/* Scorecard inline on mobile — the rail is hidden there (rework §5) */}
        <div className="lg:hidden mb-8 bg-[var(--cr-surface)] border border-[var(--cr-border)] px-4 py-3">
          <p className="font-body text-xs text-[var(--cr-muted)] uppercase tracking-widest mb-3">{scorecardTitle}</p>
          {scorecardRows}
        </div>

        {/* ── Content + lateral rail (rework §5) ── */}
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_230px] lg:gap-8 lg:items-start">
        <div className="min-w-0">

        {/* ── Framework sections — standing body: Territory · Society · Economy ·
            Political Order · Capacity to Deliver · Security & Diplomacy;
            dynamic tail: Situation · Actors · Risks (rework §5 order). ── */}

        {/* 1. Territory */}
        {hasTerritory && (
          <div data-section="Territory" id="territory" style={{ scrollMarginTop: 96 }}>
          <FrameworkSection icon={Mountain} title={t.territory} headerNote={sectionMeta([
            lang!.territory!.geography, lang!.territory!.biosphere, lang!.territory!.minerals,
            lang!.territory!.climate, lang!.territory!.metabolism, lang!.territory!.transition,
          ])}>
            <div className="space-y-6">
              {([
                [t.geography, lang!.territory!.geography, 'territory.geography'],
                [t.biosphere, lang!.territory!.biosphere, 'territory.biosphere'],
                [t.minerals, lang!.territory!.minerals, 'territory.minerals'],
                [t.climate, lang!.territory!.climate, 'territory.climate'],
                [t.metabolism, lang!.territory!.metabolism, 'territory.metabolism'],
                [t.transition, lang!.territory!.transition, 'territory.transition'],
              ] as [string, string, string][]).filter(([, text]) => text.trim().length > 0).map(([title, text, fieldId]) => (
                <div key={fieldId} id={fieldId} style={{ scrollMarginTop: 96 }}>
                  <h4 className="font-body text-xs text-[var(--cr-accent)] uppercase tracking-widest mb-2">{title}</h4>
                  <ProseParagraphs text={text} sources={activeSources} />
                </div>
              ))}
            </div>
          </FrameworkSection>
          </div>
        )}

        {/* 2. Society */}
        <div data-section="Society" id="society" style={{ scrollMarginTop: 96 }}>
        <FrameworkSection icon={Users} title={t.society} headerNote={hasSociety ? sectionMeta([
          lang!.society!.demographics, lang!.society!.composition, lang!.society!.language,
          lang!.society!.religion, lang!.society!.wellbeing, lang!.society!.cohesion,
        ]) : undefined}>
          {hasSociety ? (
            <div className="space-y-6">
              {([
                [t.demographics, lang!.society!.demographics, 'society.demographics'],
                [t.composition, lang!.society!.composition, 'society.composition'],
                [t.languageField, lang!.society!.language ?? '', 'society.language'],
                [t.religion, lang!.society!.religion, 'society.religion'],
                [t.wellbeing, lang!.society!.wellbeing ?? '', 'society.wellbeing'],
                [t.socialCohesionSection, lang!.society!.cohesion, 'society.cohesion'],
              ] as [string, string, string][]).filter(([, text]) => text.trim().length > 0).map(([title, text, fieldId]) => (
                <div key={fieldId} id={fieldId} style={{ scrollMarginTop: 96 }}>
                  <h4 className="font-body text-xs text-[var(--cr-accent)] uppercase tracking-widest mb-2">{title}</h4>
                  <ProseParagraphs text={text} sources={activeSources} />
                </div>
              ))}
            </div>
          ) : (
            <ComingSoonBlock language={language} />
          )}
        </FrameworkSection>
        </div>

        {/* 3. Economy */}
        <div data-section="Economy" id="economy" style={{ scrollMarginTop: 96 }}>
        <FrameworkSection icon={BarChart2} title={t.economy} headerNote={hasAnalysis ? sectionMeta([
          lang!.economy.realEconomy, lang!.economy.macroReality, lang!.economy.publicFinances,
          lang!.economy.externalVulnerability, lang!.economy.politicalEconomy,
        ]) : undefined}>
          {hasAnalysis ? (
            <div className="space-y-6">
              {([
                [t.realEconomy, lang!.economy.realEconomy?.trim() ? lang!.economy.realEconomy : lang!.economy.macroReality, 'economy.realEconomy'],
                [t.publicFinances, lang!.economy.publicFinances ?? '', 'economy.publicFinances'],
                [t.externalVuln, lang!.economy.externalVulnerability, 'economy.externalVulnerability'],
                [t.politicalEconomy, lang!.economy.politicalEconomy, 'economy.politicalEconomy'],
              ] as [string, string, string][]).filter(([, text]) => text.trim().length > 0).map(([title, text, fieldId]) => (
                <div key={fieldId} id={fieldId} style={{ scrollMarginTop: 96 }}>
                  <h4 className="font-body text-xs text-[var(--cr-accent)] uppercase tracking-widest mb-2">{title}</h4>
                  <ProseParagraphs text={text} sources={activeSources} />
                </div>
              ))}
            </div>
          ) : (
            <ComingSoonBlock language={language} />
          )}
        </FrameworkSection>
        </div>

        {/* 4. Political Order */}
        <div data-section="Political Stability" id="political" style={{ scrollMarginTop: 96 }}>
        <FrameworkSection icon={Shield} title={t.political} headerNote={hasAnalysis ? sectionMeta([
          lang!.political.powerStructure, lang!.political.rightsAndChecks, lang!.political.stabilityDrivers,
          lang!.political.shockAbsorbers, lang!.political.constitutionalSubstrate, lang!.political.stateStructure,
        ]) : undefined}>
          {hasAnalysis ? (
            <div className="space-y-6">
              {([
                [t.powerStructure, lang!.political.powerStructure, 'political.powerStructure'],
                [t.rightsAndChecks, lang!.political.rightsAndChecks ?? '', 'political.rightsAndChecks'],
                [t.stabilityDrivers, lang!.political.stabilityDrivers, 'political.stabilityDrivers'],
                [t.shockAbsorbers, lang!.political.shockAbsorbers, 'political.shockAbsorbers'],
                [t.constitutionalSubstrate, lang!.political.constitutionalSubstrate ?? '', 'political.constitutionalSubstrate'],
                [t.stateStructure, lang!.political.stateStructure ?? '', 'political.stateStructure'],
              ] as [string, string, string][]).filter(([, text]) => text.trim().length > 0).map(([title, text, fieldId]) => (
                <div key={fieldId} id={fieldId} style={{ scrollMarginTop: 96 }}>
                  <h4 className="font-body text-xs text-[var(--cr-accent)] uppercase tracking-widest mb-2">{title}</h4>
                  <ProseParagraphs text={text} sources={activeSources} />
                </div>
              ))}
            </div>
          ) : (
            <ComingSoonBlock language={language} />
          )}
        </FrameworkSection>
        </div>

        {/* 5. Capacity to Deliver */}
        {hasCapacity && (
          <div data-section="Capacity" id="capacity" style={{ scrollMarginTop: 96 }}>
          <FrameworkSection icon={Hammer} title={t.capacity} headerNote={sectionMeta([
            lang!.capacity!.inheritedTerrain, lang!.capacity!.steering, lang!.capacity!.approvals,
            lang!.capacity!.permitting, lang!.capacity!.delivery, lang!.capacity!.publicServices, lang!.capacity!.productivity,
          ])}>
            <div className="space-y-6">
              {([
                [t.inheritedTerrain, lang!.capacity!.inheritedTerrain ?? '', 'capacity.inheritedTerrain'],
                [t.steering, lang!.capacity!.steering ?? '', 'capacity.steering'],
                [t.approvals, lang!.capacity!.approvals?.trim() ? lang!.capacity!.approvals : lang!.capacity!.permitting, 'capacity.approvals'],
                [t.delivery, lang!.capacity!.delivery, 'capacity.delivery'],
                [t.publicServices, lang!.capacity!.publicServices ?? '', 'capacity.publicServices'],
                [t.productivity, lang!.capacity!.productivity, 'capacity.productivity'],
              ] as [string, string, string][]).filter(([, text]) => text.trim().length > 0).map(([title, text, fieldId]) => (
                <div key={fieldId} id={fieldId} style={{ scrollMarginTop: 96 }}>
                  <h4 className="font-body text-xs text-[var(--cr-accent)] uppercase tracking-widest mb-2">{title}</h4>
                  <ProseParagraphs text={text} sources={activeSources} />
                </div>
              ))}
            </div>
          </FrameworkSection>
          </div>
        )}

        {/* 6. Security & Diplomacy — posture displays first (composed last) */}
        <div data-section="Security & Diplomacy" id="security" style={{ scrollMarginTop: 96 }}>
        <FrameworkSection icon={Globe} title={t.security} headerNote={hasAnalysis ? sectionMeta([
          lang!.security.posture, lang!.security.internal, lang!.security.military,
          lang!.security.transnationalExposure, lang!.security.diplomacy,
        ]) : undefined}>
          {hasAnalysis ? (
            <div className="space-y-6">
              {([
                [t.posture, lang!.security.posture ?? '', 'security.posture'],
                [t.internalSecurity, lang!.security.internal, 'security.internal'],
                [t.military, lang!.security.military ?? '', 'security.military'],
                [t.transnationalExposure, lang!.security.transnationalExposure ?? '', 'security.transnationalExposure'],
                [t.diplomacy, lang!.security.diplomacy, 'security.diplomacy'],
              ] as [string, string, string][]).filter(([, text]) => text.trim().length > 0).map(([title, text, fieldId]) => (
                <div key={fieldId} id={fieldId} style={{ scrollMarginTop: 96 }}>
                  <h4 className="font-body text-xs text-[var(--cr-accent)] uppercase tracking-widest mb-2">{title}</h4>
                  <ProseParagraphs text={text} sources={activeSources} />
                </div>
              ))}
            </div>
          ) : (
            <ComingSoonBlock language={language} />
          )}
        </FrameworkSection>
        </div>

        {/* 7. Situation — the event layer (what has HAPPENED); dynamic tail */}
        {hasSituation && (
          <div data-section="Situation" id="situation" style={{ scrollMarginTop: 96 }}>
          <FrameworkSection
            icon={AlertTriangle}
            title={t.situation}
            // Situation is the most time-sensitive section — surface its own
            // verification date in the band. FR-PLACEHOLDER: French label below.
            headerNote={analysis?.situationUpdated
              ? (language === 'fr' ? `Vérifié le ${analysis.situationUpdated}` : `Verified ${analysis.situationUpdated}`)
              : undefined}
          >
            <SituationSection text={lang!.situation!} sources={activeSources} />
          </FrameworkSection>
          </div>
        )}

        {/* 8. Actors Map */}
        <div data-section="Actors" id="actors" style={{ scrollMarginTop: 96 }}>
        <FrameworkSection icon={Users} title={t.actors}>
          {hasAnalysis ? (
            <div className="space-y-6">
              <div>
                <h4 className="font-body text-xs text-[var(--cr-accent)] uppercase tracking-widest mb-3">{t.domesticActors}</h4>
                <div className="space-y-2">
                  {lang!.actors.domestic.map((actor) => (
                    <ActorCard key={actor.name} actor={actor} language={language} sources={activeSources} />
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-body text-xs text-[var(--cr-accent)] uppercase tracking-widest mb-3">{t.externalActors}</h4>
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
              <div className="mt-4 text-[var(--cr-muted)] font-body text-xs leading-relaxed">
                <p className="font-medium text-[var(--cr-body)] mb-2">
                  {language === 'fr' ? 'Pour chaque acteur : Intérêts · Ressources · Contraintes · Mouvements probables · Négociabilité' : 'For each actor: Interests · Resources · Constraints · Likely moves · Dealability'}
                </p>
              </div>
            </>
          )}
        </FrameworkSection>
        </div>

        {/* 9. Risk Register */}
        <div data-section="Risk Register" id="risks" style={{ scrollMarginTop: 96 }}>
        <FrameworkSection icon={AlertTriangle} title={t.risks}>
          {hasAnalysis ? (
            <div className="space-y-2">
              {/* Redesign notice — the risk framing predates the two-phase pipeline and is
                  being reworked; entries (and the level derived from them) read accordingly.
                  FR-PLACEHOLDER: French wording below awaits Peggy's review. */}
              <div className="mb-3 px-3 py-2 border rounded font-body text-xs italic bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900">
                {language === 'fr'
                  ? 'Section en cours de remaniement — les entrées actuelles reflètent un cadrage obsolète.'
                  : 'Under redesign — current entries reflect an outdated framing.'}
              </div>
              {/* Derived overall risk level — rule-based, from this country's own register */}
              {derivedRisk && (
                <div className="mb-4 flex items-center gap-2 flex-wrap pb-3 border-b border-[var(--cr-divider)]">
                  <span className="font-body text-[10px] uppercase tracking-widest text-[var(--cr-muted)]">{t.overallRisk}:</span>
                  <span className={`font-body text-xs px-2 py-0.5 border rounded ${
                    derivedRisk.level === 'High'
                      ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-900'
                      : derivedRisk.level === 'Medium'
                        ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900'
                        : 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-900'
                  }`}>
                    {derivedRisk.level === 'High' ? t.riskHigh : derivedRisk.level === 'Medium' ? t.riskMedium : t.riskLow}
                  </span>
                  {derivedRisk.drivenBy && (
                    <span className="font-body text-xs text-[var(--cr-muted)] italic">
                      — {t.drivenBy}: <span className="not-italic font-medium text-[var(--cr-body)]">{derivedRisk.drivenBy}</span>
                    </span>
                  )}
                </div>
              )}
              {/* Legend */}
              <div className="flex items-center gap-4 mb-3 text-[10px] font-body text-[var(--cr-muted)]">
                <span>{language === 'fr' ? 'Badges :' : 'Badges:'}</span>
                <span className="px-1.5 py-0.5 border rounded bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-900">
                  {language === 'fr' ? 'Élevé' : 'High'}
                </span>
                <span className="px-1.5 py-0.5 border rounded bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900">
                  {language === 'fr' ? 'Moyen' : 'Med'}
                </span>
                <span className="px-1.5 py-0.5 border rounded bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-900">
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
              <div className="mt-4 text-[var(--cr-muted)] font-body text-xs leading-relaxed">
                <p className="font-medium text-[var(--cr-body)] mb-2">
                  {language === 'fr'
                    ? 'Chaque risque : Déclencheur · Probabilité · Impact · Horizon · Indicateurs avancés · Atténuation'
                    : 'Each risk: Trigger · Probability · Impact · Time horizon · Leading indicators · Mitigants'}
                </p>
              </div>
            </>
          )}
        </FrameworkSection>
        </div>

        {/* 10. Sources */}
        <div id="sources" style={{ scrollMarginTop: 96 }}>
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
            ] as SourceEntry[]).map(({ id: sourceId, name, nameFr, url, desc, descFr, publicationDate, accessDate, confidence, citationType }, idx) => {
              const confidenceColor = confidence === 'High' ? 'bg-green-50 border-green-200 dark:bg-green-950/40 dark:border-green-900' : confidence === 'Med' ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/40 dark:border-yellow-900' : 'bg-red-50 border-red-200 dark:bg-red-950/40 dark:border-red-900';
              // FR-PLACEHOLDER: confidence label French wording (fiabilité, feminine) — Peggy to verify.
              const confidenceLabel = language === 'fr'
                ? (confidence === 'High' ? '✓ Élevée' : confidence === 'Med' ? '◐ Moyenne' : '✗ Faible')
                : (confidence === 'High' ? '✓ High' : confidence === 'Med' ? '◐ Medium' : '✗ Low');
              const confidenceTextColor = confidence === 'High' ? 'text-green-700 dark:text-green-300' : confidence === 'Med' ? 'text-yellow-700 dark:text-yellow-300' : 'text-red-700 dark:text-red-300';
              const citationNum = sourceId ?? (idx + 1);
              const dName = language === 'fr' ? (nameFr || name) : name;
              const dDesc = language === 'fr' ? (descFr || desc) : desc;
              return (
                <a
                  key={name + idx}
                  id={`source-${citationNum}`}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-start justify-between px-4 py-3 border transition-colors group focus:ring-2 focus:ring-[var(--cr-accent)] focus:ring-offset-2 ${
                    confidence ? confidenceColor : 'border-[var(--cr-border)] hover:border-[var(--cr-accent)] hover:bg-[var(--cr-hover-2)]'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-body text-sm font-medium text-[var(--cr-ink)] group-hover:text-[var(--cr-accent)] transition-colors">{dName}</p>
                      {/* FR-PLACEHOLDER: Fait / Interprétation wording — Peggy to verify. */}
                      {citationType && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 bg-[var(--cr-border)] text-[var(--cr-accent)] rounded">
                          {language === 'fr'
                            ? (citationType === 'Interpretation' ? 'Interprétation' : 'Fait')
                            : citationType}
                        </span>
                      )}
                    </div>
                    <p className="font-body text-xs text-[var(--cr-muted)] mb-2">{dDesc}</p>
                    <div className="flex flex-wrap gap-2 items-center text-[10px]">
                      {publicationDate && <span className="text-[var(--cr-muted)]">{language === 'fr' ? 'Pub. :' : 'Pub:'} {publicationDate}</span>}
                      {accessDate && <span className="text-[var(--cr-muted)]">{language === 'fr' ? 'Consulté :' : 'Accessed:'} {accessDate}</span>}
                      {confidence && <span className={`font-medium ${confidenceTextColor}`}>{confidenceLabel}</span>}
                    </div>
                  </div>
                  <ExternalLink size={12} className="text-[var(--cr-accent)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1 ml-2" />
                </a>
              );
            })}
          </div>
          {/* Floating Back Button */}
          {clickedSection && (
            <div className="fixed bottom-6 right-6 p-3 bg-[var(--cr-hover-2)] border border-[var(--cr-accent)] rounded shadow-lg flex items-center gap-3 z-40 max-w-xs">
              <span className="font-body text-xs text-[var(--cr-body)] hidden sm:inline">
                {language === 'fr' ? 'Vous lisiez : ' : 'You were reading: '}
                <span className="font-medium text-[var(--cr-accent)]">{clickedSection}</span>
              </span>
              <button
                onClick={() => {
                  const sectionElement = document.querySelector(`[data-section="${clickedSection}"]`);
                  if (sectionElement) {
                    sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="px-3 py-1.5 bg-[var(--cr-accent)] text-[var(--cr-on-accent)] text-xs font-medium rounded hover:bg-[var(--cr-accent-hover)] transition-colors whitespace-nowrap shrink-0"
              >
                {language === 'fr' ? 'Retour' : 'Back'}
              </button>
            </div>
          )}
        </FrameworkSection>
        </div>

        </div>

        {/* ── Lateral rail (rework §5): nav list + scorecard, desktop only.
            The scorecard is a visually DISTINCT block (assessment vs
            navigation) — accent border vs the nav's neutral border. ── */}
        <aside className="hidden lg:block sticky top-16 space-y-4">
          <nav className="border border-[var(--cr-border)] bg-[var(--cr-surface)] px-4 py-3" aria-label={language === 'fr' ? 'Sections du rapport' : 'Report sections'}>
            <p className="font-body text-[10px] uppercase tracking-widest text-[var(--cr-muted)] mb-2">
              {language === 'fr' ? 'Sections' : 'Sections'}
            </p>
            <ul className="space-y-1.5">
              {navItems.map(({ id, label }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="font-body text-xs text-[var(--cr-body)] hover:text-[var(--cr-accent)] transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="border border-[var(--cr-accent)] bg-[var(--cr-surface)] px-4 py-3">
            <p className="font-body text-xs text-[var(--cr-muted)] uppercase tracking-widest mb-3">{scorecardTitle}</p>
            {scorecardRows}
          </div>
        </aside>
        </div>

      </div>
    </div>
  );
}
