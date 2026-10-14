import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { setupIsolatedTestPage } from "./test-helpers";

test.describe("Accessibility Audit (Axe-Core WCAG Standards)", () => {
  test.beforeEach(async ({ page }) => {
    await setupIsolatedTestPage(page);
  });

  test("home page passes axe accessibility scan with zero critical violations", async ({
    page,
  }) => {
    await page.goto("/");
    // Wait for content to mount
    await page.waitForLoadState("domcontentloaded");

    const scanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .exclude(".leaflet-container")
      .analyze();

    // Filter out minor third-party tile or canvas warnings if any
    const seriousViolations = scanResults.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );

    expect(seriousViolations).toEqual([]);
  });

  test("terms and privacy legal pages pass axe accessibility scan", async ({ page }) => {
    await page.goto("/terms");
    const termsScan = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    expect(termsScan.violations.filter((v) => v.impact === "critical")).toEqual([]);

    await page.goto("/privacy");
    const privacyScan = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    expect(privacyScan.violations.filter((v) => v.impact === "critical")).toEqual([]);
  });

  test("help center / FAQ page passes axe accessibility scan", async ({ page }) => {
    await page.goto("/faq");
    const faqScan = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    expect(faqScan.violations.filter((v) => v.impact === "critical")).toEqual([]);
  });
});
