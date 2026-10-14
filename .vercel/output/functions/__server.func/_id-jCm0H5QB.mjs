import { g as createFileRoute, h as lazyRouteComponent } from "./_libs/@tanstack/react-router+[...].mjs";
import { t as createSeoHead } from "./_ssr/seo-BqVdh5S9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-jCm0H5QB.js
var $$splitComponentImporter = () => import("./_id-BPCfYJdU.mjs");
var Route = createFileRoute("/booking-confirmation/$id")({
	head: ({ params }) => createSeoHead({
		title: `Booking #${params.id} Confirmed`,
		description: "View your confirmed reservation and download your demo E-ticket.",
		path: `/booking-confirmation/${params.id}`,
		noindex: true
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
