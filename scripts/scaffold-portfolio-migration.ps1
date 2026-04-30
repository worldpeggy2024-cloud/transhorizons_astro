param(
  [Parameter(Mandatory = $true)]
  [string]$Slug,

  [Parameter(Mandatory = $true)]
  [string]$PageName,

  [string]$Date = 'April 2026',
  [string]$ReadTime = '10 min',
  [string]$CategoryEn = 'Resources',
  [string]$CategoryFr = 'Ressources',
  [string]$TitleEn = 'TODO: English title',
  [string]$TitleFr = 'TODO: Titre francais',
  [string]$SubtitleEn = 'TODO: English subtitle',
  [string]$SubtitleFr = 'TODO: Sous-titre francais',
  [string]$HeroImage = '/images/todo-hero.webp'
)

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$yamlPath = Join-Path $repoRoot "content/articles/$Slug.yaml"
$tsxPath = Join-Path $repoRoot "src/pages-react/$PageName.tsx"

if (Test-Path $yamlPath) {
  throw "YAML already exists: $yamlPath"
}

if (Test-Path $tsxPath) {
  throw "TSX already exists: $tsxPath"
}

$yamlContent = @"
heroImage: '$HeroImage'
date: $Date
readTime: $ReadTime
articleType_en: Analytical Essay
articleType_fr: Essai analytique
category_en: $CategoryEn
category_fr: $CategoryFr
title_en: $TitleEn
title_fr: $TitleFr
subtitle_en: >-
  $SubtitleEn
subtitle_fr: >-
  $SubtitleFr
introductionTitle_en: ''
introductionTitle_fr: ''
introduction_en: >-
  TODO: introduction in English
introduction_fr: >-
  TODO: introduction en francais
sections:
  - title_en: TODO section title EN
    title_fr: TODO titre section FR
    content_en: >-
      TODO section content in English
    content_fr: >-
      TODO contenu de section en francais
    imagePosition: right
keyTakeaways:
  - title_en: TODO takeaway title EN
    title_fr: TODO message cle FR
    description_en: >-
      TODO takeaway description in English
    description_fr: >-
      TODO description message cle en francais
relatedProjects:
  - id: resources
    title_en: Critical Minerals & the Energy Transition
    title_fr: Mineraux critiques et transition energetique
    category_en: Resources
    category_fr: Ressources
"@

$tsxContent = @"
/*
 * TransHorizons - Portfolio migration scaffold
 * Content loaded from bilingual YAML - edit at /keystatic
 */

import ProjectDetailLayout from '@/components/ProjectDetailLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import data from '../../content/articles/$Slug.yaml';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const d = data as Record<string, any>;

export default function $PageName() {
  const { language } = useLanguage();
  const L = language === 'fr' ? 'fr' : 'en';

  const sections = (d.sections ?? []).map((s: Record<string, string>) => ({
    title: s[`title_` + L] ?? s.title_en ?? '',
    content: s[`content_` + L] ?? s.content_en ?? '',
    image: s.image,
    imagePosition: s.imagePosition,
  }));

  const keyTakeaways = (d.keyTakeaways ?? []).map((k: Record<string, string>) => ({
    title: k[`title_` + L] ?? k.title_en ?? '',
    description: k[`description_` + L] ?? k.description_en ?? '',
  }));

  const relatedProjects = (d.relatedProjects ?? []).map((r: Record<string, string>) => ({
    id: r.id,
    title: r[`title_` + L] ?? r.title_en ?? '',
    category: r[`category_` + L] ?? r.category_en ?? '',
  }));

  return (
    <ProjectDetailLayout
      title={d[`title_` + L] ?? ''}
      subtitle={d[`subtitle_` + L] ?? ''}
      heroImage={d.heroImage ?? ''}
      category={d[`category_` + L] ?? ''}
      date={d.date ?? ''}
      readTime={d.readTime ?? ''}
      articleType={d[`articleType_` + L]}
      introductionTitle={d[`introductionTitle_` + L]}
      introduction={d[`introduction_` + L] ?? ''}
      sections={sections}
      keyTakeaways={keyTakeaways}
      relatedProjects={relatedProjects}
    />
  );
}
"@

Set-Content -Path $yamlPath -Value $yamlContent -Encoding UTF8
Set-Content -Path $tsxPath -Value $tsxContent -Encoding UTF8

Write-Host "Created: $yamlPath"
Write-Host "Created: $tsxPath"
Write-Host ''
Write-Host 'Next steps:'
Write-Host '1) Replace TODO fields in YAML with final EN/FR content.'
Write-Host '2) If the page needs a custom block (sources/map CTA), add it in TSX below ProjectDetailLayout.'
Write-Host '3) Run pnpm dev and verify the route.'
