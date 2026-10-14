import { test, expect } from "@playwright/test";
import { setupIsolatedTestPage } from "./test-helpers";

test.describe("Trip Fund & Wishlist Flows", () => {
  test.beforeEach(async ({ page }) => {
    await setupIsolatedTestPage(page);
  });

  test("toggles destination wishlist and opens wishlist drawer", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector('body[data-hydrated="true"]', { timeout: 15_000 });

    // 1. Locate destination card and toggle heart button for Goa
    const cardHeart = page.getByTestId("wishlist-toggle-goa");
    await expect(cardHeart).toBeVisible({ timeout: 10_000 });
    await cardHeart.click();

    // 2. Open wishlist sheet specifically from header Navbar
    const wishlistNavBtn = page.getByTestId("wishlist-button");
    await expect(wishlistNavBtn).toBeVisible({ timeout: 10_000 });
    await wishlistNavBtn.click();

    // 3. Verify Wishlist sheet opened
    const wishlistSheet = page.getByTestId("wishlist-sheet");
    await expect(wishlistSheet).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 10_000 });

    // 4. Close wishlist sheet via Escape
    await page.keyboard.press("Escape");
    await expect(wishlistSheet).not.toBeVisible();
  });

  test("interacts with trip savings fund", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector('body[data-hydrated="true"]', { timeout: 15_000 });

    // 1. Scroll to TripFund section
    const fundSection = page.getByTestId("trip-fund-section");
    await fundSection.scrollIntoViewIfNeeded();
    await expect(fundSection).toBeVisible();

    // 2. Locate first fund card (ft1: Japan 2027) and open Contribute dialog
    const fundCard = page.getByTestId("fund-card-ft1");
    await expect(fundCard).toBeVisible({ timeout: 10_000 });

    const openContributeBtn = fundCard.getByTestId("trip-fund-open");
    await expect(openContributeBtn).toBeVisible({ timeout: 10_000 });
    await openContributeBtn.click();

    // 3. Verify Contribute dialog is open
    const dialog = page.getByTestId("trip-fund-dialog");
    await expect(dialog).toBeVisible({ timeout: 10_000 });

    // 4. Submit contribution
    const submitBtn = dialog.getByTestId("contribute-dialog-submit");
    await expect(submitBtn).toBeVisible({ timeout: 10_000 });
    await submitBtn.click();

    // 5. Verify dialog closes and toast notification appears
    await expect(dialog).not.toBeVisible();
    const fundToast = page
      .locator("[data-sonner-toast]")
      .filter({ hasText: /added to|Milestone|Goal Reached/i });
    await expect(fundToast).toBeVisible({ timeout: 10_000 });
  });
});
