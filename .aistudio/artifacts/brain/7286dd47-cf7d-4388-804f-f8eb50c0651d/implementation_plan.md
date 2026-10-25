# 3D Character Avatar Hero Integration

Replace the current abstract Hero 3D scene with an interactive, full-body 3D character avatar that plays embedded `.glb` skeletal animations, responds to cursor movement with smooth parallax tilt, grounds the character on a studio floor contact shadow, and automatically syncs `.glb` assets from the `3d_avatar` folder with a procedural 3D character fallback until the model file is uploaded.

## User Review & Critical Decisions

> [!IMPORTANT]
> All four core design and technical preferences have been confirmed and incorporated into this plan:

- **Confirmed Decision 1 — Hero Placement**: Replace the existing Hero 3D scene directly with the 3D Character Avatar in the right-hand showcase column across both Research and Industry audience modes.
- **Confirmed Decision 2 — Animation & Cursor Response**: Automatically play the embedded `.glb` animation clips via `THREE.AnimationMixer` while blending smooth, damped mouse-tracking parallax tilt on the character and head.
- **Confirmed Decision 3 — Camera Framing & Grounding**: Frame the avatar in a full-body standing view (`[0, 0, 0]` floor-aligned bounding box) over a soft radial floor contact shadow with three-point studio lighting.
- **Confirmed Decision 4 — GLB Asset Sync & Fallback**: Automatically detect and sync any `.glb` file placed in the `3d_avatar` location (`src/three/3d_avatar/*.glb` or `src/three/3d_avatar.glb`) into static serving, and render an articulated 3D character fallback with matching idle animation and mouse tilt whenever the `.glb` binary is not yet present in the workspace.

---

## 1. Overview & Core Concept

- **What It Does**: Elevates the Hero section of Obaidullah Miakhil's portfolio by introducing a personal 3D character avatar in place of the abstract network graph. The avatar stands full-body in a studio-lit 3D viewport, plays its skeletal idle/greeting animation, and subtly turns toward the visitor's pointer.
- **Target Audience / Persona**: PhD admissions committees, principal investigators, and AI/ML engineering hiring managers visiting `obaidullah.online` across English, Pashto, Dari, and Urdu locales.
- **Key Value**: Combines personal warmth and memorability with technical WebGL craftsmanship while preserving strict performance budgets (`frameloop="demand"`, software-WebGL frame pacing, reduced-motion SSR poster fallback, and zero broken-asset errors).

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Immediate SSR & Reduced-Motion Poster**: On initial page load (or when `prefers-reduced-motion` / low-resource gating is active), visitors see a clean architectural SVG silhouette poster of the standing avatar framed inside the Hero showcase container.
  2. **Seamless 3D Avatar Cross-Fade**: Once the browser is idle and WebGL is ready, the 3D canvas smoothly cross-fades in over 300ms (`opacity-0` to `opacity-100`).
  3. **Full-Body Standing Presentation**: The camera frames the character from head to toe with automatic bounding-box normalization so any `.glb` character scale sits centered and flush with the floor plane above a soft contact shadow.
  4. **Embedded Animation + Pointer Parallax**: As the visitor moves their cursor across the Hero section, the character smoothly tilts and turns toward the pointer using exponential damping (`THREE.MathUtils.damp`) while its embedded `.glb` skeletal animation clip plays continuously.
  5. **Drop-In GLB Auto-Discovery**: When a `.glb` file is placed in the `3d_avatar` directory or file path, it is automatically served and loaded; if absent in the cloud preview, a multi-part 3D researcher character fallback renders with full-body proportions, idle breathing/gesture motion, and gaze tracking.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Editorial academic monograph meets interactive 3D studio showcase—clean, dignified, and cohesive with the existing portfolio design system.
  - *Color Palette & Mood*: Uses the portfolio's live CSS theme tokens (`--bg`, `--surface`, `--text`, `--muted`, `--border`, `--accent`: `#1E4BD2` in light mode, `#7C9BFF` in dark mode) for studio rim lights, floor contact shadow tinting, and subtle ambient accents.
  - *Typography & Hierarchy*: Preserves the Hero typographic hierarchy on the start column (`Vazirmatn` display H1, typewriter role line, audience switcher, and 4-column credential cards) paired with the taller full-body 3D viewport on the end column.
  - *Component Styling & Layout*: 12-column responsive Hero split (`md:col-span-7` content, `md:col-span-5` 3D avatar showcase) with a taller vertical aspect ratio (`h-[340px] sm:h-[400px] md:h-[460px]`) suited for full-body standing framing.

- **Interactive Feedback & Motion**:
  - Smooth damped rotation (`MAX_TILT_RAD` capped for natural posture) responding to pointer coordinates.
  - Scroll-linked subtle camera elevation shift as the user scrolls down toward the Featured Publication section.
  - Automatic pause when scrolled out of view or when the browser tab is hidden (`document.hidden`).

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1 — Automatic Bounding-Box Normalization for Full-Body Framing**:
  - *Chosen Approach*: Compute the loaded `.glb` scene's `THREE.Box3` bounding box on load, normalize its height to a consistent studio unit height (`2.2` world units), center it horizontally (`X/Z = 0`), and align its lowest vertex (`min.y`) to the floor plane (`y = -1.1`) directly on top of the contact shadow.
  - *Why*: Different `.glb` exports (Ready Player Me, Blender, Mixamo, Avaturn) use different coordinate origins and unit scales. Auto-centering and floor-snapping guarantees the full body and feet are always framed cleanly without manual camera tweaking.
  - *Alternatives Considered*: Hardcoding camera distance and Y-offset, which risks clipping the head or floating the feet depending on how the `.glb` was exported.

- **Decision 2 — Build/Runtime Asset Sync + Multi-Part 3D Fallback**:
  - *Chosen Approach*: Sync any `.glb` file found in `src/three/3d_avatar` into the public static assets directory and expose an asset discovery endpoint so client WebGL code knows whether a `.glb` binary is available before invoking `GLTFLoader`. When no `.glb` binary is present yet, render a composite multi-part procedural 3D character avatar (`THREE.Group` with articulated head, glasses, torso, arms, legs, and subtle floating AI nodes).
  - *Why*: Next.js serves binary 3D models over HTTP from static routes, and checking availability first prevents failed network requests or console errors while ensuring the Hero 3D showcase works out of the box.
  - *Alternatives Considered*: Letting `GLTFLoader` fail with a 404 error, which pollutes the browser console and violates zero-404 asset standards.

- **Decision 3 — Demand-Driven Rendering & Software WebGL Guard**:
  - *Chosen Approach*: Keep `frameloop="demand"` with an explicit frame scheduler that runs at native refresh rate on hardware GPUs and paces frames at `80ms` intervals on software WebGL renderers (`detectSoftwareWebGL()`).
  - *Why*: Ensures smooth skeletal animation on desktop/mobile GPUs while keeping headless browser checks and low-power devices responsive.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

### Architecture & Component Diagram

```
┌──────────────────────────────────────────────────────────────────────────┐
│                       Next.js Startup / Config Sync                      │
│  Scans 3d_avatar source path ──► Syncs .glb to static public model path  │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                          Hero Section (Hero.tsx)                         │
│  ┌─────────────────────────────────┐  ┌────────────────────────────────┐ │
│  │ Start Column (7 Cols)           │  │ End Column (5 Cols)            │ │
│  │ • Availability Eyebrow & H1     │  │ • SceneGate (scene="hero")     │ │
│  │ • Audience Switcher             │  │   ├─ AvatarPoster (SSR SVG)    │ │
│  │ • Credential TiltCards & CTAs   │  │   └─ Avatar3D (WebGL Canvas)   │ │
│  └─────────────────────────────────┘  └───────────────┬────────────────┘ │
└───────────────────────────────────────────────────────┼──────────────────┘
                                                        │
                                                        ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                     Avatar3D Scene Graph & Lifecycle                     │
│  ┌─────────────────────────┐          ┌────────────────────────────────┐ │
│  │ Studio Lighting Rig     │          │ Model Resolver                 │ │
│  │ • Warm Key Light        │          │ • Probes / loads synced .glb   │ │
│  │ • Cool Hemisphere Fill  │          │ • Auto-fits Box3 to floor      │ │
│  │ • Accent Rim Backlight  │          │ • Plays AnimationMixer clips   │ │
│  │ • Radial Contact Shadow │          │ • Procedural 3D Character      │ │
│  │   Plane at Floor Y=-1.1 │          │   Fallback if .glb not uploaded│ │
│  └─────────────────────────┘          └───────────────┬────────────────┘ │
│                                                       │                  │
│  ┌────────────────────────────────────────────────────▼────────────────┐ │
│  │ Per-Frame Loop (useFrame + Demand Scheduler + FPS Probe)            │ │
│  │ • Updates THREE.AnimationMixer(delta)                               │ │
│  │ • Applies damped pointer parallax to character & head bone rotation │ │
│  │ • Syncs CSS theme tokens (--accent, --surface, --text) on toggle    │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────┘
```

### Data Model & State

- **GLB Asset Resolution State**:
  - Tracks whether a `.glb` model exists in `src/three/3d_avatar` (or `/models/3d_avatar.glb`) and caches the loaded `THREE.Group` scene and `THREE.AnimationClip[]` array.
- **Animation & Kinematics State**:
  - `mixerRef`: `THREE.AnimationMixer` bound to the loaded `.glb` root scene, automatically playing the primary idle/standing clip (or all embedded clips).
  - `pointerRef`: Normalized pointer coordinates `{ x: [-1..1], y: [-1..1] }` captured on the Hero 3D container.
  - `headBoneRef`: Optional reference to the character's `Head` / `Neck` bone (discovered via traversal on the `.glb` skeleton or fallback rig) for natural gaze tracking alongside whole-body parallax rotation.

### Interactive Component & State Mapping

- **Pointer Move (`onPointerMove`)**: Updates `pointerRef.current` without triggering React re-renders; inside `useFrame`, smoothly interpolates the avatar group's `rotation.y` and `rotation.x` (plus subtle head bone look-at rotation) using `THREE.MathUtils.damp`.
- **Pointer Leave (`onPointerLeave`)**: Resets target pointer coordinates to `{ x: 0, y: 0 }` so the character smoothly returns to its neutral forward-facing stance.
- **Theme Toggle (`MutationObserver` on `document.documentElement`)**: Updates the studio rim light color, floor contact shadow opacity/tint, and fallback avatar accent materials whenever the user switches between Light and Dark mode.
- **Viewport & Tab Visibility (`IntersectionObserver` + `visibilitychange`)**: Pauses the animation scheduler when the Hero section scrolls out of view or when the browser tab is backgrounded, and resumes seamlessly when visible.
