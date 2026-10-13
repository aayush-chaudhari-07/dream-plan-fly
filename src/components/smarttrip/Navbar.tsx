import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, Compass, Heart, LogOut, Luggage, Menu, Search, User, Wallet, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth-context";
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
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate({ to: "/" });
  };

  const userInitial =
    user?.email && user.email.length > 0 ? (user.email[0]?.toUpperCase() ?? "U") : "U";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-card/70 shadow-soft backdrop-blur-xl backdrop-saturate-150"
          : "bg-transparent",
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

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1 md:flex">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Wishlist"
              className="rounded-full text-foreground/70"
              asChild
            >
              <Link to="/my-trips">
                <Heart className="size-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Notifications"
              className="rounded-full text-foreground/70"
              onClick={() => toast("Notifications", { description: "You are all caught up!" })}
            >
              <Bell className="size-4" />
            </Button>
          </div>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-secondary size-9 font-semibold text-primary"
                  aria-label="User Account"
                >
                  {userInitial}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-elevated">
                <DropdownMenuLabel className="font-normal px-2 py-1.5">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none text-foreground">
                      {(user.user_metadata?.["full_name"] as string) || "Traveler"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                  <Link to="/my-trips" className="flex items-center gap-2">
                    <Luggage className="size-4 text-muted-foreground" />
                    <span>My Trips & Bookings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                  <Link to="/save" className="flex items-center gap-2">
                    <Wallet className="size-4 text-muted-foreground" />
                    <span>Trip Funds</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="rounded-xl cursor-pointer text-destructive focus:text-destructive flex items-center gap-2"
                >
                  <LogOut className="size-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="rounded-full text-sm font-semibold"
            >
              <Link to="/login" search={{ redirect: undefined }}>
                Sign In
              </Link>
            </Button>
          )}

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

            {user ? (
              <div className="border-t border-border/50 pt-2 mt-1 space-y-1">
                <div className="px-4 py-1 text-xs text-muted-foreground truncate">
                  Signed in as {user.email}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setOpen(false);
                    handleSignOut();
                  }}
                  className="w-full justify-start rounded-xl text-destructive hover:text-destructive"
                >
                  <LogOut className="size-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="border-t border-border/50 pt-2 mt-1 flex gap-2">
                <Button variant="outline" size="sm" asChild className="flex-1 rounded-xl">
                  <Link to="/login" search={{ redirect: undefined }} onClick={() => setOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button variant="hero" size="sm" asChild className="flex-1 rounded-xl">
                  <Link
                    to="/signup"
                    search={{ redirect: undefined }}
                    onClick={() => setOpen(false)}
                  >
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}

            <Button variant="hero" size="lg" asChild className="mt-2">
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
