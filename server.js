const express = require("express");
const https = require("https");
const fs = require("fs");

const app = express();
app.use(express.json());

// ✅ Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});

app.get("/scb/kategorier", (req, res) => {
  try {
    const pfx = fs.readFileSync("./cert.pfx");

    const options = {
      hostname: "privateapi.scb.se",
      port: 443,
      path: "/nv0101/v1/sokpavar/api/je/koptakategorier",
      method: "GET",
      pfx: pfx,
      passphrase: process.env.SCB_CERT_PASSWORD
    };

    const request = https.request(options, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        console.log("📥 SCB response:", data);
        res.send(data);
      });
    });

    request.on("error", (error) => {
      console.error("❌ HTTPS ERROR:", error);
      res.status(500).json({ error: error.message });
    });

    request.end();

  } catch (err) {
    console.error("❌ SERVER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🔥 SCB – Variabler
app.get("/scb/variabler", async (req, res) => {
  try {
    const pfx = fs.readFileSync("./cert.pfx");

    const agent = new https.Agent({
      pfx,
      passphrase: process.env.SCB_CERT_PASSWORD
    });

    const response = await fetch(
      "https://privateapi.scb.se/nv0101/v1/sokpavar/api/je/koptavariabler",
      { agent }
    );

    const data = await response.text();

    console.log("📥 variabler:", data);

    res.send(data);

  } catch (err) {
    console.error("❌ variabler error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🔥 SCB – Companies (DEBUG)
app.post("/scb/companies", async (req, res) => {
  try {
    const pfx = fs.readFileSync("./cert.pfx");

    const agent = new https.Agent({
      pfx,
      passphrase: process.env.SCB_CERT_PASSWORD
    });

    const payload = req.body || {};

    console.log("📤 payload:", JSON.stringify(payload, null, 2));

    const response = await fetch(
      "https://privateapi.scb.se/nv0101/v1/sokpavar/api/je/hamtaforetag",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
        agent
      }
    );

    const text = await response.text();

    console.log("📥 SCB response:", text);
    console.log("📊 status:", response.status);

    res.status(response.status).send({
      status: response.status,
      raw: text
    });

  } catch (err) {
    console.error("❌ SCB error:", err);

    res.status(500).json({
      error: "SCB fetch failed",
      details: err.message
    });
  }
});

// 🚀 Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
