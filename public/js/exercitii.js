import { db } from "./firebase-config.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

const auth = getAuth();

// Salvarea progresului utilizatorului
export async function saveProgress(checkbox, exerciseKey, categorie) {
    console.log("Salvare progres:", { checkbox, exerciseKey, categorie });

    const user = auth.currentUser;
    if (!user) {
        console.error("Utilizatorul nu este autentificat!");
        return;
    }

    // Citește progresul local
    let progres = JSON.parse(localStorage.getItem("progres")) || {};
    if (!progres[categorie]) {
        progres[categorie] = {};
    }
    progres[categorie][exerciseKey] = checkbox.checked;

    // Salvează progresul local
    localStorage.setItem("progres", JSON.stringify(progres));

    // Salvează progresul în Firestore
    const userUID = user.uid;
    const progresRef = doc(db, "progres", userUID);

    // Citește progresul curent din Firestore
    const progresSnapshot = await getDoc(progresRef);
    let progresFirestore = progresSnapshot.exists() ? progresSnapshot.data() : {};

    // Actualizează progresul în Firestore
    progresFirestore[categorie] = { ...progresFirestore[categorie], ...progres[categorie] };
    await setDoc(progresRef, progresFirestore);

    console.log(`Progres salvat pentru utilizatorul ${userUID}:`, progresFirestore);

    // Actualizează afișarea progresului pentru categoria curentă
    updateProgressDisplay(categorie);
}

// Citirea progresului utilizatorului
export async function loadCheckboxState(categorie) {
    console.log("Încărcare progres pentru categorie:", categorie);

    const user = auth.currentUser;
    if (!user) {
        console.error("Utilizatorul nu este autentificat!");
        return;
    }

    const userUID = user.uid;
    const progresRef = doc(db, "progres", userUID);

    // Citește progresul din Firestore
    const progresSnapshot = await getDoc(progresRef);
    const progresFirestore = progresSnapshot.exists() ? progresSnapshot.data() : {};

    // Actualizează progresul local
    let progres = JSON.parse(localStorage.getItem("progres")) || {};
    progres[categorie] = progresFirestore[categorie] || {};
    localStorage.setItem("progres", JSON.stringify(progres));

    // Actualizează checkbox-urile
    const checkboxes = document.querySelectorAll(`input[type='checkbox'][id^='${categorie}']`);
    checkboxes.forEach((checkbox) => {
        checkbox.checked = progres[categorie][checkbox.id] || false;
    });

    // Actualizează afișarea progresului
    updateProgressDisplay(categorie);
}

// Actualizarea afișării progresului
function updateProgressDisplay(categorie) {
    // Selectează toate checkbox-urile din categoria curentă
    const checkboxes = document.querySelectorAll(`input[type='checkbox'][id^='${categorie}']`);
    const totalCheckboxes = checkboxes.length;

    // Numără checkbox-urile bifate
    const checkedCheckboxes = Array.from(checkboxes).filter(checkbox => checkbox.checked).length;

    // Calculează procentajul progresului
    const progressPercentage = totalCheckboxes > 0 ? Math.round((checkedCheckboxes / totalCheckboxes) * 100) : 0;

    // Actualizează elementul HTML care afișează progresul
    const progressElement = document.getElementById("progress-percentage");
    if (progressElement) {
        progressElement.textContent = `${progressPercentage}%`;
    }
}

// Calcularea progresului total pentru dashboard
export async function calculateTotalProgress() {
    const user = auth.currentUser;
    if (!user) {
        console.error("Utilizatorul nu este autentificat!");
        return 0;
    }

    const userUID = user.uid;
    const progresRef = doc(db, "progres", userUID);

    // Citește progresul din Firestore
    const progresSnapshot = await getDoc(progresRef);
    const progresFirestore = progresSnapshot.exists() ? progresSnapshot.data() : {};

    // Calculează progresul total
    let totalExercises = 0;
    let completedExercises = 0;

    for (const categorie in progresFirestore) {
        const exercises = progresFirestore[categorie];
        totalExercises += Object.keys(exercises).length;
        completedExercises += Object.values(exercises).filter(value => value === true).length;
    }

    const totalProgress = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;
    return totalProgress;
}

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

            loadCheckboxState(exerciseKey.split(/[0-9]/)[0]);

            checkbox.addEventListener("change", () => {
                console.log("Checkbox schimbat:", checkbox.dataset.exercise, checkbox.checked);
                saveProgress(checkbox, checkbox.dataset.exercise, exerciseKey.split(/[0-9]/)[0]);
            });
        });
    });

    closeButton.addEventListener("click", () => {
        detailsSection.classList.add("hidden");
        videoElement.src = "";
    });

    updateProgressDisplay();
});
