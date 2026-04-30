# Portfolio YAML Migration Playbook (TransHorizons Astro)

This is the exact process used to migrate portfolio pages from hardcoded TSX content to bilingual YAML content editable in Keystatic.

## Goal

For each portfolio page:
1. Move all EN/FR article content from TSX into one YAML file in `content/articles/`.
2. Keep the same UI and same text ("as is" migration).
3. Update the TSX page to read YAML data using the language switch pattern.
4. Preserve any custom blocks outside `ProjectDetailLayout` (for example Sources section, Map CTA).

## Prerequisites

- Repo: `transhorizons_astro`
- Keystatic already configured with `articles` collection.
- YAML import already enabled in `astro.config.mjs`.
- `ProjectDetailLayout` supports `articleType`, `introductionTitle`, `introduction`, `sections`, `keyTakeaways`, `relatedProjects`.

## File Naming Convention

- YAML: `content/articles/<slug>.yaml`
- Page: `src/pages-react/<PageName>.tsx`

Examples:
- `content/articles/canada-forest-carbon.yaml`
- `src/pages-react/PortfolioCanadaForestCarbon.tsx`

## YAML Schema (single bilingual file)

Use this structure:

```yaml
heroImage: /images/your-image.webp
date: April 2026
readTime: 18 min
articleType_en: Analytical Essay
articleType_fr: Essai analytique
category_en: Resources
category_fr: Ressources
title_en: English title
title_fr: Titre francais
subtitle_en: English subtitle
subtitle_fr: Sous-titre francais
introductionTitle_en: ''
introductionTitle_fr: ''
introduction_en: English intro text
introduction_fr: Texte d'introduction en francais

sections:
  - title_en: Section title EN
    title_fr: Titre section FR
    content_en: Section body EN
    content_fr: Corps de section FR
    image: /images/optional.webp
    imagePosition: right

keyTakeaways:
  - title_en: Takeaway title EN
    title_fr: Titre message cle FR
    description_en: Takeaway text EN
    description_fr: Texte message cle FR

relatedProjects:
  - id: resources
    title_en: Related project EN
    title_fr: Projet relie FR
    category_en: Resources
    category_fr: Ressources

# Optional grouped sources block if page has a custom bottom block
sources:
  en:
    - Source line 1 EN
  fr:
    - Source line 1 FR
  disclaimer_en: Disclaimer EN
  disclaimer_fr: Avertissement FR
```

## TSX Migration Pattern

Replace hardcoded `content = { en: ..., fr: ... }` with YAML import.

```tsx
import ProjectDetailLayout from '@/components/ProjectDetailLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import data from '../../content/articles/<slug>.yaml';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const d = data as Record<string, any>;

export default function PageName() {
  const { language } = useLanguage();
  const L = language === 'fr' ? 'fr' : 'en';

  const sections = (d.sections ?? []).map((s: Record<string, string>) => ({
    title: s[`title_${L}`] ?? s.title_en ?? '',
    content: s[`content_${L}`] ?? s.content_en ?? '',
    image: s.image,
    imagePosition: s.imagePosition,
  }));

  const keyTakeaways = (d.keyTakeaways ?? []).map((k: Record<string, string>) => ({
    title: k[`title_${L}`] ?? k.title_en ?? '',
    description: k[`description_${L}`] ?? k.description_en ?? '',
  }));

  const relatedProjects = (d.relatedProjects ?? []).map((r: Record<string, string>) => ({
    id: r.id,
    title: r[`title_${L}`] ?? r.title_en ?? '',
    category: r[`category_${L}`] ?? r.category_en ?? '',
  }));

  return (
    <>
      <ProjectDetailLayout
        title={d[`title_${L}`] ?? ''}
        subtitle={d[`subtitle_${L}`] ?? ''}
        heroImage={d.heroImage ?? ''}
        category={d[`category_${L}`] ?? ''}
        date={d.date ?? ''}
        readTime={d.readTime ?? ''}
        articleType={d[`articleType_${L}`]}
        introductionTitle={d[`introductionTitle_${L}`]}
        introduction={d[`introduction_${L}`] ?? ''}
        sections={sections}
        keyTakeaways={keyTakeaways}
        relatedProjects={relatedProjects}
      />

      {/* Optional custom section outside layout (if needed) */}
      {/* Example:
      <div>
        {(d.sources?.[L] ?? []).map((x: string) => <p key={x}>{x}</p>)}
      </div>
      */}
    </>
  );
}
```

## "As Is" Migration Checklist

1. Keep all existing text exactly the same.
2. Keep all existing image URLs exactly the same.
3. Keep section ordering exactly the same.
4. Keep key takeaways and related projects exactly the same.
5. Keep custom bottom blocks exactly the same visually, only data source changes to YAML.
6. Remove old hardcoded content object from TSX.

## Validation Steps

From repo root:

```powershell
pnpm dev
```

Then verify pages return 200:

```powershell
Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:4321/portfolio/resources'
Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:4321/portfolio/technology'
Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:4321/portfolio/forest-carbon'
Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:4321/portfolio/geopolitics'
Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:4321/portfolio/resource-civilization'
```

Type-check specific page if needed:

```powershell
pnpm exec tsc --noEmit
```

## Recovery Plan If Chat Is Lost

If you need to continue later without chat context:
1. Open this file.
2. Pick one page TSX and one target YAML slug.
3. Follow the schema + TSX pattern above.
4. Run validation commands.
5. Commit with message: `migrate <page> to bilingual yaml`

## Optional: Scaffold Script

You can generate a starter YAML + TSX pair automatically:

```powershell
./scripts/scaffold-portfolio-migration.ps1 \
  -Slug "my-new-article" \
  -PageName "PortfolioMyNewArticle" \
  -Date "April 2026" \
  -ReadTime "12 min" \
  -CategoryEn "Resources" \
  -CategoryFr "Ressources" \
  -TitleEn "My English Title" \
  -TitleFr "Mon titre francais" \
  -SubtitleEn "My English subtitle" \
  -SubtitleFr "Mon sous-titre francais" \
  -HeroImage "/images/my-hero.webp"
```

It creates:

- `content/articles/<slug>.yaml`
- `src/pages-react/<PageName>.tsx`

Then replace all `TODO` fields with final content.

## Migrated Portfolio Pages (current state)

- `PortfolioResourceCivilization.tsx` -> `resource-civilization.yaml`
- `PortfolioGeopolitics.tsx` -> `canada-multipolar-world.yaml`
- `PortfolioResources.tsx` -> `critical-minerals-energy-transition.yaml`
- `PortfolioTechnology.tsx` -> `ai-governance-digital-sovereignty.yaml`
- `PortfolioCanadaForestCarbon.tsx` -> `canada-forest-carbon.yaml`
