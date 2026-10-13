import { useEffect, useSyncExternalStore } from "react";

import { images, initialFutureTrips, myTrips, type FutureTrip } from "@/data/travel";
import type { GeneratedPlan } from "@/lib/trip-plan";

export type TripBucket = "Upcoming" | "Past" | "Saved";

export type StoredTrip = {
  id: string;
  name: string;
  dates: string;
  status: string[];
  image: string;
  bucket: TripBucket;
  plan?: GeneratedPlan;
};

export type BookingKind = "flight" | "stay" | "rental" | "rail" | "package";

export type StoredBooking = {
  id: string;
  kind: BookingKind;
  title: string;
  subtitle: string;
  price: number;
  reference: string;
  createdAt: number;
};

export type SmartTripState = {
  trips: StoredTrip[];
  bookings: StoredBooking[];
  funds: FutureTrip[];
  wishlist: string[];
};

const STORAGE_KEY = "smarttrip.state.v1";

function seedTrips(): StoredTrip[] {
  return (Object.keys(myTrips) as TripBucket[]).flatMap((bucket) =>
    myTrips[bucket].map((t, i) => ({
      id: `seed-${bucket}-${i}`,
      name: t.name,
      dates: t.dates,
      status: t.status,
      image: t.image,
      bucket,
    })),
  );
}

const SEED: SmartTripState = {
  trips: seedTrips(),
  bookings: [],
  funds: initialFutureTrips,
  wishlist: [],
};

let state: SmartTripState = SEED;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable — keep in-memory state */
  }
}

function hydrate() {
  if (hydrated) return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SmartTripState>;
      state = {
        trips: parsed.trips ?? SEED.trips,
        bookings: parsed.bookings ?? [],
        funds: parsed.funds ?? SEED.funds,
        wishlist: parsed.wishlist ?? [],
      };
      emit();
    }
  } catch {
    /* corrupt payload — fall back to seed */
  }
}

function update(patch: Partial<SmartTripState>) {
  state = { ...state, ...patch };
  persist();
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Reactive access to the persisted SmartTrip state (safe for SSR). */
export function useSmartTrip(): SmartTripState {
  useEffect(hydrate, []);
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => SEED,
  );
}

const id = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

function imageFor(text: string): string {
  const t = text.toLowerCase();
  if (/goa|beach|coast/.test(t)) return images.goa;
  if (/japan|kyoto|tokyo/.test(t)) return images.japan;
  if (/kashmir|srinagar|dal/.test(t)) return images.kashmir;
  if (/maldives|island|lagoon/.test(t)) return images.maldives;
  if (/manali|himachal|hill|shimla|munnar/.test(t)) return images.manali;
  return images.hero;
}

export const smartTrip = {
  /* ---------- trips ---------- */
  savePlan(plan: GeneratedPlan) {
    const trip: StoredTrip = {
      id: id("trip"),
      name: plan.title.replace(/ · smart plan$/, " Plan"),
      dates: `Flexible · est. ₹${plan.budget.toLocaleString("en-IN")}`,
      status: ["💾 AI plan saved", `🗓 ${plan.days.length}-day itinerary`],
      image: imageFor(plan.title + " " + plan.summary),
      bucket: "Saved",
      plan,
    };
    update({ trips: [trip, ...state.trips] });
    return trip;
  },

  moveTrip(tripId: string, bucket: TripBucket) {
    update({
      trips: state.trips.map((t) =>
        t.id === tripId
          ? {
              ...t,
              bucket,
              status:
                bucket === "Upcoming"
                  ? [...new Set([...t.status, "✅ Moved to upcoming"])]
                  : bucket === "Past"
                    ? [...new Set([...t.status, "🏁 Trip completed"])]
                    : t.status,
            }
          : t,
      ),
    });
  },

  removeTrip(tripId: string) {
    update({ trips: state.trips.filter((t) => t.id !== tripId) });
  },

  /* ---------- bookings ---------- */
  addBooking(input: { kind: BookingKind; title: string; subtitle: string; price: number }) {
    const booking: StoredBooking = {
      ...input,
      id: id("bkg"),
      reference: "ST" + Math.random().toString(36).slice(2, 8).toUpperCase(),
      createdAt: Date.now(),
    };
    const label =
      input.kind === "flight"
        ? "✈ Flight booked"
        : input.kind === "stay"
          ? "🏨 Stay booked"
          : input.kind === "rental"
            ? "🚗 Rental booked"
            : input.kind === "rail"
              ? "🚆 Train/Bus booked"
              : "🎁 Package booked";

    const trip: StoredTrip = {
      id: id("trip"),
      name: input.title,
      dates: input.subtitle,
      status: [label, `🎫 Ref ${booking.reference}`],
      image: imageFor(input.title + " " + input.subtitle),
      bucket: "Upcoming",
    };

    update({ bookings: [booking, ...state.bookings], trips: [trip, ...state.trips] });
    return booking;
  },

  cancelBooking(bookingId: string) {
    const booking = state.bookings.find((b) => b.id === bookingId);
    update({
      bookings: state.bookings.filter((b) => b.id !== bookingId),
      trips: booking
        ? state.trips.filter((t) => !t.status.some((s) => s.includes(booking.reference)))
        : state.trips,
    });
  },

  /* ---------- trip funds ---------- */
  addFund(input: { name: string; target: number; travelers?: number; monthsLeft?: number }) {
    const fund: FutureTrip = {
      id: id("fund"),
      emoji: "✈️",
      name: input.name,
      target: input.target,
      saved: 0,
      targetDate: "Date flexible",
      monthsLeft: input.monthsLeft ?? 12,
      travelers: input.travelers ?? 2,
      image: imageFor(input.name),
    };
    update({ funds: [fund, ...state.funds] });
    return fund;
  },

  contribute(fundId: string, amount: number) {
    update({
      funds: state.funds.map((f) =>
        f.id === fundId ? { ...f, saved: Math.min(f.target, f.saved + amount) } : f,
      ),
    });
  },

  removeFund(fundId: string) {
    update({ funds: state.funds.filter((f) => f.id !== fundId) });
  },

  /* ---------- wishlist ---------- */
  toggleWish(destinationId: string) {
    const has = state.wishlist.includes(destinationId);
    update({
      wishlist: has
        ? state.wishlist.filter((x) => x !== destinationId)
        : [...state.wishlist, destinationId],
    });
    return !has;
  },

  reset() {
    update({ ...SEED, trips: seedTrips() });
  },
};
