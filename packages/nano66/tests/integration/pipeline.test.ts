import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { DOMScanner } from "../../src/dom/DOMScanner";
import { TargetGenerator } from "../../src/targets/TargetGenerator";
import { VisibilityManager } from "../../src/dom/VisibilityManager";
import { ParticleSystem } from "../../src/particles/ParticleSystem";
import { ConstructionTimeline } from "../../src/animation/ConstructionTimeline";

describe("Internal Engine Pipeline Integration", () => {
  let root: HTMLDivElement;

  beforeEach(() => {
    root = document.createElement("div");
    root.id = "integration-root";
    root.innerHTML = `
      <header>
        <h1 data-nano-order="1">Website Title</h1>
      </header>
      <main>
        <p data-nano-order="2">Intro paragraph text here.</p>
        <button data-nano-order="3" class="btn">Click CTA</button>
      </main>
    `;
    document.body.appendChild(root);
  });

  afterEach(() => {
    root.remove();
  });

  it("orchestrates DOM scanning, target creation, concealment, and timeline completion", () => {
    // 1. Scan DOM
    const scanner = new DOMScanner(root);
    const elements = scanner.scan();
    expect(elements.length).toBeGreaterThan(0);

    // 2. Generate Targets
    for (const el of elements) {
      el.targets = TargetGenerator.generateTargetsForElement(el);
      expect(el.targets.length).toBeGreaterThan(0);
    }

    // 3. Conceal with VisibilityManager
    const visibility = new VisibilityManager();
    for (const el of elements) {
      visibility.conceal(el.element);
      expect(el.element.classList.contains("nano66-concealed")).toBe(true);
    }

    // 4. Initialize ParticleSystem and Timeline
    const particleSystem = new ParticleSystem(500, 42);
    let allFinished = false;

    const timeline = new ConstructionTimeline(
      elements,
      visibility,
      "sequential",
      50,
      0.75,
      {
        onElementStart: (el) => {
          particleSystem.emitForElement(
            el.targets,
            el.id,
            [0xffffff],
            [1.5, 2.5],
            [0.5, 0.9],
            1.0
          );
        },
        onAllElementsComplete: () => {
          allFinished = true;
        },
      }
    );

    timeline.start();
    expect(particleSystem.getActiveParticles().length).toBeGreaterThan(0);

    // Run simulation loop
    for (let t = 0; t < 20; t++) {
      const { elementArrivals } = particleSystem.update(50, t * 50);
      timeline.update(50, elementArrivals);
    }

    timeline.finish();
    expect(allFinished).toBe(true);

    // Confirm all elements are revealed
    for (const el of elements) {
      expect(el.element.classList.contains("nano66-concealed")).toBe(false);
    }

    // Cleanup
    visibility.restore();
    particleSystem.destroy();
  });
});
