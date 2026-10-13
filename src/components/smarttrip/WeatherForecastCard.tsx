import { useState, useEffect } from "react";
import {
  CloudSun,
  Droplets,
  Wind,
  CalendarDays,
  Sparkles,
  Info,
  Radio,
  Sun,
  CloudRain,
  Snowflake,
  CloudLightning,
  BellRing,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getWeatherForecastFn, createPriceAlertFn } from "@/lib/server/live-data-actions";
import type { WeatherResult } from "@/server/weather";
import { smartTrip } from "@/lib/smarttrip-store";

interface WeatherForecastCardProps {
  lat: number;
  lng: number;
  destinationName: string;
  bestTimeToVisit?: string | undefined;
  basePrice?: number | undefined;
}

function getWeatherIcon(code: number) {
  if (code === 0) return <Sun className="size-5 text-amber-500" />;
  if (code <= 3) return <CloudSun className="size-5 text-sky-500" />;
  if (code >= 71 && code <= 77) return <Snowflake className="size-5 text-blue-300" />;
  if (code >= 95) return <CloudLightning className="size-5 text-purple-500" />;
  return <CloudRain className="size-5 text-sky-600" />;
}

export function WeatherForecastCard({
  lat,
  lng,
  destinationName,
  bestTimeToVisit,
  basePrice = 12000,
}: WeatherForecastCardProps) {
  const [data, setData] = useState<WeatherResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [targetPrice, setTargetPrice] = useState(Math.round(basePrice * 0.9));
  const [isWatching, setIsWatching] = useState(false);

  useEffect(() => {
    let active = true;
    getWeatherForecastFn({ data: { lat, lng } })
      .then((res) => {
        if (active) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch weather forecast:", err);
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [lat, lng]);

  const handleCreateAlert = async () => {
    try {
      smartTrip.addPriceAlert({
        itemType: "stay",
        itemId: destinationName.toLowerCase(),
        title: `${destinationName} Trips & Stays`,
        targetPrice,
        basePrice,
      });

      await createPriceAlertFn({
        data: {
          itemType: "stay",
          itemId: destinationName.toLowerCase(),
          title: `${destinationName} Trips & Stays`,
          targetPrice,
          basePrice,
        },
      });

      setIsWatching(true);
      setIsAlertModalOpen(false);
      toast.success("Price alert activated!", {
        description: `We'll notify you when trips to ${destinationName} drop to ₹${targetPrice.toLocaleString("en-IN")}.`,
      });
    } catch {
      toast.error("Could not activate price alert.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Weather & Best Time Grid */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Current Weather Card */}
        <div className="surface-card p-6 rounded-3xl border border-border shadow-soft relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
                <CloudSun className="size-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  Live Weather
                  <Radio className="size-2.5 text-emerald-500 animate-pulse" />
                </p>
                <h3 className="font-display font-bold text-xl text-foreground">
                  {loading
                    ? "Fetching forecast..."
                    : `${data?.current.temperature ?? "--"}°C · ${data?.current.condition ?? "Clear"}`}
                </h3>
              </div>
            </div>

            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              Open-Meteo
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border/50 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Droplets className="size-3.5 text-sky-500" />
              <span>Humidity: {data?.current.humidity ?? 55}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="size-3.5 text-sky-500" />
              <span>Wind: {data?.current.windSpeed ?? 8} km/h</span>
            </div>
          </div>

          <p className="mt-3 text-[11px] text-muted-foreground/80 flex items-center gap-1">
            <Info className="size-3 shrink-0" />
            <span>
              Updated via{" "}
              <a
                href="https://open-meteo.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground font-medium"
              >
                Open-Meteo.com
              </a>{" "}
              · 30m cache
            </span>
          </p>
        </div>

        {/* Best Time to Visit Card */}
        <div className="surface-card p-6 rounded-3xl border border-border shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-2xl bg-sunset/10 text-sunset flex items-center justify-center">
                <CalendarDays className="size-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Optimal Travel Window
                </p>
                <h3 className="font-display font-bold text-lg text-foreground">
                  Best Time to Visit
                </h3>
              </div>
            </div>

            <Button
              variant={isWatching ? "secondary" : "outline"}
              size="sm"
              onClick={() => setIsAlertModalOpen(true)}
              className="rounded-full text-xs h-8 gap-1.5"
            >
              <BellRing className="size-3.5 text-primary" />
              {isWatching ? "Watching" : "Watch Price"}
            </Button>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {bestTimeToVisit ||
              "October to March offers ideal temperatures with clear sunny days and cool evenings."}
          </p>

          <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
            <span>Recommended: 4–6 Days</span>
            <span className="font-medium text-foreground">High Season Window</span>
          </div>
        </div>
      </div>

      {/* 7-Day Weather Forecast */}
      <div className="surface-card p-6 sm:p-7 rounded-3xl border border-border shadow-soft">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <Sparkles className="size-4 text-primary" />
            <h3 className="font-display font-bold text-base sm:text-lg text-foreground">
              7-Day Weather Forecast for {destinationName}
            </h3>
          </div>
          <span className="text-[11px] text-muted-foreground hidden sm:inline">
            Free ECB & Open-Meteo Integration
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="h-28 rounded-2xl bg-secondary/50 animate-pulse p-3 flex flex-col justify-between"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {data?.daily.map((day) => (
              <div
                key={day.date}
                className="flex flex-col items-center justify-between p-3 rounded-2xl border border-border/60 bg-surface text-center transition-transform hover:-translate-y-1 hover:border-primary/40"
              >
                <span className="text-xs font-bold text-foreground">{day.dayName}</span>
                <span className="text-[10px] text-muted-foreground">
                  {day.date.slice(5).replace("-", "/")}
                </span>

                <div className="my-2">{getWeatherIcon(day.weatherCode)}</div>

                <div className="text-xs">
                  <span className="font-bold text-foreground">{day.tempMax}°</span>
                  <span className="text-muted-foreground ml-1">{day.tempMin}°</span>
                </div>

                <div className="mt-1 text-[10px] text-sky-600 dark:text-sky-400 font-medium">
                  {day.precipitationProbability}% rain
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-border/50 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
          <span>
            Attribution: Weather data by{" "}
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              Open-Meteo.com
            </a>{" "}
            (Free & Key-less)
          </span>
          <span className="text-primary font-medium">Demo pricing: ±5-10% daily variation</span>
        </div>
      </div>

      {/* Price Alert Dialog */}
      {isAlertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-elevated space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <BellRing className="size-5" />
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-foreground">
                  Set Price Alert
                </h4>
                <p className="text-xs text-muted-foreground">Watching {destinationName} trips</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Target Price (INR)</label>
              <input
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(Number(e.target.value) || 0)}
                className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm font-semibold focus:outline-none focus:border-primary"
              />
              <p className="text-[11px] text-muted-foreground">
                Base price: ₹{basePrice.toLocaleString("en-IN")}. We will alert you whenever catalog
                fares fluctuate below this target.
              </p>
            </div>

            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-2.5 text-[11px] text-amber-700 dark:text-amber-300">
              <span className="font-bold">Demo pricing:</span> Simulated deterministic fluctuations
              run daily via GitHub Actions cron.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAlertModalOpen(false)}
                className="rounded-full"
              >
                Cancel
              </Button>
              <Button variant="hero" size="sm" onClick={handleCreateAlert} className="rounded-full">
                Activate Alert
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
