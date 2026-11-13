export interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

export const DARK_THEME_PALETTE = ["#FFFFFF", "#F8FAFC", "#E2E8F0", "#94A3B8", "#38BDF8"];
export const LIGHT_THEME_PALETTE = ["#0F172A", "#1E293B", "#334155", "#475569", "#0284C7"];

export const ColorUtils = {
  /**
   * Parse any CSS color string into RGBA components (0-255 for RGB, 0-1 for Alpha)
   */
  parseColor(input: string): RGBA {
    const str = input.trim().toLowerCase();

    // Transparent or none
    if (str === "transparent" || str === "" || str === "rgba(0, 0, 0, 0)") {
      return { r: 0, g: 0, b: 0, a: 0 };
    }

    // Hex colors #rgb, #rgba, #rrggbb, #rrggbbaa
    if (str.startsWith("#")) {
      const hex = str.slice(1);
      if (hex.length === 3 || hex.length === 4) {
        const r = parseInt((hex[0] ?? "0") + (hex[0] ?? "0"), 16);
        const g = parseInt((hex[1] ?? "0") + (hex[1] ?? "0"), 16);
        const b = parseInt((hex[2] ?? "0") + (hex[2] ?? "0"), 16);
        const a = hex.length === 4 ? parseInt((hex[3] ?? "f") + (hex[3] ?? "f"), 16) / 255 : 1;
        return { r, g, b, a };
      }
      if (hex.length === 6 || hex.length === 8) {
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
        return { r, g, b, a };
      }
    }

    // rgb(...) or rgba(...)
    const rgbMatch = str.match(/rgba?\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)(?:\s*,\s*([0-9.]+))?\s*\)/);
    if (rgbMatch) {
      return {
        r: Math.round(parseFloat(rgbMatch[1] ?? "0")),
        g: Math.round(parseFloat(rgbMatch[2] ?? "0")),
        b: Math.round(parseFloat(rgbMatch[3] ?? "0")),
        a: rgbMatch[4] !== undefined ? parseFloat(rgbMatch[4]) : 1,
      };
    }

    // Default fallback
    return { r: 255, g: 255, b: 255, a: 1 };
  },

  /**
   * Calculate relative luminance following WCAG 2.1 specs
   */
  getLuminance(color: RGBA): number {
    const sRGB = [color.r / 255, color.g / 255, color.b / 255].map((val) => {
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    const r = sRGB[0] ?? 0;
    const g = sRGB[1] ?? 0;
    const b = sRGB[2] ?? 0;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  },

  /**
   * Determine if a background color is dark (luminance < 0.45)
   */
  isDark(color: RGBA): boolean {
    // If transparent, consider dark by default or defer to parent
    if (color.a < 0.1) return true;
    return this.getLuminance(color) < 0.45;
  },

  /**
   * Convert color to 24-bit numeric integer for PixiJS (e.g. 0xFFFFFF)
   */
  toHexNumber(input: string | RGBA): number {
    const rgba = typeof input === "string" ? this.parseColor(input) : input;
    return ((rgba.r & 0xff) << 16) | ((rgba.g & 0xff) << 8) | (rgba.b & 0xff);
  },

  /**
   * Linear interpolation between two hex colors
   */
  lerpColor(hexA: string, hexB: string, t: number): string {
    const a = this.parseColor(hexA);
    const b = this.parseColor(hexB);
    const r = Math.round(a.r + (b.r - a.r) * t);
    const g = Math.round(a.g + (b.g - a.g) * t);
    const bl = Math.round(a.b + (b.b - a.b) * t);
    const alpha = a.a + (b.a - a.a) * t;
    return `rgba(${r}, ${g}, ${bl}, ${alpha.toFixed(2)})`;
  },

  /**
   * Detect theme of an HTML element by recursively traversing up to document.body/html
   */
  detectTheme(element: HTMLElement): "dark" | "light" {
    let curr: HTMLElement | null = element;
    while (curr) {
      const bg = window.getComputedStyle(curr).backgroundColor;
      const parsed = this.parseColor(bg);
      if (parsed.a > 0.1) {
        return this.isDark(parsed) ? "dark" : "light";
      }
      curr = curr.parentElement;
    }

    // Also check documentElement or body
    const docBg = window.getComputedStyle(document.documentElement).backgroundColor;
    const docParsed = this.parseColor(docBg);
    if (docParsed.a > 0.1) {
      return this.isDark(docParsed) ? "dark" : "light";
    }

    // Default to dark theme if undetected
    return "dark";
  },

  /**
   * Get palette for theme
   */
  getThemePalette(theme: "dark" | "light"): string[] {
    return theme === "dark" ? [...DARK_THEME_PALETTE] : [...LIGHT_THEME_PALETTE];
  },
};
