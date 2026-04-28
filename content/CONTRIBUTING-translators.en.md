# Contributing as a Translator — TransHorizons

Thank you for helping improve the French content on TransHorizons. This guide explains everything you need to know. No coding experience required.

---

## What translators do

Each country analysis has an English version and a French version. Researchers write and maintain the English. Translators keep the French version accurate, natural, and up to date.

Your job is to translate or update the French text in one file: `content/countries/[CODE]/[code].fr.yaml`

---

## What you do NOT change

- The file structure (the indented lines with colons — YAML formatting)
- The `[citation-id]` markers like `[imf]`, `[pm-ca]` — these must stay identical to the English file
- Person names — keep them in English (e.g. "Mark Carney", not "Marc Carney")
- Numbers and dates

---

## What you DO translate

- All narrative prose (sentences and paragraphs)
- Institution and party names that have an official French equivalent
  - ✅ "Gendarmerie royale du Canada" (not "Royal Canadian Mounted Police")
  - ✅ "Parti libéral du Canada" (not "Liberal Party of Canada")
  - ✅ "Banque du Canada" (not "Bank of Canada")

---

## How to submit a translation

You do this entirely in your browser — no software to install.

1. Go to the repository on GitHub
2. Navigate to the French file for the country you're translating
3. Click the pencil icon (Edit this file)
4. Make your changes in the editor
5. At the bottom, choose **"Create a new branch"** and click **Propose changes**
6. Fill out the checklist in the Pull Request form
7. Submit — a maintainer will review and merge

Full step-by-step with screenshots: see `content/docs/translation-workflow.md`

---

## Quality standards

- You must be a native or near-native French speaker, or have your translation reviewed by one
- Avoid machine translation without careful human review
- Match the register of the English (formal analytical prose, not journalistic)
- If you're unsure about a term, leave a comment in the PR

---

## Questions?

Open a GitHub Issue or contact the maintainer directly.
