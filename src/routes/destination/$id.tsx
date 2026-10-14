import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CalendarDays,
  CloudSun,
  Compass,
  MapPin,
  Sparkles,
  Star,
  Wand2,
} from "lucide-react";
import { Badge } from "@/client/components/ui/badge";
import { Button } from "@/client/components/ui/button";
import { Footer } from "@/client/components/Footer";
import { Navbar } from "@/client/components/Navbar";
import { SupportDock } from "@/client/features/support/SupportDock";
import { InteractiveMap } from "@/client/features/map/InteractiveMap";
import { WeatherForecastCard } from "@/client/features/destinations/WeatherForecastCard";
import { destinations, inr } from "@/shared/types/travel";
import { createSeoHead } from "@/client/lib/seo";

export const Route = createFileRoute("/destination/$id")({
  loader: ({ params }) => {
    const destination = destinations.find((d) => d.id === params.id) || null;
    return { destination, id: params.id };
  },
  head: ({ loaderData }) => {
    const dest = loaderData?.destination;
    const title = dest ? `${dest.name}, ${dest.region} Travel Guide` : "Destination";
    const description =
      dest?.blurb ||
      "Explore travel destinations, weather forecasts, curated itineraries and local sights on SmartTrip.";

    const jsonLd = dest
      ? {
          "@context": "https://schema.org",
          "@type": "TouristDestination",
          name: dest.name,
          description: dest.blurb,
          image: dest.image,
          touristType: dest.category,
          geo: {
            "@type": "GeoCoordinates",
            latitude: dest.lat,
            longitude: dest.lng,
          },
          address: {
            "@type": "PostalAddress",
            addressRegion: dest.region,
            addressCountry: "IN",
          },
          includesAttraction: {
            "@type": "TouristAttraction",
            name: `${dest.name} Highlights`,
            description: `Best time to visit: ${dest.bestTimeToVisit}. Daily starting rates from ₹${dest.price.toLocaleString("en-IN")}.`,
          },
        }
      : undefined;

    return createSeoHead({
      title,
      description,
      path: dest ? `/destination/${dest.id}` : "/destination",
      image: dest?.image,
      jsonLd,
    });
  },
  component: DestinationDetailPage,
});

function DestinationDetailPage() {
  const { destination } = Route.useLoaderData();

  if (!destination) {
    return (
      <div className="flex min-h-screen flex-col bg-background selection:bg-primary/20">
        <Navbar />
        <main className="container-page flex flex-1 items-center justify-center py-24">
          <div className="surface-card max-w-md p-8 text-center rounded-3xl shadow-elevated">
            <Compass className="size-12 text-muted-foreground mx-auto mb-3" />
            <h1 className="font-display text-xl font-bold text-foreground">
              Destination Not Found
            </h1>
            <p className="mt-2 text-sm text-muted-foreground mb-6">
              We couldn't locate this destination. Discover our featured travel destinations.
            </p>
            <Button variant="hero" asChild className="rounded-full">
              <Link to="/explore">
                <ArrowLeft className="size-4 mr-2" /> Explore Destinations
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const promptSuggestion = `Plan a 5-day trip to ${destination.name} for 2 people under ${inr(destination.price * 3)}`;

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/20">
      <Navbar />

      <main className="flex-1 pb-20">
        {/* Hero Section */}
        <div className="relative h-[480px] sm:h-[560px] overflow-hidden">
          <img
            src={destination.image}
            alt={`${destination.name}, ${destination.region}`}
            className="size-full object-cover object-center brightness-90"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-ink/40 to-ink/20" />

          {/* Breadcrumb & Navigation */}
          <div className="container-page absolute top-28 left-0 right-0 z-20">
            <Link
              to="/explore"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 hover:text-white bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full transition-colors"
            >
              <ArrowLeft className="size-3.5" /> Back to Explore
            </Link>
          </div>

          {/* Destination Header Content */}
          <div className="container-page absolute bottom-10 left-0 right-0 z-20">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge className="bg-primary text-primary-foreground border-0 text-xs px-3 py-1 font-semibold">
                  {destination.category}
                </Badge>
                <span className="flex items-center gap-1 rounded-full bg-card/90 backdrop-blur px-3 py-1 text-xs font-bold text-foreground">
                  <Star className="size-3.5 fill-sunset text-sunset" /> {destination.rating}
                </span>
                <span className="rounded-full bg-card/90 backdrop-blur px-3 py-1 text-xs font-bold text-foreground">
                  Starts at {inr(destination.price)}
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                {destination.name}
              </h1>
              <p className="mt-2 text-base sm:text-lg text-white/90 flex items-center gap-1.5 font-medium">
                <MapPin className="size-4 text-primary shrink-0" /> {destination.region}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="container-page mt-8 space-y-12">
          {/* Live Open-Meteo Weather & 7-Day Forecast */}
          <WeatherForecastCard
            lat={destination.lat}
            lng={destination.lng}
            destinationName={destination.name}
            bestTimeToVisit={destination.bestTimeToVisit}
            basePrice={destination.price}
          />

          {/* Destination Overview & Highlights */}
          <div className="surface-card p-6 sm:p-8 rounded-3xl border border-border shadow-soft">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
              About {destination.name}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
              {destination.description}
            </p>

            {/* Highlights */}
            <div className="mt-6 pt-6 border-t border-border/60">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Signature Experiences & Highlights
              </h3>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {destination.highlights.map((h: string) => (
                  <div
                    key={h}
                    className="flex items-center gap-2.5 rounded-2xl border border-border/70 bg-card p-3 text-xs sm:text-sm font-medium text-foreground shadow-2xs"
                  >
                    <Sparkles className="size-4 text-primary shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button variant="hero" size="lg" asChild className="rounded-full gap-2">
                <Link to="/ai-planner" search={{ q: promptSuggestion }}>
                  <Wand2 className="size-4" /> Plan AI Itinerary
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="rounded-full gap-2">
                <Link to="/bookings">Book Hotels & Transport</Link>
              </Button>
            </div>
          </div>

          {/* Interactive Map for this Destination */}
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                Explore Around {destination.name}
              </p>
              <h2 className="font-display text-2xl font-bold text-foreground">
                Interactive Sights & Stays Map
              </h2>
              <p className="text-sm text-muted-foreground">
                Click pins to explore verified viewpoint stops, local cafes, boutique hotels, and
                outdoor adventures.
              </p>
            </div>

            <InteractiveMap initialDestinationId={destination.id} compact showHeading={false} />
          </div>
        </div>
      </main>

      <Footer />
      <SupportDock />
    </div>
  );
}
