import type { Renderer } from "./Renderer";
import type { Particle } from "../particles/Particle";

export class CanvasFallbackRenderer implements Renderer {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private width: number = 0;
  private height: number = 0;
  private dpr: number = 1;

  public async init(canvas: HTMLCanvasElement): Promise<void> {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: true });
    this.width = canvas.width;
    this.height = canvas.height;
  }

  public resize(width: number, height: number, dpr: number): void {
    this.width = width;
    this.height = height;
    this.dpr = dpr;
  }

  public render(particles: readonly Particle[], glow: boolean): void {
    if (!this.ctx || !this.canvas) return;

    this.ctx.save();
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.ctx.clearRect(0, 0, this.width, this.height);

    if (glow) {
      this.ctx.globalCompositeOperation = "lighter";
    }

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (!p || !p.active || p.alpha <= 0.01) continue;

      this.ctx.globalAlpha = p.alpha;
      const colorNum = isNaN(p.color) ? 0xffffff : p.color;
      const hex = colorNum.toString(16).padStart(6, "0");
      this.ctx.fillStyle = `#${hex}`;

      const scrollX = typeof window !== "undefined" ? window.scrollX || 0 : 0;
      const scrollY = typeof window !== "undefined" ? window.scrollY || 0 : 0;

      this.ctx.beginPath();
      this.ctx.arc(p.x - scrollX, p.y - scrollY, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  public clear(): void {
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  public destroy(): void {
    this.clear();
    this.ctx = null;
    this.canvas = null;
  }
}
