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
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict%20Mode-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Tested%20with-Vitest-yellow?style=flat-square&logo=vitest)](https://vitest.dev/)
[![Playwright](https://img.shields.io/badge/E2E-Playwright-green?style=flat-square&logo=playwright)](https://playwright.dev/)
[![PixiJS v8](https://img.shields.io/badge/Renderer-PixiJS%20v8%20WebGL%20%2F%20Canvas2D-orange?style=flat-square)](https://pixijs.com/)

[**Documentation & Playground**](#documentation-and-live-playground) • [**Quick Start**](#quick-start) • [**Architecture**](#architecture) • [**API Reference**](#api-reference) • [**Framework Guides**](#framework-integrations)

</div>

---

## 🌟 What is Nano66?

**Nano66** is a production-quality, framework-independent JavaScript/TypeScript animation engine that installs into almost any website to create a cinematic particle-construction sequence.

**Nano66 is not a particle background effect. It is a DOM-aware website construction animation engine.**

When a visitor opens a website integrated with Nano66:
1. The website initially displays a completely blank background without layout shifts or flashes of unstyled content.
2. Thousands of microscopic particles appear and stream across the viewport in organic, harmonic curved trajectories.
3. The particles organize into streams and converge into the exact shapes of actual website elements (headings, paragraphs, buttons, cards, images, icons, and navigation).
4. Text particles follow the actual letter glyph curves sampled from Canvas 2D raster masks rather than bounding boxes.
5. Once an element has been constructed, its original HTML and CSS styling are revealed seamlessly.
6. After the entire website is constructed, remaining particles swirl toward the visitor's cursor and absorb into it.
7. The original website becomes fully interactive with zero residual performance overhead.

---

## 🚀 Key Features

- 🌐 **Framework Independent:** Zero dependencies on React or Vue core. Integrates seamlessly into Vanilla HTML/CSS/JS, React, Next.js, Vue, Nuxt, Svelte, Angular, Astro, and Vite.
- ⚡ **GPU-Accelerated Dual Renderer:** Powered by **PixiJS v8** utilizing WebGL batch containers, with an automatic, zero-configuration **Canvas 2D fallback renderer** for headless environments or legacy browsers.
- 🔤 **True Text Glyph Rasterization:** Particles assemble into real typography letter contours (kerning, weights, font families) sampled from high-speed offscreen raster masks.
- 🎯 **Zero-Allocation Object Pool:** Pre-allocated particle pool ($O(1)$ acquire and release) guarantees silky smooth 60 FPS without garbage collection stutter.
- 🌓 **Intelligent Theme Detection:** Computes WCAG background luminance automatically, rendering glowing silver/neon particles on dark themes and obsidian/graphite particles on light themes.
- ♿ **Accessible by Default:** Automatically respects `prefers-reduced-motion: reduce` by immediately revealing content or providing simplified transitions.
- 📱 **Adaptive Performance Presets:** Device-aware performance tiers (`low`, `balanced`, `ultra`) that scale density based on screen size and hardware concurrency.
- 🧹 **Complete Resource Cleanup:** Calling `nano.destroy()` releases all WebGL textures, sprite containers, event listeners, and mutation observers without memory leaks.

---

## 📦 Installation

```bash
# npm
npm install nano66

# pnpm
pnpm add nano66

# yarn
yarn add nano66
```

---

## ⚡ Quick Start

### Vanilla JavaScript

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Website</title>
</head>
<body>
  <div id="app">
    <header data-nano-order="1">
      <h1>Every website. Built from particles.</h1>
    </header>
    <main data-nano-order="2">
      <p>Nano66 transforms your website into an organic particle creation experience.</p>
      <button class="btn" data-nano-order="3">Get Started</button>
    </main>
  </div>

  <script type="module">
    import { Nano66 } from "nano66";

    const nano = new Nano66({
      target: "#app",
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
  </script>
</body>
</html>
```

---

## 🖼️ Architecture & Animation Pipeline

Nano66 executes a deterministic, multi-stage state pipeline:

```
[Target DOM Scan]
       ↓
[Geometry & Style Capture]
       ↓
[Glyph / Silhouette / Shape Target Generation]
       ↓
[Layout-Preserving Concealment (No FOUC / Shifts)]
       ↓
[GPU Canvas Overlay Setup (PixiJS v8 + WebGL/Canvas2D)]
       ↓
[Particle System Init & Object Pooling (Zero-GC)]
       ↓
[Stage-driven Element Construction Timeline]
       ↓
[Progressive Element Reveal (DOM restored seamlessly)]
       ↓
[Final Stage: Cursor Attraction & Dissolution]
       ↓
[Full Website Interactive & Resource Cleanup]
```

---

## 🏷️ Declarative HTML Attributes

Nano66 supports semantic HTML attributes to customize construction order and grouping:

| Attribute | Example | Description |
|---|---|---|
| `data-nano-order` | `<header data-nano-order="1">` | Defines strict numerical construction sequence. |
| `data-nano-group` | `<div data-nano-group="hero">` | Groups elements together for concurrent grouped construction. |
| `data-nano-ignore` | `<aside data-nano-ignore>` | Completely excludes elements from concealment and animation (e.g. control HUDs, critical alerts). |
| `data-nano-card` | `<article data-nano-card>` | Treats arbitrary containers as outlined cards with border and surface targets. |

---

## ⚙️ Configuration Reference

```typescript
import { Nano66 } from "nano66";

const nano = new Nano66({
  // Target container: string selector or HTMLElement (Default: 'body')
  target: "#app",

  // Animation configuration
  animation: {
    // Mode: "sequential" | "grouped" | "parallel" (Default: "sequential")
    mode: "sequential",
    // Delay between sequential elements in ms (Default: 250)
    elementDelay: 250,
    // Magnetically pull particles into element shapes (Default: true)
    particleAttraction: true,
    // Attract remaining particles into mouse cursor upon finish (Default: true)
    cursorExit: true,
    // Arrival threshold to reveal original DOM element (0.1 - 1.0, Default: 0.8)
    revealThreshold: 0.8,
    // Stream stagger delay in ms (Default: 50)
    stagger: 50,
  },

  // Particle simulation parameters
  particles: {
    // Total particle count (Default: auto-calculated based on preset)
    count: 4000,
    // Particle radius in CSS px: single number or [min, max] (Default: [1.2, 2.8])
    size: [1.2, 2.8],
    // Particle color: "auto" | hex string | string[] palette (Default: "auto")
    color: "auto",
    // Speed multiplier (Default: 1.0)
    speed: 1.0,
    // Opacity range: [min, max] (Default: [0.35, 0.95])
    opacity: [0.35, 0.95],
    // Additive glow blend mode (Default: true)
    glow: true,
    // PRNG seed for deterministic trajectories (Default: 42)
    seed: 42,
  },

  // Background theme: "auto" | "dark" | "light" (Default: "auto")
  theme: "auto",

  // Device performance adaptivity
  performance: {
    // Preset: "low" (~1500) | "balanced" (~4000) | "ultra" (~8000+)
    preset: "balanced",
    // Dynamically throttle based on screen size and hardware concurrency (Default: true)
    adaptive: true,
    // Maximum FPS cap (Default: 60)
    maxFPS: 60,
  },

  // Accessibility settings
  accessibility: {
    // Check OS prefers-reduced-motion (Default: true)
    respectReducedMotion: true,
    // Reveal website immediately when reduced motion is preferred (Default: true)
    immediateReveal: true,
  },
});
```

---

## 🕹️ Public API

### Lifecycle Methods

```typescript
// Start the construction sequence
await nano.start();

// Pause active simulation
nano.pause();

// Resume simulation
nano.resume();

// Skip animation and immediately reveal all original DOM elements
nano.skip();

// Restart construction animation from the beginning
nano.restart();

// Clean up all GPU textures, event listeners, observers, and remove overlay canvas
nano.destroy();

// Query engine state: 'idle' | 'ready' | 'constructing' | 'attracting' | 'completed' | 'paused' | 'destroyed'
const state = nano.getState();
```

### Lifecycle Events

```typescript
// Element-level hooks
nano.on("elementStart", (element) => {
  console.log(`Constructing element: ${element.type} (#${element.id})`);
});

nano.on("elementComplete", (element) => {
  console.log(`Element revealed: #${element.id}`);
});

// Overall progress (0.0 to 1.0)
nano.on("progress", (progress) => {
  console.log(`Progress: ${(progress * 100).toFixed(0)}%`);
});

// Completion hook
nano.on("complete", () => {
  console.log("Website fully constructed and interactive!");
});
```

---

## 🧩 Framework Integrations

### React & Next.js

```tsx
import React, { useEffect, useRef } from "react";
import { Nano66 } from "nano66";

export const App = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const nano = new Nano66({
      target: containerRef.current,
      theme: "auto",
      animation: {
        mode: "sequential",
        cursorExit: true,
      },
    });

    nano.start();

    // Clean up on component unmount
    return () => {
      nano.destroy();
    };
  }, []);

  return (
    <div ref={containerRef} id="app">
      <header data-nano-order="1">
        <h1>Constructed with React &amp; Nano66</h1>
      </header>
    </div>
  );
};
```

### Vue 3 & Nuxt

```vue
<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { Nano66 } from 'nano66';

const container = ref(null);
let nano = null;

onMounted(() => {
  nano = new Nano66({
    target: container.value,
    theme: 'auto',
  });
  nano.start();
});

onUnmounted(() => {
  nano?.destroy();
});
</script>

<template>
  <div ref="container" id="app">
    <h1 data-nano-order="1">Constructed with Vue &amp; Nano66</h1>
  </div>
</template>
```

### Svelte

```svelte
<script>
  import { onMount } from 'svelte';
  import { Nano66 } from 'nano66';

  let container;

  onMount(() => {
    const nano = new Nano66({ target: container });
    nano.start();

    return () => nano.destroy();
  });
</script>

<div bind:this={container}>
  <h1 data-nano-order="1">Constructed with Svelte &amp; Nano66</h1>
</div>
```

---

## 💻 Included Testing Websites & Live Playground

This repository contains two independent example websites and a full documentation playground:

```bash
# Run Website 1 (Vanilla JS Developer Portfolio)
pnpm dev:vanilla

# Run Website 2 (Enterprise React Analytics Platform)
pnpm dev:react

# Run Documentation Website & Live Particle Playground
pnpm dev:docs
```

---

## 🧪 Testing Suite & Verification

Testing is fully integrated and validated across unit, integration, and real-browser environments:

```bash
# Run unit and integration tests (Vitest)
pnpm test

# Run test coverage analysis (v8)
pnpm test:coverage

# Run real browser end-to-end test suite (Playwright)
pnpm test:e2e

# Run TypeScript strict type-checking across workspace
pnpm typecheck

# Validate npm tarball packaging contents
pnpm pack:check
```

- **38 Vitest Unit & Integration Tests**: Validating deterministic PRNG, flow field vector math, color luminance, object pooling, target generators, timeline sequencing, and visibility managers.
- **15 Playwright End-to-End Browser Tests**: Testing vanilla and React website integration, initial blank state, progressive reveal, skip/pause/resume/restart, theme toggling, contact forms, mobile viewports, and `prefers-reduced-motion`.

---

## 📖 Complete Documentation

Detailed technical guides are available in the [`docs/`](./docs) folder:
- [Getting Started Guide](./docs/getting-started.md)
- [Configuration Reference](./docs/configuration.md)
- [API Reference](./docs/api-reference.md)
- [Framework Integration Guide](./docs/integration.md)
- [Troubleshooting & FAQ](./docs/troubleshooting.md)

---

## 📄 License

MIT © 2026 Nano66 Contributors. Released under the [MIT License](./LICENSE).
