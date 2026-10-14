import { g as createFileRoute, h as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as stringType, i as enumType, o as objectType, r as coerce } from "../_libs/zod.mjs";
import { t as createSeoHead } from "./seo-BqVdh5S9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bookings-4Fhqrkk9.js
var $$splitComponentImporter = () => import("./bookings-NwVobnor.mjs");
var bookingsSearchSchema = objectType({
	tab: enumType([
		"flights",
		"stay",
		"rental",
		"rail",
		"packages"
	]).optional(),
	origin: stringType().optional(),
	destination: stringType().optional(),
	date: stringType().optional(),
	travelers: coerce.number().optional(),
	cabinClass: enumType([
		"economy",
		"premium_economy",
		"business",
		"first"
	]).optional()
});
var Route = createFileRoute("/bookings")({
	validateSearch: (search) => bookingsSearchSchema.parse(search),
	head: () => createSeoHead({
		title: "Book Flights, Hotels, Rentals & Rail",
		description: "Search real Indian routes, compare airline fares, view verified hotels and reserve travel tickets in our demo booking engine.",
		path: "/bookings"
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
