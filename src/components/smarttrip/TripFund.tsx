import { useState } from "react";
import confetti from "canvas-confetti";
import {
  AlertCircle,
  Coins,
  History,
  Pencil,
  PiggyBank,
  Plus,
  RefreshCw,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { inr, type FutureTrip } from "@/data/travel";
import { smartTrip, useSmartTrip, type FundContribution } from "@/lib/smarttrip-store";
import { Reveal, SectionHeading } from "./Reveal";

const QUICK_ADD = [500, 1000, 2500, 5000];

function FundCard({ trip }: { trip: FutureTrip }) {
  const [amount, setAmount] = useState("");
  const [contributeOpen, setContributeOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState(trip.name);
  const [editTarget, setEditTarget] = useState(trip.target.toString());
  const [editDate, setEditDate] = useState(trip.targetDate);
  const [editMonths, setEditMonths] = useState(trip.monthsLeft.toString());
  const [editTravelers, setEditTravelers] = useState(trip.travelers.toString());

  const progress = Math.min(100, Math.round((trip.saved / trip.target) * 100));
  const monthly = Math.max(
    0,
    Math.round((trip.target - trip.saved) / Math.max(1, trip.monthsLeft)),
  );
  const done = trip.saved >= trip.target;

  const triggerCelebration = () => {
    confetti({
      particleCount: 120,
      spread: 75,
      origin: { y: 0.6 },
      colors: ["#38bdf8", "#818cf8", "#f43f5e", "#fbbf24", "#34d399"],
    });
  };

  const contribute = (value: number) => {
    if (!value || isNaN(value)) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (value < 100) {
      toast.error("Minimum deposit is ₹100");
      return;
    }
    if (value > 10_000_000) {
      toast.error("Deposit amount exceeds single transaction limit (₹1,00,00,000)");
      return;
    }

    const res = smartTrip.contribute(trip.id, value);
    setAmount("");

    if (res.done) {
      triggerCelebration();
      toast.success(`🎉 100% Goal Reached for ${trip.name}!`, {
        description: `You've saved ${inr(trip.target)}. Time to book your flight!`,
      });
    } else if (res.milestone) {
      toast.success(`🎯 ${res.milestone}% Milestone Reached!`, {
        description: `${inr(value)} added. Total saved: ${inr(res.newSaved)} of ${inr(trip.target)}.`,
      });
    } else {
      toast.success(`${inr(value)} added to ${trip.name}`, {
        description: `${inr(Math.max(0, trip.target - trip.saved - value))} remaining to target.`,
      });
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTarget = Number(editTarget);
    const newMonths = Number(editMonths);
    const newTravelers = Number(editTravelers);

    if (!editName.trim()) {
      toast.error("Please enter a fund name");
      return;
    }
    if (isNaN(newTarget) || newTarget < 1000) {
      toast.error("Target must be at least ₹1,000");
      return;
    }
    if (newTarget > 100_000_000) {
      toast.error("Target exceeds maximum allowed ₹10,00,00,000");
      return;
    }

    smartTrip.editFund(trip.id, {
      name: editName.trim(),
      target: newTarget,
      targetDate: editDate.trim() || "Flexible date",
      monthsLeft: Math.max(1, newMonths || 12),
      travelers: Math.max(1, newTravelers || 2),
    });

    setEditOpen(false);
    toast.success("Fund updated successfully");
  };

  const handleDelete = () => {
    smartTrip.removeFund(trip.id);
    setDeleteOpen(false);
    toast.message("Trip fund removed", { description: trip.name });
  };

  const contributions = smartTrip.getFundContributions(trip.id);

  return (
    <>
      <article
        className="surface-card overflow-hidden rounded-3xl border border-border/70 flex flex-col justify-between"
        data-testid={`fund-card-${trip.id}`}
      >
        <div className="relative h-44 overflow-hidden">
          <img
            src={trip.image}
            alt={trip.name}
            loading="lazy"
            decoding="async"
            width={1024}
            height={768}
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />

          {/* Action buttons on cover */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <button
              type="button"
              aria-label={`View deposit history for ${trip.name}`}
              onClick={() => setHistoryOpen(true)}
              className="flex size-8 items-center justify-center rounded-full bg-card/85 text-foreground/80 backdrop-blur transition-transform hover:scale-110 hover:text-primary cursor-pointer shadow-soft"
              title="Deposit History"
            >
              <History className="size-3.5" />
            </button>
            <button
              type="button"
              aria-label={`Edit ${trip.name} fund`}
              onClick={() => setEditOpen(true)}
              className="flex size-8 items-center justify-center rounded-full bg-card/85 text-foreground/80 backdrop-blur transition-transform hover:scale-110 hover:text-primary cursor-pointer shadow-soft"
              title="Edit Fund"
            >
              <Pencil className="size-3.5" />
            </button>
            <button
              type="button"
              aria-label={`Delete ${trip.name} fund`}
              onClick={() => setDeleteOpen(true)}
              className="flex size-8 items-center justify-center rounded-full bg-card/85 text-foreground/80 backdrop-blur transition-transform hover:scale-110 hover:text-destructive cursor-pointer shadow-soft"
              title="Delete Fund"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>

          <div className="absolute inset-x-4 bottom-4 text-primary-foreground">
            <p className="text-2xl">{trip.emoji}</p>
            <p className="font-display text-lg font-bold">{trip.name}</p>
            <p className="text-xs opacity-90">
              {trip.targetDate} · {trip.travelers} {trip.travelers === 1 ? "traveler" : "travelers"}
            </p>
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Saved</p>
                <p className="font-display text-xl font-bold text-primary">{inr(trip.saved)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground font-medium">Target Goal</p>
                <p className="font-semibold text-foreground">{inr(trip.target)}</p>
              </div>
            </div>

            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-brand transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span className={done ? "text-emerald-600 font-bold" : "font-medium"}>
                {done ? "🎉 100% Goal Reached!" : `${progress}% saved`}
              </span>
              <span className="flex items-center gap-1 font-medium">
                <Coins className="size-3 text-amber-500" /> {inr(monthly)}/mo
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-semibold text-muted-foreground">Quick Deposits:</p>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2.5 text-xs rounded-full gap-1"
                data-testid="trip-fund-open"
                onClick={() => setContributeOpen(true)}
              >
                <PiggyBank className="size-3" /> Contribute
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_ADD.map((v) => (
                <button
                  key={v}
                  type="button"
                  data-testid={`trip-fund-quick-${v}`}
                  onClick={() => contribute(v)}
                  className="rounded-full border border-border px-3 py-1 text-xs font-semibold transition-colors hover:border-primary hover:text-primary hover:bg-primary/5 cursor-pointer"
                >
                  +{inr(v)}
                </button>
              ))}
            </div>

            <div className="mt-3 flex gap-2">
              <Input
                value={amount}
                type="number"
                min="100"
                max="10000000"
                inputMode="numeric"
                placeholder="Custom deposit (₹)"
                aria-label={`Add money to ${trip.name}`}
                className="rounded-xl h-9 text-xs"
                onChange={(e) => setAmount(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    contribute(Number(amount));
                  }
                }}
              />
              <Button
                variant="hero"
                size="sm"
                className="rounded-xl h-9 px-3 shrink-0 gap-1"
                aria-label="Add deposit"
                data-testid="contribute-submit"
                onClick={() => contribute(Number(amount))}
              >
                <Plus className="size-3.5" /> Deposit
              </Button>
            </div>
          </div>
        </div>
      </article>

      {/* Contribute Fund Dialog */}
      <Dialog open={contributeOpen} onOpenChange={setContributeOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl" data-testid="trip-fund-dialog">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Contribute to {trip.name}</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Add savings towards your target goal of {inr(trip.target)}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Amount (₹)</label>
              <Input
                type="number"
                min="100"
                max="10000000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 5000"
                className="rounded-xl text-sm"
                data-testid="contribute-input"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {QUICK_ADD.map((v) => (
                <Button
                  key={v}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs h-8"
                  onClick={() => setAmount(v.toString())}
                >
                  +{inr(v)}
                </Button>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setContributeOpen(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              variant="hero"
              size="sm"
              className="rounded-xl gap-1.5"
              data-testid="contribute-dialog-submit"
              onClick={() => {
                contribute(Number(amount) || 1000);
                setContributeOpen(false);
              }}
            >
              <PiggyBank className="size-3.5" /> Contribute Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Fund Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Edit Trip Fund Goal</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Modify the target budget, destination name, or duration for {trip.name}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Fund Name</label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="rounded-xl text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Target Budget (₹)</label>
                <Input
                  type="number"
                  min="1000"
                  value={editTarget}
                  onChange={(e) => setEditTarget(e.target.value)}
                  className="rounded-xl text-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Target Date</label>
                <Input
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  placeholder="e.g. Oct 2027"
                  className="rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Months Left</label>
                <Input
                  type="number"
                  min="1"
                  max="120"
                  value={editMonths}
                  onChange={(e) => setEditMonths(e.target.value)}
                  className="rounded-xl text-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Travelers</label>
                <Input
                  type="number"
                  min="1"
                  max="50"
                  value={editTravelers}
                  onChange={(e) => setEditTravelers(e.target.value)}
                  className="rounded-xl text-sm"
                  required
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" variant="hero" className="rounded-xl text-xs">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Contribution History Dialog */}
      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <History className="size-4 text-primary" />
              Deposit History — {trip.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Total accumulated savings: <strong className="text-primary">{inr(trip.saved)}</strong>{" "}
              of {inr(trip.target)}.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-72 overflow-y-auto divide-y divide-border/40 py-2">
            {contributions.length === 0 ? (
              <div className="text-center py-8 text-xs text-muted-foreground">
                <Coins className="size-8 mx-auto mb-2 text-muted-foreground/50" />
                No deposits logged yet for this trip fund.
              </div>
            ) : (
              contributions.map((c) => (
                <div key={c.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-foreground">{c.note || "Deposit"}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(c.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    +{inr(c.amount)}
                  </span>
                </div>
              ))
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setHistoryOpen(false)}
              className="rounded-xl text-xs w-full"
            >
              Close History
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-destructive flex items-center gap-2">
              <Trash2 className="size-4" />
              Delete Trip Fund?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Are you sure you want to delete your <strong>{trip.name}</strong> savings fund? This
              will remove the fund and its deposit log.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 pt-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              className="rounded-xl text-xs"
            >
              Delete Fund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function TripFund() {
  const { funds, isLoading, isError, refetch } = useSmartTrip();
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [targetDate, setTargetDate] = useState("");

  const totalSaved = funds.reduce((sum, f) => sum + f.saved, 0);
  const totalTarget = funds.reduce((sum, f) => sum + f.target, 0);

  const addTrip = () => {
    const amount = Number(target);
    if (!name.trim()) {
      toast.error("Please enter a trip name");
      return;
    }
    if (!amount || isNaN(amount) || amount < 1000) {
      toast.error("Enter a target amount of at least ₹1,000");
      return;
    }
    if (amount > 100_000_000) {
      toast.error("Target amount cannot exceed ₹10,00,00,000");
      return;
    }

    smartTrip.addFund({
      name: name.trim(),
      target: amount,
      travelers: 2,
      monthsLeft: 12,
    });

    setName("");
    setTarget("");
    setTargetDate("");
    toast.success("Trip fund created!", {
      description: "Start saving and we'll keep you on track.",
    });
  };

  return (
    <section id="fund" className="container-page py-24" data-testid="trip-fund-section">
      <SectionHeading
        eyebrow="Save for your future trip"
        title="Make Your Dream Trip Real"
        subtitle="Dream trackers, not bank statements. Watch your savings grow, celebrate milestones, and see when you'll be ready to take off."
      />

      {isError && (
        <div className="mt-8 rounded-3xl border border-destructive/20 bg-destructive/10 p-6 text-center">
          <AlertCircle className="size-8 text-destructive mx-auto mb-2" />
          <p className="font-display font-semibold text-foreground">Could not load trip funds</p>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            Failed to fetch your saved trip funds from the server.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch?.()}
            className="rounded-full gap-2"
          >
            <RefreshCw className="size-3.5" /> Retry
          </Button>
        </div>
      )}

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <Reveal className="surface-card p-6 lg:col-span-1 rounded-3xl border border-border/70 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-sunrise text-sunset-foreground shadow-soft">
                <PiggyBank className="size-5" />
              </span>
              <div>
                <p className="font-display font-bold text-foreground">Start a new dream</p>
                <p className="text-xs text-muted-foreground">
                  Set a target and begin saving today.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div>
                <label
                  className="block text-xs font-semibold text-muted-foreground uppercase mb-1"
                  htmlFor="fund-name"
                >
                  Trip name
                </label>
                <Input
                  id="fund-name"
                  value={name}
                  placeholder="e.g. Swiss Alps Winter 2027"
                  className="rounded-xl text-sm"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label
                  className="block text-xs font-semibold text-muted-foreground uppercase mb-1"
                  htmlFor="fund-target"
                >
                  Target amount (₹)
                </label>
                <Input
                  id="fund-target"
                  type="number"
                  min="1000"
                  max="100000000"
                  inputMode="numeric"
                  placeholder="e.g. 150000"
                  className="rounded-xl text-sm"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border/50">
            <Button variant="hero" className="w-full rounded-2xl gap-2" onClick={addTrip}>
              <Plus className="size-4" /> Create Dream Fund
            </Button>

            <div className="mt-5 space-y-1.5 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Total Dreams Tracked:</span>
                <strong className="text-foreground">{funds.length}</strong>
              </div>
              <div className="flex justify-between">
                <span>Total Accumulated:</span>
                <strong className="text-primary font-bold">{inr(totalSaved)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Overall Target:</span>
                <strong className="text-foreground">{inr(totalTarget)}</strong>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:col-span-2">
          {isLoading &&
            Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="surface-card overflow-hidden rounded-3xl border border-border/70 p-5 space-y-4"
              >
                <Skeleton className="h-40 w-full rounded-2xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-9 w-full rounded-xl" />
              </div>
            ))}

          {!isLoading &&
            funds.map((f, i) => (
              <Reveal key={f.id} delay={i * 60}>
                <FundCard trip={f} />
              </Reveal>
            ))}
        </div>
      </div>
    </section>
  );
}
