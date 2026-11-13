import { test, expect } from "@playwright/test";

test.describe("Website 2 — React Integration", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:6602/");
  });

  test("mounts Nano66 within React application lifecycle", async ({ page }) => {
    const canvas = page.locator("#nano66-canvas");
    await expect(canvas).toBeAttached();

    const brand = page.locator(".nav-brand");
    await expect(brand).toBeAttached();
  });

  test("react state updates and re-renders do not conflict with Nano66", async ({ page }) => {
    // Dynamic counter should tick
    const metricValue = page.locator(".metric-value").first();
    await expect(metricValue).toBeAttached();

    // Skip to reveal
    const skipBtn = page.locator('.hud-btn:has-text("Skip")');
    await skipBtn.click();

    // Test dynamic filter tabs
    const computeTab = page.locator('button.tab-btn:has-text("COMPUTE")');
    await computeTab.click();
    await expect(computeTab).toHaveClass(/active/);

    const cards = page.locator(".react-card");
    await expect(cards).toHaveCount(1);
    await expect(cards.first()).toContainText("Quantum Kernel");

    const allTab = page.locator('button.tab-btn:has-text("ALL")');
    await allTab.click();
    await expect(cards).toHaveCount(3);
  });

  test("handles contact form interactivity and state transition", async ({ page }) => {
    const skipBtn = page.locator('.hud-btn:has-text("Skip")');
    await skipBtn.click();

    const emailInput = page.locator('input[type="email"]');
    const textarea = page.locator("textarea");
    const submitBtn = page.locator('button[type="submit"]');

    await emailInput.fill("architect@cloud.dev");
    await textarea.fill("Need a high-performance cluster for LLM serving.");
    await submitBtn.click();

    await expect(page.locator(".form-wrapper")).toContainText("Request received");
  });
});
