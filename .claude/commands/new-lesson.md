Create a new lesson page for DhanuLearningWorld.

The user will specify: subject (english/science/maths/evs/ict/tamil/hindi), lesson name, and content.

Follow this exact structure for the new `apps/<subject>/<lesson-name>/index.html`:

1. Start with the font-loader IIFE (copy from any existing app page)
2. viewport meta: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
3. Inline CSS only — no external stylesheets except Google Fonts loaded by font-loader
4. Body structure: `.topbar` → `.stage` → `.card` → content
5. Add the Font Picker Widget (copy from any existing app page verbatim)
6. End with `<script src="/tts.js"></script>` before `</body>`

Speech synthesis rules:
- English content: `u.lang = 'en-US'`, `u.rate = 0.85` — tts.js applies female voice automatically
- Tamil content: `u.lang = 'ta-IN'` — system TTS, do NOT override voice
- Hindi content: `u.lang = 'hi-IN'` — system TTS, do NOT override voice

After creating the file, add a link card to `index.html` in the appropriate subject section.

Ask the user before committing.
