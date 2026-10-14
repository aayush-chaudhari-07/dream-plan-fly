import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Bus, Car, Hotel, Luggage, Plane, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import { cn } from "@/client/lib/utils";
import { Reveal } from "@/client/components/Reveal";
import { AirportCombobox } from "./AirportCombobox";
import { getAirportByIata } from "@/shared/constants/airports";
import type { CabinClass } from "@/shared/constants/flight-generator";

export type TabKey = "flights" | "stay" | "rental" | "rail" | "packages";

const tabs: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "flights", label: "Flights", icon: Plane },
  { key: "stay", label: "Hotels & Stays", icon: Hotel },
  { key: "rental", label: "Car & Bike Rentals", icon: Car },
  { key: "rail", label: "Train & Bus", icon: Bus },
  { key: "packages", label: "Curated Packages", icon: Luggage },
];

export function QuickBooking({ onSearch }: { onSearch?: (tab: TabKey) => void }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>("flights");

  // Flight search states
  const [originIata, setOriginIata] = useState("DEL");
  const [destinationIata, setDestinationIata] = useState("GOI");
  const [departDate, setDepartDate] = useState("2026-12-15");
  const [returnDate, setReturnDate] = useState("2026-12-20");
  const [travelers, setTravelers] = useState(2);
  const [cabinClass, setCabinClass] = useState<CabinClass>("economy");

  // Other tabs states
  const [stayDest, setStayDest] = useState("Goa");
  const [rentalLoc, setRentalLoc] = useState("Manali");
  const [railFrom, setRailFrom] = useState("Mumbai");
  const [railTo, setRailTo] = useState("Goa");
  const [packageDest, setPackageDest] = useState("Kashmir");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(tab);

    const originAirport = getAirportByIata(originIata);
    const destAirport = getAirportByIata(destinationIata);

    if (tab === "flights") {
      navigate({
        to: "/bookings",
        search: {
          tab: "flights",
          origin: originIata,
          destination: destinationIata,
          date: departDate,
          travelers,
          cabinClass,
        },
      });
      toast.success("Searching Flights", {
        description: `${originAirport?.city || originIata} to ${destAirport?.city || destinationIata} · ${travelers} travelers`,
      });
    } else if (tab === "stay") {
      navigate({
        to: "/bookings",
        search: {
          tab: "stay",
          destination: stayDest,
          travelers,
        },
      });
      toast.success("Searching Hotels", { description: `Stays in ${stayDest}` });
    } else if (tab === "rental") {
      navigate({
        to: "/bookings",
        search: {
          tab: "rental",
          destination: rentalLoc,
        },
      });
      toast.success("Searching Rentals", { description: `Vehicles in ${rentalLoc}` });
    } else if (tab === "rail") {
      navigate({
        to: "/bookings",
        search: {
          tab: "rail",
          origin: railFrom,
          destination: railTo,
          travelers,
        },
      });
      toast.success("Searching Train & Bus", { description: `${railFrom} to ${railTo}` });
    } else {
      navigate({
        to: "/bookings",
        search: {
          tab: "packages",
          destination: packageDest,
          travelers,
        },
      });
      toast.success("Searching Holiday Packages", { description: `Curated ${packageDest} tours` });
    }
  };

  return (
    <section className="relative -mt-24">
      <div className="container-page">
        <Reveal className="surface-card overflow-hidden p-5 sm:p-7 shadow-xl">
          {/* Tab Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300",
                  tab === key
                    ? "bg-gradient-brand text-primary-foreground shadow-soft"
                    : "bg-secondary text-secondary-foreground hover:bg-accent",
                )}
                data-testid={`quickbooking-tab-${key}`}
              >
                <Icon className="size-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form
            key={tab}
            className="mt-5 grid animate-fade-in gap-3 md:grid-cols-3 lg:grid-cols-4 items-end"
            onSubmit={handleSearchSubmit}
          >
            {tab === "flights" && (
              <>
                <AirportCombobox
                  label="From (Origin)"
                  value={originIata}
                  onChange={(a) => setOriginIata(a.iata)}
                  testId="search-origin-input"
                />

                <AirportCombobox
                  label="To (Destination)"
                  value={destinationIata}
                  onChange={(a) => setDestinationIata(a.iata)}
                  testId="search-destination-input"
                />

                <label className="rounded-2xl border border-border bg-surface px-4 py-2.5 transition-colors focus-within:border-primary">
                  <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase block">
                    Departure Date
                  </span>
                  <Input
                    type="date"
                    value={departDate}
                    onChange={(e) => setDepartDate(e.target.value)}
                    className="h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 text-sm font-semibold"
                    data-testid="search-depart-date"
                  />
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <label className="rounded-2xl border border-border bg-surface px-3 py-2.5 transition-colors focus-within:border-primary">
                    <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase block">
                      Travelers
                    </span>
                    <Input
                      type="number"
                      min={1}
                      max={9}
                      value={travelers}
                      onChange={(e) => setTravelers(Number(e.target.value) || 1)}
                      className="h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 text-sm font-semibold"
                    />
                  </label>

                  <label className="rounded-2xl border border-border bg-surface px-3 py-2.5 transition-colors focus-within:border-primary">
                    <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase block">
                      Class
                    </span>
                    <select
                      value={cabinClass}
                      onChange={(e) => setCabinClass(e.target.value as CabinClass)}
                      className="h-8 w-full border-0 bg-transparent text-xs font-semibold focus:outline-none"
                    >
                      <option value="economy">Economy</option>
                      <option value="premium_economy">Premium</option>
                      <option value="business">Business</option>
                    </select>
                  </label>
                </div>
              </>
            )}

            {tab === "stay" && (
              <>
                <label className="rounded-2xl border border-border bg-surface px-4 py-2.5 transition-colors focus-within:border-primary">
                  <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase block">
                    Destination
                  </span>
                  <select
                    value={stayDest}
                    onChange={(e) => setStayDest(e.target.value)}
                    className="h-8 w-full border-0 bg-transparent text-sm font-semibold focus:outline-none"
                  >
                    <option value="Goa">Goa</option>
                    <option value="Manali">Manali</option>
                    <option value="Kashmir">Kashmir / Srinagar</option>
                    <option value="Jaipur">Jaipur</option>
                    <option value="Munnar">Munnar / Kerala</option>
                  </select>
                </label>

                <label className="rounded-2xl border border-border bg-surface px-4 py-2.5 transition-colors focus-within:border-primary">
                  <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase block">
                    Check-in Date
                  </span>
                  <Input
                    type="date"
                    defaultValue="2026-12-15"
                    className="h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 text-sm font-semibold"
                  />
                </label>

                <label className="rounded-2xl border border-border bg-surface px-4 py-2.5 transition-colors focus-within:border-primary">
                  <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase block">
                    Guests & Rooms
                  </span>
                  <Input
                    type="text"
                    defaultValue="2 Guests, 1 Room"
                    className="h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 text-sm font-semibold"
                  />
                </label>
              </>
            )}

            {tab === "rental" && (
              <>
                <label className="rounded-2xl border border-border bg-surface px-4 py-2.5 transition-colors focus-within:border-primary">
                  <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase block">
                    Location
                  </span>
                  <select
                    value={rentalLoc}
                    onChange={(e) => setRentalLoc(e.target.value)}
                    className="h-8 w-full border-0 bg-transparent text-sm font-semibold focus:outline-none"
                  >
                    <option value="Manali">Manali (Rohtang Pass)</option>
                    <option value="Goa">Goa (Airport & Beaches)</option>
                    <option value="Jaipur">Jaipur (Royal Forts)</option>
                  </select>
                </label>

                <label className="rounded-2xl border border-border bg-surface px-4 py-2.5 transition-colors focus-within:border-primary">
                  <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase block">
                    Pick-up Date
                  </span>
                  <Input
                    type="date"
                    defaultValue="2026-12-15"
                    className="h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 text-sm font-semibold"
                  />
                </label>

                <label className="rounded-2xl border border-border bg-surface px-4 py-2.5 transition-colors focus-within:border-primary">
                  <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase block">
                    Vehicle Preference
                  </span>
                  <Input
                    type="text"
                    defaultValue="4x4 SUV / Adventure Bike"
                    className="h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 text-sm font-semibold"
                  />
                </label>
              </>
            )}

            {tab === "rail" && (
              <>
                <label className="rounded-2xl border border-border bg-surface px-4 py-2.5 transition-colors focus-within:border-primary">
                  <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase block">
                    From City
                  </span>
                  <Input
                    value={railFrom}
                    onChange={(e) => setRailFrom(e.target.value)}
                    className="h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 text-sm font-semibold"
                  />
                </label>

                <label className="rounded-2xl border border-border bg-surface px-4 py-2.5 transition-colors focus-within:border-primary">
                  <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase block">
                    To City
                  </span>
                  <Input
                    value={railTo}
                    onChange={(e) => setRailTo(e.target.value)}
                    className="h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 text-sm font-semibold"
                  />
                </label>

                <label className="rounded-2xl border border-border bg-surface px-4 py-2.5 transition-colors focus-within:border-primary">
                  <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase block">
                    Journey Date
                  </span>
                  <Input
                    type="date"
                    defaultValue="2026-12-15"
                    className="h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 text-sm font-semibold"
                  />
                </label>
              </>
            )}

            {tab === "packages" && (
              <>
                <label className="rounded-2xl border border-border bg-surface px-4 py-2.5 transition-colors focus-within:border-primary">
                  <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase block">
                    Destination Region
                  </span>
                  <select
                    value={packageDest}
                    onChange={(e) => setPackageDest(e.target.value)}
                    className="h-8 w-full border-0 bg-transparent text-sm font-semibold focus:outline-none"
                  >
                    <option value="Kashmir">Kashmir (Dal Lake & Gulmarg)</option>
                    <option value="Jaipur">Jaipur (Golden Triangle)</option>
                    <option value="Goa">Goa (Beach & Catamaran)</option>
                    <option value="Manali">Manali (Alpine Escape)</option>
                  </select>
                </label>

                <label className="rounded-2xl border border-border bg-surface px-4 py-2.5 transition-colors focus-within:border-primary">
                  <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase block">
                    Travel Window
                  </span>
                  <Input
                    type="text"
                    defaultValue="December / January"
                    className="h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 text-sm font-semibold"
                  />
                </label>

                <label className="rounded-2xl border border-border bg-surface px-4 py-2.5 transition-colors focus-within:border-primary">
                  <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase block">
                    Travelers
                  </span>
                  <Input
                    type="number"
                    min={1}
                    value={travelers}
                    onChange={(e) => setTravelers(Number(e.target.value) || 1)}
                    className="h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 text-sm font-semibold"
                  />
                </label>
              </>
            )}

            <Button
              type="submit"
              variant="hero"
              size="xl"
              className="md:col-span-1 rounded-2xl shadow-soft"
              data-testid="search-submit-btn"
            >
              <Search /> Search{" "}
              {tab === "stay"
                ? "Hotels"
                : tab === "rail"
                  ? "Transit"
                  : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
