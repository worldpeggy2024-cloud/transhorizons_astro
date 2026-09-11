# Narration files expected by the site-film pipeline

22 lines per language, 44 files. Save each as WAV (or MP3) under capture/narration/ with EXACTLY this name.
One file per shot — never one file per movement. Build the pauses in the assembly, not in the model.

## EN

| File | Shot | Line |
|---|---|---|
| `shot01_en.wav` | 1 | TransHorizons. Independent research on Canada’s position in global systems. |
| `shot02_en.wav` | 2 | Everything here is published in full, in both official languages. |
| `shot05_en.wav` | 5 | First, twenty years of institutional translation. |
| `shot06_en.wav` | 6 | A ministerial prize. Textbooks listed in provincial curricula. |
| `shot08_en.wav` | 8 | The method is stated openly: institutional sources, structural analysis, traceable claims. |
| `shot09_en.wav` | 9 | The analyses are the core of the work. |
| `shot12_en.wav` | 12 | Every article can be read aloud. |
| `shot13_en.wav` | 13 | Each one carries its own maps, built from public data. |
| `shot15_en.wav` | 15 | Some are interactive: chokepoints, spheres of influence, Arctic routing. |
| `shot17_en.wav` | 17 | World Views: every country, one framework. |
| `shot18_en.wav` | 18 | The filter searches content, not only names. |
| `shot19_en.wav` | 19 | Country reports run six structural dimensions. |
| `shot20_en.wav` | 20 | Reports are read aloud, in voices chosen for the material. |
| `shot22_en.wav` | 22 | Sections collapse. You move through it your way. |
| `shot23_en.wav` | 23 | Built for long reading. |
| `shot24_en.wav` | 24 | Sections cross-reference each other. |
| `shot25a_en.wav` | 25a | Reports connect to each other. |
| `shot25b_en.wav` | 25b | The same framework, applied comparably. |
| `shot26_en.wav` | 26 | You leave, and come back exactly where you were. |
| `shot27_en.wav` | 27 | Every claim traces back to its source. |
| `shot29_en.wav` | 29 | Thirty-four minerals. Production, reserves, producers. |
| `shot30_en.wav` | 30 | TransHorizons. Peggy Brenier, Montreal. |

## FR

| File | Shot | Line |
|---|---|---|
| `shot01_fr.wav` | 1 | TransHorizons. Recherche indépendante sur la position du Canada dans les systèmes mondiaux. |
| `shot02_fr.wav` | 2 | Tout y est publié intégralement, dans les deux langues officielles. |
| `shot05_fr.wav` | 5 | D’abord, vingt ans de traduction institutionnelle. |
| `shot06_fr.wav` | 6 | Un prix ministériel. Des manuels inscrits aux programmes provinciaux. |
| `shot08_fr.wav` | 8 | La méthode est énoncée ouvertement : sources institutionnelles, analyse structurelle, données traçables. |
| `shot09_fr.wav` | 9 | Les analyses sont le cœur du travail. |
| `shot12_fr.wav` | 12 | Chaque article peut être lu à voix haute. |
| `shot13_fr.wav` | 13 | Chacun porte ses propres cartes, construites à partir de données publiques. |
| `shot15_fr.wav` | 15 | Certaines sont interactives : points d’étranglement, sphères d’influence, routes arctiques. |
| `shot17_fr.wav` | 17 | Vues du monde : chaque pays, un même cadre. |
| `shot18_fr.wav` | 18 | Le filtre cherche dans le contenu, pas seulement dans les noms. |
| `shot19_fr.wav` | 19 | Les rapports-pays suivent six dimensions structurelles. |
| `shot20_fr.wav` | 20 | Les rapports sont lus à voix haute, dans des voix choisies pour le contenu. |
| `shot22_fr.wav` | 22 | Les sections se replient. À vous de choisir votre parcours. |
| `shot23_fr.wav` | 23 | Conçu pour la lecture longue. |
| `shot24_fr.wav` | 24 | Les sections se renvoient les unes aux autres. |
| `shot25a_fr.wav` | 25a | Les rapports se rattachent les uns aux autres. |
| `shot25b_fr.wav` | 25b | Le même cadre, appliqué de façon comparable. |
| `shot26_fr.wav` | 26 | On sort, et on revient exactement où on était. |
| `shot27_fr.wav` | 27 | Chaque affirmation remonte à sa source. |
| `shot29_fr.wav` | 29 | Trente-quatre minéraux. Production, réserves, producteurs. |
| `shot30_fr.wav` | 30 | TransHorizons. Peggy Brenier, Montréal. |

## Rows to watch (from the production document)

- Shot 8 — the longest sentence; if it flattens, split at the colon into `shot08a_<lang>` and `shot08b_<lang>` and list both in shots.mjs (`narrationFiles`).
- Shot 15 (French) — the enumeration needs a beat before *routes arctiques*; slow the list with heavier punctuation rather than commas.

Existing files found in capture/narration/ at the time of writing this list:

- shot01_en.mp3
- shot01_fr.mp3
- shot02_en.mp3
- shot02_fr.mp3
- shot05_en.mp3
- shot05_fr.mp3
- shot06_en.mp3
- shot06_fr.mp3
- shot08_en.mp3
- shot08_fr.mp3
- shot09_en.mp3
- shot09_fr.mp3
- shot12_en.mp3
- shot12_fr.mp3
- shot13_en.mp3
- shot13_fr.mp3
- shot15_en.mp3
- shot15_fr.mp3
- shot17_en.mp3
- shot17_fr.mp3
- shot18_en.mp3
- shot18_fr.mp3
- shot19_en.mp3
- shot19_fr.mp3
- shot20_en.mp3
- shot20_fr.mp3
- shot22_en.mp3
- shot22_fr.mp3
- shot23_en.mp3
- shot23_fr.mp3
- shot24_en.mp3
- shot24_fr.mp3
- shot25a_en.mp3
- shot25a_fr.mp3
- shot25b_en.mp3
- shot25b_fr.mp3
- shot26_en.mp3
- shot26_fr.mp3
- shot27_en.mp3
- shot27_fr.mp3
- shot29_en.mp3
- shot29_fr.mp3
- shot30_en.mp3
- shot30_fr.mp3
