import { useState, useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, ArrowLeft, AlertCircle, Ban } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/smarttrip/Navbar";
import { Footer } from "@/components/smarttrip/Footer";
import { PageHeader } from "@/components/smarttrip/PageHeader";
import { SupportDock } from "@/components/smarttrip/SupportDock";
import { Button } from "@/components/ui/button";
import { ETicketView } from "@/components/smarttrip/booking/ETicketView";
import { useSmartTrip, smartTrip, type StoredBooking } from "@/lib/smarttrip-store";
import { cancelBookingWithRefundFn } from "@/lib/server/booking-actions";
import { inr } from "@/data/travel";

export const Route = createFileRoute("/booking-confirmation/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Booking #${params.id} Confirmed — SmartTrip` },
      {
        name: "description",
        content: "View your confirmed reservation and download your demo E-ticket.",
      },
    ],
  }),
  component: BookingConfirmationPage,
});

function BookingConfirmationPage() {
  const { id } = Route.useParams();
  const { bookings } = useSmartTrip();
  const navigate = useNavigate();

  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Find booking by reference or ID
  const booking = useMemo(() => {
    return bookings.find(
      (b) =>
        b.reference.toLowerCase() === id.toLowerCase() || b.id.toLowerCase() === id.toLowerCase(),
    );
  }, [bookings, id]);

  // Fallback if not found in state (e.g. refreshed or direct link)
  const displayBooking: StoredBooking = booking || {
    id: `bkg-${id.toLowerCase()}`,
    kind: "flight",
    title: "IndiGo 6E-247 · Delhi to Goa",
    subtitle: "15 Dec – 17 Dec · Non-stop",
    price: 4899,
    reference: id.toUpperCase(),
    status: "confirmed",
    createdAt: Date.now(),
    passengersCount: 1,
    cabinClass: "Economy",
    travelerDetails: {
      fullName: "Aayush Chaudhari",
      email: "traveler@smarttrip.demo",
      phone: "+91 98765 43210",
      seatPreference: "Window",
    },
    paymentDetails: {
      method: "card",
      transactionRef: `demo_tx_${Date.now()}`,
      paidAt: Date.now(),
      maskedInstrument: "Demo Card •••• 0002",
      amount: 4899,
    },
    fareBreakdown: {
      baseFare: 4374,
      taxesAndFees: 525,
      convenienceFee: 0,
      discount: 149,
      total: 4899,
    },
  };

  const handleConfirmCancel = async () => {
    setIsCancelling(true);
    try {
      if (booking) {
        await cancelBookingWithRefundFn({
          data: {
            bookingId: booking.id,
            reason: "Traveler initiated cancellation from E-ticket view",
          },
        });
        smartTrip.cancelBooking(booking.id);
      }

      toast.success("Reservation Cancelled", {
        description: `Full refund of ${inr(displayBooking.price)} processed to original payment method.`,
      });

      setIsCancelDialogOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Cancellation failed.";
      toast.error("Cancellation Error", { description: msg });
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <>
      <Navbar />
      <PageHeader
        title="Reservation Confirmed!"
        subtitle={`Booking reference #${displayBooking.reference} · Your demo E-ticket is ready.`}
      />

      <main className="container-page -mt-8 pb-16">
        {/* Navigation Breadcrumb / Actions */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/my-trips"
            className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" /> Back to My Trips & Bookings
          </Link>
          <span className="text-xs text-muted-foreground font-mono">
            REF: {displayBooking.reference}
          </span>
        </div>

        {/* E-Ticket Display */}
        <ETicketView booking={displayBooking} onCancel={() => setIsCancelDialogOpen(true)} />
      </main>

      {/* Cancellation Dialog */}
      {isCancelDialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in"
          data-testid="cancel-confirmation-modal"
        >
          <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-destructive mb-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-destructive/10">
                <Ban className="size-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold">Cancel Reservation?</h3>
                <p className="text-xs text-muted-foreground">Booking #{displayBooking.reference}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-border/80 bg-secondary/40 p-4 text-xs space-y-2">
              <p className="font-semibold text-foreground">Demo Refund Policy Guaranteed:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>
                  100% refund of <strong>{inr(displayBooking.price)}</strong>
                </li>
                <li>Zero cancellation penalties or convenience fee deductions</li>
                <li>Instant simulated credit back to original test payment method</li>
                <li>Associated Upcoming Trip removed from your dashboard</li>
              </ul>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsCancelDialogOpen(false)}
                disabled={isCancelling}
              >
                Keep Booking
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="rounded-full px-5"
                onClick={handleConfirmCancel}
                disabled={isCancelling}
                data-testid="confirm-cancel-btn"
              >
                {isCancelling ? "Processing Refund..." : "Confirm Cancellation & Refund"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <SupportDock />
    </>
  );
}
