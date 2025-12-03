# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js-based GLSL (OpenGL Shading Language) learning platform with bilingual support (English/Chinese). The platform provides interactive shader tutorials with live preview, code editing, and exercises.

## Development Commands

### Essential Commands
- `pnpm install` - Install dependencies (uses pnpm, not npm)
- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Create production build
- `pnpm start` - Serve production build
- `pnpm lint` - Run ESLint with Next.js rules
- `pnpm xml` - Generate sitemap (runs `scripts/generate-sitemap.js`)

### Alternative Start
- `./start.sh` - Bash script to start dev server (may need `chmod +x ./start.sh`)

## Architecture

### Core Routing Structure

The project uses Next.js 15+ App Router with locale-based routing:
- **Root layout**: `src/app/layout.tsx` (handles Google Analytics, root metadata)
- **Locale router**: `src/app/[locale]/` for all i18n pages
- **Middleware**: `middleware.ts` detects and redirects based on locale (en/zh)
- **Root fallback**: `src/app/page.tsx` redirects to locale-specific home

Key pages:
- Home: `/[locale]/page.tsx` (client component: `home-client.tsx`)
- Learn hub: `/[locale]/learn/page.tsx` (client: `learn-client.tsx`)
- Tutorial detail: `/[locale]/learn/[category]/[id]/page.tsx` (client: `tutorial-client.tsx`)
- About: `/[locale]/about/page.tsx`
- Examples: `/[locale]/examples/page.tsx`
- Glslify guide: `/[locale]/glslify-guide/page.tsx`

### Internationalization (i18n)

- **Configuration**: `src/lib/i18n.ts` defines `locales = ['en', 'zh']`, `defaultLocale = 'en'`
- **Translations**: `src/lib/translations.ts` exports `getTranslationFunction(locale)` for client-side use
- **Language context**: `src/contexts/LanguageContext.tsx` provides React context for locale switching
- **URL structure**: English uses base paths (`/learn`), Chinese prefixes with locale (`/zh/learn`)
- **Middleware**: Auto-detects locale from URL and handles redirects; does not apply to API routes, static files, or sitemaps

### Tutorial Data System

Tutorials are file-based and stored in `src/lib/tutorials/[category]/[id]/`:

**Required files per tutorial:**
- `config.json` - Tutorial metadata (title, description, difficulty, category, tags, uniforms)
- `fragment.glsl` - Complete working shader example
- `fragment-exercise.glsl` - Exercise template for users
- `en-README.md` - English explanation
- `zh-README.md` - Chinese explanation

**config.json structure:**
```json
{
  "id": "tutorial-id",
  "title": { "zh": "中文标题", "en": "English Title" },
  "description": { "zh": "中文描述", "en": "English description" },
  "difficulty": "beginner" | "intermediate" | "advanced",
  "category": "basic" | "patterns" | etc.,
  "tags": ["tag1", "tag2"],
  "estimatedTime": 10,
  "prerequisites": ["other-tutorial-id"],
  "learningObjectives": { "zh": [...], "en": [...] },
  "uniforms": { "u_time": 0.0, "u_resolution": [300, 300] }
}
```

**Server-side loading**: `src/lib/tutorials-server.ts` exports `getTutorials(locale)`, `getTutorialByIdServer(category, id, locale)`, `getTutorialContent(category, id, locale)` - reads filesystem, parses config.json, returns localized data.

### WebGL/GLSL Integration

**Webpack configuration** (`next.config.ts`):
- Uses `glslify-loader` + `raw-loader` to import `.glsl`, `.vs`, `.fs`, `.vert`, `.frag` files
- Supports `#pragma glslify:` directives for modular shaders

**Shared GLSL utilities**: `src/lib/glsl/`
- `colors.glsl` - Color manipulation functions
- `math.glsl` - Math utilities
- `noise.glsl` - Noise functions

**Glslify modules installed**:
- `glsl-noise` - Noise functions (simplex, perlin)
- `glsl-hsl2rgb` - HSL to RGB conversion
- `glsl-rotate` - Rotation transforms
- `glsl-easings` - Easing functions

**Shader rendering components**:
- `src/components/common/shader-canvas.tsx` - Main WebGL canvas with fragment/vertex shader compilation, uniform passing, animation loop
- `src/components/common/shader-canvas-new.tsx` - Alternative implementation
- `src/components/common/shader-editor.tsx` - Code editor + live preview for tutorials
- `src/components/ui/code-editor.tsx` - CodeMirror-based editor with GLSL syntax highlighting

### API Routes

- `/api/shader/[category]/[id]/route.ts` - Fetch shader code for a tutorial
- `/api/shader-file/route.ts` - Generic shader file access
- `/api/tutorials/route.ts` - List all tutorials (JSON)
- `/api/og/route.tsx` - Dynamic Open Graph image generation using Vercel OG
- `/robots.txt/route.ts` - Dynamic robots.txt
- `/sitemap-index.xml/route.ts` - Sitemap index

### SEO & Metadata

**Dynamic metadata**: Each page exports `generateMetadata()` returning Next.js `Metadata` with:
- Localized title/description
- Open Graph tags (og:title, og:description, og:image, og:locale)
- Twitter Card metadata
- Canonical URLs
- Keywords
- hreflang links for bilingual support

**Structured data components** (`src/components/seo/`):
- `structured-data.tsx` - JSON-LD for WebSite, Organization, Course schemas
- `tutorial-structured-data.tsx` - TechArticle schema for tutorials
- `breadcrumb.tsx` - BreadcrumbList schema + UI component

**Sitemap**: Generated via `pnpm xml` script, includes all locale variants, priorities, and change frequencies.

**PWA**: `public/manifest.json` defines app metadata for progressive web app features.

## Code Organization

### Component Structure

- `src/components/ui/` - Reusable UI components (Button, Card, Toast, LanguageSwitcher)
- `src/components/common/` - Shader-specific components (ShaderCanvas, ShaderEditor)
- `src/components/layout/` - Layout wrappers (MainLayout)
- `src/components/seo/` - SEO/metadata components
- `src/components/examples/` - (Currently empty, reserved for shader examples)

### Utilities

- `src/lib/utils.ts` - General utilities
- `src/lib/shader-data.ts` - Legacy shader data (may be deprecated in favor of file-based tutorials)
- `src/utils/glsl-lang.ts` - GLSL syntax definition for CodeMirror

### Styling

- **Tailwind CSS 4** with PostCSS
- `tailwind.config.ts` - Tailwind configuration
- `src/app/globals.css` - Global styles and Tailwind directives
- **CSS Modules**: `src/components/ui/code-editor.css` for CodeMirror theming

### TypeScript Configuration

- Path alias: `@/*` → `src/*`
- Strict mode enabled
- Target: ES2017
- Module resolution: bundler
- `@typescript-eslint/no-explicit-any` is disabled in ESLint

## Important Patterns

### Adding a New Tutorial

1. Create directory: `src/lib/tutorials/[category]/[tutorial-id]/`
2. Add required files: `config.json`, `fragment.glsl`, `fragment-exercise.glsl`, `en-README.md`, `zh-README.md`
3. Ensure `config.json` has both `en` and `zh` keys for `title`, `description`, and `learningObjectives`
4. Set appropriate `category`, `difficulty`, `tags`, and `uniforms`
5. Tutorial will auto-appear in `/[locale]/learn` and `/[locale]/learn/[category]/[tutorial-id]`

### Locale-Aware Components

- Always use `getValidLocale(localeParam)` to validate locale params
- Use `getTranslationFunction(locale)` for translations
- Pass `locale` prop to all pages that need i18n
- Server components can read translations directly; client components use `LanguageContext`

### Authentication Flow

**Middleware execution order** (`middleware.ts`):
1. Check if path has locale prefix (`/en/`, `/zh/`) or is root (`/`) → Allow through (public)
2. Check if path is protected (`/app/*`, `/signin`) → Continue to auth check
3. If not protected → Allow through (public pages like `/learn`, `/about`)
4. For protected paths: Create Supabase client, check `getUser()`
5. Redirect `/app/*` to `/signin` if not authenticated
6. Redirect `/signin` to `/` if already authenticated

**Important**: Most pages are public. Only `/app/*` paths require auth. Don't add auth checks to public learning pages.

### Shader Validation

While the platform shows GLSL in editors, runtime validation happens in `ShaderCanvas` via WebGL compilation. There is no static GLSL linter integrated; errors appear in console/canvas.

### Performance & Caching

- Sitemap cached for 1 hour (`Cache-Control: public, max-age=3600`)
- Robots.txt cached for 24 hours
- Static assets served from `public/`
- Use `next/image` for optimized image loading

## Supabase Integration

The project uses Supabase for authentication and data persistence.

### Authentication System

**OAuth providers**: Google and GitHub
- **Sign-in page**: `/signin` - OAuth login buttons
- **Callback handler**: `/auth/callback/route.ts` - Exchanges OAuth code for session, syncs user profile
- **Protected routes**: `/app/*` paths require authentication (enforced in `middleware.ts`)
- **Middleware logic**: `middleware.ts` checks auth only for protected paths; public pages (`/learn`, `/about`, etc.) are not protected

**Client and Server Supabase instances**:
- **Browser client**: `src/lib/supabase.ts` exports `createBrowserSupabase()` (singleton pattern)
- **Server client**: `src/lib/supabase-server.ts` exports `createServerSupabase()` (uses cookies from Next.js headers)

### Database Schema

**Tables**:
- `profiles` - User profile data (id, email, name, avatar_url, last_login_at). Auto-synced on OAuth login.
- `user_form_code` - User-submitted GLSL code (user_id, form_id, code_content, language, is_draft). Unique constraint: (user_id, form_id).
- `user_form_status` - Exercise submission status (user_id, form_id, has_submitted, attempts, is_passed, first_passed_at, last_submitted_at, last_result). Unique constraint: (user_id, form_id).

**Edge Functions** (`supabase/functions/`):
- `submit_form` - Validates user submissions, updates `user_form_status` with judging results. Uses service_role for privileged writes. Current implementation has placeholder judging logic (always fails).
- Functions use Deno runtime, not Node.js. Import from `https://deno.land/` or `https://esm.sh/`.
- Deploy via Supabase CLI: `supabase functions deploy <function-name>`

**Testing**: `/test-supabase` page provides connection diagnostics (client creation, auth check, database query, save test).

### Supabase Client Patterns

**Client-side components**:
```typescript
import { createBrowserSupabase } from '@/lib/supabase';
const supabase = createBrowserSupabase();
```

**Server-side components and API routes**:
```typescript
import { createServerSupabase } from '@/lib/supabase-server';
const supabase = await createServerSupabase();
```

**Middleware**: Uses `createServerClient` from `@supabase/ssr` with cookie management.

## Environment Variables

- `NEXT_PUBLIC_BASE_URL` - Base URL for SEO, OG images, canonical links (defaults to `https://www.shader-learn.com`)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL (required)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key (required, public-safe)
- `NEXT_PUBLIC_BASE_URL` - Site URL for OAuth redirects (used in `/signin`)
- `NEXT_PUBLIC_GA_ID` - Google Analytics tracking ID (optional)
- Store secrets in `.env.local` (gitignored)

## Testing & Quality

- No formal test suite currently exists
- Manual QA checklist:
  - Verify both `/en/learn/[category]/[id]` and `/zh/learn/[category]/[id]` render correctly
  - Check that `fragment.glsl` and `fragment-exercise.glsl` both display
  - Test language switcher toggles between en/zh
  - Validate shader compilation in browser console
  - Check Open Graph images via social media debuggers

## Git & Commit Conventions

- Use Conventional Commits: `feat(scope):`, `fix(scope):`, `refactor(scope):`, etc.
- Examples from history: `feat(layout): 更新根布局以支持SEO`, `fix(layout): 调整Google标签脚本加载顺序`
- Keep commits scoped and atomic
- Update both locale READMEs when changing tutorial content

## Dependencies Notes

- **Package manager**: pnpm (not npm or yarn)
- **Next.js**: 15.3.2 (uses App Router, React 19)
- **React**: 19.0.0
- **CodeMirror**: `@uiw/react-codemirror` for editor
- **Markdown**: `react-markdown` for tutorial rendering
- **Tailwind**: v4 with PostCSS
- **GLSL tooling**: glslify, glslify-loader, raw-loader

## Known Patterns from Existing Code

- **Metadata generation**: Every route with dynamic content exports `generateMetadata()` using Next.js Metadata API
- **Client/Server split**: Pages are server components that fetch data, then render client components (e.g., `page.tsx` → `tutorial-client.tsx`)
- **Uniform handling**: `ShaderCanvas` accepts `uniforms` prop; automatically passes `u_time` (animated) and `u_resolution`
- **Default vertex shader**: `ShaderCanvas` provides a default passthrough vertex shader; tutorials only need to provide fragment shaders
- **Google Analytics**: Configured in root layout with gtag scripts; uses `NEXT_PUBLIC_GA_ID` if available
