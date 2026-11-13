import { ParticlePool } from "./ParticlePool";
import { ParticleEmitter } from "./ParticleEmitter";
import { ParticlePhysics } from "./ParticlePhysics";
import { Particle } from "./Particle";
import type { Point } from "../types";

export class ParticleSystem {
  public pool: ParticlePool;
  public emitter: ParticleEmitter;
  private cursorX: number = 0;
  private cursorY: number = 0;
  private isAttractingToCursor: boolean = false;

  constructor(capacity: number = 4000, seed: number = 42) {
    this.pool = new ParticlePool(capacity);
    this.emitter = new ParticleEmitter(this.pool, seed);
  }

  public updateDimensions(width: number, height: number): void {
    this.emitter.updateDimensions(width, height);
  }

  public setCursor(x: number, y: number): void {
    this.cursorX = x;
    this.cursorY = y;
  }

  public emitForElement(
    targets: Point[],
    elementId: string,
    colors: number[],
    sizeRange: [number, number],
    opacityRange: [number, number],
    speed: number,
    maxCount?: number
  ): number {
    return this.emitter.emitForTargets(
      targets,
      elementId,
      colors,
      sizeRange,
      opacityRange,
      speed,
      maxCount
    );
  }

  /**
   * Trigger the final cursor attraction phase on all active particles
   */
  public startCursorAttraction(cursorX?: number, cursorY?: number): void {
    this.isAttractingToCursor = true;
    if (cursorX !== undefined) this.cursorX = cursorX;
    if (cursorY !== undefined) this.cursorY = cursorY;

    for (const p of this.pool.getActiveParticles()) {
      p.attractToCursor(this.cursorX, this.cursorY);
    }
  }

  /**
   * Run simulation tick over delta ms
   * Returns arrival stats for elements
   */
  public update(
    delta: number,
    time: number
  ): {
    activeCount: number;
    elementArrivals: Map<string, { arrived: number; total: number }>;
  } {
    const arrivals = new Map<string, { arrived: number; total: number }>();
    const active = [...this.pool.getActiveParticles()]; // snapshot active list

    for (const p of active) {
      if (this.isAttractingToCursor && p.state !== "attracting") {
        p.attractToCursor(this.cursorX, this.cursorY);
      }

      const alive = ParticlePhysics.update(p, delta, time, this.cursorX, this.cursorY);

      if (!alive) {
        this.pool.release(p);
      } else if (p.elementId) {
        let stats = arrivals.get(p.elementId);
        if (!stats) {
          stats = { arrived: 0, total: 0 };
          arrivals.set(p.elementId, stats);
        }
        stats.total++;
        if (p.hasArrived || p.state === "settled") {
          stats.arrived++;
        }
      }
    }

    return {
      activeCount: this.pool.getActiveCount(),
      elementArrivals: arrivals,
    };
  }

  /**
   * Free particles that belong to an already revealed element
   */
  public releaseElementParticles(elementId: string): void {
    const active = [...this.pool.getActiveParticles()];
    for (const p of active) {
      if (p.elementId === elementId) {
        this.pool.release(p);
      }
    }
  }

  public getActiveParticles(): readonly Particle[] {
    return this.pool.getActiveParticles();
  }

  public reset(): void {
    this.isAttractingToCursor = false;
    this.pool.releaseAll();
  }

  public destroy(): void {
    this.reset();
    this.pool.destroy();
  }
}
