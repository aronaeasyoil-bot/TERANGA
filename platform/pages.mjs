import { brand, catalog, choices, labels, packages, tr, whatsapp } from "./catalog.mjs";

const esc = (value) => String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"})[c]);
const url = (lang, page = "") => (lang === "en" ? "/en/" : "/") + page;
const copy = (lang, record, i) => record[lang === "en" ? i+1 : i];
const name = (lang, service) => copy(lang,catalog[service],1);
const waLink = (lang, cls, label, title = "") => `<a class="${cls}" href="${esc(whatsapp(lang,title))}" target="_blank" rel="noopener noreferrer">${label}</a>`;
const icons = {
  hotels:"M3 21V4h13v17M16 9h5v12M7 8h1m4 0h1m-6 4h1m4 0h1m-6 4h1m4 0h1M2 21h21",
  apartments:"m2 11 10-8 10 8M5 10v11h14V10M9 21v-7h6v7",
  transferts:"M3 10h18v8H3zM5 10l2-5h10l2 5M6 18v3m12-3v3M6 14h2m8 0h2",
  voitures:"M3 15a9 9 0 1 1 18 0M5 15h14m-7 0v6M8 21h8",
  shopping:"M4 8h16l1 13H3zM8 10V6a4 4 0 0 1 8 0v4",
  bagages:"M5 8h14v12H5zM9 8V4h6v4M9 12v4m6-4v4M7 20v2m10-2v2",
  plats:"M3 15h18a9 9 0 0 1-18 0Zm3-3a6 6 0 0 1 12 0M12 6V4M5 21h14",
  billets:"m2 12 20-9-7 19-3-9-10-1Zm10 1 10-10",
  visa:"M5 3h14v18H5zM8 8h8m-8 4h8m-8 4h4",
  activites:"M12 2v4m0 12v4M2 12h4m12 0h4M5 5l3 3m8 8 3 3M5 19l3-3m8-8 3-3M9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z",
  forfaits:"m3 7 9-4 9 4v10l-9 4-9-4V7Zm0 0 9 4 9-4m-9 4v10",
};
const icon = (key) => `<svg class="line-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${icons[key]}"/></svg>`;
const guides = [
  ["Loger près de ses rendez-vous","Stay close to your meetings","Regroupez vos rendez-vous par quartier. Comparez le temps de trajet réel aux heures prévues, le coût du transfert et la politique d’annulation, pas seulement le prix de la nuit.","Group meetings by district. Compare actual travel times, transfer costs and cancellation terms, not just the nightly rate."],
  ["Préparer son voyage d’affaires","Plan a business trip","Préparez une liste de fournisseurs par catégorie, vos unités et dimensions, votre budget en AED et un calendrier de rendez-vous. Gardez une journée tampon pour les imprévus.","List suppliers by category, record units and dimensions, set an AED budget and prepare a meeting schedule. Leave a buffer day."],
  ["Organiser ses achats à Deira","Organise purchases in Deira","Séparez repérage et achat. Demandez des devis écrits et des échantillons lorsque c’est possible. Faites confirmer quantités, délais et conditions avant de régler.","Separate scouting from purchasing. Ask for written quotes and samples when possible. Confirm quantities, lead times and terms before paying."],
  ["Préparer son transfert","Plan an airport transfer","Communiquez l’aéroport, le terminal et l’horaire local. Comptez passagers, valises et besoins d’accessibilité, puis confirmez le point de rendez-vous et les frais d’attente.","Share airport, terminal and local arrival time. Count guests and bags, note accessibility needs, then confirm the meeting point and waiting fees."],
  ["Préparer ses bagages au retour","Prepare luggage for the return","Mesurez les colis emballés et vérifiez les règles de votre compagnie ou de l’opérateur. Conservez factures et inventaire ; demandez une preuve de remise.","Measure packed parcels and check your airline or operator’s rules. Keep invoices and an inventory, and request handover evidence."],
];

function header(lang, page) {
  const alt = lang === "fr" ? "en" : "fr";
  return `<a class="skip" href="#main">${tr(lang,"Aller au contenu","Skip to content")}</a>
  <header class="mast"><div class="wrap mast-inner"><a class="brandmark" href="${url(lang)}"><img width="164" height="56" src="/assets/logo-teranga-dubai.jpg" alt="${brand.name}"><span>${brand.signature}</span></a>
  <div class="mast-tools"><a href="${url(alt,page)}" hreflang="${alt}" aria-label="${tr(lang,"Version anglaise","French version")}">${alt.toUpperCase()}</a><span class="currency">AED</span><a class="track-link" href="${url(lang,"dossier")}">${tr(lang,"Mon dossier","My request")}</a><button id="openNav" class="menu-btn" aria-expanded="false" aria-controls="siteNav">☰ <span>Menu</span></button></div></div>
  <nav id="siteNav" class="navline" aria-label="${tr(lang,"Navigation principale","Main navigation")}"><div class="wrap">
  <a href="${url(lang)}">${tr(lang,"Accueil","Home")}</a>
  ${Object.keys(catalog).map(k=>`<a href="${url(lang,k)}"${page===k?' aria-current="page"':""}>${name(lang,k)}</a>`).join("")}
  <a href="${url(lang,"contact")}">Contact</a></div></nav></header>`;
}
function footer(lang) {
  return `<footer class="travel-footer"><div class="wrap footer-columns">
    <div><strong>${brand.name}</strong><p>${brand.signature}</p>${waLink(lang,"footer-link",brand.phone)}</div>
    <div><strong>${tr(lang,"Préparer votre séjour","Plan your stay")}</strong><a href="${url(lang,"guides")}">${tr(lang,"Guides pratiques","Travel guides")}</a><a href="${url(lang,"dossier")}">${tr(lang,"Suivre mon dossier","Track my request")}</a></div>
    <div><strong>${tr(lang,"Informations","Information")}</strong><a href="${url(lang,"conditions")}">${tr(lang,"Conditions de demande","Request terms")}</a><a href="${url(lang,"confidentialite")}">${tr(lang,"Confidentialité","Privacy")}</a><a href="${url(lang,"contact")}">Contact</a></div>
  </div><div class="wrap footer-end">© ${brand.name} <span>${tr(lang,"Conciergerie humaine · Sur devis · AED","Human concierge · On request · AED")}</span></div></footer>
  ${waLink(lang,"wa-float",`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 11.5a9 9 0 0 1-13.6 7.9L3 21l1.5-4.5A9 9 0 1 1 21 11.5Z"/><path d="M9 8c.3 3 2 4.7 5 6l1-1c1 .2 2 .9 2 1.4s-.7 1.6-1.6 1.6C12 16 8 13 8 9c0-1 .5-1.5 1-1.5Z"/></svg><span>WhatsApp</span>`)}`;
}
function section(lang, over, title, intro, inner, cls = "") {
  return `<section class="travel-section ${cls}"><div class="wrap"><p class="kicker">${over}</p><h2>${title}</h2>${intro ? `<p class="section-intro">${intro}</p>` : ""}${inner}</div></section>`;
}
function fields(lang,key) {
  const required = ["arrival","from","to","goods","package","meal"].includes(key) ? " required" : "";
  const label = copy(lang,labels[key],0);
  if (choices[key]) return `<label>${label}<select name="${key}"${required}><option value="">${tr(lang,"Choisir","Choose")}</option>${choices[key].map(v=>`<option>${v}</option>`).join("")}</select></label>`;
  const type = ["arrival","departure"].includes(key) ? 'type="date"' : key==="time" ? 'type="time"' : ["people","bedrooms","bags","budget","weight"].includes(key) ? `type="number" min="${["bedrooms","bags"].includes(key)?0:1}" step="${["budget","weight"].includes(key)?"0.01":"1"}"` : 'type="text" maxlength="160"';
  return `<label>${label}<input name="${key}" ${type}${required}></label>`;
}
const packageCards = (lang) => `<div class="package-grid">${packages.map(([title,fr,en,excFr,excEn],i)=>`<article class="package-card"><p class="kicker">0${i+1} / ${tr(lang,"Sur devis","On request")}</p><h3>${title}</h3><p>${tr(lang,fr,en)}</p><p class="muted">${tr(lang,excFr,excEn)} ${tr(lang,"Durée et conditions à convenir.","Duration and terms to be agreed.")}</p><a href="${url(lang,"forfaits")}?package=${i}#demande">${tr(lang,"Demander ce forfait","Request this package")} →</a></article>`).join("")}</div>`;
function home(lang) {
  const services = Object.keys(catalog);
  return `<section class="travel-hero"><img class="hero-panorama" src="/assets/dubai-panorama.webp" width="2200" height="560" alt="" fetchpriority="high"><div class="wrap hero-inner">
  <div class="hero-textblock"><p class="hero-kicker"><span></span> ${tr(lang,"DUBAÏ · ÉMIRATS ARABES UNIS","DUBAI · UNITED ARAB EMIRATES")}</p><h1>Welcome to<br><em>TERANGA DUBAI.</em></h1><p class="hero-signature">${brand.signature}</p><p class="hero-description">${tr(lang,"Réservez votre hébergement, organisez vos déplacements, vos achats et votre séjour à Dubaï avec un accompagnement personnalisé.","Book a place to stay, arrange transport and shopping, and plan your time in Dubai with personalised support.")}</p>
  <div class="button-row"><a class="travel-btn" href="#explorer">${tr(lang,"Explorer les services","Explore services")} ↗</a><a class="hero-contact" href="${url(lang,"hotels")}#demande">${tr(lang,"Réserver un séjour","Plan a stay")}</a>${waLink(lang,"hero-contact",tr(lang,"Contacter l’équipe","Contact the team"))}</div></div></div>
  <small class="photo-credit"><a href="https://commons.wikimedia.org/wiki/File:Panorama_of_Dubai.jpg">Milkaselnuss</a> · <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a> · WebP / ${tr(lang,"redimensionné","resized")}</small></section>
  <div class="wrap search-wrap"><section class="travel-search"><p class="kicker">${tr(lang,"DONNEZ FORME À VOTRE SÉJOUR","SHAPE YOUR STAY")}</p><h2>${tr(lang,"Que souhaitez-vous organiser ?","What would you like to plan?")}</h2>
  <div class="search-tabs" role="group" aria-label="${tr(lang,"Choisir un service","Choose a service")}">${services.filter(k=>k!=="forfaits").map((k,i)=>`<button type="button" data-tab="${k}" aria-pressed="${i===0}">${icon(k)} ${name(lang,k)}</button>`).join("")}</div>
  <form action="${url(lang,"hotels")}#demande" class="quick-form" id="tripSearch">${fields(lang,"arrival")}${fields(lang,"people")}${fields(lang,"area")}<button class="travel-btn">${tr(lang,"Préparer ma demande","Plan my request")} →</button></form>
  <template id="tab-fields">${services.map(k=>`<div data-fields="${k}">${catalog[k][7].slice(0,3).map(f=>fields(lang,f)).join("")}</div>`).join("")}</template>
  <p class="search-note">${tr(lang,"Aucune réservation instantanée : l’équipe confirme chaque offre et ses conditions.","Not an instant booking: our team checks each offer and its terms.")}</p></section></div>
  <div id="explorer">${section(lang,tr(lang,"01 / EXPLORER","01 / EXPLORE"),tr(lang,"Dubaï, à votre façon.","Dubai, your way."),tr(lang,"Du premier trajet aux derniers achats, composez le séjour qui vous ressemble.","From the first ride to your last purchase, build the trip that fits."),`<div class="travel-grid">${services.map(k=>`<a class="travel-card" href="${url(lang,k)}"><span class="card-top">${icon(k)} <small>${catalog[k][0]}</small></span><h3>${name(lang,k)}</h3><p>${copy(lang,catalog[k],5)}</p><span class="card-arrow" aria-hidden="true">↗</span></a>`).join("")}</div>`)}</div>
  ${section(lang,tr(lang,"02 / NOS FORFAITS","02 / PACKAGES"),tr(lang,"Un séjour, trois façons de le vivre.","One trip, three ways to take it."),"",packageCards(lang),"tint")}
  ${section(lang,tr(lang,"03 / ENSEMBLE","03 / TOGETHER"),tr(lang,"Un site pour préparer. Une équipe pour avancer.","Plan online. Move forward with a real team."),tr(lang,"De Dakar à Dubaï, organisez vos priorités en français ou en anglais. Une demande n’est ni un engagement de paiement ni une réservation confirmée.","From Dakar to Dubai, plan in French or English. A request is neither an obligation to pay nor a confirmed booking."),`<div class="steps"><article><b>01.</b><h3>${tr(lang,"Dites-nous votre besoin","Tell us what you need")}</h3><p>${tr(lang,"Sélectionnez un service et recevez une référence de dossier.","Select a service and receive a request reference.")}</p></article><article><b>02.</b><h3>${tr(lang,"Consultez le devis","Review the quote")}</h3><p>${tr(lang,"L’équipe vérifie les options avant de proposer des conditions et un tarif.","Our team checks options before offering terms and a price.")}</p></article><article><b>03.</b><h3>${tr(lang,"Suivez votre dossier","Follow your request")}</h3><p>${tr(lang,"Acceptez le devis et attendez la confirmation de l’opérateur.","Accept the quote and wait for the operator’s confirmation.")}</p></article></div>`)}
  ${section(lang,"FAQ",tr(lang,"Avant de partir.","Before you go."),"",faq(lang),"tint")}`;
}
function faq(lang) {
  return `<div class="faq">${[
    ["Une demande confirme-t-elle la réservation ?","Does a request confirm my booking?","Non. Le devis et l’accord de l’opérateur sont nécessaires. Consultez votre dossier pour connaître son état.","No. A quote and operator approval are required. Check your request status for updates."],
    ["Dans quelle devise sont les devis ?","What currency are quotes in?","Les devis affichent l’AED. Aucun paiement n’est activé dans cette préproduction.","Quotes are shown in AED. Payments are not enabled in this staging site."],
    ["Où consulter des avis ?","Where can I see reviews?","Les avis ne seront publiés qu’après vérification d’une prestation réelle. Aucun avis n’est encore publié ici.","Reviews will only be published after a completed service is verified. No reviews are published here yet."],
    ["Comment retrouver mon dossier ?","How do I find my request?","Utilisez la référence et la clé privée remises après l’envoi du formulaire. Ne partagez pas la clé.","Use the reference and private key given after submitting the form. Do not share your key."],
  ].map(([q,eq,a,ea])=>`<details><summary>${tr(lang,q,eq)}</summary><p>${tr(lang,a,ea)}</p></details>`).join("")}</div>`;
}
function servicePage(lang,key) {
  const service = catalog[key];
  return `<section class="inner-hero"><div class="wrap"><p class="kicker">${icon(key)} ${copy(lang,service,5)}</p><h1>${name(lang,key)}</h1><p>${copy(lang,service,3)}</p><div class="button-row"><a href="#demande" class="travel-btn">${tr(lang,"Préparer une demande","Start a request")} →</a>${waLink(lang,"outline-btn","WhatsApp",name(lang,key))}</div></div></section>
  ${key==="forfaits" ? section(lang,tr(lang,"FORMAT","FORMAT"),tr(lang,"Choisir une formule.","Choose a package."),"",packageCards(lang)) : ""}
  <section class="travel-section"><div class="wrap"><p class="kicker">${tr(lang,"CATALOGUE","CATALOGUE")}</p><h2>${tr(lang,"Offres publiées","Published offers")}</h2><p class="section-intro">${tr(lang,"Seules les offres validées s’affichent. Disponibilité et prix final sur confirmation.","Only verified offers appear. Availability and final price are confirmed separately.")}</p>
  <div id="liveOffers" data-service="${key}" class="offer-grid" aria-live="polite"><p>${tr(lang,"Consultez les offres ou demandez une recherche personnalisée ci-dessous.","Browse offers or request a personalised search below.")}</p></div></div></section>
  <section id="demande" class="travel-section tint"><div class="wrap form-layout"><div><p class="kicker">${tr(lang,"SUR DEVIS","ON REQUEST")}</p><h2>${tr(lang,"Parlons de votre besoin.","Tell us what you need.")}</h2><p>${tr(lang,"Une demande crée un dossier, sans paiement. L’équipe vérifie les options avant d’émettre un devis.","A request opens a case without payment. The team checks the options before issuing a quote.")}</p><p class="test-note">${tr(lang,"Préproduction : utilisez un nom fictif et une adresse en .test. Ne renseignez aucun document ou numéro d’identité.","Staging: use a fictional name and an address ending in .test. Do not enter identity documents or numbers.")}</p></div>
  <form id="requestForm" class="panel" method="post" action="/api/requests" data-service="${key}"><p id="selectedOffer" hidden></p><div class="form-grid">${service[7].map(f=>fields(lang,f)).join("")}
  <label>${tr(lang,"Nom fictif","Fictional name")}<input required name="name" maxlength="100" placeholder="Alex Test"></label><label>Email (.test)<input required type="email" name="email" maxlength="180" placeholder="alex@example.test"></label></div>
  <div hidden><label>Website <input name="website" tabindex="-1" autocomplete="off"></label></div>
  <label class="check-label"><input type="checkbox" name="consent" required> ${tr(lang,"J’accepte le traitement de ces données de test pour ma demande.","I agree to the processing of this test data for my request.")}</label>
  <button class="travel-btn" type="submit">${tr(lang,"Envoyer la demande","Submit request")}</button><p class="message" id="requestMessage" role="status"></p><section id="receipt" hidden></section></form></div></section>`;
}
function extras(lang,page) {
  const t = (fr,en)=>tr(lang,fr,en);
  const wrap = (h,b)=>`<section class="travel-section"><div class="wrap text-page"><p class="kicker">${brand.name}</p><h1>${h}</h1>${b}</div></section>`;
  if (page==="contact") return wrap("Contact",`<p>${t("Indiquez votre service, vos dates et votre budget. Si vous avez déjà un dossier, donnez sa référence publique, jamais sa clé privée.","Share the service, dates and budget. If you already have a request, share its public reference, never its private key.")}</p>${waLink(lang,"travel-btn",brand.phone)}<p><a href="${url(lang,"dossier")}">${t("Suivre ma demande","Track my request")} →</a></p>`);
  if (page==="guides") return wrap(t("Guides pour votre voyage","Guides for your trip"),guides.map(g=>`<article class="panel"><h2>${copy(lang,g,0)}</h2><p>${copy(lang,g,2)}</p></article>`).join("")+`<p><a href="https://www.visitdubai.com/">Visit Dubai</a> · <a href="https://www.dubaiairports.ae/">Dubai Airports</a></p>`);
  if (page==="conditions") return wrap(t("Conditions de demande","Request terms"),`<p>${t("Cette préproduction est réservée aux tests. Une demande ne donne ni droit à une prestation ni garantie de disponibilité ou de visa. Aucun paiement, frais ou remboursement n’est traité ici.","This staging site is for testing only. A request does not entitle you to a service or guarantee availability or a visa. No payments, charges or refunds are handled here.")}</p><p>${t("Les conditions finales d’annulation, taxes, responsabilités et éventuels remboursements doivent être confirmés par écrit par l’opérateur autorisé avant que vous vous engagiez.","Final cancellation terms, taxes, responsibilities and any refunds must be confirmed in writing by the authorised operator before you commit.")}</p>`);
  if (page==="confidentialite") return wrap(t("Confidentialité","Privacy"),`<p>${t("Saisissez uniquement des données fictives. La base de test conserve le nom, l’email de test, les détails du service et son historique pour valider le parcours. Ne saisissez ni numéro de passeport, ni document, ni moyen de paiement.","Enter fictional data only. The test database stores the test name, email, service details and request history to validate the flow. Do not enter passport numbers, documents or payment information.")}</p><p>${t("La clé privée ouvre votre dossier. Elle n’est pas envoyée par WhatsApp. L’équipe peut retirer un dossier de test sur demande via la page Contact.","The private key opens your request. It is not sent through WhatsApp. Ask via Contact if a test record should be removed.")}</p>`);
  if (page==="dossier") return wrap(t("Suivre mon dossier","Track my request"),`<p>${t("Accédez au statut, à l’historique et au devis avec les identifiants remis lors de la demande.","Access the status, history and quote using the credentials provided when you submitted your request.")}</p>
    <form class="panel" id="trackForm" method="post" action="/api/track"><label>${t("Référence du dossier","Request reference")}<input name="ref" minlength="19" maxlength="19" required placeholder="TD-0000000000000000"></label><label>${t("Clé privée","Private key")}<input name="key" type="password" minlength="64" maxlength="64" required autocomplete="off"></label><button class="travel-btn">${t("Ouvrir le dossier","Open request")}</button></form><div id="trackResult" aria-live="polite"></div>`);
  return wrap("Administration",`<p>${t("Espace de recette réservé à l’équipe. Aucun dossier de production.","Staging access for the team. No production records.")}</p>
    <form id="adminLogin" class="panel" method="post" action="/api/admin/login"><label>${t("Phrase d’accès de préproduction","Staging passphrase")}<input name="password" type="password" required autocomplete="current-password" maxlength="200"></label><button class="travel-btn">${t("Connexion","Sign in")}</button><p id="loginMessage" role="status"></p></form><section id="adminDashboard" hidden></section>`);
}
const extra = {
  contact:["Contact","Contact"], guides:["Guides de voyage","Travel guides"], dossier:["Mon dossier","My request"],
  confidentialite:["Confidentialité","Privacy"], conditions:["Conditions","Terms"], admin:["Administration","Administration"],
};
export const pages = ["",...Object.keys(catalog),...Object.keys(extra)];
export function render(lang,page) {
  const title = page ? (catalog[page] ? name(lang,page) : copy(lang,extra[page],0)) + " | " + brand.name : `${brand.name} | ${brand.signature}`;
  const desc = catalog[page] ? copy(lang,catalog[page],3) : tr(lang,"Conciergerie pour voyageurs africains à Dubaï : hébergement, transfert, shopping et séjour.","Dubai concierge for African travellers: stays, transfers, shopping and more.");
  return `<!doctype html>
<html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<link rel="alternate" hreflang="fr" href="${url("fr",page)}"><link rel="alternate" hreflang="en" href="${url("en",page)}"><link rel="icon" href="/assets/teranga-icon.svg" type="image/svg+xml"><link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/platform/travel.css"><script type="module" src="/platform/ui.mjs"></script></head>
<body class="travel"><div class="stage-bar">${tr(lang,"PRÉPRODUCTION · Parcours de test, aucun paiement","STAGING · Test requests only, no payments")}</div>
${header(lang,page)}<main id="main">${page===""?home(lang):catalog[page]?servicePage(lang,page):extras(lang,page)}</main>${footer(lang)}</body></html>`;
}
