/*
 * TransHorizons — China Country Analysis Data (YAML source)
 * Content source: content/countries/CHN/analysis.yaml (Keystatic-managed)
 */

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore – @rollup/plugin-yaml resolves YAML at build time; no .d.ts needed
import raw from '../../content/countries/CHN/analysis.yaml';

import type { AnalysisContent } from './france';
import { adaptCountryYaml } from './countries/adaptCountryYaml';

export const chinaAnalysis: AnalysisContent = adaptCountryYaml(raw);
