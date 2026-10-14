import React, { createContext, useContext, useEffect, useState } from "react";
import type { User, Session, AuthChangeEvent } from "@supabase/supabase-js";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/client/lib/supabase/client";
import { migrateGuestDataFn } from "@/server/functions/trip-actions";
import { setStoreAuthUser } from "@/client/lib/smarttrip-store";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isConfigured: boolean;
  signInWithPassword: (data: { email: string; password: string }) => Promise<{ error?: string }>;
  signUpWithPassword: (data: {
    email: string;
    password: string;
    fullName?: string;
  }) => Promise<{ error?: string; user?: User | null }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (data: {
    fullName?: string;
    avatarUrl?: string;
    homeCity?: string;
    currency?: string;
  }) => Promise<{ error?: string }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_STORAGE_KEY = "smarttrip.state.v1";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isConfigured = isSupabaseConfigured();

  useEffect(() => {
    if (!isConfigured) {
      setIsLoading(false);
      return;
    }

    const supabase = getSupabaseBrowserClient();

    // 1. Initial session load
    supabase.auth.getSession().then((result: { data: { session: Session | null } }) => {
      const currentSession = result.data.session;
      setSession(currentSession);
      const initialUser = currentSession?.user ?? null;
      setUser(initialUser);
      setStoreAuthUser(initialUser);
      setIsLoading(false);
    });

    // 2. Auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, newSession: Session | null) => {
        setSession(newSession);
        const currentUser = newSession?.user ?? null;
        setUser(currentUser);
        setStoreAuthUser(currentUser);
        setIsLoading(false);

        // On SIGNED_IN, check for one-time guest migration
        if (event === "SIGNED_IN" && currentUser) {
          const migrationKey = `smarttrip.migrated.${currentUser.id}`;
          if (typeof window !== "undefined" && !localStorage.getItem(migrationKey)) {
            try {
              const raw = localStorage.getItem(GUEST_STORAGE_KEY);
              if (raw) {
                const parsed = JSON.parse(raw);
                await migrateGuestDataFn({ data: parsed });
                localStorage.setItem(migrationKey, "true");
              }
            } catch (e) {
              console.error("Failed to migrate guest data:", e);
            }
          }
        }
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [isConfigured]);

  const signInWithPassword = async ({ email, password }: { email: string; password: string }) => {
    if (!isConfigured) {
      return {
        error:
          "Supabase is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
      };
    }
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return {};
  };

  const signUpWithPassword = async ({
    email,
    password,
    fullName,
  }: {
    email: string;
    password: string;
    fullName?: string;
  }) => {
    if (!isConfigured) {
      return {
        error:
          "Supabase is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
      };
    }
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || "",
        },
      },
    });
    if (error) return { error: error.message };
    return { user: data.user };
  };

  const signInWithGoogle = async () => {
    if (!isConfigured) {
      return {
        error:
          "Supabase is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
      };
    }
    const supabase = getSupabaseBrowserClient();
    const redirectTo =
      typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      ...(redirectTo ? { options: { redirectTo } } : {}),
    });
    if (error) return { error: error.message };
    return {};
  };

  const signOut = async () => {
    if (!isConfigured) {
      setUser(null);
      setSession(null);
      setStoreAuthUser(null);
      return;
    }
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setStoreAuthUser(null);
  };

  const updateProfile = async (data: {
    fullName?: string;
    avatarUrl?: string;
    homeCity?: string;
    currency?: string;
  }) => {
    if (!user) {
      return { error: "Please sign in to update your profile." };
    }

    const currentMeta = (user.user_metadata || {}) as Record<string, unknown>;
    const updatedMeta: Record<string, unknown> = { ...currentMeta };
    if (data.fullName !== undefined) updatedMeta["full_name"] = data.fullName;
    if (data.avatarUrl !== undefined) updatedMeta["avatar_url"] = data.avatarUrl;
    if (data.homeCity !== undefined) updatedMeta["home_city"] = data.homeCity;
    if (data.currency !== undefined) updatedMeta["currency"] = data.currency;

    if (!isConfigured) {
      // Local optimistic update in offline/mock mode
      const updatedUser: User = {
        ...user,
        user_metadata: updatedMeta,
      };
      setUser(updatedUser);
      return {};
    }

    const supabase = getSupabaseBrowserClient();
    const { data: res, error } = await supabase.auth.updateUser({
      data: updatedMeta,
    });
    if (error) return { error: error.message };
    if (res.user) {
      setUser(res.user);
    }
    return {};
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isConfigured,
        signInWithPassword,
        signUpWithPassword,
        signInWithGoogle,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
