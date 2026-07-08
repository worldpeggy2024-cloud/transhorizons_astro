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

const ratingOptions = [
  { label: 'High', value: 'High' },
  { label: 'Med', value: 'Med' },
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

        // ── Executive Snapshot ────────────────────────────────────────────
        executiveSnapshot_en: fields.text({
          label: 'Executive Snapshot (EN)',
          multiline: true,
          description: 'One bullet per line. Include citation markers [source-id].',
        }),
        executiveSnapshot_fr: fields.text({
          label: 'Executive Snapshot (FR)',
          multiline: true,
          description: 'Un point par ligne. Inclure les marqueurs de citation [source-id].',
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

        // ── Economy Section ───────────────────────────────────────────────
        economy_macroReality_en: fields.text({
          label: 'Economy: Macro Reality (EN)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),
        economy_macroReality_fr: fields.text({
          label: 'Economy: Macro Reality (FR)',
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

        // ── Capacity Section ──────────────────────────────────────────────
        // Can the state build / permit / deliver. Top-level peer, positioned
        // after territory, before society. Declare BEFORE writing capacity_*
        // content (strip rule).
        capacity_permitting_en: fields.text({
          label: 'Capacity: Permitting (EN)',
          multiline: true,
          description: 'Include citation markers [source-id]',
        }),
        capacity_permitting_fr: fields.text({
          label: 'Capacity: Permitting (FR)',
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
        risks_en: fields.text({
          label: 'Risks (EN)',
          multiline: true,
          description: 'JSON array. One block edit for all risks.',
        }),
        risks_fr: fields.text({
          label: 'Risks (FR)',
          multiline: true,
          description: 'Tableau JSON. Edition en un seul bloc pour tous les risques.',
        }),

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
