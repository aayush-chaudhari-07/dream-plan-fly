import { y as require_jsx_runtime } from "./_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./_ssr/button-BSij73O2.mjs";
import { t as Badge } from "./_ssr/badge-CNWERV3-.mjs";
import { c as inr } from "./_ssr/travel-Co-Z1Moz.mjs";
import { v as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { Tt as Compass, X as MapPin, a as WandSparkles, nn as ArrowLeft, x as Sparkles, y as Star } from "./_libs/lucide-react.mjs";
import { InteractiveMap } from "./_ssr/InteractiveMap-COhZVIgV.mjs";
import { f as Navbar, u as Footer } from "./_ssr/Navbar-G5xs2vbg.mjs";
import { t as SupportDock } from "./_ssr/SupportDock-BQEj3o76.mjs";
import { t as Route } from "./_id-BlZT7-ll.mjs";
import { t as WeatherForecastCard } from "./_ssr/WeatherForecastCard-DeJ-6vWi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-Cnp0ZAbK.js
var import_jsx_runtime = require_jsx_runtime();
function DestinationDetailPage() {
	const { destination } = Route.useLoaderData();
	if (!destination) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col bg-background selection:bg-primary/20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "container-page flex flex-1 items-center justify-center py-24",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card max-w-md p-8 text-center rounded-3xl shadow-elevated",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "size-12 text-muted-foreground mx-auto mb-3" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-xl font-bold text-foreground",
							children: "Destination Not Found"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground mb-6",
							children: "We couldn't locate this destination. Discover our featured travel destinations."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "hero",
							asChild: true,
							className: "rounded-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/explore",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4 mr-2" }), " Explore Destinations"]
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
	const promptSuggestion = `Plan a 5-day trip to ${destination.name} for 2 people under ${inr(destination.price * 3)}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col bg-background selection:bg-primary/20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex-1 pb-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative h-[480px] sm:h-[560px] overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: destination.image,
							alt: `${destination.name}, ${destination.region}`,
							className: "size-full object-cover object-center brightness-90",
							loading: "eager",
							decoding: "async"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-ink/40 to-ink/20" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "container-page absolute top-28 left-0 right-0 z-20",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/explore",
								className: "inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 hover:text-white bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-3.5" }), " Back to Explore"]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "container-page absolute bottom-10 left-0 right-0 z-20",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "max-w-3xl",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-2 mb-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												className: "bg-primary text-primary-foreground border-0 text-xs px-3 py-1 font-semibold",
												children: destination.category
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-1 rounded-full bg-card/90 backdrop-blur px-3 py-1 text-xs font-bold text-foreground",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3.5 fill-sunset text-sunset" }),
													" ",
													destination.rating
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "rounded-full bg-card/90 backdrop-blur px-3 py-1 text-xs font-bold text-foreground",
												children: ["Starts at ", inr(destination.price)]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight",
										children: destination.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-2 text-base sm:text-lg text-white/90 flex items-center gap-1.5 font-medium",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-4 text-primary shrink-0" }),
											" ",
											destination.region
										]
									})
								]
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "container-page mt-8 space-y-12",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeatherForecastCard, {
							lat: destination.lat,
							lng: destination.lng,
							destinationName: destination.name,
							bestTimeToVisit: destination.bestTimeToVisit,
							basePrice: destination.price
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "surface-card p-6 sm:p-8 rounded-3xl border border-border shadow-soft",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "font-display text-xl sm:text-2xl font-bold text-foreground",
									children: ["About ", destination.name]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed",
									children: destination.description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-6 pt-6 border-t border-border/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3",
										children: "Signature Experiences & Highlights"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid gap-2.5 sm:grid-cols-2",
										children: destination.highlights.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2.5 rounded-2xl border border-border/70 bg-card p-3 text-xs sm:text-sm font-medium text-foreground shadow-2xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: h })]
										}, h))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-8 flex flex-wrap items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "hero",
										size: "lg",
										asChild: true,
										className: "rounded-full gap-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/ai-planner",
											search: { q: promptSuggestion },
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "size-4" }), " Plan AI Itinerary"]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										size: "lg",
										asChild: true,
										className: "rounded-full gap-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/bookings",
											children: "Book Hotels & Transport"
										})
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs font-semibold tracking-wide text-primary uppercase",
									children: ["Explore Around ", destination.name]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-2xl font-bold text-foreground",
									children: "Interactive Sights & Stays Map"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: "Click pins to explore verified viewpoint stops, local cafes, boutique hotels, and outdoor adventures."
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InteractiveMap, {
								initialDestinationId: destination.id,
								compact: true,
								showHeading: false
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupportDock, {})
		]
	});
}
//#endregion
export { DestinationDetailPage as component };
