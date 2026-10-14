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
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
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
      const normalized = await normalizeCatastrophicSsrResponse(rawResponse);
      return applySecurityHeaders(normalized);
    } catch (error) {
      console.error(error);
      const errRes = new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
      return applySecurityHeaders(errRes);
    }
  },
};
