import { useState } from "react";
import { Bus, Car, Hotel, Luggage, Plane, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

type TabKey = "flights" | "stay" | "rental" | "rail" | "packages";

const tabs: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "flights", label: "Flights", icon: Plane },
  { key: "stay", label: "Stay", icon: Hotel },
  { key: "rental", label: "Car / Bike Rental", icon: Car },
  { key: "rail", label: "Train / Bus", icon: Bus },
  { key: "packages", label: "Packages", icon: Luggage },
];

const fieldsByTab: Record<TabKey, { label: string; placeholder: string; type?: string }[]> = {
  flights: [
    { label: "From", placeholder: "Delhi (DEL)" },
    { label: "To", placeholder: "Goa (GOI)" },
    { label: "Departure", placeholder: "12 Dec" },
    { label: "Return", placeholder: "17 Dec" },
    { label: "Travelers", placeholder: "2", type: "number" },
    { label: "Class", placeholder: "Economy" },
  ],
  stay: [
    { label: "Destination", placeholder: "Manali" },
    { label: "Check-in", placeholder: "12 Dec" },
    { label: "Check-out", placeholder: "17 Dec" },
    { label: "Guests", placeholder: "2", type: "number" },
    { label: "Rooms", placeholder: "1", type: "number" },
  ],
  rental: [
    { label: "Location", placeholder: "Leh" },
    { label: "Pick-up", placeholder: "12 Dec, 10:00" },
    { label: "Return", placeholder: "15 Dec, 18:00" },
    { label: "Vehicle type", placeholder: "SUV / Bike" },
  ],
  rail: [
    { label: "From", placeholder: "Pune" },
    { label: "To", placeholder: "Goa" },
    { label: "Date", placeholder: "12 Dec" },
    { label: "Travelers", placeholder: "2", type: "number" },
  ],
  packages: [
    { label: "Destination", placeholder: "Kashmir" },
    { label: "Month", placeholder: "January" },
    { label: "Nights", placeholder: "5", type: "number" },
    { label: "Travelers", placeholder: "3", type: "number" },
    { label: "Budget", placeholder: "₹60,000" },
  ],
};

const ctaByTab: Record<TabKey, string> = {
  flights: "Search Flights",
  stay: "Search Hotels",
  rental: "Search Rentals",
  rail: "Search",
  packages: "Search Packages",
};

export function QuickBooking({ onSearch }: { onSearch?: (tab: TabKey) => void }) {
  const [tab, setTab] = useState<TabKey>("flights");

  return (
    <section className="relative -mt-24">
      <div className="container-page">
        <Reveal className="surface-card overflow-hidden p-5 sm:p-7">
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
              >
                <Icon className="size-4" />
                {label}
              </button>
            ))}
          </div>

          <form
            key={tab}
            className="mt-5 grid animate-fade-in gap-3 md:grid-cols-3 lg:grid-cols-4"
            onSubmit={(e) => {
              e.preventDefault();
              onSearch?.(tab);
              toast.success(ctaByTab[tab], { description: "Showing live demo results below." });
            }}
          >
            {fieldsByTab[tab].map((field) => (
              <label
                key={field.label}
                className="rounded-2xl border border-border bg-surface px-4 py-2.5 transition-colors focus-within:border-primary"
              >
                <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                  {field.label}
                </span>
                <Input
                  type={field.type ?? "text"}
                  placeholder={field.placeholder}
                  className="h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                />
              </label>
            ))}
            <Button type="submit" variant="hero" size="xl" className="md:col-span-1">
              <Search /> {ctaByTab[tab]}
            </Button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
