import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getServerUser, getSupabaseServerClient } from "@/lib/supabase/server";
import { getPaymentProvider, generateDemoSignature, type PaymentMethod } from "@/server/payments";
import {
  INVENTORY_STAYS,
  INVENTORY_RENTALS,
  INVENTORY_TRANSIT,
  INVENTORY_PACKAGES,
} from "@/data/inventory-data";
import { images } from "@/data/travel";

// Helper image fallback
function imageFor(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("goa")) return images.goa;
  if (t.includes("manali")) return images.manali;
  if (t.includes("kashmir") || t.includes("srinagar") || t.includes("gulmarg"))
    return images.kashmir;
  if (t.includes("japan") || t.includes("tokyo") || t.includes("kyoto")) return images.japan;
  if (t.includes("maldives")) return images.maldives;
  return images.hero;
}

// Prefix for references
function prefixForKind(kind: string): string {
  switch (kind) {
    case "flight":
      return "STFL";
    case "stay":
      return "STHT";
    case "rental":
      return "STRN";
    case "rail":
      return "STRL";
    case "package":
      return "STPK";
    default:
      return "STBK";
  }
}

// ==============================================================================
// 1. CREATE BOOKING ORDER (Payment Init)
// ==============================================================================

const createBookingOrderSchema = z.object({
  amount: z.number().positive().max(10_000_000),
  title: z.string().min(1).max(200),
  kind: z.enum(["flight", "stay", "rental", "rail", "package"]),
  idempotencyKey: z.string().min(5).max(100),
});

export const createBookingOrderFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => createBookingOrderSchema.parse(data))
  .handler(async ({ data: input }) => {
    const user = await getServerUser();
    // Allow guest or authenticated user
    const provider = getPaymentProvider();

    const order = await provider.createOrder({
      amount: input.amount,
      receipt: `rcpt_${input.idempotencyKey.slice(0, 16)}`,
      notes: {
        title: input.title,
        kind: input.kind,
        userId: user?.id || "guest",
      },
    });

    const paymentId = `demo_pay_${Date.now()}`;
    const demoSignature = generateDemoSignature(order.orderId, paymentId, input.amount);

    return {
      orderId: order.orderId,
      paymentId,
      amount: input.amount,
      currency: order.currency,
      provider: order.provider,
      keyId: order.keyId,
      demoSignature,
    };
  });

// ==============================================================================
// 2. VERIFY PAYMENT & CONFIRM BOOKING
// ==============================================================================

const travelerDetailsSchema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(7).max(20),
  gender: z.string().optional(),
  age: z.number().int().min(1).max(120).optional(),
  seatPreference: z.string().optional(),
  notes: z.string().max(500).optional(),
});

const fareBreakdownSchema = z.object({
  baseFare: z.number().nonnegative(),
  taxesAndFees: z.number().nonnegative(),
  convenienceFee: z.number().nonnegative(),
  discount: z.number().nonnegative(),
  total: z.number().positive(),
});

const confirmBookingSchema = z.object({
  orderId: z.string().min(1),
  paymentId: z.string().min(1),
  amount: z.number().positive(),
  signature: z.string().min(1),
  paymentMethod: z.enum(["card", "upi", "netbanking"]),
  idempotencyKey: z.string().min(5).max(100),
  bookingDetails: z.object({
    kind: z.enum(["flight", "stay", "rental", "rail", "package"]),
    title: z.string().min(1).max(200),
    subtitle: z.string().min(1).max(200),
    price: z.number().positive(),
    origin: z.string().optional(),
    destination: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    inventoryId: z.string().optional(),
    passengersCount: z.number().int().min(1).max(50).default(1),
    cabinClass: z.string().optional(),
    travelerDetails: travelerDetailsSchema,
    fareBreakdown: fareBreakdownSchema,
  }),
  cardLast4: z.string().optional(),
  cardholderName: z.string().optional(),
  vpa: z.string().optional(),
  bankCode: z.string().optional(),
  simulatedOutcome: z.enum(["success", "failure", "insufficient_funds", "pending"]).optional(),
});

export const verifyAndConfirmBookingFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => confirmBookingSchema.parse(data))
  .handler(async ({ data: input }) => {
    const user = await getServerUser();
    const provider = getPaymentProvider();

    // 1. Verify Payment via Provider
    const verification = await provider.verifyPayment({
      orderId: input.orderId,
      paymentId: input.paymentId,
      amount: input.amount,
      signature: input.signature,
      method: input.paymentMethod as PaymentMethod,
      simulatedOutcome: input.simulatedOutcome,
      upiDetails: input.vpa ? { vpa: input.vpa } : undefined,
      netBankingDetails: input.bankCode ? { bankCode: input.bankCode } : undefined,
      cardDetails: input.cardLast4
        ? {
            cardNumber: input.cardLast4,
            expiryMonth: "12",
            expiryYear: "2030",
            cvv: "123",
            cardholderName: input.cardholderName || "Demo Traveler",
          }
        : undefined,
    });

    if (!verification.success) {
      throw new Error(verification.message || "Payment verification failed.");
    }

    // 2. Prepare database operation
    const supabase = getSupabaseServerClient();
    const bDetails = input.bookingDetails;

    // Check Idempotency: if booking already exists with this key, return it without duplicate creation!
    if (user) {
      try {
        const { data: existing } = await supabase
          .from("bookings")
          .select("*")
          .eq("user_id", user.id)
          .eq("idempotency_key", input.idempotencyKey)
          .single();

        if (existing) {
          return {
            success: true,
            booking: existing,
            isDuplicate: true,
            message: "Existing booking retrieved via idempotency key.",
          };
        }
      } catch {
        // Table might be local or error, proceed to create
      }
    }

    const reference = `${prefixForKind(bDetails.kind)}-${Math.floor(10000 + Math.random() * 90000)}`;

    const paymentDetailsRecord = {
      method: input.paymentMethod,
      transactionRef: verification.transactionRef,
      paymentId: input.paymentId,
      orderId: input.orderId,
      paidAt: Date.now(),
      maskedInstrument:
        input.paymentMethod === "card"
          ? `Card •••• ${input.cardLast4?.slice(-4) || "0002"}`
          : input.paymentMethod === "upi"
            ? `UPI (${input.vpa || "demo@smarttrip"})`
            : `NetBanking (${input.bankCode || "HDFC Bank"})`,
      amount: input.amount,
    };

    let savedBooking = {
      id: `bkg-${reference.toLowerCase()}`,
      user_id: user?.id || null,
      kind: bDetails.kind,
      title: bDetails.title,
      subtitle: bDetails.subtitle,
      price: bDetails.price,
      reference,
      status: "confirmed",
      idempotency_key: input.idempotencyKey,
      traveler_details: bDetails.travelerDetails,
      payment_details: paymentDetailsRecord,
      fare_breakdown: bDetails.fareBreakdown,
      origin: bDetails.origin,
      destination: bDetails.destination,
      start_date: bDetails.startDate,
      end_date: bDetails.endDate,
      inventory_id: bDetails.inventoryId,
      passengers_count: bDetails.passengersCount,
      cabin_class: bDetails.cabinClass,
      created_at: new Date().toISOString(),
    };

    if (user) {
      try {
        const { data: dbBooking, error: bookingErr } = await supabase
          .from("bookings")
          .insert({
            user_id: user.id,
            kind: bDetails.kind,
            title: bDetails.title,
            subtitle: bDetails.subtitle,
            price: bDetails.price,
            reference,
            status: "confirmed",
            idempotency_key: input.idempotencyKey,
            traveler_details: bDetails.travelerDetails,
            payment_details: paymentDetailsRecord,
            fare_breakdown: bDetails.fareBreakdown,
            origin: bDetails.origin,
            destination: bDetails.destination,
            start_date: bDetails.startDate,
            end_date: bDetails.endDate,
            inventory_id: bDetails.inventoryId,
            passengers_count: bDetails.passengersCount,
            cabin_class: bDetails.cabinClass,
          })
          .select()
          .single();

        if (dbBooking) {
          savedBooking = dbBooking;
        }

        if (bookingErr) {
          console.warn("Could not insert booking to Supabase:", bookingErr.message);
        }

        // Auto-create upcoming trip
        const label =
          bDetails.kind === "flight"
            ? "✈ Flight confirmed"
            : bDetails.kind === "stay"
              ? "🏨 Stay confirmed"
              : bDetails.kind === "rental"
                ? "🚗 Rental confirmed"
                : bDetails.kind === "rail"
                  ? "🚆 Train/Bus confirmed"
                  : "🎁 Package confirmed";

        await supabase.from("trips").insert({
          user_id: user.id,
          name: bDetails.title,
          dates: bDetails.subtitle,
          status: [label, `🎫 Ref ${reference}`, `👤 ${bDetails.travelerDetails.fullName}`],
          image: imageFor(bDetails.title + " " + bDetails.subtitle),
          bucket: "Upcoming",
        });

        // Insert notification
        await supabase.from("notifications").insert({
          user_id: user.id,
          title: "Booking Confirmed",
          message: `${bDetails.title} is confirmed. Ref: #${reference}. E-Ticket available.`,
          read: false,
          type: "booking",
          link: `/booking-confirmation/${reference}`,
        });
      } catch (err) {
        console.warn("Supabase booking persistence warning:", err);
      }
    }

    return {
      success: true,
      booking: savedBooking,
      reference,
      message: "Booking confirmed successfully! E-ticket ready.",
    };
  });

// ==============================================================================
// 3. CANCEL BOOKING WITH REFUND
// ==============================================================================

const cancelRefundSchema = z.object({
  bookingId: z.string().min(1),
  reason: z.string().max(300).optional(),
});

export const cancelBookingWithRefundFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => cancelRefundSchema.parse(data))
  .handler(async ({ data: { bookingId, reason } }) => {
    const user = await getServerUser();
    const supabase = getSupabaseServerClient();
    const provider = getPaymentProvider();

    let bookingRef = "";
    let bookingAmount = 0;
    let paymentId = "";

    if (user) {
      const { data: b } = await supabase
        .from("bookings")
        .select("*")
        .eq("id", bookingId)
        .eq("user_id", user.id)
        .single();

      if (b) {
        bookingRef = b.reference;
        bookingAmount = Number(b.price);
        paymentId = (b.payment_details as { paymentId?: string })?.paymentId || `pay_${bookingId}`;
      }
    }

    // Process refund with provider
    const refundRes = await provider.refund({
      paymentId: paymentId || `demo_pay_${bookingId}`,
      amount: bookingAmount || 0,
      reason: reason || "User requested demo cancellation",
    });

    if (user && bookingRef) {
      // Update booking status to cancelled
      await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", bookingId)
        .eq("user_id", user.id);

      // Remove upcoming trip
      await supabase
        .from("trips")
        .delete()
        .eq("user_id", user.id)
        .contains("status", [`🎫 Ref ${bookingRef}`]);

      // Add notification
      await supabase.from("notifications").insert({
        user_id: user.id,
        title: "Booking Cancelled & Refunded",
        message: `Booking #${bookingRef} was cancelled. ${refundRes.message}`,
        read: false,
        type: "booking",
        link: "/my-trips",
      });
    }

    return {
      success: true,
      refundId: refundRes.refundId,
      refundAmount: refundRes.amount,
      message: refundRes.message,
    };
  });

// ==============================================================================
// 4. FETCH INVENTORY DATA (Stays, Rentals, Transit, Packages)
// ==============================================================================

const fetchInventorySchema = z.object({
  category: z.enum(["stays", "rentals", "transit", "packages"]),
  destination: z.string().optional(),
});

export const fetchInventoryFn = createServerFn({ method: "GET" })
  .validator((data: unknown) => fetchInventorySchema.parse(data))
  .handler(async ({ data: { category, destination } }) => {
    const supabase = getSupabaseServerClient();

    try {
      if (category === "stays") {
        let q = supabase.from("inventory_stays").select("*");
        if (destination && destination !== "all") {
          q = q.ilike("destination", `%${destination}%`);
        }
        const { data, error } = await q;
        if (!error && data && data.length > 0) return data;
      } else if (category === "rentals") {
        let q = supabase.from("inventory_rentals").select("*");
        if (destination && destination !== "all") {
          q = q.ilike("destination", `%${destination}%`);
        }
        const { data, error } = await q;
        if (!error && data && data.length > 0) return data;
      } else if (category === "transit") {
        const { data, error } = await supabase.from("inventory_transit").select("*");
        if (!error && data && data.length > 0) return data;
      } else if (category === "packages") {
        let q = supabase.from("inventory_packages").select("*");
        if (destination && destination !== "all") {
          q = q.ilike("destination", `%${destination}%`);
        }
        const { data, error } = await q;
        if (!error && data && data.length > 0) return data;
      }
    } catch {
      // Fallback below
    }

    // Local in-memory fallback
    if (category === "stays") {
      if (destination && destination !== "all") {
        return INVENTORY_STAYS.filter((s) =>
          s.destination.toLowerCase().includes(destination.toLowerCase()),
        );
      }
      return INVENTORY_STAYS;
    }

    if (category === "rentals") {
      if (destination && destination !== "all") {
        return INVENTORY_RENTALS.filter((r) =>
          r.destination.toLowerCase().includes(destination.toLowerCase()),
        );
      }
      return INVENTORY_RENTALS;
    }

    if (category === "transit") {
      return INVENTORY_TRANSIT;
    }

    if (category === "packages") {
      if (destination && destination !== "all") {
        return INVENTORY_PACKAGES.filter((p) =>
          p.destination.toLowerCase().includes(destination.toLowerCase()),
        );
      }
      return INVENTORY_PACKAGES;
    }

    return [];
  });
