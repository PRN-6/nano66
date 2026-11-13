# Nano66 Configuration Reference

Nano66 provides fine-grained control over animation sequences, particle physics, device performance, and accessibility.

## Configuration Options

```typescript
const nano = new Nano66({
  target: "#app", // Container selector string or HTMLElement

  animation: {
    mode: "sequential",      // "sequential" | "grouped" | "parallel"
    duration: 8000,          // Approximate target duration in ms
    elementDelay: 250,       // Delay between sequential elements in ms
    particleAttraction: true,// Enable magnetic pull into element shapes
    cursorExit: true,        // Attract remaining particles into mouse cursor
    revealThreshold: 0.8,    // Reveal original DOM element when 80% formed
    stagger: 50,             // Stagger delay between streams in ms
  },

  particles: {
    count: 4000,             // Total particles (or auto-calculated by preset)
    size: [1.2, 2.8],        // Particle radius in CSS px [min, max]
    color: "auto",           // "auto" | hex string | palette array
    speed: 1.0,              // Velocity multiplier
    opacity: [0.35, 0.95],   // Opacity range [min, max]
    glow: true,              // Additive blend mode for luminous particles
    seed: 42,                // PRNG seed for deterministic trajectories
  },

  theme: "auto",             // "auto" | "dark" | "light"

  performance: {
    preset: "balanced",      // "low" | "balanced" | "ultra"
    adaptive: true,          // Scale particle counts dynamically
    maxFPS: 60,              // Frame rate target
  },

  accessibility: {
    respectReducedMotion: true, // Check prefers-reduced-motion
    immediateReveal: true,      // Reveal instantly when reduced motion is preferred
  },
});
```

---

## Performance Presets

| Preset | Target Particle Count | Recommended Environment |
|---|---|---|
| `low` | ~1,500 particles | Mobile phones, older laptops, low-power devices |
| `balanced` | ~4,000 particles | Standard modern laptops and desktops (Default) |
| `ultra` | ~8,000+ particles | High-end workstations with dedicated GPUs |

When `adaptive: true` is enabled, Nano66 detects screen size and hardware concurrency, automatically adjusting particle density to maintain smooth 60 FPS performance.
