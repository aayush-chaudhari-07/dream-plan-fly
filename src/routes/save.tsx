import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Footer } from "@/client/components/Footer";
import { Navbar } from "@/client/components/Navbar";
import { PageHeader } from "@/client/components/PageHeader";
import { SupportDock } from "@/client/features/support/SupportDock";
import { TripFund } from "@/client/features/fund/TripFund";
import { useAuth } from "@/client/lib/auth-context";

export const Route = createFileRoute("/save")({
  head: () => ({
    meta: [
      { title: "Save for Your Trip — SmartTrip" },
      {
        name: "description",
        content:
          "Start a trip fund, track savings and get AI-powered reminders to make your dream vacation happen.",
      },
      { property: "og:title", content: "Save for Your Trip — SmartTrip" },
      {
        property: "og:description",
        content:
          "Start a trip fund, track savings and get AI-powered reminders to make your dream vacation happen.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SavePage,
});

function SavePage() {
  const { user, isLoading: authLoading, isConfigured } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isConfigured && !authLoading && !user) {
      navigate({ to: "/login", search: { redirect: "/save" } });
    }
  }, [isConfigured, authLoading, user, navigate]);

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
