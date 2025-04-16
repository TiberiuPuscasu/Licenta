import { db } from "./firebase-config.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

const auth = getAuth();

// ✅ Definim câte exerciții sunt în fiecare categorie
const TOTAL_EXERCISES_PER_CATEGORY = {
    dribling: 3,
    aruncari: 3,
    aparare: 3,
    conditie: 3
};

// Salvarea progresului utilizatorului
export async function saveProgress(checkbox, exerciseKey, categorie) {
    const user = auth.currentUser;
    if (!user) {
        console.error("Utilizatorul nu este autentificat!");
        return;
    }

    const userUID = user.uid;
    const progresRef = doc(db, "progres", userUID);

    const progresSnapshot = await getDoc(progresRef);
    let progresFirestore = progresSnapshot.exists() ? progresSnapshot.data() : {};

    if (typeof progresFirestore[categorie] !== "object" || progresFirestore[categorie] === null) {
        progresFirestore[categorie] = {};
    }

    progresFirestore[categorie][exerciseKey] = checkbox.checked;

    await setDoc(progresRef, progresFirestore);
    console.log(`✅ Progres salvat: ${categorie}/${exerciseKey} = ${checkbox.checked}`);

    updateProgressDisplay(); // Actualizează procentul
}

// Încărcarea progresului și bifarea checkbox-urilor
export async function loadCheckboxState(categorie) {
    const user = auth.currentUser;
    if (!user) return {};

    const userUID = user.uid;
    const progresRef = doc(db, "progres", userUID);
    const progresSnapshot = await getDoc(progresRef);
    const progresFirestore = progresSnapshot.exists() ? progresSnapshot.data() : {};

    const progresCategorie = progresFirestore[categorie] || {};

    const checkboxes = document.querySelectorAll(`input[type='checkbox'][id^='${categorie}']`);
    checkboxes.forEach((checkbox) => {
        checkbox.checked = progresCategorie[checkbox.id] || false;
        checkbox.addEventListener("change", () => {
            saveProgress(checkbox, checkbox.id, categorie);
        });
    });

    updateProgressDisplay(); // Actualizează procentul
    return progresCategorie;
}

// Afișarea progresului într-un element cu id "progress-percentage"
function updateProgressDisplay() {
    calculateTotalProgress().then((total) => {
        const display = document.getElementById("progress-percentage");
        if (display) {
            display.textContent = `${total}%`;
        }
    });
}

// ✅ Calculare corectă a progresului total, chiar și pentru useri noi
export async function calculateTotalProgress() {
    const user = auth.currentUser;
    if (!user) {
        console.error("Utilizatorul nu este autentificat!");
        return 0;
    }

    const userUID = user.uid;
    const progresRef = doc(db, "progres", userUID);
    const progresSnapshot = await getDoc(progresRef);
    const progresFirestore = progresSnapshot.exists() ? progresSnapshot.data() : {};

    let totalExercises = 0;
    let completedExercises = 0;

    for (const categorie in TOTAL_EXERCISES_PER_CATEGORY) {
        const expectedTotal = TOTAL_EXERCISES_PER_CATEGORY[categorie];
        const userProgress = progresFirestore[categorie] || {};
        const completate = Object.values(userProgress).filter(val => val === true).length;

        totalExercises += expectedTotal;
        completedExercises += completate;
    }

    return totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;
}
