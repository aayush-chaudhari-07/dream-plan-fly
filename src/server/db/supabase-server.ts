import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getCookies } from "@tanstack/react-start/server";

function getSupabaseUrl(): string {
  if (typeof process !== "undefined" && process.env?.["VITE_SUPABASE_URL"]) {
    return process.env["VITE_SUPABASE_URL"];
  }
  if (typeof import.meta !== "undefined" && import.meta.env?.["VITE_SUPABASE_URL"]) {
    return import.meta.env["VITE_SUPABASE_URL"];
  }
  return "https://placeholder-project.supabase.co";
}

function getSupabaseAnonKey(): string {
  if (typeof process !== "undefined") {
    const key =
      process.env?.["VITE_SUPABASE_ANON_KEY"] || process.env?.["VITE_SUPABASE_PUBLISHABLE_KEY"];
    if (key) return key;
  }
  if (typeof import.meta !== "undefined") {
    const key =
      import.meta.env?.["VITE_SUPABASE_ANON_KEY"] ||
      import.meta.env?.["VITE_SUPABASE_PUBLISHABLE_KEY"];
    if (key) return key;
  }
  return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder";
}

export function getSupabaseServerClient(): SupabaseClient {
  return createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

export async function getServerUser() {
  try {
    const cookieRecord = getCookies();
    const cookies = cookieRecord || {};
    // Look for Supabase auth cookie: sb-<project-ref>-auth-token
    const authKey = Object.keys(cookies).find(
      (k) => k.startsWith("sb-") && k.endsWith("-auth-token"),
    );
    let accessToken: string | null = null;
    if (authKey && cookies[authKey]) {
      try {
        const raw = cookies[authKey];
        const parsed = JSON.parse(raw);
        accessToken = parsed.access_token || (Array.isArray(parsed) ? parsed[0] : null);
      } catch {
        accessToken = cookies[authKey];
      }
    }
    if (!accessToken) return null;
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser(accessToken);
    if (error || !data?.user) return null;
    return data.user;
  } catch {
    return null;
  }
}
