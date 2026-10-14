import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nitroPreset =
  process.env["NITRO_PRESET"] ||
  (process.env["VERCEL"] ? "vercel" : process.env["NETLIFY"] ? "netlify" : undefined);

export default defineConfig(({ command }) => ({
  plugins: [
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      server: { entry: "server" },
    }),
    ...(command === "build"
      ? [
          nitro({
            ...(nitroPreset ? { preset: nitroPreset } : {}),
          }),
        ]
      : []),
    viteReact(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  envPrefix: ["VITE_"],
}));
