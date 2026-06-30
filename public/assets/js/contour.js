/**
 * CONTOUR.JS — Topographic contour line background
 * Marching squares algorithm over animated height fields.
 * Lightweight 2D canvas implementation.
 */
(function () {
  'use strict';

  var canvas, ctx;
  var hGrid;
  var bgTime = 0;
  var lastTs = 0;
  var isMobile = window.innerWidth < 768;
  var mobileDrawn = false;

  /* ── CONTOUR PEAKS ── */
  var PEAKS = [
    [0.20,0.40,0.22,0.28,1.00],
    [0.72,0.28,0.26,0.30,1.00],
    [0.48,0.72,0.24,0.20,0.90],
    [0.05,0.60,0.18,0.24,0.80],
    [0.92,0.55,0.20,0.26,0.80],
    [0.38,0.05,0.22,0.18,0.70],
    [0.75,0.90,0.20,0.22,0.70],
    [0.15,0.92,0.18,0.20,0.60],
    [0.46,0.34,0.14,0.18,0.50],
  ];

  /* ── RESIZE ── */
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    isMobile = window.innerWidth < 768;
    mobileDrawn = false;
  }

  /* ── DRAW ── */
  function draw(dt) {
    if (!ctx || !canvas) return;
    if (isMobile) {
      if (mobileDrawn) return;
      mobileDrawn = true;
    }

    bgTime += dt;
    var W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    var GW = isMobile ? 60 : 140;
    var GH = isMobile ? 40 : 100;
    var GW1 = GW + 1;
    var total = GW1 * (GH + 1);
    if (!hGrid || hGrid.length !== total) hGrid = new Float32Array(total);

    var cellW = W / GW, cellH = H / GH;
    var bs = bgTime * 0.5;

    // Height field
    for (var row = 0; row <= GH; row++) {
      var ny = row / GH, base = row * GW1;
      for (var col = 0; col <= GW; col++) {
        var nx = col / GW;
        var h = 0;
        for (var p = 0; p < PEAKS.length; p++) {
          var pk = PEAKS[p];
          var driftX = 0.014 * Math.sin(bs * 0.08 + p * 2.1);
          var driftY = 0.010 * Math.cos(bs * 0.10 + p * 1.7);
          var amp = pk[4] * (1.0 + 0.18 * Math.sin(bs * 0.28 + p * 0.9));
          var dx = (nx - pk[0] - driftX) / pk[2];
          var dy = (ny - pk[1] - driftY) / pk[3];
          h += amp * Math.exp(-0.5 * (dx*dx + dy*dy));
        }
        hGrid[base + col] = h;
      }
    }

    // Marching squares
    var lvMin = 0.22, lvMax = 2.58, nL = 14;
    var spacing = (lvMax - lvMin) / (nL - 1);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    for (var li = 0; li < nL; li++) {
      var lv = lvMin + li * spacing;
      var isIdx = (li % 4 === 0);
      var bA = isIdx ? 0.42 : 0.17;

      ctx.beginPath();
      ctx.lineWidth = isIdx ? 1.4 : 0.65;
      ctx.strokeStyle = isIdx
        ? 'rgba(160,115,20,' + bA.toFixed(3) + ')'
        : 'rgba(140,100,16,' + (bA * 0.65).toFixed(3) + ')';

      for (var row = 0; row < GH; row++) {
        var r0 = row * GW1, r1 = (row + 1) * GW1;
        var y0 = row * cellH, y1 = y0 + cellH;

        for (var col = 0; col < GW; col++) {
          var h00 = hGrid[r0 + col], h10 = hGrid[r0 + col + 1];
          var h01 = hGrid[r1 + col], h11 = hGrid[r1 + col + 1];

          var b0 = h00 > lv ? 1 : 0, b1 = h10 > lv ? 1 : 0;
          var b2 = h11 > lv ? 1 : 0, b3 = h01 > lv ? 1 : 0;
          var mc = b0 | (b1 << 1) | (b2 << 2) | (b3 << 3);
          if (mc === 0 || mc === 15) continue;

          var x0 = col * cellW, x1 = x0 + cellW;

          switch (mc) {
            case 1: case 14: {
              var tT=(lv-h00)/(h10-h00), tL=(lv-h00)/(h01-h00);
              ctx.moveTo(x0+tT*cellW,y0); ctx.lineTo(x0,y0+tL*cellH); break;
            }
            case 2: case 13: {
              var tT=(lv-h00)/(h10-h00), tR=(lv-h10)/(h11-h10);
              ctx.moveTo(x0+tT*cellW,y0); ctx.lineTo(x1,y0+tR*cellH); break;
            }
            case 3: case 12: {
              var tL=(lv-h00)/(h01-h00), tR=(lv-h10)/(h11-h10);
              ctx.moveTo(x0,y0+tL*cellH); ctx.lineTo(x1,y0+tR*cellH); break;
            }
            case 4: case 11: {
              var tR=(lv-h10)/(h11-h10), tB=(lv-h01)/(h11-h01);
              ctx.moveTo(x1,y0+tR*cellH); ctx.lineTo(x0+tB*cellW,y1); break;
            }
            case 5: {
              var tT=(lv-h00)/(h10-h00), tL=(lv-h00)/(h01-h00);
              var tR=(lv-h10)/(h11-h10), tB=(lv-h01)/(h11-h01);
              ctx.moveTo(x0+tT*cellW,y0); ctx.lineTo(x0,y0+tL*cellH);
              ctx.moveTo(x1,y0+tR*cellH); ctx.lineTo(x0+tB*cellW,y1); break;
            }
            case 6: case 9: {
              var tT=(lv-h00)/(h10-h00), tB=(lv-h01)/(h11-h01);
              ctx.moveTo(x0+tT*cellW,y0); ctx.lineTo(x0+tB*cellW,y1); break;
            }
            case 7: case 8: {
              var tL=(lv-h00)/(h01-h00), tB=(lv-h01)/(h11-h01);
              ctx.moveTo(x0,y0+tL*cellH); ctx.lineTo(x0+tB*cellW,y1); break;
            }
            case 10: {
              var tT=(lv-h00)/(h10-h00), tR=(lv-h10)/(h11-h10);
              var tL=(lv-h00)/(h01-h00), tB=(lv-h01)/(h11-h01);
              ctx.moveTo(x0+tT*cellW,y0); ctx.lineTo(x1,y0+tR*cellH);
              ctx.moveTo(x0,y0+tL*cellH); ctx.lineTo(x0+tB*cellW,y1); break;
            }
          }
        }
      }
      ctx.stroke();
    }
  }

  /* ── LOOP ── */
  function loop(ts) {
    var dt = lastTs ? Math.min((ts - lastTs) / 1000, 0.05) : 0.016;
    lastTs = ts;
    draw(dt);
    requestAnimationFrame(loop);
  }

  /* ── RESIZE HANDLER ── */
  window.addEventListener('resize', resize);

  /* ── INIT ── */
  function init() {
    canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resize();
    requestAnimationFrame(loop);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
