//#region node_modules/.nitro/vite/services/ssr/assets/seo-BqVdh5S9.js
/**
* SEO & Open Graph Metadata Utility
* Standardizes per-route titles, meta descriptions, Open Graph, Twitter cards,
* canonical links, and Schema.org JSON-LD across all pages.
*/
var SITE_URL = "https://dream-plan-fly.vercel.app";
var SITE_NAME = "SmartTrip";
var DEFAULT_OG_IMAGE = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80";
function createSeoHead({ title, description, path = "", image = DEFAULT_OG_IMAGE, type = "website", jsonLd, noindex = false }) {
	const fullTitle = title.includes("SmartTrip") ? title : `${title} — ${SITE_NAME}`;
	const canonicalUrl = `${SITE_URL}${path ? path.startsWith("/") ? path : `/${path}` : ""}`;
	const meta = [
		{ title: fullTitle },
		{
			name: "description",
			content: description
		},
		{
			property: "og:title",
			content: fullTitle
		},
		{
			property: "og:description",
			content: description
		},
		{
			property: "og:url",
			content: canonicalUrl
		},
		{
			property: "og:type",
			content: type
		},
		{
			property: "og:site_name",
			content: SITE_NAME
		},
		{
			property: "og:image",
			content: image
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		},
		{
			name: "twitter:title",
			content: fullTitle
		},
		{
			name: "twitter:description",
			content: description
		},
		{
			name: "twitter:image",
			content: image
		},
		{
			name: "twitter:site",
			content: "@smarttrip"
		}
	];
	if (noindex) meta.push({
		name: "robots",
		content: "noindex, nofollow"
	});
	return {
		meta,
		links: [{
			rel: "canonical",
			href: canonicalUrl
		}],
		scripts: jsonLd ? [{
			type: "application/ld+json",
			children: JSON.stringify(jsonLd)
		}] : []
	};
}
//#endregion
export { createSeoHead as t };
