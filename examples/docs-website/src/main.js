import { Nano66 } from "nano66";

let nano = null;

// DOM Elements
const sliderCount = document.getElementById("slider-count");
const sliderSize = document.getElementById("slider-size");
const sliderSpeed = document.getElementById("slider-speed");
const selectMode = document.getElementById("select-mode");
const selectTheme = document.getElementById("select-theme");
const selectColor = document.getElementById("select-color");

const valCount = document.getElementById("val-count");
const valSize = document.getElementById("val-size");
const valSpeed = document.getElementById("val-speed");

const btnRestart = document.getElementById("btn-apply-restart");
const btnPause = document.getElementById("btn-pause-resume");
const btnSkip = document.getElementById("btn-skip-anim");
const engineStatus = document.getElementById("engine-status");
const themeToggle = document.getElementById("theme-toggle");

// Slider listeners
sliderCount?.addEventListener("input", (e) => {
  if (valCount) valCount.innerText = e.target.value;
});

sliderSize?.addEventListener("input", (e) => {
  if (valSize) valSize.innerText = `${parseFloat(e.target.value).toFixed(1)}px`;
});

sliderSpeed?.addEventListener("input", (e) => {
  if (valSpeed) valSpeed.innerText = `${parseFloat(e.target.value).toFixed(1)}x`;
});

// Theme switcher
themeToggle?.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", next);
});

function initNanoAnimation() {
  if (nano) {
    nano.destroy();
    nano = null;
  }

  const count = parseInt(sliderCount?.value || "4000", 10);
  const sizeVal = parseFloat(sliderSize?.value || "2.0");
  const speed = parseFloat(sliderSpeed?.value || "1.2");
  const mode = selectMode?.value || "sequential";
  const theme = selectTheme?.value || "auto";
  const colorChoice = selectColor?.value || "auto";

  nano = new Nano66({
    target: "#docs-main",
    theme,
    animation: {
      mode,
      elementDelay: 220,
      cursorExit: true,
      revealThreshold: 0.8,
    },
    particles: {
      count,
      size: [Math.max(1.0, sizeVal - 0.5), sizeVal + 0.8],
      color: colorChoice,
      speed,
      glow: true,
    },
  });

  nano.on("ready", () => {
    if (engineStatus) engineStatus.innerText = "Ready";
  });

  nano.on("start", () => {
    if (engineStatus) engineStatus.innerText = "Constructing...";
    if (btnPause) btnPause.disabled = false;
    if (btnSkip) btnSkip.disabled = false;
  });

  nano.on("stateChange", (state) => {
    if (engineStatus) {
      if (state === "attracting") engineStatus.innerText = "Absorbing dust...";
      if (state === "completed") engineStatus.innerText = "Completed";
      if (state === "paused") engineStatus.innerText = "Paused";
    }
  });

  nano.on("complete", () => {
    if (engineStatus) engineStatus.innerText = "Interactive";
    if (btnPause) btnPause.disabled = true;
    if (btnSkip) btnSkip.disabled = true;
  });

  nano.start().catch((err) => {
    console.error("[Nano66-Docs] Animation failed:", err);
  });
}

btnRestart?.addEventListener("click", () => {
  initNanoAnimation();
});

btnPause?.addEventListener("click", () => {
  if (!nano) return;
  if (nano.getState() === "paused") {
    nano.resume();
    btnPause.innerText = "⏸ Pause";
  } else {
    nano.pause();
    btnPause.innerText = "▶ Resume";
  }
});

btnSkip?.addEventListener("click", () => {
  nano?.skip();
});

// Auto-start on load
initNanoAnimation();
