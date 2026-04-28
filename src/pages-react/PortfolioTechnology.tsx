/*
 * TransHorizons — Portfolio: AI Governance & Digital Sovereignty
 * Bilingual EN/FR — content driven by useLanguage()
 */

import ProjectDetailLayout from '@/components/ProjectDetailLayout';
import { useLanguage } from '@/contexts/LanguageContext';

const TECHNOLOGY_HERO = '/images/portfolio_technology_hero-bdC44CPWxhrYRSqxK5ohXJ.webp';
const TECHNOLOGY_IMAGE_1 = 'https://images.unsplash.com/photo-1526374965328-7f5ae4e8b08f?w=800&q=80';
const TECHNOLOGY_IMAGE_2 = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80';

const content = {
  en: {
    title: 'AI Governance & Digital Sovereignty',
    subtitle: 'Examining how nations are navigating artificial intelligence regulation and the emerging landscape of digital power',
    category: 'Technology',
    readTime: '13 min',
    introduction:
      'Artificial intelligence is not simply a technology; it is a force reshaping geopolitics, economics, and society. Nations that lead in AI development and deployment will shape the rules governing AI globally. Those that lag risk becoming dependent on foreign technology and subject to foreign governance frameworks. Canada faces a critical juncture: the country has world-class AI research and talent, yet lacks a coherent strategy for AI governance and digital sovereignty. This analysis examines the global AI governance landscape, identifies Canada\'s strategic position, and outlines a path forward.',
    sections: [
      {
        title: 'The AI Governance Challenge',
        content:
          "AI governance is emerging as a central geopolitical issue. The United States, European Union, and China are pursuing distinct regulatory approaches. The EU's AI Act establishes a risk-based regulatory framework, prioritizing consumer protection and fundamental rights. China is implementing sector-specific regulations focused on content control and national security. The United States is pursuing a lighter-touch, innovation-focused approach. These divergent approaches are creating a fragmented global landscape where companies must navigate multiple regulatory regimes, and nations compete for influence over emerging standards. For Canada, this fragmentation presents both challenges and opportunities. The country must develop a coherent AI governance framework that balances innovation, security, and values—while positioning itself as a trusted voice in global AI governance discussions.",
        image: TECHNOLOGY_IMAGE_1,
        imagePosition: 'right' as const,
      },
      {
        title: 'Digital Sovereignty & Strategic Autonomy',
        content:
          "Digital sovereignty—the ability of nations to govern their digital infrastructure, data, and digital services—is becoming central to national security and economic resilience. Today, Canada's digital infrastructure and services are heavily dependent on American and Chinese technology platforms. Canadian data flows through foreign servers. Critical digital services rely on foreign cloud providers. This dependence creates vulnerabilities: foreign governments can access Canadian data, foreign companies can restrict Canadian access to services, and Canada has limited ability to shape the rules governing digital life. Building digital sovereignty does not mean isolating Canada from global digital networks; rather, it means ensuring Canadian control over critical digital infrastructure, data governance, and digital services. This requires investment in Canadian cloud infrastructure, data governance frameworks, and digital security capabilities.",
        image: TECHNOLOGY_IMAGE_2,
        imagePosition: 'left' as const,
      },
      {
        title: "Canada's Path Forward",
        content:
          "Canada should pursue a three-part strategy for AI governance and digital sovereignty. First, develop a comprehensive AI governance framework that establishes clear rules for AI development and deployment, prioritizes transparency and accountability, protects fundamental rights, and positions Canada as a trusted voice in global AI governance. Second, invest in digital infrastructure and capabilities that reduce Canadian dependence on foreign technology platforms and ensure Canadian control over critical data and services. This includes supporting Canadian cloud providers, developing Canadian AI capabilities, and investing in cybersecurity. Third, build international partnerships and coalitions around AI governance principles that reflect Canadian values—democratic governance, human rights, transparency—while creating space for innovation. Canada should work with like-minded nations (EU, Australia, Japan, South Korea) to develop shared AI governance principles and standards.",
      },
    ],
    keyTakeaways: [
      {
        title: 'Governance Divergence',
        description:
          'The US, EU, and China are pursuing distinct AI governance approaches, creating a fragmented global landscape where Canada must navigate multiple frameworks.',
      },
      {
        title: 'Digital Dependence',
        description:
          "Canada's digital infrastructure and services are heavily dependent on foreign technology, creating vulnerabilities and limiting strategic autonomy.",
      },
      {
        title: 'Strategic Opportunity',
        description:
          "Canada can leverage its AI research strength and democratic values to become a trusted voice in global AI governance while building digital sovereignty.",
      },
    ],
    relatedProjects: [
      { id: 'geopolitics', title: 'Canada in the Multipolar World', category: 'Geopolitics' },
      { id: 'resources', title: 'Critical Minerals & the Energy Transition', category: 'Resources' },
    ],
  },
  fr: {
    title: "Gouvernance de l'IA et souveraineté numérique",
    subtitle: "Comment les nations naviguent la réglementation de l'intelligence artificielle et le paysage émergent de la puissance numérique",
    category: 'Technologie',
    readTime: '13 min',
    introduction:
      "L'intelligence artificielle n'est pas simplement une technologie ; c'est une force qui remodèle la géopolitique, l'économie et la société. Les nations qui mènent le développement et le déploiement de l'IA façonneront les règles qui la gouvernent à l'échelle mondiale. Celles qui prennent du retard risquent de devenir dépendantes de technologies étrangères et soumises à des cadres de gouvernance étrangers. Le Canada se trouve à un carrefour critique : le pays dispose d'une recherche et de talents en IA de calibre mondial, mais manque d'une stratégie cohérente en matière de gouvernance de l'IA et de souveraineté numérique. Cette analyse examine le paysage mondial de la gouvernance de l'IA, identifie la position stratégique du Canada et trace une voie à suivre.",
    sections: [
      {
        title: "Le défi de la gouvernance de l'IA",
        content:
          "La gouvernance de l'IA s'impose comme un enjeu géopolitique central. Les États-Unis, l'Union européenne et la Chine poursuivent des approches réglementaires distinctes. La loi européenne sur l'IA établit un cadre réglementaire fondé sur les risques, privilégiant la protection des consommateurs et les droits fondamentaux. La Chine met en œuvre des réglementations sectorielles axées sur le contrôle des contenus et la sécurité nationale. Les États-Unis adoptent une approche plus légère, centrée sur l'innovation. Ces approches divergentes créent un paysage mondial fragmenté où les entreprises doivent naviguer dans de multiples régimes réglementaires et où les nations se disputent l'influence sur les normes émergentes. Pour le Canada, cette fragmentation présente à la fois des défis et des opportunités. Le pays doit développer un cadre cohérent de gouvernance de l'IA qui équilibre innovation, sécurité et valeurs, tout en se positionnant comme une voix de confiance dans les discussions mondiales sur la gouvernance de l'IA.",
        image: TECHNOLOGY_IMAGE_1,
        imagePosition: 'right' as const,
      },
      {
        title: 'Souveraineté numérique et autonomie stratégique',
        content:
          "La souveraineté numérique — la capacité des nations à gouverner leur infrastructure numérique, leurs données et leurs services numériques — devient centrale pour la sécurité nationale et la résilience économique. Aujourd'hui, l'infrastructure et les services numériques du Canada dépendent fortement des plateformes technologiques américaines et chinoises. Les données canadiennes transitent par des serveurs étrangers. Les services numériques critiques reposent sur des fournisseurs d'infonuagique étrangers. Cette dépendance crée des vulnérabilités : des gouvernements étrangers peuvent accéder aux données canadiennes, des entreprises étrangères peuvent restreindre l'accès canadien à leurs services, et le Canada a une capacité limitée à façonner les règles régissant la vie numérique. Bâtir la souveraineté numérique ne signifie pas isoler le Canada des réseaux numériques mondiaux ; cela signifie plutôt assurer le contrôle canadien sur l'infrastructure numérique critique, la gouvernance des données et les services numériques.",
        image: TECHNOLOGY_IMAGE_2,
        imagePosition: 'left' as const,
      },
      {
        title: 'La voie à suivre pour le Canada',
        content:
          "Le Canada devrait poursuivre une stratégie en trois volets pour la gouvernance de l'IA et la souveraineté numérique. Premièrement, développer un cadre complet de gouvernance de l'IA qui établit des règles claires pour le développement et le déploiement de l'IA, privilégie la transparence et la responsabilité, protège les droits fondamentaux et positionne le Canada comme une voix de confiance dans la gouvernance mondiale de l'IA. Deuxièmement, investir dans des infrastructures et des capacités numériques qui réduisent la dépendance canadienne aux plateformes technologiques étrangères et assurent le contrôle canadien sur les données et services critiques. Cela comprend le soutien aux fournisseurs d'infonuagique canadiens, le développement des capacités canadiennes en IA et l'investissement dans la cybersécurité. Troisièmement, bâtir des partenariats et des coalitions internationaux autour de principes de gouvernance de l'IA qui reflètent les valeurs canadiennes — gouvernance démocratique, droits de la personne, transparence — tout en créant un espace pour l'innovation.",
      },
    ],
    keyTakeaways: [
      {
        title: 'Divergence des gouvernances',
        description:
          "Les États-Unis, l'UE et la Chine poursuivent des approches distinctes de gouvernance de l'IA, créant un paysage mondial fragmenté dans lequel le Canada doit naviguer entre plusieurs cadres.",
      },
      {
        title: 'Dépendance numérique',
        description:
          "L'infrastructure et les services numériques du Canada dépendent fortement des technologies étrangères, créant des vulnérabilités et limitant l'autonomie stratégique.",
      },
      {
        title: 'Opportunité stratégique',
        description:
          "Le Canada peut tirer parti de sa force en recherche sur l'IA et de ses valeurs démocratiques pour devenir une voix de confiance dans la gouvernance mondiale de l'IA tout en bâtissant sa souveraineté numérique.",
      },
    ],
    relatedProjects: [
      { id: 'geopolitics', title: 'Le Canada dans un monde multipolaire', category: 'Géopolitique' },
      { id: 'resources', title: 'Minéraux critiques et transition énergétique', category: 'Ressources' },
    ],
  },
};

export default function PortfolioTechnology() {
  const { language } = useLanguage();
  const c = language === 'fr' ? content.fr : content.en;

  return (
    <ProjectDetailLayout
      title={c.title}
      subtitle={c.subtitle}
      heroImage={TECHNOLOGY_HERO}
      category={c.category}
      date="Janvier / January 2026"
      readTime={c.readTime}
      introduction={c.introduction}
      sections={c.sections}
      keyTakeaways={c.keyTakeaways}
      relatedProjects={c.relatedProjects}
    />
  );
}
