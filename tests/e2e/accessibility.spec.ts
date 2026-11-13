import { test, expect } from "@playwright/test";

test.describe("Accessibility & Reduced Motion", () => {
  test("immediately reveals content when prefers-reduced-motion is active", async ({ page }) => {
    // Emulate reduced motion
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("http://localhost:6601/");

    const heroTitle = page.locator(".hero-title");
    await expect(heroTitle).toBeAttached();

    // With immediate reveal active, title should be visible immediately
    await expect(heroTitle).toBeVisible();

    const isConcealed = await heroTitle.evaluate((el) => el.classList.contains("nano66-concealed"));
    expect(isConcealed).toBe(false);
  });
});
