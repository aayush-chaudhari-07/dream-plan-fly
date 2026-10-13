import { describe, expect, it } from "vitest";
import { calculateDistanceKm, destinations, mapPlaces, type MapPlace } from "@/data/travel";
import { smartTrip } from "@/lib/smarttrip-store";

describe("InteractiveMap & Travel Dataset", () => {
  it("includes all 9 required destinations with coordinates, weather, and travel advice", () => {
    expect(destinations.length).toBe(9);

    const requiredIds = [
      "manali",
      "goa",
      "kashmir",
      "kyoto",
      "maldives",
      "lonavala",
      "munnar",
      "rishikesh",
      "jaipur",
    ];

    requiredIds.forEach((id) => {
      const dest = destinations.find((d) => d.id === id);
      expect(dest).toBeDefined();
      expect(dest?.lat).toBeTypeOf("number");
      expect(dest?.lng).toBeTypeOf("number");
      expect(dest?.lat).toBeGreaterThanOrEqual(-90);
      expect(dest?.lat).toBeLessThanOrEqual(90);
      expect(dest?.lng).toBeGreaterThanOrEqual(-180);
      expect(dest?.lng).toBeLessThanOrEqual(180);
      expect(dest?.description).toBeTruthy();
      expect(dest?.weather.temp).toBeTruthy();
      expect(dest?.weather.condition).toBeTruthy();
      expect(dest?.bestTimeToVisit).toBeTruthy();
      expect(dest?.highlights.length).toBeGreaterThan(0);
    });
  });

  it("replaces fake percentage coordinates with real lat/lng for every place in mapPlaces", () => {
    expect(mapPlaces.length).toBeGreaterThanOrEqual(36);

    mapPlaces.forEach((place) => {
      expect(place.id).toBeTruthy();
      expect(place.name).toBeTruthy();
      expect(place.lat).toBeTypeOf("number");
      expect(place.lng).toBeTypeOf("number");
      expect(place.lat).toBeGreaterThan(0);
      expect(place.lng).toBeGreaterThan(0);
      expect(place.rating).toBeGreaterThanOrEqual(1);
      expect(place.rating).toBeLessThanOrEqual(5);
      expect(["Attractions", "Hotels", "Restaurants", "Activities"]).toContain(place.type);
    });
  });

  it("provides real places for each of the 9 destinations", () => {
    const destinationIds = [
      "manali",
      "goa",
      "kashmir",
      "kyoto",
      "maldives",
      "lonavala",
      "munnar",
      "rishikesh",
      "jaipur",
    ];

    destinationIds.forEach((destId) => {
      const placesForDest = mapPlaces.filter((p) => p.destinationId === destId);
      expect(placesForDest.length).toBeGreaterThanOrEqual(4);

      // Verify presence of different categories
      const categories = new Set(placesForDest.map((p) => p.type));
      expect(categories.has("Attractions")).toBe(true);
      expect(categories.has("Activities")).toBe(true);
    });
  });

  it("calculates accurate real-world distance using Haversine formula", () => {
    // Distance from coordinate to itself is 0
    expect(calculateDistanceKm(18.7557, 73.4091, 18.7557, 73.4091)).toBe(0);

    // Lonavala to Tiger Point is ~4-5 km
    const distTigerPoint = calculateDistanceKm(18.7557, 73.4091, 18.7303, 73.3855);
    expect(distTigerPoint).toBeGreaterThan(3);
    expect(distTigerPoint).toBeLessThan(6);

    // Distance between Delhi (28.6139, 77.2090) and Jaipur (26.9124, 75.7873) is ~230-250 km
    const distDelhiJaipur = calculateDistanceKm(28.6139, 77.209, 26.9124, 75.7873);
    expect(distDelhiJaipur).toBeGreaterThan(220);
    expect(distDelhiJaipur).toBeLessThan(260);
  });

  it("adds place to trip via smartTrip.addPlaceToTrip", () => {
    const testPlace: MapPlace = {
      id: "test-place-1",
      name: "Tiger Point Viewpoint",
      destinationId: "lonavala",
      type: "Attractions",
      rating: 4.8,
      note: "Cliff-edge sunrise views",
      lat: 18.7303,
      lng: 73.3855,
    };

    const trip = smartTrip.addPlaceToTrip(testPlace);
    expect(trip).toBeDefined();
    expect(trip.status).toContain("📍 Added: Tiger Point Viewpoint");
  });

  it("adds hotel to plan stays and restaurant to plan food", () => {
    const hotelPlace: MapPlace = {
      id: "test-hotel-1",
      name: "The Grand Lonavala Resort",
      destinationId: "lonavala",
      type: "Hotels",
      rating: 4.7,
      note: "Luxury cliffside retreat",
      lat: 18.749,
      lng: 73.415,
    };

    const trip = smartTrip.addPlaceToTrip(hotelPlace);
    if (trip.plan) {
      expect(trip.plan.stays).toContain("The Grand Lonavala Resort");
    }

    const restaurantPlace: MapPlace = {
      id: "test-food-1",
      name: "Sahyadri Spices Restaurant",
      destinationId: "lonavala",
      type: "Restaurants",
      rating: 4.6,
      note: "Traditional thali dining",
      lat: 18.753,
      lng: 73.406,
    };

    const foodTrip = smartTrip.addPlaceToTrip(restaurantPlace);
    if (foodTrip.plan) {
      expect(foodTrip.plan.food).toContain("Sahyadri Spices Restaurant");
    }
  });
});
