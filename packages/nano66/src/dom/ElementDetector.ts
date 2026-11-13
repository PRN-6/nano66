import type { NanoElementType } from "../types";

export class ElementDetector {
  public static detectType(el: HTMLElement): NanoElementType {
    const tagName = el.tagName.toLowerCase();
    const role = el.getAttribute("role")?.toLowerCase();

    if (tagName.startsWith("h") && ["h1", "h2", "h3", "h4", "h5", "h6"].includes(tagName)) {
      return "heading";
    }

    if (
      tagName === "button" ||
      role === "button" ||
      el.classList.contains("btn") ||
      el.classList.contains("button") ||
      (tagName === "input" && ["button", "submit"].includes((el as HTMLInputElement).type))
    ) {
      return "button";
    }

    if (tagName === "nav" || el.closest("nav") !== null) {
      return "navigation";
    }

    if (tagName === "img" || tagName === "picture" || el.classList.contains("avatar") || el.classList.contains("profile-img")) {
      return "image";
    }

    if (tagName === "svg" || el.classList.contains("icon") || el.querySelector("svg") !== null) {
      return "icon";
    }

    if (
      el.classList.contains("card") ||
      el.hasAttribute("data-nano-card") ||
      tagName === "article"
    ) {
      return "card";
    }

    if (tagName === "p" || tagName === "span" || tagName === "li") {
      return "text";
    }

    return "container";
  }

  public static getPriority(el: HTMLElement, type: NanoElementType): number {
    // Check explicit data-nano-order first
    const explicitOrder = el.getAttribute("data-nano-order");
    if (explicitOrder !== null) {
      const parsed = parseInt(explicitOrder, 10);
      if (!isNaN(parsed)) return parsed;
    }

    // Default heuristic order
    switch (type) {
      case "navigation":
        return 10;
      case "heading": {
        const tag = el.tagName.toLowerCase();
        if (tag === "h1") return 20;
        if (tag === "h2") return 30;
        return 40;
      }
      case "text":
        return 50;
      case "button":
        return 60;
      case "image":
        return 70;
      case "icon":
        return 75;
      case "card":
        return 80;
      case "container":
      default: {
        const tag = el.tagName.toLowerCase();
        if (tag === "footer") return 990;
        return 100;
      }
    }
  }
}
