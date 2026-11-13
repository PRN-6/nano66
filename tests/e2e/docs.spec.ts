import { test, expect } from "@playwright/test";

test.describe("Documentation Website & Live Playground", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:6603/");
  });

  test("loads documentation page and initializes Nano66 canvas", async ({ page }) => {
    const canvas = page.locator("#nano66-canvas");
    await expect(canvas).toBeAttached();

    const title = page.locator(".docs-title");
    await expect(title).toBeAttached();
  });

  test("live playground allows parameter tuning and restarts animation", async ({ page }) => {
    // 1. Verify playground controls
    const sliderCount = page.locator("#slider-count");
    const valCount = page.locator("#val-count");

    await sliderCount.fill("6000");
    await expect(valCount).toHaveText("6000");

    // 2. Select custom neon color and parallel mode
    await page.locator("#select-color").selectOption("#10b981");
    await page.locator("#select-mode").selectOption("parallel");

    // 3. Click restart with settings
    const btnRestart = page.locator("#btn-apply-restart");
    await btnRestart.click();

    const statusBadge = page.locator("#engine-status");
    await expect(statusBadge).toHaveText(/Constructing|Ready/);

    // 4. Test skip
    const btnSkip = page.locator("#btn-skip-anim");
    await btnSkip.click();
    await expect(statusBadge).toHaveText("Interactive");
  });

  test("toggles theme between dark and light mode", async ({ page }) => {
    const themeBtn = page.locator("#theme-toggle");
    const html = page.locator("html");

    await expect(html).toHaveAttribute("data-theme", "dark");
    await themeBtn.click();
    await expect(html).toHaveAttribute("data-theme", "light");
  });
});
