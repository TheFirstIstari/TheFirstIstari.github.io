/**
 * CRT.JS — CRT barrel shape + bevel + stroke
 * Matches galekto.com implementation.
 */
(function () {
  'use strict';

  function setCRTShape() {
    var W = window.innerWidth, H = window.innerHeight;
    if (!W || !H) return;

    var m = W <= 768 ? 12 : 38;
    var mm = W <= 768 ? 4 : 8;
    var R = W <= 768
      ? Math.min(Math.max(18, W * 0.03), 28)
      : Math.min(Math.max(40, W * 0.042), 70);

    // Inner barrel shape path
    var i = [
      'M ' + (m + R) + ',' + m,
      'Q ' + (W / 2) + ',' + mm + ' ' + (W - m - R) + ',' + m,
      'Q ' + (W - m) + ',' + m + ' ' + (W - m) + ',' + (m + R),
      'Q ' + (W - mm) + ',' + (H / 2) + ' ' + (W - m) + ',' + (H - m - R),
      'Q ' + (W - m) + ',' + (H - m) + ' ' + (W - m - R) + ',' + (H - m),
      'Q ' + (W / 2) + ',' + (H - mm) + ' ' + (m + R) + ',' + (H - m),
      'Q ' + m + ',' + (H - m) + ' ' + m + ',' + (H - m - R),
      'Q ' + mm + ',' + (H / 2) + ' ' + m + ',' + (m + R),
      'Q ' + m + ',' + m + ' ' + (m + R) + ',' + m,
      'Z'
    ].join(' ');

    // Outer rect
    var o = 'M 0,0 L ' + W + ',0 L ' + W + ',' + H + ' L 0,' + H + ' Z';

    var frame = document.querySelector('.page-tv-frame');
    var bevel = document.querySelector('.page-crt-bevel');
    var stroke = document.querySelector('.page-tv-stroke');

    if (frame) {
      frame.style.clipPath = "path(evenodd, '" + o + ' ' + i + "')";
      frame.style.visibility = 'visible';
    }

    if (bevel) {
      bevel.style.clipPath = "path('" + i + "')";
    }

    if (stroke) {
      stroke.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      stroke.style.clipPath = "path('" + i + "')";
      stroke.innerHTML = '';
      var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', i);
      p.setAttribute('fill', 'none');
      p.setAttribute('stroke', 'rgba(30,28,26,0.10)');
      p.setAttribute('stroke-width', '6');
      stroke.appendChild(p);
    }
  }

  window.addEventListener('resize', setCRTShape);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      requestAnimationFrame(function () { requestAnimationFrame(setCRTShape); });
    });
  } else {
    requestAnimationFrame(function () { requestAnimationFrame(setCRTShape); });
  }

  if (window.screen && window.screen.orientation) {
    window.screen.orientation.addEventListener('change', function () {
      setTimeout(setCRTShape, 300);
    });
  }

  window.setCRTShape = setCRTShape;
})();