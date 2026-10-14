import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { o as images, s as initialFutureTrips, u as myTrips } from "./travel-Co-Z1Moz.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-Ce56fEsW.mjs";
import { a as TSS_SERVER_FUNCTION, l as createServerFn } from "./createServerFn-BPR289oA.mjs";
import { t as buildPlan } from "./trip-plan-DIsKoQ71.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { a as numberType, c as stringType, i as enumType, n as arrayType, o as objectType, s as recordType, t as anyType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/smarttrip-store-B4h7bmlO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var queryClient = new QueryClient({ defaultOptions: { queries: {
	staleTime: 3e5,
	refetchOnWindowFocus: false,
	retry: 1
} } });
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
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
createServerFn({ method: "GET" }).handler(createSsrRpc("615946e8ad34b0947398661a85a7cd6e980449d5fa50973581befb47b240d31a"));
/**
* Fetch all trips, bookings, funds, and wishlist for the authenticated user.
*/
var fetchUserDataFn = createServerFn({ method: "GET" }).handler(createSsrRpc("17d7ad668f4ce1d7d5626fe55abf4919d5608e831719ebf0d488f56cda4ffd12"));
/**
* Save an AI-generated trip plan to the user's account.
*/
var savePlanFn = createServerFn({ method: "POST" }).validator((data) => generatedPlanSchema.parse(data)).handler(createSsrRpc("b04330ff4cd882b306257199a46260af19cc762e8139018924a3644f291cceca"));
/**
* Move a trip to Upcoming, Past, or Saved.
*/
var moveTripFn = createServerFn({ method: "POST" }).validator((data) => moveTripSchema.parse(data)).handler(createSsrRpc("9045a2334e4945107485d40dba803b3cbc6d26fa3cd4df54c378f8acaa5bf0dd"));
/**
* Remove a trip from the database.
*/
var removeTripFn = createServerFn({ method: "POST" }).validator((data) => removeTripSchema.parse(data)).handler(createSsrRpc("0b08ff3b0f38c46a2a68400e1b5357f62ab459f51eb1333f433964238b64b7b1"));
/**
* Add a booking and corresponding upcoming trip.
*/
var addBookingFn = createServerFn({ method: "POST" }).validator((data) => addBookingSchema.parse(data)).handler(createSsrRpc("be61a83279daf7ebcbd4f1c8e095fc37182cda0e77472d87a085de92d1f53e24"));
/**
* Cancel a booking and remove linked trip.
*/
var cancelBookingFn = createServerFn({ method: "POST" }).validator((data) => cancelBookingSchema.parse(data)).handler(createSsrRpc("bdbd675eb588c1d433d0f6a2f15a10e91a80f75d7901d69b86718178026daa7f"));
/**
* Create a new Trip Fund goal.
*/
var addFundFn = createServerFn({ method: "POST" }).validator((data) => addFundSchema.parse(data)).handler(createSsrRpc("931dfba0ee4a206f49bb50f037c97418b949bfebc263c02ed1227968cc551cd8"));
/**
* Contribute money to a Trip Fund.
*/
var contributeFundFn = createServerFn({ method: "POST" }).validator((data) => contributeFundSchema.parse(data)).handler(createSsrRpc("5cd1f87fe447ad5e53de642b9cb6087a3f1dcb4366f5e31cb92aa7f8d94ba5d7"));
/**
* Remove a Trip Fund goal.
*/
var removeFundFn = createServerFn({ method: "POST" }).validator((data) => removeFundSchema.parse(data)).handler(createSsrRpc("63f8cea9fd4e57b3dcb957597a7b17923c130f56b618ff433b240c1c57fab926"));
/**
* Toggle a destination in the user's wishlist.
*/
var toggleWishFn = createServerFn({ method: "POST" }).validator((data) => toggleWishSchema.parse(data)).handler(createSsrRpc("8bfe39f698f4c275604038ca2ced4fd128db5f0c61de29bd6cc08d3f44c2adc0"));
/**
* Migrate guest local storage data to the user account on sign-up (one-time).
*/
var migrateGuestDataFn = createServerFn({ method: "POST" }).validator((data) => migrateDataSchema.parse(data)).handler(createSsrRpc("8b1ec4f6c4867366fa55ce2a8ae9b6f120f60c444d2457e7084b40154e1a25ac"));
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
var markAllNotificationsReadFn = createServerFn({ method: "POST" }).handler(createSsrRpc("02e0665d192973e438fe8090c1163452d4418a16646c1e84404d66a362d6caae"));
/**
* Mark a single notification as read.
*/
var markNotificationReadFn = createServerFn({ method: "POST" }).validator((data) => markNotificationReadSchema.parse(data)).handler(createSsrRpc("a60572cc86ef663a2912fe1bad819a4abfd81e2b5dd8d06330b33d847c04d8c9"));
/**
* Update user profile (name, avatar, home city, currency).
*/
var updateProfileFn = createServerFn({ method: "POST" }).validator((data) => updateProfileSchema.parse(data)).handler(createSsrRpc("f203f334662883871f539b2937774eb64890d640f6007201f02c3cc6fd730d09"));
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
var editFundFn = createServerFn({ method: "POST" }).validator((data) => editFundSchema.parse(data)).handler(createSsrRpc("a1d109d8932bb39d3f2bc923167e92cff4991a9185107f4c1fa7dc5f119c330f"));
createServerFn({ method: "GET" }).validator((data) => objectType({ fundId: stringType() }).parse(data)).handler(createSsrRpc("dd332ae1dbf9164adb7bb85eb15b9f374be19110584f4bc586166c4964bd7173"));
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
var fetchReviewsFn = createServerFn({ method: "GET" }).handler(createSsrRpc("71b33606d67dc9f2e41e0b11b410d728f0a473231b1e507d3e894c2b105c773b"));
/**
* Submit a verified review. User must have an active booking or trip.
*/
var submitReviewFn = createServerFn({ method: "POST" }).validator((data) => submitReviewSchema.parse(data)).handler(createSsrRpc("4d87462e66f0bb6fe95bdfb0504b53031fbd064d6860201cd01a03687ddb7cfe"));
var subscribeNewsletterSchema = objectType({ email: stringType().email("Please enter a valid email address").max(254) });
/**
* Subscribe email to the newsletter with duplicate protection.
*/
var subscribeNewsletterFn = createServerFn({ method: "POST" }).validator((data) => subscribeNewsletterSchema.parse(data)).handler(createSsrRpc("3a97518c51767dc894a36c0825ca5b75f78c63a4c8cf6c3a53d65c774ffd306f"));
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
var submitSupportTicketFn = createServerFn({ method: "POST" }).validator((data) => supportTicketSchema.parse(data)).handler(createSsrRpc("f11da5c9526a36cbb43224da62b10178c08b25484310c126f1b77163007e7617"));
createServerFn({ method: "GET" }).handler(createSsrRpc("102328bdb501c63eafe08c35ab76220563c946f2824c7a478c6db328c6928287"));
/**
* Live Data Server Functions (Weather, Currency, Price Alerts)
* Uses free, key-less APIs (Open-Meteo & Frankfurter) with server caching and fallback.
*/
var weatherCoordsSchema = objectType({
	lat: numberType().min(-90).max(90),
	lng: numberType().min(-180).max(180)
});
var getWeatherForecastFn = createServerFn({ method: "GET" }).validator((data) => weatherCoordsSchema.parse(data)).handler(createSsrRpc("fa9ee77ffe251bc0916b19b43a9c3f21256ec53a0b10ba8fbd4caaa2b6e6a4bb"));
var destinationWeatherSchema = objectType({ destinationId: stringType() });
createServerFn({ method: "GET" }).validator((data) => destinationWeatherSchema.parse(data)).handler(createSsrRpc("1611289d933a872694f6cc3586a35e88a16e3484dd9f454e5ccf940158ae325c"));
var getHillStationsWeatherFn = createServerFn({ method: "GET" }).handler(createSsrRpc("891abff19123b7aa63c508ff102b9a57c73553be0ef72bc7b7cabb5857f43e53"));
var getExchangeRatesFn = createServerFn({ method: "GET" }).handler(createSsrRpc("729f5909c7630bf2b529b2adf430d6301ff9f9998f40b9598d3127047c68c8c0"));
var convertCurrencySchema = objectType({
	amount: numberType().nonnegative(),
	targetCurrency: stringType()
});
createServerFn({ method: "POST" }).validator((data) => convertCurrencySchema.parse(data)).handler(createSsrRpc("a63d62b82d638a10f773c2708e33d22a1a9c928d98fc72b421526b2cb60e3813"));
var createPriceAlertSchema = objectType({
	itemType: enumType([
		"flight",
		"stay",
		"package"
	]),
	itemId: stringType().min(1),
	title: stringType().min(1),
	targetPrice: numberType().positive(),
	basePrice: numberType().positive()
});
var createPriceAlertFn = createServerFn({ method: "POST" }).validator((data) => createPriceAlertSchema.parse(data)).handler(createSsrRpc("eb58c4fbb677bd08be1490b5682abeed1b34ea4944baad384273b8ae331faa93"));
createServerFn({ method: "GET" }).handler(createSsrRpc("36625e91f7d1b41e49a2b4546661a36c9490162460909a2d80f0f02c73d005a8"));
var deletePriceAlertSchema = objectType({ alertId: stringType() });
var deletePriceAlertFn = createServerFn({ method: "POST" }).validator((data) => deletePriceAlertSchema.parse(data)).handler(createSsrRpc("f87f0ad4ca5952361b1412fa33710536a8e636c3422d35378806366b92c8ae97"));
createServerFn({ method: "GET" }).validator((data) => objectType({ itemId: stringType() }).parse(data)).handler(createSsrRpc("8196e04d7c275b179132316dba925dd5b7c9c5c90288b55c528f1e17a29ad1b6"));
var STORAGE_KEY = "smarttrip.state.v1";
function seedTrips() {
	return Object.keys(myTrips).flatMap((bucket) => myTrips[bucket].map((t, i) => ({
		id: `seed-${bucket}-${i}`,
		name: t.name,
		dates: t.dates,
		status: t.status,
		image: t.image,
		bucket
	})));
}
var SEED_NOTIFICATIONS = [
	{
		id: "notif-seed-1",
		title: "Booking Confirmed",
		message: "IndiGo 6E-247 (DEL → GOI) is confirmed. Reference: #ST89241.",
		read: false,
		type: "booking",
		createdAt: Date.now() - 21e5,
		link: "/bookings"
	},
	{
		id: "notif-seed-2",
		title: "Dream Fund Milestone",
		message: "Tokyo Cherry Blossom dream fund reached 65% of your target! You are ₹65,000 closer to Japan.",
		read: false,
		type: "milestone",
		createdAt: Date.now() - 144e5,
		link: "/save"
	},
	{
		id: "notif-seed-3",
		title: "Price Drop Alert",
		message: "Direct flights to Bali dropped 18% for upcoming festive dates. Explore deals now!",
		read: false,
		type: "price_drop",
		createdAt: Date.now() - 864e5,
		link: "/destination/bali"
	}
];
var SEED = {
	trips: seedTrips(),
	bookings: [],
	funds: initialFutureTrips,
	fundContributions: [{
		id: "seed-contrib-1",
		fundId: "seed-fund-0",
		amount: 15e3,
		note: "Initial savings deposit",
		createdAt: Date.now() - 6048e5
	}, {
		id: "seed-contrib-2",
		fundId: "seed-fund-0",
		amount: 25e3,
		note: "Monthly goal contribution",
		createdAt: Date.now() - 1728e5
	}],
	wishlist: [],
	notifications: SEED_NOTIFICATIONS,
	priceAlerts: [],
	isLoading: false,
	isError: false,
	isAuthenticated: false
};
var localState = SEED;
var hydrated = false;
var currentAuthUser = null;
var listeners = /* @__PURE__ */ new Set();
function setStoreAuthUser(user) {
	currentAuthUser = user;
}
function emit() {
	for (const l of listeners) l();
}
function persist() {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(localState));
	} catch {}
}
function hydrate() {
	if (hydrated) return;
	hydrated = true;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw) {
			const parsed = JSON.parse(raw);
			localState = {
				trips: parsed.trips ?? SEED.trips,
				bookings: parsed.bookings ?? [],
				funds: parsed.funds ?? SEED.funds,
				fundContributions: parsed.fundContributions ?? SEED.fundContributions,
				wishlist: parsed.wishlist ?? [],
				notifications: parsed.notifications ?? SEED_NOTIFICATIONS,
				priceAlerts: parsed.priceAlerts ?? [],
				isLoading: false,
				isError: false,
				isAuthenticated: false
			};
			emit();
		}
	} catch {}
}
function update(patch) {
	localState = {
		...localState,
		...patch
	};
	persist();
	emit();
}
function subscribe(listener) {
	listeners.add(listener);
	return () => listeners.delete(listener);
}
/**
* Access SmartTrip state.
* If user is authenticated, reads and caches via TanStack Query and Supabase.
* If user is a guest, reads and writes locally via localStorage.
*/
function useSmartTrip() {
	(0, import_react.useEffect)(hydrate, []);
	const local = (0, import_react.useSyncExternalStore)(subscribe, () => localState, () => SEED);
	const isAuth = Boolean(currentAuthUser);
	const query = useQuery({
		queryKey: ["smarttrip-data", currentAuthUser?.id],
		queryFn: async () => {
			return await fetchUserDataFn();
		},
		enabled: isAuth
	});
	if (isAuth) {
		if (query.isLoading) return {
			trips: local.trips,
			bookings: local.bookings,
			funds: local.funds,
			fundContributions: local.fundContributions,
			wishlist: local.wishlist,
			notifications: local.notifications,
			priceAlerts: local.priceAlerts,
			isLoading: true,
			isError: false,
			isAuthenticated: true,
			refetch: () => query.refetch()
		};
		if (query.isError) return {
			trips: local.trips,
			bookings: local.bookings,
			funds: local.funds,
			fundContributions: local.fundContributions,
			wishlist: local.wishlist,
			notifications: local.notifications,
			priceAlerts: local.priceAlerts,
			isLoading: false,
			isError: true,
			isAuthenticated: true,
			refetch: () => query.refetch()
		};
		if (query.data && query.data.authenticated) return {
			trips: query.data.trips,
			bookings: query.data.bookings,
			funds: query.data.funds,
			fundContributions: local.fundContributions,
			wishlist: query.data.wishlist,
			notifications: query.data.notifications || local.notifications,
			priceAlerts: local.priceAlerts,
			isLoading: false,
			isError: false,
			isAuthenticated: true,
			refetch: () => query.refetch()
		};
	}
	return {
		...local,
		isLoading: false,
		isError: false,
		isAuthenticated: false
	};
}
var id = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
function imageFor(text) {
	const t = text.toLowerCase();
	if (/goa|beach|coast/.test(t)) return images.goa;
	if (/japan|kyoto|tokyo/.test(t)) return images.japan;
	if (/kashmir|srinagar|dal/.test(t)) return images.kashmir;
	if (/maldives|island|lagoon/.test(t)) return images.maldives;
	if (/manali|himachal|hill|shimla|munnar/.test(t)) return images.manali;
	return images.hero;
}
var smartTrip = {
	savePlan(plan) {
		const trip = {
			id: id("trip"),
			name: plan.title.replace(/ · smart plan$/, " Plan"),
			dates: `Flexible · est. ₹${plan.budget.toLocaleString("en-IN")}`,
			status: ["💾 AI plan saved", `🗓 ${plan.days.length}-day itinerary`],
			image: imageFor(plan.title + " " + plan.summary),
			bucket: "Saved",
			plan
		};
		update({ trips: [trip, ...localState.trips] });
		if (currentAuthUser) {
			queryClient.setQueryData(["smarttrip-data", currentAuthUser.id], (old) => ({
				...old,
				trips: [trip, ...old?.trips || []]
			}));
			savePlanFn({ data: plan }).then(() => {
				queryClient.invalidateQueries({ queryKey: ["smarttrip-data"] });
			}).catch((err) => {
				console.error("Failed to sync plan to server:", err);
				toast.error("Could not sync plan to cloud. Stored locally.");
			});
		}
		return trip;
	},
	addPlaceToTrip(place) {
		let targetTrip = localState.trips.find((t) => t.bucket !== "Past" && (t.name.toLowerCase().includes(place.destinationId.toLowerCase()) || t.plan?.title && t.plan.title.toLowerCase().includes(place.destinationId.toLowerCase())));
		if (!targetTrip) targetTrip = localState.trips.find((t) => t.bucket !== "Past") || localState.trips[0];
		if (targetTrip) {
			const updatedStatus = [.../* @__PURE__ */ new Set([...targetTrip.status, `📍 Added: ${place.name}`])];
			let updatedPlan = targetTrip.plan;
			if (updatedPlan) if (place.type === "Hotels") updatedPlan = {
				...updatedPlan,
				stays: [.../* @__PURE__ */ new Set([...updatedPlan.stays, place.name])]
			};
			else if (place.type === "Restaurants") updatedPlan = {
				...updatedPlan,
				food: [.../* @__PURE__ */ new Set([...updatedPlan.food, place.name])]
			};
			else {
				const firstDay = updatedPlan.days[0];
				if (firstDay) firstDay.items = [.../* @__PURE__ */ new Set([...firstDay.items, `⭐ Visit ${place.name}`])];
				updatedPlan = {
					...updatedPlan,
					tips: [.../* @__PURE__ */ new Set([...updatedPlan.tips, `Recommended: ${place.name}`])]
				};
			}
			const modifiedTrip = {
				...targetTrip,
				status: updatedStatus,
				...updatedPlan ? { plan: updatedPlan } : {}
			};
			const patchTrips = (trips) => trips.map((t) => t.id === targetTrip.id ? modifiedTrip : t);
			update({ trips: patchTrips(localState.trips) });
			if (currentAuthUser && updatedPlan) savePlanFn({ data: updatedPlan }).catch(() => {});
			return modifiedTrip;
		}
		const newPlan = buildPlan(`Trip to ${place.name} in ${place.destinationId}`);
		return smartTrip.savePlan(newPlan);
	},
	moveTrip(tripId, bucket) {
		const patchTrips = (trips) => trips.map((t) => t.id === tripId ? {
			...t,
			bucket,
			status: bucket === "Upcoming" ? [.../* @__PURE__ */ new Set([...t.status, "✅ Moved to upcoming"])] : bucket === "Past" ? [.../* @__PURE__ */ new Set([...t.status, "🏁 Trip completed"])] : t.status
		} : t);
		update({ trips: patchTrips(localState.trips) });
		if (currentAuthUser) {
			queryClient.setQueryData(["smarttrip-data", currentAuthUser.id], (old) => ({
				...old,
				trips: patchTrips(old?.trips || [])
			}));
			moveTripFn({ data: {
				tripId,
				bucket
			} }).then(() => queryClient.invalidateQueries({ queryKey: ["smarttrip-data"] })).catch((err) => {
				console.error("Failed to move trip on server:", err);
				toast.error("Could not sync trip update to cloud.");
			});
		}
	},
	removeTrip(tripId) {
		update({ trips: localState.trips.filter((t) => t.id !== tripId) });
		if (currentAuthUser) {
			queryClient.setQueryData(["smarttrip-data", currentAuthUser.id], (old) => ({
				...old,
				trips: (old?.trips || []).filter((t) => t.id !== tripId)
			}));
			removeTripFn({ data: { tripId } }).then(() => queryClient.invalidateQueries({ queryKey: ["smarttrip-data"] })).catch((err) => {
				console.error("Failed to remove trip on server:", err);
				toast.error("Could not remove trip from cloud.");
			});
		}
	},
	addBooking(input) {
		const reference = input.reference || "ST" + Math.random().toString(36).slice(2, 8).toUpperCase();
		const booking = {
			...input,
			id: id("bkg"),
			reference,
			status: input.status || "confirmed",
			createdAt: Date.now()
		};
		const label = input.kind === "flight" ? "✈ Flight booked" : input.kind === "stay" ? "🏨 Stay booked" : input.kind === "rental" ? "🚗 Rental booked" : input.kind === "rail" ? "🚆 Train/Bus booked" : "🎁 Package booked";
		const trip = {
			id: id("trip"),
			name: input.title,
			dates: input.subtitle,
			status: [label, `🎫 Ref ${booking.reference}`],
			image: imageFor(input.title + " " + input.subtitle),
			bucket: "Upcoming"
		};
		const bookingNotif = {
			id: id("notif"),
			title: "Booking Confirmed",
			message: `${input.title} booked successfully (Ref: ${booking.reference}).`,
			read: false,
			type: "booking",
			createdAt: Date.now(),
			link: `/booking-confirmation/${booking.reference}`
		};
		update({
			bookings: [booking, ...localState.bookings],
			trips: [trip, ...localState.trips],
			notifications: [bookingNotif, ...localState.notifications]
		});
		if (currentAuthUser) {
			queryClient.setQueryData(["smarttrip-data", currentAuthUser.id], (old) => ({
				...old,
				bookings: [booking, ...old?.bookings || []],
				trips: [trip, ...old?.trips || []]
			}));
			addBookingFn({ data: input }).then(() => queryClient.invalidateQueries({ queryKey: ["smarttrip-data"] })).catch((err) => {
				console.error("Failed to sync booking to server:", err);
				toast.error("Booking saved locally; cloud sync failed.");
			});
		}
		return booking;
	},
	cancelBooking(bookingId) {
		const booking = localState.bookings.find((b) => b.id === bookingId);
		update({
			bookings: localState.bookings.filter((b) => b.id !== bookingId),
			trips: booking ? localState.trips.filter((t) => !t.status.some((s) => s.includes(booking.reference))) : localState.trips
		});
		if (currentAuthUser) {
			queryClient.setQueryData(["smarttrip-data", currentAuthUser.id], (old) => ({
				...old,
				bookings: (old?.bookings || []).filter((b) => b.id !== bookingId),
				trips: booking ? (old?.trips || []).filter((t) => !t.status.some((s) => s.includes(booking.reference))) : old?.trips || []
			}));
			cancelBookingFn({ data: { bookingId } }).then(() => queryClient.invalidateQueries({ queryKey: ["smarttrip-data"] })).catch((err) => {
				console.error("Failed to cancel booking on server:", err);
				toast.error("Could not cancel booking in cloud.");
			});
		}
	},
	addFund(input) {
		const fund = {
			id: id("fund"),
			emoji: "✈️",
			name: input.name,
			target: input.target,
			saved: 0,
			targetDate: "Date flexible",
			monthsLeft: input.monthsLeft ?? 12,
			travelers: input.travelers ?? 2,
			image: imageFor(input.name)
		};
		update({ funds: [fund, ...localState.funds] });
		if (currentAuthUser) {
			queryClient.setQueryData(["smarttrip-data", currentAuthUser.id], (old) => ({
				...old,
				funds: [fund, ...old?.funds || []]
			}));
			addFundFn({ data: input }).then(() => queryClient.invalidateQueries({ queryKey: ["smarttrip-data"] })).catch((err) => {
				console.error("Failed to add fund on server:", err);
				toast.error("Could not save fund goal to cloud.");
			});
		}
		return fund;
	},
	contribute(fundId, amount, note) {
		const fund = localState.funds.find((f) => f.id === fundId);
		if (!fund) return {
			done: false,
			newSaved: 0,
			milestone: null
		};
		const oldSaved = fund.saved;
		const oldPct = Math.floor(oldSaved / fund.target * 100);
		const newSaved = Math.min(fund.target, oldSaved + amount);
		const newPct = Math.floor(newSaved / fund.target * 100);
		const contrib = {
			id: id("contrib"),
			fundId,
			amount,
			note: note || "Deposit",
			createdAt: Date.now()
		};
		const milestones = [
			25,
			50,
			75,
			100
		];
		const newNotifs = [];
		let crossedMilestone = null;
		for (const m of milestones) if (oldPct < m && newPct >= m) {
			crossedMilestone = m;
			newNotifs.push({
				id: id("notif"),
				title: m === 100 ? "🎉 Dream Goal Reached!" : `🎯 ${m}% Fund Milestone!`,
				message: m === 100 ? `Congratulations! You've reached 100% of your ${fund.name} savings goal (₹${fund.target.toLocaleString("en-IN")}). Pack your bags!` : `You've reached ${m}% of your goal for ${fund.name}! You're ₹${newSaved.toLocaleString("en-IN")} closer to takeoff.`,
				read: false,
				type: "milestone",
				createdAt: Date.now(),
				link: "/save"
			});
		}
		const patchFunds = (funds) => funds.map((f) => f.id === fundId ? {
			...f,
			saved: newSaved
		} : f);
		update({
			funds: patchFunds(localState.funds),
			fundContributions: [contrib, ...localState.fundContributions],
			notifications: newNotifs.length > 0 ? [...newNotifs, ...localState.notifications] : localState.notifications
		});
		if (currentAuthUser) {
			queryClient.setQueryData(["smarttrip-data", currentAuthUser.id], (old) => ({
				...old,
				funds: patchFunds(old?.funds || [])
			}));
			contributeFundFn({ data: {
				fundId,
				amount
			} }).then(() => queryClient.invalidateQueries({ queryKey: ["smarttrip-data"] })).catch((err) => {
				console.error("Failed to contribute to fund on server:", err);
				toast.error("Could not record contribution in cloud.");
			});
		}
		return {
			done: newSaved >= fund.target,
			milestone: crossedMilestone,
			newSaved
		};
	},
	editFund(fundId, input) {
		const patchFunds = (funds) => funds.map((f) => f.id === fundId ? {
			...f,
			...input.name !== void 0 ? { name: input.name } : {},
			...input.target !== void 0 ? { target: input.target } : {},
			...input.targetDate !== void 0 ? { targetDate: input.targetDate } : {},
			...input.monthsLeft !== void 0 ? { monthsLeft: input.monthsLeft } : {},
			...input.travelers !== void 0 ? { travelers: input.travelers } : {}
		} : f);
		update({ funds: patchFunds(localState.funds) });
		if (currentAuthUser) {
			queryClient.setQueryData(["smarttrip-data", currentAuthUser.id], (old) => ({
				...old,
				funds: patchFunds(old?.funds || [])
			}));
			editFundFn({ data: {
				fundId,
				...input
			} }).then(() => queryClient.invalidateQueries({ queryKey: ["smarttrip-data"] })).catch((err) => {
				console.error("Failed to edit fund on server:", err);
				toast.error("Could not update fund goal in cloud.");
			});
		}
	},
	getFundContributions(fundId) {
		return localState.fundContributions.filter((c) => c.fundId === fundId);
	},
	removeFund(fundId) {
		update({ funds: localState.funds.filter((f) => f.id !== fundId) });
		if (currentAuthUser) {
			queryClient.setQueryData(["smarttrip-data", currentAuthUser.id], (old) => ({
				...old,
				funds: (old?.funds || []).filter((f) => f.id !== fundId)
			}));
			removeFundFn({ data: { fundId } }).then(() => queryClient.invalidateQueries({ queryKey: ["smarttrip-data"] })).catch((err) => {
				console.error("Failed to remove fund on server:", err);
				toast.error("Could not delete fund goal from cloud.");
			});
		}
	},
	toggleWish(destinationId) {
		const has = localState.wishlist.includes(destinationId);
		const newWish = has ? localState.wishlist.filter((x) => x !== destinationId) : [...localState.wishlist, destinationId];
		update({ wishlist: newWish });
		if (currentAuthUser) {
			queryClient.setQueryData(["smarttrip-data", currentAuthUser.id], (old) => ({
				...old,
				wishlist: newWish
			}));
			toggleWishFn({ data: { destinationId } }).then(() => queryClient.invalidateQueries({ queryKey: ["smarttrip-data"] })).catch((err) => {
				console.error("Failed to toggle wish on server:", err);
				toast.error("Could not update wishlist in cloud.");
			});
		}
		return !has;
	},
	markAllNotificationsRead() {
		update({ notifications: localState.notifications.map((n) => ({
			...n,
			read: true
		})) });
		if (currentAuthUser) {
			queryClient.setQueryData(["smarttrip-data", currentAuthUser.id], (old) => ({
				...old,
				notifications: (old?.notifications || []).map((n) => ({
					...n,
					read: true
				}))
			}));
			markAllNotificationsReadFn().catch((err) => {
				console.error("Failed to mark all notifications read:", err);
			});
		}
	},
	markNotificationRead(notificationId) {
		update({ notifications: localState.notifications.map((n) => n.id === notificationId ? {
			...n,
			read: true
		} : n) });
		if (currentAuthUser) {
			queryClient.setQueryData(["smarttrip-data", currentAuthUser.id], (old) => ({
				...old,
				notifications: (old?.notifications || []).map((n) => n.id === notificationId ? {
					...n,
					read: true
				} : n)
			}));
			markNotificationReadFn({ data: { notificationId } }).catch((err) => {
				console.error("Failed to mark notification read:", err);
			});
		}
	},
	addNotification(input) {
		const notif = {
			id: id("notif"),
			title: input.title,
			message: input.message,
			type: input.type,
			read: false,
			createdAt: Date.now(),
			link: input.link
		};
		update({ notifications: [notif, ...localState.notifications] });
		return notif;
	},
	addPriceAlert(input) {
		const alert = {
			id: id("alt"),
			itemType: input.itemType,
			itemId: input.itemId,
			title: input.title,
			targetPrice: input.targetPrice,
			basePrice: input.basePrice,
			currentPrice: input.basePrice,
			isActive: true,
			createdAt: Date.now()
		};
		update({ priceAlerts: [alert, ...localState.priceAlerts] });
		if (currentAuthUser) createPriceAlertFn({ data: input }).catch((err) => {
			console.error("Failed to create price alert on server:", err);
		});
		return alert;
	},
	removePriceAlert(alertId) {
		update({ priceAlerts: localState.priceAlerts.filter((a) => a.id !== alertId) });
		if (currentAuthUser) deletePriceAlertFn({ data: { alertId } }).catch((err) => {
			console.error("Failed to delete price alert on server:", err);
		});
	},
	getState() {
		return localState;
	},
	reset() {
		update({
			...SEED,
			trips: seedTrips(),
			fundContributions: SEED.fundContributions,
			notifications: SEED_NOTIFICATIONS,
			priceAlerts: []
		});
	}
};
//#endregion
export { getHillStationsWeatherFn as a, queryClient as c, submitReviewFn as d, submitSupportTicketFn as f, useSmartTrip as h, getExchangeRatesFn as i, setStoreAuthUser as l, updateProfileFn as m, createSsrRpc as n, getWeatherForecastFn as o, subscribeNewsletterFn as p, fetchReviewsFn as r, migrateGuestDataFn as s, createPriceAlertFn as t, smartTrip as u };
