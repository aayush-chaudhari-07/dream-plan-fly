import { spawn } from "node:child_process";
import http from "node:http";

async function makeRequest(port, path) {
  return new Promise((resolve, reject) => {
    const req = http.get(
      {
        hostname: "127.0.0.1",
        port,
        path,
        headers: {
          accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data,
          });
        });
      },
    );
    req.on("error", reject);
  });
}

async function runScenario(scenarioName, envOverrides, port) {
  console.log(`\n========================================`);
  console.log(`SCENARIO: ${scenarioName}`);
  console.log(`PORT: ${port}`);
  console.log(`========================================`);

  // Start with clean environment (only system essential vars)
  const baseEnv = {
    PATH: process.env.PATH || "",
    SYSTEMROOT: process.env.SYSTEMROOT || "",
    HOMEPATH: process.env.HOMEPATH || "",
    USERPROFILE: process.env.USERPROFILE || "",
    PORT: String(port),
    NITRO_PORT: String(port),
    NODE_ENV: "production",
    ...envOverrides,
  };

  const proc = spawn("node", [".output/server/index.mjs"], {
    env: baseEnv,
    stdio: ["ignore", "pipe", "pipe"],
  });

  let serverOutput = "";
  proc.stdout.on("data", (d) => {
    serverOutput += d.toString();
  });
  proc.stderr.on("data", (d) => {
    serverOutput += d.toString();
    console.error(`[Server stderr]`, d.toString());
  });

  // Wait for server to start listening
  await new Promise((r) => setTimeout(r, 2000));

  const routes = ["/", "/explore", "/ai-planner", "/my-trips", "/bookings", "/save"];
  const results = {};

  for (const route of routes) {
    try {
      const res = await makeRequest(port, route);
      const isJson = (res.headers["content-type"] || "").includes("application/json");
      let bodySnippet = res.body.slice(0, 150).replace(/\n/g, " ");
      results[route] = {
        status: res.statusCode,
        contentType: res.headers["content-type"],
        isJson,
        snippet: bodySnippet,
      };
      console.log(`Route ${route} -> HTTP ${res.statusCode} (${res.headers["content-type"]})`);
      if (res.statusCode >= 500) {
        console.log(`   Body: ${res.body}`);
      }
    } catch (err) {
      console.error(`Route ${route} -> ERROR:`, err.message);
      results[route] = { error: err.message };
    }
  }

  proc.kill();
  await new Promise((r) => setTimeout(r, 500));
  return { results, serverOutput };
}

async function main() {
  // Scenario 1: NO env vars
  await runScenario("NO ENVIRONMENT VARIABLES", {}, 3451);

  // Scenario 2: ONLY PUBLIC ENV VARS
  await runScenario(
    "ONLY PUBLIC ENV VARS",
    {
      VITE_SITE_URL: "https://example.com",
      VITE_SUPABASE_URL: "https://xyzcompany.supabase.co",
      VITE_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key",
    },
    3452,
  );

  // Scenario 3: FULL ENV VARS (with dummy server secrets)
  await runScenario(
    "FULL ENV VARS (DUMMY SECRETS)",
    {
      VITE_SITE_URL: "https://example.com",
      VITE_SUPABASE_URL: "https://xyzcompany.supabase.co",
      VITE_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key",
      SUPABASE_URL: "https://xyzcompany.supabase.co",
      SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key",
      SUPABASE_SERVICE_ROLE_KEY: "dummy-service-role-key",
      GEMINI_API_KEY: "dummy-gemini-key",
      CRON_SECRET: "dummy-cron-secret",
    },
    3453,
  );

  // Scenario 4: EMPTY STRING ENV VARS (common Vercel configuration state)
  await runScenario(
    "EMPTY STRING ENV VARS (VERCEL BLANK CONFIG)",
    {
      VITE_SITE_URL: "",
      VITE_SUPABASE_URL: "",
      VITE_SUPABASE_ANON_KEY: "",
      SUPABASE_URL: "",
      SUPABASE_ANON_KEY: "",
      GEMINI_API_KEY: "",
    },
    3454,
  );
}

main().catch(console.error);
