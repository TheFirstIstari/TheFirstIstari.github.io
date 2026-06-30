(function () {
  'use strict';

  /* ---------------------------------------------------------------
   *  WebGL Fluid Simulation — adapted from PavelDoGreat's MIT-licensed
   *  WebGL-Fluid-Simulation (https://github.com/PavelDoGreat/WebGL-Fluid-Simulation)
   * --------------------------------------------------------------- */

  var SIM_RES      = 128;
  var DYE_RES      = 512;
  var DENSITY_DISS = 0.98;
  var VELOCITY_DISS = 0.995;
  var PRESSURE_ITER = 20;
  var CURL_STRENGTH = 25;
  var SPLAT_RADIUS  = 0.25;
  var SPLAT_FORCE   = 6000;

  /* ---------- helpers ---------- */

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  function lerp(a, b, t) { return a + (b - a) * t; }

  function pHash(x, y) {
    /* simple 2D-to-3D hash for pseudo-random splat hue */
    var h = x * 374761393 + y * 668265263;
    h = (h ^ (h >> 13)) * 1274126177;
    return (h ^ (h >> 16)) & 0xffffffff;
  }

  /* ---------- canvas & gl ---------- */

  var canvas = document.createElement('canvas');
  canvas.id = 'fluidCanvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.zIndex = '-1';
  canvas.style.pointerEvents = 'none';
  document.body.insertBefore(canvas, document.body.firstChild);

  var gl = canvas.getContext('webgl', { alpha: true, antialias: false, depth: false, stencil: false });
  if (!gl) { console.error('WebGL not available'); return; }

  var ext = gl.getExtension('OES_texture_half_float');
  if (!ext) { console.error('OES_texture_half_float required'); return; }

  var halfFloat = ext.HALF_FLOAT_OES;
  var supportLinear = gl.getExtension('OES_texture_half_float_linear');

  /* ---------- shader helpers ---------- */

  function compileShader(src, type) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(s));
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  function createProgram(vSrc, fSrc) {
    var vs = compileShader(vSrc, gl.VERTEX_SHADER);
    var fs = compileShader(fSrc, gl.FRAGMENT_SHADER);
    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog));
      return null;
    }
    return prog;
  }

  function getUniforms(prog) {
    var u = {};
    var n = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS);
    for (var i = 0; i < n; i++) {
      var info = gl.getActiveUniform(prog, i);
      u[info.name] = gl.getUniformLocation(prog, info.name);
    }
    return u;
  }

  /* ---------- shader sources ---------- */

  var VERT = [
    'precision highp float;',
    'attribute vec2 aPosition;',
    'varying vec2 vUv;',
    'void main() {',
    '  vUv = 0.5 * (aPosition + 1.0);',
    '  gl_Position = vec4(aPosition, 0.0, 1.0);',
    '}',
  ].join('\n');

  var FS_CLEAR = [
    'precision highp float;',
    'precision highp float;',
    'uniform sampler2D uTexture;',
    'uniform float uValue;',
    'varying vec2 vUv;',
    'void main() {',
    '  gl_FragColor = vec4(uValue * texture2D(uTexture, vUv).xyz, 1.0);',
    '}',
  ].join('\n');

  var FS_SPLAT = [
    'precision highp float;',
    'uniform vec2 uPoint;',
    'uniform vec2 uTarget;',
    'uniform float uRadius;',
    'uniform float uForce;',
    'varying vec2 vUv;',
    'void main() {',
    '  vec2 dx = vUv - uPoint;',
    '  float dist = length(dx);',
    '  if (dist > uRadius) { gl_FragColor = vec4(0.0); return; }',
    '  float fall = 1.0 - dist / uRadius;',
    '  vec2 imp = uTarget * fall * fall * uForce;',
    '  gl_FragColor = vec4(imp.x, imp.y, 0.0, 1.0);',
    '}',
  ].join('\n');

  var FS_ADVECT = [
    'precision highp float;',
    'uniform sampler2D uVelocity;',
    'uniform sampler2D uSource;',
    'uniform vec2 uTexelSize;',
    'uniform float uDt;',
    'uniform float uDissipation;',
    'varying vec2 vUv;',
    'void main() {',
    '  vec2 vel = texture2D(uVelocity, vUv).xy;',
    '  vec2 coord = vUv - uDt * vel * uTexelSize;',
    '  gl_FragColor = uDissipation * texture2D(uSource, coord);',
    '}',
  ].join('\n');

  var FS_DIVERGENCE = [
    'precision highp float;',
    'uniform sampler2D uVelocity;',
    'uniform vec2 uTexelSize;',
    'varying vec2 vUv;',
    'void main() {',
    '  vec2 t = uTexelSize;',
    '  float vl = texture2D(uVelocity, vUv - vec2(t.x, 0.0)).x;',
    '  float vr = texture2D(uVelocity, vUv + vec2(t.x, 0.0)).x;',
    '  float vb = texture2D(uVelocity, vUv - vec2(0.0, t.y)).y;',
    '  float vt = texture2D(uVelocity, vUv + vec2(0.0, t.y)).y;',
    '  gl_FragColor = vec4(0.5 * (vr - vl + vt - vb), 0.0, 0.0, 1.0);',
    '}',
  ].join('\n');

  var FS_CURL = [
    'precision highp float;',
    'uniform sampler2D uVelocity;',
    'uniform vec2 uTexelSize;',
    'uniform float uCurl;',
    'varying vec2 vUv;',
    'void main() {',
    '  vec2 t = uTexelSize;',
    '  float vl = texture2D(uVelocity, vUv - vec2(t.x, 0.0)).y;',
    '  float vr = texture2D(uVelocity, vUv + vec2(t.x, 0.0)).y;',
    '  float vb = texture2D(uVelocity, vUv - vec2(0.0, t.y)).x;',
    '  float vt = texture2D(uVelocity, vUv + vec2(0.0, t.y)).x;',
    '  float curl = vr - vl - vt + vb;',
    '  gl_FragColor = vec4(uCurl * curl, 0.0, 0.0, 1.0);',
    '}',
  ].join('\n');

  var FS_VORTICITY = [
    'precision highp float;',
    'uniform sampler2D uVelocity;',
    'uniform sampler2D uCurl;',
    'uniform vec2 uTexelSize;',
    'uniform float uDt;',
    'varying vec2 vUv;',
    'void main() {',
    '  vec2 t = uTexelSize;',
    '  float cl = texture2D(uCurl, vUv - vec2(t.x, 0.0)).x;',
    '  float cr = texture2D(uCurl, vUv + vec2(t.x, 0.0)).x;',
    '  float cb = texture2D(uCurl, vUv - vec2(0.0, t.y)).x;',
    '  float ct = texture2D(uCurl, vUv + vec2(0.0, t.y)).x;',
    '  float c = texture2D(uCurl, vUv).x;',
    '  vec2 grad = vec2(cr - cl, ct - cb);',
    '  float glen = length(grad);',
    '  if (glen < 0.001) { gl_FragColor = vec4(0.0); return; }',
    '  vec2 force = normalize(grad) * uDt * c;',
    '  gl_FragColor = vec4(force, 0.0, 1.0);',
    '}',
  ].join('\n');

  var FS_PRESSURE = [
    'precision highp float;',
    'uniform sampler2D uPressure;',
    'uniform sampler2D uDivergence;',
    'uniform vec2 uTexelSize;',
    'varying vec2 vUv;',
    'void main() {',
    '  vec2 t = uTexelSize;',
    '  float pl = texture2D(uPressure, vUv - vec2(t.x, 0.0)).x;',
    '  float pr = texture2D(uPressure, vUv + vec2(t.x, 0.0)).x;',
    '  float pb = texture2D(uPressure, vUv - vec2(0.0, t.y)).x;',
    '  float pt = texture2D(uPressure, vUv + vec2(0.0, t.y)).x;',
    '  float div = texture2D(uDivergence, vUv).x;',
    '  float p = (pl + pr + pb + pt - div) * 0.25;',
    '  gl_FragColor = vec4(p, 0.0, 0.0, 1.0);',
    '}',
  ].join('\n');

  var FS_GRADIENT = [
    'precision highp float;',
    'uniform sampler2D uPressure;',
    'uniform sampler2D uVelocity;',
    'uniform vec2 uTexelSize;',
    'varying vec2 vUv;',
    'void main() {',
    '  vec2 t = uTexelSize;',
    '  float pl = texture2D(uPressure, vUv - vec2(t.x, 0.0)).x;',
    '  float pr = texture2D(uPressure, vUv + vec2(t.x, 0.0)).x;',
    '  float pb = texture2D(uPressure, vUv - vec2(0.0, t.y)).x;',
    '  float pt = texture2D(uPressure, vUv + vec2(0.0, t.y)).x;',
    '  vec2 vel = texture2D(uVelocity, vUv).xy;',
    '  vec2 grad = vec2(pr - pl, pt - pb);',
    '  gl_FragColor = vec4(vel - grad, 0.0, 1.0);',
    '}',
  ].join('\n');

  var FS_DISPLAY = [
    'precision highp float;',
    'uniform sampler2D uTexture;',
    'varying vec2 vUv;',
    'void main() {',
    '  float a = texture2D(uTexture, vUv).x;',
    '  float gray = 0.76;',
    '  gl_FragColor = vec4(gray, gray, gray, clamp(a * 0.8, 0.0, 1.0));',
    '}',
  ].join('\n');

  /* 0.76 ≈ 194/255 */

  /* ---------- full-screen quad ---------- */

  var quadBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

  var quadProgram = createProgram(VERT, FS_CLEAR);
  var quadAttrib  = gl.getAttribLocation(quadProgram, 'aPosition');
  var quadUni     = getUniforms(quadProgram);

  /* ---------- programs ---------- */

  var programs = {};
  var progNames = ['splat','advect','divergence','curl','vorticity','pressure','gradient','display'];
  var progSrcs = [FS_SPLAT, FS_ADVECT, FS_DIVERGENCE, FS_CURL, FS_VORTICITY, FS_PRESSURE, FS_GRADIENT, FS_DISPLAY];
  for (var pi = 0; pi < progNames.length; pi++) {
    var p = createProgram(VERT, progSrcs[pi]);
    programs[progNames[pi]] = {
      program: p,
      attrib:  gl.getAttribLocation(p, 'aPosition'),
      uniforms: getUniforms(p),
    };
  }

  gl.useProgram(programs.display.program);

  /* ---------- FBO helpers ---------- */

  function createFBO(w, h, internal, format, type, param) {
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param || gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param || gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, type, null);

    var fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return { fbo: fbo, tex: tex, w: w, h: h };
  }

  function createDoubleFBO(w, h, internal, format, type, param) {
    var a = createFBO(w, h, internal, format, type, param);
    var b = createFBO(w, h, internal, format, type, param);
    return { read: a, write: b, swap: function () { var t = a; a = b; b = t; this.read = a; this.write = b; } };
  }

  function blit(src, dest) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, dest.fbo);
    gl.bindTexture(gl.TEXTURE_2D, src.tex);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  function blitValue(src, dest, val) {
    gl.useProgram(quadProgram);
    gl.uniform1f(quadUni.uValue, val);
    gl.bindFramebuffer(gl.FRAMEBUFFER, dest.fbo);
    gl.bindTexture(gl.TEXTURE_2D, src.tex);
    gl.uniform1i(quadUni.uTexture, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.useProgram(programs.display.program);
  }

  /* ---------- simulation buffers ---------- */

  var texType   = halfFloat;
  var rgba      = gl.RGBA;
  var floatLinear = supportLinear ? gl.LINEAR : gl.NEAREST;

  var dye    = createDoubleFBO(DYE_RES, DYE_RES, rgba, rgba, texType, floatLinear);
  var vel    = createDoubleFBO(SIM_RES, SIM_RES, rgba, rgba, texType, floatLinear);
  var curl   = createFBO(SIM_RES, SIM_RES, rgba, rgba, texType, floatLinear);
  var div    = createFBO(SIM_RES, SIM_RES, rgba, rgba, texType, floatLinear);
  var pressure = createDoubleFBO(SIM_RES, SIM_RES, rgba, rgba, texType, floatLinear);

  /* ---------- bg image overlay ---------- */

  var bgTexture = null;
  function setBgImage(url) {
    if (bgTexture) { gl.deleteTexture(bgTexture); bgTexture = null; }
    if (!url) return;
    var img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function () {
      bgTexture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, bgTexture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.bindTexture(gl.TEXTURE_2D, null);
    };
    img.src = url;
  }

  /* ---------- resize ---------- */

  function resize() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    canvas.width  = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
  }
  window.addEventListener('resize', resize);

  /* ---------- simulation steps ---------- */

  function step(mouse) {
    var dt = Math.min(mouse.dx * mouse.dx + mouse.dy * mouse.dy, 0.015);

    /* splat */
    if (mouse.down) {
      var splatProg = programs.splat;
      gl.useProgram(splatProg.program);
      gl.uniform2f(splatProg.uniforms.uPoint,  mouse.x / canvas.width, 1 - mouse.y / canvas.height);
      gl.uniform2f(splatProg.uniforms.uTarget, mouse.dx * SPLAT_FORCE, -mouse.dy * SPLAT_FORCE);
      gl.uniform1f(splatProg.uniforms.uRadius, SPLAT_RADIUS);
      /* splat into velocity */
      gl.bindFramebuffer(gl.FRAMEBUFFER, vel.write.fbo);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      /* splat into dye */
      gl.uniform1f(splatProg.uniforms.uRadius, SPLAT_RADIUS * 2.0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, dye.write.fbo);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      vel.swap();
      dye.swap();
      mouse.down = false;
    }

    var texelSizeSim  = [1 / SIM_RES, 1 / SIM_RES];
    var texelSizeDye  = [1 / DYE_RES, 1 / DYE_RES];

    /* advect velocity */
    var advProg = programs.advect;
    gl.useProgram(advProg.program);
    gl.uniform1f(advProg.uniforms.uDt, dt);
    gl.uniform1f(advProg.uniforms.uDissipation, VELOCITY_DISS);
    gl.uniform2fv(advProg.uniforms.uTexelSize, texelSizeSim);
    gl.uniform1i(advProg.uniforms.uVelocity, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, vel.read.tex);
    gl.uniform1i(advProg.uniforms.uSource, 1);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, vel.read.tex);
    gl.bindFramebuffer(gl.FRAMEBUFFER, vel.write.fbo);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    vel.swap();

    /* curl */
    var curlProg = programs.curl;
    gl.useProgram(curlProg.program);
    gl.uniform2fv(curlProg.uniforms.uTexelSize, texelSizeSim);
    gl.uniform1f(curlProg.uniforms.uCurl, CURL_STRENGTH);
    gl.uniform1i(curlProg.uniforms.uVelocity, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, vel.read.tex);
    gl.bindFramebuffer(gl.FRAMEBUFFER, curl.fbo);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    /* vorticity force */
    var vortProg = programs.vorticity;
    gl.useProgram(vortProg.program);
    gl.uniform2fv(vortProg.uniforms.uTexelSize, texelSizeSim);
    gl.uniform1f(vortProg.uniforms.uDt, dt);
    gl.uniform1i(vortProg.uniforms.uVelocity, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, vel.read.tex);
    gl.uniform1i(vortProg.uniforms.uCurl, 1);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, curl.tex);
    gl.bindFramebuffer(gl.FRAMEBUFFER, vel.write.fbo);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    vel.swap();

    /* divergence */
    var divProg = programs.divergence;
    gl.useProgram(divProg.program);
    gl.uniform2fv(divProg.uniforms.uTexelSize, texelSizeSim);
    gl.uniform1i(divProg.uniforms.uVelocity, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, vel.read.tex);
    gl.bindFramebuffer(gl.FRAMEBUFFER, div.fbo);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    /* clear pressure */
    blitValue(pressure.read, pressure.write, 0);
    pressure.swap();

    /* pressure solve */
    var pressProg = programs.pressure;
    gl.useProgram(pressProg.program);
    gl.uniform2fv(pressProg.uniforms.uTexelSize, texelSizeSim);
    gl.uniform1i(pressProg.uniforms.uDivergence, 1);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, div.tex);
    for (var i = 0; i < PRESSURE_ITER; i++) {
      gl.uniform1i(pressProg.uniforms.uPressure, 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, pressure.read.tex);
      gl.bindFramebuffer(gl.FRAMEBUFFER, pressure.write.fbo);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      pressure.swap();
    }

    /* gradient subtract */
    var gradProg = programs.gradient;
    gl.useProgram(gradProg.program);
    gl.uniform2fv(gradProg.uniforms.uTexelSize, texelSizeSim);
    gl.uniform1i(gradProg.uniforms.uPressure, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, pressure.read.tex);
    gl.uniform1i(gradProg.uniforms.uVelocity, 1);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, vel.read.tex);
    gl.bindFramebuffer(gl.FRAMEBUFFER, vel.write.fbo);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    vel.swap();

    /* advect dye */
    gl.useProgram(advProg.program);
    gl.uniform1f(advProg.uniforms.uDt, dt);
    gl.uniform1f(advProg.uniforms.uDissipation, DENSITY_DISS);
    gl.uniform2fv(advProg.uniforms.uTexelSize, texelSizeDye);
    gl.uniform1i(advProg.uniforms.uVelocity, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, vel.read.tex);
    gl.uniform1i(advProg.uniforms.uSource, 1);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, dye.read.tex);
    gl.bindFramebuffer(gl.FRAMEBUFFER, dye.write.fbo);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    dye.swap();

    /* render */
    var dispProg = programs.display;
    gl.useProgram(dispProg.program);
    gl.uniform1i(dispProg.uniforms.uTexture, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, dye.read.tex);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.useProgram(programs.splat.program);
  }

  /* ---------- public API ---------- */

  window.FluidSim = {
    splat: function (x, y, dx, dy) {
      var splatProg = programs.splat;
      gl.useProgram(splatProg.program);
      gl.uniform2f(splatProg.uniforms.uPoint,  x, 1 - y);
      gl.uniform2f(splatProg.uniforms.uTarget, dx * SPLAT_FORCE, -dy * SPLAT_FORCE);
      gl.uniform1f(splatProg.uniforms.uRadius, SPLAT_RADIUS * 1.5);

      gl.bindFramebuffer(gl.FRAMEBUFFER, vel.write.fbo);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      gl.uniform1f(splatProg.uniforms.uRadius, SPLAT_RADIUS * 3.0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, dye.write.fbo);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      vel.swap();
      dye.swap();
    },
    setBgImage: setBgImage,
    getFluidAlpha: function (x, y) {
      /* read one pixel from the dye read buffer (slow — use sparingly) */
      var fb = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, dye.read.tex, 0);
      var pix = new Uint8Array(4);
      gl.readPixels(
        Math.floor(x * dye.read.w),
        Math.floor((1 - y) * dye.read.h),
        1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pix
      );
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.deleteFramebuffer(fb);
      return pix[0] / 255;
    },
  };

  /* ---------- mouse ---------- */

  var mouse = { x: 0, y: 0, dx: 0, dy: 0, down: false };
  var lastMX = 0, lastMY = 0;

  function onMove(e) {
    var rect = canvas.getBoundingClientRect();
    var cx = (e.clientX - rect.left) / rect.width;
    var cy = 1 - (e.clientY - rect.top) / rect.height;
    mouse.dx = cx - lastMX;
    mouse.dy = cy - lastMY;
    mouse.x = cx;
    mouse.y = cy;
    if (Math.abs(mouse.dx) + Math.abs(mouse.dy) > 0.001) {
      mouse.down = true;
    }
    lastMX = cx;
    lastMY = cy;
  }

  window.addEventListener('mousemove', onMove);
  window.addEventListener('touchmove', function (e) {
    var t = e.touches[0];
    if (!t) return;
    var rect = canvas.getBoundingClientRect();
    var cx = (t.clientX - rect.left) / rect.width;
    var cy = 1 - (t.clientY - rect.top) / rect.height;
    mouse.dx = cx - lastMX;
    mouse.dy = cy - lastMY;
    mouse.x = cx;
    mouse.y = cy;
    if (Math.abs(mouse.dx) + Math.abs(mouse.dy) > 0.001) {
      mouse.down = true;
    }
    lastMX = cx;
    lastMY = cy;
  }, { passive: true });

  /* ---------- bootstrap ---------- */

  function init() {
    resize();

    /* initial splats to get things going */
    mouse.x = 0.5; mouse.y = 0.5; mouse.dx = 0.02; mouse.dy = 0.02; mouse.down = true;
    step(mouse);
    mouse.x = 0.3; mouse.y = 0.7; mouse.dx = -0.01; mouse.dy = 0.03; mouse.down = true;
    step(mouse);
    mouse.x = 0.7; mouse.y = 0.3; mouse.dx = 0.03; mouse.dy = -0.01; mouse.down = true;
    step(mouse);
    mouse.down = false;

    /* set up the vertex attrib for all programs */
    for (var pi = 0; pi < progNames.length; pi++) {
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
      gl.enableVertexAttribArray(programs[progNames[pi]].attrib);
      gl.vertexAttribPointer(programs[progNames[pi]].attrib, 2, gl.FLOAT, false, 0, 0);
    }

    function loop() {
      step(mouse);
      requestAnimationFrame(loop);
    }
    loop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
