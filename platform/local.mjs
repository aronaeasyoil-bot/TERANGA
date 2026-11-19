import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, sep, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { Readable } from "node:stream";
import { randomBytes } from "node:crypto";
import { sqlite } from "./sqlite.mjs";
import worker from "./worker.mjs";

const port=Number(process.env.PORT || 4391);
const base="http://localhost:"+port;
const root=fileURLToPath(new URL("../dist/",import.meta.url));
const { DB }=sqlite();
const ADMIN_PASSWORD=process.env.ADMIN_PASSWORD || randomBytes(24).toString("hex");
const mime={".html":"text/html;charset=utf-8",".mjs":"text/javascript;charset=utf-8",".css":"text/css;charset=utf-8",
  ".jpeg":"image/jpeg",".jpg":"image/jpeg",".webp":"image/webp",".svg":"image/svg+xml",".xml":"application/xml",".txt":"text/plain"};
const policy="default-src 'self'; img-src 'self' https:; media-src 'self'; frame-ancestors 'none'; form-action 'self'";
const assets={async fetch(request){
  let pathname=decodeURIComponent(new URL(request.url).pathname);
  if(pathname.endsWith("/")) pathname+="index.html";
  else if(!extname(pathname)) pathname+=".html";
  const path=resolve(root,"."+pathname);
  if(!path.startsWith(resolve(root)+sep) || !mime[extname(path)] || !await stat(path).then(s=>s.isFile(),()=>false))
    return new Response("Not found",{status:404});
  return new Response(await readFile(path),{headers:{"Content-Type":mime[extname(path)],"X-Robots-Tag":"noindex, nofollow","Content-Security-Policy":policy}});
}};
createServer(async(req,res)=>{
  try {
    const url=new URL(req.url,base);
    const body=req.method==="GET"||req.method==="HEAD"?undefined:Readable.toWeb(req);
    const request=new Request(url,{headers:req.headers,method:req.method,body,duplex:"half"});
    const response=await worker.fetch(request,{DB,ASSETS:assets,DEPLOYMENT:"staging",ADMIN_PASSWORD});
    res.writeHead(response.status,Object.fromEntries(response.headers));
    if(response.body && req.method!=="HEAD") Readable.fromWeb(response.body).pipe(res);
    else res.end();
  } catch { res.writeHead(500); res.end(); }
}).listen(port,"127.0.0.1",()=>console.log("Local staging: "+base+" | Set ADMIN_PASSWORD in the environment to test the admin."));
