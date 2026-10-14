import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as cn, t as Button } from "./button-BSij73O2.mjs";
import { c as inr, n as destinationCategories, r as destinations } from "./travel-Co-Z1Moz.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { h as useSmartTrip, u as smartTrip } from "./smarttrip-store-B4h7bmlO.mjs";
import { n as SectionHeading, t as Reveal } from "./Reveal-YnFTFRXl.mjs";
import { ft as Heart, tn as ArrowRight, y as Star } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ExploreDestinations-B8ceVSzX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DestinationCard({ d, wished, onWish }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "card-hover group relative w-[300px] shrink-0 overflow-hidden rounded-3xl border border-border bg-card shadow-soft sm:w-auto",
		"data-testid": `destination-card-${d.id}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "block relative h-52 overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/destination/$id",
				params: { id: d.id },
				className: "absolute inset-0",
				"aria-label": `Explore ${d.name}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: d.image,
						alt: `${d.name}, ${d.region}`,
						loading: "lazy",
						decoding: "async",
						width: 1024,
						height: 768,
						className: "size-full object-cover transition-transform duration-700 group-hover:scale-110"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-95" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute bottom-3 left-4 text-primary-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-lg font-bold group-hover:underline",
							children: d.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs opacity-85",
							children: d.region
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "absolute right-3 bottom-3 flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 text-xs font-semibold",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3 fill-sunset text-sunset" }),
							" ",
							d.rating
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Add to wishlist",
				"data-testid": `wishlist-toggle-${d.id}`,
				onClick: () => onWish?.(d.id),
				className: "absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-card/85 backdrop-blur transition-transform hover:scale-110 z-10 cursor-pointer",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: cn("size-4", wished ? "fill-destructive text-destructive" : "text-foreground/70") })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "min-h-10 text-sm text-muted-foreground",
				children: d.blurb
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: "from "
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-lg font-bold text-primary",
						children: inr(d.price)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "soft",
					size: "sm",
					asChild: true,
					className: "rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus-visible:opacity-100",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/destination/$id",
						params: { id: d.id },
						children: ["Explore ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3.5" })]
					})
				})]
			})]
		})]
	});
}
function ExploreDestinations({ grid = false }) {
	const [category, setCategory] = (0, import_react.useState)("All");
	const { wishlist } = useSmartTrip();
	const list = (0, import_react.useMemo)(() => category === "All" ? destinations : destinations.filter((d) => d.category === category), [category]);
	const toggleWish = (id) => {
		const added = smartTrip.toggleWish(id);
		toast[added ? "success" : "message"](added ? "Saved to wishlist" : "Removed from wishlist");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "explore",
		className: "container-page py-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				eyebrow: "Explore",
				title: "Explore Your Next Adventure",
				subtitle: "Hand-picked places with real prices, ratings and the honest version of what to expect."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 flex flex-wrap justify-center gap-2",
				children: destinationCategories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setCategory(c),
					className: cn("rounded-full px-4 py-2 text-sm font-medium transition-all duration-300", category === c ? "bg-gradient-brand text-primary-foreground shadow-soft" : "border border-border bg-card hover:border-primary hover:text-primary"),
					children: c
				}, c))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("mt-10", grid ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" : "flex snap-x gap-6 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3"),
				children: list.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: i * 60,
					className: "snap-start",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DestinationCard, {
						d,
						wished: wishlist.includes(d.id),
						onWish: toggleWish
					})
				}, d.id))
			})
		]
	});
}
//#endregion
export { ExploreDestinations as t };
