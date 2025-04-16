document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("dark-mode-toggle");
  const body = document.body;

  if (!toggleButton) {
    console.error("Butonul dark-mode nu a fost găsit.");
    return;
  }

  // Setează starea inițială a dark mode din localStorage
  const darkMode = localStorage.getItem("darkMode");
  if (darkMode === "enabled") {
    body.classList.add("dark-mode");
    toggleButton.textContent = "☀️";
  } else {
    toggleButton.textContent = "🌙";
  }

  // Adaugă un singur event listener pentru toggle
  toggleButton.addEventListener("click", () => {
    const isDark = body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
    toggleButton.textContent = isDark ? "☀️" : "🌙";
    console.log("Clasa dark-mode aplicată:", isDark);
  });
});