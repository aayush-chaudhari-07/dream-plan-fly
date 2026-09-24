import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bus, Car, Hotel, Luggage, Plane, Star, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/smarttrip/Footer";
import { Navbar } from "@/components/smarttrip/Navbar";
import { PageHeader } from "@/components/smarttrip/PageHeader";
import { SupportDock } from "@/components/smarttrip/SupportDock";
import { flights, hotels, rentals, railBus, packages, inr } from "@/data/travel";
import { smartTrip } from "@/lib/smarttrip-store";
import { cn } from "@/lib/utils";

type TabKey = "flights" | "stay" | "rental" | "rail" | "packages";

const tabs: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }>; items: unknown[] }[] = [
  { key: "flights", label: "Flights", icon: Plane, items: flights },
  { key: "stay", label: "Hotels", icon: Hotel, items: hotels },
  { key: "rental", label: "Rentals", icon: Car, items: rentals },
  { key: "rail", label: "Train / Bus", icon: Bus, items: railBus },
  { key: "packages", label: "Packages", icon: Luggage, items: packages },
];

function ResultCard({ item, tab }: { item: unknown; tab: TabKey }) {
  const book = () => {
    const i = item as { airline?: string; operator?: string; name?: string; dep?: string; arr?: string; location?: string; region?: string; type?: string; price: number };
    const kind = tab === "flights" ? "flight" : tab === "stay" ? "stay" : tab === "rental" ? "rental" : tab === "rail" ? "rail" : "package";
    const b = smartTrip.addBooking({
      kind,
      title: i.name ?? `${i.airline ?? i.operator} · ${i.dep} → ${i.arr}`,
      subtitle: i.location ?? i.region ?? i.type ?? "Demo booking",
      price: i.price,
    });
    toast.success("Booked (demo)", { description: `Ref ${b.reference} · see My Trips` });
  };

  if (tab === "flights" || tab === "rail") {
    const i = item as { airline?: string; operator?: string; dep: string; arr: string; duration: string; stops?: string; price: number };
    return (
      <div className="surface-card flex flex-col justify-between p-5 sm:flex-row sm:items-center">
        <div>
          <p className="font-display font-bold">{i.airline || i.operator}</p>
          <p className="text-sm text-muted-foreground">
            {i.dep} → {i.arr} · {i.duration} {i.stops ? "· " + i.stops : ""}
          </p>
        </div>
        <div className="mt-3 flex items-center gap-4 sm:mt-0">
          <span className="font-display text-lg font-bold text-primary">{inr(i.price)}</span>
          <Button variant="hero" size="sm" className="rounded-full" onClick={book}>
            Book <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    );
  }

  if (tab === "stay") {
    const h = item as { name: string; location: string; rating: number; amenities: string[]; price: number; image: string };
    return (
      <div className="surface-card overflow-hidden">
        <div className="relative h-48">
          <img src={h.image} alt={h.name} loading="lazy" className="size-full object-cover" />
          <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 text-xs font-semibold">
            <Star className="size-3 fill-sunset text-sunset" /> {h.rating}
          </span>
        </div>
        <div className="p-4">
          <p className="font-display font-bold">{h.name}</p>
          <p className="text-sm text-muted-foreground">{h.location}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {h.amenities.map((a) => (
              <span key={a} className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
                {a}
              </span>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="font-display text-lg font-bold text-primary">{inr(h.price)}/night</span>
            <Button variant="hero" size="sm" className="rounded-full" onClick={book}>
              Book Now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (tab === "rental") {
    const r = item as { name: string; type: string; seats: number; price: number };
    return (
      <div className="surface-card p-5">
        <p className="font-display font-bold">{r.name}</p>
        <p className="text-sm text-muted-foreground">
          {r.type} · {r.seats} seats
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-display text-lg font-bold text-primary">{inr(r.price)}/day</span>
          <Button variant="hero" size="sm" className="rounded-full" onClick={book}>
            Reserve
          </Button>
        </div>
      </div>
    );
  }

  if (tab === "packages") {
    const k = item as { name: string; region: string; nights: number; includes: string[]; price: number; image: string };
    return (
      <div className="surface-card overflow-hidden">
        <img src={k.image} alt={k.name} loading="lazy" className="h-44 w-full object-cover" />
        <div className="p-4">
          <p className="font-display font-bold">{k.name}</p>
          <p className="text-sm text-muted-foreground">{k.region} · {k.nights} nights</p>
          <p className="mt-2 text-xs text-muted-foreground">{k.includes.join(" · ")}</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="font-display text-lg font-bold text-primary">{inr(k.price)}</span>
            <Button variant="hero" size="sm" className="rounded-full" onClick={book}>Book</Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export const Route = createFileRoute("/bookings")({
  head: () => ({
    meta: [
      { title: "Bookings — SmartTrip" },
      { name: "description", content: "Book flights, hotels, car rentals, trains and curated travel packages on SmartTrip." },
      { property: "og:title", content: "Bookings — SmartTrip" },
      { property: "og:description", content: "Book flights, hotels, car rentals, trains and curated travel packages on SmartTrip." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BookingsPage,
});

function BookingsPage() {
  const [tab, setTab] = useState<TabKey>("flights");
  const current = tabs.find((t) => t.key === tab) ?? tabs[0]!;

  return (
    <>
      <Navbar />
      <PageHeader
        title="Book Everything"
        subtitle="Flights, hotels, rentals, trains and packages — search, compare and book your whole trip in one place."
      />
      <main className="container-page -mt-8">
        <div className="surface-card overflow-hidden p-5">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all",
                  tab === key
                    ? "bg-gradient-brand text-primary-foreground shadow-soft"
                    : "bg-secondary text-secondary-foreground hover:bg-accent",
                )}
              >
                <Icon className="size-4" />
                {label}
              </button>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {current.label === "Packages" ? packages.length : current.items.length} results
            </p>
            <span className="rounded-full bg-sunset/20 px-3 py-1 text-xs font-semibold text-foreground">
              Demo data · not a live API
            </span>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {current.items.length === 0 ? (
              <div className="col-span-full rounded-2xl bg-secondary/50 py-12 text-center text-sm text-muted-foreground">
                Packages coming soon — ask the AI planner to build a custom one for now.
              </div>
            ) : (
              current.items.map((item, i) => <ResultCard key={i} item={item} tab={tab} />)
            )}
          </div>
        </div>
      </main>
      <Footer />
      <SupportDock />
    </>
  );
}
