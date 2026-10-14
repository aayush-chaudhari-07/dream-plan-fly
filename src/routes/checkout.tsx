import { useState, useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ShieldAlert,
  ArrowRight,
  Plane,
  Hotel,
  Car,
  Bus,
  Luggage,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/smarttrip/Navbar";
import { Footer } from "@/components/smarttrip/Footer";
import { PageHeader } from "@/components/smarttrip/PageHeader";
import { SupportDock } from "@/components/smarttrip/SupportDock";
import { inr } from "@/data/travel";
import { DemoPaymentModal } from "@/components/smarttrip/booking/DemoPaymentModal";
import type { StoredBooking } from "@/lib/smarttrip-store";

const checkoutSearchSchema = z.object({
  kind: z.enum(["flight", "stay", "rental", "rail", "package"]).optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  price: z.coerce.number().optional(),
  origin: z.string().optional(),
  destination: z.string().optional(),
  date: z.string().optional(),
  travelers: z.coerce.number().optional(),
  cabinClass: z.string().optional(),
  inventoryId: z.string().optional(),
});

const travelerFormSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15),
  gender: z.enum(["male", "female", "other"]),
  age: z.coerce.number().min(1, "Age must be at least 1").max(120, "Age must be less than 120"),
  seatPreference: z.string().optional(),
  notes: z.string().max(500).optional(),
});

type TravelerFormData = {
  fullName: string;
  email: string;
  phone: string;
  gender: "male" | "female" | "other";
  age: number;
  seatPreference?: string | undefined;
  notes?: string | undefined;
};

import { createSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/checkout")({
  validateSearch: (search) => checkoutSearchSchema.parse(search),
  head: () =>
    createSeoHead({
      title: "Secure Demo Checkout",
      description: "Simulated zero-cost demo checkout with test payment gateway.",
      path: "/checkout",
      noindex: true,
    }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();

  const searchKind = search.kind || "flight";
  const searchTitle = search.title || "IndiGo 6E-247 · Delhi to Goa";
  const searchSubtitle = search.subtitle || "15 Dec · Non-stop (2h 30m)";
  const totalPrice = search.price || 4899;
  const searchTravelers = search.travelers || 1;
  const searchCabinClass = search.cabinClass || "economy";

  // Deterministic Idempotency Key generated per session
  const idempotencyKey = useMemo(() => {
    const rand = Math.random().toString(36).substring(2, 10);
    return `idem_${searchKind}_${totalPrice}_${Date.now()}_${rand}`;
  }, [searchKind, totalPrice]);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [validatedTraveler, setValidatedTraveler] = useState<TravelerFormData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TravelerFormData>({
    resolver: zodResolver(travelerFormSchema) as never,
    defaultValues: {
      fullName: "Aayush Chaudhari",
      email: "traveler@smarttrip.demo",
      phone: "9876543210",
      gender: "male",
      age: 26,
      seatPreference: "Window",
    },
  });

  // Calculate fare breakdown
  const baseFare = Math.round(totalPrice / 1.12);
  const taxesAndFees = totalPrice - baseFare;
  const convenienceFee = 149;
  const discount = 149; // Waived in demo mode

  const fareBreakdown = {
    baseFare,
    taxesAndFees,
    convenienceFee: 0,
    discount: 149,
    total: totalPrice,
  };

  const onSubmit = (data: TravelerFormData) => {
    setValidatedTraveler(data);
    setIsPaymentModalOpen(true);
  };

  const handleBookingSuccess = (booking: StoredBooking) => {
    navigate({
      to: "/booking-confirmation/$id",
      params: { id: booking.reference },
    });
  };

  const IconComponent =
    search.kind === "flight"
      ? Plane
      : search.kind === "stay"
        ? Hotel
        : search.kind === "rental"
          ? Car
          : search.kind === "rail"
            ? Bus
            : Luggage;

  return (
    <>
      <Navbar />
      <PageHeader
        title="Demo Checkout"
        subtitle="Simulated reservation flow · Zero monetary charges · Instant E-ticket with QR code."
      />

      <main className="container-page -mt-8 pb-16">
        {/* Permanent Demo Warning Banner */}
        <div
          className="mb-6 flex items-start gap-3.5 rounded-3xl border-2 border-amber-500/40 bg-amber-500/10 p-5 text-amber-950 dark:text-amber-200 shadow-soft"
          data-testid="demo-booking-banner"
        >
          <ShieldAlert className="size-6 shrink-0 text-amber-500 mt-0.5" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wide uppercase">
                Demo Booking Environment
              </span>
              <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-semibold">
                No Real Charges
              </span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-amber-900/80 dark:text-amber-300/80">
              This reservation runs completely on free demo tools. Real card numbers are strictly
              prohibited. Use the provided Test Cards, UPI, or Net Banking credentials to simulate
              production checkout.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Traveler Information Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="surface-card p-6 sm:p-8">
              <h2 className="font-display text-xl font-bold mb-1">Traveler Details</h2>
              <p className="text-xs text-muted-foreground mb-6">
                Enter primary passenger contact details for the E-ticket and SMS alerts.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="fullName" className="text-xs font-semibold">
                      Full Name (as on Govt ID) *
                    </Label>
                    <Input
                      id="fullName"
                      {...register("fullName")}
                      placeholder="e.g. Aayush Chaudhari"
                      data-testid="checkout-traveler-name"
                    />
                    {errors.fullName && (
                      <p className="text-xs text-destructive">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-semibold">
                      Email Address (for E-Ticket) *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="name@example.com"
                      data-testid="checkout-traveler-email"
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-semibold">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      {...register("phone")}
                      placeholder="9876543210"
                      data-testid="checkout-traveler-phone"
                    />
                    {errors.phone && (
                      <p className="text-xs text-destructive">{errors.phone.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="gender" className="text-xs font-semibold">
                      Gender
                    </Label>
                    <select
                      id="gender"
                      {...register("gender")}
                      className="flex h-10 w-full rounded-2xl border border-border bg-surface px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="age" className="text-xs font-semibold">
                      Age
                    </Label>
                    <Input id="age" type="number" {...register("age")} placeholder="26" />
                    {errors.age && <p className="text-xs text-destructive">{errors.age.message}</p>}
                  </div>
                </div>

                {search.kind === "flight" && (
                  <div className="space-y-1.5">
                    <Label htmlFor="seatPreference" className="text-xs font-semibold">
                      Seat Preference
                    </Label>
                    <select
                      id="seatPreference"
                      {...register("seatPreference")}
                      className="flex h-10 w-full rounded-2xl border border-border bg-surface px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                    >
                      <option value="Window">Window Seat</option>
                      <option value="Aisle">Aisle Seat</option>
                      <option value="Middle">Middle Seat</option>
                    </select>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="notes" className="text-xs font-semibold">
                    Special Requests (Optional)
                  </Label>
                  <Input
                    id="notes"
                    {...register("notes")}
                    placeholder="Meal requests, wheelchair assistance, quiet room..."
                  />
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="size-4 text-emerald-500" />
                    Idempotency Protected: Safe from accidental double charges
                  </span>
                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="rounded-full px-8 gap-2 shadow-soft"
                    data-testid="checkout-continue"
                  >
                    Continue to Payment <ArrowRight className="size-4" />
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Col: Price Summary Card */}
          <div className="space-y-6">
            <div className="surface-card p-6 sticky top-24">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <IconComponent className="size-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    {searchKind} Reservation
                  </span>
                  <h3 className="font-display font-bold text-base leading-tight">{searchTitle}</h3>
                </div>
              </div>

              <p className="text-xs text-muted-foreground py-3 border-b border-border/60">
                {searchSubtitle} · {searchTravelers} Traveler(s) · {searchCabinClass}
              </p>

              {/* Price Breakdown */}
              <div className="mt-4 space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Fare ({search.travelers}x)</span>
                  <span className="font-medium text-foreground">{inr(baseFare)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxes & Govt Fees (12% GST)</span>
                  <span className="font-medium text-foreground">{inr(taxesAndFees)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Convenience Fee</span>
                  <span className="text-muted-foreground line-through">{inr(convenienceFee)}</span>
                </div>
                <div className="flex justify-between text-emerald-500">
                  <span className="flex items-center gap-1">
                    <Sparkles className="size-3" /> Demo Platform Discount
                  </span>
                  <span className="font-semibold">-{inr(discount)}</span>
                </div>

                <div className="border-t border-border pt-3 flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-sm block">Total Payable</span>
                    <span className="text-[10px] text-muted-foreground">
                      Inclusive of all demo taxes
                    </span>
                  </div>
                  <span
                    className="font-display text-2xl font-black text-primary"
                    data-testid="checkout-total-price"
                  >
                    {inr(totalPrice)}
                  </span>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-secondary/50 p-3 text-[11px] text-muted-foreground space-y-1">
                <p className="font-bold text-foreground">Cancellation Guarantee</p>
                <p>Free cancellation up to 24 hours prior with 100% simulated instant refund.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Demo Payment Modal */}
      {validatedTraveler && (
        <DemoPaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          amount={totalPrice}
          bookingDetails={{
            kind: searchKind,
            title: searchTitle,
            subtitle: searchSubtitle,
            price: totalPrice,
            origin: search.origin,
            destination: search.destination,
            startDate: search.date,
            passengersCount: searchTravelers,
            cabinClass: searchCabinClass,
            travelerDetails: validatedTraveler,
            fareBreakdown,
          }}
          idempotencyKey={idempotencyKey}
          onSuccess={handleBookingSuccess}
        />
      )}

      <Footer />
      <SupportDock />
    </>
  );
}
