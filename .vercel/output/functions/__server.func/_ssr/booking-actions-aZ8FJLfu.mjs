import { o as images } from "./travel-Co-Z1Moz.mjs";
import { l as createServerFn } from "./createServerFn-BPR289oA.mjs";
import { a as numberType, c as stringType, i as enumType, o as objectType } from "../_libs/zod.mjs";
import { i as getSupabaseServerClient, r as getServerUser } from "./ssr.mjs";
import { r as createServerRpc } from "./rate-limiter-IgkJH91V.mjs";
import { n as DEMO_TEST_UPIS, r as validateDemoCardSafety, t as DEMO_TEST_CARDS } from "./card-validator-xwWfFn-e.mjs";
import { i as INVENTORY_TRANSIT, n as INVENTORY_RENTALS, r as INVENTORY_STAYS, t as INVENTORY_PACKAGES } from "./inventory-data-CXc7T27W.mjs";
import { t as assertServerFnRateLimit } from "./rate-limit-guard-DYkK8K-r.mjs";
import crypto from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/booking-actions-aZ8FJLfu.js
/**
* Generate HMAC-SHA256 signature for server-side payment verification.
*/
function generateDemoSignature(orderId, paymentId, amount, secret = process.env["DEMO_PAY_SECRET"] || "smarttrip-demo-secret-salt-2026") {
	const payload = `${orderId}|${paymentId}|${amount}`;
	return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}
/**
* Verify HMAC-SHA256 signature.
*/
function verifyDemoSignature(orderId, paymentId, amount, signature, secret = process.env["DEMO_PAY_SECRET"] || "smarttrip-demo-secret-salt-2026") {
	const expected = generateDemoSignature(orderId, paymentId, amount, secret);
	return crypto.timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expected, "hex"));
}
var DemoPayProvider = class {
	name = "DemoPay Gateway";
	isTestMode = true;
	async createOrder(params) {
		return {
			orderId: `demo_ord_${crypto.randomBytes(6).toString("hex")}`,
			amount: params.amount,
			currency: params.currency || "INR",
			provider: "demo"
		};
	}
	async verifyPayment(params) {
		const { orderId, paymentId, amount, signature, method = "card" } = params;
		let isValidSignature = false;
		try {
			isValidSignature = verifyDemoSignature(orderId, paymentId, amount, signature);
		} catch {
			isValidSignature = false;
		}
		if (!isValidSignature) return {
			success: false,
			paymentId,
			orderId,
			status: "failed",
			method,
			message: "Cryptographic signature verification failed. Invalid demo token.",
			transactionRef: `tx_failed_${paymentId}`
		};
		if (method === "card" && params.cardDetails?.cardNumber) {
			validateDemoCardSafety(params.cardDetails.cardNumber);
			const cleaned = params.cardDetails.cardNumber.replace(/[\s-]/g, "");
			if (cleaned === DEMO_TEST_CARDS.DECLINED) return {
				success: false,
				paymentId,
				orderId,
				status: "failed",
				method,
				message: "Simulated Decline: Transaction declined by issuing bank (Test Card).",
				transactionRef: `tx_declined_${paymentId}`
			};
			if (cleaned === DEMO_TEST_CARDS.INSUFFICIENT_FUNDS) return {
				success: false,
				paymentId,
				orderId,
				status: "failed",
				method,
				message: "Simulated Decline: Insufficient account funds (Test Card).",
				transactionRef: `tx_insufficient_${paymentId}`
			};
			if (cleaned === DEMO_TEST_CARDS.PENDING) return {
				success: false,
				paymentId,
				orderId,
				status: "pending",
				method,
				message: "Simulated Pending: Bank payment authentication pending OTP (Test Card).",
				transactionRef: `tx_pending_${paymentId}`
			};
		}
		if (method === "upi" && params.upiDetails?.vpa) {
			if (params.upiDetails.vpa.toLowerCase().trim() === DEMO_TEST_UPIS.FAIL) return {
				success: false,
				paymentId,
				orderId,
				status: "failed",
				method,
				message: "Simulated Decline: UPI mandate rejected by payer PSP app.",
				transactionRef: `tx_upi_fail_${paymentId}`
			};
		}
		if (method === "netbanking" && params.netBankingDetails?.bankCode === "FAIL_BANK") return {
			success: false,
			paymentId,
			orderId,
			status: "failed",
			method,
			message: "Simulated Decline: Net banking session timed out at gateway.",
			transactionRef: `tx_nb_fail_${paymentId}`
		};
		if (params.simulatedOutcome === "failure") return {
			success: false,
			paymentId,
			orderId,
			status: "failed",
			method,
			message: "Simulated Decline: Payment request was cancelled or failed.",
			transactionRef: `tx_fail_${paymentId}`
		};
		if (params.simulatedOutcome === "insufficient_funds") return {
			success: false,
			paymentId,
			orderId,
			status: "failed",
			method,
			message: "Simulated Decline: Insufficient funds in bank account.",
			transactionRef: `tx_insufficient_${paymentId}`
		};
		if (params.simulatedOutcome === "pending") return {
			success: false,
			paymentId,
			orderId,
			status: "pending",
			method,
			message: "Simulated Pending: Transaction awaiting final settlement.",
			transactionRef: `tx_pending_${paymentId}`
		};
		return {
			success: true,
			paymentId,
			orderId,
			status: "success",
			method,
			message: "Demo payment authorized successfully. No real charge occurred.",
			transactionRef: `demo_tx_${crypto.randomBytes(5).toString("hex")}`
		};
	}
	async refund(params) {
		return {
			success: true,
			refundId: `demo_rfnd_${crypto.randomBytes(6).toString("hex")}`,
			paymentId: params.paymentId,
			amount: params.amount,
			status: "processed",
			message: `Simulated Demo Refund of ₹${params.amount.toLocaleString("en-IN")} processed instantly. (Demo policy: zero fees deducted).`
		};
	}
};
/**
* Optional Razorpay Test Provider.
* Activates ONLY if both RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are configured.
* Razorpay Test Mode is free and operates with simulated test cards/UPIS.
*/
var RazorpayTestProvider = class RazorpayTestProvider {
	name = "Razorpay Test Gateway";
	isTestMode = true;
	keyId;
	keySecret;
	constructor() {
		this.keyId = process.env["RAZORPAY_KEY_ID"] || "";
		this.keySecret = process.env["RAZORPAY_KEY_SECRET"] || "";
	}
	static isConfigured() {
		const key = process.env["RAZORPAY_KEY_ID"];
		const secret = process.env["RAZORPAY_KEY_SECRET"];
		return Boolean(key && secret && key.startsWith("rzp_test_"));
	}
	async createOrder(params) {
		if (!RazorpayTestProvider.isConfigured()) throw new Error("Razorpay Test Provider is disabled: Missing rzp_test_ API credentials in environment.");
		return {
			orderId: `order_test_${crypto.randomBytes(7).toString("hex")}`,
			amount: params.amount,
			currency: params.currency || "INR",
			provider: "razorpay",
			keyId: this.keyId
		};
	}
	async verifyPayment(params) {
		if (!RazorpayTestProvider.isConfigured()) throw new Error("Razorpay Test Provider is disabled.");
		const { orderId, paymentId, signature } = params;
		const body = `${orderId}|${paymentId}`;
		const expected = crypto.createHmac("sha256", this.keySecret).update(body).digest("hex");
		if (!crypto.timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expected, "hex"))) return {
			success: false,
			paymentId,
			orderId,
			status: "failed",
			method: params.method || "card",
			message: "Razorpay signature verification mismatch.",
			transactionRef: paymentId
		};
		return {
			success: true,
			paymentId,
			orderId,
			status: "success",
			method: params.method || "card",
			message: "Razorpay test payment verified.",
			transactionRef: paymentId
		};
	}
	async refund(params) {
		return {
			success: true,
			refundId: `rfnd_test_${crypto.randomBytes(6).toString("hex")}`,
			paymentId: params.paymentId,
			amount: params.amount,
			status: "processed",
			message: "Razorpay test refund processed."
		};
	}
};
var defaultProviderInstance = null;
/**
* Returns active payment provider.
* Activates RazorpayTestProvider only if test credentials are provided;
* otherwise defaults to DemoPayProvider.
*/
function getPaymentProvider() {
	if (RazorpayTestProvider.isConfigured()) return new RazorpayTestProvider();
	if (!defaultProviderInstance) defaultProviderInstance = new DemoPayProvider();
	return defaultProviderInstance;
}
function imageFor(text) {
	const t = text.toLowerCase();
	if (t.includes("goa")) return images.goa;
	if (t.includes("manali")) return images.manali;
	if (t.includes("kashmir") || t.includes("srinagar") || t.includes("gulmarg")) return images.kashmir;
	if (t.includes("japan") || t.includes("tokyo") || t.includes("kyoto")) return images.japan;
	if (t.includes("maldives")) return images.maldives;
	return images.hero;
}
function prefixForKind(kind) {
	switch (kind) {
		case "flight": return "STFL";
		case "stay": return "STHT";
		case "rental": return "STRN";
		case "rail": return "STRL";
		case "package": return "STPK";
		default: return "STBK";
	}
}
var createBookingOrderSchema = objectType({
	amount: numberType().positive().max(1e7),
	title: stringType().min(1).max(200),
	kind: enumType([
		"flight",
		"stay",
		"rental",
		"rail",
		"package"
	]),
	idempotencyKey: stringType().min(5).max(100)
});
var createBookingOrderFn_createServerFn_handler = createServerRpc({
	id: "5363399f43f9e98602595e6cc091c143f6eb95a9c207405ebb78eb299d04f890",
	name: "createBookingOrderFn",
	filename: "src/lib/server/booking-actions.ts"
}, (opts) => createBookingOrderFn.__executeServer(opts));
var createBookingOrderFn = createServerFn({ method: "POST" }).validator((data) => createBookingOrderSchema.parse(data)).handler(createBookingOrderFn_createServerFn_handler, async ({ data: input }) => {
	assertServerFnRateLimit("create_booking_order", 30);
	const user = await getServerUser();
	const order = await getPaymentProvider().createOrder({
		amount: input.amount,
		receipt: `rcpt_${input.idempotencyKey.slice(0, 16)}`,
		notes: {
			title: input.title,
			kind: input.kind,
			userId: user?.id || "guest"
		}
	});
	const paymentId = `demo_pay_${Date.now()}`;
	const demoSignature = generateDemoSignature(order.orderId, paymentId, input.amount);
	return {
		orderId: order.orderId,
		paymentId,
		amount: input.amount,
		currency: order.currency,
		provider: order.provider,
		keyId: order.keyId,
		demoSignature
	};
});
var travelerDetailsSchema = objectType({
	fullName: stringType().min(2).max(100),
	email: stringType().email(),
	phone: stringType().min(7).max(20),
	gender: stringType().optional(),
	age: numberType().int().min(1).max(120).optional(),
	seatPreference: stringType().optional(),
	notes: stringType().max(500).optional()
});
var fareBreakdownSchema = objectType({
	baseFare: numberType().nonnegative(),
	taxesAndFees: numberType().nonnegative(),
	convenienceFee: numberType().nonnegative(),
	discount: numberType().nonnegative(),
	total: numberType().positive()
});
var confirmBookingSchema = objectType({
	orderId: stringType().min(1),
	paymentId: stringType().min(1),
	amount: numberType().positive(),
	signature: stringType().min(1),
	paymentMethod: enumType([
		"card",
		"upi",
		"netbanking"
	]),
	idempotencyKey: stringType().min(5).max(100),
	bookingDetails: objectType({
		kind: enumType([
			"flight",
			"stay",
			"rental",
			"rail",
			"package"
		]),
		title: stringType().min(1).max(200),
		subtitle: stringType().min(1).max(200),
		price: numberType().positive(),
		origin: stringType().optional(),
		destination: stringType().optional(),
		startDate: stringType().optional(),
		endDate: stringType().optional(),
		inventoryId: stringType().optional(),
		passengersCount: numberType().int().min(1).max(50).default(1),
		cabinClass: stringType().optional(),
		travelerDetails: travelerDetailsSchema,
		fareBreakdown: fareBreakdownSchema
	}),
	cardLast4: stringType().optional(),
	cardholderName: stringType().optional(),
	vpa: stringType().optional(),
	bankCode: stringType().optional(),
	simulatedOutcome: enumType([
		"success",
		"failure",
		"insufficient_funds",
		"pending"
	]).optional()
});
var verifyAndConfirmBookingFn_createServerFn_handler = createServerRpc({
	id: "e5f3a1b736e27ead9c61b187d069c69e81e28d09a40c86cc737afe65b7b8e4c3",
	name: "verifyAndConfirmBookingFn",
	filename: "src/lib/server/booking-actions.ts"
}, (opts) => verifyAndConfirmBookingFn.__executeServer(opts));
var verifyAndConfirmBookingFn = createServerFn({ method: "POST" }).validator((data) => confirmBookingSchema.parse(data)).handler(verifyAndConfirmBookingFn_createServerFn_handler, async ({ data: input }) => {
	assertServerFnRateLimit("verify_confirm_booking", 30);
	const user = await getServerUser();
	const verification = await getPaymentProvider().verifyPayment({
		orderId: input.orderId,
		paymentId: input.paymentId,
		amount: input.amount,
		signature: input.signature,
		method: input.paymentMethod,
		simulatedOutcome: input.simulatedOutcome,
		upiDetails: input.vpa ? { vpa: input.vpa } : void 0,
		netBankingDetails: input.bankCode ? { bankCode: input.bankCode } : void 0,
		cardDetails: input.cardLast4 ? {
			cardNumber: input.cardLast4,
			expiryMonth: "12",
			expiryYear: "2030",
			cvv: "123",
			cardholderName: input.cardholderName || "Demo Traveler"
		} : void 0
	});
	if (!verification.success) throw new Error(verification.message || "Payment verification failed.");
	const supabase = getSupabaseServerClient();
	const bDetails = input.bookingDetails;
	if (user) try {
		const { data: existing } = await supabase.from("bookings").select("*").eq("user_id", user.id).eq("idempotency_key", input.idempotencyKey).single();
		if (existing) return {
			success: true,
			booking: existing,
			isDuplicate: true,
			message: "Existing booking retrieved via idempotency key."
		};
	} catch {}
	const reference = `${prefixForKind(bDetails.kind)}-${Math.floor(1e4 + Math.random() * 9e4)}`;
	const paymentDetailsRecord = {
		method: input.paymentMethod,
		transactionRef: verification.transactionRef,
		paymentId: input.paymentId,
		orderId: input.orderId,
		paidAt: Date.now(),
		maskedInstrument: input.paymentMethod === "card" ? `Card •••• ${input.cardLast4?.slice(-4) || "0002"}` : input.paymentMethod === "upi" ? `UPI (${input.vpa || "demo@smarttrip"})` : `NetBanking (${input.bankCode || "HDFC Bank"})`,
		amount: input.amount
	};
	let savedBooking = {
		id: `bkg-${reference.toLowerCase()}`,
		user_id: user?.id || null,
		kind: bDetails.kind,
		title: bDetails.title,
		subtitle: bDetails.subtitle,
		price: bDetails.price,
		reference,
		status: "confirmed",
		idempotency_key: input.idempotencyKey,
		traveler_details: bDetails.travelerDetails,
		payment_details: paymentDetailsRecord,
		fare_breakdown: bDetails.fareBreakdown,
		origin: bDetails.origin,
		destination: bDetails.destination,
		start_date: bDetails.startDate,
		end_date: bDetails.endDate,
		inventory_id: bDetails.inventoryId,
		passengers_count: bDetails.passengersCount,
		cabin_class: bDetails.cabinClass,
		created_at: (/* @__PURE__ */ new Date()).toISOString()
	};
	if (user) try {
		const { data: dbBooking, error: bookingErr } = await supabase.from("bookings").insert({
			user_id: user.id,
			kind: bDetails.kind,
			title: bDetails.title,
			subtitle: bDetails.subtitle,
			price: bDetails.price,
			reference,
			status: "confirmed",
			idempotency_key: input.idempotencyKey,
			traveler_details: bDetails.travelerDetails,
			payment_details: paymentDetailsRecord,
			fare_breakdown: bDetails.fareBreakdown,
			origin: bDetails.origin,
			destination: bDetails.destination,
			start_date: bDetails.startDate,
			end_date: bDetails.endDate,
			inventory_id: bDetails.inventoryId,
			passengers_count: bDetails.passengersCount,
			cabin_class: bDetails.cabinClass
		}).select().single();
		if (dbBooking) savedBooking = dbBooking;
		if (bookingErr) console.warn("Could not insert booking to Supabase:", bookingErr.message);
		const label = bDetails.kind === "flight" ? "✈ Flight confirmed" : bDetails.kind === "stay" ? "🏨 Stay confirmed" : bDetails.kind === "rental" ? "🚗 Rental confirmed" : bDetails.kind === "rail" ? "🚆 Train/Bus confirmed" : "🎁 Package confirmed";
		await supabase.from("trips").insert({
			user_id: user.id,
			name: bDetails.title,
			dates: bDetails.subtitle,
			status: [
				label,
				`🎫 Ref ${reference}`,
				`👤 ${bDetails.travelerDetails.fullName}`
			],
			image: imageFor(bDetails.title + " " + bDetails.subtitle),
			bucket: "Upcoming"
		});
		await supabase.from("notifications").insert({
			user_id: user.id,
			title: "Booking Confirmed",
			message: `${bDetails.title} is confirmed. Ref: #${reference}. E-Ticket available.`,
			read: false,
			type: "booking",
			link: `/booking-confirmation/${reference}`
		});
	} catch (err) {
		console.warn("Supabase booking persistence warning:", err);
	}
	return {
		success: true,
		booking: savedBooking,
		reference,
		message: "Booking confirmed successfully! E-ticket ready."
	};
});
var cancelRefundSchema = objectType({
	bookingId: stringType().min(1),
	reason: stringType().max(300).optional()
});
var cancelBookingWithRefundFn_createServerFn_handler = createServerRpc({
	id: "c1326797f96c08a2c8679738dde3a1aaf188925c07ead374b4b3c3bc093fd417",
	name: "cancelBookingWithRefundFn",
	filename: "src/lib/server/booking-actions.ts"
}, (opts) => cancelBookingWithRefundFn.__executeServer(opts));
var cancelBookingWithRefundFn = createServerFn({ method: "POST" }).validator((data) => cancelRefundSchema.parse(data)).handler(cancelBookingWithRefundFn_createServerFn_handler, async ({ data: { bookingId, reason } }) => {
	assertServerFnRateLimit("cancel_booking", 30);
	const user = await getServerUser();
	const supabase = getSupabaseServerClient();
	const provider = getPaymentProvider();
	let bookingRef = "";
	let bookingAmount = 0;
	let paymentId = "";
	if (user) {
		const { data: b } = await supabase.from("bookings").select("*").eq("id", bookingId).eq("user_id", user.id).single();
		if (b) {
			bookingRef = b.reference;
			bookingAmount = Number(b.price);
			paymentId = b.payment_details?.paymentId || `pay_${bookingId}`;
		}
	}
	const refundRes = await provider.refund({
		paymentId: paymentId || `demo_pay_${bookingId}`,
		amount: bookingAmount || 0,
		reason: reason || "User requested demo cancellation"
	});
	if (user && bookingRef) {
		await supabase.from("bookings").update({ status: "cancelled" }).eq("id", bookingId).eq("user_id", user.id);
		await supabase.from("trips").delete().eq("user_id", user.id).contains("status", [`🎫 Ref ${bookingRef}`]);
		await supabase.from("notifications").insert({
			user_id: user.id,
			title: "Booking Cancelled & Refunded",
			message: `Booking #${bookingRef} was cancelled. ${refundRes.message}`,
			read: false,
			type: "booking",
			link: "/my-trips"
		});
	}
	return {
		success: true,
		refundId: refundRes.refundId,
		refundAmount: refundRes.amount,
		message: refundRes.message
	};
});
var fetchInventorySchema = objectType({
	category: enumType([
		"stays",
		"rentals",
		"transit",
		"packages"
	]),
	destination: stringType().optional()
});
var fetchInventoryFn_createServerFn_handler = createServerRpc({
	id: "50d9190c6c1e4fbcafffac99ebe93df884de49b6a80a2169d6efe31d604cd228",
	name: "fetchInventoryFn",
	filename: "src/lib/server/booking-actions.ts"
}, (opts) => fetchInventoryFn.__executeServer(opts));
var fetchInventoryFn = createServerFn({ method: "GET" }).validator((data) => fetchInventorySchema.parse(data)).handler(fetchInventoryFn_createServerFn_handler, async ({ data: { category, destination } }) => {
	const supabase = getSupabaseServerClient();
	try {
		if (category === "stays") {
			let q = supabase.from("inventory_stays").select("*");
			if (destination && destination !== "all") q = q.ilike("destination", `%${destination}%`);
			const { data, error } = await q;
			if (!error && data && data.length > 0) return data;
		} else if (category === "rentals") {
			let q = supabase.from("inventory_rentals").select("*");
			if (destination && destination !== "all") q = q.ilike("destination", `%${destination}%`);
			const { data, error } = await q;
			if (!error && data && data.length > 0) return data;
		} else if (category === "transit") {
			const { data, error } = await supabase.from("inventory_transit").select("*");
			if (!error && data && data.length > 0) return data;
		} else if (category === "packages") {
			let q = supabase.from("inventory_packages").select("*");
			if (destination && destination !== "all") q = q.ilike("destination", `%${destination}%`);
			const { data, error } = await q;
			if (!error && data && data.length > 0) return data;
		}
	} catch {}
	if (category === "stays") {
		if (destination && destination !== "all") return INVENTORY_STAYS.filter((s) => s.destination.toLowerCase().includes(destination.toLowerCase()));
		return INVENTORY_STAYS;
	}
	if (category === "rentals") {
		if (destination && destination !== "all") return INVENTORY_RENTALS.filter((r) => r.destination.toLowerCase().includes(destination.toLowerCase()));
		return INVENTORY_RENTALS;
	}
	if (category === "transit") return INVENTORY_TRANSIT;
	if (category === "packages") {
		if (destination && destination !== "all") return INVENTORY_PACKAGES.filter((p) => p.destination.toLowerCase().includes(destination.toLowerCase()));
		return INVENTORY_PACKAGES;
	}
	return [];
});
//#endregion
export { cancelBookingWithRefundFn_createServerFn_handler, createBookingOrderFn_createServerFn_handler, fetchInventoryFn_createServerFn_handler, verifyAndConfirmBookingFn_createServerFn_handler };
