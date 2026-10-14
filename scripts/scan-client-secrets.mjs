#!/usr/bin/env node

/**
 * Client Bundle Secret Scanner
 * Scans built client-side assets in .output/public/ to verify that no sensitive
 * environment secrets (CRON_SECRET, GEMINI_API_KEY, SUPABASE_SERVICE_ROLE_KEY, etc.)
 * were accidentally leaked into the client bundle.
 */

import fs from "node:fs";
import path from "node:path";

const CLIENT_ASSETS_DIR = path.resolve(process.cwd(), ".output/public");

// Forbidden secret names or markers that should NEVER appear in client bundles
const FORBIDDEN_PATTERNS = [
  { name: "Service Role Key Marker", regex: /service_role/i },
  { name: "CRON_SECRET name", regex: /CRON_SECRET/ },
  { name: "GEMINI_API_KEY name", regex: /GEMINI_API_KEY/ },
  { name: "Private RSA/EC Key", regex: /-----BEGIN (RSA |EC )?PRIVATE KEY-----/ },
  { name: "AWS Secret Access Key", regex: /aws_secret_access_key/i },
];

// If env vars are set, verify that the actual secret values are not in the client bundle
const SENSITIVE_ENV_VARS = [
  "CRON_SECRET",
  "GEMINI_API_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_SERVICE_KEY",
];

for (const envVar of SENSITIVE_ENV_VARS) {
  const val = process.env[envVar];
  if (val && val.length >= 8 && !val.includes("placeholder")) {
    FORBIDDEN_PATTERNS.push({
      name: `Actual secret value of ${envVar}`,
      regex: new RegExp(val.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    });
  }
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;

  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  }
  return arrayOfFiles;
}

function runScan() {
  console.log("🔍 Scanning client bundle for accidental secret leaks...");

  if (!fs.existsSync(CLIENT_ASSETS_DIR)) {
    console.warn(
      `⚠️ Directory ${CLIENT_ASSETS_DIR} not found. Ensure "npm run build" has run before scanning.`,
    );
    process.exit(0);
  }

  const files = getAllFiles(CLIENT_ASSETS_DIR).filter((f) =>
    /\.(js|mjs|cjs|html|css|json|map)$/i.test(f),
  );

  console.log(`📦 Found ${files.length} client assets to inspect in .output/public.`);

  let violationsFound = 0;

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, "utf-8");
    const relativePath = path.relative(process.cwd(), filePath);

    for (const { name, regex } of FORBIDDEN_PATTERNS) {
      if (regex.test(content)) {
        console.error(
          `❌ [SECURITY VIOLATION] Detected pattern "${name}" in client asset: ${relativePath}`,
        );
        violationsFound++;
      }
    }
  }

  if (violationsFound > 0) {
    console.error(`\n❌ Secret scan failed with ${violationsFound} violation(s).`);
    process.exit(1);
  } else {
    console.log("✅ Secret scan passed: Zero secrets detected in client bundle.\n");
    process.exit(0);
  }
}

runScan();
