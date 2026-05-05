/*
 * TransHorizons — Canada Country Analysis Data
 * Content source: content/countries/CAN/analysis.yaml (Keystatic-managed)
 * The YAML flat schema is adapted here to the AnalysisContent interface so that
 * CountryPage.tsx requires no changes.
 */

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore – @rollup/plugin-yaml resolves YAML at build time; no .d.ts needed
import raw from '../../content/countries/CAN/analysis.yaml';

import type { AnalysisContent } from './france';
import { adaptCountryYaml } from './countries/adaptCountryYaml';

export const canadaAnalysis: AnalysisContent = adaptCountryYaml(raw);
