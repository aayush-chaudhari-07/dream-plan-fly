import { createFileRoute, Link } from "@tanstack/react-router";
import { BookmarkPlus, Compass, Download, Leaf, Share2, Sparkles, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/smarttrip/Navbar";
import { Footer } from "@/components/smarttrip/Footer";
import { inr } from "@/data/travel";
import { smartTrip } from "@/lib/smarttrip-store";
import { getPublicPlanFn } from "@/server/generate-plan";

export const Route = createFileRoute("/plan/$id")({
  loader: async ({ params }) => {
    try {
      const plan = await getPublicPlanFn({ data: { id: params.id } });
      return { plan, id: params.id };
    } catch {
      return { plan: null, id: params.id };
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.plan
          ? `${loaderData.plan.title} — SmartTrip AI Plan`
          : "Shared Travel Plan — SmartTrip",
      },
      {
        name: "description",
        content:
          loaderData?.plan?.summary || "View this shared AI-generated travel plan on SmartTrip.",
      },
    ],
  }),
  component: PublicPlanPage,
});

function PublicPlanPage() {
  const { plan, id } = Route.useLoaderData();

  if (!plan) {
    return (
      <div className="flex min-h-screen flex-col bg-background selection:bg-primary/20">
        <Navbar />
        <main className="container-page flex flex-1 items-center justify-center py-24">
          <div className="surface-card max-w-md p-8 text-center rounded-3xl shadow-elevated">
            <Compass className="size-12 text-muted-foreground mx-auto mb-3" />
            <h1 className="font-display text-xl font-bold text-foreground">Plan Not Found</h1>
            <p className="mt-2 text-sm text-muted-foreground mb-6">
              This shared itinerary link may have expired or is invalid.
            </p>
            <Button variant="hero" asChild className="rounded-full">
              <Link to="/ai-planner">
                <Wand2 className="size-4 mr-2" /> Plan a New Trip
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Share link copied to clipboard!");
    } catch {
      toast.info("Link: " + window.location.href);
    }
  };

  const handleSaveToMyTrips = () => {
    smartTrip.savePlan(plan);
    toast.success("Itinerary saved to My Trips!", {
      description: "You can find this plan in your dashboard anytime.",
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/20">
      <Navbar />

      <main className="container-page flex-1 py-28 print:py-4">
        <div className="surface-card max-w-4xl mx-auto p-6 sm:p-10 rounded-3xl shadow-elevated print:shadow-none print:p-0">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-2">
                <Sparkles className="size-3.5" /> Shared Itinerary
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold capitalize text-foreground">
                {plan.title}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {plan.days.length} Days · {plan.travelers} Traveler{plan.travelers > 1 ? "s" : ""}
              </p>
            </div>

            <div className="text-right">
              <span className="block text-xs font-semibold text-muted-foreground uppercase">
                Estimated Budget
              </span>
              <span className="font-display text-2xl font-bold text-primary">
                {inr(plan.budget)}
              </span>
            </div>
          </div>

          <p className="mt-6 text-sm text-muted-foreground leading-relaxed">{plan.summary}</p>

          {/* Action Toolbar */}
          <div className="my-6 flex flex-wrap gap-2.5 print:hidden">
            <Button
              variant="hero"
              size="sm"
              onClick={handleSaveToMyTrips}
              className="rounded-full shadow-soft"
            >
              <BookmarkPlus className="size-4 mr-1.5" /> Save to My Trips
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopyLink} className="rounded-full">
              <Share2 className="size-4 mr-1.5" /> Copy Link
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="rounded-full"
            >
              <Download className="size-4 mr-1.5" /> Print / PDF
            </Button>
            <Button variant="soft" size="sm" asChild className="rounded-full ml-auto">
              <Link to="/ai-planner">
                <Wand2 className="size-4 mr-1.5" /> Customize with AI
              </Link>
            </Button>
          </div>

          {/* Day by Day Timeline */}
          <div className="mt-8">
            <h2 className="font-display text-lg font-bold text-foreground mb-4">
              Day-by-Day Itinerary
            </h2>
            <ol className="space-y-4 border-l border-dashed border-border/80 pl-6 ml-2">
              {plan.days.map((d) => (
                <li key={d.day} className="relative">
                  <span className="absolute -left-[31px] top-1.5 size-3 rounded-full bg-gradient-brand shadow-soft" />
                  <p className="font-display text-base font-semibold text-foreground">
                    {d.day} — {d.title}
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {d.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>

          {/* Details Grid */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card/50 p-4">
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                🏨 Stays & Lodging
              </p>
              <ul className="space-y-1 text-sm text-foreground/80">
                {plan.stays.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card/50 p-4">
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                🚆 Transport & Movement
              </p>
              <p className="text-sm text-foreground/80">{plan.transport}</p>
            </div>

            <div className="rounded-2xl border border-border bg-card/50 p-4">
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                🍽 Food Recommendations
              </p>
              <ul className="space-y-1 text-sm text-foreground/80">
                {plan.food.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card/50 p-4">
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                🌤 Weather & Packing
              </p>
              <p className="text-sm text-foreground/80 mb-2">{plan.weather}</p>
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground/80">Pack:</span>{" "}
                {plan.packing.join(" · ")}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card/50 p-4 sm:col-span-2">
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                💰 Budget Breakdown
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-sm">
                {plan.breakdown.map((b) => (
                  <div key={b.label} className="bg-secondary/40 p-2.5 rounded-xl">
                    <p className="text-xs text-muted-foreground">{b.label}</p>
                    <p className="font-semibold text-foreground mt-0.5">{inr(b.amount)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card/50 p-4 sm:col-span-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Leaf className="size-4 text-leaf" />
                <span>Estimated carbon footprint:</span>
                <span className="font-semibold text-foreground">~{plan.carbonKg} kg CO2e</span>
                <span>round trip per person</span>
              </div>
              <span className="text-[11px] text-muted-foreground">ID: {id}</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
