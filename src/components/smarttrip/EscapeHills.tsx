import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Thermometer, Radio } from "lucide-react";
import { hillStations } from "@/data/travel";
import { Reveal, SectionHeading } from "./Reveal";
import { getHillStationsWeatherFn } from "@/lib/server/live-data-actions";

export function EscapeHills() {
  const [liveWeather, setLiveWeather] = useState<
    Record<string, { temp: string; condition: string; isLive: boolean; fetchedAt: number }>
  >({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getHillStationsWeatherFn()
      .then((data) => {
        if (active) {
          setLiveWeather(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.warn("Could not load live hill stations weather:", err);
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

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

        <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
          </span>
          <span>
            Live weather via{" "}
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary underline hover:text-primary/80"
            >
              Open-Meteo
            </a>{" "}
            · Cached every 30m
          </span>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {hillStations.map((h, i) => {
            const weather = liveWeather[h.name];
            const displayTemp = weather?.temp || h.temp;

            return (
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
                      <p className="font-display text-xl font-bold group-hover:underline">
                        {h.name}
                      </p>
                      <div className="mt-1 flex items-center justify-between text-xs opacity-90">
                        <span>{h.state}</span>
                        <span className="flex items-center gap-1 font-semibold">
                          <Thermometer className="size-3.5 text-sky-400" />
                          <span>{displayTemp}</span>
                          {!isLoading && (
                            <Radio className="size-2.5 text-emerald-400 animate-pulse ml-0.5" />
                          )}
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              </Reveal>
            );
          })}
        </div>

        <p className="mt-6 text-center text-[11px] text-muted-foreground/80">
          Weather data by{" "}
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            Open-Meteo.com
          </a>{" "}
          (CC BY 4.0)
        </p>
      </div>
    </section>
  );
}
