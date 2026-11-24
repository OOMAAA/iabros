/* Equipo: franja de glitch siempre sobre los ojos. Al pasar el mouse (o tocar / enfocar)
   la credencial, estallido de pixeles y la foto queda limpia, a color; al salir, vuelve el glitch. */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var COLS = 48, BAR_ROWS = 10, FULL_ROWS = 48, FPS_MS = 70;
  var raf = 0, last = 0; /* el estado vive en cada foto (ph._fs): así no importa si las fichas cambian de orden */

  function rand(a, b) { return a + Math.random() * (b - a); }

  function draw(c, acid, full) {
    var rows = full ? FULL_ROWS : BAR_ROWS;
    if (c.height !== rows) c.height = rows;
    var ctx = c.getContext("2d");
    if (!full) { ctx.fillStyle = "#0B0B0A"; ctx.fillRect(0, 0, COLS, rows); }
    else ctx.clearRect(0, 0, COLS, rows);
    for (var y = 0; y < rows; y++) {
      for (var x = 0; x < COLS; x++) {
        var r = Math.random();
        if (r < (full ? 0.45 : 0.32)) {
          ctx.fillStyle = r < 0.12 ? "#F1F1EC" : r < 0.2 && full ? "#0B0B0A" : acid;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
    /* rasgados horizontales */
    for (var b = 0; b < (full ? 6 : 2); b++) {
      ctx.fillStyle = Math.random() < 0.6 ? acid : "#0B0B0A";
      ctx.fillRect(Math.floor(rand(-10, COLS * 0.6)), Math.floor(rand(0, rows)), Math.floor(rand(8, COLS)), 1);
    }
  }

  function photos() { return document.querySelectorAll(".pass__photo--img"); }
  function acidNow() { return getComputedStyle(document.documentElement).getPropertyValue("--acid").trim() || "#64FF28"; }

  function tick(t) {
    raf = requestAnimationFrame(tick);
    if (t - last < FPS_MS) return;
    last = t;
    var acid = acidNow();
    photos().forEach(function (ph, i) {
      var s = ph._fs, c = ph.querySelector(".pass__glitch");
      if (!s || !c) return;
      var bursting = t < s.burst;
      ph.classList.toggle("is-burst", bursting);
      ph.classList.toggle("is-clean", s.clean && !bursting);
      if (!s.clean || bursting) draw(c, acid, bursting);
    });
  }

  function set(ph, clean) {
    var s = ph._fs;
    if (!s || s.clean === clean) return;
    s.clean = clean;
    s.burst = reduce ? 0 : performance.now() + 200;
    if (reduce) ph.classList.toggle("is-clean", clean);
  }

  function attach() {
    var t = performance.now(), acid = acidNow();
    photos().forEach(function (ph, i) {
      var c = ph.querySelector(".pass__glitch");
      if (!c) {
        c = document.createElement("canvas");
        c.className = "pass__glitch";
        c.setAttribute("aria-hidden", "true");
        c.width = COLS; c.height = BAR_ROWS;
        ph.appendChild(c);
      }
      if (!ph._fs) ph._fs = { clean: false, burst: 0 };
      ph.classList.toggle("is-clean", ph._fs.clean);
      var pass = ph.closest(".pass");
      if (pass._faces) return draw(c, acid, false); /* listeners ya puestos */
      pass._faces = true;
      var on = function () { set(ph, true); }, off = function () { set(ph, false); };
      pass.addEventListener("pointerenter", on);
      pass.addEventListener("pointerleave", off);
      pass.addEventListener("focusin", on);
      pass.addEventListener("focusout", off);
      draw(c, acid, false);
    });
    if (!reduce && !raf) raf = requestAnimationFrame(tick);
  }

  window.Faces = { attach: attach };
})();
