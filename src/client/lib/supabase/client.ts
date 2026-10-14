import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function getSupabaseUrl(): string {
  if (typeof import.meta !== "undefined" && import.meta.env?.["VITE_SUPABASE_URL"]) {
    return import.meta.env["VITE_SUPABASE_URL"];
  }
  if (typeof process !== "undefined" && process.env?.["VITE_SUPABASE_URL"]) {
    return process.env["VITE_SUPABASE_URL"];
  }
  return "https://placeholder-project.supabase.co";
}

function getSupabaseAnonKey(): string {
  if (typeof import.meta !== "undefined") {
    const key =
      import.meta.env?.["VITE_SUPABASE_ANON_KEY"] ||
      import.meta.env?.["VITE_SUPABASE_PUBLISHABLE_KEY"];
    if (key) return key;
  }
  if (typeof process !== "undefined") {
    const key =
      process.env?.["VITE_SUPABASE_ANON_KEY"] || process.env?.["VITE_SUPABASE_PUBLISHABLE_KEY"];
    if (key) return key;
  }
  return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder";
}

export function isSupabaseConfigured(): boolean {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  return (
    Boolean(url && key) &&
    !url.includes("placeholder-project.supabase.co") &&
    !key.includes("placeholder")
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
