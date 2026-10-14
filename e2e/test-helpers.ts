import type { Page } from "@playwright/test";

/**
 * Setup isolated test page environment:
 * 1. Resets client-side storage (localStorage, sessionStorage)
 * 2. Mocks third-party API dependencies (Open-Meteo, Frankfurter, OpenStreetMap tiles)
 *    so all E2E tests run deterministically in CI without external rate limits or secrets.
 */
export async function setupIsolatedTestPage(page: Page): Promise<void> {
  // 1. Storage isolation
  await page.addInitScript(() => {
    try {
      window.localStorage.clear();
      window.sessionStorage.clear();
    } catch {
      // Storage might not be accessible in all browser contexts
    }
  });

  // 2. Mock Open-Meteo Weather API
  await page.route("**/api.open-meteo.com/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        latitude: 15.2993,
        longitude: 74.124,
        generationtime_ms: 0.1,
        utc_offset_seconds: 0,
        timezone: "GMT",
        elevation: 10,
        current: {
          time: "2026-10-14T10:00",
          temperature_2m: 28.5,
          weather_code: 0,
        },
        daily: {
          time: [
            "2026-10-14",
            "2026-10-15",
            "2026-10-16",
            "2026-10-17",
            "2026-10-18",
            "2026-10-19",
            "2026-10-20",
          ],
          weather_code: [0, 1, 0, 2, 1, 0, 0],
          temperature_2m_max: [31.2, 30.5, 31.0, 29.8, 30.2, 31.5, 32.0],
          temperature_2m_min: [24.1, 23.8, 24.0, 23.5, 23.9, 24.2, 24.5],
        },
      }),
    });
  });

  // 3. Mock Frankfurter Currency API
  await page.route("**/api.frankfurter.app/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        amount: 1,
        base: "INR",
        date: "2026-10-14",
        rates: {
          USD: 0.012,
          EUR: 0.011,
          GBP: 0.0094,
          AED: 0.044,
          THB: 0.42,
        },
      }),
    });
  });

  // 4. Mock OpenStreetMap Tiles
  await page.route("**/*.tile.openstreetmap.org/**", async (route) => {
    // Return empty 1x1 transparent PNG
    const transparentPng = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
      "base64",
    );
    await route.fulfill({
      status: 200,
      contentType: "image/png",
      body: transparentPng,
    });
  });
}
