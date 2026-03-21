const express = require("express");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("SCB Proxy is running 🚀");
});

// 🔥 DYNAMISK ROUTE
app.post("/scb/*", async (req, res) => {
  try {
    const path = req.params[0]; // fångar "companies"

    res.json({
      success: true,
      path: path,
      message: "Dynamic proxy works",
      received: req.body
    });

  } catch (err) {
    res.status(500).json({ error: "Proxy failed" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
