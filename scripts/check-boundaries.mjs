#!/usr/bin/env node

/**
 * Architecture Boundary & Secret Leak Checker
 *
 * Enforces strict architectural separation:
 * 1. src/client/ cannot import from src/server/ (except RPC wrappers in src/server/functions/*)
 * 2. src/client/ cannot reference server-only environment variables or secrets
 * 3. src/shared/ cannot import from src/client/ or src/server/
 * 4. No server-only secrets may use public prefixes (e.g. VITE_ or NEXT_PUBLIC_)
 * 5. Built client assets (.output/public/) must not contain sensitive strings or secret keys
 */

import fs from "node:fs";
import path from "node:path";

const ROOT_DIR = process.cwd();
const CLIENT_DIR = path.resolve(ROOT_DIR, "src/client");
const SHARED_DIR = path.resolve(ROOT_DIR, "src/shared");
const SERVER_DIR = path.resolve(ROOT_DIR, "src/server");
const CLIENT_ASSETS_DIR = path.resolve(ROOT_DIR, ".output/public");

// Server-only environment variables and secret tokens that must NEVER appear in client code
const SERVER_ONLY_ENV_VARS = [
  "GEMINI_API_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_SERVICE_KEY",
  "CRON_SECRET",
  "DEMO_PAY_SECRET",
  "RAZORPAY_KEY_SECRET",
  "RAZORPAY_KEY_ID",
  "NITRO_PRESET",
];

// Patterns representing server secrets with public prefixes that must never exist
const FORBIDDEN_PUBLIC_PREFIX_PATTERNS = [
  /VITE_GEMINI/i,
  /VITE_.*SERVICE_ROLE/i,
  /VITE_.*SECRET/i,
  /VITE_RAZORPAY_KEY_SECRET/i,
  /NEXT_PUBLIC_/i,
];

let violationCount = 0;

function reportViolation(category, message, file = null, line = null) {
  violationCount++;
  const location = file ? ` (${path.relative(ROOT_DIR, file)}${line ? `:${line}` : ""})` : "";
  console.error(`❌ [${category}] ${message}${location}`);
}

function getAllFiles(dirPath, extensions = [".ts", ".tsx", ".js", ".jsx", ".mjs"]) {
  if (!fs.existsSync(dirPath)) return [];
  const results = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllFiles(fullPath, extensions));
    } else if (extensions.includes(path.extname(entry.name).toLowerCase())) {
      results.push(fullPath);
    }
  }
  return results;
}

// 1. Check Client Boundary
function checkClientBoundaries() {
  console.log("🔍 Checking src/client/ boundaries...");
  const clientFiles = getAllFiles(CLIENT_DIR);

  for (const file of clientFiles) {
    const lines = fs.readFileSync(file, "utf-8").split("\n");

    lines.forEach((lineText, idx) => {
      const lineNum = idx + 1;

      // Match import/export statements
      const importMatch = lineText.match(/(?:import|export)\s+(?:.*?from\s+)?['"]([^'"]+)['"]/);
      const dynamicImportMatch = lineText.match(/import\s*\(\s*['"]([^'"]+)['"]\s*\)/);
      const importPath = importMatch?.[1] || dynamicImportMatch?.[1];

      if (importPath) {
        // Check if import reaches into server
        const isServerImport =
          importPath.startsWith("@/server") ||
          importPath.includes("/server/") ||
          importPath.startsWith("../server");

        if (isServerImport) {
          // Only imports to @/server/functions/* (or relative equivalents) are permitted RPC wrappers
          const isAllowedFunctionRpc =
            importPath.startsWith("@/server/functions/") ||
            importPath.includes("/server/functions/");

          if (!isAllowedFunctionRpc) {
            reportViolation(
              "CLIENT_IMPORT_VIOLATION",
              `Client module is not permitted to import server implementation "${importPath}". Client may only call RPC wrappers in "@/server/functions/*".`,
              file,
              lineNum,
            );
          }
        }
      }

      // Check for forbidden server-only env references in client code
      for (const secretVar of SERVER_ONLY_ENV_VARS) {
        if (lineText.includes(secretVar)) {
          reportViolation(
            "CLIENT_SECRET_REFERENCE",
            `Client module contains reference to server-only secret "${secretVar}".`,
            file,
            lineNum,
          );
        }
      }
    });
  }
}

// 2. Check Shared Boundary
function checkSharedBoundaries() {
  console.log("🔍 Checking src/shared/ purity...");
  const sharedFiles = getAllFiles(SHARED_DIR);

  for (const file of sharedFiles) {
    const lines = fs.readFileSync(file, "utf-8").split("\n");

    lines.forEach((lineText, idx) => {
      const lineNum = idx + 1;

      // Shared must not import from client or server
      const importMatch = lineText.match(/(?:import|export)\s+(?:.*?from\s+)?['"]([^'"]+)['"]/);
      const dynamicImportMatch = lineText.match(/import\s*\(\s*['"]([^'"]+)['"]\s*\)/);
      const importPath = importMatch?.[1] || dynamicImportMatch?.[1];

      if (importPath) {
        if (
          importPath.startsWith("@/client") ||
          importPath.includes("/client/") ||
          importPath.startsWith("../client")
        ) {
          reportViolation(
            "SHARED_PURITY_VIOLATION",
            `Shared module must not import client code "${importPath}".`,
            file,
            lineNum,
          );
        }

        if (
          importPath.startsWith("@/server") ||
          importPath.includes("/server/") ||
          importPath.startsWith("../server")
        ) {
          reportViolation(
            "SHARED_PURITY_VIOLATION",
            `Shared module must not import server code "${importPath}".`,
            file,
            lineNum,
          );
        }
      }

      // Shared must not use process.env or import.meta.env
      if (lineText.includes("process.env") || lineText.includes("import.meta.env")) {
        reportViolation(
          "SHARED_PURITY_VIOLATION",
          "Shared modules must be pure and environment-agnostic; referencing environment variables is forbidden.",
          file,
          lineNum,
        );
      }
    });
  }
}

// 3. Check for Public Prefix Hygiene
function checkPublicPrefixHygiene() {
  console.log("🔍 Checking public environment prefix hygiene...");
  const srcFiles = getAllFiles(path.resolve(ROOT_DIR, "src"), [
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".json",
  ]);

  for (const file of srcFiles) {
    const content = fs.readFileSync(file, "utf-8");
    for (const pattern of FORBIDDEN_PUBLIC_PREFIX_PATTERNS) {
      if (pattern.test(content)) {
        reportViolation(
          "PUBLIC_PREFIX_VIOLATION",
          `Detected forbidden public prefix pattern "${pattern}" in source code. Secrets must never use VITE_ or NEXT_PUBLIC_.`,
          file,
        );
      }
    }
  }
}

// 4. Check Built Client Bundle (if present)
function checkClientBundleSecrets() {
  if (!fs.existsSync(CLIENT_ASSETS_DIR)) {
    console.log(
      "ℹ️  Client bundle .output/public not found (skipping bundle artifact scan; run after 'npm run build')",
    );
    return;
  }

  console.log("🔍 Scanning built client bundle assets (.output/public)...");
  const assetFiles = getAllFiles(CLIENT_ASSETS_DIR, [".js", ".mjs", ".html", ".css", ".json"]);

  const bundleForbiddenTokens = [
    { name: "Service Role Key Marker", regex: /service_role/i },
    { name: "CRON_SECRET Token", regex: /CRON_SECRET/ },
    { name: "GEMINI_API_KEY Token", regex: /GEMINI_API_KEY/ },
    { name: "Private RSA/EC Key", regex: /-----BEGIN (RSA |EC )?PRIVATE KEY-----/ },
  ];

  for (const file of assetFiles) {
    const content = fs.readFileSync(file, "utf-8");
    for (const { name, regex } of bundleForbiddenTokens) {
      if (regex.test(content)) {
        reportViolation(
          "BUNDLE_SECRET_LEAK",
          `Client asset leaks forbidden pattern "${name}".`,
          file,
        );
      }
    }
  }
}

function run() {
  console.log("🛡️  Starting Architecture Boundary & Secret Leak Check...\n");

  checkClientBoundaries();
  checkSharedBoundaries();
  checkPublicPrefixHygiene();
  checkClientBundleSecrets();

  console.log("");
  if (violationCount > 0) {
    console.error(
      `💥 Failed with ${violationCount} architecture boundary or secret violation(s).\n`,
    );
    process.exit(1);
  } else {
    console.log("✅ All architecture boundaries and secret hygiene checks passed!\n");
    process.exit(0);
  }
}

run();
