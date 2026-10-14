import { g as createFileRoute, h as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as createSeoHead } from "./seo-BqVdh5S9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/signup-DnrbfFhD.js
var $$splitComponentImporter = () => import("./signup-UvYd56bw.mjs");
var Route = createFileRoute("/signup")({
	validateSearch: (search) => ({ redirect: typeof search["redirect"] === "string" ? search["redirect"] : void 0 }),
	head: () => createSeoHead({
		title: "Create Account",
		description: "Join SmartTrip to generate AI itineraries, save trips, and track travel funds.",
		path: "/signup"
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
