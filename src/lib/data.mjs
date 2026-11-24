/* Lee en build los mismos archivos que usa el navegador (public/i18n, public/data),
   así hay una sola fuente de verdad para textos y datos. */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const PUB = path.resolve("public");
const win = {};
for (const f of ["i18n/es.js", "i18n/en.js", "i18n/zh-hans.js", "i18n/zh-hant.js", "data/team.js", "data/stack.js", "data/work.js"]) {
  vm.runInNewContext(fs.readFileSync(path.join(PUB, f), "utf8"), { window: win });
}

export const I18N = win.IABROS_I18N;
export const TEAM = win.IABROS_TEAM;
export const STACK = win.IABROS_STACK;
export const WORK = win.IABROS_WORK;

export const LOCALES = [
  { code: "es", path: "", file: "es", og: "es_CL", label: "ES", name: "Español" },
  { code: "en", path: "en/", file: "en", og: "en_US", label: "EN", name: "English" },
  { code: "zh-Hans", path: "zh-hans/", file: "zh-hans", og: "zh_CN", label: "简体", name: "简体中文" },
  { code: "zh-Hant", path: "zh-hant/", file: "zh-hant", og: "zh_TW", label: "繁體", name: "繁體中文" }
];

export const get = (obj, key) => key.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const rich = (s) => esc(s).replace(/\[\[(.+?)\]\]/g, "<mark>$1</mark>").replace(/~~(.+?)~~/g, "<s>$1</s>");

/* versión para romper caché de los scripts de public/ */
export const V = "2611c";
