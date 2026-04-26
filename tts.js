/**
 * tts.js — Female Voice Engine + Mobile Scroll Fix for DhanuLearningWorld
 *
 * • Picks the best available female voice once at load
 * • Applies it to every English speechSynthesis.speak() call automatically
 * • Tamil / Hindi pass-through unchanged (system TTS)
 * • Injects mobile-friendly scroll CSS so all pages work on phones/tablets
 * • Works on any browser — no internet required
 */
(function () {
  'use strict';

  /* ── Mobile scroll fix (injected into every page) ───────────────── */
  var style = document.createElement('style');
  style.textContent = [
    /* Always allow html/body to scroll — fixes Android + iOS */
    'html {',
    '  height: auto;',
    '  overflow-y: auto;',
    '  -webkit-overflow-scrolling: touch;',
    '  touch-action: pan-y;',
    '}',
    'body {',
    '  height: auto;',
    '  min-height: 100vh;',
    '  overflow-y: auto;',
    '  overflow-x: hidden;',
    '  -webkit-overflow-scrolling: touch;',
    '  touch-action: pan-y;',
    '}',

    /* Mobile-specific layout fixes */
    '@media (max-width: 860px) {',

    /* Convert flex body to block so content stacks and scrolls naturally */
    '  body {',
    '    display: block !important;',
    '    padding-bottom: 80px;',
    '}',

    /* Stage: block layout, no vertical centering trap */
    '  .stage, .app-stage {',
    '    display: block !important;',
    '    width: 100% !important;',
    '    height: auto !important;',
    '    padding: 10px !important;',
    '}',

    /* Cards and book containers: full width, allow content to flow */
    '  .card, .book, .lesson-card, .content-card {',
    '    width: 100% !important;',
    '    max-width: 100% !important;',
    '    min-height: unset !important;',
    '    height: auto !important;',
    '    overflow: visible !important;',
    '    border-radius: 16px !important;',
    '}',

    /* Book pages: allow each page to grow to fit content */
    '  .page, .page.active {',
    '    min-height: unset !important;',
    '    height: auto !important;',
    '    overflow: visible !important;',
    '}',

    /* Split layout: stack vertically on mobile */
    '  .pg-split {',
    '    flex-direction: column !important;',
    '}',
    '  .pg-split .left, .pg-split .right {',
    '    width: 100% !important;',
    '    padding: 16px !important;',
    '}',

    /* Bigger tap targets */
    '  .nav-btn, .speak-btn, .read-btn {',
    '    min-height: 48px;',
    '    padding: 12px 20px !important;',
    '    font-size: 1em !important;',
    '}',

    /* Topbar: compact on small screens */
    '  .topbar {',
    '    padding: 8px 12px !important;',
    '    font-size: 0.88em;',
    '}',

    /* Font picker FAB: keep away from edge */
    '  #font-fab {',
    '    bottom: 12px !important;',
    '    right: 12px !important;',
    '}',
    '  #font-panel {',
    '    bottom: 76px !important;',
    '    right: 12px !important;',
    '    width: 200px !important;',
    '}',

    '}'  /* end @media */
  ].join('\n');

  document.head.appendChild(style);

  /* ── Female voice selection ─────────────────────────────────────── */
  var FEMALE_NAMES = [
    'Samantha', 'Google US English', 'Microsoft Zira',
    'Ava', 'Allison', 'Susan', 'Karen', 'Victoria',
    'Moira', 'Fiona', 'Tessa', 'Nicky',
    'Google UK English Female', 'Microsoft Hazel'
  ];

  var femaleVoice = null;

  function pickFemaleVoice() {
    var voices   = window.speechSynthesis.getVoices();
    var enVoices = voices.filter(function (v) { return v.lang.toLowerCase().startsWith('en'); });
    if (!enVoices.length) return;

    for (var i = 0; i < FEMALE_NAMES.length; i++) {
      var match = enVoices.find(function (v) { return v.name.includes(FEMALE_NAMES[i]); });
      if (match) { femaleVoice = match; return; }
    }
    femaleVoice = enVoices.find(function (v) { return v.lang === 'en-US'; }) || enVoices[0];
  }

  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = pickFemaleVoice;
  }
  pickFemaleVoice();

  /* ── Intercept speak() ──────────────────────────────────────────── */
  var _origSpeak = window.speechSynthesis.speak.bind(window.speechSynthesis);

  window.speechSynthesis.speak = function (utt) {
    var lang = (utt.lang || '').toLowerCase();

    if (lang.startsWith('ta') || lang.startsWith('hi')) {
      _origSpeak(utt);
      return;
    }

    if (!femaleVoice) pickFemaleVoice();

    if (femaleVoice) {
      utt.voice = femaleVoice;
      utt.lang  = femaleVoice.lang;
    }
    _origSpeak(utt);
  };

}());
