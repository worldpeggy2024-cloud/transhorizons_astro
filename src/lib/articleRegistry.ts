/*
 * articleRegistry — ONE row per article, and the only place readiness is declared.
 *
 * WHY THIS EXISTS. Marking an article "ready" used to mean remembering three
 * separate lists in three files: FINALISED (articleStatus.ts) removed the Draft
 * badge, STATIC_PORTFOLIO_SLUGS (analyses.astro) turned its links on, and the
 * `pages` array (sitemap.xml.ts) submitted it for indexing. Nothing tied them
 * together, so an article could be finalised for readers and still missing from
 * the sitemap, or linked from a crawlable page that had no server-rendered twin.
 * Both happened.
 *
 * TO PUBLISH AN ARTICLE: flip `finalised: true` on its row below. That single
 * edit removes the Draft badge (React) AND the draft notice (SSR) AND adds the
 * page to the sitemap. Nothing else to remember.
 *
 * TO GIVE AN ARTICLE A CRAWLABLE PAGE: create src/pages/<section>/<slug>.astro,
 * then set `hasStaticPage: true`. That is what allows other pages to LINK to it.
 * The two flags are independent on purpose:
 *   - hasStaticPage governs LINKING   — never link to a page a crawler gets empty.
 *   - finalised     governs INDEXING  — and whether the draft notice shows.
 * A draft WITH a static page is linked and indexable, but carries the notice.
 *
 * `npm run build` runs scripts/check-article-registry.cjs first, which fails the
 * build if a row here disagrees with the filesystem or if any server-rendered
 * page links to a slug without a static page. Drift cannot reach production.
 */

export interface ArticleEntry {
  /** URL slug — the same key used by ReviewBadge, articleTexts.ts and narration-approved.json. */
  slug: string;
  /** Basename in content/articles/, without .yaml. */
  yamlFile: string;
  section: 'portfolio' | 'notes';
  /** A server-rendered src/pages/<section>/<slug>.astro exists. Governs linking. */
  hasStaticPage: boolean;
  /** Fully reviewed in EN and FR. Governs indexing and the draft notice. */
  finalised: boolean;
}

export const ARTICLES: ArticleEntry[] = [
  // ── Portfolio ───────────────────────────────────────────────────────────
  { slug: 'resource-civilization',  yamlFile: '2026-04_Resource-Civilization_Essay', section: 'portfolio', hasStaticPage: true,  finalised: true  },
  { slug: 'canada-multipolar',      yamlFile: '2026-03_Canada-Multipolar_Essay',     section: 'portfolio', hasStaticPage: true,  finalised: true  },
  { slug: 'critical-minerals',      yamlFile: '2026-02_Critical-Minerals_Essay',     section: 'portfolio', hasStaticPage: true,  finalised: false },
  { slug: 'ai-governance',          yamlFile: '2026-01_AI-Governance_Essay',         section: 'portfolio', hasStaticPage: true,  finalised: false },
  { slug: 'canada-forest-carbon',   yamlFile: '2026-04_Canada-Forest-Carbon_Essay',  section: 'portfolio', hasStaticPage: true,  finalised: false },
  // No .astro twin yet — React-only, so nothing server-rendered may link to these.
  { slug: 'canada-forest-system-climate-industrial-pressure', yamlFile: '2026-04_Canada-Forest-System_Essay', section: 'portfolio', hasStaticPage: false, finalised: false },
  { slug: 'canada-resources',       yamlFile: '2026-04_Canada-Resource-Wealth_Essay', section: 'portfolio', hasStaticPage: false, finalised: false },

  // ── Notes ───────────────────────────────────────────────────────────────
  { slug: 'career-evolution',   yamlFile: '2026-03_Career-Evolution_Note',   section: 'notes', hasStaticPage: true, finalised: true },
  { slug: 'travel-observation', yamlFile: '2026-04_Travel-Observation_Note', section: 'notes', hasStaticPage: true, finalised: true },
];

export const bySlug = (slug: string): ArticleEntry | undefined =>
  ARTICLES.find((a) => a.slug === slug);

/** Slugs safe to LINK to from server-rendered HTML (a crawler gets real text). */
export const LINKABLE_SLUGS = new Set(ARTICLES.filter((a) => a.hasStaticPage).map((a) => a.slug));

/** Slugs to SUBMIT for indexing: reviewed in both languages and server-rendered. */
export const INDEXABLE_ARTICLES = ARTICLES.filter((a) => a.finalised && a.hasStaticPage);

/** Slugs that have been through a full EN+FR review. */
export const FINALISED_SLUGS = new Set(ARTICLES.filter((a) => a.finalised).map((a) => a.slug));
