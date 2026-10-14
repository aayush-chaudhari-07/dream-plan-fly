import { createFileRoute } from "@tanstack/react-router";
import { ExploreDestinations } from "@/components/smarttrip/ExploreDestinations";
import { Footer } from "@/components/smarttrip/Footer";
import { Navbar } from "@/components/smarttrip/Navbar";
import { PageHeader } from "@/components/smarttrip/PageHeader";
import { SupportDock } from "@/components/smarttrip/SupportDock";

import { createSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/explore")({
  head: () =>
    createSeoHead({
      title: "Explore Destinations",
      description:
        "Discover hand-picked destinations across India and the world. Filter by category, compare prices and plan your next journey.",
      path: "/explore",
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
