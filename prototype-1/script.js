// Crip Time Clock — numerals distort per selected bodily feeling; hands stay mechanical.

const CENTER = 150;
const BASE_RADIUS = 118;

const DEFAULT_PARAMS = {
  thetaAmp: 0, thetaFreq: 1, thetaPhase: 0,
  rBias: 0, rAmp: 0, rFreq: 1, rPhase: 0,
  scaleBase: 1, scaleAmp: 0, scaleFreq: 1, scalePhase: 0,
  opacityBase: 1, opacityAmp: 0, opacityFreq: 1, opacityPhase: 0,
};

const FEELINGS = [
  { value: "present", label: "Present / neutral", params: {} },
  {
    value: "exhausted", label: "Exhausted",
    params: { thetaAmp: 16, thetaFreq: 0.9, rBias: -4, rAmp: 10, rFreq: 0.9,
      scaleBase: 0.95, scaleAmp: 0.35, scaleFreq: 0.9, scalePhase: Math.PI,
      opacityBase: 0.75, opacityAmp: 0.25, opacityFreq: 0.9, opacityPhase: 0.5 },
  },
  {
    value: "anxious", label: "Anxious",
    params: { thetaAmp: 10, thetaFreq: 2.7, rAmp: 8, rFreq: 3.3, rPhase: 1.2,
      scaleAmp: 0.15, scaleFreq: 2.7, scalePhase: 0.4,
      opacityBase: 0.9, opacityAmp: 0.1, opacityFreq: 3.1 },
  },
  {
    value: "foggy", label: "Foggy",
    params: { thetaAmp: 6, thetaFreq: 0.5, rBias: 12, rAmp: 10, rFreq: 0.4,
      scaleAmp: 0.1, scaleFreq: 0.5,
      opacityBase: 0.55, opacityAmp: 0.2, opacityFreq: 0.6 },
  },
  {
    value: "pain", label: "In pain",
    params: { thetaAmp: 20, thetaFreq: 1.7, thetaPhase: 0.3, rAmp: 16, rFreq: 1.1, rPhase: 0.8,
      scaleAmp: 0.4, scaleFreq: 1.7,
      opacityBase: 0.85, opacityAmp: 0.15, opacityFreq: 1.1 },
  },
  {
    value: "restless", label: "Restless",
    params: { thetaAmp: 18, thetaFreq: 2.3, rAmp: 12, rFreq: 1.9,
      scaleAmp: 0.2, scaleFreq: 2.3,
      opacityBase: 0.9, opacityAmp: 0.1, opacityFreq: 1.9, opacityPhase: 0.5 },
  },
  {
    value: "calm", label: "Calm",
    params: { rBias: 6, scaleBase: 1.12 },
  },
  {
    value: "energized", label: "Energized",
    params: { thetaAmp: 4, thetaFreq: 3, rBias: -10, rAmp: 4, rFreq: 3,
      scaleBase: 1.08, scaleAmp: 0.08, scaleFreq: 3 },
  },
  {
    value: "overwhelmed", label: "Overwhelmed",
    params: { thetaAmp: 26, thetaFreq: 1.4, thetaPhase: 0.2, rAmp: 22, rFreq: 2.2, rPhase: 1,
      scaleAmp: 0.45, scaleFreq: 1.4, scalePhase: 1.5,
      opacityBase: 0.7, opacityAmp: 0.3, opacityFreq: 2.2 },
  },
  {
    value: "numb", label: "Numb",
    params: { scaleBase: 0.8, opacityBase: 0.4 },
  },
];

function distort(i, p) {
  const theta = p.thetaAmp * Math.sin(i * p.thetaFreq + p.thetaPhase);
  const r = p.rBias + p.rAmp * Math.sin(i * p.rFreq + p.rPhase);
  const scale = p.scaleBase + p.scaleAmp * Math.sin(i * p.scaleFreq + p.scalePhase);
  const rawOpacity = p.opacityBase + p.opacityAmp * Math.sin(i * p.opacityFreq + p.opacityPhase);
  const opacity = Math.min(1, Math.max(0.2, rawOpacity));
  return { theta, r, scale, opacity };
}

function hourNumber(i) {
  return i === 0 ? 12 : i;
}

const numeralsGroup = document.getElementById("numerals");
const numeralEls = [];

for (let i = 0; i < 12; i++) {
  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("class", "numeral");
  text.setAttribute("x", CENTER);
  text.setAttribute("y", CENTER);
  text.textContent = hourNumber(i);
  numeralsGroup.appendChild(text);
  numeralEls.push(text);
}

function renderNumerals(feelingValue) {
  const feeling = FEELINGS.find((f) => f.value === feelingValue) || FEELINGS[0];
  const params = { ...DEFAULT_PARAMS, ...feeling.params };

  numeralEls.forEach((el, i) => {
    const baseAngleDeg = i * 30 - 90;
    const { theta, r, scale, opacity } = distort(i, params);
    const angleRad = ((baseAngleDeg + theta) * Math.PI) / 180;
    const radius = BASE_RADIUS + r;
    const dx = radius * Math.cos(angleRad);
    const dy = radius * Math.sin(angleRad);

    el.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
    el.style.opacity = opacity;
  });
}

const hourHand = document.getElementById("hour-hand");
const minuteHand = document.getElementById("minute-hand");
const secondHand = document.getElementById("second-hand");

// --- Tick sound (Web Audio, no external files) ---

let audioCtx = null;
let soundEnabled = false;
let lastTickSecond = null;

function ensureAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function playTick(isTock) {
  const ctx = ensureAudio();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "square";
  osc.frequency.value = isTock ? 740 : 880;
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.06);
}

const soundToggle = document.getElementById("sound-toggle");
soundToggle.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  if (soundEnabled) ensureAudio();
  soundToggle.setAttribute("aria-pressed", String(soundEnabled));
  soundToggle.textContent = soundEnabled ? "🔊 Tick sound: on" : "🔈 Tick sound: off";
});

function renderHands() {
  const now = new Date();
  const h = now.getHours() % 12;
  const m = now.getMinutes();
  const s = now.getSeconds();

  const hourAngle = (h + m / 60) * 30;
  const minuteAngle = (m + s / 60) * 6;
  const secondAngle = s * 6;

  hourHand.setAttribute("transform", `rotate(${hourAngle}, ${CENTER}, ${CENTER})`);
  minuteHand.setAttribute("transform", `rotate(${minuteAngle}, ${CENTER}, ${CENTER})`);
  secondHand.setAttribute("transform", `rotate(${secondAngle}, ${CENTER}, ${CENTER})`);

  if (soundEnabled && s !== lastTickSecond) {
    lastTickSecond = s;
    playTick(s % 2 === 0);
  }
}

const feelingSelect = document.getElementById("feeling-select");

FEELINGS.forEach((f) => {
  const option = document.createElement("option");
  option.value = f.value;
  option.textContent = f.label;
  feelingSelect.appendChild(option);
});

feelingSelect.addEventListener("change", () => {
  renderNumerals(feelingSelect.value);
});

renderNumerals(feelingSelect.value);
renderHands();
setInterval(renderHands, 1000);

// --- Reflection log (session-only) ---

const reflectionForm = document.getElementById("reflection-form");
const reflectionText = document.getElementById("reflection-text");
const reflectionLog = document.getElementById("reflection-log");
const entries = [];

function renderLog() {
  reflectionLog.innerHTML = "";
  entries.forEach((entry) => {
    const li = document.createElement("li");

    const meta = document.createElement("span");
    meta.className = "entry-meta";
    meta.innerHTML = `${entry.time} &middot; <span class="entry-feeling">${entry.feelingLabel}</span>`;

    const text = document.createElement("p");
    text.className = "entry-text";
    text.textContent = entry.text;

    li.appendChild(meta);
    li.appendChild(text);
    reflectionLog.appendChild(li);
  });
}

reflectionForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = reflectionText.value.trim();
  if (!text) return;

  const feeling = FEELINGS.find((f) => f.value === feelingSelect.value) || FEELINGS[0];
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  entries.unshift({ time, feelingLabel: feeling.label, text });
  renderLog();
  reflectionText.value = "";
});
