/* Hero: el logotipo "IA BROS" nace del ruido en 24 pasos, como un sampler de difusión.
   El cursor (o el dedo) vuelve a meter ruido donde pasa, y se cura solo. */
(function () {
  var TEXT = "IA BROS";
  var STEPS = 24;
  var DUR = 2400;
  var INK = [11, 11, 10];

  var cv, ctx, small, sctx, img;
  var cols = 0, rows = 0, cs = 7, dpr = 1;
  var target, noise, heat;
  var start = 0, lastStep = -1, raf = 0, heatLeft = false;
  var stepEl, seedEl;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  function pad(n, w) { n = String(n); while (n.length < w) n = "0" + n; return n; }

  function buildTarget() {
    var t = document.createElement("canvas");
    t.width = cols; t.height = rows;
    var c = t.getContext("2d");
    if ("fontStretch" in c) c.fontStretch = "extra-expanded";
    c.font = "900 100px Anybody, sans-serif";
    var m = c.measureText(TEXT);
    var size = 100 * (cols * 0.995) / m.width;
    var capH = (m.actualBoundingBoxAscent || 72) / 100;
    size = Math.min(size, (rows * 0.98) / capH);
    c.font = "900 " + size + "px Anybody, sans-serif";
    m = c.measureText(TEXT);
    var asc = m.actualBoundingBoxAscent || size * 0.72;
    var y = Math.round((rows + asc) / 2);
    c.fillStyle = "#000";
    c.fillText(TEXT, -(m.actualBoundingBoxLeft || 0), y);
    var a = c.getImageData(0, 0, cols, rows).data;
    target = new Float32Array(cols * rows);
    for (var i = 0; i < target.length; i++) target[i] = a[i * 4 + 3] > 110 ? 1 : 0;
    noise = new Float32Array(cols * rows);
    heat = new Float32Array(cols * rows);
    refreshNoise(false);
  }

  function refreshNoise(onlyHot) {
    for (var i = 0; i < noise.length; i++) {
      if (!onlyHot || heat[i] > 0.02) noise[i] = Math.random();
    }
  }

  function layout() {
    var r = cv.getBoundingClientRect();
    if (!r.width || !r.height) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cs = r.width < 640 ? 5 : 7;
    cv.width = Math.round(r.width * dpr);
    cv.height = Math.round(r.height * dpr);
    cols = Math.ceil(r.width / cs);
    rows = Math.ceil(r.height / cs);
    small.width = cols; small.height = rows;
    img = sctx.createImageData(cols, rows);
    buildTarget();
    paint(currentK());
  }

  function currentK() {
    if (reduce || !start) return start ? 1 : 0;
    var p = Math.min(1, (performance.now() - start) / DUR);
    p = 1 - Math.pow(1 - p, 2.2);
    return Math.floor(p * STEPS) / STEPS;
  }

  function paint(k) {
    var px = img.data, hot = false;
    for (var i = 0; i < target.length; i++) {
      var h = heat[i];
      if (h > 0.02) { hot = true; heat[i] = h * 0.9; } else heat[i] = 0;
      var m = Math.max(1 - k, h);
      var v = target[i] * (1 - m) + noise[i] * m;
      var o = i * 4;
      if (v > 0.5) { px[o] = INK[0]; px[o + 1] = INK[1]; px[o + 2] = INK[2]; px[o + 3] = 255; }
      else px[o + 3] = 0;
    }
    sctx.putImageData(img, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.drawImage(small, 0, 0, cols * cs * dpr, rows * cs * dpr);
    heatLeft = hot;
  }

  function loop() {
    var k = currentK();
    var step = Math.round(k * STEPS);
    if (step !== lastStep) { lastStep = step; refreshNoise(false); if (stepEl) stepEl.textContent = pad(step, 2); }
    else if (heatLeft) refreshNoise(true);
    paint(k);
    if (k < 1 || heatLeft) raf = requestAnimationFrame(loop);
    else raf = 0;
  }
  function kick() { if (!raf) raf = requestAnimationFrame(loop); }

  function regen() {
    if (seedEl) seedEl.textContent = pad(Math.floor(Math.random() * 10000), 4);
    start = performance.now();
    lastStep = -1;
    if (reduce) { start = 1; if (stepEl) stepEl.textContent = pad(STEPS, 2); paint(1); return; }
    kick();
  }

  function onPointer(e) {
    if (reduce || !cols) return;
    var r = cv.getBoundingClientRect();
    var cx = Math.floor((e.clientX - r.left) / cs), cy = Math.floor((e.clientY - r.top) / cs);
    var R = cs === 5 ? 5 : 6;
    for (var y = -R; y <= R; y++) for (var x = -R; x <= R; x++) {
      var d = Math.sqrt(x * x + y * y);
      if (d > R) continue;
      var X = cx + x, Y = cy + y;
      if (X < 0 || Y < 0 || X >= cols || Y >= rows) continue;
      var i = Y * cols + X;
      heat[i] = Math.max(heat[i], 1 - d / (R + 1));
    }
    kick();
  }

  function init(canvas, readout) {
    cv = canvas;
    ctx = cv.getContext("2d");
    small = document.createElement("canvas");
    sctx = small.getContext("2d");
    stepEl = readout && readout.step;
    seedEl = readout && readout.seed;
    var go = function () { layout(); regen(); };
    var ready = document.fonts && document.fonts.load ? document.fonts.load("900 100px Anybody") : Promise.resolve();
    Promise.race([ready, new Promise(function (r) { setTimeout(r, 1500); })]).then(go, go);
    if ("ResizeObserver" in window) {
      var t;
      new ResizeObserver(function () { clearTimeout(t); t = setTimeout(layout, 120); }).observe(cv);
    }
    cv.addEventListener("pointermove", onPointer);
  }

  window.Denoise = { init: init, regen: regen };
})();
