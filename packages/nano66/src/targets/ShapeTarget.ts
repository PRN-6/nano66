import type { Point } from "../types";

export class ShapeTarget {
  /**
   * Generate points outlining the shape boundary (with optional rounded corners)
   * and an optional interior surface grid.
   */
  public static generate(
    rect: DOMRect,
    borderRadius: number = 0,
    includeInterior: boolean = true,
    step: number = 6,
    color?: string
  ): Point[] {
    const points: Point[] = [];
    const width = rect.width;
    const height = rect.height;

    if (width <= 0 || height <= 0) return points;

    const r = Math.min(borderRadius, width / 2, height / 2);

    // Perimeter points
    // Top edge
    for (let x = rect.left + r; x <= rect.right - r; x += step) {
      points.push({ x, y: rect.top, color });
    }
    // Bottom edge
    for (let x = rect.left + r; x <= rect.right - r; x += step) {
      points.push({ x, y: rect.bottom, color });
    }
    // Left edge
    for (let y = rect.top + r; y <= rect.bottom - r; y += step) {
      points.push({ x: rect.left, y, color });
    }
    // Right edge
    for (let y = rect.top + r; y <= rect.bottom - r; y += step) {
      points.push({ x: rect.right, y, color });
    }

    // Rounded corners if radius > 0
    if (r > 0) {
      const cornerSteps = Math.max(3, Math.floor((r * Math.PI) / (2 * step)));

      // Top-Right Corner
      const trCenterX = rect.right - r;
      const trCenterY = rect.top + r;
      for (let i = 0; i <= cornerSteps; i++) {
        const theta = -Math.PI / 2 + (i / cornerSteps) * (Math.PI / 2);
        points.push({
          x: trCenterX + Math.cos(theta) * r,
          y: trCenterY + Math.sin(theta) * r,
          color,
        });
      }

      // Bottom-Right Corner
      const brCenterX = rect.right - r;
      const brCenterY = rect.bottom - r;
      for (let i = 0; i <= cornerSteps; i++) {
        const theta = 0 + (i / cornerSteps) * (Math.PI / 2);
        points.push({
          x: brCenterX + Math.cos(theta) * r,
          y: brCenterY + Math.sin(theta) * r,
          color,
        });
      }

      // Bottom-Left Corner
      const blCenterX = rect.left + r;
      const blCenterY = rect.bottom - r;
      for (let i = 0; i <= cornerSteps; i++) {
        const theta = Math.PI / 2 + (i / cornerSteps) * (Math.PI / 2);
        points.push({
          x: blCenterX + Math.cos(theta) * r,
          y: blCenterY + Math.sin(theta) * r,
          color,
        });
      }

      // Top-Left Corner
      const tlCenterX = rect.left + r;
      const tlCenterY = rect.top + r;
      for (let i = 0; i <= cornerSteps; i++) {
        const theta = Math.PI + (i / cornerSteps) * (Math.PI / 2);
        points.push({
          x: tlCenterX + Math.cos(theta) * r,
          y: tlCenterY + Math.sin(theta) * r,
          color,
        });
      }
    }

    // Interior surface fill points (with wider spacing)
    if (includeInterior) {
      const interiorStep = step * 2.2;
      for (let y = rect.top + r + interiorStep; y < rect.bottom - r; y += interiorStep) {
        for (let x = rect.left + r + interiorStep; x < rect.right - r; x += interiorStep) {
          points.push({
            x,
            y,
            color,
            alpha: 0.6,
          });
        }
      }
    }

    return points;
  }
}
