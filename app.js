// ============================================================
// ESTADO
// ============================================================
const STORAGE_KEY = "regalo6meses_v1";
const DEFAULT_STATE = {
  cartasLeidas: [],
  puzzleResuelto: false,
  zoomVisto: false,
  poemasDesbloqueados: []
};

function cargarEstado(){
  try{
    if(new URLSearchParams(location.search).get("reset") === "1"){
      localStorage.removeItem(STORAGE_KEY);
      history.replaceState(null, "", location.pathname);
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return structuredClone(DEFAULT_STATE);
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(DEFAULT_STATE),
      ...parsed,
      cartasLeidas: Array.isArray(parsed.cartasLeidas) ? parsed.cartasLeidas : [],
      poemasDesbloqueados: Array.isArray(parsed.poemasDesbloqueados) ? parsed.poemasDesbloqueados : []
    };
  }catch{
    return structuredClone(DEFAULT_STATE);
  }
}

let estado = cargarEstado();

function guardarEstado(){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(estado)); }
  catch{ /* La experiencia sigue aunque localStorage no esté disponible. */ }
}

// ============================================================
// UTILIDADES
// ============================================================
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

function normalizar(str){
  return String(str || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function mostrarEscena(id){
  document.querySelectorAll(".scene").forEach(scene => scene.classList.remove("scene--active"));
  document.getElementById(id)?.classList.add("scene--active");
}

function fechaCorta(fechaISO){
  const [, m, d] = fechaISO.split("-");
  const meses = ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"];
  return `${meses[Number(m)-1]} · ${d}`;
}

function coordenadaFecha(fechaISO){
  const [, m, d] = fechaISO.split("-");
  return `${m} · ${d}`;
}

function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }

// ============================================================
// AUDIO GENERADO (sin archivos)
// ============================================================
let audioCtx = null;
function getAudioCtx(){
  try{
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if(audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  }catch{ return null; }
}

function sonidoPagina(){
  const ctx = getAudioCtx();
  if(!ctx) return;
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(500, t);
  osc.frequency.exponentialRampToValueAtTime(190, t + 0.18);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.045, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.24);
}

function sonidoSecreto(){
  const ctx = getAudioCtx();
  if(!ctx) return;
  const now = ctx.currentTime;
  [659.25, 830.61, 987.77].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    const start = now + i * 0.075;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.035, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.28);
    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.3);
  });
}

// ============================================================
// FONDO V3 — tsParticles Slim + fallback CSS + parallax rAF
// ============================================================
async function initSpaceBackground(){
  const space = document.getElementById("space-bg");
  const mobile = matchMedia("(max-width: 700px)").matches;
  const lowPower = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || mobile;

  if(window.tsParticles && window.loadSlim){
    try{
      await window.loadSlim(window.tsParticles);
      await window.tsParticles.load({
        id: "tsparticles",
        options: {
          fullScreen: { enable: false },
          fpsLimit: reduceMotion ? 1 : (lowPower ? 30 : 45),
          pauseOnBlur: true,
          pauseOnOutsideViewport: true,
          detectRetina: true,
          background: { color: "transparent" },
          particles: {
            number: {
              value: reduceMotion ? 55 : (mobile ? 68 : 105),
              density: { enable: true, width: 1280, height: 800 }
            },
            color: { value: ["#f7f7fb", "#cbd8ff", "#ffe9bb"] },
            opacity: {
              value: { min: 0.18, max: 0.72 },
              animation: { enable: !reduceMotion, speed: 0.18, sync: false }
            },
            size: { value: { min: 0.55, max: 1.75 } },
            shape: { type: "circle" },
            move: {
              enable: !reduceMotion,
              speed: 0.075,
              direction: "none",
              random: true,
              straight: false,
              outModes: { default: "out" }
            }
          },
          interactivity: {
            detectsOn: "window",
            events: {
              onHover: { enable: !reduceMotion && !isCoarsePointer, mode: "bubble" },
              resize: { enable: true }
            },
            modes: {
              bubble: { distance: 85, size: 2.5, duration: 1.2, opacity: 0.92 }
            }
          }
        }
      });
      space?.classList.add("has-particles");
    }catch(err){
      console.warn("tsParticles no cargó; se usa el fondo CSS de respaldo.", err);
    }
  }

  if(!space || reduceMotion || isCoarsePointer) return;
  let scheduled = false;
  let px = 0;
  let py = 0;

  window.addEventListener("pointermove", (event) => {
    px = event.clientX;
    py = event.clientY;
    if(scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      const nx = px / innerWidth - 0.5;
      const ny = py / innerHeight - 0.5;
      space.style.setProperty("--space-x", `${nx * -6}px`);
      space.style.setProperty("--space-y", `${ny * -5}px`);
      space.style.setProperty("--nebula-x", `${nx * 18}px`);
      space.style.setProperty("--nebula-y", `${ny * 11}px`);
      space.style.setProperty("--nebula-x2", `${nx * -15}px`);
      space.style.setProperty("--nebula-y2", `${ny * -9}px`);
    });
  }, { passive: true });
}

// ============================================================
// PORTADA
// ============================================================
function initBook(){
  let index = 0;
  let animando = false;
  const textEl = document.getElementById("book-text");
  const continueBtn = document.getElementById("book-continue");
  const scene = document.getElementById("scene-book");

  function render(){
    if(!textEl) return;
    animando = true;
    textEl.classList.add("is-flipping");
    sonidoPagina();
    setTimeout(() => {
      textEl.textContent = PORTADA[index];
      textEl.classList.remove("is-flipping");
      animando = false;
    }, reduceMotion ? 0 : 220);
  }

  function terminar(){
    scene.onclick = null;
    continueBtn.onclick = null;
    document.removeEventListener("keydown", onKeyDown);
    mostrarEscena("scene-map");
    initMap();
    scheduleSpecialComet();
  }

  function avanzar(){
    if(animando) return;
    index += 1;
    if(index >= PORTADA.length) return terminar();
    render();
  }

  function onKeyDown(event){
    if(event.key !== "Enter" || event.repeat || !scene.classList.contains("scene--active")) return;
    event.preventDefault();
    avanzar();
  }

  continueBtn.onclick = avanzar;
  scene.onclick = (event) => {
    if(event.target.closest("#book-secret") || event.target === continueBtn) return;
    avanzar();
  };
  document.addEventListener("keydown", onKeyDown);
  render();
}

// ============================================================
// CONSTELACIÓN
// ============================================================
const CONSTELLATION_POINTS = [
  {x: 11, y: 52},
  {x: 26, y: 73},
  {x: 40, y: 68},
  {x: 53, y: 79},
  {x: 66, y: 50},
  {x: 80, y: 43},
  {x: 91, y: 19}
];

let mapInicializado = false;
let cartaActualId = null;

function initMap(){
  const container = document.getElementById("constellation-points");
  const svg = document.getElementById("constellation-lines");
  if(!container || !svg) return;

  container.querySelectorAll(".star-point").forEach(el => el.remove());
  svg.innerHTML = "";
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("preserveAspectRatio", "none");

  const cartas = [...CARTAS].sort((a,b) => a.id - b.id);

  for(let i = 1; i < CONSTELLATION_POINTS.length; i++){
    const a = CONSTELLATION_POINTS[i-1];
    const b = CONSTELLATION_POINTS[i];
    const midX = (a.x + b.x) / 2;
    const bend = i % 2 === 0 ? -2.5 : 2.5;
    const midY = (a.y + b.y) / 2 + bend;
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.classList.add("constellation-segment");
    path.dataset.fromId = cartas[i-1].id;
    path.dataset.toId = cartas[i].id;
    path.setAttribute("d", `M ${a.x} ${a.y} Q ${midX} ${midY} ${b.x} ${b.y}`);
    svg.appendChild(path);
  }

  cartas.forEach((carta, index) => {
    const p = CONSTELLATION_POINTS[index];
    const button = document.createElement("button");
    button.type = "button";
    button.className = "star-point";
    button.style.left = `${p.x}%`;
    button.style.top = `${p.y}%`;
    button.dataset.cartaId = carta.id;
    button.setAttribute("aria-label", `${carta.mes}: ${carta.titulo}`);
    if(estado.cartasLeidas.includes(carta.id)) button.classList.add("is-read");

    button.innerHTML = `
      <span class="star-point__coord">${coordenadaFecha(carta.fecha)}</span>
      <span class="star-point__halo" aria-hidden="true"></span>
      <span class="star-point__dot" aria-hidden="true"></span>
      <span class="star-point__label">${carta.titulo}</span>
    `;

    button.addEventListener("click", async () => {
      document.querySelectorAll(".star-point.is-selected").forEach(el => el.classList.remove("is-selected"));
      button.classList.add("is-selected");
      await zoomPrimeraInteraccion(button);
      abrirCarta(carta.id);
    });

    container.appendChild(button);
  });

  actualizarLineasConstelacion();
  actualizarProgreso();
  posicionarEasterEggs();
  mapInicializado = true;
}

function actualizarLineasConstelacion(){
  document.querySelectorAll(".constellation-segment").forEach(segment => {
    const fromId = Number(segment.dataset.fromId);
    const toId = Number(segment.dataset.toId);
    const active = estado.cartasLeidas.includes(fromId) && estado.cartasLeidas.includes(toId);
    segment.classList.toggle("is-active", active);
  });
}

async function zoomPrimeraInteraccion(starButton){
  if(estado.zoomVisto || reduceMotion) return;
  estado.zoomVisto = true;
  guardarEstado();

  const viewport = document.getElementById("constellation-viewport");
  const points = document.getElementById("constellation-points");
  const scene = document.getElementById("scene-map");
  if(!viewport || !points || !scene) return;

  const starRect = starButton.getBoundingClientRect();
  const pointsRect = points.getBoundingClientRect();
  const originX = clamp(((starRect.left + starRect.width/2 - pointsRect.left) / pointsRect.width) * 100, 0, 100);
  const originY = clamp(((starRect.top + starRect.height/2 - pointsRect.top) / pointsRect.height) * 100, 0, 100);

  points.style.transformOrigin = `${originX}% ${originY}%`;
  scene.classList.add("is-zooming");

  const zoom = points.animate([
    { transform: "scale(1)", filter: "brightness(1) blur(0px)" },
    { transform: "scale(2.7)", filter: "brightness(1.24) blur(.15px)" }
  ], {
    duration: 920,
    easing: "cubic-bezier(.16,1,.3,1)",
    fill: "forwards"
  });

  const bg = document.getElementById("space-bg");
  const bgZoom = bg?.animate([
    { transform: "scale(1)" },
    { transform: "scale(1.09)" }
  ], { duration: 920, easing: "cubic-bezier(.16,1,.3,1)", fill: "forwards" });

  try{ await zoom.finished; }catch{}
  zoom.cancel();
  bgZoom?.cancel();
  scene.classList.remove("is-zooming");
}

function actualizarProgreso(){
  const total = CARTAS.length;
  const leidas = estado.cartasLeidas.length;
  const progress = document.getElementById("map-progress");
  if(progress) progress.textContent = `${leidas} / ${total} cartas leídas`;

  const scene = document.getElementById("scene-map");
  const complete = leidas === total;
  scene?.classList.toggle("is-complete", complete);
  if(complete) mostrarPanelRespuesta();
}

// ============================================================
// CARTAS MENSUALES
// ============================================================
function abrirCarta(id){
  cartaActualId = id;
  const carta = CARTAS.find(c => c.id === id);
  if(!carta) return;
  const yaLeida = estado.cartasLeidas.includes(id);

  document.getElementById("carta-fecha").textContent = `${carta.mes} · ${fechaCorta(carta.fecha)}`;
  document.getElementById("carta-titulo").textContent = carta.titulo;
  document.getElementById("carta-texto").textContent = carta.texto;

  [1,2].forEach(n => {
    const slot = document.getElementById(`photo-slot-${n}`);
    const img = document.getElementById(`photo-${n}`);
    img.src = carta.fotos[n-1] || "";
    img.alt = `Foto ${n} — ${carta.titulo}`;
    slot.classList.toggle("is-revealed", yaLeida);
  });

  const song = document.getElementById("carta-song");
  song.innerHTML = "";
  if(carta.spotifyUrl){
    const embed = carta.spotifyUrl.replace("open.spotify.com/", "open.spotify.com/embed/");
    song.innerHTML = `<iframe src="${embed}" width="100%" height="80" frameborder="0" allow="encrypted-media" loading="lazy" title="Canción de ${carta.mes}"></iframe>`;
  }

  const button = document.getElementById("btn-marcar-leida");
  button.textContent = yaLeida ? "ya leída ✓" : "marcar como leída";
  button.disabled = yaLeida;

  document.getElementById("carta-modal").classList.remove("is-hidden");
  document.body.classList.add("modal-open");
}

function cerrarCarta(){
  document.getElementById("carta-modal").classList.add("is-hidden");
  document.querySelectorAll(".star-point.is-selected").forEach(el => el.classList.remove("is-selected"));
  document.body.classList.remove("modal-open");
  cartaActualId = null;
}

function marcarComoLeida(){
  if(cartaActualId === null) return;
  if(!estado.cartasLeidas.includes(cartaActualId)){
    estado.cartasLeidas.push(cartaActualId);
    estado.cartasLeidas.sort((a,b) => a-b);
    guardarEstado();
  }

  [1,2].forEach(n => document.getElementById(`photo-slot-${n}`)?.classList.add("is-revealed"));
  const btn = document.getElementById("btn-marcar-leida");
  btn.textContent = "ya leída ✓";
  btn.disabled = true;

  document.querySelector(`.star-point[data-carta-id="${cartaActualId}"]`)?.classList.add("is-read");
  actualizarLineasConstelacion();
  renderPistas();
  actualizarProgreso();
}

// ============================================================
// PISTAS / PUZZLE
// ============================================================
function renderPistas(){
  const list = document.getElementById("clue-list");
  if(!list) return;
  const unlocked = PISTAS
    .filter(p => estado.cartasLeidas.includes(p.revelaEnCarta))
    .sort((a,b) => a.orden - b.orden);

  list.innerHTML = unlocked.length
    ? unlocked.map(p => `<div class="clue-item"><span class="clue-item__n">${p.orden}·</span><span>${p.texto}</span><small>${p.dificultad}</small></div>`).join("")
    : `<div class="clue-item">Lee tu primera carta para desbloquear la primera pista.</div>`;
}

function renderPuzzleVisual(){
  const puzzle = document.getElementById("answer-puzzle");
  if(!puzzle) return;
  const letters = RESPUESTA_FINAL.replace(/\s+/g, "");
  puzzle.innerHTML = "";

  letters.split("").forEach((_, index) => {
    if(index === 2){
      const gap = document.createElement("span");
      gap.className = "answer-puzzle__gap";
      gap.setAttribute("aria-hidden", "true");
      puzzle.appendChild(gap);
    }
    const slot = document.createElement("span");
    slot.className = "answer-puzzle__slot";
    puzzle.appendChild(slot);
  });
}

function actualizarPuzzleDesdeInput(value){
  const letters = value.toUpperCase().replace(/[^A-ZÁÉÍÓÚÜÑ]/g, "").slice(0, 7);
  document.querySelectorAll(".answer-puzzle__slot").forEach((slot, index) => {
    const letter = letters[index] || "";
    slot.textContent = letter;
    slot.classList.toggle("has-value", Boolean(letter));
  });
}

function mostrarPanelRespuesta(){
  renderPuzzleVisual();
  document.getElementById("answer-box")?.classList.remove("is-hidden");
  const input = document.getElementById("answer-input");
  actualizarPuzzleDesdeInput(input?.value || "");
}

function initAnswerBox(){
  const input = document.getElementById("answer-input");
  const button = document.getElementById("answer-submit");
  const feedback = document.getElementById("answer-feedback");

  function intentar(){
    const value = normalizar(input.value).replace(/\s+/g, "");
    const correct = normalizar(RESPUESTA_FINAL).replace(/\s+/g, "");
    if(value === correct){
      estado.puzzleResuelto = true;
      guardarEstado();
      feedback.textContent = "✓ correcto";
      feedback.className = "answer-box__feedback is-success";
      setTimeout(() => {
        mostrarEscena("scene-final");
        initFinal();
      }, 650);
    }else{
      feedback.textContent = "no es eso todavía — sigue buscando";
      feedback.className = "answer-box__feedback is-error";
    }
  }

  button.addEventListener("click", intentar);
  input.addEventListener("input", () => actualizarPuzzleDesdeInput(input.value));
  input.addEventListener("keydown", event => { if(event.key === "Enter") intentar(); });
}

// ============================================================
// EASTER EGGS + POEMAS
// ============================================================
let secretStarClicks = 0;
let nebulaHoverTimer = null;
let cometTimer = null;

function isPoemUnlocked(id){
  return estado.poemasDesbloqueados.includes(id);
}

function unlockPoem(id, message = "Encontraste algo que no estaba en el mapa."){
  if(!POEMAS.some(poem => poem.id === id)) return;
  const wasNew = !isPoemUnlocked(id);
  if(wasNew){
    estado.poemasDesbloqueados.push(id);
    guardarEstado();
    sonidoSecreto();
    showSecretToast(message);
  }
  updatePoemVault();
  setTimeout(() => openPoem(id), wasNew && !reduceMotion ? 650 : 0);
}

function showSecretToast(text){
  const toast = document.getElementById("secret-toast");
  toast.textContent = text;
  toast.classList.add("is-visible");
  clearTimeout(showSecretToast.timer);
  showSecretToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function openPoem(id){
  const poem = POEMAS.find(item => item.id === id);
  if(!poem || !isPoemUnlocked(id)) return;
  document.getElementById("poem-title").textContent = poem.titulo;
  document.getElementById("poem-text").textContent = poem.texto;
  document.getElementById("poem-modal").classList.remove("is-hidden");
  document.body.classList.add("modal-open");
}

function closePoem(){
  document.getElementById("poem-modal").classList.add("is-hidden");
  document.body.classList.remove("modal-open");
}

function updatePoemVault(){
  const count = estado.poemasDesbloqueados.length;
  const toggle = document.getElementById("poem-vault-toggle");
  document.getElementById("poem-count").textContent = `${count} / ${POEMAS.length}`;
  toggle.classList.toggle("is-hidden", count === 0);

  const list = document.getElementById("poem-list");
  list.innerHTML = POEMAS.map((poem, index) => {
    const unlocked = isPoemUnlocked(poem.id);
    return `<button class="poem-list__item ${unlocked ? "is-unlocked" : "is-locked"}" data-poem-id="${poem.id}" ${unlocked ? "" : "disabled"}>
      <span>${String(index + 1).padStart(2,"0")}</span>
      <strong>${unlocked ? poem.titulo : "???"}</strong>
      <small>${unlocked ? "leer" : "por encontrar"}</small>
    </button>`;
  }).join("");

  list.querySelectorAll(".is-unlocked").forEach(button => {
    button.addEventListener("click", () => openPoem(button.dataset.poemId));
  });
}

function posicionarEasterEggs(){
  const nebula = document.getElementById("egg-nebula");
  const star = document.getElementById("egg-star");
  if(!nebula || !star) return;

  // Dos zonas seguras, con un poco de azar, para no tapar puntos de la constelación.
  const seedA = 8 + Math.random() * 11;
  const seedB = 70 + Math.random() * 16;
  nebula.style.left = `${seedA}%`;
  nebula.style.top = `${18 + Math.random() * 14}%`;
  star.style.left = `${seedB}%`;
  star.style.top = `${66 + Math.random() * 11}%`;

  nebula.classList.toggle("is-found", isPoemUnlocked("corazon"));
  star.classList.toggle("is-found", isPoemUnlocked("cuerpo"));
}

function initEasterEggs(){
  document.getElementById("book-secret")?.addEventListener("click", event => {
    event.stopPropagation();
    unlockPoem("cerebro", "Había una nota escondida entre las páginas.");
    event.currentTarget.classList.add("is-found");
  });

  const nebula = document.getElementById("egg-nebula");
  const activateNebula = () => {
    if(!isPoemUnlocked("corazon")) unlockPoem("corazon", "Te quedaste mirando la nebulosa el tiempo suficiente.");
    nebula.classList.add("is-found");
  };
  nebula?.addEventListener("pointerenter", () => {
    if(isCoarsePointer || isPoemUnlocked("corazon")) return;
    clearTimeout(nebulaHoverTimer);
    nebulaHoverTimer = setTimeout(activateNebula, 1250);
  });
  nebula?.addEventListener("pointerleave", () => clearTimeout(nebulaHoverTimer));
  nebula?.addEventListener("click", activateNebula);

  const star = document.getElementById("egg-star");
  star?.addEventListener("click", () => {
    if(isPoemUnlocked("cuerpo")) return openPoem("cuerpo");
    secretStarClicks += 1;
    star.classList.add("is-awake");
    if(secretStarClicks === 1){
      showSecretToast("Esta estrella parece necesitar otra señal.");
      setTimeout(() => star.classList.remove("is-awake"), 1200);
      return;
    }
    unlockPoem("cuerpo", "La estrella respondió a la segunda vez.");
    star.classList.add("is-found");
  });

  document.getElementById("egg-comet")?.addEventListener("click", event => {
    event.stopPropagation();
    unlockPoem("ti", "Atrapaste una estrella fugaz que no debía quedarse quieta.");
    hideComet();
  });

  updatePoemVault();
}

function scheduleSpecialComet(){
  clearTimeout(cometTimer);
  if(isPoemUnlocked("ti")) return;
  const delay = 9000 + Math.random() * 9000;
  cometTimer = setTimeout(showComet, delay);
}

function showComet(){
  if(!document.getElementById("scene-map")?.classList.contains("scene--active") || isPoemUnlocked("ti")){
    return scheduleSpecialComet();
  }
  const comet = document.getElementById("egg-comet");
  comet.classList.remove("is-hidden");
  comet.style.setProperty("--comet-y", `${16 + Math.random() * 42}vh`);
  comet.classList.remove("is-flying");
  void comet.offsetWidth;
  comet.classList.add("is-flying");
  setTimeout(() => {
    hideComet();
    scheduleSpecialComet();
  }, 6200);
}

function hideComet(){
  const comet = document.getElementById("egg-comet");
  comet?.classList.remove("is-flying");
  comet?.classList.add("is-hidden");
}

function initPoemUI(){
  const vault = document.getElementById("poem-vault");
  const toggle = document.getElementById("poem-vault-toggle");
  toggle.addEventListener("click", () => {
    const opening = vault.classList.contains("is-hidden");
    vault.classList.toggle("is-hidden", !opening);
    toggle.setAttribute("aria-expanded", String(opening));
  });
  document.getElementById("poem-vault-close").addEventListener("click", () => {
    vault.classList.add("is-hidden");
    toggle.setAttribute("aria-expanded", "false");
  });
  document.getElementById("poem-close").addEventListener("click", closePoem);
  document.getElementById("poem-backdrop").addEventListener("click", closePoem);
}

// ============================================================
// LISTENERS GENERALES
// ============================================================
function initMapListeners(){
  document.getElementById("carta-close").addEventListener("click", cerrarCarta);
  document.getElementById("carta-backdrop").addEventListener("click", cerrarCarta);
  document.getElementById("btn-marcar-leida").addEventListener("click", marcarComoLeida);

  const toggle = document.getElementById("clue-toggle");
  const list = document.getElementById("clue-list");
  toggle.addEventListener("click", () => {
    const collapsed = list.classList.toggle("is-collapsed");
    toggle.setAttribute("aria-expanded", String(!collapsed));
  });

  document.addEventListener("keydown", event => {
    if(event.key !== "Escape") return;
    if(!document.getElementById("poem-modal").classList.contains("is-hidden")) closePoem();
    else if(!document.getElementById("carta-modal").classList.contains("is-hidden")) cerrarCarta();
    else document.getElementById("poem-vault")?.classList.add("is-hidden");
  });

  initAnswerBox();
}

function initFinal(){
  const el = document.getElementById("final-letter-text");
  el.textContent = CARTA_FINAL;
  requestAnimationFrame(() => el.classList.add("is-visible"));
  updatePoemVault();
}

// ============================================================
// ARRANQUE
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  initSpaceBackground();
  initMapListeners();
  initPoemUI();
  initEasterEggs();
  renderPistas();

  if(estado.cartasLeidas.length === CARTAS.length) mostrarPanelRespuesta();
  initBook();
});
