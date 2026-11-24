/* Arranque: idioma, menú móvil, hero y timecode */
(function () {
  var $ = function (s) { return document.querySelector(s); };

  /* 1. textos y listas */
  window.Sections.bind();
  window.Graph.bind();
  window.Timeline.bind();
  window.Work.bind();
  window.Float.bind();
  window.I18N.on(function (d) {
    window.Sections.render(d);
    window.Graph.render(d);
    window.Faces.attach();
    window.Float.attach();
    window.Timeline.render(d);
    window.Work.render(d);
  });
  window.I18N.apply(window.I18N.detect());

  document.querySelectorAll("[data-lang]").forEach(function (b) {
    b.addEventListener("click", function () { window.I18N.apply(b.getAttribute("data-lang")); });
  });

  /* 2. menú móvil */
  var burger = $(".burger"), menu = $("#menu");
  function setMenu(open) {
    burger.setAttribute("aria-expanded", String(open));
    menu.hidden = !open;
    document.body.style.overflow = open ? "hidden" : "";
  }
  burger.addEventListener("click", function () { setMenu(menu.hidden); });
  menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) { setMenu(false); burger.focus(); } });
  window.matchMedia("(min-width: 1081px)").addEventListener("change", function (e) { if (e.matches) setMenu(false); });

  /* 3. hero */
  window.Denoise.init($("#denoise"), { step: $("#dn-step"), seed: $("#dn-seed") });
  $("#regen").addEventListener("click", function () { window.Denoise.regen(); });

  /* 4. timecode del footer (25 fps) */
  var tcEl = $("#tc"), t0 = Date.now();
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setInterval(function () {
      var f = 10 * 3600 * 25 + Math.floor((Date.now() - t0) / 40), s = Math.floor(f / 25);
      tcEl.textContent = pad(Math.floor(s / 3600) % 24) + ":" + pad(Math.floor(s / 60) % 60) + ":" + pad(s % 60) + ":" + pad(f % 25);
    }, 40);
  }
})();
