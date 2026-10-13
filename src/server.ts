import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

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

import { handlePriceFluctuationsCron } from "./server/price-fluctuations";

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      if (url.pathname === "/api/keep-alive") {
        return await handleKeepAlive();
      }

      if (
        url.pathname === "/api/cron/price-fluctuations" ||
        url.pathname === "/api/cron/daily-price-alerts"
      ) {
        return await handlePriceFluctuationsCron(request);
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
