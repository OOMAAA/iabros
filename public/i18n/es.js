/* Español (Chile). [[palabra]] = chip verde · ~~palabra~~ = tachado */
window.IABROS_I18N = window.IABROS_I18N || {};
window.IABROS_I18N["es"] = {
  meta: {
    title: "IA Bros · IA para video, producción y broadcast",
    description: "Profesionales de broadcast, animación y publicidad llevando la IA generativa a producción real. IA local, flujos a medida, entrega 4K."
  },
  nav: { skip: "Saltar al contenido", services: "Servicios", tools: "Herramientas", engine: "Motor", process: "Proceso", work: "Trabajos", team: "Equipo", cta: "Hablemos", menu: "Menú" },
  hero: {
    kicker: "IA y 3D para video, producción, publicidad y broadcast · Santiago de Chile",
    stack: "Trabajamos con",
    line1: "Venimos del control.",
    line2: "Vamos a la IA.",
    body: "Somos profesionales de broadcast, animación y publicidad. Llevamos la IA generativa a producción real: modelos de vanguardia corriendo en local, flujos hechos a la medida y entrega 4K lista para aire.",
    cta1: "Cuéntanos tu proyecto",
    cta2: "Ver trabajos",
    regen: "Regenerar"
  },
  marquee: ["IA local", "4K con consistencia", "ComfyUI", "Post · Motion · VFX", "Broadcast", "Flujos a medida", "Imagen a 3D", "Automatización"],
  manifesto: {
    label: "Quiénes somos",
    text: "No somos ~~prompt bros~~. Somos gente de [[post]], [[motion]], [[VFX]] y [[control]] que aprendió a domar la IA, y la mete a producción de verdad.",
    body: "Generar una imagen bonita es fácil. Lo difícil es mantener la consistencia, entregar en 4K, editarlo, integrarlo al flujo del canal y que salga al aire sin drama. Eso hacemos: programación, branding, diseño, publicidad, integración e implementación en un solo equipo."
  },
  services: {
    title: "Lo que ponemos al aire",
    intro: "Cada proyecto tiene su propio flujo. No usamos una receta: armamos la que tu pega necesita.",
    items: [
      { tag: "video", title: "Video e imagen IA en 4K", body: "Generación con consistencia de personajes, estilo y marca de toma a toma. Pensado para pantalla grande, no solo para el feed.", kw: ["4K", "Consistencia", "Personajes", "Marca"] },
      { tag: "post", title: "Post, motion y VFX", body: "Lo generado no sale crudo: lo editamos, componemos y terminamos con calidad de broadcast o publicidad.", kw: ["Edición", "Composición", "Motion graphics", "Color"] },
      { tag: "flujos", title: "Flujos de trabajo a medida", body: "Diseñamos pipelines en ComfyUI para tu caso puntual: el modelo correcto, los pasos correctos, y que se pueda repetir mañana.", kw: ["ComfyUI", "Pipelines", "Repetible"] },
      { tag: "3d", title: "De tu idea al 3D", body: "Generamos el concept con IA, lo modelamos y lo texturizamos con una malla limpia, a la medida de lo que necesites. Listo para tu escenografía, set virtual o motor de render.", kw: ["Concept con IA", "Modelado", "Texturizado", "Sets virtuales"] },
      { tag: "apps", title: "Herramientas para broadcast", body: "Software propio para gráfica en tiempo real, redes a pantalla, comerciales y croma, todo potenciado con IA.", kw: ["Tiempo real", "OCR + IA", "ORODGFX", "Croma"] },
      { tag: "auto", title: "Automatización e implementación", body: "Entramos a tu operación, entendemos cómo funciona y automatizamos con IA lo que hoy se hace a mano. En cualquier rubro: solo necesitamos conocerte.", kw: ["Consultoría", "Integración", "Cualquier rubro"] }
    ]
  },
  tools: {
    title: "Software hecho por gente que ha vivido un cierre",
    intro: "Apps que ya construimos para problemas reales de broadcast. Las implementamos en tu operación o las adaptamos a lo que necesites.",
    hint: "Elige una pantalla para mandarla al aire.",
    onAir: "Al aire",
    items: [
      { name: "Motor gráfico online", tag: "Tiempo real", body: "Como un Viz, pero en el navegador. Modo Express: tiras tu información y arma paquetes gráficos en tiempo real. Modo Studio: subes tu gráfica, la animas y la dejas operando." },
      { name: "Panel de gráfica en vivo", tag: "OCR", body: "Panel online para lanzar gráfica al aire, con OCR que lee los datos y llena los elementos solo." },
      { name: "Redes a pantalla", tag: "Render", body: "Pegas un post, una URL o hasta una captura vieja: saca el avatar, el texto, las fotos y los videos, lo anima todo y lo deja listo para render en broadcast." },
      { name: "Huinchas comerciales", tag: "Matrox", body: "Prepara comerciales para emitir en Viz Artist en códec Matrox, por watchfolder o desde la app. Cortas, previsualizas y ves el proceso en vivo." },
      { name: "Croma con IA", tag: "Key", body: "Recorte asistido por IA para el croma difícil: pelo, transparencias y luz complicada." },
      { name: "Estudios virtuales 3D", tag: "3D", body: "Sets virtuales generados desde fotos y referencias, listos para tu motor de render." }
    ]
  },
  engine: {
    title: "IA local. Fierro propio.",
    body: "ComfyUI como base y un flujo distinto para cada situación. Elegimos el modelo que mejor resuelve cada toma y lo corremos en nuestra propia máquina: más control, más iteraciones y tu material bajo nuestro techo. Y LLMs locales para escribir prompts, programar nuestras herramientas y automatizar.",
    nodes: {
      input: { title: "Entrada", rows: ["Brief", "Imagen", "Video", "Marca"] },
      llm: { title: "LLM local", chips: ["Qwen3-Coder", "gpt-oss", "DeepSeek", "Devstral", "Gemma", "Llama"], rows: ["Prompts", "Código", "Automatización"] },
      gen: { title: "Generación", chips: ["FLUX", "Qwen-Image", "Z-Image", "Wan", "LTX", "MiniMax", "+ lo que salga mañana"] },
      upscale: { title: "Upscale", chips: ["SeedVR2", "SUPIR", "Real-ESRGAN", "4x-UltraSharp"], rows: ["Salida 4K"] },
      post: { title: "Post", chips: ["Edición", "Motion", "VFX", "Color"] },
      output: { title: "Salida", rows: ["Al aire en vivo", "Publicidad", "Redes y web", "Apps e integraciones"] }
    },
    hint: "Así trabajamos. Arrastra los nodos desde su barra o suelta un cable desde una entrada: si el flujo se rompe, se pone rojo.",
    solve: "Armar flujo",
    shuffle: "Desarmar",
    ok: "Flujo completo · al aire",
    broken: "Flujo roto · conecta los nodos",
    hw: "La máquina",
    rig: [["2×", "NVIDIA RTX"], ["256 GB", "RAM"], ["Intel", "Xeon"], ["8×", "discos"], ["100%", "local"]]
  },
  process: {
    title: "Solo necesitamos conocerte",
    fix: "Ordenar",
    ok: "Secuencia en orden · lista para aire",
    broken: "Secuencia desordenada · arrastra los clips",
    hint: "Arrastra un clip encima de cualquier otro, o toca uno y después otro, para cambiarlos de lugar.",
    pos: "posición",
    steps: [
      { title: "Te conocemos", body: "Nos cuentas cómo trabajas, qué produces y dónde se te va el tiempo o la plata." },
      { title: "Diseñamos el flujo", body: "Elegimos modelos, herramientas y pasos. Te mostramos pruebas antes de comprometer nada." },
      { title: "Producimos o implementamos", body: "Hacemos la pieza o montamos la herramienta en tu operación, conectada con lo que ya usas." },
      { title: "Al aire", body: "Entregamos listo para emitir o publicar, y seguimos afinando contigo." }
    ]
  },
  work: {
    title: "Ya renderizado",
    intro: "Lo que ya hicimos, terminado y en alta. Elige un trabajo y mándalo al aire.",
    note: "Las líneas marcadas como muestra se reemplazan por trabajos reales en data/work.js.",
    filters: {"all": "Todo", "video": "Video", "3d": "3D", "web": "Web", "app": "Apps", "impl": "Implementación"},
    onair: "Al aire", next: "Sigue", sample: "Muestra", cta: "Ver proyecto",
    items: {
      orodgfx: { title: "ORODGFX", client: "Producto propio", body: "Pegas un post o una URL y sale una gráfica animada lista para broadcast: avatar, textos, fotos y video, directo a render." },
      motor: { title: "Motor gráfico online", client: "Producto propio", body: "Paquetes gráficos en tiempo real desde el navegador. Modo Express para armar al toque y modo Studio para animar tu propia gráfica." },
      huinchas: { title: "Huinchas comerciales", client: "Producto propio", body: "Comerciales al códec Matrox para Viz Artist, por watchfolder o desde la app, con vista previa y proceso en vivo." },
      spot: { title: "Spot IA en 4K", client: "Muestra", body: "Aquí va un spot o video generado con IA y terminado en post, con consistencia de personaje y marca." },
      set3d: { title: "Set virtual desde concept", client: "Muestra", body: "Aquí va un set: del concept generado con IA al modelo 3D texturizado, integrado en el motor de render." },
      sitio: { title: "Sitio web", client: "Muestra", body: "Aquí va una web hecha por el equipo, con link para verla en vivo." },
      flujo: { title: "Flujo IA en operación", client: "Muestra", body: "Aquí va una implementación: un proceso del cliente automatizado con IA local." }
    }
  },
  team: {
    title: "Los bros",
    intro: "Tres, a veces cuatro. Broadcast, animación y publicidad en el mismo equipo.",
    access: "Todo acceso",
    photo: "Foto",
    roles: [
      "Gráfica en tiempo real, 3D y Vizrt Artist · Diseñador UI/UX",
      "Diseñador de motion graphics 3D y Viz Artist · Gráfica en tiempo real",
      "Artista visual y motion designer · Dirección de arte, fotografía e IA generativa"
    ]
  },
  contact: {
    title: "¿Qué quieres poner al aire?",
    body: "Cuéntanos qué haces y dónde se te va el tiempo. Te proponemos el flujo, la herramienta o la pieza que lo resuelve."
  },
  footer: { city: "Santiago de Chile" }
};
