import "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-Ce56fEsW.mjs";
import { A as getScriptPreloadAttrs, D as toCrossJSONStream, E as toCrossJSONAsync, F as isDangerousProtocol, G as isNotFound, H as isRedirect, I as isPromise, L as waitForReason, M as resolveManifestAssetLink, N as resolveManifestCssLink, R as _getRenderedMatches, W as rootRouteId, a as isSsrResponse, f as RouterProvider, i as disposeSsrResponse, j as getStylesheetHref, n as bindSsrResponseToRequest, o as normalizeSsrResponse, r as defineHandlerCallback, s as stripSsrResponseBody, t as renderRouterToStream, w as fromJSON, z as invariant } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as createServerHistory } from "../_libs/tanstack__history.mjs";
import { a as mergeHeaders, i as defaultSerovalDeserializerPlugins, l as makeSerovalPlugin, n as getNormalizedURL, r as createRawStreamRPCPlugin, t as attachRouterServerSsrUtils, u as createSerializationAdapter } from "../_libs/@tanstack/router-core+[...].mjs";
import { a as TSS_SERVER_FUNCTION, c as createNullProtoObject, d as getStartContext, f as getStartOptions, i as TSS_FORMDATA_CONTEXT, m as safeObjectMerge, n as MAX_FRAME_PAYLOAD_SIZE, o as X_TSS_RAW_RESPONSE, p as runWithStartContext, r as TSS_CONTENT_TYPE_FRAMED_VERSIONED, s as X_TSS_SERIALIZED, t as MAX_FRAMED_STREAMS, u as flattenMiddlewares } from "./createServerFn-BPR289oA.mjs";
import { _ as withStartRequest, a as getErrorHeaders, d as reconcileResponse, f as resolveErrorResponseStatus, g as transferResponseProtocol, h as transferResponseMetadata, l as getSerializedResponseState, m as setProtectedResponseHeaders, n as createServerEntry$1, o as getParsedRequestUrl, p as restoreResponseProtocol, r as finalizeResponse, t as createFinalizedResponse, u as protectResponseHeaders } from "./internal-request-response-CURC4f5o.mjs";
import { t as createCsrfMiddleware } from "./createCsrfMiddleware-BdK_4__8.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function StartServer(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RouterProvider, { router: props.router });
}
var defaultStreamHandler = defineHandlerCallback(({ request, router, responseHeaders }) => renderRouterToStream({
	request,
	router,
	responseHeaders,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StartServer, { router })
}));
var HEADERS = { TSS_SHELL: "X-TSS_SHELL" };
/**
* @description Returns the router manifest data that should be sent to the client.
* This includes only the assets and preloads for the current route and any
* special assets that are needed for the client. It does not include relationships
* between routes or any other data that is not needed for the client.
*
* @param matchedRoutes - In dev mode, the matched routes are used to build
* the dev styles URL for route-scoped CSS collection.
*/
async function getStartManifest(matchedRoutes) {
	const { tsrStartManifest } = await import("../_tanstack-start-manifest_v-cnAgy2y8.mjs");
	const startManifest = tsrStartManifest();
	let routes = startManifest.routes;
	routes[rootRouteId];
	const manifestRoutes = {};
	for (const k in routes) {
		const v = routes[k];
		const result = {};
		if (v.preloads && v.preloads.length > 0) result.preloads = v.preloads;
		if (v.scripts && v.scripts.length > 0) result.scripts = v.scripts;
		if (v.css?.length) result.css = v.css;
		if (result.preloads || result.scripts || result.css) manifestRoutes[k] = result;
	}
	return {
		...startManifest.scriptFormat ? { scriptFormat: startManifest.scriptFormat } : {},
		...startManifest.inlineCss ? { inlineCss: startManifest.inlineCss } : {},
		routes: manifestRoutes
	};
}
/** Start's serialization adapters followed by `routerPlugins`. */
function getSerovalPlugins(routerPlugins) {
	return [...(getStartOptions()?.serializationAdapters)?.map(makeSerovalPlugin) ?? [], ...routerPlugins];
}
/**
* Binary frame protocol for multiplexing JSON and raw streams over HTTP.
*
* Frame format: [type:1][streamId:4][length:4][payload:length]
* - type: 1 byte - frame type (JSON, CHUNK, END, ERROR)
* - streamId: 4 bytes big-endian uint32 - stream identifier
* - length: 4 bytes big-endian uint32 - payload length
* - payload: variable length bytes
*/
/** Cached TextEncoder for frame encoding */
var textEncoder$1 = new TextEncoder();
/** Shared empty payload for END frames - avoids allocation per call */
var EMPTY_PAYLOAD = /* @__PURE__ */ new Uint8Array(0);
var MAX_ERROR_MESSAGE_CODE_UNITS = 4096;
/**
* Encodes a single frame with header and payload.
*/
function encodeFrame(type, streamId, payload) {
	if (payload.byteLength > 16777216) throw new RangeError(`Frame payload exceeds ${MAX_FRAME_PAYLOAD_SIZE} bytes`);
	const frame = new Uint8Array(9 + payload.length);
	frame[0] = type;
	frame[1] = streamId >>> 24 & 255;
	frame[2] = streamId >>> 16 & 255;
	frame[3] = streamId >>> 8 & 255;
	frame[4] = streamId & 255;
	frame[5] = payload.length >>> 24 & 255;
	frame[6] = payload.length >>> 16 & 255;
	frame[7] = payload.length >>> 8 & 255;
	frame[8] = payload.length & 255;
	frame.set(payload, 9);
	return frame;
}
/** Encodes an error message payload, truncated to a bounded length. */
function encodeErrorPayload(error) {
	const originalMessage = error instanceof Error ? error.message : String(error ?? "Unknown error");
	const message = originalMessage.length > MAX_ERROR_MESSAGE_CODE_UNITS ? `${originalMessage.slice(0, MAX_ERROR_MESSAGE_CODE_UNITS)}…` : originalMessage;
	return textEncoder$1.encode(message);
}
/**
* Creates a multiplexed ReadableStream from serialized response records.
*
* A record's JSON frame is admitted before any raw stream referenced by that
* record starts. Raw streams from admitted records are pumped concurrently.
* The caller bounds the stream count before records reach this function.
*/
function createMultiplexedStream(recordStream, options = {}) {
	let controller;
	let stopped = false;
	let activePumps = 0;
	let wakeDemand;
	let admission;
	const readers = /* @__PURE__ */ new Set();
	const pendingRawStreams = /* @__PURE__ */ new Set();
	const abortOutput = () => errorOutput(options.signal?.reason);
	const wakeAdmission = () => {
		const wake = wakeDemand;
		wakeDemand = void 0;
		wake?.();
	};
	const cancelReader = (reader, reason) => {
		reader.cancel(reason).catch(() => {});
	};
	const cancelStream = (stream, reason) => {
		stream.cancel(reason).catch(() => {});
	};
	const stop = (reason) => {
		if (stopped) return false;
		stopped = [reason];
		options.signal?.removeEventListener("abort", abortOutput);
		wakeAdmission();
		for (const reader of readers) cancelReader(reader, reason);
		for (const stream of pendingRawStreams) cancelStream(stream, reason);
		pendingRawStreams.clear();
		return true;
	};
	const errorOutput = (error) => {
		if (!stop(error)) return;
		try {
			controller.error(error);
		} catch {}
	};
	const waitForDemand = async () => {
		while (!stopped && (controller.desiredSize ?? 0) <= 0) await new Promise((resolve) => {
			wakeDemand = resolve;
		});
		return !stopped;
	};
	const admitFrame = (type, streamId, payload) => {
		if (stopped) return false;
		if (!admission && (controller.desiredSize ?? 0) > 0) {
			controller.enqueue(encodeFrame(type, streamId, payload));
			return true;
		}
		const runAdmission = async () => {
			if (!await waitForDemand()) return false;
			controller.enqueue(encodeFrame(type, streamId, payload));
			return true;
		};
		const result = admission ? admission.then(runAdmission) : runAdmission();
		const clearAdmission = () => {
			if (admission === tail) admission = void 0;
		};
		const tail = result.then(clearAdmission, clearAdmission);
		admission = tail;
		return result;
	};
	const maybeClose = () => {
		if (activePumps !== 0 || !stop()) return;
		try {
			controller.close();
		} catch {}
	};
	const startPump = (pump) => {
		activePumps++;
		pump().then(() => {
			activePumps--;
			maybeClose();
		}, (error) => {
			activePumps--;
			errorOutput(error);
		});
	};
	async function pumpRawStream(streamId, stream) {
		const reader = stream.getReader();
		readers.add(reader);
		try {
			while (!stopped) {
				const { done, value } = await reader.read();
				if (stopped) return;
				if (done) {
					const frameAdmission = admitFrame(2, streamId, EMPTY_PAYLOAD);
					if (frameAdmission !== true) await frameAdmission;
					return;
				}
				if (!(value instanceof Uint8Array)) throw new TypeError("RawStream chunks must be Uint8Array");
				let offset = 0;
				do {
					const chunk = value.byteLength <= 16777216 ? value : value.subarray(offset, offset + MAX_FRAME_PAYLOAD_SIZE);
					const frameAdmission = admitFrame(1, streamId, chunk);
					if (frameAdmission !== true && (frameAdmission === false || !await frameAdmission)) return;
					offset += MAX_FRAME_PAYLOAD_SIZE;
				} while (offset < value.byteLength);
			}
		} catch (error) {
			if (!stopped) {
				const frameAdmission = admitFrame(3, streamId, encodeErrorPayload(error));
				if (frameAdmission !== true) await frameAdmission;
			}
		} finally {
			readers.delete(reader);
			reader.releaseLock();
		}
	}
	async function pumpRecords() {
		const reader = recordStream.getReader();
		readers.add(reader);
		try {
			while (!stopped) {
				const { done, value } = await reader.read();
				if (stopped) {
					if (!done) for (const registration of value.rawStreams) cancelStream(registration.stream, stopped[0]);
					return;
				}
				if (done) return;
				for (const registration of value.rawStreams) pendingRawStreams.add(registration.stream);
				const frameAdmission = admitFrame(0, 0, value.json);
				if (frameAdmission !== true && (frameAdmission === false || !await frameAdmission)) return;
				for (const registration of value.rawStreams) {
					pendingRawStreams.delete(registration.stream);
					startPump(pumpRawStream.bind(void 0, registration.id, registration.stream));
				}
			}
		} catch (error) {
			if (!stopped) errorOutput(error);
		} finally {
			readers.delete(reader);
			reader.releaseLock();
		}
	}
	return new ReadableStream({
		start(ctrl) {
			controller = ctrl;
			if (options.signal?.aborted) {
				cancelStream(recordStream, options.signal.reason);
				errorOutput(options.signal.reason);
				return;
			}
			options.signal?.addEventListener("abort", abortOutput, { once: true });
			startPump(pumpRecords);
		},
		pull() {
			wakeAdmission();
		},
		cancel(reason) {
			if (stop(reason)) options.onCancel?.(reason);
		}
	});
}
var SERIALIZED_JSON_HEADERS = /* @__PURE__ */ new Map([
	["content-type", "application/json"],
	[X_TSS_SERIALIZED, "true"],
	[X_TSS_RAW_RESPONSE, null],
	["location", null]
]);
var SERIALIZED_JSON_HEADER_INIT = new Headers({
	"content-type": "application/json",
	[X_TSS_SERIALIZED]: "true"
});
/** Completed bytes own no stream until the request pipeline accepts them. */
var DeferredResponse = class {
	constructor(body) {
		this.body = body;
	}
	createResponse(event) {
		return createFinalizedResponse(this.body, SERIALIZED_JSON_HEADER_INIT, SERIALIZED_JSON_HEADERS, event);
	}
};
var SERIALIZED_FRAMED_HEADERS = /* @__PURE__ */ new Map([
	["content-type", TSS_CONTENT_TYPE_FRAMED_VERSIONED],
	[X_TSS_SERIALIZED, "true"],
	[X_TSS_RAW_RESPONSE, null],
	["location", null]
]);
var NOT_FOUND_HEADERS = /* @__PURE__ */ new Map([
	["content-type", "application/json"],
	[X_TSS_SERIALIZED, null],
	[X_TSS_RAW_RESPONSE, null],
	["location", null]
]);
var RAW_RESPONSE_HEADERS = /* @__PURE__ */ new Map([[X_TSS_RAW_RESPONSE, "true"]]);
var THROWN_RESPONSE_HEADERS = /* @__PURE__ */ new Map([[X_TSS_RAW_RESPONSE, "thrown"]]);
var MAX_PAYLOAD_SIZE = 1e6;
var MAX_PENDING_SERIALIZATION_RECORDS = 1024;
var MAX_PENDING_SERIALIZATION_BYTES = 33554432;
var textEncoder = new TextEncoder();
function encodeSerializationRecord(value) {
	return textEncoder.encode(JSON.stringify(value));
}
function exceedsPendingSerializationLimit(record, recordCount, pendingBytes) {
	return recordCount >= MAX_PENDING_SERIALIZATION_RECORDS || pendingBytes + record.byteLength > MAX_PENDING_SERIALIZATION_BYTES;
}
function runSerializationCleanup(dispose) {
	try {
		dispose();
	} catch {}
}
function cancelRawStream(stream, reason) {
	stream.cancel(reason).catch(() => {});
}
/**
* Marks a Response thrown during a server-function request so the client
* rejects the call with it. Redirects keep their own protocol.
*/
function toThrownServerFnResponse(response) {
	return isRedirect(response) ? response : setProtectedResponseHeaders(response, THROWN_RESPONSE_HEADERS);
}
/**
* Builds the reply for a server-function request that failed outside the
* function, such as in request middleware. Like a failed call, it carries
* only the thrown value under an `error` key, so the client rethrows it.
*/
async function createServerFnErrorResponse(error, serovalPlugins) {
	if (isNotFound(error)) return isNotFoundResponse(error);
	const headers = getErrorHeaders(error) ?? new Headers();
	const { status, statusText } = resolveErrorResponseStatus(error);
	headers.set("Content-Type", "application/json");
	headers.set(X_TSS_SERIALIZED, "true");
	headers.delete(X_TSS_RAW_RESPONSE);
	headers.delete("location");
	const plugins = serovalPlugins ?? getSerovalPlugins(defaultSerovalDeserializerPlugins);
	let serializedError;
	try {
		serializedError = JSON.stringify(await toCrossJSONAsync({ error }, {
			refs: /* @__PURE__ */ new Map(),
			plugins
		}));
	} catch (serializationError) {
		serializedError = JSON.stringify(await toCrossJSONAsync({ error: serializationError }, {
			refs: /* @__PURE__ */ new Map(),
			plugins
		}));
	}
	const errorResponse = new Response(serializedError, {
		status,
		statusText,
		headers
	});
	protectResponseHeaders(errorResponse, SERIALIZED_JSON_HEADERS);
	return errorResponse;
}
var handleServerAction = async ({ request, serverFnId }) => {
	const methodUpper = request.method.toUpperCase();
	const action = await getServerFnById(serverFnId, { origin: "client" });
	if (action.method && methodUpper !== action.method) return new Response(`expected ${action.method} method. Got ${methodUpper}`, {
		status: 405,
		headers: { Allow: action.method }
	});
	const headers = request.headers;
	const isServerFn = headers.get("x-tsr-serverfn") === "true";
	let serovalPlugins;
	const getRequestSerovalPlugins = () => {
		return serovalPlugins ??= getSerovalPlugins(defaultSerovalDeserializerPlugins);
	};
	const contentType = headers.get("content-type");
	try {
		let res;
		if (contentType && (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded"))) {
			if (methodUpper === "GET") invariant();
			const formData = await request.formData();
			const serializedContext = formData.get(TSS_FORMDATA_CONTEXT);
			formData.delete(TSS_FORMDATA_CONTEXT);
			const params = {
				data: formData,
				method: methodUpper
			};
			if (typeof serializedContext === "string") try {
				const parsedContext = JSON.parse(serializedContext);
				const deserializedContext = fromJSON(parsedContext, { plugins: getRequestSerovalPlugins() });
				if (typeof deserializedContext === "object" && deserializedContext) params.context = deserializedContext;
			} catch (e) {}
			res = await action(params);
		} else {
			let json;
			if (methodUpper === "GET") {
				const payloadParam = getParsedRequestUrl(request).searchParams.get("payload");
				if (payloadParam && payloadParam.length > MAX_PAYLOAD_SIZE) throw new Error("Payload too large");
				json = payloadParam ? JSON.parse(payloadParam) : void 0;
			} else if (contentType?.includes("application/json")) json = await request.json();
			const payload = json === void 0 ? void 0 : fromJSON(json, { plugins: getRequestSerovalPlugins() });
			res = await action({
				data: payload?.data,
				context: payload?.context,
				method: methodUpper
			});
		}
		const failed = "error" in res;
		const unwrapped = failed ? res.error : res.result;
		if (!isServerFn && (unwrapped instanceof Response || unwrapped === null || typeof unwrapped !== "object")) return unwrapped;
		if (unwrapped instanceof Response) {
			if (failed) return toThrownServerFnResponse(unwrapped);
			if (isRedirect(unwrapped)) return unwrapped;
			return setProtectedResponseHeaders(unwrapped, RAW_RESPONSE_HEADERS);
		}
		return serializeResult(res, request, getRequestSerovalPlugins());
	} catch (error) {
		if (error instanceof Response) return error;
		return createServerFnErrorResponse(error, serovalPlugins);
	}
};
/**
* Serializes a server-function result. A result that Seroval completes
* synchronously without RawStreams becomes plain JSON; everything else is a
* framed response whose records and raw streams are multiplexed in order.
*/
function serializeResult(res, request, plugins) {
	const initialRecords = [];
	let initialBytes = 0;
	const pendingRawStreams = [];
	let done = false;
	let initialParsed = false;
	let serializationFailure;
	let disposeSerialization;
	let onParse = (value, initial) => {
		if (serializationFailure) return;
		initialParsed ||= initial;
		const record = encodeSerializationRecord(value);
		if (exceedsPendingSerializationLimit(record, initialRecords.length, initialBytes)) {
			serializationFailure = [/* @__PURE__ */ new Error("Server function serialization exceeded its pending output limit")];
			return;
		}
		initialRecords.push(record);
		initialBytes += record.byteLength;
	};
	let onDone = () => {
		if (initialParsed) done = true;
	};
	let onError = (error) => {
		serializationFailure ??= [error];
	};
	const rawStreamPlugin = createRawStreamRPCPlugin((id, stream) => {
		if (serializationFailure) {
			cancelRawStream(stream, serializationFailure[0]);
			return;
		}
		if (id > 1024) {
			const error = /* @__PURE__ */ new Error(`Too many raw streams in framed response (max ${MAX_FRAMED_STREAMS})`);
			cancelRawStream(stream, error);
			onError(error);
			return;
		}
		pendingRawStreams.push({
			id,
			stream
		});
	});
	const dispose = toCrossJSONStream(res, {
		refs: /* @__PURE__ */ new Map(),
		plugins: [rawStreamPlugin, ...plugins],
		onParse(value, initial) {
			onParse(value, initial);
		},
		onDone() {
			onDone();
		},
		onError: (error) => {
			onError(error);
		}
	});
	if (serializationFailure) {
		runSerializationCleanup(dispose);
		for (const registration of pendingRawStreams) cancelRawStream(registration.stream, serializationFailure[0]);
		throw serializationFailure[0];
	}
	if (!done) disposeSerialization = dispose;
	if (done && pendingRawStreams.length === 0 && initialRecords.length === 1) return new DeferredResponse(initialRecords[0]);
	if (done && initialRecords.length === 1) {
		const json = initialRecords[0];
		if (json.byteLength > 16777216) {
			const error = /* @__PURE__ */ new Error("Server function serialization exceeded its pending output limit");
			for (const registration of pendingRawStreams) cancelRawStream(registration.stream, error);
			throw error;
		}
		const rawStreams = pendingRawStreams.splice(0);
		initialRecords.length = 0;
		return createFramedResponse(new ReadableStream({
			start(controller) {
				controller.enqueue({
					json,
					rawStreams
				});
				controller.close();
			},
			cancel(reason) {
				for (const registration of rawStreams) cancelRawStream(registration.stream, reason);
			}
		}), { signal: request.signal });
	}
	const { readable, writable } = new TransformStream();
	const writer = writable.getWriter();
	const recordAbortController = new AbortController();
	let pendingBytes = 0;
	const pendingRecords = /* @__PURE__ */ new Set();
	const abortRecordStream = (error) => {
		if (serializationFailure) return;
		serializationFailure = [error];
		const disposeCurrentSerialization = disposeSerialization;
		disposeSerialization = void 0;
		for (const registration of pendingRawStreams.splice(0)) cancelRawStream(registration.stream, error);
		for (const record of pendingRecords) for (const registration of record.rawStreams) cancelRawStream(registration.stream, error);
		pendingRecords.clear();
		recordAbortController.abort(error);
		writer.abort(error).catch(() => {});
		if (disposeCurrentSerialization) runSerializationCleanup(disposeCurrentSerialization);
	};
	const writeRecord = (json, rawStreams) => {
		if (serializationFailure) {
			for (const registration of rawStreams) cancelRawStream(registration.stream, serializationFailure[0]);
			return false;
		}
		if (json.byteLength > 16777216 || exceedsPendingSerializationLimit(json, pendingRecords.size, pendingBytes)) {
			const error = /* @__PURE__ */ new Error("Server function serialization exceeded its pending output limit");
			for (const registration of rawStreams) cancelRawStream(registration.stream, error);
			onError(error);
			return false;
		}
		pendingBytes += json.byteLength;
		const record = {
			json,
			rawStreams
		};
		pendingRecords.add(record);
		writer.write(record).then(() => {
			pendingRecords.delete(record);
			pendingBytes -= json.byteLength;
		}, (error) => {
			const stillOwned = pendingRecords.delete(record);
			pendingBytes -= json.byteLength;
			if (stillOwned) for (const registration of rawStreams) cancelRawStream(registration.stream, error);
		});
		return true;
	};
	onParse = (value) => {
		if (serializationFailure) return;
		writeRecord(encodeSerializationRecord(value), pendingRawStreams.splice(0));
	};
	onDone = () => {
		if (serializationFailure) return;
		disposeSerialization = void 0;
		writer.close().catch(() => {});
	};
	onError = (error) => {
		abortRecordStream(error);
	};
	const initialRawStreams = pendingRawStreams.splice(0);
	for (let index = 0; index < initialRecords.length; index++) {
		const isLast = index === initialRecords.length - 1;
		if (!writeRecord(initialRecords[index], isLast ? initialRawStreams : [])) {
			if (!isLast) for (const registration of initialRawStreams) cancelRawStream(registration.stream, serializationFailure[0]);
			initialRecords.length = 0;
			throw serializationFailure[0];
		}
	}
	initialRecords.length = 0;
	if (done) onDone();
	writer.closed.catch((error) => {
		abortRecordStream(error);
	});
	return createFramedResponse(readable, {
		signal: AbortSignal.any([recordAbortController.signal, request.signal]),
		onCancel: abortRecordStream
	});
}
function createFramedResponse(records, options) {
	const multiplexedStream = createMultiplexedStream(records, options);
	const { status, statusText } = getSerializedResponseState();
	try {
		const response = new Response(multiplexedStream, {
			status,
			statusText,
			headers: {
				"Content-Type": TSS_CONTENT_TYPE_FRAMED_VERSIONED,
				[X_TSS_SERIALIZED]: "true"
			}
		});
		protectResponseHeaders(response, SERIALIZED_FRAMED_HEADERS);
		return response;
	} catch (error) {
		cancelRawStream(multiplexedStream, error);
		throw error;
	}
}
function isNotFoundResponse(error) {
	const { headers, ...rest } = error;
	let responseHeaders;
	if (headers) {
		const copiedHeaders = new Headers(headers);
		copiedHeaders.set("Content-Type", "application/json");
		copiedHeaders.delete(X_TSS_SERIALIZED);
		copiedHeaders.delete(X_TSS_RAW_RESPONSE);
		copiedHeaders.delete("location");
		responseHeaders = copiedHeaders;
	} else responseHeaders = { "Content-Type": "application/json" };
	const response = new Response(JSON.stringify(rest), {
		status: 404,
		headers: responseHeaders
	});
	protectResponseHeaders(response, NOT_FOUND_HEADERS);
	return response;
}
var LINK_PARAM_TOKEN_RE = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
var PRELOAD_AS_VALUES = /* @__PURE__ */ new Set([
	"fetch",
	"font",
	"image",
	"script",
	"style",
	"track"
]);
function buildLinkParam(name, value) {
	if (value === void 0) return name;
	if (LINK_PARAM_TOKEN_RE.test(value)) return `${name}=${value}`;
	return `${name}=${JSON.stringify(value)}`;
}
function serializeEarlyHint(hint) {
	const parts = [`<${hint.href}>`, buildLinkParam("rel", hint.rel)];
	if (hint.as) parts.push(buildLinkParam("as", hint.as));
	if (hint.crossOrigin !== void 0) parts.push(buildLinkParam("crossorigin", hint.crossOrigin || void 0));
	if (hint.type) parts.push(buildLinkParam("type", hint.type));
	if (hint.integrity) parts.push(buildLinkParam("integrity", hint.integrity));
	if (hint.referrerPolicy) parts.push(buildLinkParam("referrerpolicy", hint.referrerPolicy));
	if (hint.fetchPriority) parts.push(buildLinkParam("fetchpriority", hint.fetchPriority));
	return parts.join("; ");
}
function getStringAttr(attrs, name, fallbackName) {
	const value = attrs?.[name] ?? (fallbackName ? attrs?.[fallbackName] : void 0);
	return typeof value === "string" ? value : void 0;
}
function getPreloadAs(attrs) {
	const as = getStringAttr(attrs, "as");
	return as && PRELOAD_AS_VALUES.has(as) ? as : void 0;
}
function addEarlyHintFetchAttrs(hint, attrs) {
	const crossOrigin = getStringAttr(attrs, "crossOrigin", "crossorigin");
	const type = getStringAttr(attrs, "type");
	const integrity = getStringAttr(attrs, "integrity");
	const referrerPolicy = getStringAttr(attrs, "referrerPolicy", "referrerpolicy");
	const fetchPriority = getStringAttr(attrs, "fetchPriority", "fetchpriority");
	if (crossOrigin !== void 0) hint.crossOrigin = crossOrigin;
	if (type) hint.type = type;
	if (integrity) hint.integrity = integrity;
	if (referrerPolicy) hint.referrerPolicy = referrerPolicy;
	if (fetchPriority) hint.fetchPriority = fetchPriority;
}
function linkAttrsToEarlyHint(attrs) {
	const href = getStringAttr(attrs, "href");
	const rel = getStringAttr(attrs, "rel");
	if (!href || !rel) return void 0;
	const relTokens = rel.split(/\s+/);
	let hintRel;
	let hintAs;
	if (relTokens.includes("modulepreload")) {
		hintRel = "modulepreload";
		hintAs = "script";
	} else if (relTokens.includes("stylesheet")) {
		hintRel = "preload";
		hintAs = "style";
	} else if (relTokens.includes("preload")) {
		hintAs = getPreloadAs(attrs);
		if (!hintAs) return void 0;
		hintRel = "preload";
	} else if (relTokens.includes("preconnect")) {
		hintRel = "preconnect";
		hintAs = void 0;
	} else if (relTokens.includes("dns-prefetch")) {
		hintRel = "dns-prefetch";
		hintAs = void 0;
	}
	if (!hintRel) return void 0;
	const hint = {
		href,
		rel: hintRel
	};
	if (hintAs) hint.as = hintAs;
	addEarlyHintFetchAttrs(hint, attrs);
	return hint;
}
function collectStaticHintsFromManifest(manifest, matchedRoutes) {
	const hints = [];
	for (const route of matchedRoutes) {
		const routeManifest = manifest.routes[route.id];
		if (!routeManifest) continue;
		for (const link of routeManifest.preloads ?? []) {
			const attrs = getScriptPreloadAttrs(manifest, link);
			const hint = {
				href: attrs.href,
				rel: attrs.rel,
				as: "script"
			};
			if (attrs.crossOrigin !== void 0) hint.crossOrigin = attrs.crossOrigin;
			hints.push(hint);
		}
		for (const link of routeManifest.css ?? []) {
			const stylesheetHref = getStylesheetHref(link);
			if (manifest.inlineCss?.styles[stylesheetHref] !== void 0) continue;
			const resolvedLink = resolveManifestCssLink(link);
			const hint = {
				href: stylesheetHref,
				rel: "preload",
				as: "style"
			};
			if (resolvedLink.crossOrigin !== void 0) hint.crossOrigin = resolvedLink.crossOrigin;
			hints.push(hint);
		}
	}
	return hints;
}
function collectDynamicHintsFromMatches(matches) {
	const hints = [];
	for (const match of matches) {
		const links = match.links;
		if (!Array.isArray(links)) continue;
		for (const link of links) {
			const hint = linkAttrsToEarlyHint(link);
			if (hint) hints.push(hint);
		}
	}
	return hints;
}
function createEarlyHintsEvent(opts) {
	const nextHints = [];
	const nextLinks = [];
	for (const hint of opts.hints) {
		const link = serializeEarlyHint(hint);
		if (opts.sentLinks.has(link)) continue;
		opts.sentLinks.add(link);
		opts.sentHints.push(hint);
		nextHints.push(hint);
		nextLinks.push(link);
	}
	if (!nextHints.length && opts.phase !== "dynamic") return void 0;
	return {
		phase: opts.phase,
		hints: nextHints,
		links: nextLinks,
		allHints: opts.sentHints.slice(),
		allLinks: Array.from(opts.sentLinks)
	};
}
function createResponseLinkHeaderEntries(opts) {
	for (const hint of opts.hints) {
		const link = serializeEarlyHint(hint);
		if (opts.sentLinks.has(link)) continue;
		opts.sentLinks.add(link);
		opts.entries.push({
			phase: opts.phase,
			hint,
			link
		});
	}
}
function getResponseLinkHeaderEntries(opts) {
	if (!opts.filter) return opts.entries.map((entry) => entry.link);
	try {
		const links = [];
		for (const entry of opts.entries) if (opts.filter(entry)) links.push(entry.link);
		return links;
	} catch (err) {
		console.error("Error filtering response Link headers:", err);
		return [];
	}
}
function notifyEarlyHints(phase, event, onEarlyHints) {
	try {
		const result = onEarlyHints(event);
		if (result) Promise.resolve(result).catch((err) => {
			console.error(`Error sending ${phase} early hints:`, err);
		});
	} catch (err) {
		console.error(`Error sending ${phase} early hints:`, err);
	}
}
function getResponseLinkHeaderFilter(responseLinkHeader) {
	if (typeof responseLinkHeader !== "object") return;
	return responseLinkHeader.filter;
}
function appendResponseLinkHeaders(opts) {
	for (const link of getResponseLinkHeaderEntries(opts)) opts.responseHeaders.append("Link", link);
}
function collectResponseLinkHeaderEntries(opts) {
	for (let index = 0; index < opts.event.hints.length; index++) opts.entries.push({
		phase: opts.phase,
		hint: opts.event.hints[index],
		link: opts.event.links[index]
	});
}
function collectEarlyHintsPhase(opts) {
	const event = opts.onEarlyHints ? createEarlyHintsEvent({
		phase: opts.phase,
		hints: opts.hints,
		sentLinks: opts.sentLinks,
		sentHints: opts.sentHints
	}) : void 0;
	if (event) notifyEarlyHints(opts.phase, event, opts.onEarlyHints);
	if (!opts.responseLinkHeaderEntries) return;
	if (event) {
		collectResponseLinkHeaderEntries({
			phase: opts.phase,
			event,
			entries: opts.responseLinkHeaderEntries
		});
		return;
	}
	createResponseLinkHeaderEntries({
		phase: opts.phase,
		hints: opts.hints,
		sentLinks: opts.sentLinks,
		entries: opts.responseLinkHeaderEntries
	});
}
function createEarlyHintsCollector(opts) {
	if (!opts?.onEarlyHints && !opts?.responseLinkHeader) return;
	const sentLinks = /* @__PURE__ */ new Set();
	const sentHints = opts.onEarlyHints ? new Array() : void 0;
	const responseLinkHeaderEntries = opts.responseLinkHeader ? new Array() : void 0;
	const responseLinkHeaderFilter = getResponseLinkHeaderFilter(opts.responseLinkHeader);
	return {
		collectStatic: ({ manifest, matchedRoutes }) => {
			if (!matchedRoutes?.length) return;
			collectEarlyHintsPhase({
				phase: "static",
				hints: collectStaticHintsFromManifest(manifest, matchedRoutes),
				sentLinks,
				sentHints,
				onEarlyHints: opts.onEarlyHints,
				responseLinkHeaderEntries
			});
		},
		collectDynamic: (matches) => {
			collectEarlyHintsPhase({
				phase: "dynamic",
				hints: collectDynamicHintsFromMatches(matches),
				sentLinks,
				sentHints,
				onEarlyHints: opts.onEarlyHints,
				responseLinkHeaderEntries
			});
		},
		appendResponseHeaders: (headers) => {
			if (!responseLinkHeaderEntries?.length) return;
			appendResponseLinkHeaders({
				responseHeaders: headers,
				entries: responseLinkHeaderEntries,
				filter: responseLinkHeaderFilter
			});
		}
	};
}
function normalizeTransformAssetResult(result) {
	if (typeof result === "string") return { href: result };
	return result;
}
function escapeCssString(value) {
	return value.replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\n/g, "\\a ").replace(/\r/g, "\\d ").replace(/\f/g, "\\c ");
}
async function transformInlineCssTemplate(options) {
	const { strings, urls } = options.template;
	if (strings.length !== urls.length + 1) throw new Error(`TanStack Start inlineCss template for ${options.stylesheetHref} is invalid`);
	let css = strings[0];
	for (let index = 0; index < urls.length; index++) {
		const transformed = normalizeTransformAssetResult(await options.transformFn({
			kind: "css-url",
			url: urls[index],
			stylesheetHref: options.stylesheetHref
		}));
		css += escapeCssString(transformed.href) + strings[index + 1];
	}
	return css;
}
async function transformInlineCssStyles(inlineCss, transformFn) {
	const transformedStyles = {};
	const transformedEntries = await Promise.all(Object.entries(inlineCss.styles).map(async ([stylesheetHref, css]) => {
		const template = inlineCss.templates?.[stylesheetHref];
		return [stylesheetHref, template ? await transformInlineCssTemplate({
			stylesheetHref,
			template,
			transformFn
		}) : css];
	}));
	for (const [stylesheetHref, css] of transformedEntries) transformedStyles[stylesheetHref] = css;
	return {
		styles: transformedStyles,
		...inlineCss.templates ? { templates: inlineCss.templates } : {}
	};
}
function resolveTransformAssetsCrossOrigin(config, kind) {
	if (!config) return void 0;
	if (typeof config === "string") return config;
	return config[kind];
}
function isObjectShorthand(transform) {
	return "prefix" in transform;
}
function resolveTransformAssetsConfig(transform) {
	if (typeof transform === "string") {
		const prefix = transform;
		return {
			type: "transform",
			transformFn: ({ url }) => ({ href: `${prefix}${url}` }),
			cache: true
		};
	}
	if (typeof transform === "function") return {
		type: "transform",
		transformFn: transform,
		cache: true
	};
	if (isObjectShorthand(transform)) {
		const { prefix, crossOrigin } = transform;
		return {
			type: "transform",
			transformFn: ({ url, kind }) => {
				const href = `${prefix}${url}`;
				if (kind === "css-url") return { href };
				const co = resolveTransformAssetsCrossOrigin(crossOrigin, kind);
				return co ? {
					href,
					crossOrigin: co
				} : { href };
			},
			cache: true
		};
	}
	if ("createTransform" in transform && transform.createTransform) return {
		type: "createTransform",
		createTransform: transform.createTransform,
		cache: transform.cache !== false
	};
	return {
		type: "transform",
		transformFn: typeof transform.transform === "string" ? (({ url }) => ({ href: `${transform.transform}${url}` })) : transform.transform,
		cache: transform.cache !== false
	};
}
function assignManifestLink(link, next) {
	if (typeof link === "string") return next.crossOrigin ? next : next.href;
	const nextLink = {
		...link,
		href: next.href
	};
	if (next.crossOrigin) nextLink.crossOrigin = next.crossOrigin;
	else delete nextLink.crossOrigin;
	return nextLink;
}
async function transformManifestAssets(source, transformFn, _opts) {
	const manifest = structuredClone(source);
	const inlineCssEnabled = _opts?.inlineCss !== false;
	const scriptTransforms = /* @__PURE__ */ new Map();
	const transformScript = (url) => {
		const cached = scriptTransforms.get(url);
		if (cached) return cached;
		const transformed = Promise.resolve(transformFn({
			url,
			kind: "script"
		})).then(normalizeTransformAssetResult);
		scriptTransforms.set(url, transformed);
		return transformed;
	};
	if (!inlineCssEnabled) delete manifest.inlineCss;
	else if (manifest.inlineCss) manifest.inlineCss = await transformInlineCssStyles(manifest.inlineCss, transformFn);
	for (const route of Object.values(manifest.routes)) {
		if (route.preloads?.length) route.preloads = await Promise.all(route.preloads.map(async (link) => {
			const resolved = resolveManifestAssetLink(link);
			const result = await transformScript(resolved.href);
			return assignManifestLink(link, {
				href: result.href,
				crossOrigin: result.crossOrigin
			});
		}));
		if (route.css?.length && !manifest.inlineCss) route.css = await Promise.all(route.css.map(async (link) => {
			const result = normalizeTransformAssetResult(await transformFn({
				url: resolveManifestCssLink(link).href,
				kind: "stylesheet"
			}));
			return assignManifestLink(link, {
				href: result.href,
				crossOrigin: result.crossOrigin
			});
		}));
		if (route.scripts?.length) for (const script of route.scripts) {
			const src = script.attrs?.src;
			if (typeof src !== "string") continue;
			const result = await transformScript(src);
			script.attrs = {
				...script.attrs,
				src: result.href
			};
			if (result.crossOrigin) script.attrs.crossOrigin = result.crossOrigin;
			else delete script.attrs.crossOrigin;
		}
	}
	return manifest;
}
/**
* Builds a final ServerManifest without URL transforms. Used when no
* transformAssets option is provided.
*
* Returns a new manifest object so the cached base manifest is never mutated.
*/
function buildManifest(source, opts) {
	return {
		...source.scriptFormat ? { scriptFormat: source.scriptFormat } : {},
		...opts?.inlineCss !== false && source.inlineCss ? { inlineCss: structuredClone(source.inlineCss) } : {},
		routes: { ...source.routes }
	};
}
/**
* The inline-CSS choice that needs no handler callback: a request override
* wins, then a static handler option, then the default. Undefined when a
* handler callback has to decide.
*/
function getStaticInlineCss(requestInlineCss, handlerInlineCss) {
	if (requestInlineCss !== void 0) return requestInlineCss;
	if (typeof handlerInlineCss === "function") return;
	return handlerInlineCss ?? true;
}
async function resolveInlineCssForRequest(opts) {
	const inlineCss = getStaticInlineCss(opts.requestInlineCss, opts.handlerInlineCss);
	if (inlineCss !== void 0) return inlineCss;
	return await opts.handlerInlineCss({ request: opts.request });
}
function createCachedBaseManifestLoader(loadBaseManifest) {
	let baseManifestPromise;
	return () => {
		if (!baseManifestPromise) baseManifestPromise = loadBaseManifest().catch((error) => {
			baseManifestPromise = void 0;
			throw error;
		});
		return baseManifestPromise;
	};
}
function createFinalManifestTransformResolver(transformAssets, opts) {
	const transformConfig = transformAssets !== void 0 ? resolveTransformAssetsConfig(transformAssets) : void 0;
	const cache = transformConfig ? transformConfig.cache : true;
	const warmup = !!transformAssets && typeof transformAssets === "object" && "warmup" in transformAssets && transformAssets.warmup === true;
	let cachedCreateTransformPromise;
	const clearCachedCreateTransform = () => {
		cachedCreateTransformPromise = void 0;
	};
	return {
		cache,
		warmup,
		clearCachedCreateTransform,
		getTransformFn: async (ctx) => {
			if (!transformConfig) return void 0;
			if (transformConfig.type !== "createTransform") return transformConfig.transformFn;
			if (!cache || !opts.cacheCreateTransform) return transformConfig.createTransform(ctx);
			if (!cachedCreateTransformPromise) cachedCreateTransformPromise = Promise.resolve(transformConfig.createTransform(ctx)).catch((error) => {
				clearCachedCreateTransform();
				throw error;
			});
			return cachedCreateTransformPromise;
		}
	};
}
function createFinalManifestResolver(opts) {
	const finalManifestCache = /* @__PURE__ */ new Map();
	const transformResolver = createFinalManifestTransformResolver(opts.transformAssets, { cacheCreateTransform: opts.cacheCreateTransform });
	const handlerDefaultInlineCss = getStaticInlineCss(void 0, opts.inlineCss);
	const getRequestManifestOptions = async (requestOpts) => {
		const transformFn = await transformResolver.getTransformFn({
			warmup: false,
			request: requestOpts.request
		});
		const inlineCss = await resolveInlineCssForRequest({
			request: requestOpts.request,
			handlerInlineCss: opts.inlineCss,
			requestInlineCss: requestOpts.requestInlineCss
		});
		return {
			getBaseManifest: requestOpts.getBaseManifest,
			transformFn,
			cache: transformResolver.cache,
			inlineCss
		};
	};
	const resolveRequest = async (requestOpts, cache) => {
		return resolveFinalManifest({
			...await getRequestManifestOptions(requestOpts),
			finalManifestCache: cache
		});
	};
	return {
		warmup: ({ getBaseManifest }) => warmupFinalManifest({
			enabled: transformResolver.warmup,
			handlerDefaultInlineCss,
			cache: transformResolver.cache,
			finalManifestCache,
			getBaseManifest,
			getTransformFn: () => transformResolver.getTransformFn({ warmup: true }),
			onError: transformResolver.clearCachedCreateTransform
		}),
		resolveCached: (requestOpts) => {
			const inlineCss = getStaticInlineCss(requestOpts.requestInlineCss, opts.inlineCss);
			if (transformResolver.cache && inlineCss !== void 0) {
				const cached = finalManifestCache.get(getFinalManifestCacheKey(inlineCss));
				if (cached) return cached;
			}
			return resolveRequest(requestOpts, finalManifestCache);
		},
		resolveUncached: (requestOpts) => resolveRequest(requestOpts, void 0)
	};
}
function getFinalManifestCacheKey(inlineCss) {
	return inlineCss ? "inline-css" : "linked-css";
}
function cacheFinalManifestPromise(finalManifestCache, cacheKey, promise) {
	const cachedPromise = promise.then((manifest) => {
		if (finalManifestCache.get(cacheKey) === cachedPromise) finalManifestCache.set(cacheKey, manifest);
		return manifest;
	}, (error) => {
		if (finalManifestCache.get(cacheKey) === cachedPromise) finalManifestCache.delete(cacheKey);
		throw error;
	});
	finalManifestCache.set(cacheKey, cachedPromise);
	return cachedPromise;
}
function getOrCreateCachedFinalManifest(finalManifestCache, cacheKey, computeFinalManifest) {
	const cached = finalManifestCache.get(cacheKey);
	if (cached) return cached;
	return cacheFinalManifestPromise(finalManifestCache, cacheKey, Promise.resolve().then(computeFinalManifest));
}
async function buildFinalManifest(opts) {
	return opts.transformFn ? await transformManifestAssets(opts.base, opts.transformFn, { inlineCss: opts.inlineCss }) : buildManifest(opts.base, { inlineCss: opts.inlineCss });
}
async function resolveFinalManifest(opts) {
	const computeFinalManifest = async () => {
		return buildFinalManifest({
			base: await opts.getBaseManifest(),
			transformFn: opts.transformFn,
			inlineCss: opts.inlineCss
		});
	};
	if (opts.finalManifestCache && (!opts.transformFn || opts.cache)) return getOrCreateCachedFinalManifest(opts.finalManifestCache, getFinalManifestCacheKey(opts.inlineCss), computeFinalManifest);
	return computeFinalManifest();
}
function warmupFinalManifest(opts) {
	if (!opts.enabled || opts.handlerDefaultInlineCss === void 0 || !opts.cache) return;
	const inlineCss = opts.handlerDefaultInlineCss;
	const warmupPromise = cacheFinalManifestPromise(opts.finalManifestCache, getFinalManifestCacheKey(inlineCss), Promise.resolve().then(async () => {
		const [base, transformFn] = await Promise.all([opts.getBaseManifest(), opts.getTransformFn()]);
		return buildFinalManifest({
			base,
			transformFn,
			inlineCss
		});
	}));
	if (opts.onError) warmupPromise.catch(opts.onError);
	return warmupPromise;
}
var ServerFunctionSerializationAdapter = createSerializationAdapter({
	key: "$TSS/serverfn",
	test: (v) => {
		if (typeof v !== "function") return false;
		if (!(TSS_SERVER_FUNCTION in v)) return false;
		return !!v[TSS_SERVER_FUNCTION];
	},
	toSerializable: ({ serverFnMeta }) => ({ functionId: serverFnMeta.id }),
	fromSerializable: ({ functionId }) => {
		const fn = async (opts, signal) => {
			const serverFn = await getServerFnById(functionId, { origin: "client" });
			const result = await serverFn({
				data: opts?.data,
				context: opts?.context,
				method: serverFn.method ?? "GET"
			}, signal);
			if ("error" in result) throw result.error;
			return result.result;
		};
		return fn;
	}
});
function getStartResponseHeaders(router) {
	const headers = new Headers({ "content-type": "text/html; charset=utf-8" });
	const matches = _getRenderedMatches(router.stores.matches.get());
	return matches.some((match) => match.headers) ? mergeHeaders(headers, ...matches.map((match) => match.headers)) : headers;
}
var cachedEntries;
var defaultCsrfMiddleware = createCsrfMiddleware({ filter: (ctx) => ctx.handlerType === "serverFn" });
var getCachedBaseManifest = createCachedBaseManifestLoader(() => getStartManifest());
var getProdBaseManifest = () => getCachedBaseManifest();
var getBaseManifest = getProdBaseManifest;
var createEarlyHintsForRequest = createEarlyHintsCollector;
async function loadEntries() {
	const [routerEntry, startEntry, pluginAdapters] = await Promise.all([
		import("./router-C0P0Wd_l.mjs"),
		import("./start-D77Jv4E2.mjs"),
		import("./empty-plugin-adapters-D9UWiqvJ.mjs")
	]);
	return {
		routerEntry,
		startEntry,
		pluginAdapters
	};
}
function getEntries() {
	if (!cachedEntries) cachedEntries = loadEntries().then((entries) => {
		cachedEntries = entries;
		return entries;
	});
	return cachedEntries;
}
var ROUTER_BASEPATH = "/";
var SERVER_FN_BASE = "/_serverFn/";
var IS_PRERENDERING = process.env.TSS_PRERENDERING === "true";
var IS_SHELL_ENV = process.env.TSS_SHELL === "true";
var IS_DEV = false;
var ERR_NO_RESPONSE = IS_DEV ? `It looks like you forgot to return a response from your server route handler. If you want to defer to the app router, make sure to have a component set in this route.` : "Internal Server Error";
var ERR_NO_DEFER = IS_DEV ? `You cannot defer to the app router if there is no component defined on this route.` : "Internal Server Error";
function throwRouteHandlerError() {
	throw new Error(ERR_NO_RESPONSE);
}
function throwIfMayNotDefer() {
	throw new Error(ERR_NO_DEFER);
}
function getResponseFromResult(result) {
	return isSsrResponse(result) || result instanceof Response ? result : result?.response;
}
function disposeResponseResult(result, reason) {
	const response = getResponseFromResult(result);
	if (isSsrResponse(response) || response instanceof Response) disposeSsrResponse(response, reason);
}
/**
* A new body continues the owned one when it is the same stream, or when the
* owned body is already being read, as by a pipe, a tee, or a `Response` that
* copies a body by reading it (Bun, or a wrapped global `Response`). Start
* cannot tell such a reader from one that stops early, so it disposes only an
* unread body. A stream whose reader stops early ends with the request's abort
* or the SSR stream's lifetime limit.
*/
function inheritsResponseOwnership(ownership, body) {
	const ownedBody = ownership.response.body;
	return body === ownedBody || ownedBody.locked;
}
function disposeResponseOwnership(ownership, reason) {
	const { response, sourceBody, streamResponse } = ownership;
	streamResponse?.dispose(reason);
	if (!streamResponse || response.body !== sourceBody) response.body.cancel(reason).catch(() => {});
}
function getOwnedResponse(ownership) {
	const { response, sourceBody, streamResponse } = ownership;
	if (!streamResponse) return response;
	if (streamResponse.response === response && response.body === sourceBody) return streamResponse;
	if (response.body === sourceBody) return {
		...streamResponse,
		response
	};
	return {
		...streamResponse,
		response,
		dispose(reason) {
			disposeResponseOwnership(ownership, reason);
		}
	};
}
function createLateResponseDisposer(signal) {
	return (result) => disposeResponseResult(result, signal.reason);
}
/**
* Compose middleware around a terminal response handler. With no middleware
* the terminal runs directly.
*/
async function executeMiddleware(middlewares, terminal, ctx, signal, event, terminalNext) {
	let index = -1;
	let responseOwnership;
	let returnedDepth = Infinity;
	const disposeAbandonedResult = createLateResponseDisposer(signal);
	const adoptResponse = (exposed, streamResponse) => {
		const current = responseOwnership;
		const body = exposed instanceof Response ? exposed.body : null;
		const response = exposed;
		if (streamResponse && !body && streamResponse !== current?.streamResponse) streamResponse.dispose("Response body dropped by Start reconciliation");
		if (current && current.response === exposed) current.streamResponse ??= streamResponse;
		else if (current && body && inheritsResponseOwnership(current, body)) {
			if (body === current.response.body) transferResponseProtocol(current.response, response);
			current.response = response;
			current.streamResponse ??= streamResponse;
		} else {
			if (current) {
				responseOwnership = void 0;
				disposeResponseOwnership(current, "middleware response replaced");
			}
			responseOwnership = body ? {
				response,
				sourceBody: body,
				streamResponse
			} : void 0;
		}
		ctx.response = exposed;
	};
	const disposeCurrentBody = (reason) => {
		const current = responseOwnership;
		responseOwnership = void 0;
		if (current) disposeResponseOwnership(current, reason);
	};
	const setResponse = (response, caller) => {
		const owned = response !== void 0 && response === responseOwnership?.response;
		const ssrResponse = !owned && isSsrResponse(response) ? response : void 0;
		const exposed = ssrResponse ? ssrResponse.response : response;
		if (returnedDepth <= caller) {
			if (exposed !== ctx.response) disposeResponseResult(response, "late middleware response");
			return;
		}
		if (!owned) adoptResponse(exposed, ssrResponse?.serverSsrCleanup === "stream" ? ssrResponse : void 0);
		if (exposed instanceof Response) {
			const reconciled = reconcileResponse(exposed, event, disposeCurrentBody);
			if (reconciled !== exposed) adoptRebuilt(exposed, reconciled);
		}
	};
	const adoptRebuilt = (exposed, rebuilt) => {
		const current = responseOwnership;
		if (current?.response === exposed && rebuilt.body) {
			current.response = rebuilt;
			ctx.response = rebuilt;
		} else adoptResponse(rebuilt);
	};
	let nextPromise;
	function next(nextCtx) {
		const result = runNext(index, nextCtx);
		nextPromise = result;
		return result;
	}
	async function runNext(caller, nextCtx) {
		signal.throwIfAborted();
		if (nextCtx) {
			if (nextCtx.context) ctx.context = safeObjectMerge(ctx.context, nextCtx.context);
			const keys = Object.keys(nextCtx);
			for (let i = 0; i < keys.length; i++) {
				const key = keys[i];
				if (key === "response") setResponse(nextCtx.response, caller);
				else if (key !== "context") ctx[key] = nextCtx[key];
			}
		}
		const depth = ++index;
		const isTerminal = depth === middlewares.length;
		const middleware = depth < middlewares.length ? middlewares[depth] : isTerminal ? terminal : void 0;
		const middlewareNext = isTerminal && terminalNext ? terminalNext : next;
		if (!middleware) return ctx;
		let result;
		try {
			const pending = middleware({
				...ctx,
				next: middlewareNext
			});
			if (nextPromise && pending === nextPromise) {
				nextPromise = void 0;
				result = await pending;
				signal.throwIfAborted();
			} else if (!isPromise(pending)) {
				result = pending;
				signal.throwIfAborted();
			} else result = await waitForReason(pending, signal, disposeAbandonedResult, disposeAbandonedResult);
		} catch (err) {
			if (depth < returnedDepth) returnedDepth = depth;
			if (returnedDepth > caller) adoptResponse(ctx.response);
			if (signal.aborted) {
				if (result !== void 0) disposeAbandonedResult(result);
				if (err !== signal.reason) disposeAbandonedResult(err);
				throw signal.reason;
			}
			if (err instanceof Response) {
				setResponse(ctx.handlerType === "serverFn" ? toThrownServerFnResponse(err) : err, caller);
				return ctx;
			}
			throw err;
		}
		if (depth < returnedDepth) returnedDepth = depth;
		if (isTerminal && terminalNext && !result) throwRouteHandlerError();
		if (isTerminal && !terminalNext && result instanceof DeferredResponse) {
			if (returnedDepth > caller) {
				adoptResponse(void 0);
				adoptResponse(result.createResponse(event));
			}
			return ctx;
		}
		if (result && result !== ctx) {
			const response = getResponseFromResult(result);
			if (response !== void 0) {
				if (ctx.response !== responseOwnership?.response && ctx.response !== response && returnedDepth > caller) adoptResponse(ctx.response);
				setResponse(response, caller);
			} else setResponse(ctx.response, caller);
			if (returnedDepth > caller && response !== result && result.context && result.context !== ctx.context) ctx.context = safeObjectMerge(ctx.context, result.context);
		} else setResponse(ctx.response, caller);
		return ctx;
	}
	try {
		await runNext(-1);
		let response = ctx.response;
		if (!response) throwRouteHandlerError();
		if (signal.aborted) throw signal.reason;
		returnedDepth = -1;
		if (middlewares.length && ctx.handlerType === "serverFn") {
			const restored = restoreResponseProtocol(response, event);
			if (restored !== response) {
				adoptRebuilt(response, restored);
				response = restored;
			}
		}
		return responseOwnership ? getOwnedResponse(responseOwnership) : response;
	} catch (err) {
		returnedDepth = -1;
		if (responseOwnership) disposeResponseOwnership(responseOwnership, signal.aborted ? signal.reason : err);
		throw err;
	}
}
/**
* Creates the TanStack Start request handler.
*
* @example Backwards-compatible usage (handler callback only):
* ```ts
* export default createStartHandler(defaultStreamHandler)
* ```
*
* @example With CDN URL rewriting:
* ```ts
* export default createStartHandler({
*   handler: defaultStreamHandler,
*   transformAssets: 'https://cdn.example.com',
* })
* ```
*
* @example With per-request URL rewriting:
* ```ts
* export default createStartHandler({
*   handler: defaultStreamHandler,
*   transformAssets: {
*     transform: ({ url }) => {
*       const cdnBase = getRequest().headers.get('x-cdn-base') || ''
*       return { href: `${cdnBase}${url}` }
*     },
*     cache: false,
*   },
* })
* ```
*/
function createStartHandler(cbOrOptions) {
	const handlerOptions = typeof cbOrOptions === "function" ? {} : cbOrOptions;
	const cb = typeof cbOrOptions === "function" ? cbOrOptions : cbOrOptions.handler;
	const finalManifestResolver = createFinalManifestResolver({
		...handlerOptions,
		cacheCreateTransform: true
	});
	const resolveManifestForRequest = finalManifestResolver.resolveCached;
	finalManifestResolver.warmup({ getBaseManifest: () => getBaseManifest(void 0) });
	const startRequestResolver = async (request, requestOpts, event) => {
		const signal = request.signal;
		let router;
		let routerPromise;
		let responseOwnsCleanup = false;
		let response;
		try {
			signal.throwIfAborted();
			const requestUrl = event.requestUrl;
			let url = requestUrl;
			const pathname = url.pathname;
			if (!SERVER_FN_BASE || !pathname.startsWith(SERVER_FN_BASE) || pathname.includes("%") || pathname.startsWith("//")) {
				const normalized = getNormalizedURL(requestUrl);
				url = normalized.url;
				if (normalized.handledProtocolRelativeURL) return finalizeResponse(Response.redirect(url, 308), event);
			}
			const pendingEntries = getEntries();
			const entries = isPromise(pendingEntries) ? await waitForReason(pendingEntries, signal) : pendingEntries;
			const isServerFnRequest = !!SERVER_FN_BASE && url.pathname.startsWith(SERVER_FN_BASE);
			const startInstance = entries.startEntry.startInstance;
			let startOptions;
			if (startInstance) {
				const pendingStartOptions = startInstance.getOptions();
				startOptions = isPromise(pendingStartOptions) ? await waitForReason(pendingStartOptions, signal) : pendingStartOptions;
				signal.throwIfAborted();
			} else startOptions = {};
			const { hasPluginAdapters, pluginSerializationAdapters } = entries.pluginAdapters;
			const serializationAdapters = [
				...startOptions.serializationAdapters || [],
				...hasPluginAdapters ? pluginSerializationAdapters : [],
				ServerFunctionSerializationAdapter
			];
			const requestStartOptions = {
				...startOptions,
				requestMiddleware: startInstance ? startOptions.requestMiddleware : isServerFnRequest ? [defaultCsrfMiddleware] : void 0,
				serializationAdapters
			};
			const requestMiddleware = requestStartOptions.requestMiddleware;
			let executedRequestMiddlewares;
			let flattenedRequestMiddlewares = [];
			if (requestMiddleware?.length) {
				executedRequestMiddlewares = /* @__PURE__ */ new Set();
				flattenedRequestMiddlewares = flattenMiddlewares(requestMiddleware, void 0, executedRequestMiddlewares);
			}
			const getRouter = () => {
				routerPromise ??= (async () => {
					signal.throwIfAborted();
					const routerUrl = url === requestUrl ? getNormalizedURL(url).url : url;
					const pendingRouter = entries.routerEntry.getRouter();
					const requestRouter = isPromise(pendingRouter) ? await waitForReason(pendingRouter, signal) : pendingRouter;
					let isShell = IS_SHELL_ENV;
					if (IS_PRERENDERING && !isShell) isShell = request.headers.get(HEADERS.TSS_SHELL) === "true";
					const history = createServerHistory(routerUrl.pathname + routerUrl.search + routerUrl.hash);
					requestRouter.update({
						history,
						isShell,
						isPrerendering: IS_PRERENDERING,
						origin: requestRouter.options.origin ?? routerUrl.origin,
						defaultSsr: requestStartOptions.defaultSsr,
						serializationAdapters: requestRouter.options.serializationAdapters?.length ? [...requestStartOptions.serializationAdapters, ...requestRouter.options.serializationAdapters] : requestStartOptions.serializationAdapters,
						basepath: ROUTER_BASEPATH
					});
					router = requestRouter;
					return requestRouter;
				})();
				return routerPromise;
			};
			const handlerType = isServerFnRequest ? "serverFn" : "router";
			const startContext = {
				getRouter,
				startOptions: requestStartOptions,
				request,
				executedRequestMiddlewares,
				handlerType
			};
			let terminal;
			if (isServerFnRequest) {
				const serverFnId = url.pathname.slice(SERVER_FN_BASE.length).split("/")[0];
				if (!serverFnId) throw new Error("Invalid server action param for serverFnId");
				terminal = ({ context }) => runWithStartContext({
					...startContext,
					contextAfterGlobalMiddlewares: context
				}, () => handleServerAction({
					request,
					serverFnId
				}));
			} else {
				const executeRouter = async (serverContext, matchedRoutes, routerInstance) => {
					if (!/(^|,)\s*(\*\/\*|text\/html)/.test(request.headers.get("Accept") || "*/*")) return normalizeSsrResponse(Response.json({ error: "Only HTML requests are supported here" }, { status: 406 }));
					const pendingManifest = resolveManifestForRequest({
						request,
						requestInlineCss: requestOpts?.inlineCss,
						getBaseManifest: () => getBaseManifest(matchedRoutes)
					});
					const manifest = isPromise(pendingManifest) ? await waitForReason(pendingManifest, signal) : pendingManifest;
					const earlyHints = createEarlyHintsForRequest(requestOpts);
					earlyHints?.collectStatic({
						manifest,
						matchedRoutes
					});
					const storedStartContext = getStartContext({ throwIfNotFound: false });
					attachRouterServerSsrUtils({
						router: routerInstance,
						manifest,
						getRequestAssets: () => storedStartContext?.requestAssets
					});
					routerInstance.options.additionalContext = { serverContext };
					await routerInstance.load({
						_signal: signal,
						_skipLocationUpdate: true
					});
					signal.throwIfAborted();
					if (routerInstance._serverResult?.type === "redirect") return normalizeSsrResponse(routerInstance._serverResult.redirect);
					earlyHints?.collectDynamic(_getRenderedMatches(routerInstance.stores.matches.get()));
					await routerInstance.serverSsr.dehydrate({
						requestAssets: storedStartContext?.requestAssets,
						signal
					});
					signal.throwIfAborted();
					const responseHeaders = getStartResponseHeaders(routerInstance);
					earlyHints?.appendResponseHeaders(responseHeaders);
					signal.throwIfAborted();
					return normalizeSsrResponse(await cb({
						request,
						router: routerInstance,
						responseHeaders
					}));
				};
				terminal = ({ context }) => runWithStartContext({
					...startContext,
					contextAfterGlobalMiddlewares: context
				}, () => handleServerRoutes({
					getRouter,
					request,
					executeRouter,
					context,
					executedRequestMiddlewares,
					signal,
					event
				}));
			}
			const middlewareCtx = {
				request,
				pathname: url.pathname,
				handlerType,
				context: createNullProtoObject(requestOpts?.context)
			};
			let middlewareResponse;
			try {
				if (!isServerFnRequest && flattenedRequestMiddlewares.length === 0) middlewareResponse = await terminal(middlewareCtx);
				else middlewareResponse = await executeMiddleware(flattenedRequestMiddlewares.map((d) => d.options.server), terminal, middlewareCtx, signal, event);
			} catch (error) {
				if (signal.aborted) throw error;
				if (error instanceof Response) middlewareResponse = reconcileResponse(error, event);
				else if (!isServerFnRequest) throw error;
				else {
					const disposeLate = createLateResponseDisposer(signal);
					middlewareResponse = await waitForReason(runWithStartContext({
						...startContext,
						contextAfterGlobalMiddlewares: middlewareCtx.context
					}, () => createServerFnErrorResponse(error)), signal, disposeLate, disposeLate);
					middlewareResponse = reconcileResponse(middlewareResponse, event);
				}
			}
			let result;
			try {
				result = normalizeSsrResponse(middlewareResponse);
				if (isRedirect(result.response)) result = await handleRedirectResponse(result, getRouter, signal, isServerFnRequest && request.headers.get("x-tsr-serverFn") === "true", event);
				if (request.method === "HEAD" && result.response.body !== null) {
					const source = result.response;
					result = stripSsrResponseBody(result, "HEAD body stripped");
					transferResponseMetadata(source, result.response);
				}
			} catch (error) {
				disposeResponseResult(middlewareResponse, signal.aborted ? signal.reason : error);
				throw error;
			}
			bindSsrResponseToRequest(router, result, signal);
			signal.throwIfAborted();
			responseOwnsCleanup = result.serverSsrCleanup === "stream";
			response = result.response;
		} finally {
			if (router?.serverSsr && !responseOwnsCleanup) {
				router.serverSsr.cleanup();
				if (response) response = finalizeResponse(response, event);
			}
		}
		return response;
	};
	return withStartRequest(startRequestResolver);
}
var relativeRedirectProtocols = /* @__PURE__ */ new Set();
var SERIALIZED_REDIRECT_HEADERS = /* @__PURE__ */ new Map([
	["content-type", "application/json"],
	["location", null],
	[X_TSS_RAW_RESPONSE, null],
	[X_TSS_SERIALIZED, null]
]);
async function handleRedirectResponse(ssrResponse, getRouter, signal, serializeRedirect, event) {
	signal.throwIfAborted();
	const redirect = ssrResponse.response;
	if (!isRedirect(redirect)) return ssrResponse;
	const opts = redirect.options;
	const href = redirect.headers.get("Location") || opts.href;
	if (!href && opts.to && typeof opts.to === "string" && !opts.to.startsWith("/")) throw new Error(`Server side redirects must use absolute paths via the 'href' or 'to' options. The redirect() method's "to" property accepts an internal path only. Use the "href" property to provide an external URL. Received: ${JSON.stringify(opts)}`);
	if (!href && [
		"params",
		"search",
		"hash"
	].some((d) => typeof opts[d] === "function")) throw new Error(`Server side redirects must use static search, params, and hash values and do not support functional values. Received functional values for: ${Object.keys(opts).filter((d) => typeof opts[d] === "function").map((d) => `"${d}"`).join(", ")}`);
	signal.throwIfAborted();
	if (href && !isDangerousProtocol(href, relativeRedirectProtocols)) {
		opts.href = href;
		redirect.headers.set("Location", href);
	} else {
		const router = await getRouter();
		signal.throwIfAborted();
		router.resolveRedirect(redirect);
	}
	if (serializeRedirect) {
		const redirectOptions = { ...opts };
		delete redirectOptions.headers;
		redirectOptions.isSerializedRedirect = true;
		const responseHeaders = new Headers(redirect.headers);
		responseHeaders.set("content-type", "application/json");
		responseHeaders.delete("location");
		responseHeaders.delete(X_TSS_RAW_RESPONSE);
		responseHeaders.delete(X_TSS_SERIALIZED);
		const body = JSON.stringify(redirectOptions);
		if (body === void 0) throw new TypeError("Value is not JSON serializable");
		disposeSsrResponse(ssrResponse, "redirect response replaced");
		return {
			response: createFinalizedResponse(body, responseHeaders, SERIALIZED_REDIRECT_HEADERS, event),
			serverSsrCleanup: "none"
		};
	}
	ssrResponse.response = finalizeResponse(redirect, event);
	return ssrResponse;
}
function withParsedParams(handler, matchedRoutes) {
	if (!matchedRoutes.some((route) => route.options.params?.parse ?? route.options.parseParams)) return handler;
	return (ctx) => {
		const params = Object.assign(Object.create(null), ctx.params);
		for (const route of matchedRoutes) {
			const parse = route.options.params?.parse ?? route.options.parseParams;
			if (parse) Object.assign(params, parse(params));
		}
		return handler({
			...ctx,
			params
		});
	};
}
async function handleServerRoutes({ getRouter, request, executeRouter, context, executedRequestMiddlewares, signal, event }) {
	const router = await getRouter();
	const { pathname } = router.latestLocation;
	const [matchedRoutes, rawParams, foundRoute] = router.getMatchedRoutes(pathname);
	const isExactMatch = foundRoute && rawParams["**"] === void 0;
	const routeMiddlewares = [];
	let terminalHandler = (ctx) => executeRouter(ctx.context, matchedRoutes, router);
	let terminalNext;
	for (const route of matchedRoutes) {
		const serverMiddleware = route.options.server?.middleware;
		if (serverMiddleware) {
			const flattened = flattenMiddlewares(serverMiddleware);
			for (const m of flattened) if (!executedRequestMiddlewares?.has(m)) routeMiddlewares.push(m.options.server);
		}
	}
	const server = foundRoute?.options.server;
	if (server?.handlers && isExactMatch) {
		const handlers = typeof server.handlers === "function" ? server.handlers({ createHandlers: (d) => d }) : server.handlers;
		const requestMethod = request.method.toUpperCase();
		const handler = requestMethod === "HEAD" ? handlers["HEAD"] ?? handlers["GET"] ?? handlers["ANY"] : handlers[requestMethod] ?? handlers["ANY"];
		if (handler) {
			const mayDefer = !!foundRoute.options.component;
			if (typeof handler !== "function") {
				if (handler.middleware?.length) {
					const handlerMiddlewares = flattenMiddlewares(handler.middleware);
					for (const m of handlerMiddlewares) routeMiddlewares.push(m.options.server);
				}
			}
			const routeHandler = typeof handler === "function" ? handler : handler.handler;
			if (routeHandler) {
				const parsedHandler = withParsedParams(routeHandler, matchedRoutes);
				if (!mayDefer) {
					terminalHandler = parsedHandler;
					terminalNext = throwIfMayNotDefer;
				} else routeMiddlewares.push(parsedHandler);
			}
		}
	}
	const response = await executeMiddleware(routeMiddlewares, terminalHandler, {
		request,
		context,
		params: rawParams,
		pathname,
		handlerType: "router"
	}, signal, event, terminalNext);
	return normalizeSsrResponse(response);
}
var fetch = createStartHandler(defaultStreamHandler);
var createServerEntry = createServerEntry$1;
var server_default = createServerEntry({ fetch });
//#endregion
export { createServerEntry, server_default as default };
