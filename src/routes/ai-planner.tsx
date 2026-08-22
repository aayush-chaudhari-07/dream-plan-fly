import { createFileRoute } from "@tanstack/react-router";
import { AiPlanner } from "@/components/smarttrip/AiPlanner";
import { Footer } from "@/components/smarttrip/Footer";
import { Navbar } from "@/components/smarttrip/Navbar";
import { PageHeader } from "@/components/smarttrip/PageHeader";
import { SupportDock } from "@/components/smarttrip/SupportDock";

export const Route = createFileRoute("/ai-planner")({
  head: () => ({
    meta: [
      { title: "AI Trip Planner — SmartTrip" },
      { name: "description", content: "Tell SmartTrip your dream trip and let AI build a personalized itinerary, budget, stays and packing list." },
      { property: "og:title", content: "AI Trip Planner — SmartTrip" },
      { property: "og:description", content: "Tell SmartTrip your dream trip and let AI build a personalized itinerary, budget, stays and packing list." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
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
