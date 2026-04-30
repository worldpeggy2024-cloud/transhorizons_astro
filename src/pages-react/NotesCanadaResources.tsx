/**
 * NotesCanadaResources.tsx
 * Blog article: "Canada's Resource Wealth in a Fractured World"
 * Bilingual EN/FR — content driven by useLanguage()
 * Features: embedded CriticalMineralsMap component mid-article
 * Design: Editorial Horizon — Playfair Display / Inter, ivory/charcoal/gold palette
 */

import NotesDetailLayout from '@/components/NotesDetailLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import CriticalMineralsMap from './CriticalMineralsMap';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1600&q=85';

const content = {
  en: {
    title: "Canada's Resource Wealth in a Fractured World",
    category: 'Signals',
    date: 'April 2026',
    readTime: '16 min read',
    keyTakeaways: [
      {
        point:
          "Canada holds world-class deposits of lithium, cobalt, nickel, uranium, and rare earths — minerals that underpin the global energy transition and advanced defence technologies.",
      },
      {
        point:
          "Supply chains for critical minerals are dangerously concentrated: China controls refining for most key minerals, while the DRC supplies ~74% of mined cobalt. Canada is uniquely positioned to offer a democratic, stable alternative.",
      },
      {
        point:
          "The US–Canada trade relationship, under renewed pressure since 2025, has paradoxically elevated Canada's strategic importance as a trusted supplier of critical minerals to allied nations.",
      },
      {
        point:
          "Realising Canada's mineral potential requires faster permitting, downstream processing investment, meaningful Indigenous partnerships, and coordinated federal-provincial strategy.",
      },
    ],
    relatedArticles: [
      { title: 'Navigating Career Change', category: 'Notes', slug: 'career-evolution' },
      { title: 'Travel Stories from the Road', category: 'Observations', slug: 'travel-observation' },
    ],
    intro: (
      <p>
        The world is fracturing. The post-1991 liberal international order — built on the assumption
        that economic interdependence would dampen geopolitical rivalry — is giving way to a new era
        of strategic competition, supply chain nationalism, and resource mercantilism. In this
        context, Canada's vast mineral wealth has moved from a background economic asset to a
        front-line geopolitical variable. How Canada manages this transition will shape not only its
        own prosperity but also the resilience of allied supply chains for decades to come.
      </p>
    ),
    section1Title: 'The Minerals That Power the Modern World',
    section1: (
      <>
        <p>
          The energy transition — the shift from fossil fuels to wind, solar, and electrified
          transport — is not simply a technological or environmental project. It is a materials
          project. Every electric vehicle battery requires lithium, cobalt, nickel, and manganese.
          Every wind turbine demands rare earth elements for its permanent magnets. Every solar panel
          relies on silicon, silver, and increasingly, tellurium and indium. The International Energy
          Agency estimates that a world on track for net-zero emissions by 2050 will require{' '}
          <strong>six times more critical minerals by 2040</strong> than today.
        </p>
        <p>
          At the same time, these minerals are essential to defence and advanced manufacturing:
          rare earths in fighter jet engines and missile guidance systems, cobalt in superalloys for
          jet turbines, lithium in submarine batteries. The overlap between the energy transition and
          national security supply chains has made critical minerals a central preoccupation of
          governments from Washington to Brussels to Tokyo.
        </p>
        <p>
          The interactive map below shows the current global distribution of mine production and
          known reserves for eleven critical minerals. Explore each mineral to understand the
          concentration risks — and Canada's position within each supply chain.
        </p>
      </>
    ),
    section2Title: "Canada's Mineral Endowment: An Underutilised Strategic Asset",
    section2: (
      <>
        <p>
          Canada is one of the most mineral-rich countries on Earth. The country produces{' '}
          <strong>~15% of global uranium</strong> from the Athabasca Basin in Saskatchewan — the
          world's highest-grade uranium deposits. It is the world's{' '}
          <strong>fifth-largest nickel producer</strong>, with operations in Ontario, Manitoba, and
          emerging projects in British Columbia. Quebec's James Bay region hosts lithium deposits
          that could position Canada as a significant producer within this decade. Rare earth
          projects in the Northwest Territories, Labrador, and Quebec are advancing, albeit slowly,
          toward production.
        </p>
        <p>
          Yet Canada's share of global critical mineral output remains modest relative to its
          geological endowment. The reasons are structural: permitting timelines that routinely
          exceed a decade, capital costs that make Canadian projects less competitive than lower-cost
          jurisdictions, and the absence of domestic refining and processing capacity that would
          allow Canada to capture value beyond raw ore. A lithium deposit in Quebec that ships
          spodumene concentrate to China for processing contributes far less to Canadian economic
          sovereignty than one whose output is refined domestically into battery-grade lithium
          hydroxide.
        </p>
        <p>
          The downstream processing gap is the most consequential strategic vulnerability. China's
          dominance in critical mineral supply chains rests less on its geological endowment — which
          is significant but not uniquely so — than on its decades-long investment in refining,
          processing, and manufacturing capacity. Closing that gap requires not just mining
          investment but industrial policy at a scale Canada has rarely attempted.
        </p>
      </>
    ),
    section3Title: 'The Geopolitical Moment: Fracture as Opportunity',
    section3: (
      <>
        <p>
          The fracturing of the global order has, paradoxically, created a window of strategic
          opportunity for Canada. The United States, the European Union, Japan, South Korea, and
          Australia are all actively seeking to diversify critical mineral supply chains away from
          China and the Democratic Republic of Congo. Canada — stable, democratic, governed by the
          rule of law, and geographically proximate to the United States — is the obvious
          alternative supplier for allied nations.
        </p>
        <p>
          The US–Canada trade relationship has been under renewed stress since 2025, with tariff
          disputes and political friction complicating the bilateral relationship. Yet this friction
          has had an unexpected effect: it has elevated the strategic salience of Canada's mineral
          resources in Washington's calculations. A Canada that can supply lithium, cobalt, nickel,
          and rare earths to American battery manufacturers and defence contractors is a Canada that
          has leverage — and a Canada that the United States has strong incentives to treat as a
          partner rather than a target.
        </p>
        <p>
          The Canada–US Critical Minerals Action Plan, the Minerals Security Partnership (which
          includes Canada, the US, the EU, Japan, South Korea, Australia, and others), and the
          emerging Canada–EU Strategic Partnership on Raw Materials all reflect this logic. The
          question is not whether there is demand for Canadian minerals — there manifestly is — but
          whether Canada can mobilise the institutional, financial, and political capacity to meet
          that demand at scale and on the timelines that allied partners require.
        </p>
      </>
    ),
    section4Title: 'What a Strategic Minerals Policy Would Require',
    section4: (
      <>
        <p>
          A credible Canadian critical minerals strategy would need to address four interconnected
          challenges simultaneously.
        </p>
        <p>
          <strong>Permitting reform</strong> is the most frequently cited bottleneck. Canada's
          environmental assessment and Indigenous consultation processes are legally necessary and
          ethically important — but their current implementation produces timelines that are
          incompatible with the urgency of allied supply chain diversification. Australia has
          demonstrated that it is possible to maintain rigorous environmental standards while
          dramatically reducing permitting timelines through better-resourced regulatory agencies
          and clearer process design.
        </p>
        <p>
          <strong>Downstream processing investment</strong> requires a level of industrial policy
          ambition that Canada has historically been reluctant to deploy. The federal government's
          Critical Minerals Strategy (2022) and the subsequent budget commitments represent a
          beginning, but the scale of investment required — in refining, battery manufacturing, and
          materials science — exceeds what market forces alone will deliver in the required
          timeframe.
        </p>
        <p>
          <strong>Indigenous partnerships</strong> are not merely a legal requirement but a
          strategic necessity. Many of Canada's most significant mineral deposits are located on or
          near Indigenous territories. Projects that proceed without genuine partnership — including
          equity stakes, revenue sharing, and employment — face legal challenges, social opposition,
          and reputational risks that can delay or kill development. Projects that are structured as
          genuine partnerships, by contrast, can move faster and with greater social licence.
        </p>
        <p>
          <strong>Federal-provincial coordination</strong> is essential because mineral resources
          fall primarily under provincial jurisdiction while trade, foreign investment, and
          international agreements are federal. The absence of a coherent federal-provincial
          framework for critical minerals has historically produced fragmented, reactive policy.
          Building one requires political will at both levels of government.
        </p>
      </>
    ),
    conclusion: (
      <p>
        Canada's resource wealth is real, substantial, and strategically consequential. Whether it
        translates into lasting economic and geopolitical advantage depends on choices that are
        being made — or deferred — right now. The fracturing of the global order is not a crisis to
        be managed but a structural shift to be navigated. For a country with Canada's mineral
        endowment, democratic institutions, and allied relationships, the question is not whether
        the opportunity exists. The question is whether the political will to seize it does.
      </p>
    ),
    sourcesLabel: 'Sources & Further Reading',
    sources: [
      {
        label: 'IEA, The Role of Critical Minerals in Clean Energy Transitions (2021)',
        url: 'https://www.iea.org/reports/the-role-of-critical-minerals-in-clean-energy-transitions',
      },
      {
        label: 'USGS, Mineral Commodity Summaries 2025',
        url: 'https://pubs.usgs.gov/publication/mcs2025',
      },
      {
        label: 'Natural Resources Canada, Critical Minerals Strategy (2022)',
        url: 'https://www.nrcan.gc.ca/our-natural-resources/minerals-mining/critical-minerals/23414',
      },
      {
        label: 'Our World in Data — Critical Minerals & the Energy Transition (2026)',
        url: 'https://ourworldindata.org/countries-critical-minerals-needed-energy-transition',
      },
      {
        label: 'Minerals Security Partnership — Joint Statement (2022)',
        url: 'https://www.state.gov/minerals-security-partnership/',
      },
    ],
  },

  fr: {
    title: 'La richesse minérale du Canada dans un monde fracturé',
    category: 'Signaux',
    date: 'Avril 2026',
    readTime: '16 min de lecture',
    keyTakeaways: [
      {
        point:
          "Le Canada possède des gisements de calibre mondial en lithium, cobalt, nickel, uranium et terres rares — des minéraux essentiels à la transition énergétique mondiale et aux technologies de défense avancées.",
      },
      {
        point:
          "Les chaînes d'approvisionnement en minéraux critiques sont dangereusement concentrées : la Chine contrôle le raffinage de la plupart des minéraux clés, tandis que la RDC fournit ~74 % du cobalt extrait. Le Canada est uniquement positionné pour offrir une alternative démocratique et stable.",
      },
      {
        point:
          "La relation commerciale États-Unis–Canada, soumise à de nouvelles pressions depuis 2025, a paradoxalement élevé l'importance stratégique du Canada en tant que fournisseur fiable de minéraux critiques pour les nations alliées.",
      },
      {
        point:
          "Réaliser le potentiel minier du Canada exige une accélération des permis, des investissements dans la transformation en aval, de véritables partenariats avec les peuples autochtones et une stratégie fédérale-provinciale coordonnée.",
      },
    ],
    relatedArticles: [
      { title: 'Naviguer le changement de carrière', category: 'Notes', slug: 'career-evolution' },
      { title: 'Récits de voyage', category: 'Observations', slug: 'travel-observation' },
    ],
    intro: (
      <p>
        Le monde se fracture. L'ordre international libéral post-1991 — fondé sur l'hypothèse que
        l'interdépendance économique atténuerait la rivalité géopolitique — cède la place à une
        nouvelle ère de compétition stratégique, de nationalisme des chaînes d'approvisionnement et
        de mercantilisme des ressources. Dans ce contexte, la vaste richesse minérale du Canada est
        passée d'un atout économique de second plan à une variable géopolitique de premier plan.
        La façon dont le Canada gère cette transition façonnera non seulement sa propre prospérité,
        mais aussi la résilience des chaînes d'approvisionnement alliées pour les décennies à venir.
      </p>
    ),
    section1Title: 'Les minéraux qui alimentent le monde moderne',
    section1: (
      <>
        <p>
          La transition énergétique — le passage des combustibles fossiles à l'éolien, au solaire et
          au transport électrifié — n'est pas simplement un projet technologique ou environnemental.
          C'est un projet matériel. Chaque batterie de véhicule électrique nécessite du lithium, du
          cobalt, du nickel et du manganèse. Chaque éolienne exige des éléments de terres rares pour
          ses aimants permanents. Chaque panneau solaire repose sur le silicium, l'argent et,
          de plus en plus, le tellure et l'indium. L'Agence internationale de l'énergie estime qu'un
          monde sur la voie de la neutralité carbone d'ici 2050 nécessitera{' '}
          <strong>six fois plus de minéraux critiques d'ici 2040</strong> qu'aujourd'hui.
        </p>
        <p>
          Ces minéraux sont également essentiels à la défense et à la fabrication avancée : terres
          rares dans les moteurs de chasseurs et les systèmes de guidage de missiles, cobalt dans
          les superalliages pour turbines à réaction, lithium dans les batteries de sous-marins. Le
          chevauchement entre la transition énergétique et les chaînes d'approvisionnement de
          sécurité nationale a fait des minéraux critiques une préoccupation centrale des
          gouvernements de Washington à Bruxelles en passant par Tokyo.
        </p>
        <p>
          La carte interactive ci-dessous montre la distribution mondiale actuelle de la production
          minière et des réserves connues pour onze minéraux critiques. Explorez chaque minéral pour
          comprendre les risques de concentration — et la position du Canada dans chaque chaîne
          d'approvisionnement.
        </p>
      </>
    ),
    section2Title: "La dotation minérale du Canada : un atout stratégique sous-exploité",
    section2: (
      <>
        <p>
          Le Canada est l'un des pays les plus riches en minéraux de la planète. Le pays produit{' '}
          <strong>~15 % de l'uranium mondial</strong> à partir du bassin d'Athabasca en
          Saskatchewan — les gisements d'uranium de plus haute teneur au monde. Il est le{' '}
          <strong>cinquième producteur mondial de nickel</strong>, avec des opérations en Ontario,
          au Manitoba et des projets émergents en Colombie-Britannique. La région de la Baie-James
          au Québec abrite des gisements de lithium qui pourraient positionner le Canada comme un
          producteur important d'ici la fin de cette décennie. Des projets de terres rares dans les
          Territoires du Nord-Ouest, au Labrador et au Québec progressent, bien que lentement,
          vers la production.
        </p>
        <p>
          Pourtant, la part du Canada dans la production mondiale de minéraux critiques reste modeste
          par rapport à sa dotation géologique. Les raisons sont structurelles : des délais
          d'octroi de permis qui dépassent régulièrement une décennie, des coûts en capital qui
          rendent les projets canadiens moins compétitifs que les juridictions à moindre coût, et
          l'absence de capacité nationale de raffinage et de transformation qui permettrait au Canada
          de capter de la valeur au-delà du minerai brut. Un gisement de lithium au Québec qui
          expédie du concentré de spodumène en Chine pour traitement contribue bien moins à la
          souveraineté économique canadienne que celui dont la production est raffinée
          domestiquement en hydroxyde de lithium de qualité batterie.
        </p>
        <p>
          L'écart dans la transformation en aval est la vulnérabilité stratégique la plus
          conséquente. La domination de la Chine dans les chaînes d'approvisionnement en minéraux
          critiques repose moins sur sa dotation géologique — qui est significative mais pas
          uniquement — que sur ses décennies d'investissement dans les capacités de raffinage, de
          traitement et de fabrication. Combler cet écart nécessite non seulement des
          investissements miniers, mais une politique industrielle à une échelle que le Canada a
          rarement tentée.
        </p>
      </>
    ),
    section3Title: 'Le moment géopolitique : la fracture comme opportunité',
    section3: (
      <>
        <p>
          La fracture de l'ordre mondial a, paradoxalement, créé une fenêtre d'opportunité
          stratégique pour le Canada. Les États-Unis, l'Union européenne, le Japon, la Corée du Sud
          et l'Australie cherchent tous activement à diversifier leurs chaînes d'approvisionnement
          en minéraux critiques hors de Chine et de la République démocratique du Congo. Le Canada
          — stable, démocratique, régi par l'état de droit et géographiquement proche des
          États-Unis — est le fournisseur alternatif évident pour les nations alliées.
        </p>
        <p>
          La relation commerciale États-Unis–Canada est sous pression renouvelée depuis 2025, avec
          des différends tarifaires et des frictions politiques compliquant la relation bilatérale.
          Pourtant, cette friction a eu un effet inattendu : elle a élevé la saillance stratégique
          des ressources minérales du Canada dans les calculs de Washington. Un Canada capable de
          fournir du lithium, du cobalt, du nickel et des terres rares aux fabricants de batteries
          et aux contractants de défense américains est un Canada qui dispose d'un levier — et un
          Canada que les États-Unis ont de fortes incitations à traiter comme un partenaire plutôt
          que comme une cible.
        </p>
        <p>
          Le Plan d'action Canada–États-Unis sur les minéraux critiques, le Partenariat pour la
          sécurité des minéraux (qui inclut le Canada, les États-Unis, l'UE, le Japon, la Corée du
          Sud, l'Australie et d'autres) et le Partenariat stratégique Canada–UE sur les matières
          premières reflètent tous cette logique. La question n'est pas de savoir s'il existe une
          demande pour les minéraux canadiens — il y en a manifestement — mais si le Canada peut
          mobiliser la capacité institutionnelle, financière et politique pour répondre à cette
          demande à l'échelle et dans les délais requis par les partenaires alliés.
        </p>
      </>
    ),
    section4Title: 'Ce que nécessiterait une politique stratégique des minéraux',
    section4: (
      <>
        <p>
          Une stratégie canadienne crédible en matière de minéraux critiques devrait aborder
          simultanément quatre défis interdépendants.
        </p>
        <p>
          <strong>La réforme des permis</strong> est le goulet d'étranglement le plus fréquemment
          cité. Les processus d'évaluation environnementale et de consultation des peuples
          autochtones au Canada sont légalement nécessaires et éthiquement importants — mais leur
          mise en œuvre actuelle produit des délais incompatibles avec l'urgence de la
          diversification des chaînes d'approvisionnement alliées. L'Australie a démontré qu'il est
          possible de maintenir des normes environnementales rigoureuses tout en réduisant
          considérablement les délais d'octroi de permis grâce à des agences réglementaires mieux
          dotées en ressources et à une conception de processus plus claire.
        </p>
        <p>
          <strong>L'investissement dans la transformation en aval</strong> nécessite un niveau
          d'ambition en matière de politique industrielle que le Canada a historiquement été réticent
          à déployer. La Stratégie canadienne sur les minéraux critiques (2022) et les engagements
          budgétaires ultérieurs représentent un début, mais l'échelle des investissements requis —
          dans le raffinage, la fabrication de batteries et la science des matériaux — dépasse ce
          que les seules forces du marché fourniront dans le délai requis.
        </p>
        <p>
          <strong>Les partenariats autochtones</strong> ne sont pas seulement une exigence légale
          mais une nécessité stratégique. Bon nombre des gisements minéraux les plus importants du
          Canada sont situés sur ou près de territoires autochtones. Les projets qui progressent
          sans véritable partenariat — incluant des participations en capital, le partage des
          revenus et l'emploi — font face à des contestations juridiques, à l'opposition sociale et
          à des risques de réputation qui peuvent retarder ou tuer le développement. Les projets
          structurés comme de véritables partenariats, en revanche, peuvent avancer plus rapidement
          et avec une plus grande acceptabilité sociale.
        </p>
        <p>
          <strong>La coordination fédérale-provinciale</strong> est essentielle car les ressources
          minérales relèvent principalement de la compétence provinciale tandis que le commerce, les
          investissements étrangers et les accords internationaux sont fédéraux. L'absence d'un
          cadre fédéral-provincial cohérent pour les minéraux critiques a historiquement produit une
          politique fragmentée et réactive. En construire un nécessite une volonté politique aux
          deux niveaux de gouvernement.
        </p>
      </>
    ),
    conclusion: (
      <p>
        La richesse en ressources du Canada est réelle, substantielle et stratégiquement
        conséquente. Qu'elle se traduise en avantage économique et géopolitique durable dépend de
        choix qui sont faits — ou différés — en ce moment même. La fracture de l'ordre mondial
        n'est pas une crise à gérer mais un changement structurel à naviguer. Pour un pays avec la
        dotation minérale, les institutions démocratiques et les relations alliées du Canada, la
        question n'est pas de savoir si l'opportunité existe. La question est de savoir si la
        volonté politique de la saisir existe.
      </p>
    ),
    sourcesLabel: 'Sources et lectures complémentaires',
    sources: [
      {
        label: "AIE, Le rôle des minéraux critiques dans les transitions énergétiques propres (2021)",
        url: 'https://www.iea.org/reports/the-role-of-critical-minerals-in-clean-energy-transitions',
      },
      {
        label: 'USGS, Mineral Commodity Summaries 2025',
        url: 'https://pubs.usgs.gov/publication/mcs2025',
      },
      {
        label: 'Ressources naturelles Canada, Stratégie sur les minéraux critiques (2022)',
        url: 'https://www.nrcan.gc.ca/our-natural-resources/minerals-mining/critical-minerals/23414',
      },
      {
        label: 'Our World in Data — Minéraux critiques et transition énergétique (2026)',
        url: 'https://ourworldindata.org/countries-critical-minerals-needed-energy-transition',
      },
      {
        label: 'Partenariat pour la sécurité des minéraux — Déclaration conjointe (2022)',
        url: 'https://www.state.gov/minerals-security-partnership/',
      },
    ],
  },
};

export default function NotesCanadaResources() {
  const { language } = useLanguage();
  const c = language === 'fr' ? content.fr : content.en;

  const articleContent = (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="prose prose-lg max-w-none prose-p:text-charcoal/80 prose-p:leading-relaxed">
        {c.intro}
      </div>

      {/* Section 1 */}
      <h2 className="font-playfair text-3xl font-bold text-charcoal pt-4">{c.section1Title}</h2>
      <div className="prose prose-lg max-w-none prose-p:text-charcoal/80 prose-p:leading-relaxed prose-strong:text-charcoal">
        {c.section1}
      </div>

      {/* ── Embedded Critical Minerals Map ── */}
      <div className="not-prose my-10 rounded-2xl overflow-hidden border border-slate-700/40 shadow-2xl">
        <CriticalMineralsMap />
      </div>

      {/* Section 2 */}
      <h2 className="font-playfair text-3xl font-bold text-charcoal pt-4">{c.section2Title}</h2>
      <div className="prose prose-lg max-w-none prose-p:text-charcoal/80 prose-p:leading-relaxed prose-strong:text-charcoal">
        {c.section2}
      </div>

      {/* Section 3 */}
      <h2 className="font-playfair text-3xl font-bold text-charcoal pt-4">{c.section3Title}</h2>
      <div className="prose prose-lg max-w-none prose-p:text-charcoal/80 prose-p:leading-relaxed prose-strong:text-charcoal">
        {c.section3}
      </div>

      {/* Section 4 */}
      <h2 className="font-playfair text-3xl font-bold text-charcoal pt-4">{c.section4Title}</h2>
      <div className="prose prose-lg max-w-none prose-p:text-charcoal/80 prose-p:leading-relaxed prose-strong:text-charcoal">
        {c.section4}
      </div>

      {/* Conclusion */}
      <div className="border-l-4 border-[#7D1A2E] pl-6 my-8">
        <div className="prose prose-lg max-w-none prose-p:text-charcoal/80 prose-p:leading-relaxed italic">
          {c.conclusion}
        </div>
      </div>

      {/* Sources */}
      <div className="pt-8 border-t border-sand/30">
        <h3 className="font-playfair text-xl font-bold text-charcoal mb-4">{c.sourcesLabel}</h3>
        <ol className="space-y-2">
          {c.sources.map((s, i) => (
            <li key={i} className="flex gap-2 text-sm text-charcoal/70">
              <span className="font-medium text-charcoal/50 shrink-0">[{i + 1}]</span>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#7D1A2E] underline underline-offset-2 transition-colors"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );

  return (
    <NotesDetailLayout
      title={c.title}
      category={c.category}
      date={c.date}
      readTime={c.readTime}
      heroImage={HERO_IMAGE}
      keyTakeaways={c.keyTakeaways}
      content={articleContent}
      relatedArticles={c.relatedArticles}
      backSection="portfolio"
    />
  );
}
