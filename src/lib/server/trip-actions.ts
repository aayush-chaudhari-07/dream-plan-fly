import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getServerUser, getSupabaseServerClient } from "@/lib/supabase/server";
import type { TripBucket, BookingKind } from "@/lib/smarttrip-store";
import { images } from "@/data/travel";

// ==============================================================================
// ZOD VALIDATION SCHEMAS
// Strict validation — never trust client input.
// ==============================================================================

const planDayItemSchema = z.object({
  time: z.string(),
  activity: z.string(),
  cost: z.string(),
});

const planDaySchema = z.object({
  day: z.number().int().positive(),
  theme: z.string(),
  items: z.array(planDayItemSchema),
});

const generatedPlanSchema = z.object({
  title: z.string().min(1).max(200),
  destination: z.string().min(1).max(100),
  days: z.array(planDaySchema).min(1).max(30),
  budget: z.number().nonnegative(),
  budgetBreakdown: z.record(z.string(), z.number()),
  travelers: z.number().int().positive().max(50),
  carbonKg: z.number().nonnegative(),
  summary: z.string().max(1000),
  category: z.string().max(100),
});

const moveTripSchema = z.object({
  tripId: z.string().min(1),
  bucket: z.enum(["Upcoming", "Past", "Saved"]),
});

const removeTripSchema = z.object({
  tripId: z.string().min(1),
});

const addBookingSchema = z.object({
  kind: z.enum(["flight", "stay", "rental", "rail", "package"]),
  title: z.string().min(1).max(200),
  subtitle: z.string().min(1).max(200),
  price: z.number().nonnegative().max(10_000_000),
});

const cancelBookingSchema = z.object({
  bookingId: z.string().min(1),
});

const addFundSchema = z.object({
  name: z.string().min(1).max(100),
  target: z.number().positive().max(100_000_000),
  travelers: z.number().int().positive().max(50).optional(),
  monthsLeft: z.number().int().positive().max(120).optional(),
});

const contributeFundSchema = z.object({
  fundId: z.string().min(1),
  amount: z.number().positive().max(100_000_000),
});

const removeFundSchema = z.object({
  fundId: z.string().min(1),
});

const toggleWishSchema = z.object({
  destinationId: z.string().min(1).max(100),
});

const migrateDataSchema = z.object({
  trips: z
    .array(
      z.object({
        name: z.string(),
        dates: z.string(),
        status: z.array(z.string()),
        image: z.string(),
        bucket: z.enum(["Upcoming", "Past", "Saved"]),
        plan: z.any().optional(),
      }),
    )
    .optional(),
  bookings: z
    .array(
      z.object({
        kind: z.enum(["flight", "stay", "rental", "rail", "package"]),
        title: z.string(),
        subtitle: z.string(),
        price: z.number(),
        reference: z.string().optional(),
      }),
    )
    .optional(),
  funds: z
    .array(
      z.object({
        name: z.string(),
        target: z.number(),
        saved: z.number().optional(),
        emoji: z.string().optional(),
        targetDate: z.string().optional(),
        monthsLeft: z.number().optional(),
        travelers: z.number().optional(),
        image: z.string().optional(),
      }),
    )
    .optional(),
  wishlist: z.array(z.string()).optional(),
});

function imageFor(text: string): string {
  const t = text.toLowerCase();
  if (/goa|beach|coast/.test(t)) return images.goa;
  if (/japan|kyoto|tokyo/.test(t)) return images.japan;
  if (/kashmir|srinagar|dal/.test(t)) return images.kashmir;
  if (/maldives|island|lagoon/.test(t)) return images.maldives;
  if (/manali|himachal|hill|shimla|munnar/.test(t)) return images.manali;
  return images.hero;
}

// ==============================================================================
// SERVER FUNCTIONS
// ==============================================================================

/**
 * Get current session user on the server.
 */
export const getUserFn = createServerFn({ method: "GET" }).handler(async () => {
  const user = await getServerUser();
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    user_metadata: user.user_metadata,
  };
});

/**
 * Fetch all trips, bookings, funds, and wishlist for the authenticated user.
 */
export const fetchUserDataFn = createServerFn({ method: "GET" }).handler(async () => {
  const user = await getServerUser();
  if (!user) {
    return {
      authenticated: false,
      trips: [],
      bookings: [],
      funds: [],
      wishlist: [],
      notifications: [],
    };
  }

  const supabase = getSupabaseServerClient();

  const [tripsRes, bookingsRes, fundsRes, wishRes, notifRes] = await Promise.all([
    supabase
      .from("trips")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("bookings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("funds")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase.from("wishlist").select("destination_id").eq("user_id", user.id),
    supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  let notifications = notifRes.data || [];
  if (notifications.length === 0) {
    const seedRows = [
      {
        user_id: user.id,
        title: "Booking Confirmed",
        message: "IndiGo 6E-247 (DEL → GOI) is confirmed. Reference: #ST-89241.",
        read: false,
        type: "booking",
        link: "/bookings",
      },
      {
        user_id: user.id,
        title: "Trip Fund Milestone",
        message: "Tokyo Cherry Blossom dream fund reached 65% of your target savings!",
        read: false,
        type: "milestone",
        link: "/save",
      },
      {
        user_id: user.id,
        title: "Price Drop Alert",
        message: "Fares to Bali dropped 18% for upcoming festive dates. Explore deals now.",
        read: false,
        type: "price_drop",
        link: "/destination/bali",
      },
    ];
    try {
      const { data: inserted } = await supabase.from("notifications").insert(seedRows).select();
      if (inserted && inserted.length > 0) {
        notifications = inserted;
      }
    } catch {
      // Fallback in case of mock/demo Supabase
    }
  }

  return {
    authenticated: true,
    trips: (tripsRes.data || []).map((t) => ({
      id: t.id,
      name: t.name,
      dates: t.dates,
      status: t.status || [],
      image: t.image,
      bucket: t.bucket as TripBucket,
      plan: t.plan,
    })),
    bookings: (bookingsRes.data || []).map((b) => ({
      id: b.id,
      kind: b.kind as BookingKind,
      title: b.title,
      subtitle: b.subtitle,
      price: Number(b.price),
      reference: b.reference,
      createdAt: new Date(b.created_at).getTime(),
    })),
    funds: (fundsRes.data || []).map((f) => ({
      id: f.id,
      emoji: f.emoji || "✈️",
      name: f.name,
      target: Number(f.target),
      saved: Number(f.saved || 0),
      targetDate: f.target_date || "Date flexible",
      monthsLeft: f.months_left || 12,
      travelers: f.travelers || 2,
      image: f.image,
    })),
    wishlist: (wishRes.data || []).map((w) => w.destination_id),
    notifications: notifications.map((n) => ({
      id: n.id,
      title: n.title,
      message: n.message,
      read: Boolean(n.read),
      type: (n.type || "info") as "booking" | "milestone" | "price_drop" | "info",
      createdAt: new Date(n.created_at).getTime(),
      link: (n.link as string | null) || undefined,
    })),
  };
});

/**
 * Save an AI-generated trip plan to the user's account.
 */
export const savePlanFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => generatedPlanSchema.parse(data))
  .handler(async ({ data: plan }) => {
    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized: Please sign in to save plans to the cloud.");

    const supabase = getSupabaseServerClient();
    const tripName = plan.title.replace(/ · smart plan$/, " Plan");
    const dates = `Flexible · est. ₹${plan.budget.toLocaleString("en-IN")}`;
    const status = ["💾 AI plan saved", `🗓 ${plan.days.length}-day itinerary`];
    const image = imageFor(plan.title + " " + plan.summary);

    const { data: inserted, error } = await supabase
      .from("trips")
      .insert({
        user_id: user.id,
        name: tripName,
        dates,
        status,
        image,
        bucket: "Saved",
        plan,
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to save trip plan: ${error.message}`);
    return inserted;
  });

/**
 * Move a trip to Upcoming, Past, or Saved.
 */
export const moveTripFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => moveTripSchema.parse(data))
  .handler(async ({ data: { tripId, bucket } }) => {
    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized");

    const supabase = getSupabaseServerClient();

    // Fetch existing to append status
    const { data: existing } = await supabase
      .from("trips")
      .select("status")
      .eq("id", tripId)
      .eq("user_id", user.id)
      .single();

    const currentStatus: string[] = existing?.status || [];
    const newStatus =
      bucket === "Upcoming"
        ? [...new Set([...currentStatus, "✅ Moved to upcoming"])]
        : bucket === "Past"
          ? [...new Set([...currentStatus, "🏁 Trip completed"])]
          : currentStatus;

    const { error } = await supabase
      .from("trips")
      .update({ bucket, status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", tripId)
      .eq("user_id", user.id);

    if (error) throw new Error(`Failed to move trip: ${error.message}`);
    return { success: true, tripId, bucket };
  });

/**
 * Remove a trip from the database.
 */
export const removeTripFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => removeTripSchema.parse(data))
  .handler(async ({ data: { tripId } }) => {
    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized");

    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("trips").delete().eq("id", tripId).eq("user_id", user.id);

    if (error) throw new Error(`Failed to remove trip: ${error.message}`);
    return { success: true, tripId };
  });

/**
 * Add a booking and corresponding upcoming trip.
 */
export const addBookingFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => addBookingSchema.parse(data))
  .handler(async ({ data: input }) => {
    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized: Please sign in to book.");

    const supabase = getSupabaseServerClient();
    const reference = "ST" + Math.random().toString(36).slice(2, 8).toUpperCase();

    const { data: booking, error: bookingErr } = await supabase
      .from("bookings")
      .insert({
        user_id: user.id,
        kind: input.kind,
        title: input.title,
        subtitle: input.subtitle,
        price: input.price,
        reference,
      })
      .select()
      .single();

    if (bookingErr) throw new Error(`Failed to create booking: ${bookingErr.message}`);

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

    await supabase.from("trips").insert({
      user_id: user.id,
      name: input.title,
      dates: input.subtitle,
      status: [label, `🎫 Ref ${reference}`],
      image: imageFor(input.title + " " + input.subtitle),
      bucket: "Upcoming",
    });

    return booking;
  });

/**
 * Cancel a booking and remove linked trip.
 */
export const cancelBookingFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => cancelBookingSchema.parse(data))
  .handler(async ({ data: { bookingId } }) => {
    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized");

    const supabase = getSupabaseServerClient();

    const { data: booking } = await supabase
      .from("bookings")
      .select("reference")
      .eq("id", bookingId)
      .eq("user_id", user.id)
      .single();

    if (booking?.reference) {
      await supabase
        .from("trips")
        .delete()
        .eq("user_id", user.id)
        .contains("status", [`🎫 Ref ${booking.reference}`]);
    }

    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", bookingId)
      .eq("user_id", user.id);

    if (error) throw new Error(`Failed to cancel booking: ${error.message}`);
    return { success: true, bookingId };
  });

/**
 * Create a new Trip Fund goal.
 */
export const addFundFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => addFundSchema.parse(data))
  .handler(async ({ data: input }) => {
    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized");

    const supabase = getSupabaseServerClient();
    const { data: fund, error } = await supabase
      .from("funds")
      .insert({
        user_id: user.id,
        name: input.name,
        target: input.target,
        saved: 0,
        emoji: "✈️",
        target_date: "Date flexible",
        months_left: input.monthsLeft ?? 12,
        travelers: input.travelers ?? 2,
        image: imageFor(input.name),
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to add fund: ${error.message}`);
    return fund;
  });

/**
 * Contribute money to a Trip Fund.
 */
export const contributeFundFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => contributeFundSchema.parse(data))
  .handler(async ({ data: { fundId, amount } }) => {
    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized");

    const supabase = getSupabaseServerClient();

    const { data: fund } = await supabase
      .from("funds")
      .select("saved, target")
      .eq("id", fundId)
      .eq("user_id", user.id)
      .single();

    if (!fund) throw new Error("Fund not found");

    const newSaved = Math.min(Number(fund.target), Number(fund.saved) + amount);

    await supabase.from("fund_contributions").insert({
      user_id: user.id,
      fund_id: fundId,
      amount,
    });

    const { error } = await supabase
      .from("funds")
      .update({ saved: newSaved, updated_at: new Date().toISOString() })
      .eq("id", fundId)
      .eq("user_id", user.id);

    if (error) throw new Error(`Failed to contribute to fund: ${error.message}`);
    return { success: true, fundId, newSaved };
  });

/**
 * Remove a Trip Fund goal.
 */
export const removeFundFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => removeFundSchema.parse(data))
  .handler(async ({ data: { fundId } }) => {
    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized");

    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("funds").delete().eq("id", fundId).eq("user_id", user.id);

    if (error) throw new Error(`Failed to delete fund: ${error.message}`);
    return { success: true, fundId };
  });

/**
 * Toggle a destination in the user's wishlist.
 */
export const toggleWishFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => toggleWishSchema.parse(data))
  .handler(async ({ data: { destinationId } }) => {
    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized");

    const supabase = getSupabaseServerClient();

    const { data: existing } = await supabase
      .from("wishlist")
      .select("id")
      .eq("user_id", user.id)
      .eq("destination_id", destinationId)
      .maybeSingle();

    if (existing) {
      await supabase.from("wishlist").delete().eq("id", existing.id);
      return { inWishlist: false, destinationId };
    } else {
      await supabase.from("wishlist").insert({ user_id: user.id, destination_id: destinationId });
      return { inWishlist: true, destinationId };
    }
  });

/**
 * Migrate guest local storage data to the user account on sign-up (one-time).
 */
export const migrateGuestDataFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => migrateDataSchema.parse(data))
  .handler(async ({ data: guestData }) => {
    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized");

    const supabase = getSupabaseServerClient();

    // 1. Migrate trips (skip seed trips or duplicate names)
    if (guestData.trips && guestData.trips.length > 0) {
      const nonSeedTrips = guestData.trips.filter(
        (t) => !t.name.includes("Seed") && t.plan != null,
      );
      if (nonSeedTrips.length > 0) {
        await supabase.from("trips").insert(
          nonSeedTrips.map((t) => ({
            user_id: user.id,
            name: t.name,
            dates: t.dates,
            status: t.status,
            image: t.image,
            bucket: t.bucket,
            plan: t.plan,
          })),
        );
      }
    }

    // 2. Migrate bookings
    if (guestData.bookings && guestData.bookings.length > 0) {
      await supabase.from("bookings").insert(
        guestData.bookings.map((b) => ({
          user_id: user.id,
          kind: b.kind,
          title: b.title,
          subtitle: b.subtitle,
          price: b.price,
          reference: b.reference || "ST" + Math.random().toString(36).slice(2, 8).toUpperCase(),
        })),
      );
    }

    // 3. Migrate custom funds
    if (guestData.funds && guestData.funds.length > 0) {
      const customFunds = guestData.funds.filter((f) => Number(f.saved) > 0);
      if (customFunds.length > 0) {
        await supabase.from("funds").insert(
          customFunds.map((f) => ({
            user_id: user.id,
            name: f.name,
            target: f.target,
            saved: f.saved || 0,
            emoji: f.emoji || "✈️",
            target_date: f.targetDate || "Date flexible",
            months_left: f.monthsLeft || 12,
            travelers: f.travelers || 2,
            image: f.image || images.hero,
          })),
        );
      }
    }

    // 4. Migrate wishlist
    if (guestData.wishlist && guestData.wishlist.length > 0) {
      const uniqueWish = [...new Set(guestData.wishlist)];
      for (const destId of uniqueWish) {
        await supabase
          .from("wishlist")
          .insert({ user_id: user.id, destination_id: destId })
          .select()
          .maybeSingle();
      }
    }

    return { success: true };
  });

const updateProfileSchema = z.object({
  fullName: z.string().min(1).max(100).optional(),
  avatarUrl: z.string().max(1000).optional(),
  homeCity: z.string().max(100).optional(),
  currency: z.string().max(10).optional(),
});

const markNotificationReadSchema = z.object({
  notificationId: z.string().min(1),
});

/**
 * Mark all notifications as read for current user.
 */
export const markAllNotificationsReadFn = createServerFn({ method: "POST" }).handler(async () => {
  const user = await getServerUser();
  if (!user) return { success: true };

  const supabase = getSupabaseServerClient();
  await supabase.from("notifications").update({ read: true }).eq("user_id", user.id);
  return { success: true };
});

/**
 * Mark a single notification as read.
 */
export const markNotificationReadFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => markNotificationReadSchema.parse(data))
  .handler(async ({ data: { notificationId } }) => {
    const user = await getServerUser();
    if (!user) return { success: true };

    const supabase = getSupabaseServerClient();
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId)
      .eq("user_id", user.id);
    return { success: true };
  });

/**
 * Update user profile (name, avatar, home city, currency).
 */
export const updateProfileFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => updateProfileSchema.parse(data))
  .handler(async ({ data }) => {
    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized: Please sign in to update profile.");

    const supabase = getSupabaseServerClient();

    const updates: Record<string, string> = {
      updated_at: new Date().toISOString(),
    };
    if (data.fullName !== undefined) updates["full_name"] = data.fullName;
    if (data.avatarUrl !== undefined) updates["avatar_url"] = data.avatarUrl;
    if (data.homeCity !== undefined) updates["home_city"] = data.homeCity;
    if (data.currency !== undefined) updates["currency"] = data.currency;

    const { error } = await supabase.from("profiles").update(updates).eq("id", user.id);
    if (error) {
      console.warn("Failed to update public.profiles table:", error.message);
    }

    return { success: true };
  });

const editFundSchema = z.object({
  fundId: z.string().min(1),
  name: z.string().min(1).max(100).optional(),
  target: z.number().positive().max(100_000_000).optional(),
  targetDate: z.string().optional(),
  monthsLeft: z.number().int().positive().max(120).optional(),
  travelers: z.number().int().positive().max(50).optional(),
});

/**
 * Edit a Trip Fund's name, target, dates, or travelers.
 */
export const editFundFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => editFundSchema.parse(data))
  .handler(async ({ data }) => {
    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized");

    const supabase = getSupabaseServerClient();
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (data.name !== undefined) updates["name"] = data.name;
    if (data.target !== undefined) updates["target"] = data.target;
    if (data.targetDate !== undefined) updates["target_date"] = data.targetDate;
    if (data.monthsLeft !== undefined) updates["months_left"] = data.monthsLeft;
    if (data.travelers !== undefined) updates["travelers"] = data.travelers;

    const { data: updated, error } = await supabase
      .from("funds")
      .update(updates)
      .eq("id", data.fundId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw new Error(`Failed to edit fund: ${error.message}`);
    return updated;
  });

/**
 * Fetch contribution history for a given fund.
 */
export const fetchFundContributionsFn = createServerFn({ method: "GET" })
  .validator((data: unknown) => z.object({ fundId: z.string() }).parse(data))
  .handler(async ({ data: { fundId } }) => {
    const user = await getServerUser();
    if (!user) return [];

    const supabase = getSupabaseServerClient();
    const { data: contributions, error } = await supabase
      .from("fund_contributions")
      .select("*")
      .eq("fund_id", fundId)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) return [];
    return (contributions || []).map((c) => ({
      id: c.id,
      fundId: c.fund_id,
      amount: Number(c.amount),
      note: c.note || "Deposit",
      createdAt: new Date(c.created_at).getTime(),
    }));
  });

const submitReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  destination: z.string().min(1).max(100),
  title: z.string().min(1).max(200),
  comment: z.string().min(10).max(2000),
  tripTitle: z.string().max(200).optional(),
});

/**
 * Fetch public verified traveler reviews.
 */
export const fetchReviewsFn = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getSupabaseServerClient();
  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error || !reviews) return [];
  return reviews.map((r) => ({
    id: r.id,
    rating: Number(r.rating),
    destination: r.destination,
    title: r.title,
    comment: r.comment,
    authorName: r.author_name,
    authorAvatar: (r.author_avatar as string | null) || undefined,
    tripTitle: (r.trip_title as string | null) || undefined,
    verified: Boolean(r.verified ?? true),
    createdAt: new Date(r.created_at).getTime(),
  }));
});

/**
 * Submit a verified review. User must have an active booking or trip.
 */
export const submitReviewFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => submitReviewSchema.parse(data))
  .handler(async ({ data: input }) => {
    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized: Please sign in to post a review.");

    const supabase = getSupabaseServerClient();

    // Verify user has at least one booking or trip
    const [bookingsRes, tripsRes] = await Promise.all([
      supabase.from("bookings").select("id").eq("user_id", user.id).limit(1),
      supabase.from("trips").select("id").eq("user_id", user.id).limit(1),
    ]);

    const hasBooking = (bookingsRes.data?.length ?? 0) > 0;
    const hasTrip = (tripsRes.data?.length ?? 0) > 0;

    if (!hasBooking && !hasTrip) {
      throw new Error(
        "Verification required: Only travelers with an active booking or saved trip can post a verified review.",
      );
    }

    const authorName =
      (user.user_metadata?.["full_name"] as string) ||
      (user.user_metadata?.["name"] as string) ||
      "Verified Traveler";
    const authorAvatar =
      (user.user_metadata?.["avatar_url"] as string) ||
      (user.user_metadata?.["picture"] as string) ||
      "";

    const { data: review, error } = await supabase
      .from("reviews")
      .insert({
        user_id: user.id,
        rating: input.rating,
        destination: input.destination,
        title: input.title,
        comment: input.comment,
        author_name: authorName,
        author_avatar: authorAvatar,
        trip_title: input.tripTitle || `${input.destination} Trip`,
        verified: true,
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to submit review: ${error.message}`);
    return review;
  });

const subscribeNewsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address").max(254),
});

/**
 * Subscribe email to the newsletter with duplicate protection.
 */
export const subscribeNewsletterFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => subscribeNewsletterSchema.parse(data))
  .handler(async ({ data: { email } }) => {
    const supabase = getSupabaseServerClient();
    const normalized = email.trim().toLowerCase();

    // Check if already subscribed
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id")
      .eq("email", normalized)
      .maybeSingle();

    if (existing) {
      return {
        status: "already_subscribed",
        message: "You're already subscribed to SmartTrip updates!",
      };
    }

    const { error } = await supabase.from("newsletter_subscribers").insert({ email: normalized });

    if (error) {
      if (error.code === "23505") {
        return {
          status: "already_subscribed",
          message: "You're already subscribed to SmartTrip updates!",
        };
      }
      throw new Error(`Subscription failed: ${error.message}`);
    }

    return {
      status: "subscribed",
      message: "Welcome aboard! You're subscribed to weekly travel inspiration.",
    };
  });

const supportTicketSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(254),
  category: z.enum(["booking", "modification", "cancellation", "refund", "emergency", "general"]),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(3000),
});

/**
 * Submit a customer support / helpline inquiry ticket.
 */
export const submitSupportTicketFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => supportTicketSchema.parse(data))
  .handler(async ({ data: input }) => {
    const user = await getServerUser();
    const supabase = getSupabaseServerClient();
    const refId = "ST-" + Math.random().toString(36).slice(2, 8).toUpperCase();

    const { data: ticket, error } = await supabase
      .from("support_tickets")
      .insert({
        user_id: user?.id ?? null,
        name: input.name,
        email: input.email,
        category: input.category,
        subject: input.subject,
        message: input.message,
        status: "open",
        priority: input.category === "emergency" ? "urgent" : "normal",
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to submit support request: ${error.message}`);
    return { success: true, reference: refId, ticket };
  });
