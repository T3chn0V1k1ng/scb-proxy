app.get("/scb/kategorier", async (req, res) => {
  try {
    const pfx = fs.readFileSync("./cert.pfx");

    const agent = new https.Agent({
      pfx,
      passphrase: process.env.SCB_CERT_PASSWORD
    });

    const response = await fetch(
      "https://privateapi.scb.se/nv0101/v1/sokpavar/api/je/koptakategorier",
      { agent }
    );

    const data = await response.text();

    res.send(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
