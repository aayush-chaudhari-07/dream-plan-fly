import { g as createFileRoute, h as lazyRouteComponent } from "./_libs/@tanstack/react-router+[...].mjs";
import { t as createSeoHead } from "./_ssr/seo-BqVdh5S9.mjs";
import { n as getPublicPlanFn } from "./_ssr/generate-plan-OHpQ79Wt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-2kz4DXw_.js
var $$splitComponentImporter = () => import("./_id-DJE52hha2.mjs");
var Route = createFileRoute("/plan/$id")({
	loader: async ({ params }) => {
		try {
			return {
				plan: await getPublicPlanFn({ data: { id: params.id } }),
				id: params.id
			};
		} catch {
			return {
				plan: null,
				id: params.id
			};
		}
	},
	head: ({ loaderData }) => createSeoHead({
		title: loaderData?.plan?.title || "Shared Travel Plan",
		description: loaderData?.plan?.summary || "Explore this detailed day-by-day AI travel itinerary on SmartTrip.",
		path: `/plan/${loaderData?.id || ""}`
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
