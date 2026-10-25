# The story behind the site

The home page is a single walk through Obaidullah's path. The visitor scrolls,
the world slides sideways, and the 3D character walks along a timeline that
runs under his feet. At each stop he turns to face the visitor and acts out
that chapter. Every fact comes from `src/content/profile.ts`.

The arc: **an exam → a border → a dataset → a harder question → passing it on
→ building → what's next.** It reads as one person's path, not a list of
sections.

| # | Stop on the timeline | Chapter | What he does | The beat |
|---|---|---|---|---|
| 0 | Now | **Hi. I'm Obaidullah.** | Waves | Who he is, in one line. "Scroll — I'll walk you through it." |
| 1 | 2019 · Jalalabad | **It started with an exam.** | Hand on chin, remembering | 92.98% in high school, then the Kankor national exam placed him in Computer Science. |
| 2 | 2021 · Haripur | **Then a scholarship took me across a border.** | Hands on hips | HEC Allama Iqbal Scholarship to PAF-IAST. Five internships writing real software. Won Robo Tech 01 (2023). |
| 3 | 2024 · First dataset | **My first real dataset: 678,881 insurance claims.** | Points at the number | Cube Healthcare → BS thesis → Frontiers in Health Services (Scopus Q1), PR-AUC 0.777 vs a 0.330 baseline. |
| 4 | 2025 · The question | **Can a model spot a brain bleed, and say when it's not sure?** | Open palm, presenting | MS AI (4.00/4.00) and SPCAI: gatekeeper → specialist → MC Dropout abstain. 38 → 21 min turnaround (RSNA 2026 abstract, submitted). |
| 5 | 2025 · The lab | **Along the way, I started teaching.** | Explaining with both hands | Lab engineer, 150+ supervised student projects that ship, a 144-hour Power BI workshop for 50+ graduates. |
| 6 | Always · The workbench | **I still build things people use.** | Typing on an invisible keyboard | LLM admissions chatbot, emotion detector, federated learning, two client websites. |
| 7 | 2027 · Next | **Next: a PhD.** | Waves goodbye | PhD in CS from Sept 2027 (medical AI, trustworthy DL, multilingual NLP), and open to AI/ML roles. Contact. |

## Design rules that serve the story

- **One bright colour.** Warm paper background, near-black ink, one signal
  orange used only for what matters: the timeline, the key number of each
  chapter, the primary action.
- **Motion has a job.** The character walks only while the visitor scrolls,
  so movement means "time passes". Headlines rise in word by word when their
  chapter arrives, and each chapter's one key number counts up. Nothing loops
  in the background for show; the only ambient touch is his gaze gently
  following the visitor's cursor.
- **Glass over warm light.** Chapter cards, the header, the timeline labels
  and the chapter rail are frosted glass. Behind them, a few large blurred
  shapes in the same oranges and sand drift slower than the walk, so the
  glass always has something to frost and the page gains depth.
- **Fits every screen.** The character's canvas sits between the header and
  the ground line so he's never cropped. Cards that would overflow a short
  screen scale down (CSS `zoom`, to 0.72× at most) instead of spilling.
- **A cue to scroll.** A small glass pill ("Scroll to explore" with a mouse,
  or "Swipe up to explore" on touch screens) shows at the start and comes
  back after six idle seconds at a stop.
- **Landscape.** Vertical scroll drives a horizontal journey. Left/right
  arrow keys and the chapter rail at the bottom jump between stops.
- **Still readable without the show.** Without JavaScript or with reduced
  motion, the chapters stack vertically as a plain, complete page. Devices
  that can't run WebGL keep the walk but show his photo instead of the 3D
  character.
