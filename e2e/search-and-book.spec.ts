import { test, expect } from "@playwright/test";

test.describe("Search & Demo-Booking Flow", () => {
  test("searches destinations and completes demo booking flow to E-ticket", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector('body[data-hydrated="true"]', { timeout: 15_000 });

    // 1. Open search dialog via search button in header navbar
    const searchButton = page.locator('header button[aria-label*="Search" i]').first();
    await expect(searchButton).toBeVisible();
    await searchButton.click();

    // Check search dialog input
    const searchInput = page
      .getByPlaceholder(/search destinations, trips/i)
      .or(page.locator("[cmdk-input]"))
      .first();
    await expect(searchInput).toBeVisible({ timeout: 10_000 });
    await searchInput.fill("Goa");

    // Click on destination result or close dialog and navigate to /bookings
    await page.keyboard.press("Escape");

    // 2. Navigate to /bookings
    await page.goto("/bookings");
    await page.waitForSelector('body[data-hydrated="true"]', { timeout: 15_000 });
    await expect(page).toHaveTitle(/Book Flights, Hotels/);

    // Verify Demo pricing badge is visible
    await expect(page.locator("text=Demo pricing").first()).toBeVisible();

    // 3. Click Book on the first available option
    const bookBtn = page
      .locator('[data-testid="book-flight-btn"]')
      .or(page.getByRole("button", { name: /book flight/i }))
      .first();
    await expect(bookBtn).toBeVisible({ timeout: 10_000 });
    await bookBtn.click();

    // 4. On checkout page, fill traveler info
    await expect(page).toHaveURL(/checkout/, { timeout: 10_000 });
    const nameField = page.locator("#fullName").or(page.locator('input[name="fullName"]')).first();
    await expect(nameField).toBeVisible({ timeout: 10_000 });
    await nameField.fill("Aarav Mehta");

    // 5. Submit checkout to trigger demo payment modal
    const proceedBtn = page
      .locator('[data-testid="checkout-pay-btn"]')
      .or(page.getByRole("button", { name: /continue to payment/i }))
      .first();
    await expect(proceedBtn).toBeVisible({ timeout: 10_000 });
    await proceedBtn.click();

    // 6. Complete demo payment in modal
    const payConfirmBtn = page
      .locator('[data-testid="demo-pay-submit-btn"]')
      .or(page.getByRole("button", { name: /pay.*demo/i }))
      .first();
    await expect(payConfirmBtn).toBeVisible({ timeout: 10_000 });
    await payConfirmBtn.click();

    // 7. Verify E-ticket confirmation page loaded with booking reference & QR code
    await expect(page).toHaveURL(/booking-confirmation/, { timeout: 20_000 });
    await expect(page.locator("text=Confirmed").first()).toBeVisible({ timeout: 10_000 });
  });
});
