import { Particle } from "./Particle";

export class ParticlePool {
  private pool: Particle[] = [];
  private activeParticles: Particle[] = [];
  private freeIndices: number[] = [];

  constructor(initialCapacity: number = 4000) {
    this.allocate(initialCapacity);
  }

  private allocate(count: number): void {
    const startIndex = this.pool.length;
    for (let i = 0; i < count; i++) {
      const particle = new Particle(startIndex + i);
      this.pool.push(particle);
      this.freeIndices.push(startIndex + i);
    }
  }

  /**
   * Acquire an inactive particle from the pool
   */
  public acquire(): Particle | null {
    if (this.freeIndices.length === 0) {
      // Expand pool capacity dynamically if needed
      const expansionSize = Math.max(100, Math.floor(this.pool.length * 0.25));
      this.allocate(expansionSize);
    }

    const index = this.freeIndices.pop();
    if (index === undefined) return null;

    const particle = this.pool[index];
    if (!particle) return null;

    particle.active = true;
    this.activeParticles.push(particle);
    return particle;
  }

  /**
   * Return a particle back to the pool
   */
  public release(particle: Particle): void {
    if (!particle.active) return;

    particle.reset();
    const activeIdx = this.activeParticles.indexOf(particle);
    if (activeIdx !== -1) {
      // Fast swap-and-pop removal from activeParticles
      const last = this.activeParticles.pop();
      if (last && activeIdx < this.activeParticles.length) {
        this.activeParticles[activeIdx] = last;
      }
    }
    this.freeIndices.push(particle.id);
  }

  /**
   * Release all active particles
   */
  public releaseAll(): void {
    for (const p of this.activeParticles) {
      p.reset();
      this.freeIndices.push(p.id);
    }
    this.activeParticles = [];
  }

  public getActiveParticles(): readonly Particle[] {
    return this.activeParticles;
  }

  public getActiveCount(): number {
    return this.activeParticles.length;
  }

  public getTotalCapacity(): number {
    return this.pool.length;
  }

  public destroy(): void {
    this.releaseAll();
    this.pool = [];
    this.freeIndices = [];
  }
}
