const express = require("express");

const app = express();
app.use(express.json());

// ✅ Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});

// root
app.get("/", (req, res) => {
  res.send("Proxy is alive 🚀");
});

// 🔥 Debug route
app.post("/scb/companies", (req, res) => {
  console.log("Incoming request:", req.body);

  res.json({
    success: true,
    path: "companies",
    received: req.body
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
