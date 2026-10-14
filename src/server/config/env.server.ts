import { z } from "zod";

/**
 * Server Environment Configuration & Validator
 *
 * Validates and exposes typed environment variables strictly on the server.
 * NEVER import this module into client-side code.
 */

export class MissingEnvironmentVariableError extends Error {
  constructor(
    public readonly variableName: string,
    public readonly featureName: string,
    public readonly documentationUrl: string,
  ) {
    super(
      `[SmartTrip Configuration] Missing required environment variable: "${variableName}".\n` +
        `Feature affected: ${featureName}\n` +
        `How to resolve: Add "${variableName}=<your-value>" to your .env file (local) or Vercel Environment Variables (production).\n` +
        `Free-tier key source: ${documentationUrl}`,
    );
    this.name = "MissingEnvironmentVariableError";
  }
}

const emptyStringToUndefined = (schema: z.ZodTypeAny) =>
  z.preprocess((val) => {
    if (typeof val === "string") {
      const trimmed = val.trim();
      return trimmed === "" ? undefined : trimmed;
    }
    return val;
  }, schema);

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),
  NITRO_PRESET: emptyStringToUndefined(z.string().optional()),

  // Supabase Database & Auth (Server-side)
  SUPABASE_URL: emptyStringToUndefined(z.string().url().optional()),
  VITE_SUPABASE_URL: emptyStringToUndefined(z.string().url().optional()),
  SUPABASE_ANON_KEY: emptyStringToUndefined(z.string().min(1).optional()),
  VITE_SUPABASE_ANON_KEY: emptyStringToUndefined(z.string().min(1).optional()),
  VITE_SUPABASE_PUBLISHABLE_KEY: emptyStringToUndefined(z.string().min(1).optional()),
  SUPABASE_SERVICE_ROLE_KEY: emptyStringToUndefined(z.string().min(1).optional()),

  // Google Gemini AI
  GEMINI_API_KEY: emptyStringToUndefined(z.string().min(1).optional()),

  // Demo Payment HMAC Secret
  DEMO_PAY_SECRET: z.preprocess((val) => {
    if (typeof val === "string" && val.trim() === "") return undefined;
    return val;
  }, z.string().min(1).default("smarttrip-demo-secret-key-do-not-use-in-real-prod")),

  // Scheduled Jobs Cron Secret
  CRON_SECRET: emptyStringToUndefined(z.string().min(1).optional()),

  // Optional Razorpay Gateway
  RAZORPAY_KEY_ID: emptyStringToUndefined(z.string().optional()),
  RAZORPAY_KEY_SECRET: emptyStringToUndefined(z.string().optional()),

  // Public Site Base URL
  VITE_SITE_URL: emptyStringToUndefined(z.string().url().optional()),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cachedServerEnv: ServerEnv | null = null;

export function getServerEnv(): ServerEnv {
  if (cachedServerEnv) {
    return cachedServerEnv;
  }

  const result = serverEnvSchema.safeParse(process.env);

  if (!result.success) {
    const errorDetails = result.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    console.error(
      `[SmartTrip Configuration] Invalid server environment configuration:\n${errorDetails}`,
    );
    throw new Error(`Invalid server environment variables:\n${errorDetails}`);
  }

  cachedServerEnv = result.data;
  return cachedServerEnv;
}

/**
 * Asserts that a required server environment variable is present and valid.
 * Throws a human-friendly MissingEnvironmentVariableError naming the variable,
 * the affected feature, and where to obtain a free key.
 */
export function assertServerEnv(
  variableName: keyof ServerEnv,
  featureName: string,
  documentationUrl: string,
): string {
  const env = getServerEnv();
  const value = env[variableName];

  if (!value || (typeof value === "string" && value.includes("placeholder"))) {
    throw new MissingEnvironmentVariableError(String(variableName), featureName, documentationUrl);
  }

  return String(value);
}

/**
 * Returns the resolved Supabase endpoint URL for server operations.
 * Priority: SUPABASE_URL -> VITE_SUPABASE_URL -> development placeholder.
 */
export function getResolvedSupabaseUrl(): string {
  const env = getServerEnv();
  return env.SUPABASE_URL || env.VITE_SUPABASE_URL || "https://placeholder-project.supabase.co";
}

/**
 * Returns the resolved Supabase Anon / Public Key for server operations.
 * Priority: SUPABASE_ANON_KEY -> VITE_SUPABASE_ANON_KEY -> VITE_SUPABASE_PUBLISHABLE_KEY.
 */
export function getResolvedSupabaseAnonKey(): string {
  const env = getServerEnv();
  return (
    env.SUPABASE_ANON_KEY ||
    env.VITE_SUPABASE_ANON_KEY ||
    env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder"
  );
}

/**
 * Returns the resolved Cron Secret for endpoint authorization.
 * Defaults to "dev-cron-secret" outside production.
 */
export function getResolvedCronSecret(): string {
  const env = getServerEnv();
  if (env.CRON_SECRET) {
    return env.CRON_SECRET;
  }
  if (env.NODE_ENV !== "production") {
    return "dev-cron-secret";
  }
  throw new MissingEnvironmentVariableError(
    "CRON_SECRET",
    "Scheduled Daily Price Alerts Endpoint (/api/cron/price-fluctuations)",
    "https://github.com/settings/tokens or generate with `openssl rand -hex 32`",
  );
}
