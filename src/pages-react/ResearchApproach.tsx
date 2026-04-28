import { useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Zap, Map, CheckCircle2, AlertCircle, BookOpen, Layers, Target, Settings } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const content = {
  en: {
    pageTitle: "Research Approach",
    backLabel: "Back to home",
    sections: {
      method: {
        heading: "Research Approach",
        label: "Overview",
        p1: "TransHorizons is an independent analytical initiative focused on understanding how large-scale systems shape geopolitical, economic, and technological outcomes.",
        p2: "Research is based primarily on publicly available institutional and authoritative sources, including national statistical agencies, federal departments, international organizations, and peer-reviewed research.",
        p3: "The approach is grounded in the analysis of structural dynamics rather than isolated events, with particular attention to Canada’s position within evolving global systems.",
        p4: "Research combines institutional documentation, cross-domain synthesis, and continuous monitoring of international developments to produce structured, accessible analysis.",
      },
      framework: {
        heading: "Analytical Scope",
        intro: "The work examines interconnected systems across four primary domains.",
        scope: {
          heading: "Analytical Scope",
          intro: "The work examines interconnected systems across four primary domains:",
          items: [
            { title: "Structural systems", desc: "Long-term patterns shaping Canada's development, including geography, resource orientation, and integration into global markets." },
            { title: "Material systems", desc: "Resource-based systems such as energy, critical minerals, and forest ecosystems, including their role in industrial and environmental transformations." },
            { title: "Technological systems", desc: "Digital infrastructure, artificial intelligence, and governance frameworks shaping emerging forms of economic and political power." },
            { title: "Economic and trade systems", desc: "Trade relationships, industrial policy, and supply chain dynamics, particularly within North American and transatlantic contexts." },
          ],
          closing: "These domains are treated as interdependent components of a broader system rather than as separate areas of analysis.",
        },
        sources: {
          heading: "Sources Monitored",
          intro: "Research is based primarily on publicly available institutional and authoritative sources, including:",
          items: [
            "national statistical agencies (e.g., Statistics Canada);",
            "federal departments and agencies (e.g., Natural Resources Canada);",
            "international organizations (e.g., International Energy Agency, OECD, World Bank);",
            "peer-reviewed academic research and scientific publications;",
            "official reports, policy documents, and technical publications.",
          ],
          closing: "These sources are supplemented by ongoing monitoring of geopolitical developments, economic indicators, and sector-specific data.",
        },
        process: {
          heading: "Update Rhythm",
          intro: "Research outputs follow a mixed rhythm:",
          items: [
            { bold: "Analytical essays", rest: " (long-form): periodic, focused on structural themes;" },
            { bold: "Research notes", rest: " (short-form): more frequent, reflecting ongoing developments;" },
            { bold: "Maps and visualizations", rest: ": updated as relevant data becomes available." },
          ],
          closing: "This structure supports both long-term analysis and responsiveness to emerging developments.",
        },
      },
      mapping: {
        heading: "Mapping Methodology",
        p1: "Geospatial analysis is used to visualize system structures and relationships.",
        p2: "Maps and visual outputs focus on:",
        items: [
          "resource distribution and infrastructure networks;",
          "supply chain configurations;",
          "geopolitical and regional dynamics.",
        ],
        closing: "Mapping is used as a complementary tool to support analytical interpretation rather than as an end in itself.",
      },
      traceability: {
        heading: "Source Traceability & Verification",
        p1: "This research practice places strong emphasis on the traceability of information.",
        p2: "All analysis is grounded in sources that can be:",
        items: ["Clearly identified", "Independently verified", "Traced to their original institutional origin"],
        closing: "Analytical outputs are not based on unreferenced synthesis. Where intermediary tools are used, underlying sources are systematically identified and cross-checked against primary documentation.",
      },
      tools: {
        heading: "Use of Analytical Tools",
        p1: "Analytical tools, including AI-assisted systems, are integrated into the research and drafting process as support instruments.",
        p2: "They are used to:",
        usedItems: [
          "explore lines of inquiry;",
          "structure and organize complex information;",
          "support drafting and synthesis.",
        ],
        p3: "However:",
        howeverItems: [
          "they are not treated as sources;",
          "they do not determine analytical conclusions;",
          "outputs are not accepted without verification.",
        ],
        p4: "All content is systematically reviewed, validated, and grounded in traceable documentation.",
        p5: "The analytical responsibility — including source selection, interpretation, and final validation — remains fully with the author.",
        closing: "The use of AI expands the capacity to explore complex systems, while increasing the importance of verification, coherence, and accountability.",
      },
      principles: {
        heading: "Analytical Principles",
        intro: "The analytical process follows a set of guiding principles:",
        items: [
          { title: "Structural focus", desc: "Emphasis on structural dynamics and system-level interactions rather than short-term events or commentary" },
          { title: "Cross-domain synthesis", desc: "Integration of economic, geopolitical, environmental, and technological perspectives" },
          { title: "Comparative observation", desc: "Use of international comparisons to identify structural differences and patterns" },
          { title: "Clarity and accessibility", desc: "Translation of complex material into structured analysis accessible to non-specialists" },
          { title: "Source transparency", desc: "Reliance on traceable, verifiable information, with full documentation available upon request" },
        ],
      },
      limits: {
        heading: "Limits & Uncertainty",
        p1: "This work is based on open-source information and is subject to data limitations, uncertainty, and the constraints of independent research.",
        p2: "Limitations include:",
        items: [
          "incomplete or delayed data in certain domains;",
          "uncertainty in long-term projections, particularly in climate and technological systems;",
          "constraints inherent to independent research without access to proprietary datasets.",
        ],
        closing: "Where uncertainty exists, it is treated as part of the analytical context rather than eliminated.",
      },
      referencing: {
        heading: "Referencing Approach",
        sources: {
          heading: "Sources & Documentation",
          p1: "Analysis is grounded in publicly available institutional sources. Rather than relying on exhaustive academic referencing, sources are integrated into the analytical narrative.",
          p2: "Key institutions, datasets, and publications are identified where relevant to ensure transparency and traceability.",
        },
        citation: {
          heading: "Citation Philosophy",
          intro: "The objective is to balance readability and traceability:",
          items: [
            "References anchor analysis rather than document every input",
            "Priority is given to primary and institutional sources",
            "Over-citation is avoided to preserve clarity",
            "Synthesis may integrate multiple sources without listing each individually",
          ],
          closing: "This approach reflects practices used in policy analysis and applied research environments.",
        },
      },
      position: {
        heading: "Position",
        p1: "TransHorizons operates at the intersection of institutional analytical standards and independent research.",
        p2: "The objective is to contribute structured, source-based analysis that clarifies complex global dynamics without relying on institutional affiliation or proprietary data access.",
      },
    },
  },
  fr: {
    pageTitle: "Approche de recherche",
    backLabel: "Retour à l'accueil",
    sections: {
      method: {
        heading: "Méthode et approche",
        label: "Pratique analytique",
        p1: "TransHorizons applique une pratique analytique structurée, ancrée dans la documentation institutionnelle, la recherche multidisciplinaire et le suivi à long terme des systèmes géopolitiques, des ressources et de la technologie.",
        p2: "Cette initiative s'appuie sur plus de vingt-cinq ans d'engagement auprès d'institutions fédérales canadiennes, notamment Statistique Canada et Ressources naturelles Canada, où le travail analytique est fondé sur des données documentées, des systèmes statistiques et des environnements de recherche axés sur les politiques.",
        p3: "L'objectif n'est pas le commentaire, mais la clarification : traduire les connaissances institutionnelles dispersées en analyses structurées des systèmes mondiaux.",
        p4: "La recherche combine documentation institutionnelle, synthèse interdisciplinaire et suivi continu des développements internationaux pour produire une analyse structurée et accessible.",
      },
      framework: {
        heading: "Cadre analytique",
        intro: "Un cadre analytique cohérent guide l'ensemble des travaux de recherche et des publications.",
        scope: {
          heading: "Périmètre analytique",
          intro: "La recherche porte sur les dynamiques structurelles à long terme plutôt que sur les développements à court terme. Les domaines principaux comprennent :",
          items: [
            { title: "Systèmes structurels", desc: "Dynamiques à long terme façonnant le développement du Canada, notamment la géographie, l'orientation vers les ressources et l'intégration aux marchés mondiaux." },
            { title: "Systèmes matériels", desc: "Systèmes fondés sur les ressources tels que l'énergie, les minéraux critiques et les écosystèmes forestiers, y compris leur rôle dans les transformations industrielles et environnementales." },
            { title: "Systèmes technologiques", desc: "Infrastructure numérique, intelligence artificielle et cadres de gouvernance façonnant les formes émergentes de pouvoir économique et politique." },
            { title: "Systèmes économiques et commerciaux", desc: "Relations commerciales, politique industrielle et dynamiques des chaînes d'approvisionnement, notamment dans les contextes nord-américain et transatlantique." },
          ],
          closing: "Ces domaines sont traités comme des composantes interdépendantes d'un système plus large plutôt que comme des domaines d'analyse distincts.",
        },
        sources: {
          heading: "Sources surveillées",
          intro: "L'analyse repose principalement sur des sources institutionnelles et primaires accessibles au public, notamment :",
          items: [
            "Les ministères et organismes fédéraux canadiens",
            "Les organisations internationales (p. ex., Agence internationale de l'énergie, OCDE, Banque mondiale)",
            "Les agences statistiques nationales et les ensembles de données officiels",
            "La documentation parlementaire et les documents de politique",
            "Les publications académiques et scientifiques",
            "Les rapports sectoriels et industriels",
            "Le renseignement en sources ouvertes",
          ],
          closing: "La priorité est accordée aux documents vérifiables produits dans des cadres institutionnels responsables.",
        },
        process: {
          heading: "Processus de recherche et rythme de mise à jour",
          intro: "La recherche suit un modèle de surveillance continue :",
          items: [
            "Suivi continu des publications et ensembles de données institutionnels",
            "Comparaison interdisciplinaire et identification de schémas",
            "Élaboration de notes analytiques et d'observations intermédiaires",
            "Synthèse périodique sous forme d'essais et de rapports structurés",
          ],
          closing: "Les publications sont diffusées lorsque la cohérence analytique est atteinte, plutôt que selon un calendrier éditorial fixe.",
        },
      },
      mapping: {
        heading: "Méthodologie cartographique",
        p1: "La cartographie est utilisée comme outil analytique plutôt que comme simple complément visuel.",
        p2: "Les cartes visent à :",
        items: [
          "Révéler les relations spatiales entre les ressources, les infrastructures et les dynamiques géopolitiques",
          "Synthétiser des ensembles de données complexes en systèmes lisibles",
          "Soutenir l'analyse comparative entre régions",
          "Illustrer les schémas structurels à long terme",
        ],
        closing: "Elles combinent des données accessibles au public, des sources institutionnelles et une interprétation indépendante.",
      },
      traceability: {
        heading: "Traçabilité et vérification des sources",
        p1: "Cette pratique de recherche accorde une grande importance à la traçabilité de l'information.",
        p2: "Toute analyse est fondée sur des sources pouvant être :",
        items: [
          "Clairement identifiées",
          "Vérifiées de manière indépendante",
          "Retracées jusqu'à leur origine institutionnelle",
        ],
        closing: "Les productions analytiques ne reposent pas sur des synthèses non référencées. Lorsque des outils intermédiaires sont utilisés, les sources sous-jacentes sont systématiquement identifiées et recoupées avec la documentation primaire.",
      },
      tools: {
        heading: "Utilisation des outils analytiques",
        p1: "Les outils analytiques, y compris les systèmes assistés par intelligence artificielle, sont intégrés au processus de recherche et de rédaction en tant qu'instruments de soutien.",
        p2: "Ils sont utilisés pour :",
        usedItems: [
          "Explorer des pistes d'analyse",
          "Organiser et structurer l'information",
          "Soutenir la rédaction du contenu analytique",
        ],
        p3: "Cependant :",
        howeverItems: [
          "Ils ne sont pas traités comme des sources",
          "Ils ne déterminent pas les conclusions analytiques",
          "Les résultats ne sont pas acceptés sans vérification",
        ],
        p4: "Tout le contenu est systématiquement revu, validé et ancré dans une documentation traçable.",
        p5: "La responsabilité analytique — y compris la sélection des sources, l'interprétation et la validation finale — reste entièrement celle de l'auteure.",
        closing: "Dans ce contexte, le recours à l'IA ne remplace pas le travail analytique. Il déplace l'accent vers la vérification, la structuration et la responsabilité.",
      },
      principles: {
        heading: "Principes analytiques",
        intro: "L'approche analytique repose sur un ensemble de principes directeurs :",
        items: [
          { title: "Ancrage institutionnel", desc: "Appui sur des sources documentées et vérifiables" },
          { title: "Analyse structurelle", desc: "Accent sur les systèmes et transformations à long terme" },
          { title: "Synthèse interdisciplinaire", desc: "Intégration de la géopolitique, des ressources, de l'économie et de la technologie" },
          { title: "Observation comparative", desc: "Identification de schémas entre régions et systèmes" },
          { title: "Clarté plutôt que complexité", desc: "Communication accessible sans perte de rigueur" },
        ],
      },
      limits: {
        heading: "Limites et incertitude",
        p1: "Les systèmes géopolitiques, économiques et technologiques sont par nature complexes et en évolution.",
        p2: "En conséquence :",
        items: [
          "L'analyse privilégie l'interprétation structurelle plutôt que la prédiction à court terme",
          "Les conclusions demeurent provisoires et susceptibles d'être révisées",
          "Les limites des données et les contraintes de visibilité sont reconnues",
          "La cartographie et la synthèse impliquent des choix d'interprétation",
        ],
        closing: "L'incertitude est traitée comme une condition à rendre explicite, non à éliminer.",
      },
      referencing: {
        heading: "Approche de référencement",
        sources: {
          heading: "Sources et documentation",
          p1: "L'analyse repose sur des sources institutionnelles accessibles au public. Plutôt que de s'appuyer sur un référencement académique exhaustif, les sources sont intégrées dans la narration analytique.",
          p2: "Les institutions, ensembles de données et publications clés sont identifiés lorsque pertinent, afin d'assurer la transparence et la traçabilité.",
        },
        citation: {
          heading: "Philosophie de citation",
          intro: "L'objectif est d'équilibrer lisibilité et traçabilité :",
          items: [
            "Les références ancrent l'analyse plutôt que de documenter chaque source",
            "La priorité est accordée aux sources primaires et institutionnelles",
            "La surcitation est évitée pour préserver la clarté",
            "La synthèse peut intégrer plusieurs sources sans les énumérer individuellement",
          ],
          closing: "Cette approche reflète les pratiques utilisées dans les environnements d'analyse des politiques et de recherche appliquée.",
        },
      },
      position: {
        heading: "Position",
        p1: "TransHorizons opère en tant qu'initiative de recherche indépendante cherchant à s'aligner sur les normes analytiques institutionnelles tout en conservant la souplesse de l'enquête indépendante.",
        p2: "L'objectif est de contribuer à une analyse structurée et fondée sur des données probantes à une compréhension plus large des transformations mondiales affectant le Canada et le système international.",
      },
    },
  },
};

export default function ResearchApproach() {
  const [, setLocation] = useLocation();
  const { language } = useLanguage();
  const c = language === 'fr' ? content.fr : content.en;
  const s = c.sections;

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header Navigation */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container py-4 flex items-center gap-4">
          <button
            onClick={() => setLocation("/")}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label={c.backLabel}
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900">{c.pageTitle}</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          {/* Introduction Section */}
          <section className="mb-16">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-slate-600" />
                {s.method.heading}
              </h2>
              <p className="text-lg text-slate-700 leading-relaxed mb-4">
                <span className="font-semibold text-slate-900">{s.method.label}</span>
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">{s.method.p1}</p>
              <p className="border-l-4 border-slate-400 pl-4 text-slate-800 font-medium leading-relaxed mb-4 italic">{s.method.p2}</p>
              <p className="text-slate-700 leading-relaxed mb-4">{s.method.p3}</p>
              <p className="text-slate-700 leading-relaxed">{s.method.p4}</p>
            </div>
          </section>

          {/* Analytical Scope */}
          <section className="mb-16">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" />
                {s.framework.scope.heading}
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">{s.framework.scope.intro}</p>
              <ul className="space-y-4 ml-6">
                {s.framework.scope.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-slate-700 font-bold mt-0.5">•</span>
                    <span>
                      <strong className="text-slate-900">{item.title}</strong>
                      <br />
                      <span className="text-amber-700">{item.desc}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-slate-700 leading-relaxed mt-4">{s.framework.scope.closing}</p>
            </div>
          </section>

          {/* Sources Monitored */}
          <section className="mb-16">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                {s.framework.sources.heading}
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">{s.framework.sources.intro}</p>
              <ul className="space-y-2 ml-6">
                {s.framework.sources.items.map((item, idx) => (
                  <li key={idx} className="text-slate-700 flex items-start gap-3">
                    <span className="text-green-600 font-bold mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-slate-700 leading-relaxed mt-4">{s.framework.sources.closing}</p>
            </div>
          </section>

          {/* Analytical Principles */}
          <section className="mb-16">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-slate-600" />
                {s.principles.heading}
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">{s.principles.intro}</p>
              <div className="grid gap-4">
                {s.principles.items.map((principle, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200">
                    <h4 className="font-semibold text-slate-900 mb-1">{principle.title}</h4>
                    <p className="text-slate-700 text-sm">{principle.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Mapping Methodology */}
          <section className="mb-16">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Map className="w-5 h-5 text-purple-600" />
                {s.mapping.heading}
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">{s.mapping.p1}</p>
              <p className="text-slate-700 leading-relaxed mb-4">{s.mapping.p2}</p>
              <ul className="space-y-2 ml-6 mb-4">
                {s.mapping.items.map((item, idx) => (
                  <li key={idx} className="text-slate-700 flex items-start gap-3">
                    <span className="text-purple-600 font-bold mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-slate-700 leading-relaxed">{s.mapping.closing}</p>
            </div>
          </section>

          {/* Update Rhythm */}
          <section className="mb-16">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-600" />
                {s.framework.process.heading}
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">{s.framework.process.intro}</p>
              <ul className="space-y-2 ml-6">
                {s.framework.process.items.map((item, idx) => (
                  <li key={idx} className="text-slate-700 flex items-start gap-3">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span>
                      {typeof item === 'string' ? item : (<><strong>{item.bold}</strong>{item.rest}</>)}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-slate-700 leading-relaxed mt-4">{s.framework.process.closing}</p>
            </div>
          </section>

          {/* Limits & Uncertainty */}
          <section className="mb-16">
            <div className="bg-blue-50 rounded-lg shadow-sm border border-blue-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-blue-600" />
                {s.limits.heading}
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">{s.limits.p1}</p>
              <p className="text-slate-700 leading-relaxed mb-4">{s.limits.p2}</p>
              <ul className="space-y-2 ml-6 mb-4">
                {s.limits.items.map((item, idx) => (
                  <li key={idx} className="text-slate-700 flex items-start gap-3">
                    <span className="text-blue-600 font-bold mt-0.5">◆</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-slate-700 leading-relaxed font-medium">{s.limits.closing}</p>
            </div>
          </section>

          {/* Use of Analytical Tools */}
          <section className="mb-16">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-slate-600" />
                {s.tools.heading}
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">{s.tools.p1}</p>
              <p className="text-slate-700 leading-relaxed mb-4">{s.tools.p2}</p>
              <ul className="space-y-2 ml-6 mb-6">
                {s.tools.usedItems.map((item, idx) => (
                  <li key={idx} className="text-slate-700 flex items-start gap-3">
                    <span className="text-slate-400 font-bold mt-0.5">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-slate-700 leading-relaxed mb-4">{s.tools.p3}</p>
              <ul className="space-y-2 ml-6 mb-6">
                {s.tools.howeverItems.map((item, idx) => (
                  <li key={idx} className="text-slate-700 flex items-start gap-3">
                    <span className="text-slate-400 font-bold mt-0.5">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-slate-700 leading-relaxed mb-4">{s.tools.p4}</p>
              <p className="text-slate-700 leading-relaxed mb-4">{s.tools.p5}</p>
              <p className="text-slate-700 leading-relaxed italic">{s.tools.closing}</p>
            </div>
          </section>

          {/* Position */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg shadow-sm p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">{s.position.heading}</h2>
              <p className="text-slate-100 leading-relaxed mb-4">{s.position.p1}</p>
              <p className="text-slate-100 leading-relaxed">{s.position.p2}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
