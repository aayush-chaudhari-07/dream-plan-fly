import { useState } from "react";
import {
  CreditCard,
  QrCode,
  Building2,
  ShieldAlert,
  ShieldCheck,
  Loader2,
  AlertTriangle,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import { Label } from "@/client/components/ui/label";
import { inr } from "@/shared/types/travel";
import {
  DEMO_TEST_CARDS,
  DEMO_TEST_UPIS,
  validateDemoCardSafety,
} from "@/shared/utils/card-validator";
import {
  createBookingOrderFn,
  verifyAndConfirmBookingFn,
} from "@/server/functions/booking-actions";
import { smartTrip, type StoredBooking } from "@/client/lib/smarttrip-store";
import { cn } from "@/client/lib/utils";

type PaymentTab = "card" | "upi" | "netbanking";

interface DemoPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  bookingDetails: {
    kind: "flight" | "stay" | "rental" | "rail" | "package";
    title: string;
    subtitle: string;
    price: number;
    origin?: string | undefined;
    destination?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    inventoryId?: string | undefined;
    passengersCount?: number | undefined;
    cabinClass?: string | undefined;
    travelerDetails: {
      fullName: string;
      email: string;
      phone: string;
      gender?: string | undefined;
      age?: number | undefined;
      seatPreference?: string | undefined;
      notes?: string | undefined;
    };
    fareBreakdown: {
      baseFare: number;
      taxesAndFees: number;
      convenienceFee: number;
      discount: number;
      total: number;
    };
  };
  idempotencyKey: string;
  onSuccess: (booking: StoredBooking) => void;
}

export function DemoPaymentModal({
  isOpen,
  onClose,
  amount,
  bookingDetails,
  idempotencyKey,
  onSuccess,
}: DemoPaymentModalProps) {
  const [tab, setTab] = useState<PaymentTab>("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  // Card state
  const [cardNumber, setCardNumber] = useState<string>(DEMO_TEST_CARDS.SUCCESS);
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("123");
  const [cardholderName, setCardholderName] = useState(
    bookingDetails.travelerDetails.fullName || "Demo Traveler",
  );

  // UPI state
  const [vpa, setVpa] = useState<string>(DEMO_TEST_UPIS.SUCCESS);

  // Net banking state
  const [bankCode, setBankCode] = useState<string>("HDFC");

  // Simulated Outcome
  const [simulatedOutcome, setSimulatedOutcome] = useState<
    "success" | "failure" | "insufficient_funds" | "pending"
  >("success");

  if (!isOpen) return null;

  const handleCardNumberChange = (raw: string) => {
    setCardNumber(raw);
    setCardError(null);
    try {
      validateDemoCardSafety(raw);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setCardError(err.message);
      }
    }
  };

  const fillTestCard = (testCard: string, outcome: typeof simulatedOutcome) => {
    setCardNumber(testCard);
    setSimulatedOutcome(outcome);
    setCardError(null);
  };

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    setCardError(null);

    try {
      // 1. Check card security in client
      if (tab === "card") {
        try {
          validateDemoCardSafety(cardNumber);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Real cards rejected.";
          setCardError(msg);
          toast.error("Real card detected", { description: msg });
          setIsProcessing(false);
          return;
        }
      }

      // 2. Initialize Order
      const order = await createBookingOrderFn({
        data: {
          amount,
          title: bookingDetails.title,
          kind: bookingDetails.kind,
          idempotencyKey,
        },
      });

      // 3. Confirm with signed token
      const res = await verifyAndConfirmBookingFn({
        data: {
          orderId: order.orderId,
          paymentId: order.paymentId,
          amount,
          signature: order.demoSignature,
          paymentMethod: tab,
          idempotencyKey,
          bookingDetails,
          cardLast4: tab === "card" ? cardNumber.slice(-4) : undefined,
          cardholderName: tab === "card" ? cardholderName : undefined,
          vpa: tab === "upi" ? vpa : undefined,
          bankCode: tab === "netbanking" ? bankCode : undefined,
          simulatedOutcome,
        },
      });

      if (!res.success) {
        toast.error("Payment failed", { description: res.message });
        setIsProcessing(false);
        return;
      }

      // Add to local store if not already present
      const rawBooking = res.booking as unknown as StoredBooking;
      const confirmedBooking = smartTrip.addBooking({
        kind: bookingDetails.kind,
        title: bookingDetails.title,
        subtitle: bookingDetails.subtitle,
        price: amount,
        reference: res.reference,
        status: "confirmed",
        idempotencyKey,
        travelerDetails: bookingDetails.travelerDetails,
        paymentDetails: {
          method: tab,
          transactionRef: `demo_tx_${Date.now()}`,
          paidAt: Date.now(),
          maskedInstrument:
            tab === "card"
              ? `Card •••• ${cardNumber.slice(-4)}`
              : tab === "upi"
                ? `UPI (${vpa})`
                : `NetBanking (${bankCode})`,
          amount,
        },
        fareBreakdown: bookingDetails.fareBreakdown,
        origin: bookingDetails.origin,
        destination: bookingDetails.destination,
        startDate: bookingDetails.startDate,
        endDate: bookingDetails.endDate,
        inventoryId: bookingDetails.inventoryId,
        passengersCount: bookingDetails.passengersCount,
        cabinClass: bookingDetails.cabinClass,
      });

      toast.success("Demo payment successful!", {
        description: `Booking #${res.reference} confirmed. E-ticket generated.`,
      });

      onSuccess(confirmedBooking || rawBooking);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment failed.";
      toast.error("Transaction Error", { description: msg });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in"
      data-testid="demo-pay-modal"
    >
      <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border/60 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-500 uppercase tracking-wider">
                Demo Gateway
              </span>
              <span className="text-xs text-muted-foreground">HMAC-Signed</span>
            </div>
            <h3 className="font-display text-xl font-bold mt-1">Complete Demo Payment</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Payable: <strong className="text-foreground">{inr(amount)}</strong> · Safe test
              sandbox
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            ✕
          </button>
        </div>

        {/* Real Card Rejection Warning if triggered */}
        {cardError && (
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-destructive/40 bg-destructive/10 p-3.5 text-xs text-destructive">
            <ShieldAlert className="size-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Real Card Numbers Rejected</p>
              <p className="mt-0.5">{cardError}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl bg-secondary/60 p-1.5">
          <button
            type="button"
            onClick={() => setTab("card")}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-all",
              tab === "card"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            data-testid="demo-pay-card-tab"
          >
            <CreditCard className="size-3.5" /> Card
          </button>
          <button
            type="button"
            onClick={() => setTab("upi")}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-all",
              tab === "upi"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            data-testid="demo-pay-upi-tab"
          >
            <QrCode className="size-3.5" /> UPI / QR
          </button>
          <button
            type="button"
            onClick={() => setTab("netbanking")}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-all",
              tab === "netbanking"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            data-testid="demo-pay-nb-tab"
          >
            <Building2 className="size-3.5" /> Net Banking
          </button>
        </div>

        {/* Tab 1: Card */}
        {tab === "card" && (
          <div className="mt-5 space-y-4">
            <div>
              <Label className="text-xs font-semibold text-muted-foreground">
                Select Test Card
              </Label>
              <div className="mt-1.5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fillTestCard(DEMO_TEST_CARDS.SUCCESS, "success")}
                  className={cn(
                    "rounded-xl border px-2.5 py-1.5 text-xs font-medium transition-colors",
                    cardNumber === DEMO_TEST_CARDS.SUCCESS
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-500 font-bold"
                      : "border-border hover:bg-secondary",
                  )}
                  data-testid="test-card-success-btn"
                >
                  ✓ Success Card (..0002)
                </button>
                <button
                  type="button"
                  onClick={() => fillTestCard(DEMO_TEST_CARDS.DECLINED, "failure")}
                  className={cn(
                    "rounded-xl border px-2.5 py-1.5 text-xs font-medium transition-colors",
                    cardNumber === DEMO_TEST_CARDS.DECLINED
                      ? "border-destructive bg-destructive/10 text-destructive font-bold"
                      : "border-border hover:bg-secondary",
                  )}
                  data-testid="test-card-decline-btn"
                >
                  ✕ Declined Card (..0005)
                </button>
                <button
                  type="button"
                  onClick={() =>
                    fillTestCard(DEMO_TEST_CARDS.INSUFFICIENT_FUNDS, "insufficient_funds")
                  }
                  className={cn(
                    "rounded-xl border px-2.5 py-1.5 text-xs font-medium transition-colors",
                    cardNumber === DEMO_TEST_CARDS.INSUFFICIENT_FUNDS
                      ? "border-amber-500 bg-amber-500/10 text-amber-500 font-bold"
                      : "border-border hover:bg-secondary",
                  )}
                >
                  ⚠ Insufficient Funds (..0007)
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Demo Card Number</Label>
              <Input
                value={cardNumber}
                onChange={(e) => handleCardNumberChange(e.target.value)}
                placeholder="4000 0000 0000 0002"
                className="font-mono text-sm"
                data-testid="demo-card-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Expiry Date</Label>
                <Input
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  placeholder="MM/YY"
                  className="font-mono text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">CVV</Label>
                <Input
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)}
                  placeholder="123"
                  type="password"
                  maxLength={4}
                  className="font-mono text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Cardholder Name</Label>
              <Input
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                placeholder="Full Name"
                className="text-sm"
              />
            </div>
          </div>
        )}

        {/* Tab 2: UPI */}
        {tab === "upi" && (
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-border/80 bg-secondary/30 p-4 text-center">
              <div className="mx-auto flex size-28 items-center justify-center rounded-2xl bg-card border border-border p-2">
                <QrCode className="size-20 text-foreground" />
              </div>
              <p className="mt-2 text-xs font-semibold">Scan with any UPI App (Demo simulation)</p>
              <p className="text-[11px] text-muted-foreground">GPay · PhonePe · Paytm · BHIM</p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">UPI ID (VPA)</Label>
              <Input
                value={vpa}
                onChange={(e) => setVpa(e.target.value)}
                placeholder="user@upi"
                className="font-mono text-sm"
                data-testid="demo-upi-input"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setVpa(DEMO_TEST_UPIS.SUCCESS);
                  setSimulatedOutcome("success");
                }}
                className="rounded-xl border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary"
              >
                Use success@upi
              </button>
              <button
                type="button"
                onClick={() => {
                  setVpa(DEMO_TEST_UPIS.FAIL);
                  setSimulatedOutcome("failure");
                }}
                className="rounded-xl border border-border px-3 py-1.5 text-xs font-medium text-destructive hover:bg-secondary"
              >
                Use fail@upi
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Net Banking */}
        {tab === "netbanking" && (
          <div className="mt-5 space-y-4">
            <Label className="text-xs font-semibold">Select Popular Bank</Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { code: "HDFC", name: "HDFC Bank" },
                { code: "ICICI", name: "ICICI Bank" },
                { code: "SBI", name: "State Bank of India" },
                { code: "AXIS", name: "Axis Bank" },
                { code: "KOTAK", name: "Kotak Mahindra Bank" },
                { code: "FAIL_BANK", name: "Simulate Bank Timeout" },
              ].map((b) => (
                <button
                  key={b.code}
                  type="button"
                  onClick={() => {
                    setBankCode(b.code);
                    setSimulatedOutcome(b.code === "FAIL_BANK" ? "failure" : "success");
                  }}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border p-2.5 text-left text-xs transition-colors",
                    bankCode === b.code
                      ? "border-primary bg-primary/10 text-primary font-bold"
                      : "border-border hover:bg-secondary",
                  )}
                >
                  <Building2 className="size-3.5 shrink-0" />
                  <span className="truncate">{b.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Safety Disclaimer Footer */}
        <div className="mt-5 rounded-2xl bg-secondary/50 p-3 text-[11px] text-muted-foreground flex items-center gap-2">
          <ShieldCheck className="size-4 shrink-0 text-emerald-500" />
          <span>
            <strong>Demo Safe Gateway:</strong> Zero financial charge. Real card numbers are
            strictly refused.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex items-center justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="hero"
            size="lg"
            className="rounded-full px-6"
            onClick={handleProcessPayment}
            disabled={isProcessing || Boolean(cardError)}
            data-testid="demo-pay-submit-btn"
          >
            {isProcessing ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" /> Authorizing Demo Payment...
              </>
            ) : (
              `Pay ${inr(amount)} (Demo)`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
