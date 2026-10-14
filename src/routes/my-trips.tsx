import { useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock,
  Heart,
  Plane,
  RefreshCw,
  Sparkles,
  Star,
  Ticket,
  Trash2,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/client/components/ui/button";
import { Skeleton } from "@/client/components/ui/skeleton";
import { useAuth } from "@/client/lib/auth-context";
import { Footer } from "@/client/components/Footer";
import { Navbar } from "@/client/components/Navbar";
import { PageHeader } from "@/client/components/PageHeader";
import { SupportDock } from "@/client/features/support/SupportDock";
import { Reveal, SectionHeading } from "@/client/components/Reveal";
import { destinations, inr } from "@/shared/types/travel";
import {
  smartTrip,
  useSmartTrip,
  type StoredTrip,
  type TripBucket,
} from "@/client/lib/smarttrip-store";

import { createSeoHead } from "@/client/lib/seo";

export const Route = createFileRoute("/my-trips")({
  head: () =>
    createSeoHead({
      title: "My Trips & Itineraries",
      description:
        "Track upcoming trips, past adventures, saved AI plans, bookings and your wishlist in one SmartTrip dashboard.",
      path: "/my-trips",
      noindex: true,
    }),
  component: MyTripsPage,
});

const buckets: TripBucket[] = ["Upcoming", "Past", "Saved"];

const headings: Record<TripBucket, { title: string; subtitle: string }> = {
  Upcoming: { title: "Coming Up Soon", subtitle: "Trips with confirmed bookings." },
  Past: { title: "Where You've Been", subtitle: "Memories and ratings." },
  Saved: { title: "Saved for Later", subtitle: "Ideas and AI plans waiting for the right moment." },
};

function TripCard({ trip }: { trip: StoredTrip }) {
  const Icon = trip.bucket === "Past" ? Star : trip.bucket === "Saved" ? Clock : CalendarDays;

  return (
    <Reveal>
      <div className="surface-card overflow-hidden">
        <div className="relative h-48">
          <img
            src={trip.image}
            alt={trip.name}
            loading="lazy"
            decoding="async"
            className="size-full object-cover"
          />
          <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-card/90 px-3 py-1 text-xs font-semibold">
            <Icon className="size-3" /> {trip.bucket}
          </div>
          <button
            type="button"
            aria-label={`Remove ${trip.name}`}
            onClick={() => {
              smartTrip.removeTrip(trip.id);
              toast.message("Trip removed", { description: trip.name });
            }}
            className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-card/85 text-foreground/70 backdrop-blur transition-transform hover:scale-110 hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
        <div className="p-5">
          <p className="font-display text-lg font-bold">{trip.name}</p>
          <p className="text-sm text-muted-foreground">{trip.dates}</p>
          <ul className="mt-4 space-y-1.5">
            {trip.status.map((s) => (
              <li key={s} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="size-4 text-leaf" /> {s}
              </li>
            ))}
          </ul>

          {trip.plan ? (
            <details className="mt-4 rounded-2xl bg-secondary/50 p-3">
              <summary className="cursor-pointer text-sm font-semibold">
                View AI itinerary · est. {inr(trip.plan.budget)}
              </summary>
              <ol className="mt-3 space-y-2">
                {trip.plan.days.map((d) => (
                  <li key={d.day} className="text-sm">
                    <span className="font-semibold">
                      {d.day} — {d.title}
                    </span>
                    <ul className="mt-0.5 space-y-0.5 text-muted-foreground">
                      {d.items.map((i) => (
                        <li key={i}>{i}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </details>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2">
            {trip.bucket === "Saved" ? (
              <Button
                variant="soft"
                size="sm"
                className="rounded-full"
                onClick={() => {
                  smartTrip.moveTrip(trip.id, "Upcoming");
                  toast.success("Moved to upcoming", { description: trip.name });
                }}
              >
                Mark as booked
              </Button>
            ) : null}
            {trip.bucket === "Upcoming" ? (
              <Button
                variant="soft"
                size="sm"
                className="rounded-full"
                onClick={() => {
                  smartTrip.moveTrip(trip.id, "Past");
                  toast.success("Trip completed", { description: "Hope it was a good one!" });
                }}
              >
                Mark as completed
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function EmptyBucket({ bucket }: { bucket: TripBucket }) {
  return (
    <div className="col-span-full rounded-3xl bg-secondary/50 py-14 text-center">
      <p className="text-sm text-muted-foreground">
        {bucket === "Saved"
          ? "No saved plans yet — generate one with the AI planner."
          : bucket === "Upcoming"
            ? "Nothing booked yet. Book a flight, stay or package to see it here."
            : "No completed trips yet."}
      </p>
      <Button variant="soft" size="sm" asChild className="mt-4 rounded-full">
        <Link to={bucket === "Saved" ? "/ai-planner" : "/bookings"}>
          {bucket === "Saved" ? "Open AI planner" : "Browse bookings"}
        </Link>
      </Button>
    </div>
  );
}

function MyTripsPage() {
  const { user, isLoading: authLoading, isConfigured } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isConfigured && !authLoading && !user) {
      navigate({ to: "/login", search: { redirect: "/my-trips" } });
    }
  }, [isConfigured, authLoading, user, navigate]);

  const { trips, bookings, funds, wishlist, isLoading, isError, refetch } = useSmartTrip();
  const wished = destinations.filter((d) => wishlist.includes(d.id));
  const totalSaved = funds.reduce((s, f) => s + f.saved, 0);
  const bookingTotal = bookings.reduce((s, b) => s + b.price, 0);

  const stats = [
    { icon: Plane, label: "Trips tracked", value: String(trips.length) },
    { icon: Ticket, label: "Bookings", value: String(bookings.length) },
    { icon: Wallet, label: "Saved in funds", value: inr(totalSaved) },
    { icon: Heart, label: "Wishlisted", value: String(wished.length) },
  ];

  if (authLoading || (isConfigured && isLoading)) {
    return (
      <>
        <Navbar />
        <PageHeader
          title="My Trips"
          subtitle="Your upcoming adventures, past memories and saved plans — all in one dashboard."
        />
        <main className="container-page py-12">
          {/* Skeleton Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="surface-card flex items-center gap-3 p-5">
                <Skeleton className="size-11 rounded-2xl" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-3.5 w-28" />
                </div>
              </div>
            ))}
          </div>

          {/* Skeleton Trips Section */}
          <div className="mt-12 space-y-4">
            <Skeleton className="h-8 w-48 rounded-xl" />
            <Skeleton className="h-4 w-72 rounded-lg" />
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="surface-card overflow-hidden rounded-3xl">
                  <Skeleton className="h-48 w-full rounded-none" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Navbar />
        <PageHeader
          title="My Trips"
          subtitle="Your upcoming adventures, past memories and saved plans — all in one dashboard."
        />
        <main className="container-page py-20 text-center">
          <div className="surface-card max-w-md mx-auto p-8 rounded-3xl shadow-elevated">
            <AlertCircle className="size-10 text-destructive mx-auto mb-3" />
            <h2 className="font-display text-xl font-bold text-foreground">
              Failed to Load Dashboard
            </h2>
            <p className="text-sm text-muted-foreground mt-2 mb-6">
              There was an issue fetching your trips and bookings from the server.
            </p>
            <Button
              variant="hero"
              size="default"
              onClick={() => refetch?.()}
              className="rounded-full gap-2"
            >
              <RefreshCw className="size-4" /> Try Again
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <PageHeader
        title="My Trips"
        subtitle="Your upcoming adventures, past memories and saved plans — all in one dashboard."
      />
      <main className="container-page py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="surface-card flex items-center gap-3 p-5">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-primary">
                <Icon className="size-5" />
              </span>
              <div>
                <p className="font-display text-xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {bookings.length > 0 ? (
          <div className="mt-12">
            <SectionHeading
              align="left"
              eyebrow="Bookings"
              title="Your Reservations"
              subtitle={`${bookings.length} booking${bookings.length > 1 ? "s" : ""} · ${inr(bookingTotal)} total`}
            />
            <div className="surface-card mt-6 divide-y divide-border">
              {bookings.map((b) => (
                <div key={b.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-display font-bold">{b.title}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          b.status === "cancelled"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-emerald-500/10 text-emerald-500"
                        }`}
                      >
                        {b.status === "cancelled" ? "Cancelled" : "Confirmed"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{b.subtitle}</p>
                    <p className="mt-1 text-xs font-mono text-muted-foreground">
                      Ref #{b.reference}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-display text-lg font-bold text-primary">
                      {inr(b.price)}
                    </span>
                    <Button variant="outline" size="sm" asChild className="rounded-full text-xs">
                      <Link to="/booking-confirmation/$id" params={{ id: b.reference }}>
                        View E-Ticket
                      </Link>
                    </Button>
                    {b.status !== "cancelled" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full text-destructive text-xs"
                        onClick={() => {
                          smartTrip.cancelBooking(b.id);
                          toast.message("Booking cancelled", { description: b.title });
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {buckets.map((bucket) => {
          const list = trips.filter((t) => t.bucket === bucket);
          return (
            <div key={bucket} className="mt-12">
              <SectionHeading
                align="left"
                eyebrow={bucket}
                title={headings[bucket].title}
                subtitle={headings[bucket].subtitle}
              />
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {list.length === 0 ? (
                  <EmptyBucket bucket={bucket} />
                ) : (
                  list.map((trip) => <TripCard key={trip.id} trip={trip} />)
                )}
              </div>
            </div>
          );
        })}

        <div className="mt-12">
          <SectionHeading
            align="left"
            eyebrow="Wishlist"
            title="Places You Loved"
            subtitle="Destinations you hearted while exploring."
          />
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {wished.length === 0 ? (
              <div className="col-span-full rounded-3xl bg-secondary/50 py-14 text-center">
                <p className="text-sm text-muted-foreground">
                  Nothing wishlisted yet — tap the heart on any destination.
                </p>
                <Button variant="soft" size="sm" asChild className="mt-4 rounded-full">
                  <Link to="/explore">Explore destinations</Link>
                </Button>
              </div>
            ) : (
              wished.map((d) => (
                <Reveal key={d.id}>
                  <div className="surface-card overflow-hidden">
                    <img
                      src={d.image}
                      alt={d.name}
                      loading="lazy"
                      decoding="async"
                      className="h-32 w-full object-cover"
                    />
                    <div className="p-4">
                      <p className="font-display font-bold">{d.name}</p>
                      <p className="text-xs text-muted-foreground">{d.region}</p>
                      <p className="mt-2 text-sm font-semibold text-primary">from {inr(d.price)}</p>
                    </div>
                  </div>
                </Reveal>
              ))
            )}
          </div>
        </div>

        <div className="surface-card mt-12 flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <p className="font-display font-bold">Want a fresh start?</p>
            <p className="text-sm text-muted-foreground">
              Reset trips, bookings, funds and wishlist back to the SmartTrip demo data.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="hero" size="pill" asChild>
              <Link to="/ai-planner">
                <Sparkles /> Plan a new trip
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="pill"
              onClick={() => {
                smartTrip.reset();
                toast.success("Dashboard reset");
              }}
            >
              Reset data
            </Button>
          </div>
        </div>
      </main>
      <Footer />
      <SupportDock />
    </>
  );
}
