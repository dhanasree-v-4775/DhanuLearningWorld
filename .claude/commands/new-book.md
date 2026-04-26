Create a new book page for DhanuLearningWorld under `books/<book-slug>/index.html`.

The user will provide the book title, pages content, and theme colours.

Follow the structure of `books/gruffalo/index.html`:

1. Font-loader IIFE + viewport meta
2. CSS classes to use:
   - `.topbar` — Home link + book title + "Page X of N" indicator
   - `.stage > .book` — outer wrappers
   - `.page` (hidden by default) / `.page.active` (shown) — one div per page
   - `.pg-full` — single centred panel
   - `.pg-split` — two-column layout (stacks vertically on mobile via tts.js)
   - `.nav` — Prev / Read Aloud / Next buttons
   - `.dots` — page indicator dots
3. JavaScript:
   - `var cur = 0;` current page index
   - `var pages = document.querySelectorAll('.page');`
   - `go(dir)` function to navigate
   - `readAloud()` that calls `window.speechSynthesis.speak()` with `u.lang = 'en-US'`
   - `pageTexts[]` array — one entry per page for Read Aloud
4. Font Picker Widget (copy verbatim from any book page)
5. `<script src="/tts.js"></script>` before `</body>`

After creating the file, add a card to the Books section in `index.html`.

Ask the user before committing.
