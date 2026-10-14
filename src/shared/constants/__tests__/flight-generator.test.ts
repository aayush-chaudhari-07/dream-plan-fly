import { describe, it, expect } from "vitest";
import { generateFlights } from "../flight-generator";
import { getAirportByIata, searchAirports } from "../airports";

describe("Deterministic Programmatic Flight Generator", () => {
  it("produces 6 to 10 plausible flight options per day", () => {
    const flights = generateFlights({
      originIata: "DEL",
      destinationIata: "GOI",
      date: "2026-12-15",
      travelers: 2,
      cabinClass: "economy",
    });

    expect(flights.length).toBeGreaterThanOrEqual(6);
    expect(flights.length).toBeLessThanOrEqual(10);
  });

  it("returns identical results deterministically when given the same parameters", () => {
    const runA = generateFlights({
      originIata: "BOM",
      destinationIata: "SXR",
      date: "2026-11-20",
      travelers: 1,
      cabinClass: "economy",
    });

    const runB = generateFlights({
      originIata: "BOM",
      destinationIata: "SXR",
      date: "2026-11-20",
      travelers: 1,
      cabinClass: "economy",
    });

    expect(runA.length).toBe(runB.length);
    for (let i = 0; i < runA.length; i++) {
      expect(runA[i]?.flightNumber).toBe(runB[i]?.flightNumber);
      expect(runA[i]?.departureTime).toBe(runB[i]?.departureTime);
      expect(runA[i]?.arrivalTime).toBe(runB[i]?.arrivalTime);
      expect(runA[i]?.price).toBe(runB[i]?.price);
      expect(runA[i]?.stops).toBe(runB[i]?.stops);
    }
  });

  it("calculates accurate price breakdowns summing base fare and 12% GST taxes", () => {
    const flights = generateFlights({
      originIata: "DEL",
      destinationIata: "BLR",
      date: "2026-12-10",
      travelers: 2,
      cabinClass: "economy",
    });

    for (const flight of flights) {
      expect(flight.baseFare + flight.taxesAndFees).toBe(flight.price);
      expect(flight.price).toBeGreaterThan(0);
      expect(flight.taxesAndFees).toBe(Math.round(flight.baseFare * 0.12));
    }
  });

  it("scales pricing appropriately for business class vs economy class", () => {
    const economyFlights = generateFlights({
      originIata: "DEL",
      destinationIata: "BOM",
      date: "2026-10-15",
      travelers: 1,
      cabinClass: "economy",
    });

    const businessFlights = generateFlights({
      originIata: "DEL",
      destinationIata: "BOM",
      date: "2026-10-15",
      travelers: 1,
      cabinClass: "business",
    });

    expect(businessFlights[0]?.price).toBeGreaterThan(economyFlights[0]?.price || 0);
  });
});

describe("Airports Dataset Search", () => {
  it("retrieves airports by exact IATA code", () => {
    const del = getAirportByIata("DEL");
    expect(del?.city).toBe("New Delhi");
    expect(del?.country).toBe("India");

    const goi = getAirportByIata("goi");
    expect(goi?.city).toContain("Goa");
  });

  it("performs case-insensitive fuzzy autocomplete search", () => {
    const results = searchAirports("mumbai");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.iata).toBe("BOM");

    const srinagar = searchAirports("srinagar");
    expect(srinagar.some((a) => a.iata === "SXR")).toBe(true);
  });
});
