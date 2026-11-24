/* Color de marca.
   data-color-mode="lang"   → cada idioma tiene su flúor; al cambiar, el color se transforma y el hero se regenera
   data-color-mode="random" → cada 30–40 s salta a otro flúor con un glitch de pixeles en toda la página */
(function () {
  var PALETTE = {
    "es":      "#64FF28", /* verde */
    "en":      "#00F0FF", /* cian */
    "zh-Hans": "#FF2BD6", /* magenta */
    "zh-Hant": "#E6FF00"  /* amarillo limón flúor */
  };
  var COLORS = Object.keys(PALETTE).map(function (k) { return PALETTE[k]; });
  var root = document.documentElement;
  var mode = root.getAttribute("data-color-mode") || "lang";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var current = null;

  var meta = document.querySelector('meta[name="theme-color"]');
  var icon = document.querySelector('link[rel="icon"]');

  function favicon(c) {
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="' + c + '"/>' +
      '<rect x="6" y="6" width="8" height="20" fill="#0B0B0A"/><rect x="18" y="6" width="8" height="8" fill="#0B0B0A"/>' +
      '<rect x="18" y="18" width="8" height="8" fill="#0B0B0A"/></svg>';
    return "data:image/svg+xml," + encodeURIComponent(svg);
  }

  function set(c, instant) {
    if (instant) root.classList.add("instant");
    root.style.setProperty("--acid", c);
    if (meta) meta.setAttribute("content", c);
    if (icon) icon.setAttribute("href", favicon(c));
    current = c;
    if (instant) requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.remove("instant"); }); });
  }

  /* ---------- modo idioma ---------- */
  if (mode === "lang") {
    var first = true;
    window.I18N.on(function (d, lang) {
      var c = PALETTE[lang] || PALETTE.es;
      if (c === current) return;
      set(c, first);
      if (!first && window.Denoise) window.Denoise.regen();
      first = false;
    });
    return;
  }

  /* ---------- modo random con glitch ---------- */
  /* prueba: index.html#limon (o #verde, #cian, #magenta) parte con ese color */
  var PICK = { verde: "es", cian: "en", magenta: "zh-Hans", limon: "zh-Hant" };
  var start = PICK[(location.hash || "").slice(1)];
  set(PALETTE[start] || PALETTE.es, true);

  var cv = document.createElement("canvas");
  cv.className = "glitch";
  cv.setAttribute("aria-hidden", "true");
  var ctx = cv.getContext("2d");
  var CELL = 6, DUR = 750;

  function glitch(next) {
    if (reduce) { set(next, false); return; }
    document.body.appendChild(cv);
    var w = Math.ceil(innerWidth / CELL), h = Math.ceil(innerHeight / CELL);
    cv.width = w; cv.height = h;
    var img = ctx.createImageData(w, h), px = img.data;
    var from = hex(current), to = hex(next), ink = [11, 11, 10], paper = [241, 241, 236];
    var t0 = performance.now(), swapped = false;
    root.classList.add("glitching");

    (function frame(now) {
      var t = Math.min(1, (now - t0) / DUR);
      var dens = Math.sin(Math.PI * t) * 0.6;
      if (!swapped && t > 0.45) { set(next, true); swapped = true; }
      var col = t < 0.45 ? from : to;
      for (var i = 0; i < w * h; i++) {
        var o = i * 4, r = Math.random();
        if (r < dens) {
          var c = r < dens * 0.45 ? ink : r < dens * 0.85 ? (Math.random() < 0.5 ? from : to) : paper;
          px[o] = c[0]; px[o + 1] = c[1]; px[o + 2] = c[2]; px[o + 3] = 255;
        } else px[o + 3] = 0;
      }
      /* bandas de rasgado horizontal */
      var bands = Math.round(dens * 9);
      for (var b = 0; b < bands; b++) {
        var y = Math.floor(Math.random() * h), bh = 1 + Math.floor(Math.random() * 5);
        var x0 = Math.floor(Math.random() * w * 0.6), bw = Math.floor(w * (0.2 + Math.random() * 0.6));
        var c2 = Math.random() < 0.7 ? col : ink;
        for (var yy = y; yy < Math.min(h, y + bh); yy++) for (var xx = x0; xx < Math.min(w, x0 + bw); xx++) {
          var q = (yy * w + xx) * 4;
          px[q] = c2[0]; px[q + 1] = c2[1]; px[q + 2] = c2[2]; px[q + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
      if (t < 1) requestAnimationFrame(frame);
      else { cv.remove(); root.classList.remove("glitching"); }
    })(t0);
  }

  function hex(c) {
    var n = parseInt(c.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function schedule() {
    setTimeout(function () {
      if (!document.hidden) {
        var pool = COLORS.filter(function (c) { return c !== current; });
        glitch(pool[Math.floor(Math.random() * pool.length)]);
      }
      schedule();
    }, 30000 + Math.random() * 10000);
  }
  schedule();
})();
