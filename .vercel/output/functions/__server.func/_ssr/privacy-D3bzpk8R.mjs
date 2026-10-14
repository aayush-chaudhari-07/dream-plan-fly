import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as Shield, et as Lock, u as UserCheck, vt as EyeOff, wt as Cookie, xt as Database } from "../_libs/lucide-react.mjs";
import { f as Navbar, u as Footer } from "./Navbar-G5xs2vbg.mjs";
import { t as SupportDock } from "./SupportDock-BQEj3o76.mjs";
import { t as PageHeader } from "./PageHeader-CiBUEnzv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/privacy-D3bzpk8R.js
var import_jsx_runtime = require_jsx_runtime();
function PrivacyPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col bg-background selection:bg-primary/20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Privacy Policy",
				subtitle: "We believe in privacy by design. We don't sell data, track you across websites, or capture payment credentials."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "container-page flex-1 py-12 max-w-4xl mx-auto space-y-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card rounded-3xl p-6 sm:p-8 border border-border shadow-elevated",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 text-primary mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "size-6" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl font-bold text-foreground",
								children: "SmartTrip Privacy Commitment"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm leading-relaxed text-muted-foreground",
							children: "SmartTrip is engineered to deliver intelligent travel planning without invasive tracking or intrusive analytics. We do not use third-party advertising cookies, data brokers, or paid surveillance tools."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "surface-card rounded-3xl p-6 sm:p-8 space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-lg font-bold text-foreground",
								children: "1. Information We Collect"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "space-y-3 text-sm text-muted-foreground list-disc list-inside",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: "Account Information:"
								}), " When you register an account, we store your email address, chosen display name, avatar, and preferred currency in our secure Supabase database protected by Row Level Security (RLS)."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: "Saved Plans & Wishlists:"
								}), " Trips you save, destinations in your wishlist, Trip Fund targets, and simulated demo bookings are saved to your account so you can access them across devices."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-foreground",
										children: "Guest Mode:"
									}),
									" If you use SmartTrip without signing in, all itineraries, wishlists, and simulated bookings are retained strictly in your device's browser ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "localStorage" }),
									"."
								] })
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "surface-card rounded-3xl p-6 sm:p-8 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 text-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-lg font-bold text-foreground",
									children: "2. AI Processing & Google Gemini"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm leading-relaxed text-muted-foreground",
								children: "When you request an AI travel plan, your travel criteria (destination name, duration, budget, traveler count, and travel interests) are transmitted server-side to the Google Gemini Flash API to synthesize an itinerary."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "space-y-2 text-sm text-muted-foreground list-disc list-inside",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "We do NOT transmit your email, real name, or location to the AI model." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "API calls are governed by Google Generative AI enterprise privacy protocols and are cached in server memory for 24 hours to conserve free quotas." })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "surface-card rounded-3xl p-6 sm:p-8 space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cookie, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-lg font-bold text-foreground",
								children: "3. Cookies & Session Storage"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm leading-relaxed text-muted-foreground",
							children: [
								"SmartTrip uses strictly essential cookies required for user authentication sessions (Supabase auth tokens) and ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "localStorage" }),
								" for offline guest preferences. We do not use marketing or cross-site tracking cookies."
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "surface-card rounded-3xl p-6 sm:p-8 space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-lg font-bold text-foreground",
								children: "4. Payment & Financial Data"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm leading-relaxed text-muted-foreground",
							children: [
								"SmartTrip operates purely in ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "simulated demo mode" }),
								". We do NOT collect, process, or store real credit card numbers, CVVs, bank account PINs, or live payment credentials. Demo forms accept mock test numbers that are verified by mock algorithms."
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "surface-card rounded-3xl p-6 sm:p-8 space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-lg font-bold text-foreground",
								children: "5. Your Data Rights & Deletion"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm leading-relaxed text-muted-foreground",
							children: [
								"You retain full ownership of your data. You may delete any saved trip, fund, booking, or wishlist entry directly from your account at any time. To request full deletion of your user profile, contact support or submit a request via our",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/faq",
									className: "text-primary underline hover:text-primary/80",
									children: "Help Center"
								}),
								"."
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupportDock, {})
		]
	});
}
//#endregion
export { PrivacyPage as component };
