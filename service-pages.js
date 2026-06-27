const serviceMenuToggle = document.getElementById("menuToggle");
const serviceMenuPanel = document.getElementById("menuPanel");

function toggleServiceMenu(forceState) {
  if (!serviceMenuToggle || !serviceMenuPanel) {
    return;
  }

  const shouldOpen =
    typeof forceState === "boolean" ? forceState : serviceMenuPanel.hidden;
  serviceMenuPanel.hidden = !shouldOpen;
  serviceMenuToggle.setAttribute("aria-expanded", String(shouldOpen));
}

if (serviceMenuToggle && serviceMenuPanel) {
  serviceMenuToggle.addEventListener("click", () => {
    toggleServiceMenu();
  });

  document.addEventListener("click", (event) => {
    if (
      !serviceMenuPanel.hidden &&
      !serviceMenuPanel.contains(event.target) &&
      !serviceMenuToggle.contains(event.target)
    ) {
      toggleServiceMenu(false);
    }
  });
}

function getTodayString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = `${today.getMonth() + 1}`.padStart(2, "0");
  const day = `${today.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

document.querySelectorAll('input[type="date"]').forEach((input) => {
  if (!input.min) {
    input.min = getTodayString();
  }
});

document.querySelectorAll("[data-file-input]").forEach((input) => {
  input.addEventListener("change", () => {
    const summary = document.querySelector(`[data-file-summary="${input.name}"]`);

    if (!summary) {
      return;
    }

    const names = Array.from(input.files || [])
      .map((file) => file.name)
      .join(", ");

    summary.textContent = names || "Aucun fichier selectionne";
  });
});

document.querySelectorAll("[data-service-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const feedback = form.querySelector("[data-form-feedback]");
    const intro = form.dataset.whatsappIntro || "Bonjour TERANGA, voici ma demande.";
    const success =
      form.dataset.success ||
      "Votre demande est prete. La conversation WhatsApp va s'ouvrir pour la finalisation.";
    const requestType = form.dataset.requestType || "other";

    const lines = [];
    const data = {};

    form.querySelectorAll("[data-label]").forEach((field) => {
      const label = field.dataset.label;

      if (field.type === "file") {
        const fileNames = Array.from(field.files || [])
          .map((file) => file.name)
          .join(", ");

        if (fileNames) {
          lines.push(`- ${label}: ${fileNames}`);
          data[field.name] = fileNames;
        }
        return;
      }

      if ((field.type === "checkbox" || field.type === "radio") && !field.checked) {
        return;
      }

      const value = (field.value || "").trim();
      if (value) {
        lines.push(`- ${label}: ${value}`);
        data[field.name] = value;
      }
    });

    if (window.terangaStore?.addRequest) {
      window.terangaStore.addRequest({
        type: requestType,
        title: intro,
        fields: lines,
        data,
      });
    }

    const message = `${intro}\n${lines.join("\n")}\nMerci.`;
    const whatsappUrl = `https://wa.me/971528876133?text=${encodeURIComponent(message)}`;

    if (feedback) {
      feedback.textContent = success;
    }

    window.open(whatsappUrl, "_blank", "noopener");
  });
});
