import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, Compass, Heart, Menu, Search, User, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { label: "Home", to: "/" },
  { label: "Explore", to: "/explore" },
  { label: "AI Trip Planner", to: "/ai-planner" },
  { label: "Bookings", to: "/bookings" },
  { label: "My Trips", to: "/my-trips" },
  { label: "Save & Dream", to: "/save" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "bg-card/70 shadow-soft backdrop-blur-xl backdrop-saturate-150" : "bg-transparent",
      )}
    >
      <nav className="container-page flex h-18 items-center justify-between gap-4 py-3">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="bg-gradient-brand flex size-10 items-center justify-center rounded-2xl text-primary-foreground shadow-soft">
            <Compass className="size-5" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg font-bold text-foreground">SmartTrip</span>
            <span className="block text-[11px] text-muted-foreground">
              Travel smarter. Explore more.
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.to === "/" }}
              activeProps={{ className: "bg-secondary text-primary" }}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <div className="hidden items-center gap-1 md:flex">
            {[
              { icon: Search, label: "Search" },
              { icon: Heart, label: "Wishlist" },
              { icon: Bell, label: "Notifications" },
              { icon: User, label: "Profile" },
            ].map(({ icon: Icon, label }) => (
              <Button
                key={label}
                variant="ghost"
                size="icon"
                aria-label={label}
                className="rounded-full text-foreground/70"
                onClick={() => toast(label, { description: `${label} panel coming up next.` })}
              >
                <Icon />
              </Button>
            ))}
          </div>
          <Button variant="hero" size="pill" asChild className="hidden sm:inline-flex">
            <Link to="/ai-planner">Plan My Trip</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full lg:hidden"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>

      {open ? (
        <div className="glass-panel container-page mb-3 rounded-3xl p-3 lg:hidden">
          <div className="grid gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary"
              >
                {link.label}
              </Link>
            ))}
            <Button variant="hero" size="lg" asChild className="mt-1">
              <Link to="/ai-planner" onClick={() => setOpen(false)}>
                Plan My Trip
              </Link>
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
