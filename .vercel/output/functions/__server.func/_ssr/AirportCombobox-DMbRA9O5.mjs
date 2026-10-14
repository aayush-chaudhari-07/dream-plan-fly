import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as cn } from "./button-BSij73O2.mjs";
import { M as Search, V as Plane, zt as Check } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AirportCombobox-DMbRA9O5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Filtered OpenFlights dataset containing major Indian airports and primary connected international hubs.
* Source: OpenFlights Airport Database (Open Database License).
*/
var AIRPORTS = [
	{
		iata: "DEL",
		icao: "VIDP",
		name: "Indira Gandhi International Airport",
		city: "New Delhi",
		state: "Delhi",
		country: "India",
		lat: 28.5562,
		lng: 77.1,
		timezone: "Asia/Kolkata"
	},
	{
		iata: "BOM",
		icao: "VABB",
		name: "Chhatrapati Shivaji Maharaj International Airport",
		city: "Mumbai",
		state: "Maharashtra",
		country: "India",
		lat: 19.0896,
		lng: 72.8656,
		timezone: "Asia/Kolkata"
	},
	{
		iata: "BLR",
		icao: "VOBL",
		name: "Kempegowda International Airport",
		city: "Bengaluru",
		state: "Karnataka",
		country: "India",
		lat: 13.1986,
		lng: 77.7066,
		timezone: "Asia/Kolkata"
	},
	{
		iata: "HYD",
		icao: "VOHS",
		name: "Rajiv Gandhi International Airport",
		city: "Hyderabad",
		state: "Telangana",
		country: "India",
		lat: 17.2403,
		lng: 78.4294,
		timezone: "Asia/Kolkata"
	},
	{
		iata: "MAA",
		icao: "VOMM",
		name: "Chennai International Airport",
		city: "Chennai",
		state: "Tamil Nadu",
		country: "India",
		lat: 12.9941,
		lng: 80.1709,
		timezone: "Asia/Kolkata"
	},
	{
		iata: "CCU",
		icao: "VECC",
		name: "Netaji Subhash Chandra Bose International Airport",
		city: "Kolkata",
		state: "West Bengal",
		country: "India",
		lat: 22.6547,
		lng: 88.4467,
		timezone: "Asia/Kolkata"
	},
	{
		iata: "GOI",
		icao: "VAGO",
		name: "Dabolim International Airport",
		city: "Goa (Dabolim)",
		state: "Goa",
		country: "India",
		lat: 15.3808,
		lng: 73.8314,
		timezone: "Asia/Kolkata"
	},
	{
		iata: "GOX",
		icao: "VOGA",
		name: "Manohar International Airport Mopa",
		city: "North Goa (Mopa)",
		state: "Goa",
		country: "India",
		lat: 15.7672,
		lng: 73.8686,
		timezone: "Asia/Kolkata"
	},
	{
		iata: "SXR",
		icao: "VISR",
		name: "Sheikh ul-Alam International Airport",
		city: "Srinagar",
		state: "Jammu and Kashmir",
		country: "India",
		lat: 33.9871,
		lng: 74.7742,
		timezone: "Asia/Kolkata"
	},
	{
		iata: "JAI",
		icao: "VIJP",
		name: "Jaipur International Airport",
		city: "Jaipur",
		state: "Rajasthan",
		country: "India",
		lat: 26.8242,
		lng: 75.8122,
		timezone: "Asia/Kolkata"
	},
	{
		iata: "COK",
		icao: "VOCI",
		name: "Cochin International Airport",
		city: "Kochi",
		state: "Kerala",
		country: "India",
		lat: 10.1556,
		lng: 76.3917,
		timezone: "Asia/Kolkata"
	},
	{
		iata: "IXC",
		icao: "VICG",
		name: "Shaheed Bhagat Singh International Airport",
		city: "Chandigarh (Gate to Manali/Shimla)",
		state: "Punjab/Haryana",
		country: "India",
		lat: 30.6735,
		lng: 76.7885,
		timezone: "Asia/Kolkata"
	},
	{
		iata: "KUU",
		icao: "VIBR",
		name: "Kullu-Manali Airport (Bhuntar)",
		city: "Kullu Manali",
		state: "Himachal Pradesh",
		country: "India",
		lat: 31.8767,
		lng: 77.1544,
		timezone: "Asia/Kolkata"
	},
	{
		iata: "DED",
		icao: "VIDN",
		name: "Jolly Grant Airport",
		city: "Dehradun (Rishikesh)",
		state: "Uttarakhand",
		country: "India",
		lat: 30.1897,
		lng: 78.1803,
		timezone: "Asia/Kolkata"
	},
	{
		iata: "IXL",
		icao: "VILH",
		name: "Kushok Bakula Rimpochee Airport",
		city: "Leh Ladakh",
		state: "Ladakh",
		country: "India",
		lat: 34.1359,
		lng: 77.5465,
		timezone: "Asia/Kolkata"
	},
	{
		iata: "PNQ",
		icao: "VAPO",
		name: "Pune Airport",
		city: "Pune (Lonavala Hub)",
		state: "Maharashtra",
		country: "India",
		lat: 18.5822,
		lng: 73.9197,
		timezone: "Asia/Kolkata"
	},
	{
		iata: "AMD",
		icao: "VAAH",
		name: "Sardar Vallabhbhai Patel International Airport",
		city: "Ahmedabad",
		state: "Gujarat",
		country: "India",
		lat: 23.0772,
		lng: 72.6347,
		timezone: "Asia/Kolkata"
	},
	{
		iata: "IXB",
		icao: "VEBD",
		name: "Bagdogra Airport",
		city: "Siliguri (Darjeeling/Sikkim)",
		state: "West Bengal",
		country: "India",
		lat: 26.6812,
		lng: 88.3286,
		timezone: "Asia/Kolkata"
	},
	{
		iata: "VNS",
		icao: "VIBN",
		name: "Lal Bahadur Shastri International Airport",
		city: "Varanasi",
		state: "Uttar Pradesh",
		country: "India",
		lat: 25.4524,
		lng: 82.8593,
		timezone: "Asia/Kolkata"
	},
	{
		iata: "ATQ",
		icao: "VIAR",
		name: "Sri Guru Ram Dass Jee International Airport",
		city: "Amritsar",
		state: "Punjab",
		country: "India",
		lat: 31.7096,
		lng: 74.7973,
		timezone: "Asia/Kolkata"
	},
	{
		iata: "UDR",
		icao: "VAUD",
		name: "Maharana Pratap Airport",
		city: "Udaipur",
		state: "Rajasthan",
		country: "India",
		lat: 24.6177,
		lng: 73.8961,
		timezone: "Asia/Kolkata"
	},
	{
		iata: "GAU",
		icao: "VEGT",
		name: "Lokpriya Gopinath Bordoloi International Airport",
		city: "Guwahati",
		state: "Assam",
		country: "India",
		lat: 26.1061,
		lng: 91.5859,
		timezone: "Asia/Kolkata"
	},
	{
		iata: "TRV",
		icao: "VOTV",
		name: "Thiruvananthapuram International Airport",
		city: "Thiruvananthapuram",
		state: "Kerala",
		country: "India",
		lat: 8.4821,
		lng: 76.92,
		timezone: "Asia/Kolkata"
	},
	{
		iata: "DXB",
		icao: "OMDB",
		name: "Dubai International Airport",
		city: "Dubai",
		country: "United Arab Emirates",
		lat: 25.2532,
		lng: 55.3657,
		timezone: "Asia/Dubai"
	},
	{
		iata: "SIN",
		icao: "WSSS",
		name: "Singapore Changi Airport",
		city: "Singapore",
		country: "Singapore",
		lat: 1.3644,
		lng: 103.9915,
		timezone: "Asia/Singapore"
	},
	{
		iata: "BKK",
		icao: "VTBS",
		name: "Suvarnabhumi Airport",
		city: "Bangkok",
		country: "Thailand",
		lat: 13.69,
		lng: 100.7501,
		timezone: "Asia/Bangkok"
	},
	{
		iata: "MLE",
		icao: "VRMM",
		name: "Velana International Airport",
		city: "Male",
		country: "Maldives",
		lat: 4.1918,
		lng: 73.529,
		timezone: "Indian/Maldives"
	},
	{
		iata: "HND",
		icao: "RJTT",
		name: "Tokyo Haneda Airport",
		city: "Tokyo",
		country: "Japan",
		lat: 35.5494,
		lng: 139.7798,
		timezone: "Asia/Tokyo"
	},
	{
		iata: "DPS",
		icao: "WADD",
		name: "Ngurah Rai International Airport",
		city: "Bali (Denpasar)",
		country: "Indonesia",
		lat: -8.7482,
		lng: 115.1672,
		timezone: "Asia/Makassar"
	}
];
/**
* Fast client-side search for airports matching query string.
* Matches against IATA code, city name, airport name, and state.
*/
function searchAirports(query, limit = 8) {
	if (!query || query.trim().length === 0) return AIRPORTS.slice(0, limit);
	const q = query.trim().toLowerCase();
	return AIRPORTS.filter((a) => {
		return a.iata.toLowerCase().includes(q) || a.city.toLowerCase().includes(q) || a.name.toLowerCase().includes(q) || a.state && a.state.toLowerCase().includes(q) || a.country.toLowerCase().includes(q);
	}).slice(0, limit);
}
/**
* Find airport by exact IATA code (case-insensitive).
*/
function getAirportByIata(iata) {
	const code = iata.trim().toUpperCase();
	return AIRPORTS.find((a) => a.iata === code);
}
function AirportCombobox({ value, onChange, label, placeholder = "Search city or airport...", testId }) {
	const [isOpen, setIsOpen] = (0, import_react.useState)(false);
	const [query, setQuery] = (0, import_react.useState)("");
	const dropdownRef = (0, import_react.useRef)(null);
	const results = searchAirports(query, 6);
	const selectedAirport = searchAirports(value, 1)[0];
	(0, import_react.useEffect)(() => {
		function handleClickOutside(event) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative w-full",
		ref: dropdownRef,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			onClick: () => setIsOpen(true),
			className: "rounded-2xl border border-border bg-surface px-4 py-2.5 transition-colors focus-within:border-primary hover:border-border/80 cursor-pointer",
			"data-testid": testId,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[11px] font-semibold tracking-wide text-muted-foreground uppercase block",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2 mt-0.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "truncate",
					children: selectedAirport ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-semibold text-foreground text-sm",
						children: [
							selectedAirport.city,
							" (",
							selectedAirport.iata,
							")",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground block truncate font-normal",
								children: selectedAirport.name
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-muted-foreground",
						children: placeholder
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plane, { className: "size-4 shrink-0 text-muted-foreground" })]
			})]
		}), isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute top-full left-0 z-50 mt-1 w-full min-w-[280px] rounded-2xl border border-border bg-card p-2 shadow-xl animate-in fade-in-0 zoom-in-95",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 rounded-xl bg-secondary/60 px-3 py-2 mb-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "text",
					autoFocus: true,
					value: query,
					onChange: (e) => setQuery(e.target.value),
					placeholder: "Type city, state, or IATA code...",
					className: "w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground",
					"data-testid": `${testId}-search-input`
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-60 overflow-y-auto space-y-1",
				children: results.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "px-3 py-4 text-center text-xs text-muted-foreground",
					children: [
						"No airports found for “",
						query,
						"”"
					]
				}) : results.map((airport) => {
					const isSelected = airport.iata === value;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							onChange(airport);
							setIsOpen(false);
							setQuery("");
						},
						className: cn("flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors", isSelected ? "bg-primary/10 text-primary font-semibold" : "hover:bg-accent text-foreground"),
						"data-testid": `${testId}-option-${airport.iata}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "truncate pr-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold",
									children: airport.city
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded bg-secondary px-1.5 py-0.5 text-[11px] font-mono text-muted-foreground",
									children: airport.iata
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground truncate",
								children: airport.name
							})]
						}), isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 shrink-0 text-primary" })]
					}, airport.iata);
				})
			})]
		})]
	});
}
//#endregion
export { getAirportByIata as n, AirportCombobox as t };
