import type { Point } from "../types";
import { ShapeTarget } from "./ShapeTarget";

export class ImageTarget {
  /**
   * Sample pixels from an image element.
   * If CORS restrictions or load errors occur, falls back to silhouette shape points.
   */
  public static generate(
    imgElement: HTMLElement,
    rect: DOMRect,
    step: number = 6
  ): Point[] {
    const width = Math.ceil(rect.width);
    const height = Math.ceil(rect.height);

    if (width <= 0 || height <= 0) return [];

    if (typeof document === "undefined") {
      return ShapeTarget.generate(rect, 8, true, step);
    }

    // Try canvas sampling if it's an <img> element that has completed loading
    if (imgElement instanceof HTMLImageElement && imgElement.complete && imgElement.naturalWidth > 0) {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = Math.min(width, 1024);
        canvas.height = Math.min(height, 1024);
        const ctx = canvas.getContext("2d", { willReadFrequently: true });

        if (ctx) {
          ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;
          const points: Point[] = [];
          const scaleX = width / canvas.width;
          const scaleY = height / canvas.height;

          for (let y = 0; y < canvas.height; y += step) {
            for (let x = 0; x < canvas.width; x += step) {
              const idx = (y * canvas.width + x) * 4;
              const a = data[idx + 3] ?? 0;

              if (a > 40) {
                const r = data[idx] ?? 255;
                const g = data[idx + 1] ?? 255;
                const b = data[idx + 2] ?? 255;
                points.push({
                  x: rect.left + x * scaleX,
                  y: rect.top + y * scaleY,
                  color: `rgb(${r},${g},${b})`,
                  alpha: a / 255,
                });
              }
            }
          }

          if (points.length > 0) {
            return points;
          }
        }
      } catch (err) {
        // CORS SecurityError or canvas taint: safely catch and use fallback silhouette
        // (Do not let cross-origin canvas security errors break animation)
      }
    }

    // Fallback: rounded silhouette points
    const borderRadius = parseFloat(window.getComputedStyle(imgElement).borderRadius) || 8;
    return ShapeTarget.generate(rect, borderRadius, true, step);
  }
}
