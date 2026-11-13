import { describe, it, expect } from "vitest";
import { ColorUtils, DARK_THEME_PALETTE, LIGHT_THEME_PALETTE } from "../../src/utils/ColorUtils";

describe("ColorUtils", () => {
  it("parses 3, 6, and 8 digit hex colors correctly", () => {
    const white = ColorUtils.parseColor("#fff");
    expect(white).toEqual({ r: 255, g: 255, b: 255, a: 1 });

    const black = ColorUtils.parseColor("#000000");
    expect(black).toEqual({ r: 0, g: 0, b: 0, a: 1 });

    const semiRed = ColorUtils.parseColor("#ff000080");
    expect(semiRed.r).toBe(255);
    expect(semiRed.g).toBe(0);
    expect(semiRed.b).toBe(0);
    expect(semiRed.a).toBeCloseTo(0.5, 1);
  });

  it("parses rgb and rgba strings", () => {
    const rgb = ColorUtils.parseColor("rgb(100, 150, 200)");
    expect(rgb).toEqual({ r: 100, g: 150, b: 200, a: 1 });

    const rgba = ColorUtils.parseColor("rgba(50, 60, 70, 0.4)");
    expect(rgba).toEqual({ r: 50, g: 60, b: 70, a: 0.4 });
  });

  it("calculates WCAG relative luminance", () => {
    const whiteLum = ColorUtils.getLuminance({ r: 255, g: 255, b: 255, a: 1 });
    expect(whiteLum).toBeCloseTo(1, 2);

    const blackLum = ColorUtils.getLuminance({ r: 0, g: 0, b: 0, a: 1 });
    expect(blackLum).toBeCloseTo(0, 2);

    expect(whiteLum).toBeGreaterThan(blackLum);
  });

  it("accurately identifies dark vs light background colors", () => {
    expect(ColorUtils.isDark({ r: 15, g: 23, b: 42, a: 1 })).toBe(true); // Dark slate
    expect(ColorUtils.isDark({ r: 0, g: 0, b: 0, a: 1 })).toBe(true); // Black
    expect(ColorUtils.isDark({ r: 255, g: 255, b: 255, a: 1 })).toBe(false); // White
    expect(ColorUtils.isDark({ r: 240, g: 240, b: 240, a: 1 })).toBe(false); // Off-white
  });

  it("converts colors to 24-bit numeric integers for PixiJS", () => {
    expect(ColorUtils.toHexNumber("#ffffff")).toBe(0xffffff);
    expect(ColorUtils.toHexNumber("#000000")).toBe(0x000000);
    expect(ColorUtils.toHexNumber("#ff0000")).toBe(0xff0000);
    expect(ColorUtils.toHexNumber("rgb(0, 255, 0)")).toBe(0x00ff00);
  });

  it("provides distinct theme palettes", () => {
    expect(DARK_THEME_PALETTE.length).toBeGreaterThan(0);
    expect(LIGHT_THEME_PALETTE.length).toBeGreaterThan(0);
    expect(DARK_THEME_PALETTE).not.toEqual(LIGHT_THEME_PALETTE);
  });
});
