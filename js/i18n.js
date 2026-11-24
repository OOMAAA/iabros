/* i18n: detecta idioma, aplica textos y avisa a quien renderiza listas */
(function () {
  var DICT = window.IABROS_I18N || {};
  var LANGS = ["es", "en", "zh-Hans", "zh-Hant"];
  var KEY = "iabros-lang";
  var current = "es";
  var listeners = [];

  function get(obj, path) {
    return path.split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, obj);
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  /* [[x]] → chip verde, ~~x~~ → tachado. Se escapa primero: nunca entra HTML crudo */
  function rich(s) {
    return esc(s)
      .replace(/\[\[(.+?)\]\]/g, "<mark>$1</mark>")
      .replace(/~~(.+?)~~/g, "<s>$1</s>");
  }

  function detect() {
    try {
      var saved = localStorage.getItem(KEY);
      if (LANGS.indexOf(saved) > -1) return saved;
    } catch (e) {}
    var prefs = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || "es"];
    for (var i = 0; i < prefs.length; i++) {
      var l = String(prefs[i]).toLowerCase();
      if (/^zh-(tw|hk|mo|hant)/.test(l)) return "zh-Hant";
      if (l.indexOf("zh") === 0) return "zh-Hans";
      if (l.indexOf("en") === 0) return "en";
      if (l.indexOf("es") === 0) return "es";
    }
    return "es";
  }

  function apply(lang) {
    if (!DICT[lang]) lang = "es";
    current = lang;
    var d = DICT[lang];
    document.documentElement.lang = lang;
    document.title = d.meta.title;
    var md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute("content", d.meta.description);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = get(d, el.getAttribute("data-i18n"));
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var v = get(d, el.getAttribute("data-i18n-html"));
      if (v != null) el.innerHTML = rich(v);
    });
    document.querySelectorAll("[data-lang]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang));
    });
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    listeners.forEach(function (fn) { fn(d, lang); });
  }

  window.I18N = {
    apply: apply,
    detect: detect,
    on: function (fn) { listeners.push(fn); },
    current: function () { return current; },
    esc: esc,
    rich: rich
  };
})();
