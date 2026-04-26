# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**DhanuLearningWorld** — an IGCSE-aligned interactive learning site for a single child covering **Sr KG (age 4–5)** and **Grade 1 (age 5–6)**. Static HTML/CSS/JS only; no framework, no build step. Deployed on **Zoho Catalyst (Zoho Slate)** with auto-deploy from the `main` branch on GitHub.

Target device: **Honor Kids Android tablet (HMS — no Google services)**. All UI must work without Google TTS, Google Play, or any Google service.

## Running Locally

```bash
# Serve from project root (required — tts.js is served as /tts.js)
python3 -m http.server 8080
# Then open http://localhost:8080
```

No build step, no package manager, no compilation. Edit HTML files directly and refresh.

## Repository Structure

```
index.html              # Home page — Sr KG / Grade 1 tab switcher + all subject cards
tts.js                  # Global voice engine + mobile scroll fix (injected in all pages)
apps/
  srkg/                 # Sr KG (age 4–5) lessons — 4 levels deep from root
  │ english/
  │ │ alphabet/         # Alphabet Fun — A–Z carousel + quiz
  │ │ pre-writing/      # Pre-Writing — stroke animations + trace guides
  │ │ rhymes/           # Rhymes & Songs — 6 nursery rhymes, read aloud
  │ maths/
  │ │ sorting/          # Sorting & Matching — by colour, size, shape
  │ │ comparing/        # Comparing — big/small, tall/short, heavy/light, more/less
  │ science/
  │ │ my-body/          # My Body — 10 body parts, learn + quiz
  │ │ weather/          # Weather — learn, dress-up, quiz; CSS animations
  │ evs/
  │   my-family/        # My Family — 8 family members + quiz
  │   my-school/        # My School — things, people + quiz
  english/              # Grade 1: phonics, blending, sight-words, vocabulary,
  │                     #   reading, comprehension, speaking, writing
  science/              # Grade 1: animals, plants, materials, senses
  maths/                # Grade 1: counting, addition, number-bonds, shapes,
  │                     #   measurement, patterns, time, data-handling
  evs/                  # Grade 1: environment, community, healthy-habits
  ict/                  # Grade 1: coding, sequencing, storytelling
  tamil/                # letters, words  (Tamil native language)
  hindi/                # letters, words  (Hindi native language)
books/                  # gruffalo, caterpillar, wild-things, magic-tree,
                        #   green-eggs, fathers-dragon, elephant-piggie, frog-toad
```

Each leaf is a single `index.html` — fully self-contained with inline CSS and JS.

### Sr KG path convention
Sr KG apps live at `apps/srkg/<subject>/<lesson>/index.html` (4 levels deep).  
Home link in every Sr KG page: `href="../../../../index.html"`

## tts.js — The Global Engine (Critical File)

`tts.js` is injected as `<script src="/tts.js"></script>` before `</body>` in **all HTML files** (Grade 1 + Sr KG). It does two things:

1. **Female voice selection** — intercepts `window.speechSynthesis.speak()`, picks the best available female voice (priority: Samantha → Google US English → Microsoft Zira → fallback), applies it to every English utterance. Tamil (`lang="ta-*"`) and Hindi (`lang="hi-*"`) utterances pass through to system TTS unchanged.

2. **Mobile scroll fix** — injects CSS at runtime that overrides the flex-body layout used across all pages, enabling natural scroll on Android/iOS. Key overrides: `body { display: block }`, `.stage { display: block; height: auto }`, `.card/.book { overflow: visible; height: auto }`, `.pg-split { flex-direction: column }` at `max-width: 860px`.

**When adding a new page**, always add `<script src="/tts.js"></script>` before `</body>`. The `/` prefix is required (absolute path) — relative paths break on Zoho Catalyst.

## Per-Page Architecture (Every App)

Every page follows the same pattern:

```html
<head>
  <!-- 1. Font loader (IIFE, reads localStorage 'dhanu-font', default Nunito) -->
  <!-- 2. viewport meta -->
  <!-- 3. Inline <style> — all CSS for the page -->
</head>
<body>
  <!-- 4. .topbar — Home link + title + optional status -->
  <!-- 5. Main content (.stage > .card, or .stage > .book for books) -->
  <!-- 6. Font picker FAB (#font-fab + #font-panel) — fixed bottom-right -->
  <script src="/tts.js"></script>
</body>
```

**Font picker widget** is copy-pasted identically across all pages. It stores the chosen font in `localStorage('dhanu-font')` and reloads the page. Available fonts: Nunito (default), Fredoka One, Patrick Hand, ABeeZee, Poppins.

## Speech Synthesis Patterns

**English apps** (phonics, blending, sight-words, vocabulary, science, maths, etc.):
```javascript
var u = new SpeechSynthesisUtterance('Apple');
u.lang = 'en-US';
u.rate = 0.85;
window.speechSynthesis.speak(u);   // tts.js intercepts, applies femaleVoice
```

**Tamil apps** — set `u.lang = 'ta-IN'`; tts.js passes through to system TTS.

**Hindi apps** — set `u.lang = 'hi-IN'`; tts.js passes through to system TTS.
Hindi uses `Noto Sans Devanagari` font; Tamil uses `Noto Sans Tamil` font.

The `femaleVoice` variable in tts.js is picked **lazily** (on first `speak()` call, not at page load) to avoid the async `getVoices()` timing issue.

## Book Pages Pattern

Books use a page-at-a-time reader:
- `.page` divs are all `display:none`; `.page.active` is shown
- Layout types: `.pg-full` (centred single panel) and `.pg-split` (two columns, stacks on mobile)
- Navigation: `go(n)` function, Prev/Next buttons, dot indicators, "Read Aloud" button
- `pageTexts[]` array holds the text for each page — used for the Read Aloud feature

## Deployment

Push to `main` → Zoho Catalyst auto-deploys. No CI, no tests, no linting. Deployment usually takes 1–3 minutes.

## Key Constraints

- **No npm, no bundler, no framework** — pure HTML/CSS/JS only
- **No Google services** — Honor tablet runs HMS; avoid anything requiring Google Play or Google TTS
- **`/tts.js` absolute path** — always use `/tts.js`, never `./tts.js` or `../tts.js`
- **IGCSE content** — Sr KG follows Cambridge Early Years; Grade 1 follows Cambridge Primary English syllabus
- **Tamil & Hindi** — native language support; these pages use system TTS, not the female voice override
- **No auto-commit** — always ask the user before committing or pushing
- **Home page tabs** — `index.html` has a Sr KG / Grade 1 pill tab switcher (`switchGrade('skg'|'g1')`). Sr KG content is in `<div id="skg-content">`, Grade 1 in `<div id="g1-content">`
