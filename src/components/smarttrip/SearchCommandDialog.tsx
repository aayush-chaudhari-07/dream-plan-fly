import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Calendar,
  Compass,
  History,
  Luggage,
  MapPin,
  Plane,
  Search,
  Sparkles,
  Ticket,
  Trash2,
  Wallet,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { destinations } from "@/data/travel";
import { useSmartTrip } from "@/lib/smarttrip-store";

interface SearchCommandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RECENT_KEY = "smarttrip.recent_searches";

export function SearchCommandDialog({ open, onOpenChange }: SearchCommandDialogProps) {
  const navigate = useNavigate();
  const { trips, bookings } = useSmartTrip();
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  // Global Ctrl/Cmd + K listener
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  // Load recent searches from localStorage
  useEffect(() => {
    if (open) {
      try {
        const raw = localStorage.getItem(RECENT_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) setRecentSearches(parsed.slice(0, 5));
        }
      } catch {
        /* storage unavailable */
      }
    }
  }, [open]);

  const addRecent = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    const updated = [
      trimmed,
      ...recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase()),
    ].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    } catch {
      /* storage unavailable */
    }
  };

  const removeRecent = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter((s) => s !== term);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    } catch {
      /* storage unavailable */
    }
  };

  const clearAllRecent = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch {
      /* storage unavailable */
    }
  };

  const handleSelect = (callback: () => void, term?: string) => {
    if (term) addRecent(term);
    onOpenChange(false);
    callback();
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search destinations, trips, bookings or quick links..."
        value={search}
        onValueChange={setSearch}
        data-testid="search-input"
      />
      <CommandList className="max-h-[380px] p-2">
        <CommandEmpty className="py-8 text-center text-sm text-muted-foreground">
          No matching destinations, trips, or bookings found.
        </CommandEmpty>

        {/* Recent Searches */}
        {recentSearches.length > 0 && !search && (
          <CommandGroup
            heading={
              <div className="flex items-center justify-between pr-2 text-xs font-semibold text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <History className="size-3.5" /> Recent Searches
                </span>
                <button
                  type="button"
                  onClick={clearAllRecent}
                  className="text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Clear all
                </button>
              </div>
            }
          >
            {recentSearches.map((term) => (
              <CommandItem
                key={term}
                value={`recent-${term}`}
                onSelect={() => {
                  setSearch(term);
                }}
                className="flex items-center justify-between rounded-xl px-3 py-2 text-sm cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Search className="size-3.5 text-muted-foreground" />
                  <span>{term}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => removeRecent(term, e)}
                  className="rounded-full p-1 text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10"
                  aria-label={`Remove ${term}`}
                >
                  <Trash2 className="size-3" />
                </button>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {recentSearches.length > 0 && !search && <CommandSeparator className="my-1" />}

        {/* Destinations */}
        <CommandGroup heading="Destinations">
          {destinations.map((dest) => (
            <CommandItem
              key={dest.id}
              value={`${dest.name} ${dest.region} ${dest.category} destination`}
              onSelect={() =>
                handleSelect(() => {
                  navigate({
                    to: "/destination/$id",
                    params: { id: dest.id },
                  });
                }, dest.name)
              }
              className="flex items-center justify-between rounded-xl px-3 py-2 text-sm cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={dest.image}
                  alt={dest.name}
                  loading="lazy"
                  decoding="async"
                  width={32}
                  height={32}
                  className="size-8 rounded-lg object-cover shrink-0 shadow-sm"
                />
                <div className="truncate">
                  <p className="font-medium text-foreground leading-tight truncate">{dest.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{dest.region}</p>
                </div>
              </div>
              <span className="shrink-0 text-xs font-semibold text-primary">
                ₹{dest.price.toLocaleString("en-IN")}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator className="my-1" />

        {/* Saved Trips */}
        {trips.length > 0 && (
          <CommandGroup heading="My Saved & Upcoming Trips">
            {trips.slice(0, 6).map((trip) => (
              <CommandItem
                key={trip.id}
                value={`${trip.name} ${trip.dates} ${trip.bucket} trip`}
                onSelect={() =>
                  handleSelect(() => {
                    navigate({ to: "/my-trips" });
                  }, trip.name)
                }
                className="flex items-center justify-between rounded-xl px-3 py-2 text-sm cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Luggage className="size-4 text-primary shrink-0" />
                  <div className="truncate">
                    <p className="font-medium text-foreground leading-tight truncate">
                      {trip.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{trip.dates}</p>
                  </div>
                </div>
                <span className="shrink-0 text-[11px] font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                  {trip.bucket}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Bookings */}
        {bookings.length > 0 && (
          <CommandGroup heading="Bookings">
            {bookings.slice(0, 5).map((booking) => (
              <CommandItem
                key={booking.id}
                value={`${booking.title} ${booking.subtitle} ${booking.reference} booking`}
                onSelect={() =>
                  handleSelect(() => {
                    navigate({ to: "/bookings" });
                  }, booking.title)
                }
                className="flex items-center justify-between rounded-xl px-3 py-2 text-sm cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Ticket className="size-4 text-emerald-600 shrink-0" />
                  <div className="truncate">
                    <p className="font-medium text-foreground leading-tight truncate">
                      {booking.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      Ref: {booking.reference} · {booking.subtitle}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 text-xs font-semibold text-foreground">
                  ₹{booking.price.toLocaleString("en-IN")}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandSeparator className="my-1" />

        {/* Quick Navigation Links */}
        <CommandGroup heading="Quick Actions">
          <CommandItem
            value="AI Trip Planner create plan custom itinerary"
            onSelect={() =>
              handleSelect(() => {
                navigate({ to: "/ai-planner" });
              })
            }
            className="rounded-xl px-3 py-2 text-sm cursor-pointer flex items-center gap-2.5"
          >
            <Sparkles className="size-4 text-amber-500" />
            <span>AI Trip Planner</span>
          </CommandItem>
          <CommandItem
            value="Explore around you interactive map destinations"
            onSelect={() =>
              handleSelect(() => {
                navigate({ to: "/explore" });
              })
            }
            className="rounded-xl px-3 py-2 text-sm cursor-pointer flex items-center gap-2.5"
          >
            <Compass className="size-4 text-sky-500" />
            <span>Explore Destinations & Map</span>
          </CommandItem>
          <CommandItem
            value="Bookings flights stays rentals packages"
            onSelect={() =>
              handleSelect(() => {
                navigate({ to: "/bookings" });
              })
            }
            className="rounded-xl px-3 py-2 text-sm cursor-pointer flex items-center gap-2.5"
          >
            <Plane className="size-4 text-indigo-500" />
            <span>Search & Manage Bookings</span>
          </CommandItem>
          <CommandItem
            value="Trip Fund dream vacation savings goals"
            onSelect={() =>
              handleSelect(() => {
                navigate({ to: "/save" });
              })
            }
            className="rounded-xl px-3 py-2 text-sm cursor-pointer flex items-center gap-2.5"
          >
            <Wallet className="size-4 text-emerald-500" />
            <span>Dream Trip Fund</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
