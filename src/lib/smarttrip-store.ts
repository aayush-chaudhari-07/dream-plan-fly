import { useEffect, useSyncExternalStore } from "react";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";

import { images, initialFutureTrips, myTrips, type FutureTrip } from "@/data/travel";
import type { GeneratedPlan } from "@/lib/trip-plan";
import { queryClient } from "@/lib/query-client";
import {
  fetchUserDataFn,
  savePlanFn,
  moveTripFn,
  removeTripFn,
  addBookingFn,
  cancelBookingFn,
  addFundFn,
  contributeFundFn,
  removeFundFn,
  toggleWishFn,
} from "@/lib/server/trip-actions";

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
  isLoading?: boolean;
  isError?: boolean;
  isAuthenticated?: boolean;
  refetch?: () => void;
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
  isLoading: false,
  isError: false,
  isAuthenticated: false,
};

let localState: SmartTripState = SEED;
let hydrated = false;
let currentAuthUser: User | null = null;
const listeners = new Set<() => void>();

export function setStoreAuthUser(user: User | null) {
  currentAuthUser = user;
}

function emit() {
  for (const l of listeners) l();
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(localState));
  } catch {
    /* storage unavailable — keep in-memory */
  }
}

function hydrate() {
  if (hydrated) return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SmartTripState>;
      localState = {
        trips: parsed.trips ?? SEED.trips,
        bookings: parsed.bookings ?? [],
        funds: parsed.funds ?? SEED.funds,
        wishlist: parsed.wishlist ?? [],
        isLoading: false,
        isError: false,
        isAuthenticated: false,
      };
      emit();
    }
  } catch {
    /* corrupt payload — fall back to seed */
  }
}

function update(patch: Partial<SmartTripState>) {
  localState = { ...localState, ...patch };
  persist();
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Access SmartTrip state.
 * If user is authenticated, reads and caches via TanStack Query and Supabase.
 * If user is a guest, reads and writes locally via localStorage.
 */
export function useSmartTrip(): SmartTripState {
  useEffect(hydrate, []);

  const local = useSyncExternalStore(
    subscribe,
    () => localState,
    () => SEED,
  );

  const isAuth = Boolean(currentAuthUser);

  const query = useQuery({
    queryKey: ["smarttrip-data", currentAuthUser?.id],
    queryFn: async () => {
      const res = await fetchUserDataFn();
      return res;
    },
    enabled: isAuth,
  });

  if (isAuth) {
    if (query.isLoading) {
      return {
        trips: local.trips,
        bookings: local.bookings,
        funds: local.funds,
        wishlist: local.wishlist,
        isLoading: true,
        isError: false,
        isAuthenticated: true,
        refetch: () => query.refetch(),
      };
    }

    if (query.isError) {
      return {
        trips: local.trips,
        bookings: local.bookings,
        funds: local.funds,
        wishlist: local.wishlist,
        isLoading: false,
        isError: true,
        isAuthenticated: true,
        refetch: () => query.refetch(),
      };
    }

    if (query.data && query.data.authenticated) {
      return {
        trips: query.data.trips,
        bookings: query.data.bookings,
        funds: query.data.funds,
        wishlist: query.data.wishlist,
        isLoading: false,
        isError: false,
        isAuthenticated: true,
        refetch: () => query.refetch(),
      };
    }
  }

  return {
    ...local,
    isLoading: false,
    isError: false,
    isAuthenticated: false,
  };
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

    // Optimistic local update
    update({ trips: [trip, ...localState.trips] });

    // Authenticated server update
    if (currentAuthUser) {
      queryClient.setQueryData(
        ["smarttrip-data", currentAuthUser.id],
        (old: { trips?: StoredTrip[]; [key: string]: unknown } | undefined) => ({
          ...old,
          trips: [trip, ...(old?.trips || [])],
        }),
      );

      savePlanFn({ data: plan })
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["smarttrip-data"] });
        })
        .catch((err) => {
          console.error("Failed to sync plan to server:", err);
          toast.error("Could not sync plan to cloud. Stored locally.");
        });
    }

    return trip;
  },

  moveTrip(tripId: string, bucket: TripBucket) {
    const patchTrips = (trips: StoredTrip[]) =>
      trips.map((t) =>
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
      );

    update({ trips: patchTrips(localState.trips) });

    if (currentAuthUser) {
      queryClient.setQueryData(
        ["smarttrip-data", currentAuthUser.id],
        (old: { trips?: StoredTrip[]; [key: string]: unknown } | undefined) => ({
          ...old,
          trips: patchTrips(old?.trips || []),
        }),
      );

      moveTripFn({ data: { tripId, bucket } })
        .then(() => queryClient.invalidateQueries({ queryKey: ["smarttrip-data"] }))
        .catch((err) => {
          console.error("Failed to move trip on server:", err);
          toast.error("Could not sync trip update to cloud.");
        });
    }
  },

  removeTrip(tripId: string) {
    update({ trips: localState.trips.filter((t) => t.id !== tripId) });

    if (currentAuthUser) {
      queryClient.setQueryData(
        ["smarttrip-data", currentAuthUser.id],
        (old: { trips?: StoredTrip[]; [key: string]: unknown } | undefined) => ({
          ...old,
          trips: (old?.trips || []).filter((t) => t.id !== tripId),
        }),
      );

      removeTripFn({ data: { tripId } })
        .then(() => queryClient.invalidateQueries({ queryKey: ["smarttrip-data"] }))
        .catch((err) => {
          console.error("Failed to remove trip on server:", err);
          toast.error("Could not remove trip from cloud.");
        });
    }
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

    update({
      bookings: [booking, ...localState.bookings],
      trips: [trip, ...localState.trips],
    });

    if (currentAuthUser) {
      queryClient.setQueryData(
        ["smarttrip-data", currentAuthUser.id],
        (
          old:
            | { bookings?: StoredBooking[]; trips?: StoredTrip[]; [key: string]: unknown }
            | undefined,
        ) => ({
          ...old,
          bookings: [booking, ...(old?.bookings || [])],
          trips: [trip, ...(old?.trips || [])],
        }),
      );

      addBookingFn({ data: input })
        .then(() => queryClient.invalidateQueries({ queryKey: ["smarttrip-data"] }))
        .catch((err) => {
          console.error("Failed to sync booking to server:", err);
          toast.error("Booking saved locally; cloud sync failed.");
        });
    }

    return booking;
  },

  cancelBooking(bookingId: string) {
    const booking = localState.bookings.find((b) => b.id === bookingId);
    update({
      bookings: localState.bookings.filter((b) => b.id !== bookingId),
      trips: booking
        ? localState.trips.filter((t) => !t.status.some((s) => s.includes(booking.reference)))
        : localState.trips,
    });

    if (currentAuthUser) {
      queryClient.setQueryData(
        ["smarttrip-data", currentAuthUser.id],
        (
          old:
            | { bookings?: StoredBooking[]; trips?: StoredTrip[]; [key: string]: unknown }
            | undefined,
        ) => ({
          ...old,
          bookings: (old?.bookings || []).filter((b) => b.id !== bookingId),
          trips: booking
            ? (old?.trips || []).filter((t) => !t.status.some((s) => s.includes(booking.reference)))
            : old?.trips || [],
        }),
      );

      cancelBookingFn({ data: { bookingId } })
        .then(() => queryClient.invalidateQueries({ queryKey: ["smarttrip-data"] }))
        .catch((err) => {
          console.error("Failed to cancel booking on server:", err);
          toast.error("Could not cancel booking in cloud.");
        });
    }
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

    update({ funds: [fund, ...localState.funds] });

    if (currentAuthUser) {
      queryClient.setQueryData(
        ["smarttrip-data", currentAuthUser.id],
        (old: { funds?: FutureTrip[]; [key: string]: unknown } | undefined) => ({
          ...old,
          funds: [fund, ...(old?.funds || [])],
        }),
      );

      addFundFn({ data: input })
        .then(() => queryClient.invalidateQueries({ queryKey: ["smarttrip-data"] }))
        .catch((err) => {
          console.error("Failed to add fund on server:", err);
          toast.error("Could not save fund goal to cloud.");
        });
    }

    return fund;
  },

  contribute(fundId: string, amount: number) {
    const patchFunds = (funds: FutureTrip[]) =>
      funds.map((f) =>
        f.id === fundId ? { ...f, saved: Math.min(f.target, f.saved + amount) } : f,
      );

    update({ funds: patchFunds(localState.funds) });

    if (currentAuthUser) {
      queryClient.setQueryData(
        ["smarttrip-data", currentAuthUser.id],
        (old: { funds?: FutureTrip[]; [key: string]: unknown } | undefined) => ({
          ...old,
          funds: patchFunds(old?.funds || []),
        }),
      );

      contributeFundFn({ data: { fundId, amount } })
        .then(() => queryClient.invalidateQueries({ queryKey: ["smarttrip-data"] }))
        .catch((err) => {
          console.error("Failed to contribute to fund on server:", err);
          toast.error("Could not record contribution in cloud.");
        });
    }
  },

  removeFund(fundId: string) {
    update({ funds: localState.funds.filter((f) => f.id !== fundId) });

    if (currentAuthUser) {
      queryClient.setQueryData(
        ["smarttrip-data", currentAuthUser.id],
        (old: { funds?: FutureTrip[]; [key: string]: unknown } | undefined) => ({
          ...old,
          funds: (old?.funds || []).filter((f) => f.id !== fundId),
        }),
      );

      removeFundFn({ data: { fundId } })
        .then(() => queryClient.invalidateQueries({ queryKey: ["smarttrip-data"] }))
        .catch((err) => {
          console.error("Failed to remove fund on server:", err);
          toast.error("Could not delete fund goal from cloud.");
        });
    }
  },

  /* ---------- wishlist ---------- */
  toggleWish(destinationId: string) {
    const has = localState.wishlist.includes(destinationId);
    const newWish = has
      ? localState.wishlist.filter((x) => x !== destinationId)
      : [...localState.wishlist, destinationId];

    update({ wishlist: newWish });

    if (currentAuthUser) {
      queryClient.setQueryData(
        ["smarttrip-data", currentAuthUser.id],
        (old: { wishlist?: string[]; [key: string]: unknown } | undefined) => ({
          ...old,
          wishlist: newWish,
        }),
      );

      toggleWishFn({ data: { destinationId } })
        .then(() => queryClient.invalidateQueries({ queryKey: ["smarttrip-data"] }))
        .catch((err) => {
          console.error("Failed to toggle wish on server:", err);
          toast.error("Could not update wishlist in cloud.");
        });
    }

    return !has;
  },

  reset() {
    update({ ...SEED, trips: seedTrips() });
  },
};
