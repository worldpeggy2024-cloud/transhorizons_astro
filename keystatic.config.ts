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
      },
    }),
  },
});
