import { catalog, labels, choices, statuses, tr, whatsapp } from "./catalog.mjs";
const lang = document.documentElement.lang;
const t = (fr,en)=>tr(lang,fr,en);
const $ = (selector,root=document)=>root.querySelector(selector);
const href = (page)=> (lang==="en"?"/en/":"/")+page;
const serviceName = key=>catalog[key]?.[lang==="en"?2:1] || key;
const statusName = key=>statuses[key]?.[lang==="en"?1:0] || key;
const money = n=>new Intl.NumberFormat(lang,{style:"currency",currency:"AED"}).format(n/100);
const utcDay = ()=>new Date().toISOString().slice(0,10);
function add(parent,tag,value,attrs={}) {
  const node = document.createElement(tag);
  if (value !== null) node.textContent=value;
  for (const [name,val] of Object.entries(attrs)) node.setAttribute(name,val);
  parent.append(node);
  return node;
}
const newKey = ()=>Array.from(crypto.getRandomValues(new Uint8Array(32)),n=>n.toString(16).padStart(2,"0")).join("");
const vals = form=>Object.fromEntries(new FormData(form));
const msgs = {
  invalid_date: t("Vérifiez l’ordre des dates et choisissez une date à venir.","Check the order of your dates and choose a future date."),
  invalid_field: t("Vérifiez les champs obligatoires et leur format.","Check the required fields and formats."),
  invalid_email: t("L’adresse email est invalide.","The email address is invalid."),
  test_email_only: t("Utilisez une adresse fictive en .test.","Use a fictional .test address."),
  offer_unavailable: t("Cette offre n’est plus publiée. Rechargez la page.","This offer is no longer listed. Reload the page."),
  unauthorized: t("Accès refusé.","Access denied."),
  not_found: t("Dossier introuvable. Vérifiez la référence et la clé.","Request not found. Check the reference and key."),
  rate_limit: t("Trop de tentatives. Réessayez dans quelques minutes.","Too many attempts. Try again in a few minutes."),
  quote_unavailable: t("Ce devis n’est plus disponible à l’acceptation.","This quote is no longer available to accept."),
  invalid_transition: t("Le dossier a changé. Rechargez l’administration.","The request changed. Reload the dashboard."),
  partner_not_verified: t("Activez uniquement les offres d’un partenaire vérifié.","Only publish offers from a verified partner."),
  admin_not_configured: t("L’accès équipe n’est pas configuré.","Team access has not been configured."),
  invalid_image: t("Sélectionnez une photo JPEG, WebP ou PNG valide.","Select a valid JPEG, WebP or PNG photo."),
  body_size: t("Le fichier est trop volumineux (512 Ko maximum).","The file is too large (512 KB maximum)."),
};
const message = err=>msgs[err.message] || t("Action non enregistrée. Vérifiez la saisie ou réessayez.","Action not saved. Check your entry or try again.");
async function api(path,data) {
  const response = await fetch("/api/"+path, data === undefined ? {} : {
    method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error);
  return result;
}
function formAction(form,output,action) {
  form.addEventListener("submit",async event=>{
    event.preventDefault();
    if (form.dataset.busy) return;
    form.dataset.busy="1";
    const button = event.submitter || $("button[type=submit],button:not([type])",form);
    if (button) button.disabled=true;
    if (output) output.textContent="";
    try { await action(vals(form)); }
    catch (error) { if (output) output.textContent=message(error); }
    finally { delete form.dataset.busy; if (button) button.disabled=false; }
  });
}

const menu = $("#openNav");
const nav = $("#siteNav");
document.body.classList.add("js-nav");
const setMenu = open=>{nav.classList.toggle("is-open",open); menu.setAttribute("aria-expanded",String(open));};
menu.addEventListener("click",()=>setMenu(!nav.classList.contains("is-open")));
document.addEventListener("keydown",e=>{ if(e.key==="Escape"&&nav.classList.contains("is-open")){setMenu(false);menu.focus();} });
const syncDates = (form)=>{
  if (!form) return;
  const a = form.elements.namedItem("arrival");
  const b = form.elements.namedItem("departure");
  if (a) a.min=utcDay();
  if (b) b.min=a?.value || utcDay();
};
const quick = $("#tripSearch");
if (quick) {
  const templates = $("#tab-fields").content;
  const buttons = [...document.querySelectorAll("[data-tab]")];
  let service="hotels";
  const select = key=>{
    service=key;
    quick.querySelectorAll("label").forEach(v=>v.remove());
    const node=templates.querySelector('[data-fields="'+key+'"]').cloneNode(true);
    quick.prepend(...node.children);
    syncDates(quick);
    for(const b of buttons) b.setAttribute("aria-pressed",String(b.dataset.tab===key));
  };
  buttons.forEach(b=>b.addEventListener("click",()=>select(b.dataset.tab)));
  select(service);
  quick.addEventListener("change",()=>syncDates(quick));
  quick.addEventListener("submit",event=>{
    event.preventDefault();
    try { sessionStorage.setItem("teranga.staging.draft",JSON.stringify({service,fields:vals(quick)})); } catch {}
    location.href=href(service)+"#demande";
  });
}
const form = $("#requestForm");
if(form) {
  const service=form.dataset.service;
  const params=new URLSearchParams(location.search);
  const serviceFields=catalog[service][7];
  try {
    const draft=JSON.parse(sessionStorage.getItem("teranga.staging.draft") || "{}");
    if (draft.service===service) for(const key of serviceFields) {
      if (typeof draft.fields?.[key]==="string") form.elements.namedItem(key).value=draft.fields[key];
    }
    sessionStorage.removeItem("teranga.staging.draft");
  } catch {}
  for(const key of serviceFields){
    if(params.has(key)) form.elements.namedItem(key).value=service==="forfaits"&&key==="package"
      ? choices.package[Number(params.get(key))] || params.get(key) : params.get(key);
  }
  syncDates(form);
  form.addEventListener("change",()=>syncDates(form));
  let offer="", draftKey="", previousDraft="";
  const selected=$("#selectedOffer");
  const selectOffer = row=>{
    offer=row.id; selected.hidden=false;
    selected.textContent=t("Offre sélectionnée : ","Selected offer: ")+row["title_"+lang]+" · "+row.id;
    const clear=add(selected,"button",t("Retirer","Remove"),{type:"button",class:"outline-btn"});
    clear.addEventListener("click",()=>{offer="";selected.hidden=true;});
    location.hash="demande";
  };
  const offers=$("#liveOffers");
  api("offers?service="+service).then(({offers:rows})=>{
    offers.replaceChildren();
    if(!rows.length) add(offers,"p",t("Aucune offre vérifiée publiée. L’équipe peut lancer une recherche selon vos critères.","No verified offers have been published. Ask the team to look for options that fit."));
    for(const row of rows){
      const card=add(offers,"article",null,{class:"offer-card"});
      if(row.image) add(card,"img",null,{src:row.image,alt:row["title_"+lang],loading:"lazy",referrerpolicy:"no-referrer"});
      add(card,"h3",row["title_"+lang]);
      add(card,"p",row.location+" · "+row.operator);
      add(card,"p",row["description_"+lang]);
      if(row.capacity) add(card,"p",t("Capacité : ","Capacity: ")+row.capacity+(row.bedrooms!==null?" · "+row.bedrooms+t(" chambre(s)"," bedroom(s)"):""));
      const units={night:t("nuit","night"),month:t("mois","month"),trip:t("trajet","trip"),order:t("commande","order"),day:t("jour","day")};
      add(card,"p",row.price_fils ? money(row.price_fils)+" / "+units[row.unit]+" · "+t("à confirmer","to be confirmed") : t("Sur devis","On request"));
      const details=add(card,"details",null);
      add(details,"summary",t("Conditions et frais","Terms and fees"));
      add(details,"p",row["terms_"+lang]);
      const button=add(card,"button",t("Demander la disponibilité","Check availability"),{type:"button",class:"travel-btn"});
      button.addEventListener("click",()=>selectOffer(row));
      add(card,"a","WhatsApp",{href:whatsapp(lang,row["title_"+lang],row.id),target:"_blank",rel:"noopener noreferrer",class:"outline-btn"});
    }
  }).catch(()=>{offers.textContent=t("Catalogue temporairement indisponible.","Catalogue temporarily unavailable.");});
  formAction(form,$("#requestMessage"),async raw=>{
    const fields=Object.fromEntries(serviceFields.map(key=>[key,raw[key] || ""]));
    const request = {service,offer,name:raw.name,email:raw.email,fields,language:lang,consent:raw.consent==="on",website:raw.website};
    const draft=JSON.stringify(request);
    if(draft!==previousDraft){draftKey=newKey();previousDraft=draft;}
    const key=draftKey;
    const {ref}=await api("requests",{...request,key});
    try { sessionStorage.setItem("teranga.staging.request",JSON.stringify({ref,key})); } catch {}
    const receipt=$("#receipt"); receipt.replaceChildren(); receipt.hidden=false;
    add(receipt,"h3",t("Demande enregistrée","Request received"));
    add(receipt,"p",t("Référence : ","Reference: ")+ref);
    add(receipt,"p",t("Conservez cette clé privée. Elle ne sera pas envoyée dans WhatsApp.","Keep this private key. It will not be sent through WhatsApp."));
    add(receipt,"code",key);
    const actions=add(receipt,"p",null);
    add(actions,"a",t("Ouvrir mon dossier","Open my request"),{href:href("dossier"),class:"outline-btn"});
  });
}

const tracking=$("#trackForm");
if(tracking) {
  const output=$("#trackResult");
  try {
    const saved=JSON.parse(sessionStorage.getItem("teranga.staging.request") || "{}");
    if(saved.ref && saved.key){tracking.elements.ref.value=saved.ref;tracking.elements.key.value=saved.key;}
  } catch {}
  const render=({item,history},creds)=>{
    output.replaceChildren();
    const panel=add(output,"article",null,{class:"panel"});
    add(panel,"h2",item.ref+" · "+serviceName(item.service));
    add(panel,"p",statusName(item.status),{class:"status"});
    if(item.quote_text) {
      add(panel,"p",money(item.amount_fils)+" · "+t("Valable jusqu’au ","Valid until ")+item.expires_at);
      add(panel,"p",item.quote_text);
      if(item.status==="quoted" && item.expires_at>=utcDay()){
        const accept=add(panel,"button",t("Accepter le devis de test","Accept test quote"),{class:"travel-btn",type:"button"});
        const error=add(panel,"p","",{role:"status",class:"message"});
        accept.addEventListener("click",async()=>{
          accept.disabled=true;
          try { render(await api("accept",creds),creds); }
          catch(e){error.textContent=message(e);accept.disabled=false;}
        });
      }
    }
    if(item.confirmation_ref) add(panel,"p",t("Référence opérateur : ","Operator reference: ")+item.confirmation_ref);
    const timeline=add(panel,"ol",null);
    history.forEach(event=>add(timeline,"li",statusName(event.details)+" · "+event.created_at));
    add(panel,"a",t("Parler à l’équipe","Talk to the team"),{href:whatsapp(lang,serviceName(item.service),item.ref),target:"_blank",rel:"noopener noreferrer"});
  };
  formAction(tracking,output,async v=>{
    output.replaceChildren();
    const creds={ref:v.ref.toUpperCase(),key:v.key.trim()};
    render(await api("track",creds),creds);
  });
}

const login=$("#adminLogin");
if(login){
  const dashboard=$("#adminDashboard");
  let offset=0;
  const makeForm=(parent,headline)=>{
    const panel=add(parent,"section",null,{class:"panel"});
    add(panel,"h2",headline);
    return add(panel,"form",null,{class:"admin-form"});
  };
  function field(form,name,label,options={}){
    const wrap=add(form,"label",label);
    const {type="text",list,required=false,value="",...attrs}=options;
    if(type==="checkbox") wrap.classList.add("check-label");
    const input=add(wrap,list?"select":type==="textarea"?"textarea":"input",null,{name,...(list||type==="textarea"?{}:{type}),...attrs});
    if(list) for(const [key,text] of list) add(input,"option",text,{value:key});
    if(type==="checkbox") input.checked=Boolean(value);
    else input.value=value ?? "";
    input.required=required;
    return input;
  }
  function save(form,label,handler) {
    add(form,"button",label,{class:"travel-btn",type:"submit"});
    const feedback=add(form,"p","",{role:"status",class:"admin-message"});
    formAction(form,feedback,async data=>{await handler(data);await refresh();});
  }
  const transitions={new:["review","cancelled"],review:["cancelled"],quoted:["review","cancelled"],accepted:["partner_pending","cancelled"],partner_pending:["confirmed","cancelled"],confirmed:["completed","cancelled"]};
  async function refresh(){
    const data=await api("admin/inbox?offset="+offset);
    dashboard.replaceChildren();dashboard.hidden=false;login.hidden=true;
    const bar=add(dashboard,"div",null,{class:"admin-dashboard-nav"});
    const exit=add(bar,"button",t("Déconnexion","Sign out"),{class:"outline-btn",type:"button"});
    const refreshButton=add(bar,"button",t("Actualiser","Refresh"),{class:"outline-btn",type:"button"});
    const error=add(dashboard,"p","",{class:"admin-message",role:"status"});
    exit.addEventListener("click",async()=>{try{await api("admin/logout",{});dashboard.hidden=true;dashboard.replaceChildren();login.hidden=false;login.reset();}catch(e){error.textContent=message(e);}});
    refreshButton.addEventListener("click",()=>refresh().catch(e=>{error.textContent=message(e);}));
    add(dashboard,"h2",t("Demandes et devis","Requests and quotes"));
    add(dashboard,"p",data.stats.map(s=>statusName(s.status)+" : "+s.count).join(" · ") || t("Aucun dossier de test.","No test requests."));
    const rows=add(dashboard,"div",null,{class:"admin-table"});
    for(const item of data.requests){
      const card=add(rows,"article",null);
      add(card,"h3",item.ref+" · "+serviceName(item.service));
      add(card,"p",statusName(item.status)+" · "+item.created_at);
      add(card,"p",item.name+" · "+item.email);
      if(item.offer_id) add(card,"p",t("Offre : ","Offer: ")+item.offer_id);
      for(const [key,value] of Object.entries(JSON.parse(item.fields))) add(card,"p",(labels[key]?.[lang==="en"?1:0] || key)+" : "+value);
      if(item.quote_text) add(card,"p",money(item.amount_fils)+" · "+item.quote_text);
      if(item.status==="review"){
        const quote=makeForm(card,t("Créer un devis en AED","Create an AED quote"));
        field(quote,"amount",t("Montant (AED)","Amount (AED)"),{type:"number",min:0.01,step:0.01,required:true});
        field(quote,"expires_at",t("Date limite","Valid until"),{type:"date",min:utcDay(),required:true});
        field(quote,"quote_text",t("Prestations, taxes, exclusions et conditions","Services, taxes, exclusions and terms"),{type:"textarea",maxlength:1800,required:true});
        save(quote,t("Rendre le devis visible au client","Make quote available to client"),v=>api("admin/quote",{...v,ref:item.ref,amount_fils:Math.round(Number(v.amount)*100)}));
      }
      if(transitions[item.status]){
        const move=makeForm(card,t("Suivre la prestation","Update request"));
        const next=field(move,"after",t("Nouveau statut","New status"),{list:transitions[item.status].map(v=>[v,statusName(v)]),value:transitions[item.status][0]});
        if(item.status==="partner_pending"){
          const ref=field(move,"confirmation_ref",t("Référence de confirmation opérateur (recette)","Operator confirmation reference (test only)"),{maxlength:100,required:next.value==="confirmed"});
          next.addEventListener("change",()=>{ref.required=next.value==="confirmed";});
        }
        save(move,t("Enregistrer le statut","Save status"),v=>api("admin/status",{...v,ref:item.ref,before:item.status}));
      }
    }
    for(const [delta,label] of [[-50,t("Précédent","Previous")],[50,t("Suivant","Next")]]){
      if(delta<0?offset>0:data.requests.length===50){
        const button=add(dashboard,"button",label,{class:"outline-btn",type:"button"});
        button.addEventListener("click",async()=>{offset+=delta;try{await refresh();}catch(e){offset-=delta;error.textContent=message(e);}});
      }
    }
    const partner=makeForm(dashboard,t("Opérateurs (recette)","Operators (staging)"));
    const partnerSelect=field(partner,"id",t("Créer ou modifier","Create or edit"),{list:[["",t("Nouvel opérateur","New operator")],...data.partners.map(p=>[p.id,p.name])]});
    const partnerName=field(partner,"name",t("Nom d’opérateur de test","Test operator name"),{maxlength:120,required:true});
    const verified=field(partner,"verified",t("Vérification effectuée (test)","Verification complete (test)"),{type:"checkbox"});
    partnerSelect.addEventListener("change",()=>{const row=data.partners.find(p=>p.id===partnerSelect.value);partnerName.value=row?.name || "";verified.checked=Boolean(row?.verified);});
    save(partner,t("Enregistrer l’opérateur","Save operator"),v=>api("admin/partner",{...v,verified:v.verified==="on"}));
    if(!data.partners.length) return;
    const edit=makeForm(dashboard,t("Offres et tarifs (recette)","Offers and rates (staging)"));
    const select=field(edit,"id",t("Créer ou modifier","Create or edit"),{list:[["",t("Nouvelle offre","New offer")],...data.offers.map(o=>[o.id,o.title_fr])]});
    const firstService=Object.keys(catalog)[0];
    field(edit,"service","Service",{list:Object.keys(catalog).map(k=>[k,serviceName(k)]),value:firstService});
    field(edit,"partner_id",t("Opérateur","Operator"),{list:data.partners.map(p=>[p.id,p.name]),value:data.partners[0].id});
    const metadata=add(edit,"div",null,{class:"form-grid"});
    for(const [key,caption,max,type] of [
      ["title_fr","Titre (FR)",120],["title_en","Title (EN)",120],["description_fr","Description (FR)",900,"textarea"],["description_en","Description (EN)",900,"textarea"],
      ["terms_fr","Conditions et frais (FR)",900,"textarea"],["terms_en","Terms and fees (EN)",900,"textarea"],["location",t("Quartier / adresse","District / address"),100],
    ]) field(metadata,key,caption,{type,required:true,maxlength:max});
    field(metadata,"capacity",t("Capacité","Capacity"),{type:"number",min:1,max:100});
    field(metadata,"bedrooms",t("Chambres","Bedrooms"),{type:"number",min:0,max:100});
    const unit=field(metadata,"unit",t("Unité","Unit"),{list:[["quote",t("Sur devis","On request")],["night",t("Nuit","Night")],["month",t("Mois","Month")],["trip",t("Trajet","Trip")],["order",t("Commande","Order")],["day",t("Journée","Day")]],value:"quote"});
    const amount=field(metadata,"amount",t("Tarif (AED)","Rate (AED)"),{type:"number",min:0.01,step:0.01});
    const syncAmount=()=>{amount.required=unit.value!=="quote";amount.disabled=!amount.required;};
    unit.addEventListener("change",syncAmount);syncAmount();
    field(edit,"image",t("Lien HTTPS ou chemin de la photo existante","HTTPS link or existing photo path"),{maxlength:200});
    field(edit,"upload",t("Téléverser une photo autorisée (512 Ko max.)","Upload an authorised photo (512 KB max.)"),{type:"file",accept:"image/jpeg,image/webp,image/png"});
    field(edit,"active",t("Publier en préproduction","Publish in staging"),{type:"checkbox"});
    select.addEventListener("change",()=>{
      const row=data.offers.find(o=>o.id===select.value);
      const id=select.value;edit.reset();select.value=id;
      if(row) for(const input of edit.elements){
        if(input.name==="amount") input.value=row.price_fils===null?"":row.price_fils/100;
        else if(input.name==="active") input.checked=Boolean(row.active);
        else if(input.name && Object.hasOwn(row,input.name)) input.value=row[input.name]??"";
      }
      syncAmount();
    });
    save(edit,t("Enregistrer l’offre","Save offer"),async v=>{
      const {upload,...offer}=v;
      if(upload?.size){
        if(upload.size>524288) throw new Error("body_size");
        const response=await fetch("/api/admin/media",{method:"POST",headers:{"Content-Type":upload.type},body:upload});
        const data=await response.json();
        if(!response.ok) throw new Error(data.error);
        offer.image=data.image;
      }
      return api("admin/offer",{...offer,active:v.active==="on",price_fils:Math.round(Number(v.amount)*100)});
    });
  }
  formAction(login,$("#loginMessage"),async v=>{await api("admin/login",v);login.reset();await refresh();});
  refresh().catch(e=>{if(e.message!=="unauthorized") $("#loginMessage").textContent=message(e);});
}
