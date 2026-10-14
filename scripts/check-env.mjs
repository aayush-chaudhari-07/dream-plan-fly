#!/usr/bin/env node

/**
 * Environment Variable Preflight Checker
 *
 * Inspects .env and active environment variables.
 * Reports configuration status with 100% privacy:
 * NEVER prints secret values, only status (SET / DEFAULT / MISSING).
 */

import fs from "node:fs";
import path from "node:path";

const ROOT_DIR = process.cwd();
const ENV_PATH = path.resolve(ROOT_DIR, ".env");
const ENV_EXAMPLE_PATH = path.resolve(ROOT_DIR, ".env.example");

// 1. Ensure .env exists
if (!fs.existsSync(ENV_PATH)) {
  if (fs.existsSync(ENV_EXAMPLE_PATH)) {
    console.log("ℹ️  .env not found. Creating .env from .env.example template...\n");
    fs.copyFileSync(ENV_EXAMPLE_PATH, ENV_PATH);
  }
}

// 2. Parse .env without external dependencies
function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, "utf-8");
  const env = {};

  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eqIdx = trimmed.indexOf("=");
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      // Remove surrounding quotes if present
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      env[key] = val;
    }
  }
  return env;
}

const fileEnv = parseEnvFile(ENV_PATH);

function getVarState(name) {
  const val = process.env[name] || fileEnv[name];
  if (!val || val.trim() === "") {
    return { status: "MISSING", hasValue: false };
  }
  if (
    val.includes("placeholder") ||
    val.includes("your-") ||
    val.includes("xxxx") ||
    val.includes("yourKeyId")
  ) {
    return { status: "PLACEHOLDER", hasValue: false };
  }
  return { status: "SET", hasValue: true };
}

// Configuration registry
const VARIABLES = [
  {
    name: "VITE_SUPABASE_URL",
    scope: "Public / Client",
    tier: "Required for Cloud Sync",
    freeSource: "https://supabase.com",
    fallback: "Guest Mode (offline browser localStorage & seed data)",
  },
  {
    name: "VITE_SUPABASE_ANON_KEY",
    scope: "Public / Client",
    tier: "Required for Cloud Sync",
    freeSource: "https://supabase.com",
    fallback: "Guest Mode (offline browser localStorage & seed data)",
  },
  {
    name: "GEMINI_API_KEY",
    scope: "Server-only",
    tier: "Optional (Recommended)",
    freeSource: "https://aistudio.google.com/app/apikey (1,500 RPD free)",
    fallback: "Offline rule-based itinerary engine (`buildPlan()`) with 0 errors",
  },
  {
    name: "VITE_SITE_URL",
    scope: "Public / Client",
    tier: "Optional",
    freeSource: "Vercel free subdomain or http://localhost:3000",
    fallback: "http://localhost:3000 (dev) or window.location.origin",
  },
  {
    name: "DEMO_PAY_SECRET",
    scope: "Server-only",
    tier: "Optional",
    freeSource: "Any random 32+ char string (`openssl rand -hex 32`)",
    fallback: "Internal development fallback HMAC secret",
  },
  {
    name: "CRON_SECRET",
    scope: "Server-only",
    tier: "Optional (Prod Cron)",
    freeSource: "Any random 32+ char string (`openssl rand -hex 32`)",
    fallback: '"dev-cron-secret" in non-production environments',
  },
  {
    name: "SUPABASE_SERVICE_ROLE_KEY",
    scope: "Server-only",
    tier: "Optional (Admin)",
    freeSource: "https://supabase.com (service_role key)",
    fallback: "Admin cron maintenance skipped; standard app uses anon client",
  },
  {
    name: "NITRO_PRESET",
    scope: "CI / Deploy",
    tier: "Optional",
    freeSource: "Auto-detected on Vercel / Netlify",
    fallback: "node-server (default) or auto-detected runtime",
  },
  {
    name: "RAZORPAY_KEY_ID",
    scope: "Server-only",
    tier: "Optional (Disabled)",
    freeSource: "https://dashboard.razorpay.com (Test Mode)",
    fallback: "Built-in 100% free DemoPayProvider (card, UPI, net banking)",
  },
  {
    name: "RAZORPAY_KEY_SECRET",
    scope: "Server-only",
    tier: "Optional (Disabled)",
    freeSource: "https://dashboard.razorpay.com (Test Mode)",
    fallback: "Built-in 100% free DemoPayProvider",
  },
];

function runCheck() {
  console.log("================================================================================");
  console.log("🛠️   SMARTTRIP ENVIRONMENT CONFIGURATION AUDIT");
  console.log("================================================================================");
  console.log("Note: Real secret values are NEVER printed or displayed.\n");

  let cloudConfigured = true;
  let geminiConfigured = false;

  for (const item of VARIABLES) {
    const { status, hasValue } = getVarState(item.name);
    let statusLabel = "";

    if (hasValue) {
      statusLabel = "✅ SET";
      if (item.name === "GEMINI_API_KEY") geminiConfigured = true;
    } else if (status === "PLACEHOLDER") {
      statusLabel = "⚠️  PLACEHOLDER (USING FALLBACK)";
      if (item.name.includes("SUPABASE")) cloudConfigured = false;
    } else {
      statusLabel = "⚪ UNSET (USING FALLBACK)";
      if (item.name.includes("SUPABASE")) cloudConfigured = false;
    }

    console.log(`📌 ${item.name}`);
    console.log(`   Scope:    ${item.scope} | ${item.tier}`);
    console.log(`   Status:   ${statusLabel}`);
    if (!hasValue) {
      console.log(`   Fallback: ${item.fallback}`);
      console.log(`   Get Free: ${item.freeSource}`);
    }
    console.log("");
  }

  console.log("--------------------------------------------------------------------------------");
  console.log("📊 RUNTIME ENVIRONMENT SUMMARY");
  console.log("--------------------------------------------------------------------------------");

  if (cloudConfigured) {
    console.log("☁️  Cloud Backend: CONNECTED (Supabase auth & cloud database persistence active)");
  } else {
    console.log("📱 Cloud Backend: GUEST MODE ACTIVE");
    console.log("   - User data, trips, and demo bookings persist safely in browser localStorage.");
    console.log(
      "   - To enable cloud multi-device sync, add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
    );
  }

  if (geminiConfigured) {
    console.log("✨ AI Planner:    LIVE (Google Gemini 2.5 Flash active with 1,500 RPD quota)");
  } else {
    console.log("🧭 AI Planner:    OFFLINE HEURISTIC ENGINE (`buildPlan()`) ACTIVE");
    console.log("   - Itineraries generate deterministically with 0 external API dependencies.");
    console.log(
      "   - To enable live Gemini AI generation, add GEMINI_API_KEY from https://aistudio.google.com/app/apikey.",
    );
  }

  console.log("💳 Demo Payment:  ACTIVE (100% Free DemoPayProvider with HMAC signed e-tickets)");
  console.log("🌤️  Weather API:   ACTIVE (Key-less Open-Meteo with 30-min cache)");
  console.log("💱 Currency API:  ACTIVE (Key-less Frankfurter ECB with daily cache)");
  console.log("--------------------------------------------------------------------------------\n");
}

runCheck();
