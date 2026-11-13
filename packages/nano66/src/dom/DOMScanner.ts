import { ElementDetector } from "./ElementDetector";
import { GeometryCapture } from "./GeometryCapture";
import type { NanoElement } from "../types";

export class DOMScanner {
  private target: HTMLElement;

  constructor(target: HTMLElement) {
    this.target = target;
  }

  public scan(): NanoElement[] {
    if (typeof document === "undefined") return [];

    // Select candidate elements: headers, paragraphs, buttons, links, images, icons, cards, containers
    const selector = [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "button",
      "a.btn",
      "a.button",
      "header nav",
      "nav",
      "img",
      "svg",
      ".card",
      "[data-nano-card]",
      "article",
      "footer",
    ].join(", ");

    const rawElements = Array.from(this.target.querySelectorAll<HTMLElement>(selector));

    // Also include elements with explicit data-nano-order or data-nano-group
    const explicitElements = Array.from(
      this.target.querySelectorAll<HTMLElement>("[data-nano-order], [data-nano-group]")
    );

    const merged = Array.from(new Set([...rawElements, ...explicitElements]));

    const detected: NanoElement[] = [];
    let idCounter = 1;

    for (const el of merged) {
      // Check if ignored or within an ignored parent
      if (el.hasAttribute("data-nano-ignore") || el.closest("[data-nano-ignore]") !== null) {
        continue;
      }

      // Avoid duplicate nested text if parent heading/card is already picked
      // If el is a child of another candidate and has no explicit order, evaluate appropriateness
      const geometry = GeometryCapture.capture(el);
      if (!geometry) continue;

      const type = ElementDetector.detectType(el);
      const order = ElementDetector.getPriority(el, type);
      const group = el.getAttribute("data-nano-group") || "default";

      detected.push({
        id: `nano-el-${idCounter++}`,
        element: el,
        order,
        group,
        type,
        rect: geometry.rect,
        computedStyle: geometry.computedStyle,
        targets: [],
        state: "pending",
      });
    }

    // Sort by order ascending, then by vertical screen position top-to-bottom
    detected.sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      return a.rect.top - b.rect.top || a.rect.left - b.rect.left;
    });

    return detected;
  }
}
