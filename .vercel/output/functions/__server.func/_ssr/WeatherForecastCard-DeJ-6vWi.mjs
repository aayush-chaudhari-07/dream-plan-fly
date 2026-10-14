import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-BSij73O2.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as getWeatherForecastFn, t as createPriceAlertFn, u as smartTrip } from "./smarttrip-store-B4h7bmlO.mjs";
import { Dt as CloudSun, I as Radio, Ot as CloudRain, Qt as BellRing, S as Snowflake, Wt as CalendarDays, _ as Sun, ct as Info, i as Wind, kt as CloudLightning, x as Sparkles, yt as Droplets } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/WeatherForecastCard-DeJ-6vWi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function getWeatherIcon(code) {
	if (code === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-5 text-amber-500" });
	if (code <= 3) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudSun, { className: "size-5 text-sky-500" });
	if (code >= 71 && code <= 77) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Snowflake, { className: "size-5 text-blue-300" });
	if (code >= 95) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudLightning, { className: "size-5 text-purple-500" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudRain, { className: "size-5 text-sky-600" });
}
function WeatherForecastCard({ lat, lng, destinationName, bestTimeToVisit, basePrice = 12e3 }) {
	const [data, setData] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [isAlertModalOpen, setIsAlertModalOpen] = (0, import_react.useState)(false);
	const [targetPrice, setTargetPrice] = (0, import_react.useState)(Math.round(basePrice * .9));
	const [isWatching, setIsWatching] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let active = true;
		getWeatherForecastFn({ data: {
			lat,
			lng
		} }).then((res) => {
			if (active) {
				setData(res);
				setLoading(false);
			}
		}).catch((err) => {
			console.warn("Failed to fetch weather forecast:", err);
			if (active) setLoading(false);
		});
		return () => {
			active = false;
		};
	}, [lat, lng]);
	const handleCreateAlert = async () => {
		try {
			smartTrip.addPriceAlert({
				itemType: "stay",
				itemId: destinationName.toLowerCase(),
				title: `${destinationName} Trips & Stays`,
				targetPrice,
				basePrice
			});
			await createPriceAlertFn({ data: {
				itemType: "stay",
				itemId: destinationName.toLowerCase(),
				title: `${destinationName} Trips & Stays`,
				targetPrice,
				basePrice
			} });
			setIsWatching(true);
			setIsAlertModalOpen(false);
			toast.success("Price alert activated!", { description: `We'll notify you when trips to ${destinationName} drop to ₹${targetPrice.toLocaleString("en-IN")}.` });
		} catch {
			toast.error("Could not activate price alert.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-5 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-6 rounded-3xl border border-border shadow-soft relative overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "size-11 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudSun, { className: "size-6" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
									children: ["Live Weather", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "size-2.5 text-emerald-500 animate-pulse" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display font-bold text-xl text-foreground",
									children: loading ? "Fetching forecast..." : `${data?.current.temperature ?? "--"}°C · ${data?.current.condition ?? "Clear"}`
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
								children: "Open-Meteo"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border/50 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Droplets, { className: "size-3.5 text-sky-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Humidity: ",
									data?.current.humidity ?? 55,
									"%"
								] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wind, { className: "size-3.5 text-sky-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Wind: ",
									data?.current.windSpeed ?? 8,
									" km/h"
								] })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-[11px] text-muted-foreground/80 flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "size-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"Updated via",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "https://open-meteo.com/",
									target: "_blank",
									rel: "noopener noreferrer",
									className: "underline hover:text-foreground font-medium",
									children: "Open-Meteo.com"
								}),
								" ",
								"· 30m cache"
							] })]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-6 rounded-3xl border border-border shadow-soft",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "size-11 rounded-2xl bg-sunset/10 text-sunset flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "size-6" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
									children: "Optimal Travel Window"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display font-bold text-lg text-foreground",
									children: "Best Time to Visit"
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: isWatching ? "secondary" : "outline",
								size: "sm",
								onClick: () => setIsAlertModalOpen(true),
								className: "rounded-full text-xs h-8 gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, { className: "size-3.5 text-primary" }), isWatching ? "Watching" : "Watch Price"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground leading-relaxed",
							children: bestTimeToVisit || "October to March offers ideal temperatures with clear sunny days and cool evenings."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Recommended: 4–6 Days" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-foreground",
								children: "High Season Window"
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card p-6 sm:p-7 rounded-3xl border border-border shadow-soft",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-display font-bold text-base sm:text-lg text-foreground",
								children: ["7-Day Weather Forecast for ", destinationName]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-muted-foreground hidden sm:inline",
							children: "Free ECB & Open-Meteo Integration"
						})]
					}),
					loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5",
						children: [...Array(7)].map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-28 rounded-2xl bg-secondary/50 animate-pulse p-3 flex flex-col justify-between" }, i))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5",
						children: data?.daily.map((day) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center justify-between p-3 rounded-2xl border border-border/60 bg-surface text-center transition-transform hover:-translate-y-1 hover:border-primary/40",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold text-foreground",
									children: day.dayName
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-muted-foreground",
									children: day.date.slice(5).replace("-", "/")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "my-2",
									children: getWeatherIcon(day.weatherCode)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-bold text-foreground",
										children: [day.tempMax, "°"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground ml-1",
										children: [day.tempMin, "°"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 text-[10px] text-sky-600 dark:text-sky-400 font-medium",
									children: [day.precipitationProbability, "% rain"]
								})
							]
						}, day.date))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 pt-3 border-t border-border/50 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"Attribution: Weather data by",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "https://open-meteo.com/",
								target: "_blank",
								rel: "noopener noreferrer",
								className: "underline hover:text-foreground",
								children: "Open-Meteo.com"
							}),
							" ",
							"(Free & Key-less)"
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-primary font-medium",
							children: "Demo pricing: ±5-10% daily variation"
						})]
					})
				]
			}),
			isAlertModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-elevated space-y-4 animate-in fade-in zoom-in-95 duration-200",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, { className: "size-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-display font-bold text-base text-foreground",
								children: "Set Price Alert"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									"Watching ",
									destinationName,
									" trips"
								]
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-semibold text-foreground",
									children: "Target Price (INR)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									value: targetPrice,
									onChange: (e) => setTargetPrice(Number(e.target.value) || 0),
									className: "w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm font-semibold focus:outline-none focus:border-primary"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] text-muted-foreground",
									children: [
										"Base price: ₹",
										basePrice.toLocaleString("en-IN"),
										". We will alert you whenever catalog fares fluctuate below this target."
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl bg-amber-500/10 border border-amber-500/20 p-2.5 text-[11px] text-amber-700 dark:text-amber-300",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold",
								children: "Demo pricing:"
							}), " Simulated deterministic fluctuations run daily via GitHub Actions cron."]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-2 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "sm",
								onClick: () => setIsAlertModalOpen(false),
								className: "rounded-full",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "hero",
								size: "sm",
								onClick: handleCreateAlert,
								className: "rounded-full",
								children: "Activate Alert"
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { WeatherForecastCard as t };
