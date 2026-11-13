/**
 * Fast deterministic Pseudo-Random Number Generator (Mulberry32)
 */
export class PRNG {
  private state: number;

  constructor(seed: number = 42) {
    this.state = seed ? (seed | 0) : 42;
  }

  /** Returns a float in range [0, 1) */
  next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** Returns a float in range [min, max) */
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  /** Returns an integer in range [min, max] */
  rangeInt(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }

  /** Reset with a new seed */
  reseed(seed: number): void {
    this.state = seed ? (seed | 0) : 42;
  }
}

/**
 * Standard Math & Vector Helpers
 */
export const MathUtils = {
  clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  },

  lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t;
  },

  distance(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  },

  distanceSq(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return dx * dx + dy * dy;
  },

  angle(x1: number, y1: number, x2: number, y2: number): number {
    return Math.atan2(y2 - y1, x2 - x1);
  },

  // Common Easing Functions
  easeOutQuad(t: number): number {
    return t * (2 - t);
  },

  easeInOutQuad(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },

  easeOutCubic(t: number): number {
    const p = t - 1;
    return p * p * p + 1;
  },

  easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  },

  easeOutExpo(t: number): number {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  },

  /**
   * Smooth curl / flow field generator for organic particle streams.
   * Based on fast sine/cosine superposition with spatial octave variation.
   */
  flowField(x: number, y: number, time: number = 0, scale: number = 0.003): { vx: number; vy: number } {
    const nx = x * scale;
    const ny = y * scale;
    const t = time * 0.0008;

    // Angle generated from multiple harmonic waves
    const angle =
      Math.sin(nx + t) * 1.5 +
      Math.cos(ny - t * 0.8) * 1.5 +
      Math.sin((nx + ny) * 0.7 + t * 0.5) * 1.2;

    return {
      vx: Math.cos(angle),
      vy: Math.sin(angle),
    };
  },
};
