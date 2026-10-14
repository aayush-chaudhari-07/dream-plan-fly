import { g as createFileRoute, h as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as createSeoHead } from "./seo-BqVdh5S9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-CErOULlG.js
var $$splitComponentImporter = () => import("./login-CQO4JKBR.mjs");
var Route = createFileRoute("/login")({
	validateSearch: (search) => ({ redirect: typeof search["redirect"] === "string" ? search["redirect"] : void 0 }),
	head: () => createSeoHead({
		title: "Sign In",
		description: "Sign in to access your cloud-synced trips, bookings, and funds on SmartTrip.",
		path: "/login"
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
