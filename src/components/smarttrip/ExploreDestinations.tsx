import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Heart, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { destinationCategories, destinations, inr, type Destination } from "@/data/travel";
import { smartTrip, useSmartTrip } from "@/lib/smarttrip-store";
import { cn } from "@/lib/utils";
import { Reveal, SectionHeading } from "./Reveal";

export function DestinationCard({
  d,
  wished,
  onWish,
}: {
  d: Destination;
  wished?: boolean;
  onWish?: (id: string) => void;
}) {
  return (
    <article className="card-hover group relative w-[300px] shrink-0 overflow-hidden rounded-3xl border border-border bg-card shadow-soft sm:w-auto">
      <Link
        to="/destination/$id"
        params={{ id: d.id }}
        className="block relative h-52 overflow-hidden"
      >
        <img
          src={d.image}
          alt={`${d.name}, ${d.region}`}
          loading="lazy"
          width={1024}
          height={768}
          className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-95" />
        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onWish?.(d.id);
          }}
          className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-card/85 backdrop-blur transition-transform hover:scale-110 z-10"
        >
          <Heart
            className={cn(
              "size-4",
              wished ? "fill-destructive text-destructive" : "text-foreground/70",
            )}
          />
        </button>
        <div className="absolute bottom-3 left-4 text-primary-foreground">
          <p className="font-display text-lg font-bold group-hover:underline">{d.name}</p>
          <p className="text-xs opacity-85">{d.region}</p>
        </div>
        <span className="absolute right-3 bottom-3 flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 text-xs font-semibold">
          <Star className="size-3 fill-sunset text-sunset" /> {d.rating}
        </span>
      </Link>
      <div className="p-4">
        <p className="min-h-10 text-sm text-muted-foreground">{d.blurb}</p>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm">
            <span className="text-muted-foreground">from </span>
            <span className="font-display text-lg font-bold text-primary">{inr(d.price)}</span>
          </p>
          <Button
            variant="soft"
            size="sm"
            asChild
            className="rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus-visible:opacity-100"
          >
            <Link to="/destination/$id" params={{ id: d.id }}>
              Explore <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

export function ExploreDestinations({ grid = false }: { grid?: boolean }) {
  const [category, setCategory] = useState("All");
  const { wishlist } = useSmartTrip();

  const list = useMemo(
    () => (category === "All" ? destinations : destinations.filter((d) => d.category === category)),
    [category],
  );

  const toggleWish = (id: string) => {
    const added = smartTrip.toggleWish(id);
    toast[added ? "success" : "message"](added ? "Saved to wishlist" : "Removed from wishlist");
  };

  return (
    <section id="explore" className="container-page py-24">
      <SectionHeading
        eyebrow="Explore"
        title="Explore Your Next Adventure"
        subtitle="Hand-picked places with real prices, ratings and the honest version of what to expect."
      />

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {destinationCategories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
              category === c
                ? "bg-gradient-brand text-primary-foreground shadow-soft"
                : "border border-border bg-card hover:border-primary hover:text-primary",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div
        className={cn(
          "mt-10",
          grid
            ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            : "flex snap-x gap-6 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3",
        )}
      >
        {list.map((d, i) => (
          <Reveal key={d.id} delay={i * 60} className="snap-start">
            <DestinationCard d={d} wished={wishlist.includes(d.id)} onWish={toggleWish} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
