import { useState, useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import {
  Bus,
  Car,
  Hotel,
  Luggage,
  Plane,
  Star,
  ArrowRight,
  Filter,
  SlidersHorizontal,
  Clock,
  Sparkles,
  Leaf,
  ShieldCheck,
  RotateCcw,
  BellRing,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Footer } from "@/components/smarttrip/Footer";
import { Navbar } from "@/components/smarttrip/Navbar";
import { PageHeader } from "@/components/smarttrip/PageHeader";
import { SupportDock } from "@/components/smarttrip/SupportDock";
import { AirportCombobox } from "@/components/smarttrip/booking/AirportCombobox";
import { inr } from "@/data/travel";
import { smartTrip } from "@/lib/smarttrip-store";
import { createPriceAlertFn } from "@/lib/server/live-data-actions";
import { getAirportByIata } from "@/data/airports";
import { generateFlights, type FlightOption, type CabinClass } from "@/data/flight-generator";
import {
  INVENTORY_STAYS,
  INVENTORY_RENTALS,
  INVENTORY_TRANSIT,
  INVENTORY_PACKAGES,
  type InventoryStay,
  type InventoryRental,
  type InventoryTransit,
  type InventoryPackage,
} from "@/data/inventory-data";
import { cn } from "@/lib/utils";

const bookingsSearchSchema = z.object({
  tab: z.enum(["flights", "stay", "rental", "rail", "packages"]).optional(),
  origin: z.string().optional(),
  destination: z.string().optional(),
  date: z.string().optional(),
  travelers: z.coerce.number().optional(),
  cabinClass: z.enum(["economy", "premium_economy", "business", "first"]).optional(),
});

import { createSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/bookings")({
  validateSearch: (search) => bookingsSearchSchema.parse(search),
  head: () =>
    createSeoHead({
      title: "Book Flights, Hotels, Rentals & Rail",
      description:
        "Search real Indian routes, compare airline fares, view verified hotels and reserve travel tickets in our demo booking engine.",
      path: "/bookings",
    }),
  component: BookingsPage,
});

type TabKey = "flights" | "stay" | "rental" | "rail" | "packages";

const tabs: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "flights", label: "Flights", icon: Plane },
  { key: "stay", label: "Hotels & Stays", icon: Hotel },
  { key: "rental", label: "Car & Bike Rentals", icon: Car },
  { key: "rail", label: "Train & Bus", icon: Bus },
  { key: "packages", label: "Holiday Packages", icon: Luggage },
];

function BookingsPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();

  const tab = search.tab || "flights";
  const [activeTab, setActiveTab] = useState<TabKey>(tab);

  // Search parameters state
  const [originIata, setOriginIata] = useState(search.origin || "DEL");
  const [destinationIata, setDestinationIata] = useState(search.destination || "GOI");
  const [departDate, setDepartDate] = useState(search.date || "2026-12-15");
  const [travelers, setTravelers] = useState(search.travelers || 2);
  const [cabinClass, setCabinClass] = useState<CabinClass>(search.cabinClass || "economy");

  // Filter States
  const [maxPrice, setMaxPrice] = useState<number>(50000);
  const [stopsFilter, setStopsFilter] = useState<"all" | "non-stop" | "1-stop">("all");
  const [timeFilter, setTimeFilter] = useState<"all" | "morning" | "afternoon" | "evening">("all");
  const [selectedAirline, setSelectedAirline] = useState<string>("all");
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<
    "price-asc" | "price-desc" | "duration" | "departure" | "rating"
  >("departure");

  const originAirport = getAirportByIata(originIata);
  const destAirport = getAirportByIata(destinationIata);

  // Price Alert Modal State
  const [priceAlertModal, setPriceAlertModal] = useState<{
    isOpen: boolean;
    itemType: "flight" | "stay" | "package";
    itemId: string;
    title: string;
    basePrice: number;
    targetPrice: number;
  }>({
    isOpen: false,
    itemType: "flight",
    itemId: "",
    title: "",
    basePrice: 0,
    targetPrice: 0,
  });

  const handleOpenPriceAlertModal = (
    itemType: "flight" | "stay" | "package",
    itemId: string,
    title: string,
    basePrice: number,
  ) => {
    setPriceAlertModal({
      isOpen: true,
      itemType,
      itemId,
      title,
      basePrice,
      targetPrice: Math.round(basePrice * 0.9),
    });
  };

  const handleSavePriceAlert = async () => {
    try {
      smartTrip.addPriceAlert({
        itemType: priceAlertModal.itemType,
        itemId: priceAlertModal.itemId,
        title: priceAlertModal.title,
        targetPrice: priceAlertModal.targetPrice,
        basePrice: priceAlertModal.basePrice,
      });

      await createPriceAlertFn({
        data: {
          itemType: priceAlertModal.itemType,
          itemId: priceAlertModal.itemId,
          title: priceAlertModal.title,
          targetPrice: priceAlertModal.targetPrice,
          basePrice: priceAlertModal.basePrice,
        },
      });

      setPriceAlertModal((prev) => ({ ...prev, isOpen: false }));
      toast.success("Price Alert Created!", {
        description: `We will notify you when ${priceAlertModal.title} drops below ₹${priceAlertModal.targetPrice.toLocaleString("en-IN")}.`,
      });
    } catch {
      toast.error("Failed to activate price alert.");
    }
  };

  // 1. Generate Deterministic Flights
  const generatedFlights = useMemo(() => {
    return generateFlights({
      originIata,
      destinationIata,
      date: departDate,
      travelers,
      cabinClass,
    });
  }, [originIata, destinationIata, departDate, travelers, cabinClass]);

  // Filter & Sort Flights
  const filteredFlights = useMemo(() => {
    let result = [...generatedFlights];

    // Filter max price
    result = result.filter((f) => f.price <= maxPrice);

    // Filter stops
    if (stopsFilter === "non-stop") {
      result = result.filter((f) => f.stopCount === 0);
    } else if (stopsFilter === "1-stop") {
      result = result.filter((f) => f.stopCount === 1);
    }

    // Filter time of day
    if (timeFilter === "morning") {
      result = result.filter((f) => f.departureTime >= "05:00" && f.departureTime < "12:00");
    } else if (timeFilter === "afternoon") {
      result = result.filter((f) => f.departureTime >= "12:00" && f.departureTime < "18:00");
    } else if (timeFilter === "evening") {
      result = result.filter((f) => f.departureTime >= "18:00");
    }

    // Filter airline
    if (selectedAirline !== "all") {
      result = result.filter((f) => f.airline === selectedAirline);
    }

    // Sort
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "duration") {
      result.sort((a, b) => a.durationMinutes - b.durationMinutes);
    } else if (sortBy === "departure") {
      result.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    }

    return result;
  }, [generatedFlights, maxPrice, stopsFilter, timeFilter, selectedAirline, sortBy]);

  // Filter Stays
  const filteredStays = useMemo(() => {
    const list = INVENTORY_STAYS.filter((s) => s.price <= maxPrice && s.rating >= minRating);
    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [maxPrice, minRating, sortBy]);

  // Filter Rentals
  const filteredRentals = useMemo(() => {
    const list = INVENTORY_RENTALS.filter((r) => r.price <= maxPrice && r.rating >= minRating);
    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [maxPrice, minRating, sortBy]);

  // Filter Transit
  const filteredTransit = useMemo(() => {
    const list = INVENTORY_TRANSIT.filter(
      (t) => t.classes[0]?.price && t.classes[0].price <= maxPrice,
    );
    return list;
  }, [maxPrice]);

  // Filter Packages
  const filteredPackages = useMemo(() => {
    const list = INVENTORY_PACKAGES.filter((p) => p.price <= maxPrice && p.rating >= minRating);
    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [maxPrice, minRating, sortBy]);

  const handleTabChange = (newTab: TabKey) => {
    setActiveTab(newTab);
    navigate({
      to: "/bookings",
      search: {
        ...search,
        tab: newTab,
      },
    });
  };

  const resetFilters = () => {
    setMaxPrice(50000);
    setStopsFilter("all");
    setTimeFilter("all");
    setSelectedAirline("all");
    setMinRating(0);
    setSortBy("departure");
  };

  const handleBookFlight = (flight: FlightOption) => {
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
        inventoryId: flight.id,
      },
    });
  };

  const handleBookStay = (stay: InventoryStay) => {
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
        inventoryId: stay.id,
      },
    });
  };

  const handleBookRental = (rental: InventoryRental) => {
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
        inventoryId: rental.id,
      },
    });
  };

  const handleBookTransit = (t: InventoryTransit) => {
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
        inventoryId: t.id,
      },
    });
  };

  const handleBookPackage = (pkg: InventoryPackage) => {
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
        inventoryId: pkg.id,
      },
    });
  };

  return (
    <>
      <Navbar />
      <PageHeader
        title="Book Everything"
        subtitle="Flights, stays, rentals, transit, and curated packages — simulated in a production-grade free demo environment."
      />

      <main className="container-page -mt-8 pb-16">
        {/* Top Search & Filter Bar */}
        <div className="surface-card p-5 sm:p-7 shadow-xl">
          {/* Tab Selection */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => handleTabChange(key)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all",
                  activeTab === key
                    ? "bg-gradient-brand text-primary-foreground shadow-soft"
                    : "bg-secondary text-secondary-foreground hover:bg-accent",
                )}
                data-testid={`bookings-tab-${key}`}
              >
                <Icon className="size-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Quick Filter & Search Bar for Flights */}
          {activeTab === "flights" && (
            <div className="mt-5 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-3 items-end">
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
                />
              </label>

              <div className="grid grid-cols-2 gap-2">
                <label className="rounded-2xl border border-border bg-surface px-3 py-2.5">
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

                <label className="rounded-2xl border border-border bg-surface px-3 py-2.5">
                  <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase block">
                    Class
                  </span>
                  <select
                    value={cabinClass}
                    onChange={(e) => setCabinClass(e.target.value as CabinClass)}
                    className="h-8 w-full border-0 bg-transparent text-xs font-semibold focus:outline-none capitalize"
                  >
                    <option value="economy">Economy</option>
                    <option value="premium_economy">Premium</option>
                    <option value="business">Business</option>
                  </select>
                </label>
              </div>

              <div className="flex items-center justify-between col-span-full md:col-span-1 pt-2 md:pt-0">
                <span className="text-xs text-muted-foreground font-semibold">
                  {filteredFlights.length} flights found
                </span>
                <span className="rounded-full bg-emerald-500/10 text-emerald-500 px-2.5 py-0.5 text-xs font-bold">
                  Live Programmatic Seed
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Content Layout with Left Filter Sidebar & Right Results Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column: Filter Sidebar */}
          <aside className="space-y-6">
            <div className="surface-card p-5 sticky top-24 space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2 font-display font-bold text-sm">
                  <SlidersHorizontal className="size-4 text-primary" /> Filter Results
                </div>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="size-3" /> Reset
                </button>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="w-full rounded-xl border border-border bg-surface p-2 text-xs font-semibold focus:outline-none"
                  data-testid="sort-dropdown"
                >
                  <option value="departure">Departure Time (Earliest)</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="duration">Flight Duration (Shortest)</option>
                  <option value="rating">Rating (Highest)</option>
                </select>
              </div>

              {/* Price Filter */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-muted-foreground">
                    Max Price
                  </span>
                  <span className="font-bold text-primary">{inr(maxPrice)}</span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={50000}
                  step={500}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                  data-testid="price-slider"
                />
              </div>

              {/* Flights Specific Filters */}
              {activeTab === "flights" && (
                <>
                  {/* Stops */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Stops
                    </label>
                    <div className="space-y-1.5">
                      {[
                        { key: "all", label: "All Flights" },
                        { key: "non-stop", label: "Non-Stop Only" },
                        { key: "1-stop", label: "1 Stop" },
                      ].map((s) => (
                        <button
                          key={s.key}
                          type="button"
                          onClick={() => setStopsFilter(s.key as typeof stopsFilter)}
                          className={cn(
                            "flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors",
                            stopsFilter === s.key
                              ? "bg-primary/10 text-primary font-bold"
                              : "text-muted-foreground hover:bg-secondary",
                          )}
                        >
                          <span>{s.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Departure Time */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Departure Time
                    </label>
                    <div className="grid grid-cols-2 gap-1.5 text-xs">
                      {[
                        { key: "all", label: "Anytime" },
                        { key: "morning", label: "06:00 - 12:00" },
                        { key: "afternoon", label: "12:00 - 18:00" },
                        { key: "evening", label: "18:00+" },
                      ].map((t) => (
                        <button
                          key={t.key}
                          type="button"
                          onClick={() => setTimeFilter(t.key as typeof timeFilter)}
                          className={cn(
                            "rounded-xl border p-2 text-center transition-colors",
                            timeFilter === t.key
                              ? "border-primary bg-primary/10 text-primary font-bold"
                              : "border-border text-muted-foreground hover:bg-secondary",
                          )}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Stays Rating Filter */}
              {(activeTab === "stay" || activeTab === "packages") && (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Guest Rating
                  </label>
                  <div className="space-y-1.5">
                    {[
                      { rating: 0, label: "All Ratings" },
                      { rating: 4.5, label: "4.5 & Above (Excellent)" },
                      { rating: 4.8, label: "4.8 & Above (Exceptional)" },
                    ].map((r) => (
                      <button
                        key={r.rating}
                        type="button"
                        onClick={() => setMinRating(r.rating)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors",
                          minRating === r.rating
                            ? "bg-primary/10 text-primary font-bold"
                            : "text-muted-foreground hover:bg-secondary",
                        )}
                      >
                        <span>{r.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Right Column: Result Cards */}
          <section className="lg:col-span-3 space-y-4">
            {/* Flights Results */}
            {activeTab === "flights" && (
              <>
                {filteredFlights.length === 0 ? (
                  <div className="surface-card py-16 text-center space-y-3">
                    <Plane className="mx-auto size-10 text-muted-foreground/40" />
                    <h3 className="font-display font-bold text-lg">
                      No Flights Match Your Filters
                    </h3>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                      Try raising the maximum price limit or resetting the stops and departure time
                      filters.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetFilters}
                      className="rounded-full"
                    >
                      Reset Filters
                    </Button>
                  </div>
                ) : (
                  filteredFlights.map((flight, index) => (
                    <div
                      key={flight.id}
                      className="surface-card p-5 sm:p-6 transition-all hover:border-primary/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                      data-testid={index === 0 ? "first-flight-card" : "flight-card"}
                    >
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <span className="rounded-lg bg-secondary px-2.5 py-1 text-xs font-mono font-bold text-foreground">
                            {flight.flightNumber}
                          </span>
                          <span className="font-display font-bold text-base text-foreground">
                            {flight.airline}
                          </span>
                          <span className="text-xs text-muted-foreground">· {flight.aircraft}</span>
                        </div>

                        <div className="flex items-center gap-6">
                          <div>
                            <span className="font-mono text-2xl font-black text-foreground">
                              {flight.departureTime}
                            </span>
                            <p className="text-xs text-muted-foreground font-semibold">
                              {flight.originIata} ({originAirport?.city || flight.originCity})
                            </p>
                          </div>

                          <div className="flex flex-col items-center px-2">
                            <span className="text-[11px] font-medium text-muted-foreground">
                              {flight.durationFormatted}
                            </span>
                            <div className="relative my-1 flex items-center w-24 sm:w-32">
                              <div className="h-0.5 w-full bg-border" />
                              <Plane className="size-3 text-primary absolute left-1/2 -translate-x-1/2 -rotate-90" />
                            </div>
                            <span
                              className={`text-[10px] font-bold ${
                                flight.stopCount === 0 ? "text-emerald-500" : "text-amber-500"
                              }`}
                            >
                              {flight.stops}
                            </span>
                          </div>

                          <div>
                            <span className="font-mono text-2xl font-black text-foreground">
                              {flight.arrivalTime}
                            </span>
                            <p className="text-xs text-muted-foreground font-semibold">
                              {flight.destinationIata} (
                              {destAirport?.city || flight.destinationCity})
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground pt-1">
                          <span className="flex items-center gap-1">
                            <Luggage className="size-3" /> {flight.baggage.cabin} cabin ·{" "}
                            {flight.baggage.checkIn} check-in
                          </span>
                          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                            <Leaf className="size-3" /> {flight.carbonKg} kg CO₂
                          </span>
                          <span className="text-amber-600 dark:text-amber-400 font-semibold">
                            Only {flight.seatsLeft} seats left
                          </span>
                        </div>
                      </div>

                      <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-border">
                        <div className="text-left md:text-right">
                          <div className="flex items-center gap-1.5 justify-start md:justify-end">
                            <span className="font-display text-2xl font-black text-primary">
                              {inr(flight.price)}
                            </span>
                            <span className="text-[10px] font-semibold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                              Demo pricing
                            </span>
                          </div>
                          <p className="text-[10px] text-muted-foreground">
                            Total for {travelers} traveler(s)
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="rounded-full h-8 text-xs gap-1"
                            onClick={() =>
                              handleOpenPriceAlertModal(
                                "flight",
                                `${flight.originIata}-${flight.destinationIata}`,
                                `Flight: ${flight.originIata} → ${flight.destinationIata}`,
                                flight.price,
                              )
                            }
                          >
                            <BellRing className="size-3 text-primary" /> Watch
                          </Button>
                          <Button
                            type="button"
                            variant="hero"
                            size="sm"
                            className="rounded-full px-5 gap-1.5 shadow-soft"
                            onClick={() => handleBookFlight(flight)}
                            data-testid="book-flight-btn"
                          >
                            Book Flight <ArrowRight className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}

            {/* Stays Results */}
            {activeTab === "stay" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredStays.map((stay) => (
                  <div
                    key={stay.id}
                    className="surface-card overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-48">
                        <img
                          src={stay.image}
                          alt={stay.name}
                          loading="lazy"
                          decoding="async"
                          className="size-full object-cover"
                        />
                        <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 text-xs font-semibold backdrop-blur-sm">
                          <Star className="size-3 fill-sunset text-sunset" /> {stay.rating} (
                          {stay.reviewsCount})
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase">
                          {stay.propertyType}
                        </span>
                        <h3 className="font-display font-bold text-base">{stay.name}</h3>
                        <p className="text-xs text-muted-foreground">{stay.location}</p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {stay.amenities.slice(0, 4).map((a) => (
                            <span
                              key={a}
                              className="rounded-md bg-secondary/60 px-2 py-0.5 text-[10px] text-muted-foreground"
                            >
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0 border-t border-border/60 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-display text-lg font-bold text-primary">
                            {inr(stay.price)}
                          </span>
                          <span className="text-[10px] font-semibold text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded-full border border-amber-500/20">
                            Demo pricing
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground"> / night</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="rounded-full h-8 px-2.5 text-xs gap-1"
                          onClick={() =>
                            handleOpenPriceAlertModal(
                              "stay",
                              stay.id,
                              `${stay.name} (${stay.location})`,
                              stay.price,
                            )
                          }
                        >
                          <BellRing className="size-3 text-primary" />
                        </Button>
                        <Button
                          type="button"
                          variant="hero"
                          size="sm"
                          className="rounded-full"
                          onClick={() => handleBookStay(stay)}
                        >
                          Reserve
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Rentals Results */}
            {activeTab === "rental" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredRentals.map((r) => (
                  <div
                    key={r.id}
                    className="surface-card overflow-hidden p-5 flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <img
                        src={r.image}
                        alt={r.name}
                        loading="lazy"
                        decoding="async"
                        className="h-40 w-full object-cover rounded-2xl mb-3"
                      />
                      <div className="flex items-center justify-between">
                        <h3 className="font-display font-bold text-base">{r.name}</h3>
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold">
                          {r.category}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{r.pickupLocation}</p>
                      <p className="text-xs text-muted-foreground font-medium mt-1">
                        {r.seats} Seats · {r.transmission} · {r.fuel}
                      </p>
                      <div className="mt-2 text-[11px] text-muted-foreground">
                        {r.included.join(" · ")}
                      </div>
                    </div>

                    <div className="border-t border-border/60 pt-3 flex items-center justify-between">
                      <div>
                        <span className="font-display text-lg font-bold text-primary">
                          {inr(r.price)}
                        </span>
                        <span className="text-[10px] text-muted-foreground"> / day</span>
                      </div>
                      <Button
                        type="button"
                        variant="hero"
                        size="sm"
                        className="rounded-full"
                        onClick={() => handleBookRental(r)}
                      >
                        Book Rental
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Transit Results */}
            {activeTab === "rail" && (
              <div className="space-y-4">
                {filteredTransit.map((t) => (
                  <div
                    key={t.id}
                    className="surface-card p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="rounded-lg bg-secondary px-2 py-0.5 text-xs font-mono font-bold">
                          {t.numberOrCode}
                        </span>
                        <h3 className="font-display font-bold text-base">{t.serviceName}</h3>
                        <span className="text-xs text-muted-foreground">({t.operator})</span>
                      </div>
                      <p className="text-sm text-foreground font-semibold">
                        {t.origin} → {t.destination} · {t.duration}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Departs: {t.departureTime} · Arrives: {t.arrivalTime} · Frequency:{" "}
                        {t.frequency}
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                      <div>
                        <span className="font-display text-xl font-bold text-primary">
                          {inr(t.classes[0]?.price || 1695)}
                        </span>
                        <span className="text-[10px] text-muted-foreground block text-right">
                          {t.classes[0]?.className || "AC Chair Car"}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="hero"
                        size="sm"
                        className="rounded-full"
                        onClick={() => handleBookTransit(t)}
                      >
                        Book Transit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Packages Results */}
            {activeTab === "packages" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="surface-card overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-48">
                        <img
                          src={pkg.image}
                          alt={pkg.name}
                          loading="lazy"
                          decoding="async"
                          className="size-full object-cover"
                        />
                        <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 text-xs font-semibold backdrop-blur-sm">
                          <Star className="size-3 fill-sunset text-sunset" /> {pkg.rating}
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase">
                          {pkg.durationDays}D / {pkg.durationNights}N Tour
                        </span>
                        <h3 className="font-display font-bold text-base leading-tight">
                          {pkg.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {pkg.highlights.join(" · ")}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-0 border-t border-border/60 flex items-center justify-between">
                      <div>
                        <span className="font-display text-lg font-bold text-primary">
                          {inr(pkg.price)}
                        </span>
                        <span className="text-[10px] text-muted-foreground"> / person</span>
                      </div>
                      <Button
                        type="button"
                        variant="hero"
                        size="sm"
                        className="rounded-full"
                        onClick={() => handleBookPackage(pkg)}
                      >
                        Book Package
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Price Alert Dialog */}
      {priceAlertModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-elevated space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <BellRing className="size-5" />
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-foreground">
                  Set Price Alert
                </h4>
                <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                  {priceAlertModal.title}
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Target Price (INR)</label>
              <Input
                type="number"
                value={priceAlertModal.targetPrice}
                onChange={(e) =>
                  setPriceAlertModal((prev) => ({
                    ...prev,
                    targetPrice: Number(e.target.value) || 0,
                  }))
                }
                className="rounded-xl h-10 text-sm font-semibold"
              />
              <p className="text-[11px] text-muted-foreground">
                Base price: ₹{priceAlertModal.basePrice.toLocaleString("en-IN")}. We will notify you
                when catalog fares fluctuate below your target.
              </p>
            </div>

            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-2.5 text-[11px] text-amber-700 dark:text-amber-300">
              <span className="font-bold">Demo pricing:</span> Simulated deterministic fluctuations
              run daily via GitHub Actions cron.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPriceAlertModal((prev) => ({ ...prev, isOpen: false }))}
                className="rounded-full"
              >
                Cancel
              </Button>
              <Button
                variant="hero"
                size="sm"
                onClick={handleSavePriceAlert}
                className="rounded-full"
              >
                Activate Alert
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <SupportDock />
    </>
  );
}
