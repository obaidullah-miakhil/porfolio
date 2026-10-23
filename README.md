# Obaidullah Miakhil — Personal Portfolio (`obaidullah-miakhil-portfolio`)

Personal academic and engineering portfolio for **Obaidullah Miakhil** (AI Engineer & Machine Learning Researcher, MS Artificial Intelligence at PAF-IAST, Research Engineer at SPCAI).

## Architecture & Completed Phases (Phases 1–4)

- **Framework**: Next.js 16 (App Router, Static Site Generation via `generateStaticParams`), TypeScript, React 19, Tailwind CSS v4.
- **Internationalization (`next-intl`)**: 4 locales (`en` default LTR at `/`, and `ps`, `fa`, `ur` RTL at `/ps`, `/fa`, `/ur`) with `localePrefix: 'as-needed'` and `localeDetection: false`.
- **Theme (`next-themes`)**: `attribute="data-theme"`, `defaultTheme="system"`, `enableSystem`. Single Lapis Blue accent (`#1E4BD2` light / `#7C9BFF` dark) and neutral surface tokens in `src/styles/globals.css`.
- **Hard Ban on Gradients**: Enforced by `scripts/check-no-gradients.mjs` during `npm run build` across `src/`, `app/`, and built CSS.
- **Typography**: Self-hosted **Vazirmatn** variable font (`src/fonts/Vazirmatn-Variable.woff2`) + static weights (`src/fonts/Vazirmatn-Regular.ttf`, `src/fonts/Vazirmatn-Bold.ttf`) for `next/og`.
- **Single Source of Truth**: `src/content/profile.ts` + UI strings in `messages/{en,ps,fa,ur}.json`.
- **SEO & Structured Data (Phase 3)**:
  - `src/lib/seo.ts`: `ProfilePage` + `Person` (`#person`, 15 `alternateName` variants, `nationality` omitted) + `WebSite` JSON-LD on `/`, and `ScholarlyArticle` JSON-LD on `/research` (`DOI: 10.3389/frhs.2026.1927175`).
  - `app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts`, `app/icon.tsx`, `app/apple-icon.tsx`, `app/[locale]/opengraph-image.tsx`.
- **Procedural 3D Scenes (Phase 4)**:
  - `src/three/SceneGate.tsx` & `src/lib/device.ts`: Static inline SVG posters (`src/three/PosterSvgs.tsx`) rendered in SSR HTML, capability gate (`prefers-reduced-motion`, `saveData`, memory/CPU cores, software WebGL check, `?force3d=1` test override), and single-canvas coordinator.
  - `src/three/HeroForm.tsx`: Detail-4 icosahedron displaced by 3D simplex noise in a custom vertex shader, flat-shaded per-face normals (`dFdx`/`dFdy`), 15% opacity `--text` wireframe overlay, slow rotation, pointer parallax tilt, scroll amplitude easing, and live Light/Dark CSS variable syncing.
  - `src/three/AttentionGrid.tsx`: 14×14 `InstancedMesh` isometric attention activation map on `/research`.

## Scripts

```bash
npm install
npm run dev              # Starts Next.js dev server on port 3000
npm run build            # Syncs routes, runs next build, and verifies zero gradients
npm test                 # Runs node:test unit suite (src/lib/profile.test.ts)
npm run check:gradients  # Verifies zero occurrences of 'gradient' in source & CSS
```

## Remaining Phases for Antigravity (Phases 5–8)

- **Phase 5**: Live GitHub project cards enrichment (`GITHUB_TOKEN`) and capturing/optimizing real desktop & mobile WebP screenshots for `public/projects/*.webp`.
- **Phase 6**: Full native review & refinement of Pashto (`messages/ps.json`), Dari (`messages/fa.json`), and Urdu (`messages/ur.json`) translations + end-to-end RTL layout audit.
- **Phase 7**: Lighthouse speed tests, bundle inspection, and CWV optimizations.
- **Phase 8**: Deploy to Vercel and connect custom domain (`profile.domain` and `profile.gscToken` in `src/content/profile.ts`).
