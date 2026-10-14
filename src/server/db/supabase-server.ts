import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getCookies } from "@tanstack/react-start/server";
import { getResolvedSupabaseUrl, getResolvedSupabaseAnonKey } from "@/server/config/env.server";

export function getSupabaseServerClient(): SupabaseClient {
  return createClient(getResolvedSupabaseUrl(), getResolvedSupabaseAnonKey(), {
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
