import { createFileRoute } from "@tanstack/react-router";
import { ExploreDestinations } from "@/components/smarttrip/ExploreDestinations";
import { Footer } from "@/components/smarttrip/Footer";
import { Navbar } from "@/components/smarttrip/Navbar";
import { PageHeader } from "@/components/smarttrip/PageHeader";
import { SupportDock } from "@/components/smarttrip/SupportDock";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore Destinations — SmartTrip" },
      {
        name: "description",
        content:
          "Discover hand-picked destinations across India and the world. Filter by category, compare prices and save your favorites.",
      },
      { property: "og:title", content: "Explore Destinations — SmartTrip" },
      {
        property: "og:description",
        content:
          "Discover hand-picked destinations across India and the world. Filter by category, compare prices and save your favorites.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ExplorePage,
});

function ExplorePage() {
  return (
    <>
      <Navbar />
      <PageHeader
        title="Explore Destinations"
        subtitle="Curated places with honest descriptions, real prices and ratings. Find your next adventure."
      />
      <main>
        <ExploreDestinations grid />
      </main>
      <Footer />
      <SupportDock />
    </>
  );
}
