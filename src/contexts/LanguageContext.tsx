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
    'hero.title': 'Research, Writing & Maps',
    'hero.subtitle': 'Structured analysis of geopolitical, resource, and technological systems, particularly those shaping Canada\'s position in the World.',
    'hero.byline': 'An independent research initiative by Peggy Brenier',
    'hero.button1': 'View Analyses',
    'hero.button2': 'About',
    'hero.scroll': 'Scroll',

    // Portfolio Section
    'portfolio.title': 'Analyses: Geopolitics. Resources. Technology.',
    'portfolio.intro': 'A selection of analyses, briefs, and visual essays exploring the forces that shape our world — from resource geopolitics to digital governance and Canada\'s place in a shifting global order.',
    'portfolio.viewAll': 'View all analyses',
    'analyses.pageTitle': 'All Analyses',
    'analyses.pageSubtitle': 'The full collection of analytical essays, briefs, and visual essays — from resource geopolitics to digital governance and environmental change.',
    'portfolio.geopolitics.title': 'Canada in the Multipolar World',
    'portfolio.geopolitics.desc': 'Analyzes how shifting power structures redefine Canada’s position within a fragmented global order.',
    'portfolio.resources.title': 'Critical Minerals & the Energy Transition',
    'portfolio.resources.desc': 'Examines how material supply chains are reshaping industrial systems and geopolitical positioning.',
    'portfolio.technology.title': 'AI Governance & Digital Sovereignty',
    'portfolio.technology.desc': 'Explores how digital systems and governance models are restructuring technological and geopolitical power.',
    'portfolio.readBrief': 'Read brief',
    'portfolio.geopolitics.category': 'Geopolitics',
    'portfolio.geopolitics.tags': 'Strategic analysis|Canada|Multilateralism',
    'portfolio.resources.category': 'Resources',
    'portfolio.resources.tags': 'Energy|Supply chains|Policy',
    'portfolio.technology.category': 'Technology',
    'portfolio.technology.tags': 'AI Policy|Digital governance|Innovation',
    'portfolio.canadaResources.title': "Canada's Resource Wealth in a Fractured World",
    'portfolio.canadaResources.desc': "Canada's vast mineral endowment — lithium, cobalt, nickel, uranium, rare earths — has moved from a background economic asset to a front-line geopolitical variable in an era of supply chain nationalism.",
    'portfolio.canadaResources.category': 'Analysis',
    'portfolio.canadaResources.tags': 'Canada|Critical minerals|Geopolitics',
    'portfolio.resourceCivilization.title': 'Canada as a Resource Civilization',
    'portfolio.resourceCivilization.desc': 'Examines how resource structures shape Canada’s development and position within evolving global systems.',
    'portfolio.resourceCivilization.category': 'Analysis',
    'portfolio.resourceCivilization.tags': 'Canada|Resource systems|Political economy',
    'portfolio.forestCarbon.title': 'Net Carbon Effect of Canadian Forest Ecosystems',
    'portfolio.forestCarbon.desc': 'How unprecedented wildfires have reversed the role of Canada\'s boreal forests in the global carbon cycle — from net sink to 1,138 Mt CO₂e net source in 2023.',
    'portfolio.forestCarbon.category': 'Resources & Environment',
    'portfolio.forestCarbon.tags': 'Canada|Forests|Carbon cycle|Wildfires',
    'featuredAnalysis.title': 'Featured Analysis',
    'featuredAnalysis.subtitle': 'In-depth analytical essays on Canada\'s resource systems, geopolitical positioning, and the structural forces shaping its role in the 21st century.',
    'featuredAnalysis.read': 'read',
    'featuredAnalysis.readEssay': 'Read essay',
    'featuredAnalysis.readMore': 'Read more',

    // Story Section
    'story.intro': 'Senior translator and analytical writer with more than twenty years of experience supporting Canadian federal institutions, including Statistics Canada and Natural Resources Canada. Professional experience has focused on institutional publications, research-based reporting, and complex technical documentation within data-driven and policy-oriented environments.\n\nCurrent practice increasingly extends toward independent research and analytical writing on geopolitics, resource systems, and technological transformation, with particular attention to Canada\'s position within evolving global structures.',
    'story.strengths.title': 'Core Strengths',
    'story.strengths.item1': 'Institutional research and documentation developed through long-term federal collaboration',
    'story.strengths.item2': 'Interpretation of complex statistical, technical, and policy material',
    'story.strengths.item3': 'Translation of institutional knowledge into structured written analysis',
    'story.strengths.item4': 'Interdisciplinary perspective informed by extensive international exposure and comparative observation',
    'story.strengths.item5': 'Commitment to clear, evidence-based communication for public understanding',
    'story.research.title': 'Research Focus',
    'story.research.text': 'Current work examines geopolitical dynamics, resource systems, and technological change through a structural, systems-oriented approach, aiming to clarify long-term global transformations relevant to Canadian and international contexts.',
    'story.title': 'Blending Linguistics with Global Analytics',
    'story.years': 'Years of expertise',
    'story.government': 'Years of translations for the Canadian government',
    'story.domains': 'Domains of analysis',
    'story.quote': 'Language is the map. Analysis is the journey. Understanding is the destination.',
    'story.positioning': 'Independent analyst translating Canadian institutional knowledge into structured analysis of global geopolitical, resource, and technological systems.',
    'story.journeysFieldNotes': 'Journeys & Field Notes →',
    'story.downloadCV': 'Download CV',

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
    'blog.subtitle': 'Analytical reflections and research observations — deeper dives into emerging patterns and evolving perspectives on geopolitical and technological systems',
    'blog.allArticles': 'All Articles',
    'blog.careerChange.category': 'Notes',
    'blog.careerChange.date': 'March 2026',
    'blog.careerChange.readTime': '8 min read',
    'blog.careerChange.title': 'From Translation Toward Research and Analysis',
    'blog.careerChange.desc': 'Translation has been my training ground for intellectual rigor and disciplined inquiry. Today, I translate that institutional knowledge into structured analysis of global geopolitical, resource, and technological systems. This is the story of how language and context become the foundation for understanding.',
    'blog.travelStories.category': 'Observations',
    'blog.travelStories.date': 'February 2026',
    'blog.travelStories.readTime': '10 min read',
    'blog.travelStories.title': 'Travel, Observation, and the Making of an Institutional Analyst',
    'blog.travelStories.desc': 'My professional life began in languages, but languages were never the destination. They were an entry point into something larger: understanding how societies organize themselves, how institutions function, and how civilizations coexist on a shared planet.',
    'blog.canadaResources.category': 'Signals',
    'blog.canadaResources.date': 'Coming Soon',
    'blog.canadaResources.readTime': '12 min read',
    'blog.canadaResources.title': 'Critical Minerals: Canada\'s Resource Nexus',
    'blog.canadaResources.desc': 'Canada\'s abundance of critical minerals positions the country at the center of global supply chains. Examining resource wealth, geopolitical implications, and the choices shaping Canada\'s role in the energy transition.',
    'blog.readArticle': 'Read Article',
    'blog.readMore': 'Read More',

    // Contact Section
    'contact.title': 'Get in Touch',
    'contact.intro': 'Interested in geopolitical, resource, or technology analysis? Looking to explore global trends, commission a brief, or simply start a conversation about the forces shaping our world? I\'d be glad to hear from you.',
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
    'footer.linkedin': 'LinkedIn',
    'footer.instagram': 'Instagram',
    'footer.blog': 'Blog',
    'footer.brand': 'Bridging linguistic precision with strategic insight. Exploring the forces reshaping geopolitics, resources, and technology.',
    'footer.navigate': 'Navigate',
    'footer.connect': 'Connect',
    'footer.linkedinDesc': 'Professional network',
    'footer.instagramDesc': 'Visual stories',
    'footer.blogDesc': 'Articles & analysis',
    'footer.marquee1': 'Research · Writing · Analysis',
    'footer.marquee2': 'Canada & the world',
    'footer.marquee3': 'Geopolitics · Resources · Technology',
    'footer.marquee4': 'Systems, Strategy, and Global Change',

    // Publications Page
    'publications.title': 'Writing & Translation Archive',
    'publications.subtitle': 'Institutional Publication Contributions',
    'publications.intro': 'Over 25 years of translation work across education, economics, and institutional contexts. A selection of published translations and the recognition they received.',
    'publications.prize': 'Quebec Education Minister\'s Prize (2007-2008)',
    'publications.prizeDesc': 'Awarded for the translation of "Organizational Behaviour: Human Behaviour and Organizations in a Complex Environment."',
    'publications.pub2.title': 'Organizational Behaviour — Human Behaviour and Organizations in a Complex Environment',
    'publications.pub2.isbn': 'ISBN-13: 978-2765104490',
    'publications.pub2.publisher': 'Chenelière McGraw-Hill · August 20, 2007',
    'publications.pub2.desc': 'English-to-French translation of Steven L. McShane\'s Canadian Organizational Behaviour. Adaptation with Charles Benabou (UQAM). Published by Chenelière McGraw-Hill, 827 pages. Winner of the Quebec Education Minister\'s Prize (2007-2008).',
    'publications.pub3.title': 'Contemporary Economics: Major Issues',
    'publications.pub3.isbn': 'ISBN-13: 9782893109947',
    'publications.pub3.publisher': 'Les Éditions de la Chenelière · January 1, 2004',
    'publications.pub3.desc': 'English-to-French translation of the work by Bogota, Hawkes, Mahoney and Piper, in collaboration with Anne Courtois. Published by Les Éditions de la Chenelière, Montreal. Listed as a required resource in the New Brunswick economics curriculum (Introduction to Economics, course 44411).',
    'publications.pub4.title': 'Mathematics 10 (Investigation Mathematics 10)',
    'publications.pub4.isbn': 'ISBN-13: 9782761330169',
    'publications.pub4.publisher': 'Pearson ERPI',
    'publications.pub4.desc': 'English-to-French translation of the work by Barbara J. Canton et al., in collaboration with Gilles Rivet. Mathematics textbook for Grade 10 students (PONC/WNCP program). Listed with the Manitoba French Educational Resources Department (DREF).',
    'publications.pub5.title': 'Investigation Sciences et technologie 7 (Investigating Science and Technology 7)',
    'publications.pub5.isbn': 'ISBN-13: 9782761330176',
    'publications.pub5.publisher': 'Pearson ERPI',
    'publications.pub5.desc': 'English-to-French translation of the Grade 7 science and technology textbook, in collaboration with Guy Brochu. Lead author: Lionel Sandner. Published by Pearson ERPI. Textbook used in francophone classrooms across Canada.',
    'publications.pub6.title': 'Développement humain et rôle parental (Parenting in Canada: Human Growth and Development)',
    'publications.pub6.isbn': 'ISBN-13: 9782765001096',
    'publications.pub6.publisher': 'Éditions de la Chenelière · 2004',
    'publications.pub6.desc': 'French translation of the parenting and human development guide by Cunningham, Mary; Meriorg, Eva; and Tryssenaar, Laura. Translated in collaboration with Charlebois, Johanne. Published by Éditions de la Chenelière, Montreal. 498 pages, illustrated in colour (ISBN 2765001103).',

    // Research Approach Section
    'researchApproach.title': 'Research Approach',
    'researchApproach.subtitle': 'A structured analytical practice grounded in institutional sources, cross-domain research, and long-term monitoring of geopolitical and technological systems.',
    'researchApproach.description': 'Research is based on publicly available institutional and primary sources, combined with cross-domain synthesis and continuous monitoring of global developments.',
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
    'hero.title': 'Recherche, rédaction et cartes',
    'hero.subtitle': 'Initiative indépendante de recherche et d\'analyse explorant la position du Canada dans un monde en transformation ainsi que les dynamiques qui redéfinissent la géopolitique, les ressources et les technologies.',
    'hero.byline': 'Une initiative de recherche indépendante par Peggy Brenier',
    'hero.button1': 'Voir les analyses',
    'hero.button2': 'À propos',
    'hero.scroll': 'Défiler',

    // Portfolio Section
    'portfolio.title': 'Analyses : Géopolitique. Ressources. Technologie',
    'portfolio.intro': 'Sélection d\'analyses, de notes stratégiques et d\'essais visuels explorant les forces qui façonnent notre monde — de la géopolitique des ressources à la gouvernance numérique, en passant par la position du Canada dans un ordre mondial en mutation.',
    'portfolio.viewAll': 'Voir toutes les analyses',
    'analyses.pageTitle': 'Toutes les analyses',
    'analyses.pageSubtitle': 'L\'ensemble des essais analytiques, notes stratégiques et essais visuels — de la géopolitique des ressources à la gouvernance numérique et aux changements environnementaux.',
    'portfolio.geopolitics.title': 'Le Canada dans un monde multipolaire',
    'portfolio.geopolitics.desc': 'Un bref analytique sur le positionnement stratégique du Canada alors que la dynamique du pouvoir mondial s\'éloigne de l\'unipolairité de l\'après-Guerre froide.',
    'portfolio.resources.title': 'Minéraux critiques et transition énergétique',
    'portfolio.resources.desc': 'Cartographier les implications géopolitiques des chaînes d\'approvisionnement en terres rares et minéraux critiques pour le secteur des ressources canadien.',
    'portfolio.technology.title': 'Gouvernance de l\'IA et souveraineté numérique',
    'portfolio.technology.desc': 'Examiner comment les nations naviguent la réglementation de l\'intelligence artificielle et le paysage émergent du pouvoir numérique.',
    'portfolio.readBrief': 'Lire le bref',
    'portfolio.geopolitics.category': 'Géopolitique',
    'portfolio.geopolitics.tags': 'Analyse stratégique|Canada|Multilatéralisme',
    'portfolio.resources.category': 'Ressources',
    'portfolio.resources.tags': 'Énergie|Chaînes d\'approvisionnement|Politique',
    'portfolio.technology.category': 'Technologie',
    'portfolio.technology.tags': 'Politique IA|Gouvernance numérique|Innovation',
    'portfolio.canadaResources.title': 'La richesse en ressources du Canada dans un monde fracturé',
    'portfolio.canadaResources.desc': "L'immense dotation minérale du Canada — lithium, cobalt, nickel, uranium, terres rares — est passée d'un atout économique de fond à une variable géopolitique de première ligne à l'ère du nationalisme des chaînes d'approvisionnement.",
    'portfolio.canadaResources.category': 'Analyse',
    'portfolio.canadaResources.tags': 'Canada|Minéraux critiques|Géopolitique',
    'portfolio.resourceCivilization.title': 'Le Canada comme civilisation des ressources au XXIe siècle',
    'portfolio.resourceCivilization.desc': 'Un essai analytique examinant comment le développement historique du Canada en tant que système fondé sur les ressources façonne sa position dans les structures mondiales émergentes définies par la transition énergétique, les matériaux stratégiques et la fragmentation géopolitique.',
    'portfolio.resourceCivilization.category': 'Analyse',
    'portfolio.resourceCivilization.tags': 'Canada|Systèmes de ressources|Économie politique',
    'portfolio.forestCarbon.title': 'Effet carbone net des écosystèmes forestiers canadiens',
    'portfolio.forestCarbon.desc': 'Comment des feux de forêt sans précédent ont inversé le rôle des forêts boréales du Canada dans le cycle mondial du carbone — de puits net à source nette de 1 138 Mt éq. CO₂ en 2023.',
    'portfolio.forestCarbon.category': 'Ressources et environnement',
    'portfolio.forestCarbon.tags': 'Canada|Forêts|Cycle du carbone|Feux de forêt',
    'featuredAnalysis.title': 'Analyses phares',
    'featuredAnalysis.subtitle': 'Essais analytiques approfondis sur les systèmes de ressources du Canada, son positionnement géopolitique et les forces structurelles qui façonnent son rôle au XXIe siècle.',
    'featuredAnalysis.read': 'de lecture',
    'featuredAnalysis.readEssay': 'Lire l\'essai',
    'featuredAnalysis.readMore': 'Lire plus',

    // Story Section
    'story.intro': 'Traductrice expérimentée et rédactrice analytique comptant plus de vingt ans d’expérience auprès d’institutions fédérales canadiennes, notamment Statistique Canada et Ressources naturelles Canada. Le parcours professionnel s’est concentré sur les publications institutionnelles, les rapports fondés sur la recherche et la documentation technique complexe au sein d’environnements axés sur les données et les politiques publiques.\n\nLa pratique actuelle s’oriente progressivement vers la recherche indépendante et la rédaction analytique portant sur la géopolitique, les systèmes de ressources et les transformations technologiques, avec une attention particulière accordée à la place du Canada dans l’évolution des structures internationales.',
    'story.strengths.title': 'Principales forces',
    'story.strengths.item1': 'Recherche et analyse documentaires dans le cadre de collaborations prolongées avec l’administration fédérale',
    'story.strengths.item2': 'Interprétation de contenus statistiques, techniques et stratégiques complexes',
    'story.strengths.item3': 'Transformation du savoir institutionnel en analyses écrites structurées',
    'story.strengths.item4': 'Perspective interdisciplinaire reposant par une exposition internationale soutenue et l’observation comparative',
    'story.strengths.item5': 'Engagement envers une communication claire, rigoureuse et fondée sur des données probantes au service de la compréhension publique',
    'story.research.title': 'Axes de recherche',
    'story.research.text': 'Les travaux actuels examinent les dynamiques géopolitiques, les systèmes de ressources et les mutations technologiques selon une approche structurelle et systémique, visant à mieux comprendre les transformations mondiales à long terme pertinentes pour le Canada et pour les contextes internationaux.',
    'story.title': 'Allier la linguistique à l\'analyse mondiale',
    'story.years': 'Années d\'expertise',
    'story.government': 'Années de traductions pour le gouvernement canadien',
    'story.domains': 'Domaines d\'analyse',
    'story.quote': 'La langue est la carte. L\'analyse est le voyage. La compréhension est la destination.',
    'story.positioning': 'Analyste indépendante transformant l\'expérience institutionnelle canadienne en analyses structurées des dynamiques géopolitiques, des ressources et des transformations technologiques à l\'échelle mondiale.',
    'story.journeysFieldNotes': 'Voyages et notes de terrain →',
    'story.downloadCV': 'Télécharger le CV',

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
    'blog.subtitle': 'Réflexions analytiques et observations de recherche — explorations approfondies des tendances émergentes et de l\'évolution des perspectives relatives aux systèmes géopolitiques et technologiques',
    'blog.allArticles': 'Tous les articles',
    'blog.careerChange.category': 'Notes',
    'blog.careerChange.date': 'Mars 2026',
    'blog.careerChange.readTime': '8 min de lecture',
    'blog.careerChange.title': 'De la traduction vers la recherche et l\'analyse',
    'blog.careerChange.desc': 'La traduction a été mon terrain d\'entraînement pour la rigueur intellectuelle et l\'enquête disciplinée. Aujourd\'hui, je traduis cette connaissance institutionnelle en analyse structurée des systèmes géopolitiques, des ressources et technologiques mondiaux. C\'est l\'histoire de comment la langue et le contexte deviennent la base de la compréhension.',
    'blog.travelStories.category': 'Observations',
    'blog.travelStories.date': 'Février 2026',
    'blog.travelStories.readTime': '10 min de lecture',
    'blog.travelStories.title': 'Récits de voyage : perspectives d\'un traducteur',
    'blog.travelStories.desc': 'Des marchés d\'Asie du Sud-Est aux frontières de la Sibérie, le voyage a été mon plus grand professeur. Comment des décennies d\'observation sur plusieurs continents ont façonné ma compréhension de la géopolitique, des institutions et de l\'expérience vécue des civilisations.',
    'blog.canadaResources.category': 'Signaux',
    'blog.canadaResources.date': 'À venir',
    'blog.canadaResources.readTime': '12 min de lecture',
    'blog.canadaResources.title': 'Minéraux critiques : le nœud des ressources au Canada',
    'blog.canadaResources.desc': 'L\'abondance de minéraux critiques du Canada le positionne au centre des chaînes d\'approvisionnement mondiales. Examen de la richesse en ressources, des implications géopolitiques et des choix qui façonnent le rôle du Canada dans la transition énergétique.',
    'blog.readArticle': 'Lire l\'article',
    'blog.readMore': 'Lire la suite',

    // Contact Section
    'contact.title': 'Prenez contact',
    'contact.intro': 'Vous vous intéressez à l\'analyse géopolitique, aux enjeux liés aux ressources ou aux technologies? Vous souhaitez explorer les grandes tendances mondiales, commander une note d\'analyse ou simplement amorcer une discussion sur les forces qui transforment notre monde? Je serais ravie d\'échanger avec vous.',
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
    'footer.copyright': '© 2026 TransHorizons — Vers les systèmes mondiaux — Histoires stratégiques',
    'footer.linkedin': 'LinkedIn',
    'footer.instagram': 'Instagram',
    'footer.blog': 'Blog',
    'footer.brand': 'Vous vous intéressez à l\'analyse géopolitique, aux enjeux liés aux ressources ou aux technologies? Vous souhaitez explorer les grandes tendances mondiales, commander une note d\'analyse ou simplement amorcer une discussion sur les forces qui transforment notre monde? Je serais ravie d\'échanger avec vous.',
    'footer.navigate': 'Navigation',
    'footer.connect': 'Contact',
    'footer.linkedinDesc': 'Réseau professionnel',
    'footer.instagramDesc': 'Histoires visuelles',
    'footer.blogDesc': 'Articles et analyses',
    'footer.marquee1': 'Recherche · Rédaction · Analyse',
    'footer.marquee2': 'Le Canada et le monde',
    'footer.marquee3': 'Géopolitique · Ressources · Technologie',
    'footer.marquee4': 'Systèmes, stratégie et changements mondiaux',

    // Publications Page
    'publications.title': 'Archive de publications et de traductions',
    'publications.subtitle': 'Contributions aux publications institutionnelles',
    'publications.intro': 'Plus de 25 ans de travail en traduction dans les domaines de l\'éducation, de l\'économie et des contextes institutionnels. Une sélection de traductions publiées et de la reconnaissance qu\'elles ont reçue.',
    'publications.prize': 'Prix de la ministre de l\'Éducation, du Loisir et du Sport du Québec (2007-2008)',
    'publications.prizeDesc': 'Décerné pour la traduction de « Comportement organisationnel — Comportements humains et organisations dans un environnement complexe ».',
    'publications.pub2.title': 'Comportement organisationnel — Comportements humains et organisations dans un environnement complexe',
    'publications.pub2.isbn': 'ISBN-13: 978-2765104490',
    'publications.pub2.publisher': 'Chenélière McGraw-Hill · 20 août 2007',
    'publications.pub2.desc': 'Traduction de l\'anglais vers le français de l\'ouvrage Canadian Organizational Behaviour de Steven L. McShane. Adaptation réalisée avec Charles Benabou (UQAM). Publié par Chenélière McGraw-Hill, 827 pages. Lauréat d\'un Prix de la ministre de l\'Éducation, du Loisir et du Sport du Québec (2007-2008).',
    'publications.pub3.title': 'Économie contemporaine : les grands enjeux',
    'publications.pub3.isbn': 'ISBN-13: 9782893109947',
    'publications.pub3.publisher': 'Les Éditions de la Chenelière · 1er janvier 2004',
    'publications.pub3.desc': 'Traduction de l\'anglais vers le français de l\'ouvrage de Bogota, Hawkes, Mahoney et Piper, avec Anne Courtois. Publié par Les Éditions de la Chenelière, Montréal. Inscrit comme ressource obligatoire dans le curriculum d\'économie du Nouveau-Brunswick (Introduction à l\'économie, cours 44411).',
    'publications.pub4.title': 'Mathématiques 10 (Investigation Mathématiques 10)',
    'publications.pub4.isbn': 'ISBN-13: 9782761330169',
    'publications.pub4.publisher': 'Pearson ERPI',
    'publications.pub4.desc': 'Traduction de l\'anglais vers le français de l\'ouvrage de Barbara J. Canton et al., en collaboration avec Gilles Rivet. Manuel de mathématiques pour les élèves de 10e année (programme PONC/WNCP). Inscrit auprès du Département des ressources éducatives en français du Manitoba (DREF).',
    'publications.pub5.title': 'Investigation Sciences et technologie 7 (Investigating Science and Technology 7)',
    'publications.pub5.isbn': 'ISBN-13: 9782761330176',
    'publications.pub5.publisher': 'Pearson ERPI',
    'publications.pub5.desc': 'Traduction de l\'anglais vers le français du manuel de sciences et technologie de 7e année, en collaboration avec Guy Brochu. Auteur principal : Lionel Sandner. Publié par Pearson ERPI. Manuel utilisé dans les salles de classe francophones partout au Canada.',
    'publications.pub6.title': 'Développement humain et rôle parental (Parenting in Canada: Human Growth and Development)',
    'publications.pub6.isbn': 'ISBN-13: 9782765001096',
    'publications.pub6.publisher': 'Éditions de la Chenelière · 2004',
    'publications.pub6.desc': 'Traduction en français du guide sur le rôle parental et le développement humain de Cunningham, Mary; Meriorg, Eva; et Tryssenaar, Laura. Traduit en collaboration avec Charlebois, Johanne. Publié par Éditions de la Chenelière, Montréal. 498 pages, illustré en couleur (ISBN 2765001103).',

    // Research Approach Section
    'researchApproach.title': 'Approche de recherche',
    'researchApproach.subtitle': 'Une pratique analytique structurée ancrée dans les sources institutionnelles, la recherche multidisciplinaire et le suivi à long terme des systèmes géopolitiques et technologiques.',
    'researchApproach.description': 'Cette initiative de recherche s\'appuie sur 25+ ans d\'expérience institutionnelle, d\'analyse multilingue et de suivi systématique des tendances mondiales.',
    'researchApproach.description2': 'Chaque analyse intègre des sources primaires, des publications institutionnelles et des données en temps réel pour fournir des perspectives exploitables sur les dynamiques géopolitiques, des ressources et de la technologie.',
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
