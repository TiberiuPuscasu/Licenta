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

  // ✅ Logica pentru AI Q&A
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
});
