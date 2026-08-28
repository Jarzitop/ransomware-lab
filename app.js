// ============================================================
// ESTADO (persistido en localStorage)
// ============================================================
const STORAGE_KEY = "regalo6meses_v1";

function cargarEstado(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) throw new Error("no state");
    return JSON.parse(raw);
  }catch(e){
    return { cartasLeidas: [], puzzleResuelto: false };
  }
}
function guardarEstado(){
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
  }catch(e){ /* almacenamiento no disponible, se sigue sin persistir */ }
}
let estado = cargarEstado();

// ============================================================
// SONIDO SUAVE DE "PÁGINA" (generado, sin archivos externos)
// ============================================================
let audioCtx = null;
function sonidoPagina(){
  try{
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if(audioCtx.state === "suspended") audioCtx.resume();
    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(520, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + 0.18);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.06, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t + 0.24);
  }catch(e){ /* audio no disponible, seguimos sin sonido */ }
}

// ============================================================
// UTILIDADES
// ============================================================
function normalizar(str){
  return str
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // quita acentos
    .replace(/\s+/g, " ")
    .trim();
}
function mostrarEscena(id){
  document.querySelectorAll(".scene").forEach(s => s.classList.remove("scene--active"));
  document.getElementById(id).classList.add("scene--active");
}


// ============================================================
// FONDO ESPACIAL V2 — estrellas reales, parallax y fugaces
// ============================================================
function initSpaceBackground(){
  const canvas = document.getElementById("starfield");
  const space = document.getElementById("space-bg");
  if(!canvas || !space) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  if(!ctx) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let width = 0;
  let height = 0;
  let stars = [];
  let shootingStar = null;
  let nextShootingStarAt = performance.now() + 4500 + Math.random() * 5500;

  function randomStar(){
    const roll = Math.random();
    const radius = roll > .985 ? 1.9 : roll > .90 ? 1.15 : .45 + Math.random() * .55;
    const tintRoll = Math.random();
    const tint = tintRoll < .11 ? [196, 211, 255] : tintRoll > .91 ? [255, 231, 186] : [244, 244, 250];
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      radius,
      alpha: .22 + Math.random() * .72,
      phase: Math.random() * Math.PI * 2,
      speed: .00035 + Math.random() * .00115,
      tint,
      depth: .25 + Math.random() * .95
    };
  }

  function resize(){
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const count = Math.min(340, Math.max(135, Math.round((width * height) / 5600)));
    stars = Array.from({length: count}, randomStar);
    if(reduceMotion) draw(performance.now());
  }

  function spawnShootingStar(now){
    const fromLeft = Math.random() > .25;
    shootingStar = {
      start: now,
      duration: 900 + Math.random() * 650,
      x: fromLeft ? width * (.08 + Math.random() * .45) : width * (.55 + Math.random() * .35),
      y: height * (.08 + Math.random() * .32),
      vx: (fromLeft ? 1 : -1) * (170 + Math.random() * 120),
      vy: 88 + Math.random() * 70,
      length: 70 + Math.random() * 85
    };
    nextShootingStarAt = now + 8000 + Math.random() * 10000;
  }

  function draw(now){
    ctx.clearRect(0,0,width,height);

    for(const star of stars){
      const pulse = reduceMotion ? 1 : .82 + Math.sin(now * star.speed + star.phase) * .18;
      const alpha = Math.max(.08, star.alpha * pulse);
      const [r,g,b] = star.tint;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI*2);
      ctx.fill();

      if(star.radius > 1.45){
        const glow = ctx.createRadialGradient(star.x,star.y,0,star.x,star.y,star.radius*6);
        glow.addColorStop(0, `rgba(${r},${g},${b},${alpha * .34})`);
        glow.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(star.x,star.y,star.radius*6,0,Math.PI*2);
        ctx.fill();
      }
    }

    if(!reduceMotion && now >= nextShootingStarAt && !shootingStar) spawnShootingStar(now);
    if(shootingStar){
      const t = (now - shootingStar.start) / shootingStar.duration;
      if(t >= 1){
        shootingStar = null;
      }else{
        const ease = 1 - Math.pow(1-t,2);
        const x = shootingStar.x + shootingStar.vx * ease;
        const y = shootingStar.y + shootingStar.vy * ease;
        const mag = Math.hypot(shootingStar.vx, shootingStar.vy) || 1;
        const ux = shootingStar.vx / mag;
        const uy = shootingStar.vy / mag;
        const tailX = x - ux * shootingStar.length;
        const tailY = y - uy * shootingStar.length;
        const gradient = ctx.createLinearGradient(x,y,tailX,tailY);
        const opacity = Math.sin(Math.PI * t) * .72;
        gradient.addColorStop(0, `rgba(255,247,220,${opacity})`);
        gradient.addColorStop(.18, `rgba(212,220,255,${opacity*.58})`);
        gradient.addColorStop(1, "rgba(212,220,255,0)");
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.15;
        ctx.beginPath();
        ctx.moveTo(x,y);
        ctx.lineTo(tailX,tailY);
        ctx.stroke();
      }
    }

    if(!reduceMotion) requestAnimationFrame(draw);
  }

  function parallax(e){
    if(reduceMotion) return;
    const nx = (e.clientX / window.innerWidth - .5);
    const ny = (e.clientY / window.innerHeight - .5);
    space.style.setProperty("--space-x", `${nx * -8}px`);
    space.style.setProperty("--space-y", `${ny * -6}px`);
    space.style.setProperty("--nebula-x", `${nx * 15}px`);
    space.style.setProperty("--nebula-y", `${ny * 10}px`);
    space.style.setProperty("--nebula-x2", `${nx * -18}px`);
    space.style.setProperty("--nebula-y2", `${ny * -12}px`);
  }

  resize();
  if(!reduceMotion) requestAnimationFrame(draw);
  window.addEventListener("resize", resize, {passive:true});
  window.addEventListener("pointermove", parallax, {passive:true});
}

// ============================================================
// ESCENA 1 — LIBRO (portada tipo Enter)
// ============================================================
function initBook(){
  let i = 0;
  let animando = false;
  const textEl = document.getElementById("book-text");
  const continueBtn = document.getElementById("book-continue");
  const sceneBook = document.getElementById("scene-book");

  function render(){
    animando = true;
    textEl.classList.add("is-flipping");
    sonidoPagina();
    setTimeout(() => {
      textEl.textContent = PORTADA[i];
      textEl.classList.remove("is-flipping");
      animando = false;
    }, 220);
  }

  function terminarLibro(){
    sceneBook.onclick = null;
    continueBtn.onclick = null;
    document.removeEventListener("keydown", onKeyDown);
    mostrarEscena("scene-map");
    initMap();
  }

  function avanzar(){
    if(animando) return;
    i++;
    if(i >= PORTADA.length){
      terminarLibro();
      return;
    }
    render();
  }

  function onKeyDown(e){
    if(e.key !== "Enter" || e.repeat) return;
    if(!sceneBook.classList.contains("scene--active")) return;
    e.preventDefault();
    avanzar();
  }

  continueBtn.onclick = avanzar;
  sceneBook.onclick = (e) => {
    if(e.target === continueBtn) return;
    avanzar();
  };
  document.addEventListener("keydown", onKeyDown);

  render();
}

// ============================================================
// ESCENA 2 — CONSTELACIÓN
// ============================================================
function posicionesConstelacion(n){
  // Distribuye n puntos en una curva suave tipo constelación,
  // no en línea recta (aunque el "27" del día se repite siempre).
  const pts = [];
  for(let i=0; i<n; i++){
    const t = i / (n - 1);
    const x = 10 + t * 80; // 10% -> 90%
    const y = 50 + Math.sin(t * Math.PI * 1.4) * 26 + (i % 2 === 0 ? -6 : 6);
    pts.push({ x, y: Math.max(12, Math.min(88, y)) });
  }
  return pts;
}

function fechaCorta(fechaISO){
  const [y, m, d] = fechaISO.split("-");
  const meses = ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"];
  return `${meses[parseInt(m,10)-1]} · ${d}`;
}

function coordenadaFecha(fechaISO){
  const [, m, d] = fechaISO.split("-");
  return `${m} · ${d}`;
}

function initMap(){
  const container = document.getElementById("constellation-points");
  const svg = document.getElementById("constellation-lines");
  // limpia solo los puntos previos y el contenido del svg,
  // sin tocar el propio elemento svg (está anidado en container)
  container.querySelectorAll(".star-point").forEach(el => el.remove());
  svg.innerHTML = "";

  const cartasOrdenadas = [...CARTAS].sort((a,b) => a.id - b.id);
  const posiciones = posicionesConstelacion(cartasOrdenadas.length);

  // segmentos de conexión: la constelación se "enciende" a medida que se leen cartas
  ajustarSvgViewBox(svg, container);
  for(let idx=1; idx<posiciones.length; idx++){
    const a = posiciones[idx-1];
    const b = posiciones[idx];
    const segment = document.createElementNS("http://www.w3.org/2000/svg", "path");
    segment.classList.add("constellation-segment");
    segment.dataset.fromId = cartasOrdenadas[idx-1].id;
    segment.dataset.toId = cartasOrdenadas[idx].id;
    segment.setAttribute("d", `M ${a.x} ${a.y} L ${b.x} ${b.y}`);
    svg.appendChild(segment);
  }

  // puntos
  cartasOrdenadas.forEach((carta, idx) => {
    const p = posiciones[idx];
    const btn = document.createElement("button");
    btn.className = "star-point";
    btn.style.left = p.x + "%";
    btn.style.top = p.y + "%";
    btn.dataset.cartaId = carta.id;
    if(estado.cartasLeidas.includes(carta.id)) btn.classList.add("is-read");

    btn.innerHTML = `
      <span class="star-point__coord">${coordenadaFecha(carta.fecha)}</span>
      <span class="star-point__dot"></span>
      <span class="star-point__label">${carta.titulo}</span>
    `;
    btn.addEventListener("click", () => {
      document.querySelectorAll(".star-point.is-selected").forEach(el => el.classList.remove("is-selected"));
      btn.classList.add("is-selected");
      setTimeout(() => abrirCarta(carta.id), 140);
    });
    container.appendChild(btn);
  });

  actualizarLineasConstelacion();
  actualizarProgreso();
}

function actualizarLineasConstelacion(){
  document.querySelectorAll(".constellation-segment").forEach(segment => {
    const fromId = Number(segment.dataset.fromId);
    const toId = Number(segment.dataset.toId);
    const active = estado.cartasLeidas.includes(fromId) && estado.cartasLeidas.includes(toId);
    segment.classList.toggle("is-active", active);
  });
}

function ajustarSvgViewBox(svg, container){
  // usa coordenadas 0-100 tanto en x como y para que el path en % funcione
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("preserveAspectRatio", "none");
}

function actualizarProgreso(){
  const total = CARTAS.length;
  const leidas = estado.cartasLeidas.length;
  document.getElementById("map-progress").textContent = `${leidas} / ${total} cartas leídas`;

  const scene = document.getElementById("scene-map");
  const complete = leidas === total;
  scene.classList.toggle("is-complete", complete);
  if(complete){
    mostrarPanelRespuesta();
  }
}

// ---- Modal de carta ----
let cartaActualId = null;

function abrirCarta(id){
  cartaActualId = id;
  const carta = CARTAS.find(c => c.id === id);
  const yaLeida = estado.cartasLeidas.includes(id);

  document.getElementById("carta-fecha").textContent = `${carta.mes} · ${fechaCorta(carta.fecha)}`;
  document.getElementById("carta-titulo").textContent = carta.titulo;
  document.getElementById("carta-texto").textContent = carta.texto;

  // fotos
  [1,2].forEach(n => {
    const slot = document.getElementById(`photo-slot-${n}`);
    const img = document.getElementById(`photo-${n}`);
    img.src = carta.fotos[n-1] || "";
    img.alt = `Foto ${n} — ${carta.titulo}`;
    slot.classList.toggle("is-revealed", yaLeida);
  });

  // canción
  const songEl = document.getElementById("carta-song");
  songEl.innerHTML = "";
  if(carta.spotifyUrl){
    const embedUrl = convertirSpotifyEmbed(carta.spotifyUrl);
    songEl.innerHTML = `<iframe src="${embedUrl}" width="100%" height="80" frameborder="0" allow="encrypted-media" loading="lazy"></iframe>`;
  }

  const btnLeida = document.getElementById("btn-marcar-leida");
  btnLeida.textContent = yaLeida ? "ya leída ✓" : "marcar como leída";
  btnLeida.disabled = yaLeida;

  document.getElementById("carta-modal").classList.remove("is-hidden");
}

function convertirSpotifyEmbed(url){
  // convierte un link normal de Spotify en uno embebible
  return url.replace("open.spotify.com/", "open.spotify.com/embed/");
}

function cerrarCarta(){
  document.getElementById("carta-modal").classList.add("is-hidden");
  document.querySelectorAll(".star-point.is-selected").forEach(el => el.classList.remove("is-selected"));
  cartaActualId = null;
}

function marcarComoLeida(){
  if(cartaActualId === null) return;
  if(!estado.cartasLeidas.includes(cartaActualId)){
    estado.cartasLeidas.push(cartaActualId);
    guardarEstado();
  }

  // revela fotos con fundido
  [1,2].forEach(n => {
    document.getElementById(`photo-slot-${n}`).classList.add("is-revealed");
  });
  document.getElementById("btn-marcar-leida").textContent = "ya leída ✓";
  document.getElementById("btn-marcar-leida").disabled = true;

  // actualiza el punto en el mapa
  const pt = document.querySelector(`.star-point[data-carta-id="${cartaActualId}"]`);
  if(pt) pt.classList.add("is-read");
  actualizarLineasConstelacion();

  renderPistas();
  actualizarProgreso();
}

// ---- Panel de pistas ----
function renderPistas(){
  const list = document.getElementById("clue-list");
  const pistasDesbloqueadas = PISTAS.filter(p => estado.cartasLeidas.includes(p.revelaEnCarta));
  list.innerHTML = pistasDesbloqueadas
    .sort((a,b) => a.orden - b.orden)
    .map(p => `<div class="clue-item"><span class="clue-item__n">${p.orden}·</span>${p.texto}</div>`)
    .join("") || `<div class="clue-item">Lee tu primera carta para desbloquear la primera pista.</div>`;
}

function renderPuzzleVisual(){
  const puzzle = document.getElementById("answer-puzzle");
  if(!puzzle) return;

  const letras = RESPUESTA_FINAL.replace(/\s+/g, "");
  puzzle.innerHTML = "";

  letras.split("").forEach((_, idx) => {
    if(idx === 2){
      const gap = document.createElement("span");
      gap.className = "answer-puzzle__gap";
      gap.setAttribute("aria-hidden", "true");
      puzzle.appendChild(gap);
    }
    const slot = document.createElement("span");
    slot.className = "answer-puzzle__slot";
    slot.textContent = "";
    puzzle.appendChild(slot);
  });
}

function actualizarPuzzleDesdeInput(valor){
  const letras = valor.toUpperCase().replace(/[^A-ZÁÉÍÓÚÜÑ]/g, "").slice(0, 7);
  const slots = document.querySelectorAll(".answer-puzzle__slot");
  slots.forEach((slot, idx) => {
    const letra = letras[idx] || "";
    slot.textContent = letra;
    slot.classList.toggle("has-value", Boolean(letra));
  });
}

function mostrarPanelRespuesta(){
  renderPuzzleVisual();
  document.getElementById("answer-box").classList.remove("is-hidden");
  const input = document.getElementById("answer-input");
  actualizarPuzzleDesdeInput(input.value);
}

// ---- Validar respuesta final ----
function initAnswerBox(){
  const input = document.getElementById("answer-input");
  const btn = document.getElementById("answer-submit");
  const feedback = document.getElementById("answer-feedback");

  function intentar(){
    const val = normalizar(input.value).replace(/\s+/g, "");
    const correcta = normalizar(RESPUESTA_FINAL).replace(/\s+/g, "");
    if(val === correcta){
      estado.puzzleResuelto = true;
      guardarEstado();
      feedback.textContent = "✓ correcto";
      feedback.className = "answer-box__feedback is-success";
      setTimeout(() => {
        mostrarEscena("scene-final");
        initFinal();
      }, 700);
    }else{
      feedback.textContent = "no es eso todavía — sigue buscando";
      feedback.className = "answer-box__feedback is-error";
    }
  }
  btn.addEventListener("click", intentar);
  input.addEventListener("input", () => actualizarPuzzleDesdeInput(input.value));
  input.addEventListener("keydown", e => { if(e.key === "Enter") intentar(); });
}

function initMapListeners(){
  document.getElementById("carta-close").onclick = cerrarCarta;
  document.getElementById("carta-backdrop").onclick = cerrarCarta;
  document.getElementById("btn-marcar-leida").onclick = marcarComoLeida;

  const toggle = document.getElementById("clue-toggle");
  const list = document.getElementById("clue-list");
  toggle.addEventListener("click", () => {
    const collapsed = list.classList.toggle("is-collapsed");
    toggle.setAttribute("aria-expanded", String(!collapsed));
  });

  initAnswerBox();
}

// ============================================================
// ESCENA 3 — CARTA FINAL
// ============================================================
function initFinal(){
  const el = document.getElementById("final-letter-text");
  el.textContent = CARTA_FINAL;
  requestAnimationFrame(() => el.classList.add("is-visible"));
}

// ============================================================
// ARRANQUE
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  initSpaceBackground();
  initMapListeners();
  renderPistas();
  if(estado.cartasLeidas.length === CARTAS.length){
    mostrarPanelRespuesta();
  }

  // La experiencia empieza directamente en la portada/libro.
  initBook();
});
