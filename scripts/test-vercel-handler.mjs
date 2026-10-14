import vercelServer from "../.vercel/output/functions/__server.func/index.mjs";

async function testVercelRoute(path, envName, isApi = false) {
  const req = new Request(`https://dream-plan-fly.vercel.app${path}`, {
    method: "GET",
    headers: {
      accept: isApi
        ? "application/json"
        : "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "user-agent": "Mozilla/5.0",
    },
  });

  const ctx = {
    waitUntil: () => {},
  };

  try {
    const res = await vercelServer.fetch(req, ctx);
    const contentType = res.headers.get("content-type") || "";
    const body = await res.text();
    const isOk = res.status >= 200 && res.status < 300;
    console.log(
      `  [${envName}] ${path} -> HTTP ${res.status} (${contentType.split(";")[0]}) ${isOk ? "✓" : "✗"}`,
    );
    if (!isOk || body.includes("unhandled")) {
      console.log(`     BODY: ${body.slice(0, 300)}`);
    }
    return { status: res.status, ok: isOk, body };
  } catch (err) {
    console.error(`  [${envName}] ${path} -> CRASH:`, err);
    return { error: err };
  }
}

function clearAppEnv() {
  const keys = [
    "VITE_SITE_URL",
    "VITE_SUPABASE_URL",
    "VITE_SUPABASE_ANON_KEY",
    "VITE_SUPABASE_PUBLISHABLE_KEY",
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "GEMINI_API_KEY",
    "CRON_SECRET",
  ];
  for (const k of keys) {
    delete process.env[k];
  }
}

function setAppEnv(vars) {
  clearAppEnv();
  for (const [k, v] of Object.entries(vars)) {
    process.env[k] = v;
  }
}

async function main() {
  console.log("=================================================");
  console.log("VERCEL SERVERLESS FUNCTION END-TO-END VALIDATION");
  console.log("=================================================");
  const routes = ["/", "/explore", "/ai-planner", "/my-trips", "/bookings", "/save"];

  // 1. NO ENV VARS
  console.log("\nScenario 1: NO ENVIRONMENT VARIABLES");
  clearAppEnv();
  process.env.NODE_ENV = "production";
  for (const r of routes) {
    await testVercelRoute(r, "NO-ENV");
  }
  await testVercelRoute("/api/health", "NO-ENV", true);

  // 2. ONLY PUBLIC ENV VARS
  console.log("\nScenario 2: ONLY PUBLIC ENV VARS");
  setAppEnv({
    VITE_SITE_URL: "https://dream-plan-fly.vercel.app",
    VITE_SUPABASE_URL: "https://xyzexample.supabase.co",
    VITE_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key",
  });
  for (const r of routes) {
    await testVercelRoute(r, "PUBLIC-ONLY");
  }
  await testVercelRoute("/api/health", "PUBLIC-ONLY", true);

  // 3. FULL ENV VARS (with dummy server secrets)
  console.log("\nScenario 3: FULL ENV VARS (DUMMY SECRETS)");
  setAppEnv({
    VITE_SITE_URL: "https://dream-plan-fly.vercel.app",
    VITE_SUPABASE_URL: "https://xyzexample.supabase.co",
    VITE_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key",
    SUPABASE_URL: "https://xyzexample.supabase.co",
    SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key",
    SUPABASE_SERVICE_ROLE_KEY: "dummy-service-role-key",
    GEMINI_API_KEY: "dummy-gemini-key",
    CRON_SECRET: "dummy-cron-secret",
  });
  for (const r of routes) {
    await testVercelRoute(r, "FULL-ENV");
  }
  await testVercelRoute("/api/health", "FULL-ENV", true);

  // 4. EMPTY STRING ENV VARS (Vercel unconfigured dashboard inputs)
  console.log("\nScenario 4: EMPTY STRING ENV VARS");
  setAppEnv({
    VITE_SITE_URL: "",
    VITE_SUPABASE_URL: "",
    VITE_SUPABASE_ANON_KEY: "",
    SUPABASE_URL: "",
    SUPABASE_ANON_KEY: "",
    GEMINI_API_KEY: "",
  });
  for (const r of routes) {
    await testVercelRoute(r, "EMPTY-STRINGS");
  }
  await testVercelRoute("/api/health", "EMPTY-STRINGS", true);
}

main().catch(console.error);
