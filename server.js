const express = require("express");

const app = express();
const PORT = 3000;

// Basic route
app.get("/", (req, res) => {
  res.send("Luxury Real Estate Platform is live 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});