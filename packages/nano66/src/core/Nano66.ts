import type {
  Nano66Options,
  ResolvedNano66Config,
  NanoState,
  Nano66Event,
  Nano66EventListener,
} from "../types";
import { StateManager } from "./StateManager";
import { EventEmitter } from "./EventEmitter";
import { AnimationController } from "./AnimationController";
import { AccessibilityManager } from "../accessibility/AccessibilityManager";
import { PerformanceMonitor } from "../utils/PerformanceMonitor";

export class Nano66 {
  private config: ResolvedNano66Config;
  private stateManager: StateManager;
  private events: EventEmitter;
  private accessibility: AccessibilityManager;
  private controller: AnimationController | null = null;
  private isInitialized: boolean = false;
  private isDestroyed: boolean = false;
  private initPromise: Promise<void> | null = null;

  constructor(options: Nano66Options = {}) {
    this.events = new EventEmitter();
    this.stateManager = new StateManager((state, prev) => {
      this.events.emit("stateChange", state, prev);
    });

    this.accessibility = new AccessibilityManager(options.accessibility, (reduced) => {
      if (reduced && this.stateManager.isRunning()) {
        this.skip();
      }
    });

    this.config = this.resolveOptions(options);
  }

  private resolveOptions(options: Nano66Options): ResolvedNano66Config {
    let targetEl: HTMLElement;

    if (typeof options.target === "string") {
      const found = document.querySelector<HTMLElement>(options.target);
      if (!found) {
        throw new Error(`[Nano66] Target selector "${options.target}" not found in DOM.`);
      }
      targetEl = found;
    } else if (options.target instanceof HTMLElement) {
      targetEl = options.target;
    } else if (typeof document !== "undefined") {
      targetEl = document.body;
    } else {
      targetEl = {} as HTMLElement;
    }

    const preset = options.performance?.preset ?? "balanced";
    const recommendedCount = PerformanceMonitor.getRecommendedParticleCount(preset);

    const sizeRange: [number, number] = Array.isArray(options.particles?.size)
      ? options.particles.size
      : typeof options.particles?.size === "number"
      ? [options.particles.size, options.particles.size]
      : [1.2, 2.8];

    const opacityRange: [number, number] = Array.isArray(options.particles?.opacity)
      ? options.particles.opacity
      : typeof options.particles?.opacity === "number"
      ? [options.particles.opacity, options.particles.opacity]
      : [0.35, 0.95];

    return {
      target: targetEl,
      animation: {
        mode: options.animation?.mode ?? "sequential",
        duration: options.animation?.duration ?? 8000,
        elementDelay: options.animation?.elementDelay ?? 250,
        particleAttraction: options.animation?.particleAttraction ?? true,
        cursorExit: options.animation?.cursorExit ?? true,
        revealThreshold: options.animation?.revealThreshold ?? 0.8,
        stagger: options.animation?.stagger ?? 50,
      },
      particles: {
        count: options.particles?.count ?? recommendedCount,
        size: sizeRange,
        color: options.particles?.color ?? "auto",
        speed: options.particles?.speed ?? 1.0,
        opacity: opacityRange,
        glow: options.particles?.glow ?? true,
        seed: options.particles?.seed ?? 42,
      },
      theme: options.theme ?? "auto",
      performance: {
        preset,
        adaptive: options.performance?.adaptive ?? true,
        maxFPS: options.performance?.maxFPS ?? 60,
      },
      accessibility: {
        respectReducedMotion: options.accessibility?.respectReducedMotion ?? true,
        immediateReveal: options.accessibility?.immediateReveal ?? true,
      },
    };
  }

  /**
   * Initialize resources and scan the DOM.
   * Can be called explicitly, or will be called automatically by start().
   */
  public async init(): Promise<void> {
    if (this.isDestroyed || this.isInitialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      try {
        if (this.isDestroyed) return;
        this.controller = new AnimationController(this.config, this.stateManager, this.events);
        await this.controller.init();
        if (this.isDestroyed) {
          this.controller?.destroy();
          this.controller = null;
          return;
        }
        this.isInitialized = true;
      } catch (err: any) {
        if (this.isDestroyed) return;
        this.events.emit("error", err instanceof Error ? err : new Error(String(err)));
        throw err;
      }
    })();

    return this.initPromise;
  }

  /**
   * Start the particle construction animation
   */
  public async start(): Promise<void> {
    if (this.isDestroyed) return;

    // If user prefers reduced motion and immediate reveal is set, skip
    if (this.accessibility.shouldSkipAnimation()) {
      this.stateManager.transitionTo("completed");
      this.events.emit("complete");
      return;
    }

    if (!this.isInitialized) {
      await this.init();
    }

    if (this.isDestroyed) return;

    this.controller?.start();
  }

  /**
   * Pause the active animation
   */
  public pause(): void {
    if (this.isDestroyed) return;
    this.controller?.pause();
  }

  /**
   * Resume paused animation
   */
  public resume(): void {
    if (this.isDestroyed) return;
    this.controller?.resume();
  }

  /**
   * Skip remaining animation and immediately reveal full website
   */
  public skip(): void {
    if (this.isDestroyed) return;
    this.controller?.skip();
  }

  /**
   * Restart animation from beginning
   */
  public restart(): void {
    if (this.isDestroyed) return;
    this.controller?.restart();
  }

  /**
   * Completely clean up canvas, listeners, and memory
   */
  public destroy(): void {
    if (this.isDestroyed) return;
    this.isDestroyed = true;
    this.accessibility.destroy();
    this.controller?.destroy();
    this.controller = null;
    this.isInitialized = false;
    this.initPromise = null;
  }

  /**
   * Get current engine state
   */
  public getState(): NanoState {
    return this.stateManager.getState();
  }

  /**
   * Subscribe to lifecycle events
   */
  public on<E extends Nano66Event>(event: E, callback: Nano66EventListener<E>): () => void {
    return this.events.on(event, callback);
  }

  /**
   * Unsubscribe from lifecycle events
   */
  public off<E extends Nano66Event>(event: E, callback: Nano66EventListener<E>): void {
    this.events.off(event, callback);
  }
}
