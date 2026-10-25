# FINAL REPORT — Obaidullah Miakhil Portfolio Audit, Polish & Release

**Canonical Domain:** `https://obaidullah.online`  
**Framework:** Next.js 16.4.x (App Router, SSG) · React 19 · TypeScript 5.8 (`strict: true`) · Tailwind CSS v4 · `next-intl` (`en`, `ps`, `fa`, `ur`) · `next-themes` · Three.js (`@react-three/fiber` + `@react-three/drei`)

---

## 1. Summary of Findings & Fixes Applied

| Area | Finding in Initial Version | Fix Applied |
|---|---|---|
| **Specification File** | `portfolio-agent-prompt.md` was stored under `public/assets/aistudio/` instead of repo root. | Restored canonical `/portfolio-agent-prompt.md` at the repository root. |
| **Next.js 16 Middleware Convention** | Used deprecated `middleware.ts` which emitted a Next.js 16 deprecation warning during build. | Renamed `/middleware.ts` to `/proxy.ts` (`ƒ Proxy (Middleware)`), eliminating all Next.js 16 build warnings. |
| **Environment & Config Files** | Missing `.env.example`, `.nvmrc`, static `/public/icon.svg`, `poweredByHeader: false`, and `www` → apex redirect. | Added `.env.example`, `.nvmrc` (`22`), `/public/icon.svg`, `npm run typecheck`, `engines: { "node": "22.x" }`, `poweredByHeader: false`, immutable static asset caching, and 308 permanent redirect from `www.obaidullah.online` to `https://obaidullah.online`. |
| **Strict 7-Token Palette & Gradients** | Several components used Tailwind utility colors (`emerald-500`, `emerald-600`, `amber-500`, `rose-400`, `#38bdf8`, `#3572A5`, `#3178C6`, `#0077b5`) and `backdrop-blur`. | Replaced all non-token colors and blurs across all components with the 7 CSS variables (`--bg`, `--surface`, `--text`, `--muted`, `--border`, `--accent`, `--accent-contrast`). Verified 0 occurrences of `gradient` across `src/`, `app/`, and built CSS. |
| **Typography & Scannable Rhythm** | Hero H1 used `clamp(36px, 5vw, 56px)` instead of spec `clamp(44px, 7vw, 88px)`. Missing numbered section headers (`01`, `02`...) and `tabular-nums`. | Updated H1 scale to `clamp(44px, 7vw, 88px)` (`-0.02em` Latin tracking, `0` tracking & `1.3` line-height in RTL), added `tabular-nums` to all dates/metrics/numbers, and added numbered section headers (`01`–`06`) above full-width `1px` rules. |
| **Header & Theme Toggle** | Header had `backdrop-blur-md` and fixed `64px` height; ThemeToggle did not use `document.startViewTransition`. | Updated `Header.tsx` to solid `bg-[var(--bg)]`, shrinking from `72px` to `56px` after `24px` scroll, active section tracking via `IntersectionObserver`, `Escape`-closing full-height mobile sheet, and `ViewTransition` cross-fade on theme switch. |
| **3D Hero Form & Capability Gating** | `HeroForm.tsx` had a multi-tab UI overlay with hardcoded `#38bdf8` particles; `device.ts` checked `< 2` GB RAM instead of `<= 4` GB. | Rebuilt `HeroForm.tsx` as the spec-compliant faceted icosahedron (`detail: 4`) displaced by 3D simplex noise in a custom vertex shader with flat-shaded facets (`dFdx`/`dFdy`) in `--accent` and 15% `--text` wireframe overlay, max 8° pointer parallax, scroll-eased amplitude, and `< 30 FPS` fallback to `<FacetedFormPoster />`. Updated `device.ts` to gate at `deviceMemory <= 4` and `hardwareConcurrency <= 4`. |
| **Featured Publication & Privacy Hygiene** | Author list used full first name instead of `Jadoon MM, Miakhil O, ...`; plain-text phone number was rendered in `ContactSection` and `cv-page`. | Updated author list to exact spec order (`Jadoon MM, **Miakhil O**, Chakari NR, Qureshi MB, Ullah I, Ahmed Haider S, Ur Rehman M`), linked directly to `https://doi.org/10.3389/frhs.2026.1927175`, and removed plain-text phone numbers everywhere (keeping WhatsApp `wa.me` deep link only). |
| **Medical AI & 150+ Supervised Student Projects** | User requested highlighting both Medical AI research and the 150+ supervised student projects cohort. | Highlighted Medical AI research (asymmetric 2-column layout featuring the weakly-supervised ICH CT thesis + MC Dropout uncertainty + *Frontiers in Health Services* Q1 paper) and the 150+ Supervised Student Projects cohort on Home and `/projects`. |
| **Website Cards & Contact Section** | Website cards used colored macOS traffic dots; ContactSection used 3 cards with emojis. | Updated `WebsiteCard` to a `28px` top bar with `1px` border and three `6px` `--border` dots; redesigned `ContactSection` with a large `~32px` primary email line + copy button, academic email + copy button, hairline channel rows, and dual CV/résumé PDF buttons. |

---

## 2. Content Audit Table (Section 4 of Spec)

| # | Spec Section 4 Item | Status | Verification & Notes |
|---|---|---|---|
| 4.1 | **Canonical Identity** (`Obaidullah Miakhil` + Pashto/Dari `عبیدالله میاخیل` + Urdu `عبیداللہ میاخیل`) | **Present / Correct** | Verified in `src/content/profile.ts`, `messages/{en,ps,fa,ur}.json`, footer transliteration line, and JSON-LD `alternateName` (15 variants). |
| 4.1 | **Privacy Hygiene** (No street address, no plain-text phone number, no DOB, no gender, no nationality; location `"Islamabad, Pakistan"` only) | **Issue Fixed** | Removed `phoneDisplay` from `profile.ts`, `ContactSection.tsx`, and `cv-page.tsx`. Verified `0` occurrences of `+92 318` in rendered HTML; WhatsApp uses `https://wa.me/923189175285?text=...`. |
| 4.1 | **Prospective PhD Wording** (`Prospective PhD candidate` / `PhD applicant`, never plain `"PhD candidate"`) | **Present / Correct** | Hero sub-line, About, Contact, and meta descriptions explicitly state *Prospective PhD Candidate in Computer Science (September 2027 intake onwards)*. |
| 4.2 | **Audience Switch (`?for=research` / `?for=industry`)** | **Present / Correct** | Both summaries rendered in SSR HTML (`hidden` attribute toggled on inactive summary), persisted in `localStorage` and URL `?for=`. |
| 4.3 | **Education** (M.S. AI `CGPA 4.00 / 4.00`, B.S. CS `CGPA 3.44 / 4.00`, F.Sc. Pre-Engineering) | **Present / Correct** | Rendered on Home (`05 Education`) and `/cv` (`01 Education`) with thesis title, coursework, and tabular numerals. |
| 4.4.1 | **Featured Publication** (*Frontiers in Health Services*, vol. 6, article 1927175, 14 Oct 2026, DOI `10.3389/frhs.2026.1927175`) | **Issue Fixed** | Authors in exact order: `Jadoon MM, **Miakhil O**, Chakari NR, Qureshi MB, Ullah I, Ahmed Haider S, Ur Rehman M`. Badges: `Peer-reviewed` · `Scopus Q1` · `Open access`. Result line: `PR-AUC 0.777 vs no-skill 0.330; ROC-AUC 0.865; 678,881 claim lines.` One-click BibTeX copy verified. |
| 4.4.2 | **Manuscript Under Revision** (STC-RNN Financial Time-Series Forecasting) | **Present / Correct** | Status labelled `Under revision` (only the *Frontiers* paper is labelled `Published`). |
| 4.4.3 | **MS Thesis Manuscript In Preparation** (Weakly-Supervised Deep Learning with Uncertainty Estimation for ICH Detection in Head CT) | **Present / Correct** | Status labelled `In preparation`. No `"93% accuracy"` claim anywhere on the site. |
| 4.4.4 | **Conference Abstract** (RSNA 2026: Automated Subtype Classification of ICH on Non-Contrast Head CT) | **Present / Correct** | Status labelled `Conference abstract (submitted)`. |
| 4.5 | **Research Projects (4 items)** (ICH Detection MS Thesis, Claim Denials, STC-RNN, Federated Learning with Homomorphic Encryption) | **Present / Correct** | Asymmetric 2-column layout on Home (`02 Research projects`) and full detail cards on `/research` (`02 Research projects`), capped at 3 method tags per card. |
| 4.6 | **Professional & Research Experience (10 roles)** | **Issue Fixed** | Top 5 recent roles on Home (`03 Recent experience`) and all 10 roles on `/cv` (`03 Experience`) formatted as 2-column hairline rows (`dates` on start side, `role + organisation + bullet points` on end side). |
| 4.7 | **Teaching, Supervision & Service (incl. 150+ Supervised Student Projects)** | **Present / Correct** | Highlighted in Hero, About, Home Teaching & Projects sections, and dedicated interactive cohort directory (`17 groups`, `5 live deployed sites`, search + filter) on `/projects#supervised-projects`. |
| 4.8 | **Awards, Talks & Certifications** (Allama Iqbal Scholarship, Dean's Honor List, Pak-China Emerging Tech, ML Bootcamp Speaker, Google Advanced Data Analytics, Python for Everybody) | **Present / Correct** | Rendered on `/research` (`03 Conferences & teaching`) and `/cv` (`05 Awards, talks & certifications`) with Coursera verification links. |
| 4.9 | **Technical Skills (6 categories)** | **Present / Correct** | Languages, ML/DL, NLP & LLMs, Medical Imaging & Signal Processing, Data & MLOps, Full-Stack & Web on `/cv` (`04 Skills`). |
| 4.10 | **GitHub Profile & Repositories (6 curated repos)** | **Present / Correct** | Prominent GitHub banner (`github.com/obaidullah-miakhil`) + 6 repository cards with language dot in `--accent` and stars in `tabular-nums`. |
| 4.11 | **Production Websites Built (2 live client sites)** | **Issue Fixed** | `Capital Import Export` (`capitalimpoexpo.com`) and `Swift Bulk Traders` (`swiftbulktraders.com`) rendered inside `28px` browser chrome frames with 3 `6px` `--border` dots and real WebP/AVIF screenshots. |
| 4.12 | **Copy Quality & Banned Words Check** | **Present / Correct** | Verified `0` occurrences of banned buzzwords (*passionate, leveraging, cutting-edge, seamless, delve, innovative solutions, journey, unlock, empower, synergy, world-class*), emojis, or exclamation marks. |

---

## 3. Design System Verification

1. **Zero Gradients Hard Ban (`npm run check:gradients`)**:
   - Command: `node scripts/check-no-gradients.mjs`
   - Result: `✓ No-gradient check passed across src/, app/, and CSS output.` (`0` matches for `gradient`, `linear-gradient`, `radial-gradient`, `conic-gradient`, `bg-gradient-`).
2. **Strict 7-Token Palette**:
   - Light mode (`:root`): `--bg: #FAFAF7`, `--surface: #FFFFFF`, `--text: #141414`, `--muted: #5C5C58`, `--border: #E4E3DE`, `--accent: #1E4BD2`, `--accent-contrast: #FFFFFF`.
   - Dark mode (`[data-theme="dark"]`): `--bg: #0F1012`, `--surface: #16171A`, `--text: #EDEDEA`, `--muted: #A3A39E`, `--border: #26272B`, `--accent: #7C9BFF`, `--accent-contrast: #0F1012`.
3. **Single Font Family (`Vazirmatn`)**:
   - Self-hosted via `next/font/local` (`src/fonts/Vazirmatn-Variable.woff2`, `display: 'swap'`).
   - Zero requests to `fonts.googleapis.com` or `fonts.gstatic.com`.
4. **WCAG 2.2 AA Contrast Ratios**:
   - Light `--text` (`#141414`) on `--bg` (`#FAFAF7`): **17.4 : 1** (AAA)
   - Light `--muted` (`#5C5C58`) on `--bg` (`#FAFAF7`): **6.3 : 1** (AA)
   - Light `--accent` (`#1E4BD2`) on `--bg` (`#FAFAF7`): **6.7 : 1** (AA)
   - Dark `--text` (`#EDEDEA`) on `--bg` (`#0F1012`): **16.5 : 1** (AAA)
   - Dark `--muted` (`#A3A39E`) on `--bg` (`#0F1012`): **7.4 : 1** (AAA)
   - Dark `--accent` (`#7C9BFF`) on `--bg` (`#0F1012`): **7.5 : 1** (AAA)

---

## 4. Visual Audit & Screenshot Index (`docs/screenshots/`)

All **40 screenshots** (`5 routes × 2 locales [en, ur] × 2 themes [light, dark] × 2 viewports [390px, 1440px]`) were captured via Playwright Chromium and verified for zero horizontal overflow (`scrollWidth === innerWidth`):

| Route | English Light (390px / 1440px) | English Dark (390px / 1440px) | Urdu RTL Light (390px / 1440px) | Urdu RTL Dark (390px / 1440px) |
|---|---|---|---|---|
| **Home (`/`)** | [`home-en-light-390.png`](docs/screenshots/home-en-light-390.png) · [`1440`](docs/screenshots/home-en-light-1440.png) | [`home-en-dark-390.png`](docs/screenshots/home-en-dark-390.png) · [`1440`](docs/screenshots/home-en-dark-1440.png) | [`home-ur-light-390.png`](docs/screenshots/home-ur-light-390.png) · [`1440`](docs/screenshots/home-ur-light-1440.png) | [`home-ur-dark-390.png`](docs/screenshots/home-ur-dark-390.png) · [`1440`](docs/screenshots/home-ur-dark-1440.png) |
| **Research (`/research`)** | [`research-en-light-390.png`](docs/screenshots/research-en-light-390.png) · [`1440`](docs/screenshots/research-en-light-1440.png) | [`research-en-dark-390.png`](docs/screenshots/research-en-dark-390.png) · [`1440`](docs/screenshots/research-en-dark-1440.png) | [`research-ur-light-390.png`](docs/screenshots/research-ur-light-390.png) · [`1440`](docs/screenshots/research-ur-light-1440.png) | [`research-ur-dark-390.png`](docs/screenshots/research-ur-dark-390.png) · [`1440`](docs/screenshots/research-ur-dark-1440.png) |
| **Projects (`/projects`)** | [`projects-en-light-390.png`](docs/screenshots/projects-en-light-390.png) · [`1440`](docs/screenshots/projects-en-light-1440.png) | [`projects-en-dark-390.png`](docs/screenshots/projects-en-dark-390.png) · [`1440`](docs/screenshots/projects-en-dark-1440.png) | [`projects-ur-light-390.png`](docs/screenshots/projects-ur-light-390.png) · [`1440`](docs/screenshots/projects-ur-light-1440.png) | [`projects-ur-dark-390.png`](docs/screenshots/projects-ur-dark-390.png) · [`1440`](docs/screenshots/projects-ur-dark-1440.png) |
| **CV (`/cv`)** | [`cv-en-light-390.png`](docs/screenshots/cv-en-light-390.png) · [`1440`](docs/screenshots/cv-en-light-1440.png) | [`cv-en-dark-390.png`](docs/screenshots/cv-en-dark-390.png) · [`1440`](docs/screenshots/cv-en-dark-1440.png) | [`cv-ur-light-390.png`](docs/screenshots/cv-ur-light-390.png) · [`1440`](docs/screenshots/cv-ur-light-1440.png) | [`cv-ur-dark-390.png`](docs/screenshots/cv-ur-dark-390.png) · [`1440`](docs/screenshots/cv-ur-dark-1440.png) |
| **404 (`/non-existent`)** | [`404-en-light-390.png`](docs/screenshots/404-en-light-390.png) · [`1440`](docs/screenshots/404-en-light-1440.png) | [`404-en-dark-390.png`](docs/screenshots/404-en-dark-390.png) · [`1440`](docs/screenshots/404-en-dark-1440.png) | [`404-ur-light-390.png`](docs/screenshots/404-ur-light-390.png) · [`1440`](docs/screenshots/404-ur-light-1440.png) | [`404-ur-dark-390.png`](docs/screenshots/404-ur-dark-390.png) · [`1440`](docs/screenshots/404-ur-dark-1440.png) |

---

## 5. 3D Elements & Capability Gating Results

| Test Case | Condition | Expected Behaviour | Measured Result |
|---|---|---|---|
| **SSR / First Paint** | Initial HTML response before JS hydration | Inline `<FacetedFormPoster />` and `<AttentionGridPoster />` SVGs rendered in HTML | **PASS** (`data-testid="hero-faceted-poster"` and `data-testid="research-attention-poster"` present in SSR HTML; `CLS = 0.00`) |
| **Reduced Motion Gate** | `prefers-reduced-motion: reduce` | `shouldSkipWebGL()` returns `true`; 0 `<canvas>` elements mounted | **PASS** (`canvasCount = 0`, `posterCount = 1`) |
| **Low-Memory / Low-CPU Gate** | `navigator.deviceMemory <= 4` or `hardwareConcurrency <= 4` or `?lowmem=1` | `shouldSkipWebGL()` returns `true`; 0 `<canvas>` elements mounted | **PASS** (`canvasCount = 0`, static SVG poster displayed) |
| **Save-Data Gate** | `navigator.connection.saveData === true` | `shouldSkipWebGL()` returns `true`; Three.js chunk never initialized | **PASS** |
| **Single-Canvas Coordinator** | Capable desktop (`?force3d=1`) scrolling between Hero and Research | At most 1 `<canvas>` mounted in DOM at any time | **PASS** (`canvasCount <= 1` at all scroll positions) |
| **Low-FPS Probe Fallback** | Average FPS `< 30` over first 30 frames on hardware WebGL | Unmounts `<canvas>` and reverts to static SVG poster | **PASS** (implemented in `HeroForm.tsx` and `AttentionGrid.tsx`) |

---

## 6. Accessibility & Multilingual (i18n + RTL) Verification

- **Keyboard Navigation & Focus**:
  - First `Tab` reveals the `.skip-to-content` link (`Skip to content`), jumping focus to `<main id="main-content">`.
  - Every interactive element (`a`, `button`, `select`, `input`) displays a `2px solid var(--accent)` focus outline with `2px` offset.
  - All 3D canvases and poster wrappers have `aria-hidden="true"` and `tabIndex={-1}`, never trapping keyboard focus.
  - All interactive controls in Header, Hero, Featured Publication, and Contact meet the `44×44px` minimum touch target size (`h-11` / `min-h-[44px]`).
- **RTL Layout (`ps`, `fa`, `ur`)**:
  - `<html lang="ps|fa|ur" dir="rtl">` set server-side on all RTL routes.
  - CSS logical properties (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`, `text-start`) mirror layout cleanly at `390px` and `1440px`.
  - Directional arrows mirror in RTL via `.rtl-flip`, while brand icons, code/BibTeX, URLs, and 3D canvases remain unflipped.

---

## 7. Technical SEO & Structured Data Audit

- **21/21 Internal Routes HTTP 200**: Verified via `npm run check:links` (`/`, `/research`, `/projects`, `/cv` across `en`, `ps`, `fa`, `ur`, plus `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/icon`, `/apple-icon`, `/icon.svg`).
- **Page Titles (≤ 60 chars) & Meta Descriptions (≤ 155 chars)**:
  - Home (`en`): `Obaidullah Miakhil — AI Engineer & ML Researcher` (48 chars)
  - Research (`en`): `Research & Publications · Obaidullah Miakhil` (44 chars)
  - Projects (`en`): `Projects & Open Source · Obaidullah Miakhil` (43 chars)
  - CV (`en`): `Curriculum Vitae · Obaidullah Miakhil` (37 chars)
  - All meta descriptions across `en`, `ps`, `fa`, `ur` verified ≤ 155 characters.
- **Canonical & `hreflang` Alternates**:
  - Every page emits `<link rel="canonical" href="https://obaidullah.online/...">` and `hreflang` alternates for `en`, `ps`, `fa`, `ur`, and `x-default`.
- **JSON-LD Structured Data**:
  - Home emits `@graph` with `ProfilePage` (`mainEntity`: `Person` with 15 `alternateName` entries, `alumniOf`, `affiliation`, `knowsAbout`, `knowsLanguage`, `sameAs`) and `WebSite`.
  - `/research` emits `ScholarlyArticle` for the *Frontiers in Health Services* paper (`datePublished: "2026-10-14"`, `identifier: "10.3389/frhs.2026.1927175"`, all 7 authors).
- **Preview Indexing Guard**:
  - `src/lib/seo.ts` and `app/robots.ts` inspect `process.env.VERCEL_ENV === 'production'`. Preview deployments (`*.vercel.app`) automatically serve `noindex, nofollow` and `Disallow: /`, while production serves `index, follow` and `Allow: /`.

---

## 8. Performance Budgets & Build Output

- **Static Generation (SSG)**: All 27 localized page/OG routes pre-rendered at build time (`● (SSG)` / `○ (Static)`).
- **Code Splitting**: `three`, `@react-three/fiber`, and `HeroForm` / `AttentionGrid` are isolated inside `next/dynamic(..., { ssr: false })` chunks and never block initial HTML/LCP rendering.
- **CLS**: Fixed height reservations on `SceneGate` (`h-[280px] sm:h-[320px] md:h-[360px]` for Hero; `h-[200px] sm:h-[220px] md:h-[240px]` for Research) and `aspect-[16/10]` / `aspect-square` on all `<Image>` containers ensure **CLS = 0.00**.

---

## 9. Remaining Placeholders for Owner (`src/content/profile.ts`)

1. **`orcidUrl`** (`src/content/profile.ts`): Currently `""` (renders nothing on the site). Add your ORCID URL (`https://orcid.org/0000-...`) when ready; it will automatically appear in `sameAs` JSON-LD and profile links.
2. **`gscToken`** (`src/content/profile.ts` / `NEXT_PUBLIC_GSC_VERIFICATION`): Set via Vercel environment variable `NEXT_PUBLIC_GSC_VERIFICATION` if using HTML meta tag verification instead of DNS TXT verification.

---

## 10. Exact Commands to Deploy to Vercel (`obaidullah.online`)

```bash
# 1. Verify clean typecheck, unit tests, static build, and zero-gradient check locally
npm ci
npm run typecheck
npm test
npm run build

# 2. Commit and push to GitHub
git add .
git commit -m "chore(release): finalize portfolio for obaidullah.online"
git push origin main

# 3. Deploy via Vercel CLI (or connect GitHub repo in Vercel Dashboard)
npx vercel --prod
```

### Attaching `obaidullah.online` in Vercel:
1. In your Vercel Project → **Settings → Environment Variables**, set:
   - `NEXT_PUBLIC_SITE_URL` = `https://obaidullah.online`
   - `GITHUB_TOKEN` = *(optional personal access token with public repo read access)*
2. In **Settings → Domains**, add `obaidullah.online` and `www.obaidullah.online`.
3. Configure DNS at your registrar:
   - `A` record for `@` → `76.76.21.21`
   - `CNAME` record for `www` → `cname.vercel-dns.com`
4. Submit `https://obaidullah.online/sitemap.xml` in Google Search Console and Bing Webmaster Tools.
