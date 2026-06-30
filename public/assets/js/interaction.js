/**
 * INTERACTION.JS — Cursor transform, fluid interaction
 * Optimized: use transform translate() for GPU compositing, no layout thrash.
 */
(function () {
  'use strict';

  var dot  = document.getElementById('cursorDot');
  var ring = document.getElementById('cursorRing');
  var slideGroup = document.getElementById('slideGroup');

  // Ring state (dot is set directly in mousemove)
  var targetRX = 0, targetRY = 0;
  var curRX = 0, curRY = 0;
  var RING_EASE = 0.35;

  // Restore from sessionStorage
  (function () {
    var mx = parseFloat(sessionStorage.getItem('mx') || '');
    var my = parseFloat(sessionStorage.getItem('my') || '');
    if (!isNaN(mx) && !isNaN(my)) {
      curRX = mx; curRY = my;
      if (dot)  { dot.style.transform  = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)'; }
      if (ring) { ring.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)'; }
    }
  })();

  // Idle tracking
  var isIdle = true;
  var idleTimer = null;
  var idleFluidTimer = 0;
  var isMobile = window.innerWidth < 768;

  var prevSmoothX = 0.5, prevSmoothY = 0.5;
  var smoothX = 0.5, smoothY = 0.5;
  var rawX = 0.5, rawY = 0.5;

  function tick(ts) {
    // Cursor ring lerp
    curRX += (targetRX - curRX) * RING_EASE;
    curRY += (targetRY - curRY) * RING_EASE;
    if (ring) {
      ring.style.transform = 'translate(' + curRX.toFixed(1) + 'px,' + curRY.toFixed(1) + 'px) translate(-50%,-50%)';
    }

    // Store for page transitions
    sessionStorage.setItem('mx', curRX.toFixed(1));
    sessionStorage.setItem('my', curRY.toFixed(1));

    // Fluid interaction
    if (window.FluidSim) {
      smoothX += (rawX - smoothX) * 0.08;
      smoothY += (rawY - smoothY) * 0.08;
      if (isIdle) {
        idleFluidTimer += 0.016;
        var cx = 0.5 + 0.32 * Math.cos(idleFluidTimer * 0.28 + 0.5);
        var cy = 0.38 + 0.30 * Math.sin(idleFluidTimer * 0.35 + 0.3);
        window.FluidSim.splat(cx, cy, cx - 0.5, cy - 0.38);
      } else {
        var dx = smoothX - prevSmoothX;
        var dy = smoothY - prevSmoothY;
        if (dx * dx + dy * dy > 0.0001) {
          window.FluidSim.splat(smoothX, smoothY, dx * 100, dy * 100);
        }
        prevSmoothX = smoothX;
        prevSmoothY = smoothY;
      }
    }

    requestAnimationFrame(tick);
  }

  /* ── mouse ── */
  function onMove(e) {
    var x = Math.round(e.clientX);
    var y = Math.round(e.clientY);
    targetRX = x;
    targetRY = y;
    rawX = e.clientX / window.innerWidth;
    rawY = 1 - e.clientY / window.innerHeight;

    // Dot: set immediately in mousemove using transform
    if (dot) {
      dot.style.transform = 'translate(' + x + 'px,' + y + 'px) translate(-50%,-50%)';
    }

    // Reset idle timer
    isIdle = false;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function () { isIdle = true; }, 3000);
  }

  document.addEventListener('mousemove', onMove, { passive: true });

  requestAnimationFrame(tick);
})();
