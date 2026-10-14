import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as cn, t as Button } from "./button-BSij73O2.mjs";
import { t as Badge } from "./badge-CNWERV3-.mjs";
import { c as inr, d as quickPrompts } from "./travel-Co-Z1Moz.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as buildPlan } from "./trip-plan-DIsKoQ71.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { u as smartTrip } from "./smarttrip-store-B4h7bmlO.mjs";
import { n as SectionHeading, t as Reveal } from "./Reveal-YnFTFRXl.mjs";
import { Et as Coins, F as RefreshCw, Ft as CircleAlert, Jt as Bot, Yt as BookmarkPlus, a as WandSparkles, at as Leaf, bt as Download, gt as Flame, j as Send, k as Share2, tt as LoaderCircle, x as Sparkles } from "../_libs/lucide-react.mjs";
import { n as Textarea } from "./SupportDock-BQEj3o76.mjs";
import { r as savePublicPlanFn, t as generatePlan } from "./generate-plan-OHpQ79Wt.mjs";
import { t as QuickTravelGuide } from "./QuickTravelGuide-BYUN7MIW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AiPlanner-CPnWLPlk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ItineraryEditor = (0, import_react.lazy)(() => import("./ItineraryEditor-C7art4hg.mjs").then((m) => ({ default: m.ItineraryEditor })));
var LOADING_STEPS = [
	"Analyzing destination & travel dates…",
	"Consulting Gemini 2.5 Flash travel intelligence…",
	"Designing paced daily routes & local culinary picks…",
	"Balancing realistic INR budget & carbon footprint…"
];
function AiPlanner({ compact = false }) {
	const [input, setInput] = (0, import_react.useState)("I want a 5-day trip to Himachal Pradesh for 3 people under ₹35,000.");
	const [plan, setPlan] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") try {
			const stored = localStorage.getItem("smarttrip.current_plan");
			if (stored) {
				const parsed = JSON.parse(stored);
				if (parsed && Array.isArray(parsed.days)) return parsed;
			}
		} catch {}
		return buildPlan("I want a 5-day trip to Himachal Pradesh for 3 people under ₹35,000.");
	});
	const [isSample, setIsSample] = (0, import_react.useState)(true);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [loadingStepIdx, setLoadingStepIdx] = (0, import_react.useState)(0);
	const [source, setSource] = (0, import_react.useState)("fallback");
	const [error, setError] = (0, import_react.useState)(null);
	const stepInterval = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		return () => {
			if (stepInterval.current) clearInterval(stepInterval.current);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const q = new URLSearchParams(window.location.search).get("q");
		if (q) {
			setInput(q);
			setPlan(buildPlan(q));
			setIsSample(false);
		}
	}, []);
	const run = async (opts) => {
		setLoading(true);
		setError(null);
		setLoadingStepIdx(0);
		if (stepInterval.current) clearInterval(stepInterval.current);
		stepInterval.current = setInterval(() => {
			setLoadingStepIdx((prev) => (prev + 1) % LOADING_STEPS.length);
		}, 1200);
		try {
			const response = await generatePlan({ data: {
				prompt: input,
				...opts?.budget !== void 0 ? { budget: opts.budget } : {},
				...opts?.days !== void 0 ? { days: opts.days } : {},
				...opts?.travelers !== void 0 ? { travelers: opts.travelers } : {},
				...opts?.instruction !== void 0 ? { instruction: opts.instruction } : {},
				...opts?.currentPlan !== void 0 ? { currentPlan: opts.currentPlan } : {}
			} });
			setPlan(response.plan);
			setSource(response.source);
			setIsSample(false);
			if (response.source === "gemini") toast.success("Itinerary generated with Gemini 2.5 Flash!");
			else toast.info("Itinerary ready (SmartTrip Engine)", { description: response.note || "Fallback plan created with realistic estimates." });
		} catch (err) {
			const message = err instanceof Error ? err.message : "Failed to generate AI plan. Using offline fallback.";
			console.warn("AI generation failed:", message);
			setError(message);
			const fallbackPlan = buildPlan(input, opts);
			setPlan(fallbackPlan);
			setSource("fallback");
			setIsSample(false);
			toast.error("AI service error", { description: message + " Displaying offline plan." });
		} finally {
			if (stepInterval.current) clearInterval(stepInterval.current);
			setLoading(false);
		}
	};
	const handlePlanUpdate = (updated) => {
		setPlan(updated);
		try {
			localStorage.setItem("smarttrip.current_plan", JSON.stringify(updated));
		} catch {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "ai",
		className: cn("container-page", compact ? "py-10" : "py-24"),
		children: [!compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
			eyebrow: "Ask AI",
			title: "Meet Your AI Travel Planner",
			subtitle: "Tell us your dream trip. SmartTrip & Google Gemini will craft your perfect itinerary."
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
				className: "surface-card bg-gradient-sky p-6 sm:p-7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "relative flex size-11 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "animate-pulse-ring absolute inset-0 rounded-2xl border border-primary" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display font-bold",
								children: "SmartTrip AI"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								className: "bg-primary/10 text-primary border-primary/20 text-[10px] px-1.5 py-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-2.5 mr-1" }), " Gemini Powered"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: loading ? LOADING_STEPS[loadingStepIdx] : "Online · Flash intelligence in seconds"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 rounded-3xl bg-card/80 p-4 shadow-soft border border-border/40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs font-semibold text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Your Trip Prompt" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: cn(input.length > 900 ? "text-destructive" : "text-muted-foreground/70"),
								children: [input.length, "/1000"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: input,
							maxLength: 1e3,
							onChange: (e) => setInput(e.target.value),
							rows: 3,
							className: "mt-1 resize-none border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0",
							"aria-label": "Describe your trip",
							placeholder: "E.g., I want a 5-day trip to Himachal Pradesh for 3 people under ₹35,000 with trekking and local cafes...",
							"data-testid": "planner-prompt-input"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: quickPrompts.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setInput(`Plan a ${q.toLowerCase()} for 2 people under ₹30,000.`),
							className: "rounded-full border border-border bg-card/70 px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary hover:text-primary",
							children: q
						}, q))
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex items-center justify-between gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: error
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							className: "h-6 px-2 text-xs text-destructive hover:bg-destructive/20",
							onClick: () => run(),
							children: "Retry"
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "hero",
						size: "xl",
						className: "mt-5 w-full gap-2",
						onClick: () => run(),
						disabled: loading,
						"data-testid": "generate-plan-button",
						children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), "Generating Itinerary…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "size-4" }), "Generate My Trip"] })
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				delay: 80,
				className: "surface-card p-6 sm:p-7",
				children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanSkeleton, { message: LOADING_STEPS[loadingStepIdx] ?? "Crafting itinerary…" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanView, {
					plan,
					sample: isSample,
					prompt: input,
					source,
					loading,
					onPlanUpdate: handlePlanUpdate,
					onReplan: (opts) => run(opts),
					onRefine: (instruction, opts) => run({
						...opts,
						instruction,
						currentPlan: plan
					})
				})
			})]
		})]
	});
}
function PlanSkeleton({ message }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-5 animate-spin text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold text-primary uppercase tracking-wider",
						children: "AI Crafting Your Plan"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-foreground transition-all duration-300",
						children: message
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-7 w-2/3 animate-pulse rounded-full bg-muted" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-full animate-pulse rounded-full bg-muted" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-5/6 animate-pulse rounded-full bg-muted" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 grid gap-3",
				children: [
					0,
					1,
					2,
					3
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-16 animate-pulse rounded-2xl bg-muted/60" }, i))
			})
		]
	});
}
function PlanView({ plan, sample, prompt, source, loading, onPlanUpdate, onReplan, onRefine }) {
	const [budget, setBudget] = (0, import_react.useState)(plan.budget);
	const [days, setDays] = (0, import_react.useState)(plan.days.length);
	const [travelers, setTravelers] = (0, import_react.useState)(plan.travelers);
	const [sharing, setSharing] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setBudget(plan.budget);
		setDays(plan.days.length);
		setTravelers(plan.travelers);
	}, [plan]);
	const share = async () => {
		setSharing(true);
		try {
			const res = await savePublicPlanFn({ data: { plan } });
			const publicUrl = `${window.location.origin}/plan/${res.id}`;
			if (navigator.share) try {
				await navigator.share({
					title: plan.title,
					url: publicUrl
				});
				toast.success("Plan shared!");
				return;
			} catch {}
			await navigator.clipboard.writeText(publicUrl);
			toast.success("Public share link copied!", { description: "Anyone with this link can view your itinerary at /plan/" + res.id });
		} catch (err) {
			console.error("Public share failed:", err);
			const fallbackUrl = `${window.location.origin}/ai-planner?q=${encodeURIComponent(prompt)}`;
			try {
				await navigator.clipboard.writeText(fallbackUrl);
				toast.success("Share link copied!");
			} catch {
				toast.info("Share URL: " + fallbackUrl);
			}
		} finally {
			setSharing(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "animate-fade-in print-area",
		children: [
			sample ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 inline-block rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground",
				children: "Sample itinerary — describe your trip and hit Generate"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 mb-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold tracking-wide text-primary uppercase",
						children: "AI itinerary"
					}), source === "gemini" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						className: "bg-gradient-to-r from-violet-600 to-indigo-600 text-white gap-1 py-0.5 px-2 text-[11px] border-0 font-medium shadow-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3" }), " Gemini 2.5 Flash"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "secondary",
						className: "gap-1 py-0.5 px-2 text-[11px] font-medium text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "size-3" }), " SmartTrip Engine"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-xl font-bold capitalize",
					children: plan.title
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "rounded-full bg-leaf/20 px-3 py-1.5 text-sm font-semibold text-leaf-foreground",
					children: ["Est. ", inr(plan.budget)]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted-foreground",
				children: plan.summary
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap items-center gap-2 border-y border-border/50 py-3 print:hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-semibold text-muted-foreground mr-1",
						children: "Quick refine:"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						disabled: loading,
						onClick: () => onRefine("Regenerate alternative itinerary with a fresh route, different attractions, and new activities", {
							budget,
							days,
							travelers
						}),
						className: "rounded-full h-8 text-xs gap-1.5 hover:border-primary hover:text-primary transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: cn("size-3.5", loading && "animate-spin") }), " Regenerate"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						disabled: loading,
						onClick: () => {
							const cheaperBudget = Math.max(5e3, Math.round(budget * .8 / 1e3) * 1e3);
							setBudget(cheaperBudget);
							onRefine("Make it cheaper: optimize for budget stays, hostels/guesthouses, public transit, street food, and free sights", {
								budget: cheaperBudget,
								days,
								travelers
							});
						},
						className: "rounded-full h-8 text-xs gap-1.5 hover:border-leaf hover:text-leaf transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "size-3.5" }), " Make it cheaper"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						disabled: loading,
						onClick: () => onRefine("Add more adventure: include high-adrenaline outdoor activities, hikes, rafting, camping, and thrilling local experiences", {
							budget,
							days,
							travelers
						}),
						className: "rounded-full h-8 text-xs gap-1.5 hover:border-amber-500 hover:text-amber-500 transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-3.5" }), " Add more adventure"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid grid-cols-3 gap-2 rounded-2xl border border-border bg-surface p-3 print:hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
						label: "Budget ₹",
						value: budget,
						onChange: setBudget,
						step: 1e3
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
						label: "Days",
						value: days,
						onChange: setDays
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
						label: "Travelers",
						value: travelers,
						onChange: setTravelers
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "soft",
						size: "sm",
						disabled: loading,
						className: "col-span-3 gap-1.5",
						onClick: () => onReplan({
							budget,
							days,
							travelers
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: cn("size-3.5", loading && "animate-spin") }), " Re-optimize this plan"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
					fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3 py-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-24 w-full animate-pulse rounded-2xl bg-muted/30" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-24 w-full animate-pulse rounded-2xl bg-muted/30" })]
					}),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItineraryEditor, {
						plan,
						onPlanChange: onPlanUpdate
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-3 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoBox, {
						title: "Stays",
						items: plan.stays
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoBox, {
						title: "Transport",
						items: [plan.transport]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoBox, {
						title: "Food picks",
						items: plan.food
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoBox, {
						title: "Weather",
						items: [plan.weather]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoBox, {
						title: "Packing",
						items: plan.packing
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoBox, {
						title: "Travel tips",
						items: plan.tips
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoBox, {
						title: "Budget breakdown",
						items: plan.breakdown.map((b) => `${b.label}: ${inr(b.amount)}`)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-surface p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-center gap-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, { className: "size-3.5" }), " Carbon estimate"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm",
								children: [
									"~",
									plan.carbonKg,
									" kg CO2e per person, round trip"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Rough estimate by distance & transport mode"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-wrap gap-2 print:hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "soft",
						className: "flex-1 gap-1.5",
						onClick: () => window.print(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), " PDF"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "soft",
						className: "flex-1 gap-1.5",
						disabled: sharing,
						onClick: share,
						children: [sharing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-4" }), "Share link"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "hero",
						className: "flex-1 gap-1.5",
						"data-testid": "save-plan-button",
						onClick: () => {
							const trip = smartTrip.savePlan(plan);
							toast.success("Plan saved to My Trips", { description: trip.name });
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookmarkPlus, { className: "size-4" }), " Save to My Trips"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "soft",
						asChild: true,
						className: "flex-1 gap-1.5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/bookings",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" }), " Book this trip"]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 border-t border-border/50 pt-8 print:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickTravelGuide, { compact: true })
			})
		]
	});
}
function InfoBox({ title, items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-surface p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-semibold tracking-wide text-muted-foreground uppercase",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-2 space-y-1 text-sm",
			children: items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: i }, i))
		})]
	});
}
function NumField({ label, value, onChange, step = 1 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "text-xs font-semibold text-muted-foreground",
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "number",
			min: 1,
			step,
			value,
			onChange: (e) => onChange(Number(e.target.value) || 1),
			className: "mt-1 w-full rounded-lg border border-input bg-card px-2 py-1 text-sm text-foreground"
		})]
	});
}
//#endregion
export { AiPlanner as t };
