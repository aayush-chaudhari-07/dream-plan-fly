import { z } from "zod";

/**
 * Client Environment Configuration & Validator
 *
 * Safely accesses and validates public browser environment variables.
 * Strictly uses VITE_ public variables or client fallbacks.
 */

const emptyStringToUndefined = (schema: z.ZodTypeAny) =>
  z.preprocess((val) => {
    if (typeof val === "string") {
      const trimmed = val.trim();
      return trimmed === "" ? undefined : trimmed;
    }
    return val;
  }, schema);

const clientEnvSchema = z.object({
  VITE_SITE_URL: emptyStringToUndefined(z.string().url().optional()),
  VITE_SUPABASE_URL: emptyStringToUndefined(z.string().url().optional()),
  VITE_SUPABASE_ANON_KEY: emptyStringToUndefined(z.string().min(1).optional()),
  VITE_SUPABASE_PUBLISHABLE_KEY: emptyStringToUndefined(z.string().min(1).optional()),
  VITE_SENTRY_DSN: emptyStringToUndefined(z.string().optional()),
  MODE: z.string().optional(),
  DEV: z.boolean().optional(),
  PROD: z.boolean().optional(),
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;

function rawClientEnv(): Record<string, unknown> {
  const metaEnv = (
    typeof import.meta !== "undefined" && import.meta.env ? import.meta.env : {}
  ) as Record<string, string | undefined>;
  const procEnv = (typeof process !== "undefined" && process.env ? process.env : {}) as Record<
    string,
    string | undefined
  >;

  return {
    VITE_SITE_URL: metaEnv["VITE_SITE_URL"] || procEnv["VITE_SITE_URL"],
    VITE_SUPABASE_URL: metaEnv["VITE_SUPABASE_URL"] || procEnv["VITE_SUPABASE_URL"],
    VITE_SUPABASE_ANON_KEY: metaEnv["VITE_SUPABASE_ANON_KEY"] || procEnv["VITE_SUPABASE_ANON_KEY"],
    VITE_SUPABASE_PUBLISHABLE_KEY:
      metaEnv["VITE_SUPABASE_PUBLISHABLE_KEY"] || procEnv["VITE_SUPABASE_PUBLISHABLE_KEY"],
    VITE_SENTRY_DSN: metaEnv["VITE_SENTRY_DSN"] || procEnv["VITE_SENTRY_DSN"],
    MODE: metaEnv["MODE"] || procEnv["NODE_ENV"],
    DEV: Boolean(metaEnv["DEV"] || procEnv["NODE_ENV"] !== "production"),
    PROD: Boolean(metaEnv["PROD"] || procEnv["NODE_ENV"] === "production"),
  };
}

let cachedClientEnv: ClientEnv | null = null;

export function getClientEnv(): ClientEnv {
  if (cachedClientEnv) {
    return cachedClientEnv;
  }

  const raw = rawClientEnv();
  const parsed = clientEnvSchema.safeParse(raw);

  if (!parsed.success) {
    // In browser, log warning without crashing user session
    console.warn("[SmartTrip Config] Public environment warnings:", parsed.error.issues);
    cachedClientEnv = raw as ClientEnv;
    return cachedClientEnv;
  }

  cachedClientEnv = parsed.data;
  return cachedClientEnv;
}

/**
 * Checks whether Supabase cloud backend credentials are fully configured.
 * When false, the client gracefully operates in offline guest mode.
 */
export function isSupabaseConfigured(): boolean {
  const env = getClientEnv();
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY;

  return Boolean(
    url &&
    key &&
    !url.includes("placeholder") &&
    !url.includes("your-project-ref") &&
    !key.includes("placeholder") &&
    !key.includes("your-supabase"),
  );
}
