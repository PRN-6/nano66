# Framework Integration Guide

Nano66 is completely framework-independent and can be integrated into any web project.

---

## 1. Vue 3 / Nuxt

```vue
<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { Nano66 } from 'nano66';

const root = ref(null);
let nano = null;

onMounted(() => {
  nano = new Nano66({
    target: root.value,
    theme: 'auto',
  });
  nano.start();
});

onUnmounted(() => {
  nano?.destroy();
});
</script>

<template>
  <div ref="root" id="app">
    <header data-nano-order="1">
      <h1>Built with Vue &amp; Nano66</h1>
    </header>
  </div>
</template>
```

---

## 2. Svelte / SvelteKit

```svelte
<script>
  import { onMount } from 'svelte';
  import { Nano66 } from 'nano66';

  let container;

  onMount(() => {
    const nano = new Nano66({
      target: container,
      theme: 'auto',
    });
    nano.start();

    return () => {
      nano.destroy();
    };
  });
</script>

<div bind:this={container}>
  <h1 data-nano-order="1">Svelte Application</h1>
</div>
```

---

## 3. Next.js (App Router)

Ensure client-side execution since Nano66 interacts with browser DOM and GPU APIs:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { Nano66 } from "nano66";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const nano = new Nano66({ target: containerRef.current });
    nano.start();

    return () => nano.destroy();
  }, []);

  return (
    <div ref={containerRef}>
      <h1 data-nano-order="1">Next.js App</h1>
    </div>
  );
}
```
