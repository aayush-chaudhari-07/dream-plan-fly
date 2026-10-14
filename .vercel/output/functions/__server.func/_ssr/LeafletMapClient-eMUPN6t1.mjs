import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-BSij73O2.mjs";
import { c as inr } from "./travel-Co-Z1Moz.mjs";
import { B as Plus, G as Navigation, y as Star, zt as Check } from "../_libs/lucide-react.mjs";
import { t as require_leaflet_src } from "../_libs/leaflet.mjs";
import { a as useMap, i as MapContainer, n as Popup, r as Marker, t as TileLayer } from "../_libs/react-leaflet.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/LeafletMapClient-eMUPN6t1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_leaflet_src = /* @__PURE__ */ __toESM(require_leaflet_src());
function createDivIcon(type, isSelected) {
	let bg = "bg-emerald-500";
	let svgIcon = `<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>`;
	if (type === "Hotels") {
		bg = "bg-indigo-600";
		svgIcon = `<path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"/>`;
	} else if (type === "Restaurants") {
		bg = "bg-amber-500";
		svgIcon = `<path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2M15 11v11M5 2v20M2 2h6v5a3 3 0 0 1-6 0V2z"/>`;
	} else if (type === "Activities") {
		bg = "bg-sky-500";
		svgIcon = `<polygon points="3 11 22 2 13 21 11 13 3 11"/>`;
	}
	const ring = isSelected ? "ring-4 ring-primary scale-125 z-50 animate-pulse" : "ring-2 ring-white/90 shadow-md";
	return import_leaflet_src.default.divIcon({
		className: "custom-leaflet-marker",
		html: `<div class="smarttrip-pin size-8 sm:size-9 ${bg} text-white ${ring} flex items-center justify-center rounded-full"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${svgIcon}</svg></div>`,
		iconSize: [36, 36],
		iconAnchor: [18, 18],
		popupAnchor: [0, -18]
	});
}
var userLocationIcon = import_leaflet_src.default.divIcon({
	className: "custom-leaflet-marker",
	html: `<div class="relative flex items-center justify-center size-8"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75"></span><span class="relative inline-flex rounded-full size-5 bg-primary ring-2 ring-white shadow-xl"></span></div>`,
	iconSize: [32, 32],
	iconAnchor: [16, 16],
	popupAnchor: [0, -16]
});
function MapController({ center, zoom }) {
	const map = useMap();
	(0, import_react.useEffect)(() => {
		map.flyTo(center, zoom, { duration: 1.2 });
	}, [
		center,
		zoom,
		map
	]);
	return null;
}
function LeafletMapClient({ places, center, zoom = 12, userCoords, selectedPlaceId, onSelectPlace, onAddToTrip }) {
	const [addedIds, setAddedIds] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const handleAdd = (place) => {
		onAddToTrip?.(place);
		setAddedIds((prev) => /* @__PURE__ */ new Set([...prev, place.id]));
	};
	const icons = (0, import_react.useMemo)(() => {
		return {
			Attractions: createDivIcon("Attractions", false),
			Hotels: createDivIcon("Hotels", false),
			Restaurants: createDivIcon("Restaurants", false),
			Activities: createDivIcon("Activities", false),
			selected: {
				Attractions: createDivIcon("Attractions", true),
				Hotels: createDivIcon("Hotels", true),
				Restaurants: createDivIcon("Restaurants", true),
				Activities: createDivIcon("Activities", true)
			}
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "relative size-full min-h-[420px] rounded-3xl overflow-hidden border border-border shadow-soft",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MapContainer, {
			center,
			zoom,
			scrollWheelZoom: false,
			className: "size-full min-h-[420px] z-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TileLayer, {
					attribution: "© <a href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\" rel=\"noopener noreferrer\">OpenStreetMap</a> contributors",
					url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
					maxZoom: 19,
					updateWhenIdle: true,
					updateWhenZooming: false,
					keepBuffer: 2,
					crossOrigin: "anonymous"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapController, {
					center,
					zoom
				}),
				userCoords && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Marker, {
					position: userCoords,
					icon: userLocationIcon,
					title: "Your Location",
					alt: "Your Location",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Popup, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-1 text-center font-display",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-center justify-center gap-1.5 font-bold text-primary text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigation, { className: "size-3.5 fill-primary text-primary" }), "Your Location"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground mt-0.5",
							children: "Distances calculated from here"
						})]
					}) })
				}),
				places.map((p) => {
					const isSelected = selectedPlaceId === p.id;
					const isAdded = addedIds.has(p.id);
					const icon = isSelected ? icons.selected[p.type] : icons[p.type];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Marker, {
						position: [p.lat, p.lng],
						icon,
						title: p.name,
						alt: p.name,
						eventHandlers: { click: () => onSelectPlace?.(p) },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Popup, {
							className: "smarttrip-popup",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "w-56 sm:w-64 p-0.5 space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
											children: p.type
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "font-display font-bold text-sm leading-tight text-foreground",
											children: p.name
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1 rounded-full bg-sunset/15 px-2 py-0.5 text-xs font-semibold text-sunset shrink-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3 fill-sunset text-sunset" }), p.rating]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground line-clamp-2 leading-relaxed",
										children: p.note
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-xs pt-1 border-t border-border/50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground font-medium",
											children: p.distance ? `~${p.distance}` : "Nearby"
										}), p.price ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-primary",
											children: inr(p.price)
										}) : null]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: isAdded ? "outline" : "hero",
										className: "w-full h-8 text-xs gap-1.5 rounded-xl mt-1",
										onClick: () => handleAdd(p),
										children: isAdded ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 text-emerald-500" }), " Added to Trip"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), " Add to Trip"] })
									})
								]
							})
						})
					}, p.id);
				})
			]
		})
	});
}
//#endregion
export { LeafletMapClient as default };
