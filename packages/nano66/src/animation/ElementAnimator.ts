import type { NanoElement } from "../types";
import { VisibilityManager } from "../dom/VisibilityManager";

export class ElementAnimator {
  private element: NanoElement;
  private visibilityManager: VisibilityManager;
  private revealThreshold: number;
  private onRevealed?: (el: NanoElement) => void;
  private onComplete?: (el: NanoElement) => void;
  private hasRevealed: boolean = false;
  private hasCompleted: boolean = false;
  private elapsedTime: number = 0;
  private maxDuration: number = 2500; // safety fallback duration in ms

  constructor(
    element: NanoElement,
    visibilityManager: VisibilityManager,
    revealThreshold: number = 0.8,
    onRevealed?: (el: NanoElement) => void,
    onComplete?: (el: NanoElement) => void
  ) {
    this.element = element;
    this.visibilityManager = visibilityManager;
    this.revealThreshold = revealThreshold;
    this.onRevealed = onRevealed;
    this.onComplete = onComplete;
  }

  public update(
    delta: number,
    arrivalStats?: { arrived: number; total: number }
  ): { revealed: boolean; complete: boolean } {
    this.elapsedTime += delta;

    if (arrivalStats && arrivalStats.total > 0) {
      const progress = arrivalStats.arrived / arrivalStats.total;

      if (!this.hasRevealed && (progress >= this.revealThreshold || this.elapsedTime > this.maxDuration * 0.7)) {
        this.triggerReveal();
      }

      if (this.hasRevealed && !this.hasCompleted && (progress >= 0.95 || this.elapsedTime > this.maxDuration)) {
        this.triggerComplete();
      }
    } else if (this.elapsedTime > 800 && !this.hasRevealed) {
      // If element has no particle targets (e.g. empty container), reveal automatically
      this.triggerReveal();
      this.triggerComplete();
    }

    return {
      revealed: this.hasRevealed,
      complete: this.hasCompleted,
    };
  }

  public triggerReveal(): void {
    if (this.hasRevealed) return;
    this.hasRevealed = true;
    this.element.state = "revealed";
    this.visibilityManager.reveal(this.element.element);
    this.onRevealed?.(this.element);
  }

  public triggerComplete(): void {
    if (this.hasCompleted) return;
    this.hasCompleted = true;
    this.element.state = "complete";
    this.onComplete?.(this.element);
  }

  public isComplete(): boolean {
    return this.hasCompleted;
  }

  public isRevealed(): boolean {
    return this.hasRevealed;
  }
}
