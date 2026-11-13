# Nano66 ⚡

> **Every website. Built from particles.**  
> A production-grade, framework-independent JavaScript/TypeScript animation engine that constructs real websites element-by-element using millions of microscopic particles.

[![npm version](https://img.shields.io/npm/v/nano66.svg)](https://www.npmjs.com/package/nano66)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## What is Nano66?

Nano66 is **not** a particle background effect. It is a **DOM-aware website construction animation engine**.

When integrated into any website:
1. The website initially displays a blank background without layout shift.
2. Thousands of microscopic particles flow across the screen in organic curved streams.
3. The particles assemble into the shapes of actual website elements: headers, paragraphs, buttons, cards, images, and navigation.
4. Each element is revealed in its original HTML/CSS styling as construction completes.
5. Remaining particles swirl toward the visitor's cursor and absorb into it.
6. The entire website becomes completely interactive.

---

## Features

- 🌐 **Framework Independent:** Works with Vanilla JS, React, Vue, Nuxt, Next.js, Svelte, Angular, Astro, and Vite.
- 🚀 **GPU Acceleration:** Powered by PixiJS v8 with automatic WebGL/WebGPU batch rendering and Canvas 2D fallback.
- 🔤 **Text Glyph Rasterization:** Particles gather into the exact shapes of font letters, not mere bounding boxes.
- 🎯 **Object Pooling:** Zero-allocation animation frames to prevent GC stutters.
- 🌓 **Theme-Aware:** Auto-detects dark/light background luminance and provides glowing or charcoal palettes.
- ♿ **Accessible by Default:** Automatically respects `prefers-reduced-motion`.
- 🕹️ **Full Lifecycle API:** Start, pause, resume, skip, restart, and state subscriptions.

---

## Installation

```bash
npm install nano66
```

```bash
pnpm add nano66
```

```bash
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

| Attribute | Usage |
|---|---|
| `data-nano-order="1"` | Set explicit element construction order |
| `data-nano-group="hero"` | Group elements for simultaneous construction |
| `data-nano-ignore` | Exclude elements from concealment and animation |
| `data-nano-card` | Treat container as an outlined card |

---

## Interactive Examples

This repository includes two complete test websites:
- **Website 1 (Vanilla):** Minimalist developer portfolio (`examples/website-1-vanilla`)
- **Website 2 (React):** Enterprise cloud analytics platform (`examples/website-2-react`)

To run them locally:

```bash
# Run Vanilla website
pnpm dev:vanilla

# Run React website
pnpm dev:react
```

---

## Documentation

Full documentation is available in the [`docs/`](./docs) folder:
- [Getting Started](./docs/getting-started.md)
- [Configuration Reference](./docs/configuration.md)
- [API Reference](./docs/api-reference.md)
- [Framework Integration](./docs/integration.md)
- [Troubleshooting & FAQ](./docs/troubleshooting.md)

---

## License

MIT © 2026 Nano66 Contributors
