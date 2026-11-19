import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const base="https://teranga-dubai-staging.arona-easyoil.workers.dev";
const headers={Origin:base};
const date=new Date(Date.now()+86400000).toISOString().slice(0,10);
const password=process.env.ADMIN_PASSWORD || (await readFile(join(process.env.LOCALAPPDATA,"TERANGA-DUBAI","staging.env"),"utf8")).match(/^ADMIN_PASSWORD=([^\r\n]+)/m)?.[1];
assert.ok(password,"Staging credential not configured");
const browser=await chromium.launch({channel:"chrome"});
try {
  const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await mobile.newPage();
  const errors=[];
  page.on("pageerror",error=>errors.push(error.name));
  const first=await page.goto(base,{waitUntil:"domcontentloaded"});
  assert.equal(first.status(),200);
  assert.match(first.headers()["x-robots-tag"],/noindex/);
  await page.locator('button[data-tab="transferts"]').click();
  await page.locator("#tripSearch [name=from]").fill("TEST DXB");
  await page.locator("#tripSearch [name=to]").fill("TEST arrivée");
  await page.locator("#tripSearch [name=arrival]").fill(date);
  if(process.env.TERANGA_SCREENSHOT) await page.screenshot({path:process.env.TERANGA_SCREENSHOT,fullPage:true});
  await page.locator("#tripSearch button.travel-btn").click();
  await page.waitForURL("**/transferts#demande");
  assert.equal(await page.locator("#requestForm [name=from]").inputValue(),"TEST DXB");
  await page.locator("#requestForm [name=name]").fill("TEST Voyageur");
  await page.locator("#requestForm [name=email]").fill("test-voyageur@example.test");
  await page.locator("#requestForm [name=consent]").check();
  await page.locator("#requestForm button[type=submit]").click();
  await page.locator("#receipt:not([hidden])").waitFor();
  const privateKey=await page.locator("#receipt code").textContent();
  const ref=(await page.locator("#receipt").innerText()).match(/TD-[0-9A-F]{16}/)?.[0];
  assert.ok(ref);
  assert.match(privateKey,/^[0-9a-f]{64}$/);
  await page.locator('#receipt a[href="/dossier"]').click();
  await page.waitForURL("**/dossier");
  assert.equal(await page.locator("#trackForm [name=ref]").inputValue(),ref);
  assert.equal((await mobile.request.get(base+"/api/admin/inbox")).status(),401);
  assert.equal((await mobile.request.post(base+"/api/track",{headers,data:{ref,key:"0".repeat(64)}})).status(),404);
  const team=await browser.newContext();
  const adminPage=await team.newPage();
  await adminPage.goto(base+"/admin");
  await adminPage.locator("#adminLogin [name=password]").fill(password);
  await adminPage.locator("#adminLogin button").click();
  const caseCard=adminPage.locator(".admin-table article").filter({hasText:ref});
  await caseCard.getByRole("button",{name:"Enregistrer le statut"}).click();
  await caseCard.locator('[name=amount]').fill("125.50");
  await caseCard.locator('[name=expires_at]').fill(date);
  await caseCard.locator('[name=quote_text]').fill("TEST UNIQUEMENT — aucun transfert ni paiement réel.");
  const [quote]=await Promise.all([
    adminPage.waitForResponse(response=>new URL(response.url()).pathname==="/api/admin/quote"),
    caseCard.getByRole("button",{name:"Rendre le devis visible au client"}).click(),
  ]);
  assert.equal(quote.status(),200);
  await page.locator("#trackForm button").click();
  const accept=page.getByRole("button",{name:"Accepter le devis de test"});
  await accept.click();
  await page.getByText("Devis accepté",{exact:true}).waitFor();
  const replay=await mobile.request.post(base+"/api/accept",{headers,data:{ref,key:privateKey}});
  assert.equal(replay.status(),409);
  const posted=async (path,data)=>team.request.post(base+"/api/admin/"+path,{headers,data});
  assert.equal((await posted("status",{ref,before:"accepted",after:"partner_pending"})).status(),200);
  assert.equal((await posted("status",{ref,before:"partner_pending",after:"confirmed"})).status(),400);
  assert.equal((await posted("status",{ref,before:"partner_pending",after:"confirmed",confirmation_ref:"TEST-NON-COMMERCIAL"})).status(),200);
  await page.locator("#trackForm button").click();
  await page.locator("#trackResult").getByText("Réservation confirmée",{exact:true}).waitFor();
  const partner=await posted("partner",{name:"TEST ONLY / NE PAS UTILISER",verified:true});
  assert.equal(partner.status(),200);
  const media=await team.request.post(base+"/api/admin/media",{
    headers:{...headers,"Content-Type":"image/png"},
    data:Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl2n0kAAAAASUVORK5CYII=","base64"),
  });
  assert.equal(media.status(),201);
  const {image}=await media.json();
  assert.equal((await mobile.request.get(base+image)).status(),404);
  const offer={service:"apartments",partner_id:(await partner.json()).id,title_fr:"TEST offre",title_en:"TEST offer",
    description_fr:"TEST",description_en:"TEST",location:"TEST",terms_fr:"TEST",terms_en:"TEST",unit:"quote",image};
  const published=await posted("offer",{...offer,active:true});
  assert.equal(published.status(),200);
  const {id}=await published.json();
  try {
    const photo=await mobile.request.get(base+image);
    assert.equal(photo.status(),200);
    assert.equal(photo.headers()["content-type"],"image/png");
  } finally { assert.equal((await posted("offer",{...offer,id,active:false})).status(),200); }
  assert.equal((await mobile.request.get(base+image)).status(),404);
  const en=await mobile.newPage();
  await en.goto(base+"/en/visa");
  assert.match(await en.locator("h1").innerText(),/Visa assistance/);
  assert.equal(await en.locator('input[type="file"]').count(),0);
  assert.match(await en.locator(".wa-float").getAttribute("href"),/^https:\/\/wa.me\/971507640753\?/);
  assert.equal(await en.evaluate(()=>document.documentElement.scrollWidth),390);
  const legacy=await mobile.request.get(base+"/teranga-store.js");
  assert.equal(legacy.status(),404);
  assert.deepEqual(errors,[]);
  console.log("Staging OK: mobile form, durable reference, private lookup, admin login, AED quote, acceptance, replay rejection, photo visibility, English and WhatsApp.");
} finally { await browser.close(); }
