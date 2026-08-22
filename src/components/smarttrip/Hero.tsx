import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarDays, MapPin, Plane, Search, Sparkles, Users, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroImage from "@/assets/hero-mountains.jpg";

function SkyLayer() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* drifting clouds */}
      <div className="animate-drift absolute top-[14%] left-0 h-24 w-72 rounded-full bg-card/25 blur-3xl" />
      <div className="animate-drift-slow absolute top-[26%] left-0 h-16 w-52 rounded-full bg-card/20 blur-2xl" />
      {/* airplane */}
      <div className="animate-fly-across absolute top-[18%] left-0">
        <Plane className="size-6 -rotate-12 text-card/80 drop-shadow" />
      </div>
      {/* birds */}
      <div className="animate-bird absolute top-[32%] left-0 flex gap-3 text-card/70">
        <Bird /> <Bird />
        <span className="translate-y-2">
          <Bird />
        </span>
      </div>
    </div>
  );
}

function Bird() {
  return (
    <svg width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden>
      <path
        d="M1 6c2.5 0 3.8-4 4.8-4S8 6 9 6s2.2-4 3.2-4S15 6 17 6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Hero() {
  const [form, setForm] = useState({
    destination: "",
    dates: "",
    travelers: "2",
    budget: "",
  });

  return (
    <section className="relative min-h-[92vh] overflow-hidden pt-28 pb-32">
      <img
        src={heroImage}
        alt="Sunrise over misty green hills and a mountain lake"
        width={1920}
        height={1088}
        className="absolute inset-0 size-full scale-105 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/45 to-background" />
      <SkyLayer />

      <div className="container-page relative">
        <div className="max-w-3xl">
          <span className="glass-panel inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" /> Dream → Ask AI → Plan → Save → Book → Travel
          </span>
          <h1 className="mt-6 font-display text-5xl leading-[1.05] font-extrabold text-primary-foreground sm:text-6xl lg:text-7xl">
            Plan Less. <span className="text-teal">Travel More.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-primary-foreground/85 sm:text-lg">
            Your AI-powered travel companion for planning, booking, saving and enjoying every
            journey.
          </p>
        </div>

        <div className="glass-panel mt-10 rounded-4xl p-4 sm:p-5">
          <p className="px-1 pb-3 font-display text-sm font-semibold text-ink">
            Where do you want to go?
          </p>
          <form
            className="grid gap-3 lg:grid-cols-[1.3fr_1fr_0.8fr_1fr_auto]"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success(
                form.destination ? `Searching trips to ${form.destination}` : "Searching top trips",
                { description: "24 curated results ready in Explore." },
              );
            }}
          >
            <Field icon={MapPin} label="Destination">
              <Input
                value={form.destination}
                onChange={(e) => setForm({ ...form, destination: e.target.value })}
                placeholder="Manali, Goa, Japan…"
                className="h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
              />
            </Field>
            <Field icon={CalendarDays} label="Travel dates">
              <Input
                value={form.dates}
                onChange={(e) => setForm({ ...form, dates: e.target.value })}
                placeholder="12 Dec – 17 Dec"
                className="h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
              />
            </Field>
            <Field icon={Users} label="Travelers">
              <Input
                type="number"
                min={1}
                value={form.travelers}
                onChange={(e) => setForm({ ...form, travelers: e.target.value })}
                className="h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
              />
            </Field>
            <Field icon={Wallet} label="Budget">
              <Input
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                placeholder="₹35,000"
                className="h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
              />
            </Field>
            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
              <Button type="submit" variant="hero" size="xl" className="w-full">
                <Search /> Search
              </Button>
            </div>
          </form>
          <div className="mt-3 flex flex-wrap items-center gap-3 px-1">
            <Button variant="glass" size="pill" asChild>
              <Link to="/ai-planner">
                <Sparkles /> Ask AI to Plan My Trip
              </Link>
            </Button>
            <span className="text-xs text-ink/70">
              Popular now: Manali · Goa · Kashmir · Kyoto
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="rounded-2xl border border-border bg-card/85 px-4 py-2.5 transition-colors focus-within:border-primary">
      <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        <Icon className="size-3.5" />
        {label}
      </span>
      {children}
    </label>
  );
}
