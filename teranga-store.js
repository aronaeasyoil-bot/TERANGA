(function () {
  const LISTINGS_KEY = "teranga_listings_v1";
  const REQUESTS_KEY = "teranga_requests_v1";
  const ADMIN_CODE_KEY = "teranga_admin_code_v1";
  const DEFAULT_ADMIN_CODE = "TERANGA2026";
  const memoryStore = {};

  const defaultListings = [
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
      active: true,
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
      active: true,
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
      active: true,
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
      active: true,
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
      active: true,
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
      active: true,
    },
  ];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function readRaw(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return memoryStore[key] || null;
    }
  }

  function writeRaw(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      memoryStore[key] = value;
    }
  }

  function loadJson(key, fallback) {
    const raw = readRaw(key);
    if (!raw) {
      return clone(fallback);
    }

    try {
      return JSON.parse(raw);
    } catch (error) {
      return clone(fallback);
    }
  }

  function saveJson(key, value) {
    writeRaw(key, JSON.stringify(value));
  }

  function normalizeListing(listing, index) {
    const monthly = Number(listing.monthly) || 0;
    const annual = Number(listing.annual) || monthly * 12;
    const titleFr = listing.title?.fr || listing.titleFr || `Appartement ${index + 1}`;
    const titleEn = listing.title?.en || listing.titleEn || titleFr;
    const descriptionFr =
      listing.description?.fr || listing.descriptionFr || titleFr;
    const descriptionEn =
      listing.description?.en || listing.descriptionEn || titleEn;

    return {
      id: listing.id || `trg-${Date.now()}-${index}`,
      neighborhood: listing.neighborhood || "Dubai",
      title: {
        fr: titleFr,
        en: titleEn,
      },
      description: {
        fr: descriptionFr,
        en: descriptionEn,
      },
      monthly,
      annual,
      bedrooms: Number(listing.bedrooms) || 0,
      bathrooms: Number(listing.bathrooms) || 1,
      size: Number(listing.size) || 0,
      capacity: Number(listing.capacity) || 1,
      rating: Number(listing.rating) || 4.9,
      amenities: Array.isArray(listing.amenities) ? listing.amenities : [],
      image: listing.image || "",
      active: listing.active !== false,
      createdAt: listing.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  function loadListings() {
    const stored = loadJson(LISTINGS_KEY, []);
    const source = stored.length ? stored : defaultListings;
    return source.map(normalizeListing);
  }

  function saveListings(listings) {
    const normalized = listings.map(normalizeListing);
    saveJson(LISTINGS_KEY, normalized);
    return normalized;
  }

  function upsertListing(listing) {
    const listings = loadListings();
    const normalized = normalizeListing(listing, listings.length);
    const index = listings.findIndex((item) => item.id === normalized.id);

    if (index >= 0) {
      listings[index] = { ...listings[index], ...normalized, updatedAt: new Date().toISOString() };
    } else {
      listings.unshift(normalized);
    }

    return saveListings(listings);
  }

  function deleteListing(id) {
    const listings = loadListings().filter((listing) => listing.id !== id);
    return saveListings(listings);
  }

  function loadRequests() {
    const requests = loadJson(REQUESTS_KEY, []);
    return Array.isArray(requests)
      ? requests.sort((left, right) => right.createdAt.localeCompare(left.createdAt))
      : [];
  }

  function saveRequests(requests) {
    saveJson(REQUESTS_KEY, requests);
    return requests;
  }

  function addRequest(request) {
    const requests = loadRequests();
    const payload = {
      id: request.id || `req-${Date.now()}`,
      type: request.type || "other",
      status: request.status || "new",
      title: request.title || request.type || "request",
      fields: Array.isArray(request.fields) ? request.fields : [],
      data: request.data || {},
      createdAt: request.createdAt || new Date().toISOString(),
    };

    requests.unshift(payload);
    saveRequests(requests);
    return payload;
  }

  function updateRequest(id, patch) {
    const requests = loadRequests().map((request) =>
      request.id === id ? { ...request, ...patch } : request
    );

    return saveRequests(requests);
  }

  function deleteRequest(id) {
    return saveRequests(loadRequests().filter((request) => request.id !== id));
  }

  function getAdminCode() {
    return readRaw(ADMIN_CODE_KEY) || DEFAULT_ADMIN_CODE;
  }

  function setAdminCode(code) {
    writeRaw(ADMIN_CODE_KEY, code || DEFAULT_ADMIN_CODE);
  }

  function getStats() {
    const listings = loadListings();
    const requests = loadRequests();
    return {
      listings: listings.filter((listing) => listing.active !== false).length,
      allListings: listings.length,
      visa: requests.filter((request) => request.type === "visa").length,
      flights: requests.filter((request) => request.type === "flight").length,
      food: requests.filter((request) => request.type === "food").length,
      newRequests: requests.filter((request) => request.status !== "done").length,
    };
  }

  window.terangaStore = {
    defaultListings: clone(defaultListings),
    loadListings,
    saveListings,
    upsertListing,
    deleteListing,
    loadRequests,
    addRequest,
    updateRequest,
    deleteRequest,
    getStats,
    getAdminCode,
    setAdminCode,
  };
})();
