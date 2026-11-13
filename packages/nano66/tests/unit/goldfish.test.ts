import { describe, it, expect, vi } from "vitest";
import {
  GoldfishIntro,
  GOLDFISH_50_POINTS,
  generateHighDensity3DGoldfish,
} from "../../src/animation/GoldfishIntro";
import { ParticlePool } from "../../src/particles/ParticlePool";

describe("GoldfishIntro Animation", () => {
  it("defines exactly 50 anatomical goldfish particles", () => {
    expect(GOLDFISH_50_POINTS).toHaveLength(50);

    // Verify all points have required properties
    for (const pt of GOLDFISH_50_POINTS) {
      expect(typeof pt.u).toBe("number");
      expect(typeof pt.v).toBe("number");
      expect(typeof pt.w).toBe("number");
      expect(typeof pt.waveWeight).toBe("number");
      expect(typeof pt.color).toBe("string");
      expect(pt.size).toBeGreaterThan(0);
    }
  });

  it("generates ultra-high-definition 3D volumetric model with 350 particles", () => {
    const points350 = generateHighDensity3DGoldfish(350);
    expect(points350.length).toBeGreaterThanOrEqual(300);

    // Verify volumetric thickness
    const leftPoints = points350.filter((pt) => pt.w > 0.2);
    const rightPoints = points350.filter((pt) => pt.w < -0.2);
    expect(leftPoints.length).toBeGreaterThan(30);
    expect(rightPoints.length).toBeGreaterThan(30);
  });

  it("features bilateral 3D stereoscopic eyes and depth separation", () => {
    const leftEye = GOLDFISH_50_POINTS.find((pt) => pt.color === "#FFFFFF" && pt.w > 0);
    const rightEye = GOLDFISH_50_POINTS.find((pt) => pt.color === "#FFFFFF" && pt.w < 0);

    expect(leftEye).toBeDefined();
    expect(rightEye).toBeDefined();
    expect(leftEye!.w).toBeGreaterThan(0);
    expect(rightEye!.w).toBeLessThan(0);
  });

  it("spawns 50 particles and moves them during swimming phase", () => {
    const pool = new ParticlePool(200);
    const onScatter = vi.fn();
    const onComplete = vi.fn();

    const intro = new GoldfishIntro(pool, 2000, onScatter, onComplete);
    intro.start(1920, 1080);

    const active = intro.getActiveParticles();
    expect(active).toHaveLength(50);

    // Initial positions
    const initialX = active[0]?.x;
    const initialY = active[0]?.y;

    // Simulate 200ms of swimming
    intro.update(200, 200);

    // Particle should have moved smoothly
    expect(active[0]?.x).not.toBe(initialX);
    expect(active[0]?.y).not.toBe(initialY);
    expect(onScatter).not.toHaveBeenCalled();
    expect(onComplete).not.toHaveBeenCalled();
  });

  it("triggers scatter explosion and finishes cleanly", () => {
    const pool = new ParticlePool(200);
    let scattered = false;
    let completed = false;

    const intro = new GoldfishIntro(
      pool,
      1000,
      () => {
        scattered = true;
      },
      () => {
        completed = true;
      }
    );

    intro.start(1920, 1080);

    // Advance past scatter threshold (750ms out of 1000ms)
    intro.update(760, 760);
    expect(scattered).toBe(true);

    // Advance to completion
    intro.update(300, 1060);
    expect(completed).toBe(true);
    expect(intro.isDone()).toBe(true);
  });
});

