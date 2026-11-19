import { test } from "node:test";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { sqlite } from "./sqlite.mjs";
import worker from "./worker.mjs";
import { pages, render } from "./pages.mjs";
import { brand } from "./catalog.mjs";

const base="https://staging.example.test";
const today=()=>new Date().toISOString().slice(0,10);
function setup(){
  const { DB,db }=sqlite();
  const ADMIN_PASSWORD=randomBytes(32).toString("hex");
  const env={DB,ADMIN_PASSWORD,DEPLOYMENT:"staging"};
  let cookie;
  return {
    db,env,
    async upload(content,auth=true){
      const headers={Origin:base,"Content-Type":"image/png"};
      if(auth&&cookie) headers.Cookie=cookie;
      const r=await worker.fetch(new Request(base+"/api/admin/media",{method:"POST",headers,body:content}),env);
      return {status:r.status,data:await r.json()};
    },
    async call(path,payload,{auth=false,origin=base}={}){
      const headers={Origin:origin};
      if(auth && cookie) headers.Cookie=cookie;
      if(payload) headers["Content-Type"]="application/json";
      const r=await worker.fetch(new Request(base+"/api/"+path,{method:payload?"POST":"GET",headers,body:payload&&JSON.stringify(payload)}),env);
      const setCookie=r.headers.get("Set-Cookie");
      if(setCookie) cookie=setCookie.split(";")[0];
      return { status:r.status, data:await r.json(), cookie:setCookie };
    },
    password:ADMIN_PASSWORD,
  };
}
const payload=(override={})=>({service:"hotels",name:"Alex Test",email:"alex@example.test",language:"en",consent:true,key:randomBytes(32).toString("hex"),fields:{arrival:today(),people:"2"},...override});

test("all pages are bilingual, noindex and have official WhatsApp; visa has no document collection",()=>{
  for (const lang of ["fr","en"]) for (const page of pages){
    const html=render(lang,page);
    assert.match(html,new RegExp('<html lang="'+lang+'"'));
    assert.match(html,/noindex,nofollow/);
    assert.ok(html.includes(brand.whatsapp));
    assert.doesNotMatch(html,/971528876133|TERANGA2026/);
  }
  assert.doesNotMatch(render("fr","visa"),/type="file"|passport_number|80.000|48h/);
});
test("request is durable, idempotent and requires the private access key",async()=>{
  const {call,db}=setup();
  const data=payload();
  const created=await call("requests",data);
  assert.equal(created.status,201);
  assert.equal((await call("requests",data)).data.ref,created.data.ref);
  assert.equal((await call("requests",{...data,name:"Different Test"})).status,409);
  const credentials={ref:created.data.ref,key:data.key};
  const tracked=await call("track",credentials);
  assert.equal(tracked.data.item.status,"new");
  assert.equal(tracked.data.history.length,1);
  assert.ok(!JSON.stringify(tracked.data).includes("alex@example.test"));
  assert.equal((await call("track",{...credentials,key:"0".repeat(64)})).status,404);
  assert.notEqual(db.prepare("SELECT access_hash FROM requests").get().access_hash,data.key);
  assert.equal((await call("requests",payload({email:"alex@example.com"}))).status,400);
});
test("admin and quote controls, verification and history",async()=>{
  const {call,password}=setup();
  assert.equal((await call("admin/inbox")).status,401);
  assert.equal((await call("admin/login",{password},{origin:"https://outside.example.test"})).status,403);
  const authResult=await call("admin/login",{password});
  assert.equal(authResult.status,200);
  assert.match(authResult.cookie,/Secure; HttpOnly; SameSite=Strict/);
  const auth={auth:true};
  const partner=(await call("admin/partner",{name:"TEST Operator",verified:false},auth)).data;
  const offer={service:"hotels",partner_id:partner.id,title_fr:"TEST chambre",title_en:"TEST room",description_fr:"Test",description_en:"Test",terms_fr:"Test",terms_en:"Test",location:"TEST Dubai",unit:"night",price_fils:30000,active:true};
  assert.equal((await call("admin/offer",offer,auth)).status,409);
  assert.equal((await call("admin/partner",{id:partner.id,name:"TEST Operator",verified:true},auth)).status,200);
  const published=await call("admin/offer",offer,auth);
  assert.equal(published.status,200);
  assert.equal((await call("offers?service=hotels")).data.offers.length,1);
  const request=payload({offer:published.data.id});
  const {ref}=(await call("requests",request)).data;
  const creds={ref,key:request.key};
  assert.equal((await call("admin/quote",{ref,quote_text:"TEST only",amount_fils:40000,expires_at:today()},auth)).status,409);
  assert.equal((await call("admin/status",{ref,before:"new",after:"review"},auth)).status,200);
  assert.equal((await call("admin/quote",{ref,quote_text:"TEST only",amount_fils:40000,expires_at:today()},auth)).status,200);
  assert.equal((await call("accept",creds)).data.item.status,"accepted");
  assert.equal((await call("accept",creds)).status,409);
  assert.equal((await call("admin/status",{ref,before:"accepted",after:"confirmed"},auth)).status,409);
  assert.equal((await call("admin/status",{ref,before:"accepted",after:"partner_pending"},auth)).status,200);
  assert.equal((await call("admin/status",{ref,before:"partner_pending",after:"confirmed"},auth)).status,400);
  assert.equal((await call("admin/status",{ref,before:"partner_pending",after:"confirmed",confirmation_ref:"TEST-OP-001"},auth)).status,200);
  const tracked=await call("track",creds);
  assert.equal(tracked.data.item.confirmation_ref,"TEST-OP-001");
  assert.deepEqual(tracked.data.history.map(row=>row.details),["new","review","quoted","accepted","partner_pending","confirmed"]);
  assert.equal((await call("admin/logout",{},auth)).status,200);
  assert.equal((await call("admin/inbox",undefined,auth)).status,401);
});
test("invalid date and unexpected offer are rejected; login is rate limited",async()=>{
  const {call}=setup();
  assert.equal((await call("requests",payload({fields:{arrival:"2101-02-29"}}))).status,400);
  assert.equal((await call("requests",payload({offer:"missing"}))).status,409);
  for(let i=0;i<6;i++) assert.equal((await call("admin/login",{password:"wrong"})).status,401);
  assert.equal((await call("admin/login",{password:"wrong"})).status,429);
});

test("unlinked images are private; only a verified active offer exposes its uploaded image",async()=>{
  const {call,upload,env,password}=setup();
  const png=Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl2n0kAAAAASUVORK5CYII=","base64");
  assert.equal((await upload(png,false)).status,401);
  await call("admin/login",{password});
  assert.equal((await upload(Buffer.from("INVALID"))).status,400);
  const uploadResult=await upload(png);
  assert.equal(uploadResult.status,201);
  const {image}=uploadResult.data;
  const fetchImage=()=>worker.fetch(new Request(base+image),env);
  assert.equal((await fetchImage()).status,404);
  const auth={auth:true};
  const {id}= (await call("admin/partner",{name:"TEST only",verified:true},auth)).data;
  const offer={service:"apartments",partner_id:id,title_fr:"TEST",title_en:"TEST",description_fr:"TEST",description_en:"TEST",terms_fr:"TEST",terms_en:"TEST",location:"TEST",unit:"quote",image,active:true};
  const saved=await call("admin/offer",offer,auth);
  assert.equal(saved.status,200);
  const result=await fetchImage();
  assert.equal(result.headers.get("Content-Type"),"image/png");
  assert.deepEqual(Buffer.from(await result.arrayBuffer()),png);
  await call("admin/offer",{...offer,id:saved.data.id,active:false},auth);
  assert.equal((await fetchImage()).status,404);
});
