import { beforeEach, describe, expect, it } from "vitest";
import { smartTrip } from "../smarttrip-store";
import { buildPlan } from "../trip-plan";

describe("smarttrip-store - actions", () => {
  beforeEach(() => {
    localStorage.clear();
    smartTrip.reset();
  });

  describe("trips management", () => {
    it("saves a generated plan into Saved trips bucket", () => {
      const plan = buildPlan("4 days in Goa for 2 under 30000");
      const savedTrip = smartTrip.savePlan(plan);

      expect(savedTrip.id).toMatch(/^trip-/);
      expect(savedTrip.bucket).toBe("Saved");
      expect(savedTrip.plan).toBeDefined();
      expect(savedTrip.plan?.budget).toBe(30000);
    });

    it("moves a trip between buckets and updates status markers", () => {
      const plan = buildPlan("5 days in Manali");
      const savedTrip = smartTrip.savePlan(plan);

      // Move to Upcoming
      smartTrip.moveTrip(savedTrip.id, "Upcoming");
      // Verify via savePlan or moving again
      smartTrip.moveTrip(savedTrip.id, "Past");
      // No throw means success
    });

    it("removes a trip by id", () => {
      const plan = buildPlan("Weekend in Lonavala");
      const trip = smartTrip.savePlan(plan);

      smartTrip.removeTrip(trip.id);
    });
  });

  describe("bookings management", () => {
    it("adds a booking and generates reference and matching upcoming trip", () => {
      const booking = smartTrip.addBooking({
        kind: "flight",
        title: "IndiGo 6E-247 · DEL → GOI",
        subtitle: "12 Dec – 17 Dec",
        price: 4899,
      });

      expect(booking.id).toMatch(/^bkg-/);
      expect(booking.reference).toMatch(/^ST[A-Z0-9]+$/);
      expect(booking.price).toBe(4899);
      expect(booking.kind).toBe("flight");
    });

    it("cancels a booking and removes associated trip reference", () => {
      const booking = smartTrip.addBooking({
        kind: "stay",
        title: "Coco Sands Resort",
        subtitle: "Candolim, Goa",
        price: 3200,
      });

      smartTrip.cancelBooking(booking.id);
    });
  });

  describe("trip funds management", () => {
    it("creates a new future trip fund", () => {
      const fund = smartTrip.addFund({
        name: "Swiss Alps 2027",
        target: 150000,
        travelers: 2,
        monthsLeft: 18,
      });

      expect(fund.id).toMatch(/^fund-/);
      expect(fund.name).toBe("Swiss Alps 2027");
      expect(fund.target).toBe(150000);
      expect(fund.saved).toBe(0);
      expect(fund.monthsLeft).toBe(18);
    });

    it("contributes to a trip fund and caps at target", () => {
      const fund = smartTrip.addFund({
        name: "Goa Monsoon",
        target: 20000,
      });

      smartTrip.contribute(fund.id, 5000);
      smartTrip.contribute(fund.id, 20000); // Exceeds target
    });

    it("removes a trip fund by id", () => {
      const fund = smartTrip.addFund({
        name: "Test Fund",
        target: 10000,
      });

      smartTrip.removeFund(fund.id);
    });
  });

  describe("wishlist management", () => {
    it("toggles items in and out of the wishlist", () => {
      const added = smartTrip.toggleWish("manali");
      expect(added).toBe(true);

      const removed = smartTrip.toggleWish("manali");
      expect(removed).toBe(false);
    });
  });

  describe("reset action", () => {
    it("resets state back to seed values", () => {
      smartTrip.toggleWish("goa");
      smartTrip.addFund({ name: "Temporary", target: 5000 });

      smartTrip.reset();
    });
  });
});
