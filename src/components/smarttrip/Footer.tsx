import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Compass, Instagram, Linkedin, Loader2, Youtube } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeNewsletterFn } from "@/lib/server/trip-actions";

const columns = [
  {
    title: "Explore",
    items: [
      { label: "Destinations", href: "/#destinations" },
      { label: "Hotels", href: "/bookings" },
      { label: "Flights", href: "/bookings" },
      { label: "Interactive Map", href: "/#map" },
    ],
  },
  {
    title: "Plan",
    items: [
      { label: "AI Trip Planner", href: "/ai-planner" },
      { label: "My Trips", href: "/my-trips" },
      { label: "Wishlist", href: "/#destinations" },
      { label: "Trip Fund", href: "/save" },
    ],
  },
  {
    title: "Support & Legal",
    items: [
      { label: "Help Center & FAQ", href: "/faq" },
      { label: "Terms & Disclaimers", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Safety Guide", href: "/#guide" },
    ],
  },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@") || !trimmed.includes(".")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await subscribeNewsletterFn({ data: { email: trimmed } });
      if (res.status === "already_subscribed") {
        toast.info(res.message);
      } else {
        toast.success(res.message);
        setEmail("");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to subscribe. Please try again.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="bg-gradient-brand flex size-10 items-center justify-center rounded-2xl text-primary-foreground">
              <Compass className="size-5" />
            </span>
            <span>
              <span className="block font-display text-lg font-bold">SmartTrip</span>
              <span className="block text-xs text-muted-foreground">
                Travel smarter. Explore more.
              </span>
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Dream it, ask AI, plan it, save for it, book it — and actually enjoy the journey.
          </p>
          <div className="mt-5 flex gap-2">
            {[Instagram, Youtube, Linkedin].map((Icon, i) => (
              <Button
                key={i}
                variant="soft"
                size="icon"
                className="rounded-full"
                aria-label="Follow SmartTrip"
                onClick={() => toast("Thanks for following SmartTrip!")}
              >
                <Icon />
              </Button>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold text-foreground">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.items.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="container-page border-t border-border py-8">
        <form
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          onSubmit={handleSubscribe}
        >
          <div>
            <p className="font-display text-base font-semibold">
              Get travel inspiration in your inbox.
            </p>
            <p className="text-sm text-muted-foreground">One thoughtful email a week. No spam.</p>
          </div>
          <div className="flex w-full max-w-md gap-2">
            <Input
              type="email"
              value={email}
              disabled={isSubmitting}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-11 rounded-xl"
              aria-label="Email address"
            />
            <Button type="submit" variant="hero" size="lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-1" />
                  Subscribing…
                </>
              ) : (
                "Subscribe"
              )}
            </Button>
          </div>
        </form>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} SmartTrip. All booking engines and fares operate in demo
            simulation mode.
          </p>
          <div className="flex gap-4">
            <Link to="/terms" className="hover:text-primary transition-colors">
              Terms & Disclaimers
            </Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/save" className="hover:text-primary transition-colors">
              Start Trip Fund
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
