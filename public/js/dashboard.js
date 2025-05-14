import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

import { db } from "./firebase-config.js";

// ===================== INIT =====================
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
      const completed = exercises.filter(ex => progres[ex]).length;
      const percent = Math.round((completed / exercises.length) * 100);

      const el = document.getElementById(`progress-${category}`);
      if (el) el.value = percent;
    });
  }

  updateDashboardProgress();

  // ===================== AI Q&A =====================
  const questionInput = document.getElementById("ai-question");
  const answerEl = document.getElementById("ai-answer");
  const submitBtn = document.getElementById("ai-submit");

  if (submitBtn && questionInput && answerEl) {
    submitBtn.addEventListener("click", async () => {
      const question = questionInput.value.trim();
      if (!question) return;

      answerEl.textContent = "⏳ Se încarcă răspunsul...";
      answerEl.classList.remove("hidden");

      try {
        const response = await fetch("http://localhost:3000/api/ai-qa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question })
        });

        const data = await response.json();
        answerEl.textContent = data.answer || "❌ Nu am găsit un răspuns.";
      } catch (error) {
        answerEl.textContent = "⚠️ Eroare la server sau AI.";
      }
    });
  }

  // ===================== MENIU BURGER =====================
  const toggleBtn = document.getElementById("menu-toggle");
  const menu = document.getElementById("slide-menu");
  const closeBtn = document.getElementById("menu-close");

  toggleBtn.addEventListener("click", () => {
    menu.classList.add("visible");
  });

  closeBtn.addEventListener("click", () => {
    menu.classList.remove("visible");
  });

 // ===================== RESET PROGRES =====================
const auth = getAuth();

async function stergeExercitii(categorie = null) {
  const user = auth.currentUser;
  if (!user) return;

  const confirmare = confirm(categorie
    ? `Ești sigur că vrei să ștergi toate exercițiile din categoria "${categorie}"?`
    : "Ești sigur că vrei să resetezi TOT progresul?");
  if (!confirmare) return;

  const progresRef = doc(db, "progres", user.uid);
  const snapshot = await getDoc(progresRef);

  if (!snapshot.exists()) {
    alert("Nu există progres de șters!");
    return;
  }

  const data = snapshot.data();

  if (categorie) {
    const updatedCategory = {};
    categories[categorie].forEach(ex => {
      updatedCategory[ex] = false;
    });

    await updateDoc(progresRef, {
      [categorie]: updatedCategory
    });
  } else {
    const resetData = {};
    Object.keys(categories).forEach(cat => {
      resetData[cat] = {};
      categories[cat].forEach(ex => {
        resetData[cat][ex] = false;
      });
    });

    await updateDoc(progresRef, resetData);
  }

  let progres = JSON.parse(localStorage.getItem("progres")) || {};
  if (categorie) {
    categories[categorie].forEach(ex => {
      delete progres[ex];
    });
  } else {
    progres = {};
  }

  localStorage.setItem("progres", JSON.stringify(progres));
  updateDashboardProgress();

  if (categorie) {
    categories[categorie].forEach(ex => {
      const checkbox = document.getElementById(ex);
      if (checkbox) checkbox.checked = false;
    });
  } else {
    Object.values(categories).flat().forEach(ex => {
      const checkbox = document.getElementById(ex);
      if (checkbox) checkbox.checked = false;
    });
  }

  alert("✔️ Progres șters cu succes!");
}

document.getElementById("reset-all")?.addEventListener("click", () => stergeExercitii());
document.getElementById("reset-dribling")?.addEventListener("click", () => stergeExercitii("dribling"));
document.getElementById("reset-aruncari")?.addEventListener("click", () => stergeExercitii("aruncari"));
document.getElementById("reset-aparare")?.addEventListener("click", () => stergeExercitii("aparare"));
document.getElementById("reset-conditie")?.addEventListener("click", () => stergeExercitii("conditie"));

});

// ===================== INVITE LINK =====================
function copyInviteLink() {
  const link = window.location.origin;
  navigator.clipboard.writeText(link);
  alert("🔗 Link-ul a fost copiat în clipboard!");
}

