# Getting Started with Nano66

> Every website. Built from particles.

**Nano66** is a production-quality, framework-independent JavaScript/TypeScript animation engine. It captures the DOM structure of your website, conceals the elements on load, and builds them atom by atom from thousands of tiny microscopic particles using GPU-accelerated rendering.

---

## Installation

Install Nano66 via npm, pnpm, or yarn:

```bash
npm install nano66
# or
pnpm add nano66
# or
yarn add nano66
```

---

## Quick Start (Vanilla JavaScript)

```javascript
import { Nano66 } from "nano66";

// 1. Create a new instance
const nano = new Nano66({
  target: "#app", // or 'body'
  theme: "auto",
  animation: {
    mode: "sequential",
    elementDelay: 250,
    cursorExit: true,
  },
  particles: {
    count: 4000,
    glow: true,
  },
});

// 2. Start the animation
nano.start();
```

---

## Quick Start (React / Next.js)

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

    // Clean up on unmount
    return () => {
      nano.destroy();
    };
  }, []);

  return (
    <div ref={containerRef} id="app">
      <header data-nano-order="1">
        <h1>Welcome to My Website</h1>
      </header>
      <main data-nano-order="2">
        <p>Built from microscopic particles.</p>
      </main>
    </div>
  );
};
```

---

## HTML Data Attributes

Nano66 provides declarative HTML data attributes to control element construction:

| Attribute | Description | Example |
|---|---|---|
| `data-nano-order` | Defines custom sequence order (ascending integer) | `<h1 data-nano-order="1">Title</h1>` |
| `data-nano-group` | Groups elements together for simultaneous construction | `<div data-nano-group="cards">...</div>` |
| `data-nano-ignore` | Completely excludes an element from animation | `<div data-nano-ignore>Skip this</div>` |
| `data-nano-card` | Forces card boundary point generation | `<article data-nano-card>...</article>` |
