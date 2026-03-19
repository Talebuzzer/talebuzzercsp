/**
 * TaleBuzzer — Sitewide Cookie Consent
 * UK PECR compliant | Self-contained | No external dependencies
 * Version: 1.0.0
 */
(function () {
  'use strict';

  /* ── Constants ────────────────────────────────────────────── */
  var KEY   = 'tb_cookie_consent';
  var VER   = '1.0';
  var PAGES = { cookies: /\/cookies\.html/ };

  /* ── Skip on coming-soon or bare maintenance pages ────────── */
  // (add paths here if any page should suppress the banner)
  var SUPPRESS = [];
  for (var s = 0; s < SUPPRESS.length; s++) {
    if (window.location.pathname.indexOf(SUPPRESS[s]) !== -1) return;
  }

  /* ── Storage helpers ──────────────────────────────────────── */
  function getConsent() {
    try { var r = localStorage.getItem(KEY); return r ? JSON.parse(r) : null; }
    catch (e) { return null; }
  }
  function setConsent(analytics, decision) {
    var c = { decision: decision, analytics: !!analytics, marketing: false,
               date: new Date().toISOString(), version: VER };
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {}
    return c;
  }

  /* ── Apply consent (wire up analytics here when ready) ────── */
  function applyConsent(c) {
    /* analytics placeholder — add GA init here when deployed */
  }

  /* ── Inject styles ────────────────────────────────────────── */
  function injectStyles() {
    if (document.getElementById('tb-banner-styles')) return;
    var s = document.createElement('style');
    s.id = 'tb-banner-styles';
    s.textContent = [
      /* Banner */
      '#tb-cookie-banner{',
        'position:fixed;bottom:0;left:0;right:0;z-index:9000;',
        'background:#141e2e;',
        'border-top:1px solid rgba(255,255,255,0.08);',
        'padding:20px 5%;',
        'display:flex;align-items:flex-start;justify-content:space-between;',
        'gap:24px;flex-wrap:wrap;',
        'box-shadow:0 -8px 40px rgba(0,0,0,0.5);',
        'font-family:"DM Sans",system-ui,sans-serif;',
        'transform:translateY(0);',
        'transition:transform 0.4s cubic-bezier(0.4,0,0.2,1),opacity 0.4s;',
      '}',
      '#tb-cookie-banner.tb-hidden{transform:translateY(110%);opacity:0;pointer-events:none}',
      '.tb-banner-text{flex:1;min-width:240px}',
      '.tb-banner-title{',
        'font-family:"Fraunces","Georgia",serif;font-size:16px;font-weight:500;',
        'color:#fff;margin:0 0 6px;display:flex;align-items:center;gap:8px;',
      '}',
      '.tb-banner-body{font-size:13px;font-weight:300;color:rgba(255,255,255,0.55);line-height:1.65;margin:0}',
      '.tb-banner-body a{color:#FAC775;text-decoration:none}',
      '.tb-banner-body a:hover{text-decoration:underline}',
      '.tb-banner-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding-top:4px}',
      /* Buttons */
      '.tb-btn{',
        'display:inline-flex;align-items:center;justify-content:center;',
        'font-family:"DM Sans",system-ui,sans-serif;font-size:13px;font-weight:500;',
        'border-radius:8px;padding:0 18px;height:38px;cursor:pointer;',
        'border:none;text-decoration:none;white-space:nowrap;',
        'transition:background 0.2s,color 0.2s,border-color 0.2s;',
        'line-height:1;',
      '}',
      '.tb-btn-amber{background:#EF9F27;color:#fff}',
      '.tb-btn-amber:hover{background:#d98e20;color:#fff}',
      '.tb-btn-outline{background:transparent;color:rgba(255,255,255,0.55);border:1px solid rgba(255,255,255,0.12)}',
      '.tb-btn-outline:hover{border-color:rgba(255,255,255,0.35);color:#fff}',
      '.tb-btn-red{background:transparent;color:#ef4444;border:1px solid rgba(239,68,68,0.25)}',
      '.tb-btn-red:hover{background:rgba(32,13,13,0.8);border-color:#ef4444}',
      /* Modal overlay */
      '#tb-pref-modal{',
        'position:fixed;inset:0;z-index:9100;',
        'display:flex;align-items:flex-end;justify-content:center;',
        'background:rgba(0,0,0,0.65);backdrop-filter:blur(4px);',
        'opacity:0;pointer-events:none;',
        'transition:opacity 0.3s;',
        'font-family:"DM Sans",system-ui,sans-serif;',
      '}',
      '#tb-pref-modal.tb-open{opacity:1;pointer-events:all}',
      '#tb-pref-modal.tb-open .tb-modal-sheet{transform:translateY(0)}',
      '.tb-modal-sheet{',
        'background:#141e2e;',
        'border:1px solid rgba(255,255,255,0.08);',
        'border-radius:20px 20px 0 0;',
        'width:100%;max-width:640px;max-height:90vh;overflow-y:auto;',
        'transform:translateY(40px);',
        'transition:transform 0.35s cubic-bezier(0.4,0,0.2,1);',
        'padding-bottom:env(safe-area-inset-bottom,0);',
      '}',
      '.tb-modal-handle{width:36px;height:4px;background:rgba(255,255,255,0.12);border-radius:99px;margin:14px auto 0}',
      '.tb-modal-header{',
        'display:flex;align-items:center;justify-content:space-between;',
        'padding:20px 24px 16px;border-bottom:0.5px solid rgba(255,255,255,0.08);',
      '}',
      '.tb-modal-header h2{font-family:"Fraunces","Georgia",serif;font-size:20px;font-weight:500;color:#fff;margin:0}',
      '.tb-modal-close{',
        'background:none;border:none;color:rgba(255,255,255,0.45);',
        'cursor:pointer;padding:4px;border-radius:6px;transition:color 0.2s;line-height:0;',
      '}',
      '.tb-modal-close:hover{color:#fff}',
      '.tb-modal-row{',
        'display:flex;align-items:flex-start;justify-content:space-between;',
        'gap:20px;padding:20px 24px;',
        'border-bottom:0.5px solid rgba(255,255,255,0.06);',
      '}',
      '.tb-modal-row:last-of-type{border-bottom:none}',
      '.tb-modal-info strong{display:block;font-size:14px;font-weight:500;color:rgba(255,255,255,0.85);margin-bottom:4px}',
      '.tb-modal-info p{font-size:13px;font-weight:300;color:rgba(255,255,255,0.55);line-height:1.6;margin:0}',
      '.tb-modal-toggle-wrap{flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:6px;padding-top:2px}',
      '.tb-modal-toggle-wrap span{font-size:10px;font-weight:500;letter-spacing:0.5px;text-transform:uppercase;color:rgba(255,255,255,0.45)}',
      /* Toggle switch */
      '.tb-toggle{position:relative;display:inline-block;width:44px;height:24px}',
      '.tb-toggle input{opacity:0;width:0;height:0;position:absolute}',
      '.tb-track{',
        'position:absolute;inset:0;border-radius:99px;',
        'background:#1c2a3e;border:1px solid rgba(255,255,255,0.1);',
        'cursor:pointer;transition:background 0.25s,border-color 0.25s;',
      '}',
      '.tb-toggle input:checked + .tb-track{background:#22c55e;border-color:#22c55e}',
      '.tb-toggle input:disabled + .tb-track{opacity:0.6;cursor:not-allowed}',
      '.tb-thumb{',
        'position:absolute;top:3px;left:3px;width:16px;height:16px;',
        'border-radius:50%;background:#fff;',
        'box-shadow:0 1px 4px rgba(0,0,0,0.3);',
        'transition:transform 0.25s;pointer-events:none;',
      '}',
      '.tb-toggle input:checked ~ .tb-thumb{transform:translateX(20px)}',
      /* Modal footer */
      '.tb-modal-footer{',
        'display:flex;align-items:center;justify-content:flex-end;',
        'gap:10px;padding:16px 24px;',
        'background:#1c2a3e;',
        'border-top:0.5px solid rgba(255,255,255,0.08);',
      '}',
      '.tb-modal-status{font-size:12px;color:#22c55e;opacity:0;transition:opacity 0.3s;margin-right:auto}',
      '.tb-modal-status.tb-show{opacity:1}',
      '.tb-btn-sm{font-size:12px;height:32px;padding:0 14px}',
      /* Mobile */
      '@media(max-width:600px){',
        '.tb-banner-actions{width:100%}',
        '.tb-banner-actions .tb-btn{flex:1;justify-content:center}',
        '.tb-modal-row{flex-direction:column;gap:12px}',
        '.tb-modal-toggle-wrap{flex-direction:row}',
      '}'
    ].join('');
    document.head.appendChild(s);
  }

  /* ── Build banner HTML ────────────────────────────────────── */
  function injectBanner() {
    if (document.getElementById('tb-cookie-banner')) return;
    var div = document.createElement('div');
    div.id = 'tb-cookie-banner';
    div.setAttribute('role', 'dialog');
    div.setAttribute('aria-modal', 'false');
    div.setAttribute('aria-label', 'Cookie consent');
    div.setAttribute('aria-live', 'polite');
    div.innerHTML = [
      '<div class="tb-banner-text">',
        '<p class="tb-banner-title">',
          '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">',
            '<circle cx="9" cy="9" r="8" stroke="#EF9F27" stroke-width="1.5"/>',
            '<circle cx="6.5" cy="7" r="1" fill="#EF9F27"/>',
            '<circle cx="11.5" cy="6" r="1" fill="#EF9F27"/>',
            '<circle cx="9" cy="11.5" r="1" fill="#EF9F27"/>',
            '<circle cx="12.5" cy="10.5" r="0.75" fill="#EF9F27"/>',
            '<circle cx="6" cy="11" r="0.75" fill="#EF9F27"/>',
          '</svg>',
          'We use cookies',
        '</p>',
        '<p class="tb-banner-body">',
          'TaleBuzzer uses strictly necessary cookies to keep your session active and remember your preferences. ',
          'We do not use advertising or tracking cookies. ',
          '<a href="/cookies.html">Read our Cookie Policy</a> for full details.',
        '</p>',
      '</div>',
      '<div class="tb-banner-actions">',
        '<button class="tb-btn tb-btn-outline" onclick="tbOpenPrefModal()" aria-haspopup="dialog">Manage preferences</button>',
        '<button class="tb-btn tb-btn-red" onclick="tbRejectAll()">Reject all</button>',
        '<button class="tb-btn tb-btn-amber" onclick="tbAcceptAll()">Accept all</button>',
      '</div>'
    ].join('');
    document.body.appendChild(div);
  }

  /* ── Build preference modal ───────────────────────────────── */
  function injectModal() {
    if (document.getElementById('tb-pref-modal')) return;
    var div = document.createElement('div');
    div.id = 'tb-pref-modal';
    div.setAttribute('role', 'dialog');
    div.setAttribute('aria-modal', 'true');
    div.setAttribute('aria-label', 'Cookie preference centre');
    div.innerHTML = [
      '<div class="tb-modal-sheet">',
        '<div class="tb-modal-handle" aria-hidden="true"></div>',
        '<div class="tb-modal-header">',
          '<h2>Cookie preferences</h2>',
          '<button class="tb-modal-close" onclick="tbClosePrefModal()" aria-label="Close">',
            '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">',
              '<path d="M5 5l10 10M15 5L5 15"/>',
            '</svg>',
          '</button>',
        '</div>',
        /* Essential */
        '<div class="tb-modal-row">',
          '<div class="tb-modal-info">',
            '<strong>Strictly necessary cookies</strong>',
            '<p>Required for login sessions, child PIN access, CSRF protection, and consent memory. Cannot be disabled.</p>',
          '</div>',
          '<div class="tb-modal-toggle-wrap">',
            '<label class="tb-toggle" aria-label="Strictly necessary — always on">',
              '<input type="checkbox" id="tb-modal-essential" checked disabled>',
              '<div class="tb-track"></div>',
              '<div class="tb-thumb"></div>',
            '</label>',
            '<span style="color:#22c55e">Always on</span>',
          '</div>',
        '</div>',
        /* Analytics */
        '<div class="tb-modal-row">',
          '<div class="tb-modal-info">',
            '<strong>Analytics cookies</strong>',
            '<p>Not currently active. If introduced, these will measure usage in aggregate only. No data is linked to child profiles.</p>',
          '</div>',
          '<div class="tb-modal-toggle-wrap">',
            '<label class="tb-toggle" aria-label="Toggle analytics cookies">',
              '<input type="checkbox" id="tb-modal-analytics" onchange="tbUpdateModalLabel()">',
              '<div class="tb-track"></div>',
              '<div class="tb-thumb"></div>',
            '</label>',
            '<span id="tb-modal-analytics-lbl">Off</span>',
          '</div>',
        '</div>',
        /* Marketing */
        '<div class="tb-modal-row">',
          '<div class="tb-modal-info">',
            '<strong>Marketing cookies</strong>',
            '<p>Not used by TaleBuzzer. We do not work with advertising networks or commercial tracking of any kind.</p>',
          '</div>',
          '<div class="tb-modal-toggle-wrap">',
            '<label class="tb-toggle" aria-label="Marketing cookies — not used">',
              '<input type="checkbox" id="tb-modal-marketing" disabled>',
              '<div class="tb-track"></div>',
              '<div class="tb-thumb"></div>',
            '</label>',
            '<span>Not used</span>',
          '</div>',
        '</div>',
        /* Footer */
        '<div class="tb-modal-footer">',
          '<span class="tb-modal-status" id="tb-modal-status" aria-live="polite">Preferences saved.</span>',
          '<button class="tb-btn tb-btn-red tb-btn-sm" onclick="tbRejectAll()">Reject all</button>',
          '<button class="tb-btn tb-btn-outline tb-btn-sm" onclick="tbAcceptAll()">Accept all</button>',
          '<button class="tb-btn tb-btn-amber tb-btn-sm" onclick="tbSaveModalPrefs()">Save my choices</button>',
        '</div>',
      '</div>'
    ].join('');
    document.body.appendChild(div);

    /* Close on backdrop click */
    div.addEventListener('click', function (e) {
      if (e.target === div) tbClosePrefModal();
    });
  }

  /* ── Public API (global functions called by HTML onclick) ─── */
  window.tbAcceptAll = function () {
    var c = setConsent(true, 'accepted');
    applyConsent(c);
    hideBanner();
    tbClosePrefModal();
    syncToggles(c);
    renderPageStatus(c);
    flashStatus();
  };

  window.tbRejectAll = function () {
    var c = setConsent(false, 'rejected');
    applyConsent(c);
    hideBanner();
    tbClosePrefModal();
    syncToggles(c);
    renderPageStatus(c);
    flashStatus();
  };

  window.tbSaveModalPrefs = function () {
    var el = document.getElementById('tb-modal-analytics');
    var c = setConsent(el ? el.checked : false, 'custom');
    applyConsent(c);
    hideBanner();
    tbClosePrefModal();
    syncToggles(c);
    renderPageStatus(c);
    flashStatus();
  };

  /* Called from cookies.html inline pref centre */
  window.tbSaveInlinePrefs = function () {
    var el = document.getElementById('pref-analytics');
    var c = setConsent(el ? el.checked : false, 'custom');
    applyConsent(c);
    hideBanner();
    syncToggles(c);
    renderPageStatus(c);
    flashInlineStatus();
  };

  window.tbRejectAllInline = function () {
    var c = setConsent(false, 'rejected');
    applyConsent(c);
    hideBanner();
    syncToggles(c);
    renderPageStatus(c);
    flashInlineStatus();
  };

  window.tbOpenPrefModal = function () {
    var m = document.getElementById('tb-pref-modal');
    if (!m) return;
    m.classList.add('tb-open');
    m.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  window.tbClosePrefModal = function () {
    var m = document.getElementById('tb-pref-modal');
    if (!m) return;
    m.classList.remove('tb-open');
    m.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  window.tbUpdateModalLabel = function () {
    var el  = document.getElementById('tb-modal-analytics');
    var lbl = document.getElementById('tb-modal-analytics-lbl');
    if (el && lbl) lbl.textContent = el.checked ? 'On' : 'Off';
  };

  /* ── Internal helpers ─────────────────────────────────────── */
  function hideBanner() {
    var b = document.getElementById('tb-cookie-banner');
    if (b) b.classList.add('tb-hidden');
  }

  function syncToggles(c) {
    var analytics = c && c.analytics;
    ['tb-modal-analytics', 'pref-analytics'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el && !el.disabled) el.checked = !!analytics;
    });
    tbUpdateModalLabel();
    /* Sync inline page label if present */
    var il = document.getElementById('pref-analytics-label');
    if (il) il.textContent = analytics ? 'On' : 'Off';
  }

  function flashStatus() {
    var el = document.getElementById('tb-modal-status');
    if (!el) return;
    el.classList.add('tb-show');
    setTimeout(function () { el.classList.remove('tb-show'); }, 3000);
  }

  function flashInlineStatus() {
    var el = document.getElementById('inline-save-status');
    if (!el) return;
    el.classList.add('show');
    setTimeout(function () { el.classList.remove('show'); }, 3000);
  }

  /* Render consent status pill on cookies.html page */
  function renderPageStatus(c) {
    var el = document.getElementById('inline-consent-status');
    if (!el) return;
    var d = c ? new Date(c.date).toLocaleDateString('en-GB') : '';
    if (!c) {
      el.innerHTML = '<span class="consent-pill pending">' +
        iconInfo() + 'No preference saved — please make a choice below.</span>';
    } else if (c.decision === 'rejected') {
      el.innerHTML = '<span class="consent-pill rejected">' +
        iconX() + 'You have rejected optional cookies. Only strictly necessary cookies are active. Last set: ' + d + '</span>';
    } else {
      el.innerHTML = '<span class="consent-pill accepted">' +
        iconCheck() + 'Consent recorded (' + c.decision + '). Analytics: ' +
        (c.analytics ? 'on' : 'off') + '. Last set: ' + d + '</span>';
    }
  }

  function iconInfo() {
    return '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1.2"/><path d="M6 4v2.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><circle cx="6" cy="8.5" r="0.5" fill="currentColor"/></svg>';
  }
  function iconX() {
    return '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1.2"/><path d="M4 4l4 4M8 4l-4 4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>';
  }
  function iconCheck() {
    return '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1.2"/><path d="M3.5 6l2 2 3-3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  /* ── Keyboard: Escape closes modal ───────────────────────── */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') tbClosePrefModal();
  });

  /* ── Init ─────────────────────────────────────────────────── */
  function init() {
    injectStyles();
    injectBanner();
    injectModal();

    var c = getConsent();
    if (c) {
      hideBanner();
      applyConsent(c);
      syncToggles(c);
    }
    renderPageStatus(c);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
