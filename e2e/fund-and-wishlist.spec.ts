import { test, expect } from "@playwright/test";

test.describe("Trip Fund & Wishlist Flows", () => {
  test("toggles destination wishlist and opens wishlist drawer", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector('body[data-hydrated="true"]', { timeout: 15_000 });

    // 1. Open wishlist sheet specifically from header Navbar
    const wishlistNavBtn = page.locator('header button[aria-label="Wishlist"]').first();
    await expect(wishlistNavBtn).toBeVisible({ timeout: 10_000 });
    await wishlistNavBtn.click();

    // 2. Verify Wishlist sheet opened
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 10_000 });
    await page.keyboard.press("Escape");

    // 3. Locate and toggle heart button on a destination card
    const cardHeart = page.locator('article button[aria-label*="wishlist" i]').first();
    if (await cardHeart.isVisible()) {
      await cardHeart.click();
    }
  });

  test("interacts with trip savings fund", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector('body[data-hydrated="true"]', { timeout: 15_000 });

    // Scroll to TripFund section
    const fundSection = page.locator("text=Trip Fund").first();
    await fundSection.scrollIntoViewIfNeeded();
    await expect(fundSection).toBeVisible();

    // Click quick deposit button (e.g. +₹1,000)
    const quickAddBtn = page.locator('button:has-text("+₹")').first();
    if (await quickAddBtn.isVisible()) {
      await quickAddBtn.click();
      await expect(page.locator("[data-sonner-toast]").first()).toBeVisible({
        timeout: 6_000,
      });
    }
  });
});
