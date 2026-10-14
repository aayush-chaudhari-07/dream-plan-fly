import { l as createServerFn } from "./createServerFn-BPR289oA.mjs";
import { a as numberType, c as stringType, i as enumType, o as objectType } from "../_libs/zod.mjs";
import { n as createSsrRpc } from "./smarttrip-store-B4h7bmlO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/booking-actions-BrEaAsP7.js
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
var createBookingOrderFn = createServerFn({ method: "POST" }).validator((data) => createBookingOrderSchema.parse(data)).handler(createSsrRpc("5363399f43f9e98602595e6cc091c143f6eb95a9c207405ebb78eb299d04f890"));
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
var verifyAndConfirmBookingFn = createServerFn({ method: "POST" }).validator((data) => confirmBookingSchema.parse(data)).handler(createSsrRpc("e5f3a1b736e27ead9c61b187d069c69e81e28d09a40c86cc737afe65b7b8e4c3"));
var cancelRefundSchema = objectType({
	bookingId: stringType().min(1),
	reason: stringType().max(300).optional()
});
var cancelBookingWithRefundFn = createServerFn({ method: "POST" }).validator((data) => cancelRefundSchema.parse(data)).handler(createSsrRpc("c1326797f96c08a2c8679738dde3a1aaf188925c07ead374b4b3c3bc093fd417"));
var fetchInventorySchema = objectType({
	category: enumType([
		"stays",
		"rentals",
		"transit",
		"packages"
	]),
	destination: stringType().optional()
});
createServerFn({ method: "GET" }).validator((data) => fetchInventorySchema.parse(data)).handler(createSsrRpc("50d9190c6c1e4fbcafffac99ebe93df884de49b6a80a2169d6efe31d604cd228"));
//#endregion
export { createBookingOrderFn as n, verifyAndConfirmBookingFn as r, cancelBookingWithRefundFn as t };
