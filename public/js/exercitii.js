import { db } from "./firebase-config.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

const auth = getAuth();

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

    updateProgressDisplay(); // 👉 Afișează progresul TOTAL
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

    updateProgressDisplay(); // 👉 Afișează progresul TOTAL

    return progresCategorie;
}

// ✅ Afișează progresul total exact ca în dashboard
function updateProgressDisplay() {
    calculateTotalProgress().then((total) => {
        const display = document.getElementById("progress-percentage");
        if (display) {
            display.textContent = `${total}%`;
        }
    });
}

// Calcularea progresului total pentru dashboard și paginile individuale
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

    for (const categorie in progresFirestore) {
        const exercises = progresFirestore[categorie];
        totalExercises += Object.keys(exercises).length;
        completedExercises += Object.values(exercises).filter(val => val === true).length;
    }

    return totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;
}
