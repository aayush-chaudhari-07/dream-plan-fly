import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  CheckCircle2,
  Headset,
  LifeBuoy,
  Loader2,
  MessageSquare,
  PhoneCall,
  ShieldAlert,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { submitSupportTicketFn } from "@/lib/server/trip-actions";

export function SupportDock() {
  const [dockOpen, setDockOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [category, setCategory] = useState<
    "booking" | "modification" | "cancellation" | "refund" | "emergency" | "general"
  >("general");

  // Ticket form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketRef, setTicketRef] = useState<string | null>(null);

  const handleOpenContactModal = (
    initialCategory:
      "booking" | "modification" | "cancellation" | "refund" | "emergency" | "general" = "general",
  ) => {
    setCategory(initialCategory);
    setTicketRef(null);
    setDockOpen(false);
    setModalOpen(true);
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || message.trim().length < 10) {
      toast.error("Please fill in all fields (message must be at least 10 characters)");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitSupportTicketFn({
        data: {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          category,
          subject: subject.trim(),
          message: message.trim(),
        },
      });

      setTicketRef(res.reference);
      toast.success("Support ticket created!", {
        description: `Reference #${res.reference}. Our team has received your inquiry.`,
      });
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit support request.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6 print:hidden">
        {dockOpen ? (
          <div className="glass-panel w-80 animate-scale-in rounded-3xl p-5 shadow-elevated border border-border/70">
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Headset className="size-4 text-primary" />
                <p className="font-display text-sm font-bold text-foreground">SmartTrip Support</p>
              </div>
              <button
                type="button"
                onClick={() => setDockOpen(false)}
                className="text-muted-foreground hover:text-foreground text-xs p-1"
                aria-label="Close support menu"
              >
                <X className="size-4" />
              </button>
            </div>

            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              We're available 24/7 across travel planning, booking assistance, and urgent helplines.
            </p>

            <div className="mt-3.5 grid gap-2">
              <Button variant="hero" size="sm" asChild className="justify-start rounded-xl h-10">
                <Link to="/ai-planner" onClick={() => setDockOpen(false)}>
                  <Sparkles className="size-4 mr-2" /> Ask AI Travel Planner
                </Link>
              </Button>

              <Button
                variant="soft"
                size="sm"
                asChild
                className="justify-start rounded-xl h-10 text-xs"
              >
                <Link to="/faq" onClick={() => setDockOpen(false)}>
                  <LifeBuoy className="size-4 mr-2 text-primary" /> Help Center & FAQ
                </Link>
              </Button>

              <Button
                variant="soft"
                size="sm"
                className="justify-start rounded-xl h-10 text-xs cursor-pointer"
                onClick={() => handleOpenContactModal("general")}
              >
                <MessageSquare className="size-4 mr-2 text-primary" /> Open Support Ticket
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="justify-start rounded-xl h-10 text-xs text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                onClick={() => handleOpenContactModal("emergency")}
              >
                <PhoneCall className="size-4 mr-2 text-destructive" /> 24/7 Emergency Hotline
              </Button>
            </div>
          </div>
        ) : null}

        <Button
          variant="hero"
          size="icon"
          aria-label="Open 24/7 Support Dock"
          className="size-14 rounded-full shadow-elevated cursor-pointer transition-transform hover:scale-105"
          onClick={() => setDockOpen((v) => !v)}
        >
          {dockOpen ? <X className="size-6" /> : <Headset className="size-6" />}
        </Button>
      </div>

      {/* Support Ticket Modal Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6">
          <DialogHeader>
            <div className="flex items-center gap-2">
              {category === "emergency" ? (
                <ShieldAlert className="size-5 text-destructive" />
              ) : (
                <Headset className="size-5 text-primary" />
              )}
              <DialogTitle className="font-display text-lg font-bold">
                {category === "emergency"
                  ? "Urgent On-Trip Emergency Request"
                  : "Contact SmartTrip Support"}
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              {category === "emergency"
                ? "Priority dispatch desk for immediate medical, transit safety, or critical booking emergencies."
                : "Open a support ticket stored in our tracking system. Our team responds within 30–60 minutes."}
            </DialogDescription>
          </DialogHeader>

          {category === "emergency" ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs flex items-center justify-between gap-3 text-destructive">
              <div>
                <p className="font-bold">Need Immediate Voice Contact?</p>
                <p className="text-[11px] opacity-90">Toll-free 24/7 helpline desk</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs border-destructive/40 bg-background text-destructive hover:bg-destructive/10"
                onClick={() => {
                  navigator.clipboard.writeText("+911800762788");
                  toast.success("Emergency hotline copied: +91 1800-762-788");
                }}
              >
                +91 1800-762-788
              </Button>
            </div>
          ) : null}

          {ticketRef ? (
            <div className="my-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center animate-in fade-in-50">
              <CheckCircle2 className="size-10 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
              <p className="font-display text-base font-bold text-foreground">
                Ticket Created Successfully!
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Your request has been logged in our support center.
              </p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-card border border-border px-3 py-1.5 font-mono text-xs font-bold text-primary">
                Reference: #{ticketRef}
              </div>
              <div className="mt-5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setModalOpen(false)}
                  className="rounded-full text-xs"
                >
                  Close Window
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitTicket} className="space-y-3.5 my-1">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    Your Name
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    required
                    className="rounded-xl text-xs h-9"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="rounded-xl text-xs h-9"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="support-category"
                  className="text-xs font-semibold text-muted-foreground block mb-1"
                >
                  Inquiry Category
                </label>
                <select
                  id="support-category"
                  aria-label="Inquiry Category"
                  value={category}
                  onChange={(e) =>
                    setCategory(
                      e.target.value as
                        | "booking"
                        | "modification"
                        | "cancellation"
                        | "refund"
                        | "emergency"
                        | "general",
                    )
                  }
                  className="w-full rounded-xl border border-input bg-card px-3 h-9 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="general">General Support</option>
                  <option value="booking">Booking / Voucher Issue</option>
                  <option value="modification">Date Modification / PNR</option>
                  <option value="cancellation">Cancellation Request</option>
                  <option value="refund">Refund Status</option>
                  <option value="emergency">🚨 Urgent On-Trip Emergency</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Subject
                </label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Summary of request"
                  required
                  className="rounded-xl text-xs h-9"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Message & Booking Reference
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  placeholder="Please describe what happened, including any booking reference codes (#ST-XXXX)..."
                  required
                  className="rounded-xl text-xs resize-none"
                />
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setModalOpen(false)}
                  className="rounded-full text-xs h-9"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant={category === "emergency" ? "destructive" : "hero"}
                  disabled={isSubmitting}
                  className="rounded-full text-xs h-9 gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    "Submit Ticket"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
