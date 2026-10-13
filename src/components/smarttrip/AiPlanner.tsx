import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  BookmarkPlus,
  Bot,
  Coins,
  Download,
  Flame,
  Leaf,
  Loader2,
  RefreshCw,
  Send,
  Share2,
  Sparkles,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { quickPrompts, inr } from "@/data/travel";
import { smartTrip } from "@/lib/smarttrip-store";
import { buildPlan, type GeneratedPlan, type PlanOptions } from "@/lib/trip-plan";
import { cn } from "@/lib/utils";
import { generatePlan, savePublicPlanFn } from "@/server/generate-plan";
import { Reveal, SectionHeading } from "./Reveal";

const LOADING_STEPS = [
  "Analyzing destination & travel dates…",
  "Consulting Gemini 2.5 Flash travel intelligence…",
  "Designing paced daily routes & local culinary picks…",
  "Balancing realistic INR budget & carbon footprint…",
];

export function AiPlanner({ compact = false }: { compact?: boolean }) {
  const [input, setInput] = useState(
    "I want a 5-day trip to Himachal Pradesh for 3 people under ₹35,000.",
  );
  const [plan, setPlan] = useState<GeneratedPlan>(() =>
    buildPlan("I want a 5-day trip to Himachal Pradesh for 3 people under ₹35,000."),
  );
  const [isSample, setIsSample] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);
  const [source, setSource] = useState<"gemini" | "fallback">("fallback");
  const [error, setError] = useState<string | null>(null);

  const stepInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (stepInterval.current) clearInterval(stepInterval.current);
    };
  }, []);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    if (q) {
      setInput(q);
      setPlan(buildPlan(q));
      setIsSample(false);
    }
  }, []);

  const run = async (
    opts?: PlanOptions & { instruction?: string; currentPlan?: GeneratedPlan },
  ) => {
    setLoading(true);
    setError(null);
    setLoadingStepIdx(0);

    if (stepInterval.current) clearInterval(stepInterval.current);
    stepInterval.current = setInterval(() => {
      setLoadingStepIdx((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 1200);

    try {
      const response = await generatePlan({
        data: {
          prompt: input,
          ...(opts?.budget !== undefined ? { budget: opts.budget } : {}),
          ...(opts?.days !== undefined ? { days: opts.days } : {}),
          ...(opts?.travelers !== undefined ? { travelers: opts.travelers } : {}),
          ...(opts?.instruction !== undefined ? { instruction: opts.instruction } : {}),
          ...(opts?.currentPlan !== undefined ? { currentPlan: opts.currentPlan } : {}),
        },
      });

      setPlan(response.plan);
      setSource(response.source);
      setIsSample(false);

      if (response.source === "gemini") {
        toast.success("Itinerary generated with Gemini 2.5 Flash!");
      } else {
        toast.info("Itinerary ready (SmartTrip Engine)", {
          description: response.note || "Fallback plan created with realistic estimates.",
        });
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to generate AI plan. Using offline fallback.";
      console.warn("AI generation failed:", message);
      setError(message);

      // Graceful fallback to rule-based engine so the user isn't stranded
      const fallbackPlan = buildPlan(input, opts);
      setPlan(fallbackPlan);
      setSource("fallback");
      setIsSample(false);
      toast.error("AI service error", {
        description: message + " Displaying offline plan.",
      });
    } finally {
      if (stepInterval.current) clearInterval(stepInterval.current);
      setLoading(false);
    }
  };

  return (
    <section id="ai" className={cn("container-page", compact ? "py-10" : "py-24")}>
      {!compact ? (
        <SectionHeading
          eyebrow="Ask AI"
          title="Meet Your AI Travel Planner"
          subtitle="Tell us your dream trip. SmartTrip & Google Gemini will craft your perfect itinerary."
        />
      ) : null}

      <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Reveal className="surface-card bg-gradient-sky p-6 sm:p-7">
          <div className="flex items-center gap-3">
            <span className="relative flex size-11 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-sm">
              <Bot className="size-5" />
              <span className="animate-pulse-ring absolute inset-0 rounded-2xl border border-primary" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-display font-bold">SmartTrip AI</p>
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary/20 text-[10px] px-1.5 py-0"
                >
                  <Sparkles className="size-2.5 mr-1" /> Gemini Powered
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {loading ? LOADING_STEPS[loadingStepIdx] : "Online · Flash intelligence in seconds"}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-3xl bg-card/80 p-4 shadow-soft border border-border/40">
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
              <span>Your Trip Prompt</span>
              <span
                className={cn(input.length > 900 ? "text-destructive" : "text-muted-foreground/70")}
              >
                {input.length}/1000
              </span>
            </div>
            <Textarea
              value={input}
              maxLength={1000}
              onChange={(e) => setInput(e.target.value)}
              rows={3}
              className="mt-1 resize-none border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
              aria-label="Describe your trip"
              placeholder="E.g., I want a 5-day trip to Himachal Pradesh for 3 people under ₹35,000 with trekking and local cafes..."
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {quickPrompts.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setInput(`Plan a ${q.toLowerCase()} for 2 people under ₹30,000.`)}
                className="rounded-full border border-border bg-card/70 px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary hover:text-primary"
              >
                {q}
              </button>
            ))}
          </div>

          {error ? (
            <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
              <div className="flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span className="truncate">{error}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs text-destructive hover:bg-destructive/20"
                onClick={() => run()}
              >
                Retry
              </Button>
            </div>
          ) : null}

          <Button
            variant="hero"
            size="xl"
            className="mt-5 w-full gap-2"
            onClick={() => run()}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Generating Itinerary…
              </>
            ) : (
              <>
                <Wand2 className="size-4" />
                Generate My Trip
              </>
            )}
          </Button>
        </Reveal>

        <Reveal delay={80} className="surface-card p-6 sm:p-7">
          {loading ? (
            <PlanSkeleton message={LOADING_STEPS[loadingStepIdx] ?? "Crafting itinerary…"} />
          ) : (
            <PlanView
              plan={plan}
              sample={isSample}
              prompt={input}
              source={source}
              loading={loading}
              onReplan={(opts) => run(opts)}
              onRefine={(instruction, opts) => run({ ...opts, instruction, currentPlan: plan })}
            />
          )}
        </Reveal>
      </div>
    </section>
  );
}

function PlanSkeleton({ message }: { message: string }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4">
        <Loader2 className="size-5 animate-spin text-primary shrink-0" />
        <div className="flex-1">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider">
            AI Crafting Your Plan
          </p>
          <p className="text-sm font-medium text-foreground transition-all duration-300">
            {message}
          </p>
        </div>
      </div>
      <div className="h-7 w-2/3 animate-pulse rounded-full bg-muted" />
      <div className="h-4 w-full animate-pulse rounded-full bg-muted" />
      <div className="h-4 w-5/6 animate-pulse rounded-full bg-muted" />
      <div className="mt-6 grid gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-2xl bg-muted/60" />
        ))}
      </div>
    </div>
  );
}

function PlanView({
  plan,
  sample,
  prompt,
  source,
  loading,
  onReplan,
  onRefine,
}: {
  plan: GeneratedPlan;
  sample: boolean;
  prompt: string;
  source: "gemini" | "fallback";
  loading: boolean;
  onReplan: (o: PlanOptions) => void;
  onRefine: (instruction: string, o?: PlanOptions) => void;
}) {
  const [budget, setBudget] = useState(plan.budget);
  const [days, setDays] = useState(plan.days.length);
  const [travelers, setTravelers] = useState(plan.travelers);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    setBudget(plan.budget);
    setDays(plan.days.length);
    setTravelers(plan.travelers);
  }, [plan]);

  const share = async () => {
    setSharing(true);
    try {
      const res = await savePublicPlanFn({ data: { plan } });
      const publicUrl = `${window.location.origin}/plan/${res.id}`;

      if (navigator.share) {
        try {
          await navigator.share({ title: plan.title, url: publicUrl });
          toast.success("Plan shared!");
          return;
        } catch {
          // User dismissed or share failed, fallback to copy
        }
      }

      await navigator.clipboard.writeText(publicUrl);
      toast.success("Public share link copied!", {
        description: "Anyone with this link can view your itinerary at /plan/" + res.id,
      });
    } catch (err) {
      console.error("Public share failed:", err);
      const fallbackUrl = `${window.location.origin}/ai-planner?q=${encodeURIComponent(prompt)}`;
      try {
        await navigator.clipboard.writeText(fallbackUrl);
        toast.success("Share link copied!");
      } catch {
        toast.info("Share URL: " + fallbackUrl);
      }
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="animate-fade-in print-area">
      {sample ? (
        <p className="mb-3 inline-block rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
          Sample itinerary — describe your trip and hit Generate
        </p>
      ) : null}

      {/* Title & Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs font-semibold tracking-wide text-primary uppercase">
              AI itinerary
            </p>
            {source === "gemini" ? (
              <Badge className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white gap-1 py-0.5 px-2 text-[11px] border-0 font-medium shadow-xs">
                <Sparkles className="size-3" /> Gemini 2.5 Flash
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="gap-1 py-0.5 px-2 text-[11px] font-medium text-muted-foreground"
              >
                <Bot className="size-3" /> SmartTrip Engine
              </Badge>
            )}
          </div>
          <h3 className="font-display text-xl font-bold capitalize">{plan.title}</h3>
        </div>
        <span className="rounded-full bg-leaf/20 px-3 py-1.5 text-sm font-semibold text-leaf-foreground">
          Est. {inr(plan.budget)}
        </span>
      </div>

      <p className="mt-3 text-sm text-muted-foreground">{plan.summary}</p>

      {/* Quick-Refine Action Row */}
      <div className="mt-4 flex flex-wrap items-center gap-2 border-y border-border/50 py-3 print:hidden">
        <span className="text-xs font-semibold text-muted-foreground mr-1">Quick refine:</span>
        <Button
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={() =>
            onRefine(
              "Regenerate alternative itinerary with a fresh route, different attractions, and new activities",
              { budget, days, travelers },
            )
          }
          className="rounded-full h-8 text-xs gap-1.5 hover:border-primary hover:text-primary transition-colors"
        >
          <RefreshCw className={cn("size-3.5", loading && "animate-spin")} /> Regenerate
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={() => {
            const cheaperBudget = Math.max(5000, Math.round((budget * 0.8) / 1000) * 1000);
            setBudget(cheaperBudget);
            onRefine(
              "Make it cheaper: optimize for budget stays, hostels/guesthouses, public transit, street food, and free sights",
              { budget: cheaperBudget, days, travelers },
            );
          }}
          className="rounded-full h-8 text-xs gap-1.5 hover:border-leaf hover:text-leaf transition-colors"
        >
          <Coins className="size-3.5" /> Make it cheaper
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={() =>
            onRefine(
              "Add more adventure: include high-adrenaline outdoor activities, hikes, rafting, camping, and thrilling local experiences",
              { budget, days, travelers },
            )
          }
          className="rounded-full h-8 text-xs gap-1.5 hover:border-amber-500 hover:text-amber-500 transition-colors"
        >
          <Flame className="size-3.5" /> Add more adventure
        </Button>
      </div>

      {/* Manual Fine-tuner */}
      <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl border border-border bg-surface p-3 print:hidden">
        <NumField label="Budget ₹" value={budget} onChange={setBudget} step={1000} />
        <NumField label="Days" value={days} onChange={setDays} />
        <NumField label="Travelers" value={travelers} onChange={setTravelers} />
        <Button
          variant="soft"
          size="sm"
          disabled={loading}
          className="col-span-3 gap-1.5"
          onClick={() => onReplan({ budget, days, travelers })}
        >
          <RefreshCw className={cn("size-3.5", loading && "animate-spin")} /> Re-optimize this plan
        </Button>
      </div>

      {/* Daily Timeline */}
      <ol className="mt-5 space-y-3 border-l border-dashed border-border pl-5">
        {plan.days.map((d) => (
          <li key={d.day} className="relative">
            <span className="absolute top-1.5 -left-[26px] size-2.5 rounded-full bg-gradient-brand" />
            <p className="text-sm font-semibold">
              {d.day} — {d.title}
            </p>
            <ul className="mt-1 space-y-0.5 text-sm text-muted-foreground">
              {d.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      {/* Details Grid */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <InfoBox title="Stays" items={plan.stays} />
        <InfoBox title="Transport" items={[plan.transport]} />
        <InfoBox title="Food picks" items={plan.food} />
        <InfoBox title="Weather" items={[plan.weather]} />
        <InfoBox title="Packing" items={plan.packing} />
        <InfoBox title="Travel tips" items={plan.tips} />
        <InfoBox
          title="Budget breakdown"
          items={plan.breakdown.map((b) => `${b.label}: ${inr(b.amount)}`)}
        />
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="flex items-center gap-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            <Leaf className="size-3.5" /> Carbon estimate
          </p>
          <p className="mt-2 text-sm">~{plan.carbonKg} kg CO2e per person, round trip</p>
          <p className="text-xs text-muted-foreground">
            Rough estimate by distance & transport mode
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap gap-2 print:hidden">
        <Button variant="soft" className="flex-1 gap-1.5" onClick={() => window.print()}>
          <Download className="size-4" /> PDF
        </Button>
        <Button variant="soft" className="flex-1 gap-1.5" disabled={sharing} onClick={share}>
          {sharing ? <Loader2 className="size-4 animate-spin" /> : <Share2 className="size-4" />}
          Share link
        </Button>
        <Button
          variant="hero"
          className="flex-1 gap-1.5"
          onClick={() => {
            const trip = smartTrip.savePlan(plan);
            toast.success("Plan saved to My Trips", { description: trip.name });
          }}
        >
          <BookmarkPlus className="size-4" /> Save to My Trips
        </Button>
        <Button variant="soft" asChild className="flex-1 gap-1.5">
          <Link to="/bookings">
            <Send className="size-4" /> Book this trip
          </Link>
        </Button>
      </div>
    </div>
  );
}

function InfoBox({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{title}</p>
      <ul className="mt-2 space-y-1 text-sm">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}

function NumField({
  label,
  value,
  onChange,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  step?: number;
}) {
  return (
    <label className="text-xs font-semibold text-muted-foreground">
      {label}
      <input
        type="number"
        min={1}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 1)}
        className="mt-1 w-full rounded-lg border border-input bg-card px-2 py-1 text-sm text-foreground"
      />
    </label>
  );
}
