# Obaidullah Miakhil — Personal Academic & Engineering Portfolio

Production-ready personal portfolio website for **Obaidullah Miakhil**, an AI engineer and machine learning researcher applying for **PhD positions (NLP / LLMs)** and **AI/ML engineering roles**.

---

## 1. Tech Stack & Architectural Decisions

| Layer | Choice | Rationale |
|---|---|---|
| **Framework** | **Next.js 16.x (App Router), React 19, TypeScript** | Static Site Generation (SSG via `generateStaticParams`), built-in Metadata API, image optimization, native Vercel deployment. |
| **Styling** | **Tailwind CSS v4** | CSS variables for design tokens, flat solid colors, zero gradients. |
| **3D Engine** | **Three.js via `@react-three/fiber` & `@react-three/drei`** | Procedural geometry (faceted noise-deformed icosahedron on Hero, isometric attention grid on Research). Inline SVG posters rendered first in SSR HTML; WebGL gated by capability checks (`deviceMemory`, `hardwareConcurrency`, `saveData`, `prefers-reduced-motion`). |
| **Internationalization** | **next-intl** | 4 locales: `en` (default at `/`), `ps` (Pashto at `/ps`), `fa` (Dari/Persian at `/fa`), `ur` (Urdu at `/ur`). RTL support, per-locale metadata, hreflang alternates. |
| **Typography** | **Vazirmatn** (SIL OFL) | Single self-hosted font for Latin, Pashto, Dari, and Urdu glyphs (`src/fonts/Vazirmatn-Variable.woff2` and TTF weights for OG images). |
| **Theme** | **next-themes** | `system` default, 3-state toggle (System / Light / Dark), zero flash of unstyled theme. |
| **Analytics** | **@vercel/analytics & @vercel/speed-insights** | Lightweight Vercel-native telemetry. |

---

## 2. Hard Design Constraints Verified

- **Zero Gradients**: Strictly enforced. Built with `scripts/check-no-gradients.mjs` verifying that the token `gradient` does not exist in `src/`, `app/`, or CSS outputs.
- **Single Lapis Blue Accent**:
  - Light mode: Background `#FAFAF7`, Surface `#FFFFFF`, Text `#141414`, Muted `#5C5C58`, Border `#E4E3DE`, Accent `#1E4BD2`.
  - Dark mode: Background `#0F1012`, Surface `#16171A`, Text `#EDEDEA`, Muted `#A3A39E`, Border `#26272B`, Accent `#7C9BFF`.
- **Motion & Accessibility**: All CSS transitions respect `prefers-reduced-motion: reduce`. Directional arrows mirror in RTL (`.rtl-flip` / `.rtl-mirror`), while brand icons and 3D scenes maintain orientation.

---

## 3. Local Development & Scripts

```bash
# 1. Install dependencies
npm install

# 2. Start local development server (port 3000)
npm run dev

# 3. Synchronize routes and build static production bundle
npm run build

# 4. Run production server
npm run start

# 5. Type-check with TypeScript
npm run lint

# 6. Run unit tests
npm test

# 7. Verify zero gradients across the codebase
npm run check:gradients

# 8. Re-capture website screenshots using Playwright + sharp
npm run screenshots

# 9. Audit all 21 internal routes for zero broken links
npm run check:links

# 10. Webpack bundle analysis
npm run analyze
```

---

## 4. Content Management & Where to Edit

All data lives in a **single source of truth**:
- **Profile, Publications, Experience, Education, Projects**:
  [`src/content/profile.ts`](file:///Users/obaidullahmiakhil/Desktop/MSAI/portfolio/porfolio/src/content/profile.ts)
- **Translations & UI Strings**:
  - English: [`messages/en.json`](file:///Users/obaidullahmiakhil/Desktop/MSAI/portfolio/porfolio/messages/en.json)
  - Pashto: [`messages/ps.json`](file:///Users/obaidullahmiakhil/Desktop/MSAI/portfolio/porfolio/messages/ps.json)
  - Dari / Persian: [`messages/fa.json`](file:///Users/obaidullahmiakhil/Desktop/MSAI/portfolio/porfolio/messages/fa.json)
  - Urdu: [`messages/ur.json`](file:///Users/obaidullahmiakhil/Desktop/MSAI/portfolio/porfolio/messages/ur.json)

### Replacing Files:
- **Profile Photo**: Place file at `public/images/obaidullah-miakhil.jpg`.
- **Academic CV**: Place PDF at `public/cv/Obaidullah-Miakhil-Academic-CV.pdf`.
- **Industry Résumé**: Place PDF at `public/cv/Obaidullah-Miakhil-Resume.pdf`.
- **Project Screenshots**: Run `npm run screenshots` to automatically capture desktop (1440×900) and mobile (390×844) WebP and AVIF files into `public/projects/`.

---

## 5. Deployment Instructions (Vercel + Custom Domain)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: complete portfolio with Phases 1-6"
   git remote add origin https://github.com/obaidullah-miakhil/portfolio.git
   git push -u origin main
   ```
2. **Import into Vercel**:
   - Preset: **Next.js**.
   - (Optional) Environment variable: `GITHUB_TOKEN` for unauthenticated GitHub API rate limit immunity.
3. **Configure Custom Domain**:
   - In Vercel Project Settings → Domains: add `yourdomain.com` and `www.yourdomain.com`.
   - Set apex domain as primary, with 301 redirect from `www`.
   - At your domain registrar (e.g., Cloudflare, Namecheap, GoDaddy), create DNS records:
     - `A` record for `@` pointing to Vercel IP (e.g. `76.76.21.21`).
     - `CNAME` record for `www` pointing to `cname.vercel-dns.com`.
4. **Search Engine Verification**:
   - Add Google Search Console TXT record at your DNS provider, or update `gscToken` in `src/content/profile.ts`.
   - Submit `https://[YOUR_DOMAIN]/sitemap.xml` to Google Search Console and Bing Webmaster Tools.

---

## 6. Placeholders to Fill Before Launch (Section 17)

The following items are marked with `TODO` or placeholders in `src/content/profile.ts`:

1. `domain`: Replace empty string with your live domain (e.g. `https://obaidullahmiakhil.com`).
2. `scholarUrl`: Configured (`https://scholar.google.com/citations?user=JVFkpVgAAAAJ&hl=en&oi=ao`).
3. `researchgateUrl`: Configured (`https://www.researchgate.net/profile/Obaidullah-Miakhil`).
4. `orcidUrl`: Add your ORCID identifier URL (optional, recommended for PhD applications).
5. `gscToken`: Add Google Search Console HTML verification token if not using DNS TXT verification.
5. `[confirm spelling]` in `nativeScript`: Confirm Pashto/Dari `عبیدالله میاخیل` and Urdu `عبیداللہ میاخیل`.
6. `[confirm status]` in `publications`:
   - STC-RNN: Confirm target IEEE venue / status.
   - Intracranial Hemorrhage thesis: Confirm submission status.
   - RSNA 2026 abstract: Confirm acceptance/presentation status.
7. `[confirm month]` in `experience`:
   - Cube Healthcare internship dates: `Jun 2024 – Aug 2024`.

---

## 7. Post-Launch SEO Checklist for Owner (Section 16)

To rank #1 for **Obaidullah Miakhil** and topic queries (*AI engineer*, *machine learning researcher*, *PhD applicant*):

- [ ] **Google Search Console**: Verify domain ownership and submit `https://[YOUR_DOMAIN]/sitemap.xml`.
- [ ] **Bing Webmaster Tools**: Import or verify and submit sitemap.
- [ ] **LinkedIn**: Add site URL to Profile → Contact info → Website.
- [ ] **GitHub**: Add site URL to GitHub profile bio and personal README repository (`obaidullah-miakhil/obaidullah-miakhil`).
- [ ] **Google Scholar**: Add the site URL as your official homepage.
- [ ] **Hugging Face**: Set your homepage URL on `https://huggingface.co/Obaidullahmiakhil`.
- [ ] **ORCID**: Link website under Websites & Social Links.
- [ ] **PAF-IAST & SPCAI**: Request that your profile on the university/center website links to your personal portfolio.
- [ ] **Email Signatures**: Include your portfolio link in both your primary and academic email signatures.
