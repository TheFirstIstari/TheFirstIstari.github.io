/**
 * CRT.JS — CRT barrel shape + stroke SVG
 * Calculates the barrel clip-path for the TV frame and draws the inner stroke SVG.
 */
(function () {
  'use strict';

  function setCRTShape() {
    var frame = document.querySelector('.page-tv-frame');
    if (!frame) return;
    var W = window.innerWidth, H = window.innerHeight;
    if (!W || !H) return;

    var M = window.innerWidth <= 768 ? 12 : 38;
    var R = Math.min(Math.max(40, W * 0.042), 70);

    var path = [
      'M ' + (M + R) + ',' + M,
      'Q ' + (W / 2) + ',0 ' + (W - M - R) + ',' + M,
      'Q ' + (W - M) + ',' + M + ' ' + (W - M) + ',' + (M + R),
      'Q ' + W + ',' + (H / 2) + ' ' + (W - M) + ',' + (H - M - R),
      'Q ' + (W - M) + ',' + (H - M) + ' ' + (W - M - R) + ',' + (H - M),
      'Q ' + (W / 2) + ',' + H + ' ' + (M + R) + ',' + (H - M),
      'Q ' + M + ',' + (H - M) + ' ' + M + ',' + (H - M - R),
      'Q 0,' + (H / 2) + ' ' + M + ',' + (M + R),
      'Q ' + M + ',' + M + ' ' + (M + R) + ',' + M,
      'Z'
    ].join(' ');

    // Set frame clip-path
    frame.style.clipPath = 'path(\'' + path + '\')';
    frame.style.visibility = 'visible';

    // Update the inner stroke SVG
    var stroke = document.getElementById('tvStrokeSvg');
    if (stroke) {
      stroke.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      var strokePath = stroke.querySelector('path');
      if (strokePath) {
        strokePath.setAttribute('d', path);
      }
    }
  }

  window.addEventListener('resize', setCRTShape);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      requestAnimationFrame(function() {
        requestAnimationFrame(setCRTShape);
      });
    });
  } else {
    requestAnimationFrame(function() {
      requestAnimationFrame(setCRTShape);
    });
  }

  // Also re-apply on orientation change
  if (window.screen && window.screen.orientation) {
    window.screen.orientation.addEventListener('change', function() {
      setTimeout(setCRTShape, 300);
    });
  }

  window.setCRTShape = setCRTShape;
})();
