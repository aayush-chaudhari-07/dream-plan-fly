import { o as __toESM } from "./_runtime.mjs";
import { i as require_react } from "./_libs/dnd-kit__accessibility+react.mjs";
import { y as require_jsx_runtime } from "./_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./_ssr/button-BSij73O2.mjs";
import { c as inr } from "./_ssr/travel-Co-Z1Moz.mjs";
import { v as Link, y as useNavigate } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { h as useSmartTrip, u as smartTrip } from "./_ssr/smarttrip-store-B4h7bmlO.mjs";
import { Gt as Bus, Nt as CircleCheck, Q as Luggage, V as Plane, Vt as Car, en as Ban, nn as ArrowLeft, ut as Hotel, z as Printer } from "./_libs/lucide-react.mjs";
import { f as Navbar, u as Footer } from "./_ssr/Navbar-G5xs2vbg.mjs";
import { t as Route } from "./_id-jCm0H5QB.mjs";
import { t as SupportDock } from "./_ssr/SupportDock-BQEj3o76.mjs";
import { t as PageHeader } from "./_ssr/PageHeader-CiBUEnzv.mjs";
import { t as cancelBookingWithRefundFn } from "./_ssr/booking-actions-BrEaAsP7.mjs";
import { t as require_lib } from "./_libs/qrcode.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-BPCfYJdU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lib = /* @__PURE__ */ __toESM(require_lib());
function ETicketView({ booking, onCancel }) {
	const [qrDataUrl, setQrDataUrl] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const qrPayload = JSON.stringify({
			app: "SmartTrip Demo",
			pnr: booking.reference,
			kind: booking.kind,
			title: booking.title,
			traveler: booking.travelerDetails?.fullName || "Guest Traveler",
			paid: booking.price,
			status: booking.status || "confirmed",
			verificationUrl: typeof window !== "undefined" ? window.location.href : ""
		});
		import_lib.toDataURL(qrPayload, {
			width: 240,
			margin: 1,
			color: {
				dark: "#0f172a",
				light: "#ffffff"
			}
		}).then(setQrDataUrl).catch((err) => console.error("QR Code Generation Error:", err));
	}, [booking]);
	const handlePrint = () => {
		if (typeof window !== "undefined") window.print();
	};
	const IconComponent = booking.kind === "flight" ? Plane : booking.kind === "stay" ? Hotel : booking.kind === "rental" ? Car : booking.kind === "rail" ? Bus : Luggage;
	const isCancelled = booking.status === "cancelled";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full max-w-4xl mx-auto space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3 print:hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: `flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${isCancelled ? "bg-destructive/10 text-destructive border border-destructive/30" : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5" }), isCancelled ? "CANCELLED & REFUNDED" : "OFFICIAL RESERVATION CONFIRMED"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full bg-sunset/15 text-foreground px-2.5 py-0.5 text-xs font-semibold",
					children: "Demo E-Ticket"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [onCancel && !isCancelled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					size: "sm",
					onClick: onCancel,
					className: "rounded-full text-destructive hover:bg-destructive/10",
					"data-testid": "cancel-booking-btn",
					children: "Cancel Booking"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "hero",
					size: "sm",
					onClick: handlePrint,
					className: "rounded-full gap-2 shadow-soft",
					"data-testid": "download-eticket-btn",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-4" }), " Print / Save E-Ticket (PDF)"]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative overflow-hidden rounded-3xl border-2 border-border bg-card p-6 sm:p-8 shadow-xl print:shadow-none print:border-black print:p-6",
			id: "printable-eticket",
			"data-testid": "booking-confirmation",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute inset-0 flex items-center justify-center opacity-10 select-none rotate-[-25deg]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-display text-6xl sm:text-8xl font-black text-foreground tracking-widest text-center",
						children: [
							"DEMO TICKET",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"NOT VALID FOR TRAVEL"
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border/80 pb-6 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex size-12 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconComponent, { className: "size-6" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-2xl font-black tracking-tight",
								children: "SmartTrip"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-md bg-secondary px-2 py-0.5 text-[10px] font-mono font-bold text-muted-foreground uppercase",
								children: "E-Reservation Voucher"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								"Issue Date:",
								" ",
								new Date(booking.createdAt).toLocaleDateString("en-IN", {
									day: "numeric",
									month: "short",
									year: "numeric"
								})
							]
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sm:text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-bold text-muted-foreground uppercase tracking-wider block",
							children: "Booking Reference / PNR"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-2xl font-black text-primary tracking-widest",
							"data-testid": "booking-confirmation-ref",
							children: ["#", booking.reference]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-2 space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-semibold text-muted-foreground uppercase tracking-wide",
								children: "Travel / Reservation Item"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl sm:text-2xl font-bold text-foreground",
								children: booking.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-muted-foreground mt-0.5",
								children: booking.subtitle
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-semibold text-muted-foreground uppercase",
									children: "Status"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `text-sm font-bold capitalize ${isCancelled ? "text-destructive" : "text-emerald-500"}`,
									children: booking.status || "Confirmed"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-semibold text-muted-foreground uppercase",
									children: "Travelers"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm font-bold text-foreground",
									children: [booking.passengersCount || 1, " Passenger(s)"]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-semibold text-muted-foreground uppercase",
									children: "Cabin / Tier"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-bold text-foreground capitalize",
									children: booking.cabinClass || "Economy"
								})] })
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center justify-center p-3 rounded-2xl bg-secondary/30 border border-border/60",
						children: [qrDataUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: qrDataUrl,
							alt: `QR Verification for PNR ${booking.reference}`,
							width: 144,
							height: 144,
							decoding: "async",
							className: "size-36 rounded-xl object-contain bg-white p-1",
							"data-testid": "eticket-qr-code"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-36 rounded-xl bg-secondary animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-2 text-[10px] font-mono text-muted-foreground tracking-wider uppercase text-center",
							children: "Scan to Verify PNR"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-border/80 pt-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-bold text-muted-foreground uppercase tracking-wide",
							children: "Lead Traveler Details"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl bg-secondary/40 p-4 space-y-1.5 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Full Name:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-foreground",
										"data-testid": "confirmed-traveler-name",
										children: booking.travelerDetails?.fullName || "Aayush Chaudhari"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Email:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-foreground",
										children: booking.travelerDetails?.email || "traveler@smarttrip.demo"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Phone:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-foreground",
										children: booking.travelerDetails?.phone || "+91 98765 43210"
									})]
								}),
								booking.travelerDetails?.seatPreference && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Seat Preference:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground",
										children: booking.travelerDetails.seatPreference
									})]
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-bold text-muted-foreground uppercase tracking-wide",
							children: "Payment & Fare Receipt"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl bg-secondary/40 p-4 space-y-1.5 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Base Fare:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-foreground",
										children: inr(booking.fareBreakdown?.baseFare || Math.round(booking.price / 1.12))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Taxes & GST (12%):"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-foreground",
										children: inr(booking.fareBreakdown?.taxesAndFees || Math.round(booking.price - booking.price / 1.12))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Convenience Fee:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-emerald-500 font-bold",
										children: "₹0 (Waived)"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between border-t border-border pt-1.5 text-sm font-bold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Paid:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-primary font-display text-base font-bold",
										children: inr(booking.price)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-[10px] text-muted-foreground pt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Instrument:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: booking.paymentDetails?.maskedInstrument || "Demo Card •••• 0002" })]
								})
							]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 rounded-2xl border border-sunset/30 bg-sunset/10 p-4 text-xs text-foreground/80 space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-bold flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-sunset inline-block" }), "Important Traveler Notice (Demo Simulation)"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-muted-foreground leading-relaxed",
						children: "This reservation voucher was generated in the SmartTrip demonstration environment. No real funds were charged, and no actual airline or hotel inventory was locked. You may cancel this booking at any time with a 100% simulated refund."
					})]
				})
			]
		})]
	});
}
function BookingConfirmationPage() {
	const { id } = Route.useParams();
	const { bookings } = useSmartTrip();
	useNavigate();
	const [isCancelDialogOpen, setIsCancelDialogOpen] = (0, import_react.useState)(false);
	const [isCancelling, setIsCancelling] = (0, import_react.useState)(false);
	const booking = (0, import_react.useMemo)(() => {
		return bookings.find((b) => b.reference.toLowerCase() === id.toLowerCase() || b.id.toLowerCase() === id.toLowerCase());
	}, [bookings, id]);
	const displayBooking = booking || {
		id: `bkg-${id.toLowerCase()}`,
		kind: "flight",
		title: "IndiGo 6E-247 · Delhi to Goa",
		subtitle: "15 Dec – 17 Dec · Non-stop",
		price: 4899,
		reference: id.toUpperCase(),
		status: "confirmed",
		createdAt: Date.now(),
		passengersCount: 1,
		cabinClass: "Economy",
		travelerDetails: {
			fullName: "Aayush Chaudhari",
			email: "traveler@smarttrip.demo",
			phone: "+91 98765 43210",
			seatPreference: "Window"
		},
		paymentDetails: {
			method: "card",
			transactionRef: `demo_tx_${Date.now()}`,
			paidAt: Date.now(),
			maskedInstrument: "Demo Card •••• 0002",
			amount: 4899
		},
		fareBreakdown: {
			baseFare: 4374,
			taxesAndFees: 525,
			convenienceFee: 0,
			discount: 149,
			total: 4899
		}
	};
	const handleConfirmCancel = async () => {
		setIsCancelling(true);
		try {
			if (booking) {
				await cancelBookingWithRefundFn({ data: {
					bookingId: booking.id,
					reason: "Traveler initiated cancellation from E-ticket view"
				} });
				smartTrip.cancelBooking(booking.id);
			}
			toast.success("Reservation Cancelled", { description: `Full refund of ${inr(displayBooking.price)} processed to original payment method.` });
			setIsCancelDialogOpen(false);
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Cancellation failed.";
			toast.error("Cancellation Error", { description: msg });
		} finally {
			setIsCancelling(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Reservation Confirmed!",
			subtitle: `Booking reference #${displayBooking.reference} · Your demo E-ticket is ready.`
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "container-page -mt-8 pb-16",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/my-trips",
					className: "flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), " Back to My Trips & Bookings"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs text-muted-foreground font-mono",
					children: ["REF: ", displayBooking.reference]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ETicketView, {
				booking: displayBooking,
				onCancel: () => setIsCancelDialogOpen(true)
			})]
		}),
		isCancelDialogOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in",
			"data-testid": "cancel-confirmation-modal",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 text-destructive mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex size-10 items-center justify-center rounded-2xl bg-destructive/10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: "size-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-lg font-bold",
							children: "Cancel Reservation?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: ["Booking #", displayBooking.reference]
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border/80 bg-secondary/40 p-4 text-xs space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold text-foreground",
							children: "Demo Refund Policy Guaranteed:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "list-disc list-inside space-y-1 text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["100% refund of ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: inr(displayBooking.price) })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Zero cancellation penalties or convenience fee deductions" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Instant simulated credit back to original test payment method" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Associated Upcoming Trip removed from your dashboard" })
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex items-center justify-end gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "ghost",
							onClick: () => setIsCancelDialogOpen(false),
							disabled: isCancelling,
							children: "Keep Booking"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "destructive",
							className: "rounded-full px-5",
							onClick: handleConfirmCancel,
							disabled: isCancelling,
							"data-testid": "confirm-cancel-btn",
							children: isCancelling ? "Processing Refund..." : "Confirm Cancellation & Refund"
						})]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupportDock, {})
	] });
}
//#endregion
export { BookingConfirmationPage as component };
