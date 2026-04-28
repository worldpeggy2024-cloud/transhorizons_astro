# GitHub Setup — Day One Checklist

Run these steps once to put the content repo on GitHub. After this, all future updates go through normal `git add / commit / push` or GitHub web editor PRs.

---

## Prerequisites

- [ ] Git installed (`git --version` works in terminal)
- [ ] GitHub account created at https://github.com
- [ ] Personal Access Token created at https://github.com/settings/tokens (scope: `repo`)

---

## Steps

### 1. Initialize git in the content folder

```bash
cd content
git init
git add .
git commit -m "Initial content commit"
```

### 2. Create a GitHub repo

Go to https://github.com/new

- Name: `transhorizons-content` (or your preferred name)
- Visibility: **Private** (recommended — content before publication)
- No README, no .gitignore (you already have them)

### 3. Push

```bash
git remote add origin https://github.com/YOUR_USERNAME/transhorizons-content.git
git push -u origin master
```

### 4. Verify

Open the repo on GitHub. You should see:
- `countries/CAN/` folder with 4 YAML files
- `docs/` folder
- `.gitignore`
- `CONTRIBUTING-translators.en.md`

### 5. Optional: set as submodule of the app repo

```bash
# From the app repo root (transhorizons_rebuild)
git submodule add https://github.com/YOUR_USERNAME/transhorizons-content.git content
git commit -m "Add content as submodule"
```

This links the two repos so `git submodule update --remote` pulls the latest content into the app repo.

---

## After setup: normal update flow

```bash
# Edit a YAML file, then:
git add content/countries/CAN/can.en.yaml
git commit -m "Canada: update economy section Q2 2026"
git push

# In app repo: regenerate and commit
node scripts/generate-country-data.cjs CAN
git add src/data/countries/CAN/can.generated.ts
git commit -m "Regenerate Canada from updated YAML"
git push
```
