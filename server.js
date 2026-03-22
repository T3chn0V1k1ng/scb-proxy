const express = require("express");
const https = require("https");
const fs = require("fs");

const app = express();
app.use(express.json());

// ✅ Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});

// ✅ Root
app.get("/", (req, res) => {
  res.send("SCB Proxy running 🚀");
});

// 🔥 SCB – Kategorier (mTLS)
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
        console.log("📥 kategorier:", data);
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

// 🔥 SCB – Variabler (mTLS via https.request)
app.get("/scb/variabler", (req, res) => {
  try {
    const pfx = fs.readFileSync("./cert.pfx");

    const options = {
      hostname: "privateapi.scb.se",
      port: 443,
      path: "/nv0101/v1/sokpavar/api/je/koptavariabler",
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
        console.log("📥 variabler:", data);
        res.send(data);
      });
    });

    request.on("error", (error) => {
      console.error("❌ variabler error:", error);
      res.status(500).json({ error: error.message });
    });

    request.end();

  } catch (err) {
    console.error("❌ server error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🔥 SCB – Räkna företag (STEGET FÖRE HAMTA)
app.post("/scb/rakna", (req, res) => {
  try {
    const pfx = fs.readFileSync("./cert.pfx");

    const options = {
      hostname: "privateapi.scb.se",
      port: 443,
      path: "/nv0101/v1/sokpavar/api/je/raknaforetag",
      method: "POST",
      pfx: pfx,
      passphrase: process.env.SCB_CERT_PASSWORD,
      headers: {
        "Content-Type": "application/json"
      }
    };

    const request = https.request(options, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        console.log("📥 rakna:", data);
        res.send(data);
      });
    });

    request.on("error", (error) => {
      console.error("❌ rakna error:", error);
      res.status(500).json({ error: error.message });
    });

    request.write(JSON.stringify(req.body));
    request.end();

  } catch (err) {
    console.error("❌ server error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🔥 SCB – Hämta företag
app.post("/scb/companies", (req, res) => {
  try {
    const pfx = fs.readFileSync("./cert.pfx");

    const options = {
      hostname: "privateapi.scb.se",
      port: 443,
      path: "/nv0101/v1/sokpavar/api/je/hamtaforetag",
      method: "POST",
      pfx: pfx,
      passphrase: process.env.SCB_CERT_PASSWORD,
      headers: {
        "Content-Type": "application/json"
      }
    };

    const request = https.request(options, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        console.log("📥 companies:", data);
        res.send(data);
      });
    });

    request.on("error", (error) => {
      console.error("❌ companies error:", error);
      res.status(500).json({ error: error.message });
    });

    request.write(JSON.stringify(req.body));
    request.end();

  } catch (err) {
    console.error("❌ server error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🚀 Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
