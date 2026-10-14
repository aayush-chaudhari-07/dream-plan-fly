import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { _ as createRootRouteWithContext, b as useRouter, d as HeadContent, g as createFileRoute, h as lazyRouteComponent, m as Outlet, p as createRouter, u as Scripts, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as queryClient } from "./smarttrip-store-B4h7bmlO.mjs";
import { F as RefreshCw, Tt as Compass, X as MapPin, a as WandSparkles, f as TriangleAlert, lt as House } from "../_libs/lucide-react.mjs";
import { n as isSupabaseConfigured, t as getSupabaseBrowserClient } from "./client-Hc8aN5M7.mjs";
import { t as AuthProvider } from "./auth-context-BwjyU4uq.mjs";
import { t as createSeoHead } from "./seo-BqVdh5S9.mjs";
import { t as Route$11 } from "../_id-jCm0H5QB.mjs";
import { t as Route$12 } from "../_id-BlZT7-ll.mjs";
import { t as Route$13 } from "../_id-2kz4DXw_.mjs";
import { t as Route$14 } from "./bookings-4Fhqrkk9.mjs";
import { t as Route$15 } from "./checkout-D1VXmyhJ.mjs";
import { t as Route$16 } from "./login-CErOULlG.mjs";
import { t as Route$17 } from "./signup-DnrbfFhD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-C0P0Wd_l.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
var styles_default = "/assets/styles-BHDahG8R.css";
/**
* Application error reporting utility.
* Logs errors in development and acts as a free monitoring integration
* that stores telemetry in the Supabase `error_logs` table.
*/
function reportError(error, context = {}) {
	const errorMessage = error instanceof Error ? error.message : String(error);
	const errorStack = error instanceof Error ? error.stack : void 0;
	const currentUrl = typeof window !== "undefined" ? window.location.href : typeof context.url === "string" ? context.url : void 0;
	const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : void 0;
	console.error("[SmartTrip Error]", {
		message: errorMessage,
		stack: errorStack,
		context
	});
	if (!isSupabaseConfigured()) return;
	Promise.resolve().then(async () => {
		try {
			await getSupabaseBrowserClient().from("error_logs").insert({
				message: errorMessage,
				stack: errorStack || null,
				url: currentUrl || null,
				user_agent: userAgent || null,
				boundary: context.boundary || "unknown",
				metadata: context
			});
		} catch {}
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "flex min-h-screen items-center justify-center bg-background px-4 py-16",
		role: "main",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "surface-card max-w-lg w-full p-8 sm:p-10 text-center rounded-3xl shadow-elevated border border-border",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto flex size-16 items-center justify-center rounded-3xl bg-primary/10 text-primary mb-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "size-8" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-bold uppercase tracking-wider text-primary",
					children: "Error 404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-3xl font-extrabold text-foreground sm:text-4xl",
					children: "Off the Map"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm leading-relaxed text-muted-foreground",
					children: "The destination or page you're searching for hasn't been chartered yet. Let's get you back on course."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-col sm:flex-row items-center justify-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 shadow-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "size-4" }), " Go Home"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/explore",
						className: "w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-accent",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-4" }), " Explore Places"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 pt-6 border-t border-border flex items-center justify-center gap-6 text-xs text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/ai-planner",
							className: "hover:text-primary transition-colors inline-flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "size-3.5" }), " AI Planner"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/bookings",
							className: "hover:text-primary transition-colors",
							children: "Bookings"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/faq",
							className: "hover:text-primary transition-colors",
							children: "Help Center"
						})
					]
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	const errorMessage = error instanceof Error ? error.message : typeof error === "string" ? error : void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "flex min-h-screen items-center justify-center bg-background px-4 py-16",
		role: "alert",
		"aria-live": "assertive",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "surface-card max-w-lg w-full p-8 sm:p-10 text-center rounded-3xl shadow-elevated border border-border",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto flex size-16 items-center justify-center rounded-3xl bg-destructive/10 text-destructive mb-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-8" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-bold uppercase tracking-wider text-destructive",
					children: "Application Error"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl",
					children: "Something went wrong"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm leading-relaxed text-muted-foreground",
					children: "We encountered an unexpected glitch loading this view. The telemetry has been logged to our free error monitoring system."
				}),
				errorMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 rounded-xl bg-muted/60 p-3 text-left font-mono text-xs text-muted-foreground overflow-x-auto max-h-24",
					children: errorMessage
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-col sm:flex-row items-center justify-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 shadow-md cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-4" }), " Try Again"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: "/",
						className: "w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-accent",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "size-4" }), " Go Home"]
					})]
				})
			]
		})
	});
}
var Route$10 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "SmartTrip — AI Travel Planner & Booking" },
			{
				name: "description",
				content: "Plan less, travel more. SmartTrip is your AI-powered companion for discovering destinations, building itineraries, saving for trips and booking travel."
			},
			{
				name: "author",
				content: "SmartTrip"
			},
			{
				property: "og:title",
				content: "SmartTrip — AI Travel Planner & Booking"
			},
			{
				property: "og:description",
				content: "Plan less, travel more. SmartTrip is your AI-powered companion for discovering destinations, building itineraries, saving for trips and booking travel."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:site",
				content: "@smarttrip"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Sora:wght@500;600;700;800&display=swap"
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$10.useRouteContext();
	(0, import_react.useEffect)(() => {
		document.body.setAttribute("data-hydrated", "true");
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			position: "bottom-right",
			richColors: true
		})] })
	});
}
var $$splitComponentImporter$9 = () => import("./routes-BpGNf1Qb.mjs");
var Route$9 = createFileRoute("/")({
	head: () => createSeoHead({
		title: "SmartTrip — AI Travel Planner & Booking Platform",
		description: "Plan less, travel more. SmartTrip is your AI-powered companion for discovering destinations, crafting personalized itineraries, saving for trips and demo-booking flights and stays.",
		path: "/",
		jsonLd: {
			"@context": "https://schema.org",
			"@type": "WebSite",
			name: "SmartTrip",
			url: "https://dream-plan-fly.vercel.app",
			potentialAction: {
				"@type": "SearchAction",
				target: "https://dream-plan-fly.vercel.app/bookings?destination={search_term_string}",
				"query-input": "required name=search_term_string"
			}
		}
	}),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./ai-planner-DZWFypHr.mjs");
var Route$8 = createFileRoute("/ai-planner")({
	head: () => createSeoHead({
		title: "AI Trip Planner — Personalized Itineraries",
		description: "Describe your dream trip to SmartTrip AI to generate comprehensive day-by-day itineraries, exact cost breakdowns, verified stays, and custom packing checklists.",
		path: "/ai-planner"
	}),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./explore-8bKsfDzA.mjs");
var Route$7 = createFileRoute("/explore")({
	head: () => createSeoHead({
		title: "Explore Destinations",
		description: "Discover hand-picked destinations across India and the world. Filter by category, compare prices and plan your next journey.",
		path: "/explore"
	}),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./faq-DnmHnZ5G.mjs");
var Route$6 = createFileRoute("/faq")({
	head: () => createSeoHead({
		title: "Help Center & FAQ — Travel Support",
		description: "Find instant answers to questions regarding AI trip generation, booking modifications, refunds, Trip Fund milestones, and 24/7 traveler emergency support.",
		path: "/faq",
		jsonLd: {
			"@context": "https://schema.org",
			"@type": "FAQPage",
			mainEntity: [
				{
					"@type": "Question",
					name: "How does SmartTrip AI plan my itinerary?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "SmartTrip analyzes your destination, budget in INR, group size, and interests to craft a complete day-by-day plan with attractions, verified stays, and local tips."
					}
				},
				{
					"@type": "Question",
					name: "Are the bookings real or demo?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "All bookings run in a high-fidelity DEMO mode for simulation and portfolio purposes. No real credit card charges are processed."
					}
				},
				{
					"@type": "Question",
					name: "Is SmartTrip free to use?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "Yes, SmartTrip is 100% free with key-less open data integrations including Open-Meteo weather and Frankfurter currency conversions."
					}
				}
			]
		}
	}),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./my-trips-DIFs9Yk3.mjs");
var Route$5 = createFileRoute("/my-trips")({
	head: () => createSeoHead({
		title: "My Trips & Itineraries",
		description: "Track upcoming trips, past adventures, saved AI plans, bookings and your wishlist in one SmartTrip dashboard.",
		path: "/my-trips",
		noindex: true
	}),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./privacy-D3bzpk8R.mjs");
var Route$4 = createFileRoute("/privacy")({
	head: () => createSeoHead({
		title: "Privacy Policy",
		description: "Understand how SmartTrip handles your personal data, local preferences, cookies, and AI trip planning prompts.",
		path: "/privacy"
	}),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./save-CfCk7pOo.mjs");
var Route$3 = createFileRoute("/save")({
	head: () => ({ meta: [
		{ title: "Save for Your Trip — SmartTrip" },
		{
			name: "description",
			content: "Start a trip fund, track savings and get AI-powered reminders to make your dream vacation happen."
		},
		{
			property: "og:title",
			content: "Save for Your Trip — SmartTrip"
		},
		{
			property: "og:description",
			content: "Start a trip fund, track savings and get AI-powered reminders to make your dream vacation happen."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./settings-CkQ3wxMR.mjs");
var Route$2 = createFileRoute("/settings")({
	head: () => createSeoHead({
		title: "Account & Travel Preferences",
		description: "Manage your profile, avatar, home city and preferred currency on SmartTrip.",
		path: "/settings",
		noindex: true
	}),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./terms-Bjo7y9ub.mjs");
var Route$1 = createFileRoute("/terms")({
	head: () => createSeoHead({
		title: "Terms of Service & Disclaimers",
		description: "SmartTrip Terms of Service including essential AI itinerary planning advice disclaimers and simulated demo-booking terms.",
		path: "/terms"
	}),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./callback-CjDx79Qt.mjs");
var Route = createFileRoute("/auth/callback")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var rootRouteChildren = {
	IndexRoute: Route$9.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$10
	}),
	AiPlannerRoute: Route$8.update({
		id: "/ai-planner",
		path: "/ai-planner",
		getParentRoute: () => Route$10
	}),
	BookingsRoute: Route$14.update({
		id: "/bookings",
		path: "/bookings",
		getParentRoute: () => Route$10
	}),
	CheckoutRoute: Route$15.update({
		id: "/checkout",
		path: "/checkout",
		getParentRoute: () => Route$10
	}),
	ExploreRoute: Route$7.update({
		id: "/explore",
		path: "/explore",
		getParentRoute: () => Route$10
	}),
	FaqRoute: Route$6.update({
		id: "/faq",
		path: "/faq",
		getParentRoute: () => Route$10
	}),
	LoginRoute: Route$16.update({
		id: "/login",
		path: "/login",
		getParentRoute: () => Route$10
	}),
	MyTripsRoute: Route$5.update({
		id: "/my-trips",
		path: "/my-trips",
		getParentRoute: () => Route$10
	}),
	PrivacyRoute: Route$4.update({
		id: "/privacy",
		path: "/privacy",
		getParentRoute: () => Route$10
	}),
	SaveRoute: Route$3.update({
		id: "/save",
		path: "/save",
		getParentRoute: () => Route$10
	}),
	SettingsRoute: Route$2.update({
		id: "/settings",
		path: "/settings",
		getParentRoute: () => Route$10
	}),
	SignupRoute: Route$17.update({
		id: "/signup",
		path: "/signup",
		getParentRoute: () => Route$10
	}),
	TermsRoute: Route$1.update({
		id: "/terms",
		path: "/terms",
		getParentRoute: () => Route$10
	}),
	AuthCallbackRoute: Route.update({
		id: "/auth/callback",
		path: "/auth/callback",
		getParentRoute: () => Route$10
	}),
	BookingConfirmationIdRoute: Route$11.update({
		id: "/booking-confirmation/$id",
		path: "/booking-confirmation/$id",
		getParentRoute: () => Route$10
	}),
	DestinationIdRoute: Route$12.update({
		id: "/destination/$id",
		path: "/destination/$id",
		getParentRoute: () => Route$10
	}),
	PlanIdRoute: Route$13.update({
		id: "/plan/$id",
		path: "/plan/$id",
		getParentRoute: () => Route$10
	})
};
var routeTree = Route$10._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
