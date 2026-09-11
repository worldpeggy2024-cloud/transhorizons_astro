/*
 * TransHorizons site film — THE configuration.
 *
 * Everything tunable lives here: base address, frame rate, per-shot duration,
 * navigation action + its parameters, narration/caption text in both languages,
 * the shot-21 entry point, the 90-second cut. The pipeline code (src/) reads
 * this file; nobody edits the pipeline to change a duration.
 *
 * Shot ids match the production document. `action` names a routine in
 * src/actions.mjs; `params` are that routine's knobs. `seconds` is the scripted
 * duration: the shot holds its last state until that many seconds have elapsed
 * since the shot began (an action that takes longer simply runs long, and the
 * manifest records the real duration). A shot whose narration file is longer
 * than its scripted duration is held at least narration + 0.4 s at capture
 * time when the file already exists, and freeze-extended at assembly otherwise.
 *
 * Narration text doubles as caption text unless `caption` is given. Shots with
 * `narration: null` are deliberate silence (no file expected, no caption).
 */

export const config = {
  // Run against production by default; override with --base http://localhost:4321
  baseUrl: process.env.FILM_BASE_URL || 'https://transhorizons.net',

  fps: 30,
  viewport: { width: 1920, height: 1080, deviceScaleFactor: 1 },
  // 'png' (lossless, ~2-3 GB per full capture) or 'jpeg' (q92, ~5x smaller).
  frameFormat: 'png',
  jpegQuality: 92,

  // Injected requestAnimationFrame scroll: pixels per animation frame.
  scroll: { pxPerFrame: 9 },
  // Character-by-character typing delay for the country filter (shot 18).
  typing: { delayMs: 150 },

  // Burned-in captions (ASS, rendered by libass). Fonts are system fonts.
  captions: {
    font: 'Segoe UI',
    size: 46,          // in a 1920x1080 play-res
    marginV: 100,      // px from the bottom edge — clears the site's floating audio pill
    boxAlpha: 0x70,    // 00 = opaque box, FF = invisible
  },

  // Encoding.
  // crf 30 puts the 2:22 full film under the 20 MB target (27 → 26 MB, 22 → 39 MB);
  // text detail is unchanged on static frames. --crf overrides per build.
  video: { crf: 30, preset: 'slow', targetMaxMB: 20 },
  audio: { bitrate: '160k', narrationGain: 1.0, reportGain: 1.0 },

  /*
   * Shot 21 — the report reading itself aloud.
   *
   * mode 'section' — press the section header's own speaker button, which is
   *                  what the production document asks for ("section-header
   *                  playback"). On the site as deployed this needs TWO
   *                  presses with the studio recording chosen (the first only
   *                  switches which section the player holds; see the comment
   *                  in src/actions.mjs). The action presses, checks whether
   *                  sound is actually coming out, and presses again only if
   *                  it is not — so it keeps working unchanged once the
   *                  two-click behaviour is fixed.
   * mode 'bar'     — fallback: the Baseline "Listen to the report" bar, which
   *                  always starts on one press. Same seek, same frame lock.
   *
   * ENTRY POINT. The Canada duet alternates per UNIT: per paragraph in the
   * Baseline and Situation, per subsection heading in the six peers (measure
   * with `npm run audio:units`). Situation, whose blocks are the event threads,
   * runs: 0.0 s Adam Stone "Situation." · 1.5 s Adam Stone "Trade rupture with
   * the United States, ongoing" · 5.75 s OGECHI takes the first event.
   * Entering at 1.45 s opens the shot on the thread name and puts the voice
   * change 4.3 s in — inside the shot, with both voices given room. Entry 0
   * also works (the change lands at 5.75 s) and keeps the spoken section title.
   */
  reportAudio: {
    mode: 'section',
    section: 'situation',
    entrySeconds: 1.45,
    // The recording keeps sounding until the end of shot 21, then fades out
    // over this many seconds (the page player is paused at the same moment so
    // picture and sound agree).
    fadeOutSeconds: 0.6,
    // The French film: 'captured' mixes the English duet the page actually
    // played (exact frame lock); 'french' substitutes the CAN French duet at
    // the same section/offset (voices in the viewer's language; the page on
    // screen stays English). Decision pending — see README.
    frenchFilm: 'captured',
    // Where the site's report recordings live on disk (public/audio ships).
    localAudioRoot: '../public/audio',
    frenchVoiceFolder: 'countries/CAN/fr/reflechie-flork',
  },

  // Closing card (2 s, text only, rendered by Chromium from src/closing-card.html).
  closing: {
    seconds: 2,
    text: {
      en: 'Narration generated from a recording of my own voice.',
      fr: 'Narration générée à partir d’un enregistrement de ma propre voix.',
    },
  },

  // The 90-second cut: same captured frames, this subset of shots, in order.
  shortCut: ['1', '2', '3', '11', '12', '13', '19', '20', '21', '22', '23', '25a', '29', '30', 'closing'],

  shots: [
    // ── Movement 1 — Identity and credential ──────────────────────────────
    { id: '1', seconds: 3, action: 'homeHero',
      narration: { en: 'TransHorizons. Independent research on Canada’s position in global systems.',
                   fr: 'TransHorizons. Recherche indépendante sur la position du Canada dans les systèmes mondiaux.' } },
    { id: '2', seconds: 3, action: 'switchLanguage', params: { to: 'FR', expectHeadline: 'Recherche et cartes' },
      narration: { en: 'Everything here is published in full, in both official languages.',
                   fr: 'Tout y est publié intégralement, dans les deux langues officielles.' } },
    { id: '3', seconds: 1, action: 'switchLanguage', params: { to: 'EN', expectHeadline: 'Research & Maps' },
      narration: null },
    { id: '4', seconds: 4, action: 'navScrollTo', params: { nav: 'About', sectionId: 'story' },
      narration: null },
    { id: '5', seconds: 3, action: 'scrollToLink', params: { text: 'Writing & Translation Archive', block: 'center' },
      narration: { en: 'First, twenty years of institutional translation.',
                   fr: 'D’abord, vingt ans de traduction institutionnelle.' } },
    { id: '6', seconds: 4, action: 'openPublications', params: { holdPrizeMs: 2200 },
      narration: { en: 'A ministerial prize. Textbooks listed in provincial curricula.',
                   fr: 'Un prix ministériel. Des manuels inscrits aux programmes provinciaux.' } },
    { id: '7', seconds: 1, action: 'browserBackToHomeTop',
      narration: null },

    // ── Movement 2 — The analytical work ──────────────────────────────────
    { id: '8', seconds: 4, action: 'navScrollTo', params: { nav: 'Research Approach', sectionId: 'research-approach', expectVisible: 'View Methodology' },
      narration: { en: 'The method is stated openly: institutional sources, structural analysis, traceable claims.',
                   fr: 'La méthode est énoncée ouvertement : sources institutionnelles, analyse structurelle, données traçables.' } },
    { id: '9', seconds: 3, action: 'navScrollTo', params: { nav: 'Analyses', sectionId: 'portfolio' },
      narration: { en: 'The analyses are the core of the work.',
                   fr: 'Les analyses sont le cœur du travail.' } },
    { id: '10', seconds: 1, action: 'hoverButton', params: { name: 'View all analyses' },
      narration: null },
    { id: '11', seconds: 3, action: 'openArticleCard', params: { heading: 'Canada as a Resource Civilization', url: '/portfolio/resource-civilization' },
      narration: null },
    { id: '12', seconds: 6, action: 'articleAudio', params: { holdPickerMs: 1800, voiceLabel: 'British narrator' },
      narration: { en: 'Every article can be read aloud.',
                   fr: 'Chaque article peut être lu à voix haute.' } },
    { id: '13', seconds: 8, action: 'scrollThroughMaps', params: { endAlt: 'Canada in global systems', pxPerFrame: 14 },
      narration: { en: 'Each one carries its own maps, built from public data.',
                   fr: 'Chacun porte ses propres cartes, construites à partir de données publiques.' } },
    { id: '14', seconds: 2, action: 'backAndOpenArticle', params: { heading: 'Canada in the Multipolar World', url: '/portfolio/canada-multipolar' },
      narration: null },
    { id: '15', seconds: 8, action: 'sphereAndChokepoints',
      params: { sphereHeading: 'Canada as a Structurally Embedded Actor', holdSphereMs: 2400,
                toggleHeading: 'System-Level Implications', toggleLabels: ['Chokepoint Dependencies', 'Geopolitical Vulnerabilities'], toggleHoldMs: 1300 },
      narration: { en: 'Some are interactive: chokepoints, spheres of influence, Arctic routing.',
                   fr: 'Certaines sont interactives : points d’étranglement, sphères d’influence, routes arctiques.' } },

    // ── Movement 3 — Global situation ─────────────────────────────────────
    { id: '16', seconds: 4, action: 'homeGlobeBanner',
      narration: null },
    { id: '17', seconds: 5, action: 'openWorldViews',
      narration: { en: 'World Views: every country, one framework.',
                   fr: 'Vues du monde : chaque pays, un même cadre.' } },
    // 'tariff' matches the CAN and USA report CONTENT and no country name ('Arctic'
    // also surfaced Antarctica by name, which muddied the point).
    { id: '18', seconds: 6, action: 'typeKeyword', params: { keyword: 'tariff', expectCountries: ['Canada', 'United States'], expectCount: 2 },
      narration: { en: 'The filter searches content, not only names.',
                   fr: 'Le filtre cherche dans le contenu, pas seulement dans les noms.' } },

    // ── Movement 4 — The country report ───────────────────────────────────
    { id: '19', seconds: 3, action: 'openCountryFromList', params: { name: 'Canada', cca3: 'can' },
      narration: { en: 'Country reports run six structural dimensions.',
                   fr: 'Les rapports-pays suivent six dimensions structurelles.' } },
    { id: '20', seconds: 5, action: 'reportVoicePicker', params: { holdPickerMs: 2000 },
      narration: { en: 'Reports are read aloud, in voices chosen for the material.',
                   fr: 'Les rapports sont lus à voix haute, dans des voix choisies pour le contenu.' } },
    // 11 s, not the document's 6: the shot has to scroll to the section, open
    // it and start the recording before the two voices can trade, and the change
    // then needs room to register. Everything before the audio starts is the
    // scroll the document asks for.
    { id: '21', seconds: 11, action: 'reportReadsAloud', params: { pxPerFrame: 3, scrollPx: 900, pauseAfter: true },
      narration: null,
      // Site audio only — narrator silent. The recording is mixed from the
      // manifest's frame-locked playback timestamp.
      reportAudio: true },
    { id: '22', seconds: 4, action: 'collapseSection', params: { sectionId: 'territory', holdOpenMs: 1500 },
      narration: { en: 'Sections collapse. You move through it your way.',
                   fr: 'Les sections se replient. À vous de choisir votre parcours.' } },
    { id: '23', seconds: 4, action: 'toggleTheme', params: { holdDarkMs: 2200, returnToLight: true },
      narration: { en: 'Built for long reading.',
                   fr: 'Conçu pour la lecture longue.' } },
    { id: '24', seconds: 3, action: 'crossReference', params: { section: 'Capacity to Deliver', sectionId: 'capacity' },
      narration: { en: 'Sections cross-reference each other.',
                   fr: 'Les sections se renvoient les unes aux autres.' } },
    { id: '25a', seconds: 5, action: 'rotateGlobeClickCountry', params: { dragDx: 0, dragDy: -44, dragMs: 1600, target: 'United States of America', cca3: 'usa' },
      narration: { en: 'Reports connect to each other.',
                   fr: 'Les rapports se rattachent les uns aux autres.' } },
    { id: '25b', seconds: 4, action: 'scrollToSectionHeaders', params: { expectH1: 'United States', pxPerFrame: 12 },
      narration: { en: 'The same framework, applied comparably.',
                   fr: 'Le même cadre, appliqué de façon comparable.' } },
    { id: '26', seconds: 5, action: 'citationAndBack', params: { section: 'Economy', sectionId: 'economy', holdSourceMs: 1600 },
      narration: { en: 'You leave, and come back exactly where you were.',
                   fr: 'On sort, et on revient exactement où on était.' } },
    { id: '27', seconds: 4, action: 'openSourceLink',
      // Sources are tried in preferHosts order, then any host matching hostPattern.
      // PDFs, bot-check interstitials (congress.gov) and pages that open with a
      // modal (bls.gov survey, state.gov cookie banner) are skipped automatically;
      // the probe of 2026-09-09 found census/federalreserve/bea/gao/eia/cbo clean.
      params: { hostPattern: '\\.gov(\\.|/|$)', preferHosts: ['census.gov', 'federalreserve.gov', 'bea.gov', 'gao.gov', 'eia.gov', 'cbo.gov'], externalHoldMs: 1800 },
      narration: { en: 'Every claim traces back to its source.',
                   fr: 'Chaque affirmation remonte à sa source.' } },

    // ── Movement 5 — Close ────────────────────────────────────────────────
    { id: '28', seconds: 4, action: 'thematicMapsCard',
      params: { cardTitle: 'Critical Minerals World Map', viewport: { width: 960, height: 540, deviceScaleFactor: 2 }, background: '#080810', hoverAtEnd: true },
      narration: null },
    { id: '29', seconds: 5, action: 'mineralsMap', params: { url: '/tools/critical-minerals-map', viewMode: 'Known Reserves', mineral: 'Potash', holdBetweenMs: 1300 },
      narration: { en: 'Thirty-four minerals. Production, reserves, producers.',
                   fr: 'Trente-quatre minéraux. Production, réserves, producteurs.' } },
    { id: '30', seconds: 3, action: 'homeFooter',
      narration: { en: 'TransHorizons. Peggy Brenier, Montreal.',
                   fr: 'TransHorizons. Peggy Brenier, Montréal.' } },
  ],
};

export default config;
