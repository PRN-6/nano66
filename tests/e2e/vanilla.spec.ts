import { test, expect } from "@playwright/test";

test.describe("Website 1 — Vanilla Integration", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:6601/");
  });

  test("attaches Nano66 canvas overlay and initializes correctly", async ({ page }) => {
    const canvas = page.locator("#nano66-canvas");
    await expect(canvas).toBeAttached();

    // Verify canvas styling
    const position = await canvas.evaluate((el) => window.getComputedStyle(el).position);
    expect(position).toBe("fixed");

    // Verify HUD bar is present and ignored
    const controls = page.locator(".nano-controls");
    await expect(controls).toBeVisible();
    await expect(controls).toHaveAttribute("data-nano-ignore", "");
  });

  test("progressively reveals website elements until completed", async ({ page }) => {
    const heroTitle = page.locator(".hero-title");
    await expect(heroTitle).toBeAttached();

    // Skip animation using the HUD button
    const skipBtn = page.locator("#btn-skip");
    await skipBtn.click();

    // After skip, all elements should be visible
    await expect(heroTitle).toBeVisible();
    const heroVisible = await heroTitle.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.visibility === "visible" && !el.classList.contains("nano66-concealed");
    });
    expect(heroVisible).toBe(true);

    // Verify status pill updates to Constructed or Interactive
    const statusPill = page.locator("#status-pill");
    await expect(statusPill).toHaveText(/Constructed|Interactive/);
  });

  test("supports restart, pause, and resume controls", async ({ page }) => {
    const pauseBtn = page.locator("#btn-pause");
    const statusPill = page.locator("#status-pill");

    // Wait until animation is in progress
    await expect(statusPill).toHaveText(/Building|Constructing|Swimming|Scattering/);

    // Click pause
    await pauseBtn.click();
    await expect(statusPill).toHaveText("Paused");
    await expect(pauseBtn).toHaveText(/Resume/);

    // Click resume
    await pauseBtn.click();
    await expect(pauseBtn).toHaveText(/Pause/);

    // Click restart
    const restartBtn = page.locator("#btn-restart");
    await restartBtn.click();
    await expect(statusPill).toHaveText(/Building|Constructing|Swimming|Scattering|Ready/);
  });

  test("toggles dark and light themes smoothly", async ({ page }) => {
    const themeBtn = page.locator("#btn-theme");
    const html = page.locator("html");

    await expect(html).toHaveAttribute("data-theme", "dark");

    await themeBtn.click();
    await expect(html).toHaveAttribute("data-theme", "light");

    await themeBtn.click();
    await expect(html).toHaveAttribute("data-theme", "dark");
  });

  test("preserves interactivity and links after construction", async ({ page }) => {
    // Skip to completion
    await page.locator("#btn-skip").click();

    const cta = page.locator('.hero-actions a[href="#projects"]');
    await expect(cta).toBeVisible();
    await cta.click();

    // Expect hash or viewport to scroll to projects
    await expect(page).toHaveURL(/#projects/);
  });
});
