const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Definește ruta principală înainte de express.static
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/login.html");
});

app.use(express.static("public"));

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
