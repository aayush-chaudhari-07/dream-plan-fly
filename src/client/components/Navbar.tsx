import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  Compass,
  Heart,
  LogOut,
  Luggage,
  Menu,
  Search,
  Settings,
  Sparkles,
  User,
  Wallet,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/client/components/ui/avatar";
import { Button } from "@/client/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/client/components/ui/dropdown-menu";
import { SearchCommandDialog } from "@/client/features/search/SearchCommandDialog";
import { WishlistSheet } from "@/client/features/wishlist/WishlistSheet";
import { NotificationsPopover } from "@/client/features/trips/NotificationsPopover";
import { useAuth } from "@/client/lib/auth-context";
import { useSmartTrip } from "@/client/lib/smarttrip-store";
import { cn } from "@/client/lib/utils";

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
  const [searchOpen, setSearchOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  const { user, signOut } = useAuth();
  const { wishlist, notifications } = useSmartTrip();
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

  const userMeta = (user?.user_metadata || {}) as Record<string, unknown>;
  const userName = (userMeta["full_name"] as string) || (userMeta["name"] as string) || "Traveler";
  const userAvatar = (userMeta["avatar_url"] as string) || (userMeta["picture"] as string) || "";
  const userInitial =
    userName.trim().length > 0
      ? userName.trim()[0]?.toUpperCase()
      : (user?.email?.[0]?.toUpperCase() ?? "T");

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-card/70 shadow-soft backdrop-blur-xl backdrop-saturate-150"
            : "bg-transparent",
        )}
      >
        <nav className="container-page flex h-18 items-center justify-between gap-3 py-3">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0"
            onClick={() => setOpen(false)}
          >
            <span className="bg-gradient-brand flex size-10 items-center justify-center rounded-2xl text-primary-foreground shadow-soft">
              <Compass className="size-5" />
            </span>
            <span className="leading-tight hidden sm:block">
              <span className="block font-display text-lg font-bold text-foreground">
                SmartTrip
              </span>
              <span className="block text-[11px] text-muted-foreground">
                Travel smarter. Explore more.
              </span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden items-center gap-1 xl:flex">
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

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            {/* Search Trigger */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchOpen(true)}
              className="hidden md:inline-flex items-center gap-2 rounded-full bg-secondary/40 hover:bg-secondary border-border/50 text-xs text-muted-foreground hover:text-foreground px-3.5 h-9"
              aria-label="Search destinations and trips"
              data-testid="search-button"
            >
              <Search className="size-3.5" />
              <span>Search destinations...</span>
              <kbd className="pointer-events-none hidden lg:inline-flex h-4 select-none items-center gap-0.5 rounded bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground border border-border/60">
                ⌘K
              </kbd>
            </Button>

            {/* Mobile Search Icon */}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="rounded-full text-foreground/70 md:hidden"
              data-testid="search-button-mobile"
            >
              <Search className="size-4" />
            </Button>

            {/* Wishlist Button */}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Wishlist"
              className="relative rounded-full text-foreground/70 hover:text-foreground"
              onClick={() => setWishlistOpen(true)}
              data-testid="wishlist-button"
            >
              <Heart className="size-4" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </Button>

            {/* Notifications Popover */}
            <NotificationsPopover />

            {/* Auth Profile Dropdown OR Guest Buttons */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center gap-2 rounded-full p-0.5 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                    aria-label="User Account Menu"
                  >
                    <Avatar className="size-9 ring-2 ring-primary/20 transition-all hover:ring-primary/40 shadow-soft">
                      {userAvatar ? <AvatarImage src={userAvatar} alt={userName} /> : null}
                      <AvatarFallback className="font-semibold text-xs bg-gradient-brand text-primary-foreground">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-60 rounded-2xl p-2 shadow-elevated bg-card/95 backdrop-blur-xl"
                >
                  <DropdownMenuLabel className="font-normal px-2.5 py-2">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="size-9 shrink-0">
                        {userAvatar ? <AvatarImage src={userAvatar} alt={userName} /> : null}
                        <AvatarFallback className="font-bold text-xs bg-gradient-brand text-primary-foreground">
                          {userInitial}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{userName}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                    <Link to="/my-trips" className="flex items-center gap-2.5">
                      <Luggage className="size-4 text-muted-foreground" />
                      <span>My Trips & Bookings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                    <Link to="/save" className="flex items-center gap-2.5">
                      <Wallet className="size-4 text-muted-foreground" />
                      <span>Trip Funds</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                    <Link to="/settings" className="flex items-center gap-2.5">
                      <Settings className="size-4 text-muted-foreground" />
                      <span>Settings & Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="rounded-xl cursor-pointer text-destructive focus:text-destructive flex items-center gap-2.5"
                  >
                    <LogOut className="size-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="rounded-full text-xs font-semibold px-3 h-8"
                >
                  <Link to="/login" search={{ redirect: undefined }}>
                    Sign In
                  </Link>
                </Button>
                <Button
                  variant="hero"
                  size="sm"
                  asChild
                  className="rounded-full text-xs font-semibold px-3.5 h-8 shadow-soft"
                >
                  <Link to="/signup" search={{ redirect: undefined }}>
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}

            {/* Plan CTA */}
            <Button
              variant="hero"
              size="pill"
              asChild
              className="hidden md:inline-flex h-9 text-xs"
            >
              <Link to="/ai-planner">Plan My Trip</Link>
            </Button>

            {/* Mobile Menu Trigger */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full xl:hidden"
              aria-label="Toggle Navigation Menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X /> : <Menu />}
            </Button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu */}
        {open ? (
          <div className="glass-panel container-page mb-3 rounded-3xl p-4 xl:hidden shadow-elevated animate-in fade-in-0 slide-in-from-top-2 duration-200">
            {/* Quick Search bar */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setOpen(false);
                setSearchOpen(true);
              }}
              className="w-full justify-between rounded-2xl text-muted-foreground h-11 px-4 mb-3 bg-secondary/40 border-border/60"
            >
              <div className="flex items-center gap-2.5">
                <Search className="size-4 text-muted-foreground" />
                <span className="text-xs">Search destinations, trips, bookings...</span>
              </div>
              <kbd className="rounded bg-background px-1.5 py-0.5 text-[10px] font-mono border border-border/60">
                ⌘K
              </kbd>
            </Button>

            {/* Quick Action Chips: Wishlist, Notifications, Settings */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setWishlistOpen(true);
                }}
                className="flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-secondary/50 hover:bg-secondary text-xs font-medium text-foreground transition-colors cursor-pointer"
              >
                <Heart className="size-3.5 text-rose-500 fill-rose-500" />
                <span>Wishlist</span>
                {wishlist.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <Link
                to="/settings"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-secondary/50 hover:bg-secondary text-xs font-medium text-foreground transition-colors"
              >
                <Settings className="size-3.5 text-primary" />
                <span>Settings</span>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="grid gap-1">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  {link.to === "/ai-planner" && <Sparkles className="size-3.5 text-amber-500" />}
                </Link>
              ))}

              {/* User Section or Guest Auth Buttons */}
              {user ? (
                <div className="border-t border-border/50 pt-3 mt-2 space-y-2">
                  <div className="flex items-center gap-3 px-3 py-1.5">
                    <Avatar className="size-9">
                      {userAvatar ? <AvatarImage src={userAvatar} alt={userName} /> : null}
                      <AvatarFallback className="font-semibold text-xs bg-gradient-brand text-primary-foreground">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-foreground truncate">{userName}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setOpen(false);
                      handleSignOut();
                    }}
                    className="w-full justify-start rounded-xl text-destructive hover:text-destructive h-9"
                  >
                    <LogOut className="size-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="border-t border-border/50 pt-3 mt-2 flex gap-2">
                  <Button variant="outline" size="sm" asChild className="flex-1 rounded-xl h-10">
                    <Link
                      to="/login"
                      search={{ redirect: undefined }}
                      onClick={() => setOpen(false)}
                    >
                      Sign In
                    </Link>
                  </Button>
                  <Button variant="hero" size="sm" asChild className="flex-1 rounded-xl h-10">
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

              <Button variant="hero" size="lg" asChild className="mt-3 rounded-2xl">
                <Link to="/ai-planner" onClick={() => setOpen(false)}>
                  <Sparkles className="size-4 mr-2" />
                  Plan My Trip
                </Link>
              </Button>
            </div>
          </div>
        ) : null}
      </header>

      {/* Global Command Search Palette */}
      <SearchCommandDialog open={searchOpen} onOpenChange={setSearchOpen} />

      {/* Wishlist Sheet */}
      <WishlistSheet open={wishlistOpen} onOpenChange={setWishlistOpen} />
    </>
  );
}
