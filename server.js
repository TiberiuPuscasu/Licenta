const express = require("express");
const cors = require("cors");
const path = require("path");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

console.log("🔑 OpenRouter KEY:", process.env.OPENROUTER_API_KEY);

// ✅ Endpoint AI - întrebare și răspuns
app.post("/api/ai-qa", async (req, res) => {
  const { question } = req.body;
  console.log("➡️ Întrebare primită:", question);

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo", // Poți schimba cu altul (ex: anthropic/claude-2)
        messages: [
          {
            role: "system",
            content: "Ești un antrenor prietenos care răspunde la întrebări despre exerciții de baschet, fitness și sănătate.",
          },
          {
            role: "user",
            content: question,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000", // Înlocuiește cu domeniul tău real dacă e cazul
          "X-Title": "Baschet AI Assistant",
        },
      }
    );

    const answer = response.data.choices[0].message.content;
    console.log("✅ Răspuns AI:", answer);
    res.json({ answer });
  } catch (err) {
    console.error("❌ Eroare AI:", err.message);
    res.status(500).json({ error: "AI error" });
  }
});

// ✅ Frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/login.html"));
});
app.use(express.static("public"));

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
