export interface PerformanceMetrics {
  fps: number;
  avgFps: number;
  frameTime: number;
  activeParticles: number;
  isThrottled: boolean;
}

export class PerformanceMonitor {
  private lastTime: number = 0;
  private fpsHistory: number[] = [];
  private historySize: number = 30;
  private currentFps: number = 60;
  private avgFps: number = 60;
  private isThrottled: boolean = false;
  private onVisibilityChange?: (visible: boolean) => void;

  constructor() {
    this.setupVisibilityListener();
  }

  private setupVisibilityListener(): void {
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", this.handleVisibilityChange);
    }
  }

  private handleVisibilityChange = (): void => {
    const isVisible = document.visibilityState === "visible";
    this.onVisibilityChange?.(isVisible);
  };

  public setVisibilityCallback(callback: (visible: boolean) => void): void {
    this.onVisibilityChange = callback;
  }

  /**
   * Called every animation frame
   */
  public tick(currentTime: number): number {
    if (this.lastTime === 0) {
      this.lastTime = currentTime;
      return 16.67;
    }

    const delta = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // Avoid massive delta jumps if tab was suspended
    const clampedDelta = Math.min(delta, 100);

    const instantFps = 1000 / Math.max(clampedDelta, 1);
    this.currentFps = instantFps;

    this.fpsHistory.push(instantFps);
    if (this.fpsHistory.length > this.historySize) {
      this.fpsHistory.shift();
    }

    const sum = this.fpsHistory.reduce((acc, f) => acc + f, 0);
    this.avgFps = sum / this.fpsHistory.length;

    // Detect if FPS consistently drops below 35
    if (this.fpsHistory.length >= 20 && this.avgFps < 35) {
      this.isThrottled = true;
    } else if (this.avgFps > 50) {
      this.isThrottled = false;
    }

    return clampedDelta;
  }

  public getMetrics(activeParticles: number = 0): PerformanceMetrics {
    return {
      fps: Math.round(this.currentFps),
      avgFps: Math.round(this.avgFps),
      frameTime: this.currentFps > 0 ? 1000 / this.currentFps : 16.67,
      activeParticles,
      isThrottled: this.isThrottled,
    };
  }

  /**
   * Calculate suggested particle count based on device preset and specs
   */
  public static getRecommendedParticleCount(preset: "low" | "balanced" | "ultra" = "balanced"): number {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const hardwareConcurrency = typeof navigator !== "undefined" ? (navigator.hardwareConcurrency || 4) : 4;

    let baseCount = 4000;
    if (preset === "low") baseCount = 1500;
    if (preset === "ultra") baseCount = 8000;

    if (isMobile) {
      baseCount = Math.round(baseCount * 0.45);
    } else if (hardwareConcurrency <= 2) {
      baseCount = Math.round(baseCount * 0.6);
    }

    return Math.max(500, baseCount);
  }

  public reset(): void {
    this.lastTime = 0;
    this.fpsHistory = [];
    this.currentFps = 60;
    this.avgFps = 60;
    this.isThrottled = false;
  }

  public destroy(): void {
    if (typeof document !== "undefined") {
      document.removeEventListener("visibilitychange", this.handleVisibilityChange);
    }
  }
}
