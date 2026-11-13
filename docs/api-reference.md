# Nano66 API Reference

## Class: `Nano66`

### Constructor

```typescript
const nano = new Nano66(options?: Nano66Options);
```

---

### Methods

#### `start(): Promise<void>`
Begins the DOM scan and triggers particle animation. Returns a promise that resolves once the initialization pipeline has finished.

#### `pause(): void`
Pauses the active particle simulation and timer.

#### `resume(): void`
Resumes simulation from paused state.

#### `skip(): void`
Immediately reveals all original HTML elements, resets particle buffers, and concludes the animation cleanly.

#### `restart(): void`
Resets element visibility, re-conceals the target website, and restarts the construction animation from the beginning.

#### `destroy(): void`
Disposes of PixiJS GPU buffers, texture allocations, event listeners, observers, and removes the canvas overlay from the DOM.

#### `getState(): NanoState`
Returns the current engine state:
- `"idle"`
- `"ready"`
- `"scanning"`
- `"concealing"`
- `"constructing"`
- `"attracting"`
- `"completed"`
- `"paused"`
- `"destroyed"`

#### `on<E extends Nano66Event>(event: E, listener: Function): () => void`
Subscribes to lifecycle events. Returns an unsubscribe function.

#### `off<E extends Nano66Event>(event: E, listener: Function): void`
Unsubscribes a listener from an event.

---

### Lifecycle Events

| Event | Parameters | Description |
|---|---|---|
| `ready` | none | DOM has been scanned and targets are generated |
| `start` | none | Particle construction has officially started |
| `elementStart` | `(element: NanoElement)` | Particles have begun forming a specific element |
| `elementComplete`| `(element: NanoElement)` | An element has completed construction and is revealed |
| `progress` | `(progress: number)` | Overall completion progress from `0.0` to `1.0` |
| `stateChange` | `(state, prevState)` | Engine transitioned to a new state |
| `complete` | none | All elements formed and cursor attraction complete |
| `error` | `(error: Error)` | An error occurred during initialization or rendering |
| `destroy` | none | Instance has been destroyed and cleaned up |
