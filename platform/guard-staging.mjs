import { readFileSync } from "node:fs";

const location = new URL("../.cloudflare/output/v1/workers/default/worker.config.json", import.meta.url);
const worker = JSON.parse(readFileSync(location,"utf8"));
if (worker.name !== "teranga-dubai-staging" || !JSON.stringify(worker).includes("397759a4-0f63-4b13-87d1-80ebdbfcf574")) {
  throw new Error("Refusing deploy: only the TERANGA test Worker with its staging database may be deployed.");
}
