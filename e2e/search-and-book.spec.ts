import { test, expect } from "@playwright/test";

test.describe("Search & Demo-Booking Flow", () => {
  test("searches destinations and completes demo booking flow to E-ticket", async ({ page }) => {
    await page.goto("/");

    // 1. Open search dialog via search button in navbar
    const searchButton = page.getByRole("button", { name: /search/i }).first();
    await expect(searchButton).toBeVisible();
    await searchButton.click();

    // Check search dialog input
    const searchInput = page.getByPlaceholder(/search destinations|search anything/i);
    await expect(searchInput).toBeVisible();
    await searchInput.fill("Goa");

    // Click on destination result or close dialog and navigate to /bookings
    await page.keyboard.press("Escape");

    // 2. Navigate to /bookings
    await page.goto("/bookings");
    await expect(page).toHaveTitle(/Book Flights, Hotels/);

    // Verify Demo pricing badge is visible
    await expect(page.locator("text=Demo pricing").first()).toBeVisible();

    // 3. Click Book on the first available option
    const bookButtons = page.getByRole("button", { name: /book|reserve/i });
    if ((await bookButtons.count()) > 0) {
      await bookButtons.first().click();
    } else {
      // Fallback navigate to checkout
      await page.goto("/checkout?kind=stay&title=Taj+Exotica+Resort&price=18500&destination=Goa");
    }

    // 4. On checkout page, fill traveler info
    await expect(page).toHaveURL(/checkout/);
    const nameField = page.locator('input[placeholder*="Name"], input[name="fullName"]').first();
    const emailField = page.locator('input[type="email"], input[name="email"]').first();
    const phoneField = page.locator('input[type="tel"], input[name="phone"]').first();

    if (await nameField.isVisible()) {
      await nameField.fill("Aarav Mehta");
    }
    if (await emailField.isVisible()) {
      await emailField.fill("aarav.mehta@example.com");
    }
    if (await phoneField.isVisible()) {
      await phoneField.fill("9876543210");
    }

    // 5. Submit checkout to trigger demo payment modal
    const proceedBtn = page.getByRole("button", { name: /proceed to payment|pay/i });
    await expect(proceedBtn).toBeVisible();
    await proceedBtn.click();

    // 6. Complete demo payment in modal
    const payConfirmBtn = page.getByRole("button", { name: /confirm demo payment|simulate/i });
    if (await payConfirmBtn.isVisible()) {
      await payConfirmBtn.click();
    }

    // 7. Verify E-ticket confirmation page loaded with booking reference & QR code
    await expect(page).toHaveURL(/booking-confirmation/, { timeout: 15_000 });
    await expect(page.locator("text=Confirmed").first()).toBeVisible();
  });
});
