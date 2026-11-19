export const brand = Object.freeze({
  name: "TERANGA DUBAI", signature: "Your African Travel Companion",
  phone: "+971 50 764 0753", whatsapp: "https://wa.me/971507640753",
});
export const tr = (lang, fr, en) => lang === "en" ? en : fr;
export function whatsapp(lang, title = "", ref = "") {
  const message = title
    ? tr(lang, "Bonjour TERANGA DUBAI, je souhaite en savoir plus sur ", "Hello TERANGA DUBAI, I would like to know more about ") + title + (ref ? " (" + ref + ")" : "") + "."
    : tr(lang, "Bonjour TERANGA DUBAI, je souhaite obtenir des informations ou réserver un service à Dubaï.",
      "Hello TERANGA DUBAI, I would like information or help booking a service in Dubai.");
  return brand.whatsapp + "?text=" + encodeURIComponent(message);
}

// Each category describes a service the concierge can quote, not live inventory.
export const catalog = {
  hotels: ["01", "Hôtels", "Hotels", "Un hôtel proche de vos rendez-vous, du métro ou de vos activités. L’équipe vérifie les chambres, les taxes et les conditions avant de proposer un devis.",
    "Stay close to your meetings, the metro or your activities. We check rooms, taxes and terms before preparing a quote.",
    "Dates · voyageurs · budget", "Dates · guests · budget", ["arrival","departure","people","area","budget"]],
  apartments: ["02", "Appartements", "Apartments", "Cherchez un logement meublé pour une famille, un groupe ou un séjour professionnel. Indiquez le quartier, les chambres et les équipements indispensables.",
    "Find a furnished home for a family, group or work trip. Share your preferred area, bedroom count and essential amenities.",
    "Quartier · chambres · séjour", "District · bedrooms · stay", ["arrival","departure","people","area","bedrooms","amenities","budget"]],
  transferts: ["03", "Transferts", "Transfers", "Préparez votre arrivée ou votre retour : accueil aéroport, chauffeur privé, déplacement en groupe ou trajet commercial. Le véhicule et le tarif sont confirmés par l’équipe.",
    "Plan your arrival or departure: airport pick-up, private driver, group or business transport. The team confirms the vehicle and fare.",
    "Aéroport · chauffeur · groupes", "Airport · driver · groups", ["from","to","arrival","time","people","bags","vehicle","flight"]],
  shopping: ["04", "Shopping", "Business shopping", "Préparez un parcours de grossistes autour de Deira, Naif, Bur Dubai ou Dragon Mart. Demandez une demi-journée, une journée ou plusieurs jours avec guide francophone, interprète ou coordination de fret.",
    "Plan a wholesale itinerary around Deira, Naif, Bur Dubai or Dragon Mart. Request a half-day, full day or multi-day visit with a guide, interpreter or freight coordination.",
    "Grossistes · guide · sourcing", "Wholesale · guides · sourcing", ["goods","budget","people","arrival","duration","support"]],
  voitures: ["05", "Voitures", "Car rental", "Comparez sur devis les options avec ou sans chauffeur : berline, SUV ou minivan. Demandez les conditions d’assurance, de kilométrage et de dépôt avant d’accepter.",
    "Request a quote for a sedan, SUV or minivan with or without a driver. Check insurance, mileage and deposit terms before accepting.",
    "Berline · SUV · minivan", "Sedan · SUV · minivan", ["from","to","arrival","departure","people","bags","vehicle"]],
  bagages: ["06", "Bagages", "Luggage", "Demandez la collecte, l’emballage ou l’acheminement de vos achats. TERANGA DUBAI coordonne la demande ; l’opérateur, l’acceptation du contenu et le suivi doivent être confirmés.",
    "Request collection, packing or onward transport for your purchases. TERANGA DUBAI coordinates the request; the operator, accepted contents and tracking must be confirmed.",
    "Collecte · emballage · fret", "Collection · packing · freight", ["from","to","bags","weight","dimensions","goods","arrival"]],
  plats: ["07", "Restaurants", "Restaurants", "Thiéboudienne (riz et poisson), mafé (sauce arachide), yassa (oignons et citron), thiébou yapp (riz à la viande), dibi (grillades) ou soupou kandja (sauce gombo). Demandez les disponibilités, les allergènes et les frais de livraison avant de commander.",
    "Ask for thiéboudienne (fish and rice), mafé (peanut stew), yassa (lemon and onions), thiébou yapp (rice and meat), dibi (grilled meat) or soupou kandja (okra stew). Confirm availability, allergens and delivery fees before ordering.",
    "Cuisine sénégalaise · livraison", "Senegalese food · delivery", ["meal","people","area","arrival","time"]],
  billets: ["08", "Vols", "Flights", "Demandez une proposition aller simple ou aller-retour au départ de Dakar ou d’une autre ville. Indiquez vos dates, votre classe, votre flexibilité et le besoin en bagages.",
    "Request a one-way or return flight from Dakar or another city. Include dates, cabin, flexibility and baggage needs.",
    "Dakar · Dubaï · devis", "Dakar · Dubai · quote", ["from","to","arrival","departure","people","cabin","bags","budget","flexibility"]],
  visa: ["09", "Visa", "Visa assistance", "Décrivez votre séjour pour être orienté vers le bon parcours. Ne saisissez aucun numéro de passeport et ne joignez aucun document. Les frais, délais et conditions seront communiqués après vérification. Aucun visa n’est garanti.",
    "Describe your trip so we can guide you to the right process. Do not enter a passport number or attach documents. Fees, timing and requirements are confirmed after checks. A visa is never guaranteed.",
    "Orientation · suivi", "Guidance · follow-up", ["purpose","nationality","arrival","departure"]],
  activites: ["10", "Activités", "Activities", "Construisez un programme autour du désert, des quartiers historiques et des sorties en famille. Précisez votre rythme, la taille du groupe et vos besoins particuliers.",
    "Build an itinerary around the desert, historic districts and family outings. Tell us your preferred pace, group size and any specific requirements.",
    "Découverte · famille · groupes", "Discovery · family · groups", ["activity","arrival","people","budget"]],
  forfaits: ["11", "Forfaits", "Packages", "Réunissez hébergement, transport et assistance dans un seul devis. Le contenu, les exclusions et les conditions de chaque prestation sont détaillés avant acceptation.",
    "Bundle accommodation, transport and support into a single quote. Inclusions, exclusions and terms are set out before acceptance.",
    "Essential · Business · Premium", "Essential · Business · Premium", ["package","arrival","departure","people","budget"]],
};
export const labels = {
  arrival: ["Date de départ ou d’arrivée","Travel date"], departure: ["Date de retour ou de départ (facultatif)","Return or check-out (optional)"],
  people: ["Voyageurs ou portions","Guests or servings"], area: ["Quartier","District"], budget: ["Budget indicatif (AED)","Budget estimate (AED)"],
  bedrooms: ["Chambres","Bedrooms"], amenities: ["Équipements souhaités","Facilities needed"],
  from: ["Départ ou collecte","Pick-up or origin"], to: ["Destination","Destination"], time: ["Heure locale","Local time"],
  bags: ["Bagages ou colis","Bags or parcels"], vehicle: ["Véhicule / chauffeur","Vehicle / driver"], flight: ["Numéro de vol (facultatif)","Flight number (optional)"],
  goods: ["Nature des marchandises","Type of goods"], duration: ["Durée","Duration"], support: ["Guide / transport / fret","Guide / transfer / freight"],
  weight: ["Poids estimé (kg)","Estimated weight (kg)"], dimensions: ["Dimensions (cm)","Dimensions (cm)"],
  meal: ["Plat souhaité","Preferred dish"], cabin: ["Classe","Cabin"], flexibility: ["Flexibilité des dates","Date flexibility"],
  purpose: ["Type de séjour","Purpose of trip"], nationality: ["Nationalité","Nationality"],
  activity: ["Activité souhaitée","Preferred activity"], package: ["Forfait souhaité","Preferred package"],
};
export const choices = {
  meal: ["Thiéboudienne","Mafé","Yassa","Thiébou yapp","Dibi","Soupou kandja"],
  package: ["TERANGA ESSENTIAL","TERANGA BUSINESS SHOPPING","TERANGA PREMIUM"],
  vehicle: ["Berline / Sedan","SUV","Minivan","Avec chauffeur / With driver","Sans chauffeur / Self-drive"],
  duration: ["Demi-journée / Half-day","Journée / Full day","Plusieurs jours / Several days"],
  cabin: ["Économique / Economy","Premium economy","Affaires / Business","Première / First"],
};
export const packages = [
  [choices.package[0], "Hébergement, transferts et assistance WhatsApp.", "Accommodation, transfers and WhatsApp support.", "Vols, visa et repas non inclus par défaut.", "Flights, visa and meals not included by default."],
  [choices.package[1], "Hébergement, transferts, guide commercial et coordination des bagages.", "Accommodation, transfers, trade guide and luggage coordination.", "Achats, droits de douane et fret à chiffrer séparément.", "Purchases, duties and freight quoted separately."],
  [choices.package[2], "Hébergement supérieur, chauffeur et conciergerie personnalisée.", "Upgraded accommodation, private driver and a personalised concierge.", "Dépenses personnelles et prestations non inscrites au devis exclues.", "Personal expenses and services outside the quote are excluded."],
];
export const statuses = {
  new:["Nouvelle demande","New request"], review:["En cours d’analyse","Under review"],
  quoted:["Devis envoyé","Quote available"], accepted:["Devis accepté","Quote accepted"],
  partner_pending:["Confirmation partenaire en attente","Awaiting partner confirmation"],
  confirmed:["Réservation confirmée","Booking confirmed"], completed:["Prestation terminée","Completed"],
  cancelled:["Annulée","Cancelled"],
};
