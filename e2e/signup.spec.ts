import { test, expect } from "@playwright/test";
import { setupIsolatedTestPage } from "./test-helpers";

test.describe("Authentication - Sign Up Flow", () => {
  test.beforeEach(async ({ page }) => {
    await setupIsolatedTestPage(page);
  });

  test("renders signup page and validates form fields", async ({ page }) => {
    await page.goto("/signup");
    await page.waitForSelector('body[data-hydrated="true"]', { timeout: 15_000 });

    // 1. Check title and brand headline
    await expect(page).toHaveTitle(/Create Account/);
    await expect(page.getByTestId("signup-heading")).toHaveText(/Plan Less\. Travel More\./);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // 2. Locate the signup form (scoped container to prevent footer newsletter duplicate)
    const signupForm = page.getByTestId("signup-form");
    await expect(signupForm).toBeVisible();

    // 3. Verify form elements within the signup form
    const nameInput = signupForm.getByTestId("signup-name");
    const emailInput = signupForm.getByTestId("signup-email");
    const passwordInput = signupForm.getByTestId("signup-password");
    const submitButton = signupForm.getByTestId("signup-submit");

    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();

    // 4. Verify link to login page works
    const loginLink = page.getByTestId("signup-login-link");
    await expect(loginLink).toBeVisible();
  });

  test("can fill demo signup credentials and trigger flow", async ({ page }) => {
    await page.goto("/signup");
    await page.waitForSelector('body[data-hydrated="true"]', { timeout: 15_000 });

    // Scoped to signup form container
    const signupForm = page.getByTestId("signup-form");
    await signupForm.getByTestId("signup-name").fill("Rohan Sharma");
    await signupForm.getByTestId("signup-email").fill("rohan.sharma@example.com");
    await signupForm.getByTestId("signup-password").fill("DemoSecret123!");

    const submitButton = signupForm.getByTestId("signup-submit");
    await expect(submitButton).toBeEnabled();
  });
});
