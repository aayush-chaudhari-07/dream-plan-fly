import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth-context";
import appCss from "../styles.css?url";
import { AlertTriangle, Compass, Home, MapPin, RefreshCw, Sparkles, Wand2 } from "lucide-react";
import { reportError } from "../lib/error-report";

function NotFoundComponent() {
  return (
    <main
      className="flex min-h-screen items-center justify-center bg-background px-4 py-16"
      role="main"
    >
      <div className="surface-card max-w-lg w-full p-8 sm:p-10 text-center rounded-3xl shadow-elevated border border-border">
        <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-primary/10 text-primary mb-6">
          <Compass className="size-8" />
        </div>
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Error 404</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
          Off the Map
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          The destination or page you're searching for hasn't been chartered yet. Let's get you back
          on course.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 shadow-md"
          >
            <Home className="size-4" /> Go Home
          </Link>
          <Link
            to="/explore"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-accent"
          >
            <MapPin className="size-4" /> Explore Places
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <Link
            to="/ai-planner"
            className="hover:text-primary transition-colors inline-flex items-center gap-1"
          >
            <Wand2 className="size-3.5" /> AI Planner
          </Link>
          <Link to="/bookings" className="hover:text-primary transition-colors">
            Bookings
          </Link>
          <Link to="/faq" className="hover:text-primary transition-colors">
            Help Center
          </Link>
        </div>
      </div>
    </main>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <main
      className="flex min-h-screen items-center justify-center bg-background px-4 py-16"
      role="alert"
      aria-live="assertive"
    >
      <div className="surface-card max-w-lg w-full p-8 sm:p-10 text-center rounded-3xl shadow-elevated border border-border">
        <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-destructive/10 text-destructive mb-6">
          <AlertTriangle className="size-8" />
        </div>
        <p className="text-xs font-bold uppercase tracking-wider text-destructive">
          Application Error
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Something went wrong
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          We encountered an unexpected glitch loading this view. The telemetry has been logged to
          our free error monitoring system.
        </p>

        {error?.message && (
          <div className="mt-4 rounded-xl bg-muted/60 p-3 text-left font-mono text-xs text-muted-foreground overflow-x-auto max-h-24">
            {error.message}
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 shadow-md cursor-pointer"
          >
            <RefreshCw className="size-4" /> Try Again
          </button>
          <a
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-accent"
          >
            <Home className="size-4" /> Go Home
          </a>
        </div>
      </div>
    </main>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SmartTrip — AI Travel Planner & Booking" },
      {
        name: "description",
        content:
          "Plan less, travel more. SmartTrip is your AI-powered companion for discovering destinations, building itineraries, saving for trips and booking travel.",
      },
      { name: "author", content: "SmartTrip" },
      { property: "og:title", content: "SmartTrip — AI Travel Planner & Booking" },
      {
        property: "og:description",
        content:
          "Plan less, travel more. SmartTrip is your AI-powered companion for discovering destinations, building itineraries, saving for trips and booking travel.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@smarttrip" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Sora:wght@500;600;700;800&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
        <Toaster position="bottom-right" richColors />
      </AuthProvider>
    </QueryClientProvider>
  );
}
