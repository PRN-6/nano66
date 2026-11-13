import { describe, it, expect } from "vitest";
import { PRNG, MathUtils } from "../../src/utils/MathUtils";

describe("MathUtils & PRNG", () => {
  it("generates deterministic pseudo-random sequences with PRNG", () => {
    const prng1 = new PRNG(1337);
    const prng2 = new PRNG(1337);

    const values1 = [prng1.next(), prng1.next(), prng1.next()];
    const values2 = [prng2.next(), prng2.next(), prng2.next()];

    expect(values1).toEqual(values2);
    expect(values1[0]).toBeGreaterThanOrEqual(0);
    expect(values1[0]).toBeLessThan(1);
  });

  it("generates numbers within specified range", () => {
    const prng = new PRNG(42);
    for (let i = 0; i < 50; i++) {
      const val = prng.range(10, 20);
      expect(val).toBeGreaterThanOrEqual(10);
      expect(val).toBeLessThan(20);

      const intVal = prng.rangeInt(5, 10);
      expect(Number.isInteger(intVal)).toBe(true);
      expect(intVal).toBeGreaterThanOrEqual(5);
      expect(intVal).toBeLessThanOrEqual(10);
    }
  });

  it("calculates clamp, lerp, distance, and angle correctly", () => {
    expect(MathUtils.clamp(15, 0, 10)).toBe(10);
    expect(MathUtils.clamp(-5, 0, 10)).toBe(0);
    expect(MathUtils.clamp(5, 0, 10)).toBe(5);

    expect(MathUtils.lerp(10, 20, 0.5)).toBe(15);
    expect(MathUtils.lerp(0, 100, 0.25)).toBe(25);

    expect(MathUtils.distance(0, 0, 3, 4)).toBe(5);
    expect(MathUtils.distanceSq(0, 0, 3, 4)).toBe(25);

    expect(MathUtils.angle(0, 0, 1, 0)).toBe(0);
    expect(MathUtils.angle(0, 0, 0, 1)).toBeCloseTo(Math.PI / 2);
  });

  it("evaluates easing functions within [0, 1]", () => {
    expect(MathUtils.easeOutQuad(0)).toBe(0);
    expect(MathUtils.easeOutQuad(1)).toBe(1);

    expect(MathUtils.easeInOutQuad(0)).toBe(0);
    expect(MathUtils.easeInOutQuad(0.5)).toBe(0.5);
    expect(MathUtils.easeInOutQuad(1)).toBe(1);

    expect(MathUtils.easeOutCubic(0)).toBe(0);
    expect(MathUtils.easeOutCubic(1)).toBe(1);
  });

  it("generates flow field vectors", () => {
    const vec1 = MathUtils.flowField(100, 200, 500);
    expect(typeof vec1.vx).toBe("number");
    expect(typeof vec1.vy).toBe("number");
    const mag = Math.sqrt(vec1.vx * vec1.vx + vec1.vy * vec1.vy);
    expect(mag).toBeCloseTo(1, 3);
  });
});
