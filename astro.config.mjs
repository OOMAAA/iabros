// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

/* site: dominio final (se usa en canonical, sitemap y tarjetas para compartir).
   base: "/" con dominio propio; "/nombre-del-repo" si se publica en usuario.github.io/nombre-del-repo */
export default defineConfig({
  site: "https://oomaaa.github.io",
  base: "/iabros",
  trailingSlash: "always",
  build: { inlineStylesheets: "auto" },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: "es",
        locales: { es: "es", en: "en", "zh-hans": "zh-Hans", "zh-hant": "zh-Hant" }
      }
    })
  ]
});
