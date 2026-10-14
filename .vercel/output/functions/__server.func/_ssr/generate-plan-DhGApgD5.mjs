import { l as createServerFn } from "./createServerFn-BPR289oA.mjs";
import { t as buildPlan } from "./trip-plan-DIsKoQ71.mjs";
import { a as numberType, c as stringType, n as arrayType, o as objectType, t as anyType } from "../_libs/zod.mjs";
import { t as GoogleGenAI } from "../_libs/@google/genai.mjs";
import { c as getRequestIP, s as getRequestHeader } from "./internal-request-response-CURC4f5o.mjs";
import { i as getSupabaseServerClient, r as getServerUser } from "./ssr.mjs";
import { a as getCachedPlan, c as isCircuitBreakerActive, d as tripCircuitBreaker, i as generatePlanCacheKey, l as isGlobalDailyQuotaNear, n as checkRateLimit, o as incrementDailyQuota, r as createServerRpc, s as incrementGlobalDailyCount, t as checkDailyQuota, u as setCachedPlan } from "./rate-limiter-IgkJH91V.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/generate-plan-DhGApgD5.js
var generatedPlanSchema = objectType({
	title: stringType().min(1),
	budget: numberType().positive(),
	summary: stringType().min(1),
	days: arrayType(objectType({
		day: stringType(),
		title: stringType(),
		items: arrayType(stringType()).min(1)
	})).min(1),
	stays: arrayType(stringType()).min(1),
	transport: stringType().min(1),
	food: arrayType(stringType()).min(1),
	weather: stringType().min(1),
	packing: arrayType(stringType()).min(1),
	tips: arrayType(stringType()).min(1),
	travelers: numberType().int().positive(),
	nights: numberType().int().nonnegative(),
	breakdown: arrayType(objectType({
		label: stringType(),
		amount: numberType().nonnegative()
	})).min(1),
	carbonKg: numberType().nonnegative()
});
var generatePlanInputSchema = objectType({
	prompt: stringType().min(1).max(1e3),
	destination: stringType().max(100).optional(),
	interests: arrayType(stringType().max(50)).max(10).optional(),
	budget: numberType().int().positive().max(1e7).optional(),
	travelers: numberType().int().positive().max(50).optional(),
	days: numberType().int().positive().max(30).optional(),
	instruction: stringType().max(500).optional(),
	currentPlan: anyType().optional()
});
var sharedPlansMemoryStore = /* @__PURE__ */ new Map();
function extractTripContext(prompt) {
	const p = prompt.toLowerCase();
	const destMatch = p.match(/(?:to|in|for|visit|exploring)\s+([a-zA-Z\s]+?)(?:\s+(?:for|under|with|in|\d|$))/i);
	let destination = destMatch ? destMatch[1]?.trim() : "";
	if (!destination || destination.length < 3) if (/himachal/i.test(p)) destination = "Himachal Pradesh";
	else if (/goa/i.test(p)) destination = "Goa";
	else if (/kashmir/i.test(p)) destination = "Kashmir";
	else if (/kerala/i.test(p)) destination = "Kerala";
	else if (/ladakh/i.test(p)) destination = "Ladakh";
	else if (/japan/i.test(p)) destination = "Japan";
	else if (/bali/i.test(p)) destination = "Bali";
	else if (/dubai/i.test(p)) destination = "Dubai";
	else destination = "Requested destination";
	const interests = [];
	if (/adventure|trek|hike|rafting|scuba|camp/i.test(p)) interests.push("Adventure & Outdoor activities");
	if (/beach|sea|coast|relax|sunset/i.test(p)) interests.push("Beaches & Coastal relaxation");
	if (/food|cafe|cuisine|street food|eat|culinary/i.test(p)) interests.push("Local Cuisine & Street Food");
	if (/temple|heritage|culture|history|monument|fort/i.test(p)) interests.push("Culture, Heritage & Architecture");
	if (/nature|wildlife|safari|mountain|snow|scenic/i.test(p)) interests.push("Nature & Mountain Landscapes");
	if (/shopping|market|bazaar/i.test(p)) interests.push("Local Bazaars & Shopping");
	if (interests.length === 0) interests.push("Iconic Highlights & Local Experiences");
	return {
		destination,
		interests
	};
}
function buildGeminiPrompt(prompt, opts) {
	const extracted = extractTripContext(prompt);
	const destination = opts.destination || extracted.destination;
	const interests = opts.interests && opts.interests.length > 0 ? opts.interests : extracted.interests;
	const budget = opts.budget ? `₹${opts.budget.toLocaleString("en-IN")}` : "Extract from prompt or default to ₹35,000 INR";
	return `You are SmartTrip's elite AI travel planner. Create an authentic, highly detailed, realistic travel itinerary.

TRAVELER INQUIRY:
"${prompt}"

TRIP SPECIFICATIONS:
- Destination: ${destination}
- Duration: ${opts.days ?? "Extract from prompt or default to 5"} days
- Travelers: ${opts.travelers ?? "Extract from prompt or default to 2"} people
- Budget: ${budget} (in Indian Rupees - INR)
- Interests & Preferences: ${interests.join(", ")}
${opts.instruction ? `\nUSER REFINEMENT INSTRUCTION: "${opts.instruction}"` : ""}
${opts.currentPlan ? `\nBASE ITINERARY TO REFINE:\n${JSON.stringify(opts.currentPlan)}` : ""}

STRICT REQUIREMENTS & RULES:
1. Real Attractions & Authentic Sights: Recommend real, verified attractions, viewpoints, and scenic stops with logical daily pacing.
2. Local Food: Recommend authentic local food specialties, regional cuisines, and genuine eateries or dish names.
3. Realistic INR Prices: All estimated costs for stays, transport, food, and activities must reflect realistic current Indian Rupee (INR) rates.
4. Budget Breakdown Sum Rule: The 'breakdown' array MUST include categories (e.g. Transport, Stays, Food, Activities, Sightseeing & Entry, Buffer) whose amounts SUM EXACTLY TO THE TOTAL BUDGET (${opts.budget ?? 35e3}). Every category amount must be non-negative.
5. Season-Appropriate Weather & Packing Advice: Provide realistic weather conditions with Celsius temperature ranges for the destination's current travel season, plus practical, destination-appropriate packing advice.
6. Carbon Footprint: Estimate the round-trip carbon footprint (carbonKg) in kg CO2e per traveler based on travel modes.
7. Return strictly valid structured JSON matching the defined schema.`;
}
function normalizePlan(plan) {
	if (!plan.breakdown || plan.breakdown.length === 0) {
		plan.breakdown = [
			{
				label: "Stays & Hotels",
				amount: Math.round(plan.budget * .4)
			},
			{
				label: "Transport & Travel",
				amount: Math.round(plan.budget * .25)
			},
			{
				label: "Food & Dining",
				amount: Math.round(plan.budget * .2)
			},
			{
				label: "Activities & Buffer",
				amount: Math.max(0, plan.budget - (Math.round(plan.budget * .4) + Math.round(plan.budget * .25) + Math.round(plan.budget * .2)))
			}
		];
		return plan;
	}
	const sumBreakdown = plan.breakdown.reduce((sum, item) => sum + item.amount, 0);
	if (sumBreakdown !== plan.budget) {
		const diff = plan.budget - sumBreakdown;
		const lastIndex = plan.breakdown.length - 1;
		const lastItem = plan.breakdown[lastIndex];
		if (lastItem && lastItem.amount + diff >= 0) lastItem.amount += diff;
		else {
			let runningSum = 0;
			for (let i = 0; i < plan.breakdown.length; i++) {
				const item = plan.breakdown[i];
				if (i === lastIndex) item.amount = Math.max(0, plan.budget - runningSum);
				else {
					item.amount = Math.round(item.amount / (sumBreakdown || 1) * plan.budget);
					runningSum += item.amount;
				}
			}
		}
	}
	return plan;
}
async function callGeminiApi(promptText, apiKey) {
	const text = (await new GoogleGenAI({ apiKey }).models.generateContent({
		model: "gemini-2.5-flash",
		contents: promptText,
		config: {
			responseMimeType: "application/json",
			responseSchema: {
				type: "object",
				properties: {
					title: { type: "string" },
					budget: { type: "number" },
					summary: { type: "string" },
					days: {
						type: "array",
						items: {
							type: "object",
							properties: {
								day: { type: "string" },
								title: { type: "string" },
								items: {
									type: "array",
									items: { type: "string" }
								}
							},
							required: [
								"day",
								"title",
								"items"
							]
						}
					},
					stays: {
						type: "array",
						items: { type: "string" }
					},
					transport: { type: "string" },
					food: {
						type: "array",
						items: { type: "string" }
					},
					weather: { type: "string" },
					packing: {
						type: "array",
						items: { type: "string" }
					},
					tips: {
						type: "array",
						items: { type: "string" }
					},
					travelers: { type: "number" },
					nights: { type: "number" },
					breakdown: {
						type: "array",
						items: {
							type: "object",
							properties: {
								label: { type: "string" },
								amount: { type: "number" }
							},
							required: ["label", "amount"]
						}
					},
					carbonKg: { type: "number" }
				},
				required: [
					"title",
					"budget",
					"summary",
					"days",
					"stays",
					"transport",
					"food",
					"weather",
					"packing",
					"tips",
					"travelers",
					"nights",
					"breakdown",
					"carbonKg"
				]
			}
		}
	})).text;
	if (!text) throw new Error("Empty response from Gemini API");
	return JSON.parse(text);
}
async function executeGeneratePlan(input, options) {
	const identifier = options?.identifier ?? "guest";
	const isGuest = identifier.startsWith("ip:") || identifier === "guest" || identifier === "anon";
	if (!checkRateLimit(identifier, 25, 6e5).allowed) throw new Error("Rate limit exceeded. Please wait a few moments before generating more plans.");
	const cacheKey = generatePlanCacheKey(input);
	const cachedPlan = getCachedPlan(cacheKey);
	if (cachedPlan) return {
		plan: cachedPlan,
		source: "gemini",
		model: "gemini-2.5-flash",
		note: "Served from server plan cache (0 API quota used)."
	};
	const apiKey = options?.apiKey !== void 0 ? options.apiKey : (typeof process !== "undefined" ? process.env?.["GEMINI_API_KEY"] : void 0) || "";
	const getFallbackPlan = () => buildPlan(input.prompt, {
		budget: input.budget,
		travelers: input.travelers,
		days: input.days
	});
	if (!apiKey) return {
		plan: getFallbackPlan(),
		source: "fallback",
		note: "Built using offline fallback engine (GEMINI_API_KEY not configured)."
	};
	if (isGlobalDailyQuotaNear()) {
		console.warn("Global daily Gemini quota safety threshold reached (1000 calls). Falling back to buildPlan().");
		return {
			plan: getFallbackPlan(),
			source: "fallback",
			note: "Global daily AI limit approached. Generated instantly via offline SmartTrip engine."
		};
	}
	if (isCircuitBreakerActive()) {
		console.warn("AI service circuit breaker is active. Falling back to buildPlan().");
		return {
			plan: getFallbackPlan(),
			source: "fallback",
			note: "AI service temporarily rate limited. Generated using offline SmartTrip engine."
		};
	}
	const dailyQuota = checkDailyQuota(identifier, isGuest);
	if (!dailyQuota.allowed) return {
		plan: getFallbackPlan(),
		source: "fallback",
		note: isGuest ? `Daily guest plan allowance reached (${dailyQuota.limit}/day). Sign in for more generations, or continue using our offline engine.` : `Daily plan generation allowance reached for your account (${dailyQuota.limit}/day). Generated using offline SmartTrip engine.`
	};
	const promptText = buildGeminiPrompt(input.prompt, {
		destination: input.destination,
		interests: input.interests,
		budget: input.budget,
		travelers: input.travelers,
		days: input.days,
		instruction: input.instruction,
		currentPlan: input.currentPlan
	});
	let validatedPlan = null;
	let attempts = 0;
	const maxAttempts = 2;
	let encountered429 = false;
	while (attempts < maxAttempts && !validatedPlan) {
		attempts++;
		try {
			const rawJson = await callGeminiApi(promptText, apiKey);
			validatedPlan = normalizePlan(generatedPlanSchema.parse(rawJson));
		} catch (err) {
			const errString = err instanceof Error ? err.message : String(err);
			console.warn(`Gemini API attempt ${attempts} failed:`, errString);
			if (/429|resource_exhausted|quota|rate limit|too many requests/i.test(errString)) {
				encountered429 = true;
				tripCircuitBreaker(6e4);
				break;
			}
			if (attempts >= maxAttempts) break;
		}
	}
	if (encountered429) {
		console.warn("Gemini returned 429 Rate Limit. Seamlessly falling back to buildPlan().");
		return {
			plan: getFallbackPlan(),
			source: "fallback",
			note: "AI service rate limit reached (HTTP 429). Seamlessly generated using offline SmartTrip engine."
		};
	}
	if (!validatedPlan) {
		console.warn("All Gemini generation attempts failed. Falling back to buildPlan().");
		return {
			plan: getFallbackPlan(),
			source: "fallback",
			note: "Gemini response validation failed; fallback applied."
		};
	}
	incrementDailyQuota(identifier);
	incrementGlobalDailyCount();
	setCachedPlan(cacheKey, validatedPlan);
	return {
		plan: validatedPlan,
		source: "gemini",
		model: "gemini-2.5-flash"
	};
}
var generatePlan_createServerFn_handler = createServerRpc({
	id: "ae9ccfcf641621dbc69489b3905ed62f4f4977ba9ef9328eafe65a133c2c2a6a",
	name: "generatePlan",
	filename: "src/server/generate-plan.ts"
}, (opts) => generatePlan.__executeServer(opts));
var generatePlan = createServerFn({ method: "POST" }).validator((data) => generatePlanInputSchema.parse(data)).handler(generatePlan_createServerFn_handler, async ({ data: input }) => {
	let identifier = "guest";
	try {
		const user = await getServerUser();
		if (user?.id) identifier = `user:${user.id}`;
		else identifier = `ip:${getRequestIP({ xForwardedFor: true }) || getRequestHeader("x-forwarded-for") || "client-ip"}`;
	} catch {
		identifier = "anon";
	}
	return executeGeneratePlan(input, { identifier });
});
var savePublicPlanSchema = objectType({ plan: generatedPlanSchema });
var savePublicPlanFn_createServerFn_handler = createServerRpc({
	id: "0a25320a320eed2716fda0d3117061fb3e99553cd928d9021be967c58c2d1770",
	name: "savePublicPlanFn",
	filename: "src/server/generate-plan.ts"
}, (opts) => savePublicPlanFn.__executeServer(opts));
var savePublicPlanFn = createServerFn({ method: "POST" }).validator((data) => savePublicPlanSchema.parse(data)).handler(savePublicPlanFn_createServerFn_handler, async ({ data: { plan } }) => {
	const planId = `plan-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
	sharedPlansMemoryStore.set(planId, plan);
	try {
		const user = await getServerUser();
		await getSupabaseServerClient().from("shared_plans").insert({
			id: planId,
			user_id: user?.id ?? null,
			plan,
			title: plan.title,
			destination: plan.title.replace(/ · smart plan$/, ""),
			budget: plan.budget
		});
	} catch (e) {
		console.warn("Could not save shared plan to database:", e);
	}
	return { id: planId };
});
var getPublicPlanSchema = objectType({ id: stringType().min(1) });
var getPublicPlanFn_createServerFn_handler = createServerRpc({
	id: "90d3678b49a02688598849a626afb3c155b22bbcb028460795509fe7ae827ad4",
	name: "getPublicPlanFn",
	filename: "src/server/generate-plan.ts"
}, (opts) => getPublicPlanFn.__executeServer(opts));
var getPublicPlanFn = createServerFn({ method: "GET" }).validator((data) => getPublicPlanSchema.parse(data)).handler(getPublicPlanFn_createServerFn_handler, async ({ data: { id: planId } }) => {
	if (sharedPlansMemoryStore.has(planId)) return sharedPlansMemoryStore.get(planId) ?? null;
	try {
		const { data, error } = await getSupabaseServerClient().from("shared_plans").select("plan").eq("id", planId).maybeSingle();
		if (!error && data?.plan) {
			const plan = data.plan;
			sharedPlansMemoryStore.set(planId, plan);
			return plan;
		}
	} catch {}
	return null;
});
//#endregion
export { generatePlan_createServerFn_handler, getPublicPlanFn_createServerFn_handler, savePublicPlanFn_createServerFn_handler };
