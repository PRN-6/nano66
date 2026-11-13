import type { ResolvedNano66Config, NanoElement } from "../types";
import { StateManager } from "./StateManager";
import { EventEmitter } from "./EventEmitter";
import { DOMScanner } from "../dom/DOMScanner";
import { VisibilityManager } from "../dom/VisibilityManager";
import { TargetGenerator } from "../targets/TargetGenerator";
import { CanvasManager } from "../rendering/CanvasManager";
import { PixiRenderer } from "../rendering/PixiRenderer";
import type { Renderer } from "../rendering/Renderer";
import { ParticleSystem } from "../particles/ParticleSystem";
import { ConstructionTimeline } from "../animation/ConstructionTimeline";
import { CursorAttraction } from "../animation/CursorAttraction";
import { GoldfishIntro } from "../animation/GoldfishIntro";
import { FishTransition } from "../animation/FishTransition";
import { PerformanceMonitor } from "../utils/PerformanceMonitor";
import { ColorUtils } from "../utils/ColorUtils";

export class AnimationController {
  private config: ResolvedNano66Config;
  private stateManager: StateManager;
  private events: EventEmitter;

  private domScanner: DOMScanner;
  private visibilityManager: VisibilityManager;
  private canvasManager: CanvasManager;
  private renderer: Renderer;
  private particleSystem: ParticleSystem;
  private cursorAttraction: CursorAttraction;
  private performanceMonitor: PerformanceMonitor;
  private timeline: ConstructionTimeline | null = null;
  private goldfishIntro: GoldfishIntro | null = null;
  private activeFishTransition: FishTransition | null = null;
  private transitionIndex: number = 0;

  private elements: NanoElement[] = [];
  private rafId: number | null = null;
  private isDestroyed: boolean = false;
  private colors: number[] = [];

  constructor(
    config: ResolvedNano66Config,
    stateManager: StateManager,
    events: EventEmitter
  ) {
    this.config = config;
    this.stateManager = stateManager;
    this.events = events;

    this.domScanner = new DOMScanner(config.target);
    this.visibilityManager = new VisibilityManager();
    this.canvasManager = new CanvasManager();
    this.renderer = new PixiRenderer();
    this.particleSystem = new ParticleSystem(config.particles.count, config.particles.seed);
    this.cursorAttraction = new CursorAttraction();
    this.performanceMonitor = new PerformanceMonitor();

    if (config.intro?.enabled) {
      this.goldfishIntro = new GoldfishIntro(
        this.particleSystem.pool,
        config.intro.duration,
        () => {
          this.events.emit("introScatter");
        },
        () => {
          this.transitionFromIntroToConstruction();
        }
      );
    }

    this.performanceMonitor.setVisibilityCallback((visible) => {
      if (!visible && this.stateManager.isRunning()) {
        this.pause();
      } else if (visible && this.stateManager.is("paused")) {
        this.resume();
      }
    });
  }

  public async init(): Promise<void> {
    if (this.isDestroyed) return;

    this.stateManager.transitionTo("scanning");

    // 1. Resolve colors based on theme
    let detectedTheme = this.config.theme;
    if (detectedTheme === "auto") {
      detectedTheme = ColorUtils.detectTheme(this.config.target);
    }

    if (this.config.particles.color === "auto") {
      const palette = ColorUtils.getThemePalette(detectedTheme);
      this.colors = palette.map((c) => ColorUtils.toHexNumber(c));
    } else if (Array.isArray(this.config.particles.color)) {
      this.colors = this.config.particles.color.map((c) => ColorUtils.toHexNumber(c));
    } else {
      this.colors = [ColorUtils.toHexNumber(this.config.particles.color)];
    }

    // 2. Wait for fonts if available so canvas text glyphs match web fonts perfectly
    if (typeof document !== "undefined" && (document as any).fonts) {
      try {
        await (document as any).fonts.ready;
      } catch {
        // Proceed if font loading promise fails
      }
    }

    if (this.isDestroyed) return;

    // 3. Scan DOM elements
    this.elements = this.domScanner.scan();

    // 4. Generate target points for all detected elements
    for (const el of this.elements) {
      el.targets = TargetGenerator.generateTargetsForElement(el);
    }

    // 4. Create canvas overlay & init renderer
    const canvas = this.canvasManager.createOverlay(this.config.target);
    await this.renderer.init(canvas);

    if (this.isDestroyed) {
      this.destroy();
      return;
    }

    this.canvasManager.onResize((w, h, dpr) => {
      this.renderer.resize(w, h, dpr);
      this.particleSystem.updateDimensions(w, h);
    });

    const dims = this.canvasManager.getDimensions();
    this.particleSystem.updateDimensions(dims.width, dims.height);

    // 5. Initial blank website state: Conceal content without layout shift
    if (this.stateManager.is("completed")) {
      this.visibilityManager.revealAll();
      return;
    }

    this.stateManager.transitionTo("concealing");
    for (const el of this.elements) {
      this.visibilityManager.conceal(el.element);
    }

    // 6. Setup timeline
    this.timeline = new ConstructionTimeline(
      this.elements,
      this.visibilityManager,
      this.config.animation.mode,
      this.config.animation.elementDelay,
      this.config.animation.revealThreshold,
      {
        onElementStart: (el) => {
          this.events.emit("elementStart", el);
          // Only emit from screen borders if fishTransition didn't already populate them
          const activeOnEl = this.particleSystem
            .getActiveParticles()
            .filter((p) => p.elementId === el.id).length;

          if (activeOnEl === 0) {
            this.particleSystem.emitForElement(
              el.targets,
              el.id,
              this.colors,
              this.config.particles.size,
              this.config.particles.opacity,
              this.config.particles.speed
            );
          }
        },
        onElementReveal: (el) => {
          this.events.emit("elementReveal", el);
          // Only dissolve immediately if fish transitions are disabled
          if (!this.config.animation.fishTransition) {
            this.particleSystem.dissolveParticlesForElement(el.id);
          }
        },
        onRequestTransition: (fromEl, toEl, onReady) => {
          if (!this.config.animation.fishTransition || this.isDestroyed) {
            onReady();
            return;
          }

          this.events.emit("elementTransition", fromEl, toEl);

          this.activeFishTransition = new FishTransition(
            this.particleSystem.pool,
            fromEl,
            toEl,
            {
              duration: this.config.animation.transitionDuration,
              speed: this.config.particles.speed,
              colors: this.colors,
              onComplete: () => {
                this.activeFishTransition = null;
                onReady();
              },
            },
            this.transitionIndex++
          );

          this.activeFishTransition.start();
        },
        onElementComplete: (el) => {
          this.events.emit("elementComplete", el);
        },
        onProgress: (progress) => {
          this.events.emit("progress", progress);
        },
        onAllElementsComplete: () => {
          this.handleAllElementsConstructed();
        },
      }
    );

    this.stateManager.transitionTo("ready");
    this.events.emit("ready");
  }

  public start(): void {
    if (this.stateManager.is("paused")) {
      return;
    }
    if (!this.stateManager.is("ready") && !this.stateManager.is("idle")) {
      return;
    }

    this.cursorAttraction.startListening();

    if (this.config.intro?.enabled && this.goldfishIntro) {
      this.stateManager.transitionTo("intro");
      this.events.emit("introStart");
      const dims = this.canvasManager.getDimensions();
      this.goldfishIntro.start(dims.width, dims.height);
      this.startLoop();
    } else {
      this.transitionFromIntroToConstruction();
      this.startLoop();
    }
  }

  private transitionFromIntroToConstruction(): void {
    if (this.isDestroyed || this.stateManager.is("completed")) return;

    this.stateManager.transitionTo("constructing");
    this.events.emit("start");

    this.timeline?.start();
  }

  private handleAllElementsConstructed(): void {
    if (this.config.animation.cursorExit) {
      // Transition to final cursor attraction phase
      this.stateManager.transitionTo("attracting");
      const cursor = this.cursorAttraction.getCursorPosition();
      this.particleSystem.startCursorAttraction(cursor.x, cursor.y);
    } else {
      this.complete();
    }
  }

  private startLoop(): void {
    if (this.rafId !== null) return;

    const loop = (timestamp: number) => {
      if (this.isDestroyed) return;

      const delta = this.performanceMonitor.tick(timestamp);
      this.update(delta, timestamp);

      if (this.stateManager.isRunning()) {
        this.rafId = requestAnimationFrame(loop);
      } else {
        this.rafId = null;
      }
    };

    this.rafId = requestAnimationFrame(loop);
  }

  private update(delta: number, timestamp: number): void {
    // 1. If in intro phase, update the 50-particle swimming goldfish
    if (this.stateManager.is("intro") && this.goldfishIntro) {
      this.goldfishIntro.update(delta, timestamp);

      // Render the glowing goldfish particles
      this.renderer.render(this.particleSystem.getActiveParticles(), true);
      return;
    }

    const cursor = this.cursorAttraction.getCursorPosition();
    this.particleSystem.setCursor(cursor.x, cursor.y);

    // Update particle simulation
    const { activeCount, elementArrivals } = this.particleSystem.update(delta, timestamp);

    // Update active inter-element swimming fish transition
    if (this.activeFishTransition && this.activeFishTransition.isActive()) {
      this.activeFishTransition.update(delta, timestamp);
    }

    // Update construction timeline if constructing
    if (this.stateManager.is("constructing") && this.timeline) {
      this.timeline.update(delta, elementArrivals);
    }

    // In cursor attraction phase, check if remaining particles are consumed
    if (this.stateManager.is("attracting")) {
      if (activeCount === 0) {
        this.complete();
        return;
      }
    }

    // Render active particles
    this.renderer.render(
      this.particleSystem.getActiveParticles(),
      this.config.particles.glow
    );
  }

  public complete(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.stateManager.transitionTo("completed");
    this.cursorAttraction.stopListening();
    this.visibilityManager.revealAll();
    this.renderer.clear();
    this.events.emit("complete");
  }

  public pause(): void {
    if (this.isDestroyed) return;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    this.stateManager.transitionTo("paused");
    this.events.emit("pause");
  }

  public resume(): void {
    if (this.isDestroyed) return;
    if (!this.stateManager.is("paused")) return;

    const previous = this.stateManager.getPreviousState();
    const resumeState =
      previous === "attracting"
        ? "attracting"
        : previous === "intro"
        ? "intro"
        : "constructing";
    this.stateManager.transitionTo(resumeState);
    this.events.emit("resume");

    this.startLoop();
  }

  public skip(): void {
    if (this.isDestroyed) return;

    if (this.activeFishTransition) {
      this.activeFishTransition.cancel();
      this.activeFishTransition = null;
    }

    if (this.goldfishIntro) {
      this.goldfishIntro.finish();
    }

    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    if (this.timeline) {
      this.timeline.finish();
    }

    this.particleSystem.reset();
    this.visibilityManager.revealAll();
    this.complete();
  }

  public restart(): void {
    this.skip();
    this.timeline?.reset();
    this.particleSystem.reset();
    this.stateManager.reset();

    // Re-conceal elements
    for (const el of this.elements) {
      this.visibilityManager.conceal(el.element);
    }

    this.stateManager.transitionTo("ready");
    this.start();
  }

  public destroy(): void {
    if (this.isDestroyed) return;
    this.isDestroyed = true;

    if (this.activeFishTransition) {
      this.activeFishTransition.cancel();
      this.activeFishTransition = null;
    }

    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    this.stateManager.transitionTo("destroyed");
    this.cursorAttraction.destroy();
    this.performanceMonitor.destroy();
    this.visibilityManager.restore();
    this.particleSystem.destroy();
    this.renderer.destroy();
    this.canvasManager.destroy();

    this.events.emit("destroy");
    this.events.clear();
  }

  public getElements(): readonly NanoElement[] {
    return this.elements;
  }
}
