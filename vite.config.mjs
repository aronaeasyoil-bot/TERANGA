import { resolve } from "node:path";
import { defineConfig } from "vite";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  publicDir: resolve("dist"),
  build: { rolldownOptions: { input: resolve("platform/vite-client-entry.mjs") } },
  plugins: [cloudflare()],
});
