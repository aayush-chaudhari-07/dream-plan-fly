import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "@/components/smarttrip/Footer";
import { Navbar } from "@/components/smarttrip/Navbar";
import { PageHeader } from "@/components/smarttrip/PageHeader";
import { SupportDock } from "@/components/smarttrip/SupportDock";
import { myTrips, inr } from "@/data/travel";
import { Reveal, SectionHeading } from "@/components/smarttrip/Reveal";
import { CalendarDays, CheckCircle2, Clock, Plane, Hotel, Car, Star } from "lucide-react";

export const Route = createFileRoute("/my-trips")({
  head: () => ({
    meta: [
      { title: "My Trips — SmartTrip" },
      { name: "description", content: "Track your upcoming trips, past adventures and saved plans in one place." },
      { property: "og:title", content: "My Trips — SmartTrip" },
      { property: "og:description", content: "Track your upcoming trips, past adventures and saved plans in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MyTripsPage,
});

function TripCard({ trip, status }: { trip: { name: string; dates: string; status: string[]; image: string }; status: string }) {
  const Icon = status === "Past" ? Star : status === "Saved" ? Clock : CalendarDays;
  return (
    <Reveal>
      <div className="surface-card overflow-hidden">
        <div className="relative h-48">
          <img src={trip.image} alt={trip.name} loading="lazy" className="size-full object-cover" />
          <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-card/90 px-3 py-1 text-xs font-semibold">
            <Icon className="size-3" /> {status}
          </div>
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
        </div>
      </div>
    </Reveal>
  );
}

function MyTripsPage() {
  return (
    <>
      <Navbar />
      <PageHeader
        title="My Trips"
        subtitle="Your upcoming adventures, past memories and saved plans — all in one dashboard."
      />
      <main className="container-page py-12">
        {(Object.keys(myTrips) as Array<keyof typeof myTrips>).map((status) => (
          <div key={status} className="mt-12 first:mt-0">
            <SectionHeading
              align="left"
              eyebrow={status}
              title={status === "Upcoming" ? "Coming Up Soon" : status === "Past" ? "Where You've Been" : "Saved for Later"}
              subtitle={status === "Upcoming" ? "Trips with confirmed bookings." : status === "Past" ? "Memories and ratings." : "Ideas waiting for the right moment."}
            />
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {myTrips[status].map((trip, i) => (
                <TripCard key={trip.name + i} trip={trip} status={status} />
              ))}
            </div>
          </div>
        ))}
      </main>
      <Footer />
      <SupportDock />
    </>
  );
}
