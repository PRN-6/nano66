import { describe, it, expect } from "vitest";
import { ParticleSystem } from "../../src/particles/ParticleSystem";
import { CursorAttraction } from "../../src/animation/CursorAttraction";
import { CanvasFallbackRenderer } from "../../src/rendering/CanvasFallbackRenderer";
import { PerformanceMonitor } from "../../src/utils/PerformanceMonitor";

describe("ParticleSystem, CursorAttraction, FallbackRenderer, Performance", () => {
  it("ParticleSystem manages lifecycle, cursor attraction, and particle release", () => {
    const system = new ParticleSystem(100, 42);
    system.updateDimensions(1920, 1080);

    const emitted = system.emitForElement(
      [{ x: 100, y: 100 }, { x: 150, y: 100 }],
      "test-el",
      [0xffffff],
      [2, 3],
      [0.5, 0.9],
      1.0
    );

    expect(emitted).toBe(2);
    expect(system.getActiveParticles().length).toBe(2);

    // Run physics update
    const { activeCount, elementArrivals } = system.update(16.67, 500);
    expect(activeCount).toBe(2);
    expect(elementArrivals.has("test-el")).toBe(true);

    // Start cursor attraction
    system.startCursorAttraction(500, 500);
    const updated = system.update(16.67, 600);
    expect(updated.activeCount).toBe(2);

    // Release particles
    system.releaseElementParticles("test-el");
    expect(system.getActiveParticles().length).toBe(0);

    system.reset();
    system.destroy();
  });

  it("CursorAttraction tracks mouse movements and provides positions", () => {
    const attraction = new CursorAttraction();
    attraction.startListening();

    const initial = attraction.getCursorPosition();
    expect(initial.x).toBeDefined();
    expect(initial.y).toBeDefined();

    // Simulate mouse move
    window.dispatchEvent(new MouseEvent("mousemove", { clientX: 250, clientY: 350 }));
    const moved = attraction.getCursorPosition();
    expect(moved.x).toBe(250);
    expect(moved.y).toBe(350);
    expect(moved.moved).toBe(true);

    attraction.stopListening();
    attraction.destroy();
  });

  it("CanvasFallbackRenderer initializes, renders, clears, and cleans up", async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 600;

    const renderer = new CanvasFallbackRenderer();
    await renderer.init(canvas);

    renderer.resize(800, 600, 1);
    renderer.render([], false);
    renderer.clear();
    renderer.destroy();
  });

  it("PerformanceMonitor tracks FPS, throttling, and calculates device presets", () => {
    const monitor = new PerformanceMonitor();

    // Advance several frames
    for (let i = 0; i < 25; i++) {
      monitor.tick(i * 16.67);
    }

    const metrics = monitor.getMetrics(500);
    expect(metrics.fps).toBeGreaterThan(0);
    expect(metrics.activeParticles).toBe(500);

    // Preset particle count calculations
    expect(PerformanceMonitor.getRecommendedParticleCount("low")).toBeLessThan(
      PerformanceMonitor.getRecommendedParticleCount("ultra")
    );

    monitor.reset();
    monitor.destroy();
  });
});
