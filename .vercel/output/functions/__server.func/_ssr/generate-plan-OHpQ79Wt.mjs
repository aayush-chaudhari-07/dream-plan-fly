import { l as createServerFn } from "./createServerFn-BPR289oA.mjs";
import { a as numberType, c as stringType, n as arrayType, o as objectType, t as anyType } from "../_libs/zod.mjs";
import { n as createSsrRpc } from "./smarttrip-store-B4h7bmlO.mjs";
import "../_libs/@google/genai.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/generate-plan-OHpQ79Wt.js
objectType({
	time: stringType().optional(),
	activity: stringType().optional(),
	cost: stringType().optional()
});
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
var generatePlan = createServerFn({ method: "POST" }).validator((data) => generatePlanInputSchema.parse(data)).handler(createSsrRpc("ae9ccfcf641621dbc69489b3905ed62f4f4977ba9ef9328eafe65a133c2c2a6a"));
var savePublicPlanSchema = objectType({ plan: generatedPlanSchema });
var savePublicPlanFn = createServerFn({ method: "POST" }).validator((data) => savePublicPlanSchema.parse(data)).handler(createSsrRpc("0a25320a320eed2716fda0d3117061fb3e99553cd928d9021be967c58c2d1770"));
var getPublicPlanSchema = objectType({ id: stringType().min(1) });
var getPublicPlanFn = createServerFn({ method: "GET" }).validator((data) => getPublicPlanSchema.parse(data)).handler(createSsrRpc("90d3678b49a02688598849a626afb3c155b22bbcb028460795509fe7ae827ad4"));
//#endregion
export { getPublicPlanFn as n, savePublicPlanFn as r, generatePlan as t };
