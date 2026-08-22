import { useState } from "react";
import { Coins, PiggyBank, Plus, Target, Trash2, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { inr, type FutureTrip } from "@/data/travel";
import { smartTrip, useSmartTrip } from "@/lib/smarttrip-store";
import { Reveal, SectionHeading } from "./Reveal";

const QUICK_ADD = [500, 1000, 2500];

function FundCard({ trip }: { trip: FutureTrip }) {
  const [amount, setAmount] = useState("");
  const progress = Math.min(100, Math.round((trip.saved / trip.target) * 100));
  const monthly = Math.max(0, Math.round((trip.target - trip.saved) / Math.max(1, trip.monthsLeft)));
  const done = trip.saved >= trip.target;

  const contribute = (value: number) => {
    if (!value || value <= 0) {
      toast.error("Enter an amount to add");
      return;
    }
    smartTrip.contribute(trip.id, value);
    setAmount("");
    toast.success(`${inr(value)} added to ${trip.name}`, {
      description: done ? "Goal already reached!" : `${inr(Math.max(0, trip.target - trip.saved - value))} to go.`,
    });
  };

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
        <button
          type="button"
          aria-label={`Delete ${trip.name} fund`}
          onClick={() => {
            smartTrip.removeFund(trip.id);
            toast.message("Trip fund removed", { description: trip.name });
          }}
          className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-card/85 text-foreground/70 backdrop-blur transition-transform hover:scale-110 hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </button>
        <div className="absolute inset-x-4 bottom-4 text-primary-foreground">
          <p className="text-2xl">{trip.emoji}</p>
          <p className="font-display text-lg font-bold">{trip.name}</p>
          <p className="text-xs opacity-90">
            {trip.targetDate} · {trip.travelers} travelers
          </p>
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
          <span>{done ? "🎉 Goal reached — time to book!" : `${progress}% saved`}</span>
          <span className="flex items-center gap-1">
            <Coins className="size-3" /> {inr(monthly)}/mo
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {QUICK_ADD.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => contribute(v)}
              className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold transition-colors hover:border-primary hover:text-primary"
            >
              +{inr(v)}
            </button>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <Input
            value={amount}
            type="number"
            inputMode="numeric"
            placeholder="Custom amount"
            aria-label={`Add money to ${trip.name}`}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Button variant="soft" size="icon" aria-label="Add money" onClick={() => contribute(Number(amount))}>
            <Plus />
          </Button>
        </div>
      </div>
    </article>
  );
}

export function TripFund() {
  const { funds } = useSmartTrip();
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");

  const totalSaved = funds.reduce((sum, f) => sum + f.saved, 0);
  const totalTarget = funds.reduce((sum, f) => sum + f.target, 0);

  const addTrip = () => {
    const amount = Number(target);
    if (!name.trim() || !amount || amount < 1000) {
      toast.error("Enter a trip name and a target of at least ₹1,000");
      return;
    }
    smartTrip.addFund({ name: name.trim(), target: amount });
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
            <label className="block text-xs font-semibold text-muted-foreground uppercase" htmlFor="fund-name">
              Trip name
            </label>
            <Input
              id="fund-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Santorini 2027"
            />
            <label className="block text-xs font-semibold text-muted-foreground uppercase" htmlFor="fund-target">
              Target amount (₹)
            </label>
            <Input
              id="fund-target"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="80000"
              type="number"
            />
            <Button variant="hero" className="w-full" onClick={addTrip}>
              <Target /> Create Trip Fund
            </Button>
          </div>

          <div className="mt-6 rounded-2xl bg-secondary/50 p-4 text-sm">
            <p className="flex items-center justify-between font-semibold text-foreground">
              <span>Total saved</span>
              <span className="text-primary">{inr(totalSaved)}</span>
            </p>
            <p className="mt-1 flex items-center justify-between text-muted-foreground">
              <span>Across {funds.length} funds</span>
              <span>of {inr(totalTarget)}</span>
            </p>
          </div>

          <div className="mt-4 rounded-2xl bg-secondary/50 p-4 text-sm text-muted-foreground">
            <p className="flex items-center gap-2 font-semibold text-foreground">
              <TrendingUp className="size-4" /> AI saving tip
            </p>
            <p className="mt-1">
              Save 20% of your monthly travel budget and you'll hit most domestic targets in under 6 months.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:col-span-2">
          {funds.length === 0 ? (
            <div className="col-span-full rounded-3xl bg-secondary/50 py-16 text-center text-sm text-muted-foreground">
              No trip funds yet — create your first dream on the left.
            </div>
          ) : (
            funds.map((trip, i) => (
              <Reveal key={trip.id} delay={i * 80}>
                <FundCard trip={trip} />
              </Reveal>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
