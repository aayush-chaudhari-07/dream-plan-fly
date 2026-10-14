import { test, expect } from "@playwright/test";
import { setupIsolatedTestPage } from "./test-helpers";

test.describe("Production SSR Resilience & Health Verification", () => {
  test.beforeEach(async ({ page }) => {
    await setupIsolatedTestPage(page);
  });

  test("GET / returns HTTP 200 with complete app shell and branding", async ({ page, request }) => {
    // 1. Raw HTTP response validation
    const rawResponse = await request.get("/");
    expect(rawResponse.status()).toBe(200);
    const contentType = rawResponse.headers()["content-type"] || "";
    expect(contentType).toContain("text/html");

    const html = await rawResponse.text();
    expect(html.toLowerCase()).toContain("<!doctype html>");
    expect(html).toContain("<html");
    expect(html).toContain("<head>");
    expect(html).toContain("SmartTrip");
    // Ensure no unhandled Nitro JSON error leaked into HTML
    expect(html).not.toContain('"unhandled":true');

    // 2. Browser navigation & hydration validation
    const response = await page.goto("/", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);

    // Document title
    await expect(page).toHaveTitle(/SmartTrip/i);

    // Verify root favicons and meta
    const svgIcon = page.locator('link[rel="icon"][href="/favicon.svg"]');
    await expect(svgIcon).toHaveCount(1);

    const icoIcon = page.locator('link[rel="icon"][href="/favicon.ico"]');
    await expect(icoIcon).toHaveCount(1);

    // Verify hydrated app shell
    const body = page.locator("body");
    await expect(body).toHaveAttribute("data-hydrated", "true", { timeout: 10_000 });

    // Verify key brand elements are rendered
    await expect(page.locator("nav")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("GET /api/health returns HTTP 200 with { ok: true }", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.status()).toBe(200);
    const contentType = response.headers()["content-type"] || "";
    expect(contentType).toContain("application/json");

    const data = await response.json();
    expect(data.ok).toBe(true);
    expect(data.status).toMatch(/healthy|degraded/);
    expect(typeof data.timestamp).toBe("string");
  });

  test("Main public routes return HTTP 200 with app shell", async ({ page }) => {
    const routes = ["/explore", "/ai-planner", "/my-trips", "/bookings", "/save"];

    for (const route of routes) {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(response?.status(), `Route ${route} should return HTTP 200`).toBe(200);
      await expect(page).toHaveTitle(/SmartTrip/i);
    }
  });
});
