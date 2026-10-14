import { H as isRedirect, U as parseRedirect } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as mergeHeaders } from "../_libs/@tanstack/router-core+[...].mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region node_modules/.nitro/vite/services/ssr/assets/createServerFn-BPR289oA.js
var TSS_FORMDATA_CONTEXT = "__TSS_CONTEXT";
var TSS_SERVER_FUNCTION = Symbol.for("TSS_SERVER_FUNCTION");
var TSS_SERVER_FUNCTION_FACTORY = Symbol.for("TSS_SERVER_FUNCTION_FACTORY");
var X_TSS_SERIALIZED = "x-tss-serialized";
var X_TSS_RAW_RESPONSE = "x-tss-raw";
/** Content-Type for multiplexed framed responses (RawStream support) */
var TSS_CONTENT_TYPE_FRAMED = "application/x-tss-framed";
/** Largest payload accepted by one framed-protocol record. */
var MAX_FRAME_PAYLOAD_SIZE = 16777216;
/** Largest number of raw streams accepted in one framed response. */
var MAX_FRAMED_STREAMS = 1024;
/** Full Content-Type header value with version parameter */
var TSS_CONTENT_TYPE_FRAMED_VERSIONED = `${TSS_CONTENT_TYPE_FRAMED}; v=1`;
var GLOBAL_STORAGE_KEY = Symbol.for("tanstack-start:start-storage-context");
var globalObj = globalThis;
if (!globalObj[GLOBAL_STORAGE_KEY]) globalObj[GLOBAL_STORAGE_KEY] = new AsyncLocalStorage();
var startStorage = globalObj[GLOBAL_STORAGE_KEY];
function runWithStartContext(context, fn) {
	return startStorage.run(context, fn);
}
function getStartContext(opts) {
	const context = startStorage.getStore();
	if (!context && opts?.throwIfNotFound !== false) throw new Error(`No Start context found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`);
	return context;
}
var getStartOptions = () => getStartContext().startOptions;
function isSafeKey(key) {
	return key !== "__proto__" && key !== "constructor" && key !== "prototype";
}
/**
* Merge target and source into a new null-proto object, filtering dangerous keys.
*/
function safeObjectMerge(target, source) {
	const result = Object.create(null);
	if (target) {
		const keys = Object.keys(target);
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			if (isSafeKey(key)) result[key] = target[key];
		}
	}
	if (source && typeof source === "object") {
		const keys = Object.keys(source);
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			if (isSafeKey(key)) result[key] = source[key];
		}
	}
	return result;
}
/**
* Create a null-prototype object, optionally copying from source.
*/
function createNullProtoObject(source) {
	return source ? safeObjectMerge(source, void 0) : Object.create(null);
}
var getStartContextServerOnly = getStartContext;
var createServerFn = (options, __opts) => {
	const resolvedOptions = __opts || options || {};
	if (typeof resolvedOptions.method === "undefined") resolvedOptions.method = "GET";
	const res = {
		options: resolvedOptions,
		middleware: (middleware) => {
			const newMiddleware = [...resolvedOptions.middleware || []];
			middleware.forEach((item) => {
				if (TSS_SERVER_FUNCTION_FACTORY in item) {
					if (item.options.middleware) newMiddleware.push(...item.options.middleware);
				} else newMiddleware.push(item);
			});
			const res = createServerFn(void 0, {
				...resolvedOptions,
				middleware: newMiddleware
			});
			res[TSS_SERVER_FUNCTION_FACTORY] = true;
			return res;
		},
		validator: (validator) => {
			return createServerFn(void 0, {
				...resolvedOptions,
				validator
			});
		},
		handler: (...args) => {
			const [extractedFn, serverFn] = args;
			const newOptions = {
				...resolvedOptions,
				extractedFn,
				serverFn
			};
			const resolvedMiddleware = [...newOptions.middleware || [], serverFnBaseToMiddleware(newOptions)];
			extractedFn.method = resolvedOptions.method;
			return Object.assign(async (opts) => {
				const result = await executeMiddleware(resolvedMiddleware, "client", {
					...extractedFn,
					...newOptions,
					data: opts?.data,
					headers: opts?.headers,
					signal: opts?.signal,
					fetch: opts?.fetch,
					context: createNullProtoObject()
				});
				if ("error" in result) throw parseRedirect(result.error) ?? result.error;
				return result.result;
			}, {
				...extractedFn,
				method: resolvedOptions.method,
				__executeServer: async (opts) => {
					const startContext = getStartContextServerOnly();
					const serverContextAfterGlobalMiddlewares = startContext.contextAfterGlobalMiddlewares;
					const ctx = {
						...extractedFn,
						data: opts.data,
						method: opts.method ?? resolvedOptions.method,
						serverFnMeta: extractedFn.serverFnMeta,
						context: safeObjectMerge(opts.context, serverContextAfterGlobalMiddlewares),
						request: startContext.request
					};
					const result = await executeMiddleware(resolvedMiddleware, "server", ctx);
					if ("error" in result) return { error: result.error };
					return result.sendContext === void 0 ? { result: result.result } : {
						result: result.result,
						context: result.sendContext
					};
				}
			});
		}
	};
	const fun = (options) => {
		return createServerFn(void 0, {
			...resolvedOptions,
			...options
		});
	};
	return Object.assign(fun, res);
};
function mergeOptionalSendContext(target, source) {
	return target === void 0 && source === void 0 ? void 0 : safeObjectMerge(target, source);
}
function mergeOptionalHeaders(target, source) {
	return target || source ? mergeHeaders(target, source) : void 0;
}
async function executeMiddleware(middlewares, env, opts) {
	const flattenedMiddlewares = flattenMiddlewares((getStartOptions()?.functionMiddleware || []).concat(middlewares), void 0, env === "server" ? new Set(getStartContextServerOnly({ throwIfNotFound: false })?.executedRequestMiddlewares) : void 0);
	let index = 0;
	const callNextMiddleware = async (callerCtx, userCtx) => {
		let ctx = callerCtx;
		if (userCtx !== void 0) {
			ctx = {
				...callerCtx,
				...userCtx
			};
			ctx.context = safeObjectMerge(callerCtx.context, userCtx.context);
			ctx.sendContext = mergeOptionalSendContext(callerCtx.sendContext, userCtx.sendContext);
			ctx.headers = mergeOptionalHeaders(callerCtx.headers, userCtx.headers);
			ctx._callSiteFetch = callerCtx._callSiteFetch;
			ctx.fetch = callerCtx._callSiteFetch ?? userCtx.fetch ?? callerCtx.fetch;
			ctx.result = userCtx.result !== void 0 ? userCtx.result : userCtx instanceof Response ? userCtx : callerCtx.result;
		}
		let result = ctx;
		while (index < flattenedMiddlewares.length) {
			const options = flattenedMiddlewares[index++].options;
			const validator = options.validator;
			if (validator && env === "server") ctx.data = await execValidator(validator, ctx.data);
			const middlewareFn = env === "client" ? options.client : options.server;
			if (middlewareFn) {
				result = await middlewareFn({
					...ctx,
					next: (nextCtx = {}) => callNextMiddleware(ctx, nextCtx)
				});
				if (result instanceof Response) {
					if (isRedirect(result)) throw result;
					result = {
						...ctx,
						result
					};
				} else if (!result) throw new Error("User middleware returned undefined. You must call next() or return a result in your middlewares.");
				break;
			}
		}
		if ("error" in result) throw result.error;
		return result;
	};
	const initialCtx = {
		...opts,
		headers: opts.headers || (env === "client" ? {} : void 0),
		sendContext: opts.sendContext,
		context: opts.context || createNullProtoObject(),
		_callSiteFetch: opts.fetch
	};
	if (initialCtx.sendContext !== void 0) initialCtx.sendContext ||= {};
	try {
		return await callNextMiddleware(initialCtx);
	} catch (error) {
		return {
			...initialCtx,
			error
		};
	}
}
function flattenMiddlewares(middlewares, maxDepth = 100, seen = /* @__PURE__ */ new Set()) {
	const flattened = [];
	const recurse = (middleware, depth) => {
		if (depth > maxDepth) throw new Error(`Middleware nesting depth exceeded maximum of ${maxDepth}. Check for circular references.`);
		middleware.forEach((m) => {
			if (m.options.middleware) recurse(m.options.middleware, depth + 1);
			if (!seen.has(m)) {
				seen.add(m);
				flattened.push(m);
			}
		});
	};
	recurse(middlewares, 0);
	return flattened;
}
async function execValidator(validator, input) {
	if (validator == null) return {};
	if ("~standard" in validator) {
		const result = await validator["~standard"].validate(input);
		if (result.issues) throw new Error(JSON.stringify(result.issues, void 0, 2));
		return result.value;
	}
	if ("parse" in validator) return validator.parse(input);
	if (typeof validator === "function") return validator(input);
	throw new Error("Invalid validator type!");
}
function serverFnBaseToMiddleware(options) {
	return {
		"~types": void 0,
		options: {
			validator: options.validator,
			client: async ({ next, sendContext, fetch, ...ctx }) => {
				const payload = {
					...ctx,
					context: sendContext,
					fetch
				};
				return next(await options.extractedFn?.(payload));
			},
			server: async ({ next: _next, ...ctx }) => {
				const result = await options.serverFn?.(ctx);
				return {
					...ctx,
					result
				};
			}
		}
	};
}
//#endregion
export { TSS_SERVER_FUNCTION as a, createNullProtoObject as c, getStartContext as d, getStartOptions as f, TSS_FORMDATA_CONTEXT as i, createServerFn as l, safeObjectMerge as m, MAX_FRAME_PAYLOAD_SIZE as n, X_TSS_RAW_RESPONSE as o, runWithStartContext as p, TSS_CONTENT_TYPE_FRAMED_VERSIONED as r, X_TSS_SERIALIZED as s, MAX_FRAMED_STREAMS as t, flattenMiddlewares as u };
