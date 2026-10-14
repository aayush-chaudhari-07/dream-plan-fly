import { test, expect } from "@playwright/test";

test.describe("AI Trip Planner - Plan & Save Flow", () => {
  test("generates an itinerary and enables saving to trips", async ({ page }) => {
    await page.goto("/ai-planner");
    await page.waitForSelector('body[data-hydrated="true"]', { timeout: 15_000 });

    await expect(page).toHaveTitle(/AI Trip Planner/);

    // Locate the prompt textarea
    const promptInput = page.locator("textarea").first();
    await expect(promptInput).toBeVisible();

    // Fill with sample destination prompt
    await promptInput.fill("4 days in Goa with beach and seafood under 25000");

    // Click Generate My Trip button
    const generateBtn = page.getByRole("button", {
      name: /generate my trip/i,
    });
    await expect(generateBtn).toBeVisible();
    await generateBtn.click();

    // Wait for generation to complete
    await expect(
      page.getByText(/Itinerary ready|Itinerary generated|AI service error/i).first(),
    ).toBeVisible({ timeout: 25_000 });

    // Verify Save to My Trips action is present and clickable
    const saveButton = page.getByRole("button", { name: /save to my trips/i });
    await expect(saveButton).toBeVisible();
    await saveButton.click();

    // Expect confirmation toast or state update
    await expect(page.getByText(/Plan saved to My Trips|Plan saved/i).first()).toBeVisible({
      timeout: 10_000,
    });
  });
});
