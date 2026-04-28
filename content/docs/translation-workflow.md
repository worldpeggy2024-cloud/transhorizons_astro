# Translation Workflow

How to translate or update the French version of a country analysis file. No developer tools required — everything happens in the GitHub web editor.

---

## Who this is for

Anyone who speaks fluent French and wants to improve or update a country's French analysis. You do not need to know how to code.

---

## Files involved

Each country has two language files:

| File | Language | You edit |
|---|---|---|
| `content/countries/CAN/can.en.yaml` | English | Researchers only |
| `content/countries/CAN/can.fr.yaml` | French | Translators |

The English file is the source of truth. The French file must mirror it exactly — same structure, same `[citation-id]` markers, translated prose.

---

## Step-by-step

### 1. Open the French file on GitHub

Go to: `https://github.com/worldpeggy2024-cloud/transhorizons_rebuild`

Navigate to: `content/countries/CAN/can.fr.yaml`

Click the **pencil icon** (Edit this file) in the top right of the file view.

### 2. Create a branch

At the bottom of the edit page, GitHub will ask how to save:

- Select **"Create a new branch for this commit and start a pull request"**
- Name the branch something like `fr-canada-update-2026-04`
- Click **"Propose changes"**

### 3. Edit the French text

Edit only the French prose. **Do not change:**
- The YAML structure (indentation, keys like `executiveSnapshot:`, `political:`, etc.)
- The `[citation-id]` markers — these must be identical to the EN file
- Person names (keep in English: "Mark Carney", not "Marc Carney")

**Do translate:**
- All narrative text
- Institution names that have official French equivalents (e.g. "Gendarmerie royale du Canada")

### 4. Fill out the PR checklist

GitHub will open a Pull Request form. The template will appear automatically — fill out each checkbox.

### 5. Submit and wait for review

The maintainer will review, run the automated citation check, and merge if everything passes.

---

## What happens after merge

The maintainer runs `node scripts/generate-country-data.cjs CAN` to regenerate the TypeScript file, then commits and deploys. The French page on the website updates within minutes.

---

## Questions?

Open a GitHub Issue on the repository or contact the maintainer directly.
