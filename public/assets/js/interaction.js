/**
 * INTERACTION.JS — Cursor lerp, fluid interaction, parallax
 * Matches galekto.com main.js interaction layer.
 */
(function () {
  'use strict';

  var cursorDot = document.getElementById('cursorDot');
  var cursorRing = document.getElementById('cursorRing');
  var nameDisplay = document.getElementById('nameDisplay');
  var sideLeft = document.getElementById('sideLeft');
  var sideRight = document.getElementById('sideRight');
  var slideGroup = document.getElementById('slideGroup');

  var MOUSE_EASE = 0.08;
  var RING_EASE = 0.12;
  var SLIDE_EASE = 0.045;
  var SLIDE_PX = 250;

  var rawX = 0.5, rawY = 0.5;
  var smoothX = 0.5, smoothY = 0.5;
  var rawRingX = -200, rawRingY = -200;
  var mouseX = -200, mouseY = -200;

  // Restore cursor position from sessionStorage (page transitions)
  (function () {
    var mx = parseFloat(sessionStorage.getItem('mx') || '');
    var my = parseFloat(sessionStorage.getItem('my') || '');
    if (!isNaN(mx) && !isNaN(my)) {
      mouseX = mx; mouseY = my;
      rawRingX = mx; rawRingY = my;
    }
  })();

  var isIdle = true;
  var idleTimer = null;
  var prevMX = 0, prevMY = 0;
  var idleFluidTimer = 0;
  var isMobile = window.innerWidth < 768;

  function lerp(a, b, t) { return a + (b - a) * t; }

  /* ── MOUSE TRACKING ───────────────────────────────────── */
  function onMouseMove(e) {
    var x = e.clientX / window.innerWidth;
    var y = 1 - e.clientY / window.innerHeight;
    rawX = x;
    rawY = y;
    rawRingX = e.clientX;
    rawRingY = e.clientY;

    if (isIdle) {
      isIdle = false;
      if (idleTimer) { clearTimeout(idleTimer); idleTimer = null; }
    }
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function () {
      isIdle = true;
    }, 3000);
  }

  function onTouchMove(e) {
    var t = e.touches[0];
    if (!t) return;
    rawRingX = t.clientX;
    rawRingY = t.clientY;
  }

  document.addEventListener('mousemove', onMouseMove, { passive: true });
  document.addEventListener('touchmove', onTouchMove, { passive: true });

  /* ── IDLE ORBITAL SPLATS ──────────────────────────────── */
  function getIdleMask(t) {
    var cx = 0.5 + 0.32 * Math.cos(t * 0.28 + 0.5);
    var cy = 0.38 + 0.30 * Math.sin(t * 0.35 + 0.3);
    return { x: cx, y: cy };
  }

  /* ── RENDER LOOP ───────────────────────────────────────────────── */
  var lastTs = 0;
  var prevSmoothX = 0.5, prevSmoothY = 0.5;

  function tick(ts) {
    var dt = lastTs ? Math.min((ts - lastTs) / 1000, 0.05) : 0.016;
    lastTs = ts;

    // Cursor position smoothing
    smoothX = lerp(smoothX, rawX, MOUSE_EASE);
    smoothY = lerp(smoothY, rawY, MOUSE_EASE);

    // Cursor dot + ring
    mouseX = lerp(mouseX, rawRingX, RING_EASE);
    mouseY = lerp(mouseY, rawRingY, RING_EASE);

    // Store for page transitions
    sessionStorage.setItem('mx', mouseX.toFixed(1));
    sessionStorage.setItem('my', mouseY.toFixed(1));

    if (cursorDot) {
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    }
    if (cursorRing) {
      cursorRing.style.left = mouseX + 'px';
      cursorRing.style.top = mouseY + 'px';
    }

    // Fluid interaction
    if (window.FluidSim) {
      if (isIdle) {
        var idle = getIdleMask(idleFluidTimer);
        idleFluidTimer += dt;
        window.FluidSim.splat(idle.x, idle.y, 0.003, 0.002);
      } else {
        var dx = smoothX - prevSmoothX;
        var dy = smoothY - prevSmoothY;
        var mag = dx * dx + dy * dy;
        if (mag > 0.0001) {
          window.FluidSim.splat(smoothX, smoothY, dx * 40, dy * 40);
        }
        prevSmoothX = smoothX;
        prevSmoothY = smoothY;
      }
    }

    // Slide group parallax
    if (slideGroup && !isMobile) {
      var ox = (smoothX - 0.5) * SLIDE_PX;
      var oy = (smoothY - 0.5) * SLIDE_PX;
      slideGroup.style.transform = 'translate(' + ox + 'px,' + oy + 'px)';
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();
