# Nano66 ⚡

<div align="center">

```
 _   _                       __   __
| \ | | __ _ _ __   ___     / /_ / /_
|  \| |/ _` | '_ \ / _ \   | '_ \ '_ \
| |\  | (_| | | | | (_) |  | (_) | (_) |
|_| \_|\__,_|_| |_|\___/    \___/ \___/
```

### *Every website. Built from particles.*

[![npm version](https://img.shields.io/npm/v/nano66.svg?style=flat-square&color=38bdf8)](https://www.npmjs.com/package/nano66)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)

</div>

---

## What is Nano66?

**Nano66** is a production-quality, framework-independent JavaScript/TypeScript animation engine that installs into almost any website to create a cinematic particle-construction sequence.

**Nano66 is not a particle background effect. It is a DOM-aware website construction animation engine.**

When a visitor opens a website integrated with Nano66:
1. The website initially displays a blank background without layout shifts or flashes of unstyled content.
2. Thousands of microscopic particles flow across the viewport in organic, harmonic curved trajectories.
3. The particles organize into streams and converge into the exact shapes of actual website elements (headings, paragraphs, buttons, cards, images, icons, and navigation).
4. Text particles follow the actual letter glyph curves sampled from Canvas 2D raster masks rather than bounding boxes.
5. Once an element has been constructed, its original HTML and CSS styling are revealed seamlessly.
6. After the entire website is constructed, remaining particles swirl toward the visitor's cursor and absorb into it.
7. The original website becomes fully interactive.

---

## Installation

```bash
npm install nano66
# or
pnpm add nano66
# or
yarn add nano66
```

---

## Quick Start

```typescript
import { Nano66 } from "nano66";

const nano = new Nano66({
  target: "body",
  theme: "auto",
  animation: {
    mode: "sequential",
    cursorExit: true,
  },
  particles: {
    count: 4000,
    glow: true,
  },
});

nano.start();
```

---

## Declarative HTML Attributes

| Attribute | Example | Description |
|---|---|---|
| `data-nano-order` | `<header data-nano-order="1">` | Defines strict numerical construction sequence. |
| `data-nano-group` | `<div data-nano-group="hero">` | Groups elements together for concurrent grouped construction. |
| `data-nano-ignore` | `<aside data-nano-ignore>` | Completely excludes elements from concealment and animation (e.g. control HUDs, critical alerts). |
| `data-nano-card` | `<article data-nano-card>` | Treats arbitrary containers as outlined cards with border and surface targets. |

---

## Public API

```typescript
// Lifecycle controls
await nano.start();
nano.pause();
nano.resume();
nano.skip();
nano.restart();
nano.destroy();

// State inspection
const state = nano.getState();

// Lifecycle event hooks
nano.on("elementStart", (el) => console.log("Constructing:", el.type));
nano.on("elementComplete", (el) => console.log("Revealed:", el.id));
nano.on("progress", (p) => console.log("Progress:", `${(p * 100).toFixed(0)}%`));
nano.on("complete", () => console.log("Interactive!"));
```

---

## License

MIT © 2026 Nano66 Contributors
