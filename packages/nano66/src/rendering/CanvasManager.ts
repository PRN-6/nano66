export class CanvasManager {
  private canvas: HTMLCanvasElement | null = null;
  private width: number = 0;
  private height: number = 0;
  private dpr: number = 1;
  private resizeObserver: ResizeObserver | null = null;
  private onResizeCallback?: (width: number, height: number, dpr: number) => void;

  public createOverlay(_target: HTMLElement = document.body): HTMLCanvasElement {
    if (this.canvas) return this.canvas;

    const canvas = document.createElement("canvas");
    canvas.id = "nano66-canvas";
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 999999;
      display: block;
      background: transparent;
    `;

    document.body.appendChild(canvas);
    this.canvas = canvas;
    this.updateDimensions();

    // Setup window & element resize listener
    if (typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver(() => {
        this.updateDimensions();
      });
      this.resizeObserver.observe(document.body);
    } else {
      window.addEventListener("resize", this.handleResize);
    }

    return canvas;
  }

  private handleResize = (): void => {
    this.updateDimensions();
  };

  public updateDimensions(): void {
    if (!this.canvas) return;

    this.dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2 to balance quality & performance
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);

    this.onResizeCallback?.(this.width, this.height, this.dpr);
  }

  public onResize(callback: (width: number, height: number, dpr: number) => void): void {
    this.onResizeCallback = callback;
  }

  public getCanvas(): HTMLCanvasElement | null {
    return this.canvas;
  }

  public getDimensions(): { width: number; height: number; dpr: number } {
    return { width: this.width, height: this.height, dpr: this.dpr };
  }

  public destroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    } else if (typeof window !== "undefined") {
      window.removeEventListener("resize", this.handleResize);
    }

    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
      this.canvas = null;
    }
  }
}
