# Build Prompt — Portfolio Website for Obaidullah Miakhil

You are a senior front-end engineer and product designer. Build, test and prepare for deployment a production-ready personal portfolio website for **Obaidullah Miakhil**, an AI engineer and machine learning researcher who is applying for **PhD positions (NLP / LLMs)** and **AI/ML engineering roles** at the same time. One site must serve both audiences.

Read this whole document before writing code. Work in the phases listed in Section 15 and verify each phase before moving on.

**Golden rule: use only the content in this document.** Do not invent metrics, dates, employers, testimonials, logos, client names, quotes, or "years of experience". Where something is marked `[PLACEHOLDER]`, leave a clearly marked TODO in the data file and render nothing for it until it is filled in.

---

## 1. Tech stack (decided — do not substitute)

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 16.x (latest stable), App Router, TypeScript, React 19** | Static generation gives Google fully rendered HTML (a plain React/Vite SPA does not), built-in Metadata API, image optimisation, and native deployment on Vercel. Next.js runs on Node.js, so no separate Node/Express server is needed. |
| Rendering | **Static Site Generation** for every page and locale (`generateStaticParams`). Only the GitHub repo data uses ISR (`revalidate = 86400`). | Fast first load, no cold starts, works on cheap devices. |
| 3D | **three.js via @react-three/fiber**, plus only the specific `@react-three/drei` helpers you actually use. All geometry is procedural (generated in code). No GLTF/OBJ model files, no HDR environment maps, no textures. | Small, fast, and nothing downloaded except code. |
| Styling | **Tailwind CSS v4** with design tokens defined as CSS variables. | Consistent tokens, tiny CSS output. |
| i18n | **next-intl** with locale routing. | RTL support, per-locale metadata, hreflang. |
| Theme | **next-themes** (`attribute="data-theme"`, `defaultTheme="system"`, `enableSystem`, `disableTransitionOnChange`). | System-automatic by default, no flash. |
| Icons | `lucide-react` (UI icons, tree-shaken) + inline SVG brand icons for GitHub, LinkedIn, Google Scholar, Hugging Face, ORCID, WhatsApp. Monochrome only. | |
| Analytics | `@vercel/analytics` and `@vercel/speed-insights`. | Lightweight, Vercel-native. |
| Hosting | **Vercel**, custom domain `https://obaidullah.online`. | |

Do **not** add: framer-motion/motion, GSAP, Lenis or any smooth-scroll/scroll-jacking library, jQuery, UI kits (MUI, Chakra, shadcn themes with gradients), particle libraries, Lottie, or any CMS. Animations are CSS transitions plus one small IntersectionObserver hook.

---

## 2. Design rules (non-negotiable)

The site must look hand-designed by a careful person, not AI-generated.

### 2.1 Hard bans
- **No gradients anywhere**: no `linear-gradient`, `radial-gradient`, `conic-gradient`, no Tailwind `bg-gradient-*`/`from-*`/`via-*`/`to-*`, no gradient text, no gradient borders, no gradient in SVGs or shaders. Add a CI check: the build fails if the string `gradient` appears in `src/`, `app/` or any CSS output (the only exception is this rule's own check script).
- No glassmorphism, `backdrop-blur`, neon glows, blurred colour blobs, noise overlays, or large drop shadows.
- No emojis, no sparkle icons, no "Hi I'm", no typewriter text effect, no custom cursor/cursor followers, no loading splash screen, no full-screen particle background, no skill progress bars or percentages.
- No stock illustrations or AI-generated images.

### 2.2 One font
Use **Vazirmatn** (variable font, SIL OFL) for everything: Latin, Pashto, Dari/Persian and Urdu. Its Latin glyphs come from Roboto, and it supports Pashto and Urdu characters. Self-host it via `next/font/local` (from the `vazirmatn` npm package or `@fontsource-variable/vazirmatn`), `display: swap`, preload the latin and arabic subsets. Use only weights 400, 500 and 700. No second font, no monospace font, no icon font.

Type scale (fluid with `clamp`, keep to these six steps only): 13, 15, 17 (body), 22, 32, 48–64 (H1). Line height 1.6 for body, 1.15 for headings. Sentence case for all headings.

Verify by rendering this test string in every locale that no glyph falls back to a system font: `ټ ډ ړ ږ ښ ګ ڼ ې ۍ ئ ے ں ٹ ڈ ڑ ۀ`.

### 2.3 One colour theme
One neutral palette plus **one accent colour: lapis blue** (a nod to Afghan lapis lazuli). Define as CSS variables and use nothing else.

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#FAFAF7` | `#0F1012` |
| `--surface` | `#FFFFFF` | `#16171A` |
| `--text` | `#141414` | `#EDEDEA` |
| `--muted` | `#5C5C58` | `#A3A39E` |
| `--border` | `#E4E3DE` | `#26272B` |
| `--accent` | `#1E4BD2` | `#7C9BFF` |
| `--accent-contrast` (text on accent) | `#FFFFFF` | `#0F1012` |

All text must meet WCAG AA contrast against its background. Flat solid backgrounds only. The 3D scenes read these same variables and update when the theme changes.

### 2.4 Layout and feel
- Minimal and calm: max content width 1080px, generous whitespace (section padding 96px desktop / 64px mobile), left-aligned text (right-aligned in RTL), 12-column grid on desktop, single column on mobile.
- 1px hairline borders in `--border`, one border radius everywhere (6px), no shadows except an optional 1px focus ring.
- Motion is subtle: fade + 8px translate on scroll-in, 200–300ms, `ease-out`, each element animates once. All motion disabled under `prefers-reduced-motion: reduce`.
- Buttons: primary = solid `--accent` with `--accent-contrast` text; secondary = 1px border, transparent fill. Same height and radius everywhere.
- Links: `--accent` colour, underline on hover/focus.

### 2.5 Copywriting rules
- First person, short concrete sentences, real numbers from this document.
- Banned words/phrases: passionate, leveraging, cutting-edge, seamless, delve, innovative solutions, journey, unlock, empower, synergy, world-class, "I am a highly motivated", "in today's fast-paced world".
- Section titles are plain nouns: Research, Publications, Experience, Teaching, Projects, Education, Contact.

---

## 3. Site structure

Routes (each exists for every locale):
- `/`: Home: hero, featured publication, about, research highlights, selected projects, experience summary, contact
- `/research`: Research interests, all research projects, publications and manuscripts, talks
- `/projects`: All software projects, GitHub repos, websites built (with screenshots), supervised student projects
- `/cv`: Full CV as a clean HTML page (education, experience, teaching, awards, certifications, skills, languages) + PDF download buttons. Has a print stylesheet.
- `/not-found`: Simple 404 with a link home
