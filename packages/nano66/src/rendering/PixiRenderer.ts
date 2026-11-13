import { Application, Container, Sprite, Texture, Graphics } from "pixi.js";
import type { Renderer } from "./Renderer";
import type { Particle } from "../particles/Particle";
import { CanvasFallbackRenderer } from "./CanvasFallbackRenderer";

export class PixiRenderer implements Renderer {
  private app: Application | null = null;
  private particleContainer: Container | null = null;
  private particleTexture: Texture | null = null;
  private sprites: Sprite[] = [];
  private fallbackRenderer: CanvasFallbackRenderer | null = null;
  private isFallback: boolean = false;
  private isDestroyed: boolean = false;
  private width: number = 0;
  private height: number = 0;
  private dpr: number = 1;

  public async init(canvas: HTMLCanvasElement): Promise<void> {
    if (this.isDestroyed) return;

    this.width = window.innerWidth || 1920;
    this.height = window.innerHeight || 1080;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    try {
      const app = new Application();
      this.app = app;

      await app.init({
        canvas,
        width: this.width,
        height: this.height,
        resolution: this.dpr,
        autoDensity: true,
        backgroundAlpha: 0,
        antialias: true,
        preference: "webgl",
      });

      if (this.isDestroyed) {
        this.safeDestroyApp(app);
        this.app = null;
        return;
      }

      this.particleContainer = new Container();
      this.app.stage.addChild(this.particleContainer);

      // Create a smooth circular glow particle texture (16x16)
      this.particleTexture = this.generateParticleTexture();
    } catch (err) {
      if (this.isDestroyed) return;
      console.warn("[Nano66] WebGL initialization failed, switching to Canvas2D fallback renderer:", err);
      this.isFallback = true;
      this.fallbackRenderer = new CanvasFallbackRenderer();
      await this.fallbackRenderer.init(canvas);
    }
  }

  private generateParticleTexture(): Texture {
    if (!this.app) return Texture.WHITE;

    // Generate circular particle texture using offscreen canvas with smooth anti-aliased edge
    const size = 32;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      const center = size / 2;
      const radius = size / 2 - 2;

      const grad = ctx.createRadialGradient(center, center, 0, center, center, radius);
      grad.addColorStop(0, "rgba(255, 255, 255, 1.0)");
      grad.addColorStop(0.6, "rgba(255, 255, 255, 0.85)");
      grad.addColorStop(1, "rgba(255, 255, 255, 0.0)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.fill();

      return Texture.from(canvas);
    }

    // Fallback graphics texture
    const g = new Graphics();
    g.circle(16, 16, 14).fill(0xffffff);
    return this.app.renderer.generateTexture(g);
  }

  public resize(width: number, height: number, dpr: number): void {
    this.width = width;
    this.height = height;
    this.dpr = dpr;

    if (this.isFallback && this.fallbackRenderer) {
      this.fallbackRenderer.resize(width, height, dpr);
      return;
    }

    if (this.app && this.app.renderer) {
      this.app.renderer.resize(width, height, dpr);
    }
  }

  public render(particles: readonly Particle[], glow: boolean): void {
    if (this.isFallback && this.fallbackRenderer) {
      this.fallbackRenderer.render(particles, glow);
      return;
    }

    if (!this.app || !this.particleContainer || !this.particleTexture) return;

    // Set blend mode
    this.particleContainer.blendMode = glow ? "add" : "normal";

    const activeCount = particles.length;

    // Ensure we have enough sprites
    while (this.sprites.length < activeCount) {
      const sprite = new Sprite(this.particleTexture);
      sprite.anchor.set(0.5, 0.5);
      this.particleContainer.addChild(sprite);
      this.sprites.push(sprite);
    }

    // Update active particle sprites
    for (let i = 0; i < activeCount; i++) {
      const p = particles[i];
      const sprite = this.sprites[i];

      if (!p || !sprite) continue;

      if (!p.active || p.alpha <= 0.01) {
        sprite.visible = false;
        continue;
      }

      sprite.visible = true;
      sprite.x = p.x;
      sprite.y = p.y;
      // Normalizing based on 32px base texture
      const scale = (p.size * 2) / 32;
      sprite.scale.set(scale);
      sprite.alpha = p.alpha;
      sprite.tint = p.color;
    }

    // Hide any unused sprites in pool
    for (let i = activeCount; i < this.sprites.length; i++) {
      const sprite = this.sprites[i];
      if (sprite) {
        sprite.visible = false;
      }
    }

    this.app.render();
  }

  public clear(): void {
    if (this.isFallback && this.fallbackRenderer) {
      this.fallbackRenderer.clear();
      return;
    }

    for (const sprite of this.sprites) {
      sprite.visible = false;
    }
    if (this.app) {
      this.app.render();
    }
  }

  public destroy(): void {
    if (this.isDestroyed) return;
    this.isDestroyed = true;

    if (this.isFallback && this.fallbackRenderer) {
      this.fallbackRenderer.destroy();
      this.fallbackRenderer = null;
      return;
    }

    for (const sprite of this.sprites) {
      try {
        sprite.destroy();
      } catch (_) {}
    }
    this.sprites = [];

    if (this.particleTexture) {
      try {
        this.particleTexture.destroy(true);
      } catch (_) {}
      this.particleTexture = null;
    }

    if (this.particleContainer) {
      try {
        this.particleContainer.destroy({ children: true });
      } catch (_) {}
      this.particleContainer = null;
    }

    if (this.app) {
      this.safeDestroyApp(this.app);
      this.app = null;
    }
  }

  private safeDestroyApp(app: Application): void {
    try {
      const appAny = app as any;
      if (typeof appAny._cancelResize !== "function") {
        appAny._cancelResize = () => {};
      }
      if (typeof appAny.queueResize !== "function") {
        appAny.queueResize = () => {};
      }
      app.destroy(true, { children: true, texture: true });
    } catch (_) {
      // Ignore internal Pixi teardown quirks during rapid lifecycle unmount
    }
  }
}
