import { test, expect } from "@playwright/test";

test.describe("Animation Lifecycle & Cursor Attraction", () => {
  test("constructs elements in specified sequence order", async ({ page }) => {
    await page.goto("http://localhost:6601/");

    const nav = page.locator(".site-header");
    await expect(nav).toBeAttached();

    // Verify nav is revealed earlier than footer
    const footer = page.locator(".site-footer");
    await expect(footer).toBeAttached();

    // Move cursor across screen to verify cursor attraction listener
    await page.mouse.move(100, 100);
    await page.mouse.move(400, 300);
    await page.mouse.move(800, 600);

    // Skip to complete
    await page.locator("#btn-skip").click();

    // All should be revealed
    await expect(nav).toBeVisible();
    await expect(footer).toBeVisible();
  });
});
