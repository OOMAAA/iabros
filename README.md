# IA Bros — web

Sitio estático, sin build. Abre `index.html` o súbelo tal cual a GitHub Pages.

```
index.html        estructura y secciones
css/tokens.css    colores, tipos, espacios (cambia --acid y cambia la marca)
css/base.css      reset y utilidades
css/components.css header, botones, idiomas, menú móvil, marquee
css/sections.css  cada sección en orden: hero, manifiesto, servicios, herramientas, motor, proceso, equipo, contacto
js/i18n.js        detecta idioma, aplica textos, recuerda la elección
js/denoise.js     hero: logotipo que nace del ruido (canvas)
js/sections.js    marquee, servicios, multiviewer, pasos, equipo, stack
js/graph.js       motor: grafo de nodos jugable (rojo roto / flúor completo)
js/timeline.js    proceso: línea de tiempo jugable + audio vivo
js/faces.js       equipo: glitch en los ojos, color al pasar el mouse
js/float.js       equipo: credenciales flotando y chocando suave (desde 980px)
js/theme.js       color flúor (modo random con glitch, o por idioma)
js/work.js        trabajos: pauta de transmisión (rundown + monitor PGM)
data/work.js      lista de trabajos (tipo, año, link, imagen/video)
js/trail.js       rastro de pixeles del mouse en toda la página
js/main.js        arranque, menú móvil, timecode
i18n/*.js         textos: es, en, zh-hans (简体), zh-hant (繁體)
assets/team/      fotos del equipo
assets/logos/     (crear) logos del stack; rutas en STACK de js/sections.js
```

Pendiente: correo y WhatsApp reales (index.html, sección contacto: hoy son de ejemplo) y logos del stack.

## Modo de color
En `<html data-color-mode="...">` de `index.html`:
- `lang`: cada idioma su flúor (ES verde, EN cian, 简体 magenta, 繁體 amarillo).
- `random`: cada 30–40 s cambia de flúor con un glitch de pixeles.
Paleta en `js/theme.js`.
