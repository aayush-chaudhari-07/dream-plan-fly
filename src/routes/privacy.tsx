import { createFileRoute, Link } from "@tanstack/react-router";
import { Cookie, Database, EyeOff, Lock, Shield, UserCheck } from "lucide-react";
import { Navbar } from "@/components/smarttrip/Navbar";
import { Footer } from "@/components/smarttrip/Footer";
import { PageHeader } from "@/components/smarttrip/PageHeader";
import { SupportDock } from "@/components/smarttrip/SupportDock";
import { createSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () =>
    createSeoHead({
      title: "Privacy Policy",
      description:
        "Understand how SmartTrip handles your personal data, local preferences, cookies, and AI trip planning prompts.",
      path: "/privacy",
    }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/20">
      <Navbar />

      <PageHeader
        title="Privacy Policy"
        subtitle="We believe in privacy by design. We don't sell data, track you across websites, or capture payment credentials."
      />

      <main className="container-page flex-1 py-12 max-w-4xl mx-auto space-y-8">
        {/* SUMMARY CARD */}
        <div className="surface-card rounded-3xl p-6 sm:p-8 border border-border shadow-elevated">
          <div className="flex items-center gap-3 text-primary mb-3">
            <Shield className="size-6" />
            <h2 className="font-display text-xl font-bold text-foreground">
              SmartTrip Privacy Commitment
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            SmartTrip is engineered to deliver intelligent travel planning without invasive tracking
            or intrusive analytics. We do not use third-party advertising cookies, data brokers, or
            paid surveillance tools.
          </p>
        </div>

        {/* 1. DATA WE COLLECT */}
        <section className="surface-card rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Database className="size-5" />
            <h2 className="font-display text-lg font-bold text-foreground">
              1. Information We Collect
            </h2>
          </div>
          <ul className="space-y-3 text-sm text-muted-foreground list-disc list-inside">
            <li>
              <strong className="text-foreground">Account Information:</strong> When you register an
              account, we store your email address, chosen display name, avatar, and preferred
              currency in our secure Supabase database protected by Row Level Security (RLS).
            </li>
            <li>
              <strong className="text-foreground">Saved Plans & Wishlists:</strong> Trips you save,
              destinations in your wishlist, Trip Fund targets, and simulated demo bookings are
              saved to your account so you can access them across devices.
            </li>
            <li>
              <strong className="text-foreground">Guest Mode:</strong> If you use SmartTrip without
              signing in, all itineraries, wishlists, and simulated bookings are retained strictly
              in your device's browser <code>localStorage</code>.
            </li>
          </ul>
        </section>

        {/* 2. AI PLANNING & PROMPT DATA */}
        <section className="surface-card rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <EyeOff className="size-5" />
            <h2 className="font-display text-lg font-bold text-foreground">
              2. AI Processing & Google Gemini
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            When you request an AI travel plan, your travel criteria (destination name, duration,
            budget, traveler count, and travel interests) are transmitted server-side to the Google
            Gemini Flash API to synthesize an itinerary.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
            <li>We do NOT transmit your email, real name, or location to the AI model.</li>
            <li>
              API calls are governed by Google Generative AI enterprise privacy protocols and are
              cached in server memory for 24 hours to conserve free quotas.
            </li>
          </ul>
        </section>

        {/* 3. COOKIES & LOCAL STORAGE */}
        <section className="surface-card rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Cookie className="size-5" />
            <h2 className="font-display text-lg font-bold text-foreground">
              3. Cookies & Session Storage
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            SmartTrip uses strictly essential cookies required for user authentication sessions
            (Supabase auth tokens) and <code>localStorage</code> for offline guest preferences. We
            do not use marketing or cross-site tracking cookies.
          </p>
        </section>

        {/* 4. PAYMENT & FINANCIAL PRIVACY */}
        <section className="surface-card rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Lock className="size-5" />
            <h2 className="font-display text-lg font-bold text-foreground">
              4. Payment & Financial Data
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            SmartTrip operates purely in <strong>simulated demo mode</strong>. We do NOT collect,
            process, or store real credit card numbers, CVVs, bank account PINs, or live payment
            credentials. Demo forms accept mock test numbers that are verified by mock algorithms.
          </p>
        </section>

        {/* 5. USER RIGHTS & ACCOUNT DELETION */}
        <section className="surface-card rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <UserCheck className="size-5" />
            <h2 className="font-display text-lg font-bold text-foreground">
              5. Your Data Rights & Deletion
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            You retain full ownership of your data. You may delete any saved trip, fund, booking, or
            wishlist entry directly from your account at any time. To request full deletion of your
            user profile, contact support or submit a request via our{" "}
            <Link to="/faq" className="text-primary underline hover:text-primary/80">
              Help Center
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
