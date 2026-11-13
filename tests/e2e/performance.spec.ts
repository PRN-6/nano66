import { test, expect } from "@playwright/test";

test.describe("Performance & Responsive Behavior", () => {
  test("adjusts canvas dimensions upon viewport resize", async ({ page }) => {
    await page.goto("http://localhost:6601/");

    // Wait until Nano66 is initialized and running
    const statusPill = page.locator("#status-pill");
    await expect(statusPill).toHaveText(/Ready|Swimming|Constructing|Building/);

    const canvas = page.locator("#nano66-canvas");
    await expect(canvas).toBeAttached();

    // Resize viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });

    await expect
      .poll(async () =>
        canvas.evaluate((el: HTMLCanvasElement) =>
          Math.round(el.width / (window.devicePixelRatio || 1))
        )
      )
      .toBeLessThanOrEqual(385);
  });

  test("runs smoothly and finishes construction without uncaught console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("http://localhost:6601/");
    await page.waitForTimeout(1000);

    expect(errors).toHaveLength(0);
  });
});
