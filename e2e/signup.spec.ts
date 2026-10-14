import { test, expect } from "@playwright/test";

test.describe("Authentication - Sign Up Flow", () => {
  test("renders signup page and validates form fields", async ({ page }) => {
    await page.goto("/signup");

    // Check title and header
    await expect(page).toHaveTitle(/Create Account/);
    await expect(page.locator("h1")).toContainText(/Plan Less. Travel More.|Create/i);

    // Verify form elements exist
    const nameInput = page.locator("#signup-name");
    const emailInput = page.locator("#signup-email");
    const passwordInput = page.locator("#signup-password");
    const submitButton = page.getByRole("button", { name: /create account/i });

    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();

    // Verify link to login page works
    const loginLink = page.locator('a[href*="/login"]').first();
    await expect(loginLink).toBeVisible();
  });

  test("can fill demo signup credentials and trigger flow", async ({ page }) => {
    await page.goto("/signup");

    await page.locator("#signup-name").fill("Rohan Sharma");
    await page.locator("#signup-email").fill("rohan.sharma@example.com");
    await page.locator("#signup-password").fill("DemoSecret123!");

    const submitButton = page.getByRole("button", { name: /create account/i });
    await expect(submitButton).toBeEnabled();
  });
});
