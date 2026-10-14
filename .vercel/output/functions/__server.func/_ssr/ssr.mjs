import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { i as getCookies } from "./internal-request-response-CURC4f5o.mjs";
//#region node_modules/.nitro/vite/services/ssr/index.js
var lastCapturedError;
var TTL_MS = 5e3;
function record(error) {
	lastCapturedError = {
		error,
		at: Date.now()
	};
}
var CAUSE_DEPTH_LIMIT = 5;
var DESCRIPTION_LENGTH_LIMIT = 8e3;
function describeError(error) {
	const parts = [];
	let current = error;
	for (let depth = 0; depth < CAUSE_DEPTH_LIMIT && current != null; depth++) {
		if (!(current instanceof Error)) {
			parts.push(typeof current === "string" ? current : safeStringify(current));
			break;
		}
		const label = depth === 0 ? "" : "caused by: ";
		const status = describeStatus(current);
		parts.push(`${label}${current.stack ?? `${current.name}: ${current.message}`}${status}`);
		current = current.cause;
	}
	return parts.join("\n").slice(0, DESCRIPTION_LENGTH_LIMIT);
}
function describeStatus(error) {
	const { status, statusCode } = error;
	const value = status ?? statusCode;
	return typeof value === "number" ? ` (status ${value})` : "";
}
function safeStringify(value) {
	try {
		return JSON.stringify(value) ?? String(value);
	} catch {
		return String(value);
	}
}
function isErrorLike(value) {
	return value instanceof Error;
}
var originalConsoleError = console.error.bind(console);
console.error = (...args) => {
	originalConsoleError(...args.map((arg) => {
		if (!isErrorLike(arg)) return arg;
		record(arg);
		return describeError(arg);
	}));
};
if (typeof globalThis.addEventListener === "function") {
	globalThis.addEventListener("error", (event) => record(event.error ?? event));
	globalThis.addEventListener("unhandledrejection", (event) => record(event.reason));
}
function consumeLastCapturedError() {
	if (!lastCapturedError) return void 0;
	if (Date.now() - lastCapturedError.at > TTL_MS) {
		lastCapturedError = void 0;
		return;
	}
	const { error } = lastCapturedError;
	lastCapturedError = void 0;
	return error;
}
function renderErrorPage() {
	return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>500 — Server Error · SmartTrip</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      :root {
        --bg: #f8fafc;
        --card: #ffffff;
        --text: #0f172a;
        --muted: #64748b;
        --primary: #0284c7;
        --border: #e2e8f0;
      }
      @media (prefers-color-scheme: dark) {
        :root {
          --bg: #0f172a;
          --card: #1e293b;
          --text: #f8fafc;
          --muted: #94a3b8;
          --primary: #38bdf8;
          --border: #334155;
        }
      }
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        background: var(--bg);
        color: var(--text);
        display: grid;
        place-items: center;
        min-height: 100vh;
        margin: 0;
        padding: 1.5rem;
        box-sizing: border-box;
      }
      .card {
        max-width: 30rem;
        width: 100%;
        text-align: center;
        padding: 2.5rem 2rem;
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 1.5rem;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
      }
      .badge {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        border-radius: 9999px;
        background: rgba(2, 132, 199, 0.15);
        color: var(--primary);
        margin-bottom: 1rem;
      }
      h1 { font-size: 1.5rem; font-weight: 700; margin: 0 0 0.75rem; }
      p { color: var(--muted); font-size: 0.9375rem; line-height: 1.6; margin: 0 0 1.75rem; }
      .actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
      a, button {
        padding: 0.625rem 1.25rem;
        border-radius: 9999px;
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        text-decoration: none;
        transition: all 0.2s ease;
      }
      .primary {
        background: var(--primary);
        color: #ffffff;
        border: none;
      }
      .primary:hover { opacity: 0.9; }
      .secondary {
        background: transparent;
        color: var(--text);
        border: 1px solid var(--border);
      }
      .secondary:hover { background: rgba(0, 0, 0, 0.04); }
    </style>
  </head>
  <body>
    <div class="card" role="alert" aria-live="assertive">
      <div class="badge">500 Server Error</div>
      <h1>Something unexpected occurred</h1>
      <p>We encountered a temporary server error. We've captured the telemetry, and you can try refreshing or return to the home page.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Reload Page</button>
        <a class="secondary" href="/">Go to Homepage</a>
      </div>
    </div>
  </body>
</html>`;
}
function getSupabaseUrl() {
	if (typeof process !== "undefined" && process.env?.["VITE_SUPABASE_URL"]) return process.env["VITE_SUPABASE_URL"];
	if (typeof import.meta !== "undefined" && {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/"
	}["VITE_SUPABASE_URL"]) return {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/"
	}["VITE_SUPABASE_URL"];
	return "https://placeholder-project.supabase.co";
}
function getSupabaseAnonKey() {
	if (typeof process !== "undefined") {
		const key = process.env?.["VITE_SUPABASE_ANON_KEY"] || process.env?.["VITE_SUPABASE_PUBLISHABLE_KEY"];
		if (key) return key;
	}
	if (typeof import.meta !== "undefined") {
		const key = {
			"BASE_URL": "/",
			"DEV": false,
			"MODE": "production",
			"PROD": true,
			"SSR": true,
			"TSS_DEV_SERVER": "false",
			"TSS_DEV_SSR_STYLES_BASEPATH": "/",
			"TSS_DEV_SSR_STYLES_ENABLED": "true",
			"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
			"TSS_INLINE_CSS_ENABLED": "false",
			"TSS_ROUTER_BASEPATH": "",
			"TSS_SERVER_FN_BASE": "/_serverFn/"
		}["VITE_SUPABASE_ANON_KEY"] || {
			"BASE_URL": "/",
			"DEV": false,
			"MODE": "production",
			"PROD": true,
			"SSR": true,
			"TSS_DEV_SERVER": "false",
			"TSS_DEV_SSR_STYLES_BASEPATH": "/",
			"TSS_DEV_SSR_STYLES_ENABLED": "true",
			"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
			"TSS_INLINE_CSS_ENABLED": "false",
			"TSS_ROUTER_BASEPATH": "",
			"TSS_SERVER_FN_BASE": "/_serverFn/"
		}["VITE_SUPABASE_PUBLISHABLE_KEY"];
		if (key) return key;
	}
	return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder";
}
function getSupabaseServerClient() {
	return createClient(getSupabaseUrl(), getSupabaseAnonKey(), { auth: {
		persistSession: false,
		autoRefreshToken: false,
		detectSessionInUrl: false
	} });
}
async function getServerUser() {
	try {
		const cookies = getCookies() || {};
		const authKey = Object.keys(cookies).find((k) => k.startsWith("sb-") && k.endsWith("-auth-token"));
		let accessToken = null;
		if (authKey && cookies[authKey]) try {
			const raw = cookies[authKey];
			const parsed = JSON.parse(raw);
			accessToken = parsed.access_token || (Array.isArray(parsed) ? parsed[0] : null);
		} catch {
			accessToken = cookies[authKey];
		}
		if (!accessToken) return null;
		const { data, error } = await getSupabaseServerClient().auth.getUser(accessToken);
		if (error || !data?.user) return null;
		return data.user;
	} catch {
		return null;
	}
}
/**
* Deterministic Price Fluctuation & Price Alert Evaluation Engine
* Applies small deterministic daily variations to seeded catalog fares (labeled "Demo pricing").
* Dispatches notifications when watched routes or destinations drop below a user's target price.
*/
/**
* Calculates a deterministic daily percentage fluctuation for any item ID.
* Returns an integer between -12% and +8%.
*/
function getDailyFluctuationPercent(itemId, dateStr) {
	const d = dateStr || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	let hash = 0;
	const str = `${itemId.toLowerCase().trim()}_${d}_smarttrip_demo_pricing`;
	for (let i = 0; i < str.length; i++) {
		hash = (hash << 5) - hash + str.charCodeAt(i);
		hash |= 0;
	}
	return Math.abs(hash) % 21 - 12;
}
/**
* Returns the current fluctuated price based on the daily seed variation.
*/
function getFluctuatedPrice(basePrice, itemId, dateStr) {
	const percent = getDailyFluctuationPercent(itemId, dateStr);
	const fluctuated = Math.round(basePrice * (1 + percent / 100));
	return Math.max(100, fluctuated);
}
/**
* Evaluates active price alerts against today's fluctuated prices
* and triggers notifications for drops below the target.
*/
async function evaluatePriceAlertsJob(customAlerts) {
	const start = Date.now();
	const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const triggered = [];
	let alerts = [];
	if (customAlerts) alerts = customAlerts;
	else try {
		const url = typeof process !== "undefined" ? process.env?.["VITE_SUPABASE_URL"] || process.env?.["SUPABASE_URL"] : void 0;
		if (url && !url.includes("placeholder")) {
			const supabase = getSupabaseServerClient();
			if (supabase) {
				const { data, error } = await supabase.from("price_alerts").select("*").eq("is_active", true);
				if (!error && data) alerts = data.map((row) => ({
					id: String(row["id"]),
					userId: String(row["user_id"]),
					itemType: row["item_type"] || "flight",
					itemId: String(row["item_id"]),
					title: String(row["title"]),
					targetPrice: Number(row["target_price"]),
					basePrice: Number(row["base_price"]),
					currentPrice: Number(row["current_price"]),
					isActive: Boolean(row["is_active"]),
					createdAt: new Date(String(row["created_at"])).getTime(),
					lastNotifiedAt: row["last_notified_at"] ? new Date(String(row["last_notified_at"])).getTime() : void 0
				}));
			}
		}
	} catch (err) {
		console.warn("Could not query price_alerts table from Supabase (using mock/in-memory):", err);
	}
	for (const alert of alerts) {
		const todayPrice = getFluctuatedPrice(alert.basePrice, alert.itemId, today);
		if (todayPrice <= alert.targetPrice) {
			const savings = alert.basePrice - todayPrice;
			triggered.push({
				alertId: alert.id,
				title: alert.title,
				targetPrice: alert.targetPrice,
				currentPrice: todayPrice,
				savings
			});
			try {
				const supabase = getSupabaseServerClient();
				if (supabase && alert.userId) {
					await supabase.from("notifications").insert({
						user_id: alert.userId,
						title: "📉 Price Drop Alert!",
						message: `${alert.title} dropped to ₹${todayPrice.toLocaleString("en-IN")} (target was ₹${alert.targetPrice.toLocaleString("en-IN")}, saved ₹${savings.toLocaleString("en-IN")}). Demo pricing active.`,
						type: "price_drop",
						link: alert.itemType === "flight" ? "/bookings?tab=flights" : "/explore"
					});
					await supabase.from("price_alerts").update({
						current_price: todayPrice,
						last_checked_at: (/* @__PURE__ */ new Date()).toISOString(),
						last_notified_at: (/* @__PURE__ */ new Date()).toISOString()
					}).eq("id", alert.id);
				}
			} catch (err) {
				console.warn(`Could not dispatch notification for alert ${alert.id}:`, err);
			}
		}
	}
	return {
		status: "ok",
		checkedCount: alerts.length,
		alertsTriggered: triggered.length,
		triggeredAlerts: triggered,
		durationMs: Date.now() - start,
		timestamp: (/* @__PURE__ */ new Date()).toISOString(),
		message: `Price fluctuation evaluation finished. Evaluated ${alerts.length} alerts; triggered ${triggered.length} price drop notifications.`
	};
}
/**
* HTTP endpoint handler for GitHub Actions protected cron
*/
async function handlePriceFluctuationsCron(request) {
	const secretEnv = (typeof process !== "undefined" ? process.env?.["CRON_SECRET"] : void 0) || "smarttrip-demo-cron-secret";
	const headerSecret = request.headers.get("x-cron-secret") || request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
	if (!headerSecret || headerSecret !== secretEnv) return new Response(JSON.stringify({
		error: "Unauthorized",
		message: "Invalid or missing cron secret. Provide header x-cron-secret or Authorization: Bearer <secret>."
	}), {
		status: 401,
		headers: { "content-type": "application/json" }
	});
	try {
		const result = await evaluatePriceAlertsJob();
		return new Response(JSON.stringify(result, null, 2), {
			status: 200,
			headers: {
				"content-type": "application/json",
				"cache-control": "no-store, no-cache, must-revalidate"
			}
		});
	} catch (error) {
		console.error("Cron job error:", error);
		return new Response(JSON.stringify({
			error: "Internal Error",
			message: error instanceof Error ? error.message : "Price alert job encountered an unexpected error"
		}), {
			status: 500,
			headers: { "content-type": "application/json" }
		});
	}
}
var serverEntryPromise;
async function getServerEntry() {
	if (!serverEntryPromise) serverEntryPromise = import("./server-C2okxfcu.mjs").then((m) => m.default ?? m);
	return serverEntryPromise;
}
async function normalizeCatastrophicSsrResponse(response) {
	if (response.status < 500) return response;
	if (!(response.headers.get("content-type") ?? "").includes("application/json")) return response;
	const body = await response.clone().text();
	if (!isH3SwallowedErrorBody(body)) return response;
	console.error(consumeLastCapturedError() ?? /* @__PURE__ */ new Error(`h3 swallowed SSR error: ${body}`));
	return new Response(renderErrorPage(), {
		status: 500,
		headers: { "content-type": "text/html; charset=utf-8" }
	});
}
function isH3SwallowedErrorBody(body) {
	try {
		const payload = JSON.parse(body);
		return payload.unhandled === true && payload.message === "HTTPError";
	} catch {
		return false;
	}
}
async function handleKeepAlive() {
	const started = Date.now();
	let dbStatus = "skipped (no config)";
	const supabaseUrl = (typeof process !== "undefined" ? process.env?.["VITE_SUPABASE_URL"] || process.env?.["SUPABASE_URL"] : void 0) || "";
	const supabaseKey = (typeof process !== "undefined" ? process.env?.["VITE_SUPABASE_ANON_KEY"] || process.env?.["SUPABASE_ANON_KEY"] : void 0) || "";
	if (supabaseUrl && supabaseKey) try {
		const res = await fetch(`${supabaseUrl}/rest/v1/profiles?select=id&limit=1`, { headers: {
			apikey: supabaseKey,
			Authorization: `Bearer ${supabaseKey}`
		} });
		dbStatus = res.ok ? "healthy" : `warn (HTTP ${res.status})`;
	} catch (err) {
		dbStatus = `error (${err instanceof Error ? err.message : "connection failed"})`;
	}
	const payload = {
		status: "ok",
		service: "smarttrip-keep-alive",
		supabase: dbStatus,
		timestamp: (/* @__PURE__ */ new Date()).toISOString(),
		durationMs: Date.now() - started,
		message: "SmartTrip keep-alive ping successful. Free-tier inactivity pause timer reset."
	};
	return new Response(JSON.stringify(payload, null, 2), {
		status: 200,
		headers: {
			"content-type": "application/json",
			"cache-control": "no-store, no-cache, must-revalidate"
		}
	});
}
function applySecurityHeaders(res) {
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
		"form-action 'self'"
	].join("; ");
	if (!headers.has("Content-Security-Policy")) headers.set("Content-Security-Policy", csp);
	return new Response(res.body, {
		status: res.status,
		statusText: res.statusText,
		headers
	});
}
var server_default = { async fetch(request, env, ctx) {
	try {
		const url = new URL(request.url);
		if (url.pathname === "/robots.txt") return new Response(`User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /settings\nDisallow: /checkout\nDisallow: /booking-confirmation/\nDisallow: /my-trips\n\nSitemap: https://dream-plan-fly.vercel.app/sitemap.xml`, { headers: {
			"content-type": "text/plain; charset=utf-8",
			"cache-control": "public, max-age=86400"
		} });
		if (url.pathname === "/api/keep-alive") return applySecurityHeaders(await handleKeepAlive());
		if (url.pathname === "/api/cron/price-fluctuations" || url.pathname === "/api/cron/daily-price-alerts") return applySecurityHeaders(await handlePriceFluctuationsCron(request));
		return applySecurityHeaders(await normalizeCatastrophicSsrResponse(await (await getServerEntry()).fetch(request, env, ctx)));
	} catch (error) {
		console.error(error);
		return applySecurityHeaders(new Response(renderErrorPage(), {
			status: 500,
			headers: { "content-type": "text/html; charset=utf-8" }
		}));
	}
} };
//#endregion
export { renderErrorPage as a, server_default as default, getSupabaseServerClient as i, getFluctuatedPrice as n, getServerUser as r, getDailyFluctuationPercent as t };
