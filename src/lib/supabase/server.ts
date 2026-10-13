import { createServerClient } from "@supabase/ssr";
import { getCookies, setCookie } from "@tanstack/react-start/server";

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

export function getSupabaseServerClient() {
  return createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        try {
          const cookieRecord = getCookies();
          return Object.entries(cookieRecord || {}).map(([name, value]) => ({
            name,
            value,
          }));
        } catch {
          return [];
        }
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            setCookie(name, value, options);
          });
        } catch {
          // Cookies may not be mutable in certain read-only SSR phases
        }
      },
    },
  });
}

export async function getServerUser() {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) return null;
    return data.user;
  } catch {
    return null;
  }
}
