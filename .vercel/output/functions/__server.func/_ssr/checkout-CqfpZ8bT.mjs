import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as cn, t as Button } from "./button-BSij73O2.mjs";
import { c as inr } from "./travel-Co-Z1Moz.mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as stringType, i as enumType, o as objectType, r as coerce } from "../_libs/zod.mjs";
import { u as smartTrip } from "./smarttrip-store-B4h7bmlO.mjs";
import { D as ShieldCheck, Gt as Bus, Kt as Building2, Nt as CircleCheck, O as ShieldAlert, Q as Luggage, R as QrCode, St as CreditCard, V as Plane, Vt as Car, tn as ArrowRight, tt as LoaderCircle, ut as Hotel, x as Sparkles } from "../_libs/lucide-react.mjs";
import { d as Input, f as Navbar, u as Footer } from "./Navbar-G5xs2vbg.mjs";
import { t as SupportDock } from "./SupportDock-BQEj3o76.mjs";
import { t as PageHeader } from "./PageHeader-CiBUEnzv.mjs";
import { n as createBookingOrderFn, r as verifyAndConfirmBookingFn } from "./booking-actions-BrEaAsP7.mjs";
import { n as DEMO_TEST_UPIS, r as validateDemoCardSafety, t as DEMO_TEST_CARDS } from "./card-validator-xwWfFn-e.mjs";
import { t as Route } from "./checkout-D1VXmyhJ.mjs";
import { n as useForm, t as u } from "../_libs/@hookform/resolvers+[...].mjs";
import { t as Label$1 } from "../_libs/radix-ui__react-label.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout-CqfpZ8bT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label$1, {
	ref,
	className: cn(labelVariants(), className),
	...props
}));
Label.displayName = Label$1.displayName;
function DemoPaymentModal({ isOpen, onClose, amount, bookingDetails, idempotencyKey, onSuccess }) {
	const [tab, setTab] = (0, import_react.useState)("card");
	const [isProcessing, setIsProcessing] = (0, import_react.useState)(false);
	const [cardError, setCardError] = (0, import_react.useState)(null);
	const [cardNumber, setCardNumber] = (0, import_react.useState)(DEMO_TEST_CARDS.SUCCESS);
	const [cardExpiry, setCardExpiry] = (0, import_react.useState)("12/28");
	const [cardCvv, setCardCvv] = (0, import_react.useState)("123");
	const [cardholderName, setCardholderName] = (0, import_react.useState)(bookingDetails.travelerDetails.fullName || "Demo Traveler");
	const [vpa, setVpa] = (0, import_react.useState)(DEMO_TEST_UPIS.SUCCESS);
	const [bankCode, setBankCode] = (0, import_react.useState)("HDFC");
	const [simulatedOutcome, setSimulatedOutcome] = (0, import_react.useState)("success");
	if (!isOpen) return null;
	const handleCardNumberChange = (raw) => {
		setCardNumber(raw);
		setCardError(null);
		try {
			validateDemoCardSafety(raw);
		} catch (err) {
			if (err instanceof Error) setCardError(err.message);
		}
	};
	const fillTestCard = (testCard, outcome) => {
		setCardNumber(testCard);
		setSimulatedOutcome(outcome);
		setCardError(null);
	};
	const handleProcessPayment = async () => {
		setIsProcessing(true);
		setCardError(null);
		try {
			if (tab === "card") try {
				validateDemoCardSafety(cardNumber);
			} catch (err) {
				const msg = err instanceof Error ? err.message : "Real cards rejected.";
				setCardError(msg);
				toast.error("Real card detected", { description: msg });
				setIsProcessing(false);
				return;
			}
			const order = await createBookingOrderFn({ data: {
				amount,
				title: bookingDetails.title,
				kind: bookingDetails.kind,
				idempotencyKey
			} });
			const res = await verifyAndConfirmBookingFn({ data: {
				orderId: order.orderId,
				paymentId: order.paymentId,
				amount,
				signature: order.demoSignature,
				paymentMethod: tab,
				idempotencyKey,
				bookingDetails,
				cardLast4: tab === "card" ? cardNumber.slice(-4) : void 0,
				cardholderName: tab === "card" ? cardholderName : void 0,
				vpa: tab === "upi" ? vpa : void 0,
				bankCode: tab === "netbanking" ? bankCode : void 0,
				simulatedOutcome
			} });
			if (!res.success) {
				toast.error("Payment failed", { description: res.message });
				setIsProcessing(false);
				return;
			}
			const rawBooking = res.booking;
			const confirmedBooking = smartTrip.addBooking({
				kind: bookingDetails.kind,
				title: bookingDetails.title,
				subtitle: bookingDetails.subtitle,
				price: amount,
				reference: res.reference,
				status: "confirmed",
				idempotencyKey,
				travelerDetails: bookingDetails.travelerDetails,
				paymentDetails: {
					method: tab,
					transactionRef: `demo_tx_${Date.now()}`,
					paidAt: Date.now(),
					maskedInstrument: tab === "card" ? `Card •••• ${cardNumber.slice(-4)}` : tab === "upi" ? `UPI (${vpa})` : `NetBanking (${bankCode})`,
					amount
				},
				fareBreakdown: bookingDetails.fareBreakdown,
				origin: bookingDetails.origin,
				destination: bookingDetails.destination,
				startDate: bookingDetails.startDate,
				endDate: bookingDetails.endDate,
				inventoryId: bookingDetails.inventoryId,
				passengersCount: bookingDetails.passengersCount,
				cabinClass: bookingDetails.cabinClass
			});
			toast.success("Demo payment successful!", { description: `Booking #${res.reference} confirmed. E-ticket generated.` });
			onSuccess(confirmedBooking || rawBooking);
			onClose();
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Payment failed.";
			toast.error("Transaction Error", { description: msg });
		} finally {
			setIsProcessing(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in",
		"data-testid": "demo-pay-modal",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between border-b border-border/60 pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-500 uppercase tracking-wider",
								children: "Demo Gateway"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: "HMAC-Signed"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-xl font-bold mt-1",
							children: "Complete Demo Payment"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground mt-0.5",
							children: [
								"Payable: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: inr(amount)
								}),
								" · Safe test sandbox"
							]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						type: "button",
						className: "rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground",
						children: "✕"
					})]
				}),
				cardError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex items-start gap-3 rounded-2xl border border-destructive/40 bg-destructive/10 p-3.5 text-xs text-destructive",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-5 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-bold",
						children: "Real Card Numbers Rejected"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5",
						children: cardError
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 grid grid-cols-3 gap-2 rounded-2xl bg-secondary/60 p-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setTab("card"),
							className: cn("flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-all", tab === "card" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"),
							"data-testid": "demo-pay-card-tab",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "size-3.5" }), " Card"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setTab("upi"),
							className: cn("flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-all", tab === "upi" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"),
							"data-testid": "demo-pay-upi-tab",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "size-3.5" }), " UPI / QR"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setTab("netbanking"),
							className: cn("flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-all", tab === "netbanking" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"),
							"data-testid": "demo-pay-nb-tab",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-3.5" }), " Net Banking"]
						})
					]
				}),
				tab === "card" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs font-semibold text-muted-foreground",
							children: "Select Test Card"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1.5 flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => fillTestCard(DEMO_TEST_CARDS.SUCCESS, "success"),
									className: cn("rounded-xl border px-2.5 py-1.5 text-xs font-medium transition-colors", cardNumber === DEMO_TEST_CARDS.SUCCESS ? "border-emerald-500 bg-emerald-500/10 text-emerald-500 font-bold" : "border-border hover:bg-secondary"),
									"data-testid": "test-card-success-btn",
									children: "✓ Success Card (..0002)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => fillTestCard(DEMO_TEST_CARDS.DECLINED, "failure"),
									className: cn("rounded-xl border px-2.5 py-1.5 text-xs font-medium transition-colors", cardNumber === DEMO_TEST_CARDS.DECLINED ? "border-destructive bg-destructive/10 text-destructive font-bold" : "border-border hover:bg-secondary"),
									"data-testid": "test-card-decline-btn",
									children: "✕ Declined Card (..0005)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => fillTestCard(DEMO_TEST_CARDS.INSUFFICIENT_FUNDS, "insufficient_funds"),
									className: cn("rounded-xl border px-2.5 py-1.5 text-xs font-medium transition-colors", cardNumber === DEMO_TEST_CARDS.INSUFFICIENT_FUNDS ? "border-amber-500 bg-amber-500/10 text-amber-500 font-bold" : "border-border hover:bg-secondary"),
									children: "⚠ Insufficient Funds (..0007)"
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-semibold",
								children: "Demo Card Number"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: cardNumber,
								onChange: (e) => handleCardNumberChange(e.target.value),
								placeholder: "4000 0000 0000 0002",
								className: "font-mono text-sm",
								"data-testid": "demo-card-input"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold",
									children: "Expiry Date"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: cardExpiry,
									onChange: (e) => setCardExpiry(e.target.value),
									placeholder: "MM/YY",
									className: "font-mono text-sm"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold",
									children: "CVV"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: cardCvv,
									onChange: (e) => setCardCvv(e.target.value),
									placeholder: "123",
									type: "password",
									maxLength: 4,
									className: "font-mono text-sm"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-semibold",
								children: "Cardholder Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: cardholderName,
								onChange: (e) => setCardholderName(e.target.value),
								placeholder: "Full Name",
								className: "text-sm"
							})]
						})
					]
				}),
				tab === "upi" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border/80 bg-secondary/30 p-4 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mx-auto flex size-28 items-center justify-center rounded-2xl bg-card border border-border p-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "size-20 text-foreground" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs font-semibold",
									children: "Scan with any UPI App (Demo simulation)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: "GPay · PhonePe · Paytm · BHIM"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-semibold",
								children: "UPI ID (VPA)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: vpa,
								onChange: (e) => setVpa(e.target.value),
								placeholder: "user@upi",
								className: "font-mono text-sm",
								"data-testid": "demo-upi-input"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setVpa(DEMO_TEST_UPIS.SUCCESS);
									setSimulatedOutcome("success");
								},
								className: "rounded-xl border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary",
								children: "Use success@upi"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setVpa(DEMO_TEST_UPIS.FAIL);
									setSimulatedOutcome("failure");
								},
								className: "rounded-xl border border-border px-3 py-1.5 text-xs font-medium text-destructive hover:bg-secondary",
								children: "Use fail@upi"
							})]
						})
					]
				}),
				tab === "netbanking" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "text-xs font-semibold",
						children: "Select Popular Bank"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [
							{
								code: "HDFC",
								name: "HDFC Bank"
							},
							{
								code: "ICICI",
								name: "ICICI Bank"
							},
							{
								code: "SBI",
								name: "State Bank of India"
							},
							{
								code: "AXIS",
								name: "Axis Bank"
							},
							{
								code: "KOTAK",
								name: "Kotak Mahindra Bank"
							},
							{
								code: "FAIL_BANK",
								name: "Simulate Bank Timeout"
							}
						].map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								setBankCode(b.code);
								setSimulatedOutcome(b.code === "FAIL_BANK" ? "failure" : "success");
							},
							className: cn("flex items-center gap-2 rounded-xl border p-2.5 text-left text-xs transition-colors", bankCode === b.code ? "border-primary bg-primary/10 text-primary font-bold" : "border-border hover:bg-secondary"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: b.name
							})]
						}, b.code))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 rounded-2xl bg-secondary/50 p-3 text-[11px] text-muted-foreground flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4 shrink-0 text-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Demo Safe Gateway:" }), " Zero financial charge. Real card numbers are strictly refused."] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex items-center justify-end gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "ghost",
						onClick: onClose,
						disabled: isProcessing,
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "hero",
						size: "lg",
						className: "rounded-full px-6",
						onClick: handleProcessPayment,
						disabled: isProcessing || Boolean(cardError),
						"data-testid": "demo-pay-submit-btn",
						children: isProcessing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin mr-2" }), " Authorizing Demo Payment..."] }) : `Pay ${inr(amount)} (Demo)`
					})]
				})
			]
		})
	});
}
var travelerFormSchema = objectType({
	fullName: stringType().min(2, "Full name must be at least 2 characters").max(100),
	email: stringType().email("Please enter a valid email address"),
	phone: stringType().min(10, "Phone number must be at least 10 digits").max(15),
	gender: enumType([
		"male",
		"female",
		"other"
	]),
	age: coerce.number().min(1, "Age must be at least 1").max(120, "Age must be less than 120"),
	seatPreference: stringType().optional(),
	notes: stringType().max(500).optional()
});
function CheckoutPage() {
	const search = Route.useSearch();
	const navigate = useNavigate();
	const searchKind = search.kind || "flight";
	const searchTitle = search.title || "IndiGo 6E-247 · Delhi to Goa";
	const searchSubtitle = search.subtitle || "15 Dec · Non-stop (2h 30m)";
	const totalPrice = search.price || 4899;
	const searchTravelers = search.travelers || 1;
	const searchCabinClass = search.cabinClass || "economy";
	const idempotencyKey = (0, import_react.useMemo)(() => {
		const rand = Math.random().toString(36).substring(2, 10);
		return `idem_${searchKind}_${totalPrice}_${Date.now()}_${rand}`;
	}, [searchKind, totalPrice]);
	const [isPaymentModalOpen, setIsPaymentModalOpen] = (0, import_react.useState)(false);
	const [validatedTraveler, setValidatedTraveler] = (0, import_react.useState)(null);
	const { register, handleSubmit, formState: { errors } } = useForm({
		resolver: u(travelerFormSchema),
		defaultValues: {
			fullName: "Aayush Chaudhari",
			email: "traveler@smarttrip.demo",
			phone: "9876543210",
			gender: "male",
			age: 26,
			seatPreference: "Window"
		}
	});
	const baseFare = Math.round(totalPrice / 1.12);
	const taxesAndFees = totalPrice - baseFare;
	const convenienceFee = 149;
	const discount = 149;
	const fareBreakdown = {
		baseFare,
		taxesAndFees,
		convenienceFee: 0,
		discount: 149,
		total: totalPrice
	};
	const onSubmit = (data) => {
		setValidatedTraveler(data);
		setIsPaymentModalOpen(true);
	};
	const handleBookingSuccess = (booking) => {
		navigate({
			to: "/booking-confirmation/$id",
			params: { id: booking.reference }
		});
	};
	const IconComponent = search.kind === "flight" ? Plane : search.kind === "stay" ? Hotel : search.kind === "rental" ? Car : search.kind === "rail" ? Bus : Luggage;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Demo Checkout",
			subtitle: "Simulated reservation flow · Zero monetary charges · Instant E-ticket with QR code."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "container-page -mt-8 pb-16",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex items-start gap-3.5 rounded-3xl border-2 border-amber-500/40 bg-amber-500/10 p-5 text-amber-950 dark:text-amber-200 shadow-soft",
				"data-testid": "demo-booking-banner",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-6 shrink-0 text-amber-500 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-bold text-sm tracking-wide uppercase",
						children: "Demo Booking Environment"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-semibold",
						children: "No Real Charges"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs leading-relaxed text-amber-900/80 dark:text-amber-300/80",
					children: "This reservation runs completely on free demo tools. Real card numbers are strictly prohibited. Use the provided Test Cards, UPI, or Net Banking credentials to simulate production checkout."
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-3 gap-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-2 space-y-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card p-6 sm:p-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl font-bold mb-1",
								children: "Traveler Details"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mb-6",
								children: "Enter primary passenger contact details for the E-ticket and SMS alerts."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleSubmit(onSubmit),
								className: "space-y-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "fullName",
													className: "text-xs font-semibold",
													children: "Full Name (as on Govt ID) *"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "fullName",
													...register("fullName"),
													placeholder: "e.g. Aayush Chaudhari",
													"data-testid": "checkout-traveler-name"
												}),
												errors.fullName && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-destructive",
													children: errors.fullName.message
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "email",
													className: "text-xs font-semibold",
													children: "Email Address (for E-Ticket) *"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "email",
													type: "email",
													...register("email"),
													placeholder: "name@example.com",
													"data-testid": "checkout-traveler-email"
												}),
												errors.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-destructive",
													children: errors.email.message
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
														htmlFor: "phone",
														className: "text-xs font-semibold",
														children: "Phone Number *"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														id: "phone",
														...register("phone"),
														placeholder: "9876543210",
														"data-testid": "checkout-traveler-phone"
													}),
													errors.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs text-destructive",
														children: errors.phone.message
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "gender",
													className: "text-xs font-semibold",
													children: "Gender"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													id: "gender",
													...register("gender"),
													className: "flex h-10 w-full rounded-2xl border border-border bg-surface px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "male",
															children: "Male"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "female",
															children: "Female"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "other",
															children: "Other"
														})
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
														htmlFor: "age",
														className: "text-xs font-semibold",
														children: "Age"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														id: "age",
														type: "number",
														...register("age"),
														placeholder: "26"
													}),
													errors.age && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs text-destructive",
														children: errors.age.message
													})
												]
											})
										]
									}),
									search.kind === "flight" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "seatPreference",
											className: "text-xs font-semibold",
											children: "Seat Preference"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											id: "seatPreference",
											...register("seatPreference"),
											className: "flex h-10 w-full rounded-2xl border border-border bg-surface px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Window",
													children: "Window Seat"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Aisle",
													children: "Aisle Seat"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Middle",
													children: "Middle Seat"
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "notes",
											className: "text-xs font-semibold",
											children: "Special Requests (Optional)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "notes",
											...register("notes"),
											placeholder: "Meal requests, wheelchair assistance, quiet room..."
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-4 border-t border-border flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted-foreground flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4 text-emerald-500" }), "Idempotency Protected: Safe from accidental double charges"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "submit",
											variant: "hero",
											size: "lg",
											className: "rounded-full px-8 gap-2 shadow-soft",
											"data-testid": "checkout-continue",
											children: ["Continue to Payment ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
										})]
									})
								]
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card p-6 sticky top-24",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 border-b border-border pb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconComponent, { className: "size-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider block",
									children: [searchKind, " Reservation"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display font-bold text-base leading-tight",
									children: searchTitle
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground py-3 border-b border-border/60",
								children: [
									searchSubtitle,
									" · ",
									searchTravelers,
									" Traveler(s) · ",
									searchCabinClass
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 space-y-2.5 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-muted-foreground",
											children: [
												"Base Fare (",
												search.travelers,
												"x)"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-foreground",
											children: inr(baseFare)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Taxes & Govt Fees (12% GST)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-foreground",
											children: inr(taxesAndFees)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Convenience Fee"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground line-through",
											children: inr(convenienceFee)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-emerald-500",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3" }), " Demo Platform Discount"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-semibold",
											children: ["-", inr(discount)]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "border-t border-border pt-3 flex justify-between items-baseline",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-sm block",
											children: "Total Payable"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-muted-foreground",
											children: "Inclusive of all demo taxes"
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-display text-2xl font-black text-primary",
											"data-testid": "checkout-total-price",
											children: inr(totalPrice)
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 rounded-2xl bg-secondary/50 p-3 text-[11px] text-muted-foreground space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-bold text-foreground",
									children: "Cancellation Guarantee"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Free cancellation up to 24 hours prior with 100% simulated instant refund." })]
							})
						]
					})
				})]
			})]
		}),
		validatedTraveler && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DemoPaymentModal, {
			isOpen: isPaymentModalOpen,
			onClose: () => setIsPaymentModalOpen(false),
			amount: totalPrice,
			bookingDetails: {
				kind: searchKind,
				title: searchTitle,
				subtitle: searchSubtitle,
				price: totalPrice,
				origin: search.origin,
				destination: search.destination,
				startDate: search.date,
				passengersCount: searchTravelers,
				cabinClass: searchCabinClass,
				travelerDetails: validatedTraveler,
				fareBreakdown
			},
			idempotencyKey,
			onSuccess: handleBookingSuccess
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupportDock, {})
	] });
}
//#endregion
export { CheckoutPage as component };
