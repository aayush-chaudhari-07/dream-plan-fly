import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Check, Compass, Navigation, Plus, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/client/components/ui/button";
import { Badge } from "@/client/components/ui/badge";
import type { MapPlace } from "@/shared/types/travel";
import { inr } from "@/shared/types/travel";

// Custom Leaflet DivIcons
function createDivIcon(type: MapPlace["type"], isSelected: boolean) {
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

  const ring = isSelected
    ? "ring-4 ring-primary scale-125 z-50 animate-pulse"
    : "ring-2 ring-white/90 shadow-md";

  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `<div class="smarttrip-pin size-8 sm:size-9 ${bg} text-white ${ring} flex items-center justify-center rounded-full"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${svgIcon}</svg></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
}

const userLocationIcon = L.divIcon({
  className: "custom-leaflet-marker",
  html: `<div class="relative flex items-center justify-center size-8"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75"></span><span class="relative inline-flex rounded-full size-5 bg-primary ring-2 ring-white shadow-xl"></span></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}

export interface LeafletMapClientProps {
  places: MapPlace[];
  center: [number, number];
  zoom?: number;
  userCoords?: [number, number] | null;
  selectedPlaceId?: string | null;
  onSelectPlace?: (place: MapPlace) => void;
  onAddToTrip?: (place: MapPlace) => void;
}

export default function LeafletMapClient({
  places,
  center,
  zoom = 12,
  userCoords,
  selectedPlaceId,
  onSelectPlace,
  onAddToTrip,
}: LeafletMapClientProps) {
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const handleAdd = (place: MapPlace) => {
    onAddToTrip?.(place);
    setAddedIds((prev) => new Set([...prev, place.id]));
  };

  const icons = useMemo(() => {
    return {
      Attractions: createDivIcon("Attractions", false),
      Hotels: createDivIcon("Hotels", false),
      Restaurants: createDivIcon("Restaurants", false),
      Activities: createDivIcon("Activities", false),
      selected: {
        Attractions: createDivIcon("Attractions", true),
        Hotels: createDivIcon("Hotels", true),
        Restaurants: createDivIcon("Restaurants", true),
        Activities: createDivIcon("Activities", true),
      },
    };
  }, []);

  return (
    <div className="relative size-full min-h-[420px] rounded-3xl overflow-hidden border border-border shadow-soft">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="size-full min-h-[420px] z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
          updateWhenIdle={true}
          updateWhenZooming={false}
          keepBuffer={2}
          crossOrigin="anonymous"
        />

        <MapController center={center} zoom={zoom} />

        {/* User Geolocation Marker */}
        {userCoords && (
          <Marker
            position={userCoords}
            icon={userLocationIcon}
            title="Your Location"
            alt="Your Location"
          >
            <Popup>
              <div className="p-1 text-center font-display">
                <p className="flex items-center justify-center gap-1.5 font-bold text-primary text-xs">
                  <Navigation className="size-3.5 fill-primary text-primary" />
                  Your Location
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Distances calculated from here
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Places Markers */}
        {places.map((p) => {
          const isSelected = selectedPlaceId === p.id;
          const isAdded = addedIds.has(p.id);
          const icon = isSelected ? icons.selected[p.type] : icons[p.type];

          return (
            <Marker
              key={p.id}
              position={[p.lat, p.lng]}
              icon={icon}
              title={p.name}
              alt={p.name}
              eventHandlers={{
                click: () => onSelectPlace?.(p),
              }}
            >
              <Popup className="smarttrip-popup">
                <div className="w-56 sm:w-64 p-0.5 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {p.type}
                      </span>
                      <h4 className="font-display font-bold text-sm leading-tight text-foreground">
                        {p.name}
                      </h4>
                    </div>
                    <span className="flex items-center gap-1 rounded-full bg-sunset/15 px-2 py-0.5 text-xs font-semibold text-sunset shrink-0">
                      <Star className="size-3 fill-sunset text-sunset" />
                      {p.rating}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {p.note}
                  </p>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-border/50">
                    <span className="text-muted-foreground font-medium">
                      {p.distance ? `~${p.distance}` : "Nearby"}
                    </span>
                    {p.price ? (
                      <span className="font-semibold text-primary">{inr(p.price)}</span>
                    ) : null}
                  </div>

                  <Button
                    size="sm"
                    variant={isAdded ? "outline" : "hero"}
                    className="w-full h-8 text-xs gap-1.5 rounded-xl mt-1"
                    onClick={() => handleAdd(p)}
                  >
                    {isAdded ? (
                      <>
                        <Check className="size-3.5 text-emerald-500" /> Added to Trip
                      </>
                    ) : (
                      <>
                        <Plus className="size-3.5" /> Add to Trip
                      </>
                    )}
                  </Button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
