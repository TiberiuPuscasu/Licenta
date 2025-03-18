import { auth } from "./firebase-config.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const db = getFirestore();
let userId = null;

// Verifică utilizatorul autentificat
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "../login.html";
    } else {
        userId = user.uid;
        loadProgress();
    }
});

// Funcție pentru încărcarea progresului din Firebase
async function loadProgress() {
    if (!userId) return;
    const docRef = doc(db, "progres", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        const currentPage = window.location.pathname.split("/").pop().replace(".html", "");
        document.getElementById("progres").value = data[currentPage] || 0;
    }
}

// Salvarea progresului în Firebase
document.getElementById("save-progress").addEventListener("click", async () => {
    if (!userId) return;
    const progresValue = document.getElementById("progres").value;
    const currentPage = window.location.pathname.split("/").pop().replace(".html", "");

    await setDoc(doc(db, "progres", userId), { [currentPage]: progresValue }, { merge: true });
    alert("Progres salvat!");
});

// Buton pentru revenirea la Dashboard
document.getElementById("back").addEventListener("click", () => {
    window.location.href = "../dashboard.html";
});
