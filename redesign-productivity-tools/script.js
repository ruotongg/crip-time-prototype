// Redesign Productivity Tools — shuffle & draw a tool, pull 3 strategies, jokers stay open as reminders.

const TOOL_CARDS = [
  { category: "Focus Technique", title: "Pomodoro Technique", desc: "25 minutes of focused work, then a 5-minute break." },
  { category: "Focus Technique", title: "Time Blocking", desc: "Assign every hour of the day a single task." },
  { category: "Lists & Calendars", title: "To-Do List", desc: "Write down every task, then cross it off." },
  { category: "Lists & Calendars", title: "Calendar", desc: "Put each commitment on a fixed date and time." },
  { category: "AI Copilot", title: "AI Copilot", desc: "An assistant that plans your day and suggests what's next." },
];

// The complete Oblique Strategies deck by Brian Eno & Peter Schmidt (1975),
// as listed at https://github.com/joelparkerhenderson/oblique-strategies
const OBLIQUE_CARDS = [
  "Abandon normal instruments",
  "Accept advice",
  "Accretion",
  "A line has two sides",
  "Allow an easement (an easement is the abandonment of a stricture)",
  "Are there sections? Consider transitions",
  "Ask people to work against their better judgement",
  "Ask your body",
  "Assemble some of the instruments in a group and treat the group",
  "Balance the consistency principle with the inconsistency principle",
  "Be dirty",
  "Breathe more deeply",
  "Bridges -build -burn",
  "Cascades",
  "Change instrument roles",
  "Change nothing and continue with immaculate consistency",
  "Children's voices -speaking -singing",
  "Cluster analysis",
  "Consider different fading systems",
  "Consult other sources -promising -unpromising",
  "Convert a melodic element into a rhythmic element",
  "Courage!",
  "Cut a vital connection",
  "Decorate, decorate",
  "Define an area as `safe' and use it as an anchor",
  "Destroy -nothing -the most important thing",
  "Discard an axiom",
  "Disconnect from desire",
  "Discover the recipes you are using and abandon them",
  "Distorting time",
  "Do nothing for as long as possible",
  "Don't be afraid of things because they're easy to do",
  "Don't be frightened of cliches",
  "Don't be frightened to display your talents",
  "Don't break the silence",
  "Don't stress one thing more than another",
  "Do something boring",
  "Do the washing up",
  "Do the words need changing?",
  "Do we need holes?",
  "Emphasize differences",
  "Emphasize repetitions",
  "Emphasize the flaws",
  "Faced with a choice, do both (given by Dieter Roth)",
  "Feedback recordings into an acoustic situation",
  "Fill every beat with something",
  "Get your neck massaged",
  "Ghost echoes",
  "Give the game away",
  "Give way to your worst impulse",
  "Go slowly all the way round the outside",
  "Honor thy error as a hidden intention",
  "How would you have done it?",
  "Humanize something free of error",
  "Imagine the music as a moving chain or caterpillar",
  "Imagine the music as a set of disconnected events",
  "Infinitesimal gradations",
  "Intentions -credibility of -nobility of -humility of",
  "Into the impossible",
  "Is it finished?",
  "Is there something missing?",
  "Is the tuning appropriate?",
  "Just carry on",
  "Left channel, right channel, centre channel",
  "Listen in total darkness, or in a very large room, very quietly",
  "Listen to the quiet voice",
  "Look at a very small object, look at its centre",
  "Look at the order in which you do things",
  "Look closely at the most embarrassing details and amplify them",
  "Lowest common denominator check -single beat -single note -single riff",
  "Make a blank valuable by putting it in an exquisite frame",
  "Make an exhaustive list of everything you might do and do the last thing on the list",
  "Make a sudden, destructive unpredictable action; incorporate",
  "Mechanicalize something idiosyncratic",
  "Mute and continue",
  "Only one element of each kind",
  "(Organic) machinery",
  "Overtly resist change",
  "Put in earplugs",
  "Remember those quiet evenings",
  "Remove ambiguities and convert to specifics",
  "Remove specifics and convert to ambiguities",
  "Repetition is a form of change",
  "Reverse",
  "Short circuit (example: a man eating peas with the idea that they will improve his virility shovels them straight into his lap)",
  "Shut the door and listen from outside",
  "Simple subtraction",
  "Spectrum analysis",
  "Take a break",
  "Take away the elements in order of apparent non-importance",
  "Tape your mouth (given by Ritva Saarikko)",
  "The inconsistency principle",
  "The tape is now the music",
  "Think of the radio",
  "Tidy up",
  "Trust in the you of now",
  "Turn it upside down",
  "Twist the spine",
  "Use an old idea",
  "Use an unacceptable color",
  "Use fewer notes",
  "Use filters",
  "Use \"unqualified\" people",
  "Water",
  "What are you really thinking about just now? Incorporate",
  "What is the reality of the situation?",
  "What mistakes did you make last time?",
  "What would your closest friend do?",
  "What wouldn't you do?",
  "Work at a different speed",
  "You are an engineer",
  "You can only make one dot at a time",
  "You don't have to be ashamed of using your own ideas",
  null, // the deck's one blank white card
];

const JOKER_CARDS = [
  "Bend the clock to your body",
  "No tech is neutral. Not all tech shall exist.",
];

// --- 1. Tool deck: shuffle, draw one card back-up, click to flip ---

const toolPile = document.getElementById("tool-pile");
const toolDrawSlot = document.getElementById("tool-draw-slot");

function drawToolCard() {
  const card = TOOL_CARDS[Math.floor(Math.random() * TOOL_CARDS.length)];

  const flip = document.createElement("div");
  flip.className = "flip-card";
  flip.tabIndex = 0;
  flip.setAttribute("role", "button");
  flip.setAttribute("aria-label", "Drawn tool card. Click to flip and reveal it.");

  const inner = document.createElement("div");
  inner.className = "flip-card-inner";

  const back = document.createElement("div");
  back.className = "flip-face back";
  const backHint = document.createElement("span");
  backHint.className = "flip-hint";
  backHint.textContent = "Click to reveal";
  back.appendChild(backHint);

  const front = document.createElement("div");
  front.className = "flip-face front";
  const cat = document.createElement("span");
  cat.className = "card-category";
  cat.textContent = card.category;
  const title = document.createElement("span");
  title.className = "card-title";
  title.textContent = card.title;
  const desc = document.createElement("span");
  desc.className = "card-desc";
  desc.textContent = card.desc;
  front.appendChild(cat);
  front.appendChild(title);
  front.appendChild(desc);

  inner.appendChild(back);
  inner.appendChild(front);
  flip.appendChild(inner);

  const toggleFlip = () => flip.classList.toggle("flipped");
  flip.addEventListener("click", toggleFlip);
  flip.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleFlip();
    }
  });

  toolDrawSlot.innerHTML = "";
  toolDrawSlot.appendChild(flip);
}

function shuffleAndDrawTool() {
  toolPile.classList.add("shuffling");
  setTimeout(() => {
    toolPile.classList.remove("shuffling");
    drawToolCard();
  }, 350);
}

toolPile.addEventListener("click", shuffleAndDrawTool);
toolPile.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    shuffleAndDrawTool();
  }
});

// --- 2. Oblique Strategies deck: draw 3 random cards face-up ---

const obliquePile = document.getElementById("oblique-pile");
const obliqueDrawRow = document.getElementById("oblique-draw-row");

function drawObliqueCards() {
  const indices = new Set();
  while (indices.size < 3) {
    indices.add(Math.floor(Math.random() * OBLIQUE_CARDS.length));
  }

  obliqueDrawRow.innerHTML = "";
  Array.from(indices).forEach((idx, i) => {
    const text = OBLIQUE_CARDS[idx];
    const card = document.createElement("div");
    card.className = text === null ? "card card-oblique blank" : "card card-oblique";
    card.style.animationDelay = `${i * 0.08}s`;
    if (text === null) card.setAttribute("aria-label", "Blank card");

    const span = document.createElement("span");
    span.className = "card-text";
    span.textContent = text === null ? "" : text;

    card.appendChild(span);
    obliqueDrawRow.appendChild(card);
  });
}

function shuffleAndDrawOblique() {
  obliquePile.classList.add("shuffling");
  setTimeout(() => {
    obliquePile.classList.remove("shuffling");
    drawObliqueCards();
  }, 350);
}

obliquePile.addEventListener("click", shuffleAndDrawOblique);
obliquePile.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    shuffleAndDrawOblique();
  }
});

// --- 3. Joker cards: always open, on the side ---

function renderJokerCards() {
  const grid = document.getElementById("joker-cards");
  JOKER_CARDS.forEach((text) => {
    const card = document.createElement("div");
    card.className = "card card-joker";

    const span = document.createElement("span");
    span.className = "card-text";
    span.textContent = text;

    card.appendChild(span);
    grid.appendChild(card);
  });
}

renderJokerCards();
