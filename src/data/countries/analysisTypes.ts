/*
 * TransHorizons — Country Analysis type contract (CANONICAL).
 *
 * The single source of truth for the report data shape: AnalysisContent and its
 * parts (LangContent, ActorEntry, SourceEntry, the gap-register types, ScoreRating).
 * Extracted from src/data/france.ts on 2026-07-28 — the contract had been living in
 * a legacy Manus-era DATA file that France's regeneration will discard, which would
 * have taken the renderer, the YAML adapter and every country's typing down with it.
 * The renderer (CountryPage), the YAML adapter (adaptCountryYaml) and the actor
 * visualization import from HERE, not from any country data file.
 */

/**
 * Scorecard rating scale (2026-07-28: widened from 3 to 5 levels). Med-High and
 * Med-Low give "strong-but-strained" and "weak-but-functioning" their own honest
 * home, so a stable country need not be forced down to Med — resolution the
 * ~200-country comparison globe needs. Ordered High → Low. Only the SCORECARD
 * axes use this; source/risk confidence stays the 3-level 'High' | 'Med' | 'Low'.
 */
export type ScoreRating = 'High' | 'Med-High' | 'Med' | 'Med-Low' | 'Low';

export interface AnalysisContent {
  lastUpdated: string;
  /**
   * When the situation section's events were last verified/updated (YYYY-MM-DD).
   * Maintained MANUALLY in Keystatic (the situation layer is the most
   * time-sensitive part of the report). Shown in the Situation header band.
   */
  situationUpdated?: string;
  scorecard: {
    eliteCohesion: ScoreRating;
    /** Second of the two-cohesions split (distinct from eliteCohesion). Optional until a country is regenerated with a society pass. */
    socialCohesion?: ScoreRating;
    securityLoyalty: ScoreRating;
    economicPressure: ScoreRating;
    protestCapacity: ScoreRating;
    institutionalResilience: ScoreRating;
  };
  /**
   * Anchoring (rework §1/§4): per-axis { anchors: [source-ids or dot field
   * paths], rationale_en, rationale_fr }. Ratings are Interpretation summarising
   * already-cited facts; each axis reveals its rationale + anchors on expand.
   * Optional until a country is regenerated with the reworked pipeline.
   */
  scorecardAnchors?: Record<string, { anchors?: string[]; rationale_en?: string; rationale_fr?: string }>;
  en: LangContent;
  fr: LangContent;
  /**
   * Shared sources registry (new-format countries). Takes precedence over en.sources / fr.sources.
   * Citations in narratives use stable slug IDs matching source.id, e.g. [imf], [pm-ca].
   */
  sources?: SourceEntry[];
}

export interface LangContent {
  executiveSnapshot: string[];
  political: {
    powerStructure: string;
    /** New (rework §3): judicial + media independence; civil liberties; regional instruments preferred. */
    rightsAndChecks?: string;
    stabilityDrivers: string;
    shockAbsorbers: string;
    /** Deep-time legal bedrock (treaty lineage / title). Optional until a country is regenerated with the six-peer schema. */
    constitutionalSubstrate?: string;
    /** New (rework §3): unitary/federal; divisions in the country's own term; powers by level; asymmetries. */
    stateStructure?: string;
  };
  /**
   * Situation — the event layer, top-level peer positioned after political,
   * before economy. What has materially HAPPENED to the country in the last 12
   * months (war, coup, disaster, crisis, major law) and what it changed —
   * distinct from what the country IS. Optional until a country is regenerated
   * with the event scan (Pass Zero-B).
   */
  situation?: string;
  /**
   * Baseline (rework §5) — the page's only always-visible prose: a short,
   * derivative, present-state paragraph composed LAST by Pass B (no new facts,
   * no anchors, never a forecast). Empty on countries not yet regenerated —
   * the renderer then shows nothing (no placeholder, no back-fill).
   */
  baseline?: string;
  economy: {
    /**
     * LEGACY name — superseded by realEconomy (rework §3). Renderer falls back to it.
     * TODO(post-migration): remove once no displayed country (YAML or hardcoded .ts)
     * depends on the legacy name.
     */
    macroReality: string;
    /** Renames macroReality: sectors, growth, what people do for a living (fiscal/monetary moved out). */
    realEconomy?: string;
    /** New (rework §3): the state's money — balance, debt share, monetary stance, inflation, rating. */
    publicFinances?: string;
    externalVulnerability: string;
    politicalEconomy: string;
  };
  /**
   * Territory section — the physical body of the country, top-level peer
   * positioned after economy, before capacity. Optional until a country is
   * regenerated with the six-peer schema.
   */
  territory?: {
    geography: string;
    minerals: string;
    biosphere: string;
    climate: string;
    metabolism: string;
    transition: string;
  };
  /**
   * Capacity section — can the state build/permit/deliver. Top-level peer
   * positioned after territory, before society. Optional until a country is
   * regenerated with the six-peer schema.
   */
  capacity?: {
    /** New (rework §3): anchored synthesis — the structural denominator; merit-gap guard applies. */
    inheritedTerrain?: string;
    /** New (rework §3): governance-as-process; Interpretation anchored to the observable record. */
    steering?: string;
    /**
     * LEGACY name — superseded by approvals (rework §3). Renderer falls back to it.
     * TODO(post-migration): remove once no displayed country (YAML or hardcoded .ts)
     * depends on the legacy name.
     */
    permitting: string;
    /** Renames permitting. */
    approvals?: string;
    delivery: string;
    /** New (rework §3): realised record running continuous service systems. */
    publicServices?: string;
    productivity: string;
    /**
     * Gap register (2026-07-20, workorder-gap-register.md): "known and unbuilt" —
     * anchored synthesis composed by the derivatives pass, NOT Pass B. Parsed
     * from JSON-in-text; null until the pass runs (render nothing then).
     */
    knownAndUnbuilt?: KnownAndUnbuiltRegister | null;
  };
  /**
   * Society section — top-level peer of political/economy/security, positioned
   * after economy and before security. Optional until a country is regenerated
   * with a society research pass.
   */
  society?: {
    demographics: string;
    composition: string;
    /** New (rework §3): linguistic composition, lived texture, political salience. */
    language?: string;
    religion: string;
    /** New (rework §3): health + educational OUTCOMES (the systems live in capacity.publicServices). */
    wellbeing?: string;
    cohesion: string;
  };
  security: {
    /** New (rework §3): anchored synthesis of the other four security fields; displays first, composed last. */
    posture?: string;
    internal: string;
    /** New (rework §3): capability (loyalty/control stay in political.stabilityDrivers). */
    military?: string;
    /** New (rework §3): cross-border flows and non-state entanglements. */
    transnationalExposure?: string;
    diplomacy: string;
  };
  actors: {
    domestic: ActorEntry[];
    external: ActorEntry[];
  };
  /**
   * LEGACY — the Risk Register was REMOVED 2026-07-20 (workorder-gap-register.md;
   * replaced by capacity.knownAndUnbuilt). Optional so legacy hardcoded country
   * data files still typecheck; nothing renders it. TODO(post-migration): strip
   * the arrays from the hardcoded .ts files and delete RiskEntry.
   */
  risks?: RiskEntry[];
  /** Per-language sources (old format). For new-format countries, use top-level AnalysisContent.sources instead. */
  sources?: SourceEntry[];
}

/** Gap register item — a shortfall the report itself asserts (close paraphrase). */
export interface GapRegisterItem {
  /** One sentence, the report speaking, with inline [markers] preserved. */
  gap: string;
  /** [dot.path] field(s) and [source-id](s) the item rests on. */
  anchor: string[];
  /** When first officially identified / span given, cited — or 'report-silent'. */
  since: string;
  /** no-attempt-documented | announced-not-implemented | attempted-and-failed | in-progress-unclosed (Interpretation). */
  class: string;
}

/** capacity.knownAndUnbuilt — the gap register (anchored synthesis, derivatives pass). */
export interface KnownAndUnbuiltRegister {
  /** Opener declaring the documentation base the register rests on. */
  opener: string;
  items: GapRegisterItem[];
  /** The guard's denominator sentence (capacity is inherited, never deserved). */
  denominator?: string;
}

export interface ActorEntry {
  name: string;
  /** Layer 1 (extraction — rework §8.1): actor kind (party, institution, firm, movement…). */
  kind?: string;
  /** Layer 1: live status from the report (in office, opposition, dissolved…). */
  liveActorStatus?: string;
  /** Layer 1: current position extracted from the report. */
  currentPosition?: string;
  /** Layer 1: which report fields cite this actor. */
  fieldsCitedIn?: string[];
  /**
   * Render-level grouping slug (2026-08-13): language-neutral id resolved to a
   * display label via src/lib/actorGroups.ts. A reading aid ONLY — actors stay
   * individual entries (per-actor fieldsCitedIn granularity is the candidate
   * substrate for the risk-correlations re-derivation). Absent on untagged
   * countries (CAN/DEU/BRA) → flat-list rendering.
   */
  group?: string;
  /** Layer 2 (analytical draft — AI-drafted/unverified; renders collapsed + labelled). */
  interests: string;
  resources: string;
  constraints: string;
  likelyMoves: string;
  /**
   * Rework §8.1: structural engagement category (negotiable, statutorily-independent,
   * judicial-deference, hijack-exposed, veto-holder, blocked / not-engageable,
   * report-silent) with a one-line justification. Replaces dealability.
   */
  engagementMode?: string;
  /**
   * LEGACY rating — superseded by engagementMode; still displayed when present.
   * TODO(post-migration): remove once every displayed country's actors have been
   * regenerated through the actors pass.
   */
  dealability: string;
}

export interface RiskEntry {
  title: string;
  trigger: string;
  probability: 'Low' | 'Med' | 'High';
  impact: 'Low' | 'Med' | 'High';
  timeHorizon: string;
  leadingIndicators: string;
  mitigants: string;
  lastAssessed?: string;
}

export interface SourceEntry {
  /** Stable slug ID used in citation markers, e.g. [imf] or [pm-ca]. Required for new-format countries. */
  id?: string;
  name: string;
  /** French display name (FR page); falls back to `name` when absent. */
  nameFr?: string;
  url: string;
  desc: string;
  /** French description (FR page); falls back to `desc` when absent. */
  descFr?: string;
  publicationDate?: string;
  accessDate?: string;
  confidence?: 'High' | 'Med' | 'Low';
  citationType?: 'Fact' | 'Interpretation';
  /** ISO date (YYYY-MM-DD) of last URL verification. */
  lastVerified?: string;
  /** Wayback Machine URL for link-rot fallback. */
  archiveUrl?: string | null;
}
