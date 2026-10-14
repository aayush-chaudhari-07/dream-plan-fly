import { r as destinations } from "./_ssr/travel-Co-Z1Moz.mjs";
import { g as createFileRoute, h as lazyRouteComponent } from "./_libs/@tanstack/react-router+[...].mjs";
import { t as createSeoHead } from "./_ssr/seo-BqVdh5S9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-BlZT7-ll.js
var $$splitComponentImporter = () => import("./_id-Cnp0ZAbK.mjs");
var Route = createFileRoute("/destination/$id")({
	loader: ({ params }) => {
		return {
			destination: destinations.find((d) => d.id === params.id) || null,
			id: params.id
		};
	},
	head: ({ loaderData }) => {
		const dest = loaderData?.destination;
		const title = dest ? `${dest.name}, ${dest.region} Travel Guide` : "Destination";
		const description = dest?.blurb || "Explore travel destinations, weather forecasts, curated itineraries and local sights on SmartTrip.";
		const jsonLd = dest ? {
			"@context": "https://schema.org",
			"@type": "TouristDestination",
			name: dest.name,
			description: dest.blurb,
			image: dest.image,
			touristType: dest.category,
			geo: {
				"@type": "GeoCoordinates",
				latitude: dest.lat,
				longitude: dest.lng
			},
			address: {
				"@type": "PostalAddress",
				addressRegion: dest.region,
				addressCountry: "IN"
			},
			includesAttraction: {
				"@type": "TouristAttraction",
				name: `${dest.name} Highlights`,
				description: `Best time to visit: ${dest.bestTimeToVisit}. Daily starting rates from ₹${dest.price.toLocaleString("en-IN")}.`
			}
		} : void 0;
		return createSeoHead({
			title,
			description,
			path: dest ? `/destination/${dest.id}` : "/destination",
			image: dest?.image,
			jsonLd
		});
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
