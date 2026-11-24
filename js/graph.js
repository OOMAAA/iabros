/* Motor: grafo de nodos tipo ComfyUI, jugable.
   - Los nodos se arrastran desde su barra, siempre dentro del área.
   - Arrastra desde una salida (derecha) a una entrada (izquierda) para conectar.
   - Arrastra desde una entrada conectada para soltar el cable.
   - Parte armado. Rojo si se rompe; flúor cuando queda Entrada → LLM → Generación → Upscale → Post → Salida. */
(function () {
  var $ = function (s) { return document.querySelector(s); };
  var esc = function (s) { return window.I18N.esc(s); };
  var ORDER = ["input", "llm", "gen", "upscale", "post", "output"];
  var CORRECT = { input: "llm", llm: "gen", gen: "upscale", upscale: "post", post: "output" };
  var TYPES = { input: ["txt", "img", "mp4", "svg"], llm: ["txt", "py", "api"], upscale: ["2160p"], output: ["live", "spot", "9:16", "api"] };
  /* posición inicial como fracción del espacio libre [x, y] */
  var LAYOUT = {
    wide:   { input: [0, 0.08], llm: [0.2, 0.92], gen: [0.4, 0.04], upscale: [0.6, 0.92], post: [0.8, 0.08], output: [1, 0.9] },
    narrow: { input: [0, 0], llm: [1, 0.2], gen: [0, 0.4], upscale: [1, 0.6], post: [0, 0.8], output: [1, 1] }
  };
  var mq = window.matchMedia("(max-width: 760px)");

  var graph, area, svg, nodesEl, statusEl, dict;
  var pos = null, links = Object.assign({}, CORRECT), wasOk = true;
  var drag = null, tmp = null;

  function initPos() {
    var L = LAYOUT[mq.matches ? "narrow" : "wide"];
    pos = {};
    ORDER.forEach(function (k) { pos[k] = L[k].slice(); });
  }

  function nodeHTML(k, i) {
    var nd = dict.engine.nodes[k], body = "";
    if (nd.chips) body += '<div class="node__chips">' + nd.chips.map(function (c) { return '<span class="node__chip">' + esc(c) + "</span>"; }).join("") + "</div>";
    if (nd.rows) body += nd.rows.map(function (r, j) {
      return '<div class="node__row"><span>' + esc(r) + "</span><em>" + ((TYPES[k] && TYPES[k][j]) || "") + "</em></div>";
    }).join("");
    return '<div class="node" data-k="' + k + '">' +
      (i > 0 ? '<span class="node__port node__port--in" data-in="' + k + '" aria-hidden="true"></span>' : "") +
      (i < ORDER.length - 1 ? '<span class="node__port node__port--out" data-out="' + k + '" aria-hidden="true"></span>' : "") +
      '<div class="node__hd">' + esc(nd.title) + '</div><div class="node__bd">' + body + "</div></div>";
  }

  /* en celular: apila en zigzag según el alto real de cada nodo, sin que se monten */
  function stackNarrow() {
    if (!mq.matches) { area.style.height = ""; return; }
    var gap = 44, items = ORDER.map(el);
    if (items.some(function (n) { return !n; })) return;
    var total = items.reduce(function (s, n) { return s + n.offsetHeight; }, 0) + gap * (items.length - 1) + 8;
    area.style.height = total + "px";
    var y = 0;
    ORDER.forEach(function (k, i) {
      var fh = Math.max(1, total - items[i].offsetHeight);
      pos[k] = [i % 2 ? 1 : 0, y / fh];
      y += items[i].offsetHeight + gap;
    });
  }

  function render(d) {
    dict = d;
    if (!pos) initPos();
    nodesEl.innerHTML = ORDER.map(nodeHTML).join("");
    stackNarrow();
    $("#rig").innerHTML = d.engine.rig.map(function (r) { return "<li><b>" + esc(r[0]) + "</b> " + esc(r[1]) + "</li>"; }).join("");
    place();
    update(false);
  }

  /* ---------- geometría ---------- */
  function el(k) { return nodesEl.querySelector('.node[data-k="' + k + '"]'); }
  function placeOne(k) {
    var n = el(k); if (!n) return;
    var fw = Math.max(1, area.clientWidth - n.offsetWidth), fh = Math.max(1, area.clientHeight - n.offsetHeight);
    n._x = pos[k][0] * fw; n._y = pos[k][1] * fh;
    n.style.transform = "translate(" + n._x + "px," + n._y + "px)";
  }
  function place() { ORDER.forEach(placeOne); draw(); }

  function center(node, box) {
    var r = node.getBoundingClientRect();
    return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
  }
  function curve(a, b) {
    var dx = Math.max(50, Math.abs(b.x - a.x) * 0.5);
    return '<path d="M' + a.x + " " + a.y + " C" + (a.x + dx) + " " + a.y + " " + (b.x - dx) + " " + b.y + " " + b.x + " " + b.y + '"';
  }
  function draw() {
    var box = area.getBoundingClientRect(), p = "";
    svg.setAttribute("viewBox", "0 0 " + box.width + " " + box.height);
    Object.keys(links).forEach(function (o) {
      var a = nodesEl.querySelector('[data-out="' + o + '"]'), b = nodesEl.querySelector('[data-in="' + links[o] + '"]');
      if (a && b) p += curve(center(a, box), center(b, box)) + "/>";
    });
    if (tmp) {
      var s = nodesEl.querySelector('[data-out="' + tmp.from + '"]');
      if (s) p += curve(center(s, box), { x: tmp.x, y: tmp.y }) + ' class="tmp"/>';
    }
    svg.innerHTML = p;
  }

  /* ---------- estado ---------- */
  function isOk() {
    return Object.keys(links).length === Object.keys(CORRECT).length && Object.keys(CORRECT).every(function (k) { return links[k] === CORRECT[k]; });
  }
  function update(celebrate) {
    var ok = isOk();
    graph.classList.toggle("is-ok", ok);
    statusEl.textContent = ok ? dict.engine.ok : dict.engine.broken;
    nodesEl.querySelectorAll(".node__port").forEach(function (p) {
      var linked = p.dataset.out ? !!links[p.dataset.out] : Object.keys(links).some(function (o) { return links[o] === p.dataset.in; });
      p.classList.toggle("is-linked", linked);
    });
    if (ok && !wasOk && celebrate) {
      graph.classList.remove("is-win"); void graph.offsetWidth; graph.classList.add("is-win");
    }
    wasOk = ok;
    draw();
  }

  /* ---------- interacción ---------- */
  function local(e) { var b = area.getBoundingClientRect(); return { x: e.clientX - b.left, y: e.clientY - b.top }; }
  function clearTargets() { nodesEl.querySelectorAll(".is-target").forEach(function (t) { t.classList.remove("is-target"); }); }

  function down(e) {
    var t = e.target, out = t.closest("[data-out]"), inp = t.closest("[data-in]"), hd = t.closest(".node__hd");
    if (out) {
      delete links[out.dataset.out];
      tmp = { from: out.dataset.out };
    } else if (inp) {
      var src = Object.keys(links).filter(function (o) { return links[o] === inp.dataset.in; })[0];
      if (!src) return;
      delete links[src];
      tmp = { from: src };
    } else if (hd) {
      var n = hd.closest(".node");
      drag = { k: n.dataset.k, n: n, sx: e.clientX, sy: e.clientY, x0: n._x, y0: n._y };
      n.classList.add("is-drag");
    } else return;
    e.preventDefault();
    area.setPointerCapture(e.pointerId);
    if (tmp) { var p = local(e); tmp.x = p.x; tmp.y = p.y; update(false); }
  }

  function move(e) {
    if (drag) {
      var n = drag.n, fw = Math.max(1, area.clientWidth - n.offsetWidth), fh = Math.max(1, area.clientHeight - n.offsetHeight);
      var x = Math.min(fw, Math.max(0, drag.x0 + e.clientX - drag.sx));
      var y = Math.min(fh, Math.max(0, drag.y0 + e.clientY - drag.sy));
      pos[drag.k] = [x / fw, y / fh];
      placeOne(drag.k);
      draw();
    } else if (tmp) {
      var p = local(e); tmp.x = p.x; tmp.y = p.y;
      clearTargets();
      var hit = document.elementFromPoint(e.clientX, e.clientY);
      var tgt = hit && hit.closest && hit.closest("[data-in]");
      if (tgt && tgt.dataset.in !== tmp.from) tgt.classList.add("is-target");
      draw();
    }
  }

  function up(e) {
    if (drag) { drag.n.classList.remove("is-drag"); drag = null; }
    if (tmp) {
      var hit = document.elementFromPoint(e.clientX, e.clientY);
      var tgt = hit && hit.closest && hit.closest("[data-in]");
      if (tgt && tgt.dataset.in !== tmp.from) {
        Object.keys(links).forEach(function (o) { if (links[o] === tgt.dataset.in) delete links[o]; });
        links[tmp.from] = tgt.dataset.in;
      }
      tmp = null;
      clearTargets();
      update(true);
    }
  }

  function solve() { links = Object.assign({}, CORRECT); initPos(); stackNarrow(); place(); update(true); }
  function shuffle() {
    links = {};
    ORDER.forEach(function (k) { pos[k] = [Math.random(), Math.random()]; });
    place(); update(false);
  }

  function bind() {
    graph = $("#graph"); area = $("#graph-area"); svg = $("#wires"); nodesEl = $("#nodes"); statusEl = $("#graph-status");
    area.addEventListener("pointerdown", down);
    area.addEventListener("pointermove", move);
    area.addEventListener("pointerup", up);
    area.addEventListener("pointercancel", up);
    $("#graph-solve").addEventListener("click", solve);
    $("#graph-shuffle").addEventListener("click", shuffle);
    mq.addEventListener("change", function () { initPos(); stackNarrow(); place(); });
    if ("ResizeObserver" in window) new ResizeObserver(function () { requestAnimationFrame(place); }).observe(area);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
  }

  window.Graph = { render: render, bind: bind, draw: draw };
})();
