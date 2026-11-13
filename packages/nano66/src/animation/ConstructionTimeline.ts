import type { NanoElement, AnimationMode } from "../types";
import { ElementAnimator } from "./ElementAnimator";
import { VisibilityManager } from "../dom/VisibilityManager";

export interface TimelineCallbacks {
  onElementStart?: (element: NanoElement) => void;
  onElementReveal?: (element: NanoElement) => void;
  onRequestTransition?: (from: NanoElement, to: NanoElement, onReady: () => void) => void;
  onElementComplete?: (element: NanoElement) => void;
  onProgress?: (progress: number) => void;
  onAllElementsComplete?: () => void;
}

export class ConstructionTimeline {
  private elements: NanoElement[] = [];
  private animators: Map<string, ElementAnimator> = new Map();
  private mode: AnimationMode = "sequential";
  private elementDelay: number = 250;
  private revealThreshold: number = 0.8;
  private visibilityManager: VisibilityManager;
  private callbacks: TimelineCallbacks;

  private currentIndex: number = 0;
  private activeElementIds: Set<string> = new Set();
  private completedElementIds: Set<string> = new Set();
  private timeSinceLastStart: number = 0;
  private isFinished: boolean = false;
  private isTransitioning: boolean = false;

  constructor(
    elements: NanoElement[],
    visibilityManager: VisibilityManager,
    mode: AnimationMode = "sequential",
    elementDelay: number = 250,
    revealThreshold: number = 0.8,
    callbacks: TimelineCallbacks = {}
  ) {
    this.elements = elements;
    this.visibilityManager = visibilityManager;
    this.mode = mode;
    this.elementDelay = elementDelay;
    this.revealThreshold = revealThreshold;
    this.callbacks = callbacks;
  }

  public start(): void {
    if (this.elements.length === 0) {
      this.finish();
      return;
    }

    if (this.mode === "parallel") {
      // Start all or chunks in parallel
      for (let i = 0; i < this.elements.length; i++) {
        this.startElementAtIndex(i);
      }
    } else {
      // Sequential or Grouped: start first element or group
      this.startNextBatch();
    }
  }

  private startNextBatch(): void {
    if (this.currentIndex >= this.elements.length) {
      return;
    }

    if (this.mode === "grouped") {
      const currentElement = this.elements[this.currentIndex];
      if (!currentElement) return;

      const groupName = currentElement.group;
      while (
        this.currentIndex < this.elements.length &&
        this.elements[this.currentIndex]?.group === groupName
      ) {
        this.startElementAtIndex(this.currentIndex);
        this.currentIndex++;
      }
    } else {
      // Sequential
      this.startElementAtIndex(this.currentIndex);
      this.currentIndex++;
    }

    this.timeSinceLastStart = 0;
  }

  private startElementAtIndex(index: number): void {
    const el = this.elements[index];
    if (!el || this.activeElementIds.has(el.id)) return;

    el.state = "forming";
    this.activeElementIds.add(el.id);

    const animator = new ElementAnimator(
      el,
      this.visibilityManager,
      this.revealThreshold,
      (revealedEl) => {
        this.callbacks.onElementReveal?.(revealedEl);

        // In sequential mode with transitions, trigger the fish transition to next element
        if (
          this.mode === "sequential" &&
          this.callbacks.onRequestTransition &&
          this.currentIndex < this.elements.length &&
          !this.isTransitioning
        ) {
          const nextEl = this.elements[this.currentIndex];
          if (nextEl) {
            this.isTransitioning = true;
            this.callbacks.onRequestTransition(revealedEl, nextEl, () => {
              this.isTransitioning = false;
              this.startNextBatch();
            });
          }
        }
      },
      (completedEl) => {
        this.completedElementIds.add(completedEl.id);
        this.activeElementIds.delete(completedEl.id);
        this.callbacks.onElementComplete?.(completedEl);
        this.checkAllCompleted();
      }
    );

    this.animators.set(el.id, animator);
    this.callbacks.onElementStart?.(el);
  }

  public update(
    delta: number,
    arrivals: Map<string, { arrived: number; total: number }>
  ): { finished: boolean; newlyStarted: NanoElement[] } {
    if (this.isFinished) return { finished: true, newlyStarted: [] };

    this.timeSinceLastStart += delta;

    // Check if we should advance to the next element / group (when not driven by transitions)
    if (
      this.mode !== "parallel" &&
      !this.isTransitioning &&
      !this.callbacks.onRequestTransition &&
      this.currentIndex < this.elements.length &&
      this.timeSinceLastStart >= this.elementDelay
    ) {
      this.startNextBatch();
    }

    // Update active animators
    for (const [id, animator] of this.animators) {
      const stats = arrivals.get(id);
      animator.update(delta, stats);
    }

    // Calculate progress
    const total = this.elements.length;
    const completed = this.completedElementIds.size;
    const progress = total > 0 ? completed / total : 1.0;
    this.callbacks.onProgress?.(progress);

    this.checkAllCompleted();

    return {
      finished: this.isFinished,
      newlyStarted: [],
    };
  }

  private checkAllCompleted(): void {
    if (
      !this.isFinished &&
      this.currentIndex >= this.elements.length &&
      this.activeElementIds.size === 0 &&
      this.completedElementIds.size >= this.elements.length
    ) {
      this.finish();
    }
  }

  public finish(): void {
    if (this.isFinished) return;
    this.isFinished = true;

    // Ensure all elements are revealed
    for (const el of this.elements) {
      this.visibilityManager.reveal(el.element);
      el.state = "complete";
    }

    this.callbacks.onProgress?.(1.0);
    this.callbacks.onAllElementsComplete?.();
  }

  public getActiveElements(): NanoElement[] {
    return this.elements.filter((el) => this.activeElementIds.has(el.id));
  }

  public reset(): void {
    this.currentIndex = 0;
    this.activeElementIds.clear();
    this.completedElementIds.clear();
    this.animators.clear();
    this.timeSinceLastStart = 0;
    this.isFinished = false;
    this.isTransitioning = false;

    for (const el of this.elements) {
      el.state = "pending";
    }
  }
}
