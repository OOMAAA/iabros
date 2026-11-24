/* i18n en el navegador.
   Cada idioma tiene su propia URL (/, /en/, /zh-hans/, /zh-hant/) generada por Astro con los textos ya puestos.
   Aquí solo: saber el idioma de la página, rellenar lo que dibuja JS y recordar la elección del usuario. */
(function () {
  var DICT = window.IABROS_I18N || {};
  var KEY = "iabros-lang";
  var root = document.documentElement;
  var BASE = window.IABROS_BASE || "/";
  var PATHS = { "es": "", "en": "en/", "zh-Hans": "zh-hans/", "zh-Hant": "zh-hant/" };
  var current = root.lang in PATHS ? root.lang : "es";
  var listeners = [];

  function get(obj, path) {
    return path.split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, obj);
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  /* [[x]] → chip, ~~x~~ → tachado. Se escapa primero: nunca entra HTML crudo */
  function rich(s) {
    return esc(s).replace(/\[\[(.+?)\]\]/g, "<mark>$1</mark>").replace(/~~(.+?)~~/g, "<s>$1</s>");
  }

  /* si el usuario eligió otro idioma antes y entra a la portada, lo llevamos a su idioma.
     Solo con elección guardada: así Google y quien llega por primera vez ven la URL que pidieron. */
  try {
    var saved = localStorage.getItem(KEY);
    var atRoot = location.pathname === BASE || location.pathname === BASE + "index.html";
    if (atRoot && saved && saved !== current && PATHS[saved] != null) location.replace(BASE + PATHS[saved] + location.hash);
  } catch (e) {}

  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[data-lang]");
    if (!a) return;
    try { localStorage.setItem(KEY, a.getAttribute("data-lang")); } catch (err) {}
    if (location.hash) a.href = a.href.split("#")[0] + location.hash;
  });

  function apply() {
    var d = DICT[current];
    if (!d) return;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = get(d, el.getAttribute("data-i18n"));
      if (v != null && el.textContent !== v) el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var v = get(d, el.getAttribute("data-i18n-html"));
      if (v != null) el.innerHTML = rich(v);
    });
    listeners.forEach(function (fn) { fn(d, current); });
  }

  window.I18N = {
    apply: apply,
    detect: function () { return current; },
    on: function (fn) { listeners.push(fn); },
    current: function () { return current; },
    esc: esc,
    rich: rich
  };
})();
