import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Camera,
  Check,
  Coins,
  Globe,
  Lock,
  Luggage,
  MapPin,
  Save,
  Sparkles,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/client/components/ui/avatar";
import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/client/components/ui/select";
import { Footer } from "@/client/components/Footer";
import { Navbar } from "@/client/components/Navbar";
import { PageHeader } from "@/client/components/PageHeader";
import { SupportDock } from "@/client/features/support/SupportDock";
import { useAuth } from "@/client/lib/auth-context";
import { updateProfileFn } from "@/server/functions/trip-actions";
import { getExchangeRatesFn } from "@/server/functions/live-data-actions";
import type { ExchangeRates } from "@/server/services/currency";

import { createSeoHead } from "@/client/lib/seo";

export const Route = createFileRoute("/settings")({
  head: () =>
    createSeoHead({
      title: "Account & Travel Preferences",
      description: "Manage your profile, avatar, home city and preferred currency on SmartTrip.",
      path: "/settings",
      noindex: true,
    }),
  component: SettingsPage,
});

const PRESET_AVATARS = [
  {
    label: "Alpine Explorer",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
  },
  {
    label: "Mountain Nomad",
    url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80",
  },
  {
    label: "Island Hopper",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
  },
  {
    label: "City Wanderer",
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80",
  },
  {
    label: "Coastal Seeker",
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80",
  },
  {
    label: "Global Trekker",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80",
  },
];

const POPULAR_CITIES = [
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Goa",
  "Hyderabad",
  "Kolkata",
  "London",
  "New York",
  "Tokyo",
  "Dubai",
];

const CURRENCIES = [
  { code: "INR", symbol: "₹", name: "Indian Rupee", supported: true },
  { code: "USD", symbol: "$", name: "US Dollar", supported: true },
  { code: "EUR", symbol: "€", name: "Euro", supported: true },
  { code: "GBP", symbol: "£", name: "British Pound", supported: true },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", supported: true },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", supported: true },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", supported: true },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar", supported: true },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham", supported: false },
];

function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const userMeta = user?.user_metadata || {};
  const [fullName, setFullName] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [homeCity, setHomeCity] = useState<string>("Mumbai");
  const [currency, setCurrency] = useState<string>("INR");
  const [saving, setSaving] = useState(false);
  const [ratesData, setRatesData] = useState<ExchangeRates | null>(null);

  useEffect(() => {
    getExchangeRatesFn()
      .then(setRatesData)
      .catch((err) => console.warn("Could not load ECB rates:", err));
  }, []);

  // Sync initial state from user metadata
  useEffect(() => {
    if (user) {
      const meta = user.user_metadata || {};
      setFullName((meta["full_name"] as string) || (meta["name"] as string) || "");
      setAvatarUrl((meta["avatar_url"] as string) || (meta["picture"] as string) || "");
      setHomeCity((meta["home_city"] as string) || "Mumbai");
      setCurrency((meta["currency"] as string) || "INR");
    } else {
      // Load any saved guest preference from localStorage
      try {
        const guestPref = localStorage.getItem("smarttrip.guest_profile");
        if (guestPref) {
          const parsed = JSON.parse(guestPref);
          if (parsed.fullName) setFullName(parsed.fullName);
          if (parsed.avatarUrl) setAvatarUrl(parsed.avatarUrl);
          if (parsed.homeCity) setHomeCity(parsed.homeCity);
          if (parsed.currency) setCurrency(parsed.currency);
        }
      } catch {
        /* storage unavailable */
      }
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (user) {
        // Update user metadata in Supabase Auth
        const res = await updateProfile({
          fullName,
          avatarUrl,
          homeCity,
          currency,
        });

        if (res.error) {
          toast.error(res.error);
          setSaving(false);
          return;
        }

        // Also update profiles table in Postgres
        try {
          await updateProfileFn({
            data: {
              fullName,
              avatarUrl,
              homeCity,
              currency,
            },
          });
        } catch (serverErr) {
          console.warn("Could not sync to profiles table:", serverErr);
        }

        toast.success("Settings saved successfully!");
      } else {
        // Guest mode — save to local preferences
        localStorage.setItem(
          "smarttrip.guest_profile",
          JSON.stringify({ fullName, avatarUrl, homeCity, currency }),
        );
        toast.success("Preferences saved locally!");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save settings";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const userInitial =
    fullName.trim().length > 0
      ? fullName.trim()[0]?.toUpperCase()
      : (user?.email?.[0]?.toUpperCase() ?? "T");

  return (
    <>
      <Navbar />

      <PageHeader
        title="Account & Preferences"
        subtitle="Customize your traveler profile, choose your home departure city, and set your default currency for travel budgets."
      />

      <main className="container-page py-10 max-w-4xl">
        {!user && (
          <div className="mb-8 rounded-3xl border border-primary/20 bg-primary/5 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Sparkles className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">Browsing as a Guest</p>
                <p className="text-xs text-muted-foreground">
                  Sign in or create a free account to sync your profile, bookings, and trip fund
                  across all your devices.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="rounded-xl flex-1 sm:flex-none"
              >
                <Link to="/login" search={{ redirect: "/settings" }}>
                  Sign In
                </Link>
              </Button>
              <Button variant="hero" size="sm" asChild className="rounded-xl flex-1 sm:flex-none">
                <Link to="/signup" search={{ redirect: "/settings" }}>
                  Sign Up
                </Link>
              </Button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Overview Card */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group shrink-0">
                <Avatar className="size-24 rounded-3xl ring-4 ring-primary/10 shadow-elevated">
                  {avatarUrl ? (
                    <AvatarImage src={avatarUrl} alt={fullName || "User Avatar"} />
                  ) : null}
                  <AvatarFallback className="text-2xl font-bold bg-gradient-brand text-primary-foreground">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="text-center sm:text-left space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3 className="text-xl font-bold text-foreground">
                    {fullName.trim() || (user ? "Adventurous Traveler" : "Guest Explorer")}
                  </h3>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-secondary text-primary">
                    {user ? "Active Traveler" : "Guest Mode"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {user ? user.email : "Local session on this browser"}
                </p>
                <p className="text-xs text-muted-foreground/80 flex items-center justify-center sm:justify-start gap-1">
                  <MapPin className="size-3 text-primary shrink-0" />
                  Home base: <strong className="text-foreground">{homeCity}</strong> · Currency:{" "}
                  <strong className="text-foreground">{currency}</strong>
                </p>
              </div>
            </div>

            {/* Avatar URL & Preset Selector */}
            <div className="border-t border-border/50 pt-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Camera className="size-3.5 text-primary" />
                  Avatar Picture
                </label>
                <Input
                  type="url"
                  placeholder="Paste an image URL (e.g. https://...)"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="rounded-xl h-10 text-sm"
                />
                <p className="text-[11px] text-muted-foreground">
                  Paste a direct link to your photo, or choose one of the curated traveler avatars
                  below.
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2.5">
                  Curated Traveler Avatars:
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {PRESET_AVATARS.map((preset) => {
                    const isSelected = avatarUrl === preset.url;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setAvatarUrl(preset.url)}
                        className={`group relative flex flex-col items-center gap-1.5 p-2 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? "border-primary bg-primary/10 shadow-soft"
                            : "border-border/60 hover:border-border hover:bg-secondary/40"
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          loading="lazy"
                          decoding="async"
                          width={48}
                          height={48}
                          className="size-12 rounded-xl object-cover"
                        />
                        <span className="text-[10px] font-medium text-foreground text-center truncate max-w-full leading-tight">
                          {preset.label}
                        </span>
                        {isSelected && (
                          <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <Check className="size-2.5" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information & Preferences */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
            <h4 className="font-bold text-base text-foreground flex items-center gap-2">
              <User className="size-4 text-primary" />
              Traveler Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Full Name</label>
                <Input
                  type="text"
                  placeholder="e.g. Aayush Chaudhari"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="rounded-xl h-10 text-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Email Address</label>
                <Input
                  type="email"
                  value={user?.email || "guest@smarttrip.local"}
                  disabled
                  className="rounded-xl h-10 text-sm opacity-60 cursor-not-allowed bg-muted/40"
                />
              </div>
            </div>

            <div className="border-t border-border/50 pt-6 space-y-6">
              <h4 className="font-bold text-base text-foreground flex items-center gap-2">
                <Globe className="size-4 text-primary" />
                Regional & Travel Preferences
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Home City */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-primary" />
                    Home Departure City
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Mumbai"
                    value={homeCity}
                    onChange={(e) => setHomeCity(e.target.value)}
                    className="rounded-xl h-10 text-sm"
                  />
                  <div className="space-y-1">
                    <span className="text-[11px] text-muted-foreground block">
                      Quick select popular hubs:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {POPULAR_CITIES.map((city) => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => setHomeCity(city)}
                          className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium transition-colors cursor-pointer ${
                            homeCity.toLowerCase() === city.toLowerCase()
                              ? "bg-primary text-primary-foreground font-semibold"
                              : "bg-secondary text-foreground/80 hover:bg-secondary/80"
                          }`}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Preferred Currency */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Coins className="size-3.5 text-primary" />
                    Preferred Currency
                  </label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="rounded-xl h-10 text-sm">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      {CURRENCIES.map((c) => (
                        <SelectItem key={c.code} value={c.code} className="cursor-pointer">
                          <span className="font-semibold text-primary mr-1.5">{c.symbol}</span>
                          <span>
                            {c.name} ({c.code})
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Live ECB rate status */}
                  {currency === "INR" ? (
                    <div className="rounded-xl bg-secondary/50 p-2.5 text-[11px] text-muted-foreground flex items-center justify-between">
                      <span>Base currency: Indian Rupee (₹)</span>
                      <span className="font-semibold text-foreground">1 INR = ₹1.00</span>
                    </div>
                  ) : ratesData?.rates[currency] ? (
                    <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-2.5 text-[11px] text-emerald-800 dark:text-emerald-300 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Live ECB Rate via Frankfurter:</span>
                        <span className="font-bold">
                          1 INR = {ratesData.rates[currency]} {currency}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        Sample: ₹10,000 = {(10000 * ratesData.rates[currency]).toFixed(2)}{" "}
                        {currency}. Rates cached daily.
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-2.5 text-[11px] text-amber-800 dark:text-amber-300 space-y-0.5">
                      <div className="flex items-center gap-1.5 font-bold">
                        <span>Unsupported by ECB rates</span>
                      </div>
                      <p className="text-[10px]">
                        {currency} is not tracked by the European Central Bank. Showing in INR only
                        (₹).
                      </p>
                    </div>
                  )}

                  <p className="text-[11px] text-muted-foreground">
                    All budget estimations and trip calculations will be presented in your preferred
                    currency.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => navigate({ to: "/my-trips" })}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="hero"
              disabled={saving}
              className="rounded-xl min-w-36 gap-2"
            >
              <Save className="size-4" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </main>

      <Footer />
      <SupportDock />
    </>
  );
}
