/**
 * CriticalMineralsMap — Interactive world choropleth map
 * Design: Editorial Horizon — dark analytical aesthetic
 * Covers all 34 minerals on Canada's official NRCan critical minerals list (June 2024)
 * Data sources:
 *   USGS Mineral Commodity Summaries 2025 (2024 data)
 *   USGS Global Maps of Critical Mineral Production in 2023 (FS 2025-3038)
 *   Natural Resources Canada Critical Minerals List 2024
 *   NRCan Mineral Trade Information Bulletin (September 2025)
 *   CSIS Mining for Defense (February 2025)
 */

import { useState, useCallback, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  type GeographiesChildrenArgument,
  type GeoFeature,
} from "react-simple-maps";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type CanadaRole = "major_producer" | "emerging_producer" | "strategic_supplier" | "import_dependent";
type ViewMode = "production" | "reserves";

// ─── Minerals list (all 34 NRCan 2024) ───────────────────────────────────────

const MINERALS = [
  // Group 1: Battery & EV
  { id: "lithium",     group: "battery",    label: { en: "Lithium",               fr: "Lithium"               }, symbol: "Li",  color: "#3B82F6" },
  { id: "cobalt",      group: "battery",    label: { en: "Cobalt",                fr: "Cobalt"                }, symbol: "Co",  color: "#8B5CF6" },
  { id: "nickel",      group: "battery",    label: { en: "Nickel",                fr: "Nickel"                }, symbol: "Ni",  color: "#10B981" },
  { id: "graphite",    group: "battery",    label: { en: "Graphite",              fr: "Graphite"              }, symbol: "C",   color: "#9CA3AF" },
  { id: "manganese",   group: "battery",    label: { en: "Manganese",             fr: "Manganèse"             }, symbol: "Mn",  color: "#EC4899" },
  // Group 2: Base metals
  { id: "copper",      group: "base",       label: { en: "Copper",                fr: "Cuivre"                }, symbol: "Cu",  color: "#F59E0B" },
  { id: "zinc",        group: "base",       label: { en: "Zinc",                  fr: "Zinc"                  }, symbol: "Zn",  color: "#06B6D4" },
  { id: "tin",         group: "base",       label: { en: "Tin",                   fr: "Étain"                 }, symbol: "Sn",  color: "#64748B" },
  { id: "bismuth",     group: "base",       label: { en: "Bismuth",               fr: "Bismuth"               }, symbol: "Bi",  color: "#A16207" },
  // Group 3: Energy & nuclear
  { id: "uranium",     group: "energy",     label: { en: "Uranium",               fr: "Uranium"               }, symbol: "U",   color: "#84CC16" },
  { id: "helium",      group: "energy",     label: { en: "Helium",                fr: "Hélium"                }, symbol: "He",  color: "#67E8F9" },
  // Group 4: Agriculture & industrial
  { id: "potash",      group: "agri",       label: { en: "Potash",                fr: "Potasse"               }, symbol: "K",   color: "#F97316" },
  { id: "phosphate",   group: "agri",       label: { en: "Phosphate",             fr: "Phosphate"             }, symbol: "P",   color: "#A3E635" },
  { id: "magnesium",   group: "agri",       label: { en: "Magnesium",             fr: "Magnésium"             }, symbol: "Mg",  color: "#FCD34D" },
  { id: "fluorspar",   group: "agri",       label: { en: "Fluorspar",             fr: "Fluorine"              }, symbol: "F",   color: "#7DD3FC" },
  { id: "silicon",     group: "agri",       label: { en: "Silicon Metal",         fr: "Silicium métal"        }, symbol: "Si",  color: "#C4B5FD" },
  // Group 5: Specialty & high-tech
  { id: "rare_earths", group: "hightech",   label: { en: "Rare Earths",           fr: "Terres rares"          }, symbol: "REE", color: "#EF4444" },
  { id: "pgm",         group: "hightech",   label: { en: "Platinum Group Metals", fr: "Métaux du groupe platine" }, symbol: "PGM", color: "#E2E8F0" },
  { id: "gallium",     group: "hightech",   label: { en: "Gallium",               fr: "Gallium"               }, symbol: "Ga",  color: "#A78BFA" },
  { id: "indium",      group: "hightech",   label: { en: "Indium",                fr: "Indium"                }, symbol: "In",  color: "#818CF8" },
  { id: "tellurium",   group: "hightech",   label: { en: "Tellurium",             fr: "Tellure"               }, symbol: "Te",  color: "#34D399" },
  { id: "cesium",      group: "hightech",   label: { en: "Cesium",                fr: "Césium"                }, symbol: "Cs",  color: "#F472B6" },
  { id: "scandium",    group: "hightech",   label: { en: "Scandium",              fr: "Scandium"              }, symbol: "Sc",  color: "#FCA5A5" },
  // Group 6: Structural & defence
  { id: "chromium",    group: "defence",    label: { en: "Chromium",              fr: "Chrome"                }, symbol: "Cr",  color: "#0EA5E9" },
  { id: "vanadium",    group: "defence",    label: { en: "Vanadium",              fr: "Vanadium"              }, symbol: "V",   color: "#FB923C" },
  { id: "molybdenum",  group: "defence",    label: { en: "Molybdenum",            fr: "Molybdène"             }, symbol: "Mo",  color: "#38BDF8" },
  { id: "tungsten",    group: "defence",    label: { en: "Tungsten",              fr: "Tungstène"             }, symbol: "W",   color: "#6EE7B7" },
  { id: "niobium",     group: "defence",    label: { en: "Niobium",               fr: "Niobium"               }, symbol: "Nb",  color: "#FDE68A" },
  { id: "titanium",    group: "defence",    label: { en: "Titanium",              fr: "Titane"                }, symbol: "Ti",  color: "#BAE6FD" },
  { id: "antimony",    group: "defence",    label: { en: "Antimony",              fr: "Antimoine"             }, symbol: "Sb",  color: "#FB7185" },
  { id: "strontium",   group: "defence",    label: { en: "Strontium",             fr: "Strontium"             }, symbol: "Sr",  color: "#D8B4FE" },
  // Group 7: Aluminium & bauxite
  { id: "bauxite",     group: "base",       label: { en: "Bauxite (Aluminium)",   fr: "Bauxite (Aluminium)"   }, symbol: "Al",  color: "#D97706" },
  // Group 8: Zirconium & high-purity iron
  { id: "zirconium",   group: "hightech",   label: { en: "Zirconium",             fr: "Zirconium"             }, symbol: "Zr",  color: "#86EFAC" },
  { id: "iron_ore",    group: "base",       label: { en: "High-Purity Iron Ore",  fr: "Minerai de fer haute pureté" }, symbol: "Fe",  color: "#F87171" },
];

// ─── Canada role ──────────────────────────────────────────────────────────────

const CANADA_ROLE: Record<string, { role: CanadaRole; note: { en: string; fr: string } }> = {
  lithium:     { role: "emerging_producer",  note: { en: "Emerging producer — hard rock projects in Quebec (Patriot Battery Metals) and brine in Alberta", fr: "Producteur émergent — projets de roche dure au Québec (Patriot Battery Metals) et saumure en Alberta" } },
  cobalt:      { role: "major_producer",     note: { en: "Major producer (~2–3% global) — by-product of nickel mining in Ontario & Manitoba", fr: "Producteur important (~2–3 % mondial) — sous-produit du nickel en Ontario et Manitoba" } },
  nickel:      { role: "major_producer",     note: { en: "Major producer (~5% global) — Sudbury ON, Thompson MB, Voisey's Bay NL", fr: "Producteur important (~5 % mondial) — Sudbury ON, Thompson MB, Voisey's Bay TN-L" } },
  graphite:    { role: "emerging_producer",  note: { en: "Emerging producer — Quebec graphite deposits; imports most refined battery-grade graphite from China", fr: "Producteur émergent — gisements au Québec ; importe la majorité du graphite raffiné de Chine" } },
  manganese:   { role: "import_dependent",   note: { en: "Import-dependent — no significant Canadian production; imports from South Africa, Gabon, Australia", fr: "Dépendant des importations — pas de production canadienne significative ; importations d'Afrique du Sud, Gabon, Australie" } },
  copper:      { role: "major_producer",     note: { en: "Major producer (~3% global) — BC, Ontario, Quebec; major exporter to US and China", fr: "Producteur important (~3 % mondial) — C.-B., Ontario, Québec ; grand exportateur vers les É.-U. et la Chine" } },
  zinc:        { role: "major_producer",     note: { en: "Top 5 global producer — BC, Yukon, New Brunswick, Nova Scotia; Trail smelter also produces gallium and indium", fr: "Top 5 mondial — C.-B., Yukon, Nouveau-Brunswick, Nouvelle-Écosse ; la fonderie de Trail produit aussi du gallium et de l'indium" } },
  tin:         { role: "import_dependent",   note: { en: "Import-dependent — no significant Canadian tin production; imports from China, Indonesia, Malaysia", fr: "Dépendant des importations — pas de production canadienne significative ; importations de Chine, Indonésie, Malaisie" } },
  bismuth:     { role: "emerging_producer",  note: { en: "By-product producer — recovered from lead smelting in New Brunswick; small but strategic", fr: "Producteur de sous-produit — récupéré du plomb en Nouveau-Brunswick ; petit mais stratégique" } },
  uranium:     { role: "major_producer",     note: { en: "2nd largest producer globally (15%) — Athabasca Basin, Saskatchewan; world's highest-grade deposits", fr: "2e producteur mondial (15 %) — bassin d'Athabasca, Saskatchewan ; gisements de plus haute teneur au monde" } },
  helium:      { role: "emerging_producer",  note: { en: "Emerging producer — Saskatchewan helium fields; Canada is developing domestic production to reduce US dependence", fr: "Producteur émergent — champs d'hélium en Saskatchewan ; le Canada développe une production nationale pour réduire la dépendance aux É.-U." } },
  potash:      { role: "major_producer",     note: { en: "World's largest exporter (~31% production, ~35% reserves) — Saskatchewan; Canada's top critical mineral export at $8B in 2024", fr: "Plus grand exportateur mondial (~31 % production, ~35 % réserves) — Saskatchewan ; première exportation de minéral critique du Canada à 8 G$ en 2024" } },
  phosphate:   { role: "import_dependent",   note: { en: "Import-dependent — Canada has phosphate resources in BC and Ontario but no significant current production; imports from Morocco and US", fr: "Dépendant des importations — le Canada a des ressources en C.-B. et Ontario mais pas de production actuelle significative ; importations du Maroc et des É.-U." } },
  magnesium:   { role: "import_dependent",   note: { en: "Import-dependent — Canada has magnesium resources (dolomite in Ontario) but no primary production; China dominates ~85% of global supply", fr: "Dépendant des importations — le Canada a des ressources (dolomite en Ontario) mais pas de production primaire ; la Chine domine ~85 % de l'offre mondiale" } },
  fluorspar:   { role: "import_dependent",   note: { en: "Import-dependent — Canada has fluorspar deposits in Newfoundland (St. Lawrence) but production is minimal; imports from China and Mexico", fr: "Dépendant des importations — le Canada a des gisements en Terre-Neuve (St. Lawrence) mais la production est minimale ; importations de Chine et du Mexique" } },
  silicon:     { role: "import_dependent",   note: { en: "Import-dependent — Canada added silicon metal to its critical minerals list in 2024; no significant domestic production; imports from China (~60% global) and Norway", fr: "Dépendant des importations — le Canada a ajouté le silicium métal à sa liste en 2024 ; pas de production nationale significative ; importations de Chine (~60 % mondial) et de Norvège" } },
  rare_earths: { role: "emerging_producer",  note: { en: "Emerging producer — deposits in Quebec, NWT, Labrador; Canada mines but sends to China for refining (~90% of global refining)", fr: "Producteur émergent — gisements au Québec, TNO, Labrador ; le Canada extrait mais envoie en Chine pour le raffinage (~90 % du raffinage mondial)" } },
  pgm:         { role: "strategic_supplier", note: { en: "Strategic US supplier — Sudbury (Ontario) and Nunavut; by-product of nickel mining; ~4% of global PGM output", fr: "Fournisseur stratégique des É.-U. — Sudbury (Ontario) et Nunavut ; sous-produit du nickel ; ~4 % de la production mondiale de MPG" } },
  gallium:     { role: "emerging_producer",  note: { en: "By-product producer — Trail smelter (BC) produces gallium from zinc refining; China's 2023 export ban elevated Canada's strategic value. Note: Germanium (Ge), not on the NRCan list but closely linked, is also produced at Trail as a zinc by-product and was subject to the same Chinese export ban — making Trail one of the few non-Chinese sources of both metals.", fr: "Producteur de sous-produit — fonderie de Trail (C.-B.) produit du gallium du zinc ; l'interdiction d'exportation chinoise de 2023 a accru la valeur stratégique du Canada. Note : le germanium (Ge), absent de la liste RNCan mais étroitement lié, est également produit à Trail en sous-produit du zinc et a fait l'objet de la même interdiction d'exportation chinoise — faisant de Trail l'une des rares sources non chinoises des deux métaux." } },
  indium:      { role: "strategic_supplier", note: { en: "Strategic supplier — Trail smelter (BC) is one of the world's largest indium producers as a by-product of zinc refining; Canada is a top 3 global producer", fr: "Fournisseur stratégique — la fonderie de Trail (C.-B.) est l'un des plus grands producteurs mondiaux d'indium en sous-produit du zinc ; le Canada est dans le top 3 mondial" } },
  tellurium:   { role: "strategic_supplier", note: { en: "Strategic supplier — Canada produces tellurium as a by-product of copper refining; key supplier to US solar and defence sectors", fr: "Fournisseur stratégique — le Canada produit du tellure en sous-produit du raffinage du cuivre ; fournisseur clé pour les secteurs solaire et défense américains" } },
  cesium:      { role: "major_producer",     note: { en: "Dominant producer — Bernic Lake, Manitoba (Tanco Mine) holds the world's largest known pollucite deposit; Canada has historically supplied ~70% of world cesium", fr: "Producteur dominant — Bernic Lake, Manitoba (mine Tanco) détient le plus grand gisement connu de pollucite ; le Canada a historiquement fourni ~70 % du césium mondial" } },
  scandium:    { role: "import_dependent",   note: { en: "Import-dependent — Canada has scandium in nickel tailings (Ontario) but no primary production; imports from China, Russia, Ukraine", fr: "Dépendant des importations — le Canada a du scandium dans les résidus de nickel (Ontario) mais pas de production primaire ; importations de Chine, Russie, Ukraine" } },
  chromium:    { role: "import_dependent",   note: { en: "Import-dependent — minor Canadian production in Ontario; relies on South Africa and Kazakhstan", fr: "Dépendant des importations — production canadienne mineure en Ontario ; dépend de l'Afrique du Sud et du Kazakhstan" } },
  vanadium:    { role: "import_dependent",   note: { en: "Import-dependent — Canada has vanadium in oil sands (Alberta) and deposits in BC, but no primary mine production; imports from China and South Africa", fr: "Dépendant des importations — le Canada a du vanadium dans les sables bitumineux (Alberta) et des gisements en C.-B., mais pas de production minière primaire ; importations de Chine et d'Afrique du Sud" } },
  molybdenum:  { role: "major_producer",     note: { en: "Major producer (~5% global) — BC (Endako, Highland Valley Copper by-product); Canada is a top 5 global producer and key US supplier", fr: "Producteur important (~5 % mondial) — C.-B. (Endako, sous-produit de Highland Valley Copper) ; le Canada est dans le top 5 mondial et fournisseur clé des É.-U." } },
  tungsten:    { role: "import_dependent",   note: { en: "Import-dependent — Canada has tungsten deposits (Yukon, NWT) but no current production; imports from China (~80% global) and Vietnam", fr: "Dépendant des importations — le Canada a des gisements (Yukon, TNO) mais pas de production actuelle ; importations de Chine (~80 % mondial) et du Vietnam" } },
  niobium:     { role: "emerging_producer",  note: { en: "Emerging producer — Niobec Mine, Quebec (now owned by Magris Resources); Canada is a significant producer alongside Brazil's dominant CBMM", fr: "Producteur émergent — mine Niobec, Québec (maintenant Magris Resources) ; le Canada est un producteur significatif aux côtés du dominant brésilien CBMM" } },
  titanium:    { role: "emerging_producer",  note: { en: "Emerging producer — ilmenite and rutile deposits in Quebec and Ontario; Canada processes titanium but imports significant quantities", fr: "Producteur émergent — gisements d'ilménite et de rutile au Québec et en Ontario ; le Canada transforme du titane mais importe des quantités significatives" } },
  antimony:    { role: "import_dependent",   note: { en: "100% import-dependent — no domestic production; China controls ~48%; critical for flame retardants, batteries, and defence", fr: "100 % dépendant des importations — aucune production nationale ; la Chine contrôle ~48 % ; critique pour les retardateurs de flamme, batteries et défense" } },
  strontium:   { role: "import_dependent",   note: { en: "Import-dependent — Canada has celestite deposits in BC and Nova Scotia but no current production; imports from Spain and China", fr: "Dépendant des importations — le Canada a des gisements de célestite en C.-B. et en Nouvelle-Écosse mais pas de production actuelle ; importations d'Espagne et de Chine" } },
  bauxite:     { role: "import_dependent",   note: { en: "Import-dependent for feedstock — Canada is the 4th largest aluminium producer but has no domestic bauxite mines; imports alumina mainly from Brazil (73%)", fr: "Dépendant des importations pour les matières premières — le Canada est le 4e producteur d'aluminium mais n'a pas de mines de bauxite ; importe l'alumine principalement du Brésil (73 %)" } },
  zirconium:   { role: "import_dependent",   note: { en: "Import-dependent — Canada has zirconium in heavy mineral sands (Ontario, Quebec) but no primary production; imports from Australia and South Africa", fr: "Dépendant des importations — le Canada a du zirconium dans les sables minéraux lourds (Ontario, Québec) mais pas de production primaire ; importations d'Australie et d'Afrique du Sud" } },
  iron_ore:    { role: "major_producer",     note: { en: "Major producer of high-purity iron ore — Quebec (Labrador Trough) and Newfoundland; Canada added this to its critical minerals list in 2024 for its role in green steel and direct reduced iron (DRI)", fr: "Producteur important de minerai de fer haute pureté — Québec (fosse du Labrador) et Terre-Neuve ; le Canada l'a ajouté à sa liste en 2024 pour son rôle dans l'acier vert et la réduction directe du fer (DRI)" } },
};

// ─── Role config ──────────────────────────────────────────────────────────────

const ROLE_CONFIG: Record<CanadaRole, { label: { en: string; fr: string }; color: string }> = {
  major_producer:     { label: { en: "Major Producer",      fr: "Producteur important"   }, color: "#22c55e" },
  emerging_producer:  { label: { en: "Emerging Producer",   fr: "Producteur émergent"    }, color: "#f59e0b" },
  strategic_supplier: { label: { en: "Strategic Supplier",  fr: "Fournisseur stratégique"}, color: "#60a5fa" },
  import_dependent:   { label: { en: "Import-Dependent",    fr: "Dépendant des imports"  }, color: "#f87171" },
};

// ─── Mineral data (USGS MCS 2025, 2024 figures) ───────────────────────────────

const MINERAL_DATA: Record<string, Record<ViewMode, Record<string, { share: number; note?: string }>>> = {
  lithium: {
    production: { AUS: { share: 35 }, CHL: { share: 20 }, CHN: { share: 17 }, ARG: { share: 9 }, BRA: { share: 4 }, CAN: { share: 2 }, ZWE: { share: 2 }, PRT: { share: 1 } },
    reserves:   { CHL: { share: 35, note: "Atacama salt flats" }, AUS: { share: 22 }, ARG: { share: 12 }, CHN: { share: 8 }, BOL: { share: 7 }, USA: { share: 4 }, BRA: { share: 3 }, CAN: { share: 2 } },
  },
  cobalt: {
    production: { COD: { share: 74 }, IDN: { share: 5 }, RUS: { share: 4 }, PHL: { share: 3 }, AUS: { share: 2 }, CAN: { share: 2 }, ZMB: { share: 2 }, MDG: { share: 1 } },
    reserves:   { COD: { share: 52 }, AUS: { share: 15 }, CUB: { share: 5 }, IDN: { share: 5 }, RUS: { share: 4 }, PHL: { share: 3 }, ZMB: { share: 3 }, CAN: { share: 2 } },
  },
  nickel: {
    production: { IDN: { share: 52 }, PHL: { share: 10 }, RUS: { share: 6 }, CAN: { share: 5 }, NCL: { share: 4 }, AUS: { share: 4 }, CHN: { share: 4 }, BRA: { share: 2 } },
    reserves:   { IDN: { share: 42 }, AUS: { share: 16 }, BRA: { share: 11 }, RUS: { share: 7 }, PHL: { share: 5 }, CAN: { share: 3 }, CHN: { share: 3 }, ZMB: { share: 2 } },
  },
  graphite: {
    production: { CHN: { share: 77 }, MDG: { share: 5 }, MOZ: { share: 4 }, BRA: { share: 3 }, NOR: { share: 2 }, RUS: { share: 2 } },
    reserves:   { CHN: { share: 26 }, BRA: { share: 25 }, MOZ: { share: 10 }, MDG: { share: 7 }, TZA: { share: 5 }, RUS: { share: 5 }, CAN: { share: 3 } },
  },
  manganese: {
    production: { ZAF: { share: 34 }, GAB: { share: 16 }, AUS: { share: 14 }, GHA: { share: 7 }, CHN: { share: 6 }, IND: { share: 5 }, BRA: { share: 4 } },
    reserves:   { ZAF: { share: 33 }, AUS: { share: 17 }, CHN: { share: 12 }, BRA: { share: 10 }, UKR: { share: 7 }, IND: { share: 5 }, GAB: { share: 3 } },
  },
  copper: {
    production: { CHL: { share: 24 }, COD: { share: 12 }, PER: { share: 11 }, CHN: { share: 8 }, RUS: { share: 4 }, USA: { share: 4 }, AUS: { share: 3 }, CAN: { share: 3 }, ZMB: { share: 3 }, MEX: { share: 2 } },
    reserves:   { CHL: { share: 21 }, PER: { share: 10 }, AUS: { share: 9 }, COD: { share: 8 }, RUS: { share: 7 }, USA: { share: 6 }, CAN: { share: 4 }, MEX: { share: 3 }, ZMB: { share: 3 }, POL: { share: 2 } },
  },
  zinc: {
    production: { CHN: { share: 31 }, AUS: { share: 10 }, PER: { share: 10 }, IND: { share: 7 }, USA: { share: 5 }, MEX: { share: 5 }, KAZ: { share: 4 }, CAN: { share: 4 }, SWE: { share: 2 }, BRA: { share: 2 } },
    reserves:   { AUS: { share: 22 }, CHN: { share: 16 }, PER: { share: 11 }, MEX: { share: 7 }, IND: { share: 6 }, USA: { share: 5 }, KAZ: { share: 5 }, CAN: { share: 4 }, RUS: { share: 3 }, BRA: { share: 3 } },
  },
  tin: {
    production: { CHN: { share: 23 }, IDN: { share: 20 }, MMR: { share: 14 }, PER: { share: 7 }, BRA: { share: 7 }, BOL: { share: 6 }, AUS: { share: 3 }, VNM: { share: 3 } },
    reserves:   { CHN: { share: 25 }, IDN: { share: 18 }, BRA: { share: 16 }, BOL: { share: 10 }, AUS: { share: 9 }, RUS: { share: 5 }, PER: { share: 4 }, MMR: { share: 3 } },
  },
  bismuth: {
    // Bismuth is a by-product of lead/copper smelting; USGS MCS 2025 processing data
    production: { CHN: { share: 82, note: "Dominant refiner; most bismuth recovered from lead smelting" }, MEX: { share: 5 }, VNM: { share: 3 }, BEL: { share: 2 }, CAN: { share: 2, note: "By-product of lead smelting in New Brunswick" } },
    reserves:   { CHN: { share: 45 }, VNM: { share: 15 }, MEX: { share: 10 }, BOL: { share: 8 }, AUS: { share: 5 }, CAN: { share: 3 } },
  },
  uranium: {
    production: { KAZ: { share: 43 }, CAN: { share: 15, note: "Athabasca Basin, Saskatchewan" }, NAM: { share: 11 }, AUS: { share: 9 }, UZB: { share: 7 }, RUS: { share: 5 }, NER: { share: 4 }, ZMB: { share: 3 } },
    reserves:   { AUS: { share: 28 }, KAZ: { share: 13 }, CAN: { share: 9 }, RUS: { share: 8 }, NAM: { share: 7 }, ZAF: { share: 5 }, BRA: { share: 5 }, NER: { share: 4 }, CHN: { share: 4 } },
  },
  helium: {
    production: { USA: { share: 40, note: "Hugoton gas field — largest helium producer" }, QAT: { share: 30, note: "Ras Laffan industrial city" }, RUS: { share: 12 }, AUS: { share: 7 }, CAN: { share: 5, note: "Saskatchewan helium fields; rapidly growing" }, DZA: { share: 3 } },
    reserves:   { USA: { share: 35 }, QAT: { share: 25 }, RUS: { share: 15 }, AUS: { share: 8 }, CAN: { share: 6 }, DZA: { share: 4 } },
  },
  potash: {
    production: { CAN: { share: 31, note: "Saskatchewan — world's largest potash exporter; $8B in exports in 2024" }, RUS: { share: 19 }, BLR: { share: 18 }, CHN: { share: 12 }, DEU: { share: 6 }, ISR: { share: 4 }, JOR: { share: 3 }, USA: { share: 2 } },
    reserves:   { CAN: { share: 35, note: "Largest known reserves globally" }, RUS: { share: 18 }, BLR: { share: 15 }, CHN: { share: 10 }, DEU: { share: 5 }, ISR: { share: 3 }, JOR: { share: 3 }, USA: { share: 2 } },
  },
  phosphate: {
    production: { CHN: { share: 43 }, MAR: { share: 17, note: "Morocco + Western Sahara; largest reserves" }, EGY: { share: 7 }, RUS: { share: 6 }, SAU: { share: 5 }, BRA: { share: 5 }, VNM: { share: 3 }, USA: { share: 3 } },
    reserves:   { MAR: { share: 70, note: "Morocco holds ~70% of world phosphate reserves including Western Sahara" }, CHN: { share: 5 }, EGY: { share: 4 }, DZA: { share: 3 }, RUS: { share: 3 }, BRA: { share: 3 }, SAU: { share: 2 } },
  },
  magnesium: {
    production: { CHN: { share: 85, note: "Dominates global magnesium metal production" }, RUS: { share: 5 }, ISR: { share: 3 }, KAZ: { share: 3 }, USA: { share: 2 } },
    reserves:   { CHN: { share: 22 }, RUS: { share: 18 }, KOR: { share: 8 }, AUS: { share: 7 }, USA: { share: 6 }, BRA: { share: 5 }, IND: { share: 4 } },
  },
  fluorspar: {
    production: { CHN: { share: 60 }, MEX: { share: 15 }, MNG: { share: 7 }, ZAF: { share: 5 }, NAM: { share: 3 }, KEN: { share: 2 } },
    reserves:   { ZAF: { share: 17 }, MEX: { share: 15 }, CHN: { share: 14 }, MNG: { share: 10 }, RUS: { share: 8 }, NAM: { share: 6 }, ESP: { share: 5 } },
  },
  silicon: {
    // Silicon metal (not semiconductor-grade); USGS MCS 2025
    production: { CHN: { share: 60 }, NOR: { share: 8 }, BRA: { share: 7 }, USA: { share: 5 }, FRA: { share: 4 }, ISL: { share: 3 }, AUS: { share: 2 } },
    reserves:   { CHN: { share: 30 }, AUS: { share: 15 }, BRA: { share: 12 }, IND: { share: 10 }, USA: { share: 8 }, NOR: { share: 5 }, RUS: { share: 5 } },
  },
  rare_earths: {
    production: { CHN: { share: 67 }, USA: { share: 12 }, MMR: { share: 8 }, THA: { share: 4 }, AUS: { share: 4 }, IND: { share: 2 }, RUS: { share: 1 }, BRA: { share: 1 } },
    reserves:   { CHN: { share: 47 }, BRA: { share: 10 }, IND: { share: 6 }, AUS: { share: 5 }, RUS: { share: 5 }, VNM: { share: 4 }, GRL: { share: 3 }, CAN: { share: 2 }, USA: { share: 2 } },
  },
  pgm: {
    production: { ZAF: { share: 70 }, RUS: { share: 14 }, ZWE: { share: 5 }, CAN: { share: 4, note: "Sudbury ON, Nunavut — by-product of nickel" }, USA: { share: 3 }, AUS: { share: 2 } },
    reserves:   { ZAF: { share: 91, note: "Bushveld Complex" }, RUS: { share: 4 }, ZWE: { share: 2 }, CAN: { share: 1 }, USA: { share: 1 } },
  },
  gallium: {
    production: { CHN: { share: 80, note: "Export restrictions imposed July 2023" }, DEU: { share: 6 }, KAZ: { share: 4 }, JPN: { share: 3 }, CAN: { share: 2, note: "Trail smelter, BC" }, AUS: { share: 2 }, UKR: { share: 1 } },
    reserves:   { CHN: { share: 80 }, AUS: { share: 5 }, RUS: { share: 3 }, KAZ: { share: 3 }, CAN: { share: 2 }, DEU: { share: 2 }, USA: { share: 2 }, JPN: { share: 1 } },
  },
  indium: {
    // Indium is a by-product of zinc smelting; USGS MCS 2025
    production: { CHN: { share: 57 }, KOR: { share: 11 }, JPN: { share: 8 }, CAN: { share: 6, note: "Trail smelter, BC — top 3 global producer" }, BEL: { share: 5 }, FRA: { share: 4 }, DEU: { share: 3 } },
    reserves:   { CHN: { share: 44 }, AUS: { share: 11 }, USA: { share: 10 }, CAN: { share: 7 }, PER: { share: 7 }, RUS: { share: 5 }, MEX: { share: 4 } },
  },
  tellurium: {
    // Tellurium is a by-product of copper refining; USGS MCS 2025
    production: { CHN: { share: 50 }, JPN: { share: 10 }, RUS: { share: 8 }, CAN: { share: 7, note: "By-product of copper refining; key US solar/defence supplier" }, USA: { share: 5 }, BEL: { share: 4 }, PER: { share: 3 } },
    reserves:   { CHN: { share: 30 }, USA: { share: 20 }, PER: { share: 15 }, CAN: { share: 8 }, AUS: { share: 7 }, RUS: { share: 5 }, MEX: { share: 4 } },
  },
  cesium: {
    // Cesium — Bernic Lake (Manitoba) is the world's largest known pollucite deposit
    production: { CAN: { share: 70, note: "Bernic Lake, Manitoba (Tanco Mine) — world's largest pollucite deposit; historically ~70% of global supply" }, ZWE: { share: 20, note: "Bikita mine" }, NAM: { share: 7 } },
    reserves:   { CAN: { share: 65, note: "Bernic Lake, Manitoba" }, ZWE: { share: 20 }, NAM: { share: 8 } },
  },
  scandium: {
    // Scandium — primarily by-product of titanium, uranium, and nickel processing; USGS MCS 2025
    production: { CHN: { share: 66 }, RUS: { share: 15 }, UKR: { share: 8 }, AUS: { share: 5 }, PHL: { share: 3 } },
    reserves:   { CHN: { share: 40 }, RUS: { share: 20 }, UKR: { share: 10 }, AUS: { share: 8 }, NOR: { share: 5 }, USA: { share: 4 } },
  },
  chromium: {
    production: { ZAF: { share: 41 }, KAZ: { share: 18 }, TUR: { share: 8 }, IND: { share: 8 }, FIN: { share: 5 }, ZWE: { share: 3 } },
    reserves:   { ZWE: { share: 35 }, KAZ: { share: 25 }, ZAF: { share: 20 }, IND: { share: 6 }, TUR: { share: 4 }, FIN: { share: 3 } },
  },
  vanadium: {
    production: { CHN: { share: 57 }, RUS: { share: 17 }, ZAF: { share: 10 }, BRA: { share: 8 }, AUS: { share: 3 } },
    reserves:   { CHN: { share: 39 }, AUS: { share: 23 }, RUS: { share: 20 }, ZAF: { share: 5 }, BRA: { share: 4 }, USA: { share: 3 } },
  },
  molybdenum: {
    production: { CHN: { share: 43 }, CHL: { share: 17 }, USA: { share: 12 }, PER: { share: 7 }, MEX: { share: 6 }, CAN: { share: 5, note: "Endako mine BC; Highland Valley Copper by-product" }, ARM: { share: 3 } },
    reserves:   { CHN: { share: 37 }, USA: { share: 19 }, CHL: { share: 13 }, PER: { share: 8 }, MEX: { share: 6 }, RUS: { share: 5 }, CAN: { share: 4 } },
  },
  tungsten: {
    production: { CHN: { share: 80, note: "Export restrictions tightened 2023" }, VNM: { share: 8 }, RUS: { share: 3 }, AUT: { share: 2 }, BOL: { share: 2 }, ESP: { share: 2 } },
    reserves:   { CHN: { share: 51 }, VNM: { share: 9 }, RUS: { share: 8 }, AUT: { share: 5 }, BOL: { share: 5 }, CAN: { share: 3, note: "Yukon, NWT deposits — not currently mined" }, USA: { share: 3 } },
  },
  niobium: {
    production: { BRA: { share: 88, note: "CBMM (Companhia Brasileira de Metalurgia e Mineração) — dominant global supplier" }, CAN: { share: 9, note: "Niobec Mine, Quebec (Magris Resources)" }, AUS: { share: 2 } },
    reserves:   { BRA: { share: 95, note: "Araxá and Catalão deposits" }, CAN: { share: 3 }, AUS: { share: 1 } },
  },
  titanium: {
    production: { CHN: { share: 34 }, AUS: { share: 18 }, ZAF: { share: 12 }, MOZ: { share: 6 }, IND: { share: 6 }, CAN: { share: 5, note: "Quebec ilmenite and rutile deposits" }, NOR: { share: 5 }, UKR: { share: 4 } },
    reserves:   { CHN: { share: 38 }, AUS: { share: 21 }, IND: { share: 11 }, ZAF: { share: 8 }, MOZ: { share: 5 }, CAN: { share: 3 }, NOR: { share: 3 } },
  },
  antimony: {
    production: { CHN: { share: 48, note: "Export restrictions imposed 2024" }, TJK: { share: 25 }, RUS: { share: 5 }, BOL: { share: 4 }, AUS: { share: 3 }, TUR: { share: 3 }, MMR: { share: 3 }, GUY: { share: 2 } },
    reserves:   { CHN: { share: 35 }, RUS: { share: 19 }, BOL: { share: 10 }, AUS: { share: 7 }, TJK: { share: 5 }, TUR: { share: 4 }, MEX: { share: 3 }, ZAF: { share: 3 } },
  },
  strontium: {
    production: { CHN: { share: 40 }, ESP: { share: 35, note: "Spain is the world's leading celestite producer" }, MEX: { share: 15 }, IRN: { share: 5 }, TUR: { share: 3 } },
    reserves:   { ESP: { share: 30 }, CHN: { share: 25 }, MEX: { share: 15 }, IRN: { share: 10 }, TUR: { share: 5 }, ARG: { share: 5 } },
  },
  bauxite: {
    production: { AUS: { share: 27 }, GIN: { share: 24 }, CHN: { share: 22 }, BRA: { share: 8 }, IND: { share: 6 }, IDN: { share: 4 }, GNB: { share: 2 } },
    reserves:   { GIN: { share: 24 }, AUS: { share: 20 }, VNM: { share: 12 }, BRA: { share: 9 }, JAM: { share: 5 }, IDN: { share: 4 }, CHN: { share: 3 }, IND: { share: 3 } },
  },
  zirconium: {
    production: { AUS: { share: 38 }, ZAF: { share: 24 }, CHN: { share: 12 }, MOZ: { share: 8 }, IND: { share: 6 }, SEN: { share: 4 }, UKR: { share: 3 } },
    reserves:   { AUS: { share: 63 }, ZAF: { share: 14 }, CHN: { share: 5 }, IND: { share: 5 }, MOZ: { share: 4 }, UKR: { share: 3 } },
  },
  iron_ore: {
    // High-purity iron ore (DR-grade, >67% Fe) — added to NRCan list 2024
    production: { AUS: { share: 38 }, BRA: { share: 18 }, CHN: { share: 14 }, IND: { share: 8 }, RUS: { share: 5 }, CAN: { share: 5, note: "Labrador Trough, Quebec and Newfoundland — high-purity DR-grade ore for green steel" }, SWE: { share: 3 }, UKR: { share: 3 } },
    reserves:   { AUS: { share: 29 }, BRA: { share: 17 }, RUS: { share: 14 }, CHN: { share: 12 }, IND: { share: 6 }, CAN: { share: 4 }, UKR: { share: 4 }, SWE: { share: 2 } },
  },
};

// ─── Geopolitical notes ───────────────────────────────────────────────────────

const GEOPOLITICAL_NOTES: Record<string, { en: string; fr: string }> = {
  lithium:     { en: "The 'Lithium Triangle' (Chile, Argentina, Bolivia) holds over 50% of known reserves. China dominates refining despite producing only 17% of raw ore. Canada has emerging projects in Quebec and Alberta.", fr: "Le 'Triangle du lithium' (Chili, Argentine, Bolivie) détient plus de 50 % des réserves connues. La Chine domine le raffinage malgré une production minière de seulement 17 %. Le Canada développe des projets au Québec et en Alberta." },
  cobalt:      { en: "DRC produces ~74% of mined cobalt but China refines ~76% of global supply — the most critical chokepoint in EV battery supply chains. Canada produces ~2% as a by-product of nickel mining.", fr: "La RDC produit ~74 % du cobalt extrait, mais la Chine en raffine ~76 % — le goulot d'étranglement le plus critique dans les chaînes d'approvisionnement des batteries VE." },
  nickel:      { en: "Indonesia dominates both mining (52%) and reserves (42%). Canada is a significant producer with ~5% of mine output from Ontario and Manitoba — a key supplier to the US defence and EV sectors.", fr: "L'Indonésie domine l'extraction (52 %) et les réserves (42 %). Le Canada est un producteur important avec ~5 % de la production minière (Ontario, Manitoba) — fournisseur clé pour la défense américaine et le secteur VE." },
  graphite:    { en: "China mines 77% of graphite but holds only 26% of reserves. Brazil has comparable reserves but minimal production. Canada has emerging Quebec deposits but imports most refined battery-grade graphite from China.", fr: "La Chine extrait 77 % du graphite mais ne détient que 26 % des réserves. Le Brésil a des réserves comparables mais une production minimale. Le Canada développe des gisements au Québec mais importe la majorité du graphite raffiné de Chine." },
  manganese:   { en: "South Africa dominates both production and reserves. Africa collectively holds over 60% of global manganese reserves. Canada has no significant domestic production and is fully import-dependent.", fr: "L'Afrique du Sud domine production et réserves. L'Afrique dans son ensemble détient plus de 60 % des réserves mondiales de manganèse. Le Canada n'a pas de production nationale significative." },
  copper:      { en: "Chile is the undisputed leader in production and reserves. Canada holds ~4% of reserves and ~3% of mine output (BC, Ontario, Quebec). Copper exports to the US totalled $5.6B in 2024.", fr: "Le Chili est le leader incontesté en production et en réserves. Le Canada détient ~4 % des réserves et ~3 % de la production (C.-B., Ontario, Québec). Les exportations de cuivre vers les É.-U. ont atteint 5,6 G$ en 2024." },
  zinc:        { en: "China dominates zinc production (31%) but Canada is a top 5 producer (~4%) with major operations in BC, Yukon, New Brunswick and Nova Scotia. Canada's Trail smelter (BC) is also a key source of gallium and indium as by-products.", fr: "La Chine domine la production de zinc (31 %) mais le Canada est dans le top 5 (~4 %) avec des opérations majeures en C.-B., Yukon, Nouveau-Brunswick et Nouvelle-Écosse. La fonderie de Trail produit aussi du gallium et de l'indium." },
  tin:         { en: "China and Indonesia together account for ~43% of global tin production. Myanmar has become a major producer. Canada has no significant tin production and is fully import-dependent.", fr: "La Chine et l'Indonésie représentent ensemble ~43 % de la production mondiale d'étain. Le Myanmar est devenu un producteur majeur. Le Canada n'a pas de production significative d'étain." },
  bismuth:     { en: "China dominates bismuth refining (~82%). Bismuth is used in pharmaceuticals, cosmetics, and as a lead substitute. Canada recovers small amounts as a by-product of lead smelting in New Brunswick.", fr: "La Chine domine le raffinage du bismuth (~82 %). Le bismuth est utilisé en pharmacie, cosmétiques et comme substitut au plomb. Le Canada en récupère de petites quantités en sous-produit du plomb au Nouveau-Brunswick." },
  uranium:     { en: "Canada is the world's 2nd largest uranium producer (15%), centred on the Athabasca Basin in Saskatchewan — home to the world's highest-grade deposits. Russia dominates enrichment with ~40% of global capacity.", fr: "Le Canada est le 2e producteur mondial d'uranium (15 %), centré sur le bassin d'Athabasca en Saskatchewan. La Russie domine l'enrichissement avec ~40 % de la capacité mondiale." },
  helium:      { en: "The US and Qatar together supply ~70% of global helium. Russia is the third largest producer. Canada's Saskatchewan helium fields are rapidly expanding, reducing North American dependence on US reserves.", fr: "Les É.-U. et le Qatar fournissent ensemble ~70 % de l'hélium mondial. La Russie est le 3e producteur. Les champs d'hélium de la Saskatchewan se développent rapidement, réduisant la dépendance nord-américaine aux réserves américaines." },
  potash:      { en: "Canada is the world's largest potash exporter (~31% of production, ~35% of reserves), all from Saskatchewan. Russia and Belarus — together ~37% of production — face sanctions, making Canada's supply even more strategic for global food security.", fr: "Le Canada est le plus grand exportateur mondial de potasse (~31 % de la production, ~35 % des réserves), entièrement en Saskatchewan. La Russie et la Biélorussie — ensemble ~37 % — font face à des sanctions, rendant l'offre canadienne encore plus stratégique pour la sécurité alimentaire mondiale." },
  phosphate:   { en: "Morocco holds ~70% of world phosphate reserves (including Western Sahara) — an extraordinary concentration for a food-critical mineral. China dominates production at 43%. Canada has no significant production and imports from Morocco and the US.", fr: "Le Maroc détient ~70 % des réserves mondiales de phosphate (y compris le Sahara occidental) — une concentration extraordinaire pour un minéral critique pour l'alimentation. La Chine domine la production à 43 %. Le Canada importe du Maroc et des É.-U." },
  magnesium:   { en: "China produces ~85% of global magnesium metal — the most extreme concentration of any industrial metal. The US, EU and Canada are all ~100% import-dependent. Canada added magnesium to its critical minerals list due to its role in lightweight alloys for aerospace and automotive.", fr: "La Chine produit ~85 % du magnésium métal mondial — la concentration la plus extrême parmi les métaux industriels. Les É.-U., l'UE et le Canada sont tous dépendants à ~100 % des importations. Le Canada l'a ajouté à sa liste pour son rôle dans les alliages légers pour l'aérospatiale et l'automobile." },
  fluorspar:   { en: "China produces 60% of global fluorspar. Mexico is the second largest producer. Fluorspar is essential for hydrofluoric acid, aluminum smelting, and refrigerants. Canada has deposits in Newfoundland but minimal production.", fr: "La Chine produit 60 % de la fluorine mondiale. Le Mexique est le 2e producteur. La fluorine est essentielle pour l'acide fluorhydrique, la fusion de l'aluminium et les réfrigérants. Le Canada a des gisements en Terre-Neuve mais une production minimale." },
  silicon:     { en: "China produces ~60% of global silicon metal. Silicon metal (distinct from semiconductor silicon) is used in aluminum alloys, solar panels, and chemicals. Canada added it to its critical minerals list in 2024 and is 100% import-dependent.", fr: "La Chine produit ~60 % du silicium métal mondial. Le silicium métal (distinct du silicium semiconducteur) est utilisé dans les alliages d'aluminium, les panneaux solaires et les produits chimiques. Le Canada l'a ajouté à sa liste en 2024 et est dépendant à 100 % des importations." },
  rare_earths: { en: "China controls 67% of mining and ~90% of refining — the most concentrated supply chain of any critical mineral. Canada has emerging deposits in Quebec, NWT and Labrador but currently exports raw ore to China for refining.", fr: "La Chine contrôle 67 % de l'extraction et ~90 % du raffinage — la chaîne d'approvisionnement la plus concentrée parmi les minéraux critiques. Le Canada développe des gisements au Québec, TNO et Labrador mais exporte le minerai brut vers la Chine pour le raffinage." },
  pgm:         { en: "South Africa's Bushveld Complex holds ~91% of world PGM reserves — an extraordinary concentration. Canada is a strategic supplier to the US (Sudbury, Ontario and Nunavut), producing ~4% of global PGMs as a by-product of nickel mining.", fr: "Le complexe du Bushveld en Afrique du Sud détient ~91 % des réserves mondiales de MPG. Le Canada est un fournisseur stratégique des É.-U. (Sudbury, Ontario et Nunavut), produisant ~4 % des MPG mondiaux en sous-produit du nickel." },
  gallium:     { en: "China controls ~80% of global gallium production and imposed export restrictions in July 2023, triggering supply chain alerts in the US, EU and Canada. Canada's Trail smelter (BC) produces gallium as a by-product of zinc refining — a strategic asset whose value has risen sharply since the Chinese export ban.", fr: "La Chine contrôle ~80 % de la production mondiale de gallium et a imposé des restrictions à l'exportation en juillet 2023. La fonderie de Trail (C.-B.) produit du gallium en sous-produit du zinc — un atout stratégique dont la valeur a fortement augmenté." },
  indium:      { en: "China dominates indium production (57%). Canada's Trail smelter (BC) is a top 3 global producer as a by-product of zinc refining. Indium is critical for LCD screens, solar cells, and semiconductors.", fr: "La Chine domine la production d'indium (57 %). La fonderie de Trail (C.-B.) est dans le top 3 mondial en sous-produit du zinc. L'indium est critique pour les écrans LCD, les cellules solaires et les semiconducteurs." },
  tellurium:   { en: "China produces ~50% of global tellurium. Canada is a top 5 producer as a by-product of copper refining — a key supplier to the US solar and defence sectors. Tellurium is essential for CdTe solar panels and thermoelectric devices.", fr: "La Chine produit ~50 % du tellure mondial. Le Canada est dans le top 5 en sous-produit du raffinage du cuivre — fournisseur clé pour les secteurs solaire et défense américains. Le tellure est essentiel pour les panneaux solaires CdTe." },
  cesium:      { en: "Canada dominates global cesium supply (~70%) through the Tanco Mine at Bernic Lake, Manitoba — the world's largest known pollucite deposit. Cesium is used in atomic clocks, drilling fluids, and advanced electronics. Zimbabwe's Bikita mine is the second source.", fr: "Le Canada domine l'offre mondiale de césium (~70 %) grâce à la mine Tanco au lac Bernic, Manitoba — le plus grand gisement connu de pollucite au monde. Le césium est utilisé dans les horloges atomiques, les fluides de forage et l'électronique avancée." },
  scandium:    { en: "China and Russia together produce ~80% of global scandium. Scandium is used in solid oxide fuel cells, aluminum alloys for aerospace, and high-intensity lighting. Canada has scandium in nickel tailings but no primary production.", fr: "La Chine et la Russie produisent ensemble ~80 % du scandium mondial. Le scandium est utilisé dans les piles à combustible à oxyde solide, les alliages d'aluminium pour l'aérospatiale et l'éclairage haute intensité. Le Canada a du scandium dans les résidus de nickel mais pas de production primaire." },
  chromium:    { en: "South Africa is the dominant producer; Zimbabwe holds the largest reserves but has limited production capacity. Canada has only minor chromium production in Ontario and is largely import-dependent.", fr: "L'Afrique du Sud est le producteur dominant ; le Zimbabwe détient les plus grandes réserves mais dispose d'une capacité de production limitée. Le Canada n'a qu'une production mineure en Ontario." },
  vanadium:    { en: "China, Russia and South Africa together produce ~84% of global vanadium. Vanadium is used in high-strength steel, vanadium redox flow batteries (grid storage), and aerospace alloys. Canada has vanadium in Alberta oil sands but no primary mine production.", fr: "La Chine, la Russie et l'Afrique du Sud produisent ensemble ~84 % du vanadium mondial. Le vanadium est utilisé dans l'acier haute résistance, les batteries à flux redox (stockage réseau) et les alliages aérospatiaux. Le Canada a du vanadium dans les sables bitumineux de l'Alberta mais pas de production minière primaire." },
  molybdenum:  { en: "China is the largest molybdenum producer (43%), followed by Chile (17%) and the US (12%). Canada is a top 5 producer (~5%) from BC operations. Molybdenum is critical for high-strength steel alloys used in pipelines, defence, and energy infrastructure.", fr: "La Chine est le plus grand producteur de molybdène (43 %), suivie du Chili (17 %) et des É.-U. (12 %). Le Canada est dans le top 5 (~5 %) grâce aux opérations en C.-B. Le molybdène est critique pour les alliages d'acier haute résistance utilisés dans les pipelines, la défense et l'infrastructure énergétique." },
  tungsten:    { en: "China produces ~80% of global tungsten and tightened export restrictions in 2023. Tungsten has the highest melting point of any metal and is critical for cutting tools, armour-piercing ammunition, and electronics. Canada has deposits in Yukon and NWT but no current production.", fr: "La Chine produit ~80 % du tungstène mondial et a renforcé les restrictions à l'exportation en 2023. Le tungstène a le point de fusion le plus élevé de tous les métaux et est critique pour les outils de coupe, les munitions perforantes et l'électronique. Le Canada a des gisements au Yukon et dans les TNO mais pas de production actuelle." },
  niobium:     { en: "Brazil's CBMM dominates global niobium production (88%) from the Araxá deposit — one of the most extreme supply concentrations of any mineral. Canada's Niobec Mine in Quebec is the world's second source (~9%). Niobium is essential for high-strength low-alloy (HSLA) steel.", fr: "Le CBMM brésilien domine la production mondiale de niobium (88 %) depuis le gisement d'Araxá — l'une des concentrations d'approvisionnement les plus extrêmes de tous les minéraux. La mine Niobec au Québec est la deuxième source mondiale (~9 %). Le niobium est essentiel pour l'acier haute résistance faiblement allié (HSLA)." },
  titanium:    { en: "China dominates titanium ore production (34%) and controls ~69% of titanium metal processing. Australia has the largest reserves. Canada produces ilmenite and rutile in Quebec and Ontario — important for aerospace, medical implants, and pigments.", fr: "La Chine domine la production de minerai de titane (34 %) et contrôle ~69 % de la transformation du métal de titane. L'Australie a les plus grandes réserves. Le Canada produit de l'ilménite et du rutile au Québec et en Ontario — important pour l'aérospatiale, les implants médicaux et les pigments." },
  antimony:    { en: "China controls ~48% of global antimony production and imposed export restrictions in 2024. Canada has no domestic production and is 100% import-dependent. Antimony is critical for flame retardants, lead-acid batteries, and military applications.", fr: "La Chine contrôle ~48 % de la production mondiale d'antimoine et a imposé des restrictions à l'exportation en 2024. Le Canada n'a aucune production nationale et est dépendant à 100 % des importations. L'antimoine est critique pour les retardateurs de flamme, les batteries plomb-acide et les applications militaires." },
  strontium:   { en: "Spain is the world's leading celestite (strontium ore) producer (35%), followed by China (40%). Strontium is used in ferrite magnets, pyrotechnics, and nuclear waste treatment. Canada has deposits in BC and Nova Scotia but no current production.", fr: "L'Espagne est le principal producteur mondial de célestite (minerai de strontium) (35 %), suivie de la Chine (40 %). Le strontium est utilisé dans les aimants en ferrite, les pyrotechnies et le traitement des déchets nucléaires. Le Canada a des gisements en C.-B. et en Nouvelle-Écosse mais pas de production actuelle." },
  bauxite:     { en: "Guinea holds the largest reserves but Australia and China dominate production. Canada is the world's 4th largest aluminium producer but has no domestic bauxite mines — it imports alumina mainly from Brazil (73% of imports in 2024).", fr: "La Guinée détient les plus grandes réserves, mais l'Australie et la Chine dominent la production. Le Canada est le 4e producteur mondial d'aluminium mais n'a pas de mines de bauxite — il importe l'alumine principalement du Brésil (73 % des importations en 2024)." },
  zirconium:   { en: "Australia dominates global zirconium production (38%) and holds 63% of known reserves. South Africa is the second largest producer. Zirconium is used in nuclear reactors, ceramics, and medical devices. Canada has zirconium in heavy mineral sands but no primary production.", fr: "L'Australie domine la production mondiale de zirconium (38 %) et détient 63 % des réserves connues. L'Afrique du Sud est le 2e producteur. Le zirconium est utilisé dans les réacteurs nucléaires, les céramiques et les dispositifs médicaux. Le Canada a du zirconium dans les sables minéraux lourds mais pas de production primaire." },
  iron_ore:    { en: "Australia and Brazil together produce ~56% of global iron ore. Canada added high-purity iron ore (DR-grade, >67% Fe) to its critical minerals list in 2024 for its role in green steel production via direct reduced iron (DRI). The Labrador Trough (Quebec/Newfoundland) is Canada's primary source.", fr: "L'Australie et le Brésil produisent ensemble ~56 % du minerai de fer mondial. Le Canada a ajouté le minerai de fer haute pureté (qualité DRI, >67 % Fe) à sa liste en 2024 pour son rôle dans la production d'acier vert via la réduction directe du fer (DRI). La fosse du Labrador (Québec/Terre-Neuve) est la principale source canadienne." },
};

// ─── Colour scale ─────────────────────────────────────────────────────────────

function getColor(share: number, baseColor: string): string {
  if (share === 0) return "#1e293b";
  const opacity = Math.min(0.15 + (share / 100) * 0.85, 1);
  const r = parseInt(baseColor.slice(1, 3), 16);
  const g = parseInt(baseColor.slice(3, 5), 16);
  const b = parseInt(baseColor.slice(5, 7), 16);
  const bg = 30;
  return `rgb(${Math.round(bg + (r - bg) * opacity)},${Math.round(bg + (g - bg) * opacity)},${Math.round(bg + (b - bg) * opacity)})`;
}

// ─── ISO numeric → ISO-3 ─────────────────────────────────────────────────────

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const ISO_NUM_TO_3: Record<string, string> = {
  "036": "AUS", "032": "ARG", "076": "BRA", "124": "CAN", "152": "CHL",
  "156": "CHN", "170": "COL", "180": "COD", "192": "CUB", "246": "FIN",
  "266": "GAB", "276": "DEU", "288": "GHA", "324": "GIN", "356": "IND",
  "360": "IDN", "392": "JPN", "398": "KAZ", "404": "KEN", "484": "MEX",
  "516": "NAM", "540": "NCL", "558": "NIC", "566": "NGA", "578": "NOR",
  "586": "PAK", "604": "PER", "608": "PHL", "616": "POL", "630": "PRI",
  "643": "RUS", "710": "ZAF", "724": "ESP", "752": "SWE", "764": "THA",
  "792": "TUR", "800": "UGA", "804": "UKR", "840": "USA", "858": "URY",
  "860": "UZB", "704": "VNM", "894": "ZMB", "716": "ZWE", "450": "MDG",
  "508": "MOZ", "834": "TZA", "562": "NER", "104": "MMR", "304": "GRL",
  "388": "JAM", "068": "BOL", "112": "BLR", "376": "ISR", "400": "JOR",
  "762": "TJK", "328": "GUY", "624": "GNB", "410": "KOR", "040": "AUT",
  "056": "BEL", "250": "FRA", "352": "ISL", "364": "IRN", "682": "SAU",
  "012": "DZA", "504": "MAR", "686": "SEN", "051": "ARM", "496": "MNG",
};

// ─── Component ────────────────────────────────────────────────────────────────

interface TooltipData {
  country: string;
  iso3: string;
  share: number;
  note?: string;
  x: number;
  y: number;
}

export default function CriticalMineralsMap() {
  const { language } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

    useEffect(() => {
    const prev = document.title;
    document.title = language === "fr"
      ? "Carte des minéraux critiques par TransHorizons"
      : "Critical Minerals Map by TransHorizons";
    return () => { document.title = prev; };
  }, [language]);
  const lang = language as "en" | "fr";

  const [selectedMineral, setSelectedMineral] = useState("lithium");
  const [viewMode, setViewMode] = useState<ViewMode>("production");
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const DEFAULT_ZOOM = 1;
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [center, setCenter] = useState<[number, number]>([0, 10]);
  const [canadaOnly, setCanadaOnly] = useState(false);

  const mineral = MINERALS.find((m) => m.id === selectedMineral)!;
  const data = MINERAL_DATA[selectedMineral]?.[viewMode] ?? {};
  const geoNote = GEOPOLITICAL_NOTES[selectedMineral]?.[lang] ?? "";
  const canadaRole = CANADA_ROLE[selectedMineral];
  const roleConfig = canadaRole ? ROLE_CONFIG[canadaRole.role] : null;

  // Canada-only: minerals where Canada appears in the dataset
  const canadaMinerals = MINERALS.filter((m) => {
    const prod = MINERAL_DATA[m.id]?.production ?? {};
    const res = MINERAL_DATA[m.id]?.reserves ?? {};
    return "CAN" in prod || "CAN" in res;
  });
  const visibleMinerals = canadaOnly ? canadaMinerals : MINERALS;

  // If selected mineral is not visible after toggle, switch to first visible
  const effectiveMineral = visibleMinerals.find((m) => m.id === selectedMineral)
    ? selectedMineral
    : visibleMinerals[0]?.id ?? selectedMineral;
  const effectiveMineralObj = MINERALS.find((m) => m.id === effectiveMineral)!;
  const effectiveData = MINERAL_DATA[effectiveMineral]?.[viewMode] ?? {};
  const effectiveGeoNote = GEOPOLITICAL_NOTES[effectiveMineral]?.[lang] ?? "";
  const effectiveCanadaRole = CANADA_ROLE[effectiveMineral];
  const effectiveRoleConfig = effectiveCanadaRole ? ROLE_CONFIG[effectiveCanadaRole.role] : null;

  const getCountryShare = useCallback(
    (isoNum: string): { share: number; note?: string } => {
      const iso3 = ISO_NUM_TO_3[isoNum];
      if (!iso3) return { share: 0 };
      return effectiveData[iso3] ?? { share: 0 };
    },
    [effectiveData]
  );

  const labels = {
    title:         { en: "Critical Minerals World Map", fr: "Carte mondiale des minéraux critiques" },
    subtitle:      { en: "All 34 minerals on Canada's NRCan critical minerals list (June 2024)", fr: "Les 34 minéraux de la liste des minéraux critiques du Canada — RNCan (juin 2024)" },
    production:    { en: "Mine Production", fr: "Production minière" },
    reserves:      { en: "Known Reserves", fr: "Réserves connues" },
    sources:       { en: "Sources", fr: "Sources" },
    noData:        { en: "No significant data", fr: "Données non significatives" },
    shareLabel:    { en: "Share of global", fr: "Part mondiale" },
    zoomIn:        { en: "Zoom in", fr: "Zoom avant" },
    zoomOut:       { en: "Zoom out", fr: "Zoom arrière" },
    reset:         { en: "Reset view", fr: "Réinitialiser" },
    geopolitical:  { en: "Geopolitical Note", fr: "Note géopolitique" },
    canadaRole:    { en: "Canada's Role", fr: "Rôle du Canada" },
    topProducers:  { en: "Top producers", fr: "Principaux producteurs" },
    canadaFilter:  { en: "Canada-relevant only", fr: "Pertinents pour le Canada" },
    allMinerals:   { en: "All 34 minerals", fr: "Les 34 minéraux" },
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans">
      {/* Header */}
      <div className="border-b border-slate-700/60 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Back link */}
          <Link
            href="/world-analysis"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[#C8860A] transition-colors font-body text-sm mb-4 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            {lang === "fr" ? "Retour à l'Analyse mondiale" : "Back to World Analysis"}
          </Link>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">
            TransHorizons · {labels.sources[lang]}: USGS MCS 2025 · NRCan 2024 · Our World in Data 2026
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
            {labels.title[lang]}
          </h1>
          <p className="text-slate-400 text-sm">{labels.subtitle[lang]}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Controls row */}
        <div className="flex flex-wrap gap-3 mb-5 items-center">
          {/* View mode toggle */}
          <div className="flex rounded-lg overflow-hidden border border-slate-700">
            {(["production", "reserves"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  viewMode === mode
                    ? "bg-slate-600 text-white"
                    : "bg-slate-800/60 text-slate-400 hover:text-slate-200"
                }`}
              >
                {labels[mode][lang]}
              </button>
            ))}
          </div>

          {/* Canada-only toggle */}
          <button
            onClick={() => setCanadaOnly((v) => !v)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
              canadaOnly
                ? "bg-amber-500/20 border-amber-400 text-amber-300"
                : "bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${canadaOnly ? "bg-amber-400" : "bg-slate-600"}`} />
            🍁 {canadaOnly ? labels.canadaFilter[lang] : labels.canadaFilter[lang]}
          </button>

          {/* Zoom controls */}
          <div className="flex rounded-lg overflow-hidden border border-slate-700 ml-auto">
            <button onClick={() => setZoom((z) => Math.min(z * 1.5, 8))} className="px-3 py-2 bg-slate-800/60 text-slate-400 hover:text-white text-sm" title={labels.zoomIn[lang]}>+</button>
            <button onClick={() => setZoom((z) => Math.max(z / 1.5, 1))} className="px-3 py-2 bg-slate-800/60 text-slate-400 hover:text-white text-sm border-x border-slate-700" title={labels.zoomOut[lang]}>−</button>
            <button onClick={() => { setZoom(DEFAULT_ZOOM); setCenter([0, 10]); }} className="px-3 py-2 bg-slate-800/60 text-slate-400 hover:text-white text-sm" title={labels.reset[lang]}>↺</button>
          </div>
        </div>

        {/* Mineral selector — 2-row horizontal scroll */}
        <div className="mb-3 overflow-x-auto pb-1" style={{ WebkitOverflowScrolling: "touch" }}>
          <div className="grid grid-rows-2 grid-flow-col gap-1" style={{ gridTemplateRows: "repeat(2, auto)", width: "max-content" }}>
          {visibleMinerals.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMineral(m.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                effectiveMineral === m.id
                  ? "border-transparent text-white shadow-lg"
                  : "border-slate-700 text-slate-400 hover:text-slate-200 bg-slate-800/40"
              }`}
              style={effectiveMineral === m.id ? { backgroundColor: m.color, borderColor: m.color } : {}}
            >
              <span className="font-mono text-[10px] opacity-80">{m.symbol}</span>
              {m.label[lang]}
            </button>
          ))}
          </div>
          {canadaOnly && (
            <p className="text-xs text-slate-500 italic mt-1.5">
              🍁 {canadaMinerals.length} / 34 {lang === "en" ? "minerals where Canada appears in dataset" : "minéraux où le Canada figure dans les données"}
            </p>
          )}
        </div>

        {/* Compact layout: left map stack + right insights column */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-3">
          {/* Left column: mine production + top producers + map */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Colour scale */}
              <div className="bg-slate-900/60 rounded-xl border border-slate-700/50 p-3">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">
                  {viewMode === "production" ? labels.production[lang] : labels.reserves[lang]}
                </p>
                <div className="h-2.5 rounded-full mb-1.5" style={{ background: `linear-gradient(to right, ${getColor(5, effectiveMineralObj.color)}, ${effectiveMineralObj.color})` }} />
                <div className="flex justify-between text-xs text-slate-500 mb-2"><span>&lt;5%</span><span>50%+</span></div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-2.5 rounded-sm bg-[#1e293b] border border-slate-600 shrink-0" />
                  <p className="text-[11px] text-slate-400">{lang === "en" ? "No data / not in dataset" : "Hors données"}</p>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-3.5 h-2.5 rounded-sm bg-[#1e293b] border-amber-400 shrink-0" style={{ borderWidth: "1.5px", borderStyle: "solid" }} />
                  <p className="text-[11px] text-slate-400">{lang === "en" ? "Canada (amber)" : "Canada (ambré)"}</p>
                </div>
              </div>

              {/* Top 6 */}
              <div className="bg-slate-900/60 rounded-xl border border-slate-700/50 p-3">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">{labels.topProducers[lang]}</p>
                <ol className="space-y-1">
                  {Object.entries(effectiveData)
                    .sort((a, b) => b[1].share - a[1].share)
                    .slice(0, 6)
                    .map(([iso3, { share }], i) => (
                      <li key={iso3} className="flex items-center gap-1.5">
                        <span className="text-slate-600 w-3 text-right text-[10px]">{i + 1}</span>
                        <div className="h-1 rounded-full shrink-0" style={{ width: `${(share / 80) * 72}px`, backgroundColor: effectiveMineralObj.color, opacity: 0.8 - i * 0.08 }} />
                        <span className={`text-[11px] ${iso3 === "CAN" ? "text-amber-400 font-semibold" : "text-slate-300"}`}>{iso3}</span>
                        <span className="text-slate-500 text-[10px] ml-auto">{share}%</span>
                      </li>
                    ))}
                </ol>
              </div>
            </div>

            {/* Map */}
            <div
              className="relative rounded-xl border border-slate-700/50 overflow-hidden w-full"
              style={{ background: "#0f172a" }}
              onMouseLeave={() => setTooltip(null)}
            >
              <ComposableMap
                projectionConfig={{ scale: 155, center: [0, 10] }}
                width={800}
                height={400}
                style={{ width: "100%", height: "auto", display: "block", margin: "-2% 0" }}
              >
                <ZoomableGroup zoom={zoom} center={center} onMoveEnd={({ coordinates, zoom: z }: { coordinates: [number, number]; zoom: number }) => { setCenter(coordinates); setZoom(z); }}>
                  <Geographies geography={GEO_URL}>
                    {({ geographies }: GeographiesChildrenArgument) =>
                      geographies.map((geo: GeoFeature) => {
                        const isoNum = String(geo.id).padStart(3, "0");
                        const { share, note } = getCountryShare(isoNum);
                        const iso3 = ISO_NUM_TO_3[isoNum] ?? "";
                        const fillColor = getColor(share, effectiveMineralObj.color);
                        const isCanada = iso3 === "CAN";
                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill={fillColor}
                            stroke={isCanada ? "#fbbf24" : "#334155"}
                            strokeWidth={isCanada ? 1.5 : 0.4}
                            style={{
                              default: { outline: "none" },
                              hover: { fill: share > 0 ? effectiveMineralObj.color : isCanada ? "#fbbf2440" : "#334155", outline: "none", cursor: share > 0 || isCanada ? "pointer" : "default" },
                              pressed: { outline: "none" },
                            }}
                            onMouseEnter={(evt: React.MouseEvent) => {
                              if (share > 0 || isCanada) {
                                setTooltip({ country: String(geo.properties.name ?? ""), iso3, share, note, x: evt.clientX, y: evt.clientY });
                              }
                            }}
                            onMouseMove={(evt: React.MouseEvent) => {
                              if (tooltip) setTooltip((t) => t ? { ...t, x: evt.clientX, y: evt.clientY } : null);
                            }}
                            onMouseLeave={() => setTooltip(null)}
                          />
                        );
                      })
                    }
                  </Geographies>
                </ZoomableGroup>
              </ComposableMap>

              {/* Tooltip */}
              {tooltip && (
                <div
                  className="fixed z-50 pointer-events-none bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 shadow-xl text-sm max-w-[260px]"
                  style={{ left: tooltip.x + 12, top: tooltip.y - 40 }}
                >
                  <p className="font-semibold text-white">{tooltip.country}</p>
                  {tooltip.iso3 === "CAN" && effectiveCanadaRole && (
                    <p className="text-xs font-medium mt-0.5 mb-1" style={{ color: effectiveRoleConfig?.color }}>
                      {effectiveRoleConfig?.label[lang]}
                    </p>
                  )}
                  {tooltip.share > 0 ? (
                    <>
                      <p className="text-slate-300 mt-0.5">
                        {labels.shareLabel[lang]}{" "}
                        {viewMode === "production" ? labels.production[lang].toLowerCase() : labels.reserves[lang].toLowerCase()}: {" "}
                        <span style={{ color: effectiveMineralObj.color }} className="font-bold">{tooltip.share}%</span>
                      </p>
                      {tooltip.note && <p className="text-slate-400 text-xs mt-1 italic">{tooltip.note}</p>}
                    </>
                  ) : (
                    <p className="text-slate-500 text-xs mt-0.5">{labels.noData[lang]}</p>
                  )}
                  {tooltip.iso3 === "CAN" && effectiveCanadaRole && (
                    <p className="text-slate-400 text-xs mt-1 border-t border-slate-700 pt-1">{effectiveCanadaRole.note[lang]}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right column: Canada's role + geopolitical note */}
          <div className="flex flex-col gap-2">
            {effectiveCanadaRole && effectiveRoleConfig ? (
              <div className="bg-slate-900/60 rounded-xl border border-slate-700/50 p-3" style={{ borderLeftColor: effectiveRoleConfig.color, borderLeftWidth: "3px" }}>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">{labels.canadaRole[lang]}</p>
                <p className="text-xs font-semibold" style={{ color: effectiveRoleConfig.color }}>{effectiveRoleConfig.label[lang]}</p>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">{effectiveCanadaRole.note[lang]}</p>
              </div>
            ) : (
              <div className="bg-slate-900/60 rounded-xl border border-slate-700/50 p-3 flex items-center justify-center">
                <p className="text-[11px] text-slate-600 italic text-center">{lang === "en" ? "No specific Canada data for this mineral" : "Pas de données spécifiques pour le Canada"}</p>
              </div>
            )}

            {effectiveGeoNote && (
              <div className="rounded-xl border-l-4 px-4 py-3 bg-slate-900/40" style={{ borderColor: effectiveMineralObj.color }}>
                <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: effectiveMineralObj.color }}>{labels.geopolitical[lang]}</p>
                <p className="text-[12px] text-slate-300 leading-relaxed">{effectiveGeoNote}</p>
              </div>
            )}
          </div>
        </div>

        {/* Download Data */}
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href="https://pubs.usgs.gov/publication/mcs2025"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
          >
            ↓ USGS MCS 2025 (primary data)
          </a>
          <a
            href="https://www.canada.ca/en/campaign/critical-minerals-in-canada/critical-minerals-an-opportunity-for-canada.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
          >
            ↓ NRCan Critical Minerals List 2024
          </a>
          <a
            href="https://ourworldindata.org/countries-critical-minerals-needed-energy-transition"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
          >
            ↓ Our World in Data 2026 (CC BY 4.0)
          </a>
        </div>

        {/* Sources */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-600 space-y-1">
          <p className="font-medium text-slate-500 uppercase tracking-wider mb-2">{labels.sources[lang]}</p>
          <p>[1] U.S. Geological Survey, <a href="https://pubs.usgs.gov/publication/mcs2025" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-400">Mineral Commodity Summaries 2025</a> — primary source for 2024 world mine production and reserves by country.</p>
          <p>[2] U.S. Geological Survey, <a href="https://pubs.usgs.gov/publication/fs20253038/full" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-400">Global Maps of Critical Mineral Production in 2023</a> (FS 2025-3038).</p>
          <p>[3] Natural Resources Canada, <a href="https://www.canada.ca/en/campaign/critical-minerals-in-canada/critical-minerals-an-opportunity-for-canada.html" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-400">Critical Minerals: An Opportunity for Canada</a> — Canada's official 34-mineral list, updated June 2024.</p>
          <p>[4] Natural Resources Canada, <a href="https://natural-resources.canada.ca/maps-tools-publications/publications/mineral-trade" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-400">Mineral Trade Information Bulletin</a> — Canada's 2024 critical minerals trade data (September 2025).</p>
          <p>[5] Hannah Ritchie & Pablo Rosado, <a href="https://ourworldindata.org/countries-critical-minerals-needed-energy-transition" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-400">Which countries have the critical minerals needed for the energy transition?</a> Our World in Data, updated March 2026 (CC BY 4.0).</p>
          <p>[6] International Energy Agency, <a href="https://www.iea.org/reports/global-critical-minerals-outlook-2024" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-400">Global Critical Minerals Outlook 2024</a>.</p>
          <p>[7] Center for Strategic and International Studies, <a href="https://www.csis.org/analysis/mining-defense" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-400">Mining for Defense: Unlocking the Potential for U.S.–Canada Critical Minerals Cooperation</a> (February 2025).</p>
          <p className="mt-2 italic">
            {lang === "en"
              ? "Note: Percentages are approximate and reflect 2024 data (USGS MCS 2025). Reserves are economically extractable known deposits; resources (total geological endowment) are larger. By-product minerals (gallium, germanium, indium, tellurium, bismuth, cesium) have no official reserve figures — distribution reflects processing capacity or resource estimates. Cesium figures reflect historical Tanco Mine output."
              : "Note : Les pourcentages sont approximatifs et reflètent les données 2024 (USGS MCS 2025). Les réserves sont les gisements connus économiquement exploitables ; les ressources (dotation géologique totale) sont plus importantes. Les minéraux sous-produits (gallium, germanium, indium, tellure, bismuth, césium) n'ont pas de chiffres de réserves officiels — la distribution reflète la capacité de traitement ou les estimations de ressources. Les chiffres du césium reflètent la production historique de la mine Tanco."}
          </p>
        </div>
      </div>
    </div>
  );
}
