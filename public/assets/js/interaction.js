/**
 * FLUID IDLE — orbital ambient splats only. No cursor, no mouse interaction.
 */
(function () {
  'use strict';

  var t = 0;

  function tick() {
    t += 0.016;
    if (window.FluidSim) {
      var cx = 0.5 + 0.32 * Math.cos(t * 0.28 + 0.5);
      var cy = 0.38 + 0.30 * Math.sin(t * 0.35 + 0.3);
      window.FluidSim.splat(cx, cy, cx - 0.5, cy - 0.38);
    }
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();
