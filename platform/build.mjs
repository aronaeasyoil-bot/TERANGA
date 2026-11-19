import { copyFile, mkdir, rm, writeFile } from "node:fs/promises";
import { pages, render } from "./pages.mjs";

const root = new URL("../", import.meta.url);
const out = new URL("dist/", root);
const files = ["styles.css","platform/travel.css","platform/ui.mjs","platform/catalog.mjs",
  "assets/logo-teranga-dubai.jpg","assets/teranga-icon.svg","assets/dubai-panorama.webp"];
await rm(out,{recursive:true,force:true});
for (const dir of ["assets/","platform/","en/"]) await mkdir(new URL(dir,out),{recursive:true});
await Promise.all(files.map(file=>copyFile(new URL(file,root),new URL(file,out))));
const sitemap = [];
for (const lang of ["fr","en"]) {
  for (const page of pages) {
    const prefix = lang === "en" ? "en/" : "";
    await writeFile(new URL(prefix+(page||"index")+".html",out),render(lang,page));
    if (!["admin","dossier"].includes(page)) sitemap.push("https://teranga-dubai-staging.arona-easyoil.workers.dev/"+prefix+page);
  }
}
await writeFile(new URL("sitemap.xml",out),'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+sitemap.map(path=>"<url><loc>"+path+"</loc></url>").join("")+"</urlset>");
await writeFile(new URL("robots.txt",out),"User-agent: *\nDisallow: /\n");
await writeFile(new URL("_headers",out),`/*
  X-Robots-Tag: noindex, nofollow
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
  X-Frame-Options: DENY
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; img-src 'self' https:; style-src 'self'; media-src 'self'; script-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'
/platform/*.mjs
  Content-Type: text/javascript; charset=utf-8
`);
console.log("Built bilingual staging pages (legacy demo scripts are not published).");
