import type { Point } from "../types";

export class TextTarget {
  /**
   * Rasterize text onto an offscreen canvas and sample non-transparent glyph pixels
   */
  public static generate(
    text: string,
    rect: DOMRect,
    computedStyle: {
      fontSize: string;
      fontFamily: string;
      fontWeight: string;
      lineHeight: string;
      textAlign: string;
      color: string;
    },
    densityStep: number = 3
  ): Point[] {
    const cleanText = text.trim();
    if (!cleanText || rect.width <= 0 || rect.height <= 0) {
      return [];
    }

    if (typeof document === "undefined") {
      // In non-browser / mock environment, generate perimeter fallback
      return this.generateFallbackPoints(rect);
    }

    const canvas = document.createElement("canvas");
    const width = Math.min(2048, Math.ceil(rect.width));
    const height = Math.min(2048, Math.ceil(rect.height));
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      return this.generateFallbackPoints(rect);
    }

    const fontSize = parseFloat(computedStyle.fontSize) || 24;
    const font = `${computedStyle.fontWeight} ${fontSize}px ${computedStyle.fontFamily}`;

    ctx.font = font;
    ctx.fillStyle = "#ffffff";
    ctx.textBaseline = "middle";

    // Align text according to computed textAlign
    let textX = 0;
    if (computedStyle.textAlign === "center") {
      ctx.textAlign = "center";
      textX = width / 2;
    } else if (computedStyle.textAlign === "right") {
      ctx.textAlign = "right";
      textX = width;
    } else {
      ctx.textAlign = "left";
      textX = 0;
    }

    // Split into wrapped lines if text is multiline
    const words = cleanText.split(/\s+/);
    const lines: string[] = [];
    let currentLine = words[0] || "";

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const testLine = `${currentLine} ${word}`;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > width && width > 50) {
        lines.push(currentLine);
        currentLine = word || "";
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine);

    const lineHeight = parseFloat(computedStyle.lineHeight) || fontSize * 1.25;
    const totalTextHeight = lines.length * lineHeight;
    let startY = (height - totalTextHeight) / 2 + lineHeight / 2;

    for (const line of lines) {
      ctx.fillText(line, textX, startY);
      startY += lineHeight;
    }

    // Sample pixels from canvas
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    const points: Point[] = [];
    const step = Math.max(2, densityStep);

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const index = (y * width + x) * 4;
        const alpha = data[index + 3];

        if (alpha !== undefined && alpha > 80) {
          points.push({
            x: rect.left + x,
            y: rect.top + y,
            color: computedStyle.color,
            alpha: Math.min(1.0, alpha / 255),
          });
        }
      }
    }

    return points.length > 0 ? points : this.generateFallbackPoints(rect);
  }

  private static generateFallbackPoints(rect: DOMRect): Point[] {
    const points: Point[] = [];
    const step = 8;
    for (let x = rect.left; x <= rect.right; x += step) {
      points.push({ x, y: rect.top + rect.height / 2 });
    }
    return points;
  }
}
