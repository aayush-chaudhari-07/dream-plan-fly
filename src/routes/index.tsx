import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/smarttrip/Hero";
import { QuickBooking } from "@/components/smarttrip/QuickBooking";
import { ExploreDestinations } from "@/components/smarttrip/ExploreDestinations";
import { HowItWorks } from "@/components/smarttrip/HowItWorks";
import { EscapeHills } from "@/components/smarttrip/EscapeHills";
import { AiPlanner } from "@/components/smarttrip/AiPlanner";
import { TripFund } from "@/components/smarttrip/TripFund";
import { Testimonials } from "@/components/smarttrip/Testimonials";
import { TravelSafe } from "@/components/smarttrip/TravelSafe";
import { Footer } from "@/components/smarttrip/Footer";
import { Navbar } from "@/components/smarttrip/Navbar";
import { SupportDock } from "@/components/smarttrip/SupportDock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SmartTrip — AI Travel Planner & Booking" },
      { name: "description", content: "Plan less, travel more. SmartTrip is your AI-powered companion for discovering destinations, building itineraries, saving for trips and booking travel." },
      { property: "og:title", content: "SmartTrip — AI Travel Planner & Booking" },
      { property: "og:description", content: "Plan less, travel more. SmartTrip is your AI-powered companion for discovering destinations, building itineraries, saving for trips and booking travel." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <QuickBooking />
        <ExploreDestinations />
        <HowItWorks />
        <EscapeHills />
        <AiPlanner />
        <TripFund />
        <Testimonials />
        <TravelSafe />
      </main>
      <Footer />
      <SupportDock />
    </>
  );
}
