# New Country Workflow

Use this to add a new country analysis from scratch using the two-pass deep research workflow.

---

## Prerequisites

- Perplexity Deep Research access
- Node.js (for the workflow script)
- The country's ISO 3166-1 alpha-3 code (e.g. `FRA`, `DEU`, `JPN`)

---

## Step 1 — Initialize the job folder

```powershell
node scripts/deepsearch-country-workflow.cjs init <ISO3> <NameEN> <NameFR>
```

Example:
```powershell
node scripts/deepsearch-country-workflow.cjs init FIN Finland Finlande
```

This creates `content/docs/deepsearch-jobs/<ISO3>/` with:
- `pass-a.prompt.md` — prompt for Perplexity (sources only)
- `pass-b.prompt.md` — prompt for Perplexity (content + citations)
- `pass-a.sources.template.json` — schema reference
- `pass-b.content.template.json` — schema reference

---

## Step 2 — Run Pass A in Perplexity (sources)

1. Open [Perplexity Deep Research](https://www.perplexity.ai) and select **Deep Research** mode
2. Copy the entire contents of `pass-a.prompt.md` and paste it as your prompt
3. Wait for the full research run to complete
4. Copy the JSON array output
5. Save it as `content/docs/deepsearch-jobs/<ISO3>/pass-a.sources.json`
   - The file must contain a valid JSON array starting with `[`
   - Strip any surrounding prose if Perplexity adds it

---

## Step 3 — Prepare Pass B prompt

1. Open `pass-b.prompt.md`
2. At the bottom, replace the placeholder line with the actual source IDs from `pass-a.sources.json`:

```
Approved source IDs from Pass A:
source-id-1, source-id-2, source-id-3, ...
```

You can extract the IDs quickly with:
```powershell
node -e "const s=require('./content/docs/deepsearch-jobs/<ISO3>/pass-a.sources.json'); console.log(s.map(x=>x.id).join(', '))"
```

---

## Step 4 — Run Pass B in Perplexity (content)

1. Copy the entire contents of the updated `pass-b.prompt.md` and paste it into a **new** Perplexity Deep Research session
2. Wait for the full run to complete
3. Copy the JSON object output
4. Save it as `content/docs/deepsearch-jobs/<ISO3>/pass-b.content.json`
   - Must be a valid JSON object starting with `{`
   - Strip any surrounding prose

---

## Step 5 — Apply (validate + write YAML)

```powershell
node scripts/deepsearch-country-workflow.cjs apply <ISO3> \
  --sources content/docs/deepsearch-jobs/<ISO3>/pass-a.sources.json \
  --content content/docs/deepsearch-jobs/<ISO3>/pass-b.content.json \
  --date <YYYY-MM-DD>
```

Example:
```powershell
node scripts/deepsearch-country-workflow.cjs apply FIN --sources content/docs/deepsearch-jobs/FIN/pass-a.sources.json --content content/docs/deepsearch-jobs/FIN/pass-b.content.json --date 2026-05-14
```

### If validation fails

**`actors.domestic.en must be a non-empty array`** or flat array errors:
Perplexity returned flat arrays instead of `{ "en": [...], "fr": [...] }`. Fix with:
```powershell
node -e "
const fs = require('fs');
const p = 'content/docs/deepsearch-jobs/<ISO3>/pass-b.content.json';
const data = JSON.parse(fs.readFileSync(p, 'utf8'));
if (Array.isArray(data.actors.domestic)) data.actors.domestic = { en: data.actors.domestic, fr: data.actors.domestic };
if (Array.isArray(data.actors.external)) data.actors.external = { en: data.actors.external, fr: data.actors.external };
if (Array.isArray(data.risks)) data.risks = { en: data.risks, fr: data.risks };
fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
console.log('Fixed');
"
```
Then re-run `apply`. The `fr` arrays will be duplicates of `en` — fix them in a follow-up FR pass.

**Other validation errors**: Read the error message, fix the JSON, re-run `apply`.

On success you will see:
```
Wrote content\countries\<ISO3>\analysis.yaml
OK   content\countries\<ISO3>\analysis.yaml
```

---

## Step 6 — Wire the country page

1. Create `src/data/<countryname>-yaml.ts`:
```ts
// @ts-ignore
import raw from '../../content/countries/<ISO3>/analysis.yaml';
import type { AnalysisContent } from './france';
import { adaptCountryYaml } from './countries/adaptCountryYaml';
export const <countryName>Analysis: AnalysisContent = adaptCountryYaml(raw);
```

2. In `src/pages-react/CountryPage.tsx`, update the import:
```ts
// Before (old .ts file):
import { <countryName>Analysis } from '@/data/<countryname>';
// After (YAML-backed):
import { <countryName>Analysis } from '@/data/<countryname>-yaml';
```

3. Verify the dev server hot-reloads and the country page shows the new `lastUpdated` date.

---

## Step 7 — Visual review and validation

```powershell
pnpm run validate:country content/countries/<ISO3>/analysis.yaml
```

Check for warnings about numeric time-binding. Then open the country page in the browser and review all sections.

---

## Notes

- The `fr` actors and risks sections will be EN duplicates if Perplexity didn't produce French. Schedule a follow-up FR translation pass when needed.
- The old `src/data/<countryname>.ts` file can be kept as archive until the YAML version is confirmed working.
- The `content/docs/deepsearch-jobs/<ISO3>/` folder is your audit trail — keep it in version control.
