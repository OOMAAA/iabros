/* Trabajos que salen en la pauta. Los textos (título, cliente, descripción) van en i18n/*.js → work.items[id].
   type: video | 3d | web | app | impl
   url:   link al proyecto (null = sin botón)
   media: imagen o video en assets/work/ (null = el monitor dibuja el título en pixeles)
   sample: true = contenido de muestra, para reemplazar por trabajos reales */
window.IABROS_WORK = [
  { id: "orodgfx",  type: "app",   year: 2026, url: null, media: null },
  { id: "motor",    type: "web",   year: 2026, url: null, media: null },
  { id: "huinchas", type: "impl",  year: 2026, url: null, media: null },
  { id: "spot",     type: "video", year: 2026, url: null, media: null, sample: true },
  { id: "set3d",    type: "3d",    year: 2026, url: null, media: null, sample: true },
  { id: "sitio",    type: "web",   year: 2026, url: null, media: null, sample: true },
  { id: "flujo",    type: "impl",  year: 2026, url: null, media: null, sample: true }
];
