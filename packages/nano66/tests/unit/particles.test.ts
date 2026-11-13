import { describe, it, expect } from "vitest";
import { Particle } from "../../src/particles/Particle";
import { ParticlePool } from "../../src/particles/ParticlePool";
import { ParticlePhysics } from "../../src/particles/ParticlePhysics";
import { ParticleEmitter } from "../../src/particles/ParticleEmitter";

describe("Particles & Physics Engine", () => {
  it("initializes and resets particles properly", () => {
    const p = new Particle(1);
    expect(p.active).toBe(false);
    expect(p.state).toBe("dead");

    p.spawn(0, 0, 100, 100, 0xffffff, 2, 0.9, 1.0, "el-1", 42);
    expect(p.active).toBe(true);
    expect(p.targetX).toBe(100);
    expect(p.targetY).toBe(100);
    expect(p.elementId).toBe("el-1");
    expect(p.state).toBe("streaming");

    p.reset();
    expect(p.active).toBe(false);
    expect(p.state).toBe("dead");
  });

  it("allocates and recycles particles in ParticlePool without allocation leaks", () => {
    const pool = new ParticlePool(10);
    expect(pool.getTotalCapacity()).toBe(10);
    expect(pool.getActiveCount()).toBe(0);

    const p1 = pool.acquire();
    expect(p1).toBeDefined();
    expect(pool.getActiveCount()).toBe(1);

    const p2 = pool.acquire();
    expect(pool.getActiveCount()).toBe(2);

    pool.release(p1!);
    expect(pool.getActiveCount()).toBe(1);

    pool.releaseAll();
    expect(pool.getActiveCount()).toBe(0);
  });

  it("automatically expands pool capacity when demand exceeds initial capacity", () => {
    const pool = new ParticlePool(5);
    const acquired: Particle[] = [];

    for (let i = 0; i < 10; i++) {
      const p = pool.acquire();
      if (p) acquired.push(p);
    }

    expect(acquired.length).toBe(10);
    expect(pool.getActiveCount()).toBe(10);
    expect(pool.getTotalCapacity()).toBeGreaterThanOrEqual(10);
  });

  it("updates physics across states: streaming -> forming -> settled", () => {
    const p = new Particle(1);
    p.spawn(0, 0, 50, 50, 0xffffff, 2, 0.9, 1.0, "el-1", 42);

    // Initial state is streaming
    expect(p.state).toBe("streaming");

    // Advance streaming
    ParticlePhysics.update(p, 16.67, 100);
    expect(p.alpha).toBeGreaterThan(0.05);

    // Set target and test forming
    p.setTarget(50, 50, "el-1");
    expect(p.state).toBe("forming");

    // Advance physics until arrival
    p.x = 49.5;
    p.y = 49.5;
    ParticlePhysics.update(p, 16.67, 200);

    expect(p.hasArrived).toBe(true);
  });

  it("attracts remaining particles to cursor during final stage", () => {
    const p = new Particle(1);
    p.spawn(100, 100, 100, 100, 0xffffff, 3, 1.0, 1.0, "el-1", 42);
    p.attractToCursor(500, 500);

    expect(p.state).toBe("attracting");
    expect(p.targetX).toBe(500);
    expect(p.targetY).toBe(500);

    // Run physics update with cursor coordinates
    const alive = ParticlePhysics.update(p, 16.67, 300, 500, 500);
    expect(alive).toBe(true);
    expect(p.size).toBeLessThan(3); // particle shrinks as it approaches cursor
  });

  it("emits particles targeting provided points with ParticleEmitter", () => {
    const pool = new ParticlePool(50);
    const emitter = new ParticleEmitter(pool, 123);
    emitter.updateDimensions(1920, 1080);

    const targets = [
      { x: 100, y: 100 },
      { x: 150, y: 100 },
      { x: 200, y: 100 },
    ];

    const count = emitter.emitForTargets(
      targets,
      "heading-1",
      [0xffffff],
      [1.5, 2.5],
      [0.4, 0.9],
      1.2
    );

    expect(count).toBe(3);
    expect(pool.getActiveCount()).toBe(3);
  });
});
