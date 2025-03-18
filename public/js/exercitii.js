document.addEventListener("DOMContentLoaded", () => {
    const exercises = {
        // Dribling
        dribling1: { title: "Dribling cu mâna slabă", description: "Exersează driblingul doar cu mâna pe care o folosești mai puțin.", video: "https://www.youtube.com/embed/EXEMPLU_VIDEO_1" },
        dribling2: { title: "Dribling în regim de viteză", description: "Aleargă și menține controlul mingii la viteză mare.", video: "https://www.youtube.com/embed/EXEMPLU_VIDEO_2" },
        dribling3: { title: "Dribling între picioare", description: "Exersează trecerea mingii printre picioare pentru a îmbunătăți controlul.", video: "https://www.youtube.com/embed/EXEMPLU_VIDEO_3" },

        // Aruncări
        aruncari1: { title: "Aruncare liberă", description: "Îmbunătățește-ți precizia aruncărilor de la linia de libere.", video: "https://www.youtube.com/embed/EXEMPLU_VIDEO_4" },
        aruncari2: { title: "Aruncare de la distanță", description: "Exersează aruncările de 3 puncte pentru a crește eficiența.", video: "https://www.youtube.com/embed/EXEMPLU_VIDEO_5" },
        aruncari3: { title: "Aruncare în mișcare", description: "Îmbunătățește-ți coordonarea și precizia în aruncările în mișcare.", video: "https://www.youtube.com/embed/EXEMPLU_VIDEO_6" },

        // Apărare
        aparare1: { title: "Apărare 1v1", description: "Îmbunătățește-ți abilitățile de apărare în duelurile individuale.", video: "https://www.youtube.com/embed/EXEMPLU_VIDEO_7" },
        aparare2: { title: "Apărare zonală", description: "Antrenează-te pentru a înțelege și aplica apărarea zonală.", video: "https://www.youtube.com/embed/EXEMPLU_VIDEO_8" },
        aparare3: { title: "Apărare la recuperare", description: "Îmbunătățește-ți viteza de reacție la recuperările defensive.", video: "https://www.youtube.com/embed/EXEMPLU_VIDEO_9" },

        // Condiție fizică
        conditie1: { title: "Sprinturi scurte", description: "Îmbunătățește-ți viteza și explozia prin sprinturi de 10-20m.", video: "https://www.youtube.com/embed/EXEMPLU_VIDEO_10" },
        conditie2: { title: "Exerciții de forță", description: "Antrenează-ți mușchii esențiali pentru baschet prin exerciții de forță.", video: "https://www.youtube.com/embed/EXEMPLU_VIDEO_11" },
        conditie3: { title: "Exerciții de rezistență", description: "Îmbunătățește-ți rezistența pentru meciuri lungi.", video: "https://www.youtube.com/embed/EXEMPLU_VIDEO_12" }
    };

    const buttons = document.querySelectorAll(".exercise-btn");
    const detailsSection = document.getElementById("exercise-details");
    const titleElement = document.getElementById("exercise-title");
    const descriptionElement = document.getElementById("exercise-description");
    const videoElement = document.getElementById("exercise-video");
    const closeButton = document.getElementById("close-exercise");
    const checkboxesContainer = document.getElementById("exercise-checkbox-container");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const exerciseKey = button.dataset.exercise;
            const exercise = exercises[exerciseKey];

            if (!exercise) {
                console.error("Exercițiul nu există:", exerciseKey);
                return;
            }

            titleElement.textContent = exercise.title;
            descriptionElement.textContent = exercise.description;
            videoElement.src = exercise.video;
            detailsSection.classList.remove("hidden");

            checkboxesContainer.innerHTML = "";
            const label = document.createElement("label");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.dataset.exercise = exerciseKey;

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(" Am finalizat acest exercițiu"));
            checkboxesContainer.appendChild(label);

            loadCheckboxState(checkbox, exerciseKey);

            checkbox.addEventListener("change", () => {
                saveProgress(checkbox, exerciseKey);
            });
        });
    });

    closeButton.addEventListener("click", () => {
        detailsSection.classList.add("hidden");
        videoElement.src = "";
    });

    function loadCheckboxState(checkbox, exerciseKey) {
        const progres = JSON.parse(localStorage.getItem("progres")) || {};
        checkbox.checked = progres[exerciseKey] || false;
        updateProgressDisplay();
    }

    function saveProgress(checkbox, exerciseKey) {
        let progres = JSON.parse(localStorage.getItem("progres")) || {};
        progres[exerciseKey] = checkbox.checked;
        localStorage.setItem("progres", JSON.stringify(progres));

        updateProgressDisplay();
    }

    function updateProgressDisplay() {
        const progres = JSON.parse(localStorage.getItem("progres")) || {};
        const checkedCount = Object.values(progres).filter(val => val).length;
        const total = Object.keys(exercises).length;
        const progress = total > 0 ? Math.round((checkedCount / total) * 100) : 0;

        document.getElementById("progress-percentage").textContent = `${progress}%`;
    }

    updateProgressDisplay();
});
