/* Rastro de pixeles bajo el mouse en toda la página (como el del hero), que se cura solo.
   Solo con mouse; nada en pantallas táctiles ni con animaciones reducidas. */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  var CELL = 7, R = 4;
  var cv = document.createElement("canvas");
  cv.className = "trail";
  cv.setAttribute("aria-hidden", "true");
  document.body.appendChild(cv);
  var ctx = cv.getContext("2d"), w = 0, h = 0, heat, img, raf = 0;

  function size() {
    w = Math.ceil(innerWidth / CELL); h = Math.ceil(innerHeight / CELL);
    cv.width = w; cv.height = h;
    heat = new Float32Array(w * h);
    img = ctx.createImageData(w, h);
  }

  function rgb(c) {
    c = c.trim();
    if (c[0] === "#") { var n = parseInt(c.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
    var m = c.match(/[\d.]+/g);
    return m ? [+m[0], +m[1], +m[2]] : [100, 255, 40];
  }

  function tick() {
    var acid = rgb(getComputedStyle(document.documentElement).getPropertyValue("--acid") || "#64FF28");
    var px = img.data, alive = false;
    for (var i = 0; i < heat.length; i++) {
      var o = i * 4, t = heat[i];
      if (t > 0.03) {
        alive = true;
        heat[i] = t * 0.88;
        var r = Math.random();
        if (r < t * 0.85) {
          var q = Math.random(), c = q < 0.45 ? [11, 11, 10] : q < 0.85 ? acid : [241, 241, 236];
          px[o] = c[0]; px[o + 1] = c[1]; px[o + 2] = c[2]; px[o + 3] = 255;
          continue;
        }
      } else heat[i] = 0;
      px[o + 3] = 0;
    }
    ctx.putImageData(img, 0, 0);
    raf = alive ? requestAnimationFrame(tick) : 0;
  }

  window.addEventListener("pointermove", function (e) {
    if (e.pointerType !== "mouse") return;
    if (e.target.closest && e.target.closest("#denoise")) return; /* el hero ya tiene el suyo */
    var cx = Math.floor(e.clientX / CELL), cy = Math.floor(e.clientY / CELL);
    for (var y = -R; y <= R; y++) for (var x = -R; x <= R; x++) {
      var d = Math.sqrt(x * x + y * y), X = cx + x, Y = cy + y;
      if (d > R || X < 0 || Y < 0 || X >= w || Y >= h) continue;
      var i = Y * w + X;
      heat[i] = Math.max(heat[i], 1 - d / (R + 1));
    }
    if (!raf) raf = requestAnimationFrame(tick);
  }, { passive: true });

  var t;
  window.addEventListener("resize", function () { clearTimeout(t); t = setTimeout(size, 150); });
  size();
})();
