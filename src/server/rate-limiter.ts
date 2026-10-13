import type { GeneratedPlan } from "@/lib/trip-plan";

type RateLimitRecord = {
  count: number;
  resetAt: number;
};

type CacheRecord = {
  plan: GeneratedPlan;
  timestamp: number;
};

// Rate limiter store for short-term bursts (e.g., 20 requests per 10 min)
const rateLimitStore = new Map<string, RateLimitRecord>();

// Daily quotas store (User: 15/day, Guest IP: 5/day)
const dailyQuotaStore = new Map<string, RateLimitRecord>();

// Server-side Plan Cache (same prompt & parameters -> cached plan)
const planCacheStore = new Map<string, CacheRecord>();
const PLAN_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// Global Daily API Call Counter (Gemini Flash free tier provides 1,500 RPD)
// We set a conservative threshold of 1,000 to keep 500 requests as safety buffer.
const GLOBAL_DAILY_LIMIT = 1000;
let globalDailyCounter = {
  count: 0,
  dayString: new Date().toISOString().slice(0, 10), // YYYY-MM-DD in UTC
};

// Circuit Breaker for HTTP 429 errors (temporary backoff)
let circuitBreakerUntil = 0;

/**
 * Reset all stores (used in unit tests).
 */
export function resetRateLimits() {
  rateLimitStore.clear();
  dailyQuotaStore.clear();
  planCacheStore.clear();
  globalDailyCounter = {
    count: 0,
    dayString: new Date().toISOString().slice(0, 10),
  };
  circuitBreakerUntil = 0;
}

/**
 * In-memory sliding rate limiter per identifier for short bursts.
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

// ==============================================================================
// 1. SERVER-SIDE PLAN CACHING
// ==============================================================================

/**
 * Generate a deterministic cache key from trip prompt and parameters.
 */
export function generatePlanCacheKey(input: {
  prompt: string;
  destination?: string | undefined;
  interests?: string[] | undefined;
  budget?: number | undefined;
  travelers?: number | undefined;
  days?: number | undefined;
  instruction?: string | undefined;
}): string {
  const promptNorm = input.prompt.trim().toLowerCase().replace(/\s+/g, " ");
  const dest = (input.destination || "").trim().toLowerCase();
  const budget = input.budget || 0;
  const days = input.days || 0;
  const travelers = input.travelers || 0;
  const interests = (input.interests || []).slice().sort().join(",");
  const instruction = (input.instruction || "").trim().toLowerCase();
  return `${promptNorm}::${dest}::${budget}::${days}::${travelers}::${interests}::${instruction}`;
}

/**
 * Retrieve a cached plan if exists and not expired.
 */
export function getCachedPlan(cacheKey: string): GeneratedPlan | null {
  const record = planCacheStore.get(cacheKey);
  if (!record) return null;

  if (Date.now() - record.timestamp > PLAN_CACHE_TTL_MS) {
    planCacheStore.delete(cacheKey);
    return null;
  }

  return record.plan;
}

/**
 * Store a plan in the server-side memory cache.
 */
export function setCachedPlan(cacheKey: string, plan: GeneratedPlan): void {
  // Cap cache size to avoid unbounded memory growth
  if (planCacheStore.size > 2000) {
    const oldestKey = planCacheStore.keys().next().value;
    if (oldestKey) planCacheStore.delete(oldestKey);
  }

  planCacheStore.set(cacheKey, {
    plan,
    timestamp: Date.now(),
  });
}

// ==============================================================================
// 2. DAILY QUOTA LIMITS (User: 15/day, Guest: 5/day)
// ==============================================================================

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
export const USER_DAILY_LIMIT = 15;
export const GUEST_DAILY_LIMIT = 5;

/**
 * Check if user or guest IP has exceeded their daily generation allowance.
 */
export function checkDailyQuota(
  identifier: string,
  isGuest: boolean,
): { allowed: boolean; remaining: number; limit: number; resetAt: number } {
  const now = Date.now();
  const limit = isGuest ? GUEST_DAILY_LIMIT : USER_DAILY_LIMIT;
  const record = dailyQuotaStore.get(identifier);

  if (!record || now > record.resetAt) {
    return { allowed: true, remaining: limit, limit, resetAt: now + ONE_DAY_MS };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0, limit, resetAt: record.resetAt };
  }

  return { allowed: true, remaining: limit - record.count, limit, resetAt: record.resetAt };
}

/**
 * Increment daily usage for a user or guest.
 */
export function incrementDailyQuota(identifier: string): void {
  const now = Date.now();
  const record = dailyQuotaStore.get(identifier);

  if (!record || now > record.resetAt) {
    dailyQuotaStore.set(identifier, { count: 1, resetAt: now + ONE_DAY_MS });
  } else {
    record.count += 1;
  }
}

// ==============================================================================
// 3. GLOBAL DAILY COUNTER (Protects Google Gemini Free Tier 1,500 RPD)
// ==============================================================================

function syncGlobalDailyDay() {
  const currentUtcDay = new Date().toISOString().slice(0, 10);
  if (globalDailyCounter.dayString !== currentUtcDay) {
    globalDailyCounter.dayString = currentUtcDay;
    globalDailyCounter.count = 0;
  }
}

/**
 * Returns whether the global daily Gemini API quota is approaching the free tier ceiling.
 */
export function isGlobalDailyQuotaNear(): boolean {
  syncGlobalDailyDay();
  return globalDailyCounter.count >= GLOBAL_DAILY_LIMIT;
}

/**
 * Increment global API calls counter.
 */
export function incrementGlobalDailyCount(): void {
  syncGlobalDailyDay();
  globalDailyCounter.count += 1;
}

/**
 * Get current global count for today.
 */
export function getGlobalDailyCount(): { count: number; limit: number; day: string } {
  syncGlobalDailyDay();
  return {
    count: globalDailyCounter.count,
    limit: GLOBAL_DAILY_LIMIT,
    day: globalDailyCounter.dayString,
  };
}

// ==============================================================================
// 4. CIRCUIT BREAKER FOR HTTP 429
// ==============================================================================

/**
 * Trip the circuit breaker for a duration (default 60 seconds).
 */
export function tripCircuitBreaker(durationMs = 60_000): void {
  circuitBreakerUntil = Date.now() + durationMs;
}

/**
 * Check if the circuit breaker is currently active.
 */
export function isCircuitBreakerActive(): boolean {
  return Date.now() < circuitBreakerUntil;
}
