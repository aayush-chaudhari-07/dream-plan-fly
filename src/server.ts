import "@/client/lib/error-capture";

import { consumeLastCapturedError } from "@/client/lib/error-capture";
import { renderErrorPage } from "@/client/lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"error":true,"status":500,"unhandled":true} or {"unhandled":true,"message":"HTTPError"}.
// For browser requests, normalize to the app's styled error page. For API requests, return JSON.
async function normalizeCatastrophicSsrResponse(
  response: Response,
  request?: Request,
): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  const url = request ? new URL(request.url) : null;
  const pathname = url?.pathname ?? "/";
  const accept = request?.headers.get("accept") ?? "";
  const isApi =
    pathname.startsWith("/api/") ||
    pathname.includes("/_serverFn/") ||
    (accept.includes("application/json") && !accept.includes("text/html"));

  const lastErr = consumeLastCapturedError();
  const lastErrorObj = lastErr instanceof Error ? lastErr : null;
  const lastErrorMsg =
    lastErrorObj?.message ?? (typeof lastErr === "string" ? lastErr : undefined);
  const isAborted =
    lastErrorMsg === "aborted" ||
    (lastErr as { code?: string })?.code === "ECONNRESET" ||
    (lastErr as { name?: string })?.name === "AbortError";

  if (!isAborted) {
    console.error(
      `[Server SSR Error] ${request?.method ?? "GET"} ${pathname}:`,
      lastErrorObj?.stack ?? lastErrorMsg ?? `Nitro SSR unhandled error: ${body}`,
    );
  }

  if (isApi) {
    return new Response(
      JSON.stringify({
        error: true,
        status: 500,
        message: "Internal Server Error",
      }),
      {
        status: 500,
        headers: { "content-type": "application/json; charset=utf-8" },
      },
    );
  }

  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as {
      unhandled?: unknown;
      message?: unknown;
      status?: unknown;
      error?: unknown;
    };
    return Boolean(
      payload.unhandled === true ||
      payload.status === 500 ||
      payload.message === "HTTPError" ||
      payload.error === true,
    );
  } catch {
    return false;
  }
}

async function handleKeepAlive(): Promise<Response> {
  const started = Date.now();
  let dbStatus = "skipped (no config)";

  const supabaseUrl =
    (typeof process !== "undefined"
      ? process.env?.["VITE_SUPABASE_URL"] || process.env?.["SUPABASE_URL"]
      : undefined) || "";
  const supabaseKey =
    (typeof process !== "undefined"
      ? process.env?.["VITE_SUPABASE_ANON_KEY"] || process.env?.["SUPABASE_ANON_KEY"]
      : undefined) || "";

  if (supabaseUrl && supabaseKey) {
    try {
      // Lightweight single row query to Supabase PostgREST endpoint
      // This resets the 7-day inactivity pause counter without loading any data.
      const res = await fetch(`${supabaseUrl}/rest/v1/profiles?select=id&limit=1`, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      });
      dbStatus = res.ok ? "healthy" : `warn (HTTP ${res.status})`;
    } catch (err: unknown) {
      dbStatus = `error (${err instanceof Error ? err.message : "connection failed"})`;
    }
  }

  const payload = {
    status: "ok",
    service: "smarttrip-keep-alive",
    supabase: dbStatus,
    timestamp: new Date().toISOString(),
    durationMs: Date.now() - started,
    message: "SmartTrip keep-alive ping successful. Free-tier inactivity pause timer reset.",
  };

  return new Response(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store, no-cache, must-revalidate",
    },
  });
}

async function handleHealthCheck(): Promise<Response> {
  const isProd =
    (typeof process !== "undefined" ? process.env?.["NODE_ENV"] : undefined) === "production";

  // Check which variables are missing by NAME only (never secret values)
  const expectedPublicVars = ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"] as const;
  const expectedServerVars = ["GEMINI_API_KEY", "CRON_SECRET"] as const;

  const missingVariables: string[] = [];
  if (typeof process !== "undefined" && process.env) {
    for (const v of expectedPublicVars) {
      const val = process.env[v];
      if (!val || val.trim() === "" || val.includes("placeholder")) {
        missingVariables.push(v);
      }
    }
    for (const v of expectedServerVars) {
      const val = process.env[v];
      if (!val || val.trim() === "" || val.includes("placeholder")) {
        missingVariables.push(v);
      }
    }
  }

  const payload: Record<string, unknown> = {
    ok: true,
    status: missingVariables.includes("VITE_SUPABASE_URL") ? "degraded" : "healthy",
    timestamp: new Date().toISOString(),
  };

  if (!isProd) {
    payload["missingVariables"] = missingVariables;
    payload["environment"] = process.env?.["NODE_ENV"] || "development";
  }

  return new Response(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store, no-cache, must-revalidate",
    },
  });
}

function applySecurityHeaders(res: Response): Response {
  const headers = new Headers(res.headers);
  headers.set("X-Frame-Options", "DENY");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(self)");
  headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");

  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https://images.unsplash.com https://*.tile.openstreetmap.org https://tile.openstreetmap.org https://unpkg.com",
    "connect-src 'self' https://*.supabase.co https://api.open-meteo.com https://api.frankfurter.app https://generativelanguage.googleapis.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");

  if (!headers.has("Content-Security-Policy")) {
    headers.set("Content-Security-Policy", csp);
  }

  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
}

import { handlePriceFluctuationsCron } from "@/server/services/price-fluctuations";

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      if (url.pathname === "/robots.txt") {
        return new Response(
          `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /settings\nDisallow: /checkout\nDisallow: /booking-confirmation/\nDisallow: /my-trips\n\nSitemap: https://dream-plan-fly.vercel.app/sitemap.xml`,
          {
            headers: {
              "content-type": "text/plain; charset=utf-8",
              "cache-control": "public, max-age=86400",
            },
          },
        );
      }

      if (url.pathname === "/api/health") {
        return applySecurityHeaders(await handleHealthCheck());
      }

      if (url.pathname === "/api/keep-alive") {
        return applySecurityHeaders(await handleKeepAlive());
      }

      if (
        url.pathname === "/api/cron/price-fluctuations" ||
        url.pathname === "/api/cron/daily-price-alerts"
      ) {
        return applySecurityHeaders(await handlePriceFluctuationsCron(request));
      }

      const handler = await getServerEntry();
      const rawResponse = await handler.fetch(request, env, ctx);
      const normalized = await normalizeCatastrophicSsrResponse(rawResponse, request);
      return applySecurityHeaders(normalized);
    } catch (error) {
      const url = new URL(request.url);
      const accept = request.headers.get("accept") ?? "";
      const isApi =
        url.pathname.startsWith("/api/") ||
        url.pathname.includes("/_serverFn/") ||
        (accept.includes("application/json") && !accept.includes("text/html"));

      console.error(
        `[Server Error] ${request.method} ${url.pathname}:`,
        error instanceof Error ? (error.stack ?? error.message) : error,
      );

      if (isApi) {
        const errJson = new Response(
          JSON.stringify({
            error: true,
            status: 500,
            message: "Internal Server Error",
          }),
          {
            status: 500,
            headers: { "content-type": "application/json; charset=utf-8" },
          },
        );
        return applySecurityHeaders(errJson);
      }

      const errRes = new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
      return applySecurityHeaders(errRes);
    }
  },
};
