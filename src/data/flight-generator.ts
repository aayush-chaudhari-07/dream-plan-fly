import { getAirportByIata } from "./airports";

export type CabinClass = "economy" | "premium_economy" | "business" | "first";

export type FlightOption = {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  originIata: string;
  destinationIata: string;
  originCity: string;
  destinationCity: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  durationFormatted: string;
  stops: "Non-stop" | "1 Stop (BOM)" | "1 Stop (DEL)" | "1 Stop (BLR)";
  stopCount: number;
  aircraft: string;
  cabinClass: CabinClass;
  price: number;
  baseFare: number;
  taxesAndFees: number;
  seatsLeft: number;
  baggage: {
    cabin: string;
    checkIn: string;
  };
  carbonKg: number;
  isRefundable: boolean;
};

// Seeded PRNG using simple string hash and Mulberry32
function createPrng(seedString: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < seedString.length; i++) {
    h ^= seedString.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  let a = h >>> 0;

  return function next(): number {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const AIRLINES = [
  { name: "IndiGo", code: "6E", fleet: ["Airbus A320neo", "Airbus A321neo"], multiplier: 1.0 },
  {
    name: "Air India",
    code: "AI",
    fleet: ["Airbus A321neo", "Boeing 787-9 Dreamliner"],
    multiplier: 1.15,
  },
  {
    name: "Vistara",
    code: "UK",
    fleet: ["Airbus A321neo", "Boeing 787-9 Dreamliner"],
    multiplier: 1.25,
  },
  { name: "Akasa Air", code: "QP", fleet: ["Boeing 737 MAX 8"], multiplier: 0.95 },
  { name: "SpiceJet", code: "SG", fleet: ["Boeing 737-800", "Bombardier Q400"], multiplier: 0.9 },
  { name: "Air India Express", code: "IX", fleet: ["Boeing 737 MAX 8"], multiplier: 0.92 },
];

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function formatMinutes(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m.toString().padStart(2, "0")}m`;
}

function formatTime(minutesFromMidnight: number): string {
  const total = minutesFromMidnight % (24 * 60);
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

/**
 * Generate 6 to 10 plausible flight options per day for any origin and destination pair.
 * Uses deterministic seeded randomness: the same origin, destination, date, and cabin class
 * ALWAYS returns the identical array of flights.
 */
export function generateFlights(params: {
  originIata: string;
  destinationIata: string;
  date: string; // YYYY-MM-DD
  travelers?: number;
  cabinClass?: CabinClass;
}): FlightOption[] {
  const originIata = params.originIata.toUpperCase().trim();
  const destinationIata = params.destinationIata.toUpperCase().trim();
  const date = params.date || new Date().toISOString().slice(0, 10);
  const travelers = Math.max(1, params.travelers || 1);
  const cabinClass: CabinClass = params.cabinClass || "economy";

  const originAirport = getAirportByIata(originIata);
  const destAirport = getAirportByIata(destinationIata);

  const originCity = originAirport?.city || originIata;
  const destCity = destAirport?.city || destinationIata;

  // Approximate route distance in km
  let distanceKm = 1200;
  if (originAirport && destAirport) {
    distanceKm = Math.max(
      350,
      calculateDistanceKm(originAirport.lat, originAirport.lng, destAirport.lat, destAirport.lng),
    );
  }

  // Pure flight time at cruise ~750 km/h + 35 mins taxi/climb/descent
  const baseFlightDurationMinutes = Math.round((distanceKm / 750) * 60 + 35);

  // Deterministic seed
  const seedKey = `FLIGHTS::${originIata}::${destinationIata}::${date}::${cabinClass}`;
  const prng = createPrng(seedKey);

  // Produce 6 to 10 plausible options per day
  const flightCount = Math.floor(prng() * 5) + 6; // 6 to 10

  const options: FlightOption[] = [];

  // Departure slots throughout the day (morning, noon, afternoon, evening, night)
  const slotMinutes = [
    360 + Math.floor(prng() * 45), // ~06:00 - 06:45
    450 + Math.floor(prng() * 60), // ~07:30 - 08:30
    600 + Math.floor(prng() * 60), // ~10:00 - 11:00
    780 + Math.floor(prng() * 60), // ~13:00 - 14:00
    930 + Math.floor(prng() * 60), // ~15:30 - 16:30
    1080 + Math.floor(prng() * 60), // ~18:00 - 19:00
    1200 + Math.floor(prng() * 60), // ~20:00 - 21:00
    1320 + Math.floor(prng() * 45), // ~22:00 - 22:45
    510 + Math.floor(prng() * 45), // ~08:30 - 09:15
    840 + Math.floor(prng() * 45), // ~14:00 - 14:45
  ];

  const classMultiplier =
    cabinClass === "first"
      ? 4.5
      : cabinClass === "business"
        ? 3.2
        : cabinClass === "premium_economy"
          ? 1.6
          : 1.0;

  for (let i = 0; i < flightCount; i++) {
    const airlineIndex = Math.floor(prng() * AIRLINES.length);
    const airline = AIRLINES[airlineIndex]!;

    const fleetIndex = Math.floor(prng() * airline.fleet.length);
    const aircraft = airline.fleet[fleetIndex]!;

    const flightNum = `${airline.code}-${Math.floor(prng() * 900) + 100}`;

    // ~65% non-stop, ~35% 1-stop with layover
    const isOneStop = prng() > 0.65;
    let stops: FlightOption["stops"] = "Non-stop";
    let stopCount = 0;
    let extraDuration = 0;

    if (isOneStop) {
      stopCount = 1;
      const hubs: FlightOption["stops"][] = ["1 Stop (BOM)", "1 Stop (DEL)", "1 Stop (BLR)"];
      stops = hubs[Math.floor(prng() * hubs.length)]!;
      extraDuration = 90 + Math.floor(prng() * 75); // 1.5 to 2.75 hours layover
    }

    const totalDurationMinutes = baseFlightDurationMinutes + extraDuration;
    const depMinute = slotMinutes[i % slotMinutes.length]!;
    const arrMinute = depMinute + totalDurationMinutes;

    // Base fare calculation: roughly ₹3.8 to ₹5.2 per km + landing charges
    const ratePerKm = 3.6 + prng() * 1.6;
    const rawFare = Math.round(
      (distanceKm * ratePerKm + 1200) * airline.multiplier * classMultiplier,
    );

    // Round to nearest 50 INR
    const baseFarePerPassenger = Math.round(rawFare / 50) * 50;
    const taxesAndFeesPerPassenger = Math.round(baseFarePerPassenger * 0.12); // 12% GST & airport charges
    const pricePerPassenger = baseFarePerPassenger + taxesAndFeesPerPassenger;

    const totalBaseFare = baseFarePerPassenger * travelers;
    const totalTaxes = taxesAndFeesPerPassenger * travelers;
    const totalPrice = pricePerPassenger * travelers;

    const seatsLeft = Math.floor(prng() * 12) + 2;
    const carbonKg = Math.round(distanceKm * 0.115 * (isOneStop ? 1.3 : 1.0));

    options.push({
      id: `fl-${originIata}-${destinationIata}-${date}-${i + 1}`,
      airline: airline.name,
      airlineCode: airline.code,
      flightNumber: flightNum,
      originIata,
      destinationIata,
      originCity,
      destinationCity: destCity,
      date,
      departureTime: formatTime(depMinute),
      arrivalTime: formatTime(arrMinute),
      durationMinutes: totalDurationMinutes,
      durationFormatted: formatMinutes(totalDurationMinutes),
      stops,
      stopCount,
      aircraft,
      cabinClass,
      price: totalPrice,
      baseFare: totalBaseFare,
      taxesAndFees: totalTaxes,
      seatsLeft,
      baggage: {
        cabin:
          cabinClass === "business" || cabinClass === "first" ? "12 kg (2 pcs)" : "7 kg (1 pc)",
        checkIn:
          cabinClass === "business" || cabinClass === "first" ? "30 kg (2 pcs)" : "15 kg (1 pc)",
      },
      carbonKg,
      isRefundable: cabinClass !== "economy" || prng() > 0.4,
    });
  }

  // Sort by departure time by default
  return options.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
}
