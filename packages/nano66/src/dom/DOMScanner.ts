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
      "nav a",
      "header a",
      "img",
      "picture",
      "svg",
      ".card",
      "[data-nano-card]",
      "[class*='card']",
      "article",
      "input",
      "textarea",
      "select",
      ".hero-pill",
      "[class*='pill']",
      "[class*='badge']",
      "[class*='tag']",
      "[class*='brand']",
      "[class*='logo']",
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

      const geometry = GeometryCapture.capture(el);
      if (!geometry) continue;

      const type = ElementDetector.detectType(el);
      const order = ElementDetector.getPriority(el, type);
      const group =
        el.getAttribute("data-nano-group") ||
        el.closest("[data-nano-group]")?.getAttribute("data-nano-group") ||
        "default";

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

    // Filter out layout wrappers (containers that contain other detected elements)
    // so hollow wireframe rectangles aren't drawn around sections, headers, and grids.
    const filtered = detected.filter((item) => {
      if (item.type === "container") {
        const containsOther = detected.some(
          (other) => other !== item && item.element.contains(other.element)
        );
        if (containsOther) {
          return false;
        }
      }
      return true;
    });

    // Sort by order ascending, then by vertical screen position top-to-bottom
    filtered.sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      return a.rect.top - b.rect.top || a.rect.left - b.rect.left;
    });

    return filtered;
  }
}
