/**
 * Application error reporting utility.
 * Logs errors in development and acts as a free monitoring integration
 * that stores telemetry in the Supabase `error_logs` table.
 */

import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/client/lib/supabase/client";

export interface ErrorReportContext {
  boundary?: string | undefined;
  url?: string | undefined;
  userId?: string | undefined;
  extra?: Record<string, unknown> | undefined;
  [key: string]: unknown;
}

export function reportError(error: unknown, context: ErrorReportContext = {}): void {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;
  const currentUrl =
    typeof window !== "undefined"
      ? window.location.href
      : typeof context.url === "string"
        ? context.url
        : undefined;
  const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : undefined;

  // Always log to console for debugging
  console.error("[SmartTrip Error]", {
    message: errorMessage,
    stack: errorStack,
    context,
  });

  // Skip if Supabase is not configured or in placeholder mode
  if (!isSupabaseConfigured()) {
    return;
  }

  // Asynchronously insert error log without blocking execution
  Promise.resolve().then(async () => {
    try {
      const client = getSupabaseBrowserClient();
      await client.from("error_logs").insert({
        message: errorMessage,
        stack: errorStack || null,
        url: currentUrl || null,
        user_agent: userAgent || null,
        boundary: context.boundary || "unknown",
        metadata: context,
      });
    } catch {
      // Silently swallow error reporting failures so we never crash the UI
    }
  });
}
