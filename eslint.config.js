import js from "@eslint/js";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "dist",
      "build",
      ".output",
      ".vinxi",
      ".vercel",
      "playwright-report",
      "test-results",
      "coverage",
      "routeTree.gen.ts",
      "src/routeTree.gen.ts",
      "package-lock.json",
    ],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "server-only",
              message:
                "TanStack Start does not use the Next.js `server-only` package. Rename the module to `*.server.ts` or mark it with `@tanstack/react-start/server-only`.",
            },
          ],
        },
      ],
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  {
    files: ["src/client/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/server/services/**",
                "@/server/services",
                "@/server/db/**",
                "@/server/db",
                "@/server/config/**",
                "@/server/config",
                "**/server/services/**",
                "**/server/services",
                "**/server/db/**",
                "**/server/db",
                "**/server/config/**",
                "**/server/config",
              ],
              message:
                "Client code must never import directly from server services, database, or config. Import RPC wrappers from '@/server/functions/*' instead.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/shared/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/client/**",
                "@/client",
                "**/client/**",
                "**/client",
                "@/server/**",
                "@/server",
                "**/server/**",
                "**/server",
              ],
              message:
                "Shared modules must be pure and cannot import from client or server directories.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/client/components/ui/**/*.{ts,tsx}", "src/client/lib/auth-context.tsx"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
  eslintPluginPrettier,
);
