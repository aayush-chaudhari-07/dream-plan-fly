import { Link } from "@tanstack/react-router";
import { Thermometer } from "lucide-react";
import { hillStations } from "@/data/travel";
import { Reveal, SectionHeading } from "./Reveal";

export function EscapeHills() {
  return (
    <section className="relative overflow-hidden bg-gradient-sky py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="animate-drift-slow absolute top-10 left-0 h-20 w-64 rounded-full bg-card/60 blur-3xl" />
        <div className="animate-drift absolute top-32 left-0 h-14 w-40 rounded-full bg-card/50 blur-2xl" />
        <div className="animate-bird absolute top-24 left-0 flex gap-3 text-primary/40">
          <svg width="20" height="10" viewBox="0 0 18 10" fill="none">
            <path
              d="M1 6c2.5 0 3.8-4 4.8-4S8 6 9 6s2.2-4 3.2-4S15 6 17 6"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
          <svg width="14" height="8" viewBox="0 0 18 10" fill="none" className="translate-y-3">
            <path
              d="M1 6c2.5 0 3.8-4 4.8-4S8 6 9 6s2.2-4 3.2-4S15 6 17 6"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      <div className="container-page relative">
        <SectionHeading
          eyebrow="Mountain mood"
          title="Escape to the Hills"
          subtitle="Cold air, slow mornings, tea at a viewpoint. The trips people remember for years."
        />

        <p className="mt-4 text-center text-xs font-medium text-muted-foreground">
          Sample temperatures — not live weather data
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {hillStations.map((h, i) => (
            <Reveal key={h.name} delay={i * 60}>
              <Link to="/destination/$id" params={{ id: h.id }} className="block">
                <article className="group relative h-64 overflow-hidden rounded-3xl shadow-soft transition-transform duration-500 hover:-translate-y-1.5 cursor-pointer">
                  <img
                    src={h.image}
                    alt={`${h.name}, ${h.state}`}
                    loading="lazy"
                    width={1024}
                    height={768}
                    className="size-full object-cover transition-transform duration-[900ms] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
                  <div className="absolute inset-x-4 bottom-4 text-primary-foreground">
                    <p className="font-display text-xl font-bold group-hover:underline">{h.name}</p>
                    <div className="mt-1 flex items-center justify-between text-xs opacity-90">
                      <span>{h.state}</span>
                      <span className="flex items-center gap-1">
                        <Thermometer className="size-3.5" /> {h.temp}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
