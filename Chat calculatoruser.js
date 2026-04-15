// ==UserScript==
// @name         Chat Calculator
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Chat target calculator - fully inline styled
// @author       Atlas - Amazon GR Tech
// @match        https://abc-mlops.harmony.a2z.com/*
// @run-at       document-end
// @grant        unsafeWindow
// ==/UserScript==

(function () {
  'use strict';

  function inject() {
    if (document.getElementById('ctc-fab')) return;

    // ── FAB BUTTON ────────────────────────────────────────────────
    const fab = document.createElement('button');
    fab.id = 'ctc-fab';
    fab.innerHTML = '🧮';
    fab.title = 'Chat Calculator';
    Object.assign(fab.style, {
      position:     'fixed',
      bottom:       '30px',
      right:        '30px',
      zIndex:       '2147483647',
      width:        '54px',
      height:       '54px',
      borderRadius: '50%',
      background:   '#16a34a',
      color:        '#fff',
      border:       'none',
      fontSize:     '24px',
      cursor:       'pointer',
      boxShadow:    '0 4px 18px rgba(22,163,74,0.55)',
      display:      'flex',
      alignItems:   'center',
      justifyContent: 'center',
      lineHeight:   '1',
      padding:      '0',
      outline:      'none',
    });
    document.body.appendChild(fab);

    // ── MODAL WRAPPER ─────────────────────────────────────────────
    const modal = document.createElement('div');
    modal.id = 'ctc-modal';
    Object.assign(modal.style, {
      display:      'none',
      position:     'fixed',
      bottom:       '96px',
      right:        '30px',
      zIndex:       '2147483646',
      width:        '290px',
      background:   '#ffffff',
      borderRadius: '14px',
      boxShadow:    '0 8px 40px rgba(0,0,0,0.28)',
      fontFamily:   'Arial, sans-serif',
      overflow:     'hidden',
      border:       '1px solid #e5e7eb',
    });
    document.body.appendChild(modal);

    // ── HEADER ────────────────────────────────────────────────────
    const head = document.createElement('div');
    Object.assign(head.style, {
      background:     '#16a34a',
      padding:        '13px 15px',
      display:        'flex',
      justifyContent: 'space-between',
      alignItems:     'center',
    });

    const headText = document.createElement('div');

    const headTitle = document.createElement('div');
    headTitle.textContent = '🧮 Chat Calculator';
    Object.assign(headTitle.style, {
      color:      '#ffffff',
      fontWeight: '700',
      fontSize:   '14px',
      margin:     '0',
    });

    const headSub = document.createElement('div');
    headSub.textContent = '560 chats  |  70/hr  |  480 min';
    Object.assign(headSub.style, {
      color:     '#d1fae5',
      fontSize:  '11px',
      marginTop: '3px',
    });

    headText.appendChild(headTitle);
    headText.appendChild(headSub);

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    Object.assign(closeBtn.style, {
      background:   'rgba(255,255,255,0.2)',
      border:       'none',
      color:        '#fff',
      width:        '26px',
      height:       '26px',
      borderRadius: '50%',
      cursor:       'pointer',
      fontSize:     '13px',
      lineHeight:   '1',
      flexShrink:   '0',
      padding:      '0',
    });

    head.appendChild(headText);
    head.appendChild(closeBtn);
    modal.appendChild(head);

    // ── BODY ──────────────────────────────────────────────────────
    const body = document.createElement('div');
    Object.assign(body.style, {
      padding: '16px',
    });

    // Label
    const lbl = document.createElement('label');
    lbl.textContent = 'Total NPT taken today (minutes)';
    Object.assign(lbl.style, {
      display:      'block',
      fontSize:     '12px',
      fontWeight:   '600',
      color:        '#374151',
      marginBottom: '8px',
    });

    // Input
    const inp = document.createElement('input');
    inp.id          = 'ctc-npt';
    inp.type        = 'number';
    inp.min         = '0';
    inp.max         = '480';
    inp.placeholder = 'e.g.  30';
    Object.assign(inp.style, {
      width:         '100%',
      boxSizing:     'border-box',
      border:        '2px solid #d1fae5',
      borderRadius:  '8px',
      padding:       '10px',
      fontSize:      '26px',
      fontWeight:    '700',
      textAlign:     'center',
      color:         '#111111',
      outline:       'none',
      marginBottom:  '12px',
      background:    '#f9fafb',
      display:       'block',
    });

    // Calculate button
    const calcBtn = document.createElement('button');
    calcBtn.textContent = '⚡ Calculate';
    Object.assign(calcBtn.style, {
      width:        '100%',
      background:   '#16a34a',
      color:        '#ffffff',
      border:       'none',
      borderRadius: '8px',
      padding:      '11px',
      fontSize:     '14px',
      fontWeight:   '700',
      cursor:       'pointer',
      display:      'block',
    });

    body.appendChild(lbl);
    body.appendChild(inp);
    body.appendChild(calcBtn);

    // ── RESULTS ───────────────────────────────────────────────────
    const results = document.createElement('div');
    results.id = 'ctc-results';
    Object.assign(results.style, {
      display:   'none',
      marginTop: '14px',
    });

    function makeRow(emoji, label, id) {
      const row = document.createElement('div');
      row.id = id + '-row';
      Object.assign(row.style, {
        display:        'flex',
        justifyContent: 'space-between',
        alignItems:     'center',
        background:     '#f0fdf4',
        border:         '1px solid #bbf7d0',
        borderRadius:   '8px',
        padding:        '9px 12px',
        marginBottom:   '8px',
      });

      const ltext = document.createElement('span');
      ltext.textContent = emoji + ' ' + label;
      Object.assign(ltext.style, {
        fontSize: '11px',
        color:    '#6b7280',
      });

      const val = document.createElement('span');
      val.id = id;
      val.textContent = '--';
      Object.assign(val.style, {
        fontSize:   '20px',
        fontWeight: '800',
        color:      '#15803d',
      });

      row.appendChild(ltext);
      row.appendChild(val);
      return row;
    }

    const row1 = makeRow('💬', 'Chats Achievable',    'ctc-v1');
    const row2 = makeRow('⏱',  'Productive Time Left', 'ctc-v2');
    const row3 = makeRow('⚡', 'Required Rate',        'ctc-v3');

    // Status note box
    const note = document.createElement('div');
    note.id = 'ctc-note';
    Object.assign(note.style, {
      fontSize:     '11.5px',
      color:        '#374151',
      background:   '#f9fafb',
      border:       '1px solid #e5e7eb',
      borderRadius: '8px',
      padding:      '9px 11px',
      marginTop:    '4px',
      lineHeight:   '1.7',
      display:      'none',
    });

    results.appendChild(row1);
    results.appendChild(row2);
    results.appendChild(row3);
    results.appendChild(note);
    body.appendChild(results);
    modal.appendChild(body);

    // ── OPEN / CLOSE LOGIC ────────────────────────────────────────
    fab.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = modal.style.display === 'block';
      modal.style.display = isOpen ? 'none' : 'block';
      if (!isOpen) inp.focus();
    });

    closeBtn.addEventListener('click', function () {
      modal.style.display = 'none';
    });

    document.addEventListener('click', function (e) {
      if (!modal.contains(e.target) && e.target !== fab) {
        modal.style.display = 'none';
      }
    });

    // ── CALCULATE LOGIC ───────────────────────────────────────────
    function calculate() {
      const npt = parseInt(inp.value, 10);

      if (isNaN(npt) || npt < 0 || npt > 480) {
        inp.style.border = '2px solid #dc2626';
        inp.value = '';
        inp.placeholder = 'Enter 0 to 480';
        return;
      }
      inp.style.border = '2px solid #16a34a';

      const TOTAL_MINS   = 480;
      const DAILY_TARGET = 560;
      const RATE_PER_MIN = 70 / 60;

      const prodMins   = TOTAL_MINS - npt;
      const prodHrs    = Math.floor(prodMins / 60);
      const prodMinRem = prodMins % 60;
      const chatsCanDo = Math.floor(prodMins * RATE_PER_MIN);
      const reqRate    = prodMins > 0
        ? (DAILY_TARGET / (prodMins / 60)).toFixed(1)
        : 'N/A';
      const reqRateNum = parseFloat(reqRate);

      // Chats value
      const v1 = document.getElementById('ctc-v1');
      v1.textContent = chatsCanDo >= DAILY_TARGET ? chatsCanDo + ' ✅' : chatsCanDo;
      v1.style.color = chatsCanDo >= DAILY_TARGET ? '#15803d' : '#dc2626';

      // Time value
      document.getElementById('ctc-v2').textContent = prodHrs + 'h ' + prodMinRem + 'm';

      // Rate value
      const v3  = document.getElementById('ctc-v3');
      const r3  = document.getElementById('ctc-v3-row');
      v3.textContent = reqRate !== 'N/A' ? reqRate + '/hr' : 'N/A';

      if (reqRateNum > 70) {
        v3.style.color         = '#dc2626';
        r3.style.background    = '#fff5f5';
        r3.style.borderColor   = '#fecaca';
      } else {
        v3.style.color         = '#15803d';
        r3.style.background    = '#f0fdf4';
        r3.style.borderColor   = '#bbf7d0';
      }

      // Note message
      let msg = '';
      if (prodMins <= 0) {
        msg = '🚫 NPT exceeds your full shift. Zero productive time left.';
      } else if (chatsCanDo >= DAILY_TARGET) {
        msg = '✅ You can still hit 560 chats! Keep going at ' + reqRate + '/hr.';
      } else {
        msg = '⚠️ With ' + npt + ' min NPT, you can do ~' + chatsCanDo + ' chats. Need ' + reqRate + '/hr to hit 560 — above standard 70/hr.';
      }
      note.textContent        = msg;
      note.style.display      = 'block';
      results.style.display   = 'block';
    }

    calcBtn.addEventListener('click', calculate);
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') calculate();
    });
  }

  // ── Run with SPA fallback ──────────────────────────────────────
  function tryInject() {
    if (document.body) { inject(); }
    else { document.addEventListener('DOMContentLoaded', inject); }
  }

  tryInject();

  // Re-inject on SPA navigation
  let lastUrl = location.href;
  new MutationObserver(function () {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      setTimeout(tryInject, 800);
    }
  }).observe(document, { subtree: true, childList: true });

})();
