const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());

// ==========================
// SERVE FRONTEND
// ==========================
app.use(express.static(path.join(__dirname, "../public")));

// ==========================
// LOAD DATA
// ==========================
const dataPath = path.join(__dirname, "data", "properties.json");
const properties = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

// ==========================
// API ROUTES
// ==========================
app.get("/api/properties", (req, res) => {
  res.json(properties);
});

app.get("/api/properties/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const property = properties.find(p => p.id === id);

  if (property) {
    res.json(property);
  } else {
    res.status(404).json({ message: "Property not found" });
  }
});

// ==========================
// HOMEPAGE ROUTE
// ==========================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

// ==========================
// START SERVER
// ==========================
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on http://localhost:${PORT}`);
});