/* Trabajos: pauta de transmisión (rundown). Eliges una línea y entra al aire en el monitor PGM
   con una transición de ruido que se resuelve en el título (o en la imagen/video del trabajo). */
(function () {
  var $ = function (s) { return document.querySelector(s); };
  var esc = function (s) { return window.I18N.esc(s); };
  var DATA = window.IABROS_WORK || [];
  var TYPES = ["video", "3d", "web", "app", "impl"];
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var COLS = 96, ROWS = 54, DUR = 650;
  var filter = "all", current = DATA[0] && DATA[0].id, dict = null;
  var cv, ctx, raf = 0;

  function list() { return DATA.filter(function (w) { return filter === "all" || w.type === filter; }); }
  function text(id) { return (dict.work.items[id]) || { title: id, client: "", body: "" }; }
  function pad(n) { return (n < 10 ? "0" : "") + n; }

  function renderFilters() {
    var present = TYPES.filter(function (t) { return DATA.some(function (w) { return w.type === t; }); });
    $("#wk-filters").innerHTML = ["all"].concat(present).map(function (t) {
      return '<button type="button" class="wk__f" data-f="' + t + '" aria-pressed="' + (t === filter) + '">' + esc(dict.work.filters[t]) + "</button>";
    }).join("");
  }

  function renderRows() {
    var items = list();
    if (!items.some(function (w) { return w.id === current; })) current = items[0] && items[0].id;
    var idx = items.findIndex(function (w) { return w.id === current; });
    $("#wk-list").innerHTML = items.map(function (w, i) {
      var t = text(w.id), st = i === idx ? dict.work.onair : i === idx + 1 ? dict.work.next : "";
      return '<li><button type="button" class="rd__row" data-id="' + w.id + '" aria-current="' + (i === idx) + '">' +
        '<span class="rd__pg">A' + pad(i + 1) + "</span>" +
        '<span class="rd__slug">' + esc(t.title) + "</span>" +
        '<span class="rd__type">' + esc(dict.work.filters[w.type]) + (w.sample ? " · " + esc(dict.work.sample) : "") + "</span>" +
        '<span class="rd__st"' + (st ? "" : " hidden") + ">" + esc(st) + "</span>" +
        "</button></li>";
    }).join("");
  }

  function renderInfo() {
    var w = DATA.filter(function (x) { return x.id === current; })[0];
    if (!w) { $("#wk-info").innerHTML = ""; return; }
    var t = text(w.id);
    $("#wk-info").innerHTML = "<h3>" + esc(t.title) + "</h3>" +
      '<p class="rd__meta">' + esc(t.client) + " · " + esc(dict.work.filters[w.type]) + " · " + w.year + "</p>" +
      "<p>" + esc(t.body) + "</p>" +
      (w.url ? '<a class="rd__cta" href="' + esc(w.url) + '" target="_blank" rel="noopener">' + esc(dict.work.cta) + " ↗</a>" : "");
    var m = $("#wk-media");
    m.innerHTML = !w.media ? "" : /\.(mp4|webm)$/i.test(w.media)
      ? '<video src="' + esc(w.media) + '" muted loop autoplay playsinline></video>'
      : '<img src="' + esc(w.media) + '" alt="' + esc(t.title) + '">';
    take(t.title, !!w.media);
  }

  /* ---------- monitor: el título nace del ruido ---------- */
  function acid() { return getComputedStyle(document.documentElement).getPropertyValue("--acid").trim() || "#64FF28"; }

  function mask(title) {
    var c = document.createElement("canvas"); c.width = COLS; c.height = ROWS;
    var x = c.getContext("2d"), size = 30, lines;
    var fam = "Anybody, 'Noto Sans SC', 'Noto Sans TC', sans-serif";
    function wrap(sz) {
      x.font = "900 " + sz + "px " + fam;
      var cjk = /[\u3000-\u9fff]/.test(title);
      var words = cjk ? title.split("") : title.split(" "), out = [], line = "";
      var sep = cjk ? "" : " ";
      words.forEach(function (wd) {
        var tryL = line ? line + sep + wd : wd;
        if (x.measureText(tryL).width > COLS - 8 && line) { out.push(line); line = wd; } else line = tryL;
      });
      out.push(line);
      return out;
    }
    for (; size > 7; size--) {
      lines = wrap(size);
      var wide = lines.some(function (l) { return x.measureText(l).width > COLS - 8; });
      if (!wide && lines.length * size * 1.02 <= ROWS - 10) break;
    }
    x.fillStyle = "#000"; x.textBaseline = "top";
    var top = (ROWS - lines.length * size * 1.02) / 2;
    lines.forEach(function (l, i) { x.fillText(l, 4, top + i * size * 1.02); });
    var a = x.getImageData(0, 0, COLS, ROWS).data, m = new Uint8Array(COLS * ROWS);
    for (var i = 0; i < m.length; i++) m[i] = a[i * 4 + 3] > 110 ? 1 : 0;
    return m;
  }

  function hex(c) {
    if (c[0] === "#") { var n = parseInt(c.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
    var m = c.match(/[\d.]+/g); return m ? [+m[0], +m[1], +m[2]] : [100, 255, 40];
  }

  function take(title, hasMedia) {
    var mon = $(".rd__mon");
    mon.classList.remove("has-media");
    var m = mask(title), col = hex(acid()), img = ctx.createImageData(COLS, ROWS), px = img.data, t0 = performance.now();
    cancelAnimationFrame(raf);
    (function frame(now) {
      var k = reduce ? 1 : Math.min(1, (now - t0) / DUR);
      k = Math.floor(k * 12) / 12;
      for (var i = 0; i < m.length; i++) {
        var o = i * 4, r = Math.random(), on;
        on = r < k ? m[i] === 1 : Math.random() < 0.5;
        if (on) {
          var c = r < k ? col : (Math.random() < 0.7 ? col : [241, 241, 236]);
          px[o] = c[0]; px[o + 1] = c[1]; px[o + 2] = c[2]; px[o + 3] = 255;
        } else { px[o] = 10; px[o + 1] = 10; px[o + 2] = 9; px[o + 3] = 255; }
      }
      ctx.putImageData(img, 0, 0);
      if (k < 1) raf = requestAnimationFrame(frame);
      else if (hasMedia) mon.classList.add("has-media");
    })(t0);
  }

  function render(d) {
    dict = d;
    renderFilters(); renderRows(); renderInfo();
  }

  function select(id) { current = id; renderRows(); renderInfo(); }

  function bind() {
    cv = $("#wk-canvas"); cv.width = COLS; cv.height = ROWS; ctx = cv.getContext("2d");
    $("#wk-filters").addEventListener("click", function (e) {
      var b = e.target.closest("[data-f]"); if (!b) return;
      filter = b.dataset.f; renderFilters(); renderRows(); renderInfo();
    });
    $("#wk-list").addEventListener("click", function (e) {
      var b = e.target.closest(".rd__row"); if (b) select(b.dataset.id);
    });
    $("#wk-list").addEventListener("keydown", function (e) {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      var items = list(), i = items.findIndex(function (w) { return w.id === current; });
      var j = Math.max(0, Math.min(items.length - 1, i + (e.key === "ArrowDown" ? 1 : -1)));
      if (j === i) return;
      e.preventDefault(); select(items[j].id);
      var b = $('#wk-list [data-id="' + items[j].id + '"]'); if (b) b.focus();
    });
    /* timecode del monitor */
    var tcEl = $("#wk-tc"), t0 = Date.now();
    setInterval(function () {
      var f = Math.floor((Date.now() - t0) / 40), s = Math.floor(f / 25);
      tcEl.textContent = "00:" + pad(Math.floor(s / 60) % 60) + ":" + pad(s % 60) + ":" + pad(f % 25);
    }, reduce ? 1000 : 40);
  }

  window.Work = { render: render, bind: bind };
})();
