import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getClientEnv, isSupabaseConfigured } from "@/client/lib/env.client";

export { isSupabaseConfigured };

function getSupabaseUrl(): string {
  const env = getClientEnv();
  return env.VITE_SUPABASE_URL || "https://placeholder-project.supabase.co";
}

function getSupabaseAnonKey(): string {
  const env = getClientEnv();
  return (
    env.VITE_SUPABASE_ANON_KEY ||
    env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder"
  );
}

let browserClient: SupabaseClient | undefined;

export function getSupabaseBrowserClient(): SupabaseClient {
  if (!browserClient) {
    browserClient = createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
      auth: {
        flowType: "pkce",
        detectSessionInUrl: typeof window !== "undefined",
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return browserClient;
}
