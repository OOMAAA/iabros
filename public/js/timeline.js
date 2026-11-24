/* Proceso: línea de tiempo jugable.
   - A1: forma de onda viva.
   - V1: cualquier clip se cambia con cualquier otro: arrastrándolo encima, o tocando uno y luego el otro
     (también Enter/Espacio para elegir y flechas ← → con teclado).
   - Parte en orden. Rojo si la secuencia queda mal; flúor cuando vuelve al orden correcto. */
(function () {
  var $ = function (s) { return document.querySelector(s); };
  var esc = function (s) { return window.I18N.esc(s); };
  var CLIP_W = [22, 28, 32, 18];
  var order = [0, 1, 2, 3], wasOk = true, dict = null, drag = null, picked = -1, skipClick = false;
  var section, clipsEl;

  function tc(s) { return "00:00:" + (s < 10 ? "0" : "") + s + ":00"; }
  function isOk() { return order.every(function (v, i) { return v === i; }); }

  function renderClips(focusIdx) {
    var steps = dict.process.steps;
    clipsEl.innerHTML = order.map(function (step, slot) {
      return '<button type="button" class="clip' + (slot === picked ? " is-picked" : "") + '" aria-pressed="' + (slot === picked) + '" data-slot="' + slot + '" style="flex:' + CLIP_W[step] + ' 1 0" aria-label="' +
        esc(steps[step].title) + ' · ' + esc(dict.process.pos) + ' ' + (slot + 1) + '">' + esc(steps[step].title) + "</button>";
    }).join("");
    if (focusIdx != null) { var b = clipsEl.querySelector('[data-slot="' + focusIdx + '"]'); if (b) b.focus(); }
  }

  function status(celebrate) {
    var ok = isOk();
    section.classList.toggle("is-bad", !ok);
    $("#tl-status").textContent = ok ? dict.process.ok : dict.process.broken;
    $("#tl-fix").hidden = ok;
    if (ok && !wasOk && celebrate) { section.classList.remove("is-win"); void section.offsetWidth; section.classList.add("is-win"); }
    wasOk = ok;
  }

  function swap(a, b, focusIdx) {
    picked = -1;
    if (a === b || b < 0 || b >= order.length) { renderClips(focusIdx); return; }
    var t = order[a]; order[a] = order[b]; order[b] = t;
    renderClips(focusIdx);
    status(true);
  }

  function render(d) {
    dict = d;
    var r = "";
    for (var s = 0; s <= 50; s += 10) r += "<span>" + tc(s) + "</span>";
    $("#ruler").innerHTML = r;
    if (!$("#wave").children.length) {
      var w = "";
      for (var i = 0; i < 110; i++) {
        var env = 0.55 + 0.45 * Math.sin(i / 7) * Math.sin(i / 3.3);
        var hi = Math.min(1, Math.max(0.25, env + Math.random() * 0.3));
        w += '<i style="--hi:' + hi.toFixed(2) + ";--lo:" + (0.08 + Math.random() * 0.2).toFixed(2) +
          ";--d:" + (0.25 + Math.random() * 0.6).toFixed(2) + "s;--dl:-" + (Math.random()).toFixed(2) + 's"></i>';
      }
      $("#wave").innerHTML = w;
    }
    renderClips();
    status(false);
  }

  /* ---------- arrastre ---------- */
  /* el clip más cercano al puntero (sin contar el que arrastras): siempre hay destino */
  function targetAt(x) {
    var hit = null, best = Infinity;
    clipsEl.querySelectorAll(".clip").forEach(function (c) {
      if (drag && c === drag.el) return;
      var r = c.getBoundingClientRect(), d = Math.abs(x - (r.left + r.width / 2));
      if (d < best) { best = d; hit = c; }
    });
    var self = drag && drag.el.getBoundingClientRect();
    if (self && x >= self.left - drag.dx && x <= self.right - drag.dx) return null; /* sigue sobre su lugar */
    return hit;
  }

  function down(e) {
    var c = e.target.closest(".clip");
    if (!c || e.button > 0) return;
    drag = { el: c, slot: +c.dataset.slot, sx: e.clientX, dx: 0, moved: false, id: e.pointerId };
    c.setPointerCapture(e.pointerId);
  }
  function move(e) {
    if (!drag) return;
    var dx = e.clientX - drag.sx;
    drag.dx = dx;
    if (!drag.moved && Math.abs(dx) < 6) return;
    if (!drag.moved) { drag.moved = true; drag.el.classList.add("is-drag"); }
    e.preventDefault();
    drag.el.style.transform = "translateX(" + dx + "px) translateY(-4px)";
    clipsEl.querySelectorAll(".is-target").forEach(function (t) { t.classList.remove("is-target"); });
    var t = targetAt(e.clientX);
    if (t) t.classList.add("is-target");
  }
  function up(e) {
    if (!drag) return;
    var d = drag;
    if (!d.moved) { drag = null; return; } /* fue un toque: lo maneja click */
    var t = targetAt(e.clientX);
    drag = null;
    skipClick = true; setTimeout(function () { skipClick = false; }, 0);
    d.el.style.transform = "";
    d.el.classList.remove("is-drag");
    if (t) swap(d.slot, +t.dataset.slot);
    else clipsEl.querySelectorAll(".is-target").forEach(function (x) { x.classList.remove("is-target"); });
  }

  /* tocar uno y después otro: se intercambian */
  function click(e) {
    if (skipClick) { skipClick = false; return; }
    var c = e.target.closest(".clip");
    if (!c) return;
    var s = +c.dataset.slot;
    if (picked < 0) { picked = s; renderClips(s); }
    else if (picked === s) { picked = -1; renderClips(s); }
    else swap(picked, s, s);
  }

  function key(e) {
    var c = e.target.closest(".clip");
    if (!c) return;
    var s = +c.dataset.slot;
    if (e.key === "ArrowLeft") { e.preventDefault(); swap(s, s - 1, s - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); swap(s, s + 1, s + 1); }
  }

  function bind() {
    section = $("#proceso"); clipsEl = $("#clips");
    clipsEl.addEventListener("pointerdown", down);
    clipsEl.addEventListener("pointermove", move);
    clipsEl.addEventListener("pointerup", up);
    clipsEl.addEventListener("pointercancel", up);
    clipsEl.addEventListener("keydown", key);
    clipsEl.addEventListener("click", click);
    $("#tl-fix").addEventListener("click", function () { order = [0, 1, 2, 3]; picked = -1; renderClips(); status(true); });
  }

  window.Timeline = { render: render, bind: bind };
})();
