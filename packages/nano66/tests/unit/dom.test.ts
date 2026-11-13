import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { DOMScanner } from "../../src/dom/DOMScanner";
import { ElementDetector } from "../../src/dom/ElementDetector";
import { VisibilityManager } from "../../src/dom/VisibilityManager";
import { ShapeTarget } from "../../src/targets/ShapeTarget";

describe("DOM Intelligence & Scanning", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    container.id = "test-root";
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("detects element types correctly", () => {
    const h1 = document.createElement("h1");
    const btn = document.createElement("button");
    const p = document.createElement("p");
    const nav = document.createElement("nav");
    const img = document.createElement("img");

    expect(ElementDetector.detectType(h1)).toBe("heading");
    expect(ElementDetector.detectType(btn)).toBe("button");
    expect(ElementDetector.detectType(p)).toBe("text");
    expect(ElementDetector.detectType(nav)).toBe("navigation");
    expect(ElementDetector.detectType(img)).toBe("image");
  });

  it("respects explicit data-nano-order attribute", () => {
    const el = document.createElement("div");
    el.setAttribute("data-nano-order", "5");
    expect(ElementDetector.getPriority(el, "container")).toBe(5);
  });

  it("conceals and smoothly reveals elements with VisibilityManager", () => {
    const manager = new VisibilityManager();
    const el = document.createElement("div");
    el.innerText = "Content";
    container.appendChild(el);

    manager.conceal(el);
    expect(el.classList.contains("nano66-concealed")).toBe(true);

    manager.reveal(el);
    expect(el.classList.contains("nano66-concealed")).toBe(false);
    expect(el.classList.contains("nano66-revealing")).toBe(true);

    manager.restore();
    expect(el.classList.contains("nano66-revealing")).toBe(false);
  });

  it("generates geometric shape target points", () => {
    const rect = {
      left: 10,
      right: 110,
      top: 10,
      bottom: 60,
      width: 100,
      height: 50,
      x: 10,
      y: 10,
      toJSON: () => {},
    } as DOMRect;

    const points = ShapeTarget.generate(rect, 4, true, 8, "#38bdf8");
    expect(points.length).toBeGreaterThan(0);
    expect(points[0]?.x).toBeDefined();
    expect(points[0]?.y).toBeDefined();
    expect(points[0]?.color).toBe("#38bdf8");
  });
});
