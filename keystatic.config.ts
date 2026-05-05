import { config, fields, collection } from '@keystatic/core';

const sectionFields = {
  title_en: fields.text({ label: 'Section Title (EN)' }),
  title_fr: fields.text({ label: 'Section Title (FR)' }),
  content_en: fields.text({ label: 'Content (EN)', multiline: true }),
  content_fr: fields.text({ label: 'Content (FR)', multiline: true }),
  image: fields.text({ label: 'Image URL', validation: { isRequired: false } }),
  imagePosition: fields.select({
    label: 'Image Position',
    options: [{ label: 'Left', value: 'left' }, { label: 'Right', value: 'right' }],
    defaultValue: 'right',
  }),
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

const confidenceLevelOptions = [
  { label: 'High', value: 'High' },
  { label: 'Med', value: 'Med' },
  { label: 'Low', value: 'Low' },
];

const citationTypeOptions = [
  { label: 'Fact', value: 'Fact' },
  { label: 'Interpretation', value: 'Interpretation' },
];

const actorFields = {
  name: fields.text({ label: 'Actor Name' }),
  interests: fields.text({ label: 'Interests (include citation IDs like [source-id])', multiline: true }),
  resources: fields.text({ label: 'Resources (include citations)', multiline: true }),
  constraints: fields.text({ label: 'Constraints (include citations)', multiline: true }),
  likelyMoves: fields.text({ label: 'Likely Moves (include citations)', multiline: true }),
  dealability: fields.select({
    label: 'Dealability',
    options: [
      { label: 'High', value: 'High' },
      { label: 'Medium', value: 'Medium' },
      { label: 'Low', value: 'Low' },
    ],
  }),
};

const riskFields = {
  title: fields.text({ label: 'Risk Title' }),
  trigger: fields.text({ label: 'Trigger (include citations)', multiline: true }),
  probability: fields.select({
    label: 'Probability',
    options: ratingOptions,
  }),
  impact: fields.select({
    label: 'Impact',
    options: ratingOptions,
  }),
  timeHorizon: fields.text({ label: 'Time Horizon (e.g., "3–12m")' }),
  leadingIndicators: fields.text({ label: 'Leading Indicators (include citations)', multiline: true }),
  mitigants: fields.text({ label: 'Mitigants (include citations)', multiline: true }),
  lastAssessed: fields.text({ label: 'Last Assessed (YYYY-MM-DD)', validation: { isRequired: false } }),
};

const sourceFields = {
  id: fields.text({ label: 'Citation ID (e.g., "imf", "pm-ca") — lowercase alphanumeric-hyphens' }),
  name: fields.text({ label: 'Source Name' }),
  url: fields.text({ label: 'URL' }),
  desc: fields.text({ label: 'Description', multiline: true }),
  publicationDate: fields.text({ label: 'Publication Date (YYYY-MM-DD)', validation: { isRequired: false } }),
  accessDate: fields.text({ label: 'Access Date (YYYY-MM-DD)', validation: { isRequired: false } }),
  confidence: fields.select({
    label: 'Confidence Level',
    options: confidenceLevelOptions,
    validation: { isRequired: false },
  }),
  citationType: fields.select({
    label: 'Citation Type',
    options: citationTypeOptions,
    validation: { isRequired: false },
  }),
  archiveUrl: fields.text({ label: 'Archive URL (Wayback Machine)', validation: { isRequired: false } }),
  lastVerified: fields.text({ label: 'Last Verified (YYYY-MM-DD)', validation: { isRequired: false } }),
};

export default config({
  storage: { kind: 'local' },

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
          validation: { isRequired: false },
        }),
        scorecard_securityLoyalty: fields.select({
          label: 'Scorecard: Security Loyalty',
          options: ratingOptions,
          validation: { isRequired: false },
        }),
        scorecard_economicPressure: fields.select({
          label: 'Scorecard: Economic Pressure',
          options: ratingOptions,
          validation: { isRequired: false },
        }),
        scorecard_protestCapacity: fields.select({
          label: 'Scorecard: Protest Capacity',
          options: ratingOptions,
          validation: { isRequired: false },
        }),
        scorecard_institutionalResilience: fields.select({
          label: 'Scorecard: Institutional Resilience',
          options: ratingOptions,
          validation: { isRequired: false },
        }),

        // ── Executive Snapshot ────────────────────────────────────────────
        executiveSnapshot_en: fields.array(
          fields.text({ label: 'Bullet (EN)', multiline: true }),
          {
            label: 'Executive Snapshot (EN)',
            itemLabel: (props) => props.value?.substring(0, 50) + '...' || 'Bullet',
          }
        ),
        executiveSnapshot_fr: fields.array(
          fields.text({ label: 'Bullet (FR)', multiline: true }),
          {
            label: 'Executive Snapshot (FR)',
            itemLabel: (props) => props.value?.substring(0, 50) + '...' || 'Point',
          }
        ),

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
        actors_domestic_en: fields.array(
          fields.object(actorFields),
          {
            label: 'Actors: Domestic (EN)',
            itemLabel: (props) => props.fields.name.value || 'Actor',
          }
        ),
        actors_domestic_fr: fields.array(
          fields.object(actorFields),
          {
            label: 'Actors: Domestic (FR)',
            itemLabel: (props) => props.fields.name.value || 'Acteur',
          }
        ),

        // ── Actors: External ──────────────────────────────────────────────
        actors_external_en: fields.array(
          fields.object(actorFields),
          {
            label: 'Actors: External (EN)',
            itemLabel: (props) => props.fields.name.value || 'Actor',
          }
        ),
        actors_external_fr: fields.array(
          fields.object(actorFields),
          {
            label: 'Actors: External (FR)',
            itemLabel: (props) => props.fields.name.value || 'Acteur',
          }
        ),

        // ── Risks ─────────────────────────────────────────────────────────
        risks_en: fields.array(
          fields.object(riskFields),
          {
            label: 'Risks (EN)',
            itemLabel: (props) => props.fields.title.value || 'Risk',
          }
        ),
        risks_fr: fields.array(
          fields.object(riskFields),
          {
            label: 'Risks (FR)',
            itemLabel: (props) => props.fields.title.value || 'Risque',
          }
        ),

        // ── Sources (Shared Registry) ─────────────────────────────────────
        sources: fields.array(
          fields.object(sourceFields),
          {
            label: 'Sources Registry',
            itemLabel: (props) => props.fields.id.value || props.fields.name.value || 'Source',
          }
        ),
      },
    }),
  },
});
