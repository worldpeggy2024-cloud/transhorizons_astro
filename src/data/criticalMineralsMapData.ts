export type MineralViewMode = "production" | "reserves";

export type MineralShareEntry = {
  share: number;
  note?: string;
};

export type MineralCountryShares = Record<string, MineralShareEntry>;

export type MineralSeries = Record<MineralViewMode, MineralCountryShares>;

export type MineralDataMap = Record<string, MineralSeries>;

// USGS MCS 2026 (2025 figures), curated for map rendering.
export const MINERAL_DATA: MineralDataMap = {
  lithium: {
    production: { AUS: { share: 32 }, CHN: { share: 22 }, CHL: { share: 19 }, ZWE: { share: 10 }, ARG: { share: 8 }, BRA: { share: 4 }, MLI: { share: 3 }, CAN: { share: 2 }, PRT: { share: 1 } },
    reserves: { CHL: { share: 27, note: "Atacama salt flats" }, AUS: { share: 25 }, CHN: { share: 14 }, ARG: { share: 13 }, USA: { share: 13 }, BOL: { share: 7 }, CAN: { share: 5 }, BRA: { share: 3 } },
  },
  cobalt: {
    production: { COD: { share: 75 }, IDN: { share: 14 }, RUS: { share: 3 }, PHL: { share: 3 }, AUS: { share: 2 }, CAN: { share: 2 }, ZMB: { share: 2 }, MDG: { share: 1 } },
    reserves: { COD: { share: 56 }, AUS: { share: 16 }, IDN: { share: 7 }, RUS: { share: 7 }, CUB: { share: 5 }, PHL: { share: 3 }, ZMB: { share: 3 }, CAN: { share: 2 } },
  },
  nickel: {
    production: { IDN: { share: 72 }, PHL: { share: 8 }, RUS: { share: 6 }, CAN: { share: 4 }, NCL: { share: 4 }, AUS: { share: 4 }, CHN: { share: 4 }, BRA: { share: 2 } },
    reserves: { IDN: { share: 48 }, AUS: { share: 16 }, BRA: { share: 11 }, RUS: { share: 6 }, PHL: { share: 5 }, CAN: { share: 3 }, CHN: { share: 3 }, ZMB: { share: 2 } },
  },
  graphite: {
    production: { CHN: { share: 80 }, MDG: { share: 5 }, MOZ: { share: 4 }, TZA: { share: 4 }, BRA: { share: 3 }, NOR: { share: 2 }, RUS: { share: 2 } },
    reserves: { CHN: { share: 34 }, BRA: { share: 25 }, MDG: { share: 9 }, MOZ: { share: 8 }, TZA: { share: 6 }, RUS: { share: 5 }, CAN: { share: 3 } },
  },
  manganese: {
    production: { ZAF: { share: 40 }, GAB: { share: 27 }, AUS: { share: 14 }, GHA: { share: 11 }, CHN: { share: 6 }, IND: { share: 4 }, BRA: { share: 4 } },
    reserves: { AUS: { share: 32 }, ZAF: { share: 31 }, BRA: { share: 17 }, CHN: { share: 15 }, UKR: { share: 7 }, IND: { share: 5 }, GAB: { share: 3 } },
  },
  copper: {
    production: { CHN: { share: 32 }, CHL: { share: 14 }, COD: { share: 12 }, USA: { share: 8 }, PER: { share: 6 }, RUS: { share: 5 }, AUS: { share: 3 }, CAN: { share: 3 }, ZMB: { share: 3 }, MEX: { share: 2 } },
    reserves: { CHL: { share: 23 }, AUS: { share: 13 }, PER: { share: 11 }, COD: { share: 10 }, RUS: { share: 10 }, MEX: { share: 7 }, USA: { share: 6 }, CHN: { share: 5 }, CAN: { share: 4 }, POL: { share: 4 }, ZMB: { share: 3 } },
  },
  zinc: {
    production: { CHN: { share: 36 }, USA: { share: 14 }, PER: { share: 13 }, AUS: { share: 10 }, IND: { share: 8 }, MEX: { share: 7 }, KAZ: { share: 4 }, CAN: { share: 4 }, RUS: { share: 4 }, BOL: { share: 4 }, SWE: { share: 2 }, BRA: { share: 2 } },
    reserves: { AUS: { share: 30 }, CHN: { share: 28 }, RUS: { share: 13 }, PER: { share: 8 }, MEX: { share: 7 }, IND: { share: 5 }, KAZ: { share: 5 }, USA: { share: 4 }, CAN: { share: 4 }, BRA: { share: 3 } },
  },
  tin: {
    production: { CHN: { share: 23 }, IDN: { share: 20 }, MMR: { share: 14 }, PER: { share: 11 }, BRA: { share: 9 }, COD: { share: 9 }, USA: { share: 6 }, BOL: { share: 5 }, AUS: { share: 4 }, VNM: { share: 4 } },
    reserves: { IDN: { share: 25 }, CHN: { share: 21 }, BRA: { share: 12 }, MMR: { share: 12 }, AUS: { share: 10 }, RUS: { share: 8 }, BOL: { share: 7 }, PER: { share: 3 } },
  },
  bismuth: {
    production: { CHN: { share: 86, note: "Dominant refiner; most bismuth recovered from lead smelting" }, KOR: { share: 6 }, MEX: { share: 5 }, VNM: { share: 3 }, BEL: { share: 2 }, CAN: { share: 2, note: "By-product of lead smelting in New Brunswick" } },
    reserves: { CHN: { share: 45 }, VNM: { share: 15 }, MEX: { share: 10 }, BOL: { share: 8 }, AUS: { share: 5 }, CAN: { share: 3 } },
  },
  uranium: {
    production: { KAZ: { share: 43 }, CAN: { share: 15, note: "Athabasca Basin, Saskatchewan" }, NAM: { share: 11 }, AUS: { share: 9 }, UZB: { share: 7 }, RUS: { share: 5 }, NER: { share: 4 }, ZMB: { share: 3 } },
    reserves: { AUS: { share: 28 }, KAZ: { share: 13 }, CAN: { share: 9 }, RUS: { share: 8 }, NAM: { share: 7 }, ZAF: { share: 5 }, BRA: { share: 5 }, NER: { share: 4 }, CHN: { share: 4 } },
  },
  helium: {
    production: { USA: { share: 44, note: "Hugoton gas field - largest helium producer" }, QAT: { share: 34, note: "Ras Laffan industrial city" }, RUS: { share: 10 }, AUS: { share: 7 }, DZA: { share: 6 }, CAN: { share: 3, note: "Saskatchewan helium fields; rapidly growing" } },
    reserves: { USA: { share: 35 }, QAT: { share: 25 }, RUS: { share: 15 }, AUS: { share: 8 }, CAN: { share: 6 }, DZA: { share: 4 }, ZAF: { share: 3 } },
  },
  potash: {
    production: { CAN: { share: 31, note: "Saskatchewan - world's largest potash exporter; $8B in exports in 2024" }, RUS: { share: 21 }, CHN: { share: 13 }, BLR: { share: 12 }, DEU: { share: 6 }, LAO: { share: 5 }, ISR: { share: 4 }, JOR: { share: 3 }, USA: { share: 2 } },
    reserves: { CAN: { share: 39, note: "Largest known reserves globally" }, BLR: { share: 28 }, RUS: { share: 14 }, CHN: { share: 10 }, USA: { share: 8 }, DEU: { share: 5 }, ISR: { share: 3 }, JOR: { share: 3 } },
  },
  phosphate: {
    production: { CHN: { share: 42 }, USA: { share: 15 }, MAR: { share: 14, note: "Morocco + Western Sahara; largest reserves" }, EGY: { share: 7 }, RUS: { share: 5 }, SAU: { share: 5 }, BRA: { share: 5 }, JOR: { share: 5 }, VNM: { share: 3 } },
    reserves: { MAR: { share: 69, note: "Morocco holds ~70% of world phosphate reserves including Western Sahara" }, CHN: { share: 5 }, EGY: { share: 4 }, DZA: { share: 3 }, RUS: { share: 3 }, BRA: { share: 3 }, SAU: { share: 2 }, ZAF: { share: 2 } },
  },
  magnesium: {
    production: { CHN: { share: 61, note: "Dominates global magnesium metal production" }, BRA: { share: 9 }, RUS: { share: 8 }, ISR: { share: 3 }, KAZ: { share: 3 }, USA: { share: 2 } },
    reserves: { RUS: { share: 44 }, SVK: { share: 23 }, CHN: { share: 13 }, KOR: { share: 8 }, USA: { share: 6 }, AUS: { share: 5 }, GRC: { share: 5 }, BRA: { share: 4 }, IND: { share: 4 } },
  },
  fluorspar: {
    production: { CHN: { share: 60 }, MEX: { share: 15 }, MNG: { share: 15 }, ZAF: { share: 4 }, NAM: { share: 3 }, KEN: { share: 2 } },
    reserves: { CHN: { share: 37 }, MEX: { share: 23 }, ZAF: { share: 14 }, MNG: { share: 11 }, RUS: { share: 8 }, NAM: { share: 6 }, ESP: { share: 5 }, VNM: { share: 5 } },
  },
  silicon: {
    production: { CHN: { share: 80 }, NOR: { share: 8 }, BRA: { share: 7 }, USA: { share: 5 }, RUS: { share: 5 }, FRA: { share: 4 }, ISL: { share: 3 }, AUS: { share: 2 } },
    reserves: { CHN: { share: 30 }, AUS: { share: 15 }, BRA: { share: 12 }, IND: { share: 10 }, USA: { share: 8 }, NOR: { share: 5 }, RUS: { share: 5 } },
  },
  rare_earths: {
    production: { CHN: { share: 60 }, USA: { share: 25 }, MMR: { share: 8 }, AUS: { share: 7 }, THA: { share: 4 }, IND: { share: 2 }, RUS: { share: 1 }, BRA: { share: 1 } },
    reserves: { CHN: { share: 52 }, BRA: { share: 10 }, IND: { share: 6 }, AUS: { share: 5 }, RUS: { share: 5 }, VNM: { share: 4 }, GRL: { share: 3 }, CAN: { share: 2 }, USA: { share: 2 } },
  },
  pgm: {
    production: { ZAF: { share: 70 }, RUS: { share: 14 }, ZWE: { share: 5 }, CAN: { share: 4, note: "Sudbury ON, Nunavut - by-product of nickel" }, USA: { share: 3 }, AUS: { share: 2 } },
    reserves: { ZAF: { share: 83, note: "Bushveld Complex" }, RUS: { share: 14 }, ZWE: { share: 2 }, CAN: { share: 1 }, USA: { share: 1 } },
  },
  gallium: {
    production: { CHN: { share: 99, note: "Export restrictions imposed July 2023" }, DEU: { share: 6 }, KAZ: { share: 4 }, JPN: { share: 3 }, CAN: { share: 2, note: "Trail smelter, BC" }, AUS: { share: 2 }, UKR: { share: 1 } },
    reserves: { CHN: { share: 80 }, AUS: { share: 5 }, RUS: { share: 3 }, KAZ: { share: 3 }, CAN: { share: 2 }, DEU: { share: 2 }, USA: { share: 2 }, JPN: { share: 1 } },
  },
  indium: {
    production: { CHN: { share: 70 }, KOR: { share: 17 }, JPN: { share: 6 }, BEL: { share: 5 }, CAN: { share: 4, note: "Trail smelter, BC - top 3 global producer" }, FRA: { share: 4 }, DEU: { share: 3 } },
    reserves: { CHN: { share: 44 }, AUS: { share: 11 }, USA: { share: 10 }, CAN: { share: 7 }, PER: { share: 7 }, RUS: { share: 5 }, MEX: { share: 4 } },
  },
  tellurium: {
    production: { CHN: { share: 78 }, RUS: { share: 7 }, JPN: { share: 6 }, USA: { share: 5 }, SWE: { share: 5 }, BEL: { share: 4 }, CAN: { share: 3, note: "By-product of copper refining; key US solar/defence supplier" }, PER: { share: 3 } },
    reserves: { CHN: { share: 30 }, USA: { share: 20 }, PER: { share: 15 }, CAN: { share: 8 }, AUS: { share: 7 }, RUS: { share: 5 }, MEX: { share: 4 } },
  },
  cesium: {
    production: { CAN: { share: 70, note: "Bernic Lake, Manitoba (Tanco Mine) - world's largest pollucite deposit; historically ~70% of global supply" }, ZWE: { share: 20, note: "Bikita mine" }, NAM: { share: 7 } },
    reserves: { CAN: { share: 65, note: "Bernic Lake, Manitoba" }, ZWE: { share: 20 }, NAM: { share: 8 } },
  },
  scandium: {
    production: { CHN: { share: 66 }, RUS: { share: 15 }, UKR: { share: 8 }, AUS: { share: 5 }, PHL: { share: 3 } },
    reserves: { CHN: { share: 40 }, RUS: { share: 20 }, UKR: { share: 10 }, AUS: { share: 8 }, NOR: { share: 5 }, USA: { share: 4 } },
  },
  chromium: {
    production: { ZAF: { share: 48 }, KAZ: { share: 15 }, TUR: { share: 8 }, IND: { share: 8 }, FIN: { share: 5 }, ZWE: { share: 4 }, BRA: { share: 4 } },
    reserves: { ZAF: { share: 33 }, KAZ: { share: 30 }, ZWE: { share: 23 }, IND: { share: 6 }, FIN: { share: 5 }, TUR: { share: 4 } },
  },
  vanadium: {
    production: { CHN: { share: 68 }, RUS: { share: 17 }, BRA: { share: 8 }, USA: { share: 6 }, ZAF: { share: 4 }, AUS: { share: 3 } },
    reserves: { AUS: { share: 47 }, CHN: { share: 27 }, RUS: { share: 23 }, BRA: { share: 4 }, USA: { share: 3 }, ZAF: { share: 2 } },
  },
  molybdenum: {
    production: { CHN: { share: 32 }, USA: { share: 27 }, CHL: { share: 14 }, PER: { share: 13 }, MEX: { share: 6 }, CAN: { share: 5, note: "Endako mine BC; Highland Valley Copper by-product" }, ARM: { share: 3 } },
    reserves: { CHN: { share: 45 }, USA: { share: 20 }, CHL: { share: 15 }, PER: { share: 8 }, MEX: { share: 6 }, RUS: { share: 6 }, CAN: { share: 4 }, AUS: { share: 4 } },
  },
  tungsten: {
    production: { CHN: { share: 81, note: "Export restrictions tightened 2023" }, VNM: { share: 8 }, KAZ: { share: 3 }, RUS: { share: 2 }, AUT: { share: 2 }, BOL: { share: 2 }, ESP: { share: 2 } },
    reserves: { CHN: { share: 67 }, AUS: { share: 15 }, RUS: { share: 11 }, VNM: { share: 5 }, AUT: { share: 5 }, BOL: { share: 5 }, CAN: { share: 3, note: "Yukon, NWT deposits - not currently mined" }, USA: { share: 3 } },
  },
  niobium: {
    production: { BRA: { share: 93, note: "CBMM (Companhia Brasileira de Metalurgia e Mineracao) - dominant global supplier" }, CAN: { share: 5, note: "Niobec Mine, Quebec (Magris Resources)" }, AUS: { share: 2 } },
    reserves: { BRA: { share: 66, note: "Araxa and Catalao deposits" }, CHN: { share: 30 }, CAN: { share: 3 }, AUS: { share: 1 } },
  },
  titanium: {
    production: { CHN: { share: 33 }, MOZ: { share: 20 }, ZAF: { share: 15 }, AUS: { share: 10 }, IND: { share: 6 }, CAN: { share: 4, note: "Quebec ilmenite and rutile deposits" }, NOR: { share: 4 }, UKR: { share: 4 }, SEN: { share: 4 }, MDG: { share: 3 } },
    reserves: { AUS: { share: 41 }, CHN: { share: 22 }, CAN: { share: 10 }, NOR: { share: 8 }, ZAF: { share: 7 }, MDG: { share: 6 }, MOZ: { share: 5 }, IND: { share: 3 } },
  },
  antimony: {
    production: { CHN: { share: 35, note: "Export restrictions imposed 2024" }, RUS: { share: 28 }, TJK: { share: 19 }, BOL: { share: 4 }, USA: { share: 4 }, AUS: { share: 3 }, TUR: { share: 3 }, MMR: { share: 3 }, GUY: { share: 2 } },
    reserves: { CHN: { share: 35 }, RUS: { share: 15 }, BOL: { share: 10 }, AUS: { share: 7 }, TJK: { share: 5 }, TUR: { share: 4 }, MEX: { share: 3 }, ZAF: { share: 3 }, CAN: { share: 3 } },
  },
  strontium: {
    production: { IRN: { share: 56 }, ESP: { share: 22, note: "Spain is the world's leading celestite producer" }, CHN: { share: 18 }, MEX: { share: 15 }, TUR: { share: 3 } },
    reserves: { CHN: { share: 25 }, ESP: { share: 30 }, MEX: { share: 15 }, IRN: { share: 10 }, TUR: { share: 5 }, ARG: { share: 5 } },
  },
  bauxite: {
    production: { GIN: { share: 35 }, AUS: { share: 22 }, CHN: { share: 20 }, BRA: { share: 8 }, IND: { share: 6 }, IDN: { share: 4 }, GNB: { share: 2 } },
    reserves: { GIN: { share: 32 }, AUS: { share: 16 }, VNM: { share: 13 }, IDN: { share: 13 }, JAM: { share: 9 }, BRA: { share: 7 }, CHN: { share: 3 }, IND: { share: 3 }, RUS: { share: 3 } },
  },
  zirconium: {
    production: { AUS: { share: 38 }, ZAF: { share: 24 }, CHN: { share: 12 }, MOZ: { share: 8 }, IND: { share: 6 }, SEN: { share: 4 }, UKR: { share: 3 } },
    reserves: { AUS: { share: 63 }, ZAF: { share: 14 }, CHN: { share: 5 }, IND: { share: 5 }, MOZ: { share: 4 }, UKR: { share: 3 } },
  },
  iron_ore: {
    production: { AUS: { share: 38 }, BRA: { share: 16 }, IND: { share: 12 }, CHN: { share: 11 }, RUS: { share: 3 }, CAN: { share: 3, note: "Labrador Trough, Quebec and Newfoundland - high-purity DR-grade ore for green steel" }, SWE: { share: 3 }, UKR: { share: 3 }, ZAF: { share: 3 } },
    reserves: { AUS: { share: 31 }, BRA: { share: 18 }, RUS: { share: 18 }, CHN: { share: 7 }, IND: { share: 6 }, MRT: { share: 5 }, UKR: { share: 4 }, CAN: { share: 3 }, SWE: { share: 2 } },
  },
};
