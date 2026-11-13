import { describe, it, expect } from "vitest";
import { TextTarget } from "../../src/targets/TextTarget";
import { ImageTarget } from "../../src/targets/ImageTarget";
import { ShapeTarget } from "../../src/targets/ShapeTarget";
import { TargetGenerator } from "../../src/targets/TargetGenerator";
import type { NanoElement } from "../../src/types";

describe("Target Generators (Text, Shape, Image, TargetGenerator)", () => {
  const dummyRect: DOMRect = {
    left: 20,
    top: 30,
    right: 180,
    bottom: 90,
    width: 160,
    height: 60,
    x: 20,
    y: 30,
    toJSON: () => {},
  };

  const computedStyle = {
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "transparent",
    fontSize: "24px",
    fontFamily: "Arial, sans-serif",
    fontWeight: "700",
    lineHeight: "30px",
    textAlign: "left",
    borderRadius: "8px",
    visibility: "visible",
    opacity: "1",
  };

  it("generates text glyph targets with fallback support", () => {
    const points = TextTarget.generate("Hello Nano66", dummyRect, computedStyle, 4);
    expect(points.length).toBeGreaterThan(0);
    expect(points[0]?.x).toBeGreaterThanOrEqual(dummyRect.left);
  });

  it("generates shape boundary and interior points", () => {
    const shapePoints = ShapeTarget.generate(dummyRect, 8, true, 6, "#38bdf8");
    expect(shapePoints.length).toBeGreaterThan(0);
    expect(shapePoints[0]?.color).toBe("#38bdf8");
  });

  it("generates image targets with fallback silhouette", () => {
    const imgEl = document.createElement("img");
    const points = ImageTarget.generate(imgEl, dummyRect, 6);
    expect(points.length).toBeGreaterThan(0);
  });

  it("coordinates TargetGenerator across all element types", () => {
    const types: NanoElement["type"][] = [
      "heading",
      "text",
      "button",
      "image",
      "card",
      "navigation",
      "icon",
      "container",
    ];

    for (const type of types) {
      const el: NanoElement = {
        id: `el-${type}`,
        element: document.createElement(type === "heading" ? "h1" : "div"),
        order: 1,
        group: "default",
        type,
        rect: dummyRect,
        computedStyle,
        targets: [],
        state: "pending",
      };
      el.element.innerText = "Sample Content";

      const targets = TargetGenerator.generateTargetsForElement(el);
      expect(targets).toBeDefined();
      expect(targets.length).toBeGreaterThan(0);
    }
  });
});
