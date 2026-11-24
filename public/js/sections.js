/* Render de listas por idioma: marquee, servicios, multiviewer, timeline, equipo */
(function () {
  var $ = function (s) { return document.querySelector(s); };
  var esc = function (s) { return window.I18N.esc(s); };
  var state = { open: -1, tile: 0 };
  var dict = null;

  /* marquee: dos mitades idénticas para que el loop no salte */
  function marquee(d) {
    var half = d.marquee.concat(d.marquee).map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("");
    $("#marquee").innerHTML = half + half;
  }

  /* servicios: acordeón accesible, un panel abierto a la vez */
  function services(d) {
    var plus = '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>';
    $("#services-list").innerHTML = d.services.items.map(function (s, i) {
      var open = i === state.open;
      return '<li><h3><button class="acc__btn" type="button" id="acc-b' + i + '" aria-expanded="' + open + '" aria-controls="acc-p' + i + '">' +
        '<span class="acc__title">' + esc(s.title) + '</span><span class="acc__tag">' + esc(s.tag) + '</span>' +
        '<span class="acc__ico" aria-hidden="true">' + plus + '</span></button></h3>' +
        '<div class="acc__panel" id="acc-p' + i + '" role="region" aria-labelledby="acc-b' + i + '" data-open="' + open + '"' + (open ? "" : " inert") + '><div>' +
        '<div class="acc__inner"><p>' + esc(s.body) + '</p><div class="acc__kw">' +
        s.kw.map(function (k) { return "<span>" + esc(k) + "</span>"; }).join("") +
        '</div></div></div></div></li>';
    }).join("");
  }
  function toggle(i, force) {
    state.open = force !== undefined ? force : (state.open === i ? -1 : i);
    document.querySelectorAll(".acc__btn").forEach(function (b, j) {
      var on = j === state.open;
      b.setAttribute("aria-expanded", String(on));
      var p = document.getElementById("acc-p" + j);
      p.setAttribute("data-open", String(on));
      if (on) p.removeAttribute("inert"); else p.setAttribute("inert", "");
    });
  }

  /* herramientas: multiviewer; la pantalla elegida pasa a "al aire" */
  function tools(d) {
    var t = d.tools;
    $("#mv").innerHTML = t.items.map(function (o, i) {
      var on = i === state.tile;
      return '<button class="tile" type="button" data-i="' + i + '" aria-pressed="' + on + '" aria-controls="mv-detail">' +
        '<span class="tile__meter" aria-hidden="true"><i></i><i></i></span>' +
        '<span class="tile__screen"><span class="tile__name">' + esc(o.name) + '</span></span>' +
        '<span class="tile__umd"><span>CH' + (i + 1) + '</span><span class="tile__tally">' + esc(on ? t.onAir : o.tag) + '</span></span>' +
        '</button>';
    }).join("");
    var cur = t.items[state.tile];
    $("#mv-detail").innerHTML = '<h3>' + esc(cur.name) + '</h3><p>' + esc(cur.body) + '</p><p class="mv__hint">' + esc(t.hint) + '</p>';
  }

  /* proceso: pasos bajo la línea de tiempo (la línea de tiempo vive en js/timeline.js) */
  var CLIP_W = [22, 28, 32, 18];
  function process(d) {
    var tc = function (s) { return "00:00:" + (s < 10 ? "0" : "") + s + ":00"; };
    var acc = 0;
    $("#steps").innerHTML = d.process.steps.map(function (p, i) {
      var t = tc(Math.round(acc * 0.5)); acc += CLIP_W[i];
      return '<li><time>' + t + '</time><h3>' + esc(p.title) + '</h3><p>' + esc(p.body) + '</p></li>';
    }).join("");
  }

  /* equipo: credenciales de prensa. Nombres y links son iguales en todos los idiomas;
     img: ruta en assets/team/ (null = placeholder); eyes: [top %, alto %] de la franja glitch sobre los ojos */
  var TEAM = window.IABROS_TEAM || [];
  var ROT = [-2, 1.5, -1, 2.2];
  function team(d) {
    var t = d.team;
    $("#passes").innerHTML = TEAM.map(function (p, i) {
      var photo = p.img
        ? '<img class="pass__img" src="' + esc((window.IABROS_BASE || '') + p.img) + '" width="400" height="400" alt="' + esc(p.name) + '">'
        : esc(t.photo);
      return '<li class="pass" style="--rot:' + ROT[i % ROT.length] + 'deg">' +
        '<div class="pass__access"><span>IA BROS</span></div>' +
        '<div class="pass__photo' + (p.img ? ' pass__photo--img' : '') + '"' + (p.eyes ? ' style="--ey:' + p.eyes[0] + '%;--eh:' + p.eyes[1] + '%"' : '') + '>' + photo + '</div>' +
        '<div><h3 class="pass__name">' + esc(p.first) + (p.nick ? ' <span class="pass__nick">“' + esc(p.nick) + '”</span> ' : ' ') + esc(p.last) + '</h3><p class="pass__role">' + esc(t.roles[i] || "") + '</p>' +
        (p.exp ? '<p class="pass__exp">' + esc(p.exp) + '</p>' : "") + '</div>' +
        '<div class="pass__links"><a class="pass__in" href="' + esc(p.url) + '" target="_blank" rel="noopener">LinkedIn<span class="sr"> · ' + esc(p.name) + '</span></a>' +
        (p.behance ? '<a class="pass__in" href="' + esc(p.behance) + '" target="_blank" rel="noopener">Behance<span class="sr"> · ' + esc(p.name) + '</span></a>' : '') + '</div>' +
        '<div class="pass__bar" aria-hidden="true"></div></li>';
    }).join("");
  }

  /* stack: nombres en tipografía propia. Para usar logos oficiales, deja el SVG
     en assets/logos/ y pon su ruta en logo (ej: "assets/logos/blender.svg") */
  var STACK = window.IABROS_STACK || [];
  function stack() {
    if ($("#stack").children.length) return;
    $("#stack").innerHTML = STACK.map(function (t) {
      return "<li>" + (t.logo ? '<img src="' + esc((window.IABROS_BASE || '') + t.logo) + '" alt="' + esc(t.name) + '">' : esc(t.name)) + "</li>";
    }).join("");
  }

  function render(d) {
    stack();
    dict = d;
    marquee(d); services(d); tools(d); process(d); team(d);
  }

  function bind() {
    /* parte todo cerrado; con mouse se abre al pasar encima y se cierra al salir de la lista.
       En touch o teclado, se abre/cierra tocando. */
    var list = $("#services-list");
    list.addEventListener("click", function (e) {
      var b = e.target.closest(".acc__btn");
      if (b) toggle(+b.id.replace("acc-b", ""));
    });
    list.addEventListener("pointerover", function (e) {
      if (e.pointerType !== "mouse") return;
      var b = e.target.closest(".acc__btn");
      if (!b) return;
      var i = +b.id.replace("acc-b", "");
      if (state.open !== i) toggle(i, i);
    });
    list.addEventListener("pointerleave", function (e) {
      if (e.pointerType === "mouse" && state.open !== -1) toggle(-1, -1);
    });
    $("#mv").addEventListener("click", function (e) {
      var b = e.target.closest(".tile");
      if (!b) return;
      state.tile = +b.getAttribute("data-i");
      tools(dict);
      var again = $('#mv .tile[data-i="' + state.tile + '"]');
      if (again) again.focus();
    });
  }

  window.Sections = { render: render, bind: bind };
})();
