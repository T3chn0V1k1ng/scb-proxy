const express = require("express");

const app = express();
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});

// Root
app.get("/", (req, res) => {
  res.send("SCB Proxy is running 🚀");
});

// 🔥 SCB ROUTE (nu korrekt)
app.post("/scb/companies", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.scb.se/OV0104/v1/doris/en/ssd/BE/BE0101/BE0101A/Foretagsregister"
    );

    const data = await response.json();

    res.json({
      success: true,
      source: "SCB",
      data: data
    });

  } catch (err) {
    console.error("SCB error:", err);
    res.status(500).json({ error: "SCB fetch failed" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
