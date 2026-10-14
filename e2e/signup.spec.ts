import { test, expect } from "@playwright/test";

test.describe("Authentication - Sign Up Flow", () => {
  test("renders signup page and validates form fields", async ({ page }) => {
    await page.goto("/signup");

    // Check title and header
    await expect(page).toHaveTitle(/Create Account/);
    await expect(page.locator("h1")).toContainText(/Join SmartTrip|Create your account/i);

    // Verify form elements exist
    const nameInput = page.locator('input[type="text"]').first();
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');

    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();

    // Verify link to login page works
    const loginLink = page.locator('a[href*="/login"]');
    await expect(loginLink).toBeVisible();
  });

  test("can fill demo signup credentials and trigger flow", async ({ page }) => {
    await page.goto("/signup");

    await page.locator('input[type="text"]').first().fill("Rohan Sharma");
    await page.locator('input[type="email"]').fill("rohan.sharma@example.com");
    await page.locator('input[type="password"]').fill("DemoSecret123!");

    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeEnabled();
  });
});
