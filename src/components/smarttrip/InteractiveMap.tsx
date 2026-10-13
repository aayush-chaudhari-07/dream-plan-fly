import React, { Suspense, useEffect, useMemo, useState } from "react";
import {
  Bed,
  Check,
  Compass,
  Landmark,
  Loader2,
  MapPin,
  Navigation,
  Plus,
  Star,
  Utensils,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { calculateDistanceKm, destinations, inr, mapPlaces, type MapPlace } from "@/data/travel";
import { smartTrip } from "@/lib/smarttrip-store";
import { cn } from "@/lib/utils";
import { Reveal, SectionHeading } from "./Reveal";

const CATEGORIES = ["All", "Attractions", "Hotels", "Restaurants", "Activities"] as const;
type CategoryFilter = (typeof CATEGORIES)[number];

const LeafletMapClient = React.lazy(() => import("./map/LeafletMapClient"));

export function InteractiveMap({
  initialDestinationId,
  compact = false,
  showHeading = true,
}: {
  initialDestinationId?: string;
  compact?: boolean;
  showHeading?: boolean;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<string>(
    initialDestinationId || "all",
  );
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);
  const [addedPlaces, setAddedPlaces] = useState<Set<string>>(new Set());

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (initialDestinationId) {
      setSelectedDestination(initialDestinationId);
    }
  }, [initialDestinationId]);

  // Determine active map center & zoom
  const currentDestination = useMemo(() => {
    if (selectedDestination === "all") return null;
    return destinations.find((d) => d.id === selectedDestination) || null;
  }, [selectedDestination]);

  const defaultCenter = useMemo<[number, number]>(() => {
    if (userLocation) return userLocation;
    if (currentDestination) return [currentDestination.lat, currentDestination.lng];
    // Default to India center or first destination (Manali)
    return [32.2432, 77.1892];
  }, [userLocation, currentDestination]);

  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultCenter);
  const [mapZoom, setMapZoom] = useState<number>(currentDestination ? 12 : 11);

  // Sync center when destination changes
  useEffect(() => {
    if (currentDestination) {
      setMapCenter([currentDestination.lat, currentDestination.lng]);
      setMapZoom(12);
    } else if (userLocation) {
      setMapCenter(userLocation);
      setMapZoom(13);
    }
  }, [currentDestination, userLocation]);

  // Process & filter places
  const displayedPlaces = useMemo(() => {
    let list = mapPlaces;

    // Filter by destination
    if (selectedDestination !== "all") {
      list = list.filter((p) => p.destinationId === selectedDestination);
    }

    // Filter by category
    if (category !== "All") {
      list = list.filter((p) => p.type === category);
    }

    // If user geolocation is available, compute real distance and sort
    if (userLocation) {
      const [uLat, uLng] = userLocation;
      return list
        .map((p) => {
          const distKm = calculateDistanceKm(uLat, uLng, p.lat, p.lng);
          return {
            ...p,
            distance: `${distKm} km`,
            _rawDist: distKm,
          };
        })
        .sort((a, b) => a._rawDist - b._rawDist);
    }

    return list;
  }, [selectedDestination, category, userLocation]);

  // Handle browser geolocation
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(coords);
        setMapCenter(coords);
        setMapZoom(13);
        setLocating(false);
        toast.success("Location detected!", {
          description: "Map centered and places sorted by real distance from you.",
        });
      },
      (err) => {
        setLocating(false);
        console.warn("Geolocation error:", err);
        toast.error("Could not retrieve your location", {
          description: "Please check location permissions or select a destination.",
        });
      },
      { timeout: 10000, enableHighAccuracy: true },
    );
  };

  const handleSelectPlace = (place: MapPlace) => {
    setSelectedPlaceId(place.id);
    setMapCenter([place.lat, place.lng]);
    setMapZoom(14);
  };

  const handleAddToTrip = (place: MapPlace) => {
    smartTrip.addPlaceToTrip(place);
    setAddedPlaces((prev) => new Set([...prev, place.id]));
    toast.success(`Added ${place.name} to your trip!`, {
      description: `Saved to your ${place.destinationId} itinerary.`,
    });
  };

  return (
    <section id="map" className={cn("container-page", compact ? "py-8" : "py-24")}>
      {showHeading ? (
        <SectionHeading
          eyebrow="Interactive Map"
          title="Explore Around You"
          subtitle="Discover verified attractions, boutique stays, iconic food spots, and adrenaline adventures on OpenStreetMap."
        />
      ) : null}

      {/* Top Filter Bar */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Category Filters */}
        <div
          role="tablist"
          aria-label="Filter places by category"
          className="flex flex-wrap items-center gap-1.5"
        >
          {CATEGORIES.map((cat) => {
            const isActive = category === cat;
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={isActive}
                onClick={() => setCategory(cat)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "border border-border bg-card/80 text-muted-foreground hover:border-primary/50 hover:text-foreground",
                )}
              >
                {cat === "Attractions" && <Landmark className="mr-1 inline-block size-3.5" />}
                {cat === "Hotels" && <Bed className="mr-1 inline-block size-3.5" />}
                {cat === "Restaurants" && <Utensils className="mr-1 inline-block size-3.5" />}
                {cat === "Activities" && <Compass className="mr-1 inline-block size-3.5" />}
                {cat}
              </button>
            );
          })}
        </div>

        {/* Action Controls: Destination Picker & Geolocation */}
        <div className="flex flex-wrap items-center gap-2">
          {!initialDestinationId ? (
            <select
              aria-label="Filter by destination"
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              className="h-9 rounded-full border border-border bg-card px-3 text-xs font-medium text-foreground transition-colors hover:border-primary focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="all">All Destinations</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.region.split(",")[0]})
                </option>
              ))}
            </select>
          ) : null}

          <Button
            variant="outline"
            size="sm"
            onClick={handleUseMyLocation}
            disabled={locating}
            aria-label="Use my browser location to sort places by distance"
            className="rounded-full gap-1.5 text-xs h-9 hover:border-primary hover:text-primary transition-colors"
          >
            {locating ? (
              <Loader2 className="size-3.5 animate-spin text-primary" />
            ) : (
              <Navigation className="size-3.5 text-primary" />
            )}
            Use my location
          </Button>
        </div>
      </div>

      {/* Main Grid: Map & Nearby Places */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        {/* Left: Interactive Map Container */}
        <Reveal className="relative min-h-[460px] sm:min-h-[540px]">
          {isMounted ? (
            <Suspense fallback={<MapLoadingSkeleton />}>
              <LeafletMapClient
                places={displayedPlaces}
                center={mapCenter}
                zoom={mapZoom}
                userCoords={userLocation}
                selectedPlaceId={selectedPlaceId}
                onSelectPlace={handleSelectPlace}
                onAddToTrip={handleAddToTrip}
              />
            </Suspense>
          ) : (
            <MapLoadingSkeleton />
          )}

          {/* Map Legend Overlay */}
          <div className="absolute bottom-4 left-4 z-20 hidden sm:flex flex-wrap items-center gap-2 rounded-2xl bg-card/90 backdrop-blur-md border border-border/80 px-3 py-1.5 text-[11px] shadow-soft">
            <span className="flex items-center gap-1 font-medium">
              <span className="size-2.5 rounded-full bg-emerald-500" /> Attractions
            </span>
            <span className="flex items-center gap-1 font-medium">
              <span className="size-2.5 rounded-full bg-indigo-600" /> Hotels
            </span>
            <span className="flex items-center gap-1 font-medium">
              <span className="size-2.5 rounded-full bg-amber-500" /> Dining
            </span>
            <span className="flex items-center gap-1 font-medium">
              <span className="size-2.5 rounded-full bg-sky-500" /> Activities
            </span>
          </div>
        </Reveal>

        {/* Right: Nearby Places List */}
        <Reveal delay={80} className="flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div>
              <h3 className="font-display font-bold text-base text-foreground">Nearby Places</h3>
              <p className="text-xs text-muted-foreground">
                {displayedPlaces.length} locations{" "}
                {selectedDestination !== "all"
                  ? `in ${currentDestination?.name || selectedDestination}`
                  : "across destinations"}
              </p>
            </div>
            {userLocation ? (
              <Badge
                variant="outline"
                className="text-[11px] bg-primary/10 text-primary border-primary/20"
              >
                Sorted by distance
              </Badge>
            ) : null}
          </div>

          <div className="mt-3 flex-1 space-y-3 overflow-y-auto max-h-[500px] pr-1.5 scrollbar-thin">
            {displayedPlaces.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-border bg-surface/50">
                <MapPin className="size-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="font-semibold text-sm text-foreground">No places found</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try switching category filters or choosing another destination.
                </p>
              </div>
            ) : (
              displayedPlaces.map((place) => {
                const isSelected = selectedPlaceId === place.id;
                const isAdded = addedPlaces.has(place.id);

                return (
                  <article
                    key={place.id}
                    onClick={() => handleSelectPlace(place)}
                    className={cn(
                      "group relative p-4 rounded-2xl border transition-all cursor-pointer text-left",
                      isSelected
                        ? "border-primary bg-primary/5 shadow-soft ring-1 ring-primary/40"
                        : "border-border bg-card hover:border-primary/40 hover:bg-card/90 shadow-2xs",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {place.type}
                        </span>
                        <h4 className="font-display font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                          {place.name}
                        </h4>
                      </div>
                      <span className="flex items-center gap-1 rounded-full bg-sunset/15 px-2 py-0.5 text-xs font-semibold text-sunset shrink-0">
                        <Star className="size-3 fill-sunset text-sunset" /> {place.rating}
                      </span>
                    </div>

                    <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {place.note}
                    </p>

                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-border/40 text-xs">
                      <span className="flex items-center gap-1 text-muted-foreground font-medium">
                        <MapPin className="size-3 text-primary shrink-0" />
                        {place.distance || "Nearby"}
                      </span>

                      <div className="flex items-center gap-2">
                        {place.price ? (
                          <span className="font-semibold text-foreground mr-1">
                            {inr(place.price)}
                          </span>
                        ) : null}
                        <Button
                          size="sm"
                          variant={isAdded ? "outline" : "soft"}
                          className="h-7 px-2.5 text-xs rounded-lg gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToTrip(place);
                          }}
                        >
                          {isAdded ? (
                            <>
                              <Check className="size-3 text-emerald-500" /> Added
                            </>
                          ) : (
                            <>
                              <Plus className="size-3" /> Add to Trip
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function MapLoadingSkeleton() {
  return (
    <div className="size-full min-h-[460px] sm:min-h-[540px] rounded-3xl border border-border bg-muted/30 flex flex-col items-center justify-center p-6 text-center animate-pulse">
      <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-3">
        <Compass className="size-6 animate-spin text-primary" />
      </div>
      <p className="font-display font-bold text-foreground text-sm">Loading Interactive Map…</p>
      <p className="text-xs text-muted-foreground mt-1 max-w-xs">
        Rendering OpenStreetMap tiles and pins for verified sights, hotels and activities.
      </p>
    </div>
  );
}
