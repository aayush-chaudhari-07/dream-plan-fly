import { test, expect } from "@playwright/test";

test.describe("AI Trip Planner - Plan & Save Flow", () => {
  test("generates an itinerary and enables saving to trips", async ({ page }) => {
    await page.goto("/ai-planner");

    await expect(page).toHaveTitle(/AI Trip Planner/);

    // Locate the prompt textarea
    const promptInput = page.locator("textarea").first();
    await expect(promptInput).toBeVisible();

    // Fill with sample destination prompt
    await promptInput.fill("4 days in Goa with beach and seafood under 25000");

    // Click Generate Plan button
    const generateBtn = page.getByRole("button", { name: /generate plan/i });
    await expect(generateBtn).toBeVisible();
    await generateBtn.click();

    // Verify generated plan card appears
    await expect(page.locator("text=Day 1").first()).toBeVisible({ timeout: 15_000 });

    // Verify Save to My Trips action is present and clickable
    const saveButton = page.getByRole("button", { name: /save to my trips/i });
    await expect(saveButton).toBeVisible();
    await saveButton.click();

    // Expect confirmation toast or state update
    await expect(
      page.locator("text=Saved to My Trips").or(page.locator("text=Plan saved")),
    ).toBeVisible({ timeout: 6_000 });
  });
});
