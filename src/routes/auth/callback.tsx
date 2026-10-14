import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { getSupabaseBrowserClient } from "@/client/lib/supabase/client";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getSession().then(() => {
      navigate({ to: "/my-trips" });
    });
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="mx-auto size-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">
          Completing authentication and syncing your trips...
        </p>
      </div>
    </div>
  );
}
