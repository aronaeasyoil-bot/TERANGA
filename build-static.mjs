import { copyFile, mkdir, rm } from "node:fs/promises";

const files = [
  "index.html",
  "admin.html",
  "visa.html",
  "billets.html",
  "plats.html",
  "styles.css",
  "admin.js",
  "script.js",
  "service-pages.js",
  "teranga-store.js",
  "assets/logo-teranga.jpeg",
  "assets/hero-teranga.mp4",
];

const output = new URL("./dist/", import.meta.url);
await rm(output, { recursive: true, force: true });
await mkdir(new URL("assets/", output), { recursive: true });
await Promise.all(files.map((path) =>
  copyFile(new URL(path, import.meta.url), new URL(path, output))
));
console.log(`Prepared ${files.length} public assets in dist/`);
