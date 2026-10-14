import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, BookOpen, CheckCircle, Info, ShieldCheck } from "lucide-react";
import { Navbar } from "@/client/components/Navbar";
import { Footer } from "@/client/components/Footer";
import { PageHeader } from "@/client/components/PageHeader";
import { SupportDock } from "@/client/features/support/SupportDock";
import { createSeoHead } from "@/client/lib/seo";

export const Route = createFileRoute("/terms")({
  head: () =>
    createSeoHead({
      title: "Terms of Service & Disclaimers",
      description:
        "SmartTrip Terms of Service including essential AI itinerary planning advice disclaimers and simulated demo-booking terms.",
      path: "/terms",
    }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/20">
      <Navbar />

      <PageHeader
        title="Terms of Service & Disclaimers"
        subtitle="Please review our terms of use, including critical disclaimers regarding AI trip planning and demo booking services."
      />

      <main className="container-page flex-1 py-12 max-w-4xl mx-auto space-y-10">
        {/* CRITICAL DISCLAIMER 1: DEMO BOOKING */}
        <div className="rounded-3xl border-2 border-amber-500/30 bg-amber-500/5 p-6 sm:p-8 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-amber-500/20 p-3 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="size-6" />
            </div>
            <div className="space-y-3">
              <h2 className="font-display text-xl font-bold text-foreground">
                1. Demo-Booking & Payment Simulation Disclaimer
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                <strong className="text-foreground">
                  SmartTrip is a portfolio and demonstration project.
                </strong>{" "}
                All flight itineraries, hotel rooms, transit options, car rentals, package deals,
                fares, and seat availability displayed across this platform are generated from
                seeded catalog data or deterministic algorithmic models.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                <li>
                  <strong className="text-foreground">Zero Real Financial Transactions:</strong> No
                  real credit card, UPI, net banking, or wallet transactions are charged. All
                  payment gateways operate entirely in demo test mode.
                </li>
                <li>
                  <strong className="text-foreground">No Passenger Reservations:</strong> Any
                  generated boarding passes, booking references (e.g., #STBK-...), or downloadable
                  E-tickets are purely simulated digital artifacts and have{" "}
                  <strong>no legal or operational validity</strong> with airlines, hotels, or
                  transport operators.
                </li>
                <li>
                  Do not present SmartTrip demo tickets to airport security, airline counters, or
                  hotel check-in desks.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CRITICAL DISCLAIMER 2: AI ADVICE */}
        <div className="rounded-3xl border-2 border-primary/30 bg-primary/5 p-6 sm:p-8 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-primary/20 p-3 text-primary">
              <Info className="size-6" />
            </div>
            <div className="space-y-3">
              <h2 className="font-display text-xl font-bold text-foreground">
                2. AI-Generated Advice & Itinerary Disclaimer
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Itineraries, estimated budgets, attraction schedules, weather insights, and packing
                recommendations are synthesized by artificial intelligence (Google Gemini Flash and
                rule-based engines).
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                <li>
                  <strong className="text-foreground">Indicative Guidance Only:</strong> AI trip
                  plans serve as educational and inspirational starting points. Actual operational
                  hours, ticket fees, road conditions, and seasonal closures change frequently.
                </li>
                <li>
                  <strong className="text-foreground">Traveler Due Diligence:</strong> Travelers are
                  solely responsible for verifying entry requirements, visa protocols, government
                  travel advisories, health guidelines, and safety warnings prior to traveling.
                </li>
                <li>
                  SmartTrip assumes no liability for missed connections, weather anomalies, medical
                  emergencies, or financial losses incurred from relying on AI recommendations.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* SECTION 3: ACCEPTABLE USE */}
        <section className="surface-card rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <ShieldCheck className="size-5" />
            <h2 className="font-display text-lg font-bold text-foreground">3. Acceptable Use</h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            You agree to use SmartTrip solely for lawful, non-commercial planning purposes. You must
            not attempt to abuse server endpoints, circumvent rate limiters, probe API
            vulnerabilities, or submit malicious or abusive prompts to the AI planner.
          </p>
        </section>

        {/* SECTION 4: INTELLECTUAL PROPERTY & OPEN DATA */}
        <section className="surface-card rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <BookOpen className="size-5" />
            <h2 className="font-display text-lg font-bold text-foreground">
              4. Open Data Attributions
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            SmartTrip proudly operates on free, open infrastructure:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
            <li>
              Live weather forecasts are provided under open attribution by{" "}
              <a
                href="https://open-meteo.com"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline hover:text-primary/80"
              >
                Open-Meteo.com
              </a>{" "}
              (CC BY 4.0).
            </li>
            <li>
              Currency conversion data is provided by{" "}
              <a
                href="https://www.frankfurter.app"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline hover:text-primary/80"
              >
                Frankfurter API
              </a>{" "}
              based on European Central Bank reference rates.
            </li>
            <li>
              Map cartography and point-of-interest tiles are provided courtesy of{" "}
              <a
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline hover:text-primary/80"
              >
                OpenStreetMap contributors
              </a>
              .
            </li>
          </ul>
        </section>

        {/* SECTION 5: CONTACT & UPDATES */}
        <section className="surface-card rounded-3xl p-6 sm:p-8 space-y-4 text-center">
          <h2 className="font-display text-lg font-bold text-foreground">Questions or Feedback?</h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Have questions about our terms or open demo environment? Visit our{" "}
            <Link to="/faq" className="text-primary underline hover:text-primary/80">
              Help Center & FAQ
            </Link>{" "}
            or review our{" "}
            <Link to="/privacy" className="text-primary underline hover:text-primary/80">
              Privacy Policy
            </Link>
            .
          </p>
        </section>
      </main>

      <Footer />
      <SupportDock />
    </div>
  );
}
