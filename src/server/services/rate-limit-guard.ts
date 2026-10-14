/**
 * Server Function Rate Limit Guard
 * Provides lightweight in-memory sliding-window rate limiting for all server actions.
 * Protects server resources without external Redis or paid services.
 */

import { getRequestHeader, getRequestIP } from "@tanstack/react-start/server";
import { checkRateLimit } from "@/server/services/rate-limiter";

export function assertServerFnRateLimit(
  endpoint: string,
  maxRequests = 60,
  windowMs = 60_000,
): void {
  let clientIdentifier = "127.0.0.1";
  try {
    const rawIp =
      getRequestIP() ||
      getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() ||
      getRequestHeader("x-real-ip");
    if (rawIp) {
      clientIdentifier = rawIp;
    }
  } catch {
    // In unit testing or SSR without incoming request context
    clientIdentifier = "direct-call";
  }

  const rateKey = `fn:${endpoint}:${clientIdentifier}`;
  const rateResult = checkRateLimit(rateKey, maxRequests, windowMs);

  if (!rateResult.allowed) {
    const waitSeconds = Math.max(1, Math.ceil((rateResult.resetAt - Date.now()) / 1000));
    throw new Error(
      `Too many requests to ${endpoint}. Rate limit of ${maxRequests} requests per minute exceeded. Please retry in ${waitSeconds}s.`,
    );
  }
}
