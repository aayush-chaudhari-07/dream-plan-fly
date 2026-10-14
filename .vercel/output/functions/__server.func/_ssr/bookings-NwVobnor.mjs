import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as cn, t as Button } from "./button-BSij73O2.mjs";
import { c as inr } from "./travel-Co-Z1Moz.mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as createPriceAlertFn, u as smartTrip } from "./smarttrip-store-B4h7bmlO.mjs";
import { Gt as Bus, P as RotateCcw, Q as Luggage, Qt as BellRing, V as Plane, Vt as Car, at as Leaf, tn as ArrowRight, ut as Hotel, w as SlidersHorizontal, y as Star } from "../_libs/lucide-react.mjs";
import { d as Input, f as Navbar, u as Footer } from "./Navbar-G5xs2vbg.mjs";
import { t as SupportDock } from "./SupportDock-BQEj3o76.mjs";
import { t as PageHeader } from "./PageHeader-CiBUEnzv.mjs";
import { i as INVENTORY_TRANSIT, n as INVENTORY_RENTALS, r as INVENTORY_STAYS, t as INVENTORY_PACKAGES } from "./inventory-data-CXc7T27W.mjs";
import { t as Route } from "./bookings-4Fhqrkk9.mjs";
import { n as getAirportByIata, t as AirportCombobox } from "./AirportCombobox-DMbRA9O5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bookings-NwVobnor.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function createPrng(seedString) {
	let h = 2166136261;
	for (let i = 0; i < seedString.length; i++) {
		h ^= seedString.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	let a = h >>> 0;
	return function next() {
		let t = a += 1831565813;
		t = Math.imul(t ^ t >>> 15, t | 1);
		t ^= t + Math.imul(t ^ t >>> 7, t | 61);
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
var AIRLINES = [
	{
		name: "IndiGo",
		code: "6E",
		fleet: ["Airbus A320neo", "Airbus A321neo"],
		multiplier: 1
	},
	{
		name: "Air India",
		code: "AI",
		fleet: ["Airbus A321neo", "Boeing 787-9 Dreamliner"],
		multiplier: 1.15
	},
	{
		name: "Vistara",
		code: "UK",
		fleet: ["Airbus A321neo", "Boeing 787-9 Dreamliner"],
		multiplier: 1.25
	},
	{
		name: "Akasa Air",
		code: "QP",
		fleet: ["Boeing 737 MAX 8"],
		multiplier: .95
	},
	{
		name: "SpiceJet",
		code: "SG",
		fleet: ["Boeing 737-800", "Bombardier Q400"],
		multiplier: .9
	},
	{
		name: "Air India Express",
		code: "IX",
		fleet: ["Boeing 737 MAX 8"],
		multiplier: .92
	}
];
function deg2rad(deg) {
	return deg * (Math.PI / 180);
}
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
	const R = 6371;
	const dLat = deg2rad(lat2 - lat1);
	const dLon = deg2rad(lon2 - lon1);
	const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return Math.round(R * c);
}
function formatMinutes(mins) {
	return `${Math.floor(mins / 60)}h ${(mins % 60).toString().padStart(2, "0")}m`;
}
function formatTime(minutesFromMidnight) {
	const total = minutesFromMidnight % 1440;
	const h = Math.floor(total / 60);
	const m = total % 60;
	return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}
/**
* Generate 6 to 10 plausible flight options per day for any origin and destination pair.
* Uses deterministic seeded randomness: the same origin, destination, date, and cabin class
* ALWAYS returns the identical array of flights.
*/
function generateFlights(params) {
	const originIata = params.originIata.toUpperCase().trim();
	const destinationIata = params.destinationIata.toUpperCase().trim();
	const date = params.date || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const travelers = Math.max(1, params.travelers || 1);
	const cabinClass = params.cabinClass || "economy";
	const originAirport = getAirportByIata(originIata);
	const destAirport = getAirportByIata(destinationIata);
	const originCity = originAirport?.city || originIata;
	const destCity = destAirport?.city || destinationIata;
	let distanceKm = 1200;
	if (originAirport && destAirport) distanceKm = Math.max(350, calculateDistanceKm(originAirport.lat, originAirport.lng, destAirport.lat, destAirport.lng));
	const baseFlightDurationMinutes = Math.round(distanceKm / 750 * 60 + 35);
	const prng = createPrng(`FLIGHTS::${originIata}::${destinationIata}::${date}::${cabinClass}`);
	const flightCount = Math.floor(prng() * 5) + 6;
	const options = [];
	const slotMinutes = [
		360 + Math.floor(prng() * 45),
		450 + Math.floor(prng() * 60),
		600 + Math.floor(prng() * 60),
		780 + Math.floor(prng() * 60),
		930 + Math.floor(prng() * 60),
		1080 + Math.floor(prng() * 60),
		1200 + Math.floor(prng() * 60),
		1320 + Math.floor(prng() * 45),
		510 + Math.floor(prng() * 45),
		840 + Math.floor(prng() * 45)
	];
	const classMultiplier = cabinClass === "first" ? 4.5 : cabinClass === "business" ? 3.2 : cabinClass === "premium_economy" ? 1.6 : 1;
	for (let i = 0; i < flightCount; i++) {
		const airline = AIRLINES[Math.floor(prng() * AIRLINES.length)];
		const fleetIndex = Math.floor(prng() * airline.fleet.length);
		const aircraft = airline.fleet[fleetIndex];
		const flightNum = `${airline.code}-${Math.floor(prng() * 900) + 100}`;
		const isOneStop = prng() > .65;
		let stops = "Non-stop";
		let stopCount = 0;
		let extraDuration = 0;
		if (isOneStop) {
			stopCount = 1;
			const hubs = [
				"1 Stop (BOM)",
				"1 Stop (DEL)",
				"1 Stop (BLR)"
			];
			stops = hubs[Math.floor(prng() * hubs.length)];
			extraDuration = 90 + Math.floor(prng() * 75);
		}
		const totalDurationMinutes = baseFlightDurationMinutes + extraDuration;
		const depMinute = slotMinutes[i % slotMinutes.length];
		const arrMinute = depMinute + totalDurationMinutes;
		const ratePerKm = 3.6 + prng() * 1.6;
		const rawFare = Math.round((distanceKm * ratePerKm + 1200) * airline.multiplier * classMultiplier);
		const baseFarePerPassenger = Math.round(rawFare / 50) * 50;
		const taxesAndFeesPerPassenger = Math.round(baseFarePerPassenger * .12);
		const pricePerPassenger = baseFarePerPassenger + taxesAndFeesPerPassenger;
		const totalBaseFare = baseFarePerPassenger * travelers;
		const totalTaxes = taxesAndFeesPerPassenger * travelers;
		const totalPrice = pricePerPassenger * travelers;
		const seatsLeft = Math.floor(prng() * 12) + 2;
		const carbonKg = Math.round(distanceKm * .115 * (isOneStop ? 1.3 : 1));
		options.push({
			id: `fl-${originIata}-${destinationIata}-${date}-${i + 1}`,
			airline: airline.name,
			airlineCode: airline.code,
			flightNumber: flightNum,
			originIata,
			destinationIata,
			originCity,
			destinationCity: destCity,
			date,
			departureTime: formatTime(depMinute),
			arrivalTime: formatTime(arrMinute),
			durationMinutes: totalDurationMinutes,
			durationFormatted: formatMinutes(totalDurationMinutes),
			stops,
			stopCount,
			aircraft,
			cabinClass,
			price: totalPrice,
			baseFare: totalBaseFare,
			taxesAndFees: totalTaxes,
			seatsLeft,
			baggage: {
				cabin: cabinClass === "business" || cabinClass === "first" ? "12 kg (2 pcs)" : "7 kg (1 pc)",
				checkIn: cabinClass === "business" || cabinClass === "first" ? "30 kg (2 pcs)" : "15 kg (1 pc)"
			},
			carbonKg,
			isRefundable: cabinClass !== "economy" || prng() > .4
		});
	}
	return options.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
}
var tabs = [
	{
		key: "flights",
		label: "Flights",
		icon: Plane
	},
	{
		key: "stay",
		label: "Hotels & Stays",
		icon: Hotel
	},
	{
		key: "rental",
		label: "Car & Bike Rentals",
		icon: Car
	},
	{
		key: "rail",
		label: "Train & Bus",
		icon: Bus
	},
	{
		key: "packages",
		label: "Holiday Packages",
		icon: Luggage
	}
];
function BookingsPage() {
	const search = Route.useSearch();
	const navigate = useNavigate();
	const tab = search.tab || "flights";
	const [activeTab, setActiveTab] = (0, import_react.useState)(tab);
	const [originIata, setOriginIata] = (0, import_react.useState)(search.origin || "DEL");
	const [destinationIata, setDestinationIata] = (0, import_react.useState)(search.destination || "GOI");
	const [departDate, setDepartDate] = (0, import_react.useState)(search.date || "2026-12-15");
	const [travelers, setTravelers] = (0, import_react.useState)(search.travelers || 2);
	const [cabinClass, setCabinClass] = (0, import_react.useState)(search.cabinClass || "economy");
	const [maxPrice, setMaxPrice] = (0, import_react.useState)(5e4);
	const [stopsFilter, setStopsFilter] = (0, import_react.useState)("all");
	const [timeFilter, setTimeFilter] = (0, import_react.useState)("all");
	const [selectedAirline, setSelectedAirline] = (0, import_react.useState)("all");
	const [minRating, setMinRating] = (0, import_react.useState)(0);
	const [sortBy, setSortBy] = (0, import_react.useState)("departure");
	const originAirport = getAirportByIata(originIata);
	const destAirport = getAirportByIata(destinationIata);
	const [priceAlertModal, setPriceAlertModal] = (0, import_react.useState)({
		isOpen: false,
		itemType: "flight",
		itemId: "",
		title: "",
		basePrice: 0,
		targetPrice: 0
	});
	const handleOpenPriceAlertModal = (itemType, itemId, title, basePrice) => {
		setPriceAlertModal({
			isOpen: true,
			itemType,
			itemId,
			title,
			basePrice,
			targetPrice: Math.round(basePrice * .9)
		});
	};
	const handleSavePriceAlert = async () => {
		try {
			smartTrip.addPriceAlert({
				itemType: priceAlertModal.itemType,
				itemId: priceAlertModal.itemId,
				title: priceAlertModal.title,
				targetPrice: priceAlertModal.targetPrice,
				basePrice: priceAlertModal.basePrice
			});
			await createPriceAlertFn({ data: {
				itemType: priceAlertModal.itemType,
				itemId: priceAlertModal.itemId,
				title: priceAlertModal.title,
				targetPrice: priceAlertModal.targetPrice,
				basePrice: priceAlertModal.basePrice
			} });
			setPriceAlertModal((prev) => ({
				...prev,
				isOpen: false
			}));
			toast.success("Price Alert Created!", { description: `We will notify you when ${priceAlertModal.title} drops below ₹${priceAlertModal.targetPrice.toLocaleString("en-IN")}.` });
		} catch {
			toast.error("Failed to activate price alert.");
		}
	};
	const generatedFlights = (0, import_react.useMemo)(() => {
		return generateFlights({
			originIata,
			destinationIata,
			date: departDate,
			travelers,
			cabinClass
		});
	}, [
		originIata,
		destinationIata,
		departDate,
		travelers,
		cabinClass
	]);
	const filteredFlights = (0, import_react.useMemo)(() => {
		let result = [...generatedFlights];
		result = result.filter((f) => f.price <= maxPrice);
		if (stopsFilter === "non-stop") result = result.filter((f) => f.stopCount === 0);
		else if (stopsFilter === "1-stop") result = result.filter((f) => f.stopCount === 1);
		if (timeFilter === "morning") result = result.filter((f) => f.departureTime >= "05:00" && f.departureTime < "12:00");
		else if (timeFilter === "afternoon") result = result.filter((f) => f.departureTime >= "12:00" && f.departureTime < "18:00");
		else if (timeFilter === "evening") result = result.filter((f) => f.departureTime >= "18:00");
		if (selectedAirline !== "all") result = result.filter((f) => f.airline === selectedAirline);
		if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
		else if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
		else if (sortBy === "duration") result.sort((a, b) => a.durationMinutes - b.durationMinutes);
		else if (sortBy === "departure") result.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
		return result;
	}, [
		generatedFlights,
		maxPrice,
		stopsFilter,
		timeFilter,
		selectedAirline,
		sortBy
	]);
	const filteredStays = (0, import_react.useMemo)(() => {
		const list = INVENTORY_STAYS.filter((s) => s.price <= maxPrice && s.rating >= minRating);
		if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
		if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
		if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);
		return list;
	}, [
		maxPrice,
		minRating,
		sortBy
	]);
	const filteredRentals = (0, import_react.useMemo)(() => {
		const list = INVENTORY_RENTALS.filter((r) => r.price <= maxPrice && r.rating >= minRating);
		if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
		if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
		return list;
	}, [
		maxPrice,
		minRating,
		sortBy
	]);
	const filteredTransit = (0, import_react.useMemo)(() => {
		return INVENTORY_TRANSIT.filter((t) => t.classes[0]?.price && t.classes[0].price <= maxPrice);
	}, [maxPrice]);
	const filteredPackages = (0, import_react.useMemo)(() => {
		const list = INVENTORY_PACKAGES.filter((p) => p.price <= maxPrice && p.rating >= minRating);
		if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
		if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
		return list;
	}, [
		maxPrice,
		minRating,
		sortBy
	]);
	const handleTabChange = (newTab) => {
		setActiveTab(newTab);
		navigate({
			to: "/bookings",
			search: {
				...search,
				tab: newTab
			}
		});
	};
	const resetFilters = () => {
		setMaxPrice(5e4);
		setStopsFilter("all");
		setTimeFilter("all");
		setSelectedAirline("all");
		setMinRating(0);
		setSortBy("departure");
	};
	const handleBookFlight = (flight) => {
		navigate({
			to: "/checkout",
			search: {
				kind: "flight",
				title: `${flight.airline} ${flight.flightNumber} · ${flight.originCity} to ${flight.destinationCity}`,
				subtitle: `${flight.date} · ${flight.departureTime} - ${flight.arrivalTime} (${flight.durationFormatted})`,
				price: flight.price,
				origin: flight.originIata,
				destination: flight.destinationIata,
				date: flight.date,
				travelers,
				cabinClass,
				inventoryId: flight.id
			}
		});
	};
	const handleBookStay = (stay) => {
		navigate({
			to: "/checkout",
			search: {
				kind: "stay",
				title: `${stay.name} · ${stay.destination}`,
				subtitle: `${stay.propertyType} · ${stay.location}`,
				price: stay.price,
				destination: stay.destination,
				travelers,
				cabinClass: "economy",
				inventoryId: stay.id
			}
		});
	};
	const handleBookRental = (rental) => {
		navigate({
			to: "/checkout",
			search: {
				kind: "rental",
				title: `${rental.name} · ${rental.destination}`,
				subtitle: `${rental.category} · ${rental.seats} Seats · ${rental.transmission}`,
				price: rental.price,
				destination: rental.destination,
				travelers: 1,
				cabinClass: "economy",
				inventoryId: rental.id
			}
		});
	};
	const handleBookTransit = (t) => {
		const fare = t.classes[0]?.price || 1695;
		navigate({
			to: "/checkout",
			search: {
				kind: "rail",
				title: `${t.operator} · ${t.serviceName}`,
				subtitle: `${t.origin} → ${t.destination} · ${t.departureTime} - ${t.arrivalTime}`,
				price: fare * travelers,
				travelers,
				cabinClass: "economy",
				inventoryId: t.id
			}
		});
	};
	const handleBookPackage = (pkg) => {
		navigate({
			to: "/checkout",
			search: {
				kind: "package",
				title: `${pkg.name}`,
				subtitle: `${pkg.durationDays} Days, ${pkg.durationNights} Nights · Curated Tour`,
				price: pkg.price,
				destination: pkg.destination,
				travelers,
				cabinClass: "economy",
				inventoryId: pkg.id
			}
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Book Everything",
			subtitle: "Flights, stays, rentals, transit, and curated packages — simulated in a production-grade free demo environment."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "container-page -mt-8 pb-16",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card p-5 sm:p-7 shadow-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2 overflow-x-auto pb-2",
					children: tabs.map(({ key, label, icon: Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => handleTabChange(key),
						className: cn("flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all", activeTab === key ? "bg-gradient-brand text-primary-foreground shadow-soft" : "bg-secondary text-secondary-foreground hover:bg-accent"),
						"data-testid": `bookings-tab-${key}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), label]
					}, key))
				}), activeTab === "flights" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-3 items-end",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AirportCombobox, {
							label: "From (Origin)",
							value: originIata,
							onChange: (a) => setOriginIata(a.iata),
							testId: "search-origin-input"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AirportCombobox, {
							label: "To (Destination)",
							value: destinationIata,
							onChange: (a) => setDestinationIata(a.iata),
							testId: "search-destination-input"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "rounded-2xl border border-border bg-surface px-4 py-2.5 transition-colors focus-within:border-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-semibold tracking-wide text-muted-foreground uppercase block",
								children: "Departure Date"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: departDate,
								onChange: (e) => setDepartDate(e.target.value),
								className: "h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 text-sm font-semibold"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "rounded-2xl border border-border bg-surface px-3 py-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-semibold tracking-wide text-muted-foreground uppercase block",
									children: "Travelers"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 1,
									max: 9,
									value: travelers,
									onChange: (e) => setTravelers(Number(e.target.value) || 1),
									className: "h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 text-sm font-semibold"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "rounded-2xl border border-border bg-surface px-3 py-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-semibold tracking-wide text-muted-foreground uppercase block",
									children: "Class"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: cabinClass,
									onChange: (e) => setCabinClass(e.target.value),
									className: "h-8 w-full border-0 bg-transparent text-xs font-semibold focus:outline-none capitalize",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "economy",
											children: "Economy"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "premium_economy",
											children: "Premium"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "business",
											children: "Business"
										})
									]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between col-span-full md:col-span-1 pt-2 md:pt-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted-foreground font-semibold",
								children: [filteredFlights.length, " flights found"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-emerald-500/10 text-emerald-500 px-2.5 py-0.5 text-xs font-bold",
								children: "Live Programmatic Seed"
							})]
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "space-y-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card p-5 sticky top-24 space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-b border-border pb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 font-display font-bold text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "size-4 text-primary" }), " Filter Results"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: resetFilters,
									className: "flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3" }), " Reset"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
									children: "Sort By"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: sortBy,
									onChange: (e) => setSortBy(e.target.value),
									className: "w-full rounded-xl border border-border bg-surface p-2 text-xs font-semibold focus:outline-none",
									"data-testid": "sort-dropdown",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "departure",
											children: "Departure Time (Earliest)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "price-asc",
											children: "Price: Low to High"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "price-desc",
											children: "Price: High to Low"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "duration",
											children: "Flight Duration (Shortest)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "rating",
											children: "Rating (Highest)"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold uppercase tracking-wider text-muted-foreground",
										children: "Max Price"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-primary",
										children: inr(maxPrice)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: 1e3,
									max: 5e4,
									step: 500,
									value: maxPrice,
									onChange: (e) => setMaxPrice(Number(e.target.value)),
									className: "w-full accent-primary cursor-pointer",
									"data-testid": "price-slider"
								})]
							}),
							activeTab === "flights" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
									children: "Stops"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-1.5",
									children: [
										{
											key: "all",
											label: "All Flights"
										},
										{
											key: "non-stop",
											label: "Non-Stop Only"
										},
										{
											key: "1-stop",
											label: "1 Stop"
										}
									].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setStopsFilter(s.key),
										className: cn("flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors", stopsFilter === s.key ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:bg-secondary"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.label })
									}, s.key))
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
									children: "Departure Time"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-2 gap-1.5 text-xs",
									children: [
										{
											key: "all",
											label: "Anytime"
										},
										{
											key: "morning",
											label: "06:00 - 12:00"
										},
										{
											key: "afternoon",
											label: "12:00 - 18:00"
										},
										{
											key: "evening",
											label: "18:00+"
										}
									].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setTimeFilter(t.key),
										className: cn("rounded-xl border p-2 text-center transition-colors", timeFilter === t.key ? "border-primary bg-primary/10 text-primary font-bold" : "border-border text-muted-foreground hover:bg-secondary"),
										children: t.label
									}, t.key))
								})]
							})] }),
							(activeTab === "stay" || activeTab === "packages") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
									children: "Guest Rating"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-1.5",
									children: [
										{
											rating: 0,
											label: "All Ratings"
										},
										{
											rating: 4.5,
											label: "4.5 & Above (Excellent)"
										},
										{
											rating: 4.8,
											label: "4.8 & Above (Exceptional)"
										}
									].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setMinRating(r.rating),
										className: cn("flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors", minRating === r.rating ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:bg-secondary"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r.label })
									}, r.rating))
								})]
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "lg:col-span-3 space-y-4",
					children: [
						activeTab === "flights" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: filteredFlights.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "surface-card py-16 text-center space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plane, { className: "mx-auto size-10 text-muted-foreground/40" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display font-bold text-lg",
									children: "No Flights Match Your Filters"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground max-w-sm mx-auto",
									children: "Try raising the maximum price limit or resetting the stops and departure time filters."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "sm",
									onClick: resetFilters,
									className: "rounded-full",
									children: "Reset Filters"
								})
							]
						}) : filteredFlights.map((flight, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "surface-card p-5 sm:p-6 transition-all hover:border-primary/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-5",
							"data-testid": index === 0 ? "first-flight-card" : "flight-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded-lg bg-secondary px-2.5 py-1 text-xs font-mono font-bold text-foreground",
												children: flight.flightNumber
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-display font-bold text-base text-foreground",
												children: flight.airline
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs text-muted-foreground",
												children: ["· ", flight.aircraft]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-6",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-2xl font-black text-foreground",
												children: flight.departureTime
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-muted-foreground font-semibold",
												children: [
													flight.originIata,
													" (",
													originAirport?.city || flight.originCity,
													")"
												]
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-col items-center px-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[11px] font-medium text-muted-foreground",
														children: flight.durationFormatted
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "relative my-1 flex items-center w-24 sm:w-32",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-0.5 w-full bg-border" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plane, { className: "size-3 text-primary absolute left-1/2 -translate-x-1/2 -rotate-90" })]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: `text-[10px] font-bold ${flight.stopCount === 0 ? "text-emerald-500" : "text-amber-500"}`,
														children: flight.stops
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-2xl font-black text-foreground",
												children: flight.arrivalTime
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-muted-foreground font-semibold",
												children: [
													flight.destinationIata,
													" (",
													destAirport?.city || flight.destinationCity,
													")"
												]
											})] })
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground pt-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Luggage, { className: "size-3" }),
													" ",
													flight.baggage.cabin,
													" cabin ·",
													" ",
													flight.baggage.checkIn,
													" check-in"
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-1 text-emerald-600 dark:text-emerald-400",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, { className: "size-3" }),
													" ",
													flight.carbonKg,
													" kg CO₂"
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-amber-600 dark:text-amber-400 font-semibold",
												children: [
													"Only ",
													flight.seatsLeft,
													" seats left"
												]
											})
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-left md:text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 justify-start md:justify-end",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-display text-2xl font-black text-primary",
											children: inr(flight.price)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-semibold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20",
											children: "Demo pricing"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[10px] text-muted-foreground",
										children: [
											"Total for ",
											travelers,
											" traveler(s)"
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 mt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										variant: "outline",
										size: "sm",
										className: "rounded-full h-8 text-xs gap-1",
										onClick: () => handleOpenPriceAlertModal("flight", `${flight.originIata}-${flight.destinationIata}`, `Flight: ${flight.originIata} → ${flight.destinationIata}`, flight.price),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, { className: "size-3 text-primary" }), " Watch"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										variant: "hero",
										size: "sm",
										className: "rounded-full px-5 gap-1.5 shadow-soft",
										onClick: () => handleBookFlight(flight),
										"data-testid": "book-flight-btn",
										children: ["Book Flight ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3.5" })]
									})]
								})]
							})]
						}, flight.id)) }),
						activeTab === "stay" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-5",
							children: filteredStays.map((stay) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "surface-card overflow-hidden flex flex-col justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative h-48",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: stay.image,
										alt: stay.name,
										loading: "lazy",
										decoding: "async",
										className: "size-full object-cover"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "absolute top-3 right-3 flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 text-xs font-semibold backdrop-blur-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3 fill-sunset text-sunset" }),
											" ",
											stay.rating,
											" (",
											stay.reviewsCount,
											")"
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase",
											children: stay.propertyType
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-display font-bold text-base",
											children: stay.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: stay.location
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex flex-wrap gap-1.5 pt-1",
											children: stay.amenities.slice(0, 4).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded-md bg-secondary/60 px-2 py-0.5 text-[10px] text-muted-foreground",
												children: a
											}, a))
										})
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 pt-0 border-t border-border/60 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-display text-lg font-bold text-primary",
											children: inr(stay.price)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-semibold text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded-full border border-amber-500/20",
											children: "Demo pricing"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground",
										children: " / night"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "button",
											variant: "outline",
											size: "sm",
											className: "rounded-full h-8 px-2.5 text-xs gap-1",
											onClick: () => handleOpenPriceAlertModal("stay", stay.id, `${stay.name} (${stay.location})`, stay.price),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, { className: "size-3 text-primary" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "button",
											variant: "hero",
											size: "sm",
											className: "rounded-full",
											onClick: () => handleBookStay(stay),
											children: "Reserve"
										})]
									})]
								})]
							}, stay.id))
						}),
						activeTab === "rental" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-5",
							children: filteredRentals.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "surface-card overflow-hidden p-5 flex flex-col justify-between space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: r.image,
										alt: r.name,
										loading: "lazy",
										decoding: "async",
										className: "h-40 w-full object-cover rounded-2xl mb-3"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-display font-bold text-base",
											children: r.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold",
											children: r.category
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground mt-1",
										children: r.pickupLocation
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground font-medium mt-1",
										children: [
											r.seats,
											" Seats · ",
											r.transmission,
											" · ",
											r.fuel
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 text-[11px] text-muted-foreground",
										children: r.included.join(" · ")
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border-t border-border/60 pt-3 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display text-lg font-bold text-primary",
										children: inr(r.price)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground",
										children: " / day"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "hero",
										size: "sm",
										className: "rounded-full",
										onClick: () => handleBookRental(r),
										children: "Book Rental"
									})]
								})]
							}, r.id))
						}),
						activeTab === "rail" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-4",
							children: filteredTransit.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "surface-card p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "rounded-lg bg-secondary px-2 py-0.5 text-xs font-mono font-bold",
													children: t.numberOrCode
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
													className: "font-display font-bold text-base",
													children: t.serviceName
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-xs text-muted-foreground",
													children: [
														"(",
														t.operator,
														")"
													]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-sm text-foreground font-semibold",
											children: [
												t.origin,
												" → ",
												t.destination,
												" · ",
												t.duration
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground",
											children: [
												"Departs: ",
												t.departureTime,
												" · Arrives: ",
												t.arrivalTime,
												" · Frequency:",
												" ",
												t.frequency
											]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display text-xl font-bold text-primary",
										children: inr(t.classes[0]?.price || 1695)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground block text-right",
										children: t.classes[0]?.className || "AC Chair Car"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "hero",
										size: "sm",
										className: "rounded-full",
										onClick: () => handleBookTransit(t),
										children: "Book Transit"
									})]
								})]
							}, t.id))
						}),
						activeTab === "packages" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-5",
							children: filteredPackages.map((pkg) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "surface-card overflow-hidden flex flex-col justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative h-48",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: pkg.image,
										alt: pkg.name,
										loading: "lazy",
										decoding: "async",
										className: "size-full object-cover"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "absolute top-3 right-3 flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 text-xs font-semibold backdrop-blur-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3 fill-sunset text-sunset" }),
											" ",
											pkg.rating
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase",
											children: [
												pkg.durationDays,
												"D / ",
												pkg.durationNights,
												"N Tour"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-display font-bold text-base leading-tight",
											children: pkg.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: pkg.highlights.join(" · ")
										})
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 pt-0 border-t border-border/60 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display text-lg font-bold text-primary",
										children: inr(pkg.price)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground",
										children: " / person"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "hero",
										size: "sm",
										className: "rounded-full",
										onClick: () => handleBookPackage(pkg),
										children: "Book Package"
									})]
								})]
							}, pkg.id))
						})
					]
				})]
			})]
		}),
		priceAlertModal.isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-elevated space-y-4 animate-in fade-in zoom-in-95 duration-200",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, { className: "size-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "font-display font-bold text-base text-foreground",
							children: "Set Price Alert"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground truncate max-w-[200px]",
							children: priceAlertModal.title
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold text-foreground",
								children: "Target Price (INR)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								value: priceAlertModal.targetPrice,
								onChange: (e) => setPriceAlertModal((prev) => ({
									...prev,
									targetPrice: Number(e.target.value) || 0
								})),
								className: "rounded-xl h-10 text-sm font-semibold"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-muted-foreground",
								children: [
									"Base price: ₹",
									priceAlertModal.basePrice.toLocaleString("en-IN"),
									". We will notify you when catalog fares fluctuate below your target."
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-amber-500/10 border border-amber-500/20 p-2.5 text-[11px] text-amber-700 dark:text-amber-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold",
							children: "Demo pricing:"
						}), " Simulated deterministic fluctuations run daily via GitHub Actions cron."]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-2 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => setPriceAlertModal((prev) => ({
								...prev,
								isOpen: false
							})),
							className: "rounded-full",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "hero",
							size: "sm",
							onClick: handleSavePriceAlert,
							className: "rounded-full",
							children: "Activate Alert"
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
export { BookingsPage as component };
