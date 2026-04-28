/*
 * TransHorizons — Portfolio: Net Carbon Effect of Canadian Forest Ecosystems
 * Bilingual EN/FR — content driven by useLanguage()
 * Sources: NRCan, Nature, Copernicus, NASA, Environment and Climate Change Canada
 */

import ProjectDetailLayout from '@/components/ProjectDetailLayout';
import { useLanguage } from '@/contexts/LanguageContext';

const HERO_IMAGE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663495655297/RcKra6cpkH699NPak8ueHQ/canada-forest-hero-Vv9WznN4NH8b9CsdMBdh8H.webp';
const FIRE_MAP = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663495655297/RcKra6cpkH699NPak8ueHQ/canada-fire-map-2023-fDvEqJtv5WSeBFfDTZZL6S.webp';
const CARBON_CHART = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663495655297/RcKra6cpkH699NPak8ueHQ/canada-carbon-balance-chart-UZW4Nsa6VxZmr2P2srFCoq.webp';

const content = {
  en: {
    title: 'Net Carbon Effect of Canadian Forest Ecosystems',
    subtitle: 'From carbon sink to carbon source: how unprecedented wildfires have reversed the role of Canada\'s boreal forests in the global carbon cycle',
    category: 'Resources & Environment',
    readTime: '18 min',
    introduction:
      'Canada\'s forests cover approximately 362 million hectares, of which 230 million are classified as "managed forests" under federal reporting. For decades, these forests were understood as a net carbon sink — absorbing more carbon dioxide through photosynthesis and biomass growth than they released through decomposition and disturbance. That assumption has been fundamentally challenged. According to Natural Resources Canada\'s State of Canada\'s Forests: Annual Report 2025, the total net greenhouse gas flux from Canada\'s managed forests and forest products reached approximately 1,138 million tonnes of CO₂ equivalent (Mt CO₂e) in 2023 — making the country\'s forests a massive net carbon source for the first time in modern record-keeping. This article examines the net carbon effect of Canadian forest ecosystems using only institutional and peer-reviewed sources, with particular attention to regional variations and the unprecedented 2023 wildfire season.',
    sections: [
      {
        title: 'The Baseline: Canada\'s Forests as a Carbon Sink',
        content:
          'Prior to the escalation of wildfire activity in the early 2000s, Canada\'s managed forests functioned as a significant carbon sink. Research published by Environment and Climate Change Canada scientists (Curasi et al., 2025) demonstrates that Canadian terrestrial ecosystems have been a net carbon sink since the mid-twentieth century, primarily due to forest recovery from widespread wildfire and timber harvest that occurred before 1940. Between 2015 and 2020, Canadian ecosystems absorbed an estimated 366 ± 88.6 teragrams of carbon per year (TgC/yr), according to a study published in Nature by Byrne et al. (2024). Natural Resources Canada\'s managed forest carbon statistics confirm that in years with low natural disturbance — such as 2000 and 2001 — the forests acted as a net sink, absorbing 34.7 and 21.9 Mt CO₂e respectively. The carbon balance, however, has always been highly variable. Human activities in managed forests (harvesting, site preparation, regeneration) have consistently contributed a net source of 20 to 38 Mt CO₂e per year over the five years prior to 2023. Natural disturbances — primarily wildfire and insect outbreaks — have ranged from as low as 3 Mt CO₂e to as high as 294 Mt CO₂e per year in the same period, demonstrating the extreme volatility of the system.',
      },
      {
        title: 'The 2023 Wildfire Season: An Unprecedented Carbon Shock',
        content:
          'The 2023 Canadian wildfire season was the most destructive in recorded history. According to Natural Resources Canada, 7.9 million hectares of managed forest burned — more than the sum of the four highest previous wildfire years combined. The peer-reviewed study by Byrne et al. published in Nature (2024) estimated that 15 million hectares burned in total across Canada, approximately seven times the average burned area over the preceding 40 years (1983–2022 mean: 2.2 million hectares). Fire carbon emissions reached 647 TgC (range: 570–727 TgC) according to top-down atmospheric inversion estimates. This figure is approximately four times Canada\'s annual fossil fuel emissions (149 TgC/yr) and comparable to India\'s entire annual fossil fuel output (740 TgC/yr). The Copernicus Atmosphere Monitoring Service confirmed that Canada produced 23% of all global wildfire carbon emissions in 2023 — the highest share ever recorded for the country. Natural Resources Canada\'s 2025 report quantified the total net greenhouse gas flux at 1,138 Mt CO₂e, of which 1,070 Mt CO₂e came directly from wildland fires. The previous record for wildland fire emissions from managed forests was 292 Mt CO₂e in 2021 — meaning the 2023 figure was 3.7 times the prior record.',
        image: CARBON_CHART,
        imagePosition: 'right' as const,
      },
      {
        title: 'Regional Variations: Where the Carbon Was Released',
        content:
          'The 2023 fire emissions were not distributed evenly across Canada. Byrne et al. (2024) identified two dominant emission clusters with sharply different ecological and climatic profiles. Northwestern Canada, centred on the Great Slave Lake region of the Northwest Territories (approximately 57–62°N, 110–125°W), contributed roughly 61% of total fire carbon emissions. This region experienced a precipitation deficit of 8.1 cm (27% below average) and exceptionally warm temperatures (+2.6°C above the May–September mean). The drier boreal landscape in this area — dominated by black spruce and jack pine — is particularly fire-prone under drought conditions. Western Quebec (approximately 49–55°N, 72–80°W) contributed roughly 15% of total fire emissions. This region is typically wet, but experienced exceptional drought in 2023, with precipitation 23.7 cm (49%) below average, combined with extreme heat and vapour pressure deficit during June and July. The remaining emissions were distributed across Alberta, British Columbia, Ontario, and other provinces. Historically, Alberta and Ontario have been the highest-emitting provinces in terms of forest carbon, accounting for approximately 38% and 23% of the national total respectively. The boreal forest, which constitutes more than 75% of Canada\'s total forest area, dominates the national carbon balance and is the ecosystem most vulnerable to climate-driven fire intensification.',
        image: FIRE_MAP,
        imagePosition: 'left' as const,
      },
      {
        title: 'The Structural Shift: From Sink to Source',
        content:
          'The 2023 season was not an isolated event but rather the most extreme expression of a longer-term structural shift. Natural Resources Canada has noted that "recent high emissions from wildland fires in the managed forests are no longer offset by forest regrowth from previous wildland fires, resulting in net emissions into the atmosphere." Research by Curasi et al. (2025) — authored by scientists from Environment and Climate Change Canada, Natural Resources Canada, Carleton University, the University of Toronto, and the University of British Columbia — provides the first physically coherent wall-to-wall estimates of all major carbon pools and fluxes for Canada. Their analysis concludes that since the early 2000s, wildfire disturbance has been driving Canadian forests towards becoming a carbon source, and that continued increases in wildfire activity will further weaken, and may ultimately reverse, Canada\'s role as a carbon sink. Climate projections reinforce this concern. Byrne et al. (2024) note that under CMIP6 climate models and the SSP 2-4.5 scenario, the temperatures experienced in 2023 will be typical by the 2050s. If fire seasons of 2023 magnitude (approximately 4% of forest area burned per year) become the norm, all of Canada\'s forests could theoretically burn within a 25-year cycle — a rate far exceeding the capacity of boreal ecosystems to regenerate and recapture carbon.',
      },
      {
        title: 'Present Conditions and Outlook',
        content:
          'As of early 2026, Canada\'s managed forests remain in a state of heightened vulnerability. The carbon debt accumulated from the 2023 fire season will take decades to recover through natural regrowth, even under favourable conditions. The 2024 and 2025 fire seasons, while less extreme than 2023, continued the pattern of above-average burned area in several provinces. Canada\'s approach to forest carbon accounting distinguishes between emissions under the influence of human activities (harvesting, regeneration, fire suppression) and those associated with natural disturbances beyond human control. In 2023, human activities accounted for approximately 20.2 Mt CO₂e, while natural disturbances accounted for 1,118 Mt CO₂e — illustrating that the overwhelming driver of the carbon balance shift is wildfire, not forestry operations. The policy implications are significant. Forest carbon management strategies that rely on assumptions of stable sink capacity are no longer tenable. Adaptation measures — including enhanced fire prediction, fuel management, and strategic reforestation with fire-resistant species — will be essential to mitigate future carbon losses. However, the fundamental driver is climate change: warmer temperatures, longer fire seasons, and more frequent drought conditions are creating a feedback loop in which fire releases carbon, which accelerates warming, which increases fire risk.',
      },
    ],
    keyTakeaways: [
      {
        title: '1,138 Mt CO₂e Net Source in 2023',
        description:
          'Canada\'s managed forests released approximately 1,138 million tonnes of CO₂ equivalent in 2023, making them a massive net carbon source — driven almost entirely by the record wildfire season that burned 7.9 million hectares.',
      },
      {
        title: 'Regional Concentration of Emissions',
        description:
          'Northwestern Canada (Great Slave Lake, NWT) contributed 61% of fire emissions, while Western Quebec contributed 15%. Both regions experienced exceptional drought and heat, with the boreal forest being the most vulnerable ecosystem.',
      },
      {
        title: 'Structural Shift Underway',
        description:
          'Canada\'s forests are transitioning from a recovery-driven carbon sink to a disturbance-driven carbon source. Climate projections suggest 2023 temperatures will be typical by the 2050s, potentially making extreme fire seasons the new baseline.',
      },
    ],
    relatedProjects: [
      { id: 'resources', title: 'Critical Minerals & the Energy Transition', category: 'Resources' },
      { id: 'geopolitics', title: 'Canada in the Multipolar World', category: 'Geopolitics' },
    ],
  },
  fr: {
    title: 'Effet carbone net des écosystèmes forestiers canadiens',
    subtitle: 'De puits de carbone à source de carbone : comment des feux de forêt sans précédent ont inversé le rôle des forêts boréales du Canada dans le cycle mondial du carbone',
    category: 'Ressources et environnement',
    readTime: '18 min',
    introduction:
      'Les forêts du Canada couvrent environ 362 millions d\'hectares, dont 230 millions sont classés comme « forêts aménagées » dans les rapports fédéraux. Pendant des décennies, ces forêts étaient considérées comme un puits net de carbone — absorbant plus de dioxyde de carbone par la photosynthèse et la croissance de la biomasse qu\'elles n\'en libéraient par la décomposition et les perturbations. Cette hypothèse a été fondamentalement remise en question. Selon le rapport annuel 2025 de Ressources naturelles Canada sur l\'état des forêts au Canada, le flux net total de gaz à effet de serre des forêts aménagées et des produits forestiers du Canada a atteint environ 1 138 millions de tonnes d\'équivalent CO₂ (Mt éq. CO₂) en 2023 — faisant des forêts du pays une source nette massive de carbone pour la première fois dans les relevés modernes. Cet article examine l\'effet carbone net des écosystèmes forestiers canadiens en s\'appuyant exclusivement sur des sources institutionnelles et évaluées par des pairs, avec une attention particulière aux variations régionales et à la saison des feux de forêt sans précédent de 2023.',
    sections: [
      {
        title: 'La situation de référence : les forêts canadiennes comme puits de carbone',
        content:
          'Avant l\'intensification de l\'activité des feux de forêt au début des années 2000, les forêts aménagées du Canada fonctionnaient comme un puits de carbone significatif. Les recherches publiées par des scientifiques d\'Environnement et Changement climatique Canada (Curasi et al., 2025) démontrent que les écosystèmes terrestres canadiens sont un puits net de carbone depuis le milieu du XXe siècle, principalement en raison de la régénération forestière après les feux de forêt et l\'exploitation forestière généralisés survenus avant 1940. Entre 2015 et 2020, les écosystèmes canadiens absorbaient environ 366 ± 88,6 térogrammes de carbone par an (TgC/an), selon une étude publiée dans Nature par Byrne et al. (2024). Les statistiques de carbone des forêts aménagées de Ressources naturelles Canada confirment que lors des années à faible perturbation naturelle — comme 2000 et 2001 — les forêts agissaient comme un puits net, absorbant respectivement 34,7 et 21,9 Mt éq. CO₂. Le bilan carbone a toutefois toujours été très variable. Les activités humaines dans les forêts aménagées (récolte, préparation des sites, régénération) ont constamment contribué à une source nette de 20 à 38 Mt éq. CO₂ par an au cours des cinq années précédant 2023. Les perturbations naturelles — principalement les feux de forêt et les infestations d\'insectes — ont varié de 3 Mt éq. CO₂ à 294 Mt éq. CO₂ par an au cours de la même période, démontrant l\'extrême volatilité du système.',
      },
      {
        title: 'La saison des feux de 2023 : un choc carbone sans précédent',
        content:
          'La saison des feux de forêt de 2023 au Canada a été la plus destructrice de l\'histoire enregistrée. Selon Ressources naturelles Canada, 7,9 millions d\'hectares de forêt aménagée ont brûlé — plus que la somme des quatre années les plus touchées précédemment. L\'étude évaluée par des pairs de Byrne et al. publiée dans Nature (2024) estime que 15 millions d\'hectares ont brûlé au total à travers le Canada, soit environ sept fois la superficie brûlée moyenne au cours des 40 années précédentes (moyenne 1983-2022 : 2,2 millions d\'hectares). Les émissions de carbone des feux ont atteint 647 TgC (fourchette : 570-727 TgC) selon les estimations d\'inversion atmosphérique descendante. Ce chiffre représente environ quatre fois les émissions annuelles de combustibles fossiles du Canada (149 TgC/an) et est comparable à la production annuelle totale de combustibles fossiles de l\'Inde (740 TgC/an). Le Service de surveillance atmosphérique Copernicus a confirmé que le Canada a produit 23 % de toutes les émissions mondiales de carbone des feux de forêt en 2023 — la part la plus élevée jamais enregistrée pour le pays. Le rapport 2025 de Ressources naturelles Canada a quantifié le flux net total de gaz à effet de serre à 1 138 Mt éq. CO₂, dont 1 070 Mt éq. CO₂ provenaient directement des feux de forêt. Le précédent record d\'émissions des feux de forêt dans les forêts aménagées était de 292 Mt éq. CO₂ en 2021 — ce qui signifie que le chiffre de 2023 était 3,7 fois le record précédent.',
        image: CARBON_CHART,
        imagePosition: 'right' as const,
      },
      {
        title: 'Variations régionales : où le carbone a été libéré',
        content:
          'Les émissions de feux de 2023 n\'étaient pas réparties uniformément à travers le Canada. Byrne et al. (2024) ont identifié deux groupes d\'émissions dominants avec des profils écologiques et climatiques nettement différents. Le nord-ouest du Canada, centré sur la région du Grand lac des Esclaves dans les Territoires du Nord-Ouest (environ 57-62°N, 110-125°O), a contribué à environ 61 % des émissions totales de carbone des feux. Cette région a connu un déficit de précipitations de 8,1 cm (27 % en dessous de la moyenne) et des températures exceptionnellement chaudes (+2,6°C au-dessus de la moyenne mai-septembre). Le paysage boréal plus sec de cette zone — dominé par l\'épinette noire et le pin gris — est particulièrement vulnérable aux feux en conditions de sécheresse. L\'ouest du Québec (environ 49-55°N, 72-80°O) a contribué à environ 15 % des émissions totales des feux. Cette région est généralement humide, mais a connu une sécheresse exceptionnelle en 2023, avec des précipitations de 23,7 cm (49 %) en dessous de la moyenne, combinées à une chaleur extrême et un déficit de pression de vapeur pendant juin et juillet. Les émissions restantes étaient réparties entre l\'Alberta, la Colombie-Britannique, l\'Ontario et d\'autres provinces. Historiquement, l\'Alberta et l\'Ontario ont été les provinces les plus émettrices en termes de carbone forestier, représentant environ 38 % et 23 % du total national respectivement. La forêt boréale, qui constitue plus de 75 % de la superficie forestière totale du Canada, domine le bilan carbone national et est l\'écosystème le plus vulnérable à l\'intensification des feux liée au climat.',
        image: FIRE_MAP,
        imagePosition: 'left' as const,
      },
      {
        title: 'Le changement structurel : de puits à source',
        content:
          'La saison 2023 n\'était pas un événement isolé mais plutôt l\'expression la plus extrême d\'un changement structurel à plus long terme. Ressources naturelles Canada a noté que « les émissions élevées récentes des feux de forêt dans les forêts aménagées ne sont plus compensées par la repousse forestière des feux de forêt précédents, entraînant des émissions nettes dans l\'atmosphère ». Les recherches de Curasi et al. (2025) — réalisées par des scientifiques d\'Environnement et Changement climatique Canada, de Ressources naturelles Canada, de l\'Université Carleton, de l\'Université de Toronto et de l\'Université de la Colombie-Britannique — fournissent les premières estimations physiquement cohérentes de l\'ensemble des principaux réservoirs et flux de carbone pour le Canada. Leur analyse conclut que depuis le début des années 2000, les perturbations par les feux de forêt poussent les forêts canadiennes vers un statut de source de carbone, et que la poursuite de l\'augmentation de l\'activité des feux affaiblira davantage, et pourrait ultimement inverser, le rôle du Canada comme puits de carbone. Les projections climatiques renforcent cette préoccupation. Byrne et al. (2024) notent que selon les modèles climatiques CMIP6 et le scénario SSP 2-4.5, les températures vécues en 2023 seront typiques d\'ici les années 2050. Si des saisons de feux de l\'ampleur de 2023 (environ 4 % de la superficie forestière brûlée par an) deviennent la norme, toutes les forêts du Canada pourraient théoriquement brûler en un cycle de 25 ans — un rythme dépassant largement la capacité des écosystèmes boréaux à se régénérer et recapturer le carbone.',
      },
      {
        title: 'Conditions actuelles et perspectives',
        content:
          'Au début de 2026, les forêts aménagées du Canada demeurent dans un état de vulnérabilité accrue. La dette carbone accumulée lors de la saison des feux de 2023 prendra des décennies à se résorber par la repousse naturelle, même dans des conditions favorables. Les saisons de feux de 2024 et 2025, bien que moins extrêmes qu\'en 2023, ont poursuivi la tendance de superficies brûlées supérieures à la moyenne dans plusieurs provinces. L\'approche du Canada en matière de comptabilité du carbone forestier distingue les émissions sous l\'influence des activités humaines (récolte, régénération, suppression des feux) de celles associées aux perturbations naturelles hors du contrôle humain. En 2023, les activités humaines représentaient environ 20,2 Mt éq. CO₂, tandis que les perturbations naturelles représentaient 1 118 Mt éq. CO₂ — illustrant que le moteur principal du changement de bilan carbone est le feu de forêt, et non les opérations forestières. Les implications politiques sont significatives. Les stratégies de gestion du carbone forestier qui reposent sur des hypothèses de capacité de puits stable ne sont plus tenables. Des mesures d\'adaptation — incluant une prédiction améliorée des feux, la gestion des combustibles et le reboisement stratégique avec des espèces résistantes au feu — seront essentielles pour atténuer les pertes de carbone futures. Cependant, le facteur fondamental est le changement climatique : des températures plus chaudes, des saisons de feux plus longues et des conditions de sécheresse plus fréquentes créent une boucle de rétroaction dans laquelle le feu libère du carbone, ce qui accélère le réchauffement, ce qui augmente le risque d\'incendie.',
      },
    ],
    keyTakeaways: [
      {
        title: '1 138 Mt éq. CO₂ source nette en 2023',
        description:
          'Les forêts aménagées du Canada ont libéré environ 1 138 millions de tonnes d\'équivalent CO₂ en 2023, en faisant une source nette massive de carbone — presque entièrement due à la saison record de feux de forêt qui a brûlé 7,9 millions d\'hectares.',
      },
      {
        title: 'Concentration régionale des émissions',
        description:
          'Le nord-ouest du Canada (Grand lac des Esclaves, TNO) a contribué à 61 % des émissions des feux, tandis que l\'ouest du Québec a contribué à 15 %. Les deux régions ont connu une sécheresse et une chaleur exceptionnelles, la forêt boréale étant l\'écosystème le plus vulnérable.',
      },
      {
        title: 'Changement structurel en cours',
        description:
          'Les forêts du Canada passent d\'un puits de carbone lié à la régénération à une source de carbone liée aux perturbations. Les projections climatiques suggèrent que les températures de 2023 seront typiques d\'ici les années 2050, faisant potentiellement des saisons de feux extrêmes la nouvelle norme.',
      },
    ],
    relatedProjects: [
      { id: 'resources', title: 'Minéraux critiques et transition énergétique', category: 'Ressources' },
      { id: 'geopolitics', title: 'Le Canada dans un monde multipolaire', category: 'Géopolitique' },
    ],
  },
};

export default function PortfolioCanadaForestCarbon() {
  const { language } = useLanguage();
  const c = language === 'fr' ? content.fr : content.en;

  const sourcesLabel = language === 'fr' ? 'Sources institutionnelles' : 'Institutional Sources';
  const sourcesContent = language === 'fr'
    ? [
        '1. Ressources naturelles Canada, L\'état des forêts au Canada : Rapport annuel 2025 (février 2026)',
        '2. Byrne, B. et al., « Carbon emissions from the 2023 Canadian wildfires », Nature, vol. 633, p. 835-839 (28 août 2024)',
        '3. Ressources naturelles Canada, Carbone forestier (mars 2026)',
        '4. Ressources naturelles Canada, Inventaire national des GES pour les forêts aménagées (2025)',
        '5. Service de surveillance atmosphérique Copernicus (CAMS), Émissions mondiales des feux de forêt 2023',
        '6. NASA, « New NASA Study Tallies Carbon Emissions from Massive Canadian Fires » (2024)',
        '7. Curasi, S.R. et al., « Canada\'s forests are shifting from a recovery-driven carbon sink to a disturbance-driven carbon source », prépublication (octobre 2025)',
        '8. Environnement et Changement climatique Canada, Rapport d\'inventaire national 1990-2023',
      ]
    : [
        '1. Natural Resources Canada, The State of Canada\'s Forests: Annual Report 2025 (February 2026)',
        '2. Byrne, B. et al., "Carbon emissions from the 2023 Canadian wildfires," Nature, vol. 633, pp. 835–839 (28 August 2024)',
        '3. Natural Resources Canada, Forest Carbon (March 2026)',
        '4. Natural Resources Canada, National GHG Inventory for Managed Forests (2025)',
        '5. Copernicus Atmosphere Monitoring Service (CAMS), Global Wildfire Carbon Emissions 2023',
        '6. NASA, "New NASA Study Tallies Carbon Emissions from Massive Canadian Fires" (2024)',
        '7. Curasi, S.R. et al., "Canada\'s forests are shifting from a recovery-driven carbon sink to a disturbance-driven carbon source," Preprint (October 2025)',
        '8. Environment and Climate Change Canada, National Inventory Report 1990–2023',
      ];

  return (
    <>
      <ProjectDetailLayout
        title={c.title}
        subtitle={c.subtitle}
        heroImage={HERO_IMAGE}
        category={c.category}
        date="April 2026"
        readTime={c.readTime}
        introduction={c.introduction}
        sections={c.sections}
        keyTakeaways={c.keyTakeaways}
        relatedProjects={c.relatedProjects}
      />
      {/* Sources Section */}
      <div className="bg-[#F5F3F0] py-12 px-6 border-t border-[#C8C8C8]">
        <div className="max-w-[1000px] mx-auto">
          <h3 className="font-display text-2xl font-light text-[#1A1A1A] mb-8">{sourcesLabel}</h3>
          <div className="space-y-3">
            {sourcesContent.map((source, idx) => (
              <p key={idx} className="text-[#555] font-body text-sm leading-relaxed pl-4 border-l-2 border-[#7D1A2E]/30">
                {source}
              </p>
            ))}
          </div>
          <p className="mt-8 text-[#999] font-body text-xs italic">
            {language === 'fr'
              ? 'Toutes les données présentées dans cet article proviennent exclusivement de sources institutionnelles et d\'études évaluées par des pairs. Aucune estimation indépendante n\'a été réalisée par TransHorizons.'
              : 'All data presented in this article is drawn exclusively from institutional sources and peer-reviewed studies. No independent estimates have been produced by TransHorizons.'}
          </p>
        </div>
      </div>
    </>
  );
}
