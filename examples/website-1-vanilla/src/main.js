import { Nano66 } from "nano66";

// Initialize Nano66 on the website
const nano = new Nano66({
  target: "#page-wrapper",
  theme: "auto",
  animation: {
    mode: "sequential",
    elementDelay: 200,
    cursorExit: true,
    revealThreshold: 0.8,
  },
  particles: {
    count: 3500,
    speed: 1.15,
    glow: true,
  },
  performance: {
    preset: "balanced",
    adaptive: true,
  },
});

// Expose on window for manual verification & debugging
window.nanoInstance = nano;

// Controls & Status
const statusPill = document.getElementById("status-pill");
const btnRestart = document.getElementById("btn-restart");
const btnPause = document.getElementById("btn-pause");
const btnSkip = document.getElementById("btn-skip");
const btnTheme = document.getElementById("btn-theme");

nano.on("ready", () => {
  if (statusPill) statusPill.innerText = "Ready";
});

nano.on("start", () => {
  if (statusPill) statusPill.innerText = "Constructing...";
});

nano.on("elementStart", (el) => {
  if (statusPill && nano.getState() === "constructing") {
    statusPill.innerText = `Building ${el.type}...`;
  }
});

nano.on("stateChange", (state) => {
  if (statusPill) {
    if (state === "attracting") statusPill.innerText = "Absorbing dust...";
    if (state === "completed") statusPill.innerText = "Interactive";
    if (state === "paused") statusPill.innerText = "Paused";
  }
});

nano.on("complete", () => {
  if (statusPill) statusPill.innerText = "Constructed";
  if (btnPause) btnPause.disabled = true;
  if (btnSkip) btnSkip.disabled = true;
});

// Hook up buttons
btnRestart?.addEventListener("click", () => {
  if (btnPause) {
    btnPause.innerText = "⏸ Pause";
    btnPause.disabled = false;
  }
  if (btnSkip) btnSkip.disabled = false;
  nano.restart();
});

btnPause?.addEventListener("click", () => {
  if (nano.getState() === "paused") {
    nano.resume();
    btnPause.innerText = "⏸ Pause";
  } else {
    nano.pause();
    btnPause.innerText = "▶ Resume";
  }
});

btnSkip?.addEventListener("click", () => {
  nano.skip();
});

btnTheme?.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", next);
});

// Auto-start construction animation
nano.start().catch((err) => {
  console.error("[Nano66] Animation start error:", err);
});
