import { inr } from "@/data/travel";

export type GeneratedPlan = {
  title: string;
  budget: number;
  summary: string;
  days: { day: string; title: string; items: string[] }[];
  stays: string[];
  transport: string;
  food: string[];
  weather: string;
  packing: string[];
  tips: string[];
  travelers: number;
  nights: number;
  breakdown: { label: string; amount: number }[];
  carbonKg: number;
};

export type PlanOptions = {
  budget?: number | undefined;
  travelers?: number | undefined;
  days?: number | undefined;
};

export function buildPlan(prompt: string, opts: PlanOptions = {}): GeneratedPlan {
  const p = prompt.toLowerCase();
  const budgetMatch = p.replace(/[, ]/g, "").match(/(\d{4,7})/);
  const budget = opts.budget ?? (budgetMatch ? Number(budgetMatch[1]) : 35000);
  const trav =
    opts.travelers ??
    Number(p.match(/(\d+)\s*(people|persons|travell?ers|friends|adults)/)?.[1] ?? 2);
  const dayCount = Math.min(
    10,
    Math.max(2, opts.days ?? Number(p.match(/(\d+)\s*-?\s*day/)?.[1] ?? 5)),
  );
  const beach = /goa|beach|maldives|coast/.test(p);
  const intl = /japan|dubai|europe|international|bali|thailand/.test(p);
  const place = intl
    ? /japan/.test(p)
      ? "Japan"
      : "your international pick"
    : beach
      ? "Goa"
      : /kashmir/.test(p)
        ? "Kashmir"
        : "Himachal Pradesh";

  const base = {
    title: `${place} · smart plan`,
    budget,
    summary: `A paced ${beach ? "coastal" : "mountain"} route through ${place} with buffer time, local food stops and a budget kept under ${inr(budget)}.`,
    days: [
      {
        day: "Day 1",
        title: "Arrival & easy start",
        items: [
          beach ? "✈ Land, taxi to the beach belt" : "🚌 Overnight Volvo → base town",
          "🏨 Check-in and quick rest",
          "🍽 Dinner at a well-rated local spot",
        ],
      },
      {
        day: "Day 2",
        title: "The signature day",
        items: [
          beach ? "🏖 Morning beach + water sports" : "🏔 Sunrise viewpoint & valley drive",
          "📍 Two highlight sights, spaced out",
          "🍴 Café lunch, sunset walk",
        ],
      },
      {
        day: "Day 3",
        title: "Adventure block",
        items: [
          beach ? "🚤 Island hop / kayaking" : "🎒 Trek or paragliding slot (book early)",
          "☕ Slow evening, local market",
        ],
      },
      {
        day: "Day 4",
        title: "Culture & food",
        items: ["🏛 Heritage / village walk", "🍲 Food trail with 4 tasting stops"],
      },
      {
        day: "Day 5",
        title: "Buffer & return",
        items: ["🛍 Souvenirs", "✈ Return with a 3-hour buffer"],
      },
    ],
    stays: [
      `Mid-range boutique stay · ${inr(Math.round(budget * 0.09))}/night`,
      `Backup hostel/homestay · ${inr(Math.round(budget * 0.04))}/night`,
    ],
    transport: intl
      ? "Rail pass + airport express; skip taxis in city centres."
      : "Shared cab for arrival, scooter/bike rental for local movement.",
    food: ["Two local thali / seafood meals a day", "One splurge dinner", "Street-food breakfast"],
    weather: beach
      ? "Warm 27–32°C, brief evening showers. Light cotton works."
      : "Cold mornings 4–12°C. Layer up; carry a windproof shell.",
    packing: [
      "Power bank & universal adapter",
      "Meds + basic first aid",
      "Reusable bottle",
      beach ? "Reef-safe sunscreen" : "Thermals & gloves",
    ],
    tips: [
      `Book transport 3 weeks early to save ~${inr(Math.round(budget * 0.08))}`,
      "Keep one unplanned half-day — it's always the best one",
      "Carry ₹2,000 cash for remote stretches",
    ],
  };
  const extra = [
    "🌄 Offbeat day trip nearby",
    "🧘 Slow day: spa, café hopping",
    "📸 Photo walk & hidden viewpoints",
  ];
  let days = base.days.slice(0, dayCount - 1);
  while (days.length < dayCount - 1) {
    days.push({
      day: "",
      title: "Bonus exploration",
      items: [extra[days.length % extra.length]!, "🍽 Try a new local kitchen"],
    });
  }
  days = [...days, base.days[base.days.length - 1]!].map((d, i) => ({ ...d, day: `Day ${i + 1}` }));
  const pct = (n: number) => Math.round(budget * n);
  const distKm = intl ? 5500 : beach ? 1500 : 550;
  const perKm = intl || beach ? 0.15 : 0.04; // flight vs bus/rail kg CO2e per km
  return {
    ...base,
    days,
    travelers: trav,
    nights: dayCount - 1,
    summary: `A paced ${dayCount}-day ${beach ? "coastal" : intl ? "" : "mountain"} route through ${place} for ${trav} traveller${trav > 1 ? "s" : ""}, with buffer time, local food stops and a budget kept under ${inr(budget)}.`,
    breakdown: [
      { label: "Transport", amount: pct(0.3) },
      { label: "Stays", amount: pct(0.35) },
      { label: "Food", amount: pct(0.2) },
      { label: "Activities", amount: pct(0.1) },
      { label: "Buffer", amount: pct(0.05) },
    ],
    carbonKg: Math.round(distKm * 2 * perKm),
  };
}

/** Rough round-trip CO2e estimate per person for a destination name. */
export function carbonFor(text: string): number {
  const t = text.toLowerCase();
  if (/japan|dubai|europe|bali|thailand|maldives|international/.test(t)) return 1650;
  if (/goa|kerala|andaman|beach/.test(t)) return 450;
  return 45;
}
