import { a as TSS_SERVER_FUNCTION } from "./createServerFn-BPR289oA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rate-limiter-IgkJH91V.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var rateLimitStore = /* @__PURE__ */ new Map();
var dailyQuotaStore = /* @__PURE__ */ new Map();
var planCacheStore = /* @__PURE__ */ new Map();
var PLAN_CACHE_TTL_MS = 864e5;
var GLOBAL_DAILY_LIMIT = 1e3;
var globalDailyCounter = {
	count: 0,
	dayString: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
};
var circuitBreakerUntil = 0;
/**
* In-memory sliding rate limiter per identifier for short bursts.
*/
function checkRateLimit(key, limit = 20, windowMs = 6e5) {
	const now = Date.now();
	const record = rateLimitStore.get(key);
	if (!record || now > record.resetAt) {
		rateLimitStore.set(key, {
			count: 1,
			resetAt: now + windowMs
		});
		return {
			allowed: true,
			remaining: limit - 1,
			resetAt: now + windowMs
		};
	}
	if (record.count >= limit) return {
		allowed: false,
		remaining: 0,
		resetAt: record.resetAt
	};
	record.count += 1;
	return {
		allowed: true,
		remaining: limit - record.count,
		resetAt: record.resetAt
	};
}
/**
* Generate a deterministic cache key from trip prompt and parameters.
*/
function generatePlanCacheKey(input) {
	return `${input.prompt.trim().toLowerCase().replace(/\s+/g, " ")}::${(input.destination || "").trim().toLowerCase()}::${input.budget || 0}::${input.days || 0}::${input.travelers || 0}::${(input.interests || []).slice().sort().join(",")}::${(input.instruction || "").trim().toLowerCase()}`;
}
/**
* Retrieve a cached plan if exists and not expired.
*/
function getCachedPlan(cacheKey) {
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
function setCachedPlan(cacheKey, plan) {
	if (planCacheStore.size > 2e3) {
		const oldestKey = planCacheStore.keys().next().value;
		if (oldestKey) planCacheStore.delete(oldestKey);
	}
	planCacheStore.set(cacheKey, {
		plan,
		timestamp: Date.now()
	});
}
var ONE_DAY_MS = 864e5;
/**
* Check if user or guest IP has exceeded their daily generation allowance.
*/
function checkDailyQuota(identifier, isGuest) {
	const now = Date.now();
	const limit = isGuest ? 5 : 15;
	const record = dailyQuotaStore.get(identifier);
	if (!record || now > record.resetAt) return {
		allowed: true,
		remaining: limit,
		limit,
		resetAt: now + ONE_DAY_MS
	};
	if (record.count >= limit) return {
		allowed: false,
		remaining: 0,
		limit,
		resetAt: record.resetAt
	};
	return {
		allowed: true,
		remaining: limit - record.count,
		limit,
		resetAt: record.resetAt
	};
}
/**
* Increment daily usage for a user or guest.
*/
function incrementDailyQuota(identifier) {
	const now = Date.now();
	const record = dailyQuotaStore.get(identifier);
	if (!record || now > record.resetAt) dailyQuotaStore.set(identifier, {
		count: 1,
		resetAt: now + ONE_DAY_MS
	});
	else record.count += 1;
}
function syncGlobalDailyDay() {
	const currentUtcDay = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	if (globalDailyCounter.dayString !== currentUtcDay) {
		globalDailyCounter.dayString = currentUtcDay;
		globalDailyCounter.count = 0;
	}
}
/**
* Returns whether the global daily Gemini API quota is approaching the free tier ceiling.
*/
function isGlobalDailyQuotaNear() {
	syncGlobalDailyDay();
	return globalDailyCounter.count >= GLOBAL_DAILY_LIMIT;
}
/**
* Increment global API calls counter.
*/
function incrementGlobalDailyCount() {
	syncGlobalDailyDay();
	globalDailyCounter.count += 1;
}
/**
* Trip the circuit breaker for a duration (default 60 seconds).
*/
function tripCircuitBreaker(durationMs = 6e4) {
	circuitBreakerUntil = Date.now() + durationMs;
}
/**
* Check if the circuit breaker is currently active.
*/
function isCircuitBreakerActive() {
	return Date.now() < circuitBreakerUntil;
}
//#endregion
export { getCachedPlan as a, isCircuitBreakerActive as c, tripCircuitBreaker as d, generatePlanCacheKey as i, isGlobalDailyQuotaNear as l, checkRateLimit as n, incrementDailyQuota as o, createServerRpc as r, incrementGlobalDailyCount as s, checkDailyQuota as t, setCachedPlan as u };
