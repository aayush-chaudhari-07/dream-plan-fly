import React, { Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/smarttrip/Hero";
import { QuickBooking } from "@/components/smarttrip/QuickBooking";
import { ExploreDestinations } from "@/components/smarttrip/ExploreDestinations";
import { HowItWorks } from "@/components/smarttrip/HowItWorks";
import { EscapeHills } from "@/components/smarttrip/EscapeHills";
import { AiPlanner } from "@/components/smarttrip/AiPlanner";
import { TripFund } from "@/components/smarttrip/TripFund";
import { ReviewsSection } from "@/components/smarttrip/ReviewsSection";
import { QuickTravelGuide } from "@/components/smarttrip/QuickTravelGuide";
import { TravelSafe } from "@/components/smarttrip/TravelSafe";
import { Footer } from "@/components/smarttrip/Footer";
import { Navbar } from "@/components/smarttrip/Navbar";
import { SupportDock } from "@/components/smarttrip/SupportDock";
import { createSeoHead } from "@/lib/seo";

const InteractiveMap = React.lazy(() =>
  import("@/components/smarttrip/InteractiveMap").then((m) => ({ default: m.InteractiveMap })),
);

export const Route = createFileRoute("/")({
  head: () =>
    createSeoHead({
      title: "SmartTrip — AI Travel Planner & Booking Platform",
      description:
        "Plan less, travel more. SmartTrip is your AI-powered companion for discovering destinations, crafting personalized itineraries, saving for trips and demo-booking flights and stays.",
      path: "/",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "SmartTrip",
        url: "https://dream-plan-fly.vercel.app",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://dream-plan-fly.vercel.app/bookings?destination={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
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
        <Suspense
          fallback={
            <div className="container-page py-12">
              <div className="h-[460px] w-full animate-pulse rounded-3xl bg-muted/40" />
            </div>
          }
        >
          <InteractiveMap />
        </Suspense>
        <TripFund />
        <QuickTravelGuide />
        <ReviewsSection />
        <TravelSafe />
      </main>
      <Footer />
      <SupportDock />
    </>
  );
}
