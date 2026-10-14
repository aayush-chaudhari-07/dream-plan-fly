/**
 * Deterministic Price Fluctuation & Price Alert Evaluation Engine
 * Applies small deterministic daily variations to seeded catalog fares (labeled "Demo pricing").
 * Dispatches notifications when watched routes or destinations drop below a user's target price.
 */

import { getSupabaseServerClient } from "@/server/db/supabase-server";

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
  status: "ok" | "degraded" | "error";
  checkedCount: number;
  alertsTriggered: number;
  failedCount: number;
  triggeredAlerts: Array<{
    alertId: string;
    title: string;
    targetPrice: number;
    currentPrice: number;
    savings: number;
  }>;
  failedAlerts: Array<{
    alertId: string;
    error: string;
  }>;
  durationMs: number;
  timestamp: string;
  message: string;
};

/**
 * Pure evaluation function: determines whether an alert threshold is met.
 */
export function evaluateAlertThreshold(
  alert: PriceAlertRecord,
  currentPrice: number,
): {
  shouldTrigger: boolean;
  savings: number;
} {
  const shouldTrigger = alert.isActive && currentPrice <= alert.targetPrice;
  const savings = Math.max(0, alert.basePrice - currentPrice);
  return { shouldTrigger, savings };
}

/**
 * Bounds any asynchronous operation with a timeout promise.
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  operationName: string,
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`Operation timed out after ${ms}ms: ${operationName}`));
    }, ms);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export type PriceAlertDependencies = {
  priceSource?: (basePrice: number, itemId: string, dateStr: string) => number | Promise<number>;
  notify?: (alert: PriceAlertRecord, currentPrice: number, savings: number) => Promise<void>;
  updateAlert?: (alertId: string, currentPrice: number, notifiedAt: string) => Promise<void>;
  fetchAlerts?: () => Promise<PriceAlertRecord[]>;
  now?: () => Date;
  logger?: {
    warn: (msg: string, ...args: unknown[]) => void;
    error: (msg: string, ...args: unknown[]) => void;
    info?: (msg: string, ...args: unknown[]) => void;
  };
  timeoutMs?: number;
};

function isRealSupabaseConfigured(): boolean {
  if (typeof process === "undefined" || !process.env) return false;
  const url = process.env["VITE_SUPABASE_URL"] || process.env["SUPABASE_URL"];
  return Boolean(
    url &&
    !url.includes("placeholder") &&
    !url.includes("your-project-ref") &&
    !url.includes("example.com"),
  );
}

/**
 * Evaluates active price alerts against today's fluctuated prices
 * and triggers notifications for drops below the target.
 *
 * Supports dependency injection for deterministic, offline testing.
 * External calls are bounded by timeouts, and per-alert failures are isolated.
 */
export async function evaluatePriceAlertsJob(
  customAlerts?: PriceAlertRecord[],
  deps?: PriceAlertDependencies,
): Promise<CronJobResult> {
  const start = Date.now();
  const timeoutMs = deps?.timeoutMs ?? 2500;
  const today = (deps?.now ? deps.now() : new Date()).toISOString().slice(0, 10);
  const logger = deps?.logger ?? console;

  const triggered: CronJobResult["triggeredAlerts"] = [];
  const failed: CronJobResult["failedAlerts"] = [];

  let alerts: PriceAlertRecord[] = [];

  if (customAlerts) {
    alerts = customAlerts;
  } else if (deps?.fetchAlerts) {
    try {
      alerts = await withTimeout(deps.fetchAlerts(), timeoutMs, "fetchAlerts");
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      logger.error("Failed to fetch price alerts via injected dependency:", errMsg);
      return {
        status: "error",
        checkedCount: 0,
        alertsTriggered: 0,
        failedCount: 1,
        triggeredAlerts: [],
        failedAlerts: [{ alertId: "fetchAlerts", error: errMsg }],
        durationMs: Date.now() - start,
        timestamp: new Date().toISOString(),
        message: `Failed to fetch alerts: ${errMsg}`,
      };
    }
  } else {
    // Read from Supabase if configured with real project
    try {
      if (isRealSupabaseConfigured()) {
        alerts = await withTimeout(
          (async () => {
            const supabase = getSupabaseServerClient();
            if (!supabase) return [];
            const { data, error } = await supabase
              .from("price_alerts")
              .select("*")
              .eq("is_active", true);

            if (error || !data) return [];
            return data.map((row: Record<string, unknown>) => ({
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
          })(),
          timeoutMs,
          "fetchAlertsFromSupabase",
        );
      }
    } catch (err) {
      logger.warn("Could not query price_alerts table from Supabase (using mock/in-memory):", err);
    }
  }

  // Process alerts with isolation: one failing alert does not stop the rest
  for (const alert of alerts) {
    try {
      const todayPrice = await withTimeout(
        Promise.resolve(
          deps?.priceSource
            ? deps.priceSource(alert.basePrice, alert.itemId, today)
            : getFluctuatedPrice(alert.basePrice, alert.itemId, today),
        ),
        timeoutMs,
        `priceLookup:${alert.id}`,
      );

      const { shouldTrigger, savings } = evaluateAlertThreshold(alert, todayPrice);

      if (shouldTrigger) {
        triggered.push({
          alertId: alert.id,
          title: alert.title,
          targetPrice: alert.targetPrice,
          currentPrice: todayPrice,
          savings,
        });

        // Dispatch notification
        if (deps?.notify) {
          await withTimeout(
            deps.notify(alert, todayPrice, savings),
            timeoutMs,
            `notify:${alert.id}`,
          );
        } else if (isRealSupabaseConfigured() && alert.userId) {
          await withTimeout(
            (async () => {
              const supabase = getSupabaseServerClient();
              if (supabase) {
                await supabase.from("notifications").insert({
                  user_id: alert.userId,
                  title: "📉 Price Drop Alert!",
                  message: `${alert.title} dropped to ₹${todayPrice.toLocaleString("en-IN")} (target was ₹${alert.targetPrice.toLocaleString("en-IN")}, saved ₹${savings.toLocaleString("en-IN")}). Demo pricing active.`,
                  type: "price_drop",
                  link: alert.itemType === "flight" ? "/bookings?tab=flights" : "/explore",
                });
              }
            })(),
            timeoutMs,
            `supabaseNotify:${alert.id}`,
          );
        }

        // Update alert record
        if (deps?.updateAlert) {
          await withTimeout(
            deps.updateAlert(alert.id, todayPrice, new Date().toISOString()),
            timeoutMs,
            `updateAlert:${alert.id}`,
          );
        } else if (isRealSupabaseConfigured() && alert.userId) {
          await withTimeout(
            (async () => {
              const supabase = getSupabaseServerClient();
              if (supabase) {
                await supabase
                  .from("price_alerts")
                  .update({
                    current_price: todayPrice,
                    last_checked_at: new Date().toISOString(),
                    last_notified_at: new Date().toISOString(),
                  })
                  .eq("id", alert.id);
              }
            })(),
            timeoutMs,
            `supabaseUpdateAlert:${alert.id}`,
          );
        }
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      logger.warn(`Handled error evaluating price alert ${alert.id}:`, errMsg);
      failed.push({
        alertId: alert.id,
        error: errMsg,
      });
    }
  }

  const status: "ok" | "degraded" | "error" =
    failed.length === 0
      ? "ok"
      : failed.length === alerts.length && alerts.length > 0
        ? "error"
        : "degraded";

  return {
    status,
    checkedCount: alerts.length,
    alertsTriggered: triggered.length,
    failedCount: failed.length,
    triggeredAlerts: triggered,
    failedAlerts: failed,
    durationMs: Date.now() - start,
    timestamp: new Date().toISOString(),
    message: `Price fluctuation evaluation finished. Evaluated ${alerts.length} alerts; triggered ${triggered.length}; failed ${failed.length}.`,
  };
}

/**
 * HTTP endpoint handler for GitHub Actions protected cron
 */
export async function handlePriceFluctuationsCron(
  request: Request,
  deps?: PriceAlertDependencies,
): Promise<Response> {
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
    const result = await evaluatePriceAlertsJob(undefined, deps);
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
