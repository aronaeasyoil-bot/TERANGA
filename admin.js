const menuToggle = document.getElementById("menuToggle");
const menuPanel = document.getElementById("menuPanel");
const adminAccessForm = document.getElementById("adminAccessForm");
const adminCodeInput = document.getElementById("adminCodeInput");
const adminAccessFeedback = document.getElementById("adminAccessFeedback");
const adminLoginCard = document.getElementById("adminLoginCard");
const adminDashboard = document.getElementById("adminDashboard");

const listingForm = document.getElementById("listingForm");
const listingIdInput = document.getElementById("listingIdInput");
const titleFrInput = document.getElementById("titleFrInput");
const titleEnInput = document.getElementById("titleEnInput");
const neighborhoodInput = document.getElementById("neighborhoodInput");
const monthlyInput = document.getElementById("monthlyInput");
const annualInput = document.getElementById("annualInput");
const ratingInput = document.getElementById("ratingInput");
const bedroomsInput = document.getElementById("bedroomsInput");
const bathroomsInput = document.getElementById("bathroomsInput");
const sizeInput = document.getElementById("sizeInput");
const capacityInput = document.getElementById("capacityInput");
const imageUrlInput = document.getElementById("imageUrlInput");
const imageFileInput = document.getElementById("imageFileInput");
const imageFileSummary = document.getElementById("imageFileSummary");
const descriptionFrInput = document.getElementById("descriptionFrInput");
const descriptionEnInput = document.getElementById("descriptionEnInput");
const activeInput = document.getElementById("activeInput");
const amenityInputs = document.querySelectorAll("[data-amenity]");
const resetListingButton = document.getElementById("resetListingButton");
const listingFeedback = document.getElementById("listingFeedback");
const listingAdminList = document.getElementById("listingAdminList");
const requestList = document.getElementById("requestList");
const requestFilterRow = document.getElementById("requestFilterRow");

const statListings = document.getElementById("statListings");
const statVisa = document.getElementById("statVisa");
const statFlights = document.getElementById("statFlights");
const statFood = document.getElementById("statFood");

const ADMIN_SESSION_KEY = "teranga_admin_unlocked_v1";

const adminState = {
  requestFilter: "all",
};

function toggleMenu(forceState) {
  if (!menuToggle || !menuPanel) {
    return;
  }

  const shouldOpen = typeof forceState === "boolean" ? forceState : menuPanel.hidden;
  menuPanel.hidden = !shouldOpen;
  menuToggle.setAttribute("aria-expanded", String(shouldOpen));
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getAmenityValues() {
  return Array.from(amenityInputs)
    .filter((input) => input.checked)
    .map((input) => input.value);
}

function resetListingForm() {
  listingForm.reset();
  listingIdInput.value = "";
  ratingInput.value = "4.90";
  bedroomsInput.value = "1";
  bathroomsInput.value = "1";
  sizeInput.value = "50";
  capacityInput.value = "2";
  activeInput.checked = true;
  amenityInputs.forEach((input) => {
    input.checked = false;
  });
  imageFileSummary.textContent = "Aucun fichier selectionne";
  listingFeedback.textContent = "";
}

function populateListingForm(listing) {
  listingIdInput.value = listing.id;
  titleFrInput.value = listing.title.fr;
  titleEnInput.value = listing.title.en;
  neighborhoodInput.value = listing.neighborhood;
  monthlyInput.value = listing.monthly;
  annualInput.value = listing.annual;
  ratingInput.value = listing.rating.toFixed(2);
  bedroomsInput.value = listing.bedrooms;
  bathroomsInput.value = listing.bathrooms;
  sizeInput.value = listing.size;
  capacityInput.value = listing.capacity;
  imageUrlInput.value = listing.image.startsWith("data:") ? "" : listing.image;
  descriptionFrInput.value = listing.description.fr;
  descriptionEnInput.value = listing.description.en;
  activeInput.checked = listing.active !== false;
  amenityInputs.forEach((input) => {
    input.checked = listing.amenities.includes(input.value);
  });
  imageFileInput.value = "";
  imageFileSummary.textContent = listing.image ? "Image actuelle conservee" : "Aucun fichier selectionne";
  listingFeedback.textContent = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Impossible de lire l'image."));
    reader.readAsDataURL(file);
  });
}

function renderStats() {
  const stats = window.terangaStore.getStats();
  statListings.textContent = String(stats.listings);
  statVisa.textContent = String(stats.visa);
  statFlights.textContent = String(stats.flights);
  statFood.textContent = String(stats.food);
}

function renderListingsAdmin() {
  const listings = window.terangaStore.loadListings();

  if (!listings.length) {
    listingAdminList.innerHTML = `
      <article class="admin-empty">
        <strong>Aucun appartement pour le moment.</strong>
      </article>
    `;
    return;
  }

  listingAdminList.innerHTML = listings
    .map((listing) => {
      const statusClass = listing.active !== false ? "is-success" : "is-muted";
      const statusLabel = listing.active !== false ? "Actif" : "Masque";
      return `
        <article class="admin-listing-item">
          <div class="admin-listing-media">
            <img src="${escapeHtml(listing.image)}" alt="${escapeHtml(listing.title.fr)}" />
          </div>
          <div class="admin-listing-body">
            <div class="admin-listing-head">
              <div>
                <h3>${escapeHtml(listing.title.fr)}</h3>
                <p>${escapeHtml(listing.neighborhood)}, Dubai</p>
              </div>
              <span class="admin-chip ${statusClass}">${statusLabel}</span>
            </div>

            <div class="admin-inline-meta">
              <span class="admin-chip">${listing.monthly} AED / mois</span>
              <span class="admin-chip">${listing.bedrooms} ch.</span>
              <span class="admin-chip">${listing.bathrooms} sdb</span>
              <span class="admin-chip">${listing.capacity} pers.</span>
            </div>

            <div class="admin-actions-row">
              <button class="admin-button-secondary" type="button" data-action="edit-listing" data-id="${listing.id}">
                Modifier
              </button>
              <button class="admin-button-secondary" type="button" data-action="toggle-listing" data-id="${listing.id}">
                ${listing.active !== false ? "Masquer" : "Activer"}
              </button>
              <button class="admin-button-danger" type="button" data-action="delete-listing" data-id="${listing.id}">
                Supprimer
              </button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function getRequestTypeLabel(type) {
  switch (type) {
    case "visa":
      return "Visa";
    case "flight":
      return "Billet";
    case "food":
      return "Plat";
    default:
      return "Demande";
  }
}

function renderRequests() {
  const requests = window.terangaStore
    .loadRequests()
    .filter((request) => adminState.requestFilter === "all" || request.type === adminState.requestFilter);

  if (!requests.length) {
    requestList.innerHTML = `
      <article class="admin-empty">
        <strong>Aucune demande dans cette categorie.</strong>
      </article>
    `;
    return;
  }

  requestList.innerHTML = requests
    .map((request) => {
      const statusClass = request.status === "done" ? "is-success" : "is-warning";
      const statusLabel = request.status === "done" ? "Traitee" : "Nouvelle";
      const fieldsMarkup = request.fields
        .map((field) => `<li>${escapeHtml(field)}</li>`)
        .join("");

      return `
        <article class="admin-request-item">
          <div class="admin-listing-head">
            <div>
              <h3>${escapeHtml(getRequestTypeLabel(request.type))}</h3>
              <p>${escapeHtml(formatDateTime(request.createdAt))}</p>
            </div>
            <div class="admin-inline-meta">
              <span class="admin-chip">${escapeHtml(getRequestTypeLabel(request.type))}</span>
              <span class="admin-chip ${statusClass}">${statusLabel}</span>
            </div>
          </div>

          <ul class="admin-request-fields">
            ${fieldsMarkup}
          </ul>

          <div class="admin-actions-row">
            <button class="admin-button-secondary" type="button" data-action="toggle-request" data-id="${request.id}">
              ${request.status === "done" ? "Remettre en nouvelle" : "Marquer traitee"}
            </button>
            <button class="admin-button-danger" type="button" data-action="delete-request" data-id="${request.id}">
              Supprimer
            </button>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderAdmin() {
  renderStats();
  renderListingsAdmin();
  renderRequests();
}

function unlockAdmin() {
  sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
  adminLoginCard.hidden = true;
  adminDashboard.hidden = false;
  renderAdmin();
}

if (menuToggle && menuPanel) {
  menuToggle.addEventListener("click", () => {
    toggleMenu();
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
    link.addEventListener("click", () => {
      toggleMenu(false);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !menuPanel.hidden) {
      toggleMenu(false);
    }
  });
}

if (sessionStorage.getItem(ADMIN_SESSION_KEY) === "1") {
  unlockAdmin();
}

adminAccessForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const enteredCode = adminCodeInput.value.trim();
  const adminCode = window.terangaStore.getAdminCode();

  if (enteredCode !== adminCode) {
    adminAccessFeedback.textContent = "Code incorrect. Reessayez.";
    return;
  }

  adminAccessFeedback.textContent = "";
  adminCodeInput.value = "";
  unlockAdmin();
});

imageFileInput.addEventListener("change", () => {
  const file = imageFileInput.files?.[0];
  imageFileSummary.textContent = file ? file.name : "Aucun fichier selectionne";
});

resetListingButton.addEventListener("click", resetListingForm);

listingForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const existingId = listingIdInput.value.trim();
  const existingListing = existingId
    ? window.terangaStore.loadListings().find((listing) => listing.id === existingId)
    : null;

  let image = existingListing?.image || "";

  if (imageFileInput.files?.[0]) {
    image = await readFileAsDataUrl(imageFileInput.files[0]);
  } else if (imageUrlInput.value.trim()) {
    image = imageUrlInput.value.trim();
  }

  const monthly = Number(monthlyInput.value) || 0;
  const annual = Number(annualInput.value) || monthly * 12;

  try {
    window.terangaStore.upsertListing({
      id: existingId || `trg-${Date.now()}`,
      neighborhood: neighborhoodInput.value.trim(),
      title: {
        fr: titleFrInput.value.trim(),
        en: titleEnInput.value.trim(),
      },
      description: {
        fr: descriptionFrInput.value.trim() || titleFrInput.value.trim(),
        en: descriptionEnInput.value.trim() || titleEnInput.value.trim(),
      },
      monthly,
      annual,
      bedrooms: Number(bedroomsInput.value) || 0,
      bathrooms: Number(bathroomsInput.value) || 1,
      size: Number(sizeInput.value) || 0,
      capacity: Number(capacityInput.value) || 1,
      rating: Number(ratingInput.value) || 4.9,
      amenities: getAmenityValues(),
      image,
      active: activeInput.checked,
      createdAt: existingListing?.createdAt || new Date().toISOString(),
    });

    listingFeedback.textContent = existingId
      ? "Appartement mis a jour avec succes."
      : "Nouvel appartement enregistre avec succes.";

    renderAdmin();
    resetListingForm();
  } catch (error) {
    listingFeedback.textContent =
      "Impossible d'enregistrer cette annonce. Essayez une image plus legere ou utilisez une URL.";
  }
});

listingAdminList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  const action = button.dataset.action;
  const listingId = button.dataset.id;
  const listing = window.terangaStore.loadListings().find((item) => item.id === listingId);

  if (!listing) {
    return;
  }

  if (action === "edit-listing") {
    populateListingForm(listing);
    return;
  }

  if (action === "toggle-listing") {
    window.terangaStore.upsertListing({ ...listing, active: listing.active === false });
    renderAdmin();
    return;
  }

  if (action === "delete-listing") {
    window.terangaStore.deleteListing(listingId);
    renderAdmin();
    return;
  }
});

requestFilterRow.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-filter]");
  if (!button) {
    return;
  }

  adminState.requestFilter = button.dataset.filter;
  requestFilterRow.querySelectorAll("button").forEach((item) => {
    item.classList.toggle("is-active", item === button);
  });
  renderRequests();
});

requestList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  const requestId = button.dataset.id;
  const request = window.terangaStore.loadRequests().find((item) => item.id === requestId);

  if (!request) {
    return;
  }

  if (button.dataset.action === "toggle-request") {
    window.terangaStore.updateRequest(requestId, {
      status: request.status === "done" ? "new" : "done",
    });
    renderAdmin();
    return;
  }

  if (button.dataset.action === "delete-request") {
    window.terangaStore.deleteRequest(requestId);
    renderAdmin();
  }
});

window.addEventListener("storage", (event) => {
  if (event.key && !event.key.startsWith("teranga_")) {
    return;
  }

  if (!adminDashboard.hidden) {
    renderAdmin();
  }
});

resetListingForm();
