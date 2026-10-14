import { y as require_jsx_runtime } from "./_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./_ssr/button-BSij73O2.mjs";
import { c as inr, r as destinations } from "./_ssr/travel-Co-Z1Moz.mjs";
import { v as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { u as smartTrip } from "./_ssr/smarttrip-store-B4h7bmlO.mjs";
import { Tt as Compass, Yt as BookmarkPlus, a as WandSparkles, at as Leaf, bt as Download, k as Share2, x as Sparkles } from "./_libs/lucide-react.mjs";
import { f as Navbar, u as Footer } from "./_ssr/Navbar-G5xs2vbg.mjs";
import { t as WeatherForecastCard } from "./_ssr/WeatherForecastCard-DeJ-6vWi.mjs";
import { t as Route } from "./_id-2kz4DXw_.mjs";
import { t as QuickTravelGuide } from "./_ssr/QuickTravelGuide-BYUN7MIW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-DJE52hha2.js
var import_jsx_runtime = require_jsx_runtime();
function PublicPlanPage() {
	const { plan, id } = Route.useLoaderData();
	if (!plan) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
							children: "Plan Not Found"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground mb-6",
							children: "This shared itinerary link may have expired or is invalid."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "hero",
							asChild: true,
							className: "rounded-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/ai-planner",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "size-4 mr-2" }), " Plan a New Trip"]
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
	const handleCopyLink = async () => {
		try {
			await navigator.clipboard.writeText(window.location.href);
			toast.success("Share link copied to clipboard!");
		} catch {
			toast.info("Link: " + window.location.href);
		}
	};
	const handleSaveToMyTrips = () => {
		smartTrip.savePlan(plan);
		toast.success("Itinerary saved to My Trips!", { description: "You can find this plan in your dashboard anytime." });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col bg-background selection:bg-primary/20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "container-page flex-1 py-28 print:py-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card max-w-4xl mx-auto p-6 sm:p-10 rounded-3xl shadow-elevated print:shadow-none print:p-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }), " Shared Itinerary"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "font-display text-2xl sm:text-3xl font-bold capitalize text-foreground",
									children: plan.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted-foreground mt-1",
									children: [
										plan.days.length,
										" Days · ",
										plan.travelers,
										" Traveler",
										plan.travelers > 1 ? "s" : ""
									]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-xs font-semibold text-muted-foreground uppercase",
									children: "Estimated Budget"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-2xl font-bold text-primary",
									children: inr(plan.budget)
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 text-sm text-muted-foreground leading-relaxed",
							children: plan.summary
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "my-6 flex flex-wrap gap-2.5 print:hidden",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "hero",
									size: "sm",
									onClick: handleSaveToMyTrips,
									className: "rounded-full shadow-soft",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookmarkPlus, { className: "size-4 mr-1.5" }), " Save to My Trips"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									onClick: handleCopyLink,
									className: "rounded-full",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-4 mr-1.5" }), " Copy Link"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => window.print(),
									className: "rounded-full",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4 mr-1.5" }), " Print / PDF"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "soft",
									size: "sm",
									asChild: true,
									className: "rounded-full ml-auto",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/ai-planner",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "size-4 mr-1.5" }), " Customize with AI"]
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-lg font-bold text-foreground mb-4",
								children: "Day-by-Day Itinerary"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
								className: "space-y-4 border-l border-dashed border-border/80 pl-6 ml-2",
								children: plan.days.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "relative",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -left-[31px] top-1.5 size-3 rounded-full bg-gradient-brand shadow-soft" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-display text-base font-semibold text-foreground",
											children: [
												d.day,
												" — ",
												d.title
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
											className: "mt-2 space-y-1 text-sm text-muted-foreground",
											children: d.items.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "flex items-start gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-primary mt-1",
													children: "•"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item })]
											}, idx))
										})
									]
								}, d.day))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-10 grid gap-4 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-border bg-card/50 p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold uppercase text-muted-foreground mb-2",
										children: "🏨 Stays & Lodging"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "space-y-1 text-sm text-foreground/80",
										children: plan.stays.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: s }, i))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-border bg-card/50 p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold uppercase text-muted-foreground mb-2",
										children: "🚆 Transport & Movement"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-foreground/80",
										children: plan.transport
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-border bg-card/50 p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold uppercase text-muted-foreground mb-2",
										children: "🍽 Food Recommendations"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "space-y-1 text-sm text-foreground/80",
										children: plan.food.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: f }, i))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-border bg-card/50 p-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold uppercase text-muted-foreground mb-2",
											children: "🌤 Weather & Packing"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-foreground/80 mb-2",
											children: plan.weather
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold text-foreground/80",
													children: "Pack:"
												}),
												" ",
												plan.packing.join(" · ")
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-border bg-card/50 p-4 sm:col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold uppercase text-muted-foreground mb-2",
										children: "💰 Budget Breakdown"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-2 sm:grid-cols-5 gap-2 text-sm",
										children: plan.breakdown.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "bg-secondary/40 p-2.5 rounded-xl",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: b.label
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold text-foreground mt-0.5",
												children: inr(b.amount)
											})]
										}, b.label))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-border bg-card/50 p-4 sm:col-span-2 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-xs text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, { className: "size-4 text-leaf" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Estimated carbon footprint:" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-semibold text-foreground",
												children: [
													"~",
													plan.carbonKg,
													" kg CO2e"
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "round trip per person" })
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[11px] text-muted-foreground",
										children: ["ID: ", id]
									})]
								})
							]
						}),
						(() => {
							const matchedDest = destinations.find((d) => plan.title.toLowerCase().includes(d.name.toLowerCase()) || plan.summary.toLowerCase().includes(d.name.toLowerCase()));
							const planLat = matchedDest ? matchedDest.lat : 28.6139;
							const planLng = matchedDest ? matchedDest.lng : 77.209;
							const destName = matchedDest ? matchedDest.name : plan.title.replace(/ trip plan/i, "").slice(0, 20);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-10 print:hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeatherForecastCard, {
									lat: planLat,
									lng: planLng,
									destinationName: destName,
									bestTimeToVisit: matchedDest?.bestTimeToVisit,
									basePrice: plan.budget
								})
							});
						})(),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-12 pt-8 border-t border-border/60 print:hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickTravelGuide, { compact: true })
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { PublicPlanPage as component };
