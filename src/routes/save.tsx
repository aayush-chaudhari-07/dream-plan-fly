import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "@/components/smarttrip/Footer";
import { Navbar } from "@/components/smarttrip/Navbar";
import { PageHeader } from "@/components/smarttrip/PageHeader";
import { SupportDock } from "@/components/smarttrip/SupportDock";
import { TripFund } from "@/components/smarttrip/TripFund";

export const Route = createFileRoute("/save")({
  head: () => ({
    meta: [
      { title: "Save for Your Trip — SmartTrip" },
      { name: "description", content: "Start a trip fund, track savings and get AI-powered reminders to make your dream vacation happen." },
      { property: "og:title", content: "Save for Your Trip — SmartTrip" },
      { property: "og:description", content: "Start a trip fund, track savings and get AI-powered reminders to make your dream vacation happen." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SavePage,
});

function SavePage() {
  return (
    <>
      <Navbar />
      <PageHeader
        title="Save for Your Future Trip"
        subtitle="Dream bigger. Save smarter. SmartTrip helps you track progress, set monthly goals and stay motivated until takeoff."
      />
      <main>
        <TripFund />
      </main>
      <Footer />
      <SupportDock />
    </>
  );
}
