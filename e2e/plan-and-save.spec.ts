import { test, expect } from "@playwright/test";
import { setupIsolatedTestPage } from "./test-helpers";

test.describe("AI Trip Planner - Plan & Save Flow", () => {
  test.beforeEach(async ({ page }) => {
    await setupIsolatedTestPage(page);
  });

  test("generates an itinerary and enables saving to trips", async ({ page }) => {
    await page.goto("/ai-planner");
    await page.waitForSelector('body[data-hydrated="true"]', { timeout: 15_000 });

    await expect(page).toHaveTitle(/AI Trip Planner/);

    // 1. Locate the prompt textarea via stable testid
    const promptInput = page.getByTestId("planner-prompt-input");
    await expect(promptInput).toBeVisible({ timeout: 10_000 });

    // 2. Fill prompt with destination parameters
    await promptInput.fill("4 days in Goa with beach and seafood under 25000");

    // 3. Click Generate Plan button via stable testid
    const generateBtn = page.getByTestId("generate-plan-button");
    await expect(generateBtn).toBeVisible({ timeout: 10_000 });
    await generateBtn.click();

    // 4. Wait for itinerary generation to finish and display the Save button
    const saveButton = page.getByTestId("save-plan-button");
    await expect(saveButton).toBeVisible({ timeout: 25_000 });
    await saveButton.click();

    // 5. Expect confirmation toast notification
    const saveToast = page
      .locator("[data-sonner-toast]")
      .filter({ hasText: /Plan saved to My Trips/i });
    await expect(saveToast).toBeVisible({ timeout: 10_000 });
  });
});
