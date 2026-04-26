Audit all HTML pages in DhanuLearningWorld to verify tts.js is correctly wired up.

Run these checks across all *.html files:

1. **tts.js injection** — every file must have `<script src="/tts.js"></script>` (absolute path with leading `/`) immediately before `</body>`. Flag any that use a relative path (`./tts.js`, `../tts.js`) or are missing it entirely.

2. **Language tags on utterances** — English speech must set `u.lang = 'en-US'` (or any `en-*`). Tamil must use `ta-IN`. Hindi must use `hi-IN`. Flag any utterances with no `lang` set.

3. **No hardcoded voice selection** — apps must NOT call `speechSynthesis.getVoices()` or set `utt.voice` themselves; tts.js handles this. Flag any page that sets `utt.voice` directly.
   - **Known exception**: `apps/hindi/letters` and `apps/tamil/letters` call `getVoices()` only to check if a native voice is installed and show a user tip — this is intentional, not a bug.

4. **No kokoro / ResponsiveVoice remnants** — check for any `dhanuPreload`, `kokoro-ready`, `responsiveVoice`, or `KokoroTTS` references.

Report a table: filename | tts.js present | lang set | voice override | stale TTS refs
