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

// 🔥 SCB DATA (KORREKT POST)
app.post("/scb/companies", async (req, res) => {
  try {
    const payload = {
      query: [
        {
          code: "Region",
          selection: {
            filter: "all",
            values: ["*"]
          }
        },
        {
          code: "Tid",
          selection: {
            filter: "top",
            values: ["1"] // senaste året
          }
        }
      ],
      response: {
        format: "json"
      }
    };

    console.log("📤 Payload:", JSON.stringify(payload));

    const response = await fetch(
      "https://api.scb.se/OV0104/v1/doris/en/ssd/NV/NV0109/NV0109A/ForetagsregisterSNI2007",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    const text = await response.text();
    console.log("📥 SCB raw:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(500).json({
        error: "SCB returned non-JSON",
        raw: text
      });
    }

    res.json({
      success: true,
      data: data
    });

  } catch (err) {
    console.error("SCB error:", err);
    res.status(500).json({
      error: "SCB fetch failed",
      details: err.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
