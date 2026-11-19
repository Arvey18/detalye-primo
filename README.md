# detalye-primo

Marketing website with online booking for Detalye Primo, a car detailing company.

## Stack

- **Vite + React 19 + TypeScript 6**
- **React Router v7 (framework mode)**, static prerendering for SEO, see [SEO](#seo)
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **shadcn/ui** (Radix base, Nova preset, Lucide icons) — add components with `npx shadcn@latest add <name>`
- **Motion** (`motion/react`) for animations, **Lenis** for smooth scrolling
- **vite-plugin-svgr** — import SVGs as components: `import Logo from '@assets/svg/logo-mark.svg?react'`
- **Vitest + Testing Library** (jsdom) for unit tests
- **oxlint** for linting

## Scripts

| Command                | What it does                                                           |
| ---------------------- | ---------------------------------------------------------------------- |
| `npm run dev`          | Start the dev server at http://localhost:3000                          |
| `npm run build`        | Build and prerender the static site into `build/client`                |
| `npm run preview`      | Serve `build/client` at http://localhost:3000 like a static host would |
| `npm test`             | Run tests in watch mode                                                |
| `npm run test:run`     | Run tests once                                                         |
| `npm run coverage`     | Run tests with coverage                                                |
| `npm run lint`         | Lint with oxlint                                                       |
| `npm run typecheck`    | Generate route types and typecheck                                     |
| `npm run format`       | Format all files with Prettier (sorts Tailwind classes too)            |
| `npm run format:check` | Check formatting without changing files (for CI)                       |
| `npm run check`        | **Before pushing code changes:** format check, typecheck, lint, tests  |

## Setup

1. Use Node 22.12+ (pinned in `.nvmrc`; with nvm/fnm run `nvm use`). `npm install` refuses older versions (`engine-strict` in `.npmrc`).
2. `npm install`
3. Copy `.env.example` to `.env` (the build fails with a clear message if it is missing).
4. `npm run dev`

### Environment variables

| Variable        | Purpose                                                               |
| --------------- | --------------------------------------------------------------------- |
| `VITE_SITE_URL` | Production origin for canonical URLs, social previews and the sitemap |

- Every `VITE_*` variable ends up in the public JavaScript bundle — **never put secrets in them**.
- Read them through `env` from `@config` (validated in `src/config/env.ts`), not `import.meta.env` directly.
- Adding one: update `.env.example`, `src/types/env.d.ts` and `src/config/env.ts`.
- Only `.env.example` is committed; `.env` and `.env.*` stay local. Set the same variables in your host and CI.

## Structure

```
src/
  root.tsx            app shell: <html>, <head>, error boundary (React Router entry)
  routes.ts           route table (React Router entry)
  assets/svg/         SVGs (import as components with ?react)
  components/
    layout/<name>/    site header, footer
    motion/<name>/    animation wrappers (Reveal, PageTransition)
    ui/               shadcn/ui components (generated — keep flat)
  config/             env vars, site details, SEO/business info, nav, URL paths
  constants/          services catalog, vehicle types, time slots
  types/              global type declarations (env variables)
  hooks/<name>/       shared hooks (smooth scroll, useIsClient)
  layouts/<name>/     route layouts (header + footer around pages)
  pages/<name>/       route modules: home, services, booking, contact, not-found
  resources/<name>/   non-HTML routes: sitemap.xml, robots.txt
  styles/             global CSS / Tailwind theme
  utils/              cn, formatters, SEO helpers
  test/               all tests, mirroring the src layout
    helpers/          test utilities (renderRoute)
    setup.ts          Vitest setup
react-router.config.ts  prerender list and static (ssr: false) mode
```

### Conventions

- Every module lives in its own folder with an `index.tsx` (or `index.ts`) entry, e.g. `pages/booking/index.tsx`. Shared folders (`config`, `constants`, `utils`, `hooks`) have an `index.ts` barrel — import from the folder: `import { paths } from '@config'`.
  - Exception: `src/root.tsx` and `src/routes.ts` — React Router requires these exact names.
- Pages are route modules: `export default` the component and `export const meta` for SEO tags (use `buildMeta()` from `@utils`).
- Tests go in `src/test/`, mirroring the source path: `src/pages/booking` → `src/test/pages/booking.test.tsx`.
- Import through folder aliases, never long relative paths: `@components/...`, `@config`, `@constants`, `@hooks`, `@layouts/...`, `@pages/...`, `@resources/...`, `@assets/...`, `@styles/...`, `@test/...`, `@utils`. VS Code auto-imports use them automatically. `@/` still points at `src/` (used for single files like `@/routes`).
  - New top-level folder? Add its alias in `vite.config.ts` (`aliasedFolders`) and in `paths` in both `tsconfig.json` and `tsconfig.app.json`.
- Accessibility rules (`jsx-a11y`) are errors in `npm run lint`: give images `alt` text, use real `<button>`/`<a>` elements for clicks, and label every form field. Lint can't check color contrast or focus order — check those with Lighthouse.
- Use `paths` / `bookingPath()` from `@config` instead of hard-coded URLs.
- Add folders (e.g. `services/` for API calls, `assets/images/`) only when there is something to put in them.

## Claude Code hooks

When Claude Code edits this repo, hooks in `.claude/settings.json` hold its output to the same standard as yours:

- **After every file Claude edits** (`.claude/hooks/post-edit.mjs`): Prettier formats it and `oxlint --fix` lints it. Remaining lint errors (including accessibility) are sent back to Claude to fix immediately.
- **Before Claude finishes a turn** (`.claude/hooks/stop-verify.mjs`): `npm run typecheck` and `npm run test:run`. Failures are sent back to Claude to fix; after 3 failed attempts it stops and warns you. Skipped when no source or config file changed since the last passing run.

These only affect Claude's edits, not yours. To turn them off temporarily, set `"disableAllHooks": true` in `.claude/settings.local.json`.

## SEO

The site is fully static (`ssr: false`), but every page in `indexablePaths` (`src/config/routes.ts`) is **prerendered to real HTML at build time**, so search engines and social link previews (Facebook, Messenger, Viber…) see the full content and per-page tags without running JavaScript.

What each page gets (via `buildMeta()` in `src/utils/seo.ts`):

- `<title>`, meta description, canonical URL
- Open Graph + Twitter card tags (share image once `siteConfig.ogImage` is set)
- JSON-LD structured data — `AutoWash` local business on Home, `OfferCatalog` of services on Services

Also generated at build time: `/sitemap.xml` and `/robots.txt`.

**Adding a page:** add the path to `paths` and `indexablePaths`, add the route in `src/routes.ts`, and export `meta` from the page.

**Prerendering rule:** the HTML is generated at build time, so a page's first render must not depend on the visitor (query string, current date, `window`). Use `useIsClient()` from `@hooks` for anything that does — see the booking page's calendar and `?service=` preselect.

### Before launch

Fill in the real details in `src/config/site.ts` — they feed Google directly:

- `url` (production domain), phone, email
- `businessAddress`, `openingHours`, `sameAs` (social profiles)
- `ogImage` — add a 1200×630 image to `public/` and point to it

### Hosting

Planned host: **Render** (Static Site) — not set up yet. Settings to use:

| Setting           | Value                                                      |
| ----------------- | ---------------------------------------------------------- |
| Build command     | `npm ci && npm run check && npm run build`                 |
| Publish directory | `build/client`                                             |
| Environment       | `VITE_SITE_URL` = production URL                           |
| Rewrite rule      | Source `/*` → Destination `/__spa-fallback.html` (Rewrite) |
| Node version      | Read automatically from `.nvmrc`                           |

Running the checks in the build command means a broken change fails the deploy and the previous version stays live. Any other static host works the same way: publish `build/client` and fall back unknown URLs to `/__spa-fallback.html`.
