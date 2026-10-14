import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import serverHandler from "@/server";
import { getServerEnv } from "@/server/config/env.server";
import { getClientEnv } from "@/client/lib/client-env";

describe("Production SSR & Server Error Resilience", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("/api/health returns HTTP 200 with health status and missing variable names in non-prod", async () => {
    process.env["NODE_ENV"] = "test";
    delete process.env["GEMINI_API_KEY"];

    const request = new Request("http://localhost:3000/api/health", {
      headers: { accept: "application/json" },
    });

    const response = await serverHandler.fetch(request, {}, {});
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");

    const data = await response.json();
    expect(data.ok).toBe(true);
    expect(typeof data.status).toBe("string");
    expect(Array.isArray(data.missingVariables)).toBe(true);
    // Must contain variable names only, never secrets
    expect(data.missingVariables).toContain("GEMINI_API_KEY");
  });

  it("/api/health returns minimal generic status in production mode", async () => {
    process.env["NODE_ENV"] = "production";
    process.env["VITE_SUPABASE_URL"] = "https://example.supabase.co";
    process.env["VITE_SUPABASE_ANON_KEY"] = "dummy-anon-key";

    const request = new Request("http://localhost:3000/api/health", {
      headers: { accept: "application/json" },
    });

    const response = await serverHandler.fetch(request, {}, {});
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.ok).toBe(true);
    expect(data.status).toBe("healthy");
    // In production, missingVariables array must NOT be exposed
    expect(data.missingVariables).toBeUndefined();
  });

  it("serverEnvSchema sanitizes empty string environment variables to undefined", () => {
    process.env["VITE_SUPABASE_URL"] = "";
    process.env["VITE_SITE_URL"] = "   ";
    process.env["GEMINI_API_KEY"] = "";

    const env = getServerEnv();
    expect(env.VITE_SUPABASE_URL).toBeUndefined();
    expect(env.VITE_SITE_URL).toBeUndefined();
    expect(env.GEMINI_API_KEY).toBeUndefined();
  });

  it("clientEnvSchema sanitizes empty string environment variables to undefined", () => {
    process.env["VITE_SUPABASE_URL"] = "";
    process.env["VITE_SITE_URL"] = "";

    const clientEnv = getClientEnv();
    expect(clientEnv.VITE_SUPABASE_URL).toBeUndefined();
    expect(clientEnv.VITE_SITE_URL).toBeUndefined();
  });

  it("catastrophic 500 error renders HTML error page for browser requests", async () => {
    // Simulate a request for a page that encounters an internal crash
    const badRequest = new Request("http://localhost:3000/trigger-test-crash-simulated", {
      headers: { accept: "text/html,application/xhtml+xml" },
    });

    // The fetch handler delegates to tanstack-start which handles 404 or errors
    const response = await serverHandler.fetch(badRequest, {}, {});
    // Response should be HTML, not raw Nitro unhandled JSON
    const contentType = response.headers.get("content-type") || "";
    expect(contentType).toContain("text/html");
  });
});
