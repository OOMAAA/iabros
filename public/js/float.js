/* Equipo: cada credencial queda en un lugar random (distinto en cada carga, sin montarse)
   y ahí flota muy sutil, como respirando: unos pocos px y un leve giro, lento y suave.
   Al pasar el mouse sobre una, se va quedando quieta para poder usarla.
   En pantallas de menos de 980px no flotan (se apilan) pero el orden igual es random. */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var mq = window.matchMedia("(min-width: 980px)");
  var AMP_X = 10, AMP_Y = 8; /* px de vaivén */
  var bodies = null, perm = null, raf = 0, visible = false, area = null;

  function rand(a, b) { return a + Math.random() * (b - a); }

  function els() { return Array.prototype.slice.call(area.querySelectorAll(".pass")); }

  /* cada ficha en su columna (el orden ya es random), con posición random dentro de ella:
     nunca se montan y cada carga se ve distinta */
  function scatter(list) {
    var W = area.clientWidth, H = area.clientHeight, n = list.length, colW = W / n;
    return list.map(function (el, i) {
      var w = el.offsetWidth, h = el.offsetHeight;
      var x = i * colW + rand(AMP_X, Math.max(AMP_X, colW - w - AMP_X));
      var y = rand(AMP_Y, Math.max(AMP_Y, H - h - AMP_Y));
      return { x: x, y: y, w: w, h: h, rot: rand(-2.5, 2.5),
        p1: rand(0, 6.28), p2: rand(0, 6.28), p3: rand(0, 6.28),
        f1: rand(0.07, 0.11), f2: rand(0.05, 0.09), f3: rand(0.04, 0.07), amp: 1, hold: false };
    });
  }

  function apply(el, b, t) {
    var s = t / 1000, a = b.amp;
    var x = b.x + a * AMP_X * (Math.sin(s * b.f1 * 6.28 + b.p1) * 0.7 + Math.sin(s * b.f2 * 6.28 + b.p2) * 0.3);
    var y = b.y + a * AMP_Y * (Math.sin(s * b.f2 * 6.28 + b.p3) * 0.7 + Math.sin(s * b.f3 * 6.28 + b.p1) * 0.3);
    var r = b.rot + a * 1.1 * Math.sin(s * b.f3 * 6.28 + b.p2);
    el.style.transform = "translate(" + x.toFixed(2) + "px," + y.toFixed(2) + "px) rotate(" + r.toFixed(3) + "deg)";
  }

  function step(t) {
    raf = 0;
    if (!visible || !mq.matches) return;
    var list = els();
    bodies.forEach(function (b, i) {
      b.amp += ((b.hold ? 0 : 1) - b.amp) * 0.06; /* frena / vuelve suave */
      if (list[i]) apply(list[i], b, t);
    });
    raf = requestAnimationFrame(step);
  }

  function kick() { if (!raf && visible && mq.matches && !reduce) raf = requestAnimationFrame(step); }

  function attach() {
    area = document.getElementById("passes");
    if (!area) return;
    var list = els();
    if (!perm) { perm = list.map(function (_, i) { return i; }); perm.sort(function () { return Math.random() - 0.5; }); }
    /* orden random en el DOM (sirve para móvil y para el orden de lectura) */
    perm.forEach(function (i) { if (list[i]) area.appendChild(list[i]); });
    list = els();
    list.forEach(function (el, i) {
      el.addEventListener("pointerenter", function () { if (bodies && bodies[i]) bodies[i].hold = true; });
      el.addEventListener("pointerleave", function () { if (bodies && bodies[i]) bodies[i].hold = false; });
      el.addEventListener("focusin", function () { if (bodies && bodies[i]) bodies[i].hold = true; });
      el.addEventListener("focusout", function () { if (bodies && bodies[i]) bodies[i].hold = false; });
    });
    area.classList.toggle("is-float", mq.matches);
    if (!mq.matches) { list.forEach(function (el) { el.style.transform = ""; }); return; }
    if (!bodies || bodies.length !== list.length) bodies = scatter(list);
    list.forEach(function (el, i) { apply(el, bodies[i], performance.now()); });
    kick();
  }

  function bind() {
    area = document.getElementById("passes");
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; kick(); }).observe(area);
    } else visible = true;
    mq.addEventListener("change", function () { bodies = null; attach(); });
    var t;
    window.addEventListener("resize", function () {
      clearTimeout(t);
      t = setTimeout(function () { if (mq.matches && bodies) { bodies = scatter(els()); kick(); } }, 200);
    });
  }

  window.Float = { attach: attach, bind: bind };
})();
