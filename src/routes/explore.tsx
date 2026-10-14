import { createFileRoute } from "@tanstack/react-router";
import { ExploreDestinations } from "@/client/features/destinations/ExploreDestinations";
import { Footer } from "@/client/components/Footer";
import { Navbar } from "@/client/components/Navbar";
import { PageHeader } from "@/client/components/PageHeader";
import { SupportDock } from "@/client/features/support/SupportDock";

import { createSeoHead } from "@/client/lib/seo";

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
