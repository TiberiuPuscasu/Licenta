document.addEventListener("DOMContentLoaded", () => {
    const categories = {
        dribling: ["dribling1", "dribling2", "dribling3"],
        aruncari: ["aruncari1", "aruncari2", "aruncari3"],
        aparare: ["aparare1", "aparare2", "aparare3"],
        conditie: ["conditie1", "conditie2", "conditie3"]
    };

    function updateDashboardProgress() {
        const progres = JSON.parse(localStorage.getItem("progres")) || {};

        Object.keys(categories).forEach(category => {
            const exercises = categories[category];
            const completedExercises = exercises.filter(ex => progres[ex]).length;
            const totalExercises = exercises.length;
            const progress = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;

            const progressElement = document.getElementById(`progress-${category}`);
            if (progressElement) {
                progressElement.value = progress;
            }
        });
    }

    updateDashboardProgress();

    const toggleButton = document.getElementById("dark-mode-toggle");
    const body = document.body;

    // Verifică preferința utilizatorului din localStorage
    const darkMode = localStorage.getItem("darkMode");
    if (darkMode === "enabled") {
        body.classList.add("dark-mode");
        toggleButton.textContent = "☀️ Light Mode";
    }

    // Comută între moduri
    toggleButton.addEventListener("click", () => {
        if (body.classList.contains("dark-mode")) {
            body.classList.remove("dark-mode");
            localStorage.setItem("darkMode", "disabled");
            toggleButton.textContent = "🌙 Dark Mode";
        } else {
            body.classList.add("dark-mode");
            localStorage.setItem("darkMode", "enabled");
            toggleButton.textContent = "☀️ Light Mode";
        }
    });
});
