import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-BSij73O2.mjs";
import { c as inr, r as destinations } from "./travel-Co-Z1Moz.mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { h as useSmartTrip, u as smartTrip } from "./smarttrip-store-B4h7bmlO.mjs";
import { n as SectionHeading, t as Reveal } from "./Reveal-YnFTFRXl.mjs";
import { At as Clock, F as RefreshCw, Ft as CircleAlert, Nt as CircleCheck, V as Plane, Wt as CalendarDays, ft as Heart, h as Ticket, m as Trash2, o as Wallet, x as Sparkles, y as Star } from "../_libs/lucide-react.mjs";
import { n as useAuth } from "./auth-context-BwjyU4uq.mjs";
import { f as Navbar, u as Footer } from "./Navbar-G5xs2vbg.mjs";
import { t as SupportDock } from "./SupportDock-BQEj3o76.mjs";
import { t as PageHeader } from "./PageHeader-CiBUEnzv.mjs";
import { t as Skeleton } from "./skeleton-BSPs1QJQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/my-trips-DIFs9Yk3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var buckets = [
	"Upcoming",
	"Past",
	"Saved"
];
var headings = {
	Upcoming: {
		title: "Coming Up Soon",
		subtitle: "Trips with confirmed bookings."
	},
	Past: {
		title: "Where You've Been",
		subtitle: "Memories and ratings."
	},
	Saved: {
		title: "Saved for Later",
		subtitle: "Ideas and AI plans waiting for the right moment."
	}
};
function TripCard({ trip }) {
	const Icon = trip.bucket === "Past" ? Star : trip.bucket === "Saved" ? Clock : CalendarDays;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-card overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative h-48",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: trip.image,
					alt: trip.name,
					loading: "lazy",
					decoding: "async",
					className: "size-full object-cover"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-card/90 px-3 py-1 text-xs font-semibold",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3" }),
						" ",
						trip.bucket
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": `Remove ${trip.name}`,
					onClick: () => {
						smartTrip.removeTrip(trip.id);
						toast.message("Trip removed", { description: trip.name });
					},
					className: "absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-card/85 text-foreground/70 backdrop-blur transition-transform hover:scale-110 hover:text-destructive",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-lg font-bold",
					children: trip.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: trip.dates
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-1.5",
					children: trip.status.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4 text-leaf" }),
							" ",
							s
						]
					}, s))
				}),
				trip.plan ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
					className: "mt-4 rounded-2xl bg-secondary/50 p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
						className: "cursor-pointer text-sm font-semibold",
						children: ["View AI itinerary · est. ", inr(trip.plan.budget)]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-3 space-y-2",
						children: trip.plan.days.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-semibold",
								children: [
									d.day,
									" — ",
									d.title
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-0.5 space-y-0.5 text-muted-foreground",
								children: d.items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: i }, i))
							})]
						}, d.day))
					})]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap gap-2",
					children: [trip.bucket === "Saved" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "soft",
						size: "sm",
						className: "rounded-full",
						onClick: () => {
							smartTrip.moveTrip(trip.id, "Upcoming");
							toast.success("Moved to upcoming", { description: trip.name });
						},
						children: "Mark as booked"
					}) : null, trip.bucket === "Upcoming" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "soft",
						size: "sm",
						className: "rounded-full",
						onClick: () => {
							smartTrip.moveTrip(trip.id, "Past");
							toast.success("Trip completed", { description: "Hope it was a good one!" });
						},
						children: "Mark as completed"
					}) : null]
				})
			]
		})]
	}) });
}
function EmptyBucket({ bucket }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "col-span-full rounded-3xl bg-secondary/50 py-14 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: bucket === "Saved" ? "No saved plans yet — generate one with the AI planner." : bucket === "Upcoming" ? "Nothing booked yet. Book a flight, stay or package to see it here." : "No completed trips yet."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "soft",
			size: "sm",
			asChild: true,
			className: "mt-4 rounded-full",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: bucket === "Saved" ? "/ai-planner" : "/bookings",
				children: bucket === "Saved" ? "Open AI planner" : "Browse bookings"
			})
		})]
	});
}
function MyTripsPage() {
	const { user, isLoading: authLoading, isConfigured } = useAuth();
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		if (isConfigured && !authLoading && !user) navigate({
			to: "/login",
			search: { redirect: "/my-trips" }
		});
	}, [
		isConfigured,
		authLoading,
		user,
		navigate
	]);
	const { trips, bookings, funds, wishlist, isLoading, isError, refetch } = useSmartTrip();
	const wished = destinations.filter((d) => wishlist.includes(d.id));
	const totalSaved = funds.reduce((s, f) => s + f.saved, 0);
	const bookingTotal = bookings.reduce((s, b) => s + b.price, 0);
	const stats = [
		{
			icon: Plane,
			label: "Trips tracked",
			value: String(trips.length)
		},
		{
			icon: Ticket,
			label: "Bookings",
			value: String(bookings.length)
		},
		{
			icon: Wallet,
			label: "Saved in funds",
			value: inr(totalSaved)
		},
		{
			icon: Heart,
			label: "Wishlisted",
			value: String(wished.length)
		}
	];
	if (authLoading || isConfigured && isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "My Trips",
			subtitle: "Your upcoming adventures, past memories and saved plans — all in one dashboard."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "container-page py-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					1,
					2,
					3,
					4
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card flex items-center gap-3 p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "size-11 rounded-2xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-6 w-20" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3.5 w-28" })]
					})]
				}, i))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-48 rounded-xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-72 rounded-lg" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
						children: [
							1,
							2,
							3
						].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "surface-card overflow-hidden rounded-3xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-48 w-full rounded-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-5 space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-6 w-3/4" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-1/2" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-full" })
								]
							})]
						}, i))
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
	] });
	if (isError) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "My Trips",
			subtitle: "Your upcoming adventures, past memories and saved plans — all in one dashboard."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "container-page py-20 text-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card max-w-md mx-auto p-8 rounded-3xl shadow-elevated",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-10 text-destructive mx-auto mb-3" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-bold text-foreground",
						children: "Failed to Load Dashboard"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mt-2 mb-6",
						children: "There was an issue fetching your trips and bookings from the server."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "hero",
						size: "default",
						onClick: () => refetch?.(),
						className: "rounded-full gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-4" }), " Try Again"]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
	] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "My Trips",
			subtitle: "Your upcoming adventures, past memories and saved plans — all in one dashboard."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "container-page py-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
					children: stats.map(({ icon: Icon, label, value }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card flex items-center gap-3 p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex size-11 items-center justify-center rounded-2xl bg-secondary text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xl font-bold",
							children: value
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: label
						})] })]
					}, label))
				}),
				bookings.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-12",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
						align: "left",
						eyebrow: "Bookings",
						title: "Your Reservations",
						subtitle: `${bookings.length} booking${bookings.length > 1 ? "s" : ""} · ${inr(bookingTotal)} total`
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "surface-card mt-6 divide-y divide-border",
						children: bookings.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-3 p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display font-bold",
										children: b.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `rounded-full px-2 py-0.5 text-[10px] font-bold ${b.status === "cancelled" ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-500"}`,
										children: b.status === "cancelled" ? "Cancelled" : "Confirmed"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: b.subtitle
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-xs font-mono text-muted-foreground",
									children: ["Ref #", b.reference]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display text-lg font-bold text-primary",
										children: inr(b.price)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										size: "sm",
										asChild: true,
										className: "rounded-full text-xs",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/booking-confirmation/$id",
											params: { id: b.reference },
											children: "View E-Ticket"
										})
									}),
									b.status !== "cancelled" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "sm",
										className: "rounded-full text-destructive text-xs",
										onClick: () => {
											smartTrip.cancelBooking(b.id);
											toast.message("Booking cancelled", { description: b.title });
										},
										children: "Cancel"
									})
								]
							})]
						}, b.id))
					})]
				}) : null,
				buckets.map((bucket) => {
					const list = trips.filter((t) => t.bucket === bucket);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-12",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
							align: "left",
							eyebrow: bucket,
							title: headings[bucket].title,
							subtitle: headings[bucket].subtitle
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
							children: list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyBucket, { bucket }) : list.map((trip) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TripCard, { trip }, trip.id))
						})]
					}, bucket);
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-12",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
						align: "left",
						eyebrow: "Wishlist",
						title: "Places You Loved",
						subtitle: "Destinations you hearted while exploring."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4",
						children: wished.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-full rounded-3xl bg-secondary/50 py-14 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Nothing wishlisted yet — tap the heart on any destination."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "soft",
								size: "sm",
								asChild: true,
								className: "mt-4 rounded-full",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/explore",
									children: "Explore destinations"
								})
							})]
						}) : wished.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "surface-card overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: d.image,
								alt: d.name,
								loading: "lazy",
								decoding: "async",
								className: "h-32 w-full object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display font-bold",
										children: d.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: d.region
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-2 text-sm font-semibold text-primary",
										children: ["from ", inr(d.price)]
									})
								]
							})]
						}) }, d.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card mt-12 flex flex-wrap items-center justify-between gap-4 p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display font-bold",
						children: "Want a fresh start?"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Reset trips, bookings, funds and wishlist back to the SmartTrip demo data."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "hero",
							size: "pill",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/ai-planner",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {}), " Plan a new trip"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "pill",
							onClick: () => {
								smartTrip.reset();
								toast.success("Dashboard reset");
							},
							children: "Reset data"
						})]
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupportDock, {})
	] });
}
//#endregion
export { MyTripsPage as component };
