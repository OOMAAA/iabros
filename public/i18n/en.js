/* English. [[word]] = green chip · ~~word~~ = strikethrough */
window.IABROS_I18N = window.IABROS_I18N || {};
window.IABROS_I18N["en"] = {
  meta: {
    title: "IA Bros · AI for video, production and broadcast",
    description: "Broadcast, animation and advertising professionals bringing generative AI into real production. Local AI, custom workflows, 4K delivery."
  },
  nav: { skip: "Skip to content", services: "Services", tools: "Tools", engine: "Engine", process: "Process", work: "Work", team: "Team", cta: "Let’s talk", menu: "Menu" },
  hero: {
    kicker: "AI & 3D for video, production, advertising and broadcast · Santiago, Chile",
    stack: "Our stack",
    line1: "Born in the control room.",
    line2: "Built for AI.",
    body: "We’re broadcast, animation and advertising professionals bringing generative AI into real production: cutting-edge models running locally, custom-built workflows and 4K delivery ready for air.",
    cta1: "Tell us about your project",
    cta2: "See our work",
    regen: "Regenerate"
  },
  marquee: ["Local AI", "Consistent 4K", "ComfyUI", "Post · Motion · VFX", "Broadcast", "Custom workflows", "Image to 3D", "Automation"],
  manifesto: {
    label: "Who we are",
    text: "We’re not ~~prompt bros~~. We’re [[post]], [[motion]], [[VFX]] and [[control-room]] people who learned to tame AI and put it to work in real production.",
    body: "Making a pretty image is easy. The hard part is keeping it consistent, delivering in 4K, editing it, plugging it into the network’s workflow and getting it on air without drama. That’s what we do: programming, branding, design, advertising, integration and implementation in one team."
  },
  services: {
    title: "What we put on air",
    intro: "Every project gets its own workflow. No recipes: we build the one your job needs.",
    items: [
      { tag: "video", title: "AI video & images in 4K", body: "Consistent characters, style and brand from shot to shot. Built for the big screen, not just the feed.", kw: ["4K", "Consistency", "Characters", "Brand"] },
      { tag: "post", title: "Post, motion & VFX", body: "Generated footage never ships raw: we edit, composite and finish it to broadcast and advertising quality.", kw: ["Editing", "Compositing", "Motion graphics", "Color"] },
      { tag: "flows", title: "Custom workflows", body: "We design ComfyUI pipelines for your exact case: the right model, the right steps, and repeatable tomorrow.", kw: ["ComfyUI", "Pipelines", "Repeatable"] },
      { tag: "3d", title: "From your idea to 3D", body: "We generate the concept with AI, then model and texture it on a clean mesh, built to your needs. Ready for your set, virtual studio or render engine.", kw: ["AI concept", "Modeling", "Texturing", "Virtual sets"] },
      { tag: "apps", title: "Broadcast tools", body: "Our own software for real-time graphics, social-to-screen, commercials and chroma key, all powered by AI.", kw: ["Real time", "OCR + AI", "ORODGFX", "Chroma"] },
      { tag: "auto", title: "Automation & implementation", body: "We step into your operation, learn how it works and automate with AI what’s still done by hand. Any industry: we just need to get to know you.", kw: ["Consulting", "Integration", "Any industry"] }
    ]
  },
  tools: {
    title: "Software from people who’ve lived through a live deadline",
    intro: "Apps we’ve already built for real broadcast problems. We deploy them in your operation or adapt them to what you need.",
    hint: "Pick a screen to put it on air.",
    onAir: "On air",
    items: [
      { name: "Online graphics engine", tag: "Real time", body: "Like Viz, but in the browser. Express mode: drop in your info and it builds graphics packages in real time. Studio mode: upload your graphics, animate them and leave them running." },
      { name: "Live graphics panel", tag: "OCR", body: "An online panel to fire graphics to air, with OCR that reads the data and fills in the elements by itself." },
      { name: "Social to screen", tag: "Render", body: "Paste a post, a URL or even an old screenshot: it pulls the avatar, text, photos and videos, animates everything and leaves it ready to render for broadcast." },
      { name: "Commercial playout prep", tag: "Matrox", body: "Prepares commercials to air from Viz Artist in Matrox codec, via watch folder or from the app. Trim, preview and watch the process live." },
      { name: "AI chroma key", tag: "Key", body: "AI-assisted keying for tough green screen: hair, transparencies and tricky lighting." },
      { name: "3D virtual studios", tag: "3D", body: "Virtual sets generated from photos and references, ready for your render engine." }
    ]
  },
  engine: {
    title: "Local AI. Our own iron.",
    body: "ComfyUI at the core and a different workflow for every situation. We pick the model that best solves each shot and run it on our own machine: more control, more iterations and your footage under our roof. Plus local LLMs to write prompts, code our tools and automate.",
    nodes: {
      input: { title: "Input", rows: ["Brief", "Image", "Video", "Brand"] },
      llm: { title: "Local LLM", chips: ["Qwen3-Coder", "gpt-oss", "DeepSeek", "Devstral", "Gemma", "Llama"], rows: ["Prompts", "Code", "Automation"] },
      gen: { title: "Generation", chips: ["FLUX", "Qwen-Image", "Z-Image", "Wan", "LTX", "MiniMax", "+ whatever drops tomorrow"] },
      upscale: { title: "Upscale", chips: ["SeedVR2", "SUPIR", "Real-ESRGAN", "4x-UltraSharp"], rows: ["4K output"] },
      post: { title: "Post", chips: ["Edit", "Motion", "VFX", "Color"] },
      output: { title: "Output", rows: ["Live on air", "Advertising", "Social & web", "Apps & integrations"] }
    },
    hint: "This is how we work. Drag nodes by their title bar or pull a wire off an input: break the flow and it turns red.",
    solve: "Build flow",
    shuffle: "Scramble",
    ok: "Flow complete · on air",
    broken: "Broken flow · connect the nodes",
    hw: "The machine",
    rig: [["2×", "NVIDIA RTX"], ["256 GB", "RAM"], ["Intel", "Xeon"], ["8×", "drives"], ["100%", "local"]]
  },
  process: {
    title: "We just need to get to know you",
    fix: "Fix order",
    ok: "Sequence in order · ready for air",
    broken: "Sequence out of order · drag the clips",
    hint: "Drag a clip onto any other, or tap one and then another, to swap them.",
    pos: "position",
    steps: [
      { title: "We get to know you", body: "Tell us how you work, what you produce and where your time or money goes." },
      { title: "We design the workflow", body: "We choose models, tools and steps, and show you tests before committing to anything." },
      { title: "We produce or implement", body: "We make the piece or set up the tool in your operation, connected to what you already use." },
      { title: "On air", body: "We deliver ready to broadcast or publish, and keep fine-tuning with you." }
    ]
  },
  work: {
    title: "Already rendered",
    intro: "What we’ve already made, finished and full-res. Pick one and put it on air.",
    note: "Lines marked as sample get replaced with real work in data/work.js.",
    filters: {"all": "All", "video": "Video", "3d": "3D", "web": "Web", "app": "Apps", "impl": "Implementation"},
    onair: "On air", next: "Next", sample: "Sample", cta: "View project",
    items: {
      orodgfx: { title: "ORODGFX", client: "Own product", body: "Paste a post or a URL and get an animated graphic ready for broadcast: avatar, text, photos and video, straight to render." },
      motor: { title: "Online graphics engine", client: "Own product", body: "Real-time graphics packages from the browser. Express mode to build in seconds, Studio mode to animate your own graphics." },
      huinchas: { title: "Commercial playout prep", client: "Own product", body: "Commercials to Matrox codec for Viz Artist, via watch folder or from the app, with preview and live progress." },
      spot: { title: "4K AI spot", client: "Sample", body: "A spot or video generated with AI and finished in post goes here, with consistent characters and brand." },
      set3d: { title: "Virtual set from concept", client: "Sample", body: "A set goes here: from an AI-generated concept to a textured 3D model inside the render engine." },
      sitio: { title: "Website", client: "Sample", body: "A website built by the team goes here, with a link to see it live." },
      flujo: { title: "AI workflow in production", client: "Sample", body: "An implementation goes here: a client process automated with local AI." }
    }
  },
  team: {
    title: "The bros",
    intro: "Three, sometimes four. Broadcast, animation and advertising in one team.",
    access: "All access",
    photo: "Photo",
    roles: [
      "Real-Time Graphics, 3D & Vizrt Artist · UI/UX Designer",
      "3D Motion Graphics Designer & Viz Artist · Real-Time Graphics",
      "Visual Artist & Motion Designer · Art Direction, Photography & Generative AI"
    ]
  },
  contact: {
    title: "What do you want to put on air?",
    body: "Tell us what you do and where your time goes. We’ll propose the workflow, tool or piece that solves it."
  },
  footer: { city: "Santiago, Chile" }
};
