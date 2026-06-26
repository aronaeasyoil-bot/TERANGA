const translations = {
  fr: {
    page_title: "TERANGA | Appartements a louer a Dubai",
    brand_tagline: "Locations d'appartements a Dubai",
    menu_label: "Ouvrir le menu",
    menu_home: "Accueil",
    menu_apartments: "Appartements",
    menu_services: "Services",
    menu_contact: "Contact",
    hero_eyebrow: "Selection privee a Dubai",
    hero_title: "Trouvez votre appartement a louer a Dubai.",
    hero_text:
      "Une page simple, elegante et mobile pour aider les Africains et Senegalais a trouver plus vite un logement a Dubai avec TERANGA.",
    check_in: "Check-In",
    check_out: "Check-Out",
    guests: "Guests",
    location: "Location",
    date_placeholder: "Choisir une date",
    search_cta: "Rechercher",
    amenity_pool: "Piscine",
    amenity_kitchen: "Cuisine",
    amenity_gym: "Gym",
    amenity_pets: "Animaux acceptes",
    amenity_balcony: "Balcon",
    catalog_title: "Nos appartements vedettes",
    catalog_text:
      "Des annonces simples, claires et toutes presentees dans le meme format.",
    summary_all: "{count} appartements disponibles a Dubai.",
    summary_filtered: "{count} appartements disponibles pour {location} et {guests} occupant(s).",
    services_eyebrow: "Services TERANGA",
    services_title: "On vous aide aussi a bien vous installer.",
    service_1_title: "Selection d'appartements",
    service_1_text:
      "Nous preparons une selection adaptee a votre budget, votre quartier prefere et votre date d'arrivee.",
    service_2_title: "Visite et reservation",
    service_2_text:
      "Notre equipe centralise les echanges, la disponibilite et la reservation de votre appartement.",
    service_3_title: "Assistance installation",
    service_3_text:
      "Visa, relocation, aeroport ou mise en relation utile pour bien commencer votre vie a Dubai.",
    contact_eyebrow: "Contact TERANGA",
    contact_title: "Recevez une proposition rapide et claire.",
    contact_text:
      "Dites-nous votre quartier, votre budget et votre date d'arrivee. Nous vous repondons avec des appartements disponibles.",
    whatsapp: "WhatsApp",
    listing_badge: "{rating} ★",
    listing_month: "/ mois",
    listing_year: "/ an",
    fact_bedrooms: "chambre(s)",
    fact_bathrooms: "salle(s) d'eau",
    fact_size: "m2",
    fact_capacity: "occupants",
    details_label: "Disponibilite verifiee",
    empty_title: "Aucun appartement ne correspond a votre recherche.",
    empty_text: "Essayez un autre quartier ou retirez un filtre d'equipement.",
    all_locations: "Any location",
    whatsapp_intro: "Bonjour TERANGA, je souhaite recevoir plus d'informations sur",
    whatsapp_suffix: "Merci.",
  },
  en: {
    page_title: "TERANGA | Apartments for Rent in Dubai",
    brand_tagline: "Dubai apartment rentals",
    menu_label: "Open menu",
    menu_home: "Home",
    menu_apartments: "Apartments",
    menu_services: "Services",
    menu_contact: "Contact",
    hero_eyebrow: "Private selection in Dubai",
    hero_title: "Find your apartment for rent in Dubai.",
    hero_text:
      "A simple, elegant and mobile-first page to help African and Senegalese clients find a home in Dubai faster with TERANGA.",
    check_in: "Check-In",
    check_out: "Check-Out",
    guests: "Guests",
    location: "Location",
    date_placeholder: "Choose a date",
    search_cta: "Search",
    amenity_pool: "Swimming pool",
    amenity_kitchen: "Kitchen",
    amenity_gym: "Gym",
    amenity_pets: "Pets allowed",
    amenity_balcony: "Balcony",
    catalog_title: "Our top properties",
    catalog_text:
      "Simple, clear listings, all presented in the same format.",
    summary_all: "{count} apartments available in Dubai.",
    summary_filtered: "{count} apartments available for {location} and {guests} guest(s).",
    services_eyebrow: "TERANGA services",
    services_title: "We also help you settle in properly.",
    service_1_title: "Apartment curation",
    service_1_text:
      "We prepare a shortlist based on your budget, preferred neighborhood and move-in date.",
    service_2_title: "Visits and reservation",
    service_2_text:
      "Our team coordinates communication, availability and reservation for your apartment.",
    service_3_title: "Move-in support",
    service_3_text:
      "Visa, relocation, airport pickup or useful introductions to start your Dubai life smoothly.",
    contact_eyebrow: "Contact TERANGA",
    contact_title: "Receive a fast and clear proposal.",
    contact_text:
      "Tell us your neighborhood, budget and move-in date. We reply with available apartments.",
    whatsapp: "WhatsApp",
    listing_badge: "{rating} ★",
    listing_month: "/ month",
    listing_year: "/ year",
    fact_bedrooms: "bedroom(s)",
    fact_bathrooms: "bathroom(s)",
    fact_size: "sqm",
    fact_capacity: "guests",
    details_label: "Verified availability",
    empty_title: "No apartment matches your search.",
    empty_text: "Try another neighborhood or remove an amenity filter.",
    all_locations: "Any location",
    whatsapp_intro: "Hello TERANGA, I would like more information about",
    whatsapp_suffix: "Thank you.",
  },
};

const listings = [
  {
    id: "trg-marina-01",
    neighborhood: "Dubai Marina",
    title: {
      fr: "Appartement meuble 1 chambre face a Marina Walk",
      en: "Furnished 1-bedroom apartment facing Marina Walk",
    },
    description: {
      fr: "Un appartement lumineux, moderne et pret a habiter pour un profil actif qui veut vivre pres de la marina.",
      en: "A bright, modern and ready-to-move-in apartment for active renters who want to live near the marina.",
    },
    monthly: 9800,
    annual: 117600,
    bedrooms: 1,
    bathrooms: 2,
    size: 79,
    capacity: 2,
    rating: 4.9,
    amenities: ["pool", "kitchen", "gym", "balcony"],
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "trg-jvc-02",
    neighborhood: "Jumeirah Village Circle",
    title: {
      fr: "Appartement familial 2 chambres au coeur de JVC",
      en: "Family 2-bedroom apartment in the heart of JVC",
    },
    description: {
      fr: "Une belle option pour les couples et familles qui cherchent plus d'espace, un balcon et une residence calme.",
      en: "A strong option for couples and families seeking more space, a balcony and a quieter residence.",
    },
    monthly: 8900,
    annual: 106800,
    bedrooms: 2,
    bathrooms: 2,
    size: 108,
    capacity: 4,
    rating: 4.9,
    amenities: ["pool", "kitchen", "pets", "balcony"],
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "trg-downtown-03",
    neighborhood: "Downtown Dubai",
    title: {
      fr: "Appartement premium 2 chambres proche Burj Khalifa",
      en: "Premium 2-bedroom apartment near Burj Khalifa",
    },
    description: {
      fr: "Une adresse haut de gamme au centre de Dubai avec finitions premium, salle de sport et services residents.",
      en: "A high-end downtown Dubai address with premium finishes, gym access and resident services.",
    },
    monthly: 16500,
    annual: 198000,
    bedrooms: 2,
    bathrooms: 3,
    size: 126,
    capacity: 4,
    rating: 4.95,
    amenities: ["pool", "kitchen", "gym", "balcony"],
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "trg-businessbay-04",
    neighborhood: "Business Bay",
    title: {
      fr: "Studio moderne avec cuisine equipee et vue canal",
      en: "Modern studio with fitted kitchen and canal view",
    },
    description: {
      fr: "Un studio efficace pour une premiere installation a Dubai, dans une tour recente et bien connectee.",
      en: "An efficient studio for a first Dubai move in a recent tower with strong connectivity.",
    },
    monthly: 7200,
    annual: 86400,
    bedrooms: 0,
    bathrooms: 1,
    size: 46,
    capacity: 2,
    rating: 4.8,
    amenities: ["pool", "kitchen", "gym"],
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "trg-barsha-05",
    neighborhood: "Al Barsha",
    title: {
      fr: "Appartement 1 chambre proche Mall of the Emirates",
      en: "1-bedroom apartment near Mall of the Emirates",
    },
    description: {
      fr: "Une location pratique pour un quotidien simple avec commerces, acces metro et balcon prive.",
      en: "A practical rental for easy daily living with shops, metro access and a private balcony.",
    },
    monthly: 7600,
    annual: 91200,
    bedrooms: 1,
    bathrooms: 2,
    size: 74,
    capacity: 2,
    rating: 4.85,
    amenities: ["kitchen", "pets", "balcony"],
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "trg-hills-06",
    neighborhood: "Dubai Hills",
    title: {
      fr: "Grand appartement 3 chambres a Dubai Hills",
      en: "Large 3-bedroom apartment in Dubai Hills",
    },
    description: {
      fr: "Une residence recente avec grande cuisine, salle de sport, piscine et cadre residentiel premium.",
      en: "A recent residence with a large kitchen, gym, pool and a premium residential setting.",
    },
    monthly: 14800,
    annual: 177600,
    bedrooms: 3,
    bathrooms: 3,
    size: 164,
    capacity: 6,
    rating: 4.95,
    amenities: ["pool", "kitchen", "gym", "pets", "balcony"],
    image:
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80",
  },
];

const amenityKeys = ["pool", "kitchen", "gym", "pets", "balcony"];

const state = {
  lang: "fr",
  guests: 1,
  location: "all",
  checkIn: "",
  checkOut: "",
  amenities: new Set(),
};

const titleElement = document.querySelector("title");
const menuToggle = document.getElementById("menuToggle");
const menuPanel = document.getElementById("menuPanel");
const langButtons = document.querySelectorAll(".lang-button");
const checkInTrigger = document.getElementById("checkInTrigger");
const checkOutTrigger = document.getElementById("checkOutTrigger");
const checkInInput = document.getElementById("checkInInput");
const checkOutInput = document.getElementById("checkOutInput");
const checkInValue = document.getElementById("checkInValue");
const checkOutValue = document.getElementById("checkOutValue");
const locationSelect = document.getElementById("locationSelect");
const guestCountValue = document.getElementById("guestCountValue");
const searchForm = document.getElementById("searchForm");
const amenityGrid = document.getElementById("amenityGrid");
const listingGrid = document.getElementById("listingGrid");
const resultsSummary = document.getElementById("resultsSummary");
const footerWhatsapp = document.getElementById("footerWhatsapp");
const floatingWhatsapp = document.getElementById("floatingWhatsapp");

function t(key) {
  return translations[state.lang][key];
}

function getLocale() {
  return state.lang === "fr" ? "fr-FR" : "en-GB";
}

function formatAed(value) {
  const formatted = new Intl.NumberFormat(getLocale()).format(value);
  return state.lang === "fr" ? `${formatted} AED` : `AED ${formatted}`;
}

function formatRating(value) {
  return value.toFixed(2);
}

function formatDate(value) {
  if (!value) {
    return t("date_placeholder");
  }

  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat(getLocale(), {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function replaceTokens(template, values) {
  return Object.entries(values).reduce((output, [token, value]) => {
    return output.replaceAll(`{${token}}`, value);
  }, template);
}

function getLocations() {
  return [...new Set(listings.map((listing) => listing.neighborhood))];
}

function getBedroomLabel(value) {
  return value === 0 ? "Studio" : String(value);
}

function getAmenityLabel(value) {
  return t(`amenity_${value}`);
}

function getTodayString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = `${today.getMonth() + 1}`.padStart(2, "0");
  const day = `${today.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function openDatePicker(input) {
  try {
    if (typeof input.showPicker === "function") {
      input.showPicker();
      return;
    }
  } catch (error) {
    // Fallback below for browsers without working showPicker support.
  }

  input.focus({ preventScroll: true });
  input.click();
}

function updateDateDisplay(input, target) {
  const hasValue = Boolean(input.value);
  target.textContent = formatDate(input.value);
  target.classList.toggle("is-placeholder", !hasValue);
}

function syncDateLimits() {
  checkInInput.min = getTodayString();
  checkOutInput.min = state.checkIn || getTodayString();

  if (state.checkIn && state.checkOut && state.checkOut < state.checkIn) {
    state.checkOut = "";
    checkOutInput.value = "";
  }
}

function applyStaticTranslations() {
  document.documentElement.lang = state.lang;
  titleElement.textContent = t("page_title");

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (translations[state.lang][key]) {
      element.textContent = t(key);
    }
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    const key = element.dataset.i18nAriaLabel;
    if (translations[state.lang][key]) {
      element.setAttribute("aria-label", t(key));
    }
  });
}

function renderLanguageButtons() {
  langButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.lang === state.lang);
  });
}

function renderLocationOptions() {
  locationSelect.innerHTML = [
    `<option value="all">${t("all_locations")}</option>`,
    ...getLocations().map(
      (location) => `<option value="${location}">${location}</option>`
    ),
  ].join("");

  locationSelect.value = state.location;
  locationSelect.classList.toggle("is-placeholder", state.location === "all");
}

function renderAmenityFilters() {
  amenityGrid.innerHTML = amenityKeys
    .map((key) => {
      const checked = state.amenities.has(key) ? "checked" : "";
      return `
        <label class="amenity-chip">
          <input type="checkbox" value="${key}" ${checked} />
          <span class="amenity-face">
            <span class="amenity-box" aria-hidden="true"></span>
            <span>${t(`amenity_${key}`)}</span>
          </span>
        </label>
      `;
    })
    .join("");

  amenityGrid.querySelectorAll("input").forEach((input) => {
    input.addEventListener("change", () => {
      if (input.checked) {
        state.amenities.add(input.value);
      } else {
        state.amenities.delete(input.value);
      }
      renderListings();
      updateWhatsappLinks();
    });
  });
}

function buildSummary(count) {
  if (state.location === "all" && state.guests === 1) {
    return replaceTokens(t("summary_all"), { count: String(count) });
  }

  const locationLabel =
    state.location === "all" ? "Dubai" : state.location;

  return replaceTokens(t("summary_filtered"), {
    count: String(count),
    location: locationLabel,
    guests: String(state.guests),
  });
}

function buildWhatsappMessage(listingTitle = "") {
  const details = [];

  if (state.location !== "all") {
    details.push(state.location);
  }

  details.push(`${state.guests} ${t("fact_capacity")}`);

  if (state.checkIn) {
    details.push(`${t("check_in")}: ${formatDate(state.checkIn)}`);
  }

  if (state.checkOut) {
    details.push(`${t("check_out")}: ${formatDate(state.checkOut)}`);
  }

  const requestedItem = listingTitle ? ` ${listingTitle}.` : " un appartement a Dubai.";
  const searchContext = details.length ? ` ${details.join(" | ")}.` : "";

  return `${t("whatsapp_intro")}${requestedItem}${searchContext} ${t("whatsapp_suffix")}`.trim();
}

function updateWhatsappLinks() {
  const genericMessage = encodeURIComponent(buildWhatsappMessage());
  footerWhatsapp.href = `https://wa.me/971543338520?text=${genericMessage}`;
  floatingWhatsapp.href = `https://wa.me/971543338520?text=${genericMessage}`;
}

function getFilteredListings() {
  return listings.filter((listing) => {
    const locationMatch =
      state.location === "all" || listing.neighborhood === state.location;
    const capacityMatch = listing.capacity >= state.guests;
    const amenityMatch = [...state.amenities].every((amenity) =>
      listing.amenities.includes(amenity)
    );

    return locationMatch && capacityMatch && amenityMatch;
  });
}

function renderListings() {
  const filteredListings = getFilteredListings();
  resultsSummary.textContent = buildSummary(filteredListings.length);

  if (!filteredListings.length) {
    listingGrid.innerHTML = `
      <article class="empty-state">
        <h3>${t("empty_title")}</h3>
        <p>${t("empty_text")}</p>
      </article>
    `;
    return;
  }

  listingGrid.innerHTML = filteredListings
    .map((listing) => {
      const whatsappLink = `https://wa.me/971543338520?text=${encodeURIComponent(
        buildWhatsappMessage(listing.title[state.lang])
      )}`;
      const metaSummary = [
        `${listing.capacity} ${t("fact_capacity")}`,
        `${getBedroomLabel(listing.bedrooms)} ${t("fact_bedrooms")}`,
        `${listing.bathrooms} ${t("fact_bathrooms")}`,
      ].join(" • ");
      const amenityChips = listing.amenities
        .slice(0, 3)
        .map((amenity) => `<span class="meta-pill">${getAmenityLabel(amenity)}</span>`)
        .join("");
      const ratingText = replaceTokens(t("listing_badge"), {
        rating: formatRating(listing.rating),
      });

      return `
        <article class="listing-card">
          <div class="listing-media">
            <img src="${listing.image}" alt="${listing.title[state.lang]}" loading="lazy" />
            <span class="listing-badge">${ratingText}</span>
            <div class="listing-dots" aria-hidden="true">
              <span></span>
              <span class="is-active"></span>
              <span></span>
            </div>
          </div>

          <div class="listing-body">
            <h3>${listing.title[state.lang]}</h3>
            <p class="listing-summary">${metaSummary}</p>
            <p class="listing-price-line">${formatAed(listing.monthly)} ${t("listing_month")}</p>

            <div class="listing-meta">
              ${amenityChips}
            </div>

            <div class="listing-actions">
              <span class="listing-secondary">${t("details_label")}</span>
              <a class="listing-cta" href="${whatsappLink}" target="_blank" rel="noreferrer">
                ${t("whatsapp")}
              </a>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderGuests() {
  guestCountValue.textContent = String(state.guests);
}

function renderDates() {
  updateDateDisplay(checkInInput, checkInValue);
  updateDateDisplay(checkOutInput, checkOutValue);
}

function renderAll() {
  applyStaticTranslations();
  renderLanguageButtons();
  renderLocationOptions();
  renderAmenityFilters();
  renderGuests();
  syncDateLimits();
  renderDates();
  renderListings();
  updateWhatsappLinks();
}

function toggleMenu(forceState) {
  const shouldOpen = typeof forceState === "boolean" ? forceState : menuPanel.hidden;
  menuPanel.hidden = !shouldOpen;
  menuToggle.setAttribute("aria-expanded", String(shouldOpen));
}

menuToggle.addEventListener("click", () => {
  toggleMenu();
});

checkInTrigger.addEventListener("click", () => {
  openDatePicker(checkInInput);
});

checkOutTrigger.addEventListener("click", () => {
  openDatePicker(checkOutInput);
});

document.addEventListener("click", (event) => {
  if (
    !menuPanel.hidden &&
    !menuPanel.contains(event.target) &&
    !menuToggle.contains(event.target)
  ) {
    toggleMenu(false);
  }
});

document.querySelectorAll(".menu-links a").forEach((link) => {
  link.addEventListener("click", () => toggleMenu(false));
});

langButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.lang = button.dataset.lang;
    renderAll();
  });
});

document.querySelectorAll("[data-guest-step]").forEach((button) => {
  button.addEventListener("click", () => {
    const nextValue = state.guests + Number(button.dataset.guestStep);
    state.guests = Math.min(8, Math.max(1, nextValue));
    renderGuests();
    renderListings();
    updateWhatsappLinks();
  });
});

checkInInput.addEventListener("change", () => {
  state.checkIn = checkInInput.value;
  syncDateLimits();
  renderDates();
  updateWhatsappLinks();
});

checkOutInput.addEventListener("change", () => {
  state.checkOut = checkOutInput.value;
  renderDates();
  updateWhatsappLinks();
});

locationSelect.addEventListener("change", () => {
  state.location = locationSelect.value;
  locationSelect.classList.toggle("is-placeholder", state.location === "all");
  renderListings();
  updateWhatsappLinks();
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  renderListings();
  updateWhatsappLinks();
  document.getElementById("apartments").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !menuPanel.hidden) {
    toggleMenu(false);
  }
});

renderAll();
