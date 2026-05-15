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
  // forceIdx: optional integer — show specific doubt by index
  function showDoubt(forceIdx) {
    const lang = detectLang();
    const pool = DOUBTS[lang] || DOUBTS.en;
    const idx = (typeof forceIdx === 'number' && !isNaN(forceIdx))
      ? ((forceIdx % pool.length) + pool.length) % pool.length
      : Math.floor(Math.random() * pool.length);
    const pick = pool[idx];
    const ui = UI[lang] || UI.en;

    const overlay = document.createElement('div');
    overlay.className = 'cs16-doubt-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'CS 1.6 loading tip easter egg');

    const box = document.createElement('div');
    box.className = 'cs16-doubt-box';

    // CS 1.6 dialog title bar
    const titleBar = document.createElement('div');
    titleBar.className = 'cs16-doubt-box-title';
    titleBar.textContent = ui.label + ' [' + (idx + 1) + '/' + pool.length + ']';

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

    box.appendChild(titleBar);
    box.appendChild(text);
    box.appendChild(attr);
    box.appendChild(btn);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    // focus button for keyboard users
    setTimeout(function () { btn.focus(); }, 50);

    markShown();
  }

  // ── Public force-trigger for QA: window.__djokDoubt(idx) ──
  window.__djokDoubt = function (idx) { showDoubt(idx); };

  // ── URL-param trigger for QA:
  //   ?doubt=1     → force random doubt (skip cooldown + chance)
  //   ?doubt=N     → force specific doubt by index (1-based)
  //   ?doubt=force → same as ?doubt=1
  function checkUrlOverride() {
    try {
      const params = new URLSearchParams(window.location.search);
      const raw = params.get('doubt');
      if (raw === null) return false;
      if (raw === '1' || raw === 'force' || raw === 'true') {
        setTimeout(function () { showDoubt(); }, 100);
        return true;
      }
      const n = parseInt(raw, 10);
      if (!isNaN(n) && n > 0) {
        setTimeout(function () { showDoubt(n - 1); }, 100);
        return true;
      }
    } catch (_) {}
    return false;
  }

  // ── Roll the dice ─────────────────────────────────────────
  function init() {
    if (checkUrlOverride()) return;          // URL param wins always
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
