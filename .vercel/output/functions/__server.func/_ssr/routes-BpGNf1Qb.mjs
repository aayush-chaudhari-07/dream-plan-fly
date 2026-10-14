import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as cn, t as Button } from "./button-BSij73O2.mjs";
import { t as Badge } from "./badge-CNWERV3-.mjs";
import { a as hillStations, i as hero_mountains_default } from "./travel-Co-Z1Moz.mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as getHillStationsWeatherFn, d as submitReviewFn, h as useSmartTrip, r as fetchReviewsFn } from "./smarttrip-store-B4h7bmlO.mjs";
import { n as SectionHeading, t as Reveal } from "./Reveal-YnFTFRXl.mjs";
import { D as ShieldCheck, E as Shield, Ft as CircleAlert, Gt as Bus, I as Radio, Jt as Bot, L as Quote, M as Search, Pt as CircleCheckBig, Q as Luggage, T as Siren, V as Plane, Vt as Car, Wt as CalendarDays, X as MapPin, Y as MapPinned, c as Users, et as Lock, g as Thermometer, o as Wallet, q as MessageSquarePlus, tt as LoaderCircle, ut as Hotel, v as Stethoscope, x as Sparkles, y as Star } from "../_libs/lucide-react.mjs";
import { a as DialogContent, c as DialogHeader, d as Input, f as Navbar, i as Dialog, l as DialogTitle, o as DialogDescription, s as DialogFooter, u as Footer } from "./Navbar-G5xs2vbg.mjs";
import { n as Textarea, t as SupportDock } from "./SupportDock-BQEj3o76.mjs";
import { t as QuickTravelGuide } from "./QuickTravelGuide-BYUN7MIW.mjs";
import { t as AiPlanner } from "./AiPlanner-CPnWLPlk.mjs";
import { n as getAirportByIata, t as AirportCombobox } from "./AirportCombobox-DMbRA9O5.mjs";
import { t as ExploreDestinations } from "./ExploreDestinations-B8ceVSzX.mjs";
import { t as TripFund } from "./TripFund-B9rACDh3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BpGNf1Qb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SkyLayer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"aria-hidden": true,
		className: "pointer-events-none absolute inset-0 overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "animate-drift absolute top-[14%] left-0 h-24 w-72 rounded-full bg-card/25 blur-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "animate-drift-slow absolute top-[26%] left-0 h-16 w-52 rounded-full bg-card/20 blur-2xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "animate-fly-across absolute top-[18%] left-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plane, { className: "size-6 -rotate-12 text-card/80 drop-shadow" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "animate-bird absolute top-[32%] left-0 flex gap-3 text-card/70",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bird, {}),
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bird, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "translate-y-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bird, {})
					})
				]
			})
		]
	});
}
function Bird() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		width: "18",
		height: "10",
		viewBox: "0 0 18 10",
		fill: "none",
		"aria-hidden": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M1 6c2.5 0 3.8-4 4.8-4S8 6 9 6s2.2-4 3.2-4S15 6 17 6",
			stroke: "currentColor",
			strokeWidth: "1.4",
			strokeLinecap: "round"
		})
	});
}
function Hero() {
	const [form, setForm] = (0, import_react.useState)({
		destination: "",
		dates: "",
		travelers: "2",
		budget: ""
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative min-h-[92vh] overflow-hidden pt-28 pb-32",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: hero_mountains_default,
				alt: "Sunrise over misty green hills and a mountain lake",
				width: 1920,
				height: 1088,
				fetchPriority: "high",
				loading: "eager",
				decoding: "async",
				className: "absolute inset-0 size-full scale-105 object-cover"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/45 to-background" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkyLayer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-3xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "glass-panel inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }), " Dream → Ask AI → Plan → Save → Book → Travel"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "mt-6 font-display text-5xl leading-[1.05] font-extrabold text-primary-foreground sm:text-6xl lg:text-7xl",
							children: ["Plan Less. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-teal",
								children: "Travel More."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 max-w-xl text-base text-primary-foreground/85 sm:text-lg",
							children: "Your AI-powered travel companion for planning, booking, saving and enjoying every journey."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass-panel mt-10 rounded-4xl p-4 sm:p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "px-1 pb-3 font-display text-sm font-semibold text-ink",
							children: "Where do you want to go?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "grid gap-3 lg:grid-cols-[1.3fr_1fr_0.8fr_1fr_auto]",
							onSubmit: (e) => {
								e.preventDefault();
								toast.success(form.destination ? `Searching trips to ${form.destination}` : "Searching top trips", { description: "24 curated results ready in Explore." });
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									icon: MapPin,
									label: "Destination",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: form.destination,
										onChange: (e) => setForm({
											...form,
											destination: e.target.value
										}),
										placeholder: "Manali, Goa, Japan…",
										className: "h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									icon: CalendarDays,
									label: "Travel dates",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: form.dates,
										onChange: (e) => setForm({
											...form,
											dates: e.target.value
										}),
										placeholder: "12 Dec – 17 Dec",
										className: "h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									icon: Users,
									label: "Travelers",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: 1,
										value: form.travelers,
										onChange: (e) => setForm({
											...form,
											travelers: e.target.value
										}),
										className: "h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									icon: Wallet,
									label: "Budget",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: form.budget,
										onChange: (e) => setForm({
											...form,
											budget: e.target.value
										}),
										placeholder: "₹35,000",
										className: "h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-col gap-2 sm:flex-row lg:flex-col",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "submit",
										variant: "hero",
										size: "xl",
										className: "w-full",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {}), " Search"]
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap items-center gap-3 px-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "glass",
								size: "pill",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/ai-planner",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {}), " Ask AI to Plan My Trip"]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-ink/70",
								children: "Popular now: Manali · Goa · Kashmir · Kyoto"
							})]
						})
					]
				})]
			})
		]
	});
}
function Field({ icon: Icon, label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "rounded-2xl border border-border bg-card/85 px-4 py-2.5 transition-colors focus-within:border-primary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3.5" }), label]
		}), children]
	});
}
var tabs = [
	{
		key: "flights",
		label: "Flights",
		icon: Plane
	},
	{
		key: "stay",
		label: "Hotels & Stays",
		icon: Hotel
	},
	{
		key: "rental",
		label: "Car & Bike Rentals",
		icon: Car
	},
	{
		key: "rail",
		label: "Train & Bus",
		icon: Bus
	},
	{
		key: "packages",
		label: "Curated Packages",
		icon: Luggage
	}
];
function QuickBooking({ onSearch }) {
	const navigate = useNavigate();
	const [tab, setTab] = (0, import_react.useState)("flights");
	const [originIata, setOriginIata] = (0, import_react.useState)("DEL");
	const [destinationIata, setDestinationIata] = (0, import_react.useState)("GOI");
	const [departDate, setDepartDate] = (0, import_react.useState)("2026-12-15");
	const [returnDate, setReturnDate] = (0, import_react.useState)("2026-12-20");
	const [travelers, setTravelers] = (0, import_react.useState)(2);
	const [cabinClass, setCabinClass] = (0, import_react.useState)("economy");
	const [stayDest, setStayDest] = (0, import_react.useState)("Goa");
	const [rentalLoc, setRentalLoc] = (0, import_react.useState)("Manali");
	const [railFrom, setRailFrom] = (0, import_react.useState)("Mumbai");
	const [railTo, setRailTo] = (0, import_react.useState)("Goa");
	const [packageDest, setPackageDest] = (0, import_react.useState)("Kashmir");
	const handleSearchSubmit = (e) => {
		e.preventDefault();
		onSearch?.(tab);
		const originAirport = getAirportByIata(originIata);
		const destAirport = getAirportByIata(destinationIata);
		if (tab === "flights") {
			navigate({
				to: "/bookings",
				search: {
					tab: "flights",
					origin: originIata,
					destination: destinationIata,
					date: departDate,
					travelers,
					cabinClass
				}
			});
			toast.success("Searching Flights", { description: `${originAirport?.city || originIata} to ${destAirport?.city || destinationIata} · ${travelers} travelers` });
		} else if (tab === "stay") {
			navigate({
				to: "/bookings",
				search: {
					tab: "stay",
					destination: stayDest,
					travelers
				}
			});
			toast.success("Searching Hotels", { description: `Stays in ${stayDest}` });
		} else if (tab === "rental") {
			navigate({
				to: "/bookings",
				search: {
					tab: "rental",
					destination: rentalLoc
				}
			});
			toast.success("Searching Rentals", { description: `Vehicles in ${rentalLoc}` });
		} else if (tab === "rail") {
			navigate({
				to: "/bookings",
				search: {
					tab: "rail",
					origin: railFrom,
					destination: railTo,
					travelers
				}
			});
			toast.success("Searching Train & Bus", { description: `${railFrom} to ${railTo}` });
		} else {
			navigate({
				to: "/bookings",
				search: {
					tab: "packages",
					destination: packageDest,
					travelers
				}
			});
			toast.success("Searching Holiday Packages", { description: `Curated ${packageDest} tours` });
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative -mt-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "container-page",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
				className: "surface-card overflow-hidden p-5 sm:p-7 shadow-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2 overflow-x-auto pb-2",
					children: tabs.map(({ key, label, icon: Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setTab(key),
						className: cn("flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300", tab === key ? "bg-gradient-brand text-primary-foreground shadow-soft" : "bg-secondary text-secondary-foreground hover:bg-accent"),
						"data-testid": `quickbooking-tab-${key}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), label]
					}, key))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-5 grid animate-fade-in gap-3 md:grid-cols-3 lg:grid-cols-4 items-end",
					onSubmit: handleSearchSubmit,
					children: [
						tab === "flights" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AirportCombobox, {
								label: "From (Origin)",
								value: originIata,
								onChange: (a) => setOriginIata(a.iata),
								testId: "search-origin-input"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AirportCombobox, {
								label: "To (Destination)",
								value: destinationIata,
								onChange: (a) => setDestinationIata(a.iata),
								testId: "search-destination-input"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "rounded-2xl border border-border bg-surface px-4 py-2.5 transition-colors focus-within:border-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-semibold tracking-wide text-muted-foreground uppercase block",
									children: "Departure Date"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									value: departDate,
									onChange: (e) => setDepartDate(e.target.value),
									className: "h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 text-sm font-semibold",
									"data-testid": "search-depart-date"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "rounded-2xl border border-border bg-surface px-3 py-2.5 transition-colors focus-within:border-primary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-semibold tracking-wide text-muted-foreground uppercase block",
										children: "Travelers"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: 1,
										max: 9,
										value: travelers,
										onChange: (e) => setTravelers(Number(e.target.value) || 1),
										className: "h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 text-sm font-semibold"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "rounded-2xl border border-border bg-surface px-3 py-2.5 transition-colors focus-within:border-primary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-semibold tracking-wide text-muted-foreground uppercase block",
										children: "Class"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: cabinClass,
										onChange: (e) => setCabinClass(e.target.value),
										className: "h-8 w-full border-0 bg-transparent text-xs font-semibold focus:outline-none",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "economy",
												children: "Economy"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "premium_economy",
												children: "Premium"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "business",
												children: "Business"
											})
										]
									})]
								})]
							})
						] }),
						tab === "stay" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "rounded-2xl border border-border bg-surface px-4 py-2.5 transition-colors focus-within:border-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-semibold tracking-wide text-muted-foreground uppercase block",
									children: "Destination"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: stayDest,
									onChange: (e) => setStayDest(e.target.value),
									className: "h-8 w-full border-0 bg-transparent text-sm font-semibold focus:outline-none",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Goa",
											children: "Goa"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Manali",
											children: "Manali"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Kashmir",
											children: "Kashmir / Srinagar"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Jaipur",
											children: "Jaipur"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Munnar",
											children: "Munnar / Kerala"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "rounded-2xl border border-border bg-surface px-4 py-2.5 transition-colors focus-within:border-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-semibold tracking-wide text-muted-foreground uppercase block",
									children: "Check-in Date"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									defaultValue: "2026-12-15",
									className: "h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 text-sm font-semibold"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "rounded-2xl border border-border bg-surface px-4 py-2.5 transition-colors focus-within:border-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-semibold tracking-wide text-muted-foreground uppercase block",
									children: "Guests & Rooms"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "text",
									defaultValue: "2 Guests, 1 Room",
									className: "h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 text-sm font-semibold"
								})]
							})
						] }),
						tab === "rental" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "rounded-2xl border border-border bg-surface px-4 py-2.5 transition-colors focus-within:border-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-semibold tracking-wide text-muted-foreground uppercase block",
									children: "Location"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: rentalLoc,
									onChange: (e) => setRentalLoc(e.target.value),
									className: "h-8 w-full border-0 bg-transparent text-sm font-semibold focus:outline-none",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Manali",
											children: "Manali (Rohtang Pass)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Goa",
											children: "Goa (Airport & Beaches)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Jaipur",
											children: "Jaipur (Royal Forts)"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "rounded-2xl border border-border bg-surface px-4 py-2.5 transition-colors focus-within:border-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-semibold tracking-wide text-muted-foreground uppercase block",
									children: "Pick-up Date"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									defaultValue: "2026-12-15",
									className: "h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 text-sm font-semibold"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "rounded-2xl border border-border bg-surface px-4 py-2.5 transition-colors focus-within:border-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-semibold tracking-wide text-muted-foreground uppercase block",
									children: "Vehicle Preference"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "text",
									defaultValue: "4x4 SUV / Adventure Bike",
									className: "h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 text-sm font-semibold"
								})]
							})
						] }),
						tab === "rail" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "rounded-2xl border border-border bg-surface px-4 py-2.5 transition-colors focus-within:border-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-semibold tracking-wide text-muted-foreground uppercase block",
									children: "From City"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: railFrom,
									onChange: (e) => setRailFrom(e.target.value),
									className: "h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 text-sm font-semibold"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "rounded-2xl border border-border bg-surface px-4 py-2.5 transition-colors focus-within:border-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-semibold tracking-wide text-muted-foreground uppercase block",
									children: "To City"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: railTo,
									onChange: (e) => setRailTo(e.target.value),
									className: "h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 text-sm font-semibold"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "rounded-2xl border border-border bg-surface px-4 py-2.5 transition-colors focus-within:border-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-semibold tracking-wide text-muted-foreground uppercase block",
									children: "Journey Date"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									defaultValue: "2026-12-15",
									className: "h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 text-sm font-semibold"
								})]
							})
						] }),
						tab === "packages" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "rounded-2xl border border-border bg-surface px-4 py-2.5 transition-colors focus-within:border-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-semibold tracking-wide text-muted-foreground uppercase block",
									children: "Destination Region"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: packageDest,
									onChange: (e) => setPackageDest(e.target.value),
									className: "h-8 w-full border-0 bg-transparent text-sm font-semibold focus:outline-none",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Kashmir",
											children: "Kashmir (Dal Lake & Gulmarg)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Jaipur",
											children: "Jaipur (Golden Triangle)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Goa",
											children: "Goa (Beach & Catamaran)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Manali",
											children: "Manali (Alpine Escape)"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "rounded-2xl border border-border bg-surface px-4 py-2.5 transition-colors focus-within:border-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-semibold tracking-wide text-muted-foreground uppercase block",
									children: "Travel Window"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "text",
									defaultValue: "December / January",
									className: "h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 text-sm font-semibold"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "rounded-2xl border border-border bg-surface px-4 py-2.5 transition-colors focus-within:border-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-semibold tracking-wide text-muted-foreground uppercase block",
									children: "Travelers"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 1,
									value: travelers,
									onChange: (e) => setTravelers(Number(e.target.value) || 1),
									className: "h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 text-sm font-semibold"
								})]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							variant: "hero",
							size: "xl",
							className: "md:col-span-1 rounded-2xl shadow-soft",
							"data-testid": "search-submit-btn",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {}),
								" Search",
								" ",
								tab === "stay" ? "Hotels" : tab === "rail" ? "Transit" : tab.charAt(0).toUpperCase() + tab.slice(1)
							]
						})
					]
				}, tab)]
			})
		})
	});
}
var steps = [
	{
		icon: Bot,
		title: "Ask AI",
		description: "Tell SmartTrip where you want to go, your budget and your vibe. AI builds a plan in seconds.",
		color: "bg-primary text-primary-foreground"
	},
	{
		icon: MapPin,
		title: "Explore",
		description: "Browse hand-picked destinations, compare real prices and save places you love to a wishlist.",
		color: "bg-teal text-teal-foreground"
	},
	{
		icon: Wallet,
		title: "Save",
		description: "Start a trip fund, track your progress and get reminders so your dream trip actually happens.",
		color: "bg-sunset text-sunset-foreground"
	},
	{
		icon: Plane,
		title: "Book & Go",
		description: "Book flights, stays, rentals and packages — then manage everything in one smart itinerary.",
		color: "bg-leaf text-leaf-foreground"
	}
];
function HowItWorks() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "container-page py-24",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
			eyebrow: "How it works",
			title: "Dream → Plan → Save → Travel",
			subtitle: "A simple loop that turns your travel ideas into real trips."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4",
			children: steps.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				delay: i * 80,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card relative h-full p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute top-4 right-4 font-display text-5xl font-bold text-muted/40",
							children: ["0", i + 1]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex size-12 items-center justify-center rounded-2xl " + step.color,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(step.icon, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-5 font-display text-lg font-bold",
							children: step.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: step.description
						})
					]
				})
			}, step.title))
		})]
	});
}
function EscapeHills() {
	const [liveWeather, setLiveWeather] = (0, import_react.useState)({});
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		let active = true;
		getHillStationsWeatherFn().then((data) => {
			if (active) {
				setLiveWeather(data);
				setIsLoading(false);
			}
		}).catch((err) => {
			console.warn("Could not load live hill stations weather:", err);
			if (active) setIsLoading(false);
		});
		return () => {
			active = false;
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative overflow-hidden bg-gradient-sky py-24",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			"aria-hidden": true,
			className: "pointer-events-none absolute inset-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "animate-drift-slow absolute top-10 left-0 h-20 w-64 rounded-full bg-card/60 blur-3xl" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "animate-drift absolute top-32 left-0 h-14 w-40 rounded-full bg-card/50 blur-2xl" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "animate-bird absolute top-24 left-0 flex gap-3 text-primary/40",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
						width: "20",
						height: "10",
						viewBox: "0 0 18 10",
						fill: "none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: "M1 6c2.5 0 3.8-4 4.8-4S8 6 9 6s2.2-4 3.2-4S15 6 17 6",
							stroke: "currentColor",
							strokeWidth: "1.4",
							strokeLinecap: "round"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
						width: "14",
						height: "8",
						viewBox: "0 0 18 10",
						fill: "none",
						className: "translate-y-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: "M1 6c2.5 0 3.8-4 4.8-4S8 6 9 6s2.2-4 3.2-4S15 6 17 6",
							stroke: "currentColor",
							strokeWidth: "1.6",
							strokeLinecap: "round"
						})
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page relative",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					eyebrow: "Mountain mood",
					title: "Escape to the Hills",
					subtitle: "Cold air, slow mornings, tea at a viewpoint. The trips people remember for years."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "relative flex size-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex size-2 rounded-full bg-emerald-500" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"Live weather via",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "https://open-meteo.com/",
							target: "_blank",
							rel: "noopener noreferrer",
							className: "font-semibold text-primary underline hover:text-primary/80",
							children: "Open-Meteo"
						}),
						" ",
						"· Cached every 30m"
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4",
					children: hillStations.map((h, i) => {
						const displayTemp = liveWeather[h.name]?.temp || h.temp;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							delay: i * 60,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/destination/$id",
								params: { id: h.id },
								className: "block",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
									className: "group relative h-64 overflow-hidden rounded-3xl shadow-soft transition-transform duration-500 hover:-translate-y-1.5 cursor-pointer",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: h.image,
											alt: `${h.name}, ${h.state}`,
											loading: "lazy",
											decoding: "async",
											width: 1024,
											height: 768,
											className: "size-full object-cover transition-transform duration-[900ms] group-hover:scale-110"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "absolute inset-x-4 bottom-4 text-primary-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-display text-xl font-bold group-hover:underline",
												children: h.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-1 flex items-center justify-between text-xs opacity-90",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: h.state }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "flex items-center gap-1 font-semibold",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thermometer, { className: "size-3.5 text-sky-400" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: displayTemp }),
														!isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "size-2.5 text-emerald-400 animate-pulse ml-0.5" })
													]
												})]
											})]
										})
									]
								})
							})
						}, h.name);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 text-center text-[11px] text-muted-foreground/80",
					children: [
						"Weather data by",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "https://open-meteo.com/",
							target: "_blank",
							rel: "noopener noreferrer",
							className: "underline hover:text-foreground",
							children: "Open-Meteo.com"
						}),
						" ",
						"(CC BY 4.0)"
					]
				})
			]
		})]
	});
}
function ReviewsSection() {
	const queryClient = useQueryClient();
	const state = useSmartTrip();
	const [modalOpen, setModalOpen] = (0, import_react.useState)(false);
	const [rating, setRating] = (0, import_react.useState)(5);
	const [hoverRating, setHoverRating] = (0, import_react.useState)(0);
	const [destination, setDestination] = (0, import_react.useState)("Himachal Pradesh");
	const [title, setTitle] = (0, import_react.useState)("");
	const [comment, setComment] = (0, import_react.useState)("");
	const [tripTitle, setTripTitle] = (0, import_react.useState)("");
	const [errorMessage, setErrorMessage] = (0, import_react.useState)(null);
	const { data: reviews = [], isLoading } = useQuery({
		queryKey: ["traveler-reviews"],
		queryFn: async () => {
			return await fetchReviewsFn();
		},
		staleTime: 3e5
	});
	const submitMutation = useMutation({
		mutationFn: async () => {
			return await submitReviewFn({ data: {
				rating,
				destination: destination.trim(),
				title: title.trim(),
				comment: comment.trim(),
				tripTitle: tripTitle.trim() || void 0
			} });
		},
		onSuccess: () => {
			toast.success("Review posted successfully!", { description: "Thank you for sharing your verified travel story." });
			queryClient.invalidateQueries({ queryKey: ["traveler-reviews"] });
			setModalOpen(false);
			setTitle("");
			setComment("");
			setTripTitle("");
			setRating(5);
			setErrorMessage(null);
		},
		onError: (err) => {
			const msg = err instanceof Error ? err.message : "Failed to submit review.";
			setErrorMessage(msg);
			toast.error(msg);
		}
	});
	const handleOpenModal = () => {
		setErrorMessage(null);
		if (!state.isAuthenticated) toast.info("Please sign in to write a review", { description: "Only travelers with confirmed bookings or saved trips can submit verified reviews." });
		setModalOpen(true);
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		setErrorMessage(null);
		if (!title.trim()) {
			setErrorMessage("Please enter a headline for your review.");
			return;
		}
		if (comment.trim().length < 10) {
			setErrorMessage("Review details must be at least 10 characters.");
			return;
		}
		submitMutation.mutate();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "bg-surface py-24 relative overflow-hidden",
		id: "reviews",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					eyebrow: "Traveler Stories",
					title: "Real Reviews from Verified Travelers",
					subtitle: "No sponsored fluff. Authentic feedback from travelers who booked and explored with SmartTrip."
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-3 shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "hero",
						onClick: handleOpenModal,
						className: "gap-2 rounded-full cursor-pointer shadow-soft",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquarePlus, { className: "size-4" }), "Write a Review"]
					})
				})]
			}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
				children: [
					1,
					2,
					3
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "surface-card h-64 animate-pulse p-6 rounded-3xl" }, i))
			}) : reviews.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card p-12 text-center rounded-3xl border border-dashed border-border/80",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-10 text-primary mx-auto mb-3" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-lg font-bold",
						children: "Be the first to share your journey!"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground max-w-md mx-auto mb-5",
						children: "Have you explored a destination with SmartTrip? Write a verified review to help fellow travelers plan their dream adventures."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: handleOpenModal,
						className: "rounded-full",
						children: "Write a Review"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
				children: reviews.map((review, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: i * 70,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "surface-card relative flex h-full flex-col justify-between p-6 rounded-3xl border border-border/70 hover:border-primary/30 transition-all hover:shadow-soft",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Quote, { className: "absolute top-5 right-5 size-8 text-muted/30 pointer-events-none" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [review.authorAvatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: review.authorAvatar,
										alt: review.authorName,
										loading: "lazy",
										decoding: "async",
										width: 44,
										height: 44,
										className: "size-11 rounded-full object-cover ring-2 ring-primary/20"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex size-11 items-center justify-center rounded-full bg-gradient-brand font-display font-bold text-primary-foreground shadow-xs",
										children: review.authorName.charAt(0).toUpperCase()
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-display text-sm font-bold text-foreground",
											children: review.authorName
										}), review.verified ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											title: "Verified Traveler (Booking or Trip Confirmed)",
											className: "text-primary flex items-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4" })
										}) : null]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: review.destination
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3.5 flex items-center gap-1",
									children: [Array.from({ length: 5 }).map((_, s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: cn("size-3.5", s < review.rating ? "fill-sunset text-sunset" : "text-muted") }, s)), review.verified ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: "ml-2 text-[10px] bg-primary/5 text-primary border-primary/20 py-0 px-1.5 font-normal",
										children: "Verified Traveler"
									}) : null]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "mt-2.5 font-display text-sm font-bold text-foreground",
									children: review.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground",
									children: [
										"\"",
										review.comment,
										"\""
									]
								})
							] }),
							review.tripTitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-primary",
									children: review.tripTitle
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-muted-foreground",
									children: new Date(review.createdAt).toLocaleDateString("en-IN", {
										month: "short",
										year: "numeric"
									})
								})]
							}) : null
						]
					})
				}, review.id))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: modalOpen,
			onOpenChange: setModalOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "sm:max-w-lg rounded-3xl p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "font-display text-xl font-bold",
						children: "Write a Verified Traveler Review"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
					className: "text-xs text-muted-foreground",
					children: "Reviews are verified against confirmed bookings and saved itineraries to maintain community trust."
				})] }), !state.isAuthenticated ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "my-4 rounded-2xl border border-border bg-card p-5 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-8 text-primary mx-auto mb-2" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-sm font-bold",
							children: "Authentication Required"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground mb-4",
							children: "To prevent spam and keep reviews genuine, only logged-in travelers with at least one booking or saved trip can post."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "hero",
							asChild: true,
							className: "rounded-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								search: { redirect: typeof window !== "undefined" ? window.location.pathname : "/" },
								children: "Sign In / Create Account"
							})
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "space-y-4 my-2",
					children: [
						errorMessage ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-4 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: errorMessage })]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-semibold text-muted-foreground block mb-1",
							children: "Overall Rating"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [[
								1,
								2,
								3,
								4,
								5
							].map((star) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": `Rate ${star} star`,
								onMouseEnter: () => setHoverRating(star),
								onMouseLeave: () => setHoverRating(0),
								onClick: () => setRating(star),
								className: "p-1 text-muted-foreground transition-transform hover:scale-115 cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: cn("size-6 transition-colors", star <= (hoverRating || rating) ? "fill-sunset text-sunset" : "text-muted-foreground/30") })
							}, star)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs font-bold text-foreground ml-2",
								children: [rating, " out of 5 stars"]
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-semibold text-muted-foreground block mb-1",
							children: "Destination"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: destination,
							onChange: (e) => setDestination(e.target.value),
							placeholder: "E.g., Himachal Pradesh, Goa, Kashmir, Japan",
							required: true,
							className: "rounded-xl text-xs h-9"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-semibold text-muted-foreground block mb-1",
							children: "Trip Name or Duration (Optional)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: tripTitle,
							onChange: (e) => setTripTitle(e.target.value),
							placeholder: "E.g., 5-day Monsoon Road Trip",
							className: "rounded-xl text-xs h-9"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-semibold text-muted-foreground block mb-1",
							children: "Review Headline"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: title,
							onChange: (e) => setTitle(e.target.value),
							placeholder: "Summarize your experience in one sentence",
							required: true,
							className: "rounded-xl text-xs h-9"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-semibold text-muted-foreground block mb-1",
							children: "Your Review"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: comment,
							onChange: (e) => setComment(e.target.value),
							rows: 4,
							placeholder: "Tell us about the itinerary pacing, local recommendations, stays, or budget accuracy...",
							required: true,
							className: "rounded-xl text-xs resize-none"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								onClick: () => setModalOpen(false),
								className: "rounded-full text-xs h-9",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								variant: "hero",
								disabled: submitMutation.isPending,
								className: "rounded-full text-xs h-9 gap-1.5",
								children: submitMutation.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin" }), "Submitting…"] }) : "Submit Review"
							})]
						})
					]
				})]
			})
		})]
	});
}
var items = [
	{
		icon: Shield,
		title: "Verified stays & transport",
		description: "We only list partners with real reviews, valid licenses and 24/7 customer support."
	},
	{
		icon: MapPinned,
		title: "Live location sharing",
		description: "Share your itinerary and live location with family so someone always knows where you are."
	},
	{
		icon: Siren,
		title: "Emergency support",
		description: "One-tap emergency contacts, local helplines and nearby hospitals in every destination."
	},
	{
		icon: Stethoscope,
		title: "Travel health tips",
		description: "Vaccination reminders, altitude advice and first-aid checklists tailored to your route."
	}
];
function TravelSafe() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "container-page py-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				eyebrow: "Travel safe",
				title: "We've Got Your Back",
				subtitle: "Safety is part of the plan. SmartTrip keeps you informed, connected and prepared."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4",
				children: items.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: i * 80,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card h-full p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex size-12 items-center justify-center rounded-2xl bg-secondary text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-4 font-display text-base font-bold",
								children: item.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: item.description
							})
						]
					})
				}, item.title))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				delay: 120,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-col items-center justify-center gap-3 rounded-3xl border border-border bg-gradient-sky p-6 text-center sm:flex-row sm:text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex size-12 shrink-0 items-center justify-center rounded-full bg-card shadow-soft",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "size-6 text-leaf" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display font-bold",
						children: "SmartTrip Safety Promise"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Every booking includes transparent cancellation, customer support and safety information for your destination."
					})] })]
				})
			})
		]
	});
}
var InteractiveMap = import_react.lazy(() => import("./InteractiveMap-COhZVIgV.mjs").then((m) => ({ default: m.InteractiveMap })));
function Index() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickBooking, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExploreDestinations, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HowItWorks, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EscapeHills, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiPlanner, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
				fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "container-page py-12",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-[460px] w-full animate-pulse rounded-3xl bg-muted/40" })
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InteractiveMap, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TripFund, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickTravelGuide, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewsSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TravelSafe, {})
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupportDock, {})
	] });
}
//#endregion
export { Index as component };
