document.addEventListener("DOMContentLoaded", () => {
    const exercises = {
        // Dribling
        dribling1: {
            title: "Dribling cu mâna slabă",
            description: "Exersează driblingul doar cu mâna pe care o folosești mai puțin pentru a deveni mai echilibrat.",
            video: "https://www.youtube.com/embed/EXEMPLU_VIDEO_1"
        },
        dribling2: {
            title: "Dribling în regim de viteză",
            description: "Aleargă și menține controlul mingii la viteză mare.",
            video: "https://www.youtube.com/embed/EXEMPLU_VIDEO_2"
        },
        dribling3: {
            title: "Dribling între picioare",
            description: "Exersează trecerea mingii printre picioare pentru a îmbunătăți controlul.",
            video: "https://www.youtube.com/embed/EXEMPLU_VIDEO_3"
        },

        // Aruncări
        aruncari1: {
            title: "Aruncare liberă",
            description: "Exersează aruncarea de la linia de aruncări libere cu o tehnică corectă.",
            video: "https://www.youtube.com/embed/EXEMPLU_VIDEO_4"
        },
        aruncari2: {
            title: "Aruncare de la distanță",
            description: "Îmbunătățește precizia aruncărilor de la 3 puncte.",
            video: "https://www.youtube.com/embed/EXEMPLU_VIDEO_5"
        },
        aruncari3: {
            title: "Aruncare în mișcare",
            description: "Exersează aruncările rapide în tranziție.",
            video: "https://www.youtube.com/embed/EXEMPLU_VIDEO_6"
        },

        // Apărare
        aparare1: {
            title: "Apărare 1v1",
            description: "Exersează poziționarea corectă în apărare individuală.",
            video: "https://www.youtube.com/embed/EXEMPLU_VIDEO_7"
        },
        aparare2: {
            title: "Apărare zonală",
            description: "Îmbunătățește-ți deplasarea defensivă în apărarea zonală.",
            video: "https://www.youtube.com/embed/EXEMPLU_VIDEO_8"
        },
        aparare3: {
            title: "Apărare la recuperare",
            description: "Antrenează-te pentru a câștiga duelurile pentru recuperare.",
            video: "https://www.youtube.com/embed/EXEMPLU_VIDEO_9"
        },

        // Condiție fizică
        conditie1: {
            title: "Sprinturi scurte",
            description: "Îmbunătățește viteza și explozia prin sprinturi de 10-20m.",
            video: "https://www.youtube.com/embed/EXEMPLU_VIDEO_10"
        },
        conditie2: {
            title: "Exerciții de forță",
            description: "Antrenează-ți mușchii esențiali pentru baschet prin exerciții de forță.",
            video: "https://www.youtube.com/embed/EXEMPLU_VIDEO_11"
        },
        conditie3: {
            title: "Exerciții de rezistență",
            description: "Îmbunătățește-ți rezistența pentru meciuri lungi.",
            video: "https://www.youtube.com/embed/EXEMPLU_VIDEO_12"
        }
    };

    const buttons = document.querySelectorAll(".exercise-btn");
    const detailsSection = document.getElementById("exercise-details");
    const titleElement = document.getElementById("exercise-title");
    const descriptionElement = document.getElementById("exercise-description");
    const videoElement = document.getElementById("exercise-video");
    const closeButton = document.getElementById("close-exercise");

    if (!detailsSection || !titleElement || !descriptionElement || !videoElement || !closeButton) {
        console.error("Unele elemente HTML lipsesc din pagină!");
        return;
    }

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const exerciseKey = button.dataset.exercise;
            const exercise = exercises[exerciseKey];

            if (!exercise) {
                console.error("Exercițiul nu există în obiect:", exerciseKey);
                return;
            }

            titleElement.textContent = exercise.title;
            descriptionElement.textContent = exercise.description;
            videoElement.src = exercise.video;
            detailsSection.classList.add("active");
        });
    });

    closeButton.addEventListener("click", () => {
        detailsSection.classList.remove("active");
        videoElement.src = "";
    });
});
