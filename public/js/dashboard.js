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
});
