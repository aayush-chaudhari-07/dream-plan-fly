import { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { quickPrompts, inr } from "@/data/travel";
import { cn } from "@/lib/utils";
import { Reveal, SectionHeading } from "./Reveal";

export type GeneratedPlan = {
  title: string;
  budget: number;
  summary: string;
  days: { day: string; title: string; items: string[] }[];
  stays: string[];
  transport: string;
  food: string[];
  weather: string;
  packing: string[];
  tips: string[];
};

export function buildPlan(prompt: string): GeneratedPlan {
  const p = prompt.toLowerCase();
  const budgetMatch = p.replace(/[, ]/g, "").match(/(\d{4,7})/);
  const budget = budgetMatch ? Number(budgetMatch[1]) : 35000;
  const beach = /goa|beach|maldives|coast/.test(p);
  const intl = /japan|dubai|europe|international|bali|thailand/.test(p);
  const place = intl
    ? /japan/.test(p)
      ? "Japan"
      : "your international pick"
    : beach
      ? "Goa"
      : /kashmir/.test(p)
        ? "Kashmir"
        : "Himachal Pradesh";

  return {
    title: `${place} · smart plan`,
    budget,
    summary: `A paced ${beach ? "coastal" : "mountain"} route through ${place} with buffer time, local food stops and a budget kept under ${inr(budget)}.`,
    days: [
      {
        day: "Day 1",
        title: "Arrival & easy start",
        items: [
          beach ? "✈ Land, taxi to the beach belt" : "🚌 Overnight Volvo → base town",
          "🏨 Check-in and quick rest",
          "🍽 Dinner at a well-rated local spot",
        ],
      },
      {
        day: "Day 2",
        title: "The signature day",
        items: [
          beach ? "🏖 Morning beach + water sports" : "🏔 Sunrise viewpoint & valley drive",
          "📍 Two highlight sights, spaced out",
          "🍴 Café lunch, sunset walk",
        ],
      },
      {
        day: "Day 3",
        title: "Adventure block",
        items: [
          beach ? "🚤 Island hop / kayaking" : "🎒 Trek or paragliding slot (book early)",
          "☕ Slow evening, local market",
        ],
      },
      {
        day: "Day 4",
        title: "Culture & food",
        items: ["🏛 Heritage / village walk", "🍲 Food trail with 4 tasting stops"],
      },
      {
        day: "Day 5",
        title: "Buffer & return",
        items: ["🛍 Souvenirs", "✈ Return with a 3-hour buffer"],
      },
    ],
    stays: [
      `Mid-range boutique stay · ${inr(Math.round(budget * 0.09))}/night`,
      `Backup hostel/homestay · ${inr(Math.round(budget * 0.04))}/night`,
    ],
    transport: intl
      ? "Rail pass + airport express; skip taxis in city centres."
      : "Shared cab for arrival, scooter/bike rental for local movement.",
    food: ["Two local thali / seafood meals a day", "One splurge dinner", "Street-food breakfast"],
    weather: beach
      ? "Warm 27–32°C, brief evening showers. Light cotton works."
      : "Cold mornings 4–12°C. Layer up; carry a windproof shell.",
    packing: ["Power bank & universal adapter", "Meds + basic first aid", "Reusable bottle", beach ? "Reef-safe sunscreen" : "Thermals & gloves"],
    tips: [
      `Book transport 3 weeks early to save ~${inr(Math.round(budget * 0.08))}`,
      "Keep one unplanned half-day — it's always the best one",
      "Carry ₹2,000 cash for remote stretches",
    ],
  };
}

export function AiPlanner({ compact = false }: { compact?: boolean }) {
  const [input, setInput] = useState(
    "I want a 5-day trip to Himachal Pradesh for 3 people under ₹35,000.",
  );
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [typing, setTyping] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const generate = () => {
    setTyping(true);
    setPlan(null);
    timer.current = setTimeout(() => {
      setPlan(buildPlan(input));
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

          <Button variant="hero" size="xl" className="mt-5 w-full" onClick={generate} disabled={typing}>
            <Wand2 /> {typing ? "Generating…" : "Generate My Trip"}
          </Button>
        </Reveal>

        <Reveal delay={80} className="surface-card p-6 sm:p-7">
          {typing ? <PlanSkeleton /> : plan ? <PlanView plan={plan} /> : <PlanEmpty />}
        </Reveal>
      </div>
    </section>
  );
}

function PlanEmpty() {
  return (
    <div className="flex h-full min-h-80 flex-col items-center justify-center text-center">
      <span className="animate-float-slow flex size-16 items-center justify-center rounded-3xl bg-secondary text-primary">
        <Sparkles className="size-7" />
      </span>
      <p className="mt-4 font-display text-lg font-semibold">Your itinerary appears here</p>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        Budget, day-by-day plan, stays, food, weather and packing — all in one place.
      </p>
    </div>
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

function PlanView({ plan }: { plan: GeneratedPlan }) {
  return (
    <div className="animate-fade-in">
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
