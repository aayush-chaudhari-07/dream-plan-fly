import { Link } from "@tanstack/react-router";
import { ArrowLeft, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PageHeader({
  title,
  subtitle,
  backTo,
}: {
  title: string;
  subtitle: string;
  backTo?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-sky pt-28 pb-16">
      <div className="container-page relative">
        <div className="flex items-start gap-4">
          {backTo ? (
            <Button variant="soft" size="icon" className="shrink-0 rounded-full" asChild>
              <Link to={backTo}>
                <ArrowLeft />
              </Link>
            </Button>
          ) : null}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-semibold tracking-wide text-primary uppercase">
              <Compass className="size-3.5" /> SmartTrip
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold text-foreground sm:text-5xl">
              {title}
            </h1>
            <p className="mt-3 max-w-2xl text-base text-muted-foreground">{subtitle}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
