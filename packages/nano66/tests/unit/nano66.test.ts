import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { Nano66 } from "../../src/core/Nano66";

describe("Nano66 Public API", () => {
  let root: HTMLDivElement;

  beforeEach(() => {
    root = document.createElement("div");
    root.id = "app-root";
    root.innerHTML = `
      <header>
        <h1 data-nano-order="1">Test Heading</h1>
      </header>
      <main>
        <p>This is a paragraph.</p>
        <button class="btn">Click me</button>
      </main>
    `;
    document.body.appendChild(root);
  });

  afterEach(() => {
    root.remove();
  });

  it("instantiates Nano66 with default configuration", () => {
    const nano = new Nano66({ target: root });
    expect(nano).toBeInstanceOf(Nano66);
    expect(nano.getState()).toBe("idle");
    nano.destroy();
  });

  it("handles event subscriptions and unsubscriptions", () => {
    const nano = new Nano66({ target: root });
    const readyListener = vi.fn();
    const unsub = nano.on("ready", readyListener);

    expect(typeof unsub).toBe("function");
    unsub();
    nano.destroy();
  });

  it("respects reduced motion when user prefers reduced motion", async () => {
    // Mock matchMedia for prefers-reduced-motion
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query.includes("reduced-motion"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const nano = new Nano66({
      target: root,
      accessibility: { respectReducedMotion: true, immediateReveal: true },
    });

    const completeSpy = vi.fn();
    nano.on("complete", completeSpy);

    await nano.start();

    expect(nano.getState()).toBe("completed");
    expect(completeSpy).toHaveBeenCalled();
    nano.destroy();
  });
});
