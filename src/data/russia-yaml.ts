/*
 * TransHorizons — Russia Country Analysis Data (YAML source)
 * Content source: content/countries/RUS/analysis.yaml (Keystatic-managed)
 */

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore – @rollup/plugin-yaml resolves YAML at build time; no .d.ts needed
import raw from '../../content/countries/RUS/analysis.yaml';

import type { AnalysisContent } from './france';
import { adaptCountryYaml } from './countries/adaptCountryYaml';

export const russiaAnalysis: AnalysisContent = adaptCountryYaml(raw);
