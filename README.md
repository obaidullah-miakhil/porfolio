# Obaidullah Miakhil — Personal Academic & Engineering Portfolio

Production-ready personal portfolio website for **Obaidullah Miakhil** (`https://obaidullah.online`), an AI engineer and machine learning researcher applying for **PhD positions in Computer Science (September 2027 intake onwards)** with a focus on **Medical Diagnosis, Deep Learning & NLP/LLMs**, as well as **AI/ML engineering roles**.

---

## 1. Tech Stack & Architectural Decisions

| Layer | Choice | Rationale |
|---|---|---|
| **Framework** | **Next.js 16.x (App Router), React 19, TypeScript** | Static Site Generation (SSG via `generateStaticParams`), built-in Metadata API, image optimization, native Vercel deployment. |
| **Styling** | **Tailwind CSS v4** | Strict 7-token CSS variable system (`--bg`, `--surface`, `--text`, `--muted`, `--border`, `--accent`, `--accent-contrast`), flat solid colors, zero gradients. |
| **3D Engine** | **Three.js via `@react-three/fiber`** | One scene: the home-page story character, a rigged GLB (`public/models/avatar.glb`, meshopt-compressed) animated in code by `src/three/avatarRig.ts` (chapter gestures, walk cycle, breathing, gaze, blinks). Skipped for save-data, very low memory or no WebGL, where his photo stands in. |
| **Internationalization** | **next-intl** | 4 locales: `en` (default at `/`), `ps` (Pashto at `/ps`), `fa` (Dari/Persian at `/fa`), `ur` (Urdu at `/ur`). Full RTL support via CSS logical properties, per-locale metadata, hreflang alternates. |
| **Typography** | **Bricolage Grotesque, IBM Plex Mono, Vazirmatn** (SIL OFL) | Self-hosted. Vazirmatn covers Pashto, Dari and Urdu glyphs and the OG images. |
| **Analytics** | **@vercel/analytics & @vercel/speed-insights** | Lightweight Vercel-native telemetry. |

---

## 2. Hard Design Constraints Verified

- **Zero Gradients**: Strictly enforced via `scripts/check-no-gradients.mjs`, verifying that the substring `gradient` does not exist anywhere in `src/`, `app/`, or built CSS outputs.
- **One signal colour on paper** (`src/styles/globals.css`): `--bg #F4F1EA`, `--surface #FBFAF6`, `--text #141413`, `--muted #5E5B55`, `--border #DEDAD0`, `--accent #FF4F00` (fills, large type, the timeline) and `--accent-ink #B93A00` (small accent text, AA contrast). Single light theme with glassmorphism: frosted cards, header and rail (`--glass-*` tokens) over blurred ambient shapes (`.ambient` in the layout). Type: Bricolage Grotesque + IBM Plex Mono (self-hosted via `@fontsource`), Vazirmatn for RTL locales.
- **Inner pages** (Research, Projects, CV) share `src/components/page/PageParts.tsx`: `PageHero` (eyebrow, animated headline, lead, stats), `PageSection` and `StatPanel`, styled by the `.page`/`.panel` rules in `globals.css`.
- **Home page is a scroll story**: see `docs/STORY.md`. Vertical scroll drives a horizontal walk (`src/components/story/StoryStage.tsx`); the 3D character (`src/three/StoryAvatar.tsx` + `avatarRig.ts`) walks between chapters and plays one gesture per chapter. Story copy lives under `story` in `messages/en.json`; other locales fall back to English until translated.
- **Motion & Accessibility**: All CSS transitions respect `prefers-reduced-motion: reduce`. Directional arrows mirror in RTL (`.rtl-flip` / `.rtl-mirror`), while brand icons and 3D scenes maintain orientation.

---

## 3. Local Development & Scripts

Requires **Node.js 22.x** (`.nvmrc` included).

```bash
# 1. Install dependencies cleanly
npm ci

# 2. Start local development server (port 3000)
npm run dev

# 3. Type-check with TypeScript strict mode
npm run typecheck
npm run lint

# 4. Run unit & SEO metadata tests
npm test

# 5. Synchronize routes, build static production bundle, and verify zero gradients
npm run build

# 6. Run production server
npm run start

# 7. Verify zero gradients across source and built CSS
npm run check:gradients

# 8. Audit all internal routes for HTTP 200 status
npm run check:links

# 9. Re-capture website screenshots using Playwright + sharp
npm run screenshots

# 10. Webpack bundle analysis
npm run analyze
```

---

## 4. Content Management & Where to Edit

All portfolio content lives in a **single source of truth**:
- **Profile, Publications, Experience, Education, Repositories & Websites**:
  `src/content/profile.ts`
- **Hero 3D Character**: `public/models/avatar.glb` — a Mixamo / Ready Player Me style skeleton with ARKit face blendshapes. To replace it, compress the new export first:
  `npx @gltf-transform/cli optimize in.glb public/models/avatar.glb --compress meshopt --simplify false --join false --flatten false --instance false --palette false --texture-compress webp --texture-size 1024`
- **150+ Supervised Student Projects Cohort**:
  `src/content/supervisedProjects.ts`
- **Translations & UI Copy**:
  - English: `messages/en.json`
  - Pashto: `messages/ps.json`
  - Dari / Persian: `messages/fa.json`
  - Urdu: `messages/ur.json`

### Replacing Static Assets:
- **Profile Photo**: `public/images/obaidullah-miakhil.jpg`
- **Academic CV**: `public/cv/Obaidullah-Miakhil-Academic-CV.pdf`
- **Industry Résumé**: `public/cv/Obaidullah-Miakhil-Resume.pdf`
- **Client Website Screenshots**: `public/projects/` (or run `npm run screenshots`)

---

## 5. Deployment Instructions (Vercel + `obaidullah.online`)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "chore(release): finalize portfolio for obaidullah.online"
   git push origin main
   ```
2. **Import into Vercel**:
   - Framework Preset: **Next.js**.
   - Environment Variables (see `.env.example`):
     - `NEXT_PUBLIC_SITE_URL=https://obaidullah.online`
     - `GITHUB_TOKEN=` *(optional, increases GitHub API rate limit during ISR)*
     - `NEXT_PUBLIC_GSC_VERIFICATION=` *(optional, if using meta tag verification instead of DNS TXT)*
3. **Attach Custom Domain (`obaidullah.online`)**:
   - In Vercel Project Settings → **Domains**: add `obaidullah.online` and `www.obaidullah.online`.
   - Set `obaidullah.online` as the primary domain (`next.config.ts` also enforces a permanent 308 redirect from `www.obaidullah.online` to `https://obaidullah.online`).
   - At your domain registrar DNS settings, configure:
     - `A` record for `@` → `76.76.21.21`
     - `CNAME` record for `www` → `cname.vercel-dns.com`
4. **Search Engine Indexing**:
   - `robots.ts` and page metadata automatically allow indexing when `VERCEL_ENV=production` and set `noindex` on `*.vercel.app` preview deployments.
   - Verify `https://obaidullah.online` in **Google Search Console** and **Bing Webmaster Tools**, then submit `https://obaidullah.online/sitemap.xml`.

---

## 6. Remaining Optional Placeholders

The following items in `src/content/profile.ts` remain optional and render nothing on the live site while empty:

1. `orcidUrl`: Add your ORCID identifier URL (`https://orcid.org/0000-...`) once registered.
2. `gscToken`: Set via `NEXT_PUBLIC_GSC_VERIFICATION` or DNS TXT record.
