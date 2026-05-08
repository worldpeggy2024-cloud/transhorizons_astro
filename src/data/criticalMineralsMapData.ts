export type MineralViewMode = "production" | "reserves";

export type MineralShareEntry = {
  share: number;
  note?: string;
};

export type MineralCountryShares = Record<string, MineralShareEntry>;

export type MineralSeries = Record<MineralViewMode, MineralCountryShares>;

export type MineralDataMap = Record<string, MineralSeries>;

// USGS MCS 2025 (2024 figures), curated for map rendering.
export const MINERAL_DATA: MineralDataMap = {
  lithium: {
    production: { AUS: { share: 35 }, CHL: { share: 20 }, CHN: { share: 17 }, ARG: { share: 9 }, BRA: { share: 4 }, CAN: { share: 2 }, ZWE: { share: 2 }, PRT: { share: 1 } },
    reserves: { CHL: { share: 35, note: "Atacama salt flats" }, AUS: { share: 22 }, ARG: { share: 12 }, CHN: { share: 8 }, BOL: { share: 7 }, USA: { share: 4 }, BRA: { share: 3 }, CAN: { share: 2 } },
  },
  cobalt: {
    production: { COD: { share: 74 }, IDN: { share: 5 }, RUS: { share: 4 }, PHL: { share: 3 }, AUS: { share: 2 }, CAN: { share: 2 }, ZMB: { share: 2 }, MDG: { share: 1 } },
    reserves: { COD: { share: 52 }, AUS: { share: 15 }, CUB: { share: 5 }, IDN: { share: 5 }, RUS: { share: 4 }, PHL: { share: 3 }, ZMB: { share: 3 }, CAN: { share: 2 } },
  },
  nickel: {
    production: { IDN: { share: 52 }, PHL: { share: 10 }, RUS: { share: 6 }, CAN: { share: 5 }, NCL: { share: 4 }, AUS: { share: 4 }, CHN: { share: 4 }, BRA: { share: 2 } },
    reserves: { IDN: { share: 42 }, AUS: { share: 16 }, BRA: { share: 11 }, RUS: { share: 7 }, PHL: { share: 5 }, CAN: { share: 3 }, CHN: { share: 3 }, ZMB: { share: 2 } },
  },
  graphite: {
    production: { CHN: { share: 77 }, MDG: { share: 5 }, MOZ: { share: 4 }, BRA: { share: 3 }, NOR: { share: 2 }, RUS: { share: 2 } },
    reserves: { CHN: { share: 26 }, BRA: { share: 25 }, MOZ: { share: 10 }, MDG: { share: 7 }, TZA: { share: 5 }, RUS: { share: 5 }, CAN: { share: 3 } },
  },
  manganese: {
    production: { ZAF: { share: 34 }, GAB: { share: 16 }, AUS: { share: 14 }, GHA: { share: 7 }, CHN: { share: 6 }, IND: { share: 5 }, BRA: { share: 4 } },
    reserves: { ZAF: { share: 33 }, AUS: { share: 17 }, CHN: { share: 12 }, BRA: { share: 10 }, UKR: { share: 7 }, IND: { share: 5 }, GAB: { share: 3 } },
  },
  copper: {
    production: { CHL: { share: 24 }, COD: { share: 12 }, PER: { share: 11 }, CHN: { share: 8 }, RUS: { share: 4 }, USA: { share: 4 }, AUS: { share: 3 }, CAN: { share: 3 }, ZMB: { share: 3 }, MEX: { share: 2 } },
    reserves: { CHL: { share: 21 }, PER: { share: 10 }, AUS: { share: 9 }, COD: { share: 8 }, RUS: { share: 7 }, USA: { share: 6 }, CAN: { share: 4 }, MEX: { share: 3 }, ZMB: { share: 3 }, POL: { share: 2 } },
  },
  zinc: {
    production: { CHN: { share: 31 }, AUS: { share: 10 }, PER: { share: 10 }, IND: { share: 7 }, USA: { share: 5 }, MEX: { share: 5 }, KAZ: { share: 4 }, CAN: { share: 4 }, SWE: { share: 2 }, BRA: { share: 2 } },
    reserves: { AUS: { share: 22 }, CHN: { share: 16 }, PER: { share: 11 }, MEX: { share: 7 }, IND: { share: 6 }, USA: { share: 5 }, KAZ: { share: 5 }, CAN: { share: 4 }, RUS: { share: 3 }, BRA: { share: 3 } },
  },
  tin: {
    production: { CHN: { share: 23 }, IDN: { share: 20 }, MMR: { share: 14 }, PER: { share: 7 }, BRA: { share: 7 }, BOL: { share: 6 }, AUS: { share: 3 }, VNM: { share: 3 } },
    reserves: { CHN: { share: 25 }, IDN: { share: 18 }, BRA: { share: 16 }, BOL: { share: 10 }, AUS: { share: 9 }, RUS: { share: 5 }, PER: { share: 4 }, MMR: { share: 3 } },
  },
  bismuth: {
    production: { CHN: { share: 82, note: "Dominant refiner; most bismuth recovered from lead smelting" }, MEX: { share: 5 }, VNM: { share: 3 }, BEL: { share: 2 }, CAN: { share: 2, note: "By-product of lead smelting in New Brunswick" } },
    reserves: { CHN: { share: 45 }, VNM: { share: 15 }, MEX: { share: 10 }, BOL: { share: 8 }, AUS: { share: 5 }, CAN: { share: 3 } },
  },
  uranium: {
    production: { KAZ: { share: 43 }, CAN: { share: 15, note: "Athabasca Basin, Saskatchewan" }, NAM: { share: 11 }, AUS: { share: 9 }, UZB: { share: 7 }, RUS: { share: 5 }, NER: { share: 4 }, ZMB: { share: 3 } },
    reserves: { AUS: { share: 28 }, KAZ: { share: 13 }, CAN: { share: 9 }, RUS: { share: 8 }, NAM: { share: 7 }, ZAF: { share: 5 }, BRA: { share: 5 }, NER: { share: 4 }, CHN: { share: 4 } },
  },
  helium: {
    production: { USA: { share: 40, note: "Hugoton gas field - largest helium producer" }, QAT: { share: 30, note: "Ras Laffan industrial city" }, RUS: { share: 12 }, AUS: { share: 7 }, CAN: { share: 5, note: "Saskatchewan helium fields; rapidly growing" }, DZA: { share: 3 } },
    reserves: { USA: { share: 35 }, QAT: { share: 25 }, RUS: { share: 15 }, AUS: { share: 8 }, CAN: { share: 6 }, DZA: { share: 4 } },
  },
  potash: {
    production: { CAN: { share: 31, note: "Saskatchewan - world's largest potash exporter; $8B in exports in 2024" }, RUS: { share: 19 }, BLR: { share: 18 }, CHN: { share: 12 }, DEU: { share: 6 }, ISR: { share: 4 }, JOR: { share: 3 }, USA: { share: 2 } },
    reserves: { CAN: { share: 35, note: "Largest known reserves globally" }, RUS: { share: 18 }, BLR: { share: 15 }, CHN: { share: 10 }, DEU: { share: 5 }, ISR: { share: 3 }, JOR: { share: 3 }, USA: { share: 2 } },
  },
  phosphate: {
    production: { CHN: { share: 43 }, MAR: { share: 17, note: "Morocco + Western Sahara; largest reserves" }, EGY: { share: 7 }, RUS: { share: 6 }, SAU: { share: 5 }, BRA: { share: 5 }, VNM: { share: 3 }, USA: { share: 3 } },
    reserves: { MAR: { share: 70, note: "Morocco holds ~70% of world phosphate reserves including Western Sahara" }, CHN: { share: 5 }, EGY: { share: 4 }, DZA: { share: 3 }, RUS: { share: 3 }, BRA: { share: 3 }, SAU: { share: 2 } },
  },
  magnesium: {
    production: { CHN: { share: 85, note: "Dominates global magnesium metal production" }, RUS: { share: 5 }, ISR: { share: 3 }, KAZ: { share: 3 }, USA: { share: 2 } },
    reserves: { CHN: { share: 22 }, RUS: { share: 18 }, KOR: { share: 8 }, AUS: { share: 7 }, USA: { share: 6 }, BRA: { share: 5 }, IND: { share: 4 } },
  },
  fluorspar: {
    production: { CHN: { share: 60 }, MEX: { share: 15 }, MNG: { share: 7 }, ZAF: { share: 5 }, NAM: { share: 3 }, KEN: { share: 2 } },
    reserves: { ZAF: { share: 17 }, MEX: { share: 15 }, CHN: { share: 14 }, MNG: { share: 10 }, RUS: { share: 8 }, NAM: { share: 6 }, ESP: { share: 5 } },
  },
  silicon: {
    production: { CHN: { share: 60 }, NOR: { share: 8 }, BRA: { share: 7 }, USA: { share: 5 }, FRA: { share: 4 }, ISL: { share: 3 }, AUS: { share: 2 } },
    reserves: { CHN: { share: 30 }, AUS: { share: 15 }, BRA: { share: 12 }, IND: { share: 10 }, USA: { share: 8 }, NOR: { share: 5 }, RUS: { share: 5 } },
  },
  rare_earths: {
    production: { CHN: { share: 67 }, USA: { share: 12 }, MMR: { share: 8 }, THA: { share: 4 }, AUS: { share: 4 }, IND: { share: 2 }, RUS: { share: 1 }, BRA: { share: 1 } },
    reserves: { CHN: { share: 47 }, BRA: { share: 10 }, IND: { share: 6 }, AUS: { share: 5 }, RUS: { share: 5 }, VNM: { share: 4 }, GRL: { share: 3 }, CAN: { share: 2 }, USA: { share: 2 } },
  },
  pgm: {
    production: { ZAF: { share: 70 }, RUS: { share: 14 }, ZWE: { share: 5 }, CAN: { share: 4, note: "Sudbury ON, Nunavut - by-product of nickel" }, USA: { share: 3 }, AUS: { share: 2 } },
    reserves: { ZAF: { share: 91, note: "Bushveld Complex" }, RUS: { share: 4 }, ZWE: { share: 2 }, CAN: { share: 1 }, USA: { share: 1 } },
  },
  gallium: {
    production: { CHN: { share: 80, note: "Export restrictions imposed July 2023" }, DEU: { share: 6 }, KAZ: { share: 4 }, JPN: { share: 3 }, CAN: { share: 2, note: "Trail smelter, BC" }, AUS: { share: 2 }, UKR: { share: 1 } },
    reserves: { CHN: { share: 80 }, AUS: { share: 5 }, RUS: { share: 3 }, KAZ: { share: 3 }, CAN: { share: 2 }, DEU: { share: 2 }, USA: { share: 2 }, JPN: { share: 1 } },
  },
  indium: {
    production: { CHN: { share: 57 }, KOR: { share: 11 }, JPN: { share: 8 }, CAN: { share: 6, note: "Trail smelter, BC - top 3 global producer" }, BEL: { share: 5 }, FRA: { share: 4 }, DEU: { share: 3 } },
    reserves: { CHN: { share: 44 }, AUS: { share: 11 }, USA: { share: 10 }, CAN: { share: 7 }, PER: { share: 7 }, RUS: { share: 5 }, MEX: { share: 4 } },
  },
  tellurium: {
    production: { CHN: { share: 50 }, JPN: { share: 10 }, RUS: { share: 8 }, CAN: { share: 7, note: "By-product of copper refining; key US solar/defence supplier" }, USA: { share: 5 }, BEL: { share: 4 }, PER: { share: 3 } },
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
    production: { ZAF: { share: 41 }, KAZ: { share: 18 }, TUR: { share: 8 }, IND: { share: 8 }, FIN: { share: 5 }, ZWE: { share: 3 } },
    reserves: { ZWE: { share: 35 }, KAZ: { share: 25 }, ZAF: { share: 20 }, IND: { share: 6 }, TUR: { share: 4 }, FIN: { share: 3 } },
  },
  vanadium: {
    production: { CHN: { share: 57 }, RUS: { share: 17 }, ZAF: { share: 10 }, BRA: { share: 8 }, AUS: { share: 3 } },
    reserves: { CHN: { share: 39 }, AUS: { share: 23 }, RUS: { share: 20 }, ZAF: { share: 5 }, BRA: { share: 4 }, USA: { share: 3 } },
  },
  molybdenum: {
    production: { CHN: { share: 43 }, CHL: { share: 17 }, USA: { share: 12 }, PER: { share: 7 }, MEX: { share: 6 }, CAN: { share: 5, note: "Endako mine BC; Highland Valley Copper by-product" }, ARM: { share: 3 } },
    reserves: { CHN: { share: 37 }, USA: { share: 19 }, CHL: { share: 13 }, PER: { share: 8 }, MEX: { share: 6 }, RUS: { share: 5 }, CAN: { share: 4 } },
  },
  tungsten: {
    production: { CHN: { share: 80, note: "Export restrictions tightened 2023" }, VNM: { share: 8 }, RUS: { share: 3 }, AUT: { share: 2 }, BOL: { share: 2 }, ESP: { share: 2 } },
    reserves: { CHN: { share: 51 }, VNM: { share: 9 }, RUS: { share: 8 }, AUT: { share: 5 }, BOL: { share: 5 }, CAN: { share: 3, note: "Yukon, NWT deposits - not currently mined" }, USA: { share: 3 } },
  },
  niobium: {
    production: { BRA: { share: 88, note: "CBMM (Companhia Brasileira de Metalurgia e Mineracao) - dominant global supplier" }, CAN: { share: 9, note: "Niobec Mine, Quebec (Magris Resources)" }, AUS: { share: 2 } },
    reserves: { BRA: { share: 95, note: "Araxa and Catalao deposits" }, CAN: { share: 3 }, AUS: { share: 1 } },
  },
  titanium: {
    production: { CHN: { share: 34 }, AUS: { share: 18 }, ZAF: { share: 12 }, MOZ: { share: 6 }, IND: { share: 6 }, CAN: { share: 5, note: "Quebec ilmenite and rutile deposits" }, NOR: { share: 5 }, UKR: { share: 4 } },
    reserves: { CHN: { share: 38 }, AUS: { share: 21 }, IND: { share: 11 }, ZAF: { share: 8 }, MOZ: { share: 5 }, CAN: { share: 3 }, NOR: { share: 3 } },
  },
  antimony: {
    production: { CHN: { share: 48, note: "Export restrictions imposed 2024" }, TJK: { share: 25 }, RUS: { share: 5 }, BOL: { share: 4 }, AUS: { share: 3 }, TUR: { share: 3 }, MMR: { share: 3 }, GUY: { share: 2 } },
    reserves: { CHN: { share: 35 }, RUS: { share: 19 }, BOL: { share: 10 }, AUS: { share: 7 }, TJK: { share: 5 }, TUR: { share: 4 }, MEX: { share: 3 }, ZAF: { share: 3 } },
  },
  strontium: {
    production: { CHN: { share: 40 }, ESP: { share: 35, note: "Spain is the world's leading celestite producer" }, MEX: { share: 15 }, IRN: { share: 5 }, TUR: { share: 3 } },
    reserves: { ESP: { share: 30 }, CHN: { share: 25 }, MEX: { share: 15 }, IRN: { share: 10 }, TUR: { share: 5 }, ARG: { share: 5 } },
  },
  bauxite: {
    production: { AUS: { share: 27 }, GIN: { share: 24 }, CHN: { share: 22 }, BRA: { share: 8 }, IND: { share: 6 }, IDN: { share: 4 }, GNB: { share: 2 } },
    reserves: { GIN: { share: 24 }, AUS: { share: 20 }, VNM: { share: 12 }, BRA: { share: 9 }, JAM: { share: 5 }, IDN: { share: 4 }, CHN: { share: 3 }, IND: { share: 3 } },
  },
  zirconium: {
    production: { AUS: { share: 38 }, ZAF: { share: 24 }, CHN: { share: 12 }, MOZ: { share: 8 }, IND: { share: 6 }, SEN: { share: 4 }, UKR: { share: 3 } },
    reserves: { AUS: { share: 63 }, ZAF: { share: 14 }, CHN: { share: 5 }, IND: { share: 5 }, MOZ: { share: 4 }, UKR: { share: 3 } },
  },
  iron_ore: {
    production: { AUS: { share: 38 }, BRA: { share: 18 }, CHN: { share: 14 }, IND: { share: 8 }, RUS: { share: 5 }, CAN: { share: 5, note: "Labrador Trough, Quebec and Newfoundland - high-purity DR-grade ore for green steel" }, SWE: { share: 3 }, UKR: { share: 3 } },
    reserves: { AUS: { share: 29 }, BRA: { share: 17 }, RUS: { share: 14 }, CHN: { share: 12 }, IND: { share: 6 }, CAN: { share: 4 }, UKR: { share: 4 }, SWE: { share: 2 } },
  },
};
