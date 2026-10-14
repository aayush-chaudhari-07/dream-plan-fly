import { r as destinations } from "./travel-Co-Z1Moz.mjs";
import { l as createServerFn } from "./createServerFn-BPR289oA.mjs";
import { a as numberType, c as stringType, i as enumType, o as objectType } from "../_libs/zod.mjs";
import { i as getSupabaseServerClient, n as getFluctuatedPrice, r as getServerUser, t as getDailyFluctuationPercent } from "./ssr.mjs";
import { r as createServerRpc } from "./rate-limiter-IgkJH91V.mjs";
import { t as assertServerFnRateLimit } from "./rate-limit-guard-DYkK8K-r.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/live-data-actions-D04CV64T.js
var WEATHER_CACHE_TTL_MS = 18e5;
var weatherCache = /* @__PURE__ */ new Map();
/**
* Maps WMO Weather Interpretation Codes to human descriptions
* https://open-meteo.com/en/docs
*/
function describeWmoCode(code) {
	switch (code) {
		case 0: return "Clear Sky";
		case 1: return "Mainly Clear";
		case 2: return "Partly Cloudy";
		case 3: return "Overcast";
		case 45:
		case 48: return "Foggy / Mist";
		case 51:
		case 53:
		case 55: return "Drizzle";
		case 56:
		case 57: return "Freezing Drizzle";
		case 61:
		case 63:
		case 65: return "Rain Showers";
		case 66:
		case 67: return "Freezing Rain";
		case 71:
		case 73:
		case 75: return "Snowfall";
		case 77: return "Snow Grains";
		case 80:
		case 81:
		case 82: return "Heavy Rain Showers";
		case 85:
		case 86: return "Snow Showers";
		case 95: return "Thunderstorm";
		case 96:
		case 99: return "Thunderstorm with Hail";
		default: return "Pleasant & Clear";
	}
}
var DAY_NAMES = [
	"Sun",
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat"
];
/**
* Deterministic fallback weather when Open-Meteo API is unreachable or fails
*/
function getFallbackWeather(lat, lng) {
	const baseTemp = lat > 28 ? 12 : lat < 15 && lng > 75 ? 18 : 26;
	const now = /* @__PURE__ */ new Date();
	const daily = [];
	for (let i = 0; i < 7; i++) {
		const d = new Date(now.getTime() + i * 24 * 60 * 60 * 1e3);
		const dayName = DAY_NAMES[d.getDay()] || "Day";
		const dateStr = d.toISOString().slice(0, 10);
		const variance = i % 3 - 1;
		daily.push({
			date: dateStr,
			dayName,
			weatherCode: 1,
			condition: "Mainly Clear",
			tempMax: Math.round(baseTemp + 4 + variance),
			tempMin: Math.round(baseTemp - 3 + variance),
			precipitationProbability: i * 10 % 35
		});
	}
	return {
		current: {
			temperature: baseTemp,
			condition: "Mainly Clear",
			weatherCode: 1,
			humidity: 55,
			windSpeed: 8,
			fetchedAt: Date.now()
		},
		daily,
		attribution: "Weather data by Open-Meteo.com (Offline Fallback)",
		attributionUrl: "https://open-meteo.com/",
		isFallback: true,
		latitude: lat,
		longitude: lng
	};
}
/**
* Fetch live current weather + 7-day forecast from Open-Meteo
*/
async function fetchWeatherForecast(lat, lng) {
	const cacheKey = `${lat.toFixed(2)}_${lng.toFixed(2)}`;
	const cached = weatherCache.get(cacheKey);
	if (cached && Date.now() - cached.timestamp < WEATHER_CACHE_TTL_MS) return cached.data;
	const endpoint = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;
	try {
		const res = await fetch(endpoint, { headers: { Accept: "application/json" } });
		if (!res.ok) {
			console.warn(`Open-Meteo API returned status ${res.status}. Using fallback weather.`);
			return getFallbackWeather(lat, lng);
		}
		const json = await res.json();
		if (!json.current || !json.daily || !json.daily.time) {
			console.warn("Open-Meteo response missing required fields. Using fallback.");
			return getFallbackWeather(lat, lng);
		}
		const currentCode = json.current.weather_code ?? 0;
		const currentTemp = Math.round((json.current.temperature_2m ?? 20) * 10) / 10;
		const daily = [];
		const count = Math.min(json.daily.time.length, 7);
		for (let i = 0; i < count; i++) {
			const dateStr = json.daily.time[i] ?? "";
			const code = json.daily.weather_code?.[i] ?? 0;
			const d = new Date(dateStr);
			const dayName = isNaN(d.getTime()) ? `Day ${i + 1}` : DAY_NAMES[d.getDay()] ?? "Day";
			daily.push({
				date: dateStr,
				dayName,
				weatherCode: code,
				condition: describeWmoCode(code),
				tempMax: Math.round((json.daily.temperature_2m_max?.[i] ?? currentTemp + 3) * 10) / 10,
				tempMin: Math.round((json.daily.temperature_2m_min?.[i] ?? currentTemp - 4) * 10) / 10,
				precipitationProbability: json.daily.precipitation_probability_max?.[i] ?? 0
			});
		}
		const result = {
			current: {
				temperature: currentTemp,
				condition: describeWmoCode(currentCode),
				weatherCode: currentCode,
				humidity: json.current.relative_humidity_2m ?? 50,
				windSpeed: Math.round((json.current.wind_speed_10m ?? 5) * 10) / 10,
				fetchedAt: Date.now()
			},
			daily,
			attribution: "Weather data by Open-Meteo.com",
			attributionUrl: "https://open-meteo.com/",
			isFallback: false,
			latitude: lat,
			longitude: lng
		};
		weatherCache.set(cacheKey, {
			data: result,
			timestamp: Date.now()
		});
		return result;
	} catch (err) {
		console.warn("Failed to fetch weather from Open-Meteo:", err);
		return getFallbackWeather(lat, lng);
	}
}
var CURRENCY_CACHE_TTL_MS = 864e5;
var cachedRates = null;
var CURRENCY_SYMBOLS = {
	INR: "₹",
	USD: "$",
	EUR: "€",
	GBP: "£",
	JPY: "¥",
	AUD: "A$",
	CAD: "C$",
	CHF: "CHF ",
	SGD: "S$",
	NZD: "NZ$",
	HKD: "HK$",
	SEK: "kr ",
	NOK: "kr ",
	DKK: "kr ",
	PLN: "zł ",
	THB: "฿"
};
/**
* Fallback rates when Frankfurter API is unreachable
*/
function getFallbackRates() {
	return {
		base: "INR",
		date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
		rates: {
			USD: .012,
			EUR: .011,
			GBP: .0095,
			JPY: 1.78,
			AUD: .018,
			CAD: .016,
			SGD: .016,
			CHF: .0105,
			THB: .42
		},
		attribution: "European Central Bank reference rates via Frankfurter (Offline Cache)",
		attributionUrl: "https://frankfurter.dev/",
		lastUpdated: Date.now()
	};
}
/**
* Fetch live ECB exchange rates with INR as the base currency
*/
async function fetchExchangeRates() {
	if (cachedRates && Date.now() - cachedRates.timestamp < CURRENCY_CACHE_TTL_MS) return cachedRates.data;
	const endpoint = "https://api.frankfurter.dev/v1/latest?from=INR";
	try {
		const res = await fetch(endpoint, { headers: { Accept: "application/json" } });
		if (!res.ok) {
			console.warn(`Frankfurter API returned status ${res.status}. Using fallback rates.`);
			return getFallbackRates();
		}
		const json = await res.json();
		if (!json.rates || typeof json.rates !== "object") {
			console.warn("Frankfurter response missing rates object. Using fallback rates.");
			return getFallbackRates();
		}
		const result = {
			base: "INR",
			date: json.date || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
			rates: json.rates,
			attribution: "European Central Bank reference rates via Frankfurter.dev",
			attributionUrl: "https://frankfurter.dev/",
			lastUpdated: Date.now()
		};
		cachedRates = {
			data: result,
			timestamp: Date.now()
		};
		return result;
	} catch (err) {
		console.warn("Failed to fetch rates from Frankfurter API:", err);
		return getFallbackRates();
	}
}
/**
* Convert an amount from INR to a target currency.
* If target currency is unsupported, falls back to INR only.
*/
async function convertCurrency(amountInr, targetCurrency = "INR") {
	const norm = targetCurrency.toUpperCase().trim();
	if (!norm || norm === "INR") return {
		originalAmount: amountInr,
		convertedAmount: Math.round(amountInr),
		currency: "INR",
		rate: 1,
		symbol: "₹",
		formatted: `₹${Math.round(amountInr).toLocaleString("en-IN")}`,
		isFallback: false
	};
	const rate = (await fetchExchangeRates()).rates[norm];
	if (!rate || typeof rate !== "number") return {
		originalAmount: amountInr,
		convertedAmount: Math.round(amountInr),
		currency: "INR",
		rate: 1,
		symbol: "₹",
		formatted: `₹${Math.round(amountInr).toLocaleString("en-IN")}`,
		isFallback: true
	};
	const converted = amountInr * rate;
	const symbol = CURRENCY_SYMBOLS[norm] || `${norm} `;
	return {
		originalAmount: amountInr,
		convertedAmount: converted,
		currency: norm,
		rate,
		symbol,
		formatted: `${symbol}${norm === "JPY" || norm === "KRW" ? Math.round(converted).toLocaleString() : converted.toFixed(2)}`,
		isFallback: false
	};
}
/**
* Live Data Server Functions (Weather, Currency, Price Alerts)
* Uses free, key-less APIs (Open-Meteo & Frankfurter) with server caching and fallback.
*/
var HILL_STATION_COORDS = {
	Manali: {
		lat: 32.2432,
		lng: 77.1892
	},
	Shimla: {
		lat: 31.1048,
		lng: 77.1734
	},
	Munnar: {
		lat: 10.0889,
		lng: 77.0595
	},
	Ooty: {
		lat: 11.4102,
		lng: 76.695
	},
	Lonavala: {
		lat: 18.7557,
		lng: 73.4091
	},
	Mahabaleshwar: {
		lat: 17.9237,
		lng: 73.6586
	},
	Darjeeling: {
		lat: 27.041,
		lng: 88.2663
	},
	Kashmir: {
		lat: 34.0837,
		lng: 74.7973
	}
};
var weatherCoordsSchema = objectType({
	lat: numberType().min(-90).max(90),
	lng: numberType().min(-180).max(180)
});
var getWeatherForecastFn_createServerFn_handler = createServerRpc({
	id: "fa9ee77ffe251bc0916b19b43a9c3f21256ec53a0b10ba8fbd4caaa2b6e6a4bb",
	name: "getWeatherForecastFn",
	filename: "src/lib/server/live-data-actions.ts"
}, (opts) => getWeatherForecastFn.__executeServer(opts));
var getWeatherForecastFn = createServerFn({ method: "GET" }).validator((data) => weatherCoordsSchema.parse(data)).handler(getWeatherForecastFn_createServerFn_handler, async ({ data }) => {
	assertServerFnRateLimit("weather_forecast", 120);
	return await fetchWeatherForecast(data.lat, data.lng);
});
var destinationWeatherSchema = objectType({ destinationId: stringType() });
var getDestinationWeatherFn_createServerFn_handler = createServerRpc({
	id: "1611289d933a872694f6cc3586a35e88a16e3484dd9f454e5ccf940158ae325c",
	name: "getDestinationWeatherFn",
	filename: "src/lib/server/live-data-actions.ts"
}, (opts) => getDestinationWeatherFn.__executeServer(opts));
var getDestinationWeatherFn = createServerFn({ method: "GET" }).validator((data) => destinationWeatherSchema.parse(data)).handler(getDestinationWeatherFn_createServerFn_handler, async ({ data }) => {
	assertServerFnRateLimit("destination_weather", 120);
	const match = destinations.find((d) => d.id.toLowerCase() === data.destinationId.toLowerCase());
	return {
		weather: await fetchWeatherForecast(match ? match.lat : 28.6139, match ? match.lng : 77.209),
		destinationName: match ? match.name : data.destinationId,
		region: match ? match.region : "India",
		bestTimeToVisit: match ? match.bestTimeToVisit : "October to March for pleasant temperatures."
	};
});
var getHillStationsWeatherFn_createServerFn_handler = createServerRpc({
	id: "891abff19123b7aa63c508ff102b9a57c73553be0ef72bc7b7cabb5857f43e53",
	name: "getHillStationsWeatherFn",
	filename: "src/lib/server/live-data-actions.ts"
}, (opts) => getHillStationsWeatherFn.__executeServer(opts));
var getHillStationsWeatherFn = createServerFn({ method: "GET" }).handler(getHillStationsWeatherFn_createServerFn_handler, async () => {
	assertServerFnRateLimit("hills_weather", 60);
	const results = {};
	await Promise.all(Object.entries(HILL_STATION_COORDS).map(async ([name, coords]) => {
		try {
			const forecast = await fetchWeatherForecast(coords.lat, coords.lng);
			results[name] = {
				temp: `${Math.round(forecast.current.temperature)}°C`,
				condition: forecast.current.condition,
				isLive: !forecast.isFallback,
				fetchedAt: forecast.current.fetchedAt
			};
		} catch {
			results[name] = {
				temp: "14°C",
				condition: "Mainly Clear",
				isLive: false,
				fetchedAt: Date.now()
			};
		}
	}));
	return results;
});
var getExchangeRatesFn_createServerFn_handler = createServerRpc({
	id: "729f5909c7630bf2b529b2adf430d6301ff9f9998f40b9598d3127047c68c8c0",
	name: "getExchangeRatesFn",
	filename: "src/lib/server/live-data-actions.ts"
}, (opts) => getExchangeRatesFn.__executeServer(opts));
var getExchangeRatesFn = createServerFn({ method: "GET" }).handler(getExchangeRatesFn_createServerFn_handler, async () => {
	assertServerFnRateLimit("exchange_rates", 120);
	return await fetchExchangeRates();
});
var convertCurrencySchema = objectType({
	amount: numberType().nonnegative(),
	targetCurrency: stringType()
});
var convertCurrencyFn_createServerFn_handler = createServerRpc({
	id: "a63d62b82d638a10f773c2708e33d22a1a9c928d98fc72b421526b2cb60e3813",
	name: "convertCurrencyFn",
	filename: "src/lib/server/live-data-actions.ts"
}, (opts) => convertCurrencyFn.__executeServer(opts));
var convertCurrencyFn = createServerFn({ method: "POST" }).validator((data) => convertCurrencySchema.parse(data)).handler(convertCurrencyFn_createServerFn_handler, async ({ data }) => {
	assertServerFnRateLimit("currency_convert", 120);
	return await convertCurrency(data.amount, data.targetCurrency);
});
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
var createPriceAlertFn_createServerFn_handler = createServerRpc({
	id: "eb58c4fbb677bd08be1490b5682abeed1b34ea4944baad384273b8ae331faa93",
	name: "createPriceAlertFn",
	filename: "src/lib/server/live-data-actions.ts"
}, (opts) => createPriceAlertFn.__executeServer(opts));
var createPriceAlertFn = createServerFn({ method: "POST" }).validator((data) => createPriceAlertSchema.parse(data)).handler(createPriceAlertFn_createServerFn_handler, async ({ data }) => {
	assertServerFnRateLimit("create_price_alert", 30);
	const user = await getServerUser();
	const currentPrice = getFluctuatedPrice(data.basePrice, data.itemId);
	const alertRecord = {
		id: "alt_" + Math.random().toString(36).slice(2, 9),
		userId: user?.id || "guest",
		itemType: data.itemType,
		itemId: data.itemId,
		title: data.title,
		targetPrice: data.targetPrice,
		basePrice: data.basePrice,
		currentPrice,
		isActive: true,
		createdAt: Date.now()
	};
	if (user) try {
		const supabase = getSupabaseServerClient();
		if (supabase) {
			const { data: inserted, error } = await supabase.from("price_alerts").insert({
				user_id: user.id,
				item_type: data.itemType,
				item_id: data.itemId,
				title: data.title,
				target_price: data.targetPrice,
				base_price: data.basePrice,
				current_price: currentPrice,
				is_active: true
			}).select().single();
			if (!error && inserted) alertRecord.id = String(inserted.id);
		}
	} catch (err) {
		console.warn("Could not persist price alert to Supabase:", err);
	}
	return {
		success: true,
		alert: alertRecord
	};
});
var fetchPriceAlertsFn_createServerFn_handler = createServerRpc({
	id: "36625e91f7d1b41e49a2b4546661a36c9490162460909a2d80f0f02c73d005a8",
	name: "fetchPriceAlertsFn",
	filename: "src/lib/server/live-data-actions.ts"
}, (opts) => fetchPriceAlertsFn.__executeServer(opts));
var fetchPriceAlertsFn = createServerFn({ method: "GET" }).handler(fetchPriceAlertsFn_createServerFn_handler, async () => {
	assertServerFnRateLimit("fetch_price_alerts", 60);
	const user = await getServerUser();
	if (!user) return [];
	try {
		const supabase = getSupabaseServerClient();
		if (!supabase) return [];
		const { data, error } = await supabase.from("price_alerts").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
		if (error || !data) return [];
		return data.map((r) => ({
			id: String(r["id"]),
			userId: String(r["user_id"]),
			itemType: r["item_type"] || "flight",
			itemId: String(r["item_id"]),
			title: String(r["title"]),
			targetPrice: Number(r["target_price"]),
			basePrice: Number(r["base_price"]),
			currentPrice: getFluctuatedPrice(Number(r["base_price"]), String(r["item_id"])),
			isActive: Boolean(r["is_active"]),
			createdAt: new Date(String(r["created_at"])).getTime(),
			lastNotifiedAt: r["last_notified_at"] ? new Date(String(r["last_notified_at"])).getTime() : void 0
		}));
	} catch (err) {
		console.warn("Error fetching price alerts:", err);
		return [];
	}
});
var deletePriceAlertSchema = objectType({ alertId: stringType() });
var deletePriceAlertFn_createServerFn_handler = createServerRpc({
	id: "f87f0ad4ca5952361b1412fa33710536a8e636c3422d35378806366b92c8ae97",
	name: "deletePriceAlertFn",
	filename: "src/lib/server/live-data-actions.ts"
}, (opts) => deletePriceAlertFn.__executeServer(opts));
var deletePriceAlertFn = createServerFn({ method: "POST" }).validator((data) => deletePriceAlertSchema.parse(data)).handler(deletePriceAlertFn_createServerFn_handler, async ({ data }) => {
	assertServerFnRateLimit("delete_price_alert", 30);
	if (await getServerUser()) try {
		const supabase = getSupabaseServerClient();
		if (supabase) await supabase.from("price_alerts").delete().eq("id", data.alertId);
	} catch (err) {
		console.warn("Error deleting price alert from Supabase:", err);
	}
	return { success: true };
});
var getDemoFluctuationInfoFn_createServerFn_handler = createServerRpc({
	id: "8196e04d7c275b179132316dba925dd5b7c9c5c90288b55c528f1e17a29ad1b6",
	name: "getDemoFluctuationInfoFn",
	filename: "src/lib/server/live-data-actions.ts"
}, (opts) => getDemoFluctuationInfoFn.__executeServer(opts));
var getDemoFluctuationInfoFn = createServerFn({ method: "GET" }).validator((data) => objectType({ itemId: stringType() }).parse(data)).handler(getDemoFluctuationInfoFn_createServerFn_handler, async ({ data }) => {
	assertServerFnRateLimit("fluctuation_info", 120);
	const percent = getDailyFluctuationPercent(data.itemId);
	return {
		itemId: data.itemId,
		fluctuationPercent: percent,
		label: "Demo pricing",
		explanation: `Deterministic daily variation (${percent >= 0 ? `+${percent}` : percent}%) based on catalog simulation.`
	};
});
//#endregion
export { convertCurrencyFn_createServerFn_handler, createPriceAlertFn_createServerFn_handler, deletePriceAlertFn_createServerFn_handler, fetchPriceAlertsFn_createServerFn_handler, getDemoFluctuationInfoFn_createServerFn_handler, getDestinationWeatherFn_createServerFn_handler, getExchangeRatesFn_createServerFn_handler, getHillStationsWeatherFn_createServerFn_handler, getWeatherForecastFn_createServerFn_handler };
