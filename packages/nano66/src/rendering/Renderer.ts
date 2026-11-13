import type { Particle } from "../particles/Particle";

export interface Renderer {
  init(canvas: HTMLCanvasElement): Promise<void>;
  render(particles: readonly Particle[], glow: boolean): void;
  resize(width: number, height: number, dpr: number): void;
  clear(): void;
  destroy(): void;
}
