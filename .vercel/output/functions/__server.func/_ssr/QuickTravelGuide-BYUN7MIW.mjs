import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as cn, t as Button } from "./button-BSij73O2.mjs";
import { n as SectionHeading, t as Reveal } from "./Reveal-YnFTFRXl.mjs";
import { C as Smile, E as Shield, Ft as CircleAlert, Nt as CircleCheck, P as RotateCcw, St as CreditCard, Tt as Compass, X as MapPin, _t as FileText, b as SquareCheckBig, ft as Heart, qt as Briefcase, rt as Lightbulb, t as Zap, x as Sparkles } from "../_libs/lucide-react.mjs";
import { i as AccordionTrigger, n as AccordionContent, r as AccordionItem, t as Accordion } from "./accordion-DUWYAlea.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/QuickTravelGuide-BYUN7MIW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STAGES = [
	{
		value: "before-you-go",
		title: "1. Before You Go",
		subtitle: "Documentation, medical readiness, and smart packing essentials",
		badge: "Pre-Departure",
		badgeColor: "bg-sky-500/15 text-sky-800 dark:text-sky-300 border-sky-500/30",
		items: [
			{
				id: "doc-id",
				category: "documents",
				title: "Passports, IDs & Digital Backups",
				description: "Valid government photo ID / passport (min. 6 months validity). Save offline copies on your phone and email backup copies to yourself.",
				icon: FileText
			},
			{
				id: "doc-insurance",
				category: "documents",
				title: "Travel Insurance & Booking Vouchers",
				description: "Keep physical or offline PDF vouchers for flights, hotels, trains, and medical travel insurance with 24/7 assistance hotline.",
				icon: Briefcase
			},
			{
				id: "health-meds",
				category: "health",
				title: "Prescription Medications & First Aid",
				description: "Pack daily medicines in original boxes with prescription. Include a compact kit with pain relievers, motion sickness tablets, ORS, and band-aids.",
				icon: Heart
			},
			{
				id: "health-weather",
				category: "health",
				title: "Climate & Altitude Readiness",
				description: "Check destination weather forecast. If heading to high altitudes (>2,500m like Manali/Ladakh), carry Diamox and plan for 24h acclimatization.",
				icon: Shield
			},
			{
				id: "pack-layers",
				category: "packing",
				title: "Versatile Layering & Footwear",
				description: "Pack moisture-wicking inner layers, weather-proof outerwear, and already broken-in walking shoes to prevent blisters on day one.",
				icon: Compass
			},
			{
				id: "pack-tech",
				category: "packing",
				title: "Universal Adapters & Power Bank",
				description: "Bring a 10,000–20,000mAh power bank (always pack in cabin baggage) and a universal multi-pin adapter with surge protection.",
				icon: Zap
			}
		]
	},
	{
		value: "during-your-trip",
		title: "2. During Your Trip",
		subtitle: "Money handling, transit security, and respecting local cultures",
		badge: "On the Ground",
		badgeColor: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30",
		items: [
			{
				id: "money-cards",
				category: "money",
				title: "Payment Separation & Emergency Cash",
				description: "Distribute funds across 2 cards and keep emergency local cash in a separate pocket. Use UPI/tap-and-pay for daily street expenses.",
				icon: CreditCard
			},
			{
				id: "money-scams",
				category: "money",
				title: "Fare Negotiation & Meter Verification",
				description: "Always confirm taxi/auto rates upfront or use ride-hailing apps (Ola, Uber). Avoid unsolicited airport arrival guides offering unverified deals.",
				icon: CircleAlert
			},
			{
				id: "safety-emergency",
				category: "safety",
				title: "Emergency Contacts & Live Sharing",
				description: "Save local emergency numbers (112 in India / 911 / 999). Share your live location with at least one family member or close friend during transit.",
				icon: Shield
			},
			{
				id: "safety-bags",
				category: "safety",
				title: "Baggage Vigilance in Crowded Areas",
				description: "In crowded bazaars and train stations, wear your daypack in front and secure zippers with carabiners or clips.",
				icon: Briefcase
			},
			{
				id: "etiquette-dress",
				category: "etiquette",
				title: "Sacred Site Modesty & Footwear Rules",
				description: "Cover shoulders and knees when visiting temples, mosques, monasteries, and churches. Remove footwear and silence mobile devices before entering.",
				icon: Smile
			},
			{
				id: "etiquette-photo",
				category: "etiquette",
				title: "Photography Courtesy & Permissions",
				description: "Always ask permission before taking close-up portraits of locals, monks, or children. Respect 'No Photography' signs inside heritage shrines.",
				icon: MapPin
			}
		]
	},
	{
		value: "smart-tips",
		title: "3. Smart Tips & Traveler Hacks",
		subtitle: "Cost-cutting secrets, transit hacks, and sustainable travel",
		badge: "Pro Secrets",
		badgeColor: "bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30",
		items: [
			{
				id: "tip-food",
				category: "tips",
				title: "Eat Where Locals Queue",
				description: "High turnover means fresh food and genuine flavors. Look for busy local thali joints, bakeries, and street vendors with active cooking fires.",
				icon: Lightbulb
			},
			{
				id: "tip-maps",
				category: "tips",
				title: "Offline Google Maps & Translation",
				description: "Download offline maps for your destination city on Google Maps before landing. Pin your hotel location so you can navigate without cellular data.",
				icon: MapPin
			},
			{
				id: "tip-bottles",
				category: "tips",
				title: "Carry a Reusable Water Flask",
				description: "Refill filtered water at hotels and airport lounges to eliminate single-use plastic waste and save hundreds of rupees throughout your trip.",
				icon: Heart
			},
			{
				id: "tip-timing",
				category: "tips",
				title: "Sunrise Monument Visits",
				description: "Popular monuments and viewpoints (like Taj Mahal, Rohtang Pass, Forts) are least crowded in the first 90 minutes after sunrise. Avoid midday queues.",
				icon: Sparkles
			}
		]
	}
];
var CHECKLIST_STORAGE_KEY = "smarttrip.travel_guide_checklist";
function QuickTravelGuide({ compact = false }) {
	const [checkedIds, setCheckedIds] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		try {
			const saved = localStorage.getItem(CHECKLIST_STORAGE_KEY);
			if (saved) setCheckedIds(JSON.parse(saved));
		} catch {}
	}, []);
	const toggleItem = (id) => {
		const next = checkedIds.includes(id) ? checkedIds.filter((x) => x !== id) : [...checkedIds, id];
		setCheckedIds(next);
		try {
			localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(next));
		} catch {}
	};
	const resetAll = () => {
		setCheckedIds([]);
		try {
			localStorage.removeItem(CHECKLIST_STORAGE_KEY);
		} catch {}
	};
	const allItemsCount = STAGES.reduce((acc, curr) => acc + curr.items.length, 0);
	const completedCount = checkedIds.length;
	const progressPercent = Math.round(completedCount / allItemsCount * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: compact ? "py-4" : "py-16 bg-secondary/30 relative overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page max-w-5xl",
			children: [
				!compact && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
						eyebrow: "Smart Preparation",
						title: "Quick Travel Guide & Checklist",
						subtitle: "Practical advice curated by seasoned travelers: from essential document checks to local customs and money-saving hacks."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs font-semibold text-foreground",
								children: [
									completedCount,
									" of ",
									allItemsCount,
									" ready"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-28 h-2 rounded-full bg-secondary overflow-hidden mt-1 border border-border/40",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full bg-primary transition-all duration-300 rounded-full",
									style: { width: `${progressPercent}%` }
								})
							})]
						}), completedCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: resetAll,
							className: "h-8 text-xs text-muted-foreground hover:text-foreground",
							title: "Reset all checkboxes",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3.5 mr-1" }), "Reset"]
						})]
					})]
				}) }),
				compact && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mb-4 border-b border-border/50 pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "text-base font-bold text-foreground flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "size-4 text-primary" }), "Traveler Guide & Checklists"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Tick off essentials as you prepare for your departure."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary",
							children: [
								completedCount,
								"/",
								allItemsCount,
								" completed"
							]
						}), completedCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							onClick: resetAll,
							className: "size-7",
							title: "Reset",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3" })
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accordion, {
					type: "multiple",
					defaultValue: ["before-you-go"],
					className: "space-y-4",
					children: STAGES.map((stage) => {
						const stageCheckedCount = stage.items.filter((i) => checkedIds.includes(i.id)).length;
						const stageTotal = stage.items.length;
						const isStageDone = stageCheckedCount === stageTotal;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
							value: stage.value,
							className: "border border-border/60 rounded-3xl bg-card/80 backdrop-blur-sm overflow-hidden shadow-soft px-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, {
								className: "px-4 py-4 hover:no-underline cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-3 text-left flex-1 mr-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn("text-xs font-bold px-2.5 py-0.5 rounded-full border", stage.badgeColor),
											children: stage.badge
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1 min-w-[200px]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
												className: "font-bold text-sm sm:text-base text-foreground flex items-center gap-2",
												children: [stage.title, isStageDone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4 text-emerald-500 fill-emerald-500/20" })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground hidden sm:block",
												children: stage.subtitle
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs font-medium text-muted-foreground mr-2",
											children: [
												stageCheckedCount,
												"/",
												stageTotal,
												" checked"
											]
										})
									]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, {
								className: "px-4 pb-5 pt-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-1 md:grid-cols-2 gap-3",
									children: stage.items.map((item) => {
										const isChecked = checkedIds.includes(item.id);
										const Icon = item.icon;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											onClick: () => toggleItem(item.id),
											className: cn("flex items-start gap-3 p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer select-none", isChecked ? "bg-primary/5 border-primary/30 text-foreground" : "bg-secondary/30 border-border/50 hover:bg-secondary/60 text-foreground/90"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: cn("mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-lg border transition-colors", isChecked ? "bg-primary border-primary text-primary-foreground shadow-xs" : "border-border bg-card text-transparent"),
												"aria-label": `Toggle ${item.title}`,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquareCheckBig, { className: "size-3.5" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex-1 min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3.5 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
														className: cn("font-semibold text-xs leading-snug", isChecked && "line-through text-muted-foreground"),
														children: item.title
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: cn("text-[11px] text-muted-foreground mt-1 leading-relaxed", isChecked && "opacity-75"),
													children: item.description
												})]
											})]
										}, item.id);
									})
								})
							})]
						}, stage.value);
					})
				})
			]
		})
	});
}
//#endregion
export { QuickTravelGuide as t };
