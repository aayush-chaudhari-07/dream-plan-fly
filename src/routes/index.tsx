import React, { Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/client/components/Hero";
import { QuickBooking } from "@/client/features/bookings/QuickBooking";
import { ExploreDestinations } from "@/client/features/destinations/ExploreDestinations";
import { HowItWorks } from "@/client/components/HowItWorks";
import { EscapeHills } from "@/client/components/EscapeHills";
import { AiPlanner } from "@/client/features/planner/AiPlanner";
import { TripFund } from "@/client/features/fund/TripFund";
import { ReviewsSection } from "@/client/features/reviews/ReviewsSection";
import { QuickTravelGuide } from "@/client/features/planner/QuickTravelGuide";
import { TravelSafe } from "@/client/components/TravelSafe";
import { Footer } from "@/client/components/Footer";
import { Navbar } from "@/client/components/Navbar";
import { SupportDock } from "@/client/features/support/SupportDock";
import { createSeoHead } from "@/client/lib/seo";

const InteractiveMap = React.lazy(() =>
  import("@/client/features/map/InteractiveMap").then((m) => ({ default: m.InteractiveMap })),
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
