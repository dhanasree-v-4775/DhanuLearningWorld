/**
 * tts.js — Female Voice Engine for DhanuLearningWorld
 *
 * • Picks the best available female voice once at load
 * • Applies it to every English speechSynthesis.speak() call automatically
 * • Tamil / Hindi pass-through unchanged (system TTS)
 * • Works on any browser — no internet required
 */
(function () {
  'use strict';

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

    // Try preferred names first
    for (var i = 0; i < FEMALE_NAMES.length; i++) {
      var match = enVoices.find(function (v) { return v.name.includes(FEMALE_NAMES[i]); });
      if (match) { femaleVoice = match; return; }
    }
    // Fallback: first en-US, then any English voice
    femaleVoice = enVoices.find(function (v) { return v.lang === 'en-US'; }) || enVoices[0];
  }

  // Voices load asynchronously — pick as soon as they're available
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = pickFemaleVoice;
  }
  pickFemaleVoice();

  /* ── Intercept speak() to apply female voice to English ─────────── */
  var _origSpeak = window.speechSynthesis.speak.bind(window.speechSynthesis);

  window.speechSynthesis.speak = function (utt) {
    var lang = (utt.lang || '').toLowerCase();

    // Tamil / Hindi — leave completely unchanged
    if (lang.startsWith('ta') || lang.startsWith('hi')) {
      _origSpeak(utt);
      return;
    }

    // Lazy pick — voices are always ready by the time user taps
    if (!femaleVoice) pickFemaleVoice();

    // English — apply female voice if available
    if (femaleVoice) {
      utt.voice = femaleVoice;
      utt.lang  = femaleVoice.lang;
    }
    _origSpeak(utt);
  };

}());
