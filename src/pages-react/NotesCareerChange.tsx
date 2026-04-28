/**
 * NotesCareerChange.tsx
 * Bilingual EN/FR — content driven by useLanguage()
 * Updated: Career reframing from "translator to analyst" to "translation as training for research"
 */

import NotesDetailLayout from '../components/NotesDetailLayout';
import { useLanguage } from '../contexts/LanguageContext';

// Hero: person at laptop by a bright window — contemplative, forward-looking
const HERO_IMAGE = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1400&q=80';
// IMAGE_3: sunset over water with lighthouses
const IMAGE_3 = '/images/lighthouse-sunset.JPG';
// IMAGE_4: research, curiosity, and knowledge sharing
const IMAGE_4 = '/images/lighthouse-sunset.JPG';

const contentEN = (
  <div className="space-y-8">
    <h1 className="font-playfair text-4xl font-bold text-charcoal mb-2">Notes</h1>
    <h2 className="font-playfair text-3xl font-semibold text-charcoal mb-8 text-charcoal/70">From Translation Toward Research and Analysis</h2>

    <div className="bg-ivory p-6 rounded-lg mb-8 border-l-4 border-sand">
      <h3 className="font-playfair text-2xl font-bold text-charcoal mb-4">Key reflections</h3>
      <ul className="space-y-3 text-charcoal/80">
        <li className="flex gap-3">
          <span className="text-sand font-bold">•</span>
          <span>Long experience in institutional translation fostered curiosity about how public policy, knowledge, and institutions function</span>
        </li>
        <li className="flex gap-3">
          <span className="text-sand font-bold">•</span>
          <span>Working closely with federal departments provided sustained exposure to Canadian public discourse and decision-making environments</span>
        </li>
        <li className="flex gap-3">
          <span className="text-sand font-bold">•</span>
          <span>Research, reading, and contextual understanding gradually became central professional motivations</span>
        </li>
        <li className="flex gap-3">
          <span className="text-sand font-bold">•</span>
          <span>The objective is not to reinvent a career, but to place existing experience in service of deeper understanding and public contribution</span>
        </li>
      </ul>
    </div>

    <p className="text-lg text-charcoal/80 leading-relaxed">
      After more than two decades working as a translator—much of that time collaborating with Canadian federal departments such as Statistics Canada and Natural Resources Canada—I find myself gradually moving toward research, writing, and analysis.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      This transition is not the result of a sudden decision or a rejection of past work. Rather, it emerged slowly from an enduring curiosity: a desire to understand how societies interpret reality, how institutions frame challenges, and how knowledge contributes to collective decision-making.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      Translation placed me close to these processes for many years. Over time, the questions behind the texts became as compelling as the texts themselves.
    </p>

    <hr className="my-8 border-sand/30" />

    <h2 className="font-playfair text-3xl font-bold text-charcoal mt-12">Learning Through Translation</h2>

    <p className="text-charcoal/80 leading-relaxed">
      Translation is often perceived as linguistic conversion. In practice, it involves sustained attention to meaning, context, and intention.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      Working on institutional publications meant engaging daily with public policy discussions, technical reporting, socioeconomic analysis, and governmental communication addressed to Canadians. The task required careful reading, verification of terminology, and constant research to understand unfamiliar subjects.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      Gradually, the work cultivated habits that extend beyond language:
    </p>

    <ul className="space-y-2 text-charcoal/80 ml-6 mb-6">
      <li className="flex gap-3">
        <span className="text-sand font-bold">•</span>
        <span>investigating unfamiliar topics before writing about them</span>
      </li>
      <li className="flex gap-3">
        <span className="text-sand font-bold">•</span>
        <span>tracing concepts across disciplines</span>
      </li>
      <li className="flex gap-3">
        <span className="text-sand font-bold">•</span>
        <span>recognizing how institutions explain uncertainty and complexity</span>
      </li>
      <li className="flex gap-3">
        <span className="text-sand font-bold">•</span>
        <span>approaching information with patience rather than quick conclusions</span>
      </li>
    </ul>

    <p className="text-charcoal/80 leading-relaxed">
      Instead of positioning translation as expertise in any single field, I increasingly see it as long-term training in intellectual curiosity and disciplined inquiry.
    </p>

    <hr className="my-8 border-sand/30" />

    <img src={IMAGE_3} alt="Lighthouse at sunset over calm waters" className="w-full rounded-lg my-8" />

    <h2 className="font-playfair text-3xl font-bold text-charcoal mt-12">A Growing Interest in Research and Understanding</h2>

    <p className="text-charcoal/80 leading-relaxed">
      Years of collaboration with Canadian public institutions offered a privileged vantage point—not as a decision-maker, but as an observer accompanying the production of public knowledge.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      Repeated exposure to statistical analysis, resource policy discussions, and institutional reporting fostered a deeper interest in questions such as:
    </p>

    <ul className="space-y-2 text-charcoal/80 ml-6 mb-6">
      <li className="flex gap-3">
        <span className="text-sand font-bold">•</span>
        <span>How does Canada understand itself through data?</span>
      </li>
      <li className="flex gap-3">
        <span className="text-sand font-bold">•</span>
        <span>How do governments balance evidence, constraints, and public expectations?</span>
      </li>
      <li className="flex gap-3">
        <span className="text-sand font-bold">•</span>
        <span>How do global developments reshape national choices?</span>
      </li>
    </ul>

    <p className="text-charcoal/80 leading-relaxed">
      Extended periods spent abroad almost every year also reinforced this curiosity. Experiencing different societies firsthand encouraged comparison, reflection, and a stronger awareness of Canada's place within an interconnected world.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      The motivation behind my professional transition is therefore simple: to move closer to the processes of researching, understanding, and explaining rather than remaining solely in the role of linguistic intermediary.
    </p>

    <hr className="my-8 border-sand/30" />

    <h2 className="font-playfair text-3xl font-bold text-charcoal mt-12">From Language Work to Analytical Writing</h2>

    <p className="text-charcoal/80 leading-relaxed">
      The shift toward analytical writing feels less like a career change than a gradual reorientation.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      Translation developed certain working habits that naturally support research environments:
    </p>

    <ul className="space-y-2 text-charcoal/80 ml-6 mb-6">
      <li className="flex gap-3">
        <span className="text-sand font-bold">•</span>
        <span>careful reading before forming conclusions</span>
      </li>
      <li className="flex gap-3">
        <span className="text-sand font-bold">•</span>
        <span>respect for evidence and sources</span>
      </li>
      <li className="flex gap-3">
        <span className="text-sand font-bold">•</span>
        <span>comfort working with complex documentation</span>
      </li>
      <li className="flex gap-3">
        <span className="text-sand font-bold">•</span>
        <span>commitment to clarity when addressing non-specialist audiences</span>
      </li>
    </ul>

    <p className="text-charcoal/80 leading-relaxed">
      I do not approach analysis as someone claiming authority, but as someone accustomed to learning continuously. The aim is to contribute thoughtful, well-researched perspectives grounded in careful observation.
    </p>

    <hr className="my-8 border-sand/30" />

    <h2 className="font-playfair text-3xl font-bold text-charcoal mt-12">Institutional Experience as Context, Not Authority</h2>

    <p className="text-charcoal/80 leading-relaxed">
      Collaborating for many years with Canadian federal organizations provided familiarity with institutional culture, terminology, and communication practices. This experience does not confer insider status or policy expertise, but it offers contextual understanding of how public institutions operate and communicate with citizens.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      It also strengthened an appreciation for public service itself: the quiet, often invisible effort required to produce reliable information for Canadians.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      That experience contributes to my current objective—to support, even modestly, the production and communication of knowledge that helps society understand complex challenges.
    </p>

    <hr className="my-8 border-sand/30" />

    <img src={IMAGE_4} alt="Research and knowledge sharing" className="w-full rounded-lg my-8" />

    <h2 className="font-playfair text-3xl font-bold text-charcoal mt-12">Motivation: Curiosity and Public Contribution</h2>

    <p className="text-charcoal/80 leading-relaxed">
      At the centre of this transition lies a personal motivation rather than a professional label.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      I am trying to move toward roles where curiosity, research, and writing can contribute to something larger than individual projects. My interest is particularly oriented toward subjects that shape Canada's future: global change, resources, technology, governance, and international dynamics.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      The ambition is not to present definitive answers, but to participate in collective understanding—to ask careful questions, examine evidence responsibly, and communicate insights accessibly.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      If this path succeeds, it will likely be through incremental contributions rather than dramatic change. That perspective feels appropriate. Public knowledge advances through many small efforts accumulated over time.
    </p>

    <hr className="my-8 border-sand/30" />

    <h2 className="font-playfair text-3xl font-bold text-charcoal mt-12">Looking Forward</h2>

    <p className="text-charcoal/80 leading-relaxed">
      Professional paths do not always follow clear boundaries. Skills developed in one domain sometimes reveal unexpected relevance elsewhere.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      After many years devoted to language, I am exploring how those same habits—careful reading, sustained research, respect for nuance, and clear writing—might support research institutes, public organizations, or analytical teams.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      The objective is modest but sincere:
    </p>

    <ul className="space-y-2 text-charcoal/80 ml-6 mb-6">
      <li className="flex gap-3">
        <span className="text-sand font-bold">•</span>
        <span>to continue learning</span>
      </li>
      <li className="flex gap-3">
        <span className="text-sand font-bold">•</span>
        <span>to better understand the world and Canada's role within it</span>
      </li>
      <li className="flex gap-3">
        <span className="text-sand font-bold">•</span>
        <span>to contribute, in whatever capacity proves useful, to informed public dialogue and a constructive future</span>
      </li>
    </ul>
  </div>
);

const contentFR = (
  <div className="space-y-8">
    <h1 className="font-playfair text-4xl font-bold text-charcoal mb-2">Notes</h1>
    <h2 className="font-playfair text-3xl font-semibold text-charcoal mb-8 text-charcoal/70">De la traduction vers la recherche et l'analyse</h2>

    <div className="bg-ivory p-6 rounded-lg mb-8 border-l-4 border-sand">
      <h3 className="font-playfair text-2xl font-bold text-charcoal mb-4">Réflexions clés</h3>
      <ul className="space-y-3 text-charcoal/80">
        <li className="flex gap-3">
          <span className="text-sand font-bold">•</span>
          <span>Une longue expérience en traduction institutionnelle a nourri la curiosité sur le fonctionnement des politiques publiques, de la connaissance et des institutions</span>
        </li>
        <li className="flex gap-3">
          <span className="text-sand font-bold">•</span>
          <span>Collaborer étroitement avec les ministères fédéraux a fourni une exposition soutenue au discours public canadien et aux environnements de prise de décision</span>
        </li>
        <li className="flex gap-3">
          <span className="text-sand font-bold">•</span>
          <span>La recherche, la lecture et la compréhension contextuelle sont progressivement devenues les motivations professionnelles centrales</span>
        </li>
        <li className="flex gap-3">
          <span className="text-sand font-bold">•</span>
          <span>L'objectif n'est pas de réinventer une carrière, mais de mettre l'expérience existante au service d'une compréhension plus profonde et d'une contribution publique</span>
        </li>
      </ul>
    </div>

    <p className="text-lg text-charcoal/80 leading-relaxed">
      Après plus de deux décennies de travail en tant que traductrice — une grande partie de ce temps en collaboration avec des ministères fédéraux canadiens tels que Statistique Canada et Ressources naturelles Canada — je me retrouve progressivement à me tourner vers la recherche, la rédaction et l'analyse.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      Cette transition n'est pas le résultat d'une décision soudaine ou d'un rejet du travail passé. Elle a plutôt émergé lentement d'une curiosité persistante : le désir de comprendre comment les sociétés interprètent la réalité, comment les institutions encadrent les défis, et comment la connaissance contribue à la prise de décision collective.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      La traduction m'a placée près de ces processus pendant de nombreuses années. Au fil du temps, les questions derrière les textes sont devenues aussi captivantes que les textes eux-mêmes.
    </p>

    <hr className="my-8 border-sand/30" />

    <h2 className="font-playfair text-3xl font-bold text-charcoal mt-12">Apprendre par la traduction</h2>

    <p className="text-charcoal/80 leading-relaxed">
      La traduction est souvent perçue comme une conversion linguistique. En pratique, elle implique une attention soutenue au sens, au contexte et à l'intention.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      Travailler sur des publications institutionnelles signifiait s'engager quotidiennement dans des discussions de politique publique, des rapports techniques, des analyses socioéconomiques et des communications gouvernementales adressées aux Canadiens. La tâche exigeait une lecture attentive, une vérification de la terminologie et une recherche constante pour comprendre des sujets peu familiers.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      Progressivement, le travail a cultivé des habitudes qui vont au-delà de la langue :
    </p>

    <ul className="space-y-2 text-charcoal/80 ml-6 mb-6">
      <li className="flex gap-3">
        <span className="text-sand font-bold">•</span>
        <span>enquêter sur des sujets peu familiers avant d'en écrire</span>
      </li>
      <li className="flex gap-3">
        <span className="text-sand font-bold">•</span>
        <span>tracer des concepts à travers les disciplines</span>
      </li>
      <li className="flex gap-3">
        <span className="text-sand font-bold">•</span>
        <span>reconnaître comment les institutions expliquent l'incertitude et la complexité</span>
      </li>
      <li className="flex gap-3">
        <span className="text-sand font-bold">•</span>
        <span>aborder l'information avec patience plutôt que des conclusions rapides</span>
      </li>
    </ul>

    <p className="text-charcoal/80 leading-relaxed">
      Au lieu de positionner la traduction comme une expertise dans un seul domaine, je la vois de plus en plus comme une formation à long terme en curiosité intellectuelle et en enquête disciplinée.
    </p>

    <hr className="my-8 border-sand/30" />

    <img src={IMAGE_3} alt="Phare au coucher du soleil sur les eaux calmes" className="w-full rounded-lg my-8" />

    <h2 className="font-playfair text-3xl font-bold text-charcoal mt-12">Un intérêt croissant pour la recherche et la compréhension</h2>

    <p className="text-charcoal/80 leading-relaxed">
      Des années de collaboration avec des institutions publiques canadiennes m'ont offert un point de vue privilégié — non pas comme décideur, mais comme observatrice accompagnant la production de la connaissance publique.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      L'exposition répétée à l'analyse statistique, aux discussions sur la politique des ressources et aux rapports institutionnels a favorisé un intérêt plus profond pour des questions telles que :
    </p>

    <ul className="space-y-2 text-charcoal/80 ml-6 mb-6">
      <li className="flex gap-3">
        <span className="text-sand font-bold">•</span>
        <span>Comment le Canada se comprend-il à travers les données ?</span>
      </li>
      <li className="flex gap-3">
        <span className="text-sand font-bold">•</span>
        <span>Comment les gouvernements équilibrent-ils les preuves, les contraintes et les attentes du public ?</span>
      </li>
      <li className="flex gap-3">
        <span className="text-sand font-bold">•</span>
        <span>Comment les développements mondiaux remodèlent-ils les choix nationaux ?</span>
      </li>
    </ul>

    <p className="text-charcoal/80 leading-relaxed">
      Des périodes prolongées passées à l'étranger presque chaque année ont également renforcé cette curiosité. Vivre l'expérience de différentes sociétés directement a encouragé la comparaison, la réflexion et une plus forte conscience de la place du Canada dans un monde interconnecté.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      La motivation derrière ma transition professionnelle est donc simple : me rapprocher des processus de recherche, de compréhension et d'explication plutôt que de rester uniquement dans le rôle d'intermédiaire linguistique.
    </p>

    <hr className="my-8 border-sand/30" />

    <h2 className="font-playfair text-3xl font-bold text-charcoal mt-12">Du travail linguistique à la rédaction analytique</h2>

    <p className="text-charcoal/80 leading-relaxed">
      Le passage vers la rédaction analytique ressemble moins à un changement de carrière qu'à une réorientation progressive.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      La traduction a développé certaines habitudes de travail qui soutiennent naturellement les environnements de recherche :
    </p>

    <ul className="space-y-2 text-charcoal/80 ml-6 mb-6">
      <li className="flex gap-3">
        <span className="text-sand font-bold">•</span>
        <span>une lecture attentive avant de former des conclusions</span>
      </li>
      <li className="flex gap-3">
        <span className="text-sand font-bold">•</span>
        <span>le respect des preuves et des sources</span>
      </li>
      <li className="flex gap-3">
        <span className="text-sand font-bold">•</span>
        <span>le confort de travailler avec une documentation complexe</span>
      </li>
      <li className="flex gap-3">
        <span className="text-sand font-bold">•</span>
        <span>l'engagement envers la clarté lorsqu'on s'adresse à des publics non spécialisés</span>
      </li>
    </ul>

    <p className="text-charcoal/80 leading-relaxed">
      Je n'aborde pas l'analyse comme quelqu'un qui prétend à l'autorité, mais comme quelqu'un habitué à apprendre continuellement. L'objectif est de contribuer des perspectives réfléchies et bien documentées fondées sur l'observation attentive.
    </p>

    <hr className="my-8 border-sand/30" />

    <h2 className="font-playfair text-3xl font-bold text-charcoal mt-12">L'expérience institutionnelle comme contexte, pas autorité</h2>

    <p className="text-charcoal/80 leading-relaxed">
      Collaborer pendant de nombreuses années avec des organisations fédérales canadiennes m'a fourni une familiarité avec la culture institutionnelle, la terminologie et les pratiques de communication. Cette expérience ne confère pas un statut d'initié ou une expertise politique, mais elle offre une compréhension contextuelle de la façon dont les institutions publiques fonctionnent et communiquent avec les citoyens.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      Elle a également renforcé l'appréciation du service public lui-même : l'effort tranquille, souvent invisible, requis pour produire des informations fiables pour les Canadiens.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      Cette expérience contribue à mon objectif actuel — soutenir, même modestement, la production et la communication de connaissances qui aident la société à comprendre les défis complexes.
    </p>

    <hr className="my-8 border-sand/30" />

    <img src={IMAGE_4} alt="Recherche et partage de connaissances" className="w-full rounded-lg my-8" />

    <h2 className="font-playfair text-3xl font-bold text-charcoal mt-12">Motivation : curiosité et contribution publique</h2>

    <p className="text-charcoal/80 leading-relaxed">
      Au centre de cette transition se trouve une motivation personnelle plutôt qu'une étiquette professionnelle.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      Je cherche à me rapprocher de rôles où la curiosité, la recherche et la rédaction peuvent contribuer à quelque chose de plus grand que des projets individuels. Mon intérêt est particulièrement orienté vers des sujets qui façonnent l'avenir du Canada : le changement mondial, les ressources, la technologie, la gouvernance et la dynamique internationale.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      L'ambition n'est pas de présenter des réponses définitives, mais de participer à la compréhension collective — poser des questions attentives, examiner les preuves de manière responsable et communiquer les perspectives de manière accessible.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      Si cette voie réussit, ce sera probablement par des contributions progressives plutôt que par un changement dramatique. Cette perspective semble appropriée. La connaissance publique progresse par de nombreux petits efforts accumulés au fil du temps.
    </p>

    <hr className="my-8 border-sand/30" />

    <h2 className="font-playfair text-3xl font-bold text-charcoal mt-12">Vers l'avant</h2>

    <p className="text-charcoal/80 leading-relaxed">
      Les trajectoires professionnelles ne suivent pas toujours des frontières claires. Les compétences développées dans un domaine révèlent parfois une pertinence inattendue ailleurs.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      Après de nombreuses années consacrées à la langue, j'explore comment ces mêmes habitudes — lecture attentive, recherche soutenue, respect de la nuance et écriture claire — pourraient soutenir des instituts de recherche, des organisations publiques ou des équipes analytiques.
    </p>

    <p className="text-charcoal/80 leading-relaxed">
      L'objectif est modeste mais sincère :
    </p>

    <ul className="space-y-2 text-charcoal/80 ml-6 mb-6">
      <li className="flex gap-3">
        <span className="text-sand font-bold">•</span>
        <span>continuer à apprendre</span>
      </li>
      <li className="flex gap-3">
        <span className="text-sand font-bold">•</span>
        <span>mieux comprendre le monde et la place du Canada en son sein</span>
      </li>
      <li className="flex gap-3">
        <span className="text-sand font-bold">•</span>
        <span>contribuer, de la manière qui s'avère utile, au dialogue public éclairé et à un avenir constructif</span>
      </li>
    </ul>
  </div>
);

export default function NotesCareerChange() {
  const { language } = useLanguage();

  return (
    <NotesDetailLayout
      title={language === 'fr' ? 'De la traduction vers la recherche et l\'analyse' : 'From Translation Toward Research and Analysis'}
      category={language === 'fr' ? 'Notes' : 'Notes'}
      readTime={language === 'fr' ? '8 min de lecture' : '8 min read'}
      date="March 2026"
      heroImage={HERO_IMAGE}
      content={language === 'fr' ? contentFR : contentEN}
    />
  );
}
