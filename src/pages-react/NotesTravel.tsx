
/**
 * NotesTravel.tsx
 * Bilingual EN/FR — content driven by useLanguage()
 */

import NotesDetailLayout from '../components/NotesDetailLayout';
import { useLanguage } from '../contexts/LanguageContext';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1400&q=80';
const IMAGE_1 = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80';
const IMAGE_2 = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80';

const contentEN = (
  <div className="space-y-8">
    <h2 className="font-playfair text-3xl font-bold text-charcoal mt-12">From Translation to Analysis</h2>

    <p className="text-charcoal/80 leading-relaxed">
      My professional life began in languages, but languages were never the destination. They were an entry point into something larger: understanding how societies organize themselves, how institutions function, and how civilizations coexist on a shared planet.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      Raised in France, I initially followed a scientific path before pivoting toward languages during adolescence—English and Spanish first, then Russian, later Chinese studies alongside translation training. That shift did not represent a rejection of science but rather an expansion of curiosity: moving from equations toward human systems.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      From the age of nineteen, travel became continuous and practical rather than romantic. Summers were spent working abroad—first as a chambermaid in Edinburgh, later operating an arcade in California, working retail at the Statue of Liberty, studying in London through Erasmus, and completing translation training while moving between France, New York, Madrid, and Montréal.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      These were not journeys undertaken for leisure. They were early exercises in adaptation—learning how societies function from within everyday life. Translation offered professional mobility, but travel provided education.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      Over time, the center of gravity shifted: less interest in linguistic mediation itself, and more in observing how institutions, economies, and cultures operate in practice.
    </p>

    <h2 className="font-playfair text-3xl font-bold text-charcoal mt-12">Observation Rather Than Tourism</h2>

    <p className="text-charcoal/80 leading-relaxed">
      Travel, for me, was never primarily about destinations. It became a method of inquiry. Fluency in local languages was rarely the reality. Most encounters happened through rudimentary English, gestures, shared meals, or simple acts of cooperation. Understanding emerged not from perfect conversation but from presence—watching markets open at dawn, observing infrastructure, public behavior, institutional order, or social tensions visible in everyday routines.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      Observation proved more revealing than dialogue. One learns quickly that societies communicate through patterns: transportation systems, housing forms, public space usage, attitudes toward authority, environmental stewardship, or economic improvisation. These elements reveal how communities adapt to geography, history, and technological change.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      Travel became fieldwork without formal designation.
    </p>

    <h2 className="font-playfair text-3xl font-bold text-charcoal mt-12">Early Professional Formation Across Continents</h2>

    <p className="text-charcoal/80 leading-relaxed">
      Before emigrating, Europe and North America formed the first comparative framework. Work in Dublin as a localization specialist at Microsoft exposed me to globalization at an operational level—how technology companies translate not only software but organizational culture across jurisdictions.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      Shortly afterward, I emigrated to Canada, arriving by cargo ship. The move marked a decisive transformation. Freelance translation enabled geographic mobility across the country: Québec, Northern regions, Prairie cities, the West Coast, and remote communities. Canada was not simply another country encountered during travel. It became a civic belonging.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      Becoming Canadian meant joining a society attempting something historically rare: a functioning multicultural state where diversity is not theoretical but administrative, social, and daily reality. Living within that framework produced lasting gratitude and intellectual interest in how plural societies maintain cohesion.
    </p>

    <h2 className="font-playfair text-3xl font-bold text-charcoal mt-12">Travel as Field Research</h2>

    <p className="text-charcoal/80 leading-relaxed">
      Once professional stability allowed it, travel expanded into sustained global exploration. Participation in a medical caravan in Morocco became an early confrontation with inherited stereotypes and the complexity of North African identities. A 4×4 expedition across Mauritania introduced the realities of geography shaping civilization. Extended road and rail journeys across the British Isles revealed regional economic contrasts within advanced economies.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      Asia marked a turning point. A ten-month journey beginning in Hong Kong and Southeast Asia evolved into extended residence and study in China, including months in Shanghai and thousands of kilometers traveled by train across the country. Movement continued through Japan, Mongolia, Tibet, and ultimately the Trans-Siberian Railway back to Europe.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      Later returns to Siberia confirmed a deep intellectual fascination with frontier regions—places where environment, infrastructure, and state power intersect visibly.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      Subsequent years expanded the observational map:
    </p>

    <ul className="space-y-2 ml-4 text-charcoal/80">
      <li className="flex gap-2"><span className="text-sand font-bold">•</span> <span>Gemological travel linking geology, trade networks, and global markets</span></li>
      <li className="flex gap-2"><span className="text-sand font-bold">•</span> <span>Extended journeys across Australia and New Zealand</span></li>
      <li className="flex gap-2"><span className="text-sand font-bold">•</span> <span>South American travel by bus and rail through Brazil, Argentina, Chile, and Uruguay</span></li>
      <li className="flex gap-2"><span className="text-sand font-bold">•</span> <span>Repeated long stays in Japan focused on slow observation</span></li>
      <li className="flex gap-2"><span className="text-sand font-bold">•</span> <span>Overland exploration across Europe's institutional and historical centers</span></li>
      <li className="flex gap-2"><span className="text-sand font-bold">•</span> <span>Transcontinental rail journeys across North America</span></li>
      <li className="flex gap-2"><span className="text-sand font-bold">•</span> <span>Extended residence periods in Seoul following the pandemic</span></li>
    </ul>

    <p className="text-charcoal/80 leading-relaxed mt-6">
      Across decades, movement increasingly followed a consistent principle: travel slowly, fly little when possible, and remain long enough for patterns to emerge.
    </p>

    <img src={IMAGE_1} alt="Travel and observation across continents" className="w-full rounded-lg my-8" />

    <h2 className="font-playfair text-3xl font-bold text-charcoal mt-12">Civilizations Seen from the Ground</h2>

    <p className="text-charcoal/80 leading-relaxed">
      What sustained travel revealed is simple but often overlooked: civilizations are ecological responses. Geography, climate, resources, and historical memory shape institutions far more deeply than ideology alone. Markets in Southeast Asia, rail networks in Japan, resource economies in Canada, post-industrial regions in Europe, or frontier settlements in Siberia all demonstrate variations of the same human project—organizing life under constraints.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      Geopolitics, viewed from this perspective, ceases to be abstract competition between states. It becomes the interaction of societies attempting to secure stability, dignity, and continuity. Direct observation complicates simplified narratives. No region fits easily into external categories of success or failure. Everywhere, adaptation is ongoing.
    </p>

    <h2 className="font-playfair text-3xl font-bold text-charcoal mt-12">The Emergence of an Analytical Practice</h2>

    <p className="text-charcoal/80 leading-relaxed">
      Years spent translating institutional documents for Canadian federal organizations provided a parallel education: exposure to how governments think, write, and make decisions. Translation required precision; analysis required synthesis.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      Gradually, professional interest moved toward research, institutional writing, and analytical reflection—examining geopolitics, resource systems, technological transformation, and Canada's evolving position within a changing global order. Travel supplied empirical intuition. Institutional work supplied methodological discipline. Together, they formed the basis of an analytical voice grounded not only in reading but in lived comparison across societies.
    </p>

    <h2 className="font-playfair text-3xl font-bold text-charcoal mt-12">Canada as Intellectual Anchor</h2>

    <p className="text-charcoal/80 leading-relaxed">
      After decades of mobility, Canada remains the intellectual anchor of this trajectory. The country represents an ongoing experiment: balancing vast geography, resource wealth, immigration, Indigenous realities, and global integration while maintaining democratic stability.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      Having become Canadian is experienced less as arrival than as participation in a collective civic project. The coexistence of multiple identities within a functioning institutional framework continues to inform both professional analysis and personal gratitude. In a world increasingly defined by fragmentation, Canada demonstrates that diversity can be administratively organized rather than merely celebrated rhetorically.
    </p>

    <img src={IMAGE_2} alt="Canada as institutional anchor" className="w-full rounded-lg my-8" />

    <h2 className="font-playfair text-3xl font-bold text-charcoal mt-12">Continuing the Work</h2>

    <p className="text-charcoal/80 leading-relaxed">
      Travel today serves a different purpose than in youth. It is no longer exploration for its own sake but an extension of research. Observation, writing, mapping, and analysis now converge into a single practice: attempting to understand how humanity inhabits Earth—how civilizations adapt to technological change, environmental constraints, and shifting geopolitical structures.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      The goal is not expertise over places but attentiveness to patterns. The planet remains the central subject: its landscapes, its cultures, its institutions, and the extraordinary diversity of human attempts to live together upon it.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      The journey continues not toward new destinations, but toward clearer understanding.
    </p>
  </div>
);

const contentFR = (
  <div className="space-y-8">
    <h2 className="font-playfair text-3xl font-bold text-charcoal mt-12">De la traduction à l'analyse</h2>

    <p className="text-charcoal/80 leading-relaxed">
      Ma vie professionnelle a commencé par les langues, mais les langues n'ont jamais été la destination. Elles ont été un point d'entrée vers quelque chose de plus grand : comprendre comment les sociétés s'organisent, comment les institutions fonctionnent, et comment les civilisations coexistent sur une planète partagée.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      Élevée en France, j'ai d'abord suivi un parcours scientifique avant de me tourner vers les langues à l'adolescence — l'anglais et l'espagnol d'abord, puis le russe, puis plus tard l'étude du chinois aux côtés de la formation en traduction. Ce changement ne représentait pas un rejet de la science mais plutôt une expansion de la curiosité : passer des équations aux systèmes humains.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      À partir de dix-neuf ans, le voyage est devenu continu et pratique plutôt que romantique. Les étés ont été passés à travailler à l'étranger — d'abord comme femme de chambre à Édimbourg, puis exploitant une arcade en Californie, travaillant dans le commerce de détail à la Statue de la Liberté, étudiant à Londres via Erasmus, et complétant ma formation en traduction en me déplaçant entre la France, New York, Madrid et Montréal.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      Ce n'étaient pas des voyages entrepris pour les loisirs. C'étaient des exercices précoces d'adaptation — apprendre comment les sociétés fonctionnent à partir de la vie quotidienne. La traduction a offert une mobilité professionnelle, mais le voyage a fourni l'éducation.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      Au fil du temps, le centre de gravité s'est déplacé : moins d'intérêt pour la médiation linguistique elle-même, et plus pour observer comment les institutions, les économies et les cultures fonctionnent en pratique.
    </p>

    <h2 className="font-playfair text-3xl font-bold text-charcoal mt-12">L'observation plutôt que le tourisme</h2>

    <p className="text-charcoal/80 leading-relaxed">
      Pour moi, le voyage n'a jamais été principalement une question de destinations. Il est devenu une méthode d'enquête. La fluidité dans les langues locales était rarement la réalité. La plupart des rencontres se faisaient par l'anglais rudimentaire, les gestes, les repas partagés, ou de simples actes de coopération. La compréhension émergeait non pas de la conversation parfaite mais de la présence — regarder les marchés s'ouvrir à l'aube, observer les infrastructures, le comportement public, l'ordre institutionnel, ou les tensions sociales visibles dans les routines quotidiennes.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      L'observation s'est avérée plus révélatrice que le dialogue. On apprend rapidement que les sociétés communiquent par des modèles : les systèmes de transport, les formes de logement, l'utilisation de l'espace public, les attitudes envers l'autorité, l'intendance environnementale, ou l'improvisation économique. Ces éléments révèlent comment les communautés s'adaptent à la géographie, à l'histoire et aux changements technologiques.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      Le voyage est devenu une recherche sur le terrain sans désignation formelle.
    </p>

    <h2 className="font-playfair text-3xl font-bold text-charcoal mt-12">Formation professionnelle précoce sur plusieurs continents</h2>

    <p className="text-charcoal/80 leading-relaxed">
      Avant d'émigrer, l'Europe et l'Amérique du Nord ont formé le premier cadre comparatif. Le travail à Dublin en tant que spécialiste en localisation chez Microsoft m'a exposée à la mondialisation au niveau opérationnel — comment les entreprises technologiques traduisent non seulement les logiciels mais aussi la culture organisationnelle entre les juridictions.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      Peu après, j'ai émigré au Canada, arrivant par cargo. Ce déménagement a marqué une transformation décisive. La traduction indépendante m'a permis une mobilité géographique dans tout le pays : le Québec, les régions du Nord, les villes des Prairies, la Côte-Ouest et les communautés éloignées. Le Canada n'était pas simplement un autre pays rencontré pendant le voyage. C'est devenu un sentiment d'appartenance civique.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      Devenir Canadienne signifiait rejoindre une société tentant quelque chose d'historiquement rare : un État multiculturel fonctionnant où la diversité n'est pas théorique mais administrative, sociale et quotidienne. Vivre au sein de ce cadre a produit une gratitude durable et un intérêt intellectuel pour la façon dont les sociétés plurielles maintiennent la cohésion.
    </p>

    <h2 className="font-playfair text-3xl font-bold text-charcoal mt-12">Le voyage comme recherche sur le terrain</h2>

    <p className="text-charcoal/80 leading-relaxed">
      Une fois la stabilité professionnelle obtenue, le voyage s'est élargi en exploration mondiale soutenue. La participation à une caravane médicale au Maroc a été une première confrontation avec les stéréotypes hérités et la complexité des identités nord-africaines. Une expédition en 4×4 à travers la Mauritanie a présenté les réalités de la géographie façonnant la civilisation. Les voyages prolongés en voiture et en train dans les îles britanniques ont révélé les contrastes économiques régionaux au sein des économies avancées.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      L'Asie a marqué un tournant. Un voyage de dix mois commençant à Hong Kong et en Asie du Sud-Est s'est transformé en résidence prolongée et en études en Chine, incluant des mois à Shanghai et des milliers de kilomètres parcourus en train à travers le pays. Le mouvement a continué via le Japon, la Mongolie, le Tibet, et finalement le Transsibérien de retour en Europe.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      Les retours ultérieurs en Sibérie ont confirmé une fascination intellectuelle profonde pour les régions frontalières — des endroits où l'environnement, les infrastructures et le pouvoir d'État se croisent visiblement.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      Les années suivantes ont étendu la carte observationnelle :
    </p>

    <ul className="space-y-2 ml-4 text-charcoal/80">
      <li className="flex gap-2"><span className="text-sand font-bold">•</span> <span>Voyages gemmologiques reliant la géologie, les réseaux commerciaux et les marchés mondiaux</span></li>
      <li className="flex gap-2"><span className="text-sand font-bold">•</span> <span>Voyages prolongés en Australie et Nouvelle-Zélande</span></li>
      <li className="flex gap-2"><span className="text-sand font-bold">•</span> <span>Voyage en Amérique du Sud en bus et en train à travers le Brésil, l'Argentine, le Chili et l'Uruguay</span></li>
      <li className="flex gap-2"><span className="text-sand font-bold">•</span> <span>Séjours prolongés et répétés au Japon axés sur l'observation lente</span></li>
      <li className="flex gap-2"><span className="text-sand font-bold">•</span> <span>Exploration terrestre à travers les centres institutionnels et historiques de l'Europe</span></li>
      <li className="flex gap-2"><span className="text-sand font-bold">•</span> <span>Voyages en train transcontinentaux en Amérique du Nord</span></li>
      <li className="flex gap-2"><span className="text-sand font-bold">•</span> <span>Périodes de résidence prolongée à Séoul après la pandémie</span></li>
    </ul>

    <p className="text-charcoal/80 leading-relaxed mt-6">
      Sur des décennies, le mouvement a de plus en plus suivi un principe constant : voyager lentement, voler peu autant que possible, et rester assez longtemps pour que les modèles émergent.
    </p>

    <img src={IMAGE_1} alt="Voyages et observation sur plusieurs continents" className="w-full rounded-lg my-8" />

    <h2 className="font-playfair text-3xl font-bold text-charcoal mt-12">Les civilisations vues du terrain</h2>

    <p className="text-charcoal/80 leading-relaxed">
      Ce que le voyage soutenu a révélé est simple mais souvent oublié : les civilisations sont des réponses écologiques. La géographie, le climat, les ressources et la mémoire historique façonnent les institutions bien plus profondément que l'idéologie seule. Les marchés en Asie du Sud-Est, les réseaux ferroviaires au Japon, les économies de ressources au Canada, les régions post-industrielles en Europe, ou les colonies frontalières en Sibérie démontrent tous des variations du même projet humain — organiser la vie sous des contraintes.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      La géopolitique, vue de cette perspective, cesse d'être une compétition abstraite entre États. Elle devient l'interaction de sociétés tentant de sécuriser la stabilité, la dignité et la continuité. L'observation directe complique les récits simplifiés. Aucune région ne correspond facilement aux catégories externes de succès ou d'échec. Partout, l'adaptation est en cours.
    </p>

    <h2 className="font-playfair text-3xl font-bold text-charcoal mt-12">L'émergence d'une pratique analytique</h2>

    <p className="text-charcoal/80 leading-relaxed">
      Des années à traduire des documents institutionnels pour des organisations fédérales canadiennes ont fourni une éducation parallèle : exposition à la façon dont les gouvernements pensent, écrivent et prennent des décisions. La traduction exigeait de la précision ; l'analyse exigeait de la synthèse.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      Graduellement, l'intérêt professionnel s'est déplacé vers la recherche, la rédaction institutionnelle et la réflexion analytique — examinant la géopolitique, les systèmes de ressources, la transformation technologique et l'évolution de la position du Canada dans un ordre mondial changeant. Le voyage a fourni l'intuition empirique. Le travail institutionnel a fourni la discipline méthodologique. Ensemble, ils ont formé la base d'une voix analytique ancrée non seulement dans la lecture mais dans la comparaison vécue entre les sociétés.
    </p>

    <h2 className="font-playfair text-3xl font-bold text-charcoal mt-12">Le Canada comme ancre intellectuelle</h2>

    <p className="text-charcoal/80 leading-relaxed">
      Après des décennies de mobilité, le Canada reste l'ancre intellectuelle de cette trajectoire. Le pays représente une expérience en cours : équilibrer la vaste géographie, la richesse en ressources, l'immigration, les réalités autochtones et l'intégration mondiale tout en maintenant la stabilité démocratique.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      Devenir Canadienne est expérimenté moins comme une arrivée que comme une participation à un projet civique collectif. La coexistence de multiples identités au sein d'un cadre institutionnel fonctionnant continue d'informer à la fois l'analyse professionnelle et la gratitude personnelle. Dans un monde de plus en plus défini par la fragmentation, le Canada démontre que la diversité peut être organisée administrativement plutôt que simplement célébrée rhétoriquement.
    </p>

    <img src={IMAGE_2} alt="Le Canada comme ancre intellectuelle" className="w-full rounded-lg my-8" />

    <h2 className="font-playfair text-3xl font-bold text-charcoal mt-12">Continuer le travail</h2>

    <p className="text-charcoal/80 leading-relaxed">
      Le voyage aujourd'hui sert un but différent de celui de la jeunesse. Ce n'est plus une exploration pour elle-même mais une extension de la recherche. L'observation, la rédaction, la cartographie et l'analyse convergent maintenant en une seule pratique : tenter de comprendre comment l'humanité habite la Terre — comment les civilisations s'adaptent aux changements technologiques, aux contraintes environnementales et aux structures géopolitiques changeantes.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      L'objectif n'est pas l'expertise sur les lieux mais l'attention aux modèles. La planète reste le sujet central : ses paysages, ses cultures, ses institutions, et l'extraordinaire diversité des tentatives humaines de vivre ensemble sur celle-ci.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      Le voyage continue non pas vers de nouvelles destinations, mais vers une compréhension plus claire.
    </p>
  </div>
);

const meta = {
  en: {
    title: "Travel, Observation, and the Making of an Institutional Analyst",
    category: 'Observations',
    date: 'April 2026',
    readTime: '10 min read',
    keyTakeaways: [
      { point: 'Travel as observation—not tourism—provides insights into how societies function and adapt' },
      { point: 'Language is worldview; understanding how different cultures think shapes understanding of geopolitics' },
      { point: 'Geopolitics is lived experience; understanding requires direct observation and human connection' },
      { point: 'Economic systems and institutions are human-scale; understanding them requires understanding people' },
      { point: 'The world is more complex and resilient than any single narrative suggests' },
    ],
    relatedArticles: [
      { title: 'Navigating Career Change: Translator to Analyst', category: 'Notes', slug: 'career-change' },
      { title: 'Canada in the Multipolar World', category: 'Signals', slug: 'canada-multipolar' },
    ],
  },
  fr: {
    title: "Récits de voyage : perspectives d'un traducteur",
    category: 'Observations',
    date: 'Février 2026',
    readTime: '10 min de lecture',
    keyTakeaways: [
      { point: "Le voyage comme observation — et non comme tourisme — offre des perspectives sur le fonctionnement et l'adaptation des sociétés" },
      { point: "La langue est une vision du monde ; comprendre comment les différentes cultures pensent façonne la compréhension de la géopolitique" },
      { point: "La géopolitique est une expérience vécue ; la compréhension exige une observation directe et une connexion humaine" },
      { point: "Les systèmes économiques et les institutions sont à l'échelle humaine ; les comprendre exige de comprendre les gens" },
      { point: "Le monde est plus complexe et résilient que tout récit unique ne le suggère" },
    ],
    relatedArticles: [
      { title: "Naviguer un changement de carrière : de traducteur à analyste", category: 'Carrière & Transition', slug: 'career-change' },
      { title: 'Le Canada dans un monde multipolaire', category: 'Géopolitique', slug: 'canada-multipolar' },
    ],
  },
};

export default function NotesTravel() {
  const { language } = useLanguage();
  const m = language === 'fr' ? meta.fr : meta.en;
  const content = language === 'fr' ? contentFR : contentEN;

  return (
    <NotesDetailLayout
      title={m.title}
      category={m.category}
      date={m.date}
      readTime={m.readTime}
      heroImage={HERO_IMAGE}
      content={content}
      keyTakeaways={m.keyTakeaways}
      relatedArticles={m.relatedArticles}
    />
  );
}
