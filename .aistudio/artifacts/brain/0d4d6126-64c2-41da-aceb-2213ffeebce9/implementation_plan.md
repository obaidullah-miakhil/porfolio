# Audit, Modern Polish & Vercel Deployment Plan — Obaidullah Miakhil Portfolio

This plan outlines the end-to-end audit, content alignment, flat single-token visual polish, 3D performance gating, multilingual RTL refinement, technical SEO verification, and Vercel deployment preparation for Obaidullah Miakhil's academic and engineering portfolio (`https://obaidullah.online`).

## User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions synthesize your confirmed choices with the strict audit and polish requirements:

- **Confirmed Decision 1 — Highlight Medical AI & 150+ Supervised Student Projects**: The portfolio will prominently highlight your Medical AI research (weakly-supervised CT diagnosis, uncertainty quantification with MC Dropout, and the published *Frontiers in Health Services* Scopus Q1 claim-denial paper) alongside the **150+ supervised student engineering and deployed web projects** cohort, positioned for September 2027 PhD intake in Computer Science / Medical AI as well as AI/ML engineering roles.
- **Confirmed Decision 2 — Manuscript & Abstract Status Labels**: Only the *Frontiers in Health Services* paper is labelled `Published`. The unpublished works retain their exact verified outline status labels: `Under revision` (STC-RNN), `In preparation` (MS Thesis ICH Cascade), and `Conference abstract (submitted)` (RSNA 2026).
- **Confirmed Decision 3 — Custom Domain (`obaidullah.online`) & Privacy Hygiene**: The primary canonical domain is set to `https://obaidullah.online` (via `NEXT_PUBLIC_SITE_URL` with `www` redirecting to apex). Plain-text phone numbers are removed from visible page text while preserving the pre-filled `wa.me` WhatsApp deep link, and all authorship references use the exact author order (`Jadoon MM, Miakhil O, Chakari NR, Qureshi MB, Ullah I, Ahmed Haider S, Ur Rehman M`) without "first author" claims.

---

## 1. Overview & Core Concept

- **What It Does**: Delivers a static-first, multilingual (`en`, `ps`, `fa`, `ur`) academic and engineering portfolio that serves both PhD admissions committees and industry AI/ML hiring teams from a single unified experience.
- **Target Audience / Persona**:
  - **Academic / PhD Supervisors**: Evaluating peer-reviewed publications (`Scopus Q1`), medical imaging deep learning pipelines, thesis supervision, and full academic CV credentials.
  - **Industry Hiring Managers & Clients**: Evaluating end-to-end ML systems (678,881 claim lines, PR-AUC 0.777), open-source GitHub repositories, live client websites, and engineering mentorship across 150+ student projects.
- **Key Value**: Combines instant server-rendered SEO authority, zero-gradient flat architectural polish, hardware-gated procedural 3D visualizations, and native RTL typography in a single fast-loading Next.js application.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Hero & Audience Switch Flow**: Visitors land on an asymmetric 12-column split (7 columns content, 5 columns 3D faceted form/poster). Toggling `Viewing as: Research | Industry` updates the lead summary, primary CV/résumé download action, highlight order, URL query parameter (`?for=research` or `?for=industry`), and `localStorage` preference while keeping both summaries in the server HTML for search indexing.
  2. **Featured Publication & Citation Flow**: Directly below the hero, visitors inspect the *Frontiers in Health Services* paper with exact author order (`Miakhil O` bolded), `Peer-reviewed · Scopus Q1 · Open access` outline badges, tabular metrics (`PR-AUC 0.777`, `ROC-AUC 0.865`, `678,881` claim lines), a direct DOI link, and a one-click BibTeX copy button with confirmation feedback.
  3. **Research, Projects & 150+ Supervised Cohort Exploration**: Visitors browse asymmetric research highlights (with the MS thesis medical AI card spanning wider alongside stacked studies and the 3D attention grid), inspect client websites inside minimal 1px browser frames, filter/search the 150+ supervised student projects cohort by live deployment status or student name/ID, and view or print the full CV.
  4. **Direct Contact & WhatsApp Flow**: Visitors copy primary or academic email addresses with one click from a prominent 32px email display, or initiate a pre-filled WhatsApp chat via the floating inline-end button that automatically hides when the Contact section enters the viewport.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Editorial, high-precision academic monograph meets Swiss technical grid. Zero gradients, zero glassmorphism (`backdrop-filter` removed), zero drop shadows, zero pulsing status dots, and zero emojis.
  - *Color Palette & Mood*: Strictly governed by CSS variables with a single lapis blue focal accent:
    - **Light Mode**: Canvas `--bg: #FAFAF7`, Surface `--surface: #FFFFFF`, Primary Text `--text: #141414`, Muted Text `--muted: #5C5C58`, Hairline Border `--border: #E4E3DE`, Lapis Accent `--accent: #1E4BD2`, Accent Contrast `--accent-contrast: #FFFFFF`.
    - **Dark Mode**: Canvas `--bg: #0F1012`, Surface `--surface: #16171A`, Primary Text `--text: #EDEDEA`, Muted Text `--muted: #A3A39E`, Hairline Border `--border: #26272B`, Lapis Accent `--accent: #7C9BFF`, Accent Contrast `--accent-contrast: #0F1012`.
    - All stray hardcoded hex/Tailwind palette classes (such as emerald status dots, amber stars, rose/amber/emerald browser dots, or LinkedIn blue) are replaced with the strict CSS design tokens.
  - *Typography & Hierarchy*:
    - Single self-hosted variable font **Vazirmatn** across all elements (`400`, `500`, `700` weights) supporting Latin, Pashto, Dari/Persian, and Urdu without system font fallback.
    - Hero H1 uses `clamp(44px, 7vw, 88px)`, weight `700`, line-height `1.02`, and letter-spacing `-0.02em` in Latin (`en`), while RTL locales (`ps`, `fa`, `ur`) enforce `letter-spacing: 0` and `line-height: 1.3` to preserve Arabic-script cursive joining.
    - Dates, publication numbers, and metrics enforce `font-variant-numeric: tabular-nums`. Headings use `text-wrap: balance` and sentence case; body paragraphs use `text-wrap: pretty` and a `68ch` measure cap.
  - *Component Styling & Layout*:
    - Maximum content container width of `1080px` with generous section rhythm.
    - Section headers feature a muted tabular index (`01`, `02`, `03`...) above a sentence-case heading and a full-width `1px` rule in `--border`.
    - Uniform `6px` border radius and `1px` solid `--border` hairlines everywhere. No thick left accent bars (`border-s-4` removed) and no box shadows.
    - Website cards render inside a minimal `28px` top browser frame drawn with a `1px` border and three `6px` dots in `--border`.
    - Experience entries render as clean 2-column rows (dates in muted tabular text on the start side; role, organisation, and concise summary on the end side) separated by `1px` hairlines rather than nested cards.

- **Interactive Feedback & Motion**:
  - Sticky header in solid `--bg` smoothly compacts from `72px` to `56px` after `24px` of scroll and highlights the active route/section.
  - Links use a `1px` underline with `text-underline-offset: 3px` that thickens on hover; buttons nudge directional arrows `2px` toward `inline-end` (automatically mirrored in RTL) over `150ms`; cards transition their border color to `--accent` on hover/focus without vertical lift or shadow.
  - Theme switching uses `document.startViewTransition` (200ms cross-fade) when supported and falls back to instant switching under `prefers-reduced-motion`.
  - Scroll-in reveal animates once per element (`fade + 8px rise`, `250ms`, max `60ms` stagger) and disables completely under `prefers-reduced-motion: reduce`.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Strict Token-Only Palette vs. Multi-Color Badges**
  - *Chosen Approach*: Replace all emerald, amber, and rose utility classes in the Hero, Contact, Project cards, and Supervised Projects filter with `--accent`, `--border`, `--surface`, and `--text` tokens.
  - *Why*: Enforces the non-negotiable single-accent lapis blue design constitution, eliminates "AI-generated" colorful badge clutter, and guarantees WCAG AA contrast in both light and dark themes.
  - *Alternatives Considered*: Keeping green for "Live Deployed" or WhatsApp buttons, which violates the strict single-color theme requirement.

- **Decision 2: Varied Section Rhythm vs. Uniform Card Grids**
  - *Chosen Approach*: Use an asymmetric 2-column layout for Research Highlights (wider MS thesis Medical AI card + stacked secondary cards), borderless 2-column hairline rows for Experience, browser-framed 16:10 media cards for Websites, a searchable/filterable ledger for the 150+ Supervised Projects, and a prominent 32px typographic email anchor + plain channel list for Contact.
  - *Why*: Eliminates repetitive card-grid monotony and establishes a clear visual hierarchy tailored to each content type.
  - *Alternatives Considered*: Wrapping every section in identical 2-column or 3-column bordered cards.

- **Decision 3: Hardware-Gated Single-Canvas 3D Lifecycle**
  - *Chosen Approach*: Render static inline SVG posters in SSR HTML first, then lazily mount at most one Three.js WebGL canvas when within `200px` of the viewport and after idle, skipping WebGL entirely if `prefers-reduced-motion`, `Save-Data`, `deviceMemory <= 4`, `hardwareConcurrency <= 4`, missing WebGL, or `< 30 FPS` is detected.
  - *Why*: Preserves instant LCP and smooth scrolling on mobile and low-power devices while delivering flat-shaded procedural 3D (`dFdx`/`dFdy` faceted icosahedron and 14×14 Grad-CAM attention grid) on capable desktops.
  - *Alternatives Considered*: Mounting multiple canvases simultaneously or using smooth Phong/PBR shaders with gradients.

- **Decision 4: Production-Only Indexing Guard & `obaidullah.online` Canonicalization**
  - *Chosen Approach*: Configure `NEXT_PUBLIC_SITE_URL=https://obaidullah.online` as the canonical base across metadata, sitemap, OpenGraph images, and JSON-LD, while gating `robots.ts` and page-level `robots` metadata on `process.env.VERCEL_ENV === 'production'` and redirecting `www.obaidullah.online` to `obaidullah.online`.
  - *Why*: Prevents preview deployments from being indexed in Google while ensuring production builds expose complete canonicals, reciprocal `hreflang` tags (`en`, `ps`, `fa`, `ur`, `x-default`), and valid `ProfilePage` / `Person` / `ScholarlyArticle` structured data.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

### Architecture & Component Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                     Next.js 16 App Router (SSG + ISR)                        │
│         Locale Routing (en, ps, fa, ur) · ThemeProvider (data-theme)         │
└──────────────────────────────────────┬───────────────────────────────────────┘
                                       │
       ┌───────────────────────────────┼───────────────────────────────┐
       ▼                               ▼                               ▼
┌──────────────────────┐   ┌───────────────────────┐   ┌───────────────────────┐
│   Typed Data Layer   │   │   SEO & Metadata      │   │  Page Route Views     │
│  Single Source of    │   │   Builders            │   │  - Home (/)           │
│  Truth:              │   │  - Canonical &        │   │  - Research           │
│  - Profile & Bio     │   │    Hreflang Matrix    │   │  - Projects &         │
│  - Frontiers Q1 Pub  │   │  - ProfilePage +      │   │    150+ Supervised    │
│  - Medical AI Thesis │   │    Person JSON-LD     │   │  - Full HTML/Print CV │
│  - 150+ Supervised   │   │  - ScholarlyArticle   │   │  - Localized 404      │
│    Student Projects  │   │  - Static OG Images   │   └───────────┬───────────┘
│  - GitHub ISR Cache  │   │  - Production Robots  │               │
└──────────┬───────────┘   └───────────────────────┘               │
           │                                                       │
           └───────────────────────────┬───────────────────────────┘
                                       ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                     Interactive Client Leaf Components                       │
├────────────────────────┬─────────────────────────┬───────────────────────────┤
│  Header & Navigation   │  Hero & Content Blocks  │  SceneGate 3D Coordinator │
│  - 72px -> 56px Scroll │  - Audience Switcher    │  - SSR Inline SVG Poster  │
│  - Active Route/Sect   │    (?for= & Storage)    │  - Capability & FPS Probe │
│  - ViewTransition      │  - BibTeX & Email Copy  │  - Single-Canvas Mutex    │
│    Theme Toggle        │  - 150+ Cohort Search   │  - HeroForm (Faceted)     │
│  - Full-Height Mobile  │    & Live Filter Tabs   │  - AttentionGrid (14x14)  │
│    Sheet (Esc/Route)   │  - Viewport-Aware       │  - Off-Screen Pause &     │
│  - Locale Switcher     │    WhatsApp Button      │    GPU Resource Disposal  │
└────────────────────────┴─────────────────────────┴───────────────────────────┘
```

### Data Model & State

- **Profile & Academic Store**: Typed immutable data structure holding identity metadata, `obaidullah.online` domain configuration, 15 name variants for search disambiguation, audience-specific summaries (`research` vs `industry`), 4 publications/manuscripts (with exact author lists, DOI, and BibTeX), 4 research projects (headed by the MS thesis Medical AI cascade), 10 chronological experience entries, education, awards, talks, certifications, 5 plain-text skill groups, 4 GitHub repositories, 2 client websites, and the 17-group / 150+ supervised student projects cohort.
- **GitHub Repository ISR Cache**: Server-side fetcher querying the GitHub REST API with `revalidate = 86400` (24-hour ISR) and automatic fallback to static repository metadata so builds never fail offline or under rate limits.
- **Localized Message Catalogs**: Four structured translation dictionaries (`en`, `ps`, `fa`, `ur`) with machine-drafted review headers on non-English files, keeping proper nouns, paper titles, venues, and metrics in English across all locales.

### Interactive Component & State Mapping

- **Sticky Header & Mobile Sheet**: Tracks `window.scrollY > 24` to toggle header height between `72px` and `56px`; observes section intersections for active nav underlines; manages mobile full-height sheet state with automatic closure on route change or `Escape` key press and body scroll lock.
- **Theme Toggle**: Cycles `system` → `light` → `dark`, invoking `document.startViewTransition` when supported and not under `prefers-reduced-motion`, updating `data-theme` on `<html>` so CSS variables and active 3D scene materials update in place without remounting.
- **Hero Audience Switcher**: Synchronizes selected mode (`research` | `industry`) with URL search parameter `?for=` (`history.replaceState`) and `localStorage`, toggling visibility (`hidden` attribute) between the two server-rendered summary paragraphs and swapping the primary CTA (`Download academic CV` vs `Download résumé`).
- **BibTeX & Email Clipboard Handlers**: Write exact BibTeX citation text or email addresses to `navigator.clipboard` (with textarea fallback), setting a 2-second confirmation state (`Copied`) announced via accessible live status.
- **Supervised Projects Filter & Search**: Client-side memoized filter switching between `All Cohort Projects` and `Live Deployed Only` while matching search input against project title, description, course, group number, student name, or roll number, with a clear empty-state message when no records match.
- **3D SceneGate & FPS Guard**: Runs hardware/preference checks (`shouldSkipWebGL`), waits for `requestIdleCallback` (or 1500ms timeout) and `IntersectionObserver` (`200px` rootMargin), enforces a global single-canvas lock, probes initial frames for `< 30 FPS` fallback, pauses the render loop when off-screen or tab-hidden, and disposes geometries and materials on unmount.
- **Verification & Final Deliverable Suite**: Executes build, type-check, zero-gradient check, link verification, 40-screenshot capture (`390px` & `1440px`, light & dark, `en` & `ur` across `/`, `/research`, `/projects`, `/cv`, and `404`), axe accessibility checks, and compiles all metrics and audit tables into `FINAL_REPORT.md` and `README.md`.
