import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as ShieldCheck, Xt as BookOpen, ct as Info, f as TriangleAlert } from "../_libs/lucide-react.mjs";
import { f as Navbar, u as Footer } from "./Navbar-G5xs2vbg.mjs";
import { t as SupportDock } from "./SupportDock-BQEj3o76.mjs";
import { t as PageHeader } from "./PageHeader-CiBUEnzv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/terms-Bjo7y9ub.js
var import_jsx_runtime = require_jsx_runtime();
function TermsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col bg-background selection:bg-primary/20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Terms of Service & Disclaimers",
				subtitle: "Please review our terms of use, including critical disclaimers regarding AI trip planning and demo booking services."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "container-page flex-1 py-12 max-w-4xl mx-auto space-y-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-3xl border-2 border-amber-500/30 bg-amber-500/5 p-6 sm:p-8 backdrop-blur-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-2xl bg-amber-500/20 p-3 text-amber-600 dark:text-amber-400",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-6" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-display text-xl font-bold text-foreground",
										children: "1. Demo-Booking & Payment Simulation Disclaimer"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm leading-relaxed text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-foreground",
												children: "SmartTrip is a portfolio and demonstration project."
											}),
											" ",
											"All flight itineraries, hotel rooms, transit options, car rentals, package deals, fares, and seat availability displayed across this platform are generated from seeded catalog data or deterministic algorithmic models."
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
										className: "space-y-2 text-sm text-muted-foreground list-disc list-inside",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-foreground",
												children: "Zero Real Financial Transactions:"
											}), " No real credit card, UPI, net banking, or wallet transactions are charged. All payment gateways operate entirely in demo test mode."] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-foreground",
													children: "No Passenger Reservations:"
												}),
												" Any generated boarding passes, booking references (e.g., #STBK-...), or downloadable E-tickets are purely simulated digital artifacts and have",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "no legal or operational validity" }),
												" with airlines, hotels, or transport operators."
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Do not present SmartTrip demo tickets to airport security, airline counters, or hotel check-in desks." })
										]
									})
								]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-3xl border-2 border-primary/30 bg-primary/5 p-6 sm:p-8 backdrop-blur-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-2xl bg-primary/20 p-3 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "size-6" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-display text-xl font-bold text-foreground",
										children: "2. AI-Generated Advice & Itinerary Disclaimer"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm leading-relaxed text-muted-foreground",
										children: "Itineraries, estimated budgets, attraction schedules, weather insights, and packing recommendations are synthesized by artificial intelligence (Google Gemini Flash and rule-based engines)."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
										className: "space-y-2 text-sm text-muted-foreground list-disc list-inside",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-foreground",
												children: "Indicative Guidance Only:"
											}), " AI trip plans serve as educational and inspirational starting points. Actual operational hours, ticket fees, road conditions, and seasonal closures change frequently."] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-foreground",
												children: "Traveler Due Diligence:"
											}), " Travelers are solely responsible for verifying entry requirements, visa protocols, government travel advisories, health guidelines, and safety warnings prior to traveling."] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "SmartTrip assumes no liability for missed connections, weather anomalies, medical emergencies, or financial losses incurred from relying on AI recommendations." })
										]
									})
								]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "surface-card rounded-3xl p-6 sm:p-8 space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-lg font-bold text-foreground",
								children: "3. Acceptable Use"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm leading-relaxed text-muted-foreground",
							children: "You agree to use SmartTrip solely for lawful, non-commercial planning purposes. You must not attempt to abuse server endpoints, circumvent rate limiters, probe API vulnerabilities, or submit malicious or abusive prompts to the AI planner."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "surface-card rounded-3xl p-6 sm:p-8 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 text-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-lg font-bold text-foreground",
									children: "4. Open Data Attributions"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm leading-relaxed text-muted-foreground",
								children: "SmartTrip proudly operates on free, open infrastructure:"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "space-y-2 text-sm text-muted-foreground list-disc list-inside",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										"Live weather forecasts are provided under open attribution by",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: "https://open-meteo.com",
											target: "_blank",
											rel: "noreferrer",
											className: "text-primary underline hover:text-primary/80",
											children: "Open-Meteo.com"
										}),
										" ",
										"(CC BY 4.0)."
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										"Currency conversion data is provided by",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: "https://www.frankfurter.app",
											target: "_blank",
											rel: "noreferrer",
											className: "text-primary underline hover:text-primary/80",
											children: "Frankfurter API"
										}),
										" ",
										"based on European Central Bank reference rates."
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										"Map cartography and point-of-interest tiles are provided courtesy of",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: "https://www.openstreetmap.org/copyright",
											target: "_blank",
											rel: "noreferrer",
											className: "text-primary underline hover:text-primary/80",
											children: "OpenStreetMap contributors"
										}),
										"."
									] })
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "surface-card rounded-3xl p-6 sm:p-8 space-y-4 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-lg font-bold text-foreground",
							children: "Questions or Feedback?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground max-w-lg mx-auto",
							children: [
								"Have questions about our terms or open demo environment? Visit our",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/faq",
									className: "text-primary underline hover:text-primary/80",
									children: "Help Center & FAQ"
								}),
								" ",
								"or review our",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/privacy",
									className: "text-primary underline hover:text-primary/80",
									children: "Privacy Policy"
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
export { TermsPage as component };
