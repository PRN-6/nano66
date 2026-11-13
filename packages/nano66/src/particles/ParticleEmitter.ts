import { ParticlePool } from "./ParticlePool";
import { PRNG } from "../utils/MathUtils";
import { ColorUtils } from "../utils/ColorUtils";
import type { Point } from "../types";

export class ParticleEmitter {
  private pool: ParticlePool;
  private prng: PRNG;
  private screenWidth: number = 1920;
  private screenHeight: number = 1080;

  constructor(pool: ParticlePool, seed: number = 42) {
    this.pool = pool;
    this.prng = new PRNG(seed);
  }

  public updateDimensions(width: number, height: number): void {
    this.screenWidth = Math.max(100, width);
    this.screenHeight = Math.max(100, height);
  }

  /**
   * Calculate a dynamic origin point just outside or around the screen edge
   */
  private getSpawnOrigin(_targetX: number, _targetY: number): { x: number; y: number } {
    const side = this.prng.rangeInt(0, 3);
    let x = 0;
    let y = 0;

    switch (side) {
      case 0: // Top
        x = this.prng.range(-50, this.screenWidth + 50);
        y = this.prng.range(-80, -20);
        break;
      case 1: // Right
        x = this.prng.range(this.screenWidth + 20, this.screenWidth + 80);
        y = this.prng.range(-50, this.screenHeight + 50);
        break;
      case 2: // Bottom
        x = this.prng.range(-50, this.screenWidth + 50);
        y = this.prng.range(this.screenHeight + 20, this.screenHeight + 80);
        break;
      case 3: // Left
      default:
        x = this.prng.range(-80, -20);
        y = this.prng.range(-50, this.screenHeight + 50);
        break;
    }

    return { x, y };
  }

  /**
   * Emit particles targeting an array of points for a specific element
   */
  public emitForTargets(
    targets: Point[],
    elementId: string,
    colors: number[],
    sizeRange: [number, number],
    opacityRange: [number, number],
    speed: number,
    maxCount?: number
  ): number {
    const count = maxCount ? Math.min(targets.length, maxCount) : targets.length;
    let emitted = 0;

    for (let i = 0; i < count; i++) {
      const target = targets[i];
      if (!target) continue;

      const particle = this.pool.acquire();
      if (!particle) break;

      const origin = this.getSpawnOrigin(target.x, target.y);
      let color = colors[this.prng.rangeInt(0, colors.length - 1)] ?? 0xffffff;
      if (target.color !== undefined) {
        const parsed = ColorUtils.parseColor(target.color);
        if (parsed.a > 0.05) {
          const lum = ColorUtils.getLuminance(parsed);
          // If color is not excessively dark (< 0.12 luminance), use it; otherwise use vibrant palette
          if (lum > 0.12) {
            color = ColorUtils.toHexNumber(parsed);
          }
        }
      }
      const size = target.size ?? this.prng.range(sizeRange[0], sizeRange[1]);
      const alpha = target.alpha ?? this.prng.range(opacityRange[0], opacityRange[1]);
      const pSpeed = speed * this.prng.range(0.85, 1.25);
      const seed = this.prng.rangeInt(1, 10000);

      particle.spawn(
        origin.x,
        origin.y,
        target.x,
        target.y,
        color,
        size,
        alpha,
        pSpeed,
        elementId,
        seed
      );

      emitted++;
    }

    return emitted;
  }
}
