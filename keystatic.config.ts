/*
 * STOP — declare-before-write (see CLAUDE.md). Keystatic SILENTLY STRIPS any
 * YAML field not declared in this schema on the next save from the admin UI.
 * Any new field must be added here BEFORE content is written to it — articles
 * fields in `sectionFields`, country-report fields in the `countries`
 * collection.
 */
import { config, fields, collection, singleton } from '@keystatic/core';

const sectionFields = {
  title_en: fields.text({ label: 'Section Title (EN)' }),
  title_fr: fields.text({ label: 'Section Title (FR)' }),
  content_en: fields.text({ label: 'Content (EN)', multiline: true }),
  content_fr: fields.text({ label: 'Content (FR)', multiline: true }),
  image: fields.text({ label: 'Image URL', validation: { isRequired: false } }),
  imagePosition: fields.select({
    label: 'Image Position',
    options: [
      { label: 'Left', value: 'left' },
      { label: 'Right', value: 'right' },
      { label: 'Full width', value: 'full' },
      { label: 'Side by side', value: 'side-by-side' },
    ],
    defaultValue: 'right',
  }),
  // Multi-image layout (read by the SSR .astro page; keep these or Keystatic
  // saves silently strip them).
  imageLayout: fields.select({
    label: 'Image Layout',
    options: [
      { label: 'Single', value: 'single' },
      { label: 'Side by side (2 images)', value: 'side-by-side' },
      { label: 'Dual toggle (4 images)', value: 'dual-toggle' },
    ],
    defaultValue: 'single',
  }),
  images: fields.array(
    fields.object({
      src: fields.text({ label: 'Image URL' }),
      label_en: fields.text({ label: 'Caption (EN)', validation: { isRequired: false } }),
      label_fr: fields.text({ label: 'Caption (FR)', validation: { isRequired: false } }),
    }),
    { label: 'Images (side-by-side / dual-toggle)', itemLabel: (props) => props.fields.src.value || 'Image' }
  ),
  // Embedded interactive visualization (scrollable iframe of a /visualizations/*.html page).
  embedUrl: fields.text({ label: 'Embed URL (iframe, e.g. /visualizations/x.html)', validation: { isRequired: false } }),
  embedHeight: fields.integer({ label: 'Embed Height (px)', validation: { isRequired: false } }),
};

const takeawayFields = {
  title_en: fields.text({ label: 'Takeaway Title (EN)' }),
  title_fr: fields.text({ label: 'Takeaway Title (FR)' }),
  description_en: fields.text({ label: 'Description (EN)', multiline: true }),
  description_fr: fields.text({ label: 'Description (FR)', multiline: true }),
};

const relatedProjectFields = {
  id: fields.text({ label: 'Slug ID' }),
  title_en: fields.text({ label: 'Title (EN)' }),
  title_fr: fields.text({ label: 'Title (FR)' }),
  category_en: fields.text({ label: 'Category (EN)' }),
  category_fr: fields.text({ label: 'Category (FR)' }),
};

// ── Country Analysis Fields ─────────────────────────────────────────────────

// Scorecard rating scale — 5 levels (2026-07-28, widened from 3). Ordered High →
// Low so the Keystatic dropdown reads top-to-bottom. Med-High / Med-Low give the
// "strong-but-strained" and "weak-but-functioning" cases their own home.
const ratingOptions = [
  { label: 'High', value: 'High' },
  { label: 'Med-High', value: 'Med-High' },
  { label: 'Med', value: 'Med' },
  { label: 'Med-Low', value: 'Med-Low' },
  { label: 'Low', value: 'Low' },
];

// ── Research Approach Singleton Fields ──────────────────────────────────────

const processItemFields = {
  bold: fields.text({ label: 'Bold Segment' }),
  rest: fields.text({ label: 'Trailing Segment', multiline: true }),
};

const scopeItemFields = {
  title: fields.text({ label: 'Title' }),
  desc: fields.text({ label: 'Description', multiline: true }),
};

const raLangFields = () => ({
  pageTitle: fields.text({ label: 'Page Title' }),
  backLabel: fields.text({ label: 'Back Label' }),
  method: fields.object({
    heading: fields.text({ label: 'Heading' }),
    label: fields.text({ label: 'Label' }),
    body: fields.text({ label: 'Body (paragraphs separated by blank lines)', multiline: true }),
  }, { label: 'Method & Approach' }),
  scope: fields.object({
    heading: fields.text({ label: 'Heading' }),
    intro: fields.text({ label: 'Intro', multiline: true }),
    items: fields.array(fields.object(scopeItemFields), { label: 'Items', itemLabel: (p) => p.fields.title.value || 'Item' }),
    closing: fields.text({ label: 'Closing', multiline: true }),
  }, { label: 'Analytical Scope' }),
  sources: fields.object({
    heading: fields.text({ label: 'Heading' }),
    intro: fields.text({ label: 'Intro', multiline: true }),
    items: fields.text({ label: 'Items (one per line)', multiline: true }),
    closing: fields.text({ label: 'Closing', multiline: true }),
  }, { label: 'Sources Monitored' }),
  process: fields.object({
    heading: fields.text({ label: 'Heading' }),
    intro: fields.text({ label: 'Intro', multiline: true }),
    items: fields.array(fields.object(processItemFields), { label: 'Items', itemLabel: (p) => p.fields.bold.value || 'Item' }),
    closing: fields.text({ label: 'Closing', multiline: true }),
  }, { label: 'Update Rhythm' }),
  mapping: fields.object({
    heading: fields.text({ label: 'Heading' }),
    body: fields.text({ label: 'Body (paragraphs separated by blank lines)', multiline: true }),
    items: fields.text({ label: 'Items (one per line)', multiline: true }),
    closing: fields.text({ label: 'Closing', multiline: true }),
  }, { label: 'Mapping Methodology' }),
  traceability: fields.object({
    heading: fields.text({ label: 'Heading' }),
    body: fields.text({ label: 'Body (paragraphs separated by blank lines)', multiline: true }),
    items: fields.text({ label: 'Items (one per line)', multiline: true }),
    closing: fields.text({ label: 'Closing', multiline: true }),
  }, { label: 'Source Traceability' }),
  tools: fields.object({
    heading: fields.text({ label: 'Heading' }),
    intro: fields.text({ label: 'Intro (paragraphs separated by blank lines)', multiline: true }),
    usedItems: fields.text({ label: 'Used Items (one per line)', multiline: true }),
    p3: fields.text({ label: 'Transition Label' }),
    howeverItems: fields.text({ label: 'Constraint Items (one per line)', multiline: true }),
    outro: fields.text({ label: 'Outro (paragraphs separated by blank lines)', multiline: true }),
  }, { label: 'Analytical Tools' }),
  principles: fields.object({
    heading: fields.text({ label: 'Heading' }),
    intro: fields.text({ label: 'Intro', multiline: true }),
    items: fields.array(fields.object(scopeItemFields), { label: 'Items', itemLabel: (p) => p.fields.title.value || 'Item' }),
  }, { label: 'Analytical Principles' }),
  limits: fields.object({
    heading: fields.text({ label: 'Heading' }),
    body: fields.text({ label: 'Body (paragraphs separated by blank lines)', multiline: true }),
    items: fields.text({ label: 'Items (one per line)', multiline: true }),
    closing: fields.text({ label: 'Closing', multiline: true }),
  }, { label: 'Limits & Uncertainty' }),
  referencing: fields.object({
    heading: fields.text({ label: 'Heading' }),
    sources: fields.object({
      heading: fields.text({ label: 'Heading' }),
      body: fields.text({ label: 'Body (paragraphs separated by blank lines)', multiline: true }),
    }, { label: 'Sources & Documentation' }),
    citation: fields.object({
      heading: fields.text({ label: 'Heading' }),
      intro: fields.text({ label: 'Intro', multiline: true }),
      items: fields.text({ label: 'Items (one per line)', multiline: true }),
      closing: fields.text({ label: 'Closing', multiline: true }),
    }, { label: 'Citation Philosophy' }),
  }, { label: 'Referencing Approach' }),
  position: fields.object({
    heading: fields.text({ label: 'Heading' }),
    body: fields.text({ label: 'Body (paragraphs separated by blank lines)', multiline: true }),
  }, { label: 'Position' }),
});

export default config({
  storage: { kind: 'local' },

  singletons: {
    researchApproach: singleton({
      label: 'Research Approach Page',
      path: 'content/pages/research-approach',
      format: { data: 'yaml' },
      schema: {
        en: fields.object(raLangFields(), { label: 'English' }),
        fr: fields.object(raLangFields(), { label: 'French' }),
      },
    }),
  },

  collections: {
    articles: collection({
      label: 'Articles',
      slugField: 'title_en',
      path: 'content/articles/*',
      format: { data: 'yaml' },
      schema: {
        // ── Shared (language-neutral) fields ──────────────────────────────
        heroImage: fields.text({ label: 'Hero Image URL' }),
        date: fields.text({ label: 'Date' }),
        readTime: fields.text({ label: 'Read Time' }),
        articleType_en: fields.text({ label: 'Article Type (EN)', validation: { isRequired: false } }),
        articleType_fr: fields.text({ label: 'Article Type (FR)', validation: { isRequired: false } }),
        category_en: fields.text({ label: 'Category (EN)' }),
        category_fr: fields.text({ label: 'Category (FR)' }),

        // ── English ───────────────────────────────────────────────────────
        title_en: fields.slug({
          name: { label: 'Title (EN)' },
        }),
        subtitle_en: fields.text({ label: 'Subtitle (EN)', multiline: true }),
        introductionTitle_en: fields.text({
          label: 'Introduction Title (EN)',
          validation: { isRequired: false },
        }),
        introduction_en: fields.text({ label: 'Introduction (EN)', multiline: true }),

        // ── French ────────────────────────────────────────────────────────
        title_fr: fields.text({ label: 'Title (FR)' }),
        subtitle_fr: fields.text({ label: 'Subtitle (FR)', multiline: true }),
        introductionTitle_fr: fields.text({
          label: 'Introduction Title (FR)',
          validation: { isRequired: false },
        }),
        introduction_fr: fields.text({ label: 'Introduction (FR)', multiline: true }),

        // ── Sections ──────────────────────────────────────────────────────
        sections: fields.array(
          fields.object(sectionFields),
          { label: 'Sections', itemLabel: (props) => props.fields.title_en.value || 'Section' }
        ),

        // ── Key Takeaways ─────────────────────────────────────────────────
        keyTakeaways: fields.array(
          fields.object(takeawayFields),
          { label: 'Key Takeaways', itemLabel: (props) => props.fields.title_en.value || 'Takeaway' }
        ),

        // ── Related Projects ──────────────────────────────────────────────
        relatedProjects: fields.array(
          fields.object(relatedProjectFields),
          { label: 'Related Projects', itemLabel: (props) => props.fields.title_en.value || 'Project' }
        ),

        // ── Optional Sources Block (grouped in the UI) ───────────────────
        sources: fields.object(
          {
            en: fields.array(
              fields.text({ label: 'Source Line (EN)' }),
              {
                label: 'Sources (EN)',
                itemLabel: (props) => props.value || 'Source',
                validation: { isRequired: false },
              }
            ),
            fr: fields.array(
              fields.text({ label: 'Source Line (FR)' }),
              {
                label: 'Sources (FR)',
                itemLabel: (props) => props.value || 'Source',
                validation: { isRequired: false },
              }
            ),
            disclaimer_en: fields.text({
              label: 'Sources Disclaimer (EN)',
              multiline: true,
              validation: { isRequired: false },
            }),
            disclaimer_fr: fields.text({
              label: 'Sources Disclaimer (FR)',
              multiline: true,
              validation: { isRequired: false },
            }),
          },
          { label: 'Sources Block' }
        ),
      },
    }),

    // ────────────────────────────────────────────────────────────────────────
    // Country Analysis Collection
    // ────────────────────────────────────────────────────────────────────────

    countries: collection({
      label: 'Country Analysis',
      slugField: 'code',
      path: 'content/countries/*/analysis',
      format: { data: 'yaml' },
      schema: {
        // ── Metadata ──────────────────────────────────────────────────────
        code: fields.text({
          label: 'Country Code (CCA3, e.g., "CAN", "FRA")',
          validation: { isRequired: true },
        }),
        nameEn: fields.text({ label: 'Country Name (EN)' }),
        nameFr: fields.text({ label: 'Country Name (FR)' }),
        lastUpdated: fields.text({
          label: 'Last Updated (YYYY-MM-DD)',
          validation: { isRequired: true },
        }),

        // ── Scorecard ─────────────────────────────────────────────────────
        scorecard_eliteCohesion: fields.select({
          label: 'Scorecard: Elite Cohesion',
          options: ratingOptions,
          defaultValue: 'Med',
          validation: { isRequired: false },
        }),
        // Social cohesion is the second of the two-cohesions split (distinct from
        // elite cohesion); paired here beside it. See src/lib/deriveRiskLevel.ts
        // for how riskLevel is derived separately from the risk register.
        scorecard_socialCohesion: fields.select({
          label: 'Scorecard: Social Cohesion',
          options: ratingOptions,
          defaultValue: 'Med',
          validation: { isRequired: false },
        }),
        scorecard_securityLoyalty: fields.select({
          label: 'Scorecard: Security Loyalty',
          options: ratingOptions,
          defaultValue: 'Med',
          validation: { isRequired: false },
        }),
        scorecard_economicPressure: fields.select({
          label: 'Scorecard: Economic Pressure',
          options: ratingOptions,
          defaultValue: 'Med',
          validation: { isRequired: false },
        }),
        scorecard_protestCapacity: fields.select({
          label: 'Scorecard: Protest Capacity',
          options: ratingOptions,
          defaultValue: 'Med',
          validation: { isRequired: false },
        }),
        scorecard_institutionalResilience: fields.select({
          label: 'Scorecard: Institutional Resilience',
          options: ratingOptions,
          defaultValue: 'Med',
          validation: { isRequired: false },
        }),
        // Anchoring (rework §1/§4): JSON-in-text — { axis: { anchors: ["source-id",
        // "territory.climate"], rationale_en, rationale_fr } } for each of the six
        // axes. Ratings are Interpretation; anchors name the cited facts they rest on.
        scorecard_anchors: fields.text({
          label: 'Scorecard Anchors (JSON)',
          multiline: true,
          description: 'Per-axis { anchors: [source-ids or field paths], rationale_en, rationale_fr } — validated by the citations validator',
        }),

        // ── Executive Snapshot ────────────────────────────────────────────
        // Executive Snapshot REMOVED (rework §5) — its content lives in the
        // section openers. Legacy executiveSnapshot_* keys in existing YAML are
        // inert and will be stripped on the country's next Keystatic save
        // (decided; Canada's snapshot is archived in content/countries/CAN/archive/).
        // Baseline replaces it as the page's only always-visible prose —
        // composed LAST by Pass B, derivative, no new facts, never a forecast.
        baseline_en: fields.text({
          label: 'Baseline (EN)',
          multiline: true,
          description: 'Short paragraph; only ids already cited in this report; never "Outlook"',
        }),
        baseline_fr: fields.text({
          label: 'Baseline (FR)',
          multiline: true,
          description: 'Paragraphe court; uniquement des ids déjà cités dans ce rapport',
        }),

        // ── Territory Section ─────────────────────────────────────────────
        // Physical body of the country, on its own terms. Top-level peer,
        // positioned after economy, before capacity. Declare BEFORE writing
        // territory_* content (strip rule).
        territory_geography_en: fields.text({
          label: 'Territory: Geography (EN)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),
        territory_geography_fr: fields.text({
          label: 'Territory: Geography (FR)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),

        territory_biosphere_en: fields.text({
          label: 'Territory: Biosphere (EN)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),
        territory_biosphere_fr: fields.text({
          label: 'Territory: Biosphere (FR)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),

        territory_minerals_en: fields.text({
          label: 'Territory: Minerals (EN)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),
        territory_minerals_fr: fields.text({
          label: 'Territory: Minerals (FR)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),

        territory_climate_en: fields.text({
          label: 'Territory: Climate (EN)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),
        territory_climate_fr: fields.text({
          label: 'Territory: Climate (FR)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),

        territory_metabolism_en: fields.text({
          label: 'Territory: Metabolism (EN)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),
        territory_metabolism_fr: fields.text({
          label: 'Territory: Metabolism (FR)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),

        territory_transition_en: fields.text({
          label: 'Territory: Transition (EN)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),
        territory_transition_fr: fields.text({
          label: 'Territory: Transition (FR)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),

        // ── Society Section ───────────────────────────────────────────────
        // Top-level peer of political/economy/security. Positioned after
        // economy, before security. Narrative paragraph fields (proofable
        // surface) — declare BEFORE writing society_* content (strip rule).
        society_demographics_en: fields.text({
          label: 'Society: Demographics (EN)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),
        society_demographics_fr: fields.text({
          label: 'Society: Demographics (FR)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),

        society_composition_en: fields.text({
          label: 'Society: Composition (EN)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),
        society_composition_fr: fields.text({
          label: 'Society: Composition (FR)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),
        // Rework §3 — Society gains language (out of composition) + wellbeing
        // (outcomes; the systems live in capacity_publicServices).
        society_language_en: fields.text({
          label: 'Society: Language (EN)',
          multiline: true,
          description: 'Linguistic composition; lived texture; political salience; named-bias sourcing. Include [source-id]',
        }),
        society_language_fr: fields.text({
          label: 'Society: Language (FR)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),

        society_religion_en: fields.text({
          label: 'Society: Religion (EN)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),
        society_religion_fr: fields.text({
          label: 'Society: Religion (FR)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),
        society_wellbeing_en: fields.text({
          label: 'Society: Wellbeing (EN)',
          multiline: true,
          description: 'Health + educational OUTCOMES with access gradients. Include [source-id]',
        }),
        society_wellbeing_fr: fields.text({
          label: 'Society: Wellbeing (FR)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),

        society_cohesion_en: fields.text({
          label: 'Society: Cohesion (EN)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),
        society_cohesion_fr: fields.text({
          label: 'Society: Cohesion (FR)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),

        // ── Economy Section ───────────────────────────────────────────────
        // Rework §3 — realEconomy renames macroReality (kept below as LEGACY so
        // Keystatic saves don't strip not-yet-regenerated countries); economy
        // gains publicFinances (SIZE of debt here; WHO HOLDS it stays in
        // externalVulnerability).
        // TODO(post-migration): drop the LEGACY economy_macroReality_* declarations
        // once CAN + USA are on the new field set and the volatility backfill is
        // complete — and strip the old keys from ALL country YAMLs in the SAME
        // change (undeclared keys hard-fail the Keystatic editor).
        economy_realEconomy_en: fields.text({
          label: 'Economy: Real Economy (EN)',
          multiline: true,
          description: 'Sectors, growth, what people do for a living (fiscal/monetary → Public Finances). Include [source-id]',
        }),
        economy_realEconomy_fr: fields.text({
          label: 'Economy: Real Economy (FR)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),
        economy_publicFinances_en: fields.text({
          label: 'Economy: Public Finances (EN)',
          multiline: true,
          description: 'Balance, debt share, monetary stance, inflation, rating. Include [source-id]',
        }),
        economy_publicFinances_fr: fields.text({
          label: 'Economy: Public Finances (FR)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),

        economy_externalVulnerability_en: fields.text({
          label: 'Economy: External Vulnerability (EN)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),
        economy_externalVulnerability_fr: fields.text({
          label: 'Economy: External Vulnerability (FR)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),

        economy_politicalEconomy_en: fields.text({
          label: 'Economy: Political Economy (EN)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),
        economy_politicalEconomy_fr: fields.text({
          label: 'Economy: Political Economy (FR)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),
        economy_macroReality_en: fields.text({
          label: 'Economy: Macro Reality (EN) — LEGACY (superseded by Real Economy)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),
        economy_macroReality_fr: fields.text({
          label: 'Economy: Macro Reality (FR)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),

        // ── Political Section ─────────────────────────────────────────────
        political_powerStructure_en: fields.text({
          label: 'Political: Power Structure (EN)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),
        political_powerStructure_fr: fields.text({
          label: 'Political: Power Structure (FR)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),
        // Rework §3 — Political Order gains rightsAndChecks + stateStructure.
        political_rightsAndChecks_en: fields.text({
          label: 'Political: Rights & Checks (EN)',
          multiline: true,
          description: 'Judicial + media independence; civil liberties. Include [source-id]',
        }),
        political_rightsAndChecks_fr: fields.text({
          label: 'Political: Rights & Checks (FR)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),

        political_stabilityDrivers_en: fields.text({
          label: 'Political: Stability Drivers (EN)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),
        political_stabilityDrivers_fr: fields.text({
          label: 'Political: Stability Drivers (FR)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),

        political_shockAbsorbers_en: fields.text({
          label: 'Political: Shock Absorbers (EN)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),
        political_shockAbsorbers_fr: fields.text({
          label: 'Political: Shock Absorbers (FR)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),

        // Deep-time legal bedrock (treaty lineage / title); treaty text +
        // court rulings only. Distinct substrates held separately.
        political_constitutionalSubstrate_en: fields.text({
          label: 'Political: Constitutional Substrate (EN)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),
        political_constitutionalSubstrate_fr: fields.text({
          label: 'Political: Constitutional Substrate (FR)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),
        political_stateStructure_en: fields.text({
          label: 'Political: State Structure (EN)',
          multiline: true,
          description: "Unitary/federal; divisions in the country's own term. Include [source-id]",
        }),
        political_stateStructure_fr: fields.text({
          label: 'Political: State Structure (FR)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),

        // ── Capacity Section ──────────────────────────────────────────────
        // Can the state build / permit / deliver. Top-level peer, positioned
        // after territory, before society. Declare BEFORE writing capacity_*
        // content (strip rule).
        // Rework §3 — Capacity to Deliver: inheritedTerrain + steering lead;
        // approvals renames permitting (kept below as LEGACY); publicServices new.
        // TODO(post-migration): drop the LEGACY capacity_permitting_* declarations
        // once CAN + USA are on the new field set and the volatility backfill is
        // complete — strip the old keys from ALL country YAMLs in the SAME change
        // (undeclared keys hard-fail the Keystatic editor).
        capacity_inheritedTerrain_en: fields.text({
          label: 'Capacity: Inherited Terrain (EN)',
          multiline: true,
          description: 'Anchored synthesis via [dot.path] — the structural denominator; merit-gap guard applies',
        }),
        capacity_inheritedTerrain_fr: fields.text({
          label: 'Capacity: Inherited Terrain (FR)',
          multiline: true,
          description: 'Synthèse ancrée via [dot.path]',
        }),
        capacity_steering_en: fields.text({
          label: 'Capacity: Steering (EN)',
          multiline: true,
          description: 'Governance-as-process; Interpretation anchored to the observable record',
        }),
        capacity_steering_fr: fields.text({
          label: 'Capacity: Steering (FR)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),
        capacity_approvals_en: fields.text({
          label: 'Capacity: Approvals (EN)',
          multiline: true,
          description: 'Approval/permitting timelines; proposed-vs-consented-vs-built. Include [source-id]',
        }),
        capacity_approvals_fr: fields.text({
          label: 'Capacity: Approvals (FR)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),

        capacity_delivery_en: fields.text({
          label: 'Capacity: Delivery (EN)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),
        capacity_delivery_fr: fields.text({
          label: 'Capacity: Delivery (FR)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),
        capacity_publicServices_en: fields.text({
          label: 'Capacity: Public Services (EN)',
          multiline: true,
          description: 'Realised record running continuous service systems (health, education). Include [source-id]',
        }),
        capacity_publicServices_fr: fields.text({
          label: 'Capacity: Public Services (FR)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),

        capacity_productivity_en: fields.text({
          label: 'Capacity: Productivity (EN)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),
        capacity_productivity_fr: fields.text({
          label: 'Capacity: Productivity (FR)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),
        capacity_knownAndUnbuilt_en: fields.text({
          label: 'Capacity: Known and unbuilt (EN) — gap register, composed by the derivatives pass',
          multiline: true,
          description: 'JSON object {opener, items[{gap,anchor,since,class}], denominator}. Empty until the derivatives pass runs.',
        }),
        capacity_knownAndUnbuilt_fr: fields.text({
          label: 'Capacity: Known and unbuilt (FR) — gap register, composed by the derivatives pass',
          multiline: true,
          description: 'Objet JSON {opener, items, denominator}. Vide jusqu’au passage des dérivés.',
        }),
        capacity_permitting_en: fields.text({
          label: 'Capacity: Permitting (EN) — LEGACY (superseded by Approvals)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),
        capacity_permitting_fr: fields.text({
          label: 'Capacity: Permitting (FR)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),
        // Rework §3 — Security gains posture (anchored synthesis, displays
        // first, composed last), military, transnationalExposure.
        security_posture_en: fields.text({
          label: 'Security: Posture (EN)',
          multiline: true,
          description: 'Anchored synthesis via [dot.path] to the other four security fields; no facts of its own',
        }),
        security_posture_fr: fields.text({
          label: 'Security: Posture (FR)',
          multiline: true,
          description: 'Synthèse ancrée via [dot.path]',
        }),

        // ── Security Section ──────────────────────────────────────────────
        security_internal_en: fields.text({
          label: 'Security: Internal (EN)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),
        security_internal_fr: fields.text({
          label: 'Security: Internal (FR)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),
        security_military_en: fields.text({
          label: 'Security: Military (EN)',
          multiline: true,
          description: 'Force size/structure; spending; domains; nuclear status. Include [source-id]',
        }),
        security_military_fr: fields.text({
          label: 'Security: Military (FR)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),
        security_transnationalExposure_en: fields.text({
          label: 'Security: Transnational Exposure (EN)',
          multiline: true,
          description: 'Cross-border flows and non-state entanglements. Include [source-id]',
        }),
        security_transnationalExposure_fr: fields.text({
          label: 'Security: Transnational Exposure (FR)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),

        security_diplomacy_en: fields.text({
          label: 'Security: Diplomacy (EN)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),
        security_diplomacy_fr: fields.text({
          label: 'Security: Diplomacy (FR)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),

        // ── Situation Section (event layer — what has HAPPENED, last 12 months) ──
        // Peer positioned after political, before economy. What is HAPPENING to the
        // country (war, coup, disaster, crisis, major law), distinct from what it IS.
        // Populated by the DEDICATED situation pass (template §4d), never Pass B:
        // JSON-in-text array of threads {thread, events:[{date,what,changed}], currentState?}.
        // The renderer falls back to plain prose for legacy content.
        situation_en: fields.text({
          label: 'Situation (EN)',
          multiline: true,
          description: 'JSON threads array from the situation pass (template §4d); every event cites [source-id]',
        }),
        situation_fr: fields.text({
          label: 'Situation (FR)',
          multiline: true,
          description: 'JSON threads array from the situation pass (template §4d); every event cites [source-id]',
        }),
        situation_lastUpdated: fields.text({
          label: 'Situation Last Updated (YYYY-MM-DD)',
          description: 'When the situation events were last verified — maintained manually; shown in the Situation header band',
        }),

        // ── Actors: Domestic ──────────────────────────────────────────────
        actors_domestic_en: fields.text({
          label: 'Actors: Domestic (EN)',
          multiline: true,
          description: 'JSON array. One block edit for all domestic actors.',
        }),
        actors_domestic_fr: fields.text({
          label: 'Actors: Domestic (FR)',
          multiline: true,
          description: 'Tableau JSON. Edition en un seul bloc pour tous les acteurs domestiques.',
        }),

        // ── Actors: External ──────────────────────────────────────────────
        actors_external_en: fields.text({
          label: 'Actors: External (EN)',
          multiline: true,
          description: 'JSON array. One block edit for all external actors.',
        }),
        actors_external_fr: fields.text({
          label: 'Actors: External (FR)',
          multiline: true,
          description: 'Tableau JSON. Edition en un seul bloc pour tous les acteurs externes.',
        }),

        // ── Risks ─────────────────────────────────────────────────────────
        // risks_en/fr REMOVED 2026-07-20 (workorder-gap-register.md step 4):
        // the Risk Register is replaced by the gap register
        // (capacity_knownAndUnbuilt_*). YAML keys were stripped from all 13
        // country files in the same change (Keystatic hard-fails on
        // undeclared keys).

        // ── Sources (Shared Registry) ─────────────────────────────────────
        sources: fields.text({
          label: 'Sources Registry',
          multiline: true,
          description: 'JSON array. One block edit for all sources.',
        }),
      },
    }),
  },
});
