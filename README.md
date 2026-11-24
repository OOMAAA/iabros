# IA Bros — web

Sitio en **Astro**: HTML estático por idioma, rápido y listo para SEO.

## Usar

```bash
npm install
npm run dev       # desarrollo en http://localhost:4321
npm run build     # genera dist/
npm run preview   # sirve dist/ para revisarla
```

> Ya no se abre con doble clic en `index.html`: usa `npm run dev` o `npm run preview`.

## Idiomas (cada uno con su URL)

| Idioma | URL | Textos |
|---|---|---|
| Español | `/` | `public/i18n/es.js` |
| English | `/en/` | `public/i18n/en.js` |
| 简体中文 | `/zh-hans/` | `public/i18n/zh-hans.js` |
| 繁體中文 | `/zh-hant/` | `public/i18n/zh-hant.js` |

Los mismos archivos de textos sirven para el build (HTML que ve Google) y para el navegador.

## Estructura

```
astro.config.mjs        dominio (site) y base; sitemap por idioma
src/
  layouts/Base.astro    <head>: SEO, hreflang, Open Graph, JSON-LD, tipografías, scripts
  components/Page.astro la página completa, prerenderizada
  pages/                index (es), en/, zh-hans/, zh-hant/
  lib/data.mjs          carga textos y datos en build
  styles/               tokens, base, componentes, secciones
public/
  i18n/                 textos por idioma
  data/                 team.js (equipo), stack.js (logos), work.js (trabajos)
  js/                   interacción: hero, juegos, glitch, colores, etc.
  assets/               fotos del equipo, íconos
  og/                   imágenes para compartir (1200×630) por idioma
  robots.txt  site.webmanifest  favicon.ico
.github/workflows/      deploy automático a GitHub Pages
```

## SEO incluido
- Una URL por idioma con `hreflang` y `x-default`, canonical y `sitemap-index.xml`.
- Título y descripción por idioma (`meta` en cada archivo de `public/i18n/`).
- Open Graph y X (Twitter) con imagen por idioma.
- Datos estructurados (JSON-LD): organización, sitio, página y miembros del equipo con LinkedIn/Behance.
- Tipografías chinas solo en las páginas en chino.

## Antes de publicar
1. `astro.config.mjs` → `site` con el dominio real (hoy `https://iabros.cl`). Si va en `usuario.github.io/repo`, pon `base: "/repo"`.
2. `public/robots.txt` → misma URL del sitemap.
3. Correo y WhatsApp reales en `src/components/Page.astro` (sección contacto).
4. Trabajos reales en `public/data/work.js` + textos en `work.items` de cada idioma.
5. Logos del stack en `public/assets/logos/` + rutas en `public/data/stack.js`.

## Probar colores
Agrega `#verde`, `#cian`, `#magenta` o `#limon` a la URL para partir con ese color.
