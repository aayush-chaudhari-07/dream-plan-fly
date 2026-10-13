import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Compass, Instagram, Linkedin, Youtube } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const columns = [
  {
    title: "Explore",
    items: ["Destinations", "Hotels", "Flights", "Packages"],
  },
  {
    title: "Plan",
    items: ["AI Trip Planner", "My Trips", "Wishlist", "Save for Trip", "Future Trip Fund"],
  },
  {
    title: "Support",
    items: ["Help Center", "Contact", "Safety", "Terms"],
  },
];

export function Footer() {
  const [email, setEmail] = useState("");

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
                <li key={item}>
                  <button
                    type="button"
                    onClick={() => toast(item, { description: "Section available in the demo." })}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="container-page border-t border-border py-8">
        <form
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          onSubmit={(e) => {
            e.preventDefault();
            if (!email.includes("@")) {
              toast.error("Please enter a valid email");
              return;
            }
            toast.success("You're subscribed!", {
              description: "Travel inspiration is on its way.",
            });
            setEmail("");
          }}
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
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-11 rounded-xl"
              aria-label="Email address"
            />
            <Button type="submit" variant="hero" size="lg">
              Subscribe
            </Button>
          </div>
        </form>
        <p className="mt-8 text-xs text-muted-foreground">
          © {new Date().getFullYear()} SmartTrip. Built for travellers who plan less and travel
          more.{" "}
          <Link to="/save" className="text-primary hover:underline">
            Start a trip fund
          </Link>
        </p>
      </div>
    </footer>
  );
}
