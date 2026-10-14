import { describe, it, expect, beforeEach } from "vitest";
import { smartTrip } from "@/client/lib/smarttrip-store";

describe("Booking Lifecycle & Idempotency", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("creates a booking with reference, status and fare breakdown", () => {
    const booking = smartTrip.addBooking({
      kind: "flight",
      title: "IndiGo 6E-247 · DEL to GOI",
      subtitle: "15 Dec · Non-stop",
      price: 4899,
      reference: "STFL12345",
      idempotencyKey: "idem_flight_test_01",
      travelerDetails: {
        fullName: "Aayush Chaudhari",
        email: "traveler@smarttrip.demo",
        phone: "+91 98765 43210",
      },
      fareBreakdown: {
        baseFare: 4374,
        taxesAndFees: 525,
        convenienceFee: 0,
        discount: 149,
        total: 4899,
      },
    });

    expect(booking.reference).toBe("STFL12345");
    expect(booking.status).toBe("confirmed");
    expect(booking.idempotencyKey).toBe("idem_flight_test_01");
    expect(booking.travelerDetails?.fullName).toBe("Aayush Chaudhari");
    expect(booking.fareBreakdown?.total).toBe(4899);

    // Automatically added upcoming trip
    const trips = smartTrip.getState().trips;
    const upcomingTrip = trips.find((t) => t.status.some((s) => s.includes("STFL12345")));
    expect(upcomingTrip).toBeDefined();
    expect(upcomingTrip?.bucket).toBe("Upcoming");

    // Automatically added confirmation notification
    const notifications = smartTrip.getState().notifications;
    const notif = notifications.find((n) => n.link?.includes("STFL12345"));
    expect(notif).toBeDefined();
    expect(notif?.title).toBe("Booking Confirmed");
  });

  it("cancels booking, removes upcoming trip, and records cancelled status", () => {
    const booking = smartTrip.addBooking({
      kind: "stay",
      title: "Taj Fort Aguada Resort",
      subtitle: "Candolim, Goa",
      price: 14500,
      reference: "STHT98765",
    });

    // Cancel booking
    smartTrip.cancelBooking(booking.id);

    // Linked trip must be removed
    const tripsAfter = smartTrip.getState().trips;
    const remainingTrip = tripsAfter.find((t) => t.status.some((s) => s.includes("STHT98765")));
    expect(remainingTrip).toBeUndefined();
  });
});
