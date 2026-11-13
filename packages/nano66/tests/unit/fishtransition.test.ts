import { describe, it, expect, vi } from "vitest";
import { FishTransition } from "../../src/animation/FishTransition";
import { ParticlePool } from "../../src/particles/ParticlePool";
import type { NanoElement } from "../../src/types";

describe("FishTransition", () => {
  function createMockElement(id: string, left: number, top: number, width: number, height: number): NanoElement {
    return {
      id,
      element: {} as HTMLElement,
      type: "heading",
      priority: 1,
      rect: { left, top, right: left + width, bottom: top + height, width, height },
      styles: {
        color: "#ffffff",
        backgroundColor: "transparent",
        fontSize: "24px",
        fontFamily: "sans-serif",
        fontWeight: "bold",
        lineHeight: "1.2",
        letterSpacing: "0px",
        borderRadius: "0px",
        borderWidth: "0px",
        borderColor: "transparent",
        opacity: 1,
        visibility: "visible",
      },
      targets: [
        { x: left + 10, y: top + 10 },
        { x: left + 20, y: top + 10 },
        { x: left + 30, y: top + 10 },
      ],
      state: "pending",
      group: "main",
    };
  }

  it("initializes Bezier path and distance between two elements", () => {
    const pool = new ParticlePool(200);
    const fromEl = createMockElement("el-1", 100, 100, 200, 50);
    const toEl = createMockElement("el-2", 100, 400, 200, 50);

    const transition = new FishTransition(pool, fromEl, toEl, { duration: 600 });
    expect(transition).toBeDefined();
    expect(transition.isActive()).toBe(false);
  });

  it("gathers particles into fish formation and updates along trajectory", () => {
    const pool = new ParticlePool(200);
    const fromEl = createMockElement("el-1", 100, 100, 200, 50);
    const toEl = createMockElement("el-2", 500, 500, 200, 50);

    // Pre-seed some active particles on fromEl
    const p1 = pool.acquire();
    p1?.spawn(200, 125, 200, 125, 0xffa000, 2, 1, 1, "el-1", 1);
    const p2 = pool.acquire();
    p2?.spawn(205, 125, 205, 125, 0xffa000, 2, 1, 1, "el-1", 2);

    let scattered = false;
    let completed = false;

    const transition = new FishTransition(pool, fromEl, toEl, {
      duration: 500,
      onScatter: () => {
        scattered = true;
      },
      onComplete: () => {
        completed = true;
      },
    });

    transition.start();
    expect(transition.isActive()).toBe(true);

    // Update through 50% (swimming)
    transition.update(250, 250);
    expect(transition.isActive()).toBe(true);

    // Update to 85% (triggering scatter burst)
    transition.update(175, 425);
    expect(scattered).toBe(true);

    // Update past 100% (finish)
    transition.update(100, 525);
    expect(completed).toBe(true);
    expect(transition.isActive()).toBe(false);
  });

  it("retargets particles to destination element upon completion", () => {
    const pool = new ParticlePool(200);
    const fromEl = createMockElement("el-1", 50, 50, 100, 30);
    const toEl = createMockElement("el-2", 300, 300, 100, 30);

    const onComplete = vi.fn();
    const transition = new FishTransition(pool, fromEl, toEl, {
      duration: 300,
      onComplete,
    });

    transition.start();
    transition.finish();

    expect(onComplete).toHaveBeenCalledTimes(1);
    const active = pool.getActiveParticles();
    const onToEl = active.filter((p) => p.elementId === "el-2");
    expect(onToEl.length).toBeGreaterThan(0);
  });
});
