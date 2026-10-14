import { o as images } from "./travel-Co-Z1Moz.mjs";
import { l as createServerFn } from "./createServerFn-BPR289oA.mjs";
import { a as numberType, c as stringType, i as enumType, n as arrayType, o as objectType, s as recordType, t as anyType } from "../_libs/zod.mjs";
import { i as getSupabaseServerClient, r as getServerUser } from "./ssr.mjs";
import { r as createServerRpc } from "./rate-limiter-IgkJH91V.mjs";
import { t as assertServerFnRateLimit } from "./rate-limit-guard-DYkK8K-r.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/trip-actions-BM0Y8N7J.js
var planDayItemSchema = objectType({
	time: stringType(),
	activity: stringType(),
	cost: stringType()
});
var planDaySchema = objectType({
	day: numberType().int().positive(),
	theme: stringType(),
	items: arrayType(planDayItemSchema)
});
var generatedPlanSchema = objectType({
	title: stringType().min(1).max(200),
	destination: stringType().min(1).max(100),
	days: arrayType(planDaySchema).min(1).max(30),
	budget: numberType().nonnegative(),
	budgetBreakdown: recordType(stringType(), numberType()),
	travelers: numberType().int().positive().max(50),
	carbonKg: numberType().nonnegative(),
	summary: stringType().max(1e3),
	category: stringType().max(100)
});
var moveTripSchema = objectType({
	tripId: stringType().min(1),
	bucket: enumType([
		"Upcoming",
		"Past",
		"Saved"
	])
});
var removeTripSchema = objectType({ tripId: stringType().min(1) });
var addBookingSchema = objectType({
	kind: enumType([
		"flight",
		"stay",
		"rental",
		"rail",
		"package"
	]),
	title: stringType().min(1).max(200),
	subtitle: stringType().min(1).max(200),
	price: numberType().nonnegative().max(1e7)
});
var cancelBookingSchema = objectType({ bookingId: stringType().min(1) });
var addFundSchema = objectType({
	name: stringType().min(1).max(100),
	target: numberType().positive().max(1e8),
	travelers: numberType().int().positive().max(50).optional(),
	monthsLeft: numberType().int().positive().max(120).optional()
});
var contributeFundSchema = objectType({
	fundId: stringType().min(1),
	amount: numberType().positive().max(1e8)
});
var removeFundSchema = objectType({ fundId: stringType().min(1) });
var toggleWishSchema = objectType({ destinationId: stringType().min(1).max(100) });
var migrateDataSchema = objectType({
	trips: arrayType(objectType({
		name: stringType(),
		dates: stringType(),
		status: arrayType(stringType()),
		image: stringType(),
		bucket: enumType([
			"Upcoming",
			"Past",
			"Saved"
		]),
		plan: anyType().optional()
	})).optional(),
	bookings: arrayType(objectType({
		kind: enumType([
			"flight",
			"stay",
			"rental",
			"rail",
			"package"
		]),
		title: stringType(),
		subtitle: stringType(),
		price: numberType(),
		reference: stringType().optional()
	})).optional(),
	funds: arrayType(objectType({
		name: stringType(),
		target: numberType(),
		saved: numberType().optional(),
		emoji: stringType().optional(),
		targetDate: stringType().optional(),
		monthsLeft: numberType().optional(),
		travelers: numberType().optional(),
		image: stringType().optional()
	})).optional(),
	wishlist: arrayType(stringType()).optional()
});
function imageFor(text) {
	const t = text.toLowerCase();
	if (/goa|beach|coast/.test(t)) return images.goa;
	if (/japan|kyoto|tokyo/.test(t)) return images.japan;
	if (/kashmir|srinagar|dal/.test(t)) return images.kashmir;
	if (/maldives|island|lagoon/.test(t)) return images.maldives;
	if (/manali|himachal|hill|shimla|munnar/.test(t)) return images.manali;
	return images.hero;
}
/**
* Get current session user on the server.
*/
var getUserFn_createServerFn_handler = createServerRpc({
	id: "615946e8ad34b0947398661a85a7cd6e980449d5fa50973581befb47b240d31a",
	name: "getUserFn",
	filename: "src/lib/server/trip-actions.ts"
}, (opts) => getUserFn.__executeServer(opts));
var getUserFn = createServerFn({ method: "GET" }).handler(getUserFn_createServerFn_handler, async () => {
	const user = await getServerUser();
	if (!user) return null;
	return {
		id: user.id,
		email: user.email,
		user_metadata: user.user_metadata
	};
});
var fetchUserDataFn_createServerFn_handler = createServerRpc({
	id: "17d7ad668f4ce1d7d5626fe55abf4919d5608e831719ebf0d488f56cda4ffd12",
	name: "fetchUserDataFn",
	filename: "src/lib/server/trip-actions.ts"
}, (opts) => fetchUserDataFn.__executeServer(opts));
var fetchUserDataFn = createServerFn({ method: "GET" }).handler(fetchUserDataFn_createServerFn_handler, async () => {
	assertServerFnRateLimit("fetch_user_data", 120);
	const user = await getServerUser();
	if (!user) return {
		authenticated: false,
		trips: [],
		bookings: [],
		funds: [],
		wishlist: [],
		notifications: []
	};
	const supabase = getSupabaseServerClient();
	const [tripsRes, bookingsRes, fundsRes, wishRes, notifRes] = await Promise.all([
		supabase.from("trips").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
		supabase.from("bookings").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
		supabase.from("funds").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
		supabase.from("wishlist").select("destination_id").eq("user_id", user.id),
		supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
	]);
	let notifications = notifRes.data || [];
	if (notifications.length === 0) {
		const seedRows = [
			{
				user_id: user.id,
				title: "Booking Confirmed",
				message: "IndiGo 6E-247 (DEL → GOI) is confirmed. Reference: #ST-89241.",
				read: false,
				type: "booking",
				link: "/bookings"
			},
			{
				user_id: user.id,
				title: "Trip Fund Milestone",
				message: "Tokyo Cherry Blossom dream fund reached 65% of your target savings!",
				read: false,
				type: "milestone",
				link: "/save"
			},
			{
				user_id: user.id,
				title: "Price Drop Alert",
				message: "Fares to Bali dropped 18% for upcoming festive dates. Explore deals now.",
				read: false,
				type: "price_drop",
				link: "/destination/bali"
			}
		];
		try {
			const { data: inserted } = await supabase.from("notifications").insert(seedRows).select();
			if (inserted && inserted.length > 0) notifications = inserted;
		} catch {}
	}
	return {
		authenticated: true,
		trips: (tripsRes.data || []).map((t) => ({
			id: t.id,
			name: t.name,
			dates: t.dates,
			status: t.status || [],
			image: t.image,
			bucket: t.bucket,
			plan: t.plan
		})),
		bookings: (bookingsRes.data || []).map((b) => ({
			id: b.id,
			kind: b.kind,
			title: b.title,
			subtitle: b.subtitle,
			price: Number(b.price),
			reference: b.reference,
			status: b.status || "confirmed",
			createdAt: new Date(b.created_at).getTime(),
			travelerDetails: b.traveler_details,
			paymentDetails: b.payment_details,
			fareBreakdown: b.fare_breakdown,
			origin: b.origin,
			destination: b.destination,
			startDate: b.start_date,
			endDate: b.end_date,
			passengersCount: b.passengers_count || 1,
			cabinClass: b.cabin_class || "economy",
			idempotencyKey: b.idempotency_key
		})),
		funds: (fundsRes.data || []).map((f) => ({
			id: f.id,
			emoji: f.emoji || "✈️",
			name: f.name,
			target: Number(f.target),
			saved: Number(f.saved || 0),
			targetDate: f.target_date || "Date flexible",
			monthsLeft: f.months_left || 12,
			travelers: f.travelers || 2,
			image: f.image
		})),
		wishlist: (wishRes.data || []).map((w) => w.destination_id),
		notifications: notifications.map((n) => ({
			id: n.id,
			title: n.title,
			message: n.message,
			read: Boolean(n.read),
			type: n.type || "info",
			createdAt: new Date(n.created_at).getTime(),
			link: n.link || void 0
		}))
	};
});
var savePlanFn_createServerFn_handler = createServerRpc({
	id: "b04330ff4cd882b306257199a46260af19cc762e8139018924a3644f291cceca",
	name: "savePlanFn",
	filename: "src/lib/server/trip-actions.ts"
}, (opts) => savePlanFn.__executeServer(opts));
var savePlanFn = createServerFn({ method: "POST" }).validator((data) => generatedPlanSchema.parse(data)).handler(savePlanFn_createServerFn_handler, async ({ data: plan }) => {
	assertServerFnRateLimit("save_plan", 60);
	const user = await getServerUser();
	if (!user) throw new Error("Unauthorized: Please sign in to save plans to the cloud.");
	const supabase = getSupabaseServerClient();
	const tripName = plan.title.replace(/ · smart plan$/, " Plan");
	const dates = `Flexible · est. ₹${plan.budget.toLocaleString("en-IN")}`;
	const status = ["💾 AI plan saved", `🗓 ${plan.days.length}-day itinerary`];
	const image = imageFor(plan.title + " " + plan.summary);
	const { data: inserted, error } = await supabase.from("trips").insert({
		user_id: user.id,
		name: tripName,
		dates,
		status,
		image,
		bucket: "Saved",
		plan
	}).select().single();
	if (error) throw new Error(`Failed to save trip plan: ${error.message}`);
	return inserted;
});
var moveTripFn_createServerFn_handler = createServerRpc({
	id: "9045a2334e4945107485d40dba803b3cbc6d26fa3cd4df54c378f8acaa5bf0dd",
	name: "moveTripFn",
	filename: "src/lib/server/trip-actions.ts"
}, (opts) => moveTripFn.__executeServer(opts));
var moveTripFn = createServerFn({ method: "POST" }).validator((data) => moveTripSchema.parse(data)).handler(moveTripFn_createServerFn_handler, async ({ data: { tripId, bucket } }) => {
	const user = await getServerUser();
	if (!user) throw new Error("Unauthorized");
	const supabase = getSupabaseServerClient();
	const { data: existing } = await supabase.from("trips").select("status").eq("id", tripId).eq("user_id", user.id).single();
	const currentStatus = existing?.status || [];
	const newStatus = bucket === "Upcoming" ? [.../* @__PURE__ */ new Set([...currentStatus, "✅ Moved to upcoming"])] : bucket === "Past" ? [.../* @__PURE__ */ new Set([...currentStatus, "🏁 Trip completed"])] : currentStatus;
	const { error } = await supabase.from("trips").update({
		bucket,
		status: newStatus,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", tripId).eq("user_id", user.id);
	if (error) throw new Error(`Failed to move trip: ${error.message}`);
	return {
		success: true,
		tripId,
		bucket
	};
});
var removeTripFn_createServerFn_handler = createServerRpc({
	id: "0b08ff3b0f38c46a2a68400e1b5357f62ab459f51eb1333f433964238b64b7b1",
	name: "removeTripFn",
	filename: "src/lib/server/trip-actions.ts"
}, (opts) => removeTripFn.__executeServer(opts));
var removeTripFn = createServerFn({ method: "POST" }).validator((data) => removeTripSchema.parse(data)).handler(removeTripFn_createServerFn_handler, async ({ data: { tripId } }) => {
	const user = await getServerUser();
	if (!user) throw new Error("Unauthorized");
	const { error } = await getSupabaseServerClient().from("trips").delete().eq("id", tripId).eq("user_id", user.id);
	if (error) throw new Error(`Failed to remove trip: ${error.message}`);
	return {
		success: true,
		tripId
	};
});
var addBookingFn_createServerFn_handler = createServerRpc({
	id: "be61a83279daf7ebcbd4f1c8e095fc37182cda0e77472d87a085de92d1f53e24",
	name: "addBookingFn",
	filename: "src/lib/server/trip-actions.ts"
}, (opts) => addBookingFn.__executeServer(opts));
var addBookingFn = createServerFn({ method: "POST" }).validator((data) => addBookingSchema.parse(data)).handler(addBookingFn_createServerFn_handler, async ({ data: input }) => {
	const user = await getServerUser();
	if (!user) throw new Error("Unauthorized: Please sign in to book.");
	const supabase = getSupabaseServerClient();
	const reference = "ST" + Math.random().toString(36).slice(2, 8).toUpperCase();
	const { data: booking, error: bookingErr } = await supabase.from("bookings").insert({
		user_id: user.id,
		kind: input.kind,
		title: input.title,
		subtitle: input.subtitle,
		price: input.price,
		reference
	}).select().single();
	if (bookingErr) throw new Error(`Failed to create booking: ${bookingErr.message}`);
	const label = input.kind === "flight" ? "✈ Flight booked" : input.kind === "stay" ? "🏨 Stay booked" : input.kind === "rental" ? "🚗 Rental booked" : input.kind === "rail" ? "🚆 Train/Bus booked" : "🎁 Package booked";
	await supabase.from("trips").insert({
		user_id: user.id,
		name: input.title,
		dates: input.subtitle,
		status: [label, `🎫 Ref ${reference}`],
		image: imageFor(input.title + " " + input.subtitle),
		bucket: "Upcoming"
	});
	return booking;
});
var cancelBookingFn_createServerFn_handler = createServerRpc({
	id: "bdbd675eb588c1d433d0f6a2f15a10e91a80f75d7901d69b86718178026daa7f",
	name: "cancelBookingFn",
	filename: "src/lib/server/trip-actions.ts"
}, (opts) => cancelBookingFn.__executeServer(opts));
var cancelBookingFn = createServerFn({ method: "POST" }).validator((data) => cancelBookingSchema.parse(data)).handler(cancelBookingFn_createServerFn_handler, async ({ data: { bookingId } }) => {
	const user = await getServerUser();
	if (!user) throw new Error("Unauthorized");
	const supabase = getSupabaseServerClient();
	const { data: booking } = await supabase.from("bookings").select("reference").eq("id", bookingId).eq("user_id", user.id).single();
	if (booking?.reference) await supabase.from("trips").delete().eq("user_id", user.id).contains("status", [`🎫 Ref ${booking.reference}`]);
	const { error } = await supabase.from("bookings").delete().eq("id", bookingId).eq("user_id", user.id);
	if (error) throw new Error(`Failed to cancel booking: ${error.message}`);
	return {
		success: true,
		bookingId
	};
});
var addFundFn_createServerFn_handler = createServerRpc({
	id: "931dfba0ee4a206f49bb50f037c97418b949bfebc263c02ed1227968cc551cd8",
	name: "addFundFn",
	filename: "src/lib/server/trip-actions.ts"
}, (opts) => addFundFn.__executeServer(opts));
var addFundFn = createServerFn({ method: "POST" }).validator((data) => addFundSchema.parse(data)).handler(addFundFn_createServerFn_handler, async ({ data: input }) => {
	const user = await getServerUser();
	if (!user) throw new Error("Unauthorized");
	const { data: fund, error } = await getSupabaseServerClient().from("funds").insert({
		user_id: user.id,
		name: input.name,
		target: input.target,
		saved: 0,
		emoji: "✈️",
		target_date: "Date flexible",
		months_left: input.monthsLeft ?? 12,
		travelers: input.travelers ?? 2,
		image: imageFor(input.name)
	}).select().single();
	if (error) throw new Error(`Failed to add fund: ${error.message}`);
	return fund;
});
var contributeFundFn_createServerFn_handler = createServerRpc({
	id: "5cd1f87fe447ad5e53de642b9cb6087a3f1dcb4366f5e31cb92aa7f8d94ba5d7",
	name: "contributeFundFn",
	filename: "src/lib/server/trip-actions.ts"
}, (opts) => contributeFundFn.__executeServer(opts));
var contributeFundFn = createServerFn({ method: "POST" }).validator((data) => contributeFundSchema.parse(data)).handler(contributeFundFn_createServerFn_handler, async ({ data: { fundId, amount } }) => {
	const user = await getServerUser();
	if (!user) throw new Error("Unauthorized");
	const supabase = getSupabaseServerClient();
	const { data: fund } = await supabase.from("funds").select("saved, target").eq("id", fundId).eq("user_id", user.id).single();
	if (!fund) throw new Error("Fund not found");
	const newSaved = Math.min(Number(fund.target), Number(fund.saved) + amount);
	await supabase.from("fund_contributions").insert({
		user_id: user.id,
		fund_id: fundId,
		amount
	});
	const { error } = await supabase.from("funds").update({
		saved: newSaved,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", fundId).eq("user_id", user.id);
	if (error) throw new Error(`Failed to contribute to fund: ${error.message}`);
	return {
		success: true,
		fundId,
		newSaved
	};
});
var removeFundFn_createServerFn_handler = createServerRpc({
	id: "63f8cea9fd4e57b3dcb957597a7b17923c130f56b618ff433b240c1c57fab926",
	name: "removeFundFn",
	filename: "src/lib/server/trip-actions.ts"
}, (opts) => removeFundFn.__executeServer(opts));
var removeFundFn = createServerFn({ method: "POST" }).validator((data) => removeFundSchema.parse(data)).handler(removeFundFn_createServerFn_handler, async ({ data: { fundId } }) => {
	const user = await getServerUser();
	if (!user) throw new Error("Unauthorized");
	const { error } = await getSupabaseServerClient().from("funds").delete().eq("id", fundId).eq("user_id", user.id);
	if (error) throw new Error(`Failed to delete fund: ${error.message}`);
	return {
		success: true,
		fundId
	};
});
var toggleWishFn_createServerFn_handler = createServerRpc({
	id: "8bfe39f698f4c275604038ca2ced4fd128db5f0c61de29bd6cc08d3f44c2adc0",
	name: "toggleWishFn",
	filename: "src/lib/server/trip-actions.ts"
}, (opts) => toggleWishFn.__executeServer(opts));
var toggleWishFn = createServerFn({ method: "POST" }).validator((data) => toggleWishSchema.parse(data)).handler(toggleWishFn_createServerFn_handler, async ({ data: { destinationId } }) => {
	const user = await getServerUser();
	if (!user) throw new Error("Unauthorized");
	const supabase = getSupabaseServerClient();
	const { data: existing } = await supabase.from("wishlist").select("id").eq("user_id", user.id).eq("destination_id", destinationId).maybeSingle();
	if (existing) {
		await supabase.from("wishlist").delete().eq("id", existing.id);
		return {
			inWishlist: false,
			destinationId
		};
	} else {
		await supabase.from("wishlist").insert({
			user_id: user.id,
			destination_id: destinationId
		});
		return {
			inWishlist: true,
			destinationId
		};
	}
});
var migrateGuestDataFn_createServerFn_handler = createServerRpc({
	id: "8b1ec4f6c4867366fa55ce2a8ae9b6f120f60c444d2457e7084b40154e1a25ac",
	name: "migrateGuestDataFn",
	filename: "src/lib/server/trip-actions.ts"
}, (opts) => migrateGuestDataFn.__executeServer(opts));
var migrateGuestDataFn = createServerFn({ method: "POST" }).validator((data) => migrateDataSchema.parse(data)).handler(migrateGuestDataFn_createServerFn_handler, async ({ data: guestData }) => {
	const user = await getServerUser();
	if (!user) throw new Error("Unauthorized");
	const supabase = getSupabaseServerClient();
	if (guestData.trips && guestData.trips.length > 0) {
		const nonSeedTrips = guestData.trips.filter((t) => !t.name.includes("Seed") && t.plan != null);
		if (nonSeedTrips.length > 0) await supabase.from("trips").insert(nonSeedTrips.map((t) => ({
			user_id: user.id,
			name: t.name,
			dates: t.dates,
			status: t.status,
			image: t.image,
			bucket: t.bucket,
			plan: t.plan
		})));
	}
	if (guestData.bookings && guestData.bookings.length > 0) await supabase.from("bookings").insert(guestData.bookings.map((b) => ({
		user_id: user.id,
		kind: b.kind,
		title: b.title,
		subtitle: b.subtitle,
		price: b.price,
		reference: b.reference || "ST" + Math.random().toString(36).slice(2, 8).toUpperCase()
	})));
	if (guestData.funds && guestData.funds.length > 0) {
		const customFunds = guestData.funds.filter((f) => Number(f.saved) > 0);
		if (customFunds.length > 0) await supabase.from("funds").insert(customFunds.map((f) => ({
			user_id: user.id,
			name: f.name,
			target: f.target,
			saved: f.saved || 0,
			emoji: f.emoji || "✈️",
			target_date: f.targetDate || "Date flexible",
			months_left: f.monthsLeft || 12,
			travelers: f.travelers || 2,
			image: f.image || images.hero
		})));
	}
	if (guestData.wishlist && guestData.wishlist.length > 0) {
		const uniqueWish = [...new Set(guestData.wishlist)];
		for (const destId of uniqueWish) await supabase.from("wishlist").insert({
			user_id: user.id,
			destination_id: destId
		}).select().maybeSingle();
	}
	return { success: true };
});
var updateProfileSchema = objectType({
	fullName: stringType().min(1).max(100).optional(),
	avatarUrl: stringType().max(1e3).optional(),
	homeCity: stringType().max(100).optional(),
	currency: stringType().max(10).optional()
});
var markNotificationReadSchema = objectType({ notificationId: stringType().min(1) });
/**
* Mark all notifications as read for current user.
*/
var markAllNotificationsReadFn_createServerFn_handler = createServerRpc({
	id: "02e0665d192973e438fe8090c1163452d4418a16646c1e84404d66a362d6caae",
	name: "markAllNotificationsReadFn",
	filename: "src/lib/server/trip-actions.ts"
}, (opts) => markAllNotificationsReadFn.__executeServer(opts));
var markAllNotificationsReadFn = createServerFn({ method: "POST" }).handler(markAllNotificationsReadFn_createServerFn_handler, async () => {
	const user = await getServerUser();
	if (!user) return { success: true };
	await getSupabaseServerClient().from("notifications").update({ read: true }).eq("user_id", user.id);
	return { success: true };
});
var markNotificationReadFn_createServerFn_handler = createServerRpc({
	id: "a60572cc86ef663a2912fe1bad819a4abfd81e2b5dd8d06330b33d847c04d8c9",
	name: "markNotificationReadFn",
	filename: "src/lib/server/trip-actions.ts"
}, (opts) => markNotificationReadFn.__executeServer(opts));
var markNotificationReadFn = createServerFn({ method: "POST" }).validator((data) => markNotificationReadSchema.parse(data)).handler(markNotificationReadFn_createServerFn_handler, async ({ data: { notificationId } }) => {
	const user = await getServerUser();
	if (!user) return { success: true };
	await getSupabaseServerClient().from("notifications").update({ read: true }).eq("id", notificationId).eq("user_id", user.id);
	return { success: true };
});
var updateProfileFn_createServerFn_handler = createServerRpc({
	id: "f203f334662883871f539b2937774eb64890d640f6007201f02c3cc6fd730d09",
	name: "updateProfileFn",
	filename: "src/lib/server/trip-actions.ts"
}, (opts) => updateProfileFn.__executeServer(opts));
var updateProfileFn = createServerFn({ method: "POST" }).validator((data) => updateProfileSchema.parse(data)).handler(updateProfileFn_createServerFn_handler, async ({ data }) => {
	const user = await getServerUser();
	if (!user) throw new Error("Unauthorized: Please sign in to update profile.");
	const supabase = getSupabaseServerClient();
	const updates = { updated_at: (/* @__PURE__ */ new Date()).toISOString() };
	if (data.fullName !== void 0) updates["full_name"] = data.fullName;
	if (data.avatarUrl !== void 0) updates["avatar_url"] = data.avatarUrl;
	if (data.homeCity !== void 0) updates["home_city"] = data.homeCity;
	if (data.currency !== void 0) updates["currency"] = data.currency;
	const { error } = await supabase.from("profiles").update(updates).eq("id", user.id);
	if (error) console.warn("Failed to update public.profiles table:", error.message);
	return { success: true };
});
var editFundSchema = objectType({
	fundId: stringType().min(1),
	name: stringType().min(1).max(100).optional(),
	target: numberType().positive().max(1e8).optional(),
	targetDate: stringType().optional(),
	monthsLeft: numberType().int().positive().max(120).optional(),
	travelers: numberType().int().positive().max(50).optional()
});
/**
* Edit a Trip Fund's name, target, dates, or travelers.
*/
var editFundFn_createServerFn_handler = createServerRpc({
	id: "a1d109d8932bb39d3f2bc923167e92cff4991a9185107f4c1fa7dc5f119c330f",
	name: "editFundFn",
	filename: "src/lib/server/trip-actions.ts"
}, (opts) => editFundFn.__executeServer(opts));
var editFundFn = createServerFn({ method: "POST" }).validator((data) => editFundSchema.parse(data)).handler(editFundFn_createServerFn_handler, async ({ data }) => {
	const user = await getServerUser();
	if (!user) throw new Error("Unauthorized");
	const supabase = getSupabaseServerClient();
	const updates = { updated_at: (/* @__PURE__ */ new Date()).toISOString() };
	if (data.name !== void 0) updates["name"] = data.name;
	if (data.target !== void 0) updates["target"] = data.target;
	if (data.targetDate !== void 0) updates["target_date"] = data.targetDate;
	if (data.monthsLeft !== void 0) updates["months_left"] = data.monthsLeft;
	if (data.travelers !== void 0) updates["travelers"] = data.travelers;
	const { data: updated, error } = await supabase.from("funds").update(updates).eq("id", data.fundId).eq("user_id", user.id).select().single();
	if (error) throw new Error(`Failed to edit fund: ${error.message}`);
	return updated;
});
var fetchFundContributionsFn_createServerFn_handler = createServerRpc({
	id: "dd332ae1dbf9164adb7bb85eb15b9f374be19110584f4bc586166c4964bd7173",
	name: "fetchFundContributionsFn",
	filename: "src/lib/server/trip-actions.ts"
}, (opts) => fetchFundContributionsFn.__executeServer(opts));
var fetchFundContributionsFn = createServerFn({ method: "GET" }).validator((data) => objectType({ fundId: stringType() }).parse(data)).handler(fetchFundContributionsFn_createServerFn_handler, async ({ data: { fundId } }) => {
	const user = await getServerUser();
	if (!user) return [];
	const { data: contributions, error } = await getSupabaseServerClient().from("fund_contributions").select("*").eq("fund_id", fundId).eq("user_id", user.id).order("created_at", { ascending: false });
	if (error) return [];
	return (contributions || []).map((c) => ({
		id: c.id,
		fundId: c.fund_id,
		amount: Number(c.amount),
		note: c.note || "Deposit",
		createdAt: new Date(c.created_at).getTime()
	}));
});
var submitReviewSchema = objectType({
	rating: numberType().int().min(1).max(5),
	destination: stringType().min(1).max(100),
	title: stringType().min(1).max(200),
	comment: stringType().min(10).max(2e3),
	tripTitle: stringType().max(200).optional()
});
/**
* Fetch public verified traveler reviews.
*/
var fetchReviewsFn_createServerFn_handler = createServerRpc({
	id: "71b33606d67dc9f2e41e0b11b410d728f0a473231b1e507d3e894c2b105c773b",
	name: "fetchReviewsFn",
	filename: "src/lib/server/trip-actions.ts"
}, (opts) => fetchReviewsFn.__executeServer(opts));
var fetchReviewsFn = createServerFn({ method: "GET" }).handler(fetchReviewsFn_createServerFn_handler, async () => {
	const { data: reviews, error } = await getSupabaseServerClient().from("reviews").select("*").order("created_at", { ascending: false }).limit(20);
	if (error || !reviews) return [];
	return reviews.map((r) => ({
		id: r.id,
		rating: Number(r.rating),
		destination: r.destination,
		title: r.title,
		comment: r.comment,
		authorName: r.author_name,
		authorAvatar: r.author_avatar || void 0,
		tripTitle: r.trip_title || void 0,
		verified: Boolean(r.verified ?? true),
		createdAt: new Date(r.created_at).getTime()
	}));
});
var submitReviewFn_createServerFn_handler = createServerRpc({
	id: "4d87462e66f0bb6fe95bdfb0504b53031fbd064d6860201cd01a03687ddb7cfe",
	name: "submitReviewFn",
	filename: "src/lib/server/trip-actions.ts"
}, (opts) => submitReviewFn.__executeServer(opts));
var submitReviewFn = createServerFn({ method: "POST" }).validator((data) => submitReviewSchema.parse(data)).handler(submitReviewFn_createServerFn_handler, async ({ data: input }) => {
	const user = await getServerUser();
	if (!user) throw new Error("Unauthorized: Please sign in to post a review.");
	const supabase = getSupabaseServerClient();
	const [bookingsRes, tripsRes] = await Promise.all([supabase.from("bookings").select("id").eq("user_id", user.id).limit(1), supabase.from("trips").select("id").eq("user_id", user.id).limit(1)]);
	const hasBooking = (bookingsRes.data?.length ?? 0) > 0;
	const hasTrip = (tripsRes.data?.length ?? 0) > 0;
	if (!hasBooking && !hasTrip) throw new Error("Verification required: Only travelers with an active booking or saved trip can post a verified review.");
	const authorName = user.user_metadata?.["full_name"] || user.user_metadata?.["name"] || "Verified Traveler";
	const authorAvatar = user.user_metadata?.["avatar_url"] || user.user_metadata?.["picture"] || "";
	const { data: review, error } = await supabase.from("reviews").insert({
		user_id: user.id,
		rating: input.rating,
		destination: input.destination,
		title: input.title,
		comment: input.comment,
		author_name: authorName,
		author_avatar: authorAvatar,
		trip_title: input.tripTitle || `${input.destination} Trip`,
		verified: true
	}).select().single();
	if (error) throw new Error(`Failed to submit review: ${error.message}`);
	return review;
});
var subscribeNewsletterSchema = objectType({ email: stringType().email("Please enter a valid email address").max(254) });
/**
* Subscribe email to the newsletter with duplicate protection.
*/
var subscribeNewsletterFn_createServerFn_handler = createServerRpc({
	id: "3a97518c51767dc894a36c0825ca5b75f78c63a4c8cf6c3a53d65c774ffd306f",
	name: "subscribeNewsletterFn",
	filename: "src/lib/server/trip-actions.ts"
}, (opts) => subscribeNewsletterFn.__executeServer(opts));
var subscribeNewsletterFn = createServerFn({ method: "POST" }).validator((data) => subscribeNewsletterSchema.parse(data)).handler(subscribeNewsletterFn_createServerFn_handler, async ({ data: { email } }) => {
	const supabase = getSupabaseServerClient();
	const normalized = email.trim().toLowerCase();
	const { data: existing } = await supabase.from("newsletter_subscribers").select("id").eq("email", normalized).maybeSingle();
	if (existing) return {
		status: "already_subscribed",
		message: "You're already subscribed to SmartTrip updates!"
	};
	const { error } = await supabase.from("newsletter_subscribers").insert({ email: normalized });
	if (error) {
		if (error.code === "23505") return {
			status: "already_subscribed",
			message: "You're already subscribed to SmartTrip updates!"
		};
		throw new Error(`Subscription failed: ${error.message}`);
	}
	return {
		status: "subscribed",
		message: "Welcome aboard! You're subscribed to weekly travel inspiration."
	};
});
var supportTicketSchema = objectType({
	name: stringType().min(1).max(100),
	email: stringType().email().max(254),
	category: enumType([
		"booking",
		"modification",
		"cancellation",
		"refund",
		"emergency",
		"general"
	]),
	subject: stringType().min(3).max(200),
	message: stringType().min(10).max(3e3)
});
/**
* Submit a customer support / helpline inquiry ticket.
*/
var submitSupportTicketFn_createServerFn_handler = createServerRpc({
	id: "f11da5c9526a36cbb43224da62b10178c08b25484310c126f1b77163007e7617",
	name: "submitSupportTicketFn",
	filename: "src/lib/server/trip-actions.ts"
}, (opts) => submitSupportTicketFn.__executeServer(opts));
var submitSupportTicketFn = createServerFn({ method: "POST" }).validator((data) => supportTicketSchema.parse(data)).handler(submitSupportTicketFn_createServerFn_handler, async ({ data: input }) => {
	const user = await getServerUser();
	const supabase = getSupabaseServerClient();
	const refId = "ST-" + Math.random().toString(36).slice(2, 8).toUpperCase();
	const { data: ticket, error } = await supabase.from("support_tickets").insert({
		user_id: user?.id ?? null,
		name: input.name,
		email: input.email,
		category: input.category,
		subject: input.subject,
		message: input.message,
		status: "open",
		priority: input.category === "emergency" ? "urgent" : "normal"
	}).select().single();
	if (error) throw new Error(`Failed to submit support request: ${error.message}`);
	return {
		success: true,
		reference: refId,
		ticket
	};
});
var pingKeepAliveFn_createServerFn_handler = createServerRpc({
	id: "102328bdb501c63eafe08c35ab76220563c946f2824c7a478c6db328c6928287",
	name: "pingKeepAliveFn",
	filename: "src/lib/server/trip-actions.ts"
}, (opts) => pingKeepAliveFn.__executeServer(opts));
var pingKeepAliveFn = createServerFn({ method: "GET" }).handler(pingKeepAliveFn_createServerFn_handler, async () => {
	const supabase = getSupabaseServerClient();
	const started = Date.now();
	let dbStatus = "ok";
	try {
		const { error } = await supabase.from("profiles").select("id").limit(1);
		if (error) dbStatus = `error: ${error.message}`;
	} catch (err) {
		dbStatus = err instanceof Error ? err.message : "failed";
	}
	return {
		status: "ok",
		database: dbStatus,
		timestamp: (/* @__PURE__ */ new Date()).toISOString(),
		durationMs: Date.now() - started,
		message: "SmartTrip Supabase keep-alive ping executed successfully."
	};
});
//#endregion
export { addBookingFn_createServerFn_handler, addFundFn_createServerFn_handler, cancelBookingFn_createServerFn_handler, contributeFundFn_createServerFn_handler, editFundFn_createServerFn_handler, fetchFundContributionsFn_createServerFn_handler, fetchReviewsFn_createServerFn_handler, fetchUserDataFn_createServerFn_handler, getUserFn_createServerFn_handler, markAllNotificationsReadFn_createServerFn_handler, markNotificationReadFn_createServerFn_handler, migrateGuestDataFn_createServerFn_handler, moveTripFn_createServerFn_handler, pingKeepAliveFn_createServerFn_handler, removeFundFn_createServerFn_handler, removeTripFn_createServerFn_handler, savePlanFn_createServerFn_handler, submitReviewFn_createServerFn_handler, submitSupportTicketFn_createServerFn_handler, subscribeNewsletterFn_createServerFn_handler, toggleWishFn_createServerFn_handler, updateProfileFn_createServerFn_handler };
