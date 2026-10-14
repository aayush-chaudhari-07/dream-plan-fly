import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Compass,
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { Navbar } from "@/components/smarttrip/Navbar";
import { Footer } from "@/components/smarttrip/Footer";

type SignupSearch = {
  redirect?: string | undefined;
};

import { createSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/signup")({
  validateSearch: (search: Record<string, unknown>): SignupSearch => ({
    redirect: typeof search["redirect"] === "string" ? (search["redirect"] as string) : undefined,
  }),
  head: () =>
    createSeoHead({
      title: "Create Account",
      description: "Join SmartTrip to generate AI itineraries, save trips, and track travel funds.",
      path: "/signup",
    }),
  component: SignUpPage,
});

function SignUpPage() {
  const { redirect: redirectUrl } = Route.useSearch();
  const { signUpWithPassword, signInWithGoogle, user, isConfigured } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      navigate({ to: redirectUrl || "/my-trips" });
    }
  }, [user, redirectUrl, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please enter your email and password.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }
    setErrorMsg(null);
    setSubmitting(true);
    try {
      const res = await signUpWithPassword({ email, password, fullName });
      if (res.error) {
        setErrorMsg(res.error);
        toast.error("Sign up failed", { description: res.error });
      } else {
        toast.success("Account created successfully!", {
          description: "Your local trips and dream funds have been synced.",
        });
        navigate({ to: redirectUrl || "/my-trips" });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setGoogleSubmitting(true);
    try {
      const res = await signInWithGoogle();
      if (res.error) {
        setErrorMsg(res.error);
        toast.error("Google sign-in error", { description: res.error });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to connect to Google.";
      setErrorMsg(msg);
    } finally {
      setGoogleSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/20">
      <Navbar />

      <main className="container-page flex flex-1 items-center justify-center py-24 sm:py-32">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="surface-card relative overflow-hidden rounded-3xl p-6 sm:p-8 shadow-elevated">
            {/* Top decorative gradient glow */}
            <div
              className="pointer-events-none absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full blur-3xl opacity-20 bg-primary"
              aria-hidden="true"
            />

            {/* Header */}
            <div className="relative text-center mb-6">
              <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-soft mb-3">
                <Compass className="size-6" />
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Plan Less. Travel More.
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Create a free SmartTrip account to save itineraries and fund your dreams.
              </p>
            </div>

            {/* Guest Migration notice */}
            <div className="mb-6 rounded-2xl border border-primary/20 bg-primary/5 p-3.5 text-xs text-foreground/80">
              <div className="flex gap-2">
                <Sparkles className="size-4 shrink-0 text-primary mt-0.5" />
                <div>
                  <span className="font-semibold text-primary">Seamless Sync:</span> Any trips or
                  funds you've generated as a guest will be automatically migrated to your new
                  account.
                </div>
              </div>
            </div>

            {!isConfigured && (
              <div className="mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3.5 text-xs text-amber-700 dark:text-amber-300">
                <div className="flex gap-2">
                  <AlertCircle className="size-4 shrink-0 text-amber-500" />
                  <div>
                    <span className="font-semibold">Backend in Local Mode:</span> Supabase
                    environment variables are not configured. You can continue as a guest with
                    localStorage.
                  </div>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="mb-4 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
                {errorMsg}
              </div>
            )}

            {/* Google OAuth Button */}
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full rounded-2xl h-11 text-sm font-semibold border-border/80 hover:bg-secondary flex items-center justify-center gap-2"
              onClick={handleGoogleSignIn}
              disabled={googleSubmitting || submitting}
            >
              {googleSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <svg className="size-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              Sign up with Google
            </Button>

            {/* Divider */}
            <div className="relative my-5 text-center text-xs text-muted-foreground">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/60" />
              </div>
              <span className="relative bg-card px-2">or with email</span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="signup-name"
                  className="block text-xs font-semibold text-foreground/80 mb-1.5"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="signup-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Doe"
                    className="pl-10 h-11 rounded-xl bg-background/50 border-border/80"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="signup-email"
                  className="block text-xs font-semibold text-foreground/80 mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="pl-10 h-11 rounded-xl bg-background/50 border-border/80"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="signup-password"
                  className="block text-xs font-semibold text-foreground/80 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    className="pl-10 h-11 rounded-xl bg-background/50 border-border/80"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full rounded-2xl h-11 text-sm font-semibold shadow-soft"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="size-4 ml-1.5" />
                  </>
                )}
              </Button>
            </form>

            {/* Bottom Links */}
            <div className="mt-6 text-center text-xs text-muted-foreground space-y-2">
              <p>
                Already have an account?{" "}
                <Link
                  to="/login"
                  search={{ redirect: redirectUrl }}
                  className="font-semibold text-primary hover:underline"
                >
                  Sign in
                </Link>
              </p>
              <p>
                <Link
                  to={redirectUrl || "/"}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Continue as guest
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
