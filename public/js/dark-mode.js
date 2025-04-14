document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("dark-mode-toggle");
    const body = document.body;

    // Verifică dacă butonul există
    if (!toggleButton) {
        console.error("Butonul #dark-mode-toggle nu a fost găsit!");
        return;
    }

    console.log("Butonul #dark-mode-toggle a fost găsit!");

    // Verifică preferința utilizatorului din localStorage
    const darkMode = localStorage.getItem("darkMode");
    if (darkMode === "enabled") {
        body.classList.add("dark-mode");
        toggleButton.textContent = "☀️";
        console.log("Dark Mode este activat.");
    } else {
        console.log("Dark Mode este dezactivat.");
    }

    // Atașează evenimentul click
    toggleButton.addEventListener("click", () => {
        console.log("Butonul Dark Mode a fost apăsat.");
        if (body.classList.contains("dark-mode")) {
            body.classList.remove("dark-mode");
            localStorage.setItem("darkMode", "disabled");
            toggleButton.textContent = "🌙";
            console.log("Dark Mode a fost dezactivat.");
        } else {
            body.classList.add("dark-mode");
            localStorage.setItem("darkMode", "enabled");
            toggleButton.textContent = "☀️";
            console.log("Dark Mode a fost activat.");
        }
    });
});