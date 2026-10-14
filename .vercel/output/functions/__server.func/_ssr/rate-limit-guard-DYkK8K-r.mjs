import { c as getRequestIP, s as getRequestHeader } from "./internal-request-response-CURC4f5o.mjs";
import { n as checkRateLimit } from "./rate-limiter-IgkJH91V.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rate-limit-guard-DYkK8K-r.js
/**
* Server Function Rate Limit Guard
* Provides lightweight in-memory sliding-window rate limiting for all server actions.
* Protects server resources without external Redis or paid services.
*/
function assertServerFnRateLimit(endpoint, maxRequests = 60, windowMs = 6e4) {
	let clientIdentifier = "127.0.0.1";
	try {
		const rawIp = getRequestIP() || getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() || getRequestHeader("x-real-ip");
		if (rawIp) clientIdentifier = rawIp;
	} catch {
		clientIdentifier = "direct-call";
	}
	const rateKey = `fn:${endpoint}:${clientIdentifier}`;
	const rateResult = checkRateLimit(rateKey, maxRequests, windowMs);
	if (!rateResult.allowed) {
		const waitSeconds = Math.max(1, Math.ceil((rateResult.resetAt - Date.now()) / 1e3));
		throw new Error(`Too many requests to ${endpoint}. Rate limit of ${maxRequests} requests per minute exceeded. Please retry in ${waitSeconds}s.`);
	}
}
//#endregion
export { assertServerFnRateLimit as t };
