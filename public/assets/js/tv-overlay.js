/**
 * TV-OVERLAY.JS — Page CRT overlay grain animation
 * Creates subtle analog noise on the page TV overlay.
 * galekto.com style: fixed canvas, pixelated grain, low opacity.
 */
(function () {
  'use strict';

  var canvas = document.getElementById('pageGrainCanvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var W, H, running = true;

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
  }

  window.addEventListener('resize', resize);
  resize();

  var imgData = ctx.createImageData(W, H);
  var data = imgData.data;
  var len = data.length;

  function drawGrain() {
    if (!running) return;
    for (var i = 0; i < len; i += 4) {
      var v = Math.random() * 255 | 0;
      data[i] = data[i + 1] = data[i + 2] = v;
      data[i + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);
    requestAnimationFrame(drawGrain);
  }

  // Throttle to every other frame — 30fps grain is fine
  var throttled = false;
  function drawGrainThrottled() {
    if (!running) return;
    throttled = !throttled;
    if (throttled) { requestAnimationFrame(drawGrainThrottled); return; }
    for (var i = 0; i < len; i += 4) {
      var v = Math.random() * 255 | 0;
      data[i] = data[i + 1] = data[i + 2] = v;
      data[i + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);
    requestAnimationFrame(drawGrainThrottled);
  }

  drawGrainThrottled();
})();