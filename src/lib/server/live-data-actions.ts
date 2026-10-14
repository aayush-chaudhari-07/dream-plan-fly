/**
 * Live Data Server Functions (Weather, Currency, Price Alerts)
 * Uses free, key-less APIs (Open-Meteo & Frankfurter) with server caching and fallback.
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { fetchWeatherForecast, type WeatherResult } from "@/server/weather";
import {
  fetchExchangeRates,
  convertCurrency,
  type ExchangeRates,
  type ConversionResult,
} from "@/server/currency";
import {
  getFluctuatedPrice,
  getDailyFluctuationPercent,
  type PriceAlertRecord,
} from "@/server/price-fluctuations";
import { destinations } from "@/data/travel";
import { getServerUser, getSupabaseServerClient } from "@/lib/supabase/server";
import { assertServerFnRateLimit } from "@/server/rate-limit-guard";

// Coordinates for the 8 hill stations
const HILL_STATION_COORDS: Record<string, { lat: number; lng: number }> = {
  Manali: { lat: 32.2432, lng: 77.1892 },
  Shimla: { lat: 31.1048, lng: 77.1734 },
  Munnar: { lat: 10.0889, lng: 77.0595 },
  Ooty: { lat: 11.4102, lng: 76.695 },
  Lonavala: { lat: 18.7557, lng: 73.4091 },
  Mahabaleshwar: { lat: 17.9237, lng: 73.6586 },
  Darjeeling: { lat: 27.041, lng: 88.2663 },
  Kashmir: { lat: 34.0837, lng: 74.7973 },
};

/* ---------------- WEATHER SERVER FUNCTIONS ---------------- */

const weatherCoordsSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const getWeatherForecastFn = createServerFn({ method: "GET" })
  .validator((data: unknown) => weatherCoordsSchema.parse(data))
  .handler(async ({ data }): Promise<WeatherResult> => {
    assertServerFnRateLimit("weather_forecast", 120);
    return await fetchWeatherForecast(data.lat, data.lng);
  });

const destinationWeatherSchema = z.object({
  destinationId: z.string(),
});

export const getDestinationWeatherFn = createServerFn({ method: "GET" })
  .validator((data: unknown) => destinationWeatherSchema.parse(data))
  .handler(
    async ({
      data,
    }): Promise<{
      weather: WeatherResult;
      destinationName: string;
      region: string;
      bestTimeToVisit: string;
    }> => {
      assertServerFnRateLimit("destination_weather", 120);
      const match = destinations.find(
        (d) => d.id.toLowerCase() === data.destinationId.toLowerCase(),
      );
      const lat = match ? match.lat : 28.6139;
      const lng = match ? match.lng : 77.209;
      const weather = await fetchWeatherForecast(lat, lng);

      return {
        weather,
        destinationName: match ? match.name : data.destinationId,
        region: match ? match.region : "India",
        bestTimeToVisit: match
          ? match.bestTimeToVisit
          : "October to March for pleasant temperatures.",
      };
    },
  );

export const getHillStationsWeatherFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<
    Record<
      string,
      {
        temp: string;
        condition: string;
        isLive: boolean;
        fetchedAt: number;
      }
    >
  > => {
    assertServerFnRateLimit("hills_weather", 60);
    const results: Record<
      string,
      { temp: string; condition: string; isLive: boolean; fetchedAt: number }
    > = {};

    await Promise.all(
      Object.entries(HILL_STATION_COORDS).map(async ([name, coords]) => {
        try {
          const forecast = await fetchWeatherForecast(coords.lat, coords.lng);
          results[name] = {
            temp: `${Math.round(forecast.current.temperature)}°C`,
            condition: forecast.current.condition,
            isLive: !forecast.isFallback,
            fetchedAt: forecast.current.fetchedAt,
          };
        } catch {
          results[name] = {
            temp: "14°C",
            condition: "Mainly Clear",
            isLive: false,
            fetchedAt: Date.now(),
          };
        }
      }),
    );

    return results;
  },
);

/* ---------------- CURRENCY SERVER FUNCTIONS ---------------- */

export const getExchangeRatesFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<ExchangeRates> => {
    assertServerFnRateLimit("exchange_rates", 120);
    return await fetchExchangeRates();
  },
);

const convertCurrencySchema = z.object({
  amount: z.number().nonnegative(),
  targetCurrency: z.string(),
});

export const convertCurrencyFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => convertCurrencySchema.parse(data))
  .handler(async ({ data }): Promise<ConversionResult> => {
    assertServerFnRateLimit("currency_convert", 120);
    return await convertCurrency(data.amount, data.targetCurrency);
  });

/* ---------------- PRICE ALERTS SERVER FUNCTIONS ---------------- */

const createPriceAlertSchema = z.object({
  itemType: z.enum(["flight", "stay", "package"]),
  itemId: z.string().min(1),
  title: z.string().min(1),
  targetPrice: z.number().positive(),
  basePrice: z.number().positive(),
});

export const createPriceAlertFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => createPriceAlertSchema.parse(data))
  .handler(async ({ data }): Promise<{ success: boolean; alert: PriceAlertRecord }> => {
    assertServerFnRateLimit("create_price_alert", 30);
    const user = await getServerUser();
    const currentPrice = getFluctuatedPrice(data.basePrice, data.itemId);

    const alertRecord: PriceAlertRecord = {
      id: "alt_" + Math.random().toString(36).slice(2, 9),
      userId: user?.id || "guest",
      itemType: data.itemType,
      itemId: data.itemId,
      title: data.title,
      targetPrice: data.targetPrice,
      basePrice: data.basePrice,
      currentPrice,
      isActive: true,
      createdAt: Date.now(),
    };

    if (user) {
      try {
        const supabase = getSupabaseServerClient();
        if (supabase) {
          const { data: inserted, error } = await supabase
            .from("price_alerts")
            .insert({
              user_id: user.id,
              item_type: data.itemType,
              item_id: data.itemId,
              title: data.title,
              target_price: data.targetPrice,
              base_price: data.basePrice,
              current_price: currentPrice,
              is_active: true,
            })
            .select()
            .single();

          if (!error && inserted) {
            alertRecord.id = String(inserted.id);
          }
        }
      } catch (err) {
        console.warn("Could not persist price alert to Supabase:", err);
      }
    }

    return { success: true, alert: alertRecord };
  });

export const fetchPriceAlertsFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<PriceAlertRecord[]> => {
    assertServerFnRateLimit("fetch_price_alerts", 60);
    const user = await getServerUser();
    if (!user) return [];

    try {
      const supabase = getSupabaseServerClient();
      if (!supabase) return [];

      const { data, error } = await supabase
        .from("price_alerts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error || !data) return [];

      return data.map((r: Record<string, unknown>) => ({
        id: String(r["id"]),
        userId: String(r["user_id"]),
        itemType: (r["item_type"] || "flight") as "flight" | "stay" | "package",
        itemId: String(r["item_id"]),
        title: String(r["title"]),
        targetPrice: Number(r["target_price"]),
        basePrice: Number(r["base_price"]),
        currentPrice: getFluctuatedPrice(Number(r["base_price"]), String(r["item_id"])),
        isActive: Boolean(r["is_active"]),
        createdAt: new Date(String(r["created_at"])).getTime(),
        lastNotifiedAt: r["last_notified_at"]
          ? new Date(String(r["last_notified_at"])).getTime()
          : undefined,
      }));
    } catch (err) {
      console.warn("Error fetching price alerts:", err);
      return [];
    }
  },
);

const deletePriceAlertSchema = z.object({
  alertId: z.string(),
});

export const deletePriceAlertFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => deletePriceAlertSchema.parse(data))
  .handler(async ({ data }): Promise<{ success: boolean }> => {
    assertServerFnRateLimit("delete_price_alert", 30);
    const user = await getServerUser();
    if (user) {
      try {
        const supabase = getSupabaseServerClient();
        if (supabase) {
          await supabase.from("price_alerts").delete().eq("id", data.alertId);
        }
      } catch (err) {
        console.warn("Error deleting price alert from Supabase:", err);
      }
    }
    return { success: true };
  });

export const getDemoFluctuationInfoFn = createServerFn({ method: "GET" })
  .validator((data: unknown) => z.object({ itemId: z.string() }).parse(data))
  .handler(async ({ data }) => {
    assertServerFnRateLimit("fluctuation_info", 120);
    const percent = getDailyFluctuationPercent(data.itemId);
    return {
      itemId: data.itemId,
      fluctuationPercent: percent,
      label: "Demo pricing",
      explanation: `Deterministic daily variation (${percent >= 0 ? `+${percent}` : percent}%) based on catalog simulation.`,
    };
  });
