import { useState } from "react";
import { ArrowRight, Calendar, Coins, PiggyBank, Target, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { initialFutureTrips, inr, type FutureTrip } from "@/data/travel";
import { cn } from "@/lib/utils";
import { Reveal, SectionHeading } from "./Reveal";

function FundCard({ trip }: { trip: FutureTrip }) {
  const progress = Math.min(100, Math.round((trip.saved / trip.target) * 100));
  const monthly = Math.max(0, Math.round((trip.target - trip.saved) / trip.monthsLeft));

  return (
    <article className="surface-card overflow-hidden">
      <div className="relative h-44 overflow-hidden">
        <img
          src={trip.image}
          alt={trip.name}
          loading="lazy"
          width={1024}
          height={768}
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
        <div className="absolute inset-x-4 bottom-4 text-primary-foreground">
          <p className="text-2xl">{trip.emoji}</p>
          <p className="font-display text-lg font-bold">{trip.name}</p>
          <p className="text-xs opacity-90">{trip.targetDate} · {trip.travelers} travelers</p>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Saved</p>
            <p className="font-display text-xl font-bold text-primary">{inr(trip.saved)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Target</p>
            <p className="font-semibold">{inr(trip.target)}</p>
          </div>
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-brand transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>{progress}% saved</span>
          <span className="flex items-center gap-1">
            <Coins className="size-3" /> {inr(monthly)}/mo
          </span>
        </div>
      </div>
    </article>
  );
}

export function TripFund() {
  const [trips, setTrips] = useState(initialFutureTrips);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");

  const addTrip = () => {
    const amount = Number(target);
    if (!name || !amount || amount < 1000) {
      toast.error("Enter a valid trip name and target amount");
      return;
    }
    setTrips((prev) => [
      {
        id: "ft" + Date.now(),
        emoji: "✈️",
        name,
        target: amount,
        saved: 0,
        targetDate: "Coming soon",
        monthsLeft: 12,
        travelers: 2,
        image: "/src/assets/dest-manali.jpg",
      },
      ...prev,
    ]);
    setName("");
    setTarget("");
    toast.success("Trip fund created", { description: "Start saving and we'll keep you on track." });
  };

  return (
    <section className="container-page py-24">
      <SectionHeading
        eyebrow="Save for your future trip"
        title="Make Your Dream Trip Real"
        subtitle="Dream trackers, not bank statements. Watch your savings grow and see when you'll be ready to go."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <Reveal className="surface-card p-6 lg:col-span-1">
          <div className="flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-sunrise text-sunset-foreground">
              <PiggyBank className="size-5" />
            </span>
            <div>
              <p className="font-display font-bold">Start a new dream</p>
              <p className="text-xs text-muted-foreground">Set a target and begin saving today.</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <label className="block text-xs font-semibold text-muted-foreground uppercase">
              Trip name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Santorini 2027"
            />
            <label className="block text-xs font-semibold text-muted-foreground uppercase">
              Target amount (₹)
            </label>
            <Input
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="80000"
              type="number"
            />
            <Button variant="hero" className="w-full" onClick={addTrip}>
              <Target /> Create Trip Fund
            </Button>
          </div>

          <div className="mt-6 rounded-2xl bg-secondary/50 p-4 text-sm text-muted-foreground">
            <p className="flex items-center gap-2 font-semibold text-foreground">
              <TrendingUp className="size-4" /> AI saving tip
            </p>
            <p className="mt-1">
              Save 20% of your monthly travel budget and you'll hit most domestic targets in under 6 months.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:col-span-2">
          {trips.map((trip, i) => (
            <Reveal key={trip.id} delay={i * 80}>
              <FundCard trip={trip} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
