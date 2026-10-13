/**
 * Deterministic Price Fluctuation & Price Alert Evaluation Engine
 * Applies small deterministic daily variations to seeded catalog fares (labeled "Demo pricing").
 * Dispatches notifications when watched routes or destinations drop below a user's target price.
 */

import { getSupabaseServerClient } from "@/lib/supabase/server";

export type PriceAlertRecord = {
  id: string;
  userId: string;
  itemType: "flight" | "stay" | "package";
  itemId: string; // e.g. "DEL-GOI" or "goa"
  title: string;
  targetPrice: number;
  basePrice: number;
  currentPrice: number;
  isActive: boolean;
  createdAt: number;
  lastNotifiedAt?: number | undefined;
};

/**
 * Calculates a deterministic daily percentage fluctuation for any item ID.
 * Returns an integer between -12% and +8%.
 */
export function getDailyFluctuationPercent(itemId: string, dateStr?: string): number {
  const d = dateStr || new Date().toISOString().slice(0, 10);
  let hash = 0;
  const str = `${itemId.toLowerCase().trim()}_${d}_smarttrip_demo_pricing`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  // Generates integer between -12% and +8%
  return (Math.abs(hash) % 21) - 12;
}

/**
 * Returns the current fluctuated price based on the daily seed variation.
 */
export function getFluctuatedPrice(basePrice: number, itemId: string, dateStr?: string): number {
  const percent = getDailyFluctuationPercent(itemId, dateStr);
  const fluctuated = Math.round(basePrice * (1 + percent / 100));
  return Math.max(100, fluctuated);
}

export type CronJobResult = {
  status: "ok" | "error";
  checkedCount: number;
  alertsTriggered: number;
  triggeredAlerts: Array<{
    alertId: string;
    title: string;
    targetPrice: number;
    currentPrice: number;
    savings: number;
  }>;
  durationMs: number;
  timestamp: string;
  message: string;
};

/**
 * Evaluates active price alerts against today's fluctuated prices
 * and triggers notifications for drops below the target.
 */
export async function evaluatePriceAlertsJob(
  customAlerts?: PriceAlertRecord[],
): Promise<CronJobResult> {
  const start = Date.now();
  const today = new Date().toISOString().slice(0, 10);
  const triggered: CronJobResult["triggeredAlerts"] = [];

  let alerts: PriceAlertRecord[] = [];

  if (customAlerts) {
    alerts = customAlerts;
  } else {
    // Read from Supabase if configured with real project
    try {
      const url =
        typeof process !== "undefined"
          ? process.env?.["VITE_SUPABASE_URL"] || process.env?.["SUPABASE_URL"]
          : undefined;
      const hasRealSupabase = url && !url.includes("placeholder");

      if (hasRealSupabase) {
        const supabase = getSupabaseServerClient();
        if (supabase) {
          const { data, error } = await supabase
            .from("price_alerts")
            .select("*")
            .eq("is_active", true);

          if (!error && data) {
            alerts = data.map((row: Record<string, unknown>) => ({
              id: String(row["id"]),
              userId: String(row["user_id"]),
              itemType: (row["item_type"] || "flight") as "flight" | "stay" | "package",
              itemId: String(row["item_id"]),
              title: String(row["title"]),
              targetPrice: Number(row["target_price"]),
              basePrice: Number(row["base_price"]),
              currentPrice: Number(row["current_price"]),
              isActive: Boolean(row["is_active"]),
              createdAt: new Date(String(row["created_at"])).getTime(),
              lastNotifiedAt: row["last_notified_at"]
                ? new Date(String(row["last_notified_at"])).getTime()
                : undefined,
            }));
          }
        }
      }
    } catch (err) {
      console.warn("Could not query price_alerts table from Supabase (using mock/in-memory):", err);
    }
  }

  for (const alert of alerts) {
    const todayPrice = getFluctuatedPrice(alert.basePrice, alert.itemId, today);

    // If price dropped to or below target price
    if (todayPrice <= alert.targetPrice) {
      const savings = alert.basePrice - todayPrice;
      triggered.push({
        alertId: alert.id,
        title: alert.title,
        targetPrice: alert.targetPrice,
        currentPrice: todayPrice,
        savings,
      });

      // Insert notification in Supabase if user is connected
      try {
        const supabase = getSupabaseServerClient();
        if (supabase && alert.userId) {
          await supabase.from("notifications").insert({
            user_id: alert.userId,
            title: "📉 Price Drop Alert!",
            message: `${alert.title} dropped to ₹${todayPrice.toLocaleString("en-IN")} (target was ₹${alert.targetPrice.toLocaleString("en-IN")}, saved ₹${savings.toLocaleString("en-IN")}). Demo pricing active.`,
            type: "price_drop",
            link: alert.itemType === "flight" ? "/bookings?tab=flights" : "/explore",
          });

          await supabase
            .from("price_alerts")
            .update({
              current_price: todayPrice,
              last_checked_at: new Date().toISOString(),
              last_notified_at: new Date().toISOString(),
            })
            .eq("id", alert.id);
        }
      } catch (err) {
        console.warn(`Could not dispatch notification for alert ${alert.id}:`, err);
      }
    }
  }

  return {
    status: "ok",
    checkedCount: alerts.length,
    alertsTriggered: triggered.length,
    triggeredAlerts: triggered,
    durationMs: Date.now() - start,
    timestamp: new Date().toISOString(),
    message: `Price fluctuation evaluation finished. Evaluated ${alerts.length} alerts; triggered ${triggered.length} price drop notifications.`,
  };
}

/**
 * HTTP endpoint handler for GitHub Actions protected cron
 */
export async function handlePriceFluctuationsCron(request: Request): Promise<Response> {
  const secretEnv =
    (typeof process !== "undefined" ? process.env?.["CRON_SECRET"] : undefined) ||
    "smarttrip-demo-cron-secret";

  const headerSecret =
    request.headers.get("x-cron-secret") ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!headerSecret || headerSecret !== secretEnv) {
    return new Response(
      JSON.stringify({
        error: "Unauthorized",
        message:
          "Invalid or missing cron secret. Provide header x-cron-secret or Authorization: Bearer <secret>.",
      }),
      {
        status: 401,
        headers: { "content-type": "application/json" },
      },
    );
  }

  try {
    const result = await evaluatePriceAlertsJob();
    return new Response(JSON.stringify(result, null, 2), {
      status: 200,
      headers: {
        "content-type": "application/json",
        "cache-control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Error",
        message:
          error instanceof Error
            ? error.message
            : "Price alert job encountered an unexpected error",
      }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      },
    );
  }
}
