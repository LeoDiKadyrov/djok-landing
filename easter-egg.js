/* ============================================================
   easter-egg.js — CS 1.6 "LOADING_TIP" doubt-thought overlay.
   10% chance per page load. Throttled via sessionStorage.
   Bilingual: matches site lang (data-lang toggle).
   ============================================================ */

(function () {
  'use strict';

  // ── Config ────────────────────────────────────────────────
  const TRIGGER_CHANCE = 0.10;          // 10% per load
  const SESSION_KEY    = 'djok-doubt-shown';
  const DELAY_MS       = 800;           // wait for page paint before showing
  const COOLDOWN_HOURS = 6;             // don't re-show within N hours per browser

  // ── Doubt pool (verbatim user-flagged thoughts + extensions) ─
  const DOUBTS = {
    ru: [
      { text: 'да никто не купит',                src: 'inner monologue' },
      { text: 'засмеют',                          src: 'inner monologue' },
      { text: 'это уже давно сделали',            src: 'inner monologue' },
      { text: 'недостаточно хорошо',              src: 'inner monologue' },
      { text: 'опыта мало',                       src: 'inner monologue' },
      { text: 'слишком сложно объяснить',          src: 'inner monologue' },
      { text: 'лучше доработать ещё месяц',       src: 'inner monologue' },
      { text: 'люди не поймут',                   src: 'inner monologue' },
      { text: 'не та аудитория',                  src: 'inner monologue' },
      { text: 'бюджета на маркетинг нет',         src: 'inner monologue' },
      { text: 'видосы получаются не такие',        src: 'inner monologue' },
      { text: 'кто я такой чтоб это продавать',   src: 'inner monologue' },
      { text: 'leetify лучше',                    src: 'inner monologue' },
      { text: 'просто хобби, не бизнес',           src: 'inner monologue' },
      { text: 'надо было пойти в big tech',        src: 'inner monologue' },
    ],
    en: [
      { text: "nobody's gonna buy this",          src: 'inner monologue' },
      { text: "they'll laugh",                    src: 'inner monologue' },
      { text: "already done elsewhere",           src: 'inner monologue' },
      { text: "not good enough",                  src: 'inner monologue' },
      { text: "not enough experience",            src: 'inner monologue' },
      { text: "too hard to explain",              src: 'inner monologue' },
      { text: "should polish another month",      src: 'inner monologue' },
      { text: "people won't get it",              src: 'inner monologue' },
      { text: "wrong audience",                   src: 'inner monologue' },
      { text: "no marketing budget",              src: 'inner monologue' },
      { text: "videos turn out off",              src: 'inner monologue' },
      { text: "who am I to sell this",            src: 'inner monologue' },
      { text: "leetify is better",                src: 'inner monologue' },
      { text: "just a hobby, not a business",     src: 'inner monologue' },
      { text: "should've gone to big tech",       src: 'inner monologue' },
    ],
  };

  // ── UI strings per lang ───────────────────────────────────
  const UI = {
    ru: {
      label:    '◆ LOADING_TIP',
      dismiss:  'CONTINUE',
      hint:     'press CONTINUE to enter site',
    },
    en: {
      label:    '◆ LOADING_TIP',
      dismiss:  'CONTINUE',
      hint:     'press CONTINUE to enter site',
    },
  };

  // ── Lang detection — read existing site setting ───────────
  function detectLang() {
    try {
      const stored = localStorage.getItem('lang');
      if (stored === 'ru' || stored === 'en') return stored;
    } catch (_) {}
    const enBtn = document.getElementById('btn-en');
    if (enBtn && enBtn.classList.contains('active')) return 'en';
    const ruBtn = document.getElementById('btn-ru');
    if (ruBtn && ruBtn.classList.contains('active')) return 'ru';
    return (navigator.language || '').toLowerCase().startsWith('ru') ? 'ru' : 'en';
  }

  // ── Cooldown check ────────────────────────────────────────
  function recentlyShown() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY) ||
                  localStorage.getItem(SESSION_KEY);
      if (!raw) return false;
      const ts = parseInt(raw, 10);
      if (isNaN(ts)) return false;
      const hoursSince = (Date.now() - ts) / 36e5;
      return hoursSince < COOLDOWN_HOURS;
    } catch (_) {
      return false;
    }
  }

  function markShown() {
    const ts = String(Date.now());
    try { sessionStorage.setItem(SESSION_KEY, ts); } catch (_) {}
    try { localStorage.setItem(SESSION_KEY, ts); } catch (_) {}
  }

  // ── Build & show overlay ──────────────────────────────────
  function showDoubt() {
    const lang = detectLang();
    const pool = DOUBTS[lang] || DOUBTS.en;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    const ui = UI[lang] || UI.en;

    const overlay = document.createElement('div');
    overlay.className = 'cs16-doubt-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'CS 1.6 loading tip easter egg');

    const box = document.createElement('div');
    box.className = 'cs16-doubt-box';

    const text = document.createElement('p');
    text.className = 'cs16-doubt-text';
    text.textContent = '"' + pick.text + '"';

    const attr = document.createElement('p');
    attr.className = 'cs16-doubt-attribution';
    attr.textContent = '— ' + pick.src;

    const btn = document.createElement('button');
    btn.className = 'cs16-doubt-dismiss';
    btn.type = 'button';
    btn.textContent = ui.dismiss;
    btn.setAttribute('aria-label', ui.hint);

    function close() {
      overlay.style.opacity = '0';
      setTimeout(function () { overlay.remove(); }, 250);
      document.removeEventListener('keydown', onKey);
    }

    function onKey(e) {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        close();
      }
    }

    btn.addEventListener('click', close);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener('keydown', onKey);

    box.appendChild(text);
    box.appendChild(attr);
    box.appendChild(btn);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    // focus button for keyboard users
    setTimeout(function () { btn.focus(); }, 50);

    markShown();
  }

  // ── Public force-trigger for QA: window.__djokDoubt() ─────
  window.__djokDoubt = function () { showDoubt(); };

  // ── Roll the dice ─────────────────────────────────────────
  function init() {
    if (recentlyShown()) return;
    if (Math.random() >= TRIGGER_CHANCE) return;
    setTimeout(showDoubt, DELAY_MS);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
