const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve static files (VERY IMPORTANT)
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/properties", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "properties.html"));
});

app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "contact.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});