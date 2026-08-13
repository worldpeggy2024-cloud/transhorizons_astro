/**
 * TransHorizons — Actor group labels (render-level grouping, decided 2026-08-13).
 *
 * Grouping is a READING aid only: actors stay individual entries in the
 * country YAML (full per-actor granularity, fieldsCitedIn intact — the
 * candidate substrate for re-deriving the risk-correlations module).
 * Each actor carries a language-neutral `group` slug inside its JSON block;
 * the display labels live HERE so no new French ever enters the YAML.
 * A country whose actors carry no `group` slugs renders the flat lists
 * unchanged (CAN, DEU, BRA — do not tag CAN without an explicit decision;
 * Peggy does not want to re-review its French).
 */

// FR REVIEWED by Peggy 2026-08-13 — do not redraft these labels. Any NEW slug added
// later starts as an AI draft and must be marked FR-PLACEHOLDER until she reviews it.
export const ACTOR_GROUPS: Record<string, { en: string; fr: string }> = {
  // USA — domestic
  'presidency-executive': { en: 'Presidency & executive departments', fr: 'Présidence et départements exécutifs' },
  'security-intel': { en: 'Security, intelligence & border enforcement', fr: 'Sécurité, renseignement et contrôle frontalier' },
  'military': { en: 'Military', fr: 'Forces armées' },
  'regulators': { en: 'Regulators & permitting', fr: 'Organismes de réglementation et autorisation' },
  'fiscal-monetary': { en: 'Independent fiscal & monetary institutions', fr: 'Institutions budgétaires et monétaires indépendantes' },
  'judiciary': { en: 'Judiciary', fr: 'Pouvoir judiciaire' },
  'congress-parties': { en: 'Congress & parties', fr: 'Congrès et partis' },
  'states-territories': { en: 'States, cities & territories', fr: 'États, villes et territoires' },
  'tribal-nations': { en: 'Tribal nations', fr: 'Nations tribales' },
  'corporate-labour-civil': { en: 'Corporate, labour & civil society', fr: 'Entreprises, syndicats et société civile' },
  // USA — external
  'rivals': { en: 'Strategic rivals & adversaries', fr: 'Rivaux stratégiques et adversaires' },
  'north-america': { en: 'North American neighbours', fr: 'Voisins nord-américains' },
  'europe-nato': { en: 'Europe & NATO', fr: 'Europe et OTAN' },
  'indo-pacific': { en: 'Indo-Pacific allies & partners', fr: 'Alliés et partenaires indo-pacifiques' },
  'mena-southasia-africa': { en: 'Middle East, South Asia & Africa', fr: 'Moyen-Orient, Asie du Sud et Afrique' },
  'intl-orgs': { en: 'International organisations & regimes', fr: 'Organisations et régimes internationaux' },
  'transnational-crime': { en: 'Transnational criminal organisations', fr: 'Organisations criminelles transnationales' },
  // CAN — domestic (reuses judiciary / regulators / security-intel / military /
  // corporate-labour-civil above; Canada-specific institutions below)
  'pm-executive': { en: 'Prime Minister, Cabinet & the Crown', fr: 'Premier ministre, Cabinet et la Couronne' },
  'parliament-parties': { en: 'Parliament & parties', fr: 'Parlement et partis' },
  'independent-institutions': { en: 'Independent institutions & watchdogs', fr: 'Institutions indépendantes et organismes de surveillance' },
  'provinces-territories': { en: 'Provinces, territories & intergovernmental', fr: 'Provinces, territoires et relations intergouvernementales' },
  'indigenous-rightsholders': { en: 'Indigenous rights-holders', fr: 'Titulaires de droits autochtones' },
  'crown-corporations': { en: 'Crown corporations & public finance vehicles', fr: "Sociétés d'État et instruments de financement public" },
  // CAN — external (reuses intl-orgs above). Grouped by TYPE, not alignment:
  // sorting Canada's bilateral relationships into ally/rival blocs would assert
  // editorial judgments the report itself does not make.
  'bilateral-states': { en: 'Bilateral state relationships', fr: 'Relations bilatérales entre États' },
  'defence-alliances': { en: 'Defence alliances', fr: 'Alliances de défense' },
};

/** Display label for a group slug; falls back to the slug itself so an
 *  untabled slug is visible (and greppable) rather than silently blank. */
export function actorGroupLabel(slug: string, lang: string): string {
  const g = ACTOR_GROUPS[slug];
  return g ? (lang === 'fr' ? g.fr : g.en) : slug;
}
