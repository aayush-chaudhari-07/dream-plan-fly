import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as cn, t as Button } from "./button-BSij73O2.mjs";
import { t as Badge } from "./badge-CNWERV3-.mjs";
import { c as inr, l as mapPlaces, r as destinations, t as calculateDistanceKm } from "./travel-Co-Z1Moz.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { u as smartTrip } from "./smarttrip-store-B4h7bmlO.mjs";
import { n as SectionHeading, t as Reveal } from "./Reveal-YnFTFRXl.mjs";
import { $t as Bed, B as Plus, G as Navigation, Tt as Compass, X as MapPin, ot as Landmark, s as Utensils, tt as LoaderCircle, y as Star, zt as Check } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/InteractiveMap-COhZVIgV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CATEGORIES = [
	"All",
	"Attractions",
	"Hotels",
	"Restaurants",
	"Activities"
];
var LeafletMapClient = import_react.lazy(() => import("./LeafletMapClient-eMUPN6t1.mjs"));
function InteractiveMap({ initialDestinationId, compact = false, showHeading = true }) {
	const [isMounted, setIsMounted] = (0, import_react.useState)(false);
	const [selectedDestination, setSelectedDestination] = (0, import_react.useState)(initialDestinationId || "all");
	const [category, setCategory] = (0, import_react.useState)("All");
	const [selectedPlaceId, setSelectedPlaceId] = (0, import_react.useState)(null);
	const [userLocation, setUserLocation] = (0, import_react.useState)(null);
	const [locating, setLocating] = (0, import_react.useState)(false);
	const [addedPlaces, setAddedPlaces] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	(0, import_react.useEffect)(() => {
		setIsMounted(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (initialDestinationId) setSelectedDestination(initialDestinationId);
	}, [initialDestinationId]);
	const currentDestination = (0, import_react.useMemo)(() => {
		if (selectedDestination === "all") return null;
		return destinations.find((d) => d.id === selectedDestination) || null;
	}, [selectedDestination]);
	const defaultCenter = (0, import_react.useMemo)(() => {
		if (userLocation) return userLocation;
		if (currentDestination) return [currentDestination.lat, currentDestination.lng];
		return [32.2432, 77.1892];
	}, [userLocation, currentDestination]);
	const [mapCenter, setMapCenter] = (0, import_react.useState)(defaultCenter);
	const [mapZoom, setMapZoom] = (0, import_react.useState)(currentDestination ? 12 : 11);
	(0, import_react.useEffect)(() => {
		if (currentDestination) {
			setMapCenter([currentDestination.lat, currentDestination.lng]);
			setMapZoom(12);
		} else if (userLocation) {
			setMapCenter(userLocation);
			setMapZoom(13);
		}
	}, [currentDestination, userLocation]);
	const displayedPlaces = (0, import_react.useMemo)(() => {
		let list = mapPlaces;
		if (selectedDestination !== "all") list = list.filter((p) => p.destinationId === selectedDestination);
		if (category !== "All") list = list.filter((p) => p.type === category);
		if (userLocation) {
			const [uLat, uLng] = userLocation;
			return list.map((p) => {
				const distKm = calculateDistanceKm(uLat, uLng, p.lat, p.lng);
				return {
					...p,
					distance: `${distKm} km`,
					_rawDist: distKm
				};
			}).sort((a, b) => a._rawDist - b._rawDist);
		}
		return list;
	}, [
		selectedDestination,
		category,
		userLocation
	]);
	const handleUseMyLocation = () => {
		if (!navigator.geolocation) {
			toast.error("Geolocation is not supported by your browser.");
			return;
		}
		setLocating(true);
		navigator.geolocation.getCurrentPosition((pos) => {
			const coords = [pos.coords.latitude, pos.coords.longitude];
			setUserLocation(coords);
			setMapCenter(coords);
			setMapZoom(13);
			setLocating(false);
			toast.success("Location detected!", { description: "Map centered and places sorted by real distance from you." });
		}, (err) => {
			setLocating(false);
			console.warn("Geolocation error:", err);
			toast.error("Could not retrieve your location", { description: "Please check location permissions or select a destination." });
		}, {
			timeout: 1e4,
			enableHighAccuracy: true
		});
	};
	const handleSelectPlace = (place) => {
		setSelectedPlaceId(place.id);
		setMapCenter([place.lat, place.lng]);
		setMapZoom(14);
	};
	const handleAddToTrip = (place) => {
		smartTrip.addPlaceToTrip(place);
		setAddedPlaces((prev) => /* @__PURE__ */ new Set([...prev, place.id]));
		toast.success(`Added ${place.name} to your trip!`, { description: `Saved to your ${place.destinationId} itinerary.` });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "map",
		className: cn("container-page", compact ? "py-8" : "py-24"),
		children: [
			showHeading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				eyebrow: "Interactive Map",
				title: "Explore Around You",
				subtitle: "Discover verified attractions, boutique stays, iconic food spots, and adrenaline adventures on OpenStreetMap."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					role: "tablist",
					"aria-label": "Filter places by category",
					className: "flex flex-wrap items-center gap-1.5",
					children: CATEGORIES.map((cat) => {
						const isActive = category === cat;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							role: "tab",
							"aria-selected": isActive,
							onClick: () => setCategory(cat),
							className: cn("rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary", isActive ? "bg-primary text-primary-foreground shadow-xs" : "border border-border bg-card/80 text-muted-foreground hover:border-primary/50 hover:text-foreground"),
							children: [
								cat === "Attractions" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { className: "mr-1 inline-block size-3.5" }),
								cat === "Hotels" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bed, { className: "mr-1 inline-block size-3.5" }),
								cat === "Restaurants" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Utensils, { className: "mr-1 inline-block size-3.5" }),
								cat === "Activities" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "mr-1 inline-block size-3.5" }),
								cat
							]
						}, cat);
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [!initialDestinationId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						"aria-label": "Filter by destination",
						value: selectedDestination,
						onChange: (e) => setSelectedDestination(e.target.value),
						className: "h-9 rounded-full border border-border bg-card px-3 text-xs font-medium text-foreground transition-colors hover:border-primary focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							children: "All Destinations"
						}), destinations.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: d.id,
							children: [
								d.name,
								" (",
								d.region.split(",")[0],
								")"
							]
						}, d.id))]
					}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: handleUseMyLocation,
						disabled: locating,
						"aria-label": "Use my browser location to sort places by distance",
						className: "rounded-full gap-1.5 text-xs h-9 hover:border-primary hover:text-primary transition-colors",
						children: [locating ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigation, { className: "size-3.5 text-primary" }), "Use my location"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
					className: "relative min-h-[460px] sm:min-h-[540px]",
					children: [isMounted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
						fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapLoadingSkeleton, {}),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeafletMapClient, {
							places: displayedPlaces,
							center: mapCenter,
							zoom: mapZoom,
							userCoords: userLocation,
							selectedPlaceId,
							onSelectPlace: handleSelectPlace,
							onAddToTrip: handleAddToTrip
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapLoadingSkeleton, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute bottom-4 left-4 z-20 hidden sm:flex flex-wrap items-center gap-2 rounded-2xl bg-card/90 backdrop-blur-md border border-border/80 px-3 py-1.5 text-[11px] shadow-soft",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1 font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-full bg-emerald-500" }), " Attractions"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1 font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-full bg-indigo-600" }), " Hotels"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1 font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-full bg-amber-500" }), " Dining"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1 font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-full bg-sky-500" }), " Activities"]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
					delay: 80,
					className: "flex flex-col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between pb-3 border-b border-border/60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display font-bold text-base text-foreground",
							children: "Nearby Places"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								displayedPlaces.length,
								" locations",
								" ",
								selectedDestination !== "all" ? `in ${currentDestination?.name || selectedDestination}` : "across destinations"
							]
						})] }), userLocation ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "text-[11px] bg-primary/10 text-primary border-primary/20",
							children: "Sorted by distance"
						}) : null]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex-1 space-y-3 overflow-y-auto max-h-[500px] pr-1.5 scrollbar-thin",
						children: displayedPlaces.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-8 text-center rounded-2xl border border-dashed border-border bg-surface/50",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-8 text-muted-foreground mx-auto mb-2 opacity-50" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold text-sm text-foreground",
									children: "No places found"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground mt-1",
									children: "Try switching category filters or choosing another destination."
								})
							]
						}) : displayedPlaces.map((place) => {
							const isSelected = selectedPlaceId === place.id;
							const isAdded = addedPlaces.has(place.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								onClick: () => handleSelectPlace(place),
								className: cn("group relative p-4 rounded-2xl border transition-all cursor-pointer text-left", isSelected ? "border-primary bg-primary/5 shadow-soft ring-1 ring-primary/40" : "border-border bg-card hover:border-primary/40 hover:bg-card/90 shadow-2xs"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
											children: place.type
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "font-display font-bold text-sm text-foreground group-hover:text-primary transition-colors",
											children: place.name
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1 rounded-full bg-sunset/15 px-2 py-0.5 text-xs font-semibold text-sunset shrink-0",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3 fill-sunset text-sunset" }),
												" ",
												place.rating
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed",
										children: place.note
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 flex items-center justify-between pt-2 border-t border-border/40 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1 text-muted-foreground font-medium",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3 text-primary shrink-0" }), place.distance || "Nearby"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [place.price ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-foreground mr-1",
												children: inr(place.price)
											}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: isAdded ? "outline" : "soft",
												className: "h-7 px-2.5 text-xs rounded-lg gap-1",
												onClick: (e) => {
													e.stopPropagation();
													handleAddToTrip(place);
												},
												children: isAdded ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3 text-emerald-500" }), " Added"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3" }), " Add to Trip"] })
											})]
										})]
									})
								]
							}, place.id);
						})
					})]
				})]
			})
		]
	});
}
function MapLoadingSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "size-full min-h-[460px] sm:min-h-[540px] rounded-3xl border border-border bg-muted/30 flex flex-col items-center justify-center p-6 text-center animate-pulse",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "size-6 animate-spin text-primary" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display font-bold text-foreground text-sm",
				children: "Loading Interactive Map…"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground mt-1 max-w-xs",
				children: "Rendering OpenStreetMap tiles and pins for verified sights, hotels and activities."
			})
		]
	});
}
//#endregion
export { InteractiveMap };
