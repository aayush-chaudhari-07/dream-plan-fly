type RateLimitRecord = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitRecord>();

/**
 * In-memory sliding rate limiter per identifier (User ID or IP address).
 * @param key Unique identifier (user ID or client IP)
 * @param limit Maximum requests permitted in the window (default: 20)
 * @param windowMs Time window in milliseconds (default: 10 minutes)
 */
export function checkRateLimit(
  key: string,
  limit = 20,
  windowMs = 10 * 60 * 1000,
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count += 1;
  return { allowed: true, remaining: limit - record.count, resetAt: record.resetAt };
}

/** Reset rate limit store (used in unit tests) */
export function resetRateLimits() {
  rateLimitStore.clear();
}
