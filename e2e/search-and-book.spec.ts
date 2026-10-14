import { test, expect } from "@playwright/test";
import { setupIsolatedTestPage } from "./test-helpers";

test.describe("Search & Demo-Booking Flow", () => {
  test.beforeEach(async ({ page }) => {
    await setupIsolatedTestPage(page);
  });

  test("searches destinations and completes demo booking flow to E-ticket", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector('body[data-hydrated="true"]', { timeout: 15_000 });

    // 1. Open search dialog via search button in header navbar
    const searchButton = page.getByTestId("search-button");
    await expect(searchButton).toBeVisible({ timeout: 10_000 });
    await searchButton.click();

    // 2. Query search input
    const searchInput = page.getByTestId("search-input");
    await expect(searchInput).toBeVisible({ timeout: 10_000 });
    await searchInput.fill("Goa");

    // Close search dialog
    await page.keyboard.press("Escape");
    await expect(searchInput).not.toBeVisible();

    // 3. Navigate to /bookings
    await page.goto("/bookings");
    await page.waitForSelector('body[data-hydrated="true"]', { timeout: 15_000 });
    await expect(page).toHaveTitle(/Book Flights, Hotels/);

    // 4. Verify primary flight card is rendered with Demo pricing badge
    const firstFlightCard = page.getByTestId("first-flight-card");
    await expect(firstFlightCard).toBeVisible({ timeout: 10_000 });
    await expect(firstFlightCard.getByText("Demo pricing")).toBeVisible();

    // 5. Click Book Flight on the first option and wait for checkout navigation
    const bookBtn = firstFlightCard.getByRole("button", { name: /book flight/i });
    await expect(bookBtn).toBeVisible({ timeout: 10_000 });

    await Promise.all([page.waitForURL(/\/checkout/, { timeout: 15_000 }), bookBtn.click()]);
    await expect(page).toHaveURL(/\/checkout/);

    // 6. On checkout page, fill traveler info
    const nameField = page.locator("#fullName");
    await expect(nameField).toBeVisible({ timeout: 10_000 });
    await nameField.fill("Aarav Mehta");

    // 7. Submit checkout form to open demo payment modal
    const continueBtn = page.getByTestId("checkout-continue");
    await expect(continueBtn).toBeVisible({ timeout: 10_000 });
    await continueBtn.click();

    // 8. Complete demo payment and wait for confirmation URL
    const payConfirmBtn = page.getByTestId("demo-pay-submit-btn");
    await expect(payConfirmBtn).toBeVisible({ timeout: 10_000 });

    await Promise.all([
      page.waitForURL(/\/booking-confirmation/, { timeout: 20_000 }),
      payConfirmBtn.click(),
    ]);
    await expect(page).toHaveURL(/\/booking-confirmation/);

    // 9. Verify E-ticket confirmation page loaded with booking reference & voucher
    await expect(page.getByTestId("booking-confirmation")).toBeVisible({ timeout: 10_000 });
    await expect(page.getByTestId("booking-confirmation-ref")).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText("DEMO TICKET")).toBeVisible();
  });
});
