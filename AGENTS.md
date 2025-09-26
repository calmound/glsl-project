# Repository Guidelines

## Project Structure & Module Organization
- Source: `src/` (Next.js App Router in `src/app/`, UI in `src/components/`, helpers in `src/lib/`, contexts/hooks/utils/styles`).
- Tutorials: `src/lib/tutorials/<category>/<tutorial-id>/` with `config.json`, `en-README.md`, `zh-README.md`, and shader files (`fragment.glsl`, `fragment-exercise.glsl`). Shared GLSL in `src/lib/glsl/`.
- Public assets: `public/`. Scripts: `scripts/` (e.g., sitemap generator).

## Build, Test, and Development Commands
- Install: `pnpm install`
- Dev server: `pnpm dev` (Next.js with Turbopack).
- Build: `pnpm build` (creates optimized production build).
- Start: `pnpm start` (serve production build).
- Lint: `pnpm lint` (ESLint + Next rules).
- Generate sitemap: `pnpm xml` (runs `scripts/generate-sitemap.js`).

## Coding Style & Naming Conventions
- Language: TypeScript (strict mode). Path alias `@/* -> src/*`.
- Formatting: Prettier (2 spaces, semicolons, single quotes, width 100, trailing commas `es5`, `arrowParens: avoid`).
- Linting: `next/core-web-vitals`, `next/typescript`; `@typescript-eslint/no-explicit-any` is disabled.
- Filenames: kebab-case for files (`shader-canvas.tsx`), PascalCase for React component exports, camelCase for variables/functions.
- GLSL files use lowercase with dashes; prefer small, pure helper functions in `src/lib/glsl/`.

## Testing Guidelines
- No formal test suite yet. When adding tests, prefer Playwright for pages and lightweight unit tests for utilities.
- Manual QA: verify `/[locale]/learn` pages render both `fragment.glsl` and `fragment-exercise.glsl`, and check i18n toggles (`en`/`zh`).

## Commit & Pull Request Guidelines
- Use Conventional Commits: `feat(scope): summary`, `fix(scope): summary`, `refactor(scope): ...` (see Git history).
- PRs must include: concise description, screenshots/GIFs for UI or shader output, steps to reproduce/test, and related issue links.
- Keep changes scoped; update `config.json` and both locale READMEs when altering a tutorial.

## Tutorial Content & Assets
- New tutorial layout: `src/lib/tutorials/<category>/<id>/` with `config.json` fields: `id`, `category`, `difficulty`, `title`/`description` (object with `en`/`zh`).
- Provide both `fragment.glsl` and `fragment-exercise.glsl`; keep examples minimal and well-commented.

## Security & Configuration Tips
- Env: use `.env.local` (e.g., `NEXT_PUBLIC_BASE_URL`) and never commit secrets.
- i18n: default locale is `en`; mirror content for `zh`.
- Webpack handles GLSL via `glslify-loader` + `raw-loader`; prefer importing via `@/lib/...`.
