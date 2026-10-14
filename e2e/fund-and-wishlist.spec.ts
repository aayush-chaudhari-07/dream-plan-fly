import { test, expect } from "@playwright/test";

test.describe("Trip Fund & Wishlist Flows", () => {
  test("toggles destination wishlist and opens wishlist drawer", async ({ page }) => {
    await page.goto("/");

    // Locate the first wishlist heart button on a destination card
    const heartButtons = page.locator(
      'button[aria-label*="wishlist" i], button:has(svg.lucide-heart)',
    );
    await expect(heartButtons.first()).toBeVisible({ timeout: 10_000 });

    // Click heart to toggle wishlist
    await heartButtons.first().click();

    // Open wishlist sheet from Navbar
    const wishlistNavBtn = page.getByRole("button", { name: /wishlist/i }).first();
    await expect(wishlistNavBtn).toBeVisible();
    await wishlistNavBtn.click();

    // Verify Wishlist sheet opened
    await expect(page.locator("text=Your Wishlist").first()).toBeVisible();
  });

  test("interacts with trip savings fund", async ({ page }) => {
    await page.goto("/");

    // Scroll to TripFund section
    const fundSection = page.locator("text=Trip Fund").first();
    await fundSection.scrollIntoViewIfNeeded();
    await expect(fundSection).toBeVisible();

    // Check for Add Contribution / Deposit button
    const depositBtn = page.getByRole("button", { name: /deposit|contribute|add/i }).first();
    if (await depositBtn.isVisible()) {
      await depositBtn.click();
      // Ensure contribution modal or form is accessible
      await expect(page.locator("role=dialog").or(page.locator("text=Contribute"))).toBeVisible();
    }
  });
});
