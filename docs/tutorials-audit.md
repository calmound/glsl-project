<!-- AUTO-GENERATED: tutorials-audit (human-maintained summary) -->

# Tutorials / Exercises Audit Notes

This repo is a bilingual (EN/ZH) GLSL learning platform. Tutorials are file-based and rendered by Next.js App Router pages under `/learn`.

## Where tutorials live

- Tutorials root: `src/lib/tutorials/`
- Layout (per tutorial): `src/lib/tutorials/<category>/<id>/`
  - `config.json`
  - `en-README.md`
  - `zh-README.md`
  - `fragment.glsl` (reference / answer)
  - `fragment-exercise.glsl` (exercise starter)
  - Optional: `vertex.glsl`

## Current coverage targets (implemented)

- `basic`: 30 tutorials
- Other categories (`animation`, `patterns`, `math`, `noise`, `lighting`): at least 15 tutorials each

## How the site loads tutorials

- Server reads from filesystem only: `src/lib/tutorials-server.ts`
  - `getTutorials(locale)` loads all categories + tutorials
  - `getTutorialsByCategory(category, locale)` loads a single category
  - Sorting:
    - Within a category: `difficulty` → `prerequisites.length` → `estimatedTime` → `id`
    - Across categories (all tutorials): category name then the same sort keys
- `getTutorialReadme(category, id, locale)` reads `en-README.md`/`zh-README.md` directly (no runtime generation).

## Bilingual code display (GLSL comments)

Some GLSL files contain Chinese comments. For English pages, the app uses:

- `getTutorialShadersLocalized(category, id, locale)` in `src/lib/tutorials-server.ts`
  - For `locale === 'en'` it strips GLSL comments and prepends an English header derived from `config.json`.

This keeps the actual shader source files bilingual-friendly without showing Chinese-only comments to English users at runtime.

## README quality workflow (recommended)

Tutorial docs should teach beginners to implement the exercise, and should match the actual shader code.

To keep docs consistent and code-aware, use:

- Generator script: `scripts/regenerate-tutorial-readmes.js`
  - Reads `config.json`, `fragment.glsl`, `fragment-exercise.glsl`
  - Detects common “recipes” (gradient/stripes/distance-mask/ring/polar/noise/lighting/…) from GLSL
  - Writes `en-README.md` and `zh-README.md`
  - Preserves any prior manual content (if not already auto-generated) under “Additional Notes/补充笔记”

Run:

```bash
node scripts/regenerate-tutorial-readmes.js
```

## Manual QA checklist

- `/learn` (EN default locale) shows English titles/descriptions.
- `/zh/learn` shows Chinese titles/descriptions.
- `/[locale]/learn/<category>/<id>` renders:
  - README in correct language
  - `fragment.glsl` and `fragment-exercise.glsl` compile
  - “Next/Prev” order follows difficulty progression (not lexicographic).

