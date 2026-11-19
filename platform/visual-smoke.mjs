import assert from "node:assert/strict";
import { join } from "node:path";
import { chromium } from "playwright";

const base = process.env.TERANGA_PREVIEW || "https://teranga-dubai-staging.arona-easyoil.workers.dev";
const browser = await chromium.launch({channel:"chrome"});
try {
  const jobs=[
    {lang:"fr", suffix:"", width:390, height:844, isMobile:true},
    {lang:"en", suffix:"/en/", width:1440, height:1000, isMobile:false},
  ];
  for (const {lang,suffix,width,height,isMobile} of jobs) {
    const page=await browser.newPage({viewport:{width,height},isMobile});
    const errors=[];
    page.on("pageerror",error=>errors.push(error.message));
    assert.equal((await page.goto(base+suffix)).status(),200);
    assert.equal(await page.locator("html").getAttribute("lang"),lang);
    assert.equal(await page.locator(".travel-hero img[fetchpriority=high]").count(),1);
    assert.equal(await page.locator(".photo-card img").count(),11);
    assert.equal(await page.locator(".photo-package img").count(),3);
    for (const area of [".travel-search",".home-story",".home-faq"])
      assert.equal(await page.locator(area+" img").count(),1);
    await page.locator("main img").evaluateAll(async list=>{
      for (const photo of list) photo.loading="eager";
      await Promise.all(list.map(photo=>photo.decode()));
    });
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
    assert.equal(new Set(await page.locator("main img").evaluateAll(list=>list.map(photo=>photo.currentSrc))).size,18);
    if (isMobile) {
      await page.getByRole("button",{name:"Menu"}).click();
      assert.equal(await page.locator("#openNav").getAttribute("aria-expanded"),"true");
      await page.keyboard.press("Escape");
      await page.locator("[data-tab=transferts]").click();
      assert.equal(await page.locator("#tripSearch [name=from]").count(),1);
      assert.equal(await page.locator("[data-tab=transferts]").getAttribute("aria-pressed"),"true");
      await page.evaluate(()=>window.scrollTo({top:0,behavior:"instant"}));
    }
    if (process.env.TERANGA_SCREENSHOTS) {
      const kind=isMobile?"mobile":"desktop";
      await page.screenshot({path:join(process.env.TERANGA_SCREENSHOTS,"teranga-"+kind+".png"),fullPage:true});
    }
    const photoPath=lang==="fr"?"/plats":"/en/apartments";
    assert.equal((await page.goto(base+photoPath)).status(),200);
    await page.locator(".service-cover img").evaluate(photo=>photo.decode());
    assert.equal(await page.locator("#requestForm").count(),1);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
    assert.deepEqual(errors,[]);
    await page.close();
  }
  console.log("Visual smoke passed: all 18 homepage photos per locale, FR mobile, EN desktop, service covers and planner tabs.");
} finally { await browser.close(); }
