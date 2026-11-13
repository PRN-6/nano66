import { describe, it, expect, vi } from "vitest";
import { ConstructionTimeline } from "../../src/animation/ConstructionTimeline";
import { ElementAnimator } from "../../src/animation/ElementAnimator";
import { VisibilityManager } from "../../src/dom/VisibilityManager";
import type { NanoElement } from "../../src/types";

describe("Timeline & ElementAnimator", () => {
  const createMockElement = (id: string, group = "default"): NanoElement => ({
    id,
    element: document.createElement("div"),
    order: 1,
    group,
    type: "card",
    rect: { left: 0, top: 0, right: 100, bottom: 50, width: 100, height: 50, x: 0, y: 0, toJSON: () => {} } as DOMRect,
    computedStyle: {
      color: "#fff",
      backgroundColor: "#000",
      borderColor: "transparent",
      fontSize: "16px",
      fontFamily: "sans-serif",
      fontWeight: "400",
      lineHeight: "20px",
      textAlign: "left",
      borderRadius: "0px",
      visibility: "hidden",
      opacity: "0",
    },
    targets: [{ x: 10, y: 10 }],
    state: "pending",
  });

  it("ElementAnimator reveals and completes based on arrival threshold", () => {
    const visibilityManager = new VisibilityManager();
    const el = createMockElement("el-1");
    const onRevealed = vi.fn();
    const onComplete = vi.fn();

    const animator = new ElementAnimator(el, visibilityManager, 0.8, onRevealed, onComplete);

    // Initial update: 50% arrived (below 80% threshold)
    animator.update(16, { arrived: 5, total: 10 });
    expect(animator.isRevealed()).toBe(false);

    // 85% arrived (reaches 80% threshold)
    animator.update(16, { arrived: 9, total: 10 });
    expect(animator.isRevealed()).toBe(true);
    expect(onRevealed).toHaveBeenCalledWith(el);

    // 100% arrived
    animator.update(16, { arrived: 10, total: 10 });
    expect(animator.isComplete()).toBe(true);
    expect(onComplete).toHaveBeenCalledWith(el);
  });

  it("ConstructionTimeline executes sequential construction", () => {
    const visibilityManager = new VisibilityManager();
    const el1 = createMockElement("el-1");
    const el2 = createMockElement("el-2");

    const onStart = vi.fn();
    const onProgress = vi.fn();
    const onAllComplete = vi.fn();

    const timeline = new ConstructionTimeline(
      [el1, el2],
      visibilityManager,
      "sequential",
      100,
      0.8,
      {
        onElementStart: onStart,
        onProgress,
        onAllElementsComplete: onAllComplete,
      }
    );

    timeline.start();
    expect(onStart).toHaveBeenCalledTimes(1);

    // Advance time past elementDelay (150ms)
    const arrivals = new Map([
      ["el-1", { arrived: 10, total: 10 }],
      ["el-2", { arrived: 10, total: 10 }],
    ]);

    timeline.update(150, arrivals);
    timeline.update(150, arrivals);

    timeline.finish();
    expect(onAllComplete).toHaveBeenCalled();
  });

  it("ConstructionTimeline handles parallel and grouped modes", () => {
    const visibilityManager = new VisibilityManager();
    const el1 = createMockElement("el-1", "header");
    const el2 = createMockElement("el-2", "header");
    const onStart = vi.fn();

    const groupedTimeline = new ConstructionTimeline(
      [el1, el2],
      visibilityManager,
      "grouped",
      100,
      0.8,
      { onElementStart: onStart }
    );

    groupedTimeline.start();
    // Grouped elements sharing same group should start simultaneously
    expect(onStart).toHaveBeenCalledTimes(2);

    const parallelTimeline = new ConstructionTimeline(
      [el1, el2],
      visibilityManager,
      "parallel",
      100,
      0.8,
      { onElementStart: onStart }
    );
    parallelTimeline.start();
    expect(onStart).toHaveBeenCalledTimes(4);
  });
});
