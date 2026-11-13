import { TextTarget } from "./TextTarget";
import { ShapeTarget } from "./ShapeTarget";
import { ImageTarget } from "./ImageTarget";
import type { NanoElement, Point } from "../types";

export class TargetGenerator {
  public static generateTargetsForElement(el: NanoElement, densityStep: number = 4): Point[] {
    const { element, type, rect, computedStyle } = el;
    const borderRadius = parseFloat(computedStyle.borderRadius) || 0;

    switch (type) {
      case "heading": {
        const text = element.innerText || element.textContent || "";
        return TextTarget.generate(text, rect, computedStyle, densityStep);
      }

      case "text": {
        const text = element.innerText || element.textContent || "";
        // For general paragraphs, if short generate glyphs; otherwise combine lines
        return TextTarget.generate(text, rect, computedStyle, densityStep);
      }

      case "button": {
        const text =
          element.innerText || element.textContent || (element as HTMLInputElement).value || "";
        const shapePoints = ShapeTarget.generate(
          rect,
          borderRadius || 6,
          false,
          densityStep * 1.5,
          computedStyle.borderColor !== "transparent" ? computedStyle.borderColor : computedStyle.color
        );
        const textPoints = text.trim()
          ? TextTarget.generate(text, rect, computedStyle, densityStep)
          : [];
        return [...shapePoints, ...textPoints];
      }

      case "image": {
        return ImageTarget.generate(element, rect, densityStep * 1.5);
      }

      case "card": {
        const shapePoints = ShapeTarget.generate(
          rect,
          borderRadius || 12,
          false,
          densityStep * 2.0,
          computedStyle.borderColor !== "transparent" ? computedStyle.borderColor : "#ffffff"
        );
        const cardText = element.innerText || element.textContent || "";
        const textPoints = cardText.trim()
          ? TextTarget.generate(cardText, rect, computedStyle, densityStep * 1.5)
          : [];
        return [...shapePoints, ...textPoints];
      }

      case "navigation": {
        const text = element.innerText || element.textContent || "";
        if (text.trim().length > 0) {
          return TextTarget.generate(text, rect, computedStyle, densityStep);
        }
        return ShapeTarget.generate(rect, 4, false, densityStep * 2);
      }

      case "icon": {
        return ShapeTarget.generate(rect, borderRadius || 4, true, densityStep * 1.2);
      }

      case "container":
      default: {
        return ShapeTarget.generate(rect, borderRadius, false, densityStep * 2.5);
      }
    }
  }
}
