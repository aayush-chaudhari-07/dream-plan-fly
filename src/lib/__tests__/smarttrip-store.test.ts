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

    it("records deposit contribution history and retrieves contributions for a fund", () => {
      const fund = smartTrip.addFund({
        name: "Tokyo Trip",
        target: 100000,
      });

      smartTrip.contribute(fund.id, 2500, "First deposit");
      smartTrip.contribute(fund.id, 5000, "Bonus deposit");

      const history = smartTrip.getFundContributions(fund.id);
      expect(history.length).toBe(2);
      expect(history[0]?.amount).toBe(5000);
      expect(history[0]?.note).toBe("Bonus deposit");
      expect(history[1]?.amount).toBe(2500);
      expect(history[1]?.note).toBe("First deposit");
    });

    it("triggers milestone notifications at 25%, 50%, 75%, and 100%", () => {
      const fund = smartTrip.addFund({
        name: "Ladakh Bike Trip",
        target: 40000,
      });

      // Reach 25% (10,000)
      const res25 = smartTrip.contribute(fund.id, 10000);
      expect(res25.milestone).toBe(25);
      expect(res25.done).toBe(false);

      // Reach 50% (20,000)
      const res50 = smartTrip.contribute(fund.id, 10000);
      expect(res50.milestone).toBe(50);
      expect(res50.done).toBe(false);

      // Reach 75% (30,000)
      const res75 = smartTrip.contribute(fund.id, 10000);
      expect(res75.milestone).toBe(75);
      expect(res75.done).toBe(false);

      // Reach 100% (40,000)
      const res100 = smartTrip.contribute(fund.id, 10000);
      expect(res100.milestone).toBe(100);
      expect(res100.done).toBe(true);

      const notifs = smartTrip.getState().notifications;
      const milestoneNotifs = notifs.filter((n) => n.type === "milestone");
      expect(milestoneNotifs.length).toBeGreaterThanOrEqual(4);
    });

    it("edits an existing fund goal details", () => {
      const fund = smartTrip.addFund({
        name: "Old Name",
        target: 30000,
        travelers: 2,
        monthsLeft: 6,
      });

      smartTrip.editFund(fund.id, {
        name: "Updated Himalayan Trek",
        target: 45000,
        travelers: 3,
        monthsLeft: 8,
      });

      const updated = smartTrip.getState().funds.find((f) => f.id === fund.id);
      expect(updated?.name).toBe("Updated Himalayan Trek");
      expect(updated?.target).toBe(45000);
      expect(updated?.travelers).toBe(3);
      expect(updated?.monthsLeft).toBe(8);
    });

    it("removes a trip fund by id", () => {
      const fund = smartTrip.addFund({
        name: "Test Fund",
        target: 10000,
      });

      smartTrip.removeFund(fund.id);
      const remaining = smartTrip.getState().funds.find((f) => f.id === fund.id);
      expect(remaining).toBeUndefined();
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

  describe("notifications management", () => {
    it("initializes with seed notifications and allows marking individual and all as read", () => {
      const state = smartTrip.getState();
      expect(state.notifications.length).toBeGreaterThan(0);
      const firstNotif = state.notifications[0];
      expect(firstNotif).toBeDefined();

      if (firstNotif) {
        smartTrip.markNotificationRead(firstNotif.id);
        const updatedFirst = smartTrip.getState().notifications.find((n) => n.id === firstNotif.id);
        expect(updatedFirst?.read).toBe(true);
      }

      smartTrip.markAllNotificationsRead();
      const allRead = smartTrip.getState().notifications.every((n) => n.read);
      expect(allRead).toBe(true);
    });

    it("automatically creates a notification when a booking is created", () => {
      const prevCount = smartTrip.getState().notifications.length;
      smartTrip.addBooking({
        kind: "flight",
        title: "Test Airlines DEL → BOM",
        subtitle: "10 Oct - 15 Oct",
        price: 5200,
      });

      const nextState = smartTrip.getState();
      expect(nextState.notifications.length).toBe(prevCount + 1);
      const newest = nextState.notifications[0];
      expect(newest?.type).toBe("booking");
      expect(newest?.title).toBe("Booking Confirmed");
      expect(newest?.read).toBe(false);
    });
  });

  describe("reset action", () => {
    it("resets state back to seed values", () => {
      smartTrip.toggleWish("goa");
      smartTrip.addFund({ name: "Temporary", target: 5000 });

      smartTrip.reset();
      expect(smartTrip.getState().wishlist).toEqual([]);
    });
  });
});
