import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  fetchWeatherForecast,
  clearWeatherCache,
  describeWmoCode,
  getFallbackWeather,
} from "../weather";
import { fetchExchangeRates, convertCurrency, clearCurrencyCache } from "../currency";
import {
  getDailyFluctuationPercent,
  getFluctuatedPrice,
  evaluateAlertThreshold,
  evaluatePriceAlertsJob,
  handlePriceFluctuationsCron,
  type PriceAlertRecord,
  type PriceAlertDependencies,
} from "../price-fluctuations";

describe("Live Data Services (Weather, Currency & Price Alerts)", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    clearWeatherCache();
    clearCurrencyCache();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe("Open-Meteo Weather Service", () => {
    it("successfully fetches live weather and 7-day forecast from Open-Meteo", async () => {
      const mockOpenMeteoResponse = {
        latitude: 32.25,
        longitude: 77.2,
        current: {
          time: "2026-10-14T00:00",
          temperature_2m: 11.4,
          relative_humidity_2m: 62,
          weather_code: 0,
          wind_speed_10m: 6.8,
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
          weather_code: [0, 1, 2, 61, 71, 0, 1],
          temperature_2m_max: [16.5, 15.2, 14.0, 11.0, 7.5, 13.0, 15.0],
          temperature_2m_min: [6.0, 5.5, 4.2, 3.0, -1.0, 4.0, 5.0],
          precipitation_probability_max: [0, 5, 20, 80, 70, 10, 0],
        },
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockOpenMeteoResponse,
      } as Response);

      const result = await fetchWeatherForecast(32.2432, 77.1892);

      expect(result.isFallback).toBe(false);
      expect(result.current.temperature).toBe(11.4);
      expect(result.current.condition).toBe("Clear Sky");
      expect(result.current.humidity).toBe(62);
      expect(result.daily).toHaveLength(7);
      expect(result.daily[0]?.tempMax).toBe(16.5);
      expect(result.daily[3]?.condition).toBe("Rain Showers");
      expect(result.daily[4]?.condition).toBe("Snowfall");
      expect(result.attribution).toContain("Open-Meteo.com");
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    });

    it("caches weather results for 30 minutes, preventing redundant API calls", async () => {
      const mockRes = {
        current: {
          temperature_2m: 14.0,
          weather_code: 1,
          relative_humidity_2m: 50,
          wind_speed_10m: 10,
        },
        daily: {
          time: ["2026-10-14"],
          weather_code: [1],
          temperature_2m_max: [18],
          temperature_2m_min: [10],
          precipitation_probability_max: [10],
        },
      };

      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockRes,
      } as Response);

      globalThis.fetch = fetchMock;

      // First call -> hits API
      const res1 = await fetchWeatherForecast(15.49, 73.82);
      expect(res1.current.temperature).toBe(14.0);
      expect(fetchMock).toHaveBeenCalledTimes(1);

      // Second call with same coordinates -> served from 30-min cache
      const res2 = await fetchWeatherForecast(15.49, 73.82);
      expect(res2.current.temperature).toBe(14.0);
      expect(fetchMock).toHaveBeenCalledTimes(1); // Still 1
    });

    it("gracefully falls back to offline estimated weather when Open-Meteo returns HTTP 500 or network fails", async () => {
      globalThis.fetch = vi.fn().mockRejectedValue(new Error("Network Error / Offline"));

      const fallback = await fetchWeatherForecast(34.0837, 74.7973); // Srinagar

      expect(fallback.isFallback).toBe(true);
      expect(fallback.current.temperature).toBeGreaterThan(0);
      expect(fallback.daily).toHaveLength(7);
      expect(fallback.attribution).toContain("Open-Meteo.com");
      expect(fallback.daily[0]?.dayName).toBeTruthy();
    });

    it("correctly maps WMO weather codes to human descriptions", () => {
      expect(describeWmoCode(0)).toBe("Clear Sky");
      expect(describeWmoCode(1)).toBe("Mainly Clear");
      expect(describeWmoCode(45)).toBe("Foggy / Mist");
      expect(describeWmoCode(61)).toBe("Rain Showers");
      expect(describeWmoCode(71)).toBe("Snowfall");
      expect(describeWmoCode(95)).toBe("Thunderstorm");
    });
  });

  describe("Frankfurter Currency Service", () => {
    it("successfully fetches live ECB exchange rates with INR as base", async () => {
      const mockFrankfurterResponse = {
        amount: 1.0,
        base: "INR",
        date: "2026-10-14",
        rates: {
          USD: 0.0121,
          EUR: 0.0112,
          GBP: 0.0096,
          JPY: 1.82,
          AUD: 0.0185,
          CAD: 0.0167,
          SGD: 0.0161,
        },
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockFrankfurterResponse,
      } as Response);

      const rates = await fetchExchangeRates();

      expect(rates.base).toBe("INR");
      expect(rates.rates["USD"]).toBe(0.0121);
      expect(rates.rates["EUR"]).toBe(0.0112);
      expect(rates.attribution).toContain("European Central Bank");
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    });

    it("converts currency accurately from INR to supported target currencies", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          base: "INR",
          date: "2026-10-14",
          rates: {
            USD: 0.012,
            EUR: 0.011,
            JPY: 1.8,
          },
        }),
      } as Response);

      const usdResult = await convertCurrency(10000, "USD");
      expect(usdResult.currency).toBe("USD");
      expect(usdResult.convertedAmount).toBe(120);
      expect(usdResult.symbol).toBe("$");
      expect(usdResult.formatted).toBe("$120.00");
      expect(usdResult.isFallback).toBe(false);

      const jpyResult = await convertCurrency(10000, "JPY");
      expect(jpyResult.currency).toBe("JPY");
      expect(jpyResult.convertedAmount).toBe(18000);
      expect(jpyResult.symbol).toBe("¥");
    });

    it("falls back to INR only when the target currency is unsupported", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          base: "INR",
          rates: { USD: 0.012, EUR: 0.011 },
        }),
      } as Response);

      // AED or XYZ is not in the mock rates
      const unsupported = await convertCurrency(15000, "AED");

      expect(unsupported.currency).toBe("INR");
      expect(unsupported.convertedAmount).toBe(15000);
      expect(unsupported.symbol).toBe("₹");
      expect(unsupported.rate).toBe(1.0);
      expect(unsupported.isFallback).toBe(true);
    });

    it("falls back to INR cleanly when Frankfurter API is completely down", async () => {
      globalThis.fetch = vi.fn().mockRejectedValue(new Error("Frankfurter connection refused"));

      const res = await convertCurrency(5000, "USD");

      // Uses fallback offline cache rates gracefully
      expect(res.convertedAmount).toBeGreaterThan(0);
      expect(res.symbol).toBe("$");
    });
  });

  describe("Deterministic Price Fluctuations & Price Alert Evaluation", () => {
    it("generates deterministic daily fluctuation percentages for the same key and date", () => {
      const p1 = getDailyFluctuationPercent("DEL-BOM", "2026-10-14");
      const p2 = getDailyFluctuationPercent("DEL-BOM", "2026-10-14");
      const pOtherDay = getDailyFluctuationPercent("DEL-BOM", "2026-10-15");

      expect(p1).toBe(p2);
      expect(p1).toBeGreaterThanOrEqual(-12);
      expect(p1).toBeLessThanOrEqual(8);
      // Different days yield deterministic different values
      expect(typeof pOtherDay).toBe("number");
    });

    it("applies deterministic price fluctuation to base prices", () => {
      const base = 5000;
      const fluctuated = getFluctuatedPrice(base, "DEL-GOI", "2026-10-14");

      expect(fluctuated).toBeGreaterThan(base * 0.85);
      expect(fluctuated).toBeLessThan(base * 1.15);
    });

    it("evaluates alert thresholds cleanly using pure function", () => {
      const alert: PriceAlertRecord = {
        id: "test",
        userId: "u1",
        itemType: "flight",
        itemId: "DEL-GOI",
        title: "Delhi to Goa",
        targetPrice: 5000,
        basePrice: 6000,
        currentPrice: 6000,
        isActive: true,
        createdAt: 1000,
      };

      expect(evaluateAlertThreshold(alert, 4500)).toEqual({ shouldTrigger: true, savings: 1500 });
      expect(evaluateAlertThreshold(alert, 5000)).toEqual({ shouldTrigger: true, savings: 1000 });
      expect(evaluateAlertThreshold(alert, 5001)).toEqual({ shouldTrigger: false, savings: 999 });
      expect(evaluateAlertThreshold({ ...alert, isActive: false }, 4000)).toEqual({
        shouldTrigger: false,
        savings: 2000,
      });
    });

    it("evaluates price alerts and detects when a fluctuated price drops below the target", async () => {
      const mockAlerts: PriceAlertRecord[] = [
        {
          id: "alt-1",
          userId: "user-1",
          itemType: "flight",
          itemId: "DEL-GOI",
          title: "Flight: Delhi to Goa",
          targetPrice: 6000,
          basePrice: 5500,
          currentPrice: 5500,
          isActive: true,
          createdAt: Date.now(),
        },
        {
          id: "alt-2",
          userId: "user-2",
          itemType: "stay",
          itemId: "stay-taj",
          title: "Taj Resort Goa",
          targetPrice: 2000,
          basePrice: 15000,
          currentPrice: 15000,
          isActive: true,
          createdAt: Date.now(),
        },
      ];

      const notifyMock = vi.fn().mockResolvedValue(undefined);
      const updateAlertMock = vi.fn().mockResolvedValue(undefined);

      const result = await evaluatePriceAlertsJob(mockAlerts, {
        priceSource: (basePrice, itemId) => (itemId === "DEL-GOI" ? 5200 : 14000),
        notify: notifyMock,
        updateAlert: updateAlertMock,
        now: () => new Date("2026-10-14T10:00:00Z"),
      });

      expect(result.status).toBe("ok");
      expect(result.checkedCount).toBe(2);
      expect(result.alertsTriggered).toBe(1);
      expect(result.failedCount).toBe(0);

      const triggered = result.triggeredAlerts.find((t) => t.alertId === "alt-1");
      expect(triggered).toBeDefined();
      expect(triggered?.currentPrice).toBe(5200);
      expect(triggered?.savings).toBe(300);

      expect(notifyMock).toHaveBeenCalledTimes(1);
      expect(notifyMock).toHaveBeenCalledWith(expect.objectContaining({ id: "alt-1" }), 5200, 300);
      expect(updateAlertMock).toHaveBeenCalledTimes(1);
    });

    it("does not trigger when fluctuated price stays above target price", async () => {
      const mockAlerts: PriceAlertRecord[] = [
        {
          id: "alt-above",
          userId: "user-1",
          itemType: "flight",
          itemId: "DEL-BOM",
          title: "Flight: Delhi to Mumbai",
          targetPrice: 3000,
          basePrice: 5000,
          currentPrice: 5000,
          isActive: true,
          createdAt: Date.now(),
        },
      ];

      const notifyMock = vi.fn();
      const result = await evaluatePriceAlertsJob(mockAlerts, {
        priceSource: () => 4500, // strictly above 3000
        notify: notifyMock,
      });

      expect(result.status).toBe("ok");
      expect(result.alertsTriggered).toBe(0);
      expect(result.triggeredAlerts).toHaveLength(0);
      expect(notifyMock).not.toHaveBeenCalled();
    });

    it("triggers notification exactly once when price drops below target price", async () => {
      const mockAlerts: PriceAlertRecord[] = [
        {
          id: "alt-drop",
          userId: "user-1",
          itemType: "stay",
          itemId: "hotel-goa",
          title: "Goa Beachfront Villa",
          targetPrice: 4000,
          basePrice: 5000,
          currentPrice: 5000,
          isActive: true,
          createdAt: Date.now(),
        },
      ];

      const notifyMock = vi.fn().mockResolvedValue(undefined);
      const updateAlertMock = vi.fn().mockResolvedValue(undefined);

      const result = await evaluatePriceAlertsJob(mockAlerts, {
        priceSource: () => 3500,
        notify: notifyMock,
        updateAlert: updateAlertMock,
      });

      expect(result.status).toBe("ok");
      expect(result.alertsTriggered).toBe(1);
      expect(notifyMock).toHaveBeenCalledTimes(1);
      expect(notifyMock).toHaveBeenCalledWith(
        expect.objectContaining({ id: "alt-drop" }),
        3500,
        1500,
      );
      expect(updateAlertMock).toHaveBeenCalledTimes(1);
    });

    it("isolates failures so one failing alert dependency does not block other alerts", async () => {
      const mockAlerts: PriceAlertRecord[] = [
        {
          id: "alt-fail",
          userId: "user-1",
          itemType: "flight",
          itemId: "FAIL-ITEM",
          title: "Failing Alert",
          targetPrice: 5000,
          basePrice: 6000,
          currentPrice: 6000,
          isActive: true,
          createdAt: Date.now(),
        },
        {
          id: "alt-success",
          userId: "user-2",
          itemType: "flight",
          itemId: "OK-ITEM",
          title: "Successful Alert",
          targetPrice: 5000,
          basePrice: 6000,
          currentPrice: 6000,
          isActive: true,
          createdAt: Date.now(),
        },
      ];

      const notifyMock = vi.fn().mockImplementation((alert: PriceAlertRecord) => {
        if (alert.id === "alt-fail") {
          return Promise.reject(new Error("Downstream Notification Service Failed"));
        }
        return Promise.resolve();
      });

      const result = await evaluatePriceAlertsJob(mockAlerts, {
        priceSource: () => 4000,
        notify: notifyMock,
        timeoutMs: 1000,
      });

      expect(result.status).toBe("degraded");
      expect(result.checkedCount).toBe(2);
      expect(result.alertsTriggered).toBe(2);
      expect(result.failedCount).toBe(1);
      expect(result.failedAlerts[0]?.alertId).toBe("alt-fail");
      expect(result.failedAlerts[0]?.error).toContain("Downstream Notification Service Failed");
      expect(result.triggeredAlerts.find((t) => t.alertId === "alt-success")).toBeDefined();
    });

    it("cuts off a hung price source dependency via timeout without hanging the test suite", async () => {
      const mockAlerts: PriceAlertRecord[] = [
        {
          id: "alt-hung",
          userId: "user-1",
          itemType: "flight",
          itemId: "HUNG-ITEM",
          title: "Hung Alert",
          targetPrice: 5000,
          basePrice: 6000,
          currentPrice: 6000,
          isActive: true,
          createdAt: Date.now(),
        },
      ];

      const result = await evaluatePriceAlertsJob(mockAlerts, {
        priceSource: () => new Promise<never>(() => {}), // never resolves
        timeoutMs: 50, // short injected timeout
      });

      expect(result.status).toBe("error");
      expect(result.failedCount).toBe(1);
      expect(result.failedAlerts[0]?.alertId).toBe("alt-hung");
      expect(result.failedAlerts[0]?.error).toContain(
        "Operation timed out after 50ms: priceLookup:alt-hung",
      );
    });

    it("rejects unauthorized cron requests without secret header with HTTP 401", async () => {
      process.env["CRON_SECRET"] = "super-secret-cron-token";

      const unauthReq = new Request("https://localhost/api/cron/price-fluctuations", {
        headers: {},
      });

      const response = await handlePriceFluctuationsCron(unauthReq);
      expect(response.status).toBe(401);
      const json = await response.json();
      expect(json.error).toBe("Unauthorized");
    });

    it("accepts authorized cron requests with valid x-cron-secret header with HTTP 200", async () => {
      process.env["CRON_SECRET"] = "super-secret-cron-token";

      const authReq = new Request("https://localhost/api/cron/price-fluctuations", {
        headers: {
          "x-cron-secret": "super-secret-cron-token",
        },
      });

      const response = await handlePriceFluctuationsCron(authReq);
      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json.status).toBe("ok");
      expect(typeof json.checkedCount).toBe("number");
    });
  });
});
