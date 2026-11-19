import { catalog, choices } from "./catalog.mjs";

const utf8 = new TextEncoder();
const keyPattern = /^[0-9a-f]{64}$/;
const refPattern = /^TD-[0-9A-F]{16}$/;
const random = (n) => Array.from(crypto.getRandomValues(new Uint8Array(n)), n => n.toString(16).padStart(2,"0")).join("");
const digest = async (s) => new Uint8Array(await crypto.subtle.digest("SHA-256", utf8.encode(s)));
const hash = async (s) => Array.from(await digest(s), n => n.toString(16).padStart(2,"0")).join("");
const cookieName = "__Host-teranga-admin";
const sessionAge = 60 * 60 * 4;
const failure = (code, status = 400) => { throw Object.assign(new Error(code), { status }); };
const query = (env, sql, ...args) => env.DB.prepare(sql).bind(...args);

function json(data, status = 200, headers = {}) {
  return Response.json(data, {status, headers:{
    "Cache-Control":"no-store", "X-Content-Type-Options":"nosniff",
    "X-Robots-Tag":"noindex, nofollow", "Referrer-Policy":"no-referrer", ...headers,
  }});
}
async function body(request) {
  if (request.headers.get("content-type")?.split(";")[0] !== "application/json") failure("content_type",415);
  if (Number(request.headers.get("content-length")) > 16384 || !request.body) failure("body_size",413);
  const reader = request.body.getReader();
  const decode = new TextDecoder();
  let size = 0, raw = "";
  for (;;) {
    const {value, done} = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 16384) { await reader.cancel(); failure("body_size",413); }
    raw += decode.decode(value,{stream:true});
  }
  let data;
  try { data = JSON.parse(raw + decode.decode()); } catch { failure("invalid_json"); }
  if (!data || typeof data !== "object" || Array.isArray(data)) failure("invalid_json");
  return data;
}
function text(value, max, required = false) {
  if (value == null && !required) return "";
  if (typeof value !== "string") failure("invalid_field");
  const clean = value.trim();
  if (clean.length > max || (required && !clean)) failure("invalid_field");
  return clean;
}
function date(value) {
  const date = new Date(value);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(+date) || date.toISOString().slice(0,10) !== value) failure("invalid_date");
}
function integer(value, max, min = 0) {
  const n = Number(value);
  if (!Number.isSafeInteger(n) || n < min || n > max) failure("invalid_number");
  return n;
}
const MONEY_MAX = 100_000_000;
const publicOffer = "o.id,o.service,o.title_fr,o.title_en,o.description_fr,o.description_en,o.location,o.capacity,o.bedrooms,o.price_fils,o.unit,o.terms_fr,o.terms_en,o.image,p.name AS operator";
const publicRequest = "ref,service,offer_id,status,amount_fils,quote_text,expires_at,confirmation_ref,created_at,updated_at";
const allowedTransitions = {
  new:["review","cancelled"], review:["cancelled"], quoted:["review","cancelled"],
  accepted:["partner_pending","cancelled"], partner_pending:["confirmed","cancelled"], confirmed:["completed","cancelled"],
};
const mediaPath = /^\/api\/media\/([0-9a-f]{32})$/;
async function upload(request,env) {
  const mime = request.headers.get("content-type");
  const max = 524288;
  if (!["image/jpeg","image/png","image/webp"].includes(mime)) failure("invalid_image");
  if (!request.body || Number(request.headers.get("content-length"))>max) failure("body_size",413);
  const chunks = new Uint8Array(max);
  const reader = request.body.getReader();
  let size = 0;
  for (;;) {
    const {value,done}=await reader.read();
    if(done) break;
    if(size+value.byteLength>max){await reader.cancel();failure("body_size",413);}
    chunks.set(value,size); size+=value.byteLength;
  }
  const valid = mime === "image/jpeg" ? chunks[0]===255 && chunks[1]===216 && chunks[2]===255 && chunks[size-2]===255 && chunks[size-1]===217
    : mime === "image/png" ? [137,80,78,71,13,10,26,10].every((n,i)=>chunks[i]===n)
    : String.fromCharCode(...chunks.slice(0,4))==="RIFF" && String.fromCharCode(...chunks.slice(8,12))==="WEBP";
  if(size<16 || !valid) failure("invalid_image");
  const id = random(16);
  await query(env,"INSERT INTO offer_media(id,mime,content) VALUES (?,?,?)",id,mime,chunks.slice(0,size).buffer).run();
  return json({image:"/api/media/"+id},201);
}
async function viewMedia(env,id,path) {
  const media = await query(env,`SELECT m.mime,m.content FROM offer_media m WHERE m.id=? AND EXISTS
    (SELECT 1 FROM offers o JOIN partners p ON p.id=o.partner_id WHERE o.image=? AND o.active=1 AND p.verified=1)`,id,path).first();
  if(!media) failure("not_found",404);
  return new Response(new Uint8Array(media.content),{headers:{"Content-Type":media.mime,"X-Content-Type-Options":"nosniff",
    "Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow","Content-Security-Policy":"default-src 'none'"}});
}

async function throttle(request, env, key, maximum) {
  const window = Math.floor(Date.now()/900000);
  const ip = request.headers.get("CF-Connecting-IP") || "local";
  const bucket = await hash(key + ":" + (env.RATE_SALT || env.ADMIN_PASSWORD || "preview") + ":" + ip);
  const row = await query(env,`INSERT INTO rate_limits(bucket,window,hits) VALUES (?,?,1)
    ON CONFLICT(bucket) DO UPDATE SET hits=CASE WHEN rate_limits.window=excluded.window
    THEN min(rate_limits.hits+1, ?) ELSE 1 END, window=excluded.window RETURNING hits`,bucket,window,maximum+1).first();
  if (row.hits > maximum) failure("rate_limit",429);
}
async function admin(request, env) {
  const token = request.headers.get("Cookie")?.match(/(?:^|;\s*)__Host-teranga-admin=([0-9a-f]{64})(?:;|$)/)?.[1];
  if (!token) failure("unauthorized",401);
  const tokenHash = await hash(token);
  const session = await query(env, "SELECT 1 AS ok FROM sessions WHERE token_hash=? AND expires>?",tokenHash,Math.floor(Date.now()/1000)).first();
  if (!session) failure("unauthorized",401);
  return tokenHash;
}
async function login(request,env) {
  if (env.DEPLOYMENT !== "staging" || !env.ADMIN_PASSWORD || env.ADMIN_PASSWORD.length < 24) failure("admin_not_configured",503);
  await throttle(request,env,"login",6);
  const supplied = text((await body(request)).password,200,true);
  const [a,b] = await Promise.all([digest(supplied),digest(env.ADMIN_PASSWORD)]);
  const mac = await crypto.subtle.importKey("raw",b,{name:"HMAC",hash:"SHA-256"},false,["sign","verify"]);
  const proof = await crypto.subtle.sign("HMAC",mac,b);
  if (!await crypto.subtle.verify("HMAC",mac,proof,a)) failure("unauthorized",401);
  const token = random(32);
  const now = Math.floor(Date.now()/1000);
  await env.DB.batch([
    query(env,"DELETE FROM sessions WHERE expires<=?",now),
    query(env,"DELETE FROM rate_limits WHERE window<?",Math.floor(now/900)-96),
    query(env,"INSERT INTO sessions VALUES (?,?)",await hash(token),now+sessionAge),
  ]);
  return json({ok:true},200,{"Set-Cookie":cookieName+"="+token+"; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age="+sessionAge});
}

async function submit(request, env) {
  await throttle(request,env,"submit",20);
  const data = await body(request);
  const service = text(data.service,32,true);
  if (!Object.hasOwn(catalog,service) || data.consent !== true || data.website || !keyPattern.test(data.key || "")) failure("invalid_request");
  const name = text(data.name,100,true);
  const email = text(data.email,180,true).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) failure("invalid_email");
  if (env.DEPLOYMENT === "staging" && !email.endsWith(".test")) failure("test_email_only");
  const language = data.language === "en" ? "en" : "fr";
  const values = data.fields;
  if (!values || typeof values !== "object" || Array.isArray(values)) failure("invalid_field");
  const fields = {};
  for (const field of catalog[service][7]) {
    let value = text(values[field],160,field === "arrival" || ["from","to","goods","package","meal"].includes(field));
    if (!value) continue;
    if (field === "arrival" || field === "departure") date(value);
    if (field === "people") value = String(integer(value,100,1));
    if (field === "bags" || field === "bedrooms") value = String(integer(value,100));
    if (field === "budget" || field === "weight") {
      if (!/^\d{1,7}(?:\.\d{1,2})?$/.test(value) || Number(value)<=0) failure("invalid_number");
    }
    if (field === "time" && !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value)) failure("invalid_field");
    if (choices[field] && !choices[field].includes(value)) failure("invalid_field");
    fields[field] = value;
  }
  if (fields.arrival < new Date().toISOString().slice(0,10) || (fields.departure && fields.departure < fields.arrival)) failure("invalid_date");
  const offer = text(data.offer,32) || null;
  const tokenHash = await hash(data.key);
  const payload = JSON.stringify(fields);
  const fingerprint = await hash(JSON.stringify([service,name,email,language,offer,payload]));
  const same = await query(env,"SELECT ref,fingerprint FROM requests WHERE access_hash=?",tokenHash).first();
  if (same) {
    if (same.fingerprint !== fingerprint) failure("idempotency_conflict",409);
    return json({ref:same.ref});
  }
  if (offer && !await query(env,`SELECT o.id FROM offers o JOIN partners p ON p.id=o.partner_id
    WHERE o.id=? AND o.service=? AND o.active=1 AND p.verified=1`,offer,service).first()) failure("offer_unavailable",409);
  const ref = "TD-"+random(8).toUpperCase();
  const saved = await query(env,`INSERT INTO requests(ref,access_hash,fingerprint,service,offer_id,language,name,email,fields)
    VALUES (?,?,?,?,?,?,?,?,?) ON CONFLICT(access_hash) DO NOTHING RETURNING ref`,ref,tokenHash,fingerprint,service,offer,language,name,email,payload).first();
  if (saved) return json(saved,201);
  const replay = await query(env,"SELECT ref,fingerprint FROM requests WHERE access_hash=?",tokenHash).first();
  if (replay?.fingerprint !== fingerprint) failure("idempotency_conflict",409);
  return json({ref:replay.ref});
}
async function client(request,env,accept) {
  const data = await body(request);
  if (!refPattern.test(data.ref || "") || !keyPattern.test(data.key || "")) failure("not_found",404);
  await throttle(request,env,"lookup",80);
  const key = await hash(data.key);
  if (accept) {
    const changed = await query(env,`UPDATE requests SET status='accepted', updated_at=CURRENT_TIMESTAMP
      WHERE ref=? AND access_hash=? AND status='quoted' AND expires_at>=date('now')`,data.ref,key).run();
    if (!changed.meta.changes) failure("quote_unavailable",409);
  }
  const item = await query(env,`SELECT ${publicRequest} FROM requests WHERE ref=? AND access_hash=?`,data.ref,key).first();
  if (!item) failure("not_found",404);
  const history = await query(env,"SELECT details,created_at FROM audit_events WHERE subject=? AND action IN ('request','status') ORDER BY id",data.ref).all();
  return json({item,history:history.results});
}
async function adminAction(request,env,route,url) {
  const session = await admin(request,env);
  if (route === "media" && request.method === "POST") {
    await throttle(request,env,"media",15);
    return await upload(request,env);
  }
  if (route === "logout" && request.method === "POST") {
    await query(env,"DELETE FROM sessions WHERE token_hash=?",session).run();
    return json({ok:true},200,{"Set-Cookie":cookieName+"=; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=0"});
  }
  if (route === "inbox" && request.method === "GET") {
    const offset = integer(url.searchParams.get("offset") || "0",1_000_000);
    const [requests,partners,offers,stats] = await env.DB.batch([
      query(env,`SELECT ${publicRequest},name,email,fields,language FROM requests ORDER BY created_at DESC,ref LIMIT 50 OFFSET ?`,offset),
      query(env,"SELECT id,name,verified FROM partners ORDER BY created_at DESC LIMIT 200"),
      query(env,"SELECT * FROM offers ORDER BY created_at DESC LIMIT 200"),
      query(env,"SELECT status,COUNT(*) AS count FROM requests GROUP BY status"),
    ]);
    return json({requests:requests.results, partners:partners.results, offers:offers.results, stats:stats.results});
  }
  if (request.method !== "POST") failure("not_found",404);
  const data = await body(request);
  if (route === "partner") {
    const id = text(data.id,40) || random(8);
    if (!/^[0-9a-f]{16}$/.test(id)) failure("invalid_field");
    await env.DB.batch([
      query(env,"INSERT INTO partners(id,name,verified) VALUES (?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,verified=excluded.verified",id,text(data.name,120,true),data.verified === true ? 1 : 0),
      query(env,"INSERT INTO audit_events(subject,action) VALUES (?,'partner_saved')",id),
    ]);
    return json({id});
  }
  if (route === "offer") {
    const id = text(data.id,40) || random(8);
    if (!/^[0-9a-f]{16}$/.test(id) || !Object.hasOwn(catalog,data.service)) failure("invalid_field");
    const partner = await query(env,"SELECT id,verified FROM partners WHERE id=?",text(data.partner_id,40,true)).first();
    if (!partner || (data.active === true && !partner.verified)) failure("partner_not_verified",409);
    const image = text(data.image,200);
    if (image && !/^https:\/\/[a-z0-9.-]+\//i.test(image)) {
      const media = image.match(mediaPath)?.[1];
      if (!media || !await query(env,"SELECT id FROM offer_media WHERE id=?",media).first()) failure("invalid_image");
    }
    const unit = text(data.unit,12,true);
    if (!["quote","night","month","trip","order","day"].includes(unit)) failure("invalid_field");
    const amount = unit === "quote" ? null : integer(data.price_fils,MONEY_MAX,1);
    await env.DB.batch([
      query(env,`INSERT INTO offers(id,service,partner_id,title_fr,title_en,description_fr,description_en,location,capacity,bedrooms,price_fils,unit,terms_fr,terms_en,image,active)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET service=excluded.service,partner_id=excluded.partner_id,title_fr=excluded.title_fr,title_en=excluded.title_en,
        description_fr=excluded.description_fr,description_en=excluded.description_en,location=excluded.location,capacity=excluded.capacity,
        bedrooms=excluded.bedrooms,price_fils=excluded.price_fils,unit=excluded.unit,terms_fr=excluded.terms_fr,terms_en=excluded.terms_en,image=excluded.image,active=excluded.active`,
        id,data.service,partner.id,text(data.title_fr,120,true),text(data.title_en,120,true),text(data.description_fr,900,true),text(data.description_en,900,true),
        text(data.location,100,true),data.capacity ? integer(data.capacity,100,1) : null,data.bedrooms === "" || data.bedrooms == null ? null : integer(data.bedrooms,100),
        amount,unit,text(data.terms_fr,900,true),text(data.terms_en,900,true),image || null,data.active === true ? 1 : 0),
      query(env,"INSERT INTO audit_events(subject,action) VALUES (?,'offer_saved')",id),
    ]);
    return json({id});
  }
  const {ref} = data;
  if (!refPattern.test(ref || "")) failure("invalid_field");
  if (route === "quote") {
    const expires = text(data.expires_at,10,true);
    date(expires);
    if (expires < new Date().toISOString().slice(0,10)) failure("invalid_date");
    const changed = await query(env,`UPDATE requests SET status='quoted',amount_fils=?,quote_text=?,expires_at=?,updated_at=CURRENT_TIMESTAMP
      WHERE ref=? AND status='review'`,integer(data.amount_fils,MONEY_MAX,1),text(data.quote_text,1800,true),expires,ref).run();
    if (!changed.meta.changes) failure("invalid_transition",409);
    return json({ok:true});
  }
  if (route === "status") {
    const before = text(data.before,32,true);
    const after = text(data.after,32,true);
    if (!Object.hasOwn(allowedTransitions,before) || !allowedTransitions[before].includes(after)) failure("invalid_transition",409);
    const confirmation = after === "confirmed" ? text(data.confirmation_ref,100,true) : null;
    const changed = await query(env,`UPDATE requests SET status=?,confirmation_ref=coalesce(?,confirmation_ref),updated_at=CURRENT_TIMESTAMP
      WHERE ref=? AND status=?`,after,confirmation,ref,before).run();
    if (!changed.meta.changes) failure("invalid_transition",409);
    return json({ok:true});
  }
  failure("not_found",404);
}

export default {
  async fetch(request,env) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith("/api/")) return env.ASSETS ? env.ASSETS.fetch(request) : new Response("Not found",{status:404});
    try {
      if (env.DEPLOYMENT !== "staging" || !env.DB) failure("not_configured",503);
      if (request.method !== "GET" && request.headers.get("Origin") !== url.origin) failure("origin_rejected",403);
      const media = url.pathname.match(mediaPath);
      if (media && request.method === "GET") return await viewMedia(env,media[1],url.pathname);
      if (url.pathname === "/api/offers" && request.method === "GET") {
        const service = url.searchParams.get("service");
        if (service && !Object.hasOwn(catalog,service)) failure("invalid_field");
        const listings = await query(env,`SELECT ${publicOffer} FROM offers o JOIN partners p ON p.id=o.partner_id
          WHERE o.active=1 AND p.verified=1 AND (? IS NULL OR o.service=?) ORDER BY o.created_at DESC,o.id LIMIT 100`,service,service).all();
        return json({offers:listings.results});
      }
      if (request.method === "POST") {
        if (url.pathname === "/api/requests") return await submit(request,env);
        if (url.pathname === "/api/track") return await client(request,env,false);
        if (url.pathname === "/api/accept") return await client(request,env,true);
        if (url.pathname === "/api/admin/login") return await login(request,env);
      }
      if (url.pathname.startsWith("/api/admin/")) return await adminAction(request,env,url.pathname.slice(11),url);
      failure("not_found",404);
    } catch (error) {
      if (!error.status) console.error(JSON.stringify({event:"teranga_api_failure",method:request.method}));
      return json({error:error.status ? error.message : "internal_error"},error.status || 500);
    }
  },
};
