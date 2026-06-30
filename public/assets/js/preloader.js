/**
 * PRELOADER.JS — TV BIOS boot sequence
 * Handles: grain animation, glitch bursts, progress bar, BIOS text, reveal
 */
(function () {
  'use strict';

  var preloader = document.getElementById('preloader');
  var tvInner = document.getElementById('tvInner');
  var grainCanvas = document.getElementById('tvGrainCanvas');
  var glitchCanvas = document.getElementById('tvGlitchCanvas');
  var progressFill = document.getElementById('tvProgressFill');
  var pctEl = document.getElementById('tvPct');
  var skipHint = document.getElementById('tvSkipHint');
  var tvBios = document.getElementById('tvBios');
  var fluidCanvas = document.getElementById('fluidCanvas');
  var bgCanvas = document.getElementById('bgCanvas');
  var illustCanvas = document.getElementById('illustrationCanvas');

  var grainRaf = null, glitchRaf = null, shakeTimer = null;
  var loadTimer = null, biosTimer = null;
  var loadN = 0, skipped = false;

  /* Hide background layers until boot sequence ends */
  function hideBackgrounds() {
    if (fluidCanvas) { fluidCanvas.style.opacity = '0'; fluidCanvas.style.transition = 'none'; }
    if (bgCanvas) { bgCanvas.style.opacity = '0'; bgCanvas.style.transition = 'none'; }
    if (illustCanvas) { illustCanvas.style.opacity = '0'; illustCanvas.style.transition = 'none'; }
  }
  hideBackgrounds();

  /* Check if internal nav (from TxIn) */
  var isInternalNav = sessionStorage.getItem('txText') !== null;

  if (isInternalNav) {
    if (preloader) { preloader.style.transition = 'none'; preloader.style.display = 'none'; }
    document.body.classList.remove('boot-pending');
    if (fluidCanvas) { fluidCanvas.style.transition = 'opacity 1s ease'; fluidCanvas.style.opacity = '1'; }
    if (bgCanvas) { bgCanvas.style.transition = 'opacity 1s ease'; bgCanvas.style.opacity = '1'; }
    if (illustCanvas) { illustCanvas.style.transition = 'opacity 1s ease'; illustCanvas.style.opacity = '1'; }
    return;
  }

  /* Grain animation */
  function initGrain() {
    if (!grainCanvas) return;
    grainCanvas.width = 1600;
    grainCanvas.height = 900;
    var gc = grainCanvas.getContext('2d');
    var tick = 0;
    (function draw() {
      tick++;
      if (tick % 5 === 0) {
        var img = gc.createImageData(1600, 900);
        var d = img.data;
        for (var i = 0; i < d.length; i += 4) {
          var v = Math.random() * 255 | 0;
          d[i] = d[i + 1] = d[i + 2] = v;
          d[i + 3] = 255;
        }
        gc.putImageData(img, 0, 0);
      }
      grainRaf = requestAnimationFrame(draw);
    })();
  }

  /* Glitch bursts */
  function initGlitch() {
    if (!glitchCanvas) return;
    var GW = 320, GH = 200;
    glitchCanvas.width = GW;
    glitchCanvas.height = GH;
    var gg = glitchCanvas.getContext('2d');

    var snowImg = gg.createImageData(GW, GH);
    var sd = snowImg.data;

    var STRIP_COLORS = [
      [191,191,191], [191,191,0], [0,191,191],
      [0,191,0], [191,0,191], [191,0,0], [0,0,191]
    ];
    var N_STRIPS = STRIP_COLORS.length;
    var stripOffsets = new Float32Array(N_STRIPS);
    var stripTargets = new Float32Array(N_STRIPS);
    var STRIP_H = Math.ceil(GH * 0.62);
    var STRIP_W = Math.ceil(GW / N_STRIPS);

    var BURST_AT = [400, 1100];
    var BURST_DUR = 220;
    var glitchStart = Date.now();
    var burstActive = false, burstEnd = 0, nextBurst = 0;

    function stopShake() {
      if (shakeTimer) { clearInterval(shakeTimer); shakeTimer = null; }
      if (tvInner) tvInner.style.transform = '';
    }

    function startShake() {
      stopShake();
      var step = 0;
      shakeTimer = setInterval(function () {
        step++;
        if (step >= 12 || !tvInner) { stopShake(); return; }
        tvInner.style.transform = 'translateX(' + ((Math.random() - 0.5) * 28) + 'px)';
      }, BURST_DUR / 12);
    }

    function activateBurst() {
      burstActive = true;
      burstEnd = Date.now() + BURST_DUR;
      for (var i = 0; i < N_STRIPS; i++) stripTargets[i] = (Math.random() - 0.5) * 36;
      startShake();
    }

    (function draw() {
      var now = Date.now();
      var elapsed = now - glitchStart;

      if (!burstActive && nextBurst < BURST_AT.length && elapsed >= BURST_AT[nextBurst]) {
        activateBurst(); nextBurst++;
      }

      if (burstActive && now >= burstEnd) {
        burstActive = false;
        stopShake();
        gg.clearRect(0, 0, GW, GH);
        stripOffsets.fill(0);
      }

      if (burstActive) {
        for (var i = 0; i < sd.length; i += 4) {
          var v = Math.random() * 255 | 0;
          sd[i] = sd[i + 1] = sd[i + 2] = v;
          sd[i + 3] = (Math.random() * 180 + 55) | 0;
        }
        gg.putImageData(snowImg, 0, 0);
        for (var i = 0; i < N_STRIPS; i++) {
          stripOffsets[i] += (stripTargets[i] - stripOffsets[i]) * 0.35;
          if (Math.random() < 0.18) stripTargets[i] = (Math.random() - 0.5) * 36;
          var color = STRIP_COLORS[i];
          gg.fillStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',0.72)';
          gg.fillRect(i * STRIP_W + stripOffsets[i], 0, STRIP_W + 1, STRIP_H);
        }
      }

      glitchRaf = requestAnimationFrame(draw);
    })();
  }

  /* Loading bar */
  function updateLoadBar(n) {
    if (!progressFill || !pctEl) return;
    var barW = progressFill.parentElement.offsetWidth;
    if (!barW) return;
    var N = Math.max(1, Math.floor(barW / 14));
    var segW = barW / N;
    var whiteW = segW * (10 / 14);
    var visN = n >= 100 ? N : Math.floor(n * N / 100);
    progressFill.style.width = n >= 100 ? '100%' : (visN * segW) + 'px';
    progressFill.style.background =
      'repeating-linear-gradient(to right,' +
      ' rgba(255,255,255,0.95) 0px,' +
      ' rgba(255,255,255,0.95) ' + whiteW + 'px,' +
      ' transparent ' + whiteW + 'px,' +
      ' transparent ' + segW + 'px)';
    pctEl.textContent = n + '%';
  }
  updateLoadBar(0);

  loadTimer = setInterval(function () {
    loadN += Math.random() > 0.4 ? 3 : 2;
    if (loadN >= 100) { loadN = 100; clearInterval(loadTimer); }
    updateLoadBar(loadN);
  }, 42);

  /* Skip hint */
  var SKIP_KEY = 'galekto_vc';
  var vc = 0;
  try { vc = parseInt(localStorage.getItem(SKIP_KEY) || '0', 10) || 0; } catch (e) {}
  vc++;
  try { localStorage.setItem(SKIP_KEY, String(vc)); } catch (e) {}
  var showSkip = vc >= 2;

  function skipKeyHandler(e) {
    if (e.key === ' ' || e.key === 'Escape') { e.preventDefault(); skipPreloader(); }
  }
  function skipPreloader() {
    if (skipped) return;
    skipped = true;
    document.removeEventListener('keydown', skipKeyHandler);
    if (preloader) preloader.removeEventListener('click', skipPreloader);
    clearInterval(loadTimer);
    clearTimeout(biosTimer);
    if (grainRaf) cancelAnimationFrame(grainRaf);
    if (glitchRaf) cancelAnimationFrame(glitchRaf);
    if (shakeTimer) { clearInterval(shakeTimer); shakeTimer = null; }
    if (tvInner) tvInner.style.transform = '';
    if (preloader) {
      preloader.style.transition = 'opacity 0.3s ease';
      preloader.style.opacity = '0';
      setTimeout(function () {
        if (preloader) preloader.style.visibility = 'hidden';
        revealPage();
      }, 320);
    } else {
      revealPage();
    }
  }

  if (showSkip) {
    document.addEventListener('keydown', skipKeyHandler);
    if (preloader) preloader.addEventListener('click', skipPreloader);
    var isMobile = window.matchMedia('(pointer: coarse)').matches;
    var hintDelay = isMobile ? 800 : 1100;
    setTimeout(function () {
      if (skipped || !skipHint) return;
      skipHint.classList.add('is-visible');
      if (isMobile) {
        setTimeout(function () { if (!skipped) skipHint.classList.add('is-pulsing'); }, 700);
      }
    }, hintDelay);
  }

  /* Reveal page */
  function revealPage() {
    document.body.classList.remove('boot-pending');
    var pSection = document.getElementById('portraitSection');
    var nSection = document.getElementById('nameSection');
    var sLeft = document.getElementById('sideLeft');
    var sRight = document.getElementById('sideRight');

    if (nSection) { nSection.style.animation = 'none'; nSection.style.opacity = '0'; }
    if (sLeft) { sLeft.style.animation = 'none'; sLeft.style.opacity = '0'; sLeft.style.transform = 'translateY(-50%) translateX(-180%)'; }
    if (sRight) { sRight.style.animation = 'none'; sRight.style.opacity = '0'; sRight.style.transform = 'translateY(-50%) translateX(180%)'; }
    if (pSection) {
      pSection.style.animation = 'none';
      pSection.style.opacity = '0';
      pSection.style.transform = 'translateX(-50%) translateY(0)';
      pSection.style.transition = 'none';
      var blinks = [
        [50,'1'],[105,'0'],[160,'1'],[215,'0'],[270,'1'],[325,'0'],[380,'1'],[435,'0'],
        [555,'1'],[675,'0'],[855,'1'],[1035,'0'],[1285,'1'],[1535,'0'],
        [2135,'1'],[2600,'0'],[3300,'1'],
      ];
      blinks.forEach(function (b) { setTimeout(function () { pSection.style.opacity = b[1]; }, b[0]); });
      setTimeout(function () {
        pSection.style.transition = 'opacity 0.6s ease';
        pSection.style.opacity = '1';
      }, 3400);
    }
    setTimeout(function () {
      if (nSection) { nSection.style.transition = 'opacity 1.3s ease'; nSection.style.opacity = '1'; }
    }, 4000);
    setTimeout(function () {
      [sLeft, sRight].forEach(function (el) {
        if (!el) return;
        requestAnimationFrame(function () { requestAnimationFrame(function () {
          el.style.transition = 'opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)';
          el.style.opacity = '1';
          el.style.transform = 'translateY(-50%) translateX(0)';
        }); });
      });
    }, 4900);
    setTimeout(function () {
      if (bgCanvas) { bgCanvas.style.transition = 'opacity 1.4s ease'; bgCanvas.style.opacity = '1'; }
      if (fluidCanvas) { fluidCanvas.style.transition = 'opacity 1.4s ease'; fluidCanvas.style.opacity = '1'; }
      if (illustCanvas) { illustCanvas.style.transition = 'opacity 1.4s ease'; illustCanvas.style.opacity = '1'; }
    }, 6000);
  }

  /* BIOS sequence */
  function runBiosSequence(container, onComplete) {
    var DSEP = '\u2550'.repeat(48);
    var SSEP = '\u2500'.repeat(40);

    [
      ['bios-line bios-line--empty', ''],
      ['bios-line bios-line--logo', 'THEFIRSTISTARI'],
      ['bios-line bios-line--logo-tag', 'SYSTEMS ENGINEER  \u25a0  v2026'],
      ['bios-line bios-line--empty', ''],
    ].forEach(function (c) {
      var r = document.createElement('div');
      r.className = c[0]; r.textContent = c[1];
      container.appendChild(r);
    });

    var hdrRow = document.createElement('div');
    hdrRow.className = 'bios-line bios-line--header';
    hdrRow.textContent = 'PORTFOLIO NEURAL BOOT SEQUENCE v1.0';
    container.appendChild(hdrRow);

    var sepRow = document.createElement('div');
    sepRow.className = 'bios-line bios-line--sep';
    sepRow.textContent = DSEP;
    container.appendChild(sepRow);

    var body = document.createElement('div');
    body.className = 'bios-terminal-body';
    container.appendChild(body);

    var lines = [
      [0,    'status', 'DEEP SIGNAL SCAN .......................', '[LOCKED]'],
      [80,   'status', 'GITHUB NETWORK LINK ....................', '[ESTABLISHED]'],
      [240,  'status', 'CREATIVE MATRIX ........................', '[ONLINE]'],
      [400,  'status', 'VISUAL CORTEX ..........................', '[SYNCHRONIZED]'],
      [560,  'status', 'NEURAL CANVAS ..........................', '[LOADED]'],
      [720,  'status', 'STYLE MATRIX ...........................', '[STABLE]'],
      [880,  'status', 'ARTWORK ENGINE .........................', '[ACTIVE]'],
      [1040, 'status', 'PROJECT GRID ...........................', '[MOUNTED]'],
      [1200, 'empty',  ''],
      [1360, 'section', 'SYSTEM DIAGNOSTICS'],
      [1520, 'sep',     SSEP],
      [1640, 'status', 'MEMORY BANK ............................', '[CLEAR]'],
      [1790, 'status', 'ERROR TRACE ............................', '[NONE]'],
      [1940, 'plain',   'LATENCY ................................ 0.01ms'],
      [2090, 'plain',   'CREATIVE POWER ......................... 99%'],
      [2240, 'status', 'IMAGINATION CORE .......................', '[FLOWING]'],
      [2400, 'empty',  ''],
      [2480, 'section', 'SUBSYSTEM INITIALIZATION'],
      [2560, 'sep',     SSEP],
      [2680, 'status', 'INSPIRATION ENGINE .....................', '[ACTIVE]'],
      [2830, 'status', 'IDEA GENERATOR .........................', '[GENERATING]'],
      [2980, 'status', 'VISUAL LIBRARY .........................', '[INDEXED]'],
      [3130, 'status', 'CONCEPT ARCHIVE ........................', '[SYNCED]'],
      [3280, 'status', 'REALITY DISTORTION MODULE .............', '[ENABLED]'],
      [3440, 'empty',  ''],
      [3520, 'section', 'IDENTITY PROTOCOL'],
      [3600, 'sep',     SSEP],
      [3720, 'status', 'CREATOR SIGNATURE ......................', '[VERIFIED]'],
      [3870, 'status', 'ACCESS LEVEL ...........................', '[OMEGA PRIME]'],
      [4020, 'status', 'NEURAL LINK ............................', '[STABLE]'],
      [4180, 'empty',  ''],
      [4260, 'sep',     DSEP],
      [4380, 'empty',  ''],
      [4460, 'access', 'GALACTIC CREATIVE SYSTEM READY'],
      [4620, 'empty',  ''],
      [4700, 'welcome', 'WELCOME, FRIEND'],
      [4860, 'empty',  ''],
      [4940, 'welcome', "IT'S ALWAYS NICE TO SEE YOU"],
      [5100, 'welcome', 'HAVE A NICE DAY'],
      [5180, 'enter',  'ENTERING THE PORTFOLIO...'],
      [5380, 'enter',  'EXPANDING CREATIVE UNIVERSE'],
    ];

    lines.forEach(function (l) {
      setTimeout(function () {
        var t = l[1], text = l[2], ok = l[3];
        var row = document.createElement('div');
        row.className = 'bios-line bios-line--' + (t === 'plain' ? 'status' : t);

        if (t === 'status') {
          var lbl = document.createElement('span');
          lbl.className = 'bl-label';
          lbl.textContent = text;
          var okSpan = document.createElement('span');
          okSpan.className = 'bl-ok';
          row.appendChild(lbl);
          row.appendChild(okSpan);
          body.appendChild(row);
          body.scrollTop = body.scrollHeight;
          setTimeout(function () { okSpan.textContent = ok; }, 200);
        } else if (t === 'enter' && text === 'EXPANDING CREATIVE UNIVERSE') {
          body.appendChild(row);
          var i = 0;
          var cursor = document.createElement('span');
          cursor.className = 'bios-cursor';
          row.appendChild(cursor);
          var typeNext = function () {
            if (i < text.length) {
              row.insertBefore(document.createTextNode(text[i++]), cursor);
              setTimeout(typeNext, 48);
            } else {
              cursor.remove();
              row.classList.add('is-blinking');
              setTimeout(onComplete, 1600);
            }
          };
          setTimeout(typeNext, 60);
        } else {
          row.textContent = text;
          body.appendChild(row);
          body.scrollTop = body.scrollHeight;
        }
      }, l[0]);
    });
  }

  /* At 3.3s — stop glitch, show BIOS */
  biosTimer = setTimeout(function () {
    if (glitchRaf) cancelAnimationFrame(glitchRaf);
    if (shakeTimer) { clearInterval(shakeTimer); shakeTimer = null; }
    if (tvInner) tvInner.style.transform = '';
    if (tvInner) {
      tvInner.style.transition = 'opacity 0.28s ease';
      tvInner.style.opacity = '0';
    }
    if (tvBios) {
      tvBios.classList.add('is-visible');
      runBiosSequence(tvBios, function () {
        if (skipped) return;
        if (preloader) {
          preloader.style.transition = 'opacity 0.5s ease';
          preloader.style.opacity = '0';
          setTimeout(function () { if (preloader) preloader.style.visibility = 'hidden'; }, 530);
        }
        setTimeout(revealPage, 700);
      });
    }
  }, 3300);

  initGrain();
  initGlitch();

})();