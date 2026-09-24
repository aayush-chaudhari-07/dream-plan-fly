import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bot, BookmarkPlus, Download, Leaf, RefreshCw, Send, Share2, Wand2 } from "lucide-react";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { quickPrompts, inr } from "@/data/travel";
import { smartTrip } from "@/lib/smarttrip-store";
import { buildPlan, type GeneratedPlan, type PlanOptions } from "@/lib/trip-plan";
import { cn } from "@/lib/utils";
import { Reveal, SectionHeading } from "./Reveal";

export { buildPlan };
export type { GeneratedPlan };


export function AiPlanner({ compact = false }: { compact?: boolean }) {
  const [input, setInput] = useState(
    "I want a 5-day trip to Himachal Pradesh for 3 people under ₹35,000.",
  );
  const [plan, setPlan] = useState<GeneratedPlan>(() =>
    buildPlan("I want a 5-day trip to Himachal Pradesh for 3 people under ₹35,000."),
  );
  const [isSample, setIsSample] = useState(true);
  const [typing, setTyping] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    if (q) {
      setInput(q);
      setPlan(buildPlan(q));
      setIsSample(false);
    }
  }, []);

  const run = (opts?: PlanOptions) => {
    setTyping(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setPlan(buildPlan(input, opts));
      setIsSample(false);
      setTyping(false);
    }, 1100);
  };

  return (
    <section id="ai" className={cn("container-page", compact ? "py-10" : "py-24")}>
      {!compact ? (
        <SectionHeading
          eyebrow="Ask AI"
          title="Meet Your AI Travel Planner"
          subtitle="Tell us your dream trip. SmartTrip will build the plan for you."
        />
      ) : null}

      <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Reveal className="surface-card bg-gradient-sky p-6 sm:p-7">
          <div className="flex items-center gap-3">
            <span className="relative flex size-11 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground">
              <Bot className="size-5" />
              <span className="animate-pulse-ring absolute inset-0 rounded-2xl border border-primary" />
            </span>
            <div>
              <p className="font-display font-bold">SmartTrip AI</p>
              <p className="text-xs text-muted-foreground">
                {typing ? "Thinking about your trip…" : "Online · plans in seconds"}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-3xl bg-card/80 p-4 shadow-soft">
            <p className="text-xs font-semibold text-muted-foreground">You</p>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={3}
              className="mt-1 resize-none border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
              aria-label="Describe your trip"
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

          <Button variant="hero" size="xl" className="mt-5 w-full" onClick={() => run()} disabled={typing}>
            <Wand2 /> {typing ? "Generating…" : "Generate My Trip"}
          </Button>
        </Reveal>

        <Reveal delay={80} className="surface-card p-6 sm:p-7">
          {typing ? <PlanSkeleton /> : <PlanView plan={plan} sample={isSample} prompt={input} onReplan={run} />}
        </Reveal>
      </div>
    </section>
  );
}

function PlanSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-6 w-2/3 animate-pulse rounded-full bg-muted" />
      <div className="h-4 w-full animate-pulse rounded-full bg-muted" />
      <div className="h-4 w-5/6 animate-pulse rounded-full bg-muted" />
      <div className="mt-6 grid gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
      <p className="flex items-center gap-1 pt-2 text-xs text-muted-foreground">
        SmartTrip AI is typing
        <span className="animate-blink">•</span>
        <span className="animate-blink [animation-delay:200ms]">•</span>
        <span className="animate-blink [animation-delay:400ms]">•</span>
      </p>
    </div>
  );
}

function PlanView({
  plan,
  sample,
  prompt,
  onReplan,
}: {
  plan: GeneratedPlan;
  sample: boolean;
  prompt: string;
  onReplan: (o: PlanOptions) => void;
}) {
  const [budget, setBudget] = useState(plan.budget);
  const [days, setDays] = useState(plan.days.length);
  const [travelers, setTravelers] = useState(plan.travelers);
  useEffect(() => {
    setBudget(plan.budget);
    setDays(plan.days.length);
    setTravelers(plan.travelers);
  }, [plan]);

  const share = async () => {
    const url = `${window.location.origin}/ai-planner?q=${encodeURIComponent(prompt)}`;
    try {
      if (navigator.share) await navigator.share({ title: plan.title, url });
      else {
        await navigator.clipboard.writeText(url);
        toast.success("Share link copied");
      }
    } catch {
      /* user dismissed */
    }
  };

  return (
    <div className="animate-fade-in print-area">
      {sample ? (
        <p className="mb-3 inline-block rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
          Sample itinerary — describe your trip and hit Generate
        </p>
      ) : null}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">AI itinerary</p>
          <h3 className="font-display text-xl font-bold capitalize">{plan.title}</h3>
        </div>
        <span className="rounded-full bg-leaf/20 px-3 py-1.5 text-sm font-semibold text-leaf-foreground">
          Est. {inr(plan.budget)}
        </span>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{plan.summary}</p>

      <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl border border-border bg-surface p-3 print:hidden">
        <NumField label="Budget ₹" value={budget} onChange={setBudget} step={1000} />
        <NumField label="Days" value={days} onChange={setDays} />
        <NumField label="Travelers" value={travelers} onChange={setTravelers} />
        <Button
          variant="soft"
          size="sm"
          className="col-span-3"
          onClick={() => onReplan({ budget, days, travelers })}
        >
          <RefreshCw /> Re-optimize this plan
        </Button>
      </div>

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
          <p className="text-xs text-muted-foreground">Rough estimate by distance & transport mode</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 print:hidden">
        <Button variant="soft" className="flex-1" onClick={() => window.print()}>
          <Download /> PDF
        </Button>
        <Button variant="soft" className="flex-1" onClick={share}>
          <Share2 /> Share link
        </Button>
        <Button
          variant="hero"
          className="flex-1"
          onClick={() => {
            const trip = smartTrip.savePlan(plan);
            toast.success("Plan saved to My Trips", { description: trip.name });
          }}
        >
          <BookmarkPlus /> Save to My Trips
        </Button>
        <Button variant="soft" asChild className="flex-1">
          <Link to="/bookings">
            <Send /> Book this trip
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
