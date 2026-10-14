import { createFileRoute } from "@tanstack/react-router";
import { AiPlanner } from "@/client/features/planner/AiPlanner";
import { Footer } from "@/client/components/Footer";
import { Navbar } from "@/client/components/Navbar";
import { PageHeader } from "@/client/components/PageHeader";
import { SupportDock } from "@/client/features/support/SupportDock";

import { createSeoHead } from "@/client/lib/seo";

export const Route = createFileRoute("/ai-planner")({
  head: () =>
    createSeoHead({
      title: "AI Trip Planner — Personalized Itineraries",
      description:
        "Describe your dream trip to SmartTrip AI to generate comprehensive day-by-day itineraries, exact cost breakdowns, verified stays, and custom packing checklists.",
      path: "/ai-planner",
    }),
  component: AiPlannerPage,
});

function AiPlannerPage() {
  return (
    <>
      <Navbar />
      <PageHeader
        title="AI Trip Planner"
        subtitle="Describe your dream trip — destination, budget, travelers, dates — and SmartTrip AI will craft a complete itinerary in seconds."
      />
      <main>
        <AiPlanner />
      </main>
      <Footer />
      <SupportDock />
    </>
  );
}
