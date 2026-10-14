// The Shredder — one click slices the calendar into strips and drops them into the bin.

const stage = document.getElementById("stage");
const calendarEl = document.getElementById("calendar");
const stripLayer = document.getElementById("strip-layer");
const shredderSlot = document.querySelector(".shredder-slot");
const bin = document.querySelector(".bin");
const cleanupBtn = document.getElementById("cleanup-btn");

const STRIP_COUNT = 12;
let shredded = false;

// --- Shred sound (Web Audio, no external files) ---

let audioCtx = null;

function ensureAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function playShredSound(durationMs) {
  const ctx = ensureAudio();
  const duration = durationMs / 1000;

  const bufferSize = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 1100;
  filter.Q.value = 0.8;

  const wobble = ctx.createOscillator();
  wobble.frequency.value = 13;
  const wobbleGain = ctx.createGain();
  wobbleGain.gain.value = 350;
  wobble.connect(wobbleGain).connect(filter.frequency);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 0.08);
  gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + Math.max(duration - 0.2, 0.1));
  gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + duration);

  noise.connect(filter).connect(gain).connect(ctx.destination);
  noise.start();
  wobble.start();
  noise.stop(ctx.currentTime + duration);
  wobble.stop(ctx.currentTime + duration);
}

function triggerShred() {
  if (shredded) return;
  shredded = true;

  const stageRect = stage.getBoundingClientRect();
  const calRect = calendarEl.getBoundingClientRect();
  const binRect = bin.getBoundingClientRect();

  const calLeft = calRect.left - stageRect.left;
  const calTop = calRect.top - stageRect.top;
  const binTop = binRect.top - stageRect.top;

  const stripWidth = calRect.width / STRIP_COUNT;
  const fallDistance = binTop - calTop + 30;

  for (let i = 0; i < STRIP_COUNT; i++) {
    const strip = document.createElement("div");
    strip.className = "strip";
    strip.style.left = `${calLeft + i * stripWidth}px`;
    strip.style.top = `${calTop}px`;
    strip.style.width = `${stripWidth}px`;
    strip.style.height = `${calRect.height}px`;

    const clone = calendarEl.cloneNode(true);
    clone.removeAttribute("id");
    clone.removeAttribute("tabindex");
    clone.removeAttribute("role");
    clone.removeAttribute("aria-label");
    clone.style.position = "absolute";
    clone.style.top = "0";
    clone.style.left = `${-i * stripWidth}px`;
    clone.style.width = `${calRect.width}px`;

    strip.appendChild(clone);
    stripLayer.appendChild(strip);
  }

  calendarEl.style.visibility = "hidden";
  calendarEl.setAttribute("aria-disabled", "true");

  const totalDuration = STRIP_COUNT * 45 + 900;
  playShredSound(totalDuration);

  requestAnimationFrame(() => {
    const strips = stripLayer.querySelectorAll(".strip");
    strips.forEach((strip, i) => {
      const delay = i * 45;
      const drift = (Math.random() - 0.5) * 18;
      const rotate = (Math.random() - 0.5) * 26;
      strip.style.transition = `transform 900ms cubic-bezier(.4,0,.7,1) ${delay}ms, opacity 700ms ease ${delay + 400}ms`;
      strip.style.transform = `translate(${drift}px, ${fallDistance}px) rotate(${rotate}deg)`;
      strip.style.opacity = "0.9";
    });
  });

  setTimeout(() => {
    cleanupBtn.hidden = false;
  }, totalDuration);
}

function cleanUp() {
  stripLayer.innerHTML = "";
  calendarEl.style.visibility = "visible";
  calendarEl.removeAttribute("aria-disabled");
  shredded = false;
  cleanupBtn.hidden = true;
}

calendarEl.addEventListener("click", triggerShred);
calendarEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    triggerShred();
  }
});
cleanupBtn.addEventListener("click", cleanUp);
