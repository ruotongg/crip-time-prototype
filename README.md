# Crip Time — Prototype Gallery

Three interactive prototypes exploring non-mechanical, embodied experiences of time.

- **Crip Time Clock** — an analog clock whose hands keep real mechanical time, but whose numerals distort in spacing, scale, and opacity based on a selected bodily feeling. Includes a session reflection log and an optional tick sound.
- **The Shredder** — click a calendar once to shred it, permanently. Includes a critical design statement and a "Clean up" button to reset.
- **Redesign Productivity Tools** — a three-deck card activity: shuffle and draw a productivity tool to redesign, pull 3 Oblique Strategies cards for inspiration, and keep two joker cards open as reminders.

## Requirements

None. This is a plain static site — just HTML, CSS, and vanilla JavaScript. No Node.js, no package manager, and no build step are required to run it.

## Running locally

**Option A — just open it.**
Double-click `index.html` (or open it from your browser with `File → Open`). Every page uses relative links, so the whole gallery works straight from the filesystem (`file://`).

**Option B — serve it over HTTP.**
Some browsers restrict certain behavior on `file://` pages. If anything looks off, serve the folder locally instead:

```bash
# from this directory
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

Any other static server works too (`npx serve`, `php -S localhost:8000`, your editor's "Live Server" extension, etc.) — there's nothing to install or configure.

## Project structure

```
.
├── index.html                      # gallery landing page
├── styles.css
├── assets/thumbnails/              # gallery card thumbnails
├── crip-time-clock/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── the-shredder/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── redesign-productivity-tools/
    ├── index.html
    ├── style.css
    └── script.js
```

Each prototype is self-contained (its own HTML/CSS/JS) and links back to the gallery via "← Back to gallery".
