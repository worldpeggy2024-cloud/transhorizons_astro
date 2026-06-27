import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.analysis': 'Analyses',
    'nav.maps': 'Maps',
    'nav.researchApproach': 'Research Approach',
    'nav.notesReflections': 'Notes & Reflections',
    'nav.about': 'About',
    'nav.publications': 'Writing & Translation Archive',
    'nav.home': 'Home',
    'nav.portfolio': 'Portfolio',
    'nav.blog': 'Blog',
    'nav.theStory': 'The Story',
    'nav.worldsObserved': 'Worlds Observed',
    'nav.contact': 'Contact',
    'nav.lifeInMotion': 'Life in Motion',
    'nav.worldAnalysis': 'World Analysis',

    // Hero Section
    'hero.title': 'Research & Maps',
    'hero.subtitle': 'Structured analysis of geopolitical, resource, and technological systems, particularly those shaping Canada\'s position in the World.',
    'hero.byline': 'An independent research initiative by Peggy Brenier',
    'hero.location': 'Montreal · Canada · Global',
    'hero.button1': 'View Analyses',
    'hero.button2': 'About',
    'hero.scroll': 'Scroll',

    // Portfolio Section
    'portfolio.title': 'Analyses: Geopolitics. Resources. Technology.',
    'portfolio.intro': 'Analyses and visual essays exploring the forces that shape our world — from resource geopolitics to digital governance and the strategic place of Canada within a shifting global order.',
    'portfolio.viewAll': 'View all analyses',
    'analyses.pageTitle': 'All Analyses',
    'analyses.pageSubtitle': 'The full collection of analytical essays, briefs, and visual essays — from resource geopolitics to digital governance and environmental change.',
    'portfolio.geopolitics.title': 'Canada in the Multipolar World',
    'portfolio.geopolitics.desc': 'Analyzes how shifting power structures redefine Canada’s position within a fragmented global order.',
    'portfolio.resources.title': 'Critical Minerals & the Energy Transition',
    'portfolio.resources.desc': 'Examines how material supply chains are reshaping industrial systems and geopolitical positioning.',
    'portfolio.technology.title': 'AI Governance & Digital Sovereignty',
    'portfolio.technology.desc': 'Explores how digital systems and governance models are restructuring technological and geopolitical power.',
    'portfolio.readBrief': 'Read Analysis',
    'portfolio.geopolitics.category': 'Geopolitics',
    'portfolio.geopolitics.tags': 'Strategic analysis|Canada|Multilateralism',
    'portfolio.resources.category': 'Resources',
    'portfolio.resources.tags': 'Energy|Supply chains|Policy',
    'portfolio.technology.category': 'Technology',
    'portfolio.technology.tags': 'AI Policy|Digital governance|Innovation',
    'portfolio.canadaResources.title': "Canada's Resource Wealth in a Fractured World",
    'portfolio.canadaResources.desc': "Canada's vast mineral endowment — lithium, cobalt, nickel, uranium, rare earths — has moved from a background economic asset to a front-line geopolitical variable in an era of supply chain nationalism.",
    'portfolio.canadaResources.category': 'Resources',
    'portfolio.canadaResources.tags': 'Canada|Critical minerals|Geopolitics',
    'portfolio.resourceCivilization.title': 'Canada as a Resource Civilization',
    'portfolio.resourceCivilization.desc': 'Examines how resource structures shape Canada\'s development and position within evolving global systems.',
    'portfolio.resourceCivilization.category': 'Systems',
    'portfolio.resourceCivilization.tags': 'Canada|Resource systems|Political economy',
    'portfolio.forestCarbon.title': 'Net Carbon Effect of Canadian Forest Ecosystems',
    'portfolio.forestCarbon.desc': 'How unprecedented wildfires have reversed the role of Canada\'s boreal forests in the global carbon cycle — from net sink to 1,138 Mt CO₂e net source in 2023.',
    'portfolio.forestCarbon.category': 'Resources',
    'portfolio.forestCarbon.tags': 'Canada|Forests|Carbon cycle|Wildfires',
    'featuredAnalysis.title': 'Selected Analysis',
    'featuredAnalysis.subtitle': 'Selected analyses from an ongoing independent research program examining geopolitical, resource, and technological systems.',
    'featuredAnalysis.read': 'read',
    'featuredAnalysis.readEssay': 'Read essay',
    'featuredAnalysis.readMore': 'Read essay',

    // Story Section
    // NOTE: story.intro / story.strengths.* / story.research.* are no longer rendered
    // (the About body is now prose in AboutSection.tsx). Retained for reference / French source.
    'story.intro': 'Independent research on Canadian resource geopolitics, trade, and strategic systems. Senior translator with over two decades of experience supporting Canadian federal institutions, including Statistics Canada and Natural Resources Canada. Professional experience has focused on institutional publications, research-based reporting, and complex technical documentation within data-driven and policy-oriented environments.\n\nCurrent practice increasingly extends toward independent research and analytical reporting on geopolitics, resource systems, and technological transformation, with particular attention to Canada\'s position within evolving global structures.',
    'story.strengths.title': 'Core Strengths',
    'story.strengths.item1': 'Institutional research and documentation developed through long-term federal collaboration',
    'story.strengths.item2': 'Interpretation of complex statistical, technical, and policy material',
    'story.strengths.item3': 'Translation of institutional knowledge into structured written analysis',
    'story.strengths.item4': 'Interdisciplinary perspective informed by extensive international exposure and comparative observation',
    'story.strengths.item5': 'Commitment to clear, evidence-based communication for public understanding',
    'story.research.title': 'Research Focus',
    'story.research.text': 'Current work examines geopolitical dynamics, resource systems, and technological change through a structural, systems-oriented approach, aiming to clarify long-term global transformations relevant to Canadian and international contexts.',
    'story.title': 'About TransHorizons',
    'story.years': 'Years of expertise overall',
    'story.government': 'Years of translations for the Canadian government',
    'story.domains': 'Domains of analysis',
    'story.quote': '',
    'story.positioning': 'Independent research on Canadian resource geopolitics, trade, and strategic systems.',
    'story.journeysFieldNotes': 'Journeys & Field Notes (in progress) →',
    'story.cvOnRequest': 'Full CV available on request — please email',

    // Gallery Section
    'gallery.title': 'Worlds Observed',
    'gallery.subtitle': 'A curated visual chronicle of travels, architecture, and landscapes — the world seen through the lens of a career in transition.',
    'gallery.sydney': 'Sydney',
    'gallery.andes': 'Andean Dawn',
    'gallery.archive': 'The Archives',
    'gallery.fluid': 'Fluid Horizons',
    'gallery.bancarbre': 'BancArbre',
    'gallery.montreal': 'Montreal',
    'gallery.footer': 'Photography as a practice of observation — each image a field note from a world in motion.',

    // Blog Section
    'blog.title': 'Notes & Reflections',
    'blog.subtitle': 'Analytical reflections and research observations — exploring emerging patterns and evolving perspectives on geopolitical and technological systems',
    'blog.allArticles': 'All Articles',
    'blog.careerChange.category': 'Notes',
    'blog.careerChange.date': 'March 2026',
    'blog.careerChange.readTime': '8 min read',
    'blog.careerChange.title': 'From Translation Toward Research and Analysis',
    'blog.careerChange.desc': 'A reflection on how institutional translation became long-term training in research, curiosity, and analytical writing.',
    'blog.travelStories.category': 'Observations',
    'blog.travelStories.date': 'February 2026',
    'blog.travelStories.readTime': '10 min read',
    'blog.travelStories.title': 'Travel, Observation, and the Formation of an Analytical Perspective',
    'blog.travelStories.desc': 'How sustained travel across continents became a method of inquiry and shaped an analytical perspective grounded in direct observation.',
    'blog.orbitalDataCenters.category': 'Systems & Signals',
    'blog.orbitalDataCenters.date': 'Coming Soon',
    'blog.orbitalDataCenters.readTime': '',
    'blog.orbitalDataCenters.title': 'Servers in Orbit: The Rise of Space-Based Data Centers',
    'blog.orbitalDataCenters.desc': 'As terrestrial limits on power and cooling tighten, proposals to place data centers in orbit are moving from speculation toward engineering. An early look at the energy logic, economics, and geopolitics of compute beyond Earth.',
    'blog.readArticle': 'Read Article',
    'blog.readMore': 'Read Article',

    // Contact Section
    'contact.title': 'Contact / Collaboration',
    'contact.intro': 'Interested in geopolitical, resource, or technology analysis?\n\nIf something on this site sparked a question, a disagreement, or an idea, do not hesitate, a message is welcome.',
    'contact.location': 'Location',
    'contact.montreal': 'Montreal, Quebec, Canada',
    'contact.follow': 'Follow',
    'contact.name': 'Your full name',
    'contact.email': 'your@email.com',
    'contact.subject': 'Geopolitical analysis, collaboration, etc.',
    'contact.message': 'Tell me about your project or inquiry...',
    'contact.send': 'Send Message',
    'contact.emailClientHint': 'Clicking "Send Message" will open your email app with this message pre-filled.',
    'contact.emailClientOpened': 'Your email client should have opened.',
    'contact.emailClientOpenedDesc': 'Your message has been pre-filled and is ready to send from your email app.',

    // Footer
    'footer.copyright': '© 2026 TransHorizons. All rights reserved.',
    'footer.instagram': 'Instagram',
    'footer.blog': 'Blog',
    'footer.brand': 'Research & Maps.\nAn independent exploration of geopolitics, global systems, resources, and technological transformation.',
    'footer.navigate': 'Navigate',
    'footer.connect': 'Connect',
    'footer.instagramDesc': ' ',
    'footer.blogDesc': 'Articles & analysis',
    'footer.journeysDesc': 'Photographic world exploration (in progress)',
    'footer.marquee1': 'Research · Analysis',
    'footer.marquee2': 'Canada & the world',
    'footer.marquee3': 'Geopolitics · Resources · Technology',
    'footer.marquee4': 'Systems & Global Change',


    // Research Approach Section
    'researchApproach.title': 'Research Approach',
    'researchApproach.subtitle': 'A structured analytical practice grounded in institutional sources, cross-domain research, and long-term monitoring of geopolitical and technological systems.',
    'researchApproach.description': 'Research is based on publicly available institutional and primary sources, combined with cross-domain synthesis and monitoring of global developments.',
    'researchApproach.description2': 'The approach focuses on structural dynamics and system-level interactions, translating complex information into clear, traceable analysis.',
    'researchApproach.button': 'View Methodology',

    // Detail Pages
    'detail.backToPortfolio': 'Back to Portfolio',
    'detail.backToStories': 'Back to Stories',
    'detail.backToHome': 'Back to Home',
    'detail.getInTouch': 'Get in Touch',
    'detail.interestedInAnalysis': 'Interested in this analysis?',
    'detail.interestedInPerspectives': 'Interested in these perspectives?',
    'detail.letDiscuss': 'Let\'s discuss how these insights apply to your strategic questions or projects.',
  },
  fr: {
    // Navigation
    'nav.analysis': 'Analyses',
    'nav.maps': 'Cartes',
    'nav.researchApproach': 'Approche de recherche',
    'nav.notesReflections': 'Notes et réflexions',
    'nav.about': 'À propos',
    'nav.publications': 'Archive de publications et de traductions',
    'nav.home': 'Accueil',
    'nav.portfolio': 'Portfolio',
    'nav.blog': 'Blog',
    'nav.theStory': 'L\'histoire',
    'nav.worldsObserved': 'Mondes observés',
    'nav.contact': 'Contact',
    'nav.lifeInMotion': 'Une vie en mouvement',
    'nav.worldAnalysis': 'Analyse mondiale',

    // Hero Section
    'hero.title': 'Recherche et cartes',
    'hero.subtitle': 'Analyse structurée des systèmes liés à la géopolitique, aux ressources et aux technologies, en particulier ceux qui définissent la position du Canada dans le monde.',
    'hero.byline': 'Initiative de recherche indépendante de Peggy Brenier',
    'hero.location': 'Montréal · Canada · Monde',
    'hero.button1': 'Voir les analyses',
    'hero.button2': 'À propos',
    'hero.scroll': 'Faire défiler',

    // Portfolio Section
    'portfolio.title': 'Analyses : Géopolitique. Ressources. Technologie',
    'portfolio.intro': 'Analyses et explorations cartographiques des forces qui façonnent notre monde : géopolitique des ressources, gouvernance numérique et place stratégique du Canada dans un ordre mondial en mutation.',
    'portfolio.viewAll': 'Voir toutes les analyses',
    'analyses.pageTitle': 'Toutes les analyses',
    'analyses.pageSubtitle': 'L\'ensemble des essais analytiques, notes stratégiques et essais visuels — de la géopolitique des ressources à la gouvernance numérique et aux changements environnementaux.',
    'portfolio.geopolitics.title': 'Le Canada dans un monde multipolaire',
    'portfolio.geopolitics.desc': 'Analyse la manière dont l’évolution des structures de pouvoir redéfinit la position du Canada dans un ordre mondial fragmenté.',
    'portfolio.resources.title': 'Minéraux critiques et transition énergétique',
    'portfolio.resources.desc': 'Examine la manière dont les chaînes d’approvisionnement en matières premières reconfigurent les systèmes industriels et les positionnements géopolitiques.',
    'portfolio.technology.title': 'Gouvernance de l\'IA et souveraineté numérique',
    'portfolio.technology.desc': 'Explore la manière dont les systèmes numériques et les modèles de gouvernance restructurent le pouvoir technologique et géopolitique.',
    'portfolio.readBrief': 'Lire l\'analyse',
    'portfolio.geopolitics.category': 'Géopolitique',
    'portfolio.geopolitics.tags': 'Analyse stratégique|Canada|Multilatéralisme',
    'portfolio.resources.category': 'Ressources',
    'portfolio.resources.tags': 'Énergie|Chaînes d\'approvisionnement|Politique',
    'portfolio.technology.category': 'Technologie',
    'portfolio.technology.tags': 'Politique IA|Gouvernance numérique|Innovation',
    'portfolio.canadaResources.title': 'La richesse en ressources du Canada dans un monde fracturé',
    'portfolio.canadaResources.desc': "L'immense dotation minérale du Canada — lithium, cobalt, nickel, uranium, terres rares — est passée d'un atout économique de fond à une variable géopolitique de première ligne à l'ère du nationalisme des chaînes d'approvisionnement.",
    'portfolio.canadaResources.category': 'Ressources',
    'portfolio.canadaResources.tags': 'Canada|Minéraux critiques|Géopolitique',
    'portfolio.resourceCivilization.title': 'Le Canada, civilisation fondée sur les ressources',
    'portfolio.resourceCivilization.desc': 'Analyse de la manière dont les structures liées aux ressources structure le développement du Canada et sa position au sein de systèmes mondiaux en évolution.',
    'portfolio.resourceCivilization.category': 'Systèmes',
    'portfolio.resourceCivilization.tags': 'Canada|Systèmes de ressources|Économie politique',
    'portfolio.forestCarbon.title': 'Effet carbone net des écosystèmes forestiers canadiens',
    'portfolio.forestCarbon.desc': 'Comment des feux de forêt sans précédent ont inversé le rôle des forêts boréales du Canada dans le cycle mondial du carbone — de puits net à source nette de 1 138 Mt éq. CO₂ en 2023.',
    'portfolio.forestCarbon.category': 'Ressources',
    'portfolio.forestCarbon.tags': 'Canada|Forêts|Cycle du carbone|Feux de forêt',
    'featuredAnalysis.title': 'Sélection d\'analyses',
    'featuredAnalysis.subtitle': 'Sélection d\'analyses d\'un programme de recherche indépendant examinant les systèmes géopolitiques, les ressources et les technologies.',
    'featuredAnalysis.read': 'de lecture',
    'featuredAnalysis.readEssay': 'Lire l\'essai',
    'featuredAnalysis.readMore': 'Lire plus',

    // Story Section
    'story.intro': 'Recherche indépendante sur la géopolitique des ressources, le commerce et les enjeux stratégiques du Canada. Traductrice expérimentée comptant plus de vingt ans d’expérience auprès d’institutions fédérales canadiennes, notamment Statistique Canada et Ressources naturelles Canada. Parcours professionnel consacré principalement à des publications institutionnelles, des rapports fondés sur la recherche et des documents techniques complexes au sein d’environnements axés sur les données et les politiques publiques.\n\nPratique actuelle s’orientant progressivement vers la recherche indépendante et la rédaction de rapports analytiques portant sur la géopolitique, les systèmes de ressources et les transformations technologiques, avec une attention particulière accordée à la place du Canada dans un contexte d’évolution des structures internationales.',
    'story.strengths.title': 'Principales forces',
    'story.strengths.item1': 'Recherche et analyse documentaires dans le cadre de collaborations prolongées avec l’administration fédérale',
    'story.strengths.item2': 'Interprétation de contenus statistiques, techniques et stratégiques complexes',
    'story.strengths.item3': 'Transformation du savoir institutionnel en analyses écrites structurées',
    'story.strengths.item4': 'Perspective interdisciplinaire nourrie par une exposition internationale soutenue et par l’observation comparative',
    'story.strengths.item5': 'Engagement envers une communication claire, rigoureuse et fondée sur des données probantes afin de rendre les enjeux complexes plus accessibles',
    'story.research.title': 'Axes de recherche',
    'story.research.text': 'Les travaux actuels examinent les dynamiques géopolitiques, les systèmes de ressources et les mutations technologiques selon une approche structurelle et systémique, visant à mieux comprendre les transformations mondiales à long terme et leurs implications pour le Canada dans un contexte international en évolution.',
    'story.title': 'À propos de TransHorizons',
    'story.years': 'Années d\'expertise',
    'story.government': 'Années de traductions pour le gouvernement canadien',
    'story.domains': 'Domaines d\'analyse',
    'story.quote': 'La langue est un outil d’orientation. L’analyse, un cheminement. La compréhension, l’horizon à atteindre."\n\n"Traduire n\'a jamais été qu\'un simple exercice linguistique. Travailler sur du contenu institutionnel exige une interaction constante avec les politiques publiques, la recherche, les systèmes techniques et les façons dont les sociétés organisent et communiquent le savoir.',
    'story.positioning': 'Recherche indépendante sur la géopolitique des ressources,  le commerce et les enjeux stratégiques du Canada.',
    'story.journeysFieldNotes': 'Fragments de voyage (en développement) →',
    'story.cvOnRequest': 'CV disponible sur demande par courriel à :',

    // Gallery Section
    'gallery.title': 'Mondes observés',
    'gallery.subtitle': 'Une chronique visuelle sélectionnée de voyages, d\'architecture et de paysages — le monde vu à travers le prisme d\'une carrière en transition.',
    'gallery.sydney': 'Sydney',
    'gallery.andes': 'Aube andine',
    'gallery.archive': 'Les archives',
    'gallery.fluid': 'Horizons fluides',
    'gallery.bancarbre': 'BancArbre',
    'gallery.montreal': 'Montréal',
    'gallery.footer': 'La photographie comme pratique d\'observation — chaque image une note de terrain d\'un monde en mouvement.',

    // Blog Section
    'blog.title': 'Notes et réflexions',
    'blog.subtitle': 'Réflexions analytiques et observations de recherche : explorations de tendances émergentes et de l\'évolution des perspectives relatives aux systèmes géopolitiques et technologiques',
    'blog.allArticles': 'Tous les articles',
    'blog.careerChange.category': 'Notes',
    'blog.careerChange.date': 'Mars 2026',
    'blog.careerChange.readTime': '8 min de lecture',
    'blog.careerChange.title': 'De la traduction vers la recherche et l\'analyse',
    'blog.careerChange.desc': 'Réflexion sur la manière dont la traduction institutionnelle est devenue une formation de longue durée en matière de recherche, de curiosité et d\'écriture analytique.',
    'blog.travelStories.category': 'Observations',
    'blog.travelStories.date': 'Février 2026',
    'blog.travelStories.readTime': '10 min de lecture',
    'blog.travelStories.title': 'Voyage, observation et formation d’une perspective analytique',
    'blog.travelStories.desc': 'Comment de longs voyages sur plusieurs continents sont devenus une méthode d\'enquête et ont façonné une perspective analytique ancrée dans l\'observation directe.',
    'blog.orbitalDataCenters.category': 'Systèmes et signaux',
    'blog.orbitalDataCenters.date': 'À venir',
    'blog.orbitalDataCenters.readTime': '',
    // TODO (Peggy): rédiger le titre et la description FR pour cette note « à venir ».
    'blog.orbitalDataCenters.title': 'Serveurs en orbite : l\'essor des centres de données spatiaux',
    'blog.orbitalDataCenters.desc': 'Alors que les contraintes terrestres en matière d\'énergie et de refroidissement s\'accentuent, les projets visant à placer des centres de données en orbite passent de la spéculation à l\'ingénierie. Premier regard sur la logique énergétique, l\'économie et la géopolitique du calcul dans l\'espace.',
    'blog.readArticle': 'Lire l\'article',
    'blog.readMore': 'Lire la suite',

    // Contact Section
    'contact.title': 'Contact / Collaboration',
    'contact.intro': 'Vous vous intéressez à l\'analyse géopolitique, aux enjeux liés aux ressources ou aux technologies?\n\nSi un texte du site vous a inspiré une question, un désaccord ou une idée à échanger, votre message est bienvenu.',
    'contact.location': 'Localisation',
    'contact.montreal': 'Montréal, Québec, Canada',
    'contact.follow': 'Suivre',
    'contact.name': 'Votre nom complet',
    'contact.email': 'votre@email.com',
    'contact.subject': 'Analyse géopolitique, collaboration, etc.',
    'contact.message': 'Parlez-moi de votre projet ou de votre demande...',
    'contact.send': 'Envoyer le message',
    'contact.emailClientHint': 'Cliquer sur « Envoyer le message » ouvrira votre application email avec ce message pré-rempli.',
    'contact.emailClientOpened': 'Votre client email devrait s\'être ouvert.',
    'contact.emailClientOpenedDesc': 'Votre message a été pré-rempli et est prêt à être envoyé depuis votre application email.',

    // Footer
    'footer.copyright': '© 2026 TransHorizons. Tous droits réservés.',
    'footer.instagram': 'Instagram',
    'footer.blog': 'Blog',
    'footer.brand': 'Recherche et cartes.\nExploration indépendante en géopolitique, systèmes mondiaux, ressources et  transformations technologiques.',
    'footer.navigate': 'Navigation',
    'footer.connect': 'Contact',
    'footer.instagramDesc': ' ',
    'footer.blogDesc': 'Articles et analyses',
    'footer.journeysDesc': 'Exploration photographique du monde (en développement)',
    'footer.marquee1': 'Recherche · Analyse',
    'footer.marquee2': 'Le Canada et le monde',
    'footer.marquee3': 'Géopolitique · Ressources · Technologie',
    'footer.marquee4': 'Systèmes et changements mondiaux',


    // Research Approach Section
    'researchApproach.title': 'Approche de recherche',
    'researchApproach.subtitle': 'Pratique analytique structurée reposant sur des sources institutionnelles, des recherches multidisciplinaires et le suivi à long terme des systèmes géopolitiques et technologiques.',
    'researchApproach.description': 'Cette recherche s\'appuie sur des sources institutionnelles et primaires accessibles au public, combinées à une synthèse interdisciplinaire et au suivi des évolutions mondiales.',
    'researchApproach.description2': 'L\'approche privilégie les dynamiques structurelles et les interactions systémiques afin de transformer des informations complexes en analyses claires et traçables.',
    'researchApproach.button': 'Explorer l\'approche de recherche',

    // Detail Pages
    'detail.backToPortfolio': 'Retour au portfolio',
    'detail.backToStories': 'Retour aux histoires',
    'detail.backToHome': 'Retour à l\'accueil',
    'detail.getInTouch': 'Prenez contact',
    'detail.interestedInAnalysis': 'Intéressé par cette analyse?',
    'detail.interestedInPerspectives': 'Intéressé par ces perspectives?',
    'detail.letDiscuss': 'Discutons de la façon dont ces perspectives s\'appliquent à vos questions stratégiques ou à vos projets.',
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = React.useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
