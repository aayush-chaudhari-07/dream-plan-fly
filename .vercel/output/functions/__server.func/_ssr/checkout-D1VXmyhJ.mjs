import { g as createFileRoute, h as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as stringType, i as enumType, o as objectType, r as coerce } from "../_libs/zod.mjs";
import { t as createSeoHead } from "./seo-BqVdh5S9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout-D1VXmyhJ.js
var $$splitComponentImporter = () => import("./checkout-CqfpZ8bT.mjs");
var checkoutSearchSchema = objectType({
	kind: enumType([
		"flight",
		"stay",
		"rental",
		"rail",
		"package"
	]).optional(),
	title: stringType().optional(),
	subtitle: stringType().optional(),
	price: coerce.number().optional(),
	origin: stringType().optional(),
	destination: stringType().optional(),
	date: stringType().optional(),
	travelers: coerce.number().optional(),
	cabinClass: stringType().optional(),
	inventoryId: stringType().optional()
});
var Route = createFileRoute("/checkout")({
	validateSearch: (search) => checkoutSearchSchema.parse(search),
	head: () => createSeoHead({
		title: "Secure Demo Checkout",
		description: "Simulated zero-cost demo checkout with test payment gateway.",
		path: "/checkout",
		noindex: true
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
