# Nano66 ⚡

> **Every website. Built from particles.**  
> A production-grade, framework-independent JavaScript/TypeScript animation engine that constructs real websites element-by-element using millions of microscopic particles.

[![npm version](https://img.shields.io/npm/v/nano66.svg)](https://www.npmjs.com/package/nano66)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## Installation

```bash
npm install nano66
```

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

## License

MIT © 2026 Nano66 Contributors
