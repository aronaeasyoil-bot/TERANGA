const stock = (slug, fr, en) => ({
  source: "https://www.pexels.com/photo/" + slug + "/",
  license: "https://www.pexels.com/license/",
  label: "Pexels",
  fr, en,
});

// Editorial visuals: these photographs are not listings or partner offers.
export const photos = {
  skyline: stock("stunning-evening-skyline-of-dubai-with-burj-khalifa-38518982", "Dubaï et le Burj Khalifa à la tombée de la nuit", "Dubai and the Burj Khalifa at dusk"),
  hotel: stock("luxury-hotel-bedroom-with-large-window-view-36767624", "Chambre d’hôtel lumineuse avec un grand lit", "Bright hotel room with a large bed"),
  apartment: stock("beige-sofa-near-glass-window-7750027", "Salon d’appartement meublé, baigné de lumière", "Furnished living room filled with daylight"),
  transfer: stock("traveler-with-luggage-at-airport-terminal-32176403", "Voyageur avec une valise au terminal", "Traveller with a suitcase at the terminal"),
  souk: stock("display-of-dried-spices-16412108", "Épices et fleurs séchées au souk de Dubaï", "Spices and dried flowers at Dubai’s souk"),
  car: stock("black-range-rover-parked-on-gray-stone-pavement-14471686", "SUV noir stationné", "Parked black SUV"),
  luggage: stock("warehouse-storage-with-stacked-cardboard-boxes-38195854", "Colis sur des rayonnages dans un entrepôt", "Parcels on warehouse shelves"),
  thieboudienne: {
    source:"https://commons.wikimedia.org/wiki/File:Thie_Bou_Djeun.jpg",
    license:"https://creativecommons.org/licenses/by-sa/4.0/",
    label:"Mayalabeil75 · Wikimedia Commons · CC BY-SA 4.0",
    fr:"Thiéboudienne : riz, poisson et légumes à la sénégalaise",
    en:"Thiéboudienne: Senegalese rice, fish and vegetables",
  },
  flight: stock("airplane-wing-view-at-twilight-over-dubai-airport-34430798", "Vue depuis un hublot à l’aéroport de Dubaï au crépuscule", "Aircraft window view at Dubai airport at dusk"),
  visa: stock("close-up-shot-of-a-passport-and-tickets-on-top-of-a-laptop-7310015", "Passeport fermé et billets posés sur un ordinateur", "Closed passport and tickets on a laptop"),
  desert: stock("scenic-view-of-the-dunes-in-the-desert-12643028", "Un chameau dans les dunes de Dubaï au coucher du soleil", "A camel among Dubai’s dunes at sunset"),
  marina: stock("scenic-view-of-dubai-marina-skyline-and-waterfront-31692141", "Le front de mer de Dubai Marina", "Dubai Marina waterfront"),
  essential: stock("a-hotel-room-bed-14645130", "Grande chambre d’hôtel aux tons chauds", "Spacious hotel room in warm tones"),
  business: stock("vibrant-spice-shop-in-dubai-s-traditional-market-30156546", "Étal coloré dans un marché traditionnel de Dubaï", "Colourful stall in a traditional Dubai market"),
  premium: stock("stunning-view-of-dubai-marina-skyscrapers-and-yachts-29470795", "Yachts et tours de Dubai Marina", "Yachts and towers at Dubai Marina"),
  support: stock("positive-black-woman-using-smartphone-and-laptop-while-smiling-7191950", "Une femme souriante téléphone tout en travaillant sur son ordinateur", "A smiling woman speaking on her phone while working on a laptop"),
  faq: stock("modern-dubai-skyline-with-burj-khalifa-30336911", "Dubaï et ses gratte-ciel en plein jour", "Dubai’s skyline in daylight"),
  planner: stock("black-woman-packing-suitcase-in-room-5330981", "Une voyageuse prépare sa valise", "A traveller packing a suitcase"),
};

export const servicePhotos = {
  hotels:"hotel", apartments:"apartment", transferts:"transfer", shopping:"souk",
  voitures:"car", bagages:"luggage", plats:"thieboudienne", billets:"flight",
  visa:"visa", activites:"desert", forfaits:"marina",
};
export const packagePhotos = ["essential","business","premium"];
export const originalWidths = { skyline:1920, transfer:950, visa:900, essential:880, business:880, premium:880, support:1100, planner:750 };
export const photoFiles = Object.keys(photos).flatMap(key=>[".webp","-small.webp"].map(suffix=>"assets/travel/"+key+suffix));
