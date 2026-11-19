import { bindings, defineConfig } from "cf/config";

export default defineConfig({
  worker: {
    name: "teranga-dubai-staging",
    entrypoint: "./platform/worker.mjs",
    compatibilityDate: "2026-11-18",
    workersDev: true,
    observability: { enabled: true, redactQueryString: true, logs: { enabled: true, invocationLogs: false }, traces: { enabled: true, headSamplingRate: 0.01 } },
    assets: { notFoundHandling: "none", runWorkerFirst: ["/api/*"] },
    env: {
      ASSETS: bindings.assets(),
      DB: bindings.d1({ id: "397759a4-0f63-4b13-87d1-80ebdbfcf574" }),
      DEPLOYMENT: bindings.text("staging"),
      ADMIN_PASSWORD: bindings.secret(),
    },
  },
});
