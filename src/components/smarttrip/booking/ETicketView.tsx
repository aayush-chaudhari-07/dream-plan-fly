import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Printer, Download, Plane, Hotel, Car, Bus, Luggage, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { inr } from "@/data/travel";
import type { StoredBooking } from "@/lib/smarttrip-store";

interface ETicketViewProps {
  booking: StoredBooking;
  onCancel?: () => void;
}

export function ETicketView({ booking, onCancel }: ETicketViewProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    const qrPayload = JSON.stringify({
      app: "SmartTrip Demo",
      pnr: booking.reference,
      kind: booking.kind,
      title: booking.title,
      traveler: booking.travelerDetails?.fullName || "Guest Traveler",
      paid: booking.price,
      status: booking.status || "confirmed",
      verificationUrl: typeof window !== "undefined" ? window.location.href : "",
    });

    QRCode.toDataURL(qrPayload, {
      width: 240,
      margin: 1,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    })
      .then(setQrDataUrl)
      .catch((err) => console.error("QR Code Generation Error:", err));
  }, [booking]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const IconComponent =
    booking.kind === "flight"
      ? Plane
      : booking.kind === "stay"
        ? Hotel
        : booking.kind === "rental"
          ? Car
          : booking.kind === "rail"
            ? Bus
            : Luggage;

  const isCancelled = booking.status === "cancelled";

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Action Controls (hidden when printing) */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2">
          <span
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
              isCancelled
                ? "bg-destructive/10 text-destructive border border-destructive/30"
                : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
            }`}
          >
            <CheckCircle2 className="size-3.5" />
            {isCancelled ? "CANCELLED & REFUNDED" : "OFFICIAL RESERVATION CONFIRMED"}
          </span>
          <span className="rounded-full bg-sunset/15 text-foreground px-2.5 py-0.5 text-xs font-semibold">
            Demo E-Ticket
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onCancel && !isCancelled && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="rounded-full text-destructive hover:bg-destructive/10"
              data-testid="cancel-booking-btn"
            >
              Cancel Booking
            </Button>
          )}
          <Button
            type="button"
            variant="hero"
            size="sm"
            onClick={handlePrint}
            className="rounded-full gap-2 shadow-soft"
            data-testid="download-eticket-btn"
          >
            <Printer className="size-4" /> Print / Save E-Ticket (PDF)
          </Button>
        </div>
      </div>

      {/* The Printable Boarding Pass / Voucher Card */}
      <div
        className="relative overflow-hidden rounded-3xl border-2 border-border bg-card p-6 sm:p-8 shadow-xl print:shadow-none print:border-black print:p-6"
        id="printable-eticket"
        data-testid="booking-confirmation"
      >
        {/* Diagonal DEMO Watermark */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10 select-none rotate-[-25deg]">
          <span className="font-display text-6xl sm:text-8xl font-black text-foreground tracking-widest text-center">
            DEMO TICKET
            <br />
            NOT VALID FOR TRAVEL
          </span>
        </div>

        {/* Voucher Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border/80 pb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-sm">
              <IconComponent className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-2xl font-black tracking-tight">SmartTrip</span>
                <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-mono font-bold text-muted-foreground uppercase">
                  E-Reservation Voucher
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Issue Date:{" "}
                {new Date(booking.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="sm:text-right">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
              Booking Reference / PNR
            </span>
            <span
              className="font-mono text-2xl font-black text-primary tracking-widest"
              data-testid="booking-confirmation-ref"
            >
              #{booking.reference}
            </span>
          </div>
        </div>

        {/* Primary Travel Details */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-4">
            <div>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                Travel / Reservation Item
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                {booking.title}
              </h2>
              <p className="text-sm font-medium text-muted-foreground mt-0.5">{booking.subtitle}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                  Status
                </span>
                <p
                  className={`text-sm font-bold capitalize ${isCancelled ? "text-destructive" : "text-emerald-500"}`}
                >
                  {booking.status || "Confirmed"}
                </p>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                  Travelers
                </span>
                <p className="text-sm font-bold text-foreground">
                  {booking.passengersCount || 1} Passenger(s)
                </p>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                  Cabin / Tier
                </span>
                <p className="text-sm font-bold text-foreground capitalize">
                  {booking.cabinClass || "Economy"}
                </p>
              </div>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-secondary/30 border border-border/60">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`QR Verification for PNR ${booking.reference}`}
                width={144}
                height={144}
                decoding="async"
                className="size-36 rounded-xl object-contain bg-white p-1"
                data-testid="eticket-qr-code"
              />
            ) : (
              <div className="size-36 rounded-xl bg-secondary animate-pulse" />
            )}
            <span className="mt-2 text-[10px] font-mono text-muted-foreground tracking-wider uppercase text-center">
              Scan to Verify PNR
            </span>
          </div>
        </div>

        {/* Passenger & Fare Details */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-border/80 pt-6">
          {/* Passenger Information */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">
              Lead Traveler Details
            </span>
            <div className="rounded-2xl bg-secondary/40 p-4 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Full Name:</span>
                <span className="font-bold text-foreground" data-testid="confirmed-traveler-name">
                  {booking.travelerDetails?.fullName || "Aayush Chaudhari"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-mono text-foreground">
                  {booking.travelerDetails?.email || "traveler@smarttrip.demo"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone:</span>
                <span className="font-mono text-foreground">
                  {booking.travelerDetails?.phone || "+91 98765 43210"}
                </span>
              </div>
              {booking.travelerDetails?.seatPreference && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Seat Preference:</span>
                  <span className="font-semibold text-foreground">
                    {booking.travelerDetails.seatPreference}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Fare & Payment Breakdown */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">
              Payment & Fare Receipt
            </span>
            <div className="rounded-2xl bg-secondary/40 p-4 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base Fare:</span>
                <span className="font-medium text-foreground">
                  {inr(booking.fareBreakdown?.baseFare || Math.round(booking.price / 1.12))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Taxes & GST (12%):</span>
                <span className="font-medium text-foreground">
                  {inr(
                    booking.fareBreakdown?.taxesAndFees ||
                      Math.round(booking.price - booking.price / 1.12),
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Convenience Fee:</span>
                <span className="font-medium text-emerald-500 font-bold">₹0 (Waived)</span>
              </div>
              <div className="flex justify-between border-t border-border pt-1.5 text-sm font-bold">
                <span>Total Paid:</span>
                <span className="text-primary font-display text-base font-bold">
                  {inr(booking.price)}
                </span>
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground pt-1">
                <span>Instrument:</span>
                <span>{booking.paymentDetails?.maskedInstrument || "Demo Card •••• 0002"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notice & Disclaimer */}
        <div className="mt-6 rounded-2xl border border-sunset/30 bg-sunset/10 p-4 text-xs text-foreground/80 space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-sunset inline-block" />
            Important Traveler Notice (Demo Simulation)
          </p>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            This reservation voucher was generated in the SmartTrip demonstration environment. No
            real funds were charged, and no actual airline or hotel inventory was locked. You may
            cancel this booking at any time with a 100% simulated refund.
          </p>
        </div>
      </div>
    </div>
  );
}
