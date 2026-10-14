import { H as isRedirect } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as splitSetCookieString, o as parse, s as parseSetCookie } from "../_libs/@tanstack/router-core+[...].mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region node_modules/.nitro/vite/services/ssr/assets/internal-request-response-CURC4f5o.js
function getSetCookieValues(headers) {
	const headersWithSetCookie = headers;
	if (typeof headersWithSetCookie.getSetCookie === "function") return headersWithSetCookie.getSetCookie();
	const value = headers.get("set-cookie");
	return value ? splitSetCookieString(value) : [];
}
var GLOBAL_EVENT_STORAGE_KEY = Symbol.for("tanstack-start:event-storage");
var globalObj = globalThis;
if (!globalObj[GLOBAL_EVENT_STORAGE_KEY]) globalObj[GLOBAL_EVENT_STORAGE_KEY] = new AsyncLocalStorage();
var eventStorage = globalObj[GLOBAL_EVENT_STORAGE_KEY];
var PROTECTED_RESPONSE_HEADERS = Symbol.for("tanstack-start:protected-response-headers");
function getProtectedResponseHeaders(response) {
	return response[PROTECTED_RESPONSE_HEADERS];
}
function installProtectedResponseHeaders(response, headers) {
	Object.defineProperty(response, PROTECTED_RESPONSE_HEADERS, {
		value: headers,
		configurable: true
	});
}
/** Transport requirements belong to the encoded body, not its wrapper. */
function transferResponseProtocol(source, target) {
	const protectedHeaders = getProtectedResponseHeaders(source);
	if (protectedHeaders && getProtectedResponseHeaders(target) !== protectedHeaders) installProtectedResponseHeaders(target, protectedHeaders);
}
/** Preserve metadata when Start reconstructs an existing response. */
function transferResponseMetadata(source, target) {
	transferResponseProtocol(source, target);
	const event = eventStorage.getStore();
	const appliedHeaderAppends = event?.responseHeaderAppends?.get(source);
	if (appliedHeaderAppends) event.responseHeaderAppends.set(target, appliedHeaderAppends);
}
function sanitizeStatusMessage(statusMessage) {
	return statusMessage.replace(/[^\t\x20-\x7e]/g, "");
}
function sanitizeStatusCode(statusCode) {
	const code = typeof statusCode === "string" ? Number(statusCode) : statusCode;
	if (code === void 0 || !Number.isInteger(code) || code < 200 || code > 599) return;
	return code;
}
function getObjectProperty(value, key) {
	if (typeof value === "object" && value || typeof value === "function") return value[key];
}
function getStatusCodeProperty(value, key) {
	const property = getObjectProperty(value, key);
	if (typeof property === "string" || typeof property === "number") return property;
}
function getErrorStatus(error) {
	const cause = getObjectProperty(error, "cause");
	return sanitizeStatusCode(getStatusCodeProperty(error, "status") ?? getStatusCodeProperty(error, "statusCode") ?? getStatusCodeProperty(cause, "status") ?? getStatusCodeProperty(cause, "statusCode"));
}
function getErrorStatusText(error) {
	const cause = getObjectProperty(error, "cause");
	const statusText = getObjectProperty(error, "statusText") ?? getObjectProperty(error, "statusMessage") ?? getObjectProperty(cause, "statusText") ?? getObjectProperty(cause, "statusMessage");
	if (typeof statusText === "string") return sanitizeStatusMessage(statusText);
}
var GENERATED_BODY_EXCLUDED_HEADERS = /* @__PURE__ */ new Set([
	"connection",
	"content-encoding",
	"content-length",
	"keep-alive",
	"proxy-connection",
	"te",
	"trailer",
	"transfer-encoding"
]);
function isResponse(value) {
	return value instanceof Response || Object.prototype.toString.call(value) === "[object Response]";
}
function getErrorHeaders(error) {
	let init = getObjectProperty(error, "headers");
	if (!init) {
		const cause = getObjectProperty(error, "cause");
		if (isResponse(cause)) return;
		init = getObjectProperty(cause, "headers");
	}
	if (!init) return;
	let headers;
	try {
		headers = new Headers(init);
	} catch {
		return;
	}
	for (const name of GENERATED_BODY_EXCLUDED_HEADERS) headers.delete(name);
	return headers;
}
function getDistinctCookieKey(name, options, defaultPath = "") {
	return [
		name,
		options.domain || "",
		options.path ?? defaultPath
	].join(";");
}
function getDistinctCookieKeyFromHeader(cookie) {
	const parsed = parseSetCookie(cookie);
	return parsed ? getDistinctCookieKey(parsed.name, parsed) : `\0${cookie}`;
}
function replaceSetCookieValues(headers, cookies) {
	headers.delete("set-cookie");
	for (const cookie of cookies) headers.append("set-cookie", cookie);
}
function getCookieKey(state, cookie) {
	const keys = state.setCookieKeys ||= /* @__PURE__ */ new Map();
	let key = keys.get(cookie);
	if (key === void 0) {
		key = getDistinctCookieKeyFromHeader(cookie);
		keys.set(cookie, key);
	}
	return key;
}
function getMergedSetCookieValues(state, currentCookies, cookiesToMerge) {
	if (currentCookies.length === 0) return cookiesToMerge;
	const cookieKeysToMerge = /* @__PURE__ */ new Set();
	for (const cookie of cookiesToMerge) cookieKeysToMerge.add(getCookieKey(state, cookie));
	return currentCookies.filter((cookie) => !cookieKeysToMerge.has(getCookieKey(state, cookie))).concat(cookiesToMerge);
}
function hasProtectedHeaderChanges(response, protectedHeaders) {
	const headers = response.headers;
	for (const [name, value] of protectedHeaders) if (headers.get(name) !== value) return true;
	return false;
}
function applyProtectedHeaders(protectedHeaders, headers) {
	for (const [name, value] of protectedHeaders) if (value === null) headers.delete(name);
	else headers.set(name, value);
}
function applyHeaderState(target, state, generatedBody, protectedHeaders, appliedHeaderAppends) {
	let headers = target;
	const mutableHeaders = () => {
		if (headers === target) headers = new Headers(target);
		return headers;
	};
	if (state.clearHeaders) {
		for (const name of Array.from(target.keys())) if (!protectedHeaders?.has(name)) mutableHeaders().delete(name);
	}
	if (!state.clearHeaders && state.removedHeaders) {
		for (const name of state.removedHeaders) if (!protectedHeaders?.has(name) && headers.has(name)) mutableHeaders().delete(name);
	}
	for (const [name, value] of state.headers) if (name !== "set-cookie" && !protectedHeaders?.has(name) && !(generatedBody && GENERATED_BODY_EXCLUDED_HEADERS.has(name))) {
		let append = state.headerAppends?.get(name);
		if (!append) {
			if (headers.get(name) !== value) mutableHeaders().set(name, value);
			continue;
		}
		const applied = appliedHeaderAppends?.get(name);
		const pending = [];
		while (append && append !== applied) {
			pending.push(append.value);
			append = append.previous;
		}
		for (let index = pending.length - 1; index >= 0; index--) mutableHeaders().append(name, pending[index]);
	}
	if (state.setCookieBehavior && !protectedHeaders?.has("set-cookie")) {
		const eventSetCookies = getSetCookieValues(state.headers);
		const currentCookies = getSetCookieValues(headers);
		const cookies = state.setCookieBehavior === "replace" ? eventSetCookies : getMergedSetCookieValues(state, currentCookies, eventSetCookies);
		if (cookies.length !== currentCookies.length || cookies.some((cookie, index) => cookie !== currentCookies[index])) replaceSetCookieValues(mutableHeaders(), cookies);
	}
	return headers;
}
function canHaveBody(method, status) {
	return method !== "HEAD" && status !== 204 && status !== 205 && status !== 304;
}
/** A protected content type marks a Start-serialized body the client decodes. */
function isSerializedResponse(protectedHeaders) {
	return typeof protectedHeaders?.get("content-type") === "string";
}
/**
* A helper status that forbids a body never applies to a serialized
* server-function reply, because the client must decode it. Only a HEAD request
* drops its body.
*/
function getHelperStatus(state, serialized) {
	const status = state?.status;
	if (!serialized || status === void 0 || canHaveBody("GET", status)) return status;
}
/** Helper status text describes the helper status and is ignored with it. */
function getHelperStatusText(state, helperStatus) {
	return helperStatus === state?.status ? state?.statusText : void 0;
}
function cancelDroppedBody(response, reason) {
	try {
		response.body?.cancel(reason).catch(() => {});
	} catch {}
}
function createReconciledResponse(body, status, statusText, headers) {
	try {
		return new Response(body, {
			status,
			statusText,
			headers
		});
	} catch (cause) {
		throw new Error("Unable to reconcile response because its body has already been consumed or locked.", { cause });
	}
}
/** Apply helper state to a response that leaves Start. */
function finalizeResponse(response, event) {
	return applyResponseState(response, event, event.request.method);
}
/**
* Apply helper state with the body rules of `method`. Request middleware still
* reads a HEAD response's body, so the pipeline applies GET rules and strips a
* HEAD body only when the response leaves it.
*/
function applyResponseState(response, event, method, disposeBody) {
	const protectedHeaders = getProtectedResponseHeaders(response);
	const serialized = isSerializedResponse(protectedHeaders);
	let helperStatus = getHelperStatus(event.responseState, serialized);
	const mustDropBody = !canHaveBody(method, helperStatus ?? response.status) && response.body !== null;
	if (mustDropBody) {
		const reason = method === "HEAD" ? "HEAD body stripped" : "Response body dropped by Start reconciliation";
		if (disposeBody) disposeBody(reason);
		else cancelDroppedBody(response, reason);
		helperStatus = getHelperStatus(event.responseState, serialized);
	}
	const state = event.responseState;
	if (!state && !mustDropBody) {
		event.currentResponse = response;
		return response;
	}
	const status = helperStatus ?? response.status;
	const statusText = getHelperStatusText(state, helperStatus) ?? response.statusText;
	const statusChanged = status !== response.status;
	const statusTextChanged = statusText !== response.statusText;
	const headers = state ? applyHeaderState(response.headers, state, serialized, protectedHeaders, event.responseHeaderAppends?.get(response)) : response.headers;
	const reconciled = statusChanged || statusTextChanged || mustDropBody || headers !== response.headers ? createReconciledResponse(mustDropBody ? null : response.body, status, statusText, headers) : response;
	if (protectedHeaders && reconciled !== response) installProtectedResponseHeaders(reconciled, protectedHeaders);
	return publishResponse(reconciled, event);
}
function publishResponse(response, event) {
	const headerAppends = event.responseState?.headerAppends;
	if (headerAppends?.size) (event.responseHeaderAppends ||= /* @__PURE__ */ new WeakMap()).set(response, new Map(headerAppends));
	event.currentResponse = response;
	return response;
}
function getHttpErrorStatus(status) {
	return status !== void 0 && status >= 400 ? status : void 0;
}
/**
* Status for a response built from an uncaught error. Only an error status
* (400-599) from a helper or from error metadata describes the failure, so a
* success or redirect status set before the throw cannot hide it. The error is
* logged unless its own metadata marks it as an HTTP error. Reporting runs
* before helper state is read, so hooks that write helpers are included.
*/
function resolveErrorStatus(error, event) {
	const metadataStatus = getErrorStatus(error);
	const errorStatus = getHttpErrorStatus(metadataStatus);
	if (errorStatus === void 0) console.error(error);
	const state = event?.responseState;
	const helperStatus = getHttpErrorStatus(state?.status);
	const status = helperStatus ?? errorStatus ?? 500;
	const statusText = getHelperStatusText(state, helperStatus) ?? (status === errorStatus || metadataStatus === void 0 ? getErrorStatusText(error) : void 0) ?? "";
	if (state && state.status !== helperStatus) {
		state.status = void 0;
		state.statusText = void 0;
	}
	return {
		status,
		statusText
	};
}
/**
* Internal: status and status text for a serialized server-function error.
* Logs the error and discards a non-error helper status, like any error
* response Start builds.
*/
function resolveErrorResponseStatus(error) {
	return resolveErrorStatus(error, eventStorage.getStore());
}
function createErrorResponse(error, event) {
	let headers = getErrorHeaders(error) ?? new Headers();
	const { status, statusText } = resolveErrorStatus(error, event);
	const state = event.responseState;
	const body = canHaveBody(event.request.method, status) ? JSON.stringify({
		status,
		statusText,
		unhandled: true,
		message: "HTTPError"
	}) : null;
	if (!headers.has("content-type")) headers.set("content-type", "application/json");
	if (state) headers = applyHeaderState(headers, state, true);
	return publishResponse(new Response(body !== null && !headers.has("content-type") ? new TextEncoder().encode(body) : body, {
		status,
		statusText,
		headers
	}), event);
}
function finalizeError(error, event) {
	if (error instanceof Response) return finalizeResponse(error, event);
	return createErrorResponse(error, event);
}
function handleStartError(error) {
	const event = eventStorage.getStore();
	if (event) return finalizeError(error, event);
	if (error instanceof Response) return error;
	const request = new Request("http://localhost");
	return createErrorResponse(error, {
		request,
		requestUrl: new URL(request.url)
	});
}
/** Apply helper state to a response inside the request middleware pipeline. */
function reconcileResponse(response, event, disposeBody) {
	if (!event.responseState && (response === event.currentResponse || canHaveBody("GET", response.status)) || isRedirect(response)) {
		event.currentResponse = response;
		return response;
	}
	return applyResponseState(response, event, "GET", disposeBody);
}
/**
* Restore protocol headers that middleware changed directly on the response.
* Start does this once, when the response leaves the request middleware
* pipeline; helper writes never override them.
*/
function restoreResponseProtocol(response, event) {
	const protectedHeaders = getProtectedResponseHeaders(response);
	if (!protectedHeaders || !hasProtectedHeaderChanges(response, protectedHeaders)) return response;
	const headers = new Headers(response.headers);
	applyProtectedHeaders(protectedHeaders, headers);
	const restored = createReconciledResponse(response.body, response.status, response.statusText, headers);
	transferResponseMetadata(response, restored);
	event.currentResponse = restored;
	return restored;
}
/**
* Build a Start-owned serialized reply with already normalized protocol
* headers. A bodyless helper status never applies to it; only a HEAD request
* drops its body.
*/
function createFinalizedResponse(body, headers, protectedHeaders, event) {
	const state = event.responseState;
	let status = 200;
	let statusText = "";
	if (state) {
		const helperStatus = getHelperStatus(state, true);
		status = helperStatus ?? 200;
		statusText = getHelperStatusText(state, helperStatus) ?? "";
		headers = applyHeaderState(headers, state, true, protectedHeaders);
	}
	const response = new Response(canHaveBody(event.request.method, status) ? body : null, {
		status,
		statusText,
		headers
	});
	installProtectedResponseHeaders(response, protectedHeaders);
	return publishResponse(response, event);
}
function protectResponseHeaders(response, headers) {
	const previous = getProtectedResponseHeaders(response);
	if (previous === headers) return;
	if (previous) {
		const merged = new Map(previous);
		for (const [name, value] of headers) merged.set(name, value);
		headers = merged;
	}
	installProtectedResponseHeaders(response, headers);
}
/**
* Set and protect transport headers on a new response. Reuse the body stream
* without cloning or teeing it; callers transfer ownership to the result.
*/
function setProtectedResponseHeaders(response, headers) {
	let next;
	try {
		next = new Response(response.body, response);
		applyProtectedHeaders(headers, next.headers);
	} catch (cause) {
		throw new Error("Unable to set response header because its body has already been consumed or locked.", { cause });
	}
	transferResponseMetadata(response, next);
	protectResponseHeaders(next, headers);
	return next;
}
function decodePathname(pathname) {
	try {
		return decodeURI(pathname);
	} catch (error) {
		if (error instanceof URIError) return;
		throw error;
	}
}
function runInStartRequest(request, requestOpts, handler) {
	let requestUrl;
	try {
		requestUrl = new URL(request.url);
	} catch (error) {
		if (error instanceof TypeError) return new Response(null, {
			status: 400,
			statusText: "Bad Request"
		});
		throw error;
	}
	const pathname = requestUrl.pathname;
	if (pathname.includes("%") && decodePathname(pathname) === void 0) return new Response(null, {
		status: 400,
		statusText: "Bad Request"
	});
	const event = {
		request,
		requestUrl
	};
	return eventStorage.run(event, handler, request, requestOpts, event);
}
/**
* Keep the complete server entry, including custom error handling, inside one
* request scope. A custom returned response is used as-is; call handleStartError
* in a custom catch to preserve Start's response helper state.
*/
function createServerEntry(entry) {
	return { fetch: withStartRequest(async (request, requestOpts) => {
		try {
			return await entry.fetch(request, requestOpts);
		} catch (error) {
			return handleStartError(error);
		}
	}) };
}
/**
* Establish request scope; the response pipeline owns reconciliation. A nested
* handler delegating the same request participates in its scope. Independent
* fetch invocations and different requests get a fresh event.
*/
function withStartRequest(handler) {
	return (request, requestOpts) => {
		const event = eventStorage.getStore();
		if (event?.request === request) return handler(request, requestOpts, event);
		return runInStartRequest(request, requestOpts, handler);
	};
}
function getStartEvent() {
	const event = eventStorage.getStore();
	if (!event) throw new Error(`No StartEvent found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`);
	return event;
}
/**
* Internal: returns the per-request parsed URL for `request`, memoized on the
* Start event so the framework parses each request URL only once. Falls back
* to parsing when called outside a Start event (e.g. in unit tests) or for a
* foreign request. Callers MUST NOT mutate the returned URL.
*/
function getParsedRequestUrl(request) {
	const event = eventStorage.getStore();
	if (event && event.request === request) return event.requestUrl;
	return new URL(request.url);
}
function getRequest() {
	return getStartEvent().request;
}
function getRequestHeaders() {
	return getStartEvent().request.headers;
}
function getRequestHeader(name) {
	return getRequestHeaders().get(name) ?? void 0;
}
function getRequestIP(opts) {
	const request = getRequest();
	if (opts?.xForwardedFor) {
		const forwardedIp = request.headers.get("x-forwarded-for")?.split(",", 1)[0]?.trim();
		if (forwardedIp) return forwardedIp;
	}
	return request.context?.clientAddress || request.ip || void 0;
}
/**
* Parse the request to get HTTP Cookie header string and return an object of all cookie name-value pairs.
* @returns Object of cookie name-value pairs
* ```ts
* const cookies = getCookies()
* ```
*/
function getCookies() {
	const cookies = parse(getRequestHeaders().get("cookie") || "");
	const definedCookies = Object.create(null);
	for (const [name, value] of Object.entries(cookies)) if (value !== void 0) definedCookies[name] = value;
	return definedCookies;
}
/**
* Internal: helper status state for a serialized server-function reply.
* Bodyless statuses never apply to it and are omitted with their status text.
*/
function getSerializedResponseState() {
	const state = getStartEvent().responseState;
	const status = getHelperStatus(state, true);
	return {
		status,
		statusText: getHelperStatusText(state, status)
	};
}
//#endregion
export { withStartRequest as _, getErrorHeaders as a, getRequestIP as c, reconcileResponse as d, resolveErrorResponseStatus as f, transferResponseProtocol as g, transferResponseMetadata as h, getCookies as i, getSerializedResponseState as l, setProtectedResponseHeaders as m, createServerEntry as n, getParsedRequestUrl as o, restoreResponseProtocol as p, finalizeResponse as r, getRequestHeader as s, createFinalizedResponse as t, protectResponseHeaders as u };
